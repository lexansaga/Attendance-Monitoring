
$(document).ready(function(){ 
    $("#Section").select2({
        placeholder: "Section",
        allowClear: true
    });
    $("#Day").select2({
        maximumSelectionLength: 2,
        placeholder: "Day",
        allowClear: true
    });
});