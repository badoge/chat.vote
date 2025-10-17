<script>
  import Navbar from "$lib/Navbar.svelte";

  import pkg from "validator";
  const { escape, unescape } = pkg;

  import {
    addBadges,
    changeSiteLinkTarget,
    getChannel7TVEmotes,
    getChannelBTTVEmotes,
    getChannelFFZEmotes,
    getGlobal7TVEmotes,
    getGlobalBTTVEmotes,
    getGlobalFFZEmotes,
    getLinkInfo,
    getStreamerColor,
    linkifyElementID,
    replaceEmotes,
    roundToTwo,
    sendData,
    showConfetti,
  } from "$lib/functions";
  import { onMount } from "svelte";
  import IcBaselineChat from "~icons/ic/baseline-chat";
  import IcBaselineMode from "~icons/ic/baseline-mode";
  import IcBaselineInfo from "~icons/ic/baseline-info";
  import IcBaselineHowToVote from "~icons/ic/baseline-how-to-vote";
  import IcBaselineFormatListBulleted from "~icons/ic/baseline-format-list-bulleted";
  import IcBaselineFormatQuote from "~icons/ic/baseline-format-quote";
  import IcBaseline123 from "~icons/ic/baseline-123";
  import IcBaselineClose from "~icons/ic/baseline-close";
  import IcBaselineRefresh from "~icons/ic/baseline-refresh";
  import IcBaselineDeleteForever from "~icons/ic/baseline-delete-forever";
  import IcBaselineVisibility from "~icons/ic/baseline-visibility";
  import IcBaselineVisibilityOff from "~icons/ic/baseline-visibility-off";
  import IcBaselineCasino from "~icons/ic/baseline-casino";
  import IcBaselineSettings from "~icons/ic/baseline-settings";
  import IcOutlineArrowDropUp from "~icons/ic/outline-arrow-drop-up";
  import IcBaselineArrowDropDown from "~icons/ic/baseline-arrow-drop-down";
  import IcBaselineStackedBarChart from "~icons/ic/baseline-stacked-bar-chart";
  import IcBaselineBarChart from "~icons/ic/baseline-bar-chart";
  import IcBaselineToc from "~icons/ic/baseline-toc";
  import IcBaselinePlusOne from "~icons/ic/baseline-plus-one";
  import IcBaselineSwapHoriz from "~icons/ic/baseline-swap-horiz";
  import IcBaselineAttachMoney from "~icons/ic/baseline-attach-money";
  import IcBaselineNotificationImportant from "~icons/ic/baseline-notification-important";
  import IcBaselinePreview from "~icons/ic/baseline-preview";
  import IcBaselineCelebration from "~icons/ic/baseline-celebration";
  import IcBaselineFileDownload from "~icons/ic/baseline-file-download";
  import IcBaselineTimer from "~icons/ic/baseline-timer";
  import IcBaselineAdd from "~icons/ic/baseline-add";
  import IcBaselineHelp from "~icons/ic/baseline-help";
  import IcBaselineRestartAlt from "~icons/ic/baseline-restart-alt";
  import IcBaselineConnectWithoutContact from "~icons/ic/baseline-connect-without-contact";
  import IcBaselineContentCopy from "~icons/ic/baseline-content-copy";
  import IcBaselineSort from "~icons/ic/baseline-sort";
  import IcBaselineLayers from "~icons/ic/baseline-layers";
  import IcBaselineStop from "~icons/ic/baseline-stop";
  import IcBaselinePause from "~icons/ic/baseline-pause";
  import IcBaselinePlayArrow from "~icons/ic/baseline-play-arrow";
  import MdiTwitch from "~icons/mdi/twitch";

  import Chart from "chart.js/auto";
  import { createGrid, themeQuartz, ModuleRegistry, AllCommunityModule } from "ag-grid-community";
  import { donkStorage, resetSettings } from "$lib/donkStorage.svelte";
  import { showToast } from "./+layout.svelte";

  let elements;
  /**
   * @type {import("ag-grid-community").GridApi<{ Command: string; Option: string; By: number; Score: number; Delete: number; }>}
   */
  let table;

  let sortChart = $state(false);
  let questionHidden = $state(false);
  let scoreHidden = $state(false);

  let USER = donkStorage("USER", null);

  let CHATVOTE = donkStorage("CHATVOTE", null);

  onMount(async () => {
    ModuleRegistry.registerModules([AllCommunityModule]);

    let gridOptions = {
      overlayNoRowsTemplate: `
      <div>
        <span class="text-xl">
          Nothing here <img class="align-text-bottom w-8 inline" src="/pics/donk.png" alt="donk">
        </span>
        <br>
        <small>Add options using the text field above</small>
      </div>`,
      columnDefs: [
        { field: "Command", flex: 1 },
        { field: "Option", flex: 5, editable: true },
        {
          field: "By",
          flex: 2,
          cellRenderer: (params) => {
            return params.value;
          },
        },
        { field: "Score", flex: 1 },
        {
          field: "Delete",
          flex: 1,
          cellRenderer: (params) => {
            const button = document.createElement("button");
            button.innerText = "Delete";
            button.classList = "btn btn-danger";
            button.addEventListener("click", () => {
              table.applyTransaction({ remove: [params.node.data] });
            });
            return button;
          },
        },
      ],
      suppressMovableColumns: true,
      theme: themeQuartz.withParams(
        {
          backgroundColor: "#1a1d20",
          foregroundColor: "#ffffff",
          browserColorScheme: "dark",
        },
        "bs-dark",
      ),
      rowData: [],
    };
    table = createGrid(document.querySelector("#table"), gridOptions);

    elements = {
      //modals
      randomOptionWinner: document.getElementById("randomOptionWinner"),
      timeOverWinner: document.getElementById("timeOverWinner"),
      yesnoTimeOverWinner: document.getElementById("yesnoTimeOverWinner"),
      tieModalText: document.getElementById("tieModalText"),
      removeRandomWinner: document.getElementById("removeRandomWinner"),
      coin: document.getElementById("coin"),

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
      optionList: document.getElementById("optionList"),

      //main
      countdown: document.getElementById("countdown"),
      voteHint: document.getElementById("voteHint"),
      chartCanvas: document.getElementById("chartCanvas"),
      totalVotes: document.getElementById("totalVotes"),
      numberStats: document.getElementById("numberStats"),
      averageNumber: document.getElementById("averageNumber"),
      medianNumber: document.getElementById("medianNumber"),
      questionLabel: document.getElementById("questionLabel"),
      pollOption: document.getElementById("pollOption"),
      addOption: document.getElementById("addOption"),
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
      connectOverlayButton: document.getElementById("connectOverlayButton"),
      generateOverlayButton: document.getElementById("generateOverlayButton"),
    };

    applySettings();

    elements.pollOption.focus();
    elements.pollOption.select();

    // elements.tableTabButton.addEventListener("shown.bs.tab", (event) => {
    //   if (yesNoMode) {
    //     yesNoMode = false;
    //     stopYesNo();
    //   }
    // });

    // elements.chartTabButton.addEventListener("shown.bs.tab", (event) => {
    //   if (yesNoMode) {
    //     yesNoMode = false;
    //     stopYesNo();
    //   }
    // });

    // elements.yesnoTabButton.addEventListener("shown.bs.tab", (event) => {
    //   yesNoMode = true;
    //   startYesNo();
    // });

    // elements.overlayTabButton.addEventListener("shown.bs.tab", (event) => {
    //   if (yesNoMode) {
    //     yesNoMode = false;
    //     stopYesNo();
    //   }
    // });

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

    elements.pollOption.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        addOption();
      }
    });

    elements.voteWithNumbers.onchange = async function () {
      if (this.checked) {
        elements.multiChoiceExample.innerText = `Example: "1 2 3"`;
        CHATVOTE.value.votingMode = "numbers";
      }
      saveSettings();
      await restartPoll();
      updateHint();
    };
    elements.voteWithText.onchange = async function () {
      if (this.checked) {
        elements.multiChoiceExample.innerText = `Example: "option1 option2 option3"`;
        CHATVOTE.value.votingMode = "text";
      }
      saveSettings();
      await restartPoll();
      updateHint();
    };

    document.getElementById("sortChart").onchange = function () {
      loadChart();
      updateChart();
    };

    elements.suggestionLimit.onchange = function () {
      let newValue = parseInt(this.value, 10);
      if (newValue > CHATVOTE.value.suggestionLimit || newValue == 0) {
        suggestionLimitReached = false;
      }
      saveSettings();
    };

    elements.suggestionPrefix.oninput = function () {
      elements.suggestionsCommand.innerHTML = this.value;
      saveSettings();
    };

    elements.confettiLevel.onchange = function () {
      CHATVOTE.value.confettiLevel = parseInt(this.value, 10);
      saveSettings();
    };

    // elements.linkPreviewThumbnailsEnabled.onchange = function () {
    //   saveSettings();
    //   const tooltipTriggerList = document.querySelectorAll("a.linktooltip");
    //   const tooltipList = [...tooltipTriggerList].map(function (tooltipTriggerEl) {
    //     tooltipTriggerEl.setAttribute("data-bs-title", spinner);
    //     tooltipTriggerEl.addEventListener("show.bs.tooltip", function () {
    //       getLinkInfo(tooltipTriggerEl, CHATVOTE.value.linkPreviewThumbnailsEnabled);
    //     });
    //     return new bootstrap.Tooltip(tooltipTriggerEl, {
    //       animation: false,
    //       html: true,
    //       delay: { show: 200, hide: 0 },
    //       trigger: "hover",
    //     });
    //   });
    // };

    elements.showChat.onchange = function () {
      CHATVOTE.value.showChat = this.checked;
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

    loadChart();

    elements.pollOption.addEventListener("focus", async function () {
      if (!streamerColor && USER.value.userID) {
        streamerColor = await getStreamerColor(USER.value.userID);
      }
    });

    elements.pickRandom.addEventListener("click", function () {
      if (timer && timer.isRunning()) {
        stopTimer();
      }
      pickRandomOption();
    });

    window.onbeforeunload = function () {
      // sendData("chat.vote", USER.value.channel, USER.value.platform == "twitch" ? `twitch - ${USER.value.twitchLogin}` : "youtube", {
      //   table: table.column(2).data().toArray(),
      //   scores: table.column(4).data().toArray(),
      // });
      if (CHATVOTE.value.refreshWarningEnabled && (vote_results.length > 0 || vote_results_yesno.yea > 0 || vote_results_yesno.nay > 0)) {
        return "Close/refresh warning enabled. You can turn it off in the settings.";
      }
      return null;
    }; //onbeforeunload
  }); //onMount

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
  let yesNoMode = false;
  let allNumbers = false;
  let timer;
  let currentTime = 0;

  let thirdPartyEmotes = [];

  let streamerColor = "";

  async function refreshData() {
    CHATVOTE.value.suggestion_prefix = elements.suggestionPrefix.value.replace(/\s+/g, "").toLowerCase();

    CHATVOTE.value.votingMode = elements.voteWithText.checked ? "text" : "numbers";
    CHATVOTE.value.sortChart = sortChart;
    CHATVOTE.value.questionHidden = questionHidden;

    if (!CHATVOTE.value.suggestion_prefix) {
      CHATVOTE.value.suggestion_prefix = "!suggest";
      elements.suggestionPrefix.value = "!suggest";
    }

    CHATVOTE.value.showChat = elements.showChat.checked;
    CHATVOTE.value.multiChoice = elements.multiChoice.checked;
    CHATVOTE.value.allowChange = elements.allowChange.checked;
    CHATVOTE.value.subMode = elements.subMode.checked;
    CHATVOTE.value.confettiLevel = parseInt(elements.confettiLevel.value, 10);
    CHATVOTE.value.suggestionLimitUser = parseInt(elements.suggestionLimitUser.value, 10);
    CHATVOTE.value.suggestionLimit = parseInt(elements.suggestionLimit.value, 10);
    CHATVOTE.value.timerValueMinutes = parseFloat(elements.timerValueMinutes.value);
    ctx = elements.chartCanvas.getContext("2d");
    CHATVOTE.value.refreshWarningEnabled = elements.refreshWarningEnabled.checked;
    CHATVOTE.value.linkPreviewThumbnailsEnabled = elements.linkPreviewThumbnailsEnabled.checked;
    elements.suggestionsCommand.innerHTML = CHATVOTE.value.suggestion_prefix;
  } //refreshdata

  function saveSettings() {
    refreshData();
  } //saveSettings

  function applySettings() {
    if (CHATVOTE.value.votingMode !== "numbers" && CHATVOTE.value.votingMode !== "text") {
      CHATVOTE.value.votingMode = "numbers";
    }
    elements.voteWithNumbers.checked = CHATVOTE.value.votingMode === "numbers";
    elements.voteWithText.checked = CHATVOTE.value.votingMode === "text";

    sortChart = CHATVOTE.value.sortChart ?? false;
    questionHidden = CHATVOTE.value.questionHidden ?? false;
    elements.suggestionPrefix.value = CHATVOTE.value.suggestion_prefix || "!suggest";
    elements.suggestionLimitUser.value = parseInt(CHATVOTE.value.suggestionLimitUser, 10) ?? 1;
    elements.suggestionLimit.value = parseInt(CHATVOTE.value.suggestionLimit, 10) || 0;
    elements.timerValueMinutes.value = parseFloat(CHATVOTE.value.timerValueMinutes) || 0;

    elements.showChat.checked = CHATVOTE.value.showChat ?? false;
    elements.multiChoice.checked = CHATVOTE.value.multiChoice ?? false;
    elements.allowChange.checked = CHATVOTE.value.allowChange ?? false;
    elements.subMode.checked = CHATVOTE.value.subMode ?? false;
    elements.confettiLevel.value = CHATVOTE.value.confettiLevel || 0;
    elements.refreshWarningEnabled.checked = CHATVOTE.value.refreshWarningEnabled ?? false;
    elements.linkPreviewThumbnailsEnabled.checked = CHATVOTE.value.linkPreviewThumbnailsEnabled ?? false;

    if (CHATVOTE.value.votingMode === "numbers") {
      elements.multiChoiceExample.innerText = `Example: "1 2 3"`;
    } else {
      elements.multiChoiceExample.innerText = `Example: "option1 option2 option3"`;
    }

    if (CHATVOTE.value.subMode) {
      elements.subOnlyAlert.style.display = "";
    } else {
      elements.subOnlyAlert.style.display = "none";
    }

    if (CHATVOTE.value.showChat) {
      showChat();
    }

    if (!localStorage.getItem("OVERLAY")) {
      console.log("localStorage overlay not found");
    } else {
      overlayID = localStorage.getItem("OVERLAY");
      elements.overlayLink.value = `https://chat.vote/overlay#${overlayID}`;
      elements.connectOverlayButton.disabled = false;
    }
  } //applySettings

  function resetPoll() {
    if (yesNoMode) {
      restartPoll();
      showToast("YEA/NAY mode options can't be removed", "alert-warning", 2000);
      return;
    }

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
    //rowData = [];

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

  function checkLogin() {
    if (!USER.value.channel) {
      showToast("You need to login first", "alert-info", 2000);
      return false;
    }
    return true;
  } //checkLogin

  async function removeAndRestart() {
    if (!checkLogin() || !checkEmpty()) {
      return;
    }
    if (yesNoMode) {
      showToast(`This feature is unavailable while <img src="/pics/yeanay.webp" alt="yea nay" style="height:1.5em;" />Mode is on`, "alert-primary", 5000);
      return;
    }
    // sendData("chat.vote", USER.value.channel, USER.value.platform == "twitch" ? `twitch - ${USER.value.twitchLogin}` : "youtube", {
    //   table: table.column(2).data().toArray(),
    //   scores: table.column(4).data().toArray(),
    // });
    let optionsToKeep = Math.min(parseInt(elements.remove.value, 10), vote_results.length);
    voters = [];
    voters_options = [];
    vote_changed = [];
    mainChart.destroy();
    let vote_results_copy = structuredClone(vote_results);
    vote_results_copy.sort(function (a, b) {
      return a.score > b.score ? -1 : a.score == b.score ? 0 : 1;
    });
    clearTable();
    vote_results = [];
    for (let k = 0; k < optionsToKeep; k++) {
      pushVoteResults(vote_results_copy[k].id, vote_results_copy[k].option, vote_results_copy[k].option_emotes, vote_results_copy[k].by, 0, vote_results_copy[k].context);
      addRow(vote_results_copy[k].id, vote_results_copy[k].option_emotes, vote_results_copy[k].by, 0, vote_results_copy[k].context);
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
    clearTable();
    vote_results = [];
    for (let k = 0; k < length; k++) {
      pushVoteResults(vote_results_copy[k].id, vote_results_copy[k].option, vote_results_copy[k].option_emotes, vote_results_copy[k].by, 0, vote_results_copy[k].context);
      addRow(vote_results_copy[k].id, vote_results_copy[k].option_emotes, vote_results_copy[k].by, 0, vote_results_copy[k].context);
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
      showToast(`This feature is unavailable while <img src="/pics/yeanay.webp" alt="yea nay" style="height:1.5em;" />Mode is on`, "alert-primary", 5000);
      return;
    }
    // sendData("chat.vote", USER.value.channel, USER.value.platform == "twitch" ? `twitch - ${USER.value.twitchLogin}` : "youtube", {
    //   table: table.column(2).data().toArray(),
    //   scores: table.column(4).data().toArray(),
    // });
    let vote_results_copy = structuredClone(vote_results);
    vote_results_copy.sort(function (a, b) {
      return a.score < b.score ? -1 : a.score == b.score ? 0 : 1;
    });
    voters = [];
    voters_options = [];
    vote_changed = [];
    mainChart.destroy();
    let oldlength = vote_results.length;
    clearTable();
    vote_results = [];
    //oldlength - 1 to skip the option with the most votes
    for (let k = 0; k < oldlength - 1; k++) {
      pushVoteResults(vote_results_copy[k].id, vote_results_copy[k].option, vote_results_copy[k].option_emotes, vote_results_copy[k].by, 0, vote_results_copy[k].context);
      addRow(vote_results_copy[k].id, vote_results_copy[k].option_emotes, vote_results_copy[k].by, 0, vote_results_copy[k].context);
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
      randomYesnoModal.showModal();
      pickRandomYesNo();
      return;
    }
    refreshData();
    randomOptionModal.showModal();
    let random = Math.floor(Math.random() * vote_results.length);
    let title = elements.questionLabel.innerHTML;
    elements.randomOptionWinner.innerHTML = `<h2>${title}</h2><h3>${vote_results[random].option_emotes}</h3>`;
    if (vote_results[random].by != USER.value.channel) {
      elements.randomOptionWinner.innerHTML += `
    <h4>
    Submitted by: <button class="btn btn-link" style="color:${vote_results[random].context.color || "#FFFFFF"};" onclick=window.open("https://www.twitch.tv/popout/${
      USER.value.channel
    }/viewercard/${vote_results[random].by}?popout=","_blank","width=340,height=800")>
    ${addBadges(vote_results[random].context.badges, vote_results[random].context["user-id"], vote_results[random].context["first-msg"])}${vote_results[random].by}
    </button>
    </h4>`;
    }
    linkifyElementID("randomOptionWinner", CHATVOTE.value.linkPreviewThumbnailsEnabled);
    if (CHATVOTE.value.confettiLevel > 0) {
      showConfetti(CHATVOTE.value.confettiLevel);
    }
  } //pickRandomOption

  function removeRandomWinner() {
    // sendData("chat.vote", USER.value.channel, USER.value.platform == "twitch" ? `twitch - ${USER.value.twitchLogin}` : "youtube", {
    //   table: table.column(2).data().toArray(),
    //   scores: table.column(4).data().toArray(),
    // });
    let vote_results_copy = structuredClone(vote_results);
    //remove the random winner
    vote_results_copy = vote_results_copy.filter((o) => o.id !== randomTiedOptionWinner.id);

    voters = [];
    voters_options = [];
    vote_changed = [];
    mainChart.destroy();
    clearTable();
    vote_results = [];
    for (let k = 0; k < vote_results_copy.length; k++) {
      pushVoteResults(vote_results_copy[k].id, vote_results_copy[k].option, vote_results_copy[k].option_emotes, vote_results_copy[k].by, 0, vote_results_copy[k].context);
      addRow(vote_results_copy[k].id, vote_results_copy[k].option_emotes, vote_results_copy[k].by, 0, vote_results_copy[k].context);
    }
    loadChart();
    updateChart();
    enableVoteButton();
  } //removeRandomWinner

  let randomTiedOptionWinner;
  function pickRandomTiedOption() {
    if (yesNoMode) {
      tieModal.close();
      randomYesnoModal.showModal();
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

    if (tied[random].by != USER.value.channel) {
      elements.tieModalText.innerHTML += `
    <h4>Submitted by: 
    <button class="btn btn-link" style="color:${tied[random].context.color || "#FFFFFF"};" onclick=window.open("https://www.twitch.tv/popout/${USER.value.channel}/viewercard/${
      tied[random].by
    }?popout=","_blank","width=340,height=800")>
    ${addBadges(tied[random].context.badges, tied[random].context["user-id"], tied[random].context["first-msg"])}${tied[random].by}
    </button>
    </h4>`;
    }
    linkifyElementID("tieModalText", CHATVOTE.value.linkPreviewThumbnailsEnabled);
  } //pickRandomTiedOption

  function pickRandomYesNo() {
    elements.coin.className = "";
    setTimeout(() => {
      elements.coin.classList.add(Math.random() < 0.5 ? "heads" : "tails");
    }, 100);
  } //pickRandomYesNo

  async function handleMessage(target, context, msg, self) {
    let input = msg.split(" ").filter(Boolean);
    let command = input[0].toLowerCase();

    if (CHATVOTE.value.votingMode == "numbers" && voting_enabled && !yesNoMode) {
      if (CHATVOTE.value.subMode && !context.subscriber) {
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
        if (!CHATVOTE.value.allowChange || vote_changed.includes(context.username)) {
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

      if (CHATVOTE.value.multiChoice && input[1]) {
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
        voters.push(context.username);
        voters_options.push([vote_results[pos].option]);
        vote_results[pos].score += 1;
        updateChart();
        return;
      }
    } //vote with numbers

    if (CHATVOTE.value.votingMode == "text" && voting_enabled && !yesNoMode) {
      if (CHATVOTE.value.subMode && !context.subscriber) {
        return;
      }
      if (input[0].toLowerCase() == "!vote") {
        input = input.slice(1);
        if (input.length == 0) {
          return;
        }
      }
      if (voters.includes(context.username)) {
        if (!CHATVOTE.value.allowChange || vote_changed.includes(context.username)) {
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
      if (CHATVOTE.value.multiChoice && input[1]) {
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
        voters.push(context.username);
        voters_options.push([vote_results[pos].option]);
        vote_results[pos].score += 1;
        updateChart();
        return;
      }
    } //vote with text

    if (yesNoMode && voting_enabled && (command == "voteyea" || command == "votenay" || command == "yes" || command == "no")) {
      if (CHATVOTE.value.subMode && !context.subscriber) {
        return;
      }
      if (voters_yesno.includes(context.username)) {
        return;
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

    if (command == CHATVOTE.value.suggestion_prefix && suggestions_enabled) {
      if (CHATVOTE.value.subMode && !context.subscriber) {
        return;
      }
      let suggestion = input.slice(1).join(" ");
      let suggestion_emotes = escape(suggestion);
      let suggestion_unchanged = escape(suggestion);

      let suggestion_clean = suggestion_unchanged.toLowerCase().replace(/\W/g, "");
      if (CHATVOTE.value.votingMode == "text") {
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
          let emote = `<img src="https://static-cdn.jtvnw.net/emoticons/v2/${emotes[index].id}/default/dark/1.0" title="${emotes[index].emote}" alt="${emotes[index].emote}" class="emote">`;
          let regex = new RegExp("\\b" + emotes[index].emote + "\\b", "g");
          suggestion_emotes = suggestion_emotes.replace(regex, emote);
        }
      } //emotes

      suggestion_emotes = replaceEmotes(suggestion_emotes, thirdPartyEmotes);

      if (CHATVOTE.value.suggestionLimitUser > 0 && vote_results.reduce((acc, cur) => (cur.by === context.username ? ++acc : acc), 0) >= CHATVOTE.value.suggestionLimitUser) {
        return;
      }

      if (suggestionLimitReached) {
        showToast("Viewer suggestion limit reached", "alert-warning", 5000);
        disableSuggestButton();
        return;
      }

      if (vote_results.some((e) => e.option_clean === suggestion_clean)) {
        return;
      }

      if (CHATVOTE.value.suggestionLimit > 0) {
        numberOfSuggestions++;
        if (numberOfSuggestions >= CHATVOTE.value.suggestionLimit) {
          suggestionLimitReached = true;
        }
      }
      oid++;
      addRow(oid, suggestion_emotes, context.username, 0, context);
      pushVoteResults(oid, suggestion_unchanged, suggestion_emotes, context.username, 0, context);
      updateChart();
      return;
    } //suggest

    if (command == CHATVOTE.value.suggestion_prefix && !suggestions_enabled && (Date.now() - currentTime) / 1000 > 10) {
      currentTime = Date.now();
      // suggestPopover.show();
      // setTimeout(function () {
      //   suggestPopover.hide();
      // }, 2000);
      return;
    } //suggestions disabled

    if (command == "!confetti") {
      if (context.username == USER.value.channel || context.username == "badoge") {
        showConfetti(input[1]);
        return;
      }
      return;
    } //confetti

    if (command == "!rig" && context.username == USER.value.channel) {
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

    if (command == "!restart" && context.username == USER.value.channel) {
      restartPoll();
      return;
    } //restart poll

    if (command == "!reset" && (context.username == USER.value.channel || context.username == "badoge")) {
      resetSettings("CHATVOTE");
      return;
    } //reset settings

    if (!voting_enabled && (Date.now() - currentTime) / 1000 > 10) {
      if (input[0].toLowerCase() == "!vote") {
        input = input.slice(1);
      }
      if (CHATVOTE.value.votingMode == "numbers" && isNaN(parseInt(input[0], 10))) {
        return;
      }
      if (CHATVOTE.value.votingMode == "text") {
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
      // votePopover.show();
      // setTimeout(function () {
      //   votePopover.hide();
      // }, 2000);
      return;
    } //voting disabled
  } //handleMessage

  async function handleTimeout(channel, username, reason, duration, userstate) {
    if (voting_enabled) {
      return;
    }
    // for (let i = vote_results.length - 1; i >= 0; i--) {
    //   if (vote_results[i].by === username && (Date.now() - vote_results[i].time) / 1000 < 5) {
    //     table
    //       .rows(function (idx, data, node) {
    //         return data[0] == vote_results[i].id && node.children[2].firstChild.dataset.username == username;
    //       })
    //       .remove()
    //       .draw();
    //     vote_results.splice(i, 1);
    //     updateChart();
    //     showToast(bootstrap,`Removed ${username}'s suggestions because they got timed out`, "alert-warning", 2000);
    //     numberOfSuggestions--;
    //   }
    // }
  } //handleTimeout

  async function getEmotes() {
    setTimeout(async () => {
      let bttv = await getGlobalBTTVEmotes();
      let ffz = await getGlobalFFZEmotes();
      let seventv = await getGlobal7TVEmotes();
      elements.bttvGlobalEmotes.innerText = bttv.length;
      elements.ffzGlobalEmotes.innerText = ffz.length;
      elements.seventvGlobalEmotes.innerText = seventv.length;
      thirdPartyEmotes = [...thirdPartyEmotes, ...bttv, ...ffz, ...seventv];
      if (USER.value.userID) {
        let bttvChannel = await getChannelBTTVEmotes(USER.value.userID);
        let ffzChannel = await getChannelFFZEmotes(USER.value.userID);
        let seventvChannel = await getChannel7TVEmotes(USER.value.userID);
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

  function checkEmpty() {
    if (yesNoMode) {
      return true;
    }
    if (!vote_results[0]) {
      showToast("Poll is empty", "alert-warning", 2000);
      return false;
    }

    return true;
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
      addRow(oid, replaceEmotes(extraoption, thirdPartyEmotes), USER.value.channel, 0, null);
      pushVoteResults(oid, extraoption.replace(/<div.*?<\/div>/, "↖ Switch to Table view to see image :)"), replaceEmotes(extraoption, thirdPartyEmotes), USER.value.channel, 0, null);
      updateChart();
      elements.pollOption.value = "";
    } else {
      showToast("Duplicate/invalid input", "alert-warning", 5000);
      elements.pollOption.value = "";
    }
  } //addOption

  async function addOptionBulk() {
    if (!checkLogin()) {
      return;
    }

    if (yesNoMode) {
      showToast(`This feature is unavailable while <img src="/pics/yeanay.webp" alt="yeanay" style="height:1.5em;" />Mode is on`, "alert-primary", 5000);
      return;
    }
    let og = elements.optionList.value.split(/\r?\n/);
    elements.optionList.value = "";
    let f1 = og.filter(Boolean);
    let f2 = [];
    for (let i = 0, j = f1.length; i < j; i++) {
      f2[i] = escape(f1[i]);
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
        addRow(oid, replaceEmotes(f2[i], thirdPartyEmotes), USER.value.channel, 0, null);
        pushVoteResults(oid, f2[i], replaceEmotes(f2[i], thirdPartyEmotes), USER.value.channel, 0, null);
        updateChart();
      } else {
        showToast("Some of the entered options were duplicate/invalid", "alert-warning", 5000);
      }
    }
  } //addOptionBulk

  function clearTable() {
    const allData = [];
    table.forEachNode((node) => allData.push(node.data));
    table.applyTransaction({ remove: allData });
  }

  function addRow(id, suggestion, by, score, context) {
    let command = id;
    if (CHATVOTE.value.votingMode == "text") {
      suggestion = suggestion.replace(/[^a-zA-Z0-9]+/g, "-");
      command = suggestion;
    }

    if (!context && by == USER.value.channel) {
      context = {
        badges: "streamer",
        "user-id": USER.value.userID,
        "first-msg": false,
        "display-name": USER.value.channel,
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

    table.applyTransaction({
      add: [
        {
          Command: command,
          Option: suggestion,
          By: `<p class="cursor-pointer" data-username="${by}" style="color:${color};" onclick='window.open("https://www.twitch.tv/popout/${USER.value.channel}/viewercard/${by}?popout=","_blank","width=340,height=800")'>${badgesHTML}${username}</p>`,
          Score: score,
        },
      ],
    });

    linkifyElementID("table", CHATVOTE?.value.linkPreviewThumbnailsEnabled);
    changeSiteLinkTarget("_blank");
  }

  let startingHue = Math.random() * 360;
  /**
   * @param {number} id
   * @param {string} option
   * @param {any} option_emotes
   * @param {any} by
   * @param {number} score
   * @param {null} context
   */
  function pushVoteResults(id, option, option_emotes, by, score, context) {
    let color = `hsla(${(startingHue += Math.random() * 60 + 20)}, 100%, 50%, 0.8)`;
    let label = `${id} • "${unescape(option)}"`;
    let option_clean = option.toLowerCase().replace(/\W/g, "");
    if (CHATVOTE?.value.votingMode == "text") {
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
      .substring(0, 8)}${vote_results.length > 3 ? "..." : ""} in chat to vote. ${CHATVOTE.value.multiChoice ? "Multiple choices allowed (separate by a space)" : ""}`;
    if (CHATVOTE.value.votingMode == "text") {
      elements.voteHint.innerHTML = `Type ${vote_results
        .map((e) => e.option)
        .join("/")
        .substring(0, 20)}${vote_results.length > 3 ? "..." : ""} in chat to vote. ${CHATVOTE.value.multiChoice ? "Multiple choices allowed (separate by a space)" : ""}`;
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

  function download(type, format) {
    if (yesNoMode) {
      showToast("Export Data does not support Yea/Nay mode for now :(", "alert-error", 2000);
      return;
    }
    if (!checkLogin() || !checkEmpty()) {
      return;
    }
    let title = elements.questionLabel.innerHTML;

    if (type == "voters" && format == "json") {
      let votersobj = voters.reduce((obj, user, index) => ({ ...obj, [user]: voters_options[index] }), {});
      let url = URL.createObjectURL(new Blob([JSON.stringify(votersobj, null, 2)], { type: "application/json" }));
      let el = document.createElement("a");
      el.setAttribute("href", url);
      let filename = !title ? "chatvote list of voters" : title + "-chatvote list of voters";
      el.setAttribute("download", `${new Date().toISOString()}-${filename}-${USER.value.channel}.json`);
      document.body.appendChild(el);
      el.click();
      setTimeout(function () {
        document.body.removeChild(el);
        URL.revokeObjectURL(url);
      }, 1000);
    }

    if (type == "voters" && format == "txt") {
      let votersobj = voters.reduce((obj, user, index) => ({ ...obj, [user]: voters_options[index] }), {});
      let string = "Username\tOption\n";
      for (const [key, value] of Object.entries(votersobj)) {
        string += `${key}\t${value}\n`;
      }
      let url = URL.createObjectURL(new Blob([string], { type: "application/json" }));
      let el = document.createElement("a");
      el.setAttribute("href", url);
      let filename = !title ? "chatvote list of voters" : title + "-chatvote list of voters";
      el.setAttribute("download", `${new Date().toISOString()}-${filename}-${USER.value.channel}.txt`);
      document.body.appendChild(el);
      el.click();
      setTimeout(function () {
        document.body.removeChild(el);
        URL.revokeObjectURL(url);
      }, 1000);
    }

    if (type == "options" && format == "json") {
      let url = URL.createObjectURL(new Blob([JSON.stringify(vote_results, null, 2)], { type: "application/json" }));
      let el = document.createElement("a");
      el.setAttribute("href", url);
      let filename = !title ? "chatvote poll options" : title + "-chatvote poll options";
      el.setAttribute("download", `${new Date().toISOString()}-${filename}-${USER.value.channel}.json`);
      document.body.appendChild(el);
      el.click();
      setTimeout(function () {
        document.body.removeChild(el);
        URL.revokeObjectURL(url);
      }, 1000);
    }

    if (type == "options" && format == "txt") {
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
      el.setAttribute("download", `${new Date().toISOString()}-${filename}-${USER.value.channel}.txt`);
      document.body.appendChild(el);
      el.click();
      setTimeout(function () {
        document.body.removeChild(el);
        URL.revokeObjectURL(url);
      }, 1000);
    }
  } //download

  function loadChart() {
    refreshData();
    if (mainChart) {
      mainChart.destroy();
    }
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
  } //loadChart

  function updateChart() {
    let vote_results_copy = structuredClone(vote_results);
    let labels = [];
    let data = [];
    let colors = [];
    let total = 0;

    //sort the data if the button checkbox is checked in the chart tab and score is not hidden
    if (sortChart && !scoreHidden) {
      vote_results_copy.sort(function (a, b) {
        return a.score > b.score ? -1 : a.score == b.score ? 0 : 1;
      });
    }

    //calculate total for % below
    for (let i = 0, j = vote_results_copy.length; i < j; i++) {
      total += vote_results_copy[i].score;
    }

    for (let i = 0, j = vote_results_copy.length; i < j; i++) {
      //chart label
      if (scoreHidden) {
        labels[i] = `${vote_results_copy[i].label} - score hidden`;
        data[i] = 0;
      } else {
        labels[i] = `${vote_results_copy[i].label} | ${vote_results_copy[i].score} ${vote_results_copy[i].score == 1 ? "Vote" : "Votes"} (${
          Math.round((vote_results_copy[i].score / total) * 100) || 0
        }%)`;
        data[i] = vote_results_copy[i].score;
      }
      colors[i] = vote_results_copy[i].color;
      //table.cell({ row: i, column: 4 }).data(vote_results_copy[i].score);
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

      let allNumbers = [];
      for (let index = 0; index < vote_results_copy.length; index++) {
        for (let index2 = 0; index2 < vote_results_copy[index].score; index2++) {
          allNumbers.push(parseInt(vote_results_copy[index].option, 10));
        }
      }

      let allNumbersSorted = Float32Array.from(allNumbers).sort();
      if (allNumbersSorted.length) {
        let middle = Math.floor(allNumbersSorted.length / 2);
        if (allNumbersSorted.length % 2 === 0) {
          elements.medianNumber.innerHTML = (allNumbersSorted[middle - 1] + allNumbersSorted[middle]) / 2 || 0;
        } else {
          elements.medianNumber.innerHTML = allNumbersSorted[middle] || 0;
        }
      } else {
        elements.medianNumber.innerHTML = "0";
      }

      let sum = vote_results_copy.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.option, 10) * currentValue.score, 0);
      elements.averageNumber.innerHTML = roundToTwo(sum / total) || 0;
    }
  } //updateChart

  //   $("#options").on("click", ".remove-option-button", function () {
  //     let cellid = table.row($(this).parents("tr")).data();
  //     table.row($(this).parents("tr")).remove().draw();

  //     for (let i = vote_results.length - 1; i >= 0; i--) {
  //       if (vote_results[i].id === cellid[0]) {
  //         if (vote_results[i].by != USER.value.channel) {
  //           numberOfSuggestions--;
  //         }
  //         vote_results.splice(i, 1);
  //       }
  //     }
  //     if (vote_results.length == 0) {
  //       oid = 0;
  //       changeSiteLinkTarget("_self");
  //     }

  //     if (cellid[4] > 0) {
  //       restartPoll();
  //       showToast(`Poll restarted`, "alert-warning", 3000);
  //     }

  //     updateChart();
  //     checkNumbers();
  //     updateHint();
  //   });

  function hideScore() {
    scoreHidden = !scoreHidden;
    if (yesNoMode) {
      updateYesNo();
    } else {
      //table.column(4).visible(!scoreHidden);
      updateChart();
    }
  } //hideScore

  function showChat() {
    if (!checkLogin()) {
      return;
    }
    if (!elements.chat.innerHTML) {
      elements.chat.innerHTML = `<iframe 
    id="chatiframe" 
    frameborder="0" 
    scrolling="yes" 
    src="https://www.twitch.tv/embed/${USER.value.channel}/chat?darkpopout&parent=beta.chat.vote" 
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
          tieModal.showModal();
          return;
        }
        elements.yesnoTimeOverWinner.innerHTML = `
    <h2>${elements.questionLabel.innerHTML}</h2>
    <h3>${
      vote_results_yesno.nay > vote_results_yesno.yea ? `<img src="/pics/nay.webp" alt="nay" style="height: 100px" />` : `<img  src="/pics/yea.webp" alt="yea" style="height: 100px" />`
    } has won with ${Math.max(vote_results_yesno.yea, vote_results_yesno.nay)} ${Math.max(vote_results_yesno.yea, vote_results_yesno.nay) == 1 ? "vote" : "votes"}!</h3>`;
        yesnoTimeOverModal.showModal();
      } else {
        let vote_results_copy = structuredClone(vote_results);
        vote_results_copy.sort(function (a, b) {
          return a.score > b.score ? -1 : a.score == b.score ? 0 : 1;
        });
        if (vote_results_copy[0].score == vote_results_copy[1].score) {
          elements.tieModalText.innerHTML = "Winner and runner up are tied, unable to pick a winner";
          elements.removeRandomWinner.style.display = "none";
          tieModal.showModal();
          return;
        }
        elements.timeOverWinner.innerHTML = `
    <h2>${elements.questionLabel.innerHTML}</h2>
    <h3>"${vote_results_copy[0].option_emotes}" has won with ${vote_results_copy[0].score} ${vote_results_copy[0].score == 1 ? "vote" : "votes"}!</h3>`;
        if (vote_results_copy[0].by != USER.value.channel) {
          elements.timeOverWinner.innerHTML += `<h4>
        Submitted by: <button class="btn btn-link" style="color:${vote_results_copy[0].context.color || "#FFFFFF"};" onclick=window.open("https://www.twitch.tv/popout/${
          USER.value.channel
        }/viewercard/${vote_results_copy[0].by}?popout=","_blank","width=340,height=800")>
        ${addBadges(vote_results_copy[0].context.badges, vote_results_copy[0].context["user-id"], vote_results_copy[0].context["first-msg"])}${vote_results_copy[0].by}
        </button></h4>`;
        }
        linkifyElementID("timeOverWinner", CHATVOTE.value.linkPreviewThumbnailsEnabled);
        timeOverModal.showModal();
      }
      if (CHATVOTE.value.confettiLevel > 0) {
        showConfetti(CHATVOTE.value.confettiLevel);
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
      //chartTab.show();
    }
    voting_enabled = true;
    elements.enableVoting.classList.remove("btn-success");
    elements.enableVoting.classList.add("btn-error");
    elements.enableVotingDropdown.classList.remove("btn-success");
    elements.enableVotingDropdown.classList.add("btn-error");
    elements.enableVotingText.innerText = "Stop Voting";
  } //enableVoteButton

  function disableVoteButton() {
    voting_enabled = false;
    if (timer && timer.isRunning()) {
      stopTimer();
    }
    elements.enableVoting.classList.remove("btn-error");
    elements.enableVoting.classList.add("btn-success");
    elements.enableVotingDropdown.classList.remove("btn-error");
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
    document.getElementById("settingsDrawer").checked = true;
    setTimeout(() => {
      elements.suggestionPrefix.focus();
      elements.suggestionPrefix.select();
    }, 500);
  } //changeSuggestionCommand

  let overlayID;
  let peerConnection;
  let dataChannel;
  async function generateOverlay() {
    elements.generateOverlayButton.innerHTML = `<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>`;
    elements.connectOverlayButton.disabled = true;

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
      console.log(result);
      showToast(result.message, "alert-info", 3000);
      overlayID = result.data.id;
      elements.overlayLink.value = `https://chat.vote/overlay#${result.data.id}`;
      localStorage.setItem("OVERLAY", result.data.id);
      elements.connectOverlayButton.disabled = false;
      elements.generateOverlayButton.innerHTML = `<i class="material-icons notranslate">restart_alt</i>Generate new overlay link`;
    } catch (error) {
      console.log(error);
    }
  } //generateOverlay

  async function copyOverlayLink() {
    let link = elements.overlayLink.value;
    if (!link) {
      showToast("Generate an overlay link first", "alert-warning", 2000);
      return;
    }
    try {
      await navigator.clipboard.writeText(link);
      showToast("Link copied :)", "alert-success", 1000);
    } catch (error) {
      showToast("Could not copy link :(", "alert-error", 1000);
    }
  } //copyOverlayLink

  async function connectOverlay() {
    elements.connectOverlayButton.innerHTML = `<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>`;
    elements.connectOverlayButton.disabled = true;

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
          showToast("Overlay connected", "alert-success", 1000);
          elements.connectOverlayButton.innerHTML = `<i class="material-icons notranslate">done</i>Overlay connected`;
          elements.connectOverlayButton.disabled = true;
          document.getElementById("overlayX").disabled = false;
          document.getElementById("overlayY").disabled = false;
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
</script>

<dialog id="randomOptionModal" class="modal">
  <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-circle btn-ghost absolute right-1 top-1"><IcBaselineClose /></button>
    </form>
    <h3 class="text-lg font-bold">Random winner</h3>
    <p id="randomOptionWinner"></p>
    <div class="modal-action">
      <form method="dialog">
        <button type="button" class="btn btn-secondary" onclick={pickRandomOption}><IcBaselineRefresh />reroll</button>
        <button type="submit" class="btn btn-primary">OK</button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<dialog id="timeOverModal" class="modal">
  <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-circle btn-ghost absolute right-1 top-1"><IcBaselineClose /></button>
    </form>
    <h3 class="text-lg font-bold">Time is up</h3>
    <p id="timeOverWinner"></p>
    <div class="modal-action">
      <form method="dialog">
        <button type="submit" class="btn btn-info" onclick={removeWinner}>Remove winner and restart</button>
        <button type="submit" class="btn btn-warning" onclick={restartPoll}><IcBaselineRefresh />Restart</button>
        <button type="submit" class="btn btn-primary">OK</button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<dialog id="yesnoTimeOverModal" class="modal">
  <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-circle btn-ghost absolute right-1 top-1"><IcBaselineClose /></button>
    </form>
    <h3 class="text-lg font-bold">Time is up</h3>
    <p id="yesnoTimeOverWinner"></p>
    <div class="modal-action">
      <form method="dialog">
        <button type="submit" class="btn btn-warning" onclick={restartYesNoMode}>Restart</button>
        <button type="submit" class="btn btn-primary">OK</button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<dialog id="tieModal" class="modal">
  <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-circle btn-ghost absolute right-1 top-1"><IcBaselineClose /></button>
    </form>
    <h3 class="text-lg font-bold">Can't pick a winner</h3>
    <p id="tieModalText">Winner and runner up are tied, unable to pick a winner</p>
    <div class="modal-action">
      <form method="dialog">
        <button type="submit" class="btn btn-info" onclick={removeRandomWinner} id="removeRandomWinner" style="display: none">Remove winner and restart</button>
        <button type="button" class="btn btn-primary" onclick={pickRandomTiedOption}><IcBaselineCasino />Pick a random option</button>
        <button type="submit" class="btn btn-success" onclick={enableVoteButton}><IcBaselineTimer />Keep voting</button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<dialog id="randomYesnoModal" class="modal">
  <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-circle btn-ghost absolute right-1 top-1"><IcBaselineClose /></button>
    </form>
    <h3 class="text-lg font-bold">Random winner</h3>
    <div id="coin" onclick={pickRandomYesNo}>
      <div class="side-a"><img src="/pics/yea.webp" alt="yea" width="150" height="150" /></div>
      <div class="side-b"><img src="/pics/nay.webp" alt="nay" width="150" height="150" /></div>
    </div>
    <div class="modal-action">
      <form method="dialog">
        <button type="button" class="btn btn-secondary" onclick={pickRandomYesNo}><IcBaselineRefresh />reroll</button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<dialog id="bulkAddModal" class="modal">
  <div class="modal-box max-w-5xl w-fit">
    <form method="dialog">
      <button class="btn btn-circle btn-ghost absolute right-1 top-1"><IcBaselineClose /></button>
    </form>

    <fieldset class="fieldset">
      <legend class="fieldset-legend text-lg font-bold"><IcBaselineFormatListBulleted class="text-align-bottom" />Add multiple options</legend>
      <textarea class="textarea w-100" placeholder="Type your options here" id="optionList" style="white-space: pre-wrap;" rows="9"></textarea>
      <div class="label">1 option per line</div>
    </fieldset>

    <div class="modal-action">
      <form method="dialog">
        <button type="submit" class="btn btn-secondary">Cancel</button>
        <button type="submit" class="btn btn-success" onclick={addOptionBulk}><IcBaselineAdd /> Add</button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<dialog id="overlayModal" class="modal">
  <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-circle btn-ghost absolute right-1 top-1"><IcBaselineClose /></button>
    </form>
    <h3 class="text-lg font-bold">Overlay info</h3>
    dank
    <div class="modal-action">
      <form method="dialog">
        <button type="submit" class="btn btn-secondary">OK</button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<Navbar messageHandler={handleMessage} timeoutHandler={handleTimeout} loginEvent={() => USER.refresh()} />

<div class="flex justify-center mb-50">
  <div class="w-[80%]">
    <div class="card card-border bg-base-200 border-base-300 w-full shadow-lg my-3">
      <div class="card-body py-1">
        <label class="swap swap-rotate top-0 right-0 absolute" style="margin-top: -4px; margin-right: 2px;">
          <input type="checkbox" bind:checked={questionHidden} onchange={refreshData} />
          <IcBaselineArrowDropDown class="swap-on" />
          <IcOutlineArrowDropUp class="swap-off" />
        </label>
        {#if !questionHidden}
          <label class="py-2" contenteditable="true" spellcheck="false" id="questionLabel" data-placeholder="Type your question here"></label>
        {/if}
      </div>
    </div>

    <div class="card card-border bg-base-200 border-base-300 shadow-lg my-3" id="enterPollOptionCard">
      <div class="card-body flex-row my-2" id="enterPollOptionCardBody">
        <span class="text-xl font-bold whitespace-nowrap self-center">Add poll options:</span>
        <div class="join flex-1">
          <input class="input join-item w-full flex-1" type="text" id="pollOption" placeholder="Poll option" />
          <div class="tooltip" data-tip="or just press enter :)">
            <button class="btn btn-secondary join-item" id="addOption" onclick={addOption}><IcBaselineAdd />Add</button>
          </div>
          <button class="btn btn-secondary join-item p-1" popovertarget="bulkAddDropdown" style="anchor-name:--bulkAddDropdownAnchor"><IcBaselineArrowDropDown /></button>
        </div>
        <div class="dropdown dropdown-end menu w-52 rounded-box bg-base-100 shadow-sm" popover id="bulkAddDropdown" style="position-anchor:--bulkAddDropdownAnchor">
          <ul class="p-1">
            <li><a onclick={() => bulkAddModal.showModal()} role="button"><IcBaselineFormatListBulleted />Add multiple options</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="alert alert-info alert-dismissible my-3" id="subOnlyAlert" role="alert" style="display: none">
      <IcBaselineAttachMoney /> Subscribers only poll. Click on the subscribe button, you might have a free prime sub
      <img src="/pics/smile.png" alt="bot" style="height: 1.5em" />
      <button type="button" class="btn btn-info">
        <svg width="1.5em" height="1.5em" style="fill: white" version="1.1" viewBox="0 0 20 20" x="20px" y="20px">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M18 5v8a2 2 0 0 1-2 2H4a2.002 2.002 0 0 1-2-2V5l4 3 4-4 4 4 4-3z"></path>
        </svg>
        Subscribe Free
      </button>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>

    <div class="card border-danger text-center my-3" id="countdown" style="display: none">
      <div class="card-body">
        <div class="values d-inline-flex" style="font-size: 3em"></div>
        <div class="btn-group float-end h-100" role="group" aria-label="Timer controls" id="timerControls">
          <button class="btn btn-outline-secondary" type="button" id="stopTimer" onclick={stopTimer}>
            <IcBaselineStop />
          </button>
          <button class="btn btn-outline-secondary" type="button" id="pauseTimer" onclick={pauseTimer}>
            <IcBaselinePause />
          </button>
          <button class="btn btn-outline-secondary" type="button" style="display: none" id="unpauseTimer" onclick={unpauseTimer}>
            <IcBaselinePlayArrow />
          </button>
        </div>
      </div>
    </div>

    <div class="tabs tabs-lift my-3">
      <label class="tab [--tab-bg:theme(colors.base-200)]">
        <input type="radio" name="mainTabs" checked />
        <IcBaselineToc /> Table view
      </label>
      <div class="tab-content bg-base-200 border-base-300 p-6">
        <div id="table" data-ag-theme-mode="bs-dark" style="height:50vh;"></div>
      </div>

      <label class="tab [--tab-bg:theme(colors.base-200)]">
        <input type="radio" name="mainTabs" />
        <IcBaselineStackedBarChart style="transform: rotateZ(90deg)" /> Chart view
      </label>
      <div class="tab-content bg-base-200 border-base-300 p-6">
        <div id="chartDiv" class="row">
          <small id="voteHint" style="height: 0px" class="text-center"></small>
          <canvas id="chartCanvas"></canvas>
        </div>
        <div class="row p-2">
          <div class="col">
            <label class="swap swap-rotate tooltip" id="sortChartLabel" data-tip={sortChart ? "Unsort chart" : "Sort chart"}>
              <input type="checkbox" id="sortChart" bind:checked={sortChart} />
              <div class="swap-on"><IcBaselineBarChart style="transform: rotateZ(90deg)" /></div>
              <div class="swap-off"><IcBaselineSort /></div>
            </label>

            <div class="chartStatDiv">Total votes: <span id="totalVotes">0</span></div>
            <div style="display: none" class="chartStatDiv ms-1" id="numberStats">
              <div class="me-1">Average: <span id="averageNumber">0</span> • Median: <span id="medianNumber">0</span></div>
            </div>
          </div>
        </div>
      </div>

      <label class="tab [--tab-bg:theme(colors.base-200)]">
        <input type="radio" name="mainTabs" />
        <img src="/pics/yeanay.webp" alt="yeanay" style="height: 20px" />Mode
      </label>
      <div class="tab-content bg-base-200 border-base-300 p-6">
        <div class="row">
          <div class="col">
            Type <img src="/pics/yea.webp" alt="yea" style="height: 24px; width: 24px" />|yes or <img src="/pics/nay.webp" alt="nay" style="height: 24px; width: 24px" />|no in chat to vote
          </div>
        </div>
        <div id="yesnoDiv" class="row align-items-center">
          <div class="col">
            <img id="yeaPic" src="/pics/yea.webp" alt="yea" style="height: 150px" />
            <br /><span id="yeaCount">0 Votes (0%)</span>
          </div>
          <div class="col">
            <img id="nayPic" src="/pics/nay.webp" alt="nay" style="height: 150px" />
            <br /><span id="nayCount">0 Votes (0%)</span>
          </div>
        </div>
        <div class="row p-2">
          <div class="col">
            <div class="chartStatDiv">Total votes: <span id="yesnoTotalVotes">0</span></div>
          </div>
        </div>
      </div>

      <label class="tab [--tab-bg:theme(colors.base-200)]" id="overlayTabButton" style="display: none;">
        <input type="radio" name="mainTabs" />
        <IcBaselineLayers /> Overlay
      </label>
      <div class="tab-content bg-base-200 border-base-300 p-6">
        <div class="input-group my-3">
          <span class="input-group-text">Overlay URL</span>
          <input
            id="overlayLink"
            type="password"
            readonly
            class="form-control"
            placeholder="Click 'Generate new overlay link' to get your overlay URL"
            aria-label="Click 'Generate new overlay link' to get your overlay URL"
          />
          <button class="btn btn-outline-secondary" type="button" onclick={copyOverlayLink}> <IcBaselineContentCopy /> </button>
          <button class="btn btn-success" type="button" id="connectOverlayButton" onclick={connectOverlay} disabled>
            <IcBaselineConnectWithoutContact /> Connect overlay
          </button>
          <button class="btn btn-danger" type="button" id="generateOverlayButton" onclick={generateOverlay}>
            <IcBaselineRestartAlt /> Generate new overlay link
          </button>
          <button class="btn btn-info" type="button" data-bs-toggle="modal" onclick={() => overlayModal.showModal()}><IcBaselineHelp /></button>
        </div>

        <label for="overlayX" class="form-label">x</label>
        <input disabled type="range" class="form-range" oninput={moveX} id="overlayX" value="50" min="0" max="100" />

        <label for="overlayY" class="form-label">y</label>
        <input disabled type="range" class="form-range" oninput={moveY} id="overlayY" value="50" min="0" max="100" />
      </div>
    </div>

    <div class="flex flex-row flex-wrap gap-2">
      <div class="join flex-none me-3">
        <button class="btn btn-success join-item defaultbtn" id="enableVoting" data-bs-title="Voting disabled" data-bs-content="A viewer is trying to vote but voting is disabled">
          <span id="enableVotingText">Start Voting</span>
        </button>
        <button class="btn btn-success join-item defaultbtn p-1" id="enableVotingDropdown" popovertarget="votingSettingsDropdown" style="anchor-name:--votingSettingsDropdownAnchor">
          <IcBaselineSettings />
        </button>
      </div>
      <div
        class="dropdown dropdown-top dropdown-center menu w-90 overflow-visible rounded-box bg-base-200 shadow-sm"
        popover
        id="votingSettingsDropdown"
        style="position-anchor:--votingSettingsDropdownAnchor"
      >
        <div class="p-4">
          <span class="text-xl font-bold"><IcBaselineMode class="inline align-text-bottom" />Voting mode</span>
          <div class="mb-3">
            <input class="radio" type="radio" name="votingmode" id="voteWithNumbers" aria-describedby="voteWithNumbersdesc" checked />
            <label for="voteWithNumbers"><IcBaseline123 class="inline text-lg" />Numbers</label>
            <div class="tooltip tooltip-right align-text-bottom">
              <div class="tooltip-content max-w-[70vw]">
                <img src="/pics/m2.webp" alt="vote with numbers example" />
              </div>
              <IcBaselineHelp />
            </div>
            <br />
            <small id="voteWithNumbersdesc" class="opacity-70">Viewers vote by typing the number of the option (1, 2)</small>
            <br />
            <input class="radio" type="radio" name="votingmode" id="voteWithText" aria-describedby="voteWithTextdesc" />
            <label for="voteWithText"><IcBaselineFormatQuote class="inline text-lg" />Option name</label>
            <div class="tooltip tooltip-right align-text-bottom">
              <div class="tooltip-content max-w-[70vw]">
                <img src="/pics/m3.webp" alt="vote with option name example" />
              </div>
              <IcBaselineHelp />
            </div>
            <br />
            <small id="voteWithTextdesc" class="opacity-70">Viewers vote by typing the option name (option1, option2)</small>
          </div>

          <div class="divider"></div>

          <span class="text-xl font-bold"><IcBaselineTimer class="inline align-text-bottom" />Poll timer</span>
          <label class="input">
            <input type="number" min="0" value="0" id="timerValueMinutes" onchange={saveSettings} />
            <span class="label">minutes</span>
          </label>
          <br />
          <small class="opacity-70">Timer automatically starts when you start voting. Set to 0 to disable the timer</small>
        </div>
      </div>

      <div class="join flex-none me-3">
        <button
          class="btn btn-success join-item defaultbtn block"
          id="enableSuggestions"
          data-bs-title="Viewer suggestions disabled"
          data-bs-content="A viewer is trying to post a suggestion but viewer suggestions are disabled"
        >
          <span id="enableSuggestionsText" class="text-lg">Enable viewer suggestions</span>
          <br />
          <span id="suggestionsCommand" class="notranslate">!suggest</span>
        </button>
        <button
          class="btn btn-success join-item defaultbtn p-1"
          id="enableSuggestionsDropdown"
          popovertarget="suggestionSettingsDropdown"
          style="anchor-name:--suggestionSettingsDropdownAnchor"
        >
          <IcBaselineSettings />
        </button>
      </div>
      <div
        class="dropdown dropdown-top dropdown-center menu w-90 rounded-box bg-base-200 shadow-sm"
        popover
        id="suggestionSettingsDropdown"
        style="position-anchor:--suggestionSettingsDropdownAnchor"
      >
        <div class="p-4">
          <label class="input">
            <span class="label">Per user suggestion limit</span>
            <input type="number" id="suggestionLimitUser" onchange={saveSettings} min="0" value="1" step="1" />
          </label>
          <br />
          <small class="opacity-70">How many suggestions each viewer can send. 0=unlimited</small>

          <br />

          <label class="input mt-3">
            <span class="label">Total suggestion limit</span>
            <input type="number" id="suggestionLimit" onchange={saveSettings} min="0" value="0" step="1" />
          </label>
          <br />
          <small class="opacity-70">The total amount of suggestions from all viewers. 0=unlimited</small>

          <div class="divider"></div>

          <span>The suggestion command can be changed <a role="button" class="link link-primary" onclick={changeSuggestionCommand}>here</a></span>
        </div>
      </div>

      <div class="drawer w-fit me-3">
        <input id="settingsDrawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
          <label for="settingsDrawer" class="btn btn-accent drawer-button defaultbtn text-xl"><IcBaselineSettings />Settings</label>
        </div>
        <div class="drawer-side">
          <label for="settingsDrawer" aria-label="close sidebar" class="drawer-overlay"></label>
          <div class="menu bg-base-200 text-base-content min-h-full w-100 p-4">
            <h1 class="text-2xl font-bold mb-2"><IcBaselineSettings class="inline align-text-bottom" />Settings</h1>

            <div class="card card-border bg-base-100 mb-2">
              <div class="card-body w-90 p-2">
                <div class="join">
                  <div>
                    <button class="btn btn-outline btn-accent join-item pointer-events-none p-2">Keep top</button>
                  </div>
                  <select class="select select-accent join-item w-15" id="remove">
                    <option selected value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                  <button class="btn btn-outline btn-accent join-item pointer-events-none p-2">options and</button>
                  <button class="btn btn-accent join-item" onclick={removeAndRestart}>restart<IcBaselineRefresh /></button>
                </div>
              </div>
            </div>

            <div class="card card-border bg-base-100 mb-2">
              <div class="card-body w-90 p-2">
                <h2 class="card-title"><IcBaselineChat />Chat commands</h2>
                <label class="input">
                  <span class="label">Suggestion command</span>
                  <input class="notranslate" type="text" id="suggestionPrefix" value="!suggest" placeholder="!suggest" />
                </label>
                <small class="opacity-70">The command to put before a suggestion<br /><span class="notranslate">Example: !suggest my summer car</span></small>
              </div>
            </div>

            <div class="card card-border bg-base-100 mb-2">
              <div class="card-body w-90 p-2">
                <h2 class="card-title"><IcBaselineHowToVote />Voting settings</h2>
                <div class="mb-3">
                  <label class="label">
                    <input type="checkbox" id="multiChoice" class="toggle toggle-success" onchange={saveSettings} />
                    <IcBaselinePlusOne /> <span class="font-bold">Allow multiple choices</span>
                  </label>
                  <br />
                  <small class="opacity-70">
                    Viewers will be able to vote for multiple options at once.<br />
                    <span id="multiChoiceExample">Example: <span class="notranslate">1 2 3</span></span>
                  </small>
                  <br />
                  <small class="yesno-warning text-warning" style="display: none"> Does not support <img src="/pics/yeanay.webp" alt="yeanay" style="height: 1.2em" />Mode </small>
                </div>
                <div class="mb-3">
                  <label class="label">
                    <input type="checkbox" id="allowChange" class="toggle toggle-success" onchange={saveSettings} />
                    <IcBaselineSwapHoriz /> <span class="font-bold">Allow vote changing</span>
                  </label>
                  <br />
                  <small class="opacity-70"> Viewers will be able to change the option they selected by voting again. They can change their vote only once </small>
                  <br />
                  <small class="yesno-warning text-warning" style="display: none"> Does not support <img src="/pics/yeanay.webp" alt="yeanay" style="height: 1.2em" />Mode </small>
                </div>

                <div class="mb-3">
                  <label class="label">
                    <input type="checkbox" id="subMode" class="toggle toggle-success" onchange={saveSettings} />
                    <IcBaselineAttachMoney /> <span class="font-bold">Subscribers only poll</span>
                  </label>
                  <br />
                  <small class="opacity-70"> Viewers that are not subscribed to your channel will not be able to vote or make suggestions </small>
                </div>
              </div>
            </div>

            <div class="card card-border bg-base-100 mb-2">
              <div class="card-body w-90 p-2">
                <h2 class="card-title"><IcBaselineHowToVote />asd</h2>

                <div class="mb-3">
                  <label class="label">
                    <input type="checkbox" id="showChat" class="toggle toggle-success" onchange={saveSettings} />
                    <MdiTwitch /> <span class="font-bold">Show chat</span>
                  </label>
                  <br />
                  <small class="opacity-70"> Shows your Twitch chat on the right side </small>
                </div>

                <div class="mb-3">
                  <label class="label">
                    <input type="checkbox" id="refreshWarningEnabled" class="toggle toggle-success" onchange={saveSettings} />
                    <IcBaselineNotificationImportant /> <span class="font-bold">Enable close/refresh warning</span>
                  </label>
                  <br />
                  <small class="opacity-70"> Shows a warning before leaving/refreshing the site so that you don't accidentally lose your poll results </small>
                </div>

                <div class="join">
                  <div>
                    <button class="btn btn-outline btn-secondary join-item pointer-events-none p-2"><IcBaselineCelebration />Confetti</button>
                  </div>
                  <select class="select select-secondary join-item" id="confettiLevel" onchange={saveSettings}>
                    <option value="0" selected>Off</option>
                    <option value="1">Low</option>
                    <option value="2">Medium</option>
                    <option value="3">High</option>
                    <option value="4">INSANE ZULOL</option>
                  </select>
                </div>
                <small class="opacity-70">Confetti triggers when the timer runs out or when you pick a random option.</small>
              </div>
            </div>

            <div class="card card-border bg-base-100 mb-2">
              <div class="card-body w-90 p-2">
                <h2 class="card-title"><IcBaselineHowToVote />asd</h2>

                <div class="mb-3">
                  <label class="label">
                    <input type="checkbox" id="linkPreviewThumbnailsEnabled" class="toggle toggle-success" onchange={saveSettings} />
                    <IcBaselinePreview /> <span class="font-bold">Show thumbnails in link preview</span>
                  </label>
                  <br />
                  <small class="text-error"> Use with caution; viewers might link images that break Twitch's TOS </small>
                </div>

                <div class="join">
                  <div>
                    <button class="btn btn-outline btn-info join-item pointer-events-none p-2">Refresh 3rd party emotes</button>
                  </div>
                  <div>
                    <button class="btn btn-info join-item p-2" onclick={getEmotes}><IcBaselineRefresh /></button>
                  </div>
                </div>

                <div class="opacity-70">
                  Loaded emotes (global/channel): BTTV:
                  <span id="bttvGlobalEmotes">0</span>/<span id="bttvChannelEmotes">0</span> | FFZ: <span id="ffzGlobalEmotes">0</span>/<span id="ffzChannelEmotes">0</span>
                  | 7TV: <span id="seventvGlobalEmotes">0</span>/<span id="seventvChannelEmotes">0</span>
                </div>
              </div>
            </div>

            <div class="card card-border bg-base-100 mb-2">
              <div class="card-body w-90 p-2">
                <h2 class="card-title"><IcBaselineHowToVote />asd</h2>

                <button class="btn btn-error" popovertarget="resetSettingsPopover" style="anchor-name:--resetSettingsPopoverAnchor"><IcBaselineDeleteForever /> Reset all settings </button>
                <div
                  class="dropdown dropdown-right menu w-52 rounded-box bg-base-200 border border-red-200 shadow-sm p-3"
                  popover
                  id="resetSettingsPopover"
                  style="position-anchor:--resetSettingsPopoverAnchor"
                >
                  <span class="text-lg font-bold">Are you sure?</span><br />
                  All settings will be reset and the page will reload<br />
                  <button type="button" class="btn btn-error float-end my-3" onclick={() => resetSettings("CHATVOTE")}> <IcBaselineDeleteForever />Reset settings</button>
                </div>
                <small class="text-body-secondary">Resets all settings and reloads the page</small>
              </div>
            </div>
            <div class="card card-border bg-base-100 mb-2">
              <div class="card-body w-90 p-2">
                <h2 class="card-title"><IcBaselineFileDownload />Export Data</h2>

                <span class="text-lg font-bold">List of voters</span>
                <div class="join mb-3">
                  <button class="btn btn-primary join-item" onclick={() => download("voters", "json")}><IcBaselineFileDownload />JSON</button>
                  <button class="btn btn-primary join-item" onclick={() => download("voters", "txt")}><IcBaselineFileDownload />TXT</button>
                </div>

                <span class="text-lg font-bold">Poll options</span>
                <div class="join">
                  <button class="btn btn-primary join-item" onclick={() => download("options", "json")}><IcBaselineFileDownload />JSON</button>
                  <button class="btn btn-primary join-item" onclick={() => download("options", "txt")}><IcBaselineFileDownload />TXT</button>
                </div>
              </div>
            </div>

            <div class="card card-border bg-base-100 mb-2">
              <div class="card-body w-90 p-2">
                <h2 class="card-title"><IcBaselineInfo />About</h2>
                <p>
                  Site by <a class="link" target="_blank" rel="noopener noreferrer" href="https://www.twitch.tv/badoge">badoge</a> :)<br />
                  If you find any issues or if you have suggestions or questions, you can contact me:<br />
                  <a class="link" target="_blank" rel="noopener noreferrer" href="https://www.twitch.tv/popout/badoge/chat?popout=">in this Twitch chat</a><br />
                  or on <a class="link" target="_blank" rel="noopener noreferrer" href="https://discord.gg/FR8bgQdPUT">Discord</a><br />
                  or by <a class="link" href="mailto:contact@chat.vote">email</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="join ml-auto" role="group" aria-label="Restart, random option, hide score, and delete all buttons">
        <div class="tooltip tooltip-bottom" data-tip="Restart the poll with the same options">
          <button class="btn btn-warning join-item quick-actions" id="restartPoll" onclick={restartPoll}>
            <IcBaselineRefresh class="text-2xl" />
          </button>
        </div>

        <div class="tooltip tooltip-bottom" data-tip="Pick a random option">
          <button class="btn btn-info join-item quick-actions" id="pickRandom">
            <IcBaselineCasino class="text-2xl" />
          </button>
        </div>

        <div class="tooltip tooltip-bottom" data-tip={scoreHidden ? "Show score" : "Hide score"}>
          <button class="btn btn-secondary join-item quick-actions" id="hideScore" onclick={hideScore}>
            <label class="swap">
              <input type="checkbox" onclick={hideScore} bind:checked={scoreHidden} />
              <div class="swap-on"><IcBaselineVisibilityOff class="text-2xl" /></div>
              <div class="swap-off"><IcBaselineVisibility class="text-2xl" /></div>
            </label>
          </button>
        </div>

        <div class="tooltip tooltip-bottom" data-tip="Remove all options from the poll">
          <button class="btn btn-error join-item quick-actions" id="deleteAll" popovertarget="deleteAllDropdown" style="anchor-name:--deleteAllDropdownAnchor">
            <IcBaselineDeleteForever class="text-2xl" />
          </button>
          <div
            class="dropdown dropdown-end menu w-52 rounded-box border border-red-200 bg-base-200 shadow-lg p-3"
            popover
            id="deleteAllDropdown"
            style="position-anchor:--deleteAllDropdownAnchor"
          >
            <span class="text-lg font-bold">Are you sure?</span><br />
            All poll options will be deleted<br />
            <button class="btn btn-error rounded float-end" onclick={resetPoll}>
              <IcBaselineDeleteForever />Delete all
            </button>
          </div>
        </div>
      </div>
    </div>

    <div id="chat"></div>
  </div>
</div>

<style>
  .chartStatDiv {
    height: 40px;
    box-sizing: border-box;
    display: inline-block;
    border-width: 1px;
    border: 1px solid var(--bs-secondary-color);
    border-radius: 6px;
    padding: 6px 12px 12px 6px;
    vertical-align: middle;
    color: var(--bs-secondary-color);
  }

  #enterPollOptionCardBody {
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 10px;
    padding-right: 10px;
  }

  #enterPollOptionCardBody > .input-group {
    padding-bottom: 10px;
  }

  #questionLabel:hover {
    cursor: text;
  }

  #optionList {
    resize: both;
    white-space: nowrap;
    overflow: auto;
    margin-bottom: 10px;
  }

  #chatiframe {
    height: 90vh;
    width: 100%;
  }

  #questionLabel {
    text-shadow: none;
    font-size: 2.5rem;
    font-weight: 700;
  }

  #questionLabel:focus {
    color: #969696;
    cursor: text;
  }

  [data-placeholder]:empty:before {
    content: attr(data-placeholder);
  }

  .defaultbtn {
    height: 62px;
  }

  .quick-actions {
    height: 62px !important;
    width: 62px !important;
  }

  #linkpreview {
    padding: 10px;
    display: none;
    position: fixed;
    pointer-events: none;
    z-index: 1;
    max-width: 400px;
  }

  .previewThumbnail {
    max-width: 100%;
  }

  #pauseTimer,
  #confettiLevel,
  #rerollDiv > span:nth-child(4) {
    border-radius: 0 6px 6px 0;
  }

  .values {
    margin: -10px;
  }

  #randomOptionWinner,
  #timeOverWinner {
    word-wrap: break-word;
  }

  #countdown > .card-body {
    padding: 0px;
  }

  #enableVotingText {
    font-size: 1.5rem;
    line-height: 1.5rem;
  }

  .resizable {
    display: inline-block;
    resize: both;
    overflow: hidden;
    line-height: 0;
    height: 100%;
    max-height: 50vh;
  }

  .resizable img {
    height: 100%;
    max-height: 50vh;
  }

  .timer > button,
  .timer > label {
    border-color: #b8431f;
    background-color: #d34e24;
    border-radius: 6px;
  }

  .timer > input {
    border-color: #b8431f;
    cursor: pointer;
  }

  #timerControls {
    margin-top: 5px;
    margin-right: 5px;
  }

  #stopTimer:hover,
  #pauseTimer:hover,
  #unpauseTimer:hover,
  #timerValueMinutes > button {
    background-color: #a73a19;
    border-color: #b8431f;
  }

  .accordion-button,
  .accordion-button i {
    padding: 5px;
    font-size: 2rem;
  }

  #chartDiv {
    position: relative;
    height: 80vh;
    width: 100%;
  }

  #yesnoDiv {
    position: relative;
    height: 40vh;
    width: 100%;
  }

  #yeaPic,
  #nayPic {
    max-height: 300px;
    min-height: 50px;
    transition: height 0.2s ease;
  }

  #restartPoll,
  #deleteAll,
  #hideScore,
  #pickRandom {
    height: 41.5px;
  }

  /* yea nay coinflip start */

  #coin {
    position: relative;
    margin: 0 auto;
    width: 150px;
    height: 150px;
    cursor: pointer;
  }
  #coin div {
    width: 100%;
    height: 100%;
  }

  #coin {
    transition: -webkit-transform 1s ease-in;
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
  }
  #coin div {
    position: absolute;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
  .side-a {
    z-index: 100;
  }
  .side-b {
    z-index: 100;
    -webkit-transform: rotateY(-180deg);
    transform: rotateY(-180deg);
  }

  #coin.heads {
    -webkit-animation: flipHeads 3s ease-out forwards;
    -moz-animation: flipHeads 3s ease-out forwards;
    -o-animation: flipHeads 3s ease-out forwards;
    animation: flipHeads 3s ease-out forwards;
  }
  #coin.tails {
    -webkit-animation: flipTails 3s ease-out forwards;
    -moz-animation: flipTails 3s ease-out forwards;
    -o-animation: flipTails 3s ease-out forwards;
    animation: flipTails 3s ease-out forwards;
  }

  @keyframes flipHeads {
    from {
      -webkit-transform: rotateY(0);
      -moz-transform: rotateY(0);
      transform: rotateY(0);
    }
    to {
      -webkit-transform: rotateY(1800deg);
      -moz-transform: rotateY(1800deg);
      transform: rotateY(1800deg);
    }
  }
  @keyframes flipTails {
    from {
      -webkit-transform: rotateY(0);
      -moz-transform: rotateY(0);
      transform: rotateY(0);
    }
    to {
      -webkit-transform: rotateY(1980deg);
      -moz-transform: rotateY(1980deg);
      transform: rotateY(1980deg);
    }
  }

  /* yea nay coinflip end */
</style>
