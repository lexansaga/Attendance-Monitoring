var tabview = window.matchMedia("(max-width: 768px)");
var mobview = window.matchMedia("(max-width: 425px)");

//-----------------------------------------------LINE CHART-----------------------------------------------//
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

//-----------------------------------------------PIE CHART-----------------------------------------------//
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


var table = $('#datatable');
//-----------------------------------------------Data Table-----------------------------------------------//

$(document).ready(async function () {
    table.DataTable({
        dom: 'B<f<t>ip>',
        buttons: [{ extend: 'excel',exportOptions:{columns: [ 1, 2, 3, 4, 5]}},{extend: 'pdf'},
            {
                extend: 'print',
                exportOptions: {
                    columns: [ 1, 2, 3, 4, 5]
                }
            }
        ]
    });
    LoadTable()
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

function LoadTable() {
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



                var present = []
                var absent = []
                var late = []

                firebase.database().ref(`Attendance/Summary/Student/${id}/`).on('value', reports => {

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
                                absent.push(`${dates.key}$${remarks}`)
                            }
                        })

                    })

                    table.DataTable().row.add(
                        [
                            ` <a href="StudentInformation.html?id=${id}"> <img src="${profile}"  onerror="this.onerror=null; this.src='src/assets/avatar.png'"/>`,
                            id,
                            `${last}, ${first} ${middle}`,
                            present.length,
                            absent.length,
                            late.length
                        ]).draw()

                    // console.log(`${ id,
                    //             `${last}, ${first} ${middle}`,
                    //             present.length,
                    //             absent.length,
                    //             late.length}`)
                })

            })
        }








    })

}





function GetReport(timeframe) {

    var date = new Date()
    var day = date.getDay()
    var month = date.getMonth() + 1
    var year = date.getFullYear()


    if (timeframe.toLowerCase().includes('weekly')) {


        start = new Date(FormatDate(``, "MM-DD-YY"));
        end = new Date(FormatDate(GetDateNow(), "MM-DD-YY"));
    }
    if (timeframe.toLowerCase().includes('monthly')) {


        start = new Date(FormatDate(`${1}-01-${year}`, "MM-DD-YY"));
        end = new Date(FormatDate(`${month}-01-${year}`, "MM-DD-YY"));
    }
    if (timeframe.toLowerCase().includes('quarterly')) {

        start = new Date(FormatDate(`${1}-01-${year}`, "MM-DD-YY"));
        end = new Date(FormatDate(`${12}-01-${year}`, "MM-DD-YY"));
    }
    if (timeframe.toLowerCase().includes('yearly')) {

        start = new Date(FormatDate(`${1}-01-${year}`, "MM-DD-YY"));
        end = new Date(FormatDate(`${12}-01-${year}`, "MM-DD-YY"));
    }
}