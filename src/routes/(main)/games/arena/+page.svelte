<script>
  import { onMount } from "svelte";
  let elements;
  let html;
  onMount(async () => {
    html = {
      killfeed: document.querySelector("#killfeed"),
      autoFullscreenInput: document.querySelector("input#bAutoFullscreen"),
      teamModeInput: document.querySelector("input#bTeamMode"),

      streamerRogue: document.querySelector("button#streamerRogue"),
      streamerHunter: document.querySelector("button#streamerHunter"),
      streamerMage: document.querySelector("button#streamerMage"),
      streamerPaladin: document.querySelector("button#streamerPaladin"),
      streamerPriest: document.querySelector("button#streamerPriest"),
      streamerShaman: document.querySelector("button#streamerShaman"),

      startBtn: document.querySelector("button#bStartGame"),
      addBotBtn: document.querySelector("button#bAddBot"),
      bulkAddBotBtn: document.querySelector("button#bAddBots"),
      addPassiveBotBtn: document.querySelector("button#bAddDummies"),
      cleanUpBtn: document.querySelector("button#bCleanUp"),
    };
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
    };

    // big red button which starts the game
    html.startBtn.addEventListener("click", () => {
      // init the arena

      try {
        arena.aux.startArena(); // this might throw error
        html.startBtn.disabled = true;
        html.streamerRogue.disabled = true;
        html.streamerHunter.disabled = true;
        html.streamerMage.disabled = true;
        html.streamerPaladin.disabled = true;
        html.streamerPriest.disabled = true;
        html.streamerShaman.disabled = true;
      } catch (error) {
        showToast(error, "warning", 3000);
      }
    });

    html.addBotBtn.addEventListener("click", () => {
      // get info
      let name = document.querySelector("input#sBotName").value.trim();
      document.querySelector("input#sBotName").value = "";
      let pClass = document.querySelector("select#sBotClass").value.toLowerCase();
      // actually attempt to add unit
      try {
        let color = Math.round(Math.random()) ? "yellow" : null; // null = random
        arena.aux.addUnit(name, color, pClass); // might fail if arena is full or is not ready
      } catch (error) {
        showToast(error, "warning", 3000);
      }
    });
    html.bulkAddBotBtn.addEventListener("click", () => {
      // get info
      let count = parseInt(document.getElementById("botsNumber").value, 10);
      if (isNaN(count)) return void console.warn("Bulk add: User input is NaN");

      if (arena.settings.unitLimit && count > arena.settings.unitLimit) {
        showToast(`You've requested too many units! \nWill spawn as many as possible instead.`, "warning", 6000);
        count = arena.settings.unitLimit;
      }
      while (count > 0) {
        count -= 1;
        try {
          arena.aux.addUnit();
        } catch (e) {
          // read the console for the error message
        }
      }
    });

    html.autoFullscreenInput.addEventListener("change", (event) => {
      // allow user to toggle auto-fullscreen when the game starts
      arena.settings.exitFullscreenOnEnd = event.target.checked;
      arena.settings.goFullscreenOnStart = event.target.checked;
    });

    // button: force the restart of arena
    // can also be used after the game ends
    html.cleanUpBtn.addEventListener("click", () => {
      arena.aux.resetArena();
      html.startBtn.disabled = false;
      html.streamerRogue.disabled = false;
      html.streamerHunter.disabled = false;
      html.streamerMage.disabled = false;
      html.streamerPaladin.disabled = false;
      html.streamerPriest.disabled = false;
      html.streamerShaman.disabled = false;
    });

    // button: add a playable unit
    // this unit will be controlled by user!
    html.streamerRogue.addEventListener("click", () => {
      if (arena.player) {
        arena.player.destroy();
        arena.player = null;
      }
      try {
        arena.aux.addPlayer(USER.channel, "#FF0000", "rogue");
      } catch (error) {
        // can fail if player already joined the arena
        showToast(error, "warning", 3000);
      }
    });
    html.streamerHunter.addEventListener("click", () => {
      if (arena.player) {
        arena.player.destroy();
        arena.player = null;
      }
      try {
        arena.aux.addPlayer(USER.channel, "#FF0000", "hunter");
      } catch (error) {
        // can fail if player already joined the arena
        showToast(error, "warning", 3000);
      }
    });
    html.streamerMage.addEventListener("click", () => {
      if (arena.player) {
        arena.player.destroy();
        arena.player = null;
      }
      try {
        arena.aux.addPlayer(USER.channel, "#FF0000", "mage");
      } catch (error) {
        // can fail if player already joined the arena
        showToast(error, "warning", 3000);
      }
    });
    html.streamerPaladin.addEventListener("click", () => {
      if (arena.player) {
        arena.player.destroy();
        arena.player = null;
      }
      try {
        arena.aux.addPlayer(USER.channel, "#FF0000", "paladin");
      } catch (error) {
        // can fail if player already joined the arena
        showToast(error, "warning", 3000);
      }
    });
    html.streamerPriest.addEventListener("click", () => {
      if (arena.player) {
        arena.player.destroy();
        arena.player = null;
      }
      try {
        arena.aux.addPlayer(USER.channel, "#FF0000", "priest");
      } catch (error) {
        // can fail if player already joined the arena
        showToast(error, "warning", 3000);
      }
    });
    html.streamerShaman.addEventListener("click", () => {
      if (arena.player) {
        arena.player.destroy();
        arena.player = null;
      }
      try {
        arena.aux.addPlayer(USER.channel, "#FF0000", "shaman");
      } catch (error) {
        // can fail if player already joined the arena
        showToast(error, "warning", 3000);
      }
    });

    document.querySelector("#sSound").addEventListener("input", (event) => {
      arena.settings.soundVolume = event.target.value / 100;
      document.getElementById("sSoundlabel").innerHTML = event.target.value;
    });
    document.querySelector("#sMusic").addEventListener("input", (event) => {
      arena.settings.musicVolume = event.target.value / 100;
      document.getElementById("sMusiclabel").innerHTML = event.target.value;
    });
    html.teamModeInput.addEventListener("change", (e) => {
      arena.aux.toggleTeamMode(e.target.checked);
    });

    if (!USER.channel) {
      loginButton = new bootstrap.Popover(elements.loginButton);
    }

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

  let aboutModal;

  let USER = {
    channel: "",
    twitchLogin: false,
    access_token: "",
    userID: "",
    platform: "",
  };

  function handleMessage(target, context, msg, self) {
    let input = msg.split(" ").filter(Boolean);
    if (
      (input[0] == "!join" && input[1]) ||
      input[0] == "DonkRogue" ||
      input[0] == "DonkHunter" ||
      input[0] == "DonkMage" ||
      input[0] == "DonkPaladin" ||
      input[0] == "DonkPriest" ||
      input[0] == "DonkShaman"
    ) {
      let chatterclass = "";
      if (input[0] == "!join") {
        chatterclass = input[1].toLowerCase();
      } else {
        chatterclass = input[0];
      }
      if (arena.aux.findUnitByName(context.username)) {
        return;
      } else {
        switch (chatterclass) {
          case "rogue":
          case "DonkRogue":
            arena.aux.addUnit(context.username, context.color || "#FFFFFF", "rogue");
            break;
          case "hunter":
          case "DonkHunter":
            arena.aux.addUnit(context.username, context.color || "#FFFFFF", "hunter");
            break;
          case "mage":
          case "DonkMage":
            arena.aux.addUnit(context.username, context.color || "#FFFFFF", "mage");
            break;
          case "paladin":
          case "DonkPaladin":
            arena.aux.addUnit(context.username, context.color || "#FFFFFF", "paladin");
            break;
          case "priest":
          case "DonkPriest":
            arena.aux.addUnit(context.username, context.color || "#FFFFFF", "priest");
            break;
          case "shaman":
          case "DonkShaman":
            arena.aux.addUnit(context.username, context.color || "#FFFFFF", "shaman");
            break;
          default:
            break;
        }
      }
    }
  } //handleMessage

  let arenaSetup = {
    chatters: [],

    /* ARENA PARAMETERS
      these will be defined by you, and cannot be changed during runtime
      attempting to change the values may lead to some bad stuff happening
    */
    params: {
      showUnitNames: true, // units will have their name shown over their head

      unitScale: 0.75, // new! - allows to make units and their projectiles smaller or bigger
      // does not affect platforms!

      // sound and music
      exponentialSoundLevels: true, // lowers sound levers when there are many units in the arena
      // users may experience earrape when this is disabled and arena has 50+ units

      notify: true,
      notifyDuration: 3333,
      // kill feed notifications
      killfeed: true, // enable/disable top right notifications
      killFeedDuration: 3333, // how long the notification stays on screen (in msecs)
      killFeedHardLimit: 69, // disables killfeed while there are more than this amount of units
      // game might crash when this value is too high (more than 100)

      // canvas
      width: 1280, // this is the base render resolution
      height: 720, // [!] if you need to change the display size of game, consider altering the canvas size by style instead!
      style: "", // you can provide CSS which will be applied to the canvas
      parent: "div#game", // set a query string OR the actual HTMLElement where the canvas will be created
    },

    /* SETTINGS
      these can be changed at any point in time
      safely assign the properties to your HTML controls like buttons or inputs
      ...or dont! - just type your values and leave it
    */
    settings: {
      // fullscreen behavior
      goFullscreenOnStart: false, // maximize canvas when starting the game
      exitFullscreenOnEnd: false, // exit fullscreen when the game ends

      // units
      unitLimit: 999, // max amount of units in the arena (zero = unlimited)
      allowNewUnitsAfterStart: false, // set to "true" if you want to allow joining even after the arena has started
      playerCanWalkWhileFreezeTime: false, // set to "true" to allow player(streamer) to walk before the arena starts
      // useful if you want to let them to try out the controls (they deal no damage to others before start)

      // music levels
      music: true,
      musicVolume: 0.3,
      // sound levels
      sound: true,
      soundVolume: 0.6,
    },

    /* RESOURCES
      you should change all the links so that they point to the files correctly
      you can modify the values (links and frame information), but not the keys!
    */
    resources: {
      image: {
        // background textures
        sky: "/games/pics/arena-bg.png",
        ground: "/games/pics/arena-longbar.png",
        // fullscreen button
        "fs-in": "/games/pics/go-fullscreen.png",
        "fs-out": "/games/pics/exit-fullscreen.png",
        // ability icons
        "icon-blink": "/games/pics/icon-blink.png",
        "icon-grenade": "/games/pics/icon-grenade.png",
        "icon-heal": "/games/pics/icon-heal.png",
        "icon-meteor": "/games/pics/icon-meteor.png",
        "icon-summon": "/games/pics/icon-summon.png",
        "icon-repel": "/games/pics/icon-repel.png",
        // units
        rogue: "/games/pics/donk-rogue.png",
        hunter: "/games/pics/donk-hunter.png",
        mage: "/games/pics/donk-mage.png",
        paladin: "/games/pics/donk-paladin.png",
        priest: "/games/pics/donk-priest.png",
        shaman: "/games/pics/donk-shaman.png",
        dummy: "/games/pics/megalul.png",
      },
      audio: {
        "dummy-attack": "/games/arena/audio/rogue-attack.mp3",
        "dummy-hit": "/games/arena/audio/rogue-hit.mp3",
        "rogue-attack": "/games/arena/audio/rogue-attack.mp3",
        "hunter-attack": "/games/arena/audio/hunter-attack.mp3",
        "mage-attack": "/games/arena/audio/mage-attack.mp3",
        "rogue-hit": "/games/arena/audio/rogue-hit.mp3",
        "hunter-hit": "/games/arena/audio/hunter-hit.mp3",
        "mage-hit": "/games/arena/audio/mage-hit.mp3",
        "paladin-attack": "/games/arena/audio/paladin-attack.mp3",
        "paladin-hit": "/games/arena/audio/paladin-hit.mp3",
        "priest-attack": "/games/arena/audio/priest-attack.mp3",
        "priest-hit": "/games/arena/audio/priest-hit.mp3",
        "shaman-attack": "/games/arena/audio/mage-attack.mp3", //  shamans dont attack, use whatever
        "shaman-hit": "/games/arena/audio/mage-hit.mp3",
        "unit-death": "/games/arena/audio/unit-death.mp3",
        heal: "/games/arena/audio/heal.mp3",
        blink: "/games/arena/audio/blink.mp3",
        grenade: "/games/arena/audio/grenade.mp3",
        "grenade-explode": "/games/arena/audio/grenade-impact.mp3",
        meteor: "/games/arena/audio/meteor.mp3",
        repel: "/games/arena/audio/repel.mp3",
        // music:
        "arena-ost": {
          resources: ["/games/arena/audio/arena-ost-full.mp3"],
          spritemap: {
            "ost-main-begin": {
              start: 123.4,
              end: 136.303,
              loop: false,
            },
            "ost-main-loop": {
              start: 136.303,
              end: 148.15,
              loop: true,
            },
            "ost-suspense-begin": {
              start: 171.58,
              end: 171.93,
              loop: false,
            },
            "ost-suspense-loop": {
              start: 171.93,
              end: 189.72,
              loop: true,
            },
            "ost-finale-begin": {
              start: 189.72,
              end: 189.72,
              loop: false,
            },
            "ost-finale-loop": {
              start: 189.72,
              end: 201.58,
              loop: true,
            },
          },
        },
        "arena-end": "/games/arena/audio/arena-end.mp3",
      },
      spritesheet: {
        // animations
        "hit-melee": ["/games/pics/hit-melee.png", { frameWidth: 32, frameHeight: 32 }],
        "hit-bullet": ["/games/pics/hit-bullet.png", { frameWidth: 16, frameHeight: 16 }],
        "hit-fireball": ["/games/pics/hit-fireball.png", { frameWidth: 32, frameHeight: 32 }],
        "hit-weakmagic": ["/games/pics/hit-weakmagic.png", { frameWidth: 24, frameHeight: 24 }],
        "abil-blink": ["/games/pics/blink2.png", { frameWidth: 64, frameHeight: 64 }],
        "abil-grenade": ["/games/pics/grenade-flying.png", { frameWidth: 16, frameHeight: 16 }],
        meteor: ["/games/pics/meteor.png", { frameWidth: 64, frameHeight: 64 }],
        "meteor-smoke": ["/games/pics/meteor-smoke.png", { frameWidth: 64, frameHeight: 64 }],
        explosion: ["/games/pics/explosion.png", { frameWidth: 128, frameHeight: 128 }],
      },
    },

    /* CALLBACKS
      can be useful for doing stuff when something happens
      replace placeholder functions with your custom ones

      do not add new keys or remove existing ones!
      only modify the values (functions)!

      some callbacks support arguments, see below
    */
    callbacks: {
      // is called when battle starts
      arenaStart: () => {},

      // is called when any unit dies
      unitDied: (victim, killer, weapon) => {
        /*
              "victim" and "killer" are objects
              and have the following structure:
              {
                name: string|any, // unit name, passed by you on creation
                color: string|any,// unit color, passed by you on creation
                class: string,    // unit class = rogue, mage, hunter
                weapon: string,   // unit weapon - a single emoji (for killfeed)
                stats: {
                  "lastKilledBy": object||null, // reference to unit who was the killer
                  "ability": 0, // times ability was used
                  "dead": 0,    // times this unit died (usually 1)
                  "damage": 0,  // amount of damage dealt
                  "tank": 0,    // amount of damage received
                  "restored": 0,// amount of own hp restored, either by self or others
                  "heal": 0,    // amount of given heals - either to self or to others
                  "frag": 0     // amount of units killed
                }
              }
              NOTE: "killer" can be null - if for whatever reason unit killed itself

              "weapon" is string - represents a single emoji of a kill weapon
              may or may not be the same as killer.weapon, use this instead!
            */
      },

      // is called when the battle ends (1 unit left alive)
      arenaEnd: (winner) => {
        /*
              "winner" is an object:
              {
                name: string|any, // unit name, passed by you on creation
                color: string|any,// unit color, passed by you on creation
                class: string,    // unit class = rogue, mage, hunter
                weapon: string,   // unit weapon - a single emoji (for killfeed)
                stats: {
                  "lastKilledBy": object||null, // reference to unit who was the killer
                  "ability": 0, // times ability was used
                  "dead": 0,    // times this unit died (usually 1)
                  "damage": 0,  // amount of damage dealt
                  "tank": 0,    // amount of damage received
                  "restored": 0,// amount of own hp restored, either by self or others
                  "heal": 0,    // amount of given heals - either to self or to others
                  "frag": 0     // amount of units killed
                }
              }
            */
      },

      // is called when the arena restarts (after a game)
      arenaRestart: () => {},
    },
    reset: function () {
      arena.aux.resetArena();
      html.startBtn.disabled = false;
      html.streamerRogue.disabled = false;
      html.streamerHunter.disabled = false;
      html.streamerMage.disabled = false;
      html.streamerPaladin.disabled = false;
      html.streamerPriest.disabled = false;
      html.streamerShaman.disabled = false;
      html.addBotBtn.disabled = false;
      html.bulkAddBotBtn.disabled = false;
    },
  };

  /* global arena, arenaSetup */
  /*
  This file contains some examples on how to setup the buttons
  and inputs for the arena.
*/

  /* EXAMPLES OF CALLBACKS */
  // please define these functions in donk-arena-prerequisites.js!
  // they are here just as an example

  // custom killfeed
  arenaSetup.callbacks.unitDied = (victimObject, killerObject, weapon) => {
    // victim is always there, killer - not always (if null, the death was a suicide probably, or idk)
    const line = document.createElement("div");
    line.classList.add("killfeed-line");
    line.innerHTML = `
    <span style="color: ${killerObject ? killerObject.color : "white"};">${killerObject ? killerObject.name : ""}</span>
    <span style="color: white;">${weapon}</span>
    <span style="color: ${victimObject ? victimObject.color : "white"};">${victimObject ? victimObject.name : ""}</span>`;
    html.killfeed.appendChild(line);
    setTimeout(() => line.remove(), 3000);
  };

  // enable "restart" button when the arena ends
  arenaSetup.callbacks.arenaEnd = (winnerObject) => {
    console.log("The champion is: ", winnerObject);
    document.querySelectorAll("div#controls > div.control-line").forEach((c) => (c.style.display = ""));
  };

  // enable controls when the arena starts
  arenaSetup.callbacks.arenaRestart = () => {
    arenaBetterAi.initialize(arena);
    // html.startBtn.disabled = false;
    // html.streamerRogue.disabled = false;
    // html.streamerHunter.disabled = false;
    // html.streamerMage.disabled = false;
    // html.streamerPaladin.disabled = false;
    // html.streamerPriest.disabled = false;
    // html.streamerShaman.disabled = false;
    // html.addBotBtn.disabled = false;
    // html.bulkAddBotBtn.disabled = false;
    // document.querySelectorAll("div#controls > div.control-line").forEach(c => c.style.display = "");
  };
</script>

<svelte:head>
  <title>chat.vote Games - Arena</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="Fight your chatters in a 'battle royale' arena, where only one can win!" />
  <meta name="keywords" content="chatvote, chat.vote, interactive, games, Twitch, chat" />
  <meta property="og:title" content="chat.vote Games - Arena" />
  <meta property="og:site_name" content="chat.vote Games - Arena" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chat.vote/games/arena/" />
  <meta property="og:image" content="https://screenshot.donk.workers.dev/?url=https://chat.vote/games/arena" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:description" content="Fight your chatters in a 'battle royale' arena, where only one can win!" />

  <script src="/games.js"></script>
  <script src="/donk-arena-classes.min.js"></script>
  <script src="/donk-arena-engine.min.js"></script>
  <script src="/donk-arena-better-ai.min.js"></script>
</svelte:head>

<div class="modal fade" id="howToPlayModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="howToPlayTitle">How to play - Arena</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="howToPlayBody">
        <h4>Streamer controls:</h4>
        <p>Move: arrows<br />Attack: <kbd>Space</kbd><br />Use ability: <kbd>Shift</kbd></p>
        <h4>Chat:</h4>
        Type<kbd>!join [class]</kbd> in chat to join<br />
        <kbd>!join rogue</kbd> or <kbd>DonkRogue</kbd><br />
        <kbd>!join hunter</kbd> or <kbd>DonkHunter</kbd><br />
        <kbd>!join mage</kbd> or <kbd>DonkMage</kbd><br />
        <kbd>!join paladin</kbd> or <kbd>DonkPaladin</kbd><br />
        <kbd>!join priest</kbd> or <kbd>DonkPriest</kbd><br />
        <kbd>!join shaman</kbd> or <kbd>DonkShaman</kbd>
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
  <div class="container-fluid p-0" id="gameDiv">
    <div class="row" id="gameRow">
      <div id="arena">
        <div class="main-part">
          <div class="row">
            <div class="col-9">
              <div id="game">
                <!--PHASER-->
              </div>
              <div>
                <h4>Classes:</h4>
                <ul>
                  <li>
                    Paladin<img src="/games/pics/donk-paladin.png" alt="paladin" style="height: 32px; width: 32px" />
                    <ul>
                      <li>HP: 135, speed: 200, damage: 55, attack speed: 0.7 atk/s, attack type: melee</li>
                      <li>Ability: Repel (gets invulnerability for 2 seconds) - cooldown: 10 sec</li>
                    </ul>
                  </li>
                  <li>
                    Rogue<img src="/games/pics/donk-rogue.png" alt="rogue" style="height: 32px; width: 32px" />
                    <ul>
                      <li>HP: 110, speed: 220, damage: 45, attack speed: 1.8 atk/s, attack type: melee</li>
                      <li>Ability: Blink (teleport to a random spot on map) - cooldown: 5 sec</li>
                    </ul>
                  </li>
                  <li>
                    Hunter<img src="/games/pics/donk-hunter.png" alt="hunter" style="height: 32px; width: 32px" />
                    <ul>
                      <li>HP: 105, speed: 200, damage: 35, attack speed: 2 atk/s, attack type: range (fast bullets)</li>
                      <li>Ability: Grenade (throws a grenade in front of self - explodes on collision with any platform or ground, deals 60 damage) - cooldown: 6 sec</li>
                    </ul>
                  </li>
                  <li>
                    Mage<img src="/games/pics/donk-mage.png" alt="mage" style="height: 32px; width: 32px" />
                    <ul>
                      <li>HP: 100, speed: 140, damage: 45, attack speed: 1 atk/s, attack type: range (big slow thunder balls)</li>
                      <li>Ability: Meteor (spawns a meteor from the sky, it exists for 7 seconds, falls and rolls around, dealing 20 damage on touch) – cooldown: 12 sec</li>
                    </ul>
                  </li>
                  <li>
                    Priest<img src="/games/pics/donk-priest.png" alt="priest" style="height: 32px; width: 32px" />
                    <ul>
                      <li>HP: 90, speed: 160, damage: 25, attack speed: 2.4 atk/s, attack type: range (magic arrows of average speed)</li>
                      <li>Ability: Heal (heals for 30 hp; targets self; when in team mode - targets self if low HP, otherwise targets random teammate with low HP) - cooldown: 10 sec</li>
                    </ul>
                  </li>
                  <li>
                    Shaman<img src="/games/pics/donk-shaman.png" alt="shaman" style="height: 32px; width: 32px" />
                    <ul>
                      <li>HP: 165, speed: 200, has no attack</li>
                      <li>ability: Summon (creates an allied Bog) – cooldown: 7 sec</li>
                      <ul>
                        BOG<img src="/games/pics/megalul.png" alt="megalul" style="height: 28px; width: 28px" />
                        <li>HP: 25, speed: 300, 30 damage, 1.6 atk/s, melee, no ability</li>
                        <li>All stats (kills, damage, etc) of summons are attributed to their summoner. A dead summoner can win the game if their summon kills the last enemy.</li>
                      </ul>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-3">
              <div class="card under-game">
                <div class="card-body under-game-section" id="controls">
                  <h4>Streamer's class</h4>
                  <div class="btn-group" role="group">
                    <button type="button" id="streamerRogue" style="border-bottom-left-radius: 0px" class="btn btn-primary">
                      <img src="/games/pics/donk-rogue.png" alt="rogue" style="height: 24px; width: 24px" class="d-inline-block align-top" /><br />
                      Rogue
                    </button>
                    <button type="button" id="streamerHunter" class="btn btn-primary">
                      <img src="/games/pics/donk-hunter.png" alt="hunter" style="height: 24px; width: 24px" class="d-inline-block align-top" /><br />
                      Hunter
                    </button>
                    <button type="button" id="streamerMage" style="border-bottom-right-radius: 0px" class="btn btn-primary">
                      <img src="/games/pics/donk-mage.png" alt="mage" style="height: 24px; width: 24px" class="d-inline-block align-top" /><br />
                      Mage
                    </button>
                  </div>
                  <div class="btn-group" role="group">
                    <button type="button" id="streamerPaladin" style="border-top-left-radius: 0px" class="btn btn-primary">
                      <img src="/games/pics/donk-paladin.png" alt="paladin" style="height: 24px; width: 24px" class="d-inline-block align-top" /><br />
                      Paladin
                    </button>
                    <button type="button" id="streamerPriest" class="btn btn-primary">
                      <img src="/games/pics/donk-priest.png" alt="priest" style="height: 24px; width: 24px" class="d-inline-block align-top" /><br />
                      Priest
                    </button>
                    <button type="button" id="streamerShaman" style="border-top-right-radius: 0px" class="btn btn-primary">
                      <img src="/games/pics/donk-shaman.png" alt="shaman" style="height: 24px; width: 24px" class="d-inline-block align-top" /><br />
                      Shaman
                    </button>
                  </div>
                  <br />
                  <h5>Add a bot</h5>
                  <div class="input-group mb-3">
                    <input type="text" id="sBotName" class="form-control" placeholder="Name" aria-label="bot bame" />
                    <select class="form-select" id="sBotClass">
                      <option selected>Random class</option>
                      <option value="Rogue">Rogue</option>
                      <option value="Hunter">Hunter</option>
                      <option value="Mage">Mage</option>
                      <option value="Paladin">Paladin</option>
                      <option value="Priest">Priest</option>
                      <option value="Shaman">Shaman</option>
                    </select>
                    <button class="btn btn-outline-secondary" type="button" id="bAddBot"><i class="material-icons notranslate">add</i></button>
                  </div>
                  <h5>Add multiple bots</h5>
                  <div class="input-group mb-3">
                    <input type="number" id="botsNumber" class="form-control" value="5" min="1" aria-label="add many bots" aria-describedby="bAddBots" />
                    <span class="input-group-text">bots</span>
                    <button class="btn btn-outline-secondary" type="button" id="bAddBots"><i class="material-icons notranslate">add</i></button>
                  </div>

                  <br />
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="bTeamMode" name="bTeamMode" />
                    <label class="form-check-label" for="bTeamMode"><i class="material-icons notranslate">group</i>Team mode</label>
                  </div>
                  <br />
                  <!-- <button id="bAddDummies" type="button" class="btn btn-success">Add some passive dummies</button> -->

                  <label for="sMusic" class="form-label"><i class="material-icons notranslate">music_note</i> Music volume: <span id="sMusiclabel">50</span></label>
                  <input type="range" class="form-range" min="0" max="100" value="50" id="sMusic" />
                  <label for="sSound" class="form-label"><i class="material-icons notranslate">volume_up</i> Sound effects volume: <span id="sSoundlabel">50</span></label>
                  <input type="range" class="form-range" min="0" max="100" value="50" id="sSound" />

                  <br />

                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="bAutoFullscreen" name="bAutoFullscreen" />
                    <label class="form-check-label" for="bAutoFullscreen"><i class="material-icons notranslate">fullscreen</i>Auto-enable fullscreen when the game starts</label>
                  </div>
                  <br />
                  <div class="control-line">
                    <button id="bStartGame" type="button" class="btn btn-success">Start game</button>
                    <button id="bCleanUp" type="button" class="btn btn-warning">Clear the arena</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="display: none" class="main-part" id="killfeed"></div>
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

  /* =================================== arena=================================== */

  /* div#arena {
    min-width: 1440px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: row nowrap;
} */

  div.main-part {
    flex: 1 0 auto;
    display: flex;
    flex-flow: column nowrap;
  }

  div#controls {
    display: flex;
    flex-flow: column nowrap;
  }

  div.control-line {
    flex: 1 0 auto;
    display: inline-block;
  }

  div#killfeed {
    min-width: 160px;
    width: 100%;
    max-width: calc(100% - 1280px);
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-end;
    max-height: 30vh;
    overflow-y: auto;
    word-wrap: break-word;
  }

  div.killfeed-line {
    padding: 0.3em 0.1em;
    border: 1px solid silver;
    border-radius: 0.1em;
    width: 90%;
    text-align: right;
    background: rgba(255, 0, 0, 0.1);
    font-weight: bold;
  }

  #bStartGame,
  #bCleanUp {
    margin-top: 5px;
  }

  /* =================================== arena=================================== */
</style>
