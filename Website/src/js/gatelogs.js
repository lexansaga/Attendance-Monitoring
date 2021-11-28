$(document).ready( function () {
    $('#logs_table').DataTable({
        dom: 'Bfrtip',
        buttons: [
            'excel', 'pdf', 'print'
        ],
        scrollX:true
    });
} );