/*jshint esversion: 11 */
const CLIENT_ID = "qn0wimnszbqlwfnszdz3wwfz430eqr";

let elements = {
  //modals
  grid: document.getElementById("grid"),
  loginExpiredModal: document.getElementById("loginExpiredModal"),
  loginExpiredRenew: document.getElementById("loginExpiredRenew"),
  loginExpiredReset: document.getElementById("loginExpiredReset"),
  aboutModal: document.getElementById("aboutModal"),

  //navbar
  vtsLink: document.getElementById("vtsLink"),
  status: document.getElementById("status"),
  topRight: document.getElementById("topRight"),
  loginButton: document.getElementById("loginButton"),
  channelName: document.getElementById("channelName"),
  connectbtn: document.getElementById("connectbtn"),
  darkTheme: document.getElementById("darkTheme"),
};

const spinner = `<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>`;

let loginButton;

let loginExpiredModal, aboutModal;

let darkTheme = true;

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
        <ul class="dropdown-menu dropdown-menu-lg-end" aria-labelledby="btnGroupDropLogin">
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

  client.on("message", async (target, context, msg, self) => {}); //message

  client.on("timeout", (channel, username, reason, duration, userstate) => {}); //timeout

  client.on("connected", async (address, port) => {
    console.log(`Connected to ${address}:${port}`);
    elements.status.innerHTML = `<h4><span class="badge bg-success">Connected :)</span></h4>`;
    saveSettings();
    sendUsername(`chat.vote/games`, USER.channel, USER.platform == "twitch" ? `twitch - ${USER.twitchLogin}` : "youtube");
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
}; //onload

window.onbeforeunload = function () {
  return null;
}; //onbeforeunload
