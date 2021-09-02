$(document).ready(function(){
    $("#Select_Section").select2();
    $("#Select_Subject").select2();

    $("#add").on("click", function() {  
        $("#ClassArea").append("<input type='text'/>");
        $("#ClassArea").append("<input type='text'/>");    
    });  
    $("#delete").on("click", function() {  
        $("#ClassArea").children().last().remove();  
    });  
});

const loadFile = function(event) {
	const image = document.getElementById('output');
	image.src = URL.createObjectURL(event.target.files[0]);
};