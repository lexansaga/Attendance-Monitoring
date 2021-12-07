var select_class = $('#select_class');
var select_student = $('#select_student');

var tbody = $('#datatable tbody');

var datatable = $('#datatable');

$(document).ready(function () {
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
                      window.location.replace("main.html");
                  } else if (Account_Type.includes('Guidance')) {
                      window.location.replace("main.html");
                  } else { // Else
                      window.location.replace("index.html");
                  }
              })
          }
      })

     select_class.select2({
          containerCssClass: 'show-hide',
          margin: '10px 10px 15px 0',
          width: '100%',
     });

     select_student.select2({
          containerCssClass: 'show-hide',
          margin: '10px 10px 15px 0',
          width: '100%',
     });

     $('#datatable').DataTable({
          ordering: false
     });

     LoadSubjects();
     LoadStudents();
});

select_student.on('select2:select', function (e) {
     let uid = $(this).val();

     if ($(`#datatable tr > td:contains(${uid})`).length > 0) {
          // alert("ID exists on table");
          return;
     }
     $('.dataTables_empty').parent().remove();
     select_student.val('default').trigger('change');
     firebase
          .database()
          .ref(`Data/Student/Information/${uid}`)
          .on('value', (snap) => {
               let name = snap.child('Name');
               console.log(snap.val());
               datatable
                    .DataTable()
                    .row.add([
                         `<img src="${snap
                              .child('Profile')
                              .val()}"  onerror="this.onerror=null; this.src='src/assets/avatar.png'"/>`,
                         snap.child('ID').val(),
                         snap.child('Name').child('Last').val() +
                         ', ' +
                         snap.child('Name').child('First').val() + ` ` +
                         snap.child('Name').child('Middle').val(),
                         `<button onclick="Delete(this)"><i class='bx bxs-trash'></i></button>`,
                    ])
                    .draw();
          });
});

select_class.on('select2:select', function (e) {
     let uid = $(this).val();
     firebase
          .database()
          .ref(`Data/Subject/${uid}/Students/`)
          .on('value', (snap) => {
               datatable.DataTable().clear().draw();
               snap.forEach((childSnap) => {
                    let ID = childSnap.child('ID').val();

                    firebase
                         .database()
                         .ref(`Data/Student/Information/${ID}`)
                         .on('value', (data) => {
                              console.log(data.val());
                              datatable
                                   .DataTable()
                                   .row.add([
                                        `<img src="${data
                                             .child('Profile')
                                             .val()}"  onerror="this.onerror=null; this.src='src/assets/avatar.png'"/>`,
                                        data.child('ID').val(),
                                        data.child('Name').child('Last').val() +
                                        ', ' +
                                        data
                                        .child('Name')
                                        .child('First')
                                        .val() +
                                        ' ' +
                                        data
                                        .child('Name')
                                        .child('Middle')
                                        .val(),
                                        `<button onclick="Delete(this)"><i class='bx bxs-trash'></i></button>`,
                                   ])
                                   .draw();
                         });
               });
          });
});

var tobedeleted = [];

function Delete(e) {
     //  alert('I am delete');
     //  $(e).parent().parent().remove();

     let index = $(e).closest('td').parent()[0].sectionRowIndex;

     let id = $(`#datatable tbody tr:eq(${index}) td:eq(${1})`).html();


     // alert(id);
     tobedeleted.push(id);
     datatable.DataTable().row(index).remove().draw();
     console.log(tobedeleted);
     //   $(`#datatable tbody tr:eq(${index})`).remove()
     //  alert(index);
     // let index = datatable.DataTable().row(e).index();

     //  alert(index)
     // alert();


     // alert(index);
     //   let id = datatable.find('tr').eq(index).find('td').eq(1).html();

     //  alert(id);
     //tobedeleted.push(id)
     //console.log(tobedeleted);
     //   alert();
     //   console.log($(e).parent('tr').data());
     //  console.log($.parseHTML($(e).parent().parent().html())[1]);
     //   tobedeleted.push($.parseHTML($(e).parent().parent().html())[1])
     //    console.log(tobedeleted);
}

function LoadSubjects() {
     firebase
          .database()
          .ref('Data/Subject/')
          .on('value', (snap) => {
               select_class.html(' ');
               select_class.append(
                    `<option value="default" disabled selected> Select Subject </option>`
               );
               snap.forEach((childSnap) => {
                    console.log('Subject Added');
                    select_class.append(
                         `<option value='${childSnap
                              .child('ClassNbr')
                              .val()}'> ${
                              `<span style="color:#cccccc">(${childSnap
                                   .child('ClassNbr')
                                   .val()}) </span>` +
                              childSnap.child('Title').val()
                         } </option>`
                    );
               });
          });
}

function LoadStudents() {
     firebase
          .database()
          .ref('Data/Student/Information/')
          .on('value', (snap) => {
               select_student.html(' ');
               select_student.append(
                    `<option value="default"  disabled selected> Select Student </option>`
               );
               snap.forEach((childSnap) => {
                    let name = childSnap.child('Name');
                    select_student.append(
                         `<option value='${childSnap.child('ID').val()}'> ${
                              `<span style="color:#cccccc">(${childSnap
                                   .child('ID')
                                   .val()}) </span>` +
                              name.child('Last').val() +
                              ', ' +
                              name.child('First').val() +
                              ' ' +
                              name.child('Middle').val()
                         } </option>`
                    );
               });
          });
}

$('#submits').click(function () {
     if (select_class.val() == null) {
          alert('Select your class first!');
          return;
     }



     let class_set = [];
     // $('#datatable tbody tr').each(function () {
     //      //  alert($(this).find('td').eq(1).text() + " " + $(this).find('td').eq(2).text());

     //      // This will get data from table and save on class set array on dictionary form
     //      class_set.push({
     //           ID: $(this).find('td').eq(1).text(),
     //           Name: $(this).find('td').eq(2).text(),
     //      });

     $('#datatable').DataTable().rows().every(function () {
          var row = this.data()
          var id = row[1]
          var name = row[2]

          class_set.push({
               ID: id,
               Name: name,
          });
 
     // alert($(this)
     //      .find('td')
     //      .eq(1)
     //      .text());
     firebase
          .database()
          .ref(`Data/Student/Information/${id}/Subject/`)
          .once('value', (subjects) => {

               //  console.log(subjects.val());
               let subject = [];
               subjects.forEach((childSubject) => {
                    console.log('Subjects' + childSubject.val());
                    subject.push(childSubject.val());
               });
               subject.push(select_class.val());


               let newSubject = [...new Set(subject)]; //This will remove duplicates
               firebase.database().ref(`Data/Student/Information/${id}/Subject/`).set(newSubject);
          });
});


// tobedeleted.forEach(deleted => {
//      console.log(deleted);
//        firebase.database().ref(`Data/Student/Information/${deleted}/Subject/`).once('value', snap => {
//                  console.log(snap.val());

//                  snap.forEach(ids =>
//                       {
//                            console.log(ids.key+':'+ids.val());
//                            if(ids.val() == select_class.val())
//                            {
//                                 console.log("ID Equal True" + ids.key);
//                               firebase.database().ref(`Data/Student/Information/${deleted}/Subject/${ids.key}`).remove()
//                            }
//                       });
//        });
//   })


//   console.log(class_set);
firebase
     .database()
     .ref('Data/Subject/' + select_class.val() + '/Students/')
     .set(class_set);

class_set.length = 0;
alert('Class created successfully');
});