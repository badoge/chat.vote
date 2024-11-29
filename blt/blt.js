let elements = {
  //modals
  loginExpiredModal: document.getElementById("loginExpiredModal"),

  deleteBracketModal: document.getElementById("deleteBracketModal"),
  deleteBracketModalBody: document.getElementById("deleteBracketModalBody"),
  deleteBracketButton: document.getElementById("deleteBracketButton"),
  deleteTriviaModal: document.getElementById("deleteTriviaModal"),
  deleteTriviaModalBody: document.getElementById("deleteTriviaModalBody"),
  deleteTriviaButton: document.getElementById("deleteTriviaButton"),
  tierlistEditorModal: document.getElementById("tierlistEditorModal"),
  tierlistEditor: document.getElementById("tierlistEditor"),

  previewModal: document.getElementById("previewModal"),
  previewModalBody: document.getElementById("previewModalBody"),
  generateChatModal: document.getElementById("generateChatModal"),
  playlist: document.getElementById("playlist"),
  generateModal: document.getElementById("generateModal"),
  generateBracketType: document.getElementById("generateBracketType"),
  spotifyplaylistSettings: document.getElementById("spotifyplaylistSettings"),
  tiermakerSettings: document.getElementById("tiermakerSettings"),
  clipsSettings: document.getElementById("clipsSettings"),
  emotesSettings: document.getElementById("emotesSettings"),
  uwufufuSettings: document.getElementById("uwufufuSettings"),
  ytchannelSettings: document.getElementById("ytchannelSettings"),
  ytplaylistSettings: document.getElementById("ytplaylistSettings"),

  publishedModal: document.getElementById("publishedModal"),
  bracketCode: document.getElementById("bracketCode"),
  bracketLink: document.getElementById("bracketLink"),

  spotifyPlaylistLink: document.getElementById("spotifyPlaylistLink"),
  spotifyPlaylistPreview: document.getElementById("spotifyPlaylistPreview"),
  tiermakerLink: document.getElementById("tiermakerLink"),
  tiermakerPreview: document.getElementById("tiermakerPreview"),
  clipsChannel: document.getElementById("clipsChannel"),
  clipsPreview: document.getElementById("clipsPreview"),
  emotesChannel: document.getElementById("emotesChannel"),
  emotesPreview: document.getElementById("emotesPreview"),
  uwufufuLink: document.getElementById("uwufufuLink"),
  uwufufuPreview: document.getElementById("uwufufuPreview"),
  ytchannelLink: document.getElementById("ytchannelLink"),
  ytchannelPreview: document.getElementById("ytchannelPreview"),
  ytplaylistLink: document.getElementById("ytplaylistLink"),
  ytplaylistPreview: document.getElementById("ytplaylistPreview"),

  communityModal: document.getElementById("communityModal"),
  communityModalBody: document.getElementById("communityModalBody"),
  shareCode: document.getElementById("shareCode"),
  importModal: document.getElementById("importModal"),
  importModalBody: document.getElementById("importModalBody"),
  myBracketsModal: document.getElementById("myBracketsModal"),
  myBracketsModalBody: document.getElementById("myBracketsModalBody"),

  startModal: document.getElementById("startModal"),
  formatSelect: document.getElementById("formatSelect"),
  optionLimit: document.getElementById("optionLimit"),
  bracketSettings: document.getElementById("bracketSettings"),
  tierlistSettings: document.getElementById("tierlistSettings"),
  changeCommand: document.getElementById("changeCommand"),
  changeCommandCopy: document.getElementById("changeCommandCopy"),
  highestTier: document.getElementById("highestTier"),
  averageTier: document.getElementById("averageTier"),
  keepVotingEnabled: document.getElementById("keepVotingEnabled"),
  keepVotingEnabledCopy: document.getElementById("keepVotingEnabledCopy"),
  disableAnimations: document.getElementById("disableAnimations"),
  disableAnimationsCopy: document.getElementById("disableAnimationsCopy"),
  spotifyWarning: document.getElementById("spotifyWarning"),

  startTriviaModal: document.getElementById("startTriviaModal"),

  //navbar
  status: document.getElementById("status"),
  topRight: document.getElementById("topRight"),
  loginButton: document.getElementById("loginButton"),
  channelName: document.getElementById("channelName"),
  darkTheme: document.getElementById("darkTheme"),

  myBrackets: document.getElementById("myBrackets"),
  myTrivia: document.getElementById("myTrivia"),
  importBracket: document.getElementById("importBracket"),
  importTrivia: document.getElementById("importTrivia"),

  bracketEditor: document.getElementById("bracketEditor"),
  bracketEditorHeader: document.getElementById("bracketEditorHeader"),
  bracketTitle: document.getElementById("bracketTitle"),
  bracketDescription: document.getElementById("bracketDescription"),
  bracketOptionsContainer: document.getElementById("bracketOptionsContainer"),

  triviaEditor: document.getElementById("triviaEditor"),
  triviaEditorHeader: document.getElementById("triviaEditorHeader"),
  triviaTitle: document.getElementById("triviaTitle"),
  triviaDescription: document.getElementById("triviaDescription"),
  triviaQuestionsContainer: document.getElementById("triviaQuestionsContainer"),

  addBracketOption: document.getElementById("addBracketOption"),
  addTriviaQuestion: document.getElementById("addTriviaQuestion"),

  editor: document.getElementById("editor"),

  //bracket
  toastContainer: document.getElementById("toastContainer"),
  bracket: document.getElementById("bracket"),

  centerTitle: document.getElementById("centerTitle"),
  title: document.getElementById("title"),
  round: document.getElementById("round"),
  winnerTitle: document.getElementById("winnerTitle"),
  winner: document.getElementById("winner"),

  left_container: document.getElementById("left_container"),
  right_container: document.getElementById("right_container"),

  left_title: document.getElementById("left_title"),
  right_title: document.getElementById("right_title"),

  left_card: document.getElementById("left_card"),
  left_card_header: document.getElementById("left_card_header"),
  right_card: document.getElementById("right_card"),
  right_card_header: document.getElementById("right_card_header"),
  left_card_zoom_icon: document.getElementById("left_card_zoom_icon"),
  right_card_zoom_icon: document.getElementById("right_card_zoom_icon"),
  left_name: document.getElementById("left_name"),
  right_name: document.getElementById("right_name"),
  left_score: document.getElementById("left_score"),
  right_score: document.getElementById("right_score"),
  left_command: document.getElementById("left_command"),
  right_command: document.getElementById("right_command"),
  left_value: document.getElementById("left_value"),
  text_image_left: document.getElementById("text_image_left"),
  youtubeEmbedContainer_left: document.getElementById("youtubeEmbedContainer_left"),
  youtubeEmbed_left: document.getElementById("youtubeEmbed_left"),
  spotifyEmbedContainer_left: document.getElementById("spotifyEmbedContainer_left"),
  spotifyEmbed_left: document.getElementById("spotifyEmbed_left"),
  twitchClipsEmbed_left: document.getElementById("twitchClipsEmbed_left"),
  videoEmbed_left: document.getElementById("videoEmbed_left"),
  right_value: document.getElementById("right_value"),
  text_image_right: document.getElementById("text_image_right"),
  youtubeEmbedContainer_right: document.getElementById("youtubeEmbedContainer_right"),
  youtubeEmbed_right: document.getElementById("youtubeEmbed_right"),
  spotifyEmbedContainer_right: document.getElementById("spotifyEmbedContainer_right"),
  spotifyEmbed_right: document.getElementById("spotifyEmbed_right"),
  twitchClipsEmbed_right: document.getElementById("twitchClipsEmbed_right"),
  videoEmbed_right: document.getElementById("videoEmbed_right"),
  left_info: document.getElementById("left_info"),
  right_info: document.getElementById("right_info"),

  restart: document.getElementById("restart"),
  hideScore: document.getElementById("hideScore"),
  hideScoreIcon: document.getElementById("hideScoreIcon"),
  enableVoting: document.getElementById("enableVoting"),
  pickWinner: document.getElementById("pickWinner"),

  enableVotingTierlist: document.getElementById("enableVotingTierlist"),

  //tierlist
  tierlist: document.getElementById("tierlist"),
  tierlistContainer: document.getElementById("tierlistContainer"),
  upcoming: document.getElementById("upcoming"),
  upcoming_thumbnails: document.getElementById("upcoming_thumbnails"),
  tierlistItem: document.getElementById("tierlistItem"),
  tierlistItemDrag: document.getElementById("tierlistItemDrag"),
  tierlistLabel0: document.getElementById("tierlistLabel0"),
  tierlistLabel1: document.getElementById("tierlistLabel1"),
  tierlistLabel2: document.getElementById("tierlistLabel2"),
  tierlistLabel3: document.getElementById("tierlistLabel3"),
  tierlistLabel4: document.getElementById("tierlistLabel4"),
  tierlistLabel5: document.getElementById("tierlistLabel5"),
  tierlistLabel6: document.getElementById("tierlistLabel6"),
  tierlistScore0: document.getElementById("tierlistScore0"),
  tierlistScore1: document.getElementById("tierlistScore1"),
  tierlistScore2: document.getElementById("tierlistScore2"),
  tierlistScore3: document.getElementById("tierlistScore3"),
  tierlistScore4: document.getElementById("tierlistScore4"),
  tierlistScore5: document.getElementById("tierlistScore5"),
  tierlistScore6: document.getElementById("tierlistScore6"),

  currentTierlistItemName: document.getElementById("currentTierlistItemName"),
  currentTierlistItem: document.getElementById("currentTierlistItem"),
  pickWinnerTierlist: document.getElementById("pickWinnerTierlist"),
  hideScoreTierlist: document.getElementById("hideScoreTierlist"),
  hideScoreTierlistIcon: document.getElementById("hideScoreTierlistIcon"),

  text_image_tierlist: document.getElementById("text_image_tierlist"),
  youtubeEmbedContainer_tierlist: document.getElementById("youtubeEmbedContainer_tierlist"),
  youtubeEmbed_tierlist: document.getElementById("youtubeEmbed_tierlist"),
  spotifyEmbedContainer_tierlist: document.getElementById("spotifyEmbedContainer_tierlist"),
  spotifyEmbed_tierlist: document.getElementById("spotifyEmbed_tierlist"),
  twitchClipsEmbed_tierlist: document.getElementById("twitchClipsEmbed_tierlist"),
  videoEmbed_tierlist: document.getElementById("videoEmbed_tierlist"),

  //trivia

  triviaPoints: document.getElementById("triviaPoints"),
  triviaPointsCopy: document.getElementById("triviaPointsCopy"),
  triviaScoring: document.getElementById("triviaScoring"),
  triviaScoringCopy: document.getElementById("triviaScoringCopy"),
  oneChance: document.getElementById("oneChance"),
  oneChanceCopy: document.getElementById("oneChanceCopy"),
  showHint: document.getElementById("showHint"),
  showHintCopy: document.getElementById("showHintCopy"),
  trivia: document.getElementById("trivia"),
  triviaTitleCard: document.getElementById("triviaTitleCard"),
  triviaDescriptionCard: document.getElementById("triviaDescriptionCard"),
  questionNumber: document.getElementById("questionNumber"),
  question: document.getElementById("question"),
  triviaAnswer: document.getElementById("triviaAnswer"),

  triviaUsersDiv: document.getElementById("triviaUsersDiv"),
  triviaUsers: document.getElementById("triviaUsers"),

  triviaMedia: document.getElementById("triviaMedia"),
  image_trivia: document.getElementById("image_trivia"),
  youtubeEmbedContainer_trivia: document.getElementById("youtubeEmbedContainer_trivia"),
  youtubeEmbed_trivia: document.getElementById("youtubeEmbed_trivia"),
  spotifyEmbedContainer_trivia: document.getElementById("spotifyEmbedContainer_trivia"),
  spotifyEmbed_trivia: document.getElementById("spotifyEmbed_trivia"),
  twitchClipsEmbed_trivia: document.getElementById("twitchClipsEmbed_trivia"),
  videoEmbed_trivia: document.getElementById("videoEmbed_trivia"),
};

const icons = {
  text: `<i class="material-icons notranslate">description</i>`,
  image: `<i class="material-icons notranslate">image</i>`,
  youtube: `<i class="material-icons notranslate">play_arrow</i>`,
  twitch: `<i class="material-icons notranslate">movie_creation</i>`,
  spotify: `<i class="material-icons notranslate">audiotrack</i>`,
  streamable: `<i class="material-icons notranslate">play_arrow</i>`,
  "supa video/audio": `<i class="material-icons notranslate">play_arrow</i>`,
};
const spotifyURLRegex = /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:(album|track|playlist)\/|\?uri=spotify:track:)((\w|-){22})/;

let darkTheme = true;

let client;
let loginButton;
let loginExpiredModal,
  deleteBracketModal,
  deleteTriviaModal,
  tierlistEditorModal,
  previewModal,
  generateChatModal,
  generateModal,
  communityModal,
  startModal,
  startTriviaModal,
  publishedModal,
  importModal;
let votePopover, votePopoverTierlist;
let currentBracket = {};
let currentTierlist = {};
let currentFormat;
let voters = [];
let voting_enabled = false;
let currentTime = 0;

let vote_results = { left: 0, right: 0 };

let USER = {
  channel: "",
  twitchLogin: false,
  access_token: "",
  userID: "",
  platform: "",
};

let BRACKETS = {
  brackets: [],
};

let TRIVIA = {
  trivia: [],
};

function resetSettings() {
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
  localforage.setItem("BRACKETS_TIERLISTS", JSON.stringify([]));
  localforage.setItem("TRIVIA", JSON.stringify([]));

  location.reload();
  return false;
} //resetSettings

async function refreshData() {
  darkTheme = elements.darkTheme.checked ?? true;

  if (!USER.twitchLogin) {
    USER.channel = escapeString(elements.channelName.value.replace(/\s+/g, "").toLowerCase());
    USER.platform = "twitch";
  }
  if (!USER.userID && USER.channel) {
    USER.userID = await getUserID(USER.channel);
  }
} //refreshdata

function saveSettings() {
  refreshData();
  localStorage.setItem("USER", JSON.stringify(USER));
  localforage.setItem("BRACKETS_TIERLISTS", JSON.stringify(BRACKETS));
  localforage.setItem("TRIVIA", JSON.stringify(TRIVIA));
  localStorage.setItem("darkTheme", darkTheme);
} //saveSettings

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
  }
} //loadAndConnect

async function load_localStorage() {
  if (!localStorage.getItem("USER")) {
    console.log("localStorage user info not found");
  } else {
    USER = JSON.parse(localStorage.getItem("USER"));
    elements.channelName.value = USER.channel;
  }

  localforage.config({
    driver: localforage.INDEXEDDB,
    name: "chat.vote/blt",
    version: 1.0,
    storeName: "blt",
    description: "brackets, tierlists and trivia",
  });

  try {
    const storedBracketsTierlists = await localforage.getItem("BRACKETS_TIERLISTS");
    if (!storedBracketsTierlists) {
      console.log("localStorage brackets/tierlists not found");
      elements.myBrackets.innerHTML = `<span class="text-body-secondary">Nothing here</span>`;
    } else {
      BRACKETS = JSON.parse(storedBracketsTierlists);
      loadBrackets();
    }
  } catch (error) {
    console.log(error);
  }

  try {
    const storedTrivia = await localforage.getItem("TRIVIA");
    if (!storedTrivia) {
      console.log("localStorage trivia not found");
      elements.myTrivia.innerHTML = `<span class="text-body-secondary">Nothing here</span>`;
    } else {
      TRIVIA = JSON.parse(storedTrivia);
      loadTrivia();
    }
  } catch (error) {
    console.log(error);
  }
} //load_localStorage

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
        data-bs-content="You need sign in first"
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

function login() {
  elements.topRight.innerHTML = `<div class="btn-group" role="group" aria-label="log in button group">
      <button type="button" class="btn btn-twitch"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></button>
      <div class="btn-group" role="group">
          <button id="btnGroupDropLogin" type="button" class="btn btn-twitch dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
        </button>
          <ul class="dropdown-menu dropdown-menu-lg-end" aria-labelledby="btnGroupDropLogin">
              <li><a class="dropdown-item" onclick="logout()" href="#"><i class="material-icons notranslate">logout</i>Log out</a></li>
          </ul>
      </div>
  </div>`;
  window.open("/prompt.html", "loginWindow", "toolbar=0,status=0,scrollbars=0,width=500px,height=800px");
  return false;
} //login

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
      data-bs-content="You need sign in first"
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
  resetSettings();
} //logout

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

    if (triviaStarted) {
      if (triviaUsersAnswered.includes(context.username)) {
        return;
      }
      if (triviaPoints < 1) {
        return;
      }

      if (elements.oneChance.checked) {
        triviaUsersAnswered.push(context.username);
      }

      if (answerTypes[questionNumber - 1] == "multipleChoice") {
        if (msg.trim().toLowerCase() !== correctChoice) {
          return;
        }
      } else {
        if (!triviaAnswer.includes(msg.trim().toLowerCase())) {
          return;
        }
      }

      let pos = triviaUsers.findIndex((element) => element.username === context.username);
      if (pos != -1) {
        triviaUsers[pos].points += triviaPoints;
        updateTriviaLeaderboard();
      } else {
        let user = {
          points: triviaPoints,
          id: context["user-id"],
          username: context.username,
          displayname: context["display-name"],
          color: context.color,
          badges: addBadges(context.badges, context["user-id"], context["first-msg"]),
        };
        addTriviaUser(user);
      }

      triviaUsersAnswered.push(context.username);

      if (elements.triviaScoring.value == "decay") {
        triviaPoints--;
      }

      if (elements.triviaScoring.value == "first") {
        triviaPoints = 0;
      }

      return;
    } //trivia

    if (!voting_enabled) {
      if (currentFormat == "single") {
        if ((command == "1" || command == "a" || command == "2" || command == "b") && (Date.now() - currentTime) / 1000 > 10) {
          currentTime = Date.now();
          votePopover.show();
          setTimeout(function () {
            votePopover.hide();
          }, 2000);
        } //if chatter is trying to vote for bracket while voting is disabled show popover
      }
      if (currentFormat == "tierlist") {
        if (currentTierlistCommands.includes(command) && (Date.now() - currentTime) / 1000 > 10) {
          currentTime = Date.now();
          votePopoverTierlist.show();
          setTimeout(function () {
            votePopoverTierlist.hide();
          }, 2000);
        } //if chatter is trying to vote for tierlist while voting is disabled show popover
      }
      return;
    } //voting disabled

    if (voters.includes(context["user-id"])) {
      return;
    } //chatter already voted

    if (currentFormat == "single") {
      if (command == currentCommand.left) {
        vote_results.left++;
        voters.push(context["user-id"]);
        updateScores();
        return;
      } //chatter voted for left option

      if (command == currentCommand.right) {
        vote_results.right++;
        voters.push(context["user-id"]);
        updateScores();
        return;
      } //chatter voted for right option
    }

    if (currentFormat == "tierlist" && currentTierlistCommands.includes(command)) {
      let pos = currentTierlistData.findIndex((e) => e.command === command);
      if (pos == -1) {
        return;
      }
      currentTierlistData[pos].score += 1;
      voters.push(context["user-id"]);
      updateScores();
      return;
    }
  }); //message

  //client.on("timeout", (channel, username, reason, duration, userstate) => {}); //timeout

  client.on("connected", async (address, port) => {
    console.log(`Connected to ${address}:${port}`);
    elements.status.innerHTML = `<h4><span class="badge bg-success">Connected :)</span></h4>`;
    saveSettings();
    sendUsername(`chat.vote/blt`, USER.channel, USER.platform == "twitch" ? `twitch - ${USER.twitchLogin}` : "youtube");
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

function addTriviaUser(user) {
  user.name = user.username == user.displayname.toLowerCase() ? `${user.displayname}` : `${user.displayname} (${user.username})`;
  user.color = !user.color ? "#FFFFFF" : user.color;
  triviaUsers.push(user);
  updateTriviaLeaderboard();
} //addTriviaUser

function updateTriviaLeaderboard() {
  triviaUsers.sort(function (a, b) {
    return a.points > b.points ? -1 : a.points == b.points ? 0 : 1;
  });
  elements.triviaUsers.innerHTML = "";
  let html = "";
  for (let index = 0, j = triviaUsers.length; index < j; index++) {
    html += `
    <li class="list-group-item">
    ${triviaUsers[index].badges}<span style="color:${triviaUsers[index].color};">${triviaUsers[index].name}:</span>
    ${triviaUsers[index].points.toLocaleString()} ${triviaUsers[index].points == 1 ? "point" : "points"}
    </li>`;
  }
  elements.triviaUsers.innerHTML = html;
} //updateTriviaLeaderboard

function addBracketOption(name = "", type = "", value = "", thumbnail = "", video = "") {
  let optionNumber = ++document.querySelectorAll(".option-name").length;
  let optionType = "text";
  if (optionNumber > 1) {
    optionType = Array.from(document.getElementsByClassName("option-type")).find((e) => parseInt(e.dataset.optionId, 10) === optionNumber - 1).value || "text";
  }

  if (type) {
    optionType = type;
  }

  elements.bracketOptionsContainer.insertAdjacentHTML(
    "beforeend",
    `<div class="card mb-2" data-option-id="${optionNumber}">
      <div class="card-header">
      Option #${optionNumber}
      <i class="material-icons notranslate deletebtn float-end" onclick="deleteBracketOption('${optionNumber}')">delete_forever</i>
      </div>
      <div class="card-body">
        <div class="input-group mb-3">
          <span class="input-group-text">Value/Link</span>
          <input type="text" class="form-control option-value" data-option-id="${optionNumber}" onchange="saveBracket(true)" value="${value}" ${
      optionType == "streamable" ? `data-video="${video}"` : ""
    } placeholder="Option Value/Link" aria-label="Option Value" />
          <button class="btn btn-outline-secondary" onclick="previewOption(${optionNumber},this)" type="button"><i class="material-icons notranslate">preview</i>Preview</button>
        </div>

        <div class="input-group mb-3">
          <label class="input-group-text">Type</label>
          <select class="form-select option-type" data-option-id="${optionNumber}" onchange="saveBracket(true)">
            <option value="text" ${optionType == "text" ? "selected" : ""}>Text</option>
            <option value="image" ${optionType == "image" ? "selected" : ""}>Image</option>
            <option value="youtube" ${optionType == "youtube" ? "selected" : ""}>YouTube video</option>
            <option value="twitch" ${optionType == "twitch" ? "selected" : ""}>Twitch clip</option>
            <option value="spotify" ${optionType == "spotify" ? "selected" : ""}>Spotify song</option>
            <option value="streamable" ${optionType == "streamable" ? "selected" : ""}>Streamable video</option>
            <option value="supa video/audio" ${optionType == "supa video/audio" ? "selected" : ""}>supa video/audio file</option>
          </select>
        </div>

        <div class="input-group mb-3">
          <span class="input-group-text">Name</span>
          <input type="text" class="form-control option-name" data-option-id="${optionNumber}" onchange="saveBracket(true)" value="${name}"  placeholder="Option Name" aria-label="Option Name" />
        </div>

        <div class="input-group">
          <span class="input-group-text">Thumbnail</span>
          <input type="text" class="form-control option-thumbnail" data-option-id="${optionNumber}" onchange="saveBracket(true)" value="${thumbnail}" placeholder="Thumbnail" aria-label="Thumbnail" />
        </div>
      </div>
    </div>`
  );
} //addBracketOption

function addTriviaQuestion(multipleChoice = null, type = "", question = "", answer = [], url = "") {
  let questionNumber = ++document.querySelectorAll(".trivia-question").length;
  let questionType = "text";
  let checkMultipleChoice = false;
  if (questionNumber > 1) {
    let previousQuestion = Array.from(document.getElementsByClassName("question-type")).find((e) => parseInt(e.dataset.questionId, 10) === questionNumber - 1);
    let previousQuestionMC = Array.from(document.getElementsByClassName("multiple-choice")).find((e) => parseInt(e.dataset.questionId, 10) === questionNumber - 1);

    questionType = previousQuestion.value || "text";
    checkMultipleChoice = previousQuestionMC.checked;
  }

  if (type) {
    questionType = type;
  }

  if (multipleChoice !== null) {
    checkMultipleChoice = multipleChoice;
  }

  elements.triviaQuestionsContainer.insertAdjacentHTML(
    "beforeend",
    `<div class="card mb-2" data-question-id="${questionNumber}">
      <div class="card-header">
      Question #${questionNumber}
      <i class="material-icons notranslate deletebtn float-end" onclick="deleteTriviaQuestion('${questionNumber}')">delete_forever</i>
      </div>
      <div class="card-body">


          <div class="form-check form-switch">
            <input class="form-check-input multiple-choice" onchange="saveTrivia(true)" data-question-id="${questionNumber}" type="checkbox" role="switch" id="multipleChoice${questionNumber}" ${
      checkMultipleChoice ? "checked" : ""
    }/>
            <label class="form-check-label" for="multipleChoice${questionNumber}">Multiple choice question</label>
          </div>


        <div class="input-group mb-3">
          <label class="input-group-text">Question type</label>
          <select class="form-select question-type" data-question-id="${questionNumber}" onchange="saveTrivia(true)">
            <option value="text" ${questionType == "text" ? "selected" : ""}>Text only</option>
            <option value="image" ${questionType == "image" ? "selected" : ""}>Image</option>
            <option value="youtube" ${questionType == "youtube" ? "selected" : ""}>YouTube video</option>
            <option value="twitch" ${questionType == "twitch" ? "selected" : ""}>Twitch clip</option>
            <option value="spotify" ${questionType == "spotify" ? "selected" : ""}>Spotify song</option>
            <option value="streamable" ${questionType == "streamable" ? "selected" : ""}>Streamable video</option>
            <option value="supa video/audio" ${questionType == "supa video/audio" ? "selected" : ""}>supa video/audio file</option>
          </select>
        </div>

        <div class="input-group mb-3">
          <span class="input-group-text">Question</span>
          <input type="text" class="form-control trivia-question" data-question-id="${questionNumber}" onchange="saveTrivia(true)" value="${question}"  placeholder="Question" aria-label="Question" />
        </div>

        <div class="input-group mb-3">
          <span class="input-group-text">Answer</span>
          <input type="text" class="form-control trivia-answer" data-question-id="${questionNumber}" onchange="saveTrivia(true)" value="${answer}"  placeholder="Answer" aria-label="Answer" />
        </div>

        <div class="input-group mb-3">
          <span class="input-group-text">Media</span>
          <input type="text" class="form-control trivia-media" data-question-id="${questionNumber}" onchange="saveTrivia(true)" value="${url}" ${
      questionType == "streamable" ? `data-video="${url}"` : ""
    } placeholder="Question media URL" aria-label="Question media URL" />
          <button class="btn btn-outline-secondary" onclick="previewQuestion(${questionNumber},this)" type="button"><i class="material-icons notranslate">preview</i>Preview</button>
        </div>

      </div>
    </div>`
  );
} //addTriviaQuestion

function deleteBracketOption(id) {
  id = parseInt(id, 10);
  let bracketID = parseInt(elements.bracketTitle.dataset.bracketId, 10);
  let bracketIndex = BRACKETS.brackets.findIndex((e) => e.id === bracketID);
  BRACKETS.brackets[bracketIndex].options.splice(id - 1, 1);

  editBracket(bracketID);
  saveBracket(true);
} //deleteBracketOption

function deleteTriviaQuestion(id) {
  id = parseInt(id, 10);
  let triviaID = parseInt(elements.triviaTitle.dataset.triviaId, 10);
  let triviaIndex = TRIVIA.trivia.findIndex((e) => e.id === triviaID);
  TRIVIA.trivia[triviaIndex].questions.splice(id - 1, 1);

  editTrivia(triviaID);
  saveTrivia(true);
} //deleteTriviaQuestion

async function previewOption(id, button) {
  button.innerHTML = spinner;
  id = parseInt(id, 10);
  let optionValues = document.querySelectorAll(".option-value");
  let optionTypes = document.querySelectorAll(".option-type");
  let optionNames = document.querySelectorAll(".option-name");
  let optionThumbnails = document.querySelectorAll(".option-thumbnail");

  let option = Array.from(optionValues).find((e) => e.dataset.optionId == id);
  let type = Array.from(optionTypes).find((e) => e.dataset.optionId == id);
  let name = Array.from(optionNames).find((e) => e.dataset.optionId == id);
  let thumbnail = Array.from(optionThumbnails).find((e) => e.dataset.optionId == id);

  let link = parseLink(option?.value?.replace(/\s+/g, ""));

  //parseLink doesnt parse image links
  if (!link && type.value != "image") {
    type.value = "text";
  }

  if (type.value == "text") {
    elements.previewModalBody.innerHTML = `
    <div class="card">
    <div class="card-body">
    ${escapeString(option?.value) || `<span class="text-body-secondary">Empty option</span>`}
    </div>
    </div>`;
    previewModal.show();
  } //text

  if (type.value == "image") {
    let image = option?.value.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) || null;
    if (!image) {
      showToast("Invalid image URL", "warning", 3000);
      button.innerHTML = `<i class="material-icons notranslate">preview</i>Preview`;
      return;
    }
    elements.previewModalBody.innerHTML = `
    <div class="card">
    <div class="card-body">
    <img src="https://proxy.donk.workers.dev/?url=${encodeURI(option.value)}" alt="${name.value}" title="${name.value}" class="option-image">
    </div>
    </div>`;
    previewModal.show();
  } //image

  if (link?.type == "youtube") {
    if (!name.value && !thumbnail.value) {
      link = await getRequestInfo(link);
      name.value = link.title;
      thumbnail.value = link.thumbnail;
    }
    type.value = "youtube";
    elements.previewModalBody.innerHTML = `
    <div class="card">
    <div class="card-body">
    <iframe 
    type="text/html" 
    width="100%" height="480" 
    src="https://www.youtube.com/embed/${link.id}?autoplay=1&origin=${window.location.hostname}" 
    frameborder="0">
    </iframe>
    </div>
    </div>`;
    previewModal.show();
  } //youtube

  if (link?.type == "twitch") {
    if (!name.value && !thumbnail.value) {
      link = await getRequestInfo(link);
      name.value = link.title;
      thumbnail.value = link.thumbnail;
    }
    type.value = "twitch";
    elements.previewModalBody.innerHTML = `
      <div class="card">
      <div class="card-body">
      <iframe 
      src="https://clips.twitch.tv/embed?clip=${link.id}&parent=${window.location.hostname}&autoplay=true" 
      height="480" 
      width="100%" 
      preload="auto" 
      >
      </iframe>
      </div>
      </div>`;
    previewModal.show();
  } //twitch

  if (link?.type == "spotify") {
    if (!name.value && !thumbnail.value) {
      link = await getRequestInfo(link);
      name.value = link.title;
      thumbnail.value = link.thumbnail;
    }
    type.value = "spotify";
    elements.previewModalBody.innerHTML = `
      <div class="card">
      <div class="card-body">
      <iframe 
      style="border-radius:12px" src="https://open.spotify.com/embed/track/${link.id}${darkTheme ? "?theme=0" : ""}" 
      width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture">
      </iframe>
      </div>
      </div>`;
    previewModal.show();
  } //spotify

  if (link?.type == "streamable") {
    link = await getRequestInfo(link);
    name.value = link.title;
    thumbnail.value = link.thumbnail;
    type.value = "streamable";
    option.dataset.video = link.video;
    elements.previewModalBody.innerHTML = `
      <div class="card">
      <div class="card-body">
      <video src="${link.video}" controls autoplay height="480" width="100%"></video>
      </div>
      </div>`;
    previewModal.show();
  } else {
    option.dataset.video = "";
  } //streamable

  if (link?.type == "supa video/audio") {
    link = await getRequestInfo(link);
    name.value = link.title;
    thumbnail.value = link.thumbnail;
    type.value = link.type;
    if (link.type == "image") {
      elements.previewModalBody.innerHTML = `
      <div class="card">
      <div class="card-body">
      <img src="https://i.supa.codes/${link.id}" alt="${name.value}" title="${name.value}" class="option-image">
      </div>
      </div>`;
    } else {
      elements.previewModalBody.innerHTML = `
      <div class="card">
      <div class="card-body">
      <video src="https://i.supa.codes/${link.id}" controls autoplay height="480" width="100%"></video>
      </div>
      </div>`;
    }

    previewModal.show();
  }

  button.innerHTML = `<i class="material-icons notranslate">preview</i>Preview`;
  saveBracket();
} //previewOption

async function previewQuestion(id, button) {
  button.innerHTML = spinner;
  id = parseInt(id, 10);

  let questionTypes = document.querySelectorAll(".question-type");
  let questions = document.querySelectorAll(".trivia-question");
  let answers = document.querySelectorAll(".trivia-answer");
  let media = document.querySelectorAll(".trivia-media");

  let questionType = Array.from(questionTypes).find((e) => e.dataset.questionId == id);
  let question = Array.from(questions).find((e) => e.dataset.questionId == id);
  let answer = Array.from(answers).find((e) => e.dataset.questionId == id);
  let questionMedia = Array.from(media).find((e) => e.dataset.questionId == id);

  let link = parseLink(questionMedia?.value?.replace(/\s+/g, ""));

  //parseLink doesnt parse image links
  if (!link && questionType.value != "image") {
    questionType.value = "text";
  }

  if (questionType.value == "text") {
    elements.previewModalBody.innerHTML = `
    <div class="card">
    <div class="card-body">
    ${escapeString(question?.value) || `<span class="text-body-secondary">Empty question</span>`}
    </div>
    </div>`;
    previewModal.show();
  } //text

  if (questionType.value == "image") {
    let image = questionMedia?.value.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) || null;
    if (!image) {
      showToast("Invalid image URL", "warning", 3000);
      button.innerHTML = `<i class="material-icons notranslate">preview</i>Preview`;
      return;
    }
    elements.previewModalBody.innerHTML = `
    <div class="card">
    <div class="card-body">
    <img src="https://proxy.donk.workers.dev/?url=${encodeURI(questionMedia.value)}" alt="${question.value}" title="${question.value}" class="option-image">
    </div>
    </div>`;
    previewModal.show();
  } //image

  if (link?.type == "youtube") {
    questionType.value = "youtube";
    elements.previewModalBody.innerHTML = `
    <div class="card">
    <div class="card-body">
    <iframe 
    type="text/html" 
    width="100%" height="480" 
    src="https://www.youtube.com/embed/${link.id}?autoplay=1&origin=${window.location.hostname}" 
    frameborder="0">
    </iframe>
    </div>
    </div>`;
    previewModal.show();
  } //youtube

  if (link?.type == "twitch") {
    questionType.value = "twitch";
    elements.previewModalBody.innerHTML = `
      <div class="card">
      <div class="card-body">
      <iframe 
      src="https://clips.twitch.tv/embed?clip=${link.id}&parent=${window.location.hostname}&autoplay=true" 
      height="480" 
      width="100%" 
      preload="auto" 
      >
      </iframe>
      </div>
      </div>`;
    previewModal.show();
  } //twitch

  if (link?.type == "spotify") {
    questionType.value = "spotify";
    elements.previewModalBody.innerHTML = `
      <div class="card">
      <div class="card-body">
      <iframe 
      style="border-radius:12px" src="https://open.spotify.com/embed/track/${link.id}${darkTheme ? "?theme=0" : ""}" 
      width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture">
      </iframe>
      </div>
      </div>`;
    previewModal.show();
  } //spotify

  if (link?.type == "streamable") {
    link = await getRequestInfo(link);
    questionType.value = "streamable";
    question.dataset.video = link.video;
    elements.previewModalBody.innerHTML = `
      <div class="card">
      <div class="card-body">
      <video src="${link.video}" controls autoplay height="480" width="100%"></video>
      </div>
      </div>`;
    previewModal.show();
  } else {
    question.dataset.video = "";
  } //streamable

  if (link?.type == "supa video/audio") {
    link = await getRequestInfo(link);
    questionType.value = link.type;
    if (link.type == "image") {
      elements.previewModalBody.innerHTML = `
      <div class="card">
      <div class="card-body">
      <img src="https://i.supa.codes/${link.id}" alt="${question.value}" title="${question.value}" class="option-image">
      </div>
      </div>`;
    } else {
      elements.previewModalBody.innerHTML = `
      <div class="card">
      <div class="card-body">
      <video src="https://i.supa.codes/${link.id}" controls autoplay height="480" width="100%"></video>
      </div>
      </div>`;
    }

    previewModal.show();
  }

  button.innerHTML = `<i class="material-icons notranslate">preview</i>Preview`;
  saveTrivia();
} //previewQuestion

/**
 * @description gets the video/track/clip id and type from a url string
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
      return { type: "twitch", id: clipID[1] };
    } //clips
  } //twitch

  if (link.includes("youtube.com") || link.includes("youtu.be")) {
    const youtubeURLRegex = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
    const videoID = youtubeURLRegex.exec(link) || null;
    if (videoID[3]?.length != 11) {
      return null;
    }
    return { type: "youtube", id: videoID[3] };
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
  } //streamable

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

async function getRequestInfo(link) {
  if (link.type == "twitch") {
    try {
      let response = await fetch(`https://helper.donk.workers.dev/twitch/clips?id=${link.id}`);
      let result = await response.json();
      console.log(result);
      link.title = result.data[0].title || "(untitled)";
      link.channel = result.data[0].broadcaster_name || "(unknown)";
      link.thumbnail = result.data[0].thumbnail_url;
      link.duration = result.data[0].duration;
      link.views = result.data[0].view_count;
    } catch (error) {
      showToast("Could not get clip info", "warning", 3000);
      console.log("getRequestInfo twitch clip error", error);
      return;
    }
  }

  if (link.type == "spotify") {
    try {
      let response = await fetch(`https://helper.donk.workers.dev/spotify/tracks?ids=${link.id}`);
      let result = await response.json();
      console.log(result);
      link.title = result.tracks[0].name || "(untitled)";
      link.channel = result.tracks[0].artists[0].name || "(unknown)";
      link.thumbnail = result.tracks[0].album.images[0].url;
      link.duration = result.tracks[0].duration_ms / 1000;
      if (!result.tracks[0].is_playable) {
        showToast("This song is not playable", "warning", 3000);
        return;
      }
    } catch (error) {
      showToast("Could not get song info", "warning", 3000);
      console.log("getRequestInfo spotify error", error);
      return;
    }
  }

  if (link.type == "youtube") {
    try {
      let response = await fetch(`https://helper.donk.workers.dev/youtube/videos?id=${link.id}`);
      let result = await response.json();
      console.log(result);
      link.title = result.items[0].snippet.title || "(untitled)";
      link.channel = result.items[0].snippet.channelTitle || "(unknown)";
      link.thumbnail = result.items[0].snippet.thumbnails.medium.url;
      link.duration = ISO8601ToSeconds(result.items[0].contentDetails.duration);
      link.views = result.items[0].statistics.viewCount;
      if (result.items[0].contentDetails?.contentRating?.ytRating == "ytAgeRestricted" || !result.items[0].status?.embeddable) {
        showToast("This video is age restricted or not embeddable", "warning", 3000);
        return;
      }
    } catch (error) {
      showToast("Could not get video info", "warning", 3000);
      console.log("getRequestInfo youtube error", error);
      return;
    }
  }

  if (link.type == "streamable") {
    try {
      let response = await fetch(`https://helper.donk.workers.dev/streamable/videos?id=${link.id}`);
      let result = await response.json();
      console.log(result);
      link.title = result.title || "(untitled)";
      link.channel = "(unknown)";
      link.thumbnail = result.thumbnail_url.startsWith("//") ? `https:${result.thumbnail_url}` : result.thumbnail_url;
      link.duration = result.files.mp4.duration;
      link.video = result.files.mp4.url;
    } catch (error) {
      showToast("Could not get video info", "warning", 3000);
      console.log("getRequestInfo streamable error", error);
      return;
    }
  }

  if (link.type == "supa video/audio") {
    try {
      let response = await fetch(`https://helper.donk.workers.dev/supa/info?id=${link.id}`);
      let result = await response.json();
      console.log(result);
      if (!result.type.startsWith("audio") && !result.type.startsWith("video") && !result.type.startsWith("image")) {
        showToast("Link is not of a video or audio file", "warning", 3000);
        return;
      }
      link.title = result?.name?.split(".")[0] || "(untitled)";
      if (await checkImage(`https://i.supa.codes/t/${link.id}`)) {
        link.thumbnail = `https://i.supa.codes/t/${link.id}`;
      } else {
        link.thumbnail = "https://chat.vote/pics/nothumbnail.png";
      }
      if (result.type.startsWith("image")) {
        link.type = "image";
      }
      link.duration = result?.mediainfo?.duration || 0;
    } catch (error) {
      showToast("Could not get video info", "warning", 3000);
      console.log("getRequestInfo supa error", error);
      return;
    }
  } //supa

  return link;
} //getRequestInfo

function createBracket(generated = false, type = "single") {
  let maxID = 0;
  if (BRACKETS?.brackets?.length !== 0) {
    maxID = BRACKETS.brackets.reduce((prev, current) => (prev.id > current.id ? prev : current)).id;
  }
  BRACKETS.brackets.push({
    id: ++maxID,
    title: "",
    description: "",
    options: [],
    generated: generated,
    published: false,
    defaultFormat: type == "tiermaker" ? "tierlist" : "single",
    time: Date.now(),
  });

  editBracket(maxID);
  saveBracket();
} //createBracket

function createTrivia(generated = false) {
  let maxID = 0;
  if (TRIVIA?.trivia?.length !== 0) {
    maxID = TRIVIA.trivia.reduce((prev, current) => (prev.id > current.id ? prev : current)).id;
  }
  TRIVIA.trivia.push({
    id: ++maxID,
    title: "",
    description: "",
    options: [],
    generated: generated,
    published: false,
    time: Date.now(),
  });

  editTrivia(maxID);
  saveTrivia();
} //createTrivia

function saveBracket(edited = false) {
  let id = parseInt(elements.bracketTitle.dataset.bracketId, 10);
  let bracket = BRACKETS.brackets.find((x) => x.id === id);

  bracket.title = elements.bracketTitle.value || "Untitled bracket";
  bracket.description = elements.bracketDescription.value || "No description";

  if (edited) {
    //let user publish generated brackets if they edit them or republish already published brackets
    bracket.generated = false;
    bracket.published = false;
  }

  let optionNames = document.querySelectorAll(".option-name");
  let optionTypes = document.querySelectorAll(".option-type");
  let optionValues = document.querySelectorAll(".option-value");
  let optionThumbnails = document.querySelectorAll(".option-thumbnail");

  bracket.options = [];

  for (let index = 0; index < optionNames.length; index++) {
    let link = parseLink(optionValues[index].value?.replace(/\s+/g, ""));
    switch (link?.type) {
      case "youtube":
      case "twitch":
      case "spotify":
      case "supa video/audio":
        bracket.options.push({
          value: optionValues[index].value,
          type: optionTypes[index].value,
          name: optionNames[index].value,
          thumbnail: optionThumbnails[index].value,
          id: link.id,
        });
        break;
      case "streamable":
        bracket.options.push({
          value: optionValues[index].value,
          type: optionTypes[index].value,
          name: optionNames[index].value,
          thumbnail: optionThumbnails[index].value,
          id: link.id,
          video: optionValues[index].dataset?.video || "",
        });
        break;
      default:
        bracket.options.push({
          value: optionValues[index].value,
          type: optionTypes[index].value,
          name: optionNames[index].value,
          thumbnail: optionThumbnails[index].value,
        });
        break;
    }
  }

  loadBrackets();
  saveSettings();
} //saveBracket

function saveTrivia(edited = false) {
  let id = parseInt(elements.triviaTitle.dataset.triviaId, 10);
  let trivia = TRIVIA.trivia.find((x) => x.id === id);

  trivia.title = elements.triviaTitle.value || "Untitled trivia";
  trivia.description = elements.triviaDescription.value || "No description";

  if (edited) {
    //let user publish generated trivia if they edit them or republish already published trivia
    trivia.generated = false;
    trivia.published = false;
  }

  let choiceTypes = document.querySelectorAll(".multiple-choice");
  let questionTypes = document.querySelectorAll(".question-type");
  let questions = document.querySelectorAll(".trivia-question");
  let answers = document.querySelectorAll(".trivia-answer");
  let media = document.querySelectorAll(".trivia-media");

  trivia.questions = [];

  for (let index = 0; index < questions.length; index++) {
    let link = parseLink(media[index].value?.replace(/\s+/g, ""));
    switch (link?.type) {
      case "youtube":
      case "twitch":
      case "spotify":
      case "supa video/audio":
        trivia.questions.push({
          multipleChoice: choiceTypes[index].checked,
          type: questionTypes[index].value,
          question: questions[index].value,
          answer: answers[index].value,
          media: media[index].value,
          id: link.id,
        });
        break;
      case "streamable":
        trivia.questions.push({
          multipleChoice: choiceTypes[index].checked,
          type: questionTypes[index].value,
          question: questions[index].value,
          answer: answers[index].value,
          media: media[index].value,
          id: link.id,
          video: media[index].dataset?.video || "",
        });
        break;
      default:
        trivia.questions.push({
          multipleChoice: choiceTypes[index].checked,
          type: questionTypes[index].value,
          question: questions[index].value,
          answer: answers[index].value,
          media: media[index].value,
        });
        break;
    }
  }

  loadTrivia();
  saveSettings();
} //saveTrivia

let startID;
function showStartModal(id) {
  startID = id;
  let bracketid = parseInt(startID, 10);
  let bracket = BRACKETS.brackets.find((x) => x.id === bracketid);
  if (bracket?.defaultFormat == "tierlist") {
    elements.formatSelect.value = "tierlist";
    elements.bracketSettings.style.display = "none";
    elements.tierlistSettings.style.display = "";
  } else {
    elements.formatSelect.value = "single";
    elements.bracketSettings.style.display = "";
    elements.tierlistSettings.style.display = "none";
  }
  if (bracket.options.length < 2) {
    showToast("Bracket must have 2 options at least", "warning", 3000);
    return;
  }
  if (bracket.options.flatMap((e) => e.type).includes("spotify")) {
    elements.spotifyWarning.style.display = "";
  } else {
    elements.spotifyWarning.style.display = "none";
  }
  startModal.show();
} //showStartModal

function showStartTriviaModal(id) {
  startID = id;
  let triviaID = parseInt(startID, 10);
  let trivia = TRIVIA.trivia.find((x) => x.id === triviaID);

  if (trivia.questions.flatMap((e) => e.type).includes("spotify")) {
    elements.spotifyWarning.style.display = "";
  } else {
    elements.spotifyWarning.style.display = "none";
  }
  startTriviaModal.show();
} //showStartTriviaModal

function startBracket() {
  if (!checkLogin()) {
    return;
  }
  let id = parseInt(startID, 10);
  let bracket = structuredClone(BRACKETS.brackets.find((x) => x.id === id));
  if (bracket.options.length < 2) {
    showToast("Bracket must have 2 options at least", "warning", 3000);
    return;
  }
  let format = elements.formatSelect.value || "single";
  let limit = parseInt(elements.optionLimit.value, 10) || 0;
  if (limit > 0) {
    while (bracket.options.length > limit) {
      bracket.options.splice(Math.floor(Math.random() * bracket.options.length), 1);
    }
  }
  switch (format) {
    case "single":
      currentFormat = "single";
      startSingleElimination(bracket);
      break;
    case "tierlist":
      currentFormat = "tierlist";
      startTierlist(bracket);
      break;
    default:
      showToast("Unknown format", "warning", 3000);
      return;
  }
  changeSiteLinkTarget("_blank");
} //startBracket

function startSingleElimination(bracket) {
  let numberOfOptions = bracket.options.length;
  let numberOfRounds = Math.ceil(Math.log2(numberOfOptions));

  //change numberOfOptions to be the next power of 2
  if ((numberOfOptions & (numberOfOptions - 1)) !== 0) {
    let power = 1;
    while (power < numberOfOptions) {
      power <<= 1;
    }
    numberOfOptions = power;
  }
  currentBracket = {};

  currentBracket.round1 = [...bracket.options];
  shuffleArray(currentBracket.round1);

  //insert null at odd positions to fill the bracket
  let insertCount = 0;
  while (currentBracket.round1.length < numberOfOptions) {
    currentBracket.round1.splice(currentBracket.round1.length - insertCount * 2, 0, null);
    insertCount++;
  }

  //fill the rest of the rounds with undefined
  for (let index = 1; index <= numberOfRounds; index++) {
    currentBracket[`round${index + 1}`] = [...Array(currentBracket[`round${index}`].length / 2)];
  }

  elements.editor.style.display = "none";
  elements.bracket.style.display = "";
  elements.title.innerText = bracket.title;
  elements.winner.innerHTML = `Winner of ${escapeString(bracket.title)}<br>`;
  elements.pickWinner.innerHTML = `<i class="material-icons notranslate">navigate_next</i>Next match`;

  console.log(currentBracket);

  currentRound = 1;
  currentOption = 0;
  currentScores = { left: 0, right: 0 };
  currentCommand = { left: "a", right: "b" };

  elements.restart.disabled = false;
  elements.hideScore.disabled = false;
  elements.enableVoting.disabled = false;
  elements.pickWinner.disabled = false;
  elements.left_card_header.style.display = "";
  elements.right_card_header.style.display = "";
  elements.winnerTitle.style.display = "none";

  nextMatch();
} //startSingleElimination

function startTierlist(bracket) {
  console.log(bracket);
  elements.tierlistContainer.innerHTML = "";
  elements.upcoming_thumbnails.innerHTML = "";
  shuffleArray(bracket.options);
  for (let index = 0; index < bracket.options.length; index++) {
    let link = bracket.options[index].thumbnail ? `https://proxy.donk.workers.dev/?url=${encodeURI(bracket.options[index].thumbnail)}` : "/pics/nothumbnail.png";

    elements.upcoming_thumbnails.insertAdjacentHTML(
      "beforeend",
      `<a
      href="${getItemLink(bracket.options[index].type, bracket.options[index].id)}"
      target="_blank"
      rel="noopener noreferrer"><img class="border rounded tierlist-item me-1" alt="${bracket.options[index].name}" title="${
        bracket.options[index].name
      }" loading="lazy" src="${link}" /></a>`
    );
  }
  addTier("S", "s", "#de0b0b");
  addTier("A", "a", "#d9740f");
  addTier("B", "b", "#dea216");
  addTier("C", "c", "#f7e51b");
  addTier("D", "d", "#64f71b");
  addTier("F", "f", "#08cc12");
  addTier("¯\\_(ツ)_/¯", "idk", "#0fd9cb");

  updateScores();

  elements.editor.style.display = "none";
  elements.tierlist.style.display = "";
  elements.tierlistItem.style.display = "";
  elements.upcoming.style.display = "";
  currentTierlist = {};
  currentTierlist = structuredClone(bracket);
  currentTierlistCommands = currentTierlistData.map((e) => e.command);
  nextTierlistItem();
} //startTierlist

let triviaPoints;
let questionNumber = 1;
let triviaAnswer = [];
let triviaStarted = false;
let triviaUsersAnswered = [];
let triviaUsers = [];
let questionsArray = [];
let answersArrays = [];
let mediaArray = [];
let answerTypes = [];
function startTrivia() {
  if (!checkLogin()) {
    return;
  }

  let id = parseInt(startID, 10);

  questionNumber = 0;
  triviaUsersAnswered = [];
  triviaUsers = [];
  elements.triviaUsers.innerHTML = "";
  currentFormat = "trivia";

  let selectedTrivia = structuredClone(TRIVIA.trivia.find((x) => x.id === id));

  questionsArray = [];
  answersArrays = [];
  mediaArray = [];
  answerTypes = [];

  for (let index = 0, j = selectedTrivia.questions.length; index < j; index++) {
    if (!selectedTrivia.questions[index].question && !selectedTrivia.questions[index].media) {
      continue;
    }

    if (!selectedTrivia.questions[index].question && selectedTrivia.questions[index].media) {
      questionsArray.push(`Question #${index + 1}`);
    } else {
      questionsArray.push(selectedTrivia.questions[index].question);
    }
    mediaArray.push(selectedTrivia.questions[index].media);
    answerTypes.push(selectedTrivia.questions[index].multipleChoice ? "multipleChoice" : "alias");

    let options = selectedTrivia.questions[index].answer.split("|");

    for (let index2 = 0; index2 < options.length; index2++) {
      options[index2] = options[index2].trim().toLowerCase();
    }

    answersArrays.push(options);
  }

  elements.triviaTitleCard.innerText = selectedTrivia.title || "";
  elements.triviaDescriptionCard.innerText = selectedTrivia.description || "";
  elements.editor.style.display = "none";
  elements.trivia.style.display = "";
  changeSiteLinkTarget("_blank");

  nextQuestion();
} //startTrivia

function nextQuestion() {
  //check if trivia is done
  if (questionNumber == questionsArray.length) {
    showToast("No more questions", "warning", 2000);
    return;
  }
  questionNumber++;
  triviaPoints = parseInt(elements.triviaPoints.value, 10);
  triviaUsersAnswered = [];

  triviaAnswer = answersArrays[questionNumber - 1];
  elements.questionNumber.innerText = `Question ${questionNumber}/${questionsArray.length}`;
  elements.question.innerText = `Question: ${questionsArray[questionNumber - 1]}`;
  elements.triviaAnswer.innerHTML = getHint();

  resetPlayers();
  showTriviaMedia(mediaArray[questionNumber - 1]);
  triviaStarted = true;
} //nextQuestion

let triviaChoices = ["a", "b", "c", "d"];
let correctChoice;
let correctAnswer;
function getHint() {
  if (answerTypes[questionNumber - 1] == "multipleChoice") {
    if (triviaAnswer.length < 4) {
      showToast("Question has less than 4 choices", "danger", 3000);
    }

    correctAnswer = triviaAnswer[0];
    let shuffled = shuffle(structuredClone(triviaAnswer));
    let index = shuffled.findIndex((element) => element === correctAnswer);
    correctChoice = triviaChoices[index];

    return `Choices: 
    <button type="button" class="btn btn-lg btn-primary mb-2"><span class="float-start">A • </span> ${escapeString(shuffled[0])}</button>
    <button type="button" class="btn btn-lg btn-danger mb-2"><span class="float-start">B • </span> ${escapeString(shuffled[1])}</button>
    <button type="button" class="btn btn-lg btn-warning mb-2"><span class="float-start">C • </span> ${escapeString(shuffled[2])}</button>
    <button type="button" class="btn btn-lg btn-info mb-2"><span class="float-start">D • </span> ${escapeString(shuffled[3])}</button>`;
  }

  if (!elements.showHint.checked) {
    return "Answer: ❔";
  }

  let hint = "";
  for (let index = 0; index < triviaAnswer[0].length; index++) {
    if (triviaAnswer[0].charAt(index).match(/^[0-9a-z]+$/)) {
      hint += "_ ";
    }
    if (triviaAnswer[0].charAt(index) == " ") {
      hint += "&nbsp; ";
    }
  }
  return `Answer: ${hint}`;
} //getHint

function showAnswer() {
  triviaStarted = false;
  if (answerTypes[questionNumber - 1] == "multipleChoice") {
    elements.triviaAnswer.innerText = `Answer: ${correctAnswer}`;
  } else {
    elements.triviaAnswer.innerText = `Answer: ${triviaAnswer[0]}`;
  }
} //showAnswer

function shuffle(array) {
  let currentIndex = array.length;
  let randomIndex;
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
} //shuffle

let currentRound = 1;
let currentOption = 0;
let currentScores = { left: 0, right: 0 };
let currentCommand = { left: "a", right: "b" };
function nextMatch() {
  //check if current round is done
  if (currentOption == currentBracket[`round${currentRound}`].length) {
    currentRound++;
    currentOption = 0;
  }

  let roundName = "";
  switch (currentBracket[`round${currentRound}`].length) {
    case 2:
      roundName = `Finals`;
      break;
    case 4:
      roundName = `Semifinals`;
      break;
    case 8:
      roundName = `Quarterfinals`;
      break;
    default:
      roundName = `Round of ${currentBracket[`round${currentRound}`].length}`;
      break;
  }

  elements.round.innerHTML = `${roundName} • ${currentOption / 2 + 1}/${currentBracket[`round${currentRound}`].length / 2}`;

  //check if bracket is done
  if (Object.keys(currentBracket).length == currentRound) {
    showWinner(currentBracket[`round${currentRound}`], currentBracket[`round${currentRound - 1}`]);
    return;
  }

  //change next match button text for final match
  if (Object.keys(currentBracket).length - 1 == currentRound) {
    elements.pickWinner.innerHTML = `<i class="material-icons notranslate">emoji_events</i>Reveal winner`;
  }

  let left = currentBracket[`round${currentRound}`][currentOption++];
  let right = currentBracket[`round${currentRound}`][currentOption++];

  //if 1 of the options is null then move the other option to next round without showing it
  if (left === null) {
    promoteOption(right);
    return;
  }
  if (right === null) {
    promoteOption(left);
    return;
  }
  resetPlayers();
  showOption("left", left);
  showOption("right", right);

  for (let element of document.getElementsByClassName("streamer-vote")) {
    element.style.visibility = "visible";
  }

  resetScores();
  if (!elements.keepVotingEnabled.checked) {
    disableVoteButton();
  }

  elements.centerTitle.style = "";
  elements.left_card.style = "";
  elements.right_card.style = "";
  elements.left_title.style = "";
  elements.right_title.style = "";

  if (elements.changeCommand.checked) {
    if (currentCommand.left == "a") {
      currentCommand.left = "1";
      currentCommand.right = "2";
    } else {
      currentCommand.left = "a";
      currentCommand.right = "b";
    }
  } else {
    currentCommand.left = "1";
    currentCommand.right = "2";
  }
  elements.left_command.innerHTML = currentCommand.left;
  elements.right_command.innerHTML = currentCommand.right;

  if (!elements.disableAnimations.checked) {
    anime({
      targets: `#centerTitle`,
      translateY: ["-200px", 0],
    });
    anime({
      targets: `#left_title`,
      translateX: ["-100%", 0],
    });
    anime({
      targets: `#left_card`,
      translateX: ["-100%", 0],
    });
    anime({
      targets: `#right_title`,
      translateX: ["200%", 0],
    });
    anime({
      targets: `#right_card`,
      translateX: ["200%", 0],
    });
    if (elements.changeCommand.checked) {
      anime({
        targets: ["#left_command", "#right_command"],
        keyframes: [{ fontSize: "+=20px" }, { fontSize: "-=20px" }],
        delay: 2000,
        duration: 500,
      });
    }
  }
} //nextMatch

let currentItem = 1;
let currentTierlistData = [
  { name: "s", command: "s", score: 0, weight: 5 },
  { name: "a", command: "a", score: 0, weight: 4 },
  { name: "b", command: "b", score: 0, weight: 3 },
  { name: "c", command: "c", score: 0, weight: 2 },
  { name: "d", command: "d", score: 0, weight: 1 },
  { name: "f", command: "f", score: 0, weight: 0 },
  { name: "idk", command: "idk", score: 0 },
];
let currentTierlistCommands = [];
let tierlist_player;
let currentTierlistItem;
async function nextTierlistItem() {
  resetPlayers();
  let item = currentTierlist.options.shift();
  if (!item) {
    endTierlist();
    return;
  }
  currentTierlistItem = item;
  elements.upcoming_thumbnails.firstElementChild.remove();

  if (!elements.upcoming_thumbnails.firstElementChild) {
    elements.upcoming.style.display = "none";
  }

  elements.currentTierlistItemName.innerText = item.name || "Untitled item";

  if (!item?.id && (item.type == "youtube" || item.type == "twitch" || item.type == "spotify")) {
    let info = parseLink(item.value?.replace(/\s+/g, ""));
    if (info) {
      item.id = info.id;
    } else {
      showToast("Could not load video", "warning", 3000);
    }
  }

  if (item.type == "text") {
    elements.text_image_tierlist.style.display = "";
    elements.text_image_tierlist.innerHTML = escapeString(item.value) || `<span class="text-body-secondary">Empty option</span>`;
  } //text

  if (item.type == "image") {
    elements.text_image_tierlist.style.display = "";
    let image = item?.value.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) || null;
    if (!image) {
      elements.text_image_tierlist.innerHTML = `Invalid image URL`;
      return;
    }
    elements.text_image_tierlist.innerHTML = `<img src="https://proxy.donk.workers.dev/?url=${encodeURI(item.value)}" alt="${item.name}" title="${item.name}" class="tierlist-image">`;
  } //image

  if (item.type == "youtube") {
    elements.youtubeEmbedContainer_tierlist.style.display = "";
    youtubePlayer_tierlist.loadVideoById(item.id);
  } //youtube

  if (item.type == "twitch") {
    elements.twitchClipsEmbed_tierlist.style.display = "";
    elements.twitchClipsEmbed_tierlist.innerHTML = `<iframe src="https://clips.twitch.tv/embed?clip=${item.id}&parent=${window.location.hostname}&autoplay=true&muted=false" preload="auto" height="100%" width="100%" allowfullscreen></iframe>`;
  } //twitch

  if (item.type == "spotify") {
    elements.spotifyEmbedContainer_tierlist.style.display = "";
    spotifyPlayer_tierlist.loadUri(`spotify:track:${item.id}`);
    spotifyPlayer_tierlist.play();
  } //spotify

  if (item.type == "streamable") {
    let video = item?.video;
    //check if video link expired
    if (video) {
      const url = new URL(video);
      const params = url.searchParams;
      if (parseInt(params.get("Expires"), 10) * 1000 < Date.now()) {
        video = null;
      }
    }
    //get video link if it was never fetched or expired
    if (!video) {
      let info = await getRequestInfo(item);
      video = info.video;
    }
    elements.videoEmbed_tierlist.style.display = "";
    elements.videoEmbed_tierlist.src = video;
  } //streamable

  if (item.type == "supa video/audio") {
    elements.videoEmbed_tierlist.style.display = "";
    elements.videoEmbed_tierlist.src = `https://i.supa.codes/${item.id}`;
  } //supa

  resetScores();
  if (!elements.keepVotingEnabled.checked) {
    disableVoteButton();
  }
} //nextTierlistItem

function endTierlist() {
  elements.tierlistItem.style.display = "none";
  elements.upcoming.style.display = "none";
} //endTierlist

function streamerVote(position) {
  vote_results[position]++;
  voters.push(USER.userID);
  updateScores();
  for (let element of document.getElementsByClassName("streamer-vote")) {
    element.style.visibility = "hidden";
  }
} //streamerVote

function pickWinner(winner = null) {
  let left = currentBracket[`round${currentRound}`][currentOption - 2];
  let right = currentBracket[`round${currentRound}`][currentOption - 1];
  let position = winner;
  if (position == null) {
    position = vote_results.left > vote_results.right ? "left" : "right";
  }

  if (vote_results.left == vote_results.right && !winner) {
    showToast("Options are tied, can't pick a winner", "warning", 3000);
    return;
  }
  if (!winner) {
    winner = vote_results.left > vote_results.right ? left : right;
  } else {
    winner = winner == "left" ? left : right;
  }

  //check if bracket is done
  if (Object.keys(currentBracket).length == currentRound + 1) {
    //promote the winner and skip promoteOption() to use the winner animation in nextMatch() instead
    let index = currentBracket[`round${currentRound + 1}`].findIndex((e) => e === undefined);
    currentBracket[`round${currentRound + 1}`][index] = winner;
    nextMatch();
    return;
  }

  promoteOption(winner, position);
} //pickWinner

function pickWinnerTierlist() {
  if (elements.averageTier.checked) {
    for (let index = 0; index < 7; index++) {
      if (elements[`tierlistScore${index}`].innerHTML.includes("⭐")) {
        placeTierlistItem(currentTierlistData[index]);
        return;
      }
    }
    showToast("Could not pick winner", "warning", 4000);
  } else {
    let sorted = [...currentTierlistData].sort((a, b) => b.score - a.score);
    if (sorted[0].score == sorted[1].score) {
      showToast("Top 2 tiers are tied, unable to place item", "warning", 4000);
      return;
    }
    placeTierlistItem(sorted[0]);
  }
} //pickWinnerTierlist

function restartMatch() {
  resetScores();
  for (let element of document.getElementsByClassName("streamer-vote")) {
    element.style.visibility = "visible";
  }
} //restartMatch

function resetScores() {
  voters = [];
  vote_results = { left: 0, right: 0 };
  for (let index = 0; index < currentTierlistData.length; index++) {
    currentTierlistData[index].score = 0;
  }
  updateScores();
} //resetScores

function promoteOption(option, position = null) {
  let index = currentBracket[`round${currentRound + 1}`].findIndex((e) => e === undefined);
  currentBracket[`round${currentRound + 1}`][index] = option;

  if (position && !elements.disableAnimations.checked) {
    //title
    anime({
      targets: `#centerTitle`,
      translateY: `-200px`,
      duration: 1000,
    });

    //loser
    anime({
      targets: `#${position == "right" ? "left" : "right"}_title`,
      translateY: `2000px`,
      scale: "0.8",
      duration: 1000,
    });
    anime({
      targets: `#${position == "right" ? "left" : "right"}_card`,
      translateY: `2000px`,
      scale: "0.8",
      duration: 1000,
    });

    //winner
    anime({
      targets: `#${position}_title`,
      translateX: [{ value: `${position == "right" ? "-" : "+"}110%`, duration: 500 }],
      translateY: [
        { value: `-50%`, duration: 500 },
        { value: "-200%", duration: 500 },
      ],
      scale: [{ value: "1.2", duration: 500 }],
    });
    anime({
      targets: `#${position}_card`,
      translateX: [{ value: `${position == "right" ? "-" : "+"}50%`, duration: 500 }],
      translateY: [{ value: `50%`, duration: 500 }],
      scale: [{ value: "1.2", duration: 500 }],
      translateY: [{ value: "-2000px", duration: 500, delay: 500 }],
      complete: function (anim) {
        nextMatch();
      },
    });
  } else {
    nextMatch();
  }
} //promoteOption

function placeTierlistItem(tier) {
  let id = `item${Date.now()}`;
  let link = currentTierlistItem.thumbnail ? `https://proxy.donk.workers.dev/?url=${encodeURI(currentTierlistItem.thumbnail)}` : "/pics/nothumbnail.png";
  let card = document.querySelector(`[data-tier="${tier.command}"]`);
  card.innerHTML += `
  <a
  id="${id}"
  href="${getItemLink(currentTierlistItem.type, currentTierlistItem.id)}"
  target="_blank"
  rel="noopener noreferrer"><img class="border rounded tierlist-item me-1" alt="${elements.currentTierlistItemName.innerHTML}" title="${
    elements.currentTierlistItemName.innerHTML
  }" loading="lazy" src="${link}" /></a>`;
  let start = elements.currentTierlistItem.getBoundingClientRect();
  let destination = document.getElementById(id).getBoundingClientRect();
  if (!elements.disableAnimations.checked) {
    anime({
      targets: `#${id}`,
      translateY: [start.top - destination.top, 0],
      translateX: [start.left - destination.left, 0],
      height: ["20vh", "10vh"],
    });
  }

  nextTierlistItem();
} //placeTierlistItem

async function showOption(position, option) {
  if (!option?.id && (option.type == "youtube" || option.type == "twitch" || option.type == "spotify")) {
    let info = parseLink(option.value?.replace(/\s+/g, ""));
    if (info) {
      option.id = info.id;
    } else {
      showToast("Could not load video", "warning", 3000);
    }
  }

  elements[`${position}_name`].innerHTML = escapeString(option.name) || `<span class="text-body-secondary">Untitled option</span>`;

  if (option.type == "text") {
    elements[`text_image_${position}`].style.display = "";
    elements[`text_image_${position}`].innerHTML = escapeString(option.value) || `<span class="text-body-secondary">Empty option</span>`;
  } //text

  if (option.type == "image") {
    elements[`text_image_${position}`].style.display = "";
    let image = option?.value.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) || null;
    if (!image) {
      elements[`text_image_${position}`].innerHTML = `Invalid image URL`;
      return;
    }
    elements[`text_image_${position}`].innerHTML = `<img src="https://proxy.donk.workers.dev/?url=${encodeURI(option.value)}" alt="${option.name}" title="${
      option.name
    }" class="option-image">`;
  } //image

  if (option.type == "youtube") {
    elements[`youtubeEmbedContainer_${position}`].style.display = "";
    if (position == "left") {
      youtubePlayer_left.loadVideoById(option.id);
    } else {
      youtubePlayer_right.cueVideoById(option.id);
    }
  } //youtube

  if (option.type == "twitch") {
    elements[`twitchClipsEmbed_${position}`].style.display = "";
    elements[`twitchClipsEmbed_${position}`].innerHTML = `<iframe src="https://clips.twitch.tv/embed?clip=${option.id}&parent=${window.location.hostname}&autoplay=${
      position == "left" ? "true" : "false"
    }&muted=false" preload="auto" height="100%" width="100%" allowfullscreen></iframe>`;
  } //twitch

  if (option.type == "spotify") {
    elements[`spotifyEmbedContainer_${position}`].style.display = "";

    if (position == "left") {
      spotifyPlayer_left.loadUri(`spotify:track:${option.id}`);
      spotifyPlayer_left.play();
    } else {
      spotifyPlayer_right.loadUri(`spotify:track:${option.id}`);
    }
  } //spotify

  if (option.type == "streamable") {
    let video = option?.video;
    //check if video link expired
    if (video) {
      const url = new URL(video);
      const params = url.searchParams;
      if (parseInt(params.get("Expires"), 10) * 1000 < Date.now()) {
        video = null;
      }
    }
    //get video link if it was never fetched or expired
    if (!video) {
      let info = await getRequestInfo(option);
      video = info.video;
    }
    elements[`videoEmbed_${position}`].style.display = "";
    elements[`videoEmbed_${position}`].src = video;
  } //streamable

  if (option.type == "supa video/audio") {
    elements[`videoEmbed_${position}`].style.display = "";
    elements[`videoEmbed_${position}`].src = `https://i.supa.codes/${option.id}`;
  } //supa
} //showOption

async function showTriviaMedia(mediaLink) {
  if (!mediaLink) {
    elements.triviaMedia.style.display = "none";
    return;
  } else {
    elements.triviaMedia.style.display = "";
  } //text

  let option = parseLink(mediaLink.replace(/\s+/g, ""));
  if (!option) {
    let image = mediaLink.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) || null;
    if (image) {
      elements.image_trivia.style.display = "";
      elements.image_trivia.innerHTML = `<img src="https://proxy.donk.workers.dev/?url=${encodeURI(mediaLink)}" class="option-image">`;
      return;
    } //image
    showToast("Could not load media", "warning", 3000);
  }

  if (option.type == "youtube") {
    elements.youtubeEmbedContainer_trivia.style.display = "";
    youtubePlayer_trivia.loadVideoById(option.id);
  } //youtube

  if (option.type == "twitch") {
    elements.twitchClipsEmbed_trivia.style.display = "";
    elements.twitchClipsEmbed_trivia.innerHTML = `<iframe 
    src="https://clips.twitch.tv/embed?clip=${option.id}&parent=${window.location.hostname}&autoplay=true&muted=false" preload="auto" height="100%" width="100%" allowfullscreen>
    </iframe>`;
  } //twitch

  if (option.type == "spotify") {
    elements.spotifyEmbedContainer_trivia.style.display = "";
    spotifyPlayer_trivia.loadUri(`spotify:track:${option.id}`);
    spotifyPlayer_trivia.play();
  } //spotify

  if (option.type == "streamable") {
    let video = option?.video;
    //check if video link expired
    if (video) {
      const url = new URL(video);
      const params = url.searchParams;
      if (parseInt(params.get("Expires"), 10) * 1000 < Date.now()) {
        video = null;
      }
    }
    //get video link if it was never fetched or expired
    if (!video) {
      let info = await getRequestInfo(option);
      video = info.video;
    }
    elements.videoEmbed_trivia.style.display = "";
    elements.videoEmbed_trivia.src = video;
  } //streamable

  if (option.type == "supa video/audio") {
    elements.videoEmbed_trivia.style.display = "";
    elements.videoEmbed_trivia.src = `https://i.supa.codes/${option.id}`;
  } //supa
} //showTriviaMedia

function updateScores() {
  if (currentFormat == "single") {
    if (!scoreHidden) {
      elements.left_score.innerHTML = `${vote_results.left.toLocaleString()} ${vote_results.left == 1 ? "vote" : "votes"} 
      (${Math.round((vote_results.left / (vote_results.left + vote_results.right)) * 100) || 0}%)`;
      elements.right_score.innerHTML = `${vote_results.right.toLocaleString()} ${vote_results.right == 1 ? "vote" : "votes"} 
      (${Math.round((vote_results.right / (vote_results.left + vote_results.right)) * 100) || 0}%)`;
    } else {
      elements.left_score.innerHTML = `<span class="text-body-secondary">Score hidden</span>`;
      elements.right_score.innerHTML = `<span class="text-body-secondary">Score hidden</span>`;
    }
  }

  if (currentFormat == "tierlist") {
    if (!scoreHidden) {
      let total = 0;
      let max = 0;
      for (let i = 0; i < 7; i++) {
        total += currentTierlistData[i].score;
        if (currentTierlistData[i].score > currentTierlistData[max].score) {
          max = i;
        }
      }
      if (elements.averageTier.checked) {
        let weights = 0;
        //first 6 scores only because idk score has no weight
        for (let i = 0; i < 6; i++) {
          weights += currentTierlistData[i].score * currentTierlistData[i].weight;
        }
        let winner = Math.round(weights / (total - currentTierlistData[6].score));
        for (let i = 0; i < 7; i++) {
          elements[`tierlistScore${i}`].innerHTML = `${currentTierlistData[i].score} (${Math.round((currentTierlistData[i].score / total) * 100) || 0}%) ${
            currentTierlistData[i].weight == winner ? "⭐" : ""
          }<br />`;
        }
        //mark idk as winner if all other scores are 0
        if (isNaN(winner) && total) {
          elements[`tierlistScore6`].innerHTML = `${currentTierlistData[6].score} (${Math.round((currentTierlistData[6].score / total) * 100) || 0}%) ⭐<br />`;
        }
      } else {
        for (let i = 0; i < 7; i++) {
          elements[`tierlistScore${i}`].innerHTML = `${currentTierlistData[i].score} (${Math.round((currentTierlistData[i].score / total) * 100) || 0}%) ${i == max ? "⭐" : ""}<br />`;
        }
      }
    } else {
      for (let i = 0; i < 7; i++) {
        elements[`tierlistScore${i}`].innerHTML = `🙈<br />`;
      }
    }
  }
} //updateScores

function showWinner(first, firstAndSecond) {
  elements.winner.innerHTML += `<strong>${escapeString(first[0].name)}</strong>`;

  elements.restart.disabled = true;
  elements.hideScore.disabled = true;
  elements.enableVoting.disabled = true;
  elements.pickWinner.disabled = true;

  if (!elements.disableAnimations.checked) {
    //move title away
    anime({
      targets: `#centerTitle`,
      translateY: [0, "-200px"],
      duration: 500,
      complete: function (anim) {
        //bring winner title in
        elements.centerTitle.style.display = "none";
        elements.left_card_header.style.display = "none";
        elements.right_card_header.style.display = "none";
        elements.winnerTitle.style.display = "";
        anime({
          targets: `#winnerTitle`,
          translateY: ["-200px", 0],
          duration: 1000,
        });
      },
    });

    //move option titles away
    anime({
      targets: `#left_title`,
      translateX: [0, "-200%"],
      duration: 1000,
      complete: function (anim) {
        elements.left_title.style.display = "none";
      },
    });
    anime({
      targets: `#right_title`,
      translateX: [0, "200%"],
      duration: 2000,
      complete: function (anim) {
        elements.right_title.style.display = "none";
      },
    });
  } else {
    elements.left_card_header.style.display = "none";
    elements.right_card_header.style.display = "none";
    elements.left_title.style.display = "none";
    elements.right_title.style.display = "none";
    elements.centerTitle.style.display = "none";
    elements.winnerTitle.style.display = "";
  }

  if (first[0].value == firstAndSecond[0].value) {
    //left is the winner
    //reset right player only
    resetPlayers(false, true);

    if (!elements.disableAnimations.checked) {
      //move loser away
      anime({
        targets: `#right_card`,
        translateX: `2000px`,
        scale: "0.8",
        duration: 1000,
        complete: function (anim) {
          elements.right_card.style.display = "none";
        },
      });

      //bring winner to center
      anime({
        targets: `#left_card`,
        translateX: `50%`,
        translateY: `5%`,
        scale: "1.3",
        duration: 2000,
      });
    } else {
      elements.right_card.style.display = "none";
      elements.left_card.style = "transform: translateX(50%) translateY(5%) scale(1.3);";
    }
  } else {
    //right is the winner
    //reset left player only
    resetPlayers(true, false);

    if (!elements.disableAnimations.checked) {
      //move loser away
      anime({
        targets: `#left_card`,
        translateX: `2000px`,
        scale: "0.8",
        duration: 1000,
        complete: function (anim) {
          elements.left_card.style.display = "none";
        },
      });

      //bring winner to center
      anime({
        targets: `#right_card`,
        translateX: `-50%`,
        translateY: `5%`,
        scale: "1.3",
        duration: 2000,
      });
    } else {
      elements.left_card.style.display = "none";
      elements.right_card.style = "transform: translateX(-50%) translateY(5%) scale(1.3);";
    }
  }
} //showWinner

function toggleVoting() {
  if (voting_enabled) {
    disableVoteButton();
  } else {
    enableVoteButton();
  }
} //toggleVoting

function enableVoteButton() {
  elements.enableVoting.classList.remove("btn-success");
  elements.enableVoting.classList.add("btn-danger");
  elements.enableVoting.innerText = "Stop Voting";
  elements.enableVotingTierlist.classList.remove("btn-success");
  elements.enableVotingTierlist.classList.add("btn-danger");
  elements.enableVotingTierlist.innerText = "Stop Voting";
  voting_enabled = true;
} //enableVoteButton

function disableVoteButton() {
  elements.enableVoting.classList.remove("btn-danger");
  elements.enableVoting.classList.add("btn-success");
  elements.enableVoting.innerText = "Start Voting";
  elements.enableVotingTierlist.classList.remove("btn-danger");
  elements.enableVotingTierlist.classList.add("btn-success");
  elements.enableVotingTierlist.innerText = "Start Voting";
  voting_enabled = false;
} //disableVoteButton

function quit() {
  elements.bracket.style.display = "none";
  elements.tierlist.style.display = "none";
  elements.trivia.style.display = "none";
  elements.editor.style.display = "";
  resetPlayers();
  disableVoteButton();
  changeSiteLinkTarget("_self");
} //quit

function editBracket(id) {
  elements.triviaEditor.style.display = "none";
  elements.bracketEditor.style.display = "";
  elements.bracketOptionsContainer.innerHTML = "";
  id = parseInt(id, 10);
  let bracket = BRACKETS.brackets.find((x) => x.id === id);
  if (bracket) {
    elements.bracketTitle.value = bracket.title;
    elements.bracketTitle.dataset.bracketId = id;
    elements.bracketDescription.value = bracket.description;
  }

  elements.bracketEditorHeader.innerHTML = `ID${id}`;

  for (let index = 0; index < bracket.options.length; index++) {
    addBracketOption(bracket.options[index].name, bracket.options[index].type, bracket.options[index].value, bracket.options[index].thumbnail, bracket.options[index]?.video);
  }
} //editBracket

function editTrivia(id) {
  elements.bracketEditor.style.display = "none";
  elements.triviaEditor.style.display = "";
  elements.triviaQuestionsContainer.innerHTML = "";
  id = parseInt(id, 10);
  let trivia = TRIVIA.trivia.find((x) => x.id === id);
  if (trivia) {
    elements.triviaTitle.value = trivia.title;
    elements.triviaTitle.dataset.triviaId = id;
    elements.triviaDescription.value = trivia.description;
  }

  elements.triviaEditorHeader.innerHTML = `ID${id}`;

  for (let index = 0; index < trivia.questions?.length; index++) {
    addTriviaQuestion(
      trivia.questions[index].multipleChoice,
      trivia.questions[index].type,
      trivia.questions[index].question,
      trivia.questions[index].answer,
      trivia.questions[index].media,
      trivia.questions[index]?.video
    );
  }
} //editTrivia

function deleteBracket(id) {
  id = parseInt(id, 10);
  let bracket = BRACKETS.brackets.find((x) => x.id === id);
  elements.deleteBracketModalBody.innerText = `Delete "${bracket.title}"?`;
  elements.deleteBracketButton.dataset.bracketId = id;
  deleteBracketModal.show();
} //deleteBracket

function deleteTrivia(id) {
  id = parseInt(id, 10);
  let trivia = TRIVIA.trivia.find((x) => x.id === id);
  elements.deleteTriviaModalBody.innerText = `Delete "${trivia.title}"?`;
  elements.deleteTriviaButton.dataset.triviaId = id;
  deleteTriviaModal.show();
} //deleteTrivia

function loadBrackets() {
  if (!BRACKETS?.brackets?.length) {
    elements.myBrackets.innerHTML = `<span class="text-body-secondary">Nothing here</span>`;
    return;
  }

  let html = ``;

  for (let index = BRACKETS.brackets.length - 1; index >= 0; index--) {
    let warning = BRACKETS.brackets[index].options.some((e) => !e.value)
      ? `<i class="material-icons notranslate text-danger cursor-pointer" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Some of the options have no value">warning</i>`
      : "";
    warning += BRACKETS.brackets[index].options.some((e) => !e.thumbnail)
      ? `<i class="material-icons notranslate text-warning cursor-pointer" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Some of the options have no thumbnail">warning</i>`
      : "";
    html += `<div class="card mb-3">
    <div class="card-header">
      ${escapeString(BRACKETS.brackets[index].title) || "Untitled bracket"} ${warning}
      <div class="btn-group btn-group-sm float-end" role="group" aria-label="bracket controls">
        <button type="button" class="btn btn-success" onclick="showStartModal(${BRACKETS.brackets[index].id})">
          <i class="material-icons notranslate">play_arrow</i> Start bracket
        </button>
        <button type="button" class="btn btn-secondary" ${BRACKETS.brackets[index]?.generated || BRACKETS.brackets[index]?.published ? `style="display: none"` : ""}
        data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Publish bracket" onclick="publishBracket(${BRACKETS.brackets[index].id},this)">
         <i class="material-icons notranslate">cloud_upload</i>
       </button>
        <button type="button" class="btn btn-primary"
         data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Edit bracket" onclick="editBracket(${BRACKETS.brackets[index].id})">
        <i class="material-icons notranslate">edit</i>
        </button>
        <button type="button" class="btn btn-danger"
         data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Delete bracket" onclick="deleteBracket(${BRACKETS.brackets[index].id})">
          <i class="material-icons notranslate">delete_forever</i>
        </button>
      </div>
    </div>
    <div class="card-body my-bracket-body">
      <h5 class="card-title">${BRACKETS.brackets[index].description || "No description"}</h5>
      <p class="card-text">${BRACKETS.brackets[index].options.map((e) => `${icons[e.type]} ${escapeString(e.name)}`).join(" • ") || "No options"}</p>
    </div>
  </div>`;
  }
  elements.myBrackets.innerHTML = html;
  enableTooltips();
} //loadBrackets

function loadTrivia() {
  if (!TRIVIA?.trivia?.length) {
    elements.myTrivia.innerHTML = `<span class="text-body-secondary">Nothing here</span>`;
    return;
  }

  let html = ``;

  for (let index = TRIVIA.trivia.length - 1; index >= 0; index--) {
    let warning = "";
    if (!TRIVIA.trivia[index]?.questions || TRIVIA.trivia[index]?.questions.some((e) => !e.answer)) {
      warning = `<i class="material-icons notranslate text-danger cursor-pointer" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Some of the questions have no answer">warning</i>`;
    }

    html += `<div class="card mb-3">
    <div class="card-header">
      ${escapeString(TRIVIA.trivia[index].title) || "Untitled trivia"} ${warning}
      <div class="btn-group btn-group-sm float-end" role="group" aria-label="trivia controls">
        <button type="button" class="btn btn-success" onclick="showStartTriviaModal(${TRIVIA.trivia[index].id})">
          <i class="material-icons notranslate">play_arrow</i> Start trivia
        </button>
        <button type="button" class="btn btn-secondary" ${TRIVIA.trivia[index]?.generated || TRIVIA.trivia[index]?.published ? `style="display: none"` : `style="display: none"`}
        data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Publish trivia" onclick="publishTrivia(${TRIVIA.trivia[index].id},this)">
         <i class="material-icons notranslate">cloud_upload</i>
       </button>
        <button type="button" class="btn btn-primary"
         data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Edit trivia" onclick="editTrivia(${TRIVIA.trivia[index].id})">
        <i class="material-icons notranslate">edit</i>
        </button>
        <button type="button" class="btn btn-danger"
         data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Delete trivia" onclick="deleteTrivia(${TRIVIA.trivia[index].id})">
          <i class="material-icons notranslate">delete_forever</i>
        </button>
      </div>
    </div>
    <div class="card-body my-trivia-body">
      <h5 class="card-title">${TRIVIA.trivia[index].description || "No description"}</h5>
      <p class="card-text">${TRIVIA.trivia[index]?.questions?.map((e) => `${icons[e.type]} ${escapeString(e.question)}`).join(" • ") || "No questions"}</p>
    </div>
  </div>`;
  }
  elements.myTrivia.innerHTML = html;
  enableTooltips();
} //loadTrivia

function closeBracketEditor() {
  saveBracket();
  elements.bracketEditor.style.display = "none";
} //closeBracketEditor

function closeTriviaEditor() {
  saveTrivia();
  elements.triviaEditor.style.display = "none";
} //closeTriviaEditor

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
} //shuffleArray

let previewedBracket = [];
let previewedBracketTitle = "";
let previewedBracketDescription = "";
async function previewSpotifyPlaylist() {
  let playlist = elements.spotifyPlaylistLink.value?.replace(/\s+/g, "").match(spotifyURLRegex);
  if (!playlist[2]) {
    showToast("Invalid playlist URL provided", "warning", 3000);
    return;
  }
  try {
    elements.spotifyPlaylistPreview.innerHTML = spinner;
    let requestOptions = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    let response = await fetch(`https://helper.donk.workers.dev/spotify/playlist?id=${playlist[2]}`, requestOptions);
    let result = await response.json();
    let tracks = [...result[0].tracks.items];
    for (let index = 1; index < result.length; index++) {
      tracks.push(...result[index].items);
    }
    previewedBracketTitle = result[0].name || "Untitled playlist";
    previewedBracketDescription = `${result[0].description || "No description"} - Generated from ${elements.spotifyPlaylistLink.value}`;
    previewedBracket = [];
    let html = `<ul class="list-group">`;
    console.log(tracks);
    for (let index = 0; index < tracks.length; index++) {
      if (!tracks[index].track.is_playable) {
        continue;
      }
      previewedBracket.push({
        name: `${tracks[index].track.name} - ${tracks[index].track.artists.map((a) => a.name).join(", ")}`,
        type: "spotify",
        id: tracks[index].track.id,
        value: tracks[index].track.external_urls.spotify,
        thumbnail: tracks[index].track.album.images[0].url,
      });
      html += `
      <li class="list-group-item">
      <a target="_blank" rel="noopener noreferrer" href="${tracks[index].track.preview_url}">${escapeString(tracks[index].track.name)} - ${tracks[index].track.artists
        .map((a) => a.name)
        .join(", ")}</a>
      </li>`;
    }
    html += `</ul>`;
    elements.spotifyPlaylistPreview.innerHTML = `<p>${escapeString(result[0].name) || "Untitled playlist"} - ${escapeString(result[0].description) || "No description"} - ${
      previewedBracket.length == 0 ? "Playlist has no tracks" : `${previewedBracket.length} ${previewedBracket.length == 1 ? "track" : "tracks"}`
    } </p>${html}`;
  } catch (error) {
    console.log(error);
    showToast("Could not load playlist", "warning", 3000);
    return;
  }
} //previewSpotifyPlaylist

async function previewTiermaker() {
  let link = elements.tiermakerLink.value?.replace(/\s+/g, "")?.toLowerCase() || null;
  let id = link.match(/\/([^\/?]+)(?:\?.*)?$/)[1];
  let number = id.slice(id.lastIndexOf("-") + 1);

  if (!id) {
    showToast("Could not find the provided tier list", "warning", 3000);
    return;
  }
  let images = 0;
  try {
    elements.tiermakerPreview.innerHTML = spinner;
    let requestOptions = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    let response = await fetch(`https://helper.donk.workers.dev/tiermaker?id=${id}`, requestOptions);
    let result = await response.json();
    previewedBracketTitle = `Generated TierMaker bracket`;
    previewedBracketDescription = `Generated from ${link}`;
    previewedBracket = [];
    let list = JSON.parse(result);

    let format = await testImage(`https://tiermaker.com/images/chart/chart/${id}/${list[1]}`, 1);
    if (!format) {
      format = await testImage(`https://tiermaker.com/images/template_images/2022/${number}/${id}/${list[1]}`, 2);
      if (!format) {
        showToast("Could not load tier list :(", "warning", 3000);
        return;
      }
    }

    let html = `<ul class="list-group">`;
    for (let index = 1; index < list.length; index++) {
      let name = list[index].replace("png", "").replace("jpg", "").replace(".", "").replaceAll("-", " ");
      let link = format == 1 ? `https://tiermaker.com/images/chart/chart/${id}/${list[index]}` : `https://tiermaker.com/images/template_images/2022/${number}/${id}/${list[index]}`;
      previewedBracket.push({
        name: name,
        type: "image",
        value: link,
        thumbnail: link,
      });

      html += `
        <li class="list-group-item">
        <a target="_blank" rel="noopener noreferrer" href="https://proxy.donk.workers.dev/?url=${encodeURI(link)}">
        ${escapeString(name) || "Untitled option"}
        </a>
        </li>`;
      images++;
    }
    html += `</ul>`;
    elements.tiermakerPreview.innerHTML = `<p>${list.length - 1} images</p> <p class="text-warning">Make sure the images load by testing one of the links below</p>${html}`;
  } catch (error) {
    console.log(error);
    showToast("Could not find the provided tier list", "warning", 3000);
    return;
  }
} //previewTiermaker

async function previewClips() {
  let channel = elements.clipsChannel.value?.replace(/\s+/g, "");
  if (!channel) {
    showToast("No channel provided", "warning", 3000);
    return;
  }
  let id = await getUserID(channel);
  try {
    elements.clipsPreview.innerHTML = spinner;
    let requestOptions = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    let response = await fetch(`https://helper.donk.workers.dev/twitch/clips?broadcaster_id=${id}`, requestOptions);
    let result = await response.json();
    let clips = result.data;
    if (clips == 0) {
      showToast("Could not load clips", "warning", 3000);
      return;
    }

    previewedBracketTitle = `Top ${channel} clips`;
    previewedBracketDescription = `Bracket with ${clips.length} ${channel} clips`;
    previewedBracket = [];
    let html = `<ul class="list-group">`;
    for (let index = 0; index < clips.length; index++) {
      previewedBracket.push({
        name: clips[index].title,
        id: clips[index].id,
        type: "twitch",
        value: clips[index].url,
        thumbnail: clips[index].thumbnail_url,
      });
      html += `
      <li class="list-group-item">
      <a target="_blank" rel="noopener noreferrer" href="${clips[index].url}">
      ${escapeString(clips[index].title)} - ${clips[index].view_count.toLocaleString()} ${clips[index].view_count == 1 ? "view" : "views"}
      </a>
      </li>`;
    }
    html += `</ul>`;
    elements.clipsPreview.innerHTML = `<p>${clips.length} ${clips.length == 1 ? "clip" : "clips"} </p>${html}`;
  } catch (error) {
    console.log(error);
    showToast("Could not load clips", "warning", 3000);
    return;
  }
} //previewClips

async function previewEmotes() {
  let channel = elements.emotesChannel.value?.replace(/\s+/g, "")?.toLowerCase() || null;
  if (!channel) {
    showToast("No channel provided", "warning", 3000);
    return;
  }
  try {
    elements.emotesPreview.innerHTML = spinner;
    let emotes = await getChannelTwitchEmotes(channel, true);
    previewedBracketTitle = `Best ${channel} emote`;
    previewedBracketDescription = `Bracket with ${emotes.length} ${channel} emotes`;
    previewedBracket = [];
    let html = `<ul class="list-group">`;
    console.log(emotes);
    for (let index = 0; index < emotes.length; index++) {
      previewedBracket.push({
        name: emotes[index].name,
        type: "image",
        value: emotes[index].url,
        thumbnail: emotes[index].url,
      });
      html += `
      <li class="list-group-item">
      <a target="_blank" rel="noopener noreferrer" href="${emotes[index].url}">${emotes[index].name}</a>
      </li>`;
    }
    html += `</ul>`;
    elements.emotesPreview.innerHTML = `<p>${emotes.length == 0 ? "Channel has no emotes" : `${emotes.length} ${emotes.length == 1 ? "emote" : "emotes"}`} </p>${html}`;
  } catch (error) {
    console.log(error);
    showToast("Could not load emotes for the provided channel", "warning", 3000);
    return;
  }
} //previewEmotes

async function previewUwufufu() {
  let link = elements.uwufufuLink.value?.replace(/\s+/g, "")?.toLowerCase() || null;

  if (!link) {
    showToast("No link provided", "warning", 3000);
    return;
  }
  let videos = 0;
  let images = 0;
  try {
    let id = link.match(/\/quiz\/worldcup\/(.+?)(\/rank)?(\?.*)?$/)[1];
    if (id.length !== 24) {
      showToast("Could not find the provided bracket", "warning", 3000);
      return;
    }
    elements.uwufufuPreview.innerHTML = spinner;
    let requestOptions = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    let response = await fetch(`https://helper.donk.workers.dev/uwufufu?id=${id}`, requestOptions);
    let result = await response.json();
    previewedBracketTitle = result.title || `Generated UwUFUFU bracket`;
    previewedBracketDescription = `Generated from ${link}`;
    previewedBracket = [];
    for (let index = 0; index < result.list.length; index++) {
      if (result.list[index].isVideo && !result.list[index].videoUrl) {
        continue;
      }
      if (!result.list[index].isVideo && !result.list[index].resourceUrl) {
        continue;
      }
      previewedBracket.push({
        name: result.list[index].name,
        type: result.list[index].isVideo ? "youtube" : "image",
        value: result.list[index].isVideo ? result.list[index].videoUrl : result.list[index].resourceUrl,
        thumbnail: result.list[index].thumbnailUrl,
      });
    }

    let html = `<ul class="list-group">`;
    for (let index = 0; index < previewedBracket.length; index++) {
      if (previewedBracket[index].type == "youtube") {
        html += `
        <li class="list-group-item">
        <a target="_blank" rel="noopener noreferrer" href="${previewedBracket[index].value}">${previewedBracket[index].name || "Untitled option"}</a>
        </li>`;
        videos++;
      } else {
        html += `
        <li class="list-group-item">
        <a target="_blank" rel="noopener noreferrer" href="https://proxy.donk.workers.dev/?url=${encodeURI(previewedBracket[index].value)}">
        ${escapeString(previewedBracket[index].name) || "Untitled option"}
        </a>
        </li>`;
        images++;
      }
    }
    html += `</ul>`;
    elements.uwufufuPreview.innerHTML = `<p>${videos > 0 ? `${videos} videos` : ""} ${images > 0 ? `${images} images` : ""}</p>${html}`;
  } catch (error) {
    console.log(error);
    showToast("Could not find the provided bracket", "warning", 3000);
    return;
  }
} //previewUwufufu

async function previewYTChannel() {
  let channel = elements.ytchannelLink.value?.replace(/\s+/g, "");
  if (!channel) {
    showToast("No channel provided", "warning", 3000);
    return;
  }

  let id = await getYTChannelID(channel);
  if (!id?.items[0]?.id?.channelId) {
    showToast("Could not find channel", "warning", 3000);
    return;
  }
  id = id.items[0].id.channelId;
  try {
    elements.ytchannelPreview.innerHTML = spinner;
    let videos = await getYTChannelVideos(id);
    videos = videos.flatMap((e) => e.items);
    previewedBracketTitle = `Top ${channel} videos`;
    let numberOfVideos = 0;
    previewedBracket = [];
    let html = `<ul class="list-group">`;
    console.log(videos);
    for (let index = 0; index < videos.length; index++) {
      if (videos[index].snippet?.liveBroadcastContent == "upcoming" || videos[index].snippet?.id?.kind == "youtube#channel") {
        continue;
      }
      numberOfVideos++;
      previewedBracket.push({
        name: videos[index].snippet.title,
        id: videos[index].id.videoId,
        type: "youtube",
        value: `https://www.youtube.com/watch?v=${videos[index].id.videoId}`,
        thumbnail: videos[index].snippet.thumbnails.high.url,
      });
      html += `
      <li class="list-group-item">
      <a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=${videos[index].id.videoId}">
      ${escapeString(videos[index].snippet.title)}
      </a>
      </li>`;
    }
    previewedBracketDescription = `Bracket with the top ${numberOfVideos} ${channel} videos`;
    html += `</ul>`;
    elements.ytchannelPreview.innerHTML = `<p>${numberOfVideos} ${numberOfVideos == 1 ? "video" : "videos"} </p>${html}`;
  } catch (error) {
    console.log(error);
    showToast("Could not channel videos", "warning", 3000);
    return;
  }
} //previewYTChannel

async function previewYTPlaylist() {
  let link = elements.ytplaylistLink.value?.replace(/\s+/g, "");
  if (!link) {
    showToast("No playlist link provided", "warning", 3000);
    return;
  }
  let id = link.match(/^.*(youtu.be\/|list=)([^#\&\?]*).*/);
  if (!id[2] || id[2].length !== 34) {
    showToast("Invalid playlist link provided", "warning", 3000);
    return;
  }
  try {
    elements.ytplaylistPreview.innerHTML = spinner;
    let videos = await getYTPlaylist(id[2]);
    let info = await getYTPlaylistInfo(id[2]);
    videos = videos.flatMap((e) => e.items);
    previewedBracketTitle = info?.items[0]?.snippet?.title || "YouTube playlist generated bracket";
    previewedBracketDescription = `Generated from YouTube playlist ${link}`;
    previewedBracket = [];
    let html = `<ul class="list-group">`;
    console.log(videos);
    for (let index = 0; index < videos.length; index++) {
      previewedBracket.push({
        name: videos[index].snippet.title,
        id: videos[index].snippet.resourceId.videoId,
        type: "youtube",
        value: `https://www.youtube.com/watch?v=${videos[index].snippet.resourceId.videoId}`,
        thumbnail: videos[index].snippet.thumbnails.high.url,
      });
      html += `
      <li class="list-group-item">
      <a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=${videos[index].snippet.resourceId.videoId}">
      ${escapeString(videos[index].snippet.title)}
      </a>
      </li>`;
    }
    html += `</ul>`;
    elements.ytplaylistPreview.innerHTML = `<p>${videos.length} ${videos.length == 1 ? "video" : "videos"} </p>${html}`;
  } catch (error) {
    console.log(error);
    showToast("Could not load playlist", "warning", 3000);
    return;
  }
} //previewYTPlaylist

async function generateBracket() {
  let type = elements.generateBracketType.value?.replace(/\s+/g, "")?.toLowerCase() || null;
  if (!type) {
    showToast("No bracket type selected", "warning", 3000);
    return;
  }

  if (previewedBracket.length == 0) {
    showToast(`You must <button type="button" class="btn btn-info" ><i class="material-icons notranslate">file_download</i> Load</button> the bracket first`, "warning", 3000);
    return;
  }
  createBracket(true, type);
  elements.bracketTitle.value = previewedBracketTitle;
  elements.bracketDescription.value = previewedBracketDescription;
  for (let index = 0; index < previewedBracket.length; index++) {
    addBracketOption(previewedBracket[index].name, previewedBracket[index].type, previewedBracket[index].value, previewedBracket[index].thumbnail, previewedBracket[index]?.video);
  }

  saveBracket();
  generateModal.hide();
} //generateBracket

async function publishBracket(id, e) {
  e.innerHTML = `<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>`;
  const tooltip = bootstrap.Tooltip.getInstance(e);
  tooltip.dispose();

  id = parseInt(id, 10);
  const bracketIndex = BRACKETS.brackets.findIndex((e) => e.id === id);

  if (BRACKETS.brackets[bracketIndex].options.length < 2) {
    showToast("Bracket must have 2 options at least", "warning", 3000);
    e.innerHTML = `<i class="material-icons notranslate">cloud_upload</i>`;
    return;
  }
  let body = JSON.stringify({
    userid: USER.userID,
    username: USER.channel,
    access_token: USER.access_token,
    bracket: BRACKETS.brackets[bracketIndex],
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
    let response = await fetch(`https://blt.donk.workers.dev/publish`, requestOptions);
    let result = await response.json();
    console.log(result);
    showToast(result.message, "info", 3000);
    if (response.status == 200) {
      BRACKETS.brackets[bracketIndex].published = true;
      elements.bracketCode.innerHTML = result.id;
      elements.bracketLink.innerHTML = `https://chat.vote/blt#${result.id}`;
      publishedModal.show();
      saveSettings();
      loadBrackets();
    }
    e.innerHTML = `<i class="material-icons notranslate">cloud_upload</i>`;
  } catch (error) {
    showToast("Could not publish bracket", "danger", 3000);
    e.innerHTML = `<i class="material-icons notranslate">cloud_upload</i>`;
    console.log("publishBracket error", error);
  }
} //publishBracket

let importPreviewedBracket;
async function importCode(hashCode = "") {
  elements.importModalBody.innerHTML = spinner;
  let code = elements.shareCode.value?.trim();

  if (hashCode) {
    code = hashCode;
  }

  if (!code || code.length != 4) {
    showToast("Invalid bracket code", "warning", 3000);
    return;
  }
  elements.shareCode.value = "";
  communityModal.hide();
  importModal.show();
  try {
    let response = await fetch(`https://blt.donk.workers.dev/id/${code}`);
    if (response.status !== 200) {
      elements.importModalBody.innerHTML = "Bracket not found :(";
      return;
    }
    let result = await response.json();
    console.log(result);
    importPreviewedBracket = result;

    if (result.blacklisted) {
      elements.importModalBody.innerHTML = `<span class="text-danger">This bracket is blacklisted (${result.reason})</span>`;
      return;
    }

    let html = `
    <div class="card">
    <div class="card-header">${escapeString(result.bracket.title)} <span class="text-body-secondary">by @${result.username}</span></div>
    <div class="card-body">
    <p class="card-text">${escapeString(result.bracket.description)}</p>
    Options (${result.bracket.options.length}):
    <ul class="list-group" style="max-height: 400px; overflow: auto">`;
    for (let index = 0; index < result.bracket.options.length; index++) {
      html += `<li class="list-group-item">${escapeString(result.bracket.options[index].name)} - ${escapeString(result.bracket.options[index].value)}</li>`;
    }
    html += `
    </ul>
    </div>
    </div>
    <span class="text-warning">Import brackets from users you trust only</span><br>
    <button type="button" class="btn btn-danger mt-3" data-bs-dismiss="modal" onclick="importPreviewed()">
    <i class="material-icons notranslate">cloud_download</i> Import
    </button>`;
    elements.importModalBody.innerHTML = html;
  } catch (error) {
    elements.importModalBody.innerHTML = "Could not import bracket :(";
    console.log("importCode error", error);
  }
} //importCode

function importPreviewed() {
  createBracket(true);
  elements.bracketTitle.value = importPreviewedBracket.bracket.title;
  elements.bracketDescription.value = `${importPreviewedBracket.bracket.description} - Bracket by @${importPreviewedBracket.username} - bracket ID: ${importPreviewedBracket.id}`;
  for (let index = 0; index < importPreviewedBracket.bracket.options.length; index++) {
    addBracketOption(
      importPreviewedBracket.bracket.options[index].name,
      importPreviewedBracket.bracket.options[index].type,
      importPreviewedBracket.bracket.options[index].value,
      importPreviewedBracket.bracket.options[index].thumbnail,
      importPreviewedBracket.bracket.options[index]?.video
    );
  }
  saveBracket();
  importModal.hide();
} //importPreviewed

async function importApproved(id) {
  let bracket = approvedBrackets.find((e) => e.id === id);
  createBracket(true);
  elements.bracketTitle.value = bracket.bracket.title;
  elements.bracketDescription.value = `${bracket.bracket.description} - Bracket by @${bracket.username} - bracket ID: ${bracket.id}`;
  for (let index = 0; index < bracket.bracket.options.length; index++) {
    addBracketOption(
      bracket.bracket.options[index].name,
      bracket.bracket.options[index].type,
      bracket.bracket.options[index].value,
      bracket.bracket.options[index].thumbnail,
      bracket.bracket.options[index]?.video
    );
  }
  saveBracket();
  communityModal.hide();
} //importApproved

let chatBracket = [];
async function loadPlaylist() {
  let playlistLocalforage = localforage.createInstance({
    driver: localforage.INDEXEDDB,
    name: "chat.vote/playlist",
    version: 1.0,
    storeName: "playlist",
    description: "playlist requests and history",
  });

  try {
    const playlist = await playlistLocalforage.getItem("PLAYLIST_REQUESTS");
    if (!playlist) {
      console.log("localStorage playlist requests not found");
    } else {
      requests = JSON.parse(playlist, reviver);
      console.log(requests);

      if (!requests || requests.size < 2) {
        elements.playlist.innerHTML = `<span class="text-warning">Playlist needs to have at least 2 videos</span>`;
        return;
      }

      let count = 0;
      chatBracket = [];
      let html = `<ul class="list-group">`;

      for (let [key, req] of requests) {
        let type = req.type;
        if (type == "twitch stream" || type == "twitch vod") {
          //skip streams and vods bcz they are not supported in the brackets site
          continue;
        }

        if (!req.title || !req.id || !req.type || !req.thumbnail || (req.type == "streamable" && !req.video)) {
          //skip broken requests
          continue;
        }

        if (type == "youtube short") {
          type = "youtube";
        }

        if (type == "twitch clip") {
          type = "twitch";
        }

        if (type == "supa video" || type == "supa audio") {
          type = "supa video/audio";
        }

        count++;

        let link = getItemLink(type, req.id);

        chatBracket.push({
          name: req.title,
          id: req.id,
          type: type,
          value: link,
          thumbnail: req.thumbnail,
          video: req?.video,
        });
        html += `
        <li class="list-group-item">
        <a target="_blank" rel="noopener noreferrer" href="${link}">
        ${escapeString(req.title)}
        </a>
        </li>`;
      }

      html += `</ul>`;
      let diff = playlist.length - count;
      elements.playlist.innerHTML = `
        Playlist has ${count} videos ${diff ? ` (${diff} unsupported/broken ${diff == 1 ? "video" : "videos"} skipped)` : ""}
        ${html}`;

      communityModal.hide();

      console.log(playlist);
    }
  } catch (error) {
    console.log(error);
  }
} //loadPlaylist

function generateChatBracket() {
  if (chatBracket.length == 0) {
    showToast(`You must <button type="button" class="btn btn-success" ><i class="material-icons notranslate">file_download</i> Load</button> the playlist first`, "warning", 3000);
    return;
  }
  createBracket(true);
  elements.bracketTitle.value = "Chat bracket";
  elements.bracketDescription.value = "Bracket with chat's requests";
  for (let index = 0; index < chatBracket.length; index++) {
    addBracketOption(chatBracket[index].name, chatBracket[index].type, chatBracket[index].value, chatBracket[index].thumbnail, chatBracket[index]?.video);
  }

  saveBracket();
  generateChatModal.hide();
} //generateChatBracket

function zoomCard(id) {
  elements[id].classList.toggle(`zoomed`);
  elements[`${id}_zoom_icon`].innerHTML = elements[id].classList.contains(`zoomed`) ? "zoom_out" : "zoom_in";
  if (elements[id].classList.contains(`zoomed`)) {
    anime({
      targets: `#${id}`,
      translateX: `${id == "left_card" ? "+=50%" : "-=50%"}`,
      scale: "+=0.4",
    });
  } else {
    anime({
      targets: `#${id}`,
      translateX: `${id == "left_card" ? "-=50%" : "+=50%"}`,
      scale: "-=0.4",
    });
  }
} //zoomCard

let scoreHidden = false;
function hideScore() {
  scoreHidden = !scoreHidden;
  elements.hideScoreIcon.innerHTML = scoreHidden ? "visibility_off" : "visibility";
  elements.hideScoreTierlistIcon.innerHTML = scoreHidden ? "visibility_off" : "visibility";

  if (scoreHidden) {
    updateScores();
  } else {
    if (currentFormat == "single") {
      let scores = {
        left: 0,
        right: 0,
      };
      anime({
        targets: scores,
        left: vote_results.left,
        right: vote_results.right,
        round: 1,
        easing: "easeInOutExpo",
        update: function () {
          elements.left_score.innerHTML = `${scores.left.toLocaleString()} ${scores.left == 1 ? "vote" : "votes"}`;
          elements.right_score.innerHTML = `${scores.right.toLocaleString()} ${scores.right == 1 ? "vote" : "votes"}`;
        },
      });
    }
    if (currentFormat == "tierlist") {
      updateScores();
    }
  }
} //hideScore

function loadTierlistEditor() {
  let labels = document.querySelectorAll(".tierlist-label");
  let html = "";
  for (let index = 0; index < labels.length; index++) {
    html += `<div class="input-group mb-3">
    <span class="input-group-text">Tier name:</span>
    <input type="text" class="form-control tier-name" placeholder="name" aria-label="Tier name" value="${labels[index].textContent}" onchange="updateTierlist()" />
    <span class="input-group-text">Voting command:</span>
    <input type="text" class="form-control tier-command" placeholder="command" aria-label="Voting command" value="${labels[index].textContent}" onchange="updateTierlist()" />
    <span class="input-group-text">Color:</span>
    <input type="color" class="form-control tier-color" value="${rgba2hex(labels[index].style.backgroundColor)}" aria-label="Tier color" onchange="updateTierlist()" />
    <button class="btn btn-outline-secondary" type="button" id="button-addon2"><i class="material-icons notranslate" style="cursor: pointer">delete_forever</i></button>
    </div>`;
  }
  elements.tierlistEditor.innerHTML = html;
} //loadTierlistEditor

function addTier(name, command, color) {
  let labels = document.querySelectorAll(".tierlist-label");
  if (name == "name") {
    name = `Tier#${labels.length + 1}`;
    command = `Tier#${labels.length + 1}`;
  }
  elements.tierlistContainer.insertAdjacentHTML(
    "beforeend",
    `<div class="card mb-1 tierlist-tier">
    <div class="row g-0">
    <div class="col-auto rounded-start tierlist-label" contenteditable="true" spellcheck="false" style="background-color: ${color}">${name}</div>
    <div class="col">
    <div class="card-body p-1" data-tier="${command}"></div>
    </div>
    </div>
    </div>`
  );
  loadTierlistEditor();
} //addTier

function updateTierlist() {} //updateTierlist

const rgba2hex = (rgba) =>
  `#${rgba
    .match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/)
    .slice(1)
    .map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, "0").replace("NaN", ""))
    .join("")}`;

async function getYTPlaylist(id) {
  try {
    let response = await fetch(`https://helper.donk.workers.dev/youtube/playlist?id=${encodeURIComponent(id)}`);
    let result = await response.json();
    return result;
  } catch (error) {
    console.log("getYTPlaylist error", error);
    return false;
  }
} //getYTPlaylist

async function getYTChannelVideos(id, length = 1) {
  try {
    let response = await fetch(`https://helper.donk.workers.dev/youtube/channelvideos?id=${encodeURIComponent(id)}&length=${length}`);
    let result = await response.json();
    return result;
  } catch (error) {
    console.log("getYTChannelVideos error", error);
    return false;
  }
} //getYTChannelVideos

async function getYTPlaylistInfo(id) {
  try {
    let response = await fetch(`https://helper.donk.workers.dev/youtube/playlistinfo?id=${encodeURIComponent(id)}`);
    let result = await response.json();
    return result;
  } catch (error) {
    console.log("getYTPlaylistInfo error", error);
    return false;
  }
} //getYTPlaylistInfo

async function getYTChannelID(handle) {
  try {
    let response = await fetch(`https://helper.donk.workers.dev/youtube/id?handle=${encodeURIComponent(handle)}`);
    let result = await response.json();
    return result;
  } catch (error) {
    console.log("getYTChannelID error", error);
    return false;
  }
} //getYTChannelID

function dragElement() {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  elements.tierlistItemDrag.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elements.tierlistItem.style.top = elements.tierlistItem.offsetTop - pos2 + "px";
    elements.tierlistItem.style.left = elements.tierlistItem.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
} //dragElement

async function testImage(url, format) {
  try {
    const res = await fetch(`https://helper.donk.workers.dev/cors/?${url}`);
    const buff = await res.blob();
    if (buff.type.startsWith("image/")) {
      return format;
    }
  } catch (error) {
    return 0;
  }
} //testImage

function resetPlayers(left = true, right = true) {
  if (left) {
    elements.text_image_left.style.display = "none";
    elements.youtubeEmbedContainer_left.style.display = "none";
    elements.spotifyEmbedContainer_left.style.display = "none";
    elements.twitchClipsEmbed_left.style.display = "none";
    elements.videoEmbed_left.style.display = "none";
    youtubePlayer_left.loadVideoById("");
    spotifyPlayer_left.pause();
    elements.twitchClipsEmbed_left.innerHTML = "";
    elements.videoEmbed_left.src = "";
  }

  if (right) {
    elements.text_image_right.style.display = "none";
    elements.youtubeEmbedContainer_right.style.display = "none";
    elements.spotifyEmbedContainer_right.style.display = "none";
    elements.twitchClipsEmbed_right.style.display = "none";
    elements.videoEmbed_right.style.display = "none";
    youtubePlayer_right.loadVideoById("");
    spotifyPlayer_right.pause();
    elements.twitchClipsEmbed_right.innerHTML = "";
    elements.videoEmbed_right.src = "";
  }

  elements.text_image_tierlist.style.display = "none";
  elements.youtubeEmbedContainer_tierlist.style.display = "none";
  elements.spotifyEmbedContainer_tierlist.style.display = "none";
  elements.twitchClipsEmbed_tierlist.style.display = "none";
  elements.videoEmbed_tierlist.style.display = "none";
  youtubePlayer_tierlist.loadVideoById("");
  spotifyPlayer_tierlist.pause();
  elements.twitchClipsEmbed_tierlist.innerHTML = "";
  elements.videoEmbed_tierlist.src = "";

  elements.image_trivia.style.display = "none";
  elements.youtubeEmbedContainer_trivia.style.display = "none";
  elements.spotifyEmbedContainer_trivia.style.display = "none";
  elements.twitchClipsEmbed_trivia.style.display = "none";
  elements.videoEmbed_trivia.style.display = "none";
  youtubePlayer_trivia.loadVideoById("");
  spotifyPlayer_trivia.pause();
  elements.twitchClipsEmbed_trivia.innerHTML = "";
  elements.videoEmbed_trivia.src = "";
} //resetPlayers

function getItemLink(type, id) {
  switch (type) {
    case "youtube":
      return `https://youtu.be/${id}`;
    case "spotify":
      return `https://open.spotify.com/track/${id}`;
    case "twitch":
      return `https://clips.twitch.tv/${id}`;
    case "streamable":
      return `https://streamable.com/${id}`;
    case "supa video/audio":
      return `https://i.supa.codes/${id}`;
    default:
      return "";
  }
} //getItemLink

window.onload = async function () {
  darkTheme = (localStorage.getItem("darkTheme") || "true") === "true";
  elements.darkTheme.checked = darkTheme ?? true;
  switchTheme(elements.darkTheme.checked);

  loadAndConnect();

  if (!USER.channel) {
    loginButton = new bootstrap.Popover(elements.loginButton);
  }

  enableTooltips();
  enablePopovers();

  document.addEventListener("click", (event) => {
    if (!elements.left_card.contains(event.target) && elements.left_card.classList.contains(`zoomed`)) {
      elements.left_card.classList.remove("zoomed");
      elements.left_card_zoom_icon.innerHTML = "zoom_in";
      anime({
        targets: `#left_card`,
        translateX: "-=50%",
        scale: "-=0.4",
      });
    }
    if (!elements.right_card.contains(event.target) && elements.right_card.classList.contains(`zoomed`)) {
      elements.right_card.classList.remove("zoomed");
      elements.right_card_zoom_icon.innerHTML = "zoom_in";
      anime({
        targets: `#right_card`,
        translateX: "+=50%",
        scale: "-=0.4",
      });
    }
  });

  votePopover = new bootstrap.Popover(elements.enableVoting);
  votePopoverTierlist = new bootstrap.Popover(elements.enableVotingTierlist);

  loginExpiredModal = new bootstrap.Modal(elements.loginExpiredModal);
  deleteBracketModal = new bootstrap.Modal(elements.deleteBracketModal);
  deleteTriviaModal = new bootstrap.Modal(elements.deleteTriviaModal);
  tierlistEditorModal = new bootstrap.Modal(elements.tierlistEditorModal);
  previewModal = new bootstrap.Modal(elements.previewModal);
  generateChatModal = new bootstrap.Modal(elements.generateChatModal);
  generateModal = new bootstrap.Modal(elements.generateModal);
  communityModal = new bootstrap.Modal(elements.communityModal);
  startModal = new bootstrap.Modal(elements.startModal);
  startTriviaModal = new bootstrap.Modal(elements.startTriviaModal);
  publishedModal = new bootstrap.Modal(elements.publishedModal);
  importModal = new bootstrap.Modal(elements.importModal);

  elements.tierlistEditorModal.addEventListener("show.bs.modal", (event) => {
    loadTierlistEditor();
  });

  elements.previewModal.addEventListener("hidden.bs.modal", (event) => {
    elements.previewModalBody.innerHTML = "";
  });

  elements.generateModal.addEventListener("hidden.bs.modal", (event) => {
    previewedBracket = [];
    previewedBracketDescription = "";
    previewedBracketTitle = "";
    for (let element of document.getElementsByClassName("generate-type")) {
      element.style.display = "none";
    }
    for (let element of document.getElementsByClassName("generate-value")) {
      element.value = "";
    }
    for (let element of document.getElementsByClassName("generate-preview")) {
      element.innerHTML = "";
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

  elements.generateBracketType.onchange = function () {
    for (let element of document.getElementsByClassName("generate-type")) {
      element.style.display = "none";
    }
    elements[`${this.value}Settings`].style.display = "";
  };

  elements.formatSelect.onchange = function () {
    if (this.value == "tierlist") {
      elements.bracketSettings.style.display = "none";
      elements.tierlistSettings.style.display = "";
    } else {
      elements.bracketSettings.style.display = "";
      elements.tierlistSettings.style.display = "none";
    }
  };

  elements.changeCommand.onchange = function () {
    elements.changeCommandCopy.checked = this.checked;
  };
  elements.changeCommandCopy.onchange = function () {
    elements.changeCommand.checked = this.checked;
  };

  elements.keepVotingEnabled.onchange = function () {
    elements.keepVotingEnabledCopy.checked = this.checked;
  };
  elements.keepVotingEnabledCopy.onchange = function () {
    elements.keepVotingEnabled.checked = this.checked;
  };

  elements.disableAnimations.onchange = function () {
    elements.disableAnimationsCopy.checked = this.checked;
  };
  elements.disableAnimationsCopy.onchange = function () {
    elements.disableAnimations.checked = this.checked;
  };

  elements.triviaPoints.onchange = function () {
    triviaPoints = parseInt(elements.triviaPoints.value, 10);
    elements.triviaPointsCopy.value = triviaPoints;
  };
  elements.triviaPointsCopy.onchange = function () {
    triviaPoints = parseInt(elements.triviaPointsCopy.value, 10);
    elements.triviaPoints.value = triviaPoints;
  };

  elements.triviaScoring.onchange = function () {
    elements.triviaScoringCopy.value = this.value;
  };
  elements.triviaScoringCopy.onchange = function () {
    elements.triviaScoring.value = this.value;
  };

  elements.oneChance.onchange = function () {
    elements.oneChanceCopy.checked = this.checked;
  };
  elements.oneChanceCopy.onchange = function () {
    elements.oneChance.checked = this.checked;
  };

  elements.showHint.onchange = function () {
    elements.showHintCopy.checked = this.checked;
  };
  elements.showHintCopy.onchange = function () {
    elements.showHint.checked = this.checked;
  };

  elements.hideScore.addEventListener("click", function () {
    const tooltip = bootstrap.Tooltip.getInstance("#hideScore");
    tooltip.setContent({ ".tooltip-inner": scoreHidden ? "Hide score" : "Show score" });
    hideScore();
  });
  elements.hideScoreTierlist.addEventListener("click", function () {
    const tooltip = bootstrap.Tooltip.getInstance("#hideScoreTierlist");
    tooltip.setContent({ ".tooltip-inner": scoreHidden ? "Hide score" : "Show score" });
    hideScore();
  });

  elements.importBracket.addEventListener("click", function () {
    previewedBracket = [];
    previewedBracketDescription = "";
    previewedBracketTitle = "";
    for (let element of document.getElementsByClassName("generate-type")) {
      element.style.display = "none";
    }
    for (let element of document.getElementsByClassName("generate-value")) {
      element.value = "";
    }
    for (let element of document.getElementsByClassName("generate-preview")) {
      element.innerHTML = "";
    }
    generateModal.show();
  });

  elements.addBracketOption.addEventListener("click", function () {
    addBracketOption();
    saveBracket(true);
  });

  elements.addTriviaQuestion.addEventListener("click", function () {
    addTriviaQuestion();
    saveTrivia(true);
  });

  elements.deleteBracketButton.addEventListener("click", function () {
    let id = parseInt(this.dataset.bracketId, 10);
    BRACKETS.brackets.splice(
      BRACKETS.brackets.findIndex((e) => e.id === id),
      1
    );
    loadBrackets();
    saveSettings();
    elements.bracketEditor.style.display = "none";
    deleteBracketModal.hide();
    enableTooltips();
  });

  elements.deleteTriviaButton.addEventListener("click", function () {
    let id = parseInt(this.dataset.triviaId, 10);
    TRIVIA.trivia.splice(
      TRIVIA.trivia.findIndex((e) => e.id === id),
      1
    );
    loadTrivia();
    saveSettings();
    elements.triviaEditor.style.display = "none";
    deleteTriviaModal.hide();
    enableTooltips();
  });

  dragElement();

  let code = location.hash?.replace("#", "")?.trim();
  if (code.length == 4) {
    importCode(code);
    history.replaceState(undefined, undefined, "#");
  }
}; //onload

let youtubePlayer_left;
let youtubePlayer_right;
let youtubePlayer_tierlist;
let youtubePlayer_trivia;

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

  elements.left_value.addEventListener("mouseover", (event) => {
    try {
      if (youtubePlayer_left.getPlayerState() >= 1 && youtubePlayer_right.getPlayerState() >= 1) {
        youtubePlayer_right.mute();
        youtubePlayer_left.unMute();
      }
    } catch (error) {}
  });
  elements.right_value.addEventListener("mouseover", (event) => {
    try {
      if (youtubePlayer_left.getPlayerState() >= 1 && youtubePlayer_right.getPlayerState() >= 1) {
        youtubePlayer_left.mute();
        youtubePlayer_right.unMute();
      }
    } catch (error) {}
  });

  console.log("onYouTubeIframeAPIReady");
  youtubePlayer_left = new YT.Player("youtubeEmbed_left", {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      enablejsapi: 1,
      playsinline: 1,
      rel: 0,
      origin: "chat.vote",
    },
    events: {
      onError: youtubePlayerOnError,
      onAutoplayBlocked: youtubePlayerOnAutoplayBlocked,
    },
  });
  youtubePlayer_right = new YT.Player("youtubeEmbed_right", {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
      enablejsapi: 1,
      playsinline: 1,
      rel: 0,
      origin: "chat.vote",
    },
    events: {
      onError: youtubePlayerOnError,
      onAutoplayBlocked: youtubePlayerOnAutoplayBlocked,
    },
  });
  youtubePlayer_tierlist = new YT.Player("youtubeEmbed_tierlist", {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      enablejsapi: 1,
      playsinline: 1,
      rel: 0,
      origin: "chat.vote",
    },
    events: {
      onError: youtubePlayerOnError,
      onAutoplayBlocked: youtubePlayerOnAutoplayBlocked,
    },
  });

  youtubePlayer_trivia = new YT.Player("youtubeEmbed_trivia", {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      enablejsapi: 1,
      playsinline: 1,
      rel: 0,
      origin: "chat.vote",
    },
    events: {
      onError: youtubePlayerOnError,
      onAutoplayBlocked: youtubePlayerOnAutoplayBlocked,
    },
  });
} //onYouTubeIframeAPIReady

function youtubePlayerOnError(event) {
  console.log(event);
} //youtubePlayerOnError

function youtubePlayerOnAutoplayBlocked(event) {
  console.log(event);
} //youtubePlayerOnAutoplayBlocked

let spotifyPlayer_left;
let spotifyPlayer_right;
let spotifyPlayer_tierlist;
let spotifyPlayer_trivia;
window.onSpotifyIframeApiReady = (IFrameAPI) => {
  console.log("onSpotifyIframeApiReady");

  //spotifyPlayer.loadUri('spotify:episode:7makk4oTQel546B0PZlDM5');
  //spotifyPlayer.play()
  //spotifyPlayer.pause();

  const callback_left = (EmbedController) => {
    spotifyPlayer_left = EmbedController;
  };
  const callback_right = (EmbedController) => {
    spotifyPlayer_right = EmbedController;
  };
  const callback_tierlist = (EmbedController) => {
    spotifyPlayer_tierlist = EmbedController;
  };
  const callback_trivia = (EmbedController) => {
    spotifyPlayer_trivia = EmbedController;
  };
  IFrameAPI.createController(elements.spotifyEmbed_left, {}, callback_left);
  IFrameAPI.createController(elements.spotifyEmbed_right, {}, callback_right);
  IFrameAPI.createController(elements.spotifyEmbed_tierlist, {}, callback_tierlist);
  IFrameAPI.createController(elements.spotifyEmbed_trivia, {}, callback_trivia);
}; //onSpotifyIframeApiReady
