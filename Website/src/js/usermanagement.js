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

var cardID = $('#Card_ID');

var subjectselection = $('#Select_Section');

var tableModal = $('#modal-table');
var tableSubject = $('#SubjectSection-table');

var gatestatus = $('#Status')
var gatelocation = $('#Location')

var userType = $(`#UserType`)
//End -- Initializaion of Objects

//Start -- Onload Function

var url = new URL(window.location.href);
let usermanagementType = url.searchParams.get('type');

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

    console.log(usermanagementType);

    if (usermanagementType.includes('add')) {
        // alert("Add");

    } else if (usermanagementType.includes('update')) {
        //alert("Update");

    } else {
        //alert("Delete");

    }


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




    subjectselection.select2({});


    tableModal.DataTable({
        'createdRow': function (row, data, dataIndex) {
            $(row).attr('data-id', dataIndex);
        },
        "aaSorting": [],
        'searching': false,
        paging: false,
        order: [
            [0, 'asc']
        ],

        "bDestroy": true
    });
    tableSubject.DataTable({
        'createdRow': function (row, data, dataIndex) {
            $(row).attr('data-id', dataIndex);
        },
        "aaSorting": [],
        order: [
            [0, 'asc']
        ],
        "bDestroy": true
    });

});

// End -- Onload Function


// Start - Modal table Function
subjectselection.on('select2:select', function (e) {
    var data = $('#Select_Section').find(':selected').val();
    console.log($(`#modal-table tbody tr > td:contains(${data})`).length);
    if ((data != null || data != '') &&
        $(`#modal-table tbody tr > td:contains(${data})`).length == 0) {
        firebase.database().ref('Data/Subject/' + data).on('value', snap => {

            if (snap.val() != null) {
                // console.log(snap.child('Schedule').val());
                let schedule = []
                snap.child('Schedule').forEach(schedules => {
                    schedule.push(schedules.val());
                });
                //             $('#modal-table tbody').append(`
                //       <tr>
                //       <td>${snap.child('ClassNbr').val()}</td>
                //       <td>${snap.child('Title').val()}</td>
                //       <td>${snap.child('Description').val()}</td>
                //       <td>${schedule[0]}</td>
                //       <td>${schedule[1]}</td>
                //       <td>${snap.child('Professor').val()}</td>
                //       <td><i class="material-icons delete-row">delete_forever</i></td>
                //    </tr>
                //    `);
                tableModal.DataTable().row.add(
                    [
                        snap.child('ClassNbr').val(),
                        snap.child('Title').val(),
                        snap.child('Description').val(),
                        schedule[0],
                        schedule[1],
                        snap.child('Professor').val(),
                        `<button onclick="DeleteRow(this)"><i class="material-icons delete-row">delete_forever</i></button>`
                    ]).draw();
                tableSubject.DataTable().row.add(
                    [
                        snap.child('ClassNbr').val(),
                        snap.child('Title').val(),
                        snap.child('Description').val(),
                        schedule[0],
                        schedule[1],
                        snap.child('Professor').val(),
                        `<button onclick="DeleteRow(this)"><i class="material-icons delete-row">delete_forever</i></button>`
                    ]).draw();
            }

        });
    }


});

$('.ModalAdd').click(function () {
    // This function add row on modal table

});

$('.ModalSubmit').click(function () {
    // This fuction hide the modal table
    $('.modal:eq(0)').css('display', 'none');

    //  $('#SubjectSection-table tbody').html($('#modal-table tbody').html());
});

$('.ModalCancel').click(function () {
    // This fuction hide the modal table
    $('.modal:eq(0)').css('display', 'none');
});
//End -- Modal table Function

var tobedeleted = []

function DeleteRow(e) {

    let index = $(e).closest('tr').attr('data-id');
    //  alert(index)
    let subjectRow = $(`#SubjectSection-table tbody tr[data-id="${index}"]`)
    let modalRow = $(`#modal-table tbody tr[data-id="${index}"]`)
    // alert(index)
    // tableModal.DataTable().row(index).remove().draw();
    // tableSubject.DataTable().row(index).remove().draw();

    // tableModal.DataTable().fnDeleteRow(index)
    tableSubject.DataTable().row(subjectRow).remove().draw()
    tableModal.DataTable().row(modalRow).remove().draw()

}

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
    //  alert(event.target.files[0]);

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

    cardID.val('');

    gatelocation.val('')
    gatestatus.val('default')

    $('#output').attr('src', 'src/assets/avatar.png');
    $('#file').val('');

    tableModal.DataTable().clear().draw();
    tableSubject.DataTable().clear().draw();
    $("#Select_Section").val('');

    $("input[type=checkbox]").prop("checked", false);

    $('.inputArea >  input, .inputArea > textarea,.UserSetup > input').each(function () {

        $(this).css({
            //   'border': 'none'
        });

    });

    searchperson.val("default").trigger('change');


}


var loadid = function (user) {
    //This function will read the count from the path then return the value + 1 to get the ID
    firebase.database().ref('Data/' + user + '/Information').once('value', snap => {
        var count = (snap.numChildren() + 1).toString();
        console.log(count);

        ID.val((user).toUpperCase().substring(0, 4) + '1' + ('000000' + count).substring(count.length))
    });

    // firebase.database().ref('Data/' + user + '/Information/').limitToLast(1).on('value', snap => {
    //     if (snap.val() != null) {
    //         snap.forEach(counter => {
    //             console.log(snap.val())
    //             var count = counter.child(`ID`).val();

    //             var sCount = count.toString().slice(4, count.length).replaceAll('0', '');
    //             console.log(sCount)
    //             if(user.includes('Student'))
    //             {
    //                 ID.val('STUD' + '1' + ('000000' + (parseInt(sCount) + 1)).substring(sCount.length))
    //             }
    //             else if(user.includes('Faculty'))
    //             {
    //                 ID.val('FACU' + '1' + ('000000' + (parseInt(sCount) + 1)).substring(sCount.length))
    //             }
    //             else if(user.includes('Gate'))
    //             {
    //                 ID.val('GATE' + '1' + ('000000' + (parseInt(sCount) + 1)).substring(sCount.length))
    //             }


    //         })

    //     }
    //     else{
    //         if(user.includes('Student'))
    //         {
    //             ID.val(`STUD1000001`)
    //         }
    //         else if(user.includes('Faculty') || user.includes('Professor'))
    //         {
    //             ID.val(`FAC1000001`)
    //         }
    //         else if(user.includes('Gate'))
    //         {
    //             ID.val(`GATE1000001`)
    //         }

    //     }

    // });
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
            'display': 'none'
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

        cardID.css({
            'display': 'block'
        });

        contact.css({
            'display': 'block'
        });
        address.css({
            'display': 'block'
        });
        subject.css({
            'display': 'none'
        });
        role.css({
            'display': 'none'
        });

        gatestatus.css({
            'display': 'none'
        });

        gatelocation.css({
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
        permission.css({
            'display': 'block'
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

        cardID.css({
            'display': 'block'
        });

        address.css({
            'display': 'block'
        });
        subject.css({
            'display': 'none'
        });

        role.css({
            'display': 'block'
        });

        gatestatus.css({
            'display': 'none'
        });

        gatelocation.css({
            'display': 'none'
        });



        //  alert('Student Selected');
        if (usermanagementType.includes('add')) {
            // alert("Add");
            loadid('Faculty');

            userSetup.css({
                'display': 'block'
            });
        } else if (usermanagementType.includes('update')) {
            //alert("Update");
            $(".containerSearchPerson").css({
                'display': 'block'
            });

            $('.inputArea > input,textarea, #UserSetup input, #setSubject').prop('disabled', true).css({
                'background-color': 'white'
            });
            userSetup.css({
                'display': 'none'
            });
            $('#btnsave').html('Update');
        } else {
            //alert("Delete");
            $(".containerSearchPerson").css({
                'display': 'block'
            });

            userSetup.css({
                'display': 'none'
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
            'display': 'none'
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

        cardID.css({
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
        gatestatus.css({
            'display': 'block'
        });

        gatelocation.css({
            'display': 'block'
        });


        //  alert('Student Selected');
        if (usermanagementType.includes('add')) {
            // alert("Add");
            loadid('Gate');


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


        cardID.css({
            'display': 'none'
        });

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

        gatestatus.css({
            'display': 'none'
        });

        gatelocation.css({
            'display': 'none'
        });


    }
}


$('#btnsave').click(function (event) {
    const selected = document.getElementById("UserType");
    const e = selected.options[selected.selectedIndex].text;

    const Role = document.getElementById("Role");
    const selectedRole = Role.options[Role.selectedIndex].text;

    if ($(`#btnsave`).html().includes(`Delete`)) {

        //If the button confirm delete , Activate this
        if (confirm(`Are you sure you want to delete this?`)) {
            DeleteUser(ID.val())
            alert('Data deleted sucessfully')
        } else {

        }

    } else {
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
                $('.inputArea >  input:not(#Card_ID), .inputArea >  textarea').each(function () {
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

            // if(userType.val() == 'Student' && !ID.val().includes('STUD'))
            // {
            //     alert(`ID invalid!`)
            // }

            //Start Card ID check 
            
            firebase.database().ref(`Data/Student/Information/`).orderByChild(`Card_ID`).startAt(cardID.val()).endAt(cardID.val()).once(`value`, sCard => {
                if (sCard.val() != null) {
                    alert('Card ID already exists! Please select new card!')
                    //This will check if Card ID Exist on Student
                } else {

                    firebase.database().ref(`Data/Faculty/Information/`).orderByChild(`Card_ID`).startAt(cardID.val()).endAt(cardID.val()).once(`value`, fCard => {
                        if (fCard.val() != null) {
                            alert('Card ID already exists! Please select new card!')
                            //This will check if Card ID Exist on Faculty
                        } else {

                            firebase.database().ref(`Data/Faculty/Information`).orderByChild(`ID`).startAt(ID.val()).endAt(ID.val()).once(`value`, fID => {

                                if (fID.val() != null && id) {
                                    alert(`ID already exists! Please check and change the ID`)
                                } else {
                                    firebase.database().ref(`Data/Student/Information`).orderByChild(`ID`).startAt(ID.val()).endAt(ID.val()).once(`value`, sID => {
                                        if (sID.val() != null) {
                                            alert(`ID already exists! Please check and change the ID`)
                                        } else {

                                            let Subject = [];
                                            // for (var i = 0; i < $('#modal-table tbody tr').length; i++) {
                                            //     Subject.push($('#modal-table tbody tr:eq(' + i + ') td').html());
                                            //     //This will append all the subjects and create a certain format
                                            // }

                                            var file = document.getElementById("file");
                                            file = file.files[0];
                                            // if (file != null) {
                                            // Start - If image has no value or null, Insert Image
                                            var storageRef = firebase.storage().ref('Profile/Student/' + ID.val());
                                            storageRef.put(file).then((snapshot) => {
                                                storageRef.getDownloadURL()
                                                    .then((url) => {
                                                        // Insert url into an <img> tag to "download"
                                                        firebase.database().ref(`Data/Student/Information/${ID.val()}`).update({
                                                            "Address": address.val(),
                                                            "Contact": contact.val(),
                                                            "Card_ID": cardID.val(),
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
                                        }
                                    })
                                }
                            })
                            //End Card ID check
                        }
                    })

                }
            })

            // End - If image has no value or null, Insert Image
            // } else {
            //     // Start - If image has no value ,Decline insert Image
            //     firebase.database().ref(`Data/Student/Information/${ID.val()}`).update({
            //         "Address": address.val(),
            //         "Contact": contact.val(),
            //         "Card_ID": cardID.val(),
            //         "ID": ID.val(),
            //         "Email": studentEmail.val(),
            //         "Name": {
            //             "First": firstName.val(),
            //             "Middle": middleName.val(),
            //             "Last": lastName.val()
            //         },
            //         Subject
            //     });
            //     alert('Student Save Successfully');
            //     reset();
            //     loadid('Student');
            //     // End - If image has no value ,Decline insert Image
            // }





        } else if (e == 'Faculty') {
            event.stopPropagation();
            console.log(e);

            //Start -- Check fields if no values
            if (
                lastName.val() == '' ||
                firstName.val() == '' || middleName.val() == '' ||
                ID.val() == '' || contact.val() == '' ||
                address.val() == '') {

                alert('Fill up necessary information!');
                // Start -- This will check for each empty input and mark red
                $('.inputArea >  input:not(#Card_ID),.inputArea >  textarea,#UserSetup > input').each(function () {
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

            if (email.val() != '' && password.val() != '') {
                //End -- Check fields if no values
                // alert(email.val());
                // alert(password.val());

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
            }


            //Start Card ID check 

            firebase.database().ref(`Data/Student/Information/`).orderByChild(`Card_ID`).startAt(cardID.val()).endAt(cardID.val()).once(`value`, sCard => {
                if (sCard.val() != null) {
                    alert('Card ID already exists! Please select new card!')
                } else {

                    firebase.database().ref(`Data/Faculty/Information/`).orderByChild(`Card_ID`).startAt(cardID.val()).endAt(cardID.val()).once(`value`, fCard => {
                        if (fCard.val() != null) {
                            alert('Card ID already exists! Please select new card!')
                        } else {

                            firebase.database().ref(`Data/Faculty/Information`).orderByChild(`ID`).startAt(ID.val()).endAt(ID.val()).once(`value`, fID => {

                                if (fID.val() != null && usermanagementType.includes('add')) {
                                    alert(`ID already exists! Please check and change the ID`)
                                } else {
                                    firebase.database().ref(`Data/Student/Information`).orderByChild(`ID`).startAt(ID.val()).endAt(ID.val()).once(`value`, sID => {
                                        if (sID.val() != null && usermanagementType.includes('add')) {
                                            alert(`ID already exists! Please check and change the ID`)
                                        } else {
                                            let Subject = [];
                                            // for (var i = 0; i < $('#modal-table tbody tr').length; i++) {
                                            //     Subject.push($('#modal-table tbody tr:eq(' + i + ') td').html());
                                            //     //This will append all the subjects and create a certain format
                                            // }

                                            var file = document.getElementById("file");
                                            file = file.files[0];

                                            // if (file != null) {
                                            // Start - If image has  value, Insert Image
                                            var storageRef = firebase.storage().ref('Profile/Faculty/' + ID.val());
                                            storageRef.put(file).then((snapshot) => {
                                                storageRef.getDownloadURL()
                                                    .then((url) => {
                                                        firebase.database().ref(`Data/Faculty/Information/${ID.val()}`).update({
                                                            "Address": address.val(),
                                                            "Contact": contact.val(),
                                                            "ID": ID.val(),
                                                            "Card_ID": cardID.val(),
                                                            "Name": {
                                                                "First": firstName.val(),
                                                                "Middle": middleName.val(),
                                                                "Last": lastName.val()
                                                            },
                                                            Subject,
                                                            "Profile": url,
                                                            "Permission": {
                                                                "TapIn_First": $('.cbx').is(":checked")
                                                            }
                                                        });

                                                        var dEmail = email.val(),
                                                            dPassword = password.val(),
                                                            dId = ID.val();


                                                        if (email.val() != '' && password.val() != '') {
                                                            // This will add new Faculty
                                                            let tapIn = $('.cbx').is(":checked")
                                                            alert('Saving Account')
                                                            firebase.auth().createUserWithEmailAndPassword(email.val(), password.val())
                                                                .then((userCredential) => {
                                                                    var uid = userCredential.user.uid;

                                                                    firebase.database().ref('User/' + uid).update({
                                                                        'Account_Type': selectedRole.includes('Select') ? 'Faculty' : selectedRole,
                                                                        'ID': uid,
                                                                        'Password': dPassword,
                                                                        'Role': selectedRole.includes('Select') ? 'Faculty' : selectedRole,
                                                                        'UserID': dId,
                                                                        'Email': dEmail,
                                                                        "Permission": {
                                                                            "TapIn_First": tapIn
                                                                        }
                                                                    });
                                                                })
                                                                .catch((error) => {
                                                                    console.log('Error ' + error)
                                                                    alert(error)
                                                                });
                                                        } else {
                                                            // User Already Exist and needed to be updated
                                                            let tapIn = $('.cbx').is(":checked")
                                                            firebase.database().ref('User/').orderByChild('UserID').startAt(dId).endAt(dId).once('value', users => {
                                                                users.forEach(user => {
                                                                    let uid = user.child('ID').val();
                                                                    // alert(tapIn)
                                                                    firebase.database().ref(`User/${uid}`).update({
                                                                        'Account_Type': selectedRole.includes('Select') ? 'Faculty' : selectedRole,
                                                                        'Role': selectedRole.includes('Select') ? 'Faculty' : selectedRole,
                                                                        "Permission": {
                                                                            "TapIn_First": tapIn
                                                                        }
                                                                    });
                                                                })
                                                            })
                                                        }
                                                        alert('Faculty Save Successfully');
                                                        reset();
                                                        loadid('Faculty');
                                                    })
                                                    .catch((error) => {
                                                        console.log('Error ' + error)

                                                    });
                                            });
                                        }

                                    })
                                }

                            })

                        }
                    })
                }
            })


            // End - If image has  value, Insert Image
            // } else {

            //     // Start - If image has no value or , Declined insert Image
            //     firebase.database().ref(`Data/Faculty/Information/${ID.val()}`).update({
            //         "Address": address.val(),
            //         "Contact": contact.val(),
            //         "ID": ID.val(),
            //         "Card_ID": cardID.val(),
            //         "Name": {
            //             "First": firstName.val(),
            //             "Middle": middleName.val(),
            //             "Last": lastName.val()
            //         },
            //         Subject,
            //         "Permission": {
            //             "TapIn_First": $('.cbx').is(":checked")
            //         }
            //     });

            //     var dEmail = email.val(),
            //         dPassword = password.val(),
            //         dId = ID.val();


            //     if (email.val() != null && password.val() != null) {
            //         firebase.auth().createUserWithEmailAndPassword(email.val(), password.val())
            //             .then((userCredential) => {
            //                 var uid = userCredential.user.uid;

            //                 firebase.database().ref('User/' + uid).update({
            //                     'Account_Type': e,
            //                     'ID': uid,
            //                     'Password': dPassword,
            //                     'Role': selectedRole.includes('Select') ? 'Faculty' : selectedRole,
            //                     'UserID': dId,
            //                     'Email': dEmail,
            //                     "Permission": {
            //                         "TapIn_First": $('.cbx').is(":checked")
            //                     }
            //                 });
            //             })
            //             .catch((error) => {
            //                 console.log('Error ' + error)
            //             });
            //     }
            //     alert('Faculty Save Successfully');
            //     reset();
            //     loadid('Faculty');

            //     // End - If image has no value or , Declined insert Image
            // }

        } else if (e == 'Gate') {

            event.stopPropagation();
            console.log(e);





            //Start -- Check fields if no values
            if (
                ID.val() == '' || gatelocation.val() == '') {

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
            if (email.val() != '' && password.val() != '') {

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
            }
            //End -- Check Password Validation

            var file = document.getElementById("file");
            file = file.files[0];

            // if (file != null) { // Start - If image has  value  ,  Insert Image
            var storageRef = firebase.storage().ref('Profile/Gate/' + $('#ID').val());
            storageRef.put(file).then((snapshot) => {
                storageRef.getDownloadURL()
                    .then((url) => {



                        var dEmail = email.val(),
                            dPassword = password.val(),
                            dId = ID.val(),
                            dStatus = gatestatus.val(),
                            dLocation = gatelocation.val();




                        firebase.database().ref(`Data/Gate/Information/${$('#ID').val()}`).update({
                            "ID": $('#ID').val(),
                            'Status': dStatus,
                            'Location': dLocation,
                        });

                        if (email.val() != '' && password.val() != '') {
                            firebase.auth().createUserWithEmailAndPassword(email.val(), password.val())
                                .then((userCredential) => {
                                    var uid = userCredential.user.uid;
                                    //   alert(uid)
                                    firebase.database().ref('User/' + uid).update({
                                        'Account_Type': e,
                                        'ID': uid,
                                        'Password': dPassword,
                                        'Role': e,
                                        'Status': dStatus,
                                        'Location': dLocation,
                                        'UserID': dId,
                                        'Email': dEmail
                                    });
                                })
                                .catch((error) => {
                                    console.log('Error ' + error)
                                });
                        } else {
                            firebase.database().ref('User/').orderByChild('UserID').startAt(dId).endAt(dId).once('value', users => {
                                users.forEach(user => {
                                    let uid = user.child('ID').val();
                                    //      alert(uid)
                                    // alert(tapIn)

                                    firebase.database().ref('User/' + uid).update({
                                        'Account_Type': e,
                                        'Role': e,
                                        'Status': dStatus,
                                        'Location': dLocation
                                    });
                                })
                            })
                        }
                        alert('Gate Save Successfully');
                        reset();
                        loadid('Gate');
                    })
                    .catch((error) => {
                        console.log('Error ' + error)
                    });
            });


            // End - If image has  value  ,  Insert Image
            // } else {
            //     // Start - If image has no  value  , Declined insert Image
            //     firebase.database().ref(`Data/Gate/Information/${$('#ID').val()}`).update({
            //         "ID": $('#ID').val()
            //     });

            //     var dEmail = email.val(),
            //         dPassword = password.val(),
            //         dId = ID.val();


            //     if (email.val() != null && password.val() != null) {
            //         firebase.auth().createUserWithEmailAndPassword(email.val(), password.val())
            //             .then((userCredential) => {
            //                 var uid = userCredential.user.uid;

            //                 firebase.database().ref('User/' + uid).update({
            //                     'Account_Type': e,
            //                     'ID': uid,
            //                     'Password': dPassword,
            //                     'Role': e,
            //                     'UserID': dId,
            //                     'Email': dEmail
            //                 });
            //             })
            //             .catch((error) => {
            //                 console.log('Error ' + error)
            //             });
            //     }

            // alert('Gate Save Successfully');
            // reset();
            // loadid('Gate');
            //     // End - If image has no  value  , Declined insert Image
            // }

        } else {

        }

    }



});





$('#SearchPerson').on("select2:select", function (e) {
    // what you would like to happen
    // OnSelect on SearchPerson for Edit and Delete
    //Start -- Initializaion of Objects 

    tableSubject.DataTable().row().clear().draw()
    tableModal.DataTable().row().clear().draw()
    let uid = $(this).val();

    let Path = '';
    if (uid.includes('STUD')) {

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

                $('#file').attr('value', snap.child('Profile').val());
            }
            ID.val(snap.child('ID').val());
            cardID.val(snap.child('Card_ID').val());
            lastName.val(name[1]);
            firstName.val(name[0]);
            middleName.val(name[2]);
            contact.val(snap.child('Contact').val());
            studentEmail.val(snap.child('Email').val());
            address.val(snap.child('Address').val());


            console.log(snap.child("Subject").val());
            snap.child("Subject").forEach(subject => {

                if (subject.val() != null) {
                    firebase.database().ref("Data/Subject/" + subject.val()).once('value', subSnap => {
                        console.log("Subjects");

                        if (subSnap.val() != null) {

                            let profID = subSnap.child('Professor').val();
                            firebase.database().ref(`Data/Faculty/Information/${profID}/`).once('value', professor => {
                                let last = professor.child('Name').child('Last').val()
                                let first = professor.child('Name').child('First').val()
                                let middle = professor.child('Name').child('Middle').val()


                                let schedule = []
                                subSnap.child('Schedule').forEach(schedules => {
                                    schedule.push(schedules.val());
                                });

                                tableModal.DataTable().row.add(
                                    [
                                        subSnap.child('ClassNbr').val(),
                                        subSnap.child('Title').val(),
                                        subSnap.child('Description').val(),
                                        schedule[0],
                                        schedule[1],
                                        `${last}, ${first} ${middle}`,
                                        `<button onclick="DeleteRow(this)"><i class="material-icons delete-row">delete_forever</i></button>`
                                    ]).draw();
                                tableSubject.DataTable().row.add(
                                    [
                                        subSnap.child('ClassNbr').val(),
                                        subSnap.child('Title').val(),
                                        subSnap.child('Description').val(),
                                        schedule[0],
                                        schedule[1],
                                        `${last}, ${first} ${middle}`,
                                        `<button onclick="DeleteRow(this)"><i class="material-icons delete-row">delete_forever</i></button>`
                                    ]).draw();
                            })
                        }






                        //     $('#modal-table tbody, #SubjectSection-table tbody').append(`
                        //     <tr>
                        //     <td>${subSnap.child('ClassNbr').val()}</td>
                        //     <td>${subSnap.child('Title').val()}</td>
                        //     <td>${subSnap.child('Description').val()}</td>
                        //     <td>${schedule[0]}</td>
                        //     <td>${schedule[1]}</td>
                        //     <td>${subSnap.child('Professor').val()}</td>
                        //     <td><i class="material-icons delete-row">delete_forever</i></td>
                        //  </tr>
                        //  `);

                    })
                }

            });

        });

    } else if (uid.includes('FAC') || uid.includes('PROF')) {
        tableModal.DataTable().clear().draw();
        tableSubject.DataTable().clear().draw();
        Path = "Data/Faculty/Information/" + uid;
        firebase.database().ref(Path).once('value', snap => {
            firebase.database().ref("User").orderByChild('UserID').equalTo(snap.child("ID").val()).once('value', user => {

                if (user.exists()) {
                    user.forEach((child) => {
                        $('#Role').val(child.child('Account_Type').val()).change();
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

            let profID = snap.child('ID').val();
            ID.val(profID);
            cardID.val(snap.child('Card_ID').val());
            lastName.val(name[1]);
            firstName.val(name[0]);
            middleName.val(name[2]);
            contact.val(snap.child('Contact').val());
            studentEmail.val(snap.child('Email').val());
            address.val(snap.child('Address').val());

            $(".cbx").prop("checked", snap.child('Permission').child('TapIn_First').val());
            //           console.log(snap.child("Subject").val());

            firebase.database().ref(`Data/Subject/`).orderByChild('Professor').startAt(profID).endAt(profID).once(`value`, subjects => {
                if (subjects.val() != null) {
                    console.log(subjects.val())

                    subjects.forEach(subject => {
                        let classNbr = subject.child('ClassNbr').val()
                        let description = subject.child('Description').val()
                        let location = subject.child('Location').val()
                        let title = subject.child('Title').val()
                        let professor = subject.child('Professor').val()
                        let schedDay = subject.child('Schedule').child(`Day`).val()
                        let schedTime = subject.child('Schedule').child(`Time`).val()

                        firebase.database().ref(`Data/Faculty/Information/${professor}/`).on('value', professor => {
                            if (professor.val() != null) {

                                let first = professor.child('Name').child(`First`).val()
                                let last = professor.child('Name').child(`Last`).val()
                                let middle = professor.child('Name').child(`Middle`).val()

                                tableModal.DataTable().row.add(
                                    [
                                        classNbr,
                                        title,
                                        description,
                                        schedDay,
                                        schedTime,
                                        `${last}, ${first} ${middle}`,
                                        `<button onclick="DeleteRow(this)"><i class="material-icons delete-row">delete_forever</i></button>`
                                    ]).draw();
                                tableSubject.DataTable().row.add(
                                    [
                                        classNbr,
                                        title,
                                        description,
                                        schedDay,
                                        schedTime,
                                        `${last}, ${first} ${middle}`,
                                        `<button onclick="DeleteRow(this)"><i class="material-icons delete-row">delete_forever</i></button>`
                                    ]).draw();
                            }
                        })

                    })

                } else {
                    console.log(`We can't any subjects on this professor!`)
                }
            })
            // snap.child("Subject").forEach(subject => {
            //     console.log("Subject");
            //     console.log(subject.val());
            //     firebase.database().ref("Data/Subject/" + subject.val()).once('value', subSnap => {

            //         //    console.log(subSnap.val());

            //         if (subSnap.val() == null) {
            //             alert(`We can't subject data of ${name[1]}, ${name[0]}!`);
            //             return;
            //         }

            //         let schedule = []
            //         subSnap.child('Schedule').forEach(schedules => {
            //             schedule.push(schedules.val());
            //         });

            //         //     $('#modal-table tbody, #SubjectSection-table tbody').append(`
            //         //     <tr>
            //         //     <td>${subSnap.child('ClassNbr').val()}</td>
            //         //     <td>${subSnap.child('Title').val()}</td>
            //         //     <td>${subSnap.child('Description').val()}</td>
            //         //     <td>${schedule[0]}</td>
            //         //     <td>${schedule[1]}</td>
            //         //     <td>${subSnap.child('Professor').val()}</td>
            //         //     <td><i class="material-icons delete-row">delete_forever</i></td>
            //         //  </tr>
            //         //  `);


            //         tableModal.DataTable().row.add(
            //             [
            //                 subSnap.child('ClassNbr').val(),
            //                 subSnap.child('Title').val(),
            //                 subSnap.child('Description').val(),
            //                 schedule[0],
            //                 schedule[1],
            //                 subSnap.child('Professor').val(),
            //                 `<button onclick="DeleteRow(this)"><i class="material-icons delete-row">delete_forever</i></button>`
            //             ]).draw();
            //         tableSubject.DataTable().row.add(
            //             [
            //                 subSnap.child('ClassNbr').val(),
            //                 subSnap.child('Title').val(),
            //                 subSnap.child('Description').val(),
            //                 schedule[0],
            //                 schedule[1],
            //                 subSnap.child('Professor').val(),
            //                 `<button onclick="DeleteRow(this)"><i class="material-icons delete-row">delete_forever</i></button>`
            //             ]).draw();



            //     })
            // });

        });
    } else {
        Path = "Data/Gate/Information/" + uid;

        firebase.database().ref(Path).on(`value`, snap => {
            let id = snap.child(`ID`).val()
            let status = snap.child(`Status`).val()
            let location = snap.child(`Location`).val()

            console.log(id)

            ID.val(id)
            gatestatus.val(status)
            gatelocation.val(location)
        })
    }

    var url = new URL(window.location.href);
    let usermanagementType = url.searchParams.get('type');

    if (usermanagementType.includes('update')) {
        $('.inputArea > input,textarea, #UserSetup input, #setSubject, #Role, #setSubject').prop('disabled', false)
    }
    // ;



});

function DeleteUser(id) {
    if (id.includes('STUD')) {
        firebase.database().ref(`Data/Student/Information/${id}/`).remove()
    } else if (id.includes('FAC') || id.includes('PROF')) {
        firebase.database().ref(`Data/Faculty/Information/${id}/`).remove()
        firebase.database().ref(`User/`).orderByChild('UserID').startAt(id).endAt(id).once(`value`, users => {
            users.forEach(user => {
                let id = user.child('ID').val()
                let userID = user.child('UserID').val()

                firebase.database().ref(`User/${userID}/`).remove()
            })
        })
    } else {
        firebase.database().ref(`Data/Gate/Information/${id}/`).remove()
        firebase.database().ref(`User/`).orderByChild('UserID').startAt(id).endAt(id).once(`value`, users => {
            users.forEach(user => {
                let id = user.child('ID').val()
                let userID = user.child('UserID').val()
                firebase.database().ref(`User/${userID}/`).remove()
            })
        })
    }
}

function LoadSearch(UserType) {



    firebase.database().ref('Data/' + UserType + '/Information/').on('value', snap => {

        searchperson.empty().trigger("change")
        searchperson.append(`<option value="default" disabled selected> Select ${UserType} </option>`);

        console.log(snap.val())
        if (snap.val() != null) {
            snap.forEach(childSnap => {


                if (UserType.includes(`Gate`)) {
                    let id = childSnap.child('ID').val();
                    let status = childSnap.child(`Status`).val()
                    let location = childSnap.child(`Location`).val()

                    if (id != null) {

                        searchperson.append(`<option value='${id}'> ${`<span style="color:#cccccc">(${id}) </span>`} ${location} ${status} </option>`);

                    }
                } else {
                    let id = childSnap.child('ID').val();

                    let first = childSnap.child('Name').child(`First`).val()
                    let last = childSnap.child('Name').child(`Last`).val()
                    let middle = childSnap.child('Name').child(`Middle`).val()

                    if (id != null) {

                        searchperson.append(`<option value='${id}'> ${`<span style="color:#cccccc">(${id}) </span>`+last +','+ first +' ' +middle} </option>`);

                    }
                }

            });
        }

    });
}