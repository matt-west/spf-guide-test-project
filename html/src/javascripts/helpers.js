var Helpers = {

  hasClass: function(el, className) {
    return new RegExp(' ' + className + ' ').test(' ' + el.className + ' ');
  },

  addClass: function(el, className) {
    if (!Helpers.hasClass(el, className)) {
      el.className += ' ' + className;
    }
  },

  removeClass: function(el, className) {
    var newClass = ' ' + el.className.replace( /[\t\r\n]/g, ' ') + ' ';

    if (Helpers.hasClass(el, className)) {
      while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
        newClass = newClass.replace(' ' + className + ' ', ' ');
      }

      el.className = newClass.replace(/^\s+|\s+$/g, '');
    }
  }

};
