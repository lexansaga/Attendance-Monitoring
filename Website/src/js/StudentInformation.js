//LOAD DATA TABLE
$(document).ready(function () {
  const mob = window.matchMedia("(max-width: 425px)");
  var table = $('#datatable').DataTable({
    //THIS NEXT BLOCK OF CODE CHANGES THE TEXT COLOR OF COLUMN #4 DATA BASED ON VALUE
    columnDefs: [{
        targets: 4,
        render: function (data, type, row) {
          var color = 'black';
          if (data == "Absent") {
            color = 'Red';
          }
          if (data == "Present") {
            color = 'Green';
          }
          if (data == "Late") {
            color = 'Orange';
          }
          return '<span style="color:' + color + '">' + data + '</span>';
        }
      },
      {
        "width": "30%",
        "targets": 5
      },
      {
        "width": "20%",
        "targets": 1
      }
    ],
    //THIS NEXT PROPERTIES DEFINES THE APPEARANCE OF THE TABLE
    "pagingType": "full_numbers",
    "scrollX": mob.matches,
    "autoWidth": true,
    "bLengthChange": false,
    "ajax": "src/json/studentinformation.json",
    "columns": [{
        "className": 'details-control',
        "orderable": false,
        "data": null,
        "defaultContent": ''
      },
      {
        "data": "Subject"
      },
      {
        "data": "Date"
      },
      {
        "data": "Time"
      },
      {
        "data": "Status"
      },
      {
        "data": "Remarks"
      }
    ],
    "order": [
      [2, 'desc']
    ]
  });
  //THIS CODE DEFINES THE amount of page numbers being displayed on the pagination bar
  $.fn.DataTable.ext.pager.numbers_length = 5;



  var url = new URL(window.location.href);
  let id = url.searchParams.get('id')
  console.log(id);


  firebase.database().ref(`Data/Student/Information/${id}`).once('value', snap => {
    console.log(snap.val());

    let Address = snap.child('Address').val()
    let Card_ID = snap.child('Card_ID').val()
    let Contact = snap.child('Contact').val()
    let Profile = snap.child('Profile').val()
    let Email = snap.child('Email').val()
    let FirstName = snap.child('Name').child('First').val()
    let MiddleName = snap.child('Name').child('Middle').val()
    let LastName = snap.child('Name').child('Last').val()

    $('.id').text(id)
    $('.email').text(Email)
    $('.address').text(Address)
    $('.contact').text(Contact)
    console.log(Profile);
    $('#pfp').attr('src', Profile)
    
    $('#studentName').html(`${LastName}, ${FirstName} ${MiddleName}`)

  });
});

//THIS CODE CHANGES THE COLOR OF THE STATUS PLACEHOLDER BASED ON ITS VALUE
let StudentStatus = document.getElementById("status");
if (StudentStatus.textContent == "Active") {
  StudentStatus.style.color = 'Green';
} else {
  StudentStatus.style.color = 'Red';
}

//THIS METHODS HIDE/SHOW THE REPORT DIV POP-UP. THE OnClick EVENT IS EMBEDDED IN THE BUTTON ON HTML
function showReportDiv() {
  document.getElementById('popup').style.display = "block";
}

function hideReportDiv() {
  document.getElementById('textarea_bx').value = '';
  document.getElementById('popup').style.display = "none";
}


//THIS METHOD HIDES THE REPORT DIV POP-UP WHEN MOUSE IS CLICKED OUTSIDE THE DIV ITSELF
$(document).mouseup(function (e) {
  var container = $(".Pop_Up_ReportOption");

  // if the target of the click isn't the container nor a descendant of the container
  if (!container.is(e.target) && container.has(e.target).length === 0) {
    container.hide();
  }
});