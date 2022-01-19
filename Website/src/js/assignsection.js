var select_department = $('#select_department');
var select_section = $('#select_section')
var select_student = $('#select_student');
var select_subject = $('#select_subject');

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

      select_department.select2({
          containerCssClass: 'show-hide',
          margin: '10px 10px 15px 0',
          width: '100%',
     });

     select_section.select2({
          containerCssClass: 'show-hide',
          margin: '10px 10px 15px 0',
          width: '100%',
     });

     select_student.select2({
          containerCssClass: 'show-hide',
          margin: '10px 10px 15px 0',
          width: '100%',
     });

     select_subject.select2({
          containerCssClass: 'show-hide',
          margin: '10px 10px 15px 0',
          width: '100%',
     });

     $('#datatable').DataTable({
          dom: 'Bfrtip',
          buttons: [
               {
                   text: 'Assign Subject',
                   action: function ( e, dt, node, config ) {
                       alert( 'Button activated' );
                   }
               }
           ]
     });
     LoadSubjects();
     LoadDepartment();
     LoadStudents();
});



select_student.on('select2:select', function (e) {
     let uid = $(this).val();
     
     firebase.database().ref('Data/Student/Information/').orderByChild('ID').startAt(uid).endAt(uid).once('value',students =>
     {    
         students.forEach(student =>
          {
               console.log(student.val())
               let sid = student.child('ID').val()
               let sfirst = student.child('Name').child('First').val()
               let smiddle = student.child('Name').child('Middle').val()
               let slast = student.child('Name').child('Last').val()
               let sprofile = student.child('Profile').val()
               sprofile = sprofile == null ? 'src/assets/avatar.png' : sprofile

               let subjects = student.child('Subject')

               $('#profile').attr('src',sprofile );
               $('#name').html(`${slast}, ${sfirst} ,${smiddle}`)
               $('#id').html(`${sid}`)

               subjects.forEach(subject =>
                    {
                         if(subject.val() != null)
                         {
                              console.log(subject.val())
                              let subID = subject.val()
                              firebase.database().ref(`Data/Subject/${subID}`).once('value',subInfo =>{
                                   if(subInfo.val() != null)
                                   {
                                        let code = subInfo.child('ClassNbr').val()
                                        let deparment = subInfo.child('Department').val()
                                        deparment = deparment == null ? 'No department assign' : deparment
                                        let description = subInfo.child('Description').val()
                                        let title = subInfo.child('Title').val()
                                        let location = subInfo.child('Location').val()
                                        let section = subInfo.child('Section').val()
                                        section = section == null ? 'No section assign' : section
                                        let schedTime = subInfo.child('Schedule').child('Time').val()
                                        schedTime = schedTime != null ? schedTime.split('-') : 'No schedule assign'
                                        let schedDay = subInfo.child('Schedule').child('Day').val()
                                        schedDay = schedDay != null && schedDay.includes(',')  ? schedDay.split(',') : schedDay
                                        let professor = subInfo.child('Professor').val()
          
                                        firebase.database().ref(`Data/Faculty/Information/${professor}`).once('value',prof =>
                                             {
                                                  let ffirst = prof.child('Name').child('First').val()
                                                  let fmiddle = prof.child('Name').child('Middle').val()
                                                  let flast = prof.child('Name').child('Last').val()
          
                                                  console.log(prof.val())
          
                                                  datatable.DataTable().row.add([
                                                       code,
                                                       title,
                                                       location,
                                                       `${toStandardTime(schedTime[0])} - ${toStandardTime(schedTime[1])}`,
                                                       `${schedDay}`,
                                                       deparment,
                                                       section,
                                                       `${flast}, ${fmiddle} ${ffirst}`,
                                                       `<button onclick="Delete(this)"><i class='bx bxs-trash'></i></button>`,
                                                       
                                                  ]).draw()
                                             })
          
                                   }
                              
                              })
                         }
                      
                    })
               
          })
     })

});
select_section.on('select2:select', function (e) {
     let uid = $(this).val()
     console.log(uid)
     firebase.database().ref(`Data/Subject/`).orderByChild('Section').startAt(uid).endAt(uid).once('value',subInfos =>{
          subInfos.forEach(subInfo =>
               {
                    console.log(subInfo.val())
                    let code = subInfo.child('ClassNbr').val()
                    let deparment = subInfo.child('Department').val()
                    deparment = deparment == null ? 'No department assign' : deparment
                    let description = subInfo.child('Description').val()
                    let title = subInfo.child('Title').val()
                    let location = subInfo.child('Location').val()
                    let section = subInfo.child('Section').val()
                    section = section == null ? 'No section assign' : section
                    let schedTime = subInfo.child('Schedule').child('Time').val()
                    schedTime = schedTime != null ? schedTime.split('-') : 'No schedule assign'
                    let schedDay = subInfo.child('Schedule').child('Day').val()
                    schedDay = schedDay != null && schedDay.includes(',')  ? schedDay.split(',') : schedDay
                    let professor = subInfo.child('Professor').val()
          
                    firebase.database().ref(`Data/Faculty/Information/${professor}`).once('value',prof =>
                         {
                              let ffirst = prof.child('Name').child('First').val()
                              let fmiddle = prof.child('Name').child('Middle').val()
                              let flast = prof.child('Name').child('Last').val()
          
                              console.log(prof.val())
          
                              datatable.DataTable().row.add([
                                   code,
                                   title,
                                   location,
                                   `${toStandardTime(schedTime[0])} - ${toStandardTime(schedTime[1])}`,
                                   `${schedDay}`,
                                   deparment,
                                   section,
                                   `${flast}, ${fmiddle} ${ffirst}`,
                                   `<button onclick="Delete(this)"><i class='bx bxs-trash'></i></button>`,
                                   
                              ]).draw()
                         })
               })


   

     })

})

select_department.on('select2:select', function (e) {
     let uid = $(this).val();
     select_section.attr('disabled',false)
     LoadSection(uid)
   
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

}

function LoadSubjects() {
     firebase
          .database()
          .ref('Data/Subject/')
          .on('value', (snap) => {
               select_subject.html(' ');
               select_subject.append(
                    `<option value="default" disabled selected> Select Subject </option>`
               );
               snap.forEach((childSnap) => {
                    console.log('Subject Added');
                    select_subject.append(
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

function LoadDepartment()
{
     firebase.database().ref('Data/Course/').once('value',departments => {
          select_department.html(' ');
          select_department.append(
               `<option value="default" disabled selected> Select Department </option>`
          );
          departments.forEach(department =>
                    {
                         let code = department.child('Code').val()
                         let name = department.child('Name').val()
                      
                         select_department.append(
                              `<option value="${code}"> (${code}) ${name}</option>`
                         );
                        
                    })

     })
}

function LoadSection(code)
{
     firebase.database().ref('Data/Section/').orderByChild('Code').startAt(code).endAt(code).once('value', sections=>
     { select_section.html(' ');
     select_section.append(
          `<option value="default" disabled selected> Select Section </option>`
     );
          sections.forEach(section =>
               {
                    let code = section.child('Code').val()
                    let name = section.child('Name').val()
                 
                    select_section.append(
                         `<option value="${code}${name}"> (${code}) ${name}</option>`
                    );
                   
               })
     })
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

//      if (select_department.val() == null) {
//           alert('Select your class first!');
//           return;
//      }

//      let class_set = [];
//      // $('#datatable tbody tr').each(function () {
//      //      //  alert($(this).find('td').eq(1).text() + " " + $(this).find('td').eq(2).text());

//      //      // This will get data from table and save on class set array on dictionary form
//      //      class_set.push({
//      //           ID: $(this).find('td').eq(1).text(),
//      //           Name: $(this).find('td').eq(2).text(),
//      //      });

//      $('#datatable').DataTable().rows().every(function () {
//           var row = this.data()
//           var id = row[1]
//           var name = row[2]

//           class_set.push({
//                ID: id,
//                Name: name,
//           });
//      // alert($(this)
//      //      .find('td')
//      //      .eq(1)
//      //      .text());
//      firebase
//           .database()
//           .ref(`Data/Student/Information/${id}/Subject/`)
//           .once('value', (subjects) => {

//                //  console.log(subjects.val());
//                let subject = [];
//                subjects.forEach((childSubject) => {
//                     console.log('Subjects' + childSubject.val());
//                     subject.push(childSubject.val());
//                });
//                subject.push(select_department.val());


//                let newSubject = [...new Set(subject)]; //This will remove duplicates
//                firebase.database().ref(`Data/Student/Information/${id}/Subject/`).set(newSubject);
//           });


// });


// // tobedeleted.forEach(deleted => {
// //      console.log(deleted);
// //        firebase.database().ref(`Data/Student/Information/${deleted}/Subject/`).once('value', snap => {
// //                  console.log(snap.val());

// //                  snap.forEach(ids =>
// //                       {
// //                            console.log(ids.key+':'+ids.val());
// //                            if(ids.val() == select_department.val())
// //                            {
// //                                 console.log("ID Equal True" + ids.key);
// //                               firebase.database().ref(`Data/Student/Information/${deleted}/Subject/${ids.key}`).remove()
// //                            }
// //                       });
// //        });
// //   })


// //   console.log(class_set);
// firebase
//      .database()
//      .ref('Data/Subject/' + select_department.val() + '/Students/')
//      .set(class_set);

// class_set.length = 0;
// alert('Class created successfully');

// $('#datatable').DataTable().clear().draw()
});