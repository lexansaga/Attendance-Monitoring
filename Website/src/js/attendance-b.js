var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDate();

var dateNow = month + ':' + day + ':' + year;

var dayNow = date.getDay()

var hour = date.getHours();
var minute = date.getMinutes();
var seconds = date.getSeconds();

var timeNow = hour + ':' + minute + ':' + seconds;

let thead = $('.name thead tr')
let tbody = $('.name tbody tr')


var attstatus = {
    present: `
    <div class="option">
        <button title="Report" class="report" onclick="ModalReportOpen(this)"><i class='bx bxs-error-circle'></i></button>
        <i data-status='present' class='bx bxs-circle att_mark' data-remarks="" style="color:#69E486;"></i>
        <button title="Add Remarks" class="remarks" onclick="OpenModal(this)"><i class='bx bxs-notepad'></i></button>
    </div>`,
    absent: `
    <div class="option">
        <button title="Report" class="report" onclick="ModalReportOpen(this)"><i class='bx bxs-error-circle'></i></button>
        <i  data-status='absent' class='bx bxs-circle att_mark' data-remarks="" style="color:#FE5277;"></i>
        <button title="Add Remarks" class="remarks" onclick="OpenModal(this)"><i class='bx bxs-notepad'></i></button>
    </div>`,
    arrivelate: `
    <div class="option">
        <button title="Report" class="report" onclick="ModalReportOpen(this)"><i class='bx bxs-error-circle'></i></button>
        <i  data-status='arrivelate' class='bx bx-chevrons-left att_mark' data-remarks="" style="color: #FEB331; "></i>
        <button title="Add Remarks" class="remarks" onclick="OpenModal(this)"><i class='bx bxs-notepad'></i></button>
    </div>`,
    leaveearly: `
    <div class="option">
        <button title="Report" class="report" onclick="ModalReportOpen(this)"><i class='bx bxs-error-circle'></i></button>
        <i data-status='leaveearly' class='bx bx-chevrons-right att_mark' data-remarks="" style="color: #FEB331;"></i>
        <button title="Add Remarks" class="remarks" onclick="OpenModal(this)"><i class='bx bxs-notepad'></i></button>
    </div>`
}



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


                console.log(snap.val());
                //    $('.name tbody').html('');
                firebase.database().ref('Data/Subject/').orderByChild('Professor').startAt(UserID).endAt(UserID).once('value', subjects => {

                    if (subjects.val() != null) {
                        //Professor has subject
                        subjects.forEach(subject => {



                            // let time1 = Date.parse('01/01/2000 '+'09:30:0');
                            // let time2 = Date.parse('01/01/2000 '+'09:30:1');


                            let sched = subject.child('Schedule').child('Time').val().split('-');

                            let startSched = Date.parse('01/01/2000 ' + sched[0]);
                            let endSched = Date.parse('01/01/2000 ' + sched[1]);

                            var timeNow = Date.parse('01/01/2000 ' + '13:01:00');
                            //var timeNow = Date.parse('01/01/2000 '+time);

                            console.log(timeNow);
                            console.log(startSched + ':' + endSched);
                            if (startSched <= timeNow && timeNow <= endSched) {
                                //Match schedule time 
                                console.log(subject.child('ClassNbr').val());
                                console.log(subject.child('Title').val());
                                console.log('Time Match');


                                $('.section-name').attr('data-prof', UserID);
                                $('.section-name').attr('data-class', subject.child('ClassNbr').val());
                                $('.section-name').attr('data-location', subject.child('Location').val());
                                $('.section-name').attr('data-title', subject.child('Title').val());

                          //      console.log(subject.child('Students').val());

                                var studentCount = 0;

                                let SortedStudents = subject.child('Students').val().sort((a, b) => a.Name.localeCompare(b.Name));;

                          //      console.log(SortedStudents);

                                SortedStudents.forEach(students => {

                           //         console.log(students);

                                    studentCount++;
                                    $('.name tbody').append(`<tr>
                                        <td class="n" data-id="${students.ID}" onclick="StudentInfo(this)">${students.Name}</td>
                                        </tr>`);
                                    // This will append student name on Attendance on first column - Sorted by Surname

                                });


                                // subject.child('Students').forEach(students => {

                                //     console.log(students);

                                //     $('.name tbody').append(`<tr>
                                //         <td class="n" data-id="${students.child('ID').val()}">${students.child('Name').val()}</td>
                                //         </tr>`);

                                // This will append student name on Attendance on first column - Unsorted by Surname
                                // });
                            } else {
                                //Not match schedule time
                                console.log('Cant find schedule!')
                            }

                        });

                        let studID = [];
                        $('.name tbody tr').each(function (index, item) {
                            console.log($(this).find('.n').attr('data-id'));
                            console.log(index);
                            //Get list of names
                            studID.push($(this).find('.n').attr('data-id'))

                        });

                        console.log(studID)
                        let dateRowIndex = 0;
                        firebase.database().ref(`Attendance/Summary/Class/${$(`.section-name`).attr('data-class')}/Dates/`).once('value', snap => {
                            let rowCount = $('.name tbody tr').length;

                            snap.forEach(dates => {

                        //        console.log(dates.val())
                                var table = $('tbody tr .n');
                                var head = $('thead tr .n');
                                var foot = $('tfoot tr .n');

                                dates.child('Student').forEach(student => {


                                //    console.log(student.val())
                                    let key = student.key;
                                    let rowId = $('tbody tr .n').attr('data-id');

                                    // $(`tbody tr .n[data-id="${key}"]`).after(`<td>${dates.child('Student').child(key).val()}</td>`)

                                  //  console.log(dates.child('Student').child(key).val())
                                    if (attstatus[dates.child('Student').child(key).child('Status').val()] == null) {
                                        $(`tbody tr .n[data-id="${key}"]`).after(
                                            `<td>--</td>`
                                        );
                                    } else {
                                        // $(`tbody tr .n[data-id="${key}"]`).after(
                                        //     `<td>${attstatus[dates.child('Student').child(key).child('Status').val()]}</td>`
                                        // );

                                        $(`tbody tr .n[data-id="${key}"]`).after(
                                            `<td>${attstatus[dates.child('Student').child(key).child('Status').val()].replace('data-remarks=""',`data-remarks="${dates.child('Student').child(key).child('Remarks').val()}"`)}</td>`
                                        );
                                    }

                                    // This will add student attendance from firebase to table
                                });

                                head.after(`<td><input id="dt-attendance" type="date" value="${FormatDate(dates.child('Date').val(),'YY-MM-DD')}" /></td>`);
                                foot.after(`<td><input id="dt-attendance" type="date" value="${FormatDate(dates.child('Date').val(),'YY-MM-DD')}" /></td>`);
                                // This will add student attendance dates from firebase to table
                                // $(`input[type="date"]`).attr('value',FormatDate(dates.child('Date').val(),'YY-MM-DD'));

                         //       console.log(FormatDate(dates.child('Date').val(), 'YY-MM-DD'));
                                dateRowIndex++;
                            })



                        });



                    } else {
                        // Profesor has no subject

                    }


                });
                // if(Account_Type.includes('Faculty'))
                // {

                // }
            });
        } else {
            // User is signed out
            // ...

        }
    })




});



$('#add').click(function () {

    //This will add new column on attendance
    var table = $('tbody tr .n');
    var head = $('thead tr .n');
    var foot = $('tfoot tr .n');

    table.after(`<td>--</td>`);
    head.after(`<td><input id="dt-attendance" type="date" max="2021-10-31"/></td>`);

    foot.after(`<td><input type="date" disabled /></td>`);

});




$('table').on('click', 'tbody tr td:not(".n")', function () {
    //  alert($(this).html());

    if ($('#dt-attendance').val() == '') {
        alert("Select date first!");

    } else {

        var value = $(this).find('.att_mark').attr('data-status');
        // alert(value)
        if (value == null) {
            $(this).html(attstatus[Object.keys(attstatus)[0]]);
        } else if (value == 'present') {
            $(this).html(attstatus[Object.keys(attstatus)[1]]);
        } else if (value == 'absent') {
            $(this).html(attstatus[Object.keys(attstatus)[2]]);
        } else if (value == 'arrivelate') {
            $(this).html(attstatus[Object.keys(attstatus)[3]]);
        } else if (value == 'leaveearly') {
            $(this).html(attstatus[Object.keys(attstatus)[0]]);
        } else {

        }

        console.log(value);
    }


});


$('#dt-attendance').bind("change paste keyup", function () {
    $('input[type=date]').val($(this).val());
});

$('#btnSubmitAtt').click(function () {
    //  alert($('#dt-attendance').val());

    let columnCount = $("table > thead > tr:first > td").length;
    let rowCount = $('table tr').length;
    console.log("Row Count : " + rowCount);
    console.log("Column Count : " + columnCount);
    var colData = [];
    for (let col = 0; col < columnCount; col++) {
        var rowData = [];
        for (let row = 0; row < rowCount; row++) {
            var content = $(`table tr:eq(${row}) td:eq(${col})`).html();

            if (content.includes('dt-attendance')) {

                var att_date = $(`table tr:eq(${row}) td:eq(${col}) input`).val();
                console.log(FormatDate(att_date, 'MM-DD-YY'));
                rowData.push(FormatDate(att_date, 'MM-DD-YY'));

            } else if (content.includes('data-status')) {

                var att_status = $(`table tr:eq(${row}) td:eq(${col}) .option .att_mark`).attr('data-status');
                var remarks = $(`table tr:eq(${row}) td:eq(${col}) .option .att_mark`).attr('data-remarks');

                console.log('Status : ' + att_status);
                console.log('Remarks : ' + remarks);

                rowData.push((att_status == null ? '-' : att_status) + '$' + (remarks == null ? '-' : remarks))
            } else {


                var id = $(`table tr:eq(${row}) td:eq(${col})`).attr('data-id')
                if (id != null) {
                    console.log(id);
                    rowData.push(id);
                }

            }
        }

        colData.push(rowData);
    }

    console.log(colData);
    console.log(AttendanceJSON(colData));

    AttendanceJSON(colData).forEach(attendance => {
        //This will add data converted array to JSON on firebase
        var key = firebase.database().ref(`Attendance/Summary/Class/`).push().key;
        firebase.database().ref(`Attendance/Summary/Class/`).update({
            [`${$('.section-name').attr('data-class')}`]: attendance
        });
    })



    alert('Attendance Save Sucessfully!')
});


function AttendanceJSON(arr) {

    //This method will convert the array into attendance object based on Firebase Model.

    let data = [];
    let classData = {};
    classData.ClassNbr = $('.section-name').attr('data-class')
    classData.Professor = $('.section-name').attr('data-prof')
    classData.Title = $('.section-name').attr('data-title');
    classData.Location = $('.section-name').attr('data-Location');

    let Dates = {};
    for (var arrLength = 1; arrLength < arr.length; arrLength++) {

        let attendance_dates = {};
        attendance_dates.Date = arr[arrLength][0]
        attendance_dates.Day = GetDay(dayNow)
        attendance_dates.Time = GetClockNow()
        attendance_dates.TimeStamp = Date.now()

        var Student = {}
        for (var names = 0; names < arr[0].length; names++) {
            // Student[arr[0][names]] = arr[arrLength][names + 1] == null ? '-' : arr[arrLength][names + 1];

            let studentAttData = arr[arrLength][names + 1].split('$');
            Student[arr[0][names]] = {
                'ID': arr[0][names],
                'Status': studentAttData[0], // Status
                'Remarks': studentAttData[1] // Remarks
            }

        }
        attendance_dates.Student = Student
        Dates[`${arr[arrLength][0]}`] = attendance_dates;

    }
    classData.Dates = Dates;
    data.push(classData);
    return data;

}

function AttendanceIndividual(arr)
{

    let data = [];
    let classData = {};
    classData.ClassNbr = $('.section-name').attr('data-class')
    classData.Professor = $('.section-name').attr('data-prof')
    classData.Title = $('.section-name').attr('data-title');
    classData.Location = $('.section-name').attr('data-Location');

    let dates = {};
    for (var arrLength = 1; arrLength < arr.length; arrLength++) {

        let attendance_dates = {};
        attendance_dates.Date = arr[arrLength][0]
        attendance_dates.Day = GetDay(dayNow)
        attendance_dates.Time = GetClockNow()
        attendance_dates.TimeStamp = Date.now()

        var Student = {}
        for (var names = 0; names < arr[0].length; names++) {
            // Student[arr[0][names]] = arr[arrLength][names + 1] == null ? '-' : arr[arrLength][names + 1];

            let studentAttData = arr[arrLength][names + 1].split('$');
            Student[arr[0][names]] = {
                'ID': arr[0][names],
                'Status': studentAttData[0], // Status
                'Remarks': studentAttData[1] // Remarks
            }

        }
        attendance_dates.Student = Student
        Dates[`${arr[arrLength][0]}`] = attendance_dates;

    }
    classData.Dates = Dates;
    data.push(classData);
    return data;
}

var container = '' 
var remarks = ''

function OpenModal(event) {

    let e = window.event
     container = $(event).parent().find('.att_mark');
     remarks = $('#remarks-info');
    $('.remarks-modal').css('display', 'block');
    console.log(container.attr('class'));
    remarks.val(container.attr('data-remarks'))
    e.stopPropagation()


}

function CloseRemarksModal() {
    $('#remarks-info').val('');
    $('.remarks-modal').css('display', 'none');
}

$('.save').on('click', function (e2) {

    e2.stopPropagation()
    console.log(container.attr('data-status'))
    container.attr('data-remarks', remarks.val())
    CloseModal()

})

function ModalReportOpen(event)
{
    //alert('Report-Open');
    let e = window.event
    e.stopPropagation()
    $('.report-modal').css('display', 'block');
}


$('.report-close, #report-cancel').on('click',function(e)
{
    $('.report-modal').css('display', 'none');
})


function StudentInfo(event)
{
 let id = $(event).attr('data-id');
 console.log(id);

 window.location.href = `StudentInformation.html?id=` + id

}