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
                    //window.location.replace("main.html");
                } else if (Account_Type.includes('Faculty')) {
                    window.location.replace("main.html");
                } else if (Account_Type.includes('Guidance')) {
                    window.location.replace("main.html");
                } else { // Else
                    window.location.replace("index.html");
                }
            })
        }
    })

    // DATATABLE INITIALIZATION
    $('#table_id').DataTable();
});