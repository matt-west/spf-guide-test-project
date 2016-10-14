window.addEventListener('DOMContentLoaded', function () {
  var links = document.querySelectorAll('.js-flip-card_toggle');
  Array.prototype.forEach.call(links, function (link) {
    link.addEventListener('click', function (evt) {
      evt.preventDefault();
      var id = link.getAttribute('data-flip-card-id');
      var input = document.getElementById(id);
      input.checked = !input.checked
    }, false);
  });
})
