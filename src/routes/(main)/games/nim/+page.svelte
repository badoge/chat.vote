<script>
  import { loadAndConnect } from "$lib/games";
  import { onMount } from "svelte";
  let elements;
  let NIM;
  onMount(async () => {
    elements = {
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

      //main
      popCondition: document.getElementById("popCondition"),
      popCountNumber: document.getElementById("popCountNumber"),
      settings: document.getElementById("settings"),
      fieldrows: Array.from(document.querySelectorAll("#nimfield div.nim-field-row")),
      gamestate: document.getElementById("nimgameState"),
      winmessage: document.querySelector("h4#nimwinMessage"),
      controls: document.querySelectorAll("div.nim-player-controls"),
      p1controls: Array.from(document.querySelectorAll("button.nim-p1-control")),
      totalVotes: document.getElementById("totalVotes"),
      chartCanvas: document.getElementById("chartCanvas"),
      overlay: document.getElementById("overlay"),
    };

    NIM = {
      ctx: elements.chartCanvas.getContext("2d"),
      chart: null,
      results: [
        { label: "1", data: 0, c1: "#f44336", c2: "#f53337" },
        { label: "2", data: 0, c1: "#f4c236", c2: "#f5c237" },
        { label: "3", data: 0, c1: "#a8f436", c2: "#a9e437" },
      ],
      game: {
        condition: "lose",
        initialCount: 20,
        count: 0,
        firstMove: 0,
        turn: 0,
      },
    }; //NIM
    let popsicles = document.querySelectorAll(".nim-popsicle");
    for (let i = 0; i < popsicles.length; i++) {
      popsicles[i].style.filter = `hue-rotate(${Math.random() * 360}deg)`;
    }

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

    initGraph();
    elements.overlay.innerHTML = `<span class="overlaytext">${USER.channel || "STREAMER"}'s turn</span>`;
  });

  let USER = {
    channel: "",
    twitchLogin: false,
    access_token: "",
    userID: "",
    platform: "",
  };

  let loginButton;
  let loginExpiredModal, aboutModal;
  let streamersTurn = true;
  let voters = [];

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
        updateGraph();
        return;
      }
    }
  } //handleMessage

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

    elements.totalVotes.innerHTML = `Total votes: ${total}`;
    NIM.chart.data.labels = label;
    NIM.chart.data.datasets.forEach((dataset) => {
      dataset.data = data;
      dataset.backgroundColor = c1;
      dataset.borderColor = c2;
    });
    NIM.chart.update();
  } //updateGraph

  function whoGoes() {
    // returns number of current player - player1 or player2
    return NIM.game.firstMove == NIM.game.turn % 2 ? 1 : 2;
  } //whoGoes

  function setInitialCount(event) {
    NIM.game.initialCount = Math.max(12, Math.min(36, parseInt(event.value, 10)));
    elements.popCountNumber.innerText = NIM.game.initialCount;
    NIM.game.count = NIM.game.initialCount;
    NIM.game.condition = elements.popCondition.value || "lose";
    NIM.game.turn = 0;
    elements.fieldrows.forEach((row) => (row.innerHTML = ""));
    NIM.game.firstMove = Math.round(Math.random()); // who goes first? player 1 or 2?
    // fill field with fresh tasty popsicles:
    let rowNm = 0; // add as many "div.field-row" as you want, script will fill them evenly
    for (let i = 0; i < NIM.game.count; i++) {
      let popsicle = document.createElement("div");
      popsicle.classList.add("nim-popsicle");
      popsicle.style.filter = `hue-rotate(${Math.random() * 360}deg)`; // a bit of flair
      elements.fieldrows[rowNm].appendChild(popsicle);
      rowNm += 1;
      if (rowNm >= elements.fieldrows.length) {
        rowNm = 0;
      }
    }
  } //setInitialCount

  function turn() {
    NIM.game.turn += 1;
    elements.p1controls.forEach((c) => (c.disabled = whoGoes() == 2));
    if (whoGoes() == 1) {
      streamersTurn = true;
      elements.chartCanvas.classList = "blur";
      elements.overlay.innerHTML = `<span class="overlaytext">${USER.channel || "STREAMER"}'s turn</span>`;
    } else {
      streamersTurn = false;
      elements.chartCanvas.classList = "";
      elements.overlay.innerHTML = "";
    }
  } //turn

  function makeMove(event) {
    let eatCount = 0;
    if (streamersTurn) {
      eatCount = parseInt(event.dataset.intake, 10);
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
      updateGraph();
    }
    NIM.game.count -= eatCount;
    turn();
    if (NIM.game.count < 1) {
      // check game end condition
      if (NIM.game.condition == "win") {
        NIM.game.turn += 1; // hack: switch player # depending on turn #
      }
      elements.winmessage.innerText = `${whoGoes() == 1 ? USER.channel : "Chat"} wins!`;
      elements.controls.forEach((c) => (c.style.visibility = "hidden"));
      elements.gamestate.style.visibility = "visible";
      elements.settings.style.display = "block";
    }
    // clear last-taken state from all the popsicles
    elements.fieldrows.forEach((row) => row.querySelectorAll("div.nim-popsicle.nim-last-taken").forEach((p) => p.classList.remove("nim-last-taken")));
    // iterator: eating the popsicles one by one
    const popsicles = elements.fieldrows.map((row) => Array.from(row.querySelectorAll("div.nim-popsicle")));
    // player1 eats leftmost popsicles, player2 eats rightmost ones
    let maxX = Math.max(...popsicles.map((p) => p.length));
    let maxY = popsicles.length;
    let x = whoGoes() == 2 ? 0 : maxX - 1;
    let y = whoGoes() == 2 ? 0 : maxY - 1;
    let dir = whoGoes() == 2 ? 1 : -1;
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
        if (x < 0 || x >= maxX) {
          break;
        }
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
    NIM.game.condition = elements.popCondition.value || "lose";
    NIM.game.turn = 0;
    elements.fieldrows.forEach((row) => (row.innerHTML = ""));
    NIM.game.firstMove = Math.round(Math.random()); // who goes first? player 1 or 2?
    if (NIM.game.firstMove == 1) {
      streamersTurn = true;
      elements.chartCanvas.classList = "blur";
      elements.overlay.innerHTML = `<span class="overlaytext">${USER.channel || "STREAMER"}'s turn</span>`;
    } else {
      streamersTurn = false;
      elements.chartCanvas.classList = "";
      elements.overlay.innerHTML = "";
    }

    // fill field with fresh tasty popsicles:
    let rowNm = 0; // add as many "div.field-row" as you want, script will fill them evenly
    for (let i = 0; i < NIM.game.count; i++) {
      let popsicle = document.createElement("div");
      popsicle.classList.add("nim-popsicle");
      popsicle.style.filter = `hue-rotate(${Math.random() * 360}deg)`; // a bit of flair
      elements.fieldrows[rowNm].appendChild(popsicle);
      rowNm += 1;
      if (rowNm >= elements.fieldrows.length) {
        rowNm = 0;
      }
    }
    // mandatory stuff
    elements.gamestate.style.visibility = "hidden";
    elements.controls.forEach((c) => (c.style.visibility = "visible"));
    elements.settings.style.display = "none";
    turn();
  } //startGame

  function reset() {
    elements.settings.style.display = "block";
    NIM.results = [
      { label: "1", data: 0, c1: "#f44336", c2: "#f53337" },
      { label: "2", data: 0, c1: "#f4c236", c2: "#f5c237" },
      { label: "3", data: 0, c1: "#a8f436", c2: "#a9e437" },
    ];
    elements.overlay.innerHTML = `<span class="overlaytext">${USER.channel || "STREAMER"}'s turn</span>`;
    elements.chartCanvas.classList = "blur";
    NIM.game.count = NIM.game.initialCount;
    NIM.game.condition = elements.popCondition.value || "lose";
    NIM.game.turn = 0;
    elements.fieldrows.forEach((row) => (row.innerHTML = ""));

    let rowNm = 0; // add as many "div.field-row" as you want, script will fill them evenly
    for (let i = 0; i < NIM.game.count; i++) {
      let popsicle = document.createElement("div");
      popsicle.classList.add("nim-popsicle");
      popsicle.style.filter = `hue-rotate(${Math.random() * 360}deg)`; // a bit of flair
      elements.fieldrows[rowNm].appendChild(popsicle);
      rowNm += 1;
      if (rowNm >= elements.fieldrows.length) {
        rowNm = 0;
      }
    }
    // mandatory stuff
    elements.gamestate.style.visibility = "hidden";
  } //reset
</script>

<svelte:head>
  <title>chat.vote Games - Nim</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="Classic. Remove popsicles until there's one left. Whoever takes the last one - loses!" />
  <meta name="keywords" content="chatvote, chat.vote, interactive, games, Twitch, chat" />
  <meta property="og:title" content="chat.vote Games - Nim" />
  <meta property="og:site_name" content="chat.vote Games - Nim" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chat.vote/games/nim/" />
  <meta property="og:image" content="https://screenshot.donk.workers.dev/?url=https://chat.vote/games/nim" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:description" content="Classic. Remove popsicles until there's one left. Whoever takes the last one - loses!" />

  <script src="/games.js"></script>
</svelte:head>

<div class="modal fade" id="howToPlayModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="howToPlayTitle">How to play - nim</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="howToPlayBody">
        <p>There are some popsicles lying around (20 by default). Players take turns to eat them.</p>
        <p>A player can eat 1, 2, or 3 popsicles at once.</p>
        <p>Whoever eats the LAST popsicle - wins or loses the game! (depending on your settings)</p>
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
  <div class="container-fluid p-0" id="gameDiv">
    <div class="card m-3 bg-body-tertiary" id="nimgame">
      <div class="card-body" id="nimfield">
        <!-- div.field-row have dynamic contents! -->
        <div class="nim-field-row">
          <div class="nim-popsicle"></div>
          <div class="nim-popsicle"></div>
          <div class="nim-popsicle"></div>
          <div class="nim-popsicle"></div>
          <div class="nim-popsicle"></div>
        </div>
        <div class="nim-field-row">
          <div class="nim-popsicle"></div>
          <div class="nim-popsicle"></div>
          <div class="nim-popsicle"></div>
          <div class="nim-popsicle"></div>
          <div class="nim-popsicle"></div>
        </div>
        <div class="nim-field-row">
          <div class="nim-popsicle"></div>
          <div class="nim-popsicle"></div>
          <div class="nim-popsicle"></div>
          <div class="nim-popsicle"></div>
          <div class="nim-popsicle"></div>
        </div>
        <div class="nim-field-row">
          <div class="nim-popsicle"></div>
          <div class="nim-popsicle"></div>
          <div class="nim-popsicle"></div>
          <div class="nim-popsicle"></div>
          <div class="nim-popsicle"></div>
        </div>
      </div>
    </div>

    <div class="row m-1">
      <div class="col-8">
        <div class="row">
          <div class="col-6">
            <div class="card">
              <div class="card-body">
                <div class="nim-player-controls">
                  <h4>Streamer</h4>
                  <div class="btn-group" role="group">
                    <button disabled type="button" class="btn btn-success nim-p1-control" data-intake="1" onclick={makeMove}>Eat 1</button>
                    <button disabled type="button" class="btn btn-success nim-p1-control" data-intake="2" onclick={makeMove}>Eat 2</button>
                    <button disabled type="button" class="btn btn-success nim-p1-control" data-intake="3" onclick={makeMove}>Eat 3</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="card">
              <div class="card-body">
                <h4>Chat</h4>
                <div id="chartDiv" class="chart-container">
                  <div id="overlay"></div>
                  <canvas id="chartCanvas" class="blur"></canvas>
                </div>
                <span id="totalVotes">Total votes: 0</span><br />
                <button type="button" onclick={makeMove} class="btn btn-success">Play chat's pick</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-4" id="settings">
        <label for="popCount" class="form-label">Popsicle count: <span id="popCountNumber">20</span></label>
        <input type="range" class="form-range" value="20" min="12" max="36" step="1" name="popCount" id="popCount" oninput={setInitialCount} />
        <br />
        <div class="input-group">
          <label class="input-group-text" for="popCondition">Player who eats the last popsicle</label>
          <select class="form-select" name="popCondition" id="popCondition">
            <option value="lose" selected>Loses</option>
            <option value="win">Wins</option>
          </select>
        </div>
        <button type="button" class="btn btn-success mt-3" id="nimstartGame" onclick={startGame}>Start game</button>
        <div id="nimgameState" style="visibility: hidden">
          <h4 id="nimwinMessage">Win message goes here</h4>
          <button type="button" class="btn btn-success" id="nimrestartGame" onclick={startGame}>Play again</button>
        </div>
      </div>
    </div>
  </div>
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

  #nimgame {
    display: flex;
    flex-flow: row wrap;
  }

  .nim-controls {
    flex: 1 0 auto;
    margin: 0.3em 0;
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    justify-content: space-around;
  }

  div#nimfield {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
  }

  div.nim-field-row {
    flex: 1 0 auto;
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    margin: 0.5em 0;
  }

  div.nim-popsicle {
    border: 1px solid transparent;
    flex: 1 0 auto;
    min-height: 4em;
    width: auto;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMTE4LjgxMyAxMTguODEzIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMTguODEzIDExOC44MTM7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxwYXRoIHN0eWxlPSJmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOiM2OTY5Njk7IiBkPSJNNTkuNDA2LDY5LjMwNUw1OS40MDYsNjkuMzA1YzIuMjUsMCw0LjA5LDEuODQxLDQuMDksNC4wOTENCgkJdjQxLjMyOGMwLDIuMjQ5LTEuODM5LDQuMDg5LTQuMDg5LDQuMDg5aDBjLTIuMjQ5LDAtNC4wODktMS44NC00LjA4OS00LjA4OVY3My4zOTZDNTUuMzE2LDcxLjE0Niw1Ny4xNTcsNjkuMzA1LDU5LjQwNiw2OS4zMDV6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO2ZpbGw6I0ZDNUEyOTsiIGQ9Ik00OC42NjMsMGgyMS40ODdjMy42NDEsMCw1LjgyNywyLjYxOCw2LjE5MSw3LjY4NQ0KCQlsNS4wOTksNzAuOTYyYzAuMzAyLDQuMjA5LTMuNjI1LDcuNjg1LTguMDU1LDcuNjg1SDQ1LjQyN2MtNC40MywwLTguMzU3LTMuNDc1LTguMDU0LTcuNjg1bDUuMDk5LTcwLjk2Mg0KCQlDNDIuODQ2LDIuNDgyLDQ0LjgxLDAsNDguNjYzLDB6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO2ZpbGw6I0ZGOEE2NjsiIGQ9Ik02MS44MTksMTEuNTA1Vjc0LjRjMCwzLjc0NCwyLjI4OSw2Ljg4NCw1LjA4Nyw2LjgxDQoJCWwzLjkxMS0wLjEwM2MyLjc5Ny0wLjA3Miw1LjI3Ny0zLjA3OSw1LjA4Ni02LjgxMWwtMy4yMTktNjIuODk1QzcyLjIyNiwyLjQ3Nyw2MS44MTksMS42MjgsNjEuODE5LDExLjUwNUw2MS44MTksMTEuNTA1eg0KCQkgTTU2Ljk5NCwxMS41MDVWNzQuNGMwLDMuNzQ0LTIuMjkxLDYuODg0LTUuMDg3LDYuODFsLTMuOTExLTAuMTAzYy0yLjc5Ny0wLjA3Mi01LjI3OC0zLjA3OS01LjA4Ny02LjgxMWwzLjIyLTYyLjg5NQ0KCQlDNDYuNTg2LDIuNDc3LDU2Ljk5NCwxLjYyOCw1Ni45OTQsMTEuNTA1eiIvPg0KCTxwYXRoIHN0eWxlPSJmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOiM3NkRFQ0I7IiBkPSJNNzkuOTI0LDU3LjU1NGwxLjUxNiwyMS4wOTMNCgkJYzAuMzAyLDQuMjA5LTMuNjI1LDcuNjg1LTguMDU1LDcuNjg1SDQ1LjQyN2MtNC40MywwLTguMzU3LTMuNDc1LTguMDU0LTcuNjg1bDEuNTE1LTIxLjA5M0g3OS45MjR6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO2ZpbGw6I0Y5QUY0NjsiIGQ9Ik00OC42NjMsMGgyMS40ODdjMy42NDEsMCw1LjgyNywyLjYxOCw2LjE5MSw3LjY4NQ0KCQlsMS41MTUsMjEuMDkzaC0zNi45bDEuNTE2LTIxLjA5M0M0Mi44NDYsMi40ODIsNDQuODEsMCw0OC42NjMsMHoiLz4NCgk8cGF0aCBzdHlsZT0iZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7ZmlsbDojRkZENTk5OyIgZD0iTTYxLjgxOSwxMS41MDV2MTcuMjcyaDExLjc1NGwtMC44OS0xNy4zNzYNCgkJQzcyLjIyNiwyLjQ3OCw2MS44MTksMS42MjgsNjEuODE5LDExLjUwNUw2MS44MTksMTEuNTA1eiBNNTYuOTk0LDI4Ljc3N0g0NS4yMzlsMC44ODktMTcuMzc2DQoJCWMwLjQ1OC04LjkyNCwxMC44NjUtOS43NzMsMTAuODY1LDAuMTA0VjI4Ljc3N3oiLz4NCgk8cGF0aCBzdHlsZT0iZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7ZmlsbDojRDlGRkY4OyIgZD0iTTYxLjgxOSw1Ny41NTRWNzQuNGMwLDMuNzQ0LDIuMjg5LDYuODgzLDUuMDg3LDYuODENCgkJbDMuOTExLTAuMTAzYzIuNzk3LTAuMDcyLDUuMjc3LTMuMDc5LDUuMDg2LTYuODFsLTAuODU2LTE2Ljc0M0g2MS44MTlMNjEuODE5LDU3LjU1NHogTTQzLjc2Niw1Ny41NTRoMTMuMjI4Vjc0LjQNCgkJYzAsMy43NDQtMi4yOTEsNi44ODMtNS4wODcsNi44MWwtMy45MTEtMC4xMDNjLTIuNzk3LTAuMDcyLTUuMjc4LTMuMDc5LTUuMDg3LTYuODFMNDMuNzY2LDU3LjU1NHoiLz4NCjwvZz4NCjwvc3ZnPg0K");
  }

  div.nim-popsicle.nim-taken {
    opacity: 0.5;
    filter: grayscale(100%) !important;
  }

  div.nim-popsicle.nim-last-taken {
    background-color: rgba(0, 0, 0, 0.33);
    border: 1px solid rgba(32, 32, 32, 0.7);
  }

  div.nim-player-controls {
    flex: 0 auto;
    display: flex;
    flex-flow: column nowrap;
    text-align: center;
  }

  div#nimgameState {
    flex: 1 0 auto;
    text-align: center;
  }

  h4#nimwinMessage {
    color: yellow;
  }

  #chartDiv {
    position: relative;
    height: 40vh;
    width: 100%;
  }

  #overlay {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .overlaytext {
    position: relative;
    top: 40%;
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
</style>
