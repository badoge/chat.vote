<script>
  let { data } = $props();
  let channel = $state(data.slug.toLowerCase().replace(/\s/g, ""));

  let elements = {
    darkTheme: document.getElementById("darkTheme"),
    toastContainer: document.getElementById("toastContainer"),
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

  function copyCommand(command) {
    navigator.clipboard.writeText(command);
    showToast("Command copied :)", "info", 1000);
  } //copyLink

  function openLink(event, link) {
    if (event.button < 2) {
      window.open(link, "_blank").focus();
    }
  } //openLink

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
</script>

<style>
  #playlistCard,
  #settingsCard {
    max-height: 85vh;
  }

  #playlistCard > .card-body,
  #settingsCard > .card-body {
    overflow: auto;
  }

  .request-title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
    word-break: break-all;
  }

  .requested-by {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
  }

  .role-badge {
    height: 24px;
    width: 24px;
    vertical-align: bottom;
  }

  .duration-label {
    position: absolute;
    right: 4px;
    bottom: 2px;
    font-weight: 500;
  }

  .request-thumbnail > img {
    max-height: 90px;
  }
  .request-thumbnail {
    width: min-content;
  }

  .thumbnail-div {
    position: relative;
    height: min-content;
  }

  #toastContainer {
    position: fixed;
    bottom: 10px;
    left: 10px;
    z-index: 1056;
    font-weight: bold;
  }

  #toastContainer > div > div {
    font-size: 1.5em;
  }
</style>
