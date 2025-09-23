<script>
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
  function handleMessage(target, context, msg, self) {
    let input = msg.split(" ").filter(Boolean);

    if (streamersTurn) {
      return;
    }

    let vote_int = parseInt(input[0], 10);
    if (isNaN(vote_int)) {
      return;
    }
    if (vote_int > 0 && vote_int < 10) {
      if (!voters.includes(context.username)) {
        if (TTT.gameBoard[vote_int - 1]) {
          return;
        }
        voters.push(context.username);
        let index = TTT.results.findIndex((obj) => obj.label == vote_int);
        TTT.results[index].data += 1;
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

    initGraph();
    listeners();
    document.getElementById("tttoverlay").innerHTML = `<span class="overlaytext">${USER.channel || "STREAMER"}'s turn</span>`;
  }; //onload

  function initGraph() {
    if (TTT.chart) {
      TTT.chart.destroy();
    }

    TTT.chart = new Chart(TTT.ctx, {
      type: "bar",
      data: {
        labels: [
          "1 - 0 Votes (0%)",
          "2 - 0 Votes (0%)",
          "3 - 0 Votes (0%)",
          "4 - 0 Votes (0%)",
          "5 - 0 Votes (0%)",
          "6 - 0 Votes (0%)",
          "7 - 0 Votes (0%)",
          "8 - 0 Votes (0%)",
          "9 - 0 Votes (0%)",
        ],
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
              textStrokeColor: "rgba(0,0,0,1)",
              textStrokeWidth: 2,
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
    label = TTT.results.map((a) => a.label);
    data = TTT.results.map((a) => a.data);
    c1 = TTT.results.map((a) => a.c1);
    c2 = TTT.results.map((a) => a.c2);

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

    document.getElementById("totalvotesttt").innerHTML = `Total votes: ${total}`;

    TTT.chart.data.labels = label;
    TTT.chart.data.datasets.forEach((dataset) => {
      dataset.data = data;
      dataset.backgroundColor = c1;
      dataset.borderColor = c2;
    });
    TTT.chart.update();
  } //updateGraph

  let TTT = {
    chart: null,
    isComputerPlaying: false,
    isGameOver: false,
    gameBoard: [null, null, null, null, null, null, null, null, null],
    squares: $(".square"),
    ctx: document.getElementById("tttchartCanvas").getContext("2d"),
    results: [
      { label: "1", data: 0, c1: "#f44336", c2: "#f53337" },
      { label: "2", data: 0, c1: "#f4c236", c2: "#f5c237" },
      { label: "3", data: 0, c1: "#a8f436", c2: "#a9e437" },
      { label: "4", data: 0, c1: "#36f443", c2: "#37e444" },
      { label: "5", data: 0, c1: "#36f4c2", c2: "#37e4c3" },
      { label: "6", data: 0, c1: "#36a8f4", c2: "#3798f5" },
      { label: "7", data: 0, c1: "#4336f4", c2: "#4426f5" },
      { label: "8", data: 0, c1: "#a236d4", c2: "#a326d5" },
      { label: "9", data: 0, c1: "#f336b8", c2: "#f426b9" },
    ],
    winningCombos: [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ],
    pieceClasses: {
      X: "text-success",
      O: "text-warning",
    },
  }; //TTT

  function updateGameBoard(index, value, el) {
    TTT.gameBoard[index] = value;
    el.html(value);
    el.addClass([TTT.pieceClasses[value], "text-shadow"]);

    let donk = document.getElementsByClassName("choices");
    for (let i = 0, j = donk.length; i < j; i++) {
      donk[i].innerHTML = 0;
      if (TTT.gameBoard[i]) {
        $(donk[i]).parent().addClass("text-body-secondary");
      }
    }
  } //updateGameBoard

  function reset() {
    init();
    TTT.squares.removeClass(["text-shadow"].concat(Object.values(TTT.pieceClasses)));
    document.getElementById("totalvotesttt").innerHTML = `Total votes: 0`;
    document.getElementById("tttoutput").innerHTML = "";
    document.getElementById("tttchartCanvas").classList = "blur";
    document.getElementById("tttoverlay").innerHTML = `<span class="overlaytext">${USER.channel || "STREAMER"}'s turn</span>`;
    TTT.results = [
      { label: "1", data: 0, c1: "#f44336", c2: "#f53337" },
      { label: "2", data: 0, c1: "#f4c236", c2: "#f5c237" },
      { label: "3", data: 0, c1: "#a8f436", c2: "#a9e437" },
      { label: "4", data: 0, c1: "#36f443", c2: "#37e444" },
      { label: "5", data: 0, c1: "#36f4c2", c2: "#37e4c3" },
      { label: "6", data: 0, c1: "#36a8f4", c2: "#3798f5" },
      { label: "7", data: 0, c1: "#4336f4", c2: "#4426f5" },
      { label: "8", data: 0, c1: "#a236d4", c2: "#a326d5" },
      { label: "9", data: 0, c1: "#f336b8", c2: "#f426b9" },
    ];
  } //reset

  function init() {
    for (let i = 0, j = TTT.squares.length; i < j; i++) {
      TTT.squares[i].innerHTML = `<span class="text-body-secondary">${i + 1}</span>`;
    }
    TTT.gameBoard = [null, null, null, null, null, null, null, null, null];
    TTT.isComputerPlaying = false;
    TTT.isGameOver = false;
    document.getElementById("gameboard").classList = "pointer";
  } //init

  function checkWin(value) {
    for (let combo = 0, j = TTT.winningCombos.length; combo < j; combo++) {
      if (TTT.winningCombos[combo].every((i) => TTT.gameBoard[i] === value)) {
        return endGame(value);
      }
    }

    if (TTT.gameBoard.every((field) => field !== null)) {
      return endGame("draw");
    }

    return false;
  } //checkWin

  function endGame(value) {
    if (value === "X") {
      document.getElementById("tttoutput").innerHTML = `${USER.channel} wins<br> <button type="button" onclick="resetGame()" class="btn btn-primary">Play again</button>`;
    } else if (value === "O") {
      document.getElementById("tttoutput").innerHTML = `Chat wins<br> <button type="button" onclick="resetGame()" class="btn btn-primary">Play again</button>`;
    } else {
      document.getElementById("tttoutput").innerHTML = `Draw<br> <button type="button" onclick="resetGame()" class="btn btn-primary">Play again</button>`;
    }
    TTT.isGameOver = true;
    //	let playAgain = confirm("Click Ok to play again...");
    //	if(playAgain){
    //		init();
    //	}

    return true;
  } //endGame

  function getChatMove() {
    let list = TTT.results;
    list.sort(function (a, b) {
      return a.data > b.data ? -1 : a.data == b.data ? 0 : 1;
    });
    return list[0];
  } //getChatMove

  function playTurn() {
    if (voters.length == 0) {
      return;
    }
    streamersTurn = true;
    document.getElementById("tttchartCanvas").classList = "blur";
    document.getElementById("tttoverlay").innerHTML = `<span class="overlaytext">${USER.channel || "STREAMER"}'s turn</span>`;
    voters = [];
    let theSquareToPlay = getChatMove();
    theSquareToPlay = theSquareToPlay.label;
    TTT.results = TTT.results.filter(function (el) {
      return el.label != theSquareToPlay;
    });
    TTT.results.forEach((element, index) => {
      TTT.results[index].data = 0;
    });
    TTT.results.sort(function (a, b) {
      return parseInt(a.label, 10) < parseInt(b.label, 10) ? -1 : parseInt(a.label, 10) == parseInt(b.label, 10) ? 0 : 1;
    });
    updateGraph();
    let $theSelectedSquare = $(".square-0" + `${parseInt(theSquareToPlay, 10) - 1}`);
    updateGameBoard(`${parseInt(theSquareToPlay, 10) - 1}`, "O", $theSelectedSquare);
    if (checkWin("O")) {
      document.getElementById("tttoverlay").innerHTML = "";
    }
    TTT.isComputerPlaying = false;
    document.getElementById("gameboard").classList = "cursorpointer";
    document.getElementById("totalvotesttt").innerHTML = `Total votes: 0`;
  } //playTurn

  function listeners() {
    TTT.squares.click(function () {
      let squareIndexValue = parseInt($(this).data("index"), 10);
      if (TTT.isGameOver || TTT.isComputerPlaying || TTT.gameBoard[squareIndexValue] !== null) {
        return;
      }

      streamersTurn = false;
      voters = [];

      document.getElementById("gameboard").classList = "cursordefault";
      document.getElementById("tttchartCanvas").classList = "";
      document.getElementById("tttoverlay").innerHTML = "";

      updateGameBoard(squareIndexValue, "X", $(this));
      checkWin("X");

      TTT.isComputerPlaying = true;
      TTT.results = TTT.results.filter((el) => el.label != `${squareIndexValue + 1}`);
      TTT.results.forEach((element, index) => {
        TTT.results[index].data = 0;
      });
      updateGraph();
    }); //TTT click
  } //listeners

  function resetGame() {
    voters = [];
    initGraph();
    streamersTurn = true;
    reset();
  } //resetGame
</script>

<svelte:head>
  <title>chat.vote Games - tic tac toe</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="An ancient game of wits. Will you outsmart the hive mind - which is your chat?" />
  <meta name="keywords" content="chatvote, chat.vote, interactive, games, Twitch, chat" />
  <meta property="og:title" content="chat.vote Games - tic tac toe" />
  <meta property="og:site_name" content="chat.vote Games - tic tac toe" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chat.vote/games/tictactoe/" />
  <meta property="og:image" content="https://screenshot.donk.workers.dev/?url=https://chat.vote/games/tictactoe" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:description" content="An ancient game of wits. Will you outsmart the hive mind - which is your chat?" />

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
        <h5 class="modal-title" id="howToPlayTitle">How to play - tictactoe</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="howToPlayBody">
        <p>1. Streamer makes a move</p>
        <p>2. Chat picks a square by typing a number in chat</p>
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
        <div class="card h-100">
          <img src="/games/pics/c4.png" onclick="switchGame('c4')" class="card-img-top" alt="Connect 4" />
          <div class="card-body">
            <h5 class="card-title">Connect 4</h5>
            <p class="card-text">Players take turns to drop their pieces into the container, attempting to connect 4 of their pieces in a row.</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100 bg-body-tertiary border-light">
          <img src="/games/pics/ttt.png" onclick="toggleGrid()" class="card-img-top" alt="tic tac toe" />
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
            <b id="gameName">tic tac toe</b>
          </div>
        </div>
      </div>
    </div>
    <div class="row" id="gameRow">
      <div class="row">
        <div class="col-xl-7">
          <div class="wrapper">
            <main id="gameboard" class="cursorpointer">
              <div class="rows">
                <div class="square square-00" data-index="0"><span class="text-body-secondary">1</span></div>
                <div class="square square-01" data-index="1"><span class="text-body-secondary">2</span></div>
                <div class="square square-02" data-index="2"><span class="text-body-secondary">3</span></div>
              </div>
              <div class="rows row2">
                <div class="square square-03" data-index="3"><span class="text-body-secondary">4</span></div>
                <div class="square square-04" data-index="4"><span class="text-body-secondary">5</span></div>
                <div class="square square-05" data-index="5"><span class="text-body-secondary">6</span></div>
              </div>
              <div class="rows">
                <div class="square square-06" data-index="6"><span class="text-body-secondary">7</span></div>
                <div class="square square-07" data-index="7"><span class="text-body-secondary">8</span></div>
                <div class="square square-08" data-index="8"><span class="text-body-secondary">9</span></div>
              </div>
            </main>
          </div>
        </div>
        <div class="col-xl-5 centertext">
          <button type="button" onclick="playTurn()" class="btn btn-lg btn-success">Play chat's turn</button>
          <div id="tttoutput"></div>
          <div id="tttchartdiv" class="chart-container">
            <div id="tttoverlay"></div>
            <canvas id="tttchartCanvas" class="blur"></canvas>
          </div>
          <span id="totalvotesttt">Total votes: 0</span>
        </div>
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

  #tttchartdiv {
    position: relative;
    height: 80vh;
    width: 100%;
  }

  #tttoverlay {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .centertext {
    text-align: center;
  }

  .blur {
    -webkit-filter: blur(10px) grayscale(100%);
    -moz-filter: blur(10px) grayscale(100%);
    -o-filter: blur(10px) grayscale(100%);
    -ms-filter: blur(10px) grayscale(100%);
    filter: blur(10px) grayscale(100%);
    position: absolute;
  }

  .text-shadow {
    text-shadow: 0px 0px 4px #000000;
  }

  .wrapper {
    width: 666px;
    padding: 30px;
    box-shadow: 1px 4px 8px #000000;
    position: relative;
    background-color: #6b6b6b;
  }

  .rows {
    height: 200px;
    width: 100%;
  }

  .row2 {
    height: 206px;
    border-top: 6px solid black;
    border-bottom: 6px solid black;
  }

  .square {
    width: 200px;
    height: 200px;
    float: left;
    line-height: 200px;
    text-align: center;
    font-size: 100px;
    font-weight: bold;
  }

  .cursorpointer {
    cursor: pointer;
  }

  .cursordefault {
    cursor: default;
  }

  .square-01,
  .square-04,
  .square-07 {
    width: 206px;
    border-left: 6px solid black;
    border-right: 6px solid black;
  }

  img.icon {
    width: 1.3em;
    height: auto;
    vertical-align: middle;
  }
</style>
