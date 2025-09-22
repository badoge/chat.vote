let elements = {
  loginButton: document.getElementById("loginButton"),
  topRight: document.getElementById("topRight"),
  darkTheme: document.getElementById("darkTheme"),
  loginExpiredModal: document.getElementById("loginExpiredModal"),
  left_rock: document.getElementById("left_rock"),
  left_paper: document.getElementById("left_paper"),
  left_scissors: document.getElementById("left_scissors"),
  right_rock: document.getElementById("right_rock"),
  right_paper: document.getElementById("right_paper"),
  right_scissors: document.getElementById("right_scissors"),
  toastContainer: document.getElementById("toastContainer"),
  gameLink: document.getElementById("gameLink"),
  copyLinkButton: document.getElementById("copyLinkButton"),
  bracket: document.getElementById("bracket"),
  start: document.getElementById("start"),
  next: document.getElementById("next"),
};

const { animate } = anime;

let darkTheme = true;
let loginExpiredModal;
let copyLinkButton;
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
  saveSettings();
  loadBadges(USER.channel);
  loadPFP();
  sendUsername(`chat.vote/rps`, USER.channel, USER.platform == "twitch" ? `twitch - ${USER.twitchLogin}` : "youtube");

  //webSocket = new WebSocket("ws://localhost:9001");
  webSocket = new WebSocket("wss://ws.chat.vote");

  webSocket.onopen = function (event) {
    console.log(event);
    if (event.type == "open") {
      showToast("Connected to server", "success", 1000);
    }
  };

  webSocket.onmessage = function (event) {
    let data = JSON.parse(event.data);

    switch (data.id) {
      case "toast":
        showToast(data.message, data.type, 2000);
        break;
      case "start":
        //sent when the game starts/resets after clicking the start new game button
        showToast(data.message, data.type, 2000);
        resetBracket();
        break;

      case "update":
        //sent when a viewer joins
        addUser(data.username);
        break;

      case "update_move":
        //sent when a viewer sends their move
        updateUser(data.username);
        break;

      case "first_round":
        //sent after clicking next round for the first time after clicking start new game
        showToast(data.message, data.type, 2000);
        createBracket(data.bracket);
        break;

      case "next_round":
        showToast(data.message, data.type, 2000);

        break;

      case "game_over":
        showToast(data.message, data.type, 2000);

        break;

      default:
        break;
    }

    console.log(event);
  };

  webSocket.onclose = function (event) {
    if (event.type == "close") {
      showToast("disconnected from server", "danger", 2000);
    }
    console.log(event);
  };

  webSocket.onerror = function (error) {
    console.log(error);
  };
} //connect

function start() {
  elements.start.disabled = true;
  setTimeout(() => {
    elements.start.disabled = false;
  }, 2000);
  webSocket.send(JSON.stringify({ command: "start", username: USER.channel, userid: USER.userID, access_token: USER.access_token }));
} //start

function next() {
  elements.next.disabled = true;
  setTimeout(() => {
    elements.next.disabled = false;
  }, 2000);
  webSocket.send(JSON.stringify({ command: "next", username: USER.channel, userid: USER.userID, access_token: USER.access_token }));
} //next

function resetBracket() {
  elements.bracket.innerHTML = `
  <div class="card">
    <div class="card-header">Players</div>
    <div class="card-body" id="players"></div>
  </div>`;
} //resetBracket

function addUser(username) {
  document.getElementById("players").insertAdjacentHTML("afterbegin", `<span class="badge text-bg-secondary m-2" id="${username}_badge">⏳${escapeString(username)}</span>`);
} //addUser

function updateUser(username) {
  document.getElementById(`${username}_badge`).innerHTML = `✔${escapeString(username)}`;
} //addUser

function createBracket(bracket) {
  for (let index = 0; index < Object.keys(bracket).length; index++) {
    let roundName = "";
    switch (bracket[`round${index}`].length) {
      case 2:
        roundName = `Finals`;
        break;
      case 4:
        roundName = `Semifinals`;
        break;
      case 8:
        roundName = `Quarterfinals`;
        break;
      default:
        roundName = `Round of ${currentBracket[`round${currentRound}`].length}`;
        break;
    }
    elements.bracket.insertAdjacentHTML(
      "beforeend",
      `<div class="card">
      <div class="card-header">${roundName}</div>
      <div class="card-body" id="round${index}"></div>
      </div>`
    );
  }
} //createBracket

async function loadAndConnect() {
  load_localStorage();
  refreshData();
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
    elements.gameLink.value = `https://chat.vote/rps/play#${USER.channel || ""}`;
  }
} //loadAndConnect

window.onload = function () {
  darkTheme = (localStorage.getItem("darkTheme") || "true") === "true";
  elements.darkTheme.checked = darkTheme ?? true;
  switchTheme(elements.darkTheme.checked);

  loginExpiredModal = new bootstrap.Modal(elements.loginExpiredModal);
  copyLinkButton = new bootstrap.Popover(elements.copyLinkButton);

  loadAndConnect();

  elements.darkTheme.onchange = function () {
    switchTheme(this.checked);
    saveSettings();
  };
  randomAnimations();
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

function randomAnimations() {
  let moves = ["rock", "paper", "scissors"];

  elements[`left_rock`].style.display = "";
  elements[`left_paper`].style.display = "none";
  elements[`left_scissors`].style.display = "none";
  elements[`right_rock`].style.display = "";
  elements[`right_paper`].style.display = "none";
  elements[`right_scissors`].style.display = "none";

  animateHand("left", moves[Math.floor(Math.random() * moves.length)]);
  animateHand("right", moves[Math.floor(Math.random() * moves.length)]);
} //randomAnimations

let randomAnimationsInterval = setInterval(() => {
  randomAnimations();
}, 4500);

function copyLink() {
  navigator.clipboard.writeText(`https://chat.vote/rps/play#${USER.channel || ""}`);
  copyLinkButton.show();
  setTimeout(() => {
    copyLinkButton.hide();
  }, 1000);
} //copyLink
