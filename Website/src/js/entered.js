var unformmated_date = new Date();
var month = unformmated_date.getMonth() + 1;
var year = unformmated_date.getFullYear();
var day = unformmated_date.getDate();
var date = month + '-' + day + '-' + year;


var table = $('#datatable');
$(document).ready(function () {

    $('#datatable').DataTable({
        "autoWidth": true,
        "paging": true,
        "info": true,
        columnDefs: [ {
            targets:4,
            createdCell: function (td, cellData, rowData, row, col) {
                if ( rowData[4].toLowerCase().includes('in')) {
                    $(td).css('background-color', 'var(--green)');
                }
            }
        } ]
    }).order([2, 'desc']);



    console.log(date);



    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
    
    
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            let uid = user.uid;
            // console.log(uid);
            firebase.database().ref('User/' + uid).on('value', snap => {
                let Account_Type = snap.child('Account_Type').val();
                let ID = snap.child('ID').val();
                let Role = snap.child('Role').val();
                let UserID = snap.child('UserID').val();
                let Notification = snap.child('Notification').val();

                if (Account_Type.includes('Administrator')) {
                    //window.location.replace("main.html");
                } else if (Account_Type.includes('Faculty')) {
                    //window.location.replace("main.html");
                } else if (Account_Type.includes('Guidance')) {
                    //window.location.replace("main.html");
                } else { // Else
                    window.location.replace("index.html");
                }

                table.DataTable().clear().draw()
                Entered(Account_Type,GetDateNow(),UserID)



            });
        }
        else
        {
            //Sign out
        }
    });

});

var datefrom = $('#datefrom');
var dateto = $('#dateto');

datefrom.change(function () {
    if (datefrom.val() != '') {
        dateto.prop('disabled', false);
        dateto.attr('min', FormatDate(datefrom.val(), 'YY-MM-DD'));

    } else {
        dateto.prop('disabled', true);
    }
});

$('.btn-submit').click(function () {


    var start;
    var end;

    if (dateto.val() == '') {
        //  alert('DateTo Has no Value');
        start = new Date(FormatDate(datefrom.val(), "MM-DD-YY"));
        end = new Date(FormatDate(datefrom.val(), "MM-DD-YY"));
    } else {
        //alert('DateTo Has  Value');
        start = new Date(FormatDate(datefrom.val(), "MM-DD-YY"));
        end = new Date(FormatDate(dateto.val(), "MM-DD-YY"));
    }

    $('.datefrom-set').html(`${GetMonth(start.getMonth() + 1)} - ${start.getDate()} - ${start.getFullYear()} `)
    $('.dateto-set').text(`${GetMonth(end.getMonth() + 1)} - ${end.getDate()} - ${end.getFullYear()} `)


    table.DataTable().clear().draw();

    // alert(datefrom.val()+'-'+dateto.val());
    var newend = end.setDate(end.getDate() + 1);
    var end = new Date(newend);
    while (start < end) {
        //  console.log(start)


        let mm = start.getMonth() + 1;
        let yy = start.getFullYear();
        let dd = start.getDate();

        let date = mm + '-' + dd + '-' + yy;

        console.log(date)


        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
        
        
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                let uid = user.uid;
                // console.log(uid);
                firebase.database().ref('User/' + uid).on('value', snap => {
                    let Account_Type = snap.child('Account_Type').val();
                    let ID = snap.child('ID').val();
                    let Role = snap.child('Role').val();
                    let UserID = snap.child('UserID').val();
                    let Notification = snap.child('Notification').val();
    
                    Entered(Account_Type,date,UserID)
    
    
    
                });
            }
            else
            {
                //Sign out
            }
        });



        var newDate = start.setDate(start.getDate() + 1);
        start = new Date(newDate);
    }
    $('.modal').css('display', 'none');

});

function Entered(account_type, date, id) {

    if (account_type.includes('Faculty')) {

        firebase.database().ref('Data/Subject/').orderByChild('Professor').startAt(id).endAt(id).once('value', subjects => {
            let arrstudent = []
            subjects.forEach(subject => {
                // Get all the subjects of the professor
            //    console.log(subject.val())
                subject.child('Students').forEach(student => {
                 //   console.log(student.child('ID').val())
                    arrstudent.push(student.child('ID').val())

                    //Append student ID of the professor Student on the arrstudent array
                })


            })

           // console.log(arrstudent)
            firebase.database().ref(`Attendance/Gate/${date}`).orderByKey().on('value', attendance => {
                attendance.forEach(student => {             
                       //Get Attendance for todays date
                    Object.keys(student).reverse();
                    let enteredID = student.child('EnteredID').val();
                    let status = student.child('Status').val()
                    let date = student.child('Date').val()
                    let time = student.child('Time').val()
                    let isValid = student.child('isValid').val()

                    if (arrstudent.includes(enteredID)) {
                        //Check if the entered ID has on professor student by comparing arrstudent on enteredID
                        firebase.database().ref(`Data/Student/Information/${enteredID}`).on('value', enter => {
                            let last = enter.child('Name').child('Last').val()
                            let first = enter.child('Name').child('First').val()
                            let middle = enter.child('Name').child('Middle').val()

                            let profile = enter.child('Profile').val()

                            let colorStatus = status.toLowerCase().includes('in') ? 'var(--green)' : `var(--red)`
                           
                            table.DataTable().row.add([
                                `<img src="${profile}" onerror="this.onerror=null; this.src='src/assets/avatar.png'"/>`,
                                enteredID,
                                `${last}, ${first} ${middle}`,
                                `<span style="font-weight:600">${ date}</span>` + ' ' + time,
                                `<td><span data-isValid="${isValid}">${status}</span></td>`
                            ])
                            .draw();
                            
                          
                        })
                    }


                })
            })

        })


    } else {
        firebase.database().ref(`Attendance/Gate/${date}`).on('value', snap => {
            console.log(snap.val());
            snap.forEach(entered => {
                console.log(entered.val());


                Object.keys(entered).reverse();
                if (entered.child('EnteredID').val().includes('STUD')) {

                    firebase.database().ref(`Data/Student/Information/${entered.child('EnteredID').val()}`).once('value', data => {
                        table.DataTable().row.add([
                                `<img src="${data.child('Profile').val()}" onerror="this.onerror=null; this.src='src/assets/avatar.png'"/>`,
                                entered.child('EnteredID').val(),
                                `${data.child('Name').child('Last').val()}, ${data.child('Name').child('First').val()} ${data.child('Name').child('Middle').val()}`,
                                `<span style="font-weight:600">${ entered.child('Date').val()}</span>` + ' ' + entered.child('Time').val(),
                                `<td><span data-isValid="${entered.child('isValid').val()}">${entered.child('Status').val()}</span></td>`
                            ])
                            .draw();
                    });

                } else {
                    firebase.database().ref(`Data/Faculty/Information/${entered.child('EnteredID').val()}`).once('value', data => {
                        table.DataTable().row.add([
                                `<img src="${data.child('Profile').val()}" onerror="this.onerror=null; this.src='src/assets/avatar.png'"/>`,
                                entered.child('EnteredID').val(),
                                `${data.child('Name').child('Last').val()}, ${data.child('Name').child('First').val()} ${data.child('Name').child('Middle').val()}`,
                                `<span style="font-weight:600">${ entered.child('Date').val()}</span>` + ' ' + entered.child('Time').val(),
                                `<td><span class="" data-isValid="${entered.child('isValid').val()}">${entered.child('Status').val()}</span></td>`
                            ])
                            .draw();
                    });
                }

            });
        })
    }

}

$(window).click(function (e) {
    // if (e.target.className.includes('modal')) {
    //     $('.modal').css('display', 'none');
    // }
    // console.log(e.target.className);
});
$(".btn-take-action").click(function (e) {

    $('.modal:eq(0)').css('display', 'block');

});

$(".reported-dates").click(function (e) {

    $('.modal:eq(1)').css('display', 'block');

});

$(".btn-delete").click(function (e) {

    $('.modal:eq(2)').css('display', 'block');

});




$('.modal > div > span, .btn-cancel').click(function () {

    $('.modal').css('display', 'none');

});