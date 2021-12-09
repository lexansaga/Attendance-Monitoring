var tabview = window.matchMedia("(max-width: 768px)");
var mobview = window.matchMedia("(max-width: 425px)");

//-----------------------------------------------LINE CHART-----------------------------------------------//
function LineChart(data) {
    const CHART = document.getElementById('line_chart');

    var BarColors = ['#9674CF', '#18BBCB', '#9674CF', '#18BBCB', '#9674CF', '#18BBCB', '#9674CF', '#18BBCB', '#9674CF', '#18BBCB', '#9674CF', '#18BBCB']

    let barChart = new Chart(CHART, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                backgroundColor: BarColors,
                data: [25, 30, 50, 10, 240, 550, 120, 10]
            }]
        },
        options: {
            responsive: true,
            legend: {
                display: false
            },
            maintainAspectRatio: true
        }
    })
}


//-----------------------------------------------PIE CHART-----------------------------------------------//
function PieChart(data) {
    google.charts.load('current', {
        'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {

        var data = google.visualization.arrayToDataTable([
            ['Task', 'Hours per Day'],
            ['Present', 20],
            ['Absent', 12],
            ['Late', 2]
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
                    // window.location.replace("main.html");
                } else if (Account_Type.includes('Faculty')) {
                    //window.location.replace("main.html");
                } else if (Account_Type.includes('Guidance')) {
                    // window.location.replace("main.html");
                } else { // Else
                    window.location.replace("index.html");
                }
            })
        }
    })


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
                    columns: [1, 2, 3, 4, 5]
                }
            }, {
                extend: 'pdf'
            },
            {
                extend: 'print',
                exportOptions: {
                    columns: [1, 2, 3, 4, 5]
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

                LoadTable(Account_Type, UserID)

                GetReport(`weekly`)
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
                                            console.log(report.val())

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
                        console.log(data)





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
                console.log(professors.val())
                professors.forEach(professor => {
                    professor.child('Students').forEach(student => {
                        if (student.val() != null) {
                            // This will get current professor students
                            let id = student.child('ID').val()
                            let name = student.child('Name').val()

                            firebase.database().ref(`Data/Student/Information/${id}/`).on('value', s => {

                                if (s.val() != null) {
                                    let id = s.child('ID').val()
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





function GetReport(timeframe) {

    var date = new Date()
    var day = date.getDay()
    var month = date.getMonth() + 1
    var year = date.getFullYear()


    if (timeframe.toLowerCase().includes('weekly')) {

        start = new Date(FormatDate(`01-01-2021`, "MM-DD-YY"));
        end = new Date(FormatDate(`03-01-2021`, "MM-DD-YY"));

        var data = {}
        var xValue = []
        var yValue = []


        firebase.database().ref(`Attendance/Report/Statistics/Class/`).on('value', Classes => {
            Classes.forEach(Class => {
                console.log(Class.key)

                while (start < end) {

                    let mm = start.getMonth() + 1;
                    let yy = start.getFullYear();
                    let dd = start.getDate();

                    let date = mm + '-' + dd + '-' + yy;

                    console.log(date)
                    firebase.database().ref(`Attendance/Report/Statistics/Class/${Class.key}/Dates/${date}/`).on(`value`, dates => {

                        if (dates.val() != null) {
                            console.log(dates.val())
                            let present = dates.child(`Present`).val()
                            let absent = dates.child(`Absent`).val()
                            let late = dates.child(`Late`).val()

                            console.log(dates.key + ':' + present)
                            xValue.push(present)
                            yValue.push(dates.key)


                            console.log(dates.child('Present').val())

                        }


                    })
                    
                    data.xValue = xValue;
                    data.yValue = yValue;
                    console.log(data)
                
    
                    var newDate = start.setDate(start.getDate() + 1);
                    start = new Date(newDate);
                }

            


            })
        })







    }
    if (timeframe.toLowerCase().includes('monthly')) {


        start = new Date(FormatDate(`${1}-01-${year}`, "MM-DD-YY"));
        end = new Date(FormatDate(`${month}-01-${year}`, "MM-DD-YY"));
    }
    if (timeframe.toLowerCase().includes('quarterly')) {

        start = new Date(FormatDate(`${1}-01-${year}`, "MM-DD-YY"));
        end = new Date(FormatDate(`${12}-01-${year}`, "MM-DD-YY"));
    }
    if (timeframe.toLowerCase().includes('annually')) {

        start = new Date(FormatDate(`${1}-01-${year}`, "MM-DD-YY"));
        end = new Date(FormatDate(`${12}-01-${year}`, "MM-DD-YY"));
    }
}