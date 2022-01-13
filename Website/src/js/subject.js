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
var locationSelect = $('#search_location');

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
                    LoadLocation()
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
        placeholder: "Select Professor",
        containerCssClass: "show-hide",
        margin: '10px 10px 15px 0'
    });

    locationSelect.select2({
        placeholder: "Select Location",
        containerCssClass: "show-hide",
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


        loadid()
        submit.html('Add');
        $('#sub_name').prop('readonly', false)
        searchSubjectContainer.css({
            'display': 'none'
        });
        id.css({
            'display': 'block'
        })
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
            let professorID = professors.val()
            firebase.database().ref(`Data/Subject/`).orderByChild(`Professor`).startAt(professorID).endAt(professorID).once(`value`, validates => {
                let arrvalidate = []
                validates.forEach(validate => {
                    console.log(validate.val())
                    let classNbr = validate.child(`ClassNbr`).val()
                    let description = validate.child(`Description`).val()
                    let location = validate.child(`Location`).val()
                    let professor = validate.child(`Professor`).val()
                    let time = validate.child(`Schedule`).child(`Time`).val()
                    let sDay = validate.child(`Schedule`).child(`Day`).val()
                    let title = validate.child(`Title`).val()


                    let sched = time.split('-')
                    let schedStart = Date.parse('01-01-2000 ' + sched[0])
                    let schedEnd = Date.parse('01-01-2000 ' + sched[1])

                    let thisStart = Date.parse('01-01-2000 ' + start.val())
                    let thisEnd = Date.parse('01-01-2000 ' + end.val())
                    console.log("SchedStart : " + schedStart)
                    console.log("SchedEnd : " + schedEnd)

                    console.log("thisStart : " + thisStart)
                    console.log("thisEnd : " + thisEnd)

                    console.log(day.val())
                    console.log(sDay)
                    console.log(day.val().includes(sDay))
                    console.log((schedStart > thisStart && thisStart < schedEnd))
                    console.log((schedEnd > thisEnd && thisEnd < thisStart))

                    let daysVal = []
                    let sDayArr = sDay.includes(',') ? sDay.split(',') : [sDay]
                    sDayArr.forEach(days => {
                        console.log(days)
                        daysVal.push(days.includes(day.val()))
                        //This will check if the array of day exist on existing array of day
                    });
                    console.log(daysVal)
                    console.log(daysVal.toString().includes('true'))
                    if (daysVal.toString().includes('true') &&
                        ((schedStart <= thisStart && thisStart < schedEnd) // This will check if selected sched is within the range initial sched
                            ||
                            (schedStart <= thisEnd && thisEnd < schedEnd))) {
                        arrvalidate.push(`true`)
                    } else {
                        arrvalidate.push('false')
                    }
                    //     console.log((thisStart <= schedStart && thisEnd <= schedStart) && (thisStart >= schedEnd && thisEnd >= schedEnd))
                    // if (day.val().includes(sDay) && (thisStart > schedStart && schedEnd < thisEnd)) {

                    //     arrvalidate.push(`true`)
                    // } else {

                    //     arrvalidate.push('false')
                    // }

                })
                console.log(arrvalidate)
                if (arrvalidate.toString().includes('true')) {
                    //Professor has duplicate!
                    alert('This professor may have conflict on the schedule! Please check the schedule again')
                } else {
                    alert('No match! Safe to insert')
                    firebase.database().ref('Data/Subject/' + id.val()).update({
                        ClassNbr: id.val(),
                        Description: description.val(),
                        Location: locationSelect.val(),
                        Professor: professors.val(),
                        Schedule: {
                            Day: day.val().toString(),
                            Time: start.val() + '-' + end.val()
                        },
                        Title: subname.val()

                    });

                    firebase.database().ref(`Data/Faculty/Information/${professors.val()}/Subject/`).on(`value`, subjects => {

                        // This will append subject from professor
                        let arrsubject = []
                        subjects.forEach(subject => {
                            arrsubject.push(subject.val())
                        })

                        arrsubject.push(id.val())

                        let newArrSubject = [...new Set(arrsubject)];

                        console.log(newArrSubject)

                        firebase.database().ref(`Data/Faculty/Information/${professors.val()}/Subject/`).set(newArrSubject);
                    })
                    reset();
                    loadid();
                    alert('Subject Data Inserted Successfully!');
                }
            })
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

$(`#sub_start`).on(`change`, function () {
    let start = $(`#sub_start`)
    let end = $(`#sub_start`)
    end.attr('min', start.val())

})
$('#cancel').click(function () {

});


var reset = function () {
    id.val("");
    subname.val("");
    sublocation.val("");
    description.val("");
    start.val("");
    end.val("");
    locationSelect.val('default').trigger('change')
    day.val(['']).trigger('change');
    professors.val('default').trigger('change');

}

function loadid() {
    console.log('ID Loaded')
    firebase.database().ref('Data/Subject/').on('value', snap => {
        console.log(snap.numChildren())
        var count = (snap.numChildren() + 1).toString();
        id.val('SUB' + '1' + ('000000' + count).substring(count.length));
    });


    // firebase.database().ref('Data/Subject/').limitToLast(1).on('value', snap => {
    //     if (snap.val() != null) {
    //         snap.forEach(counter => {
    //             console.log(snap.val())
    //             var count = counter.child(`ClassNbr`).val();
    //             var sCount = count.toString().slice(4, count.length).replaceAll('0', '');
    //             id.val('SUB' + '1' + ('000000' + (parseInt(sCount) + 1)).substring(sCount.length))

    //         })

    //     } else {
    //         id.val(`SUB1000001`)
    //     }

    // });
}


$('#search_subject').on("select2:select", function (e) {


    let uid = $(this).val();
    //  alert(uid);
    firebase.database().ref('Data/Subject/' + uid).on('value', snap => {
        id.val(snap.child('ClassNbr').val());
        subname.val(snap.child('Title').val());
        description.val(snap.child('Description').val());
        sublocation.val(snap.child('Location').val());

        locationSelect.val(snap.child('Location').val()).trigger('change')

        let sched = snap.child('Schedule').child('Time').val();

        if (sched != null) {
            sched = snap.child('Schedule').child('Time').val().split('-')
            start.val(sched[0]);
            end.val(sched[1]);

            day.val(snap.child('Schedule').child('Day').val().split(',')).change();

            professors.val(snap.child('Professor').val()).trigger('change');
        } else {
            locationSelect.val('default')
            day.val('').trigger('change')
            professors.val('').trigger('change')
            start.val('')
            end.val('')
            alert("No Schedule Available");

        }




        //   alert(snap.child('Professor').val());
    });

});

function LoadLocation() {
    $(`#search_location`).append(`<option value="default" selected disabled>Select location</option>`)
    // alert(`loading location`)
    firebase.database().ref(`Data/Building/Rooms/`).once(`value`, rooms => {
        rooms.forEach(dRoom => {
            let code = dRoom.child(`Building`).val()
            let room = dRoom.child(`Room`).val()
            $(`#search_location`).append(`<option value="${code}${room}">${code}${room}</option>`)
        })
    })

}

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