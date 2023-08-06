/*jshint esversion: 11 */
const CLIENT_ID = "qn0wimnszbqlwfnszdz3wwfz430eqr";

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
    let command = input[0].toLowerCase();
  }); //message

  client.on("timeout", (channel, username, reason, duration, userstate) => {}); //timeout

  client.on("connected", async (address, port) => {
    console.log(`Connected to ${address}:${port}`);
    elements.status.innerHTML = `<h4><span class="badge bg-success">Connected :)</span></h4>`;
    saveSettings();
    sendUsername(`chat.vote/games/connect4`, USER.channel, USER.platform == "twitch" ? `twitch - ${USER.twitchLogin}` : "youtube");
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

  DONKHUNT.listeners();
}; //onload

window.onbeforeunload = function () {
  return null;
}; //onbeforeunload

class HuntUnit {
  constructor(type, rowId, cellId) {
    if (!["hunter", "target"].includes(type)) throw new Error("Invalid type: " + type);
    this.type = type;
    this.cell = cellId;
    this.row = rowId;
  }
  moveTo(rowId, cellId) {
    console.log(`Action: move ${this.type} to [${rowId},${cellId}]`);
    DONKHUNT.field[this.row][this.cell] = "";
    this.cell = cellId;
    this.row = rowId;
    DONKHUNT.field[this.row][this.cell] = this.type;
  }
}

class HuntHunter extends HuntUnit {
  constructor(rowId, cellId) {
    super("hunter", rowId, cellId);
  }
  isAbleToMove() {
    switch (this.row) {
      case 0:
        return false; // row 0: end of the line, cant move
      case 1: // row 1: can only move to base
        return DONKHUNT.field[0][1] === "";
      default: // row 2 and 3: can only move forward
        return DONKHUNT.field[this.row - 1][this.cell] === "";
    }
  }
  getValidMoveList() {
    if (!this.isAbleToMove()) return [];
    switch (this.row) {
      case 1: // row 1: can only move to base
        return [0, 1];
      default: // can only move forward
        return [this.row - 1, this.cell];
    }
  }
}

class HuntTarget extends HuntUnit {
  constructor(rowId, cellId) {
    super("target", rowId, cellId);
  }
  getValidMoveList() {
    const result = [];
    switch (this.row) {
      case 0: // row 0 (base): can move to any free cell in row 1
        DONKHUNT.field[1].forEach((_c, ci) => result.push([1, ci]));
        break;
      default: // any other row: can only move up down left right
        if (this.cell > 0) result.push([this.row, this.cell - 1]);
        if (this.cell < 2) result.push([this.row, this.cell + 1]);
        result.push([this.row + 1, this.cell]);
        result.push([this.row - 1, this.cell]);
        if (this.row === 1) result.push([0, 1]); // can move from row1 to base
    }
    // now check valid cells - if they are free or not
    return result.filter((coords) => DONKHUNT.field[coords[0]][coords[1]] === "");
  }
}

let DONKHUNT = {
  consts: {
    MEGALUL: '<img src="/games/pics/megalul.png" alt="MEGALUL" class="icon">',
    DONK: '<img src="/games/pics/donk.png" alt="Donk" class="icon">',
    FEELSDONKMAN: '<img src="/games/pics/feelsdonkman.png" alt="FeelsDonkMan" class="icon">',
    CLAP: '<img src="/games/pics/clap.gif" alt="Clap" class="icon">',
    KNIFE: '<img src="/games/pics/forsenknife.png" alt="Knife" class="icon">',
    FORSENO: '<img src="/games/pics/forseno.png" alt="Real Forsen" class="icon">',
  },
  html: {
    fieldRows: Array.from(document.querySelectorAll("div#dhfield div.dh-field-row")).map((row) => Array.from(row.querySelectorAll("div.dh-field-cell"))),
    allSettingControls: Array.from(document.querySelectorAll(".dhsettings")),
    sidePicker: document.querySelector('input[name="dhplayer"]:checked').value,
    movePicker: document.querySelector('input[name="dhfirst"]:checked').value,
    startBtn: document.querySelector("#startdh"),
    gameResult: document.querySelector("#dhgameResult"),
    status: document.querySelector("#adviceFriend"),
  },
  game: {
    hunters: [new HuntHunter(3, 0), new HuntHunter(3, 1), new HuntHunter(3, 2)],
    target: new HuntTarget(2, 0),
    turn: 0,
    active: false,
  },
  player: {
    move1: null,
    side: null,
  },
  field: [
    ["wall", "", "wall"],
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ],
  functions: {
    getHunterReference: function (row, cell) {
      let ref = null;
      DONKHUNT.game.hunters.forEach((h) => {
        if (h.row === row && h.cell === cell) ref = h;
      });
      if (!ref) console.warn(`Cell [${row}, ${cell}] does not correspond to any Hunter!`);
      return ref;
    },
    whoGoes: function () {
      return DONKHUNT.game.turn % 2 ? "hunter" : "target";
    },
    resetField: function () {
      DONKHUNT.field[0][1] = "";
      [1, 2, 3].forEach((row) => DONKHUNT.field[row].forEach((_e, i, a) => (a[i] = "")));
      DONKHUNT.game.hunters.forEach((h, hi) => h.moveTo(3, hi));
      DONKHUNT.game.target.moveTo(2, 1);
    },
    drawField: function (newGame = false) {
      DONKHUNT.html.fieldRows.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
          cell.classList.toggle("dh-p-wall", DONKHUNT.field[rowIndex][cellIndex] === "wall");
          cell.classList.toggle("dh-p-hunter", DONKHUNT.field[rowIndex][cellIndex] === "hunter");
          cell.classList.toggle("dh-p-target", DONKHUNT.field[rowIndex][cellIndex] === "target");
          cell.classList.remove("dh-event-target");
          if (newGame) {
            cell.classList.remove("dh-field-winpath");
            cell.classList.remove("dh-p-invert");
          }
        });
      });
      DONKHUNT.game.hunters.forEach((h) => {
        if (h.cell > DONKHUNT.game.target.cell) DONKHUNT.html.fieldRows[h.row][h.cell].classList.add("dh-p-invert");
        if (h.cell < DONKHUNT.game.target.cell) DONKHUNT.html.fieldRows[h.row][h.cell].classList.remove("dh-p-invert");
      });
      if (DONKHUNT.game.active && DONKHUNT.functions.whoGoes() === DONKHUNT.player.side) {
        switch (
          DONKHUNT.player.side // highlight clickable fields for player
        ) {
          case "hunter":
            let ableToMoveCount = 0;
            DONKHUNT.game.hunters.forEach((h) => {
              if (h.isAbleToMove()) {
                DONKHUNT.html.fieldRows[h.row][h.cell].classList.add("dh-event-target");
                ableToMoveCount += 1;
              }
              if (h.cell > DONKHUNT.game.target.cell) DONKHUNT.html.fieldRows[h.row][h.cell].classList.add("dh-p-invert");
              if (h.cell < DONKHUNT.game.target.cell) DONKHUNT.html.fieldRows[h.row][h.cell].classList.remove("dh-p-invert");
            });
            if (ableToMoveCount < 1)
              setTimeout(() => {
                //wrap into arrow func to render new DOM
                showToast("Hunters have no valid moves! Skipping turn.", "warning", 3000);
                DONKHUNT.functions.turn(1);
              }, 50);
            break;
          case "target":
            DONKHUNT.game.target.getValidMoveList().forEach((move) => {
              DONKHUNT.html.fieldRows[move[0]][move[1]].classList.add("dh-event-target");
            });
            break;
        }
      }
    },
    turn: function (inc = 0) {
      DONKHUNT.game.turn += inc;
      // check win conditions
      if (DONKHUNT.game.target.getValidMoveList().length < 1) {
        DONKHUNT.functions.endGame("hunter", "Target is surrounded and cannot move");
      } else {
        // target wins if it has unobstructed path to flag
        let noObstacles = true;
        for (let i = DONKHUNT.game.target.row + 1; i < DONKHUNT.field.length; i++) if (DONKHUNT.field[i][DONKHUNT.game.target.cell]) noObstacles = false;
        if (noObstacles) {
          for (let i = DONKHUNT.game.target.row; i < DONKHUNT.field.length; i++) DONKHUNT.html.fieldRows[i][DONKHUNT.game.target.cell].classList.add("dh-field-winpath");
          DONKHUNT.html.fieldRows[DONKHUNT.field.length - 1][1].classList.add("dh-field-winpath");
          DONKHUNT.functions.endGame("target", "Target found a way to reach the flag");
        }
      }
      // prepare for next turn
      if (!DONKHUNT.game.active) {
        DONKHUNT.html.status.innerText = 'Press "Start new game" to begin';
        return;
      }
      if (DONKHUNT.player.side === DONKHUNT.functions.whoGoes()) {
        // player turn
        switch (DONKHUNT.functions.whoGoes()) {
          case "hunter":
            DONKHUNT.html.status.innerHTML = `Click a ${DONKHUNT.consts.MEGALUL} to move it forward.`;
            break;
          case "target":
            DONKHUNT.html.status.innerHTML = `Move ${DONKHUNT.consts.DONK} by clicking on a free cell.`;
            break;
        }
      } else {
        // opponent turn
        DONKHUNT.html.status.innerText = "Please wait for your opponent to move.";
        setTimeout(DONKHUNT.functions.emulateOpponentAction, 2222);
      }
      DONKHUNT.functions.drawField(DONKHUNT.game.turn === 0);
    },
    endGame: function (winnerSide, reason) {
      switch (winnerSide) {
        case "hunter":
          DONKHUNT.html.gameResult.querySelector("h2").innerHTML = `${DONKHUNT.consts.FORSENO}${DONKHUNT.consts.KNIFE} Hunters win!`;
          DONKHUNT.html.gameResult.querySelector("h4").innerText = reason;
          break;
        case "target":
          DONKHUNT.html.gameResult.querySelector("h2").innerHTML = `${DONKHUNT.consts.FEELSDONKMAN}${DONKHUNT.consts.CLAP} Target wins!`;
          DONKHUNT.html.gameResult.querySelector("h4").innerText = reason;
          break;
        default:
          DONKHUNT.html.gameResult.querySelector("h2").innerHTML = `${DONKHUNT.consts.DONK} Wait, what?`;
          DONKHUNT.html.gameResult.querySelector("h4").innerText = reason || "Something went wrong, this should never hDONKHUNTen.";
          break;
      }
      DONKHUNT.html.gameResult.style.visibility = "visible";
      DONKHUNT.html.allSettingControls.forEach((c) => (c.disabled = false));
      DONKHUNT.game.active = false;
      DONKHUNT.functions.drawField();
    },
    emulateOpponentAction: function () {
      // this can be replaced by chat's action or by second player's action
      // really simple bot: just pick a random valid move
      switch (DONKHUNT.functions.whoGoes()) {
        case "hunter":
          const hunters = DONKHUNT.game.hunters.filter((h) => h.isAbleToMove());
          if (hunters.length) {
            let i = Math.floor(Math.random() * hunters.length);
            if (hunters[i].row > 1) hunters[i].moveTo(hunters[i].row - 1, hunters[i].cell);
            else hunters[i].moveTo(0, 1);
          } else {
            console.warn("Bot: Hunters cannot move!");
            showToast("Hunters have no valid moves - they skip their turn.", "warning", 3000);
          }
          break;
        case "target":
          const validMoves = DONKHUNT.game.target.getValidMoveList();
          if (!validMoves.length) return void console.warn("Bot: Target has nowhere to move!");
          let j = Math.floor(Math.random() * validMoves.length);
          DONKHUNT.game.target.moveTo(validMoves[j][0], validMoves[j][1]);
          break;
      }
      // after the move call the start of next turn:
      DONKHUNT.functions.turn(1);
    },
  },
  start: function () {
    DONKHUNT.html.gameResult.style.visibility = "hidden";
    DONKHUNT.html.allSettingControls.forEach((c) => (c.disabled = true));
    DONKHUNT.functions.resetField();
    DONKHUNT.game.turn = 0;
    DONKHUNT.player.side = DONKHUNT.html.sidePicker.value;
    DONKHUNT.game.active = true;
    console.log("Hunt: game has begun.");
    DONKHUNT.functions.turn(DONKHUNT.html.movePicker.value === "hunter" ? 1 : 0);
    DONKHUNT.html.status.scrollIntoView(); // mobile friends :)
  },
  reset: function () {
    DONKHUNT.html.gameResult.style.visibility = "hidden";
    DONKHUNT.html.allSettingControls.forEach((c) => (c.disabled = false));
    DONKHUNT.game.active = false;
    DONKHUNT.functions.resetField();
    DONKHUNT.functions.drawField();
  },
  listeners: function () {
    // assign controls to playfield cells
    DONKHUNT.html.fieldRows.forEach((row) =>
      row.forEach((cell) =>
        cell.addEventListener("click", function (event) {
          if (!DONKHUNT.game.active) return void console.info("Click ignored: game has not started yet.");
          if (!event.target.classList.contains("dh-event-target")) return void console.info("Click ignored: target is not defined as a valid playmove cell.");
          if (DONKHUNT.player.side != DONKHUNT.functions.whoGoes()) return void console.info("Click ignored: it is not player's turn to act.");
          // detect clicked field's coords
          const coords = {
            row: parseInt(event.target.parentNode.dataset.rowcount, 10),
            cell: parseInt(event.target.dataset.colcount, 10),
          };
          // check constraints and move unit if possible
          switch (DONKHUNT.field[coords.row][coords.cell]) {
            case "hunter":
              const actor = DONKHUNT.functions.getHunterReference(coords.row, coords.cell);
              if (!actor.isAbleToMove()) return void console.info("Click ignored: Hunter cannot move!");
              if (actor.row > 1) actor.moveTo(actor.row - 1, actor.cell);
              else actor.moveTo(0, 1);
              break;
            default: // target clicks on empty fields
              const validMoves = DONKHUNT.game.target.getValidMoveList();
              validMoves.forEach((move) => {
                if (move[0] == coords.row && move[1] == coords.cell) DONKHUNT.game.target.moveTo(move[0], move[1]);
              });
              break;
          }
          // next turn
          DONKHUNT.functions.turn(1);
        })
      )
    );
  },
}; //DONKHUNT
