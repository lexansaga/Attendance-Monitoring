let tableData = [[
    "IT Capstone Project 2",
    "Wednesday",
    "12:30PM - 3:30PM",
    "TBA",
    "Bejar, Rouse Adam E.",
    "<img src='src/assets/profile.jpg'>"
    ],
    [
        "Web Systems and Technologies",
        "Thursday",
        "12:30PM - 3:30PM",
        "TBA",
        "Gamboa, Lucita",
        "<img src='src/assets/profile.jpg'>"
    ],
    [
        "Euthenics 2",
        "Friday",
        "1:00PM - 2:00PM",
        "TBA",
        "Bejar, Rouse Adam E.",
        "<img src='src/assets/profile.jpg'>"
    ],
    [
        "Game Development",
        "Friday",
        "3:00PM - 6:00PM",
        "TBA",
        "Gamboa, Lucita",
        "<img src='src/assets/profile.jpg'>"
    ],
    [
        "Mobile Systems and Technologies",
        "Saturday",
        "3:00PM - 6:00PM",
        "TBA",
        "Ramos, Mariel",
        "<img src='src/assets/profile.jpg'>"
    ],
]

$(document).ready(function() {
    $('#userSchedule').DataTable({
        scrollX:true,
        bLengthChange: false,
        data:tableData,
        columns:[
            {title:"Subject"},
            {title:"Day"},
            {title:"Time"},
            {title:"Room"},
            {title:"Professor"},
            {title:""}
        ]
    });
} );

$('#searchbx').focusin(function()
{
    $('.search-result').css({"opacity" : "1","display":"block"}).animate();
});
$('#searchbx').focusout(function()
{
    $('.search-result').css({"opacity" : "0","display":"none"}).animate();
});