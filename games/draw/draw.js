let allEmotes = {
  twitchGlobal: [],
  bttvGlobal: [],
  ffzGlobal: [],
  seventvGlobal: [],
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
  drawemotecardbody: document.getElementById("drawemotecardbody"),
  drawoutput: document.getElementById("drawoutput"),
  drawlblist: document.getElementById("drawlblist"),
  twitchGlobal: document.getElementById("twitchGlobal"),
  bttvGlobal: document.getElementById("bttvGlobal"),
  ffzGlobal: document.getElementById("ffzGlobal"),
  seventvGlobal: document.getElementById("seventvGlobal"),
  twitch: document.getElementById("twitch"),
  bttv: document.getElementById("bttv"),
  ffz: document.getElementById("ffz"),
  seventv: document.getElementById("seventv"),
  emoji: document.getElementById("emoji"),
  drawscoring1: document.getElementById("drawscoring1"),
  drawscoring2: document.getElementById("drawscoring2"),
  turnLength: document.getElementById("turnLength"),
  timerReveal: document.getElementById("timerReveal"),
  points: document.getElementById("points"),
  pointsTarget: document.getElementById("pointsTarget"),
  twitchGlobalCount: document.getElementById("twitchGlobalCount"),
  bttvGlobalCount: document.getElementById("bttvGlobalCount"),
  ffzGlobalCount: document.getElementById("ffzGlobalCount"),
  seventvGlobalCount: document.getElementById("seventvGlobalCount"),
  emojiCount: document.getElementById("emojiCount"),
  twitchCount: document.getElementById("twitchCount"),
  bttvCount: document.getElementById("bttvCount"),
  ffzCount: document.getElementById("ffzCount"),
  seventvCount: document.getElementById("seventvCount"),
  color: document.getElementById("color"),
  LineWidth: document.getElementById("LineWidth"),
  LineWidthLabel: document.getElementById("LineWidthLabel"),
  clearCanvas: document.getElementById("clearCanvas"),
  redo: document.getElementById("redo"),
  undo: document.getElementById("undo"),
  settingsOffcanvas: document.getElementById("settingsOffcanvas"),
  countdown: document.getElementById("countdown"),
  countdownValue: document.getElementById("countdownValue"),
};

let loginButton;
let darkTheme = true;
let loginExpiredModal, aboutModal;
let settingsOffcanvas;
let timer;

let USER = {
  channel: "",
  twitchLogin: false,
  access_token: "",
  userID: "",
  platform: "",
};

let DRAW = {
  gameActive: false,
  answer: "",
  answerURL: "",
  answerDesc: "",
  turn: 0,
  winner: null,
  canvas: null,
  redo_list: [],
  undo_list: [],
  state: null,
  twitchGlobal: false,
  bttvGlobal: false,
  ffzGlobal: false,
  seventvGlobal: false,
  twitch: false,
  bttv: false,
  ffz: false,
  seventv: false,
  emoji: false,
  firstOnly: false,
  turnLength: 0,
  timerReveal: false,
  points: 10,
  pointsTarget: 100,
  correctUsers: 0,
  users: {},
  usedEmotes: [],
}; //DRAW

async function start() {
  let selectedemotes = [];
  if (DRAW.twitchGlobal) {
    allEmotes.twitchGlobal.forEach((element) => {
      selectedemotes.push(element);
    });
  }
  if (DRAW.bttvGlobal) {
    allEmotes.bttvGlobal.forEach((element) => {
      selectedemotes.push(element);
    });
  }
  if (DRAW.ffzGlobal) {
    allEmotes.ffzGlobal.forEach((element) => {
      selectedemotes.push(element);
    });
  }
  if (DRAW.seventvGlobal) {
    allEmotes.seventvGlobal.forEach((element) => {
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

  //remove used emotes
  DRAW.usedEmotes.forEach((element) => {
    selectedemotes = selectedemotes.filter((list) => list.name !== element);
  });
  if (selectedemotes.length < 2) {
    showToast(`Not enough emotes selected`, "warning", 3000);
    settingsOffcanvas.show();
    return;
  }

  //pick a random emote
  let randomEmote = selectedemotes[Math.floor(Math.random() * selectedemotes.length)];
  elements.drawemotecardbody.innerHTML = `
  ${randomEmote.url == "emoji" ? randomEmote.name : `<img src="${randomEmote.url}" alt="${randomEmote.name}" title="${randomEmote.name}" class="draw-emote">`}<br>
  ${randomEmote.url == "emoji" ? randomEmote.desc : randomEmote.name}`;
  if (randomEmote.url == "emoji") {
    twemoji.parse(elements.drawemotecardbody);
  }

  DRAW.answer = randomEmote.name;
  DRAW.answerURL = randomEmote.url;
  DRAW.answerDesc = randomEmote.desc;
  DRAW.usedEmotes.push(randomEmote.name);
  DRAW.canvas.clear();
  elements.drawoutput.innerHTML = "";
  DRAW.winner = null;
  DRAW.correctUsers = 0;
  startTimer();

  DRAW.turn++;
  DRAW.gameActive = true;
} //start

function correct(user) {
  if (DRAW.correctUsers >= DRAW.points) {
    showToast(`No more points left; starting new round`, "warning", 3000);
    start();
    return;
  }

  if (!DRAW.users[user.username]) {
    let name = user.username == user.displayname.toLowerCase() ? `${user.displayname}` : `${user.displayname} (${user.username})`;
    let color = !user.color ? "#FFFFFF" : user.color;
    let badges = addBadges(user.badges, user.id, user.firstmsg);

    if (DRAW.firstOnly && !DRAW.winner) {
      user.score = DRAW.points;
      user.lastTurn = DRAW.turn;
      user.badges = badges;
      user.name = name;
      user.color = color;
      DRAW.users[user.username] = user;
      DRAW.correctUsers++;
    } else if (!DRAW.firstOnly) {
      user.score = DRAW.points - DRAW.correctUsers;
      user.lastTurn = DRAW.turn;
      user.badges = badges;
      user.name = name;
      user.color = color;
      DRAW.users[user.username] = user;
      DRAW.correctUsers++;
    } else {
      return;
    }
  } else {
    if (DRAW.users[user.username].lastTurn == DRAW.turn) {
      return;
    } else {
      if (DRAW.firstOnly && !DRAW.winner) {
        DRAW.users[user.username].score += DRAW.points;
        DRAW.users[user.username].lastTurn = DRAW.turn;
        DRAW.correctUsers++;
      } else if (!DRAW.firstOnly) {
        DRAW.users[user.username].score += DRAW.points - DRAW.correctUsers;
        DRAW.users[user.username].lastTurn = DRAW.turn;
        DRAW.correctUsers++;
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
  elements.drawlblist.innerHTML = lb;

  if (!DRAW.winner) {
    DRAW.winner = user.username;

    if (!DRAW.timerReveal || DRAW.firstOnly) {
      elements.drawoutput.innerHTML = `
      <div class="card border-success">
      <div class="card-body">
      <h4>${user.username} was the first to get it right</h4><br>
      ${DRAW.answerURL == "emoji" ? DRAW.answer : `<img src="${DRAW.answerURL}" alt="${DRAW.answer}" title="${DRAW.answer}" class="draw-emote">`}<br>
      ${DRAW.answerURL == "emoji" ? DRAW.answerDesc : DRAW.answer}<br>
      <button type="button" onclick="start()" class="btn btn-success"><i class="material-icons notranslate">navigate_next</i>Next round</button>
      </div>
      </div>`;
      if (DRAW.answerURL == "emoji") {
        twemoji.parse(elements.drawoutput);
      }
      stopTimer();
    }
  }

  if (DRAW.users[user.username].score >= DRAW.pointsTarget) {
    elements.drawoutput.innerHTML = `
  <div class="card border-success">
  <div class="card-body">
  <h4>Game over! ${user.username} Won by reaching the points target (${DRAW.pointsTarget})</h4><br>
  ${DRAW.answerURL == "emoji" ? DRAW.answer : `<img src="${DRAW.answerURL}" alt="${DRAW.answer}" title="${DRAW.answer}" class="draw-emote">`}<br>
  ${DRAW.answerURL == "emoji" ? DRAW.answerDesc : DRAW.answer}<br>
  <button type="button" onclick="reset(true)" class="btn btn-warning"><i class="material-icons notranslate">replay</i>Play again</button>
  </div>
  </div>`;
    if (DRAW.answerURL == "emoji") {
      twemoji.parse(elements.drawoutput);
    }
    stopTimer();
    DRAW.gameActive = false;
  }
} //correct

function reset(newGame = false) {
  DRAW.gameActive = false;
  DRAW.turn = 0;
  DRAW.correctUsers = 0;
  DRAW.answer = "";
  elements.drawemotecardbody.innerHTML = `<span style="font-size: 4vh;">Place your facecam here<br><i class="material-icons notranslate" style="font-size: 6vh;">photo_camera</i></span>`;

  DRAW.canvas.clear();
  DRAW.redo_list = [];
  DRAW.undo_list = [];
  DRAW.users = {};
  DRAW.state = null;
  elements.drawlblist.innerHTML = "";
  elements.drawoutput.innerHTML = "";
  stopTimer();

  if (!newGame) {
    DRAW.firstOnly = false;
    DRAW.turnLength = 0;
    DRAW.timerReveal = false;
    DRAW.points = 10;
    DRAW.pointsTarget = 100;
    elements.drawscoring1.checked = true;
    elements.turnLength.value = 0;
    elements.timerReveal.checked = DRAW.timerReveal;
    elements.points.value = 10;
    elements.pointsTarget.value = 100;
    DRAW.twitchGlobal = false;
    DRAW.bttvGlobal = false;
    DRAW.ffzGlobal = false;
    DRAW.seventvGlobal = false;
    DRAW.twitch = false;
    DRAW.bttv = false;
    DRAW.ffz = false;
    DRAW.seventv = false;
    DRAW.emoji = false;
    elements.twitchGlobal.checked = false;
    elements.bttvGlobal.checked = false;
    elements.ffzGlobal.checked = false;
    elements.seventvGlobal.checked = false;
    elements.twitch.checked = false;
    elements.bttv.checked = false;
    elements.ffz.checked = false;
    elements.seventv.checked = false;
    elements.emoji.checked = false;
    DRAW.usedEmotes = [];
  } else {
    start();
  }
} //reset

function changeColor() {
  DRAW.canvas.freeDrawingBrush.color = this.value;
  elements.color.value = this.value;
  let brushsvg = document.getElementsByClassName("brushsvg");
  Array.from(brushsvg).forEach((element) => {
    element.style.fill = this.value;
  });
} //changeColor

function changeBrush(element) {
  DRAW.canvas.freeDrawingBrush.width = parseInt(element.value, 10) || 1;
  elements.LineWidth.value = parseInt(element.value, 10) || 1;
  elements.LineWidthLabel.innerHTML = parseInt(element.value, 10) || 1;
} //changeBrush

function replay(playStack, saveStack, buttonsOn, buttonsOff) {
  saveStack.push(DRAW.state);
  DRAW.state = playStack.pop();
  let on = elements[buttonsOn];
  let off = elements[buttonsOff.id];
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
} //replay

function save() {
  DRAW.redo_list = [];
  elements.redo.disabled = true;
  // initial call won"t have a state
  if (DRAW.state) {
    DRAW.undo_list.push(DRAW.state);
    elements.undo.disabled = false;
  }
  DRAW.state = JSON.stringify(DRAW.canvas);
} //save

function handleMessage(target, context, msg, self) {
  if (msg.trim() === DRAW.answer && DRAW.gameActive) {
    correct({
      id: context["user-id"],
      username: context.username,
      displayname: context["display-name"],
      color: context.color,
      badges: context.badges,
      firstmsg: context["first-msg"],
    });
  }
} //handleMessage

function startTimer() {
  if (isNaN(DRAW.turnLength) || DRAW.turnLength == 0) {
    return;
  }
  if (timer && timer.isRunning()) {
    timer.reset();
    timer.stop();
  }
  timer = new easytimer.Timer();
  timer.addEventListener("secondTenthsUpdated", function (e) {
    elements.countdownValue.innerHTML = timer.getTimeValues().toString(["minutes", "seconds", "secondTenths"]);
  });
  timer.addEventListener("targetAchieved", function (e) {
    elements.countdown.style.display = "none";
    timer.reset();
    timer.stop();

    //show winner if using show answer after timer runs out only setting
    if ((DRAW.timerReveal && DRAW.winner) || !elements.drawoutput.innerHTML) {
      elements.drawoutput.innerHTML = `
      <div class="card border-success">
      <div class="card-body">
      <h4>${DRAW.winner} was the first to get it right</h4><br>
      ${DRAW.answerURL == "emoji" ? DRAW.answer : `<img src="${DRAW.answerURL}" alt="${DRAW.answer}" title="${DRAW.answer}" class="draw-emote">`}<br>
      ${DRAW.answerURL == "emoji" ? DRAW.answerDesc : DRAW.answer}<br>
      <button type="button" onclick="start()" class="btn btn-success"><i class="material-icons notranslate">navigate_next</i>Next round</button>
      </div>
      </div>`;
      if (DRAW.answerURL == "emoji") {
        twemoji.parse(elements.drawoutput);
      }
    }

    //show the answer if no one got it
    if (!DRAW.winner) {
      elements.drawoutput.innerHTML = `
      <div class="card border-danger">
      <div class="card-body">
      <h4>No one got the emote</h4><br>
      ${DRAW.answerURL == "emoji" ? DRAW.answer : `<img src="${DRAW.answerURL}" alt="${DRAW.answer}" title="${DRAW.answer}" class="draw-emote">`}<br>
      ${DRAW.answerURL == "emoji" ? DRAW.answerDesc : DRAW.answer}<br>
      <button type="button" onclick="start()" class="btn btn-success"><i class="material-icons notranslate">navigate_next</i>Next round</button>
      </div>
      </div>`;
      if (DRAW.answerURL == "emoji") {
        twemoji.parse(elements.drawoutput);
      }
    }
  });

  elements.countdownValue.innerHTML = timer.getTimeValues().toString(["minutes", "seconds", "secondTenths"]);
  elements.countdown.style.display = "";

  timer.start({
    countdown: true,
    precision: "secondTenths",
    startValues: {
      seconds: DRAW.turnLength,
    },
  });
} //startTimer

function stopTimer() {
  if (timer && timer.isRunning()) {
    timer.reset();
    timer.stop();
  }
  elements.countdown.style.display = "none";
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

  DRAW.canvas = new fabric.Canvas("canvas", {
    isDrawingMode: true,
  });
  DRAW.canvas.on("mouse:up", function () {
    save();
  });

  elements.undo.addEventListener("click", function () {
    replay(DRAW.undo_list, DRAW.redo_list, "redo", this);
  });

  elements.redo.addEventListener("click", function () {
    replay(DRAW.redo_list, DRAW.undo_list, "undo", this);
  });

  fabric.Object.prototype.transparentCorners = false;

  elements.clearCanvas.onclick = function () {
    DRAW.canvas.clear();
  };

  elements.color.oninput = function () {
    let brush = DRAW.canvas.freeDrawingBrush;
    brush.color = this.value;
    brush.width = parseInt(elements.LineWidth.value, 10) || 1;
    let brushsvg = document.getElementsByClassName("brushsvg");
    Array.from(brushsvg).forEach((element) => {
      element.style.fill = parseInt(this.value, 10);
    });
  };
  elements.LineWidth.oninput = function () {
    elements.LineWidthLabel.innerHTML = this.value;
    DRAW.canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
    this.previousSibling.innerHTML = parseInt(this.value, 10);
  };

  if (DRAW.canvas.freeDrawingBrush) {
    DRAW.canvas.freeDrawingBrush.color = elements.color.value;
    DRAW.canvas.freeDrawingBrush.width = parseInt(elements.LineWidth.value, 10) || 1;
  }

  let colorbtns = document.getElementsByClassName("colorpreset");
  Array.from(colorbtns).forEach(function (element) {
    element.addEventListener("click", changeColor);
  });
  elements.twitchGlobal.onchange = function () {
    DRAW.twitchGlobal = this.checked;
  };
  elements.bttvGlobal.onchange = function () {
    DRAW.bttvGlobal = this.checked;
  };
  elements.ffzGlobal.onchange = function () {
    DRAW.ffzGlobal = this.checked;
  };
  elements.seventvGlobal.onchange = function () {
    DRAW.seventvGlobal = this.checked;
  };
  elements.twitch.onchange = function () {
    DRAW.twitch = this.checked;
  };
  elements.bttv.onchange = function () {
    DRAW.bttv = this.checked;
  };
  elements.ffz.onchange = function () {
    DRAW.ffz = this.checked;
  };
  elements.seventv.onchange = function () {
    DRAW.seventv = this.checked;
  };
  elements.emoji.onchange = function () {
    DRAW.emoji = this.checked;
  };

  elements.turnLength.onchange = function () {
    DRAW.turnLength = parseInt(this.value, 10);
  };
  elements.timerReveal.onchange = function () {
    DRAW.timerReveal = this.checked;
  };

  elements.drawscoring1.onchange = function () {
    DRAW.firstOnly = !this.checked;
  };
  elements.drawscoring2.onchange = function () {
    DRAW.firstOnly = this.checked;
  };
  elements.points.onchange = function () {
    DRAW.points = parseInt(this.value, 10);
  };
  elements.pointsTarget.onchange = function () {
    DRAW.pointsTarget = parseInt(this.value, 10);
  };

  allEmotes.twitchGlobal = await getGlobalTwitchEmotes(true);
  allEmotes.bttvGlobal = await getGlobalBTTVEmotes(true);
  allEmotes.ffzGlobal = await getGlobalFFZEmotes(true);
  allEmotes.seventvGlobal = await getGlobal7TVEmotes(true);
  allEmotes.emoji = await getEmoji();
  elements.twitchGlobalCount.innerHTML = `<br>${allEmotes.twitchGlobal.length} emotes`;
  elements.bttvGlobalCount.innerHTML = `<br>${allEmotes.bttvGlobal.length} emotes`;
  elements.ffzGlobalCount.innerHTML = `<br>${allEmotes.ffzGlobal.length} emotes`;
  elements.seventvGlobalCount.innerHTML = `<br>${allEmotes.seventvGlobal.length} emotes`;
  elements.emojiCount.innerHTML = `<br>${allEmotes.emoji.length} emoji`;

  if (USER.channel) {
    allEmotes.twitch = await getChannelTwitchEmotes(USER.channel, true);
    allEmotes.bttv = await getChannelBTTVEmotes(USER.userID, true);
    allEmotes.ffz = await getChannelFFZEmotes(USER.userID, true);
    allEmotes.seventv = await getChannel7TVEmotes(USER.userID, true);

    elements.twitchCount.innerHTML = `<br>${allEmotes.twitch.length} emotes`;
    elements.bttvCount.innerHTML = `<br>${allEmotes.bttv.length} emotes`;
    elements.ffzCount.innerHTML = `<br>${allEmotes.ffz.length} emotes`;
    elements.seventvCount.innerHTML = `<br>${allEmotes.seventv.length} emotes`;
  }
}; //onload
