(function() {
  var header = document.querySelector('#detail-header .title');
  var contact = document.querySelector('#detail-contact');
  var map = document.querySelector('#detail-map');
  var note = document.querySelector('#detail-note');
  var backButton = document.querySelector('#detail-header .back');

  window.renderDetail = function render(item) {
    header.textContent = item.note;

    contact.hidden = item.contact === '';
    contact.textContent = item.contact;

    if (item.location) {
      var coords = item.location.latitude + ',' + item.location.longitude;

      map.src = 'https://maps.google.com/maps/api/staticmap?size=' +
        window.innerWidth + 'x240&sensor=false&zoom=13&center=' +
        coords + '&markers=color:red|' + coords;
    }

    map.hidden = item.location === null;

    note.textContent = item.note;
  };

  backButton.addEventListener('click', function() {
    document.body.classList.remove('detail');
    document.body.classList.add('list');
  });
})();
