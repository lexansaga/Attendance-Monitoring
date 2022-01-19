var id = $('#sub_id');
var subname = $('#sub_name');
var description = $('#sub_description');
var sublocation = $('#sub_location');
var start = $('#sub_start');
var end = $('#sub_end');
var day = $('#sub_days');

var searchDepartment = $('#department');
var searchSection = $('#section');

var searchSubject = $('#search_subject');
var searchSubjectContainer = $('.containerSearchSubject');
var professors = $('#professors');
var locationSelect = $('#search_location');

var academicYear = $('#academicYear');

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

    LoadAcademicYear();

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

    searchDepartment.select2({
        maximumSelectionLength: 2,
        placeholder: "Select Department",
        containerCssClass: "show-hide",
        margin: '10px 0'
    });

    searchSection.select2({
        maximumSelectionLength: 2,
        placeholder: "Select Section",
        containerCssClass: "show-hide",
        margin: '10px 0'
    });

    academicYear.select2({
        maximumSelectionLength: 2,
        placeholder: "Select Academic Year",
        containerCssClass: "show-hide",
        margin: '10px 0'
    });

    LoadDepartment();

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

function LoadAcademicYear() {
    let yearNow = parseInt(GetDateNow().split('-')[2]);
    //  alert(yearNow)
    for (var i = yearNow; i <= (yearNow + 10); i++) {
        let from = i - 10;
        let to = i - 9;

        //  alert(`${from}-${to}`)
        academicYear.append(`<option value="${from}-${to}">${from}-${to}</option>`)
    }
}
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
                        Department: searchDepartment.val(),
                        Section: searchSection.val(),
                        AcademicYear: academicYear.val(),
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
    searchDepartment.val('default').trigger('change')
    searchSection.val('default').trigger('change')
    academicYear.val('default').trigger('change')

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

        let deparment = snap.child('Department').val();
        let section = snap.child('Section').val()

        let academicYears = snap.child('AcademicYear').val()

        console.log(deparment)
        console.log(section)

        academicYear.val(academicYears == null ? 'default' : academicYears).trigger('change')

        searchDepartment.val(deparment == null ? 'default' : deparment).trigger('change')
        LoadSection(searchDepartment.val())
        searchSection.val(section == null ? 'default' : section).trigger('change')

        locationSelect.val(snap.child('Location').val()).trigger('change')


        let sched = snap.child('Schedule').child('Time').val();

        if (sched != null) {
            sched = snap.child('Schedule').child('Time').val().split('-')
            start.val(sched[0]);
            end.val(sched[1]);

            day.val(snap.child('Schedule').child('Day').val().split(',')).change();

            professors.val(snap.child('Professor').val()).trigger('change');
        } else {

            // searchDepartment.val('default').trigger('change')
            // searchSection.val('default').trigger('change')

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

searchDepartment.on("select2:select", function () {
    let selected = this.value
    LoadSection(selected)


});

function LoadDepartment() {
    searchDepartment.empty().trigger('change')
    searchDepartment.append(`<option value="default" disabled selected> Select Department </option>`);
    firebase.database().ref(`Data/Course/`).once(`value`, deparments => {
        deparments.forEach(dDeparment => {
            let code = dDeparment.child(`Code`).val()
            let name = dDeparment.child(`Name`).val()

            searchDepartment.append(`<option value="${code}">(${code}) ${name}</option>`)
        })
    })
}

function LoadSection(code) {
    searchSection.empty().trigger('change')
    searchSection.append(`<option value="default" disabled selected> Select Section </option>`);
    firebase.database().ref(`Data/Section/`).orderByChild('Code').startAt(code).endAt(code).once(`value`, sections => {
        sections.forEach(dSections => {
            let code = dSections.child(`Code`).val()
            let name = dSections.child(`Name`).val()

            searchSection.append(`<option value="${code}${name}">${code}${name}</option>`)
        })
    })
}

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



$('#reset_subjects').click(function () {
    let yearNow = parseInt(GetDateNow().split('-')[2]);
    let academicYearDefault = `${yearNow}-${yearNow + 1}`;

    let academicYearPrompt = prompt('Add Academic Year ', academicYearDefault)
    if (confirm(`Are you sure you want to archive ${academicYearPrompt} ? Proceeding will create new academic year and reset current subjects of faculty and students. All of the subjects will need to reimport based on your preferrences`)) {
        let confirm = prompt('Enter this word to confirm! `I am sure`')
        if (confirm.includes('I am sure')) {

            let academicYearTobeDeleted = academicYearDefault.split('-')
            firebase.database().ref("Data/Subject/").once('value', subjects => {

                if (subjects.val() != null) {
                    //Scan all subjects          


                    firebase.database().ref(`Archive/${academicYearPrompt}/Data/Subject`).update(subjects.val())
                    firebase.database().ref('Data/Subject/').remove()

                    alert('Subject save on archive sucessfully!')

                }

            })


            firebase.database().ref('Attendance/').once('value', attendances => {
                if (attendances.val() != null) {
                    firebase.database().ref(`Archive/${academicYearPrompt}/Attendance`).update(attendances.val())
                    firebase.database().ref('Attendance/').remove()

                    alert('Attendances save on archive sucessfully!')
                }
            })

            firebase.database().ref('Data/Faculty/Information').once('value', faculties => {
                if (faculties.val() != null) {
                    firebase.database().ref(`Archive/${academicYearPrompt}/Data/Faculty/Information`).update(faculties.val())
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
                    firebase.database().ref(`Archive/${academicYearPrompt}/Data/Student/Information`).update(students.val())
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

})