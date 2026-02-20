/**
 * Вибір мови в хедері — клік по тригеру відкриває/закриває dropdown
 */
(function () {
  var trigger = document.getElementById('headerLangTrigger');
  var menu = document.getElementById('headerLangMenu');
  var dropdown = document.getElementById('headerLangDropdown');
  if (!trigger || !menu || !dropdown) return;

  function open() {
    trigger.setAttribute('aria-expanded', 'true');
    menu.removeAttribute('hidden');
    document.addEventListener('click', closeOnOutside);
  }

  function close() {
    trigger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('hidden', '');
    document.removeEventListener('click', closeOnOutside);
  }

  function closeOnOutside(e) {
    if (!dropdown.contains(e.target)) close();
  }

  trigger.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var isOpen = trigger.getAttribute('aria-expanded') === 'true';
    if (isOpen) close();
    else open();
  });

  menu.querySelectorAll('.header__lang-option').forEach(function (link) {
    link.addEventListener('click', function () {
      close();
    });
  });
})();
