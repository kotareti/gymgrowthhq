/* =========================================================
   GYM GROWTH HQ
   FINAL SCRIPT.JS
   ORDER SYSTEM + CREATIVE BRIEF + VIDEO UPLOAD
   + SUPABASE + ORDER HISTORY + VIDEO DELIVERY
   ========================================================= */

const USERS_KEY = "gghq_users";
const SESSION_KEY = "gghq_session";
const ORDERS_KEY = "gghq_orders";

const SUPABASE_URL =
    "https://gcxsdpjkzrxmgbhcoeqn.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_Pcj2mwFWysWV2sQHwjAm_Q_qtv0I5hS";


let currentUser = null;
let currentOrderId = null;

let currentOrder = {
    service: "",
    plan: "",
    clientName: "",
    gymName: "",
    instagram: "",
    goal: "",
    notes: "",
    instructions: "",

    creativeBrief: {
        trend: "",
        song: "",
        editingStyle: "",
        shotInstructions: "",
        hook: "",
        cta: "",
        specialInstructions: ""
    },

    videos: []
};


/* =========================================================
   SELECTED VIDEO FILES
   ========================================================= */

window.GGHQ_SELECTED_VIDEO_FILES =
    window.GGHQ_SELECTED_VIDEO_FILES || [];


/* =========================================================
   BASIC HELPERS
   ========================================================= */

function createEmptyCreativeBrief() {
    return {
        trend: "",
        song: "",
        editingStyle: "",
        shotInstructions: "",
        hook: "",
        cta: "",
        specialInstructions: ""
    };
}


function getInitial(name) {
    if (!name) return "?";

    return String(name)
        .trim()
        .charAt(0)
        .toUpperCase();
}


function setText(id, value) {
    const element =
        document.getElementById(id);

    if (!element) return;

    element.textContent =
        value || "—";
}


function escapeHTML(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function showToast(
    message,
    icon = "✓"
) {
    const toast =
        document.getElementById("toast");

    const text =
        document.getElementById(
            "toastMessage"
        );

    const iconElement =
        document.getElementById(
            "toastIcon"
        );

    if (text) {
        text.textContent = message;
    }

    if (iconElement) {
        iconElement.textContent = icon;
    }

    if (!toast) {
        alert(message);
        return;
    }

    toast.classList.add("show");
    toast.setAttribute(
        "aria-hidden",
        "false"
    );

    clearTimeout(
        window.GGHQ_TOAST_TIMER
    );

    window.GGHQ_TOAST_TIMER =
        setTimeout(() => {
            toast.classList.remove(
                "show"
            );

            toast.setAttribute(
                "aria-hidden",
                "true"
            );
        }, 2500);
}


/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function getUsers() {
    try {
        return JSON.parse(
            localStorage.getItem(
                USERS_KEY
            )
        ) || [];
    } catch {
        return [];
    }
}


function saveUsers(users) {
    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );
}


function getOrders() {
    try {
        return JSON.parse(
            localStorage.getItem(
                ORDERS_KEY
            )
        ) || [];
    } catch {
        return [];
    }
}


function saveOrders(orders) {
    localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify(orders)
    );
}


function saveSession(user) {
    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(user)
    );
}


function getSession() {
    try {
        return JSON.parse(
            localStorage.getItem(
                SESSION_KEY
            )
        );
    } catch {
        return null;
    }
}


function clearSession() {
    localStorage.removeItem(
        SESSION_KEY
    );
}


/* =========================================================
   SESSION
   ========================================================= */

function isLoggedIn() {
    return !!currentUser;
}


function restoreSession() {

    const session =
        getSession();

    if (!session) {
        currentUser = null;
        updateAccountUI();
        return;
    }

    const users =
        getUsers();

    const user =
        users.find(
            item =>
                item.id === session.id &&
                item.email === session.email
        );

    if (!user) {

        clearSession();

        currentUser = null;

        updateAccountUI();

        return;
    }

    currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        gymName: user.gymName || "",
        instagram: user.instagram || ""
    };

    updateAccountUI();
}


/* =========================================================
   SCREEN NAVIGATION
   ========================================================= */

function showScreen(id) {

    document
        .querySelectorAll(".app-screen")
        .forEach(screen => {

            screen.classList.remove(
                "active-screen"
            );

        });

    const screen =
        document.getElementById(id);

    if (!screen) {
        console.warn(
            "Screen not found:",
            id
        );
        return;
    }

    screen.classList.add(
        "active-screen"
    );

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    updateAccountUI();


    if (id === "orders") {
        renderOrders();
    }


    if (id === "order-review") {
        saveCreativeBrief();
        updateReview();
    }


    if (id === "order-project") {

        ensureCreativeBriefFields();

        setTimeout(() => {
            restoreCreativeBriefFields();
        }, 50);

    }


    if (id === "order-details") {

        const order =
            findCurrentOrder();

        if (order) {
            renderOrderDetails(order);
        }

    }


    if (id === "video-delivery") {

        const order =
            findCurrentOrder();

        if (order) {
            renderVideoDelivery(order);
        }

    }
}


/* =========================================================
   ACCOUNT UI
   ========================================================= */

function updateAccountUI() {

    const headerButton =
        document.getElementById(
            "accountHeaderButton"
        );

    const headerInitial =
        document.getElementById(
            "headerAccountInitial"
        );

    const headerName =
        document.getElementById(
            "headerAccountName"
        );

    const homeCard =
        document.getElementById(
            "loggedInHomeCard"
        );

    const homeButton =
        document.getElementById(
            "homeAccountButton"
        );

    const homeInitial =
        document.getElementById(
            "homeAccountInitial"
        );

    const homeName =
        document.getElementById(
            "homeAccountName"
        );

    const homeEmail =
        document.getElementById(
            "homeAccountEmail"
        );

    const accountInitial =
        document.getElementById(
            "accountInitial"
        );

    const accountName =
        document.getElementById(
            "accountName"
        );

    const accountEmail =
        document.getElementById(
            "accountEmail"
        );


    if (currentUser) {

        const initial =
            getInitial(
                currentUser.name
            );


        if (headerButton) {
            headerButton.style.display =
                "flex";
        }

        if (headerInitial) {
            headerInitial.textContent =
                initial;
        }

        if (headerName) {
            headerName.textContent =
                currentUser.name;
        }


        if (homeCard) {
            homeCard.style.display =
                "flex";
        }

        if (homeButton) {
            homeButton.style.display =
                "none";
        }

        if (homeInitial) {
            homeInitial.textContent =
                initial;
        }

        if (homeName) {
            homeName.textContent =
                currentUser.name;
        }

        if (homeEmail) {
            homeEmail.textContent =
                currentUser.email;
        }


        if (accountInitial) {
            accountInitial.textContent =
                initial;
        }

        if (accountName) {
            accountName.textContent =
                currentUser.name;
        }

        if (accountEmail) {
            accountEmail.textContent =
                currentUser.email;
        }

    } else {

        if (headerButton) {
            headerButton.style.display =
                "none";
        }

        if (homeCard) {
            homeCard.style.display =
                "none";
        }

        if (homeButton) {
            homeButton.style.display =
                "flex";
        }
    }
}


/* =========================================================
   CLIENT PROFILE
   ========================================================= */

function saveClientProfile() {

    if (!currentUser) return;

    const users =
        getUsers();

    const index =
        users.findIndex(
            user =>
                user.id ===
                currentUser.id
        );

    if (index === -1) return;

    const user =
        users[index];

    user.name =
        currentOrder.clientName ||
        user.name;

    user.gymName =
        currentOrder.gymName ||
        user.gymName ||
        "";

    user.instagram =
        currentOrder.instagram ||
        user.instagram ||
        "";

    users[index] =
        user;

    saveUsers(users);

    currentUser.name =
        user.name;

    currentUser.gymName =
        user.gymName;

    currentUser.instagram =
        user.instagram;

    saveSession(currentUser);

    updateAccountUI();
}


function fillClientDetails() {

    if (!currentUser) return;

    const name =
        document.getElementById(
            "clientName"
        );

    const gym =
        document.getElementById(
            "gymName"
        );

    const instagram =
        document.getElementById(
            "instagramHandle"
        );

    if (name) {
        name.value =
            currentUser.name || "";
    }

    if (gym) {
        gym.value =
            currentUser.gymName || "";
    }

    if (instagram) {
        instagram.value =
            currentUser.instagram || "";
    }
}


/* =========================================================
   START ORDER
   ========================================================= */

function startOrder() {

    if (!currentUser) {
        showScreen("login");
        return;
    }

    clearAllSelectedVideos();

    currentOrder = {
        service: "",
        plan: "",
        clientName:
            currentUser.name || "",
        gymName:
            currentUser.gymName || "",
        instagram:
            currentUser.instagram || "",
        goal: "",
        notes: "",
        instructions: "",
        creativeBrief:
            createEmptyCreativeBrief(),
        videos: []
    };

    fillClientDetails();

    showScreen("order");
}


/* =========================================================
   LOGIN
   ========================================================= */

function loginUser() {

    const emailInput =
        document.getElementById(
            "loginEmail"
        );

    const passwordInput =
        document.getElementById(
            "loginPassword"
        );

    if (!emailInput || !passwordInput) {
        return;
    }

    const email =
        emailInput.value
            .trim()
            .toLowerCase();

    const password =
        passwordInput.value;

    if (!email || !password) {

        showToast(
            "Enter email and password",
            "!"
        );

        return;
    }

    const users =
        getUsers();

    const user =
        users.find(
            item =>
                item.email === email
        );

    if (!user) {

        showToast(
            "Account not found",
            "!"
        );

        return;
    }

    if (user.password !== password) {

        showToast(
            "Wrong password",
            "!"
        );

        return;
    }

    currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        gymName:
            user.gymName || "",
        instagram:
            user.instagram || ""
    };

    saveSession(currentUser);

    updateAccountUI();

    fillClientDetails();

    emailInput.value = "";
    passwordInput.value = "";

    showToast(
        "Login successful",
        "✓"
    );

    showScreen("order");
}


/* =========================================================
   CREATE ACCOUNT
   ========================================================= */

function createAccount() {

    const nameInput =
        document.getElementById(
            "signupName"
        );

    const emailInput =
        document.getElementById(
            "signupEmail"
        );

    const passwordInput =
        document.getElementById(
            "signupPassword"
        );

    if (
        !nameInput ||
        !emailInput ||
        !passwordInput
    ) {
        return;
    }

    const name =
        nameInput.value.trim();

    const email =
        emailInput.value
            .trim()
            .toLowerCase();

    const password =
        passwordInput.value;

    if (
        !name ||
        !email ||
        !password
    ) {

        showToast(
            "Please fill all details",
            "!"
        );

        return;
    }

    if (password.length < 6) {

        showToast(
            "Password must be at least 6 characters",
            "!"
        );

        return;
    }

    const users =
        getUsers();

    if (
        users.some(
            user =>
                user.email === email
        )
    ) {

        showToast(
            "Email already registered",
            "!"
        );

        return;
    }

    const newUser = {

        id:
            "USER-" +
            Date.now(),

        name:
            name,

        email:
            email,

        password:
            password,

        gymName:
            "",

        instagram:
            "",

        createdAt:
            new Date().toISOString()
    };

    users.push(newUser);

    saveUsers(users);

    currentUser = {

        id:
            newUser.id,

        name:
            newUser.name,

        email:
            newUser.email,

        gymName:
            "",

        instagram:
            ""
    };

    saveSession(currentUser);

    nameInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";

    updateAccountUI();

    fillClientDetails();

    showToast(
        "Account created",
        "✓"
    );

    showScreen("order");
}


/* =========================================================
   LOGOUT
   ========================================================= */

function logoutUser() {

    currentUser = null;

    clearSession();

    clearAllSelectedVideos();

    currentOrder = {
        service: "",
        plan: "",
        clientName: "",
        gymName: "",
        instagram: "",
        goal: "",
        notes: "",
        instructions: "",
        creativeBrief:
            createEmptyCreativeBrief(),
        videos: []
    };

    currentOrderId = null;

    updateAccountUI();

    showToast(
        "Logged out",
        "✓"
    );

    showScreen("home");
}


/* =========================================================
   SERVICE SELECTION
   ========================================================= */

function selectService(service) {

    const allowed = [
        "reel-editing",
        "transformation",
        "gym-promotion"
    ];

    if (!allowed.includes(service)) {
        return;
    }

    currentOrder.service =
        service;

    currentOrder.plan =
        "";

    if (
        service ===
        "reel-editing"
    ) {

        showScreen(
            "plan-reel-editing"
        );

        return;
    }

    if (
        service ===
        "transformation"
    ) {

        showScreen(
            "plan-transformation"
        );

        return;
    }

    if (
        service ===
        "gym-promotion"
    ) {

        showScreen(
            "plan-gym-promotion"
        );

        return;
    }
}


/* =========================================================
   PLAN SELECTION
   ========================================================= */

function selectPlan(
    service,
    plan = "standard"
) {

    const allowed = [
        "reel-editing",
        "transformation",
        "gym-promotion"
    ];

    if (!allowed.includes(service)) {
        return;
    }

    currentOrder.service =
        service;

    currentOrder.plan =
        plan;

    if (!currentUser) {
        showScreen("login");
        return;
    }

    fillClientDetails();

    showScreen("order");
}


/* =========================================================
   ORDER STEP ONE
   ========================================================= */

function saveStepOne() {

    const name =
        document.getElementById(
            "clientName"
        );

    const gym =
        document.getElementById(
            "gymName"
        );

    const instagram =
        document.getElementById(
            "instagramHandle"
        );

    if (!name || !gym) {
        return false;
    }

    currentOrder.clientName =
        name.value.trim();

    currentOrder.gymName =
        gym.value.trim();

    currentOrder.instagram =
        instagram
            ? instagram.value.trim()
            : "";

    if (
        !currentOrder.clientName ||
        !currentOrder.gymName
    ) {
        return false;
    }

    if (currentUser) {
        saveClientProfile();
    }

    return true;
}


/* =========================================================
   CREATIVE BRIEF
   ========================================================= */

function ensureCreativeBriefFields() {

    const screen =
        document.getElementById(
            "order-project"
        );

    if (!screen) return;

    let wrapper =
        document.getElementById(
            "gghqCreativeBrief"
        );

    if (wrapper) {
        restoreCreativeBriefFields();
        return;
    }

    wrapper =
        document.createElement(
            "div"
        );

    wrapper.id =
        "gghqCreativeBrief";

    wrapper.style.cssText = `
        margin-top:24px;
        padding:18px;
        border-radius:18px;
        background:rgba(145,92,255,0.07);
        border:1px solid rgba(145,92,255,0.30);
    `;

    wrapper.innerHTML = `

        <h3 style="
            margin:0 0 8px;
            color:#ffffff;
            font-size:18px;
        ">
            🎬 Creative Brief
        </h3>

        <p style="
            margin:0 0 18px;
            color:#8f8f9d;
            font-size:13px;
            line-height:1.5;
        ">
            Tell us exactly how you want your video edited.
        </p>

        <input
            id="gghqTrend"
            type="text"
            placeholder="🔥 Trend / Reference"
            style="width:100%;margin-bottom:12px;"
        >

        <input
            id="gghqSong"
            type="text"
            placeholder="🎵 Song / Audio"
            style="width:100%;margin-bottom:12px;"
        >

        <input
            id="gghqEditingStyle"
            type="text"
            placeholder="🎨 Editing Style"
            style="width:100%;margin-bottom:12px;"
        >

        <textarea
            id="gghqShotInstructions"
            placeholder="🎥 How should the video be edited? Explain shots, cuts, transitions, timing..."
            rows="4"
            style="width:100%;margin-bottom:12px;"
        ></textarea>

        <input
            id="gghqHook"
            type="text"
            placeholder="✍️ Hook / On-screen Text"
            style="width:100%;margin-bottom:12px;"
        >

        <input
            id="gghqCTA"
            type="text"
            placeholder="📢 CTA"
            style="width:100%;margin-bottom:12px;"
        >

        <textarea
            id="gghqSpecialInstructions"
            placeholder="📝 Special Instructions"
            rows="4"
            style="width:100%;"
        ></textarea>
    `;

    const nextButton =
        screen.querySelector(
            '[data-order-next="3"]'
        );

    if (nextButton) {

        nextButton.parentNode.insertBefore(
            wrapper,
            nextButton
        );

    } else {

        screen.appendChild(wrapper);
    }

    restoreCreativeBriefFields();
}


function saveCreativeBrief() {

    currentOrder.creativeBrief = {

        trend:
            document
                .getElementById(
                    "gghqTrend"
                )
                ?.value
                .trim() || "",

        song:
            document
                .getElementById(
                    "gghqSong"
                )
                ?.value
                .trim() || "",

        editingStyle:
            document
                .getElementById(
                    "gghqEditingStyle"
                )
                ?.value
                .trim() || "",

        shotInstructions:
            document
                .getElementById(
                    "gghqShotInstructions"
                )
                ?.value
                .trim() || "",

        hook:
            document
                .getElementById(
                    "gghqHook"
                )
                ?.value
                .trim() || "",

        cta:
            document
                .getElementById(
                    "gghqCTA"
                )
                ?.value
                .trim() || "",

        specialInstructions:
            document
                .getElementById(
                    "gghqSpecialInstructions"
                )
                ?.value
                .trim() || ""
    };
}


function restoreCreativeBriefFields() {

    const brief =
        currentOrder.creativeBrief ||
        createEmptyCreativeBrief();

    const fields = {

        gghqTrend:
            brief.trend || "",

        gghqSong:
            brief.song || "",

        gghqEditingStyle:
            brief.editingStyle || "",

        gghqShotInstructions:
            brief.shotInstructions || "",

        gghqHook:
            brief.hook || "",

        gghqCTA:
            brief.cta || "",

        gghqSpecialInstructions:
            brief.specialInstructions || ""
    };

    Object.entries(fields)
        .forEach(
            ([id, value]) => {

                const element =
                    document.getElementById(
                        id
                    );

                if (element) {
                    element.value =
                        value;
                }
            }
        );
}


/* =========================================================
   ORDER NAVIGATION
   ========================================================= */

function goOrderNext(step) {

    if (step === 2) {

        if (!saveStepOne()) {

            showToast(
                "Please enter your name and gym name",
                "!"
            );

            return;
        }

        showScreen(
            "order-project"
        );

        return;
    }


    if (step === 3) {

        const goal =
            document.getElementById(
                "projectGoal"
            );

        const notes =
            document.getElementById(
                "projectNotes"
            );

        currentOrder.goal =
            goal
                ? goal.value.trim()
                : "";

        currentOrder.notes =
            notes
                ? notes.value.trim()
                : "";

        saveCreativeBrief();

        showScreen(
            "order-upload"
        );

        return;
    }


    if (step === 4) {

        showScreen(
            "order-instructions"
        );

        return;
    }


    if (step === 5) {

        const instructions =
            document.getElementById(
                "specialInstructions"
            );

        currentOrder.instructions =
            instructions
                ? instructions.value.trim()
                : "";

        saveCreativeBrief();

        updateReview();

        showScreen(
            "order-review"
        );

        return;
    }
}


function goOrderBack(step) {

    if (step === 1) {
        showScreen("order");
    }

    if (step === 2) {
        showScreen("order-project");
    }

    if (step === 3) {
        showScreen("order-upload");
    }

    if (step === 4) {
        showScreen("order-instructions");
    }
}


/* =========================================================
   VIDEO FILE HELPERS
   ========================================================= */

function formatVideoSize(bytes) {

    if (!bytes) return "";

    const mb =
        bytes /
        (1024 * 1024);

    if (mb < 1) {

        return Math.round(
            bytes / 1024
        ) + " KB";
    }

    return mb.toFixed(1) +
        " MB";
}


function clearAllSelectedVideos() {

    window.GGHQ_SELECTED_VIDEO_FILES =
        [];

    const input =
        document.getElementById(
            "videoFiles"
        );

    if (input) {
        input.value = "";
    }

    const container =
        document.getElementById(
            "selectedFiles"
        );

    if (container) {
        container.innerHTML = "";
    }

    currentOrder.videos =
        [];
}


function handleVideoSelection(
    fileList
) {

    const newFiles =
        Array.from(
            fileList || []
        );

    if (!newFiles.length) {
        return;
    }

    newFiles.forEach(
        file => {

            if (
                !file.type.startsWith(
                    "video/"
                )
            ) {
                return;
            }

            const exists =
                window
                    .GGHQ_SELECTED_VIDEO_FILES
                    .some(
                        oldFile =>
                            oldFile.name ===
                                file.name &&
                            oldFile.size ===
                                file.size &&
                            oldFile.lastModified ===
                                file.lastModified
                    );

            if (!exists) {

                window
                    .GGHQ_SELECTED_VIDEO_FILES
                    .push(file);
            }
        }
    );

    renderSelectedVideos();

    const input =
        document.getElementById(
            "videoFiles"
        );

    if (input) {
        input.value = "";
    }

    showToast(
        window
            .GGHQ_SELECTED_VIDEO_FILES
            .length +
        " video(s) selected",
        "✓"
    );
}


function renderSelectedVideos() {

    const container =
        document.getElementById(
            "selectedFiles"
        );

    if (!container) return;

    container.innerHTML = "";

    const files =
        window.GGHQ_SELECTED_VIDEO_FILES ||
        [];

    if (!files.length) {

        container.innerHTML = `
            <div class="video-empty-message">
                No videos selected yet.
            </div>
        `;

        return;
    }

    const gallery =
        document.createElement(
            "div"
        );

    gallery.className =
        "video-gallery-preview";

    files.forEach(
        (file, index) => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "video-preview-card";


            const video =
                document.createElement(
                    "video"
                );

            video.muted = true;
            video.playsInline = true;
            video.preload =
                "metadata";

            video.src =
                URL.createObjectURL(
                    file
                );


            const number =
                document.createElement(
                    "div"
                );

            number.className =
                "video-preview-number";

            number.textContent =
                index + 1;


            const badge =
                document.createElement(
                    "div"
                );

            badge.className =
                "gghq-selected-badge";

            badge.textContent =
                "✓ SELECTED";


            const info =
                document.createElement(
                    "div"
                );

            info.className =
                "video-preview-info";


            const name =
                document.createElement(
                    "div"
                );

            name.className =
                "video-preview-name";

            name.textContent =
                file.name;


            const size =
                document.createElement(
                    "div"
                );

            size.style.cssText = `
                margin-top:4px;
                font-size:11px;
                color:#777783;
            `;

            size.textContent =
                formatVideoSize(
                    file.size
                );


            info.appendChild(name);
            info.appendChild(size);

            card.appendChild(video);
            card.appendChild(number);
            card.appendChild(badge);
            card.appendChild(info);

            gallery.appendChild(card);
        }
    );

    container.appendChild(
        gallery
    );


    const count =
        document.createElement(
            "div"
        );

    count.className =
        "gghq-video-selected-count";

    count.textContent =
        "✓ " +
        files.length +
        (
            files.length === 1
                ? " VIDEO SELECTED"
                : " VIDEOS SELECTED"
        );

    container.appendChild(
        count
    );


    currentOrder.videos =
        files.map(
            file => ({
                name:
                    file.name,
                size:
                    file.size,
                type:
                    file.type ||
                    "video/mp4",
                lastModified:
                    file.lastModified
            })
        );
}


/* =========================================================
   VIDEO INPUT
   ========================================================= */

function setupVideoInput() {

    const input =
        document.getElementById(
            "videoFiles"
        );

    if (!input) return;

    input.setAttribute(
        "multiple",
        "multiple"
    );

    input.setAttribute(
        "accept",
        "video/*"
    );

    input.addEventListener(
        "change",
        function() {

            handleVideoSelection(
                this.files
            );
        }
    );
}


/* =========================================================
   REVIEW
   ========================================================= */

function updateReview() {

    const serviceMap = {

        "reel-editing":
            "Reel Editing",

        "transformation":
            "Transformation Reel",

        "gym-promotion":
            "Gym Promotion"
    };

    const service =
        serviceMap[
            currentOrder.service
        ] || "—";


    const plan =
        currentOrder.plan ===
        "premium"
            ? "Premium"
            : currentOrder.plan
                ? "Standard"
                : "—";


    setText(
        "reviewService",
        service
    );

    setText(
        "reviewPlan",
        plan
    );

    setText(
        "reviewClient",
        currentOrder.clientName
    );

    setText(
        "reviewGym",
        currentOrder.gymName
    );

    setText(
        "reviewInstagram",
        currentOrder.instagram
    );

    setText(
        "reviewVideos",
        (
            currentOrder.videos ||
            []
        ).length +
        " video(s)"
    );
}


/* =========================================================
   FIND ORDER
   ========================================================= */

function findCurrentOrder() {

    if (!currentOrderId) {
        return null;
    }

    const orders =
        getOrders();

    return orders.find(
        order =>
            order.id ===
            currentOrderId
    );
}


/* =========================================================
   UPLOAD VIDEOS TO SUPABASE
   ========================================================= */

async function uploadOrderVideos(
    orderId,
    files
) {

    const selectedFiles =
        Array.from(
            files || []
        );

    if (!selectedFiles.length) {
        return [];
    }

    if (!currentUser) {
        throw new Error(
            "User not logged in"
        );
    }

    const uploaded = [];

    for (
        const file of selectedFiles
    ) {

        const safeName =
            file.name
                .replace(
                    /[^a-zA-Z0-9._-]/g,
                    "_"
                )
                .replace(
                    /_+/g,
                    "_"
                );


        const uniquePart =
            window.crypto &&
            typeof window.crypto.randomUUID ===
                "function"
                ? window.crypto.randomUUID()
                : Date.now() +
                  "-" +
                  Math.random()
                      .toString(36)
                      .slice(2);


        const path =
            currentUser.id +
            "/" +
            orderId +
            "/" +
            uniquePart +
            "-" +
            safeName;


        const encodedPath =
            path
                .split("/")
                .map(
                    part =>
                        encodeURIComponent(
                            part
                        )
                )
                .join("/");


        const response =
            await fetch(
                SUPABASE_URL +
                "/storage/v1/object/order-videos/" +
                encodedPath,
                {

                    method:
                        "POST",

                    headers: {

                        apikey:
                            SUPABASE_PUBLISHABLE_KEY,

                        Authorization:
                            "Bearer " +
                            SUPABASE_PUBLISHABLE_KEY,

                        "Content-Type":
                            file.type ||
                            "video/mp4",

                        "x-upsert":
                            "false"
                    },

                    body:
                        file
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Video upload error:",
                errorText
            );

            throw new Error(
                "Video upload failed: " +
                file.name
            );
        }


        uploaded.push({

            name:
                file.name,

            size:
                file.size,

            type:
                file.type ||
                "video/mp4",

            url:
                SUPABASE_URL +
                "/storage/v1/object/public/order-videos/" +
                encodedPath
        });
    }

    return uploaded;
}


/* =========================================================
   SUBMIT ORDER
   ========================================================= */

async function submitOrder() {

    console.log(
        "GGHQ: SUBMIT ORDER CLICKED"
    );


    if (!currentUser) {

        showToast(
            "Please login first",
            "!"
        );

        showScreen("login");

        return;
    }


    if (!currentOrder.service) {

        showToast(
            "Please select a service",
            "!"
        );

        showScreen("services");

        return;
    }


    if (!currentOrder.plan) {
        currentOrder.plan =
            "standard";
    }


    saveStepOne();

    saveCreativeBrief();


    const selectedFiles =
        window.GGHQ_SELECTED_VIDEO_FILES ||
        [];


    if (!selectedFiles.length) {

        showToast(
            "Please select at least one video",
            "!"
        );

        showScreen(
            "order-upload"
        );

        return;
    }


    const submitButton =
        document.getElementById(
            "submitOrderButton"
        );


    if (submitButton) {

        submitButton.disabled =
            true;

        submitButton.style.opacity =
            "0.6";

        submitButton.innerHTML =
            "SUBMITTING... ⏳";
    }


    const orderId =
        "GGHQ-" +
        Date.now();


    const order = {

        id:
            orderId,

        userId:
            currentUser.id,

        userEmail:
            currentUser.email,

        service:
            currentOrder.service,

        plan:
            currentOrder.plan,

        clientName:
            currentOrder.clientName,

        gymName:
            currentOrder.gymName,

        instagram:
            currentOrder.instagram,

        goal:
            currentOrder.goal,

        notes:
            currentOrder.notes,

        instructions:
            currentOrder.instructions,

        creativeBrief:
            currentOrder.creativeBrief ||
            createEmptyCreativeBrief(),

        videos:
            [],

        status:
            "Submitted",

        deliveryStatus:
            "Editing in Progress",

        finalVideo:
            "",

        createdAt:
            new Date().toISOString()
    };


    try {

        showToast(
            "Uploading your videos...",
            "⬆"
        );


        /* -------------------------------------------------
           STEP 1 — UPLOAD VIDEOS
           ------------------------------------------------- */

        const uploadedVideos =
            await uploadOrderVideos(
                orderId,
                selectedFiles
            );


        order.videos =
            uploadedVideos;


        /* -------------------------------------------------
           STEP 2 — SAVE ORDER TO SUPABASE
           ------------------------------------------------- */

        showToast(
            "Saving your order...",
            "⏳"
        );


        const response =
            await fetch(
                SUPABASE_URL +
                "/rest/v1/orders",
                {

                    method:
                        "POST",

                    headers: {

                        apikey:
                            SUPABASE_PUBLISHABLE_KEY,

                        Authorization:
                            "Bearer " +
                            SUPABASE_PUBLISHABLE_KEY,

                        "Content-Type":
                            "application/json",

                        Prefer:
                            "return=representation"
                    },

                    body:
                        JSON.stringify({

                            user_id:
                                currentUser.id,

                            service:
                                order.service,

                            plan:
                                order.plan,

                            amount:
                                0,

                            payment_status:
                                "pending",

                            order_status:
                                "pending",

                            gym_name:
                                order.gymName,

                            instagram_url:
                                order.instagram,

                            raw_video_urls:
                                order.videos,

                            final_video_url:
                                "",

                            creative_brief: {

                                goal:
                                    order.goal ||
                                    "",

                                notes:
                                    order.notes ||
                                    "",

                                trend:
                                    order
                                        .creativeBrief
                                        .trend ||
                                    "",

                                song:
                                    order
                                        .creativeBrief
                                        .song ||
                                    "",

                                editingStyle:
                                    order
                                        .creativeBrief
                                        .editingStyle ||
                                    "",

                                shotInstructions:
                                    order
                                        .creativeBrief
                                        .shotInstructions ||
                                    "",

                                hook:
                                    order
                                        .creativeBrief
                                        .hook ||
                                    "",

                                cta:
                                    order
                                        .creativeBrief
                                        .cta ||
                                    "",

                                specialInstructions:
                                    order
                                        .creativeBrief
                                        .specialInstructions ||
                                    ""
                            },

                            created_at:
                                order.createdAt
                        })
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Supabase order error:",
                errorText
            );

            throw new Error(
                "Order database save failed"
            );
        }


        /* -------------------------------------------------
           STEP 3 — LOCAL BACKUP
           ------------------------------------------------- */

        const orders =
            getOrders();

        orders.push(order);

        saveOrders(orders);


        currentOrderId =
            order.id;


        /* -------------------------------------------------
           STEP 4 — SUCCESS
           ------------------------------------------------- */

        showToast(
            "Order submitted successfully!",
            "✓"
        );


        clearAllSelectedVideos();


        currentOrder = {

            service:
                "",

            plan:
                "",

            clientName:
                currentUser.name || "",

            gymName:
                currentUser.gymName || "",

            instagram:
                currentUser.instagram || "",

            goal:
                "",

            notes:
                "",

            instructions:
                "",

            creativeBrief:
                createEmptyCreativeBrief(),

            videos:
                []
        };


        setTimeout(
            () => {

                showScreen(
                    "order-success"
                );

            },
            700
        );


    } catch (error) {

        console.error(
            "GGHQ SUBMIT ERROR:",
            error
        );


        showToast(
            error.message ||
            "Order submission failed",
            "!"
        );


    } finally {

        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.style.opacity =
                "1";

            submitButton.innerHTML =
                "SUBMIT ORDER <span>✓</span>";
        }
    }
}


/* =========================================================
   MY ORDERS
   ========================================================= */

function getMyOrders() {

    if (!currentUser) {
        return [];
    }

    return getOrders().filter(
        order =>
            order.userId ===
            currentUser.id
    );
}


function renderOrders() {

    const list =
        document.getElementById(
            "ordersList"
        );

    if (!list) return;

    list.innerHTML = "";


    if (!currentUser) {

        list.innerHTML = `
            <div class="empty-state">
                <h3>Login Required</h3>
                <p>Please login to view your orders.</p>
            </div>
        `;

        return;
    }


    const orders =
        getMyOrders();


    if (!orders.length) {

        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📦</div>
                <h3>No Orders Yet</h3>
                <p>Your submitted orders will appear here.</p>
            </div>
        `;

        return;
    }


    orders
        .slice()
        .reverse()
        .forEach(
            order => {

                const card =
                    document.createElement(
                        "button"
                    );

                card.type =
                    "button";

                card.className =
                    "order-history-card";


                const serviceMap = {

                    "reel-editing":
                        "Reel Editing",

                    "transformation":
                        "Transformation Reel",

                    "gym-promotion":
                        "Gym Promotion"
                };


                const service =
                    serviceMap[
                        order.service
                    ] ||
                    "Order";


                const plan =
                    order.plan ===
                    "premium"
                        ? "Premium"
                        : "Standard";


                card.innerHTML = `

                    <div class="order-history-icon">
                        📦
                    </div>

                    <div class="order-history-info">

                        <strong>
                            ${escapeHTML(service)}
                        </strong>

                        <small>
                            ${escapeHTML(plan)}
                            •
                            ${escapeHTML(
                                order.gymName
                            )}
                        </small>

                        <span class="order-status-small">
                            ${escapeHTML(
                                order.deliveryStatus ||
                                order.status ||
                                "Submitted"
                            )}
                        </span>

                    </div>

                    <span class="account-menu-arrow">
                        →
                    </span>
                `;


                card.addEventListener(
                    "click",
                    () => {

                        currentOrderId =
                            order.id;

                        renderOrderDetails(
                            order
                        );

                        showScreen(
                            "order-details"
                        );
                    }
                );


                list.appendChild(
                    card
                );
            }
        );
}


/* =========================================================
   ORDER DETAILS
   ========================================================= */

function renderOrderDetails(
    order
) {

    if (!order) return;


    const serviceMap = {

        "reel-editing":
            "Reel Editing",

        "transformation":
            "Transformation Reel",

        "gym-promotion":
            "Gym Promotion"
    };


    const service =
        serviceMap[
            order.service
        ] ||
        "Order";


    const plan =
        order.plan ===
        "premium"
            ? "Premium"
            : "Standard";


    setText(
        "detailOrderNumber",
        "#" +
        String(order.id)
            .replace(
                "GGHQ-",
                ""
            )
    );


    setText(
        "detailOrderStatus",
        order.deliveryStatus ||
        order.status
    );


    setText(
        "detailService",
        service
    );


    setText(
        "detailPlan",
        plan
    );


    setText(
        "detailClient",
        order.clientName
    );


    setText(
        "detailGym",
        order.gymName
    );


    setText(
        "detailGoal",
        order.goal
    );


    setText(
        "detailVideos",
        Array.isArray(
            order.videos
        )
            ? order.videos.length +
              " video(s)"
            : "—"
    );


    setText(
        "detailInstructions",
        order.instructions ||
        "—"
    );


    renderOrderCreativeBrief(
        order
    );


    renderOrderVideoGallery(
        order
    );
}


/* =========================================================
   CREATIVE BRIEF DISPLAY
   ========================================================= */

function renderOrderCreativeBrief(
    order
) {

    const detailVideos =
        document.getElementById(
            "detailVideos"
        );

    if (!detailVideos) return;


    const oldBrief =
        document.getElementById(
            "gghqOrderCreativeBrief"
        );

    if (oldBrief) {
        oldBrief.remove();
    }


    const brief =
        order.creativeBrief ||
        {};


    const wrapper =
        document.createElement(
            "div"
        );

    wrapper.id =
        "gghqOrderCreativeBrief";

    wrapper.style.cssText = `
        margin-top:18px;
        padding:16px;
        border-radius:16px;
        background:rgba(255,255,255,0.03);
        border:1px solid rgba(145,92,255,0.30);
    `;


    const title =
        document.createElement(
            "div"
        );

    title.textContent =
        "🎬 Creative Brief";

    title.style.cssText = `
        margin-bottom:14px;
        font-size:16px;
        font-weight:700;
        color:#ffffff;
    `;


    wrapper.appendChild(
        title
    );


    const fields = [

        [
            "🔥 Trend / Reference",
            brief.trend
        ],

        [
            "🎵 Song / Audio",
            brief.song
        ],

        [
            "🎨 Editing Style",
            brief.editingStyle
        ],

        [
            "🎥 Shot Instructions",
            brief.shotInstructions
        ],

        [
            "✍️ Hook / On-screen Text",
            brief.hook
        ],

        [
            "📢 CTA",
            brief.cta
        ],

        [
            "📝 Special Instructions",
            brief.specialInstructions
        ]
    ];


    let hasContent =
        false;


    fields.forEach(
        ([label, value]) => {

            if (
                value === undefined ||
                value === null ||
                !String(value).trim()
            ) {
                return;
            }


            hasContent =
                true;


            const row =
                document.createElement(
                    "div"
                );

            row.style.cssText = `
                margin-bottom:12px;
            `;


            const labelEl =
                document.createElement(
                    "div"
                );

            labelEl.textContent =
                label;

            labelEl.style.cssText = `
                color:#cdb5ff;
                font-size:12px;
                font-weight:700;
                margin-bottom:5px;
            `;


            const valueEl =
                document.createElement(
                    "div"
                );

            valueEl.textContent =
                value;

            valueEl.style.cssText = `
                color:#ffffff;
                font-size:13px;
                line-height:1.5;
                white-space:pre-wrap;
            `;


            row.appendChild(
                labelEl
            );

            row.appendChild(
                valueEl
            );

            wrapper.appendChild(
                row
            );
        }
    );


    if (!hasContent) {

        const empty =
            document.createElement(
                "div"
            );

        empty.textContent =
            "No creative brief was saved for this order.";

        empty.style.cssText = `
            padding:14px;
            border-radius:12px;
            background:rgba(255,255,255,0.03);
            color:#8f8f9d;
            font-size:13px;
        `;

        wrapper.appendChild(
            empty
        );
    }


    detailVideos.insertAdjacentElement(
        "afterend",
        wrapper
    );
}


/* =========================================================
   ORDER VIDEO GALLERY
   ========================================================= */

function renderOrderVideoGallery(
    order
) {

    const detailVideos =
        document.getElementById(
            "detailVideos"
        );

    if (!detailVideos) return;


    const oldGallery =
        document.getElementById(
            "gghqOrderVideoGallery"
        );

    if (oldGallery) {
        oldGallery.remove();
    }


    const videos =
        Array.isArray(
            order.videos
        )
            ? order.videos.filter(
                video =>
                    video &&
                    typeof video.url ===
                        "string" &&
                    video.url
            )
            : [];


    const wrapper =
        document.createElement(
            "div"
        );

    wrapper.id =
        "gghqOrderVideoGallery";

    wrapper.style.cssText = `
        margin-top:18px;
        padding:16px;
        border-radius:16px;
        background:rgba(255,255,255,0.03);
        border:1px solid rgba(145,92,255,0.30);
    `;


    const title =
        document.createElement(
            "div"
        );

    title.textContent =
        "🎬 Uploaded Videos";

    title.style.cssText = `
        margin-bottom:12px;
        font-size:16px;
        font-weight:700;
        color:#ffffff;
    `;


    wrapper.appendChild(
        title
    );


    if (!videos.length) {

        const empty =
            document.createElement(
                "div"
            );

        empty.textContent =
            "No saved video preview is available for this order.";

        empty.style.cssText = `
            padding:14px;
            border-radius:12px;
            background:rgba(255,255,255,0.03);
            color:#8f8f9d;
            font-size:13px;
        `;

        wrapper.appendChild(
            empty
        );

    } else {

        const grid =
            document.createElement(
                "div"
            );

        grid.style.cssText = `
            display:grid;
            grid-template-columns:repeat(1,minmax(0,1fr));
            gap:14px;
        `;


        videos.forEach(
            (video, index) => {

                const card =
                    document.createElement(
                        "div"
                    );

                card.style.cssText = `
                    overflow:hidden;
                    border-radius:14px;
                    background:#111118;
                    border:1px solid rgba(145,92,255,0.35);
                `;


                const player =
                    document.createElement(
                        "video"
                    );

                player.src =
                    video.url;

                player.controls =
                    true;

                player.playsInline =
                    true;

                player.preload =
                    "metadata";

                player.style.cssText = `
                    display:block;
                    width:100%;
                    max-height:420px;
                    background:#08080c;
                `;


                const info =
                    document.createElement(
                        "div"
                    );

                info.style.cssText =
                    "padding:10px 12px 12px;";


                const name =
                    document.createElement(
                        "div"
                    );

                name.textContent =
                    (
                        index + 1
                    ) +
                    ". " +
                    (
                        video.name ||
                        "Video"
                    );

                name.style.cssText = `
                    color:#ffffff;
                    font-size:13px;
                    font-weight:600;
                    overflow:hidden;
                    text-overflow:ellipsis;
                    white-space:nowrap;
                `;


                const open =
                    document.createElement(
                        "a"
                    );

                open.href =
                    video.url;

                open.target =
                    "_blank";

                open.rel =
                    "noopener noreferrer";

                open.textContent =
                    "Open Video ↗";

                open.style.cssText = `
                    display:inline-block;
                    margin-top:7px;
                    color:#cdb5ff;
                    font-size:12px;
                    text-decoration:none;
                `;


                info.appendChild(
                    name
                );

                info.appendChild(
                    open
                );

                card.appendChild(
                    player
                );

                card.appendChild(
                    info
                );

                grid.appendChild(
                    card
                );
            }
        );


        wrapper.appendChild(
            grid
        );
    }


    detailVideos.insertAdjacentElement(
        "afterend",
        wrapper
    );
}


/* =========================================================
   VIDEO DELIVERY
   ========================================================= */

function renderVideoDelivery(
    order
) {

    if (!order) return;


    const processing =
        document.getElementById(
            "videoProcessingCard"
        );

    const ready =
        document.getElementById(
            "videoReadyCard"
        );

    const title =
        document.getElementById(
            "deliveryTitle"
        );

    const subtitle =
        document.getElementById(
            "deliverySubtitle"
        );

    const player =
        document.getElementById(
            "finalVideoPlayer"
        );

    const download =
        document.getElementById(
            "downloadVideoButton"
        );


    const finalVideo =
        order.finalVideo ||
        "";


    if (finalVideo) {

        if (processing) {
            processing.style.display =
                "none";
        }

        if (ready) {
            ready.style.display =
                "block";
        }

        if (title) {
            title.textContent =
                "Ready!";
        }

        if (subtitle) {
            subtitle.textContent =
                "Your edited video is ready to watch and download.";
        }

        if (player) {
            player.src =
                finalVideo;
        }

        if (download) {
            download.href =
                finalVideo;
        }

        return;
    }


    if (processing) {
        processing.style.display =
            "block";
    }

    if (ready) {
        ready.style.display =
            "none";
    }

    if (title) {
        title.textContent =
            "Being Edited.";
    }

    if (subtitle) {
        subtitle.textContent =
            "We'll make your finished video available here when it is ready.";
    }
}


/* =========================================================
   DYNAMIC VIDEO CSS
   ========================================================= */

function addVideoStyles() {

    if (
        document.getElementById(
            "gghqVideoStyles"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );

    style.id =
        "gghqVideoStyles";


    style.textContent = `

        .video-gallery-preview {
            display:grid;
            grid-template-columns:
                repeat(2,minmax(0,1fr));
            gap:12px;
            margin-top:16px;
        }

        .video-preview-card {
            position:relative;
            overflow:hidden;
            border-radius:16px;
            background:#111118;
            border:2px solid
                rgba(145,92,255,0.65);
        }

        .video-preview-card video {
            display:block;
            width:100%;
            aspect-ratio:16 / 10;
            object-fit:cover;
            background:#08080c;
        }

        .video-preview-info {
            padding:9px 10px 11px;
        }

        .video-preview-name {
            color:#ffffff;
            font-size:12px;
            font-weight:600;
            line-height:1.35;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
        }

        .video-preview-number {
            position:absolute;
            top:8px;
            left:8px;
            z-index:5;
            width:28px;
            height:28px;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            background:rgba(0,0,0,0.78);
            color:white;
            font-size:12px;
            font-weight:800;
        }

        .gghq-selected-badge {
            position:absolute;
            top:8px;
            right:8px;
            z-index:5;
            padding:6px 9px;
            border-radius:20px;
            background:
                rgba(70,220,130,0.95);
            color:#07140c;
            font-size:11px;
            font-weight:800;
        }

        .gghq-video-selected-count {
            margin-top:16px;
            width:100%;
            padding:14px 16px;
            border-radius:14px;
            background:
                rgba(145,92,255,0.14);
            border:1px solid
                rgba(145,92,255,0.45);
            color:white;
            text-align:center;
            font-size:15px;
            font-weight:800;
        }

        .video-empty-message {
            margin-top:16px;
            padding:18px;
            border-radius:14px;
            text-align:center;
            color:#8f8f9d;
            background:
                rgba(255,255,255,0.03);
            font-size:14px;
        }

        #submitOrderButton:disabled {
            pointer-events:none;
        }

        @media (min-width:600px) {

            .video-gallery-preview {
                grid-template-columns:
                    repeat(3,minmax(0,1fr));
            }

        }
    `;


    document.head.appendChild(
        style
    );
}


/* =========================================================
   CLICK HANDLER
   ========================================================= */

function setupClickHandler() {

    document.addEventListener(
        "click",
        function(event) {

            const button =
                event.target.closest(
                    "button, a"
                );

            if (!button) return;


            /* ---------------------------------------------
               ACCOUNT
               --------------------------------------------- */

            if (
                button.dataset.screen ===
                "account"
            ) {

                event.preventDefault();

                if (currentUser) {
                    showScreen("account");
                } else {
                    showScreen("login");
                }

                return;
            }


            /* ---------------------------------------------
               SERVICES
               --------------------------------------------- */

            if (
                button.dataset.detail
            ) {

                event.preventDefault();

                selectService(
                    button.dataset.detail
                );

                return;
            }


            /* ---------------------------------------------
               PLAN DETAIL
               --------------------------------------------- */

            if (
                button.dataset.planDetail
            ) {

                event.preventDefault();

                const service =
                    button.dataset.planDetail;

                if (
                    service ===
                    "reel-editing"
                ) {
                    showScreen(
                        "plan-reel-editing"
                    );
                }

                if (
                    service ===
                    "transformation"
                ) {
                    showScreen(
                        "plan-transformation"
                    );
                }

                if (
                    service ===
                    "gym-promotion"
                ) {
                    showScreen(
                        "plan-gym-promotion"
                    );
                }

                return;
            }


            /* ---------------------------------------------
               PLAN START
               --------------------------------------------- */

            if (
                button.dataset.plan
            ) {

                event.preventDefault();

                selectPlan(
                    button.dataset.plan,
                    "standard"
                );

                return;
            }


            /* ---------------------------------------------
               ORDER NEXT
               --------------------------------------------- */

            if (
                button.dataset.orderNext
            ) {

                event.preventDefault();

                goOrderNext(
                    Number(
                        button.dataset.orderNext
                    )
                );

                return;
            }


            /* ---------------------------------------------
               ORDER BACK
               --------------------------------------------- */

            if (
                button.dataset.orderBack
            ) {

                event.preventDefault();

                goOrderBack(
                    Number(
                        button.dataset.orderBack
                    )
                );

                return;
            }


            /* ---------------------------------------------
               NORMAL SCREEN
               --------------------------------------------- */

            if (
                button.dataset.screen
            ) {

                event.preventDefault();

                const target =
                    button.dataset.screen;


                if (
                    target ===
                    "services"
                ) {

                    if (
                        currentUser
                    ) {
                        clearAllSelectedVideos();
                    }
                }


                showScreen(target);

                return;
            }

        }
    );
}


/* =========================================================
   BUTTON EVENTS
   ========================================================= */

function setupButtons() {

    document
        .getElementById(
            "loginButton"
        )
        ?.addEventListener(
            "click",
            loginUser
        );


    document
        .getElementById(
            "signupButton"
        )
        ?.addEventListener(
            "click",
            createAccount
        );


    document
        .getElementById(
            "logoutButton"
        )
        ?.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                logoutUser();
            }
        );


    document
        .getElementById(
            "goToSignup"
        )
        ?.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                showScreen("signup");
            }
        );


    document
        .getElementById(
            "goToLogin"
        )
        ?.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                showScreen("login");
            }
        );


    /* =====================================================
       IMPORTANT SUBMIT BUTTON
       ===================================================== */

    const submitButton =
        document.getElementById(
            "submitOrderButton"
        );


    if (submitButton) {

        submitButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                event.stopPropagation();

                console.log(
                    "GGHQ: Submit button pressed"
                );

                submitOrder();
            }
        );

    } else {

        console.error(
            "GGHQ ERROR: submitOrderButton not found"
        );
    }
}


/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeGGHQ() {

    console.log(
        "GGHQ: Initializing..."
    );


    restoreSession();

    setupVideoInput();

    setupClickHandler();

    setupButtons();

    addVideoStyles();


    showScreen("home");


    console.log(
        "GGHQ: Ready"
    );
}


/* =========================================================
   START
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeGGHQ
    );

} else {

    initializeGGHQ();
}


/* =========================================================
   SUPABASE DATABASE NOTE
   =========================================================

   Your orders table needs:

   creative_brief JSONB

   Example SQL:

   ALTER TABLE public.orders
   ADD COLUMN IF NOT EXISTS
   creative_brief jsonb DEFAULT '{}'::jsonb;

   ========================================================= */
