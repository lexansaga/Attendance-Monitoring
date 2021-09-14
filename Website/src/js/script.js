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



function TimeStamp()
{

    var date = new Date();
    var DateNow = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    var DayNameNow = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
    var TimeNow = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

    console.log( DayNameNow+'&&' +DateNow + '&&' + TimeNow);
    return DayNameNow+'&&' +DateNow + '&&' + TimeNow ;
   
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
// Usage!
//sleep(5000).then(() => {
    // Do something after the sleep!

//});
