(function() {
  if (!window.DeviceOrientationEvent) {
    return console.error('No support for device orientation');
  }

  window.addEventListener('deviceorientation', function(ev) {
    var tiltLR = ev.gamma;

    document.querySelector('#land').style.transform = 'rotate(' + tiltLR + 'deg)';
  });
})();
