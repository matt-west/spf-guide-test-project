window.addEventListener('DOMContentLoaded', function () {

  var cookies = document.cookie.split('; ').map(function(e) { return e.split('=') }).reduce(function(a, e) { a[e[0]] = e[1]; return a }, {});

  var d = new Date();
  d.setTime(d.getTime() + (7*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();

  if (document.referrer && !cookies['referral_url']) document.cookie = 'referral_url=' + encodeURIComponent(document.referrer) + '; path=/; domain=.postmarkapp.com; ' + expires;
  if (!cookies['landing_url']) document.cookie = 'landing_url=' + encodeURIComponent(document.location.href) + '; path=/; domain=.postmarkapp.com; ' + expires;

}, false);
