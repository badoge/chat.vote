/*jshint esversion: 11 */
let voters = [];

let elements = {
  //modals
  grid: document.getElementById("grid"),
  gameDiv: document.getElementById("gameDiv"),

  loginExpiredModal: document.getElementById("loginExpiredModal"),
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
          await loadwords();
        }
        if (WORDLE.verifywords) {
          if (WORDLE.words.includes(word)) {
            addWord(word, context.username);
            return;
          }
        } else {
          addWord(word, context.username);
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

  elements.darkTheme.onchange = function () {
    switchTheme(this.checked);
    saveSettings();
  };

  listeners();
  shownw();
}; //onload

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
}; //WORDLE

function addWord(word, username) {
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
} //addWord

function startnw() {
  if (WORDLE.wordList.length < 2) {
    showToast(`Chat needs to submit at least 2 words before you can start.`, "warning", 6000);
    return;
  } else {
    showToast(`A random word has been picked from chat's suggestions. Start guessing :)`, "success", 6000);
  }
  document.getElementById("nwoutput2").innerHTML = "";
  shownw();
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
} //startnw

function reset() {
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
  shownw();
} //reset

function shownw() {
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
} //shownw

async function loadwords() {
  const response = await fetch(`/games/wordle/words/${WORDLE.wordlength}.json`);
  const json = await response.json();
  WORDLE.words = Object.keys(json);
} //loadwords

function listeners() {
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
            <button type="button" onclick="startnw()" class="btn btn-success">Pick another word</button>
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
        <button type="button" onclick="startnw()" class="btn btn-success">Pick another word</button>
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
} //listeners

function resetGame() {
  voters = [];
  reset();
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
  shownw();
} //updateLabel
