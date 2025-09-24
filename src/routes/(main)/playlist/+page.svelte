<script>
  import IcBaselineDeleteForever from "~icons/ic/baseline-delete-forever";
  import IcBaselineVisibility from "~icons/ic/baseline-visibility";
  import IcBaselineSettings from "~icons/ic/baseline-settings";
  import IcBaselinePlaylistAddCheck from "~icons/ic/baseline-playlist-add-check";
  import IcBaselinePlaylistPlay from "~icons/ic/baseline-playlist-play";
  import IcBaselinePlaylistRemove from "~icons/ic/baseline-playlist-remove";
  import IcBaselineDeleteSweep from "~icons/ic/baseline-delete-sweep";
  import IcBaselineFileDownload from "~icons/ic/baseline-file-download";
  import IcBaselineAdd from "~icons/ic/baseline-add";
  import IcBaselineHelp from "~icons/ic/baseline-help";
  import IcBaselineSkipNext from "~icons/ic/baseline-skip-next";
  import IcBaselineSkipPrevious from "~icons/ic/baseline-skip-previous";
  import IcBaselineContentCopy from "~icons/ic/baseline-content-copy";
  import IcBaselineVolumeUp from "~icons/ic/baseline-volume-up";
  import IcBaselinePause from "~icons/ic/baseline-pause";
  import IcBaselinePlayArrow from "~icons/ic/baseline-play-arrow";
  import IcBaselineAccessTimeFilled from "~icons/ic/baseline-access-time-filled";
  import IcBaselineFavorite from "~icons/ic/baseline-favorite";
  import IcBaselineFavoriteBorder from "~icons/ic/baseline-favorite-border";
  import IcBaselineHeartBroken from "~icons/ic/baseline-heart-broken";
  import IcBaselineHistory from "~icons/ic/baseline-history";
  import IcBaselineAccountCircle from "~icons/ic/baseline-account-circle";
  import IcBaselineInfo from "~icons/ic/baseline-info";
  import IcBaselineDelete from "~icons/ic/baseline-delete";
  import IcBaselinePlayCircle from "~icons/ic/baseline-play-circle";
  import IcBaselineDoubleArrow from "~icons/ic/baseline-double-arrow";
  import IcBaselineMoreVert from "~icons/ic/baseline-more-vert";
  import IcBaselineSmartToy from "~icons/ic/baseline-smart-toy";
  import IcBaselineLink from "~icons/ic/baseline-link";
  import IcBaselineLanguage from "~icons/ic/baseline-language";
  import IcBaselineGroup from "~icons/ic/baseline-group";
  import IcBaselineHourglassTop from "~icons/ic/baseline-hourglass-top";
  import IcBaselineGavel from "~icons/ic/baseline-gavel";
  import IcBaselineRule from "~icons/ic/baseline-rule";
  import IcBaselineFormatListNumbered from "~icons/ic/baseline-format-list-numbered";
  import IcBaselineLightbulb from "~icons/ic/baseline-lightbulb";
  import IcBaselineVerifiedUser from "~icons/ic/baseline-verified-user";
  import IcBaselineShield from "~icons/ic/baseline-shield";
  import IcBaselineIncompleteCircle from "~icons/ic/baseline-incomplete-circle";
  import IcBaselineHowToVote from "~icons/ic/baseline-how-to-vote";
  import IcBaselineChat from "~icons/ic/baseline-chat";
  import IcBaselineHistoryToggleOff from "~icons/ic/baseline-history-toggle-off";
  import IcBaselineCalendarMonth from "~icons/ic/baseline-calendar-month";
  import IcBaselineDateRange from "~icons/ic/baseline-date-range";
  import IcBaselineCalendarToday from "~icons/ic/baseline-calendar-today";
  import IcBaselineTimelapse from "~icons/ic/baseline-timelapse";
  import IcBaselineSchedule from "~icons/ic/baseline-schedule";
  import IcBaselineChecklist from "~icons/ic/baseline-checklist";
  import IcBaselineLiveTv from "~icons/ic/baseline-live-tv";
  import MdiTwitch from "~icons/mdi/twitch";
  import MdiYoutube from "~icons/mdi/youtube";
  import MdiSpotify from "~icons/mdi/spotify";
  import MdiVimeo from "~icons/mdi/vimeo";
  import IcBaselineTiktok from "~icons/ic/baseline-tiktok";

  import { convertTwitchVODDuration, enableTooltips, escapeString, formatViewCount, replacer, secondsToTimeString, showToast, timeStringToSeconds, timeToSeconds } from "$lib/functions";
  import { animate } from "animejs";
  import { onMount } from "svelte";
  import localforage from "localforage";

  let elements;

  onMount(async () => {
    elements = {
      //modals
      dankUpdateModal: document.getElementById("dankUpdateModal"),
      banlistModal: document.getElementById("banlistModal"),
      bannedUsersList: document.getElementById("bannedUsersList"),
      bannedItemsList: document.getElementById("bannedItemsList"),
      bannedChannelsList: document.getElementById("bannedChannelsList"),
      bannedUserCount: document.getElementById("bannedUserCount"),
      bannedItemCount: document.getElementById("bannedItemCount"),
      bannedChannelCount: document.getElementById("bannedChannelCount"),

      voteSkipDiv: document.getElementById("voteSkipDiv"),
      voteSkipHint: document.getElementById("voteSkipHint"),
      voteSkipVotes: document.getElementById("voteSkipVotes"),

      //navbar
      status: document.getElementById("status"),
      topRight: document.getElementById("topRight"),
      loginButton: document.getElementById("loginButton"),
      channelName: document.getElementById("channelName"),

      //settings
      settingsOffcanvas: document.getElementById("settingsOffcanvas"),
      allowSpotifySongs: document.getElementById("allowSpotifySongs"),
      allowStreamable: document.getElementById("allowStreamable"),
      allowTwitchClips: document.getElementById("allowTwitchClips"),
      allowTwitchStreams: document.getElementById("allowTwitchStreams"),
      allowTwitchVODs: document.getElementById("allowTwitchVODs"),
      allowTiktokVideos: document.getElementById("allowTiktokVideos"),
      allowYTStreams: document.getElementById("allowYTStreams"),
      allowYTShorts: document.getElementById("allowYTShorts"),
      allowYTVideos: document.getElementById("allowYTVideos"),
      allowVimeoVideos: document.getElementById("allowVimeoVideos"),
      maxDuration: document.getElementById("maxDuration"),
      maxDurationUnit: document.getElementById("maxDurationUnit"),
      maxLength: document.getElementById("maxLength"),
      maxSize: document.getElementById("maxSize"),
      minViewCount: document.getElementById("minViewCount"),
      minUploadAge: document.getElementById("minUploadAge"),
      minUploadAgeUnit: document.getElementById("minUploadAgeUnit"),
      maxUploadAge: document.getElementById("maxUploadAge"),
      maxUploadAgeUnit: document.getElementById("maxUploadAgeUnit"),
      uploadAgeDesc: document.getElementById("uploadAgeDesc"),
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
      enableFavorites: document.getElementById("enableFavorites"),

      //main
      playersCard: document.getElementById("playersCard"),
      placeholder: document.getElementById("placeholder"),
      youtubeEmbedContainer: document.getElementById("youtubeEmbedContainer"),
      youtubeEmbed: document.getElementById("youtubeEmbed"),
      vimeoEmbedContainer: document.getElementById("vimeoEmbedContainer"),
      vimeoEmbed: document.getElementById("vimeoEmbed"),
      spotifyEmbedContainer: document.getElementById("spotifyEmbedContainer"),
      spotifyEmbed: document.getElementById("spotifyEmbed"),
      twitchEmbed: document.getElementById("twitchEmbed"),
      twitchClipsEmbed: document.getElementById("twitchClipsEmbed"),
      tiktokEmbed: document.getElementById("tiktokEmbed"),
      videoEmbed: document.getElementById("videoEmbed"),

      commandHint: document.getElementById("commandHint"),
      commandHint2: document.getElementById("commandHint2"),
      link: document.getElementById("link"),

      //playlist
      playlistTab: document.getElementById("playlistTab"),
      approvalTabButton: document.getElementById("approvalTabButton"),
      approvalTab: document.getElementById("approvalTab"),
      mainList: document.getElementById("mainList"),
      approvalList: document.getElementById("approvalList"),
      historyTab: document.getElementById("historyTab"),
      historyCount: document.getElementById("historyCount"),
      favoriteCount: document.getElementById("favoriteCount"),
      showFavorites: document.getElementById("showFavorites"),
      historyList: document.getElementById("historyList"),

      //bottom row
      profileLink: document.getElementById("profileLink"),
      copyLinkButton: document.getElementById("copyLinkButton"),
      nowPlaying: document.getElementById("nowPlaying"),
      nowPlayingRequester: document.getElementById("nowPlayingRequester"),
      nowPlayingInfo: document.getElementById("nowPlayingInfo"),
      nowPlayingBanButtons: document.getElementById("nowPlayingBanButtons"),
      favoriteButtonDiv: document.getElementById("favoriteButtonDiv"),
      favoriteButton: document.getElementById("favoriteButton"),
      playlistLength: document.getElementById("playlistLength"),
      togglePlaylist: document.getElementById("togglePlaylist"),
      autoplay: document.getElementById("autoplay"),
      volumeSliderIcon: document.getElementById("volumeSliderIcon"),
      volumeSlider: document.getElementById("volumeSlider"),
      volumeSliderValue: document.getElementById("volumeSliderValue"),
    };

    dankUpdateModal = new bootstrap.Modal(elements.dankUpdateModal);
    banlistModal = new bootstrap.Modal(elements.banlistModal);
    settingsOffcanvas = new bootstrap.Offcanvas(elements.settingsOffcanvas);
    copyLinkButton = new bootstrap.Popover(elements.copyLinkButton);
    togglePlaylistPopover = new bootstrap.Popover(elements.togglePlaylist);

    elements.banlistModal.addEventListener("show.bs.modal", (event) => {
      loadBanLists();
    });

    enablePopovers();

    let resetSettingsPopover = new bootstrap.Popover("#resetSettingsPopover", {
      trigger: "focus",
      html: true,
      sanitize: false,
      container: ".offcanvas-body",
    });

    playlistTab = new bootstrap.Tab(elements.playlistTab);
    approvalTab = new bootstrap.Tab(elements.approvalTab);
    historyTab = new bootstrap.Tab(elements.historyTab);

    if (!USER.channel) {
      loginButton = new bootstrap.Popover(elements.loginButton);
    }

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
  });

  let client;
  let currentTime = 0;
  let loginButton;
  let settingsOffcanvas;
  let dankUpdateModal, banlistModal;
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
  let favorites = [];
  let bannedUsers = new Map();
  let bannedItems = new Map();
  let bannedChannels = new Map();
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
    allowTwitchClips: true,
    allowTwitchStreams: true,
    allowTwitchVODs: true,
    allowTiktokVideos: true,
    allowYTStreams: true,
    allowYTShorts: true,
    allowYTVideos: true,
    allowVimeoVideos: true,
    maxDuration: "",
    maxDurationUnit: "m",
    maxLength: "",
    maxSize: "",
    minViewCount: "",
    minUploadAge: "",
    minUploadAgeUnit: "h",
    maxUploadAge: "",
    maxUploadAgeUnit: "h",
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
    enableFavorites: false,
  };

  async function refreshData() {
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
    PLAYLIST.allowTwitchClips = elements.allowTwitchClips.checked;
    PLAYLIST.allowTwitchStreams = elements.allowTwitchStreams.checked;
    PLAYLIST.allowTwitchVODs = elements.allowTwitchVODs.checked;
    PLAYLIST.allowTiktokVideos = elements.allowTiktokVideos.checked;
    PLAYLIST.allowYTStreams = elements.allowYTStreams.checked;
    PLAYLIST.allowYTShorts = elements.allowYTShorts.checked;
    PLAYLIST.allowYTVideos = elements.allowYTVideos.checked;
    PLAYLIST.allowVimeoVideos = elements.allowVimeoVideos.checked;
    PLAYLIST.maxDuration = parseInt(elements.maxDuration.value, 10) || "";
    PLAYLIST.maxDurationUnit = elements.maxDurationUnit.value || "m";
    PLAYLIST.maxLength = parseInt(elements.maxLength.value, 10) || "";
    PLAYLIST.maxSize = parseInt(elements.maxSize.value, 10) || "";
    PLAYLIST.minViewCount = parseInt(elements.minViewCount.value, 10) || "";
    PLAYLIST.minUploadAge = parseInt(elements.minUploadAge.value, 10) || "";
    PLAYLIST.minUploadAgeUnit = elements.minUploadAgeUnit.value || "h";
    PLAYLIST.maxUploadAge = parseInt(elements.maxUploadAge.value, 10) || "";
    PLAYLIST.maxUploadAgeUnit = elements.maxUploadAgeUnit.value || "h";
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
    PLAYLIST.enableFavorites = elements.enableFavorites.checked;

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

    let min = numberAndUnitToSeconds(PLAYLIST.minUploadAge, PLAYLIST.minUploadAgeUnit) * 1000;
    let max = numberAndUnitToSeconds(PLAYLIST.maxUploadAge, PLAYLIST.maxUploadAgeUnit) * 1000;
    let now = Date.now();

    if (min > 0 && max > 0 && min == max) {
      PLAYLIST.minUploadAge = "";
      PLAYLIST.maxUploadAge = "";
      elements.minUploadAge.value = "";
      elements.maxUploadAge.value = "";
      showToast("Limits can't be the same", "warning", 3000);
    }

    if (min > 0 && max > 0 && min > max) {
      PLAYLIST.minUploadAge = "";
      PLAYLIST.maxUploadAge = "";
      elements.minUploadAge.value = "";
      elements.maxUploadAge.value = "";
      showToast("Older than limit must be less than the Newer than limit", "warning", 5000);
    }

    if (PLAYLIST.minUploadAge && PLAYLIST.maxUploadAge) {
      elements.uploadAgeDesc.innerHTML = `Content must be uploaded between ${new Date(now - max).toLocaleString("en-GB")} and ${new Date(now - min).toLocaleString("en-GB")}`;
    }

    if (PLAYLIST.minUploadAge && !PLAYLIST.maxUploadAge) {
      elements.uploadAgeDesc.innerHTML = `Content must be uploaded before ${new Date(now - min).toLocaleString("en-GB")}`;
    }

    if (!PLAYLIST.minUploadAge && PLAYLIST.maxUploadAge) {
      elements.uploadAgeDesc.innerHTML = `Content must be uploaded after ${new Date(now - max).toLocaleString("en-GB")}`;
    }

    if (!PLAYLIST.minUploadAge && !PLAYLIST.maxUploadAge) {
      elements.uploadAgeDesc.innerHTML = `No age limits set`;
    }

    if (PLAYLIST.enableFavorites) {
      elements.favoriteButtonDiv.style.display = "";
    } else {
      elements.favoriteButtonDiv.style.display = "none";
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
    localforage.setItem("PLAYLIST_FAVORITES", JSON.stringify(favorites));
    localforage.setItem("PLAYLIST_BANNED_USERS", JSON.stringify(bannedUsers, replacer));
    localforage.setItem("PLAYLIST_BANNED_ITEMS", JSON.stringify(bannedItems, replacer));
    localforage.setItem("PLAYLIST_BANNED_CHANNELS", JSON.stringify(bannedChannels, replacer));
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
      elements.allowTwitchClips.checked = PLAYLIST.allowTwitchClips ?? true;
      elements.allowTwitchStreams.checked = PLAYLIST.allowTwitchStreams ?? true;
      elements.allowTwitchVODs.checked = PLAYLIST.allowTwitchVODs ?? true;
      elements.allowTiktokVideos.checked = PLAYLIST.allowTiktokVideos ?? true;
      elements.allowYTStreams.checked = PLAYLIST.allowYTStreams ?? true;
      elements.allowYTShorts.checked = PLAYLIST.allowYTShorts ?? true;
      elements.allowYTVideos.checked = PLAYLIST.allowYTVideos ?? true;
      elements.allowVimeoVideos.checked = PLAYLIST.allowVimeoVideos ?? true;
      elements.maxDuration.value = PLAYLIST.maxDuration || "";
      elements.maxDurationUnit.value = PLAYLIST.maxDurationUnit || "m";
      elements.maxLength.value = PLAYLIST.maxLength || "";
      elements.maxSize.value = PLAYLIST.maxSize || "";
      elements.minViewCount.value = PLAYLIST.minViewCount || "";
      elements.minUploadAge.value = PLAYLIST.minUploadAge || "";
      elements.minUploadAgeUnit.value = PLAYLIST.minUploadAgeUnit || "h";
      elements.maxUploadAge.value = PLAYLIST.maxUploadAge || "";
      elements.maxUploadAgeUnit.value = PLAYLIST.maxUploadAgeUnit || "h";
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
      elements.enableFavorites.checked = PLAYLIST.enableFavorites ?? false;

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
        let showWarning = false;
        for (let request of requests.values()) {
          if (!request?.name) {
            showWarning = true;
          }
          addToPlaylist(request);
          updatePlaylist(request, true);
        }
        if (showWarning) {
          dankUpdateModal.show();
        }
        updateLength();
        rebuildUsersArray();
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
        loadHistory();
      }
    } catch (error) {
      console.log(error);
    }

    try {
      const storedFavorites = await localforage.getItem("PLAYLIST_FAVORITES");
      if (!storedFavorites) {
        console.log("localStorage playlist favorites not found");
      } else {
        favorites = JSON.parse(storedFavorites);
        elements.favoriteCount.innerHTML = `${favorites.length.toLocaleString()} ${favorites.length == 1 ? "request" : "requests"}`;
      }
    } catch (error) {
      console.log(error);
    }

    try {
      const storedUserBanlist = await localforage.getItem("PLAYLIST_BANNED_USERS");
      if (!storedUserBanlist) {
        console.log("localStorage playlist banned users not found");
      } else {
        bannedUsers = JSON.parse(storedUserBanlist, reviver);
      }
    } catch (error) {
      console.log(error);
    }

    try {
      const storedItemBanlist = await localforage.getItem("PLAYLIST_BANNED_ITEMS");
      if (!storedItemBanlist) {
        console.log("localStorage playlist banned items not found");
      } else {
        bannedItems = JSON.parse(storedItemBanlist, reviver);
      }
    } catch (error) {
      console.log(error);
    }

    try {
      const storedChannelBanlist = await localforage.getItem("PLAYLIST_BANNED_CHANNELS");
      if (!storedChannelBanlist) {
        console.log("localStorage playlist banned channels not found");
      } else {
        bannedChannels = JSON.parse(storedChannelBanlist, reviver);
      }
    } catch (error) {
      console.log(error);
    }
  } //load_localStorage

  /**
   * @description recreates the users array from the requests saved in idb so that limits can be tracked across sessions
   */
  function rebuildUsersArray() {
    for (const [key, value] of requests.entries()) {
      for (let index = 0; index < value.by.length; index++) {
        const i = users.findIndex((e) => e.id === value.by[index].id);
        if (i > -1) {
          users[i].requests.push(key);
        } else {
          users.push({
            id: value.by[index].id,
            username: value.by[index].username,
            displayName: value.by[index].displayName,
            mod: value.by[index].mod,
            sub: value.by[index].subscriber,
            vip: value.by[index].vip,
            firstTimeChatter: value.by[index].firstTimeChatter,
            badges: value.by[index].badges,
            color: value.by[index].color,
            requests: [key],
          });
        }
      }
    }
  } //rebuildUsersArray

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
        }),
      );
      localforage.setItem("PLAYLIST_REQUESTS", JSON.stringify(new Map(), replacer));
      localforage.setItem("PLAYLIST_HISTORY", JSON.stringify([]));
      localforage.setItem("PLAYLIST_FAVORITES", JSON.stringify([]));
      localforage.setItem("PLAYLIST_BANNED_USERS", JSON.stringify(new Map(), replacer));
      localforage.setItem("PLAYLIST_BANNED_ITEMS", JSON.stringify(new Map(), replacer));
      localforage.setItem("PLAYLIST_BANNED_CHANNELS", JSON.stringify(new Map(), replacer));
    }
    localStorage.setItem(
      "PLAYLIST",
      JSON.stringify({
        autoplay: true,
        allowSpotifySongs: true,
        allowStreamable: true,
        allowTwitchClips: true,
        allowTwitchStreams: true,
        allowTwitchVODs: true,
        allowTiktokVideos: true,
        allowYTStreams: true,
        allowYTShorts: true,
        allowYTVideos: true,
        allowVimeoVideos: true,
        maxDuration: "",
        maxDurationUnit: "m",
        maxLength: "",
        maxSize: "",
        minViewCount: "",
        minUploadAge: "",
        minUploadAgeUnit: "h",
        maxUploadAge: "",
        maxUploadAgeUnit: "h",
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
        enableFavorites: false,
      }),
    );
    location.reload();
    return false;
  } //resetSettings

  async function handleMessage(target, context, msg, self) {
    if (context["first-msg"]) {
      firstTimeChatters.push(context.username);
    }
    let input = msg.split(" ").filter(Boolean);

    if (PLAYLIST.noCommand && playlist_open) {
      if (bannedUsers.get(context["user-id"])) {
        botReply(`🚫 You are banned`, context.id, false);
        return;
      }

      let request = input[0];
      let search = false;
      if (input[0].toLowerCase() == "youtube" || input[0].toLowerCase() == "spotify" || input[0].toLowerCase() == "vimeo") {
        request = input.join(" ");
        search = true;
      }

      let link = await parseLink(request);
      if (link && input[input.length - 1]?.toLowerCase().startsWith("start=")) {
        link.timestamp = timeToSeconds(input[input.length - 1].split("=")[1]);
      }

      if (link && linkTypeAllowed(link.type)) {
        addRequest(context, link, context.id, search);
        return;
      }
      if (link && !linkTypeAllowed(link.type)) {
        botReply(`🚫 ${link.type} links are not enabled`, context.id, false);
        return;
      }
    } //no command request

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

        if (bannedUsers.get(context["user-id"])) {
          botReply(`🚫 You are banned`, context.id, false);
          return;
        }

        let request = input[1];
        let search = false;
        if (input[1].toLowerCase() == "youtube" || input[1].toLowerCase() == "spotify" || input[1].toLowerCase() == "vimeo") {
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
        if (input[input.length - 1]?.toLowerCase().startsWith("start=")) {
          link.timestamp = timeToSeconds(input[input.length - 1].split("=")[1]);
        }
        addRequest(context, link, context.id, search);
        break;

      case PLAYLIST.voteskipCommand:
      case PLAYLIST.voteskipCommandAlias:
        if (bannedUsers.get(context["user-id"])) {
          return;
        }
        voteSkip(context["user-id"]);
        break;
      case PLAYLIST.songCommand:
      case PLAYLIST.songCommandAlias:
        if (currentItem) {
          if (bannedUsers.get(context["user-id"])) {
            botReply(`🚫 You are banned`, context.id, false);
            return;
          }

          botReply(
            `Now playing: ${getItemLink(currentItem)} | Requested by @${currentItem.by[0].username} ${
              currentItem.by.length > 1 ? `and ${currentItem.by.length - 1} other ${currentItem.by.length - 1 == 1 ? "user" : "users"}` : ""
            }`,
            context.id,
            true,
          );
        }
        break;
      case PLAYLIST.playlistCommand:
      case PLAYLIST.playlistCommandAlias:
        if (USER.access_token) {
          if (bannedUsers.get(context["user-id"])) {
            botReply(`🚫 You are banned`, context.id, false);
            return;
          }

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
  } //handleMessage

  async function handleMessageDeleted(channel, username, deletedMessage, userstate) {
    const requestKey = findRequestKey("msgid", userstate["target-msg-id"]);
    if (requestKey) {
      deleteRequest(requestKey, false);
    }
  } //handleMessageDeleted

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
    if (bannedItems.get(link.name)) {
      let message = "";
      switch (link.type) {
        case "twitch clip":
          message = "🚫 This clip is banned";
          break;
        case "twitch vod":
          message = "🚫 This VOD is banned";
          break;
        case "twitch stream":
          message = "🚫 This stream is banned";
          break;
        case "youtube short":
          message = "🚫 This short is banned";
          break;
        case "spotify":
          message = "🚫 This song is banned";
          break;
        default:
          message = `🚫 This video is banned`;
          break;
      }
      botReply(message, context.id, false);
      return;
    }

    const userIndex = getUser(context);
    const limit = checkRequestLimit(userIndex);

    //if limit is 0 then the user's roles are not allowed to request
    if (limit === 0) {
      botReply("🚫 You are not allowed to send requests", context.id, false);
      return;
    }

    //if limit is -1 then the user is allowed to make unlimited requests
    if (limit !== -1 && users[userIndex].requests.length >= limit) {
      botReply("⚠ You used up all your requests", context.id, false);
      return;
    }

    //check if user already requested this link id
    if (users[userIndex].requests.some((id) => id === link.name)) {
      botReply("⚠ You already requested this", context.id, false);
      return;
    }

    users[userIndex].requests.push(link.name);

    //check if other users already requested this link id
    let request = requests.get(link.name);
    if (request) {
      request.by.push(users[userIndex]);
      requests.set(link.name, request);
      updatePlaylist(request);
      botReply("⚠ Someone else already requested this", context.id, false);
    } else {
      let newRequest = {
        id: link.id,
        name: link.name,
        msgid: msgid,
        type: link.type,
        platform: link.platform,
        approved: PLAYLIST.approvalQueue ? false : true,
        title: "",
        channel: "",
        uri: "",
        url: link?.url || "",
        duration: null,
        timestamp: link.timestamp,
        views: null,
        age: null,
        thumbnail: "",
        search: search,
        time: Date.now(),
        by: [users[userIndex]],
      };
      requests.set(link.name, newRequest);
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
          users[userIndex].requests.splice(
            users[userIndex].requests.findIndex(function (r) {
              return r.value === id;
            }),
            1,
          );
        }
      }
    }
    requests.delete(id);
    document.getElementById(`id${id}`).remove();
    updateLength();
    saveSettings();
  } //deleteRequest

  function banUser(requestName, bannedFromHistory) {
    let request;
    if (bannedFromHistory) {
      const i = history.findIndex((e) => e.name === requestName);
      if (i > -1) {
        request = history[i];
      }
    } else {
      request = requests.get(requestName);
    }

    if (!request) {
      showToast("Could not ban user", "danger", 2000);
      return;
    }

    //ban everyone that requested
    for (let index = 0; index < request.by.length; index++) {
      //check if user is already banned before adding them to the list
      if (!bannedUsers.get(request.by[index].id)) {
        bannedUsers.set(request.by[index].id, request.by[index].username);
        showToast(`${request.by[index].username} is now banned`, "success", 2000);
      } else {
        showToast(`${request.by[index].username} is already banned`, "warning", 2000);
      }
    }

    //ban the item also
    if (!bannedItems.get(requestName)) {
      bannedItems.set(requestName, request);
    }

    if (bannedFromHistory) {
      //save the ban list if the history buttons were used bcz it gets saved in deleteRequest()
      saveSettings();
      loadBanLists();
    } else {
      deleteRequest(requestName, false);
    }

    //remove all other requests sent by this user
    for (const [key, value] of requests.entries()) {
      if (value.by[0].id == request.by[0].id) {
        deleteRequest(key, false);
      }
    }
  } //banUser

  function banItem(requestName, bannedFromHistory) {
    let request;
    if (bannedFromHistory) {
      const i = history.findIndex((e) => e.name === requestName);
      if (i > -1) {
        request = history[i];
      }
    } else {
      request = requests.get(requestName);
    }
    if (!request) {
      showToast("Could not ban video/song", "danger", 2000);
      return;
    }

    //check if item is already banned before adding it to the list
    if (!bannedItems.get(requestName)) {
      bannedItems.set(requestName, request);
      showToast(`${request.platform == "spotify" ? "Song" : "Video"} is now banned`, "success", 2000);
    } else {
      showToast(`${request.platform == "spotify" ? "Song" : "Video"} is already banned`, "warning", 2000);
    }

    if (bannedFromHistory) {
      //save the ban list if the history buttons were used bcz it gets saved in deleteRequest()
      saveSettings();
      loadBanLists();
    } else {
      deleteRequest(requestName, false);
    }
  } //banItem

  function banChannel(requestName, bannedFromHistory) {
    let channelid;
    if (bannedFromHistory) {
      const i = history.findIndex((e) => e.name === requestName);
      if (i > -1) {
        //check if request has a channel listed
        if (!history[i].channelid) {
          showToast("Item has no channel/artist", "danger", 2000);
          return;
        }
        channelid = history[i].channelid;
        //check if channel is already banned before adding it to the list
        if (!bannedChannels.get(`${history[i].platform}:${history[i].channelid}`)) {
          bannedChannels.set(`${history[i].platform}:${history[i].channelid}`, history[i]);
        } else {
          showToast(`${history[i].channel} is already banned`, "warning", 2000);
          return;
        }
      } else {
        showToast("Could not ban channel/artist", "danger", 2000);
        return;
      }
      showToast(`${history[i].channel} is now banned`, "success", 2000);
      saveSettings();
      loadBanLists();
    } else {
      let request = requests.get(requestName);
      if (!request) {
        showToast("Could not ban channel/artist", "danger", 2000);
        return;
      }
      //check if request has a channel listed
      if (!request.channelid) {
        showToast("Item has no channel/artist", "danger", 2000);
        return;
      }
      channelid = request.channelid;
      //check if channel is already banned before adding it to the list
      if (!bannedChannels.get(`${request.platform}:${request.channelid}`)) {
        bannedChannels.set(`${request.platform}:${request.channelid}`, request);
      } else {
        showToast(`${request.channel} is already banned`, "warning", 2000);
        return;
      }
      showToast(`${request.channel} is now banned`, "success", 2000);
      deleteRequest(requestName, false);
    }

    //remove all other requests from the banned channel
    for (const [key, value] of requests.entries()) {
      if (value.channelid == channelid) {
        deleteRequest(key, false);
      }
    }
  } //banChannel

  function unbanUser(userid) {
    //check if user is actually banned
    if (!bannedUsers.get(userid)) {
      showToast("That user is not banned", "warning", 2000);
      return;
    }
    bannedUsers.delete(userid);
    saveSettings();
    loadBanLists();
  } //unbanUser

  function unbanItem(item) {
    //check if item is actually banned
    if (!bannedItems.get(item)) {
      showToast("That video/song is not banned", "warning", 2000);
      return;
    }
    bannedItems.delete(item);
    saveSettings();
    loadBanLists();
  } //unbanItem

  function unbanChannel(channel) {
    //check if channel is actually banned
    if (!bannedChannels.get(channel)) {
      showToast("That channel/artist is not banned", "warning", 2000);
      return;
    }
    bannedChannels.delete(channel);
    saveSettings();
    loadBanLists();
  } //unbanChannel

  function unbanAllUsers() {
    bannedUsers = new Map();
    saveSettings();
    loadBanLists();
  } //unbanAllUsers

  function unbanAllItems() {
    bannedItems = new Map();
    saveSettings();
    loadBanLists();
  } //unbanAllItems

  function unbanAllChannels() {
    bannedChannels = new Map();
    saveSettings();
    loadBanLists();
  } //unbanAllChannels

  function loadBanLists() {
    elements.bannedUsersList.innerHTML = "";
    elements.bannedItemsList.innerHTML = "";
    elements.bannedChannelsList.innerHTML = "";

    for (const [key, value] of bannedUsers.entries()) {
      elements.bannedUsersList.insertAdjacentHTML(
        "afterbegin",
        `
      <li class="list-group-item">
      ${value} <i class="material-icons notranslate deletebtn float-end" onclick="unbanUser('${key}')" title="Unban">highlight_off</i>
      </li>`,
      );
    }

    for (const [key, value] of bannedItems.entries()) {
      elements.bannedItemsList.insertAdjacentHTML(
        "afterbegin",
        `
      <li class="list-group-item">
        <a 
        class="link-body-emphasis link-underline-opacity-0"
        href="${getItemLink(value)}"
        target="_blank"
        rel="noopener noreferrer">
        ${escapeString(value.title)}
        </a>
        <i class="material-icons notranslate deletebtn float-end" onclick="unbanItem('${key}')" title="Unban">highlight_off</i>
      </li>`,
      );
    }

    for (const [key, value] of bannedChannels.entries()) {
      elements.bannedChannelsList.insertAdjacentHTML(
        "afterbegin",
        `
      <li class="list-group-item">
      ${value.channel} <i class="material-icons notranslate deletebtn float-end" onclick="unbanChannel('${value.platform}:${value.channelid}')" title="Unban">highlight_off</i>
      </li>`,
      );
    }
    elements.bannedUserCount.innerHTML = `${bannedUsers.size} ${bannedUsers.size == 1 ? "User" : "Users"}`;
    elements.bannedItemCount.innerHTML = `${bannedItems.size} ${bannedItems.size == 1 ? "Video/Song" : "Videos/Songs"}`;
    elements.bannedChannelCount.innerHTML = `${bannedChannels.size} ${bannedChannels.size == 1 ? "Channel/Artist" : "Channels/Artists"}`;
  } //loadBanLists

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
    elements.nowPlayingInfo.innerHTML = ``;
    elements.nowPlayingBanButtons.innerHTML = ``;
    updateLength();
    saveSettings();
  } //clearPlaylist

  function clearHistory() {
    history = [];
    elements.historyList.innerHTML = "";
    elements.historyCount.innerHTML = `${history.length.toLocaleString()} ${history.length == 1 ? "request" : "requests"}`;
    saveSettings();
  } //clearHistory

  function clearFavorites() {
    favorites = [];
    elements.historyList.innerHTML = "";
    elements.showFavorites.checked = false;
    elements.favoriteCount.innerHTML = `${favorites.length.toLocaleString()} ${favorites.length == 1 ? "request" : "requests"}`;
    toggleFavoriteButton(false);
    saveSettings();
    loadHistory();
  } //clearFavorites

  function loadHistory() {
    elements.historyList.innerHTML = "";
    for (let index = 0; index < history.length; index++) {
      if (elements.showFavorites.checked && !favorites.includes(history[index].name)) {
        continue;
      }
      addToHistory(history[index], true);
    }
    elements.historyCount.innerHTML = `${history.length.toLocaleString()} ${history.length == 1 ? "request" : "requests"}`;
  } //loadHistory

  function updateLength() {
    const count = requests.size;
    let duration = 0;

    for (let request of requests.values()) {
      if (request.duration == -1 || request.duration == null) {
        continue;
      }
      duration += request.duration - request.timestamp;
    }

    elements.playlistLength.innerHTML = `${secondsToTimeString(Math.round(duration)) || "00:00"} (${count} ${count == 1 ? "request" : "requests"})`;
  } //updateLength

  function makeBanButtons(request, historyButton) {
    let banChannelButton = "";
    let banItemText = "";

    switch (request.type) {
      case "streamable":
        banChannelButton = `
      <li>
        <span class="d-inline-block" tabindex="0" data-bs-toggle="tooltip" data-bs-title="Streamable videos are uploaded anonymously so there is no channel to ban">
          <a class="dropdown-item disabled" aria-disabled="true"><i class="material-icons notranslate">tv_off</i> Ban Channel</a>
        </span>
      </li>`;
        break;
      case "spotify":
        banChannelButton = `
      <li>
        <a class="dropdown-item" onclick="banChannel('${request.name}', ${historyButton})" title="All requests from this artist will be removed also">
          <i class="material-icons notranslate">person_off</i> Ban Artist
        </a>
      </li>`;
        break;
      default:
        banChannelButton = `
      <li>
        <a class="dropdown-item" onclick="banChannel('${request.name}', ${historyButton})" title="All requests from this channel will be removed also">
          <i class="material-icons notranslate">tv_off</i> Ban Channel
        </a>
      </li>`;
        break;
    }

    switch (request.type) {
      case "youtube short":
        banItemText = `<i class="material-icons notranslate">play_disabled</i> Ban Short`;
        break;
      case "twitch clip":
        banItemText = `<i class="material-icons notranslate">play_disabled</i> Ban Clip`;
        break;
      case "twitch stream":
        banItemText = `<i class="material-icons notranslate">tv_off</i> Ban Stream`;
        banChannelButton = "";
        break;
      case "twitch vod":
        banItemText = `<i class="material-icons notranslate">play_disabled</i> Ban VOD`;
        break;
      case "spotify":
        banItemText = `<i class="material-icons notranslate">music_off</i> Ban Song`;
        break;
      default:
        banItemText = `<i class="material-icons notranslate">play_disabled</i> Ban Video`;
        break;
    }

    return `
  <li><a id="id${request.name}_ban_user" class="dropdown-item" onclick="banUser('${request.name}', ${historyButton})" title="Video/song will be banned also"><i class="material-icons notranslate">person_off</i> Ban User</a></li>
  <li><a class="dropdown-item" onclick="banItem('${request.name}', ${historyButton})">${banItemText}</a></li>
  ${banChannelButton}`;
  } //makeBanButtons

  function addToPlaylist(request, position = "beforeend") {
    let banButtons = makeBanButtons(request, false);
    elements.mainList.insertAdjacentHTML(
      position,
      `<div class="container-fluid request-container p-0 mb-2" id="id${request.name}">
        <div class="row g-1">
          <div class="col-auto thumbnail-div">
            <div id="id${request.name}_thumbnail" class="request-thumbnail">
              <div class="placeholder-glow" style="width: 160px; height: 90px">
                <span class="placeholder col-12 rounded h-100"></span>
              </div>
            </div>
            <span class="badge text-bg-dark duration-label" id="id${request.name}_duration">00:00</span>
          </div>
          <div class="col">
            <div class="vstack h-100">
              <div class="request-title mb-auto" id="id${request.name}_title" >
                <span class="placeholder-glow">
                  <span class="placeholder col-12"></span>
                </span>
                <span class="placeholder-glow">
                  <span class="placeholder col-12"></span>
                </span>
              </div>
              <small class="request-info text-body-secondary" id="id${request.name}_info" >
                <span class="placeholder-glow">
                  <span class="placeholder col-12"></span>
                </span>
              </small>
              <small class="requested-by text-body-secondary" id="id${request.name}_by" >
              Requested by: 
              ${request.by[0].badges}
              <span style="color: ${request.by[0].color}">${request.by.map((u) => u.username).join(" & ")}</span>
              </small>
            </div>
          </div>
          <div class="col-auto d-flex flex-column justify-content-between">     
            <div class="btn-group">
              <i class="material-icons notranslate icon-button" data-bs-toggle="dropdown" aria-expanded="false">more_vert</i>
                <ul class="dropdown-menu dropdown-menu-end cursor-pointer" style="user-select: none;">
                  ${banButtons}
                </ul>
              </div>
            <i class="material-icons notranslate icon-button" onclick="deleteRequest('${request.name}',false)" title="Delete request">delete</i>
          </div>
        </div>
      </div>`,
    );
    enableTooltips(); //enable the streamable channel ban tooltip
  } //addToPlaylist

  function addToHistory(request, localStorageLoad = false) {
    if (!localStorageLoad) {
      history.unshift(request);
    }
    let timestamp = "";
    if (request.timestamp > 0) {
      timestamp = ` (@${secondsToTimeString(Math.round(request.timestamp))})`;
    }
    let banButtons = makeBanButtons(request, true);

    elements.historyList.insertAdjacentHTML(
      localStorageLoad ? "beforeend" : "afterbegin",
      `<div class="container-fluid request-container p-0 mb-2">
        <div class="row g-1">
          <div class="col-auto thumbnail-div">
            <div class="request-thumbnail">
            <img src="${request.thumbnail}" alt="thumbnail" class="rounded" />
            </div>
            <span class="badge text-bg-dark duration-label">${request.duration == -1 ? "🔴live" : secondsToTimeString(Math.round(request.duration)) + timestamp}</span>
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
              ${escapeString(request.channel)} ${request.views !== null ? ` • ${formatViewCount(request.views)} ${request.views == 1 ? "view" : "views"}` : ""}
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
          <div class="col-auto d-flex flex-column justify-content-between">     
            <div class="btn-group">
              <i class="material-icons notranslate icon-button" data-bs-toggle="dropdown" aria-expanded="false">more_vert</i>
                <ul class="dropdown-menu dropdown-menu-end cursor-pointer" style="user-select: none;">
                  ${banButtons}
                </ul>
              </div>
          </div>
        </div>
      </div>`,
    );
  } //addToHistory

  function updatePlaylist(request, localStorageLoad = false) {
    //check if request info has been fetched
    if (request.thumbnail && request.title) {
      document.getElementById(`id${request.name}_thumbnail`).innerHTML = `
    <img 
    onmouseup="openLink(event, '${getItemLink(request)}')" 
    src="${request.thumbnail}" 
    alt="thumbnail" 
    class="rounded cursor-pointer" />`;
      document.getElementById(`id${request.name}_title`).innerHTML = `
    <a 
    class="link-body-emphasis link-underline-opacity-0"
    href="${getItemLink(request)}"
    target="_blank"
    rel="noopener noreferrer">
    ${escapeString(request.title)}
    </a>`;
      let timestamp = "";
      if (request.timestamp > 0) {
        timestamp = ` (@${secondsToTimeString(Math.round(request.timestamp))})`;
      }
      document.getElementById(`id${request.name}_title`).title = request.title;
      document.getElementById(`id${request.name}_info`).innerHTML = `
    ${escapeString(request.channel)} ${request.views !== null ? ` • ${formatViewCount(request.views)} ${request.views == 1 ? "view" : "views"}` : ""}`;
      document.getElementById(`id${request.name}_info`).title = `
    ${escapeString(request.channel)} ${request.views !== null ? ` • ${formatViewCount(request.views)} ${request.views == 1 ? "view" : "views"}` : ""}`;
      document.getElementById(`id${request.name}_duration`).innerText = request.duration == -1 ? "🔴live" : secondsToTimeString(Math.round(request.duration)) + timestamp;
      document.getElementById(`id${request.name}_ban_user`).innerHTML = `<i class="material-icons notranslate">person_off</i> Ban ${request.by.length > 1 ? "Users" : "User"}</a>`;
      document.getElementById(`id${request.name}_by`).innerHTML = `
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
      document.getElementById(`id${request.name}_by`).title = `Requested by @${request.by.map((u) => u.username).join(" & ")}`;

      if (!playlist_playing && PLAYLIST.autoplay && !localStorageLoad) {
        nextItem();
      }

      if (!localStorageLoad) {
        saveSettings();
      }
    } else {
      //if request info is not ready yet then update requesters only
      document.getElementById(`id${request.name}_ban_user`).innerHTML = `<i class="material-icons notranslate">person_off</i> Ban ${request.by.length > 1 ? "Users" : "User"}</a>`;
      document.getElementById(`id${request.name}_by`).innerText = `Requested by @${request.by[0].username} ${
        request.by.length > 1 ? `and ${request.by.length - 1} other ${request.by.length - 1 == 1 ? "user" : "users"}` : ""
      }`;
    }
  } //updatePlaylist

  let vimeoCooldown = 0;
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
        request.channelid = result.data.data[0].broadcaster_id;
        request.thumbnail = result.data.data[0].thumbnail_url;
        request.duration = result.data.data[0].duration;
        request.views = result.data.data[0].view_count;
        request.age = new Date(result.data.data[0].created_at).getTime();
        request.mp4 = `${result?.extra?.clip?.videoQualities[0]?.sourceURL}${result?.extra?.clipKey}`;
      } catch (error) {
        deleteRequest(request.name);
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
        request.channelid = result.data[0].user_id;
        request.thumbnail = result.data[0].thumbnail_url.replace("%{width}", "320").replace("%{height}", "180");
        request.duration = convertTwitchVODDuration(result.data[0].duration);
        request.views = result.data[0].view_count;
        request.age = new Date(result.data[0].created_at).getTime();
      } catch (error) {
        deleteRequest(request.name);
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
        request.channelid = result.data[0].user_id;
        request.thumbnail = result.data[0].thumbnail_url.replace("{width}", "320").replace("{height}", "180");
        request.duration = -1;
        request.views = result.data[0].viewer_count;
        request.age = new Date(result.data[0].started_at).getTime();
      } catch (error) {
        deleteRequest(request.name);
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
        if (!result.tracks[0].is_playable) {
          deleteRequest(request.name);
          botReply("⛔ Your song is not playable", msgid, false);
          return;
        }

        request.title = result.tracks[0].name || "(untitled)";
        request.channel = result.tracks[0]?.artists[0]?.name || "(unknown)";
        request.channelid = result.tracks[0].artists[0].id;
        request.thumbnail = result.tracks[0].album.images[0].url;
        request.duration = result.tracks[0].duration_ms / 1000;
        request.views = null;
        request.age = spotifyReleaseDateToTimestamp(result.tracks[0].album.release_date, result.tracks[0].album.release_date_precision);
        request.uri = result.tracks[0].uri;
      } catch (error) {
        deleteRequest(request.name);
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
        request.title = result?.title || "(untitled)";
        request.channel = result?.author_name || "(unknown)";
        request.channelid = result?.author_unique_id;
        request.thumbnail = result?.thumbnail_url;
        request.duration = null;
        request.views = null;
        request.age = null;
      } catch (error) {
        deleteRequest(request.name);
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
        request.channelid = result.items[0].snippet.channelId;
        request.thumbnail = result.items[0].snippet.thumbnails.medium.url;
        request.duration = ISO8601ToSeconds(result.items[0].contentDetails.duration);
        request.age = new Date(result.items[0].snippet.publishedAt).getTime();
        request.views = result.items[0].statistics.viewCount;

        if (result.items[0].contentDetails?.contentRating?.ytRating == "ytAgeRestricted" || !result.items[0].status?.embeddable) {
          deleteRequest(request.name);
          botReply("⛔ Your video is age restricted or not embeddable", msgid, false);
          return;
        }

        if (result.items[0].snippet.liveBroadcastContent !== "none") {
          if (request.duration == 0) {
            request.duration = -1;
          }
          if (!PLAYLIST.allowYTStreams) {
            deleteRequest(request.name);
            botReply("🚫 YouTube streams are not allowed", msgid, false);
            return;
          }
        }
      } catch (error) {
        deleteRequest(request.name);
        botReply("⛔ Could not find this video's info", msgid, false);
        console.log("getRequestInfo youtube error", error);
        return;
      }
    } //youtube

    if (request.type == "vimeo") {
      try {
        if (Date.now() < vimeoCooldown) {
          deleteRequest(request.name);
          botReply(`⚠ We reached the Vimeo API limit, ${Math.round((vimeoCooldown - Date.now()) / 1000)}s cooldown...`, msgid, false);
          return;
        }

        let response = await fetch(`https://helper.donk.workers.dev/vimeo/videos?id=${request.id}`);
        let result = await response.json();
        console.log(result);

        if (result?.error_code == 9000) {
          deleteRequest(request.name);
          vimeoCooldown = new Date(result["X-RateLimit-Reset"]).getTime();
          botReply(`⚠ We reached the Vimeo API limit, ${Math.round((vimeoCooldown - Date.now()) / 1000)}s cooldown...`, msgid, false);
          return;
        }

        vimeoCooldown = 0;

        if (result.type !== "video") {
          deleteRequest(request.name);
          botReply("⛔ Only Vimeo videos are supported", msgid, false);
          return;
        }

        if (result.content_rating_class !== "safe") {
          deleteRequest(request.name);
          botReply("⛔ Your video is not rated as safe", msgid, false);
          return;
        }

        if (!result.is_playable || result.play.status !== "playable" || result.status !== "available") {
          deleteRequest(request.name);
          botReply("⛔ Your video is not playable", msgid, false);
          return;
        }

        if (result.privacy.embed !== "public") {
          deleteRequest(request.name);
          botReply("⛔ Your video is not embeddable", msgid, false);
          return;
        }

        request.title = result.name || "(untitled)";
        request.channel = result.user.name || "(unknown)";
        request.channelid = result.user.uri;
        request.thumbnail = result.pictures?.sizes?.[1]?.link;
        request.duration = result.duration;
        request.views = result?.stats?.plays || null;
        request.age = new Date(result.created_time).getTime();
      } catch (error) {
        deleteRequest(request.name);
        botReply("⛔ Could not find this video's info", msgid, false);
        console.log("getRequestInfo vimeo error", error);
        return;
      }
    } //vimeo

    if (request.type == "streamable") {
      try {
        let response = await fetch(`https://helper.donk.workers.dev/streamable/videos?id=${request.id}`);
        let result = await response.json();
        console.log(result);
        request.title = result.title || "(untitled)";
        request.channel = "(unknown)";
        request.channelid = null;
        request.thumbnail = result.thumbnail_url;
        request.duration = result.files.mp4.duration;
        request.views = null;
        request.age = null;
        request.video = result.files.mp4.url;
      } catch (error) {
        deleteRequest(request.name);
        botReply("⛔ Could not find this video's info", msgid, false);
        console.log("getRequestInfo streamable error", error);
        return;
      }
    } //streamable

    if (bannedChannels.get(`${request?.platform}:${request?.channelid}`)) {
      deleteRequest(request.name);
      botReply(`🚫 This ${request.type == "spotify" ? "artist" : "channel"} is banned`, msgid, false);
      return;
    } //banned channels check

    if (
      PLAYLIST.maxDuration !== "" &&
      request.duration !== -1 &&
      request.duration !== null &&
      total_duration + request.duration - request.timestamp > numberAndUnitToSeconds(PLAYLIST.maxDuration, PLAYLIST.maxDurationUnit)
    ) {
      if (playlist_open) {
        togglePlaylist();
      }
      deleteRequest(request.name);
      botReply(`⛔ The playlist's duration limit was reached (${PLAYLIST.maxDuration}${PLAYLIST.maxDurationUnit})`, msgid, false);
      return;
    } //total duration limit check

    if (PLAYLIST.maxLength !== "" && request.duration !== -1 && request.duration !== null && request.duration - request.timestamp > PLAYLIST.maxLength * 60) {
      deleteRequest(request.name);
      botReply(`⛔ Your request is too long (${PLAYLIST.maxLength}m max)`, msgid, false);
      return;
    } //request length check

    if (PLAYLIST.maxSize !== "" && requests.size > PLAYLIST.maxSize) {
      if (playlist_open) {
        togglePlaylist();
      }
      deleteRequest(request.name);
      botReply(`⛔ The playlist's size limit was reached (${PLAYLIST.maxSize})`, msgid, false);
      return;
    } //playlist size check

    if (PLAYLIST.minViewCount !== "" && request.views !== null && request.views < PLAYLIST.minViewCount) {
      deleteRequest(request.name);
      botReply(`⛔ Your request does not meet the minimum view count (${PLAYLIST.minViewCount.toLocaleString()})`, msgid, false);
      return;
    } //view count check

    if (PLAYLIST.minUploadAge !== "" && request.age !== null && request.age > Date.now() - numberAndUnitToSeconds(PLAYLIST.minUploadAge, PLAYLIST.minUploadAgeUnit) * 1000) {
      deleteRequest(request.name);
      let min = numberAndUnitToSeconds(PLAYLIST.minUploadAge, PLAYLIST.minUploadAgeUnit) * 1000;
      let max = numberAndUnitToSeconds(PLAYLIST.maxUploadAge, PLAYLIST.maxUploadAgeUnit) * 1000;
      let now = Date.now();
      if (PLAYLIST.maxUploadAge !== "") {
        botReply(`⛔ Your request is too new (must be uploaded between ${new Date(now - max).toLocaleString("en-GB")} and ${new Date(now - min).toLocaleString("en-GB")})`, msgid, false);
      } else {
        botReply(`⛔ Your request is too new (must be uploaded before ${new Date(now - min).toLocaleString("en-GB")})`, msgid, false);
      }
      return;
    } //min upload age check

    if (PLAYLIST.maxUploadAge !== "" && request.age !== null && request.age < Date.now() - numberAndUnitToSeconds(PLAYLIST.maxUploadAge, PLAYLIST.maxUploadAgeUnit) * 1000) {
      deleteRequest(request.name);
      let min = numberAndUnitToSeconds(PLAYLIST.minUploadAge, PLAYLIST.minUploadAgeUnit) * 1000;
      let max = numberAndUnitToSeconds(PLAYLIST.maxUploadAge, PLAYLIST.maxUploadAgeUnit) * 1000;
      let now = Date.now();
      if (PLAYLIST.minUploadAge !== "") {
        botReply(`⛔ Your request is too old (must be uploaded between ${new Date(now - max).toLocaleString("en-GB")} and ${new Date(now - min).toLocaleString("en-GB")})`, msgid, false);
      } else {
        botReply(`⛔ Your request is too old (must be uploaded after ${new Date(now - max).toLocaleString("en-GB")})`, msgid, false);
      }
      return;
    } //max upload age check

    if (PLAYLIST.uniqueOnly && history.some((e) => e.name === request.name)) {
      deleteRequest(request.name);
      botReply(`⛔ Your request is not unique`, msgid, false);
      return;
    } //unique check

    if (request.timestamp > 0 && request.duration > 0 && request.timestamp > request.duration) {
      deleteRequest(request.name);
      botReply(`⛔ Your time stamp is longer than the actual video`, msgid, false);
      return;
    } //timestamp check

    if (request.duration > 0) {
      total_duration += request.duration - request.timestamp;
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
        return { type: "twitch clip", id: clipID[1], name: `twitch:clip:${clipID[1]}`, platform: "twitch", timestamp: 0 };
      } //clips

      if (link.includes("/videos/")) {
        const vodID = link.match(/\/videos\/(\d+)/);
        if (!vodID || !parseInt(vodID[1])) {
          return null;
        }
        let timestamp = timeStringToSeconds(new URLSearchParams(new URL(link).search)?.get("t"));
        return { type: "twitch vod", id: vodID[1], name: `twitch:vod:${vodID[1]}`, platform: "twitch", timestamp: timestamp };
      } //vods

      const username = link.match(/\/([a-zA-Z0-9_]{1,25})$/);
      if (!username) {
        return null;
      }
      return { type: "twitch stream", id: username[1], name: `twitch:stream:${username[1]}`, platform: "twitch", timestamp: 0 };
    } //twitch

    if (link.includes("youtube.com") || link.includes("youtu.be")) {
      const youtubeURLRegex = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
      const videoID = youtubeURLRegex.exec(link) || null;
      if (videoID[3]?.length != 11) {
        return null;
      }

      let timestamp = parseInt(new URLSearchParams(new URL(link).search)?.get("t"), 10) || 0;
      return { type: link.includes("/shorts/") ? "youtube short" : "youtube", id: videoID[3], name: `youtube:${videoID[3]}`, platform: "youtube", timestamp: timestamp };
    } //youtube

    if (link.toLowerCase().startsWith("youtube")) {
      link = link?.toLowerCase().replace("youtube", "").trim();
      if (link?.includes("start=")) {
        link = link.split("start=")[0];
      }
      if (!link) {
        return null;
      }
      try {
        let response = await fetch(`https://helper.donk.workers.dev/youtube/search?query=${encodeURIComponent(link.trim())}`);
        let result = await response.json();
        console.log(result);
        if (result?.items?.length == 0 || result?.items?.[0].id?.kind !== "youtube#video") {
          return null;
        }

        return { type: "youtube", id: result.items[0].id.videoId, name: `youtube:${result.items[0].id.videoId}`, platform: "youtube", timestamp: 0 };
      } catch (error) {
        return null;
      }
    } //youtube search

    if (link.includes("vimeo.com")) {
      const vimeoURLRegex = /(?:http|https)?:?\/?\/?(?:www\.)?(?:player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/g;
      const videoID = vimeoURLRegex.exec(link) || null;
      if (!videoID[1]) {
        return null;
      }
      let timestamp = parseInt(new URL(link)?.hash?.substring(1)?.match(/t=([0-9.]+)/)?.[1], 10) || 0;
      return { type: "vimeo", id: videoID[1], name: `vimeo:${videoID[1]}`, platform: "vimeo", timestamp: timestamp };
    } //vimeo

    if (link.toLowerCase().startsWith("vimeo")) {
      link = link?.toLowerCase().replace("vimeo", "").trim();
      if (link?.includes("start=")) {
        link = link.split("start=")[0];
      }
      if (!link) {
        return null;
      }
      try {
        let response = await fetch(`https://helper.donk.workers.dev/vimeo/search?query=${encodeURIComponent(link.trim())}`);
        let result = await response.json();
        console.log(result);

        if (
          !result.data[0] ||
          result.data[0].type !== "video" ||
          result.data[0].content_rating_class !== "safe" ||
          result.data[0].privacy.embed !== "public" ||
          result.data[0].play.status !== "playable" ||
          result.data[0].status !== "available" ||
          result.data[0].is_playable !== true
        ) {
          return null;
        }

        return { type: "vimeo", id: result.data[0].uri.replace("/videos/", ""), name: `vimeo:${result.data[0].uri.replace("/videos/", "")}`, platform: "vimeo", timestamp: 0 };
      } catch (error) {
        return null;
      }
    } //vimeo search

    if (link.includes("spotify.com")) {
      const spotifyURLRegex = /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:(album|track|playlist|episode)\/|\?uri=spotify:track:)((\w|-){22})/;
      let id = link.match(spotifyURLRegex);
      console.log(id);
      if (!id[2] || (id[1] !== "track" && id[1] !== "episode")) {
        return null;
      }
      return { type: "spotify", id: id[2], name: `spotify:${id[2]}`, platform: "spotify", timestamp: 0 };
    } //spotify

    if (link.toLowerCase().startsWith("spotify")) {
      link = link?.toLowerCase().replace("spotify", "").trim();
      if (link?.includes("start=")) {
        link = link.split("start=")[0];
      }
      if (!link) {
        return null;
      }

      try {
        let response = await fetch(`https://helper.donk.workers.dev/spotify/search?q=${encodeURIComponent(link.trim())}`);
        let result = await response.json();
        console.log(result);
        if (result.tracks.items.length == 0) {
          return null;
        }

        return { type: "spotify", id: result.tracks.items[0].id, name: `spotify:${result.tracks.items[0].id}`, platform: "spotify", timestamp: 0 };
      } catch (error) {
        return null;
      }
    } //spotify search

    if (link.includes("tiktok.com")) {
      const tiktokURLRegex = /^.*https:\/\/(?:m|www|vm)?\.?tiktok\.com\/((?:.*\b(?:(?:usr|v|embed|user|video)\/|\?shareId=|\&item_id=)(\d+))|\w+)/;
      let id = link.match(tiktokURLRegex);
      if (!id[2] || !id[1].includes("/video/")) {
        return null;
      }
      return { type: "tiktok video", id: id[2], url: link.split("?")[0], name: `tiktok:${id[2]}`, platform: "tiktok", timestamp: 0 };
    } //tiktok

    if (link.includes("streamable.com")) {
      const match = link.match(/streamable\.com\/([a-zA-Z0-9]+)/);
      if (!match[1]) {
        return null;
      }
      return { type: "streamable", id: match[1], name: `streamable:${match[1]}`, platform: "streamable", timestamp: 0 };
    } //streamable

    return null;
  } //parseLink

  async function updateClipMP4(id) {
    try {
      let response = await fetch(`https://helper.donk.workers.dev/twitch/clipsxd?id=${id}`);
      let result = await response.json();
      return `${result?.extra?.clip?.videoQualities[0]?.sourceURL}${result?.extra?.clipKey}` || null;
    } catch (error) {
      console.log("updateClipMP4 error", error);
      return null;
    }
  } //updateClipMP4

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
    if (type == "tiktok video" && !PLAYLIST.allowTiktokVideos) {
      return false;
    }
    if (type == "youtube" && !PLAYLIST.allowYTStreams && !PLAYLIST.allowYTVideos) {
      return false;
    }
    if (type == "youtube short" && !PLAYLIST.allowYTShorts) {
      return false;
    }
    if (type == "vimeo" && !PLAYLIST.allowVimeoVideos) {
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
      case "vimeo":
        return `https://vimeo.com/${request.id}`;
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
    let input = elements.link.value?.split(" ").filter(Boolean);
    let request = input[0];
    let search = false;
    if (input[0].toLowerCase() == "youtube" || input[0].toLowerCase() == "spotify" || input[0].toLowerCase() == "vimeo") {
      request = input.join(" ");
      search = true;
    }

    let link = await parseLink(request);
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
    if (input[input.length - 1]?.toLowerCase().startsWith("start=")) {
      link.timestamp = timeToSeconds(input[input.length - 1].split("=")[1]);
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
      search,
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

    if (currentItem?.name == history[historyIndex + 1]?.name) {
      historyIndex++;
    }

    currentItem = history[++historyIndex];

    if (!currentItem) {
      playlist_playing = false;
      elements.placeholder.style.display = "";
      elements.nowPlaying.innerHTML = `<span class="text-body-secondary">Nothing :)</span>`;
      elements.nowPlayingRequester.innerHTML = `<span class="text-body-secondary">No one :)</span>`;
      elements.nowPlayingInfo.innerHTML = ``;
      elements.nowPlayingBanButtons.innerHTML = ``;
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
        deleteRequest(currentItem.name, false);
        elements.historyCount.innerHTML = `${history.length.toLocaleString()} ${history.length == 1 ? "request" : "requests"}`;
      }
    }
    if (!currentItem) {
      playlist_playing = false;
      elements.placeholder.style.display = "";
      elements.nowPlaying.innerHTML = `<span class="text-body-secondary">Nothing :)</span>`;
      elements.nowPlayingRequester.innerHTML = `<span class="text-body-secondary">No one :)</span>`;
      elements.nowPlayingInfo.innerHTML = ``;
      elements.nowPlayingBanButtons.innerHTML = ``;
      return;
    }
    console.log(currentItem);
    playItem(currentItem);
    updateLength();
    saveSettings();
  } //nextItem

  async function playItem(item) {
    switch (item.type) {
      case "youtube":
      case "youtube short":
        elements.youtubeEmbedContainer.style.display = "";
        youtubePlayer.loadVideoById(item.id, item.timestamp);
        break;
      case "vimeo":
        elements.vimeoEmbedContainer.style.display = "";
        playVimeoVideo(item.id, item.timestamp);
        break;
      case "spotify":
        elements.spotifyEmbedContainer.style.display = "";
        spotifyPlay(item.uri, item.timestamp);
        break;
      case "twitch stream":
        elements.twitchEmbed.style.display = "";
        twitchPlayer.setChannel(item.id);
        break;
      case "twitch vod":
        elements.twitchEmbed.style.display = "";
        seekTwitchPlayer = true;
        twitchPlayer.setVideo(item.id);
        break;
      case "twitch clip":
        if (item?.mp4 && Date.now() - item.time < 19 * 60 * 60 * 1000) {
          elements.videoEmbed.style.display = "";
          elements.videoEmbed.src = item.mp4;
        } else {
          let newMP4 = await updateClipMP4(item.id);
          if (newMP4) {
            elements.videoEmbed.style.display = "";
            elements.videoEmbed.src = newMP4;
          } else {
            elements.twitchClipsEmbed.style.display = "";
            elements.twitchClipsEmbed.innerHTML = `<iframe src="https://clips.twitch.tv/embed?clip=${item.id}&parent=${window.location.hostname}&autoplay=true&muted=false" preload="auto" height="100%" width="100%"></iframe>`;
          }
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
      default:
        break;
    }

    if (currentItem.duration !== -1 && currentItem.duration !== null) {
      total_duration -= currentItem.duration - currentItem.timestamp;
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

    elements.nowPlayingInfo.innerHTML = `
  <small class="now-playing-info" title="${currentItem.channel}">
    <i class="material-icons notranslate">${currentItem.platform == "spotify" ? "music_note" : "live_tv"}</i> ${escapeString(currentItem.channel)}
  </small>
  <br />
  <small class="now-playing-info">
    ${currentItem.views !== null ? `<i class="material-icons notranslate">visibility</i> ${formatViewCount(currentItem.views)} ${currentItem.views == 1 ? "view" : "views"}` : ""}
  </small>`;

    elements.nowPlayingBanButtons.innerHTML = `
    <div class="btn-group dropup">
      <i class="material-icons notranslate icon-button" data-bs-toggle="dropdown" aria-expanded="false">more_vert</i>
      <ul class="dropdown-menu dropdown-menu-end cursor-pointer" style="user-select: none;">
        ${makeBanButtons(currentItem, true)}
      </ul>
    </div>`;
    playlist_playing = true;
    updateMetadata();
    toggleFavoriteButton(favorites.includes(currentItem.name));
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

  function favorite() {
    if (!currentItem?.name) {
      showToast("Nothing is playing right now", "danger", 3000);
      return;
    }
    if (favorites.includes(currentItem.name)) {
      let index = favorites.indexOf(currentItem.name);
      if (index !== -1) {
        favorites.splice(index, 1);
      }
      toggleFavoriteButton(false);
    } else {
      favorites.push(currentItem.name);
      toggleFavoriteButton(true);
      elements.favoriteCount.innerHTML = `${favorites.length.toLocaleString()} ${favorites.length == 1 ? "request" : "requests"}`;
    }
    saveSettings();
  } //favorite

  function toggleFavoriteButton(active) {
    const tooltip = bootstrap.Tooltip.getInstance("#favoriteButton");

    if (!active) {
      elements.favoriteButton.innerText = "favorite_border";
      elements.favoriteButton.classList.remove("text-danger");
      tooltip.setContent({ ".tooltip-inner": "Add to favorites" });
    } else {
      elements.favoriteButton.innerText = "favorite";
      elements.favoriteButton.classList.add("text-danger");
      tooltip.setContent({ ".tooltip-inner": "Remove from favorites" });
    }
  } //toggleFavoriteButton

  function downloadFavorites(format) {
    if (history.length == 0) {
      showToast("Favorite downloading disabled because history was cleared", "danger", 3000);
      return;
    }

    if (history.length == 0 || favorites.length == 0) {
      showToast("There is nothing to download", "danger", 3000);
      return;
    }

    if (format == "json") {
      let cleanFavorites = [];
      for (let index = 0; index < history.length; index++) {
        if (!favorites.includes(history[index].name)) {
          continue;
        }
        cleanFavorites.push({
          id: history[index].id,
          title: history[index].title,
          channel: history[index].channel,
          duration: history[index].duration,
          timestamp: history[index].timestamp,
          views: history[index].views,
          upload_date: new Date(history[index].age).toISOString(),
          request_date: new Date(history[index].time).toISOString(),
          requesters: history[index].by.map((requester) => requester.username),
          url: getItemLink(history[index]),
        });
      }

      if (cleanFavorites.length !== favorites.length) {
        showToast("Some favorites are missing from the history", "warning", 3000);
      }

      const blob = new Blob([JSON.stringify(cleanFavorites)], { type: "text/json" });
      const link = document.createElement("a");
      link.download = `chatvote playlist favorites - ${new Date().toISOString()}.json`;
      link.href = window.URL.createObjectURL(blob);
      link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");
      const event = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      link.dispatchEvent(event);
      link.remove();
    } else if (format == "csv") {
      let cleanFavorites = [];
      for (let index = 0; index < history.length; index++) {
        if (!favorites.includes(history[index].name)) {
          continue;
        }
        cleanFavorites.push({
          id: history[index].id,
          title: history[index].title,
          channel: history[index].channel,
          duration: history[index].duration,
          timestamp: history[index].timestamp,
          views: history[index].views,
          upload_date: new Date(history[index].age).toISOString(),
          request_date: new Date(history[index].time).toISOString(),
          requesters: history[index].by.map((requester) => requester.username),
          url: getItemLink(history[index]),
        });
      }

      if (cleanFavorites.length !== favorites.length) {
        showToast("Some favorites are missing from the history", "warning", 3000);
      }

      const keys = Object.keys(cleanFavorites[0]);
      const header = keys.join(",") + "\n";
      const rows = cleanFavorites.map((obj) => keys.map((k) => JSON.stringify(obj[k] ?? "")).join(",")).join("\n");
      const blob = new Blob([header + rows], { type: "text/csv" });
      const link = document.createElement("a");
      link.download = `chatvote playlist favorites - ${new Date().toISOString()}.csv`;
      link.href = window.URL.createObjectURL(blob);
      link.dataset.downloadurl = ["text/csv", link.download, link.href].join(":");
      const event = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      link.dispatchEvent(event);
      link.remove();
    } else {
      showToast("Something went wrong :(", "danger", 2000);
    }
  } //downloadFavorites

  function downloadHistory(format) {
    if (history.length == 0) {
      showToast("There is nothing to download", "danger", 3000);
      return;
    }

    if (format == "json") {
      let cleanHistory = [];
      for (let index = 0; index < history.length; index++) {
        cleanHistory.push({
          id: history[index].id,
          title: history[index].title,
          channel: history[index].channel,
          duration: history[index].duration,
          timestamp: history[index].timestamp,
          views: history[index].views,
          upload_date: new Date(history[index].age).toISOString(),
          request_date: new Date(history[index].time).toISOString(),
          requesters: history[index].by.map((requester) => requester.username),
          url: getItemLink(history[index]),
        });
      }
      const blob = new Blob([JSON.stringify(cleanHistory)], { type: "text/json" });
      const link = document.createElement("a");
      link.download = `chatvote playlist history - ${new Date().toISOString()}.json`;
      link.href = window.URL.createObjectURL(blob);
      link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");
      const event = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      link.dispatchEvent(event);
      link.remove();
    } else if (format == "csv") {
      let cleanHistory = [];
      for (let index = 0; index < history.length; index++) {
        cleanHistory.push({
          id: history[index].id,
          title: history[index].title,
          channel: history[index].channel,
          duration: history[index].duration,
          timestamp: history[index].timestamp,
          views: history[index].views,
          upload_date: new Date(history[index].age).toISOString(),
          request_date: new Date(history[index].time).toISOString(),
          requesters: history[index].by.map((requester) => requester.username),
          url: getItemLink(history[index]),
        });
      }

      const keys = Object.keys(cleanHistory[0]);
      const header = keys.join(",") + "\n";
      const rows = cleanHistory.map((obj) => keys.map((k) => JSON.stringify(obj[k] ?? "")).join(",")).join("\n");
      const blob = new Blob([header + rows], { type: "text/csv" });
      const link = document.createElement("a");
      link.download = `chatvote playlist history - ${new Date().toISOString()}.csv`;
      link.href = window.URL.createObjectURL(blob);
      link.dataset.downloadurl = ["text/csv", link.download, link.href].join(":");
      const event = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      link.dispatchEvent(event);
      link.remove();
    } else {
      showToast("Something went wrong :(", "danger", 2000);
    }
  } //downloadHistory

  function resetPlayers() {
    elements.placeholder.style.display = "none";
    elements.youtubeEmbedContainer.style.display = "none";
    elements.vimeoEmbedContainer.style.display = "none";
    elements.spotifyEmbedContainer.style.display = "none";
    elements.twitchEmbed.style.display = "none";
    elements.twitchClipsEmbed.style.display = "none";
    elements.tiktokEmbed.style.display = "none";
    elements.videoEmbed.style.display = "none";

    youtubePlayer?.loadVideoById("");
    vimeoPlayer?.unload();
    spotifyPlayer?.destroy();
    elements.spotifyEmbedContainer.innerHTML = `<div id="spotifyEmbed"></div>`;
    twitchPlayer?.setChannel("");
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
      animate(`#voteSkipDiv`, {
        ease: "outElastic(1, .5)",
        translateY: ["-100%", 0],
      });
    }

    clearTimeout(voteskipTimeout);
    voteskipTimeout = setTimeout(() => {
      //hide voteskip counter if no more votes come in
      animate(`#voteSkipDiv`, {
        ease: "outBounce",
        duration: 2000,
        translateY: [0, "-100%"],
        onComplete: function (anim) {
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
    animate(`#voteSkipDiv`, {
      ease: "outBounce",
      translateY: [0, "-100%"],
      onComplete: function (anim) {
        elements.voteSkipDiv.style.display = "none";
      },
    });
  } //resetVoteSkip

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
      if (response.status == 418) {
        elements.enableBot.checked = false;
        saveSettings();
        let text = await response.text();
        showToast(`Bot unable to send messages "${text}"... Disabling bot setting`, "danger", 4000);
        console.log(`botReply response: 418 ${text}`);
        return;
      }
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

  /**
   * @param {{ value: number; }} slider
   */
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
      elements.togglePlaylist.innerHTML = `<i class="material-icons notranslate">playlist_remove</i> Close Playlist`;
    } else {
      elements.togglePlaylist.classList = "btn btn-success";
      elements.togglePlaylist.innerHTML = `<i class="material-icons notranslate">playlist_add_check</i> Open Playlist`;
    }
  } //togglePlaylist

  /**
   * @param {any} reply
   */
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
  /**
   * @param {any} reply
   */
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

  /**
   * @param {any} reply
   */
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
      case "vimeo":
        vimeoPlayer.play();
        break;
      case "spotify":
        spotifyPlayer.resume();
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
        elements.videoEmbed.play();
        break;
      default:
        break;
    }

    if (reply) {
      if (!twitchClipMP4 && currentItem.type == "twitch clip") {
        botReply(`⚠ Twitch clip playback can't be controlled`, reply, false);
      } else {
        botReply(`▶ Playlist is now playing`, reply, false);
      }
    }
  } //playPlaylist

  /**
   * @param {any} reply
   */
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
      case "vimeo":
        vimeoPlayer.pause();
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
        elements.videoEmbed.pause();
        break;
      default:
        break;
    }

    if (reply) {
      if (!twitchClipMP4 && currentItem.type == "twitch clip") {
        botReply(`⚠ Twitch clip playback can't be controlled`, reply, false);
      } else {
        botReply(`⏸ Playlist is now paused`, reply, false);
      }
    }
  } //pausePlaylist

  /**
   * @param {any} reply
   */
  function toggleAutoplay(reply) {
    let enabled = elements.autoplay.checked;
    elements.autoplay.checked = !enabled;
    botReply(`${enabled ? "❌" : "✅"} autoplay is now ${enabled ? "disabled" : "enabled"}`, reply, false);
    saveSettings();
  } //toggleAutoplay

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

  let spotifyPlayer, spotifyIFrameAPI;
  // window.onSpotifyIframeApiReady = (IFrameAPI) => {
  //   spotifyIFrameAPI = IFrameAPI;
  //   console.log("onSpotifyIframeApiReady");
  //   const callback = (EmbedController) => {
  //     spotifyPlayer = EmbedController;
  //     EmbedController.addListener("playback_update", (event) => {
  //       if (event.data.position == event.data.duration && event.data.duration > 0 && PLAYLIST.autoplay) {
  //         nextItem();
  //       }
  //     });
  //   };
  //   spotifyIFrameAPI.createController(elements.spotifyEmbed, {}, callback);
  // }; //onSpotifyIframeApiReady

  function spotifyPlay(uri, timestamp) {
    const callback = (EmbedController) => {
      spotifyPlayer = EmbedController;
      EmbedController.addListener("playback_update", (event) => {
        if (event.data.position == event.data.duration && event.data.duration > 0 && PLAYLIST.autoplay) {
          nextItem();
        }
      });
    };
    spotifyIFrameAPI.createController(document.getElementById("spotifyEmbed"), {}, callback);

    spotifyPlayer.loadUri(uri, true, timestamp);
    spotifyPlayer.play();
  } //spotifyPlay

  let twitchPlayer;
  let seekTwitchPlayer = true;
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
    twitchPlayer.addEventListener(Twitch.Player.PLAYING, twitchPlayerPlaying);

    function twitchPlayerEnded(event) {
      if (PLAYLIST.autoplay) {
        nextItem();
      }
    }

    function twitchPlayerPlaying(event) {
      if (seekTwitchPlayer) {
        twitchPlayer.seek(currentItem.timestamp);
        seekTwitchPlayer = false;
      }
    } //twitchPlayerReady
  } //enableTwitchEmbed

  function videoEmbedEventListeners() {
    elements.videoEmbed.addEventListener("ended", (event) => {
      if (PLAYLIST.autoplay) {
        nextItem();
      }
    });
    elements.videoEmbed.addEventListener("loadstart", (event) => {
      elements.videoEmbed.currentTime = currentItem?.timestamp || 0;
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
      if (event.data.type == "onPlayerReady") {
        //donk embed is muted by default so unmute when it loads
        document.getElementById("tiktokIframe").contentWindow.postMessage({ type: "unMute", "x-tiktok-player": true }, "*");
        document.getElementById("tiktokIframe").contentWindow.postMessage({ type: "seekTo", value: currentItem.timestamp, "x-tiktok-player": true }, "*");
      }
    });
  } //tiktokEmbedEventListeners

  let vimeoPlayer;
  function playVimeoVideo(id, timestamp) {
    //check if embed was created
    if (!vimeoPlayer) {
      vimeoPlayer = new Vimeo.Player(elements.vimeoEmbed, { id: id, responsive: true, speed: true, autoplay: true, start_time: timestamp });
      vimeoPlayer.on("ended", (event) => {
        if (PLAYLIST.autoplay) {
          nextItem();
        }
      });
    } else {
      vimeoPlayer.loadVideo(id);
      setTimeout(() => {
        //scuffed embed doesnt seek for some reason :) forsen build
        vimeoPlayer.setCurrentTime(timestamp);
      }, 1000);
    }
  } //playVimeoVideo
</script>

<svelte:head>
  <title>chat.vote Playlist</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="chat.vote Playlist" />
  <meta name="keywords" content="twitch, chat, poll, chatvote, chat.vote" />
  <meta property="og:title" content="chat.vote Playlist" />
  <meta property="og:site_name" content="chat.vote Playlist" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chat.vote/playlist/" />
  <meta property="og:image" content="https://screenshot.donk.workers.dev/?url=https://chat.vote/playlist" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:description" content="chat.vote Playlist" /></svelte:head
>

<div class="modal fade" id="dankUpdateModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Hello :)</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="modal-body">
          It looks like you have old requests in your playlist, A recent update (9/5/2025) had many changes under the hood that made old requests incompatible. Old requests should still work
          but their info won't show up on the playlist. These changes also affected the history and ban lists.<br />sorry for any inconvenience :)
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">OK</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="clearHistoryModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Are you sure?</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>All videos/songs will be removed from the history</p>
        <p class="text-warning">Favorites will be gone also</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onclick={clearHistory}><IcBaselineDeleteForever />Clear</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="clearFavoritesModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Are you sure?</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>All favorites will be removed</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onclick={clearFavorites}><IcBaselineHeartBroken />Clear</button>
      </div>
    </div>
  </div>
</div>

<div class="modal modal-xl fade" id="platformsInfoModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Platform support details</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">Autoplay</th>
              <th scope="col">Timestamps<sup>[1]</sup></th>
              <th scope="col">Duration filters</th>
              <th scope="col">Volume controls</th>
              <th scope="col">Moderated platform<sup>[2]</sup></th>
              <th scope="col">Search Command<sup>[3]</sup></th>
              <th scope="col">Content age filters</th>
              <th scope="col">View count filters</th>
            </tr>
          </thead>
          <tbody class="table-group-divider">
            <tr>
              <th scope="row">YouTube</th>
              <td>✔</td>
              <td>✔</td>
              <td>✔</td>
              <td>✔</td>
              <td>✔</td>
              <td>✔</td>
              <td>✔</td>
              <td>✔</td>
            </tr>
            <tr>
              <th scope="row">Vimeo</th>
              <td>✔</td>
              <td>✔</td>
              <td>✔</td>
              <td>✔</td>
              <td>✔</td>
              <td>✔</td>
              <td>✔</td>
              <td>✔</td>
            </tr>
            <tr>
              <th scope="row">Twitch</th>
              <td>✔<sup>[4]</sup></td>
              <td>✔<sup>[4]</sup></td>
              <td>✔</td>
              <td>✔</td>
              <td>✔</td>
              <td>❌</td>
              <td>✔</td>
              <td>✔</td>
            </tr>
            <tr>
              <th scope="row">Spotify<sup>[5]</sup></th>
              <td>✔</td>
              <td>✔</td>
              <td>✔</td>
              <td>❌</td>
              <td>✔</td>
              <td>✔</td>
              <td>✔</td>
              <td>❌</td>
            </tr>
            <tr>
              <th scope="row">Streamable</th>
              <td>✔</td>
              <td>✔</td>
              <td>✔</td>
              <td>✔</td>
              <td>❌</td>
              <td>❌</td>
              <td>❌</td>
              <td>❌</td>
            </tr>
            <tr>
              <th scope="row">TikTok</th>
              <td>✔</td>
              <td>✔</td>
              <td>❌</td>
              <td>❌</td>
              <td>✔</td>
              <td>❌</td>
              <td>❌</td>
              <td>❌</td>
            </tr>
          </tbody>
        </table>
        <div class="text-body-secondary">
          [1]: Viewers can request something at a specific time by requesting a link with a timestamp parameter or adding "start=" at the end of the request. Example:
          <kbd>!request [link] start=1:30</kbd> will make the video start from 1 minute 30 seconds<br />
          [2]: Platforms that are marked as moderated might have some automated filters to remove unsafe content. Platforms like Streamable don't require an account, so anyone can upload unsafe
          videos quickly then request them. This however does not mean that the other platforms will always have safe content.<br />
          [3]: You can search some platforms directly using the request command. Example: <kbd>!request spotify camellia ghost</kbd> <br />
          [4]: Twitch clips autoplay and timestamps might break sometimes, especially if you keep the clips in the playlist for more than a day.<br />
          [5]: You need to login to Spotify on this browser to listen to full songs instead of previews. You might also need to enable 3rd party cookies.
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">OK</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="banlistModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title"><IcBaselineGavel />Ban list</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body p-0">
        <ul class="nav nav-tabs bg-body-tertiary" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="usersTab" data-bs-toggle="tab" data-bs-target="#users-tab-pane" type="button" role="tab" aria-controls="users-tab-pane" aria-selected="true">
              <IcBaselineGroup />Users
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="itemsTab" data-bs-toggle="tab" data-bs-target="#items-tab-pane" type="button" role="tab" aria-controls="items-tab-pane" aria-selected="false">
              <IcBaselinePlayArrow />Videos/Songs
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="channelsTab"
              data-bs-toggle="tab"
              data-bs-target="#channels-tab-pane"
              type="button"
              role="tab"
              aria-controls="channels-tab-pane"
              aria-selected="false"
            >
              <IcBaselineLiveTv />Channels/Artists
            </button>
          </li>
        </ul>
        <div class="tab-content">
          <div class="tab-pane fade show active" id="users-tab-pane" role="tabpanel" aria-labelledby="usersTab" tabindex="0">
            <button class="btn btn-outline-warning m-2" type="button" onclick={unbanAllUsers}>
              <IcBaselineDeleteForever />Unban all (<span id="bannedUserCount">0 Users</span>)
            </button>

            <div id="bannedUsersListDiv">
              <ul class="list-group" id="bannedUsersList"></ul>
            </div>
          </div>
          <div class="tab-pane fade" id="items-tab-pane" role="tabpanel" aria-labelledby="itemsTab" tabindex="0">
            <button class="btn btn-outline-warning m-2" type="button" onclick={unbanAllItems}>
              <IcBaselineDeleteForever />Unban all (<span id="bannedItemCount">0 Videos/Songs</span>)
            </button>

            <div id="bannedItemsListDiv">
              <ul class="list-group" id="bannedItemsList"></ul>
            </div>
          </div>
          <div class="tab-pane fade" id="channels-tab-pane" role="tabpanel" aria-labelledby="channelsTab" tabindex="0">
            <button class="btn btn-outline-warning m-2" type="button" onclick={unbanAllChannels}>
              <IcBaselineDeleteForever />Unban all (<span id="bannedChannelCount">0 Channels/Artists</span>)
            </button>

            <div id="bannedChannelsListDiv">
              <ul class="list-group" id="bannedChannelsList"></ul>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<div id="voteSkipDiv" class="bg-body-tertiary" style="display: none">
  <small class="text-body-secondary">
    Vote skip using <span id="voteSkipHint"><strong>!voteskip</strong> or <strong>!vs</strong></span>
  </small>
  <br />
  <span id="voteSkipVotes">100 votes needed to skip</span>
</div>

<div class="offcanvas offcanvas-start" tabindex="-1" id="settingsOffcanvas" aria-labelledby="settingsOffcanvasLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="settingsOffcanvasLabel"><IcBaselineSettings />Settings</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <div class="card mb-3">
      <div class="card-header">
        <span class="align-middle"><IcBaselineChecklist />Enabled Platforms</span>
        <button type="button" class="btn btn-sm btn-primary float-end" data-bs-toggle="modal" data-bs-target="#platformsInfoModal">
          <IcBaselineInfo /> Platform support details
        </button>
      </div>
      <div class="card-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xl-4">
              <h6><MdiSpotify />Spotify</h6>
              <div class="form-check form-switch mb-3">
                <input class="form-check-input" type="checkbox" role="switch" id="allowSpotifySongs" onchange={saveSettings} checked />
                <label class="form-check-label" for="allowSpotifySongs">Songs</label>
              </div>

              <h6>Streamable</h6>
              <div class="form-check form-switch mb-3">
                <input class="form-check-input" type="checkbox" role="switch" id="allowStreamable" onchange={saveSettings} checked />
                <label class="form-check-label" for="allowStreamable">Videos</label>
              </div>

              <h6><IcBaselineTiktok />TikTok</h6>
              <div class="form-check form-switch mb-3">
                <input class="form-check-input" type="checkbox" role="switch" id="allowTiktokVideos" onchange={saveSettings} checked />
                <label class="form-check-label" for="allowTiktokVideos">Videos</label>
              </div>
            </div>
            <div class="col-xl-4">
              <h6><MdiTwitch />Twitch</h6>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="allowTwitchClips" onchange={saveSettings} checked />
                <label class="form-check-label" for="allowTwitchClips">Clips</label>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="allowTwitchStreams" onchange={saveSettings} checked />
                <label class="form-check-label" for="allowTwitchStreams">Live Streams</label>
              </div>
              <div class="form-check form-switch mb-3">
                <input class="form-check-input" type="checkbox" role="switch" id="allowTwitchVODs" onchange={saveSettings} checked />
                <label class="form-check-label" for="allowTwitchVODs">VODs</label>
              </div>

              <h6><MdiVimeo />Vimeo</h6>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="allowVimeoVideos" onchange={saveSettings} checked />
                <label class="form-check-label" for="allowVimeoVideos">Videos</label>
              </div>
            </div>
            <div class="col-xl-4">
              <h6><MdiYoutube />YouTube</h6>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="allowYTStreams" onchange={saveSettings} checked />
                <label class="form-check-label" for="allowYTStreams">Live Streams</label>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="allowYTShorts" onchange={saveSettings} checked />
                <label class="form-check-label" for="allowYTShorts">Shorts</label>
              </div>
              <div class="form-check form-switch mb-3">
                <input class="form-check-input" type="checkbox" role="switch" id="allowYTVideos" onchange={saveSettings} checked />
                <label class="form-check-label" for="allowYTVideos">Videos</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-header"><IcBaselineSettings />Playlist limits</div>
      <div class="card-body">
        <div class="input-group">
          <span class="input-group-text"><IcBaselineSchedule />Max playlist duration</span>
          <input type="number" aria-label="Max playlist duration" id="maxDuration" placeholder="Unlimited" min="1" class="form-control" onchange={saveSettings} />
          <select class="form-select" id="maxDurationUnit" onchange={saveSettings}>
            <option selected value="m">Minutes</option>
            <option value="h">Hours</option>
          </select>
        </div>
        <small class="text-body-secondary">The max duration of all requests added up</small>

        <div class="input-group mt-3">
          <span class="input-group-text"><IcBaselineTimelapse />Max song/video length</span>
          <input type="number" aria-label="Max song/video length" id="maxLength" placeholder="Unlimited" min="1" class="form-control" onchange={saveSettings} />
          <span class="input-group-text">Minutes</span>
        </div>
        <small class="text-body-secondary">How long a single request can be</small>

        <div class="input-group mt-3">
          <span class="input-group-text"><IcBaselineFormatListNumbered />Max playlist size</span>
          <input type="number" aria-label="Max playlist length" id="maxSize" placeholder="Unlimited" min="1" class="form-control" onchange={saveSettings} />
        </div>
        <small class="text-body-secondary">How many requests are allowed to be in the playlist</small>

        <div class="input-group mt-3">
          <span class="input-group-text"><IcBaselineVisibility />Min view count</span>
          <input type="number" aria-label="Minimum view count" id="minViewCount" placeholder="Unlimited" min="1" class="form-control" onchange={saveSettings} />
        </div>
        <small class="text-body-secondary">Requests that have a view count lower than the limit will be blocked</small>

        <p class="mt-3 mb-0">
          <IcBaselineCalendarToday />Content age limits

          <IcBaselineHelp
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            data-bs-html="true"
            data-bs-title="Set one or both fields to limit how old or new a request can be<br><i>Leave empty to disable</i>"
          />
        </p>
        <div class="input-group">
          <span class="input-group-text"><IcBaselineDateRange />Older than</span>
          <input type="number" aria-label="Min upload age" id="minUploadAge" placeholder="Unlimited" min="1" class="form-control" onchange={saveSettings} />
          <select class="form-select" id="minUploadAgeUnit" onchange={saveSettings}>
            <option selected value="h">Hours</option>
            <option value="d">Days</option>
            <option value="mo">Months</option>
            <option value="y">Years</option>
          </select>
        </div>
        <div class="input-group mt-1">
          <span class="input-group-text"><IcBaselineCalendarMonth />Newer than</span>
          <input type="number" aria-label="Max upload age" id="maxUploadAge" placeholder="Unlimited" min="1" class="form-control" onchange={saveSettings} />
          <select class="form-select" id="maxUploadAgeUnit" onchange={saveSettings}>
            <option selected value="h">Hours</option>
            <option value="d">Days</option>
            <option value="mo">Months</option>
            <option value="y">Years</option>
          </select>
        </div>
        <small class="fst-italic" id="uploadAgeDesc">No age limits set</small>

        <div class="form-check form-switch mt-3">
          <input class="form-check-input" type="checkbox" role="switch" id="uniqueOnly" onchange={saveSettings} />
          <label class="form-check-label" for="uniqueOnly"><IcBaselineHistoryToggleOff />Skip non unique requests</label>
          <br />
          <small class="text-body-secondary">
            Any request found in the <span class="text-primary"><IcBaselineHistory />History</span> tab will be skipped
          </small>
        </div>
      </div>
      <div class="card-footer text-body-secondary">
        <small class="text-warning">
          See <span class="cursor-pointer text-info" data-bs-toggle="modal" data-bs-target="#platformsInfoModal">Platform support details</span> for info about which platforms work with these
          filters
        </small>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-header"><IcBaselineChat />Chat Commands</div>
      <div class="card-body">
        <div class="input-group">
          <span class="input-group-text"><IcBaselineAdd />Request</span>
          <input type="text" id="requestCommand" data-default="!request" value="!request" aria-label="Request command" placeholder="command" class="form-control" onchange={saveSettings} />
          <input type="text" id="requestCommandAlias" data-default="!r" value="!r" aria-label="Request command alias" placeholder="alias" class="form-control" onchange={saveSettings} />
        </div>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" role="switch" id="noCommand" onchange={saveSettings} />
          <label class="form-check-label" for="noCommand"><IcBaselineLink />Add any supported link in chat to the playlist</label>
        </div>

        <div class="form-check form-switch mt-5">
          <input class="form-check-input" type="checkbox" role="switch" id="allowVoteSkip" onchange={saveSettings} />
          <label class="form-check-label" for="allowVoteSkip"><IcBaselineHowToVote />Allow viewers to vote skip</label>
        </div>
        <div class="input-group mb-1">
          <span class="input-group-text"><IcBaselineDoubleArrow /> Vote Skip command</span>
          <input
            type="text"
            id="voteskipCommand"
            data-default="!voteskip"
            value="!voteskip"
            aria-label="vote skip command"
            placeholder="command"
            class="form-control"
            onchange={saveSettings}
          />
          <input type="text" id="voteskipCommandAlias" data-default="!vs" value="!vs" aria-label="vote skip command alias" placeholder="alias" class="form-control" onchange={saveSettings} />
        </div>
        <div class="input-group mb-5">
          <span class="input-group-text"><IcBaselineIncompleteCircle /> Skip after</span>
          <input type="number" aria-label="vote skip votes needed" id="voteskipCount" placeholder="100" value="100" min="1" class="form-control" onchange={saveSettings} />
          <span class="input-group-text">votes</span>
        </div>

        <div class="form-check form-switch mb-3">
          <input class="form-check-input" type="checkbox" role="switch" id="enableBot" onchange={saveSettings} />
          <label class="form-check-label" for="enableBot"><IcBaselineSmartToy />Enable chat bot</label>
          <br />
          <small class="text-body-secondary">
            Enables the bot commands below and adds confirmation replies for some commands - Make sure to mod the bot <kbd>/mod chatvote</kbd> so that it can post links without getting timed
            out by other bots
          </small>
        </div>
        <div class="input-group mb-3">
          <span class="input-group-text"><IcBaselineHourglassTop />Bot commands cooldown</span>
          <input type="number" aria-label="Bot commands cooldown" id="botCooldown" placeholder="1" value="1" min="1" class="form-control" onchange={saveSettings} />
          <span class="input-group-text">seconds</span>
        </div>
        <h6>Bot Commands</h6>
        <div class="input-group mb-3">
          <span class="input-group-text"><IcBaselineLink />Request name & link</span>
          <input type="text" id="songCommand" data-default="!song" value="!song" aria-label="Song name command" placeholder="command" class="form-control" onchange={saveSettings} />
          <input
            type="text"
            id="songCommandAlias"
            data-default="!video"
            value="!video"
            aria-label="Song name command alias"
            placeholder="alias"
            class="form-control"
            onchange={saveSettings}
          />
        </div>
        <div class="input-group mb-3">
          <span class="input-group-text"><IcBaselineLanguage />Playlist link</span>
          <input
            type="text"
            id="playlistCommand"
            data-default="!playlist"
            value="!playlist"
            aria-label="Playlist command"
            placeholder="command"
            class="form-control"
            onchange={saveSettings}
          />
          <input type="text" id="playlistCommandAlias" data-default="!pl" value="!pl" aria-label="Playlist command alias" placeholder="alias" class="form-control" onchange={saveSettings} />
        </div>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-header"><IcBaselineGroup />Who can send requests</div>
      <div class="card-body">
        <p id="whoCanRequest">Everyone will be able to request.<br />Everyone will get 1 request.</p>
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">Role</th>
              <th scope="col">
                Request limit

                <IcBaselineInfo
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-html="true"
                  data-bs-title="<i>Leave empty for unlimited requests</i><br>The final limit for each user will be based on the highest role limit they have"
                />
              </th>
            </tr>
          </thead>
          <tbody class="table-group-divider">
            <tr>
              <th scope="row">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" role="switch" id="allowPlebs" onchange={saveSettings} checked />
                  <label class="form-check-label" for="allowPlebs"><img src="/pics/pleb.png" class="role-badge" /> Non subscriber</label>
                </div>
              </th>
              <td>
                <input type="number" class="form-control request-limit" id="plebLimit" onchange={saveSettings} value="1" min="1" placeholder="Unlimited" />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" role="switch" id="allowSubs" onchange={saveSettings} checked />
                  <label class="form-check-label" for="allowSubs"><img src="/pics/sub.png" class="role-badge" /> Subscriber</label>
                </div>
              </th>
              <td>
                <input type="number" class="form-control request-limit" id="subLimit" onchange={saveSettings} value="1" min="1" placeholder="Unlimited" />
              </td>
            </tr>

            <tr>
              <th scope="row">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" role="switch" id="allowMods" onchange={saveSettings} checked />
                  <label class="form-check-label" for="allowMods"><img src="/pics/mod.png" class="role-badge" /> Mod</label>
                </div>
              </th>
              <td>
                <input type="number" class="form-control request-limit" id="modLimit" onchange={saveSettings} value="1" min="1" placeholder="Unlimited" />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" role="switch" id="allowVips" onchange={saveSettings} checked />
                  <label class="form-check-label" for="allowVips"><img src="/pics/vip.png" class="role-badge" /> VIP</label>
                </div>
              </th>
              <td>
                <input type="number" class="form-control request-limit" id="vipLimit" onchange={saveSettings} value="1" min="1" placeholder="Unlimited" />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" role="switch" id="allowFirstTimeChatters" onchange={saveSettings} checked />
                  <label class="form-check-label" for="allowFirstTimeChatters"><img src="/pics/firstmsg.png" class="role-badge" /> First time chatter</label>
                </div>
              </th>
              <td>
                <input type="number" class="form-control request-limit" id="firstTimeChatterLimit" onchange={saveSettings} value="1" min="1" placeholder="Unlimited" />
              </td>
            </tr>
          </tbody>
        </table>
        <div class="btn-group" role="group" aria-label="Check all/Uncheck all">
          <button type="button" id="selectAll" class="btn btn-sm btn-success">Select all</button>
          <button type="button" id="unselectAll" class="btn btn-sm btn-danger">Unselect all</button>
        </div>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-header"><IcBaselineShield />Moderation Settings</div>
      <div class="card-body">
        <button type="button" class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#banlistModal"><IcBaselineGavel />Ban list</button>

        <div class="form-check form-switch mb-3" style="display: none">
          <input disabled class="form-check-input" type="checkbox" role="switch" id="approvalQueue" />
          <label class="form-check-label" for="approvalQueue"><IcBaselineRule />Approval queue</label>
          <br /><small class="text-body-secondary">Requests will have to be manually approved by you before they get added to the playlist</small>
        </div>

        <h6>Moderation Commands</h6>
        <div class="input-group mb-1">
          <span class="input-group-text"><IcBaselinePlaylistAddCheck />Open playlist</span>
          <input
            type="text"
            id="openCommand"
            data-default="!open"
            value="!open"
            aria-label="Open playlist command"
            placeholder="Open playlist command"
            class="form-control"
            onchange={saveSettings}
          />
        </div>
        <div class="input-group mb-1">
          <span class="input-group-text"><IcBaselinePlaylistRemove />Close playlist</span>
          <input
            type="text"
            id="closeCommand"
            data-default="!close"
            value="!close"
            aria-label="Close playlist command"
            placeholder="Close playlist command"
            class="form-control"
            onchange={saveSettings}
          />
        </div>
        <div class="input-group mb-1">
          <span class="input-group-text"><IcBaselinePlayArrow />Play current request</span>
          <input type="text" id="playCommand" data-default="!play" value="!play" aria-label="Play command" placeholder="Play command" class="form-control" onchange={saveSettings} />
        </div>
        <div class="input-group mb-1">
          <span class="input-group-text"><IcBaselinePause />Pause current request</span>
          <input type="text" id="pauseCommand" data-default="!pause" value="!pause" aria-label="Pause command" placeholder="Pause command" class="form-control" onchange={saveSettings} />
        </div>
        <div class="input-group mb-1">
          <span class="input-group-text"><IcBaselinePlaylistPlay />Toggle autoplay</span>
          <input
            type="text"
            id="autoplayCommand"
            data-default="!autoplay"
            value="!autoplay"
            aria-label="Autoplay command"
            placeholder="Autoplay command"
            class="form-control"
            onchange={saveSettings}
          />
        </div>
        <div class="input-group mb-1">
          <span class="input-group-text"><IcBaselineSkipNext />Skip current request</span>
          <input type="text" id="skipCommand" data-default="!skip" value="!skip" aria-label="Skip command" placeholder="Skip command" class="form-control" onchange={saveSettings} />
        </div>
        <div class="input-group mb-1">
          <span class="input-group-text"><IcBaselineSkipPrevious />Go back to previous request</span>
          <input
            type="text"
            id="rewindCommand"
            data-default="!rewind"
            value="!rewind"
            aria-label="Rewind command"
            placeholder="Rewind command"
            class="form-control"
            onchange={saveSettings}
          />
        </div>
        <div class="input-group mb-1">
          <span class="input-group-text">
            <IcBaselineDelete />Delete request by ID

            <IcBaselineHelp
              class="cursor-pointer"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-title="Mods will be able to delete requests by copying the command from your playlist.chat.vote/username page"
            />
          </span>
          <input
            type="text"
            id="deleteCommand"
            data-default="!delete"
            value="!delete"
            aria-label="Delete command"
            placeholder="Delete command"
            class="form-control"
            onchange={saveSettings}
          />
        </div>
        <div class="form-check form-switch mb-3">
          <input class="form-check-input" type="checkbox" role="switch" id="modCommands" onchange={saveSettings} checked />
          <label class="form-check-label" for="modCommands"><IcBaselineVerifiedUser />Allow mods to use moderation commands</label>
        </div>

        <div class="form-check form-switch mb-3">
          <input class="form-check-input" type="checkbox" role="switch" id="enableFavorites" onchange={saveSettings} />
          <label class="form-check-label" for="enableFavorites"><IcBaselineFavorite />Enable request favoriting</label>
          <br />
          <small class="text-body-secondary">
            Adds a button to the bottom bar that allows you to favorite a request<br />
            Favorited requests can be seen in the <span class="text-primary"><IcBaselineHistory />History</span> tab<br />
            Clearing history will also clear favorites
          </small>
        </div>

        <small class="text-body-secondary">
          <IcBaselineLightbulb /> Tip: Mods can delete a request by
          <a class="link-body-emphasis" href="https://twitter.com/TwitchSupport/status/1070135668980871168" target="_blank" rel="noopener noreferrer"> deleteing the message in chat </a>
        </small>
      </div>
    </div>

    <a
      id="resetSettingsPopover"
      tabindex="0"
      class="btn btn-danger"
      role="button"
      data-bs-toggle="popover"
      data-bs-trigger="focus"
      data-bs-title="Are you sure?"
      data-bs-content="All settings will be reset and the page will reload<br><button type='button' class='btn btn-danger float-end my-3' onclick='resetSettings()'><i class='material-icons notranslate'>delete_forever</i>Reset settings</button>"
      ><IcBaselineDeleteForever />Reset all settings</a
    >
    <br />
    <small class="text-body-secondary">Resets all settings and reloads the page.</small>
  </div>
</div>

<div class="container-fluid">
  <div class="row" id="mainRow">
    <div class="col p-0 m-2">
      <div class="card" id="playersCard">
        <div class="card-body p-0">
          <h1 id="placeholder" class="display-1">
            Nothing here <img src="/pics/donk.png" alt="donk" style="width: 80px; vertical-align: bottom" /><br /><br /><br />
            <span id="commandHint2">
              Request something using<br />
              <kbd class="notranslate text-success cursor-pointer" onclick={() => editRequestCommand()}>!request [link]</kbd> or
              <kbd class="notranslate text-success cursor-pointer" onclick={() => editRequestCommand(true)}>!r [link]</kbd>
            </span>
          </h1>
          <div id="youtubeEmbedContainer" style="display: none"><div id="youtubeEmbed"></div></div>
          <div id="vimeoEmbedContainer" style="display: none"><div id="vimeoEmbed"></div></div>
          <div id="spotifyEmbedContainer" style="display: none"><div id="spotifyEmbed"></div></div>
          <div id="twitchEmbed" style="display: none"></div>
          <div id="twitchClipsEmbed" style="display: none; height='100%'; width='100%'"></div>
          <div id="tiktokEmbed" style="display: none; height='100%'; width='100%'"></div>
          <video id="videoEmbed" style="display: none" controls autoplay></video>
        </div>
      </div>
    </div>

    <div class="col-auto p-0 m-2" id="rightCol">
      <div class="card">
        <div class="card-body p-1">
          <h4 class="m-0" id="commandHint">
            Add songs or videos to the playlist using <kbd class="notranslate text-success cursor-pointer">!request [link]</kbd> or
            <kbd class="notranslate text-success cursor-pointer">!r [link]</kbd>
          </h4>
          <div class="input-group mt-3">
            <input type="text" id="link" class="form-control" placeholder="Link" aria-label="Add link input text field" aria-describedby="addLink" />
            <button class="btn btn-secondary" type="button" id="addLink" onclick={addLink} title="Or just press enter :)"><IcBaselineAdd />Add</button>
          </div>
        </div>
      </div>

      <div class="card mt-3" id="playlist">
        <div class="card-body">
          <ul class="nav nav-tabs bg-body-tertiary" id="playlistTabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link active"
                id="playlistTab"
                data-bs-toggle="tab"
                data-bs-target="#playlist-tab-pane"
                type="button"
                role="tab"
                aria-controls="playlist-tab-pane"
                aria-selected="true"
              >
                <IcBaselineFormatListNumbered />Playlist
              </button>
            </li>
            <li class="nav-item" role="presentation" id="approvalTabButton" style="display: none">
              <button
                class="nav-link"
                id="approvalTab"
                data-bs-toggle="tab"
                data-bs-target="#approval-tab-pane"
                type="button"
                role="tab"
                aria-controls="approval-tab-pane"
                aria-selected="false"
              >
                <IcBaselineRule />Approval queue
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="historyTab"
                data-bs-toggle="tab"
                data-bs-target="#history-tab-pane"
                type="button"
                role="tab"
                aria-controls="history-tab-pane"
                aria-selected="false"
              >
                <IcBaselineHistory />History
              </button>
            </li>
          </ul>
          <div class="tab-content">
            <div class="tab-pane fade show active" id="playlist-tab-pane" role="tabpanel" aria-labelledby="playlistTab" tabindex="0">
              <div class="mt-2" id="mainList"></div>
            </div>
            <div class="tab-pane fade" id="approval-tab-pane" role="tabpanel" aria-labelledby="approvalTab" tabindex="0">
              <ul class="list-group mt-1" id="approvalList">
                <li class="list-group-item">An item</li>
              </ul>
            </div>
            <div class="tab-pane fade" id="history-tab-pane" role="tabpanel" aria-labelledby="historyTab" tabindex="0">
              <div class="hstack gap-1 mt-2">
                <div class="p-1 align-self-start">
                  <h5 class="mb-2"><IcBaselineHistory />History (<span id="historyCount">0 requests</span>)</h5>

                  <button class="btn btn-outline-warning" type="button" data-bs-toggle="modal" data-bs-target="#clearHistoryModal">
                    <IcBaselineDeleteForever />Clear history
                  </button>
                  <br /><small class="text-body-secondary">Will clear favorites also</small>
                  <h6 class="mt-2"><IcBaselineFileDownload />Download history</h6>
                  <div class="btn-group" role="group" aria-label="Download history">
                    <button class="btn btn-outline-success" type="button" onclick={() => downloadHistory("json")}><IcBaselineFileDownload />JSON</button>
                    <button class="btn btn-outline-success" type="button" onclick={() => downloadHistory("csv")}><IcBaselineFileDownload />CSV</button>
                  </div>
                </div>
                <div class="vr"></div>
                <div class="p-1 align-self-start">
                  <h5 class="mb-2"><IcBaselineFavorite />Favorites (<span id="favoriteCount">0 requests</span>)</h5>

                  <button class="btn btn-outline-warning mb-2" type="button" data-bs-toggle="modal" data-bs-target="#clearFavoritesModal">
                    <IcBaselineHeartBroken />Clear favorites
                  </button>

                  <h6><IcBaselineFileDownload />Download favorites</h6>
                  <div class="btn-group mb-2" role="group" aria-label="Download favorites">
                    <button class="btn btn-outline-success" type="button" onclick={() => downloadFavorites("json")}><IcBaselineFileDownload />JSON</button>
                    <button class="btn btn-outline-success" type="button" onclick={() => downloadFavorites("csv")}><IcBaselineFileDownload />CSV</button>
                  </div>

                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="showFavorites" onchange={loadHistory} />
                    <label class="form-check-label" for="showFavorites">Show favorites only</label>
                  </div>
                </div>
              </div>

              <hr />
              <div class="mt-2" id="historyList"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="row fixed-bottom bg-body-tertiary" id="bottomRow">
    <div class="col">
      <div class="hstack gap-2">
        <div class="p-1">
          <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#settingsOffcanvas" aria-controls="settingsOffcanvas">
            <IcBaselineSettings /> Settings
          </button>
        </div>

        <div class="vr"></div>

        <div class="p-1">
          <div class="input-group">
            <input disabled type="text" class="form-control" id="profileLink" value="playlist.chat.vote/username" />
            <button
              type="button"
              id="copyLinkButton"
              onclick={copyLink}
              class="btn btn-outline-secondary"
              data-bs-toggle="popover"
              data-bs-trigger="manual"
              data-bs-placement="top"
              data-bs-content="Link copied :)"
            >
              <IcBaselineContentCopy />
            </button>
          </div>
        </div>

        <div class="vr"></div>

        <div class="hstack gap-3 me-auto">
          <div>
            <small class="bottomBarLabel"><IcBaselinePlayCircle style="font-size: 1rem; vertical-align: middle" />Now playing</small>
            <br />
            <span id="nowPlaying"><span class="text-body-secondary">Nothing <img src="/pics/donk.png" alt="donk" style="width: 16px; vertical-align: middle" /></span></span>
          </div>

          <div>
            <small class="bottomBarLabel"><IcBaselineAccountCircle style="font-size: 1rem; vertical-align: middle" />Requested by</small>
            <br />
            <span id="nowPlayingRequester"><span class="text-body-secondary">No one <img src="/pics/donk.png" alt="donk" style="width: 16px; vertical-align: middle" /></span></span>
          </div>

          <div id="nowPlayingInfo"></div>

          <div id="nowPlayingBanButtons"></div>

          <div id="favoriteButtonDiv" style="display: none">
            <IcBaselineFavoriteBorder id="favoriteButton" onclick={favorite} data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Add to favorites" />
          </div>
        </div>

        <div class="vr"></div>

        <div>
          <small class="bottomBarLabel"><IcBaselineAccessTimeFilled style="font-size: 1rem; vertical-align: middle" />Playlist length</small><br />
          <span id="playlistLength">00:00 (0 requests)</span>
        </div>

        <div class="vr"></div>

        <div class="p-1">
          <a
            id="clearPlaylistPopover"
            tabindex="0"
            class="btn btn-outline-warning html-popover"
            role="button"
            data-bs-toggle="popover"
            data-bs-trigger="focus"
            data-bs-placement="top"
            data-bs-title="Are you sure?"
            data-bs-content="All videos/songs will be removed from the playlist including the current playing video <br>
                <button type='button' class='btn btn-danger float-end mb-3' onclick='clearPlaylist()'><i class='material-icons notranslate'>delete_sweep</i>Clear</button>"
          >
            <IcBaselineDeleteSweep />Clear playlist
          </a>

          <button
            type="button"
            id="togglePlaylist"
            onclick={togglePlaylist}
            class="btn btn-success"
            data-bs-container="body"
            data-bs-trigger="manual"
            data-bs-placement="top"
            data-bs-toggle="popover"
            data-bs-title="Playlist closed"
            data-bs-content="A viewer is trying to request something but the playlist is closed"
          >
            <IcBaselinePlaylistAddCheck /> Open Playlist
          </button>
        </div>

        <div class="vr"></div>

        <div>
          <label class="bottomBarLabel" for="autoplay"><IcBaselinePlaylistPlay />Autoplay</label><br />
          <div class="form-check form-switch ms-4">
            <input class="form-check-input" type="checkbox" role="switch" id="autoplay" onchange={saveSettings} checked />
          </div>
        </div>

        <div class="p-1">
          <div class="btn-group" role="group" aria-label="Playback controls">
            <button type="button" class="btn btn-secondary" onclick={previousItem}><IcBaselineSkipPrevious /></button>
            <button type="button" class="btn btn-secondary" onclick={nextItem}><IcBaselineSkipNext /></button>
          </div>
        </div>
        <div class="p-1" style="display: none">
          <div class="hstack gap-1">
            <IcBaselineVolumeUp class="cursor-pointer" id="volumeSliderIcon" onclick={toggleMute} />
            <input type="range" class="form-range" min="0" value="50" max="100" id="volumeSlider" oninput={() => changeVolume} />
            <span id="volumeSliderValue">50</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  #voteSkipDiv {
    pointer-events: none;
    border-color: var(--bs-warning);
    border-width: 0px 2px 2px 2px;
    border-style: solid;
    position: fixed;
    right: 40%;
    top: -20px;
    padding-top: 20px;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    width: 360px;
    z-index: 2000;
  }

  #voteSkipDiv > span {
    margin-left: 10px;
    font-size: 1.7rem;
  }
  #voteSkipDiv > small {
    font-size: 1.1rem;
    margin-left: 10px;
  }

  #settingsOffcanvas {
    width: 30vw;
  }

  #commandHint {
    height: 57px;
  }

  .custom-popover {
    --bs-popover-border-color: var(--bs-warning);
    --bs-popover-header-bg: var(--bs-warning);
    --bs-popover-header-color: var(--bs-white);
  }

  .request-limit {
    width: 120px;
  }

  .tooltip.show {
    opacity: 1;
  }

  .role-badge {
    height: 24px;
    width: 24px;
    vertical-align: bottom;
  }

  iframe,
  video {
    border-radius: 6px;
  }

  #profileLink > i,
  #copyLinkButton {
    color: #000000;
    border-color: #d3c22e;
    background-color: #ebda44;
  }

  #profileLink {
    border-color: #d3c22e;
    cursor: text;
    max-width: 13vw;
  }

  #copyLinkButton:hover {
    background-color: #cabb36;
    border-color: #d3c22e;
  }

  #playersCard {
    height: 100%;
    border-color: transparent;
  }

  #playlist {
    height: calc(100vh - 250px);
  }

  #mainList,
  #approvalList {
    height: calc(100vh - 310px);
    overflow-x: hidden;
    overflow-y: auto;
    text-align: start;
    margin-left: -10px;
    margin-right: -10px;
  }

  #historyList {
    height: calc(100vh - 490px);
    overflow-x: hidden;
    overflow-y: auto;
    text-align: start;
    margin-left: -10px;
    margin-right: -10px;
  }

  #rightCol {
    width: 450px;
  }

  @media screen and (max-width: 1800px) {
    #rightCol {
      width: 25vw;
    }
  }

  @media screen and (max-width: 1400px) {
    #rightCol {
      width: 20vw;
    }
  }

  .request-title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
    word-break: break-all;
  }

  .request-info {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
  }

  .requested-by {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
  }

  #nowPlaying {
    max-width: 450px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
  }

  #nowPlayingRequester {
    max-width: 200px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
  }

  .now-playing-info {
    max-width: 120px;
    display: inline-block;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .now-playing-info > i {
    vertical-align: middle;
  }

  #nowPlayingInfo {
    line-height: 12px;
  }

  #favoriteButton {
    font-size: 2rem;
    cursor: pointer;
    user-select: none;
  }

  .deletebtn {
    color: #e74c3c;
  }

  .deletebtn:hover {
    color: #c44133;
    cursor: pointer;
  }

  #bannedUsersListDiv,
  #bannedItemsListDiv,
  #bannedChannelsListDiv {
    margin: 2rem;
    overflow-y: auto;
    max-height: 40vh;
  }

  .icon-button {
    cursor: pointer;
    float: inline-end;
  }

  .icon-button:hover {
    opacity: 80%;
  }

  .icon-button:active {
    opacity: 50%;
  }

  .duration-label {
    position: absolute;
    right: 4px;
    bottom: 2px;
    font-weight: 500;
  }

  .request-thumbnail > img {
    max-height: 90px;
  }
  .request-thumbnail {
    width: min-content;
  }

  .thumbnail-div {
    position: relative;
    height: min-content;
  }

  #playlistTabs {
    margin-left: -17px;
    margin-right: -17px;
    margin-top: -17px;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
  }

  #volumeSlider {
    width: 10vw;
  }

  #volumeSliderValue {
    width: 50px;
  }

  #videoEmbed,
  #twitchEmbed,
  #twitchClipsEmbed,
  #youtubeEmbedContainer,
  #vimeoEmbedContainer,
  #tiktokEmbed {
    width: 100%;
    height: 100%;
    max-height: calc(100vh - 115px);
  }

  #placeholder {
    text-align: center;
  }

  .bottomBarLabel {
    user-select: none;
    font-size: 14px;
  }

  #playlistLength {
    display: inline-block;
    min-width: 120px;
  }

  .request-container {
    border-radius: 6px;
    -webkit-transition: background-color 300ms linear;
    -ms-transition: background-color 300ms linear;
    transition: background-color 300ms linear;
  }

  .request-container:hover {
    background-color: var(--bs-secondary-bg);
    border-radius: 6px;
    -webkit-transition: background-color 100ms linear;
    -ms-transition: background-color 100ms linear;
    transition: background-color 100ms linear;
  }
</style>
