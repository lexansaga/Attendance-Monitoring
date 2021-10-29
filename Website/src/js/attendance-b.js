var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDate();

var dateNow = month + ':' + day + ':' + year;


var hour = date.getHours();
var minute = date.getMinutes();
var seconds = date.getSeconds();

var timeNow = hour + ':' + minute + ':' + seconds;

let thead = $('.name thead tr')
let tbody = $('.name tbody tr')

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

                                console.log(subject.child('Students').val());
                                var studentCount = 0;

                                let studentsUnsorted = [];
                                subject.child('Students').forEach(students => {

                                    console.log(students.val());

                                    studentCount++;
                                    $('.name tbody').append(`<tr>
                                        <td class="n" data-id="${students.child('ID').val()}">${students.child('Name').val()}</td>
                                        </tr>`);


                                });
                            } else {
                                //Not match schedule time
                                console.log('Cant find schedule!')
                            }

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


    var table = $('tbody tr .n');
    var head = $('thead tr .n');
    var foot = $('tfoot tr .n');

    table.after(`<td></td>`);
    //   headfoot.after(`<td><input type="date"  value='${year + '-' + month + '-' + day}'/></td>`);
    head.after(`<td><input id="dt-attendance" type="date" /></td>`);
    foot.after(`<td><input type="date" disabled /></td>`);

});

$().click(function () {});




var attstatus = {
    Present: `<i  data-status='present' class='bx bxs-circle' style="color:#69E486;"></i>
    <div class="option">
        <button title="Report" class="report" onclick="OpenModal()"><i class='bx bxs-user-x' ></i></button>
        <button title="Add Remarks" class="remarks" onclick="OpenModal()"><i class='bx bxs-notepad'></i></button>
    </div>`,
    Absent: `<i data-status='absent' class='bx bxs-circle' style="color:#FE5277;"></i>
    <div class="option">
        <button title="Report" class="report" onclick="OpenModal()"><i class='bx bxs-user-x' ></i></button>
        <button title="Add Remarks" class="remarks" onclick="OpenModal()"><i class='bx bxs-notepad'></i></button>
    </div>`,
    ArriveLate: `<i data-status='arrivelate' class='bx bx-chevrons-left' style="color: #FEB331; "></i>
    <div class="option">
        <button title="Report" class="report" onclick="OpenModal()"><i class='bx bxs-user-x' ></i></button>
        <button title="Add Remarks" class="remarks" onclick="OpenModal()"><i class='bx bxs-notepad'></i></button>
    </div>`,
    LeaveEarly: `<i data-status='leaveearly' class='bx bx-chevrons-right' style="color: #FEB331;"></i>
    <div class="option">
        <button title="Report" class="report" onclick="OpenModal()"><i class='bx bxs-user-x' ></i></button>
        <button title="Add Remarks" class="remarks" onclick="OpenModal()"><i class='bx bxs-notepad'></i></button>
    </div>`
}

$('table').on('click', 'tbody tr td:not(".n")', function () {
    //  alert($(this).html());

    if ($('#dt-attendance').val() == '') {
        alert("Select date first!");

    } else {

        var value = $(this).children().attr('data-status');
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
                var att_status = $(`table tr:eq(${row}) td:eq(${col}) i`).attr('data-status');

                console.log('Status : ' + att_status);

                rowData.push(att_status)
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

    console.log(AttendanceJSON(colData));

    AttendanceJSON(colData).forEach(attendance => {
        var key = firebase.database().ref(`Attendance/Summary/Class/`).push().key;
        firebase.database().ref(`Attendance/Summary/Class/`).update({
            [`${key}`]: attendance
        });
    })
    // var aData = [];

    // var dates = [];
    // var names = [];
    // var status = []
    // $('.name tr').each(function (index, item) {
    //     let itemVal = $(item).text();

    //     let status2 = []
    //     //  console.log(content);
    //     for (let a = 0; a < columnCount; a++) {

    //         var content = $(`table tr:eq(${index}) td:eq(${a})`).html();


    //         if (content.includes('dt-attendance')) {

    //             var att_date = $(`table tr:eq(${index}) td:eq(${a}) input`).val();
    //             console.log(FormatDate(att_date, 'MM-DD-YY'));
    //             //   dates.push(FormatDate(att_date, 'MM-DD-YY'));

    //             dates.push(att_date);

    //         } else if (content.includes('data-status')) {
    //             var att_status = $(`table tr:eq(${index}) td:eq(${a}) i`).attr('data-status');
    //             //   attendances.push(att_status);

    //             status2.push(att_status);     
    //             //aData.push(att_status);
    //             console.log('Status : '+att_status);
    //         } else {

    //             console.log(content);
    //             //aData.push(content);
    //             var id = $(`table tr:eq(${index}) td:eq(${a})`).attr('data-id')
    //             if (id != null) {
    //                 names.push(id)
    //             }

    //         }



    //     }

    //     status.push(status2)
    //     //  attendances.push(data);

    //     //data = {};

    //     //  attendances[`${att_date[index]}}`] =  attstatus ;

    // });

    // aData.push({
    //     dates,
    //     status,
    //     names
    // })
    // console.log(aData);



});


function AttendanceJSON(arr) {
    let data = [];

    for (var arrLength = 1; arrLength < arr.length; arrLength++) {

        let tempData = {};
        tempData.Date = arr[arrLength][0]
        tempData.ClassNbr = $('.section-name').attr('data-class')
        tempData.Day = dateNow
        tempData.Professor = $('.section-name').attr('data-prof')
        tempData.Time = GetClockNow()
        tempData.TimeStamp = Date.now()

        var Student = {}
        for (var names = 0; names < arr[0].length; names++) {
            Student[arr[0][names]] = arr[arrLength][names + 1];
        }
        tempData.Student = Student

        data.push(tempData);
    }

    return data;

}

function OpenModal() {
    $('.modal:eq(0)').css('display', 'block');
}

function CloseModal() {
    $('.modal:eq(0)').css('display', 'none');
}