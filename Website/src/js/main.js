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

            if (Account_Type.includes('Administrator')) {



                StatusCounter(GetDateNow(), 'present', present)
                StatusCounter(GetDateNow(), 'absent', absent)
                StatusCounter(GetDateNow(), 'arrivelate', late)


                StudentCounter(0, Account_Type, $('#cnt_students'))

                Entered(Account_Type, UserID)


                let data = {
                    xValues: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10"],
                    Absent: [Math.floor(Math.random() * 115),
                        Math.floor(Math.random() * 115),
                        Math.floor(Math.random() * 115),
                        Math.floor(Math.random() * 115),
                        Math.floor(Math.random() * 115),
                        Math.floor(Math.random() * 115),
                        Math.floor(Math.random() * 115),
                        Math.floor(Math.random() * 115),
                        Math.floor(Math.random() * 115),
                        Math.floor(Math.random() * 115)
                    ],
                    Present: [Math.floor(Math.random() * 115),
                        Math.floor(Math.random() * 115),
                        Math.floor(Math.random() * 115),
                        Math.floor(Math.random() * 115),
                        Math.floor(Math.random() * 115),
                        Math.floor(Math.random() * 115),
                        Math.floor(Math.random() * 115),
                        Math.floor(Math.random() * 115),
                        Math.floor(Math.random() * 115),
                        Math.floor(Math.random() * 115)
                    ],
                    Late: [Math.floor(Math.random() * 115),
                        Math.floor(Math.random() * 115),
                        Math.floor(Math.random() * 115),
                        Math.floor(Math.random() * 115),
                        Math.floor(Math.random() * 115),
                        Math.floor(Math.random() * 115),
                        Math.floor(Math.random() * 115),
                        Math.floor(Math.random() * 115),
                        Math.floor(Math.random() * 115),
                        Math.floor(Math.random() * 115)
                    ]
                }

                LineChart(data)
            }
            if (Account_Type.includes('Guidance')) {

                StatusCounter(GetDateNow(), 'present', present)
                StatusCounter(GetDateNow(), 'absent', absent)
                StatusCounter(GetDateNow(), 'arrivelate', late)

                StudentCounter(0, Account_Type, $('#cnt_students'))

                Entered(Account_Type, UserID)

            }
            if (Account_Type.includes('Faculty')) {
                //alert('Faculty')


                present.html('0')
                absent.html('0')
                late.html('0')

                FacultyStatusCounter(UserID, GetDateNow(), 'present', present)
                FacultyStatusCounter(UserID, GetDateNow(), 'absent', absent)
                FacultyStatusCounter(UserID, GetDateNow(), 'arrivelate', late)


                StudentCounter(UserID, Account_Type, $('#cnt_students'))

                Entered(Account_Type, UserID)

                let data = {}
                LineChart(data)
            }

            if(Account_Type.includes('Gate'))
            {
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

    }
});

function StatusCounter(date, status, object) {

    firebase.database().ref('Attendance/Summary/Class/').on('value', classes => {
        classes.forEach(aclass => {
            let classKey = aclass.key;
            firebase.database().ref(`Attendance/Summary/Class/${classKey}/Dates/${date}/`).on('value', attendance => {
                console.log(attendance.val())
                firebase.database().ref(`Attendance/Summary/Class/${classKey}/Dates/${date}/Student/`).orderByChild('Status').startAt(status).endAt(status).on('value', statusCount => {

                    object.html(statusCount.numChildren())
                    console.log(statusCount.val())




                })

            })
        })

        PieChart()
    })
}

function FacultyStatusCounter(id, date, status, object) {

    firebase.database().ref('Attendance/Summary/Class/').orderByChild('Professor').startAt(id).endAt(id).on('value', classes => {

        classes.forEach(aclass => {
            let classKey = aclass.key;
            firebase.database().ref(`Attendance/Summary/Class/${classKey}/Dates/${date}/`).on('value', attendance => {
                console.log(attendance.val())
                firebase.database().ref(`Attendance/Summary/Class/${classKey}/Dates/${date}/Student/`).orderByChild('Status').startAt(status).endAt(status).on('value', statusCount => {

                    object.html(statusCount.numChildren())
                    console.log(statusCount.val())


                })

            })
        })

        PieChart()
    })
}

function StudentCounter(id, account_type, object) {
    if (account_type.includes('Faculty')) {
        firebase.database().ref(`Data/Subject/`).orderByChild('Professor').startAt(id).endAt(id).on("value", snap => {
            console.log(snap.val())
            let studentCount = 0;

            snap.forEach(subject => {
                studentCount += subject.child('Students').numChildren();
            })

            object.html(studentCount)



        });
    } else {
        firebase.database().ref(`Data/Student/Information/`).on("value", snap => {
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
                console.log(subject.val())
                subject.child('Students').forEach(student => {
                    console.log(student.child('ID').val())
                    arrstudent.push(student.child('ID').val())

                    //Append student ID of the professor Student on the arrstudent array
                })


            })

            console.log(arrstudent)
            firebase.database().ref(`Attendance/Gate/${GetDateNow()}`).orderByKey().limitToLast(5).on('value', attendance => {

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
        firebase.database().ref(`Attendance/Gate/${GetDateNow()}`).orderByKey().limitToLast(5).on("value", snap => {
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
                                  <h3 style="color:${colorStatus}">Student</h3>  
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
        return setTimeout(PieChart, 1000);
    } else {
        if ((present == '0' || present == '——') && (absent == '0' || absent == '——') && (late == '0' || late == '——')) {
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
                    data: data.Late,
                    borderWidth: 1,
                    borderColor: "#F2828A",
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

function LineChartData(dayframe) {
    if (dayframe.includes('daily')) {

    } else if (dayframe.includes('weekly')) {

    } else if (dayframe.includes('monthly')) {

    } else if (dayframe.includes('quarterly')) {

    } else if (dayframe.includes('yearly')) {

    }
}