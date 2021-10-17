var id = $('#sub_id');
var subname = $('#sub_name');
var description = $('#sub_description');
var sublocation = $('#sub_location');
var start = $('#sub_start');
var end = $('#sub_end');
var day = $('#sub_days');

var professors = $('#professors');
$(document).ready(function () {
    //$('.js-example-theme-multiple').select2();
});

$(window).on('load', function () {


    firebase.database().ref('Data/Faculty/Information').on('value', snap => {
        snap.forEach(childSnap => {
            var profID = childSnap.child('ID').val();
            var profName = childSnap.child('Name').val().split('&&');
            professors.append(`<option value="${profID}"> ${profName[0]+', '+profName[1]+' '+profName[2]} (${profID})  </option>`);

        });
    });


    loadid();
    console.log('Load');
});


$('#submits').click(function () {
    console.log(id.val());
    console.log(subname.val());
    console.log(description.val());
    console.log(start.val());
    console.log(end.val());
    console.log(day.val());


    if (id.val() != null && subname.val() != null &&
        description.val() != null && start.val() != null &&
        end.val() != null && day.val() != null &&
        sublocation.val() != null && professors.val() != null) {
        firebase.database().ref('Data/Subject/' + id.val()).set({
            Code: id.val(),
            Description: description.val(),
            Location: sublocation.val(),
            Professor: professors.val(),
            Schedule: day.val() + '&&' + start.val() + '&&' + end.val(),
            Title: subname.val()

        });
        reset();
        loadid();
        alert('Subject Data Inserted Successfully!');
    } else {
        alert('Fill up all information');
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
    day.val("Select Day");
    professors.val("Select Professor");

}

var loadid = function () {
    firebase.database().ref('Data/Subject/').on('value', snap => {
        var count = (snap.numChildren() + 1).toString();
        id.val('SUB' + '1' + ('000000' + count).substring(count.length));
    });
}