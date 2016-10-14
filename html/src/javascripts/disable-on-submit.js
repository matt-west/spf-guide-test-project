window.addEventListener('DOMContentLoaded', function () {
  var els = document.querySelectorAll('.js-disable-on-submit');
  Array.prototype.forEach.call(els, function (el) {
    el.addEventListener('submit', function () {
      var input = el.querySelector('input[type="submit"]')
      input.disabled = true;
      debugger
    });
  });
}, false);
