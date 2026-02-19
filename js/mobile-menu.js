/**
 * Мобільне гамбургер-меню: відкриття/закриття
 */
(function () {
  function closeMenu() {
    const menuWrapper = document.querySelector('.menu-wrapper');
    const toggleBtn = document.getElementById('toggleMenu');
    if (menuWrapper) {
      menuWrapper.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
    }
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', 'Відкрити меню');
    }
  }

  function openMenu() {
    const menuWrapper = document.querySelector('.menu-wrapper');
    const toggleBtn = document.getElementById('toggleMenu');
    if (menuWrapper) {
      menuWrapper.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menu-open');
      if (window.innerWidth < 768) {
        document.body.style.overflow = 'hidden';
      }
    }
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.setAttribute('aria-label', 'Закрити меню');
    }
  }

  function handleMenuButtonClick(event) {
    event.preventDefault();
    event.stopPropagation();
    const menuWrapper = document.querySelector('.menu-wrapper');
    if (!menuWrapper) return;

    const isOpen = menuWrapper.getAttribute('aria-hidden') === 'false';
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function init() {
    const toggleBtn = document.getElementById('toggleMenu');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', handleMenuButtonClick);
    }

    // Закрити при кліку на оверлей
    const overlay = document.getElementById('menuOverlay');
    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    // Закрити при Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
        closeMenu();
      }
    });

    // Закрити при кліку на посилання в меню (для навігації)
    const menuLinks = document.querySelectorAll('.menu-wrapper .header-menu .menu a[href]');
    menuLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth < 768) {
          closeMenu();
        }
      });
    });

  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
