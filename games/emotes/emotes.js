const placeholder = `<div class="card placeholder-emote">
<div class="card-body">
<img src="/pics/donk.png" alt="placeholder donk" title="placeholder donk" />
</div>
</div>`;

let elements = {
  //modals
  grid: document.getElementById("grid"),
  gameDiv: document.getElementById("gameDiv"),
  loginExpiredModal: document.getElementById("loginExpiredModal"),
  aboutModal: document.getElementById("aboutModal"),

  //navbar
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
  hideName: document.getElementById("hideName"),
  blurEmote: document.getElementById("blurEmote"),
  emotesPerRound: document.getElementById("emotesPerRound"),
  emotesPerRoundLabel: document.getElementById("emotesPerRoundLabel"),
  turnLength: document.getElementById("turnLength"),
  turnLengthLabel: document.getElementById("turnLengthLabel"),
  emoteTimer: document.getElementById("emoteTimer"),
  emoteTimerLabel: document.getElementById("emoteTimerLabel"),
  twitchGlobalCount: document.getElementById("twitchGlobalCount"),
  bttvGlobalCount: document.getElementById("bttvGlobalCount"),
  ffzGlobalCount: document.getElementById("ffzGlobalCount"),
  seventvGlobalCount: document.getElementById("seventvGlobalCount"),
  twitchChannelCount: document.getElementById("twitchChannelCount"),
  bttvChannelCount: document.getElementById("bttvChannelCount"),
  ffzChannelCount: document.getElementById("ffzChannelCount"),
  seventvChannelCount: document.getElementById("seventvChannelCount"),
  qualified: document.getElementById("qualified"),
  output: document.getElementById("output"),
  emoteTimeBarDiv: document.getElementById("emoteTimeBarDiv"),
  emoteTimeBar: document.getElementById("emoteTimeBar"),
  emotes: document.getElementById("emotes"),
  timer: document.getElementById("timer"),
  timerValue: document.getElementById("timerValue"),
  start: document.getElementById("start"),
};

const { animate } = anime;

let USER = {
  channel: "",
  twitchLogin: false,
  access_token: "",
  userID: "",
  platform: "",
};

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

let loginButton;
let darkTheme = true;
let settingsOffcanvas;
let loginExpiredModal, aboutModal;

let EMOTEBENCHMARK = {
  interval: null,
  turn: 0,
  turnLength: 15000,
  emotesPerRound: 1,
  emoteTimer: 2000,
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

function handleMessage(target, context, msg, self) {
  if (msg.trim() == EMOTEBENCHMARK.answer.trim()) {
    if (EMOTEBENCHMARK.qualified.includes(context.username) || EMOTEBENCHMARK.turn == 1) {
      if (!EMOTEBENCHMARK.qualifiedCurrentRound.includes(context.username)) {
        EMOTEBENCHMARK.qualifiedCurrentRound.push(context.username);
      }
    }

    elements.qualified.insertAdjacentHTML(
      "afterbegin",
      `<span class="badge qualified rounded-pill me-1" style="background-color: ${context.color}">
      ${addBadges(context.badges, context["user-id"], context["first-msg"])} ${context.username}
      </span>`
    );
  }
} //handleMessage

function start() {
  let selectedemotes = [];
  let randomemotes = [];
  EMOTEBENCHMARK.answer = "";
  elements.emotes.innerHTML = placeholder.repeat(EMOTEBENCHMARK.emotesPerRound);

  EMOTEBENCHMARK.qualified = EMOTEBENCHMARK.qualifiedCurrentRound;
  EMOTEBENCHMARK.qualifiedCurrentRound = [];
  if (EMOTEBENCHMARK.qualified.length == 1) {
    elements.output.innerHTML = `Game over. WINNER: ${EMOTEBENCHMARK.qualified[0]}`;
    elements.qualified.innerHTML = "";
    stopTimer();
    clearInterval(EMOTEBENCHMARK.interval);
    EMOTEBENCHMARK.interval = null;
    EMOTEBENCHMARK.turn = 0;
    elements.start.disabled = false;
    return;
  }
  if (EMOTEBENCHMARK.qualified.length == 0 && EMOTEBENCHMARK.turn > 0) {
    elements.output.innerHTML = `Game over. No one won`;
    elements.qualified.innerHTML = "";
    stopTimer();
    clearInterval(EMOTEBENCHMARK.interval);
    EMOTEBENCHMARK.interval = null;
    EMOTEBENCHMARK.turn = 0;
    elements.start.disabled = false;
    return;
  }

  //get settings
  EMOTEBENCHMARK.hideName = elements.hideName.checked;
  EMOTEBENCHMARK.blurEmote = elements.blurEmote.checked;

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

  //remove already seen emotes
  EMOTEBENCHMARK.usedEmotes.forEach((element) => {
    selectedemotes = selectedemotes.filter((list) => list.name != element);
  });

  if (selectedemotes.length < EMOTEBENCHMARK.emotesPerRound) {
    stopTimer();
    elements.emoteTimeBarDiv.style.visibility = "hidden";
    clearInterval(EMOTEBENCHMARK.interval);
    EMOTEBENCHMARK.interval = null;
    EMOTEBENCHMARK.turn = 0;
    showToast("Not enough emotes remaining.", "warning", 5000);
    settingsOffcanvas.show();
    elements.start.disabled = false;
    return;
  }

  elements.start.disabled = true;
  EMOTEBENCHMARK.turn++;
  startTimer();

  for (let i = 0; i < EMOTEBENCHMARK.emotesPerRound; i++) {
    let randomEmote = selectedemotes[Math.floor(Math.random() * selectedemotes.length)];
    EMOTEBENCHMARK.usedEmotes.push(randomEmote.name);
    randomemotes.push(randomEmote);
  }

  elements.emoteTimeBarDiv.style.visibility = "visible";
  setTimeout(() => {
    elements.emotes.innerHTML = "";

    for (let i = 0; i < randomemotes.length; i++) {
      let name = `<div class="text-body-secondary text-center">${!EMOTEBENCHMARK.hideName ? randomemotes[i].name : "🤔"}</div>`;
      elements.emotes.innerHTML += `
      <div class="border border-secondary rounded bg-body-tertiary emotes-emote">
      <img src="${randomemotes[i].url}" alt="${randomemotes[i].name}" ${EMOTEBENCHMARK.blurEmote ? `class="blur"` : ""} title="${randomemotes[i].name}">
      ${name}
      </div>`;
      EMOTEBENCHMARK.answer += `${randomemotes[i].name} `;
    }
    animateTimer(Math.max(EMOTEBENCHMARK.emoteTimer - (EMOTEBENCHMARK.turn - 1) * 100, 1000));
    elements.output.innerHTML = ``;
    elements.qualified.innerHTML = ``;
  }, 2000);

  if (!EMOTEBENCHMARK.interval) {
    EMOTEBENCHMARK.interval = setInterval(start, EMOTEBENCHMARK.turnLength);
  } else {
    console.log("interval already running");
  }
} //start

function reset() {
  clearInterval(EMOTEBENCHMARK.interval);
  stopTimer();
  elements.start.disabled = false;
  EMOTEBENCHMARK.interval = null;
  EMOTEBENCHMARK.turn = 0;
  EMOTEBENCHMARK.answer = "";
  elements.emotes.innerHTML = placeholder;
  elements.qualified.innerHTML = "";
  elements.output.innerHTML = "";
  elements.emoteTimeBarDiv.style.visibility = "hidden";
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
  elements.hideName.checked = false;
  elements.blurEmote.checked = false;
  elements.emotesPerRound.value = 1;
  elements.emotesPerRoundLabel.innerHTML = "1";
  elements.turnLength.value = 15;
  elements.turnLengthLabel.innerHTML = "15";
  elements.emoteTimer.value = 2;
  elements.emoteTimerLabel.innerHTML = "2";
  EMOTEBENCHMARK.usedEmotes = [];
} //reset

function animateTimer(time) {
  elements.emoteTimeBar.style.width = "100%";
  animate("#emoteTimeBar", {
    width: "0%",
    duration: time,
    ease: "linear",
    onComplete: function () {
      elements.emotes.innerHTML = placeholder.repeat(EMOTEBENCHMARK.emotesPerRound);
      elements.emoteTimeBarDiv.style.visibility = "hidden";
    },
  });
} //animateTimer

function startTimer() {
  elements.timer.style.visibility = "visible";

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
  elements.timer.style.visibility = "hidden";
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
    EMOTEBENCHMARK.emotesPerRound = parseInt(this.value, 10) || 1;
    elements.emotesPerRoundLabel.innerHTML = this.value;
    elements.emotes.innerHTML = placeholder.repeat(this.value);
  };
  elements.turnLength.oninput = function () {
    EMOTEBENCHMARK.turnLength = (parseInt(this.value, 10) || 15) * 1000;
    elements.turnLengthLabel.innerHTML = this.value;
  };
  elements.emoteTimer.oninput = function () {
    EMOTEBENCHMARK.emoteTimer = (parseInt(this.value, 10) || 2) * 1000;
    elements.emoteTimerLabel.innerHTML = this.value;
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
