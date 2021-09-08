$(window).click(function (e) {
    if (e.target.className.includes('modal')) {
        $('.modal').css('display', 'none');
    }
    console.log(e.target.className);
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