var firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "PROJECT_ID.firebaseapp.com",
    databaseURL: "https://PROJECT_ID.firebaseio.com",
    projectId: "PROJECT_ID",
    storageBucket: "PROJECT_ID.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID",
    measurementId: "G-MEASUREMENT_ID",
};

function GET($PATH) {
    var query = firebase.database($PATH);
    query.once("value").then(function (snapshot) {
        if (snapshot.exists()) {
            snapshot.foreach(function (childSnapshot) {
                var key = childSnapshot.key;
                var childData = childSnapshot.val();

            });
        } else {
            console.log("No Data Exists!");
        }

    });
}

function INSERT($PATH, $DATA) {
    var query = firebase.database($PATH).update($DATA);
}

function DELETE($PATH) {
    var query = firebase.database($PATH);
    query.remove();
}

function SORT(data,prop) {
    return new Map([...data.entries()].sort((a, b) => a[1][prop] > b[1][prop]));
}