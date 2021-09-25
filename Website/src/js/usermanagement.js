$(document).ready(function () {

    $('#output').click(function () {
        $('#selectPicture').trigger('click');
    });

    VerifyType();

    firebase.database().ref('Data/Subject').on('value', snap => {
        snap.forEach(childSnap => {
            console.log(childSnap.val());
            //  var courseCode = JSON.parse(childSnap.val());
            $("#Select_Section").append(new Option(childSnap.child('Code').val(), childSnap.child('Code').val(), false, false)).trigger('change');

        });
    });

    $('.ModalAdd').click(function () {
        var data = $('#Select_Section').find(':selected').val();
        console.log($(`#modal-table tbody tr > td:contains(${data})`).length);
        if ((data != null || data != '') &&
            $(`#modal-table tbody tr > td:contains(${data})`).length == 0) {
            firebase.database().ref('Data/Subject/' + data).on('value', snap => {
                $('#modal-table tbody').append(`
          <tr>
          <td>${snap.child('Code').val()}</td>
          <td>${snap.child('Description').val()}</td>
          <td>${snap.child('Schedule').val().split('&&')[0]}</td>
          <td>${snap.child('Schedule').val().split('&&')[1]}</td>
          <td><i class="material-icons">delete_forever</i></td>
       </tr>
       `);
            });
        }
    });

    $('.ModalSubmit').click(function () {
        $('.modal:eq(0)').css('display', 'none');

        $('#SubjectSection-table tbody').html($('#modal-table tbody').html());
    });

    $('.ModalCancel').click(function () {
        $('.modal:eq(0)').css('display', 'none');
    });

});




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
    const image = document.getElementById('output');
    image.src = URL.createObjectURL(event.target.files[0]);

};

async function DownloadUrl(PATH) {
    var storageRef = firebase.storage().ref(PATH);
    var downloadUrl = await storageRef.getDownloadURL().then();

    console.log(downloadUrl);
    return downloadUrl;
}


function VerifyType() {
    const selected = document.getElementById("UserType");
    const e = selected.options[selected.selectedIndex].text;
    console.log(e);

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

   

    var reset = function () {
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

    }
    var loadid = function (USER) {
        firebase.database().ref('Data/' + USER + '/Information').once('value', snap => {
            var count = (snap.numChildren() + 1).toString();
            console.log(count);

            ID.val((USER).toUpperCase().substring(0, 4) + '1' + ('000000' + count).substring(count.length))
        });
    }



    if (e == "Student") {
        userSetup.css({'display': 'none'});
        permission.css({'display': 'none'});
        mainButton.css({'display': 'block'});
        mainTable.css({'display': 'block'});
        // document.getElementById("UserSetup").style.display = "none";
        // document.getElementById("cbx").style.display = "none";
        // document.getElementById('mainBTN').style.display = "block";
        // document.getElementById('Maintable').style.display = "block";


        studentEmail.css({'display': 'block'});
        lastName.css({'display': 'block'});
        firstName.css({'display': 'block'});
        middleName.css({'display': 'block'});
        ID.css({'display': 'block'});
        ID.attr('placeholder', 'Enter Student ID');

        contact.css({'display': 'block'});
        address.css({'display': 'block'});
        subject.css({'display': 'block'});

        // document.getElementById("Email").style.display = "block";
        // document.getElementById('LName').style.display = "block";
        // document.getElementById('FName').style.display = "block";
        // document.getElementById('MName').style.display = "block";
        // document.getElementById('ID').style.display = "block";
        // $('#ID').attr('placeholder', 'Enter Student ID');
        // document.getElementById('ContactNumber').style.display = "block";
        // document.getElementById('Address').style.display = "block";
        // document.getElementById('setSubject').style.display = "block";

        // console.log(e.includes('Student'));

        loadid('Student');

        $('#btnsave').click(function (event) {
            event.stopPropagation();
            console.log(e);
            if (studentEmail.val() != '' && lastName.val() != '' &&
            firstName.val() != '' && middleName.val() != '' &&
            ID.val() != '' && contact.val() != '' &&
                address.val() != '') {

                var subject = '';
                for (var i = 0; i < $('#modal-table tbody tr').length; i++) {
                    subject += $('#modal-table tbody tr:eq(' + i + ') td').html() + "&&";
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
                                "Name": lastName.val() + '&&' + firstName.val() + '&&' + middleName.val(),
                                "Subject": subject.substring(0, subject.length - 2),
                                "Profile": url
                            });
                            alert('Student Save Successfully');
                            reset();
                            loadid('Student');
                        })
                        .catch((error) => {

                            alert(error);
                        });
                });



            } else {
                alert('Fill up necessary information');
            }

        });




    } else if (e == "Faculty") {
        userSetup.css({'display': 'block'});
        permission.css({'display': 'block'});
        mainButton.css({'display': 'block'});
        mainTable.css({'display': 'block'});

        studentEmail.css({'display': 'none'});
        lastName.css({'display': 'block'});
        firstName.css({'display': 'block'});
        middleName.css({'display': 'block'});
        ID.css({'display': 'block'});
        ID.attr('placeholder', 'Enter Faculty ID');

        contact.css({'display': 'block'});
        address.css({'display': 'block'});
        subject.css({'display': 'block'});

        loadid('Professor');

        $('#btnsave').click(function (event) {
            event.stopPropagation();
            console.log(e);

            var subject = '';
            for (var i = 0; i < $('#modal-table tbody tr').length; i++) {
                subject += $('#modal-table tbody tr:eq(' + i + ') td').html() + "&&";
            }

            var file = document.getElementById("file");
            file = file.files[0];
            var storageRef = firebase.storage().ref('Profile/Professor/' + ID.val());
            storageRef.put(file).then((snapshot) => {
                storageRef.getDownloadURL()
                    .then((url) => {
                        firebase.database().ref(`Data/Professor/Information/${ID.val()}`).set({
                            "Address": address.val(),
                            "Contact": contact.val(),
                            "ID": ID.val(),
                            "Name": lastName.val() + '&&' + firstName.val() + '&&' + middleName.val(),
                            "Subject": subject.substring(0, subject.length - 2),
                            "Profile": url
                        });
                      

                        if (email.val() != null && password.val() != null) {
                            firebase.auth().createUserWithEmailAndPassword(email.val(), password.val())
                                .then((userCredential) => {
                                    var uid = userCredential.user.uid;

                                    firebase.database().ref('User/' + uid).set({
                                        'Account_Type': e,
                                        'ID': uid,
                                        'Password': password.val(),
                                        'Role': e,
                                        'UserID': ID.val(),
                                        'Email': email.val()
                                    });
                                })
                                .catch((error) => {
                                    console.log('Error ' + error)
                                });
                        }
                        alert('Professor Save Successfully');
                        reset();
                        loadid('Professor');
                    })
                    .catch((error) => {});
            });
        });




    } else if (e == "Gate") {

        userSetup.css({'display': 'block'});
        permission.css({'display': 'none'});
        mainButton.css({'display': 'block'});
        mainTable.css({'display': 'none'});

        studentEmail.css({'display': 'none'});
        lastName.css({'display': 'none'});
        firstName.css({'display': 'none'});
        middleName.css({'display': 'none'});
        ID.css({'display': 'block'});
        ID.attr('placeholder', 'Enter Gate ID');

        contact.css({'display': 'none'});
        address.css({'display': 'none'});
        subject.css({'display': 'none'});

        loadid('Gate');


        $('#btnsave').click(function (event) {
            event.stopPropagation();
            console.log(e);

            var file = document.getElementById("file");
            file = file.files[0];
            var storageRef = firebase.storage().ref('Profile/Gate/' + $('#ID').val());
            storageRef.put(file).then((snapshot) => {
                storageRef.getDownloadURL()
                    .then((url) => {
                        firebase.database().ref(`Data/Gate/Information/${$('#ID').val()}`).set({
                            "ID": $('#ID').val()
                        });

                        var email = $('#UserEmail').val();
                        var password = $('#password').val();

                        if (email != null && password != null) {
                            firebase.auth().createUserWithEmailAndPassword(email, password)
                                .then((userCredential) => {
                                    var uid = userCredential.user.uid;

                                    firebase.database().ref('User/' + uid).set({
                                        'Account_Type': e,
                                        'ID': uid,
                                        'Password': password,
                                        'Role': e,
                                        'UserID': $('#ID').val(),
                                        'Email': email
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
                    .catch((error) => {});
            });
        });

    } else {
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
    }
}