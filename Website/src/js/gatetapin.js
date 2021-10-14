var slideIndex = 0;
showSlides();

function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
  setTimeout(showSlides, 10000); // Change image every 2 seconds
}

const timecont =document.getElementById('dateTime');
function time() {
  var d = new Date();
  var s = d.getSeconds();
  var m = d.getMinutes();
  var h = d.getHours();
  timecont.textContent = d.toLocaleString();
}

setInterval(time, 1000);

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});

function ShowSettings(){
    document.getElementById("logout").style.display="block";
    document.getElementById("settings").style.display="block";
}
function HideSettings(){
    document.getElementById("logout").style.display="none";
    document.getElementById("settings").style.display="none";
}

$(document).ready(function () {
  //$('.modal:eq(0)').css('display', 'block');
  document.getElementById("rfid_card").focus();
});

//TRAP FOCUS IN THE INPUT AREA EVEN IF USER CLICK ANYWHERE IN THE BODY
$('#rfid_card').blur(function (event) {
  setTimeout(function () { $("#rfid_card").focus(); }, 20);
});



// READING RFID CARD VALUE
var IDValue = "";

document.getElementById("rfid_card").onchange = function() {
  $('.modal:eq(0)').css('display', 'block');
  IDValue = document.getElementById("rfid_card").value;
  console.log(IDValue);

  if($('.modal').css('display') == 'block'){
    setTimeout(function() {
      $('.modal').css('display', 'none');
    }, 5000); // <-- time in milliseconds
   }

   document.getElementById("rfid_card").value = '';
};