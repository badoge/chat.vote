<script>
  import { onMount } from "svelte";

  import { animate } from "animejs";

  let elements;
  let bootstrap;
  onMount(async () => {
    bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");
    elements = {
      loginButton: document.getElementById("loginButton"),
      me: document.getElementById("me"),
      opponent: document.getElementById("opponent"),
      topRight: document.getElementById("topRight"),
      loginExpiredModal: document.getElementById("loginExpiredModal"),
      left_rock: document.getElementById("left_rock"),
      left_paper: document.getElementById("left_paper"),
      left_scissors: document.getElementById("left_scissors"),
      right_rock: document.getElementById("right_rock"),
      right_paper: document.getElementById("right_paper"),
      right_scissors: document.getElementById("right_scissors"),

      info: document.getElementById("info"),
      game: document.getElementById("game"),
      rock: document.getElementById("rock"),
      paper: document.getElementById("paper"),
      scissors: document.getElementById("scissors"),
    };
    loginExpiredModal = new bootstrap.Modal(elements.loginExpiredModal);

    loadAndConnect();
  });

  let { data } = $props();
  let channel = $state(data.slug.toLowerCase().replace(/\s/g, ""));

  let darkTheme = true;
  let loginExpiredModal;
  let streamer = "";
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
    elements.me.innerHTML = `<img src="${profilepicurl}" alt="profile pic" class="rounded-circle" style="height:2em;"> ${USER.channel}`;
    elements.opponent.innerHTML = `<img src="/pics/donk.png" alt="profile pic" class="rounded-circle" style="height:2em;"> Your opponent`;
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

  async function refreshData() {} //refreshData

  function saveSettings() {
    refreshData();
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
    refreshData();
    loadBadges(streamer);
    loadPFP();

    elements.game.style.display = "";

    //webSocket = new WebSocket("ws://localhost:9001");
    webSocket = new WebSocket("wss://ws.chat.vote");

    webSocket.onopen = function (event) {
      console.log(event);
      webSocket.send(JSON.stringify({ command: "join", streamer: streamer, username: USER.channel, userid: USER.userID, access_token: USER.access_token }));
    };

    webSocket.onmessage = function (event) {
      let data = JSON.parse(event.data);

      switch (data.id) {
        case "toast":
          showToast(data.message, data.type, 2000);
          break;
        case "starting":
          //sent when the game starts/resets after the streamer clicks the start new game button
          showToast(data.message, data.type, 2000);
          resetGame();
          break;

        case "round":
          //sent when the a new round starts
          showToast(data.message, data.type, 2000);
          startRound(data.opponent);
          break;

        case "moved":
          //sent if the move was accepted
          showToast(data.message, data.type, 2000);
          break;

        case "won":
        case "lost":
          //sent if the move was accepted
          showToast(data.message, data.type, 2000);
          showReset();
          break;

        case "game_ended":
          showToast(data.message, data.type, 2000);
          resetGame();
          break;

        default:
          break;
      }

      console.log(event);
    };

    webSocket.onclose = function (event) {
      console.log(event);
    };

    webSocket.onerror = function (error) {
      console.log(error);
    };
  } //connect

  function resetGame() {
    elements.rock.disabled = true;
    elements.paper.disabled = true;
    elements.scissors.disabled = true;
    elements.opponent.innerHTML = `<img src="/pics/donk.png" alt="profile pic" class="rounded-circle" style="height:2em;"> Your opponent`;
  } //resetGame

  function startRound(opponent) {
    elements.rock.disabled = false;
    elements.paper.disabled = false;
    elements.scissors.disabled = false;
    elements.opponent.innerHTML = `<img src="/pics/donk.png" alt="profile pic" class="rounded-circle" style="height:2em;"> ${escapeString(opponent)}`;
  } //startRound

  function sendMove(move) {
    elements.rock.disabled = true;
    elements.paper.disabled = true;
    elements.scissors.disabled = true;
    webSocket.send(JSON.stringify({ command: "move", streamer: streamer, userid: USER.userid, move: move }));
  } //sendMove

  function showReset() {
    elements.rock.disabled = true;
    elements.paper.disabled = true;
    elements.scissors.disabled = true;
  } //showReset

  async function loadAndConnect() {
    load_localStorage();
    refreshData();

    let input = location.hash;
    streamer = input.replace("#", "").toLowerCase().replace(/\s/g, "");

    // if (!streamer) {
    //   elements.info.innerHTML = `<span class="text-warning">No channel provided</span> Get the game link from your streamer.<br>Example: chat.vote/rps/play#forsen`;
    //   elements.info.style.display = "";
    //   return;
    // }

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
    } else {
      elements.info.innerHTML = `<span class="text-warning">Not signed in.</span> Sign in with the button above.`;
      elements.info.style.display = "";
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
        <a role="button" id="loginButton" onclick={login} class="btn btn-twitch" tabindex="0"> <span class="twitch-icon"></span>Sign in with Twitch </a>
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

<div class="container-fluid text-center" id="game" style="display: none">
  <div class="row">
    <div class="col"></div>
    <div class="col-auto d-inline-flex">
      <div class="vstack gap-3">
        <div class="p-2">
          <img src="/pics/donk.png" alt="left donk " style="height: 100px; width: 100px" />
          <img id="left_rock" src="/rps/left_rock.png" alt="left rock" class="left-hand-img" />
          <img id="left_paper" src="/rps/left_paper.png" alt="left paper" style="display: none" class="left-hand-img" />
          <img id="left_scissors" src="/rps/left_scissors.png" alt="left scissors" style="display: none" class="left-hand-img" />
        </div>

        <div class="p-2" id="me"></div>
        <div class="p-2">
          Make your move<br />
          <div class="btn-group" role="group" aria-label="move">
            <button disabled type="button" onclick={() => sendMove("rock")} id="rock" class="btn btn-secondary"><span style="font-size: 2.5rem">✊</span><br />Rock</button>
            <button disabled type="button" onclick={() => sendMove("paper")} id="paper" class="btn btn-light"><span style="font-size: 2.5rem">✋</span><br />Paper</button>
            <button disabled type="button" onclick={() => sendMove("scissors")} id="scissors" class="btn btn-danger"><span style="font-size: 2.5rem">✌</span><br />Scissors</button>
          </div>
        </div>
      </div>

      <div class="vstack gap-3">
        <div class="p-2">
          <img id="right_rock" src="/rps/right_rock.png" alt="right rock" class="right-hand-img" />
          <img id="right_paper" src="/rps/right_paper.png" alt="right paper" style="display: none" class="right-hand-img" />
          <img id="right_scissors" src="/rps/right_scissors.png" alt="right scissors" style="display: none" class="right-hand-img" />
          <img src="/pics/donk.png" alt="right donk" style="height: 100px; width: 100px" class="mirror-img" />
        </div>

        <div class="p-2 text-body-secondary" id="opponent"></div>
        <div class="p-2"></div>
      </div>
    </div>
    <div class="col"></div>
  </div>
</div>

<div class="text-center m-5" id="info" style="display: none"></div>

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
