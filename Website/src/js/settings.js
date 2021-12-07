$(document).ready(function () {

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            let uid = user.uid;
            firebase.database().ref(`User/${uid}/`).once('value', snap => {
                let Account_Type = snap.child('Account_Type').val();
                let ID = snap.child('ID').val();
                let Role = snap.child('Role').val();
                let UserID = snap.child('UserID').val();
                let Notification = snap.child('Notification').val();
                let Permission_Tapin = snap.child('Permission').child('TapIn_First').val()
    
    
                if (Account_Type.includes('Administrator')) {
                   // window.location.replace("main.html");
                } else if (Account_Type.includes('Faculty')) {
                   // window.location.replace("main.html");
                } else if (Account_Type.includes('Guidance')) {
                   // window.location.replace("main.html");
                } else { // Else
                    window.location.replace("index.html");
                }
            })
        }
    })

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {


            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            let uid = user.uid;
            // console.log(uid);
            firebase.database().ref('User/' + uid).on('value', snap => {
                let Account_Type = snap.child('Account_Type').val();
                let ID = snap.child('ID').val();
                let Role = snap.child('Role').val();
                let UserID = snap.child('UserID').val();
                let Notification = snap.child('Notification').val();


                let darkMode = snap.child('Settings').child('DarkMode').val()
                let reportFrame = snap.child('Settings').child('Report').val()
              //  alert(darkMode)
                $('#switch').prop('checked', darkMode)
                $(`#report_time`).val(reportFrame)
               
            })
        }
    })
})

$('#save').on('click', function (e) {

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {


            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            let uid = user.uid;
            // console.log(uid);
            firebase.database().ref('User/' + uid).on('value', snap => {
                let Account_Type = snap.child('Account_Type').val();
                let ID = snap.child('ID').val();
                let Role = snap.child('Role').val();
                let UserID = snap.child('UserID').val();
                let Notification = snap.child('Notification').val();


                let darkMode = $('#switch').prop('checked')
                let reportFrame = $('#report_time option:selected').text();
                firebase.database().ref(`User/${ID}/`).update(
                    {
                        Settings : 
                        {
                            DarkMode : darkMode,
                            Report : reportFrame
                        }
                    })

                    firebase.database().ref(`Data/Faculty/Information/${UserID}/`).update(
                        {
                            Settings : 
                            {
                                DarkMode : darkMode,
                                Report : reportFrame
                            }
                        })       
            })
        }
    })

})