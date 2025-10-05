<script>
  import Navbar from "$lib/Navbar.svelte";

  import { onMount } from "svelte";
  import { animate } from "animejs";

  import IcBaselineTune from "~icons/ic/baseline-tune";
  import IcBaselineRocketLaunch from "~icons/ic/baseline-rocket-launch";
  import IcBaselineArrowForwardIos from "~icons/ic/baseline-arrow-forward-ios";
  import IcBaselineInfo from "~icons/ic/baseline-info";

  import IcBaselineContentCopy from "~icons/ic/baseline-content-copy";
  import { donkStorage } from "$lib/donkStorage.svelte";

  import { escape } from "validator";

  let USER = donkStorage("USER", null);

  onMount(async () => {
    let randomAnimationsInterval = setInterval(() => {
      randomAnimations();
    }, 4500);
  });

  /**
   * @type {WebSocket}
   */
  let webSocket;

  function connect() {
    //sendUsername(`chat.vote/rps`, USER.channel, USER.platform == "twitch" ? `twitch - ${USER.twitchLogin}` : "youtube");

    //webSocket = new WebSocket("ws://localhost:9001");
    webSocket = new WebSocket("wss://rps.chat.vote");

    webSocket.onopen = function (event) {
      console.log(event);
      if (event.type == "open") {
        //showToast("Connected to server", "success", 1000);
      }
    };

    webSocket.onmessage = function (event) {
      let data = JSON.parse(event.data);

      switch (data.id) {
        case "toast":
          //showToast(data.message, data.type, 2000);
          break;
        case "start":
          //sent when the game starts/resets after clicking the start new game button
          //showToast(data.message, data.type, 2000);
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
          //showToast(data.message, data.type, 2000);
          createBracket(data.bracket);
          break;

        case "next_round":
          //showToast(data.message, data.type, 2000);

          break;

        case "game_over":
          //showToast(data.message, data.type, 2000);

          break;

        default:
          break;
      }

      console.log(event);
    };

    webSocket.onclose = function (event) {
      if (event.type == "close") {
        //showToast("disconnected from server", "danger", 2000);
      }
      console.log(event);
    };

    webSocket.onerror = function (error) {
      console.log(error);
    };
  } //connect

  function start() {
    document.getElementById("start").disabled = true;
    setTimeout(() => {
      document.getElementById("start").disabled = false;
    }, 2000);
    webSocket.send(JSON.stringify({ command: "start", username: USER?.value.channel, userid: USER?.value.userID, access_token: USER?.value.access_token }));
  } //start

  function next() {
    document.getElementById("next").disabled = true;
    setTimeout(() => {
      document.getElementById("next").disabled = false;
    }, 2000);
    webSocket.send(JSON.stringify({ command: "next", username: USER?.value.channel, userid: USER?.value.userID, access_token: USER?.value.access_token }));
  } //next

  function resetBracket() {
    document.getElementById("brackets").innerHTML = `
  <div class="card">
    <div class="card-header">Players</div>
    <div class="card-body" id="players"></div>
  </div>`;
  } //resetBracket

  /**
   * @param {any} username
   */
  function addUser(username) {
    document.getElementById("players")?.insertAdjacentHTML("afterbegin", `<span class="badge text-bg-secondary m-2" id="${username}_badge">⏳${escape(username)}</span>`);
  } //addUser

  /**
   * @param {any} username
   */
  function updateUser(username) {
    //document.getElementById(`${username}_badge`)?.innerHTML = `✔${escape(username)}`;
  } //updateUser

  /**
   * @param {{ [x: string]: string | any[]; }} bracket
   */
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
      document.getElementById("bracket").insertAdjacentHTML(
        "beforeend",
        `<div class="card">
      <div class="card-header">${roundName}</div>
      <div class="card-body" id="round${index}"></div>
      </div>`,
      );
    }
  } //createBracket

  /**
   * @param {string} hand
   * @param {string} move
   */
  function animateHand(hand, move) {
    document.getElementById(`${hand}_rock`).style.display = "";
    document.getElementById(`${hand}_paper`).style.display = "none";
    document.getElementById(`${hand}_scissors`).style.display = "none";

    animate(`#${hand}_rock`, {
      rotate: hand == "left" ? -30 : 30,
      duration: 300,
      alternate: true,
      ease: "outElastic(1, .8)",
      loop: 7,
      onComplete: function (anim) {
        document.getElementById(`${hand}_rock`).style.display = "none";
        document.getElementById(`${hand}_${move}`).style.display = "";
      },
    });
  } //animateHand

  function randomAnimations() {
    let moves = ["rock", "paper", "scissors"];

    document.getElementById("left_rock").style.display = "";
    document.getElementById("left_paper").style.display = "none";
    document.getElementById("left_scissors").style.display = "none";

    document.getElementById("right_rock").style.display = "";
    document.getElementById("right_paper").style.display = "none";
    document.getElementById("right_scissors").style.display = "none";

    animateHand("left", moves[Math.floor(Math.random() * moves.length)]);
    animateHand("right", moves[Math.floor(Math.random() * moves.length)]);
  } //randomAnimations

  function copyLink() {
    navigator.clipboard.writeText(`https://chat.vote/rps/play/${USER?.value.channel || ""}`);
  } //copyLink
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

<Navbar loginEvent={() => USER.refresh()} />

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
        <div class="card-header"><IcBaselineTune /> Game controls</div>
        <div class="card-body">
          <button onclick={start} id="start" type="button" class="btn btn-primary mb-3"><IcBaselineRocketLaunch />Start new game</button>
          <br />
          <button onclick={next} id="next" type="button" class="btn btn-info mb-3"><IcBaselineArrowForwardIos />Next round</button>
          <br />
          <div class="input-group">
            <span class="input-group-text">Game link</span>
            <input disabled type="text" class="form-control" onclick={copyLink} value="https://chat.vote/rps/play/{USER?.value?.channel}" />
            <button type="button" class="btn btn-outline-secondary" onclick={copyLink}>
              <IcBaselineContentCopy />
            </button>
          </div>
        </div>
      </div>

      <div class="card w-75">
        <div class="card-header"><IcBaselineInfo />Info</div>
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
