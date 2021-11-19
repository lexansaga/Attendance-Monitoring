$('.UserInformation_wrapper').css('display', 'none');
var tableUserSched = $('#userSchedule');
$(document).ready(function () {
    $('.js-example-basic-single').select2();
    $('#look').select2({
        width: '90%',
        margin: '10px 10px 0 0',
    });

    $('#userType').select2({
        width: '90%',
        margin: '10px 10px 0 0',
    });

    LoadSearch('Professor');

    tableUserSched.DataTable({
        "dom": 'B<lf<t>ip>',
        "buttons":['excel','pdf','print'],
        "paging": true,
        "info": true,
        "lengthMenu": [[10, 20, 30, -1], [10, 20, 30, "All"]]
    });
});

$('#look').on('select2:select', function (e) {
    // what you would like to happen
    $('#userSchedule tbody').html(' '); //Clear the table before putting value
    tableUserSched.DataTable().clear().draw() //Clear the table before putting value
    $('.UserInformation_wrapper').css({
        display: 'block',
    });

    LoadUser(
        $('#userType').val() == null ? 'Professor' : $('#userType').val(),
        $('#look').val()
    );



    if ($(`#userType`).val().includes('Student')) {

        firebase
            .database()
            .ref(`Data/Subject/`)
            .once('value', (scheduleSnap) => { // Get All the Subjects
                scheduleSnap.forEach((schedule) => { //Loop on all Schedule
                    schedule.child('Students').forEach((childSchedule) => { //Redirect on Student child
                        // console.log('IDS : '+childSchedule.child('ID').val());
                        if (childSchedule.child('ID').val() ==
                            $('#look').val()) {
                            // Check if the child of Students are equal to dropdown val
                            console.log('Parent : ' + childSchedule.ref.parent.parent.key);

                            firebase
                                .database()
                                .ref(
                                    `Data/Subject/${childSchedule.ref.parent.parent.key}/`
                                ) // Get of Parent of this child
                                .once('value', (subjects) => {

                                    console.log(subjects.val());
                                    firebase
                                        .database()
                                        .ref(
                                            `Data/Faculty/Information/${subjects
                                            .child('Professor')
                                            .val()}`
                                        )
                                        .once('value', (professor) => {
                                            // Get Professor Data
                                            console.log(
                                                `${professor.child('Name').child('Last').val()}, ${professor.child('Name').child('First').val()} ${professor.child('Name').child('Middle').val()} `
                                            );
                                            tableUserSched.DataTable().row.add([subjects.child('Title').val(), subjects.child('Schedule').child('Day').val(), subjects.child('Schedule').child('Time').val(), subjects.child('Location').val(),
                                                    `${professor.child('Name').child('Last').val()}, ${professor.child('Name').child('First').val()} ${professor.child('Name').child('Middle').val()} `
                                                ])
                                                .draw();

                                        });



                                });
                        }
                    });
                });
            });
    } else {
        firebase.database().ref(`Data/Subject`).once('value', snap => {
            snap.forEach(professor => {

                let prof = professor.child('Professor');
                if (prof.val() == $('#look').val()) {
                    console.log(prof.ref.parent.key);

                    firebase.database().ref(`Data/Subject/${prof.ref.parent.key}`).once('value',subjects =>
                    {
                        console.log(subjects.val());
                        firebase
                        .database()
                        .ref(
                            `Data/Faculty/Information/${subjects
                            .child('Professor')
                            .val()}`
                        )
                        .once('value', (professor) => {
                            // Get Professor Data
                            console.log(
                                `${professor.child('Name').child('Last').val()}, ${professor.child('Name').child('First').val()} ${professor.child('Name').child('Middle').val()} `
                            );
                            tableUserSched.DataTable().row.add([subjects.child('Title').val(), subjects.child('Schedule').child('Day').val(), subjects.child('Schedule').child('Time').val(), subjects.child('Location').val(),
                                    `${professor.child('Name').child('Last').val()}, ${professor.child('Name').child('First').val()} ${professor.child('Name').child('Middle').val()} `
                                ])
                                .draw();

                        });
                    })
                }
            })
        });
    }


});

$('#userType').on('change', function (e) {
    $('#look').html('');
    LoadSearch($('#userType').val());
});

$('#searchbx').focusin(function () {
    $('.search-result')
        .css({
            opacity: '1',
            display: 'block',
        })
        .animate();
});
$('#searchbx').focusout(function () {
    $('.search-result')
        .css({
            opacity: '0',
            display: 'none',
        })
        .animate();
});

function LoadSearch(UserType) {
    $('#look').append(
        `<option disabled selected> Select ${UserType} </option>`
    );
    firebase
        .database()
        .ref('Data/' + UserType + '/Information/')
        .on('value', (snap) => {
            snap.forEach((childSnap) => {
                //   var name = childSnap.child('Name').val().split('&&');
                $('#look').append(
                    `<option value='${childSnap.child('ID').val()}'> ${`<span style="color:#ccc">(${childSnap
                        .child('ID')
                        .val()})</span>` +
                    childSnap.child('Name').child('Last').val() +
                    ',' +
                    childSnap.child('Name').child('First').val() +
                    ' ' +
                    childSnap.child('Name').child('Middle').val()
                    } </option>`
                );
            });
        });
}

function LoadUser(UserType, Id) {
    firebase
        .database()
        .ref(`Data/${UserType}/Information/${Id}`)
        .on('value', (snap) => {
            console.log(snap.child('Name').val());
            //    var name = snap.child('Name').val().split('&&');

            $('#infoName').html(
                `${snap.child('Name').child('Last').val()} , ${snap
                    .child('Name')
                    .child('First')
                    .val()} ${snap.child('Name').child('Middle').val()}`
            );
            $('#infoId').html(`${snap.child('ID').val()}`);
            $('#infoType').html(UserType);
            $('#userImage').attr('src', snap.child('Profile').val());
        });
}

