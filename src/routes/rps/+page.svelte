<script>
  import { onMount } from "svelte";

  onMount(async () => {
    loginExpiredModal = new bootstrap.Modal(elements.loginExpiredModal);
    copyLinkButton = new bootstrap.Popover(elements.copyLinkButton);

    loadAndConnect();

    randomAnimations();
  });

  let elements = {
    loginButton: document.getElementById("loginButton"),
    topRight: document.getElementById("topRight"),
    darkTheme: document.getElementById("darkTheme"),
    loginExpiredModal: document.getElementById("loginExpiredModal"),
    left_rock: document.getElementById("left_rock"),
    left_paper: document.getElementById("left_paper"),
    left_scissors: document.getElementById("left_scissors"),
    right_rock: document.getElementById("right_rock"),
    right_paper: document.getElementById("right_paper"),
    right_scissors: document.getElementById("right_scissors"),
    gameLink: document.getElementById("gameLink"),
    copyLinkButton: document.getElementById("copyLinkButton"),
    bracket: document.getElementById("bracket"),
    start: document.getElementById("start"),
    next: document.getElementById("next"),
  };

  const { animate } = anime;

  let darkTheme = true;
  let loginExpiredModal;
  let copyLinkButton;
  let webSocket;

  let USER = {
    channel: "",
    twitchLogin: false,
    access_token: "",
    userID: "",
    platform: "",
  };

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

  function logout() {
    elements.topRight.innerHTML = `<a role="button" id="loginButton" onclick="login()" class="btn btn-twitch" tabindex="0"> <span class="twitch-icon"></span>Sign in with Twitch </a>`;
    resetSettings(true);
  } //logout

  async function loadPFP() {
    if (!USER.channel) {
      elements.topRight.innerHTML = `<a role="button" id="loginButton" onclick="login()" class="btn btn-twitch" tabindex="0"> <span class="twitch-icon"></span>Sign in with Twitch </a>`;
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
    }
    location.reload();
    return false;
  } //resetSettings

  async function refreshData() {
    darkTheme = elements.darkTheme.checked ?? true;
  } //refreshData

  function saveSettings() {
    refreshData();
    localStorage.setItem("darkTheme", darkTheme);
    localStorage.setItem("USER", JSON.stringify(USER));
  } //saveSettings

  function load_localStorage() {
    if (!localStorage.getItem("USER")) {
      console.log("localStorage user info not found");
    } else {
      USER = JSON.parse(localStorage.getItem("USER"));
    }
  } //load_localStorage

  function connect() {
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
    saveSettings();
    loadBadges(USER.channel);
    loadPFP();
    sendUsername(`chat.vote/rps`, USER.channel, USER.platform == "twitch" ? `twitch - ${USER.twitchLogin}` : "youtube");

    //webSocket = new WebSocket("ws://localhost:9001");
    webSocket = new WebSocket("wss://ws.chat.vote");

    webSocket.onopen = function (event) {
      console.log(event);
      if (event.type == "open") {
        showToast("Connected to server", "success", 1000);
      }
    };

    webSocket.onmessage = function (event) {
      let data = JSON.parse(event.data);

      switch (data.id) {
        case "toast":
          showToast(data.message, data.type, 2000);
          break;
        case "start":
          //sent when the game starts/resets after clicking the start new game button
          showToast(data.message, data.type, 2000);
          resetBracket();
          break;

        case "update":
          //sent when a viewer joins
          addUser(data.username);
          break;

        case "update_move":
          //sent when a viewer sends their move
          updateUser(data.username);
          break;

        case "first_round":
          //sent after clicking next round for the first time after clicking start new game
          showToast(data.message, data.type, 2000);
          createBracket(data.bracket);
          break;

        case "next_round":
          showToast(data.message, data.type, 2000);

          break;

        case "game_over":
          showToast(data.message, data.type, 2000);

          break;

        default:
          break;
      }

      console.log(event);
    };

    webSocket.onclose = function (event) {
      if (event.type == "close") {
        showToast("disconnected from server", "danger", 2000);
      }
      console.log(event);
    };

    webSocket.onerror = function (error) {
      console.log(error);
    };
  } //connect

  function start() {
    elements.start.disabled = true;
    setTimeout(() => {
      elements.start.disabled = false;
    }, 2000);
    webSocket.send(JSON.stringify({ command: "start", username: USER.channel, userid: USER.userID, access_token: USER.access_token }));
  } //start

  function next() {
    elements.next.disabled = true;
    setTimeout(() => {
      elements.next.disabled = false;
    }, 2000);
    webSocket.send(JSON.stringify({ command: "next", username: USER.channel, userid: USER.userID, access_token: USER.access_token }));
  } //next

  function resetBracket() {
    elements.bracket.innerHTML = `
  <div class="card">
    <div class="card-header">Players</div>
    <div class="card-body" id="players"></div>
  </div>`;
  } //resetBracket

  function addUser(username) {
    document.getElementById("players").insertAdjacentHTML("afterbegin", `<span class="badge text-bg-secondary m-2" id="${username}_badge">⏳${escapeString(username)}</span>`);
  } //addUser

  function updateUser(username) {
    document.getElementById(`${username}_badge`).innerHTML = `✔${escapeString(username)}`;
  } //addUser

  function createBracket(bracket) {
    for (let index = 0; index < Object.keys(bracket).length; index++) {
      let roundName = "";
      switch (bracket[`round${index}`].length) {
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
      elements.bracket.insertAdjacentHTML(
        "beforeend",
        `<div class="card">
      <div class="card-header">${roundName}</div>
      <div class="card-body" id="round${index}"></div>
      </div>`,
      );
    }
  } //createBracket

  async function loadAndConnect() {
    load_localStorage();
    refreshData();
    if (USER.twitchLogin && !(await checkToken(USER.access_token))) {
      USER.channel = "";
      loginExpiredModal.show();
      return;
    }
    if (USER.twitchLogin === false && USER.channel) {
      resetSettings(true);
      return;
    }
    if (USER.channel) {
      connect();
      elements.gameLink.value = `https://chat.vote/rps/play#${USER.channel || ""}`;
    }
  } //loadAndConnect

  function animateHand(hand, move) {
    elements[`${hand}_rock`].style.display = "";
    elements[`${hand}_paper`].style.display = "none";
    elements[`${hand}_scissors`].style.display = "none";

    animate(`#${hand}_rock`, {
      rotate: hand == "left" ? -30 : 30,
      duration: 300,
      alternate: true,
      ease: "outElastic(1, .8)",
      loop: 7,
      onComplete: function (anim) {
        elements[`${hand}_rock`].style.display = "none";
        elements[`${hand}_${move}`].style.display = "";
      },
    });
  } //animateHand

  function randomAnimations() {
    let moves = ["rock", "paper", "scissors"];

    elements[`left_rock`].style.display = "";
    elements[`left_paper`].style.display = "none";
    elements[`left_scissors`].style.display = "none";
    elements[`right_rock`].style.display = "";
    elements[`right_paper`].style.display = "none";
    elements[`right_scissors`].style.display = "none";

    animateHand("left", moves[Math.floor(Math.random() * moves.length)]);
    animateHand("right", moves[Math.floor(Math.random() * moves.length)]);
  } //randomAnimations

  let randomAnimationsInterval = setInterval(() => {
    randomAnimations();
  }, 4500);

  function copyLink() {
    navigator.clipboard.writeText(`https://chat.vote/rps/play#${USER.channel || ""}`);
    copyLinkButton.show();
    setTimeout(() => {
      copyLinkButton.hide();
    }, 1000);
  } //copyLink
</script>

<svelte:head>
  <title>Rock Paper Scissors | chat.vote</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="Interactive Rock Paper Scissors game that you can play with your twitch chat :)" />
  <meta name="keywords" content="twitch, chat, poll, chatvote, chat.vote" />
  <meta property="og:title" content="chat.vote" />
  <meta property="og:site_name" content="chat.vote" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chat.vote/rps" />
  <meta property="og:image" content="https://chat.vote/pics/ogimage.png" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:description" content="Interactive Rock Paper Scissors game that you can play with your twitch chat :)" />
</svelte:head>

<div class="sticky-top p-3">
  <nav class="navbar bg-body-secondary rounded-pill">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img src="/pics/donk.png" alt="logo" style="height: 24px; width: 24px; margin-bottom: 5px" class="d-inline-block" /> chat.vote Rock Paper Scissors
      </a>

      <div id="topRight">
        <a role="button" id="loginButton" onclick="login()" class="btn btn-twitch" tabindex="0"> <span class="twitch-icon"></span>Sign in with Twitch </a>
      </div>

      <div id="theme-label-container">
        <label id="theme-label">
          <input id="darkTheme" type="checkbox" checked />
          <div class="planet"></div>
          <div class="theme-elements">
            <svg version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
              <circle cx="250" cy="250" r="200" />
            </svg>
            <svg version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
              <circle cx="250" cy="250" r="200" />
            </svg>
            <svg version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
              <circle cx="250" cy="250" r="200" />
            </svg>
            <svg version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
              <circle cx="250" cy="250" r="200" />
            </svg>
            <svg version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
              <circle cx="250" cy="250" r="200" />
            </svg>
            <svg version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
              <circle cx="250" cy="250" r="200" />
            </svg>
            <svg version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
              <circle cx="250" cy="250" r="200" />
            </svg>
            <svg version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
              <circle cx="250" cy="250" r="200" />
            </svg>
          </div>
        </label>
      </div>
    </div>
  </nav>
</div>

<div class="text-center">
  not working yet <img src="https://cdn.betterttv.net/emote/54fa8f1401e468494b85b537/1x" /> submitting now so that I can finish it before stream/judging starts
  <img src="https://cdn.7tv.app/emote/6154ecd36251d7e000db18a0/1x.webp" />
</div>

<div class="container-fluid text-center">
  <div class="row">
    <div class="col">
      <div class="container-fluid text-center">
        <div class="row">
          <div class="col d-inline-flex">
            <div class="p-2">
              <img src="/pics/donk.png" alt="left donk" style="height: 100px; width: 100px" />
              <img id="left_rock" src="/rps/left_rock.png" alt="left rock" class="left-hand-img" />
              <img id="left_paper" src="/rps/left_paper.png" alt="left paper" style="display: none" class="left-hand-img" />
              <img id="left_scissors" src="/rps/left_scissors.png" alt="left scissors" style="display: none" class="left-hand-img" />
            </div>
            <div class="p-2">
              <img id="right_rock" src="/rps/right_rock.png" alt="right rock" class="right-hand-img" />
              <img id="right_paper" src="/rps/right_paper.png" alt="right paper" style="display: none" class="right-hand-img" />
              <img id="right_scissors" src="/rps/right_scissors.png" alt="right scissors" style="display: none" class="right-hand-img" />
              <img src="/pics/donk.png" alt="right donk" style="height: 100px; width: 100px" class="mirror-img" />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col" id="bracket"></div>
        </div>
      </div>
    </div>
    <div class="col-4">
      <div class="card w-75 mb-5">
        <div class="card-header"><i class="material-icons notranslate">tune</i>Game controls</div>
        <div class="card-body">
          <button onclick="start()" id="start" type="button" class="btn btn-primary mb-3"><i class="material-icons notranslate">rocket_launch</i>Start new game</button>
          <br />
          <button onclick="next()" id="next" type="button" class="btn btn-info mb-3"><i class="material-icons notranslate">arrow_forward_ios</i>Next round</button>
          <br />
          <div class="input-group">
            <span class="input-group-text">Game link</span>
            <input disabled type="text" class="form-control" id="gameLink" onclick="copyLink()" value="https://chat.vote/rps/play#username" />
            <button
              type="button"
              id="copyLinkButton"
              class="btn btn-outline-secondary"
              data-bs-toggle="popover"
              data-bs-trigger="manual"
              data-bs-placement="top"
              data-bs-content="Link copied :)"
              onclick="copyLink()"
            >
              <i class="material-icons notranslate">content_copy</i>
            </button>
          </div>
        </div>
      </div>

      <div class="card w-75">
        <div class="card-header"><i class="material-icons notranslate">info</i>Info</div>
        <div class="card-body text-start">
          <span class="text-body-secondary">What is this?</span><br />
          This is an interactive Rock Paper Scissors game that you can play with your Twitch chat.<br />
          <span class="text-body-secondary">How to play?</span><br />
          Start a new game then share the link above with your viewers. After your viewers log in start the first round by clicking next round, after everyone makes a move click next round again
          to eliminate the losers and advance the winners to the next round. Game ends once the bracket is finished.
          <br /><br />
          Made for <a href="https://nympts.com/gamejam" target="_blank" rel="noopener noreferrer">NymN's Game Jam</a> &
          <a href="https://twitchstreamertools.devpost.com/" target="_blank" rel="noopener noreferrer">Twitch Streamer Tools Hackathon 2024</a> :)
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  ::-webkit-scrollbar {
    height: 10px;
    width: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--bs-tertiary-color);
    border-radius: 6px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--bs-secondary-color);
  }

  ::-webkit-scrollbar-track {
    background: var(--bs-dark-bg-subtle);
    border-radius: 6px;
  }

  .mirror-img {
    -moz-transform: scale(-1, 1);
    -o-transform: scale(-1, 1);
    -webkit-transform: scale(-1, 1);
    transform: scale(-1, 1);
  }

  .left-hand-img {
    height: 100px;
    width: 100px;
    transform-origin: 0% 100%;
  }

  .right-hand-img {
    height: 100px;
    width: 100px;
    transform-origin: 100% 100%;
  }

  .twitch-icon {
    display: inline-block;
    width: 22px;
    height: 26px;
    background-image: url(/pics/twitch.png);
    margin: 0 5px -8px 0;
  }

  .btn-twitch {
    color: #ffffff;
    background-color: #9933ff !important;
    border-color: #8744aa !important;
  }

  .btn-twitch:active,
  .btn-twitch:focus,
  .btn-twitch:hover {
    color: #ffffff;
    background-color: #8038de !important;
    border-color: #7f40a1 !important;
  }

  /* theme switcher start */

  :root {
    --bg-planet-bright: #f2c94c;
    --bg-planet-shadow: #828894;
    --bg-planet-lightshadow: #d7d7d820;
    --dot-size: 0.25rem;
  }

  #theme-label {
    cursor: pointer;
    padding: 1rem;
    position: relative;
    overflow: hidden;
    /* To make outline on mobile invisible */
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  }

  #darkTheme {
    height: 0;
    width: 0;
    visibility: hidden;
    position: absolute;
  }

  #theme-label .planet {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    overflow: hidden;
    background: radial-gradient(3.75em, 99%, transparent 100%);
    background-color: var(--bg-planet-bright);
    background-repeat: no-repeat;
    position: relative;
    will-change: background;
    transition: all 400ms ease;

    /* Safari transition issue */
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    transform: translate3d(0, 0, 0);
  }

  #theme-label .planet::after {
    content: "";
    background-color: var(--bg-planet-shadow);
    width: 2rem;
    height: 2rem;
    position: absolute;
    border-radius: 50%;
    will-change: opacity, transform, background-color;
    opacity: 0;
    transform: translate(2em, -2em);
    transition:
      opacity 400ms ease,
      transform 400ms ease,
      background-color 400ms ease;
  }

  .theme-elements {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transition: transform 400ms ease;
  }

  .theme-elements svg {
    position: absolute;
    width: 7px;
    height: 7px;
    opacity: 1;
    transition:
      transform 400ms ease,
      opacity 200ms ease,
      width 200ms ease,
      height 200ms ease;
  }

  .theme-elements svg circle {
    fill: var(--bg-planet-bright);
    transition: fill 400ms ease;
  }

  .theme-elements svg:first-child {
    transform: translate(1.8em, 0.35em);
  }

  .theme-elements svg:nth-child(2) {
    transform: translate(2.8em, 0.7em);
  }

  .theme-elements svg:nth-child(3) {
    transform: translate(3.2em, 1.8em);
  }

  .theme-elements svg:nth-child(4) {
    transform: translate(2.8em, 2.8em);
  }

  .theme-elements svg:nth-child(5) {
    transform: translate(1.8em, 3.2em);
  }

  .theme-elements svg:nth-child(6) {
    transform: translate(0.7em, 2.8em);
  }

  .theme-elements svg:nth-child(7) {
    transform: translate(0.35em, 1.8em);
  }

  .theme-elements svg:nth-child(8) {
    transform: translate(0.7em, 0.7em);
  }

  #darkTheme:checked + .planet {
    --bg-planet-bright: #d7d7d8;
  }

  #darkTheme:checked + .planet::after {
    opacity: 1;
    transform: translate(0.6em, -0.5em);
  }

  #darkTheme:checked ~ .theme-elements {
    transform: rotate(180deg);
  }

  #darkTheme:checked ~ .theme-elements svg:first-child {
    transform: translate(2em, 1em);
    opacity: 0;
  }

  #darkTheme:checked ~ .theme-elements svg:nth-child(2) {
    transform: translate(3em, 1.5em);
    opacity: 0;
  }

  #darkTheme:checked ~ .theme-elements svg:nth-child(3) {
    transform: translate(3em, 2em);
    opacity: 0;
  }

  #darkTheme:checked ~ .theme-elements svg:nth-child(4) {
    transform: translate(3em, 2em);
    opacity: 0;
  }

  #darkTheme:checked ~ .theme-elements svg:nth-child(5) {
    transform: translate(1.9em, 2.6em);
    width: 0.3em;
    height: 0.3em;
  }

  #darkTheme:checked ~ .theme-elements svg:nth-child(5) circle {
    fill: var(--bg-planet-lightshadow);
  }

  #darkTheme:checked ~ .theme-elements svg:nth-child(6) {
    transform: translate(1.4em, 2.5em);
    width: 0.3em;
    height: 0.3em;
  }

  #darkTheme:checked ~ .theme-elements svg:nth-child(6) circle {
    fill: var(--bg-planet-lightshadow);
  }

  #darkTheme:checked ~ .theme-elements svg:nth-child(7) {
    transform: translate(1.1em, 1.6em);
    width: 0.7em;
    height: 0.7em;
  }

  #darkTheme:checked ~ .theme-elements svg:nth-child(7) circle {
    fill: var(--bg-planet-lightshadow);
  }

  #darkTheme:checked ~ .theme-elements svg:nth-child(8) {
    width: 0.45em;
    height: 0.45em;
    transform: translate(1.7em, 2.1em);
  }

  #darkTheme:checked ~ .theme-elements svg:nth-child(8) circle {
    fill: var(--bg-planet-lightshadow);
  }

  #theme-label-container {
    margin: -10px -16px -14px -4px;
    scale: 0.7;
  }

  /* theme switcher end */
</style>
