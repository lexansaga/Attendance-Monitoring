$(document).ready(function () {

    var url = new URL(window.location.href);
  
    console.log(url.searchParams.get('id'));


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

    $('#input-search').focusin(function () {
        $('.search-menu').css({
            "opacity": "1",
            "display": "block"
        }).animate();
    });
    $('#input-search').focusout(function () {
        $('.search-menu').css({
            "opacity": "0",
            "display": "none"
        }).animate();
    });


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



var sidebarlinks = $('.nav-links > li');
sidebarlinks.css('display', 'none');
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        let uid = user.uid;
        console.log("current login: " + uid);
        firebase.database().ref('User/' + uid).on('value', snap => {
            let Account_Type = snap.child('Account_Type').val();
            let ID = snap.child('ID').val();
            let Role = snap.child('Role').val();
            let User = snap.child('UserID').val();
        
            // console.log(snap.val());
            // console.log('Account_Type:'+Account_Type);
            // console.log('ID:'+ID);
             console.log('Role:'+Role);
            // console.log('UserID:'+User);
            if (Role.includes('Administrator')) {
                // User is Admin 
                sidebarlinks.eq(0).css({
                    'display': ''
                }) //Home
                sidebarlinks.eq(1).css('display', '') //Schedule
                sidebarlinks.eq(3).css('display', '') // Attendance Report
                sidebarlinks.eq(5).css('display', '') // User Management
                sidebarlinks.eq(6).css('display', '') // User Management


            } else if (Role.includes('Guidance')) {
                // User is Guidance 
                sidebarlinks.eq(0).css({
                    'display': ''
                }) //Home
                sidebarlinks.eq(1).css('display', '') //Schedule
                sidebarlinks.eq(3).css('display', '') // Attendance Report
                sidebarlinks.eq(2).css('display', '') // Attendance

            } else {

                sidebarlinks.eq(0).css({
                    'display': ''
                }) //Home
                sidebarlinks.eq(1).css('display', '') //Schedule
                sidebarlinks.eq(3).css('display', '') // Attendance Report
                sidebarlinks.eq(4).css('display', '') // Reported

                // User is Faculty
            }
            firebase.database().ref('Data/Faculty/Information/' + User).on('value', uidsnap => {
                //    console.log(uidsnap.val());
                let profile = uidsnap.child('Profile').val();
                let name = [];
                uidsnap.child("Name").forEach(names =>
                    {
                        name.push(names);
                    });
                //    console.log('Profile:' + profile);
                //    console.log('Name:' + name);
                $('.profile-picture > img').attr('src', profile);

            });
        });
        // ...
    } else {
        // User is signed out
        // ...

    }
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


function Logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        // An error happened.
        console.log(error.errorCode + '' + error.errorMessage);
    });
}