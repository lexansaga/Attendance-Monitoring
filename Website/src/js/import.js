var $fileInput = $('.file-input');
var $droparea = $('.file-drop-area');
var $fakebutton = $(`.fake-btn`)
// highlight drag area
$fileInput.on('dragenter focus click', function (e) {
    $droparea.addClass('active');
});

// back to normal state
$fileInput.on('dragleave blur drop', function () {
    $droparea.removeClass('active');
});
// change inner text
$fileInput.on('change', function () {
    var filesCount = $(this)[0].files.length;
    var $textContainer = $(this).prev();

    var validExtensions = ['.xls', '.xlsx', '.csv']
    var fileName = this.value
    var fileNameValid = fileName.substring(fileName.lastIndexOf('.'));
    if (validExtensions.indexOf(fileNameValid) < 0) {
        alert('Invalid file! Please try again')
    } else {
        if (filesCount === 1) {
            // if single file is selected, show file name
            var fileName = $(this).val().split('\\').pop();
            $textContainer.text('');
            $fakebutton.text(fileName)

        } else if (filesCount < 1) {
            // otherwise show number of files
            alert('Single file only!')
            $textContainer.text('or drag and drop files here');
        }
    }

});

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

});

$('#upload').on('click', function () {
    let file = document.querySelector('.file-input')
    if (file.files[0] != null) {
        if (confirm('Uploading data may overwrite existing data! Are you sure you want to proceed?')) {
            ReadAndUpload(file.files[0])
        } else {

        }
    } else {
        alert('Please select file first!')
    }

    //ExcelToJSON(file.files[0])
})

function ReadAndUpload(file) {

    var reader = new FileReader()
    reader.onload = function (event) {
        var data = event.target.result;
        var workbook = XLSX.read(data, {
            type: 'binary'
        })
        workbook.SheetNames.forEach(sheetName => {
            var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName])
            var json_object = JSON.stringify(XL_row_object)


            console.log(JSON.parse(JSON.stringify(XL_row_object)))
            Upload(XL_row_object, sheetName)
            //     return XL_row_object;
        });
    }
    reader.onerror = function (event) {
        console.error("File could not be read! Code " + event.target.error.code)
    }

    reader.readAsBinaryString(file)
}

function Upload(data, pathName) {
    if (pathName.includes('Subject')) {
        data.forEach(subject => {
            //     console.log(subject)
            firebase.database().ref(`Data/Subject/${subject.ClassNbr}/`).once(`value`, vSubject => {
                if (vSubject.val() == null) {
                    firebase.database().ref(`Data/${pathName}/${subject.ClassNbr}/`).update(subject)
                } else {
                    // if(confirm(`${subject.Title} with ID of ${subject.ClassNbr} already exists! Are you sure you want to ovewrite this?`))
                    // {
                    //     firebase.database().ref(`Data/${pathName}/${subject.ClassNbr}/`).update(subject)
                    // }
                    // else
                    // {

                    // }
                }
            })

        })
    }
    if (pathName.includes('Rooms')) {
        //For Building Rooms
        data.forEach(rooms => {
            let building = rooms.Building
            let room = rooms.Room

            firebase.database().ref(`Data/Building/Rooms/${building}${room}`).once(`value`, vRooms => {
                if (vRooms.val() == null) {
                    firebase.database().ref(`Data/Building/Rooms/${building}${room}/`).update(rooms)
                } else {}
            })
        })
    }
    if (pathName.includes(`Aliases`)) {
        //For Building Aliases
        data.forEach(building => {
            let code = building.Code
            let title = building.Title

            firebase.database().ref(`Data/Building/Aliases/${code}/`).once(`value`, vBuilding => {
                if (vBuilding.val() == null) {
                    firebase.database().ref(`Data/Building/Aliases/${code}/`).update(building)
                } else {}
            })
        })

    }
    if (pathName.includes('Course')) {
        data.forEach(course => {
            let code = course.Code
            let name = course.Name

            firebase.database().ref(`Data/Course/${code}/`).once(`value`, vCourse => {
                if (vCourse.val() == null) {
                    firebase.database().ref(`Data/Course/${code}/`).update(course)
                } else {}
            })
        })
    }
    if (pathName.includes(`Section`)) {
        data.forEach(section => {
            let code = section.Code
            let name = section.Name

            firebase.database().ref(`Data/Section/${code}/`).once(`value`, vSection => {
                if (vSection.val() == null) {
                    firebase.database().ref(`Data/Section/${code}/`).update(section)
                } else {}
            })
        })
    }

    //  firebase.database().ref(`Data/${pathName}/`).update(data)


    alert(`${pathName} uploaded sucessfully`)
}