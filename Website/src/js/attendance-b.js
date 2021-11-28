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
        <i data-status='present' class='bx bxs-circle att_mark excl' data-remarks="" style="color:#69E486;"><h6>Present</h6></i>
        <button title="Add Remarks" class="remarks" onclick="OpenModal(this)"><i class='bx bxs-notepad'></i></button>
    </div>`,
    absent: `
    <div class="option">
        <button title="Report" class="report" onclick="ModalReportOpen(this)"><i class='bx bxs-error-circle'></i></button>
        <i  data-status='absent' class='bx bxs-circle att_mark excl' data-remarks="" style="color:#FE5277;"><h6>Absent</h6></i>
        <button title="Add Remarks" class="remarks" onclick="OpenModal(this)"><i class='bx bxs-notepad'></i></button>
    </div>`,
    arrivelate: `
    <div class="option">
        <button title="Report" class="report" onclick="ModalReportOpen(this)"><i class='bx bxs-error-circle'></i></button>
        <i  data-status='arrivelate' class='bx bx-chevrons-left att_mark excl' data-remarks="" style="color: #FEB331; "><h6>Late</h6></i>
        <button title="Add Remarks" class="remarks" onclick="OpenModal(this)"><i class='bx bxs-notepad'></i></button>
    </div>`,
    leaveearly: `
    <div class="option">
        <button title="Report" class="report" onclick="ModalReportOpen(this)"><i class='bx bxs-error-circle'></i></button>
        <i data-status='leaveearly' class='bx bx-chevrons-right att_mark excl' data-remarks="" style="color: #FEB331;"><h6>Left Early</h6></i>
        <button title="Add Remarks" class="remarks" onclick="OpenModal(this)"><i class='bx bxs-notepad'></i></button>
    </div>`
}



$(document).ready(function () {

    $('.attendance-section').css({
        'display': 'none'
    })

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

                if (Permission_Tapin == true) {
                    //  alert('Need to tapin first');


                    $('.tap-first').css({
                        'display': 'flex'
                    })
                    $('.attendance-section').css({
                        'display': 'none'
                    })

                    firebase.database().ref(`Attendance/Gate/${FormatDate(dateNow,'MM-DD-YY')}/`).orderByChild('EnteredID').startAt(UserID).endAt(UserID).limitToLast(1).on('value', snap => {
                        //This will check if professor has already tapin



                        if (snap.val() != null) {
                            // Professor entered the school

                            snap.forEach(data => {

                                // console.log(data.child('Status').val());

                                let status = data.child('Status').val();
                                let location = data.child('Location').val();
                                let time = data.child('Time').val();

                            })

                            if ($('.tap-first').css('display') == 'flex') {
                                AttendanceProcess()
                            }


                        } else {
                            // Professor not yet entered the school
                            return;
                        }
                    });
                } else {
                    alert('No need to tap in first!');
                    AttendanceProcess()
                }


                function AttendanceProcess() {

                    $('.tap-first').css({
                        'display': 'none'
                    })
                    $('.attendance-section').css({
                        'display': 'block'
                    })

                    console.log(snap.val());
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
                                //  This will check the current time and compare on the schedule on databases
                                // Need to change the time for actual demo

                                //var timeNow = Date.parse('01/01/2000 '+time);

                                console.log(timeNow);
                                console.log(startSched + ':' + endSched);
                                if (startSched <= timeNow && timeNow <= endSched) {
                                    //Match schedule time 
                                    console.log(subject.child('ClassNbr').val());
                                    console.log(subject.child('Title').val());
                                    console.log('Time Match');

                                    $('.section-name').html(subject.child('Title').val());
                                    $('.section-name').attr('data-prof', UserID);
                                    $('.section-name').attr('data-class', subject.child('ClassNbr').val());
                                    $('.section-name').attr('data-location', subject.child('Location').val());
                                    $('.section-name').attr('data-title', subject.child('Title').val());
                                    $('.section-name').attr('data-schedule', subject.child('Schedule').child('Time').val());

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

                                        firebase.database().ref(`Attendance/Gate/${FormatDate(dateNow,'MM-DD-YY')}/`).orderByChild('EnteredID').startAt(students.ID).endAt(students.ID).limitToLast(1).on('value', statusOnGate => {
                                            //Realtime check student if already entered on gate

                                            statusOnGate.forEach(gateInfo => {
                                                let status = gateInfo.child('Status').val();
                                                let id = gateInfo.child('EnteredID').val();


                                                if (statusOnGate != null) {
                                                    // Student already entered
                                                    console.log(statusOnGate.val())

                                                    if (status.toLowerCase().includes('in')) {
                                                        $(`.n[data-id='${id}']`).css({
                                                            'color': 'var(--green)'
                                                        })

                                                    } else {
                                                        $(`.n[data-id='${id}']`).css({
                                                            'color': 'var(--font-light-color)'
                                                        })

                                                    }
                                                } else {



                                                    // Student not yet entered

                                                }
                                            });
                                        })



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

                                //This will get existing attendances
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
                                            //This will check if student status if null
                                            $(`tbody tr .n[data-id="${key}"]`).after(
                                                `<td>--</td>`
                                            );
                                        } else {
                                            //If student status is not null , Append on the status on Table cell by getting the data from attr_status

                                            // $(`tbody tr .n[data-id="${key}"]`).after(
                                            //     `<td>${attstatus[dates.child('Student').child(key).child('Status').val()]}</td>`
                                            // );

                                            $(`tbody tr .n[data-id="${key}"]`).after(
                                                `<td>${attstatus[dates.child('Student').child(key).child('Status').val()].replace('data-remarks=""',`data-remarks="${dates.child('Student').child(key).child('Remarks').val()}"`)}</td>`
                                            );
                                        }

                                        // This will add student attendance from firebase to table
                                    });

                                    head.after(`<td><div class="date-header"><input id="dt-attendance" value="${FormatDate(dates.child('Date').val(),'YY-MM-DD')}" type="date" max="2021-10-31"/> <i class='bx bx-dots-vertical-rounded' onclick="OpenDateModal(this)"></i></div></td>`);
                                    foot.after(`<td><div class="date-header"><input id="dt-attendance" value="${FormatDate(dates.child('Date').val(),'YY-MM-DD')}" type="date" max="2021-10-31"/> <i class='bx bx-dots-vertical-rounded' onclick="OpenDateModal(this)"></i></div></td>`);
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
                }

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

function SetSelectedAttendance(SubjectID) {
    firebase.database().ref('Data/Subjects/').orderByChild('ClassNbr').startAt(SubjectID).endAt(SubjectID).once('value', subjects => {
        subjects.forEach(subject => {
            console.log(subject.child('ClassNbr').val());
            console.log(subject.child('Title').val());
            console.log('Time Match');

            $('.section-name').html(subject.child('Title').val());
            $('.section-name').attr('data-prof', UserID);
            $('.section-name').attr('data-class', subject.child('ClassNbr').val());
            $('.section-name').attr('data-location', subject.child('Location').val());
            $('.section-name').attr('data-title', subject.child('Title').val());
            $('.section-name').attr('data-schedule', subject.child('Schedule').child('Time').val());

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

                firebase.database().ref(`Attendance/Gate/${FormatDate(dateNow,'MM-DD-YY')}/`).orderByChild('EnteredID').startAt(students.ID).endAt(students.ID).limitToLast(1).on('value', statusOnGate => {
                    //Realtime check student if already entered on gate

                    statusOnGate.forEach(gateInfo => {
                        let status = gateInfo.child('Status').val();
                        let id = gateInfo.child('EnteredID').val();


                        if (statusOnGate != null) {
                            // Student already entered
                            console.log(statusOnGate.val())

                            if (status.toLowerCase().includes('in')) {
                                $(`.n[data-id='${id}']`).css({
                                    'color': 'var(--green)'
                                })

                            } else {
                                $(`.n[data-id='${id}']`).css({
                                    'color': 'var(--font-light-color)'
                                })

                            }
                        } else {



                            // Student not yet entered

                        }
                    });
                })



                // This will append student name on Attendance on first column - Sorted by Surname

            });


            // subject.child('Students').forEach(students => {

            //     console.log(students);

            //     $('.name tbody').append(`<tr>
            //         <td class="n" data-id="${students.child('ID').val()}">${students.child('Name').val()}</td>
            //         </tr>`);

            // This will append student name on Attendance on first column - Unsorted by Surname
            // });
        })
    })
}


$('#add').click(function () {

    //This will add new column on attendance
    var table = $('tbody tr .n');
    var head = $('thead tr .n');
    var foot = $('tfoot tr .n');

    table.after(`<td class="excl">--</td>`);
    head.after(`<td><div class="date-header"><input id="dt-attendance" value="${FormatDate(dateNow.replaceAll(':','-'),'YY-MM-DD')}" type="date" max="2021-10-31"/> <i class='bx bx-dots-vertical-rounded' onclick="OpenDateModal(this)"></i></div></td>`);
    foot.after(`<td><div class="date-header"><input id="dt-attendance" value="${FormatDate(dateNow.replaceAll(':','-'),'YY-MM-DD')}" type="date" max="2021-10-31"/> <i class='bx bx-dots-vertical-rounded' onclick="OpenDateModal(this)"></i></div></td>`);

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


    var dateArray = []
    for (let dateRow = 1; dateRow < colData.length; dateRow++) {
        dateArray.push(colData[dateRow][0])
    }
    console.log(dateArray)
    if (ArrayHasDuplicate(dateArray)) {
        alert('Save failed \n There are duplicate dates! Remove the duplicate date as it will create data inaccurate')
        return;
    }

    console.log(AttendanceJSON(colData));

    console.log(StudentAttendanceIndividual(colData))

    console.log(AttendanceCounter(colData))
    AttendanceCounter(colData)

    AttendanceJSON(colData).forEach(attendance => {
        //This will add data Class Attendance converted array to JSON on firebase
        var key = firebase.database().ref(`Attendance/Summary/Class/`).push().key;
        firebase.database().ref(`Attendance/Summary/Class/${ [`${$('.section-name').attr('data-class')}`]}`).update(
            attendance
        );
    })

    StudentAttendanceIndividual(colData).forEach(attendance => {
        //This will add data Student Attendance converted array to JSON on firebase
        //    firebase.database().ref(`Attendance/Summary/Student/`).update(attendance);

        for (const [key, value] of Object.entries(attendance)) {
            //   firebase.database().ref(`Attendance/Summary/Student/${key}/Class/${value.Class.key}`).update(attendance);

            //  console.log(key.Class)

            for (const [cKey, cValue] of Object.entries(value.Class)) {
                // console.log(cKey)
                firebase.database().ref(`Attendance/Summary/Student/${key}/Class/${cKey}`).update(cValue);
            }
        }
    })

    AttendanceCounter(colData).forEach(attendance => {
        for (const [key, value] of Object.entries(attendance)) {
            console.log(key)
            console.log(value)
            for (const [cKey, cValue] of Object.entries(value)) {
                console.log(cKey)
                console.log(cValue.Date)

                firebase.database().ref(`Attendance/Report/Statistics/Class/${cKey}/`).update(cValue.Dates)
            }
        }
    })
    //This will add data Faculty Attendance  on firebase
    firebase.database().ref(`Attendance/Summary/Faculty/`).update(FacultyAttendance());



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
        attendance_dates.Time = GetTimeNow()
        attendance_dates.TimeStamp = Date.now()

        var Student = {}
        for (var names = 0; names < arr[0].length; names++) {
            // Student[arr[0][names]] = arr[arrLength][names + 1] == null ? '-' : arr[arrLength][names + 1];
            let studentAttData = arr[arrLength][names + 1]
            if (arr[arrLength][names + 1] == null) {
                studentAttData = ['-', '-']
            } else {
                studentAttData = arr[arrLength][names + 1].split('$');
            }

            Student[arr[0][names]] = {
                'ID': arr[0][names],
                Status: FallBackNull(studentAttData[0]),
                Remarks: FallBackNull(studentAttData[1])
            }

        }
        attendance_dates.Student = Student
        Dates[`${arr[arrLength][0]}`] = attendance_dates;

    }
    classData.Dates = Dates;
    data.push(classData);
    return data;

}

function StudentAttendanceIndividual(arr) {

    let data = [];

    let p_info = {}
    for (let name = 0; name < arr[0].length; name++) {

        let Class = {}
        Class.ClassNbr = $('.section-name').attr('data-class')
        Class.Schedule = $('.section-name').attr('data-schedule')
        Class.Title = $('.section-name').attr('data-title')

        let Dates = {}
        for (let dates = 1; dates < arr.length; dates++) {
            let status = arr[dates][name + 1]

            // console.log(status);
            if (status == null) {
                status = ['-', '-']
            } else {
                status = arr[dates][name + 1].split('$');
            }
            Dates[`${arr[dates][0]}`] = {
                Status: FallBackNull(status[0]),
                Remarks: FallBackNull(status[1])
            }
        }
        Class.Dates = Dates
        p_info[arr[0][name]] = {
            Class: {
                [`${$('.section-name').attr('data-class')}`]: Class
            }
        };
    }
    data.push(p_info);
    return data;
}

function AttendanceCounter(arr) {
    let data = []
    let Dates = {}


    for (let dates = 1; dates < arr.length; dates++) {
        var cPresent = 0;
        var cAbsent = 0;
        var cArriveLate = 0;
        var cLeaveEarly = 0;
        for (let names = 0; names < arr[0].length; names++) {
            let status = arr[dates][names + 1]
            if (status == null) {
                status = ['0', '0']
            } else {
                status = arr[dates][names + 1].split('$');
            }

            if (status.includes('present')) {
                cPresent++
            }

            if (status.includes('absent')) {
                cAbsent++
            }

            if (status.includes('arrivelate')) {
                cArriveLate++
            }

            if (status.includes('leaveearly')) {
                cLeaveEarly++
            }


            Dates[`${arr[dates][0]}`] = {
                Date: `${arr[dates][0]}`,
                Present: cPresent,
                Absent: cAbsent,
                ArriveLate: cArriveLate,
                LeaveEarly: cLeaveEarly
            }
        }
    }
    data.push({
        Class: {
            [`${$('.section-name').attr('data-class')}`]: {
                Dates: {
                    Dates
                }
            }

        }
    })
    return data

}




function FacultyAttendance() {

    let time = $('.section-name').attr('data-schedule').split('-')
    let data = {
        [`${$('.section-name').attr('data-prof')}`]: {
            Class: {
                [`${$('.section-name').attr('data-class')}`]: {
                    "Dates": {
                        [dateNow.replaceAll(':', '-')]: {
                            "Status": 'Present'
                        }
                    }
                },
                ClassNbr: `${$('.section-name').attr('data-class')}`,
                Schedule: $('.section-name').attr('data-schedule'),
                Title: $('.section-name').attr('data-title')
            }
        }
    }
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


function CloseSubjectModal() {
    $('#remarks-info').val('');
    $('.subject-modal').css('display', 'none');
}
$('#subject').on(`click`, function () {
    let Class = $('#classname');
    $('.subject-modal').css('display', 'block');
    $('#text-subject').html(Class.attr('data-title'))

    let professor = Class.attr(`data-prof`)

    firebase.database().ref('Data/Subject/').orderByChild('Professor').startAt(professor).endAt(professor).once('value', snap => {
        snap.forEach(subject => {
            $('#set-subject-col').append(`<option value="${subject.child('ClassNbr').val()}"> (${subject.child('ClassNbr').val()}) ${subject.child('Description').val()}</option>`)
        })
    })
})

$(`#subject-save`).on('click', function () {
    SetSelectedAttendance($('#set-subject-col').val())
    CloseSubjectModal()
})



$('.save').on('click', function (e2) {

    e2.stopPropagation()
    console.log(container.attr('data-status'))
    container.attr('data-remarks', remarks.val())
    CloseRemarksModal()

})

function ModalReportOpen(event) {
    //alert('Report-Open');
    let e = window.event
    e.stopPropagation()
    $('.report-modal').css('display', 'block');
}


$('.report-close, #report-cancel').on('click', function (e) {
    $('.report-modal').css('display', 'none');
})


function StudentInfo(event) {
    let id = $(event).attr('data-id');
    console.log(id);

    window.location.href = `StudentInformation.html?id=` + id

}

let parentDateCell = ''

function OpenDateModal(event) {
    let e = window.event
    $('.date-modal').css('display', 'block');

    parentDateCell = $(event).parent()

    console.log($(event).parent().find('#dt-attendance').val())
    let date = FormatDate($(event).prev().val(), 'MM-DD-YY').split('-')

    $('#text-Mdate').html(`Date : ${GetMonth(date[0])} ${date[1]}, ${date[2]}`)
    e.stopPropagation()
}

$('#remove-date').click('click', function () {
    if (confirm('Are you sure you want to delete this attendance column?')) {
        let rowCount = $('table tr').length - 1;
        let cell = parentDateCell.closest('td')
        let dateIndex = cell[0].cellIndex;

        $(`table thead tr td:eq(${dateIndex})`).remove()
        for (let rows = 1; rows < rowCount; rows++) {
            $(`table tr:eq(${rows}) td:eq(${dateIndex})`).remove()
        }
        console.log('Date Removed')
    } else {
        // If user cancel
    }

    CloseDateModal();
})

$('#date-save').on('click', function () {
    let rowCount = $('table tr').length - 1;
    let cell = parentDateCell.closest('td')
    let dateIndex = cell[0].cellIndex;

    for (let rows = 1; rows < rowCount; rows++) {
        $(`table tr:eq(${rows}) td:eq(${dateIndex})`).html(attstatus[$('#set-status-col').val()])
    }


    CloseDateModal()
});

function CloseDateModal() {
    $('.date-modal').css('display', 'none');
}



$('.modal').on('click', function (event) {
    if (event.target == event.currentTarget) {
        $('.modal').css('display', 'none');
    }
})

//CONVERT HTML TABLE TO EXCEL

$('#export').on('click', function (event) {
    var ClassName = document.getElementById("classname").innerHTML;

    $("#myTable").table2excel({
        filename: ClassName + " -Attendance",
        fileext: "xlsx",
        preserveColors: false
    });
})

$('#form').on('click', function (event) {
    var ClassName = document.getElementById("classname").innerHTML;
    $("#myTable").table2excel({
        filename: ClassName + " -AttendanceForm",
        fileext: "xlsx",
        exclude_img: false,
        exclude_links: false,
        exclude_inputs: false,
        exclude: ".excl"
    });
})