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
            firebase.database().ref(dataPath + "/" + childSnapshot.child("EnteredID").val()).on("value", profilesnap => {
                console.log(profilesnap.val())

                //          console.log(dataPath + "/" + childSnapshot.child("EnteredID").val());
                if (profilesnap.val() != null) {
                    let name = [];
                    profilesnap.child("Name").forEach(names => {
                        //   console.log(names.val());
                        name.push(names.val());
                    });
                    //    alert(name);
                    // let profName = profilesnap.child("Name").val().split('&&')
                    let image = profilesnap.child("Profile").val().toString().includes('firebasestorage') ?
                        profilesnap.child("Profile").val().toString() : 'src/assets/avatar.png'

                    //       console.log(image);
                    $('.prof_container > ul ').prepend(
                        " <li>" +
                        "<a id=\"prof_link\" href=\"#\">" +
                        "<img id=\"ic_prof\" src=\"" + image + "\" onerror=\"this.onerror=null; this.src='src/assets/avatar.png'\" />" +
                        "<h2>" + name[1] + "," + name[0] + " " + name[2].toString().substr(0, 1).toUpperCase() + "." +
                        "</h2>" +
                        "   <h3>" + type + "</h3>" +
                        "  </a>" +
                        "  </li>"
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

            if (Account_Type.includes('Administrator')) {


                StatusCounter(GetDateNow(), 'present', $(`#cnt_present`))

                StatusCounter(GetDateNow(), 'absent', $(`#cnt_absent`))

                StatusCounter(GetDateNow(), 'arrivelate', $(`#cnt_late`))

                StudentCounter(0, Account_Type, $('#cnt_students'))
            }
            if (Account_Type.includes('Guidance')) {

                StatusCounter(GetDateNow(), 'present', $(`#cnt_present`))

                StatusCounter(GetDateNow(), 'absent', $(`#cnt_absent`))

                StatusCounter(GetDateNow(), 'arrivelate', $(`#cnt_late`))

                StudentCounter(0, Account_Type, $('#cnt_students'))


            }
            if (Account_Type.includes('Faculty')) {
                //alert('Faculty')
                FacultyStatusCounter(UserID, GetDateNow(), 'present', $(`#cnt_present`))
                FacultyStatusCounter(UserID, GetDateNow(), 'absent', $(`#cnt_absent`))
                FacultyStatusCounter(UserID, GetDateNow(), 'arrivelate', $(`#cnt_late`))


                StudentCounter(UserID, Account_Type, $('#cnt_students'))
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
    if ($('#cnt_present').html().includes('——') && $('#cnt_absent').html().includes('——') && $('#cnt_late').html().includes('——')) {
        return setTimeout(PieChart, 1000);
    } else {
        let present = $('#cnt_present').html().includes('——') ? '0' : $('#cnt_present').html()
        let absent = $('#cnt_present').html().includes('——') ? '0' : $('#cnt_absent').html()
        let late = $('#cnt_present').html().includes('——') ? '0' : $('#cnt_late').html()

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

function LineChart() {
    //   alert("Line Chart Loaded");
    var xValues = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10"];

    new Chart("lineChart", {
        type: "line",
        data: {
            labels: xValues,
            datasets: [{
                label: 'Absent',
                data: [Math.floor(Math.random() * 115),
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
                borderWidth: 1,
                borderColor: "#59BAF3",
                backgroundColor: 'rgba(89, 186, 243,0.2)',
                fill: true
            }, {
                label: 'Present',
                data: [Math.floor(Math.random() * 115),
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
                borderWidth: 1,
                borderColor: "#68CF71",
                backgroundColor: "rgba(104, 207, 113,0.2)",
                fill: true
            }, {
                label: 'Late',
                data: [Math.floor(Math.random() * 115),
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
}