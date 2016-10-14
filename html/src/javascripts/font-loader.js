// Font loading based on https://www.filamentgroup.com/lab/font-events.html

(function(w){
  // If the class is already set, we're good.
  if (w.document.documentElement.className.indexOf("fonts-loaded") > -1) {
    return;
  }

  var observer = new FontFaceObserver('Rockwell W01', {
    weight: 400
  });

  observer.load().then(function () {
    w.document.documentElement.className += " fonts-loaded";
    cookie("fonts-loaded", "Rockwell W01", 7);
  });
}(this));
