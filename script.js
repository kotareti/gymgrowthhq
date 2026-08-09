/* =========================================================
   GYM GROWTH HQ
   FINAL FLOW SCRIPT
   ========================================================= */

const USERS_KEY = "gghq_users";
const SESSION_KEY = "gghq_session";
const ORDERS_KEY = "gghq_orders";

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
        el.textContent = value || "—";
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


function showToast(message, icon = "✓") {

    const toast =
        document.getElementById("toast");

    const text =
        document.getElementById("toastMessage");

    const iconEl =
        document.getElementById("toastIcon");

    if (!toast) return;

    if (text)
        text.textContent = message;

    if (iconEl)
        iconEl.textContent = icon;

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
            renderOrderDetails(order);
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
                user.id === currentUser.id
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


    users[index] = user;

    saveUsers(users);


    currentUser.name =
        user.name;

    currentUser.gymName =
        user.gymName;

    currentUser.instagram =
        user.instagram;


    saveSession(currentUser);

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
        email: user.email,
        gymName: user.gymName || "",
        instagram: user.instagram || ""
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


    /*
       IMPORTANT:
       Login finished.
       Go directly to Order.
       Never show Login again.
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
       ONLY TWO SERVICES.
       Promotional Video removed.
    */

    if (
        service !== "reel-editing" &&
        service !== "transformation"
    ) {

        return;

    }


    currentOrder.service =
        service;

    currentOrder.plan =
        "";


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

    if (
        service !== "reel-editing" &&
        service !== "transformation"
    ) {

        return;

    }


    currentOrder.service =
        service;

    currentOrder.plan =
        plan || "standard";


    /*
       Already logged in:
       DIRECTLY ORDER.

       Not logged in:
       LOGIN ONCE.
    */

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


    if (!name || !gym) return false;


    currentOrder.clientName =
        name.value.trim();

    currentOrder.gymName =
        gym.value.trim();

    currentOrder.instagram =
        instagram
            ? instagram.value.trim()
            : "";


    /*
       Save permanently to account.
       So next order doesn't ask again.
    */

    if (currentUser) {

        saveClientProfile();

    }


    return true;

}


/* =========================================================
   ORDER NEXT
   ========================================================= */

function goOrderNext(step) {


    if (step === 2) {

        if (!saveStepOne()) {

            showToast(
                "Please enter your details",
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
                ? goal.value
                : "";


        currentOrder.notes =
            notes
                ? notes.value.trim()
                : "";


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
   VIDEO FILES
   ========================================================= */

function handleVideoFiles(files) {

    currentOrder.videos =
        Array.from(files).map(
            file => ({
                name: file.name,
                size: file.size
            })
        );


    const container =
        document.getElementById(
            "selectedFiles"
        );


    if (!container) return;


    container.innerHTML = "";


    currentOrder.videos.forEach(
        video => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "selected-file-item";


            item.innerHTML = `
                <span>🎬</span>
                <span>${escapeHTML(video.name)}</span>
            `;


            container.appendChild(
                item
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

}


/* =========================================================
   SUBMIT ORDER
   ========================================================= */

function submitOrder() {

    /*
       NEVER redirect to Plan here.
    */

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


    /*
       Make sure client details
       are saved before order.
    */

    saveStepOne();


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


    /*
       IMPORTANT:

       Do NOT reset before navigating.
       Go directly to Account.
    */

    showToast(
        "Order submitted successfully",
        "✓"
    );


    /*
       Small delay only for toast.
       Then Account.
    */

    setTimeout(
        () => {

            renderOrders();

            showScreen(
                "account"
            );

        },
        500
    );


    /*
       Prepare blank order AFTER
       saving everything.
       Client profile stays saved.
    */

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
        videos: []

    };

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
        .forEach(order => {

            const card =
                document.createElement(
                    "button"
                );


            card.type = "button";

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
                        ${escapeHTML(order.gymName)}
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

        });

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


        /* ================================================
           ACCOUNT
           ================================================ */

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


        /* ================================================
           ORDERS
           ================================================ */

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


        /* ================================================
           SERVICES
           ================================================ */

        if (
            button.dataset.detail
        ) {

            event.preventDefault();

            selectService(
                button.dataset.detail
            );

            return;

        }


        /* ================================================
           PLAN DETAIL
           ================================================ */

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


        /* ================================================
           START ORDER FROM PLAN
           ================================================ */

        if (
            button.dataset.plan
        ) {

            event.preventDefault();


            const service =
                button.dataset.plan;


            /*
               Current HTML has one Start Order
               per service.

               Use Standard as default plan.
            */

            selectPlan(
                service,
                "standard"
            );

            return;

        }


        /* ================================================
           ORDER NEXT
           ================================================ */

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


        /* ================================================
           ORDER BACK
           ================================================ */

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


        /* ================================================
           NORMAL SCREEN
           ================================================ */

        if (
            button.dataset.screen
        ) {

            event.preventDefault();

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
    .getElementById("loginButton")
    ?.addEventListener(
        "click",
        loginUser
    );


/* =========================================================
   SIGNUP
   ========================================================= */

document
    .getElementById("signupButton")
    ?.addEventListener(
        "click",
        createAccount
    );


/* =========================================================
   LOGOUT
   ========================================================= */

document
    .getElementById("logoutButton")
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
    .getElementById("goToSignup")
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
    .getElementById("goToLogin")
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
   VIDEO INPUT
   ========================================================= */

document
    .getElementById("videoFiles")
    ?.addEventListener(
        "change",
        function() {

            handleVideoFiles(
                this.files
            );

        }
    );


/* =========================================================
   SUBMIT
   ========================================================= */

document
    .getElementById("submitOrderButton")
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

restoreSession();


/* =========================================================
   INITIAL SCREEN
   ========================================================= */

showScreen("home");
