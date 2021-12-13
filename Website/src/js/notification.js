$(document).ready( function () {
    $('#table_id').DataTable({
        "columnDefs": [
            { "width": "1%", "targets": 3 }
          ],
          "ordering":false
    });
} );