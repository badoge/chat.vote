<script>
  import { onMount } from "svelte";

  import { animate } from "animejs";
  import pkg from "validator";
  import { donkStorage } from "$lib/donkStorage.svelte.js";
  const { escape } = pkg;
  let elements;

  let USER = donkStorage("USER", null);

  onMount(async () => {
    elements = {
      loginButton: document.getElementById("loginButton"),
      me: document.getElementById("me"),
      opponent: document.getElementById("opponent"),
      topRight: document.getElementById("topRight"),
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
  });

  let { data } = $props();
  let channel = $state(data.slug.toLowerCase().replace(/\s/g, ""));

  let streamer = "";
  let webSocket;

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
    elements.opponent.innerHTML = `<img src="/pics/donk.png" alt="profile pic" class="rounded-circle" style="height:2em;"> ${escape(opponent)}`;
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
  <meta name="description" content="Interactive Rock Paper Scissors game that you can play with your twitch chat :)" />
  <meta property="og:title" content="Rock Paper Scissors | chat.vote" />
  <meta property="og:site_name" content="chat.vote" />
  <meta property="og:url" content="https://chat.vote/rps" />
  <meta property="og:image" content="https://chat.vote/pics/ogimage.png" />
  <meta property="og:description" content="Interactive Rock Paper Scissors game that you can play with your twitch chat :)" />
</svelte:head>

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
</style>
