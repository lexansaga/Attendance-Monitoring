var termstart = $('#termstart')
var termend = $('#termend')
var selectSem = $('#sem')
var btnAddTerm = $('#btn_addTerm')


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
                    let nextsem = sessionStorage.getItem('NEXT_SEMESTER')
                    if(nextsem != null)
                    {   
                        selectSem.val(nextsem)
                        selectSem.prop('disabled',true)
                    }
                //    LoadLocation()
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
});

termstart.change(function()
{
    termend.val('')
    termend.prop('min',termstart.val())
})

$('#btn_addTerm').click(function()
{
    if(termstart.val() == '' || termend.val() == '')
    {
        alert('Fill up information!')
    }
    else
    {
        if( selectSem.prop('disabled') == true)
        {
            let nextsem = sessionStorage.getItem('NEXT_SEMESTER')
            let currentsem = sessionStorage.getItem('CURRENT_SEMESTER')
            ResetAcademicYear(currentsem);
        }
        else
        {
          
          
        }  
        if(selectSem.val().includes('First'))
        {
            
            let start = termstart.val().split('-')
            let end = termend.val().split('-')
            firebase.database().ref('Settings/Term').update(
                {
                    TermStart : termstart.val(),
                    TermEnd : termend.val(),
                    Semester: selectSem.val(),
                    AcademicYear: `${start[0]}-${end[0]}`
                })
        
        }
        else
        {
            firebase.database().ref('Settings/Term').update(
                {
                    TermStart : termstart.val(),
                    TermEnd : termend.val(),
                    Semester: selectSem.val()
                })
        }
    
     
    
    
        alert('Term save sucessfully')
    }
   

})


function ResetAcademicYear(academicYearPrompt) {

    // let yearNow = parseInt(GetDateNow().split('-')[2]);
   //  let academicYearDefault = `${yearNow}-${yearNow + 1}`;
 
    // let academicYearPrompt = prompt('Add Academic Year ', academicYearDefault)
     if (confirm(`Are you sure you want to archive ${academicYearPrompt} ? Proceeding will create new term and reset current subjects of faculty and students. All of the subjects will need to reimport based on your preferrences`)) {
         let confirm = prompt('Enter this word to confirm! `I am sure`')
         if (confirm.includes('I am sure')) {
 
           //  let academicYearTobeDeleted = academicYearDefault.split('-')
             firebase.database().ref("Data/Subject/").once('value', subjects => {
 
                 if (subjects.val() != null) {
                     //Scan all subjects          
 
 
                     firebase.database().ref(`Archive/Academic_Year/${academicYearPrompt}/Data/Subject`).update(subjects.val())
                     firebase.database().ref('Data/Subject/').remove()
 
                     alert('Subject save on archive sucessfully!')
 
                 }
 
             })
 
 
             firebase.database().ref('Attendance/').once('value', attendances => {
                 if (attendances.val() != null) {
                     firebase.database().ref(`Archive/Academic_Year/${academicYearPrompt}/Attendance`).update(attendances.val())
                     firebase.database().ref('Attendance/').remove()
 
                     alert('Attendances save on archive sucessfully!')
                 }
             })
 
             firebase.database().ref('Data/Faculty/Information').once('value', faculties => {
                 if (faculties.val() != null) {
                     firebase.database().ref(`Archive/Academic_Year/${academicYearPrompt}/Data/Faculty/Information`).update(faculties.val())
                     faculties.forEach(faculty => {
 
                         if (faculty.val() != null) {
                             let id = faculty.child('ID').val()
                             firebase.database().ref(`Data/Faculty/Information/${id}/Subject`).remove()
                         }
                     })
 
                 }
 
 
             })
 
 
             firebase.database().ref('Data/Student/Information').once('value', students => {
 
                 if (students.val() != null) {
                     firebase.database().ref(`Archive/Academic_Year/${academicYearPrompt}/Data/Student/Information`).update(students.val())
                     students.forEach(student => {
                         if (student.val() != null) {
                             let id = student.child('ID').val()
                             firebase.database().ref(`Data/Student/Information/${id}/Subject`).remove()
                         }
                     })
                 }
 
             })
 
 
         } else {
             alert('Data archived cancelled!')
         }
 
     } else {
         alert('Data archived cancelled!')
     }
 
 }

