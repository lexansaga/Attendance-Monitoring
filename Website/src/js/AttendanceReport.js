var tabview = window.matchMedia("(max-width: 768px)");
var mobview = window.matchMedia("(max-width: 425px)");

function ComboChart(data)
{
    google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawVisualization);

      function drawVisualization() {
        // Some raw data (not necessarily accurate)
        var data = google.visualization.arrayToDataTable([
          ['Month', 'Bolivia', 'Ecuador', 'Madagascar', 'Papua New Guinea', 'Rwanda', 'Average'],
          ['2004/05',  165,      938,         522,             998,           450,      614.6],
          ['2005/06',  135,      1120,        599,             1268,          288,      682],
          ['2006/07',  157,      1167,        587,             807,           397,      623],
          ['2007/08',  139,      1110,        615,             968,           215,      609.4],
          ['2008/09',  136,      691,         629,             1026,          366,      569.6]
        ]);

        var options = {
          title : 'Monthly Coffee Production by Country',
          vAxis: {title: 'Status Count'},
          hAxis: {title: 'Status'},
          seriesType: 'bars',
          series: {5: {type: 'line'}}
        };

        var chart = new google.visualization.ComboChart($('#line_chart'));
        chart.draw(data, options);
      }
}

//-----------------------------------------------LINE CHART-----------------------------------------------//
function LineChart(data) {
    const CHART = document.getElementById('line_chart');

    var BarColors = ['#9674CF', '#18BBCB', '#9674CF', '#18BBCB', '#9674CF', '#18BBCB', '#9674CF', '#18BBCB', '#9674CF', '#18BBCB', '#9674CF', '#18BBCB']

    let barChart = new Chart(CHART, {
        type: 'bar',
        data: {
            labels: data.xValues,
            datasets: [{
                backgroundColor: BarColors,
                data: data.yValues
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

                GetReport(`monthly`)
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



        let data = {}
        let xValue = []
        let yValue = []


        firebase.database().ref(`Attendance/Report/Statistics/Class/`).on('value', Classes => {



            Classes.forEach(Class => {
                console.log(Class.key)


                start = new Date(FormatDate(`01-01-2021`, "MM-DD-YY"));
                end = new Date(FormatDate(`02-01-2021`, "MM-DD-YY"));

                while (start < end) {

                    let mm = start.getMonth() + 1;
                    let yy = start.getFullYear();
                    let dd = start.getDate();

                    let date = mm + '-' + dd + '-' + yy;

                    console.log(date)
                    firebase.database().ref(`Attendance/Report/Statistics/Class/${Class.key}/Dates/${FormatDate(date,`MM-DD-YY`)}/`).on(`value`, dates => {

                        if (dates.val() != null) {

                            let present = dates.child(`Present`).val()
                            let absent = dates.child(`Absent`).val()
                            let late = dates.child(`Late`).val()

                            console.log(dates.key + ':' + present)
                            xValue.push(present)
                            yValue.push(dates.key)


                            console.log(dates.child('Present').val())

                        }
                    })

                    var refDate = firebase.database().ref(`Attendance/Report/Statistics/Class/${Class.key}/Dates/${date}/`);
                    console.log(refDate.toString())

                    data.xValues = xValue;
                    data.yValues = yValue;
                    console.log(data)

                    //  LineChart(data)

                    var newDate = start.setDate(start.getDate() + 1);
                    start = new Date(newDate);
                }

            })
        })







    }
    if (timeframe.toLowerCase().includes('monthly')) {

        let data = {}
        let xValue = []
        let yValue = []

        let present = 0;
        let absent = 0
        let arrivelate = 0
        let leaveEarly = 0


        let monthly = {}

      

        start = new Date(FormatDate(`${1}-01-${year}`, "MM-DD-YY"));
        end = new Date(FormatDate(`${month}-01-${year}`, "MM-DD-YY"));

        firebase.database().ref(`Attendance/Report/Statistics/Class/`).on('value', Classes => {

            let dPresent = 0;
            let dAbsent = 0;
            let dArriveLate = 0;
            let dLeavEarly = 0;

            Classes.forEach(Class => {
                console.log(Class.key)

                Class.child(`Dates`).forEach(dates => {

                    
                    if (dates.val() != null) {
                        console.log(dates.val())

                        let countPresent = dates.child('Present').val()
                        let countAbsent = dates.child('Absent').val()
                        let countArriveLate = dates.child('ArriveLate').val()
                        let countLeaveEarly =dates.child('LeaveEarly').val()

                        let monthDate = dates.child('Date').val()

                       

                        if(monthDate != null)
                        {
                           let monthString = GetMonth(monthDate.toString().substring(0,2))
                            console.log(monthString)

                     
                            if(monthString.includes(`January`))
                            {
                                dPresent += parseInt(countPresent)
                                dAbsent += parseInt(countAbsent)
                                dArriveLate += parseInt(countArriveLate)
                                dLeavEarly += parseInt(countLeaveEarly)
                                monthly['p'+monthString] +=  dPresent
                                monthly['a'+monthString] += dAbsent
                                monthly['al'+monthString] +=  dArriveLate
                                monthly['le'+monthString] += dLeavEarly
                            }
                            if(monthString.includes(`February`))
                            {
                                dPresent += parseInt(countPresent)
                                dAbsent += parseInt(countAbsent)
                                dArriveLate += parseInt(countArriveLate)
                                dLeavEarly += parseInt(countLeaveEarly)

                                monthly['p'+monthString] += dPresent
                                monthly['a'+monthString] += dAbsent
                                monthly['al'+monthString] +=  dArriveLate
                                monthly['le'+monthString] += dLeavEarly
                            }
                          
                        
                        }

                        present += parseInt(countPresent)
                        absent += parseInt(countAbsent)
                        arrivelate += parseInt(countArriveLate)
                        leaveEarly += parseInt(countLeaveEarly)

                       

                    
                   
                
                    }

                    var ref = firebase.database().ref(`Attendance/Report/Statistics/Class/${Class.key}/Dates/`).orderByKey().startAt(`01`);
                    console.log(ref.toString())
                })

                data.Present = present;
                data.Absent = absent;
                data.ArriveLate = arrivelate;
                data.LeaveEarly = leaveEarly;

                PieChart(data)

                console.log(monthly)
                console.log(data.Absent)
            })
        })


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