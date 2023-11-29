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
  playlistCommand: document.getElementById("playlistCommand"),
  playlistCommandAlias: document.getElementById("playlistCommandAlias"),
  approvalQueue: document.getElementById("approvalQueue"),
  skipCommand: document.getElementById("skipCommand"),
  modSkip: document.getElementById("modSkip"),
  minViewCount: document.getElementById("minViewCount"),

  //main
  toastContainer: document.getElementById("toastContainer"),
  playersCard: document.getElementById("playersCard"),
  commandHint: document.getElementById("commandHint"),
  togglePlaylist: document.getElementById("togglePlaylist"),
  togglePlaylistLabel: document.getElementById("togglePlaylistLabel"),
  resetPlaylist: document.getElementById("resetPlaylist"),
  link: document.getElementById("link"),
  addLink: document.getElementById("addLink"),

  //playlist
  playlistTab: document.getElementById("playlistTab"),
  approvalTabButton: document.getElementById("approvalTabButton"),
  approvalTab: document.getElementById("approvalTab"),
  mainList: document.getElementById("mainList"),
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
let playlistTab, approvalTab, historyTab;
let playlist_open = false;

let USER = {
  channel: "",
  twitchLogin: false,
  access_token: "",
  userID: "",
  platform: "",
};

let PLAYLIST = {
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
  playlistCommand: "!playlist",
  playlistCommandAlias: "!pl",
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

  PLAYLIST.allowSpotifySongs = elements.allowSpotifySongs.checked;
  PLAYLIST.allowTwitchClips = elements.allowTwitchClips.checked;
  PLAYLIST.allowTwitchStreams = elements.allowTwitchStreams.checked;
  PLAYLIST.allowTwitchVODs = elements.allowTwitchVODs.checked;
  PLAYLIST.allowYTStreams = elements.allowYTStreams.checked;
  PLAYLIST.allowYTShorts = elements.allowYTShorts.checked;
  PLAYLIST.allowYTVideos = elements.allowYTVideos.checked;
  PLAYLIST.maxDuration = parseInt(elements.maxDuration.value, 10) || "";
  PLAYLIST.maxDurationUnit = elements.maxDurationUnit.value || "m";
  PLAYLIST.maxLength = parseInt(elements.maxLength.value, 10) || "";
  PLAYLIST.maxSize = parseInt(elements.maxSize.value, 10) || "";
  PLAYLIST.allowPlebs = elements.allowPlebs.checked;
  PLAYLIST.allowSubs = elements.allowSubs.checked;
  PLAYLIST.allowMods = elements.allowMods.checked;
  PLAYLIST.allowVips = elements.allowVips.checked;
  PLAYLIST.allowFirstTimeChatters = elements.allowFirstTimeChatters.checked;
  PLAYLIST.plebLimit = parseInt(elements.plebLimit.value, 10) || 1;
  PLAYLIST.subLimit = parseInt(elements.subLimit.value, 10) || 1;
  PLAYLIST.modLimit = parseInt(elements.modLimit.value, 10) || 1;
  PLAYLIST.vipLimit = parseInt(elements.vipLimit.value, 10) || 1;
  PLAYLIST.firstTimeChatterLimit = parseInt(elements.firstTimeChatterLimit.value, 10) || 1;
  PLAYLIST.noCommand = elements.noCommand.checked;
  PLAYLIST.requestCommand = elements.requestCommand.value.replace(/\s+/g, "").toLowerCase() || "!request";
  PLAYLIST.requestCommandAlias = elements.requestCommandAlias.value.replace(/\s+/g, "").toLowerCase() || "!r";
  PLAYLIST.allowVoteSkip = elements.allowVoteSkip.checked;
  PLAYLIST.voteskipCommand = elements.voteskipCommand.value.replace(/\s+/g, "").toLowerCase() || "!voteskip";
  PLAYLIST.voteskipCommandAlias = elements.voteskipCommandAlias.value.replace(/\s+/g, "").toLowerCase() || "!vs";
  PLAYLIST.voteskipCount = parseInt(elements.voteskipCount.value, 10) || 1;
  PLAYLIST.enableBot = elements.enableBot.checked;
  PLAYLIST.botCooldown = parseInt(elements.botCooldown.value, 10) || 1;
  PLAYLIST.songCommand = elements.songCommand.value.replace(/\s+/g, "").toLowerCase() || "!song";
  PLAYLIST.songCommandAlias = elements.songCommandAlias.value.replace(/\s+/g, "").toLowerCase() || "!s";
  PLAYLIST.playlistCommand = elements.playlistCommand.value.replace(/\s+/g, "").toLowerCase() || "!playlist";
  PLAYLIST.playlistCommandAlias = elements.playlistCommandAlias.value.replace(/\s+/g, "").toLowerCase() || "!pl";
  PLAYLIST.approvalQueue = elements.approvalQueue.checked;
  PLAYLIST.skipCommand = elements.skipCommand.value.replace(/\s+/g, "").toLowerCase() || "!skip";
  PLAYLIST.modSkip = elements.modSkip.checked;
  PLAYLIST.minViewCount = parseInt(elements.minViewCount.value, 10) || "";

  elements.voteskipCommand.disabled = !PLAYLIST.allowVoteSkip;
  elements.voteskipCommandAlias.disabled = !PLAYLIST.allowVoteSkip;
  elements.voteskipCount.disabled = !PLAYLIST.allowVoteSkip;
  elements.botCooldown.disabled = !PLAYLIST.enableBot;
  elements.songCommand.disabled = !PLAYLIST.enableBot;
  elements.songCommandAlias.disabled = !PLAYLIST.enableBot;
  elements.playlistCommand.disabled = !PLAYLIST.enableBot;
  elements.playlistCommandAlias.disabled = !PLAYLIST.enableBot;

  elements.approvalTabButton.style.display = PLAYLIST.approvalQueue ? "" : "none";

  if (PLAYLIST.noCommand) {
    elements.commandHint.innerHTML = `Add songs or videos to the playlist by posting a link in chat`;
  } else {
    elements.commandHint.innerHTML = `Add songs or videos to the playlist using 
    <kbd class="notranslate text-success cursor-pointer" onclick="editRequestCommand()">${PLAYLIST.requestCommand}</kbd> or 
    <kbd class="notranslate text-success cursor-pointer" onclick="editRequestCommand(true)">${PLAYLIST.requestCommandAlias}</kbd>`;
  }

  updateWhoCanRequest();
  checkCommands();
} //refreshdata

function saveSettings() {
  refreshData();
  localStorage.setItem("USER", JSON.stringify(USER));
  localStorage.setItem("PLAYLIST", JSON.stringify(PLAYLIST));
  localStorage.setItem("darkTheme", darkTheme);
} //saveSettings

function load_localStorage() {
  if (!localStorage.getItem("USER")) {
    console.log("localStorage user info not found");
  } else {
    USER = JSON.parse(localStorage.getItem("USER"));
    elements.channelName.value = USER.channel;
  }

  if (!localStorage.getItem("PLAYLIST")) {
    console.log("localStorage settings not found");
  } else {
    PLAYLIST = JSON.parse(localStorage.getItem("PLAYLIST"));

    elements.allowSpotifySongs.checked = PLAYLIST.allowSpotifySongs ?? true;
    elements.allowTwitchClips.checked = PLAYLIST.allowTwitchClips ?? true;
    elements.allowTwitchStreams.checked = PLAYLIST.allowTwitchStreams ?? true;
    elements.allowTwitchVODs.checked = PLAYLIST.allowTwitchVODs ?? true;
    elements.allowYTStreams.checked = PLAYLIST.allowYTStreams ?? true;
    elements.allowYTShorts.checked = PLAYLIST.allowYTShorts ?? true;
    elements.allowYTVideos.checked = PLAYLIST.allowYTVideos ?? true;
    elements.maxDuration.value = PLAYLIST.maxDuration || "";
    elements.maxDurationUnit.value = PLAYLIST.maxDurationUnit || "m";
    elements.maxLength.value = PLAYLIST.maxLength || "";
    elements.maxSize.value = PLAYLIST.maxSize || "";
    elements.allowPlebs.checked = PLAYLIST.allowPlebs ?? true;
    elements.allowSubs.checked = PLAYLIST.allowSubs ?? true;
    elements.allowMods.checked = PLAYLIST.allowMods ?? true;
    elements.allowVips.checked = PLAYLIST.allowVips ?? true;
    elements.allowFirstTimeChatters.checked = PLAYLIST.allowFirstTimeChatters ?? true;
    elements.plebLimit.value = PLAYLIST.plebLimit || 1;
    elements.subLimit.value = PLAYLIST.subLimit || 1;
    elements.modLimit.value = PLAYLIST.modLimit || 1;
    elements.vipLimit.value = PLAYLIST.vipLimit || 1;
    elements.firstTimeChatterLimit.value = PLAYLIST.firstTimeChatterLimit || 1;
    elements.noCommand.checked = PLAYLIST.noCommand ?? false;
    elements.requestCommand.value = PLAYLIST.requestCommand || "!request";
    elements.requestCommandAlias.value = PLAYLIST.requestCommandAlias || "!r";
    elements.allowVoteSkip.checked = PLAYLIST.allowVoteSkip ?? false;
    elements.voteskipCommand.value = PLAYLIST.voteskipCommand || "!voteskip";
    elements.voteskipCommandAlias.value = PLAYLIST.voteskipCommandAlias || "!vs";
    elements.voteskipCount.value = PLAYLIST.voteskipCount || 1;
    elements.enableBot.checked = PLAYLIST.enableBot ?? false;
    elements.botCooldown.value = PLAYLIST.botCooldown || 1;
    elements.songCommand.value = PLAYLIST.songCommand || "!song";
    elements.songCommandAlias.value = PLAYLIST.songCommandAlias || "!s";
    elements.playlistCommand.value = PLAYLIST.playlistCommand || "!playlist";
    elements.playlistCommandAlias.value = PLAYLIST.playlistCommandAlias || "!pl";
    elements.approvalQueue.checked = PLAYLIST.approvalQueue ?? false;
    elements.skipCommand.value = PLAYLIST.skipCommand || "!skip";
    elements.modSkip.checked = PLAYLIST.modSkip ?? false;
    elements.minViewCount.value = PLAYLIST.minViewCount || "";

    elements.voteskipCommand.disabled = !PLAYLIST.allowVoteSkip;
    elements.voteskipCommandAlias.disabled = !PLAYLIST.allowVoteSkip;
    elements.voteskipCount.disabled = !PLAYLIST.allowVoteSkip;
    elements.botCooldown.disabled = !PLAYLIST.enableBot;
    elements.songCommand.disabled = !PLAYLIST.enableBot;
    elements.songCommandAlias.disabled = !PLAYLIST.enableBot;
    elements.playlistCommand.disabled = !PLAYLIST.enableBot;
    elements.playlistCommandAlias.disabled = !PLAYLIST.enableBot;

    elements.approvalTabButton.style.display = PLAYLIST.approvalQueue ? "" : "none";

    if (PLAYLIST.noCommand) {
      elements.commandHint.innerHTML = `Add songs or videos to the playlist by posting a link in chat`;
    } else {
      elements.commandHint.innerHTML = `Add songs or videos to the playlist using 
      <kbd class="notranslate text-success cursor-pointer" onclick="editRequestCommand()">${PLAYLIST.requestCommand}</kbd> or 
      <kbd class="notranslate text-success cursor-pointer" onclick="editRequestCommand(true)">${PLAYLIST.requestCommandAlias}</kbd>`;
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
    "PLAYLIST",
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
      playlistCommand: "!playlist",
      playlistCommandAlias: "!pl",
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
    "Non subscribers": { allowed: PLAYLIST.allowPlebs, limit: PLAYLIST.plebLimit },
    Subscribers: { allowed: PLAYLIST.allowSubs, limit: PLAYLIST.subLimit },
    Mods: { allowed: PLAYLIST.allowMods, limit: PLAYLIST.modLimit },
    VIPs: { allowed: PLAYLIST.allowVips, limit: PLAYLIST.vipLimit },
    "First time chatters": { allowed: PLAYLIST.allowFirstTimeChatters, limit: PLAYLIST.firstTimeChatterLimit },
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
    elements.playlistCommand,
    elements.playlistCommandAlias,
    elements.skipCommand,
  ];

  let commands = commandElements.map((e) => e.value.replace(/\s+/g, "").toLowerCase());
  let duplicateCommands = commands.filter((element, index) => commands.indexOf(element.replace(/\s+/g, "").toLowerCase()) !== index);
  let duplicateElements = commandElements.filter((element) => duplicateCommands.includes(element.value.replace(/\s+/g, "").toLowerCase()));

  let warn = false;

  for (let index = 0; index < duplicateElements.length; index++) {
    duplicateElements[index].value = duplicateElements[index].dataset.default;
    PLAYLIST[duplicateElements[index].id] = duplicateElements[index].dataset.default;
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

  playlistTab = new bootstrap.Tab(elements.playlistTab);
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
      playlistTab.show();
    }
  };

  elements.togglePlaylist.onchange = function () {
    playlist_open = this.checked;
    if (this.checked) {
      elements.togglePlaylistLabel.classList = "btn btn-lg btn-danger";
      elements.togglePlaylistLabel.innerHTML = `Close<br>Playlist`;
    } else {
      elements.togglePlaylistLabel.classList = "btn btn-lg btn-success";
      elements.togglePlaylistLabel.innerHTML = `Open<br>Playlist`;
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
