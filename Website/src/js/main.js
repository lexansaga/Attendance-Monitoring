$(document).ready(function () {


    // alert("loaded");
    // DashBoardResponsive();
    sOnLoadMediaQuery();
    sMediaQuery();
    Chart.defaults.global.defaultFontFamily = "Karla";
    PieChart();
    LineChart();

    $(".professor").click(function () {
        window.location = "../../entered.html"
    });



    var list = [];

    firebase.database().ref("Attendance/Gate").on("value", snap => {
        $('.d-items:nth-child(2) > h1').html(snap.numChildren()); // For Total Students
    });

    firebase.database().ref("Attendance/Student/2021-01-01").orderByChild('Attendance_Status').equalTo('Present').on("value", snap => {


        $('.d-items:nth-child(3) > h1').html(snap.numChildren()); // For Count of Present Students
        list.push({
            "Present": snap.numChildren()
        });
    });

    firebase.database().ref("Attendance/Student/2021-01-01").orderByChild('Attendance_Status').equalTo('Absent').on("value", snap => {


        $('.d-items:nth-child(4) > h1').html(snap.numChildren()); // For Count of Absent Students
    });

    firebase.database().ref("Attendance/Student/2021-01-01").orderByChild('Attendance_Status').equalTo('Late').on("value", snap => {


        $('.d-items:nth-child(5) > h1').html(snap.numChildren()); // For Count of Late Students
    });



    // console.log(list.Present);





    firebase.database().ref("Attendance/Gate/2021-01-01").orderByKey().limitToLast(5).on("value", snap => {
        snap.forEach(childSnapshot => {
            // console.log(childSnapshot.child("EnteredID").val());
            let dataPath = "";
            if (childSnapshot.child("EnteredID").val().includes('STUD')) {
                dataPath = "Data/Student/Information";
            } else {
                dataPath = "Data/Professor/Information";
            }
            //    console.log(dataPath + "/" + childSnapshot.child("EnteredID").val());
            Object.keys(childSnapshot).reverse();
            firebase.database().ref(dataPath + "/" + childSnapshot.child("EnteredID").val()).on("value", profilesnap => {
              
                //       console.log(profilesnap.val())


                if (profilesnap.val() != null) {
                    //    console.log(profilesnap.child("Name").val());
                    let profName = profilesnap.child("Name").val().split('&&')
                    let image = profilesnap.child("Profile").val().toString().includes('firebasestorage') ?
                        profilesnap.child("Profile").val().toString() : 'src/assets/avatar.png'

                    //       console.log(image);
                    $('.prof_container > ul ').prepend(
                        " <li>" +
                        "<a id=\"prof_link\" href=\"#\">" +
                        "<img id=\"ic_prof\" src=\"" + image + "\" />" +
                        "<h2>" + profName[0] + "," + profName[1] + " " + profName[2].toString().substr(0, 1).toUpperCase() + "." +
                        "</h2>" +
                        "   <h3>Faculty</h3>" +
                        "  </a>" +
                        "  </li>"
                    ).css("opacity", "0").animate({
                        opacity: '1'
                    });
                } else {

                }
            });
        });
    });


    $('.d-item-main').click(function()
    {
        window.location.href = 'profile.html';
    });
   


    
});

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        var META_DATA = [];
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        let uid = user.uid;
        firebase.database().ref('User/' + uid).on('value', snap => {
            let Account_Type = snap.child('Account_Type').val();
            let ID = snap.child('ID').val();
            let Role = snap.child('Role').val();
            let UserID = snap.child('UserID').val();
            let Notification = snap.child('Notification').val();

            console.log(Notification);
            // console.log(snap.val());
            // console.log('Account_Type:'+Account_Type);
            // console.log('ID:'+ID);
            // console.log('Role:'+Role);
            // console.log('UserID:'+User);
            firebase.database().ref('Data/Professor/Information/' + UserID).on('value', uidsnap => 
            {
                console.log(uidsnap.val());
                let profile = uidsnap.child('Profile').val();
                let name = uidsnap.child('Name').val().split('&&');
                let address = uidsnap.child('Address').val();
                let department = uidsnap.child('Department').val();
            //    console.log('Profile:'+profile);
            //    console.log('Name:'+name);
                $('#d-profile').attr('src',profile);
                $('#d-name').html(name[1]+ " " + name[0] );
                $('#d-pos').html(Role);

                META_DATA.push(
                    {
                        UID: uid,
                        Account_Type: Account_Type,
                        ID : ID,
                        Role : Role,
                        UserID : UserID,
                        Profile : profile,
                        Name:name,  
                        Address:address,
                        Department:department,
                        Notification:Notification            
                    });

                    sessionStorage.setItem("META_DATA",JSON.stringify(META_DATA));
            });
        });
        // ...
    } else {
        // User is signed out
        // ...

    }

    console.log(JSON.parse(sessionStorage.getItem('META_DATA')))
});

function AutoUpdate() {



}

function sOnLoadMediaQuery() {
    //  alert("sOnload");
    var width = $(window).width();
    var height = $(window).height();
    if (width > 768) {
        // alert("Desktop");


    } else if (width < 768 && width > 425) {
        //  alert("Tablet");
        ChartSizes();
        //   DashBoardResponsive();


    } else if (width < 425) {
        //   alert("Mobile");
        ChartSizes();
        //  DashBoardResponsive();

    }

}

function sMediaQuery() {
    // alert("sMediaQuery");
    $(window).on('resize', function (e) {
        var width = $(window).width();
        var height = $(window).height();

        if (width > 768) {
            // alert("Desktop");


        } else if (width < 768 && width > 425) {
            ChartSizes();

            //  alert("Tablet");
        } else if (width < 425) {
            ChartSizes();
            //   alert("Mobile");
        }
    });
}



function ChartSizes() {
    // alert("called");
    var prof = $('.professor').width();
    $('.pie-chart').css("width", prof);
    $('.line-chart').css("width", prof);
}



function PieChart() {
    //   alert("Pie Chart Loaded");
    var xValues = ["Absent", "Present", "Late"];
    var yValues = [Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100)
    ];
    var barColors = [
        "#8A98F5",
        "#617EAB",
        "#C7DDFF"
    ];

    new Chart("pieChart", {
        type: "pie",
        data: {
            labels: xValues,
            datasets: [{
                backgroundColor: barColors,
                data: yValues
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            legend: {
                position: 'bottom',
                display: true,
                font: {
                    family: "'Karla', sans-serif"
                },
                labels: {
                    usePointStyle: true
                }
            }
        }
    });
}

function LineChart() {
    //   alert("Line Chart Loaded");
    var xValues = ["Day 1", 200, 300, 400, 500, 600, 700, 800, 900, 1000];

    new Chart("lineChart", {
        type: "line",
        data: {
            labels: xValues,
            datasets: [{
                label: 'Absent',
                data: [Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000)
                ],
                borderWidth: 1,
                borderColor: "#59BAF3",
                backgroundColor: 'rgba(89, 186, 243,0.2)',
                fill: true
            }, {
                label: 'Present',
                data: [Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000)
                ],
                borderWidth: 1,
                borderColor: "#68CF71",
                backgroundColor: "rgba(104, 207, 113,0.2)",
                fill: true
            }, {
                label: 'Late',
                data: [Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000),
                    Math.floor(Math.random() * 8000)
                ],
                borderWidth: 1,
                borderColor: "#F2828A",
                backgroundColor: "rgba(242, 130, 138,0.2)",
                fill: true
            }],
            borderWidth: 1
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            legend: {
                position: 'bottom',
                display: true,
                font: {
                    family: "'Karla', sans-serif"
                },
                labels: {
                    usePointStyle: true
                }
            }

        }
    });
}