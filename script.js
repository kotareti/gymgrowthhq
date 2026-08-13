/* =========================================================
   GYM GROWTH HQ
   FINAL SCRIPT.JS
   REFERENCE FILES + VIDEO UPLOAD + ORDER HISTORY
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
        gghqCleanBriefUI();
        gghqEnsureReferenceInputs();
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
   ORDER NEXT
   ========================================================= */

function goOrderNext(step) {

    // Step 2: client details -> project/reference files
    if (step === 2) {
        if (!saveStepOne()) {
            showToast("Please enter your details", "!");
            return;
        }
        showScreen("order-project");
        return;
    }

    // Step 3: reference files -> raw video upload
    if (step === 3) {
        showScreen("order-upload");
        return;
    }

    // Step 4: raw videos -> review. Creative Brief / Instructions are removed.
    if (step === 4) {
        updateReview();
        showScreen("order-review");
        return;
    }

    // Legacy step 5 is intentionally skipped.
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
        showScreen("order-upload");
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

    gghqSetReviewReferenceRows();
    gghqCleanBriefUI();
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
    gghqApplyCleanFlow();
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
   CLEAN CUSTOMER FLOW — NO CREATIVE BRIEF
   ========================================================= */

function gghqCleanBriefUI() {
    const generatedBrief = document.getElementById("gghqCreativeBrief");
    if (generatedBrief) generatedBrief.remove();

    const instructionsScreen = document.getElementById("order-instructions");
    if (instructionsScreen) {
        instructionsScreen.style.display = "none";
        instructionsScreen.setAttribute("aria-hidden", "true");
    }

    // Remove any old review rows/cards that came from the legacy Creative Brief.
    const legacyReview = document.getElementById("gghqReviewCreativeBrief");
    if (legacyReview) legacyReview.remove();
}

function gghqFileLabel(file, emptyText) {
    if (!file) return emptyText;
    return "✓ " + (file.name || "Selected file");
}

function gghqSetReviewReferenceRows() {
    const rawVideosEl = document.getElementById("reviewVideos");
    if (!rawVideosEl) return;

    const existing = document.getElementById("gghqReviewReferenceRows");
    if (existing) existing.remove();

    const reelFile = window.GGHQ_REFERENCE_REEL_FILE || null;
    const audioFile = window.GGHQ_SONG_FILE || null;

    const wrapper = document.createElement("div");
    wrapper.id = "gghqReviewReferenceRows";
    wrapper.style.cssText = "display:block;width:100%;";

    const makeRow = (label, value) => {
        const row = document.createElement("div");
        row.style.cssText = "display:flex;justify-content:space-between;gap:20px;align-items:center;padding:14px 0;border-bottom:1px solid rgba(255,255,255,.08);";

        const left = document.createElement("div");
        left.textContent = label;
        left.style.cssText = "color:#8f8f9d;font-size:15px;";

        const right = document.createElement("div");
        right.textContent = value;
        right.style.cssText = "color:#fff;font-size:14px;font-weight:700;text-align:right;max-width:62%;overflow-wrap:anywhere;";

        row.append(left, right);
        return row;
    };

    wrapper.append(
        makeRow("Reference Reel", gghqFileLabel(reelFile, "Not added")),
        makeRow("Song / Audio", gghqFileLabel(audioFile, "Not added"))
    );

    rawVideosEl.parentElement?.insertBefore(wrapper, rawVideosEl);

    // Remove the legacy "Editing Instructions" review row if it exists in the HTML.
    const reviewContainer = rawVideosEl.parentElement;
    if (reviewContainer) {
        Array.from(reviewContainer.children).forEach((row) => {
            if (row.id === "gghqReviewReferenceRows") return;
            const text = (row.textContent || "").trim();
            if (/^Editing Instructions\s*—?\s*$/i.test(text) || text.startsWith("Editing Instructions")) {
                row.remove();
            }
        });
    }
}

// Ensure the customer only sees Reference Reel + Song/Audio in the project step.
function gghqApplyCleanFlow() {
    gghqCleanBriefUI();
    gghqEnsureReferenceInputs();
}

/* =========================================================
   END GGHQ V2 PRODUCTION PATCH
   ========================================================= */


/* ---------- HARD DISABLE LEGACY BRIEF / INSTRUCTIONS UI ---------- */
(function gghqFinalCleanBoot() {
    const clean = () => {
        gghqCleanBriefUI();
        gghqSetReviewReferenceRows();
    };
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", clean, { once: true });
    } else {
        clean();
    }
})();
