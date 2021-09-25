//Initialize Config
//Config
function addScript(src) {
    var script = document.createElement('script');
    script.setAttribute('src', src);
    script.setAttribute('async', true)
    document.body.append(script);
}
// <!-- Insert these scripts at the bottom of the HTML, but before you use any Firebase services -->

//  <!-- Firebase App (the core Firebase SDK) is always required and must be listed first -->

// addScript("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");

//    <!-- If you enabled Analytics in your project, add the Firebase SDK for Analytics -->
//addScript("https://www.gstatic.com/firebasejs/8.10.0/firebase-analytics.js");

//    <!-- Add Firebase products that you want to use -->
// addScript("https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js");

//addScript("https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js");

// addScript("https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js");



class Firebase {
    static Database = class Database {

        constructor() {}

        static GET(Path) {

            var query = firebase.database().ref(Path);
            query.once("value", snap => {


                sessionStorage.setItem("Data", JSON.stringify(snap.val()));

            });

            return JSON.parse(sessionStorage.getItem("Data"));

        }
        static async COUNT(Path) {
            var query = firebase.database().ref(Path);
            var async = query.once("value").then();
            console.log(async.val());
            return  async;

        }
        static SET(Path, Data) {
            var query = firebase.database().ref(Path);
            query.set(Data)
        }

        static PUSH(Path, Data) {
            var key = firebase.database().ref(Path).push().key;
            this.SET(Path + "/" + key, Data);
        }

        static DELETE(Path) {
            var query = firebase.database().ref(Path);
            query.remove();
        }
    }
    static Storage = class Storage {
        static GET() {

        }

        static async UPLOAD(Path, File) {
            var storageRef = firebase.storage().ref(Path);
            await storageRef.put(File).then();
            alert('File Added Successfully');
        }
        
        static DOWNLOAD(PATH) {
            // Create a reference to the file we want to download
            var storageRef = firebase.storage().ref(PATH);

            // Get the download URL
            storageRef.getDownloadURL()
                .then((url) => {
                    // Insert url into an <img> tag to "download"
                    var link = document.createElement("a");
                    // If you don't know the name or want to use
                    // the webserver default set name = ''
                    link.setAttribute('download', '');
                    link.href = url;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                })
                .catch((error) => {
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case 'storage/object-not-found':
                            // File doesn't exist
                            break;
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;
                        case 'storage/canceled':
                            // User canceled the upload
                            break;

                            // ...

                        case 'storage/unknown':
                            // Unknown error occurred, inspect the server response
                            break;
                    }
                });

        }

        static LOADIMAGE(PATH, Image) {
            // Create a reference to the file we want to download
            var storageRef = firebase.storage().ref(PATH);

            // Get the download URL
            storageRef.getDownloadURL()
                .then((url) => {
                    // Insert url into an <img> tag to "download"
                    Image.src = url;
                    console.log(url);
                })
                .catch((error) => {
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case 'storage/object-not-found':
                            // File doesn't exist
                            break;
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;
                        case 'storage/canceled':
                            // User canceled the upload
                            break;

                            // ...

                        case 'storage/unknown':
                            // Unknown error occurred, inspect the server response
                            break;
                    }
                });

        }

    }
    static Authentication = class Authentication {

        CURRENT_USER;

        static CREATE_ACCOUNT(Email, Password) {
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


        static LOGIN_ACCOUNT(Email, Password) {
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


        static CHANGE_PASSWORD(Password) {
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


        static VERIFY_ACCOUNT() {

        }
        static RESET_ACCOUNT(Email) {
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
        static LOGOUT() {
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
//console.log(Firebase.Database.PUSH("User", {
//  Name: "Lexan"
//}));
// Pushing Data with Random Key Firebase.Database.PUSH("User/USER0003",{Name:"Lexan"})
// Pushing Data with Random Key Firebase.Database.DELETE("User/USER0003")