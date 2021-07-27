$(document).ready(function () {


   // alert("loaded");
    // DashBoardResponsive();
    sOnLoadMediaQuery();
    sMediaQuery();
    Chart.defaults.global.defaultFontFamily = "Karla";
    PieChart();
    LineChart();
});




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
    var xValues = ["Absent", "Present", "Late"];
    var yValues = [Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100)
    ];
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

function LineChart() {
 //   alert("Line Chart Loaded");
    var xValues = ["Day 1", 200, 300, 400, 500, 600, 700, 800, 900, 1000];

    new Chart("lineChart", {
        type: "line",
        data: {
            labels: xValues,
            datasets: [{
                label: 'Absent',
                data: [Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000)
                ],
                borderWidth: 1,
                borderColor: "#59BAF3",
                backgroundColor: 'rgba(89, 186, 243,0.2)',
                fill: true
            }, {
                label: 'Present',
                data: [Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000)
                ],
                borderWidth: 1,
                borderColor: "#68CF71",
                backgroundColor: "rgba(104, 207, 113,0.2)",
                fill: true
            }, {
                label: 'Late',
                data: [Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000)
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