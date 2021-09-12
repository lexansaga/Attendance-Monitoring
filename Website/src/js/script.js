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
