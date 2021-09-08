function Login()
{
    var username = $('#username').val();
    var password = $('#password').val();
    for (const [key, value] of Object.entries(Firebase.Database.GET("User"))) {
        if(value.Username == username && value.Password ==  password)
        {
            console.log("Login Success");
            window.location.href = 'main.html?userid=01';
        }
        else
        {
            console.log("Login Failed");
        }
     
      }
}