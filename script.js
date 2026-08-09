/* =========================================================
   GYM GROWTH HQ
   FINAL NAVIGATION + ORDER FLOW
   ========================================================= */


/* =========================================================
   APP STATE
   ========================================================= */

const AppState = {

    currentScreen: "home",

    previousScreen: null,

    screenHistory: [],

    selectedService: "",

    selectedPlan: "",

    currentOrderStep: 1,

    orderData: {}

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
   SCREEN FINDER
   ========================================================= */

function getScreen(name) {

    if (!name) {
        return null;
    }

    const element =
        document.getElementById(name);

    if (
        element &&
        element.classList.contains("app-screen")
    ) {
        return element;
    }

    return document.querySelector(
        `[data-screen-section="${name}"]`
    );
}


/* =========================================================
   HIDE ALL SCREENS
   ========================================================= */

function hideAllScreens() {

    $all(".app-screen").forEach(screen => {

        screen.classList.remove(
            "active-screen"
        );

        screen.setAttribute(
            "aria-hidden",
            "true"
        );

    });

}


/* =========================================================
   SHOW SCREEN
   ========================================================= */

function showScreen(
    screenName,
    addHistory = true
) {

    const target =
        getScreen(screenName);

    if (!target) {

        console.error(
            "Screen not found:",
            screenName
        );

        return;

    }


    const targetId =
        target.id;


    if (
        AppState.currentScreen ===
        targetId
    ) {

        window.scrollTo(
            0,
            0
        );

        return;

    }


    if (
        addHistory &&
        AppState.currentScreen
    ) {

        AppState.screenHistory.push(
            AppState.currentScreen
        );

    }


    AppState.previousScreen =
        AppState.currentScreen;

    AppState.currentScreen =
        targetId;


    /*
     * IMPORTANT:
     * Only ONE screen can be visible.
     */

    hideAllScreens();


    target.classList.add(
        "active-screen"
    );

    target.setAttribute(
        "aria-hidden",
        "false"
    );


    /*
     * Always start the new screen
     * from the top.
     */

    window.scrollTo(
        0,
        0
    );


    updateNavigation(
        targetId
    );


    updateFloatingHome(
        targetId
    );

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function updateNavigation(
    screenName
) {

    $all(".nav-item").forEach(item => {

        item.classList.toggle(
            "active-nav",
            item.dataset.screen === screenName
        );

    });

}


/* =========================================================
   FLOATING HOME
   ========================================================= */

function updateFloatingHome(
    screenName
) {

    const button =
        $("#floatingHomeButton");

    if (!button) {
        return;
    }

    button.classList.toggle(
        "visible",
        screenName !== "home"
    );

}


/* =========================================================
   BACK
   ========================================================= */

function goBack() {

    if (
        AppState.screenHistory.length
    ) {

        const previous =
            AppState.screenHistory.pop();

        showScreen(
            previous,
            false
        );

        return;

    }


    showScreen(
        "home",
        false
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


            /*
             * These buttons have their own
             * special handlers.
             */

            if (
                button.matches(
                    "[data-detail]"
                ) ||
                button.matches(
                    "[data-plan-detail]"
                ) ||
                button.matches(
                    "[data-back]"
                ) ||
                button.matches(
                    "[data-order-next]"
                )
            ) {

                return;

            }


            event.preventDefault();


            const target =
                button.dataset.screen;


            /*
             * Save service when coming
             * from Service Details.
             */

            if (
                button.dataset.service
            ) {

                AppState.selectedService =
                    button.dataset.service;

            }


            /*
             * Save plan when coming
             * from Plan Details.
             */

            if (
                button.dataset.plan
            ) {

                AppState.selectedPlan =
                    button.dataset.plan;

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
             * HOME
             *   ↓
             * SERVICES
             *   ↓
             * SELECT SERVICE
             *   ↓
             * SERVICE DETAILS
             */

            showScreen(
                service
            );

        }
    );

}


/* =========================================================
   PLAN DETAIL
   ========================================================= */

function setupPlanDetails() {

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
                document.querySelector(
                    `[data-plan-detail-section="${plan}"]`
                );


            if (!target) {

                console.error(
                    "Plan detail not found:",
                    plan
                );

                return;

            }


            /*
             * PRICING
             *   ↓
             * PLAN DETAILS
             */

            showScreen(
                target.id
            );

        }
    );

}


/* =========================================================
   BACK BUTTONS
   ========================================================= */

function setupBackButtons() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-back]"
                );

            if (!button) {
                return;
            }


            event.preventDefault();


            const target =
                button.dataset.back;


            showScreen(
                target
            );

        }
    );

}


/* =========================================================
   ORDER — SERVICE
   ========================================================= */

function setupOrderService() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-order-service]"
                );

            if (!button) {
                return;
            }


            event.preventDefault();


            AppState.selectedService =
                button.dataset.orderService;


            setOrderStep(
                2
            );

        }
    );

}


/* =========================================================
   ORDER — PLAN
   ========================================================= */

function setupOrderPlan() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-order-plan]"
                );

            if (!button) {
                return;
            }


            event.preventDefault();


            AppState.selectedPlan =
                button.dataset.orderPlan;


            setOrderStep(
                3
            );

        }
    );

}


/* =========================================================
   ORDER STEP SYSTEM
   ========================================================= */

function setOrderStep(
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


    AppState.currentOrderStep =
        number;


    /*
     * Hide every order page.
     */

    $all(
        "[data-order-step]"
    ).forEach(
        element => {

            element.classList.remove(
                "active-order-step"
            );

        }
    );


    /*
     * Show ONLY selected order page.
     */

    const target =
        document.querySelector(
            `[data-order-step="${number}"]`
        );


    if (target) {

        target.classList.add(
            "active-order-step"
        );

    }


    /*
     * Progress indicators.
     */

    $all(
        "[data-progress-step]"
    ).forEach(
        element => {

            const progress =
                Number(
                    element.dataset.progressStep
                );


            element.classList.toggle(
                "active-progress",
                progress === number
            );


            element.classList.toggle(
                "completed-progress",
                progress < number
            );

        }
    );


    /*
     * Update review when entering
     * the review page.
     */

    if (number === 5) {

        collectOrderData();

        updateReview();

    }


    window.scrollTo(
        0,
        0
    );

}


/* =========================================================
   ORDER NEXT BUTTONS
   ========================================================= */

function setupOrderNext() {

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


            collectOrderData();


            const nextStep =
                Number(
                    button.dataset.orderNext
                );


            setOrderStep(
                nextStep
            );

        }
    );

}


/* =========================================================
   ORDER BACK
   ========================================================= */

function setupOrderBack() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-order-go-step]"
                );

            if (!button) {
                return;
            }


            event.preventDefault();


            const step =
                Number(
                    button.dataset.orderGoStep
                );


            setOrderStep(
                step
            );

        }
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


    AppState.orderData = {

        service:
            AppState.selectedService,

        plan:
            AppState.selectedPlan,

        clientName:
            clientName
                ? clientName.value.trim()
                : "",

        gymName:
            gymName
                ? gymName.value.trim()
                : "",

        instagram:
            instagram
                ? instagram.value.trim()
                : "",

        projectGoal:
            projectGoal
                ? projectGoal.value
                : "",

        projectNotes:
            projectNotes
                ? projectNotes.value.trim()
                : ""

    };

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
        "Selected Service"
    );

}


/* =========================================================
   PLAN NAME
   ========================================================= */

function getPlanName(
    plan
) {

    const names = {

        "standard":
            "Standard",

        "premium":
            "Premium",

        "reel-editing":
            "Standard Reel",

        "transformation":
            "Transformation Reel",

        "gym-promotion":
            "Promotional Video"

    };


    return (
        names[plan] ||
        "Selected Plan"
    );

}


/* =========================================================
   UPDATE REVIEW
   ========================================================= */

function updateReview() {

    const service =
        $("#reviewService");

    const plan =
        $("#reviewPlan");

    const gym =
        $("#reviewGym");

    const instagram =
        $("#reviewInstagram");


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

}


/* =========================================================
   SUBMIT ORDER
   ========================================================= */

function setupOrderSubmit() {

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
             * Gym Name required.
             */

            if (
                !AppState.orderData.gymName
            ) {

                showToast(
                    "Please enter your gym name.",
                    "!"
                );


                setOrderStep(
                    4
                );


                const gym =
                    $("#gymName");


                if (gym) {

                    gym.focus();

                }


                return;

            }


            /*
             * Instagram required.
             */

            if (
                !AppState.orderData.instagram
            ) {

                showToast(
                    "Please enter your Instagram.",
                    "!"
                );


                setOrderStep(
                    4
                );


                const instagram =
                    $("#instagramHandle");


                if (instagram) {

                    instagram.focus();

                }


                return;

            }


            /*
             * Order received.
             */

            const success =
                $("#orderSuccess");


            if (success) {

                success.classList.add(
                    "visible"
                );


                success.setAttribute(
                    "aria-hidden",
                    "false"
                );

            }


            showToast(
                "Order submitted successfully.",
                "✓"
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

    AppState.currentOrderStep =
        1;

    AppState.orderData =
        {};


    [
        "#clientName",
        "#gymName",
        "#instagramHandle",
        "#projectGoal",
        "#projectNotes"
    ].forEach(
        selector => {

            const field =
                $(selector);


            if (field) {

                field.value =
                    "";

            }

        }
    );


    const success =
        $("#orderSuccess");


    if (success) {

        success.classList.remove(
            "visible"
        );

        success.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    setOrderStep(
        1
    );

}


/* =========================================================
   BRAND → HOME
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


            AppState.screenHistory =
                [];


            showScreen(
                "home",
                false
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


            AppState.screenHistory =
                [];


            showScreen(
                "home",
                false
            );

        }
    );

}


/* =========================================================
   SUPPORT
   ========================================================= */

function setupSupport() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-support]"
                );

            if (!button) {
                return;
            }


            event.preventDefault();


            const type =
                button.dataset.support;


            const target =
                document.querySelector(
                    `[data-support-section="${type}"]`
                );


            if (target) {

                showScreen(
                    target.id
                );

            }

        }
    );

}


/* =========================================================
   MODAL
   ========================================================= */

function setupModal() {

    const close =
        $("#modalClose");


    if (close) {

        close.addEventListener(
            "click",
            closeInfoModal
        );

    }


    document.addEventListener(
        "click",
        event => {

            if (
                event.target.closest(
                    "[data-modal-close]"
                )
            ) {

                closeInfoModal();

            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeInfoModal();

            }

        }
    );

}


function closeInfoModal() {

    const modal =
        $("#infoModal");


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "open"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


function openInfoModal(
    data = {}
) {

    const modal =
        $("#infoModal");


    if (!modal) {
        return;
    }


    const icon =
        $("#modalIcon");

    const eyebrow =
        $("#modalEyebrow");

    const title =
        $("#modalTitle");

    const text =
        $("#modalText");


    if (
        icon &&
        data.icon
    ) {

        icon.textContent =
            data.icon;

    }


    if (
        eyebrow &&
        data.eyebrow
    ) {

        eyebrow.textContent =
            data.eyebrow;

    }


    if (
        title &&
        data.title
    ) {

        title.textContent =
            data.title;

    }


    if (
        text &&
        data.text
    ) {

        text.textContent =
            data.text;

    }


    modal.classList.add(
        "open"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
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
   INITIAL HOME
   ========================================================= */

function initializeHome() {

    /*
     * IMPORTANT:
     * Home is the ONLY initial screen.
     */

    hideAllScreens();


    const home =
        getScreen("home");


    if (!home) {

        console.error(
            "Home screen not found."
        );

        return;

    }


    home.classList.add(
        "active-screen"
    );


    home.setAttribute(
        "aria-hidden",
        "false"
    );


    AppState.currentScreen =
        "home";


    AppState.previousScreen =
        null;


    AppState.screenHistory =
        [];


    window.scrollTo(
        0,
        0
    );

}


/* =========================================================
   INITIALIZE APP
   ========================================================= */

function initializeApp() {

    initializeHome();


    setupScreenButtons();

    setupServiceButtons();

    setupPlanDetails();

    setupBackButtons();

    setupOrderService();

    setupOrderPlan();

    setupOrderNext();

    setupOrderBack();

    setupOrderSubmit();

    setupBrandButton();

    setupFloatingHome();

    setupSupport();

    setupModal();


    /*
     * Start Order at Page 1.
     */

    setOrderStep(
        1
    );


    console.log(
        "Gym Growth HQ — FINAL FLOW READY"
    );

}


/* =========================================================
   DOM READY
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

    goBack,

    setOrderStep,

    resetOrder,

    openInfoModal,

    closeInfoModal,

    showToast,

    getState() {

        return {
            ...AppState,
            orderData: {
                ...AppState.orderData
            }
        };

    }

};


/* =========================================================
   END
   ========================================================= */
