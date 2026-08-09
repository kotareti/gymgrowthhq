/* =========================================================
   GYM GROWTH HQ
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
   HIDE EVERY SCREEN
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
             * This also guarantees that
             * multiple pages do not appear
             * together even before CSS loads.
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
             * Save selected service
             */

            if (
                button.dataset.service
            ) {

                AppState.selectedService =
                    button.dataset.service;

            }


            /*
             * Save selected plan
             */

            if (
                button.dataset.plan
            ) {

                AppState.selectedPlan =
                    button.dataset.plan;

            }


            /*
             * Starting Order
             */

            if (
                target ===
                "order"
            ) {

                startOrder();

                return;

            }


            showScreen(
                target
            );

        }
    );

}


/* =========================================================
   SERVICE SELECTION
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


            /*
             * SERVICES
             *     ↓
             * SELECT SERVICE
             *     ↓
             * SERVICE DETAILS
             */

            showScreen(
                service
            );

        }
    );

}


/* =========================================================
   PLAN DETAILS
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


            const target =
                `plan-${plan}`;


            showScreen(
                target
            );

        }
    );

}


/* =========================================================
   ORDER START
   ========================================================= */

function startOrder() {

    AppState.orderStep =
        1;


    showScreen(
        "order"
    );


    updateOrderProgress();

}


/* =========================================================
   ORDER ROOM MAP
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
     * Save current room data
     * before moving forward.
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


    /*
     * Review page needs
     * fresh information.
     */

    if (
        number === 5
    ) {

        updateReview();

    }

}


/* =========================================================
   ORDER NEXT BUTTON
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


            goToOrderStep(
                next
            );

        }
    );

}


/* =========================================================
   ORDER BACK BUTTON
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
   ORDER PROGRESS
   ========================================================= */

function updateOrderProgress() {

    /*
     * New HTML does not need visible
     * progress circles, but we keep
     * this function for future use.
     */

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
                `${files.length} video file${files.length > 1 ? "s" : ""} selected.`,
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
            AppState.orderData
                .videoFiles
                .length;


        videos.textContent =
            count > 0
                ? `${count} video${count > 1 ? "s" : ""} selected`
                : "No videos selected";

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

        "transformation":
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

        "transformation":
            "Transformation Reel",

        "gym-promotion":
            "Promotional Video",

        "standard":
            "Standard",

        "premium":
            "Premium"

    };


    return (
        names[plan] ||
        "Not selected"
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


            collectOrderData();


            /*
             * Basic validation
             */

            if (
                !AppState.orderData.clientName
            ) {

                showToast(
                    "Please enter your name.",
                    "!"
                );


                goToOrderStep(
                    1
                );


                const field =
                    $("#clientName");


                if (field) {

                    field.focus();

                }


                return;

            }


            if (
                !AppState.orderData.gymName
            ) {

                showToast(
                    "Please enter your gym name.",
                    "!"
                );


                goToOrderStep(
                    1
                );


                const field =
                    $("#gymName");


                if (field) {

                    field.focus();

                }


                return;

            }


            if (
                !AppState.orderData.instagram
            ) {

                showToast(
                    "Please enter your Instagram.",
                    "!"
                );


                goToOrderStep(
                    1
                );


                const field =
                    $("#instagramHandle");


                if (field) {

                    field.focus();

                }


                return;

            }


            /*
             * For now this is the
             * front-end success state.
             *
             * Later we connect this
             * to backend/database/payment.
             */

            console.log(
                "ORDER DATA:",
                {
                    service:
                        AppState.selectedService,

                    plan:
                        AppState.selectedPlan,

                    ...AppState.orderData
                }
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


            resetOrder();

        }
    );

}


/* =========================================================
   BRAND HOME
   ========================================================= */

function setupBrandButton() {

    const button =
        $(".brand-button");


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
   KEYBOARD ESCAPE
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        /*
         * Escape returns to the
         * previous logical place.
         */

        const current =
            AppState.currentScreen;


        if (
            current ===
            "order-project"
        ) {

            goToOrderStep(
                1
            );

        }

        else if (
            current ===
            "order-upload"
        ) {

            goToOrderStep(
                2
            );

        }

        else if (
            current ===
            "order-instructions"
        ) {

            goToOrderStep(
                3
            );

        }

        else if (
            current ===
            "order-review"
        ) {

            goToOrderStep(
                4
            );

        }

    }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeApp() {

    /*
     * Make absolutely sure that
     * only Home appears initially.
     */

    hideAllScreens();


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


    setupScreenButtons();

    setupServiceButtons();

    setupPlanButtons();

    setupOrderNextButtons();

    setupOrderBackButtons();

    setupVideoUpload();

    setupSubmitOrder();

    setupFloatingHome();

    setupBrandButton();


    updateFloatingHome(
        "home"
    );


    console.log(
        "Gym Growth HQ — JavaScript Ready"
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
