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
                    columns: [1,2,3,4]
                }
            },
            {
                extend: 'pdf',
                exportOptions: {
                    columns: [1,2,3,4]
                }
            },
            {
                extend: 'print',
                exportOptions: {
                    columns: [ 1, 2, 3, 4]
                }
            }
        ]
    });


    firebase.database().ref(`Data/Reported/Active/`).on('value', active => {

        table.DataTable().clear().draw()

        active.forEach(date =>
            {
                let dates = date.key;
                date.forEach( students => 
                    {
                                 
                         let studentID = students.key;

                        students.forEach( data =>
                            {
                                
                            //    console.log(data.val())

                                let ID = data.child('ID').val()
                                let reportedBy = data.child('ReportedBy').val().split('$')
                                let reportedStudent = data.child('ReportedStudent').val().split('$')
                                let time = data.child('Time').val()
                                let date = data.child('Date').val()
                                let details = data.child('Details').val()
                
                                firebase.database().ref(`Data/Student/Information/${studentID}/`).on('value', studentInfo => {
                                    console.log(studentInfo.val())
                                    table.DataTable().row.add([

                                        `<img data-id="${ID}" data-details="${details}" data-time="${time}" data-date="${date}" src = "${studentInfo.child('Profile').val()}"  onerror="this.onerror=null; this.src='src/assets/avatar.png'" / >`,

                                        `<span id="r-student" data-id="${reportedStudent[0]}" style="font-weight:600">${reportedStudent[1]} </span>`,
                                        details,

                                        `<span id="r-by" data-id="${reportedBy[0]}">${reportedBy[1]} </span>`,

                                        `${date}, ${time}`,

                                        `<button class="btn-take-action" onclick="TakeAction(this)">Take Action</button>
                                        <button class="btn-delete" onclick="Archive(this)">Move to Archive</button>`
                                    ]).draw()
                                })
                

                            })
                    })
            })


    })
})


// $(window).click(function (e) {
//     if (e.target.className.includes('modal')) {
//         $('.modal').css('display', 'none');
//     }
//     console.log(e.target.className);
// });

var actionEvent = ''
function TakeAction(event) {

    $('.modal:eq(0)').css('display', 'block');
    actionEvent = $(event);
}

function SubmitAction(event) {
    let e = window.event
    e.stopPropagation()

    let studentName = actionEvent.parent().parent().find('#r-student').html()
    let studentID = actionEvent.parent().parent().find('#r-student').attr('data-id')
    let reporterName = actionEvent.parent().parent().find('#r-by').html()
    let reporterID = actionEvent.parent().parent().find('#r-by').attr('data-id')

    let ID = actionEvent.parent().parent().find('img').attr('data-id')
    let time = actionEvent.parent().parent().find('img').attr('data-time')
    let date = actionEvent.parent().parent().find('img').attr('data-date')
    let details = actionEvent.parent().parent().find('img').attr('data-details')


    firebase.database().ref(`Data/Reported/Archive/${GetDateNow()}/${studentID}/${ID}`).set({
        Date: GetDateNow(),
        Time: GetTimeNow(),
        Details: details,
        ReportedStudent: `${studentID}$${studentName}`,
        ReportedBy: `${reporterID}$${reporterName}`,
        ID: ID,
        Action: $('#summary').val(),
        Status: 'Action Taken'
    })

    firebase.database().ref(`Data/Reported/Active/${date}/${studentID}/${ID}`).remove()

    $('#summary').val('')
    alert('Action Taken!')
    $('.modal:eq(0)').css('display', 'none');

}

function Archive(event) {
    let e = window.event
    e.stopPropagation()

    let studentName = $(event).parent().parent().find('#r-student').html()
    let studentID = $(event).parent().parent().find('#r-student').attr('data-id')
    let reporterName = $(event).parent().parent().find('#r-by').html()
    let reporterID = $(event).parent().parent().find('#r-by').attr('data-id')

    let ID = $(event).parent().parent().find('img').attr('data-id')
    let time = $(event).parent().parent().find('img').attr('data-time')
    let date = $(event).parent().parent().find('img').attr('data-date')
    let details = $(event).parent().parent().find('img').attr('data-details')

    if (confirm(`Are you sure you want to move ${ID} to Archive?`)) {
        firebase.database().ref(`Data/Reported/Archive/${GetDateNow()}/${studentID}/${ID}`).set({
            Date: GetDateNow(),
            Time: GetTimeNow(),
            Details: details,
            ReportedStudent: `${studentID}$${studentName}`,
            ReportedBy: `${reporterID}$${reporterName}`,
            ID: ID,
            Action: `No action taken`,
            Status: `Archived`
        })
        firebase.database().ref(`Data/Reported/Active/${GetDateNow()}/${studentID}/${ID}`).remove()
    } else {

    }
}

$(".btn-delete").click(function (e) {

    $('.modal:eq(2)').css('display', 'block');

});



$('.modal > div > span, .btn-cancel').click(function () {

    $('.modal').css('display', 'none');

});


$(".reported-dates").on('click',function()
{
    $('.date').css('display', 'block');
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

        firebase.database().ref(`Data/Reported/Active/${date}/`).on('value', reported => {
            reported.forEach(student => {
                
                let studentID = student.key;
                console.log(student.val())
                student.forEach(data => {
                    console.log(data.val())
                    let reportedBy = data.child('ReportedBy').val().split('$')
                    let reportedStudent = data.child('ReportedStudent').val().split('$')
                    let time = data.child('Time').val()
                    let date = data.child('Date').val()
                    let details = data.child('Details').val()
                    let ID = data.child('ID').val()

                    firebase.database().ref(`Data/Student/Information/${studentID}/`).on('value', studentInfo => {
                        console.log(studentInfo.val())
                        table.DataTable().row.add([

                            `<img data-id="${ID}" data-details="${details}" data-time="${time}" data-date="${date}" src = "${studentInfo.child('Profile').val()}"  onerror="this.onerror=null; this.src='src/assets/avatar.png'" / >`,

                            `<span id="r-student" data-id="${reportedStudent[0]}" style="font-weight:600">${reportedStudent[1]} </span>`,
                            details,

                            `<span id="r-by" data-id="${reportedBy[0]}">${reportedBy[1]} </span>`,

                            `${date}, ${time}`,

                            `<button class="btn-take-action" onclick="TakeAction(this)">Take Action</button>
                            <button class="btn-delete" onclick="Archive(this)">Move to Archive</button>`
                        ]).draw()
                    })

                })

            })
        })



        var newDate = start.setDate(start.getDate() + 1);
        start = new Date(newDate);
    }

    $('.modal').css('display', 'none');
});