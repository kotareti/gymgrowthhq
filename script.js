/* =========================================================
   GYM GROWTH HQ
   FINAL CLEAN SCRIPT.JS
   ========================================================= */


/* =========================================================
   1. APP STATE
   ========================================================= */

const AppState = {

    currentScreen: "home",

    previousScreen: null,

    screenHistory: [],

    selectedService: null,

    currentOrderStep: 1,

    orderData: {},

    modalOpen: false

};


/* =========================================================
   2. HELPERS
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
   3. SCREEN FINDER
   ========================================================= */

function getScreen(name) {

    if (!name) {

        return null;

    }


    const byId =
        document.getElementById(name);


    if (byId &&
        byId.classList.contains("app-screen")) {

        return byId;

    }


    return document.querySelector(
        `.app-screen[data-screen-section="${name}"]`
    );

}


/* =========================================================
   4. HIDE ALL SCREENS
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

        }
    );

}


/* =========================================================
   5. SHOW SCREEN
   ========================================================= */

function showScreen(
    name,
    addHistory = true
) {

    const target =
        getScreen(name);


    if (!target) {

        console.error(
            "Gym Growth HQ: Screen not found:",
            name
        );

        return false;

    }


    const targetName =
        target.id;


    if (
        AppState.currentScreen ===
        targetName
    ) {

        window.scrollTo(
            0,
            0
        );

        return true;

    }


    if (
        addHistory &&
        AppState.currentScreen &&
        AppState.currentScreen !==
        targetName
    ) {

        AppState.screenHistory.push(
            AppState.currentScreen
        );

    }


    AppState.previousScreen =
        AppState.currentScreen;


    AppState.currentScreen =
        targetName;


    /*
     * IMPORTANT:
     * Remove active-screen from EVERY
     * screen before showing the new one.
     */

    hideAllScreens();


    target.classList.add(
        "active-screen"
    );


    target.setAttribute(
        "aria-hidden",
        "false"
    );


    updateNavigation(
        targetName
    );


    updateFloatingHome(
        targetName
    );


    document.body.dataset.screen =
        targetName;


    /*
     * Instant reset.
     * No smooth scrolling.
     */

    window.scrollTo(
        0,
        0
    );


    return true;

}


/* =========================================================
   6. NAVIGATION ACTIVE STATE
   ========================================================= */

function updateNavigation(
    screenName
) {

    $all(".nav-item").forEach(
        item => {

            const target =
                item.dataset.screen;


            const active =
                target === screenName;


            item.classList.toggle(
                "active-nav",
                active
            );


            item.setAttribute(
                "aria-current",
                active
                    ? "page"
                    : "false"
            );

        }
    );

}


/* =========================================================
   7. FLOATING HOME BUTTON
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
   8. GO BACK
   ========================================================= */

function goBack() {

    if (
        AppState.screenHistory.length
        > 0
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
   9. ALL SCREEN BUTTONS
   =========================================================

   Handles:
   Home
   Services
   Pricing
   Order
   Support
   Explore Services
   View Pricing
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
             * Ignore special buttons.
             * They have their own handlers.
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
                )
            ) {

                return;

            }


            event.preventDefault();


            const target =
                button.dataset.screen;


            const plan =
                button.dataset.plan;


            if (plan) {

                AppState.selectedService =
                    plan;

            }


            showScreen(
                target
            );

        }
    );

}


/* =========================================================
   10. SERVICE DETAILS
   ========================================================= */

function setupServiceDetails() {

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


            const detail =
                button.dataset.detail;


            const target =
                getScreen(
                    detail
                );


            if (!target) {

                console.error(
                    "Service detail not found:",
                    detail
                );

                return;

            }


            showScreen(
                target.id
            );

        }
    );

}


/* =========================================================
   11. PLAN DETAILS
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


            /*
             * Reel Editing
             * -> plan-reel-editing
             *
             * Transformation
             * -> plan-transformation
             *
             * Gym Promotion
             * -> gym-promotion
             */

            let target =
                document.querySelector(
                    `[data-plan-detail-section="${plan}"]`
                );


            /*
             * Gym Promotion does not have
             * a separate plan-detail screen.
             * Its detail screen is gym-promotion.
             */

            if (
                !target &&
                plan === "gym-promotion"
            ) {

                target =
                    getScreen(
                        "gym-promotion"
                    );

            }


            if (!target) {

                console.error(
                    "Plan detail not found:",
                    plan
                );

                return;

            }


            showScreen(
                target.id
            );

        }
    );

}


/* =========================================================
   12. BACK BUTTONS
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
   13. ORDER SERVICE SELECTION
   ========================================================= */

function setupOrderServiceSelection() {

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
   14. ORDER STEP SYSTEM
   ========================================================= */

function setOrderStep(
    step
) {

    const number =
        Number(step);


    if (
        number < 1 ||
        number > 3
    ) {

        return;

    }


    AppState.currentOrderStep =
        number;


    $all(
        "[data-order-step]"
    ).forEach(
        element => {

            const stepNumber =
                Number(
                    element.dataset.orderStep
                );


            element.classList.toggle(
                "active-order-step",
                stepNumber === number
            );

        }
    );


    /*
     * If the HTML has progress indicators,
     * update them too.
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


    const order =
        getScreen("order");


    if (order) {

        order.scrollTop =
            0;

    }


    window.scrollTo(
        0,
        0
    );

}


/* =========================================================
   15. ORDER STEP NAVIGATION
   ========================================================= */

function setupOrderStepNavigation() {

    document.addEventListener(
        "click",
        event => {

            const next =
                event.target.closest(
                    "[data-order-next]"
                );


            if (next) {

                event.preventDefault();


                const step =
                    Number(
                        next.dataset.orderNext
                    );


                collectOrderData();


                setOrderStep(
                    step
                );


                return;

            }


            const back =
                event.target.closest(
                    "[data-order-go-step]"
                );


            if (back) {

                event.preventDefault();


                const step =
                    Number(
                        back.dataset.orderGoStep
                    );


                setOrderStep(
                    step
                );

            }

        }
    );

}


/* =========================================================
   16. COLLECT ORDER DATA
   ========================================================= */

function collectOrderData() {

    const goal =
        $("#projectGoal");


    const notes =
        $("#projectNotes");


    const gym =
        $("#gymName");


    const instagram =
        $("#instagramHandle");


    AppState.orderData = {

        service:
            AppState.selectedService,

        projectGoal:
            goal
                ? goal.value
                : "",

        projectNotes:
            notes
                ? notes.value.trim()
                : "",

        gymName:
            gym
                ? gym.value.trim()
                : "",

        instagram:
            instagram
                ? instagram.value.trim()
                : ""

    };

}


/* =========================================================
   17. ORDER SUBMIT
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


            const gym =
                $("#gymName");


            const instagram =
                $("#instagramHandle");


            /*
             * Phone number is NOT used.
             */

            if (
                !gym ||
                !gym.value.trim()
            ) {

                showToast(
                    "Please enter your gym name.",
                    "!"
                );


                if (gym) {

                    gym.focus();

                }


                return;

            }


            if (
                !instagram ||
                !instagram.value.trim()
            ) {

                showToast(
                    "Please enter your Instagram.",
                    "!"
                );


                if (instagram) {

                    instagram.focus();

                }


                return;

            }


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
                "Order request ready.",
                "✓"
            );

        }
    );

}


/* =========================================================
   18. RESET ORDER
   ========================================================= */

function resetOrderForm() {

    AppState.selectedService =
        null;


    AppState.currentOrderStep =
        1;


    AppState.orderData =
        {};


    [
        "#projectGoal",
        "#projectNotes",
        "#gymName",
        "#instagramHandle"
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
   19. FLOATING HOME
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
   20. BRAND HOME
   ========================================================= */

function setupBrandHome() {

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
   21. SWIPE
   ========================================================= */

function setupSwipe() {

    let startX =
        0;

    let startY =
        0;


    document.addEventListener(
        "touchstart",
        event => {

            if (
                event.touches.length !== 1
            ) {

                return;

            }


            startX =
                event.touches[0].clientX;


            startY =
                event.touches[0].clientY;

        },
        {
            passive: true
        }
    );


    document.addEventListener(
        "touchend",
        event => {

            if (
                event.changedTouches.length !== 1
            ) {

                return;

            }


            const endX =
                event.changedTouches[0].clientX;


            const endY =
                event.changedTouches[0].clientY;


            const deltaX =
                endX - startX;


            const deltaY =
                endY - startY;


            if (
                Math.abs(deltaX) < 70
            ) {

                return;

            }


            if (
                Math.abs(deltaX) <=
                Math.abs(deltaY)
            ) {

                return;

            }


            const screens = [

                "home",
                "services",
                "pricing",
                "order",
                "support"

            ];


            const current =
                screens.indexOf(
                    AppState.currentScreen
                );


            if (
                current === -1
            ) {

                return;

            }


            if (
                deltaX < 0 &&
                current <
                screens.length - 1
            ) {

                showScreen(
                    screens[current + 1]
                );

            }


            if (
                deltaX > 0 &&
                current > 0
            ) {

                showScreen(
                    screens[current - 1]
                );

            }

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   22. TOAST
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
   23. MODAL
   ========================================================= */

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


    AppState.modalOpen =
        true;

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


    AppState.modalOpen =
        false;

}


/* =========================================================
   24. MODAL EVENTS
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


/* =========================================================
   25. INITIAL SCREEN
   ========================================================= */

function initializeHome() {

    /*
     * ALWAYS start at Home.
     */

    hideAllScreens();


    const home =
        getScreen("home");


    if (!home) {

        console.error(
            "Gym Growth HQ: Home screen missing."
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


    updateNavigation(
        "home"
    );


    updateFloatingHome(
        "home"
    );


    window.scrollTo(
        0,
        0
    );

}


/* =========================================================
   26. FINAL INITIALIZATION
   ========================================================= */

function initializeApp() {

    initializeHome();

    setupScreenButtons();

    setupServiceDetails();

    setupPlanDetails();

    setupBackButtons();

    setupOrderServiceSelection();

    setupOrderStepNavigation();

    setupOrderSubmit();

    setupFloatingHome();

    setupBrandHome();

    setupSwipe();

    setupModal();


    console.log(
        "Gym Growth HQ — FINAL NAVIGATION READY"
    );

}


/* =========================================================
   27. DOM READY
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

}

else {

    initializeApp();

}


/* =========================================================
   28. GLOBAL ACCESS
   ========================================================= */

window.GymGrowthHQ = {

    showScreen,

    goBack,

    setOrderStep,

    resetOrderForm,

    openInfoModal,

    closeInfoModal,

    showToast,

    getState() {

        return {
            ...AppState
        };

    }

};


/* =========================================================
   END OF FINAL SCRIPT.JS
   ========================================================= */
