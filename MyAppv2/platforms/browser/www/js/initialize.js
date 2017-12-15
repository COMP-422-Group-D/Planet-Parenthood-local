function go(){var req = window.indexedDB.open("gameDatabase", 1), db;
req.onerror=function(e){console.log('Error')};
req.onsuccess = function(e){db=e.target.result;};
req.onupgradeneeded = function(e){
    var db = e.target.result;
		var store = db.createObjectStore("myobjectStore", {keyPath: "id"});
	  
		var tx = e.target.transaction;
		var store = tx.objectStore("myobjectStore");
		

		// Add some data
		store.put({"id": 1, "rating": "soldier", "score": 0});
		
		
		// Query the data
		var getUserData = store.get(1);

		getUserData.onsuccess = function() {
			console.log(getUserData.result.score);  
		};
}}
go();