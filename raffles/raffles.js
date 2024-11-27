let elements = {
  //modals
  resetSettingsModal: document.getElementById("resetSettingsModal"),
  loginExpiredModal: document.getElementById("loginExpiredModal"),
  restartRaffleModal: document.getElementById("restartRaffleModal"),
  fancyRaffleModal: document.getElementById("fancyRaffleModal"),
  claw: document.getElementById("claw"),
  slot: document.getElementById("slot"),
  fancyRaffleWinner: document.getElementById("fancyRaffleWinner"),

  //navbar
  status: document.getElementById("status"),
  topRight: document.getElementById("topRight"),
  loginButton: document.getElementById("loginButton"),
  channelName: document.getElementById("channelName"),
  darkTheme: document.getElementById("darkTheme"),

  //raffle
  enableRaffle: document.getElementById("enableRaffle"),
  enableRaffleText: document.getElementById("enableRaffleText"),
  raffleCommandButton: document.getElementById("raffleCommandButton"),
  raffleCommandText: document.getElementById("raffleCommandText"),
  settingsOffcanvas: document.getElementById("settingsOffcanvas"),
  raffleUsers: document.getElementById("raffleUsers"),
  entrants: document.getElementById("entrants"),
  raffleOutput: document.getElementById("raffleOutput"),
  extraTimerDiv: document.getElementById("extraTimerDiv"),
  extraTimerMins: document.getElementById("extraTimerMins"),
  startExtraTimer: document.getElementById("startExtraTimer"),
  stopExtraTimer: document.getElementById("stopExtraTimer"),
  unpauseExtraTimer: document.getElementById("unpauseExtraTimer"),
  pauseExtraTimer: document.getElementById("pauseExtraTimer"),
  extraCountdown: document.getElementById("extraCountdown"),

  //settings
  raffleCommand: document.getElementById("raffleCommand"),
  removeWinner: document.getElementById("removeWinner"),

  //who can join
  whoCanJoinCard: document.getElementById("whoCanJoinCard"),
  whoCanJoin: document.getElementById("whoCanJoin"),
  selectAll: document.getElementById("selectAll"),
  unselectAll: document.getElementById("unselectAll"),
  plebBonus: document.getElementById("plebBonus"),
  followerBonus: document.getElementById("followerBonus"),
  subBonus: document.getElementById("subBonus"),
  tier1Bonus: document.getElementById("tier1Bonus"),
  tier2Bonus: document.getElementById("tier2Bonus"),
  tier3Bonus: document.getElementById("tier3Bonus"),
  modBonus: document.getElementById("modBonus"),
  vipBonus: document.getElementById("vipBonus"),
  firstTimeChatterBonus: document.getElementById("firstTimeChatterBonus"),
  followAge: document.getElementById("followAge"),
  followAgeUnit: document.getElementById("followAgeUnit"),
  subAge: document.getElementById("subAge"),
  tier1SubAge: document.getElementById("tier1SubAge"),
  tier2SubAge: document.getElementById("tier2SubAge"),
  tier3SubAge: document.getElementById("tier3SubAge"),
  allowPlebs: document.getElementById("allowPlebs"),
  allowFollowers: document.getElementById("allowFollowers"),
  allowSubs: document.getElementById("allowSubs"),
  allowTier1: document.getElementById("allowTier1"),
  allowTier2: document.getElementById("allowTier2"),
  allowTier3: document.getElementById("allowTier3"),
  allowMods: document.getElementById("allowMods"),
  allowVips: document.getElementById("allowVips"),
  allowFirstTimeChatters: document.getElementById("allowFirstTimeChatters"),
  splitTiers: document.getElementById("splitTiers"),
  subsRow: document.getElementById("subsRow"),
  tier1Row: document.getElementById("tier1Row"),
  tier2Row: document.getElementById("tier2Row"),
  tier3Row: document.getElementById("tier3Row"),

  //animation
  animateDrawing: document.getElementById("animateDrawing"),
  useTwitchPFP: document.getElementById("useTwitchPFP"),

  //timers
  autoRerollEnabled: document.getElementById("autoRerollEnabled"),
  rerollTimerValueMinutes: document.getElementById("rerollTimerValueMinutes"),
  extraTimerEnabled: document.getElementById("extraTimerEnabled"),

  //bot
  announceWinner: document.getElementById("announceWinner"),
  confirmJoin: document.getElementById("confirmJoin"),

  linkPreviewThumbnailsEnabled: document.getElementById("linkPreviewThumbnailsEnabled"),
  refreshWarningEnabled: document.getElementById("refreshWarningEnabled"),
  bttvGlobalEmotes: document.getElementById("bttvGlobalEmotes"),
  bttvChannelEmotes: document.getElementById("bttvChannelEmotes"),
  ffzGlobalEmotes: document.getElementById("ffzGlobalEmotes"),
  ffzChannelEmotes: document.getElementById("ffzChannelEmotes"),
  seventvGlobalEmotes: document.getElementById("seventvGlobalEmotes"),
  seventvChannelEmotes: document.getElementById("seventvChannelEmotes"),

  //main
  toastContainer: document.getElementById("toastContainer"),
  raffleTitle: document.getElementById("raffleTitle"),
  titleHint: document.getElementById("titleHint"),
};

let client;
let raffle_users = [];
let raffle_tickets = [];
let raffle_open;
let extraTimer;
let timer_raffle;
let currentTime = 0;
let rafflePopover;
let loginButton;
let resetSettingsModal, loginExpiredModal, restartRaffleModal, fancyRaffleModal;
let currentRaffleWinner = "";
let raffleWinners = [];
let settingsOffcanvas;
let tickSound, revealSound;
let thirdPartyEmotes = [];
let firstTimeChatters = [];

let darkTheme = true;

let USER = {
  channel: "",
  twitchLogin: false,
  access_token: "",
  userID: "",
  platform: "",
};

let RAFFLES = {
  raffleCommand: "!join",
  removeWinner: true,
  allowPlebs: true,
  allowFollowers: true,
  allowSubs: true,
  allowTier1: true,
  allowTier2: true,
  allowTier3: true,
  allowMods: true,
  allowVips: true,
  allowFirstTimeChatters: true,
  plebBonus: 0,
  followerBonus: 0,
  subBonus: 0,
  tier1Bonus: 0,
  tier2Bonus: 0,
  tier3Bonus: 0,
  modBonus: 0,
  vipBonus: 0,
  firstTimeChatterBonus: 0,
  followAge: 0,
  followAgeUnit: "min",
  subAge: 0,
  tier1SubAge: 0,
  tier2SubAge: 0,
  tier3SubAge: 0,
  splitTiers: false,
  animateDrawing: true,
  useTwitchPFP: false,
  autoRerollEnabled: false,
  rerollTimerValueMinutes: 0,
  extraTimerEnabled: false,
  announceWinner: false,
  confirmJoin: false,
  linkPreviewThumbnailsEnabled: false,
  refreshWarningEnabled: false,
};

async function refreshData() {
  darkTheme = elements.darkTheme.checked ?? true;

  if (!USER.twitchLogin) {
    USER.channel = escapeString(elements.channelName.value.replace(/\s+/g, "").toLowerCase());
    USER.platform = "twitch";
  }
  if (!USER.userID && USER.channel) {
    USER.userID = await getUserID(USER.channel);
  }
  RAFFLES.raffleCommand = elements.raffleCommand.value.replace(/\s+/g, "").toLowerCase() ?? "!join";
  elements.raffleCommand.value = RAFFLES.raffleCommand;
  if (!RAFFLES.raffleCommand) {
    RAFFLES.raffleCommand = "!join";
    elements.raffleCommand.value = "!join";
  }

  RAFFLES.removeWinner = elements.removeWinner.checked ?? true;
  RAFFLES.allowPlebs = elements.allowPlebs.checked ?? true;
  RAFFLES.allowFollowers = elements.allowFollowers.checked ?? true;
  RAFFLES.allowSubs = elements.allowSubs.checked ?? true;
  RAFFLES.allowTier1 = elements.allowTier1.checked ?? true;
  RAFFLES.allowTier2 = elements.allowTier2.checked ?? true;
  RAFFLES.allowTier3 = elements.allowTier3.checked ?? true;
  RAFFLES.allowMods = elements.allowMods.checked ?? true;
  RAFFLES.allowVips = elements.allowVips.checked ?? true;
  RAFFLES.allowFirstTimeChatters = elements.allowFirstTimeChatters.checked ?? true;
  RAFFLES.plebBonus = parseInt(elements.plebBonus.value, 10) || 0;
  RAFFLES.followerBonus = parseInt(elements.followerBonus.value, 10) || 0;
  RAFFLES.subBonus = parseInt(elements.subBonus.value, 10) || 0;
  RAFFLES.tier1Bonus = parseInt(elements.tier1Bonus.value, 10) || 0;
  RAFFLES.tier2Bonus = parseInt(elements.tier2Bonus.value, 10) || 0;
  RAFFLES.tier3Bonus = parseInt(elements.tier3Bonus.value, 10) || 0;
  RAFFLES.modBonus = parseInt(elements.modBonus.value, 10) || 0;
  RAFFLES.vipBonus = parseInt(elements.vipBonus.value, 10) || 0;
  RAFFLES.firstTimeChatterBonus = parseInt(elements.firstTimeChatterBonus.value, 10) || 0;
  RAFFLES.followAge = parseInt(elements.followAge.value, 10) || 0;
  RAFFLES.followAgeUnit = elements.followAgeUnit.value || "min";
  RAFFLES.subAge = parseInt(elements.subAge.value, 10) || 0;
  RAFFLES.tier1SubAge = parseInt(elements.tier1SubAge.value, 10) || 0;
  RAFFLES.tier2SubAge = parseInt(elements.tier2SubAge.value, 10) || 0;
  RAFFLES.tier3SubAge = parseInt(elements.tier3SubAge.value, 10) || 0;
  RAFFLES.splitTiers = elements.splitTiers.checked ?? false;
  RAFFLES.animateDrawing = elements.animateDrawing.checked ?? true;
  RAFFLES.useTwitchPFP = elements.useTwitchPFP.checked ?? false;
  RAFFLES.autoRerollEnabled = elements.autoRerollEnabled.checked ?? false;
  RAFFLES.rerollTimerValueMinutes = parseFloat(elements.rerollTimerValueMinutes.value) ?? 0;
  RAFFLES.extraTimerEnabled = elements.extraTimerEnabled.checked ?? false;
  RAFFLES.announceWinner = elements.announceWinner.checked ?? false;
  RAFFLES.confirmJoin = elements.confirmJoin.checked ?? false;
  RAFFLES.linkPreviewThumbnailsEnabled = elements.linkPreviewThumbnailsEnabled.checked ?? false;
  RAFFLES.refreshWarningEnabled = elements.refreshWarningEnabled.checked ?? false;
  elements.raffleCommandButton.innerHTML = RAFFLES.raffleCommand || "!join";
  elements.raffleCommandText.innerHTML = RAFFLES.raffleCommand || "!join";
} //refreshdata

function saveSettings() {
  refreshData();
  localStorage.setItem("USER", JSON.stringify(USER));
  localStorage.setItem("RAFFLES", JSON.stringify(RAFFLES));
  localStorage.setItem("darkTheme", darkTheme);

  updateWhoCanJoin();
} //saveSettings

function load_localStorage() {
  if (!localStorage.getItem("USER")) {
    console.log("localStorage user info not found");
  } else {
    USER = JSON.parse(localStorage.getItem("USER"));
    elements.channelName.value = USER.channel || "";
  }

  if (!localStorage.getItem("RAFFLES")) {
    console.log("localStorage raffle settings not found");
  } else {
    RAFFLES = JSON.parse(localStorage.getItem("RAFFLES"));
    elements.raffleCommand.value = RAFFLES.raffleCommand || "!join";
    elements.raffleCommandButton.innerHTML = RAFFLES.raffleCommand || "!join";
    elements.raffleCommandText.innerHTML = RAFFLES.raffleCommand || "!join";
    elements.removeWinner.checked = RAFFLES.removeWinner ?? true;
    elements.allowPlebs.checked = RAFFLES.allowPlebs ?? true;
    elements.allowFollowers.checked = RAFFLES.allowFollowers ?? true;
    elements.allowSubs.checked = RAFFLES.allowSubs ?? true;
    elements.allowTier1.checked = RAFFLES.allowTier1 ?? true;
    elements.allowTier2.checked = RAFFLES.allowTier2 ?? true;
    elements.allowTier3.checked = RAFFLES.allowTier3 ?? true;
    elements.allowMods.checked = RAFFLES.allowMods ?? true;
    elements.allowVips.checked = RAFFLES.allowVips ?? true;
    elements.allowFirstTimeChatters.checked = RAFFLES.allowFirstTimeChatters ?? true;
    elements.plebBonus.value = parseInt(RAFFLES.plebBonus, 10) || 0;
    elements.followerBonus.value = parseInt(RAFFLES.followerBonus, 10) || 0;
    elements.subBonus.value = parseInt(RAFFLES.subBonus, 10) || 0;
    elements.tier1Bonus.value = parseInt(RAFFLES.tier1Bonus, 10) || 0;
    elements.tier2Bonus.value = parseInt(RAFFLES.tier2Bonus, 10) || 0;
    elements.tier3Bonus.value = parseInt(RAFFLES.tier3Bonus, 10) || 0;
    elements.modBonus.value = parseInt(RAFFLES.modBonus, 10) || 0;
    elements.vipBonus.value = parseInt(RAFFLES.vipBonus, 10) || 0;
    elements.firstTimeChatterBonus.value = parseInt(RAFFLES.firstTimeChatterBonus, 10) || 0;
    elements.followAge.value = parseInt(RAFFLES.followAge, 10) || 0;
    elements.followAgeUnit.value = RAFFLES.followAgeUnit || "min";
    elements.subAge.value = parseInt(RAFFLES.subAge, 10) || 0;
    elements.tier1SubAge.value = parseInt(RAFFLES.tier1SubAge, 10) || 0;
    elements.tier2SubAge.value = parseInt(RAFFLES.tier2SubAge, 10) || 0;
    elements.tier3SubAge.value = parseInt(RAFFLES.tier3SubAge, 10) || 0;
    elements.splitTiers.checked = RAFFLES.splitTiers ?? false;
    elements.animateDrawing.checked = RAFFLES.animateDrawing ?? true;
    elements.useTwitchPFP.checked = RAFFLES.useTwitchPFP ?? false;
    elements.autoRerollEnabled.checked = RAFFLES.autoRerollEnabled ?? false;
    elements.rerollTimerValueMinutes.disabled = !elements.autoRerollEnabled.checked;
    elements.rerollTimerValueMinutes.value = parseFloat(RAFFLES.rerollTimerValueMinutes) || 0;
    elements.extraTimerEnabled.checked = RAFFLES.extraTimerEnabled ?? false;
    elements.announceWinner.checked = RAFFLES.announceWinner ?? false;
    elements.confirmJoin.checked = RAFFLES.confirmJoin ?? false;
    elements.linkPreviewThumbnailsEnabled.checked = RAFFLES.linkPreviewThumbnailsEnabled ?? false;
    elements.refreshWarningEnabled.checked = RAFFLES.refreshWarningEnabled ?? false;

    if (RAFFLES.extraTimerEnabled) {
      showExtraTimer();
    }
    splitTiers(RAFFLES.splitTiers);
    updateWhoCanJoin();
  }
} //load_localStorage

function resetSettings(logout = false) {
  if (logout) {
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
  }

  localStorage.setItem(
    "RAFFLES",
    JSON.stringify({
      raffleCommand: "!join",
      removeWinner: true,
      allowPlebs: true,
      allowFollowers: true,
      allowSubs: true,
      allowTier1: true,
      allowTier2: true,
      allowTier3: true,
      allowMods: true,
      allowVips: true,
      allowFirstTimeChatters: true,
      plebBonus: 0,
      followerBonus: 0,
      subBonus: 0,
      tier1Bonus: 0,
      tier2Bonus: 0,
      tier3Bonus: 0,
      modBonus: 0,
      vipBonus: 0,
      firstTimeChatterBonus: 0,
      followAge: 0,
      followAgeUnit: "min",
      subAge: 0,
      tier1SubAge: 0,
      tier2SubAge: 0,
      tier3SubAge: 0,
      splitTiers: false,
      animateDrawing: true,
      useTwitchPFP: false,
      autoRerollEnabled: false,
      rerollTimerValueMinutes: 0,
      extraTimerEnabled: false,
      announceWinner: false,
      confirmJoin: false,
      linkPreviewThumbnailsEnabled: false,
      refreshWarningEnabled: false,
    })
  );
  location.reload();
  return false;
} //resetSettings

function restartRaffle() {
  raffle_users = [];
  raffle_tickets = [];
  currentRaffleWinner = "";
  raffleWinners = [];
  if (!!document.getElementById("countdown_raffle")) {
    document.getElementById("countdown_raffle").remove();
  }
  if (timer_raffle) {
    timer_raffle.reset();
    timer_raffle.stop();
  }
  elements.raffleUsers.innerHTML = "";
  elements.raffleOutput.innerHTML = "";
  elements.entrants.innerHTML = "Entrants: 0";
} //restartRaffle

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
  getEmotes();
  loadBadges(USER.channel);
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
    if (context.username == currentRaffleWinner) {
      if (RAFFLES.autoRerollEnabled && timer_raffle.isRunning()) {
        document.getElementById("countdown_raffle").remove();
        timer_raffle.reset();
        timer_raffle.stop();
      }
      raffleWinnerChat(context, msg);
    } //raffle winner chat

    if (context["first-msg"]) {
      firstTimeChatters.push(context.username);
    }

    let input = msg.split(" ").filter(Boolean);
    let command = input[0].toLowerCase();

    if (command == RAFFLES.raffleCommand && raffle_open) {
      //check if user already joined
      if (raffle_users.some((e) => e.username === context.username)) {
        return;
      }

      //check if multiple wins are not allowed and if user already won
      if (RAFFLES.removeWinner && raffleWinners.includes(context.username)) {
        return;
      }

      ////check if user is allowed to join
      //check if sub tiers are split
      if (RAFFLES.splitTiers) {
        //if sub tiers are split check each tier separately
        if (!RAFFLES.allowTier1 && context?.badges?.subscriber?.length <= 3) {
          return;
        }
        if (!RAFFLES.allowTier2 && context?.badges?.subscriber?.length > 3 && context?.badges?.subscriber.startsWith("2")) {
          return;
        }
        if (!RAFFLES.allowTier3 && context?.badges?.subscriber?.length > 3 && context?.badges?.subscriber.startsWith("3")) {
          return;
        }
      } else {
        if (!RAFFLES.allowSubs && context.subscriber) {
          return;
        }
      }
      //check if plebs are allowed to join
      if (!RAFFLES.allowPlebs && !context.subscriber) {
        return;
      }
      //check if mods are allowed to join
      if (!RAFFLES.allowMods && context.mod) {
        return;
      }
      //check if vips are allowed to join
      if (!RAFFLES.allowVips && context.vip) {
        return;
      }
      //check if first time chatters are allowed to join
      if (!RAFFLES.allowFirstTimeChatters && firstTimeChatters.includes(context.username)) {
        return;
      }

      //make user object with 1 ticket
      let user = {
        id: context["user-id"],
        username: context.username,
        displayname: context["display-name"],
        tickets: 1,
        color: context.color,
        badges: context.badges,
        emotes: context.emotes,
        time: context["tmi-sent-ts"],
        msg: msg,
      };

      ////add bonus tickets
      //check if sub tiers are split
      if (RAFFLES.splitTiers) {
        //if sub tiers are split add bonus for each tier separately
        if (RAFFLES.tier1Bonus > 0 && context?.badges?.subscriber?.length <= 3) {
          user.tickets += RAFFLES.tier1Bonus;
        }
        if (RAFFLES.tier2Bonus > 0 && context?.badges?.subscriber?.length > 3 && context?.badges?.subscriber.startsWith("2")) {
          user.tickets += RAFFLES.tier2Bonus;
        }
        if (RAFFLES.tier3Bonus > 0 && context?.badges?.subscriber?.length > 3 && context?.badges?.subscriber.startsWith("3")) {
          user.tickets += RAFFLES.tier3Bonus;
        }
      } else {
        if (RAFFLES.subBonus > 0 && context.subscriber) {
          user.tickets += RAFFLES.subBonus;
        }
      }
      //add pleb bonus
      if (RAFFLES.plebBonus > 0 && !context.subscriber) {
        user.tickets += RAFFLES.plebBonus;
      }
      //add mod bonus
      if (RAFFLES.modBonus > 0 && context.mod) {
        user.tickets += RAFFLES.modBonus;
      }
      //add vip bonus
      if (RAFFLES.vipBonus > 0 && context.vip) {
        user.tickets += RAFFLES.vipBonus;
      }
      //add first time chatter bonus
      if (RAFFLES.firstTimeChatterBonus > 0 && firstTimeChatters.includes(context.username)) {
        user.tickets += RAFFLES.firstTimeChatterBonus;
      }

      //add the user object to the raffle which also adds the user to the raffle_users array
      addUserToRaffle(user);
    } //raffle

    if (command == RAFFLES.raffleCommand && !raffle_open && (Date.now() - currentTime) / 1000 > 10) {
      currentTime = Date.now();
      rafflePopover.show();
      setTimeout(function () {
        rafflePopover.hide();
      }, 3000);
      return;
    } //raffle disabled

    if (command == "!reset" && (context.username == USER.channel || context.username == "badoge")) {
      resetSettings();
      return;
    } //reset settings
  }); //message

  client.on("timeout", (channel, username, reason, duration, userstate) => {
    if (username == currentRaffleWinner) {
      let raffleOutput = elements.raffleOutput;
      raffleOutput.lastChild.innerHTML = `<small class="text-body-secondary">Message deleted</small>`;
    }
  }); //timeout

  client.on("connected", async (address, port) => {
    console.log(`Connected to ${address}:${port}`);
    elements.status.innerHTML = `<h4><span class="badge bg-success">Connected :)</span></h4>`;
    saveSettings();
    sendUsername(`chat.vote/raffles`, USER.channel, USER.platform == "twitch" ? `twitch - ${USER.twitchLogin}` : "youtube");
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
      onclick="login()"
      class="btn btn-twitch"
      tabindex="0"
      data-bs-container="body"
      data-bs-custom-class="custom-popover"
      data-bs-placement="bottom"
      data-bs-trigger="manual"
      data-bs-toggle="popover"
      data-bs-title="Not signed in"
      data-bs-content="You need sign in first before enabling the raffle"
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
          <button type="button" onclick="connect()" class="btn btn-primary float-end">Connect</button>
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

function addUserToRaffle(user) {
  raffle_users.push(user);
  let name = user.username == user.displayname.toLowerCase() ? `${user.displayname}` : `${user.displayname} (${user.username})`;
  let color = !user.color ? "#FFFFFF" : user.color;
  let badges = addBadges(user.badges, user.id, firstTimeChatters.includes(user.username));
  elements.raffleUsers.insertAdjacentHTML(
    "afterbegin",
    `
    <li id="${user.username}_raffle" class="list-group-item">
    ${badges}<span style="color:${color};"> ${name}</span>: ${user.tickets} ${user.tickets == 1 ? "ticket" : "tickets"} 
    <i class="material-icons notranslate deletebtn float-end" onclick="removeFromRaffle('${user.username}')">highlight_off</i>
    </li>`
  );
  elements.entrants.innerHTML = `Entrants: ${raffle_users.length}`;
  joinedUsers.push(user.username);
} //addUserToRaffle

async function drawRaffleWinner() {
  if (raffle_users.length < 2) {
    let p = document.createElement("p");
    showToast("You need at least 2 users to join before drawing a winner", "warning", 2500);
    elements.raffleOutput.append(p);
    return;
  }
  if (RAFFLES.animateDrawing) {
    drawRaffleWinnerFancy();
  } else {
    let user_tickets = [];
    for (let index = 0, j = raffle_users.length; index < j; index++) {
      for (let i = raffle_users[index].tickets; i > 0; i--) {
        user_tickets.push(raffle_users[index].username);
      }
    }
    currentRaffleWinner = user_tickets[Math.floor(Math.random() * user_tickets.length)];
    raffleWinners.push(currentRaffleWinner);
    let winner = raffle_users.find((e) => e.username == currentRaffleWinner);
    if (RAFFLES.autoRerollEnabled) {
      startRaffleTimer();
    }
    let p = document.createElement("p");
    p.classList.add("h2");
    p.innerHTML = `Winner #${raffleWinners.length}: <a class="link-success cursorPointer" onclick=window.open("https://www.twitch.tv/popout/${USER.channel}/viewercard/${currentRaffleWinner}?popout=","_blank","width=340,height=800")>${currentRaffleWinner}</a>`;
    elements.raffleOutput.append(p);
    if (RAFFLES.announceWinner && USER.twitchLogin) {
      let chance = Math.ceil((raffle_users.find((users) => users.username === currentRaffleWinner).tickets / user_tickets.length) * 100);
      botSay(`PogChamp @${currentRaffleWinner} won the raffle with a ${chance}% chance to win :) 🎊`);
    }
    if (RAFFLES.removeWinner) {
      removeFromRaffle(currentRaffleWinner);
    }
    raffleWinnerChat(
      { "user-id": winner.id, username: winner.username, "display-name": winner.displayname, color: winner.color, badges: winner.badges, emotes: winner.emotes, time: winner.time },
      winner.msg,
      true
    );
  }
} //drawRaffleWinner

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
    if (!RAFFLES.useTwitchPFP) {
      this.div.innerHTML = `<span style="color:${this.color};"> ${this.username} </span>
        <div style="height: 310px; width: 300px; border-bottom: 10px solid transparent; background: radial-gradient(circle, rgba(255,255,255,1) 0%, ${this.color} 100%);">
          <img style="background: ${this.color}; height: 300px; width: 300px;" src="${this.pfp}" alt="${this.username}" title="${this.username}" />
        </div>`;
    } else {
      this.div.innerHTML = `<span style="color:${this.color};"> ${this.username} </span>
        <div style="height: 310px; width: 300px; border-bottom: 10px solid transparent; background: radial-gradient(circle, rgba(255,255,255,1) 0%, ${this.color} 100%);">
          <img
            style="background: linear-gradient(0deg, ${this.color} 1%, rgba(100,100,100,1) 40%); height: 300px; width: 300px;"
            src="${this.pfp}"
            alt="${this.username}"
            title="${this.username}"
          />
        </div>`;
    }
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
    elements.fancyRaffleWinner.appendChild(resultDiv.div);
    app.spinStarted = false;
    raffleWinners.push(winnerSlot.username);
    currentRaffleWinner = winnerSlot.username;
    let winner = raffle_users.find((e) => e.username == currentRaffleWinner);
    if (RAFFLES.autoRerollEnabled) {
      startRaffleTimer();
    }
    let p = document.createElement("p");
    p.classList.add("h2");
    p.innerHTML = `Winner #${raffleWinners.length}: <a class="link-success cursorPointer" onclick=window.open("https://www.twitch.tv/popout/${USER.channel}/viewercard/${winnerSlot.username}?popout=","_blank","width=340,height=800")>${winnerSlot.username}</a>`;
    elements.raffleOutput.append(p);
    if (RAFFLES.announceWinner && USER.twitchLogin) {
      let chance = Math.ceil(
        (raffle_users.find((users) => users.username === currentRaffleWinner).tickets /
          raffle_users.reduce(function (sum, obj) {
            return sum + obj.tickets;
          }, 0)) *
          100
      );
      botSay(`PogChamp @${currentRaffleWinner} won the raffle with a ${chance}% chance to win :) 🎊`);
    }
    if (RAFFLES.removeWinner) {
      removeFromRaffle(winnerSlot.username);
    }
    raffleWinnerChat(
      { username: winner.username, "display-name": winner.displayname, color: winner.color, badges: winner.badges, emotes: winner.emotes, time: winner.time },
      winner.msg,
      true
    );
    setTimeout(() => {
      fancyRaffleModal.hide();
      elements.fancyRaffleWinner.innerHTML = "";
      elements.slot.innerHTML = `<div class="spinner-border" style="width: 10rem; height: 10rem; margin-left: auto; margin-right: auto; display:block;" role="status"><span class="visually-hidden">Loading...</span></div>`;
    }, 2000);
  } else {
    window.alert("Could not determine winner FeelsDonkMan");
  }
};

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
};

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
  if (!RAFFLES.useTwitchPFP) {
    for (let index = 0, j = user_tickets.length; index < j; index++) {
      user_tickets[index].pfp = "/pics/raffledonk.png";
    }
  } else {
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
  elements.fancyRaffleWinner.innerHTML = "";
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

async function getPFP(users) {
  let pfp = [];
  return new Promise(async (resolve) => {
    try {
      let response = await fetch(`https://helper.donk.workers.dev/twitch/users?login=${users.join(",")}`);
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

function relativeTime(timestamp) {
  const rtf = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });
  const diff = Math.round((parseInt(timestamp, 10) - new Date().getTime()) / 60000);
  return rtf.format(diff, "minute");
} //relativeTime

function raffleWinnerChat(context, msg, joinMessage = false) {
  let msg_s = escapeString(msg);
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
  let badges = addBadges(context.badges, context["user-id"], firstTimeChatters.includes(context.username));
  let p = document.createElement("p");
  p.innerHTML = `${joinMessage ? relativeTime(context.time) : ""} ${badges}<span ${joinMessage ? `class="text-body-secondary"` : `style="color:${color};"`}> ${name}:</span> ${
    joinMessage ? `<span class="text-body-secondary"> ${msg_s}</span>` : msg_s
  }`;
  elements.raffleOutput.append(p);
  linkifyElementID("raffleOutput", RAFFLES.linkPreviewThumbnailsEnabled);
} //raffleWinnerChat

function removeFromRaffle(username) {
  raffle_users = raffle_users.filter((e) => e.username !== username);
  document.getElementById(username + "_raffle").remove();
  elements.entrants.innerHTML = `Entrants: ${raffle_users.length}`;
} //removeFromRaffle

async function getEmotes() {
  setTimeout(async () => {
    let bttv = await getGlobalBTTVEmotes();
    let ffz = await getGlobalFFZEmotes();
    let seventv = await getGlobal7TVEmotes();
    elements.bttvGlobalEmotes.innerText = bttv.length;
    elements.ffzGlobalEmotes.innerText = ffz.length;
    elements.seventvGlobalEmotes.innerText = seventv.length;
    thirdPartyEmotes = [...thirdPartyEmotes, ...bttv, ...ffz, ...seventv];
    if (USER.userID) {
      let bttvChannel = await getChannelBTTVEmotes(USER.userID);
      let ffzChannel = await getChannelFFZEmotes(USER.userID);
      let seventvChannel = await getChannel7TVEmotes(USER.userID);
      thirdPartyEmotes = [...thirdPartyEmotes, ...bttvChannel, ...ffzChannel, ...seventvChannel];
      elements.bttvChannelEmotes.innerText = bttvChannel.length;
      elements.ffzChannelEmotes.innerText = ffzChannel.length;
      elements.seventvChannelEmotes.innerText = seventvChannel.length;
    }
  }, 3000);
} //getEmotes

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
    onclick="login()"
    class="btn btn-twitch"
    tabindex="0"
    data-bs-container="body"
    data-bs-custom-class="custom-popover"
    data-bs-placement="bottom"
    data-bs-trigger="manual"
    data-bs-toggle="popover"
    data-bs-title="Not signed in"
    data-bs-content="You need sign in first before enabling the raffle"
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
        <button type="button" onclick="connect()" class="btn btn-primary float-end">Connect</button>
      </div>
    </div>
  </div>
</div>`;
  resetSettings(true);
} //logout

async function botSay(msg, joinMsg = false) {
  let body = JSON.stringify({
    channel: USER.channel,
    msg: joinMsg ? `@${msg.join(", @")} joined the raffle PogChamp` : msg,
    access_token: USER.access_token,
  });
  let requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body,
  };
  try {
    let response = await fetch(`https://api.chat.vote/say`, requestOptions);
    console.log(`botSay response: ${response.status}`);
  } catch (error) {
    console.log("botSay error", error);
  }
} //botSay

function startRaffleTimer() {
  if (!!document.getElementById("countdown_raffle")) {
    document.getElementById("countdown_raffle").remove();
    timer_raffle.reset();
    timer_raffle.stop();
  }
  RAFFLES.rerollTimerValueMinutes = parseFloat(elements.rerollTimerValueMinutes.value) * 60;
  if (isNaN(RAFFLES.rerollTimerValueMinutes)) {
    return;
  }
  if (RAFFLES.rerollTimerValueMinutes == 0) {
    return;
  }
  elements.raffleOutput.innerHTML += `<div class="card border-danger" id="countdown_raffle" style="text-align: center; margin: 10px; display: none;">
    <div class="card-body">
    <div class="values" style="font-size: 3em;"></div>
    </div>
    </div>`;
  timer_raffle = new easytimer.Timer();
  timer_raffle.addEventListener("secondTenthsUpdated", function (e) {
    document.querySelector("#countdown_raffle .values").innerHTML = "Rerolling in " + timer_raffle.getTimeValues().toString(["minutes", "seconds", "secondTenths"]);
  });
  timer_raffle.addEventListener("targetAchieved", function (e) {
    document.getElementById("countdown_raffle").remove();
    timer_raffle.reset();
    timer_raffle.stop();
    drawRaffleWinner();
  });
  document.querySelector("#countdown_raffle .values").innerHTML = "Rerolling in " + timer_raffle.getTimeValues().toString(["minutes", "seconds", "secondTenths"]);
  document.getElementById("countdown_raffle").style.display = "";
  timer_raffle.start({
    countdown: true,
    precision: "secondTenths",
    startValues: {
      seconds: RAFFLES.rerollTimerValueMinutes,
    },
  });
} //startRaffleTimer

async function enableRaffleButton() {
  if (!checkLogin()) {
    return;
  }

  if (
    !RAFFLES.allowPlebs &&
    !RAFFLES.allowSubs &&
    !RAFFLES.allowTier1 &&
    !RAFFLES.allowTier2 &&
    !RAFFLES.allowTier2 &&
    !RAFFLES.allowTier3 &&
    !RAFFLES.allowMods &&
    !RAFFLES.allowVips &&
    !RAFFLES.allowFirstTimeChatters
  ) {
    showToast("No one will be able to join the raffle", "danger", 3000);
    settingsOffcanvas.show();
    elements.whoCanJoinCard.scrollIntoView();
    let flashBorder = setInterval(() => {
      elements.whoCanJoinCard.classList.toggle("border-info");
    }, 100);
    setTimeout(() => {
      clearInterval(flashBorder);
      elements.whoCanJoinCard.classList.remove("border-info");
    }, 1000);
    return;
  }

  fpsBenchmark();
  raffle_open = true;
  elements.enableRaffle.classList.remove("btn-success");
  elements.enableRaffle.classList.add("btn-danger");
  elements.enableRaffleText.innerText = "Close Raffle";
} //enableRaffleButton

function disableRaffleButton() {
  raffle_open = false;
  elements.enableRaffle.classList.remove("btn-danger");
  elements.enableRaffle.classList.add("btn-success");
  elements.enableRaffleText.innerText = "Open Raffle";
} //disableRaffleButton

function changeRaffleCommand() {
  settingsOffcanvas.show();
  setTimeout(() => {
    elements.raffleCommand.focus();
    elements.raffleCommand.select();
  }, 500);
  let flashBorder = setInterval(() => {
    elements.raffleCommand.classList.toggle("border-info");
  }, 100);
  setTimeout(() => {
    clearInterval(flashBorder);
    elements.raffleCommand.classList.remove("border-info");
  }, 1000);
} //changeRaffleCommand

function showExtraTimer() {
  elements.extraTimerDiv.style.display = "";
} //showExtraTimer

function hideExtraTimer() {
  if (extraTimer && extraTimer.isRunning()) {
    extraTimer.reset();
    extraTimer.stop();
  }
  elements.extraTimerDiv.style.display = "none";
} //hideExtraTimer

function startExtraTimer() {
  let timerValue = parseFloat(elements.extraTimerMins.value) * 60;
  if (isNaN(timerValue) || timerValue == 0) {
    return;
  }

  extraTimer = new easytimer.Timer();
  extraTimer.addEventListener("secondTenthsUpdated", function (e) {
    document.querySelector("#extraCountdown .values").innerHTML = extraTimer.getTimeValues().toString(["minutes", "seconds", "secondTenths"]);
  });
  extraTimer.addEventListener("targetAchieved", function (e) {
    elements.extraCountdown.style.display = "none";
    elements.unpauseExtraTimer.style.display = "none";
    elements.pauseExtraTimer.style.display = "none";
    elements.stopExtraTimer.style.display = "none";
    elements.startExtraTimer.style.display = "";
    extraTimer.reset();
    extraTimer.stop();
  });

  document.querySelector("#extraCountdown .values").innerHTML = extraTimer.getTimeValues().toString(["minutes", "seconds", "secondTenths"]);
  elements.extraCountdown.style.display = "";
  elements.pauseExtraTimer.style.display = "";
  elements.stopExtraTimer.style.display = "";
  elements.startExtraTimer.style.display = "none";

  extraTimer.start({
    countdown: true,
    precision: "secondTenths",
    startValues: {
      seconds: timerValue,
    },
  });
} //startExtraTimer

function pauseExtraTimer() {
  if (!extraTimer.isRunning()) {
    return;
  }
  extraTimer.pause();
  elements.pauseExtraTimer.style.display = "none";
  elements.unpauseExtraTimer.style.display = "";
} //pauseExtraTimer

function unpauseExtraTimer() {
  if (!extraTimer.isPaused()) {
    return;
  }
  extraTimer.start();
  elements.pauseExtraTimer.style.display = "";
  elements.unpauseExtraTimer.style.display = "none";
} //unpauseExtraTimer

function stopExtraTimer() {
  extraTimer.reset();
  extraTimer.stop();
  elements.extraCountdown.style.display = "none";
  elements.startExtraTimer.style.display = "";
  elements.pauseExtraTimer.style.display = "none";
  elements.stopExtraTimer.style.display = "none";
  elements.unpauseExtraTimer.style.display = "none";
} //stopExtraTimer

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
  if (USER.twitchLogin) {
    if (!(await checkToken(USER.access_token))) {
      USER.channel = "";
      loginExpiredModal.show();
      return;
    }
    elements.announceWinner.disabled = false;
    elements.confirmJoin.disabled = false;
    document.querySelectorAll(".no-twitch-warn").forEach((e) => (e.style.display = "none"));
  } else {
    elements.announceWinner.disabled = true;
    elements.confirmJoin.disabled = true;
    elements.announceWinner.checked = false;
    elements.confirmJoin.checked = false;
    document.querySelectorAll(".no-twitch-warn").forEach((e) => (e.style.display = "block"));
  }
  if (USER.channel) {
    connect();
  }
} //loadAndConnect

function splitTiers(split) {
  if (split) {
    elements.subsRow.style.display = "none";
    elements.tier1Row.style.display = "";
    elements.tier2Row.style.display = "";
    elements.tier3Row.style.display = "";
  } else {
    elements.subsRow.style.display = "";
    elements.tier1Row.style.display = "none";
    elements.tier2Row.style.display = "none";
    elements.tier3Row.style.display = "none";
  }
} //splitTiers

function toggleEveryone(allow) {
  elements.allowPlebs.checked = allow;
  elements.allowFollowers.checked = allow;
  elements.allowSubs.checked = allow;
  elements.allowTier1.checked = allow;
  elements.allowTier2.checked = allow;
  elements.allowTier3.checked = allow;
  elements.allowMods.checked = allow;
  elements.allowVips.checked = allow;
  elements.allowFirstTimeChatters.checked = allow;
} //toggleEveryone

function updateWhoCanJoin() {
  let roles = {
    "Non subscribers": { allowed: RAFFLES.allowPlebs, tickets: 1 + RAFFLES.plebBonus },
    "Tier 1 subscribers": { allowed: RAFFLES.allowTier1, tickets: 1 + RAFFLES.tier1Bonus },
    "Tier 2 subscribers": { allowed: RAFFLES.allowTier2, tickets: 1 + RAFFLES.tier2Bonus },
    "Tier 3 subscribers": { allowed: RAFFLES.allowTier3, tickets: 1 + RAFFLES.tier3Bonus },
    Subscribers: { allowed: RAFFLES.allowSubs, tickets: 1 + RAFFLES.subBonus },
    Mods: { allowed: RAFFLES.allowMods, tickets: 1 + RAFFLES.modBonus },
    VIPs: { allowed: RAFFLES.allowVips, tickets: 1 + RAFFLES.vipBonus },
    "First time chatters": { allowed: RAFFLES.allowFirstTimeChatters, tickets: 1 + RAFFLES.firstTimeChatterBonus },
  };

  document.querySelector("#plebBadge > div").classList = RAFFLES.allowPlebs ? "role-allowed" : "role-not-allowed";
  document.querySelector("#subBadge > div").classList =
    (!RAFFLES.splitTiers && RAFFLES.allowSubs) || (RAFFLES.splitTiers && (RAFFLES.allowTier1 || RAFFLES.allowTier2 || RAFFLES.allowTier3)) ? "role-allowed" : "role-not-allowed";
  document.querySelector("#modBadge > div").classList = RAFFLES.allowMods ? "role-allowed" : "role-not-allowed";
  document.querySelector("#vipBadge > div").classList = RAFFLES.allowVips ? "role-allowed" : "role-not-allowed";
  document.querySelector("#firstmsgBadge > div").classList = RAFFLES.allowFirstTimeChatters ? "role-allowed" : "role-not-allowed";

  let allowed = [];
  let tickets = [];
  let totalBonus = 0;
  let numberOfRoles;
  for (let [key, value] of Object.entries(roles)) {
    if (value.allowed) {
      if (RAFFLES.splitTiers && key == "Subscribers") {
        numberOfRoles = 7;
        continue;
      }
      if (!RAFFLES.splitTiers && (key == "Tier 1 subscribers" || key == "Tier 3 subscribers" || key == "Tier 2 subscribers")) {
        numberOfRoles = 5;
        continue;
      }
      allowed.push(key);
      tickets.push(`${key} will get ${value.tickets} ${value.tickets == 1 ? "ticket" : "tickets"}`);
      totalBonus += value.tickets - 1;
    }
  }

  if (allowed.length == 0) {
    elements.whoCanJoin.innerHTML = `<span class="text-danger">No one will be able to join the raffle</span>`;
    return;
  }
  elements.whoCanJoin.innerHTML = `${allowed.length == 1 ? "Only" : ""} ${numberOfRoles == allowed.length ? "Everyone" : allowed.join(", ")} will be able to join the raffle.<br>
  ${totalBonus == 0 ? "Everyone will get 1 ticket." : tickets.join(" - ")}`;
} //updateWhoCanJoin

let joinedUsers = [];
setInterval(() => {
  if (RAFFLES.confirmJoin && joinedUsers.length > 0) {
    botSay(joinedUsers, true);
    joinedUsers = [];
  }
}, 1000);

window.onload = function () {
  darkTheme = (localStorage.getItem("darkTheme") || "true") === "true";
  elements.darkTheme.checked = darkTheme ?? true;
  switchTheme(elements.darkTheme.checked);

  loadAndConnect();
  rafflePopover = new bootstrap.Popover(elements.enableRaffle);

  if (!USER.channel) {
    loginButton = new bootstrap.Popover(elements.loginButton);
  }

  resetSettingsModal = new bootstrap.Modal(elements.resetSettingsModal);
  loginExpiredModal = new bootstrap.Modal(elements.loginExpiredModal);
  restartRaffleModal = new bootstrap.Modal(elements.restartRaffleModal);
  fancyRaffleModal = new bootstrap.Modal(elements.fancyRaffleModal);

  settingsOffcanvas = new bootstrap.Offcanvas(elements.settingsOffcanvas);

  elements.settingsOffcanvas.addEventListener("hide.bs.offcanvas", function () {
    saveSettings();
  });

  enableTooltips();
  enablePopovers();

  elements.enableRaffle.addEventListener("click", function () {
    if (raffle_open) {
      disableRaffleButton();
    } else {
      enableRaffleButton();
      changeSiteLinkTarget("_blank");
    }
  });

  elements.channelName.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      connect();
    }
  });
  elements.raffleCommand.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      saveSettings();
    }
  });
  elements.raffleTitle.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      elements.raffleTitle.blur();
    }
  });
  elements.raffleTitle.addEventListener("input", (event) => {
    if (!event.target.innerText) {
      elements.titleHint.style.display = "";
    } else {
      elements.titleHint.style.display = "none";
    }
  });

  elements.titleHint.addEventListener("click", (event) => {
    elements.raffleTitle.focus();
  });

  elements.selectAll.addEventListener("click", (event) => {
    toggleEveryone(true);
    saveSettings();
  });
  elements.unselectAll.addEventListener("click", (event) => {
    toggleEveryone(false);
    saveSettings();
  });

  elements.darkTheme.onchange = function () {
    switchTheme(this.checked);
    saveSettings();
  };

  elements.splitTiers.onchange = function () {
    splitTiers(this.checked);
    saveSettings();
  };

  elements.autoRerollEnabled.onchange = function () {
    elements.rerollTimerValueMinutes.disabled = !this.checked;
    saveSettings();
  };

  elements.extraTimerEnabled.onchange = function () {
    saveSettings();
    if (this.checked) {
      showExtraTimer();
    } else {
      hideExtraTimer();
    }
  };

  elements.linkPreviewThumbnailsEnabled.onchange = function () {
    saveSettings();
    const tooltipTriggerList = document.querySelectorAll("a.linktooltip");
    const tooltipList = [...tooltipTriggerList].map(function (tooltipTriggerEl) {
      tooltipTriggerEl.setAttribute("data-bs-title", spinner);
      tooltipTriggerEl.addEventListener("show.bs.tooltip", function () {
        getLinkInfo(tooltipTriggerEl, RAFFLES.linkPreviewThumbnailsEnabled);
      });
      return new bootstrap.Tooltip(tooltipTriggerEl, {
        animation: false,
        html: true,
        delay: { show: 200, hide: 0 },
        trigger: "hover",
      });
    });
  };

  tickSound = new Howl({
    src: ["/raffles/tick.mp3"],
  });
  revealSound = new Howl({
    src: ["/raffles/reveal.mp3"],
  });

  const placeholders = ["Wife giveaway 💿", "Winner gets VIP", "Sub emote raffle", "Steam key giveaway", "Gifted sub giveaway", "eg giveaway 🥚"];
  setInterval(() => {
    elements.raffleTitle.classList.add("active");
    setTimeout(() => {
      elements.raffleTitle.setAttribute("data-placeholder", placeholders[Math.floor(Math.random() * placeholders.length)]);
      elements.raffleTitle.classList.remove("active");
    }, 200);
  }, 3000);
}; //onload

window.onbeforeunload = function () {
  if (RAFFLES.refreshWarningEnabled && raffle_users.length > 0) {
    return "Close/refresh warning enabled. You can turn it off in the settings";
  }
  return null;
}; //onbeforeunload
