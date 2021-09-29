$(document).ready(function () {

    var META_DATA = JSON.parse(localStorage.getItem('META_DATA'))[0];
    console.log(META_DATA)
    console.log(META_DATA.Name)
    $('.profile img').attr('src', META_DATA.Profile);
    $('.profile-information h1').html(META_DATA.Name[0] + ',' + META_DATA.Name[1]);
    $('.profile-information p').html( META_DATA.UserID);

    $('#datatable tbody').append('<tr>' +
    '<td>Role</td>' +
    '<td>' + META_DATA.Role + '</td>' +
    '</tr>');

    $('#datatable tbody').append('<tr>' +
    '<td>Full Name</td>' +
    '<td>' + META_DATA.Name[0] +
    ',' + META_DATA.Name[1] +
    ' ' + META_DATA.Name[2] + '</td>' +
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
        '<td>' + META_DATA.Contact + '</td>' +
        '</tr>');


})