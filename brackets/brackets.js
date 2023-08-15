/*jshint esversion: 11 */
const CLIENT_ID = "qn0wimnszbqlwfnszdz3wwfz430eqr";

let elements = {
  //modals
  loginExpiredModal: document.getElementById("loginExpiredModal"),
  loginExpiredRenew: document.getElementById("loginExpiredRenew"),
  loginExpiredReset: document.getElementById("loginExpiredReset"),

  deleteBracketModal: document.getElementById("deleteBracketModal"),
  deleteBracketModalBody: document.getElementById("deleteBracketModalBody"),
  deleteBracketButton: document.getElementById("deleteBracketButton"),
  quitBracketModal: document.getElementById("quitBracketModal"),

  previewModal: document.getElementById("previewModal"),
  previewModalBody: document.getElementById("previewModalBody"),

  generateModal: document.getElementById("generateModal"),
  generateBracketType: document.getElementById("generateBracketType"),
  spotifyplaylistSettings: document.getElementById("spotifyplaylistSettings"),
  clipsSettings: document.getElementById("clipsSettings"),
  emotesSettings: document.getElementById("emotesSettings"),
  uwufufuSettings: document.getElementById("uwufufuSettings"),
  ytchannelSettings: document.getElementById("ytchannelSettings"),
  ytplaylistSettings: document.getElementById("ytplaylistSettings"),

  spotifyPlaylistLink: document.getElementById("spotifyPlaylistLink"),
  spotifyPlaylistPreview: document.getElementById("spotifyPlaylistPreview"),
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

  browseModal: document.getElementById("browseModal"),
  browseModalBody: document.getElementById("browseModalBody"),

  startModal: document.getElementById("startModal"),
  optionLimit: document.getElementById("optionLimit"),
  changeCommand: document.getElementById("changeCommand"),
  keepVotingEnabled: document.getElementById("keepVotingEnabled"),
  disableAnimations: document.getElementById("disableAnimations"),

  //navbar
  vtsLink: document.getElementById("vtsLink"),
  status: document.getElementById("status"),
  topRight: document.getElementById("topRight"),
  loginButton: document.getElementById("loginButton"),
  channelName: document.getElementById("channelName"),
  connectbtn: document.getElementById("connectbtn"),
  darkTheme: document.getElementById("darkTheme"),

  myBrackets: document.getElementById("myBrackets"),
  createBracket: document.getElementById("createBracket"),
  importBracket: document.getElementById("importBracket"),
  browseBracket: document.getElementById("browseBracket"),
  bracketEditor: document.getElementById("bracketEditor"),
  bracketEditorHeader: document.getElementById("bracketEditorHeader"),
  bracketTitle: document.getElementById("bracketTitle"),
  bracketDescription: document.getElementById("bracketDescription"),
  optionContainer: document.getElementById("optionContainer"),
  addOption: document.getElementById("addOption"),

  //main
  toastContainer: document.getElementById("toastContainer"),
  main: document.getElementById("main"),
  brackets_editor: document.getElementById("brackets_editor"),
  pickWinner: document.getElementById("pickWinner"),
  hideScore: document.getElementById("hideScore"),
  hideScoreIcon: document.getElementById("hideScoreIcon"),

  title: document.getElementById("title"),
  round: document.getElementById("round"),

  left_container: document.getElementById("left_container"),
  right_container: document.getElementById("right_container"),

  left_title: document.getElementById("left_title"),
  right_title: document.getElementById("right_title"),

  left_card: document.getElementById("left_card"),
  right_card: document.getElementById("right_card"),
  left_card_zoom_icon: document.getElementById("left_card_zoom_icon"),
  right_card_zoom_icon: document.getElementById("right_card_zoom_icon"),
  left_name: document.getElementById("left_name"),
  right_name: document.getElementById("right_name"),
  left_score: document.getElementById("left_score"),
  right_score: document.getElementById("right_score"),
  left_command: document.getElementById("left_command"),
  right_command: document.getElementById("right_command"),
  left_value: document.getElementById("left_value"),
  right_value: document.getElementById("right_value"),
  left_info: document.getElementById("left_info"),
  right_info: document.getElementById("right_info"),

  controls: document.getElementById("controls"),
  enableVoting: document.getElementById("enableVoting"),

  end: document.getElementById("end"),
  endTitle: document.getElementById("endTitle"),
  winner_name: document.getElementById("winner_name"),
  winner_value: document.getElementById("winner_value"),
  endControls: document.getElementById("endControls"),
};

const icons = {
  text: `<i class="material-icons notranslate">description</i>`,
  image: `<i class="material-icons notranslate">image</i>`,
  youtube: `<i class="material-icons notranslate">play_arrow</i>`,
  twitch: `<i class="material-icons notranslate">movie_creation</i>`,
  spotify: `<i class="material-icons notranslate">audiotrack</i>`,
};
const spinner = `<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>`;
const spotifyURLRegex = /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:(album|track|playlist)\/|\?uri=spotify:track:)((\w|-){22})/;

let darkTheme = true;

let client;
let loginButton;
let loginExpiredModal, deleteBracketModal, quitBracketModal, previewModal, generateModal, browseModal, startModal;
let votePopover;
let currentBracket = {};
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
  localStorage.setItem(
    "BRACKETS",
    JSON.stringify({
      brackets: [],
    })
  );
  location.reload();
  return false;
} //resetSettings

async function refreshData() {
  darkTheme = elements.darkTheme.checked ?? true;

  if (!USER.twitchLogin) {
    USER.channel = validator.escape(elements.channelName.value.replace(/\s+/g, "").toLowerCase());
    USER.platform = "twitch";
  }
  if (!USER.userID && USER.channel) {
    USER.userID = await getUserID(USER.channel);
  }
} //refreshdata

function saveSettings() {
  refreshData();
  localStorage.setItem("USER", JSON.stringify(USER));
  localStorage.setItem("BRACKETS", JSON.stringify(BRACKETS));
  localStorage.setItem("darkTheme", darkTheme);
} //saveSettings

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

function load_localStorage() {
  if (!localStorage.getItem("USER")) {
    console.log("localStorage user info not found");
  } else {
    USER = JSON.parse(localStorage.getItem("USER"));
    elements.channelName.value = USER.channel;
  }

  if (!localStorage.getItem("BRACKETS")) {
    console.log("localStorage brackets settings not found");
  } else {
    BRACKETS = JSON.parse(localStorage.getItem("BRACKETS"));
    loadBrackets();
  }
} //load_localStorage

async function loadPFP() {
  if (!USER.channel) {
    elements.topRight.innerHTML = ` <div class="btn-group" role="group" aria-label="login options">
      <a
        role="button"
        id="loginButton"
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
            <button type="button" id="connectbtn" class="btn btn-primary float-end">Connect</button>
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
  elements.topRight.innerHTML = ` <div class="btn-group" role="group" aria-label="login options">
    <a
      role="button"
      id="loginButton"
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
          <button type="button" id="connectbtn" class="btn btn-primary float-end">Connect</button>
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

    if (!voting_enabled) {
      if ((command == "1" || command == "a" || command == "2" || command == "b") && (Date.now() - currentTime) / 1000 > 10) {
        currentTime = Date.now();
        votePopover.show();
        setTimeout(function () {
          votePopover.hide();
        }, 2000);
      } //if chatter is trying to vote while voting is disabled show popover
      return;
    } //voting disabled

    if (voters.includes(context["user-id"])) {
      return;
    } //chatter already voted

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
  }); //message

  client.on("timeout", (channel, username, reason, duration, userstate) => {}); //timeout

  client.on("connected", async (address, port) => {
    console.log(`Connected to ${address}:${port}`);
    elements.status.innerHTML = `<h4><span class="badge bg-success">Connected :)</span></h4>`;
    saveSettings();
    sendUsername(`chat.vote/brackets`, USER.channel, USER.platform == "twitch" ? `twitch - ${USER.twitchLogin}` : "youtube");
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

function addOption(name = "", type = "", value = "") {
  let optionNumber = ++document.querySelectorAll(".option-name").length;
  let optionType = "text";
  if (optionNumber > 1) {
    optionType = Array.from(document.getElementsByClassName("option-type")).find((e) => parseInt(e.dataset.optionId, 10) === optionNumber - 1).value || "text";
  }

  if (type) {
    optionType = type;
  }

  elements.optionContainer.insertAdjacentHTML(
    "beforeend",
    `<div class="card mb-2" data-option-id="${optionNumber}">
      <div class="card-header">
      Option #${optionNumber}
      <i class="material-icons notranslate  deletebtn float-end" onclick="deleteOption('${optionNumber}')">delete_forever</i>
      </div>
      <div class="card-body">
        <div class="input-group mb-3">
          <span class="input-group-text">Name</span>
          <input type="text" class="form-control option-name" data-option-id="${optionNumber}" onchange="saveBracket()" value="${name}"  placeholder="Option Name" aria-label="Option Name" />
        </div>

        <div class="input-group mb-3">
          <label class="input-group-text">Type</label>
          <select class="form-select option-type" data-option-id="${optionNumber}" onchange="saveBracket()">
            <option value="text" ${optionType == "text" ? "selected" : ""}>Text</option>
            <option value="image" ${optionType == "image" ? "selected" : ""}>Image</option>
            <option value="youtube" ${optionType == "youtube" ? "selected" : ""}>YouTube video</option>
            <option value="twitch" ${optionType == "twitch" ? "selected" : ""}>Twitch clip</option>
            <option value="spotify" ${optionType == "spotify" ? "selected" : ""}>Spotify song</option>
          </select>
          <button class="btn btn-outline-secondary" onclick="previewOption(${optionNumber})" type="button">Preview</button>
        </div>

        <div class="input-group mb-3">
          <span class="input-group-text option-value-label">Value</span>
          <input type="text" class="form-control option-value" data-option-id="${optionNumber}" onchange="saveBracket()" value="${value}" placeholder="Option Value" aria-label="Option Value" />
        </div>

      </div>
    </div>`
  );
} //addOption

function deleteOption(id) {
  id = parseInt(id, 10);
  let bracketID = parseInt(elements.bracketTitle.dataset.bracketId, 10);
  let bracketIndex = BRACKETS.brackets.findIndex((e) => e.id === bracketID);
  BRACKETS.brackets[bracketIndex].options.splice(id - 1, 1);

  editBracket(bracketID);
  saveBracket();
} //deleteOption

function previewOption(id) {
  id = parseInt(id, 10);
  let optionNames = document.querySelectorAll(".option-name");
  let optionTypes = document.querySelectorAll(".option-type");
  let optionValues = document.querySelectorAll(".option-value");
  let name = Array.from(optionNames).find((e) => e.dataset.optionId == id);
  let type = Array.from(optionTypes).find((e) => e.dataset.optionId == id);
  let option = Array.from(optionValues).find((e) => e.dataset.optionId == id);

  if (type.value == "text") {
    elements.previewModalBody.innerHTML = `
    <div class="card">
    <div class="card-body">${option?.value || `<span class="text-body-secondary">Empty option</span>`}</div>
    </div>`;
    previewModal.show();
  } //text

  if (type.value == "image") {
    let image = option?.value.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) || null;
    if (!image) {
      showToast("Invalid image URL", "warning", 3000);
      return;
    }
    elements.previewModalBody.innerHTML = `
    <div class="card">
    <div class="card-body">
    <img src="https://proxy.pepega.workers.dev/?url=${encodeURI(image)}" alt="${name.value}" title="${name.value}" class="option-image">
    </div>
    </div>`;
    previewModal.show();
  } //image

  if (type.value == "youtube") {
    let regex = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
    let videoID = regex.exec(option?.value) || null;
    if (!videoID) {
      showToast("Invalid YouTube URL", "warning", 3000);
      return;
    }
    videoID = videoID[3];
    elements.previewModalBody.innerHTML = `
    <div class="card">
    <div class="card-body">
    <iframe 
    id="ytplayer" 
    type="text/html" 
    width="100%" height="480" 
    src="https://www.youtube.com/embed/${videoID}?autoplay=1&origin=https://chat.vote" 
    frameborder="0">
    </iframe>
    </div>
    </div>`;
    previewModal.show();
  } //youtube

  if (type.value == "twitch") {
    try {
      let clipURL = new URL(option?.value);
      let clipID =
        clipURL.hostname === "clips.twitch.tv"
          ? /^\/(\w+(?:\/[A-Z]\w+)?(?:[\-\w]*))(?:\/|$)/.exec(clipURL.pathname)
          : /^\/\w+\/clip\/(\w+(?:\/[A-Z]\w+)?(?:[\-\w]*))(?:\/|$)/.exec(clipURL.pathname);

      if (!clipID[1]) {
        showToast("Invalid Twitch clip URL", "warning", 3000);
        return;
      }

      elements.previewModalBody.innerHTML = `
      <div class="card">
      <div class="card-body">
      <iframe 
      src="https://clips.twitch.tv/embed?clip=${clipID[1]}&parent=chat.vote&autoplay=true" 
      height="480" 
      width="100%" 
      preload="auto" 
      >
      </iframe>
      </div>
      </div>`;
      previewModal.show();
    } catch (error) {
      showToast("Invalid Twitch clip URL", "warning", 3000);
      return;
    }
  } //twitch

  if (type.value == "spotify") {
    try {
      let id = option?.value.match(spotifyURLRegex);
      if (!id[2] || id[1] !== "track") {
        showToast("Invalid Spotify track URL", "warning", 3000);
        return;
      }
      elements.previewModalBody.innerHTML = `
      <div class="card">
      <div class="card-body">
      <iframe 
      style="border-radius:12px" src="https://open.spotify.com/embed/track/${id[2]}${darkTheme ? "?theme=0" : ""}" 
      width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture">
      </iframe>
      </div>
      </div>`;
      previewModal.show();
    } catch (error) {
      showToast("Invalid Spotify track URL", "warning", 3000);
      return;
    }
  } //spotify
} //previewOption

function createBracket(imported = false) {
  let maxID = 0;
  if (BRACKETS?.brackets?.length !== 0) {
    maxID = BRACKETS.brackets.reduce((prev, current) => (prev.id > current.id ? prev : current)).id;
  }
  BRACKETS.brackets.push({
    id: ++maxID,
    title: "",
    description: "",
    options: [],
    imported: imported,
    time: Date.now(),
  });

  editBracket(maxID);
  saveBracket();
} //createBracket

function saveBracket() {
  let id = parseInt(elements.bracketTitle.dataset.bracketId, 10);
  let bracket = BRACKETS.brackets.find((x) => x.id === id);

  bracket.title = elements.bracketTitle.value || "Untitled bracket";
  bracket.description = elements.bracketDescription.value || "No description";

  let optionNames = document.querySelectorAll(".option-name");
  let optionTypes = document.querySelectorAll(".option-type");
  let optionValues = document.querySelectorAll(".option-value");

  bracket.options = [];

  for (let index = 0; index < optionNames.length; index++) {
    bracket.options.push({
      name: optionNames[index].value,
      type: optionTypes[index].value,
      value: optionValues[index].value,
    });
  }

  loadBrackets();
  saveSettings();
} //saveBracket

let startID;
function showStartModal(id) {
  startID = id;
  startModal.show();
}

function startBracket() {
  let id = parseInt(startID, 10);
  let bracket = structuredClone(BRACKETS.brackets.find((x) => x.id === id));
  if (bracket.options.length < 2) {
    showToast("Bracket must have 2 options at least", "warning", 3000);
    return;
  }

  let limit = parseInt(elements.optionLimit.value, 10) || 0;
  if (limit > 0) {
    while (bracket.options.length > limit) {
      bracket.options.splice(Math.floor(Math.random() * bracket.options.length), 1);
    }
  }

  let numberOfRounds = Math.ceil(Math.log2(bracket.options.length));
  let numberOfOptions = bracket.options.length;

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

  elements.brackets_editor.style.display = "none";
  elements.main.style.display = "";
  elements.title.innerHTML = bracket.title;
  elements.endTitle.innerHTML = `<h1 class="display-6">Winner of ${bracket.title}</h1>`;
  elements.pickWinner.innerHTML = `<i class="material-icons notranslate">navigate_next</i>Next match`;

  console.log(currentBracket);

  currentRound = 1;
  currentOption = 0;
  currentScores = { left: 0, right: 0 };
  currentCommand = { left: "a", right: "b" };
  nextMatch();
  changeSiteLinkTarget("_blank");
} //startBracket

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
    showWinner(currentBracket[`round${currentRound}`]);
    return;
  }

  //change next match button text for final match
  if (Object.keys(currentBracket).length - 1 == currentRound) {
    elements.pickWinner.innerHTML = `<i class="material-icons notranslate">emoji_events</i>Show winner`;
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

  showOption("left", left);
  showOption("right", right);

  for (let element of document.getElementsByClassName("streamer-vote")) {
    element.style.display = "";
  }

  vote_results = { left: 0, right: 0 };
  voters = [];
  updateScores();

  if (!elements.keepVotingEnabled.checked) {
    disableVoteButton();
  }

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
      translateY: ["-100%", 0],
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

function streamerVote(position) {
  vote_results[position]++;
  voters.push(USER.userID);
  updateScores();
  for (let element of document.getElementsByClassName("streamer-vote")) {
    element.style.display = "none";
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
  promoteOption(winner, position);
} //pickWinner

function restartMatch() {
  vote_results = { left: 0, right: 0 };
  voters = [];
  updateScores();
  for (let element of document.getElementsByClassName("streamer-vote")) {
    element.style.display = "";
  }
} //restartMatch

function promoteOption(option, position = null) {
  let index = currentBracket[`round${currentRound + 1}`].findIndex((e) => e === undefined);
  currentBracket[`round${currentRound + 1}`][index] = option;

  if (position && !elements.disableAnimations.checked) {
    //title
    anime({
      targets: `#centerTitle`,
      translateY: `2000px`,
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

let left_player, right_player;
function showOption(position, option) {
  elements[`${position}_name`].innerHTML = option.name || `<span class="text-body-secondary">Untitled option</span>`;

  if (option.type == "text") {
    elements[`${position}_value`].innerHTML = option.value || `<span class="text-body-secondary">Empty option</span>`;
  } //text

  if (option.type == "image") {
    let image = option?.value.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) || null;
    if (!image) {
      elements[`${position}_value`].innerHTML = `Invalid image URL`;
      return;
    }
    elements[`${position}_value`].innerHTML = `<img src="https://proxy.pepega.workers.dev/?url=${encodeURI(image)}" alt="${option.name}" title="${option.name}" class="option-image">`;
  } //image

  if (option.type == "youtube") {
    let regex = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
    let videoID = regex.exec(option?.value) || null;
    if (!videoID) {
      elements[`${position}_value`].innerHTML = "Invalid YouTube URL";
      return;
    }
    videoID = videoID[3];
    elements[`${position}_value`].innerHTML = `
    <iframe 
    id="${position}_youtube" 
    type="text/html" 
    width="100%" height="480" 
    src="https://www.youtube.com/embed/${videoID}?enablejsapi=1&origin=https://chat.vote" 
    frameborder="0">
    </iframe>`;

    if (position == "left") {
      left_player = new YT.Player("left_youtube", {
        events: {
          onReady: (event) => {
            event.target.playVideo();
          },
          onStateChange: (event) => {},
        },
      });
    } else {
      right_player = new YT.Player("right_youtube", {
        events: {
          onReady: (event) => {},
          onStateChange: (event) => {},
        },
      });
    }
  } //youtube

  if (option.type == "twitch") {
    try {
      let clipURL = new URL(option?.value);
      let clipID =
        clipURL.hostname === "clips.twitch.tv"
          ? /^\/(\w+(?:\/[A-Z]\w+)?(?:[\-\w]*))(?:\/|$)/.exec(clipURL.pathname)
          : /^\/\w+\/clip\/(\w+(?:\/[A-Z]\w+)?(?:[\-\w]*))(?:\/|$)/.exec(clipURL.pathname);
      if (!clipID[1]) {
        elements[`${position}_value`].innerHTML = `Invalid Twitch clip URL`;
        return;
      }
      elements[`${position}_value`].innerHTML = `
      <iframe 
      src="https://clips.twitch.tv/embed?clip=${clipID[1]}&parent=chat.vote&autoplay=${position == "left"}" 
      height="480" 
      width="100%" 
      preload="auto" 
      >
      </iframe>`;
    } catch (error) {
      elements[`${position}_value`].innerHTML = `Invalid Twitch clip URL`;
      return;
    }
  } //twitch

  if (option.type == "spotify") {
    try {
      let id = option?.value.match(spotifyURLRegex);
      if (!id[2] || id[1] !== "track") {
        elements[`${position}_value`].innerHTML = `Invalid Spotify track URL`;
        return;
      }
      elements[`${position}_value`].innerHTML = `
      <iframe 
      style="border-radius:12px" src="https://open.spotify.com/embed/track/${id[2]}${darkTheme ? "?theme=0" : ""}" 
      width="100%" height="352" frameBorder="0" allowfullscreen="" allow="${position == "left" ? "autoplay;" : ""} clipboard-write; encrypted-media; picture-in-picture">
      </iframe>`;
    } catch (error) {
      elements[`${position}_value`].innerHTML = `Invalid Spotify track URL`;
      return;
    }
  } //spotify
} //showOption

function updateScores() {
  if (!scoreHidden) {
    elements.left_score.innerHTML = `${vote_results.left.toLocaleString()} ${vote_results.left == 1 ? "vote" : "votes"}`;
    elements.right_score.innerHTML = `${vote_results.right.toLocaleString()} ${vote_results.right == 1 ? "vote" : "votes"}`;
  } else {
    elements.left_score.innerHTML = `<span class="text-body-secondary">Score hidden</span>`;
    elements.right_score.innerHTML = `<span class="text-body-secondary">Score hidden</span>`;
  }
} //updateScores

function showWinner(winner) {
  showOption("winner", winner[0]);
  elements.left_value.innerHTML = "";
  elements.right_value.innerHTML = "";
  elements.main.style.display = "none";
  elements.end.style.display = "";
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
  voting_enabled = true;
} //enableVoteButton

function disableVoteButton() {
  elements.enableVoting.classList.remove("btn-danger");
  elements.enableVoting.classList.add("btn-success");
  elements.enableVoting.innerText = "Start Voting";
  voting_enabled = false;
} //disableVoteButton

function quitBracket() {
  elements.main.style.display = "none";
  elements.end.style.display = "none";
  elements.brackets_editor.style.display = "";
  elements.left_value.innerHTML = "";
  elements.right_value.innerHTML = "";
  elements.winner_value.innerHTML = "";
  quitBracketModal.hide();
  changeSiteLinkTarget("_self");
} //quitBracket

function editBracket(id) {
  elements.bracketEditor.style.display = "";
  elements.optionContainer.innerHTML = "";
  id = parseInt(id, 10);
  let bracket = BRACKETS.brackets.find((x) => x.id === id);
  if (bracket) {
    elements.bracketTitle.value = bracket.title;
    elements.bracketTitle.dataset.bracketId = id;
    elements.bracketDescription.value = bracket.description;
  }

  elements.bracketEditorHeader.innerHTML = `ID${id}`;

  for (let index = 0; index < bracket.options.length; index++) {
    addOption(bracket.options[index].name, bracket.options[index].type, bracket.options[index].value);
  }
} //editBracket

function deleteBracket(id) {
  id = parseInt(id, 10);
  let bracket = BRACKETS.brackets.find((x) => x.id === id);
  elements.deleteBracketModalBody.innerHTML = `Delete "${bracket.title}"?`;
  elements.deleteBracketButton.dataset.bracketId = id;
  deleteBracketModal.show();
} //deleteBracket

function loadBrackets() {
  if (!BRACKETS?.brackets?.length) {
    elements.myBrackets.innerHTML = `<span class="text-body-secondary">Nothing here</span>`;
    return;
  }

  let html = ``;

  for (let index = BRACKETS.brackets.length - 1; index >= 0; index--) {
    html += `<div class="card mb-3">
    <div class="card-header">
      ${BRACKETS.brackets[index].title || "Untitled bracket"}
      <div class="btn-group btn-group-sm float-end" role="group" aria-label="bracket controls">
        <button type="button" class="btn btn-success"
         data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Start bracket" onclick="showStartModal(${BRACKETS.brackets[index].id})">
          <i class="material-icons notranslate">play_arrow</i>
        </button>
        <button type="button" class="btn btn-secondary" ${BRACKETS.brackets[index]?.imported ? `style="display: none"` : ""}
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
      <p class="card-text">${BRACKETS.brackets[index].options.map((e) => `${icons[e.type]} ${e.name}`).join(" • ") || "No options"}</p>
    </div>
  </div>`;
  }
  elements.myBrackets.innerHTML = html;
  enableTooltips();
} //loadBrackets

function closeEditor() {
  saveBracket();
  elements.bracketEditor.style.display = "none";
} //closeEditor

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
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      redirect: "follow",
    };
    let response = await fetch(`https://brackets.pepega.workers.dev/spotifyplaylist?id=${playlist[2]}`, requestOptions);
    let result = await response.json();
    let tracks = [...result[0].tracks.items];
    for (let index = 1; index < result.length; index++) {
      tracks.push(...result[index].items);
    }
    previewedBracketTitle = result[0].name || "Untitled playlist";
    previewedBracketDescription = `${result[0].description || "No description"} - Generated from ${elements.spotifyPlaylistLink.value}`;
    previewedBracket = [];
    let html = `<ul class="list-group">`;
    for (let index = 0; index < tracks.length; index++) {
      previewedBracket.push({
        name: `${tracks[index].track.name} - ${tracks[index].track.artists.map((a) => a.name).join(", ")}`,
        type: "spotify",
        value: tracks[index].track.external_urls.spotify,
      });
      html += `
      <li class="list-group-item">
      <a target="_blank" rel="noopener noreferrer" href="${tracks[index].track.preview_url}">${tracks[index].track.name} - ${tracks[index].track.artists.map((a) => a.name).join(", ")}</a>
      </li>`;
    }
    html += `</ul>`;
    elements.spotifyPlaylistPreview.innerHTML = `<p>${result[0].name || "Untitled playlist"} - ${result[0].description || "No description"} - ${
      tracks.length == 0 ? "Playlist has no tracks" : `${tracks.length} ${tracks.length == 1 ? "track" : "tracks"}`
    } </p>${html}`;
  } catch (error) {
    console.log(error);
    showToast("Could not load playlist", "warning", 3000);
    return;
  }
} //previewSpotifyPlaylist

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
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      redirect: "follow",
    };
    let response = await fetch(`https://helper.pepega.workers.dev/twitch/clips?broadcaster_id=${id}`, requestOptions);
    let result = await response.json();
    let clips = result.data;
    if (clips == 0) {
      showToast("Could not load clips", "warning", 3000);
      return;
    }

    previewedBracketTitle = `Top ${channel} clips`;
    previewedBracketDescription = `Bracket with 100 ${channel} clips`;
    previewedBracket = [];
    let html = `<ul class="list-group">`;
    for (let index = 0; index < clips.length; index++) {
      previewedBracket.push({
        name: clips[index].title,
        type: "twitch",
        value: clips[index].url,
      });
      html += `
      <li class="list-group-item">
      <a target="_blank" rel="noopener noreferrer" href="${clips[index].url}">
      ${clips[index].title} - ${clips[index].view_count.toLocaleString()} ${clips[index].view_count == 1 ? "view" : "views"}
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
    for (let index = 0; index < emotes.length; index++) {
      previewedBracket.push({
        name: emotes[index].name,
        type: "image",
        value: emotes[index].url,
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
    showToast("No bracket provided", "warning", 3000);
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
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      redirect: "follow",
    };
    let response = await fetch(`https://brackets.pepega.workers.dev/uwufufu?id=${id}`, requestOptions);
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
        <a target="_blank" rel="noopener noreferrer" href="https://proxy.pepega.workers.dev/?url=${encodeURI(previewedBracket[index].value)}">
        ${previewedBracket[index].name || "Untitled option"}
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
    console.log(videos);
    previewedBracketTitle = `Top ${channel} videos`;
    let numberOfVideos = 0;
    previewedBracket = [];
    let html = `<ul class="list-group">`;
    for (let index = 0; index < videos.length; index++) {
      if (videos[index].snippet?.liveBroadcastContent == "upcoming" || videos[index].snippet?.id?.kind == "youtube#channel") {
        continue;
      }
      numberOfVideos++;
      previewedBracket.push({
        name: videos[index].snippet.title,
        type: "youtube",
        value: `https://www.youtube.com/watch?v=${videos[index].id.videoId}`,
      });
      html += `
      <li class="list-group-item">
      <a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=${videos[index].id.videoId}">
      ${videos[index].snippet.title}
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
    for (let index = 0; index < videos.length; index++) {
      previewedBracket.push({
        name: videos[index].snippet.title,
        type: "youtube",
        value: `https://www.youtube.com/watch?v=${videos[index].snippet.resourceId.videoId}`,
      });
      html += `
      <li class="list-group-item">
      <a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=${videos[index].snippet.resourceId.videoId}">
      ${videos[index].snippet.title}
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
    showToast("You must preview the bracket first", "warning", 3000);
    return;
  }
  createBracket(true);
  elements.bracketTitle.value = previewedBracketTitle;
  elements.bracketDescription.value = previewedBracketDescription;
  for (let index = 0; index < previewedBracket.length; index++) {
    addOption(previewedBracket[index].name, previewedBracket[index].type, previewedBracket[index].value);
  }

  saveBracket();
  generateModal.hide();
} //generateBracket

async function importApproved(id) {
  let bracket = approvedBrackets.find((e) => e.id === id);
  createBracket(true);
  elements.bracketTitle.value = bracket.bracket.title;
  elements.bracketDescription.value = `${bracket.bracket.description} - Bracket by @${bracket.username} - bracket ID: ${bracket.id}`;
  for (let index = 0; index < bracket.bracket.options.length; index++) {
    addOption(bracket.bracket.options[index].name, bracket.bracket.options[index].type, bracket.bracket.options[index].value);
  }
  saveBracket();
  browseModal.hide();
} //importApproved

async function publishBracket(id, e) {
  e.innerHTML = `<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>`;
  id = parseInt(id, 10);
  let bracket = BRACKETS.brackets.find((x) => x.id === id);
  let body = JSON.stringify({
    userid: USER.userID,
    username: USER.channel,
    access_token: USER.access_token,
    time: new Date(),
    bracket: bracket,
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
    let response = await fetch(`https://brackets.pepega.workers.dev/publish`, requestOptions);
    let result = await response.json();
    showToast(result.message, "info", 3000);
    e.innerHTML = `<i class="material-icons notranslate">cloud_upload</i>`;
  } catch (error) {
    showToast("Could not publish bracket", "danger", 3000);
    e.innerHTML = `<i class="material-icons notranslate">cloud_upload</i>`;
    console.log("publishBracket error", error);
  }
} //publishBracket

let approvedBrackets;
async function loadApproved() {
  elements.browseModalBody.innerHTML = spinner;
  browseModal.show();

  let requestOptions = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    redirect: "follow",
  };
  try {
    let response = await fetch(`https://brackets.pepega.workers.dev/approved`, requestOptions);
    let result = await response.json();
    approvedBrackets = result;
    console.log(result);
    let html = "";
    if (result.length == 0) {
      html = "Could not find any brackets :(";
    }
    for (let index = 0; index < result.length; index++) {
      html += `
      <div class="card mb-5">
      <div class="card-header">${result[index].bracket.title} <span class="text-body-secondary">by @${result[index].username}</span></div>
      <div class="card-body">
      <p class="card-text">${result[index].bracket.description}</p>
      Options(${result[index].bracket.options.length}):
      <ul class="list-group" style="height: 200px; overflow: auto">`;
      for (let index2 = 0; index2 < result[index].bracket.options.length; index2++) {
        html += `<li class="list-group-item">${result[index].bracket.options[index2].name} - ${result[index].bracket.options[index2].value}</li>`;
      }
      html += `
      </ul>
      <button type="button" class="btn btn-success float-end mt-3 me-2" onclick="importApproved('${result[index].id}')">
      <i class="material-icons notranslate">cloud_download</i> Import
      </button>
      </div>
      </div>`;
    }
    elements.browseModalBody.innerHTML = html;
    linkifyElementID("browseModalBody");
  } catch (error) {
    elements.browseModalBody.innerHTML = "Could not load brackets :(";
    console.log("loadApproved error", error);
  }
} //loadApproved

function zoomCard(id) {
  elements[id].classList.toggle(`zoomed`);
  elements[`${id}_zoom_icon`].innerHTML = elements[id].classList.contains(`zoomed`) ? "zoom_out" : "zoom_in";
  if (elements[id].classList.contains(`zoomed`)) {
    anime({
      targets: `#${id}`,
      translateX: `${id == "left_card" ? "+=50%" : "-=50%"}`,
      scale: "+=0.6",
    });
  } else {
    anime({
      targets: `#${id}`,
      translateX: `${id == "left_card" ? "-=50%" : "+=50%"}`,
      scale: "-=0.6",
    });
  }
} //zoomCard

let scoreHidden = false;
function hideScore() {
  scoreHidden = !scoreHidden;
  elements.hideScoreIcon.innerHTML = scoreHidden ? "visibility_off" : "visibility";

  if (scoreHidden) {
    updateScores();
  } else {
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
} //hideScore

async function getYTPlaylist(id) {
  let parts = [];
  parts.push(await getYTPlaylistPart(id));
  while (parts[parts.length - 1].nextPageToken) {
    parts.push(await getYTPlaylistPart(id, parts[parts.length - 1].nextPageToken));
  }
  return parts;
} //getYTPlaylist

async function getYTChannelVideos(id, length = 1) {
  let parts = [];
  parts.push(await getYTChannelVideosPart(id));
  for (let index = 1; index < length; index++) {
    console.log("asd");
    parts.push(await getYTChannelVideosPart(id, parts[parts.length - 1].nextPageToken));
  }

  return parts;
} //getYTChannelVideos

const API_KEY_YT = "AIzaSyAMCaIslOwxlmotLsNN4NB2ia949h4GLP0";
async function getYTPlaylistPart(id, nextPageToken = null) {
  let requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  try {
    let response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&key=${API_KEY_YT}&playlistId=${encodeURIComponent(id)}${
        nextPageToken ? `&pageToken=${nextPageToken}` : ""
      }`,
      requestOptions
    );
    let result = await response.json();
    return result;
  } catch (error) {
    console.log("getYTPlaylistPart error", error);
    return false;
  }
} //getYTPlaylistPart

async function getYTPlaylistInfo(id) {
  let requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  try {
    let response = await fetch(`https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&maxResults=50&key=${API_KEY_YT}&id=${encodeURIComponent(id)}`, requestOptions);
    let result = await response.json();
    return result;
  } catch (error) {
    console.log("getYTPlaylistInfo error", error);
    return false;
  }
} //getYTPlaylistInfo

async function getYTChannelVideosPart(id, nextPageToken = null) {
  let requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  try {
    let response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&order=viewCount&safeSearch=none&type=video&videoEmbeddable=true&key=${API_KEY_YT}&channelId=${encodeURIComponent(
        id
      )}${nextPageToken ? `&pageToken=${nextPageToken}` : ""}`,
      requestOptions
    );
    let result = await response.json();
    return result;
  } catch (error) {
    console.log("getYTChannelVideosPart error", error);
    return false;
  }
} //getYTChannelVideosPart

async function getYTChannelID(handle) {
  let requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  try {
    let response = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(handle)}&type=channel&maxResults=1&key=${API_KEY_YT}`, requestOptions);
    let result = await response.json();
    return result;
  } catch (error) {
    console.log("getYTChannelID error", error);
    return false;
  }
} //getYTChannelID

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
        scale: "-=0.6",
      });
    }
    if (!elements.right_card.contains(event.target) && elements.right_card.classList.contains(`zoomed`)) {
      elements.right_card.classList.remove("zoomed");
      elements.right_card_zoom_icon.innerHTML = "zoom_in";
      anime({
        targets: `#right_card`,
        translateX: "+=50%",
        scale: "-=0.6",
      });
    }
  });

  votePopover = new bootstrap.Popover(elements.enableVoting);

  loginExpiredModal = new bootstrap.Modal(elements.loginExpiredModal);
  deleteBracketModal = new bootstrap.Modal(elements.deleteBracketModal);
  quitBracketModal = new bootstrap.Modal(elements.quitBracketModal);
  previewModal = new bootstrap.Modal(elements.previewModal);
  generateModal = new bootstrap.Modal(elements.generateModal);
  browseModal = new bootstrap.Modal(elements.browseModal);
  startModal = new bootstrap.Modal(elements.startModal);

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

  elements.hideScore.addEventListener("click", function () {
    const tooltip = bootstrap.Tooltip.getInstance("#hideScore");
    tooltip.setContent({ ".tooltip-inner": scoreHidden ? "Hide score" : "Show score" });
    hideScore();
  });

  elements.connectbtn.addEventListener("click", function () {
    connect();
  });

  elements.loginExpiredRenew.addEventListener("click", function () {
    login();
  });

  elements.loginButton.addEventListener("click", function () {
    login();
  });

  elements.loginExpiredReset.addEventListener("click", function () {
    resetSettings();
  });

  elements.createBracket.addEventListener("click", function () {
    createBracket();
    enableTooltips();
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

  elements.browseBracket.addEventListener("click", function () {});

  elements.addOption.addEventListener("click", function () {
    addOption();
    saveBracket();
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

  elements.bracketTitle.addEventListener("change", function () {
    saveBracket();
  });
  elements.bracketDescription.addEventListener("change", function () {
    saveBracket();
  });

  let tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  let firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}; //onload

function onYouTubeIframeAPIReady() {
  elements.left_value.addEventListener("mouseover", (event) => {
    try {
      if (left_player.getPlayerState() >= 1 && right_player.getPlayerState() >= 1) {
        right_player.mute();
        left_player.unMute();
      }
    } catch (error) {}
  });
  elements.right_value.addEventListener("mouseover", (event) => {
    try {
      if (left_player.getPlayerState() >= 1 && right_player.getPlayerState() >= 1) {
        left_player.mute();
        right_player.unMute();
      }
    } catch (error) {}
  });
} //onYouTubeIframeAPIReady

window.onSpotifyIframeApiReady = (IFrameAPI) => {
  console.log("onSpotifyIframeApiReady");
};
