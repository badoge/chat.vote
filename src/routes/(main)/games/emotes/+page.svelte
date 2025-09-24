<script>
  import { enablePopovers, enableTooltips } from "$lib/functions";
  import { onMount } from "svelte";
  import { animate } from "animejs";
  let elements;

  onMount(async () => {
    elements = {
      //modals
      grid: document.getElementById("grid"),
      gameDiv: document.getElementById("gameDiv"),
      aboutModal: document.getElementById("aboutModal"),

      //navbar
      status: document.getElementById("status"),
      topRight: document.getElementById("topRight"),
      loginButton: document.getElementById("loginButton"),
      channelName: document.getElementById("channelName"),

      //main
      settingsOffcanvas: document.getElementById("settingsOffcanvas"),
      twitchGlobal: document.getElementById("twitchGlobal"),
      bttvGlobal: document.getElementById("bttvGlobal"),
      ffzGlobal: document.getElementById("ffzGlobal"),
      seventvGlobal: document.getElementById("seventvGlobal"),
      twitchChannel: document.getElementById("twitchChannel"),
      bttvChannel: document.getElementById("bttvChannel"),
      ffzChannel: document.getElementById("ffzChannel"),
      seventvChannel: document.getElementById("seventvChannel"),
      hideName: document.getElementById("hideName"),
      blurEmote: document.getElementById("blurEmote"),
      emotesPerRound: document.getElementById("emotesPerRound"),
      emotesPerRoundLabel: document.getElementById("emotesPerRoundLabel"),
      turnLength: document.getElementById("turnLength"),
      turnLengthLabel: document.getElementById("turnLengthLabel"),
      emoteTimer: document.getElementById("emoteTimer"),
      emoteTimerLabel: document.getElementById("emoteTimerLabel"),
      twitchGlobalCount: document.getElementById("twitchGlobalCount"),
      bttvGlobalCount: document.getElementById("bttvGlobalCount"),
      ffzGlobalCount: document.getElementById("ffzGlobalCount"),
      seventvGlobalCount: document.getElementById("seventvGlobalCount"),
      twitchChannelCount: document.getElementById("twitchChannelCount"),
      bttvChannelCount: document.getElementById("bttvChannelCount"),
      ffzChannelCount: document.getElementById("ffzChannelCount"),
      seventvChannelCount: document.getElementById("seventvChannelCount"),
      qualified: document.getElementById("qualified"),
      output: document.getElementById("output"),
      emoteTimeBarDiv: document.getElementById("emoteTimeBarDiv"),
      emoteTimeBar: document.getElementById("emoteTimeBar"),
      emotes: document.getElementById("emotes"),
      timer: document.getElementById("timer"),
      timerValue: document.getElementById("timerValue"),
      start: document.getElementById("start"),
    };

    if (!USER.channel) {
      loginButton = new bootstrap.Popover(elements.loginButton);
    }

    aboutModal = new bootstrap.Modal(elements.aboutModal);
    settingsOffcanvas = new bootstrap.Offcanvas(elements.settingsOffcanvas);

    enableTooltips();
    enablePopovers();

    elements.channelName.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        connect();
      }
    });

    elements.twitchGlobal.onchange = function () {
      EMOTEBENCHMARK.twitchGlobal = this.checked;
    };
    elements.bttvGlobal.onchange = function () {
      EMOTEBENCHMARK.bttvGlobal = this.checked;
    };
    elements.ffzGlobal.onchange = function () {
      EMOTEBENCHMARK.ffzGlobal = this.checked;
    };
    elements.seventvGlobal.onchange = function () {
      EMOTEBENCHMARK.seventvGlobal = this.checked;
    };
    elements.twitchChannel.onchange = function () {
      EMOTEBENCHMARK.twitchChannel = this.checked;
    };
    elements.bttvChannel.onchange = function () {
      EMOTEBENCHMARK.bttvChannel = this.checked;
    };
    elements.ffzChannel.onchange = function () {
      EMOTEBENCHMARK.ffzChannel = this.checked;
    };
    elements.seventvChannel.onchange = function () {
      EMOTEBENCHMARK.seventvChannel = this.checked;
    };

    elements.emotesPerRound.oninput = function () {
      EMOTEBENCHMARK.emotesPerRound = parseInt(this.value, 10) || 1;
      elements.emotesPerRoundLabel.innerHTML = this.value;
      elements.emotes.innerHTML = placeholder.repeat(this.value);
    };
    elements.turnLength.oninput = function () {
      EMOTEBENCHMARK.turnLength = (parseInt(this.value, 10) || 15) * 1000;
      elements.turnLengthLabel.innerHTML = this.value;
    };
    elements.emoteTimer.oninput = function () {
      EMOTEBENCHMARK.emoteTimer = (parseInt(this.value, 10) || 2) * 1000;
      elements.emoteTimerLabel.innerHTML = this.value;
    };

    allEmotes.twitchGlobal = await getGlobalTwitchEmotes(true);
    allEmotes.bttvGlobal = await getGlobalBTTVEmotes(true);
    allEmotes.ffzGlobal = await getGlobalFFZEmotes(true);
    allEmotes.seventvGlobal = await getGlobal7TVEmotes(true);

    elements.twitchGlobalCount.innerHTML = `<br>${allEmotes.twitchGlobal.length} emotes`;
    elements.bttvGlobalCount.innerHTML = `<br>${allEmotes.bttvGlobal.length} emotes`;
    elements.ffzGlobalCount.innerHTML = `<br>${allEmotes.ffzGlobal.length} emotes`;
    elements.seventvGlobalCount.innerHTML = `<br>${allEmotes.seventvGlobal.length} emotes`;

    if (USER.channel) {
      allEmotes.twitchChannel = await getChannelTwitchEmotes(USER.channel, true);
      allEmotes.bttvChannel = await getChannelBTTVEmotes(USER.userID, true);
      allEmotes.ffzChannel = await getChannelFFZEmotes(USER.userID, true);
      allEmotes.seventvChannel = await getChannel7TVEmotes(USER.userID, true);

      elements.twitchChannelCount.innerHTML = `<br>${allEmotes.twitchChannel.length} emotes`;
      elements.bttvChannelCount.innerHTML = `<br>${allEmotes.bttvChannel.length} emotes`;
      elements.ffzChannelCount.innerHTML = `<br>${allEmotes.ffzChannel.length} emotes`;
      elements.seventvChannelCount.innerHTML = `<br>${allEmotes.seventvChannel.length} emotes`;
    }
  });

  const placeholder = `<div class="card placeholder-emote">
<div class="card-body">
<img src="/pics/donk.png" alt="placeholder donk" title="placeholder donk" />
</div>
</div>`;

  let USER = {
    channel: "",
    twitchLogin: false,
    access_token: "",
    userID: "",
    platform: "",
  };

  let allEmotes = {
    twitchGlobal: [],
    bttvGlobal: [],
    ffzGlobal: [],
    seventvGlobal: [],
    twitchChannel: [],
    bttvChannel: [],
    ffzChannel: [],
    seventvChannel: [],
  };

  let loginButton;
  let settingsOffcanvas;
  let aboutModal;

  let EMOTEBENCHMARK = {
    interval: null,
    turn: 0,
    turnLength: 15000,
    emotesPerRound: 1,
    emoteTimer: 2000,
    hideName: false,
    blurEmote: false,
    answer: "",
    qualified: [],
    qualifiedCurrentRound: [],
    wrong: [],
    usedEmotes: [],
    timer: null,
    twitchGlobal: false,
    bttvGlobal: false,
    ffzGlobal: false,
    seventvGlobal: false,
    twitchChannel: false,
    bttvChannel: false,
    ffzChannel: false,
    seventvChannel: false,
  }; //EMOTEBENCHMARK

  function handleMessage(target, context, msg, self) {
    if (msg.trim() == EMOTEBENCHMARK.answer.trim()) {
      if (EMOTEBENCHMARK.qualified.includes(context.username) || EMOTEBENCHMARK.turn == 1) {
        if (!EMOTEBENCHMARK.qualifiedCurrentRound.includes(context.username)) {
          EMOTEBENCHMARK.qualifiedCurrentRound.push(context.username);
        }
      }

      elements.qualified.insertAdjacentHTML(
        "afterbegin",
        `<span class="badge qualified rounded-pill me-1" style="background-color: ${context.color}">
      ${addBadges(context.badges, context["user-id"], context["first-msg"])} ${context.username}
      </span>`,
      );
    }
  } //handleMessage

  function start() {
    let selectedemotes = [];
    let randomemotes = [];
    EMOTEBENCHMARK.answer = "";
    elements.emotes.innerHTML = placeholder.repeat(EMOTEBENCHMARK.emotesPerRound);

    EMOTEBENCHMARK.qualified = EMOTEBENCHMARK.qualifiedCurrentRound;
    EMOTEBENCHMARK.qualifiedCurrentRound = [];
    if (EMOTEBENCHMARK.qualified.length == 1) {
      elements.output.innerHTML = `Game over. WINNER: ${EMOTEBENCHMARK.qualified[0]}`;
      elements.qualified.innerHTML = "";
      stopTimer();
      clearInterval(EMOTEBENCHMARK.interval);
      EMOTEBENCHMARK.interval = null;
      EMOTEBENCHMARK.turn = 0;
      elements.start.disabled = false;
      return;
    }
    if (EMOTEBENCHMARK.qualified.length == 0 && EMOTEBENCHMARK.turn > 0) {
      elements.output.innerHTML = `Game over. No one won`;
      elements.qualified.innerHTML = "";
      stopTimer();
      clearInterval(EMOTEBENCHMARK.interval);
      EMOTEBENCHMARK.interval = null;
      EMOTEBENCHMARK.turn = 0;
      elements.start.disabled = false;
      return;
    }

    //get settings
    EMOTEBENCHMARK.hideName = elements.hideName.checked;
    EMOTEBENCHMARK.blurEmote = elements.blurEmote.checked;

    if (EMOTEBENCHMARK.twitchGlobal) {
      allEmotes.twitchGlobal.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (EMOTEBENCHMARK.bttvGlobal) {
      allEmotes.bttvGlobal.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (EMOTEBENCHMARK.ffzGlobal) {
      allEmotes.ffzGlobal.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (EMOTEBENCHMARK.seventvGlobal) {
      allEmotes.seventvGlobal.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (EMOTEBENCHMARK.twitchChannel) {
      allEmotes.twitchChannel.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (EMOTEBENCHMARK.bttvChannel) {
      allEmotes.bttvChannel.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (EMOTEBENCHMARK.ffzChannel) {
      allEmotes.ffzChannel.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (EMOTEBENCHMARK.seventvChannel) {
      allEmotes.seventvChannel.forEach((element) => {
        selectedemotes.push(element);
      });
    }

    //remove already seen emotes
    EMOTEBENCHMARK.usedEmotes.forEach((element) => {
      selectedemotes = selectedemotes.filter((list) => list.name != element);
    });

    if (selectedemotes.length < EMOTEBENCHMARK.emotesPerRound) {
      stopTimer();
      elements.emoteTimeBarDiv.style.visibility = "hidden";
      clearInterval(EMOTEBENCHMARK.interval);
      EMOTEBENCHMARK.interval = null;
      EMOTEBENCHMARK.turn = 0;
      showToast("Not enough emotes remaining.", "warning", 5000);
      settingsOffcanvas.show();
      elements.start.disabled = false;
      return;
    }

    elements.start.disabled = true;
    EMOTEBENCHMARK.turn++;
    startTimer();

    for (let i = 0; i < EMOTEBENCHMARK.emotesPerRound; i++) {
      let randomEmote = selectedemotes[Math.floor(Math.random() * selectedemotes.length)];
      EMOTEBENCHMARK.usedEmotes.push(randomEmote.name);
      randomemotes.push(randomEmote);
    }

    elements.emoteTimeBarDiv.style.visibility = "visible";
    setTimeout(() => {
      elements.emotes.innerHTML = "";

      for (let i = 0; i < randomemotes.length; i++) {
        let name = `<div class="text-body-secondary text-center">${!EMOTEBENCHMARK.hideName ? randomemotes[i].name : "🤔"}</div>`;
        elements.emotes.innerHTML += `
      <div class="border border-secondary rounded bg-body-tertiary emotes-emote">
      <img src="${randomemotes[i].url}" alt="${randomemotes[i].name}" ${EMOTEBENCHMARK.blurEmote ? `class="blur"` : ""} title="${randomemotes[i].name}">
      ${name}
      </div>`;
        EMOTEBENCHMARK.answer += `${randomemotes[i].name} `;
      }
      animateTimer(Math.max(EMOTEBENCHMARK.emoteTimer - (EMOTEBENCHMARK.turn - 1) * 100, 1000));
      elements.output.innerHTML = ``;
      elements.qualified.innerHTML = ``;
    }, 2000);

    if (!EMOTEBENCHMARK.interval) {
      EMOTEBENCHMARK.interval = setInterval(start, EMOTEBENCHMARK.turnLength);
    } else {
      console.log("interval already running");
    }
  } //start

  function reset() {
    clearInterval(EMOTEBENCHMARK.interval);
    stopTimer();
    elements.start.disabled = false;
    EMOTEBENCHMARK.interval = null;
    EMOTEBENCHMARK.turn = 0;
    EMOTEBENCHMARK.answer = "";
    elements.emotes.innerHTML = placeholder;
    elements.qualified.innerHTML = "";
    elements.output.innerHTML = "";
    elements.emoteTimeBarDiv.style.visibility = "hidden";
    EMOTEBENCHMARK.qualified = [];
    EMOTEBENCHMARK.qualifiedCurrentRound = [];
    EMOTEBENCHMARK.twitchGlobal = false;
    EMOTEBENCHMARK.bttvGlobal = false;
    EMOTEBENCHMARK.ffzGlobal = false;
    EMOTEBENCHMARK.seventvGlobal = false;
    EMOTEBENCHMARK.twitchChannel = false;
    EMOTEBENCHMARK.bttvChannel = false;
    EMOTEBENCHMARK.ffzChannel = false;
    EMOTEBENCHMARK.seventvChannel = false;
    elements.twitchGlobal.checked = false;
    elements.bttvGlobal.checked = false;
    elements.ffzGlobal.checked = false;
    elements.seventvGlobal.checked = false;
    elements.twitchChannel.checked = false;
    elements.bttvChannel.checked = false;
    elements.ffzChannel.checked = false;
    elements.seventvChannel.checked = false;
    elements.hideName.checked = false;
    elements.blurEmote.checked = false;
    elements.emotesPerRound.value = 1;
    elements.emotesPerRoundLabel.innerHTML = "1";
    elements.turnLength.value = 15;
    elements.turnLengthLabel.innerHTML = "15";
    elements.emoteTimer.value = 2;
    elements.emoteTimerLabel.innerHTML = "2";
    EMOTEBENCHMARK.usedEmotes = [];
  } //reset

  function animateTimer(time) {
    elements.emoteTimeBar.style.width = "100%";
    animate("#emoteTimeBar", {
      width: "0%",
      duration: time,
      ease: "linear",
      onComplete: function () {
        elements.emotes.innerHTML = placeholder.repeat(EMOTEBENCHMARK.emotesPerRound);
        elements.emoteTimeBarDiv.style.visibility = "hidden";
      },
    });
  } //animateTimer

  function startTimer() {
    elements.timer.style.visibility = "visible";

    if (EMOTEBENCHMARK.timer) {
      if (EMOTEBENCHMARK.timer.isRunning()) {
        EMOTEBENCHMARK.timer.reset();
        EMOTEBENCHMARK.timer.stop();
      }
    }
    if (isNaN(EMOTEBENCHMARK.turnLength)) {
      return;
    }
    if (EMOTEBENCHMARK.turnLength == 0) {
      return;
    }

    EMOTEBENCHMARK.timer = new easytimer.Timer();
    EMOTEBENCHMARK.timer.addEventListener("secondTenthsUpdated", function (e) {
      elements.timerValue.innerHTML = "Round ends in " + EMOTEBENCHMARK.timer.getTimeValues().toString(["minutes", "seconds", "secondTenths"]);
    });
    EMOTEBENCHMARK.timer.addEventListener("targetAchieved", function (e) {
      elements.timerValue.innerHTML = `Round #${EMOTEBENCHMARK.turn} starting...`;
      EMOTEBENCHMARK.timer.reset();
      EMOTEBENCHMARK.timer.stop();
    });
    elements.timerValue.innerHTML = `Round #${EMOTEBENCHMARK.turn} starting...`;

    setTimeout(() => {
      EMOTEBENCHMARK.timer.start({
        countdown: true,
        precision: "secondTenths",
        startValues: {
          seconds: EMOTEBENCHMARK.turnLength / 1000 - 2,
        },
      });
    }, 2000);
  } //startTimer

  function stopTimer() {
    if (EMOTEBENCHMARK.timer) {
      if (EMOTEBENCHMARK.timer.isRunning()) {
        EMOTEBENCHMARK.timer.reset();
        EMOTEBENCHMARK.timer.stop();
      }
    }
    elements.timer.style.visibility = "hidden";
  } //stopTimer
</script>

<svelte:head>
  <title>chat.vote Games - Emote benchmark</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="A test of reaction speed and emote knowledge. Type the appearing emotes in chat as fast as you can." />
  <meta name="keywords" content="chatvote, chat.vote, interactive, games, Twitch, chat" />
  <meta property="og:title" content="chat.vote Games - Emote benchmark" />
  <meta property="og:site_name" content="chat.vote Games - Emote benchmark" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chat.vote/games/emotes/" />
  <meta property="og:image" content="https://screenshot.donk.workers.dev/?url=https://chat.vote/games/emotes" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:description" content="A test of reaction speed and emote knowledge. Type the appearing emotes in chat as fast as you can." />

  <script src="/games.js"></script>
</svelte:head>

<div class="modal fade" id="howToPlayModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="howToPlayTitle">How to play - Emote benchmark</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="howToPlayBody">
        <p>1. Streamer adjusts settings then clicks on "Start"</p>
        <p>2. Emotes will be shown on screen and chat has to type them in order</p>
        <p>3. Viewers that type them correctly move on to the next round</p>
        <p>4. Game ends when 1 viewers is left</p>
        <p>Streamer can also play by typing in chat</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
  <div class="offcanvas offcanvas-bottom" data-bs-scroll="true" tabindex="-1" id="settingsOffcanvas" aria-labelledby="settingsOffcanvasLabel">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="settingsOffcanvasLabel"><i class="material-icons notranslate">settings</i>Settings</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <div class="container-fluid">
        <div class="row">
          <div class="col-3">
            <div class="card mb-1">
              <div class="card-header"><i class="material-icons notranslate">done</i>Enabled emotes</div>
              <div class="card-body">
                <div class="container-fluid">
                  <div class="row">
                    <div class="col">
                      <div class="form-check form-switch">
                        <input type="checkbox" class="form-check-input" id="twitchGlobal" aria-describedby="twitchGlobalCount" />
                        <label class="form-check-label" for="twitchGlobal">Twitch global</label>
                        <small id="twitchGlobalCount" class="form-text text-body-secondary"><br />0 emotes</small>
                      </div>

                      <div class="form-check form-switch">
                        <input type="checkbox" class="form-check-input" id="bttvGlobal" aria-describedby="bttvGlobalCount" />
                        <label class="form-check-label" for="bttvGlobal">BTTV global</label>
                        <small id="bttvGlobalCount" class="form-text text-body-secondary"><br />0 emotes</small>
                      </div>

                      <div class="form-check form-switch">
                        <input type="checkbox" class="form-check-input" id="ffzGlobal" aria-describedby="ffzGlobalCount" />
                        <label class="form-check-label" for="ffzGlobal">FFZ global</label>
                        <small id="ffzGlobalCount" class="form-text text-body-secondary"><br />0 emotes</small>
                      </div>

                      <div class="form-check form-switch">
                        <input type="checkbox" class="form-check-input" id="seventvGlobal" aria-describedby="seventvGlobalCount" />
                        <label class="form-check-label" for="seventvGlobal">7TV global</label>
                        <small id="seventvGlobalCount" class="form-text text-body-secondary"><br />0 emotes</small>
                      </div>
                    </div>
                    <div class="col">
                      <div class="form-check form-switch">
                        <input type="checkbox" class="form-check-input" id="twitchChannel" aria-describedby="twitchChannelCount" />
                        <label class="form-check-label" for="twitchChannel">Twitch channel</label>
                        <small id="twitchChannelCount" class="form-text text-body-secondary"><br />0 emotes</small>
                      </div>

                      <div class="form-check form-switch">
                        <input type="checkbox" class="form-check-input" id="bttvChannel" aria-describedby="bttvChannelCount" />
                        <label class="form-check-label" for="bttvChannel">BTTV channel</label>
                        <small id="bttvChannelCount" class="form-text text-body-secondary"><br />0 emotes</small>
                      </div>

                      <div class="form-check form-switch">
                        <input type="checkbox" class="form-check-input" id="ffzChannel" aria-describedby="ffzChannelCount" />
                        <label class="form-check-label" for="ffzChannel">FFZ channel</label>
                        <small id="ffzChannelCount" class="form-text text-body-secondary"><br />0 emotes</small>
                      </div>

                      <div class="form-check form-switch">
                        <input type="checkbox" class="form-check-input" id="seventvChannel" aria-describedby="seventvChannelCount" />
                        <label class="form-check-label" for="seventvChannel">7TV channel</label>
                        <small id="seventvChannelCount" class="form-text text-body-secondary"><br />0 emotes</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-auto">
            <div class="card mb-1">
              <div class="card-header"><i class="material-icons notranslate">videogame_asset</i>Game settings</div>
              <div class="card-body">
                <div class="form-check form-switch">
                  <input type="checkbox" class="form-check-input" id="hideName" aria-describedby="hideNameDesc" />
                  <label class="form-check-label" for="hideName">Hide emote name</label>
                  <small id="hideNameDesc" class="form-text text-body-secondary"><br />Shows only the emote without the name</small>
                </div>
                <div class="form-check form-switch">
                  <input type="checkbox" class="form-check-input" id="blurEmote" aria-describedby="blurEmoteDesc" />
                  <label class="form-check-label" for="blurEmote">Blur emote</label>
                  <small id="blurEmoteDesc" class="form-text text-body-secondary"><br />Blurs the emotes to add more difficulty :)</small>
                </div>
              </div>
            </div>
          </div>
          <div class="col-auto">
            <div class="card mb-1">
              <div class="card-header"><i class="material-icons notranslate">timer</i>Time settings</div>
              <div class="card-body">
                <label for="emotesPerRound" class="form-label">Emotes per round: <span id="emotesPerRoundLabel">1</span></label>
                <input type="range" class="form-range" min="1" max="5" value="1" id="emotesPerRound" />
                <small class="form-text text-body-secondary">How many emotes to display each round</small>
                <br />
                <label for="emoteTimer" class="form-label mt-3">Emote timer (seconds): <span id="emoteTimerLabel">2</span></label>
                <input type="range" class="form-range" min="1" max="10" value="2" id="emoteTimer" />
                <small class="form-text text-body-secondary">How long the emotes will be shown</small>
                <br />
                <label for="turnLength" class="form-label mt-3">Turn length (seconds): <span id="turnLengthLabel">15</span></label>
                <input type="range" class="form-range" min="5" max="60" value="15" id="turnLength" />
                <small class="form-text text-body-secondary">How much time viewers get to type their answers</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid p-0" id="gameDiv">
    <div class="row">
      <div class="col-xl-2"></div>
      <div class="col-xl-8">
        <div class="card border-danger text-center mb-3" id="timer" style="visibility: hidden">
          <div class="card-body p-0">
            <div id="timerValue" style="font-size: 3em">:)</div>
          </div>
        </div>
        <div class="card border-info mb-3" style="height: 200px">
          <div class="card-body" id="emotes">
            <div class="card placeholder-emote">
              <div class="card-body">
                <img src="/pics/donk.png" alt="placeholder donk" title="placeholder donk" />
              </div>
            </div>
          </div>
        </div>

        <div id="emoteTimeBarDiv" class="mb-3" style="visibility: hidden">
          <div class="progress" role="progressbar" aria-label="emote timer" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
            <div id="emoteTimeBar" class="progress-bar" style="width: 100%"></div>
          </div>
        </div>
      </div>
      <div class="col-xl-2"></div>
    </div>

    <div class="row">
      <div class="col-xl-2"></div>
      <div class="col-xl-8">
        <div class="card mb-3">
          <div class="card-header">Qualified players</div>
          <div class="card-body" id="qualified"></div>
        </div>
        <h1 class="display-6" id="output"></h1>
      </div>
      <div class="col-xl-2">
        <button class="btn btn-lg btn-success float-end m-1" type="button" id="start" onclick={start}>Start</button>

        <button class="btn btn-lg btn-secondary float-end m-1" type="button" data-bs-toggle="offcanvas" data-bs-target="#settingsOffcanvas" aria-controls="settingsOffcanvas">
          <i class="material-icons notranslate">settings</i>Settings
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  body {
    margin-bottom: 300px;
  }

  #gameName {
    text-align: center;
    vertical-align: middle;
    margin-left: 35vw;
  }

  .card-img-top {
    cursor: pointer;
    width: 100%;
    height: 230px;
  }

  #emoteTimeBar {
    transition-timing-function: linear;
    transition-duration: 0s;
  }

  .resizable {
    display: inline-block;
    resize: both;
    overflow: hidden;
    line-height: 0;
  }

  .resizable img {
    height: 100%;
  }

  .custom-popover {
    --bs-popover-border-color: var(--bs-warning);
    --bs-popover-header-bg: var(--bs-warning);
    --bs-popover-header-color: var(--bs-white);
  }

  .tooltip.show {
    opacity: 1;
  }

  .emotes-emote {
    height: 166px;
    width: 166px;
    margin: 5px;
    width: fit-content;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 250px;
  }

  .emotes-emote > img {
    height: 85%;
  }

  .placeholder-emote {
    height: 166px;
    width: 166px;
    display: inline-flex;
    margin-right: 16px;
  }

  .placeholder-emote > .card-body > img {
    height: 100%;
    width: 100%;
    -webkit-filter: blur(5px) grayscale(80%);
    -moz-filter: blur(5px) grayscale(80%);
    -o-filter: blur(5px) grayscale(80%);
    -ms-filter: blur(5px) grayscale(80%);
    filter: blur(5px) grayscale(80%);
  }

  .blur {
    -webkit-filter: blur(10px) grayscale(80%);
    -moz-filter: blur(10px) grayscale(80%);
    -o-filter: blur(10px) grayscale(80%);
    -ms-filter: blur(10px) grayscale(80%);
    filter: blur(10px) grayscale(80%);
  }

  #settingsOffcanvas {
    height: 50vh;
  }

  #settingsOffcanvas > .offcanvas-body {
    padding-bottom: 200px;
  }

  .qualified {
    font-size: 16px;
    text-shadow: 1px 1px 4px #000000;
  }
</style>
