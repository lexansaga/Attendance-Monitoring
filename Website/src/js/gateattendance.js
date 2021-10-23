var slideIndex = 0;
showSlides();

function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
  setTimeout(showSlides, 10000); // Change image every 2 seconds
}

const timecont = document.getElementById('dateTime');

function time() {
  var d = new Date();
  var s = d.getSeconds();
  var m = d.getMinutes();
  var h = d.getHours();
  timecont.textContent = d.toLocaleString();
}

setInterval(time, 1000);

$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

function ShowSettings() {
  document.getElementById("logout").style.display = "block";
  document.getElementById("Maximize").style.display = "block";
  $('.settings').css('opacity', '100');
}

function HideSettings() {
  document.getElementById("logout").style.display = "none";
  document.getElementById("Maximize").style.display = "none";
  $('.settings').css('opacity', '0');
}

function getFullscreenElement() {
  return document.fullscreenElement
}

function maximizeme() {
  document.documentElement.requestFullscreen()
  document.getElementById("Maximize").textContent = "close_fullscreen";
  if (getFullscreenElement()) {
    document.exitFullscreen();
    document.getElementById("Maximize").textContent = "open_in_full";
  }
}

function ShowInput() {
  $('#rfid_card').css('opacity', '100');
}

function HideInput() {
  $('#rfid_card').css('opacity', '0');
}

$(document).ready(function () {
  //$('.modal:eq(0)').css('display', 'block');
  document.getElementById("rfid_card").focus();
});

//TRAP FOCUS IN THE INPUT AREA IF USER CLICK ANYWHERE IN THE BODY
$('#rfid_card').blur(function (event) {
  setTimeout(function () {
    $("#rfid_card").focus();
  }, 20);
});



// READING RFID CARD VALUE
var IDValue = "";

document.getElementById("rfid_card").onchange = function () {
  $('.modal:eq(0)').css('display', 'block');
  IDValue = document.getElementById("rfid_card").value;
  document.getElementById("rfid_card").value = '';

  // alert(IDValue);

  $('.user_sched > tbody').html(' ')
  $('#userpfp').attr('src', 'src/assets/avatar.png');
  $('.user_name').html('--')
  $('.user_id').html('--')
  $('.user_section').html('--')

  firebase.database().ref(`Data/Student/Information/`).orderByChild('Card_ID').startAt(IDValue).endAt(IDValue).once('value', snap => {


    if (snap.val() == null) {
      //If student doesnt match any IDS check for professor
      console.log('Searching for Professor...');
      firebase.database().ref(`Data/Faculty/Information/`).orderByChild(`Card_ID`).startAt(IDValue).endAt(IDValue).once('value', data => {
        console.log(data.val());

        data.forEach(profData => {
          console.log(profData.val());

          $('.user_name').html(`${profData.child('Name').child('Last').val()}, ${profData.child('Name').child('First').val()} ${profData.child('Name').child('Middle').val().substring(0,1)}`);

          $('.user_id').html(profData.child('ID').val());

          $('#userpfp').attr('src', profData.child('Profile').val());

          let unformmated_date = new Date();
          let month = unformmated_date.getMonth() + 1;
          let year = unformmated_date.getFullYear();
          let day = unformmated_date.getDate();
          let id = profData.child('ID').val();
          let location = $('#LogInName').html().split(' ')[0];
          let status = $('#LogInName').html().split(' ')[1];
          let timestamp = Date.now();
          let IsValid = true;
          let date = month + '-' + day + '-' + year;
          let hours = unformmated_date.getHours();
          let minute = unformmated_date.getMinutes();
          let seconds = unformmated_date.getSeconds();

          let time = hours + ':' + minute + ":" + seconds;


          console.log("ID : " + id);
          console.log("Location : " + location);
          console.log("Status : " + status);
          console.log("Timestamp : " + timestamp);
          console.log("isValid : " + IsValid);
          console.log("Date : " + date);
          console.log("Time : " + time);

          var key = firebase.database().ref(`Attendance/Gate/${date}`).push().key;
          firebase.database().ref(`Attendance/Gate/${date}/${key}`).set({
            ID: key,
            EnteredID: id,
            Location: location,
            Status: status,
            TimeStamp: timestamp,
            isValid: IsValid,
            "Date": date,
            Time: GetClockNow()
          });


          firebase
            .database()
            .ref(`Data/Subject/`).orderByChild('Professor').startAt(id).endAt(id)
            .once('value', (scheduleSnap) => { // Get All the Subjects
              console.log(scheduleSnap.val());

              scheduleSnap.forEach(subjects => {
                console.log(`Subjects`);
                console.log(subjects.val());
                let schedule = subjects.child('Schedule').child('Time').val().split('-')

                $('.user_sched > tbody').append(`<tr>
                <td>${subjects.child('Title').val()}</td>
                <td>${toStandardTime(schedule[0].substring(1,schedule[0].length - 3))} - ${toStandardTime(schedule[1].substring(1,schedule[0].length - 3))}</td>
                <td>${subjects.child('Location').val()}</td>
                <td>${profData.child('Name').child('Last').val()}, ${profData.child('Name').child('First').val()} ${profData.child('Name').child('Middle').val()}</td>
           </tr>`);
              });

            });

        })
      })
    } else {
      //Else student  match any IDS, show data
      console.log('Searching for Student...');
      snap.forEach(data => {

        console.log(data.val());
        $('.user_name').html(`${data.child('Name').child('Last').val()}, ${data.child('Name').child('First').val()} ${data.child('Name').child('Middle').val().substring(0,1)}`);

        $('.user_id').html(data.child('ID').val());

        $('#userpfp').attr('src', data.child('Profile').val());

        let unformmated_date = new Date();
        let month = unformmated_date.getMonth() + 1;
        let year = unformmated_date.getFullYear();
        let day = unformmated_date.getDate();
        let id = data.child('ID').val();
        let location = $('#LogInName').html().split(' ')[0];
        let status = $('#LogInName').html().split(' ')[1];
        let timestamp = Date.now();
        let IsValid = true;
        let date = month + '-' + day + '-' + year;
        let hours = unformmated_date.getHours();
        let minute = unformmated_date.getMinutes();
        let seconds = unformmated_date.getSeconds();

        let time = hours + ':' + minute + ":" + seconds;

        console.log("ID : " + id);
        console.log("Location : " + location);
        console.log("Status : " + status);
        console.log("Timestamp : " + timestamp);
        console.log("isValid : " + IsValid);
        console.log("Date : " + date);
        console.log("Time : " + time);

        var key = firebase.database().ref(`Attendance/Gate/${date}`).push().key;
        firebase.database().ref(`Attendance/Gate/${date}/${key}`).set({
          ID: key,
          EnteredID: id,
          Location: location,
          Status: status,
          TimeStamp: timestamp,
          isValid: IsValid,
          "Date": date,
          Time: GetClockNow()
        });

        firebase
          .database()
          .ref(`Data/Subject/`)
          .once('value', (scheduleSnap) => { // Get All the Subjects

            scheduleSnap.forEach((schedule) => { //Loop on all Schedule
              schedule.child('Students').forEach((childSchedule) => { //Redirect on Student child
                //console.log('IDS : '+childSchedule.child('ID').val());
                if (childSchedule.child('ID').val() ==
                  data.child('ID').val()) {
                  // Check if the child of Students are equal to dropdown val
                  //  console.log('Parent : ' + childSchedule.ref.parent.parent.key);

                  firebase
                    .database()
                    .ref(
                      `Data/Subject/${childSchedule.ref.parent.parent.key}/`
                    ) // Get of Parent of this child
                    .once('value', (subjects) => {



                      //   console.log('Subjects : '+subjects.val());
                      firebase
                        .database()
                        .ref(
                          `Data/Faculty/Information/${subjects
                                .child('Professor')
                                .val()}`
                        )
                        .once('value', (professor) => {
                          // Get Professor Data
                          console.log(
                            `${professor.child('Name').child('Last').val()}, ${professor.child('Name').child('First').val()} ${professor.child('Name').child('Middle').val()} `
                          );
                          // tableUserSched.DataTable().row.add([subjects.child('Title').val(), subjects.child('Schedule').child('Day').val(), subjects.child('Schedule').child('Time').val(), subjects.child('Location').val(),
                          //         `${professor.child('Name').child('Last').val()}, ${professor.child('Name').child('First').val()} ${professor.child('Name').child('Middle').val()} `
                          //     ])
                          //     .draw();
                          let schedule = subjects.child('Schedule').child('Time').val().split('-');
                          $('.user_sched > tbody').append(`<tr>
                                    <td>${subjects.child('Title').val()}</td>
                                    <td>${toStandardTime(schedule[0].substring(1,schedule[0].length - 3))} - ${toStandardTime(schedule[1].substring(1,schedule[0].length - 3))}</td>
                                    <td>${subjects.child('Location').val()}</td>
                                    <td>${professor.child('Name').child('Last').val()}, ${professor.child('Name').child('First').val()} ${professor.child('Name').child('Middle').val()}</td>
                               </tr>`);

                        });


                    });
                }
              });
            });
          });

      });
    }

  })
  setTimeout(function () {
    $('.modal').css('display', 'none');
  }, 3000); // <-- timeout in milliseconds
};