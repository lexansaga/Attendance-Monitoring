var table = $('#table_id');
var btnSubmit = $('#submit');
var chkOverallPermission = $('#overall');
$(document).ready(function () {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            let uid = user.uid;
            firebase
                .database()
                .ref(`User/${uid}/`)
                .once('value', (snap) => {
                    let Account_Type = snap.child('Account_Type').val();
                    let ID = snap.child('ID').val();
                    let Role = snap.child('Role').val();
                    let UserID = snap.child('UserID').val();
                    let Notification = snap.child('Notification').val();
                    let Permission_Tapin = snap
                        .child('Permission')
                        .child('TapIn_First')
                        .val();

                    if (Account_Type.includes('Administrator')) {
                        //window.location.replace("main.html");
                    } else if (Account_Type.includes('Faculty')) {
                        window.location.replace('main.html');
                    } else if (Account_Type.includes('Guidance')) {
                        window.location.replace('main.html');
                    } else {
                        // Else
                        window.location.replace('index.html');
                    }
                });
        }
    });

    // DATATABLE INITIALIZATION
    table.DataTable({ paging: false,
        searching:false});

    //Load Faculty Permission Attendance
    firebase
        .database()
        .ref('Data/Faculty/Information/')
        .once('value', (faculties) => {
            faculties.forEach((faculty) => {
                let id = faculty.child('ID').val();
                let firstname = faculty.child('Name').child('First').val();
                let middlename = faculty
                    .child('Name')
                    .child('Middle')
                    .val();
                let lastname = faculty.child('Name').child('Last').val();

                let permission = faculty
                    .child('Permission')
                    .child('AllowAttendance')
                    .val();
                let permissionTapIn = faculty
                    .child('Permission')
                    .child('TapIn_First')
                    .val();

                console.log(permission);

                table.DataTable()
                    .row.add([
                        id,
                        `${lastname}, ${firstname} ${middlename}`,
                        `<input data-allow="${id}" type="checkbox" class="table_input" ${
                                   permission == true
                                        ? 'checked="checked"'
                                        : ''
                              }>`,
                        `<input data-tapin="${id}" type="checkbox" class="table_input" ${
                            permissionTapIn == true
                                     ? 'checked="checked"'
                                     : ''
                           }>`
                    ])
                    .draw();
            });
        });


    //Load Overall Permission Attendance

    firebase.database().ref('Data/GlobalPermission/').once('value', permission => {
        let isAllow = permission.child('NoClassToday').val()
        //  alert(isAllow)
        chkOverallPermission.prop('checked', isAllow == true ? 'checked' : '')
    })
});

btnSubmit.on('click', function () {


    SaveFacultyPermission()
    SaveOverallPermission(chkOverallPermission.is(':checked'))

    alert('Permission save successfully!');
});

function SaveFacultyPermission() {

    table.DataTable().rows().every(function () {
        var row = this.data();
        var id = row[0]
        var name = row[1]
        var isAllowedAttendance = $(`input[data-allow=${id}]`).is(':checked')
        var isTapin = $(`input[data-tapin=${id}]`).is(':checked')

        firebase.database().ref(`Data/Faculty/Information/${id}/Permission/`).update({
            AllowAttendance: isAllowedAttendance
        });

        firebase.database().ref(`Data/Faculty/Information/${id}/Permission/`).update({
            TapIn_First : isTapin
        });

        firebase.database().ref(`User/`).orderByChild('UserID').startAt(id).endAt(id).once('value', (faculties) => {
            faculties.forEach(faculty => {
                let facultyID = faculty.child('UserID').val()
                let ID = faculty.child('ID').val()

                firebase.database().ref(`User/${ID}/Permission/`).update({
                    AllowAttendance: isAllowedAttendance
                });

                firebase.database().ref(`User/${ID}/Permission/`).update({
                    TapIn_First : isTapin
                });

            })
        })
        console.log(isAllowedAttendance)

    });

}

function SaveOverallPermission(overall) {
    firebase.database().ref(`Data/GlobalPermission/`).update({
        NoClassToday: overall
    })
}