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
        "info": true
    }).order([2, 'desc']);



    console.log(date);


    firebase.database().ref(`Attendance/Gate/${date}`).on('value', snap => {
        table.DataTable().clear().draw()
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

            // if(entered.child('isValid').val().toString().includes('true'))
            // {
            //     $('span[data-isValid="true"]').parent().css(
            //         {
            //             "background-color":"var(--green)"
            //         });
            // }
            // else
            // {
            //     $('span[data-isValid="true"]').parent().css(
            //         {
            //             "background-color":"var(--green)"
            //         });
            // }

        });
    })


});

var datefrom = $('#datefrom');
var dateto = $('#dateto');

datefrom.change(function () {
    if (datefrom.val() != '') {
        dateto.prop('disabled', false);
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

        table.DataTable().clear().draw();
        firebase.database().ref(`Attendance/Gate/${date}`).on('value', snap => {

            //console.log(snap.val());


            //console.log(snap.val());
            snap.forEach(entered => {
                //  console.log(entered.val());


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



        var newDate = start.setDate(start.getDate() + 1);
        start = new Date(newDate);
    }
    $('.modal').css('display', 'none');

});



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