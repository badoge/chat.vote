<script>
    let settingsModal, loginExpiredModal;
let myChart;
let viewCountArray = [];
let viewCountLabelsArray = [];
let targetCount = 1;
let chartWidth = 20;
let updateRate = 5;
let channel;
let updateOnChange = true;

let elements = {
  settingsModal: document.getElementById("settingsModal"),
  loginExpiredModal: document.getElementById("loginExpiredModal"),
  ctx: document.getElementById("myChart").getContext("2d"),
  toastContainer: document.getElementById("toastContainer"),
  overlay: document.getElementById("overlay"),
  overlayBody: document.getElementById("overlayBody"),

  targetCount: document.getElementById("targetCount"),
  chartWidth: document.getElementById("chartWidth"),
  updateRate: document.getElementById("updateRate"),
  updateOnChange: document.getElementById("updateOnChange"),
  recoveryDelay: document.getElementById("recoveryDelay"),
  showViewcount: document.getElementById("showViewcount"),
  autoColor: document.getElementById("autoColor"),
  lineColor: document.getElementById("lineColor"),
  fillColor: document.getElementById("fillColor"),
  backgroundColor: document.getElementById("backgroundColor"),
  transparentBG: document.getElementById("transparentBG"),
  noFill: document.getElementById("noFill"),

  serverIP: document.getElementById("serverIP"),
  serverPort: document.getElementById("serverPort"),
  serverPassword: document.getElementById("serverPassword"),
  connectOBS: document.getElementById("connectOBS"),
  stopDelay: document.getElementById("stopDelay"),
};

let USER = {
  channel: "",
  twitchLogin: false,
  access_token: "",
  userID: "",
};

function load_localStorage() {
  if (!localStorage.getItem("USER")) {
    console.log("localStorage user info not found");
  } else {
    USER = JSON.parse(localStorage.getItem("USER"));
  }
} //load_localStorage

function refreshData() {
  if (!USER.twitchLogin) {
    console.log("no twitch login");
  }
} //refreshdata

function saveSettings() {
  refreshData();
  localStorage.setItem("USER", JSON.stringify(USER));
  localStorage.setItem("CHATVOTE", JSON.stringify(CHATVOTE));
} //saveSettings

let oldCount = 0;

async function getViewCount() {
  let requestOptions = {
    headers: { Authorization: `Bearer ${USER.access_token}`, "Client-Id": CLIENT_ID },
  };

  try {
    let response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${channel}`, requestOptions);
    if (!response.ok) {
      console.log("getViewCount error");
    }
    let result = await response.json();
    if (!result.data[0]) {
      showToast("Channel not live", "danger", 5000);
      return;
    }
    if (oldCount != result.data[0].viewer_count || !updateOnChange) {
      oldCount = result.data[0].viewer_count;
      viewCountArray.push(result.data[0].viewer_count);

      elements.overlayBody.innerText = result.data[0].viewer_count.toLocaleString();

      if (result.data[0].viewer_count > targetCount) {
        elements.overlay.classList = "display-1 card text-bg-success";
      } else {
        elements.overlay.classList = "display-1 card text-bg-danger";
        elements.overlayBody.innerText = `${result.data[0].viewer_count.toLocaleString()}/${targetCount.toLocaleString()}`;
      }
      let time = new Date();
      viewCountLabelsArray.push(`${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`);
      if (viewCountArray.length == 1) {
        viewCountArray.push(result.data[0].viewer_count);
        viewCountLabelsArray.push(`${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`);
      }
      myChart.update();
      while (viewCountArray.length > chartWidth) {
        viewCountArray.shift();
        viewCountLabelsArray.shift();
      }
    }
  } catch (error) {
    console.log("getViewCount error", error);
  }
  setTimeout(() => {
    getViewCount();
  }, updateRate * 1000);
}

async function loadAndConnect() {
  load_localStorage();
  refreshData();
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  channel = params.channel || USER.channel;

  if (USER.twitchLogin && !(await checkToken(USER.access_token))) {
    USER.channel = "";
    loginExpiredModal.show();
    return;
  }

  if (USER.channel) {
    getViewCount();
  }
} //loadAndConnect

function loadChart() {
  refreshData();
  if (myChart) {
    myChart.destroy();
  }
  myChart = new Chart(elements.ctx, {
    type: "line",
    data: {
      labels: viewCountLabelsArray,
      datasets: [
        {
          label: "dank",
          data: viewCountArray,
          borderColor: "#def33f",
          backgroundColor: "#000000",
          borderWidth: 2,
          tension: 0.1,
          fill: true,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
} //loadChart

window.onload = function () {
  settingsModal = new bootstrap.Modal(elements.settingsModal);
  loginExpiredModal = new bootstrap.Modal(elements.loginExpiredModal);
  loadAndConnect();
  if (!USER.channel) {
    loginExpiredModal.show();
  }
  loadChart();

  enableTooltips();
  enablePopovers();

  elements.targetCount.oninput = function () {
    targetCount = parseInt(this.value, 10);
  };
  elements.chartWidth.oninput = function () {
    chartWidth = parseInt(this.value, 10);
  };
  elements.updateRate.oninput = function () {
    updateRate = parseInt(this.value, 10);
  };
  elements.updateOnChange.onchange = function () {
    updateOnChange = this.checked;
  };
  elements.lineColor.oninput = function () {
    myChart.data.datasets[0].borderColor = this.value;
    myChart.update();
  };
  elements.fillColor.oninput = function () {
    elements.noFill.checked = false;
    myChart.data.datasets[0].backgroundColor = this.value;
    myChart.update();
  };
  elements.backgroundColor.oninput = function () {
    elements.transparentBG.checked = false;
    document.body.style.backgroundColor = this.value;
  };
  elements.transparentBG.onchange = function () {
    if (this.checked) {
      document.body.style.backgroundColor = "transparent";
    } else {
      document.body.style.backgroundColor = elements.backgroundColor.value;
    }
  };
  elements.noFill.onchange = function () {
    if (this.checked) {
      myChart.data.datasets[0].backgroundColor = "transparent";
    } else {
      myChart.data.datasets[0].backgroundColor = elements.fillColor.value;
    }
    myChart.update();
  };

  elements.autoColor.onchange = function () {
    console.log("autoColor");
  };
  elements.showViewcount.onchange = function () {
    if (this.checked) {
      elements.overlay.style.display = "block";
    } else {
      elements.overlay.style.display = "none";
    }
  };

  elements.connectOBS.addEventListener("click", function () {
    console.log("connectOBS");
  });
}; //onload

// window.onbeforeunload = function () {
//   return "dank";
// }; //onbeforeunload

</script>


<svelte:head>
  <title>chat.vote/viewers</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="view count graph" />
  <meta name="keywords" content="twitch, chat, poll, chatvote, chat.vote" />
  <meta property="og:title" content="chat.vote/viewers" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chat.vote/viewers/" />
  <meta property="og:image" content="https://chat.vote/pics/ogimage.png" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:description" content="view count graph" />
</svelte:head>

<div class="modal fade" id="settingsModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Settings</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>nothing here :)</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-success" data-bs-dismiss="modal" id="saveSettings">Save</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="loginExpiredModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Not logged in / Login expired</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">You need to go the <a href="/" target="_blank" rel="noopener noreferrer">main page</a> and <b>login using Twitch</b> to use this page.</div>
    </div>
  </div>
</div>

<div id="overlay" class="display-1 card text-bg-primary">
  <div id="overlayBody" class="card-body">dank</div>
</div>

<canvas id="myChart"></canvas>

<div aria-live="polite" aria-atomic="true" class="position-relative">
  <div id="toastContainer" class="toast-container"></div>
</div>

<button id="openOffcanvasbtn" title="Settings" class="btn btn-warning" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvas" aria-controls="offcanvas">
  <i class="material-icons notranslate">settings</i> Settings<i class="material-icons notranslate">arrow_forward_ios</i>
</button>

<div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvas" data-bs-backdrop="false" aria-labelledby="offcanvasLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasLabel"><i class="material-icons notranslate">settings</i> Settings</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <div class="mb-3">
      <label for="targetCount" class="form-label">Target view count</label>
      <input type="number" class="form-control" value="1" min="1" id="targetCount" aria-describedby="targetCountDesc" />
      <div id="targetCountDesc" class="form-text">dank</div>
    </div>

    <div class="mb-3">
      <label for="chartWidth" class="form-label">Chart width</label>
      <input type="number" class="form-control" min="5" value="20" max="1000" id="chartWidth" aria-describedby="chartWidthDesc" />
      <div id="chartWidthDesc" class="form-text">How many data points to show at once. Oldest data will get removed and chart will start scrolling to the left to add new data</div>
    </div>

    <div class="mb-3">
      <label for="updateRate" class="form-label">Update rate (seconds)</label>
      <input type="number" class="form-control" min="1" value="5" max="60" id="updateRate" aria-describedby="updateRateDesc" />
      <div id="updateRateDesc" class="form-text">How often should the site update the view count. Twitch does not update the view count often, it can stay the same for up to 2 minutes</div>
    </div>
    <div class="form-check form-switch mb-3">
      <input class="form-check-input" type="checkbox" role="switch" id="updateOnChange" checked />
      <label class="form-check-label" for="updateOnChange">Update chart when view count changes only</label>
      <div class="form-text">dank</div>
    </div>

    <div class="mb-3">
      <label for="recoveryDelay" class="form-label">View count recovery wait time (seconds)</label>
      <input disabled type="number" class="form-control" min="0" value="0" max="600" id="recoveryDelay" aria-describedby="recoveryDelayDesc" />
      <div id="recoveryDelayDesc" class="form-text">How long should the site wait for the view count to go back over the target before ending</div>
    </div>

    <div class="form-check form-switch mb-3">
      <input class="form-check-input" type="checkbox" role="switch" id="showViewcount" checked />
      <label class="form-check-label" for="showViewcount">Show view count over chart</label>
      <div class="form-text">dank</div>
    </div>

    <div class="form-check form-switch mb-3">
      <input disabled class="form-check-input" type="checkbox" role="switch" id="autoColor" />
      <label class="form-check-label" for="autoColor">Change color based on view count</label>
      <div class="form-text">dank</div>
    </div>

    <div class="row mb-3">
      <div class="col mb-3">
        <label for="lineColor" class="form-label">Line color</label>
        <input type="color" class="form-control form-control-color" id="lineColor" value="#def33f" title="Line color" />
      </div>
      <div class="col mb-3">
        <label for="fillColor" class="form-label">Chart fill color</label>
        <input type="color" class="form-control form-control-color" id="fillColor" value="#000000" title="Chart fill color" />
      </div>
      <div class="col">
        <label for="backgroundColor" class="form-label">Background color</label>
        <input type="color" class="form-control form-control-color" id="backgroundColor" value="#222222" title="Background color" />
      </div>
    </div>

    <div class="form-check form-switch mb-3">
      <input class="form-check-input" type="checkbox" role="switch" id="transparentBG" />
      <label class="form-check-label" for="transparentBG">Transparent background</label>
      <div class="form-text">dank</div>
    </div>

    <div class="form-check form-switch mb-3">
      <input class="form-check-input" type="checkbox" role="switch" id="noFill" />
      <label class="form-check-label" for="noFill">No chart fill</label>
      <div class="form-text">dank</div>
    </div>

    <div class="card border mb-3">
      <div class="card-body">
        <h3>OBS settings</h3>
        <div class="text-body-secondary">You can connect the site with OBS to automatically go offline once you go under your target view count</div>
        <div class="text-body-secondary">
          You need to install <a href="https://github.com/obsproject/obs-websocket" target="_blank" rel="noopener noreferrer">obs-websocket >5.0.0</a> or update to OBS >28.0.0
        </div>
        <div class="form-group">
          <label for="serverIP"
            >OBS WebSocket Server IP
            <i
              class="material-icons notranslate"
              data-bs-toggle="tooltip"
              data-bs-custom-class="wide-tooltip"
              data-bs-placement="right"
              data-bs-html="true"
              data-bs-title="<img src="/waytoodank/obsinfo.png"/>"
              >help
            </i>
          </label>
          <input disabled type="text" class="form-control" id="serverIP" value="localhost" />
        </div>
        <div class="form-group">
          <label for="serverPort"
            >OBS WebSocket Server Port
            <i
              class="material-icons notranslate"
              data-bs-toggle="tooltip"
              data-bs-custom-class="wide-tooltip"
              data-bs-placement="right"
              data-bs-html="true"
              data-bs-title="<img src="/waytoodank/obsinfo.png"/>"
              >help
            </i>
          </label>
          <input disabled type="text" class="form-control" id="serverPort" value="4455" />
        </div>
        <div class="form-group mb-3">
          <label for="serverPassword">
            OBS WebSocket Server Password
            <i
              class="material-icons notranslate"
              data-bs-toggle="tooltip"
              data-bs-custom-class="wide-tooltip"
              data-bs-placement="right"
              data-bs-html="true"
              data-bs-title="<img src="/waytoodank/obsinfo.png"/>"
              >help
            </i>
          </label>
          <input disabled type="password" class="form-control" id="serverPassword" />
        </div>
        <button disabled type="button" id="connectOBS" class="btn btn-primary">Connect</button>
        <hr />

        <div class="mb-3">
          <label for="stopDelay" class="form-label">Stop streaming delay (seconds)</label>
          <input disabled type="number" class="form-control" min="0" value="0" max="600" id="stopDelay" aria-describedby="stopDelayDesc" />
          <div id="stopDelayDesc" class="form-text">How long should the site wait before going offline in OBS</div>
        </div>
      </div>
    </div>
  </div>
</div>


<style>
    #toastContainer {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1056;
  font-weight: bold;
  text-shadow: -1px 1px 2px #000000;
}

#toastContainer > div > div {
  font-size: 1.5em;
}

#openOffcanvasbtn {
  font-size: 25px;
  position: fixed;
  bottom: 50px;
  left: 0;
  transform-origin: bottom left;
  border-radius: 0 1em 1em 0;
  z-index: 0;
}

#overlay {
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.form-control-color {
  width: 8em;
  height: 3em;
}

body #openOffcanvasbtn {
  display: none;
}
body:hover #openOffcanvasbtn {
  display: inline;
}

</style>