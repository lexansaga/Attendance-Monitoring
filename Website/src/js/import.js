var $fileInput = $('.file-input');
var $droparea = $('.file-drop-area');

// highlight drag area
$fileInput.on('dragenter focus click', function(e) {
    $droparea.addClass('active');
});

// back to normal state
$fileInput.on('dragleave blur drop', function() {
    $droparea.removeClass('active');
  });
// change inner text
$fileInput.on('change', function() {
    var filesCount = $(this)[0].files.length;
    var $textContainer = $(this).prev();
  
    if (filesCount === 1) {
      // if single file is selected, show file name
      var fileName = $(this).val().split('\\').pop();
      $textContainer.text(fileName);
    } else if(filesCount < 1){
      // otherwise show number of files
      $textContainer.text('or drag and drop files here');
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