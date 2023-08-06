/* jshint unused:false */
/*jshint esversion: 9 */
/* globals Phaser, arena, arenaSetup */

class AttackProjectile {
  constructor(source, owner, props) {
    this.source = source;
    this.owner = owner;
    this.x = props.x || owner.object.x + 0.5 * owner.object.displayWidth - owner.object.displayWidth * owner.object.flipX;
    this.y = props.y || owner.object.y;
    this.damage = owner.damage;
    this.icon = props.weaponIcon;
    this.collideBehavior = props.collideBehavior;
    this.soundOfDamage = props.soundOfDamage;

    this.nullUnit = {
      dead: true,
      takeDamage: Phaser.Utils.NOOP,
      takeHeal: Phaser.Utils.NOOP,
    };

    this.object = source.physics.add.sprite(this.x, this.y, props.type);
    arena.groups.projectiles.add(this.object);
    this.object.ownerUnit = this.owner;

    // detect which side we going:
    this.object.body.setAllowGravity(props.gravitate);
    this.object
      .setScale((props.scale || 1) * arena.internals.globalScale)
      .setFlipX(owner.object.flipX)
      .setVelocityX(-owner.object.flipX * 2 * props.speedX + props.speedX)
      .setVelocityY(props.speedY);

    // set custom behavior
    props.lifecycle.apply(this);

    const processCallback = (projectile, unitObject) => {
      // collision check - if false, collision is not fired
      return unitObject.hasOwnProperty("ownerUnit") && projectile.ownerUnit.guid !== unitObject.ownerUnit.guid;
    };

    // hit detection (overlap)
    const colliderCallback = (_projectile, unitObject) => {
      unitObject.ownerUnit.takeDamage(this.owner, this, !unitObject.ownerUnit.dead * this.damage);
      // range attacks also die on collision
      this.collideBehavior.apply(this);
    };
    // ranged: die on collision with platforms
    if (!props.persistent) {
      source.physics.add.collider(
        this.object,
        arena.groups.platforms,
        function (projectile) {
          projectile.destroy();
        },
        null,
        this
      );
    }
    // all: react to collision with users
    props.hitscans.forEach((hitscan) => {
      source.physics.add[hitscan](this.object, owner.enemies, colliderCallback, processCallback, this);
    });
    // play sound and the animation
    props.sound.play({
      volume: arena.settings.soundVolume * source.sound.getCustomExponent(),
      mute: !arena.settings.sound,
    });
    this.object.play("anim-" + props.type);
  }
}

// Generic arena unit
class ArenaUnit {
  constructor(source, type, x = 0, y = 0, name = "", color = null, team = "") {
    this.source = source;
    this.guid = Phaser.Utils.String.UUID();
    this.type = type;
    this.class = type;
    this.master = {};
    this.summons = new Set();
    this.x = x;
    this.y = y;
    this.attack = {
      weaponIcon: "",
      speedX: 0,
      speedY: 0,
      gravitate: false,
      persistent: true,
      type: "hit-melee",
      hitscans: ["collider", "overlap"],
      collideBehavior: Phaser.Utils.NOOP,
      sound: source.sound.get(this.class + "-attack"),
      soundOfDamage: source.sound.get(this.class + "-hit"),
      lifecycle: function () {
        // applicable
        this.object.on("animationcomplete", () => {
          this.object.destroy();
        });
      },
    };
    this.ability = {
      isEmpty: true,
      cooldown: 1000, // msecs
      lastUsed: 0,
      availableAt: 0,
      action: Phaser.Utils.NOOP, // actual ability code goes here
    };
    // define enemies
    if (arena.internals.isTeamMode) {
      this.team = arena.internals.validTeams.includes(team) ? team : arena.teams.red.units.size > arena.teams.blue.units.size ? "blue" : "red";
      this.group = "units_" + this.team;
      this.enemies = arena.groups["units_" + arena.internals.validTeams[Math.abs(arena.internals.validTeams.indexOf(this.team) - 1)]];
      arena.teams[this.team].units.add(this);
      arena.teams[this.team].alive.add(this.guid); // used for music playback
    } else {
      this.team = "";
      this.group = "units";
      this.enemies = arena.groups.units;
      arena.units.add(this);
      arena.internals.aliveReporter.add(this.guid); // used for music playback
    }
    // self sprite
    this.source = source;
    this.object = source.physics.add.image(x, y, type);
    arena.groups[this.group].add(this.object);
    this.object.ownerUnit = this;
    this.object
      .setName(this.guid)
      .setScale(0.4 * arena.internals.globalScale)
      .setOrigin(0.5, 0.5)
      .setBounce(0.2)
      .setFrictionX(1)
      .setCollideWorldBounds(true);
    // jumping mechanic
    source.physics.add.collider(
      this.object,
      arena.groups.platforms,
      () => {
        this.canJump = true;
      },
      null,
      this
    );
    // arena vars
    this.bot = {
      nextAttack: Number.MAX_SAFE_INTEGER,
      nextJump: Number.MAX_SAFE_INTEGER,
      nextAbility: Number.MAX_SAFE_INTEGER,
      nextChangeDirection: Number.MAX_SAFE_INTEGER,
    };
    this.stats = {
      lastKilledBy: null, // who killed this unit
      ability: 0, // times ability was used
      dead: 0, // times died
      damage: 0, // damage dealt
      tank: 0, // damage tanked
      restored: 0, // own hp restored
      heal: 0, // anyone's hp healed
      frag: 0, // kill amount
    };
    this.dead = false;
    this.invulnerable = false;
    this.immmovable = false;
    this.disarmed = false;
    this.canAttack = true;
    this.canJump = false;
    this.attackDelay = 500;
    this.setName(name, color)
      .setDamage()
      .setMaxHP()
      .setSpeed()
      .setProjectileSpeed()
      .setJumpSpeed(650)
      .setFrozen(arena.state !== "started"); // freeze time

    // healthbar
    this.healthbar = source.add.rectangle(this.object.x, this.object.y + this.object.height * 0.3, 0, 4, 0x00ff00);
    this.healthbar.setStrokeStyle(1, "black");
    // arrow over head (stub)
    this.arrowPointer = {
      setVisible: Phaser.Utils.NOOP,
      setPosition: Phaser.Utils.NOOP,
      destroy: Phaser.Utils.NOOP,
    };
    // own name above head
    this.overheadText = arena.params.showUnitNames
      ? source.add
          .text(this.object.x, this.object.y - this.object.height * 0.25, this.name, { font: "12px Arial", color: this.color })
          .setOrigin(0.5, 0.5)
          .setStroke("black", 1)
      : {
          setText: Phaser.Utils.NOOP,
          setColor: Phaser.Utils.NOOP,
          setPosition: Phaser.Utils.NOOP,
          destroy: Phaser.Utils.NOOP,
        };

    // join notification
    /*
        new ArenaKillFeedNotification(
          {name:"joined the arena",color:"white"},
          this.expose()
        );
        */

    // misc stuff
    this.timers = {};
  }

  expose() {
    return {
      name: this.name,
      color: this.color,
      team: this.team,
      class: this.class,
      weapon: this.attack.weaponIcon,
      stats: this.stats,
    };
  }

  setName(name, color, overrideStats = true) {
    // color is either passed in, or is team's color
    if (arena.internals.isTeamMode) {
      switch (this.team) {
        case "red":
          this.color = "#ff7777";
          break;
        case "blue":
          this.color = "#66ccff";
          break;
      }
    } else {
      this.color = color || "#" + Math.floor(0x666666 + Math.random() * 0x999999).toString(16);
    }

    if (overrideStats && name) {
      if (this.name) {
        arena.unitStats.delete(this.name);
      }
      this.name = name;
      arena.unitStats.set(this.name, this.expose());
    } else this.name = name || "";
    if (this.overheadText) {
      this.overheadText.setText(this.name);
      this.overheadText.setColor(this.color);
    }
    return this;
  }

  setDamage(damage = 25) {
    this.damage = damage;
    return this;
  }

  setSpeed(speed = 256) {
    this.speed = (speed * arena.params.width) / 1280;
    this.object.body.setMaxVelocityX(speed);
    return this;
  }

  setJumpSpeed(speed = 512) {
    this.jumpSpeed = (speed * arena.params.height) / 720;
    return this;
  }

  setAttackSpeed(atkspeed = 2) {
    // attacks per second
    this.attackDelay = 1000 / atkspeed;
    return this;
  }

  setProjectileSpeed(speed = 0) {
    // 0 for melee
    this.attack.speedX = (speed * arena.params.width) / 1280;
    return this;
  }

  setMaxHP(maxHP = 100) {
    if (!this.hasOwnProperty("maxHP")) {
      this.maxHP = maxHP;
    }
    if (this.hasOwnProperty("hp")) {
      // percent-based change
      this.hp = Math.max(0, Math.min(maxHP, (maxHP * this.hp) / this.maxHP));
    } else {
      this.hp = maxHP;
    }
    this.maxHP = maxHP;
    return this;
  }

  setPassive() {
    this.bot.isPassive = true;
    return this;
  }

  setControllable() {
    arena.player = this.setPassive();
    this.isPlayer = true;

    // ability indicator
    switch (this.class) {
      case "hunter":
        arena.ui.abilityIcon.setTexture("icon-grenade");
        break;
      case "mage":
        arena.ui.abilityIcon.setTexture("icon-meteor");
        break;
      case "rogue":
        arena.ui.abilityIcon.setTexture("icon-blink");
        break;
      case "paladin":
        arena.ui.abilityIcon.setTexture("icon-repel");
        break;
      case "priest":
        arena.ui.abilityIcon.setTexture("icon-heal");
        break;
      case "shaman":
        arena.ui.abilityIcon.setTexture("icon-summon");
        break;
    }

    // controllable units overhead indicator
    this.arrowPointer = this.source.add.text(this.object.x, this.object.y - this.object.height * 0.5, "▼", {
      fontSize: "32px",
      fill: "#fcf",
      boundsAlignH: "center",
      boundsAlignV: "middle",
    });
    this.arrowPointer.setShadow(0, 0, "#000", 4);

    // why do these have to be reinitialized???
    this.setSpeed(this.speed);
    this.object.setCollideWorldBounds(true);
    this.object.setBounce(0.1);
    return this;
  }

  setFrozen(state) {
    this.immovable = !!state;
    this.invulnerable = !!state;
    this.disarmed = !!state;
    return this;
  }

  defineAbility(cooldown, action) {
    this.ability.isEmpty = false;
    this.ability.cooldown = cooldown;
    this.ability.action = action;
  }

  drawFrame() {
    if (this.dead) {
      this.arrowPointer.setVisible(false);
      if (this.object.scale > 0) {
        this.object.setScale(Math.max(0, this.object.scale - 0.005));
      } else {
        this.destroy();
      }
    } else {
      // overhead arrow
      this.arrowPointer.setPosition(this.object.x - this.arrowPointer.width / 2, this.object.y - this.object.displayHeight * 2);
      // player's name
      this.overheadText.setPosition(this.object.x, this.object.y - this.object.displayHeight * 0.8);
      // healthbar
      let ratio = this.hp / this.maxHP;
      this.healthbar.setSize(this.object.width * 0.3 * ratio, this.healthbar.height);
      this.healthbar.setPosition(this.object.x - this.healthbar.width / 2, this.object.y + this.object.displayHeight * 0.75);
      this.healthbar.setFillStyle(
        (arena.internals.HEALTHBAR_COLOR_FLAGS.RED & (arena.internals.HEALTHBAR_COLOR_FLAGS.RED * Math.min(2 - ratio * 2, 1))) +
          (arena.internals.HEALTHBAR_COLOR_FLAGS.GREEN & (arena.internals.HEALTHBAR_COLOR_FLAGS.GREEN * Math.min(1, ratio * 2)))
      );
    }
  }

  takeDamage(whoDealt, projectile, dmg = 0) {
    if (this.invulnerable || !dmg) {
      return;
    }
    this.hp = Math.max(this.hp - dmg, 0);
    this.stats.tank += dmg;
    whoDealt.stats.damage += dmg;
    this.object.setTint(0xff9999);
    this.object.setVelocityY(this.object.body.velocity.y - this.jumpSpeed * 0.4);

    // play sound cue
    projectile.soundOfDamage.play({
      volume: arena.settings.soundVolume * this.source.sound.getCustomExponent(),
      mute: !arena.settings.sound,
    });

    // detect death
    if (this.hp <= 0) {
      whoDealt.stats.frag += 1;
      this.die(whoDealt, projectile);
      // play another sound cue
      /*
            this.source.sound.play("unit-death", {
              volume: arena.settings.soundVolume*this.source.sound.getCustomExponent(),
              mute: !arena.settings.sound
            });
            */
    } else {
      // no death, just damage
      this.invulnerable = true;
      if (!this.timers.damageTint) {
        this.timers.damageTint = setTimeout(() => {
          this.object.clearTint();
          delete this.timers.damageTint;
          this.invulnerable = false;
        }, 500);
      }
    }
  }

  takeHeal(whoDealt, _projectile, dmg = 0) {
    if (this.dead) {
      return;
    }
    this.hp = Math.min(this.hp + dmg, this.maxHP);
    this.stats.restored += dmg;
    whoDealt.stats.heal += dmg;
    this.object.setTint(0x77ff77);

    if (!this.timers.healTint) {
      this.timers.healTint = setTimeout(() => {
        this.object.clearTint();
        delete this.timers.healTint;
      }, 500);
    }
  }

  doJump(howHigh = this.jumpSpeed) {
    if (!this.immovable && this.canJump && this.object.body.touching.down) {
      this.canJump = false; // will be reset on collision with platform
      this.object.body.setVelocityY(-howHigh);
    }
  }

  doMove(side) {
    // 1=right, -1=left, 0=stop
    if (this.immovable) {
      return;
    }
    if (side) {
      this.object.setFlipX(side < 0);
    }
    this.object.body.setVelocityX(this.object.body.maxVelocity.x * Math.sign(side));
  }

  doAttack() {
    if (this.dead || this.disarmed || !this.canAttack) {
      return;
    }
    this.canAttack = false;

    // create attack projectile
    new AttackProjectile(this.source, this, this.attack);

    // set cooldown for attack
    this.timers.attackDelay = this.source.time.addEvent({
      delay: this.attackDelay,
      callback: () => {
        this.canAttack = true;
      },
    });
  }

  doAbility() {
    if (this.dead || this.disarmed || this.ability.isEmpty) {
      return;
    }
    if (this.isPlayer) {
      arena.ui.abilityIcon.setTint(0x696969);
    }

    const t = Date.now();
    if (t < this.ability.availableAt) {
      return;
    }
    this.ability.lastUsed = t;
    this.ability.availableAt = t + this.ability.cooldown;
    this.stats.ability += 1;
    this.ability.action();
  }

  initializeBot(t) {
    this.bot.nextJump = t + 4567 * Math.random();
    this.bot.nextAttack = t + 1234 + 7890 * Math.random();
    this.bot.nextAbility = this.ability.isEmpty // stat overflow fix
      ? Number.MAX_SAFE_INTEGER
      : t + 4567 + 7890 * Math.random();
    this.bot.nextChangeDirection = 1; // for instant movement
  }

  processBotAction(t) {
    if (this.dead || this.bot.isPassive) {
      return;
    }
    if (this.bot.nextJump < t) {
      this.bot.nextJump = t + 3434 * Math.random();
      this.doJump();
    }
    if (this.bot.nextAttack < t) {
      this.bot.nextAttack = t + this.attackDelay + this.attackDelay * (1 + Math.random());
      this.doAttack();
    }
    if (this.bot.nextAbility < t) {
      this.bot.nextAbility = t + this.ability.cooldown + this.ability.cooldown * Math.random();
      this.doAbility();
    }
    if (this.bot.nextChangeDirection < t) {
      this.bot.nextChangeDirection = t + 2345 * Math.random();
      let baseDirection = Math.random() - 0.5 + (this.object.x / arena.params.width - 0.5);
      this.doMove(Math.sign(-baseDirection));
    }
  }

  die(killer, projectile) {
    // prevent collision with projectiles:
    arena.groups.units.remove(this.object);
    if (this.team) {
      arena.groups["units_" + this.team].remove(this.object);
    }

    this.healthbar.destroy();
    this.overheadText.destroy();
    this.object.setTintFill(0xcdcdcd);
    this.dead = true;
    this.invulnerable = true;
    this.immmovable = true;
    this.stats.dead += 1;

    // master-or-summon specific actions
    if (!this.master.guid) {
      // dead unit is master:
      // record the killer
      this.stats.lastKilledBy = killer.master.guid ? killer.master.expose() : killer.expose();
      // does this unit have any owned summons?
      if (this.summons.size < 1) {
        // apparently not, decrement alive counters
        arena.teams.blue.alive.delete(this.guid);
        arena.teams.red.alive.delete(this.guid);
        arena.internals.aliveReporter.delete(this.guid);
      }
    } else {
      // dead unit is summon:
      // dereference self from master's ownership list
      this.master.summons.delete(this);
      // if master is dead, and has no more summons - they cant win!
      if (this.master.dead && this.master.summons.size < 1) {
        arena.teams.blue.alive.delete(this.master.guid);
        arena.teams.red.alive.delete(this.master.guid);
        arena.internals.aliveReporter.delete(this.master.guid);
      }
    }

    // top right kill feed notification:
    new ArenaKillFeedNotification(this.expose(), killer ? killer.expose() : null, projectile.icon).emitEvent();

    // change music if needed
    if (arena.internals.isTeamMode) {
      if (arena.teams.red.alive.size === 1) {
        this.source.events.emit("arena-last-red", this.name, this.class);
      } else if (arena.teams.red.alive.size === 0) {
        this.source.events.emit("arena-finished", {
          name: "Blue team",
          color: "#6af",
          class: killer.class,
        });
      }
      if (arena.teams.blue.alive.size === 1) {
        this.source.events.emit("arena-last-blue", this.name, this.class);
      } else if (arena.teams.blue.alive.size === 0) {
        this.source.events.emit("arena-finished", {
          name: "Red team",
          color: "#f66",
          class: killer.class,
        });
      }
    } else {
      if (arena.internals.aliveReporter.size === 10) {
        this.source.events.emit("arena-top10");
      } else if (arena.internals.aliveReporter.size === 2) {
        this.source.events.emit("arena-top2");
      } else if (arena.internals.aliveReporter.size < 2) {
        // game end condition check
        let winnerGUID = arena.internals.aliveReporter.values().next();
        // stub: if for some reason nobody is alive, this unit is the winner
        if (winnerGUID.done) {
          return void arena.source.events.emit("arena-finished", this.expose());
        }

        winnerGUID = winnerGUID.value;
        // winner is master:
        let winner = arena.aux.findUnitByGuid(winnerGUID);
        if (winner) {
          return void arena.source.events.emit("arena-finished", winner.expose());
        }
        // winner is summon
        for (const summon of arena.summons) {
          if (summon.master.guid === winnerGUID) {
            return void arena.source.events.emit("arena-finished", summon.master.expose());
          }
        }
        // ...who is the winner then?
        arena.source.events.emit("arena-finished", { name: "...?", color: "white", class: "dummy" });
      }
    }
  }

  destroy() {
    if (!this.summons.size) {
      // external destroy call protection
      arena.teams.blue.alive.delete(this.guid);
      arena.teams.red.alive.delete(this.guid);
      arena.internals.aliveReporter.delete(this.guid);
    }
    this.healthbar.destroy();
    this.overheadText.destroy();
    this.arrowPointer.destroy();
    this.object.destroy();
    arena.units.delete(this);
    arena.teams.red.units.delete(this);
    arena.teams.blue.units.delete(this);
    arena.summons.delete(this);
  }
}

class ArenaRogue extends ArenaUnit {
  constructor(source, x, y, name, color, team) {
    super(source, "rogue", x, y, name, color, team);
    // set base stats
    this.setMaxHP(110);
    this.setSpeed(220);
    this.setDamage(45);
    this.setAttackSpeed(1.8);
    // default attack type is melee, which fits this class
    this.attack.weaponIcon = "🔪";
    // ability: blink
    this.defineAbility(5000, () => {
      const poof = {
        x: this.object.x,
        y: this.object.y,
        weaponIcon: "",
        speedX: 0,
        speedY: 0,
        scale: 1,
        gravitate: false,
        sound: source.sound.get("blink"),
        type: "abil-blink",
        hitscans: [],
        collideBehavior: Phaser.Utils.NOOP,
        lifecycle: function () {
          // applicable
          this.object.on("animationcomplete", () => {
            this.object.destroy();
          });
        },
      };
      // starting projectile
      new AttackProjectile(this.source, this, poof);
      // landing projectile
      poof.x = (Math.random() * 0.9 + 0.05) * arena.params.width;
      poof.y = (Math.random() * 0.75 + 0.15) * arena.params.height;
      new AttackProjectile(this.source, this, poof);
      // move self to landing point
      this.object.setPosition(poof.x, poof.y);
    });
  }
}

class ArenaHunter extends ArenaUnit {
  constructor(source, x, y, name, color, team) {
    super(source, "hunter", x, y, name, color, team);
    // set base stats
    this.setMaxHP(105);
    this.setSpeed(200);
    this.setDamage(35);
    this.setAttackSpeed(2);
    // change attack type
    this.setProjectileSpeed(800);
    this.attack.weaponIcon = "🎯";
    this.attack.persistent = false;
    this.attack.type = "hit-bullet";
    this.attack.collideBehavior = function () {
      this.object.destroy();
    };
    this.attack.lifecycle = function () {
      this.object.setCollideWorldBounds(true);
      this.object.body.onWorldBounds = true;
      this.object.body.world.on(
        "worldbounds",
        function (body) {
          if (body.gameObject === this) {
            this.destroy();
          }
        },
        this.object
      );
    };
    // ability: grenade
    let thisUnit = this;
    this.defineAbility(6000, () => {
      // launch a single projectile
      new AttackProjectile(this.source, this, {
        x: this.object.x,
        y: this.object.y,
        weaponIcon: "",
        speedX: (444 * arena.params.width) / 1280,
        speedY: -420,
        scale: 1,
        gravitate: true,
        sound: source.sound.get("grenade"),
        type: "abil-grenade",
        hitscans: [],
        persistent: true, // does not die immediately when ground is hit
        collideBehavior: Phaser.Utils.NOOP,
        lifecycle: function () {
          // applicable
          // bounce off walls and ceiling:
          this.object.body.setCollideWorldBounds(true, 1, 1);
          // explode on collision with plarforms:
          this.source.physics.add.collider(
            this.object,
            arena.groups.platforms,
            (projectile, _unitObject) => {
              // delete flying projectile

              this.object.destroy();
              // create explosion projectile
              new AttackProjectile(thisUnit.source, thisUnit, {
                x: projectile.x,
                y: projectile.y,
                weaponIcon: "💣",
                speedX: 0,
                speedY: 0,
                scale: 1,
                damage: 60,
                gravitate: false,
                persistent: true,
                collideBehavior: Phaser.Utils.NOOP,
                sound: source.sound.get("grenade-explode"),
                soundOfDamage: { play: Phaser.Utils.NOOP },
                type: "explosion",
                hitscans: ["overlap"],
                lifecycle: function () {
                  // destroy on animation end
                  this.object.on("animationcomplete", () => {
                    this.object.destroy();
                  });
                },
              });
            },
            null,
            this
          );
        },
      });
    });
  }
}

class ArenaMage extends ArenaUnit {
  constructor(source, x, y, name, color, team) {
    super(source, "mage", x, y, name, color, team);
    // set base stats
    this.setMaxHP(100);
    this.setSpeed(140);
    this.setDamage(45);
    this.setAttackSpeed(1);
    // change attack type
    this.setProjectileSpeed(300);
    this.attack.weaponIcon = "🎇";
    this.attack.persistent = false;
    this.attack.type = "hit-fireball";
    this.attack.collideBehavior = function () {
      this.object.destroy();
    };
    this.attack.lifecycle = function () {
      this.object.setCollideWorldBounds(true);
      this.object.body.onWorldBounds = true;
      this.object.body.world.on(
        "worldbounds",
        function (body) {
          if (body.gameObject === this) {
            this.destroy();
          }
        },
        this.object
      );
    };
    // ability: meteor
    this.defineAbility(12000, () => {
      // launch a fucking giant hot meatball to destroy every single peepo and win the fucking game
      new AttackProjectile(this.source, this, {
        x: (0.1 + 0.8 * Math.random()) * arena.params.width,
        y: -100,
        weaponIcon: "🌠",
        speedX: 150 + 400 * Math.random() - 650 * (Math.random() < 0.5),
        speedY: 0,
        scale: 1,
        damage: 20,
        gravitate: true,
        sound: source.sound.get("meteor"),
        soundOfDamage: { play: Phaser.Utils.NOOP },
        type: "meteor",
        hitscans: ["overlap"],
        persistent: true, // does not die immediately when ground is hit
        collideBehavior: Phaser.Utils.NOOP,
        lifecycle: function () {
          // applicable
          // add particles (fire and smoke)
          this._particles = [];
          arena.particles.forEach((p, pi) => {
            this._particles.push(
              p.createEmitter({
                gravityX: 0,
                gravityY: 0,
                speed: 150,
                frequency: 40 + 48 * pi,
                scale: { start: 0.4, end: 1.3 },
                lifespan: 666,
                follow: this.object,
              })
            );
          });
          // bounce off walls and ceiling:
          this.object.body.setCollideWorldBounds(true, 1, 1);
          this.object.body.onWorldBounds = true;
          this.object.body.world.on(
            "worldbounds",
            function (body) {
              if (body.gameObject !== this.object) {
                return;
              }
              body.gameObject.setFlipX(body.velocity.x < 0);
            },
            this
          );
          // simple collision with plarforms:
          this.source.physics.add.collider(this.object, arena.groups.platforms);
          // disable bouncing, thing is heavy after all
          this.object.setBounce(0);
          // destroy itself after X seconds
          setTimeout(() => {
            this._particles.forEach((emitter) => emitter.remove());

            this.object.destroy();
          }, 3333);
        },
      });
    });
  }
}

class ArenaPaladin extends ArenaUnit {
  constructor(source, x, y, name, color, team) {
    super(source, "paladin", x, y, name, color, team);
    // set base stats
    this.setMaxHP(135);
    this.setSpeed(200);
    this.setDamage(55);
    this.setAttackSpeed(0.7);
    // default attack type is melee, which fits this class
    this.attack.weaponIcon = "⚔️";
    // ability: damage shield
    this.defineAbility(10000, () => {
      this.invulnerable = true;
      this.object.setTint(0xcccc00);
      if (!this.timers.invulTint) {
        this.timers.invulTint = setTimeout(() => {
          this.object.clearTint();
          delete this.timers.invulTint;
          this.invulnerable = false;
        }, 2000);
      }

      this.source.sound.play("repel", {
        volume: arena.settings.soundVolume * this.source.sound.getCustomExponent(),
        mute: !arena.settings.sound,
      });
    });
  }
}

class ArenaPriest extends ArenaUnit {
  constructor(source, x, y, name, color, team) {
    super(source, "priest", x, y, name, color, team);
    // set base stats
    this.setMaxHP(90);
    this.setSpeed(160);
    this.setDamage(25);
    this.setAttackSpeed(2.4);
    // change attack type
    this.setProjectileSpeed(500);
    this.attack.weaponIcon = "🏮";
    this.attack.persistent = false;
    this.attack.type = "hit-weakmagic";
    this.attack.collideBehavior = function () {
      this.object.destroy();
    };
    this.attack.lifecycle = function () {
      this.object.setCollideWorldBounds(true);
      this.object.body.onWorldBounds = true;
      this.object.body.world.on(
        "worldbounds",
        function (body) {
          if (body.gameObject === this) {
            this.destroy();
          }
        },
        this.object
      );
    };
    // ability: heal
    this.defineAbility(10000, () => {
      // play sound
      this.source.sound.play("heal", {
        volume: arena.settings.soundVolume * this.source.sound.getCustomExponent(),
        mute: !arena.settings.sound,
      });
      // do the healing
      let healAmount = 30;
      if (arena.internals.isTeamMode) {
        // heal yourself if took some damage or is not a team mode
        if (this.hp < this.maxHP) {
          this.takeHeal(this, null, healAmount);
        } else {
          for (const unit of arena.teams[this.team].units) {
            if (unit.hp < unit.maxHP) {
              unit.takeHeal(this, null, healAmount);
            }
          }
        }
      }
      // nobody was healed? heal yourself then!
      this.takeHeal(this, null, healAmount);
    });
  }
}

class ArenaShaman extends ArenaUnit {
  constructor(source, x, y, name, color, team) {
    super(source, "shaman", x, y, name, color, team);
    // set base stats
    this.setMaxHP(165);
    this.setSpeed(200);
    this.setDamage(0);
    // has no own attack
    this.attack.weaponIcon = "❓";
    this.canAttack = false;
    // ability: summon megalul
    this.defineAbility(7000, () => {
      // play sound
      this.source.sound.play("unit-death", {
        volume: arena.settings.soundVolume * this.source.sound.getCustomExponent(),
        mute: !arena.settings.sound,
      });
      // summon something
      let summon = new ArenaUnit(this.source, "dummy", this.object.x, this.object.y, "", "", this.team);
      summon.master = this;
      arena.summons.add(summon);
      this.summons.add(summon);
      // summons should not count as units
      arena.units.delete(summon);
      arena.teams.red.units.delete(summon);
      arena.teams.blue.units.delete(summon);
      arena.teams.red.alive.delete(summon.guid);
      arena.teams.blue.alive.delete(summon.guid);
      arena.internals.aliveReporter.delete(summon.guid);
      // service vars init
      summon.object.setFlipX(this.object.flipX);
      // override hitscans
      summon.attack.hitscans.length = 0;
      summon.attack.lifecycle = function () {
        // will be applied on new projectile
        const processCallback = (projectile, unitObject) => {
          // unitObject is ArenaUnit.object, its name is ArenaUnit.guid
          return (
            projectile.ownerUnit.guid !== unitObject.name && // not self
            projectile.ownerUnit.master.guid !== unitObject.name && // not master
            projectile.ownerUnit.master.guid !== unitObject.ownerUnit.master.guid // not same master
          );
        };
        const colliderCallback = (_projectile, unitObject) => {
          const unit = unitObject.ownerUnit || this.nullUnit;
          unit.takeDamage(this.owner, this, !unit.dead * this.damage);
        };
        source.physics.add.overlap(this.object, summon.enemies, colliderCallback, processCallback, this);
        // melee projectiles die when animation ends
        this.object.on("animationcomplete", () => {
          this.object.destroy();
        });
      };
      // stats and shit
      summon.attack.weaponIcon = "🍴";
      summon.setName(`Bog (${this.name})`, this.color, false).setMaxHP(25).setSpeed(300).setDamage(30).setAttackSpeed(1.6).setFrozen(false);
      summon.stats = this.stats; // so that kills would could towards owner
      // and enable the ai
      summon.initializeBot(1); // enable own sentience
    });
  }
}

function ArenaUnitFactory(className) {
  return {
    mage: ArenaMage,
    hunter: ArenaHunter,
    rogue: ArenaRogue,
    paladin: ArenaPaladin,
    shaman: ArenaShaman,
    priest: ArenaPriest,
  }[className];
}

/* top right kill feed */
class ArenaNotification {
  constructor(startX, startY, linkLastObject = false) {
    this.dead = false;
    this.startX = startX || arena.params.width / 2;
    this.startY = startY || Math.max(32, arena.internals.notificationLastObject.active ? arena.internals.notificationLastObject.y : arena.internals.notificationLastY);
    this.collisionClass = arena.internals.KILLFEED_COLLISION_MASKS.BIGTOAST;

    this.container = arena.source.add.container(this.startX, this.startY + 24);
    if (linkLastObject) {
      arena.internal.notificationLastObject = this.container;
    }
  }

  fillWithText(text, color) {
    let tct = arena.source.add.text(
      // killer
      0,
      0,
      text,
      { font: "bold 60px Arial", fill: color, align: "center" }
    );
    tct.setOrigin(0.5, 0);
    tct.setShadow(0, 0, "#000", 16);
    this.container.add(tct);
    this.container.setSize(tct.width, tct.height);
    return this;
  }

  show(destroyAfter = -1) {
    arena.source.matter.add.gameObject(
      this.container,
      {
        position: { x: this.container.x, y: this.container.y },
        collisionFilter: {
          category: this.collisionClass,
        },
      },
      true
    );
    this.container.setCollidesWith([this.collisionClass, arena.internals.KILLFEED_COLLISION_MASKS.PADDER]);
    if (!destroyAfter) {
      this.destroy();
    } else if (destroyAfter > 0) {
      this.selfDestruct = setTimeout(() => this.destroy(), destroyAfter);
    }

    return this;
  }

  destroy() {
    if (this.selfDestruct) {
      clearTimeout(this.selfDestruct);
    }
    if (this.dead) {
      return;
    }

    this.dead = true;

    this.container.setCollisionCategory(arena.internals.KILLFEED_COLLISION_MASKS.DYING);
    this.isDying = setInterval(() => {
      if (this.container.y > -100) {
        return;
      }
      clearInterval(this.isDying);
      this.container.destroy();
    }, 1000);
  }
}

class ArenaKillFeedNotification extends ArenaNotification {
  constructor(victim, killer, icon) {
    super(arena.params.width - 4, 4 + Math.max(32, arena.internals.killFeedLastObject.active ? arena.internals.killFeedLastObject.y : arena.internals.killFeedLastY), false);

    this.victim = victim;
    this.originalKiller = killer;
    this.icon = icon;
    this.killer = killer || { name: "", color: "black", class: "", weapon: "" };

    if (!arena.params.killfeed) {
      return;
    }
    let peepoCount = arena.units.size + arena.teams.blue.units.size + arena.teams.red.units.size;
    if (killer && peepoCount > arena.params.killFeedHardLimit) {
      return;
    }

    this.dead = false;
    this.collisionClass = arena.internals.KILLFEED_COLLISION_MASKS.TOAST;
    arena.internals.killFeedLastObject = this.container;

    this.container.add(
      arena.source.add.text(
        // killer
        0,
        0,
        this.killer.name,
        { font: "bold 14px Arial", fill: this.killer.color, align: "right" }
      )
    );
    this.container.add(
      arena.source.add.text(
        // weapon
        0,
        0,
        icon || this.killer.weapon,
        { font: "14px", fill: "#ff0", align: "right" }
      )
    );
    this.container.add(
      arena.source.add.text(
        //victim
        0,
        0,
        victim.name,
        { font: "bold 14px Arial", fill: victim.color, align: "right" }
      )
    );
    const texts = this.container.getAll();
    let totalWidth = 0;
    for (let i = texts.length - 1; i >= 0; i--) {
      totalWidth += texts[i].width + 4;
      texts[i].setOrigin(1, 0);
      texts[i].setShadow(0, 0, "#000", 4);
      if (texts[i + 1]) {
        texts[i].setPosition(texts[i + 1].x - texts[i + 1].width - 4 * (texts.length - i), texts[i + 1].y);
      }
    }

    this.container.setSize(totalWidth, texts[0].height);
    this.show(arena.params.killFeedDuration + this.startY);

    arena.internals.killFeedLastObject = this.container;
  }

  emitEvent() {
    arena.source.events.emit("arena-unit-died", this.victim, this.originalKiller, this.icon);
    return this;
  }

  destroy() {
    arena.internals.killFeedLastY = arena.internals.killFeedLastObject.y;
    super.destroy();
  }
}
