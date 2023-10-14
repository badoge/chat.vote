/*jshint esversion: 11 */
const CLIENT_ID = "qn0wimnszbqlwfnszdz3wwfz430eqr";

let _game;
let streamersTurn = true;
let voters = [];

let elements = {
  //modals
  grid: document.getElementById("grid"),
  gameDiv: document.getElementById("gameDiv"),

  loginExpiredModal: document.getElementById("loginExpiredModal"),
  loginExpiredRenew: document.getElementById("loginExpiredRenew"),
  loginExpiredReset: document.getElementById("loginExpiredReset"),
  aboutModal: document.getElementById("aboutModal"),

  //navbar
  vtsLink: document.getElementById("vtsLink"),
  status: document.getElementById("status"),
  topRight: document.getElementById("topRight"),
  loginButton: document.getElementById("loginButton"),
  channelName: document.getElementById("channelName"),
  connectbtn: document.getElementById("connectbtn"),
  darkTheme: document.getElementById("darkTheme"),

  //main
  toastContainer: document.getElementById("toastContainer"),
};

const spinner = `<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>`;

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

let CONNECT4 = {
  ctx: document.getElementById("c4chartCanvas").getContext("2d"),
  chart: null,
  results: [
    { label: "1", data: 0, c1: "#f44336", c2: "#f53337" },
    { label: "2", data: 0, c1: "#f4c236", c2: "#f5c237" },
    { label: "3", data: 0, c1: "#a8f436", c2: "#a9e437" },
    { label: "4", data: 0, c1: "#36f443", c2: "#37e444" },
    { label: "5", data: 0, c1: "#36f4c2", c2: "#37e4c3" },
    { label: "6", data: 0, c1: "#36a8f4", c2: "#3798f5" },
    { label: "7", data: 0, c1: "#4336f4", c2: "#4426f5" },
  ],
}; //CONNECT4

function refreshData() {
  darkTheme = elements.darkTheme.checked ?? true;

  if (!USER.twitchLogin) {
    USER.channel = elements.channelName.value.replace(/\s+/g, "").toLowerCase();
    USER.platform = "twitch";
  }
} //refreshdata

function saveSettings() {
  refreshData();
  localStorage.setItem("USER", JSON.stringify(USER));
  localStorage.setItem("darkTheme", darkTheme);
} //saveSettings

function load_localStorage() {
  if (!localStorage.getItem("USER")) {
    console.log("localStorage user info not found");
  } else {
    USER = JSON.parse(localStorage.getItem("USER"));
    elements.channelName.value = USER.channel;
  }
} //load_localStorage

function resetSettings() {
  localStorage.setItem(
    "USER",
    JSON.stringify({
      channel: "",
      twitchLogin: false,
      access_token: "",
      userID: "",
      platform: "",
    })
  );

  location.reload();
  return false;
} //resetSettings

function login() {
  elements.topRight.innerHTML = `<div class="btn-group" role="group" aria-label="log in button group">
    <button type="button" class="btn btn-twitch"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></button>
    <div class="btn-group" role="group">
        <button id="btnGroupDropLogin" type="button" class="btn btn-twitch dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
      </button>
        <ul class="dropdown-menu dropdown-menu-lg-end" aria-labelledby="btnGroupDrop1">
            <li><a class="dropdown-item" onclick="logout()" href="#"><i class="material-icons notranslate">logout</i>Log out</a></li>
        </ul>
    </div>
</div>`;
  window.open("/prompt.html", "loginWindow", "toolbar=0,status=0,scrollbars=0,width=500px,height=800px");
  return false;
} //login

function connect() {
  elements.status.innerHTML = `
  <h4>
  <span class="badge bg-warning">Connecting... 
  <div class="spinner-border" style="width:18px;height:18px;" role="status"><span class="visually-hidden">Loading...</span></div>
  </span>
  </h4>`;
  elements.topRight.innerHTML = `
  <div class="btn-group" role="group" aria-label="log in button group">
  <button type="button" class="btn btn-twitch"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></button>
  <div class="btn-group" role="group">
  <button id="btnGroupDropLogin" type="button" class="btn btn-twitch dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"></button>
  <ul class="dropdown-menu dropdown-menu-lg-end" aria-labelledby="btnGroupDrop1">
  <li><a class="dropdown-item" onclick="logout()" href="#"><i class="material-icons notranslate">logout</i>Log out</a></li>
  </ul>
  </div>
  </div>`;
  refreshData();
  let options = {
    options: {
      clientId: CLIENT_ID,
      debug: false,
    },
    connection: {
      secure: true,
      reconnect: true,
    },
    channels: [USER.channel],
  };
  client = new tmi.client(options);

  client.on("message", async (target, context, msg, self) => {
    let input = msg.split(" ").filter(Boolean);

    if (streamersTurn) {
      return;
    }

    let vote_int = parseInt(input[0], 10);
    if (isNaN(vote_int)) {
      return;
    }
    if (vote_int > 0 && vote_int < 8) {
      if (!voters.includes(context.username)) {
        voters.push(context.username);
        let index = CONNECT4.results.findIndex((obj) => obj.label == vote_int);
        CONNECT4.results[index].data += 1;
        updateGraph("c4");
        return;
      }
    }
  }); //message

  client.on("timeout", (channel, username, reason, duration, userstate) => {}); //timeout

  client.on("connected", async (address, port) => {
    console.log(`Connected to ${address}:${port}`);
    elements.status.innerHTML = `<h4><span class="badge bg-success">Connected :)</span></h4>`;
    saveSettings();
    sendUsername(`chat.vote/games/donkhunt`, USER.channel, USER.platform == "twitch" ? `twitch - ${USER.twitchLogin}` : "youtube");
    if (await checkTags(USER.userID, USER.access_token)) {
      elements.vtsLink.style.display = "";
    }
    loadPFP();
  }); //connected

  client.on("disconnected", (reason) => {
    elements.status.innerHTML = `<h4><span class="badge bg-danger">Disconnected: ${reason}</span></h4>`;
  }); //disconnected

  client.on("notice", (channel, msgid, message) => {
    elements.status.innerHTML = `<h4><span class="badge bg-danger">Disconnected: ${message}</span></h4>`;
  }); //notice

  client.connect().catch(console.error);
} //connect

async function loadPFP() {
  if (!USER.channel) {
    elements.topRight.innerHTML = ` <div class="btn-group" role="group" aria-label="login options">
    <a
      role="button"
      id="loginButton"
      class="btn btn-twitch"
      tabindex="0"
      data-bs-container="body"
      data-bs-custom-class="custom-popover"
      data-bs-placement="bottom"
      data-bs-trigger="manual"
      data-bs-toggle="popover"
      data-bs-title="Not signed in"
      data-bs-content="You need sign in first before adding options or enabling voting/suggestions"
      ><span class="twitch-icon"></span>Sign in with Twitch</a
    >
    <div class="btn-group" role="group">
      <button
        id="btnGroupDropLogin"
        type="button"
        class="btn btn-twitch dropdown-toggle"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        aria-label="other login option, connect manually"
        aria-expanded="false"
      ></button>
      <div class="dropdown-menu dropdown-menu-end" aria-labelledby="btnGroupDropLogin">
        <div class="p-3" style="width: 300px">
          <label for="channelName" class="form-label">Connect to chat directly</label>
          <div class="input-group mb-3">
            <span class="input-group-text" id="directLoginChannel">twitch.tv/</span>
            <input type="text" class="form-control" id="channelName" aria-describedby="directLoginChannel" />
          </div>
          <small class="text-body-secondary">Some features will not be available if you connect directly</small><br />
          <button type="button" id="connectbtn" class="btn btn-primary float-end">Connect</button>
        </div>
      </div>
    </div>
  </div>`;
    return;
  }
  let profilepicurl = await get7TVPFP(USER.userID);
  if (profilepicurl == "/pics/donk.png" && USER.access_token) {
    profilepicurl = await getTwitchPFP(USER.channel, USER.access_token);
  }
  elements.topRight.innerHTML = `
  <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
  <button type="button" id="btnGroupDrop2" class="btn btn-${darkTheme ? "dark" : "secondary"}"><img src="${profilepicurl}" alt="profile pic" style="height:2em;"></button>
  <div class="btn-group" role="group">
  <button id="btnGroupDrop1" type="button" class="btn btn-${darkTheme ? "dark" : "secondary"} dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
  ${USER.channel}
  </button>
  <ul class="dropdown-menu dropdown-menu-lg-end" aria-labelledby="btnGroupDrop1">
  <li><a class="dropdown-item" onclick="logout()" href="#"><i class="material-icons notranslate">logout</i>Log out</a></li>
  </ul>
  </div>
  </div>`;
} //loadPFP

function checkLogin() {
  if (!USER.channel) {
    loginButton.show();
    setTimeout(function () {
      loginButton.hide();
    }, 4000);
    return false;
  }
  return true;
} //checkLogin

function logout() {
  elements.topRight.innerHTML = ` <div class="btn-group" role="group" aria-label="login options">
  <a
    role="button"
    id="loginButton"
    class="btn btn-twitch"
    tabindex="0"
    data-bs-container="body"
    data-bs-custom-class="custom-popover"
    data-bs-placement="bottom"
    data-bs-trigger="manual"
    data-bs-toggle="popover"
    data-bs-title="Not signed in"
    data-bs-content="You need sign in first before adding options or enabling voting/suggestions"
    ><span class="twitch-icon"></span>Sign in with Twitch</a
  >
  <div class="btn-group" role="group">
    <button
      id="btnGroupDropLogin"
      type="button"
      class="btn btn-twitch dropdown-toggle"
      data-bs-toggle="dropdown"
      data-bs-auto-close="outside"
      aria-label="other login option, connect manually"
      aria-expanded="false"
    ></button>
    <div class="dropdown-menu dropdown-menu-end" aria-labelledby="btnGroupDropLogin">
      <div class="p-3" style="width: 300px">
        <label for="channelName" class="form-label">Connect to chat directly</label>
        <div class="input-group mb-3">
          <span class="input-group-text" id="directLoginChannel">twitch.tv/</span>
          <input type="text" class="form-control" id="channelName" aria-describedby="directLoginChannel" />
        </div>
        <small class="text-body-secondary">Some features will not be available if you connect directly</small><br />
        <button type="button" id="connectbtn" class="btn btn-primary float-end">Connect</button>
      </div>
    </div>
  </div>
</div>`;
  resetSettings();
} //logout

function switchTheme(checkbox) {
  document.documentElement.setAttribute("data-bs-theme", checkbox ? "dark" : "light");
  document.getElementById("twitchLogo").style.filter = `invert(${checkbox ? 0.25 : 0.65})`;
  if (document.getElementById("btnGroupDrop1") && document.getElementById("btnGroupDrop2")) {
    document.getElementById("btnGroupDrop1").classList.remove(`${checkbox ? "btn-secondary" : "btn-dark"}`);
    document.getElementById("btnGroupDrop1").classList.add(`${checkbox ? "btn-dark" : "btn-secondary"}`);
    document.getElementById("btnGroupDrop2").classList.remove(`${checkbox ? "btn-secondary" : "btn-dark"}`);
    document.getElementById("btnGroupDrop2").classList.add(`${checkbox ? "btn-dark" : "btn-secondary"}`);
  }
} //switchTheme

async function loadAndConnect() {
  load_localStorage();
  refreshData();
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  if (params.channel && !USER.channel && !USER.twitchLogin && !USER.access_token && !USER.userID) {
    let input = params.channel.replace(/\s+/g, "").toLowerCase();
    elements.channelName.value = input;
    USER.channel = input;
    window.history.replaceState({}, document.title, "/");
  }
  if (USER.twitchLogin && !(await checkToken(USER.access_token))) {
    USER.channel = "";
    loginExpiredModal.show();
    return;
  }
  if (USER.channel) {
    connect();
  }
} //loadAndConnect

function toggleGrid() {
  elements.grid.style.display = elements.grid.style.display == "none" ? "" : "none";
  elements.gameDiv.style.display = elements.gameDiv.style.display == "" ? "none" : "";
}

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

  elements.connectbtn.addEventListener("click", function () {
    connect();
  });

  elements.loginExpiredRenew.addEventListener("click", function () {
    login();
  });

  elements.loginButton.addEventListener("click", function () {
    login();
  });

  elements.loginExpiredReset.addEventListener("click", function () {
    resetSettings();
  });

  elements.darkTheme.onchange = function () {
    switchTheme(this.checked);
    saveSettings();
  };
  resetGame();
  initGraph();
  document.getElementById("c4overlay").innerHTML = `<span class="overlaytext">${USER.channel || "STREAMER"}'s turn</span>`;
}; //onload

window.onbeforeunload = function () {
  return null;
}; //onbeforeunload

function initGraph() {
  if (CONNECT4.chart) {
    CONNECT4.chart.destroy();
  }

  CONNECT4.chart = new Chart(CONNECT4.ctx, {
    type: "bar",
    data: {
      labels: ["1 - 0 Votes (0%)", "2 - 0 Votes (0%)", "3 - 0 Votes (0%)", "4 - 0 Votes (0%)", "5 - 0 Votes (0%)", "6 - 0 Votes (0%)", "7 - 0 Votes (0%)"],
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

  label = CONNECT4.results.map((a) => a.label);
  data = CONNECT4.results.map((a) => a.data);
  c1 = CONNECT4.results.map((a) => a.c1);
  c2 = CONNECT4.results.map((a) => a.c2);

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

  document.getElementById("totalvotesc4").innerHTML = `Total votes: ${total}`;
  CONNECT4.chart.data.labels = label;
  CONNECT4.chart.data.datasets.forEach((dataset) => {
    dataset.data = data;
    dataset.backgroundColor = c1;
    dataset.borderColor = c2;
  });
  CONNECT4.chart.update();
} //updateGraph

function start(ai_1_strength, ai_2_strength) {
  $("#board").empty();
  let game = new C4({
    ai_1_strength: ai_1_strength,
    ai_2_strength: ai_2_strength,
    container: "#board",
  });
} //start

function reset() {
  document.getElementById("totalvotesc4").innerHTML = `Total votes: 0`;
  start(0, 0);
  document.getElementById("c4chartCanvas").classList = "blur";
  document.getElementById("c4overlay").innerHTML = `<span class="overlaytext">${USER.channel || "STREAMER"}'s turn</span>`;
  document.getElementById("c4output").innerHTML = "";
  CONNECT4.results = [
    { label: "1", data: 0, c1: "#f44336", c2: "#f53337" },
    { label: "2", data: 0, c1: "#f4c236", c2: "#f5c237" },
    { label: "3", data: 0, c1: "#a8f436", c2: "#a9e437" },
    { label: "4", data: 0, c1: "#36f443", c2: "#37e444" },
    { label: "5", data: 0, c1: "#36f4c2", c2: "#37e4c3" },
    { label: "6", data: 0, c1: "#36a8f4", c2: "#3798f5" },
    { label: "7", data: 0, c1: "#4336f4", c2: "#4426f5" },
  ];
} //reset

function playTurn() {
  if (voters.length == 0) {
    return;
  }
  streamersTurn = true;
  let donk = document.getElementsByClassName("c4cols");
  let c4cols = Array.prototype.slice.call(donk).map((x) => parseInt(x.innerHTML, 10));
  document.getElementById("c4chartCanvas").classList = "blur";
  document.getElementById("c4overlay").innerHTML = `<span class="overlaytext">${USER.channel || "STREAMER"}'s turn</span>`;
  let list = CONNECT4.results;
  list.sort(function (a, b) {
    return a.data > b.data ? -1 : a.data == b.data ? 0 : 1;
  });
  for (let i = 0, j = c4cols.length; i < j; i++) {
    donk[i].innerHTML = 0;
  }

  _game.trigger("drop", { col_index: parseInt(list[0].label, 10) - 1 });

  voters = [];

  for (let index = 0; index < CONNECT4.results.length; index++) {
    CONNECT4.results[index].data = 0;
  }
  CONNECT4.results.sort(function (a, b) {
    return parseInt(a.label, 10) < parseInt(b.label, 10) ? -1 : parseInt(a.label, 10) == parseInt(b.label, 10) ? 0 : 1;
  });
  updateGraph("c4");
} //playTurn

class C4 {
  constructor(_options) {
    _game = this;
    let _columns = 7;
    let _rows = 6;
    let _counter = 0;
    let _event_handlers = {};

    this.current = null;
    this.rack = [];
    this.moves = [];

    class Player {
      constructor(color) {
        this.color = color;
        this.human = true;
        this.toString = function () {
          return this === _game.current ? "X" : "O";
        };
      }
    }

    this.init = function () {
      for (let c = 0; c < _columns; c++) {
        this.rack[c] = new Array(_rows);
      }
      let player1 = new Player("streamer");
      let player2 = new Player("chat");

      player1.opponent = player2;
      player2.opponent = player1;
      this.current = player1;

      C4.Util(this);
      C4.UI(this, _options);

      this.trigger("waitingForDrop");
    };

    this.on = function (event, handler) {
      if (!(event in _event_handlers)) {
        _event_handlers[event] = [];
      }

      _event_handlers[event].push(handler);
    };

    this.trigger = function (event, data) {
      if (!(event in _event_handlers)) return;

      let handlers = _event_handlers[event];
      $.each(handlers, function (index, handler) {
        handler(data);
      });
    };

    this.on("drop", function (data) {
      if (!data) return;

      let row_index = _game.util.getDropRow(data.col_index);
      if (row_index > -1) {
        _counter++;
        _game.rack[data.col_index][row_index] = _game.current;
        _game.moves.push({
          player: _game.current,
          col_index: data.col_index,
          row_index: row_index,
        });

        let connected = _game.util.findConnected();
        if (connected.length) {
          _game.trigger("done", {
            winner: _game.current,
            connected: connected,
          });
        } else if (_counter === _columns * _rows) {
          _game.trigger("done");
        } else {
          _game.current = _game.current.opponent;
          _game.trigger("waitingForDrop");
        }
      }
    });

    this.init();
  }
}

C4.Util = function (_game) {
  let _util = {};
  let _rack = _game.rack;
  let _columns = _rack.length;
  let _rows = _rack[0].length;

  function findConnected() {
    let connected = [];
    let directions = [
      [0, 1],
      [-1, 1],
      [1, 1],
      [1, 0],
    ];

    walkRack(function (player, c, r) {
      $.each(directions, function (i, direction) {
        let result = findConnectedInDirection(c, r, direction[0], direction[1]);
        if (result.length >= 4) {
          connected = connected.concat(result);
        }
      });
    });

    return connected;
  }

  function findConnectedInDirection(c, r, c_delta, r_delta) {
    let player = _rack[c][r];
    let connected = [[c, r]];
    try {
      while (_rack[(c += c_delta)][(r += r_delta)] === player) {
        connected.push([c, r]);
      }
    } catch (ex) {}
    return connected;
  }

  function walkRack(callback) {
    for (let c = 0; c < _columns; c++) {
      for (let r = 0; r < _rows; r++) {
        let player = _game.rack[c][r];
        if (player && player.color) {
          callback(player, c, r);
        }
      }
    }
  }

  function getDropRow(col_index) {
    let column = _rack[col_index];
    let row = _rows - 1;
    while (column[row]) {
      row--;
    }
    return row;
  }

  _game.util = {
    findConnected: findConnected,
    getDropRow: getDropRow,
  };
};

C4.UI = function (_game, _options) {
  let $board = $(_options.container);
  let $controls;
  let $coins;
  let $rack;

  function init() {
    $rack = $("<div class='rack'/>");
    $coins = $("<div class='coins'></div>");
    $controls = $("<div class='controls'></div>");
    let overlay = $(`<div class="overlay"><img src="/games/connect4/overlay.svg" alt="overlay"></div>`);
    for (let c = 0; c < _game.rack.length; c++) {
      $controls.append(`<div class="control col-${c}"/><span class="collabel">${c + 1}</span><span class="collabel2">${c + 1}</span>`);
    }

    $controls.on("click", ".control", function () {
      if (!streamersTurn) {
        return;
      }
      if (streamersTurn) {
        document.getElementById("c4chartCanvas").classList = "";
        document.getElementById("c4overlay").innerHTML = "";
        streamersTurn = false;
      }

      let c = $(this).index();
      _game.trigger("drop", { col_index: c });
    });

    $rack.append($controls);
    $rack.append(overlay);

    $rack.append($coins);

    $board.append($rack);
  }

  function updateControls() {
    $controls.children().removeClass(_game.current.opponent.color);
    $controls.children().addClass(_game.current.color);
    $controls.toggleClass("enabled", _game.current.human);
  }

  function showLastMove() {
    if (!_game.moves.length) {
      return;
    }
    let move = _game.moves[_game.moves.length - 1];
    let c = move.col_index;
    let r = move.row_index;
    let coin = $('<div class="coin col-' + c + " " + move.player.color + '" id="cell-' + c + "-" + r + '"/>');

    $coins.append(coin);

    setTimeout(function () {
      coin.addClass("row-" + r);
    }, 50);
  }

  _game.on("waitingForDrop", updateControls);

  _game.on("waitingForDrop", showLastMove);

  _game.on("done", function (data) {
    let $message = $('<div class="message"/>');
    $rack.prepend($message);
    $controls.remove();
    let message = "Draw";

    showLastMove();

    if (data && data.connected) {
      for (let i = 0; i < data.connected.length; i++) {
        let col_index = data.connected[i][0];
        let row_index = data.connected[i][1];
        let cell = $("#cell-" + col_index + "-" + row_index);
        cell.addClass("connected");
      }
      message = data.winner.color + " wins";
    }

    $message.text(message);
    document.getElementById("c4output").innerHTML = `${message}<br> <button type="button" onclick="resetGame()" class="btn btn-primary">Play again</button>`;
  });

  init();
};

function resetGame() {
  voters = [];
  initGraph();
  streamersTurn = true;
  reset();
} //resetGame
