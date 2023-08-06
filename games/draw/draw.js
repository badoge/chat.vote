/*jshint esversion: 11 */
const CLIENT_ID = "qn0wimnszbqlwfnszdz3wwfz430eqr";
let allEmotes = {
  twitchglobal: [],
  bttvglobal: [],
  ffzglobal: [],
  seventvglobal: [],
  twitch: [],
  bttv: [],
  ffz: [],
  seventv: [],
  emoji: [],
};
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
    if (msg === DRAW.drawanswer) {
      DRAW.correct({ username: context.username, displayname: context["display-name"], color: context.color, badges: context.badges });
    }
  }); //message

  client.on("timeout", (channel, username, reason, duration, userstate) => {}); //timeout

  client.on("connected", async (address, port) => {
    console.log(`Connected to ${address}:${port}`);
    elements.status.innerHTML = `<h4><span class="badge bg-success">Connected :)</span></h4>`;
    saveSettings();
    sendUsername(`chat.vote/games/draw`, USER.channel, USER.platform == "twitch" ? `twitch - ${USER.twitchLogin}` : "youtube");
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

window.onload = async function () {
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

  DRAW.listeners();
  allEmotes.twitchglobal = await getGlobalTwitchEmotes(true);
  allEmotes.bttvglobal = await getGlobalBTTVEmotes(true);
  allEmotes.ffzglobal = await getGlobalFFZEmotes(true);
  allEmotes.seventvglobal = await getGlobal7TVEmotes(true);
  allEmotes.emoji = await getEmoji();
  document.getElementById("twitchglobaldesc").innerHTML = `<br>${allEmotes.twitchglobal.length} emotes`;
  document.getElementById("bttvglobaldesc").innerHTML = `<br>${allEmotes.bttvglobal.length} emotes`;
  document.getElementById("ffzglobaldesc").innerHTML = `<br>${allEmotes.ffzglobal.length} emotes`;
  document.getElementById("7tvglobaldesc").innerHTML = `<br>${allEmotes.seventvglobal.length} emotes`;
  document.getElementById("emojidesc").innerHTML = `<br>${allEmotes.emoji.length} emoji`;
}; //onload

window.onbeforeunload = function () {
  return null;
}; //onbeforeunload

let DRAW = {
  drawanswer: "",
  drawanswerurl: "",
  drawanswerdesc: "",
  drawturn: 0,
  winner: false,
  canvas: null,
  redo_list: [],
  undo_list: [],
  state: null,
  twitchglobal: false,
  bttvglobal: false,
  ffzglobal: false,
  seventvglobal: false,
  twitch: false,
  bttv: false,
  ffz: false,
  seventv: false,
  emoji: false,
  drawnotimelimit: false,
  firstonly: false,
  drawturnlength: 60,
  drawpoints: 10,
  drawpointswin: 100,
  correctusers: 0,
  users: {},
  usedEmotes: [],
  start: function () {
    let selectedemotes = [];
    let randomemotes = [];
    if (DRAW.twitchglobal) {
      allEmotes.twitchglobal.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (DRAW.bttvglobal) {
      allEmotes.bttvglobal.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (DRAW.ffzglobal) {
      allEmotes.ffzglobal.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (DRAW.seventvglobal) {
      allEmotes.seventvglobal.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (DRAW.twitch) {
      allEmotes.twitch.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (DRAW.bttv) {
      allEmotes.bttv.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (DRAW.ffz) {
      allEmotes.ffz.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (DRAW.seventv) {
      allEmotes.seventv.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (DRAW.emoji) {
      allEmotes.emoji.forEach((element) => {
        selectedemotes.push(element);
      });
    }

    DRAW.usedEmotes.forEach((element) => {
      selectedemotes = selectedemotes.filter((list) => list.name !== element);
    });
    if (selectedemotes.length < 2) {
      showToast(`Not enough emotes selected`, "warning", 3000);
      return;
    }
    randomemotes.push(selectedemotes[Math.floor(Math.random() * selectedemotes.length)]);
    randomemotes.forEach((element) => {
      DRAW.usedEmotes.push(element.name);
    });
    if (randomemotes[0].url == "emoji") {
      document.getElementById("drawemotecardbody").innerHTML = `<div class="border border-secondary emote">
            ${randomemotes[0].name}<br>
            ${randomemotes[0].desc}
            </div>`;
      DRAW.drawanswerdesc = randomemotes[0].desc;
      twemoji.parse(document.getElementById("drawemotecardbody"));
    } else {
      document.getElementById("drawemotecardbody").innerHTML = `<div class="border border-secondary emote">
            <img src="${randomemotes[0].url}" alt="${randomemotes[0].name}" title="${randomemotes[0].name}"><br>
            ${randomemotes[0].name}
            </div>`;
    }

    DRAW.drawanswer = randomemotes[0].name;
    DRAW.drawanswerurl = randomemotes[0].url;
    DRAW.canvas.clear();
    document.getElementById("drawoutput").innerHTML = "";
    DRAW.drawturn++;
    DRAW.winner = false;
    DRAW.correctusers = 0;
  },
  reroll: function () {
    DRAW.winner = false;
    DRAW.correctusers = 0;
    let selectedemotes = [];
    let randomemotes = [];
    DRAW.drawanswer = "";
    document.getElementById("drawoutput").innerHTML = "";

    if (DRAW.twitchglobal) {
      allEmotes.twitchglobal.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (DRAW.bttvglobal) {
      allEmotes.bttvglobal.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (DRAW.ffzglobal) {
      allEmotes.ffzglobal.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (DRAW.seventvglobal) {
      allEmotes.seventvglobal.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (DRAW.twitch) {
      allEmotes.twitch.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (DRAW.bttv) {
      allEmotes.bttv.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (DRAW.ffz) {
      allEmotes.ffz.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (DRAW.seventv) {
      allEmotes.seventv.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (DRAW.emoji) {
      allEmotes.emoji.forEach((element) => {
        selectedemotes.push(element);
      });
    }

    DRAW.usedEmotes.forEach((element) => {
      selectedemotes = selectedemotes.filter((list) => list.name !== element);
    });
    if (selectedemotes.length < 2) {
      showToast(`Not enough emotes selected`, "warning", 3000);
      return;
    }
    randomemotes.push(selectedemotes[Math.floor(Math.random() * selectedemotes.length)]);
    randomemotes.forEach((element) => {
      DRAW.usedEmotes.push(element.name);
    });
    if (randomemotes[0].url == "emoji") {
      document.getElementById("drawemotecardbody").innerHTML = `<div class="border border-secondary emote">
            ${randomemotes[0].name}<br>
            ${randomemotes[0].desc}
            </div>`;
      DRAW.drawanswerdesc = randomemotes[0].desc;
      twemoji.parse(document.getElementById("drawemotecardbody"));
    } else {
      document.getElementById("drawemotecardbody").innerHTML = `<div class="border border-secondary emote">
            <img src="${randomemotes[0].url}" alt="${randomemotes[0].name}" title="${randomemotes[0].name}"><br>
            ${randomemotes[0].name}
            </div>`;
    }
    DRAW.drawanswer = randomemotes[0].name;
    DRAW.drawanswerurl = randomemotes[0].url;
    DRAW.canvas.clear();
  },
  correct: function (user) {
    if (DRAW.correctusers >= DRAW.drawpoints) {
      showToast(`No more points left; starting new round`, "warning", 3000);
      DRAW.start();
      return;
    }
    if (!DRAW.users[user.username]) {
      // if (subbadges.length == 0) {
      //     subbadges = await getsubbadges();
      // }
      let name = user.username == user.displayname.toLowerCase() ? `${user.displayname}` : `${user.displayname} (${user.username})`;
      let color = !user.color ? "#FFFFFF" : user.color;
      let badges = "";

      if (user.badges && user.badges.broadcaster == 1) {
        badges += `<img src="https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/3" style="height:1.3em;" title="Broadcaster"/>`;
      }
      if (user.badges && user.badges.moderator == 1) {
        badges += `<img src="https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3" style="height:1.3em;" title="Moderator"/>`;
      }
      if (user.badges && user.badges.vip == 1) {
        badges += `<img src="https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/3" style="height:1.3em;" title="VIP"/>`;
      }
      if (user.badges && user.badges.partner == 1) {
        badges += `<img src="https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3" style="height:1.3em;" title="Partner"/>`;
      }
      // if (user.badges && user.badges.subscriber != null && subbadges.length > 0) {
      //     let badge = subbadges.find(obj => obj.id === user.badges.subscriber);
      //     badges += `<img src="${badge.url}" style="height:1.3em;" title="Subscriber"/>`;
      // }
      if (user.badges && user.badges["glhf-pledge"] == 1) {
        badges += `<img src="https://static-cdn.jtvnw.net/badges/v1/3158e758-3cb4-43c5-94b3-7639810451c5/3" style="height:1.3em;" title="GLHF pledge"/>`;
      }

      if (DRAW.firstonly && !DRAW.winner) {
        user.score = DRAW.drawpoints;
        user.lastTurn = DRAW.drawturn;
        user.badges = badges;
        user.name = name;
        user.color = color;
        DRAW.users[user.username] = user;
        DRAW.correctusers++;
      } else if (!DRAW.firstonly) {
        user.score = DRAW.drawpoints - DRAW.correctusers;
        user.lastTurn = DRAW.drawturn;
        user.badges = badges;
        user.name = name;
        user.color = color;
        DRAW.users[user.username] = user;
        DRAW.correctusers++;
      } else {
        return;
      }
    } else {
      if (DRAW.users[user.username].lastTurn == DRAW.drawturn) {
        return;
      } else {
        if (DRAW.firstonly && !DRAW.winner) {
          DRAW.users[user.username].score += DRAW.drawpoints;
          DRAW.users[user.username].lastTurn = DRAW.drawturn;
          DRAW.correctusers++;
        } else if (!DRAW.firstonly) {
          DRAW.users[user.username].score += DRAW.drawpoints - DRAW.correctusers;
          DRAW.users[user.username].lastTurn = DRAW.drawturn;
          DRAW.correctusers++;
        } else {
          return;
        }
      }
    }

    let lb = "";
    Object.keys(DRAW.users)
      .sort(function (a, b) {
        return DRAW.users[b].score - DRAW.users[a].score;
      })
      .forEach((element) => {
        lb += `<li id="${DRAW.users[element].name}_draw" class="list-group-item">${DRAW.users[element].badges}<span style="color:${DRAW.users[element].color};"> ${DRAW.users[element].name}</span>: ${DRAW.users[element].score} point </li>`;
      });
    document.getElementById("drawlblist").innerHTML = lb;

    if (!DRAW.winner) {
      if (DRAW.drawanswerurl == "emoji") {
        document.getElementById("drawoutput").innerHTML = `
        <div class="card border-success">
        <div class="card-body">
        <h4>${user.username} was the first to get it right</h4><div class="border border-secondary emote"><br>
        ${DRAW.drawanswer}<br>
        ${DRAW.drawanswerdesc}
        </div><br>
        <button type="button" onclick="DRAW.start()" class="btn btn-success"><i class="material-icons notranslate">navigate_next</i>Next round</button>
        </div>
        </div>`;
        twemoji.parse(document.getElementById("drawoutput"));
      } else {
        document.getElementById("drawoutput").innerHTML = `
        <div class="card border-success">
        <div class="card-body">
        <h4>${user.username} was the first to get it right</h4><div class="border border-secondary emote"><br>
        <img src="${DRAW.drawanswerurl}" alt="${DRAW.drawanswer}" title="${DRAW.drawanswer}"><br>
        ${DRAW.drawanswer}
        </div><br>
        <button type="button" onclick="DRAW.start()" class="btn btn-success"><i class="material-icons notranslate">navigate_next</i>Next round</button>
        </div>
        </div>`;
      }
      DRAW.winner = true;
    }
  },
  reset: function () {
    DRAW.drawturn = 0;
    DRAW.correctusers = 0;
    DRAW.drawanswer = "";
    document.getElementById(
      "drawemotecardbody"
    ).innerHTML = `<span style="font-size: 4vh;">Place your facecam here<br><i class="material-icons notranslate" style="font-size: 6vh;">photo_camera</i></span>`;
    DRAW.drawnotimelimit = false;
    DRAW.firstonly = false;
    DRAW.drawturnlength = 60;
    DRAW.drawpoints = 10;
    DRAW.drawpointswin = 100;
    document.getElementById("drawnotimelimit").checked = false;
    document.getElementById("drawscoring1").checked = true;
    document.getElementById("drawturnlength").value = 60;
    document.getElementById("drawturnlength").disabled = false;
    document.getElementById("drawturnlengthlabel").innerHTML = "60";
    document.getElementById("drawpoints").value = 10;
    document.getElementById("drawpointswin").value = 100;

    DRAW.canvas.clear();
    DRAW.redo_list = [];
    DRAW.undo_list = [];
    DRAW.users = {};
    DRAW.state = null;
    document.getElementById("drawlblist").innerHTML = "";

    DRAW.twitchglobal = false;
    DRAW.bttvglobal = false;
    DRAW.ffzglobal = false;
    DRAW.seventvglobal = false;
    DRAW.twitch = false;
    DRAW.bttv = false;
    DRAW.ffz = false;
    DRAW.seventv = false;
    DRAW.emoji = false;
    document.getElementById("twitchglobal").checked = false;
    document.getElementById("bttvglobal").checked = false;
    document.getElementById("ffzglobal").checked = false;
    document.getElementById("7tvglobal").checked = false;
    document.getElementById("twitch").checked = false;
    document.getElementById("bttv").checked = false;
    document.getElementById("ffz").checked = false;
    document.getElementById("7tv").checked = false;
    document.getElementById("emoji").checked = false;
    DRAW.usedEmotes = [];
  },
  changeColor: function () {
    DRAW.canvas.freeDrawingBrush.color = this.value;
    document.getElementById("drawing-color").value = this.value;
    let brushsvg = document.getElementsByClassName("brushsvg");
    Array.from(brushsvg).forEach((element) => {
      element.style.fill = this.value;
    });
  },
  changeBrush: function (element) {
    DRAW.canvas.freeDrawingBrush.width = parseInt(element.value, 10) || 1;
    document.getElementById("drawing-line-width").value = parseInt(element.value, 10) || 1;
    document.getElementById("drawing-line-widthlabel").innerHTML = parseInt(element.value, 10) || 1;
  },
  replay: function (playStack, saveStack, buttonsOn, buttonsOff) {
    saveStack.push(DRAW.state);
    DRAW.state = playStack.pop();
    let on = document.getElementById(buttonsOn);
    let off = document.getElementById(buttonsOff.id);
    // turn both buttons off for the moment to prevent rapid clicking
    on.disabled = true;
    off.disabled = true;
    DRAW.canvas.clear();
    DRAW.canvas.loadFromJSON(DRAW.state, function () {
      DRAW.canvas.renderAll();
      // now turn the buttons back on if applicable
      on.disabled = false;
      if (playStack.length) {
        off.disabled = false;
      }
    });
  },
  save: function () {
    DRAW.redo_list = [];
    document.getElementById("redo").disabled = true;
    // initial call won"t have a state
    if (DRAW.state) {
      DRAW.undo_list.push(DRAW.state);
      document.getElementById("undo").disabled = false;
    }
    DRAW.state = JSON.stringify(DRAW.canvas);
  },
  listeners: function () {
    DRAW.canvas = new fabric.Canvas("drawcanvas", {
      isDrawingMode: true,
    });
    DRAW.canvas.on("mouse:up", function () {
      DRAW.save();
    });

    document.getElementById("undo").addEventListener("click", function () {
      DRAW.replay(DRAW.undo_list, DRAW.redo_list, "redo", this);
    });

    document.getElementById("redo").addEventListener("click", function () {
      DRAW.replay(DRAW.redo_list, DRAW.undo_list, "undo", this);
    });

    fabric.Object.prototype.transparentCorners = false;

    let drawingColorEl = document.getElementById("drawing-color");
    let drawingLineWidthEl = document.getElementById("drawing-line-width");
    let clearEl = document.getElementById("clear-canvas");

    clearEl.onclick = function () {
      DRAW.canvas.clear();
    };

    drawingColorEl.oninput = function () {
      let brush = DRAW.canvas.freeDrawingBrush;
      brush.color = this.value;
      brush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
      let brushsvg = document.getElementsByClassName("brushsvg");
      Array.from(brushsvg).forEach((element) => {
        element.style.fill = parseInt(this.value, 10);
      });
    };
    drawingLineWidthEl.oninput = function () {
      document.getElementById("drawing-line-widthlabel").innerHTML = this.value;
      DRAW.canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
      this.previousSibling.innerHTML = parseInt(this.value, 10);
    };
    document.getElementById("drawturnlength").oninput = function () {
      document.getElementById("drawturnlengthlabel").innerHTML = this.value;
    };

    if (DRAW.canvas.freeDrawingBrush) {
      DRAW.canvas.freeDrawingBrush.color = drawingColorEl.value;
      DRAW.canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
    }

    let colorbtns = document.getElementsByClassName("colorpreset");
    Array.from(colorbtns).forEach(function (element) {
      element.addEventListener("click", DRAW.changeColor);
    });
    document.getElementById("twitchglobal").onchange = function () {
      DRAW.twitchglobal = this.checked;
    };
    document.getElementById("bttvglobal").onchange = function () {
      DRAW.bttvglobal = this.checked;
    };
    document.getElementById("ffzglobal").onchange = function () {
      DRAW.ffzglobal = this.checked;
    };
    document.getElementById("7tvglobal").onchange = function () {
      DRAW.seventvglobal = this.checked;
    };
    document.getElementById("twitch").onchange = function () {
      DRAW.twitch = this.checked;
    };
    document.getElementById("bttv").onchange = function () {
      DRAW.bttv = this.checked;
    };
    document.getElementById("ffz").onchange = function () {
      DRAW.ffz = this.checked;
    };
    document.getElementById("7tv").onchange = function () {
      DRAW.seventv = this.checked;
    };
    document.getElementById("emoji").onchange = function () {
      DRAW.emoji = this.checked;
    };

    document.getElementById("drawturnlength").onchange = function () {
      DRAW.drawturnlength = parseInt(this.value, 10);
    };
    document.getElementById("drawnotimelimit").onchange = function () {
      DRAW.drawnotimelimit = this.checked;
      document.getElementById("drawturnlength").disabled = this.checked;
    };
    document.getElementById("drawscoring1").onchange = function () {
      DRAW.firstonly = !this.checked;
    };
    document.getElementById("drawscoring2").onchange = function () {
      DRAW.firstonly = this.checked;
    };
    document.getElementById("drawpoints").onchange = function () {
      DRAW.drawpoints = parseInt(this.value, 10);
    };
    document.getElementById("drawpointswin").onchange = function () {
      DRAW.drawpointswin = parseInt(this.value, 10);
    };
  },
}; //DRAW
