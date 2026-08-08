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

    currentOrderStep: 1,

    orderData: {},

    isInitialized: false

};


/* =========================================================
   2. DOM HELPERS
   ========================================================= */

function getElement(selector) {

    return document.querySelector(
        selector
    );

}


function getAllElements(selector) {

    return Array.from(
        document.querySelectorAll(
            selector
        )
    );

}


/* =========================================================
   3. SCREEN HELPERS
   ========================================================= */

function getScreen(screenName) {

    const direct =
        document.getElementById(
            screenName
        );

    if (direct) {

        return direct;

    }


    return document.querySelector(
        `[data-screen-section="${screenName}"]`
    );

}


function getDetailScreen(
    detailName
) {

    return document.querySelector(
        `[data-detail-section="${detailName}"]`
    );

}


function getPlanDetailScreen(
    planName
) {

    return document.querySelector(
        `[data-plan-detail-section="${planName}"]`
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
        getScreen(
            screenName
        );


    if (!targetScreen) {

        console.warn(
            `Screen "${screenName}" not found.`
        );

        return;

    }


    if (
        AppState.currentScreen ===
            screenName
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
        AppState.currentScreen !==
            screenName
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
            '[data-go-screen], [data-screen]:not(.nav-item)'
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const targetScreen =
                        button.dataset.goScreen ||
                        button.dataset.screen;


                    if (!targetScreen) {

                        return;

                    }


                    if (
                        targetScreen ===
                            "order"
                        &&
                        button.dataset.plan
                    ) {

                        AppState.selectedService =
                            normalizeServiceKey(
                                button.dataset.plan
                            );


                        prepareOrderForm();

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
            "[data-go-back], [data-back]"
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

            "Before & after editing",

            "Transformation storytelling",

            "Music synchronization",

            "Text overlays",

            "Color enhancement",

            "Instagram-ready export"

        ],

        delivery:
            "Delivery time is confirmed after we receive your footage and requirements.",

        revisions:
            "Revision support is available based on the selected service."

    },


    gymPromotion: {

        title:
            "Gym Promotion",

        icon:
            "📈",

        short:
            "Promotional videos for gyms.",

        description:
            "Create strong promotional content that showcases your gym, facilities, trainers and offers.",

        includes: [

            "Gym promotional videos",

            "Facility showcase",

            "Trainer highlights",

            "Offer promotion",

            "Music and sound design",

            "Instagram-ready export"

        ],

        delivery:
            "Delivery time is confirmed after we receive your footage and requirements.",

        revisions:
            "Revision support is available based on the selected service."

    }

};


/* =========================================================
   23. SERVICE KEY NORMALIZATION
   ========================================================= */

function normalizeServiceKey(
    value
) {

    if (!value) {

        return null;

    }


    const key =
        String(value)
            .trim()
            .toLowerCase();


    const aliases = {

        "reel-editing":
            "reelEditing",

        "reel_editing":
            "reelEditing",

        "reel":
            "reelEditing",

        "reels":
            "reelEditing",

        "reelEditing":
            "reelEditing",


        "transformation-reels":
            "transformation",

        "transformation_reels":
            "transformation",

        "transformation":
            "transformation",


        "gym-promotion":
            "gymPromotion",

        "gym_promotion":
            "gymPromotion",

        "gymPromotion":
            "gymPromotion"

    };


    return aliases[key] || value;

}


/* =========================================================
   24. PRICING DATA
   ========================================================= */

const pricingData = {

    starter: {

        title:
            "Starter",

        price:
            "₹199",

        description:
            "Perfect for a single promotional reel.",

        service:
            "reelEditing"

    },


    growth: {

        title:
            "Growth",

        price:
            "₹299",

        description:
            "For gyms that want stronger transformation content.",

        service:
            "transformation"

    },


    premium: {

        title:
            "Premium",

        price:
            "₹499",

        description:
            "For complete gym promotional content.",

        service:
            "gymPromotion"

    }

};


/* =========================================================
   25. SET SELECTED SERVICE
   ========================================================= */

function setSelectedService(
    service
) {

    const normalized =
        normalizeServiceKey(
            service
        );


    if (
        normalized &&
        serviceData[normalized]
    ) {

        AppState.selectedService =
            normalized;

    }

}


/* =========================================================
   26. SET SELECTED PLAN
   ========================================================= */

function setSelectedPlan(
    plan
) {

    if (
        plan &&
        pricingData[plan]
    ) {

        AppState.selectedPlan =
            plan;

    }

}


/* =========================================================
   27. UPDATE SERVICE DETAIL
   ========================================================= */

function updateServiceDetail(
    serviceKey
) {

    const service =
        serviceData[
            normalizeServiceKey(
                serviceKey
            )
        ];


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


    const description =
        getElement(
            "#serviceDetailDescription"
        );


    const short =
        getElement(
            "#serviceDetailShort"
        );


    if (title) {

        title.textContent =
            service.title;

    }


    if (icon) {

        icon.textContent =
            service.icon;

    }


    if (description) {

        description.textContent =
            service.description;

    }


    if (short) {

        short.textContent =
            service.short;

    }


    const includes =
        getElement(
            "#serviceDetailIncludes"
        );


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

}


/* =========================================================
   28. UPDATE PLAN DETAIL
   ========================================================= */

function updatePlanDetail(
    planKey
) {

    const plan =
        pricingData[
            planKey
        ];


    if (!plan) {

        return;

    }


    const title =
        getElement(
            "#planDetailTitle"
        );


    const price =
        getElement(
            "#planDetailPrice"
        );


    const description =
        getElement(
            "#planDetailDescription"
        );


    if (title) {

        title.textContent =
            plan.title;

    }


    if (price) {

        price.textContent =
            plan.price;

    }


    if (description) {

        description.textContent =
            plan.description;

    }

}


/* =========================================================
   29. SERVICE BUTTONS
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
                event => {

                    event.preventDefault();


                    const service =
                        normalizeServiceKey(
                            button.dataset.service
                        );


                    if (!service) {

                        return;

                    }


                    setSelectedService(
                        service
                    );


                    updateServiceDetail(
                        service
                    );


                    const detailTarget =
                        button.dataset.detailScreen;


                    if (
                        detailTarget
                    ) {

                        showScreen(
                            detailTarget
                        );

                        return;

                    }


                    const screen =
                        getScreen(
                            `service-${service}`
                        );


                    if (screen) {

                        showScreen(
                            `service-${service}`
                        );

                        return;

                    }


                    showScreen(
                        "services"
                    );

                }
            );

        }
    );

}


/* =========================================================
   30. PRICING BUTTONS
   ========================================================= */

function setupPricingButtons() {

    const buttons =
        getAllElements(
            "[data-plan-detail]"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    const plan =
                        button.dataset.planDetail;


                    if (!plan) {

                        return;

                    }


                    setSelectedPlan(
                        plan
                    );


                    updatePlanDetail(
                        plan
                    );


                    const target =
                        `plan-${plan}`;


                    if (
                        getScreen(
                            target
                        )
                    ) {

                        showScreen(
                            target
                        );

                    }

                    else {

                        showScreen(
                            "pricing"
                        );

                    }

                }
            );

        }
    );

}


/* =========================================================
   31. SERVICE + PRICING ORDER BUTTONS
   ========================================================= */

function setupServiceOrderButtons() {

    const buttons =
        getAllElements(
            '[data-screen="order"][data-plan]'
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    const service =
                        normalizeServiceKey(
                            button.dataset.plan
                        );


                    if (service) {

                        AppState.selectedService =
                            service;

                    }


                    prepareOrderForm();


                    AppState.currentOrderStep =
                        1;


                    showScreen(
                        "order"
                    );

                }
            );

        }
    );

}


function setupPlanOrderButtons() {

    const buttons =
        getAllElements(
            '[data-screen="order"][data-plan]'
        );


    buttons.forEach(
        button => {

            if (
                button.dataset.orderBound
            ) {

                return;

            }


            button.dataset.orderBound =
                "true";


            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    const plan =
                        button.dataset.plan;


                    if (
                        plan &&
                        pricingData[plan]
                    ) {

                        AppState.selectedPlan =
                            plan;


                        AppState.selectedService =
                            normalizeServiceKey(
                                pricingData[
                                    plan
                                ].service
                            );

                    }

                    else if (plan) {

                        AppState.selectedService =
                            normalizeServiceKey(
                                plan
                            );

                    }


                    prepareOrderForm();


                    AppState.currentOrderStep =
                        1;


                    showScreen(
                        "order"
                    );

                }
            );

        }
    );

}


/* =========================================================
   32. INITIALIZE COMMERCE
   ========================================================= */

function initializeCommerce() {

    setupServiceButtons();

    setupPricingButtons();

    setupServiceOrderButtons();

    setupPlanOrderButtons();

}


/* =========================================================
   END OF SCRIPT.JS — PART 2/5
   ========================================================= */
/* =========================================================
   GYM GROWTH HQ
   SCRIPT.JS — PART 3/5

   ORDER SYSTEM
   MOBILE ORDER STEPS
   GYM NAME
   INSTAGRAM
   REVIEW
   SUBMIT
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
   34. ORDER SERVICE DISPLAY
   ========================================================= */

function updateOrderServiceDisplay() {

    const serviceKey =
        normalizeServiceKey(
            AppState.selectedService
        );


    const service =
        serviceData[
            serviceKey
        ];


    if (!service) {

        return;

    }


    const selectedServiceName =
        getElement(
            "#selectedServiceName"
        );


    const reviewServiceName =
        getElement(
            "#reviewServiceName"
        );


    if (selectedServiceName) {

        selectedServiceName.textContent =
            service.title;

    }


    if (reviewServiceName) {

        reviewServiceName.textContent =
            service.title;

    }

}


/* =========================================================
   35. PREPARE ORDER FORM
   ========================================================= */

function prepareOrderForm() {

    const serviceSelect =
        getElement(
            "#serviceSelect"
        );


    /*
     * If the old select exists,
     * keep it synchronized with
     * the selected service.
     */
    if (
        serviceSelect &&
        AppState.selectedService
    ) {

        const normalized =
            normalizeServiceKey(
                AppState.selectedService
            );


        const option =
            Array.from(
                serviceSelect.options
            ).find(
                item =>
                    normalizeServiceKey(
                        item.value
                    ) === normalized
            );


        if (option) {

            serviceSelect.value =
                option.value;

        }

    }


    updateOrderServiceDisplay();


    AppState.currentOrderStep =
        1;


    updateOrderProgress();

}


/* =========================================================
   36. ORDER STEP CONTROL
   ========================================================= */

function setOrderStep(
    step
) {

    const stepNumber =
        Number(step);


    if (
        !Number.isFinite(
            stepNumber
        )
    ) {

        return;

    }


    if (
        stepNumber < 1 ||
        stepNumber > 3
    ) {

        return;

    }


    AppState.currentOrderStep =
        stepNumber;


    const steps =
        getAllElements(
            "[data-order-step]"
        );


    steps.forEach(
        stepElement => {

            const elementStep =
                Number(
                    stepElement.dataset
                        .orderStep
                );


            const active =
                elementStep ===
                stepNumber;


            stepElement.classList.toggle(
                "active-order-step",
                active
            );


            stepElement.setAttribute(
                "aria-hidden",
                active
                    ? "false"
                    : "true"
            );

        }
    );


    updateOrderProgress();


    updateOrderReview();


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   37. ORDER PROGRESS
   ========================================================= */

function updateOrderProgress() {

    const progressSteps =
        getAllElements(
            "[data-progress-step]"
        );


    progressSteps.forEach(
        step => {

            const number =
                Number(
                    step.dataset
                        .progressStep
                );


            const active =
                number <=
                AppState.currentOrderStep;


            step.classList.toggle(
                "active-progress",
                active
            );

        }
    );

}


/* =========================================================
   38. ORDER NEXT BUTTONS
   ========================================================= */

function setupOrderNextButtons() {

    const buttons =
        getAllElements(
            "[data-order-next]"
        );


    buttons.forEach(
        button => {

            if (
                button.dataset
                    .orderNextBound
            ) {

                return;

            }


            button.dataset
                .orderNextBound =
                    "true";


            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    const nextStep =
                        Number(
                            button.dataset
                                .orderNext
                        );


                    if (
                        !nextStep
                    ) {

                        return;

                    }


                    /*
                     * Step 1 must have
                     * a selected service.
                     */
                    if (
                        AppState.currentOrderStep
                            === 1
                    ) {

                        if (
                            !AppState.selectedService
                        ) {

                            showToast(
                                "Please select a service first."
                            );

                            return;

                        }

                    }


                    /*
                     * Step 2 requires
                     * Gym Name + Instagram.
                     */
                    if (
                        AppState.currentOrderStep
                            === 2
                    ) {

                        if (
                            !validateOrderStepTwo()
                        ) {

                            return;

                        }

                    }


                    setOrderStep(
                        nextStep
                    );

                }
            );

        }
    );

}


/* =========================================================
   39. ORDER BACK / CHANGE STEP
   ========================================================= */

function setupOrderStepBackButtons() {

    const buttons =
        getAllElements(
            "[data-order-go-step]"
        );


    buttons.forEach(
        button => {

            if (
                button.dataset
                    .orderBackBound
            ) {

                return;

            }


            button.dataset
                .orderBackBound =
                    "true";


            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    const step =
                        Number(
                            button.dataset
                                .orderGoStep
                        );


                    if (
                        !step
                    ) {

                        return;

                    }


                    setOrderStep(
                        step
                    );

                }
            );

        }
    );

}


/* =========================================================
   40. SERVICE SELECTION
   ========================================================= */

function setupOrderServiceSelection() {

    const buttons =
        getAllElements(
            "[data-order-service]"
        );


    buttons.forEach(
        button => {

            if (
                button.dataset
                    .orderServiceBound
            ) {

                return;

            }


            button.dataset
                .orderServiceBound =
                    "true";


            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    const service =
                        normalizeServiceKey(
                            button.dataset
                                .orderService
                        );


                    if (
                        !service ||
                        !serviceData[
                            service
                        ]
                    ) {

                        return;

                    }


                    AppState.selectedService =
                        service;


                    AppState.selectedPlan =
                        null;


                    updateOrderServiceDisplay();


                    setOrderStep(
                        2
                    );

                }
            );

        }
    );

}


/* =========================================================
   41. VALIDATE STEP 2
   ========================================================= */

function validateOrderStepTwo() {

    const gymName =
        getOrderInput(
            "gymName"
        );


    const instagram =
        getOrderInput(
            "instagramUsername"
        );


    let valid =
        true;


    if (
        !gymName ||
        !gymName.value.trim()
    ) {

        showFieldError(
            gymName,
            "Please enter your gym name."
        );


        valid =
            false;

    }


    if (
        !instagram ||
        !instagram.value.trim()
    ) {

        showFieldError(
            instagram,
            "Please enter your Instagram handle."
        );


        valid =
            false;

    }


    if (
        instagram &&
        instagram.value.trim()
    ) {

        if (
            !validateInstagram(
                instagram
            )
        ) {

            valid =
                false;

        }

    }


    return valid;

}


/* =========================================================
   42. UPDATE ORDER REVIEW
   ========================================================= */

function updateOrderReview() {

    const gymName =
        getOrderInput(
            "gymName"
        );


    const instagram =
        getOrderInput(
            "instagramUsername"
        );


    const reviewGymName =
        getElement(
            "#reviewGymName"
        );


    const reviewInstagram =
        getElement(
            "#reviewInstagram"
        );


    if (reviewGymName) {

        reviewGymName.textContent =
            gymName &&
            gymName.value.trim()
                ? gymName.value.trim()
                : "—";

    }


    if (reviewInstagram) {

        reviewInstagram.textContent =
            instagram &&
            instagram.value.trim()
                ? instagram.value.trim()
                : "—";

    }


    updateOrderServiceDisplay();

}


/* =========================================================
   43. COLLECT ORDER DATA
   ========================================================= */

function collectOrderData() {

    const gymName =
        getOrderInput(
            "gymName"
        );


    const instagram =
        getOrderInput(
            "instagramUsername"
        );


    return {

        gymName:
            gymName
                ? gymName.value.trim()
                : "",


        instagramUsername:
            instagram
                ? instagram.value.trim()
                : "",


        selectedPlan:
            AppState.selectedPlan,


        selectedService:
            AppState.selectedService

    };

}


/* =========================================================
   44. VALIDATE FINAL ORDER
   ========================================================= */

function validateOrder(
    data
) {

    let valid =
        true;


    if (
        !data.selectedService
    ) {

        showToast(
            "Please select a service."
        );


        valid =
            false;

    }


    if (
        !data.gymName
    ) {

        const gymName =
            getOrderInput(
                "gymName"
            );


        showFieldError(
            gymName,
            "Please enter your gym name."
        );


        valid =
            false;

    }


    if (
        !data.instagramUsername
    ) {

        const instagram =
            getOrderInput(
                "instagramUsername"
            );


        showFieldError(
            instagram,
            "Please enter your Instagram handle."
        );


        valid =
            false;

    }


    return valid;

}


/* =========================================================
   45. SHOW ORDER SUCCESS
   ========================================================= */

function showFormSuccess(
    data
) {

    const orderForm =
        getOrderForm();


    const success =
        getElement(
            "#orderSuccess"
        );


    if (orderForm) {

        orderForm.style.display =
            "none";

    }


    if (success) {

        success.classList.add(
            "visible"
        );


        success.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    const successGymName =
        getElement(
            "#successGymName"
        );


    if (
        successGymName
    ) {

        successGymName.textContent =
            data.gymName;

    }

}


/* =========================================================
   46. RESET ORDER
   ========================================================= */

function resetOrderForm() {

    const form =
        getOrderForm();


    if (form) {

        form.reset();

    }


    clearFormErrors(
        form
    );


    AppState.selectedService =
        null;


    AppState.selectedPlan =
        null;


    AppState.currentOrderStep =
        1;


    const success =
        getElement(
            "#orderSuccess"
        );


    if (success) {

        success.classList.remove(
            "visible"
        );


        success.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    if (form) {

        form.style.display =
            "";

    }


    setOrderStep(
        1
    );

}


/* =========================================================
   47. ORDER SUBMIT
   ========================================================= */

function handleOrderSubmit(
    event
) {

    event.preventDefault();


    const data =
        collectOrderData();


    if (
        !validateOrder(
            data
        )
    ) {

        showToast(
            "Please complete your gym name and Instagram."
        );


        return;

    }


    AppState.isLoading =
        true;


    if (
        typeof showLoading ===
        "function"
    ) {

        showLoading(
            "Preparing your order..."
        );

    }


    setTimeout(
        () => {

            AppState.isLoading =
                false;


            if (
                typeof hideLoading ===
                "function"
            ) {

                hideLoading();

            }


            showFormSuccess(
                data
            );


            if (
                typeof showToast ===
                "function"
            ) {

                showToast(
                    "Order details received."
                );

            }

        },
        700
    );

}


/* =========================================================
   48. ORDER FORM SETUP
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


    setupOrderNextButtons();

    setupOrderStepBackButtons();

    setupOrderServiceSelection();


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


                    if (
                        AppState.currentOrderStep
                            === 3
                    ) {

                        updateOrderReview();

                    }

                }
            );


            input.addEventListener(
                "change",
                () => {

                    clearFieldError(
                        input
                    );


                    updateOrderReview();

                }
            );

        }
    );

}


/* =========================================================
   49. ORDER NAVIGATION
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
                event => {

                    event.preventDefault();


                    const service =
                        normalizeServiceKey(
                            button.dataset
                                .openOrder
                        );


                    if (
                        service &&
                        serviceData[
                            service
                        ]
                    ) {

                        AppState.selectedService =
                            service;

                    }


                    AppState.currentOrderStep =
                        1;


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
   50. INITIALIZE ORDER SYSTEM
   ========================================================= */

function initializeOrderSystem() {

    setupOrderForm();

    setupOrderNavigation();

}


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
   ========================================================= */


/* =========================================================
   51. MODAL ELEMENT
   ========================================================= */

function getInfoModal() {

    return getElement(
        "#infoModal"
    );

}


/* =========================================================
   52. OPEN INFO MODAL
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
   53. CLOSE INFO MODAL
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
   54. MODAL EVENTS
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
   55. ESCAPE KEY
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
   56. TOAST
   ========================================================= */

let toastTimer =
    null;


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
   57. HIDE TOAST
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
   58. LOADING
   ========================================================= */

function showLoading(
    message =
        "Please wait..."
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
   59. HIDE LOADING
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


    if (
        !AppState.modalOpen
    ) {

        unlockBodyScroll();

    }

}


/* =========================================================
   60. SUPPORT DATA
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
   61. SUPPORT CARDS
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
                        card.dataset
                            .support;


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
                            "Close"

                    });

                }
            );

        }
    );

}


/* =========================================================
   62. SUPPORT INITIALIZER
   ========================================================= */

function initializeSupportSystem() {

    setupSupportCards();

}


/* =========================================================
   63. UI INITIALIZER
   ========================================================= */

function initializeUISystem() {

    setupModal();

    setupEscapeKey();

    initializeSupportSystem();

}


/* =========================================================
   END OF SCRIPT.JS — PART 4/5
   ========================================================= */
/* =========================================================
   GYM GROWTH HQ
   SCRIPT.JS — PART 5/5

   MOBILE SWIPE
   SCREEN NAVIGATION FIX
   HOME / SERVICES / PRICING / ORDER / SUPPORT
   ========================================================= */


/* =========================================================
   64. MAIN SCREEN ORDER
   ========================================================= */

const MAIN_SCREEN_ORDER = [

    "home",

    "services",

    "pricing",

    "order",

    "support"

];


/* =========================================================
   65. GET CURRENT MAIN SCREEN INDEX
   ========================================================= */

function getCurrentMainScreenIndex() {

    const current =
        AppState.currentScreen;


    const index =
        MAIN_SCREEN_ORDER.indexOf(
            current
        );


    if (index < 0) {

        return 0;

    }


    return index;

}


/* =========================================================
   66. GO TO NEXT MAIN SCREEN
   ========================================================= */

function goToNextMainScreen() {

    const currentIndex =
        getCurrentMainScreenIndex();


    const nextIndex =
        currentIndex + 1;


    if (
        nextIndex >=
        MAIN_SCREEN_ORDER.length
    ) {

        return;

    }


    const nextScreen =
        MAIN_SCREEN_ORDER[
            nextIndex
        ];


    showScreen(
        nextScreen
    );

}


/* =========================================================
   67. GO TO PREVIOUS MAIN SCREEN
   ========================================================= */

function goToPreviousMainScreen() {

    const currentIndex =
        getCurrentMainScreenIndex();


    const previousIndex =
        currentIndex - 1;


    if (
        previousIndex < 0
    ) {

        return;

    }


    const previousScreen =
        MAIN_SCREEN_ORDER[
            previousIndex
        ];


    showScreen(
        previousScreen
    );

}


/* =========================================================
   68. TOUCH SWIPE
   ========================================================= */

function setupSwipeNavigation() {

    let startX =
        0;

    let startY =
        0;

    let isTouching =
        false;


    document.addEventListener(
        "touchstart",
        event => {

            if (
                event.touches.length !== 1
            ) {

                return;

            }


            /*
             * Do not start screen swipe
             * while typing.
             */
            const target =
                event.target;


            if (
                target.closest(
                    "input, textarea, select, button"
                )
            ) {

                return;

            }


            startX =
                event.touches[0]
                    .clientX;


            startY =
                event.touches[0]
                    .clientY;


            isTouching =
                true;

        },
        {
            passive: true
        }
    );


    document.addEventListener(
        "touchend",
        event => {

            if (!isTouching) {

                return;

            }


            isTouching =
                false;


            if (
                event.changedTouches.length
                !== 1
            ) {

                return;

            }


            const endX =
                event.changedTouches[0]
                    .clientX;


            const endY =
                event.changedTouches[0]
                    .clientY;


            const deltaX =
                endX - startX;


            const deltaY =
                endY - startY;


            /*
             * Vertical movement means
             * normal scrolling.
             */
            if (
                Math.abs(deltaY) >
                Math.abs(deltaX)
            ) {

                return;

            }


            /*
             * Ignore tiny movements.
             */
            if (
                Math.abs(deltaX) <
                80
            ) {

                return;

            }


            /*
             * LEFT = NEXT
             * RIGHT = PREVIOUS
             */
            if (
                deltaX < 0
            ) {

                goToNextMainScreen();

            }

            else {

                goToPreviousMainScreen();

            }

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   69. SCREEN SCROLL RESET
   ========================================================= */

function resetScreenScroll() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });


    const activeScreen =
        document.querySelector(
            ".app-screen.active-screen"
        );


    if (
        activeScreen &&
        typeof activeScreen.scrollTo ===
            "function"
    ) {

        activeScreen.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }

}


/* =========================================================
   70. NAVIGATION SCREEN RESET
   ========================================================= */

function setupNavigationScrollReset() {

    const navItems =
        getAllElements(
            ".nav-item"
        );


    navItems.forEach(
        item => {

            item.addEventListener(
                "click",
                () => {

                    setTimeout(
                        () => {

                            resetScreenScroll();

                        },
                        50
                    );

                }
            );

        }
    );

}


/* =========================================================
   71. PLAN DETAIL → ORDER
   ========================================================= */

function setupPlanDetailOrderLinks() {

    const buttons =
        getAllElements(
            '[data-screen="order"]'
        );


    buttons.forEach(
        button => {

            if (
                button.dataset
                    .finalOrderBound
            ) {

                return;

            }


            button.dataset
                .finalOrderBound =
                    "true";


            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    const plan =
                        button.dataset.plan;


                    if (
                        plan &&
                        pricingData[
                            plan
                        ]
                    ) {

                        AppState.selectedPlan =
                            plan;


                        AppState.selectedService =
                            normalizeServiceKey(
                                pricingData[
                                    plan
                                ].service
                            );

                    }

                    else if (
                        plan
                    ) {

                        AppState.selectedService =
                            normalizeServiceKey(
                                plan
                            );

                    }


                    AppState.currentOrderStep =
                        1;


                    prepareOrderForm();


                    showScreen(
                        "order"
                    );


                    resetScreenScroll();

                }
            );

        }
    );

}


/* =========================================================
   72. SERVICE DETAIL → ORDER
   ========================================================= */

function setupServiceDetailOrderLinks() {

    const buttons =
        getAllElements(
            '[data-open-order]'
        );


    buttons.forEach(
        button => {

            if (
                button.dataset
                    .finalServiceOrderBound
            ) {

                return;

            }


            button.dataset
                .finalServiceOrderBound =
                    "true";


            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    const service =
                        normalizeServiceKey(
                            button.dataset
                                .openOrder
                        );


                    if (
                        service &&
                        serviceData[
                            service
                        ]
                    ) {

                        AppState.selectedService =
                            service;

                    }


                    AppState.currentOrderStep =
                        1;


                    prepareOrderForm();


                    showScreen(
                        "order"
                    );


                    resetScreenScroll();

                }
            );

        }
    );

}


/* =========================================================
   73. PRICING → PLAN DETAILS
   ========================================================= */

function setupFinalPricingNavigation() {

    const buttons =
        getAllElements(
            "[data-plan-detail]"
        );


    buttons.forEach(
        button => {

            if (
                button.dataset
                    .finalPricingBound
            ) {

                return;

            }


            button.dataset
                .finalPricingBound =
                    "true";


            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    const plan =
                        button.dataset
                            .planDetail;


                    if (!plan) {

                        return;

                    }


                    AppState.selectedPlan =
                        plan;


                    updatePlanDetail(
                        plan
                    );


                    const detailScreen =
                        getScreen(
                            `plan-${plan}`
                        );


                    if (
                        detailScreen
                    ) {

                        showScreen(
                            `plan-${plan}`
                        );

                    }

                    else {

                        /*
                         * If a specific plan
                         * screen does not exist,
                         * stay on Pricing.
                         */
                        showScreen(
                            "pricing"
                        );

                    }


                    resetScreenScroll();

                }
            );

        }
    );

}


/* =========================================================
   74. SERVICES → SERVICE DETAILS
   ========================================================= */

function setupFinalServiceNavigation() {

    const buttons =
        getAllElements(
            "[data-service]"
        );


    buttons.forEach(
        button => {

            if (
                button.dataset
                    .finalServiceBound
            ) {

                return;

            }


            button.dataset
                .finalServiceBound =
                    "true";


            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    const service =
                        normalizeServiceKey(
                            button.dataset
                                .service
                        );


                    if (!service) {

                        return;

                    }


                    AppState.selectedService =
                        service;


                    updateServiceDetail(
                        service
                    );


                    const target =
                        button.dataset
                            .detailScreen;


                    if (
                        target &&
                        getScreen(
                            target
                        )
                    ) {

                        showScreen(
                            target
                        );

                    }

                    else if (
                        getScreen(
                            `service-${service}`
                        )
                    ) {

                        showScreen(
                            `service-${service}`
                        );

                    }

                    else {

                        showScreen(
                            "services"
                        );

                    }


                    resetScreenScroll();

                }
            );

        }
    );

}


/* =========================================================
   75. INITIALIZE NAVIGATION FIX
   ========================================================= */

function initializeFinalNavigation() {

    setupSwipeNavigation();

    setupNavigationScrollReset();

    setupPlanDetailOrderLinks();

    setupServiceDetailOrderLinks();

    setupFinalPricingNavigation();

    setupFinalServiceNavigation();

}


/* =========================================================
   76. FINAL UI INITIALIZATION
   ========================================================= */

function initializeFinalUI() {

    initializeCommerce();

    initializeOrderSystem();

    initializeUISystem();

    initializeFinalNavigation();


    /*
     * Home must be the first screen.
     */
    if (
        !AppState.currentScreen
    ) {

        AppState.currentScreen =
            "home";

    }


    /*
     * Make sure the initial screen
     * is visible.
     */
    if (
        !getScreen(
            AppState.currentScreen
        )
    ) {

        AppState.currentScreen =
            "home";

    }


    showScreen(
        AppState.currentScreen,
        false
    );


    AppState.isInitialized =
        true;


    console.log(
        "Gym Growth HQ — final UI initialized."
    );

}


/* =========================================================
   77. SAFE INITIALIZATION
   ========================================================= */

function runFinalInitialization() {

    try {

        initializeFinalUI();

    }

    catch (error) {

        console.error(
            "Gym Growth HQ initialization error:",
            error
        );

    }

}


/* =========================================================
   78. START
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        runFinalInitialization,
        {
            once: true
        }
    );

}

else {

    runFinalInitialization();

}


/* =========================================================
   END OF SCRIPT.JS — PART 5/5
   ========================================================= */
/* =========================================================
   GYM GROWTH HQ
   SCRIPT.JS — PART 6/10

   FINAL POLISH
   SWIPE
   TRANSITIONS
   TOUCH
   CONNECTION
   VISIBILITY
   ACCESSIBILITY
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
                event.touches.length !==
                1
            ) {

                return;

            }


            startX =
                event.touches[0]
                    .clientX;


            startY =
                event.touches[0]
                    .clientY;

        },
        {
            passive: true
        }
    );


    document.addEventListener(
        "touchend",
        event => {

            if (
                event.changedTouches.length !==
                1
            ) {

                return;

            }


            endX =
                event.changedTouches[0]
                    .clientX;


            endY =
                event.changedTouches[0]
                    .clientY;


            const deltaX =
                endX - startX;


            const deltaY =
                endY - startY;


            /*
             * Ignore vertical scrolling.
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
                screens[
                    nextIndex
                ]
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
                screens[
                    previousIndex
                ]
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


    if (
        !screens.length
    ) {

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
                now -
                    lastTouchTime <
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
             * When the user returns,
             * make sure the current
             * screen still exists.
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


                        resetScreenScroll();

                    },
                    150
                );

        }
    );

}


/* =========================================================
   END OF SCRIPT.JS — PART 6/10
   ========================================================= */
/* =========================================================
   GYM GROWTH HQ
   SCRIPT.JS — PART 7/10

   INITIAL SCREEN
   FINAL SYSTEM INITIALIZATION
   GLOBAL APP ACCESS
   SAFETY CHECK
   ========================================================= */


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
   PART 7/10
   ========================================================= */
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
                            !current
                        ) {

                            showScreen(
                                "home",
                                false
                            );

                        }

                    },
                    150
                );

        }
    );

}


/* =========================================================
   END OF SCRIPT.JS — PART 5/5
   ========================================================= */
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
