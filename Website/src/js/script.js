var firebaseConfig = {
    apiKey: "AIzaSyC3-mndhgpckYObAr23oH9s2_mDOnqtRaE",
    authDomain: "attendancemonitoringsystem-00.firebaseapp.com",
    databaseURL: "https://attendancemonitoringsystem-00-default-rtdb.firebaseio.com",
    projectId: "attendancemonitoringsystem-00",
    storageBucket: "attendancemonitoringsystem-00.appspot.com",
    messagingSenderId: "782052298274",
    appId: "1:782052298274:web:207c8b25cffae05e36047b",
    measurementId: "G-P53BX41RFX"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

var sem = '';


$(document).ready(function () {

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            let uid = user.uid;
            firebase
                .database()
                .ref(`User/${uid}/`)
                .once('value', (snap) => {
                    let Account_Type = snap.child('Account_Type').val();
                    let ID = snap.child('ID').val();
                    let Role = snap.child('Role').val();
                    let UserID = snap.child('UserID').val();
                    let Notification = snap.child('Notification').val();
                    let Permission_Tapin = snap
                        .child('Permission')
                        .child('TapIn_First')
                        .val();

                    if (Account_Type.includes('Administrator')) {
                        // LoadAcademicYear()
                        //window.location.replace("main.html");
                    } else if (Account_Type.includes('Faculty')) {
                        window.location.replace('main.html');
                    } else if (Account_Type.includes('Guidance')) {
                        window.location.replace('main.html');
                    } else {
                        // Else
                        window.location.replace('index.html');
                    }
                });
        }
    });


})







function DiffMonthYear(startMonth,endMonth,currentMonth)
{
    var start = parseInt(startMonth.replace('-',''))
    var end = parseInt(endMonth.replace('-',''))
    var current = parseInt(currentMonth.replace('-',''))

    console.log(start)
    console.log(end)
    console.log(current)
    console.log((start < current && current > end))
    return (start < current && current > end)
}

function TimeStamp() {

    var date = new Date();
    var DateNow = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    var DayNameNow = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
    var TimeNow = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

    console.log(DayNameNow + '&&' + DateNow + '&&' + TimeNow);
    return DayNameNow + '&&' + DateNow + '&&' + TimeNow;

}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function toStandardTime(militaryTime) {
    militaryTime = militaryTime.split(':');
    return (militaryTime[0].charAt(0) == 1 && militaryTime[0].charAt(1) > 2) ? (militaryTime[0] - 12) + ':' + militaryTime[1] + ':' + (militaryTime[2] == null ? '00' : militaryTime[2]) + ' PM' : militaryTime.join(':') + ' AM'
}

function FormatDate(id, format) {

    id = id.includes(':') ? id.replaceAll(':', '-') : id

    var date = new Date(id);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    day = (day < 10 ? "0" : "") + day
    month = (month < 10 ? "0" : "") + month

    if (format.includes('DD-MM-YY')) {
        return day + '-' + month + '-' + year;
    } else if (format.includes('MM-DD-YY')) {
        return month + '-' + day + '-' + year;
    } else if (format.includes('YY-MM-DD')) {
        return year + '-' + month + '-' + day;
    } else if (format.includes('YY-DD-MM')) {
        return year + '-' + day + '-' + month;
    } else {
        return date;
    }
}

function FormatDateNoZero(id, format) {

    id = id.includes(':') ? id.replaceAll(':', '-') : id

    var date = new Date(id);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    // day = (day < 10 ? "0" : "") + day
    // month = (month < 10 ? "0" : "") + month

    if (format.includes('DD-MM-YY')) {
        return day + '-' + month + '-' + year;
    } else if (format.includes('MM-DD-YY')) {
        return month + '-' + day + '-' + year;
    } else if (format.includes('YY-MM-DD')) {
        return year + '-' + month + '-' + day;
    } else if (format.includes('YY-DD-MM')) {
        return year + '-' + day + '-' + month;
    } else {
        return date;
    }
}


function GetTimeNow() {
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    var ap = "AM";
    if (hour > 11) {
        ap = "PM";
    }
    if (hour > 12) {
        hour = hour - 12;
    }
    if (hour == 0) {
        hour = 12;
    }
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    if (second < 10) {
        second = "0" + second;
    }
    var timeString = hour + ':' + minute + ':' + second + " " + ap;
    return timeString;
}



function GetDateNow() {

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    return month + '-' + day + '-' + year;
}


function GetDay(day) {
    var DayNameNow = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return DayNameNow[day]
}

function GetMonth(month) {

    var months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return months[month - 1]
}

function ImageFallBackNull(image) {
    if (image.attr('src') == null) {
        image.attr('src', 'src/assets/avatar.png')
    }
}

function FallBackNull(data) {
    return data == null || data == '' ? '--' : data
}

function ArrayHasDuplicate(array) {

    const noDups = new Set(array);

    return array.length !== noDups.size;
}
// Usage!
//sleep(5000).then(() => {
// Do something after the sleep!

//});