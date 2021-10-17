//Start -- Initializaion of Objects 
var role = $('#Role');
var studentEmail = $('#Email');
var lastName = $('#LName');
var firstName = $('#FName');
var middleName = $('#MName');
var ID = $('#ID');
var contact = $('#ContactNumber');
var address = $('#Address');

var subject = $('#setSubject');

var userSetup = $('#UserSetup');
var email = $('#UserEmail');
var password = $('#password');


var permission = $('#cbx');
var mainTable = $('#Maintable');
var mainButton = $('#mainBTN');

var searchperson = $('#SearchPerson');

var profilePicture = $('#output');

//End -- Initializaion of Objects

//Start -- Onload Function

$(document).ready(function () {


    var url = new URL(window.location.href);
    let usermanagementType = url.searchParams.get('type');
    console.log(usermanagementType);

    if (usermanagementType.includes('add')) {
        // alert("Add");

    } else if (usermanagementType.includes('update')) {
        //alert("Update");

    } else {
        //alert("Delete");

    }

    $('.js-example-basic-single').select2();
    searchperson.select2({
        containerCssClass: "show-hide",
        width: '98.5%',
        margin: '10px 10px 15px 0'
    });



    $('#output').click(function () {
        //This method for selecting image
        $('#selectPicture').trigger('click');
    });

    VerifyType();

    firebase.database().ref('Data/Subject').on('value', snap => {
        // This Promise will read Subject Data on Firebase and add on Select object on modal Table
        snap.forEach(childSnap => {
            console.log(childSnap.val());
            $("#Select_Section").append(new Option("(" + childSnap.child('ClassNbr').val() + ")" + childSnap.child('Title').val(), childSnap.child('ClassNbr').val(), false, false)).trigger('change');

        });
    });

    // Start - Modal table Function

    $('.ModalAdd').click(function () {
        // This function add row on modal table
        var data = $('#Select_Section').find(':selected').val();
        console.log($(`#modal-table tbody tr > td:contains(${data})`).length);
        if ((data != null || data != '') &&
            $(`#modal-table tbody tr > td:contains(${data})`).length == 0) {
            firebase.database().ref('Data/Subject/' + data).on('value', snap => {

                // console.log(snap.child('Schedule').val());
                let schedule = []
                snap.child('Schedule').forEach(schedules => {
                    schedule.push(schedules.val());
                });
                $('#modal-table tbody').append(`
          <tr>
          <td>${snap.child('ClassNbr').val()}</td>
          <td>${snap.child('Title').val()}</td>
          <td>${snap.child('Description').val()}</td>
          <td>${schedule[0]}</td>
          <td>${schedule[1]}</td>
          <td>${snap.child('Professor').val()}</td>
          <td><i class="material-icons delete-row">delete_forever</i></td>
       </tr>
       `);
            });
        }
    });

    $('.ModalSubmit').click(function () {
        // This fuction hide the modal table
        $('.modal:eq(0)').css('display', 'none');

        $('#SubjectSection-table tbody').html($('#modal-table tbody').html());
    });

    $('.ModalCancel').click(function () {
        // This fuction hide the modal table
        $('.modal:eq(0)').css('display', 'none');
    });
    //End -- Modal table Function




});

// End -- Onload Function



$(window).click(function (e) {
    if (e.target.className == 'modal') {
        $('.modal').css('display', 'none');
    }
    // console.log(e.target.className);
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

const loadFile = function (event) {
    // This function will load the image from source to img
    const image = document.getElementById('output');
    image.src = URL.createObjectURL(event.target.files[0]);

};

async function DownloadUrl(PATH) {
    //This function will get the download url of storage base on PATH
    var storageRef = firebase.storage().ref(PATH);
    var downloadUrl = await storageRef.getDownloadURL().then();
    console.log(downloadUrl);
    return downloadUrl;
}




var reset = function () {
    //This function will reset all the input existed
    studentEmail.val('');
    lastName.val('');
    firstName.val('');
    middleName.val('');
    ID.val('');
    contact.val('');
    address.val('');

    email.val('');
    password.val('');

    $('#output').attr('src', 'src/assets/avatar.png');
    $('#file').val('');

    $('table >  tbody').html('');
    $("#Select_Section").val('');

    $("input[type=checkbox]").prop("checked", false);

    $('.inputArea >  input, .inputArea > textarea,.UserSetup > input').each(function () {

        $(this).css({
            //   'border': 'none'
        });

    });

    searchperson.val("default").trigger('change');


}


var loadid = function (USER) {
    //This function will read the count from the path then return the value + 1 to get the ID
    firebase.database().ref('Data/' + USER + '/Information').once('value', snap => {
        var count = (snap.numChildren() + 1).toString();
        console.log(count);

        ID.val((USER).toUpperCase().substring(0, 4) + '1' + ('000000' + count).substring(count.length))
    });
}



function VerifyType() {
    const selected = document.getElementById("UserType");
    const e = selected.options[selected.selectedIndex].text;
    console.log('Selected:' + e);

    var url = new URL(window.location.href);
    let usermanagementType = url.searchParams.get('type');
    console.log(usermanagementType);



    if (e == "Student") {
        reset();
        userSetup.css({
            'display': 'none'
        });
        permission.css({
            'display': 'none'
        });
        mainButton.css({
            'display': 'block'
        });
        mainTable.css({
            'display': 'block'
        });


        studentEmail.css({
            'display': 'block'
        });
        lastName.css({
            'display': 'block'
        });
        firstName.css({
            'display': 'block'
        });
        middleName.css({
            'display': 'block'
        });
        ID.css({
            'display': 'block'
        });
        ID.attr('placeholder', 'Enter Student ID');

        contact.css({
            'display': 'block'
        });
        address.css({
            'display': 'block'
        });
        subject.css({
            'display': 'block'
        });
        role.css({
            'display': 'none'
        });


        LoadSearch(e);


        //  alert('Student Selected');
        if (usermanagementType.includes('add')) {
            // alert("Add");
            loadid('Student');


        } else if (usermanagementType.includes('update')) {
            //alert("Update");
            $(".containerSearchPerson").css({
                'display': 'block'
            });

            $('.inputArea > input,textarea, #UserSetup input, #setSubject').prop('disabled', true).css({
                'background-color': 'white'
            });
            $('#btnsave').html('Update');
        } else {
            //alert("Delete");
            $(".containerSearchPerson").css({
                'display': 'block'
            });
            $('.inputArea > input,textarea, #UserSetup input, #setSubject').prop('disabled', true).css({
                'background-color': 'white'
            });
            $('#btnsave').html('Delete');
        }




    } else if (e == "Faculty") {
        reset();
        userSetup.css({
            'display': 'block'
        });
        permission.css({
            'display': 'block'
        });
        mainButton.css({
            'display': 'block'
        });
        mainTable.css({
            'display': 'block'
        });

        studentEmail.css({
            'display': 'none'
        });
        lastName.css({
            'display': 'block'
        });
        firstName.css({
            'display': 'block'
        });
        middleName.css({
            'display': 'block'
        });
        ID.css({
            'display': 'block'
        });
        ID.attr('placeholder', 'Enter Faculty ID');

        contact.css({
            'display': 'block'
        });
        address.css({
            'display': 'block'
        });
        subject.css({
            'display': 'block'
        });

        role.css({
            'display': 'block'
        });





        //  alert('Student Selected');
        if (usermanagementType.includes('add')) {
            // alert("Add");
            loadid('Student');


        } else if (usermanagementType.includes('update')) {
            //alert("Update");
            $(".containerSearchPerson").css({
                'display': 'block'
            });

            $('.inputArea > input,textarea, #UserSetup input, #setSubject').prop('disabled', true).css({
                'background-color': 'white'
            });
            $('#btnsave').html('Update');
        } else {
            //alert("Delete");
            $(".containerSearchPerson").css({
                'display': 'block'
            });
            $('.inputArea > input,textarea, #UserSetup input, #setSubject').prop('disabled', true).css({
                'background-color': 'white'
            });
            $('#btnsave').html('Delete');
        }

        LoadSearch(e);

    } else if (e == "Gate") {
        reset();
        userSetup.css({
            'display': 'block'
        });
        permission.css({
            'display': 'none'
        });
        mainButton.css({
            'display': 'block'
        });
        mainTable.css({
            'display': 'none'
        });

        studentEmail.css({
            'display': 'none'
        });
        lastName.css({
            'display': 'none'
        });
        firstName.css({
            'display': 'none'
        });
        middleName.css({
            'display': 'none'
        });
        ID.css({
            'display': 'block'
        });
        ID.attr('placeholder', 'Enter Gate ID');

        contact.css({
            'display': 'none'
        });
        address.css({
            'display': 'none'
        });
        subject.css({
            'display': 'none'
        });

        role.css({
            'display': 'none'
        });



        //  alert('Student Selected');
        if (usermanagementType.includes('add')) {
            // alert("Add");
            loadid('Student');


        } else if (usermanagementType.includes('update')) {
            //alert("Update");
            $(".containerSearchPerson").css({
                'display': 'block'
            });
            $('.inputArea > input:not(#ID),textarea, #UserSetup input, #setSubject').prop('disabled', true).css({
                'background-color': 'white'
            });
            $('#btnsave').html('Update');
        } else {
            //alert("Delete");
            $(".containerSearchPerson").css({
                'display': 'block'
            });
            $('.inputArea > input,textarea, #UserSetup input, #setSubject').prop('disabled', true).css({
                'background-color': 'white'
            });
            $('#btnsave').html('Delete');
        }


        LoadSearch(e);
    } else {
        reset();
        document.getElementById("Email").style.display = "none";
        document.getElementById("UserSetup").style.display = "none";
        document.getElementById("cbx").style.display = "none";
        document.getElementById('mainBTN').style.display = "none";
        document.getElementById('Maintable').style.display = "none";

        document.getElementById('LName').style.display = "none";
        document.getElementById('FName').style.display = "none";
        document.getElementById('MName').style.display = "none";
        document.getElementById('ID').style.display = "none";
        document.getElementById('ContactNumber').style.display = "none";
        document.getElementById('Address').style.display = "none";
        document.getElementById('setSubject').style.display = "none";

        userSetup.css({
            'display': 'none'
        });
        permission.css({
            'display': 'none'
        });
        mainButton.css({
            'display': 'none'
        });
        mainTable.css({
            'display': 'none'
        });

        studentEmail.css({
            'display': 'none'
        });
        lastName.css({
            'display': 'none'
        });
        firstName.css({
            'display': 'none'
        });
        middleName.css({
            'display': 'none'
        });
        ID.css({
            'display': 'none'
        });
        ID.attr('placeholder', 'Enter Gate ID');

        contact.css({
            'display': 'none'
        });
        address.css({
            'display': 'none'
        });
        subject.css({
            'display': 'none'
        });
        role.css({
            'display': 'none'
        });

    }
}


$('#btnsave').click(function (event) {
    const selected = document.getElementById("UserType");
    const e = selected.options[selected.selectedIndex].text;

    const Role = document.getElementById("Role");
    const selectedRole = Role.options[Role.selectedIndex].text;

    if (e == 'Student') {
        event.stopPropagation();
        console.log(e);

        //Start -- Check fields if no values
        if (studentEmail.val() == '' || lastName.val() == '' ||
            firstName.val() == '' || middleName.val() == '' ||
            ID.val() == '' || contact.val() == '' ||
            address.val() == '') {

            alert('Fill up necessary information!');
            // Start -- This will check for each empty input and mark red
            $('.inputArea >  input, .inputArea >  textarea').each(function () {
                if ($(this).val() == '') {
                    $(this).css({
                        'border': '1px solid red'
                    });
                } else {
                    $(this).css({
                        'border': 'none'
                    });
                }
            })
            // End -- This will check for each empty input and mark red
            return;

        }
        //End -- Check fields if no values

        let Subject = [];
        for (var i = 0; i < $('#modal-table tbody tr').length; i++) {
            Subject.push($('#modal-table tbody tr:eq(' + i + ') td').html());
            //This will append all the subjects and create a certain format
        }


        var file = document.getElementById("file");
        file = file.files[0];

        var storageRef = firebase.storage().ref('Profile/Student/' + ID.val());
        storageRef.put(file).then((snapshot) => {
            storageRef.getDownloadURL()
                .then((url) => {
                    // Insert url into an <img> tag to "download"
                    firebase.database().ref(`Data/Student/Information/${ID.val()}`).set({
                        "Address": address.val(),
                        "Contact": contact.val(),
                        "ID": ID.val(),
                        "Email": studentEmail.val(),
                        "Name": {
                            "First": firstName.val(),
                            "Middle": middleName.val(),
                            "Last": lastName.val()
                        },
                        Subject,
                        "Profile": url
                    });
                    alert('Student Save Successfully');
                    reset();
                    loadid('Student');
                })
                .catch((error) => {

                    console.log('Error ' + error)
                });
        });




    } else if (e == 'Faculty') {
        event.stopPropagation();
        console.log(e);

        //Start -- Check fields if no values
        if (email.val() == '' || password.val() == '' ||
            lastName.val() == '' ||
            firstName.val() == '' || middleName.val() == '' ||
            ID.val() == '' || contact.val() == '' ||
            address.val() == '') {

            alert('Fill up necessary information!');
            // Start -- This will check for each empty input and mark red
            $('.inputArea >  input,.inputArea >  textarea,#UserSetup > input').each(function () {
                if ($(this).val() == '') {
                    $(this).css({
                        'border': '1px solid red'
                    });
                } else {
                    $(this).css({
                        'border': 'none'
                    });
                }
            })
            // End -- This will check for each empty input and mark red
            return;

        }
        //End -- Check fields if no values


        //Start - Check email Validation
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regex.test(email.val())) {
            alert('Invalid Email');
            return
        }
        //End -- Check email Validation


        //Start -- Check Password Validation
        if (password.val().length < 8) {
            alert("Your password must be at least 8 characters");
            return;
        }
        if (password.val().search(/[a-z]/i) < 0) {
            alert("Your password must contain at least one letter.");
            return;
        }
        if (password.val().search(/[0-9]/) < 0) {
            alert("Your password must contain at least one digit.");
            return;
        }

        //End -- Check Password Validation


        let Subject = [];
        for (var i = 0; i < $('#modal-table tbody tr').length; i++) {
            Subject.push($('#modal-table tbody tr:eq(' + i + ') td').html());
            //This will append all the subjects and create a certain format
        }

        var file = document.getElementById("file");
        file = file.files[0];
        var storageRef = firebase.storage().ref('Profile/Faculty/' + ID.val());
        storageRef.put(file).then((snapshot) => {
            storageRef.getDownloadURL()
                .then((url) => {
                    firebase.database().ref(`Data/Faculty/Information/${ID.val()}`).set({
                        "Address": address.val(),
                        "Contact": contact.val(),
                        "ID": ID.val(),

                        "Name": {
                            "First": firstName.val(),
                            "Middle": middleName.val(),
                            "Last": lastName.val()
                        },
                        Subject,
                        "Profile": url
                    });

                    var dEmail = email.val(),
                        dPassword = password.val(),
                        dId = ID.val();


                    if (email.val() != null && password.val() != null) {
                        firebase.auth().createUserWithEmailAndPassword(email.val(), password.val())
                            .then((userCredential) => {
                                var uid = userCredential.user.uid;

                                firebase.database().ref('User/' + uid).set({
                                    'Account_Type': e,
                                    'ID': uid,
                                    'Password': dPassword,
                                    'Role': selectedRole.includes('Select') ? 'Faculty' : selectedRole,
                                    'UserID': dId,
                                    'Email': dEmail
                                });
                            })
                            .catch((error) => {
                                console.log('Error ' + error)
                            });
                    }
                    alert('Faculty Save Successfully');
                    reset();
                    loadid('Faculty');
                })
                .catch((error) => {
                    console.log('Error ' + error)

                });
        });
    } else if (e == 'Gate') {

        event.stopPropagation();
        console.log(e);


        //Start -- Check fields if no values
        if (email.val() == '' || password.val() == '' ||
            ID.val() == '') {

            alert('Fill up necessary information!');
            // Start -- This will check for each empty input and mark red
            $('.inputArea >  input,.inputArea >  textarea,#UserSetup > input').each(function () {
                if ($(this).val() == '') {
                    $(this).css({
                        'border': '1px solid red'
                    });
                } else {
                    $(this).css({
                        'border': 'none'
                    });
                }
            })
            // End -- This will check for each empty input and mark red
            return;

        }
        //End -- Check fields if no values


        //Start - Check email Validation
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regex.test(email.val())) {
            alert('Invalid Email');
            return
        }
        //End -- Check email Validation


        //Start -- Check Password Validation
        if (password.val().length < 8) {
            alert("Your password must be at least 8 characters");
            return;
        }
        if (password.val().search(/[a-z]/i) < 0) {
            alert("Your password must contain at least one letter.");
            return;
        }
        if (password.val().search(/[0-9]/) < 0) {
            alert("Your password must contain at least one digit.");
            return;
        }

        //End -- Check Password Validation

        var file = document.getElementById("file");
        file = file.files[0];
        var storageRef = firebase.storage().ref('Profile/Gate/' + $('#ID').val());
        storageRef.put(file).then((snapshot) => {
            storageRef.getDownloadURL()
                .then((url) => {
                    firebase.database().ref(`Data/Gate/Information/${$('#ID').val()}`).set({
                        "ID": $('#ID').val()
                    });

                    var dEmail = email.val(),
                        dPassword = password.val(),
                        dId = ID.val();


                    if (email.val() != null && password.val() != null) {
                        firebase.auth().createUserWithEmailAndPassword(email.val(), password.val())
                            .then((userCredential) => {
                                var uid = userCredential.user.uid;

                                firebase.database().ref('User/' + uid).set({
                                    'Account_Type': e,
                                    'ID': uid,
                                    'Password': dPassword,
                                    'Role': e,
                                    'UserID': dId,
                                    'Email': dEmail
                                });
                            })
                            .catch((error) => {
                                console.log('Error ' + error)
                            });
                    }
                    alert('Gate Save Successfully');
                    reset();
                    loadid('Gate');
                })
                .catch((error) => {
                    console.log('Error ' + error)
                });
        });
    } else {

    }
});





$('#SearchPerson').on("select2:select", function (e) {
    // what you would like to happen
    // OnSelect on SearchPerson for Edit and Delete
    //Start -- Initializaion of Objects 

    let uid = $(this).val();

    let Path = '';
    if (uid.includes('STUD')) {
        $('#modal-table tbody, #SubjectSection-table tbody').html(' ')

        Path = "Data/Student/Information/" + uid;
        firebase.database().ref(Path).once('value', snap => {
            let name = [];
            snap.child('Name').forEach(names => {
                name.push(names.val());
            });
            //  alert(snap.child('ID').val());
            let profileLink = snap.child('Profile').val();
            if (profileLink != null) {
                profilePicture.attr('src', snap.child('Profile').val());
            }
            ID.val(snap.child('ID').val());
            lastName.val(name[1]);
            firstName.val(name[0]);
            middleName.val(name[2]);
            contact.val(snap.child('Contact').val());
            studentEmail.val(snap.child('Email').val());
            address.val(snap.child('Address').val());

            console.log(snap.child("Subject").val());
            snap.child("Subject").forEach(subject => {

                firebase.database().ref("Data/Subject/" + subject.val()).once('value', subSnap => {

                    console.log(subSnap.val());





                    let schedule = []
                    subSnap.child('Schedule').forEach(schedules => {
                        schedule.push(schedules.val());
                    });

                    $('#modal-table tbody, #SubjectSection-table tbody').append(`
                    <tr>
                    <td>${subSnap.child('ClassNbr').val()}</td>
                    <td>${subSnap.child('Title').val()}</td>
                    <td>${subSnap.child('Description').val()}</td>
                    <td>${schedule[0]}</td>
                    <td>${schedule[1]}</td>
                    <td>${subSnap.child('Professor').val()}</td>
                    <td><i class="material-icons delete-row">delete_forever</i></td>
                 </tr>
                 `);


                })
            });

        });

    } else if (uid.includes('FAC') || uid.includes('PROF')) {
        $('#modal-table tbody, #SubjectSection-table tbody').html(' ')

        Path = "Data/Faculty/Information/" + uid;
        firebase.database().ref(Path).once('value', snap => {
            firebase.database().ref("User").orderByChild('UserID').equalTo(snap.child("ID").val()).once('value', user => {

                if (user.exists()) {
                    user.forEach((child) => {
                        $('#Role').val(child.child('Role').val());
                        console.log(child.child('Account_Type').val());
                    })
                }
            });

            let profileLink = snap.child('Profile').val();
            if (profileLink != null) {
                profilePicture.attr('src', snap.child('Profile').val());
            }

            let name = [];
            snap.child('Name').forEach(names => {
                name.push(names.val());
            });

            ID.val(snap.child('ID').val());
            lastName.val(name[1]);
            firstName.val(name[0]);
            middleName.val(name[2]);
            contact.val(snap.child('Contact').val());
            studentEmail.val(snap.child('Email').val());
            address.val(snap.child('Address').val());

            console.log(snap.child("Subject").val());
            snap.child("Subject").forEach(subject => {

                firebase.database().ref("Data/Subject/" + subject.val()).once('value', subSnap => {




                    let schedule = []
                    subSnap.child('Schedule').forEach(schedules => {
                        schedule.push(schedules.val());
                    });

                    $('#modal-table tbody, #SubjectSection-table tbody').append(`
                    <tr>
                    <td>${subSnap.child('ClassNbr').val()}</td>
                    <td>${subSnap.child('Title').val()}</td>
                    <td>${subSnap.child('Description').val()}</td>
                    <td>${schedule[0]}</td>
                    <td>${schedule[1]}</td>
                    <td>${subSnap.child('Professor').val()}</td>
                    <td><i class="material-icons delete-row">delete_forever</i></td>
                 </tr>
                 `);


                })
            });

        });
    } else {
        Path = "Data/Gate/Information";
    }

    var url = new URL(window.location.href);
    let usermanagementType = url.searchParams.get('type');

    if (usermanagementType.includes('update')) {
        $('.inputArea > input,textarea, #UserSetup input, #setSubject, #Role, #setSubject').prop('disabled', false)
    }
    // ;



});


function LoadSearch(UserType) {
    searchperson.html(' ');
    searchperson.append(`<option disabled selected> Select ${UserType} </option>`);

    firebase.database().ref('Data/' + UserType + '/Information/').on('value', snap => {

        snap.forEach(childSnap => {

            var name = [];
            childSnap.child('Name').forEach(names => {
                name.push(names.val());
            })
            searchperson.append(`<option value='${childSnap.child('ID').val()}'> ${`<span style="color:#cccccc">(${childSnap.child('ID').val()}) </span>`+name[1] +','+ name[0] +' ' +name[2]} </option>`);
        });
    });
}