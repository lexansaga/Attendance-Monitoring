var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDate();


var i = 0;
$('#add').click(function () {
    

    var table = $('tbody tr .n');
    var head = $('thead tr .n');
    var foot = $('tfoot tr .n');

    table.after(`<td></td>`);
 //   headfoot.after(`<td><input type="date"  value='${year + '-' + month + '-' + day}'/></td>`);
    head.after(`<td><input type="date"/></td>`);
    foot.after(`<td><input type="date" disabled/></td>`);

});

$().click(function()
{

});

var attstatus = {
    'Present': `<i  data-status='present' class='bx bxs-circle' style="color:#69E486;"></i><button title="Add Remarks" class="remarks" onclick="OpenModal()">Add/View Remarks</button>`,
    'Absent': `<i data-status='absent' class='bx bxs-circle' style="color:#FE5277;"></i><button title="Add Remarks" class="remarks" onclick="OpenModal()">Add/View Remarks</button>`,
    'ArriveLate': `<i data-status='arrivelate' class='bx bx-chevrons-left' style="color: #FEB331; "></i><button title="Add Remarks" class="remarks" onclick="OpenModal()">Add/View Remarks</button>`,
    'LeaveEarly': `<i data-status='leaveearly' class='bx bx-chevrons-right' style="color: #FEB331;"></i><button title="Add Remarks" class="remarks" onclick="OpenModal()">Add/View Remarks</button>`
}

$('table').on('click', 'tbody tr td:not(".n")', function () {
    //  alert($(this).html());
    var value = $(this).children().attr('data-status');
   // alert(value)
    if(value == null)
    {
        $(this).html(attstatus[Object.keys(attstatus)[0]]);
    }
    else if(value == 'present')
    {
        $(this).html(attstatus[Object.keys(attstatus)[1]]);
    }
    else if(value == 'absent')
    {
        $(this).html(attstatus[Object.keys(attstatus)[2]]);
    }
    else if(value == 'arrivelate')
    {
        $(this).html(attstatus[Object.keys(attstatus)[3]]);
    }
    else if(value == 'leaveearly')
    {
        $(this).html(attstatus[Object.keys(attstatus)[0]]);
    }
    else
    {
       
    }

    console.log(value);

});

function OpenModal(){
    $('.modal:eq(0)').css('display', 'block');
}

  function CloseModal(){
    $('.modal:eq(0)').css('display', 'none');
  }
