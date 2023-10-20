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
};

let loginButton;
let darkTheme = true;
let channelBadges = { subscriber: [], bits: [] };
let globalBadges = {};
let customBadges = [];
let loginExpiredModal, aboutModal;

let USER = {
  channel: "",
  twitchLogin: false,
  access_token: "",
  userID: "",
  platform: "",
};

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
  firstonly: false,
  drawturnlength: 60,
  drawpoints: 10,
  drawpointswin: 100,
  correctusers: 0,
  users: {},
  usedEmotes: [],
}; //DRAW

async function start() {
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
  if (Object.keys(globalBadges).length == 0) {
    globalBadges = await getGlobalBadges();
  }
  if (channelBadges.subscriber.length == 0) {
    channelBadges = await getChannelBadges(USER.channel);
  }
  if (customBadges.length == 0) {
    customBadges = await getCustomBadges();
  }
} //start

function reroll() {
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
} //reroll

function correct(user) {
  if (DRAW.correctusers >= DRAW.drawpoints) {
    showToast(`No more points left; starting new round`, "warning", 3000);
    start();
    return;
  }
  if (!DRAW.users[user.username]) {
    let name = user.username == user.displayname.toLowerCase() ? `${user.displayname}` : `${user.displayname} (${user.username})`;
    let color = !user.color ? "#FFFFFF" : user.color;
    let badges = addBadges(user.badges, user.id, user.firstmsg);

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
      <button type="button" onclick="start()" class="btn btn-success"><i class="material-icons notranslate">navigate_next</i>Next round</button>
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
      <button type="button" onclick="start()" class="btn btn-success"><i class="material-icons notranslate">navigate_next</i>Next round</button>
      </div>
      </div>`;
    }
    DRAW.winner = true;
  }
} //correct

function reset() {
  DRAW.drawturn = 0;
  DRAW.correctusers = 0;
  DRAW.drawanswer = "";
  document.getElementById(
    "drawemotecardbody"
  ).innerHTML = `<span style="font-size: 4vh;">Place your facecam here<br><i class="material-icons notranslate" style="font-size: 6vh;">photo_camera</i></span>`;
  DRAW.firstonly = false;
  DRAW.drawturnlength = 60;
  DRAW.drawpoints = 10;
  DRAW.drawpointswin = 100;
  document.getElementById("drawscoring1").checked = true;
  document.getElementById("drawturnlength").value = 60;
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
} //reset

function changeColor() {
  DRAW.canvas.freeDrawingBrush.color = this.value;
  document.getElementById("drawing-color").value = this.value;
  let brushsvg = document.getElementsByClassName("brushsvg");
  Array.from(brushsvg).forEach((element) => {
    element.style.fill = this.value;
  });
} //changeColor

function changeBrush(element) {
  DRAW.canvas.freeDrawingBrush.width = parseInt(element.value, 10) || 1;
  document.getElementById("drawing-line-width").value = parseInt(element.value, 10) || 1;
  document.getElementById("drawing-line-widthlabel").innerHTML = parseInt(element.value, 10) || 1;
} //changeBrush

function replay(playStack, saveStack, buttonsOn, buttonsOff) {
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
} //replay

function save() {
  DRAW.redo_list = [];
  document.getElementById("redo").disabled = true;
  // initial call won"t have a state
  if (DRAW.state) {
    DRAW.undo_list.push(DRAW.state);
    document.getElementById("undo").disabled = false;
  }
  DRAW.state = JSON.stringify(DRAW.canvas);
} //save

function listeners() {
  DRAW.canvas = new fabric.Canvas("drawcanvas", {
    isDrawingMode: true,
  });
  DRAW.canvas.on("mouse:up", function () {
    save();
  });

  document.getElementById("undo").addEventListener("click", function () {
    replay(DRAW.undo_list, DRAW.redo_list, "redo", this);
  });

  document.getElementById("redo").addEventListener("click", function () {
    replay(DRAW.redo_list, DRAW.undo_list, "undo", this);
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
} //listeners

function handleMessage(target, context, msg, self) {
  if (msg === DRAW.drawanswer) {
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

  elements.darkTheme.onchange = function () {
    switchTheme(this.checked);
    saveSettings();
  };

  listeners();
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

  if (USER.channel) {
    allEmotes.twitch = await getChannelTwitchEmotes(USER.channel, true);
    allEmotes.bttv = await getChannelBTTVEmotes(USER.userID, true);
    allEmotes.ffz = await getChannelFFZEmotes(USER.userID, true);
    allEmotes.seventv = await getChannel7TVEmotes(USER.userID, true);

    document.getElementById("twitchdesc").innerHTML = `<br>${allEmotes.twitch.length} emotes`;
    document.getElementById("bttvdesc").innerHTML = `<br>${allEmotes.bttv.length} emotes`;
    document.getElementById("ffzdesc").innerHTML = `<br>${allEmotes.ffz.length} emotes`;
    document.getElementById("7tvdesc").innerHTML = `<br>${allEmotes.seventv.length} emotes`;
  }
}; //onload

function addBadges(badges, userid, firstmsg) {
  try {
    let badgesHTML = "";
    if (firstmsg) {
      badgesHTML += `<i class="material-icons notranslate" style="color:#f18805;" title="First-time chatter">warning_amber</i>`;
    }
    for (let index = 0; index < customBadges.length; index++) {
      if (customBadges[index].users.includes(userid) && customBadges[index].sites.includes("chat.vote")) {
        badgesHTML += `<img src="${customBadges[index].url}" class="chat-badge" title="${customBadges[index].name}"/>`;
      }
    }
    for (const badge in badges) {
      if (badge == "subscriber" && badges.subscriber && channelBadges.subscriber.length > 0) {
        let badge = channelBadges.subscriber.find((obj) => obj.id === badges.subscriber);
        badgesHTML += `<img src="${badge.url}" class="chat-badge" title="Subscriber"/>`;
      } else if (badge == "bits" && channelBadges.bits.length > 0) {
        let badge = channelBadges.bits.find((obj) => obj.id === badges.bits);
        badgesHTML += `<img src="${badge.url}" class="chat-badge" title="Bits"/>`;
      } else if (Object.keys(globalBadges).length > 0) {
        let version = globalBadges[badge].find((obj) => obj.id === badges[badge]);
        badgesHTML += `<img src="${version.image_url_4x}" class="chat-badge" title="${badge}"/>`;
      }
    }
    return badgesHTML;
  } catch (error) {
    console.log(error);
    return "";
  }
} //addBadges
