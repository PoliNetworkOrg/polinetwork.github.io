/*
  var debugInput = document.querySelector("input");
  function updateDebugState() {
      document.body.classList.toggle('debug-on', debugInput.checked);
  }
  debugInput.addEventListener("click", updateDebugState);
  updateDebugState();

*/

const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const toggleSwitchb = document.querySelector('.theme-switchb input[type="checkbox"]');

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById("darkmode").innerHTML = "Disattiva&nbspTema&nbspScuro"
        document.getElementById("darkmode2").innerHTML = "Disattiva&nbspTema&nbspScuro"
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
        document.getElementById("darkmode").innerHTML = "Attiva&nbspTema&nbspScuro"
        document.getElementById("darkmode2").innerHTML = "Attiva&nbspTema&nbspScuro"
    }
}

toggleSwitch.addEventListener('change', switchTheme, false);
toggleSwitchb.addEventListener('change', switchTheme, false);
