<script>
  import { onMount } from "svelte";

  onMount(async () => {
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

  let elements = {
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

<div class="modal fade" id="loginExpiredModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Login expired</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row justify-content-center">
          Renew login:<br />
          <button type="button" data-bs-dismiss="modal" onclick="login()" class="btn btn-twitch"><span class="twitch-icon"></span>Sign in with Twitch</button>
          <br /><small class="text-body-secondary">Logins expire after 2 months.<br />Or after you change your password.</small>
        </div>
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-danger"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          data-bs-title="Will reset everything so you can login again."
          data-bs-dismiss="modal"
          onclick="resetSettings()"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
</div>

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

<div class="container-fluid">
  <div id="grid" class="mt-3">
    <div class="row row-cols-1 row-cols-xl-4 row-cols-lg-3 row-cols-sm-3 g-4">
      <div class="col">
        <div class="card h-100">
          <img src="/games/pics/draw.png" onclick="switchGame('draw')" class="card-img-top" alt="Draw" />
          <div class="card-body">
            <h5 class="card-title">Draw</h5>
            <p class="card-text">Streamer draws a random emote, chat has to guess the emote. Can you draw well enough?</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/games/pics/arena.png" onclick="switchGame('arena')" class="card-img-top" alt="Arena" />
          <div class="card-body">
            <h5 class="card-title">Arena</h5>
            <p class="card-text">Fight your chatters in a "battle royale" arena, where only one can win!</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/games/pics/eb.png" onclick="switchGame('eb')" class="card-img-top" alt="Emote benchmark" />
          <div class="card-body">
            <h5 class="card-title">Emote benchmark</h5>
            <p class="card-text">A test of reaction speed and emote knowledge. Type the appearing emotes in chat as fast as you can.</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/games/pics/dh.png" onclick="switchGame('dh')" class="card-img-top" alt="Donk Hunt" />
          <div class="card-body">
            <h5 class="card-title">Donk Hunt</h5>
            <p class="card-text">Scary looking creatures are trying to trap their prey. Are you the hunter or the hunted one?</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/games/pics/shapes.png" onclick="switchGame('shapes')" class="card-img-top" alt="🟥⏹️🔴🔴⭕⏹️" />
          <div class="card-body">
            <h5 class="card-title">🟥⏹️🔴🔴⭕⏹️</h5>
            <p class="card-text">A very weird logic puzzle. Finish the row of shapes, which has been formed using a pre-determined hidden rule.</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/games/pics/nim.png" onclick="switchGame('nim')" class="card-img-top" alt="Nim" />
          <div class="card-body">
            <h5 class="card-title">Nim</h5>
            <p class="card-text">Classic. Remove popsicles until there's one left. Whoever takes the last one - loses!</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/games/pics/nw.png" onclick="switchGame('nw')" class="card-img-top" alt="Not Wordle :)" />
          <div class="card-body">
            <h5 class="card-title">Not Wordle :)</h5>
            <p class="card-text">A twist of a well-known game: try to guess a word in several attempts. Your chat will choose the hidden word.</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/games/pics/c4.png" onclick="switchGame('c4')" class="card-img-top" alt="Connect 4" />
          <div class="card-body">
            <h5 class="card-title">Connect 4</h5>
            <p class="card-text">Players take turns to drop their pieces into the container, attempting to connect 4 of their pieces in a row.</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/games/pics/ttt.png" onclick="switchGame('ttt')" class="card-img-top" alt="tic tac toe" />
          <div class="card-body">
            <h5 class="card-title">tic tac toe</h5>
            <p class="card-text">An ancient game of wits. Will you outsmart the hive mind - which is your chat?</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/games/pics/guessr.png" onclick="switchGame('guessr')" class="card-img-top" alt="guessr" />
          <div class="card-body">
            <h5 class="card-title"><i class="material-icons notranslate">open_in_new</i> Guessr.tv</h5>
            <p class="card-text">Guess the view count. You will be presented with a random Twitch stream and you have to guess how many viewers they have.</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/pics/donk.png" style="width: 180px; height: 180px; align-self: center" onclick="switchGame('about')" class="card-img-top" alt="About" />
          <div class="card-body">
            <h5 class="card-title">About</h5>
            <p class="card-text">About section</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
