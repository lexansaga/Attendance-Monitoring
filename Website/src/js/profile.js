$(document).ready(function () {

    var META_DATA = JSON.parse(sessionStorage.getItem('META_DATA'))[0];
    console.log(META_DATA)
    console.log(META_DATA.Name)
    $('.profile img').attr('src', META_DATA.Profile);
    $('.profile-information h1').html(META_DATA.Name[0] + ',' + META_DATA.Name[1]);


    $('#datatable tbody').append('<tr>' +
        '<td>ID Number</td>' +
        '<td>' + META_DATA.UserID + '</td>' +
        '</tr>');

    $('#datatable tbody').append('<tr>' +
        '<td>Full Name</td>' +
        '<td>' + META_DATA.Name[0] +
        ',' + META_DATA.Name[1] +
        ' ' + META_DATA.Name[1] + '</td>' +
        '</tr>');

    $('#datatable tbody').append('<tr>' +
        '<td>Name</td>' +
        '<td>' + META_DATA.UserID + '</td>' +
        '</tr>');

    $('#datatable tbody').append('<tr>' +
        '<td>Account Type</td>' +
        '<td>' + META_DATA.Account_Type + '</td>' +
        '</tr>');


    $('#datatable tbody').append('<tr>' +
        '<td>Address</td>' +
        '<td>' + META_DATA.Address + '</td>' +
        '</tr>');

    $('#datatable tbody').append('<tr>' +
        '<td>Contact Number</td>' +
        '<td>' + META_DATA.Department + '</td>' +
        '</tr>');


})