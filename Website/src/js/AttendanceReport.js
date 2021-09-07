var tabview = window.matchMedia( "(max-width: 768px)" );
var mobview = window.matchMedia( "(max-width: 425px)" );

//-----------------------------------------------LINE CHART-----------------------------------------------//
const CHART = document.getElementById('line_chart');
var BarColors=['#9674CF','#18BBCB','#9674CF','#18BBCB','#9674CF','#18BBCB','#9674CF','#18BBCB','#9674CF','#18BBCB','#9674CF','#18BBCB']

let barChart = new Chart(CHART,{
    type:'bar',
    data:{
        labels:['Jan','Feb', 'Mar','Apr', 'May','June','July','Aug','Sept','Oct','Nov','Dec'],
        datasets:[
            {
                backgroundColor: BarColors,
                data:[25, 30, 50, 10, 240,550,120,10]
            }
        ]
    },
    options:{
        responsive: true,
        legend:{display: false},
        maintainAspectRatio: true
    }
})

//-----------------------------------------------PIE CHART-----------------------------------------------//
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
        backgroundColor:'transparent',
        legend: {position: 'right'},
        chartArea:{top:10,width:'100%',height:'100%'}
    };

    var chart = new google.visualization.PieChart(document.getElementById('pie_chart'));

    chart.draw(data, options);
  }



//-----------------------------------------------Data Table-----------------------------------------------//
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
    const mob = window.matchMedia( "(max-width: 425px)" );
    var table = $('#datatable').DataTable( {
        "scrollX": mob.matches,
        "bLengthChange": false,
        "ajax": "src/json/attendancereport.json",
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
    
    $.fn.DataTable.ext.pager.numbers_length = 5;
} );


function DisplaySelectedDate(){
    let FromDate=document.getElementById("From_date").value;
    let ToDate=document.getElementById("To_date").value;

    document.getElementById("date-covered").innerHTML="Showing Data from "+FromDate+" to "+ToDate;
    hideDateRangeDiv();
}


  $(document).mouseup(function(e) 
{
    var container = $("#date_select");

    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) 
    {
        container.hide();

        document.getElementById('From_date').value='';
        document.getElementById('To_date').value='';

        document.getElementById('From_date').type='text';
        document.getElementById('To_date').type='text';
    }
});


