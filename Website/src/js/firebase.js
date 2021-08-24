//Initialize Config
//Config
var firebaseConfig = {
    apiKey: "AIzaSyC3-mndhgpckYObAr23oH9s2_mDOnqtRaE",
    authDomain: "attendancemonitoringsystem-00.firebaseapp.com",
    databaseURL: "https://attendancemonitoringsystem-00-default-rtdb.firebaseio.com",
    projectId: "attendancemonitoringsystem-00",
    storageBucket: "attendancemonitoringsystem-00.appspot.com",
    messagingSenderId: "782052298274",
    appId: "1:782052298274:web:207c8b25cffae05e36047b",
    measurementId: "G-P53BX41RFX"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();


class Firebase {
    static Database = class Database {

        constructor(){}

        static GET(Path) {

            var query = firebase.database().ref(Path);
            query.on("value", snap => {

                sessionStorage.setItem("Data", JSON.stringify(snap.val()));
            });

            return JSON.parse(sessionStorage.getItem("Data"));

        }

    

        static SET(Path, Data) {
            var query = firebase.database().ref(Path);
            query.set(Data)
        }

        static PUSH(Path, Data) {
            var key = firebase.database().ref(Path).push().key;
            this.SET(Path+"/"+key,Data);
        }

        static DELETE(Path) {
            var query = firebase.database().ref(Path);
            query.remove();
        }
    }
    static Storage = class Storage {
        static GET() {

        }
        static UPLOAD() {

        }
        static DOWNLOAD() {
            return window.location.href = $PATH;
        }

    }
    static Authentication = class Authentication {

        CURRENT_USER;



        CREATE_ACCOUNT(Email, Password) {
            firebase.auth().createUserWithEmailAndPassword(Email, Password)
                .then((userCredential) => {
                    sessionStorage.setItem("CREATE_ACCOUNT_STATUS", "Success");
                })
                .catch((error) => {
                    var errorCode = error.errorCode;
                    var errorMessage = error.errorMessage;
                    if (errorCode === 'auth/wrong-password') {
                        sessionStorage.setItem("CREATE_ACCOUNT_STATUS", errorCode + "," + errorMessage);
                    } else {
                        sessionStorage.setItem("CREATE_ACCOUNT_STATUS", errorCode + "," + errorMessage);
                    }
                });
        }


        LOGIN_ACCOUNT(Email, Password) {
            firebase.auth().signInWithEmailAndPassword(Email, Password)
                .then((userCredential) => {
                    // Signed in
                    sessionStorage.setItem("LOGIN_STATUS", "Success");
                })
                .catch((error) => {
                    var errorCode = error.errorCode;
                    var errorMessage = error.errorMessage;
                    if (errorCode === 'auth/wrong-password') {
                        sessionStorage.setItem("LOGIN_STATUS", errorCode + "," + errorMessage);
                    } else {
                        sessionStorage.setItem("LOGIN_STATUS", errorCode + "," + errorMessage);
                    }
                });

            this.CURRENT_USER = firebase.auth().currentUser;

            return sessionStorage.getItem("LOGIN_STATUS");
        }


        CHANGE_PASSWORD(Password) {
            this.CURRENT_USER.updatePassword($PASSWORD).then(() => {
                sessionStorage.setItem("CHANGE_PASSWORD_STATUS", "Success");
            }).catch((error) => {
                // An error ocurred
                // ...
                var errorCode = error.errorCode;
                var errorMessage = error.errorMessage;
                sessionStorage.setItem("CHANGE_PASSWORD_STATUS", errorCode + "," + errorMessage);

            });

            return sessionStorage.getItem("CHANGE_PASSWORD_STATUS");
        }


        VERIFY_ACCOUNT() {

        }
        RESET_ACCOUNT(Email) {
            firebase.auth().sendPasswordResetEmail(Email)
                .then(() => {
                    // Password reset email sent!
                    // ..
                    sessionStorage.setItem("RESET_ACCOUNT_STATUS", "Success");
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // ..
                    sessionStorage.setItem("RESET_ACCOUNT_STATUS", errorCode + "," + errorMessage);
                });
        }
        LOGOUT() {
            if (this.CURRENT_USER) {
                firebase.auth().signOut().then(() => {
                    sessionStorage.setItem("LOGOUT_STATUS", true);
                }).catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // ..
                    sessionStorage.setItem("LOGOUT_STATUS", errorCode + "," + errorMessage);
                });
            }
            return sessionStorage.getItem("LOGOUT_STATUS");
        }
    }
}



function SORT(input, key) {
    return Object.values(input).map(value => value).sort((a, b) => a[key] - b[key]);
}



// Getting Data(Return Dictionary) 
//console.log(Firebase.Database.Get("User"));
// Setting Data with specific Referrence Firebase.Database.SET("User/USER0003",{Name:"Lexan"})
console.log(Firebase.Database.PUSH("User",{Name:"Lexan"})) ;
// Pushing Data with Random Key Firebase.Database.PUSH("User/USER0003",{Name:"Lexan"})
// Pushing Data with Random Key Firebase.Database.DELETE("User/USER0003")