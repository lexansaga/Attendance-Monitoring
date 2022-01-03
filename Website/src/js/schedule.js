$('.UserInformation_wrapper').css('display', 'none');
var tableUserSched = $('#userSchedule');

// CUSTOM SORTING OF DATATABLE BY DAY NAME
$.fn.dataTable.ext.type.order['day-sort-pre'] = function ( d ) {
    switch ( d ) {
        case 'Monday':    return 1;
        case 'Tuesday': return 2;
        case 'Wednesday':   return 3;
        case 'Thursday':   return 4;
        case 'Friday':   return 5;
        case 'Saturday':   return 6;
    }
    return 0;
};

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

    tableUserSched.DataTable({
        "dom": 'B<f<t>ip>',
        buttons: ['excel','pdf','print'],
        "columnDefs": [ {
            "type": "day-sort",
            "targets": 1
        } ],
        order: [1, 'asc']
    });




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

                if (Account_Type.includes('Administrator')) {
                    LoadSearch('Faculty');
                    $('.type').css({
                        'display': 'block'
                    })
                }
                if (Account_Type.includes('Guidance')) {
                    LoadSearch('Faculty');
                    $('.type').css({
                        'display': 'block'
                    })
                }
                if (Account_Type.includes('Faculty')) {
                    LoadSearchFaculty(Account_Type, UserID);
                    $('.type').css({
                        'display': 'none'
                    })

                } else {
                    //window.location.replace("index.html");
                }
            })
        } else {

        }
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
        $('#userType').val() == null ? 'Faculty' : $('#userType').val(),
        $('#look').val()
    );


   let userTypeSelected =  $(`#userType`).val()  == null ? "Faculty" : $(`#userType`).val()
   console.log(userTypeSelected)
    if (userTypeSelected.includes('Student')) {

        let studentID = $(`#look`).val()
        console.log(studentID)
        firebase.database().ref(`Data/Student/Information/${studentID}/`).once('value', student => {
            if (student.val() != null) {
                let subjects = student.child(`Subject`)

                subjects.forEach(subject => {
                    if (subject.val().includes('SUB')) {
                        let subjectID = subject.val()

                        firebase.database().ref(`Data/Subject/${subjectID}/`).once('value', subjectInfo => {
                            if (subjectInfo.val() != null) {

                                let classNbr = subjectInfo.child(`ClassNbr`).val()
                                let description = subjectInfo.child(`Description`).val()
                                let location = subjectInfo.child(`Location`).val()
                                let professor = subjectInfo.child(`Professor`).val()
                                let title = subjectInfo.child(`Title`).val()

                                let schedDay = subjectInfo.child('Schedule').child('Day').val()
                                let schedTime = subjectInfo.child('Schedule').child('Time').val()

                                firebase.database().ref(`Data/Faculty/Information/${professor}/`).on('value', professor => {
                                    if (professor.val() != null) {

                                        let first = professor.child('Name').child(`First`).val()
                                        let last = professor.child('Name').child(`Last`).val()
                                        let middle = professor.child('Name').child(`Middle`).val()

                                        tableUserSched.DataTable().row.add([title, schedDay, schedTime, location,
                                                `${last}, ${first} ${middle} `
                                            ])
                                            .draw();
                                    }
                                })
                            }
                        })
                    }
                });
            }
        })
        // firebase
        //     .database()
        //     .ref(`Data/Subject/`)
        //     .once('value', (scheduleSnap) => { // Get All the Subjects
        //         scheduleSnap.forEach((schedule) => { //Loop on all Schedule
        //             schedule.child('Students').forEach((childSchedule) => { //Redirect on Student child
        //                 // console.log('IDS : '+childSchedule.child('ID').val());
        //                 if (childSchedule.child('ID').val() ==
        //                     $('#look').val()) {
        //                     // Check if the child of Students are equal to dropdown val
        //                     console.log('Parent : ' + childSchedule.ref.parent.parent.key);

        //                     firebase
        //                         .database()
        //                         .ref(
        //                             `Data/Subject/${childSchedule.ref.parent.parent.key}/`
        //                         ) // Get of Parent of this child
        //                         .once('value', (subjects) => {

        //                             console.log(subjects.val());
        //                             firebase
        //                                 .database()
        //                                 .ref(
        //                                     `Data/Faculty/Information/${subjects
        //                                     .child('Professor')
        //                                     .val()}`
        //                                 )
        //                                 .once('value', (professor) => {
        //                                     // Get Professor Data
        //                                     console.log(
        //                                         `${professor.child('Name').child('Last').val()}, ${professor.child('Name').child('First').val()} ${professor.child('Name').child('Middle').val()} `
        //                                     );
        //                                     tableUserSched.DataTable().row.add([subjects.child('Title').val(), subjects.child('Schedule').child('Day').val(), subjects.child('Schedule').child('Time').val(), subjects.child('Location').val(),
        //                                             `${professor.child('Name').child('Last').val()}, ${professor.child('Name').child('First').val()} ${professor.child('Name').child('Middle').val()} `
        //                                         ])
        //                                         .draw();

        //                                 });

        //                         });
        //                 }
        //             });
        //         });
        //     });
    } else{

        let profID = $(`#look`).val()
    //    alert(profID)
        firebase.database().ref(`Data/Subject/`).orderByChild('Professor').startAt(profID).endAt(profID).once('value', subjects => {
            if (subjects.val() != null) {
                console.log(subjects.val())

                subjects.forEach(subject => {
                    let classNbr = subject.child('ClassNbr').val()
                    let description = subject.child('Description').val()
                    let location = subject.child('Location').val()
                    let title = subject.child('Title').val()
                    let professor = subject.child('Professor').val()
                    let schedDay = subject.child('Schedule').child(`Day`).val()
                    let schedTime = subject.child('Schedule').child(`Time`).val().split('-')



                    firebase.database().ref(`Data/Faculty/Information/${professor}/`).on('value', professor => {
                        if (professor.val() != null) {

                            let first = professor.child('Name').child(`First`).val()
                            let last = professor.child('Name').child(`Last`).val()
                            let middle = professor.child('Name').child(`Middle`).val()

                            tableUserSched.DataTable().row.add([title, schedDay, `${toStandardTime(schedTime[0])} - ${toStandardTime(schedTime[1])}`, location,
                                    `${last}, ${first} ${middle} `
                                ])
                                .draw();
                        }
                    })

                })
            }
            // snap.forEach(professor => {

            //     let prof = professor.child('Professor');
            //     if (prof.val() == $('#look').val()) {
            //         console.log(prof.ref.parent.key);

            //         firebase.database().ref(`Data/Subject/${prof.ref.parent.key}`).once('value', subjects => {
            //             console.log(subjects.val());
            //             firebase
            //                 .database()
            //                 .ref(
            //                     `Data/Faculty/Information/${subjects
            //                 .child('Professor')
            //                 .val()}`
            //                 )
            //                 .once('value', (professor) => {
            //                     // Get Professor Data
            //                     console.log(
            //                         `${professor.child('Name').child('Last').val()}, ${professor.child('Name').child('First').val()} ${professor.child('Name').child('Middle').val()} `
            //                     );
            //                     tableUserSched.DataTable().row.add([subjects.child('Title').val(), subjects.child('Schedule').child('Day').val(), subjects.child('Schedule').child('Time').val(), subjects.child('Location').val(),
            //                             `${professor.child('Name').child('Last').val()}, ${professor.child('Name').child('First').val()} ${professor.child('Name').child('Middle').val()} `
            //                         ])
            //                         .draw();

            //                 });
            //         })
            //     }
            // })
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
        `<option value="default" disabled selected> Select ${UserType} </option>`
    );

    firebase
        .database()
        .ref('Data/' + UserType + '/Information/')
        .on('value', (snap) => {
            snap.forEach((childSnap) => {
                if (childSnap.val() != null) {
                    let id = childSnap.child('ID').val();
                    let last = childSnap.child('Name').child('Last').val()
                    let first = childSnap.child('Name').child('First').val()
                    let middle = childSnap.child('Name').child('Middle').val()
                    if (id != null) {
                        $('#look').append(
                            `<option value='${id}'> ${`<span style="color:#ccc">(${id})</span>` +
                            last +
                            ',' +
                            first +
                            ' ' +
                            middle
                            } </option>`
                        );
                    }
                }
                //   var name = childSnap.child('Name').val().split('&&');

            });
        });


}

function LoadSearchFaculty(UserType, id) {

    $('#userType').val('Student')
    $('#look').append(
        `<option disabled selected> Select Student </option>`
    );
    if (UserType.includes('Faculty')) {
        firebase.database().ref('Data/Subject/').orderByChild('Professor').startAt(id).endAt(id).on('value', subjects => {
            if (subjects.val() != null) {
                console.log(subjects.val())
                subjects.forEach(subject => {
                    console.log(subject.val())
                    subject.child('Students').forEach(student => {
                        let id = student.child('ID').val();
                        let name = student.child('Name').val()

                        if ($(`#look option[value="${id}"]`).length == 0) {
                            $('#look').append(
                                `<option value='${id}'><span style="color:#ccc">(${id})${name}</span>
                                         </option>`
                            );
                        }
                    })
                })
            }

        })
    }
}
$(`#userImage,#infoName,#infoType,#infoId`).on('click', function () {

    let id = $(`#infoId`).html();


    if (id.includes(`STUD`)) {
        window.location.href = `studentinformation.html?id=${id}`
    } else if (id.includes(`FAC`) || id.includes(`PROF`)) {
        window.location.href = `facultyinformation.html?id=${id}`
    } else {
        alert(`Invalid ID`)
    }


})

$(`.Btn-viewInf`).on('click', function (e) {

    let id = $(`#infoId`).html();


    if (id.includes(`STUD`)) {
        window.location.href = `studentinformation.html?id=${id}`
    } else if (id.includes(`FAC`) || id.includes(`PROF`)) {
        window.location.href = `facultyinformation.html?id=${id}`
    } else {
        alert(`Invalid ID`)
    }


})




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
            ImageFallBackNull($('#userImage'))
        });
}