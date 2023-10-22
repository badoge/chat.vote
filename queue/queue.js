function copyLink(link) {
  navigator.clipboard.writeText(link);
  copyTooltip.show();
  setTimeout(() => {
    copyTooltip.hide();
  }, 1000);
} //copyLink

let elements = {
  //modals
  modal1: document.getElementById("modal1"),
  modal2: document.getElementById("modal2"),
  modal3: document.getElementById("modal3"),
  modal4: document.getElementById("modal4"),
  modal5: document.getElementById("modal5"),
  modal6: document.getElementById("modal6"),
  modal7: document.getElementById("modal7"),
  modal8: document.getElementById("modal8"),
  modal9: document.getElementById("modal9"),
  modal10: document.getElementById("modal10"),

  //navbar
  status: document.getElementById("status"),
  botStatus: document.getElementById("botStatus"),
  topRight: document.getElementById("topRight"),
  loginButton: document.getElementById("loginButton"),
};

let client;
let color = "";
let currentTime = 0;
let loginButton;
let modal1, modal2, modal3, modal4, modal5, modal6, modal7, modal8, modal9, modal10;

let QUEUE = {
  userID: "",
  channel: "",
  access_token: "",
  refresh_token: "",
  platform: "",
};

function refreshData() {} //refreshdata

function saveSettings() {
  refreshData();
  localStorage.setItem("QUEUE", JSON.stringify(QUEUE));
} //saveSettings

function load_localStorage() {
  if (!localStorage.getItem("QUEUE")) {
    console.log("localStorage user info not found");
  } else {
    QUEUE = JSON.parse(localStorage.getItem("QUEUE"));
  }

  if (!localStorage.getItem("QUEUE")) {
    console.log("localStorage settings not found");
  } else {
  }
} //load_localStorage

function resetSettings() {
  localStorage.setItem(
    "QUEUE",
    JSON.stringify({
      userID: "",
      channel: "",
      access_token: "",
      refresh_token: "",
      platform: "",
    })
  );
  localStorage.setItem("QUEUE", JSON.stringify({}));
  location.reload();
  return false;
} //resetSettings

function reset() {} //reset

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
  <button id="btnGroupDroplogin" type="button" class="btn btn-twitch dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"></button>
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
    channels: [QUEUE.channel],
  };
  client = new tmi.client(options);

  client.on("message", async (target, context, msg, self) => {
    let input = msg.split(" ").filter(Boolean);
    let command = input[0].toLowerCase();
    let args = input.slice(1);
  }); //message

  client.on("timeout", (channel, username, reason, duration, userstate) => {}); //timeout

  client.on("connected", async (address, port) => {
    console.log(`Connected to ${address}:${port}`);
    elements.status.innerHTML = `<h4><span class="badge bg-success">Connected :)</span></h4>`;
    saveSettings();
    sendUsername(`chat.vote/queue`, QUEUE.channel, QUEUE.platform);
    if (await checkTags(QUEUE.userID, QUEUE.access_token)) {
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
  if (!QUEUE.channel) {
    elements.topRight.innerHTML = `<a
    role="button"
    id="loginButton"
    onclick="login()"
    class="btn btn-twitch"
    tabindex="0"
    data-bs-container="body"
    data-bs-custom-class="custom-popover"
    data-bs-placement="bottom"
    data-bs-trigger="manual"
    data-bs-toggle="popover"
    data-bs-title="Not signed in"
    data-bs-content="You need sign in first">
    <span class="twitch-icon"></span>Sign in with Twitch</a>`;
    return;
  }
  let profilepicurl = await get7TVPFP(QUEUE.userID);
  if (profilepicurl == "/pics/donk.png" && QUEUE.access_token) {
    profilepicurl = await getTwitchPFP(QUEUE.channel, QUEUE.access_token);
  }
  elements.topRight.innerHTML = `
  <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
  <button type="button" class="btn btn-secondary"><img src="${profilepicurl}" alt="profile pic" style="height:2em;"></button>
  <div class="btn-group" role="group">
  <button id="btnGroupDrop1" type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
  ${QUEUE.channel}
  </button>
  <ul class="dropdown-menu dropdown-menu-lg-end" aria-labelledby="btnGroupDrop1">
  <li><a class="dropdown-item" onclick="logout()" href="#"><i class="material-icons notranslate">logout</i>Log out</a></li>
  </ul>
  </div>
  </div>`;
} //loadPFP

function checkLogin() {
  if (!QUEUE.channel) {
    loginButton.show();
    setTimeout(function () {
      loginButton.hide();
    }, 4000);
    return false;
  }
  return true;
} //checkLogin

function firstMessageWarning(username) {
  showToast(`<i class="material-icons notranslate">warning_amber</i>${username}'s first ever message in chat was a vote.`, "warning", 3000);
} //firstMessageWarning

function logout() {
  elements.topRight.innerHTML = `<a
    role="button"
    id="loginButton"
    onclick="login()"
    class="btn btn-twitch"
    tabindex="0"
    data-bs-container="body"
    data-bs-custom-class="custom-popover"
    data-bs-placement="bottom"
    data-bs-trigger="manual"
    data-bs-toggle="popover"
    data-bs-title="Not signed in"
    data-bs-content="You need sign in first">
    <span class="twitch-icon"></span>Sign in with Twitch</a>`;
  resetSettings();
} //logout

async function loadAndConnect() {
  load_localStorage();
  refreshData();

  if (QUEUE.channel) {
    connect();
  }
} //loadAndConnect

window.onload = function () {
  //loadAndConnect();

  if (!QUEUE.channel) {
    loginButton = new bootstrap.Popover(elements.loginButton);
  }

  //   modal1 = new bootstrap.Modal(elements.modal1);
  //   modal2 = new bootstrap.Modal(elements.modal2);
  //   modal3 = new bootstrap.Modal(elements.modal3);
  //   modal4 = new bootstrap.Modal(elements.modal4);
  //   modal5 = new bootstrap.Modal(elements.modal5);
  //   modal6 = new bootstrap.Modal(elements.modal6);
  //   modal7 = new bootstrap.Modal(elements.modal7);
  //   modal8 = new bootstrap.Modal(elements.modal8);
  //   modal9 = new bootstrap.Modal(elements.modal9);
  //   modal10 = new bootstrap.Modal(elements.modal10);

  enableTooltips();
  enablePopovers();

  const offcanvasElementList = document.querySelectorAll(".offcanvas");
  const offcanvasList = [...offcanvasElementList].map((offcanvasEl) => new bootstrap.Offcanvas(offcanvasEl));
}; //onload

window.onbeforeunload = function () {
  disconnectBot();

  return null;
}; //onbeforeunload
