/* =========================================================
   GYM GROWTH HQ
   MAIN APP SCRIPT
   ========================================================= */


/* =========================================================
   STORAGE KEYS
   ========================================================= */

const USERS_KEY = "gghq_users";
const SESSION_KEY = "gghq_session";
const ORDERS_KEY = "gghq_orders";


/* =========================================================
   APP STATE
   ========================================================= */

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
   HELPERS
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


function getSession() {

    try {

        return JSON.parse(
            localStorage.getItem(SESSION_KEY)
        );

    } catch {

        return null;

    }

}


function saveSession(user) {

    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(user)
    );

}


function clearSession() {

    localStorage.removeItem(SESSION_KEY);

}


function getInitial(name) {

    if (!name) return "?";

    return name
        .trim()
        .charAt(0)
        .toUpperCase();

}


function showToast(message, icon = "✓") {

    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");

    const toastIcon =
        document.getElementById("toastIcon");

    if (!toast) return;

    toastMessage.textContent = message;
    toastIcon.textContent = icon;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* =========================================================
   SCREEN NAVIGATION
   ========================================================= */

function showScreen(screenId) {

    const screens =
        document.querySelectorAll(".app-screen");

    screens.forEach(screen => {

        screen.classList.remove("active-screen");

    });


    const target =
        document.getElementById(screenId);

    if (!target) return;

    target.classList.add("active-screen");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    updateAccountUI();

}


/* =========================================================
   AUTH CHECK
   ========================================================= */

function isLoggedIn() {

    return !!currentUser;

}


/*
   IMPORTANT:

   If user is already logged in,
   NEVER send them to Login again.
*/

function goToOrder() {

    if (isLoggedIn()) {

        showScreen("order");

        fillLoggedInClientDetails();

    } else {

        showScreen("login");

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

    const homeAccountButton =
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
            getInitial(currentUser.name);


        /* HEADER */

        if (headerButton)
            headerButton.style.display =
                "flex";

        if (headerInitial)
            headerInitial.textContent =
                initial;

        if (headerName)
            headerName.textContent =
                currentUser.name;


        /* HOME */

        if (homeCard)
            homeCard.style.display =
                "flex";

        if (homeAccountButton)
            homeAccountButton.style.display =
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


        /* ACCOUNT */

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

        /* HEADER */

        if (headerButton)
            headerButton.style.display =
                "none";


        /* HOME */

        if (homeCard)
            homeCard.style.display =
                "none";

        if (homeAccountButton)
            homeAccountButton.style.display =
                "flex";

    }

}


/* =========================================================
   FILL CLIENT DETAILS
   ========================================================= */

function fillLoggedInClientDetails() {

    if (!currentUser) return;

    const nameInput =
        document.getElementById(
            "clientName"
        );

    if (
        nameInput &&
        !nameInput.value
    ) {

        nameInput.value =
            currentUser.name || "";

    }

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


    const users = getUsers();


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


    /* REAL PASSWORD CHECK */

    if (
        user.password !== password
    ) {

        showToast(
            "Wrong password",
            "!"
        );

        return;

    }


    currentUser = {
        id: user.id,
        name: user.name,
        email: user.email
    };


    saveSession(currentUser);

    updateAccountUI();

    fillLoggedInClientDetails();


    emailInput.value = "";
    passwordInput.value = "";


    showToast(
        "Login successful",
        "✓"
    );


    /*
       IMPORTANT:

       Login complete.
       Go directly to the order.

       NO SECOND LOGIN.
    */

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


    const name =
        nameInput.value.trim();

    const email =
        emailInput.value
            .trim()
            .toLowerCase();

    const password =
        passwordInput.value;


    if (!name || !email || !password) {

        showToast(
            "Please fill all details",
            "!"
        );

        return;

    }


    if (password.length < 6) {

        showToast(
            "Password must be 6+ characters",
            "!"
        );

        return;

    }


    const users = getUsers();


    const existing =
        users.find(
            user =>
                user.email === email
        );


    if (existing) {

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

        name: name,

        email: email,

        password: password,

        createdAt:
            new Date().toISOString()

    };


    users.push(newUser);

    saveUsers(users);


    currentUser = {

        id: newUser.id,

        name: newUser.name,

        email: newUser.email

    };


    saveSession(currentUser);

    updateAccountUI();

    fillLoggedInClientDetails();


    nameInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";


    showToast(
        "Account created",
        "✓"
    );


    /*
       Directly continue to order.
       No second login page.
    */

    showScreen("order");

}


/* =========================================================
   LOGOUT
   ========================================================= */

function logoutUser() {

    currentUser = null;

    clearSession();

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

    /*
       Promotional Video intentionally removed.
    */

    if (
        service !== "reel-editing" &&
        service !== "transformation"
    ) {

        return;

    }


    currentOrder.service =
        service;


    currentOrder.plan = "";


    if (
        service === "reel-editing"
    ) {

        showScreen(
            "plan-reel-editing"
        );

        return;

    }


    if (
        service === "transformation"
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

    /*
       Only valid services.
    */

    if (
        service !== "reel-editing" &&
        service !== "transformation"
    ) {

        return;

    }


    if (
        plan !== "standard" &&
        plan !== "premium"
    ) {

        return;

    }


    currentOrder.service =
        service;

    currentOrder.plan =
        plan;


    /*
       Already logged in?
       → Go directly to Order.

       Not logged in?
       → Login first.
    */

    if (isLoggedIn()) {

        showScreen("order");

        fillLoggedInClientDetails();

    } else {

        showScreen("login");

    }

}


/* =========================================================
   ORDER NAVIGATION
   ========================================================= */

function goOrderNext(step) {

    if (step === 2) {

        const name =
            document.getElementById(
                "clientName"
            ).value.trim();

        const gym =
            document.getElementById(
                "gymName"
            ).value.trim();


        if (!name || !gym) {

            showToast(
                "Please enter your name and gym",
                "!"
            );

            return;

        }


        currentOrder.clientName =
            name;

        currentOrder.gymName =
            gym;


        currentOrder.instagram =
            document.getElementById(
                "instagramHandle"
            ).value.trim();


        showScreen(
            "order-project"
        );

        return;

    }


    if (step === 3) {

        currentOrder.goal =
            document.getElementById(
                "projectGoal"
            ).value;


        currentOrder.notes =
            document.getElementById(
                "projectNotes"
            ).value.trim();


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

        currentOrder.instructions =
            document.getElementById(
                "specialInstructions"
            ).value.trim();


        updateReview();

        showScreen(
            "order-review"
        );

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
   FILE UPLOAD DISPLAY
   ========================================================= */

function handleVideoFiles(files) {

    currentOrder.videos = [];

    const selected =
        document.getElementById(
            "selectedFiles"
        );

    if (!selected) return;

    selected.innerHTML = "";


    Array.from(files).forEach(
        (file, index) => {

            currentOrder.videos.push({
                name: file.name,
                size: file.size
            });


            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "selected-file-item";


            item.innerHTML = `
                <span>🎬</span>
                <span>${escapeHTML(file.name)}</span>
            `;


            selected.appendChild(item);

        }
    );


    if (files.length > 0) {

        showToast(
            `${files.length} video(s) selected`,
            "✓"
        );

    }

}


/* =========================================================
   REVIEW
   ========================================================= */

function updateReview() {

    const serviceText =
        currentOrder.service ===
        "reel-editing"
            ? "Reel Editing"
            : currentOrder.service ===
              "transformation"
                ? "Transformation Reel"
                : "—";


    const planText =
        currentOrder.plan ===
        "standard"
            ? "Standard"
            : currentOrder.plan ===
              "premium"
                ? "Premium"
                : "—";


    setText(
        "reviewService",
        serviceText
    );

    setText(
        "reviewPlan",
        planText
    );

    setText(
        "reviewClient",
        currentOrder.clientName ||
        "—"
    );

    setText(
        "reviewGym",
        currentOrder.gymName ||
        "—"
    );

    setText(
        "reviewInstagram",
        currentOrder.instagram ||
        "—"
    );

    setText(
        "reviewVideos",
        currentOrder.videos.length +
        " video(s)"
    );

}


/* =========================================================
   SUBMIT ORDER
   ========================================================= */

function submitOrder() {

    if (!isLoggedIn()) {

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

        showToast(
            "Please select a plan",
            "!"
        );

        selectService(
            currentOrder.service
        );

        return;

    }


    const orders =
        getOrders();


    const order = {

        id:
            "GGHQ-" +
            Date.now(),

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

        videos:
            currentOrder.videos,

        status:
            "Submitted",

        deliveryStatus:
            "Editing in Progress",

        finalVideo:
            "",

        createdAt:
            new Date().toISOString()

    };


    orders.push(order);

    saveOrders(orders);

    currentOrderId =
        order.id;


    showToast(
        "Order submitted",
        "✓"
    );


    showScreen(
        "order-success"
    );


    resetOrder();

}


/* =========================================================
   RESET ORDER
   ========================================================= */

function resetOrder() {

    currentOrder = {

        service: "",
        plan: "",
        clientName:
            currentUser
                ? currentUser.name
                : "",
        gymName: "",
        instagram: "",
        goal: "",
        notes: "",
        instructions: "",
        videos: []

    };

}


/* =========================================================
   MY ORDERS
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
        getOrders().filter(
            order =>
                order.userId ===
                currentUser.id
        );


    if (orders.length === 0) {

        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📦</div>
                <h3>No Orders Yet</h3>
                <p>Your orders will appear here.</p>
            </div>
        `;

        return;

    }


    orders
        .slice()
        .reverse()
        .forEach(order => {

            const service =
                order.service ===
                "reel-editing"
                    ? "Reel Editing"
                    : "Transformation Reel";


            const plan =
                order.plan ===
                "standard"
                    ? "Standard"
                    : "Premium";


            const card =
                document.createElement(
                    "button"
                );


            card.type = "button";

            card.className =
                "order-history-card";


            card.innerHTML = `

                <div class="order-history-icon">
                    📦
                </div>

                <div class="order-history-info">

                    <strong>
                        ${service}
                    </strong>

                    <small>
                        ${plan} • ${escapeHTML(order.gymName)}
                    </small>

                    <span class="order-status-small">
                        ${escapeHTML(order.deliveryStatus)}
                    </span>

                </div>

                <span class="account-menu-arrow">
                    →
                </span>

            `;


            card.addEventListener(
                "click",
                () => {

                    openOrderDetails(
                        order.id
                    );

                }
            );


            list.appendChild(card);

        });

}


/* =========================================================
   OPEN ORDER DETAILS
   ========================================================= */

function openOrderDetails(
    orderId
) {

    const orders =
        getOrders();


    const order =
        orders.find(
            item =>
                item.id === orderId
        );


    if (!order) {

        showToast(
            "Order not found",
            "!"
        );

        return;

    }


    currentOrderId =
        order.id;


    const service =
        order.service ===
        "reel-editing"
            ? "Reel Editing"
            : "Transformation Reel";


    const plan =
        order.plan ===
        "standard"
            ? "Standard"
            : "Premium";


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
        order.status ||
        "Submitted"
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
        order.clientName ||
        "—"
    );


    setText(
        "detailGym",
        order.gymName ||
        "—"
    );


    setText(
        "detailGoal",
        order.goal ||
        "—"
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


    updateDeliveryScreen(
        order
    );


    showScreen(
        "order-details"
    );

}


/* =========================================================
   DELIVERY SCREEN
   ========================================================= */

function updateDeliveryScreen(
    order
) {

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


    if (
        order.finalVideo
    ) {

        if (processing)
            processing.style.display =
                "none";

        if (ready)
            ready.style.display =
                "block";


        if (title)
            title.textContent =
                "Ready!";


        if (subtitle)
            subtitle.textContent =
                "Your finished video is ready to watch and download.";


        if (player)
            player.src =
                order.finalVideo;


        if (download)
            download.href =
                order.finalVideo;

    } else {

        if (processing)
            processing.style.display =
                "block";

        if (ready)
            ready.style.display =
                "none";


        if (title)
            title.textContent =
                "Being Edited.";


        if (subtitle)
            subtitle.textContent =
                "We'll make your finished video available here when it is ready.";

    }

}


/* =========================================================
   ACCOUNT → ORDERS
   ========================================================= */

function openMyOrders() {

    if (!isLoggedIn()) {

        showScreen("login");

        return;

    }


    renderOrders();

    showScreen("orders");

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    if (!value) return "";

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   SET TEXT
   ========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (element)
        element.textContent =
            value;

}


/* =========================================================
   GENERIC BUTTON EVENTS
   ========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "[data-screen]"
            );


        if (!button) return;


        const screen =
            button.dataset.screen;


        /*
           MY ACCOUNT
        */

        if (
            screen === "account"
        ) {

            if (isLoggedIn()) {

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


        /*
           ORDERS
        */

        if (
            screen === "orders"
        ) {

            openMyOrders();

            return;

        }


        /*
           START ORDER / ORDER
        */

        if (
            screen === "order"
        ) {

            goToOrder();

            return;

        }


        /*
           NORMAL SCREEN
        */

        showScreen(screen);

    }
);


/* =========================================================
   SERVICE BUTTON EVENTS
   ========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "[data-detail]"
            );


        if (!button) return;


        const service =
            button.dataset.detail;


        /*
           ONLY TWO SERVICES.
           PROMOTIONAL VIDEO REMOVED.
        */

        if (
            service ===
            "reel-editing"
        ) {

            selectService(
                "reel-editing"
            );

        }


        if (
            service ===
            "transformation"
        ) {

            selectService(
                "transformation"
            );

        }

    }
);


/* =========================================================
   PLAN DETAILS BUTTON EVENTS
   ========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "[data-plan-detail]"
            );


        if (!button) return;


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

    }
);


/* =========================================================
   START ORDER FROM PLAN
   ========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "[data-plan]"
            );


        if (!button) return;


        const service =
            button.dataset.plan;

        /*
           Plan buttons from the HTML
           can be connected here later.

           Current safe behavior:
           respect existing service selection.
        */

        if (
            currentOrder.service
        ) {

            if (isLoggedIn()) {

                showScreen("order");

                fillLoggedInClientDetails();

            } else {

                showScreen("login");

            }

        }

    }
);


/* =========================================================
   ORDER NEXT BUTTONS
   ========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "[data-order-next]"
            );


        if (!button) return;


        const step =
            Number(
                button.dataset.orderNext
            );


        goOrderNext(step);

    }
);


/* =========================================================
   ORDER BACK BUTTONS
   ========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "[data-order-back]"
            );


        if (!button) return;


        const step =
            Number(
                button.dataset.orderBack
            );


        goOrderBack(step);

    }
);


/* =========================================================
   LOGIN BUTTON
   ========================================================= */

const loginButton =
    document.getElementById(
        "loginButton"
    );


if (loginButton) {

    loginButton.addEventListener(
        "click",
        loginUser
    );

}


/* =========================================================
   SIGNUP BUTTON
   ========================================================= */

const signupButton =
    document.getElementById(
        "signupButton"
    );


if (signupButton) {

    signupButton.addEventListener(
        "click",
        createAccount
    );

}


/* =========================================================
   LOGIN ↔ SIGNUP
   ========================================================= */

const goToSignup =
    document.getElementById(
        "goToSignup"
    );


if (goToSignup) {

    goToSignup.addEventListener(
        "click",
        () => {

            showScreen(
                "signup"
            );

        }
    );

}


const goToLogin =
    document.getElementById(
        "goToLogin"
    );


if (goToLogin) {

    goToLogin.addEventListener(
        "click",
        () => {

            showScreen(
                "login"
            );

        }
    );

}


/* =========================================================
   LOGOUT
   ========================================================= */

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        logoutUser
    );

}


/* =========================================================
   VIDEO FILE INPUT
   ========================================================= */

const videoFiles =
    document.getElementById(
        "videoFiles"
    );


if (videoFiles) {

    videoFiles.addEventListener(
        "change",
        function() {

            handleVideoFiles(
                this.files
            );

        }
    );

}


/* =========================================================
   SUBMIT ORDER
   ========================================================= */

const submitOrderButton =
    document.getElementById(
        "submitOrderButton"
    );


if (submitOrderButton) {

    submitOrderButton.addEventListener(
        "click",
        submitOrder
    );

}


/* =========================================================
   PLAN BUTTONS
   ========================================================= */

/*
   Standard / Premium plan buttons
   can be identified by text and
   current service.

   We use event delegation.
*/

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                ".pricing-card button"
            );


        if (!button) return;


        const card =
            button.closest(
                ".pricing-card"
            );


        if (!card) return;


        const label =
            card.querySelector(
                ".plan-label"
            );


        if (!label) return;


        const serviceText =
            label.textContent
                .trim()
                .toLowerCase();


        let service = "";


        if (
            serviceText.includes(
                "reel editing"
            )
        ) {

            service =
                "reel-editing";

        }


        if (
            serviceText.includes(
                "transformation"
            )
        ) {

            service =
                "transformation";

        }


        if (!service) return;


        /*
           This version does NOT
           show Promotional Video.
        */

        showScreen(
            service ===
            "reel-editing"
                ? "plan-reel-editing"
                : "plan-transformation"
        );

    }
);


/* =========================================================
   RESTORE LOGIN SESSION
   ========================================================= */

function restoreSession() {

    const session =
        getSession();


    if (
        session &&
        session.id &&
        session.email
    ) {

        const users =
            getUsers();


        const realUser =
            users.find(
                user =>
                    user.id ===
                    session.id &&
                    user.email ===
                    session.email
            );


        if (realUser) {

            currentUser = {

                id:
                    realUser.id,

                name:
                    realUser.name,

                email:
                    realUser.email

            };

        } else {

            /*
               Old/broken session
               is removed.
            */

            clearSession();

            currentUser = null;

        }

    }


    updateAccountUI();

}


/* =========================================================
   INITIALIZE APP
   ========================================================= */

restoreSession();


/* =========================================================
   START SCREEN
   ========================================================= */

showScreen("home");
