<script>
  let voters = [];

  import { onMount } from "svelte";
  let elements;
  let SHAPES;
  let bootstrap;
  onMount(async () => {
    bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");
    elements = {
      //modals
      grid: document.getElementById("grid"),
      gameDiv: document.getElementById("gameDiv"),

      aboutModal: document.getElementById("aboutModal"),

      //navbar
      status: document.getElementById("status"),
      topRight: document.getElementById("topRight"),
      loginButton: document.getElementById("loginButton"),
      channelName: document.getElementById("channelName"),
    };

    SHAPES = {
      field: document.getElementById("field"),
      figureList: Array.from(document.querySelectorAll("#field div.figure")),
      optionList: Array.from(document.querySelectorAll("#variants div.figure")),
      startBtn: document.querySelector("#startshapesbtn"),
      dVariants: document.querySelector("#variants"),
      dResult: document.querySelector("#shapesgameResult"),
      dDifficulty: document.querySelector("select#difficulty"),
      dStartingLives: document.querySelector("#startinglives"),
      lblStartingLives: document.querySelector("#startingliveslabel"),
      dShapesLength: document.getElementById("shapeslength"),
      lblShapesLength: document.getElementById("shapeslengthlabel"),
      lives: document.querySelector("#lives"),
      ctx: document.getElementById("shapeschartCanvas").getContext("2d"),
      chart: null,
      results: [
        { label: "1", data: 0, c1: "#f44336", c2: "#f53337" },
        { label: "2", data: 0, c1: "#f4c236", c2: "#f5c237" },
        { label: "3", data: 0, c1: "#a8f436", c2: "#a9e437" },
      ],
      shapesGame: {
        figs: [],
        choices: [],
        correct: -1,
        lives: 0,
        difficulty: 0,
        rule: null,
        gameStarted: false,
      },
    }; //SHAPES

    if (!USER.channel) {
      loginButton = new bootstrap.Popover(elements.loginButton);
    }

    aboutModal = new bootstrap.Modal(elements.aboutModal);

    enableTooltips();
    enablePopovers();

    elements.channelName.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        connect();
      }
    });

    initGraph();

    listeners();
  });

  let loginButton;

  let aboutModal;

  let USER = {
    channel: "",
    twitchLogin: false,
    access_token: "",
    userID: "",
    platform: "",
  };
  function handleMessage(target, context, msg, self) {
    let input = msg.split(" ").filter(Boolean);
    let vote_int = parseInt(input[0], 10);
    if (isNaN(vote_int)) {
      return;
    }
    if (vote_int > 0 && vote_int < 4) {
      if (!voters.includes(context.username)) {
        voters.push(context.username);
        let index = SHAPES.results.findIndex((obj) => obj.label == vote_int);
        SHAPES.results[index].data += 1;
        updateGraph();
        return;
      }
    }
  } //handleMessage

  function initGraph() {
    if (SHAPES.chart) {
      SHAPES.chart.destroy();
    }

    SHAPES.chart = new Chart(SHAPES.ctx, {
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

    label = SHAPES.results.map((a) => a.label);
    data = SHAPES.results.map((a) => a.data);
    c1 = SHAPES.results.map((a) => a.c1);
    c2 = SHAPES.results.map((a) => a.c2);

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

    document.getElementById("totalvotesshapes").innerHTML = `Total votes: ${total}`;
    SHAPES.chart.data.labels = label;
    SHAPES.chart.data.datasets.forEach((dataset) => {
      dataset.data = data;
      dataset.backgroundColor = c1;
      dataset.borderColor = c2;
    });
    SHAPES.chart.update();
  } //updateGraph

  function drawShapes() {
    SHAPES.figureList.forEach((f, i) => {
      const fig = SHAPES.shapesGame.figs[i];
      f.classList = "figure";
      if (!fig) {
        f.classList = "figure unknown";
        if (i == SHAPES.shapesGame.figs.length) f.classList.add("next");
      } else {
        f.classList.add(fig.size ? "big" : "small");
        f.classList.add(fig.type ? "circle" : "square2");
        f.classList.add(fig.color ? "blue" : "red");
      }
    });
    if (!SHAPES.shapesGame.gameStarted) return;
    SHAPES.optionList.forEach((f, i) => {
      const fig = SHAPES.shapesGame.choices[i];
      f.classList = "figure option";
      f.classList.add(fig.size ? "big" : "small");
      f.classList.add(fig.type ? "circle" : "square2");
      f.classList.add(fig.color ? "blue" : "red");
      if (fig.isKnownToBeIncorrect()) f.classList.add("unpickable");
    });
    SHAPES.dVariants.style.visibility = "visible";
    SHAPES.lives.innerHTML = `Lives: ${"❤".repeat(SHAPES.shapesGame.lives)}`;
  } //drawShapes

  function generateChoices() {
    SHAPES.shapesGame.choices = new Array(3).fill(null);
    SHAPES.shapesGame.correct = Math.floor(Math.random() * SHAPES.shapesGame.choices.length);
    SHAPES.shapesGame.choices[SHAPES.shapesGame.correct] = SHAPES.shapesGame.rule.gen(SHAPES.shapesGame.figs[SHAPES.shapesGame.figs.length - 1]);
    for (let i = 0; i < SHAPES.shapesGame.choices.length; i++) {
      while (!SHAPES.shapesGame.choices[i]) {
        let f = SHAPES.shapesGame.rule.fake(SHAPES.shapesGame.figs[SHAPES.shapesGame.figs.length - 1]);
        if (SHAPES.shapesGame.choices.every((c) => !f.isEqual(c))) {
          SHAPES.shapesGame.choices[i] = f;
        }
      }
    }
  } //generateChoices

  function endGame(win = false) {
    if (!win) {
      SHAPES.lives.innerHTML = `Lives: 💀`;
    }

    SHAPES.shapesGame.gameStarted = false;
    document.querySelectorAll(".hide-after-game").forEach((e) => {
      e.style.display = "none";
    });
    document.querySelector("#endMessage").innerText = win ? "Congrats! You've filled the row!" : "YOU LOST! Wow, you are so bad at this game!";
    document.querySelector("#rule").innerText = SHAPES.shapesGame.rule.desc;
    SHAPES.dVariants.style.visibility = "hidden";
    SHAPES.dResult.style.visibility = "visible";
    SHAPES.startBtn.disabled = false;
    SHAPES.dDifficulty.disabled = false;
    SHAPES.dStartingLives.disabled = false;
    SHAPES.dShapesLength.disabled = false;
  } //endGame

  function makeChoice(event) {
    if (!SHAPES.shapesGame.gameStarted) return;
    try {
      if (event.target.classList.contains("unpickable")) return;
      const selected = parseInt(event.target.dataset.choice, 10);
      if (selected !== SHAPES.shapesGame.correct) {
        SHAPES.results = SHAPES.results.filter(function (el) {
          return parseInt(el.label, 10) != selected + 1;
        });
        updateGraph();
        SHAPES.shapesGame.lives -= 1;
        SHAPES.shapesGame.choices[selected].isKnownToBeIncorrect(true);
        showToast("Incorrect choice!", "danger", 3000);

        if (SHAPES.shapesGame.lives < 1) {
          endGame(false);
        }
      } else {
        SHAPES.results = [
          { label: "1", data: 0, c1: "#f44336", c2: "#f53337" },
          { label: "2", data: 0, c1: "#f4c236", c2: "#f5c237" },
          { label: "3", data: 0, c1: "#a8f436", c2: "#a9e437" },
        ];
        updateGraph();
        SHAPES.shapesGame.figs.push(SHAPES.shapesGame.choices[SHAPES.shapesGame.correct]);
        if (SHAPES.shapesGame.figs.length >= SHAPES.figureList.length) {
          endGame(true);
        } else {
          generateChoices();
        }
      }
      drawShapes();
    } catch (e) {
      console.warn(e);
      console.log("Event causing an error: ", event);
    }
  } //makeChoice

  function start() {
    SHAPES.dResult.style.visibility = "hidden";
    SHAPES.dStartingLives.disabled = true;
    SHAPES.dShapesLength.disabled = true;
    SHAPES.startBtn.disabled = true;
    SHAPES.dDifficulty.disabled = true;
    document.querySelectorAll(".hide-after-game").forEach((e) => {
      e.style.display = "";
    });
    SHAPES.shapesGame.difficulty = parseInt(SHAPES.dDifficulty.value, 10) || 0;
    SHAPES.shapesGame.lives = parseInt(SHAPES.dStartingLives.value, 10) || 1;
    const rulePool = rules[Object.keys(rules)[SHAPES.shapesGame.difficulty]];
    SHAPES.shapesGame.rule = rulePool[Math.floor(Math.random() * rulePool.length)];
    SHAPES.shapesGame.figs.length = 0;
    SHAPES.shapesGame.figs.push(new Figure());
    for (let i = 1; i < 3; i++) {
      SHAPES.shapesGame.figs.push(SHAPES.shapesGame.rule.gen(SHAPES.shapesGame.figs[SHAPES.shapesGame.figs.length - 1]));
    }
    SHAPES.shapesGame.gameStarted = true;
    generateChoices();
    drawShapes();
    SHAPES.results = [
      { label: "1", data: 0, c1: "#f44336", c2: "#f53337" },
      { label: "2", data: 0, c1: "#f4c236", c2: "#f5c237" },
      { label: "3", data: 0, c1: "#a8f436", c2: "#a9e437" },
    ];
    updateGraph();
  } //start

  function reset() {
    SHAPES.dResult.style.visibility = "hidden";
    SHAPES.startBtn.disabled = false;
    SHAPES.dDifficulty.disabled = false;
    SHAPES.shapesGame = {
      figs: [],
      choices: [],
      correct: -1,
      lives: 0,
      difficulty: 0,
      rule: null,
      gameStarted: false,
    };
    SHAPES.results = [
      { label: "1", data: 0, c1: "#f44336", c2: "#f53337" },
      { label: "2", data: 0, c1: "#f4c236", c2: "#f5c237" },
      { label: "3", data: 0, c1: "#a8f436", c2: "#a9e437" },
    ];
  } //reset

  function playTurn() {
    let list = SHAPES.results;
    list.sort(function (a, b) {
      return a.data > b.data ? -1 : a.data == b.data ? 0 : 1;
    });

    SHAPES.optionList[parseInt(list[0].label, 10) - 1].click();
    voters = [];
    for (let index = 0; index < SHAPES.results.length; index++) {
      SHAPES.results[index].data = 0;
    }
    SHAPES.results.sort(function (a, b) {
      return parseInt(a.label, 10) < parseInt(b.label, 10) ? -1 : parseInt(a.label, 10) == parseInt(b.label, 10) ? 0 : 1;
    });
    updateGraph();
  } //playTurn

  function listeners() {
    const updateStartingLivesListener = function () {
      document.getElementById("lives").innerHTML = `Lives: ${"❤".repeat(parseInt(this.value, 10))}`;
      SHAPES.lblStartingLives.innerText = this.value;
    };
    SHAPES.dStartingLives.oninput = updateStartingLivesListener;
    SHAPES.dStartingLives.onchange = updateStartingLivesListener;
    SHAPES.dStartingLives.dispatchEvent(new Event("change")); // instantly calls listener

    const updateLengthListener = function () {
      const count = parseInt(this.value, 10) || 5;
      SHAPES.lblShapesLength.innerText = count;

      while (field.firstChild) {
        field.removeChild(field.lastChild);
      }

      const figslist = [];
      for (let i = 0; i < count; i++) {
        const div = document.createElement("div");
        div.classList = "figure unknown";
        SHAPES.field.appendChild(div);
        figslist.push(div);
      }
      SHAPES.figureList = figslist;
    };
    SHAPES.dShapesLength.oninput = updateLengthListener;
    SHAPES.dShapesLength.onchange = updateLengthListener;
    SHAPES.dShapesLength.dispatchEvent(new Event("change")); // instantly calls listener

    SHAPES.optionList.forEach((o) => o.addEventListener("click", makeChoice));
  } //listeners

  class Figure {
    constructor(isCircle, isBlue, isBig) {
      this.type = Boolean(isCircle === null ? Math.round(Math.random()) : isCircle);
      this.color = Boolean(isBlue === null ? Math.round(Math.random()) : isBlue);
      this.size = Boolean(isBig === null ? Math.round(Math.random()) : isBig);
    }

    isEqual(figure) {
      if (!figure) return false;
      return this.type === figure.type && this.color === figure.color && this.size === figure.size;
    }

    isKnownToBeIncorrect(set = false) {
      if (set) this.isBad = true;
      return this.isBad || false;
    }
  }

  const rules = {
    easy: [
      {
        desc: "Next figure must be of SAME COLOR as the last one",
        fake: (f) => new Figure(null, !f.color, null),
        gen: (f) => new Figure(null, f.color, null),
      },
      {
        desc: "Next figure must be of SAME SIZE as the last one",
        fake: (f) => new Figure(null, null, !f.size),
        gen: (f) => new Figure(null, null, f.size),
      },
      {
        desc: "Next figure must be of SAME SHAPE as the last one",
        fake: (f) => new Figure(!f.type, null, null),
        gen: (f) => new Figure(f.type, null, null),
      },
      {
        desc: "Next figure must be of DIFFERENT COLOR than the last one",
        fake: (f) => new Figure(null, f.color, null),
        gen: (f) => new Figure(null, !f.color, null),
      },
      {
        desc: "Next figure must be of DIFFERENT SIZE than the last one",
        fake: (f) => new Figure(null, null, f.size),
        gen: (f) => new Figure(null, null, !f.size),
      },
      {
        desc: "Next figure must be of DIFFERENT SHAPE than the last one",
        fake: (f) => new Figure(f.type, null, null),
        gen: (f) => new Figure(!f.type, null, null),
      },
    ],
    normal: [
      {
        desc: "If last shape was SMALL, next one has to be BLUE, otherwise - RED",
        fake: (f) => new Figure(null, f.size, null),
        gen: (f) => new Figure(null, !f.size, null),
      },
      {
        desc: "If last shape was BIG, next one has to be SQUARE, otherwise - CIRCLE",
        fake: (f) => new Figure(f.size, null, null),
        gen: (f) => new Figure(!f.size, null, null),
      },
      {
        desc: "If last shape was BLUE, next one has to be CIRCLE, otherwise - SQUARE",
        fake: (f) => new Figure(!f.color, null, null),
        gen: (f) => new Figure(f.color, null, null),
      },
      {
        desc: "If last shape was CIRCLE, next one has to be BIG, otherwise - SMALL",
        fake: (f) => new Figure(null, null, !f.type),
        gen: (f) => new Figure(null, null, f.type),
      },
      {
        desc: "If last shape was BLUE, next one has to be SMALL, otherwise - BIG",
        fake: (f) => new Figure(null, null, f.color),
        gen: (f) => new Figure(null, null, !f.color),
      },
      {
        desc: "If last shape was CIRCLE, next one has to be SMALL, otherwise - BIG",
        fake: (f) => new Figure(null, null, f.type),
        gen: (f) => new Figure(null, null, !f.type),
      },
    ],
    hard: [
      {
        desc: "If last shape was BIG, next one has to be BLUE, otherwise - of SAME TYPE as last shape",
        fake: (f) => new Figure(f.size ? null : !f.type, f.size ? false : null, null),
        gen: (f) => new Figure(f.size ? null : f.type, f.size ? true : null, null),
      },
      {
        desc: "If last shape was BIG, next one has to be BLUE, otherwise - of DIFFERENT COLOR than the last shape",
        fake: (f) => new Figure(null, f.size ? false : f.color, null),
        gen: (f) => new Figure(null, f.size ? true : !f.color, null),
      },
      {
        desc: "If last shape was BLUE, next one has to be BIG, otherwise - of DIFFERENT TYPE than the last shape",
        fake: (f) => new Figure(f.color ? null : f.type, null, f.color ? false : null),
        gen: (f) => new Figure(f.color ? null : !f.type, null, f.color ? true : null),
      },
      {
        desc: "If last shape was RED, next one has to be CIRCLE, otherwise - SMALL",
        fake: (f) => new Figure(f.color ? null : false, null, f.color ? true : null),
        gen: (f) => new Figure(f.color ? null : true, null, f.color ? false : null),
      },
    ],
  };
</script>

<svelte:head>
  <title>chat.vote Games - 🟥⏹️🔴🔴⭕⏹️</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="A very weird logic puzzle. Finish the row of shapes, which has been formed using a pre-determined hidden rule." />
  <meta name="keywords" content="chatvote, chat.vote, interactive, games, Twitch, chat" />
  <meta property="og:title" content="chat.vote Games - 🟥⏹️🔴🔴⭕⏹️" />
  <meta property="og:site_name" content="chat.vote Games - 🟥⏹️🔴🔴⭕⏹️" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chat.vote/games/shapes/" />
  <meta property="og:image" content="https://screenshot.donk.workers.dev/?url=https://chat.vote/games/shapes" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:description" content="A very weird logic puzzle. Finish the row of shapes, which has been formed using a pre-determined hidden rule." />
</svelte:head>

<div class="modal fade" id="howToPlayModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="howToPlayTitle">How to play - 🟥⏹️🔴🔴⭕⏹️</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="howToPlayBody">
        <p>There is a list of geometric shapes. You will have to finish this list by adding more shapes.</p>
        <p>The list is built according to a predefined hidden rule (e.g. "next shape cannot be the same color as the last one")</p>
        <p>Use first shapes to figure out which rule is in order, then click on the shape which you think will fit.</p>
        <p>This game does not have separate streamer and chat turns, you can play it together at the same time</p>
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
    <div class="row" id="gameRow">
      <div class="row" id="shapesrow">
        <div id="field" class="figure-container">
          <!-- Instantiated by: <div class="figure unknown"></div> -->
        </div>
      </div>
      <div class="row">
        <div class="col-6" id="shapescol1">
          <div id="lives">Lives: ❤❤❤</div>
          <h3 class="hide-after-game">Choose which figure will go next:</h3>
          <div id="variants" class="figure-container hide-after-game">
            <div class="figure unknown shapesoptions" data-choice="0">1</div>
            <div class="figure unknown shapesoptions" data-choice="1">2</div>
            <div class="figure unknown shapesoptions" data-choice="2">3</div>
          </div>
          <div id="shapesgameResult" style="visibility: hidden">
            <h2 id="endMessage">You are not supposed to see this...yet! You filthy cheater!</h2>
            <h4>The rule was:</h4>
            <h5 id="rule">If THIS, do THAT, else THESE or THOSE</h5>
          </div>
        </div>
        <div class="col-6">
          <div class="card mb-2">
            <div class="card-body">
              <div class="input-group mb-2">
                <label class="input-group-text" for="difficulty">Difficulty</label>
                <select id="difficulty" class="form-select" aria-label="difficulty select">
                  <option selected value="0">Simple rules</option>
                  <option value="1">Harder rules</option>
                  <option value="2">Absolutely dank rules</option>
                </select>
              </div>
              <div class="input-group mb-2">
                <label class="input-group-text" for="startinglives">Starting lives</label>
                <div class="flex-grow-1 px-2 border d-flex align-items-center justify-content-center">
                  <input type="range" class="form-range" min="1" max="5" value="3" id="startinglives" />
                </div>
                <span class="input-group-text fw-bold" id="startingliveslabel">3</span>
              </div>
              <div class="input-group mb-2">
                <label class="input-group-text" for="shapeslength">Length</label>
                <div class="flex-grow-1 px-2 border d-flex align-items-center justify-content-center">
                  <input type="range" class="form-range" min="5" max="10" value="8" id="shapeslength" />
                </div>
                <span class="input-group-text fw-bold" id="shapeslengthlabel">8</span>
              </div>
              <button id="startshapesbtn" onclick={start} type="button" class="btn btn-success">Start new game</button>
            </div>
          </div>
          <div class="card hide-after-game" style="display: none">
            <div class="card-body">
              <div id="shapeschartdiv" class="chart-container">
                <canvas id="shapeschartCanvas"></canvas>
              </div>
              <div class="d-flex flex-row">
                <button type="button" onclick={playTurn} class="btn btn-success">Play chat's pick</button>
                <div class="flex-grow-1"></div>
                <span id="totalvotesshapes">Total votes: 0</span>
              </div>
            </div>
          </div>
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

  #shapeschartdiv {
    position: relative;
    height: 40vh;
    width: 100%;
  }

  div.figure-container {
    display: flex;
    flex-flow: row nowrap;
    width: auto;
    align-items: flex-start;
    margin: 1vw 0;
  }

  div.figure {
    flex: 0 auto;
    border: 1px solid silver;
    min-width: 128px;
    min-height: 128px;
    max-width: 128px;
    max-height: 128px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
  }

  div.unknown {
    background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjMxLjM1N3B4IiBoZWlnaHQ9IjMxLjM1N3B4IiB2aWV3Qm94PSIwIDAgMzEuMzU3IDMxLjM1NyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzEuMzU3IDMxLjM1NzsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTTE1LjI1NSwwYzUuNDI0LDAsMTAuNzY0LDIuNDk4LDEwLjc2NCw4LjQ3M2MwLDUuNTEtNi4zMTQsNy42MjktNy42Nyw5LjYyYy0xLjAxOCwxLjQ4MS0wLjY3OCwzLjU2Mi0zLjQ3NSwzLjU2Mg0KCQljLTEuODIyLDAtMi43MTItMS40ODItMi43MTItMi44MzhjMC01LjA0Niw3LjQxNC02LjE4OCw3LjQxNC0xMC4zNDNjMC0yLjI4Ny0xLjUyMi0zLjY0My00LjA2Ni0zLjY0Mw0KCQljLTUuNDI0LDAtMy4zMDYsNS41OTItNy40MTQsNS41OTJjLTEuNDgzLDAtMi43NTYtMC44OS0yLjc1Ni0yLjU4NEM1LjMzOSwzLjY4MywxMC4wODQsMCwxNS4yNTUsMHogTTE1LjA0NCwyNC40MDYNCgkJYzEuOTA0LDAsMy40NzUsMS41NjYsMy40NzUsMy40NzZjMCwxLjkxLTEuNTY4LDMuNDc2LTMuNDc1LDMuNDc2Yy0xLjkwNywwLTMuNDc2LTEuNTY0LTMuNDc2LTMuNDc2DQoJCUMxMS41NjgsMjUuOTczLDEzLjEzNywyNC40MDYsMTUuMDQ0LDI0LjQwNnoiLz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K");
    background-size: 33%;
    opacity: 0.3;
  }

  div.next {
    opacity: 1;
  }

  div.circle {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzJweCIgaGVpZ2h0PSI3MnB4IiB2aWV3Qm94PSIwIDAgNzIgNzIiIGlkPSJlbW9qaSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBpZD0iY29sb3IiPgogICAgPHBhdGggZmlsbD0iI0VBNUE0NyIgc3Ryb2tlPSJub25lIiBkPSJNMzUuNTY2MSw2LjQwNjZjLTE2LjAxNjIsMC0yOSwxMi45ODM4LTI5LDI5YzAsMTYuMDE2NCwxMi45ODM4LDI5LDI5LDI5czI5LTEyLjk4MzYsMjktMjkgQzY0LjU2NjEsMTkuMzkwMyw1MS41ODIzLDYuNDA2NiwzNS41NjYxLDYuNDA2NnogTTM1LjU2NjEsNTUuNDA2NmMtMTEuMDQ1NywwLTIwLTguOTU0My0yMC0yMHM4Ljk1NDMtMjAsMjAtMjBzMjAsOC45NTQzLDIwLDIwIFM0Ni42MTE4LDU1LjQwNjYsMzUuNTY2MSw1NS40MDY2eiIvPgogIDwvZz4KICA8ZyBpZD0iaGFpciIvPgogIDxnIGlkPSJza2luIi8+CiAgPGcgaWQ9InNraW4tc2hhZG93Ii8+CiAgPGcgaWQ9ImxpbmUiPgogICAgPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGQ9Ik00OC41MTUzLDI1LjUwNDYiLz4KICAgIDxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBkPSJNNjYsMzcuNjU1NCIvPgogICAgPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGQ9Ik00OC41MTUzLDI2LjMxODUiLz4KICAgIDxjaXJjbGUgY3g9IjM1Ljc5NTIiIGN5PSIzNS45MzcyIiByPSIyOSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIvPgogICAgPGNpcmNsZSBjeD0iMzUuNzk1MiIgY3k9IjM1LjkzNzIiIHI9IjIwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPC9nPgo8L3N2Zz4K");
  }

  div.square2 {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzJweCIgaGVpZ2h0PSI3MnB4IiB2aWV3Qm94PSIwIDAgNzIgNzIiIGlkPSJlbW9qaSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBpZD0iY29sb3IiPgogICAgPHBhdGggZmlsbD0iI2VhNWE0NyIgZD0iTTU5LjAzNDksNjBoLTQ2LjA3QS45Njc5Ljk2NzksMCwwLDEsMTIsNTkuMDM0OXYtNDYuMDdBLjk2NzkuOTY3OSwwLDAsMSwxMi45NjUxLDEyaDQ2LjA3QS45Njc5Ljk2NzksMCwwLDEsNjAsMTIuOTY1MXY0Ni4wN0EuOTY3OS45Njc5LDAsMCwxLDU5LjAzNDksNjBaIi8+CiAgPC9nPgogIDxnIGlkPSJsaW5lIj4KICAgIDxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNTkuMDM0OSw2MGgtNDYuMDdBLjk2NzkuOTY3OSwwLDAsMSwxMiw1OS4wMzQ5di00Ni4wN0EuOTY3OS45Njc5LDAsMCwxLDEyLjk2NTEsMTJoNDYuMDdBLjk2NzkuOTY3OSwwLDAsMSw2MCwxMi45NjUxdjQ2LjA3QS45Njc5Ljk2NzksMCwwLDEsNTkuMDM0OSw2MFoiLz4KICA8L2c+Cjwvc3ZnPgo=");
  }

  div.blue {
    filter: hue-rotate(180deg);
  }

  div.small {
    background-size: 40%;
  }

  div.option:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.09);
    opacity: 0.95;
  }

  div.unpickable {
    opacity: 0.05 !important;
  }

  #variants > div {
    font-size: 1.5em;
    color: #a1a1a1;
    font-weight: bold;
  }
</style>
