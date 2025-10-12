<script>
  import Navbar from "$lib/Navbar.svelte";

  import { onMount } from "svelte";
  import { animate } from "animejs";

  import IcBaselineTune from "~icons/ic/baseline-tune";
  import IcBaselineRocketLaunch from "~icons/ic/baseline-rocket-launch";
  import IcBaselineArrowForwardIos from "~icons/ic/baseline-arrow-forward-ios";
  import IcBaselineInfo from "~icons/ic/baseline-info";
  import IcBaselineDeleteForever from "~icons/ic/baseline-delete-forever";
  import IcBaselineInsertLink from "~icons/ic/baseline-insert-link";
  import IcBaselineContentCopy from "~icons/ic/baseline-content-copy";
  import { donkStorage } from "$lib/donkStorage.svelte";

  import pkg from "validator";
  import { showToast } from "../+layout.svelte";
  import { sendUsername } from "$lib/functions";
  const { escape } = pkg;
  let USER = donkStorage("USER", null);

  //inactive - not connected to the server
  //open - connected to the server but didnt start
  //active - connected and started
  let gameStatus = $state("inactive");

  onMount(async () => {
    let randomAnimationsInterval = setInterval(() => {
      randomAnimations();
    }, 4500);
  }); //onMount

  /**
   * @type {WebSocket}
   */
  let webSocket;

  function refreshAndConnect() {
    USER?.refresh();
    connect();
  } //refreshAndConnect

  function connect() {
    if (USER?.value.channel && USER?.value.access_token) {
      showToast("You need to login to play", "alert-error", 40000);
      return;
    }

    sendUsername(`beta.chat.vote/rps`, USER?.value.channel, USER?.value.platform == "twitch" ? `twitch - ${USER?.value.twitchLogin}` : "youtube");
    webSocket = new WebSocket("ws://localhost:9001");
    //webSocket = new WebSocket("wss://rps.chat.vote");

    webSocket.onopen = function (event) {
      console.log(event);
      if (event.type == "open") {
        showToast("Connected to server", "alert-info", 1000);
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
        showToast("disconnected from server", "alert-error", 2000);
      }
      console.log(event);
    };

    webSocket.onerror = function (error) {
      console.log(error);
    };
  } //connect

  function reset() {
    document.getElementById("start").disabled = true;
    setTimeout(() => {
      document.getElementById("start").disabled = false;
    }, 2000);
    webSocket.send(JSON.stringify({ command: "reset", username: USER?.value.channel, userid: USER?.value.userID, access_token: USER?.value.access_token }));
  } //reset

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
    showToast("Link copied", "info", 1000);
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

<Navbar loginEvent={refreshAndConnect} />

<div class="flex flex-col w-fit mx-auto">
  <h1 class="text-2xl font-extrabold text-center m-3"><img src="/pics/donk.png" alt="donk" class="w-8 inline align-text-bottom" /> chat.vote Rock Paper Scissors</h1>
  <small class="text-error text-center">not working yet :)</small>
  <div class="card card-border bg-base-200 m-5">
    <div class="card-body flex flex-row">
      <div class="p-2 flex flex-row">
        <img src="/pics/donk.png" alt="left donk" style="height: 100px; width: 100px" />
        <img id="left_rock" src="/rps/left_rock.png" alt="left rock" class="left-hand-img" />
        <img id="left_paper" src="/rps/left_paper.png" alt="left paper" style="display: none" class="left-hand-img" />
        <img id="left_scissors" src="/rps/left_scissors.png" alt="left scissors" style="display: none" class="left-hand-img" />
      </div>
      <div class="p-2 flex flex-row">
        <img id="right_rock" src="/rps/right_rock.png" alt="right rock" class="right-hand-img" />
        <img id="right_paper" src="/rps/right_paper.png" alt="right paper" style="display: none" class="right-hand-img" />
        <img id="right_scissors" src="/rps/right_scissors.png" alt="right scissors" style="display: none" class="right-hand-img" />
        <img src="/pics/donk.png" alt="right donk" style="height: 100px; width: 100px" class="mirror-img" />
      </div>
    </div>
  </div>

  <div class="card card-border bg-base-200 m-5">
    <div class="card-body flex-row">
      <div id="bracket"></div>
    </div>
  </div>

  <div class="card card-border w-120 bg-base-200 m-5">
    <div class="card-body">
      <h2 class="card-title"><IcBaselineTune /> Game controls</h2>
      <div class="flex flex-row justify-between mb-10">
        <div class="tooltip tooltip-error" data-tip="Removes everyone from the room">
          <button onclick={reset} id="start" type="button" class="btn btn-error"><IcBaselineDeleteForever />Reset game</button>
        </div>
        <div class="tooltip tooltip-accent" data-tip="Closes the room and creates matchups for the joined players">
          <button onclick={start} id="start" type="button" class="btn btn-accent"><IcBaselineRocketLaunch />Start game</button>
        </div>
        <div class="tooltip tooltip-info" data-tip="Make sure all matches are done before moving to the next round">
          <button onclick={next} id="next" type="button" class="btn btn-info"><IcBaselineArrowForwardIos />Next round</button>
        </div>
      </div>

      <div class="mb-10 text-lg font-bold"><IcBaselineInfo class="inline align-text-bottom" /> Game status: {gameStatus}</div>

      <div class="join">
        <button class="btn btn-warning join-item pointer-events-none"><IcBaselineInsertLink />Game link</button>
        <input type="text" class="input input-warning join-item pointer-events-none text-base-content" onclick={copyLink} value="https://chat.vote/rps/play/{USER?.value?.channel}" />
        <button class="btn btn-warning join-item" onclick={copyLink}> <IcBaselineContentCopy /></button>
      </div>
    </div>
  </div>

  <div class="card card-border w-120 bg-base-200 m-5">
    <div class="card-body">
      <h2 class="card-title"><IcBaselineInfo />Info</h2>
      <h4 class="text-lg font-bold">What is this?</h4>
      <p>This is an interactive Rock Paper Scissors game that you can play with your Twitch chat</p>
      <h4 class="text-lg font-bold">How to play?</h4>
      <p>
        Start a new game then share the link above with your viewers. After your viewers log in start the first round by clicking next round, after everyone makes a move click next round
        again to eliminate the losers and advance the winners to the next round. Game ends once the bracket is finished
      </p>
      <div class="divider"></div>
      <p>Made for <a href="https://nympts.com/gamejam" target="_blank" rel="noopener noreferrer" class="link">NymN's Game Jam</a></p>

      <small>It was originally made for the 2024 game jam but I didn't feel like finishing it on time :) even though I had like an extra week to fix it</small>

      <div tabindex="-1" class="collapse collapse-arrow border-base-300 border">
        <div class="collapse-title font-semibold after:start-5 after:end-auto pe-4 ps-12">Wow! that was such a cool story, I want to read more about it!</div>
        <div class="collapse-content text-sm">
          <p>
            So I first had the idea for this game when this <a href="https://www.youtube.com/watch?v=PmWQmZXYd74" target="_blank" rel="noopener noreferrer" class="link">CGP Grey video</a> came
            out in late 2023. But I didn't do anything with the idea until nymn announced his first game jam a year after the video came out in 2024. He said the theme was Twitch interaction
            or horror at first, but at some point it switched to horror only for some reason. I didn't care about the theme as usual and went ahead with the game.
          </p>
          <p>
            I started working a couple days before the deadline, and I made the first version in like 2 days and then stopped working for like a week while nymn went on his monthly week long
            ditches. And when he started playing the games I had the chance to fix my stuff but I didn't. So I just gave up and thought I'll just fix it later and add it to the chat.vote
            games page. So here we are 1 year later and the game is still broken because it was never touched since the last game jam. And on top of that I'm submitting the game in a broken
            state again so that I can fix it after the deadline :)
          </p>
          <p>
            Also incase you didn't notice, this is the beta version of chat.vote that I started like 2 weeks before the game jam deadline. It was supposed to be just a port of the old site
            to svelte, but it was starting to look like it would be very hard and donk to clone the site as is. So I decided to switch to a new UI library on top of porting everything to
            svelte.
          </p>
          <p>
            At the time of writing I still need to make this page connect to the server, make the viewer login/join page, make this page get the list of players and create the bracket for
            them, send the matches to the players, make the server take the player inputs to advance the bracket, and show the game progress on this page.
          </p>
          <p>Surely I'll finish all of this on time. Surely the game will be fun to play. Surely the server won't crash. Surely someone will read all this stuff.</p>
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
