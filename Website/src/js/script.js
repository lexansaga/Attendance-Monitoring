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
    const [hours, minutes, seconds] = militaryTime.split(':');
    return `${(hours > 12) ? hours - 12 : "0"+hours}:${minutes}${seconds ? `:${seconds}` : ''} ${(hours >= 12) ? 'PM' : 'AM'}`;
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