$('.UserInformation_wrapper').css('display', 'none');

$(document).ready(function () {
    $('.js-example-basic-single').select2();
    $('#look').select2({
        width: '90%',
        margin: '10px 10px 0 0'
    })
    $('#userType').select2({
        width: '90%',
        margin: '10px 10px 0 0'
    })

    LoadSearch('Professor');

});

$('#look').on("select2:select", function (e) {
    // what you would like to happen

    $('.UserInformation_wrapper').css({
        'display': 'block'
    });

    LoadUser($("#userType").val() == null ? 'Professor' : $("#userType").val(), $('#look').val())
});

$('#userType').on("change", function (e) {
    $('#look').html("");
    LoadSearch($("#userType").val());
});

// let tableData = [
//     [
//         "IT Capstone Project 2",
//         "Wednesday",
//         "12:30PM - 3:30PM",
//         "TBA",
//         "Bejar, Rouse Adam E.",
//         "<img src='src/assets/profile.jpg'>"
//     ],
//     [
//         "Web Systems and Technologies",
//         "Thursday",
//         "12:30PM - 3:30PM",
//         "TBA",
//         "Gamboa, Lucita",
//         "<img src='src/assets/profile.jpg'>"
//     ],
//     [
//         "Euthenics 2",
//         "Friday",
//         "1:00PM - 2:00PM",
//         "TBA",
//         "Bejar, Rouse Adam E.",
//         "<img src='src/assets/profile.jpg'>"
//     ],
//     [
//         "Game Development",
//         "Friday",
//         "3:00PM - 6:00PM",
//         "TBA",
//         "Gamboa, Lucita",
//         "<img src='src/assets/profile.jpg'>"
//     ],
//     [
//         "Mobile Systems and Technologies",
//         "Saturday",
//         "3:00PM - 6:00PM",
//         "TBA",
//         "Ramos, Mariel",
//         "<img src='src/assets/profile.jpg'>"
//     ],
// ]


$('#searchbx').focusin(function () {
    $('.search-result').css({
        "opacity": "1",
        "display": "block"
    }).animate();
});
$('#searchbx').focusout(function () {
    $('.search-result').css({
        "opacity": "0",
        "display": "none"
    }).animate();
});

function LoadSearch(UserType) {
    $('#look').append(`<option disabled selected> Select ${UserType} </option>`);
    firebase.database().ref('Data/' + UserType + '/Information/').on('value', snap => {

        snap.forEach(childSnap => {
            var name = childSnap.child('Name').val().split('&&')
            $('#look').append(`<option value='${childSnap.child('ID').val()}'> ${`<span style="color:#ccc">(${childSnap.child('ID').val()})</span>`+name[0] +','+ name[1] +' ' +name[2]} </option>`);
        });
    });
}


function LoadUser(UserType, Id) {
    $('#userSchedule').append(`<thead><tr>
    <td>Title</td>
    <td>Day</td>
    <td>Time</td>
    <td>Location</td>
    <td>Professor</td>
    </tr></thead>`);
    firebase.database().ref(`Data/${UserType}/Information/${Id}`).on('value', snap => {
        console.log(snap.child('Name').val());
    var name = snap.child('Name').val().split('&&');
       
        $('#infoName').html(
            `${name[0]} , ${name[1]} ${name[2]}`
        );
        $('#infoId').html(
            `${snap.child('ID').val()}`
        );
        $('#infoType').html(UserType);
        $('#userImage').attr('src',snap.child('Profile').val());
        // var subjects = snap.child('Subject').val().split('&&');

        // subjects.forEach(subject => {
        //     firebase.database().ref(`Data/Subject/${subject}`).on('value', subjectsSnap => {

        //         var schedule = subjectsSnap.child('Schedule').val().split('&&')
        //         console.log(subjectsSnap.child('Title').val());
        //         $('#userSchedule').append(`<tbody><tr>
        //                     <td>${ subjectsSnap.child('Title').val()}</td>
        //                     <td>${ schedule[0]}</td>
        //                     <td>${ toStandardTime(schedule[1] + ":00") + '-' +  toStandardTime(schedule[2] + ":00")}</td>
        //                     <td>${ subjectsSnap.child('Location').val()}</td>
        //                     <td>${ subjectsSnap.child('Professor').val()}</td>
        //                     </tr></tbody>`);

        //     });
        // });

    });

}

function toStandardTime(militaryTime) {
    militaryTime = militaryTime.split(':');
    return (militaryTime[0].charAt(0) == 1 && militaryTime[0].charAt(1) > 2) ? (militaryTime[0] - 12) + ':' + militaryTime[1] + ':' + militaryTime[2] + ' P.M.' : militaryTime.join(':') + ' A.M.'
}