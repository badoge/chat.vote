let elements = {
  //modals
  deleteAllModal: document.getElementById("deleteAllModal"),
  randomOptionModal: document.getElementById("randomOptionModal"),
  randomOptionWinner: document.getElementById("randomOptionWinner"),
  resetSettingsModal: document.getElementById("resetSettingsModal"),
  timeOverModal: document.getElementById("timeOverModal"),
  timeOverWinner: document.getElementById("timeOverWinner"),
  yesnoTimeOverModal: document.getElementById("yesnoTimeOverModal"),
  yesnoTimeOverWinner: document.getElementById("yesnoTimeOverWinner"),
  restartYesno: document.getElementById("restartYesno"),
  loginExpiredModal: document.getElementById("loginExpiredModal"),
  tieModal: document.getElementById("tieModal"),
  tieModalText: document.getElementById("tieModalText"),
  removeRandomWinner: document.getElementById("removeRandomWinner"),
  randomYesnoModal: document.getElementById("randomYesnoModal"),
  coin: document.getElementById("coin"),

  //navbar
  status: document.getElementById("status"),
  topRight: document.getElementById("topRight"),
  loginButton: document.getElementById("loginButton"),
  channelName: document.getElementById("channelName"),
  darkTheme: document.getElementById("darkTheme"),

  //settings
  settingsOffcanvas: document.getElementById("settingsOffcanvas"),

  //start voting button
  enableVoting: document.getElementById("enableVoting"),
  enableVotingText: document.getElementById("enableVotingText"),
  enableVotingDropdown: document.getElementById("enableVotingDropdown"),
  voteWithNumbers: document.getElementById("voteWithNumbers"),
  voteWithText: document.getElementById("voteWithText"),
  timerValueMinutes: document.getElementById("timerValueMinutes"),

  //enable suggestions
  enableSuggestions: document.getElementById("enableSuggestions"),
  enableSuggestionsText: document.getElementById("enableSuggestionsText"),
  suggestionsCommand: document.getElementById("suggestionsCommand"),
  enableSuggestionsDropdown: document.getElementById("enableSuggestionsDropdown"),
  suggestionLimitUser: document.getElementById("suggestionLimitUser"),
  suggestionLimit: document.getElementById("suggestionLimit"),

  //hotbar - quick actions
  restartPoll: document.getElementById("restartPoll"),
  deleteAll: document.getElementById("deleteAll"),
  hideScore: document.getElementById("hideScore"),
  hideScoreIcon: document.getElementById("hideScoreIcon"),
  pickRandom: document.getElementById("pickRandom"),

  //timer
  unpauseTimer: document.getElementById("unpauseTimer"),
  pauseTimer: document.getElementById("pauseTimer"),
  stopTimer: document.getElementById("stopTimer"),

  //basic settings
  remove: document.getElementById("remove"),
  multiChoice: document.getElementById("multiChoice"),
  multiChoiceExample: document.getElementById("multiChoiceExample"),
  allowChange: document.getElementById("allowChange"),
  subMode: document.getElementById("subMode"),
  suggestionPrefix: document.getElementById("suggestionPrefix"),

  //advanced settings
  showChat: document.getElementById("showChat"),
  refreshWarningEnabled: document.getElementById("refreshWarningEnabled"),
  linkPreviewThumbnailsEnabled: document.getElementById("linkPreviewThumbnailsEnabled"),
  confettiLevel: document.getElementById("confettiLevel"),
  bttvGlobalEmotes: document.getElementById("bttvGlobalEmotes"),
  bttvChannelEmotes: document.getElementById("bttvChannelEmotes"),
  ffzGlobalEmotes: document.getElementById("ffzGlobalEmotes"),
  ffzChannelEmotes: document.getElementById("ffzChannelEmotes"),
  seventvGlobalEmotes: document.getElementById("seventvGlobalEmotes"),
  seventvChannelEmotes: document.getElementById("seventvChannelEmotes"),
  voters_selected: document.getElementById("voters_selected"),
  json_selected: document.getElementById("json_selected"),
  txt_selected: document.getElementById("txt_selected"),
  optionList: document.getElementById("optionList"),

  //main
  toastContainer: document.getElementById("toastContainer"),
  hideQuestion: document.getElementById("hideQuestion"),
  countdown: document.getElementById("countdown"),
  chartContainer: document.getElementById("chartContainer"),
  voteHint: document.getElementById("voteHint"),
  chartCanvas: document.getElementById("chartCanvas"),
  barChart: document.getElementById("barChart"),
  pieChart: document.getElementById("pieChart"),
  sortChart: document.getElementById("sortChart"),
  sortChartLabel: document.getElementById("sortChartLabel"),
  totalVotes: document.getElementById("totalVotes"),
  numberStats: document.getElementById("numberStats"),
  averageNumber: document.getElementById("averageNumber"),
  medianNumber: document.getElementById("medianNumber"),
  questionLabel: document.getElementById("questionLabel"),
  pollOption: document.getElementById("pollOption"),
  pollOptionSpan: document.getElementById("pollOptionSpan"),
  addOption: document.getElementById("addOption"),
  tableTabButton: document.getElementById("tableTabButton"),
  chartTabButton: document.getElementById("chartTabButton"),
  yesnoTabButton: document.getElementById("yesnoTabButton"),
  overlayTabButton: document.getElementById("overlayTabButton"),
  options: document.getElementById("options"),
  chatiframe: document.getElementById("chatiframe"),
  chat: document.getElementById("chat"),
  subOnlyAlert: document.getElementById("subOnlyAlert"),

  //yesno
  yesnoDiv: document.getElementById("yesnoDiv"),
  yeaPic: document.getElementById("yeaPic"),
  nayPic: document.getElementById("nayPic"),
  yeaCount: document.getElementById("yeaCount"),
  nayCount: document.getElementById("nayCount"),
  yesnoTotalVotes: document.getElementById("yesnoTotalVotes"),

  //overlay
  overlayLink: document.getElementById("overlayLink"),
  generateOverlayButton: document.getElementById("generateOverlayButton"),
};

let client;
let voters = [];
let voters_options = [];
let vote_results = [];
let vote_changed = [];
let voters_yesno = [];
let voters_options_yesno = [];
let vote_results_yesno = [];
let oid = 0;
let suggestions_enabled = false;
let ctx = "";
let mainChart;
let voting_enabled = false;
let numberOfSuggestions = 0;
let suggestionLimitReached = false;
let table;
let yesNoMode = false;
let scoreHidden = false;
let allNumbers = false;
let timer;
let currentTime = 0;
let votePopover, suggestPopover;
let loginButton;
let optionField;
let deleteAllModal, randomOptionModal, resetSettingsModal, timeOverModal, yesnoTimeOverModal, loginExpiredModal, tieModal, randomYesnoModal;
let enableVotingDropdown, enableSuggestionsDropdown;
let tableTab, chartTab, yesnoTab, overlayTab;
let settingsOffcanvas;

let thirdPartyEmotes = [];

let darkTheme = true;

let USER = {
  channel: "",
  twitchLogin: false,
  access_token: "",
  userID: "",
  platform: "",
};
let streamerColor = "";

let CHATVOTE = {
  chartType: "bar",
  sortChart: false,
  showChat: false,
  multiChoice: false,
  allowChange: false,
  subMode: false,
  questionHidden: false,
  suggestion_prefix: "!suggest",
  votingMode: "numbers",
  confettiLevel: 0,
  suggestionLimitUser: 1,
  suggestionLimit: 0,
  timerValueMinutes: 0,
  refreshWarningEnabled: false,
  linkPreviewThumbnailsEnabled: false,
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
  CHATVOTE.suggestion_prefix = elements.suggestionPrefix.value.replace(/\s+/g, "").toLowerCase();

  CHATVOTE.votingMode = elements.voteWithText.checked ? "text" : "numbers";
  CHATVOTE.chartType = elements.pieChart.checked ? "pie" : "bar";
  CHATVOTE.sortChart = elements.sortChart.checked;

  if (!CHATVOTE.suggestion_prefix) {
    CHATVOTE.suggestion_prefix = "!suggest";
    elements.suggestionPrefix.value = "!suggest";
  }

  CHATVOTE.showChat = elements.showChat.checked;
  CHATVOTE.multiChoice = elements.multiChoice.checked;
  CHATVOTE.allowChange = elements.allowChange.checked;
  CHATVOTE.subMode = elements.subMode.checked;
  CHATVOTE.confettiLevel = parseInt(elements.confettiLevel.value, 10);
  CHATVOTE.suggestionLimitUser = parseInt(elements.suggestionLimitUser.value, 10);
  CHATVOTE.suggestionLimit = parseInt(elements.suggestionLimit.value, 10);
  CHATVOTE.timerValueMinutes = parseFloat(elements.timerValueMinutes.value);
  ctx = elements.chartCanvas.getContext("2d");
  CHATVOTE.refreshWarningEnabled = elements.refreshWarningEnabled.checked;
  CHATVOTE.linkPreviewThumbnailsEnabled = elements.linkPreviewThumbnailsEnabled.checked;
  elements.suggestionsCommand.innerHTML = CHATVOTE.suggestion_prefix;
} //refreshdata

function saveSettings() {
  refreshData();
  localStorage.setItem("USER", JSON.stringify(USER));
  localStorage.setItem("CHATVOTE", JSON.stringify(CHATVOTE));
  localStorage.setItem("darkTheme", darkTheme);
} //saveSettings

function load_localStorage() {
  if (!localStorage.getItem("USER")) {
    console.log("localStorage user info not found");
  } else {
    USER = JSON.parse(localStorage.getItem("USER"));
    elements.channelName.value = USER.channel;
  }

  if (!localStorage.getItem("CHATVOTE")) {
    console.log("localStorage settings not found");
  } else {
    CHATVOTE = JSON.parse(localStorage.getItem("CHATVOTE"));
    if (CHATVOTE.votingMode !== "numbers" && CHATVOTE.votingMode !== "text") {
      CHATVOTE.votingMode = "numbers";
    }
    elements.voteWithNumbers.checked = CHATVOTE.votingMode === "numbers";
    elements.voteWithText.checked = CHATVOTE.votingMode === "text";
    if (CHATVOTE.chartType !== "bar" && CHATVOTE.chartType !== "pie") {
      CHATVOTE.chartType = "bar";
    }
    elements.barChart.checked = CHATVOTE.chartType === "bar";
    elements.pieChart.checked = CHATVOTE.chartType === "pie";
    elements.sortChart.checked = CHATVOTE.sortChart ?? false;
    elements.suggestionPrefix.value = CHATVOTE.suggestion_prefix || "!suggest";
    elements.suggestionLimitUser.value = parseInt(CHATVOTE.suggestionLimitUser, 10) ?? 1;
    elements.suggestionLimit.value = parseInt(CHATVOTE.suggestionLimit, 10) || 0;
    elements.timerValueMinutes.value = parseFloat(CHATVOTE.timerValueMinutes) || 0;

    elements.showChat.checked = CHATVOTE.showChat ?? false;
    elements.multiChoice.checked = CHATVOTE.multiChoice ?? false;
    elements.allowChange.checked = CHATVOTE.allowChange ?? false;
    elements.subMode.checked = CHATVOTE.subMode ?? false;
    elements.confettiLevel.value = CHATVOTE.confettiLevel || 0;
    elements.refreshWarningEnabled.checked = CHATVOTE.refreshWarningEnabled ?? false;
    elements.linkPreviewThumbnailsEnabled.checked = CHATVOTE.linkPreviewThumbnailsEnabled ?? false;

    if (CHATVOTE.questionHidden) {
      elements.hideQuestion.innerHTML = "arrow_drop_down";
      elements.questionLabel.style.display = "none";
    } else {
      elements.hideQuestion.innerHTML = "arrow_drop_up";
      elements.questionLabel.style.display = "block";
    }

    if (CHATVOTE.votingMode === "numbers") {
      elements.multiChoiceExample.innerText = `Example: "1 2 3"`;
    } else {
      elements.multiChoiceExample.innerText = `Example: "option1 option2 option3"`;
    }

    if (CHATVOTE.subMode) {
      elements.subOnlyAlert.style.display = "";
    } else {
      elements.subOnlyAlert.style.display = "none";
    }

    if (CHATVOTE.showChat) {
      showChat();
    }

    if (elements.sortChart.checked) {
      elements.sortChartLabel.setAttribute("data-bs-title", "Unsort chart");
    }
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
    "CHATVOTE",
    JSON.stringify({
      chartType: "bar",
      sortChart: false,
      showChat: false,
      multiChoice: false,
      allowChange: false,
      subMode: false,
      questionHidden: false,
      suggestion_prefix: "!suggest",
      votingMode: "numbers",
      confettiLevel: 0,
      suggestionLimitUser: 1,
      suggestionLimit: 0,
      timerValueMinutes: 0,
      refreshWarningEnabled: false,
      linkPreviewThumbnailsEnabled: false,
    })
  );
  location.reload();
  return false;
} //resetSettings

function resetPoll() {
  vote_results = [];
  voters = [];
  voters_options = [];
  vote_changed = [];
  oid = 0;
  numberOfSuggestions = 0;
  suggestionLimitReached = false;
  startingHue = Math.random() * 360;
  elements.voteHint.innerHTML = "";
  elements.totalVotes.innerHTML = "0";
  mainChart.destroy();
  table.clear().draw();
  loadChart();
  disableVoteButton();
  disableSuggestButton();
  changeSiteLinkTarget("_self");
  checkNumbers();
} //resetPoll

function resetYesno() {
  vote_results_yesno = {
    yea: 0,
    nay: 0,
  };
  voters_yesno = [];
  voters_options_yesno = [];
  disableVoteButton();
  disableSuggestButton();
  updateYesNo();
} //resetYesno

async function removeAndRestart() {
  if (!checkLogin() || !checkEmpty()) {
    return;
  }
  if (yesNoMode) {
    showToast(`This feature is unavailable while <img src="/pics/yeanay.webp" alt="yea nay" style="height:1.5em;" />Mode is on`, "primary", 5000);
    return;
  }
  sendData("chat.vote", USER.channel, USER.platform == "twitch" ? `twitch - ${USER.twitchLogin}` : "youtube", {
    table: table.column(2).data().toArray(),
    scores: table.column(4).data().toArray(),
  });
  let optionsToKeep = Math.min(parseInt(elements.remove.value, 10), vote_results.length);
  voters = [];
  voters_options = [];
  vote_changed = [];
  mainChart.destroy();
  let vote_results_copy = structuredClone(vote_results);
  vote_results_copy.sort(function (a, b) {
    return a.score > b.score ? -1 : a.score == b.score ? 0 : 1;
  });
  table.clear().draw();
  vote_results = [];
  for (let k = 0; k < optionsToKeep; k++) {
    pushVoteResults(vote_results_copy[k].id, vote_results_copy[k].option, vote_results_copy[k].option_emotes, vote_results_copy[k].by, 0, vote_results_copy[k].context);
    pushTable(vote_results_copy[k].id, vote_results_copy[k].option_emotes, vote_results_copy[k].by, 0, vote_results_copy[k].context);
  }
  loadChart();
  updateChart();
  enableVoteButton();
} //removeAndRestart

async function restartPoll() {
  startingHue = Math.random() * 360;
  if (timer && timer.isRunning()) {
    timer.reset();
  }
  if (yesNoMode) {
    restartYesNoMode();
    return;
  }
  let length = vote_results.length;
  voters = [];
  voters_options = [];
  vote_changed = [];
  mainChart.destroy();
  let vote_results_copy = structuredClone(vote_results);
  table.clear().draw();
  vote_results = [];
  for (let k = 0; k < length; k++) {
    pushVoteResults(vote_results_copy[k].id, vote_results_copy[k].option, vote_results_copy[k].option_emotes, vote_results_copy[k].by, 0, vote_results_copy[k].context);
    pushTable(vote_results_copy[k].id, vote_results_copy[k].option_emotes, vote_results_copy[k].by, 0, vote_results_copy[k].context);
  }
  loadChart();
  updateChart();
  enableVoteButton();
} //restartPoll

function restartYesNoMode() {
  voters_yesno = [];
  voters_options_yesno = [];
  vote_results_yesno = {
    yea: 0,
    nay: 0,
  };
  updateYesNo();
  startYesNo();
} //restartYesNoMode

async function removeWinner() {
  if (!checkLogin() || !checkEmpty()) {
    return;
  }
  if (yesNoMode) {
    showToast(`This feature is unavailable while <img src="/pics/yeanay.webp" alt="yea nay" style="height:1.5em;" />Mode is on`, "primary", 5000);
    return;
  }
  sendData("chat.vote", USER.channel, USER.platform == "twitch" ? `twitch - ${USER.twitchLogin}` : "youtube", {
    table: table.column(2).data().toArray(),
    scores: table.column(4).data().toArray(),
  });
  let vote_results_copy = structuredClone(vote_results);
  vote_results_copy.sort(function (a, b) {
    return a.score < b.score ? -1 : a.score == b.score ? 0 : 1;
  });
  voters = [];
  voters_options = [];
  vote_changed = [];
  mainChart.destroy();
  let oldlength = vote_results.length;
  table.clear().draw();
  vote_results = [];
  //oldlength - 1 to skip the option with the most votes
  for (let k = 0; k < oldlength - 1; k++) {
    pushVoteResults(vote_results_copy[k].id, vote_results_copy[k].option, vote_results_copy[k].option_emotes, vote_results_copy[k].by, 0, vote_results_copy[k].context);
    pushTable(vote_results_copy[k].id, vote_results_copy[k].option_emotes, vote_results_copy[k].by, 0, vote_results_copy[k].context);
  }
  loadChart();
  updateChart();
  enableVoteButton();
} //removeWinner

function pickRandomOption() {
  if (!checkLogin() || !checkEmpty()) {
    return;
  }
  if (yesNoMode) {
    randomYesnoModal.show();
    pickRandomYesNo();
    return;
  }
  refreshData();
  randomOptionModal.show();
  let random = Math.floor(Math.random() * vote_results.length);
  let title = elements.questionLabel.innerHTML;
  elements.randomOptionWinner.innerHTML = `<h2>${title}</h2><h3>${vote_results[random].option_emotes}</h3>`;
  if (vote_results[random].by != USER.channel) {
    elements.randomOptionWinner.innerHTML += `
    <h4>
    Submitted by: <button class="btn btn-link" style="color:${vote_results[random].context.color || "#FFFFFF"};" onclick=window.open("https://www.twitch.tv/popout/${
      USER.channel
    }/viewercard/${vote_results[random].by}?popout=","_blank","width=340,height=800")>
    ${addBadges(vote_results[random].context.badges, vote_results[random].context["user-id"], vote_results[random].context["first-msg"])}${vote_results[random].by}
    </button>
    </h4>`;
  }
  linkifyElementID("randomOptionWinner", CHATVOTE.linkPreviewThumbnailsEnabled);
  if (CHATVOTE.confettiLevel > 0) {
    showConfetti(CHATVOTE.confettiLevel);
  }
} //pickRandomOption

function removeRandomWinner() {
  sendData("chat.vote", USER.channel, USER.platform == "twitch" ? `twitch - ${USER.twitchLogin}` : "youtube", {
    table: table.column(2).data().toArray(),
    scores: table.column(4).data().toArray(),
  });
  let vote_results_copy = structuredClone(vote_results);
  //remove the random winner
  vote_results_copy = vote_results_copy.filter((o) => o.id !== randomTiedOptionWinner.id);

  voters = [];
  voters_options = [];
  vote_changed = [];
  mainChart.destroy();
  table.clear().draw();
  vote_results = [];
  for (let k = 0; k < vote_results_copy.length; k++) {
    pushVoteResults(vote_results_copy[k].id, vote_results_copy[k].option, vote_results_copy[k].option_emotes, vote_results_copy[k].by, 0, vote_results_copy[k].context);
    pushTable(vote_results_copy[k].id, vote_results_copy[k].option_emotes, vote_results_copy[k].by, 0, vote_results_copy[k].context);
  }
  loadChart();
  updateChart();
  enableVoteButton();
} //removeRandomWinner

let randomTiedOptionWinner;
function pickRandomTiedOption() {
  if (yesNoMode) {
    tieModal.hide();
    randomYesnoModal.show();
    pickRandomYesNo();
    return;
  }
  elements.removeRandomWinner.style.display = "";

  let tied = [];
  let vote_results_copy = structuredClone(vote_results);
  vote_results_copy.sort(function (a, b) {
    return a.score > b.score ? -1 : a.score == b.score ? 0 : 1;
  });

  for (let index = 0; index < vote_results_copy.length; index++) {
    if (vote_results_copy[0].score == vote_results_copy[index].score) {
      tied.push(vote_results_copy[index]);
    }
  }
  let random = Math.floor(Math.random() * tied.length);

  randomTiedOptionWinner = tied[random];

  elements.tieModalText.innerHTML = `
  <h2>${elements.questionLabel.innerHTML}</h2>
  <h3>Random tied option: "${tied[random].option_emotes}"</h3>`;

  if (tied[random].by != USER.channel) {
    elements.tieModalText.innerHTML += `
    <h4>Submitted by: 
    <button class="btn btn-link" style="color:${tied[random].context.color || "#FFFFFF"};" onclick=window.open("https://www.twitch.tv/popout/${USER.channel}/viewercard/${
      tied[random].by
    }?popout=","_blank","width=340,height=800")>
    ${addBadges(tied[random].context.badges, tied[random].context["user-id"], tied[random].context["first-msg"])}${tied[random].by}
    </button>
    </h4>`;
  }
  linkifyElementID("tieModalText", CHATVOTE.linkPreviewThumbnailsEnabled);
} //pickRandomTiedOption

function pickRandomYesNo() {
  elements.coin.className = "";
  setTimeout(() => {
    elements.coin.classList.add(Math.random() < 0.5 ? "heads" : "tails");
  }, 100);
} //pickRandomYesNo

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
    let input = msg.split(" ").filter(Boolean);
    let command = input[0].toLowerCase();

    if (CHATVOTE.votingMode == "numbers" && voting_enabled && !yesNoMode) {
      if (CHATVOTE.subMode && !context.subscriber) {
        return;
      }
      if (input[0].toLowerCase() == "!vote") {
        input = input.slice(1);
        if (input.length == 0) {
          return;
        }
      }
      if (isNaN(parseInt(input[0], 10))) {
        return;
      }

      if (voters.includes(context.username)) {
        if (!CHATVOTE.allowChange || vote_changed.includes(context.username)) {
          return;
        }
        //remove old vote
        let index = voters.indexOf(context.username);
        voters.splice(index, 1);
        let votes = voters_options[index];
        voters_options.splice(index, 1);
        for (let index = 0; index < votes.length; index++) {
          let pos = vote_results.findIndex((e) => e.option === votes[index]);
          vote_results[pos].score -= 1;
        }
        vote_changed.push(context.username);
        updateChart();
      }

      if (CHATVOTE.multiChoice && input[1]) {
        let vote_input = [];
        let voted = false;
        let votes = [];
        input = [...new Set([...input])];
        for (let index = 0, j = input.length; index < j; index++) {
          if (!isNaN(parseInt(input[index], 10))) {
            vote_input.push(parseInt(input[index], 10));
          }
        }
        for (let index = 0, j = vote_input.length; index < j; index++) {
          let pos = vote_results.findIndex((e) => e.id === vote_input[index]);
          if (pos != -1) {
            votes.push(vote_results[pos].option);
            vote_results[pos].score += 1;
            voted = true;
          }
        }
        if (voted) {
          if (context["first-msg"]) {
            firstMessageWarning(context.username);
          }
          voters.push(context.username);
          voters_options.push(votes);
          updateChart();
        }
        return;
      } else {
        let pos = vote_results.findIndex((e) => e.id === parseInt(input[0], 10));
        if (pos == -1) {
          return;
        }
        if (context["first-msg"]) {
          firstMessageWarning(context.username);
        }
        voters.push(context.username);
        voters_options.push([vote_results[pos].option]);
        vote_results[pos].score += 1;
        updateChart();
        return;
      }
    } //vote with numbers

    if (CHATVOTE.votingMode == "text" && voting_enabled && !yesNoMode) {
      if (CHATVOTE.subMode && !context.subscriber) {
        return;
      }
      if (input[0].toLowerCase() == "!vote") {
        input = input.slice(1);
        if (input.length == 0) {
          return;
        }
      }
      if (voters.includes(context.username)) {
        if (!CHATVOTE.allowChange || vote_changed.includes(context.username)) {
          return;
        }
        //remove old vote
        let index = voters.indexOf(context.username);
        voters.splice(index, 1);
        let votes = voters_options[index];
        voters_options.splice(index, 1);
        for (let index = 0; index < votes.length; index++) {
          let pos = vote_results.findIndex((e) => e.option === votes[index]);
          vote_results[pos].score -= 1;
        }
        vote_changed.push(context.username);
        updateChart();
      }
      if (CHATVOTE.multiChoice && input[1]) {
        let vote_input = [];
        let voted = false;
        let votes = [];
        input = [...new Set([...input])];
        for (let index = 0, j = input.length; index < j; index++) {
          vote_input.push(input[index].toLowerCase());
        }
        for (let index = 0, j = vote_input.length; index < j; index++) {
          let pos = vote_results.findIndex((e) => e.option_clean === vote_input[index]);
          if (pos != -1) {
            votes.push(vote_results[pos].option);
            vote_results[pos].score += 1;
            voted = true;
          }
        }
        if (voted) {
          if (context["first-msg"]) {
            firstMessageWarning(context.username);
          }
          voters.push(context.username);
          voters_options.push(votes);
          updateChart();
        }
        return;
      } else {
        let pos = vote_results.findIndex((e) => e.option_clean === input[0].toLowerCase());
        if (pos == -1) {
          return;
        }
        if (context["first-msg"]) {
          firstMessageWarning(context.username);
        }
        voters.push(context.username);
        voters_options.push([vote_results[pos].option]);
        vote_results[pos].score += 1;
        updateChart();
        return;
      }
    } //vote with text

    if (yesNoMode && voting_enabled && (command == "voteyea" || command == "votenay" || command == "yes" || command == "no")) {
      if (CHATVOTE.subMode && !context.subscriber) {
        return;
      }
      if (voters_yesno.includes(context.username)) {
        return;
      }
      if (context["first-msg"]) {
        firstMessageWarning(context.username);
      }
      if (command == "voteyea" || command == "yes") {
        voters_yesno.push(context.username);
        voters_options_yesno.push("yea");
        vote_results_yesno.yea += 1;
        updateYesNo();
        return;
      }
      voters_yesno.push(context.username);
      voters_options_yesno.push("nay");
      vote_results_yesno.nay += 1;
      updateYesNo();
      return;
    } //yesNoMode

    if (command == CHATVOTE.suggestion_prefix && suggestions_enabled) {
      if (CHATVOTE.subMode && !context.subscriber) {
        return;
      }
      let suggestion = input.slice(1).join(" ");
      let suggestion_emotes = escapeString(suggestion);
      let suggestion_unchanged = escapeString(suggestion);

      let suggestion_clean = suggestion_unchanged.toLowerCase().replace(/\W/g, "");
      if (CHATVOTE.votingMode == "text") {
        suggestion_clean = suggestion_clean.replace(/[^a-zA-Z0-9]+/g, "-");
      }
      if (!suggestion_clean) {
        return;
      }
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
          suggestion_emotes = suggestion_emotes.replaceAll(emotes[index].emote, e);
        }
      } //emotes

      suggestion_emotes = replaceEmotes(suggestion_emotes, thirdPartyEmotes);

      if (CHATVOTE.suggestionLimitUser > 0 && vote_results.reduce((acc, cur) => (cur.by === context.username ? ++acc : acc), 0) >= CHATVOTE.suggestionLimitUser) {
        return;
      }

      if (suggestionLimitReached) {
        showToast("Viewer suggestion limit reached", "warning", 5000);
        disableSuggestButton();
        return;
      }

      if (vote_results.some((e) => e.option_clean === suggestion_clean)) {
        return;
      }

      if (CHATVOTE.suggestionLimit > 0) {
        numberOfSuggestions++;
        if (numberOfSuggestions >= CHATVOTE.suggestionLimit) {
          suggestionLimitReached = true;
        }
      }
      oid++;
      pushTable(oid, suggestion_emotes, context.username, 0, context);
      pushVoteResults(oid, suggestion_unchanged, suggestion_emotes, context.username, 0, context);
      updateChart();
      return;
    } //suggest

    if (command == CHATVOTE.suggestion_prefix && !suggestions_enabled && (Date.now() - currentTime) / 1000 > 10) {
      currentTime = Date.now();
      suggestPopover.show();
      setTimeout(function () {
        suggestPopover.hide();
      }, 2000);
      return;
    } //suggestions disabled

    if (command == "!confetti") {
      if (context.username == USER.channel || context.username == "badoge") {
        showConfetti(input[1]);
        return;
      }
      return;
    } //confetti

    if (command == "!rig" && context.username == USER.channel) {
      let option = parseInt(input[1], 10);
      let extra = parseInt(input[2], 10);
      if (!isNaN(option) && !isNaN(extra)) {
        let pos = vote_results.findIndex((e) => e.id === option);
        vote_results[pos].score += extra;
        updateChart();
        return;
      }
      return;
    } //rig

    if (command == "!restart" && context.username == USER.channel) {
      restartPoll();
      return;
    } //restart poll

    if (command == "!reset" && (context.username == USER.channel || context.username == "badoge")) {
      resetSettings();
      return;
    } //reset settings

    if (!voting_enabled && (Date.now() - currentTime) / 1000 > 10) {
      if (input[0].toLowerCase() == "!vote") {
        input = input.slice(1);
      }
      if (CHATVOTE.votingMode == "numbers" && isNaN(parseInt(input[0], 10))) {
        return;
      }
      if (CHATVOTE.votingMode == "text") {
        let pos = vote_results.findIndex((e) => e.option_clean === command);
        if (pos == -1) {
          return;
        }
      } else {
        let pos = vote_results.findIndex((e) => e.id === parseInt(input[0], 10));
        if (pos == -1) {
          return;
        }
      }
      currentTime = Date.now();
      votePopover.show();
      setTimeout(function () {
        votePopover.hide();
      }, 2000);
      return;
    } //voting disabled
  }); //message

  client.on("timeout", (channel, username, reason, duration, userstate) => {
    if (voting_enabled) {
      return;
    }
    for (let i = vote_results.length - 1; i >= 0; i--) {
      if (vote_results[i].by === username && (Date.now() - vote_results[i].time) / 1000 < 5) {
        table
          .rows(function (idx, data, node) {
            return data[0] == vote_results[i].id && node.children[2].firstChild.dataset.username == username;
          })
          .remove()
          .draw();
        vote_results.splice(i, 1);
        updateChart();
        showToast(`Removed ${username}'s suggestions because they got timed out`, "warning", 2000);
        numberOfSuggestions--;
      }
    }
  }); //timeout

  client.on("connected", async (address, port) => {
    console.log(`Connected to ${address}:${port}`);
    elements.status.innerHTML = `<h4><span class="badge bg-success">Connected :)</span></h4>`;
    saveSettings();
    sendUsername(`chat.vote`, USER.channel, USER.platform == "twitch" ? `twitch - ${USER.twitchLogin}` : "youtube");
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

function startYesNo() {
  if (!checkLogin()) {
    return;
  }
  vote_results_yesno = {
    yea: 0,
    nay: 0,
  };
  enableVoteButton();
  disableSuggestButton();
  let elements = document.getElementsByClassName("yesno-warning");
  for (let index = 0; index < elements.length; index++) {
    elements[index].style.display = "";
  }
} //startYesNo

function stopYesNo() {
  disableVoteButton();
  resetYesno();
  let elements = document.getElementsByClassName("yesno-warning");
  for (let index = 0; index < elements.length; index++) {
    elements[index].style.display = "none";
  }
} //stopYesNo

function updateYesNo() {
  if (scoreHidden) {
    elements.yeaPic.style.height = "150px";
    elements.nayPic.style.height = "150px";
    elements.yeaCount.innerHTML = `? Votes`;
    elements.nayCount.innerHTML = `? Votes`;
    elements.yesnoTotalVotes.innerHTML = "?";
    return;
  }

  let yeaScale = Math.min(2, Math.max(0.5, (1 + vote_results_yesno.yea) / (1 + vote_results_yesno.nay)));
  let nayScale = 1 / yeaScale;

  elements.yeaPic.style.height = `${yeaScale * 150}px`;
  elements.nayPic.style.height = `${nayScale * 150}px`;

  elements.yeaCount.innerHTML = `${vote_results_yesno.yea} ${vote_results_yesno.yea == 1 ? "Vote" : "Votes"} (${Math.round((vote_results_yesno.yea / voters_yesno.length) * 100) || 0}%)`;
  elements.nayCount.innerHTML = `${vote_results_yesno.nay} ${vote_results_yesno.nay == 1 ? "Vote" : "Votes"} (${Math.round((vote_results_yesno.nay / voters_yesno.length) * 100) || 0}%)`;
  elements.yesnoTotalVotes.innerHTML = voters_yesno.length;
} //updateYesNo

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

function checkEmpty() {
  if (yesNoMode) {
    return true;
  }
  if (!vote_results[0] || !vote_results[1]) {
    optionField.show();
    setTimeout(function () {
      optionField.hide();
    }, 4000);
    return false;
  } else {
    return true;
  }
} //checkEmpty

async function addOption() {
  if (!checkLogin()) {
    return;
  }

  refreshData();
  let extraoption = elements.pollOption.value;
  if (extraoption.startsWith("http")) {
    try {
      let response = await fetch(`https://helper.donk.workers.dev/cors/?${extraoption.split(" ")[0]}`);
      if (response.headers.get("Content-Type").startsWith("image")) {
        extraoption = `<div class='resizable'><img src="${extraoption.split(" ")[0]}"></div> ${extraoption.split(" ").slice(1).join("")}`;
      }
    } catch (error) {
      console.log("addOption error", error);
    }
  }

  let extraoption_clean = extraoption.toLowerCase().replace(/\W/g, "");
  if (!vote_results.some((e) => e.option_clean === extraoption_clean) && extraoption_clean) {
    oid++;
    pushTable(oid, replaceEmotes(extraoption, thirdPartyEmotes), USER.channel, 0, null);
    pushVoteResults(oid, extraoption.replace(/<div.*?<\/div>/, "↖ Switch to Table view to see image :)"), replaceEmotes(extraoption, thirdPartyEmotes), USER.channel, 0, null);
    updateChart();
    elements.pollOption.value = "";
  } else {
    showToast("Duplicate/invalid input", "warning", 5000);
    elements.pollOption.value = "";
  }
} //addOption

async function addOptionBulk() {
  if (!checkLogin()) {
    return;
  }

  if (yesNoMode) {
    showToast(`This feature is unavailable while <img src="/pics/yeanay.webp" alt="yeanay" style="height:1.5em;" />Mode is on`, "primary", 5000);
    return;
  }
  let og = elements.optionList.value.split(/\r?\n/);
  elements.optionList.value = "";
  let f1 = og.filter(Boolean);
  let f2 = [];
  for (let i = 0, j = f1.length; i < j; i++) {
    f2[i] = escapeString(f1[i]);
    if (f1[i].startsWith("http")) {
      try {
        let response = await fetch(`https://helper.donk.workers.dev/cors/?${f1[i].split(" ")[0]}`);
        if (response.headers.get("Content-Type").startsWith("image")) {
          f2[i] = `<div class='resizable'><img src="${f1[i].split(" ")[0]}"></div> ${f1[i].split(" ").slice(1).join("")}`;
        }
      } catch (error) {
        console.log("addOptionBulk error", error);
      }
    }
  }
  for (let i = 0, j = f2.length; i < j; i++) {
    let option_clean = f2[i].toLowerCase().replace(/\W/g, "");

    if (!vote_results.some((e) => e.option_clean === option_clean) && option_clean) {
      oid++;
      pushTable(oid, replaceEmotes(f2[i], thirdPartyEmotes), USER.channel, 0, null);
      pushVoteResults(oid, f2[i], replaceEmotes(f2[i], thirdPartyEmotes), USER.channel, 0, null);
      updateChart();
    } else {
      showToast("Some of the entered options were duplicate/invalid", "warning", 5000);
    }
  }
} //addOptionBulk

function pushTable(id, suggestion, by, score, context) {
  let command = id;
  if (CHATVOTE.votingMode == "text") {
    suggestion = suggestion.replace(/[^a-zA-Z0-9]+/g, "-");
    command = suggestion;
  }

  if (!context && by == USER.channel) {
    context = {
      badges: "streamer",
      "user-id": USER.userID,
      "first-msg": false,
      "display-name": USER.channel,
      color: streamerColor,
    };
  }

  let badgesHTML = "";
  let color = "#FFFFFF";
  let username = by;
  if (context) {
    badgesHTML = addBadges(context.badges, context["user-id"], context["first-msg"]);
    color = context.color || "#FFFFFF";
    username = context["display-name"].toLowerCase() == by.toLowerCase() ? context["display-name"] : `${context["display-name"]} (${by})`;
  }
  table.row
    .add([
      id,
      command,
      suggestion,
      `<p class="cursorPointer" data-username="${by}" style="color:${color};" onclick='window.open("https://www.twitch.tv/popout/${USER.channel}/viewercard/${by}?popout=","_blank","width=340,height=800")'>${badgesHTML}${username}</p>`,
      score,
      `<button type="button" class="removebtn btn btn-danger"><i class="material-icons notranslate">delete_forever</i></button>`,
    ])
    .draw(false);
  linkifyElementID("options", CHATVOTE.linkPreviewThumbnailsEnabled);
  changeSiteLinkTarget("_blank");
} //pushTable

let startingHue = Math.random() * 360;
function pushVoteResults(id, option, option_emotes, by, score, context) {
  let color = `hsla(${(startingHue += Math.random() * 60 + 20)}, 100%, 50%, 0.8)`;
  let label = `${id} • "${unescapeString(option)}"`;
  let option_clean = option.toLowerCase().replace(/\W/g, "");
  if (CHATVOTE.votingMode == "text") {
    option = option.replace(/[^a-zA-Z0-9]+/g, "-");
    label = `"${option}"`;
    option_clean = option.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
  }
  vote_results.push({
    id: id,
    option: option,
    option_clean: option_clean,
    option_emotes: option_emotes,
    score: score,
    by: by,
    label: label,
    color: color,
    context: context,
    time: Date.now(),
  });
  updateHint();
  checkNumbers();
} //pushVoteResults

function updateHint() {
  elements.voteHint.innerHTML = `Type ${vote_results
    .map((e) => e.id)
    .join("/")
    .substring(0, 8)}${vote_results.length > 3 ? "..." : ""} in chat to vote. ${CHATVOTE.multiChoice ? "Multiple choices allowed (separate by a space)" : ""}`;
  if (CHATVOTE.votingMode == "text") {
    elements.voteHint.innerHTML = `Type ${vote_results
      .map((e) => e.option)
      .join("/")
      .substring(0, 20)}${vote_results.length > 3 ? "..." : ""} in chat to vote. ${CHATVOTE.multiChoice ? "Multiple choices allowed (separate by a space)" : ""}`;
  }
} //updateHint

function checkNumbers() {
  let allOptions = "";

  for (let index = 0; index < vote_results.length; index++) {
    allOptions += vote_results[index].option;
  }

  if (/^\d+$/.test(allOptions)) {
    allNumbers = true;
    elements.numberStats.style.display = "";
  } else {
    allNumbers = false;
    elements.numberStats.style.display = "none";
  }
} //checkNumbers

function download() {
  if (yesNoMode) {
    showToast("Export Data does not support Yea/Nay mode for now :(", "danger", 2000);
    return;
  }
  if (!checkLogin() || !checkEmpty()) {
    return;
  }
  let title = elements.questionLabel.innerHTML;
  if (elements.json_selected.checked) {
    if (elements.voters_selected.checked) {
      let votersobj = voters.reduce((obj, user, index) => ({ ...obj, [user]: voters_options[index] }), {});
      let url = URL.createObjectURL(new Blob([JSON.stringify(votersobj, null, 2)], { type: "application/json" }));
      let el = document.createElement("a");
      el.setAttribute("href", url);
      let filename = !title ? "chatvote list of voters" : title + "-chatvote list of voters";
      el.setAttribute("download", `${new Date().toISOString()}-${filename}-${USER.channel}.json`);
      document.body.appendChild(el);
      el.click();
      setTimeout(function () {
        document.body.removeChild(el);
        URL.revokeObjectURL(url);
      }, 1000);
    } else {
      let url = URL.createObjectURL(new Blob([JSON.stringify(vote_results, null, 2)], { type: "application/json" }));
      let el = document.createElement("a");
      el.setAttribute("href", url);
      let filename = !title ? "chatvote poll options" : title + "-chatvote poll options";
      el.setAttribute("download", `${new Date().toISOString()}-${filename}-${USER.channel}.json`);
      document.body.appendChild(el);
      el.click();
      setTimeout(function () {
        document.body.removeChild(el);
        URL.revokeObjectURL(url);
      }, 1000);
    }
    return;
  }

  if (elements.txt_selected.checked) {
    if (elements.voters_selected.checked) {
      let votersobj = voters.reduce((obj, user, index) => ({ ...obj, [user]: voters_options[index] }), {});
      let string = "Username\tOption\n";
      for (const [key, value] of Object.entries(votersobj)) {
        string += `${key}\t${value}\n`;
      }
      let url = URL.createObjectURL(new Blob([string], { type: "application/json" }));
      let el = document.createElement("a");
      el.setAttribute("href", url);
      let filename = !title ? "chatvote list of voters" : title + "-chatvote list of voters";
      el.setAttribute("download", `${new Date().toISOString()}-${filename}-${USER.channel}.txt`);
      document.body.appendChild(el);
      el.click();
      setTimeout(function () {
        document.body.removeChild(el);
        URL.revokeObjectURL(url);
      }, 1000);
    } else {
      let keys = Object.keys(vote_results[0]);
      let string = "";
      for (let index = 0, j = keys.length; index < j; index++) {
        string += keys[index] + "\t";
      }
      string += "\n";
      for (let index = 0, j = vote_results.length; index < j; index++) {
        for (const [key, value] of Object.entries(vote_results[index])) {
          string += value + "\t";
        }
        string += "\n";
      }
      let url = URL.createObjectURL(new Blob([string], { type: "application/json" }));
      let el = document.createElement("a");
      el.setAttribute("href", url);
      let filename = !title ? "chatvote poll options" : title + "-chatvote poll options";
      el.setAttribute("download", `${new Date().toISOString()}-${filename}-${USER.channel}.txt`);
      document.body.appendChild(el);
      el.click();
      setTimeout(function () {
        document.body.removeChild(el);
        URL.revokeObjectURL(url);
      }, 1000);
    }
    return;
  }
} //download

function loadChart() {
  refreshData();
  if (mainChart) {
    mainChart.destroy();
  }
  if (CHATVOTE.chartType == "bar") {
    mainChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Nothing here :)"],
        datasets: [
          {
            label: "score",
            data: [],
            borderWidth: 2,
          },
        ],
      },
      options: {
        indexAxis: "y",
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              textStrokeColor: "rgba(0,0,0,1)",
              textStrokeWidth: 2,
              color: "white",
            },
            beginAtZero: true,
          },
          y: {
            ticks: {
              textStrokeColor: "rgba(0,0,0,1)",
              textStrokeWidth: 3,
              color: "white",
              mirror: true,
              font: function (context) {
                let count = vote_results.length;
                let donk = (context.chart.height + context.chart.width) / 2;
                let size = Math.round(donk / 18) - count * 2;
                return {
                  size: size,
                };
              },
              z: 1,
            },
            beginAtZero: true,
          },
        },
        plugins: {
          tooltip: {
            enabled: false,
          },
          legend: {
            display: false,
          },
        },
      },
    });
  } else if (CHATVOTE.chartType == "pie") {
    mainChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Nothing here :)"],
        datasets: [
          {
            label: "score",
            data: [],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "right",
            onClick: null,
            labels: {
              color: "white",
              font: function (context) {
                let count = vote_results.length;
                let donk = (context.chart.height + context.chart.width) / 2;
                let size = Math.round(donk / 32) - count * 2;
                return {
                  size: size,
                };
              },
            },
          },
        },
      },
    });
  }
} //loadChart

function updateChart() {
  let vote_results_copy = structuredClone(vote_results);
  let labels = [];
  let data = [];
  let colors = [];
  let total = 0;

  if (CHATVOTE.sortChart && !scoreHidden) {
    vote_results_copy.sort(function (a, b) {
      return a.score > b.score ? -1 : a.score == b.score ? 0 : 1;
    });
  }

  for (let i = 0, j = vote_results_copy.length; i < j; i++) {
    total += vote_results_copy[i].score;
  }

  for (let i = 0, j = vote_results_copy.length; i < j; i++) {
    labels[i] = `${vote_results_copy[i].label} | ${vote_results_copy[i].score} ${vote_results_copy[i].score == 1 ? "Vote" : "Votes"} (${
      Math.round((vote_results_copy[i].score / total) * 100) || 0
    }%)`;
    data[i] = vote_results_copy[i].score;
    if (scoreHidden) {
      data[i] = 0;
      labels[i] = `${vote_results_copy[i].label} - score hidden`;
    }
    colors[i] = vote_results_copy[i].color;
    table.cell({ row: i, column: 4 }).data(vote_results_copy[i].score);
  }
  mainChart.data.labels = labels;
  mainChart.data.datasets[0].data = data;
  mainChart.data.datasets[0].backgroundColor = colors;
  mainChart.data.datasets[0].borderColor = colors;
  mainChart.update();
  elements.totalVotes.innerHTML = voters.length;

  if (allNumbers) {
    if (scoreHidden) {
      elements.averageNumber.innerHTML = "🙈";
      elements.medianNumber.innerHTML = "🙈";
      return;
    }

    if (!CHATVOTE.sortChart) {
      vote_results_copy.sort(function (a, b) {
        return a.score > b.score ? -1 : a.score == b.score ? 0 : 1;
      });
    }

    let allNumbers = [];
    for (let index = 0; index < vote_results_copy.length; index++) {
      for (let index2 = 0; index2 < vote_results_copy[index].score; index2++) {
        allNumbers.push(parseInt(vote_results_copy[index].option, 10));
      }
    }
    if (allNumbers.length) {
      let middle = Math.floor(allNumbers.length / 2);
      if (allNumbers.length % 2 === 0) {
        elements.medianNumber.innerHTML = (allNumbers[middle - 1] + allNumbers[middle]) / 2 || 0;
      } else {
        elements.medianNumber.innerHTML = allNumbers[middle] || 0;
      }
    } else {
      elements.medianNumber.innerHTML = "0";
    }

    let sum = vote_results_copy.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.option, 10) * currentValue.score, 0);
    elements.averageNumber.innerHTML = roundToTwo(sum / total) || 0;
  }
} //updateChart

function removeData(rowid) {
  for (let i = vote_results.length - 1; i >= 0; i--) {
    if (vote_results[i].id === rowid) {
      if (vote_results[i].by != USER.channel) {
        numberOfSuggestions--;
      }
      vote_results.splice(i, 1);
    }
  }
  if (vote_results.length == 0) {
    oid = 0;
    changeSiteLinkTarget("_self");
  }
  updateChart();
  checkNumbers();
} //removeData

function hideScore() {
  scoreHidden = !scoreHidden;
  elements.hideScoreIcon.innerHTML = scoreHidden ? "visibility_off" : "visibility";
  if (yesNoMode) {
    updateYesNo();
  } else {
    table.column(4).visible(!scoreHidden);
    updateChart();
  }
} //hideScore

function firstMessageWarning(username) {
  showToast(`<i class="material-icons notranslate">warning_amber</i>${username}'s first ever message in chat was a vote.`, "warning", 3000);
} //firstMessageWarning

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

function showChat() {
  if (!checkLogin()) {
    return;
  }
  if (!elements.chat.innerHTML) {
    elements.chat.innerHTML = `<iframe 
    id="chatiframe" 
    frameborder="0" 
    scrolling="yes" 
    src="https://www.twitch.tv/embed/${USER.channel}/chat?darkpopout&parent=chat.vote" 
    >
    </iframe>`;
  }
} //showChat

function hideChat() {
  if (!checkLogin()) {
    return;
  }
  while (elements.chat.firstChild) {
    elements.chat.removeChild(elements.chat.firstChild);
  }
} //hideChat

function startTimer() {
  let timerValue = parseFloat(elements.timerValueMinutes.value) * 60;
  if (isNaN(timerValue) || timerValue == 0 || !checkLogin() || !checkEmpty()) {
    return;
  }

  timer = new easytimer.Timer();
  timer.addEventListener("secondTenthsUpdated", function (e) {
    document.querySelector("#countdown .values").innerHTML = "Poll ends in " + timer.getTimeValues().toString(["minutes", "seconds", "secondTenths"]);
  });
  timer.addEventListener("targetAchieved", function (e) {
    elements.countdown.style.display = "none";
    elements.unpauseTimer.style.display = "none";
    elements.pauseTimer.style.display = "none";
    elements.stopTimer.style.display = "none";

    timer.reset();
    timer.stop();

    disableVoteButton();
    if (yesNoMode) {
      if (vote_results_yesno.nay == vote_results_yesno.yea) {
        elements.tieModalText.innerHTML = "Winner and runner up are tied, unable to pick a winner";
        elements.removeRandomWinner.style.display = "none";
        tieModal.show();
        return;
      }
      elements.yesnoTimeOverWinner.innerHTML = `
    <h2>${elements.questionLabel.innerHTML}</h2>
    <h3>${
      vote_results_yesno.nay > vote_results_yesno.yea ? `<img src="/pics/nay.webp" alt="nay" style="height: 100px" />` : `<img  src="/pics/yea.webp" alt="yea" style="height: 100px" />`
    } has won with ${Math.max(vote_results_yesno.yea, vote_results_yesno.nay)} ${Math.max(vote_results_yesno.yea, vote_results_yesno.nay) == 1 ? "vote" : "votes"}!</h3>`;
      yesnoTimeOverModal.show();
    } else {
      let vote_results_copy = structuredClone(vote_results);
      vote_results_copy.sort(function (a, b) {
        return a.score > b.score ? -1 : a.score == b.score ? 0 : 1;
      });
      if (vote_results_copy[0].score == vote_results_copy[1].score) {
        elements.tieModalText.innerHTML = "Winner and runner up are tied, unable to pick a winner";
        elements.removeRandomWinner.style.display = "none";
        tieModal.show();
        return;
      }
      elements.timeOverWinner.innerHTML = `
    <h2>${elements.questionLabel.innerHTML}</h2>
    <h3>"${vote_results_copy[0].option_emotes}" has won with ${vote_results_copy[0].score} ${vote_results_copy[0].score == 1 ? "vote" : "votes"}!</h3>`;
      if (vote_results_copy[0].by != USER.channel) {
        elements.timeOverWinner.innerHTML += `<h4>
        Submitted by: <button class="btn btn-link" style="color:${vote_results_copy[0].context.color || "#FFFFFF"};" onclick=window.open("https://www.twitch.tv/popout/${
          USER.channel
        }/viewercard/${vote_results_copy[0].by}?popout=","_blank","width=340,height=800")>
        ${addBadges(vote_results_copy[0].context.badges, vote_results_copy[0].context["user-id"], vote_results_copy[0].context["first-msg"])}${vote_results_copy[0].by}
        </button></h4>`;
      }
      linkifyElementID("timeOverWinner", CHATVOTE.linkPreviewThumbnailsEnabled);
      timeOverModal.show();
    }
    if (CHATVOTE.confettiLevel > 0) {
      showConfetti(CHATVOTE.confettiLevel);
    }
  });

  document.querySelector("#countdown .values").innerHTML = "Poll ends in " + timer.getTimeValues().toString(["minutes", "seconds", "secondTenths"]);
  disableSuggestButton();
  elements.countdown.style.display = "";
  elements.pauseTimer.style.display = "";
  elements.stopTimer.style.display = "";
  timer.start({
    countdown: true,
    precision: "secondTenths",
    startValues: {
      seconds: timerValue,
    },
  });
} //startTimer

function pauseTimer() {
  if (!timer.isRunning()) {
    return;
  }
  timer.pause();
  disableVoteButton();
  elements.pauseTimer.style.display = "none";
  elements.unpauseTimer.style.display = "";
} //pauseTimer

function unpauseTimer() {
  if (!timer.isPaused()) {
    return;
  }
  timer.start();
  enableVoteButton();
  elements.pauseTimer.style.display = "";
  elements.unpauseTimer.style.display = "none";
} //unpauseTimer

function stopTimer() {
  timer.reset();
  timer.stop();
  if (voting_enabled) {
    disableVoteButton();
  }
  elements.countdown.style.display = "none";
  elements.pauseTimer.style.display = "none";
  elements.stopTimer.style.display = "none";
  elements.unpauseTimer.style.display = "none";
} //stopTimer

function enableVoteButton() {
  if (!checkLogin() || !checkEmpty()) {
    return;
  }
  if (timer) {
    if (timer.isPaused()) {
      unpauseTimer();
    } else if (!timer.isRunning()) {
      startTimer();
    }
  } else {
    startTimer();
  }
  let hasImages = false;
  for (let index = 0; index < vote_results.length; index++) {
    if (vote_results[index].option.startsWith("↖ Switch to Table view to see image :)")) {
      hasImages = true;
      break;
    }
  }
  if (!hasImages && !yesNoMode) {
    chartTab.show();
  }
  voting_enabled = true;
  elements.enableVoting.classList.remove("btn-success");
  elements.enableVoting.classList.add("btn-danger");
  elements.enableVotingDropdown.classList.remove("btn-success");
  elements.enableVotingDropdown.classList.add("btn-danger");
  elements.enableVotingText.innerText = "Stop Voting";
} //enableVoteButton

function disableVoteButton() {
  voting_enabled = false;
  if (timer && timer.isRunning()) {
    stopTimer();
  }
  elements.enableVoting.classList.remove("btn-danger");
  elements.enableVoting.classList.add("btn-success");
  elements.enableVotingDropdown.classList.remove("btn-danger");
  elements.enableVotingDropdown.classList.add("btn-success");
  elements.enableVotingText.innerText = "Start Voting";
} //disableVoteButton

async function enableSuggestButton() {
  if (!checkLogin()) {
    return;
  }
  suggestions_enabled = true;
  elements.enableSuggestions.classList.remove("btn-success");
  elements.enableSuggestions.classList.add("btn-danger");
  elements.enableSuggestionsDropdown.classList.remove("btn-success");
  elements.enableSuggestionsDropdown.classList.add("btn-danger");
  elements.enableSuggestionsText.innerText = "Disable viewer suggestions";
} //enableSuggestButton

function disableSuggestButton() {
  suggestions_enabled = false;
  elements.enableSuggestions.classList.remove("btn-danger");
  elements.enableSuggestions.classList.add("btn-success");
  elements.enableSuggestionsDropdown.classList.remove("btn-danger");
  elements.enableSuggestionsDropdown.classList.add("btn-success");
  elements.enableSuggestionsText.innerText = "Enable viewer suggestions";
} //disableSuggestButton

function changeSuggestionCommand() {
  enableSuggestionsDropdown.hide();
  settingsOffcanvas.show();
  elements.suggestionPrefix.focus();
  elements.suggestionPrefix.select();
  elements.suggestionPrefix.scrollIntoView();
} //changeSuggestionCommand

function switchTheme(checkbox) {
  document.documentElement.setAttribute("data-bs-theme", checkbox ? "dark" : "light");
  document.getElementById("twitchLogo").style.filter = `invert(${checkbox ? 0.25 : 0.65})`;
  document.getElementById("twitchLogo2").style.filter = `invert(${checkbox ? 0.25 : 0.65})`;
  if (document.getElementById("btnGroupDrop1") && document.getElementById("btnGroupDrop2")) {
    document.getElementById("btnGroupDrop1").classList.remove(`${checkbox ? "btn-secondary" : "btn-dark"}`);
    document.getElementById("btnGroupDrop1").classList.add(`${checkbox ? "btn-dark" : "btn-secondary"}`);
    document.getElementById("btnGroupDrop2").classList.remove(`${checkbox ? "btn-secondary" : "btn-dark"}`);
    document.getElementById("btnGroupDrop2").classList.add(`${checkbox ? "btn-dark" : "btn-secondary"}`);
  }
} //switchTheme

let overlayID;
let peerConnection;
let dataChannel;
async function generateOverlay() {
  document.getElementById("overlay").innerHTML = spinner;
  let requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  try {
    let response = await fetch(`https://overlay.chat.vote/generate`, requestOptions);
    let result = await response.json();
    showToast(result.message, "info", 3000);
    overlayID = result.data.id;
    document.getElementById("overlay").innerHTML = `
    https://chat.vote/overlay#${result.data.id}<br>
    <button type="button" onclick="connectOverlay()" class="btn btn-success">Connect overlay</button>`;
    console.log(result);
  } catch (error) {
    console.log(error);
  }
} //generateOverlay

async function connectOverlay() {
  document.getElementById("overlay").innerHTML = spinner;

  let requestOptions = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  try {
    let response = await fetch(`https://overlay.donk.workers.dev/${overlayID}/offer`, requestOptions);
    let result = await response.json();
    console.log(result);
    let serverOffer = JSON.parse(result.data.offer);

    console.log("clickremoteoffer");

    peerConnection = new RTCPeerConnection();

    peerConnection.onicecandidate = async (event) => {
      if (event.candidate != null) {
        console.log("new ice candidate");
      } else {
        console.log("last ice candidate");
        let answer = peerConnection.localDescription;
        await postAnswer(answer);
      }
    };

    peerConnection.onconnectionstatechange = (event) => {
      console.log("onconnectionstatechange");
      console.log(event);
    };

    peerConnection.oniceconnectionstatechange = (event) => {
      console.log("ice connection state: " + event.target.iceConnectionState);
    };

    peerConnection.ondatachannel = (event) => {
      console.log("handledatachannel");
      dataChannel = event.channel;

      dataChannel.onopen = (event) => {
        console.log("datachannel open");
        document.getElementById("overlay").style.display = "none";
        document.getElementById("overlayControls").style.display = "";
      };

      dataChannel.onmessage = (event) => {
        console.log("datachannel message");
        console.log(event);
      };
    };

    await peerConnection.setRemoteDescription(serverOffer);
    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
  } catch (error) {
    console.log(error);
  }
} //connectOverlay

async function postAnswer(answer) {
  let body = JSON.stringify({ answer: answer });
  let requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body,
  };
  try {
    let response = await fetch(`https://overlay.donk.workers.dev/answer/${overlayID}`, requestOptions);
    let result = await response.json();
    console.log(result);
  } catch (error) {
    console.log(error);
  }
} //postAnswer

function moveX(event) {
  dataChannel.send(JSON.stringify({ axis: "x", value: parseInt(event.target.value, 10) }));
} //moveX

function moveY(event) {
  dataChannel.send(JSON.stringify({ axis: "y", value: parseInt(event.target.value, 10) }));
} //moveY

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
  }
} //loadAndConnect

window.onload = function () {
  darkTheme = (localStorage.getItem("darkTheme") || "true") === "true";
  elements.darkTheme.checked = darkTheme ?? true;
  switchTheme(elements.darkTheme.checked);

  table = $("#options").DataTable({
    responsive: true,
    retrieve: true,
    paging: false,
    scrollCollapse: true,
    ordering: false,
    searching: false,
    info: false,
    columns: [
      {
        width: "0%",
        visible: false,
      },
      {
        width: "15%",
      },
      {
        width: "52%",
      },
      {
        width: "17%",
      },
      {
        width: "10%",
      },
      {
        width: "6%",
      },
    ],
    columnDefs: [
      {
        orderable: false,
        targets: 5,
      },
    ],
    language: {
      emptyTable: 'Nothing here <img src="/pics/donk.png" alt="donk" style="height:28px; width:28px;">',
    },
  });
  elements.pollOption.focus();
  elements.pollOption.select();
  loadAndConnect();
  settingsOffcanvas = new bootstrap.Offcanvas(elements.settingsOffcanvas);
  optionField = new bootstrap.Popover(elements.pollOptionSpan);
  votePopover = new bootstrap.Popover(elements.enableVoting);
  suggestPopover = new bootstrap.Popover(elements.enableSuggestions);

  if (!USER.channel) {
    loginButton = new bootstrap.Popover(elements.loginButton);
  }

  deleteAllModal = new bootstrap.Modal(elements.deleteAllModal);
  randomOptionModal = new bootstrap.Modal(elements.randomOptionModal);
  resetSettingsModal = new bootstrap.Modal(elements.resetSettingsModal);
  timeOverModal = new bootstrap.Modal(elements.timeOverModal);
  yesnoTimeOverModal = new bootstrap.Modal(elements.yesnoTimeOverModal);
  loginExpiredModal = new bootstrap.Modal(elements.loginExpiredModal);
  tieModal = new bootstrap.Modal(elements.tieModal);
  randomYesnoModal = new bootstrap.Modal(elements.randomYesnoModal);

  enableVotingDropdown = new bootstrap.Dropdown(elements.enableVotingDropdown);
  enableSuggestionsDropdown = new bootstrap.Dropdown(elements.enableSuggestionsDropdown);

  tableTab = new bootstrap.Tab(elements.tableTabButton);
  chartTab = new bootstrap.Tab(elements.chartTabButton);
  yesnoTab = new bootstrap.Tab(elements.yesnoTabButton);
  overlayTab = new bootstrap.Tab(elements.overlayTabButton);

  elements.tableTabButton.addEventListener("shown.bs.tab", (event) => {
    if (yesNoMode) {
      yesNoMode = false;
      stopYesNo();
    }
  });

  elements.chartTabButton.addEventListener("shown.bs.tab", (event) => {
    if (yesNoMode) {
      yesNoMode = false;
      stopYesNo();
    }
  });

  elements.yesnoTabButton.addEventListener("shown.bs.tab", (event) => {
    yesNoMode = true;
    startYesNo();
  });

  elements.overlayTabButton.addEventListener("shown.bs.tab", (event) => {
    if (yesNoMode) {
      yesNoMode = false;
      stopYesNo();
    }
  });

  enableTooltips();
  enablePopovers();

  elements.questionLabel.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      elements.questionLabel.blur();
    }
  });

  elements.enableVoting.addEventListener("click", function () {
    if (voting_enabled) {
      disableVoteButton();
    } else {
      enableVoteButton();
    }
  });

  elements.enableSuggestions.addEventListener("click", function () {
    if (suggestions_enabled) {
      disableSuggestButton();
    } else {
      enableSuggestButton();
    }
  });

  elements.hideQuestion.addEventListener("click", function () {
    if (elements.hideQuestion.innerHTML == "arrow_drop_up") {
      CHATVOTE.questionHidden = true;
      elements.hideQuestion.innerHTML = "arrow_drop_down";
      elements.questionLabel.style.display = "none";
    } else {
      CHATVOTE.questionHidden = false;
      elements.hideQuestion.innerHTML = "arrow_drop_up";
      elements.questionLabel.style.display = "block";
    }
    saveSettings();
  });

  elements.pollOption.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      addOption();
    }
  });
  elements.channelName.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      connect();
    }
  });

  elements.darkTheme.onchange = function () {
    switchTheme(this.checked);
    saveSettings();
  };

  elements.voteWithNumbers.onchange = async function () {
    if (this.checked) {
      elements.multiChoiceExample.innerText = `Example: "1 2 3"`;
      CHATVOTE.votingMode = "numbers";
    }
    saveSettings();
    await restartPoll();
    updateHint();
  };
  elements.voteWithText.onchange = async function () {
    if (this.checked) {
      elements.multiChoiceExample.innerText = `Example: "option1 option2 option3"`;
      CHATVOTE.votingMode = "text";
    }
    saveSettings();
    await restartPoll();
    updateHint();
  };

  elements.barChart.onchange = function () {
    saveSettings();
    loadChart();
    updateChart();
  };
  elements.pieChart.onchange = function () {
    saveSettings();
    loadChart();
    updateChart();
  };
  elements.sortChart.onchange = function () {
    const tooltip = bootstrap.Tooltip.getInstance("#sortChartLabel");
    tooltip.setContent({ ".tooltip-inner": this.checked ? "Unsort chart" : "Sort chart" });
    saveSettings();
    loadChart();
    updateChart();
  };

  elements.suggestionLimit.onchange = function () {
    let newValue = parseInt(this.value, 10);
    if (newValue > CHATVOTE.suggestionLimit || newValue == 0) {
      suggestionLimitReached = false;
    }
    saveSettings();
  };

  elements.suggestionPrefix.oninput = function () {
    elements.suggestionsCommand.innerHTML = this.value;
    saveSettings();
  };

  elements.confettiLevel.onchange = function () {
    CHATVOTE.confettiLevel = parseInt(this.value, 10);
    saveSettings();
  };

  elements.linkPreviewThumbnailsEnabled.onchange = function () {
    saveSettings();
    const tooltipTriggerList = document.querySelectorAll("a.linktooltip");
    const tooltipList = [...tooltipTriggerList].map(function (tooltipTriggerEl) {
      tooltipTriggerEl.setAttribute("data-bs-title", spinner);
      tooltipTriggerEl.addEventListener("show.bs.tooltip", function () {
        getLinkInfo(tooltipTriggerEl, CHATVOTE.linkPreviewThumbnailsEnabled);
      });
      return new bootstrap.Tooltip(tooltipTriggerEl, {
        animation: false,
        html: true,
        delay: { show: 200, hide: 0 },
        trigger: "hover",
      });
    });
  };

  elements.showChat.onchange = function () {
    CHATVOTE.showChat = this.checked;
    if (this.checked) {
      showChat();
    } else {
      hideChat();
    }
    saveSettings();
  };

  elements.multiChoice.onchange = function () {
    saveSettings();
    updateHint();
  };

  elements.subMode.onchange = function () {
    if (this.checked) {
      elements.subOnlyAlert.style.display = "";
    } else {
      elements.subOnlyAlert.style.display = "none";
    }
    saveSettings();
  };

  $("#options").on("click", ".removebtn", function () {
    let cellid = table.row($(this).parents("tr")).data();
    if (cellid[4] > 0) {
      showToast(
        `Someone already voted for the option you just deleted, you should <i class="material-icons notranslate">refresh</i>Restart the poll so they can vote again.`,
        "warning",
        7000
      );
    }
    removeData(cellid[0]);
    table.row($(this).parents("tr")).remove().draw();
    updateHint();
  });

  loadChart();

  elements.pollOption.addEventListener("focus", async function () {
    if (!streamerColor && USER.userID) {
      streamerColor = await getStreamerColor(USER.userID);
    }
  });
  elements.deleteAll.addEventListener("click", function () {
    if (yesNoMode) {
      restartPoll();
      return;
    }
    deleteAllModal.show();
  });

  elements.restartYesno.addEventListener("click", function () {
    yesnoTimeOverModal.hide();
    restartYesNoMode();
  });

  elements.pickRandom.addEventListener("click", function () {
    if (timer && timer.isRunning()) {
      stopTimer();
    }
    pickRandomOption();
  });

  elements.hideScore.addEventListener("click", function () {
    const tooltip = bootstrap.Tooltip.getInstance("#hideScore");
    tooltip.setContent({ ".tooltip-inner": scoreHidden ? "Hide score" : "Show score" });
    hideScore();
  });
}; //onload

window.onbeforeunload = function () {
  sendData("chat.vote", USER.channel, USER.platform == "twitch" ? `twitch - ${USER.twitchLogin}` : "youtube", {
    table: table.column(2).data().toArray(),
    scores: table.column(4).data().toArray(),
  });
  if (CHATVOTE.refreshWarningEnabled && (vote_results.length > 0 || vote_results_yesno.yea > 0 || vote_results_yesno.nay > 0)) {
    return "Close/refresh warning enabled. You can turn it off in the settings.";
  }
  return null;
}; //onbeforeunload
