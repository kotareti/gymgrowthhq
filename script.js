/* =========================================================
   GYM GROWTH HQ
   SCRIPT.JS — PART 1/5

   APP CORE
   SCREEN NAVIGATION
   BACK BUTTON
   MOBILE APP BEHAVIOUR
   ========================================================= */


/* =========================================================
   1. APP STATE
   ========================================================= */

const AppState = {

    currentScreen: "home",

    previousScreen: null,

    screenHistory: [],

    selectedService: null,

    selectedPlan: null,

    modalOpen: false,

    isLoading: false

};


/* =========================================================
   2. DOM HELPERS
   ========================================================= */

function getElement(selector) {

    return document.querySelector(selector);

}


function getAllElements(selector) {

    return document.querySelectorAll(selector);

}


/* =========================================================
   3. SCREEN FINDER
   ========================================================= */

function getScreen(screenName) {

    return document.querySelector(
        `[data-screen="${screenName}"]`
    );

}


/* =========================================================
   4. HIDE ALL SCREENS
   ========================================================= */

function hideAllScreens() {

    const screens =
        getAllElements(
            ".app-screen"
        );

    screens.forEach(
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
    screenName,
    addToHistory = true
) {

    const targetScreen =
        getScreen(screenName);

    if (!targetScreen) {

        console.warn(
            `Screen "${screenName}" not found.`
        );

        return;

    }


    if (
        AppState.currentScreen === screenName
        &&
        targetScreen.classList.contains(
            "active-screen"
        )
    ) {

        return;

    }


    if (
        addToHistory
        &&
        AppState.currentScreen
        &&
        AppState.currentScreen !== screenName
    ) {

        AppState.screenHistory.push(
            AppState.currentScreen
        );

    }


    AppState.previousScreen =
        AppState.currentScreen;

    AppState.currentScreen =
        screenName;


    hideAllScreens();


    targetScreen.classList.add(
        "active-screen"
    );

    targetScreen.setAttribute(
        "aria-hidden",
        "false"
    );


    updateNavigation(
        screenName
    );


    updateFloatingHomeButton(
        screenName
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    document.body.dataset.screen =
        screenName;

}


/* =========================================================
   6. GO BACK
   ========================================================= */

function goBack() {

    if (
        AppState.screenHistory.length
        === 0
    ) {

        showScreen(
            "home",
            false
        );

        return;

    }


    const previous =
        AppState.screenHistory.pop();


    showScreen(
        previous,
        false
    );

}


/* =========================================================
   7. CLEAR HISTORY
   ========================================================= */

function clearScreenHistory() {

    AppState.screenHistory = [];

}


/* =========================================================
   8. NAVIGATION UPDATE
   ========================================================= */

function updateNavigation(
    screenName
) {

    const navItems =
        getAllElements(
            ".nav-item"
        );


    navItems.forEach(
        item => {

            const target =
                item.dataset.screen;

            const isActive =
                target === screenName;

            item.classList.toggle(
                "active-nav",
                isActive
            );

            item.setAttribute(
                "aria-current",
                isActive
                    ? "page"
                    : "false"
            );

        }
    );

}


/* =========================================================
   9. FLOATING HOME BUTTON
   ========================================================= */

function updateFloatingHomeButton(
    screenName
) {

    const button =
        getElement(
            "#floatingHomeButton"
        );


    if (!button) {

        return;

    }


    if (
        screenName === "home"
    ) {

        button.classList.remove(
            "visible"
        );

        return;

    }


    button.classList.add(
        "visible"
    );

}


/* =========================================================
   10. NAV ITEM EVENTS
   ========================================================= */

function setupNavigation() {

    const navItems =
        getAllElements(
            ".nav-item"
        );


    navItems.forEach(
        item => {

            item.addEventListener(
                "click",
                () => {

                    const screenName =
                        item.dataset.screen;


                    if (!screenName) {

                        return;

                    }


                    if (
                        screenName ===
                        AppState.currentScreen
                    ) {

                        return;

                    }


                    showScreen(
                        screenName
                    );

                }
            );

        }
    );

}


/* =========================================================
   11. GENERIC SCREEN BUTTONS
   ========================================================= */

function setupScreenButtons() {

    const buttons =
        getAllElements(
            "[data-go-screen]"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const targetScreen =
                        button.dataset.goScreen;


                    if (!targetScreen) {

                        return;

                    }


                    showScreen(
                        targetScreen
                    );

                }
            );

        }
    );

}


/* =========================================================
   12. BACK BUTTONS
   ========================================================= */

function setupBackButtons() {

    const buttons =
        getAllElements(
            "[data-go-back]"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                goBack
            );

        }
    );

}


/* =========================================================
   13. FLOATING HOME BUTTON EVENT
   ========================================================= */

function setupFloatingHomeButton() {

    const button =
        getElement(
            "#floatingHomeButton"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        () => {

            clearScreenHistory();

            showScreen(
                "home",
                false
            );

        }
    );

}


/* =========================================================
   14. BROWSER BACK BUTTON
   ========================================================= */

function setupBrowserBackButton() {

    window.addEventListener(
        "popstate",
        () => {

            goBack();

        }
    );

}


/* =========================================================
   15. SCREEN HISTORY STATE
   ========================================================= */

function pushBrowserState(
    screenName
) {

    try {

        window.history.pushState(
            {
                screen:
                    screenName
            },
            "",
            `#${screenName}`
        );

    }

    catch (error) {

        console.warn(
            "Browser history unavailable.",
            error
        );

    }

}


/* =========================================================
   16. HANDLE HASH
   ========================================================= */

function loadHashScreen() {

    const hash =
        window.location.hash
            .replace(
                "#",
                ""
            )
            .trim();


    if (!hash) {

        showScreen(
            "home",
            false
        );

        return;

    }


    const targetScreen =
        getScreen(hash);


    if (targetScreen) {

        showScreen(
            hash,
            false
        );

    }

    else {

        showScreen(
            "home",
            false
        );

    }

}


/* =========================================================
   17. BODY LOCK
   ========================================================= */

function lockBodyScroll() {

    document.body.classList.add(
        "modal-active"
    );

}


function unlockBodyScroll() {

    document.body.classList.remove(
        "modal-active"
    );

}


/* =========================================================
   18. DEVICE CHECK
   ========================================================= */

function isMobileDevice() {

    return window.matchMedia(
        "(max-width: 699px)"
    ).matches;

}


/* =========================================================
   19. SAFE CLICK
   ========================================================= */

function safeClick(
    element,
    callback
) {

    if (!element) {

        return;

    }


    element.addEventListener(
        "click",
        event => {

            event.preventDefault();

            callback(event);

        }
    );

}


/* =========================================================
   20. INITIALIZE APP
   ========================================================= */

function initializeApp() {

    setupNavigation();

    setupScreenButtons();

    setupBackButtons();

    setupFloatingHomeButton();

    setupBrowserBackButton();

    loadHashScreen();

    console.log(
        "Gym Growth HQ App initialized."
    );

}


/* =========================================================
   21. DOM READY
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeApp
    );

}

else {

    initializeApp();

}


/* =========================================================
   END OF SCRIPT.JS — PART 1/5
   ========================================================= */
/* =========================================================
   GYM GROWTH HQ
   SCRIPT.JS — PART 2/5

   SERVICES
   PRICING
   SERVICE DETAILS
   PLAN DETAILS
   ========================================================= */


/* =========================================================
   22. SERVICE DATA
   ========================================================= */

const serviceData = {

    reelEditing: {

        title:
            "Reel Editing",

        icon:
            "🎬",

        short:
            "Professional short-form video editing.",

        description:
            "We turn your gym footage into clean, engaging and high-converting reels designed for Instagram.",

        includes: [
            "Instagram Reels",
            "Short-form videos",
            "Promotional reels",
            "Clean cuts and pacing",
            "Music and basic sound design",
            "Text and captions"
        ],

        delivery:
            "Delivery time is confirmed after we receive your footage and requirements.",

        revisions:
            "Revision support is available based on the selected service."

    },


    transformation: {

        title:
            "Transformation Reels",

        icon:
            "🔥",

        short:
            "Before & after transformation content.",

        description:
            "Show your members' progress with powerful before-and-after transformation reels that communicate the result clearly.",

        includes: [
            "Before & after edits",
            "Weight-loss transformations",
            "Muscle-gain transformations",
            "Progress-focused storytelling",
            "Music synchronization",
            "Text highlights"
        ],

        delivery:
            "Delivery time is confirmed after we receive the footage and transformation details.",

        revisions:
            "Revision support is available based on the selected service."

    },


    gymPromotion: {

        title:
            "Gym Promotion",

        icon:
            "📈",

        short:
            "Promotional reels for gym offers.",

        description:
            "Create promotional content that clearly presents your gym, offer, atmosphere and call-to-action.",

        includes: [
            "Offer promotion",
            "Gym introduction",
            "Membership campaigns",
            "Promotional text",
            "Call-to-action",
            "Instagram-ready format"
        ],

        delivery:
            "Delivery time is confirmed according to the project requirements.",

        revisions:
            "Revision support is available based on the selected service."

    }

};


/* =========================================================
   23. PRICING DATA
   ========================================================= */

const pricingData = {

    reelBasic: {

        title:
            "Reel Editing",

        price:
            "₹199",

        unit:
            "1 Reel",

        description:
            "A clean and professional edit for one short-form reel.",

        includes: [
            "1 Instagram Reel",
            "Clean cuts",
            "Music synchronization",
            "Basic text",
            "Vertical 9:16 format"
        ],

        delivery:
            "Delivery time will be confirmed before the order starts.",

        revisions:
            "Revision details will be confirmed with the order."

    },


    transformationBasic: {

        title:
            "Transformation Reel",

        price:
            "₹299",

        unit:
            "1 Reel",

        description:
            "A transformation-focused reel designed to highlight progress and results.",

        includes: [
            "1 Transformation Reel",
            "Before & after structure",
            "Music synchronization",
            "Text highlights",
            "Vertical 9:16 format"
        ],

        delivery:
            "Delivery time will be confirmed before the order starts.",

        revisions:
            "Revision details will be confirmed with the order."

    }

};


/* =========================================================
   24. CREATE SERVICE DETAILS
   ========================================================= */

function createServiceDetails(
    service
) {

    if (!service) {

        return;

    }


    const title =
        getElement(
            "#serviceDetailTitle"
        );

    const icon =
        getElement(
            "#serviceDetailIcon"
        );

    const short =
        getElement(
            "#serviceDetailShort"
        );

    const description =
        getElement(
            "#serviceDetailDescription"
        );

    const includes =
        getElement(
            "#serviceDetailIncludes"
        );

    const delivery =
        getElement(
            "#serviceDetailDelivery"
        );

    const revisions =
        getElement(
            "#serviceDetailRevisions"
        );


    if (title) {

        title.textContent =
            service.title;

    }


    if (icon) {

        icon.textContent =
            service.icon;

    }


    if (short) {

        short.textContent =
            service.short;

    }


    if (description) {

        description.textContent =
            service.description;

    }


    if (includes) {

        includes.innerHTML = "";


        service.includes.forEach(
            item => {

                const li =
                    document.createElement(
                        "li"
                    );

                li.textContent =
                    item;

                includes.appendChild(
                    li
                );

            }
        );

    }


    if (delivery) {

        delivery.textContent =
            service.delivery;

    }


    if (revisions) {

        revisions.textContent =
            service.revisions;

    }

}


/* =========================================================
   25. CREATE PRICING DETAILS
   ========================================================= */

function createPricingDetails(
    plan
) {

    if (!plan) {

        return;

    }


    const title =
        getElement(
            "#pricingDetailTitle"
        );

    const price =
        getElement(
            "#pricingDetailPrice"
        );

    const unit =
        getElement(
            "#pricingDetailUnit"
        );

    const description =
        getElement(
            "#pricingDetailDescription"
        );

    const includes =
        getElement(
            "#pricingDetailIncludes"
        );

    const delivery =
        getElement(
            "#pricingDetailDelivery"
        );

    const revisions =
        getElement(
            "#pricingDetailRevisions"
        );


    if (title) {

        title.textContent =
            plan.title;

    }


    if (price) {

        price.textContent =
            plan.price;

    }


    if (unit) {

        unit.textContent =
            plan.unit;

    }


    if (description) {

        description.textContent =
            plan.description;

    }


    if (includes) {

        includes.innerHTML = "";


        plan.includes.forEach(
            item => {

                const li =
                    document.createElement(
                        "li"
                    );

                li.textContent =
                    item;

                includes.appendChild(
                    li
                );

            }
        );

    }


    if (delivery) {

        delivery.textContent =
            plan.delivery;

    }


    if (revisions) {

        revisions.textContent =
            plan.revisions;

    }

}


/* =========================================================
   26. SERVICE BUTTONS
   ========================================================= */

function setupServiceButtons() {

    const buttons =
        getAllElements(
            "[data-service]"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const serviceKey =
                        button.dataset.service;


                    const service =
                        serviceData[
                            serviceKey
                        ];


                    if (!service) {

                        console.warn(
                            "Service not found:",
                            serviceKey
                        );

                        return;

                    }


                    AppState.selectedService =
                        serviceKey;


                    createServiceDetails(
                        service
                    );


                    showScreen(
                        "service-detail"
                    );

                }
            );

        }
    );

}


/* =========================================================
   27. PRICING BUTTONS
   ========================================================= */

function setupPricingButtons() {

    const buttons =
        getAllElements(
            "[data-plan]"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const planKey =
                        button.dataset.plan;


                    const plan =
                        pricingData[
                            planKey
                        ];


                    if (!plan) {

                        console.warn(
                            "Plan not found:",
                            planKey
                        );

                        return;

                    }


                    AppState.selectedPlan =
                        planKey;


                    createPricingDetails(
                        plan
                    );


                    showScreen(
                        "pricing-detail"
                    );

                }
            );

        }
    );

}


/* =========================================================
   28. ORDER FROM SERVICE
   ========================================================= */

function setupServiceOrderButtons() {

    const buttons =
        getAllElements(
            "[data-order-service]"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const serviceKey =
                        button.dataset.orderService;


                    if (
                        serviceData[
                            serviceKey
                        ]
                    ) {

                        AppState.selectedService =
                            serviceKey;

                    }


                    prepareOrderForm();

                    showScreen(
                        "order"
                    );

                }
            );

        }
    );

}


/* =========================================================
   29. ORDER FROM PLAN
   ========================================================= */

function setupPlanOrderButtons() {

    const buttons =
        getAllElements(
            "[data-order-plan]"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const planKey =
                        button.dataset.orderPlan;


                    if (
                        pricingData[
                            planKey
                        ]
                    ) {

                        AppState.selectedPlan =
                            planKey;

                    }


                    prepareOrderForm();

                    showScreen(
                        "order"
                    );

                }
            );

        }
    );

}


/* =========================================================
   30. PREPARE ORDER FORM
   ========================================================= */

function prepareOrderForm() {

    const serviceSelect =
        getElement(
            "#serviceSelect"
        );


    if (!serviceSelect) {

        return;

    }


    if (
        AppState.selectedService
        &&
        serviceData[
            AppState.selectedService
        ]
    ) {

        const service =
            serviceData[
                AppState.selectedService
            ];


        const matchingOption =
            Array.from(
                serviceSelect.options
            ).find(
                option =>
                    option.value ===
                    AppState.selectedService
            );


        if (matchingOption) {

            serviceSelect.value =
                matchingOption.value;

        }

        else {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                AppState.selectedService;

            option.textContent =
                service.title;

            serviceSelect.appendChild(
                option
            );

            serviceSelect.value =
                AppState.selectedService;

        }

    }


    if (
        AppState.selectedPlan
        &&
        pricingData[
            AppState.selectedPlan
        ]
    ) {

        const plan =
            pricingData[
                AppState.selectedPlan
            ];


        const planPrice =
            getElement(
                "#orderPlanPrice"
            );


        if (planPrice) {

            planPrice.textContent =
                plan.price;

        }

    }

}


/* =========================================================
   31. SETUP SERVICE + PRICING SYSTEM
   ========================================================= */

function initializeCommerce() {

    setupServiceButtons();

    setupPricingButtons();

    setupServiceOrderButtons();

    setupPlanOrderButtons();

}


/* =========================================================
   32. INITIALIZE AFTER APP CORE
   ========================================================= */

const previousInitializeApp =
    initializeApp;


initializeApp = function() {

    previousInitializeApp();

    initializeCommerce();

};


/* =========================================================
   END OF SCRIPT.JS — PART 2/5
   ========================================================= */
/* =========================================================
   GYM GROWTH HQ
   SCRIPT.JS — PART 3/5

   ORDER FORM
   SERVICE SELECTION
   CLIENT DETAILS
   VALIDATION
   ORDER SUMMARY
   ========================================================= */


/* =========================================================
   33. ORDER FORM ELEMENTS
   ========================================================= */

function getOrderForm() {

    return getElement(
        "#orderForm"
    );

}


function getOrderInput(
    id
) {

    return getElement(
        `#${id}`
    );

}


/* =========================================================
   34. UPDATE ORDER SUMMARY
   ========================================================= */

function updateOrderSummary() {

    const serviceSelect =
        getElement(
            "#serviceSelect"
        );

    const summary =
        getElement(
            "#orderSummary"
        );

    const summaryName =
        getElement(
            "#orderSummaryName"
        );

    const summaryPrice =
        getElement(
            "#orderSummaryPrice"
        );


    if (
        !serviceSelect ||
        !summary
    ) {

        return;

    }


    const selectedValue =
        serviceSelect.value;


    if (!selectedValue) {

        summary.classList.remove(
            "visible"
        );

        return;

    }


    let title =
        "";

    let price =
        "";


    if (
        serviceData[
            selectedValue
        ]
    ) {

        title =
            serviceData[
                selectedValue
            ].title;

    }


    if (
        pricingData[
            selectedValue
        ]
    ) {

        title =
            pricingData[
                selectedValue
            ].title;

        price =
            pricingData[
                selectedValue
            ].price;

    }


    if (summaryName) {

        summaryName.textContent =
            title;

    }


    if (summaryPrice) {

        summaryPrice.textContent =
            price ||
            "Price confirmed";

    }


    summary.classList.add(
        "visible"
    );

}


/* =========================================================
   35. SERVICE SELECT CHANGE
   ========================================================= */

function setupServiceSelect() {

    const select =
        getElement(
            "#serviceSelect"
        );


    if (!select) {

        return;

    }


    select.addEventListener(
        "change",
        () => {

            const value =
                select.value;


            AppState.selectedService =
                value ||
                null;


            updateOrderSummary();

        }
    );

}


/* =========================================================
   36. FORM FIELD ERROR
   ========================================================= */

function showFieldError(
    input,
    message
) {

    if (!input) {

        return;

    }


    const group =
        input.closest(
            ".form-group"
        );


    if (!group) {

        return;

    }


    group.classList.add(
        "has-error"
    );


    const error =
        group.querySelector(
            ".form-error"
        );


    if (error) {

        error.textContent =
            message;

    }

}


/* =========================================================
   37. CLEAR FIELD ERROR
   ========================================================= */

function clearFieldError(
    input
) {

    if (!input) {

        return;

    }


    const group =
        input.closest(
            ".form-group"
        );


    if (!group) {

        return;

    }


    group.classList.remove(
        "has-error"
    );


    const error =
        group.querySelector(
            ".form-error"
        );


    if (error) {

        error.textContent =
            "";

    }

}


/* =========================================================
   38. CLEAR ALL FORM ERRORS
   ========================================================= */

function clearFormErrors(
    form
) {

    if (!form) {

        return;

    }


    const groups =
        form.querySelectorAll(
            ".form-group"
        );


    groups.forEach(
        group => {

            group.classList.remove(
                "has-error"
            );

        }
    );

}


/* =========================================================
   39. REQUIRED FIELD CHECK
   ========================================================= */

function validateRequiredField(
    input,
    message
) {

    if (!input) {

        return true;

    }


    const value =
        input.value.trim();


    if (!value) {

        showFieldError(
            input,
            message
        );

        return false;

    }


    clearFieldError(
        input
    );


    return true;

}


/* =========================================================
   40. INSTAGRAM USERNAME CHECK
   ========================================================= */

function validateInstagram(
    input
) {

    if (!input) {

        return true;

    }


    const value =
        input.value.trim();


    if (!value) {

        showFieldError(
            input,
            "Please enter your Instagram username."
        );

        return false;

    }


    clearFieldError(
        input
    );


    return true;

}


/* =========================================================
   41. SERVICE VALIDATION
   ========================================================= */

function validateService(
    select
) {

    if (!select) {

        return true;

    }


    if (!select.value) {

        showFieldError(
            select,
            "Please select a service."
        );

        return false;

    }


    clearFieldError(
        select
    );


    return true;

}


/* =========================================================
   42. COLLECT CLIENT DATA
   ========================================================= */

function collectOrderData() {

    const name =
        getOrderInput(
            "clientName"
        );


    const gymName =
        getOrderInput(
            "gymName"
        );


    const instagram =
        getOrderInput(
            "instagramUsername"
        );


    const service =
        getOrderInput(
            "serviceSelect"
        );


    const message =
        getOrderInput(
            "orderMessage"
        );


    return {

        clientName:
            name
                ? name.value.trim()
                : "",

        gymName:
            gymName
                ? gymName.value.trim()
                : "",

        instagramUsername:
            instagram
                ? instagram.value.trim()
                : "",

        service:
            service
                ? service.value
                : "",

        message:
            message
                ? message.value.trim()
                : "",

        selectedPlan:
            AppState.selectedPlan,

        selectedService:
            AppState.selectedService

    };

}


/* =========================================================
   43. VALIDATE ORDER
   ========================================================= */

function validateOrder(
    data
) {

    const form =
        getOrderForm();


    if (!form) {

        return false;

    }


    clearFormErrors(
        form
    );


    let valid =
        true;


    const name =
        getOrderInput(
            "clientName"
        );


    const gymName =
        getOrderInput(
            "gymName"
        );


    const instagram =
        getOrderInput(
            "instagramUsername"
        );


    const service =
        getOrderInput(
            "serviceSelect"
        );


    const nameValid =
        validateRequiredField(
            name,
            "Please enter your name."
        );


    const gymValid =
        validateRequiredField(
            gymName,
            "Please enter your gym name."
        );


    const instagramValid =
        validateInstagram(
            instagram
        );


    const serviceValid =
        validateService(
            service
        );


    if (!nameValid) {

        valid =
            false;

    }


    if (!gymValid) {

        valid =
            false;

    }


    if (!instagramValid) {

        valid =
            false;

    }


    if (!serviceValid) {

        valid =
            false;

    }


    return valid;

}


/* =========================================================
   44. SHOW FORM SUCCESS
   ========================================================= */

function showFormSuccess(
    data
) {

    const form =
        getOrderForm();


    const success =
        getElement(
            "#formSuccess"
        );


    const successName =
        getElement(
            "#successClientName"
        );


    if (form) {

        form.style.display =
            "none";

    }


    if (successName) {

        successName.textContent =
            data.clientName;

    }


    if (success) {

        success.classList.add(
            "visible"
        );

    }

}


/* =========================================================
   45. RESET FORM
   ========================================================= */

function resetOrderForm() {

    const form =
        getOrderForm();


    if (!form) {

        return;

    }


    form.reset();


    clearFormErrors(
        form
    );


    const summary =
        getElement(
            "#orderSummary"
        );


    if (summary) {

        summary.classList.remove(
            "visible"
        );

    }


    const success =
        getElement(
            "#formSuccess"
        );


    if (success) {

        success.classList.remove(
            "visible"
        );

    }


    form.style.display =
        "";


    AppState.selectedService =
        null;

    AppState.selectedPlan =
        null;

}


/* =========================================================
   46. ORDER SUBMIT
   ========================================================= */

function handleOrderSubmit(
    event
) {

    event.preventDefault();


    const data =
        collectOrderData();


    const valid =
        validateOrder(
            data
        );


    if (!valid) {

        showToast(
            "Please complete the required details."
        );

        return;

    }


    AppState.isLoading =
        true;


    showLoading(
        "Preparing your order..."
    );


    setTimeout(
        () => {

            AppState.isLoading =
                false;


            hideLoading();


            showFormSuccess(
                data
            );


            showToast(
                "Order details received."
            );

        },
        700
    );

}


/* =========================================================
   47. ORDER FORM SETUP
   ========================================================= */

function setupOrderForm() {

    const form =
        getOrderForm();


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        handleOrderSubmit
    );


    setupServiceSelect();


    const inputs =
        form.querySelectorAll(
            "input, select, textarea"
        );


    inputs.forEach(
        input => {

            input.addEventListener(
                "input",
                () => {

                    clearFieldError(
                        input
                    );

                }
            );


            input.addEventListener(
                "change",
                () => {

                    clearFieldError(
                        input
                    );

                }
            );

        }
    );

}


/* =========================================================
   48. ORDER BUTTONS
   ========================================================= */

function setupOrderNavigation() {

    const orderButtons =
        getAllElements(
            "[data-open-order]"
        );


    orderButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const service =
                        button.dataset
                            .openOrder;


                    if (
                        service &&
                        serviceData[
                            service
                        ]
                    ) {

                        AppState.selectedService =
                            service;

                    }


                    prepareOrderForm();

                    showScreen(
                        "order"
                    );

                }
            );

        }
    );

}


/* =========================================================
   49. ORDER BACK / CANCEL
   ========================================================= */

function setupOrderCancel() {

    const buttons =
        getAllElements(
            "[data-cancel-order]"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    resetOrderForm();

                    goBack();

                }
            );

        }
    );

}


/* =========================================================
   50. FORM SUCCESS CLOSE
   ========================================================= */

function setupSuccessClose() {

    const buttons =
        getAllElements(
            "[data-success-close]"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    resetOrderForm();

                    showScreen(
                        "home"
                    );

                }
            );

        }
    );

}


/* =========================================================
   51. ORDER SYSTEM INITIALIZER
   ========================================================= */

function initializeOrderSystem() {

    setupOrderForm();

    setupOrderNavigation();

    setupOrderCancel();

    setupSuccessClose();

}


/* =========================================================
   52. EXTEND APP INITIALIZATION
   ========================================================= */

const commerceInitialize =
    initializeApp;


initializeApp = function() {

    commerceInitialize();

    initializeOrderSystem();

};


/* =========================================================
   END OF SCRIPT.JS — PART 3/5
   ========================================================= */
/* =========================================================
   GYM GROWTH HQ
   SCRIPT.JS — PART 4/5

   MODAL
   TOAST
   LOADING
   SUPPORT
   MICRO INTERACTIONS
   ========================================================= */


/* =========================================================
   53. MODAL ELEMENTS
   ========================================================= */

function getInfoModal() {

    return getElement(
        "#infoModal"
    );

}


/* =========================================================
   54. OPEN MODAL
   ========================================================= */

function openInfoModal({
    title = "Information",
    text = "",
    icon = "✦",
    eyebrow = "INFORMATION",
    actionText = "Continue",
    action = null
} = {}) {

    const modal =
        getInfoModal();


    if (!modal) {

        return;

    }


    const modalIcon =
        getElement(
            "#modalIcon"
        );


    const modalEyebrow =
        getElement(
            "#modalEyebrow"
        );


    const modalTitle =
        getElement(
            "#modalTitle"
        );


    const modalText =
        getElement(
            "#modalText"
        );


    const modalAction =
        getElement(
            "#modalActionButton"
        );


    if (modalIcon) {

        modalIcon.textContent =
            icon;

    }


    if (modalEyebrow) {

        modalEyebrow.textContent =
            eyebrow;

    }


    if (modalTitle) {

        modalTitle.textContent =
            title;

    }


    if (modalText) {

        modalText.textContent =
            text;

    }


    if (modalAction) {

        modalAction.textContent =
            actionText;

        modalAction.innerHTML =
            `
                ${actionText}
                <span class="button-arrow">
                    →
                </span>
            `;


        modalAction.onclick =
            () => {

                if (
                    typeof action ===
                    "function"
                ) {

                    action();

                }

                else {

                    closeInfoModal();

                }

            };

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


    lockBodyScroll();

}


/* =========================================================
   55. CLOSE MODAL
   ========================================================= */

function closeInfoModal() {

    const modal =
        getInfoModal();


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


    unlockBodyScroll();

}


/* =========================================================
   56. MODAL EVENTS
   ========================================================= */

function setupModal() {

    const modal =
        getInfoModal();


    if (!modal) {

        return;

    }


    const closeButton =
        getElement(
            "#modalClose"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeInfoModal
        );

    }


    const backdrop =
        modal.querySelector(
            "[data-modal-close]"
        );


    if (backdrop) {

        backdrop.addEventListener(
            "click",
            closeInfoModal
        );

    }

}


/* =========================================================
   57. ESCAPE KEY
   ========================================================= */

function setupEscapeKey() {

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                if (
                    AppState.modalOpen
                ) {

                    closeInfoModal();

                }

            }

        }
    );

}


/* =========================================================
   58. TOAST
   ========================================================= */

let toastTimer = null;


function showToast(
    message,
    icon = "✓"
) {

    const toast =
        getElement(
            "#toast"
        );


    const toastMessage =
        getElement(
            "#toastMessage"
        );


    const toastIcon =
        getElement(
            "#toastIcon"
        );


    if (!toast) {

        return;

    }


    if (toastMessage) {

        toastMessage.textContent =
            message;

    }


    if (toastIcon) {

        toastIcon.textContent =
            icon;

    }


    toast.classList.add(
        "visible"
    );


    toast.setAttribute(
        "aria-hidden",
        "false"
    );


    if (toastTimer) {

        clearTimeout(
            toastTimer
        );

    }


    toastTimer =
        setTimeout(
            () => {

                hideToast();

            },
            2800
        );

}


/* =========================================================
   59. HIDE TOAST
   ========================================================= */

function hideToast() {

    const toast =
        getElement(
            "#toast"
        );


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
   60. LOADING
   ========================================================= */

function showLoading(
    message = "Please wait..."
) {

    const overlay =
        getElement(
            "#loadingOverlay"
        );


    const text =
        getElement(
            "#loadingText"
        );


    if (!overlay) {

        return;

    }


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


    lockBodyScroll();

}


/* =========================================================
   61. HIDE LOADING
   ========================================================= */

function hideLoading() {

    const overlay =
        getElement(
            "#loadingOverlay"
        );


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


    if (!AppState.modalOpen) {

        unlockBodyScroll();

    }

}


/* =========================================================
   62. SUPPORT DATA
   ========================================================= */

const supportData = {

    contact: {

        title:
            "Contact Us",

        eyebrow:
            "CONTACT",

        icon:
            "💬",

        text:
            "Have a question about a service, price or order? You can contact us directly and we'll help you with the next step."

    },


    delivery: {

        title:
            "Delivery Information",

        eyebrow:
            "DELIVERY",

        icon:
            "⏱",

        text:
            "Delivery time depends on the service, footage and requirements. The expected timeline will be confirmed before the project starts."

    },


    revisions: {

        title:
            "Revisions",

        eyebrow:
            "REVISIONS",

        icon:
            "↻",

        text:
            "If something needs to be adjusted, send clear feedback about the changes you need. We'll review the request and guide you through the revision process."

    },


    requirements: {

        title:
            "What We Need From You",

        eyebrow:
            "REQUIREMENTS",

        icon:
            "📋",

        text:
            "Usually we need your footage, the purpose of the reel and any important instructions or references you want us to follow."

    }

};


/* =========================================================
   63. SUPPORT CARDS
   ========================================================= */

function setupSupportCards() {

    const cards =
        getAllElements(
            "[data-support]"
        );


    cards.forEach(
        card => {

            card.addEventListener(
                "click",
                () => {

                    const key =
                        card.dataset.support;


                    const data =
                        supportData[
                            key
                        ];


                    if (!data) {

                        return;

                    }


                    openInfoModal({

                        title:
                            data.title,

                        text:
                            data.text,

                        icon:
                            data.icon,

                        eyebrow:
                            data.eyebrow,

                        actionText:
                            "Got it"

                    });

                }
            );

        }
    );

}


/* =========================================================
   64. CONTACT BUTTONS
   ========================================================= */

function setupContactButtons() {

    const whatsapp =
        getElement(
            "#whatsappContact"
        );


    const instagram =
        getElement(
            "#instagramContact"
        );


    if (whatsapp) {

        whatsapp.addEventListener(
            "click",
            event => {

                if (
                    whatsapp.getAttribute(
                        "href"
                    ) === "#"
                ) {

                    event.preventDefault();


                    openInfoModal({

                        title:
                            "WhatsApp",

                        text:
                            "WhatsApp contact will be connected here. Add the final business WhatsApp number before launch.",

                        icon:
                            "💬",

                        eyebrow:
                            "CONTACT",

                        actionText:
                            "Close"

                    });

                }

            }
        );

    }


    if (instagram) {

        instagram.addEventListener(
            "click",
            event => {

                if (
                    instagram.getAttribute(
                        "href"
                    ) === "#"
                ) {

                    event.preventDefault();


                    openInfoModal({

                        title:
                            "Instagram",

                        text:
                            "Your official Instagram profile link will be connected here before launch.",

                        icon:
                            "◎",

                        eyebrow:
                            "SOCIAL",

                        actionText:
                            "Close"

                    });

                }

            }
        );

    }

}


/* =========================================================
   65. DELIVERY INFORMATION
   ========================================================= */

function setupDeliveryInformation() {

    const deliveryBlocks =
        getAllElements(
            "[data-delivery-info]"
        );


    deliveryBlocks.forEach(
        block => {

            block.addEventListener(
                "click",
                () => {

                    openInfoModal({

                        title:
                            "Delivery",

                        text:
                            "Your exact delivery timeline is confirmed according to the selected service and the material received.",

                        icon:
                            "⏱",

                        eyebrow:
                            "DELIVERY",

                        actionText:
                            "Understood"

                    });

                }
            );

        }
    );

}


/* =========================================================
   66. SWIPE HINT
   ========================================================= */

function showSwipeHint() {

    const hint =
        getElement(
            "#swipeHint"
        );


    if (!hint) {

        return;

    }


    if (
        !isMobileDevice()
    ) {

        return;

    }


    hint.classList.remove(
        "visible"
    );


    void hint.offsetWidth;


    hint.classList.add(
        "visible"
    );

}


/* =========================================================
   67. FIRST VISIT HINT
   ========================================================= */

function setupFirstVisitHint() {

    let hasSeenHint =
        false;


    try {

        hasSeenHint =
            localStorage.getItem(
                "gghq_swipe_hint"
            ) ===
            "true";

    }

    catch (error) {

        hasSeenHint =
            false;

    }


    if (hasSeenHint) {

        return;

    }


    setTimeout(
        () => {

            showSwipeHint();


            try {

                localStorage.setItem(
                    "gghq_swipe_hint",
                    "true"
                );

            }

            catch (error) {

                /* Ignore storage errors */

            }

        },
        1400
    );

}


/* =========================================================
   68. SCREEN CHANGE FEEDBACK
   ========================================================= */

function showScreenFeedback(
    screenName
) {

    const messages = {

        home:
            "Home",

        services:
            "Services",

        pricing:
            "Pricing",

        order:
            "Start your order",

        support:
            "Support",

        about:
            "About"

    };


    if (
        messages[
            screenName
        ]
    ) {

        showToast(
            messages[
                screenName
            ]
        );

    }

}


/* =========================================================
   69. FINAL SUPPORT INITIALIZER
   ========================================================= */

function initializeSupportSystem() {

    setupModal();

    setupEscapeKey();

    setupSupportCards();

    setupContactButtons();

    setupDeliveryInformation();

    setupFirstVisitHint();

}


/* =========================================================
   70. EXTEND INITIALIZATION
   ========================================================= */

const orderInitialize =
    initializeApp;


initializeApp = function() {

    orderInitialize();

    initializeSupportSystem();

};


/* =========================================================
   END OF SCRIPT.JS — PART 4/5
   ========================================================= */
/* =========================================================
   GYM GROWTH HQ
   SCRIPT.JS — PART 5/5

   FINAL APP POLISH
   SWIPE NAVIGATION
   PAGE TRANSITIONS
   YEAR
   ACCESSIBILITY
   FINAL INITIALIZATION
   ========================================================= */


/* =========================================================
   71. CURRENT YEAR
   ========================================================= */

function setCurrentYear() {

    const yearElement =
        getElement(
            "#currentYear"
        );


    if (!yearElement) {

        return;

    }


    yearElement.textContent =
        new Date().getFullYear();

}


/* =========================================================
   72. SWIPE NAVIGATION
   ========================================================= */

function setupSwipeNavigation() {

    let startX = 0;

    let startY = 0;

    let endX = 0;

    let endY = 0;


    const minimumSwipe =
        65;


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


            endX =
                event.changedTouches[0].clientX;

            endY =
                event.changedTouches[0].clientY;


            const deltaX =
                endX - startX;


            const deltaY =
                endY - startY;


            /*
             * Ignore normal vertical scrolling.
             */

            if (
                Math.abs(deltaX) <
                Math.abs(deltaY)
            ) {

                return;

            }


            if (
                Math.abs(deltaX) <
                minimumSwipe
            ) {

                return;

            }


            handleSwipe(
                deltaX
            );

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   73. HANDLE SWIPE
   ========================================================= */

function handleSwipe(
    distance
) {

    if (
        !isMobileDevice()
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


    /*
     * Swipe LEFT
     * → Next screen
     */

    if (
        distance < 0
    ) {

        const nextIndex =
            currentIndex + 1;


        if (
            nextIndex <
            screens.length
        ) {

            showScreen(
                screens[nextIndex]
            );

        }

        else {

            showToast(
                "You're at the last section."
            );

        }

    }


    /*
     * Swipe RIGHT
     * → Previous screen
     */

    else {

        const previousIndex =
            currentIndex - 1;


        if (
            previousIndex >= 0
        ) {

            showScreen(
                screens[previousIndex]
            );

        }

        else {

            showToast(
                "You're already at Home."
            );

        }

    }

}


/* =========================================================
   74. SCREEN TRANSITION POLISH
   ========================================================= */

function setupScreenTransitionObserver() {

    const screens =
        getAllElements(
            ".app-screen"
        );


    if (!screens.length) {

        return;

    }


    screens.forEach(
        screen => {

            screen.addEventListener(
                "transitionend",
                () => {

                    screen.scrollTop =
                        0;

                }
            );

        }
    );

}


/* =========================================================
   75. PREVENT DOUBLE TAP ZOOM
   ========================================================= */

function setupTouchProtection() {

    let lastTouchTime =
        0;


    document.addEventListener(
        "touchend",
        event => {

            const now =
                Date.now();


            if (
                now - lastTouchTime <
                300
            ) {

                const target =
                    event.target;


                if (
                    target.closest(
                        "button, a"
                    )
                ) {

                    event.preventDefault();

                }

            }


            lastTouchTime =
                now;

        },
        {
            passive: false
        }
    );

}


/* =========================================================
   76. ONLINE / OFFLINE STATUS
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
   77. PAGE VISIBILITY
   ========================================================= */

function setupVisibilityHandling() {

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden
            ) {

                return;

            }


            /*
             * When the user returns to the page,
             * make sure the current screen still exists.
             */

            const current =
                getScreen(
                    AppState.currentScreen
                );


            if (
                !current
            ) {

                showScreen(
                    "home",
                    false
                );

            }

        }
    );

}


/* =========================================================
   78. IMAGE ERROR HANDLING
   ========================================================= */

function setupImageFallbacks() {

    const images =
        getAllElements(
            "img"
        );


    images.forEach(
        image => {

            image.addEventListener(
                "error",
                () => {

                    image.style.display =
                        "none";


                    const parent =
                        image.parentElement;


                    if (
                        parent &&
                        !parent.querySelector(
                            ".image-fallback"
                        )
                    ) {

                        const fallback =
                            document.createElement(
                                "span"
                            );


                        fallback.className =
                            "image-fallback";


                        fallback.textContent =
                            "GGHQ";


                        parent.appendChild(
                            fallback
                        );

                    }

                }
            );

        }
    );

}


/* =========================================================
   79. UPDATE LIVE REGION
   ========================================================= */

function announce(
    message
) {

    const region =
        getElement(
            "#liveRegion"
        );


    if (!region) {

        return;

    }


    region.textContent =
        "";


    setTimeout(
        () => {

            region.textContent =
                message;

        },
        50
    );

}


/* =========================================================
   80. ACCESSIBILITY NAVIGATION
   ========================================================= */

function setupAccessibilityNavigation() {

    const navItems =
        getAllElements(
            ".nav-item"
        );


    navItems.forEach(
        item => {

            item.addEventListener(
                "click",
                () => {

                    const screen =
                        item.dataset.screen;


                    if (
                        screen
                    ) {

                        announce(
                            `Opened ${screen}`
                        );

                    }

                }
            );

        }
    );

}


/* =========================================================
   81. SCROLL TO TOP ON SCREEN CHANGE
   ========================================================= */

function setupScrollReset() {

    window.addEventListener(
        "hashchange",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


/* =========================================================
   82. HANDLE WINDOW RESIZE
   ========================================================= */

function setupResizeHandler() {

    let resizeTimer;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    () => {

                        /*
                         * Keep the current screen
                         * stable after orientation
                         * or viewport changes.
                         */

                        const current =
                            getScreen(
                                AppState.currentScreen
                            );


                        if (
                            current
                        ) {

                            current.scrollTop =
                                0;

                        }

                    },
                    150
                );

        }
    );

}


/* =========================================================
   83. INITIAL SCREEN STATE
   ========================================================= */

function setInitialScreen() {

    const hash =
        window.location.hash
            .replace(
                "#",
                ""
            )
            .trim();


    if (
        hash &&
        getScreen(hash)
    ) {

        showScreen(
            hash,
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
   84. FINAL APP INITIALIZER
   ========================================================= */

function initializeFinalSystems() {

    setCurrentYear();

    setupSwipeNavigation();

    setupScreenTransitionObserver();

    setupTouchProtection();

    setupConnectionStatus();

    setupVisibilityHandling();

    setupImageFallbacks();

    setupAccessibilityNavigation();

    setupScrollReset();

    setupResizeHandler();

    setInitialScreen();


    console.log(
        "Gym Growth HQ — All systems ready."
    );

}


/* =========================================================
   85. FINAL DOM READY
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeFinalSystems,
        {
            once: true
        }
    );

}

else {

    initializeFinalSystems();

}


/* =========================================================
   86. GLOBAL APP ACCESS
   ========================================================= */

window.GymGrowthHQ = {

    showScreen,

    goBack,

    openInfoModal,

    closeInfoModal,

    showToast,

    showLoading,

    hideLoading,

    resetOrderForm,

    getState: () => ({
        ...AppState
    })

};


/* =========================================================
   87. FINAL SAFETY CHECK
   ========================================================= */

window.addEventListener(
    "error",
    event => {

        console.error(
            "Gym Growth HQ error:",
            event.error ||
            event.message
        );

    }
);


/* =========================================================
   88. FINAL MESSAGE
   ========================================================= */

console.log(
    "%cGym Growth HQ",
    "font-size:20px;font-weight:800;"
);

console.log(
    "Mobile-first client experience loaded."
);


/* =========================================================
   END OF SCRIPT.JS
   PART 5/5 COMPLETE
   ========================================================= */
