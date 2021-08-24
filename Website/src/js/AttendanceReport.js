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
        responsive: true,
        legend:{display: false},
        maintainAspectRatio: true
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
        chartArea:{top:10,width:200,height:150},
        width: 350,
        height: 200
    };
    var tabview = window.matchMedia( "(max-width: 768px)" );
    var mobview = window.matchMedia( "(max-width: 425px)" );
    if (tabview.matches) {
        var options = {
            legend: {position: 'bottom'},
            chartArea:{top:10,width:150,height:135},
            width: 300,
            height: 200
        };
    }
    else if(mobview.matches) {
        
    }

    var chart = new google.visualization.PieChart(document.getElementById('pie_chart'));

    chart.draw(data, options);
  }



  //Data Table


  /* Formatting function for row details - modify as you need */
function format ( d ) {
    // `d` is the original data object for the row
    return '<table>'+
        '<tr>'+
            '<td rowspan="3">'+d.Pfp+'</td>'+
            '<td>Full name:</td>'+
            '<td>'+d.FullName+'</td>'+
            '<td> </td>'+
            '<td>Address: </td>'+
            '<td>'+d.Address+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Email Address:</td>'+
            '<td>'+d.Email+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Contact Number:</td>'+
            '<td>'+d.ContactNumber+'</td>'+
        '</tr>'+
    '</table>';
}
 
$(document).ready(function() {
    var table = $('#datatable').DataTable( {
        "bLengthChange": false,
        "ajax": "src/json/AttendanceReport.json",
        "columns": [
            {
                "className":      'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": ''
            },
            { "data": "id" },
            { "data": "FullName" },
            { "data": "DaysPresent" },
            { "data": "DaysAbsent" },
            {"data":"DaysLate"}
        ],
        "order": [[1, 'asc']]
    } );
     
    // Add event listener for opening and closing details
    $('#datatable tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row( tr );
 
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format(row.data()) ).show();
            tr.addClass('shown');
        }
    } );
} );