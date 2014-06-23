(function() {
  var newNote = document.querySelector('#note-text');
  var saveButton = document.querySelector('#save');
  var notes = document.querySelector('#notes');
  var contacts = document.querySelector('#contacts');

  window.NotesDb = [];

	function getContacts() {
		if (!('mozContacts' in navigator)) {
			return;
		}

		var req = window.navigator.mozContacts.getAll();

		req.onsuccess = function() {
			if (!this.result) return;

			var option = document.createElement('option');
			option.textContent = this.result.givenName + ' ' + this.result.familyName;
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
      newItem.textContent = n.note;
      notes.appendChild(newItem);

      n.element = newItem;
    });

    notes.classList.toggle('no-items', window.NotesDb.length === 0);
  }

  saveButton.addEventListener('click', function() {
    function store(note, contact, location) {
      window.NotesDb.push({
        note: note,
        contact: contact,
        location: location
      });

      newNote.value = '';
      render();
    }

    navigator.geolocation.getCurrentPosition(function(position) {
      store(newNote.value, contacts.value, position.coords);
    }, function() {
      store(newNote.value, contacts.value, null);
    });
  });

  notes.addEventListener('click', function(e) {
    var items = window.NotesDb.filter(function(n) {
      return n.element === e.target;
    });

    if (items.length === 0) return;

    window.renderDetail(items[0]);
    document.body.classList.remove('list');
    document.body.classList.add('detail');
  });
})();
