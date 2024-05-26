const USERNAME = "forsen";
const pfp = "https://static-cdn.jtvnw.net/jtv_user_pictures/forsen-profile_image-48b43e1e4f54b5c8-600x600.png";
const userid = 22484632;
const raffle_command1 = "!join";
const raffle_command2 = "!ticket";

let elements = {
  //modals
  restartRaffleModal: document.getElementById("restartRaffleModal"),
  restartTier3RaffleModal: document.getElementById("restartTier3RaffleModal"),
  fancyRaffleModal: document.getElementById("fancyRaffleModal"),
  slot: document.getElementById("slot"),
  claw: document.getElementById("claw"),
  gameWinner: document.getElementById("gameWinner"),
  //navbar
  status: document.getElementById("status"),
  topRight: document.getElementById("topRight"),
  //raffle
  raffleUsers: document.getElementById("raffleUsers"),
  raffleUsersTier3: document.getElementById("raffleUsersTier3"),
  entrants: document.getElementById("entrants"),
  entrantsTier3: document.getElementById("entrantsTier3"),
  raffleOutput: document.getElementById("raffleOutput"),
  raffleOutputTier3: document.getElementById("raffleOutputTier3"),
  emotes: document.getElementById("emotes"),
  animationSelect: document.getElementById("animationSelect"),
};

let client;
let raffle_users = [];
let raffle_users_tier3 = [];
let tier3Emotes = [];

let n = 0;
let n2 = 0;
let n3 = 0;
let raffle_open;
let color = "";
let currentTime = 0;
let restartRaffleModal, restartTier3RaffleModal, fancyRaffleModal;
let winner = "";
let raffleWinners = [];
let winnerTier3 = "";
let raffleWinnersTier3 = [];
let tickSound, revealSound;
let thirdPartyEmotes = [];

let paused = false;

function restartRaffle() {
  raffle_users = [];
  winner = "";
  raffleWinners = [];
  elements.raffleUsers.innerHTML = "";
  elements.raffleOutput.innerHTML = "";
  elements.entrants.innerHTML = "Entrants: 0";
} //restartRaffle

function restartTier3Raffle() {
  raffle_users_tier3 = [];
  winnerTier3 = "";
  raffleWinnersTier3 = [];
  elements.raffleUsersTier3.innerHTML = "";
  elements.raffleOutputTier3.innerHTML = "";
  elements.entrantsTier3.innerHTML = "Entrants: 0";
} //restartTier3Raffle

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
  <ul class="dropdown-menu dropdown-menu-lg-end" aria-labelledby="btnGroupDropLogin">
  <li><a class="dropdown-item" onclick="logout()" href="#"><i class="material-icons notranslate">logout</i>Log out</a></li>
  </ul>
  </div>
  </div>`;
  getEmotes();
  loadBadges(USERNAME);

  let options = {
    options: {
      clientId: CLIENT_ID,
      debug: false,
    },
    connection: {
      secure: true,
      reconnect: true,
    },
    channels: [USERNAME],
  };
  client = new tmi.client(options);

  client.on("message", async (target, context, msg, self) => {
    if (!context.subscriber || paused) {
      return;
    }

    let input = msg.split(" ").filter(Boolean);
    let command = input[0].toLowerCase();

    if (command == raffle_command1 || command == raffle_command2) {
      if (!raffle_users.some((e) => e.username === context.username) && !raffleWinners.includes(context.username)) {
        let user = {
          id: context["user-id"],
          username: context.username,
          displayname: context["display-name"],
          tickets: 1,
          color: context.color,
          firstmsg: context["first-msg"],
          badges: context.badges,
          msg: msg,
        };
        addUserToRaffle(user);
      }
      return;
    } //raffle

    if (context.username == winner) {
      raffleWinnerChat(context, msg, false);
    } //raffle winner chat

    if (context.username == winnerTier3) {
      raffleWinnerChat(context, msg, true);
    } //raffle winner chat tier 3

    if (context?.emotes) {
      for (let index = 0; index < tier3Emotes.length; index++) {
        if (Object.hasOwn(context.emotes, tier3Emotes[index])) {
          if (!raffle_users_tier3.some((e) => e.username === context.username) && !raffleWinnersTier3.includes(context.username)) {
            let user = {
              id: context["user-id"],
              username: context.username,
              displayname: context["display-name"],
              tickets: 1,
              color: context.color,
              firstmsg: context["first-msg"],
              badges: context.badges,
              msg: msg,
            };
            addUserToRaffleTier3(user);
          }
          return;
        }
      }
    } //raffle tier 3
  }); //message

  client.on("timeout", (channel, username, reason, duration, userstate) => {
    if (username == winner) {
      let raffleOutput = elements.raffleOutput;
      raffleOutput.lastChild.innerHTML = `<small class="text-body-secondary">Message deleted</small>`;
    }
  }); //timeout

  client.on("connected", (address, port) => {
    console.log(`Connected to ${address}:${port}`);
    elements.status.innerHTML = `<h4><span class="badge bg-success">Connected :)</span></h4>`;
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
  elements.topRight.innerHTML = `
  <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
  <button type="button" class="btn btn-dark"><img src="${pfp}" alt="profile pic" style="height:2em;"></button>
  <div class="btn-group" role="group">
  <button id="btnGroupDrop1" type="button" class="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
  ${USERNAME}
  </button>
  <ul class="dropdown-menu dropdown-menu-lg-end" aria-labelledby="btnGroupDrop1">
  <li><a class="dropdown-item" onclick="logout()" href="#"><i class="material-icons notranslate">logout</i>Log out</a></li>
  </ul>
  </div>
  </div>`;
} //loadPFP

async function addUserToRaffle(user) {
  raffle_users.push(user);
  let name = user.username == user.displayname.toLowerCase() ? `${user.displayname}` : `${user.displayname} (${user.username})`;
  let color = !user.color ? "#FFFFFF" : user.color;
  let badges = addBadges(user.badges, user.id, user.firstmsg);
  elements.raffleUsers.insertAdjacentHTML(
    "afterbegin",
    `<li id="${user.username}_raffle" class="list-group-item">
    ${badges}<span style="color:${color};"> ${name}</span>: 1 ticket
    <i class="material-icons notranslate deletebtn float-end" onclick="removeFromRaffle('${user.username}')">highlight_off</i>
    </li>`
  );
  elements.entrants.innerHTML = `Entrants: ${raffle_users.length}`;
} //addUserToRaffle

async function addUserToRaffleTier3(user) {
  raffle_users_tier3.push(user);
  let name = user.username == user.displayname.toLowerCase() ? `${user.displayname}` : `${user.displayname} (${user.username})`;
  let color = !user.color ? "#FFFFFF" : user.color;
  let badges = addBadges(user.badges, user.id, user.firstmsg);
  elements.raffleUsersTier3.insertAdjacentHTML(
    "afterbegin",
    `<li id="${user.username}_raffle_tier3" class="list-group-item">
    ${badges}<span style="color:${color};"> ${name}</span>: 1 ticket
    <i class="material-icons notranslate deletebtn float-end" onclick="removeFromRaffleTier3('${user.username}')">highlight_off</i>
    </li>`
  );
  elements.entrantsTier3.innerHTML = `Entrants: ${raffle_users_tier3.length}`;
} //addUserToRaffleTier3

async function drawRaffleWinner() {
  if (raffle_users.length < 2) {
    let p = document.createElement("p");
    p.innerHTML = `Less than 2 users in raffle.`;
    elements.raffleOutput.append(p);
    return;
  }

  paused = true;

  if (elements.animationSelect.value == "on" || elements.animationSelect.value == "pfp") {
    drawRaffleWinnerFancy();
  } else {
    let user_tickets = [];
    for (let index = 0, j = raffle_users.length; index < j; index++) {
      for (let i = raffle_users[index].tickets; i > 0; i--) {
        user_tickets.push(raffle_users[index].username);
      }
    }
    winner = user_tickets[Math.floor(Math.random() * user_tickets.length)];
    raffleWinners.push(winner);
    let winnerObject = raffle_users.find((e) => e.username == winner);

    let p = document.createElement("p");
    p.classList.add("h2");
    p.innerHTML = `
    Winner #${raffleWinners.length}: 
    <a class="link-success cursorPointer" onclick=window.open("https://www.twitch.tv/popout/${USERNAME}/viewercard/${winner}?popout=","_blank","width=340,height=800")>
    ${winner}
    </a>`;
    elements.raffleOutput.append(p);
    removeFromRaffle(winner);

    raffleWinnerChat(
      {
        "user-id": winnerObject.id,
        username: winnerObject.username,
        "display-name": winnerObject.displayname,
        color: winnerObject.color,
        badges: winnerObject.badges,
        emotes: winnerObject.emotes,
        time: winnerObject.time,
      },
      winnerObject.msg,
      false
    );
    paused = false;
  }
} //drawRaffleWinner

async function drawRaffleWinnerTier3() {
  if (raffle_users_tier3.length < 2) {
    let p = document.createElement("p");
    p.innerHTML = `Less than 2 users in raffle.`;
    elements.raffleOutputTier3.append(p);
    return;
  }

  paused = true;

  if (elements.animationSelect.value == "on" || elements.animationSelect.value == "pfp") {
    drawRaffleWinnerFancyTier3(true);
  } else {
    let user_tickets = [];
    for (let index = 0, j = raffle_users_tier3.length; index < j; index++) {
      for (let i = raffle_users_tier3[index].tickets; i > 0; i--) {
        user_tickets.push(raffle_users_tier3[index].username);
      }
    }
    winnerTier3 = user_tickets[Math.floor(Math.random() * user_tickets.length)];
    raffleWinnersTier3.push(winnerTier3);
    let winnerObject = raffle_users_tier3.find((e) => e.username == winnerTier3);

    let p = document.createElement("p");
    p.classList.add("h2");
    p.innerHTML = `
    Winner #${raffleWinners.length}: 
    <a class="link-success cursorPointer" onclick=window.open("https://www.twitch.tv/popout/${USERNAME}/viewercard/${winnerTier3}?popout=","_blank","width=340,height=800")>
    ${winnerTier3}
    </a>`;
    elements.raffleOutput.append(p);
    removeFromRaffleTier3(winnerTier3);

    raffleWinnerChat(
      {
        "user-id": winnerObject.id,
        username: winnerObject.username,
        "display-name": winnerObject.displayname,
        color: winnerObject.color,
        badges: winnerObject.badges,
        emotes: winnerObject.emotes,
        time: winnerObject.time,
      },
      winnerObject.msg,
      true
    );
    paused = false;
  }
} //drawRaffleWinnerTier3

class Slot {
  constructor(username, pfp, color) {
    this.username = username;
    this.pfp = !pfp ? "/pics/donk.png" : pfp;
    this.color = !color ? "#ffffff" : color;
    this.measureUnit = "px";
    this.ordinal = 0;
    this.left = 0;
    this.div = document.createElement("div");
    this.div.classList.add("slot-element");

    if (elements.animationSelect.value == "pfp") {
      this.div.innerHTML = `<span style="color:${this.color};"> ${this.username} </span>
        <div style="height: 310px; width: 300px; border-bottom: 10px solid transparent; background: radial-gradient(circle, rgba(255,255,255,1) 0%, ${this.color} 100%);">
          <img
            style="background: linear-gradient(0deg, ${this.color} 1%, rgba(100,100,100,1) 40%); height: 300px; width: 300px;"
            src="${this.pfp}"
            alt="${this.username}"
            title="${this.username}"
          />
        </div>`;
    } else {
      this.div.innerHTML = `<span style="color:${this.color};"> ${this.username} </span>
      <div style="height: 310px; width: 300px; border-bottom: 10px solid transparent; background: radial-gradient(circle, rgba(255,255,255,1) 0%, ${this.color} 100%);">
        <img style="background: ${this.color}; height: 300px; width: 300px;" src="${this.pfp}" alt="${this.username}" title="${this.username}" />
      </div>`;
    }

    this.div.innerHTML = `
    <span style="color:${this.color};"> ${this.username} </span>
    <div style="height: 310px; width: 300px; border-bottom: 10px solid transparent; background: radial-gradient(circle, rgba(255,255,255,1) 0%, ${this.color} 100%);">
    <img style="background: ${this.color}; height: 300px; width: 300px;" src="${this.pfp}" alt="${this.username}" title="${this.username}" />
    </div>`;
  }

  init(num = 0) {
    this.ordinal = -num;
  }

  resetPosition(left = 0) {
    this.left = left;
    this.setPositionDOM(0);
  }

  scroll(amount = 0) {
    this.left -= amount;
    if (this.left < (this.ordinal - 2) * app.animation.constants.ELEMENT_WIDTH) {
      tickSound.play();
      this.left += app.slotOptions.length * app.animation.constants.ELEMENT_WIDTH;
    }
    this.setPositionDOM(this.left);
  }

  setPositionDOM(px = 0) {
    this.div.style.left = px + this.measureUnit;
  }

  checkEquatorPosition() {
    if (!this.div.parentNode) return void console.warn("Div is not attached to anything! Cannot calculate position!", this);
    const parentCoords = this.div.parentNode.getBoundingClientRect();
    const equator = parentCoords.x + parentCoords.width / 2;
    const rect = this.div.getBoundingClientRect();
    const coords = [rect.x, rect.x + rect.width];
    return coords[0] <= equator && coords[1] >= equator;
  }

  cloneSelf() {
    const clone = new Slot(this.username, this.pfp, this.color);
    return clone;
  }

  destroy() {
    if (this.div.parentNode) this.div.parentNode.removeChild(this.div);
  }
}

const detectWinner = function () {
  revealSound.play();
  let winnerSlot = null;
  for (let index = 0, j = app.slotOptions.length; index < j; index++) {
    if (app.slotOptions[index].checkEquatorPosition()) {
      winnerSlot = app.slotOptions[index];
    }
  }
  if (winnerSlot) {
    const resultDiv = winnerSlot.cloneSelf();
    elements.gameWinner.appendChild(resultDiv.div);
    app.spinStarted = false;
    raffleWinners.push(winnerSlot.username);
    winner = winnerSlot.username;

    removeFromRaffle(winnerSlot.username);

    let p = document.createElement("p");
    p.classList.add("h2");
    p.innerHTML = `Winner #${raffleWinners.length}: <a class="link-success cursorPointer" onclick=window.open("https://www.twitch.tv/popout/${USERNAME}/viewercard/${winnerSlot.username}?popout=","_blank","width=340,height=800")>${winnerSlot.username}</a>`;
    elements.raffleOutput.append(p);
    setTimeout(() => {
      fancyRaffleModal.hide();
      elements.gameWinner.innerHTML = "";
      elements.slot.innerHTML = `<div class="spinner-border" style="width: 10rem; height: 10rem; margin-left: auto; margin-right: auto; display:block;" role="status"><span class="visually-hidden">Loading...</span></div>`;
    }, 2000);
  } else {
    window.alert("Could not determine winner FeelsDonkMan");
  }
  paused = false;
}; //detectWinner

const detectWinnerTier3 = function () {
  revealSound.play();
  let winnerSlot = null;
  for (let index = 0, j = app.slotOptions.length; index < j; index++) {
    if (app.slotOptions[index].checkEquatorPosition()) {
      winnerSlot = app.slotOptions[index];
    }
  }
  if (winnerSlot) {
    const resultDiv = winnerSlot.cloneSelf();
    elements.gameWinner.appendChild(resultDiv.div);
    app.spinStarted = false;
    raffleWinnersTier3.push(winnerSlot.username);
    winnerTier3 = winnerSlot.username;

    removeFromRaffleTier3(winnerSlot.username);

    let p = document.createElement("p");
    p.classList.add("h2");
    p.innerHTML = `Winner #${raffleWinnersTier3.length}: <a class="link-success cursorPointer" onclick=window.open("https://www.twitch.tv/popout/${USERNAME}/viewercard/${winnerSlot.username}?popout=","_blank","width=340,height=800")>${winnerSlot.username}</a>`;
    elements.raffleOutputTier3.append(p);
    setTimeout(() => {
      fancyRaffleModal.hide();
      elements.gameWinner.innerHTML = "";
      elements.slot.innerHTML = `<div class="spinner-border" style="width: 10rem; height: 10rem; margin-left: auto; margin-right: auto; display:block;" role="status"><span class="visually-hidden">Loading...</span></div>`;
    }, 2000);
  } else {
    window.alert("Could not determine winner FeelsDonkMan");
  }
  paused = false;
}; //detectWinnerTier3

const animateRoll = function () {
  app.animation.speed += app.animation.acceleration;
  if (app.animation.speed < 0) {
    // animation ended
    app.animation.speed = 0;
    app.animation.acceleration = 0;
    setTimeout(detectWinner, 1000);
  } else {
    // draw frame
    for (let index = 0, j = app.slotOptions.length; index < j; index++) {
      app.slotOptions[index].scroll(app.animation.speed);
    }
    // loopback
    window.requestAnimationFrame(animateRoll);
  }
}; //animateRoll

const animateRollTier3 = function () {
  app.animation.speed += app.animation.acceleration;
  if (app.animation.speed < 0) {
    // animation ended
    app.animation.speed = 0;
    app.animation.acceleration = 0;
    setTimeout(detectWinnerTier3, 1000);
  } else {
    // draw frame
    for (let index = 0, j = app.slotOptions.length; index < j; index++) {
      app.slotOptions[index].scroll(app.animation.speed);
    }
    // loopback
    window.requestAnimationFrame(animateRollTier3);
  }
}; //animateRollTier3

Array.prototype.shuffle = function () {
  for (let i = this.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [this[i], this[j]] = [this[j], this[i]];
  }
  return this;
};

const app = {
  slotOptions: [],
  animation: {
    constants: {
      ELEMENT_WIDTH: 310, // in %
      SLOW_DOWN: -0.1,
      STARTING_SPEED: 40,
    },
    acceleration: 0,
    speed: 0,
    projectedFPS: 0,
  },
  spinStarted: false,
  ready: false,
};

async function drawRaffleWinnerFancy() {
  fancyRaffleModal.show();
  elements.claw.style.display = "none";
  let user_tickets = [];
  for (let index = 0, j = raffle_users.length; index < j; index++) {
    for (let i = raffle_users[index].tickets; i > 0; i--) {
      user_tickets.push(raffle_users[index]);
    }
  }
  user_tickets = user_tickets.shuffle().slice(0, 100);

  if (elements.animationSelect.value == "pfp") {
    let pfp = await getPFP(user_tickets.map((a) => a.username));
    if (pfp != 0) {
      for (let index = 0, j = user_tickets.length; index < j; index++) {
        if (pfp.find((e) => e.login === user_tickets[index].username)) {
          let url = pfp.find((e) => e.login === user_tickets[index].username).profile_image_url;
          if (url) {
            user_tickets[index].pfp = url;
          }
        }
      }
    }
  } else {
    for (let index = 0, j = user_tickets.length; index < j; index++) {
      user_tickets[index].pfp = "/pics/raffledonk.png";
    }
  }

  // destroy previous slots
  for (let index = 0, j = app.slotOptions.length; index < j; index++) {
    app.slotOptions[index].destroy();
  }
  app.slotOptions.length = 0;
  // rebuild the wheel by adding options (slots)
  for (let index = 0, j = user_tickets.length; index < j; index++) {
    app.slotOptions.push(new Slot(user_tickets[index].username, user_tickets[index].pfp, user_tickets[index].color));
  }
  // prevent roll stacking
  if (app.spinStarted) {
    return;
  }
  app.spinStarted = true;
  // check if slot wheel is not empty
  if (app.slotOptions.length < 1) {
    app.spinStarted = false;
    return window.alert("Nothing to spin!");
  }
  // hack: too many slots is bad for animations
  while (app.slotOptions.length < 20) {
    for (let index = 0, j = app.slotOptions.length; index < j; index++) {
      app.slotOptions.push(app.slotOptions[index].cloneSelf());
    }
  }
  // restart the wheel
  elements.gameWinner.innerHTML = "";
  elements.slot.innerHTML = "";
  elements.claw.style.display = "block";
  app.slotOptions.shuffle().forEach((game, i) => {
    game.init(i);
    game.resetPosition(-20);
    elements.slot.appendChild(game.div);
  });
  // set up the animation:
  app.animation.speed = app.animation.constants.STARTING_SPEED;
  const targetFPS = 60;
  const correction = targetFPS / app.animation.projectedFPS;
  app.animation.speed *= correction;
  setTimeout(() => {
    // slow down
    app.animation.acceleration = app.animation.constants.SLOW_DOWN;
    app.animation.acceleration *= correction * correction;
  }, Math.round(1500 + Math.random() * 1000));
  animateRoll();
} //drawRaffleWinnerFancy

async function drawRaffleWinnerFancyTier3() {
  fancyRaffleModal.show();
  elements.claw.style.display = "none";
  let user_tickets = [];
  for (let index = 0, j = raffle_users_tier3.length; index < j; index++) {
    for (let i = raffle_users_tier3[index].tickets; i > 0; i--) {
      user_tickets.push(raffle_users_tier3[index]);
    }
  }
  user_tickets = user_tickets.shuffle().slice(0, 100);
  if (elements.animationSelect.value == "pfp") {
    let pfp = await getPFP(user_tickets.map((a) => a.username));
    if (pfp != 0) {
      for (let index = 0, j = user_tickets.length; index < j; index++) {
        if (pfp.find((e) => e.login === user_tickets[index].username)) {
          let url = pfp.find((e) => e.login === user_tickets[index].username).profile_image_url;
          if (url) {
            user_tickets[index].pfp = url;
          }
        }
      }
    }
  } else {
    for (let index = 0, j = user_tickets.length; index < j; index++) {
      user_tickets[index].pfp = "/pics/raffledonk.png";
    }
  }

  // destroy previous slots
  for (let index = 0, j = app.slotOptions.length; index < j; index++) {
    app.slotOptions[index].destroy();
  }
  app.slotOptions.length = 0;
  // rebuild the wheel by adding options (slots)
  for (let index = 0, j = user_tickets.length; index < j; index++) {
    app.slotOptions.push(new Slot(user_tickets[index].username, user_tickets[index].pfp, user_tickets[index].color));
  }
  // prevent roll stacking
  if (app.spinStarted) {
    return;
  }
  app.spinStarted = true;
  // check if slot wheel is not empty
  if (app.slotOptions.length < 1) {
    app.spinStarted = false;
    return window.alert("Nothing to spin!");
  }
  // hack: too many slots is bad for animations
  while (app.slotOptions.length < 20) {
    for (let index = 0, j = app.slotOptions.length; index < j; index++) {
      app.slotOptions.push(app.slotOptions[index].cloneSelf());
    }
  }
  // restart the wheel
  elements.gameWinner.innerHTML = "";
  elements.slot.innerHTML = "";
  elements.claw.style.display = "block";
  app.slotOptions.shuffle().forEach((game, i) => {
    game.init(i);
    game.resetPosition(-20);
    elements.slot.appendChild(game.div);
  });
  // set up the animation:
  app.animation.speed = app.animation.constants.STARTING_SPEED;
  const targetFPS = 60;
  const correction = targetFPS / app.animation.projectedFPS;
  app.animation.speed *= correction;
  setTimeout(() => {
    // slow down
    app.animation.acceleration = app.animation.constants.SLOW_DOWN;
    app.animation.acceleration *= correction * correction;
  }, Math.round(1500 + Math.random() * 1000));
  animateRollTier3();
} //drawRaffleWinnerFancy

async function getPFP(users) {
  let requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  let pfp = [];
  return new Promise(async (resolve) => {
    try {
      let response = await fetch(`https://helper.donk.workers.dev/twitch/users?login=${users.join(",")}`, requestOptions);
      let result = await response.json();
      for (let index = 0, j = result.data.length; index < j; index++) {
        pfp.push(result.data[index]);
      }
      return resolve(pfp);
    } catch (error) {
      console.log("getPFP", error);
      return resolve(0);
    }
  });
} //getPFP

const fpsBenchmark = function () {
  // fps correction
  let timestamp = performance.now();
  let frames = 0;
  let avgtime = 0;
  let running = true;
  console.log("Performance test started.");
  const sendBenchFrame = function () {
    let ts = performance.now();
    frames += 1;
    avgtime = ((frames - 1) * avgtime - timestamp + ts) / frames;
    timestamp = ts;
    if (running) window.requestAnimationFrame(sendBenchFrame);
  };
  sendBenchFrame();
  setTimeout(() => {
    running = false;
    app.animation.projectedFPS = 1000 / avgtime; // <----- this is your real fps value
    console.info(`Performance test ended.\n- avg frame time: ${avgtime}\n- projected FPS: ${app.animation.projectedFPS}\n- test frames drawn: ${frames} in 1 sec`);
  }, 1000);
};

function raffleWinnerChat(context, msg, tier3) {
  let msg_s = validator.escape(msg);
  if (context.emotes) {
    let emotes = [];
    for (const [key, value] of Object.entries(context.emotes)) {
      for (let index = 0, j = value.length; index < j; index++) {
        if (emotes.some((emote) => emote.id == key)) {
          continue;
        }
        let limits = value[index].split("-");
        emotes.push({ emote: [...msg].slice(parseInt(limits[0], 10), parseInt(limits[1], 10) + 1).join(""), id: key });
      }
    }
    for (let index = 0, j = emotes.length; index < j; index++) {
      let e = `<img src="https://static-cdn.jtvnw.net/emoticons/v2/${emotes[index].id}/default/dark/1.0" title="${emotes[index].emote}" alt="${emotes[index].emote}" class="emote">`;
      msg_s = msg_s.replaceAll(emotes[index].emote, e);
    }
  } //emotes
  msg_s = replaceEmotes(msg_s, thirdPartyEmotes);
  let name = context.username == context["display-name"].toLowerCase() ? `${context["display-name"]}` : `${context["display-name"]} (${context.username})`;
  let color = !context.color ? "#FFFFFF" : context.color;
  let badges = addBadges(context.badges, context["user-id"], context.firstmsg);
  let p = document.createElement("p");
  p.innerHTML = `${badges}<span style="color:${color};"> ${name}:</span> ${msg_s}`;
  if (tier3) {
    elements.raffleOutputTier3.append(p);
    linkifyElementID("raffleOutputTier3", false);
  } else {
    elements.raffleOutput.append(p);
    linkifyElementID("raffleOutput", false);
  }
} //raffleWinnerChat

function removeFromRaffle(username) {
  raffle_users = raffle_users.filter((e) => e.username !== username);
  document.getElementById(username + "_raffle").remove();
  elements.entrants.innerHTML = `Entrants: ${raffle_users.length}`;
} //removeFromRaffle

function removeFromRaffleTier3(username) {
  raffle_users_tier3 = raffle_users_tier3.filter((e) => e.username !== username);
  document.getElementById(username + "_raffle_tier3").remove();
  elements.entrantsTier3.innerHTML = `Entrants: ${raffle_users_tier3.length}`;
} //removeFromRaffleTier3

async function getEmotes() {
  setTimeout(async () => {
    let bttv = await getGlobalBTTVEmotes();
    let ffz = await getGlobalFFZEmotes();
    let seventv = await getGlobal7TVEmotes();
    let bttvChannel = await getChannelBTTVEmotes(userid);
    let ffzChannel = await getChannelFFZEmotes(userid);
    let seventvChannel = await getChannel7TVEmotes(userid);
    thirdPartyEmotes = [...thirdPartyEmotes, ...bttv, ...ffz, ...seventv, ...bttvChannel, ...ffzChannel, ...seventvChannel];
  }, 3000);
} //getEmotes

async function loadTier3Emotes() {
  try {
    let requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    let response = await fetch(`https://helper.donk.workers.dev/twitch/chat/emotes?broadcaster_id=${userid}`, requestOptions);
    let result = await response.json();
    elements.emotes.innerHTML = "";
    for (let index = 0; index < result.data.length; index++) {
      if (result.data[index].tier == 3000) {
        tier3Emotes.push(result.data[index].id);
        elements.emotes.insertAdjacentHTML(
          "afterbegin",
          `<img title="${result.data[index].name}" src="https://static-cdn.jtvnw.net/emoticons/v2/${result.data[index].id}/default/dark/1.0"> `
        );
      }
    }
  } catch (error) {
    console.log(error);
    elements.emotes.innerHTML = `<span class="text-danger">Could not load emotes</span>`;
  }
}

window.onload = async function () {
  connect();
  fpsBenchmark();

  restartRaffleModal = new bootstrap.Modal(elements.restartRaffleModal);
  restartTier3RaffleModal = new bootstrap.Modal(elements.restartTier3RaffleModal);
  fancyRaffleModal = new bootstrap.Modal(elements.fancyRaffleModal);

  enableTooltips();

  tickSound = new Howl({
    src: ["/raffles/tick.mp3"],
  });
  revealSound = new Howl({
    src: ["/raffles/reveal.mp3"],
  });
  loadTier3Emotes();
}; //onload

window.onbeforeunload = function () {
  return "Are you sure?";
}; //onbeforeunload
