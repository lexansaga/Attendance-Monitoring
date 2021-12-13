var url = new URL(window.location.href);
let id = url.searchParams.get('id')
console.log(id);


//LOAD DATA TABLE
var status_table = $('#status-table')
$(document).ready(function () {

  if (id == null) {
    // window.location.replace('main.html')
  }

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


        if (Account_Type.includes('Administrator')) {
          //window.location.replace("main.html");
        } else if (Account_Type.includes('Faculty')) {
          //window.location.replace("main.html");
        } else if (Account_Type.includes('Guidance')) {
          // window.location.replace("main.html");
        } else { // Else
          window.location.replace("index.html");
        }
      })
    }
  })


  status_table.DataTable({
    "dom": 'Bfrtip',
    "buttons": ['excel', 'pdf', 'print'],
    "lengthMenu": [
      [10, 20, 30, -1],
      [10, 20, 30, "All"]
    ]
  });




  firebase.database().ref(`Data/Faculty/Information/${id}`).once('value', snap => {
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

  firebase.database().ref(`Attendance/Summary/Faculty/${id}/`).on('value', snap => {
    console.log(snap.val())
    snap.child(`Class`).forEach(Class => {
      if (Class.val() != null) {
        let classNbr = Class.child('ClassNbr').val()
        let title = Class.child('Title').val()
        let schedule = Class.child('Schedule').val()
        let dates = Class.child('Dates')
        console.log()
        dates.forEach(date => {

          console.log(date.val())
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
            `<p>${status[date.child('Status').val().toLowerCase()]}</p>`, remarks
          ]).draw()
        })

      }
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