/* =========================================================
   GYM GROWTH HQ
   ACCOUNT + ORDERS + LOGIN
   FINAL JAVASCRIPT
   ========================================================= */


/* =========================================================
   APP STATE
   ========================================================= */

const AppState = {

    currentScreen: "home",

    selectedService: "",

    selectedPlan: "",

    orderStep: 1,

    isLoggedIn: false,

    currentUser: null,

    currentOrderId: null,

    orderData: {

        clientName: "",

        gymName: "",

        instagram: "",

        projectGoal: "",

        projectNotes: "",

        specialInstructions: "",

        videoFiles: []

    }

};


/* =========================================================
   STORAGE KEYS
   ========================================================= */

const STORAGE = {

    USER:
        "gym_growth_user",

    ORDERS:
        "gym_growth_orders",

    LOGIN:
        "gym_growth_logged_in"

};


/* =========================================================
   HELPERS
   ========================================================= */

function $(selector) {

    return document.querySelector(selector);

}


function $all(selector) {

    return Array.from(
        document.querySelectorAll(selector)
    );

}


/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function saveUser(user) {

    localStorage.setItem(
        STORAGE.USER,
        JSON.stringify(user)
    );

}


function getSavedUser() {

    const data =
        localStorage.getItem(
            STORAGE.USER
        );

    if (!data) {

        return null;

    }

    try {

        return JSON.parse(data);

    } catch (error) {

        return null;

    }

}


function saveOrders(orders) {

    localStorage.setItem(
        STORAGE.ORDERS,
        JSON.stringify(orders)
    );

}


function getOrders() {

    const data =
        localStorage.getItem(
            STORAGE.ORDERS
        );

    if (!data) {

        return [];

    }

    try {

        return JSON.parse(data);

    } catch (error) {

        return [];

    }

}


function setLoggedIn(value) {

    localStorage.setItem(
        STORAGE.LOGIN,
        value
            ? "true"
            : "false"
    );

}


function isStoredLoggedIn() {

    return (
        localStorage.getItem(
            STORAGE.LOGIN
        ) === "true"
    );

}


/* =========================================================
   SCREEN MAP
   ========================================================= */

const screens = {

    home:
        "home",

    services:
        "services",

    "reel-editing":
        "reel-editing",

    transformation:
        "transformation",

    "gym-promotion":
        "gym-promotion",

    pricing:
        "pricing",

    "plan-reel-editing":
        "plan-reel-editing",

    "plan-transformation":
        "plan-transformation",

    "plan-gym-promotion":
        "plan-gym-promotion",

    login:
        "login",

    signup:
        "signup",

    order:
        "order",

    "order-project":
        "order-project",

    "order-upload":
        "order-upload",

    "order-instructions":
        "order-instructions",

    "order-review":
        "order-review",

    "order-success":
        "order-success",

    account:
        "account",

    orders:
        "orders",

    "order-details":
        "order-details",

    support:
        "support"

};


/* =========================================================
   GET SCREEN
   ========================================================= */

function getScreen(name) {

    const id =
        screens[name] || name;

    return document.getElementById(id);

}


/* =========================================================
   HIDE ALL SCREENS
   ========================================================= */

function hideAllScreens() {

    $all(".app-screen")
        .forEach(screen => {

            screen.classList.remove(
                "active-screen"
            );

            screen.setAttribute(
                "aria-hidden",
                "true"
            );

            screen.style.display =
                "none";

        });

}


/* =========================================================
   SHOW SCREEN
   ========================================================= */

function showScreen(name) {

    const screen =
        getScreen(name);


    if (!screen) {

        console.error(
            "Screen not found:",
            name
        );

        return;

    }


    hideAllScreens();


    screen.classList.add(
        "active-screen"
    );


    screen.setAttribute(
        "aria-hidden",
        "false"
    );


    screen.style.display =
        "block";


    AppState.currentScreen =
        screen.id;


    window.scrollTo(
        0,
        0
    );


    updateFloatingHome(
        screen.id
    );


    updateAccountUI();

}


/* =========================================================
   FLOATING HOME
   ========================================================= */

function updateFloatingHome(
    currentScreen
) {

    const button =
        $("#floatingHomeButton");


    if (!button) {

        return;

    }


    if (
        currentScreen ===
        "home"
    ) {

        button.style.display =
            "none";

    } else {

        button.style.display =
            "flex";

    }

}


/* =========================================================
   SERVICE NAME
   ========================================================= */

function getServiceName(
    service
) {

    const names = {

        "reel-editing":
            "Reel Editing",

        transformation:
            "Transformation Reel",

        "gym-promotion":
            "Gym Promotion"

    };


    return (
        names[service] ||
        "Not selected"
    );

}


/* =========================================================
   PLAN NAME
   ========================================================= */

function getPlanName(
    plan
) {

    const names = {

        "reel-editing":
            "Standard Reel",

        transformation:
            "Transformation Reel",

        "gym-promotion":
            "Promotional Video"

    };


    return (
        names[plan] ||
        "Not selected"
    );

}


/* =========================================================
   SCREEN BUTTONS
   ========================================================= */

function setupScreenButtons() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-screen]"
                );


            if (!button) {

                return;

            }


            event.preventDefault();


            const target =
                button.dataset.screen;


            if (
                button.dataset.service
            ) {

                AppState.selectedService =
                    button.dataset.service;

            }


            if (
                button.dataset.plan
            ) {

                AppState.selectedPlan =
                    button.dataset.plan;

            }


            /*
             * Order requires login.
             */

            if (
                target === "order"
            ) {

                if (
                    AppState.isLoggedIn
                ) {

                    startOrder();

                } else {

                    showScreen(
                        "login"
                    );

                }

                return;

            }


            /*
             * Account requires login.
             */

            if (
                target === "account" ||
                target === "orders" ||
                target === "order-details"
            ) {

                if (
                    !AppState.isLoggedIn
                ) {

                    showScreen(
                        "login"
                    );

                    return;

                }

            }


            showScreen(
                target
            );

        }
    );

}


/* =========================================================
   SERVICE BUTTONS
   ========================================================= */

function setupServiceButtons() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-detail]"
                );


            if (!button) {

                return;

            }


            event.preventDefault();


            const service =
                button.dataset.detail;


            AppState.selectedService =
                service;


            showScreen(
                service
            );

        }
    );

}


/* =========================================================
   PLAN BUTTONS
   ========================================================= */

function setupPlanButtons() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-plan-detail]"
                );


            if (!button) {

                return;

            }


            event.preventDefault();


            const plan =
                button.dataset.planDetail;


            AppState.selectedPlan =
                plan;


            showScreen(
                `plan-${plan}`
            );

        }
    );

}


/* =========================================================
   ORDER START
   ========================================================= */

function startOrder() {

    if (
        !AppState.isLoggedIn
    ) {

        showScreen(
            "login"
        );

        return;

    }


    AppState.orderStep =
        1;


    /*
     * If account name exists,
     * automatically put it in form.
     */

    const clientName =
        $("#clientName");


    if (
        clientName &&
        AppState.currentUser
    ) {

        clientName.value =
            AppState.currentUser.name || "";

    }


    showScreen(
        "order"
    );


    updateOrderProgress();

}


/* =========================================================
   ORDER ROOMS
   ========================================================= */

const orderRooms = {

    1:
        "order",

    2:
        "order-project",

    3:
        "order-upload",

    4:
        "order-instructions",

    5:
        "order-review"

};


/* =========================================================
   GO TO ORDER STEP
   ========================================================= */

function goToOrderStep(
    step
) {

    const number =
        Number(step);


    if (
        number < 1 ||
        number > 5
    ) {

        return;

    }


    collectOrderData();


    AppState.orderStep =
        number;


    const target =
        orderRooms[number];


    showScreen(
        target
    );


    updateOrderProgress();


    if (
        number === 5
    ) {

        updateReview();

    }

}


/* =========================================================
   ORDER NEXT
   ========================================================= */

function setupOrderNextButtons() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-order-next]"
                );


            if (!button) {

                return;

            }


            event.preventDefault();


            const next =
                Number(
                    button.dataset.orderNext
                );


            if (
                !validateOrderStep(
                    AppState.orderStep
                )
            ) {

                return;

            }


            goToOrderStep(
                next
            );

        }
    );

}


/* =========================================================
   ORDER BACK
   ========================================================= */

function setupOrderBackButtons() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-order-back]"
                );


            if (!button) {

                return;

            }


            event.preventDefault();


            const previous =
                Number(
                    button.dataset.orderBack
                );


            goToOrderStep(
                previous
            );

        }
    );

}


/* =========================================================
   ORDER VALIDATION
   ========================================================= */

function validateOrderStep(
    step
) {

    collectOrderData();


    if (
        step === 1
    ) {

        if (
            !AppState.orderData.clientName
        ) {

            showToast(
                "Please enter your name.",
                "!"
            );

            $("#clientName")?.focus();

            return false;

        }


        if (
            !AppState.orderData.gymName
        ) {

            showToast(
                "Please enter your gym name.",
                "!"
            );

            $("#gymName")?.focus();

            return false;

        }


        if (
            !AppState.orderData.instagram
        ) {

            showToast(
                "Please enter your Instagram.",
                "!"
            );

            $("#instagramHandle")?.focus();

            return false;

        }

    }


    if (
        step === 2
    ) {

        if (
            !AppState.orderData.projectGoal
        ) {

            showToast(
                "Please select your project goal.",
                "!"
            );

            $("#projectGoal")?.focus();

            return false;

        }

    }


    return true;

}


/* =========================================================
   ORDER PROGRESS
   ========================================================= */

function updateOrderProgress() {

    document.documentElement
        .setAttribute(
            "data-order-step",
            String(
                AppState.orderStep
            )
        );

}


/* =========================================================
   COLLECT ORDER DATA
   ========================================================= */

function collectOrderData() {

    const clientName =
        $("#clientName");

    const gymName =
        $("#gymName");

    const instagram =
        $("#instagramHandle");

    const projectGoal =
        $("#projectGoal");

    const projectNotes =
        $("#projectNotes");

    const specialInstructions =
        $("#specialInstructions");


    if (clientName) {

        AppState.orderData.clientName =
            clientName.value.trim();

    }


    if (gymName) {

        AppState.orderData.gymName =
            gymName.value.trim();

    }


    if (instagram) {

        AppState.orderData.instagram =
            instagram.value.trim();

    }


    if (projectGoal) {

        AppState.orderData.projectGoal =
            projectGoal.value;

    }


    if (projectNotes) {

        AppState.orderData.projectNotes =
            projectNotes.value.trim();

    }


    if (specialInstructions) {

        AppState.orderData.specialInstructions =
            specialInstructions.value.trim();

    }

}


/* =========================================================
   VIDEO UPLOAD
   ========================================================= */

function setupVideoUpload() {

    const input =
        $("#videoFiles");


    const output =
        $("#selectedFiles");


    if (
        !input ||
        !output
    ) {

        return;

    }


    input.addEventListener(
        "change",
        () => {

            const files =
                Array.from(
                    input.files
                );


            AppState.orderData.videoFiles =
                files;


            output.innerHTML =
                "";


            files.forEach(
                file => {

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "selected-file";


                    item.textContent =
                        `✓ ${file.name}`;


                    output.appendChild(
                        item
                    );

                }
            );


            if (
                files.length
            ) {

                showToast(
                    `${files.length} video${files.length > 1 ? "s" : ""} selected.`,
                    "✓"
                );

            }

        }
    );

}


/* =========================================================
   REVIEW
   ========================================================= */

function updateReview() {

    collectOrderData();


    $("#reviewService").textContent =
        getServiceName(
            AppState.selectedService
        );


    $("#reviewPlan").textContent =
        getPlanName(
            AppState.selectedPlan
        );


    $("#reviewClient").textContent =
        AppState.orderData.clientName ||
        "Not provided";


    $("#reviewGym").textContent =
        AppState.orderData.gymName ||
        "Not provided";


    $("#reviewInstagram").textContent =
        AppState.orderData.instagram ||
        "Not provided";


    const count =
        AppState.orderData
            .videoFiles
            .length;


    $("#reviewVideos").textContent =
        count
            ? `${count} video${count > 1 ? "s" : ""} selected`
            : "No videos selected";

}


/* =========================================================
   LOGIN
   ========================================================= */

function setupLogin() {

    const loginButton =
        $("#loginButton");

    const signupButton =
        $("#goToSignup");


    if (signupButton) {

        signupButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                showScreen(
                    "signup"
                );

            }
        );

    }


    if (!loginButton) {

        return;

    }


    loginButton.addEventListener(
        "click",
        event => {

            event.preventDefault();


            const email =
                $("#loginEmail");

            const password =
                $("#loginPassword");


            if (
                !email ||
                !email.value.trim()
            ) {

                showToast(
                    "Please enter your email.",
                    "!"
                );

                email?.focus();

                return;

            }


            if (
                !password ||
                !password.value.trim()
            ) {

                showToast(
                    "Please enter your password.",
                    "!"
                );

                password?.focus();

                return;

            }


            /*
             * For this front-end version,
             * create/load the local account.
             */

            let user =
                getSavedUser();


            if (
                user &&
                user.email ===
                email.value.trim()
            ) {

                AppState.currentUser =
                    user;

            } else {

                AppState.currentUser = {

                    name:
                        email.value
                            .split("@")[0],

                    email:
                        email.value.trim()

                };


                saveUser(
                    AppState.currentUser
                );

            }


            AppState.isLoggedIn =
                true;


            setLoggedIn(
                true
            );


            updateAccountUI();


            showToast(
                "Login successful.",
                "✓"
            );


            setTimeout(
                () => {

                    startOrder();

                },
                450
            );

        }
    );

}


/* =========================================================
   SIGN UP
   ========================================================= */

function setupSignup() {

    const signupButton =
        $("#signupButton");

    const loginButton =
        $("#goToLogin");


    if (loginButton) {

        loginButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                showScreen(
                    "login"
                );

            }
        );

    }


    if (!signupButton) {

        return;

    }


    signupButton.addEventListener(
        "click",
        event => {

            event.preventDefault();


            const name =
                $("#signupName");

            const email =
                $("#signupEmail");

            const password =
                $("#signupPassword");


            if (
                !name ||
                !name.value.trim()
            ) {

                showToast(
                    "Please enter your name.",
                    "!"
                );

                name?.focus();

                return;

            }


            if (
                !email ||
                !email.value.trim()
            ) {

                showToast(
                    "Please enter your email.",
                    "!"
                );

                email?.focus();

                return;

            }


            if (
                !password ||
                password.value.length < 6
            ) {

                showToast(
                    "Password must be at least 6 characters.",
                    "!"
                );

                password?.focus();

                return;

            }


            AppState.currentUser = {

                name:
                    name.value.trim(),

                email:
                    email.value.trim()

            };


            saveUser(
                AppState.currentUser
            );


            AppState.isLoggedIn =
                true;


            setLoggedIn(
                true
            );


            updateAccountUI();


            const clientName =
                $("#clientName");


            if (clientName) {

                clientName.value =
                    AppState.currentUser.name;

            }


            showToast(
                "Account created successfully.",
                "✓"
            );


            setTimeout(
                () => {

                    startOrder();

                },
                450
            );

        }
    );

}


/* =========================================================
   ACCOUNT UI
   ========================================================= */

function updateAccountUI() {

    const user =
        AppState.currentUser;


    const loggedIn =
        AppState.isLoggedIn &&
        !!user;


    const headerButton =
        $("#accountHeaderButton");

    const homeCard =
        $("#loggedInHomeCard");

    const homeAccountButton =
        $("#homeAccountButton");


    if (
        headerButton
    ) {

        headerButton.style.display =
            loggedIn
                ? "flex"
                : "none";

    }


    if (
        homeCard
    ) {

        homeCard.style.display =
            loggedIn
                ? "flex"
                : "none";

    }


    if (
        homeAccountButton
    ) {

        homeAccountButton.textContent =
            loggedIn
                ? "👤 My Account"
                : "👤 Login / Create Account";

    }


    if (!loggedIn) {

        return;

    }


    const name =
        user.name ||
        "Account";


    const email =
        user.email ||
        "";


    const initial =
        name
            .charAt(0)
            .toUpperCase();


    /*
     * Header
     */

    $("#headerAccountInitial")
        && (
            $("#headerAccountInitial")
                .textContent =
                initial
        );


    $("#headerAccountName")
        && (
            $("#headerAccountName")
                .textContent =
                name
        );


    /*
     * Home
     */

    $("#homeAccountInitial")
        && (
            $("#homeAccountInitial")
                .textContent =
                initial
        );


    $("#homeAccountName")
        && (
            $("#homeAccountName")
                .textContent =
                name
        );


    $("#homeAccountEmail")
        && (
            $("#homeAccountEmail")
                .textContent =
                email
        );


    /*
     * Account page
     */

    $("#accountInitial")
        && (
            $("#accountInitial")
                .textContent =
                initial
        );


    $("#accountName")
        && (
            $("#accountName")
                .textContent =
                name
        );


    $("#accountEmail")
        && (
            $("#accountEmail")
                .textContent =
                email
        );

}


/* =========================================================
   LOGOUT
   ========================================================= */

function setupLogout() {

    const button =
        $("#logoutButton");


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        event => {

            event.preventDefault();


            AppState.isLoggedIn =
                false;

            AppState.currentUser =
                null;

            setLoggedIn(
                false
            );


            updateAccountUI();


            showToast(
                "Logged out successfully.",
                "✓"
            );


            setTimeout(
                () => {

                    showScreen(
                        "home"
                    );

                },
                400
            );

        }
    );

}


/* =========================================================
   CREATE ORDER
   ========================================================= */

function createOrder() {

    collectOrderData();


    const orders =
        getOrders();


    const nextNumber =
        orders.length + 1;


    const order = {

        id:
            `#${String(nextNumber).padStart(3, "0")}`,

        userEmail:
            AppState.currentUser
                ? AppState.currentUser.email
                : "",

        service:
            AppState.selectedService,

        plan:
            AppState.selectedPlan,

        clientName:
            AppState.orderData.clientName,

        gymName:
            AppState.orderData.gymName,

        instagram:
            AppState.orderData.instagram,

        projectGoal:
            AppState.orderData.projectGoal,

        projectNotes:
            AppState.orderData.projectNotes,

        specialInstructions:
            AppState.orderData.specialInstructions,

        videoCount:
            AppState.orderData.videoFiles
                .length,

        videoNames:
            AppState.orderData.videoFiles
                .map(file => file.name),

        status:
            "Submitted",

        date:
            new Date().toLocaleDateString(
                "en-IN"
            ),

        createdAt:
            new Date().toISOString()

    };


    orders.push(
        order
    );


    saveOrders(
        orders
    );


    AppState.currentOrderId =
        order.id;


    return order;

}


/* =========================================================
   SUBMIT ORDER
   ========================================================= */

function setupSubmitOrder() {

    const button =
        $("#submitOrderButton");


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        event => {

            event.preventDefault();


            if (
                !AppState.isLoggedIn
            ) {

                showScreen(
                    "login"
                );

                return;

            }


            if (
                !validateOrderStep(1)
            ) {

                goToOrderStep(
                    1
                );

                return;

            }


            const order =
                createOrder();


            if (!order) {

                return;

            }


            updateOrdersList();


            showToast(
                "Order submitted successfully.",
                "✓"
            );


            setTimeout(
                () => {

                    showScreen(
                        "order-success"
                    );

                },
                500
            );

        }
    );

}


/* =========================================================
   GET CURRENT USER ORDERS
   ========================================================= */

function getCurrentUserOrders() {

    const orders =
        getOrders();


    if (
        !AppState.currentUser
    ) {

        return [];

    }


    const email =
        AppState.currentUser.email;


    return orders.filter(
        order =>
            order.userEmail === email
    );

}


/* =========================================================
   MY ORDERS PAGE
   ========================================================= */

function updateOrdersList() {

    const container =
        $("#ordersList");


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    const orders =
        getCurrentUserOrders();


    if (
        orders.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-orders">

                <div class="empty-orders-icon">
                    📦
                </div>

                <h3>
                    No Orders Yet
                </h3>

                <p>
                    Your submitted orders
                    will appear here.
                </p>

            </div>

        `;

        return;

    }


    /*
     * Latest order first.
     */

    const reversed =
        [...orders].reverse();


    reversed.forEach(
        order => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "order-card";


            card.innerHTML = `

                <div class="order-card-top">

                    <div>

                        <div class="order-number">
                            ORDER ${escapeHTML(order.id)}
                        </div>

                        <div class="order-card-title">
                            ${escapeHTML(
                                getServiceName(
                                    order.service
                                )
                            )}
                        </div>

                    </div>

                    <span class="order-status">
                        ${escapeHTML(
                            order.status
                        )}
                    </span>

                </div>


                <div class="order-card-info">

                    <div class="order-info-item">

                        <span>
                            Plan
                        </span>

                        <strong>
                            ${escapeHTML(
                                getPlanName(
                                    order.plan
                                )
                            )}
                        </strong>

                    </div>


                    <div class="order-info-item">

                        <span>
                            Date
                        </span>

                        <strong>
                            ${escapeHTML(
                                order.date
                            )}
                        </strong>

                    </div>

                </div>


                <button
                    class="order-view-button"
                    type="button"
                    data-view-order="${escapeHTML(
                        order.id
                    )}"
                >
                    View Order Details →
                </button>

            `;


            container.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   ORDER CLICK
   ========================================================= */

function setupOrderViewButtons() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-view-order]"
                );


            if (!button) {

                return;

            }


            event.preventDefault();


            const id =
                button.dataset.viewOrder;


            openOrderDetails(
                id
            );

        }
    );

}


/* =========================================================
   OPEN ORDER DETAILS
   ========================================================= */

function openOrderDetails(
    orderId
) {

    const orders =
        getCurrentUserOrders();


    const order =
        orders.find(
            item =>
                item.id === orderId
        );


    if (!order) {

        showToast(
            "Order not found.",
            "!"
        );

        return;

    }


    AppState.currentOrderId =
        order.id;


    $("#detailOrderNumber")
        && (
            $("#detailOrderNumber")
                .textContent =
                order.id
        );


    $("#detailOrderStatus")
        && (
            $("#detailOrderStatus")
                .textContent =
                order.status
        );


    $("#detailService")
        && (
            $("#detailService")
                .textContent =
                getServiceName(
                    order.service
                )
        );


    $("#detailPlan")
        && (
            $("#detailPlan")
                .textContent =
                getPlanName(
                    order.plan
                )
        );


    $("#detailClient")
        && (
            $("#detailClient")
                .textContent =
                order.clientName ||
                "—"
        );


    $("#detailGym")
        && (
            $("#detailGym")
                .textContent =
                order.gymName ||
                "—"
        );


    $("#detailGoal")
        && (
            $("#detailGoal")
                .textContent =
                order.projectGoal ||
                "—"
        );


    $("#detailVideos")
        && (
            $("#detailVideos")
                .textContent =
                order.videoCount
                    ? `${order.videoCount} video${order.videoCount > 1 ? "s" : ""} uploaded`
                    : "No videos"
        );


    $("#detailInstructions")
        && (
            $("#detailInstructions")
                .textContent =
                order.specialInstructions ||
                order.projectNotes ||
                "No special instructions"
        );


    showScreen(
        "order-details"
    );

}


/* =========================================================
   RESET ORDER
   ========================================================= */

function resetOrder() {

    AppState.selectedService =
        "";

    AppState.selectedPlan =
        "";

    AppState.orderStep =
        1;

    AppState.currentOrderId =
        null;


    AppState.orderData = {

        clientName: "",

        gymName: "",

        instagram: "",

        projectGoal: "",

        projectNotes: "",

        specialInstructions: "",

        videoFiles: []

    };


    const fields = [

        "#clientName",

        "#gymName",

        "#instagramHandle",

        "#projectGoal",

        "#projectNotes",

        "#specialInstructions",

        "#videoFiles"

    ];


    fields.forEach(
        selector => {

            const field =
                $(selector);


            if (field) {

                field.value =
                    "";

            }

        }
    );


    const selectedFiles =
        $("#selectedFiles");


    if (selectedFiles) {

        selectedFiles.innerHTML =
            "";

    }


    showScreen(
        "home"
    );

}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer = null;


function showToast(
    message,
    icon = "✓"
) {

    const toast =
        $("#toast");


    if (!toast) {

        return;

    }


    const messageElement =
        $("#toastMessage");

    const iconElement =
        $("#toastIcon");


    if (messageElement) {

        messageElement.textContent =
            message;

    }


    if (iconElement) {

        iconElement.textContent =
            icon;

    }


    toast.classList.add(
        "visible"
    );


    toast.setAttribute(
        "aria-hidden",
        "false"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "visible"
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
   ESCAPE HTML
   ========================================================= */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   BRAND BUTTON
   ========================================================= */

function setupBrandButton() {

    const brand =
        $(".brand-button");


    if (!brand) {

        return;

    }


    brand.addEventListener(
        "click",
        event => {

            event.preventDefault();


            showScreen(
                "home"
            );

        }
    );

}


/* =========================================================
   FLOATING HOME
   ========================================================= */

function setupFloatingHome() {

    const button =
        $("#floatingHomeButton");


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        event => {

            event.preventDefault();


            showScreen(
                "home"
            );

        }
    );

}


/* =========================================================
   ACCOUNT HEADER
   ========================================================= */

function setupAccountHeader() {

    const button =
        $("#accountHeaderButton");


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        event => {

            event.preventDefault();


            if (
                AppState.isLoggedIn
            ) {

                showScreen(
                    "account"
                );

            } else {

                showScreen(
                    "login"
                );

            }

        }
    );

}


/* =========================================================
   ACCOUNT / ORDERS SCREEN CONTROL
   ========================================================= */

function setupAccountScreens() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    '[data-screen="orders"]'
                );


            if (!button) {

                return;

            }


            if (
                !AppState.isLoggedIn
            ) {

                event.preventDefault();

                showScreen(
                    "login"
                );

                return;

            }


            updateOrdersList();

        }
    );

}


/* =========================================================
   INITIAL LOAD
   ========================================================= */

function restoreSession() {

    const savedUser =
        getSavedUser();


    const loggedIn =
        isStoredLoggedIn();


    if (
        savedUser &&
        loggedIn
    ) {

        AppState.currentUser =
            savedUser;

        AppState.isLoggedIn =
            true;

    } else {

        AppState.currentUser =
            null;

        AppState.isLoggedIn =
            false;

    }


    updateAccountUI();

}


/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeApp() {

    /*
     * Restore previous login.
     */

    restoreSession();


    /*
     * Hide all screens.
     */

    hideAllScreens();


    /*
     * Home is first screen.
     */

    const home =
        getScreen("home");


    if (home) {

        home.classList.add(
            "active-screen"
        );

        home.setAttribute(
            "aria-hidden",
            "false"
        );

        home.style.display =
            "block";

    }


    AppState.currentScreen =
        "home";


    /*
     * Setup systems.
     */

    setupScreenButtons();

    setupServiceButtons();

    setupPlanButtons();

    setupOrderNextButtons();

    setupOrderBackButtons();

    setupVideoUpload();

    setupLogin();

    setupSignup();

    setupSubmitOrder();

    setupLogout();

    setupOrderViewButtons();

    setupBrandButton();

    setupFloatingHome();

    setupAccountHeader();

    setupAccountScreens();


    updateFloatingHome(
        "home"
    );


    updateAccountUI();


    console.log(
        "Gym Growth HQ — ACCOUNT SYSTEM READY"
    );

}


/* =========================================================
   START APP
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeApp,
        {
            once: true
        }
    );

} else {

    initializeApp();

}


/* =========================================================
   GLOBAL ACCESS
   ========================================================= */

window.GymGrowthHQ = {

    showScreen,

    startOrder,

    goToOrderStep,

    resetOrder,

    openOrderDetails,

    getOrders,

    getCurrentUserOrders,

    getState() {

        return {

            ...AppState,

            orderData: {

                ...AppState.orderData,

                videoFiles:
                    [
                        ...AppState
                            .orderData
                            .videoFiles
                    ]

            }

        };

    }

};


/* =========================================================
   END
   ========================================================= */
