$(document).ready(function () {

  

    MediaQuery();
    OnLoadMediaQuery();
   // DashBoardResponsive();
    Chart.defaults.global.defaultFontFamily = "Karla";
    PieChart();
    LineChart();
});




function OnLoadMediaQuery()
{
    var width = $(window).width();
    var height = $(window).height();
    if (width > 768) {
       // alert("Desktop");


    } else if (width < 768 && width > 425) {
        //  alert("Tablet");
        ChartSizes();
        DashBoardResponsive();


    } else if (width < 425) {
        //   alert("Mobile");
        ChartSizes();
        DashBoardResponsive();

    }

}
function MediaQuery() {
    $(window).on('resize', function (e) {
        var width = $(window).width();
        var height = $(window).height();

        if (width > 768) {
            // alert("Desktop");

        
        } else if (width < 768 && width > 425) {
 
            DashBoardResponsive();
            ChartSizes();
            //  alert("Tablet");
          } else if (width < 425) {
            ChartSizes();
            //   alert("Mobile");
        }
    });
}
function ChartSizes()
{
    var prof = $('.professor').width();
    $('.pie-chart').css("width", prof);
    $('.line-chart').css("width", prof);
}


function PieChart() {
    var xValues = ["Absent","Present","Late"];
    var yValues = [Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100)];
    var barColors = [
        "#B14674",
        "#FE5277",
        "#FF8D73",
        "#FFDF9A",
        "#E1EDFF"
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
    var xValues = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

    new Chart("lineChart", {
        type: "line",
        data: {
            labels: xValues,
            datasets: [{
                label:'Absent' ,
                data: [Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000), 
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000), 
                    Math.floor(Math.random() * 8000), 
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000)],
                    borderWidth: 1,
                borderColor: "#FFDF9A",
                backgroundColor: 'rgba(255,223,154,0.2)',
                fill: true
            }, {
                label:'Present' ,
                data: [Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000), 
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000), 
                    Math.floor(Math.random() * 8000), 
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000)],
                    borderWidth: 1,
                borderColor: "#FE5277",
                backgroundColor: "rgba(254, 82, 119,0.2)",
                fill: true
            }, {
                label:'Late' ,
                data: [Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000), 
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000), 
                    Math.floor(Math.random() * 8000), 
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000)],
                    borderWidth: 1,
                borderColor: "#FF8D73",
                backgroundColor: "rgba(255, 141, 115,0.2)",
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