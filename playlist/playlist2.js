let elements = {
  darkTheme: document.getElementById("darkTheme"),
};

async function refreshData() {
  darkTheme = elements.darkTheme.checked ?? true;
} //refreshdata

function saveSettings() {
  refreshData();
  localStorage.setItem("darkTheme", darkTheme);
} //saveSettings

function load_localStorage() {} //load_localStorage

function switchTheme(checkbox) {
  document.documentElement.setAttribute("data-bs-theme", checkbox ? "dark" : "light");
  document.getElementById("twitchLogo").style.filter = `invert(${checkbox ? 0.25 : 0.65})`;
} //switchTheme

window.onload = function () {
  darkTheme = (localStorage.getItem("darkTheme") || "true") === "true";
  elements.darkTheme.checked = darkTheme ?? true;
  switchTheme(elements.darkTheme.checked);

  elements.darkTheme.onchange = function () {
    switchTheme(this.checked);
    saveSettings();
  };

  enableTooltips();
}; //onload
