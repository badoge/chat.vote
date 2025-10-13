<script>
  import { onMount } from "svelte";
  import Navbar from "$lib/Navbar.svelte";
  import { showToast } from "../../../+layout.svelte";
  import { donkStorage } from "$lib/donkStorage.svelte.js";
  import { animate } from "animejs";
  import pkg from "validator";
  const { escape } = pkg;

  let USER = donkStorage("USER", null);
  let { data } = $props();
  let streamer = $state(data.slug.toLowerCase().replace(/\s/g, ""));

  //disconnected - not connected to the server
  //connected - connected to the server
  //waiting
  //active
  let status = $state("disconnected");
  let opponent = $state("Opponent");

  /**
   * @type {WebSocket}
   */
  let webSocket;

  onMount(async () => {
    showToast("Connecting...", "alert-info", 1000);
  });

  function refreshAndConnect() {
    USER?.refresh();
    connect();
  } //refreshAndConnect

  function connect() {
    //webSocket = new WebSocket("ws://localhost:9001");
    webSocket = new WebSocket("wss://ws.chat.vote");

    webSocket.onopen = function (event) {
      console.log(event);
      if (event.type == "open") {
        showToast("Connected to server", "alert-success", 1000);
        webSocket.send(JSON.stringify({ command: "join", streamer: streamer, username: USER?.value.channel, userid: USER?.value.userID, access_token: USER?.value.access_token }));
        status = "connected";
      }
    };

    webSocket.onmessage = function (event) {
      let data = JSON.parse(event.data);

      switch (data.id) {
        ////broadcasts
        case "reset":
          //sent after streamer clicks the create a new room button
          showToast(data.message, data.type, 3000);
          status = "waiting";
          opponent = "Waiting for game to start";

          //try to rejoin after some time
          setTimeout(() => {
            webSocket.send(JSON.stringify({ command: "join", streamer: streamer, username: USER?.value.channel, userid: USER?.value.userID, access_token: USER?.value.access_token }));
          }, Math.random() * 10000);
          break;

        case "start":
          //sent after the round info is sent and its ok to start sending moves
          showToast(data.message, data.type, 3000);
          status = "active";
          break;

        case "game_ended":
          showToast(data.message, data.type, 3000);
          status = "waiting";
          break;

        ////direct messages
        case "toast":
          showToast(data.message, data.type, 3000);
          break;

        case "round":
          //sent just before a new round starts
          //wait for the "start" broadcast to enable the buttons
          showToast(data.message, data.type, 3000);
          opponent = data.opponent;
          status = "waiting";
          break;

        case "moved":
          //sent if the move was accepted
          showToast(data.message, data.type, 3000);
          status = "waiting";
          break;

        case "lost":
          //sent if the move was accepted
          showToast(data.message, data.type, 3000);
          status = "waiting";
          opponent = "Waiting for next round";
          break;

        case "lost":
          //sent if the move was accepted
          showToast(data.message, data.type, 3000);
          status = "waiting";
          opponent = "Waiting for next round";
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

  /**
   * @param {string} move
   */
  function sendMove(move) {
    status = "waiting";
    webSocket.send(JSON.stringify({ command: "move", streamer: streamer, userid: USER?.value.userid, move: move }));
  } //sendMove

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

<div class="flex flex-col items-center">
  <h1 class="text-2xl font-extrabold text-center m-3"><img src="/pics/donk.png" alt="donk" class="w-8 inline align-text-bottom" /> chat.vote Rock Paper Scissors</h1>
  <h2 class="text-md font-thin text-center">Room hosted by <a href="https://twitch.tv/{streamer}" target="_blank" rel="noopener noreferrer" class="link"> {streamer}</a></h2>

  <div class="card card-border w-fit bg-base-200 m-5">
    <div class="card-body flex flex-row">
      <div class="flex flex-col">
        <div class="p-2 flex flex-row">
          <img src="/pics/donk.png" alt="left donk" style="height: 100px; width: 100px" />
          <img id="left_rock" src="/rps/left_rock.png" alt="left rock" class="left-hand-img" />
          <img id="left_paper" src="/rps/left_paper.png" alt="left paper" style="display: none" class="left-hand-img" />
          <img id="left_scissors" src="/rps/left_scissors.png" alt="left scissors" style="display: none" class="left-hand-img" />
        </div>
        <div class="text-center">You</div>
      </div>

      <div class="flex flex-col">
        <div class="p-2 flex flex-row">
          <img id="right_rock" src="/rps/right_rock.png" alt="right rock" class="right-hand-img" />
          <img id="right_paper" src="/rps/right_paper.png" alt="right paper" style="display: none" class="right-hand-img" />
          <img id="right_scissors" src="/rps/right_scissors.png" alt="right scissors" style="display: none" class="right-hand-img" />
          <img src="/pics/donk.png" alt="right donk" style="height: 100px; width: 100px" class="mirror-img" />
        </div>
        <div class="text-center">{escape(opponent)}</div>
      </div>
    </div>
  </div>

  <div class="card card-border border-error bg-base-200">
    <div class="card-body">
      <h2 class="card-title justify-center">Make your move</h2>
      <div class="join">
        <button disabled={status !== "active"} onclick={() => sendMove("rock")} id="rock" class="btn join-item btn-primary block h-fit">
          <span style="font-size: 2.5rem">✊</span><br /><span class="text-2xl font-bold">Rock</span>
        </button>
        <button disabled={status !== "active"} onclick={() => sendMove("paper")} id="paper" class="btn join-item btn-secondary block h-fit">
          <span style="font-size: 2.5rem">✋</span><br /><span class="text-2xl font-bold">Paper</span>
        </button>
        <button disabled={status !== "active"} onclick={() => sendMove("scissors")} id="scissors" class="btn join-item btn-accent block h-fit">
          <span style="font-size: 2.5rem">✌</span><br /><span class="text-2xl font-bold">Scissors</span>
        </button>
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
