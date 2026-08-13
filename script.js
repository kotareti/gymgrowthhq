/* =========================================================
   GYM GROWTH HQ
   FINAL SCRIPT.JS
   CREATIVE BRIEF + VIDEO UPLOAD + ORDER HISTORY
   ========================================================= */

const USERS_KEY = "gghq_users";
const SESSION_KEY = "gghq_session";
const ORDERS_KEY = "gghq_orders";

/* =========================================================
   SUPABASE CONFIG
   ========================================================= */

const SUPABASE_URL =
    "https://gcxsdpjkzrxmgbhcoeqn.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_Pcj2mwFWysWV2sQHwjAm_Q_qtv0I5hS";

let currentUser = null;

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

let currentOrderId = null;


/* =========================================================
   STORAGE
   ========================================================= */

function getUsers() {
    try {
        return JSON.parse(
            localStorage.getItem(USERS_KEY)
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
            localStorage.getItem(ORDERS_KEY)
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
            localStorage.getItem(SESSION_KEY)
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
   HELPERS
   ========================================================= */

function isLoggedIn() {
    return !!currentUser;
}

function getInitial(name) {
    return name
        ? name.trim().charAt(0).toUpperCase()
        : "?";
}

function setText(id, value) {
    const el =
        document.getElementById(id);

    if (el) {
        el.textContent =
            value || "—";
    }
}

function escapeHTML(value) {
    if (!value) return "";

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

    const iconEl =
        document.getElementById(
            "toastIcon"
        );

    if (!toast) return;

    if (text) {
        text.textContent = message;
    }

    if (iconEl) {
        iconEl.textContent = icon;
    }

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

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

    if (!screen) return;

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
        updateReview();
    }

    if (id === "order-details") {

        const order =
            findCurrentOrder();

        if (order) {
            renderOrderDetails(
                order
            );
        }
    }

    if (id === "order-project") {
        /*
         * Customer flow no longer injects the Creative Brief.
         * Reference Reel + Song/Audio are handled by the V2 upload module.
         */
        setTimeout(() => {
            gghqPrepareCustomerProjectScreen();
        }, 0);
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

        if (headerButton)
            headerButton.style.display =
                "flex";

        if (headerInitial)
            headerInitial.textContent =
                initial;

        if (headerName)
            headerName.textContent =
                currentUser.name;

        if (homeCard)
            homeCard.style.display =
                "flex";

        if (homeButton)
            homeButton.style.display =
                "none";

        if (homeInitial)
            homeInitial.textContent =
                initial;

        if (homeName)
            homeName.textContent =
                currentUser.name;

        if (homeEmail)
            homeEmail.textContent =
                currentUser.email;

        if (accountInitial)
            accountInitial.textContent =
                initial;

        if (accountName)
            accountName.textContent =
                currentUser.name;

        if (accountEmail)
            accountEmail.textContent =
                currentUser.email;

    } else {

        if (headerButton)
            headerButton.style.display =
                "none";

        if (homeCard)
            homeCard.style.display =
                "none";

        if (homeButton)
            homeButton.style.display =
                "flex";
    }
}


/* =========================================================
   SAVE CLIENT PROFILE
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

    saveSession(
        currentUser
    );
}


/* =========================================================
   AUTO-FILL CLIENT DETAILS
   ========================================================= */

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

    currentOrder.service = "";
    currentOrder.plan = "";
    currentOrder.goal = "";
    currentOrder.notes = "";
    currentOrder.instructions = "";

    currentOrder.creativeBrief =
        createEmptyCreativeBrief();

    currentOrder.videos = [];

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
                item.email ===
                email
        );

    if (!user) {

        showToast(
            "Account not found",
            "!"
        );

        return;
    }

    if (
        user.password !==
        password
    ) {

        showToast(
            "Wrong password",
            "!"
        );

        return;
    }

    currentUser = {

        id:
            user.id,

        name:
            user.name,

        email:
            user.email,

        gymName:
            user.gymName || "",

        instagram:
            user.instagram || ""
    };

    saveSession(
        currentUser
    );

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

    if (
        password.length < 6
    ) {

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
                user.email ===
                email
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

    users.push(
        newUser
    );

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

    saveSession(
        currentUser
    );

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

    if (
        service !==
            "reel-editing" &&
        service !==
            "transformation"
    ) {
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
}


/* =========================================================
   PLAN SELECTION
   ========================================================= */

function selectPlan(
    service,
    plan
) {

    if (
        service !==
            "reel-editing" &&
        service !==
            "transformation"
    ) {
        return;
    }

    currentOrder.service =
        service;

    currentOrder.plan =
        plan || "standard";

    if (currentUser) {

        fillClientDetails();

        showScreen("order");

    } else {

        showScreen("login");
    }
}


/* =========================================================
   ORDER STEP 1
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

    if (currentUser) {
        saveClientProfile();
    }

    return true;
}


/* =========================================================
   CREATIVE BRIEF UI
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

    if (!wrapper) {

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

            screen.appendChild(
                wrapper
            );
        }
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
   ORDER NEXT
   ========================================================= */

function goOrderNext(step) {

    if (step === 2) {
        if (!saveStepOne()) {
            showToast("Please enter your details", "!");
            return;
        }
        showScreen("order-project");
        return;
    }

    /* Main Goal / Creative Brief are not part of the customer flow. */
    if (step === 3) {
        showScreen("order-upload");
        return;
    }

    /* Skip the old editing-instructions screen. */
    if (step === 4) {
        updateReview();
        showScreen("order-review");
        return;
    }

    /* Backward compatibility for any old button still using step 5. */
    if (step === 5) {
        updateReview();
        showScreen("order-review");
    }
}



/* =========================================================
   ORDER BACK
   ========================================================= */

function goOrderBack(step) {

    if (step === 1) {
        showScreen("order");
    }

    if (step === 2) {
        showScreen(
            "order-project"
        );
    }

    if (step === 3) {
        showScreen(
            "order-upload"
        );
    }

    if (step === 4) {
        showScreen(
            "order-instructions"
        );
    }
}


/* =========================================================
   VIDEO FILE SYSTEM
   ========================================================= */

window.GGHQ_SELECTED_VIDEO_FILES =
    window.GGHQ_SELECTED_VIDEO_FILES ||
    [];


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

            const number =
                document.createElement(
                    "div"
                );

            number.className =
                "video-preview-number";

            number.textContent =
                index + 1;

            const selectedBadge =
                document.createElement(
                    "div"
                );

            selectedBadge.className =
                "gghq-selected-badge";

            selectedBadge.textContent =
                "✓ SELECTED";

            const video =
                document.createElement(
                    "video"
                );

            video.muted = true;
            video.playsInline = true;
            video.preload = "metadata";

            video.setAttribute(
                "playsinline",
                ""
            );

            const previewURL =
                URL.createObjectURL(
                    file
                );

            video.src =
                previewURL;

            video.addEventListener(
                "loadedmetadata",
                function() {

                    try {

                        if (
                            video.duration >
                            0.2
                        ) {

                            video.currentTime =
                                0.1;
                        }

                    } catch (e) {}
                }
            );

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
            card.appendChild(selectedBadge);
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

    const countNumber =
        document.createElement(
            "span"
        );

    countNumber.textContent =
        files.length;

    count.appendChild(
        document.createTextNode("✓ ")
    );

    count.appendChild(
        countNumber
    );

    count.appendChild(
        document.createTextNode(
            files.length === 1
                ? " VIDEO SELECTED"
                : " VIDEOS SELECTED"
        )
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
        newFile => {

            const exists =
                window
                    .GGHQ_SELECTED_VIDEO_FILES
                    .some(
                        oldFile =>
                            oldFile.name ===
                                newFile.name &&
                            oldFile.size ===
                                newFile.size &&
                            oldFile.lastModified ===
                                newFile.lastModified
                    );

            if (!exists) {

                window
                    .GGHQ_SELECTED_VIDEO_FILES
                    .push(
                        newFile
                    );
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
        `${window.GGHQ_SELECTED_VIDEO_FILES.length} video${
            window.GGHQ_SELECTED_VIDEO_FILES.length === 1
                ? ""
                : "s"
        } selected`,
        "✓"
    );
}


/* =========================================================
   VIDEO INPUT SETUP
   ========================================================= */

const GGHQ_videoInput =
    document.getElementById(
        "videoFiles"
    );

if (GGHQ_videoInput) {

    GGHQ_videoInput.setAttribute(
        "multiple",
        "multiple"
    );

    GGHQ_videoInput.setAttribute(
        "accept",
        "video/*"
    );

    GGHQ_videoInput.addEventListener(
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

    const service =
        currentOrder.service ===
        "reel-editing"
            ? "Reel Editing"
            : currentOrder.service ===
              "transformation"
                ? "Transformation Reel"
                : "—";

    const plan =
        currentOrder.plan ===
        "premium"
            ? "Premium"
            : "Standard";

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
        currentOrder.videos.length +
        " video(s)"
    );


    /* =====================================================
       CREATIVE BRIEF IN REVIEW
       ===================================================== */

    const reviewVideos =
        document.getElementById(
            "reviewVideos"
        );

    if (!reviewVideos) {
        return;
    }

    const oldBrief =
        document.getElementById(
            "gghqReviewCreativeBrief"
        );

    if (oldBrief) {
        oldBrief.remove();
    }

    const brief =
        currentOrder.creativeBrief ||
        createEmptyCreativeBrief();

    const wrapper =
        document.createElement(
            "div"
        );

    wrapper.id =
        "gghqReviewCreativeBrief";

    wrapper.style.cssText = `
        margin-top:20px;
        padding:18px;
        border-radius:18px;
        background:rgba(145,92,255,0.07);
        border:1px solid rgba(145,92,255,0.30);
    `;


    const title =
        document.createElement(
            "div"
        );

    title.textContent =
        "🎬 Creative Brief";

    title.style.cssText = `
        margin-bottom:16px;
        color:#ffffff;
        font-size:17px;
        font-weight:800;
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
                value ===
                    undefined ||
                value ===
                    null ||
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
                margin-bottom:14px;
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
                line-height:1.55;
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
            "No creative brief added.";

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


    reviewVideos.insertAdjacentElement(
        "afterend",
        wrapper
    );
}


/* =========================================================
   FIND CURRENT ORDER
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
   SUPABASE STORAGE VIDEO UPLOAD
   ========================================================= */

async function uploadOrderVideos(
    orderId,
    files
) {

    const selectedFiles =
        Array.from(
            files || []
        );

    if (
        !selectedFiles.length
    ) {
        return [];
    }

    const uploaded = [];

    for (
        const file
        of selectedFiles
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
            (
                window.crypto &&
                crypto.randomUUID
            )
                ? crypto.randomUUID()
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

                        "apikey":
                            SUPABASE_PUBLISHABLE_KEY,

                        "Authorization":
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
                (
                    file.name ||
                    "video"
                )
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

    if (!currentUser) {

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
            currentOrder.videos ||
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

        const selectedVideoFiles =
            window.GGHQ_SELECTED_VIDEO_FILES ||
            [];


        const uploadedVideos =
            await uploadOrderVideos(
                orderId,
                selectedVideoFiles
            );


        order.videos =
            uploadedVideos;


        /* =====================================================
           SAVE ORDER TO SUPABASE
           ===================================================== */

        const response =
            await fetch(
                SUPABASE_URL +
                "/rest/v1/orders",
                {

                    method:
                        "POST",

                    headers: {

                        "apikey":
                            SUPABASE_PUBLISHABLE_KEY,

                        "Authorization":
                            "Bearer " +
                            SUPABASE_PUBLISHABLE_KEY,

                        "Content-Type":
                            "application/json",

                        "Prefer":
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
                                order.videos ||
                                [],

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
                                        ?.trend ||
                                    "",

                                song:
                                    order
                                        .creativeBrief
                                        ?.song ||
                                    "",

                                editingStyle:
                                    order
                                        .creativeBrief
                                        ?.editingStyle ||
                                    "",

                                shotInstructions:
                                    order
                                        .creativeBrief
                                        ?.shotInstructions ||
                                    "",

                                hook:
                                    order
                                        .creativeBrief
                                        ?.hook ||
                                    "",

                                cta:
                                    order
                                        .creativeBrief
                                        ?.cta ||
                                    "",

                                specialInstructions:
                                    order
                                        .creativeBrief
                                        ?.specialInstructions ||
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

            showToast(
                "Order could not be submitted",
                "!"
            );

            return;
        }


        /* =====================================================
           SAVE LOCALLY
           ===================================================== */

        const orders =
            getOrders();

        orders.push(
            order
        );

        saveOrders(
            orders
        );

        currentOrderId =
            order.id;


        showToast(
            "Order submitted successfully",
            "✓"
        );


        /* =====================================================
           PREPARE NEXT ORDER
           ===================================================== */

        clearAllSelectedVideos();

        currentOrder = {

            service:
                "",

            plan:
                "",

            clientName:
                currentUser.name ||
                "",

            gymName:
                currentUser.gymName ||
                "",

            instagram:
                currentUser.instagram ||
                "",

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

                renderOrders();

                showScreen(
                    "account"
                );

            },
            500
        );


    } catch (error) {

        console.error(
            "Supabase connection error:",
            error
        );

        showToast(
            "Connection error",
            "!"
        );
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


/* =========================================================
   RENDER ORDERS
   ========================================================= */

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


                const service =
                    order.service ===
                    "reel-editing"
                        ? "Reel Editing"
                        : "Transformation Reel";


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
                            ${service}
                        </strong>

                        <small>
                            ${plan} •
                            ${escapeHTML(
                                order.gymName
                            )}
                        </small>

                        <span class="order-status-small">
                            ${escapeHTML(
                                order.deliveryStatus
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

    const service =
        order.service ===
        "reel-editing"
            ? "Reel Editing"
            : "Transformation Reel";

    const plan =
        order.plan ===
        "premium"
            ? "Premium"
            : "Standard";


    setText(
        "detailOrderNumber",
        "#" +
        order.id.replace(
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
        order.videos
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
   ORDER CREATIVE BRIEF DISPLAY
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
                value ===
                    undefined ||
                value ===
                    null ||
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
   DYNAMIC VIDEO CSS
   ========================================================= */

if (
    !document.getElementById(
        "gghqVideoStyles"
    )
) {

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
            box-shadow:
                0 0 0 2px
                rgba(145,92,255,0.08);
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
            letter-spacing:0.3px;
            box-shadow:
                0 3px 10px
                rgba(0,0,0,0.35);
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

        .gghq-video-selected-count span {
            color:#cdb5ff;
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
   INITIALIZE
   ========================================================= */

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
                item.id ===
                    session.id &&
                item.email ===
                    session.email
        );


    if (!user) {

        clearSession();

        currentUser = null;

        updateAccountUI();

        return;
    }


    currentUser = {

        id:
            user.id,

        name:
            user.name,

        email:
            user.email,

        gymName:
            user.gymName || "",

        instagram:
            user.instagram || ""
    };


    updateAccountUI();
}


/* =========================================================
   CLICK HANDLER
   ========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "button, a"
            );

        if (!button) return;


        /* ACCOUNT */

        if (
            button.dataset.screen ===
            "account"
        ) {

            event.preventDefault();

            if (currentUser) {

                updateAccountUI();

                showScreen(
                    "account"
                );

            } else {

                showScreen(
                    "login"
                );
            }

            return;
        }


        /* ORDERS */

        if (
            button.dataset.screen ===
            "orders"
        ) {

            event.preventDefault();

            if (!currentUser) {

                showScreen(
                    "login"
                );

                return;
            }

            renderOrders();

            showScreen(
                "orders"
            );

            return;
        }


        /* SERVICES */

        if (
            button.dataset.detail
        ) {

            event.preventDefault();

            selectService(
                button.dataset.detail
            );

            return;
        }


        /* PLAN DETAIL */

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


            return;
        }


        /* START ORDER FROM PLAN */

        if (
            button.dataset.plan
        ) {

            event.preventDefault();

            const service =
                button.dataset.plan;


            selectPlan(
                service,
                "standard"
            );


            return;
        }


        /* ORDER NEXT */

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


        /* ORDER BACK */

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


        /* NORMAL SCREEN */

        if (
            button.dataset.screen
        ) {

            event.preventDefault();


            if (
                button.dataset.screen ===
                "order"
            ) {

                clearAllSelectedVideos();
            }


            showScreen(
                button.dataset.screen
            );


            return;
        }
    }
);


/* =========================================================
   LOGIN
   ========================================================= */

document
    .getElementById(
        "loginButton"
    )
    ?.addEventListener(
        "click",
        loginUser
    );


/* =========================================================
   SIGNUP
   ========================================================= */

document
    .getElementById(
        "signupButton"
    )
    ?.addEventListener(
        "click",
        createAccount
    );


/* =========================================================
   LOGOUT
   ========================================================= */

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


/* =========================================================
   LOGIN → SIGNUP
   ========================================================= */

document
    .getElementById(
        "goToSignup"
    )
    ?.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            showScreen(
                "signup"
            );
        }
    );


/* =========================================================
   SIGNUP → LOGIN
   ========================================================= */

document
    .getElementById(
        "goToLogin"
    )
    ?.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            showScreen(
                "login"
            );
        }
    );


/* =========================================================
   SUBMIT
   ========================================================= */

document
    .getElementById(
        "submitOrderButton"
    )
    ?.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            submitOrder();
        }
    );


/* =========================================================
   RESTORE SESSION
   ========================================================= */

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
                item.id ===
                    session.id &&
                item.email ===
                    session.email
        );


    if (!user) {

        clearSession();

        currentUser = null;

        updateAccountUI();

        return;
    }


    currentUser = {

        id:
            user.id,

        name:
            user.name,

        email:
            user.email,

        gymName:
            user.gymName || "",

        instagram:
            user.instagram || ""
    };


    saveSession(
        currentUser
    );


    updateAccountUI();
}


/* =========================================================
   INITIALIZE
   ========================================================= */

restoreSession();


/* =========================================================
   INITIAL SCREEN
   ========================================================= */

showScreen("home");


/* =========================================================
   SUPABASE NOTE
   =========================================================

   Before submitting an order with creative_brief,
   the Supabase orders table must have this column:

   ALTER TABLE public.orders
   ADD COLUMN IF NOT EXISTS
   creative_brief jsonb DEFAULT '{}'::jsonb;

   Run that SQL once in Supabase SQL Editor.

   ========================================================= */


/* =========================================================
   GGHQ V2 PRODUCTION PATCH
   FIXES:
   1. Supabase Auth UUID instead of local USER-* IDs
   2. Real login/signup session
   3. Source video + reference reel + audio upload
   4. One atomic order submit pipeline
   5. Supabase-backed order history
   6. Complete creative brief + file metadata
   ========================================================= */

const GGHQ_AUTH_KEY = "gghq_supabase_session";
const GGHQ_BUCKET = "order-videos";

function gghqAuthHeaders(token, json = false) {
    const headers = {
        "apikey": SUPABASE_PUBLISHABLE_KEY
    };
    if (token) headers["Authorization"] = "Bearer " + token;
    if (json) headers["Content-Type"] = "application/json";
    return headers;
}

function gghqSaveAuthSession(session) {
    if (!session) {
        localStorage.removeItem(GGHQ_AUTH_KEY);
        return;
    }
    localStorage.setItem(GGHQ_AUTH_KEY, JSON.stringify(session));
}

function gghqGetAuthSession() {
    try {
        return JSON.parse(localStorage.getItem(GGHQ_AUTH_KEY)) || null;
    } catch {
        return null;
    }
}

function gghqClearAuth() {
    localStorage.removeItem(GGHQ_AUTH_KEY);
}

function gghqUserFromAuth(user, accessToken = "") {
    if (!user || !user.id) return null;
    const meta = user.user_metadata || {};
    return {
        id: user.id,
        name: meta.full_name || meta.name || user.email || "Client",
        email: user.email || "",
        gymName: meta.gym_name || "",
        instagram: meta.instagram || "",
        accessToken: accessToken || ""
    };
}

async function gghqSupabaseRequest(path, options = {}) {
    const response = await fetch(SUPABASE_URL + path, options);
    let data = null;
    const text = await response.text();
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!response.ok) {
        const message =
            data?.msg ||
            data?.message ||
            data?.error_description ||
            data?.error ||
            text ||
            "Supabase request failed";
        throw new Error(message);
    }
    return data;
}

/* ---------- AUTH: REAL SUPABASE AUTH ---------- */

async function createAccount() {
    const nameInput = document.getElementById("signupName");
    const emailInput = document.getElementById("signupEmail");
    const passwordInput = document.getElementById("signupPassword");

    if (!nameInput || !emailInput || !passwordInput) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!name || !email || !password) {
        showToast("Please fill all details", "!");
        return;
    }

    if (password.length < 6) {
        showToast("Password must be at least 6 characters", "!");
        return;
    }

    showToast("Creating account...", "↑");

    try {
        const data = await gghqSupabaseRequest("/auth/v1/signup", {
            method: "POST",
            headers: gghqAuthHeaders("", true),
            body: JSON.stringify({
                email,
                password,
                data: {
                    full_name: name,
                    gym_name: "",
                    instagram: ""
                }
            })
        });

        if (data?.session?.access_token && data?.user) {
            gghqSaveAuthSession(data.session);
            currentUser = gghqUserFromAuth(
                data.user,
                data.session.access_token
            );
            saveSession(currentUser);
            nameInput.value = "";
            emailInput.value = "";
            passwordInput.value = "";
            updateAccountUI();
            fillClientDetails();
            showToast("Account created", "✓");
            showScreen("order");
            return;
        }

        showToast(
            "Account created — check your email to verify it",
            "✓"
        );
        showScreen("login");
    } catch (error) {
        console.error("Signup error:", error);
        showToast(error.message || "Signup failed", "!");
    }
}

async function loginUser() {
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");

    if (!emailInput || !passwordInput) return;

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!email || !password) {
        showToast("Enter email and password", "!");
        return;
    }

    showToast("Signing in...", "↑");

    try {
        const data = await gghqSupabaseRequest(
            "/auth/v1/token?grant_type=password",
            {
                method: "POST",
                headers: gghqAuthHeaders("", true),
                body: JSON.stringify({ email, password })
            }
        );

        if (!data?.access_token || !data?.user) {
            throw new Error("Login session was not returned by Supabase.");
        }

        gghqSaveAuthSession(data);
        currentUser = gghqUserFromAuth(
            data.user,
            data.access_token
        );
        saveSession(currentUser);

        emailInput.value = "";
        passwordInput.value = "";
        updateAccountUI();
        fillClientDetails();
        showToast("Login successful", "✓");
        showScreen("order");
    } catch (error) {
        console.error("Login error:", error);
        showToast(error.message || "Login failed", "!");
    }
}

async function logoutUser() {
    const session = gghqGetAuthSession();
    try {
        if (session?.access_token) {
            await fetch(SUPABASE_URL + "/auth/v1/logout", {
                method: "POST",
                headers: gghqAuthHeaders(session.access_token)
            });
        }
    } catch (error) {
        console.warn("Logout request failed:", error);
    }

    gghqClearAuth();
    clearSession();
    currentUser = null;
    clearAllSelectedVideos();
    window.GGHQ_REFERENCE_REEL_FILE = null;
    window.GGHQ_SONG_FILE = null;
    currentOrderId = null;
    currentOrder = {
        service: "",
        plan: "",
        clientName: "",
        gymName: "",
        instagram: "",
        goal: "",
        notes: "",
        instructions: "",
        creativeBrief: createEmptyCreativeBrief(),
        videos: []
    };
    updateAccountUI();
    showToast("Logged out", "✓");
    showScreen("home");
}

async function restoreSession() {
    const session = gghqGetAuthSession();

    if (!session?.access_token) {
        currentUser = null;
        updateAccountUI();
        return;
    }

    try {
        const user = await gghqSupabaseRequest("/auth/v1/user", {
            method: "GET",
            headers: gghqAuthHeaders(session.access_token)
        });

        currentUser = gghqUserFromAuth(
            user,
            session.access_token
        );
        saveSession(currentUser);
        updateAccountUI();
    } catch (error) {
        console.warn("Session restore failed:", error);
        gghqClearAuth();
        clearSession();
        currentUser = null;
        updateAccountUI();
    }
}

/* ---------- REFERENCE REEL + AUDIO UI ---------- */

function gghqEnsureReferenceInputs() {
    const screen = document.getElementById("order-project");
    if (!screen) return;

    let box = document.getElementById("gghqReferenceFilesBox");
    if (box) return;

    box = document.createElement("div");
    box.id = "gghqReferenceFilesBox";
    box.style.cssText = `
        margin-top:20px;
        padding:18px;
        border-radius:18px;
        background:rgba(145,92,255,0.07);
        border:1px solid rgba(145,92,255,0.30);
    `;

    box.innerHTML = `
        <div style="font-size:16px;font-weight:800;margin-bottom:6px;color:#fff;">
            Reference Files
        </div>
        <div style="font-size:12px;color:#999;margin-bottom:14px;line-height:1.5;">
            Optional: upload one reference reel and one song/audio file for this order.
        </div>

        <div style="display:grid;gap:12px;">
            <label style="display:block;padding:14px;border-radius:14px;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.03);cursor:pointer;">
                <strong style="display:block;color:#fff;margin-bottom:5px;">🎬 Reference Reel</strong>
                <span style="font-size:12px;color:#999;">Choose a video</span>
                <input id="referenceReelFile" type="file" accept="video/*" style="display:block;margin-top:10px;width:100%;">
            </label>

            <label style="display:block;padding:14px;border-radius:14px;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.03);cursor:pointer;">
                <strong style="display:block;color:#fff;margin-bottom:5px;">🎵 Song / Audio</strong>
                <span style="font-size:12px;color:#999;">Choose an audio file</span>
                <input id="songFile" type="file" accept="audio/*" style="display:block;margin-top:10px;width:100%;">
            </label>
        </div>

        <div id="referenceReelSelected"></div>
        <div id="songSelected"></div>
    `;

    screen.appendChild(box);
    box.scrollIntoView({ block: "nearest", behavior: "smooth" });

    const reelInput = document.getElementById("referenceReelFile");
    const songInput = document.getElementById("songFile");

    reelInput?.addEventListener("change", function () {
        const file = this.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("video/")) {
            this.value = "";
            showToast("Please select a video", "!");
            return;
        }
        window.GGHQ_REFERENCE_REEL_FILE = file;
        currentOrder.referenceReel = {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
        };
        renderReferenceReel();
        showToast("Reference Reel selected ✓", "✓");
    });

    songInput?.addEventListener("change", function () {
        const file = this.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("audio/")) {
            this.value = "";
            showToast("Please select an audio file", "!");
            return;
        }
        window.GGHQ_SONG_FILE = file;
        currentOrder.song = {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
        };
        renderSong();
        showToast("Song / Audio selected ✓", "✓");
    });
}

function gghqRenderSelectedFile(containerId, file, label) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!file) {
        container.innerHTML = "";
        return;
    }

    container.innerHTML = `
        <div class="gghq-selected-file"
             style="margin-top:12px;padding:11px 12px;border-radius:12px;
                    background:rgba(145,92,255,.10);
                    border:1px solid rgba(145,92,255,.28);
                    color:#d8c8ff;font-size:13px;line-height:1.45;">
            <strong style="display:block;color:#fff;font-size:14px;">
                ✓ ${escapeHTML(label)} selected
            </strong>
            <span>${escapeHTML(file.name)} — ${formatFileSize(file.size)}</span>
        </div>
    `;
}

function renderReferenceReel() {
    gghqRenderSelectedFile(
        "referenceReelSelected",
        window.GGHQ_REFERENCE_REEL_FILE || null,
        "Reference Reel"
    );
}

function renderSong() {
    gghqRenderSelectedFile(
        "songSelected",
        window.GGHQ_SONG_FILE || null,
        "Song / Audio"
    );
}

/* ---------- FILE UPLOAD ---------- */

function gghqSafeName(name) {
    return String(name || "file")
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .replace(/_+/g, "_");
}

function gghqUniquePart() {
    return window.crypto?.randomUUID
        ? window.crypto.randomUUID()
        : Date.now() + "-" + Math.random().toString(36).slice(2);
}

async function gghqUploadFile(file, orderRef, folder) {
    if (!file || !currentUser?.id) {
        throw new Error("User session is missing.");
    }

    const path = [
        currentUser.id,
        orderRef,
        folder,
        gghqUniquePart() + "-" + gghqSafeName(file.name)
    ].join("/");

    const encodedPath = path
        .split("/")
        .map(encodeURIComponent)
        .join("/");

    const session = gghqGetAuthSession();
    const token = session?.access_token || currentUser.accessToken;

    if (!token) throw new Error("Authentication session expired. Please login again.");

    const response = await fetch(
        SUPABASE_URL + "/storage/v1/object/" + GGHQ_BUCKET + "/" + encodedPath,
        {
            method: "POST",
            headers: {
                ...gghqAuthHeaders(token),
                "Content-Type": file.type || "application/octet-stream",
                "x-upsert": "false"
            },
            body: file
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Storage upload error:", errorText);
        throw new Error("Upload failed for " + file.name + ": " + errorText);
    }

    return {
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        path,
        url: SUPABASE_URL + "/storage/v1/object/public/" + GGHQ_BUCKET + "/" + encodedPath
    };
}

/* Keep the existing source-video API, but make it use the real auth token. */
async function uploadOrderVideos(orderId, files) {
    const selectedFiles = Array.from(files || []);
    const uploaded = [];

    for (const file of selectedFiles) {
        uploaded.push(
            await gghqUploadFile(file, orderId, "source-videos")
        );
    }

    return uploaded;
}

/* ---------- COMPLETE ORDER SUBMISSION ---------- */

async function submitOrder() {
    if (!currentUser?.id) {
        showScreen("login");
        showToast("Please login first", "!");
        return;
    }

    if (!currentOrder.service) {
        showToast("Please select a service", "!");
        showScreen("services");
        return;
    }

    if (!currentOrder.plan) currentOrder.plan = "standard";

    if (!saveStepOne()) {
        showToast("Please enter your client details", "!");
        showScreen("order");
        return;
    }

    if (typeof saveCreativeBrief === "function") {
        saveCreativeBrief();
    }

    const selectedVideoFiles = Array.from(
        window.GGHQ_SELECTED_VIDEO_FILES || []
    );

    if (!selectedVideoFiles.length) {
        showToast("Please select at least one video", "!");
        showScreen("order-upload");
        return;
    }

    const orderRef = "GGHQ-" + Date.now();
    const session = gghqGetAuthSession();
    const token = session?.access_token || currentUser.accessToken;

    if (!token) {
        showToast("Session expired. Please login again.", "!");
        showScreen("login");
        return;
    }

    const referenceFile = window.GGHQ_REFERENCE_REEL_FILE || null;
    const audioFile = window.GGHQ_SONG_FILE || null;

    const creativeBrief = {
        ...(currentOrder.creativeBrief || createEmptyCreativeBrief()),
        reference_reel: null,
        reference_audio: null,
        order_ref: orderRef
    };

    try {
        showToast("Uploading source videos...", "↑");
        const uploadedVideos = await uploadOrderVideos(
            orderRef,
            selectedVideoFiles
        );

        let referenceReel = null;
        if (referenceFile) {
            showToast("Uploading reference reel...", "↑");
            referenceReel = await gghqUploadFile(
                referenceFile,
                orderRef,
                "reference-reel"
            );
            creativeBrief.reference_reel = referenceReel;
        }

        let referenceAudio = null;
        if (audioFile) {
            showToast("Uploading audio...", "↑");
            referenceAudio = await gghqUploadFile(
                audioFile,
                orderRef,
                "audio"
            );
            creativeBrief.reference_audio = referenceAudio;
        }

        showToast("Saving order...", "↑");

        const payload = {
            user_id: currentUser.id,
            service: currentOrder.service,
            plan: currentOrder.plan,
            amount: 0,
            payment_status: "pending",
            order_status: "pending",
            gym_name: currentOrder.gymName || "",
            instagram_url: currentOrder.instagram || "",
            raw_video_urls: uploadedVideos,
            final_video_url: "",
            creative_brief: {
                goal: currentOrder.goal || "",
                notes: currentOrder.notes || "",
                trend: creativeBrief.trend || "",
                song: creativeBrief.song || "",
                editingStyle: creativeBrief.editingStyle || "",
                shotInstructions: creativeBrief.shotInstructions || "",
                hook: creativeBrief.hook || "",
                cta: creativeBrief.cta || "",
                specialInstructions: creativeBrief.specialInstructions || "",
                reference_reel: referenceReel,
                reference_audio: referenceAudio,
                order_ref: orderRef
            },
            created_at: new Date().toISOString()
        };

        const response = await fetch(
            SUPABASE_URL + "/rest/v1/orders",
            {
                method: "POST",
                headers: {
                    ...gghqAuthHeaders(token, true),
                    "Prefer": "return=representation"
                },
                body: JSON.stringify(payload)
            }
        );

        const responseText = await response.text();
        let responseData = null;
        try { responseData = responseText ? JSON.parse(responseText) : null; } catch {}

        if (!response.ok) {
            console.error("ORDER INSERT ERROR:", responseText);
            throw new Error(
                responseData?.message ||
                responseData?.details ||
                responseData?.hint ||
                responseText ||
                "Order could not be saved"
            );
        }

        const savedRow = Array.isArray(responseData)
            ? responseData[0]
            : responseData;

        const localOrder = {
            id: orderRef,
            dbId: savedRow?.id || null,
            userId: currentUser.id,
            userEmail: currentUser.email,
            service: currentOrder.service,
            plan: currentOrder.plan,
            clientName: currentOrder.clientName,
            gymName: currentOrder.gymName,
            instagram: currentOrder.instagram,
            goal: currentOrder.goal,
            notes: currentOrder.notes,
            instructions: currentOrder.instructions,
            creativeBrief: payload.creative_brief,
            videos: uploadedVideos,
            status: "Submitted",
            deliveryStatus: "Editing in Progress",
            finalVideo: "",
            createdAt: payload.created_at
        };

        const orders = getOrders().filter(
            order => order.id !== orderRef
        );
        orders.push(localOrder);
        saveOrders(orders);

        currentOrderId = orderRef;
        currentOrder.videos = uploadedVideos;
        currentOrder.creativeBrief = payload.creative_brief;
        currentOrder.referenceReel = referenceReel;
        currentOrder.song = referenceAudio;

        showToast("Order submitted successfully", "✓");

        clearAllSelectedVideos();
        window.GGHQ_REFERENCE_REEL_FILE = null;
        window.GGHQ_SONG_FILE = null;

        const reelInput = document.getElementById("referenceReelFile");
        const songInput = document.getElementById("songFile");
        if (reelInput) reelInput.value = "";
        if (songInput) songInput.value = "";
        renderReferenceReel();
        renderSong();

        setTimeout(() => {
            renderOrders();
            showScreen("account");
        }, 400);
    } catch (error) {
        console.error("FINAL ORDER ERROR:", error);
        showToast(error.message || "Order could not be submitted", "!");
    }
}

/* ---------- SUPABASE ORDER HISTORY ---------- */

async function gghqFetchMyOrders() {
    if (!currentUser?.id) return [];

    const session = gghqGetAuthSession();
    const token = session?.access_token || currentUser.accessToken;
    if (!token) return [];

    const query =
        "/rest/v1/orders?select=*&user_id=eq." +
        encodeURIComponent(currentUser.id) +
        "&order=created_at.desc";

    const rows = await gghqSupabaseRequest(query, {
        method: "GET",
        headers: gghqAuthHeaders(token)
    });

    return (Array.isArray(rows) ? rows : []).map(row => {
        const brief = row.creative_brief || {};
        return {
            id: brief.order_ref || String(row.id),
            dbId: row.id,
            userId: row.user_id,
            userEmail: currentUser.email,
            service: row.service,
            plan: row.plan,
            clientName: currentUser.name,
            gymName: row.gym_name || "",
            instagram: row.instagram_url || "",
            goal: brief.goal || "",
            notes: brief.notes || "",
            instructions: brief.specialInstructions || "",
            creativeBrief: brief,
            videos: Array.isArray(row.raw_video_urls)
                ? row.raw_video_urls
                : [],
            status: row.order_status || "pending",
            deliveryStatus: row.order_status === "completed"
                ? "Completed"
                : "Editing in Progress",
            finalVideo: row.final_video_url || "",
            createdAt: row.created_at
        };
    });
}

async function renderOrders() {
    const list = document.getElementById("ordersList");
    if (!list) return;

    list.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">⏳</div>
            <h3>Loading Orders...</h3>
            <p>Please wait.</p>
        </div>
    `;

    if (!currentUser) {
        list.innerHTML = `
            <div class="empty-state">
                <h3>Login Required</h3>
                <p>Please login to view your orders.</p>
            </div>
        `;
        return;
    }

    try {
        const orders = await gghqFetchMyOrders();

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

        list.innerHTML = "";

        orders.forEach(order => {
            const card = document.createElement("button");
            card.type = "button";
            card.className = "order-history-card";

            const service = order.service === "reel-editing"
                ? "Reel Editing"
                : "Transformation Reel";
            const plan = order.plan === "premium"
                ? "Premium"
                : "Standard";

            card.innerHTML = `
                <div class="order-history-icon">📦</div>
                <div class="order-history-info">
                    <strong>${escapeHTML(service)}</strong>
                    <small>${escapeHTML(plan)} • ${escapeHTML(order.gymName)}</small>
                    <span class="order-status-small">${escapeHTML(order.deliveryStatus)}</span>
                </div>
                <span class="account-menu-arrow">→</span>
            `;

            card.addEventListener("click", () => {
                currentOrderId = order.id;
                renderOrderDetails(order);
                showScreen("order-details");
            });

            list.appendChild(card);
        });
    } catch (error) {
        console.error("Order history error:", error);
        list.innerHTML = `
            <div class="empty-state">
                <h3>Could not load orders</h3>
                <p>${escapeHTML(error.message || "Please try again.")}</p>
            </div>
        `;
    }
}

/* ---------- BETTER REVIEW ---------- */

function updateReview() {
    const service = currentOrder.service === "reel-editing"
        ? "Reel Editing"
        : currentOrder.service === "transformation"
            ? "Transformation Reel"
            : "—";
    const plan = currentOrder.plan === "premium"
        ? "Premium"
        : "Standard";

    setText("reviewService", service);
    setText("reviewPlan", plan);
    setText("reviewClient", currentOrder.clientName);
    setText("reviewGym", currentOrder.gymName);
    setText("reviewInstagram", currentOrder.instagram);
    setText(
        "reviewVideos",
        (window.GGHQ_SELECTED_VIDEO_FILES || []).length + " video(s)"
    );

    gghqEnsureReferenceInputs();
}

/* ---------- RESET ORDER: do not leave old reference files behind ---------- */

const gghqOriginalStartOrder = startOrder;
startOrder = function () {
    gghqOriginalStartOrder();
    window.GGHQ_REFERENCE_REEL_FILE = null;
    window.GGHQ_SONG_FILE = null;
    currentOrder.referenceReel = null;
    currentOrder.song = null;
    gghqEnsureReferenceInputs();
};

/* ---------- INITIALIZE V2 ---------- */

function gghqInitializeV2() {
    gghqEnsureReferenceInputs();
    restoreSession();

    const observer = new MutationObserver(() => {
        gghqEnsureReferenceInputs();
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log("Gym Growth HQ V2 production patch loaded.");
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", gghqInitializeV2, { once: true });
} else {
    gghqInitializeV2();
}

/* =========================================================
   END GGHQ V2 PRODUCTION PATCH
   ========================================================= */

/* =========================================================
   GGHQ CUSTOMER FLOW — SURGICAL FIX
   Original application/upload/auth/order code is preserved.
   Only obsolete customer-facing UI/navigation is changed.
   ========================================================= */

function gghqPrepareCustomerProjectScreen() {
    const screen = document.getElementById("order-project");
    if (!screen) return;

    const legacyBrief = document.getElementById("gghqCreativeBrief");
    if (legacyBrief) legacyBrief.remove();

    const goal = document.getElementById("projectGoal");
    if (goal) {
        let candidate = goal.parentElement;

        for (let i = 0; i < 5 && candidate && candidate !== screen; i++) {
            const text = (candidate.textContent || "")
                .replace(/\s+/g, " ")
                .trim();

            if (
                /main goal/i.test(text) &&
                /select your goal/i.test(text) &&
                !/reference reel/i.test(text) &&
                !/song\s*\/\s*audio/i.test(text)
            ) {
                candidate.style.display = "none";
                break;
            }

            candidate = candidate.parentElement;
        }

        goal.style.display = "none";
    }

    gghqEnsureReferenceInputs();
    renderReferenceReel();
    renderSong();
}

/* Use the existing static Review rows instead of creating duplicate rows. */
function gghqSetReviewRow(labelText, value) {
    const review = document.getElementById("order-review");
    if (!review) return;

    const wanted = labelText.toLowerCase();

    const label = Array.from(review.querySelectorAll("*")).find(el =>
        el.children.length === 0 &&
        (el.textContent || "").trim().toLowerCase() === wanted
    );

    if (!label || !label.parentElement) return;

    const row = label.parentElement;
    const children = Array.from(row.children);

    if (children.length >= 2) {
        children[children.length - 1].textContent =
            value || "Not added";
    }
}

function gghqUpdateReferenceRowsInReview() {
    const reel = window.GGHQ_REFERENCE_REEL_FILE || null;
    const audio = window.GGHQ_SONG_FILE || null;

    gghqSetReviewRow(
        "Reference Reel",
        reel ? "✓ " + reel.name : "Not added"
    );

    gghqSetReviewRow(
        "Song / Audio",
        audio ? "✓ " + audio.name : "Not added"
    );
}

/* Wrap the final V2 definitions without deleting the originals. */
const gghqMasterOriginalUpdateReview = updateReview;
updateReview = function () {
    gghqMasterOriginalUpdateReview();
    setTimeout(gghqUpdateReferenceRowsInReview, 0);
};

const gghqMasterOriginalShowScreen = showScreen;
showScreen = function (id) {
    gghqMasterOriginalShowScreen(id);

    if (id === "order-project") {
        setTimeout(gghqPrepareCustomerProjectScreen, 0);
    }

    if (id === "order-review") {
        setTimeout(gghqUpdateReferenceRowsInReview, 0);
    }
};
