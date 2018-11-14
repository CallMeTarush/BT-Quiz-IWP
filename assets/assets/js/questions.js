
$(document).ready(function () {

  run_clock('clockdiv',deadline);
  var x = document.getElementById("demo");


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);

    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }


  function showPosition(position) {

      window.longitude = position.coords.longitude;
      window.latitude = position.coords.latitude;

      x.innerHTML = "Latitude: " + position.coords.latitude +
      "<br>Longitude: " + position.coords.longitude;
  }
  var currentLocation = window.location;
  if(window.location == "http://localhost:3000/startexam/management")
  {
    document.getElementById('categoryName').innerHTML = "Parallel and Distributed Computing";
  }
  if(window.location == "http://localhost:3000/startexam/design")
  {
    document.getElementById('categoryName').innerHTML = "Operating Systems";
  }
  if(window.location == "http://localhost:3000/startexam/technical")
  {
    document.getElementById('categoryName').innerHTML = "Internet and Web Programming";
  }
  if(window.location == "http://localhost:3000/startexam/advtechnical")
  {
    document.getElementById('categoryName').innerHTML = "Applied Linear Algebra";
  }
  init();

    window.onblur = function () {
     ++left_page;
     if(left_page==1) {
      alert("You have left the page once! This is your first warning. Don't change the page again");
     }
    if(left_page==3) {
       postAnswer();
       window.location = "/dashboard";

     }
   }

});
//Do it. (if you can)



function init() {
  $("#q-no").html("1");
  getImage();
  getQuestionBody();
}

function nextQuestion() {
  incrementValue();
  if(getCounterValue == 11) {
    window.location = "/dashboard";
  }
  document.getElementById("answer").value = "";

  if(getCounterValue() == (questions.length - 1) ) {
    document.getElementById("changeToSubmit").innerHTML = "Submit";
  }
  if(getCounterValue() == questions.length) {
    window.location = "/dashboard";
  }
  $("#q-no").html(getCounterValue() + 1);
  getQuestionBody();
  getImage();
}

function getCounterValue() {
  return(ques_counter);
}

function incrementValue()
{
  ++ques_counter;
}

function getImage()
{

  if(questions[ques_counter].imagePath == undefined) {
    document.getElementById("question_img").style.display= "none";
  }
  else {

    document.getElementById("question_img").style.display= "block";
  document.getElementById("question_img").src= "/images/" + questions[ques_counter].imagePath;
  }
}

function getQuestionBody()
{
  document.getElementById("question_body").innerHTML = questions[ques_counter].body;
}

function postAnswer() {
  var answerobj = new Object();

  answerobj.answer = $('#answer').val();
  answerobj.testId = data.testId;
  answerobj.questionId = questions[ques_counter]._id;
  answerobj.latitude = window.latitude;
  answerobj.longitude = window.longitude;

  $.ajax({

          url: 'http://localhost:3000/answer',

          type: 'POST',

          dataType: 'json',

          data: answerobj,

          success: function (data, textStatus, xhr) {
            console.log("Posted!");
            nextQuestion();
          },
          error: function (xhr, textStatus, errorThrown) {

              console.log('Error in Operation');

          }
  });
}
// 10 minutes from now

var check = 20;
var time_in_minutes = 20;
if(window.location == "http://localhost:3000/startexam/management")
{
  time_in_minutes = 30;
  check = 30;
}
else if(window.location == "http://localhost:3000/startexam/design")
{
  time_in_minutes = 20;
  check = 20;
}
else if(window.location == "http://localhost:3000/startexam/advtechnical")
{
  time_in_minutes = 30;
  check = 30;
}
var current_time = Date.parse(new Date());
var deadline = new Date(current_time + time_in_minutes*60*1000);


function time_remaining(endtime){
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor( (t/1000) % 60 );
  var minutes = Math.floor( (t/1000/60) % 60 );
  var hours = Math.floor( (t/(1000*60*60)) % 24 );
  var days = Math.floor( t/(1000*60*60*24) );
  return {'total':t, 'days':days, 'hours':hours, 'minutes':minutes, 'seconds':seconds};
}
function run_clock(id,endtime){
  var clock = document.getElementById(id);
  function update_clock(){
    var t = time_remaining(endtime);
    clock.innerHTML = t.minutes+' : '+t.seconds;
    if(t.total<=0){
      postAnswer();
      window.location = "/dashboard";
     }
     if(t.minutes > check)
     {
      alert("wrong move buddy");
      window.location = "/login";
     }
     if(t.minutes < 0)
     {
      alert("wrong move buddy");
      window.location = "/login";
     }

  }
  update_clock(); // run function once at first to avoid delay
  var timeinterval = setInterval(update_clock,1000);
}
run_clock('clockdiv',deadline);



//Background
 var lFollowX = 0,
    lFollowY = 0,
    x = 0,
    y = 0,
    friction = 1 / 30;

function moveBackground() {
  x += (lFollowX - x) * friction;
  y += (lFollowY - y) * friction;

  translate = 'translate(' + x + 'px, ' + y + 'px) scale(1.1)';

  $('.bg').css({
    '-webit-transform': translate,
    '-moz-transform': translate,
    'transform': translate
  });

  window.requestAnimationFrame(moveBackground);
}

$(window).on('mousemove click', function(e) {

  var lMouseX = Math.max(-100, Math.min(100, $(window).width() / 2 - e.clientX));
  var lMouseY = Math.max(-100, Math.min(100, $(window).height() / 2 - e.clientY));
  lFollowX = (20 * lMouseX) / 100; // 100 : 12 = lMouxeX : lFollow
  lFollowY = (10 * lMouseY) / 100;

});

moveBackground();

