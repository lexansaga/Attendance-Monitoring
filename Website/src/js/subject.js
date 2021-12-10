var id = $('#sub_id');
var subname = $('#sub_name');
var description = $('#sub_description');
var sublocation = $('#sub_location');
var start = $('#sub_start');
var end = $('#sub_end');
var day = $('#sub_days');

var searchSubject = $('#search_subject');
var searchSubjectContainer = $('.containerSearchSubject');
var professors = $('#professors');

var submit = $('#submits');

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


    professors.select2({
        placeholder: "Select Subject",
        containerCssClass: "show-hide",
        margin: '10px 10px 15px 0'
    });

    searchSubject.select2({
        placeholder: "Select Subject",
        containerCssClass: "show-hide",
        margin: '10px 10px 15px 0'
    });
    day.select2({
        maximumSelectionLength: 2,
        placeholder: "Select days",
        containerCssClass: "show-hide",
        margin: '10px 10px 15px 0'
    });

    var url = new URL(window.location.href);
    let subjectType = url.searchParams.get('type');
    console.log(subjectType);

    if (subjectType.includes('add')) {


        submit.html('Add');
        searchSubjectContainer.css({
            'display': 'none'
        });
        id.css({
            'margin-top': '50px'
        });

    } else if (subjectType.includes('update')) {
        //alert("Update");
        LoadSubjects();
        submit.html('Update');

    } else {
        //alert("Delete");
        LoadSubjects();
        submit.html('Delete');

    }



    firebase.database().ref('Data/Faculty/Information').on('value', snap => {
        snap.forEach(childSnap => {
            var profID = childSnap.child('ID').val();
            let name = [];
            childSnap.child('Name').forEach(names => {
                name.push(names.val());
            })

            professors.append(`<option value="${profID}"> <span style="color:#ccc">(${profID})</span>   ${name[1]+', '+name[0]+' '+name[2]}</option>`);

        });
    });


    loadid();
    console.log('Load');
});


$('#submits').click(function () {
    // console.log(id.val());
    // console.log(subname.val());
    // console.log(description.val());
    // console.log(start.val());
    // console.log(end.val());
    // console.log(day.val());

    if (submit.html().includes('Add') || submit.html().includes('Update')) {
        if (id.val() != null && subname.val() != null &&
            description.val() != null && start.val() != null &&
            end.val() != null && day.val() != null &&
            sublocation.val() != null && professors.val() != null) {
            firebase.database().ref('Data/Subject/' + id.val()).update({
                ClassNbr: id.val(),
                Description: description.val(),
                Location: sublocation.val(),
                Professor: professors.val(),
                Schedule: {
                    Day: day.val().toString(),
                    Time: start.val() + '-' + end.val()
                },
                Title: subname.val()

            });
            reset();
            loadid();
            alert('Subject Data Inserted Successfully!');
        } else {
            alert('Fill up all information');
        }
    } else {
        var val = confirm("Are you sure you want to delete this?");
        if (val == true) {
            firebase.database().ref('Data/Subject/' + id.val()).remove();
            alert('Subject Deleted Sucessfully');
            return true;
        } else {
            alert('Subject Deletion Cancelled');
            return false;
        }

    }

});

$('#cancel').click(function () {

});


var reset = function () {
    id.val("");
    subname.val("");
    sublocation.val("");
    description.val("");
    start.val("");
    end.val("");
    day.val(['']).trigger('change');
    professors.val('default').trigger('change');

}

function loadid() {
    // console.log('ID Loaded')
    // firebase.database().ref('Data/Subject/').on('value', snap => {
    //     console.log(snap.numChildren())
    //     var count = (snap.numChildren() + 1).toString();
    //     id.val('SUB' + '1' + ('000000' + count).substring(count.length));
    // });


    firebase.database().ref('Data/Subject/').limitToLast(1).on('value', snap => {
        if (snap.val() != null) {
            snap.forEach(counter => {
                console.log(snap.val())
                var count = counter.child(`ClassNbr`).val();
                var sCount = count.toString().slice(4, count.length).replaceAll('0', '');
                id.val('SUB' + '1' + ('000000' + (parseInt(sCount) + 1)).substring(sCount.length))

            })

        }
        else{
            id.val(`SUB1000001`)
        }

    });
}


$('#search_subject').on("select2:select", function (e) {


    let uid = $(this).val();
  //  alert(uid);
    firebase.database().ref('Data/Subject/' + uid).on('value', snap => {
        id.val(snap.child('ClassNbr').val());
        subname.val(snap.child('Title').val());
        description.val(snap.child('Description').val());
        sublocation.val(snap.child('Location').val());

        let sched = snap.child('Schedule').child('Time').val();

        if (sched != null) {
            sched = snap.child('Schedule').child('Time').val().split('-')
            start.val(sched[0]);
            end.val(sched[1]);

            day.val(snap.child('Schedule').child('Day').val().split(',')).change();

            professors.val(snap.child('Professor').val()).trigger('change');
        } else {
            alert("No Schedule Available");

        }




        //   alert(snap.child('Professor').val());
    });

});

function LoadSubjects() {
    firebase.database().ref('Data/Subject/').on('value', snap => {
        searchSubject.html(' ');
        searchSubject.append(`<option disabled selected> Select Subject </option>`);
        snap.forEach(childSnap => {

            console.log('Subject Added');
            searchSubject.append(`<option value='${childSnap.child('ClassNbr').val()}'> ${`<span style="color:#cccccc">(${childSnap.child('ClassNbr').val()}) </span>`+childSnap.child('Title').val()} </option>`);
        });
    });
}