/* =========================================================
   GYM GROWTH HQ
   FINAL JAVASCRIPT
   LOGIN + SIGNUP + ORDER FLOW
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
   SCREEN MAP
   ========================================================= */

const screens = {

    home: "home",

    services: "services",

    "reel-editing": "reel-editing",

    transformation: "transformation",

    "gym-promotion": "gym-promotion",

    pricing: "pricing",

    "plan-reel-editing":
        "plan-reel-editing",

    "plan-transformation":
        "plan-transformation",

    "plan-gym-promotion":
        "plan-gym-promotion",

    login: "login",

    signup: "signup",

    order: "order",

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

    support: "support"

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

    $all(".app-screen").forEach(
        screen => {

            screen.classList.remove(
                "active-screen"
            );

            screen.setAttribute(
                "aria-hidden",
                "true"
            );

            /*
             * Important:
             * Only one screen is visible.
             */

            screen.style.display =
                "none";

        }
    );

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
   GENERIC SCREEN BUTTONS
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


            /*
             * Save selected service.
             */

            if (
                button.dataset.service
            ) {

                AppState.selectedService =
                    button.dataset.service;

            }


            /*
             * Save selected plan.
             */

            if (
                button.dataset.plan
            ) {

                AppState.selectedPlan =
                    button.dataset.plan;

            }


            /*
             * Start Order.
             *
             * Login must happen first.
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


    showScreen(
        "order"
    );


    updateOrderProgress();

}


/* =========================================================
   ORDER ROOMS
   ========================================================= */

const orderRooms = {

    1: "order",

    2: "order-project",

    3: "order-upload",

    4: "order-instructions",

    5: "order-review"

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


    /*
     * Save current information
     * before moving to next room.
     */

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


            /*
             * Validate current room.
             */

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


    /*
     * STEP 1
     * Client Details
     */

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


            const field =
                $("#clientName");


            if (field) {

                field.focus();

            }


            return false;

        }


        if (
            !AppState.orderData.gymName
        ) {

            showToast(
                "Please enter your gym name.",
                "!"
            );


            const field =
                $("#gymName");


            if (field) {

                field.focus();

            }


            return false;

        }


        if (
            !AppState.orderData.instagram
        ) {

            showToast(
                "Please enter your Instagram.",
                "!"
            );


            const field =
                $("#instagramHandle");


            if (field) {

                field.focus();

            }


            return false;

        }

    }


    /*
     * STEP 2
     * Project Details
     */

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


            const field =
                $("#projectGoal");


            if (field) {

                field.focus();

            }


            return false;

        }

    }


    /*
     * STEP 3
     * Video Upload
     *
     * We do not force upload yet.
     * Client can continue if needed.
     */

    if (
        step === 3
    ) {

        /*
         * Upload is optional for now.
         *
         * Real cloud upload will be
         * connected later.
         */

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


            if (
                files.length === 0
            ) {

                return;

            }


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


            showToast(
                `${files.length} video${files.length > 1 ? "s" : ""} selected.`,
                "✓"
            );

        }
    );

}


/* =========================================================
   REVIEW
   ========================================================= */

function updateReview() {

    collectOrderData();


    const service =
        $("#reviewService");

    const plan =
        $("#reviewPlan");

    const client =
        $("#reviewClient");

    const gym =
        $("#reviewGym");

    const instagram =
        $("#reviewInstagram");

    const videos =
        $("#reviewVideos");


    if (service) {

        service.textContent =
            getServiceName(
                AppState.selectedService
            );

    }


    if (plan) {

        plan.textContent =
            getPlanName(
                AppState.selectedPlan
            );

    }


    if (client) {

        client.textContent =
            AppState.orderData.clientName ||
            "Not provided";

    }


    if (gym) {

        gym.textContent =
            AppState.orderData.gymName ||
            "Not provided";

    }


    if (instagram) {

        instagram.textContent =
            AppState.orderData.instagram ||
            "Not provided";

    }


    if (videos) {

        const count =
            AppState.orderData.videoFiles
                .length;


        videos.textContent =
            count > 0
                ? `${count} video${count > 1 ? "s" : ""} selected`
                : "No videos selected";

    }

}


/* =========================================================
   LOGIN
   ========================================================= */

function setupLogin() {

    const loginButton =
        $("#loginButton");

    const signupButton =
        $("#goToSignup");


    /*
     * Go to signup
     */

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


                if (email) {

                    email.focus();

                }


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


                if (password) {

                    password.focus();

                }


                return;

            }


            /*
             * TEMPORARY LOGIN
             *
             * Real authentication will
             * be connected later.
             */

            AppState.isLoggedIn =
                true;


            AppState.currentUser = {

                email:
                    email.value.trim()

            };


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


    /*
     * Already have account
     */

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


                if (name) {

                    name.focus();

                }


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


                if (email) {

                    email.focus();

                }


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


                if (password) {

                    password.focus();

                }


                return;

            }


            /*
             * TEMPORARY ACCOUNT
             *
             * Real authentication will
             * be connected later.
             */

            AppState.isLoggedIn =
                true;


            AppState.currentUser = {

                name:
                    name.value.trim(),

                email:
                    email.value.trim()

            };


            /*
             * Automatically put the
             * signup name into order.
             */

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


            /*
             * Validate final order.
             */

            if (
                !validateOrderStep(
                    1
                )
            ) {

                goToOrderStep(
                    1
                );

                return;

            }


            collectOrderData();


            /*
             * Front-end only for now.
             *
             * Later this data will be
             * sent to our backend.
             */

            const finalOrder = {

                service:
                    AppState.selectedService,

                plan:
                    AppState.selectedPlan,

                user:
                    AppState.currentUser,

                order:
                    {
                        ...AppState.orderData
                    }

            };


            console.log(
                "FINAL ORDER:",
                finalOrder
            );


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
   RESET ORDER
   ========================================================= */

function resetOrder() {

    AppState.selectedService =
        "";

    AppState.selectedPlan =
        "";

    AppState.orderStep =
        1;


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
   INITIALIZE APP
   ========================================================= */

function initializeApp() {

    /*
     * Hide everything first.
     */

    hideAllScreens();


    /*
     * Home is the only initial screen.
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
     * Setup all systems.
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

    setupBrandButton();

    setupFloatingHome();


    updateFloatingHome(
        "home"
    );


    console.log(
        "Gym Growth HQ — FINAL APP READY"
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
