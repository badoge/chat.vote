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

    listeners();
    loadwords();
    drawKeyboard();
    shownw();
  });

  let voters = [];

  const keyboardLayout = ["QWERTYUIOP", "ASDFGHJKL", "<ZXCVBNM>"].map((row) => row.split(""));

  let elements = {
    //modals
    grid: document.getElementById("grid"),
    gameDiv: document.getElementById("gameDiv"),

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
  let darkTheme = true;

  let loginExpiredModal, aboutModal;

  let USER = {
    channel: "",
    twitchLogin: false,
    access_token: "",
    userID: "",
    platform: "",
  };
  function handleMessage(target, context, msg, self) {
    let input = msg.split(" ").filter(Boolean);
    if (!WORDLE.nwstarted) {
      if (!voters.includes(context.username)) {
        if (!input[0]) {
          return;
        }
        let word = input[0].toLowerCase();
        if (WORDLE.verifywords) {
          if (WORDLE.words.includes(word)) {
            addWord(word, context.username);
            return;
          }
        } else {
          addWord(word, context.username);
          return;
        }
      }
    }
  } //handleMessage

  let WORDLE = {
    nwletter: 0,
    nwrow: 0,
    nwword: [],
    nwusers: "",
    nwstarted: false,
    wordList: [],
    wordlength: 5,
    guesslimit: 6,
    multiword: false,
    verifywords: true,
    words: [],
    keys: {},
    colors: {
      good: "var(--bs-green)",
      bad: "var(--bs-orange)",
      dead: "var(--bs-dark-border-subtle)",
    },
  }; //WORDLE

  function addWord(word, username) {
    word = escapeString(word).toLowerCase();
    if (word.length != WORDLE.wordlength) {
      return;
    }
    let index = WORDLE.wordList.findIndex((x) => x.word === word);
    if (index == -1) {
      WORDLE.wordList.push({ word: word, usernames: [username] });
    } else {
      WORDLE.wordList[index].usernames.push(username);
    }
    if (!WORDLE.multiword) {
      voters.push(username);
    }
    document.getElementById("wordcount").innerHTML = `Submitted words: ${WORDLE.wordList.length}`;
  } //addWord

  function startnw() {
    if (WORDLE.wordList.length < 2) {
      showToast(`Chat needs to submit at least 2 words before you can start.`, "warning", 6000);
      return;
    } else {
      showToast(`A random word has been picked from chat's suggestions. Start guessing :)`, "success", 6000);
    }
    document.getElementById("nwoutput2").innerHTML = "";
    shownw();
    WORDLE.nwletter = 0;
    WORDLE.nwrow = 0;
    let random = WORDLE.wordList[Math.floor(Math.random() * WORDLE.wordList.length)];
    WORDLE.nwword = random.word.split("");
    WORDLE.nwusers = random.usernames.join(", ");
    WORDLE.nwstarted = true;
    WORDLE.wordList = WORDLE.wordList.filter((list) => list.word !== random.word);
    document.getElementById("wordcount").innerHTML = `Submitted words: ${WORDLE.wordList.length}`;
    document.getElementById("startnw").style.display = "none";
    document.getElementById("resetnw").style.display = "block";
  } //startnw

  function reset() {
    document.getElementById("startnw").style.display = "block";
    document.getElementById("resetnw").style.display = "none";
    WORDLE.wordList = [];
    document.getElementById("wordcount").innerHTML = `Submitted words: 0`;
    document.getElementById("nwoutput").innerHTML = "";
    document.getElementById("nwoutput2").innerHTML = "";
    WORDLE.nwletter = 0;
    WORDLE.nwrow = 0;
    WORDLE.nwword = [];
    WORDLE.nwusers = "";
    WORDLE.words = [];
    WORDLE.nwstarted = false;
    voters = [];
    shownw();
  } //reset

  function shownw() {
    let count = 0;
    let output = `<div class="container nwwrapper">`;
    for (let index1 = 0; index1 < WORDLE.guesslimit; index1++) {
      output += `<div class="row nwrows">`;
      for (let index2 = 0; index2 < WORDLE.wordlength; index2++) {
        output += `<div class="col nwsquare" id="nw${count}"></div>`;
        count++;
      }
      output += `</div>`;
    }
    output += `</div>`;
    document.getElementById("nwoutput").innerHTML = output;

    // new word = reset keyboard colors
    for (const key in WORDLE.keys) {
      WORDLE.keys[key].style.backgroundColor = "";
    }
  } //shownw

  async function loadwords() {
    const response = await fetch(`/games/wordle/words/${WORDLE.wordlength}.json`);
    const json = await response.json();
    WORDLE.words = Object.keys(json);
  } //loadwords

  function pressKey(key) {
    if (WORDLE.wordList.length < 1 || !WORDLE.nwstarted) {
      return;
    }
    let correct = 0;
    if (key == "Enter") {
      let guess = [];
      let tempnwword = [...WORDLE.nwword];
      for (let index = 0; index < WORDLE.wordlength; index++) {
        guess.push(document.getElementById(`nw${WORDLE.nwrow * WORDLE.wordlength + index}`).innerHTML.toLowerCase());
      }
      if (guess.includes("")) {
        return;
      }
      if (WORDLE.verifywords && !WORDLE.words.includes(guess.join(""))) {
        showToast(`"${guess.join("")}" is not a word <img src="/pics/donk.png" alt="donk" style="height:24px; width:24px;">`, "danger", 3000);
        return;
      }
      for (let index = 0; index < WORDLE.wordlength; index++) {
        const letterNode = document.getElementById(`nw${WORDLE.nwrow * WORDLE.wordlength + index}`);
        letterNode.style.backgroundColor = WORDLE.colors.dead;

        if (guess[index] == WORDLE.nwword[index]) {
          letterNode.style.backgroundColor = WORDLE.colors.good;
          let letterindex = tempnwword.indexOf(guess[index]);
          if (letterindex > -1) {
            tempnwword.splice(letterindex, 1);
          }
          correct++;
          if (correct == WORDLE.wordlength) {
            WORDLE.nwstarted = false;
            document.getElementById("resetnw").style.display = "none";
            document.getElementById("nwoutput2").innerHTML = `
          <h2>Word guessed correctly!</h2>
          <p>word submitted by: ${WORDLE.nwusers}</p>
          <button type="button" onclick="startnw()" class="btn btn-success">Pick another word</button>
          <button type="button" onclick="reset()" class="btn btn-warning">Reset</button>`;
          }
        }
      }
      for (let index = 0; index < WORDLE.wordlength; index++) {
        const letterNode = document.getElementById(`nw${WORDLE.nwrow * WORDLE.wordlength + index}`);
        if (tempnwword.includes(guess[index]) && letterNode.style.backgroundColor != WORDLE.colors.good) {
          letterNode.style.backgroundColor = WORDLE.colors.bad;
          let letterindex = tempnwword.indexOf(guess[index]);
          if (letterindex > -1) {
            tempnwword.splice(letterindex, 1);
          }
        }
      }

      // update keys' colors on keyboard:
      for (let index = 0; index < WORDLE.wordlength; index++) {
        const letterNode = document.getElementById(`nw${WORDLE.nwrow * WORDLE.wordlength + index}`);
        const keyNode = WORDLE.keys[letterNode.innerText];
        if (keyNode) {
          for (const color in WORDLE.colors) {
            if (keyNode.style.backgroundColor === WORDLE.colors[color]) {
              // this prevents going from green to yellow if user submits a worse word
              break;
            }
            if (WORDLE.colors[color] === letterNode.style.backgroundColor) {
              keyNode.style.backgroundColor = WORDLE.colors[color];
              break;
            }
          }
        }
      }

      WORDLE.nwrow++;
      if (WORDLE.nwrow == WORDLE.guesslimit) {
        document.getElementById("nwoutput2").innerHTML = `
      <h2>No more guesses left</h2>
      <h2>Word: ${WORDLE.nwword.join("")}</h2>
      <p>word submitted by: ${WORDLE.nwusers}</p>
      <button type="button" onclick="startnw()" class="btn btn-success">Pick another word</button>
      <button type="button" onclick="reset()" class="btn btn-warning">Reset</button>`;
        WORDLE.nwstarted = false;
      }
    }
    if (key == "Backspace" && WORDLE.nwletter - WORDLE.nwrow * WORDLE.wordlength > 0) {
      document.getElementById(`nw${WORDLE.nwletter - 1}`).innerHTML = "";
      WORDLE.nwletter--;
    }
    if (key.length !== 1) {
      return;
    }
    if (key.toLowerCase() >= "a" && key.toLowerCase() <= "z" && WORDLE.nwletter - WORDLE.nwrow * WORDLE.wordlength < WORDLE.wordlength) {
      document.getElementById(`nw${WORDLE.nwletter}`).innerHTML = key.toUpperCase();
      WORDLE.nwletter++;
    }
  } //pressKey

  function listeners() {
    document.getElementById("multiword").onchange = function () {
      voters = [];
      WORDLE.multiword = this.checked;
    };
    document.getElementById("verifywords").onchange = function () {
      WORDLE.verifywords = this.checked;
      if (WORDLE.verifywords) {
        reset();
      }
    };
    document.addEventListener("keydown", function (event) {
      if (event.key) pressKey(event.key);
    }); //wordle keypress
  } //listeners

  function updateLabel(element) {
    document.getElementById(`${element.id}label`).innerHTML = element.value;
    if (document.getElementById(element.id) != element.value) {
      document.getElementById(element.id).value = element.value;
      //updateLabel({ id: "guesslimit", value: 10 }) when loading saved settings
    }
    switch (element.id) {
      case "wordlength":
        WORDLE.wordlength = element.value;
        break;
      case "guesslimit":
        WORDLE.guesslimit = element.value;
        break;
      default:
        break;
    }
    voters = [];
    WORDLE.words = [];
    WORDLE.wordList = [];
    document.getElementById("wordcount").innerHTML = `Submitted words: 0`;
    document.getElementById("nwoutput").innerHTML = "";
    document.getElementById("nwoutput2").innerHTML = "";
    WORDLE.nwletter = 0;
    WORDLE.nwrow = 0;
    WORDLE.nwword = [];
    WORDLE.nwusers = "";
    shownw();
  } //updateLabel

  function drawKeyboard() {
    const kb = document.getElementById("nwkeyboard");
    keyboardLayout.forEach((keyrow) => {
      const row = document.createElement("div");
      row.classList = "nw-keyboard-row";

      for (const key of keyrow) {
        const k = document.createElement("button");
        k.classList = "btn btn-secondary nw-keyboard-key";

        switch (key) {
          case "<": {
            k.classList.add("nw-keyboard-key-wide");
            k.innerHTML = `<span class="material-icons notranslate">backspace</span>`;
            k.addEventListener("click", () => pressKey("Backspace"));
            break;
          }
          case ">": {
            k.classList.add("nw-keyboard-key-wide");
            k.innerHTML = `<span class="material-icons notranslate">send</span>`;
            k.addEventListener("click", () => pressKey("Enter"));
            break;
          }
          default: {
            WORDLE.keys[key] = k;
            k.innerHTML = key;
            k.addEventListener("click", () => pressKey(key));
            break;
          }
        }

        row.appendChild(k);
      }

      kb.appendChild(row);
    });
  }
</script>

<svelte:head>
  <title>chat.vote Games - Not Wordle :)</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="A twist of a well-known game: try to guess a word in several attempts. Your chat will choose the hidden word." />
  <meta name="keywords" content="chatvote, chat.vote, interactive, games, Twitch, chat" />
  <meta property="og:title" content="chat.vote Games - Not Wordle :)" />
  <meta property="og:site_name" content="chat.vote Games - Not Wordle :)" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chat.vote/games/wordle/" />
  <meta property="og:image" content="https://screenshot.donk.workers.dev/?url=https://chat.vote/games/wordle" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:description" content="A twist of a well-known game: try to guess a word in several attempts. Your chat will choose the hidden word." />

  <script src="/games.js"></script>
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

<div class="modal fade" id="howToPlayModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="howToPlayTitle">How to play - Not wordle :)</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="howToPlayBody">
        <p>1. Streamer adjusts settings</p>
        <p>2. Chat starts submitting words by typing in chat</p>
        <p>3. Streamer clicks on "Start" to randomly pick a submitted word</p>
        <p>
          4. Streamer starts guessing the word, should work just like the
          <a target="_blank" rel="noopener noreferrer" href="https://www.nytimes.com/games/wordle/index.html">real site</a>
        </p>
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
  <div id="grid" class="mt-3" style="display: none">
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
        <div class="card h-100 bg-body-tertiary border-light">
          <img src="/games/pics/nw.png" onclick="toggleGrid()" class="card-img-top" alt="Not Wordle :)" />
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

  <div class="container-fluid p-0" id="gameDiv">
    <div class="row mt-2 mb-2" id="navrow">
      <div class="col">
        <div class="card">
          <div class="card-body p-1">
            <button type="button" onclick="toggleGrid()" class="btn btn-primary"><i class="material-icons notranslate">arrow_back</i>Back</button>
            <button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#howToPlayModal"><i class="material-icons notranslate">help_outline</i>How To Play</button>
            <b id="gameName">Not wordle :)</b>
          </div>
        </div>
      </div>
    </div>
    <div class="row" id="gameRow">
      <div class="col-xl-8">
        <div id="nwoutput">
          <!-- words will appear here -->
        </div>
        <div id="nwkeyboard">
          <!-- a nice keyboard will be drawn here -->
        </div>
      </div>
      <div class="col-xl-4">
        <div class="card mb-3">
          <div class="card-header">Settings</div>
          <div class="card-body">
            <label for="wordlength" class="form-label">Word length: <span id="wordlengthlabel">5</span></label>
            <input type="range" class="form-range" min="3" max="12" value="5" oninput="updateLabel(this)" onchange="loadwords()" id="wordlength" />

            <label for="guesslimit" class="form-label">Guess limit: <span id="guesslimitlabel">6</span></label>
            <input type="range" class="form-range" min="1" max="12" value="6" oninput="updateLabel(this)" id="guesslimit" />

            <div class="form-check form-switch">
              <input type="checkbox" class="form-check-input" id="multiword" aria-describedby="multiworddesc" />
              <label class="form-check-label" for="multiword"><i class="material-icons notranslate">plus_one</i> Allow each viewer to suggest more than 1 word</label>
              <small id="multiworddesc" class="form-text text-body-secondary"><br />Each viewer can submit 1 word only by default.</small>
            </div>

            <div class="form-check form-switch">
              <input checked type="checkbox" class="form-check-input" id="verifywords" aria-describedby="verifywordsdesc" />
              <label class="form-check-label" for="verifywords"><i class="material-icons notranslate">spellcheck</i> Check if words are real</label>
              <small id="verifywordsdesc" class="form-text text-body-secondary"
                ><br />If this option is disabled viewers will be able to add any word even if it does not exist in the dictionary.</small
              >
            </div>
          </div>
        </div>

        <div class="card mb-3">
          <div class="card-body">
            <span id="wordcount">Submitted words: 0</span>
          </div>
        </div>

        <button type="button" id="startnw" onclick="startnw()" class="btn btn-success">Start</button>
        <button type="button" id="resetnw" onclick="reset()" class="btn btn-warning">Reset</button>

        <div id="nwoutput2"></div>
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

  .nwwrapper {
    margin: 0 auto;
    width: fit-content;
    overflow: hidden;
    padding: 30px;
    box-shadow: 1px 4px 8px #000000;
    position: relative;
    background-color: #6b6b6b;
    float: left;
  }

  .nwrows {
    height: fit-content;
    width: fit-content;
  }

  .nwsquare {
    margin: 5px;
    width: 4vw;
    height: 4vw;
    padding: 0px;
    text-align: center;
    font-size: 3vw;
    font-weight: bold;
    border-width: 2px;
    border-color: #000000;
    border-style: solid;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    transition:
      background-color 0.25s ease-in,
      font-size 0.1s ease-in;
  }
  .nwsquare:empty {
    font-size: 0px;
  }

  #nwoutput {
    width: 100%;
    display: flex;
  }

  /* keyboard */

  #nwkeyboard {
    margin: 1em 0;
    display: flex;
    flex-flow: column nowrap;
    gap: 4px;
  }
  .nw-keyboard-row {
    display: flex;
    flex-flow: row nowrap;
    align-items: stretch;
    justify-content: center;
    gap: 4px;
  }
  .nw-keyboard-key {
    min-width: 2em;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 0.75rem;
    border-radius: 0.25rem;
    font-size: 1.5rem;
    font-weight: bold;
    text-shadow: 0px 0px 2px black;
    cursor: pointer;
    transition: background-color 0.25s ease-in;
  }
  .nw-keyboard-key-wide {
    min-width: 2.5em;
  }
</style>
