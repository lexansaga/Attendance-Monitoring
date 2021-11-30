$(document).ready(function () {
    $('#logs_table').DataTable({
        dom: 'Bfrtip',
        buttons: [
            'excel', 'pdf', 'print'
        ],
        scrollX: true
    });



    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            let uid = user.uid;
            console.log("current login: " + uid);

            firebase.database().ref('User/' + uid).on('value', snap => {
                let Account_Type = snap.child('Account_Type').val();
                let ID = snap.child('ID').val();
                let Role = snap.child('Role').val();
                let Status = snap.child('Status').val()
                let Location = snap.child('Location').val()



                firebase.database().ref('Attendance/Gate/').on('value', dates => {

                    dates.forEach(date => {
                        let d = date.key

                        firebase.database().ref(`Attendance/Gate/${d}`).orderByChild('Location').startAt(Location).endAt(Location).on(`value`, attendances => {
                            attendances.forEach(attendance => {


                                let enteredID = attendance.child('EnteredID').val()
                                let type = attendance.child('EnteredID').val().includes('STUD') ? 'Student' : 'Professor'

                                let date = attendance.child('Date').val()
                                let time = attendance.child('Time').val()

                                let location = attendance.child('Location').val()

                                let action = attendance.child('Status').val().includes(`IN`) ? 'Tap In' : 'Tap Out'

                                if (type.includes('Student')) {

                                    firebase.database().ref(`Data/Student/Information/${enteredID}/`).once('value', student => {
                                        console.log(student.val())
                                        let first = student.child('Name').child('First').val()
                                        let middle = student.child('Name').child('Middle').val()
                                        let last = student.child('Name').child('Last').val()



                                        let pfp = student.child('Profile').val()



                                        $(`#logs_table`).DataTable().row.add([
                                            `<img src="${pfp}" onerror="this.onerror=null; this.src='src/assets/avatar.png'" />`,
                                            `${last}, ${first} ${middle}`,
                                            enteredID,
                                            type,
                                            `${date} ${time}`,
                                            location,
                                            action
                                        ]).draw()
                                    })
                                } else {

                                    firebase.database().ref(`Data/Faculty/Information/${enteredID}/`).once('value', faculty => {

                                        let first = faculty.child('Name').child('First').val()
                                        let middle = faculty.child('Name').child('Middle').val()
                                        let last = faculty.child('Name').child('Last').val()

                                        let pfp = faculty.child('Profile').val()



                                        $(`#logs_table`).DataTable().row.add([
                                            `<img src="${pfp}" onerror="this.onerror=null; this.src='src/assets/avatar.png'" />`,
                                            `${last}, ${first} ${middle}`,
                                            enteredID,
                                            type,
                                            `${date} ${time}`,
                                            location,
                                            action
                                        ]).draw()
                                    })
                                }


                            })
                        })

                    });

                })



            });
        } else {

        }
    });
});