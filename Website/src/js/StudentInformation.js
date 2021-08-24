//Data Table 
$(document).ready(function() {
    var table = $('#datatable').DataTable( {
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
            }
       }],
        "pagingType": "full_numbers",
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
        "order": [[1, 'asc']]
    } );
} );
  
let StudentStatus = document.getElementById("status");
if(StudentStatus.textContent == "Active"){
    StudentStatus.style.color='Green';
}else {
    StudentStatus.style.color='Red';
}