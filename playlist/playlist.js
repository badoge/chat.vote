let elements = {
  //modals
  loginExpiredModal: document.getElementById("loginExpiredModal"),
  resetSettingsModal: document.getElementById("resetSettingsModal"),
  clearPlaylistModal: document.getElementById("clearPlaylistModal"),

  voteSkipDiv: document.getElementById("voteSkipDiv"),
  voteSkipHint: document.getElementById("voteSkipHint"),
  voteSkipVotes: document.getElementById("voteSkipVotes"),

  //navbar
  status: document.getElementById("status"),
  topRight: document.getElementById("topRight"),
  loginButton: document.getElementById("loginButton"),
  channelName: document.getElementById("channelName"),
  darkTheme: document.getElementById("darkTheme"),

  //settings
  settingsOffcanvas: document.getElementById("settingsOffcanvas"),
  allowSpotifySongs: document.getElementById("allowSpotifySongs"),
  allowStreamable: document.getElementById("allowStreamable"),
  allowSupaVideo: document.getElementById("allowSupaVideo"),
  allowSupaAudio: document.getElementById("allowSupaAudio"),
  allowTwitchClips: document.getElementById("allowTwitchClips"),
  allowTwitchStreams: document.getElementById("allowTwitchStreams"),
  allowTwitchVODs: document.getElementById("allowTwitchVODs"),
  allowTiktokVideos: document.getElementById("allowTiktokVideos"),
  allowYTStreams: document.getElementById("allowYTStreams"),
  allowYTShorts: document.getElementById("allowYTShorts"),
  allowYTVideos: document.getElementById("allowYTVideos"),
  maxDuration: document.getElementById("maxDuration"),
  maxDurationUnit: document.getElementById("maxDurationUnit"),
  maxLength: document.getElementById("maxLength"),
  maxSize: document.getElementById("maxSize"),
  minViewCount: document.getElementById("minViewCount"),
  uniqueOnly: document.getElementById("uniqueOnly"),
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
  openCommand: document.getElementById("openCommand"),
  closeCommand: document.getElementById("closeCommand"),
  playCommand: document.getElementById("playCommand"),
  pauseCommand: document.getElementById("pauseCommand"),
  autoplayCommand: document.getElementById("autoplayCommand"),
  skipCommand: document.getElementById("skipCommand"),
  rewindCommand: document.getElementById("rewindCommand"),
  deleteCommand: document.getElementById("deleteCommand"),
  modCommands: document.getElementById("modCommands"),

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
  tiktokEmbed: document.getElementById("tiktokEmbed"),
  videoEmbed: document.getElementById("videoEmbed"),

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
  historyCount: document.getElementById("historyCount"),
  historyList: document.getElementById("historyList"),

  //bottom row
  profileLink: document.getElementById("profileLink"),
  copyLinkButton: document.getElementById("copyLinkButton"),
  nowPlaying: document.getElementById("nowPlaying"),
  nowPlayingRequester: document.getElementById("nowPlayingRequester"),
  playlistLength: document.getElementById("playlistLength"),
  togglePlaylist: document.getElementById("togglePlaylist"),
  autoplay: document.getElementById("autoplay"),
  volumeSliderIcon: document.getElementById("volumeSliderIcon"),
  volumeSlider: document.getElementById("volumeSlider"),
  volumeSliderValue: document.getElementById("volumeSliderValue"),
};

let client;
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
let streamerColor = "";

let users = [];
let requests = new Map();
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
  autoplay: true,
  allowSpotifySongs: true,
  allowStreamable: true,
  allowSupaVideo: true,
  allowSupaAudio: true,
  allowTwitchClips: true,
  allowTwitchStreams: true,
  allowTwitchVODs: true,
  allowTiktokVideos: true,
  allowYTStreams: true,
  allowYTShorts: true,
  allowYTVideos: true,
  maxDuration: "",
  maxDurationUnit: "m",
  maxLength: "",
  maxSize: "",
  minViewCount: "",
  uniqueOnly: false,
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
  songCommandAlias: "!video",
  playlistCommand: "!playlist",
  playlistCommandAlias: "!pl",
  approvalQueue: false,
  openCommand: "!open",
  closeCommand: "!close",
  playCommand: "!play",
  pauseCommand: "!pause",
  autoplayCommand: "!autoplay",
  skipCommand: "!skip",
  rewindCommand: "!rewind",
  deleteCommand: "!delete",
  modCommands: true,
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

  PLAYLIST.autoplay = elements.autoplay.checked;
  PLAYLIST.allowSpotifySongs = elements.allowSpotifySongs.checked;
  PLAYLIST.allowStreamable = elements.allowStreamable.checked;
  PLAYLIST.allowSupaVideo = elements.allowSupaVideo.checked;
  PLAYLIST.allowSupaAudio = elements.allowSupaAudio.checked;
  PLAYLIST.allowTwitchClips = elements.allowTwitchClips.checked;
  PLAYLIST.allowTwitchStreams = elements.allowTwitchStreams.checked;
  PLAYLIST.allowTwitchVODs = elements.allowTwitchVODs.checked;
  PLAYLIST.allowTiktokVideos = elements.allowTiktokVideos.checked;
  PLAYLIST.allowYTStreams = elements.allowYTStreams.checked;
  PLAYLIST.allowYTShorts = elements.allowYTShorts.checked;
  PLAYLIST.allowYTVideos = elements.allowYTVideos.checked;
  PLAYLIST.maxDuration = parseInt(elements.maxDuration.value, 10) || "";
  PLAYLIST.maxDurationUnit = elements.maxDurationUnit.value || "m";
  PLAYLIST.maxLength = parseInt(elements.maxLength.value, 10) || "";
  PLAYLIST.maxSize = parseInt(elements.maxSize.value, 10) || "";
  PLAYLIST.minViewCount = parseInt(elements.minViewCount.value, 10) || "";
  PLAYLIST.uniqueOnly = elements.uniqueOnly.checked;
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
  PLAYLIST.songCommandAlias = elements.songCommandAlias.value.replace(/\s+/g, "").toLowerCase() || "!video";
  PLAYLIST.playlistCommand = elements.playlistCommand.value.replace(/\s+/g, "").toLowerCase() || "!playlist";
  PLAYLIST.playlistCommandAlias = elements.playlistCommandAlias.value.replace(/\s+/g, "").toLowerCase() || "!pl";
  PLAYLIST.approvalQueue = elements.approvalQueue.checked;
  PLAYLIST.openCommand = elements.openCommand.value.replace(/\s+/g, "").toLowerCase() || "!open";
  PLAYLIST.closeCommand = elements.closeCommand.value.replace(/\s+/g, "").toLowerCase() || "!close";
  PLAYLIST.playCommand = elements.playCommand.value.replace(/\s+/g, "").toLowerCase() || "!play";
  PLAYLIST.pauseCommand = elements.pauseCommand.value.replace(/\s+/g, "").toLowerCase() || "!pause";
  PLAYLIST.autoplayCommand = elements.autoplayCommand.value.replace(/\s+/g, "").toLowerCase() || "!autoplay";
  PLAYLIST.skipCommand = elements.skipCommand.value.replace(/\s+/g, "").toLowerCase() || "!skip";
  PLAYLIST.rewindCommand = elements.rewindCommand.value.replace(/\s+/g, "").toLowerCase() || "!rewind";
  PLAYLIST.deleteCommand = elements.deleteCommand.value.replace(/\s+/g, "").toLowerCase() || "!delete";
  PLAYLIST.modCommands = elements.modCommands.checked;

  elements.voteskipCommand.disabled = !PLAYLIST.allowVoteSkip;
  elements.voteskipCommandAlias.disabled = !PLAYLIST.allowVoteSkip;
  elements.voteskipCount.disabled = !PLAYLIST.allowVoteSkip;
  elements.botCooldown.disabled = !PLAYLIST.enableBot;
  elements.songCommand.disabled = !PLAYLIST.enableBot;
  elements.songCommandAlias.disabled = !PLAYLIST.enableBot;
  elements.playlistCommand.disabled = !PLAYLIST.enableBot;
  elements.playlistCommandAlias.disabled = !PLAYLIST.enableBot;

  elements.approvalTabButton.style.display = PLAYLIST.approvalQueue ? "" : "none";

  elements.voteSkipHint.innerHTML = `<strong>${PLAYLIST.voteskipCommand}</strong> or <strong>${PLAYLIST.voteskipCommandAlias}</strong>`;

  if (PLAYLIST.noCommand) {
    elements.commandHint.innerHTML = `Add songs or videos to the playlist by posting a link in chat`;
    elements.commandHint2.innerHTML = `Request something by posting a link in chat`;
  } else {
    elements.commandHint.innerHTML = `Add songs or videos to the playlist using 
    <kbd class="notranslate text-success cursor-pointer" onclick="editRequestCommand()">${PLAYLIST.requestCommand} [link]</kbd> or 
    <kbd class="notranslate text-success cursor-pointer" onclick="editRequestCommand(true)">${PLAYLIST.requestCommandAlias} [link]</kbd>`;
    elements.commandHint2.innerHTML = `Request something using<br />
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
  localforage.setItem("PLAYLIST_REQUESTS", JSON.stringify(requests, replacer));
  localforage.setItem("PLAYLIST_HISTORY", JSON.stringify(history));
  localStorage.setItem("darkTheme", darkTheme);
  updateSite();
} //saveSettings

async function load_localStorage() {
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

    elements.autoplay.checked = PLAYLIST.autoplay ?? true;
    elements.allowSpotifySongs.checked = PLAYLIST.allowSpotifySongs ?? true;
    elements.allowStreamable.checked = PLAYLIST.allowStreamable ?? true;
    elements.allowSupaVideo.checked = PLAYLIST.allowSupaVideo ?? true;
    elements.allowSupaAudio.checked = PLAYLIST.allowSupaAudio ?? true;
    elements.allowTwitchClips.checked = PLAYLIST.allowTwitchClips ?? true;
    elements.allowTwitchStreams.checked = PLAYLIST.allowTwitchStreams ?? true;
    elements.allowTwitchVODs.checked = PLAYLIST.allowTwitchVODs ?? true;
    elements.allowTiktokVideos.checked = PLAYLIST.allowTiktokVideos ?? true;
    elements.allowYTStreams.checked = PLAYLIST.allowYTStreams ?? true;
    elements.allowYTShorts.checked = PLAYLIST.allowYTShorts ?? true;
    elements.allowYTVideos.checked = PLAYLIST.allowYTVideos ?? true;
    elements.maxDuration.value = PLAYLIST.maxDuration || "";
    elements.maxDurationUnit.value = PLAYLIST.maxDurationUnit || "m";
    elements.maxLength.value = PLAYLIST.maxLength || "";
    elements.maxSize.value = PLAYLIST.maxSize || "";
    elements.minViewCount.value = PLAYLIST.minViewCount || "";
    elements.uniqueOnly.checked = PLAYLIST.uniqueOnly ?? false;
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
    elements.songCommandAlias.value = PLAYLIST.songCommandAlias || "!video";
    elements.playlistCommand.value = PLAYLIST.playlistCommand || "!playlist";
    elements.playlistCommandAlias.value = PLAYLIST.playlistCommandAlias || "!pl";
    elements.approvalQueue.checked = PLAYLIST.approvalQueue ?? false;
    elements.openCommand.value = PLAYLIST.openCommand || "!open";
    elements.closeCommand.value = PLAYLIST.closeCommand || "!close";
    elements.playCommand.value = PLAYLIST.playCommand || "!play";
    elements.pauseCommand.value = PLAYLIST.pauseCommand || "!pause";
    elements.autoplayCommand.value = PLAYLIST.autoplayCommand || "!autoplay";
    elements.skipCommand.value = PLAYLIST.skipCommand || "!skip";
    elements.rewindCommand.value = PLAYLIST.rewindCommand || "!rewind";
    elements.deleteCommand.value = PLAYLIST.deleteCommand || "!delete";
    elements.modCommands.checked = PLAYLIST.modCommands ?? true;

    elements.voteskipCommand.disabled = !PLAYLIST.allowVoteSkip;
    elements.voteskipCommandAlias.disabled = !PLAYLIST.allowVoteSkip;
    elements.voteskipCount.disabled = !PLAYLIST.allowVoteSkip;
    elements.botCooldown.disabled = !PLAYLIST.enableBot;
    elements.songCommand.disabled = !PLAYLIST.enableBot;
    elements.songCommandAlias.disabled = !PLAYLIST.enableBot;
    elements.playlistCommand.disabled = !PLAYLIST.enableBot;
    elements.playlistCommandAlias.disabled = !PLAYLIST.enableBot;

    elements.approvalTabButton.style.display = PLAYLIST.approvalQueue ? "" : "none";

    elements.voteSkipHint.innerHTML = `<strong>${PLAYLIST.voteskipCommand}</strong> or <strong>${PLAYLIST.voteskipCommandAlias}</strong>`;

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

  localforage.config({
    driver: localforage.INDEXEDDB,
    name: "chat.vote/playlist",
    version: 1.0,
    storeName: "playlist",
    description: "playlist requests and history",
  });

  try {
    const storedRequests = await localforage.getItem("PLAYLIST_REQUESTS");

    if (!storedRequests) {
      console.log("localStorage playlist requests not found");
    } else {
      requests = JSON.parse(storedRequests, reviver);
      if (requests instanceof Map !== true) {
        //reset localstorage for users that have the old array localstorage
        requests = new Map();
      }
      for (let request of requests.values()) {
        addToPlaylist(request);
        updatePlaylist(request, true);
      }
      updateLength();
    }
  } catch (error) {
    console.log(error);
  }

  try {
    const storedHistory = await localforage.getItem("PLAYLIST_HISTORY");

    if (!storedHistory) {
      console.log("localStorage playlist history not found");
    } else {
      history = JSON.parse(storedHistory);
      for (let index = 0; index < history.length; index++) {
        addToHistory(history[index], true);
      }
      elements.historyCount.innerHTML = `${history.length.toLocaleString()} ${history.length == 1 ? "item" : "items"}`;
    }
  } catch (error) {
    console.log(error);
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
    localforage.setItem("PLAYLIST_REQUESTS", JSON.stringify(new Map(), replacer));
    localforage.setItem("PLAYLIST_HISTORY", JSON.stringify([]));
  }
  localStorage.setItem(
    "PLAYLIST",
    JSON.stringify({
      autoplay: true,
      allowSpotifySongs: true,
      allowStreamable: true,
      allowSupaVideo: true,
      allowSupaAudio: true,
      allowTwitchClips: true,
      allowTwitchStreams: true,
      allowTwitchVODs: true,
      allowTiktokVideos: true,
      allowYTStreams: true,
      allowYTShorts: true,
      allowYTVideos: true,
      maxDuration: "",
      maxDurationUnit: "m",
      maxLength: "",
      maxSize: "",
      minViewCount: "",
      uniqueOnly: false,
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
      songCommandAlias: "!video",
      playlistCommand: "!playlist",
      playlistCommandAlias: "!pl",
      approvalQueue: false,
      openCommand: "!open",
      closeCommand: "!close",
      playCommand: "!play",
      pauseCommand: "!pause",
      autoplayCommand: "!autoplay",
      skipCommand: "!skip",
      rewindCommand: "!rewind",
      deleteCommand: "!delete",
      modCommands: true,
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
      let request = input[0];
      let search = false;
      if (input[0].toLowerCase() == "youtube" || input[0].toLowerCase() == "spotify") {
        request = input.join(" ");
        search = true;
      }
      let link = await parseLink(request);
      if (link && linkTypeAllowed(link.type)) {
        addRequest(context, link, context.id, search);
        return;
      }
      if (link && !linkTypeAllowed(link.type)) {
        botReply(`🚫 ${link.type} links are not enabled`, context.id, false);
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

        if (!playlist_open) {
          return;
        }

        let request = input[1];
        let search = false;
        if (input[1].toLowerCase() == "youtube" || input[1].toLowerCase() == "spotify") {
          request = input.slice(1).join(" ");
          search = true;
        }

        let link = await parseLink(request);
        if (!link) {
          return;
        }
        if (!linkTypeAllowed(link.type)) {
          botReply(`🚫 ${link.type} links are not enabled`, context.id, false);
          return;
        }
        addRequest(context, link, context.id, search);
        break;

      case PLAYLIST.voteskipCommand:
      case PLAYLIST.voteskipCommandAlias:
        voteSkip(context["user-id"]);
        break;
      case PLAYLIST.songCommand:
      case PLAYLIST.songCommandAlias:
        if (currentItem) {
          botReply(
            `Now playing: ${getItemLink(currentItem)} | Requested by @${currentItem.by[0].username} ${
              currentItem.by.length > 1 ? `and ${currentItem.by.length - 1} other ${currentItem.by.length - 1 == 1 ? "user" : "users"}` : ""
            }`,
            context.id,
            true
          );
        }
        break;
      case PLAYLIST.playlistCommand:
      case PLAYLIST.playlistCommandAlias:
        if (USER.access_token) {
          botReply(`You can view the playlist here: https://playlist.chat.vote/${USER.channel}`, context.id, true);
        }
        break;
      default:
        break;
    } //normal commands

    if ((Date.now() - botCooldown) / 1000 > PLAYLIST.botCooldown && (context.username == USER.channel || (PLAYLIST.modCommands && context.mod))) {
      botCooldown = Date.now();

      switch (command) {
        case PLAYLIST.openCommand:
          openPlaylist(context.id);
          break;
        case PLAYLIST.closeCommand:
          closePlaylist(context.id);
          break;
        case PLAYLIST.playCommand:
          playPlaylist(context.id);
          break;
        case PLAYLIST.pauseCommand:
          pausePlaylist(context.id);
          break;
        case PLAYLIST.autoplayCommand:
          toggleAutoplay(context.id);
          break;
        case PLAYLIST.skipCommand:
          nextItem(context.id);
          break;
        case PLAYLIST.rewindCommand:
          previousItem(context.id);
          break;
        case PLAYLIST.deleteCommand:
          deleteItem(input[1], context.id);
          break;
        default:
          break;
      } //mod/streamer commands
    }
  }); //message

  client.on("timeout", (channel, username, reason, duration, userstate) => {}); //timeout

  client.on("messagedeleted", (channel, username, deletedMessage, userstate) => {
    const requestKey = findRequestKey("msgid", userstate["target-msg-id"]);
    if (requestKey) {
      deleteRequest(requestKey, false);
    }
  });

  client.on("connected", async (address, port) => {
    console.log(`Connected to ${address}:${port}`);
    elements.status.innerHTML = `<h4><span class="badge bg-success">Connected :)</span></h4>`;
    saveSettings();
    sendUsername(`chat.vote/playlist`, USER.channel, USER.platform == "twitch" ? `twitch - ${USER.twitchLogin}` : "youtube");
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
      displayName: context["display-name"],
      mod: context?.mod || false,
      sub: context?.subscriber || false,
      vip: context?.vip || false,
      firstTimeChatter: firstTimeChatters.includes(context.username),
      requestsCount: 0,
      requestsDuration: 0,
      badges: addBadges(context.badges, context["user-id"], firstTimeChatters.includes(context.username)),
      color: context.color || "#FFFFFF",
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

/**
 * @description gets the key/id of a request from a property value
 * @param {*} requestProperty the property to search
 * @param {*} lookupValue the value you are looking for
 * @returns {*} the request key/id or null if not found
 */
function findRequestKey(requestProperty, lookupValue) {
  for (const [key, value] of requests.entries()) {
    if (value[requestProperty] === lookupValue) {
      return key;
    }
  }
  return null;
} //findRequestKey

function addRequest(context, link, msgid, search) {
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
    botReply("⚠ You already requested this", context.id, false);
    return;
  }

  users[userIndex].requestsCount++;
  users[userIndex].requests.push(link.id);

  //check if other users already requested this link id
  let request = requests.get(link.id);
  if (request) {
    request.by.push(users[userIndex]);
    requests.set(link.id, request);
    updatePlaylist(request);
    botReply("⚠ Someone else already requested this", context.id, false);
  } else {
    let newRequest = {
      id: link.id,
      msgid: msgid,
      type: link.type,
      approved: PLAYLIST.approvalQueue ? false : true,
      title: "",
      channel: "",
      uri: "",
      url: link?.url || "",
      duration: 0,
      views: -1,
      thumbnail: "",
      search: search,
      time: Date.now(),
      by: [users[userIndex]],
    };
    requests.set(link.id, newRequest);
    addToPlaylist(newRequest);
    getRequestInfo(newRequest, context.id);
    updatePlaylist(newRequest);
  }
  updateLength();
  updateSite();
} //addRequest

function deleteRequest(id, refund = true) {
  const request = requests.get(id);
  if (refund) {
    for (let index = 0; index < request.by.length; index++) {
      const userIndex = users.findIndex((u) => u.username === request.by[index].username);
      if (userIndex != -1) {
        users[userIndex].requestsCount--;
        users[userIndex].requests.splice(
          users[userIndex].requests.findIndex(function (r) {
            return r.value === id;
          }),
          1
        );
      }
    }
  }
  requests.delete(id);
  document.getElementById(`id${id}`).remove();
  updateLength();
  saveSettings();
} //deleteRequest

function clearPlaylist() {
  playlist_playing = false;
  total_duration = 0;
  users = [];
  requests = new Map();
  resetVoteSkip();
  resetPlayers();
  elements.mainList.innerHTML = "";
  elements.placeholder.style.display = "";
  elements.nowPlaying.innerHTML = `<span class="text-body-secondary">Nothing :)</span>`;
  elements.nowPlayingRequester.innerHTML = `<span class="text-body-secondary">No one :)</span>`;
  updateLength();
  saveSettings();
} //clearPlaylist

function clearHistory() {
  history = [];
  elements.historyList.innerHTML = "";
  elements.historyCount.innerHTML = `${history.length.toLocaleString()} ${history.length == 1 ? "item" : "items"}`;
  saveSettings();
} //clearPlaylist

function updateLength() {
  const count = requests.size;
  let duration = 0;

  for (let request of requests.values()) {
    if (request.duration == -1) {
      continue;
    }
    duration += request.duration;
  }

  elements.playlistLength.innerHTML = `${secondsToTimeString(Math.round(duration)) || "00:00"} (${count} ${count == 1 ? "item" : "items"})`;
} //updateLength

function addToPlaylist(request, position = "beforeend") {
  elements.mainList.insertAdjacentHTML(
    position,
    `<div class="container-fluid p-0 mb-1" id="id${request.id}">
        <div class="row g-1">
          <div class="col-auto thumbnail-div">
            <div id="id${request.id}_thumbnail" class="request-thumbnail">
              <div class="placeholder-glow" style="width: 160px; height: 90px">
                <span class="placeholder col-12 rounded h-100"></span>
              </div>
            </div>
            <span class="badge text-bg-dark duration-label" id="id${request.id}_duration">00:00</span>
          </div>
          <div class="col">
            <div class="vstack h-100">
              <div class="request-title mb-auto" id="id${request.id}_title" >
                <span class="placeholder-glow">
                  <span class="placeholder col-12"></span>
                </span>
                <span class="placeholder-glow">
                  <span class="placeholder col-12"></span>
                </span>
              </div>
              <small class="request-info text-body-secondary" id="id${request.id}_info" >
                <span class="placeholder-glow">
                  <span class="placeholder col-12"></span>
                </span>
              </small>
              <small class="requested-by text-body-secondary" id="id${request.id}_by" >
              Requested by: 
              ${request.by[0].badges}
              <span style="color: ${request.by[0].color}">${request.by.map((u) => u.username).join(" & ")}</span>
              </small>
            </div>
          </div>
          <div class="col-auto" style="align-self: center"><i class="material-icons notranslate delete-request" onclick="deleteRequest('${request.id}',false)">delete</i></div>
        </div>
      </div>`
  );
} //addToPlaylist

function addToHistory(request, localStorageLoad = false) {
  if (!localStorageLoad) {
    history.unshift(request);
  }
  elements.historyList.insertAdjacentHTML(
    localStorageLoad ? "beforeend" : "afterbegin",
    `<div class="container-fluid p-0 mb-1">
        <div class="row g-1">
          <div class="col-auto thumbnail-div">
            <div class="request-thumbnail">
            <img src="${request.thumbnail}" alt="thumbnail" class="rounded" />
            </div>
            <span class="badge text-bg-dark duration-label">${request.duration == -1 ? "🔴live" : secondsToTimeString(Math.round(request.duration))}</span>
          </div>
          <div class="col">
            <div class="vstack h-100">
              <div class="request-title mb-auto" title="${request.title}">
                <a 
                class="link-body-emphasis link-underline-opacity-0" 
                href="${getItemLink(request)}" 
                target="_blank" 
                rel="noopener noreferrer"> 
                ${escapeString(request.title)}
                </a>
              </div>
              <small class="request-info text-body-secondary">
              ${escapeString(request.channel)} ${request.views > -1 ? ` · ${formatViewCount(request.views)} ${request.views == 1 ? "view" : "views"}` : ""}
              </small>
              <small class="requested-by text-body-secondary" title="Requested by @${request.by.map((u) => u.username).join(" & ")}">
              Requested by 
              ${request.by[0].badges}
              <a 
              class="link-body-emphasis link-underline-opacity-0"
              href="https://www.twitch.tv/popout/${USER.channel}/viewercard/${request.by[0].username}"
              target="_blank"
              rel="noopener noreferrer">
              <span style="color: ${request.by[0].color}">${request.by[0].username}</span>
              </a>
              ${request.by.length > 1 ? `and ${request.by.length - 1} other ${request.by.length - 1 == 1 ? "user" : "users"}` : ""}
              </small>
            </div>
          </div>
        </div>
      </div>`
  );
} //addToHistory

function updatePlaylist(request, localStorageLoad = false) {
  //check if request info has been fetched
  if (request.thumbnail && request.title) {
    document.getElementById(`id${request.id}_thumbnail`).innerHTML = `
    <img 
    onmouseup="openLink(event, '${getItemLink(request)}')" 
    src="${request.thumbnail}" 
    alt="thumbnail" 
    class="rounded cursor-pointer" />`;
    document.getElementById(`id${request.id}_title`).innerHTML = `
    <a 
    class="link-body-emphasis link-underline-opacity-0"
    href="${getItemLink(request)}"
    target="_blank"
    rel="noopener noreferrer">
    ${escapeString(request.title)}
    </a>`;
    document.getElementById(`id${request.id}_title`).title = request.title;
    document.getElementById(`id${request.id}_info`).innerHTML = `
    ${escapeString(request.channel)} ${request.views > -1 ? ` · ${formatViewCount(request.views)} ${request.views == 1 ? "view" : "views"}` : ""}`;
    document.getElementById(`id${request.id}_info`).title = `
    ${escapeString(request.channel)} ${request.views > -1 ? ` · ${formatViewCount(request.views)} ${request.views == 1 ? "view" : "views"}` : ""}`;
    document.getElementById(`id${request.id}_duration`).innerText = request.duration == -1 ? "🔴live" : secondsToTimeString(Math.round(request.duration));
    document.getElementById(`id${request.id}_by`).innerHTML = `
    Requested by 
    ${request.by[0].badges}
    <a 
    class="link-body-emphasis link-underline-opacity-0"
    href="https://www.twitch.tv/popout/${USER.channel}/viewercard/${request.by[0].username}"
    target="_blank"
    rel="noopener noreferrer">
    <span style="color: ${request.by[0].color}">${request.by[0].username}</span>
    </a>
     ${request.by.length > 1 ? `and ${request.by.length - 1} other ${request.by.length - 1 == 1 ? "user" : "users"}` : ""}`;
    document.getElementById(`id${request.id}_by`).title = `Requested by @${request.by.map((u) => u.username).join(" & ")}`;

    if (!playlist_playing && PLAYLIST.autoplay && !localStorageLoad) {
      nextItem();
    }

    if (!localStorageLoad) {
      saveSettings();
    }
  } else {
    //if request info is not ready yet then update requesters only
    document.getElementById(`id${request.id}_by`).innerText = `Requested by @${request.by[0].username} ${
      request.by.length > 1 ? `and ${request.by.length - 1} other ${request.by.length - 1 == 1 ? "user" : "users"}` : ""
    }`;
  }
} //updatePlaylist

async function getRequestInfo(request, msgid) {
  //skip if request already has info
  if (request.title) {
    updatePlaylist(request);
    return;
  }
  if (request.type == "twitch clip") {
    try {
      let response = await fetch(`https://helper.donk.workers.dev/twitch/clipsxd?id=${request.id}`);
      let result = await response.json();
      console.log(result);
      request.title = result.data.data[0].title || "(untitled)";
      request.channel = result.data.data[0].broadcaster_name || "(unknown)";
      request.thumbnail = result.data.data[0].thumbnail_url;
      request.duration = result.data.data[0].duration;
      request.views = result.data.data[0].view_count;
      request.mp4 = `${result?.extra?.clip?.videoQualities[0]?.sourceURL}${result?.extra?.clipKey}`;
    } catch (error) {
      deleteRequest(request.id);
      botReply("⛔ Could not find this clip's info", msgid, false);
      console.log("getRequestInfo twitch clip error", error);
      return;
    }
  } //twitch clip

  if (request.type == "twitch vod") {
    try {
      let response = await fetch(`https://helper.donk.workers.dev/twitch/videos?id=${request.id}`);
      let result = await response.json();
      console.log(result);
      request.title = result.data[0].title || "(untitled)";
      request.channel = result.data[0].user_login || "(unknown)";
      request.thumbnail = result.data[0].thumbnail_url.replace("%{width}", "320").replace("%{height}", "180");
      request.duration = convertTwitchVODDuration(result.data[0].duration);
      request.views = result.data[0].view_count;
    } catch (error) {
      deleteRequest(request.id);
      botReply("⛔ Could not find this video's info", msgid, false);
      console.log("getRequestInfo twitch vod error", error);
      return;
    }
  } //twitch vod

  if (request.type == "twitch stream") {
    try {
      let response = await fetch(`https://helper.donk.workers.dev/twitch/streams?user_login=${request.id}`);
      let result = await response.json();
      console.log(result);
      request.title = result.data[0].title || "(untitled)";
      request.channel = result.data[0].user_name || "(unknown)";
      request.thumbnail = result.data[0].thumbnail_url.replace("{width}", "320").replace("{height}", "180");
      request.duration = -1;
    } catch (error) {
      deleteRequest(request.id);
      botReply("⛔ Could not find this stream's info", msgid, false);
      console.log("getRequestInfo twitch stream error", error);
      return;
    }
  } //twitch stream

  if (request.type == "spotify") {
    try {
      let response = await fetch(`https://helper.donk.workers.dev/spotify/tracks?ids=${request.id}`);
      let result = await response.json();
      console.log(result);
      request.title = result.tracks[0].name || "(untitled)";
      request.channel = result.tracks[0].artists[0].name || "(unknown)";
      request.thumbnail = result.tracks[0].album.images[0].url;
      request.duration = result.tracks[0].duration_ms / 1000;
      request.uri = result.tracks[0].uri;
      if (!result.tracks[0].is_playable) {
        deleteRequest(request.id);
        botReply("⛔ Your song is not playable", msgid, false);
        return;
      }
    } catch (error) {
      deleteRequest(request.id);
      botReply("⛔ Could not find this song's info", msgid, false);
      console.log("getRequestInfo spotify error", error);
      return;
    }
  } //spotify

  if (request.type == "tiktok video") {
    try {
      let response = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(request.url)}`);
      let result = await response.json();
      console.log(result);
      request.title = result.title || "(untitled)";
      request.channel = result.author_unique_id || "(unknown)";
      request.thumbnail = result.thumbnail_url;
      request.duration = 0;
    } catch (error) {
      deleteRequest(request.id);
      botReply("⛔ Could not find this video's info", msgid, false);
      console.log("getRequestInfo tiktok error", error);
      return;
    }
  } //tiktok video

  if (request.type == "youtube" || request.type == "youtube short") {
    try {
      let response = await fetch(`https://helper.donk.workers.dev/youtube/videos?id=${request.id}`);
      let result = await response.json();
      console.log(result);
      request.title = result.items[0].snippet.title || "(untitled)";
      request.channel = result.items[0].snippet.channelTitle || "(unknown)";
      request.thumbnail = result.items[0].snippet.thumbnails.medium.url;
      request.duration = ISO8601ToSeconds(result.items[0].contentDetails.duration);
      request.views = result.items[0].statistics.viewCount;

      if (result.items[0].snippet.liveBroadcastContent !== "none") {
        if (request.duration == 0) {
          request.duration = -1;
        }
        if (!PLAYLIST.allowYTStreams) {
          deleteRequest(request.id);
          botReply("🚫 YouTube streams are not allowed", msgid, false);
          return;
        }
      }

      if (result.items[0].contentDetails?.contentRating?.ytRating == "ytAgeRestricted" || !result.items[0].status?.embeddable) {
        deleteRequest(request.id);
        botReply("⛔ Your video is age restricted or not embeddable", msgid, false);
        return;
      }
    } catch (error) {
      deleteRequest(request.id);
      botReply("⛔ Could not find this video's info", msgid, false);
      console.log("getRequestInfo youtube error", error);
      return;
    }
  } //youtube

  if (request.type == "streamable") {
    try {
      let response = await fetch(`https://helper.donk.workers.dev/streamable/videos?id=${request.id}`);
      let result = await response.json();
      console.log(result);
      request.title = result.title || "(untitled)";
      request.channel = "(unknown)";
      request.thumbnail = result.thumbnail_url;
      request.duration = result.files.mp4.duration;
      request.video = result.files.mp4.url;
    } catch (error) {
      deleteRequest(request.id);
      botReply("⛔ Could not find this video's info", msgid, false);
      console.log("getRequestInfo streamable error", error);
      return;
    }
  } //streamable

  if (request.type == "supa video/audio" || request.type == "supa video" || request.type == "supa audio") {
    try {
      let response = await fetch(`https://helper.donk.workers.dev/supa/info?id=${request.id}`);
      let result = await response.json();
      console.log(result);
      request.title = result?.name?.split(".")[0] || "(untitled)";
      request.channel = "(unknown)";
      if (await checkImage(`https://i.supa.codes/t/${request.id}`)) {
        request.thumbnail = `https://i.supa.codes/t/${request.id}`;
      } else {
        request.thumbnail = "https://chat.vote/pics/nothumbnail.png";
      }
      request.duration = result?.mediainfo?.duration || 0;

      //update type here bcz video and audio links are the same and checking file extension is not reliable
      if (result.type.startsWith("video")) {
        if (!PLAYLIST.allowSupaVideo) {
          botReply(`🚫 supa video links are not enabled`, msgid, false);
          deleteRequest(request.id);
          return;
        }
        request.type = "supa video";
      }
      if (result.type.startsWith("audio")) {
        if (!PLAYLIST.allowSupaVideo) {
          botReply(`🚫 supa audio links are not enabled`, msgid, false);
          deleteRequest(request.id);
          return;
        }
        request.type = "supa audio";
      }

      if (!result.type.startsWith("audio") && !result.type.startsWith("video")) {
        deleteRequest(request.id);
        botReply("🚫 Only video and audio files are allowed", msgid, false);
        return;
      }
    } catch (error) {
      deleteRequest(request.id);
      botReply("⛔ Could not find this link's info", msgid, false);
      console.log("getRequestInfo supa error", error);
      return;
    }
  } //supa

  if (PLAYLIST.maxDuration !== "" && request.duration !== -1 && total_duration + request.duration > PLAYLIST.maxDuration * (PLAYLIST.maxDurationUnit == "m" ? 60 : 3600)) {
    if (playlist_open) {
      togglePlaylist();
    }
    deleteRequest(request.id);
    botReply(`⛔ The playlist's duration limit was reached (${PLAYLIST.maxDuration}${PLAYLIST.maxDurationUnit})`, msgid, false);
    return;
  }

  if (PLAYLIST.maxLength !== "" && request.duration !== -1 && request.duration > PLAYLIST.maxLength * 60) {
    deleteRequest(request.id);
    botReply(`⛔ Your request is too long (${PLAYLIST.maxLength}m max)`, msgid, false);
    return;
  }

  if (PLAYLIST.maxSize !== "" && requests.size > PLAYLIST.maxSize) {
    if (playlist_open) {
      togglePlaylist();
    }
    deleteRequest(request.id);
    botReply(`⛔ The playlist's size limit was reached (${PLAYLIST.maxSize})`, msgid, false);
    return;
  }

  if (PLAYLIST.minViewCount !== "" && request.views !== -1 && request.views < PLAYLIST.minViewCount) {
    deleteRequest(request.id);
    botReply(`⛔ Your request does not meet the minimum view count (${PLAYLIST.minViewCount.toLocaleString()})`, msgid, false);
    return;
  }

  if (PLAYLIST.uniqueOnly && history.some((e) => e.id === request.id)) {
    deleteRequest(request.id);
    botReply(`⛔ Your request is not unique`, msgid, false);
    return;
  }

  if (request.duration !== -1) {
    total_duration += request.duration;
  }
  updatePlaylist(request);
  updateLength();
  if (currentItem && request) {
    let reply = "";
    if (request.search) {
      reply += `✅ Added ${getItemLink(request)} to the playlist`;
    } else {
      reply += `✅ Your request has been added to the playlist`;
    }

    switch (requests.size) {
      case 0:
        reply += ` | Playing right now!`;
        break;
      case 1:
        reply += ` | Playing right after the current request (<${secondsToTimeString(currentItem.duration)})`;
        break;
      default:
        reply += ` | ${requests.size - 1} ${requests.size - 1 == 1 ? "request" : "requests"} ahead of you (${secondsToTimeString(total_duration + currentItem.duration - request.duration)})`;
        break;
    }

    botReply(reply, msgid, false);
  } else {
    if (request.search) {
      botReply(`✅ Added ${getItemLink(request)} to the playlist`, msgid, false);
    } else {
      botReply(`✅ Your request has been added to the playlist`, msgid, false);
    }
  }
} //getRequestInfo

/**
 * @description gets the video/track/clip/vod id or stream username from a url string
 * @param {string} link
 * @returns {Object}
 */
async function parseLink(link) {
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

  if (link.toLowerCase().startsWith("youtube")) {
    if (!link.toLowerCase().replace("youtube", "").trim()) {
      return null;
    }
    try {
      let response = await fetch(`https://helper.donk.workers.dev/youtube/search?query=${encodeURIComponent(link.toLowerCase().replace("youtube", "").trim())}`);
      let result = await response.json();
      console.log(result);
      if (result.items.length == 0) {
        return null;
      }

      return { type: "youtube", id: result.items[0].id.videoId };
    } catch (error) {
      return null;
    }
  } //youtube search

  if (link.includes("spotify.com")) {
    const spotifyURLRegex = /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:(album|track|playlist)\/|\?uri=spotify:track:)((\w|-){22})/;
    let id = link.match(spotifyURLRegex);
    if (!id[2] || id[1] !== "track") {
      return null;
    }
    return { type: "spotify", id: id[2] };
  } //spotify

  if (link.includes("tiktok.com")) {
    const tiktokURLRegex = /^.*https:\/\/(?:m|www|vm)?\.?tiktok\.com\/((?:.*\b(?:(?:usr|v|embed|user|video)\/|\?shareId=|\&item_id=)(\d+))|\w+)/;
    let id = link.match(tiktokURLRegex);
    if (!id[2] || !id[1].includes("/video/")) {
      return null;
    }
    return { type: "tiktok video", id: id[2], url: link.split("?")[0] };
  } //tiktok

  if (link.toLowerCase().startsWith("spotify")) {
    if (!link.toLowerCase().replace("spotify", "").trim()) {
      return null;
    }
    try {
      let response = await fetch(`https://helper.donk.workers.dev/spotify/search?q=${encodeURIComponent(link.toLowerCase().replace("spotify", "").trim())}`);
      let result = await response.json();
      console.log(result);
      if (result.tracks.items.length == 0) {
        return null;
      }

      return { type: "spotify", id: result.tracks.items[0].id };
    } catch (error) {
      return null;
    }
  } //spotify search

  if (link.includes("streamable.com")) {
    const match = link.match(/streamable\.com\/([a-zA-Z0-9]+)/);
    if (!match[1]) {
      return null;
    }
    return { type: "streamable", id: match[1] };
  } //spotify

  if (link.includes("i.supa.codes") || link.includes("gachi.gay") || link.includes("kappa.lol") || link.includes("femboy.beauty")) {
    const match = link.match(/\/([0-9a-zA-Z_-]{5,})(?:[?/.].*)?$/);
    console.log(match);
    if (!match[1]) {
      return null;
    }
    return { type: "supa video/audio", id: match[1] };
  } //supa

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
  if (type == "supa video/audio" && !PLAYLIST.allowSupaVideo && !PLAYLIST.allowSupaAudio) {
    //supa links dont have a specific type yet so check if both are disabled
    return false;
  }
  if (type == "tiktok video" && !PLAYLIST.allowTiktokVideos) {
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

function getItemLink(request) {
  switch (request.type) {
    case "youtube":
      return `https://youtu.be/${request.id}`;
    case "youtube short":
      return `https://youtube.com/shorts/${request.id}`;
    case "spotify":
      return `https://open.spotify.com/track/${request.id}`;
    case "tiktok video":
      return request.url;
    case "twitch stream":
      return `https://www.twitch.tv/${request.id}`;
    case "twitch vod":
      return `https://www.twitch.tv/videos/${request.id}`;
    case "twitch clip":
      return `https://clips.twitch.tv/${request.id}`;
    case "streamable":
      return `https://streamable.com/${request.id}`;
    case "supa video":
    case "supa audio":
    case "supa video/audio":
      return `https://i.supa.codes/${request.id}`;
    default:
      return "";
  }
} //getItemLink

function openLink(event, link) {
  if (event.button < 2) {
    window.open(link, "_blank").focus();
  }
} //openLink

async function addLink() {
  if (!checkLogin()) {
    return;
  }
  let request = elements.link.value?.replace(/\s+/g, "");
  let search = false;
  if (elements.link.value.toLowerCase().startsWith("youtube") || elements.link.value.toLowerCase().startsWith("spotify")) {
    request = elements.link.value.trim();
    search = true;
  }
  let link = await parseLink(request);

  console.log(link);
  if (!link) {
    showToast("Could not parse your request", "warning", 3000);
    elements.link.value = "";
    return;
  }
  if (!linkTypeAllowed(link.type)) {
    showToast(`${link.type} links are not enabled`, "warning", 3000);
    elements.link.value = "";
    return;
  }
  addRequest(
    {
      id: "toast",
      "user-id": USER.userID,
      username: USER.channel,
      displayName: USER.channel,
      mod: true,
      sub: true,
      vip: true,
      firstTimeChatter: false,
      badges: "streamer",
      color: streamerColor,
    },
    link,
    0,
    search
  );
  elements.link.value = "";
} //addLink

let historyIndex = -1;
function previousItem(reply) {
  if (history.length == 0) {
    return;
  }

  resetPlayers();
  resetVoteSkip();

  if (currentItem?.id == history[historyIndex + 1]?.id) {
    historyIndex++;
  }

  currentItem = history[++historyIndex];

  if (!currentItem) {
    playlist_playing = false;
    elements.placeholder.style.display = "";
    elements.nowPlaying.innerHTML = `<span class="text-body-secondary">Nothing :)</span>`;
    elements.nowPlayingRequester.innerHTML = `<span class="text-body-secondary">No one :)</span>`;
    return;
  }

  if (reply) {
    botReply(`⏪ Rewinded`, reply, false);
  }

  console.log(currentItem);
  playItem(currentItem);
  updateLength();
  saveSettings();
} //previousItem

function deleteItem(id, reply) {
  let request = requests.get(id);

  if (!request) {
    botReply(`⚠ Request not found`, reply, false);
    return;
  }

  deleteRequest(id, false);
  botReply(`🗑️ Request deleted`, reply, false);

  updateLength();
  saveSettings();
} //deleteItem

let currentItem;
function nextItem(reply) {
  resetPlayers();
  resetVoteSkip();

  if (reply) {
    botReply(`⏩ Skipped`, reply, false);
  }

  if (historyIndex > 0) {
    currentItem = history[--historyIndex];
  } else {
    //get key of first request
    let currentKey = requests.keys().next().value;
    //get the request data
    currentItem = requests.get(currentKey);
    //delete the request
    requests.delete(currentKey);

    historyIndex = -1;
    if (currentItem) {
      addToHistory(currentItem);
      deleteRequest(currentItem.id, false);
      elements.historyCount.innerHTML = `${history.length.toLocaleString()} ${history.length == 1 ? "item" : "items"}`;
    }
  }
  if (!currentItem) {
    playlist_playing = false;
    elements.placeholder.style.display = "";
    elements.nowPlaying.innerHTML = `<span class="text-body-secondary">Nothing :)</span>`;
    elements.nowPlayingRequester.innerHTML = `<span class="text-body-secondary">No one :)</span>`;
    return;
  }
  console.log(currentItem);
  playItem(currentItem);
  updateLength();
  saveSettings();
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
      if (item?.mp4 && Date.now() - item.time < 19 * 60 * 60 * 1000) {
        elements.videoEmbed.style.display = "";
        elements.videoEmbed.src = item.mp4;
      } else {
        elements.twitchClipsEmbed.style.display = "";
        elements.twitchClipsEmbed.innerHTML = `<iframe src="https://clips.twitch.tv/embed?clip=${item.id}&parent=${window.location.hostname}&autoplay=true&muted=false" preload="auto" height="100%" width="100%"></iframe>`;
      }
      break;
    case "tiktok video":
      elements.tiktokEmbed.style.display = "";
      elements.tiktokEmbed.innerHTML = `<iframe id="tiktokIframe" src="https://www.tiktok.com/player/v1/${item.id}?autoplay=1&rel=0" preload="auto" height="100%" width="100%"></iframe>`;
      break;
    case "streamable":
      elements.videoEmbed.style.display = "";
      elements.videoEmbed.src = item.video;
      break;
    case "supa video":
    case "supa audio":
      elements.videoEmbed.style.display = "";
      elements.videoEmbed.src = `https://i.supa.codes/${item.id}`;
      break;
    default:
      break;
  }

  if (currentItem.duration !== -1) {
    total_duration -= currentItem.duration;
  }

  elements.nowPlaying.innerHTML = `
  <a 
  class="link-body-emphasis link-underline-opacity-0"
  href="${getItemLink(currentItem)}"
  target="_blank"
  rel="noopener noreferrer">
  ${escapeString(currentItem.title)}
  </a>`;
  elements.nowPlaying.title = currentItem.title;
  elements.nowPlayingRequester.innerHTML = `
  ${currentItem.by[0].badges}
  <a 
  class="link-body-emphasis link-underline-opacity-0"
  href="https://www.twitch.tv/popout/${USER.channel}/viewercard/${currentItem.by[0].username}"
  target="_blank"
  rel="noopener noreferrer">
  <span style="color: ${currentItem.by[0].color}">${currentItem.by[0].username}</span>
  </a>
  ${currentItem.by.length > 1 ? `and ${currentItem.by.length - 1} other ${currentItem.by.length - 1 == 1 ? "user" : "users"}` : ""}`;
  elements.nowPlayingRequester.title = currentItem.by.map((u) => u.username).join(" & ");
  playlist_playing = true;
  updateMetadata();
} //playItem

function updateMetadata() {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentItem.title,
      artist: currentItem.channel,
      album: `Requested By: ${currentItem.by.map((u) => u.username).join(" & ")}`,
      artwork: [
        {
          src: currentItem.thumbnail,
        },
      ],
    });
  }
} //updateMetadata

function resetPlayers() {
  elements.placeholder.style.display = "none";
  elements.youtubeEmbedContainer.style.display = "none";
  elements.spotifyEmbedContainer.style.display = "none";
  elements.twitchEmbed.style.display = "none";
  elements.twitchClipsEmbed.style.display = "none";
  elements.tiktokEmbed.style.display = "none";
  elements.videoEmbed.style.display = "none";

  youtubePlayer.loadVideoById("");
  spotifyPlayer.pause();
  twitchPlayer.setChannel("");
  elements.twitchClipsEmbed.innerHTML = "";
  elements.tiktokEmbed.innerHTML = "";
  elements.videoEmbed.src = "";
} //resetPlayers

let voteskipTimeout;
function voteSkip(userid) {
  if (!playlist_playing || !PLAYLIST.allowVoteSkip) {
    return;
  }

  if (elements.voteSkipDiv.style.display == "none") {
    elements.voteSkipDiv.style.display = "";
    anime({
      targets: `#voteSkipDiv`,
      easing: "easeOutElastic",
      translateY: ["-100%", 0],
    });
  }

  clearTimeout(voteskipTimeout);
  voteskipTimeout = setTimeout(() => {
    //hide voteskip counter if no more votes come in
    anime({
      targets: `#voteSkipDiv`,
      easing: "easeOutBounce",
      duration: 2000,
      translateY: [0, "-100%"],
      complete: function (anim) {
        elements.voteSkipDiv.style.display = "none";
      },
    });
  }, 5000);

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
    translateY: [0, "-100%"],
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
  await load_localStorage();
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

let botCooldown = Date.now();
async function botReply(msg, id, followCooldown) {
  if (id == "toast") {
    showToast(msg, "info", 2000);
    return;
  }

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
  };
  try {
    let response = await fetch(`https://api.chat.vote/reply`, requestOptions);
    console.log(`botReply response: ${response.status}`);
  } catch (error) {
    console.log("botReply error", error);
  }
} //botReply

let updateCooldown;
async function updateSite() {
  clearTimeout(updateCooldown);
  if (USER.access_token) {
    updateCooldown = setTimeout(() => {
      updateSiteSend();
    }, 3000);
  }
} //updateSite

async function updateSiteSend() {
  let requestsArray = [];

  for (let request of requests.values()) {
    requestsArray.push(request);
  }

  let body = JSON.stringify({
    userid: USER.userID,
    username: USER.channel,
    access_token: USER.access_token,
    time: new Date(),
    settings: PLAYLIST,
    playlist: requestsArray,
    currentitem: currentItem,
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
    let response = await fetch(`https://playlist.chat.vote/update`, requestOptions);
    let result = await response.json();
    console.log(result);
  } catch (error) {
    console.log("update error", error);
  }
} //updateSiteSend

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
    elements.openCommand,
    elements.closeCommand,
    elements.playCommand,
    elements.pauseCommand,
    elements.autoplayCommand,
    elements.skipCommand,
    elements.rewindCommand,
    elements.deleteCommand,
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

function togglePlaylist() {
  if (!checkLogin()) {
    return;
  }
  playlist_open = !playlist_open;
  if (playlist_open) {
    elements.togglePlaylist.classList = "btn btn-danger";
    elements.togglePlaylist.innerHTML = "Close Playlist";
  } else {
    elements.togglePlaylist.classList = "btn btn-success";
    elements.togglePlaylist.innerHTML = "Open Playlist";
  }
} //togglePlaylist

function openPlaylist(reply) {
  if (!playlist_open) {
    playlist_open = true;
    elements.togglePlaylist.classList = "btn btn-danger";
    elements.togglePlaylist.innerHTML = "Close Playlist";
    botReply(`✅ The playlist is now open`, reply, false);
  } else {
    botReply(`✅ The playlist already open`, reply, false);
  }
} //openPlaylist
function closePlaylist(reply) {
  if (playlist_open) {
    playlist_open = false;
    elements.togglePlaylist.classList = "btn btn-success";
    elements.togglePlaylist.innerHTML = "Open Playlist";
    botReply(`⛔ The playlist is now closed`, reply, false);
  } else {
    botReply(`⛔ The playlist already closed`, reply, false);
  }
} //closePlaylist

function playPlaylist(reply) {
  if (!currentItem) {
    botReply(`⚠ Nothing is playing`, reply, false);
    return;
  }
  let twitchClipMP4 = false;
  switch (currentItem.type) {
    case "youtube":
    case "youtube short":
      youtubePlayer.playVideo();
      break;
    case "spotify":
      spotifyPlayer.play();
      break;
    case "twitch stream":
    case "twitch vod":
      twitchPlayer.play();
      break;
    case "twitch clip":
      if (currentItem?.mp4 && Date.now() - currentItem.time < 19 * 60 * 60 * 1000) {
        elements.videoEmbed.play();
        twitchClipMP4 = true;
      }
      break;
    case "tiktok video":
      document.getElementById("tiktokIframe").contentWindow.postMessage({ type: "play", "x-tiktok-player": true }, "*");
      break;
    case "streamable":
    case "supa video":
    case "supa audio":
      elements.videoEmbed.play();
      break;
    default:
      break;
  }

  if (reply) {
    if (!twitchClipMP4) {
      botReply(`⚠ Twitch clip playback can't be controlled`, reply, false);
    } else {
      botReply(`▶ Playlist is now playing`, reply, false);
    }
  }
} //playPlaylist

function pausePlaylist(reply) {
  if (!currentItem) {
    botReply(`⚠ Nothing is playing`, reply, false);
    return;
  }
  let twitchClipMP4 = false;
  switch (currentItem.type) {
    case "youtube":
    case "youtube short":
      youtubePlayer.pauseVideo();
      break;
    case "spotify":
      spotifyPlayer.pause();
      break;
    case "twitch stream":
    case "twitch vod":
      twitchPlayer.pause();
      break;
    case "twitch clip":
      if (currentItem?.mp4 && Date.now() - currentItem.time < 19 * 60 * 60 * 1000) {
        elements.videoEmbed.pause();
        twitchClipMP4 = true;
      }
      break;
    case "tiktok video":
      document.getElementById("tiktokIframe").contentWindow.postMessage({ type: "pause", "x-tiktok-player": true }, "*");
      break;
    case "streamable":
    case "supa video":
    case "supa audio":
      elements.videoEmbed.pause();
      break;
    default:
      break;
  }

  if (reply) {
    if (!twitchClipMP4) {
      botReply(`⚠ Twitch clip playback can't be controlled`, reply, false);
    } else {
      botReply(`⏸ Playlist is now paused`, reply, false);
    }
  }
} //pausePlaylist

function toggleAutoplay(reply) {
  let enabled = elements.autoplay.checked;
  elements.autoplay.checked = !enabled;
  botReply(`${enabled ? "❌" : "✅"} autoplay is now ${enabled ? "disabled" : "enabled"}`, reply, false);
  saveSettings();
} //toggleAutoplay

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
  togglePlaylistPopover = new bootstrap.Popover(elements.togglePlaylist);

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

  elements.selectAll.addEventListener("click", (event) => {
    toggleEveryone(true);
    saveSettings();
  });
  elements.unselectAll.addEventListener("click", (event) => {
    toggleEveryone(false);
    saveSettings();
  });

  elements.link.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      await addLink();
    }
  });

  elements.link.addEventListener("focus", async function () {
    if (!streamerColor && USER.userID) {
      streamerColor = await getStreamerColor(USER.userID);
    }
  });

  if ("mediaSession" in navigator) {
    navigator.mediaSession.setActionHandler("previoustrack", () => {
      previousItem();
    });
    navigator.mediaSession.setActionHandler("nexttrack", () => {
      nextItem();
    });
  }

  enableTooltips();
  enableTwitchEmbed();
  videoEmbedEventListeners();
  tiktokEmbedEventListeners();
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
  if (event.data == YT.PlayerState.ENDED && PLAYLIST.autoplay) {
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
      if (event.data.position == event.data.duration && event.data.duration > 0 && PLAYLIST.autoplay) {
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
    if (PLAYLIST.autoplay) {
      nextItem();
    }
  }
  function twitchPlayerPaused(event) {
    console.log(event);
  }
} //enableTwitchEmbed

function videoEmbedEventListeners() {
  elements.videoEmbed.addEventListener("ended", (event) => {
    if (PLAYLIST.autoplay) {
      nextItem();
    }
  });
} //videoEmbedEventListeners

function tiktokEmbedEventListeners() {
  window.addEventListener("message", (event) => {
    if (!event?.data?.["x-tiktok-player"]) {
      return;
    }
    if (event.data.type == "onStateChange" && event.data.value == 0) {
      nextItem();
    }
  });
} //tiktokEmbedEventListeners
