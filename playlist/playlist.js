let elements = {
  //modals
  loginExpiredModal: document.getElementById("loginExpiredModal"),
  resetSettingsModal: document.getElementById("resetSettingsModal"),
  clearPlaylistModal: document.getElementById("clearPlaylistModal"),

  voteSkipDiv: document.getElementById("voteSkipDiv"),
  voteSkipHint: document.getElementById("voteSkipHint"),
  voteSkipVotes: document.getElementById("voteSkipVotes"),

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
  allowStreamable: document.getElementById("allowStreamable"),
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
  placeholder: document.getElementById("placeholder"),
  youtubeEmbedContainer: document.getElementById("youtubeEmbedContainer"),
  youtubeEmbed: document.getElementById("youtubeEmbed"),
  spotifyEmbedContainer: document.getElementById("spotifyEmbedContainer"),
  spotifyEmbed: document.getElementById("spotifyEmbed"),
  twitchEmbed: document.getElementById("twitchEmbed"),
  twitchClipsEmbed: document.getElementById("twitchClipsEmbed"),
  streamableEmbed: document.getElementById("streamableEmbed"),

  commandHint: document.getElementById("commandHint"),
  commandHint2: document.getElementById("commandHint2"),
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
  nowPlaying: document.getElementById("nowPlaying"),
  playlistLength: document.getElementById("playlistLength"),
  resetPlaylist: document.getElementById("resetPlaylist"),
  togglePlaylist: document.getElementById("togglePlaylist"),
  togglePlaylistLabel: document.getElementById("togglePlaylistLabel"),
  previousItem: document.getElementById("previousItem"),
  togglePlay: document.getElementById("togglePlay"),
  nextItem: document.getElementById("nextItem"),
  volumeSliderIcon: document.getElementById("volumeSliderIcon"),
  volumeSlider: document.getElementById("volumeSlider"),
  volumeSliderValue: document.getElementById("volumeSliderValue"),
};

let client;
let color = "";
let currentTime = 0;
let loginButton;
let settingsOffcanvas;
let loginExpiredModal, resetSettingsModal, clearPlaylistModal;
let copyLinkButton;
let playlistTab, approvalTab, historyTab;
let playlist_open = false;
let playlist_playing = false;
let total_duration = 0;
let togglePlaylistPopover;

let users = [];
let requests = [];
let history = [];
let firstTimeChatters = [];
let skippers = [];

let USER = {
  channel: "",
  twitchLogin: false,
  access_token: "",
  userID: "",
  platform: "",
};

let PLAYLIST = {
  allowSpotifySongs: true,
  allowStreamable: true,
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
  plebLimit: "",
  subLimit: "",
  modLimit: "",
  vipLimit: "",
  firstTimeChatterLimit: "",
  noCommand: false,
  requestCommand: "!request",
  requestCommandAlias: "!r",
  allowVoteSkip: false,
  voteskipCommand: "!voteskip",
  voteskipCommandAlias: "!vs",
  voteskipCount: 100,
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
  PLAYLIST.allowStreamable = elements.allowStreamable.checked;
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
  PLAYLIST.plebLimit = parseInt(elements.plebLimit.value, 10) || "";
  PLAYLIST.subLimit = parseInt(elements.subLimit.value, 10) || "";
  PLAYLIST.modLimit = parseInt(elements.modLimit.value, 10) || "";
  PLAYLIST.vipLimit = parseInt(elements.vipLimit.value, 10) || "";
  PLAYLIST.firstTimeChatterLimit = parseInt(elements.firstTimeChatterLimit.value, 10) || "";
  PLAYLIST.noCommand = elements.noCommand.checked;
  PLAYLIST.requestCommand = elements.requestCommand.value.replace(/\s+/g, "").toLowerCase() || "!request";
  PLAYLIST.requestCommandAlias = elements.requestCommandAlias.value.replace(/\s+/g, "").toLowerCase() || "!r";
  PLAYLIST.allowVoteSkip = elements.allowVoteSkip.checked;
  PLAYLIST.voteskipCommand = elements.voteskipCommand.value.replace(/\s+/g, "").toLowerCase() || "!voteskip";
  PLAYLIST.voteskipCommandAlias = elements.voteskipCommandAlias.value.replace(/\s+/g, "").toLowerCase() || "!vs";
  PLAYLIST.voteskipCount = parseInt(elements.voteskipCount.value, 10) || 100;
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

  elements.voteSkipHint.innerHTML = `<kbd>${PLAYLIST.voteskipCommand}</kbd> or <kbd>${PLAYLIST.voteskipCommandAlias}</kbd>`;

  if (PLAYLIST.noCommand) {
    elements.commandHint.innerHTML = `Add songs or videos to the playlist by posting a link in chat`;
    elements.commandHint2.innerHTML = `Request something by posting a link in chat`;
  } else {
    elements.commandHint.innerHTML = `Add songs or videos to the playlist using 
    <kbd class="notranslate text-success cursor-pointer" onclick="editRequestCommand()">${PLAYLIST.requestCommand} [link]</kbd> or 
    <kbd class="notranslate text-success cursor-pointer" onclick="editRequestCommand(true)">${PLAYLIST.requestCommandAlias} [link]</kbd>`;
    elements.commandHint2.innerHTML = `Request something using 
    <kbd class="notranslate text-success cursor-pointer" onclick="editRequestCommand()">${PLAYLIST.requestCommand} [link]</kbd> or 
    <kbd class="notranslate text-success cursor-pointer" onclick="editRequestCommand(true)">${PLAYLIST.requestCommandAlias} [link]</kbd>`;
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
    elements.allowStreamable.checked = PLAYLIST.allowStreamable ?? true;
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
    elements.plebLimit.value = PLAYLIST.plebLimit || "";
    elements.subLimit.value = PLAYLIST.subLimit || "";
    elements.modLimit.value = PLAYLIST.modLimit || "";
    elements.vipLimit.value = PLAYLIST.vipLimit || "";
    elements.firstTimeChatterLimit.value = PLAYLIST.firstTimeChatterLimit || "";
    elements.noCommand.checked = PLAYLIST.noCommand ?? false;
    elements.requestCommand.value = PLAYLIST.requestCommand || "!request";
    elements.requestCommandAlias.value = PLAYLIST.requestCommandAlias || "!r";
    elements.allowVoteSkip.checked = PLAYLIST.allowVoteSkip ?? false;
    elements.voteskipCommand.value = PLAYLIST.voteskipCommand || "!voteskip";
    elements.voteskipCommandAlias.value = PLAYLIST.voteskipCommandAlias || "!vs";
    elements.voteskipCount.value = PLAYLIST.voteskipCount || 100;
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

    elements.voteSkipHint.innerHTML = `<kbd>${PLAYLIST.voteskipCommand}</kbd> or <kbd>${PLAYLIST.voteskipCommandAlias}</kbd>`;

    if (PLAYLIST.noCommand) {
      elements.commandHint.innerHTML = `Add songs or videos to the playlist by posting a link in chat`;
      elements.commandHint2.innerHTML = `Request something by posting a link in chat`;
    } else {
      elements.commandHint.innerHTML = `Add songs or videos to the playlist using 
      <kbd class="notranslate text-success cursor-pointer" onclick="editRequestCommand()">${PLAYLIST.requestCommand}</kbd> or 
      <kbd class="notranslate text-success cursor-pointer" onclick="editRequestCommand(true)">${PLAYLIST.requestCommandAlias}</kbd>`;
      elements.commandHint2.innerHTML = `Request something using 
      <kbd class="notranslate text-success cursor-pointer" onclick="editRequestCommand()">${PLAYLIST.requestCommand} [link]</kbd> or 
      <kbd class="notranslate text-success cursor-pointer" onclick="editRequestCommand(true)">${PLAYLIST.requestCommandAlias} [link]</kbd>`;
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
      allowStreamable: true,
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
      plebLimit: "",
      subLimit: "",
      modLimit: "",
      vipLimit: "",
      firstTimeChatterLimit: "",
      noCommand: false,
      requestCommand: "!request",
      requestCommandAlias: "!r",
      allowVoteSkip: false,
      voteskipCommand: "!voteskip",
      voteskipCommandAlias: "!vs",
      voteskipCount: 100,
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
    if (context["first-msg"]) {
      firstTimeChatters.push(context.username);
    }
    let input = msg.split(" ").filter(Boolean);

    if (PLAYLIST.noCommand && playlist_open) {
      let link = parseLink(input[0]);
      if (link && linkTypeAllowed(link.type)) {
        addRequest(context, link);
        return;
      }
      if (link && !linkTypeAllowed(link.type)) {
        botReply("⛔ That platform is not enabled", context.id, false);
        return;
      }
    }

    let command = input[0].toLowerCase();
    switch (command) {
      case PLAYLIST.requestCommand:
      case PLAYLIST.requestCommandAlias:
        if (!input[1]) {
          return;
        }
        if (!playlist_open && (Date.now() - currentTime) / 1000 > 10) {
          currentTime = Date.now();
          togglePlaylistPopover.show();
          setTimeout(function () {
            togglePlaylistPopover.hide();
          }, 2000);
          return;
        } //playlist closed popover
        let link = parseLink(input[1]);
        if (!link) {
          return;
        }
        if (!linkTypeAllowed(link.type)) {
          botReply("⛔ That platform is not enabled", context.id, false);
          return;
        }
        addRequest(context, link);
        break;

      case PLAYLIST.voteskipCommand:
      case PLAYLIST.voteskipCommandAlias:
        voteSkip(context["user-id"]);
        break;
      case PLAYLIST.songCommand:
      case PLAYLIST.songCommandAlias:
        if (currentItem) {
          botReply(
            `Current song/video: ${currentItem.title} | Requested by @${currentItem.by[0]} ${
              currentItem.by.length > 1 ? `and ${currentItem.by.length - 1} other ${currentItem.by.length - 1 == 1 ? "user" : "users"}` : ""
            }`,
            context.id,
            true
          );
        }
        break;
      case PLAYLIST.playlistCommand:
      case PLAYLIST.playlistCommandAlias:
        //botReply("", context.id,true);
        break;
      case PLAYLIST.skipCommand:
        if (context.username == USER.channel || (PLAYLIST.modSkip && context.mod)) {
          nextItem();
        }
        break;
      default:
        break;
    }
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

/**
 * @description get the index of a user from the users array - if the user is not already in then they will be added
 * @param {Object} context the context object from the chat message event
 * @returns {number} the user's index in the users array
 */
function getUser(context) {
  const userIndex = users.findIndex((u) => u.id === context["user-id"]);
  if (userIndex == -1) {
    users.push({
      id: context["user-id"],
      username: context.username,
      mod: context?.mod || false,
      sub: context?.subscriber || false,
      vip: context?.vip || false,
      firstTimeChatter: firstTimeChatters.includes(context.username),
      requestsCount: 0,
      requestsDuration: 0,
      requests: [],
    });
    return users.length - 1;
  } else {
    return userIndex;
  }
} //getUser

/**
 * @description checks if the user is allowed to request and returns their request limit
 * @param {number} userIndex
 * @returns {number} return values: 0 = user is not allowed to request | -1 = user can make unlimited requests
 */
function checkRequestLimit(userIndex) {
  let limit = 0;
  if (!users[userIndex].sub && PLAYLIST.allowPlebs) {
    if (PLAYLIST.plebLimit === "") {
      return -1;
    }
    limit = Math.max(limit, PLAYLIST.plebLimit);
  }
  if (users[userIndex].sub && PLAYLIST.allowSubs) {
    if (PLAYLIST.subLimit === "") {
      return -1;
    }
    limit = Math.max(limit, PLAYLIST.subLimit);
  }
  if (users[userIndex].mod && PLAYLIST.allowMods) {
    if (PLAYLIST.modLimit === "") {
      return -1;
    }
    limit = Math.max(limit, PLAYLIST.modLimit);
  }
  if (users[userIndex].vip && PLAYLIST.allowVips) {
    if (PLAYLIST.vipLimit === "") {
      return -1;
    }
    limit = Math.max(limit, PLAYLIST.vipLimit);
  }
  if (users[userIndex].firstTimeChatter && PLAYLIST.allowFirstTimeChatters) {
    if (PLAYLIST.firstTimeChatterLimit === "") {
      return -1;
    }
    limit = Math.max(limit, PLAYLIST.firstTimeChatterLimit);
  }
  return limit;
} //checkRequestLimit

function addRequest(context, link) {
  const userIndex = getUser(context);
  const limit = checkRequestLimit(userIndex);

  //if limit is 0 then the user's roles are not allowed to request
  if (limit === 0) {
    botReply("🚫 You are not allowed to send requests", context.id, false);
    return;
  }

  //if limit is -1 then the user is allowed to make unlimited requests
  if (limit !== -1 && users[userIndex].requestsCount >= limit) {
    botReply("⚠ You used up all your requests", context.id, false);
    return;
  }

  //check if user already requested this link id
  if (users[userIndex].requests.some((id) => id === link.id)) {
    botReply("🚫 You already requested this", context.id, false);
    return;
  }

  users[userIndex].requestsCount++;
  users[userIndex].requests.push(link.id);

  //check if other users already requested this link id
  const requestIndex = requests.findIndex((r) => r.id === link.id);
  if (requestIndex > -1) {
    requests[requestIndex].by.push(context.username);
    updatePlaylist(requestIndex);
    botReply("✅ Your request is already in the playlist (someone else already requested it)", context.id, false);
  } else {
    requests.push({
      id: link.id,
      type: link.type,
      approved: PLAYLIST.approvalQueue ? false : true,
      title: "",
      duration: 0,
      views: -1,
      thumbnail: "",
      time: Date.now(),
      by: [context.username],
    });
    let index = requests.length - 1;
    addToPlaylist(index);
    getRequestInfo(index, context.id);
    updatePlaylist(index);
  }
  updateLength();
} //addRequest

function deleteRequest(id, refund = true) {
  const requestIndex = requests.findIndex((r) => r.id === id);
  if (refund) {
    for (let index = 0; index < requests[requestIndex].by.length; index++) {
      const userIndex = users.findIndex((u) => u.username === requests[requestIndex].by[index]);
      users[userIndex].requestsCount--;
      users[userIndex].requests.splice(
        users[userIndex].requests.findIndex(function (r) {
          return r.value === id;
        }),
        1
      );
    }
    requests.splice(requestIndex, 1);
  }
  document.getElementById(`id${id}`).remove();
  updateLength();
} //deleteRequest

function clearPlaylist() {
  playlist_playing = false;
  total_duration = 0;
  users = [];
  requests = [];
  history = [];
  resetVoteSkip();
  resetPlayers();
  elements.mainList.innerHTML = "";
  elements.placeholder.style.display = "";
  elements.nowPlaying.innerHTML = `<span class="text-body-secondary">Nothing :)</span>`;
  updateLength();
} //clearPlaylist

function updateLength() {
  const count = requests.length;
  const duration = requests.reduce((sum, request) => {
    return request.duration == -1 ? sum : sum + request.duration;
  }, 0);
  elements.playlistLength.innerHTML = `${secondsToTimeString(Math.round(duration)) || "00:00"} (${count} ${count == 1 ? "item" : "items"})`;
} //updateLength

function addToPlaylist(requestIndex, position = "beforeend") {
  elements.mainList.insertAdjacentHTML(
    position,
    `<div class="container-fluid p-0 mb-1" id="id${requests[requestIndex].id}">
        <div class="row g-1">
          <div class="col-auto thumbnail-div">
            <div id="id${requests[requestIndex].id}_thumbnail" class="request-thumbnail">
              <p class="placeholder-glow" style="width: 160px; height: 90px">
                <span class="placeholder col-12 rounded" style="height: 100%"></span>
              </p>
            </div>
            <span class="badge text-bg-dark duration-label" id="id${requests[requestIndex].id}_duration">00:00</span>
          </div>
          <div class="col">
            <div class="vstack gap-3">
              <div class="request-title" id="id${requests[requestIndex].id}_title" >
                <span class="placeholder-glow">
                  <span class="placeholder col-12"></span>
                </span>
              </div>
              <div><small class="requested-by text-body-secondary" id="id${requests[requestIndex].id}_by" >Requested by: ${requests[requestIndex].by.join(" & ")}</small></div>
            </div>
          </div>
          <div class="col-auto" style="align-self: center"><i class="material-icons notranslate delete-request" onclick="deleteRequest('${requests[requestIndex].id}')">delete</i></div>
        </div>
      </div>`
  );
} //addToPlaylist

function updatePlaylist(index) {
  if (requests[index].thumbnail && requests[index].title) {
    document.getElementById(`id${requests[index].id}_thumbnail`).innerHTML = `<img src="${requests[index].thumbnail}" alt="thumbnail" class="rounded" />`;
    document.getElementById(`id${requests[index].id}_title`).innerText = requests[index].title;
    document.getElementById(`id${requests[index].id}_duration`).innerText = requests[index].duration == -1 ? "🔴live" : secondsToTimeString(Math.round(requests[index].duration));
    document.getElementById(`id${requests[index].id}_by`).innerText = `Requested by: ${requests[index].by.join(" & ")}`;
    if (!playlist_playing) {
      playlist_playing = true;
      nextItem();
    }
  } else {
    //update requesters only if request info is not ready yet
    document.getElementById(`id${requests[index].id}_by`).innerText = `Requested by: ${requests[index].by.join(" & ")}`;
  }
} //updatePlaylist

async function getRequestInfo(index, id) {
  //skip if request already has info
  if (requests[index].title) {
    return;
  }
  if (requests[index].type == "twitch clip") {
    try {
      let response = await fetch(`https://helper.donk.workers.dev/twitch/clips?id=${requests[index].id}`, GETrequestOptions);
      let result = await response.json();
      console.log(result);
      requests[index].title = `${result.data[0].title} - ${result.data[0].broadcaster_name}` || "(untitled)";
      requests[index].thumbnail = result.data[0].thumbnail_url;
      requests[index].duration = result.data[0].duration;
      requests[index].views = result.data[0].view_count;
    } catch (error) {
      deleteRequest(requests[index].id);
      botReply("⚠ Your clip was removed because I could not find its info", id, false);
      console.log("getRequestInfo twitch clip error", error);
      return;
    }
  }

  if (requests[index].type == "twitch vod") {
    try {
      let response = await fetch(`https://helper.donk.workers.dev/twitch/videos?id=${requests[index].id}`, GETrequestOptions);
      let result = await response.json();
      console.log(result);
      requests[index].title = `${result.data[0].title} - ${result.data[0].user_login}` || "(untitled)";
      requests[index].thumbnail = result.data[0].thumbnail_url.replace("%{width}", "320").replace("%{height}", "180");
      requests[index].duration = convertTwitchVODDuration(result.data[0].duration);
      requests[index].views = result.data[0].view_count;
    } catch (error) {
      deleteRequest(requests[index].id);
      botReply("⚠ Your video was removed because I could not find its info", id, false);
      console.log("getRequestInfo twitch vod error", error);
      return;
    }
  }

  if (requests[index].type == "twitch stream") {
    try {
      let response = await fetch(`https://helper.donk.workers.dev/twitch/streams?user_login=${requests[index].id}`, GETrequestOptions);
      let result = await response.json();
      console.log(result);
      requests[index].title = `${result.data[0].title} - ${result.data[0].user_name}` || "(untitled)";
      requests[index].thumbnail = result.data[0].thumbnail_url.replace("{width}", "320").replace("{height}", "180");
      requests[index].duration = -1;
    } catch (error) {
      deleteRequest(requests[index].id);
      botReply("⚠ Your request was removed because I could not find its info", id, false);
      console.log("getRequestInfo twitch stream error", error);
      return;
    }
  }

  if (requests[index].type == "spotify") {
    try {
      let response = await fetch(`https://helper.donk.workers.dev/spotify/tracks?ids=${requests[index].id}`, GETrequestOptions);
      let result = await response.json();
      console.log(result);
      requests[index].title = `${result.tracks[0].name} - ${result.tracks[0].artists[0].name}` || "(untitled)";
      requests[index].thumbnail = result.tracks[0].album.images[0].url;
      requests[index].duration = result.tracks[0].duration_ms / 1000;
      requests[index].uri = result.tracks[0].uri;
      if (!result.tracks[0].is_playable) {
        deleteRequest(requests[index].id);
        botReply("⛔ Your request was removed because it is not playable", id, false);
        return;
      }
    } catch (error) {
      deleteRequest(requests[index].id);
      botReply("⚠ Your request was removed because I could not find its info", id, false);
      console.log("getRequestInfo spotify error", error);
      return;
    }
  }

  if (requests[index].type == "youtube" || requests[index].type == "youtube short") {
    try {
      let response = await fetch(`https://helper.donk.workers.dev/youtube/videos?id=${requests[index].id}`, GETrequestOptions);
      let result = await response.json();
      console.log(result);
      requests[index].title = `${result.items[0].snippet.title} - ${result.items[0].snippet.channelTitle}` || "(untitled)";
      requests[index].thumbnail = result.items[0].snippet.thumbnails.medium.url;
      requests[index].duration = ISO8601ToSeconds(result.items[0].contentDetails.duration);
      requests[index].views = result.items[0].statistics.viewCount;

      if (Object.hasOwn(result.items[0], "liveStreamingDetails")) {
        if (requests[index].duration == 0) {
          requests[index].duration = -1;
        }
        if (!PLAYLIST.allowYTStreams) {
          deleteRequest(requests[index].id);
          botReply("⛔ YouTube streams are not allowed", id, false);
          return;
        }
      }

      if (result.items[0].contentDetails?.contentRating?.ytRating == "ytAgeRestricted" || !result.items[0].status?.embeddable) {
        deleteRequest(requests[index].id);
        botReply("⛔ Your video was removed because it is age restricted or not embeddable", id, false);
        return;
      }
    } catch (error) {
      deleteRequest(requests[index].id);
      botReply("⚠ Your video was removed because I could not find its info", id, false);
      console.log("getRequestInfo youtube error", error);
      return;
    }
  }

  if (requests[index].type == "streamable") {
    try {
      let response = await fetch(`https://helper.donk.workers.dev/streamable/videos?id=${requests[index].id}`, GETrequestOptions);
      let result = await response.json();
      console.log(result);
      requests[index].title = result.title || "(untitled)";
      requests[index].thumbnail = result.thumbnail_url;
      requests[index].duration = result.files.mp4.duration;
      requests[index].video = result.files.mp4.url;
    } catch (error) {
      deleteRequest(requests[index].id);
      botReply("⚠ Your video was removed because I could not find its info", id, false);
      console.log("getRequestInfo streamable error", error);
      return;
    }
  }

  if (PLAYLIST.maxDuration !== "" && requests[index].duration !== -1 && total_duration + requests[index].duration > PLAYLIST.maxDuration * (PLAYLIST.maxDurationUnit == "m" ? 60 : 3600)) {
    if (playlist_open) {
      elements.togglePlaylist.click();
    }
    deleteRequest(requests[index].id);
    botReply("⛔ Your request was removed because the playlist's duration limit was reached", id, false);
    return;
  }

  if (PLAYLIST.maxLength !== "" && requests[index].duration !== -1 && requests[index].duration > PLAYLIST.maxLength * 60) {
    deleteRequest(requests[index].id);
    botReply(`⛔ Your request was removed because it's too long (${PLAYLIST.maxLength}m max)`, id, false);
    return;
  }

  if (PLAYLIST.maxSize !== "" && requests.length > PLAYLIST.maxSize) {
    if (playlist_open) {
      elements.togglePlaylist.click();
    }
    deleteRequest(requests[index].id);
    botReply("⛔ Your request was removed because the playlist's size limit was reached", id, false);
    return;
  }

  if (PLAYLIST.minViewCount !== "" && requests[index].views !== -1 && requests[index].views < PLAYLIST.minViewCount) {
    deleteRequest(requests[index].id);
    botReply(`⛔ Your request was removed because it does not meet the minimum view count (${PLAYLIST.minViewCount.toLocaleString()})`, id, false);
    return;
  }

  if (requests[index].duration !== -1) {
    total_duration += requests[index].duration;
  }
  updatePlaylist(index);
  updateLength();
  botReply("✅ Your request has been added to the playlist", id, false);
} //getRequestInfo

/**
 * @description gets the video/track/clip/vod id or stream username from a url string
 * @param {string} link
 * @returns {Object}
 */
function parseLink(link) {
  if (link.includes("twitch.tv")) {
    if (link.includes("/clip/") || link.includes("clips.twitch.tv")) {
      let clipURL = new URL(link);
      let clipID =
        clipURL.hostname === "clips.twitch.tv"
          ? /^\/(\w+(?:\/[A-Z]\w+)?(?:[\-\w]*))(?:\/|$)/.exec(clipURL.pathname)
          : /^\/\w+\/clip\/(\w+(?:\/[A-Z]\w+)?(?:[\-\w]*))(?:\/|$)/.exec(clipURL.pathname);
      if (!clipID || !clipID[1]) {
        return null;
      }
      return { type: "twitch clip", id: clipID[1] };
    } //clips

    if (link.includes("/videos/")) {
      const vodID = link.match(/\/videos\/(\d+)/);
      if (!vodID || !parseInt(vodID[1])) {
        return null;
      }
      return { type: "twitch vod", id: vodID[1] };
    } //vods

    const username = link.match(/\/([a-zA-Z0-9_]{1,25})$/);
    if (!username) {
      return null;
    }
    return { type: "twitch stream", id: username[1] };
  } //twitch

  if (link.includes("youtube.com") || link.includes("youtu.be")) {
    const youtubeURLRegex = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
    const videoID = youtubeURLRegex.exec(link) || null;
    if (videoID[3]?.length != 11) {
      return null;
    }
    return { type: link.includes("/shorts/") ? "youtube short" : "youtube", id: videoID[3] };
  } //youtube

  if (link.includes("spotify.com")) {
    const spotifyURLRegex = /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:(album|track|playlist)\/|\?uri=spotify:track:)((\w|-){22})/;
    let id = link.match(spotifyURLRegex);
    if (!id[2] || id[1] !== "track") {
      return null;
    }
    return { type: "spotify", id: id[2] };
  } //spotify

  if (link.includes("streamable.com")) {
    const match = link.match(/streamable\.com\/([a-zA-Z0-9]+)/);
    if (!match[1]) {
      return null;
    }
    return { type: "streamable", id: match[1] };
  } //spotify

  return null;
} //parseLink

function linkTypeAllowed(type) {
  if (type == "twitch clip" && !PLAYLIST.allowTwitchClips) {
    return false;
  }
  if (type == "twitch vod" && !PLAYLIST.allowTwitchVODs) {
    return false;
  }
  if (type == "twitch stream" && !PLAYLIST.allowTwitchStreams) {
    return false;
  }
  if (type == "spotify" && !PLAYLIST.allowSpotifySongs) {
    return false;
  }
  if (type == "streamable" && !PLAYLIST.allowStreamable) {
    return false;
  }
  if (type == "youtube" && !PLAYLIST.allowYTStreams && !PLAYLIST.allowYTVideos) {
    return false;
  }
  if (type == "youtube short" && !PLAYLIST.allowYTShorts) {
    return false;
  }

  return true;
} //linkTypeAllowed

function addLink() {
  let link = parseLink(elements.link.value.replace(/\s+/g, ""));
  if (!link || !linkTypeAllowed(link.type)) {
    showToast("Could not parse the provided link", "warning", 3000);
    elements.link.value = "";
    return;
  }
  addRequest(
    {
      id: null,
      "user-id": USER.userID,
      username: USER.channel,
      mod: true,
      sub: true,
      vip: true,
      firstTimeChatter: false,
    },
    link
  );
  elements.link.value = "";
} //addLink

function previousItem() {} //previousItem

function togglePlay() {} //togglePlay

let playlistCooldown = false;
let currentItem;
function nextItem() {
  if (playlistCooldown) {
    return;
  }
  playlistCooldown = true;
  elements.nextItem.disabled = true;
  setTimeout(() => {
    playlistCooldown = false;
    elements.nextItem.disabled = false;
  }, 1000);
  currentItem = requests.shift();
  console.log(currentItem);
  history.push(currentItem);
  resetPlayers();
  resetVoteSkip();
  if (!currentItem) {
    elements.placeholder.style.display = "";
    playlist_playing = false;
    elements.nowPlaying.innerHTML = `<span class="text-body-secondary">Nothing :)</span>`;
    return;
  }
  deleteRequest(currentItem.id, false);
  playItem(currentItem);
} //nextItem

function playItem(item) {
  switch (item.type) {
    case "youtube":
    case "youtube short":
      elements.youtubeEmbedContainer.style.display = "";
      youtubePlayer.loadVideoById(item.id);
      break;
    case "spotify":
      elements.spotifyEmbedContainer.style.display = "";
      spotifyPlayer.loadUri(item.uri);
      break;
    case "twitch stream":
      elements.twitchEmbed.style.display = "";
      twitchPlayer.setChannel(item.id);
      break;
    case "twitch vod":
      elements.twitchEmbed.style.display = "";
      twitchPlayer.setVideo(item.id);
      break;
    case "twitch clip":
      elements.twitchClipsEmbed.style.display = "";
      elements.twitchClipsEmbed.src = `https://clips.twitch.tv/embed?clip=${item.id}&parent=${window.location.hostname}&autoplay=true`;
      break;
    case "streamable":
      elements.streamableEmbed.style.display = "";
      elements.streamableEmbed.src = item.video;
      break;
    default:
      break;
  }

  if (currentItem.duration !== -1) {
    total_duration -= currentItem.duration;
  }

  elements.nowPlaying.innerText = truncateString(currentItem.title, 80);
} //playItem

function resetPlayers() {
  elements.placeholder.style.display = "none";
  elements.youtubeEmbedContainer.style.display = "none";
  elements.spotifyEmbedContainer.style.display = "none";
  elements.twitchEmbed.style.display = "none";
  elements.twitchClipsEmbed.style.display = "none";
  elements.streamableEmbed.style.display = "none";

  youtubePlayer.loadVideoById("");
  spotifyPlayer.pause();
  twitchPlayer.setChannel("");
  elements.twitchClipsEmbed.src = "";
  elements.streamableEmbed.src = "";
} //resetPlayers

function voteSkip(userid) {
  if (!playlist_playing || !PLAYLIST.allowVoteSkip) {
    return;
  }

  if (!skippers.length) {
    elements.voteSkipDiv.style.display = "";
    anime({
      targets: `#voteSkipDiv`,
      easing: "easeOutElastic",
      translateY: ["100%", 0],
    });
  }

  if (skippers.includes(userid)) {
    return;
  }

  skippers.push(userid);
  let remaining = PLAYLIST.voteskipCount - skippers.length;
  elements.voteSkipVotes.innerHTML = `${remaining} ${remaining == 1 ? "vote" : "votes"}  needed to skip`;

  if (remaining <= 0) {
    nextItem();
    resetVoteSkip();
  }
} //voteSkip

function resetVoteSkip() {
  skippers = [];
  anime({
    targets: `#voteSkipDiv`,
    easing: "easeOutBounce",
    translateY: [0, "100%"],
    complete: function (anim) {
      elements.voteSkipDiv.style.display = "none";
    },
  });
} //resetVoteSkip

async function loadPFP() {
  if (!USER.channel) {
    elements.topRight.innerHTML = `<div class="btn-group" role="group" aria-label="login options">
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

let botCooldown = 0;
async function botReply(msg, id, followCooldown) {
  if (!USER.access_token || !PLAYLIST.enableBot || !id) {
    return;
  }

  if ((Date.now() - botCooldown) / 1000 < PLAYLIST.botCooldown && followCooldown) {
    return;
  }
  botCooldown = Date.now();

  let body = JSON.stringify({
    channel: USER.channel,
    id: id,
    msg: msg,
    access_token: USER.access_token,
  });
  let requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body,
    redirect: "follow",
  };
  try {
    let response = await fetch(`https://api.chat.vote/reply`, requestOptions);
    console.log(`botReply response: ${response.status}`);
  } catch (error) {
    console.log("botReply error", error);
  }
} //botReply

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
  let limits = [];
  let counts = [];
  for (let [key, value] of Object.entries(roles)) {
    if (value.allowed) {
      allowed.push(key);
      let count = value.limit === "" ? "unlimited" : value.limit;
      limits.push(`${key} can make ${count} ${count == 1 ? "request" : "requests"}`);
      counts.push(count);
    }
  }

  if (allowed.length == 0) {
    elements.whoCanRequest.innerHTML = `<span class="text-danger">No one will be able to request</span>`;
    return;
  }
  elements.whoCanRequest.innerHTML = `${allowed.length == 1 ? "Only" : ""} ${allowed.length == 5 ? "Everyone" : allowed.join(", ")} will be able to request.<br>
  ${
    counts.every((e) => e === counts[0])
      ? `${counts.length == Object.keys(roles).length ? "Everyone" : "Viewers that can request"} will get ${counts[0]} ${counts[0] == 1 ? "request" : "requests"}.`
      : limits.join(" - ")
  }`;
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
  clearPlaylistModal = new bootstrap.Modal(elements.clearPlaylistModal);
  settingsOffcanvas = new bootstrap.Offcanvas(elements.settingsOffcanvas);
  copyLinkButton = new bootstrap.Popover(elements.copyLinkButton);
  togglePlaylistPopover = new bootstrap.Popover(elements.togglePlaylistLabel);

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
      elements.togglePlaylistLabel.classList = "btn btn-danger";
      elements.togglePlaylistLabel.innerHTML = "Close Playlist";
    } else {
      elements.togglePlaylistLabel.classList = "btn btn-success";
      elements.togglePlaylistLabel.innerHTML = "Open Playlist";
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

  elements.link.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      addLink();
    }
  });

  enableTooltips();
  enableTwitchEmbed();
  streamableEmbedEventListeners();
  elements.twitchClipsEmbed.src = `https://clips.twitch.tv/embed?parent=${window.location.hostname}&autoplay=true`;
}; //onload

let youtubePlayer;
function onYouTubeIframeAPIReady() {
  //youtubePlayer.loadVideoById("id")
  //youtubePlayer.playVideo()
  //youtubePlayer.pauseVideo()
  // player.mute():Void
  // Mutes the player.
  // player.unMute():Void
  // Unmutes the player.
  // player.isMuted():Boolean
  // Returns true if the player is muted, false if not.
  // player.setVolume(volume:Number):Void
  // Sets the volume. Accepts an integer between 0 and 100.
  // player.getVolume():Number

  console.log("onYouTubeIframeAPIReady");
  youtubePlayer = new YT.Player("youtubeEmbed", {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      enablejsapi: 1,
      playsinline: 1,
      fs: 0,
      rel: 0,
      origin: "chat.vote",
    },
    events: {
      onStateChange: youtubePlayerOnStateChange,
      onError: youtubePlayerOnError,
      onAutoplayBlocked: youtubePlayerOnAutoplayBlocked,
    },
  });
} //onYouTubeIframeAPIReady

function youtubePlayerOnStateChange(event) {
  console.log(event);
  if (event.data == YT.PlayerState.ENDED) {
    nextItem();
  }
} //youtubePlayerOnStateChange

function youtubePlayerOnError(event) {
  console.log(event);
} //youtubePlayerOnError

function youtubePlayerOnAutoplayBlocked(event) {
  console.log(event);
} //youtubePlayerOnAutoplayBlocked

let spotifyPlayer;
window.onSpotifyIframeApiReady = (IFrameAPI) => {
  console.log("onSpotifyIframeApiReady");

  //spotifyPlayer.loadUri('spotify:episode:7makk4oTQel546B0PZlDM5');
  //spotifyPlayer.play()
  //spotifyPlayer.pause();

  const callback = (EmbedController) => {
    spotifyPlayer = EmbedController;
    //breaks if user skips too fast and keeps playing after the embed gets hidden
    // EmbedController.addListener("ready", () => {
    //   EmbedController.play();
    // });
    EmbedController.addListener("playback_update", (event) => {
      if (event.data.position == event.data.duration && event.data.duration > 0) {
        nextItem();
      }
    });
  };
  IFrameAPI.createController(elements.spotifyEmbed, {}, callback);
}; //onSpotifyIframeApiReady

let twitchPlayer;
function enableTwitchEmbed() {
  //twitchPlayer.setChannel("")
  //twitchPlayer.setVideo("")
  //twitchPlayer.play()
  //twitchPlayer.pause()
  //twitchPlayer.setMuted(true/false)
  //twitchPlayer.setVolume()

  let options = {
    width: "100%",
    height: "100%",
    channel: "chatvote",
    parent: ["chat.vote"],
  };
  twitchPlayer = new Twitch.Player("twitchEmbed", options);

  twitchPlayer.addEventListener(Twitch.Player.ENDED, twitchPlayerEnded);
  twitchPlayer.addEventListener(Twitch.Player.PAUSE, twitchPlayerPaused);

  function twitchPlayerEnded(event) {
    nextItem();
  }
  function twitchPlayerPaused(event) {
    console.log(event);
  }
} //enableTwitchEmbed

function streamableEmbedEventListeners() {
  elements.streamableEmbed.addEventListener("ended", (event) => {
    nextItem();
  });
}
