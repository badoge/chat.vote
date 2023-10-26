let voters = [];

let allEmotes = {
  twitchGlobal: [],
  bttvGlobal: [],
  ffzGlobal: [],
  seventvGlobal: [],
  twitchChannel: [],
  bttvChannel: [],
  ffzChannel: [],
  seventvChannel: [],
};
let elements = {
  //modals
  grid: document.getElementById("grid"),
  loginExpiredModal: document.getElementById("loginExpiredModal"),
  aboutModal: document.getElementById("aboutModal"),

  //navbar
  vtsLink: document.getElementById("vtsLink"),
  status: document.getElementById("status"),
  topRight: document.getElementById("topRight"),
  loginButton: document.getElementById("loginButton"),
  channelName: document.getElementById("channelName"),
  darkTheme: document.getElementById("darkTheme"),

  //main
  toastContainer: document.getElementById("toastContainer"),
  settingsOffcanvas: document.getElementById("settingsOffcanvas"),
  twitchGlobal: document.getElementById("twitchGlobal"),
  bttvGlobal: document.getElementById("bttvGlobal"),
  ffzGlobal: document.getElementById("ffzGlobal"),
  seventvGlobal: document.getElementById("seventvGlobal"),
  twitchChannel: document.getElementById("twitchChannel"),
  bttvChannel: document.getElementById("bttvChannel"),
  ffzChannel: document.getElementById("ffzChannel"),
  seventvChannel: document.getElementById("seventvChannel"),
  oneAnswer: document.getElementById("oneAnswer"),
  hideName: document.getElementById("hideName"),
  blurEmote: document.getElementById("blurEmote"),
  emotesPerRound: document.getElementById("emotesPerRound"),
  emotesPerRoundLabel: document.getElementById("emotesPerRoundLabel"),
  turnLength: document.getElementById("turnLength"),
  turnLengthLabel: document.getElementById("turnLengthLabel"),
  emoteTimer: document.getElementById("emoteTimer"),
  emoteTimerLabel: document.getElementById("emoteTimerLabel"),
  timerDecay: document.getElementById("timerDecay"),
  timerDecayLabel: document.getElementById("timerDecayLabel"),
  twitchGlobalCount: document.getElementById("twitchGlobalCount"),
  bttvGlobalCount: document.getElementById("bttvGlobalCount"),
  ffzGlobalCount: document.getElementById("ffzGlobalCount"),
  seventvGlobalCount: document.getElementById("seventvGlobalCount"),
  twitchChannelCount: document.getElementById("twitchChannelCount"),
  bttvChannelCount: document.getElementById("bttvChannelCount"),
  ffzChannelCount: document.getElementById("ffzChannelCount"),
  seventvChannelCount: document.getElementById("seventvChannelCount"),
  output: document.getElementById("output"),
  timeBar: document.getElementById("timeBar"),
  emotes: document.getElementById("emotes"),

  timer: document.getElementById("timer"),
  timerValue: document.getElementById("timerValue"),
};

let loginButton;
let darkTheme = true;
let settingsOffcanvas;
let loginExpiredModal, aboutModal;

let USER = {
  channel: "",
  twitchLogin: false,
  access_token: "",
  userID: "",
  platform: "",
};

function handleMessage(target, context, msg, self) {
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
      if (msg == EMOTEBENCHMARK.answer.trim()) {
      }
    }
  } else {
    if (msg == EMOTEBENCHMARK.answer.trim()) {
      if (EMOTEBENCHMARK.qualified.includes(context.username) || EMOTEBENCHMARK.turn == 1) {
        if (!EMOTEBENCHMARK.qualifiedCurrentRound.includes(context.username)) {
          EMOTEBENCHMARK.qualifiedCurrentRound.push(context.username);
        }
      }

      elements.output.innerHTML = `Qualified players: ${EMOTEBENCHMARK.qualifiedCurrentRound.join(", ")}`;
    }
  }
} //handleMessage

let EMOTEBENCHMARK = {
  interval: null,
  turn: 0,
  turnLength: 20000,
  emotesPerRound: 1,
  emoteTimer: 2000,
  timerDecay: 80,
  oneAnswer: false,
  hideName: false,
  blurEmote: false,
  answer: "",
  qualified: [],
  qualifiedCurrentRound: [],
  wrong: [],
  usedEmotes: [],
  timer: null,
  twitchGlobal: false,
  bttvGlobal: false,
  ffzGlobal: false,
  seventvGlobal: false,
  twitchChannel: false,
  bttvChannel: false,
  ffzChannel: false,
  seventvChannel: false,
}; //EMOTEBENCHMARK

function start() {
  EMOTEBENCHMARK.emotesPerRound = parseInt(elements.emotesPerRound.value, 10);
  EMOTEBENCHMARK.turnLength = parseInt(elements.turnLength.value, 10) * 1000;
  EMOTEBENCHMARK.emoteTimer = parseInt(elements.emoteTimer.value, 10) * 1000;
  EMOTEBENCHMARK.timerDecay = parseInt(elements.timerDecay.value, 10) * 1000;
  EMOTEBENCHMARK.oneAnswer = elements.oneAnswer.checked;
  EMOTEBENCHMARK.hideName = elements.hideName.checked;
  EMOTEBENCHMARK.blurEmote = elements.blurEmote.checked;

  if (!EMOTEBENCHMARK.interval) {
    startTurn();
    startTimer();
    EMOTEBENCHMARK.interval = setInterval(startTurn, EMOTEBENCHMARK.turnLength);
  } else {
    console.log("interval already running");
  }
} //start

function reset() {
  clearInterval(EMOTEBENCHMARK.interval);
  EMOTEBENCHMARK.interval = null;
  EMOTEBENCHMARK.turn = 0;
  EMOTEBENCHMARK.answer = "";
  elements.emotes.innerHTML = "";
  elements.output.innerHTML = "";
  elements.timeBar.style.display = "none";
  EMOTEBENCHMARK.qualified = [];
  EMOTEBENCHMARK.qualifiedCurrentRound = [];
  EMOTEBENCHMARK.twitchGlobal = false;
  EMOTEBENCHMARK.bttvGlobal = false;
  EMOTEBENCHMARK.ffzGlobal = false;
  EMOTEBENCHMARK.seventvGlobal = false;
  EMOTEBENCHMARK.twitchChannel = false;
  EMOTEBENCHMARK.bttvChannel = false;
  EMOTEBENCHMARK.ffzChannel = false;
  EMOTEBENCHMARK.seventvChannel = false;
  elements.twitchGlobal.checked = false;
  elements.bttvGlobal.checked = false;
  elements.ffzGlobal.checked = false;
  elements.seventvGlobal.checked = false;
  elements.twitchChannel.checked = false;
  elements.bttvChannel.checked = false;
  elements.ffzChannel.checked = false;
  elements.seventvChannel.checked = false;
  elements.oneAnswer.checked = false;
  elements.hideName.checked = false;
  elements.blurEmote.checked = false;
  elements.emotesPerRound.value = 1;
  elements.emotesPerRoundLabel.innerHTML = "1";
  elements.turnLength.value = 20;
  elements.turnLengthLabel.innerHTML = "20";
  elements.emoteTimer.value = 2;
  elements.emoteTimerLabel.innerHTML = "2";
  elements.timerDecay.value = 80;
  elements.timerDecayLabel.innerHTML = "80";
  EMOTEBENCHMARK.usedEmotes = [];
  //stopTimer();
} //reset

function startTurn() {
  EMOTEBENCHMARK.turn++;
  startTimer();

  let selectedemotes = [];
  let randomemotes = [];
  EMOTEBENCHMARK.answer = "";
  elements.emotes.innerHTML = "";
  EMOTEBENCHMARK.qualified = EMOTEBENCHMARK.qualifiedCurrentRound;
  EMOTEBENCHMARK.qualifiedCurrentRound = [];
  if (EMOTEBENCHMARK.qualified.length == 1) {
    elements.output.innerHTML = `Game is over. WINNER: ${EMOTEBENCHMARK.qualified.join(", ")}`;
    stopTimer();
    clearInterval(EMOTEBENCHMARK.interval);
    EMOTEBENCHMARK.interval = null;
    EMOTEBENCHMARK.turn = 0;
    return;
  } else {
    elements.output.innerHTML = `Qualified players: ${EMOTEBENCHMARK.qualified.join(", ")}`;
  }
  if (EMOTEBENCHMARK.qualified.length == 0 && EMOTEBENCHMARK.turn > 1) {
    elements.output.innerHTML = `Game is over. No one won`;
    stopTimer();
    clearInterval(EMOTEBENCHMARK.interval);
    EMOTEBENCHMARK.interval = null;
    EMOTEBENCHMARK.turn = 0;
    return;
  }

  if (EMOTEBENCHMARK.twitchGlobal) {
    allEmotes.twitchGlobal.forEach((element) => {
      selectedemotes.push(element);
    });
  }
  if (EMOTEBENCHMARK.bttvGlobal) {
    allEmotes.bttvGlobal.forEach((element) => {
      selectedemotes.push(element);
    });
  }
  if (EMOTEBENCHMARK.ffzGlobal) {
    allEmotes.ffzGlobal.forEach((element) => {
      selectedemotes.push(element);
    });
  }
  if (EMOTEBENCHMARK.seventvGlobal) {
    allEmotes.seventvGlobal.forEach((element) => {
      selectedemotes.push(element);
    });
  }
  if (EMOTEBENCHMARK.twitchChannel) {
    allEmotes.twitchChannel.forEach((element) => {
      selectedemotes.push(element);
    });
  }
  if (EMOTEBENCHMARK.bttvChannel) {
    allEmotes.bttvChannel.forEach((element) => {
      selectedemotes.push(element);
    });
  }
  if (EMOTEBENCHMARK.ffzChannel) {
    allEmotes.ffzChannel.forEach((element) => {
      selectedemotes.push(element);
    });
  }
  if (EMOTEBENCHMARK.seventvChannel) {
    allEmotes.seventvChannel.forEach((element) => {
      selectedemotes.push(element);
    });
  }

  EMOTEBENCHMARK.usedEmotes.forEach((element) => {
    selectedemotes = selectedemotes.filter((list) => list.name != element);
  });
  if (selectedemotes.length < 5) {
    stopTimer();
    elements.timeBar.style.display = "none";
    clearInterval(EMOTEBENCHMARK.interval);
    EMOTEBENCHMARK.interval = null;
    EMOTEBENCHMARK.turn = 0;
    showToast("Not enough emotes remaining.", "warning", 5000);
    settingsOffcanvas.show();
    return;
  }
  for (let i = 0; i < EMOTEBENCHMARK.emotesPerRound; i++) {
    randomemotes.push(selectedemotes[Math.floor(Math.random() * selectedemotes.length)]);
    randomemotes.forEach((element) => {
      EMOTEBENCHMARK.usedEmotes.push(element.name);
    });
  }
  elements.emotes.style.opacity = 0;
  for (let i = 0; i < randomemotes.length; i++) {
    let name = "";
    if (!EMOTEBENCHMARK.hideName) name = `<div class="text-body-secondary text-center">${randomemotes[i].name}</div>`;
    elements.emotes.innerHTML += `<div class="border border-secondary emote">
          <img src="${randomemotes[i].url}" alt="${randomemotes[i].name}" title="${randomemotes[i].name}">
          ${name}
          </div>`;
    EMOTEBENCHMARK.answer += `${randomemotes[i].name} `;
  }

  elements.output.innerHTML = `Qualified players:`;
  elements.timeBar.style.display = "block";

  elements.timeBar.style.width = "100%";
  setTimeout(() => {
    elements.emotes.style.opacity = 1;
    $("#timeBar").animate(
      {
        width: "0px",
      },
      EMOTEBENCHMARK.emoteTimer - EMOTEBENCHMARK.turn * 100
    );
  }, 2000);
  setTimeout(() => {
    elements.emotes.style.opacity = 0;
  }, 2000 + EMOTEBENCHMARK.emoteTimer - EMOTEBENCHMARK.turn * 100);
} //startTurn

function startTimer() {
  elements.timer.style.display = "";

  if (EMOTEBENCHMARK.timer) {
    if (EMOTEBENCHMARK.timer.isRunning()) {
      EMOTEBENCHMARK.timer.reset();
      EMOTEBENCHMARK.timer.stop();
    }
  }
  if (isNaN(EMOTEBENCHMARK.turnLength)) {
    return;
  }
  if (EMOTEBENCHMARK.turnLength == 0) {
    return;
  }

  EMOTEBENCHMARK.timer = new easytimer.Timer();
  EMOTEBENCHMARK.timer.addEventListener("secondTenthsUpdated", function (e) {
    elements.timerValue.innerHTML = "Round ends in " + EMOTEBENCHMARK.timer.getTimeValues().toString(["minutes", "seconds", "secondTenths"]);
  });
  EMOTEBENCHMARK.timer.addEventListener("targetAchieved", function (e) {
    elements.timerValue.innerHTML = `Round #${EMOTEBENCHMARK.turn} starting...`;
    EMOTEBENCHMARK.timer.reset();
    EMOTEBENCHMARK.timer.stop();
  });
  elements.timerValue.innerHTML = `Round #${EMOTEBENCHMARK.turn} starting...`;

  setTimeout(() => {
    EMOTEBENCHMARK.timer.start({
      countdown: true,
      precision: "secondTenths",
      startValues: {
        seconds: EMOTEBENCHMARK.turnLength / 1000 - 2,
      },
    });
  }, 2000);
} //startTimer

function stopTimer() {
  if (EMOTEBENCHMARK.timer) {
    if (EMOTEBENCHMARK.timer.isRunning()) {
      EMOTEBENCHMARK.timer.reset();
      EMOTEBENCHMARK.timer.stop();
    }
  }
  elements.timer.style.display = "none";
} //stopTimer

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
  settingsOffcanvas = new bootstrap.Offcanvas(elements.settingsOffcanvas);

  enableTooltips();
  enablePopovers();

  elements.channelName.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      connect();
    }
  });

  elements.darkTheme.onchange = function () {
    switchTheme(this.checked);
    saveSettings();
  };

  elements.twitchGlobal.onchange = function () {
    EMOTEBENCHMARK.twitchGlobal = this.checked;
  };
  elements.bttvGlobal.onchange = function () {
    EMOTEBENCHMARK.bttvGlobal = this.checked;
  };
  elements.ffzGlobal.onchange = function () {
    EMOTEBENCHMARK.ffzGlobal = this.checked;
  };
  elements.seventvGlobal.onchange = function () {
    EMOTEBENCHMARK.seventvGlobal = this.checked;
  };
  elements.twitchChannel.onchange = function () {
    EMOTEBENCHMARK.twitchChannel = this.checked;
  };
  elements.bttvChannel.onchange = function () {
    EMOTEBENCHMARK.bttvChannel = this.checked;
  };
  elements.ffzChannel.onchange = function () {
    EMOTEBENCHMARK.ffzChannel = this.checked;
  };
  elements.seventvChannel.onchange = function () {
    EMOTEBENCHMARK.seventvChannel = this.checked;
  };

  elements.emotesPerRound.oninput = function () {
    elements.emotesPerRoundLabel.innerHTML = this.value;
  };
  elements.turnLength.oninput = function () {
    elements.turnLengthLabel.innerHTML = this.value;
  };
  elements.emoteTimer.oninput = function () {
    elements.emoteTimerLabel.innerHTML = this.value;
  };
  elements.timerDecay.oninput = function () {
    elements.timerDecayLabel.innerHTML = this.value;
  };
  allEmotes.twitchGlobal = await getGlobalTwitchEmotes(true);
  allEmotes.bttvGlobal = await getGlobalBTTVEmotes(true);
  allEmotes.ffzGlobal = await getGlobalFFZEmotes(true);
  allEmotes.seventvGlobal = await getGlobal7TVEmotes(true);

  elements.twitchGlobalCount.innerHTML = `<br>${allEmotes.twitchGlobal.length} emotes`;
  elements.bttvGlobalCount.innerHTML = `<br>${allEmotes.bttvGlobal.length} emotes`;
  elements.ffzGlobalCount.innerHTML = `<br>${allEmotes.ffzGlobal.length} emotes`;
  elements.seventvGlobalCount.innerHTML = `<br>${allEmotes.seventvGlobal.length} emotes`;

  if (USER.channel) {
    allEmotes.twitchChannel = await getChannelTwitchEmotes(USER.channel, true);
    allEmotes.bttvChannel = await getChannelBTTVEmotes(USER.userID, true);
    allEmotes.ffzChannel = await getChannelFFZEmotes(USER.userID, true);
    allEmotes.seventvChannel = await getChannel7TVEmotes(USER.userID, true);

    elements.twitchChannelCount.innerHTML = `<br>${allEmotes.twitchChannel.length} emotes`;
    elements.bttvChannelCount.innerHTML = `<br>${allEmotes.bttvChannel.length} emotes`;
    elements.ffzChannelCount.innerHTML = `<br>${allEmotes.ffzChannel.length} emotes`;
    elements.seventvChannelCount.innerHTML = `<br>${allEmotes.seventvChannel.length} emotes`;
  }
}; //onload
