let tableData = [[
        "CE1003",
        "IT Capstone Project 2",
        "BSIT701A",
        "W",
        "12:30PM-3:30PM",
        "B1201"
    ],
    [
        "AT1303",
        "Web Systems and Technologies",
        "BSIT701A",
        "Th",
        "12:30PM-3:30PM",
        "B3201"
    ],
    [
        "BC2553",
        "Euthenics 2",
        "BSIT701A",
        "F",
        "1:00PM-2:00PM",
        "B2305"
    ],
    [
        "YG5031",
        "Game Development",
        "BSIT701A",
        "F",
        "3:00PM-6:00PM",
        "B1101"
    ],
    [
        "TB5031",
        "Mobile Systems and Technologies",
        "BSIT701A",
        "S",
        "3:00PM-6:00PM",
        "B1101"
    ],
]

$(document).ready(function(){ 

    //INITIALIZE SELECT2
    $("#Section").select2({
        placeholder: "Section",
        allowClear: true
    });
    $("#Day").select2({
        maximumSelectionLength: 2,
        placeholder: "Day",
        allowClear: true
    });

    //INITIALIZE DATATABLE
    $('#Scheduletbl').DataTable({
        scrollX:true,
        bLengthChange: false,
        data:tableData,
        columns:[
            {title:"Class Number"},
            {title:"Course Description"},
            {title:"Section"},
            {title:"Day"},
            {title:"Time"},
            {title:"Room"}
        ]
    }); 
});