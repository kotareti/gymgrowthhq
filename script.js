/* =========================================================
   GYM GROWTH HQ
   CLEAN SCRIPT.JS
   =========================================================

   MAIN SYSTEM
   - Home
   - Services
   - Pricing
   - Service Details
   - Plan Details
   - Order Flow
   - Support
   - Swipe Navigation
   - Back Navigation
   - Modal
   - Toast
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

    modalOpen: false,

    isLoading: false

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
   3. SERVICE DATA
   ========================================================= */

const serviceData = {

    "reel-editing": {

        name: "Reel Editing",

        icon: "🎬",

        price: "₹199 / reel"

    },

    "transformation": {

        name: "Transformation Reel",

        icon: "🔥",

        price: "₹299 / reel"

    },

    "gym-promotion": {

        name: "Gym Promotion",

        icon: "📈",

        price: "₹499 / video"

    }

};


/* =========================================================
   4. GET SCREEN
   ========================================================= */

function getScreen(name) {

    const direct =
        document.getElementById(name);

    if (direct) {

        return direct;

    }


    return document.querySelector(
        `[data-screen-section="${name}"]`
    );

}


/* =========================================================
   5. GET DETAIL SCREEN
   ========================================================= */

function getDetailScreen(name) {

    return document.querySelector(
        `[data-detail-section="${name}"]`
    );

}


/* =========================================================
   6. GET PLAN DETAIL SCREEN
   ========================================================= */

function getPlanDetailScreen(name) {

    return document.querySelector(
        `[data-plan-detail-section="${name}"]`
    );

}


/* =========================================================
   7. RESOLVE TARGET
   ========================================================= */

function resolveTarget(name) {

    if (!name) {

        return null;

    }


    const normalScreen =
        getScreen(name);

    if (normalScreen) {

        return normalScreen;

    }


    const detailScreen =
        getDetailScreen(name);

    if (detailScreen) {

        return detailScreen;

    }


    const planScreen =
        getPlanDetailScreen(name);

    if (planScreen) {

        return planScreen;

    }


    return null;

}


/* =========================================================
   8. HIDE EVERYTHING
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
   9. UPDATE BOTTOM NAV
   ========================================================= */

function updateBottomNavigation(
    screenName
) {

    $all(".nav-item").forEach(
        item => {

            const target =
                item.dataset.screen;

            item.classList.toggle(
                "active-nav",
                target === screenName
            );

        }
    );

}


/* =========================================================
   10. UPDATE FLOATING HOME
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
   11. SHOW SCREEN
   ========================================================= */

function showScreen(
    screenName,
    addHistory = true
) {

    const target =
        resolveTarget(screenName);


    if (!target) {

        console.warn(
            "Gym Growth HQ: Screen not found:",
            screenName
        );

        return;

    }


    const actualName =
        target.id || screenName;


    if (
        AppState.currentScreen ===
            actualName &&
        target.classList.contains(
            "active-screen"
        )
    ) {

        return;

    }


    if (
        addHistory &&
        AppState.currentScreen &&
        AppState.currentScreen !== actualName
    ) {

        AppState.screenHistory.push(
            AppState.currentScreen
        );

    }


    AppState.previousScreen =
        AppState.currentScreen;


    AppState.currentScreen =
        actualName;


    hideAllScreens();


    target.classList.add(
        "active-screen"
    );


    target.setAttribute(
        "aria-hidden",
        "false"
    );


    updateBottomNavigation(
        actualName
    );


    updateFloatingHome(
        actualName
    );


    document.body.dataset.screen =
        actualName;


    window.scrollTo(
        0,
        0
    );

}


/* =========================================================
   12. GO BACK
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
   13. NAVIGATION BUTTONS
   =========================================================

   IMPORTANT:
   ONE EVENT SYSTEM ONLY.

   This prevents duplicate click handlers.
   ========================================================= */

function setupNavigation() {

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


            if (
                button.classList.contains(
                    "nav-item"
                )
            ) {

                event.preventDefault();

                showScreen(
                    button.dataset.screen
                );

                return;

            }


            if (
                button.dataset.screen
            ) {

                event.preventDefault();

                handleScreenButton(
                    button
                );

            }

        }
    );

}


/* =========================================================
   14. SCREEN BUTTON HANDLER
   ========================================================= */

function handleScreenButton(
    button
) {

    const target =
        button.dataset.screen;


    if (!target) {

        return;

    }


    const selectedPlan =
        button.dataset.plan;


    if (
        target === "order" &&
        selectedPlan
    ) {

        selectService(
            selectedPlan
        );

    }


    showScreen(
        target
    );

}


/* =========================================================
   15. SERVICE DETAIL BUTTONS
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


            const service =
                button.dataset.detail;


            const target =
                getDetailScreen(
                    service
                );


            if (!target) {

                console.warn(
                    "Service detail not found:",
                    service
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
   16. PRICING PLAN DETAILS
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


            let target =
                getPlanDetailScreen(
                    plan
                );


            /*
             * Gym Promotion currently has
             * no separate plan-detail section
             * in the HTML.
             *
             * Therefore use its service detail.
             */

            if (
                !target &&
                plan === "gym-promotion"
            ) {

                target =
                    getDetailScreen(
                        "gym-promotion"
                    );

            }


            if (!target) {

                console.warn(
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
   17. BACK BUTTONS
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
                target,
                false
            );

        }
    );

}


/* =========================================================
   18. FLOATING HOME BUTTON
   ========================================================= */

function setupFloatingHomeButton() {

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
   19. SELECT SERVICE
   ========================================================= */

function selectService(
    serviceKey
) {

    if (
        !serviceData[serviceKey]
    ) {

        return;

    }


    AppState.selectedService =
        serviceKey;


    updateSelectedServiceUI();

}


/* =========================================================
   20. UPDATE SELECTED SERVICE UI
   ========================================================= */

function updateSelectedServiceUI() {

    const service =
        serviceData[
            AppState.selectedService
        ];


    if (!service) {

        return;

    }


    const name =
        $("#selectedServiceName");


    if (name) {

        name.textContent =
            service.name;

    }


    const icon =
        $(".selected-service-icon");


    if (icon) {

        icon.textContent =
            service.icon;

    }

}


/* =========================================================
   21. ORDER SERVICE SELECTION
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


            const service =
                button.dataset.orderService;


            selectService(
                service
            );


            setOrderStep(
                2
            );

        }
    );

}


/* =========================================================
   22. ORDER STEPS
   ========================================================= */

function setOrderStep(
    step
) {

    const number =
        Number(step);


    if (
        ![1, 2, 3].includes(number)
    ) {

        return;

    }


    AppState.currentOrderStep =
        number;


    $all(
        "[data-order-step]"
    ).forEach(
        element => {

            const elementStep =
                Number(
                    element.dataset.orderStep
                );


            element.classList.toggle(
                "active-order-step",
                elementStep === number
            );

        }
    );


    $all(
        "[data-progress-step]"
    ).forEach(
        element => {

            const progressStep =
                Number(
                    element.dataset.progressStep
                );


            element.classList.toggle(
                "active-progress",
                progressStep === number
            );


            element.classList.toggle(
                "completed-progress",
                progressStep < number
            );

        }
    );


    updateSelectedServiceUI();


    const orderScreen =
        getScreen("order");


    if (orderScreen) {

        orderScreen.scrollTop =
            0;

    }


    window.scrollTo(
        0,
        0
    );

}


/* =========================================================
   23. ORDER NEXT BUTTON
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


            const nextStep =
                Number(
                    button.dataset.orderNext
                );


            if (
                nextStep === 3
            ) {

                if (
                    !validateProjectDetails()
                ) {

                    return;

                }

            }


            collectOrderDetails();


            setOrderStep(
                nextStep
            );

        }
    );

}


/* =========================================================
   24. ORDER STEP BACK
   ========================================================= */

function setupOrderStepBack() {

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
   25. VALIDATE PROJECT DETAILS
   ========================================================= */

function validateProjectDetails() {

    const goal =
        $("#projectGoal");


    /*
     * Goal is optional for now.
     * We allow the user to continue
     * even if they don't select it.
     */

    if (goal) {

        AppState.orderData.projectGoal =
            goal.value;

    }


    return true;

}


/* =========================================================
   26. COLLECT ORDER DETAILS
   ========================================================= */

function collectOrderDetails() {

    const goal =
        $("#projectGoal");


    const notes =
        $("#projectNotes");


    if (goal) {

        AppState.orderData.projectGoal =
            goal.value;

    }


    if (notes) {

        AppState.orderData.projectNotes =
            notes.value.trim();

    }


    const clientName =
        $("#clientName");


    const gymName =
        $("#gymName");


    const instagram =
        $("#instagramHandle");


    /*
     * Phone is intentionally NOT required.
     * We don't collect it here.
     */

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

}


/* =========================================================
   27. SUBMIT ORDER
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


            collectOrderDetails();


            if (
                !validateContactDetails()
            ) {

                return;

            }


            submitOrder();

        }
    );

}


/* =========================================================
   28. VALIDATE CONTACT DETAILS
   ========================================================= */

function validateContactDetails() {

    const gymName =
        $("#gymName");


    const instagram =
        $("#instagramHandle");


    const gym =
        gymName
            ? gymName.value.trim()
            : "";


    const insta =
        instagram
            ? instagram.value.trim()
            : "";


    /*
     * Only Gym Name + Instagram
     * are needed.
     *
     * Phone number is NOT required.
     */

    if (!gym) {

        showToast(
            "Please enter your gym name.",
            "!"
        );


        if (gymName) {

            gymName.focus();

        }


        return false;

    }


    if (!insta) {

        showToast(
            "Please enter your Instagram.",
            "!"
        );


        if (instagram) {

            instagram.focus();

        }


        return false;

    }


    return true;

}


/* =========================================================
   29. SUBMIT ORDER
   ========================================================= */

function submitOrder() {

    showLoading(
        "Preparing your order..."
    );


    setTimeout(
        () => {

            hideLoading();


            const success =
                $("#orderSuccess");


            $all(
                ".order-step"
            ).forEach(
                step => {

                    step.classList.remove(
                        "active-order-step"
                    );

                }
            );


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
                "Order request prepared.",
                "✓"
            );

        },
        500
    );

}


/* =========================================================
   30. RESET ORDER
   ========================================================= */

function resetOrderForm() {

    AppState.selectedService =
        null;


    AppState.currentOrderStep =
        1;


    AppState.orderData =
        {};


    const formFields =
        [
            "#projectGoal",
            "#projectNotes",
            "#clientName",
            "#gymName",
            "#instagramHandle",
            "#contactNumber"
        ];


    formFields.forEach(
        selector => {

            const field =
                $(selector);


            if (!field) {

                return;

            }


            field.value =
                "";

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
   31. SUPPORT
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
                document.getElementById(
                    `support-${type}`
                );


            if (!target) {

                console.warn(
                    "Support screen not found:",
                    type
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
   32. MODAL
   ========================================================= */

function openInfoModal(
    options = {}
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


    if (icon && options.icon) {

        icon.textContent =
            options.icon;

    }


    if (
        eyebrow &&
        options.eyebrow
    ) {

        eyebrow.textContent =
            options.eyebrow;

    }


    if (
        title &&
        options.title
    ) {

        title.textContent =
            options.title;

    }


    if (
        text &&
        options.text
    ) {

        text.textContent =
            options.text;

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


/* =========================================================
   33. CLOSE MODAL
   ========================================================= */

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
   34. MODAL EVENTS
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
                event.target.matches(
                    "[data-modal-close]"
                )
            ) {

                closeInfoModal();

            }

        }
    );


    const action =
        $("#modalActionButton");


    if (action) {

        action.addEventListener(
            "click",
            closeInfoModal
        );

    }


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
   35. TOAST
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
            hideToast,
            2500
        );

}


/* =========================================================
   36. HIDE TOAST
   ========================================================= */

function hideToast() {

    const toast =
        $("#toast");


    if (!toast) {

        return;

    }


    toast.classList.remove(
        "visible"
    );


    toast.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================================
   37. LOADING
   ========================================================= */

function showLoading(
    message = "Please wait..."
) {

    const overlay =
        $("#loadingOverlay");


    if (!overlay) {

        return;

    }


    const text =
        $("#loadingText");


    if (text) {

        text.textContent =
            message;

    }


    overlay.classList.add(
        "visible"
    );


    overlay.setAttribute(
        "aria-hidden",
        "false"
    );


    AppState.isLoading =
        true;

}


/* =========================================================
   38. HIDE LOADING
   ========================================================= */

function hideLoading() {

    const overlay =
        $("#loadingOverlay");


    if (!overlay) {

        return;

    }


    overlay.classList.remove(
        "visible"
    );


    overlay.setAttribute(
        "aria-hidden",
        "true"
    );


    AppState.isLoading =
        false;

}


/* =========================================================
   39. SWIPE NAVIGATION
   ========================================================= */

function setupSwipeNavigation() {

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
                Math.abs(deltaX) <
                70
            ) {

                return;

            }


            if (
                Math.abs(deltaX) <
                Math.abs(deltaY)
            ) {

                return;

            }


            /*
             * Don't swipe while typing.
             */

            const active =
                document.activeElement;


            if (
                active &&
                (
                    active.tagName === "INPUT" ||
                    active.tagName === "TEXTAREA" ||
                    active.tagName === "SELECT"
                )
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


            const currentIndex =
                screens.indexOf(
                    AppState.currentScreen
                );


            if (
                currentIndex === -1
            ) {

                return;

            }


            if (
                deltaX < 0
            ) {

                const next =
                    currentIndex + 1;


                if (
                    next <
                    screens.length
                ) {

                    showScreen(
                        screens[next]
                    );

                }

            }

            else {

                const previous =
                    currentIndex - 1;


                if (
                    previous >= 0
                ) {

                    showScreen(
                        screens[previous]
                    );

                }

            }

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   40. BROWSER BACK
   ========================================================= */

function setupBrowserBack() {

    window.addEventListener(
        "popstate",
        () => {

            goBack();

        }
    );

}


/* =========================================================
   41. BRAND HOME
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
   42. SUCCESS HOME BUTTON
   ========================================================= */

function setupSuccessHome() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "#orderSuccess [data-screen]"
                );


            if (!button) {

                return;

            }


            resetOrderForm();


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
   43. ORDER SCREEN RESET
   ========================================================= */

function setupOrderScreenReset() {

    const orderNav =
        $(
            '.nav-item[data-screen="order"]'
        );


    if (!orderNav) {

        return;

    }


    orderNav.addEventListener(
        "click",
        () => {

            if (
                !AppState.selectedService
            ) {

                resetOrderForm();

            }

        }
    );

}


/* =========================================================
   44. CONNECTION STATUS
   ========================================================= */

function setupConnectionStatus() {

    window.addEventListener(
        "offline",
        () => {

            showToast(
                "You're offline.",
                "!"
            );

        }
    );


    window.addEventListener(
        "online",
        () => {

            showToast(
                "Connection restored.",
                "✓"
            );

        }
    );

}


/* =========================================================
   45. CURRENT YEAR
   ========================================================= */

function setCurrentYear() {

    const year =
        $("#currentYear");


    if (year) {

        year.textContent =
            new Date().getFullYear();

    }

}


/* =========================================================
   46. ACCESSIBILITY
   ========================================================= */

function setupAccessibility() {

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Enter" &&
                event.key !== " "
            ) {

                return;

            }


            const target =
                event.target;


            if (
                target.matches(
                    "button"
                )
            ) {

                return;

            }

        }
    );

}


/* =========================================================
   47. INITIAL SCREEN
   ========================================================= */

function initializeInitialScreen() {

    /*
     * ALWAYS START AT HOME.
     *
     * Home appears only once on initial load.
     * Other buttons directly switch screens.
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

    }


    AppState.currentScreen =
        "home";


    AppState.previousScreen =
        null;


    AppState.screenHistory =
        [];


    updateBottomNavigation(
        "home"
    );


    updateFloatingHome(
        "home"
    );


    document.body.dataset.screen =
        "home";

}


/* =========================================================
   48. INITIALIZE ALL SYSTEMS
   ========================================================= */

function initializeApp() {

    initializeInitialScreen();

    setupNavigation();

    setupServiceDetails();

    setupPlanDetails();

    setupBackButtons();

    setupFloatingHomeButton();

    setupOrderServiceSelection();

    setupOrderNextButtons();

    setupOrderStepBack();

    setupOrderSubmit();

    setupSupport();

    setupModal();

    setupSwipeNavigation();

    setupBrowserBack();

    setupBrandButton();

    setupSuccessHome();

    setupOrderScreenReset();

    setupConnectionStatus();

    setupAccessibility();

    setCurrentYear();


    console.log(
        "Gym Growth HQ — Clean navigation loaded."
    );

}


/* =========================================================
   49. DOM READY
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
   50. GLOBAL ACCESS
   ========================================================= */

window.GymGrowthHQ = {

    showScreen,

    goBack,

    selectService,

    setOrderStep,

    openInfoModal,

    closeInfoModal,

    showToast,

    showLoading,

    hideLoading,

    resetOrderForm,

    getState() {

        return {
            ...AppState
        };

    }

};


/* =========================================================
   END OF CLEAN SCRIPT.JS
   ========================================================= */
