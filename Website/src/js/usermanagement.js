const SubjectScheduleData=[{
        'ClassNumber':'C1101',
        'CourseDescription':'Computer Programming',
        'section':'BSIT101A',
        'day':"Monday",
        'time':'11:00AM - 3:00PM',
        'room':'B1201',
        'professor':'Dr. Wuzowski'
    },
    {
        'ClassNumber':'C1202',
        'CourseDescription':'Computer Programming',
        'section':'BSIT101A',
        'day':"Monday",
        'time':'11:00AM - 3:00PM',
        'room':'B1201',
        'professor':'Dr. Wuzowski'
    },
    {
        'ClassNumber':'B2105',
        'CourseDescription':'Computer Programming',
        'section':'BSIT101A',
        'day':"Monday",
        'time':'11:00AM - 3:00PM',
        'room':'B1201',
        'professor':'Dr. Wuzowski'
    },
    {
        'ClassNumber':'F2106',
        'CourseDescription':'Computer Programming',
        'section':'BSIT101A',
        'day':"Monday",
        'time':'11:00AM - 3:00PM',
        'room':'B1201',
        'professor':'Dr. Wuzowski'
    }
]

buildTable();  


$(document).ready(function(){ 
    $("#Select_Section").select2({
        //only select Specific Properties From an Array of Objects
        data:SubjectScheduleData.map(a => a.ClassNumber)
    });

    $('#output').click(function(){ $('#selectPicture').trigger('click'); });

    VerifyType()
});

$(window).click(function (e) {
    if (e.target.className.includes('modal')) {
        $('.modal').css('display', 'none');
    }
    console.log(e.target.className);
});
$(".setSubjectSection").click(function (e) {

    $('.modal:eq(0)').css('display', 'block');

});
$(".close").click(function (e) {

    $('.modal:eq(0)').css('display', 'none');

});
$(".ModalCancel").click(function (e) {

    $('.modal:eq(0)').css('display', 'none');

});

const loadFile = function(event) {
	const image = document.getElementById('output');
	image.src = URL.createObjectURL(event.target.files[0]);
};


function buildTable() {
    const table = $('#SubjectSection-table')

    for (var i = 1 in SubjectScheduleData) {
        var row = `<tr>
                  <td>${SubjectScheduleData[i].CourseDescription}</td>
                  <td>${SubjectScheduleData[i].section}</td>
                  <td>${SubjectScheduleData[i].day}</td>
                  <td>${SubjectScheduleData[i].time}</td>
                  <td>${SubjectScheduleData[i].professor}</td>
                  `
        table.append(row)
    }
}

function VerifyType(){
    const selected = document.getElementById("UserType");
    const e = selected.options[selected.selectedIndex].text;
    
    if(e == "Student"){
        document.getElementById("UserSetup").style.display = "none";
        document.getElementById("cbx").style.display = "none";
        document.getElementById('mainBTN').style.display = "block";
        document.getElementById('Maintable').style.display = "block";

        document.getElementById("Email").style.display = "block";
        document.getElementById('LName').style.display = "block";
        document.getElementById('FName').style.display = "block";
        document.getElementById('MName').style.display = "block";
        document.getElementById('ID').style.display = "block";
        document.getElementById('ContactNumber').style.display = "block";
        document.getElementById('Address').style.display = "block";
        document.getElementById('setSubject').style.display = "block";
    }else if(e=="Faculty"){
        document.getElementById("UserSetup").style.display = "block";
        document.getElementById("cbx").style.display = "block";
        document.getElementById('mainBTN').style.display = "block";
        document.getElementById('Maintable').style.display = "block";
        document.getElementById("Email").style.display = "none";

        document.getElementById('LName').style.display = "block";
        document.getElementById('FName').style.display = "block";
        document.getElementById('MName').style.display = "block";
        document.getElementById('ID').style.display = "block";
        document.getElementById('ContactNumber').style.display = "block";
        document.getElementById('Address').style.display = "block";
        document.getElementById('setSubject').style.display = "block";
    }else if(e=="Gate"){
        document.getElementById("UserSetup").style.display = "block";
        document.getElementById('ID').style.display = "block";
        document.getElementById('mainBTN').style.display = "block";
        document.getElementById("Email").style.display = "none";

        document.getElementById("cbx").style.display = "none";
        document.getElementById('Maintable').style.display = "none";
        document.getElementById('LName').style.display = "none";
        document.getElementById('FName').style.display = "none";
        document.getElementById('MName').style.display = "none";
        document.getElementById('ContactNumber').style.display = "none";
        document.getElementById('Address').style.display = "none";
        document.getElementById('setSubject').style.display = "none";
    }else{
        document.getElementById("Email").style.display = "none";
        document.getElementById("UserSetup").style.display = "none";
        document.getElementById("cbx").style.display = "none";
        document.getElementById('mainBTN').style.display = "none";
        document.getElementById('Maintable').style.display = "none";

        document.getElementById('LName').style.display = "none";
        document.getElementById('FName').style.display = "none";
        document.getElementById('MName').style.display = "none";
        document.getElementById('ID').style.display = "none";
        document.getElementById('ContactNumber').style.display = "none";
        document.getElementById('Address').style.display = "none";
        document.getElementById('setSubject').style.display = "none";
    }
}