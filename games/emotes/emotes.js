/*jshint esversion: 11 */
const CLIENT_ID = "qn0wimnszbqlwfnszdz3wwfz430eqr";
let voters = [];

let allEmotes = {
  twitchglobal: [],
  bttvglobal: [],
  ffzglobal: [],
  seventvglobal: [],
  twitch: [],
  bttv: [],
  ffz: [],
  seventv: [],
};
let elements = {
  //modals
  grid: document.getElementById("grid"),
  gameDiv: document.getElementById("gameDiv"),

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

  //main
  toastContainer: document.getElementById("toastContainer"),
};

const spinner = `<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>`;

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

async function refreshData() {
  darkTheme = elements.darkTheme.checked ?? true;

  if (!USER.twitchLogin) {
    USER.channel = elements.channelName.value.replace(/\s+/g, "").toLowerCase();
    USER.platform = "twitch";
  }
  if (!USER.userID && USER.channel) {
    USER.userID = await getUserID(USER.channel);
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

async function connect() {
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

  allEmotes.twitch = await getChannelTwitchEmotes(USER.channel, true);
  allEmotes.bttv = await getChannelBTTVEmotes(USER.userID, true);
  allEmotes.ffz = await getChannelFFZEmotes(USER.userID, true);
  allEmotes.seventv = await getChannel7TVEmotes(USER.userID, true);

  document.getElementById("twitchdesc").innerHTML = `<br>${allEmotes.twitch.length} emotes`;
  document.getElementById("bttvdesc").innerHTML = `<br>${allEmotes.bttv.length} emotes`;
  document.getElementById("ffzdesc").innerHTML = `<br>${allEmotes.ffz.length} emotes`;
  document.getElementById("7tvdesc").innerHTML = `<br>${allEmotes.seventv.length} emotes`;

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
    ebguess(context, msg);
  }); //message

  client.on("timeout", (channel, username, reason, duration, userstate) => {}); //timeout

  client.on("connected", async (address, port) => {
    console.log(`Connected to ${address}:${port}`);
    elements.status.innerHTML = `<h4><span class="badge bg-success">Connected :)</span></h4>`;
    saveSettings();
    sendUsername(`chat.vote/games/emotes`, USER.channel, USER.platform == "twitch" ? `twitch - ${USER.twitchLogin}` : "youtube");
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

window.onload = async function () {
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

  listeners();
  allEmotes.twitchglobal = await getGlobalTwitchEmotes(true);
  allEmotes.bttvglobal = await getGlobalBTTVEmotes(true);
  allEmotes.ffzglobal = await getGlobalFFZEmotes(true);
  allEmotes.seventvglobal = await getGlobal7TVEmotes(true);

  document.getElementById("twitchglobaldesc").innerHTML = `<br>${allEmotes.twitchglobal.length} emotes`;
  document.getElementById("bttvglobaldesc").innerHTML = `<br>${allEmotes.bttvglobal.length} emotes`;
  document.getElementById("ffzglobaldesc").innerHTML = `<br>${allEmotes.ffzglobal.length} emotes`;
  document.getElementById("7tvglobaldesc").innerHTML = `<br>${allEmotes.seventvglobal.length} emotes`;
}; //onload

window.onbeforeunload = function () {
  return null;
}; //onbeforeunload

let EMOTEBENCHMARK = {
  ebinterval: null,
  ebturn: 0,
  turnlength: 20000,
  emoteperround: 1,
  emotetimer: 2000,
  timerdecay: 80,
  oneguess: false,
  hidename: false,
  bluremote: false,
  ebanswer: "",
  qualified: [],
  qualifiedcurrentround: [],
  wrong: [],
  usedEmotes: [],
  ebtimer: null,
  twitchglobal: false,
  bttvglobal: false,
  ffzglobal: false,
  seventvglobal: false,
  twitch: false,
  bttv: false,
  ffz: false,
  seventv: false,
}; //EMOTEBENCHMARK

function start() {
  EMOTEBENCHMARK.emoteperround = parseInt(document.getElementById("emoteperround").value, 10);
  EMOTEBENCHMARK.turnlength = parseInt(document.getElementById("turnlength").value, 10) * 1000;
  EMOTEBENCHMARK.emotetimer = parseInt(document.getElementById("emotetimer").value, 10) * 1000;
  EMOTEBENCHMARK.timerdecay = parseInt(document.getElementById("timerdecay").value, 10) * 1000;
  EMOTEBENCHMARK.oneguess = document.getElementById("oneguess").checked;
  EMOTEBENCHMARK.hidename = document.getElementById("hidename").checked;
  EMOTEBENCHMARK.bluremote = document.getElementById("bluremote").checked;

  if (!EMOTEBENCHMARK.ebinterval) {
    startebturn();
    startebtimer();
    EMOTEBENCHMARK.ebinterval = setInterval(EMOTEBENCHMARK.startebturn, EMOTEBENCHMARK.turnlength);
  } else {
    console.log("interval already running");
  }
} //start

function reset() {
  clearInterval(EMOTEBENCHMARK.ebinterval);
  EMOTEBENCHMARK.ebinterval = null;
  EMOTEBENCHMARK.ebturn = 0;
  EMOTEBENCHMARK.ebanswer = "";
  document.getElementById("ebemotes").innerHTML = "";
  document.getElementById("eboutput").innerHTML = "";
  document.getElementById("timebar").style.display = "none";
  EMOTEBENCHMARK.qualified = [];
  EMOTEBENCHMARK.qualifiedcurrentround = [];
  EMOTEBENCHMARK.twitchglobal = false;
  EMOTEBENCHMARK.bttvglobal = false;
  EMOTEBENCHMARK.ffzglobal = false;
  EMOTEBENCHMARK.seventvglobal = false;
  EMOTEBENCHMARK.twitch = false;
  EMOTEBENCHMARK.bttv = false;
  EMOTEBENCHMARK.ffz = false;
  EMOTEBENCHMARK.seventv = false;
  document.getElementById("twitchglobal").checked = false;
  document.getElementById("bttvglobal").checked = false;
  document.getElementById("ffzglobal").checked = false;
  document.getElementById("7tvglobal").checked = false;
  document.getElementById("twitch").checked = false;
  document.getElementById("bttv").checked = false;
  document.getElementById("ffz").checked = false;
  document.getElementById("7tv").checked = false;
  document.getElementById("oneguess").checked = false;
  document.getElementById("hidename").checked = false;
  document.getElementById("bluremote").checked = false;
  document.getElementById("emoteperround").value = 1;
  document.getElementById("emoteperroundlabel").innerHTML = "1";
  document.getElementById("turnlength").value = 20;
  document.getElementById("turnlengthlabel").innerHTML = "20";
  document.getElementById("emotetimer").value = 2;
  document.getElementById("emotetimerlabel").innerHTML = "2";
  document.getElementById("timerdecay").value = 80;
  document.getElementById("timerdecaylabel").innerHTML = "80";
  EMOTEBENCHMARK.usedEmotes = [];
  //stopebtimer();
} //reset

function startebturn() {
  EMOTEBENCHMARK.ebturn++;
  startebtimer();

  let selectedemotes = [];
  let randomemotes = [];
  EMOTEBENCHMARK.ebanswer = "";
  document.getElementById("ebemotes").innerHTML = "";
  EMOTEBENCHMARK.qualified = EMOTEBENCHMARK.qualifiedcurrentround;
  EMOTEBENCHMARK.qualifiedcurrentround = [];
  if (EMOTEBENCHMARK.qualified.length == 1) {
    document.getElementById("eboutput").innerHTML = `Game is over. WINNER: ${EMOTEBENCHMARK.qualified.join(", ")}`;
    stopebtimer();
    clearInterval(EMOTEBENCHMARK.ebinterval);
    EMOTEBENCHMARK.ebinterval = null;
    EMOTEBENCHMARK.ebturn = 0;
    return;
  } else {
    document.getElementById("eboutput").innerHTML = `Qualified players: ${EMOTEBENCHMARK.qualified.join(", ")}`;
  }
  if (EMOTEBENCHMARK.qualified.length == 0 && EMOTEBENCHMARK.ebturn > 1) {
    document.getElementById("eboutput").innerHTML = `Game is over. No one won`;
    stopebtimer();
    clearInterval(EMOTEBENCHMARK.ebinterval);
    EMOTEBENCHMARK.ebinterval = null;
    EMOTEBENCHMARK.ebturn = 0;
    return;
  }

  if (EMOTEBENCHMARK.twitchglobal) {
    allEmotes.twitchglobal.forEach((element) => {
      selectedemotes.push(element);
    });
  }
  if (EMOTEBENCHMARK.bttvglobal) {
    allEmotes.bttvglobal.forEach((element) => {
      selectedemotes.push(element);
    });
  }
  if (EMOTEBENCHMARK.ffzglobal) {
    allEmotes.ffzglobal.forEach((element) => {
      selectedemotes.push(element);
    });
  }
  if (EMOTEBENCHMARK.seventvglobal) {
    allEmotes.seventvglobal.forEach((element) => {
      selectedemotes.push(element);
    });
  }
  if (EMOTEBENCHMARK.twitch) {
    allEmotes.twitch.forEach((element) => {
      selectedemotes.push(element);
    });
  }
  if (EMOTEBENCHMARK.bttv) {
    allEmotes.bttv.forEach((element) => {
      selectedemotes.push(element);
    });
  }
  if (EMOTEBENCHMARK.ffz) {
    allEmotes.ffz.forEach((element) => {
      selectedemotes.push(element);
    });
  }
  if (EMOTEBENCHMARK.seventv) {
    allEmotes.seventv.forEach((element) => {
      selectedemotes.push(element);
    });
  }

  EMOTEBENCHMARK.usedEmotes.forEach((element) => {
    selectedemotes = selectedemotes.filter((list) => list.name != element);
  });
  if (selectedemotes.length < 5) {
    stopebtimer();
    document.getElementById("timebar").style.display = "none";
    clearInterval(EMOTEBENCHMARK.ebinterval);
    EMOTEBENCHMARK.ebinterval = null;
    EMOTEBENCHMARK.ebturn = 0;
    showToast("Not enough emotes remaining.", "warning", 5000);
    return;
  }
  for (let i = 0; i < EMOTEBENCHMARK.emoteperround; i++) {
    randomemotes.push(selectedemotes[Math.floor(Math.random() * selectedemotes.length)]);
    randomemotes.forEach((element) => {
      EMOTEBENCHMARK.usedEmotes.push(element.name);
    });
  }
  document.getElementById("ebemotes").style.opacity = 0;
  for (let i = 0; i < randomemotes.length; i++) {
    let name = "";
    if (!EMOTEBENCHMARK.hidename) name = `<div class="text-body-secondary text-center">${randomemotes[i].name}</div>`;
    document.getElementById("ebemotes").innerHTML += `<div class="border border-secondary emote">
          <img src="${randomemotes[i].url}" alt="${randomemotes[i].name}" title="${randomemotes[i].name}">
          ${name}
          </div>`;
    EMOTEBENCHMARK.ebanswer += `${randomemotes[i].name} `;
  }

  document.getElementById("eboutput").innerHTML = `Qualified players:`;
  document.getElementById("timebar").style.display = "block";

  document.getElementById("timebar").style.width = "100%";
  setTimeout(() => {
    document.getElementById("ebemotes").style.opacity = 1;
    $("#timebar").animate(
      {
        width: "0px",
      },
      EMOTEBENCHMARK.emotetimer - EMOTEBENCHMARK.ebturn * 100
    );
  }, 2000);
  setTimeout(() => {
    document.getElementById("ebemotes").style.opacity = 0;
  }, 2000 + EMOTEBENCHMARK.emotetimer - EMOTEBENCHMARK.ebturn * 100);
} //startebturn

function ebguess(context, msg) {
  let limit = false;
  switch (EMOTEBENCHMARK.ebdifficulty) {
    case 4:
    case 5:
      limit = true;
      break;
    default:
      break;
  }

  if (limit) {
    if (!voters.includes(context.username)) {
      voters.push(context.username);
      if (msg == EMOTEBENCHMARK.ebanswer.trim()) {
      }
    }
  } else {
    if (msg == EMOTEBENCHMARK.ebanswer.trim()) {
      if (EMOTEBENCHMARK.qualified.includes(context.username) || EMOTEBENCHMARK.ebturn == 1) {
        if (!EMOTEBENCHMARK.qualifiedcurrentround.includes(context.username)) {
          EMOTEBENCHMARK.qualifiedcurrentround.push(context.username);
        }
      }

      document.getElementById("eboutput").innerHTML = `Qualified players: ${EMOTEBENCHMARK.qualifiedcurrentround.join(", ")}`;
    }
  }
} //ebguess

function startebtimer() {
  document.getElementById("ebtimer").style.display = "";

  if (EMOTEBENCHMARK.ebtimer) {
    if (EMOTEBENCHMARK.ebtimer.isRunning()) {
      EMOTEBENCHMARK.ebtimer.reset();
      EMOTEBENCHMARK.ebtimer.stop();
    }
  }
  if (isNaN(EMOTEBENCHMARK.turnlength)) {
    return;
  }
  if (EMOTEBENCHMARK.turnlength == 0) {
    return;
  }

  EMOTEBENCHMARK.ebtimer = new easytimer.Timer();
  EMOTEBENCHMARK.ebtimer.addEventListener("secondTenthsUpdated", function (e) {
    document.querySelector("#ebtimer .values").innerHTML = "Round ends in " + EMOTEBENCHMARK.ebtimer.getTimeValues().toString(["minutes", "seconds", "secondTenths"]);
  });
  EMOTEBENCHMARK.ebtimer.addEventListener("targetAchieved", function (e) {
    document.querySelector("#ebtimer .values").innerHTML = `Round #${EMOTEBENCHMARK.ebturn} starting...`;
    EMOTEBENCHMARK.ebtimer.reset();
    EMOTEBENCHMARK.ebtimer.stop();
  });
  document.querySelector("#ebtimer .values").innerHTML = `Round #${EMOTEBENCHMARK.ebturn} starting...`;

  setTimeout(() => {
    EMOTEBENCHMARK.ebtimer.start({
      countdown: true,
      precision: "secondTenths",
      startValues: {
        seconds: EMOTEBENCHMARK.turnlength / 1000 - 2,
      },
    });
  }, 2000);
} //startebtimer

function stopebtimer() {
  if (EMOTEBENCHMARK.ebtimer) {
    if (EMOTEBENCHMARK.ebtimer.isRunning()) {
      EMOTEBENCHMARK.ebtimer.reset();
      EMOTEBENCHMARK.ebtimer.stop();
    }
  }
  document.getElementById("ebtimer").style.display = "none";
} //stopebtimer

function listeners() {
  document.getElementById("twitchglobal").onchange = function () {
    EMOTEBENCHMARK.twitchglobal = this.checked;
  };
  document.getElementById("bttvglobal").onchange = function () {
    EMOTEBENCHMARK.bttvglobal = this.checked;
  };
  document.getElementById("ffzglobal").onchange = function () {
    EMOTEBENCHMARK.ffzglobal = this.checked;
  };
  document.getElementById("7tvglobal").onchange = function () {
    EMOTEBENCHMARK.seventvglobal = this.checked;
  };
  document.getElementById("twitch").onchange = function () {
    EMOTEBENCHMARK.twitch = this.checked;
  };
  document.getElementById("bttv").onchange = function () {
    EMOTEBENCHMARK.bttv = this.checked;
  };
  document.getElementById("ffz").onchange = function () {
    EMOTEBENCHMARK.ffz = this.checked;
  };
  document.getElementById("7tv").onchange = function () {
    EMOTEBENCHMARK.seventv = this.checked;
  };

  document.getElementById("emoteperround").oninput = function () {
    document.getElementById("emoteperroundlabel").innerHTML = this.value;
  };
  document.getElementById("turnlength").oninput = function () {
    document.getElementById("turnlengthlabel").innerHTML = this.value;
  };
  document.getElementById("emotetimer").oninput = function () {
    document.getElementById("emotetimerlabel").innerHTML = this.value;
  };
  document.getElementById("timerdecay").oninput = function () {
    document.getElementById("timerdecaylabel").innerHTML = this.value;
  };
} //listeners
