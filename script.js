/* =========================================================
   GYM GROWTH HQ
   FINAL FLOW SCRIPT
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



       SUPABASE_URL +
                "/rest/v1/orders",
                {

                    method: "POST",

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
                        JSON.stringify(
                            supabaseOrder
                        )

                }
            );


        
            

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
        currentOrder.plan = "standard";
    }

    /* Save client details */
    saveStepOne();

    /* Create local order ID */
    const orderId =
        "GGHQ-" + Date.now();

    /* Create local order */
    const order = {

        id: orderId,

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
            currentOrder.videos || [],

        status:
            "Submitted",

        deliveryStatus:
            "Editing in Progress",

        finalVideo:
            "",

        createdAt:
            new Date().toISOString()
    };


    /* =====================================================
       SAVE ORDER TO SUPABASE — ONLY ONCE
       ===================================================== */

    try {

        const response =
            await fetch(
                SUPABASE_URL +
                "/rest/v1/orders",
                {

                    method: "POST",

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
                                order.videos || [],

                            final_video_url:
                                "",

                            created_at:
                                order.createdAt
                        })
                }
            );


        /* =================================================
           CHECK RESPONSE
           ================================================= */

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


        /* =================================================
           SAVE LOCALLY
           ================================================= */

        const orders =
            getOrders();

        orders.push(order);

        saveOrders(orders);


        /* =================================================
           CURRENT ORDER
           ================================================= */

        currentOrderId =
            order.id;


        /* =================================================
           SUCCESS
           ================================================= */

        showToast(
            "Order submitted successfully",
            "✓"
        );


        /* =================================================
           PREPARE NEXT ORDER
           ================================================= */

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


        /* =================================================
           GO TO ACCOUNT / ORDERS
           ================================================= */

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
/* =========================================================
   FINAL VIDEO UPLOAD UPDATE
   Fresh Upload + Gallery Style Video Preview
   ========================================================= */


/* ---------------------------------------------------------
   Make sure multiple videos can be selected
   --------------------------------------------------------- */

const videoInput =
    document.getElementById("videoFiles");

if (videoInput) {

    videoInput.setAttribute(
        "multiple",
        "multiple"
    );

    videoInput.setAttribute(
        "accept",
        "video/*"
    );

}


/* ---------------------------------------------------------
   Gallery preview styles
   No CSS file editing required
   --------------------------------------------------------- */

if (!document.getElementById("videoGalleryStyles")) {

    const style =
        document.createElement("style");

    style.id =
        "videoGalleryStyles";

    style.textContent = `

        .video-gallery-preview {
            display: grid;
            grid-template-columns:
                repeat(2, minmax(0, 1fr));
            gap: 12px;
            margin-top: 18px;
        }

        .video-preview-card {
            position: relative;
            overflow: hidden;
            border-radius: 16px;
            background: #15151c;
            border: 1px solid rgba(145, 92, 255, 0.35);
        }

        .video-preview-card video {
            display: block;
            width: 100%;
            aspect-ratio: 16 / 10;
            object-fit: cover;
            background: #08080c;
        }

        .video-preview-info {
            padding: 9px 10px 11px;
        }

        .video-preview-name {
            font-size: 12px;
            line-height: 1.35;
            color: #ffffff;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .video-preview-number {
            position: absolute;
            top: 8px;
            left: 8px;
            min-width: 28px;
            height: 28px;
            padding: 0 8px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0,0,0,0.75);
            color: #ffffff;
            font-size: 12px;
            font-weight: 700;
        }

        .video-count-label {
            margin-top: 14px;
            padding: 12px 14px;
            border-radius: 12px;
            background: rgba(145, 92, 255, 0.10);
            color: #d8c7ff;
            font-size: 14px;
            font-weight: 600;
            text-align: center;
        }

        .video-empty-message {
            margin-top: 16px;
            padding: 18px;
            border-radius: 14px;
            text-align: center;
            color: #8f8f9d;
            background: rgba(255,255,255,0.03);
            font-size: 14px;
        }

        @media (min-width: 600px) {

            .video-gallery-preview {
                grid-template-columns:
                    repeat(3, minmax(0, 1fr));
            }

        }

    `;

    document.head.appendChild(style);

}


/* ---------------------------------------------------------
   Clear upload selection
   --------------------------------------------------------- */

function clearFreshUpload() {

    const input =
        document.getElementById(
            "videoFiles"
        );

    const selected =
        document.getElementById(
            "selectedFiles"
        );


    /*
       Clear actual phone-file selection
    */

    if (input) {

        input.value = "";

    }


    /*
       Clear preview area
    */

    if (selected) {

        selected.innerHTML = "";

    }


    /*
       Clear current order video list
    */

    if (
        typeof currentOrder !==
        "undefined"
    ) {

        currentOrder.videos = [];

    }

}


/* ---------------------------------------------------------
   Create gallery container
   --------------------------------------------------------- */

function getVideoGalleryContainer() {

    const selected =
        document.getElementById(
            "selectedFiles"
        );

    if (!selected) return null;


    /*
       Reuse existing selectedFiles
       element as our gallery container.
    */

    selected.className =
        "video-gallery-wrapper";


    return selected;

}


/* ---------------------------------------------------------
   Format file size
   --------------------------------------------------------- */

function formatVideoSize(bytes) {

    if (!bytes) return "";

    const mb =
        bytes / (1024 * 1024);

    if (mb < 1) {

        return Math.round(
            bytes / 1024
        ) + " KB";

    }

    return mb.toFixed(1) + " MB";

}


/* ---------------------------------------------------------
   Show selected videos
   --------------------------------------------------------- */

function showVideoGallery(files) {

    const container =
        getVideoGalleryContainer();


    if (!container) return;


    container.innerHTML = "";


    if (!files || files.length === 0) {

        container.innerHTML = `
            <div class="video-empty-message">
                No videos selected yet.
            </div>
        `;

        return;

    }


    /*
       Gallery wrapper
    */

    const gallery =
        document.createElement(
            "div"
        );

    gallery.className =
        "video-gallery-preview";


    /*
       Count label
    */

    const count =
        document.createElement(
            "div"
        );

    count.className =
        "video-count-label";

    count.textContent =
        `${files.length} video${
            files.length === 1
                ? ""
                : "s"
        } selected`;


    /*
       Create each thumbnail
    */

    Array.from(files).forEach(
        (file, index) => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "video-preview-card";


            /*
               Number badge
            */

            const number =
                document.createElement(
                    "div"
                );

            number.className =
                "video-preview-number";

            number.textContent =
                index + 1;


            /*
               Video thumbnail
            */

            const video =
                document.createElement(
                    "video"
                );

            video.muted = true;

            video.playsInline = true;

            video.preload =
                "metadata";

            video.setAttribute(
                "playsinline",
                ""
            );


            /*
               Create temporary preview URL
            */

            const previewURL =
                URL.createObjectURL(
                    file
                );


            video.src =
                previewURL;


            /*
               Show first frame
            */

            video.addEventListener(
                "loadedmetadata",
                function() {

                    try {

                        if (
                            video.duration >
                            0.5
                        ) {

                            video.currentTime =
                                0.1;

                        }

                    } catch (error) {}

                }
            );


            /*
               Release URL after video
               element is no longer needed
            */

            video.addEventListener(
                "error",
                function() {

                    URL.revokeObjectURL(
                        previewURL
                    );

                }
            );


            /*
               File information
            */

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

            size.style.cssText =
                `
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


            card.appendChild(
                video
            );

            card.appendChild(
                number
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

    container.appendChild(
        count
    );

}


/* ---------------------------------------------------------
   NEW video selection handler
   --------------------------------------------------------- */

function newVideoSelectionHandler(
    files
) {

    if (!files) return;


    /*
       Save ONLY the videos selected
       for THIS current order.
    */

    if (
        typeof currentOrder !==
        "undefined"
    ) {

        currentOrder.videos =
            Array.from(files).map(
                file => ({
                    name:
                        file.name,

                    size:
                        file.size
                })
            );

    }


    /*
       Show gallery
    */

    showVideoGallery(
        files
    );


    /*
       Small confirmation
    */

    if (
        typeof showToast ===
        "function"
    ) {

        showToast(
            `${files.length} video${
                files.length === 1
                    ? ""
                    : "s"
            } selected`,
            "✓"
        );

    }

}


/* ---------------------------------------------------------
   Replace / override old upload handler
   --------------------------------------------------------- */

if (videoInput) {

    videoInput.addEventListener(
        "change",
        function() {

            newVideoSelectionHandler(
                this.files
            );

        }
    );

}


/* ---------------------------------------------------------
   IMPORTANT:
   Whenever Upload screen opens,
   start with a completely fresh selection.
   --------------------------------------------------------- */

if (
    typeof showScreen ===
    "function"
) {

    const originalShowScreen =
        showScreen;


    window.showScreen =
        function(screenId) {

            /*
               Every time we enter Upload screen,
               clear old selected videos.

               So even if user presses Back
               and returns again, it is empty.
            */

            if (
                screenId ===
                "order-upload"
            ) {

                clearFreshUpload();

            }


            originalShowScreen(
                screenId
            );

        };

}


/* ---------------------------------------------------------
   Extra protection:
   Start a completely fresh upload
   whenever New Order is clicked.
   --------------------------------------------------------- */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "[data-screen]"
            );


        if (!button) return;


        const target =
            button.dataset.screen;


        /*
           New Order
        */

        if (
            target === "order"
        ) {

            clearFreshUpload();

        }

    },
    true
);


/* ---------------------------------------------------------
   Clear upload after successful order
   --------------------------------------------------------- */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "#submitOrderButton"
            );


        if (!button) return;


        /*
           Wait until existing submit logic
           finishes saving the order.
        */

        setTimeout(
            function() {

                clearFreshUpload();

            },
            700
        );

    },
    true
);


/* =========================================================
   END VIDEO UPLOAD UPDATE
   ========================================================= */
/* =========================================================
   MULTI-SELECT VIDEO FIX
   Add more videos without removing previous videos
   ========================================================= */

window.GGHQ_SELECTED_VIDEO_FILES =
    window.GGHQ_SELECTED_VIDEO_FILES || [];


/* ---------------------------------------------------------
   Render all selected videos
   --------------------------------------------------------- */

function GGHQ_renderAllVideos() {

    const container =
        document.getElementById(
            "selectedFiles"
        );

    if (!container) return;


    container.innerHTML = "";


    const files =
        window.GGHQ_SELECTED_VIDEO_FILES;


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


            const video =
                document.createElement(
                    "video"
                );

            video.muted = true;

            video.playsInline = true;

            video.preload =
                "metadata";

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
                GGHQ_formatFileSize(
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
        "video-count-label";


    count.textContent =
        `${files.length} video${
            files.length === 1
                ? ""
                : "s"
        } selected`;


    container.appendChild(
        count
    );


    /*
       Keep currentOrder in sync
    */

    if (
        typeof currentOrder !==
        "undefined"
    ) {

        currentOrder.videos =
            files.map(
                file => ({
                    name:
                        file.name,

                    size:
                        file.size
                })
            );

    }

}


/* ---------------------------------------------------------
   File size
   --------------------------------------------------------- */

function GGHQ_formatFileSize(
    bytes
) {

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


/* ---------------------------------------------------------
   IMPORTANT:
   When Choose Videos is used again,
   ADD new files instead of replacing old files.
   --------------------------------------------------------- */

const GGHQ_videoInput =
    document.getElementById(
        "videoFiles"
    );


if (GGHQ_videoInput) {

    GGHQ_videoInput.addEventListener(
        "change",
        function() {

            const newFiles =
                Array.from(
                    this.files || []
                );


            if (!newFiles.length) {
                return;
            }


            /*
               Add new files to existing files.
            */

            newFiles.forEach(
                newFile => {

                    const alreadyExists =
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


                    /*
                       Don't add the exact
                       same file twice.
                    */

                    if (!alreadyExists) {

                        window
                            .GGHQ_SELECTED_VIDEO_FILES
                            .push(
                                newFile
                            );

                    }

                }
            );


            /*
               Show ALL videos again.
            */

            GGHQ_renderAllVideos();


            /*
               Clear the actual input so
               the same file can also be
               selected again later if needed.
            */

            this.value = "";


            if (
                typeof showToast ===
                "function"
            ) {

                const total =
                    window
                        .GGHQ_SELECTED_VIDEO_FILES
                        .length;


                showToast(
                    `${total} video${
                        total === 1
                            ? ""
                            : "s"
                    } selected`,
                    "✓"
                );

            }

        }
    );

}


/* =========================================================
   FRESH ORDER = CLEAR OLD VIDEOS
   ========================================================= */

function GGHQ_clearAllSelectedVideos() {

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


    if (
        typeof currentOrder !==
        "undefined"
    ) {

        currentOrder.videos = [];

    }

}


/* ---------------------------------------------------------
   New Order → completely fresh upload
   --------------------------------------------------------- */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "[data-screen]"
            );


        if (!button) return;


        if (
            button.dataset.screen ===
            "order"
        ) {

            GGHQ_clearAllSelectedVideos();

        }

    },
    true
);


/* ---------------------------------------------------------
   Going to Upload screen:
   start fresh
   --------------------------------------------------------- */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "[data-order-next]"
            );


        if (!button) return;


        /*
           Step 3 opens Upload screen.
           This means we are entering a fresh
           upload stage.
        */

        if (
            button.dataset.orderNext ===
            "3"
        ) {

            GGHQ_clearAllSelectedVideos();

        }

    },
    true
);


/* ---------------------------------------------------------
   Back from Upload:
   clear videos
   --------------------------------------------------------- */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "[data-order-back]"
            );


        if (!button) return;


        /*
           Back from Upload screen.
        */

        if (
            button.dataset.orderBack ===
            "2"
        ) {

            GGHQ_clearAllSelectedVideos();

        }

    },
    true
);


/* ---------------------------------------------------------
   After successful Submit:
   clear selected files for next order
   --------------------------------------------------------- */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "#submitOrderButton"
            );


        if (!button) return;


        setTimeout(
            function() {

                GGHQ_clearAllSelectedVideos();

            },
            1000
        );

    },
    true
);


/* =========================================================
   END MULTI-SELECT VIDEO FIX
   ========================================================= */
/* =========================================================
   SELECTED VIDEO CLEAR CONFIRMATION
   ========================================================= */

if (!document.getElementById("gghq-selected-confirm-style")) {

    const style = document.createElement("style");

    style.id =
        "gghq-selected-confirm-style";

    style.textContent = `

        .video-gallery-preview {
            display: grid;
            grid-template-columns:
                repeat(2, minmax(0, 1fr));
            gap: 12px;
            margin-top: 16px;
        }

        .video-preview-card {
            position: relative;
            overflow: hidden;
            border-radius: 16px;

            background: #111118;

            border: 2px solid
                rgba(145, 92, 255, 0.65);

            box-shadow:
                0 0 0 2px
                rgba(145, 92, 255, 0.08);

        }

        .video-preview-card video {

            display: block;

            width: 100%;

            aspect-ratio: 16 / 10;

            object-fit: cover;

            background: #08080c;

        }

        /* SELECTED BADGE */

        .gghq-selected-badge {

            position: absolute;

            top: 8px;
            right: 8px;

            z-index: 5;

            padding:
                6px 9px;

            border-radius:
                20px;

            background:
                rgba(70, 220, 130, 0.95);

            color: #07140c;

            font-size: 11px;

            font-weight: 800;

            letter-spacing:
                0.3px;

            box-shadow:
                0 3px 10px
                rgba(0,0,0,0.35);

        }


        /* VIDEO NUMBER */

        .video-preview-number {

            position: absolute;

            top: 8px;
            left: 8px;

            z-index: 5;

            width: 28px;
            height: 28px;

            border-radius: 50%;

            display: flex;

            align-items: center;

            justify-content: center;

            background:
                rgba(0,0,0,0.78);

            color: white;

            font-size: 12px;

            font-weight: 800;

        }


        .video-preview-info {

            padding:
                9px 10px 11px;

        }


        .video-preview-name {

            color: white;

            font-size: 12px;

            font-weight: 600;

            line-height: 1.35;

            white-space: nowrap;

            overflow: hidden;

            text-overflow: ellipsis;

        }


        /* BIG COUNT */

        .gghq-video-selected-count {

            margin-top: 16px;

            width: 100%;

            padding:
                14px 16px;

            border-radius:
                14px;

            background:
                rgba(145, 92, 255, 0.14);

            border:
                1px solid
                rgba(145, 92, 255, 0.45);

            color: white;

            text-align: center;

            font-size: 15px;

            font-weight: 800;

        }


        .gghq-video-selected-count span {

            color:
                #cdb5ff;

        }


        @media (min-width: 600px) {

            .video-gallery-preview {

                grid-template-columns:
                    repeat(3, minmax(0, 1fr));

            }

        }

    `;

    document.head.appendChild(style);

}


/* =========================================================
   RENDER SELECTED VIDEOS
   ========================================================= */

function GGHQ_renderSelectedConfirmation() {

    const container =
        document.getElementById(
            "selectedFiles"
        );


    if (!container) return;


    const files =
        window.GGHQ_SELECTED_VIDEO_FILES ||
        [];


    container.innerHTML = "";


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


            /* VIDEO NUMBER */

            const number =
                document.createElement(
                    "div"
                );


            number.className =
                "video-preview-number";


            number.textContent =
                index + 1;


            /* SELECTED BADGE */

            const selectedBadge =
                document.createElement(
                    "div"
                );


            selectedBadge.className =
                "gghq-selected-badge";


            selectedBadge.textContent =
                "✓ SELECTED";


            /* VIDEO */

            const video =
                document.createElement(
                    "video"
                );


            video.muted =
                true;

            video.playsInline =
                true;

            video.preload =
                "metadata";


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


            /* FILE NAME */

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


            info.appendChild(
                name
            );


            card.appendChild(
                video
            );


            card.appendChild(
                number
            );


            card.appendChild(
                selectedBadge
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


    /* =====================================================
       BIG SELECTED COUNT
       ===================================================== */

    const count =
        document.createElement(
            "div"
        );


    count.className =
        "gghq-video-selected-count";


    const number =
        document.createElement(
            "span"
        );


    number.textContent =
        files.length;


    count.appendChild(
        document.createTextNode(
            "✓ "
        )
    );


    count.appendChild(
        number
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

}


/* =========================================================
   WATCH FOR VIDEO SELECTION CHANGES
   ========================================================= */

const GGHQ_confirmVideoInput =
    document.getElementById(
        "videoFiles"
    );


if (GGHQ_confirmVideoInput) {

    GGHQ_confirmVideoInput.addEventListener(
        "change",
        function() {

            const selectedFiles =
                Array.from(
                    this.files || []
                );


            if (!selectedFiles.length) {
                return;
            }


            window.GGHQ_SELECTED_VIDEO_FILES =
                window.GGHQ_SELECTED_VIDEO_FILES ||
                [];


            selectedFiles.forEach(
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


            /*
               Keep current order synced.
            */

            if (
                typeof currentOrder !==
                "undefined"
            ) {

                currentOrder.videos =
                    window
                        .GGHQ_SELECTED_VIDEO_FILES
                        .map(
                            file => ({

                                name:
                                    file.name,

                                size:
                                    file.size

                            })
                        );

            }


            /*
               SHOW CLEAR CONFIRMATION
            */

            GGHQ_renderSelectedConfirmation();


            /*
               Clear input so another
               selection can be added.
            */

            this.value = "";


            if (
                typeof showToast ===
                "function"
            ) {

                showToast(
                    `${
                        window
                            .GGHQ_SELECTED_VIDEO_FILES
                            .length
                    } videos selected`,
                    "✓"
                );

            }

        }
    );

}


/* =========================================================
   END SELECTED VIDEO CONFIRMATION
   ========================================================= */
