(function() {
  var currentTilt = 0;

  window.addEventListener('keypress', function(e) {
    if (e.keyCode === KeyEvent.DOM_VK_LEFT) {
      currentTilt--;
    }
    else if (e.keyCode === KeyEvent.DOM_VK_RIGHT) {
      currentTilt++;
    }

    tilt({
      gamma: currentTilt
    });
    
    e.preventDefault();
  });

  function tilt(ev) {
    var tiltLR = ev.gamma;

    document.querySelector('#land').style.transform = 'rotate(' + tiltLR + 'deg)';
  }

  if ('DeviceOrientationEvent' in window) {
    window.addEventListener('deviceorientation', tilt);
  }
})();
