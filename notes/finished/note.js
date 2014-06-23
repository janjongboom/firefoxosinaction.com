(function() {
	var newNote = document.querySelector('#note-text');
	var saveButton = document.querySelector('#save');
	var notes = document.querySelector('#notes');
	var contacts = document.querySelector('#contacts');

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


	saveButton.addEventListener('click', function() {
		function store(location) {
			var newItem = document.createElement('li');
			newItem.textContent = newNote.value;
			newItem.textContent += ' - ' + location;
			if (contacts.value) {
				newItem.textContent += '. Assigned to ' + contacts.value;
			}

			notes.appendChild(newItem);

			newNote.value = '';
			notes.classList.remove('no-items');
		}
		
	  if ('geolocation' in navigator) {
	  	navigator.geolocation.getCurrentPosition(function(position) {
	  		store(position.coords.latitude + ', ' + position.coords.longitude);
	  	}, function(err) {
	  		console.error('Failed to get user location', err);
	  		store('Could not get your location');
	  	});
	  }
	  else {
	  	store('You don\'t have GPS');
	  }
	})();
})();
