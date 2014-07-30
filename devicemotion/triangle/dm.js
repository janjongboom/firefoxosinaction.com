(function() {
  if (!('DeviceMotionEvent' in window)) {
    return console.error('No device motion');
  }

  var state = '';

  window.addEventListener('devicemotion', function(ev) {
    var acc = ev.accelerationIncludingGravity;
    if (acc.z > 9) {
      if (state === 'down') {
        navigator.vibrate(200);
      }
      state = 'up';
    }
    else if (acc.z < -9) {
      if (state === 'up') {
        navigator.vibrate(200);
      }
      state = 'down';
    }
  });
})();
