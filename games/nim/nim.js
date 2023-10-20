let streamersTurn = true;
let voters = [];

let elements = {
  //modals
  grid: document.getElementById("grid"),
  gameDiv: document.getElementById("gameDiv"),

  loginExpiredModal: document.getElementById("loginExpiredModal"),
  aboutModal: document.getElementById("aboutModal"),

  //navbar
  vtsLink: document.getElementById("vtsLink"),
  status: document.getElementById("status"),
  topRight: document.getElementById("topRight"),
  loginButton: document.getElementById("loginButton"),
  channelName: document.getElementById("channelName"),
  darkTheme: document.getElementById("darkTheme"),

  //main
  toastContainer: document.getElementById("toastContainer"),
};

let loginButton;
let darkTheme = true;

let loginExpiredModal, aboutModal;

let USER = {
  channel: "",
  twitchLogin: false,
  access_token: "",
  userID: "",
  platform: "",
};
function handleMessage(target, context, msg, self) {
  let input = msg.split(" ").filter(Boolean);
  if (streamersTurn) {
    return;
  }
  let vote_int = parseInt(input[0], 10);
  if (isNaN(vote_int)) {
    return;
  }
  if (vote_int > 0 && vote_int < 4) {
    if (!voters.includes(context.username)) {
      voters.push(context.username);
      let index = NIM.results.findIndex((obj) => obj.label == vote_int);
      NIM.results[index].data += 1;
      updateGraph("nim");
      return;
    }
  }
} //handleMessage

window.onload = function () {
  darkTheme = (localStorage.getItem("darkTheme") || "true") === "true";
  elements.darkTheme.checked = darkTheme ?? true;
  switchTheme(elements.darkTheme.checked);

  loadAndConnect();

  if (!USER.channel) {
    loginButton = new bootstrap.Popover(elements.loginButton);
  }

  loginExpiredModal = new bootstrap.Modal(elements.loginExpiredModal);
  aboutModal = new bootstrap.Modal(elements.aboutModal);

  enableTooltips();
  enablePopovers();

  elements.channelName.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      connect();
    }
  });

  elements.darkTheme.onchange = function () {
    switchTheme(this.checked);
    saveSettings();
  };

  initGraph();

  listeners();
  document.getElementById("nimoverlay").innerHTML = `<span class="overlaytext">${USER.channel || "STREAMER"}'s turn</span>`;
}; //onload

function initGraph() {
  if (NIM.chart) {
    NIM.chart.destroy();
  }

  NIM.chart = new Chart(NIM.ctx, {
    type: "bar",
    data: {
      labels: ["1 - 0 Votes (0%)", "2 - 0 Votes (0%)", "3 - 0 Votes (0%)"],
      datasets: [
        {
          label: "score",
          data: [],
          borderWidth: 2,
        },
      ],
    },
    options: {
      indexAxis: "y",
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            color: "white",
          },
          beginAtZero: true,
        },
        y: {
          ticks: {
            textStrokeColor: "rgba(0,0,0,1)",
            textStrokeWidth: 3,
            color: "white",
            mirror: true,
            font: {
              size: 32,
            },
            z: 1,
          },
          beginAtZero: true,
        },
      },
      plugins: {
        tooltip: {
          enabled: false,
        },
        legend: {
          display: false,
        },
      },
    },
  });
} //initGraph

function updateGraph() {
  let label, data, c1, c2;

  label = NIM.results.map((a) => a.label);
  data = NIM.results.map((a) => a.data);
  c1 = NIM.results.map((a) => a.c1);
  c2 = NIM.results.map((a) => a.c2);

  let list = [];
  let total = 0;
  for (let j = 0; j < data.length; j++) {
    list.push({ data: data[j], label: label[j], c1: c1[j], c2: c2[j] });
  }
  for (let k = 0; k < list.length; k++) {
    data[k] = list[k].data;
    label[k] = `${list[k].label} - ${list[k].data} ${list[k].data == 1 ? "Vote" : "Votes"} (${Math.round((list[k].data / voters.length) * 100) || 0}%)`;
    c1[k] = list[k].c1;
    c2[k] = list[k].c2;
    total += list[k].data;
  }

  document.getElementById("totalvotesnim").innerHTML = `Total votes: ${total}`;
  NIM.chart.data.labels = label;
  NIM.chart.data.datasets.forEach((dataset) => {
    dataset.data = data;
    dataset.backgroundColor = c1;
    dataset.borderColor = c2;
  });
  NIM.chart.update();
} //updateGraph

let NIM = {
  ctx: document.getElementById("nimchartCanvas").getContext("2d"),
  chart: null,
  results: [
    { label: "1", data: 0, c1: "#f44336", c2: "#f53337" },
    { label: "2", data: 0, c1: "#f4c236", c2: "#f5c237" },
    { label: "3", data: 0, c1: "#a8f436", c2: "#a9e437" },
  ],
  html: {
    startGameBtn: document.querySelector("#nimstartGame"),
    restartGameBtn: document.querySelector("#nimrestartGame"),
    popCondition: document.querySelector("#popCondition"),
    popCountSlider: document.querySelector("#popCount"),
    popCountNumber: document.querySelector("#popCountX"),
    settings: document.querySelector("#nimsettings"),
    fieldrows: Array.from(document.querySelectorAll("#nimfield div.nim-field-row")),
    gamestate: document.querySelector("#nimgameState"),
    winmessage: document.querySelector("h4#nimwinMessage"),
    controls: document.querySelectorAll("div.nim-player-controls"),
    p1controls: Array.from(document.querySelectorAll("button.nim-p1-control")),
    p2controls: Array.from(document.querySelectorAll("button.nim-p2-control")),
  },
  game: {
    condition: "lose",
    initialCount: 20,
    count: 0,
    firstMove: 0,
    turn: 0,
  },
}; //NIM

function whoGoes() {
  // returns number of current player - player1 or player2
  return NIM.game.firstMove == NIM.game.turn % 2 ? 1 : 2;
} //whoGoes

function setInitialCount(event) {
  NIM.game.initialCount = Math.max(12, Math.min(36, parseInt(event.target.value, 10)));
  NIM.html.popCountNumber.innerText = NIM.game.initialCount;
  NIM.game.count = NIM.game.initialCount;
  NIM.game.condition = NIM.html.popCondition.value || "lose";
  NIM.game.turn = 0;
  NIM.html.fieldrows.forEach((row) => (row.innerHTML = ""));
  NIM.game.firstMove = Math.round(Math.random()); // who goes first? player 1 or 2?
  // fill field with fresh tasty popsicles:
  let rowNm = 0; // add as many "div.field-row" as you want, script will fill them evenly
  for (let i = 0; i < NIM.game.count; i++) {
    let popsicle = document.createElement("div");
    popsicle.classList.add("nim-popsicle");
    popsicle.style.filter = `hue-rotate(${Math.random() * 360}deg)`; // a bit of flair
    NIM.html.fieldrows[rowNm].appendChild(popsicle);
    rowNm += 1;
    if (rowNm >= NIM.html.fieldrows.length) rowNm = 0;
  }
} //setInitialCount

function turn() {
  NIM.game.turn += 1;
  NIM.html.p1controls.forEach((c) => (c.disabled = whoGoes() == 2));
  NIM.html.p2controls.forEach((c) => (c.disabled = whoGoes() == 1));
  if (whoGoes() == 1) {
    streamersTurn = true;
    document.getElementById("nimchartCanvas").classList = "blur";
    document.getElementById("nimoverlay").innerHTML = `<span class="overlaytext">${USER.channel || "STREAMER"}'s turn</span>`;
  } else {
    streamersTurn = false;
    document.getElementById("nimchartCanvas").classList = "";
    document.getElementById("nimoverlay").innerHTML = "";
  }
} //turn

function makeMove(event) {
  let eatCount = 0;
  if (streamersTurn) {
    eatCount = parseInt(event.target.dataset.intake, 10);
  } else {
    if (voters.length == 0) {
      return;
    }
    eatCount = getChatMove();
    voters = [];
    NIM.results = [
      { label: "1", data: 0, c1: "#f44336", c2: "#f53337" },
      { label: "2", data: 0, c1: "#f4c236", c2: "#f5c237" },
      { label: "3", data: 0, c1: "#a8f436", c2: "#a9e437" },
    ];
    updateGraph("nim");
  }
  NIM.game.count -= eatCount;
  turn();
  if (NIM.game.count < 1) {
    // check game end condition
    if (NIM.game.condition == "win") NIM.game.turn += 1; // hack: switch player # depending on turn #
    NIM.html.winmessage.innerText = `${whoGoes() == 1 ? USER.channel : "Chat"} wins!`;
    NIM.html.controls.forEach((c) => (c.style.visibility = "hidden"));
    NIM.html.gamestate.style.visibility = "visible";
    NIM.html.settings.style.display = "block";
  }
  // clear last-taken state from all the popsicles
  NIM.html.fieldrows.forEach((row) => row.querySelectorAll("div.nim-popsicle.nim-last-taken").forEach((p) => p.classList.remove("nim-last-taken")));
  // iterator: eating the popsicles one by one
  const popsicles = NIM.html.fieldrows.map((row) => Array.from(row.querySelectorAll("div.nim-popsicle")));
  // player1 eats leftmost popsicles, player2 eats rightmost ones
  let maxX = Math.max(...popsicles.map((p) => p.length)),
    maxY = popsicles.length,
    x = whoGoes() == 2 ? 0 : maxX - 1,
    y = whoGoes() == 2 ? 0 : maxY - 1,
    dir = whoGoes() == 2 ? 1 : -1;
  while (eatCount > 0) {
    if (popsicles[y].length > x) {
      if (!popsicles[y][x].classList.contains("nim-taken")) {
        eatCount -= 1;
        popsicles[y][x].classList.add("nim-taken", "nim-last-taken");
      }
    }
    y += dir;
    if (y < 0 || y >= maxY) {
      y = whoGoes() == 2 ? 0 : maxY - 1;
      x += dir;
      if (x < 0 || x >= maxX) break;
    }
  }
} //makeMove

function getChatMove() {
  let list = NIM.results;
  list.sort(function (a, b) {
    return a.data > b.data ? -1 : a.data == b.data ? 0 : 1;
  });
  return parseInt(list[0].label, 10);
} //getChatMove

function startGame() {
  NIM.game.count = NIM.game.initialCount;
  NIM.game.condition = NIM.html.popCondition.value || "lose";
  NIM.game.turn = 0;
  NIM.html.fieldrows.forEach((row) => (row.innerHTML = ""));
  NIM.game.firstMove = Math.round(Math.random()); // who goes first? player 1 or 2?
  if (NIM.game.firstMove == 1) {
    streamersTurn = true;
    document.getElementById("nimchartCanvas").classList = "blur";
    document.getElementById("nimoverlay").innerHTML = `<span class="overlaytext">${USER.channel || "STREAMER"}'s turn</span>`;
  } else {
    streamersTurn = false;
    document.getElementById("nimchartCanvas").classList = "";
    document.getElementById("nimoverlay").innerHTML = "";
  }

  // fill field with fresh tasty popsicles:
  let rowNm = 0; // add as many "div.field-row" as you want, script will fill them evenly
  for (let i = 0; i < NIM.game.count; i++) {
    let popsicle = document.createElement("div");
    popsicle.classList.add("nim-popsicle");
    popsicle.style.filter = `hue-rotate(${Math.random() * 360}deg)`; // a bit of flair
    NIM.html.fieldrows[rowNm].appendChild(popsicle);
    rowNm += 1;
    if (rowNm >= NIM.html.fieldrows.length) rowNm = 0;
  }
  // mandatory stuff
  NIM.html.gamestate.style.visibility = "hidden";
  NIM.html.controls.forEach((c) => (c.style.visibility = "visible"));
  NIM.html.settings.style.display = "none";
  turn();
} //startGame

function reset() {
  NIM.html.settings.style.display = "block";
  NIM.results = [
    { label: "1", data: 0, c1: "#f44336", c2: "#f53337" },
    { label: "2", data: 0, c1: "#f4c236", c2: "#f5c237" },
    { label: "3", data: 0, c1: "#a8f436", c2: "#a9e437" },
  ];
  document.getElementById("nimoverlay").innerHTML = `<span class="overlaytext">${USER.channel || "STREAMER"}'s turn</span>`;
  document.getElementById("nimchartCanvas").classList = "blur";
  NIM.game.count = NIM.game.initialCount;
  NIM.game.condition = NIM.html.popCondition.value || "lose";
  NIM.game.turn = 0;
  NIM.html.fieldrows.forEach((row) => (row.innerHTML = ""));

  let rowNm = 0; // add as many "div.field-row" as you want, script will fill them evenly
  for (let i = 0; i < NIM.game.count; i++) {
    let popsicle = document.createElement("div");
    popsicle.classList.add("nim-popsicle");
    popsicle.style.filter = `hue-rotate(${Math.random() * 360}deg)`; // a bit of flair
    NIM.html.fieldrows[rowNm].appendChild(popsicle);
    rowNm += 1;
    if (rowNm >= NIM.html.fieldrows.length) rowNm = 0;
  }
  // mandatory stuff
  NIM.html.gamestate.style.visibility = "hidden";
} //reset

function listeners() {
  // settings: set initial count (sliders)
  NIM.html.popCountSlider.addEventListener("input", setInitialCount);
  // start game button listeners
  NIM.html.startGameBtn.addEventListener("click", startGame);
  NIM.html.restartGameBtn.addEventListener("click", startGame);
  // game control listeners
  NIM.html.p1controls.forEach((c) => c.addEventListener("click", makeMove));
  NIM.html.p2controls.forEach((c) => c.addEventListener("click", makeMove));
} //listeners
