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
        <i data-status='present' class='bx bxs-circle att_mark excl' data-remarks="" data-isexcused="false" style="color:#69E486;"><h6>Present</h6></i>
        <button title="Add Remarks" class="remarks" onclick="OpenModal(this)"><i class='bx bxs-notepad'></i></button>
    </div>`,
    absent: `
    <div class="option">
        <button title="Report" class="report" onclick="ModalReportOpen(this)"><i class='bx bxs-error-circle'></i></button>
        <i  data-status='absent' class='bx bxs-circle att_mark excl' data-remarks="" data-isexcused="false" style="color:#FE5277;"><h6>Absent</h6></i>
        <button title="Add Remarks" class="remarks" onclick="OpenModal(this)"><i class='bx bxs-notepad'></i></button>
    </div>`,
    arrivelate: `
    <div class="option">
        <button title="Report" class="report" onclick="ModalReportOpen(this)"><i class='bx bxs-error-circle'></i></button>
        <i  data-status='arrivelate' class='bx bx-chevrons-left att_mark excl' data-remarks="" data-isexcused="false" style="color: #FEB331; "><h6>Late</h6></i>
        <button title="Add Remarks" class="remarks" onclick="OpenModal(this)"><i class='bx bxs-notepad'></i></button>
    </div>`,
    leaveearly: `
    <div class="option">
        <button title="Report" class="report" onclick="ModalReportOpen(this)"><i class='bx bxs-error-circle'></i></button>
        <i data-status='leaveearly' class='bx bx-chevrons-right att_mark excl' data-remarks="" data-isexcused="false" style="color: #FEB331;"><h6>Left Early</h6></i>
        <button title="Add Remarks" class="remarks" onclick="OpenModal(this)"><i class='bx bxs-notepad'></i></button>
    </div>`,
    invalid: `--`
}




$(document).ready(function () {

    if ($(`.section-name`).html().includes(`No schedule for today!`)) {
        $('#btnSubmitAtt').css({
            'display': 'none'
        })
        $('.legend').css({
            'display': 'none'
        })
        $('.attendance-table').css({
            'display': 'none'
        })
    }


    $(`#set-subject-col`).select2({})

    $('.attendance-section').css({
        'display': 'none'
    })
    $('#set-subject-col').select2();

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            let uid = user.uid;
            firebase.database().ref(`User/${uid}/`).once('value', async snap => {
                let Account_Type = snap.child('Account_Type').val();
                let ID = snap.child('ID').val();
                let Role = snap.child('Role').val();
                let UserID = snap.child('UserID').val();
                let Notification = snap.child('Notification').val();
                let Permission_Tapin = snap.child('Permission').child('TapIn_First').val()
                let isAllowAttendance = snap.child('Permission').child('AllowAttendance').val()
                let isNoClassToday = await GetAttendancePermision('NoClassToday')

                if (Account_Type.includes('Administrator')) {
                    //window.location.replace("main.html");

                    $('#add').css({
                        'display': 'none'
                    })

                    $('#btnSubmitAtt').css({
                        'display': 'none'
                    })

                    $(`table td:not(.n)`).css({
                        'background-color': 'red'
                    })
                } else if (Account_Type.includes('Faculty')) {
                    //window.location.replace("main.html");
                    $('.PermissionBTN').css({
                        'display': 'none'
                    })
                } else if (Account_Type.includes('Guidance')) {
                    window.location.replace("main.html");
                    $('.PermissionBTN').css({
                        'display': 'none'
                    })
                } else { // Else
                    window.location.replace("index.html");
                }

                console.log(Permission_Tapin)
                if (Permission_Tapin == true || Permission_Tapin == null) {
                    //  alert('Need to tapin first');


                    $('.tap-first').css({
                        'display': 'flex'
                    })
                    $('.attendance-section').css({
                        'display': 'none'
                    })

                    console.log(FormatDate(dateNow, 'MM-DD-YY'))
                    firebase.database().ref(`Attendance/Gate/${FormatDate(dateNow,'MM-DD-YY')}/`).orderByChild('EnteredID').startAt(UserID).endAt(UserID).limitToLast(1).on('value', snap => {
                        //This will check if professor has already tapin

                        console.log(snap.val())

                        if (snap.val() != null) {
                            // Professor entered the school

                            snap.forEach(data => {

                                // console.log(data.child('Status').val());

                                let status = data.child('Status').val();
                                let location = data.child('Location').val();
                                let time = data.child('Time').val();

                                if (status.includes('IN')) {

                                    if ($('.tap-first').css('display') == 'flex') {
                                        AttendanceProcess()

                                    }

                                } else {
                                    $('.tap-first').css({
                                        'display': 'flex'
                                    })
                                    $('.attendance-section').css({
                                        'display': 'none'
                                    })
                                }
                            })

                        } else {
                            // Professor not yet entered the school
                            return;
                        }
                    });
                } else {
                    console.log('No need to tap in first!');
                    AttendanceProcess()
                }


                function AttendanceProcess() {

                    let AttendanceCapability = true;
                    $('.tap-first').css({
                        'display': 'none'
                    })
                    $('.attendance-section').css({
                        'display': 'block'
                    })
                    console.log(snap.val());
                    firebase.database().ref('Data/Subject/').orderByChild('Professor').startAt(UserID).endAt(UserID).once('value', subjects => {
                        console.log(subjects.val())
                        if (subjects.val() != null) {
                            //Professor has subject
                            subjects.forEach(subject => {


                                $('.section-name').attr('data-prof', UserID);

                                // let time1 = Date.parse('01/01/2000 '+'09:30:0');
                                // let time2 = Date.parse('01/01/2000 '+'09:30:1');


                                let sched = subject.child('Schedule').child('Time').val().split('-');
                                let day = subject.child('Schedule').child('Day').val().toString()
                                let startSched = Date.parse('01/01/2000 ' + sched[0]);
                                let endSched = Date.parse('01/01/2000 ' + sched[1]);


                                var today = new Date();
                                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                                //     alert(time)
                                var timeNow = Date.parse('01/01/2000 ' + time);
                                //  This will check the current time and compare on the schedule on databases
                                // Need to change the time for actual demo

                                var dayNow = GetDay(today.getDay())
                                //    var dayNow = "Tuesday"
                                //   alert(dayNow)
                                //var timeNow = Date.parse('01/01/2000 '+time);
                                console.log(day.includes(dayNow))
                                console.log(timeNow);
                                console.log(startSched + ':' + endSched);
                                //    alert(startSched <= timeNow && timeNow <= endSched && day.includes(dayNow))
                                if (startSched <= timeNow && timeNow <= endSched && day.includes(dayNow)) {

                                    if (Account_Type.includes('Administrator')) {
                                        $('.legend').css({
                                            'display': 'flex'
                                        })
                                        $('.attendance-table').css({
                                            'display': 'block'
                                        })

                                        AttendanceCapability = true;
                                    } else {




                                        //    let isNoClassToday = await GetAttendancePermision('NoClassToday')
                                        if (isAllowAttendance == true) {
                                            alert(`You are now permitted to take attendance`)
                                            $('#btnSubmitAtt').css({
                                                'display': 'block'
                                            })
                                            $('.legend').css({
                                                'display': 'flex'
                                            })
                                            $('.attendance-table').css({
                                                'display': 'block'
                                            })
                                            $('#add').css({'display' : 'block'})
                                            AttendanceCapability = true

                                        } else if (isNoClassToday == true) {
                                            alert(`No class today! You are not allowed to take attendance today! `)
                                            $('.legend').css({
                                                'display': 'flex'
                                            })
                                            $('.attendance-table').css({
                                                'display': 'block'
                                            })
                                            $('#add').css({'display' : 'none'})
                                            AttendanceCapability = false
                                        } else {
                                            $('#btnSubmitAtt').css({
                                                'display': 'block'
                                            })
                                            $('.legend').css({
                                                'display': 'flex'
                                            })
                                            $('.attendance-table').css({
                                                'display': 'block'
                                            })
                                            $('#add').css({'display' : 'block'})
                                            AttendanceCapability = true
                                        }

                                    }
                                    //Match schedule time 
                                    console.log(subject.child('ClassNbr').val());
                                    console.log(subject.child('Title').val());
                                    console.log('Time Match');

                                    $('.section-name').html(subject.child('Title').val());
                                    $('.section-name').attr('data-class', subject.child('ClassNbr').val());
                                    $('.section-name').attr('data-location', subject.child('Location').val());
                                    $('.section-name').attr('data-title', subject.child('Title').val());
                                    $('.section-name').attr('data-schedule', subject.child('Schedule').child('Time').val());

                                    console.log(subject.child('Students').val());

                                    var studentCount = 0;

                                    if (subject.child('Students').val() != null) {

                                        // Prof has no students on this subject

                                        let SortedStudents = subject.child('Students').val().sort((a, b) => a.ID.localeCompare(b.ID));;

                                        // console.log(SortedStudents);

                                        SortedStudents.forEach(students => {

                                            //         console.log(students);

                                            studentCount++;

                                            // let sId = students.child('ID').val()
                                            // let sName = students.child('Name').val()
                                            // $('.name tbody').append(`<tr>
                                            // <td class="n" data-id="${sId}" onclick="StudentInfo(this)">${sName}</td>
                                            // </tr>`);

                                            $('.name tbody').append(`<tr>
                                            <td class="n sticky-col name-col" data-id="${students.ID}" onclick="StudentInfo(this)">${students.Name}</td>
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
                                    } else {
                                        alert('You got no students on this subject')


                                    }



                                    // subject.child('Students').forEach(students => {

                                    //     console.log(students);

                                    //     $('.name tbody').append(`<tr>
                                    //         <td class="n" data-id="${students.child('ID').val()}">${students.child('Name').val()}</td>
                                    //         </tr>`);

                                    // This will append student name on Attendance on first column - Unsorted by Surname
                                    // });

                                } else {
                                    //Not match schedule time
                                    //   alert('Cant find any schedule today!')
                                    //  $('.section-name').html('No Schedule for today!')
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
                            let classID = $(`.section-name`).attr('data-class');
                            firebase.database().ref(`Attendance/Summary/Class/${classID}/Dates/`).once('value', snap => {

                                //This will get existing attendances
                                let rowCount = $('.name tbody tr').length;

                                snap.forEach(dates => {

                                    //        console.log(dates.val())
                                    var table = $('tbody tr .n');
                                    var head = $('thead tr .n');
                                    var foot = $('tfoot tr .n');


                                    studID.forEach(ID => {
                                        firebase.database().ref(`Attendance/Summary/Class/${classID}/Dates/${dates.key}/Student/${ID}/`).once('value', student => {


                                            //    console.log(student.val())
                                            let key = student.key;
                                            let rowId = $('tbody tr .n').attr('data-id');

                                            // $(`tbody tr .n[data-id="${key}"]`).after(`<td>${dates.child('Student').child(key).val()}</td>`)

                                            console.log(student.child('Status').val())


                                            if (attstatus[student.child('Status').val()] == null) {
                                                //This will check if student status if null
                                                if (Account_Type.includes('Administrator') || AttendanceCapability == false) {
                                                    $(`tbody tr .n[data-id="${key}"]`).after(
                                                        `<td>${attstatus[`absent`]}</td>`
                                                    );
                                                    $(`td:not(.n)`).css({
                                                        'pointer-events': 'none'
                                                    })
                                                } else {

                                                    $(`tbody tr .n[data-id="${key}"]`).after(
                                                        `<td>${attstatus[`absent`]}</td>`
                                                    );
                                                }
                                            } else {
                                                //If student status is not null , Append on the status on Table cell by getting the data from attr_status

                                                // $(`tbody tr .n[data-id="${key}"]`).after(
                                                //     `<td>${attstatus[dates.child('Student').child(key).child('Status').val()]}</td>`
                                                // );
                                                if (Account_Type.includes('Administrator') || AttendanceCapability == false) {
                                                    $(`tbody tr .n[data-id="${key}"]`).after(
                                                        `<td>${attstatus[dates.child('Student').child(key).child('Status').val()].replace('data-remarks=""',`data-remarks="${dates.child('Student').child(key).child('Remarks').val()}"`)}</td>`
                                                    );
                                                    $(`td:not(.n)`).css({
                                                        'pointer-events': 'none'
                                                    })
                                                } else {
                                                    $(`tbody tr .n[data-id="${key}"]`).after(
                                                        `<td>${attstatus[dates.child('Student').child(key).child('Status').val()].replace('data-remarks=""',`data-remarks="${dates.child('Student').child(key).child('Remarks').val()}"`)}</td>`
                                                    );
                                                }

                                            }

                                            // This will add student attendance from firebase to table

                                        })
                                    })

                                    // dates.child('Student').forEach(student => {


                                    //     //    console.log(student.val())
                                    //     let key = student.key;
                                    //     let rowId = $('tbody tr .n').attr('data-id');

                                    //     // $(`tbody tr .n[data-id="${key}"]`).after(`<td>${dates.child('Student').child(key).val()}</td>`)

                                    //       console.log(dates.child('Student').child(key).key == key)


                                    //     if (attstatus[dates.child('Student').child(key).child('Status').val()] == null) {
                                    //         //This will check if student status if null
                                    //         $(`tbody tr .n[data-id="${key}"]`).after(
                                    //             `<td>--</td>`
                                    //         );
                                    //     } else {
                                    //         //If student status is not null , Append on the status on Table cell by getting the data from attr_status

                                    //         // $(`tbody tr .n[data-id="${key}"]`).after(
                                    //         //     `<td>${attstatus[dates.child('Student').child(key).child('Status').val()]}</td>`
                                    //         // );

                                    //         $(`tbody tr .n[data-id="${key}"]`).after(
                                    //             `<td>${attstatus[dates.child('Student').child(key).child('Status').val()].replace('data-remarks=""',`data-remarks="${dates.child('Student').child(key).child('Remarks').val()}"`)}</td>`
                                    //         );
                                    //     }

                                    //     // This will add student attendance from firebase to table
                                    // });

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

async function GetAttendancePermision(name) {
    let permission = await firebase.database().ref('Data/GlobalPermission/').once('value').then()
    return permission.child(name).val()
}

function SetSelectedAttendance(SubjectID) {
    $('#btnSubmitAtt').css({
        'display': 'block'
    })
    $('.legend').css({
        'display': 'flex'
    })
    $('.attendance-table').css({
        'display': 'block'
    })
    let AttendanceCapability = true;
    $('.name tbody').html('')
    $('.name thead td:not(.n)').remove()
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
                let PermissionAttendance = snap.child('Permission').child('AllowAttendance').val()

                firebase.database().ref('Data/Subject/').orderByChild('ClassNbr').startAt(SubjectID).endAt(SubjectID).once('value', subjects => {

                    console.log(subjects.val())
                    subjects.forEach(async subject => {
                        let classNbr = subject.child('ClassNbr').val();
                        let location = subject.child('Location').val()
                        let title = subject.child('Title').val();
                        let schedule = subject.child('Schedule').child('Time').val();
                        let day = subject.child('Schedule').child('Day').val()

                        console.log();
                        console.log(subject.child('Title').val());
                        console.log('Time Match');

                        $('.section-name').html(subject.child('Title').val());
                        $('.section-name').attr('data-prof', UserID);
                        $('.section-name').attr('data-class', classNbr);
                        $('.section-name').attr('data-location', location);
                        $('.section-name').attr('data-title', title);
                        $('.section-name').attr('data-schedule', schedule);


                        let sched = schedule.split('-');
                        let startSched = Date.parse('01/01/2000 ' + sched[0]);
                        let endSched = Date.parse('01/01/2000 ' + sched[1]);
                        var today = new Date();
                        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

                        //     alert(time)
                        var timeNow = Date.parse('01/01/2000 ' + time);
                        //  This will check the current time and compare on the schedule on databases
                        // Need to change the time for actual demo

                        var dayNow = GetDay(today.getDay())
                        //     var dayNow = "Monday"
                        //   alert(dayNow)
                        //var timeNow = Date.parse('01/01/2000 '+time);
                        console.log(day.includes(dayNow))
                        console.log(timeNow);
                        console.log(startSched + ':' + endSched);
                        let isNoClassToday = await GetAttendancePermision('NoClassToday')
                        //    alert(startSched <= timeNow && timeNow <= endSched && day.includes(dayNow))
                        if (startSched <= timeNow && timeNow <= endSched && day.includes(dayNow) && isNoClassToday == false) {

                            alert(`This is the schedule now`)
                            $(`#add`).css({
                                'display': 'block'
                            })
                            $(`#btnSubmitAtt`).css({
                                'display': 'block'
                            })
                            $('#add').css({'display' : 'block'})
                            AttendanceCapability = true
                            //this will check the eligibility of attendance 

                        } else if (isNoClassToday == true) {
                            alert(`No class today! You are not allowed to take attendance today! `)
                            $(`#btnSubmitAtt`).css({
                                'display': 'none'
                            })
                            $(`#add`).css({
                                'display': 'none'
                            })
                            $('#add').css({'display' : 'none'})
                            AttendanceCapability = false
                        } else {

                        
                            if (PermissionAttendance == true) {
                                alert(`You are now permitted to take attendance`)
                                $(`#add`).css({
                                    'display': 'block'
                                })
                                $(`#btnSubmitAtt`).css({
                                    'display': 'block'
                                })
                                $('#add').css({'display' : 'block'})
                                AttendanceCapability = true
                            } else if (isNoClassToday == true) {
                                alert(`No class today! You are not allowed to take attendance today! `)
                                $(`#btnSubmitAtt`).css({
                                    'display': 'none'
                                })
                                $(`#add`).css({
                                    'display': 'none'
                                })
                                $('#add').css({'display' : 'none'})
                                AttendanceCapability = false
                            } else {

                                alert(`This is not your current schedule! This attendance is for viewing purpose only`)
                                $(`#btnSubmitAtt`).css({
                                    'display': 'none'
                                })
                                $(`#add`).css({
                                    'display': 'none'
                                })
                                $('#add').css({'display' : 'none'})
                                AttendanceCapability = false
                            }

                        }

                        //      console.log(subject.child('Students').val());
                        if (subject.child('Students').val() != null) {
                            var studentCount = 0;

                            let SortedStudents = subject.child('Students').val().sort((a, b) => a.Name.localeCompare(b.Name));;

                            //      console.log(SortedStudents);

                            SortedStudents.forEach(students => {

                                //         console.log(students);

                                studentCount++;

                                $('.name tbody').append(`<tr>
                                                        <td class="n sticky-col name-col" data-id="${students.ID}" onclick="StudentInfo(this)">${students.Name}</td>
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

                            let studID = [];
                            $('.name tbody tr').each(function (index, item) {
                                console.log($(this).find('.n').attr('data-id'));
                                console.log(index);
                                //Get list of names
                                studID.push($(this).find('.n').attr('data-id'))

                            });

                            console.log(studID)

                            let dateRowIndex = 0;
                            let classID = $(`.section-name`).attr('data-class');
                            firebase.database().ref(`Attendance/Summary/Class/${classID}/Dates/`).once('value', snap => {

                                //This will get existing attendances
                                let rowCount = $('.name tbody tr').length;

                                snap.forEach(dates => {

                                    //        console.log(dates.val())
                                    var table = $('tbody tr .n');
                                    var head = $('thead tr .n');
                                    var foot = $('tfoot tr .n');


                                    studID.forEach(ID => {
                                        firebase.database().ref(`Attendance/Summary/Class/${classID}/Dates/${dates.key}/Student/${ID}/`).once('value', student => {


                                            //    console.log(student.val())
                                            let key = student.key;
                                            let rowId = $('tbody tr .n').attr('data-id');

                                            // $(`tbody tr .n[data-id="${key}"]`).after(`<td>${dates.child('Student').child(key).val()}</td>`)

                                            console.log(student.child('Status').val())


                                            if (attstatus[student.child('Status').val()] == null) {
                                                //This will check if student status if null
                                                if (Account_Type.includes('Administrator') || AttendanceCapability == false) {
                                                    $(`tbody tr .n[data-id="${key}"]`).after(
                                                        `<td>${attstatus[`absent`]}</td>`
                                                    );
                                                    $(`td:not(.n)`).css({
                                                        'pointer-events': 'none'
                                                    })
                                                    $(`.remarks`).css({
                                                        'pointer-events': 'auto'
                                                    })
                                                } else {

                                                    $(`tbody tr .n[data-id="${key}"]`).after(
                                                        `<td>${attstatus[`absent`]}</td>`
                                                    );
                                                }
                                            } else {
                                                //If student status is not null , Append on the status on Table cell by getting the data from attr_status

                                                // $(`tbody tr .n[data-id="${key}"]`).after(
                                                //     `<td>${attstatus[dates.child('Student').child(key).child('Status').val()]}</td>`
                                                // );
                                                if (Account_Type.includes('Administrator') || AttendanceCapability == false) {
                                                    $(`tbody tr .n[data-id="${key}"]`).after(
                                                        `<td>${attstatus[dates.child('Student').child(key).child('Status').val()].replace('data-remarks=""',`data-remarks="${dates.child('Student').child(key).child('Remarks').val()}"`)}</td>`
                                                    );
                                                    $(`td:not(.n)`).css({
                                                        'pointer-events': 'none'
                                                    })
                                                    $(`.remarks`).css({
                                                        'pointer-events': 'auto'
                                                    })
                                                } else {
                                                    $(`tbody tr .n[data-id="${key}"]`).after(
                                                        `<td>${attstatus[dates.child('Student').child(key).child('Status').val()].replace('data-remarks=""',`data-remarks="${dates.child('Student').child(key).child('Remarks').val()}"`)}</td>`
                                                    );
                                                }

                                            }

                                            // This will add student attendance from firebase to table

                                        })
                                    })

                                    // dates.child('Student').forEach(student => {


                                    //     //    console.log(student.val())
                                    //     let key = student.key;
                                    //     let rowId = $('tbody tr .n').attr('data-id');

                                    //     // $(`tbody tr .n[data-id="${key}"]`).after(`<td>${dates.child('Student').child(key).val()}</td>`)

                                    //       console.log(dates.child('Student').child(key).key == key)


                                    //     if (attstatus[dates.child('Student').child(key).child('Status').val()] == null) {
                                    //         //This will check if student status if null
                                    //         $(`tbody tr .n[data-id="${key}"]`).after(
                                    //             `<td>--</td>`
                                    //         );
                                    //     } else {
                                    //         //If student status is not null , Append on the status on Table cell by getting the data from attr_status

                                    //         // $(`tbody tr .n[data-id="${key}"]`).after(
                                    //         //     `<td>${attstatus[dates.child('Student').child(key).child('Status').val()]}</td>`
                                    //         // );

                                    //         $(`tbody tr .n[data-id="${key}"]`).after(
                                    //             `<td>${attstatus[dates.child('Student').child(key).child('Status').val()].replace('data-remarks=""',`data-remarks="${dates.child('Student').child(key).child('Remarks').val()}"`)}</td>`
                                    //         );
                                    //     }

                                    //     // This will add student attendance from firebase to table
                                    // });

                                    head.after(`<td><div class="date-header"><input id="dt-attendance" value="${FormatDate(dates.child('Date').val(),'YY-MM-DD')}" type="date" max="2021-10-31"/> <i class='bx bx-dots-vertical-rounded' onclick="OpenDateModal(this)"></i></div></td>`);
                                    foot.after(`<td><div class="date-header"><input id="dt-attendance" value="${FormatDate(dates.child('Date').val(),'YY-MM-DD')}" type="date" max="2021-10-31"/> <i class='bx bx-dots-vertical-rounded' onclick="OpenDateModal(this)"></i></div></td>`);
                                    // This will add student attendance dates from firebase to table
                                    // $(`input[type="date"]`).attr('value',FormatDate(dates.child('Date').val(),'YY-MM-DD'));

                                    //       console.log(FormatDate(dates.child('Date').val(), 'YY-MM-DD'));
                                    dateRowIndex++;
                                })



                            });
                        } else {
                            alert('You got no students')
                        }


                    })
                })

            })
        }
    })

}


$('#add').click(function () {

    console.log(FormatDate(GetDateNow(), 'YY-MM-DD'))
    let dates = []
    $(`input[type=date]`).each(function () {
        dates.push($(this).val())
    })
    console.log(dates)
    if (dates.includes(FormatDate(GetDateNow(), 'YY-MM-DD'))) {
        alert('Date now already exists!')
    } else {
        if (!$(`.section-name`).html().includes(`No schedule for today!`)) {
            //This will add new column on attendance
            var table = $('tbody tr .n');
            var head = $('thead tr .n');
            var foot = $('tfoot tr .n');

            let date = new Date(GetDateNow())
            date.setDate(date.getDate() + 30)
            let month = date.getMonth() + 1;
            let day = date.getDate()
            let year = date.getFullYear()

            let maxDate = FormatDate(`${month}-${day}-${year}`, `MM-DD-YY`)

            //  alert(maxDate)

            table.after(`<td class="excl">${attstatus.present}</td>`);
            head.after(`<td><div class="date-header"><input id="dt-attendance" value="${FormatDate(dateNow.replaceAll(':','-'),'YY-MM-DD')}" type="date" max="${FormatDate(maxDate,'YY-MM-DD')}"/> <i class='bx bx-dots-vertical-rounded' onclick="OpenDateModal(this)"></i></div></td>`);
            foot.after(`<td><div class="date-header"><input id="dt-attendance" value="${FormatDate(dateNow.replaceAll(':','-'),'YY-MM-DD')}" type="date" max="${FormatDate(maxDate,'YY-MM-DD')}"/> <i class='bx bx-dots-vertical-rounded' onclick="OpenDateModal(this)"></i></div></td>`);

        } else {
            alert(`Select subject first!`)
        }
    }


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
            $(this).html(attstatus[Object.keys(attstatus)[4]]);
        }

        console.log(value);
    }


});


$('#dt-attendance').bind("change paste keyup", function () {
    $('input[type=date]').val($(this).val());
});

$('#btnSubmitAtt').click(function () {


    //  alert($('#dt-attendance').val());

    // let td = $(`td[data-status="unknown"]`).html()
    // alert(td)
    // if (td === '--') {
    //     alert('Invalid Attendance \n Please check attendance again')
    //     return
    // }

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
                console.log(cValue)
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


    FacultyAttendance()
    // console.log(FacultyAttendance())
    // This will add data Faculty Attendance  on firebase
    // FacultyAttendance().forEach(attendance => {
    //     console.log(attendance)
    //     //This will add data Student Attendance converted array to JSON on firebase
    //     //    firebase.database().ref(`Attendance/Summary/Student/`).update(attendance);

    //     for (const [key, value] of Object.entries(attendance)) {
    //         //   firebase.database().ref(`Attendance/Summary/Student/${key}/Class/${value.Class.key}`).update(attendance);

    //        console.log(key)

    //         for (const [cKey, cValue] of Object.entries(value.Class)) {
    //            console.log(cValue)
    //            firebase.database().ref(`Attendance/Summary/Faculty/${key}/Class/${cKey}`).update(cValue);


    //            for(const [bKey , bValue] of Object.entries(cValue.Dates))
    //            {
    //                console.log(bValue)
    //                console.log(bKey)

    //           //     firebase.database().ref(`Attendance/Summary/Faculty/${key}/Class/${cKey}/Dates/${bKey}/`).update(bValue);

    //            }
    //         }
    //     }

    // })
    //  firebase.database().ref(`Attendance/Summary/Faculty/`).update(FacultyAttendance());
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
        Class.Professor = $('.section-name').attr('data-prof')

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
            let remarks = status[1]
            console.log('Remarks : ' + remarks)
            if(!remarks.includes('Excused'))
            {
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
                ClassNbr: $('.section-name').attr('data-class'),
                Schedule: $('.section-name').attr('data-schedule'),
                Title: $('.section-name').attr('data-title'),
                Professor: $('.section-name').attr('data-prof'),
                Dates: {
                    Dates
                }
            }

        }
    })
    return data

}




function FacultyAttendance() {

    let arr = [];
    let time = $('.section-name').attr('data-schedule').split('-')
    let profID = `${$('.section-name').attr('data-prof')}`
    let sectionID = `${$('.section-name').attr('data-class')}`;
    let sectionSchedule = $('.section-name').attr('data-schedule')
    let sectionTitle = $('.section-name').attr('data-title')

    firebase.database().ref(`Attendance/Summary/Faculty/${profID}/Class/${sectionID}`).update({
        ClassNbr: sectionID,
        Title: sectionTitle,
        Schedule: sectionSchedule
    })
    firebase.database().ref(`Attendance/Summary/Faculty/${profID}/Class/${sectionID}/Dates/`).update({
        [dateNow.replaceAll(':', '-')]: {
            "Status": 'Present'
        }
    })

}

var container = ''
var remarks = ''
var isExcused = ''

function OpenModal(event) {


    let e = window.event
    container = $(event).parent().find('.att_mark');
    remarks = $('#remarks-info');

    isExcused = $('#isExcused')
    $('.remarks-modal').css('display', 'block');

    console.log(container.attr('class'));
    remarks.val(container.attr('data-remarks'))
   // console.log(container.attr('data-isexcused'))

    if(remarks.val().includes('Excused'))
    {
        isExcused.attr('checked',true)
    }
    else
    {
        isExcused.attr('checked',false)
    }

    let person = $(event).parent().parent().parent().find('.n');
    let name = person.html()
    let id = person.attr('data-id')


    if ($('#btnSubmitAtt').is(":visible")) {
        //  alert('visible')
        $(`.save`).css({
            'display': 'block'
        })
        $(`#remarks-info`).prop("disabled", false)
    } else {
        //   alert('hidden')
        $(`.save`).css({
            'display': 'none'
        })
        $(`#remarks-info`).prop("disabled", true)
    }

    $(`.remarks-name`).html(name)
    $(`.remarks-id`).html(id)

    e.stopPropagation()

}

function CloseRemarksModal() {
    $('#remarks-info').val('');
    $('.remarks-modal').css('display', 'none');
    isExcused.prop('checked',false)
}


function CloseSubjectModal() {
    $('#remarks-info').val('');
    $('.subject-modal').css('display', 'none');
}
$('#subject').on(`click`, function () {
    let Class = $('#classname');
    $('#set-subject-col').html('')
    $('.subject-modal').css('display', 'block');
    $('#text-subject').html(Class.attr('data-title'))

    let professor = Class.attr(`data-prof`)

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            let uid = user.uid
            firebase.database().ref(`User/${uid}/`).once('value', snap => {
                let Account_Type = snap.child('Account_Type').val();
                let ID = snap.child('ID').val();
                let Role = snap.child('Role').val();
                let UserID = snap.child('UserID').val();
                let Notification = snap.child('Notification').val();
                let Permission_Tapin = snap.child('Permission').child('TapIn_First').val()



                if (Account_Type.includes('Administrator')) {

                    firebase.database().ref('Data/Subject/').once('value', snap => {

                        console.log(snap.val())
                        snap.forEach(subject => {
                            $('#set-subject-col').append(`<option value="${subject.child('ClassNbr').val()}"> (${subject.child('ClassNbr').val()}) ${subject.child('Title').val()}</option>`)
                        })
                    })
                } else if (Account_Type.includes('Faculty')) {

                    firebase.database().ref('Data/Subject/').orderByChild('Professor').startAt(professor).endAt(professor).once('value', snap => {

                        console.log(snap.val())
                        snap.forEach(subject => {
                            $('#set-subject-col').append(`<option value="${subject.child('ClassNbr').val()}"> (${subject.child('ClassNbr').val()}) ${subject.child('Title').val()}</option>`)
                        })
                    })
                } else if (Account_Type.includes('Guidance')) {} else { // Else
                }
            })
        } else {

        }
    })

})

$(`#subject-save`).on('click', function () {
    SetSelectedAttendance($('#set-subject-col').val(), `Faculty`)
    CloseSubjectModal()
})



$('.save').on('click', function (e2) {

    e2.stopPropagation()
    console.log(container.attr('data-status'))
    container.attr('data-remarks', remarks.val())
    container.attr('data-isexcused',isExcused.is(':checked'))
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

    let subject = $('.section-name').attr('data-class')
    let title = $('.section-name').attr('data-title')
    window.location.href = `studentinformation.html?id=${id}&sub=${subject}&title=${title}`

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
    if (!$(`.section-name`).html().includes(`No schedule for today!`)) {
        var ClassName = document.getElementById("classname").innerHTML;

        $("#myTable").table2excel({
            filename: ClassName + " -Attendance",
            fileext: "xlsx",
            preserveColors: false
        });
    } else {
        alert(`Select subject first!`)
    }
})

$('#form').on('click', function (event) {
    if (!$(`.section-name`).html().includes(`No schedule for today!`)) {
        var ClassName = document.getElementById("classname").innerHTML;
        $("#myTable").table2excel({
            filename: ClassName + " -AttendanceForm",
            fileext: "xlsx",
            exclude_img: false,
            exclude_links: false,
            exclude_inputs: false,
            exclude: ".excl"
        });
    } else {
        alert(`Select subject first!`)
    }
})

$('#isExcused').click(function()
{
  
    if($(this).is(':checked'))
    {
        $('#remarks-info').val($('#remarks-info').val() + '[Excused]')
    }
    else
    {
        $('#remarks-info').val($('#remarks-info').val().replace('[Excused]',''))
    }
})