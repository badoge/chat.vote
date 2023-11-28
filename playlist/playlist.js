let elements = {
  //modals
  loginExpiredModal: document.getElementById("loginExpiredModal"),
  resetSettingsModal: document.getElementById("resetSettingsModal"),

  //navbar
  vtsLink: document.getElementById("vtsLink"),
  status: document.getElementById("status"),
  topRight: document.getElementById("topRight"),
  loginButton: document.getElementById("loginButton"),
  channelName: document.getElementById("channelName"),
  darkTheme: document.getElementById("darkTheme"),

  //settings
  settingsOffcanvas: document.getElementById("settingsOffcanvas"),
  allowSpotifySongs: document.getElementById("allowSpotifySongs"),
  allowTwitchClips: document.getElementById("allowTwitchClips"),
  allowTwitchStreams: document.getElementById("allowTwitchStreams"),
  allowTwitchVODs: document.getElementById("allowTwitchVODs"),
  allowYTStreams: document.getElementById("allowYTStreams"),
  allowYTShorts: document.getElementById("allowYTShorts"),
  allowYTVideos: document.getElementById("allowYTVideos"),
  maxDuration: document.getElementById("maxDuration"),
  maxDurationUnit: document.getElementById("maxDurationUnit"),
  maxLength: document.getElementById("maxLength"),
  maxSize: document.getElementById("maxSize"),
  whoCanRequest: document.getElementById("whoCanRequest"),
  allowPlebs: document.getElementById("allowPlebs"),
  allowSubs: document.getElementById("allowSubs"),
  allowMods: document.getElementById("allowMods"),
  allowVips: document.getElementById("allowVips"),
  allowFirstTimeChatters: document.getElementById("allowFirstTimeChatters"),
  plebLimit: document.getElementById("plebLimit"),
  subLimit: document.getElementById("subLimit"),
  modLimit: document.getElementById("modLimit"),
  vipLimit: document.getElementById("vipLimit"),
  firstTimeChatterLimit: document.getElementById("firstTimeChatterLimit"),
  selectAll: document.getElementById("selectAll"),
  unselectAll: document.getElementById("unselectAll"),
  noCommand: document.getElementById("noCommand"),
  requestCommand: document.getElementById("requestCommand"),
  requestCommandAlias: document.getElementById("requestCommandAlias"),
  allowVoteSkip: document.getElementById("allowVoteSkip"),
  voteskipCommand: document.getElementById("voteskipCommand"),
  voteskipCommandAlias: document.getElementById("voteskipCommandAlias"),
  voteskipCount: document.getElementById("voteskipCount"),
  enableBot: document.getElementById("enableBot"),
  botCooldown: document.getElementById("botCooldown"),
  songCommand: document.getElementById("songCommand"),
  songCommandAlias: document.getElementById("songCommandAlias"),
  queueCommand: document.getElementById("queueCommand"),
  queueCommandAlias: document.getElementById("queueCommandAlias"),
  approvalQueue: document.getElementById("approvalQueue"),
  skipCommand: document.getElementById("skipCommand"),
  modSkip: document.getElementById("modSkip"),
  minViewCount: document.getElementById("minViewCount"),

  //main
  toastContainer: document.getElementById("toastContainer"),
  playersCard: document.getElementById("playersCard"),
  commandHint: document.getElementById("commandHint"),
  toggleQueue: document.getElementById("toggleQueue"),
  toggleQueueLabel: document.getElementById("toggleQueueLabel"),
  resetQueue: document.getElementById("resetQueue"),
  link: document.getElementById("link"),
  addLink: document.getElementById("addLink"),

  //queue
  queue: document.getElementById("queue"),
  queueTab: document.getElementById("queueTab"),
  approvalTabButton: document.getElementById("approvalTabButton"),
  approvalTab: document.getElementById("approvalTab"),
  queueList: document.getElementById("queueList"),
  approvalList: document.getElementById("approvalList"),
  historyTab: document.getElementById("historyTab"),
  historyList: document.getElementById("historyList"),

  //bottom row
  profileLink: document.getElementById("profileLink"),
  copyLinkButton: document.getElementById("copyLinkButton"),
  volumeSliderIcon: document.getElementById("volumeSliderIcon"),
  volumeSlider: document.getElementById("volumeSlider"),
  volumeSliderValue: document.getElementById("volumeSliderValue"),
};

let client;
let color = "";
let currentTime = 0;
let loginButton;
let settingsOffcanvas;
let loginExpiredModal, resetSettingsModal;
let copyLinkButton;
let queueTab, approvalTab, historyTab;
let queue_open = false;

let USER = {
  channel: "",
  twitchLogin: false,
  access_token: "",
  userID: "",
  platform: "",
};

let QUEUE = {
  allowSpotifySongs: true,
  allowTwitchClips: true,
  allowTwitchStreams: true,
  allowTwitchVODs: true,
  allowYTStreams: true,
  allowYTShorts: true,
  allowYTVideos: true,
  maxDuration: "",
  maxDurationUnit: "m",
  maxLength: "",
  maxSize: "",
  allowPlebs: true,
  allowSubs: true,
  allowMods: true,
  allowVips: true,
  allowFirstTimeChatters: true,
  plebLimit: 1,
  subLimit: 1,
  modLimit: 1,
  vipLimit: 1,
  firstTimeChatterLimit: 1,
  noCommand: false,
  requestCommand: "!request",
  requestCommandAlias: "!r",
  allowVoteSkip: false,
  voteskipCommand: "!voteskip",
  voteskipCommandAlias: "!vs",
  voteskipCount: 1,
  enableBot: false,
  botCooldown: 1,
  songCommand: "!song",
  songCommandAlias: "!s",
  queueCommand: "!queue",
  queueCommandAlias: "!q",
  approvalQueue: false,
  skipCommand: "!skip",
  modSkip: false,
  minViewCount: "",
};

async function refreshData() {
  darkTheme = elements.darkTheme.checked ?? true;
  if (!USER.twitchLogin) {
    USER.channel = validator.escape(elements.channelName.value.replace(/\s+/g, "").toLowerCase());
    USER.platform = "twitch";
  }
  if (!USER.userID && USER.channel) {
    USER.userID = await getUserID(USER.channel);
  }

  QUEUE.allowSpotifySongs = elements.allowSpotifySongs.checked;
  QUEUE.allowTwitchClips = elements.allowTwitchClips.checked;
  QUEUE.allowTwitchStreams = elements.allowTwitchStreams.checked;
  QUEUE.allowTwitchVODs = elements.allowTwitchVODs.checked;
  QUEUE.allowYTStreams = elements.allowYTStreams.checked;
  QUEUE.allowYTShorts = elements.allowYTShorts.checked;
  QUEUE.allowYTVideos = elements.allowYTVideos.checked;
  QUEUE.maxDuration = parseInt(elements.maxDuration.value, 10) || "";
  QUEUE.maxDurationUnit = elements.maxDurationUnit.value || "m";
  QUEUE.maxLength = parseInt(elements.maxLength.value, 10) || "";
  QUEUE.maxSize = parseInt(elements.maxSize.value, 10) || "";
  QUEUE.allowPlebs = elements.allowPlebs.checked;
  QUEUE.allowSubs = elements.allowSubs.checked;
  QUEUE.allowMods = elements.allowMods.checked;
  QUEUE.allowVips = elements.allowVips.checked;
  QUEUE.allowFirstTimeChatters = elements.allowFirstTimeChatters.checked;
  QUEUE.plebLimit = parseInt(elements.plebLimit.value, 10) || 1;
  QUEUE.subLimit = parseInt(elements.subLimit.value, 10) || 1;
  QUEUE.modLimit = parseInt(elements.modLimit.value, 10) || 1;
  QUEUE.vipLimit = parseInt(elements.vipLimit.value, 10) || 1;
  QUEUE.firstTimeChatterLimit = parseInt(elements.firstTimeChatterLimit.value, 10) || 1;
  QUEUE.noCommand = elements.noCommand.checked;
  QUEUE.requestCommand = elements.requestCommand.value.replace(/\s+/g, "").toLowerCase() || "!request";
  QUEUE.requestCommandAlias = elements.requestCommandAlias.value.replace(/\s+/g, "").toLowerCase() || "!r";
  QUEUE.allowVoteSkip = elements.allowVoteSkip.checked;
  QUEUE.voteskipCommand = elements.voteskipCommand.value.replace(/\s+/g, "").toLowerCase() || "!voteskip";
  QUEUE.voteskipCommandAlias = elements.voteskipCommandAlias.value.replace(/\s+/g, "").toLowerCase() || "!vs";
  QUEUE.voteskipCount = parseInt(elements.voteskipCount.value, 10) || 1;
  QUEUE.enableBot = elements.enableBot.checked;
  QUEUE.botCooldown = parseInt(elements.botCooldown.value, 10) || 1;
  QUEUE.songCommand = elements.songCommand.value.replace(/\s+/g, "").toLowerCase() || "!song";
  QUEUE.songCommandAlias = elements.songCommandAlias.value.replace(/\s+/g, "").toLowerCase() || "!s";
  QUEUE.queueCommand = elements.queueCommand.value.replace(/\s+/g, "").toLowerCase() || "!queue";
  QUEUE.queueCommandAlias = elements.queueCommandAlias.value.replace(/\s+/g, "").toLowerCase() || "!q";
  QUEUE.approvalQueue = elements.approvalQueue.checked;
  QUEUE.skipCommand = elements.skipCommand.value.replace(/\s+/g, "").toLowerCase() || "!skip";
  QUEUE.modSkip = elements.modSkip.checked;
  QUEUE.minViewCount = parseInt(elements.minViewCount.value, 10) || "";

  elements.voteskipCommand.disabled = !QUEUE.allowVoteSkip;
  elements.voteskipCommandAlias.disabled = !QUEUE.allowVoteSkip;
  elements.voteskipCount.disabled = !QUEUE.allowVoteSkip;
  elements.botCooldown.disabled = !QUEUE.enableBot;
  elements.songCommand.disabled = !QUEUE.enableBot;
  elements.songCommandAlias.disabled = !QUEUE.enableBot;
  elements.queueCommand.disabled = !QUEUE.enableBot;
  elements.queueCommandAlias.disabled = !QUEUE.enableBot;

  elements.approvalTabButton.style.display = QUEUE.approvalQueue ? "" : "none";

  if (QUEUE.noCommand) {
    elements.commandHint.innerHTML = `Add songs or videos to the queue by posting a link in chat`;
  } else {
    elements.commandHint.innerHTML = `Add songs or videos to the queue using 
    <kbd class="notranslate text-success cursor-pointer" onclick="editRequestCommand()">${QUEUE.requestCommand}</kbd> or 
    <kbd class="notranslate text-success cursor-pointer" onclick="editRequestCommand(true)">${QUEUE.requestCommandAlias}</kbd>`;
  }

  updateWhoCanRequest();
  checkCommands();
} //refreshdata

function saveSettings() {
  refreshData();
  localStorage.setItem("USER", JSON.stringify(USER));
  localStorage.setItem("QUEUE", JSON.stringify(QUEUE));
  localStorage.setItem("darkTheme", darkTheme);
} //saveSettings

function load_localStorage() {
  if (!localStorage.getItem("USER")) {
    console.log("localStorage user info not found");
  } else {
    USER = JSON.parse(localStorage.getItem("USER"));
    elements.channelName.value = USER.channel;
  }

  if (!localStorage.getItem("QUEUE")) {
    console.log("localStorage settings not found");
  } else {
    QUEUE = JSON.parse(localStorage.getItem("QUEUE"));

    elements.allowSpotifySongs.checked = QUEUE.allowSpotifySongs ?? true;
    elements.allowTwitchClips.checked = QUEUE.allowTwitchClips ?? true;
    elements.allowTwitchStreams.checked = QUEUE.allowTwitchStreams ?? true;
    elements.allowTwitchVODs.checked = QUEUE.allowTwitchVODs ?? true;
    elements.allowYTStreams.checked = QUEUE.allowYTStreams ?? true;
    elements.allowYTShorts.checked = QUEUE.allowYTShorts ?? true;
    elements.allowYTVideos.checked = QUEUE.allowYTVideos ?? true;
    elements.maxDuration.value = QUEUE.maxDuration || "";
    elements.maxDurationUnit.value = QUEUE.maxDurationUnit || "m";
    elements.maxLength.value = QUEUE.maxLength || "";
    elements.maxSize.value = QUEUE.maxSize || "";
    elements.allowPlebs.checked = QUEUE.allowPlebs ?? true;
    elements.allowSubs.checked = QUEUE.allowSubs ?? true;
    elements.allowMods.checked = QUEUE.allowMods ?? true;
    elements.allowVips.checked = QUEUE.allowVips ?? true;
    elements.allowFirstTimeChatters.checked = QUEUE.allowFirstTimeChatters ?? true;
    elements.plebLimit.value = QUEUE.plebLimit || 1;
    elements.subLimit.value = QUEUE.subLimit || 1;
    elements.modLimit.value = QUEUE.modLimit || 1;
    elements.vipLimit.value = QUEUE.vipLimit || 1;
    elements.firstTimeChatterLimit.value = QUEUE.firstTimeChatterLimit || 1;
    elements.noCommand.checked = QUEUE.noCommand ?? false;
    elements.requestCommand.value = QUEUE.requestCommand || "!request";
    elements.requestCommandAlias.value = QUEUE.requestCommandAlias || "!r";
    elements.allowVoteSkip.checked = QUEUE.allowVoteSkip ?? false;
    elements.voteskipCommand.value = QUEUE.voteskipCommand || "!voteskip";
    elements.voteskipCommandAlias.value = QUEUE.voteskipCommandAlias || "!vs";
    elements.voteskipCount.value = QUEUE.voteskipCount || 1;
    elements.enableBot.checked = QUEUE.enableBot ?? false;
    elements.botCooldown.value = QUEUE.botCooldown || 1;
    elements.songCommand.value = QUEUE.songCommand || "!song";
    elements.songCommandAlias.value = QUEUE.songCommandAlias || "!s";
    elements.queueCommand.value = QUEUE.queueCommand || "!queue";
    elements.queueCommandAlias.value = QUEUE.queueCommandAlias || "!q";
    elements.approvalQueue.checked = QUEUE.approvalQueue ?? false;
    elements.skipCommand.value = QUEUE.skipCommand || "!skip";
    elements.modSkip.checked = QUEUE.modSkip ?? false;
    elements.minViewCount.value = QUEUE.minViewCount || "";

    elements.voteskipCommand.disabled = !QUEUE.allowVoteSkip;
    elements.voteskipCommandAlias.disabled = !QUEUE.allowVoteSkip;
    elements.voteskipCount.disabled = !QUEUE.allowVoteSkip;
    elements.botCooldown.disabled = !QUEUE.enableBot;
    elements.songCommand.disabled = !QUEUE.enableBot;
    elements.songCommandAlias.disabled = !QUEUE.enableBot;
    elements.queueCommand.disabled = !QUEUE.enableBot;
    elements.queueCommandAlias.disabled = !QUEUE.enableBot;

    elements.approvalTabButton.style.display = QUEUE.approvalQueue ? "" : "none";

    if (QUEUE.noCommand) {
      elements.commandHint.innerHTML = `Add songs or videos to the queue by posting a link in chat`;
    } else {
      elements.commandHint.innerHTML = `Add songs or videos to the queue using 
      <kbd class="notranslate text-success cursor-pointer" onclick="editRequestCommand()">${QUEUE.requestCommand}</kbd> or 
      <kbd class="notranslate text-success cursor-pointer" onclick="editRequestCommand(true)">${QUEUE.requestCommandAlias}</kbd>`;
    }

    updateWhoCanRequest();
    checkCommands();
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
    "QUEUE",
    JSON.stringify({
      allowSpotifySongs: true,
      allowTwitchClips: true,
      allowTwitchStreams: true,
      allowTwitchVODs: true,
      allowYTStreams: true,
      allowYTShorts: true,
      allowYTVideos: true,
      maxDuration: "",
      maxDurationUnit: "m",
      maxLength: "",
      maxSize: "",
      allowPlebs: true,
      allowSubs: true,
      allowMods: true,
      allowVips: true,
      allowFirstTimeChatters: true,
      plebLimit: 1,
      subLimit: 1,
      modLimit: 1,
      vipLimit: 1,
      firstTimeChatterLimit: 1,
      noCommand: false,
      requestCommand: "!request",
      requestCommandAlias: "!r",
      allowVoteSkip: false,
      voteskipCommand: "!voteskip",
      voteskipCommandAlias: "!vs",
      voteskipCount: 1,
      enableBot: false,
      botCooldown: 1,
      songCommand: "!song",
      songCommandAlias: "!s",
      queueCommand: "!queue",
      queueCommandAlias: "!q",
      approvalQueue: false,
      skipCommand: "!skip",
      modSkip: false,
      minViewCount: "",
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
        <ul class="dropdown-menu dropdown-menu-lg-end" aria-label="Log out">
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
  <ul class="dropdown-menu dropdown-menu-lg-end" aria-label="Log out">
  <li><a class="dropdown-item" onclick="logout()" href="#"><i class="material-icons notranslate">logout</i>Log out</a></li>
  </ul>
  </div>
  </div>`;

  refreshData();
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
    let input = msg.split(" ").filter(Boolean);
    let command = input[0].toLowerCase();
    let args = input.slice(1);
  }); //message

  client.on("timeout", (channel, username, reason, duration, userstate) => {}); //timeout

  client.on("connected", async (address, port) => {
    console.log(`Connected to ${address}:${port}`);
    elements.status.innerHTML = `<h4><span class="badge bg-success">Connected :)</span></h4>`;
    saveSettings();
    sendUsername(`chat.vote/playlist`, USER.channel, USER.platform == "twitch" ? `twitch - ${USER.twitchLogin}` : "youtube");
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
      onclick="login()"
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
        <button type="button" onclick="connect()" class="btn btn-primary float-end">Connect</button>
      </div>
    </div>
  </div>
</div>`;
  resetSettings(true);
} //logout

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
    elements.profileLink.value = `https://playlist.chat.vote/${USER.channel || ""}`;
  }
} //loadAndConnect

function copyLink() {
  navigator.clipboard.writeText(`https://playlist.chat.vote/${USER.channel || ""}`);
  copyLinkButton.show();
  setTimeout(() => {
    copyLinkButton.hide();
  }, 1000);
} //copyLink

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

function toggleEveryone(allow) {
  elements.allowPlebs.checked = allow;
  elements.allowSubs.checked = allow;
  elements.allowMods.checked = allow;
  elements.allowVips.checked = allow;
  elements.allowFirstTimeChatters.checked = allow;
} //toggleEveryone

function updateWhoCanRequest() {
  let roles = {
    "Non subscribers": { allowed: QUEUE.allowPlebs, limit: QUEUE.plebLimit },
    Subscribers: { allowed: QUEUE.allowSubs, limit: QUEUE.subLimit },
    Mods: { allowed: QUEUE.allowMods, limit: QUEUE.modLimit },
    VIPs: { allowed: QUEUE.allowVips, limit: QUEUE.vipLimit },
    "First time chatters": { allowed: QUEUE.allowFirstTimeChatters, limit: QUEUE.firstTimeChatterLimit },
  };

  let allowed = [];
  let limit = [];
  let totalLimit = 0;
  for (let [key, value] of Object.entries(roles)) {
    if (value.allowed) {
      allowed.push(key);
      limit.push(`${key} can make ${value.limit} ${value.limit == 1 ? "request" : "requests"}`);
      totalLimit += value.limit - 1;
    }
  }

  if (allowed.length == 0) {
    elements.whoCanRequest.innerHTML = `<span class="text-danger">No one will be able to request</span>`;
    return;
  }
  elements.whoCanRequest.innerHTML = `${allowed.length == 1 ? "Only" : ""} ${allowed.length == 5 ? "Everyone" : allowed.join(", ")} will be able to request.<br>
  ${totalLimit == 0 ? "Everyone will get 1 request." : limit.join(" - ")}`;
} //updateWhoCanRequest

function checkCommands() {
  let commandElements = [
    elements.requestCommand,
    elements.requestCommandAlias,
    elements.voteskipCommand,
    elements.voteskipCommandAlias,
    elements.songCommand,
    elements.songCommandAlias,
    elements.queueCommand,
    elements.queueCommandAlias,
    elements.skipCommand,
  ];

  let commands = commandElements.map((e) => e.value.replace(/\s+/g, "").toLowerCase());
  let duplicateCommands = commands.filter((element, index) => commands.indexOf(element.replace(/\s+/g, "").toLowerCase()) !== index);
  let duplicateElements = commandElements.filter((element) => duplicateCommands.includes(element.value.replace(/\s+/g, "").toLowerCase()));

  let warn = false;

  for (let index = 0; index < duplicateElements.length; index++) {
    duplicateElements[index].value = duplicateElements[index].dataset.default;
    QUEUE[duplicateElements[index].id] = duplicateElements[index].dataset.default;
    warn = true;
  }

  if (warn) {
    showToast("Commands must be unique", "warning", 2000);
  }
} //checkCommands

function editRequestCommand(alias = false) {
  settingsOffcanvas.show();
  setTimeout(() => {
    if (alias) {
      elements.requestCommandAlias.focus();
      elements.requestCommandAlias.select();
    } else {
      elements.requestCommand.focus();
      elements.requestCommand.select();
    }
  }, 500);
} //editRequestCommand

let oldSliderValue;
function toggleMute() {
  if (elements.volumeSliderIcon.innerHTML == "volume_off") {
    if (oldSliderValue == 0) {
      elements.volumeSliderIcon.innerHTML = "volume_mute";
    }
    if (oldSliderValue > 0 && oldSliderValue < 50) {
      elements.volumeSliderIcon.innerHTML = "volume_down";
    }
    if (oldSliderValue >= 50) {
      elements.volumeSliderIcon.innerHTML = "volume_up";
    }

    elements.volumeSlider.value = oldSliderValue;
    elements.volumeSliderValue.innerHTML = oldSliderValue;
  } else {
    oldSliderValue = elements.volumeSlider.value;
    elements.volumeSliderIcon.innerHTML = "volume_off";
    elements.volumeSlider.value = 0;
    elements.volumeSliderValue.innerHTML = 0;
  }
} //toggleMute

function changeVolume(slider) {
  elements.volumeSliderValue.innerHTML = slider.value;
  if (slider.value == 0) {
    elements.volumeSliderIcon.innerHTML = "volume_mute";
  }
  if (slider.value > 0 && slider.value < 50) {
    elements.volumeSliderIcon.innerHTML = "volume_down";
  }
  if (slider.value >= 50) {
    elements.volumeSliderIcon.innerHTML = "volume_up";
  }
} //changeVolume

window.onload = function () {
  darkTheme = (localStorage.getItem("darkTheme") || "true") === "true";
  elements.darkTheme.checked = darkTheme ?? true;
  switchTheme(elements.darkTheme.checked);

  loadAndConnect();

  loginExpiredModal = new bootstrap.Modal(elements.loginExpiredModal);
  resetSettingsModal = new bootstrap.Modal(elements.resetSettingsModal);
  settingsOffcanvas = new bootstrap.Offcanvas(elements.settingsOffcanvas);
  copyLinkButton = new bootstrap.Popover(elements.copyLinkButton);

  queueTab = new bootstrap.Tab(elements.queueTab);
  approvalTab = new bootstrap.Tab(elements.approvalTab);
  historyTab = new bootstrap.Tab(elements.historyTab);

  if (!USER.channel) {
    loginButton = new bootstrap.Popover(elements.loginButton);
  }

  elements.darkTheme.onchange = function () {
    switchTheme(this.checked);
    saveSettings();
  };

  elements.approvalQueue.onchange = function () {
    saveSettings();
    if (elements.approvalTab.classList.contains("active")) {
      queueTab.show();
    }
  };

  elements.toggleQueue.onchange = function () {
    queue_open = this.checked;
    if (this.checked) {
      elements.toggleQueueLabel.classList = "btn btn-lg btn-danger";
      elements.toggleQueueLabel.innerHTML = `Close<br>Queue`;
    } else {
      elements.toggleQueueLabel.classList = "btn btn-lg btn-success";
      elements.toggleQueueLabel.innerHTML = `Open<br>Queue`;
    }
  };

  elements.selectAll.addEventListener("click", (event) => {
    toggleEveryone(true);
    saveSettings();
  });
  elements.unselectAll.addEventListener("click", (event) => {
    toggleEveryone(false);
    saveSettings();
  });

  enableTooltips();
  enablePopovers();
}; //onload
