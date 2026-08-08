(() => {
  'use strict';

  const AppState = {
    currentScreen: 'home',
    screenHistory: [],
    selectedService: null,
    selectedPlan: null,
    currentOrderStep: 1
  };

  const services = {
    'reel-editing': { title: 'Reel Editing', icon: '🎬' },
    transformation: { title: 'Transformation Reel', icon: '🔥' },
    'gym-promotion': { title: 'Gym Promotion', icon: '📈' }
  };

  function all(selector) {
    return [...document.querySelectorAll(selector)];
  }

  function one(selector) {
    return document.querySelector(selector);
  }

  function getScreen(name) {
    return document.getElementById(name) ||
      one(`[data-screen-section="${name}"]`) ||
      one(`[data-detail-section="${name}"]`) ||
      one(`[data-plan-detail-section="${name}"]`) ||
      one(`[data-support-section="${name}"]`);
  }

  function hideScreens() {
    all('.app-screen').forEach(s => {
      s.classList.remove('active-screen');
      s.setAttribute('aria-hidden', 'true');
    });
  }

  function showScreen(name, history = true) {
    const target = getScreen(name);

    if (!target) {
      console.warn('Screen not found:', name);
      return false;
    }

    if (history && AppState.currentScreen !== name) {
      AppState.screenHistory.push(AppState.currentScreen);
    }

    AppState.currentScreen = name;

    hideScreens();

    target.classList.add('active-screen');
    target.setAttribute('aria-hidden', 'false');

    all('.nav-item').forEach(n => {
      const active = n.dataset.screen === name;
      n.classList.toggle('active-nav', active);
      n.setAttribute('aria-current', active ? 'page' : 'false');
    });

    const home = one('#floatingHomeButton');

    if (home) {
      home.classList.toggle('visible', name !== 'home');
    }

    document.body.dataset.screen = name;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    return true;
  }

  function goBack() {
    const previous = AppState.screenHistory.pop();

    showScreen(
      previous || 'home',
      false
    );
  }

  function selectService(key) {
    if (!services[key]) return false;

    AppState.selectedService = key;

    const name = one('#selectedServiceName');

    if (name) {
      name.textContent = services[key].title;
    }

    return true;
  }

  function setOrderStep(step) {
    const n = String(step);

    AppState.currentOrderStep = Number(step);

    all('[data-order-step]').forEach(s => {
      const active = s.dataset.orderStep === n;

      s.classList.toggle(
        'active-order-step',
        active
      );

      s.setAttribute(
        'aria-hidden',
        active ? 'false' : 'true'
      );
    });

    all('[data-progress-step]').forEach(s => {
      s.classList.toggle(
        'active-progress',
        Number(s.dataset.progressStep) <= Number(step)
      );
    });
  }

  function toast(message) {
    const t = one('#toast');

    if (!t) return;

    const text = one('#toastMessage');

    if (text) {
      text.textContent = message;
    }

    t.classList.add('visible');

    clearTimeout(window.__toastTimer);

    window.__toastTimer = setTimeout(
      () => t.classList.remove('visible'),
      2500
    );
                     }
    function setupNavigation() {
    all('.nav-item').forEach(item => {
      item.addEventListener('click', event => {
        event.preventDefault();

        const screen = item.dataset.screen;

        if (!screen) return;

        if (screen === AppState.currentScreen) return;

        showScreen(screen);
      });
    });
  }

  function setupScreenButtons() {
    all('[data-screen]').forEach(button => {
      button.addEventListener('click', event => {
        event.preventDefault();

        const screen = button.dataset.screen;

        if (!screen) return;

        if (screen === 'home') {
          AppState.screenHistory = [];
        }

        showScreen(screen);
      });
    });
  }

  function setupBackButtons() {
    all('[data-back]').forEach(button => {
      button.addEventListener('click', event => {
        event.preventDefault();

        const target = button.dataset.back;

        if (target) {
          showScreen(target, false);
        } else {
          goBack();
        }
      });
    });

    all('[data-go-back]').forEach(button => {
      button.addEventListener('click', event => {
        event.preventDefault();
        goBack();
      });
    });
  }

  function setupFloatingHome() {
    const button = one('#floatingHomeButton');

    if (!button) return;

    button.addEventListener('click', event => {
      event.preventDefault();

      AppState.screenHistory = [];

      showScreen('home', false);
    });
  }

  function setupServiceButtons() {
    all('[data-service]').forEach(button => {
      button.addEventListener('click', event => {
        event.preventDefault();

        const key = button.dataset.service;

        if (!selectService(key)) return;

        showScreen(key);
      });
    });
  }

  function setupOrderServiceButtons() {
    all('[data-order-service]').forEach(button => {
      button.addEventListener('click', event => {
        event.preventDefault();

        const key = button.dataset.orderService;

        if (!selectService(key)) return;

        showScreen('order');

        setOrderStep(1);
      });
    });
  }

  function setupPlanButtons() {
    all('[data-plan]').forEach(button => {
      button.addEventListener('click', event => {
        event.preventDefault();

        const plan = button.dataset.plan;

        if (!plan) return;

        AppState.selectedPlan = plan;

        const detail =
          button.dataset.planDetail ||
          `plan-${plan}`;

        showScreen(detail);
      });
    });
  }

  function setupOrderNavigation() {
    all('[data-order-next]').forEach(button => {
      button.addEventListener('click', event => {
        event.preventDefault();

        const next = Number(
          button.dataset.orderNext
        );

        if (!next) return;

        setOrderStep(next);
      });
    });

    all('[data-order-go-step]').forEach(button => {
      button.addEventListener('click', event => {
        event.preventDefault();

        const step = Number(
          button.dataset.orderGoStep
        );

        if (!step) return;

        setOrderStep(step);
      });
    });
  }

  function setupSupportButtons() {
    all('[data-support]').forEach(button => {
      button.addEventListener('click', event => {
        event.preventDefault();

        const key = button.dataset.support;

        if (!key) return;

        showScreen(
          `support-${key}`
        );
      });
    });
  }

  function setupHash() {
    const hash =
      window.location.hash
        .replace('#', '')
        .trim();

    if (hash && getScreen(hash)) {
      showScreen(hash, false);
    } else {
      showScreen('home', false);
    }
  }

  window.GymGrowthHQ = {
    showScreen,
    goBack,
    setOrderStep,
    selectService,
    toast,
    state: AppState
  };  function setupContactValidation() {
    const form = one('#orderForm');

    if (!form) return;

    const fields = [
      'clientName',
      'gymName',
      'instagramHandle',
      'contactNumber'
    ];

    fields.forEach(id => {
      const input = one(`#${id}`);

      if (!input) return;

      input.addEventListener('input', () => {
        const group =
          input.closest('.form-group');

        if (group) {
          group.classList.remove('has-error');
        }
      });
    });
  }

  function validateOrderForm() {
    const required = [
      ['clientName', 'Please enter your name.'],
      ['gymName', 'Please enter your gym name.'],
      [
        'instagramHandle',
        'Please enter your Instagram username.'
      ],
      [
        'contactNumber',
        'Please enter your contact number.'
      ]
    ];

    let valid = true;

    required.forEach(([id, message]) => {
      const input = one(`#${id}`);

      if (!input) return;

      const group =
        input.closest('.form-group');

      if (!input.value.trim()) {
        valid = false;

        if (group) {
          group.classList.add('has-error');

          const error =
            group.querySelector('.form-error');

          if (error) {
            error.textContent = message;
          }
        }
      } else {
        if (group) {
          group.classList.remove('has-error');
        }
      }
    });

    return valid;
  }

  function setupOrderForm() {
    const form = one('#orderForm');

    if (!form) return;

    const serviceSelect =
      one('#serviceSelect');

    if (serviceSelect) {
      serviceSelect.addEventListener(
        'change',
        () => {
          AppState.selectedService =
            serviceSelect.value || null;
        }
      );
    }

    const submit =
      one('#submitOrderButton');

    if (!submit) return;

    submit.addEventListener(
      'click',
      event => {
        event.preventDefault();

        if (!validateOrderForm()) {
          toast(
            'Please complete the required details.'
          );

          return;
        }

        const success =
          one('#orderSuccess');

        if (success) {
          success.classList.add('visible');
          success.setAttribute(
            'aria-hidden',
            'false'
          );
        }

        toast(
          'Order request submitted successfully.'
        );
      }
    );
  }

  function setupModal() {
    const modal = one('#infoModal');

    if (!modal) return;

    const closeButtons =
      modal.querySelectorAll(
        '[data-modal-close], #modalClose'
      );

    closeButtons.forEach(button => {
      button.addEventListener(
        'click',
        () => {
          modal.classList.remove('open');
          modal.setAttribute(
            'aria-hidden',
            'true'
          );
        }
      );
    });

    document.addEventListener(
      'keydown',
      event => {
        if (event.key === 'Escape') {
          modal.classList.remove('open');
          modal.setAttribute(
            'aria-hidden',
            'true'
          );
        }
      }
    );
  }

  function setupMobileBehaviour() {
    let startX = 0;
    let startY = 0;

    document.addEventListener(
      'touchstart',
      event => {
        if (!event.touches.length) return;

        startX =
          event.touches[0].clientX;

        startY =
          event.touches[0].clientY;
      },
      { passive: true }
    );

    document.addEventListener(
      'touchend',
      event => {
        if (!event.changedTouches.length) {
          return;
        }

        const endX =
          event.changedTouches[0].clientX;

        const endY =
          event.changedTouches[0].clientY;

        const dx = endX - startX;
        const dy = endY - startY;

        if (
          Math.abs(dx) < 80 ||
          Math.abs(dx) < Math.abs(dy)
        ) {
          return;
        }

        if (dx > 0) {
          goBack();
        }
      },
      { passive: true }
    );
}  function setupResetButtons() {
    all('[data-order-reset]').forEach(button => {
      button.addEventListener('click', event => {
        event.preventDefault();

        AppState.selectedService = null;
        AppState.selectedPlan = null;
        AppState.currentOrderStep = 1;

        const form = one('#orderForm');

        if (form) {
          form.reset();
        }

        const success = one('#orderSuccess');

        if (success) {
          success.classList.remove('visible');
          success.setAttribute(
            'aria-hidden',
            'true'
          );
        }

        setOrderStep(1);
        showScreen('order', false);
      });
    });
  }

  function setupWindowEvents() {
    window.addEventListener('popstate', () => {
      goBack();
    });

    window.addEventListener('online', () => {
      toast('Connection restored.');
    });

    window.addEventListener('offline', () => {
      toast('You are offline.');
    });
  }

  function initializeApp() {
    setupNavigation();
    setupScreenButtons();
    setupBackButtons();
    setupFloatingHome();

    setupServiceButtons();
    setupOrderServiceButtons();
    setupPlanButtons();

    setupOrderNavigation();
    setupSupportButtons();

    setupContactValidation();
    setupOrderForm();

    setupModal();
    setupMobileBehaviour();
    setupResetButtons();
    setupWindowEvents();

    setupHash();

    console.log(
      'Gym Growth HQ — navigation initialized.'
    );
  }

  if (
    document.readyState === 'loading'
  ) {
    document.addEventListener(
      'DOMContentLoaded',
      initializeApp,
      { once: true }
    );
  } else {
    initializeApp();
  }// ============================================================
// GYM GROWTH HQ
// FINAL SAFETY + INITIALIZATION
// ============================================================

document.addEventListener('click', event => {
  const button = event.target.closest('button');

  if (!button) return;

  // Prevent accidental double-clicks
  if (button.dataset.processing === 'true') {
    event.preventDefault();
    return;
  }

  // Only protect buttons that actually perform an action
  if (
    button.matches(
      '.nav-item, [data-screen], [data-service], [data-plan], [data-back], [data-order-service], [data-order-next], [data-order-go-step], [data-support]'
    )
  ) {
    button.dataset.processing = 'true';

    setTimeout(() => {
      delete button.dataset.processing;
    }, 300);
  }
});

// Keep the app at the correct screen after refresh
window.addEventListener('load', () => {
  const hash =
    window.location.hash
      .replace('#', '')
      .trim();

  if (hash && getScreen(hash)) {
    showScreen(hash, false);
  } else {
    showScreen('home', false);
  }
});

// Keyboard accessibility
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;

  const modal = one('#infoModal');

  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute(
      'aria-hidden',
      'true'
    );
  }
});

// Final application status
console.log(
  'Gym Growth HQ is ready.'
);

})();
/* =========================================================
   FINAL NAVIGATION FIX — PART 1/5
   MAIN SCREEN ROUTING
   ========================================================= */

(function () {
    "use strict";

    const MAIN_SCREENS = [
        "home",
        "services",
        "pricing",
        "order",
        "support"
    ];

    function finalGetScreen(name) {
        if (typeof getScreen === "function") {
            return getScreen(name);
        }

        const byId = document.getElementById(name);

        if (byId) {
            return byId;
        }

        return document.querySelector(
            `.app-screen[data-screen-section="${name}"],
             .app-screen[data-detail-section="${name}"],
             .app-screen[data-plan-detail-section="${name}"],
             .app-screen[data-support-section="${name}"]`
        );
    }

    function finalGoToScreen(name) {
        const target = finalGetScreen(name);

        if (!target) {
            console.warn(
                "Final navigation: screen not found:",
                name
            );
            return false;
        }

        if (typeof showScreen === "function") {
            showScreen(name);
            return true;
        }

        document
            .querySelectorAll(".app-screen")
            .forEach(screen => {
                screen.classList.remove(
                    "active-screen"
                );

                screen.setAttribute(
                    "aria-hidden",
                    "true"
                );
            });

        target.classList.add(
            "active-screen"
        );

        target.setAttribute(
            "aria-hidden",
            "false"
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        return true;
    }

    function finalSetSelectedService(service) {
        if (
            typeof normalizeServiceKey ===
            "function"
        ) {
            service =
                normalizeServiceKey(service);
        }

        if (
            typeof AppState !== "undefined"
        ) {
            AppState.selectedService =
                service;
        }

        if (
            typeof updateSelectedServiceUI ===
            "function"
        ) {
            updateSelectedServiceUI();
        }

        if (
            typeof prepareOrderForm ===
            "function"
        ) {
            prepareOrderForm();
        }
      /* =========================================================
   FINAL NAVIGATION FIX — PART 2/5
   SERVICE + PRICING → ORDER
   ========================================================= */

    function finalOpenOrder(service) {
        finalSetSelectedService(service);

        finalGoToScreen("order");

        /*
         * Every new order starts from Step 1.
         * The user can then select/change the service.
         */
        if (
            typeof setOrderStep ===
            "function"
        ) {
            setOrderStep(1);
        }
    }

    function finalOpenPlan(plan) {
        if (
            typeof AppState !==
            "undefined"
        ) {
            AppState.selectedPlan =
                plan;
        }

        /*
         * Pricing → Plan Details
         */
        finalGoToScreen(
            `plan-${plan}`
        );
    }

    function finalSetupOrderLinks() {

        /*
         * SERVICE / DETAIL → ORDER
         */
        document
            .querySelectorAll(
                '[data-screen="order"][data-plan]'
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();
                        event.stopPropagation();

                        finalOpenOrder(
                            this.dataset.plan
                        );
                    }
                );
            });

        /*
         * Older order attribute used
         * by the existing HTML.
         */
        document
            .querySelectorAll(
                "[data-open-order]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();
                        event.stopPropagation();

                        finalOpenOrder(
                            this.dataset.openOrder
                        );
                    }
                );
            });

        /*
         * PRICING → PLAN DETAILS
         */
        document
            .querySelectorAll(
                "[data-plan-detail]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();
                        event.stopPropagation();

                        finalOpenPlan(
                            this.dataset.planDetail
                        );
                    }
                );
            });
    }

    /*
     * Prevent duplicate initialization.
     */
    if (
        !window.__GYM_FINAL_ORDER_LINKS__
    ) {

        window.__GYM_FINAL_ORDER_LINKS__ =
            true;

        if (
            document.readyState ===
            "loading"
        ) {

            document.addEventListener(
                "DOMContentLoaded",
                finalSetupOrderLinks,
                {
                    once: true
                }
            );

        } else {

            finalSetupOrderLinks();
        }
              }
      /* =========================================================
   FINAL NAVIGATION FIX — PART 3/5
   ORDER STEP FLOW
   ========================================================= */

    function finalSetOrderStep(step) {

        const steps = document.querySelectorAll(
            ".order-step"
        );

        if (!steps.length) {
            return;
        }

        const stepNumber =
            Number(step);

        steps.forEach(
            orderStep => {

                const isActive =
                    Number(
                        orderStep.dataset.orderStep
                    ) === stepNumber;

                orderStep.classList.toggle(
                    "active-order-step",
                    isActive
                );

                orderStep.setAttribute(
                    "aria-hidden",
                    isActive
                        ? "false"
                        : "true"
                );
            }
        );

        /*
         * Update progress indicator.
         */
        document
            .querySelectorAll(
                "[data-progress-step]"
            )
            .forEach(progressStep => {

                const number =
                    Number(
                        progressStep.dataset
                            .progressStep
                    );

                progressStep.classList.toggle(
                    "active-progress",
                    number <= stepNumber
                );
            });

        /*
         * Always start the selected step
         * from the top.
         */
        const orderScreen =
            finalGetScreen("order");

        if (orderScreen) {
            orderScreen.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        if (
            typeof AppState !==
            "undefined"
        ) {
            AppState.currentOrderStep =
                stepNumber;
        }
    }


    function finalSetupOrderSteps() {

        /*
         * NEXT buttons
         */
        document
            .querySelectorAll(
                "[data-order-next]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();
                        event.stopPropagation();

                        const nextStep =
                            Number(
                                this.dataset
                                    .orderNext
                            );

                        if (!nextStep) {
                            return;
                        }

                        finalSetOrderStep(
                            nextStep
                        );
                    }
                );
            });


        /*
         * BACK / CHANGE buttons
         */
        document
            .querySelectorAll(
                "[data-order-go-step]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();
                        event.stopPropagation();

                        const step =
                            Number(
                                this.dataset
                                    .orderGoStep
                            );

                        if (!step) {
                            return;
                        }

                        finalSetOrderStep(
                            step
                        );
                    }
                );
            });


        /*
         * Service selection:
         * selecting a service moves directly
         * to Step 2.
         */
        document
            .querySelectorAll(
                "[data-order-service]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();
                        event.stopPropagation();

                        const service =
                            this.dataset
                                .orderService;

                        if (!service) {
                            return;
                        }

                        finalSetSelectedService(
                            service
                        );

                        finalSetOrderStep(
                            2
                        );
                    }
                );
            });
    }


    if (
        !window.__GYM_FINAL_ORDER_STEPS__
    ) {

        window.__GYM_FINAL_ORDER_STEPS__ =
            true;

        if (
            document.readyState ===
            "loading"
        ) {

            document.addEventListener(
                "DOMContentLoaded",
                finalSetupOrderSteps,
                {
                    once: true
                }
            );

        } else {

            finalSetupOrderSteps();
        }
                          }
      /* =========================================================
   FINAL NAVIGATION FIX — PART 4/5
   MOBILE SCREEN + SWIPE NAVIGATION
   ========================================================= */

    const FINAL_SCREEN_ORDER = [
        "home",
        "services",
        "pricing",
        "order",
        "support"
    ];

    function finalCurrentMainIndex() {

        if (
            typeof AppState ===
            "undefined"
        ) {
            return 0;
        }

        const index =
            FINAL_SCREEN_ORDER.indexOf(
                AppState.currentScreen
            );

        return index >= 0
            ? index
            : 0;
    }


    function finalSwipeTo(
        direction
    ) {

        const currentIndex =
            finalCurrentMainIndex();

        let nextIndex =
            currentIndex + direction;

        if (
            nextIndex < 0 ||
            nextIndex >=
                FINAL_SCREEN_ORDER.length
        ) {
            return;
        }

        const nextScreen =
            FINAL_SCREEN_ORDER[
                nextIndex
            ];

        finalGoToScreen(
            nextScreen
        );
    }


    function finalSetupSwipe() {

        let startX = 0;
        let startY = 0;

        document.addEventListener(
            "touchstart",
            function (event) {

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
            function (event) {

                if (
                    event.changedTouches.length !== 1
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
                 * Ignore normal vertical
                 * scrolling.
                 */
                if (
                    Math.abs(deltaX) <
                    Math.abs(deltaY)
                ) {
                    return;
                }


                /*
                 * Small movement is not
                 * considered a swipe.
                 */
                if (
                    Math.abs(deltaX) < 80
                ) {
                    return;
                }


                /*
                 * Ignore swipe while typing.
                 */
                const active =
                    document.activeElement;

                if (
                    active &&
                    (
                        active.tagName ===
                            "INPUT" ||
                        active.tagName ===
                            "TEXTAREA" ||
                        active.tagName ===
                            "SELECT"
                    )
                ) {
                    return;
                }


                /*
                 * Swipe left → next screen
                 * Swipe right → previous screen
                 */
                if (deltaX < 0) {
                    finalSwipeTo(1);
                } else {
                    finalSwipeTo(-1);
                }
            },
            {
                passive: true
            }
        );
    }


    /*
     * Keep each main screen starting
     * from the top.
     */
    function finalSetupScreenScrollReset() {

        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        ".nav-item"
                    );

                if (!button) {
                    return;
                }

                setTimeout(
                    function () {

                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });

                    },
                    30
                );
            }
        );
    }


    if (
        !window.__GYM_FINAL_SWIPE__
    ) {

        window.__GYM_FINAL_SWIPE__ =
            true;

        if (
            document.readyState ===
            "loading"
        ) {

            document.addEventListener(
                "DOMContentLoaded",
                function () {

                    finalSetupSwipe();
                    finalSetupScreenScrollReset();

                },
                {
                    once: true
                }
            );

        } else {

            finalSetupSwipe();
            finalSetupScreenScrollReset();
        }
    }
      /* =========================================================
   FINAL NAVIGATION FIX — PART 5/5
   FINAL INITIALIZATION + SAFETY
   ========================================================= */

    function finalInitializeFix() {

        /*
         * Make sure Home is the first screen.
         */
        const current =
            typeof AppState !== "undefined"
                ? AppState.currentScreen
                : "home";

        if (
            !current ||
            !finalGetScreen(current)
        ) {
            finalGoToScreen("home");
        }


        /*
         * Make Order always start
         * from Step 1 when opened
         * directly from navigation.
         */
        document
            .querySelectorAll(
                '.nav-item[data-screen="order"]'
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function () {

                        setTimeout(
                            function () {

                                finalSetOrderStep(
                                    1
                                );

                            },
                            50
                        );
                    }
                );
            });


        /*
         * When Pricing is opened,
         * show Pricing from the top.
         */
        document
            .querySelectorAll(
                '.nav-item[data-screen="pricing"]'
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function () {

                        setTimeout(
                            function () {

                                window.scrollTo({
                                    top: 0,
                                    behavior: "smooth"
                                });

                            },
                            50
                        );
                    }
                );
            });


        /*
         * When Services is opened,
         * show Services from the top.
         */
        document
            .querySelectorAll(
                '.nav-item[data-screen="services"]'
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function () {

                        setTimeout(
                            function () {

                                window.scrollTo({
                                    top: 0,
                                    behavior: "smooth"
                                });

                            },
                            50
                        );
                    }
                );
            });
    }


    /*
     * Initialize after DOM is ready.
     */
    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            finalInitializeFix,
            {
                once: true
            }
        );

    } else {

        finalInitializeFix();
    }


    /*
     * Public emergency helpers.
     * Useful if a button needs to open
     * a screen directly later.
     */
    window.GymGrowthFinalFix = {

        home: function () {
            finalGoToScreen("home");
        },

        services: function () {
            finalGoToScreen("services");
        },

        pricing: function () {
            finalGoToScreen("pricing");
        },

        order: function (service) {
            finalOpenOrder(service);
        },

        support: function () {
            finalGoToScreen("support");
        },

        nextOrderStep: function () {

            const current =
                typeof AppState !== "undefined"
                    ? Number(
                        AppState.currentOrderStep
                    )
                    : 1;

            finalSetOrderStep(
                Math.min(
                    current + 1,
                    3
                )
            );
        },

        previousOrderStep: function () {

            const current =
                typeof AppState !== "undefined"
                    ? Number(
                        AppState.currentOrderStep
                    )
                    : 1;

            finalSetOrderStep(
                Math.max(
                    current - 1,
                    1
                )
            );
        }
    };


    console.log(
        "Gym Growth HQ — Final navigation fix loaded."
    );

})();
    }   
