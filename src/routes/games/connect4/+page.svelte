<script>
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
</script>

<svelte:head>
  <title>chat.vote Games - Connect 4</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="Players take turns to drop their pieces into the container, attempting to connect 4 of their pieces in a row." />
  <meta name="keywords" content="chatvote, chat.vote, interactive, games, Twitch, chat" />
  <meta property="og:title" content="chat.vote Games - Connect 4" />
  <meta property="og:site_name" content="chat.vote Games - Connect 4" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chat.vote/games/connect4/" />
  <meta property="og:image" content="https://screenshot.donk.workers.dev/?url=https://chat.vote/games/connect4" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:description" content="Players take turns to drop their pieces into the container, attempting to connect 4 of their pieces in a row." />

  <script src="/games.js"></script>
</svelte:head>

<div class="modal fade" id="loginExpiredModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Login expired</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row justify-content-center">
          Renew login:<br />
          <button type="button" data-bs-dismiss="modal" onclick="login()" class="btn btn-twitch"><span class="twitch-icon"></span>Sign in with Twitch</button>
          <br /><small class="text-body-secondary">Logins expire after 2 months.<br />Or after you change your password.</small>
        </div>
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-danger"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          data-bs-title="Will reset everything so you can login again."
          data-bs-dismiss="modal"
          onclick="resetSettings()"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="howToPlayModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="howToPlayTitle">How to play - Connect4</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="howToPlayBody">
        <p>1. Streamer makes a move</p>
        <p>2. Chat picks a column by typing a number in chat</p>
        <p>3. Streamer clicks on "Play chat's turn"</p>
        <p>Repeat until someone wins :)</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="aboutModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">About</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="card mb-3">
          <div class="card-body">
            <h5>Contact info:</h5>
            <p>
              Site by <a target="_blank" rel="noopener noreferrer" href="https://www.twitch.tv/badoge">badoge</a> :) <br />If you find any issues or if you have suggestions or questions, you
              can contact me: <br /><a target="_blank" rel="noopener noreferrer" href="https://www.twitch.tv/popout/badoge/chat?popout=">in this chat</a> <br />or on
              <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/FR8bgQdPUT">discord</a> <br />or by <a href="mailto:games@chat.vote">email</a>
            </p>
          </div>
        </div>
        <div class="card mb-3">
          <div class="card-body">
            <h5>Other stuff by me :)</h5>
            <p>
              <a target="_blank" rel="noopener noreferrer" href="https://chat.vote/">chat.vote</a><br />
              <small>Polls that you vote on by typing in Twitch chat.</small><br />
              <a target="_blank" rel="noopener noreferrer" href="https://chat.vote/poll/">chat.vote/poll</a><br />
              <small>Like normal chat.vote but you vote by visiting the site instead of typing in chat.</small><br />
              <a target="_blank" rel="noopener noreferrer" href="https://okayeg.com">OkayegBOT</a><br />
              <small>Fun/utility Twitch chat bot.</small><br />
              <a target="_blank" rel="noopener noreferrer" href="https://zero.chat.vote">0weebs</a><br />
              <small>Twitch moderation bot that bans weebs.</small><br />
            </p>
          </div>
        </div>

        <div class="card mb-3">
          <div class="card-body">
            <p>more games soon™ :)</p>
            <p>tictactoe based on <a target="_blank" rel="noopener noreferrer" href="https://github.com/michaelwhyte/tic_tac_toe">github.com/michaelwhyte/tic_tac_toe</a></p>
            <p>connect4 based on <a target="_blank" rel="noopener noreferrer" href="https://github.com/mennovanslooten/connect4">github.com/mennovanslooten/connect4</a></p>
            <p>not wordle based on <a target="_blank" rel="noopener noreferrer" href="https://www.nytimes.com/games/wordle/index.html">wordle</a></p>
            <p>🟥⏹️🔴🔴⭕⏹️, Donk Hunt, Nim and Arena by <a target="_blank" rel="noopener noreferrer" href="https://www.twitch.tv/g7eternal">g7eternal</a></p>
            <h5>Stuff used:</h5>
            <ul>
              <li><a target="_blank" rel="noopener noreferrer" href="https://getbootstrap.com/">Bootstrap</a></li>
              <li><a target="_blank" rel="noopener noreferrer" href="https://tmijs.com/">tmi.js</a> to read twitch chat</li>
              <li><a target="_blank" rel="noopener noreferrer" href="http://fabricjs.com/">Fabric.js</a> Drawing canvas</li>
              <li><a target="_blank" rel="noopener noreferrer" href="https://github.com/twitter/twemoji">Twemoji</a> emoji</li>
              <li><a target="_blank" rel="noopener noreferrer" href="https://phaser.io/">Phaser</a> Arena engine</li>
              <li><a target="_blank" rel="noopener noreferrer" href="https://www.chartjs.org/">Chart.js</a> to display the results graphs</li>
              <li><a target="_blank" rel="noopener noreferrer" href="https://github.com/albert-gonzalez/easytimer.js">EasyTimer.js</a> for the countdown timers</li>
              <li><a target="_blank" rel="noopener noreferrer" href="https://fonts.google.com/icons">Material Icons</a> icons</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<div class="container-fluid">
  <div id="grid" class="mt-3" style="display: none">
    <div class="row row-cols-1 row-cols-xl-4 row-cols-lg-3 row-cols-sm-3 g-4">
      <div class="col">
        <div class="card h-100">
          <img src="/games/pics/draw.png" onclick="switchGame('draw')" class="card-img-top" alt="Draw" />
          <div class="card-body">
            <h5 class="card-title">Draw</h5>
            <p class="card-text">Streamer draws a random emote, chat has to guess the emote. Can you draw well enough?</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/games/pics/arena.png" onclick="switchGame('arena')" class="card-img-top" alt="Arena" />
          <div class="card-body">
            <h5 class="card-title">Arena</h5>
            <p class="card-text">Fight your chatters in a "battle royale" arena, where only one can win!</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/games/pics/eb.png" onclick="switchGame('eb')" class="card-img-top" alt="Emote benchmark" />
          <div class="card-body">
            <h5 class="card-title">Emote benchmark</h5>
            <p class="card-text">A test of reaction speed and emote knowledge. Type the appearing emotes in chat as fast as you can.</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/games/pics/dh.png" onclick="switchGame('dh')" class="card-img-top" alt="Donk Hunt" />
          <div class="card-body">
            <h5 class="card-title">Donk Hunt</h5>
            <p class="card-text">Scary looking creatures are trying to trap their prey. Are you the hunter or the hunted one?</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/games/pics/shapes.png" onclick="switchGame('shapes')" class="card-img-top" alt="🟥⏹️🔴🔴⭕⏹️" />
          <div class="card-body">
            <h5 class="card-title">🟥⏹️🔴🔴⭕⏹️</h5>
            <p class="card-text">A very weird logic puzzle. Finish the row of shapes, which has been formed using a pre-determined hidden rule.</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/games/pics/nim.png" onclick="switchGame('nim')" class="card-img-top" alt="Nim" />
          <div class="card-body">
            <h5 class="card-title">Nim</h5>
            <p class="card-text">Classic. Remove popsicles until there's one left. Whoever takes the last one - loses!</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/games/pics/nw.png" onclick="switchGame('nw')" class="card-img-top" alt="Not Wordle :)" />
          <div class="card-body">
            <h5 class="card-title">Not Wordle :)</h5>
            <p class="card-text">A twist of a well-known game: try to guess a word in several attempts. Your chat will choose the hidden word.</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100 bg-body-tertiary border-light">
          <img src="/games/pics/c4.png" onclick="toggleGrid()" class="card-img-top" alt="Connect 4" />
          <div class="card-body">
            <h5 class="card-title">Connect 4</h5>
            <p class="card-text">Players take turns to drop their pieces into the container, attempting to connect 4 of their pieces in a row.</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/games/pics/ttt.png" onclick="switchGame('ttt')" class="card-img-top" alt="tic tac toe" />
          <div class="card-body">
            <h5 class="card-title">tic tac toe</h5>
            <p class="card-text">An ancient game of wits. Will you outsmart the hive mind - which is your chat?</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/games/pics/guessr.png" onclick="switchGame('guessr')" class="card-img-top" alt="guessr" />
          <div class="card-body">
            <h5 class="card-title"><i class="material-icons notranslate">open_in_new</i> Guessr.tv</h5>
            <p class="card-text">Guess the view count. You will be presented with a random Twitch stream and you have to guess how many viewers they have.</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/pics/donk.png" style="width: 180px; height: 180px; align-self: center" onclick="switchGame('about')" class="card-img-top" alt="About" />
          <div class="card-body">
            <h5 class="card-title">About</h5>
            <p class="card-text">About section</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid p-0" id="gameDiv">
    <div class="row mt-2 mb-2" id="navrow">
      <div class="col">
        <div class="card">
          <div class="card-body p-1">
            <button type="button" onclick="toggleGrid()" class="btn btn-primary"><i class="material-icons notranslate">arrow_back</i>Back</button>
            <button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#howToPlayModal"><i class="material-icons notranslate">help_outline</i>How To Play</button>
            <b id="gameName">Connect 4</b>
          </div>
        </div>
      </div>
    </div>
    <div class="row" id="gameRow">
      <div class="col"></div>
      <div class="col-auto">
        <div class="row">
          <div class="col">
            <div id="c4chartdiv" class="chart-container">
              <div id="c4overlay"></div>
              <canvas id="c4chartCanvas" class="blur"></canvas>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col" id="board"></div>
        </div>
      </div>
      <div class="col">
        <button type="button" onclick="playTurn()" class="btn btn-lg btn-success">Play chat's turn</button><br />
        <span id="totalvotesc4">Total votes: 0</span>
        <div id="c4output"></div>
      </div>
    </div>
  </div>
</div>

<div aria-live="polite" aria-atomic="true" class="position-relative">
  <div id="toastContainer" class="toast-container"></div>
</div>

<style>
  body {
    margin-bottom: 300px;
  }

  #gameName {
    text-align: center;
    vertical-align: middle;
    margin-left: 35vw;
  }

  .card-img-top {
    cursor: pointer;
    width: 100%;
    height: 230px;
  }

  #toastContainer {
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 1056;
    font-weight: bold;
  }

  #toastContainer > div > div {
    font-size: 1.5em;
  }

  .resizable {
    display: inline-block;
    resize: both;
    overflow: hidden;
    line-height: 0;
  }

  .resizable img {
    height: 100%;
  }

  .custom-popover {
    --bs-popover-border-color: var(--bs-warning);
    --bs-popover-header-bg: var(--bs-warning);
    --bs-popover-header-color: var(--bs-white);
  }

  .tooltip.show {
    opacity: 1;
  }

  #c4chartdiv {
    position: relative;
    height: 20vh;
    width: 704px;
  }

  #c4overlay {
    text-align: center;
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .coins {
    position: relative;
    width: 700px;
    height: 600px;
    background: #969696;
    overflow: hidden;
  }

  .coin,
  .control {
    width: 100px;
    height: 100px;
    position: absolute;
    left: 0;
    top: -100px;
    transition: top 0.2s ease-in;
    -moz-transition: top 0.2s ease-in;
    -webkit-transition: top 0.2s ease-in;
  }

  .coin:before,
  .control:before {
    content: "";
    position: absolute;
    left: 10px;
    top: 10px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
  }

  .coin:after,
  .control:after {
    content: "";
    position: absolute;
    left: 20px;
    top: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.2);
    box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.3);
  }

  .coin.row-0,
  .control.row-0 {
    top: 0;
  }

  .coin.row-1,
  .control.row-1 {
    top: 100px;
  }

  .coin.row-2,
  .control.row-2 {
    top: 200px;
  }

  .coin.row-3,
  .control.row-3 {
    top: 300px;
  }

  .coin.row-4,
  .control.row-4 {
    top: 400px;
  }

  .coin.row-5,
  .control.row-5 {
    top: 500px;
  }

  .coin.col-1,
  .control.col-1 {
    left: 100px;
  }

  .coin.col-2,
  .control.col-2 {
    left: 200px;
  }

  .coin.col-3,
  .control.col-3 {
    left: 300px;
  }

  .coin.col-4,
  .control.col-4 {
    left: 400px;
  }

  .coin.col-5,
  .control.col-5 {
    left: 500px;
  }

  .coin.col-6,
  .control.col-6 {
    left: 600px;
  }

  .coin.chat:before,
  .control.chat:before {
    background: #22b14c;
  }

  .coin.streamer:before,
  .control.streamer:before {
    background: #fff200;
  }

  .coin.connected:after,
  .control.connected:after {
    background: rgba(255, 255, 255, 0.6);
  }

  .control.streamer:hover {
    opacity: 1;
  }

  .control.chat {
    opacity: 0.5;
    top: 0;
  }

  .control.streamer {
    opacity: 0.5;
    top: 0;
    cursor: pointer;
  }

  #board > div > div.overlay > img {
    filter: invert(27%) sepia(9%) saturate(6191%) hue-rotate(182deg) brightness(99%) contrast(86%);
  }

  .collabel {
    font-size: 1.5em;
    color: #000000;
    font-weight: bold;
  }

  .collabel2 {
    font-size: 1.5em;
    color: #000000;
    font-weight: bold;
    position: absolute;
    margin-top: 670px;
    margin-left: -15px;
  }

  .overlay {
    z-index: 100;
    position: absolute;
  }

  .overlaytext {
    position: relative;
    top: 50%;
    font-size: 2vw;
    text-shadow: -4px 4px 4px #000000;
    box-shadow: none !important;
  }

  .blur {
    -webkit-filter: blur(10px) grayscale(100%);
    -moz-filter: blur(10px) grayscale(100%);
    -o-filter: blur(10px) grayscale(100%);
    -ms-filter: blur(10px) grayscale(100%);
    filter: blur(10px) grayscale(100%);
    position: absolute;
  }

  .rack {
    display: inline-block;
  }

  .rack * {
    box-sizing: border-box;
    -ms-box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }

  /* donk */

  .controls,
  .message {
    position: relative;
    width: 700px;
    height: 100px;
    background: #aaaaaa;
    visibility: hidden;
    z-index: 1000;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  .controls.enabled,
  .message.enabled {
    visibility: visible;
  }

  .message {
    visibility: visible;
    line-height: 100px;
    text-align: center;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 3em;
  }

  .coins {
    position: relative;
    width: 700px;
    height: 600px;
    background: #969696;
    overflow: hidden;
  }

  .coin,
  .control {
    width: 100px;
    height: 100px;
    position: absolute;
    left: 0;
    top: -100px;
    transition: top 0.2s ease-in;
    -moz-transition: top 0.2s ease-in;
    -webkit-transition: top 0.2s ease-in;
  }

  .coin:before,
  .control:before {
    content: "";
    position: absolute;
    left: 10px;
    top: 10px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
  }

  .coin:after,
  .control:after {
    content: "";
    position: absolute;
    left: 20px;
    top: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.2);
    box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.3);
  }

  .coin.row-0,
  .control.row-0 {
    top: 0;
  }

  .coin.row-1,
  .control.row-1 {
    top: 100px;
  }

  .coin.row-2,
  .control.row-2 {
    top: 200px;
  }

  .coin.row-3,
  .control.row-3 {
    top: 300px;
  }

  .coin.row-4,
  .control.row-4 {
    top: 400px;
  }

  .coin.row-5,
  .control.row-5 {
    top: 500px;
  }

  .coin.col-1,
  .control.col-1 {
    left: 100px;
  }

  .coin.col-2,
  .control.col-2 {
    left: 200px;
  }

  .coin.col-3,
  .control.col-3 {
    left: 300px;
  }

  .coin.col-4,
  .control.col-4 {
    left: 400px;
  }

  .coin.col-5,
  .control.col-5 {
    left: 500px;
  }

  .coin.col-6,
  .control.col-6 {
    left: 600px;
  }

  .coin.chat:before,
  .control.chat:before {
    background: #22b14c;
  }

  .coin.streamer:before,
  .control.streamer:before {
    background: #fff200;
  }

  .coin.connected:after,
  .control.connected:after {
    background: rgba(255, 255, 255, 0.6);
  }

  .control.streamer:hover {
    opacity: 1;
  }

  .control.chat {
    opacity: 0.5;
    top: 0;
  }

  .control.streamer {
    opacity: 0.5;
    top: 0;
    cursor: pointer;
  }

  .overlay {
    z-index: 100;
    position: absolute;
  }
</style>
