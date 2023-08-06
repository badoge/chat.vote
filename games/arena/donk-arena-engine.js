/* jshint unused:vars */
/*jshint esversion: 9 */
/* globals
  Phaser, arenaSetup,
  ArenaNotification, ArenaKillFeedNotification,
  ArenaUnitFactory
*/

const arena = {
  params: Object.freeze(arenaSetup.params),
  settings: arenaSetup.settings,
  callbacks: arenaSetup.callbacks,
  units: new Set(),
  teams: {
    red: {
      units: new Set(),
      alive: new Set(),
    },
    blue: {
      units: new Set(),
      alive: new Set(),
    },
  },
  summons: new Set(),
  unitStats: new Map(),
  player: null,
  groups: {
    killfeedDelayer: null,
    projectiles: null,
    platforms: null,
    neutral: null,
    units: null,
    units_red: null,
    units_blue: null,
  },
  buttons: {},
  cursors: null,
  engine: null,
  source: null,
  particles: null,
  ui: {
    abilityIcon: null,
    cooldownMask: null,
  },
  internals: {
    isTeamMode: false,
    validTeams: ["red", "blue"],
    globalScale: arenaSetup.params.unitScale || 1,
    aliveReporter: new Set(),
    plugdj: null,
    randomNamePool: ["Forsen clone #", "Twitch viewer #", "Pepega #"],
    notificationLastObject: { active: false },
    notificationLastY: 128,
    killFeedLastObject: { active: false },
    killFeedLastY: 64,
    HEALTHBAR_COLOR_FLAGS: {
      RED: 0xff0000,
      GREEN: 0x00ff00,
    },
    KILLFEED_COLLISION_MASKS: {
      PADDER: 0b1000,
      BIGTOAST: 0b0100,
      TOAST: 0b0010,
      DYING: 0b0001,
    },
    playerStub: {
      dead: true,
    },
  },
  aux: {
    findUnitByName: function (name) {
      if (!name) {
        return null;
      } // can happen on projectile collision with a non-unit
      for (const unit of arena.units) {
        if (unit.name === name) {
          return unit;
        }
      }
      for (const unit of arena.teams.red.units) {
        if (unit.name === name) {
          return unit;
        }
      }
      for (const unit of arena.teams.blue.units) {
        if (unit.name === name) {
          return unit;
        }
      }
      console.warn(`Unit [name:${name}] not found!`);
      return null;
    },
    findUnitByGuid: function (guid) {
      if (!guid) {
        return null;
      } // can happen on projectile collision with a non-unit
      for (const unit of arena.units) {
        if (unit.guid === guid) {
          return unit;
        }
      }
      for (const unit of arena.teams.red.units) {
        if (unit.guid === guid) {
          return unit;
        }
      }
      for (const unit of arena.teams.blue.units) {
        if (unit.guid === guid) {
          return unit;
        }
      }
      console.warn(`Unit [guid:${guid}] not found!`);
      return null;
    },
    getUnitStatsByName: function (name) {
      for (const unit of arena.unitStats) {
        if (unit.name === name) {
          return unit;
        }
      }
      console.warn(`Stats: Unit [name:${name}] not found!`);
      return null;
    },
    getSize: () => arena.units.size + arena.teams.blue.units.size + arena.teams.red.units.size,
    getTeamSize: (team) => {
      try {
        return arena.teams[team].units.size;
      } catch (e) {
        console.error(e);
        throw new Error(`Team identifier [${team}] is invalid!`);
      }
    },
    getTotalSize: () => arena.aux.getSize() + arena.summons.size,
    getCanvas: () => arena.engine.canvas,
    addUnit: function (name, color, pClass = "-", ignoreLimit = false, team = "") {
      if (arena.state !== "waiting" && !arena.settings.allowNewUnitsAfterStart) {
        console.warn("The arena is not accepting new units! | Set arena.settings.allowNewUnitsAfterStart to override this behavior.");
        throw new Error("Cannot join the Arena right now!");
      }
      if (!ignoreLimit && arena.settings.unitLimit) {
        if (arena.settings.unitLimit <= arena.aux.getSize()) {
          console.warn("Unit limit reached! Cannot add new unit. | Limit = " + arena.settings.unitLimit);
          throw new Error("Too many units!");
        }
      }
      if (!name) {
        name = arena.internals.randomNamePool[Math.floor(Math.random() * arena.internals.randomNamePool.length)] + String(Math.random()).slice(2, 7).padStart(5, "0");
      }
      let ArenaUnitClass = ArenaUnitFactory(pClass);
      if (!ArenaUnitClass) {
        pClass = ["rogue", "hunter", "mage", "paladin", "shaman", "priest"][Math.floor(Math.random() * 6)];
      }
      const peepo = new (ArenaUnitFactory(pClass))(
        arena.source,
        arena.params.width * (0.1 + Math.random() * 0.8),
        Math.random() * arena.params.height * 0.9,
        name,
        color,
        team.toLowerCase()
      );
      console.log("New unit added: ", peepo.name, peepo.class);
      return peepo;
    },
    addPlayer: function (name, color, pClass, team) {
      if (arena.player) {
        throw new Error("Player already exists! Restart the arena to clear the reference.");
      }
      let peepo = arena.aux.addUnit(name, color, pClass, true, team).setControllable();
      if (arena.settings.playerCanWalkWhileFreezeTime) {
        peepo.setFrozen(false);
      }
      return peepo;
    },
    startArena: function () {
      if (!arena.internals.isTeamMode) {
        if (arena.units.size < 2) {
          console.warn("Need at least 2 participants to start!");
          throw new Error("Not enough units to start Arena!");
        }
      } else {
        if (!arena.teams.blue.units.size || !arena.teams.red.units.size) {
          console.warn("[team mode] Need at least 1 unit on each team to start!");
          throw new Error("One of the teams is empty!");
        }
      }
      arena.source.events.emit("arena-start");
    },
    resetArena: function () {
      if (arena.source && arena.source.events) {
        arena.source.events.emit("arena-cleanup");
      } else {
        console.log("arena not ready");
      }
    },
    toggleTeamMode: function (state) {
      if (typeof state === "undefined") {
        state = !arena.internals.isTeamMode;
      } else {
        state = Boolean(state);
      }
      if (arena.internals.isTeamMode !== state) {
        console.log("[Arena] Team mode has been toggled; will have to clear the arena.");
        arena.source.events.emit("arena-cleanup");
      }
      arena.internals.isTeamMode = state;
      return arena.internals.isTeamMode;
    },
  },
  state: "init",
};

// need phaser.js for this to run:
arena.engine = new Phaser.Game({
  type: Phaser.AUTO,
  width: arena.params.width,
  height: arena.params.height,
  powerPreference: "high-performance",
  canvasStyle: arena.params.style || null,
  parent: typeof arena.params.parent === "string" ? document.querySelector(arena.params.parent) : arena.params.parent,
  callbacks: {
    postBoot: (game) => {
      // fullscreening the canvas
      game.canvas.addEventListener("fullscreenchange", () => {
        if (game.canvas === document.fullscreenElement) {
          arena.buttons.fullscreen.setTexture("fs-out");
        } else {
          arena.buttons.fullscreen.setTexture("fs-in");
        }
      });
    },
  },
  scene: {
    // MAIN SCENE - arena, units, projectiles
    active: true,
    physics: {
      arcade: {
        gravity: { y: 999 },
        friction: { x: 500 },
        enableBody: true,
        debug: false,
      },
      matter: {
        gravity: { y: -0.2 },
        restitution: 0,
        debug: false,
      },
    },
    /* PRELOAD - FETCH DATA BEFORE CREATE */
    preload: function () {
      // load all the resources
      Object.keys(arenaSetup.resources).forEach((res) => {
        Object.keys(arenaSetup.resources[res]).forEach((key) => {
          switch (res) {
            case "audio": // audio sprites need some special love
              if (typeof arenaSetup.resources[res][key] === "object") {
                this.load.audioSprite(key, arenaSetup.resources[res][key]);
              } else {
                this.load.audio(key, arenaSetup.resources[res][key]);
              }
              break;
            default: // images, imgsprites
              if (Array.isArray(arenaSetup.resources[res][key])) {
                this.load[res](key, ...arenaSetup.resources[res][key]);
              } else {
                this.load[res](key, arenaSetup.resources[res][key]);
              }
              break;
          }
        });
      });
    },

    /* CREATE - INIT APPLICATION */
    create: function () {
      arena.source = this;

      this.sound.pauseOnBlur = false;
      // waytoodank incident fix:
      this.sound.getCustomExponent = arena.params.exponentialSoundLevels
        ? () => 0.045 + Math.exp(-0.05 * (arena.units.size + arena.teams.blue.units.size + arena.teams.red.units.size))
        : () => 1;
      // sounds
      this.sound.add("dummy-attack");
      this.sound.add("dummy-hit");
      this.sound.add("rogue-attack");
      this.sound.add("rogue-hit");
      this.sound.add("hunter-attack");
      this.sound.add("hunter-hit");
      this.sound.add("mage-attack");
      this.sound.add("mage-hit");
      this.sound.add("paladin-attack");
      this.sound.add("paladin-hit");
      this.sound.add("shaman-attack");
      this.sound.add("shaman-hit");
      this.sound.add("priest-attack");
      this.sound.add("priest-hit");
      this.sound.add("unit-death");
      this.sound.add("heal");
      this.sound.add("blink");
      this.sound.add("grenade");
      this.sound.add("grenade-explode");
      this.sound.add("meteor");
      this.sound.add("repel");
      // music
      arena.internals.plugdj = Phaser.Sound.SoundManagerCreator.create(this.game);
      arena.internals.plugdj.pauseOnBlur = false;
      arena.internals.plugdj.addAudioSprite("arena-ost");
      arena.internals.plugdj.add("arena-end");
      setInterval(() => {
        arena.internals.plugdj.setMute(!arena.settings.music);
        arena.internals.plugdj.setVolume(arena.settings.musicVolume);
      }, 100);

      // design
      this.add.image(0, 0, "sky").setOrigin(0, 0).setDisplaySize(arena.params.width, arena.params.height);

      // ui
      if (document.body.requestFullscreen) {
        // fullscreen api button
        arena.buttons.fullscreen = this.add
          .image(arena.params.width - 4, arena.params.height - 4, "fs-in")
          .setScale(0.4)
          .setDepth(99)
          .setOrigin(1, 1)
          .setTintFill(0xffffff)
          .setInteractive();
        arena.buttons.fullscreen.on("pointerover", () => {
          arena.buttons.fullscreen.setTintFill(0xcccc66);
        });
        arena.buttons.fullscreen.on("pointerout", () => {
          arena.buttons.fullscreen.setTintFill(0xffffff);
        });
        arena.buttons.fullscreen.on("pointerdown", () => {
          let isInFullscreen = arena.engine.canvas === document.fullscreenElement;
          if (isInFullscreen) {
            document.exitFullscreen();
          } else {
            arena.engine.canvas.requestFullscreen();
          }
        });
      }

      // attack and ability projectiles - animations
      this.anims.create({
        key: "anim-hit-melee",
        skipMissedFrames: true,
        frames: this.anims.generateFrameNumbers("hit-melee", { start: 0, end: 3 }),
        duration: 100,
      });
      this.anims.create({
        key: "anim-hit-bullet",
        skipMissedFrames: true,
        frames: this.anims.generateFrameNumbers("hit-bullet"),
        repeat: -1,
      });
      this.anims.create({
        key: "anim-hit-fireball",
        skipMissedFrames: true,
        frames: this.anims.generateFrameNumbers("hit-fireball"),
        repeat: -1,
      });
      this.anims.create({
        key: "anim-hit-weakmagic",
        skipMissedFrames: true,
        frames: this.anims.generateFrameNumbers("hit-weakmagic"),
        repeat: -1,
      });
      this.anims.create({
        key: "anim-abil-blink",
        skipMissedFrames: true,
        frames: this.anims.generateFrameNumbers("abil-blink"),
        duration: 222,
      });
      // grenade ability
      this.anims.create({
        key: "anim-abil-grenade",
        skipMissedFrames: true,
        frames: this.anims.generateFrameNumbers("abil-grenade"),
        repeat: -1,
      });
      this.anims.create({
        key: "anim-explosion",
        skipMissedFrames: true,
        frames: this.anims.generateFrameNumbers("explosion"),
        repeat: 0,
      });
      // meteor ability
      this.anims.create({
        key: "anim-meteor",
        skipMissedFrames: true,
        frames: this.anims.generateFrameNumbers("meteor"),
        repeat: -1,
      });
      this.anims.create({
        key: "anim-meteor-smoke",
        skipMissedFrames: true,
        frames: this.anims.generateFrameNumbers("meteor-smoke"),
      });

      // particle emitters
      arena.particles = [
        // higher order = more particles
        this.add.particles("meteor-smoke", 0),
        this.add.particles("meteor-smoke", 1),
        this.add.particles("meteor-smoke", 3),
        this.add.particles("meteor-smoke", 2),
      ];

      // platforms
      arena.groups.platforms = this.physics.add.staticGroup();
      // main (ground) platform
      let basePlatform = arena.groups.platforms.create(arena.params.width * 0.5, arena.params.height, "ground");
      basePlatform.setDisplaySize(arena.params.width * 1.2, basePlatform.height * 2).refreshBody();
      // platforms in the air
      // top two ones
      arena.groups.platforms
        .create(arena.params.width * 0.05, arena.params.height * 0.35, "ground")
        .setScale(0.8, 1)
        .refreshBody();
      arena.groups.platforms
        .create(arena.params.width * 0.95, arena.params.height * 0.35, "ground")
        .setScale(0.8, 1)
        .refreshBody();
      // the mid ones
      arena.groups.platforms
        .create(arena.params.width * 0.24, arena.params.height * 0.58, "ground")
        .setScale(0.75, 1)
        .refreshBody();
      arena.groups.platforms
        .create(arena.params.width * 0.76, arena.params.height * 0.58, "ground")
        .setScale(0.75, 1)
        .refreshBody();
      // the lowest ones
      arena.groups.platforms
        .create(arena.params.width * 0, arena.params.height * 0.77, "ground")
        .setScale(0.7, 1)
        .refreshBody();
      arena.groups.platforms
        .create(arena.params.width * 1, arena.params.height * 0.77, "ground")
        .setScale(0.7, 1)
        .refreshBody();
      arena.groups.platforms
        .create(arena.params.width * 0.5, arena.params.height * 0.77, "ground")
        .setScale(0.8, 1)
        .refreshBody();

      // unit types
      arena.groups.units = this.physics.add.group();
      arena.groups.units_red = this.physics.add.group();
      arena.groups.units_blue = this.physics.add.group();
      arena.groups.controllable = this.physics.add.group();
      arena.groups.projectiles = this.physics.add.group();

      // kill feed
      arena.groups.killfeedDelayer = this.matter.add.rectangle(arena.params.width / 2, -12, arena.params.width * 3, 24, {
        isStatic: true,
        collisionFilter: {
          // this is getting too dank
          category: arena.internals.KILLFEED_COLLISION_MASKS.PADDER,
          mask: arena.internals.KILLFEED_COLLISION_MASKS.TOAST | arena.internals.KILLFEED_COLLISION_MASKS.BIGTOAST,
        },
      });

      // ui: ability cooldown
      arena.ui.abilityIcon = this.add.image(4, 4).setOrigin(0, 0).setScale(0.5).setTint(0x696969);
      arena.ui.cooldownMask = this.make.graphics();
      arena.ui.cooldownMask.fillPath();

      // controls
      arena.cursors = this.input.keyboard.createCursorKeys();

      // event: restart, clean up
      this.events.on("arena-cleanup", () => {
        console.log("Arena: cleanup is in order, re-initializing everything.");
        // stop all sounds
        arena.source.sound.stopAll();
        arena.internals.plugdj.stopAll();

        // remove all the players
        arena.internals.aliveReporter.clear();
        arena.teams.blue.alive.clear();
        arena.teams.red.alive.clear();
        arena.unitStats.clear();
        for (const unit of arena.units) {
          unit.destroy();
        }
        for (const unit of arena.teams.red.units) {
          unit.destroy();
        }
        for (const unit of arena.teams.blue.units) {
          unit.destroy();
        }
        for (const unit of arena.summons) {
          unit.destroy();
        }
        delete arena.player;

        // remove the end game screen
        arena.source.scene.remove("gameover");
        arena.source.physics.world.timeScale = 1;

        // remove older event listeners - if any unfired left
        arena.source.events.off("arena-finished");
        arena.source.events.off("arena-top2");
        arena.source.events.off("arena-top10");
        arena.source.events.off("arena-last-red");
        arena.source.events.off("arena-last-blue");

        // ready for battle!
        arena.state = "waiting";
        if (arena.callbacks.arenaRestart) {
          arena.callbacks.arenaRestart();
        }
      });

      // event: start the fight
      this.events.on("arena-start", () => {
        console.log("Arena: the fight begins!");
        arena.state = "started";
        if (arena.params.notify) {
          new ArenaNotification().fillWithText("Trickle in!", "#fff").show(arena.params.notifyDuration);
        }

        if (arena.player) {
          // reset cooldowns for player
          arena.player.ability.lastUsed = 0;
          arena.player.ability.availableAt = 0;
          // and also reset their stats
          Object.keys(arena.player.stats).forEach((s) => {
            arena.player.stats[s] = 0;
          });
          arena.player.stats.lastKilledBy = null;
          // player might have summoned something, destroy these
          for (const u of arena.summons) u.destroy();
        }

        [
          // init all units
          arena.units,
          arena.teams.red.units,
          arena.teams.blue.units,
        ].forEach((group) =>
          group.forEach((u) => {
            u.setFrozen(false);
            u.initializeBot(arena.source.time.now);
          })
        );
        arena.internals.plugdj.playAudioSprite("arena-ost", "ost-main-begin");
        arena.internals.plugdj.queuedTrack = setTimeout(() => {
          arena.internals.plugdj.playAudioSprite("arena-ost", "ost-main-loop", { loop: true });
        }, 999 * (arenaSetup.resources.audio["arena-ost"].spritemap["ost-main-begin"].end - arenaSetup.resources.audio["arena-ost"].spritemap["ost-main-begin"].start));
        if (arena.settings.goFullscreenOnStart && arena.engine.canvas.requestFullscreen) {
          arena.engine.canvas.requestFullscreen();
        }

        // too many killfeed notifications lags the game
        let totalCount = [
          // init all units
          arena.units,
          arena.teams.red.units,
          arena.teams.blue.units,
        ].reduce((ac, cv) => ac + cv.size, 0);
        if (totalCount > arena.params.killFeedHardLimit) {
          new ArenaKillFeedNotification({
            name: `Kill feed will be disabled while there are more than ${arena.params.killFeedHardLimit} units!`,
            color: "white",
          });
        }

        // add events for top10 and top2 situations
        arena.source.events.once("arena-top10", () => {
          clearTimeout(arena.internals.plugdj.queuedTrack);
          arena.internals.plugdj.stopAll();
          arena.internals.plugdj.playAudioSprite("arena-ost", "ost-suspense-begin");
          arena.internals.plugdj.queuedTrack = setTimeout(() => {
            arena.internals.plugdj.playAudioSprite("arena-ost", "ost-suspense-loop", { loop: true });
          }, 999 * (arenaSetup.resources.audio["arena-ost"].spritemap["ost-suspense-begin"].end - arenaSetup.resources.audio["arena-ost"].spritemap["ost-suspense-begin"].start));
          if (arena.params.notify) {
            new ArenaNotification().fillWithText("Top 10 situation!", "#ff0").show(arena.params.notifyDuration);
          }
        });
        arena.source.events.once("arena-top2", () => {
          clearTimeout(arena.internals.plugdj.queuedTrack);
          arena.internals.plugdj.stopAll();
          arena.internals.plugdj.playAudioSprite("arena-ost", "ost-finale-begin");
          arena.internals.plugdj.queuedTrack = setTimeout(() => {
            arena.internals.plugdj.playAudioSprite("arena-ost", "ost-finale-loop", { loop: true });
          }, 999 * (arenaSetup.resources.audio["arena-ost"].spritemap["ost-finale-begin"].end - arenaSetup.resources.audio["arena-ost"].spritemap["ost-finale-begin"].start));
          if (arena.params.notify) {
            new ArenaNotification().fillWithText("1v1 SHOWDOWN", "#f33").show(arena.params.notifyDuration);
          }
        });
        // team based events: last red and last blue
        if (arena.teams.red.units.size > 1) {
          arena.source.events.once("arena-last-red", () => {
            clearTimeout(arena.internals.plugdj.queuedTrack);
            arena.internals.plugdj.stopAll();
            arena.internals.plugdj.playAudioSprite("arena-ost", "ost-finale-begin");
            arena.internals.plugdj.queuedTrack = setTimeout(() => {
              arena.internals.plugdj.playAudioSprite("arena-ost", "ost-finale-loop", { loop: true });
            }, 999 * (arenaSetup.resources.audio["arena-ost"].spritemap["ost-finale-begin"].end - arenaSetup.resources.audio["arena-ost"].spritemap["ost-finale-begin"].start));
            if (arena.params.notify) {
              new ArenaNotification().fillWithText("Last man standing", "#f66").show(arena.params.notifyDuration);
            }
          });
        }

        if (arena.teams.blue.units.size > 1) {
          arena.source.events.once("arena-last-blue", () => {
            clearTimeout(arena.internals.plugdj.queuedTrack);
            arena.internals.plugdj.stopAll();
            arena.internals.plugdj.playAudioSprite("arena-ost", "ost-finale-begin");
            arena.internals.plugdj.queuedTrack = setTimeout(() => {
              arena.internals.plugdj.playAudioSprite("arena-ost", "ost-finale-loop", { loop: true });
            }, 999 * (arenaSetup.resources.audio["arena-ost"].spritemap["ost-finale-begin"].end - arenaSetup.resources.audio["arena-ost"].spritemap["ost-finale-begin"].start));
            if (arena.params.notify) {
              new ArenaNotification().fillWithText("Last man standing", "#6af").show(arena.params.notifyDuration);
            }
          });
        }

        // end game event
        arena.source.events.once("arena-finished", (winner) => {
          console.log("Arena: the war is over, and the winner is:", winner);
          // freeze everyone
          [arena.units, arena.summons, arena.teams.blue.units, arena.teams.red.units].forEach((group) =>
            group.forEach((unit) => {
              unit.setFrozen(true);
            })
          );
          // cool transition effect
          arena.source.physics.world.timeScale = 5; // slow down everything
          arena.source.cameras.main.fadeOut(4444, 0, 0, 0);
          // play the music
          clearTimeout(arena.internals.plugdj.queuedTrack);
          arena.internals.plugdj.stopAll();
          arena.internals.plugdj.play("arena-end");
          // create the scene after the fade:
          setTimeout(() => {
            arena.state = "finished";
            arena.source.events.emit("arena-show-winner", winner);
            arena.engine.scene.add(
              "gameover",
              {
                create: function () {
                  // background
                  this.add.rectangle(0, 0, arena.params.width, arena.params.height, "black", 0.7).setOrigin(0, 0);

                  // show the champion
                  let winnerName = this.add
                    .text(arena.params.width * 0.44, arena.params.height * 0.51, winner.name, {
                      font: "bold 100px Arial",
                      fill: winner.color,
                      boundsAlignH: "left",
                      boundsAlignV: "bottom",
                      textAlign: "left",
                    })
                    .setShadow(0, 0, "#000", 4)
                    .setOrigin(0, 1)
                    .setScale(1.3);
                  while (winnerName.displayWidth > arena.params.width * 0.5) winnerName.setScale(winnerName.scale * 0.9);
                  this.add
                    .text(arena.params.width * 0.44, arena.params.height * 0.17, "The Champion", {
                      font: "bold 64px Arial",
                      fill: "#ffc",
                      boundsAlignH: "left",
                      boundsAlignV: "top",
                      textAlign: "left",
                    })
                    .setShadow(0, 0, "#cb0", 4)
                    .setOrigin(0, 0);
                  this.add.image(arena.params.width * 0.25, arena.params.height * 0.3, winner.class).setScale(3);

                  // get some good stats:
                  const leaders = {
                    frag: { stats: { frag: -1 } },
                    damage: { stats: { damage: -1 } },
                    ability: { stats: { ability: -1 } },
                  };
                  Object.keys(leaders).forEach((stat) => {
                    arena.unitStats.forEach((unit) => {
                      if (unit.stats[stat] > leaders[stat].stats[stat]) {
                        leaders[stat] = unit;
                      }
                    });
                  });
                  // quirk: replace third stat with "killed streamer" if applicable
                  let funnyStat = {
                    text: "The Proficient",
                    textExplain: "Most abilities used: #",
                    source: leaders.ability,
                  };
                  if (arena.player && arena.player.stats.lastKilledBy) {
                    funnyStat.text = "The Stream Saver";
                    funnyStat.textExplain = "Killed the streamer!";
                    funnyStat.source = arena.player.stats.lastKilledBy;
                  }

                  // show the top damage dealer
                  let ravagerName = this.add
                    .text(arena.params.width * 0.13, arena.params.height * 0.82, leaders.damage.name, {
                      font: "bold 36px Arial",
                      fill: leaders.damage.color,
                      boundsAlignH: "left",
                      boundsAlignV: "bottom",
                      textAlign: "left",
                    })
                    .setShadow(0, 0, "#000", 4)
                    .setOrigin(0, 0.5)
                    .setScale(1.3);
                  while (ravagerName.displayWidth > arena.params.width * 0.2) ravagerName.setScale(ravagerName.scale * 0.8);
                  this.add
                    .text(arena.params.width * 0.13, arena.params.height * 0.73, "The Ravager", {
                      font: "bold 24px Arial",
                      fill: "white",
                      boundsAlignH: "left",
                      boundsAlignV: "top",
                      textAlign: "left",
                    })
                    .setShadow(0, 0, "#ccc", 4)
                    .setOrigin(0, 0);
                  this.add
                    .text(arena.params.width * 0.13, arena.params.height * 0.88, "Most damage dealt: " + leaders.damage.stats.damage, {
                      font: "bold 16px Arial",
                      fill: "#aaa",
                      boundsAlignH: "left",
                      boundsAlignV: "top",
                      textAlign: "left",
                    })
                    .setShadow(0, 0, "#000", 4)
                    .setOrigin(0, 0);
                  this.add.image(arena.params.width * 0.07, arena.params.height * 0.8, leaders.damage.class).setScale(1.3);

                  // show the top fragger
                  let fraggerName = this.add
                    .text(arena.params.width * 0.46, arena.params.height * 0.82, leaders.frag.name, {
                      font: "bold 36px Arial",
                      fill: leaders.frag.color,
                      boundsAlignH: "left",
                      boundsAlignV: "bottom",
                      textAlign: "left",
                    })
                    .setShadow(0, 0, "#000", 4)
                    .setOrigin(0, 0.5)
                    .setScale(1.3);
                  while (fraggerName.displayWidth > arena.params.width * 0.2) fraggerName.setScale(fraggerName.scale * 0.8);
                  this.add
                    .text(arena.params.width * 0.46, arena.params.height * 0.73, "The Killer", {
                      font: "bold 24px Arial",
                      fill: "white",
                      boundsAlignH: "left",
                      boundsAlignV: "top",
                      textAlign: "left",
                    })
                    .setShadow(0, 0, "#ccc", 4)
                    .setOrigin(0, 0);
                  this.add
                    .text(arena.params.width * 0.46, arena.params.height * 0.88, "Most kills: " + leaders.frag.stats.frag, {
                      font: "bold 16px Arial",
                      fill: "#aaa",
                      boundsAlignH: "left",
                      boundsAlignV: "top",
                      textAlign: "left",
                    })
                    .setShadow(0, 0, "#000", 4)
                    .setOrigin(0, 0);
                  this.add.image(arena.params.width * 0.4, arena.params.height * 0.8, leaders.frag.class).setScale(1.3);

                  // show the third stat, whatever it is
                  let lastStatName = this.add
                    .text(arena.params.width * 0.79, arena.params.height * 0.82, funnyStat.source.name, {
                      font: "bold 36px Arial",
                      fill: funnyStat.source.color,
                      boundsAlignH: "left",
                      boundsAlignV: "bottom",
                      textAlign: "left",
                    })
                    .setShadow(0, 0, "#000", 4)
                    .setOrigin(0, 0.5)
                    .setScale(1.3);
                  while (lastStatName.displayWidth > arena.params.width * 0.2) lastStatName.setScale(lastStatName.scale * 0.8);
                  this.add
                    .text(arena.params.width * 0.79, arena.params.height * 0.73, funnyStat.text, {
                      font: "bold 24px Arial",
                      fill: "white",
                      boundsAlignH: "left",
                      boundsAlignV: "top",
                      textAlign: "left",
                    })
                    .setShadow(0, 0, "#ccc", 4)
                    .setOrigin(0, 0);
                  this.add
                    .text(arena.params.width * 0.79, arena.params.height * 0.88, funnyStat.textExplain.replace("#", funnyStat.source.stats.ability), {
                      font: "bold 16px Arial",
                      fill: "#aaa",
                      boundsAlignH: "left",
                      boundsAlignV: "top",
                      textAlign: "left",
                    })
                    .setShadow(0, 0, "#000", 4)
                    .setOrigin(0, 0);
                  this.add.image(arena.params.width * 0.73, arena.params.height * 0.8, funnyStat.source.class).setScale(1.3);
                },
                update: function () {
                  // eshrug
                },
              },
              true
            );
            arena.source.cameras.main.resetFX();
          }, 2222);
        });

        // user-defined callback
        if (arena.callbacks.arenaStart) {
          arena.callbacks.arenaStart();
        }
      });

      // event: winner is being shown
      this.events.on("arena-show-winner", () => {
        console.log("Arena: the end-game screen is being shown.");
        if (arena.settings.exitFullscreenOnEnd && document.exitFullscreen) {
          document.exitFullscreen().catch((e) => console.error(e));
        }
      });

      // finish up the first-time creation by performing a cleanup
      this.events.emit("arena-cleanup");

      /* subscribe for events */
      if (arena.callbacks.unitDied) {
        arena.source.events.on("arena-unit-died", arena.callbacks.unitDied);
      }

      if (arena.callbacks.arenaEnd) {
        arena.source.events.on("arena-show-winner", arena.callbacks.arenaEnd);
      }
    },

    /* UPDATE - DRAWING FRAMES */
    update: function (timestamp, _delta) {
      // draw units
      arena.units.forEach((u) => {
        u.drawFrame();
        u.processBotAction(timestamp);
      });
      arena.teams.red.units.forEach((u) => {
        u.drawFrame();
        u.processBotAction(timestamp);
      });
      arena.teams.blue.units.forEach((u) => {
        u.drawFrame();
        u.processBotAction(timestamp);
      });
      arena.summons.forEach((u) => {
        u.drawFrame();
        u.processBotAction(timestamp);
      });

      // controls
      if (!arena.player || arena.player.dead) {
        return;
      }
      arena.player.doMove(+arena.cursors.right.isDown - arena.cursors.left.isDown);
      if (arena.cursors.up.isDown) {
        arena.player.doJump();
      }
      if (arena.cursors.space.isDown) {
        arena.player.doAttack();
      }
      if (arena.cursors.shift.isDown) {
        arena.player.doAbility();
      }

      // ability cooldown icon
      let cd = Date.now();
      cd = ((arena.player.ability.availableAt > cd) * 360 * (arena.player.ability.availableAt - cd)) / arena.player.ability.cooldown;
      arena.ui.cooldownMask.clear();
      arena.ui.cooldownMask.slice(36, 36, arena.ui.abilityIcon.width * 2, Phaser.Math.DegToRad(270), Phaser.Math.DegToRad(cd - 90), true);
      arena.ui.cooldownMask.fillPath();
      arena.ui.abilityIcon.setMask(arena.ui.cooldownMask.createGeometryMask());
      if (!cd) {
        arena.ui.abilityIcon.clearTint();
      }
    },
  },
});
