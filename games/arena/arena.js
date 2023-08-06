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
    if (
      (input[0] == "!join" && input[1]) ||
      input[0] == "DonkRogue" ||
      input[0] == "DonkHunter" ||
      input[0] == "DonkMage" ||
      input[0] == "DonkPaladin" ||
      input[0] == "DonkPriest" ||
      input[0] == "DonkShaman"
    ) {
      let chatterclass = "";
      if (input[0] == "!join") {
        chatterclass = input[1].toLowerCase();
      } else {
        chatterclass = input[0];
      }
      if (arena.aux.findUnitByName(context.username)) {
        return;
      } else {
        switch (chatterclass) {
          case "rogue":
          case "DonkRogue":
            arena.aux.addUnit(context.username, context.color || "#FFFFFF", "rogue");
            break;
          case "hunter":
          case "DonkHunter":
            arena.aux.addUnit(context.username, context.color || "#FFFFFF", "hunter");
            break;
          case "mage":
          case "DonkMage":
            arena.aux.addUnit(context.username, context.color || "#FFFFFF", "mage");
            break;
          case "paladin":
          case "DonkPaladin":
            arena.aux.addUnit(context.username, context.color || "#FFFFFF", "paladin");
            break;
          case "priest":
          case "DonkPriest":
            arena.aux.addUnit(context.username, context.color || "#FFFFFF", "priest");
            break;
          case "shaman":
          case "DonkShaman":
            arena.aux.addUnit(context.username, context.color || "#FFFFFF", "shaman");
            break;
          default:
            break;
        }
      }
    }
  }); //message

  client.on("timeout", (channel, username, reason, duration, userstate) => {}); //timeout

  client.on("connected", async (address, port) => {
    console.log(`Connected to ${address}:${port}`);
    elements.status.innerHTML = `<h4><span class="badge bg-success">Connected :)</span></h4>`;
    saveSettings();
    sendUsername(`chat.vote/games/arena`, USER.channel, USER.platform == "twitch" ? `twitch - ${USER.twitchLogin}` : "youtube");
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
}; //onload

window.onbeforeunload = function () {
  return null;
}; //onbeforeunload

/* jshint unused:false */
let arenaSetup = {
  chatters: [],

  /* ARENA PARAMETERS
      these will be defined by you, and cannot be changed during runtime
      attempting to change the values may lead to some bad stuff happening
    */
  params: {
    showUnitNames: true, // units will have their name shown over their head

    unitScale: 0.75, // new! - allows to make units and their projectiles smaller or bigger
    // does not affect platforms!

    // sound and music
    exponentialSoundLevels: true, // lowers sound levers when there are many units in the arena
    // users may experience earrape when this is disabled and arena has 50+ units

    notify: true,
    notifyDuration: 3333,
    // kill feed notifications
    killfeed: true, // enable/disable top right notifications
    killFeedDuration: 3333, // how long the notification stays on screen (in msecs)
    killFeedHardLimit: 69, // disables killfeed while there are more than this amount of units
    // game might crash when this value is too high (more than 100)

    // canvas
    width: 1280, // this is the base render resolution
    height: 720, // [!] if you need to change the display size of game, consider altering the canvas size by style instead!
    style: "", // you can provide CSS which will be applied to the canvas
    parent: "div#game", // set a query string OR the actual HTMLElement where the canvas will be created
  },

  /* SETTINGS
      these can be changed at any point in time
      safely assign the properties to your HTML controls like buttons or inputs
      ...or dont! - just type your values and leave it
    */
  settings: {
    // fullscreen behavior
    goFullscreenOnStart: false, // maximize canvas when starting the game
    exitFullscreenOnEnd: false, // exit fullscreen when the game ends

    // units
    unitLimit: 999, // max amount of units in the arena (zero = unlimited)
    allowNewUnitsAfterStart: false, // set to "true" if you want to allow joining even after the arena has started
    playerCanWalkWhileFreezeTime: false, // set to "true" to allow player(streamer) to walk before the arena starts
    // useful if you want to let them to try out the controls (they deal no damage to others before start)

    // music levels
    music: true,
    musicVolume: 0.3,
    // sound levels
    sound: true,
    soundVolume: 0.6,
  },

  /* RESOURCES
      you should change all the links so that they point to the files correctly
      you can modify the values (links and frame information), but not the keys!
    */
  resources: {
    image: {
      // background textures
      sky: "/games/pics/arena-bg.png",
      ground: "/games/pics/arena-longbar.png",
      // fullscreen button
      "fs-in": "/games/pics/go-fullscreen.png",
      "fs-out": "/games/pics/exit-fullscreen.png",
      // ability icons
      "icon-blink": "/games/pics/icon-blink.png",
      "icon-grenade": "/games/pics/icon-grenade.png",
      "icon-heal": "/games/pics/icon-heal.png",
      "icon-meteor": "/games/pics/icon-meteor.png",
      "icon-summon": "/games/pics/icon-summon.png",
      "icon-repel": "/games/pics/icon-repel.png",
      // units
      rogue: "/games/pics/donk-rogue.png",
      hunter: "/games/pics/donk-hunter.png",
      mage: "/games/pics/donk-mage.png",
      paladin: "/games/pics/donk-paladin.png",
      priest: "/games/pics/donk-priest.png",
      shaman: "/games/pics/donk-shaman.png",
      dummy: "/games/pics/megalul.png",
    },
    audio: {
      "dummy-attack": "/games/arena/audio/rogue-attack.mp3",
      "dummy-hit": "/games/arena/audio/rogue-hit.mp3",
      "rogue-attack": "/games/arena/audio/rogue-attack.mp3",
      "hunter-attack": "/games/arena/audio/hunter-attack.mp3",
      "mage-attack": "/games/arena/audio/mage-attack.mp3",
      "rogue-hit": "/games/arena/audio/rogue-hit.mp3",
      "hunter-hit": "/games/arena/audio/hunter-hit.mp3",
      "mage-hit": "/games/arena/audio/mage-hit.mp3",
      "paladin-attack": "/games/arena/audio/paladin-attack.mp3",
      "paladin-hit": "/games/arena/audio/paladin-hit.mp3",
      "priest-attack": "/games/arena/audio/priest-attack.mp3",
      "priest-hit": "/games/arena/audio/priest-hit.mp3",
      "shaman-attack": "/games/arena/audio/mage-attack.mp3", //  shamans dont attack, use whatever
      "shaman-hit": "/games/arena/audio/mage-hit.mp3",
      "unit-death": "/games/arena/audio/unit-death.mp3",
      heal: "/games/arena/audio/heal.mp3",
      blink: "/games/arena/audio/blink.mp3",
      grenade: "/games/arena/audio/grenade.mp3",
      "grenade-explode": "/games/arena/audio/grenade-impact.mp3",
      meteor: "/games/arena/audio/meteor.mp3",
      repel: "/games/arena/audio/repel.mp3",
      // music:
      "arena-ost": {
        resources: ["/games/arena/audio/arena-ost-full.mp3"],
        spritemap: {
          "ost-main-begin": {
            start: 123.4,
            end: 136.303,
            loop: false,
          },
          "ost-main-loop": {
            start: 136.303,
            end: 148.15,
            loop: true,
          },
          "ost-suspense-begin": {
            start: 171.58,
            end: 171.93,
            loop: false,
          },
          "ost-suspense-loop": {
            start: 171.93,
            end: 189.72,
            loop: true,
          },
          "ost-finale-begin": {
            start: 189.72,
            end: 189.72,
            loop: false,
          },
          "ost-finale-loop": {
            start: 189.72,
            end: 201.58,
            loop: true,
          },
        },
      },
      "arena-end": "/games/arena/audio/arena-end.mp3",
    },
    spritesheet: {
      // animations
      "hit-melee": ["/games/pics/hit-melee.png", { frameWidth: 32, frameHeight: 32 }],
      "hit-bullet": ["/games/pics/hit-bullet.png", { frameWidth: 16, frameHeight: 16 }],
      "hit-fireball": ["/games/pics/hit-fireball.png", { frameWidth: 32, frameHeight: 32 }],
      "hit-weakmagic": ["/games/pics/hit-weakmagic.png", { frameWidth: 24, frameHeight: 24 }],
      "abil-blink": ["/games/pics/blink2.png", { frameWidth: 64, frameHeight: 64 }],
      "abil-grenade": ["/games/pics/grenade-flying.png", { frameWidth: 16, frameHeight: 16 }],
      meteor: ["/games/pics/meteor.png", { frameWidth: 64, frameHeight: 64 }],
      "meteor-smoke": ["/games/pics/meteor-smoke.png", { frameWidth: 64, frameHeight: 64 }],
      explosion: ["/games/pics/explosion.png", { frameWidth: 128, frameHeight: 128 }],
    },
  },

  /* CALLBACKS
      can be useful for doing stuff when something happens
      replace placeholder functions with your custom ones

      do not add new keys or remove existing ones!
      only modify the values (functions)!

      some callbacks support arguments, see below
    */
  callbacks: {
    // is called when battle starts
    arenaStart: () => {},

    // is called when any unit dies
    unitDied: (victim, killer, weapon) => {
      /*
              "victim" and "killer" are objects
              and have the following structure:
              {
                name: string|any, // unit name, passed by you on creation
                color: string|any,// unit color, passed by you on creation
                class: string,    // unit class = rogue, mage, hunter
                weapon: string,   // unit weapon - a single emoji (for killfeed)
                stats: {
                  "lastKilledBy": object||null, // reference to unit who was the killer
                  "ability": 0, // times ability was used
                  "dead": 0,    // times this unit died (usually 1)
                  "damage": 0,  // amount of damage dealt
                  "tank": 0,    // amount of damage received
                  "restored": 0,// amount of own hp restored, either by self or others
                  "heal": 0,    // amount of given heals - either to self or to others
                  "frag": 0     // amount of units killed
                }
              }
              NOTE: "killer" can be null - if for whatever reason unit killed itself

              "weapon" is string - represents a single emoji of a kill weapon
              may or may not be the same as killer.weapon, use this instead!
            */
    },

    // is called when the battle ends (1 unit left alive)
    arenaEnd: (winner) => {
      /*
              "winner" is an object:
              {
                name: string|any, // unit name, passed by you on creation
                color: string|any,// unit color, passed by you on creation
                class: string,    // unit class = rogue, mage, hunter
                weapon: string,   // unit weapon - a single emoji (for killfeed)
                stats: {
                  "lastKilledBy": object||null, // reference to unit who was the killer
                  "ability": 0, // times ability was used
                  "dead": 0,    // times this unit died (usually 1)
                  "damage": 0,  // amount of damage dealt
                  "tank": 0,    // amount of damage received
                  "restored": 0,// amount of own hp restored, either by self or others
                  "heal": 0,    // amount of given heals - either to self or to others
                  "frag": 0     // amount of units killed
                }
              }
            */
    },

    // is called when the arena restarts (after a game)
    arenaRestart: () => {},
  },
  reset: function () {
    arena.aux.resetArena();
    html.startBtn.disabled = false;
    html.streamerRogue.disabled = false;
    html.streamerHunter.disabled = false;
    html.streamerMage.disabled = false;
    html.streamerPaladin.disabled = false;
    html.streamerPriest.disabled = false;
    html.streamerShaman.disabled = false;
    html.addBotBtn.disabled = false;
    html.bulkAddBotBtn.disabled = false;
  },
};

/* global arena, arenaSetup */
/*
  This file contains some examples on how to setup the buttons
  and inputs for the arena.
*/

const html = {
  killfeed: document.querySelector("#killfeed"),
  autoFullscreenInput: document.querySelector("input#bAutoFullscreen"),
  teamModeInput: document.querySelector("input#bTeamMode"),

  streamerRogue: document.querySelector("button#streamerRogue"),
  streamerHunter: document.querySelector("button#streamerHunter"),
  streamerMage: document.querySelector("button#streamerMage"),
  streamerPaladin: document.querySelector("button#streamerPaladin"),
  streamerPriest: document.querySelector("button#streamerPriest"),
  streamerShaman: document.querySelector("button#streamerShaman"),

  startBtn: document.querySelector("button#bStartGame"),
  addBotBtn: document.querySelector("button#bAddBot"),
  bulkAddBotBtn: document.querySelector("button#bAddBots"),
  addPassiveBotBtn: document.querySelector("button#bAddDummies"),
  cleanUpBtn: document.querySelector("button#bCleanUp"),
};

// big red button which starts the game
html.startBtn.addEventListener("click", () => {
  // init the arena

  try {
    arena.aux.startArena(); // this might throw error
    html.startBtn.disabled = true;
    html.streamerRogue.disabled = true;
    html.streamerHunter.disabled = true;
    html.streamerMage.disabled = true;
    html.streamerPaladin.disabled = true;
    html.streamerPriest.disabled = true;
    html.streamerShaman.disabled = true;
  } catch (error) {
    showToast(error, "warning", 3000);
  }
});

html.addBotBtn.addEventListener("click", () => {
  // get info
  let name = document.querySelector("input#sBotName").value.trim();
  document.querySelector("input#sBotName").value = "";
  let pClass = document.querySelector("select#sBotClass").value.toLowerCase();
  // actually attempt to add unit
  try {
    let color = Math.round(Math.random()) ? "yellow" : null; // null = random
    arena.aux.addUnit(name, color, pClass); // might fail if arena is full or is not ready
  } catch (error) {
    showToast(error, "warning", 3000);
  }
});
html.bulkAddBotBtn.addEventListener("click", () => {
  // get info
  let count = parseInt(document.getElementById("botsNumber").value, 10);
  if (isNaN(count)) return void console.warn("Bulk add: User input is NaN");

  if (arena.settings.unitLimit && count > arena.settings.unitLimit) {
    showToast(`You've requested too many units! \nWill spawn as many as possible instead.`, "warning", 6000);
    count = arena.settings.unitLimit;
  }
  while (count > 0) {
    count -= 1;
    try {
      arena.aux.addUnit();
    } catch (e) {
      // read the console for the error message
    }
  }
});

html.autoFullscreenInput.addEventListener("change", (event) => {
  // allow user to toggle auto-fullscreen when the game starts
  arena.settings.exitFullscreenOnEnd = event.target.checked;
  arena.settings.goFullscreenOnStart = event.target.checked;
});

// button: force the restart of arena
// can also be used after the game ends
html.cleanUpBtn.addEventListener("click", () => {
  arena.aux.resetArena();
  html.startBtn.disabled = false;
  html.streamerRogue.disabled = false;
  html.streamerHunter.disabled = false;
  html.streamerMage.disabled = false;
  html.streamerPaladin.disabled = false;
  html.streamerPriest.disabled = false;
  html.streamerShaman.disabled = false;
});

// button: add a playable unit
// this unit will be controlled by user!
html.streamerRogue.addEventListener("click", () => {
  if (arena.player) {
    arena.player.destroy();
    arena.player = null;
  }
  try {
    arena.aux.addPlayer(USER.channel, "#FF0000", "rogue");
  } catch (error) {
    // can fail if player already joined the arena
    showToast(error, "warning", 3000);
  }
});
html.streamerHunter.addEventListener("click", () => {
  if (arena.player) {
    arena.player.destroy();
    arena.player = null;
  }
  try {
    arena.aux.addPlayer(USER.channel, "#FF0000", "hunter");
  } catch (error) {
    // can fail if player already joined the arena
    showToast(error, "warning", 3000);
  }
});
html.streamerMage.addEventListener("click", () => {
  if (arena.player) {
    arena.player.destroy();
    arena.player = null;
  }
  try {
    arena.aux.addPlayer(USER.channel, "#FF0000", "mage");
  } catch (error) {
    // can fail if player already joined the arena
    showToast(error, "warning", 3000);
  }
});
html.streamerPaladin.addEventListener("click", () => {
  if (arena.player) {
    arena.player.destroy();
    arena.player = null;
  }
  try {
    arena.aux.addPlayer(USER.channel, "#FF0000", "paladin");
  } catch (error) {
    // can fail if player already joined the arena
    showToast(error, "warning", 3000);
  }
});
html.streamerPriest.addEventListener("click", () => {
  if (arena.player) {
    arena.player.destroy();
    arena.player = null;
  }
  try {
    arena.aux.addPlayer(USER.channel, "#FF0000", "priest");
  } catch (error) {
    // can fail if player already joined the arena
    showToast(error, "warning", 3000);
  }
});
html.streamerShaman.addEventListener("click", () => {
  if (arena.player) {
    arena.player.destroy();
    arena.player = null;
  }
  try {
    arena.aux.addPlayer(USER.channel, "#FF0000", "shaman");
  } catch (error) {
    // can fail if player already joined the arena
    showToast(error, "warning", 3000);
  }
});

document.querySelector("#sSound").addEventListener("input", (event) => {
  arena.settings.soundVolume = event.target.value / 100;
  document.getElementById("sSoundlabel").innerHTML = event.target.value;
});
document.querySelector("#sMusic").addEventListener("input", (event) => {
  arena.settings.musicVolume = event.target.value / 100;
  document.getElementById("sMusiclabel").innerHTML = event.target.value;
});
html.teamModeInput.addEventListener("change", (e) => {
  arena.aux.toggleTeamMode(e.target.checked);
});

/* EXAMPLES OF CALLBACKS */
// please define these functions in donk-arena-prerequisites.js!
// they are here just as an example

// custom killfeed
arenaSetup.callbacks.unitDied = (victimObject, killerObject, weapon) => {
  // victim is always there, killer - not always (if null, the death was a suicide probably, or idk)
  const line = document.createElement("div");
  line.classList.add("killfeed-line");
  line.innerHTML = `
    <span style="color: ${killerObject ? killerObject.color : "white"};">${killerObject ? killerObject.name : ""}</span>
    <span style="color: white;">${weapon}</span>
    <span style="color: ${victimObject ? victimObject.color : "white"};">${victimObject ? victimObject.name : ""}</span>`;
  html.killfeed.appendChild(line);
  setTimeout(() => line.remove(), 3000);
};

// enable "restart" button when the arena ends
arenaSetup.callbacks.arenaEnd = (winnerObject) => {
  console.log("The champion is: ", winnerObject);
  document.querySelectorAll("div#controls > div.control-line").forEach((c) => (c.style.display = ""));
};

// enable controls when the arena starts
arenaSetup.callbacks.arenaRestart = () => {
  arenaBetterAi.initialize(arena);
  // html.startBtn.disabled = false;
  // html.streamerRogue.disabled = false;
  // html.streamerHunter.disabled = false;
  // html.streamerMage.disabled = false;
  // html.streamerPaladin.disabled = false;
  // html.streamerPriest.disabled = false;
  // html.streamerShaman.disabled = false;
  // html.addBotBtn.disabled = false;
  // html.bulkAddBotBtn.disabled = false;
  // document.querySelectorAll("div#controls > div.control-line").forEach(c => c.style.display = "");
};
