(function() {
  var newNote = document.querySelector('#note-text');
  var saveButton = document.querySelector('#save');
  var notes = document.querySelector('#notes');
  var contacts = document.querySelector('#contacts');
  var retrievingLocation = document.querySelector('#retrieving-location');

  window.NotesDb = [];

	function getContacts() {
		if (!('mozContacts' in navigator)) {
			return;
		}

		var req = window.navigator.mozContacts.getAll();

		req.onsuccess = function() {
			if (!this.result) return;

			var option = document.createElement('option');
			option.textContent = (this.result.givenName || '') + ' ' + (this.result.familyName || '');
			contacts.appendChild(option);

			this.continue();
		};

		req.onerror = function() {
			console.error('Could not receive contacts!', req.error);
		};
	}
  getContacts();

  function render() {
    window.NotesDb.forEach(function(n) {
      if (n.element) return;

      var newItem = document.createElement('li');

      if (n.location) {
        var coords = n.location.latitude + ',' + n.location.longitude;
        var aside = '<aside class="pack-end"><img src=https://maps.google.com/' +
          'maps/api/staticmap?size=100x100&sensor=false&zoom=13&center=' +
          coords + '></aside>';
        newItem.innerHTML += aside;
      }

      var a = document.createElement('a');
      a.href = '#';
      a.onclick = function() { return false; };

      var noteEl = document.createElement('p');
      noteEl.textContent = n.note;
      var contactEl = document.createElement('p');
      contactEl.textContent = n.contact;
      a.appendChild(noteEl);
      a.appendChild(contactEl);
      newItem.appendChild(a);
      notes.appendChild(newItem);

      n.element = newItem;
    });

    notes.classList.toggle('no-items', window.NotesDb.length === 0);
  }

  saveButton.addEventListener('click', function() {
    saveButton.disabled = 'disabled';
    retrievingLocation.classList.add('visible');

    function store(note, contact, location) {
      window.NotesDb.push({
        note: note,
        contact: contact,
        location: location
      });

      saveButton.removeAttribute('disabled');
      retrievingLocation.classList.remove('visible');

      newNote.value = '';
      render();
    }

    navigator.geolocation.getCurrentPosition(function(position) {
      store(newNote.value, contacts.value, position.coords);
    }, function() {
      store(newNote.value, contacts.value, null);
    }, {
      enableHighAccuracy: false,
      maximumAge: 1800000 // 30 minutes
    });
  });

  notes.addEventListener('click', function(e) {
    var target = e.target;
    while (!(target instanceof HTMLLIElement))
      target = target.parentNode;

    var items = window.NotesDb.filter(function(n) {
      return n.element === target;
    });

    if (items.length === 0) return;

    window.renderDetail(items[0]);
    document.body.classList.remove('list');
    document.body.classList.add('detail');
  });

  notes.addEventListener('contextmenu', function(e) {
    var deleteNote = document.querySelector('#delete-note');
    var cancel = deleteNote.querySelector('.cancel');
    var confirm = deleteNote.querySelector('.delete');

    var target = e.target;
    while (!(target instanceof HTMLLIElement))
      target = target.parentNode;

    deleteNote.style.display = 'block';
    cancel.onclick = function() {
      deleteNote.style.display = 'none';
    };
    confirm.onclick = function() {
      target.parentNode.removeChild(target);
      var ix = window.NotesDb.reduce( function(cur, val, index) {
        if(val.element === target && cur === -1 ) {
          return index;
        }
        return cur;
      }, -1);
      window.NotesDb.splice(ix, 1);
      deleteNote.style.display = 'none';
    };
    return false;
  });
})();
