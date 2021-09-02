var sections = [
    {
        id: 0,
        text: 'BSIT-601A'
    },
    {
        id: 1,
        text: 'BSIT-501A'
    },
    {
        id: 2,
        text: 'BSBA-601A'
    },
    {
        id: 3,
        text: 'BSBA-501A'
    },
    {
        id: 4,
        text: 'BSTM-601A'
    },
    {
        id: 5,
        text: 'BSTM-501A'
    }
];

var subjects = [
    {
        id: 0,
        text: 'Computer Programming 1'
    },
    {
        id: 1,
        text: 'Euthenics 1'
    },
    {
        id: 2,
        text: 'Rizals Life and Work'
    },
    {
        id: 3,
        text: 'Game Development'
    },
    {
        id: 4,
        text: 'Mobile Systems and Technologies'
    },
    {
        id: 5,
        text: 'IT Capstone 1'
    }
];


$(document).ready(function(){
    $("#Select_Section").select2({
        data:sections
    });
    $("#Select_Subject").select2({
        data:subjects
    });

    $("#add").on("click", function() {  
        $("#ClassArea").append("<select id='Select_Section' style='width: 28vw;  margin-right: .2vw; margin-top: .2vw'/>");
        $("#ClassArea").append("<select id='Select_Subject' style='width: 28vw;'/>");    
    });  
    $("#delete").on("click", function() {  
       $("#ClassArea").children().last().remove();  
       $("#ClassArea").children().last().remove();  
    });  
    $("#clear").on("click", function() {  
        $("#ClassArea").children().remove();  
    });  
});

const loadFile = function(event) {
	const image = document.getElementById('output');
	image.src = URL.createObjectURL(event.target.files[0]);
};