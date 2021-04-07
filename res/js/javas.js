/*
  var debugInput = document.querySelector("input");
  function updateDebugState() {
      document.body.classList.toggle('debug-on', debugInput.checked);
  }
  debugInput.addEventListener("click", updateDebugState);
  updateDebugState();

*/

  document.getElementById("parallasse").onscroll = function(){

          if ((document.getElementById("parallasse").scrollTop > "236") && (document.getElementById("parallasse").scrollTop < "1612")) {

              document.getElementById("navigation").style.top = "-35px";

          } else if (document.getElementById("parallasse").scrollTop < "236"){
              document.getElementById("navigation").style.top = "0px";

          }
          if(document.getElementById("parallasse").scrollTop > "1200"){
            document.getElementById("navigation").style.top = "-70px";
          }
      }


  const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
  const toggleSwitchb = document.querySelector('.theme-switchb input[type="checkbox"]');


  function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById("darkmode").innerHTML = "Disable_Dark_Mode"
        document.getElementById("darkmode2").innerHTML = "Disable_Dark_Mode"
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
        document.getElementById("darkmode").innerHTML = "Enable_Dark_Mode"
        document.getElementById("darkmode2").innerHTML = "Enable_Dark_Mode"
    }
  }

  $("elem1").scroll(function() {
    var $height = $(window).scrollTop();
    if($height > 50) {
      alert("ciao");
    } else {
      alert("funziono");
    }
  });

    toggleSwitch.addEventListener('change', switchTheme, false);

    toggleSwitchb.addEventListener('change', switchTheme, false);
