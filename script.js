/* =========================================================
   GYM GROWTH HQ
   FINAL SCRIPT.JS
   2 SERVICES ONLY
   REEL EDITING + TRANSFORMATION
   INSTAGRAM PROFILE
   REFERENCE REEL UPLOAD
   SONG/AUDIO UPLOAD
   RAW VIDEO UPLOAD
   ONE-TIME EDITING INSTRUCTIONS
   SUPABASE + ORDER HISTORY + VIDEO DELIVERY
   ========================================================= */


const USERS_KEY = "gghq_users";
const SESSION_KEY = "gghq_session";
const ORDERS_KEY = "gghq_orders";


/* =========================================================
   SUPABASE
   ========================================================= */

const SUPABASE_URL =
    "https://gcxsdpjkzrxmgbhcoeqn.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_Pcj2mwFWysWV2sQHwjAm_Q_qtv0I5hS";


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let currentUser = null;
let currentOrderId = null;

let currentOrder = {
    service: "",
    plan: "",
    clientName: "",
    gymName: "",
    instagram: "",

    goal: "",

    referenceReel: null,

    song: null,

    editingInstructions: "",

    hook: "",

    cta: "",

    notes: "",

    instructions: "",

    videos: []
};


/* =========================================================
   SELECTED FILES
   ========================================================= */

window.GGHQ_SELECTED_VIDEO_FILES =
    window.GGHQ_SELECTED_VIDEO_FILES || [];

window.GGHQ_REFERENCE_REEL_FILE =
    window.GGHQ_REFERENCE_REEL_FILE || null;

window.GGHQ_SONG_FILE =
    window.GGHQ_SONG_FILE || null;


/* =========================================================
   BASIC HELPERS
   ========================================================= */

function getInitial(name) {

    if (!name) {
        return "?";
    }

    return String(name)
        .trim()
        .charAt(0)
        .toUpperCase();
}


function setText(id, value) {

    const element =
        document.getElementById(id);

    if (!element) {
        return;
    }

    element.textContent =
        value || "—";
}


function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
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
        text.textContent =
            message;
    }


    if (iconElement) {
        iconElement.textContent =
            icon;
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
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

                toast.setAttribute(
                    "aria-hidden",
                    "true"
                );

            },
            2500
        );
}


/* =========================================================
   EMPTY ORDER
   ========================================================= */

function createEmptyOrder() {

    return {

        service: "",

        plan: "",

        clientName: "",

        gymName: "",

        instagram: "",

        goal: "",

        referenceReel: null,

        song: null,

        editingInstructions: "",

        hook: "",

        cta: "",

        notes: "",

        instructions: "",

        videos: []
    };
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
   SCREEN NAVIGATION
   ========================================================= */

function showScreen(id) {

    document
        .querySelectorAll(".app-screen")
        .forEach(
            screen => {

                screen.classList.remove(
                    "active-screen"
                );
            }
        );


    const screen =
        document.getElementById(id);


    if (!screen) {

        console.warn(
            "GGHQ: Screen not found:",
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


    if (id === "order") {

        fillClientDetails();

        renderReferenceReel();

        renderSong();
    }


    if (id === "order-project") {

        restoreProjectFields();
    }


    if (id === "order-upload") {

        renderSelectedVideos();
    }


    if (id === "order-review") {

        saveProjectFields();

        saveAdditionalInstructions();

        updateReview();
    }


    if (id === "orders") {

        renderOrders();
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


    if (id === "video-delivery") {

        const order =
            findCurrentOrder();

        if (order) {

            renderVideoDelivery(
                order
            );
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

    if (!currentUser) {
        return;
    }


    const users =
        getUsers();


    const index =
        users.findIndex(
            user =>
                user.id ===
                currentUser.id
        );


    if (index === -1) {
        return;
    }


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

    if (!currentUser) {
        return;
    }


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

    clearReferenceReel();

    clearSong();


    currentOrder =
        createEmptyOrder();


    currentOrder.clientName =
        currentUser.name || "";


    currentOrder.gymName =
        currentUser.gymName || "";


    currentOrder.instagram =
        currentUser.instagram || "";


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


    if (
        !emailInput ||
        !passwordInput
    ) {
        return;
    }


    const email =
        emailInput.value
            .trim()
            .toLowerCase();


    const password =
        passwordInput.value;


    if (
        !email ||
        !password
    ) {

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


    saveSession(currentUser);


    updateAccountUI();

    fillClientDetails();


    emailInput.value = "";

    passwordInput.value = "";


    showToast(
        "Login successful",
        "✓"
    );


    showScreen("services");
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


    showScreen("services");
}


/* =========================================================
   LOGOUT
   ========================================================= */

function logoutUser() {

    currentUser = null;

    clearSession();


    clearAllSelectedVideos();

    clearReferenceReel();

    clearSong();


    currentOrder =
        createEmptyOrder();


    currentOrderId =
        null;


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

function selectService(
    service
) {

    const allowed = [

        "reel-editing",

        "transformation"
    ];


    if (
        !allowed.includes(service)
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
    plan = "standard"
) {

    const allowed = [

        "reel-editing",

        "transformation"
    ];


    if (
        !allowed.includes(service)
    ) {
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


    if (
        !name ||
        !gym
    ) {
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
   PROJECT FIELDS
   ========================================================= */

function saveProjectFields() {

    const goal =
        document.getElementById(
            "projectGoal"
        );


    const instructions =
        document.getElementById(
            "editingInstructions"
        );


    const hook =
        document.getElementById(
            "projectHook"
        );


    const cta =
        document.getElementById(
            "projectCTA"
        );


    currentOrder.goal =
        goal
            ? goal.value.trim()
            : "";


    currentOrder.editingInstructions =
        instructions
            ? instructions.value.trim()
            : "";


    currentOrder.hook =
        hook
            ? hook.value.trim()
            : "";


    currentOrder.cta =
        cta
            ? cta.value.trim()
            : "";
}


function restoreProjectFields() {

    const goal =
        document.getElementById(
            "projectGoal"
        );


    const instructions =
        document.getElementById(
            "editingInstructions"
        );


    const hook =
        document.getElementById(
            "projectHook"
        );


    const cta =
        document.getElementById(
            "projectCTA"
        );


    if (goal) {

        goal.value =
            currentOrder.goal || "";
    }


    if (instructions) {

        instructions.value =
            currentOrder.editingInstructions ||
            "";
    }


    if (hook) {

        hook.value =
            currentOrder.hook || "";
    }


    if (cta) {

        cta.value =
            currentOrder.cta || "";
    }


    renderReferenceReel();

    renderSong();
}


/* =========================================================
   ADDITIONAL INSTRUCTIONS
   ========================================================= */

function saveAdditionalInstructions() {

    const element =
        document.getElementById(
            "specialInstructions"
        );


    if (element) {

        currentOrder.instructions =
            element.value.trim();
    }
}


/* =========================================================
   ORDER NAVIGATION
   ========================================================= */

function goOrderNext(step) {

    if (step === 2) {

        if (
            !saveStepOne()
        ) {

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

        saveProjectFields();


        showScreen(
            "order-upload"
        );

        return;
    }


    if (step === 4) {

        if (
            !window
                .GGHQ_SELECTED_VIDEO_FILES
                .length
        ) {

            showToast(
                "Please select at least one video",
                "!"
            );

            return;
        }


        showScreen(
            "order-instructions"
        );

        return;
    }


    if (step === 5) {

        saveAdditionalInstructions();

        updateReview();


        showScreen(
            "order-review"
        );

        return;
    }
}


function goOrderBack(step) {

    if (step === 1) {

        showScreen(
            "order"
        );

        return;
    }


    if (step === 2) {

        showScreen(
            "order-project"
        );

        return;
    }


    if (step === 3) {

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
}


/* =========================================================
   FILE SIZE
   ========================================================= */

function formatFileSize(
    bytes
) {

    if (!bytes) {
        return "";
    }


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


/* =========================================================
   REFERENCE REEL
   ========================================================= */

function setupReferenceReel() {

    const input =
        document.getElementById(
            "referenceReelFile"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "change",
        function() {

            const file =
                this.files &&
                this.files[0];


            if (!file) {
                return;
            }


            if (
                !file.type.startsWith(
                    "video/"
                )
            ) {

                showToast(
                    "Please select a video",
                    "!"
                );

                return;
            }


            window.GGHQ_REFERENCE_REEL_FILE =
                file;


            currentOrder.referenceReel = {

                name:
                    file.name,

                size:
                    file.size,

                type:
                    file.type,

                lastModified:
                    file.lastModified
            };


            renderReferenceReel();


            showToast(
                "Reference reel selected",
                "✓"
            );
        }
    );
}


function renderReferenceReel() {

    const container =
        document.getElementById(
            "referenceReelSelected"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const file =
        window.GGHQ_REFERENCE_REEL_FILE;


    if (!file) {

        container.innerHTML = `
            <div class="video-empty-message">
                No reference reel selected yet.
            </div>
        `;

        return;
    }


    container.innerHTML = `

        <div style="
            margin-top:14px;
            padding:14px;
            border-radius:14px;
            background:rgba(145,92,255,0.10);
            border:1px solid rgba(145,92,255,0.35);
        ">

            <div style="
                font-weight:700;
                color:#ffffff;
                font-size:13px;
            ">
                ✓ Reference Reel Selected
            </div>

            <div style="
                margin-top:5px;
                color:#9a9aa7;
                font-size:12px;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
            ">
                ${escapeHTML(file.name)}
            </div>

            <div style="
                margin-top:4px;
                color:#777783;
                font-size:11px;
            ">
                ${formatFileSize(file.size)}
            </div>

        </div>
    `;
}


function clearReferenceReel() {

    window.GGHQ_REFERENCE_REEL_FILE =
        null;


    currentOrder.referenceReel =
        null;


    const input =
        document.getElementById(
            "referenceReelFile"
        );


    if (input) {
        input.value = "";
    }


    renderReferenceReel();
}


/* =========================================================
   SONG / AUDIO
   ========================================================= */

function setupSongInput() {

    const input =
        document.getElementById(
            "songFile"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "change",
        function() {

            const file =
                this.files &&
                this.files[0];


            if (!file) {
                return;
            }


            if (
                !file.type.startsWith(
                    "audio/"
                )
            ) {

                showToast(
                    "Please select an audio file",
                    "!"
                );

                return;
            }


            window.GGHQ_SONG_FILE =
                file;


            currentOrder.song = {

                name:
                    file.name,

                size:
                    file.size,

                type:
                    file.type,

                lastModified:
                    file.lastModified
            };


            renderSong();


            showToast(
                "Song / audio selected",
                "✓"
            );
        }
    );
}


function renderSong() {

    const container =
        document.getElementById(
            "songSelected"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const file =
        window.GGHQ_SONG_FILE;


    if (!file) {

        container.innerHTML = `
            <div class="video-empty-message">
                No song selected yet.
            </div>
        `;

        return;
    }


    container.innerHTML = `

        <div style="
            margin-top:14px;
            padding:14px;
            border-radius:14px;
            background:rgba(145,92,255,0.10);
            border:1px solid rgba(145,92,255,0.35);
        ">

            <div style="
                font-weight:700;
                color:#ffffff;
                font-size:13px;
            ">
                ✓ Song / Audio Selected
            </div>

            <div style="
                margin-top:5px;
                color:#9a9aa7;
                font-size:12px;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
            ">
                ${escapeHTML(file.name)}
            </div>

            <div style="
                margin-top:4px;
                color:#777783;
                font-size:11px;
            ">
                ${formatFileSize(file.size)}
            </div>

        </div>
    `;
}


function clearSong() {

    window.GGHQ_SONG_FILE =
        null;


    currentOrder.song =
        null;


    const input =
        document.getElementById(
            "songFile"
        );


    if (input) {
        input.value = "";
    }


    renderSong();
}


/* =========================================================
   RAW VIDEO FILES
   ========================================================= */

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


    if (!container) {
        return;
    }


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
                formatFileSize(
                    file.size
                );


            info.appendChild(
                name
            );


            info.appendChild(
                size
            );


            card.appendChild(
                video
            );


            card.appendChild(
                number
            );


            card.appendChild(
                badge
            );


            card.appendChild(
                info
            );


            gallery.appendChild(
                card
            );
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


    if (!input) {
        return;
    }


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
   ORDER REVIEW
   ========================================================= */

function updateReview() {

    const serviceMap = {

        "reel-editing":
            "Reel Editing",

        "transformation":
            "Transformation Reel"
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
        "reviewReference",
        currentOrder.referenceReel?.name ||
        "Not selected"
    );


    setText(
        "reviewSong",
        currentOrder.song?.name ||
        "Not selected"
    );


    setText(
        "reviewVideos",
        (
            currentOrder.videos ||
            []
        ).length +
        " video(s)"
    );


    setText(
        "reviewEditingInstructions",
        currentOrder.editingInstructions ||
        "Not provided"
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
   SUPABASE UPLOAD
   ========================================================= */

async function uploadFileToSupabase(
    orderId,
    file,
    folder
) {

    if (!file) {
        return null;
    }


    if (!currentUser) {

        throw new Error(
            "User not logged in"
        );
    }


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
        folder +
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
                        "application/octet-stream",

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
            "Supabase upload error:",
            errorText
        );


        throw new Error(
            "Upload failed: " +
            file.name
        );
    }


    return {

        name:
            file.name,

        size:
            file.size,

        type:
            file.type ||
            "application/octet-stream",

        url:
            SUPABASE_URL +
            "/storage/v1/object/public/order-videos/" +
            encodedPath
    };
}


/* =========================================================
   UPLOAD RAW VIDEOS
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


    const uploaded = [];


    for (
        const file of selectedFiles
    ) {

        const result =
            await uploadFileToSupabase(
                orderId,
                file,
                "raw-videos"
            );


        if (result) {

            uploaded.push(
                result
            );
        }
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

        showScreen(
            "login"
        );

        return;
    }


    if (!currentOrder.service) {

        showToast(
            "Please select a service",
            "!"
        );

        showScreen(
            "services"
        );

        return;
    }


    if (!currentOrder.plan) {

        currentOrder.plan =
            "standard";
    }


    if (!saveStepOne()) {

        showToast(
            "Please enter your name and gym name",
            "!"
        );

        showScreen(
            "order"
        );

        return;
    }


    saveProjectFields();

    saveAdditionalInstructions();


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

        referenceReel:
            null,

        song:
            null,

        editingInstructions:
            currentOrder.editingInstructions,

        hook:
            currentOrder.hook,

        cta:
            currentOrder.cta,

        notes:
            currentOrder.notes,

        instructions:
            currentOrder.instructions,

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

        /* =================================================
           UPLOAD REFERENCE REEL
           ================================================= */

        if (
            window.GGHQ_REFERENCE_REEL_FILE
        ) {

            showToast(
                "Uploading reference reel...",
                "⬆"
            );


            order.referenceReel =
                await uploadFileToSupabase(
                    orderId,
                    window.GGHQ_REFERENCE_REEL_FILE,
                    "reference-reel"
                );
        }


        /* =================================================
           UPLOAD SONG
           ================================================= */

        if (
            window.GGHQ_SONG_FILE
        ) {

            showToast(
                "Uploading song...",
                "🎵"
            );


            order.song =
                await uploadFileToSupabase(
                    orderId,
                    window.GGHQ_SONG_FILE,
                    "song"
                );
        }


        /* =================================================
           UPLOAD RAW VIDEOS
           ================================================= */

        showToast(
            "Uploading your videos...",
            "⬆"
        );


        order.videos =
            await uploadOrderVideos(
                orderId,
                selectedFiles
            );


        /* =================================================
           SAVE ORDER TO SUPABASE
           ================================================= */

        showToast(
            "Saving your order...",
            "⏳"
        );


        const creativeBrief = {

            goal:
                order.goal || "",

            editingInstructions:
                order.editingInstructions || "",

            hook:
                order.hook || "",

            cta:
                order.cta || "",

            additionalNotes:
                order.instructions || "",

            referenceReel:
                order.referenceReel || null,

            song:
                order.song || null
        };


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
                                order.service ===
                                "transformation"
                                    ? 299
                                    : 199,

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

                            creative_brief:
                                creativeBrief,

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


        /* =================================================
           LOCAL BACKUP
           ================================================= */

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


        /* =================================================
           SUCCESS
           ================================================= */

        showToast(
            "Order submitted successfully!",
            "✓"
        );


        clearAllSelectedVideos();

        clearReferenceReel();

        clearSong();


        currentOrder =
            createEmptyOrder();


        currentOrder.clientName =
            currentUser.name || "";


        currentOrder.gymName =
            currentUser.gymName || "";


        currentOrder.instagram =
            currentUser.instagram || "";


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


    if (!list) {
        return;
    }


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
                        "Transformation Reel"
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
                            ${escapeHTML
