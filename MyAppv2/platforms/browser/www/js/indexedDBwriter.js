function indexedDBHighscore(highScore){
	var db;
	var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

	// Open (or create) the database
	var open = indexedDB.open("MyDatabase", 1);

	// Create the schema
	open.onupgradeneeded = function() {
		var db = open.result;
		var store = db.createObjectStore("MyObjectStore", {keyPath: "id"});
	  
	};

	open.onsuccess = function() {
		// Start a new transaction
		var db = open.result;
		var tx = db.transaction("MyObjectStore", "readwrite");
		var store = tx.objectStore("MyObjectStore");
		

		// Add some data
		store.put({"id": 1, "rating": "soldier", "score": highScore});
		
		
		// Query the data
		var getUserData = store.get(1);

		getUserData.onsuccess = function() {
			console.log(getUserData.result.score);  
		};

		// Close the db when the transaction is done
		tx.oncomplete = function() {
			db.close();
		};
		console.log(store);
	}
}