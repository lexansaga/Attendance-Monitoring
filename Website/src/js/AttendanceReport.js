var tabview = window.matchMedia("(max-width: 768px)");
var mobview = window.matchMedia("(max-width: 425px)");

function ComboChart(data) {
    google.charts.load('current', {
        'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawVisualization);

    function drawVisualization() {
        // Some raw data (not necessarily accurate)
        var data = google.visualization.arrayToDataTable([
            ['Month', 'Bolivia', 'Ecuador', 'Madagascar', 'Papua New Guinea', 'Rwanda', 'Average'],
            ['2004/05', 165, 938, 522, 998, 450, 614.6],
            ['2005/06', 135, 1120, 599, 1268, 288, 682],
            ['2006/07', 157, 1167, 587, 807, 397, 623],
            ['2007/08', 139, 1110, 615, 968, 215, 609.4],
            ['2008/09', 136, 691, 629, 1026, 366, 569.6]
        ]);

        var options = {
            title: 'Monthly Coffee Production by Country',
            vAxis: {
                title: 'Status Count'
            },
            hAxis: {
                title: 'Status'
            },
            seriesType: 'bars',
            series: {
                5: {
                    type: 'line'
                }
            }
        };

        var chart = new google.visualization.ComboChart($('#line_chart'));
        chart.draw(data, options);
    }
}

//-----------------------------------------------LINE CHART-----------------------------------------------//
function LineChart(data) {

    new Chart("line_chart", {
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
                backgroundColor: "rgba(254, 179, 49,0.2)",
                fill: true
            }
            , {
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
            title: {
                display: true,
                text: 'Overall Attendance'
            },
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


//-----------------------------------------------PIE CHART-----------------------------------------------//
function PieChart(data) {
    google.charts.load('current', {
        'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(function () {
        drawChart(data)
    });

    function drawChart(datas) {

        var data = google.visualization.arrayToDataTable([
            ['Task', 'Overall Report'],
            ['Present', datas.Present],
            ['Absent', datas.Absent],
            ['Arrive Late', datas.ArriveLate],
            ['Leave Early', datas.LeaveEarly]
        ]);

        var options = {
            backgroundColor: 'transparent',
            legend: {
                position: 'right'
            },
            chartArea: {
                top: 10,
                width: '100%',
                height: '100%'
            }
        };

        var chart = new google.visualization.PieChart(document.getElementById('pie_chart'));

        chart.draw(data, options);
    }
}


var table = $('#datatable');
//-----------------------------------------------Data Table-----------------------------------------------//

$(document).ready(async function () {

    LineChart({})
    PieChart({})
    table.DataTable({
        "order": [
            [1, "asc"]
        ],
        dom: 'B<f<t>ip>',
        buttons: [{
                extend: 'excel',
                exportOptions: {
                    columns: [2, 3, 4, 5, 6]
                }
            }, {
                extend: 'pdf'
            },
            {
                extend: 'print',
                exportOptions: {
                    columns: [2, 3, 4, 5, 6]
                }
            }
        ]
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
                    // window.location.replace("main.html");
                } else if (Account_Type.includes('Faculty')) {
                    //window.location.replace("main.html");
                } else if (Account_Type.includes('Guidance')) {
                    // window.location.replace("main.html");
                } else { // Else
                    window.location.replace("index.html");
                }

                LoadTable(Account_Type, UserID)

                GetReport(Account_Type, UserID)
            })
        } else {
            // User logout
        }
    })


});


/*------------------------------------- MODAL CONFIG -------------------------------------*/

$(window).click(function (e) {
    if (e.target.className.includes('modal')) {
        $('.modal').css('display', 'none');
    }
    //  console.log(e.target.className);
});
$(".material-icons").click(function (e) {

    $('.modal:eq(0)').css('display', 'block');

});
$('.modal > div > span, .btn-cancel').click(function () {

    $('.modal').css('display', 'none');


});
$(".btn-submit").click(function (e) {
    let FromDate = $('.modal-container > main > input').eq(0).val();
    let ToDate = $('.modal-container > main > input').eq(1).val();

    document.getElementById("date-covered").innerHTML = "Showing Data from " + FromDate + " to " + ToDate;
    $('.modal:eq(0)').css('display', 'none');

});

let data2 = []

var StudentData = function () {

    return new Promise(function (resolve) {
        var data = []
        setTimeout(async function () {
            firebase.database().ref('Data/Student/Information/').on('value', async students => {

                for (student in students.val()) {

                    firebase.database().ref(`Data/Student/Information/${student}/`).on('value', s => {



                        let id = s.child('ID').val()
                        let last = s.child('Name').child('Last').val()
                        let middle = s.child('Name').child('Middle').val()
                        let first = s.child('Name').child('First').val()
                        let cardId = s.child('Card_ID').val()
                        let contact = s.child('Contact').val()
                        let email = s.child('Email').val()
                        let profile = s.child('Profile').val()
                        let address = s.child('Address').val()


                        var pReports = function (stats) {
                            return new Promise().then(function (resolve) {
                                var cStatus = [];

                                setTimeout(function () {

                                    firebase.database().ref(`Attendance/Summary/Student/${id}/`).on('value', reports => {

                                        reports.child('Class').forEach(report => {
                                            //      console.log(report.val())

                                            let classnbr = report.child('ClassNbr').val()
                                            let schedule = report.child('Schedule').val()
                                            let date = report.child('Date').val()

                                            report.child('Dates').forEach(dates => {

                                                let status = dates.child('Status').val()
                                                let remarks = dates.child('Remarks').val()

                                                //   console.log(status)
                                                if (status.includes(stats)) {
                                                    cStatus.push(`${dates.key}$${remarks}`);
                                                }
                                            })

                                        })

                                        resolve(cStatus)


                                    })
                                }, 1000)
                            })
                        }


                        let present = pReports('present').then(function (d) {
                            return d
                        })
                        let absent = pReports('absent').then(function (d) {
                            return d
                        })
                        let late = pReports('late').then(function (d) {
                            return d
                        })
                        data.push({
                            "id": id,
                            "FullName": `${last}, ${first} ${middle}`,
                            "DaysPresent": present.length,
                            "DaysAbsent": absent.length,
                            "DaysLate": late.length,
                            "ContactNumber": contact,
                            "Email": email,
                            "Address": address,
                            "Pfp": profile
                        });
                        resolve({
                            "data": data
                        })
                        //   console.log(data)





                    })

                }


            })

        }, 1000)
    });

}

function LoadTable(account_type, id) {
    if (account_type.includes('Faculty')) {
        firebase.database().ref('Data/Subject/').orderByChild('Professor').startAt(id).endAt(id).on('value', professors => {
            // This will get current professor subjects
            if (professors.val() != null) {
                //     console.log(professors.val())
                professors.forEach(professor => {
                    professor.child('Students').forEach(student => {
                        if (student.val() != null) {
                            // This will get current professor students
                            let id = student.child('ID').val()
                            let name = student.child('Name').val()

                            firebase.database().ref(`Data/Student/Information/${id}/`).on('value', s => {

                                if (s.val() != null) {
                                    let id = s.child('ID').val()
                                    let studentID = s.child('Student_ID').val()
                                    let last = s.child('Name').child('Last').val()
                                    let middle = s.child('Name').child('Middle').val()
                                    let first = s.child('Name').child('First').val()
                                    let cardId = s.child('Card_ID').val()
                                    let contact = s.child('Contact').val()
                                    let email = s.child('Email').val()
                                    let profile = s.child('Profile').val()
                                    let address = s.child('Address').val()



                                    var present = []
                                    var absent = []
                                    var late = []

                                    firebase.database().ref(`Attendance/Summary/Student/${id}/`).on('value', reports => {

                                        if (reports.val() != null) {
                                            reports.child('Class').forEach(report => {
                                                //    console.log(report.val())

                                                let classnbr = report.child('ClassNbr').val()
                                                let schedule = report.child('Schedule').val()
                                                let date = report.child('Date').val()

                                                report.child('Dates').forEach(dates => {

                                                    let status = dates.child('Status').val()
                                                    let remarks = dates.child('Remarks').val()

                                                    //   console.log(status)
                                                    if (status.includes('present')) {
                                                        present.push(`${dates.key}$${remarks}`)
                                                    }
                                                    if (status.includes('absent')) {
                                                        absent.push(`${dates.key}$${remarks}`)
                                                    }
                                                    if (status.includes('late')) {
                                                        late.push(`${dates.key}$${remarks}`)
                                                    }
                                                })

                                            })

                                            table.DataTable().row.add(
                                                [
                                                    ` <a href="studentinformation.html?id=${id}"> <img src="${profile}"  onerror="this.onerror=null; this.src='src/assets/avatar.png'"/>`,
                                                    id,
                                                    studentID == '' || studentID == null ? "No ID assign" : studentID,
                                                    `${last}, ${first} ${middle}`,
                                                    present.length,
                                                    absent.length,
                                                    late.length
                                                ]).draw()
                                        }


                                        // console.log(`${ id,
                                        //             `${last}, ${first} ${middle}`,
                                        //             present.length,
                                        //             absent.length,
                                        //             late.length}`)
                                    })
                                }

                            })
                        }

                    })
                })
            }



        })





        // })
    } else {
        firebase.database().ref('Data/Student/Information/').on('value', students => {
            if (students.val() != null) {
                for (student in students.val()) {

                    firebase.database().ref(`Data/Student/Information/${student}/`).on('value', s => {

                        if (s.val() != null) {
                            let id = s.child('ID').val()
                            let studentID = s.child('Student_ID').val()
                            let last = s.child('Name').child('Last').val()
                            let middle = s.child('Name').child('Middle').val()
                            let first = s.child('Name').child('First').val()
                            let cardId = s.child('Card_ID').val()
                            let contact = s.child('Contact').val()
                            let email = s.child('Email').val()
                            let profile = s.child('Profile').val()
                            let address = s.child('Address').val()



                            var present = []
                            var absent = []
                            var late = []

                            firebase.database().ref(`Attendance/Summary/Student/${id}/`).on('value', reports => {

                                if (reports.val() != null) {
                                    reports.child('Class').forEach(report => {
                                        //    console.log(report.val())

                                        let classnbr = report.child('ClassNbr').val()
                                        let schedule = report.child('Schedule').val()
                                        let date = report.child('Date').val()

                                        report.child('Dates').forEach(dates => {

                                            let status = dates.child('Status').val()
                                            let remarks = dates.child('Remarks').val()

                                            //   console.log(status)
                                            if (status.includes('present')) {
                                                present.push(`${dates.key}$${remarks}`)
                                            }
                                            if (status.includes('absent')) {
                                                absent.push(`${dates.key}$${remarks}`)
                                            }
                                            if (status.includes('late')) {
                                                late.push(`${dates.key}$${remarks}`)
                                            }
                                        })

                                    })

                                    table.DataTable().row.add(
                                        [
                                            ` <a href="studentinformation.html?id=${id}"> <img src="${profile}"  onerror="this.onerror=null; this.src='src/assets/avatar.png'"/>`,
                                            id,
                                            studentID == '' || studentID == null ? "No ID assign" : studentID,
                                            `${last}, ${first} ${middle}`,
                                            present.length,
                                            absent.length,
                                            late.length
                                        ]).draw()
                                }
                            })
                        }


                    })
                }
            }

        })
    }


}





// function GetReport(account_type, id) {



//     if (account_type.includes(`Faculty`)) {


//         firebase.database().ref(`Data/Subject/`).orderByChild(`Professor`).startAt(id).endAt(id).once(`value`, subjects => {

//             let pieChart = {}

//             let present = 0;
//             let absent = 0
//             let arrivelate = 0
//             let leaveEarly = 0


//             let lineChart = {}

//             let januaryPresent = 0,
//                 januaryAbsent = 0,
//                 januaryArriveLate = 0,
//                 januaryLeaveEarly = 0

//             let februaryPresent = 0,
//                 februaryAbsent = 0,
//                 februaryArriveLate = 0,
//                 februaryLeaveEarly = 0


//             let marchPresent = 0,
//                 marchAbsent = 0,
//                 marchArriveLate = 0,
//                 marchLeaveEarly = 0

//             let aprilPresent = 0,
//                 aprilAbsent = 0,
//                 aprilArriveLate = 0,
//                 aprilLeaveEarly = 0

//             let mayPresent = 0,
//                 mayAbsent = 0,
//                 mayArriveLate = 0,
//                 mayLeaveEarly = 0

//             let junePresent = 0,
//                 juneAbsent = 0,
//                 juneArriveLate = 0,
//                 juneLeaveEarly = 0

//             let julyPresent = 0,
//                 julyAbsent = 0,
//                 julyArriveLate = 0,
//                 julyLeaveEarly = 0

//             let augustPresent = 0,
//                 augustAbsent = 0,
//                 augustArriveLate = 0,
//                 augustLeaveEarly = 0


//             let septemberPresent = 0,
//                 septemberAbsent = 0,
//                 septemberArriveLate = 0,
//                 septemberLeaveEarly = 0

//             let octoberPresent = 0,
//                 octoberAbsent = 0,
//                 octoberArriveLate = 0,
//                 octoberLeaveEarly = 0


//             let novemberPresent = 0,
//                 novemberAbsent = 0,
//                 novemberArriveLate = 0,
//                 novemberLeaveEarly = 0


//             let decemberPresent = 0,
//                 decemberAbsent = 0,
//                 decemberArriveLate = 0,
//                 decemberLeaveEarly = 0


//             subjects.forEach(subject => {
//                 let classNbr = subject.child(`ClassNbr`).val()

//                 firebase.database().ref(`Attendance/Report/Statistics/Class/${classNbr}`).once(`value`, Classes => {

//                     Classes.child(`Dates`).forEach(dates => {
//                         if (dates.val() != null) {
//                             //   console.log(dates.val())

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
//                             present += parseInt(countPresent)
//                             absent += parseInt(countAbsent)
//                             arrivelate += parseInt(countArriveLate)
//                             leaveEarly += parseInt(countLeaveEarly)




//                         }


//                     })

//                     lineChart.xValues = [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`]

//                     lineChart.Present = [januaryPresent, februaryPresent, marchPresent, aprilPresent, mayPresent, junePresent, julyPresent, augustPresent, septemberPresent, octoberPresent, novemberPresent, decemberPresent]

//                     lineChart.Absent = [januaryAbsent, februaryAbsent, marchAbsent, aprilAbsent, mayAbsent, juneAbsent, julyAbsent, augustAbsent, septemberAbsent, octoberAbsent, novemberAbsent, decemberAbsent]

//                     lineChart.ArriveLate = [januaryArriveLate, februaryArriveLate, marchArriveLate, aprilArriveLate, mayArriveLate, juneArriveLate, julyArriveLate, augustArriveLate, septemberArriveLate, octoberArriveLate, novemberArriveLate, decemberArriveLate]

//                     lineChart.LeaveEarly = [januaryLeaveEarly, februaryLeaveEarly, marchLeaveEarly, aprilLeaveEarly, mayLeaveEarly, juneLeaveEarly, julyLeaveEarly, augustLeaveEarly, septemberLeaveEarly, octoberLeaveEarly, novemberLeaveEarly, decemberLeaveEarly]

//                     console.log(lineChart)
//                     LineChart(lineChart)

//                     // For pie chart
//                     pieChart.Present = present;
//                     pieChart.Absent = absent;
//                     pieChart.ArriveLate = arrivelate;
//                     pieChart.LeaveEarly = leaveEarly;

//                     PieChart(pieChart)

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
//             LineChart(lineChart)
//             PieChart(pieChart)
//         })
//     }
// }


function GetReport(account_type, id) {
    if (account_type.includes('Faculty')) {


        firebase.database().ref(`Data/Subject/`).orderByChild(`Professor`).startAt(id).endAt(id).once(`value`, subjects => {

            let pieChart = {}

            let present = 0;
            let absent = 0
            let arrivelate = 0
            let leaveEarly = 0
            
            var lineChart = {}
        


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
                   
                    PieChart(pieChart)
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

        var lineChart = {}

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
         //   console.log(lineChart)
            LineChart(lineChart)
            PieChart(pieChart)
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
    lineData.Absent =   Object.values(yAbsent)
    lineData.ArriveLate =  Object.values(yArriveLate)
    lineData.LeaveEarly =  Object.values(yLeaveEarly)
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

// function GetLineData()
// {
//     let present = 0;
//     let absent = 0;
//     let late = 0;
//     let xValues = []
//     let Present = []
//     let Absent = []
//     let Late = []
//     let LeaveEarly = []

//     lineData.forEach(data => {
//         present += data.Present
//         absent += data.Absent
//         late += data.Late
//     });
// }