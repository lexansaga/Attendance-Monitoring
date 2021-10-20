var select_class = $('#select_class');
var select_student = $('#select_student');

var tbody = $('#datatable tbody');
$(document).ready(function () {
    select_class.select2({
        containerCssClass: "show-hide",
        margin: '10px 10px 15px 0',
        width: '100%'
    });

    select_student.select2({
        containerCssClass: "show-hide",
        margin: '10px 10px 15px 0',
        width: '100%'
    });

    $('#datatable').DataTable();


    LoadSubjects();
    LoadStudents();
});


select_student.on("select2:select", function (e) {
    let uid = $(this).val();

    firebase.database().ref(`Data/Student/Information/${uid}`).on('value', snap => {

        let name = snap.child("Name");
        console.log(snap.val());
        tbody.append(` <tr>
        <td> <img src="${snap.child("Profile").val()}"  onerror="this.onerror=null; this.src='src/assets/avatar.png'"/></td>
        <td>${snap.child('ID').val()}</td>
        <td>${name.child('Last').val() +', '+name.child('First').val() +' '+name.child('Middle').val()}</td>
        <td><button onclick="Delete()"><i class='bx bxs-trash'></i></button></td>
    </tr>  `);
    });

});

function Delete()
{
    alert('I am delete');
}

function LoadSubjects() {
    firebase.database().ref('Data/Subject/').on('value', snap => {
        select_class.html(' ');
        select_class.append(`<option disabled selected> Select Subject </option>`);
        snap.forEach(childSnap => {

            console.log('Subject Added');
            select_class.append(`<option value='${childSnap.child('ClassNbr').val()}'> ${`<span style="color:#cccccc">(${childSnap.child('ClassNbr').val()}) </span>`+childSnap.child('Title').val()} </option>`);
        });
    });
}


function LoadStudents() {
    firebase.database().ref('Data/Student/Information/').on('value', snap => {
        select_student.html(' ');
        select_student.append(`<option disabled selected> Select Student </option>`);
        snap.forEach(childSnap => {

            let name = childSnap.child("Name");
            select_student.append(`<option value='${childSnap.child('ID').val()}'> ${`<span style="color:#cccccc">(${childSnap.child('ID').val()}) </span>`+name.child('Last').val() +', '+name.child('First').val()+' '+ name.child('Middle').val()} </option>`);
        });
    });
}