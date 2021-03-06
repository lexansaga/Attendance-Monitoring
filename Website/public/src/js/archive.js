var table = $('#datatable')
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
                    window.location.replace("main.html");
                } else if (Account_Type.includes('Faculty')) {
                    window.location.replace("main.html");
                } else if (Account_Type.includes('Guidance')) {
                    //window.location.replace("main.html");
                } else { // Else
                    window.location.replace("index.html");
                }
            })
        }
    })

    table.DataTable({
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excel',
                exportOptions: {
                    columns: [ 0, ':visible' ]
                }
            },
            {
                extend: 'pdf',
                exportOptions: {
                    columns: ':visible'
                }
            },
            {
                extend: 'print',
                exportOptions: {
                    columns: [ 1, 2, 3, 4, 5, 6 ]
                }
            },
            'colvis'
        ]
    });


    firebase.database().ref(`Data/Reported/Archive/`).on('value', active => {

        table.DataTable().clear().draw()

        active.forEach(date => {
            let dates = date.key;
            date.forEach(students => {

                let studentID = students.key;

                students.forEach(data => {

                    //    console.log(data.val())

                    let ID = data.child('ID').val()
                    let reportedBy = data.child('ReportedBy').val().split('$')
                    let reportedStudent = data.child('ReportedStudent').val().split('$')
                    let time = data.child('Time').val()
                    let date = data.child('Date').val()
                    let action = data.child('Action').val()
                    let statustext = data.child('Status').val()
                    let details = data.child('Details').val()

                    let status = {
                        'Action Taken': `<span style="color:var(--green)">Action Taken</span>`,
                        'Archived': `<span style="color:var(--green)">Cancel - Move to Archive</span>`,
                        'Active': `<span style="color:var(--red)">Active</span>`,
                    }

                    firebase.database().ref(`Data/Student/Information/${studentID}/`).on('value', studentInfo => {
                        console.log(studentInfo.val())
                        table.DataTable().row.add([

                            `<img data-id="${ID}" data-details="${details}" data-time="${time}" data-date="${date}" src = "${studentInfo.child('Profile').val()}"  onerror="this.onerror=null; this.src='src/assets/avatar.png'" / >`,

                            `<span id="r-student" data-id="${reportedStudent[0]}" style="font-weight:600">${reportedStudent[1]} </span>`,
                            details,

                            `<span id="r-by" data-id="${reportedBy[0]}">${reportedBy[1]} </span>`,

                            `${date}, ${time}`,

                            `${FallBackNull(action)}`,

                            `${status[statustext]}`
                        ]).draw()
                    })


                })
            })
        })


    })
})



$(".reported-dates").on('click', function () {
    $('.date').css('display', 'block');
})
$(".close").on('click', function () {
    $('.date').css('display', 'none');
})
$(".btn-cancel").on('click', function () {
    $('.date').css('display', 'none');
})

var datefrom = $('#datefrom');
var dateto = $('#dateto');

datefrom.change(function () {
    if (datefrom.val() != '') {
        dateto.prop('disabled', false);
        dateto.attr('min', FormatDate(datefrom.val(), 'YY-MM-DD'));
    } else {
        dateto.prop('disabled', true);
    }
});


$('.btn-submit-date').on('click', function () {


    var start;
    var end;

    if (dateto.val() == '') {
        //  alert('DateTo Has no Value');
        start = new Date(FormatDate(datefrom.val(), "MM-DD-YY"));
        end = new Date(FormatDate(datefrom.val(), "MM-DD-YY"));


    } else {
        //alert('DateTo Has  Value');
        start = new Date(FormatDate(datefrom.val(), "MM-DD-YY"));
        end = new Date(FormatDate(dateto.val(), "MM-DD-YY"));
    }

    $('.datefrom-set').html(`${GetMonth(start.getMonth() + 1)} - ${start.getDate()} - ${start.getFullYear()} `)
    $('.dateto-set').text(`${GetMonth(end.getMonth() + 1)} - ${end.getDate()} - ${end.getFullYear()} `)


    // alert(datefrom.val()+'-'+dateto.val());
    var newend = end.setDate(end.getDate() + 1);
    var end = new Date(newend);

    table.DataTable().clear().draw();

    while (start < end) {


        let mm = start.getMonth() + 1;
        let yy = start.getFullYear();
        let dd = start.getDate();

        let date = mm + '-' + dd + '-' + yy;

        console.log(date)

        firebase.database().ref(`Data/Reported/Archive/${date}/`).on('value', reported => {
            reported.forEach(student => {

                let studentID = student.key;
                console.log(student.val())
                student.forEach(data => {
                    console.log(data.val())
                    let reportedBy = data.child('ReportedBy').val().split('$')
                    let reportedStudent = data.child('ReportedStudent').val().split('$')
                    let time = data.child('Time').val()
                    let date = data.child('Date').val()
                    let ID = data.child('ID').val()
                    let action = data.child('Action').val()
                    let statustext = data.child('Status').val()
                    let details = data.child('Details').val()

                    let status = {
                        'Action Taken': `<span style="color:var(--green)">Action Taken</span>`,
                        'Archived': `<span style="color:var(--green)">Cancel - Move to Archive</span>`,
                        'Active': `<span style="color:var(--red)">Active</span>`,
                    }
                    firebase.database().ref(`Data/Student/Information/${studentID}/`).on('value', studentInfo => {
                        console.log(studentInfo.val())
                        table.DataTable().row.add([

                            `<img data-id="${ID}" data-details="${details}" data-time="${time}" data-date="${date}" src = "${studentInfo.child('Profile').val()}"  onerror="this.onerror=null; this.src='src/assets/avatar.png'" / >`,

                            `<span id="r-student" data-id="${reportedStudent[0]}" style="font-weight:600">${reportedStudent[1]} </span>`,
                            details,

                            `<span id="r-by" data-id="${reportedBy[0]}">${reportedBy[1]} </span>`,

                            `${date}, ${time}`,

                            `${FallBackNull(action)}`,

                            `${status[statustext]}`
                        ]).draw()
                    })

                })

            })
        })



        var newDate = start.setDate(start.getDate() + 1);
        start = new Date(newDate);
    }

    $('.date').css('display', 'none');
});