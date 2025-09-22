let elements = {
  loginButton: document.getElementById("loginButton"),
  me: document.getElementById("me"),
  opponent: document.getElementById("opponent"),
  topRight: document.getElementById("topRight"),
  darkTheme: document.getElementById("darkTheme"),
  loginExpiredModal: document.getElementById("loginExpiredModal"),
  left_rock: document.getElementById("left_rock"),
  left_paper: document.getElementById("left_paper"),
  left_scissors: document.getElementById("left_scissors"),
  right_rock: document.getElementById("right_rock"),
  right_paper: document.getElementById("right_paper"),
  right_scissors: document.getElementById("right_scissors"),

  info: document.getElementById("info"),
  game: document.getElementById("game"),
  rock: document.getElementById("rock"),
  paper: document.getElementById("paper"),
  scissors: document.getElementById("scissors"),

  toastContainer: document.getElementById("toastContainer"),
};

const { animate } = anime;

let darkTheme = true;
let loginExpiredModal;
let streamer = "";
let webSocket;

let USER = {
  channel: "",
  twitchLogin: false,
  access_token: "",
  userID: "",
  platform: "",
};

function login() {
  elements.topRight.innerHTML = `<div class="btn-group" role="group" aria-label="log in button group">
      <button type="button" class="btn btn-twitch"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></button>
      <div class="btn-group" role="group">
          <button id="btnGroupDropLogin" type="button" class="btn btn-twitch dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
        </button>
          <ul class="dropdown-menu dropdown-menu-lg-end" aria-label="Log out">
              <li><a class="dropdown-item" onclick="logout()" href="#"><i class="material-icons notranslate">logout</i>Log out</a></li>
          </ul>
      </div>
  </div>`;
  window.open("/prompt.html", "loginWindow", "toolbar=0,status=0,scrollbars=0,width=500px,height=800px");
  return false;
} //login

function logout() {
  elements.topRight.innerHTML = `<a role="button" id="loginButton" onclick="login()" class="btn btn-twitch" tabindex="0"> <span class="twitch-icon"></span>Sign in with Twitch </a>`;
  resetSettings(true);
} //logout

async function loadPFP() {
  if (!USER.channel) {
    elements.topRight.innerHTML = `<a role="button" id="loginButton" onclick="login()" class="btn btn-twitch" tabindex="0"> <span class="twitch-icon"></span>Sign in with Twitch </a>`;
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
  elements.me.innerHTML = `<img src="${profilepicurl}" alt="profile pic" class="rounded-circle" style="height:2em;"> ${USER.channel}`;
  elements.opponent.innerHTML = `<img src="/pics/donk.png" alt="profile pic" class="rounded-circle" style="height:2em;"> Your opponent`;
} //loadPFP

function resetSettings(logout = false) {
  if (logout) {
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
  }
  location.reload();
  return false;
} //resetSettings

async function refreshData() {
  darkTheme = elements.darkTheme.checked ?? true;
} //refreshData

function saveSettings() {
  refreshData();
  localStorage.setItem("darkTheme", darkTheme);
  localStorage.setItem("USER", JSON.stringify(USER));
} //saveSettings

function switchTheme(checkbox) {
  document.documentElement.setAttribute("data-bs-theme", checkbox ? "dark" : "light");
  if (document.getElementById("btnGroupDrop1") && document.getElementById("btnGroupDrop2")) {
    document.getElementById("btnGroupDrop1").classList.remove(`${checkbox ? "btn-secondary" : "btn-dark"}`);
    document.getElementById("btnGroupDrop1").classList.add(`${checkbox ? "btn-dark" : "btn-secondary"}`);
    document.getElementById("btnGroupDrop2").classList.remove(`${checkbox ? "btn-secondary" : "btn-dark"}`);
    document.getElementById("btnGroupDrop2").classList.add(`${checkbox ? "btn-dark" : "btn-secondary"}`);
  }
} //switchTheme

function load_localStorage() {
  if (!localStorage.getItem("USER")) {
    console.log("localStorage user info not found");
  } else {
    USER = JSON.parse(localStorage.getItem("USER"));
  }
} //load_localStorage

function connect() {
  elements.topRight.innerHTML = `
    <div class="btn-group" role="group" aria-label="log in button group">
    <button type="button" class="btn btn-twitch"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></button>
    <div class="btn-group" role="group">
    <button id="btnGroupDropLogin" type="button" class="btn btn-twitch dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"></button>
    <ul class="dropdown-menu dropdown-menu-lg-end" aria-label="Log out">
    <li><a class="dropdown-item" onclick="logout()" href="#"><i class="material-icons notranslate">logout</i>Log out</a></li>
    </ul>
    </div>
    </div>`;
  refreshData();
  loadBadges(streamer);
  loadPFP();

  elements.game.style.display = "";

  //webSocket = new WebSocket("ws://localhost:9001");
  webSocket = new WebSocket("wss://ws.chat.vote");

  webSocket.onopen = function (event) {
    console.log(event);
    webSocket.send(JSON.stringify({ command: "join", streamer: streamer, username: USER.channel, userid: USER.userID, access_token: USER.access_token }));
  };

  webSocket.onmessage = function (event) {
    let data = JSON.parse(event.data);

    switch (data.id) {
      case "toast":
        showToast(data.message, data.type, 2000);
        break;
      case "starting":
        //sent when the game starts/resets after the streamer clicks the start new game button
        showToast(data.message, data.type, 2000);
        resetGame();
        break;

      case "round":
        //sent when the a new round starts
        showToast(data.message, data.type, 2000);
        startRound(data.opponent);
        break;

      case "moved":
        //sent if the move was accepted
        showToast(data.message, data.type, 2000);
        break;

      case "won":
      case "lost":
        //sent if the move was accepted
        showToast(data.message, data.type, 2000);
        showReset();
        break;

      case "game_ended":
        showToast(data.message, data.type, 2000);
        resetGame();
        break;

      default:
        break;
    }

    console.log(event);
  };

  webSocket.onclose = function (event) {
    console.log(event);
  };

  webSocket.onerror = function (error) {
    console.log(error);
  };
} //connect

function resetGame() {
  elements.rock.disabled = true;
  elements.paper.disabled = true;
  elements.scissors.disabled = true;
  elements.opponent.innerHTML = `<img src="/pics/donk.png" alt="profile pic" class="rounded-circle" style="height:2em;"> Your opponent`;
} //resetGame

function startRound(opponent) {
  elements.rock.disabled = false;
  elements.paper.disabled = false;
  elements.scissors.disabled = false;
  elements.opponent.innerHTML = `<img src="/pics/donk.png" alt="profile pic" class="rounded-circle" style="height:2em;"> ${escapeString(opponent)}`;
} //startRound

function sendMove(move) {
  elements.rock.disabled = true;
  elements.paper.disabled = true;
  elements.scissors.disabled = true;
  webSocket.send(JSON.stringify({ command: "move", streamer: streamer, userid: USER.userid, move: move }));
} //sendMove

function showReset() {
  elements.rock.disabled = true;
  elements.paper.disabled = true;
  elements.scissors.disabled = true;
} //showReset

async function loadAndConnect() {
  load_localStorage();
  refreshData();

  let input = location.hash;
  streamer = input.replace("#", "").toLowerCase().replace(/\s/g, "");

  // if (!streamer) {
  //   elements.info.innerHTML = `<span class="text-warning">No channel provided</span> Get the game link from your streamer.<br>Example: chat.vote/rps/play#forsen`;
  //   elements.info.style.display = "";
  //   return;
  // }

  if (USER.twitchLogin && !(await checkToken(USER.access_token))) {
    USER.channel = "";
    loginExpiredModal.show();
    return;
  }
  if (USER.twitchLogin === false && USER.channel) {
    resetSettings(true);
    return;
  }
  if (USER.channel) {
    connect();
  } else {
    elements.info.innerHTML = `<span class="text-warning">Not signed in.</span> Sign in with the button above.`;
    elements.info.style.display = "";
  }
} //loadAndConnect

window.onload = function () {
  darkTheme = (localStorage.getItem("darkTheme") || "true") === "true";
  elements.darkTheme.checked = darkTheme ?? true;
  switchTheme(elements.darkTheme.checked);

  loginExpiredModal = new bootstrap.Modal(elements.loginExpiredModal);

  loadAndConnect();

  elements.darkTheme.onchange = function () {
    switchTheme(this.checked);
    saveSettings();
  };
}; //onload

function animateHand(hand, move) {
  elements[`${hand}_rock`].style.display = "";
  elements[`${hand}_paper`].style.display = "none";
  elements[`${hand}_scissors`].style.display = "none";

  animate(`#${hand}_rock`, {
    rotate: hand == "left" ? -30 : 30,
    duration: 300,
    alternate: true,
    ease: "outElastic(1, .8)",
    loop: 7,
    onComplete: function (anim) {
      elements[`${hand}_rock`].style.display = "none";
      elements[`${hand}_${move}`].style.display = "";
    },
  });
} //animateHand
