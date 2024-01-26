let _game;
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

function handleMessage(target, context, msg, self) {
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
      updateGraph();
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
  resetGame();
  initGraph();
  document.getElementById("c4overlay").innerHTML = `<span class="overlaytext">${USER.channel || "STREAMER"}'s turn</span>`;
}; //onload

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
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            textStrokeColor: "rgba(0,0,0,1)",
            textStrokeWidth: 2,
            color: "white",
            maxRotation: 0,
          },
          beginAtZero: true,
        },
        y: {
          ticks: {
            display: false,
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
  updateGraph();
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
      message = data.winner.color + " wins!";
    }

    $message.text(message);
    document.getElementById("c4output").innerHTML = `<h4>${message}</h4><br> <button type="button" onclick="resetGame()" class="btn btn-primary">Play again</button>`;
  });

  init();
};

function resetGame() {
  voters = [];
  initGraph();
  streamersTurn = true;
  reset();
} //resetGame
