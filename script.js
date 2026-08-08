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
   
