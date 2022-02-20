var unformmated_date = new Date();
var month = unformmated_date.getMonth() + 1;
var year = unformmated_date.getFullYear();
var day = unformmated_date.getDate();
var date = month + '-' + day + '-' + year;
$(document).ready(function () {

    var url = new URL(window.location.href);

    // console.log(url.searchParams.get('id'));

    sOnLoadMediaQuery();
    sMediaQuery();
    Chart.defaults.global.defaultFontFamily = "Karla";
    PieChart();
    LineChart();

    $(".professor").click(function () {
        window.location = "../../entered.html"
    });







    $('.d-item-main').click(function () {
        window.location.href = 'profile.html';
    });




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

            let present = $('#cnt_present')
            let absent = $('#cnt_absent')
            let late = $('#cnt_late')


            present.html('0')
            absent.html('0')
            late.html('0')


            if (Account_Type.includes('Administrator')) {
                LoadAcademicYear() 
                StatusCounter(FormatDate(GetDateNow(), 'MM-DD-YY'), 'present', present)
                StatusCounter(FormatDate(GetDateNow(), 'MM-DD-YY'), 'absent', absent)
                StatusCounter(FormatDate(GetDateNow(), 'MM-DD-YY'), 'arrivelate', late)


                StudentCounter(0, Account_Type, $('#cnt_students'))

                Entered(Account_Type, UserID)


                LoadChart(Account_Type, UserID)
            }
            if (Account_Type.includes('Guidance')) {


                StatusCounter(FormatDate(GetDateNow(), 'MM-DD-YY'), 'present', present)
                StatusCounter(FormatDate(GetDateNow(), 'MM-DD-YY'), 'absent', absent)
                StatusCounter(FormatDate(GetDateNow(), 'MM-DD-YY'), 'arrivelate', late)

                StudentCounter(0, Account_Type, $('#cnt_students'))

                Entered(Account_Type, UserID)

                LoadChart(Account_Type, UserID)

            }
            if (Account_Type.includes('Faculty')) {
                //alert('Faculty')


                FacultyStatusCounter(UserID, FormatDate(GetDateNow(), 'MM-DD-YY'), 'present', present)
                FacultyStatusCounter(UserID, FormatDate(GetDateNow(), 'MM-DD-YY'), 'absent', absent)
                FacultyStatusCounter(UserID, FormatDate(GetDateNow(), 'MM-DD-YY'), 'arrivelate', late)


                StudentCounter(UserID, Account_Type, $('#cnt_students'))

                Entered(Account_Type, UserID)


                LoadChart(Account_Type, UserID)
            }

            if (Account_Type.includes('Gate')) {
                window.location.href = '../../gatetapin.html'
            }


            firebase.database().ref('Data/Faculty/Information/' + UserID).on('value', uidsnap => {
                //   console.log(uidsnap.val());
                let profile = uidsnap.child('Profile').val();
                // let name = uidsnap.child('Name').val().split('&&');
                let name = [];
                let address = uidsnap.child('Address').val();
                let department = uidsnap.child('Department').val();
                let contact = uidsnap.child('Contact').val();
                //    console.log('Profile:'+profile);
                //    console.log('Name:'+name);
                //    console.log("Debug:");
                uidsnap.child('Name').forEach(names => {
                    name.push(names.val());
                });
                console.log(name[0]);

                $('#d-profile').attr('src', profile);
                $('#d-name').html(name[1] + ", " + name[0]);
                $('#d-pos').html(Account_Type);


            });
        });
        // ...
    } else {
        // User is signed out
        // ...
        window.location.replace("index.html");
    }
});

function LoadAcademicYear() {
    firebase.database().ref('Settings/Term/').once('value', terms => {
        let termstart = terms.child('TermStart').val()
        let termend = terms.child('TermEnd').val()
        let semester = terms.child('Semester').val()
        let acadYear = terms.child('AcademicYear').val()
        
        let nextsemester = ''
        let newAcademicYear = ''
        let nextYearAcademic = ''
        var semDic = {
            FirstSemester: 'First_Semester',
            SecondSemester: 'Second_Semester',
            Summer: 'Summer'
        }
        termStart = termstart.split('-')
        termEnd = termend.split('-')
        acadYearSplice = acadYear.split('-')

        if (semester.includes('First')) {
            nextsemester = semDic[Object.keys(semDic)[1]]
            newAcademicYear = `${termStart[0]} - ${termEnd[0]} ${nextsemester}`
           
            nextYearAcademic = `${acadYearSplice[0]} - ${acadYearSplice[1]}`.split('-')
        } else if (semester.includes('Second')) {
            nextsemester = semDic[Object.keys(semDic)[2]]
            newAcademicYear = `${termStart[0]} - ${termEnd[0]} ${nextsemester}`
           
            nextYearAcademic = `${acadYearSplice[0]} - ${acadYearSplice[1]}`.split('-')
        } else {
            nextsemester = semDic[Object.keys(semDic)[0]]
            newAcademicYear = `${parseInt(termStart[0]) + 1} - ${parseInt(termEnd[0]) + 1} ${nextsemester}`
           
            nextYearAcademic = `${parseInt(acadYearSplice[0]) + 1} - ${parseInt(acadYearSplice[1]) + 1}`.split('-')
        }
        let dateNow = FormatDate(GetDateNow(), 'MM-DD-YY').split('-')
        if (DiffMonthYear(termstart, termend, `${dateNow[2]}-${dateNow[0]}`)) {
            if (confirm(` Academic Year ${acadYear} ${semester} is now proceeding! Proceed now on new Academic Year and Term ${newAcademicYear}`)) {

                sessionStorage.setItem('NEXT_SEMESTER',nextsemester)
                sessionStorage.setItem(`CURRENT_SEMESTER`,`${termStart[0]}-${termEnd[0]}_${semester}`)
                window.location.href = 'termsetting.html'

            } else {

            }
        }

    })

}

function StatusCounter(date, status, object) {

    var statusCountInit = 0
    firebase.database().ref('Attendance/Summary/Class/').once('value', classes => {
        if (classes.val() != null) {
            classes.forEach(aclass => {
                let classKey = aclass.key;
                firebase.database().ref(`Attendance/Summary/Class/${classKey}/Dates/${date}/`).once('value', attendance => {
                    if (attendance.val() != null) {
                        //  console.log(attendance.val())
                        firebase.database().ref(`Attendance/Summary/Class/${classKey}/Dates/${date}/Student/`).orderByChild('Status').startAt(status).endAt(status).once('value', statusCount => {
                            let excused = 0;
                            statusCount.forEach(status => {
                                let remarks = status.child('Remarks').val();
                                if (remarks.includes('Excused')) {
                                    excused += 1
                                }
                            })
                            if (statusCount.val() != null) {
                                //    console.log(statusCount.val())
                                statusCountInit += statusCount.numChildren()
                                object.html(statusCountInit - excused)
                            }
                        })
                    }

                })
            })


        }

    })

    PieChart()
}

function FacultyStatusCounter(id, date, status, object) {

    var statusCountInit = 0;

    firebase.database().ref('Attendance/Summary/Class/').orderByChild('Professor').startAt(id).endAt(id).once('value', classes => {

        if (classes.val() != null) {
            classes.forEach(aclass => {
                let classKey = aclass.key;
                console.log(classKey)
                firebase.database().ref(`Attendance/Summary/Class/${classKey}/Dates/${date}/`).once('value', attendance => {

                    if (attendance.val() != null) {

                        firebase.database().ref(`Attendance/Summary/Class/${classKey}/Dates/${date}/Student/`).orderByChild('Status').startAt(status).endAt(status).once('value', statusCount => {

                            if (statusCount.val() != null) {
                                statusCountInit += statusCount.numChildren()
                                object.html(statusCountInit)
                                // console.log(statusCount.val())
                                // console.log()
                                PieChart()
                            }


                        })

                    }

                })
            })

        }

    })


}

function StudentCounter(id, account_type, object) {
    if (account_type.includes('Faculty')) {
        let studentArr = []
        let studentCount = 0
        firebase.database().ref(`Data/Subject/`).orderByChild('Professor').startAt(id).endAt(id).once("value", snap => {
            if (snap.val() != null) {
                console.log(snap.val())
                let studentCount = 0;

                snap.forEach(subject => {
                    //  studentCount += subject.child('Students').numChildren();

                    let students = subject.child('Students')
                    students.forEach(student => {
                        studentArr.push(student.child('ID').val())
                    })

                })
                var arr = [...new Set(studentArr)] //This will remove duplicates
                console.log(arr)
                object.html(arr.length)
            }


        });
    } else {
        firebase.database().ref(`Data/Student/Information/`).once("value", snap => {
            console.log(snap.val())

            object.html(snap.numChildren())

        });
    }
}

function sOnLoadMediaQuery() {
    //  alert("sOnload");
    var width = $(window).width();
    var height = $(window).height();
    if (width > 768) {
        // alert("Desktop");


    } else if (width < 768 && width > 425) {
        //  alert("Tablet");
        ChartSizes();
        //   DashBoardResponsive();


    } else if (width < 425) {
        //   alert("Mobile");
        ChartSizes();
        //  DashBoardResponsive();

    }

}

function Entered(account_type, id) {

    if (account_type.includes('Faculty')) {
        //Check if the user type is Faculty
        firebase.database().ref('Data/Subject/').orderByChild('Professor').startAt(id).endAt(id).once('value', subjects => {
            let arrstudent = []
            subjects.forEach(subject => {
                // Get all the subjects of the professor
                //      console.log(subject.val())
                subject.child('Students').forEach(student => {
                    //          console.log(student.child('ID').val())
                    arrstudent.push(student.child('ID').val())

                    //Append student ID of the professor Student on the arrstudent array
                })


            })

            console.log(arrstudent)
            firebase.database().ref(`Attendance/Gate/${FormatDate(GetDateNow(),'MM-DD-YY')}`).orderByKey().limitToLast(5).on('value', attendance => {

                $('.prof_container > ul ').html(' ');

                attendance.forEach(student => {


                    //Get Attendance for todays date
                    Object.keys(student).reverse();
                    let enteredID = student.child('EnteredID').val();
                    let status = student.child('Status').val()
                    if (arrstudent.includes(enteredID)) {
                        //Check if the entered ID has on professor student by comparing arrstudent on enteredID
                        firebase.database().ref(`Data/Student/Information/${enteredID}`).on('value', enter => {
                            let last = enter.child('Name').child('Last').val()
                            let first = enter.child('Name').child('First').val()
                            let middle = enter.child('Name').child('Middle').val()

                            let profile = enter.child('Profile').val()

                            let colorStatus = status.toLowerCase().includes('in') ? 'var(--green)' : `var(--red)`

                            $('.prof_container > ul ').prepend(
                                `
                                          <li>
                                          <a id="prof_link" href="#"><img id="ic_prof" src="${profile}" onerror="this.onerror=null; this.src='src/assets/avatar.png'" />
                                          <h2>${last}, ${first} ${middle}</h2>
                                          <h3 style="color:${colorStatus}">Student</h3>  
                                          </a>  
                                          </li>
                                          `
                            ).css("opacity", "0").animate({
                                opacity: '1'
                            });


                        })
                    }


                })
            })

        })

    } else {
        firebase.database().ref(`Attendance/Gate/${FormatDate(GetDateNow(),'MM-DD-YY')}`).orderByKey().limitToLast(5).on("value", snap => {
            $('.prof_container > ul ').html(' ');
            snap.forEach(childSnapshot => {
                var type = "";
                // console.log(childSnapshot.child("EnteredID").val());
                let dataPath = "";
                if (childSnapshot.child("EnteredID").val().includes('STUD')) {
                    dataPath = "Data/Student/Information";
                    type = "Student";
                } else {
                    dataPath = "Data/Faculty/Information";
                    type = "Faculty";
                }

                Object.keys(childSnapshot).reverse();
                let status = childSnapshot.child('Status').val()
                firebase.database().ref(dataPath + "/" + childSnapshot.child("EnteredID").val()).on("value", profilesnap => {
                    console.log(profilesnap.val())
                    if (profilesnap.val() != null) {

                        //       console.log(image);
                        let last = profilesnap.child('Name').child('Last').val()
                        let first = profilesnap.child('Name').child('First').val()
                        let middle = profilesnap.child('Name').child('Middle').val()

                        let profile = profilesnap.child('Profile').val()

                        let colorStatus = status.toLowerCase().includes('in') ? 'var(--green)' : `var(--red)`


                        $('.prof_container > ul ').prepend(
                            `
                                  <li>
                                  <a id="prof_link" href="#"><img id="ic_prof" src="${profile}" onerror="this.onerror=null; this.src='src/assets/avatar.png'" />
                                  <h2>${last}, ${first} ${middle}</h2>
                                  <h3 style="color:${colorStatus}">${type}</h3>  
                                  </a>  
                                  </li>
                                  `
                        ).css("opacity", "0").animate({
                            opacity: '1'
                        });

                    }
                });
            });

            if (snap == null) {
                $('.prof_container > ul ').html('<p style="font-size:18px;text-align:center;background-color:transparent;font-weight:600;width:100%"> No one entered yet. </p>');
            }
        });
    }

}

function sMediaQuery() {
    // alert("sMediaQuery");
    $(window).on('resize', function (e) {
        var width = $(window).width();
        var height = $(window).height();

        if (width > 768) {
            // alert("Desktop");


        } else if (width < 768 && width > 425) {
            ChartSizes();

            //  alert("Tablet");
        } else if (width < 425) {
            ChartSizes();
            //   alert("Mobile");
        }
    });
}



function ChartSizes() {
    // alert("called");
    var prof = $('.professor').width();
    $('.pie-chart').css("width", prof);
    $('.line-chart').css("width", prof);
}



function PieChart() {
    //   alert("Pie Chart Loaded");
    let present = $('#cnt_present').html()
    let absent = $('#cnt_absent').html()
    let late = $('#cnt_late').html()


    if (present.includes('——') && absent.includes('——') && late.includes('——')) {
        return setTimeout(PieChart, 5000);
    } else {
        if ((present.includes('0') || present.includes('——')) && (absent.includes('0') || absent.includes('——')) && (late.includes('0') || late.includes('——'))) {
            $('.pie-container').html('<h3 style="margin: 22px 0 0 0;text-align:center;"> No data available </h3>')
        } else {

            $('.pie-container').html(`<canvas id="pieChart"></canvas>`)

            var xValues = ["Present", "Absent", "Late"];
            var yValues = [
                parseInt(present),
                parseInt(absent),
                parseInt(late)
            ];
            console.log(yValues)
            var barColors = [
                "#8A98F5",
                "#617EAB",
                "#C7DDFF"
            ];

            new Chart("pieChart", {
                type: "pie",
                data: {
                    labels: xValues,
                    datasets: [{
                        backgroundColor: barColors,
                        data: yValues
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    legend: {
                        position: 'bottom',
                        display: true,
                        font: {
                            family: "'Karla', sans-serif"
                        },
                        labels: {
                            usePointStyle: true
                        }
                    }
                }
            });
        }

    }
}

function LineChart(data) {
    //   alert("Line Chart Loaded");
    //var xValues = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10"];
    if (!$.isEmptyObject(data)) {
        $('.line_container').html(`<canvas id="lineChart"></canvas>`)

        new Chart("lineChart", {
            type: "line",
            data: {
                labels: data.xValues,
                datasets: [{
                    label: 'Absent',
                    data: data.Absent,
                    borderWidth: 1,
                    borderColor: "#59BAF3",
                    backgroundColor: 'rgba(89, 186, 243,0.2)',
                    fill: true
                }, {
                    label: 'Present',
                    data: data.Present,
                    borderWidth: 1,
                    borderColor: "#68CF71",
                    backgroundColor: "rgba(104, 207, 113,0.2)",
                    fill: true
                }, {
                    label: 'Late',
                    data: data.ArriveLate,
                    borderWidth: 1,
                    borderColor: "#F2828A",
                    backgroundColor: "rgba(242, 130, 138,0.2)",
                    fill: true
                }, {
                    label: 'Leave Early',
                    data: data.LeaveEarly,
                    borderWidth: 1,
                    borderColor: "#FEB331",
                    backgroundColor: "rgba(242, 130, 138,0.2)",
                    fill: true
                }],
                borderWidth: 1
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                legend: {
                    position: 'bottom',
                    display: true,
                    font: {
                        family: "'Karla', sans-serif"
                    },
                    labels: {
                        usePointStyle: true
                    }
                }

            }
        });
    } else {
        $('.line_container').html('<h3 style="margin: 22px 0 0 0;text-align:center;"> No data available </h3>')
    }
}

// function LoadChart(Account_Type, ID) {

//     if (Account_Type.includes(`Faculty`)) {

//         let lineChart = {}

//         let januaryPresent = 0,
//             januaryAbsent = 0,
//             januaryArriveLate = 0,
//             januaryLeaveEarly = 0

//         let februaryPresent = 0,
//             februaryAbsent = 0,
//             februaryArriveLate = 0,
//             februaryLeaveEarly = 0


//         let marchPresent = 0,
//             marchAbsent = 0,
//             marchArriveLate = 0,
//             marchLeaveEarly = 0

//         let aprilPresent = 0,
//             aprilAbsent = 0,
//             aprilArriveLate = 0,
//             aprilLeaveEarly = 0

//         let mayPresent = 0,
//             mayAbsent = 0,
//             mayArriveLate = 0,
//             mayLeaveEarly = 0

//         let junePresent = 0,
//             juneAbsent = 0,
//             juneArriveLate = 0,
//             juneLeaveEarly = 0

//         let julyPresent = 0,
//             julyAbsent = 0,
//             julyArriveLate = 0,
//             julyLeaveEarly = 0

//         let augustPresent = 0,
//             augustAbsent = 0,
//             augustArriveLate = 0,
//             augustLeaveEarly = 0


//         let septemberPresent = 0,
//             septemberAbsent = 0,
//             septemberArriveLate = 0,
//             septemberLeaveEarly = 0

//         let octoberPresent = 0,
//             octoberAbsent = 0,
//             octoberArriveLate = 0,
//             octoberLeaveEarly = 0


//         let novemberPresent = 0,
//             novemberAbsent = 0,
//             novemberArriveLate = 0,
//             novemberLeaveEarly = 0


//         let decemberPresent = 0,
//             decemberAbsent = 0,
//             decemberArriveLate = 0,
//             decemberLeaveEarly = 0

//         firebase.database().ref(`Data/Subject/`).orderByChild(`Professor`).startAt(ID).endAt(ID).on(`value`, subjects => {
//             subjects.forEach(subject => {
//                 let classNbr = subject.child(`ClassNbr`).val()

//                 firebase.database().ref(`Attendance/Report/Statistics/Class/${classNbr}/`).on(`value`, Classes => {
//                //     console.log(Classes.val())
//                     Classes.child(`Dates`).forEach(dates => {
//                         if (dates.val() != null) {
//                          //   console.log(dates.val())

//                             let countPresent = dates.child('Present').val()
//                             let countAbsent = dates.child('Absent').val()
//                             let countArriveLate = dates.child('ArriveLate').val()
//                             let countLeaveEarly = dates.child('LeaveEarly').val()

//                             let monthDate = dates.child('Date').val()

//                             if (monthDate != null) {
//                                 let monthString = GetMonth(monthDate.toString().substring(0, 2))
//                                 //         console.log(monthString)

//                                 if (monthString.includes('January')) {
//                                     januaryPresent += countPresent
//                                     januaryAbsent += countAbsent
//                                     januaryArriveLate += countArriveLate
//                                     januaryLeaveEarly += countLeaveEarly
//                                 }
//                                 if (monthString.includes('February')) {
//                                     februaryPresent += countPresent
//                                     februaryAbsent += countAbsent
//                                     februaryArriveLate += countArriveLate
//                                     februaryLeaveEarly += countLeaveEarly
//                                 }
//                                 if (monthString.includes('March')) {
//                                     marchPresent += countPresent
//                                     marchAbsent += countAbsent
//                                     marchArriveLate += countArriveLate
//                                     marchLeaveEarly += countLeaveEarly
//                                 }
//                                 if (monthString.includes('April')) {
//                                     aprilPresent += countPresent
//                                     aprilAbsent += countAbsent
//                                     aprilArriveLate += countArriveLate
//                                     aprilLeaveEarly += countLeaveEarly
//                                 }
//                                 if (monthString.includes('May')) {
//                                     mayPresent += countPresent
//                                     mayAbsent += countAbsent
//                                     mayArriveLate += countArriveLate
//                                     mayLeaveEarly += countLeaveEarly
//                                 }
//                                 if (monthString.includes('June')) {
//                                     junePresent += countPresent
//                                     juneAbsent += countAbsent
//                                     juneArriveLate += countArriveLate
//                                     juneLeaveEarly += countLeaveEarly
//                                 }
//                                 if (monthString.includes('July')) {
//                                     julyPresent += countPresent
//                                     julyAbsent += countAbsent
//                                     julyArriveLate += countArriveLate
//                                     julyLeaveEarly += countLeaveEarly
//                                 }
//                                 if (monthString.includes('August')) {
//                                     augustPresent += countPresent
//                                     augustAbsent += countAbsent
//                                     augustArriveLate += countArriveLate
//                                     augustLeaveEarly += countLeaveEarly
//                                 }
//                                 if (monthString.includes('September')) {
//                                     septemberPresent += countPresent
//                                     septemberAbsent += countAbsent
//                                     septemberArriveLate += countArriveLate
//                                     septemberLeaveEarly += countLeaveEarly
//                                 }
//                                 if (monthString.includes('October')) {
//                                     octoberPresent += countPresent
//                                     octoberAbsent += countAbsent
//                                     octoberArriveLate += countArriveLate
//                                     octoberLeaveEarly += countLeaveEarly
//                                 }
//                                 if (monthString.includes('November')) {
//                                     novemberPresent += countPresent
//                                     novemberAbsent += countAbsent
//                                     novemberArriveLate += countArriveLate
//                                     novemberLeaveEarly += countLeaveEarly
//                                 }
//                                 if (monthString.includes('December')) {
//                                     decemberPresent += countPresent
//                                     decemberAbsent += countAbsent
//                                     decemberArriveLate += countArriveLate
//                                     decemberLeaveEarly += countLeaveEarly
//                                 }

//                             }


//                             // For pie chart




//                         }


//                     })

//                     lineChart.xValues = [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`]

//                     lineChart.Present = [januaryPresent, februaryPresent, marchPresent, aprilPresent, mayPresent, junePresent, julyPresent, augustPresent, septemberPresent, octoberPresent, novemberPresent, decemberPresent]

//                     lineChart.Absent = [januaryAbsent, februaryAbsent, marchAbsent, aprilAbsent, mayAbsent, juneAbsent, julyAbsent, augustAbsent, septemberAbsent, octoberAbsent, novemberAbsent, decemberAbsent]

//                     lineChart.ArriveLate = [januaryArriveLate, februaryArriveLate, marchArriveLate, aprilArriveLate, mayArriveLate, juneArriveLate, julyArriveLate, augustArriveLate, septemberArriveLate, octoberArriveLate, novemberArriveLate, decemberArriveLate]

//                     lineChart.LeaveEarly = [januaryLeaveEarly, februaryLeaveEarly, marchLeaveEarly, aprilLeaveEarly, mayLeaveEarly, juneLeaveEarly, julyLeaveEarly, augustLeaveEarly, septemberLeaveEarly, octoberLeaveEarly, novemberLeaveEarly, decemberLeaveEarly]

//                     console.log(lineChart.xValues)


//                   //  PieChart(pieChart)
//                     LineChart(lineChart)

//                 })
//             })


//         })

//     } else {

//         let pieChart = {}

//         let present = 0;
//         let absent = 0
//         let arrivelate = 0
//         let leaveEarly = 0


//         let lineChart = {}

//         let januaryPresent = 0,
//             januaryAbsent = 0,
//             januaryArriveLate = 0,
//             januaryLeaveEarly = 0

//         let februaryPresent = 0,
//             februaryAbsent = 0,
//             februaryArriveLate = 0,
//             februaryLeaveEarly = 0


//         let marchPresent = 0,
//             marchAbsent = 0,
//             marchArriveLate = 0,
//             marchLeaveEarly = 0

//         let aprilPresent = 0,
//             aprilAbsent = 0,
//             aprilArriveLate = 0,
//             aprilLeaveEarly = 0

//         let mayPresent = 0,
//             mayAbsent = 0,
//             mayArriveLate = 0,
//             mayLeaveEarly = 0

//         let junePresent = 0,
//             juneAbsent = 0,
//             juneArriveLate = 0,
//             juneLeaveEarly = 0

//         let julyPresent = 0,
//             julyAbsent = 0,
//             julyArriveLate = 0,
//             julyLeaveEarly = 0

//         let augustPresent = 0,
//             augustAbsent = 0,
//             augustArriveLate = 0,
//             augustLeaveEarly = 0


//         let septemberPresent = 0,
//             septemberAbsent = 0,
//             septemberArriveLate = 0,
//             septemberLeaveEarly = 0

//         let octoberPresent = 0,
//             octoberAbsent = 0,
//             octoberArriveLate = 0,
//             octoberLeaveEarly = 0


//         let novemberPresent = 0,
//             novemberAbsent = 0,
//             novemberArriveLate = 0,
//             novemberLeaveEarly = 0


//         let decemberPresent = 0,
//             decemberAbsent = 0,
//             decemberArriveLate = 0,
//             decemberLeaveEarly = 0


//         firebase.database().ref(`Attendance/Report/Statistics/Class/`).once('value', Classes => {

//             let dPresent = 0;
//             let dAbsent = 0;
//             let dArriveLate = 0;
//             let dLeavEarly = 0;

//             Classes.forEach(Class => {
//                 //    console.log(Class.key)

//                 Class.child(`Dates`).forEach(dates => {


//                     if (dates.val() != null) {
//                         //   console.log(dates.val())

//                         let countPresent = dates.child('Present').val()
//                         let countAbsent = dates.child('Absent').val()
//                         let countArriveLate = dates.child('ArriveLate').val()
//                         let countLeaveEarly = dates.child('LeaveEarly').val()

//                         let monthDate = dates.child('Date').val()



//                         if (monthDate != null) {
//                             let monthString = GetMonth(monthDate.toString().substring(0, 2))
//                             //         console.log(monthString)

//                             if (monthString.includes('January')) {
//                                 januaryPresent += countPresent
//                                 januaryAbsent += countAbsent
//                                 januaryArriveLate += countArriveLate
//                                 januaryLeaveEarly += countLeaveEarly
//                             }
//                             if (monthString.includes('February')) {
//                                 februaryPresent += countPresent
//                                 februaryAbsent += countAbsent
//                                 februaryArriveLate += countArriveLate
//                                 februaryLeaveEarly += countLeaveEarly
//                             }
//                             if (monthString.includes('March')) {
//                                 marchPresent += countPresent
//                                 marchAbsent += countAbsent
//                                 marchArriveLate += countArriveLate
//                                 marchLeaveEarly += countLeaveEarly
//                             }
//                             if (monthString.includes('April')) {
//                                 aprilPresent += countPresent
//                                 aprilAbsent += countAbsent
//                                 aprilArriveLate += countArriveLate
//                                 aprilLeaveEarly += countLeaveEarly
//                             }
//                             if (monthString.includes('May')) {
//                                 mayPresent += countPresent
//                                 mayAbsent += countAbsent
//                                 mayArriveLate += countArriveLate
//                                 mayLeaveEarly += countLeaveEarly
//                             }
//                             if (monthString.includes('June')) {
//                                 junePresent += countPresent
//                                 juneAbsent += countAbsent
//                                 juneArriveLate += countArriveLate
//                                 juneLeaveEarly += countLeaveEarly
//                             }
//                             if (monthString.includes('July')) {
//                                 julyPresent += countPresent
//                                 julyAbsent += countAbsent
//                                 julyArriveLate += countArriveLate
//                                 julyLeaveEarly += countLeaveEarly
//                             }
//                             if (monthString.includes('August')) {
//                                 augustPresent += countPresent
//                                 augustAbsent += countAbsent
//                                 augustArriveLate += countArriveLate
//                                 augustLeaveEarly += countLeaveEarly
//                             }
//                             if (monthString.includes('September')) {
//                                 septemberPresent += countPresent
//                                 septemberAbsent += countAbsent
//                                 septemberArriveLate += countArriveLate
//                                 septemberLeaveEarly += countLeaveEarly
//                             }
//                             if (monthString.includes('October')) {
//                                 octoberPresent += countPresent
//                                 octoberAbsent += countAbsent
//                                 octoberArriveLate += countArriveLate
//                                 octoberLeaveEarly += countLeaveEarly
//                             }
//                             if (monthString.includes('November')) {
//                                 novemberPresent += countPresent
//                                 novemberAbsent += countAbsent
//                                 novemberArriveLate += countArriveLate
//                                 novemberLeaveEarly += countLeaveEarly
//                             }
//                             if (monthString.includes('December')) {
//                                 decemberPresent += countPresent
//                                 decemberAbsent += countAbsent
//                                 decemberArriveLate += countArriveLate
//                                 decemberLeaveEarly += countLeaveEarly
//                             }

//                         }


//                         // For pie chart
//                         present += parseInt(countPresent)
//                         absent += parseInt(countAbsent)
//                         arrivelate += parseInt(countArriveLate)
//                         leaveEarly += parseInt(countLeaveEarly)




//                     }

//                     var ref = firebase.database().ref(`Attendance/Report/Statistics/Class/${Class.key}/Dates/`).orderByKey().startAt(`01`);
//                     //    console.log(ref.toString())
//                 })

//                 //  console.log(january)


//                 lineChart.xValues = [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`]

//                 lineChart.Present = [januaryPresent, februaryPresent, marchPresent, aprilPresent, mayPresent, junePresent, julyPresent, augustPresent, septemberPresent, octoberPresent, novemberPresent, decemberPresent]

//                 lineChart.Absent = [januaryAbsent, februaryAbsent, marchAbsent, aprilAbsent, mayAbsent, juneAbsent, julyAbsent, augustAbsent, septemberAbsent, octoberAbsent, novemberAbsent, decemberAbsent]

//                 lineChart.ArriveLate = [januaryArriveLate, februaryArriveLate, marchArriveLate, aprilArriveLate, mayArriveLate, juneArriveLate, julyArriveLate, augustArriveLate, septemberArriveLate, octoberArriveLate, novemberArriveLate, decemberArriveLate]

//                 lineChart.LeaveEarly = [januaryLeaveEarly, februaryLeaveEarly, marchLeaveEarly, aprilLeaveEarly, mayLeaveEarly, juneLeaveEarly, julyLeaveEarly, augustLeaveEarly, septemberLeaveEarly, octoberLeaveEarly, novemberLeaveEarly, decemberLeaveEarly]



//                 // For pie chart
//                 pieChart.Present = present;
//                 pieChart.Absent = absent;
//                 pieChart.ArriveLate = arrivelate;
//                 pieChart.LeaveEarly = leaveEarly;



//                 //     console.log(monthly)
//                 //     console.log(data.Absent)
//             })

//             console.log(lineChart)
//             LineChart(lineChart)
//             //   PieChart(pieChart)
//         })


//     }
// }



function LoadChart(account_type, id) {
    if (account_type.includes('Faculty')) {


        firebase.database().ref(`Data/Subject/`).orderByChild(`Professor`).startAt(id).endAt(id).once(`value`, subjects => {

            let pieChart = {}

            let present = 0;
            let absent = 0
            let arrivelate = 0
            let leaveEarly = 0

            let lineChart = {}


            subjects.forEach(subject => {
                let classNbr = subject.child(`ClassNbr`).val()

                firebase.database().ref(`Attendance/Report/Statistics/Class/${classNbr}`).once(`value`, Classes => {

                    Classes.child(`Dates`).forEach(dates => {
                        if (dates.val() != null) {
                            //   console.log(dates.val())

                            let countPresent = dates.child('Present').val()
                            let countAbsent = dates.child('Absent').val()
                            let countArriveLate = dates.child('ArriveLate').val()
                            let countLeaveEarly = dates.child('LeaveEarly').val()

                            let monthDate = dates.child('Date').val()
                            console.log(monthDate)

                            lineChart = ComputeLineData(monthDate, {
                                Present: countPresent,
                                Absent: countAbsent,
                                ArriveLate: countArriveLate,
                                LeaveEarly: countLeaveEarly
                            })
                            console.log(lineChart)




                            // For pie chart
                            present += parseInt(countPresent)
                            absent += parseInt(countAbsent)
                            arrivelate += parseInt(countArriveLate)
                            leaveEarly += parseInt(countLeaveEarly)




                        }


                    })

                    // For pie chart
                    pieChart.Present = present;
                    pieChart.Absent = absent;
                    pieChart.ArriveLate = arrivelate;
                    pieChart.LeaveEarly = leaveEarly;

                    //        PieChart(pieChart)
                    LineChart(lineChart)
                })





            })








        })
    } else {

        let pieChart = {}

        let present = 0;
        let absent = 0
        let arrivelate = 0
        let leaveEarly = 0

        let lineChart = {}

        firebase.database().ref(`Attendance/Report/Statistics/Class/`).once('value', Classes => {



            Classes.forEach(Class => {
                //    console.log(Class.key)

                Class.child(`Dates`).forEach(dates => {


                    if (dates.val() != null) {
                        //   console.log(dates.val())

                        let countPresent = dates.child('Present').val()
                        let countAbsent = dates.child('Absent').val()
                        let countArriveLate = dates.child('ArriveLate').val()
                        let countLeaveEarly = dates.child('LeaveEarly').val()

                        let monthDate = dates.child('Date').val()


                        //       console.log(monthDate)
                        lineChart = ComputeLineData(monthDate, {
                            Present: countPresent,
                            Absent: countAbsent,
                            ArriveLate: countArriveLate,
                            LeaveEarly: countLeaveEarly
                        })
                        console.log(lineChart)

                        // For pie chart
                        present += parseInt(countPresent)
                        absent += parseInt(countAbsent)
                        arrivelate += parseInt(countArriveLate)
                        leaveEarly += parseInt(countLeaveEarly)




                    }

                    var ref = firebase.database().ref(`Attendance/Report/Statistics/Class/${Class.key}/Dates/`).orderByKey().startAt(`01`);
                    //    console.log(ref.toString())
                })

                //  console.log(january)




                // For pie chart
                pieChart.Present = present;
                pieChart.Absent = absent;
                pieChart.ArriveLate = arrivelate;
                pieChart.LeaveEarly = leaveEarly;



                //     console.log(monthly)
                //     console.log(data.Absent)
            })
            LineChart(lineChart)
            //    PieChart(pieChart)
        })
    }

}

var lineData = {}
var xValues = []
var yPresent = {}
var yAbsent = {}
var yArriveLate = {}
var yLeaveEarly = {}

function ComputeLineData(monthDate, count) {
    let xDate = monthDate.split('-')
    let month = xDate[0]
    let monthName = GetMonth(xDate[0])
    let day = xDate[1]
    let year = xDate[2]

    let present = 0
    let absent = 0
    let late = 0
    let leaveearly = 0

    // present += parseInt(count.Present)
    // absent += parseInt(count.Absent)
    // late += parseInt(count.ArriveLate)
    // leaveearly += parseInt(count.LeaveEarly)

    if (!xValues.includes(`${monthName}-${year}`)) {
        xValues.push(`${monthName}-${year}`)
    }

    if (`${monthName}-${year}` in yPresent) {
        yPresent[`${monthName}-${year}`] += parseInt(count.Present)
        yAbsent[`${monthName}-${year}`] += parseInt(count.Absent)
        yArriveLate[`${monthName}-${year}`] += parseInt(count.ArriveLate)
        yLeaveEarly[`${monthName}-${year}`] += parseInt(count.LeaveEarly)
        //    present += yPresent.Present
        //  console.log(yPresent[`${month}-${year}`])
        //    console.log('exists!')
    } else {
        console.log('not exists!')
        yPresent[`${monthName}-${year}`] = parseInt(count.Present)
        yAbsent[`${monthName}-${year}`] = parseInt(count.Absent)
        yArriveLate[`${monthName}-${year}`] = parseInt(count.ArriveLate)
        yLeaveEarly[`${monthName}-${year}`] = parseInt(count.LeaveEarly)
    }

    // console.log(yPresent)


    lineData.xValues = xValues
    lineData.Present = Object.values(yPresent)
    lineData.Absent = Object.values(yAbsent)
    lineData.ArriveLate = Object.values(yArriveLate)
    lineData.LeaveEarly = Object.values(yLeaveEarly)
    // lineData.push({
    //     [`${monthName}-${year}`]: {
    //         Present: present,
    //         Absent: absent,
    //         Late: late,
    //         LeaveEarly: leaveearly
    //     }
    // })


    // LineChart(lineData)

    //  console.log(lineData)
    return lineData
}