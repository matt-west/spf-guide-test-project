window.addEventListener('DOMContentLoaded', function () {

  var links = document.querySelectorAll('.js-open-chat');
  var emailLink = document.querySelector('.js-send-email');

  function setChatStatus(status) {
    Array.prototype.forEach.call(links, function (link) {
      if (status === 'online') {
        Helpers.removeClass(link, 'hidden');
        Helpers.addClass(emailLink, 'hidden');
      } else {
        Helpers.addClass(link, 'hidden');
        Helpers.removeClass(emailLink, 'hidden');
      }
    });
  }

  Array.prototype.forEach.call(links, function (link) {
    link.addEventListener('click', function (evt) {
      evt.preventDefault();
      if (typeof olark !== 'undefined') {
        olark('api.box.expand');
      }
    }, false);
  });

  window.addEventListener('olark:ready', function () {
    olark.extend(function (api) {
      api.chat.onOperatorsAvailable(function () {
        setChatStatus('online');
      });

      api.chat.onOperatorsAway(function () {
        setChatStatus('offline');
      });

      api.chat.onOperatorsBusy(function () {
        setChatStatus('offline');
      });

      if (api.chat.operatorsAreAway()) {
        setChatStatus('offline');
      }
    });
  }, false);

  // Set to offline otherwise
  setChatStatus('offline');

}, false);
