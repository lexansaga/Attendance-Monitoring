$(document).ready(function () {




    firebase.auth().onAuthStateChanged((user) => {
        if (user) {

            let uid = user.uid;

            firebase.database().ref('User/' + uid).on('value', snap => {
                if (snap != null) {
                    $('#datatable tbody').html(' ');
                }
                let Account_Type = snap.child('Account_Type').val();
                let ID = snap.child('ID').val();
                let Role = snap.child('Role').val();
                let UserID = snap.child('UserID').val();
                let Notification = snap.child('Notification').val();

                firebase.database().ref('Data/Faculty/Information/' + UserID).on('value', uidsnap => {
                    //   console.log(uidsnap.val());
                    let profile = uidsnap.child('Profile').val();
                    // let name = uidsnap.child('Name').val().split('&&');
                    let name = [];
                    let address = uidsnap.child('Address').val();
                    let department = uidsnap.child('Department').val();
                    let contact = uidsnap.child('Contact').val();

                    let permission = uidsnap.child('Permission')
                    //    console.log('Profile:'+profile);
                    //    console.log('Name:'+name);
                    //    console.log("Debug:");
                    uidsnap.child('Name').forEach(names => {
                        name.push(names.val());
                    });
                    console.log(name[0]);

                    $('#d-profile').attr('src', profile);
                    $('#d-name').html(name[1] + ", " + name[0]);
                    $('#d-pos').html(Account_Type);



                    $('.profile img').attr('src', profile);
                    $('.profile-information h1').html(name[1] + ", " + name[0]);
                    $('.profile-information p').html(UserID);

                    $('#datatable tbody').append('<tr>' +
                        '<td>Account Type</td>' +
                        '<td>' + Account_Type + '</td>' +
                        '</tr>');

                    $('#datatable tbody').append('<tr>' +
                        '<td>Full Name</td>' +
                        '<td>' + name[1] +
                        ',' + name[0] +
                        ' ' + name[2] + '</td>' +
                        '</tr>');



                    $('#datatable tbody').append('<tr>' +
                        '<td>Address</td>' +
                        '<td>' + address + '</td>' +
                        '</tr>');

                    $('#datatable tbody').append('<tr>' +
                        '<td>Contact Number</td>' +
                        '<td>' + contact + '</td>' +
                        '</tr>');


                    permission.forEach(perm => {
                        console.log(perm.val())
                        let tapin  = perm.key.includes('TapIn_First') ? 'Tap in first' : 'Tap in first'
                        let isCheck = perm.val() == true ? 'checked' : ''
                        $('.permission').append(` <label class="container">${tapin}
                            <input type="checkbox" ${isCheck} disabled>
                            <span class="checkmark"></span>
                         </label>`)
                    })

                });
            });
        } else {


        }
    });

})