var url = new URL(window.location.href);
let id = url.searchParams.get('id')
console.log(id);


//LOAD DATA TABLE
var status_table = $('#status-table')
$(document).ready(function () {


  status_table.DataTable({
    "dom": 'B<lf<t>ip>',
    "buttons":['excel','pdf','print'],
    "paging": true,
    "info": true,
    "lengthMenu": [[10, 20, 30, -1], [10, 20, 30, "All"]]
  });




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

    $('.name').html(`${LastName}, ${FirstName} ${MiddleName}`)

  });

  GetAttendance()


});

//THIS CODE CHANGES THE COLOR OF THE STATUS PLACEHOLDER BASED ON ITS VALUE

//THIS METHODS HIDE/SHOW THE REPORT DIV POP-UP. THE OnClick EVENT IS EMBEDDED IN THE BUTTON ON HTML

function GetAttendance() {

  $('.table-title').html('Attendances')

  let attendance_table = $('#status-table');
  attendance_table.DataTable().clear().draw();
  attendance_table.DataTable().destroy()

  attendance_table.html(' ');

  attendance_table.html(`
  <thead>
                        <tr>
                           <td>Subject</td>
                           <td>Date</td>
                           <td>Time</td>
                           <td>Status</td>
                           <td>Remarks</td>
                        </tr>
                     </thead>
                     <tbody></tbody>
                     <tfoot>
                        <tr>
                           <td>Subject</td>
                           <td>Date</td>
                           <td>Time</td>
                           <td>Status</td>
                           <td>Remarks</td>
                        </tr>
                     </tfoot>
  `)

  attendance_table.DataTable();

  firebase.database().ref(`Attendance/Summary/Student/${id}`).on('value', snap => {

    snap.child(`Class`).forEach(Class => {
      let classNbr = Class.child('ClassNbr').val()
      let title = Class.child('Title').val()
      let schedule = Class.child('Schedule').val()
      let dates = Class.child('Dates')
      dates.forEach(date => {
        let remarks = date.child('Remarks').val() == null || date.child('Remarks').val() == '' ? 'No Remarks' : date.child('Remarks').val()
        let status = {
          'present': `<span style="color:var(--green)">Present</span>`,
          'absent': `<span style="color:var(--red)">Absent</span>`,
          'arrivelate': `<span style="color:var(--yellow)">Arrive Late</span>`,
          'leaveearly': `<span style="color:var(--yellow)">Leave Early</span>`
        }
        let dateEnter = FormatDate(date.key, 'MM-DD-YY').split('-')
        let schedules = schedule.split('-')
        status_table.DataTable().row.add([`<span style="font-weight:600">${title}</span>`, `${GetMonth(dateEnter[0])} ${dateEnter[1]}, ${dateEnter[2]}`, `${toStandardTime(schedules[0])} - ${toStandardTime(schedules[1])}`,
          `<p>${status[date.child('Status').val()]}</p>`, remarks
        ]).draw()
      })
    });

    console.log(snap.child(`Gate`).val());
    snap.child(`Gate`).forEach(Gate => {
      Gate.forEach(date => {
        let status = date.child('Status').val()
        let location = date.child('Location').val()
        let timeEnter = date.child('Time').val()
        let isValid = date.child('isValid').val()

        let dateEnter = FormatDate(date.child('Date').val(), 'MM-DD-YY').split('-')




        status_table.DataTable().row.add([`<span style="font-weight:600">${location} ${status}</span>`, `${GetMonth(dateEnter[0])} ${dateEnter[1]}, ${dateEnter[2]}`, timeEnter,
          `<p>${status}</p>`, 'Not applicable'
        ]).draw()
      })

    })
  });
}

function GetReports() {

  $('.table-title').html('Reports Status')

  let report_table = $('#status-table');
  report_table.DataTable().clear().draw();
  report_table.DataTable().destroy()

  report_table.html(' ');

  report_table.html(`
  <thead>
  <tr>
     <td>Report By</td>
     <td>Reason</td>
     <td>Report Date & Time</td>
     <td>Status</td>
     <td>Action Taken</td>
     <td>Cancel Report</td>
  </tr>
</thead>
<tbody>
</tbody>
<tfoot>
  <tr>
    <td>Report By</td>
    <td>Reason</td>
    <td>Report Date & Time</td>
    <td>Status</td>
    <td>Action Taken</td>
    <td>Cancel Report</td>
  </tr>
</tfoot>
  `)

  report_table.DataTable();

  firebase.database().ref(`Data/Reported/Active/`).once('value', active => {

    active.forEach(dates => {

      let date = dates.key;

      firebase.database().ref(`Data/Reported/Active/${date}/${id}`).once('value', student => {

        student.forEach(activeReport => {
          let details = activeReport.child('Details').val()
          let id = activeReport.child('ID').val()
          let reportedStudent = activeReport.child('ReportedStudent').val().split('$')
          let reportBy = activeReport.child('ReportedBy').val().split('$')
          let time = activeReport.child('Time').val()
          let date = activeReport.child('Date').val()
      

          let statustext = activeReport.child('Status').val()
          let status = {
            'Action Taken': `<span style="color:var(--green)">Action Taken</span>`,
            'Archived': `<span style="color:var(--green)">Cancel - Move to Archive</span>`,
            'Active': `<span style="color:var(--red)">Active</span>`,
          }

          let dateName = date.split('-')


          report_table.DataTable().row.add([
            reportBy[1],
            `<span data-status="${statustext}" id="data" data-student="${reportedStudent[0]}" data-id="${id}" data-date="${date}">${details}</span>`,
            `<span style="font-weight:600">${GetMonth(dateName[0])} ${dateName[1]} ${dateName[2]}</span>, ${time}`,
            status[statustext],
            '<span style="font-weight:600">No action yet.</span>',
            `<span class="report-delete" onclick="CancelReport(this)">
        <i class='bx bxs-trash'></i>
        </span>`
          ]).draw();

        })

      })


    })
  })


  firebase.database().ref(`Data/Reported/Archive/`).once('value', active => {

    active.forEach(dates => {

      let date = dates.key;

      firebase.database().ref(`Data/Reported/Archive/${date}/${id}/`).once('value', student => {


        student.forEach(activeReport => {
          console.log(activeReport.val())

          let details = activeReport.child('Details').val()
          let id = activeReport.child('ID').val()
          let reportedStudent = activeReport.child('ReportedStudent').val().split('$')
          let reportBy = activeReport.child('ReportedBy').val().split('$')
          let time = activeReport.child('Time').val()
          let date = activeReport.child('Date').val()
          let action = activeReport.child('Action').val()
          let statustext = activeReport.child('Status').val()
          let status = {
            'Action Taken': `<span style="color:var(--green)">Action Taken</span>`,
            'Archived': `<span style="color:var(--green)">Cancel - Move to Archive</span>`,
            'Active': `<span style="color:var(--red)">Active</span>`,
          }

          let dateName = date.split('-')


          report_table.DataTable().row.add([
            reportBy[1],
            `<span data-status="${statustext}" id="data" data-student="${reportedStudent[0]}" data-id="${id}" data-date="${date}">${details}</span>`,
            `<span style="font-weight:600">${GetMonth(dateName[0])} ${dateName[1]} ${dateName[2]}</span>, ${time}`,
            status[statustext],
            `<span style="font-weight:600">${FallBackNull(action)}</span>`,
            `<span class="report-delete" onclick="CancelReport(this)">
        <i class='bx bxs-trash'></i>
        </span>`
          ]).draw();

        })

      })


    })
  })
}




$('#report').on('click', function () {

  $('#reported-name').text($('.name').html())

  $('.report').css({
    'display': 'block'
  })
})
$('.btn-submit').on('click', function (event) {


  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      let uid = user.uid;

      firebase.database().ref(`User/${uid}/`).once('value', snap => {
        let Account_Type = snap.child('Account_Type').val();
        let ID = snap.child('ID').val();
        let Role = snap.child('Role').val();
        let UserID = snap.child('UserID').val();
        let Notification = snap.child('Notification').val();
        let Permission_Tapin = snap.child('Permission').child('TapIn_First').val()

        firebase.database().ref(`Data/Faculty/Information/${UserID}`).once('value', professor => {
          let first = professor.child('Name').child('First').val();
          let middle = professor.child('Name').child('Middle').val();
          let last = professor.child('Name').child('Last').val();

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

            let report_details = $('#report_details').val();

            let key = firebase.database().ref(`Data/Reported/Active/${GetDateNow()}/${id}`).push().key
            firebase.database().ref(`Data/Reported/Active/${GetDateNow()}/${id}/${key}`).set({
              ID: key,
              Details: report_details,
              ReportedBy: `${UserID}$${last}, ${first} ${middle}`,
              ReportedStudent: `${id}$${LastName}, ${FirstName} ${MiddleName}`,
              Time: GetTimeNow(),
              Date: GetDateNow(),
              Status : 'Active'
            })

          });

          alert('Student Reported Successfully!');
          $('.modal').css('display', 'none');

       
        })

      });
    } else {

    }


    GetReports()
  });
})

$('.btn-cancel, .modal').on('click', function (event) {
  event.stopPropagation()


  if (event.target == event.currentTarget) {
    $('.modal').css('display', 'none');
  }
})


$('.close').on('click', function (event) {
  event.stopPropagation()
  $('.modal').css('display', 'none');
})


$('#attendance').on('click', function () {
  // alert('Attendance')

  status_table.DataTable().clear().draw()
  GetAttendance()
})


$('#reports').on('click', function () {
  //alert('Report')
  GetReports()
})

function CancelReport(event) {

  // alert('Click Delete!')

  let index = $(event).closest('td').parent()[0].sectionRowIndex;
  
  let data = $(event).parent().parent().find('#data')
  let id = data.attr('data-id');
  let student = data.attr('data-student');
  let date = data.attr('data-date');
  let status = data.attr('data-status');
  console.log(`${id} ${student}`)


  
  if(status != 'Active')
  {
    alert('You can`t delete this \n This already taken action!');
    return
  }
  if (confirm('Are you sure you want to cancel this report? \n This cant be undone!')) {

    firebase.database().ref(`Data/Reported/Active/${date}/${student}/${id}`).remove()
    alert('Report sucessfully removed! ')


    GetReports()

  } else {


  }

  $('#report_details').val('')



}