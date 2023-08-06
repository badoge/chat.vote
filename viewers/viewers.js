const CLIENT_ID = "qn0wimnszbqlwfnszdz3wwfz430eqr";

let modal1, modal2;
let myChart;
let viewCountArray = [];
let viewCountLabelsArray = [];
let targetCount = 1;
let chartWidth = 20;
let updateRate = 5;
let channel;
let updateOnChange = true;

let elements = {
  modal1: document.getElementById("modal1"),
  modal2: document.getElementById("modal2"),
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
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${USER.access_token}`);
  myHeaders.append("Client-Id", CLIENT_ID);
  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
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
    modal2.show();
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
  modal1 = new bootstrap.Modal(elements.modal1);
  modal2 = new bootstrap.Modal(elements.modal2);
  loadAndConnect();
  if (!USER.channel) {
    modal2.show();
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
