
// firebase.database.ServerValue.TIMESTAMP
// Insert Timestamp
function Login() {
    var email = $("#username").val();
    var password = $("#password").val();



    firebase
        .auth()
        .signInWithEmailAndPassword(
            email,
            password
        )
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            // window.location.href = 'main.html?userid=' + userCredential.uid;


            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    // User is signed in, see docs for a list of available properties
                    // https://firebase.google.com/docs/reference/js/firebase.User
                    let uid = user.uid;
                    firebase.database().ref('User/' + uid).on('value', snap => {
                        let Account_Type = snap.child('Account_Type').val();

                      //  localStorage.setItem("ACC_TYPE", Account_Type);
                    });
                    // ...
                } else {
                    // User is signed out
                    // ...

                }
            });

        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode + ":" + errorMessage);
            switch (errorCode) {
                case "auth/user-not-found":
                    $(".login-status")
                        .html("Wrong Username or Password")
                        .css("display", "block")
                        .css("color", "var(--red)");
                    break;
                case "auth/wrong-password":
                    $(".login-status")
                        .html("Wrong Username or Password")
                        .css("display", "block")
                        .css("color", "var(--red)");
                    break;
                case "auth/invalid-email":
                    $(".login-status")
                        .html("Invalid Username")
                        .css("display", "block")
                        .css("color", "var(--red)");
                    break;
            }
        });


}

function Signup(email, password) {
    firebase
        .auth()
        .createUserWithEmailAndPassword(email,
            password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;

            console.log(errorCode + ":" + errorMessage);

            switch (errorCode) {
                case "":
                    break;
            }
            // ..
        });
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
       
     window.location.href = 'main.html?id=' + user.uid;
        // ...
    } else {
        // User is signed out
        // ...

    }
});

// function Login() {
//     var username = $('#username').val();
//     var password = $('#password').val();
//     for (const [key, value] of Object.entries(Firebase.Database.GET("User"))) {
//         if(value.Username == username && value.Password ==  password)
//         {
//             console.log("Login Success");
//             window.location.href = 'main.html?userid=01';
//         }
//         else
//         {
//             console.log("Login Failed");
//         }

//       }
// }