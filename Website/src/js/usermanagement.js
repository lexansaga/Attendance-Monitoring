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

const SubjectScheduleData=[{
    'id':'1',
    'subject':'Computer Programming',
    'day':"Monday",
    'time':'11:00AM - 3:00PM',
    'room':'B1201',
    'section':'BSIT101A',
    'professor':'Dr. Wuzowski'
    },
    {
        'id':'2',
        'subject':'Computer Programming',
        'day':"Monday",
        'time':'11:00AM - 3:00PM',
        'room':'B1201',
        'section':'BSIT101A',
        'professor':'Dr. Wuzowski'
    },
    {
        'id':'3',
        'subject':'Computer Programming',
        'day':"Monday",
        'time':'11:00AM - 3:00PM',
        'room':'B1201',
        'section':'BSIT101A',
        'professor':'Dr. Wuzowski'
    },
    {
        'id':'4',
        'subject':'Computer Programming',
        'day':"Monday",
        'time':'11:00AM - 3:00PM',
        'room':'B1201',
        'section':'BSIT101A',
        'professor':'Dr. Wuzowski'
    }
]

buildTable();  


$(document).ready(function(){ 
    $("#Select_Section").select2({
        //only select Specific Properties From an Array of Objects
        data:sections.map(a => a.text)
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
                  <td>${SubjectScheduleData[i].subject}</td>
                  <td>${SubjectScheduleData[i].day}</td>
                  <td>${SubjectScheduleData[i].time}</td>
                  <td>${SubjectScheduleData[i].room}</td>
                  <td>${SubjectScheduleData[i].section}</td>
                  <td>${SubjectScheduleData[i].professor}</td>
                  `
        table.append(row)
    }
}

function VerifyType(){
    const selected = document.getElementById("UserType");
    const e = selected.options[selected.selectedIndex].text;
    
    if(e == "Student"){
        document.getElementById("ContactNumber").disabled = false;
        document.getElementById("Address").disabled = false;
        document.getElementById("setSubject").disabled = false;
        document.getElementById("username").disabled = false;
        document.getElementById("password").disabled = false;
        document.getElementById("cbx").style.display = "none";
        document.getElementById("UserSetup").style.display = "none";
        document.getElementById("btnsave").disabled = false;
        document.getElementById("btndelete").disabled = false;
    }else if(e=="Faculty"){
        document.getElementById("ContactNumber").disabled = false;
        document.getElementById("Address").disabled = false;
        document.getElementById("setSubject").disabled = false;
        document.getElementById("username").disabled = false;
        document.getElementById("password").disabled = false;
        document.getElementById("cbx").style.display = "block";
        document.getElementById("UserSetup").style.display = "block";
        document.getElementById("btnsave").disabled = false;
        document.getElementById("btndelete").disabled = false;
    }else{
        document.getElementById("ContactNumber").disabled = true;
        document.getElementById("Address").disabled = true;
        document.getElementById("setSubject").disabled = true;
        document.getElementById("username").disabled = true;
        document.getElementById("password").disabled = true;
        document.getElementById("cbx").style.display = "none";
        document.getElementById("UserSetup").style.display = "none";
        document.getElementById("btnsave").disabled = true;
        document.getElementById("btndelete").disabled = true;
    }
}