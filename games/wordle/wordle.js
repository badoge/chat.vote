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
    if (!WORDLE.nwstarted) {
      if (!voters.includes(context.username)) {
        if (!input[0]) {
          return;
        }
        let word = input[0].toLowerCase();
        if (WORDLE.words.length == 0) {
          await WORDLE.loadwords();
        }
        if (WORDLE.verifywords) {
          if (WORDLE.words.includes(word)) {
            WORDLE.addWord(word, context.username);
            return;
          }
        } else {
          WORDLE.addWord(word, context.username);
          return;
        }
      }
    }
  }); //message

  client.on("timeout", (channel, username, reason, duration, userstate) => {}); //timeout

  client.on("connected", async (address, port) => {
    console.log(`Connected to ${address}:${port}`);
    elements.status.innerHTML = `<h4><span class="badge bg-success">Connected :)</span></h4>`;
    saveSettings();
    sendUsername(`chat.vote/games/wordle`, USER.channel, USER.platform == "twitch" ? `twitch - ${USER.twitchLogin}` : "youtube");
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

  WORDLE.listeners();
  WORDLE.shownw();
}; //onload

window.onbeforeunload = function () {
  return null;
}; //onbeforeunload

let WORDLE = {
  nwletter: 0,
  nwrow: 0,
  nwword: [],
  nwusers: "",
  nwstarted: false,
  wordList: [],
  wordlength: 5,
  guesslimit: 6,
  multiword: false,
  verifywords: true,
  words: [],

  addWord: function (word, username) {
    word = validator.escape(word).toLowerCase();
    if (word.length != WORDLE.wordlength) {
      return;
    }
    let index = WORDLE.wordList.findIndex((x) => x.word === word);
    if (index == -1) {
      WORDLE.wordList.push({ word: word, usernames: [username] });
    } else {
      WORDLE.wordList[index].usernames.push(username);
    }
    if (!WORDLE.multiword) {
      voters.push(username);
    }
    document.getElementById("wordcount").innerHTML = `Submitted words: ${WORDLE.wordList.length}`;
  },
  startnw: function () {
    if (WORDLE.wordList.length < 2) {
      showToast(`Chat needs to submit at least 2 words before you can start.`, "warning", 6000);
      return;
    } else {
      showToast(`A random word has been picked from chat's suggestions. Start guessing :)`, "success", 6000);
    }
    document.getElementById("nwoutput2").innerHTML = "";
    WORDLE.shownw();
    WORDLE.nwletter = 0;
    WORDLE.nwrow = 0;
    let random = WORDLE.wordList[Math.floor(Math.random() * WORDLE.wordList.length)];
    WORDLE.nwword = random.word.split("");
    WORDLE.nwusers = random.usernames.join(", ");
    WORDLE.nwstarted = true;
    WORDLE.wordList = WORDLE.wordList.filter((list) => list.word !== random.word);
    document.getElementById("wordcount").innerHTML = `Submitted words: ${WORDLE.wordList.length}`;
    document.getElementById("startnw").style.display = "none";
    document.getElementById("resetnw").style.display = "block";
  },
  reset: function () {
    document.getElementById("startnw").style.display = "block";
    document.getElementById("resetnw").style.display = "none";
    WORDLE.wordList = [];
    document.getElementById("wordcount").innerHTML = `Submitted words: 0`;
    document.getElementById("nwoutput").innerHTML = "";
    document.getElementById("nwoutput2").innerHTML = "";
    WORDLE.nwletter = 0;
    WORDLE.nwrow = 0;
    WORDLE.nwword = [];
    WORDLE.nwusers = "";
    WORDLE.words = [];
    WORDLE.nwstarted = false;
    WORDLE.shownw();
  },
  shownw: function () {
    let count = 0;
    let output = `<div class="container nwwrapper">`;
    for (let index1 = 0; index1 < WORDLE.guesslimit; index1++) {
      output += `<div class="row nwrows">`;
      for (let index2 = 0; index2 < WORDLE.wordlength; index2++) {
        output += `<div class="col nwsquare" id="nw${count}"></div>`;
        count++;
      }
      output += `</div>`;
    }
    output += `</div>`;
    document.getElementById("nwoutput").innerHTML = output;
  },
  loadwords: async function () {
    const response = await fetch(`/games/wordle/words/${WORDLE.wordlength}.json`);
    const json = await response.json();
    WORDLE.words = Object.keys(json);
  },
  listeners: function () {
    document.getElementById("multiword").onchange = function () {
      voters = [];
      WORDLE.multiword = this.checked;
    };
    document.getElementById("verifywords").onchange = function () {
      WORDLE.verifywords = this.checked;
      if (WORDLE.verifywords) {
        resetGame();
      }
    };
    document.addEventListener("keydown", function (event) {
      if (WORDLE.wordList.length < 1 || !WORDLE.nwstarted) {
        return;
      }
      let correct = 0;
      if (event.key == "Enter") {
        let guess = [];
        let tempnwword = [...WORDLE.nwword];
        for (let index = 0; index < WORDLE.wordlength; index++) {
          guess.push(document.getElementById(`nw${WORDLE.nwrow * WORDLE.wordlength + index}`).innerHTML.toLowerCase());
        }
        if (guess.includes("")) {
          return;
        }
        if (WORDLE.verifywords && !WORDLE.words.includes(guess.join(""))) {
          showToast(`"${guess.join("")}" is not a word <img src="/pics/donk.png" alt="donk" style="height:24px; width:24px;">`, "danger", 3000);
          return;
        }
        for (let index = 0; index < WORDLE.wordlength; index++) {
          document.getElementById(`nw${WORDLE.nwrow * WORDLE.wordlength + index}`).style.backgroundColor = "black";
        }
        for (let index = 0; index < WORDLE.wordlength; index++) {
          if (guess[index] == WORDLE.nwword[index]) {
            document.getElementById(`nw${WORDLE.nwrow * WORDLE.wordlength + index}`).style.backgroundColor = "green";
            let letterindex = tempnwword.indexOf(guess[index]);
            if (letterindex > -1) {
              tempnwword.splice(letterindex, 1);
            }
            correct++;
            if (correct == WORDLE.wordlength) {
              WORDLE.nwstarted = false;
              document.getElementById("resetnw").style.display = "none";
              document.getElementById("nwoutput2").innerHTML = `
                            <h2>Word guessed correctly!</h2>
                            <p>word submitted by: ${WORDLE.nwusers}</p>
                            <button type="button" onclick="WORDLE.startnw()" class="btn btn-success">Pick another word</button>
                            <button type="button" onclick="resetGame()" class="btn btn-warning">Reset</button>`;
            }
          }
        }
        for (let index = 0; index < WORDLE.wordlength; index++) {
          if (tempnwword.includes(guess[index]) && document.getElementById(`nw${WORDLE.nwrow * WORDLE.wordlength + index}`).style.backgroundColor != "green") {
            document.getElementById(`nw${WORDLE.nwrow * WORDLE.wordlength + index}`).style.backgroundColor = "orange";
            let letterindex = tempnwword.indexOf(guess[index]);
            if (letterindex > -1) {
              tempnwword.splice(letterindex, 1);
            }
          }
        }

        WORDLE.nwrow++;
        if (WORDLE.nwrow == WORDLE.guesslimit) {
          document.getElementById("nwoutput2").innerHTML = `
          <h2>No more guesses left</h2>
          <h2>Word: ${WORDLE.nwword.join("")}</h2>
          <p>word submitted by: ${WORDLE.nwusers}</p>
          <button type="button" onclick="WORDLE.startnw()" class="btn btn-success">Pick another word</button>
          <button type="button" onclick="resetGame()" class="btn btn-warning">Reset</button>`;
          WORDLE.nwstarted = false;
        }
      }
      if (event.key == "Backspace" && WORDLE.nwletter - WORDLE.nwrow * WORDLE.wordlength > 0) {
        document.getElementById(`nw${WORDLE.nwletter - 1}`).innerHTML = "";
        WORDLE.nwletter--;
      }
      if (event.key.length !== 1) {
        return;
      }
      if (event.key.toLowerCase() >= "a" && event.key.toLowerCase() <= "z" && WORDLE.nwletter - WORDLE.nwrow * WORDLE.wordlength < WORDLE.wordlength) {
        document.getElementById(`nw${WORDLE.nwletter}`).innerHTML = event.key.toUpperCase();
        WORDLE.nwletter++;
      }
    }); //wordle keypress
  },
}; //WORDLE

function resetGame() {
  voters = [];

  WORDLE.reset();
} //resetGame

function updateLabel(element) {
  document.getElementById(`${element.id}label`).innerHTML = element.value;
  if (document.getElementById(element.id) != element.value) {
    document.getElementById(element.id).value = element.value;
    //updateLabel({ id: "guesslimit", value: 10 }) when loading saved settings
  }
  switch (element.id) {
    case "wordlength":
      WORDLE.wordlength = element.value;
      break;
    case "guesslimit":
      WORDLE.guesslimit = element.value;
      break;
    default:
      break;
  }
  voters = [];
  WORDLE.words = [];
  WORDLE.wordList = [];
  document.getElementById("wordcount").innerHTML = `Submitted words: 0`;
  document.getElementById("nwoutput").innerHTML = "";
  document.getElementById("nwoutput2").innerHTML = "";
  WORDLE.nwletter = 0;
  WORDLE.nwrow = 0;
  WORDLE.nwword = [];
  WORDLE.nwusers = "";
  WORDLE.shownw();
} //updateLabel
