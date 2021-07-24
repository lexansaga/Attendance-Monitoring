$(document).ready(function()
{
    $("#btn_menu").click(function()
    {
        $(".s-navbar").show();
      //  $('body:not(.s-navbar)').css('filter','blur(4px)').css('opacity','1');
     
    });
    if (performance.navigation.type == 2) {
        alert("Back button clicked");
    }
    $(".profile-picture").click(function()
    {
        $(".profile-menu").show();
    });
   PieChart();
   LineChart();
});


function PieChart()
{
      var xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
        var yValues = [55, 49, 44, 24, 15];
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
                    }
                }
            }
        });
}
function LineChart()
{
       var xValues = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

        new Chart("lineChart", {
            type: "line",
            data: {
                labels: xValues,
                datasets: [{
                    data: [860, 1140, 1060, 1060, 1070, 1110, 1330, 2210, 7830, 2478],
                    borderColor: "#FFDF9A",
                    backgroundColor: 'rgba(255,223,154,0.2)',
                    fill: true
                }, {
                    data: [1600, 1700, 1700, 1900, 2000, 2700, 4000, 5000, 6000, 7000],
                    borderColor: "#FE5277",
                    backgroundColor: "rgba(254, 82, 119,0.2)",
                    fill: true
                }, {
                    data: [300, 700, 2000, 5000, 6000, 4000, 2000, 1000, 200, 100],
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
                    }
                }

            }
        });
}