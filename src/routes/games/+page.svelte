<script>
  import { enablePopovers, enableTooltips, switchGame } from "$lib/functions";
  import { connect, loadAndConnect } from "$lib/games";
  import { onMount } from "svelte";
  let elements;

  onMount(async () => {
    elements = {
      //modals
      grid: document.getElementById("grid"),
      loginExpiredModal: document.getElementById("loginExpiredModal"),
      aboutModal: document.getElementById("aboutModal"),

      //navbar
      status: document.getElementById("status"),
      topRight: document.getElementById("topRight"),
      loginButton: document.getElementById("loginButton"),
      channelName: document.getElementById("channelName"),
      darkTheme: document.getElementById("darkTheme"),
    };

    loadAndConnect();

    if (!USER.channel) {
      loginButton = new bootstrap.Popover(elements.loginButton);
    }

    loginExpiredModal = new bootstrap.Modal(elements.loginExpiredModal);
    aboutModal = new bootstrap.Modal(elements.aboutModal);

    enableTooltips();
    enablePopovers();

    elements.channelName.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        connect();
      }
    });
  });

  let loginButton;

  let loginExpiredModal, aboutModal;

  let darkTheme = true;

  let USER = {
    channel: "",
    twitchLogin: false,
    access_token: "",
    userID: "",
    platform: "",
  };

  function handleMessage(target, context, msg, self) {} //handleMessage
</script>

<svelte:head>
  <title>chat.vote Games</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="A collection of interactive minigames that you can play with your Twitch chat" />
  <meta name="keywords" content="chatvote, chat.vote, interactive, games, Twitch, chat" />
  <meta property="og:title" content="chat.vote Games" />
  <meta property="og:site_name" content="chat.vote Games" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chat.vote/games/" />
  <meta property="og:image" content="https://screenshot.donk.workers.dev/?url=https://chat.vote/games" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:description" content="A collection of interactive minigames that you can play with your Twitch chat" />
</svelte:head>

<div class="modal fade" id="aboutModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">About</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="card mb-3">
          <div class="card-body">
            <h5>Contact info:</h5>
            <p>
              Site by <a target="_blank" rel="noopener noreferrer" href="https://www.twitch.tv/badoge">badoge</a> :) <br />If you find any issues or if you have suggestions or questions, you
              can contact me: <br /><a target="_blank" rel="noopener noreferrer" href="https://www.twitch.tv/popout/badoge/chat?popout=">in this chat</a> <br />or on
              <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/FR8bgQdPUT">discord</a> <br />or by <a href="mailto:games@chat.vote">email</a>
            </p>
          </div>
        </div>
        <div class="card mb-3">
          <div class="card-body">
            <h5>Other stuff by me :)</h5>
            <p>
              <a target="_blank" rel="noopener noreferrer" href="https://chat.vote/">chat.vote</a><br />
              <small>Polls that you vote on by typing in Twitch chat.</small><br />
              <a target="_blank" rel="noopener noreferrer" href="https://chat.vote/poll/">chat.vote/poll</a><br />
              <small>Like normal chat.vote but you vote by visiting the site instead of typing in chat.</small><br />
              <a target="_blank" rel="noopener noreferrer" href="https://okayeg.com">OkayegBOT</a><br />
              <small>Fun/utility Twitch chat bot.</small><br />
              <a target="_blank" rel="noopener noreferrer" href="https://zero.chat.vote">0weebs</a><br />
              <small>Twitch moderation bot that bans weebs.</small><br />
            </p>
          </div>
        </div>

        <div class="card mb-3">
          <div class="card-body">
            <p>more games soon™ :)</p>
            <p>tictactoe based on <a target="_blank" rel="noopener noreferrer" href="https://github.com/michaelwhyte/tic_tac_toe">github.com/michaelwhyte/tic_tac_toe</a></p>
            <p>connect4 based on <a target="_blank" rel="noopener noreferrer" href="https://github.com/mennovanslooten/connect4">github.com/mennovanslooten/connect4</a></p>
            <p>not wordle based on <a target="_blank" rel="noopener noreferrer" href="https://www.nytimes.com/games/wordle/index.html">wordle</a></p>
            <p>🟥⏹️🔴🔴⭕⏹️, Donk Hunt, Nim and Arena by <a target="_blank" rel="noopener noreferrer" href="https://www.twitch.tv/g7eternal">g7eternal</a></p>
            <h5>Stuff used:</h5>
            <ul>
              <li><a target="_blank" rel="noopener noreferrer" href="https://getbootstrap.com/">Bootstrap</a></li>
              <li><a target="_blank" rel="noopener noreferrer" href="https://tmijs.com/">tmi.js</a> to read twitch chat</li>
              <li><a target="_blank" rel="noopener noreferrer" href="http://fabricjs.com/">Fabric.js</a> Drawing canvas</li>
              <li><a target="_blank" rel="noopener noreferrer" href="https://github.com/twitter/twemoji">Twemoji</a> emoji</li>
              <li><a target="_blank" rel="noopener noreferrer" href="https://phaser.io/">Phaser</a> Arena engine</li>
              <li><a target="_blank" rel="noopener noreferrer" href="https://www.chartjs.org/">Chart.js</a> to display the results graphs</li>
              <li><a target="_blank" rel="noopener noreferrer" href="https://github.com/albert-gonzalez/easytimer.js">EasyTimer.js</a> for the countdown timers</li>
              <li><a target="_blank" rel="noopener noreferrer" href="https://fonts.google.com/icons">Material Icons</a> icons</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
