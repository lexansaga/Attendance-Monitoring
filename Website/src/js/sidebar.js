$(document).ready(function () {


    SideBarResponsive();
    $("#btn_menu").click(function (e) {
        e.stopPropagation();
        SideBarResponsive();
        var navbar = $(".s-navbar");
        navbar.css("left", "-270");
        // navbar.addClass("show-menu").show();
        navbar.css("display", "block");
        var pointLeft;
        // if (navbar.hasClass("show-menu")) {

        if (navbar.css("display") == "block") {
            pointLeft = 0;


        } else {
            pointLeft = -270;


        }

        navbar.css("display", "block").animate({
            left: pointLeft
        }, {
            duration: 600,
            queue: false
        });
        ToggleNavbar(e, pointLeft);
    });


    if (performance.navigation.type == 2) {
        alert("Back button clicked");
    }


/*
    $(".profile-picture").click(function (e) {
         
        e.stopPropagation();
        var opacity;
        var menu = $('.profile-menu');
        menu.css("opacity", 0);
        if (menu.hasClass("show-menu")) {
            //      alert("Has menu");
            opacity = 0;
            menu.removeClass("show-menu").animate({
                opacity: opacity / 10
            }, {
                duration: 600,
                queue: false
            });


        } else {
            // alert("No menu");
            opacity = 10;
            menu.css("top", $(".header").height()).show();
            menu.addClass("show-menu").animate({
                opacity: opacity / 10
            }, {
                duration: 600,
                queue: false
            });
        }

        ToggleProfile(e, opacity);

    });

*/


    MediaQuery();
    OnLoadMediaQuery();
    // DashBoardResponsive();
    Chart.defaults.global.defaultFontFamily = "Karla";

});



function ToggleNavbar(event, point) {
    $('body,html').click(function (e) {
        e.stopImmediatePropagation();
        var container = $(".s-navbar");
        //  alert(!menu.is(e.target));
        if (!container.is(e.target) &&
            container.has(e.target).length === 0 &&
            container.css("display") == "block") {

            container.animate({
                left: -270
            }, {
                duration: 500,
                queue: false
            });
            $('body,html').unbind();
        }


    });

}

function ToggleProfile(event, opacity) {
    $('body,html').click(function (e) {
      
        e.stopImmediatePropagation();
        var menu = $('.profile-menu');
        //  alert(!menu.is(e.target));
        if (!menu.is(e.target) &&
            menu.has(e.target).length === 0 &&
            menu.has("show-menu")) {

           

            menu.removeClass("show-menu").animate();
        }
        $('body,html').unbind();

    });
}


function SideBarResponsive() {
    var maincontent = $('.main_content');
    var navbar = $('.s-navbar');
    //alert(navbar.css("left") == "-270px");
    if (navbar.css("display") == 'none' || navbar.css("left") == "-270px") {
        marginLeft = 0;
        $('#btn_menu').css("visibility", "visible");
    } else {
        marginLeft = navbar.width();
        $('#btn_menu').css("visibility", "hidden");
    }
    maincontent.css("margin-left", marginLeft);
}

function OnLoadMediaQuery() {
    var width = $(window).width();
    var height = $(window).height();
    if (width > 768) {
        // alert("Desktop");


    } else if (width < 768 && width > 425) {
        //  alert("Tablet");



    } else if (width < 425) {
        //   alert("Mobile");


    }

}

function MediaQuery() {
    $(window).on('resize', function (e) {
        var width = $(window).width();
        var height = $(window).height();

        if (width > 768) {
            // alert("Desktop");

            $('body,html').unbind();
            $('.s-navbar').css("left", "0").animate();
            $('.profile-menu').css("top", $(".header").height()).animate();
        } else if (width < 768 && width > 425) {
            ToggleNavbar(e, -270);

            //  alert("Tablet");
            $('.s-navbar').css("left", "-270").animate();
        } else if (width < 425) {

            //   alert("Mobile");
        }
        SideBarResponsive();
    });
}