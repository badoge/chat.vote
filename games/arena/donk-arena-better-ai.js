/*
  experimental ai improvement lib for arena
  creates "window.arenaBetterAi" object for use in unit creation

  prerequisites:
  - make sure that arena is available as "window.arena" (is ok by default, unless you changed something)

  usage:

  1) load this script (by adding it into html file or by any other means)

  2) alter "arenaSetup.callbacks.arenaRestart" function:
  >> call the "initialize" function, and pass a reference to "arena" object:
    arenaBetterAi.initialize(arena);

  3) ... done!

  how it works:
  when "initialize" function is called, it overrides "addUnit" function.
  new function captures freshly created units and replaces bot action functions.
  therefore no additional changes are required.

  note: if you want to add a unit with no smart ai, call arena.aux.addUnitWithNoBrains instead of usual addUnit

*/

const arenaBetterAi = {
  arena: null,
  firstInit: true,
  consts: {
    halfAcrossMap: 400,
    jumpThreshold: 200,
    elevatorToTargetThreshold: 322,
    elevatorHeightThreshold: 80,
    enemyColorMap: { blue: "red", red: "blue" },
    characters: ["chad", "soy"],
  },
  elevators: [],
  floors: [
    {
      y: Number.MAX_SAFE_INTEGER,
      planks: [{ fromX: -1, toX: Number.MAX_SAFE_INTEGER }],
    },
  ],
  generic: {},
  behaviors: { melee: {}, range: {} },
  classes: {},

  breatheLifeInto: (unit) => {
    // main function - adds brains to unit
    const originalInit = unit.initializeBot;

    // replace init function
    unit.initializeBot = function (t) {
      // this context = unit
      originalInit.call(this, t);
      // add inits here if needed
      this.bot.isSmart = true;
      this.bot.preferredRange = Math.max(40, Math.floor(this.attack.speedX * 0.4));
      this.bot.nextSmartMove = t;
      this.bot.smartBehavior = arenaBetterAi.consts.characters[Math.floor(arenaBetterAi.consts.characters.length * Math.random())];
      // becomes chad in random amount of time
      this.bot.smartBehaviorChangeFunction = () => {
        this.bot.smartBehaviorChangeCount -= 1;
        if (!this.bot.smartBehaviorChangeCount) {
          this.bot.smartBehavior = "chad";
          return;
        }
        this.bot.smartBehavior = arenaBetterAi.consts.characters[Math.floor(arenaBetterAi.consts.characters.length * Math.random())];
        setTimeout(this.bot.smartBehaviorChangeFunction, this.bot.smartBehaviorToggleTimer);
      };
      this.bot.smartBehaviorToggleTimer = Math.floor(2000 + Math.random() * 5000);
      this.bot.smartBehaviorChangeCount = 5 + Math.floor(Math.random() * 10);
      this.bot.smartBehaviorChangeFunction();
      // prevent instant ability cast
      if (this.class !== "priest") this.ability.availableAt = Date.now() + this.bot.nextAbility - t;
      // prevent instant attack (waytoodank fix)
      this.canAttack = false;
      this.timers.attackDelay = this.source.time.addEvent({
        delay: this.attackDelay * (1 + 2 * Math.random()),
        callback: () => {
          this.canAttack = true;
        },
      });
    };

    // replace process function
    if (!arenaBetterAi.classes.hasOwnProperty(unit.class)) return;
    unit.processBotAction = function (t) {
      // this context = unit
      if (arenaBetterAi.arena.state !== "started" || this.dead || this.bot.isPassive) return;
      if (this.bot.nextSmartMove > t) return;
      arenaBetterAi.classes[this.class].call(this, t);
      this.bot.nextSmartMove = Math.max(this.bot.nextSmartMove, t + 200);
    };

    // custom overrides
    switch (unit.class) {
      case "paladin":
        // uses ability when about to take damage
        unit.originalTakeDamage = unit.takeDamage;
        unit.takeDamage = function () {
          /*
          if (Math.random() < 0.9) this.doAbility();
          // add artificial cooldown
          else this.ability.availableAt = Date.now() + Math.floor(500 + 3000*Math.random());
          */
          this.doAbility();
          return unit.originalTakeDamage.apply(this, arguments);
        };
        break;
      case "rogue":
        // uses ability when about to take damage
        unit.originalTakeDamage = unit.takeDamage;
        unit.takeDamage = function () {
          if (Date.now() > this.ability.availableAt && Math.random() < 0.7) return void this.doAbility(); // little bit of cheating - blink now evades damage
          return unit.originalTakeDamage.apply(this, arguments);
        };
        break;
      case "shaman":
        // override attack function to hide animations
        unit.doAttack = () => {};
        break;
    }

    // return unit for possible chaining
    return unit;
  },

  initialize: (arena) => {
    if (arenaBetterAi.firstInit) {
      arenaBetterAi.firstInit = false;
      arenaBetterAi.arena = arena;
      // add injection - override addUnit method
      arena.aux.addUnitWithNoBrains = arena.aux.addUnit;
      arena.aux.addUnit = function () {
        const u = arena.aux.addUnitWithNoBrains.apply(this, arguments);
        u.originalSetControllable = u.setControllable;
        u.setControllable = function () {
          if (u.originalTakeDamage) u.takeDamage = u.originalTakeDamage; // rollback overridden takeDamage function to disable auto-using abilities
          return u.originalSetControllable();
        };
        return arenaBetterAi.breatheLifeInto(u);
      };
    }
    // parse map, create elevators and dropdowns
    arenaBetterAi.elevators.length = 0;
    arenaBetterAi.floors.length = 1;
    arenaBetterAi.floors[0].y = arena.params.height;
    // count the floors
    arena.groups.platforms.children.iterate((plank) => {
      const topLeft = plank.getTopLeft(),
        topRight = plank.getTopRight();
      const plankY = Math.ceil((topLeft.y + topRight.y) / 2);
      let floor;
      for (
        //ground floor = 0
        floor = arenaBetterAi.floors.length - 1;
        floor >= 0;
        floor--
      ) {
        if (arenaBetterAi.floors[floor].y >= plankY) {
          if (arenaBetterAi.floors[floor].y > plankY) {
            arenaBetterAi.floors.splice(++floor, 0, {
              y: plankY,
              planks: [],
            });
          }
          break;
        }
      }
      const floorObj = arenaBetterAi.floors[floor];
      floorObj.planks.push({ y: plankY, fromX: Math.max(topLeft.x, 0), toX: Math.min(topRight.x, arena.params.width) });
      // elevators are points to jump onto or drop down from
      if (topLeft.x > 0 && topLeft.x < arena.params.width) {
        topLeft.jumpDirection = 1;
        topLeft.dropDirection = -1;
        arenaBetterAi.elevators.push(topLeft);
      }
      if (topRight.x > 0 && topRight.x < arena.params.width) {
        topRight.jumpDirection = -1;
        topRight.dropDirection = 1;
        arenaBetterAi.elevators.push(topRight);
      }
    });
    // mark elevators with appropriate floor num
    arenaBetterAi.elevators.forEach((elev) => {
      elev.floor = 0;
      for (
        //ground floor = 0
        let i = 0;
        i < arenaBetterAi.floors.length;
        i++
      ) {
        if (Math.abs(arenaBetterAi.floors[i].y - elev.y) < 1) elev.floor = i;
      }
    });
    // dynamic consts
    arenaBetterAi.consts.elevatorToTargetThreshold = arena.params.height / 3;
    arenaBetterAi.consts.elevatorHeightThreshold = arena.params.height / 10;
    arenaBetterAi.consts.halfAcrossMap = arena.params.width * 0.5;

    console.info("[ArenaBetterAi] Script loaded!");
  },
};
window.arenaBetterAi = arenaBetterAi;

/* class-specific descriptions */
arenaBetterAi.classes.paladin = function (t) {
  arenaBetterAi.behaviors.melee[this.bot.smartBehavior].call(this, t);
};

arenaBetterAi.classes.rogue = function (t) {
  arenaBetterAi.behaviors.melee[this.bot.smartBehavior].call(this, t);
};

arenaBetterAi.classes.priest = function (t) {
  if (this.hp < this.maxHP) this.doAbility();
  arenaBetterAi.behaviors.range[this.bot.smartBehavior].call(this, t);
};

arenaBetterAi.classes.hunter = function (t) {
  arenaBetterAi.behaviors.range[this.bot.smartBehavior].call(this, t);
  // use ability
  if (this.bot.nextAbility < t) {
    const targets = arenaBetterAi.generic.getClosestUnitsInfoForRanged(this);
    const target = targets[0];
    if (!target.unit || target.distance > 600 || target.distance < 300) return;
    this.bot.nextAbility = t + this.ability.cooldown + 1000 * Math.random();
    this.doAbility();
  }
};

arenaBetterAi.classes.mage = function (t) {
  if (this.bot.nextAbility < t) {
    this.bot.nextAbility = t + this.ability.cooldown + 1000 * Math.random();
    this.doAbility();
  }
  arenaBetterAi.behaviors.range[this.bot.smartBehavior].call(this, t);
};

arenaBetterAi.classes.shaman = function (t) {
  if (this.bot.nextAbility < t) {
    this.bot.nextAbility = t + this.ability.cooldown + 1000 * Math.random();
    this.doAbility();
  }
  // shamans are always soy!
  arenaBetterAi.behaviors.range.soy.call(this, t);
};

/* behaviors */

arenaBetterAi.behaviors.melee.chad = function (t) {
  // this context = unit
  const target = arenaBetterAi.generic.getClosestUnitInfo(this);
  if (!target.unit) return;
  // elevation path finding
  const elevDiff = Math.abs(target.dy);
  if (elevDiff > arenaBetterAi.consts.elevatorHeightThreshold) {
    const e = arenaBetterAi.generic.findOptimalElevator(this, target.unit);
    if (!e) {
      //console.warn("bad elevator", e);
      this.bot.nextSmartMove = t + 555;
      return void this.doMove(Math.random() - 0.5);
    }
    if (target.dy < 0) {
      // assume jumping position
      //console.log("looking to jump", e, e.jumpX, e.elevator.jumpDirection);
      if (Math.abs(e.jumpX - this.object.x) < 30) {
        //console.log("jumping!");
        this.doMove(e.elevator.jumpDirection);
        this.doJump();
        this.bot.nextSmartMove = t + 1111;
        return;
      }
      this.doMove(e.jumpX - this.object.x);
    } else {
      //console.log("looking to drop", e.dropX, e.elevator.dropDirection);
      const distanceToDrop = e.dropX - this.object.x;
      this.doMove(Math.abs(distanceToDrop < 50) ? e.elevator.dropDirection : distanceToDrop);
      this.bot.nextSmartMove = t + 888;
    }
    return;
  }
  //console.log("leveled -- seek target");
  if (target.unit.object.body.velocity.y < -arenaBetterAi.consts.jumpThreshold) this.doJump();
  // run to unit
  this.doMove(Math.sign(target.dx));
  if (Math.abs(target.dx) < this.bot.preferredRange && elevDiff < 10) this.doAttack();
};

arenaBetterAi.behaviors.melee.soy = function () {
  // this context = unit
  const target = arenaBetterAi.generic.getClosestUnitInfo(this);
  if (!target.unit) return;
  // run away from unit
  if (Math.abs(target.dx) < this.bot.preferredRange && Math.abs(target.dy) < 20) {
    this.doMove(Math.sign(target.dx));
    this.doAttack();
    return;
  }
  if (target.distance < 150) {
    this.doMove(-target.dx);
    if (Math.random() < 0.3) this.doJump();
    return;
  }
  this.doMove(1 - 2 * Math.random());
  if (Math.random() < 0.3) this.doJump();
};

arenaBetterAi.behaviors.range.chad = function (t) {
  // this context = unit
  const targets = arenaBetterAi.generic.getClosestUnitsInfoForRanged(this);
  let target = targets[0].unit ? targets[0] : targets[1];
  if (!target.unit) return;
  // look at unit and attack
  if (target.ady < 10) {
    this.doMove(Math.sign(target.dx));
    this.doAttack();
  }
  // elevation path finding
  const elevDiff = Math.abs(target.dy);
  if (elevDiff > arenaBetterAi.consts.elevatorHeightThreshold) {
    const e = arenaBetterAi.generic.findOptimalElevator(this, target.unit);
    if (!e) {
      //console.warn("bad elevator", e);
      this.bot.nextSmartMove = t + 555;
      return void this.doMove(Math.random() - 0.5);
    }

    // elevation check
    if (target.dy < 0) {
      // assume jumping position
      //console.log("looking to jump", e, e.jumpX, e.elevator.jumpDirection);
      if (Math.abs(e.jumpX - this.object.x) < 30) {
        //console.log("jumping!");
        this.doMove(e.elevator.jumpDirection);
        this.doJump();
        this.bot.nextSmartMove = t + 1111;
        return;
      }
      this.doMove(e.jumpX - this.object.x);
    } else {
      //console.log("looking to drop", e.dropX, e.elevator.dropDirection);
      const distanceToDrop = e.dropX - this.object.x;
      this.doMove(Math.abs(distanceToDrop < 50) ? e.elevator.dropDirection : distanceToDrop);
      this.bot.nextSmartMove = t + 888;
    }
    return;
  }
  // switch to closest target
  target = targets[1].unit ? targets[1] : targets[0];
  if (!target.unit) return;
  // run away if unit is closing in
  if (target.distance < this.bot.preferredRange) {
    let direction = -target.dx;
    if (this.object.x < this.bot.preferredRange) direction = 1;
    if (this.object.x > arenaBetterAi.arena.params.width - this.bot.preferredRange) direction = -1;
    this.doMove(direction);
    if (Math.random() < 0.5) this.doJump();
    return;
  }
  this.doMove(0);
};

arenaBetterAi.behaviors.range.soy = function () {
  // this context = unit
  const targets = arenaBetterAi.generic.getClosestUnitsInfoForRanged(this);
  let target = targets[0].unit ? targets[0] : targets[1];
  if (!target.unit) return;
  // run away from unit
  if (Math.abs(target.dy) < 20) {
    this.doMove(Math.sign(target.dx));
    this.doAttack();
  }
  target = targets[1].unit ? targets[1] : targets[0];
  if (target.distance < this.bot.preferredRange) {
    let direction = -target.dx;
    if (this.object.x < this.bot.preferredRange) direction = 1;
    if (this.object.x > arenaBetterAi.arena.params.width - this.bot.preferredRange) direction = -1;
    this.doMove(direction);
    if (Math.random() < 0.5) this.doJump();
    return;
  }
  this.doMove(1 - 2 * Math.random());
  if (Math.random() < 0.3) this.doJump();
};

/* generics */

arenaBetterAi.generic.getDistanceInfo = function (unit, rival) {
  const result = { unit: rival };
  result.dx = rival.object.x - unit.object.x;
  result.dy = rival.object.y - unit.object.y;
  result.distance = Math.sqrt(result.dx * result.dx + result.dy * result.dy);
  return result;
};

arenaBetterAi.generic.getDistanceToElevator = function (unit, elevator) {
  const result = { elevator: elevator };
  result.dx = elevator.x - unit.object.x;
  result.dy = elevator.y - unit.object.y;
  result.distance = Math.sqrt(result.dx * result.dx + result.dy * result.dy);
  return result;
};
arenaBetterAi.generic.getSimpleDistanceToElevator = function (unit, elevator) {
  let dx = elevator.x - unit.object.x;
  let dy = elevator.y - unit.object.y;
  return Math.sqrt(dx * dx + dy * dy);
};

arenaBetterAi.generic.getMultiUnitFloor = function () {
  const result = new Array(arguments.length).fill(0);
  // simpler algorithm: ignore planks, define just by height
  for (let i = 0; i < arenaBetterAi.floors.length; i++) {
    for (let j = 0; j < arguments.length; j++) {
      if (arguments[j].object.y < arenaBetterAi.floors[i].y) result[j] = i;
    }
  }
  return result;
};

arenaBetterAi.generic.findOptimalElevator = function (unit, target) {
  //debugger;
  const closestElevator = {
      elevator: { bad: 1 },
      distance: Number.MAX_SAFE_INTEGER,
      dToTarget: Number.MAX_SAFE_INTEGER,
      dToUnit: Number.MAX_SAFE_INTEGER,
    },
    bestElevator = {
      elevator: { bad: 1 },
      distance: Number.MAX_SAFE_INTEGER,
      dToTarget: Number.MAX_SAFE_INTEGER,
      dToUnit: Number.MAX_SAFE_INTEGER,
    };
  const bounds = target.object.x > unit.object.x ? [unit.object.x, target.object.x] : [target.object.x, unit.object.x];
  const floors = arenaBetterAi.generic.getMultiUnitFloor(unit, target);
  if (floors[0] === floors[1]) return null;
  const isGoingUp = floors[0] < floors[1];
  const isTargetOneFloorDiff = Math.abs(floors[0] - floors[1]) === 1;
  arenaBetterAi.elevators.forEach((elev) => {
    if (isGoingUp ? unit.object.y - elev.y < 0 : elev.y - unit.object.y < -20) return;
    // check if best elevator
    if (elev.x <= bounds[1] && elev.x >= bounds[0]) {
      if (1 || !isTargetOneFloorDiff) {
        let dx = arenaBetterAi.generic.getSimpleDistanceToElevator(target, elev);
        if (dx < bestElevator.dToTarget) {
          bestElevator.elevator = elev;
          bestElevator.dToTarget = dx;
        }
      }
    }
    // check if closest elevator
    let dtx = arenaBetterAi.generic.getSimpleDistanceToElevator(unit, elev);
    if (dtx < closestElevator.dToUnit) {
      closestElevator.elevator = elev;
      closestElevator.dToUnit = dtx;
    }
  });
  const el = bestElevator.elevator.bad ? closestElevator : bestElevator;
  if (el.bad) return null;
  const e = arenaBetterAi.generic.getDistanceToElevator(unit, el.elevator);
  e.jumpX = el.elevator.x - unit.speed * 0.6 * e.elevator.jumpDirection;
  e.dropX = el.elevator.x + e.elevator.dropDirection * 10;
  return e;
};

arenaBetterAi.generic.getClosestUnitInfo = function (unit) {
  const allyTeam = unit.team || "~~~";
  let closestRival = { unit: null, distance: Number.MAX_SAFE_INTEGER };
  const comparator = (rival) => {
    if (rival === unit || rival.dead || rival.team === allyTeam) return;
    const nextRival = arenaBetterAi.generic.getDistanceInfo(unit, rival);
    if (closestRival.distance > nextRival.distance) closestRival = nextRival;
  };
  arenaBetterAi.arena.units.forEach(comparator);
  arenaBetterAi.arena.teams.red.units.forEach(comparator);
  arenaBetterAi.arena.teams.blue.units.forEach(comparator);
  arenaBetterAi.arena.summons.forEach(comparator);
  return closestRival;
};

arenaBetterAi.generic.getClosestUnitsInfoForRanged = function (unit) {
  const allyTeam = unit.team || "~~~";
  let closestRival = { unit: null, ady: Number.MAX_SAFE_INTEGER },
    closestHorizontalRival = { unit: null, distance: Number.MAX_SAFE_INTEGER };
  const comparator = (rival) => {
    if (rival === unit || rival.dead || rival.team === allyTeam) return;

    const nextRival = arenaBetterAi.generic.getDistanceInfo(unit, rival);
    nextRival.ady = Math.abs(nextRival.dy);

    if (closestHorizontalRival.distance > nextRival.distance) closestHorizontalRival = nextRival;

    if (closestRival.ady > nextRival.ady || (closestRival.ady == nextRival.ady && closestRival.distance > nextRival.distance)) closestRival = nextRival;
  };
  arenaBetterAi.arena.units.forEach(comparator);
  arenaBetterAi.arena.teams.red.units.forEach(comparator);
  arenaBetterAi.arena.teams.blue.units.forEach(comparator);
  arenaBetterAi.arena.summons.forEach(comparator);
  return [closestRival, closestHorizontalRival];
};
