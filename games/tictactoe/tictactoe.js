/*jshint esversion: 11 */
const CLIENT_ID = "qn0wimnszbqlwfnszdz3wwfz430eqr";
let streamersTurn = true;
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
        updateGraph("ttt");
        return;
      }
    }
  }); //message

  client.on("timeout", (channel, username, reason, duration, userstate) => {}); //timeout

  client.on("connected", async (address, port) => {
    console.log(`Connected to ${address}:${port}`);
    elements.status.innerHTML = `<h4><span class="badge bg-success">Connected :)</span></h4>`;
    saveSettings();
    sendUsername(`chat.vote/games/tictactoe`, USER.channel, USER.platform == "twitch" ? `twitch - ${USER.twitchLogin}` : "youtube");
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
  TTT.listeners();
  document.getElementById("tttoverlay").innerHTML = `<span class="overlaytext">${USER.channel || "STREAMER"}'s turn</span>`;
}; //onload

window.onbeforeunload = function () {
  return null;
}; //onbeforeunload

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
  numberOfPlayedSquares: 0,
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
  updateGameBoard: function (index, value, el) {
    TTT.gameBoard[index] = value;
    el.html(value);
    let donk = document.getElementsByClassName("choices");
    for (let i = 0, j = donk.length; i < j; i++) {
      donk[i].innerHTML = 0;
      if (TTT.gameBoard[i]) {
        $(donk[i]).parent().addClass("text-body-secondary");
      }
    }
  },
  reset: function () {
    TTT.init();
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
  },
  init: function () {
    for (let i = 0, j = TTT.squares.length; i < j; i++) {
      TTT.squares[i].innerHTML = `<span class="text-body-secondary">${i + 1}</span>`;
    }
    TTT.gameBoard = [null, null, null, null, null, null, null, null, null];
    TTT.isComputerPlaying = false;
    TTT.isGameOver = false;
    TTT.numberOfPlayedSquares = 0;
    document.getElementById("gameboard").classList = "pointer";
  }, // end TTT.init()

  checkWin: function (value) {
    let winner = false;
    for (let combo = 0, j = TTT.winningCombos.length; combo < j; combo++) {
      let a = TTT.winningCombos[combo][0];
      let b = TTT.winningCombos[combo][1];
      let c = TTT.winningCombos[combo][2];
      if (TTT.gameBoard[a] === TTT.gameBoard[b]) {
        if (TTT.gameBoard[b] === TTT.gameBoard[c]) {
          if (TTT.gameBoard[a]) {
            TTT.endGame(value);
            winner = true;
          }
        }
      }
    }
    return winner;
  },

  endGame: function (value) {
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
    //		TTT.init();
    //	}
  },
  getChatMove: function () {
    let list = TTT.results;
    list.sort(function (a, b) {
      return a.data > b.data ? -1 : a.data == b.data ? 0 : 1;
    });
    return list[0];
  },
  playTurn: function () {
    if (voters.length == 0) {
      return;
    }
    streamersTurn = true;
    document.getElementById("tttchartCanvas").classList = "blur";
    document.getElementById("tttoverlay").innerHTML = `<span class="overlaytext">${USER.channel || "STREAMER"}'s turn</span>`;
    voters = [];
    let theSquareToPlay = TTT.getChatMove();
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
    updateGraph("ttt");
    let $theSelectedSquare = $(".square-0" + `${parseInt(theSquareToPlay, 10) - 1}`);
    TTT.numberOfPlayedSquares++;
    TTT.updateGameBoard(`${parseInt(theSquareToPlay, 10) - 1}`, "O", $theSelectedSquare);
    TTT.checkWin("O");
    TTT.isComputerPlaying = false;
    document.getElementById("gameboard").classList = "cursorpointer";
    document.getElementById("totalvotesttt").innerHTML = `Total votes: 0`;
  },
  listeners: function () {
    TTT.squares.click(function () {
      voters = [];
      let squareIndexValue = parseInt($(this).data("index"), 10);
      document.getElementById("gameboard").classList = "cursordefault";

      function checkIfTurnIsReady() {
        if (TTT.isGameOver) {
          return false;
        }
        if (TTT.isComputerPlaying) {
          return false;
        }
        if (!TTT.gameBoard[squareIndexValue]) {
          return true;
        }
      }
      let isTurnReady = checkIfTurnIsReady();
      if (isTurnReady) {
        streamersTurn = false;
        document.getElementById("tttchartCanvas").classList = "";
        document.getElementById("tttoverlay").innerHTML = "";
        TTT.updateGameBoard(squareIndexValue, "X", $(this));
        TTT.numberOfPlayedSquares++;
        let winner = TTT.checkWin("X");
        if (!winner && TTT.numberOfPlayedSquares < 9) {
          // AI.playTurn();
        } else if (TTT.numberOfPlayedSquares === 9) {
          TTT.endGame("draw");
        }
        TTT.isComputerPlaying = true;
        TTT.results = TTT.results.filter(function (el) {
          return el.label != `${squareIndexValue + 1}`;
        });
        TTT.results.forEach((element, index) => {
          TTT.results[index].data = 0;
        });
        updateGraph("ttt");
      }
    }); //TTT click
  },
}; //TTT

function resetGame() {
  voters = [];
  initGraph();
  streamersTurn = true;
  TTT.reset();
} //resetGame
