//LOAD DATA TABLE
$(document).ready(function() {
  const mob = window.matchMedia( "(max-width: 425px)" );
    var table = $('#datatable').DataTable( {
      //THIS NEXT BLOCK OF CODE CHANGES THE TEXT COLOR OF COLUMN #4 DATA BASED ON VALUE
        columnDefs: [{targets: 4,
            render: function ( data, type, row ) {
              var color = 'black';
              if (data == "Absent") {
                color = 'Red';
              } 
              if (data == "Present") {
                color = 'Green';
              }
              if (data == "Late") {
                color = 'Orange';
              }
              return '<span style="color:' + color + '">' + data + '</span>';
            } },
            { "width": "30%", "targets": 5 },
            { "width": "20%", "targets": 1 }
          ],
       //THIS NEXT PROPERTIES DEFINES THE APPEARANCE OF THE TABLE
        "pagingType": "full_numbers",
        "scrollX":mob.matches,
        "autoWidth": true,
        "bLengthChange": false,
        "ajax": "src/json/StudentInformation.json",
        "columns": [
            {
                "className":      'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": ''
            },
            { "data": "Subject" },
            { "data": "Date" },
            { "data": "Time" },
            { "data": "Status" },
            {"data":"Remarks"}
        ],
        "order": [[2, 'desc']]
    } );
    //THIS CODE DEFINES THE amount of page numbers being displayed on the pagination bar
    $.fn.DataTable.ext.pager.numbers_length = 5;
} );

//THIS CODE CHANGES THE COLOR OF THE STATUS PLACEHOLDER BASED ON ITS VALUE
let StudentStatus = document.getElementById("status");
if(StudentStatus.textContent == "Active"){
    StudentStatus.style.color='Green';
}else {
    StudentStatus.style.color='Red';
}

//THIS METHODS HIDE/SHOW THE REPORT DIV POP-UP. THE OnClick EVENT IS EMBEDDED IN THE BUTTON ON HTML
function showReportDiv(){
  document.getElementById('popup').style.display="block";
}
function hideReportDiv(){
  document.getElementById('textarea_bx').value='';
  document.getElementById('popup').style.display="none";
}


//THIS METHOD HIDES THE REPORT DIV POP-UP WHEN MOUSE IS CLICKED OUTSIDE THE DIV ITSELF
$(document).mouseup(function(e) 
{
    var container = $(".Pop_Up_ReportOption");

    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) 
    {
        container.hide();
    }
});

