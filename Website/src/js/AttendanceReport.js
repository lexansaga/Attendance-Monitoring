//LINE CHART
const CHART = document.getElementById('line_chart');
var BarColors=['#9674CF','#18BBCB','#9674CF','#18BBCB','#9674CF','#18BBCB','#9674CF','#18BBCB','#9674CF','#18BBCB','#9674CF','#18BBCB']

let barChart = new Chart(CHART,{
    type:'bar',
    data:{
        labels:['Jan','Feb', 'Mar','Apr', 'May','June','July','Aug','Sept','Oct','Nov','Dec'],
        datasets:[
            {
                backgroundColor: BarColors,
                data:[25, 30, 50, 10, 240,300,120,10]
            }
        ]
    },
    options:{
        legend:{display: false}
    }
})

//PIE CHART
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);
function drawChart() {

    var data = google.visualization.arrayToDataTable([
      ['Task', 'Hours per Day'],
      ['Present',     20],
      ['Absent',      12],
      ['Late',  2]
    ]);

    var options = {
        legend: {position: 'bottom'},
        chartArea:{top:10,width:200,height:100,height:150},
    };

    var chart = new google.visualization.PieChart(document.getElementById('pie_chart'));

    chart.draw(data, options);
  }