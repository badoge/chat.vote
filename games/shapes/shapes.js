/*jshint esversion: 11 */
const CLIENT_ID = "qn0wimnszbqlwfnszdz3wwfz430eqr";
let voters = [];

let elements = {
  //modals
  grid: document.getElementById("grid"),
  gameDiv: document.getElementById("gameDiv"),

  loginExpiredModal: document.getElementById("loginExpiredModal"),
  loginExpiredRenew: document.getElementById("loginExpiredRenew"),
  loginExpiredReset: document.getElementById("loginExpiredReset"),
  howToPlayModal: document.getElementById("howToPlayModal"),
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

let loginExpiredModal, howToPlayModal, aboutModal;

let USER = {
  channel: "",
  twitchLogin: false,
  access_token: "",
  userID: "",
  platform: "",
};

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
    let vote_int = parseInt(input[0], 10);
    if (isNaN(vote_int)) {
      return;
    }
    if (vote_int > 0 && vote_int < 4) {
      if (!voters.includes(context.username)) {
        voters.push(context.username);
        let index = SHAPES.results.findIndex((obj) => obj.label == vote_int);
        SHAPES.results[index].data += 1;
        updateGraph("shapes");
        return;
      }
    }
  }); //message

  client.on("timeout", (channel, username, reason, duration, userstate) => {}); //timeout

  client.on("connected", async (address, port) => {
    console.log(`Connected to ${address}:${port}`);
    elements.status.innerHTML = `<h4><span class="badge bg-success">Connected :)</span></h4>`;
    saveSettings();
    sendUsername(`chat.vote/games/shapes`, USER.channel, USER.platform == "twitch" ? `twitch - ${USER.twitchLogin}` : "youtube");
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

function showHowToPlay() {
  howToPlayModal.show();
} //showHowToPlay

function switchGame(game) {
  switch (game) {
    case "draw":
      location.href = "/games/draw";
      break;
    case "arena":
      location.href = "/games/arena";
      break;
    case "eb":
      location.href = "/games/emotes";
      break;
    case "dh":
      location.href = "/games/donkhunt";
      break;
    case "shapes":
      location.href = "/games/shapes";
      break;
    case "nim":
      location.href = "/games/nim";
      break;
    case "nw":
      location.href = "/games/wordle";
      break;
    case "c4":
      location.href = "/games/connect4";
      break;
    case "ttt":
      location.href = "/games/tictactoe";
      break;
    case "about":
      aboutModal.show();
      break;
    default:
      break;
  }
} //switchGame

window.onload = function () {
  darkTheme = (localStorage.getItem("darkTheme") || "true") === "true";
  elements.darkTheme.checked = darkTheme ?? true;
  switchTheme(elements.darkTheme.checked);

  loadAndConnect();

  if (!USER.channel) {
    loginButton = new bootstrap.Popover(elements.loginButton);
  }

  loginExpiredModal = new bootstrap.Modal(elements.loginExpiredModal);
  howToPlayModal = new bootstrap.Modal(elements.howToPlayModal);
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

  initGraph();

  SHAPES.listeners();
}; //onload

window.onbeforeunload = function () {
  return null;
}; //onbeforeunload

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

let SHAPES = {
  figureList: Array.from(document.querySelectorAll("#field div.figure")),
  optionList: Array.from(document.querySelectorAll("#variants div.figure")),
  startBtn: document.querySelector("#startshapesbtn"),
  dVariants: document.querySelector("#variants"),
  dResult: document.querySelector("#shapesgameResult"),
  dDifficulty: document.querySelector("select#difficulty"),
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
  drawShapes: function () {
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
    SHAPES.lives.innerHTML = `Lives: ${"❤".repeat(parseInt(SHAPES.shapesGame.lives, 10))}`;
  },
  generateChoices: function () {
    SHAPES.shapesGame.choices = new Array(3).fill(null);
    SHAPES.shapesGame.correct = Math.floor(Math.random() * SHAPES.shapesGame.choices.length);
    SHAPES.shapesGame.choices[SHAPES.shapesGame.correct] = SHAPES.shapesGame.rule.gen(SHAPES.shapesGame.figs[SHAPES.shapesGame.figs.length - 1]);
    for (let i = 0; i < SHAPES.shapesGame.choices.length; i++) {
      while (!SHAPES.shapesGame.choices[i]) {
        let f = SHAPES.shapesGame.rule.fake(SHAPES.shapesGame.figs[SHAPES.shapesGame.figs.length - 1]);
        if (SHAPES.shapesGame.choices.every((c) => !f.isEqual(c))) SHAPES.shapesGame.choices[i] = f; //jshint ignore:line
      }
    }
  },
  endGame: function (win = false) {
    SHAPES.lives.innerHTML = `Lives: 💀`;

    SHAPES.shapesGame.gameStarted = false;
    document.querySelector("#endMessage").innerText = win ? "Congrats! You've filled the row!" : "YOU LOST! Wow, you are so bad at this game!";
    document.querySelector("#rule").innerText = SHAPES.shapesGame.rule.desc;
    SHAPES.dVariants.style.visibility = "hidden";
    SHAPES.dResult.style.visibility = "visible";
    SHAPES.startBtn.disabled = false;
    SHAPES.dDifficulty.disabled = false;
  },
  makeChoice: function (event) {
    if (!SHAPES.shapesGame.gameStarted) return;
    try {
      if (event.target.classList.contains("unpickable")) return;
      const selected = parseInt(event.target.dataset.choice, 10);
      if (selected !== SHAPES.shapesGame.correct) {
        SHAPES.results = SHAPES.results.filter(function (el) {
          return parseInt(el.label, 10) != selected + 1;
        });
        updateGraph("shapes");
        SHAPES.shapesGame.lives -= 1;
        SHAPES.shapesGame.choices[selected].isKnownToBeIncorrect(true);
        showToast("Incorrect choice!", "danger", 3000);

        if (SHAPES.shapesGame.lives < 1) {
          SHAPES.endGame(false);
        }
      } else {
        SHAPES.results = [
          { label: "1", data: 0, c1: "#f44336", c2: "#f53337" },
          { label: "2", data: 0, c1: "#f4c236", c2: "#f5c237" },
          { label: "3", data: 0, c1: "#a8f436", c2: "#a9e437" },
        ];
        updateGraph("shapes");
        SHAPES.shapesGame.figs.push(SHAPES.shapesGame.choices[SHAPES.shapesGame.correct]);
        if (SHAPES.shapesGame.figs.length >= SHAPES.figureList.length) {
          SHAPES.endGame(true);
        } else {
          SHAPES.generateChoices();
        }
      }
      SHAPES.drawShapes();
    } catch (e) {
      console.warn(e);
      console.log("Event causing an error: ", event);
    }
  },
  start: function () {
    SHAPES.dResult.style.visibility = "hidden";
    SHAPES.startBtn.disabled = true;
    SHAPES.dDifficulty.disabled = true;
    SHAPES.shapesGame.difficulty = parseInt(SHAPES.dDifficulty.value, 10) || 0;
    SHAPES.shapesGame.lives = 3 - SHAPES.shapesGame.difficulty;
    const rulePool = rules[Object.keys(rules)[SHAPES.shapesGame.difficulty]];
    SHAPES.shapesGame.rule = rulePool[Math.floor(Math.random() * rulePool.length)];
    SHAPES.shapesGame.figs.length = 0;
    SHAPES.shapesGame.figs.push(new Figure());
    for (let i = 1; i < 3; i++) {
      SHAPES.shapesGame.figs.push(SHAPES.shapesGame.rule.gen(SHAPES.shapesGame.figs[SHAPES.shapesGame.figs.length - 1]));
    }
    SHAPES.shapesGame.gameStarted = true;
    SHAPES.generateChoices();
    SHAPES.drawShapes();
    SHAPES.results = [
      { label: "1", data: 0, c1: "#f44336", c2: "#f53337" },
      { label: "2", data: 0, c1: "#f4c236", c2: "#f5c237" },
      { label: "3", data: 0, c1: "#a8f436", c2: "#a9e437" },
    ];
    updateGraph("shapes");
  },
  reset: function () {
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
  },
  playTurn: function () {
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
    updateGraph("shapes");
  },
  listeners: function () {
    document.getElementById("difficulty").onchange = function () {
      document.getElementById("lives").innerHTML = `Lives: ${"❤".repeat(3 - parseInt(this.value, 10))}`;
    };
    SHAPES.optionList.forEach((o) => o.addEventListener("click", SHAPES.makeChoice));

    document.getElementById("shapeslength").oninput = function () {
      document.getElementById("shapeslengthlabel").innerHTML = this.value;
    };
  },
}; //SHAPES

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
