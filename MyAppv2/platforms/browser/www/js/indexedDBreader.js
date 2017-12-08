var db;
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;


var DBOpenRequest = window.indexedDB.open("MyDatabase", 1);

DBOpenRequest.onsuccess = function(event) {

  // store the result of opening the database in the db variable.
  // This is used a lot below
  db = DBOpenRequest.result;
    
  // Run the getData() function to get the data from the database
  getData();
};

function getData() {
  // open a read/write db transaction, ready for retrieving the data
  var transaction = db.transaction(["MyObjectStore"], "readwrite");

  // create an object store on the transaction
  var objectStore = transaction.objectStore("MyObjectStore");

  // Make a request to get a record by key from the object store
  var objectStoreRequest = objectStore.get(1);

  objectStoreRequest.onsuccess = function(event) {
   
    var myScore = objectStoreRequest.result.score;
	var myRating = objectStoreRequest.result.rating;
	$("#whoPlaysMessage").html("Score: "+myScore+"        Rating: "+myRating);
	
	console.log(myRecord);
  };

};