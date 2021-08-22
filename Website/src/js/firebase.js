//Initialize Config
firebase.initializeApp(firebaseConfig);
firebase.analytics();

function GET($PATH) {
  
    var query = firebase.database().ref($PATH);
    query.on("value", snap => {
      
      sessionStorage.setItem("Data", JSON.stringify(snap.val()));
    });

  
    return JSON.parse(sessionStorage.getItem("Data"));

}

function SET($PATH, $DATA) {
    var query = firebase.database().ref($PATH).set($DATA);
}

function DELETE($PATH) {
    var query = firebase.database().ref($PATH);
    query.remove();
}

function SORT(data, prop) {
    return new Map([...data.entries()].sort((a, b) => a[1][prop] > b[1][prop]));
}

console.log(GET("User/USER00001"));