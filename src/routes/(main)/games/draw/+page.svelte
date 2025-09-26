<script>
  import IcBaselineSettings from "~icons/ic/baseline-settings";

  import IcBaselineTimer from "~icons/ic/baseline-timer";
  import IcBaselineUndo from "~icons/ic/baseline-undo";
  import IcBaselineRedo from "~icons/ic/baseline-redo";
  import IcBaselineSort from "~icons/ic/baseline-sort";
  import IcBaselinePhotoCamera from "~icons/ic/baseline-photo-camera";
  import IcBaselineLeaderboard from "~icons/ic/baseline-leaderboard";
  import IcBaselineClear from "~icons/ic/baseline-clear";
  import IcBaselineSkipNext from "~icons/ic/baseline-skip-next";
  import IcBaselinePalette from "~icons/ic/baseline-palette";
  import IcBaselineBrush from "~icons/ic/baseline-brush";
  import IcBaselineEditOff from "~icons/ic/baseline-edit-off";
  import IcBaselineDelete from "~icons/ic/baseline-delete";
  import IcBaselinePlayArrow from "~icons/ic/baseline-play-arrow";
  import IcBaselineEmojiEvents from "~icons/ic/baseline-emoji-events";
  import IcBaselineScoreboard from "~icons/ic/baseline-scoreboard";
  import IcBaselineBolt from "~icons/ic/baseline-bolt";
  import IcBaselineVisibilityOff from "~icons/ic/baseline-visibility-off";
  import IcBaselineCheck from "~icons/ic/baseline-check";

  import { enableTooltips } from "$lib/functions";
  import { onMount } from "svelte";
  let elements;
  let bootstrap;
  onMount(async () => {
    bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");
    elements = {
      //modals
      grid: document.getElementById("grid"),
      gameDiv: document.getElementById("gameDiv"),

      //main
      drawemotecardbody: document.getElementById("drawemotecardbody"),
      drawoutput: document.getElementById("drawoutput"),
      drawlblist: document.getElementById("drawlblist"),
      twitchGlobal: document.getElementById("twitchGlobal"),
      bttvGlobal: document.getElementById("bttvGlobal"),
      ffzGlobal: document.getElementById("ffzGlobal"),
      seventvGlobal: document.getElementById("seventvGlobal"),
      twitch: document.getElementById("twitch"),
      bttv: document.getElementById("bttv"),
      ffz: document.getElementById("ffz"),
      seventv: document.getElementById("seventv"),
      emoji: document.getElementById("emoji"),
      drawscoring1: document.getElementById("drawscoring1"),
      drawscoring2: document.getElementById("drawscoring2"),
      turnLength: document.getElementById("turnLength"),
      timerReveal: document.getElementById("timerReveal"),
      points: document.getElementById("points"),
      pointsTarget: document.getElementById("pointsTarget"),
      twitchGlobalCount: document.getElementById("twitchGlobalCount"),
      bttvGlobalCount: document.getElementById("bttvGlobalCount"),
      ffzGlobalCount: document.getElementById("ffzGlobalCount"),
      seventvGlobalCount: document.getElementById("seventvGlobalCount"),
      emojiCount: document.getElementById("emojiCount"),
      twitchCount: document.getElementById("twitchCount"),
      bttvCount: document.getElementById("bttvCount"),
      ffzCount: document.getElementById("ffzCount"),
      seventvCount: document.getElementById("seventvCount"),
      color: document.getElementById("color"),
      LineWidth: document.getElementById("LineWidth"),
      LineWidthLabel: document.getElementById("LineWidthLabel"),
      clearCanvas: document.getElementById("clearCanvas"),
      redo: document.getElementById("redo"),
      undo: document.getElementById("undo"),
      settingsOffcanvas: document.getElementById("settingsOffcanvas"),
      countdown: document.getElementById("countdown"),
      countdownValue: document.getElementById("countdownValue"),
    };

    settingsOffcanvas = new bootstrap.Offcanvas(elements.settingsOffcanvas);

    enableTooltips();
    enablePopovers();

    elements.channelName.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        connect();
      }
    });

    DRAW.canvas = new fabric.Canvas("canvas", {
      isDrawingMode: true,
    });
    DRAW.canvas.on("mouse:up", function () {
      save();
    });

    elements.undo.addEventListener("click", function () {
      replay(DRAW.undo_list, DRAW.redo_list, "redo", this);
    });

    elements.redo.addEventListener("click", function () {
      replay(DRAW.redo_list, DRAW.undo_list, "undo", this);
    });

    fabric.Object.prototype.transparentCorners = false;

    elements.clearCanvas.onclick = function () {
      DRAW.canvas.clear();
    };

    elements.color.oninput = function () {
      let brush = DRAW.canvas.freeDrawingBrush;
      brush.color = this.value;
      brush.width = parseInt(elements.LineWidth.value, 10) || 1;
      let brushsvg = document.getElementsByClassName("brushsvg");
      Array.from(brushsvg).forEach((element) => {
        element.style.fill = parseInt(this.value, 10);
      });
    };
    elements.LineWidth.oninput = function () {
      elements.LineWidthLabel.innerHTML = this.value;
      DRAW.canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
      this.previousSibling.innerHTML = parseInt(this.value, 10);
    };

    if (DRAW.canvas.freeDrawingBrush) {
      DRAW.canvas.freeDrawingBrush.color = elements.color.value;
      DRAW.canvas.freeDrawingBrush.width = parseInt(elements.LineWidth.value, 10) || 1;
    }

    let colorbtns = document.getElementsByClassName("colorpreset");
    Array.from(colorbtns).forEach(function (element) {
      element.addEventListener("click", changeColor);
    });
    elements.twitchGlobal.onchange = function () {
      DRAW.twitchGlobal = this.checked;
    };
    elements.bttvGlobal.onchange = function () {
      DRAW.bttvGlobal = this.checked;
    };
    elements.ffzGlobal.onchange = function () {
      DRAW.ffzGlobal = this.checked;
    };
    elements.seventvGlobal.onchange = function () {
      DRAW.seventvGlobal = this.checked;
    };
    elements.twitch.onchange = function () {
      DRAW.twitch = this.checked;
    };
    elements.bttv.onchange = function () {
      DRAW.bttv = this.checked;
    };
    elements.ffz.onchange = function () {
      DRAW.ffz = this.checked;
    };
    elements.seventv.onchange = function () {
      DRAW.seventv = this.checked;
    };
    elements.emoji.onchange = function () {
      DRAW.emoji = this.checked;
    };

    elements.turnLength.onchange = function () {
      DRAW.turnLength = parseInt(this.value, 10);
    };
    elements.timerReveal.onchange = function () {
      DRAW.timerReveal = this.checked;
    };

    elements.drawscoring1.onchange = function () {
      DRAW.firstOnly = !this.checked;
    };
    elements.drawscoring2.onchange = function () {
      DRAW.firstOnly = this.checked;
    };
    elements.points.onchange = function () {
      DRAW.points = parseInt(this.value, 10);
    };
    elements.pointsTarget.onchange = function () {
      DRAW.pointsTarget = parseInt(this.value, 10);
    };

    allEmotes.twitchGlobal = await getGlobalTwitchEmotes(true);
    allEmotes.bttvGlobal = await getGlobalBTTVEmotes(true);
    allEmotes.ffzGlobal = await getGlobalFFZEmotes(true);
    allEmotes.seventvGlobal = await getGlobal7TVEmotes(true);
    allEmotes.emoji = await getEmoji();
    elements.twitchGlobalCount.innerHTML = `<br>${allEmotes.twitchGlobal.length} emotes`;
    elements.bttvGlobalCount.innerHTML = `<br>${allEmotes.bttvGlobal.length} emotes`;
    elements.ffzGlobalCount.innerHTML = `<br>${allEmotes.ffzGlobal.length} emotes`;
    elements.seventvGlobalCount.innerHTML = `<br>${allEmotes.seventvGlobal.length} emotes`;
    elements.emojiCount.innerHTML = `<br>${allEmotes.emoji.length} emoji`;

    if (USER.channel) {
      allEmotes.twitch = await getChannelTwitchEmotes(USER.channel, true);
      allEmotes.bttv = await getChannelBTTVEmotes(USER.userID, true);
      allEmotes.ffz = await getChannelFFZEmotes(USER.userID, true);
      allEmotes.seventv = await getChannel7TVEmotes(USER.userID, true);

      elements.twitchCount.innerHTML = `<br>${allEmotes.twitch.length} emotes`;
      elements.bttvCount.innerHTML = `<br>${allEmotes.bttv.length} emotes`;
      elements.ffzCount.innerHTML = `<br>${allEmotes.ffz.length} emotes`;
      elements.seventvCount.innerHTML = `<br>${allEmotes.seventv.length} emotes`;
    }
  });

  let allEmotes = {
    twitchGlobal: [],
    bttvGlobal: [],
    ffzGlobal: [],
    seventvGlobal: [],
    twitch: [],
    bttv: [],
    ffz: [],
    seventv: [],
    emoji: [],
  };

  let settingsOffcanvas;
  let timer;

  let USER = {
    channel: "",
    twitchLogin: false,
    access_token: "",
    userID: "",
    platform: "",
  };

  let DRAW = {
    gameActive: false,
    answer: "",
    answerURL: "",
    answerDesc: "",
    turn: 0,
    winner: null,
    canvas: null,
    redo_list: [],
    undo_list: [],
    state: null,
    twitchGlobal: false,
    bttvGlobal: false,
    ffzGlobal: false,
    seventvGlobal: false,
    twitch: false,
    bttv: false,
    ffz: false,
    seventv: false,
    emoji: false,
    firstOnly: false,
    turnLength: 0,
    timerReveal: false,
    points: 10,
    pointsTarget: 100,
    correctUsers: 0,
    users: {},
    usedEmotes: [],
  }; //DRAW

  async function start() {
    let selectedemotes = [];
    if (DRAW.twitchGlobal) {
      allEmotes.twitchGlobal.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (DRAW.bttvGlobal) {
      allEmotes.bttvGlobal.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (DRAW.ffzGlobal) {
      allEmotes.ffzGlobal.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (DRAW.seventvGlobal) {
      allEmotes.seventvGlobal.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (DRAW.twitch) {
      allEmotes.twitch.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (DRAW.bttv) {
      allEmotes.bttv.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (DRAW.ffz) {
      allEmotes.ffz.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (DRAW.seventv) {
      allEmotes.seventv.forEach((element) => {
        selectedemotes.push(element);
      });
    }
    if (DRAW.emoji) {
      allEmotes.emoji.forEach((element) => {
        selectedemotes.push(element);
      });
    }

    //remove used emotes
    DRAW.usedEmotes.forEach((element) => {
      selectedemotes = selectedemotes.filter((list) => list.name !== element);
    });
    if (selectedemotes.length < 2) {
      showToast(`Not enough emotes selected`, "warning", 3000);
      settingsOffcanvas.show();
      return;
    }

    //pick a random emote
    let randomEmote = selectedemotes[Math.floor(Math.random() * selectedemotes.length)];
    elements.drawemotecardbody.innerHTML = `
  ${randomEmote.url == "emoji" ? randomEmote.name : `<img src="${randomEmote.url}" alt="${randomEmote.name}" title="${randomEmote.name}" class="draw-emote">`}<br>
  ${randomEmote.url == "emoji" ? randomEmote.desc : randomEmote.name}`;
    if (randomEmote.url == "emoji") {
      twemoji.parse(elements.drawemotecardbody);
    }

    DRAW.answer = randomEmote.name;
    DRAW.answerURL = randomEmote.url;
    DRAW.answerDesc = randomEmote.desc;
    DRAW.usedEmotes.push(randomEmote.name);
    DRAW.canvas.clear();
    elements.drawoutput.innerHTML = "";
    DRAW.winner = null;
    DRAW.correctUsers = 0;
    startTimer();

    DRAW.turn++;
    DRAW.gameActive = true;
  } //start

  function correct(user) {
    if (DRAW.correctUsers >= DRAW.points) {
      showToast(`No more points left; starting new round`, "warning", 3000);
      start();
      return;
    }

    if (!DRAW.users[user.username]) {
      let name = user.username == user.displayname.toLowerCase() ? `${user.displayname}` : `${user.displayname} (${user.username})`;
      let color = !user.color ? "#FFFFFF" : user.color;
      let badges = addBadges(user.badges, user.id, user.firstmsg);

      if (DRAW.firstOnly && !DRAW.winner) {
        user.score = DRAW.points;
        user.lastTurn = DRAW.turn;
        user.badges = badges;
        user.name = name;
        user.color = color;
        DRAW.users[user.username] = user;
        DRAW.correctUsers++;
      } else if (!DRAW.firstOnly) {
        user.score = DRAW.points - DRAW.correctUsers;
        user.lastTurn = DRAW.turn;
        user.badges = badges;
        user.name = name;
        user.color = color;
        DRAW.users[user.username] = user;
        DRAW.correctUsers++;
      } else {
        return;
      }
    } else {
      if (DRAW.users[user.username].lastTurn == DRAW.turn) {
        return;
      } else {
        if (DRAW.firstOnly && !DRAW.winner) {
          DRAW.users[user.username].score += DRAW.points;
          DRAW.users[user.username].lastTurn = DRAW.turn;
          DRAW.correctUsers++;
        } else if (!DRAW.firstOnly) {
          DRAW.users[user.username].score += DRAW.points - DRAW.correctUsers;
          DRAW.users[user.username].lastTurn = DRAW.turn;
          DRAW.correctUsers++;
        } else {
          return;
        }
      }
    }

    let lb = "";
    Object.keys(DRAW.users)
      .sort(function (a, b) {
        return DRAW.users[b].score - DRAW.users[a].score;
      })
      .forEach((element) => {
        lb += `<li id="${DRAW.users[element].name}_draw" class="list-group-item">${DRAW.users[element].badges}<span style="color:${DRAW.users[element].color};"> ${DRAW.users[element].name}</span>: ${DRAW.users[element].score} point </li>`;
      });
    elements.drawlblist.innerHTML = lb;

    if (!DRAW.winner) {
      DRAW.winner = user.username;

      if (!DRAW.timerReveal || DRAW.firstOnly) {
        elements.drawoutput.innerHTML = `
      <div class="card border-success">
      <div class="card-body">
      <h4>${user.username} was the first to get it right</h4><br>
      ${DRAW.answerURL == "emoji" ? DRAW.answer : `<img src="${DRAW.answerURL}" alt="${DRAW.answer}" title="${DRAW.answer}" class="draw-emote">`}<br>
      ${DRAW.answerURL == "emoji" ? DRAW.answerDesc : DRAW.answer}<br>
      <button type="button" onclick="start()" class="btn btn-success"><i class="material-icons notranslate">navigate_next</i>Next round</button>
      </div>
      </div>`;
        if (DRAW.answerURL == "emoji") {
          twemoji.parse(elements.drawoutput);
        }
        stopTimer();
      }
    }

    if (DRAW.users[user.username].score >= DRAW.pointsTarget) {
      elements.drawoutput.innerHTML = `
  <div class="card border-success">
  <div class="card-body">
  <h4>Game over! ${user.username} Won by reaching the points target (${DRAW.pointsTarget})</h4><br>
  ${DRAW.answerURL == "emoji" ? DRAW.answer : `<img src="${DRAW.answerURL}" alt="${DRAW.answer}" title="${DRAW.answer}" class="draw-emote">`}<br>
  ${DRAW.answerURL == "emoji" ? DRAW.answerDesc : DRAW.answer}<br>
  <button type="button" onclick="reset(true)" class="btn btn-warning"><i class="material-icons notranslate">replay</i>Play again</button>
  </div>
  </div>`;
      if (DRAW.answerURL == "emoji") {
        twemoji.parse(elements.drawoutput);
      }
      stopTimer();
      DRAW.gameActive = false;
    }
  } //correct

  function reset(newGame = false) {
    DRAW.gameActive = false;
    DRAW.turn = 0;
    DRAW.correctUsers = 0;
    DRAW.answer = "";
    elements.drawemotecardbody.innerHTML = `<span style="font-size: 4vh;">Place your facecam here<br><i class="material-icons notranslate" style="font-size: 6vh;">photo_camera</i></span>`;

    DRAW.canvas.clear();
    DRAW.redo_list = [];
    DRAW.undo_list = [];
    DRAW.users = {};
    DRAW.state = null;
    elements.drawlblist.innerHTML = "";
    elements.drawoutput.innerHTML = "";
    stopTimer();

    if (!newGame) {
      DRAW.firstOnly = false;
      DRAW.turnLength = 0;
      DRAW.timerReveal = false;
      DRAW.points = 10;
      DRAW.pointsTarget = 100;
      elements.drawscoring1.checked = true;
      elements.turnLength.value = 0;
      elements.timerReveal.checked = DRAW.timerReveal;
      elements.points.value = 10;
      elements.pointsTarget.value = 100;
      DRAW.twitchGlobal = false;
      DRAW.bttvGlobal = false;
      DRAW.ffzGlobal = false;
      DRAW.seventvGlobal = false;
      DRAW.twitch = false;
      DRAW.bttv = false;
      DRAW.ffz = false;
      DRAW.seventv = false;
      DRAW.emoji = false;
      elements.twitchGlobal.checked = false;
      elements.bttvGlobal.checked = false;
      elements.ffzGlobal.checked = false;
      elements.seventvGlobal.checked = false;
      elements.twitch.checked = false;
      elements.bttv.checked = false;
      elements.ffz.checked = false;
      elements.seventv.checked = false;
      elements.emoji.checked = false;
      DRAW.usedEmotes = [];
    } else {
      start();
    }
  } //reset

  function changeColor() {
    DRAW.canvas.freeDrawingBrush.color = this.value;
    elements.color.value = this.value;
    let brushsvg = document.getElementsByClassName("brushsvg");
    Array.from(brushsvg).forEach((element) => {
      element.style.fill = this.value;
    });
  } //changeColor

  function changeBrush(element) {
    DRAW.canvas.freeDrawingBrush.width = parseInt(element.value, 10) || 1;
    elements.LineWidth.value = parseInt(element.value, 10) || 1;
    elements.LineWidthLabel.innerHTML = parseInt(element.value, 10) || 1;
  } //changeBrush

  function replay(playStack, saveStack, buttonsOn, buttonsOff) {
    saveStack.push(DRAW.state);
    DRAW.state = playStack.pop();
    let on = elements[buttonsOn];
    let off = elements[buttonsOff.id];
    // turn both buttons off for the moment to prevent rapid clicking
    on.disabled = true;
    off.disabled = true;
    DRAW.canvas.clear();
    DRAW.canvas.loadFromJSON(DRAW.state, function () {
      DRAW.canvas.renderAll();
      // now turn the buttons back on if applicable
      on.disabled = false;
      if (playStack.length) {
        off.disabled = false;
      }
    });
  } //replay

  function save() {
    DRAW.redo_list = [];
    elements.redo.disabled = true;
    // initial call won"t have a state
    if (DRAW.state) {
      DRAW.undo_list.push(DRAW.state);
      elements.undo.disabled = false;
    }
    DRAW.state = JSON.stringify(DRAW.canvas);
  } //save

  function handleMessage(target, context, msg, self) {
    if (msg.trim() === DRAW.answer && DRAW.gameActive) {
      correct({
        id: context["user-id"],
        username: context.username,
        displayname: context["display-name"],
        color: context.color,
        badges: context.badges,
        firstmsg: context["first-msg"],
      });
    }
  } //handleMessage

  function startTimer() {
    if (isNaN(DRAW.turnLength) || DRAW.turnLength == 0) {
      return;
    }
    if (timer && timer.isRunning()) {
      timer.reset();
      timer.stop();
    }
    timer = new easytimer.Timer();
    timer.addEventListener("secondTenthsUpdated", function (e) {
      elements.countdownValue.innerHTML = timer.getTimeValues().toString(["minutes", "seconds", "secondTenths"]);
    });
    timer.addEventListener("targetAchieved", function (e) {
      elements.countdown.style.display = "none";
      timer.reset();
      timer.stop();

      //show winner if using show answer after timer runs out only setting
      if ((DRAW.timerReveal && DRAW.winner) || !elements.drawoutput.innerHTML) {
        elements.drawoutput.innerHTML = `
      <div class="card border-success">
      <div class="card-body">
      <h4>${DRAW.winner} was the first to get it right</h4><br>
      ${DRAW.answerURL == "emoji" ? DRAW.answer : `<img src="${DRAW.answerURL}" alt="${DRAW.answer}" title="${DRAW.answer}" class="draw-emote">`}<br>
      ${DRAW.answerURL == "emoji" ? DRAW.answerDesc : DRAW.answer}<br>
      <button type="button" onclick="start()" class="btn btn-success"><i class="material-icons notranslate">navigate_next</i>Next round</button>
      </div>
      </div>`;
        if (DRAW.answerURL == "emoji") {
          twemoji.parse(elements.drawoutput);
        }
      }

      //show the answer if no one got it
      if (!DRAW.winner) {
        elements.drawoutput.innerHTML = `
      <div class="card border-danger">
      <div class="card-body">
      <h4>No one got the emote</h4><br>
      ${DRAW.answerURL == "emoji" ? DRAW.answer : `<img src="${DRAW.answerURL}" alt="${DRAW.answer}" title="${DRAW.answer}" class="draw-emote">`}<br>
      ${DRAW.answerURL == "emoji" ? DRAW.answerDesc : DRAW.answer}<br>
      <button type="button" onclick="start()" class="btn btn-success"><i class="material-icons notranslate">navigate_next</i>Next round</button>
      </div>
      </div>`;
        if (DRAW.answerURL == "emoji") {
          twemoji.parse(elements.drawoutput);
        }
      }
    });

    elements.countdownValue.innerHTML = timer.getTimeValues().toString(["minutes", "seconds", "secondTenths"]);
    elements.countdown.style.display = "";

    timer.start({
      countdown: true,
      precision: "secondTenths",
      startValues: {
        seconds: DRAW.turnLength,
      },
    });
  } //startTimer

  function stopTimer() {
    if (timer && timer.isRunning()) {
      timer.reset();
      timer.stop();
    }
    elements.countdown.style.display = "none";
  } //stopTimer
</script>

<svelte:head>
  <title>chat.vote Games - Draw</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="Streamer draws a random emote, chat has to guess the emote. Can you draw well enough?" />
  <meta name="keywords" content="chatvote, chat.vote, interactive, games, Twitch, chat" />
  <meta property="og:title" content="chat.vote Games - Draw" />
  <meta property="og:site_name" content="chat.vote Games - Draw" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chat.vote/games/draw/" />
  <meta property="og:image" content="https://screenshot.donk.workers.dev/?url=https://chat.vote/games/draw" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:description" content="Streamer draws a random emote, chat has to guess the emote. Can you draw well enough?" />
</svelte:head>

<div class="modal fade" id="howToPlayModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="howToPlayTitle">How to play - Draw</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="howToPlayBody">
        <p>1. Open the settings using the <IcBaselineSettings /> button on the right and pick the emotes that you want to draw and adjust other settings</p>
        <p>2. <IcBaselinePlayArrow /> Start the game. A random emote will be shown bottom right that you have to draw</p>
        <p>3. Viewers guess the emote by typing in chat</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<div class="offcanvas offcanvas-end" tabindex="-1" id="settingsOffcanvas" aria-labelledby="settingsOffcanvasLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="settingsOffcanvasLabel"><IcBaselineSettings />Settings</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <h4><IcBaselineCheck />Enabled emotes</h4>
    <div class="row">
      <div class="col-auto">
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

        <div class="form-check form-switch">
          <input type="checkbox" class="form-check-input" id="emoji" aria-describedby="emojiCount" />
          <label class="form-check-label" for="emoji">Emoji</label>
          <small id="emojiCount" class="form-text text-body-secondary"><br />0 emoji</small>
        </div>
      </div>

      <div class="col-auto">
        <div class="form-check form-switch">
          <input type="checkbox" class="form-check-input" id="twitch" aria-describedby="twitchCount" />
          <label class="form-check-label" for="twitch">Twitch channel</label>
          <small id="twitchCount" class="form-text text-body-secondary"><br />0 emotes</small>
        </div>

        <div class="form-check form-switch">
          <input type="checkbox" class="form-check-input" id="bttv" aria-describedby="bttvCount" />
          <label class="form-check-label" for="bttv">BTTV channel</label>
          <small id="bttvCount" class="form-text text-body-secondary"><br />0 emotes</small>
        </div>

        <div class="form-check form-switch">
          <input type="checkbox" class="form-check-input" id="ffz" aria-describedby="ffzCount" />
          <label class="form-check-label" for="ffz">FFZ channel</label>
          <small id="ffzCount" class="form-text text-body-secondary"><br />0 emotes</small>
        </div>

        <div class="form-check form-switch">
          <input type="checkbox" class="form-check-input" id="seventv" aria-describedby="seventvCount" />
          <label class="form-check-label" for="seventv">7TV channel</label>
          <small id="seventvCount" class="form-text text-body-secondary"><br />0 emotes</small>
        </div>
      </div>
    </div>
    <br />

    <div class="mb-3">
      <label for="turnLength" class="form-label"><IcBaselineTimer />Round timer</label>
      <div class="input-group">
        <input type="number" min="0" value="0" max="300" class="form-control" id="turnLength" aria-describedby="timerDesc" />
        <span class="input-group-text" id="timerDesc">seconds</span>
      </div>
      <small>Set to 0 to disable the timer</small>
      <div class="form-check form-switch mt-3">
        <input class="form-check-input" type="checkbox" role="switch" id="timerReveal" />
        <label class="form-check-label" for="timerReveal"><IcBaselineVisibilityOff />Show answer after timer runs out only</label>
      </div>
    </div>

    <br />
    <h4><IcBaselineScoreboard />Scoring & Points</h4>
    <div class="form-check mb-3">
      <input class="form-check-input" type="radio" name="drawscoring" id="drawscoring1" checked />
      <label class="form-check-label" for="drawscoring1"><IcBaselineSort />Fastest answer</label>
      <br /><small>First correct guess is worth 10 points, 2nd is worth 9 and so on.</small>
    </div>
    <div class="form-check mb-5">
      <input class="form-check-input" type="radio" name="drawscoring" id="drawscoring2" />
      <label class="form-check-label" for="drawscoring2"><IcBaselineBolt />First answer only</label>
      <br /><small>Only the first viewer to guess correctly will get points.</small>
    </div>
    <div class="input-group mb-3">
      <span class="input-group-text"><IcBaselineScoreboard />Points per round</span>
      <input id="points" type="number" min="1" max="1000000" value="10" class="form-control" />
    </div>
    <div class="input-group mb-3">
      <span class="input-group-text"><IcBaselineEmojiEvents />Points needed to win</span>
      <input id="pointsTarget" type="number" min="1" max="1000000" value="100" class="form-control" />
    </div>
  </div>
</div>

<div class="container-fluid">
  <div class="container-fluid p-0" id="gameDiv">
    <div class="row">
      <div class="col">
        <div class="canvas-container" style="z-index: 1000; width: 850px; height: 850px; position: relative; user-select: none; background: #666666">
          <canvas
            class="lower-canvas"
            width="850"
            height="850"
            id="canvas"
            style="z-index: 1000; position: absolute; width: 850px; height: 850px; left: 0px; top: 0px; touch-action: none; user-select: none"
          >
          </canvas>
          <canvas class="upper-canvas" style="position: absolute; width: 850px; height: 850px; left: 0px; top: 0px; touch-action: none; user-select: none; cursor: crosshair"></canvas>
        </div>
      </div>

      <div class="col-auto">
        <label for="LineWidth" class="form-label"><IcBaselineBrush />Brush size: <span id="LineWidthLabel">5</span></label>
        <br />
        <div class="btn-group" role="group" aria-label="brush size presets" id="brushpresetsgroup">
          <input onclick={changeBrush} value="1" class="btn-check" type="radio" name="brushpresets" id="brush1" />
          <label class="btn btn-outline-secondary" for="brush1" title="brush1">
            <svg class="brushsvg" style="height: 5px; width: 5px; fill: #22b14c" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="50" />
            </svg>
          </label>
          <input onclick={changeBrush} value="5" class="btn-check" type="radio" name="brushpresets" id="brush2" checked />
          <label class="btn btn-outline-secondary" for="brush2" title="brush2">
            <svg class="brushsvg" style="height: 10px; width: 10px; fill: #22b14c" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="50" />
            </svg>
          </label>
          <input onclick={changeBrush} value="10" class="btn-check" type="radio" name="brushpresets" id="brush3" />
          <label class="btn btn-outline-secondary" for="brush3" title="brush3">
            <svg class="brushsvg" style="height: 20px; width: 20px; fill: #22b14c" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="50" />
            </svg>
          </label>
          <input onclick={changeBrush} value="20" class="btn-check" type="radio" name="brushpresets" id="brush4" />
          <label class="btn btn-outline-secondary" for="brush4" title="brush4">
            <svg class="brushsvg" style="height: 30px; width: 30px; fill: #22b14c" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="50" />
            </svg>
          </label>
          <input onclick={changeBrush} value="40" class="btn-check" type="radio" name="brushpresets" id="brush5" />
          <label class="btn btn-outline-secondary" for="brush5" title="brush5">
            <svg id="dank" class="brushsvg" style="height: 40px; width: 40px; fill: #22b14c" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="50" />
            </svg>
          </label>
        </div>
        <br />
        <input type="range" class="form-range" min="1" max="40" value="5" id="LineWidth" />
        <br />

        <label for="color"><IcBaselinePalette /> Colors</label><br />
        <div class="colorpresetgroup" aria-label="color presets">
          <button type="button" class="btn btn-primary colorpreset" aria-label="color" value="#000000" style="background-color: #000000"></button>
          <button type="button" class="btn btn-primary colorpreset" aria-label="color" value="#404040" style="background-color: #404040"></button>
          <button type="button" class="btn btn-primary colorpreset" aria-label="color" value="#AAAAAA" style="background-color: #aaaaaa"></button>
          <button type="button" class="btn btn-primary colorpreset" aria-label="color" value="#FFFFFF" style="background-color: #ffffff"></button>
          <button type="button" class="btn btn-primary colorpreset" aria-label="color" value="#B0701C" style="background-color: #b0701c"></button>
          <button type="button" class="btn btn-primary colorpreset" aria-label="color" value="#99004E" style="background-color: #99004e"></button>
          <button type="button" class="btn btn-primary colorpreset" aria-label="color" value="#400085" style="background-color: #400085"></button>
          <button type="button" class="btn btn-primary colorpreset" aria-label="color" value="#004FCD" style="background-color: #004fcd"></button>
          <button type="button" class="btn btn-primary colorpreset" aria-label="color" value="#1ECBFF" style="background-color: #1ecbff"></button>
          <button type="button" class="btn btn-primary colorpreset" aria-label="color" value="#FF7829" style="background-color: #ff7829"></button>
          <button type="button" class="btn btn-primary colorpreset" aria-label="color" value="#990000" style="background-color: #990000"></button>
          <button type="button" class="btn btn-primary colorpreset" aria-label="color" value="#FF0013" style="background-color: #ff0013"></button>
          <button type="button" class="btn btn-primary colorpreset" aria-label="color" value="#FF0090" style="background-color: #ff0090"></button>
          <button type="button" class="btn btn-primary colorpreset" aria-label="color" value="#99FF00" style="background-color: #99ff00"></button>
          <button type="button" class="btn btn-primary colorpreset" aria-label="color" value="#FFC226" style="background-color: #ffc226"></button>
          <button type="button" class="btn btn-primary colorpreset" aria-label="color" value="#964112" style="background-color: #964112"></button>
          <button type="button" class="btn btn-primary colorpreset" aria-label="color" value="#CB5B57" style="background-color: #cb5b57"></button>
          <button type="button" class="btn btn-primary colorpreset" aria-label="color" value="#FEAFA8" style="background-color: #feafa8"></button>
          <button type="button" class="btn btn-primary colorpreset" aria-label="color" value="#11B03C" style="background-color: #11b03c"></button>
          <button type="button" class="btn btn-primary colorpreset" aria-label="color" value="#017420" style="background-color: #017420"></button>
        </div>

        <input type="color" value="#22b14c" id="color" /><br />
        <button type="button" id="eraser" class="btn btn-warning colorpreset" value="#666666"><IcBaselineEditOff />Eraser</button>
        <button type="button" id="clearCanvas" class="btn btn-danger"><IcBaselineDelete />Clear</button>
        <br />

        <div class="btn-group" role="group" id="undoredo" aria-label="undo redo">
          <button type="button" title="undo" id="undo" class="btn btn-primary"><IcBaselineUndo /></button>
          <button type="button" title="redo" id="redo" class="btn btn-primary"><IcBaselineRedo /></button>
        </div>
        <br />
        <div class="card border-danger mt-3" id="countdown" style="display: none">
          <div class="card-body">
            <div id="countdownValue"></div>
          </div>
        </div>
        <div id="drawoutput"></div>
      </div>

      <div class="col">
        <div class="card mt-1">
          <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" onclick={start} class="btn btn-success"><IcBaselinePlayArrow />Start</button>
            <button type="button" onclick={start} class="btn btn-warning"><IcBaselineSkipNext />Skip emote</button>
            <button type="button" onclick={() => reset()} class="btn btn-danger"><IcBaselineClear />Reset</button>
            <button type="button" class="btn btn-secondary" data-bs-toggle="offcanvas" data-bs-target="#settingsOffcanvas" aria-controls="settingsOffcanvas">
              <IcBaselineSettings /> Settings
            </button>
          </div>

          <div class="card-body">
            <h4><IcBaselineLeaderboard />Leaderboard</h4>
            <div id="drawlb">
              <ul class="list-group" id="drawlblist"></ul>
            </div>

            <div class="card border-danger" id="drawemotecard">
              <div class="card-body" id="drawemotecardbody">
                <span style="font-size: 4vh">Place your facecam here<br /><IcBaselinePhotoCamera style="font-size: 6vh" /></span>
              </div>
            </div>
          </div>
        </div>
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

  #brushpresetsgroup > label {
    display: flex;
    align-items: center;
    -webkit-filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.7));
    filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.7));
  }

  .colorpresetgroup > button {
    width: 40px;
    height: 40px;
    border: 0;
    margin-top: 6px;
    margin-right: 3px;
  }

  .colorpresetgroup {
    margin: 0;
    padding: 0;
    width: 236px;
  }

  #color {
    margin-top: 5px;
    width: 230px;
    height: 50px;
    border-radius: 6px;
    cursor: pointer;
  }

  .draw-emote {
    max-width: 100%;
  }

  #countdown {
    font-size: 3em;
    width: 232px;
    text-align: center;
  }

  #countdown > .card-body {
    padding: 0;
  }

  #drawemotecardbody {
    vertical-align: middle;
    align-items: center;
    text-align: center;
  }

  #drawemotecard {
    display: block;
    position: fixed;
    bottom: 0;
    right: 0;
    width: 300px;
    height: 200px;
  }

  #drawlb {
    height: 75vh;
    overflow: auto;
  }

  #eraser,
  #clearCanvas {
    width: 114px;
  }

  #undo,
  #redo {
    margin-top: 5px;
    width: 116px;
  }

  #drawoutput {
    text-align: center;
    margin-top: 5px;
    width: 230px;
  }

  #LineWidth {
    max-width: 230px;
  }
</style>
