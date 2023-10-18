/*jshint esversion: 11 */
let voters = [];

let elements = {
  //modals
  grid: document.getElementById("grid"),
  gameDiv: document.getElementById("gameDiv"),

  loginExpiredModal: document.getElementById("loginExpiredModal"),
  aboutModal: document.getElementById("aboutModal"),

  //navbar
  vtsLink: document.getElementById("vtsLink"),
  status: document.getElementById("status"),
  topRight: document.getElementById("topRight"),
  loginButton: document.getElementById("loginButton"),
  channelName: document.getElementById("channelName"),
  connectbtn: document.getElementById("connectbtn"),
  darkTheme: document.getElementById("darkTheme"),

  //main
  toastContainer: document.getElementById("toastContainer"),
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

function connect() {
  elements.status.innerHTML = `
  <h4>
  <span class="badge bg-warning">Connecting... 
  <div class="spinner-border" style="width:18px;height:18px;" role="status"><span class="visually-hidden">Loading...</span></div>
  </span>
  </h4>`;
  elements.topRight.innerHTML = `
  <div class="btn-group" role="group" aria-label="log in button group">
  <button type="button" class="btn btn-twitch"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></button>
  <div class="btn-group" role="group">
  <button id="btnGroupDropLogin" type="button" class="btn btn-twitch dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"></button>
  <ul class="dropdown-menu dropdown-menu-lg-end" aria-labelledby="btnGroupDrop1">
  <li><a class="dropdown-item" onclick="logout()" href="#"><i class="material-icons notranslate">logout</i>Log out</a></li>
  </ul>
  </div>
  </div>`;
  refreshData();
  let options = {
    options: {
      clientId: CLIENT_ID,
      debug: false,
    },
    connection: {
      secure: true,
      reconnect: true,
    },
    channels: [USER.channel],
  };
  client = new tmi.client(options);

  client.on("message", async (target, context, msg, self) => {
    let input = msg.split(" ").filter(Boolean);
    let command = input[0].toLowerCase();

    if (!voters.includes(context.username)) {
      if (command in DONKHUNT.results) {
        voters.push(context.username);
        DONKHUNT.results[command].data += 1;
        updateGraph("donkhunt");
      }
    }
  }); //message

  client.on("timeout", (channel, username, reason, duration, userstate) => {}); //timeout

  client.on("connected", async (address, port) => {
    console.log(`Connected to ${address}:${port}`);
    elements.status.innerHTML = `<h4><span class="badge bg-success">Connected :)</span></h4>`;
    saveSettings();
    sendUsername(`chat.vote/games/donkhunt`, USER.channel, USER.platform == "twitch" ? `twitch - ${USER.twitchLogin}` : "youtube");
    if (await checkTags(USER.userID, USER.access_token)) {
      elements.vtsLink.style.display = "";
    }
    loadPFP();
  }); //connected

  client.on("disconnected", (reason) => {
    elements.status.innerHTML = `<h4><span class="badge bg-danger">Disconnected: ${reason}</span></h4>`;
  }); //disconnected

  client.on("notice", (channel, msgid, message) => {
    elements.status.innerHTML = `<h4><span class="badge bg-danger">Disconnected: ${message}</span></h4>`;
  }); //notice

  client.connect().catch(console.error);
} //connect

window.onload = function () {
  darkTheme = (localStorage.getItem("darkTheme") || "true") === "true";
  elements.darkTheme.checked = darkTheme ?? true;
  switchTheme(elements.darkTheme.checked);

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

  elements.connectbtn.addEventListener("click", function () {
    connect();
  });

  elements.darkTheme.onchange = function () {
    switchTheme(this.checked);
    saveSettings();
  };

  initGraph();

  DONKHUNT.listeners();
}; //onload

function initGraph() {
  if (DONKHUNT.chart) {
    DONKHUNT.chart.destroy();
  }

  DONKHUNT.chart = new Chart(DONKHUNT.ctx, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "score",
          data: [],
          borderWidth: 2,
        },
      ],
    },
    options: {
      indexAxis: "y",
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            color: "white",
          },
          beginAtZero: true,
        },
        y: {
          ticks: {
            textStrokeColor: "rgba(0,0,0,1)",
            textStrokeWidth: 3,
            color: "white",
            mirror: true,
            font: {
              size: 32,
            },
            z: 1,
          },
          beginAtZero: true,
        },
      },
      plugins: {
        tooltip: {
          enabled: false,
        },
        legend: {
          display: false,
        },
      },
    },
  });
} //initGraph

function updateGraph() {
  let results = Object.values(DONKHUNT.results);

  let label = results.map((a) => `${a.label} - ${a.data} votes (${Math.round((a.data / voters.length) * 100) || 0}%)`);
  let data = results.map((a) => a.data);
  let c1 = results.map((a) => a.c1);
  let c2 = results.map((a) => a.c2);

  DONKHUNT.html.totalVotesCount.innerHTML = `Total votes: ${data.reduce((ac, cv) => ac + cv, 0)}`;

  DONKHUNT.chart.data.labels = label;
  DONKHUNT.chart.data.datasets.forEach((dataset) => {
    dataset.data = data;
    dataset.backgroundColor = c1;
    dataset.borderColor = c2;
  });
  DONKHUNT.chart.update();
} //updateGraph

class HuntUnit {
  constructor(type, rowId, cellId) {
    if (!["hunter", "target"].includes(type)) throw new Error("Invalid type: " + type);
    this.type = type;
    this.cell = cellId;
    this.row = rowId;
  }
  moveTo(rowId, cellId) {
    console.log(`Action: move ${this.type} to [${rowId},${cellId}]`);
    DONKHUNT.field[this.row][this.cell] = "";
    this.cell = cellId;
    this.row = rowId;
    DONKHUNT.field[this.row][this.cell] = this.type;
  }
  getLocation() {
    return [this.row, this.cell];
  }
}

class HuntHunter extends HuntUnit {
  constructor(rowId, cellId, marker = "") {
    super("hunter", rowId, cellId);
    this.marker = marker;
  }
  isAbleToMove() {
    switch (this.row) {
      case 0:
        return false; // row 0: end of the line, cant move
      case 1: // row 1: can only move to base
        return DONKHUNT.field[0][1] === "";
      default: // row 2 and 3: can only move forward
        return DONKHUNT.field[this.row - 1][this.cell] === "";
    }
  }
  getValidMoveList() {
    if (!this.isAbleToMove()) return [];
    switch (this.row) {
      case 1: // row 1: can only move to base
        return [0, 1];
      default: // can only move forward
        return [this.row - 1, this.cell];
    }
  }
}

class HuntTarget extends HuntUnit {
  constructor(rowId, cellId) {
    super("target", rowId, cellId);
  }
  getValidMoveList() {
    const result = [];
    switch (this.row) {
      case 0: // row 0 (base): can move to any free cell in row 1
        DONKHUNT.field[1].forEach((_c, ci) => result.push([1, ci]));
        break;
      default: // any other row: can only move up down left right
        if (this.cell > 0) result.push([this.row, this.cell - 1]);
        if (this.cell < 2) result.push([this.row, this.cell + 1]);
        result.push([this.row + 1, this.cell]);
        result.push([this.row - 1, this.cell]);
        if (this.row === 1) result.push([0, 1]); // can move from row1 to base
    }
    // now check valid cells - if they are free or not
    return result.filter((coords) => DONKHUNT.field[coords[0]][coords[1]] === "");
  }
}

let DONKHUNT = {
  consts: {
    MEGALUL: '<img src="/games/pics/megalul.png" alt="MEGALUL" class="icon">',
    DONK: '<img src="/games/pics/donk.png" alt="Donk" class="icon">',
    FEELSDONKMAN: '<img src="/games/pics/feelsdonkman.png" alt="FeelsDonkMan" class="icon">',
    CLAP: '<img src="/games/pics/clap.gif" alt="Clap" class="icon">',
    KNIFE: '<img src="/games/pics/forsenknife.png" alt="Knife" class="icon">',
    FORSENO: '<img src="/games/pics/forseno.png" alt="Real Forsen" class="icon">',
  },
  html: {
    fieldRows: Array.from(document.querySelectorAll("div#dhfield div.dh-field-row")).map((row) => Array.from(row.querySelectorAll("div.dh-field-cell"))),
    allSettingControls: Array.from(document.querySelectorAll(".dhsettings")),
    startBtn: document.querySelector("#startdh"),
    gameResult: document.querySelector("#dhgameResult"),
    status: document.querySelector("#adviceFriend"),
    chartDiv: document.getElementById("dhchartdiv"),
    totalVotesCount: document.getElementById("totalvotesdh"),
  },
  ctx: document.getElementById("dhchartCanvas").getContext("2d"),
  chart: null,
  results: {}, // unlike other similar games, this prop uses keys as commands
  colors: ["#f44336", "#f4c236", "#a8f436", "#4336f4"],
  game: {
    hunters: [new HuntHunter(3, 0, "1"), new HuntHunter(3, 1, "2"), new HuntHunter(3, 2, "3")],
    target: new HuntTarget(2, 0),
    turn: 0,
    active: false,
  },
  player: {
    move1: null,
    side: null,
  },
  settings: {
    dhplayer: "target",
    dhfirst: "player",
  },
  field: [
    ["wall", "", "wall"],
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ],
  functions: {
    getHunterReference: function (row, cell) {
      let ref = null;
      DONKHUNT.game.hunters.forEach((h) => {
        if (h.row === row && h.cell === cell) ref = h;
      });
      if (!ref) console.warn(`Cell [${row}, ${cell}] does not correspond to any Hunter!`);
      return ref;
    },
    whoGoes: function () {
      return DONKHUNT.game.turn % 2 ? "hunter" : "target";
    },
    resetField: function () {
      DONKHUNT.field[0][1] = "";
      [1, 2, 3].forEach((row) => DONKHUNT.field[row].forEach((_e, i, a) => (a[i] = "")));
      DONKHUNT.game.hunters.forEach((h, hi) => h.moveTo(3, hi));
      DONKHUNT.game.target.moveTo(2, 1);
    },
    drawField: function (newGame = false) {
      DONKHUNT.html.fieldRows.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
          cell.classList.toggle("dh-p-wall", DONKHUNT.field[rowIndex][cellIndex] === "wall");
          cell.classList.toggle("dh-p-hunter", DONKHUNT.field[rowIndex][cellIndex] === "hunter");
          cell.classList.toggle("dh-p-target", DONKHUNT.field[rowIndex][cellIndex] === "target");
          cell.classList.remove("dh-event-target");
          cell.innerHTML = "";
          if (newGame) {
            cell.classList.remove("dh-field-winpath");
            cell.classList.remove("dh-p-invert");
          }
        });
      });
      DONKHUNT.game.hunters.forEach((h) => {
        DONKHUNT.html.fieldRows[h.row][h.cell].innerHTML = `<b>${h.marker}</b>`;
        if (h.cell > DONKHUNT.game.target.cell) DONKHUNT.html.fieldRows[h.row][h.cell].classList.add("dh-p-invert");
        if (h.cell < DONKHUNT.game.target.cell) DONKHUNT.html.fieldRows[h.row][h.cell].classList.remove("dh-p-invert");
      });
      if (DONKHUNT.game.active && DONKHUNT.functions.whoGoes() === DONKHUNT.player.side) {
        switch (
          DONKHUNT.player.side // highlight clickable fields for player
        ) {
          case "hunter":
            let ableToMoveCount = 0;
            DONKHUNT.game.hunters.forEach((h) => {
              if (h.isAbleToMove()) {
                DONKHUNT.html.fieldRows[h.row][h.cell].classList.add("dh-event-target");
                ableToMoveCount += 1;
              }
              if (h.cell > DONKHUNT.game.target.cell) DONKHUNT.html.fieldRows[h.row][h.cell].classList.add("dh-p-invert");
              if (h.cell < DONKHUNT.game.target.cell) DONKHUNT.html.fieldRows[h.row][h.cell].classList.remove("dh-p-invert");
            });
            if (ableToMoveCount < 1)
              setTimeout(() => {
                //wrap into arrow func to render new DOM
                showToast("Hunters have no valid moves! Skipping turn.", "warning", 3000);
                DONKHUNT.functions.turn(1);
              }, 50);
            break;
          case "target":
            DONKHUNT.game.target.getValidMoveList().forEach((move) => {
              DONKHUNT.html.fieldRows[move[0]][move[1]].classList.add("dh-event-target");
            });
            break;
        }
      }
    },
    turn: function (inc = 0) {
      DONKHUNT.game.turn += inc;
      // check win conditions
      if (DONKHUNT.game.target.getValidMoveList().length < 1) {
        DONKHUNT.functions.endGame("hunter", "Target is surrounded and has no way to escape!");
      } else {
        // target wins if it has unobstructed path to flag
        let noObstacles = true;
        for (let i = DONKHUNT.game.target.row + 1; i < DONKHUNT.field.length; i++) if (DONKHUNT.field[i][DONKHUNT.game.target.cell]) noObstacles = false;
        if (noObstacles) {
          for (let i = DONKHUNT.game.target.row; i < DONKHUNT.field.length; i++) DONKHUNT.html.fieldRows[i][DONKHUNT.game.target.cell].classList.add("dh-field-winpath");
          DONKHUNT.html.fieldRows[DONKHUNT.field.length - 1][1].classList.add("dh-field-winpath");
          DONKHUNT.functions.endGame("target", "Target found a way to escape!");
        }
      }
      // prepare for next turn
      if (!DONKHUNT.game.active) {
        DONKHUNT.html.status.innerText = 'Press "Start new game" to begin';
        return;
      }
      if (DONKHUNT.player.side === DONKHUNT.functions.whoGoes()) {
        // player turn
        DONKHUNT.html.chartDiv.classList.add("blur");
        switch (DONKHUNT.functions.whoGoes()) {
          case "hunter":
            DONKHUNT.html.status.innerHTML = `Click on a ${DONKHUNT.consts.MEGALUL} to move it forward.`;
            break;
          case "target":
            DONKHUNT.html.status.innerHTML = `Move ${DONKHUNT.consts.DONK} by clicking on a free cell.`;
            break;
        }
      } else {
        // opponent turn
        DONKHUNT.html.status.innerText = "Please wait until chat decides on next move.";
        DONKHUNT.html.chartDiv.classList.remove("blur");
        DONKHUNT.results = DONKHUNT.functions.buildChatOptions();
      }
      DONKHUNT.functions.drawField(DONKHUNT.game.turn === 0);
      updateGraph("donkhunt");
    },
    endGame: function (winnerSide, reason) {
      switch (winnerSide) {
        case "hunter":
          DONKHUNT.html.gameResult.querySelector("h2").innerHTML = `${DONKHUNT.consts.FORSENO}${DONKHUNT.consts.KNIFE} Hunters win!`;
          DONKHUNT.html.gameResult.querySelector("h4").innerText = reason;
          break;
        case "target":
          DONKHUNT.html.gameResult.querySelector("h2").innerHTML = `${DONKHUNT.consts.FEELSDONKMAN}${DONKHUNT.consts.CLAP} Target wins!`;
          DONKHUNT.html.gameResult.querySelector("h4").innerText = reason;
          break;
        default:
          DONKHUNT.html.gameResult.querySelector("h2").innerHTML = `${DONKHUNT.consts.DONK} Wait, what?`;
          DONKHUNT.html.gameResult.querySelector("h4").innerText = reason || "Something went wrong, this should never happen.";
          break;
      }
      DONKHUNT.html.gameResult.style.visibility = "visible";
      DONKHUNT.html.allSettingControls.forEach((c) => (c.disabled = false));
      DONKHUNT.game.active = false;
      DONKHUNT.functions.drawField();
      DONKHUNT.html.chartDiv.classList.add("blur");
    },
    emulateOpponentAction: function () {
      // this can be replaced by chat's action or by second player's action
      // really simple bot: just pick a random valid move
      switch (DONKHUNT.functions.whoGoes()) {
        case "hunter":
          const hunters = DONKHUNT.game.hunters.filter((h) => h.isAbleToMove());
          if (hunters.length) {
            let i = Math.floor(Math.random() * hunters.length);
            if (hunters[i].row > 1) hunters[i].moveTo(hunters[i].row - 1, hunters[i].cell);
            else hunters[i].moveTo(0, 1);
          } else {
            console.warn("Bot: Hunters cannot move!");
            showToast("Hunters have no valid moves - they skip their turn.", "warning", 3000);
          }
          break;
        case "target":
          const validMoves = DONKHUNT.game.target.getValidMoveList();
          if (!validMoves.length) return void console.warn("Bot: Target has nowhere to move!");
          let j = Math.floor(Math.random() * validMoves.length);
          DONKHUNT.game.target.moveTo(validMoves[j][0], validMoves[j][1]);
          break;
      }
      // after the move call the start of next turn:
      DONKHUNT.functions.turn(1);
    },
    buildChatOptions: function () {
      const list = {};

      switch (DONKHUNT.player.side) {
        case "hunter": {
          // chat is playing as TARGET; actions: left, up, right, down
          const variants = ["left", "up", "right", "down"];
          const moves = DONKHUNT.game.target.getValidMoveList();
          const location = DONKHUNT.game.target.getLocation();

          const relativeMoves = moves.map((move) => move.map((n, i) => n - location[i]));

          switch (
            location[0] // target's row
          ) {
            case 0: {
              // row 0 (base): can move to any free cell in row 1
              for (let i = 0; i < relativeMoves.length; i++) {
                const m = relativeMoves[i];
                if (m[0] > 0) {
                  switch (m[1]) {
                    case 0: {
                      list["down"] = moves[i];
                      break;
                    }
                    case -1: {
                      list["left"] = moves[i];
                      break;
                    }
                    case 1: {
                      list["right"] = moves[i];
                      break;
                    }
                  }
                }
              }
              break;
            }
            default: {
              // any other row
              for (let i = 0; i < relativeMoves.length; i++) {
                const m = relativeMoves[i];
                if (m[0] !== 0) {
                  list[m[0] > 0 ? "down" : "up"] = moves[i];
                } else {
                  list[m[1] > 0 ? "right" : "left"] = moves[i];
                }
              }
              break;
            }
          }

          for (const direction in list) {
            const color = DONKHUNT.colors[variants.indexOf(direction)];
            const cell = list[direction];
            list[direction] = { label: direction, data: 0, c1: color, c2: color, _chosenCell: cell };
          }
          break;
        }
        case "target": {
          // chat is playing as HUNTER: vote 1/2/3 to move corresponding unit
          let movableCount = 0;
          DONKHUNT.game.hunters.forEach((h, hIndex) => {
            if (h.isAbleToMove()) {
              const color = DONKHUNT.colors[hIndex];
              list[h.marker] = { label: h.marker, data: 0, c1: color, c2: color, _chosenUnit: hIndex };
              movableCount += 1;
            }
          });

          if (movableCount < 1) {
            setTimeout(() => {
              //wrap into arrow func to render new DOM
              showToast("Hunters have no valid moves! Skipping turn.", "warning", 3000);
              DONKHUNT.functions.turn(1);
            }, 50);
          }
        }
      }

      return list;
    },
  },
  start: function () {
    DONKHUNT.html.gameResult.style.visibility = "hidden";
    DONKHUNT.html.allSettingControls.forEach((c) => (c.disabled = true));
    DONKHUNT.functions.resetField();
    DONKHUNT.game.turn = 0;
    DONKHUNT.player.side = DONKHUNT.settings.dhplayer;
    DONKHUNT.game.active = true;
    console.log("Hunt: game has begun.");

    /* 
      because of (turn % 2 == 0) defines whose turn is it now, we check if turn 0 must be skipped
      this defines who moves first - target or hunters

      player="target" and first="player" => first turn 0 (player goes)
      player="hunter" and first="player" => first turn 1 (player goes)
      player="target" and first="enemy"  => first turn 1 (chat goes)
      player="hunter" and first="enemy"  => first turn 0 (chat goes)

      if (player="target") is boolX and (first="player") is boolY
      "first turn 1" condition is achieved whenever boolX != boolY
    */
    const needSkip0Turn = (DONKHUNT.settings.dhfirst === "player") !== (DONKHUNT.settings.dhplayer === "target");
    DONKHUNT.functions.turn(Number(needSkip0Turn));
  },
  reset: function () {
    DONKHUNT.html.gameResult.style.visibility = "hidden";
    DONKHUNT.html.allSettingControls.forEach((c) => (c.disabled = false));
    DONKHUNT.game.active = false;
    DONKHUNT.functions.resetField();
    DONKHUNT.functions.drawField();
  },
  playTurn: function () {
    if (voters.length < 1) return;
    voters.length = 0;

    DONKHUNT.html.chartDiv.classList.add("blur");
    DONKHUNT.html.totalVotesCount.innerHTML = `Total votes: 0`;

    let votedOption = { data: -1 };
    for (const voteOption in DONKHUNT.results) {
      const data = DONKHUNT.results[voteOption];
      if (votedOption.data < data.data) {
        votedOption = data;
      }
    }

    DONKHUNT.results = {};
    updateGraph("donkhunt");

    switch (DONKHUNT.functions.whoGoes()) {
      case "hunter": {
        const hunters = DONKHUNT.game.hunters;
        let i = votedOption._chosenUnit;
        if (hunters[i].row > 1) {
          hunters[i].moveTo(hunters[i].row - 1, hunters[i].cell);
        } else {
          // row 1 always goes up to [0,1]
          hunters[i].moveTo(0, 1);
        }
        break;
      }
      case "target": {
        const to = votedOption._chosenCell;
        DONKHUNT.game.target.moveTo(to[0], to[1]);
        break;
      }
    }

    // after the move call the start of next turn:
    DONKHUNT.functions.turn(1);
  },
  listeners: function () {
    // assign controls to playfield cells
    DONKHUNT.html.fieldRows.forEach((row) =>
      row.forEach((cell) =>
        cell.addEventListener("click", function (event) {
          if (!DONKHUNT.game.active) return void console.debug("Click ignored: game has not started yet.");
          if (!event.target.classList.contains("dh-event-target")) return void console.debug("Click ignored: target is not defined as a valid playmove cell.");
          if (DONKHUNT.player.side != DONKHUNT.functions.whoGoes()) return void console.debug("Click ignored: it is not player's turn to act.");
          // detect clicked field's coords
          const coords = {
            row: parseInt(event.target.parentNode.dataset.rowcount, 10),
            cell: parseInt(event.target.dataset.colcount, 10),
          };
          // check constraints and move unit if possible
          switch (DONKHUNT.field[coords.row][coords.cell]) {
            case "hunter":
              const actor = DONKHUNT.functions.getHunterReference(coords.row, coords.cell);
              if (!actor.isAbleToMove()) return void console.debug("Click ignored: Hunter cannot move!");
              if (actor.row > 1) actor.moveTo(actor.row - 1, actor.cell);
              else actor.moveTo(0, 1);
              break;
            default: // target clicks on empty fields
              const validMoves = DONKHUNT.game.target.getValidMoveList();
              validMoves.forEach((move) => {
                if (move[0] == coords.row && move[1] == coords.cell) DONKHUNT.game.target.moveTo(move[0], move[1]);
              });
              break;
          }
          // next turn
          DONKHUNT.functions.turn(1);
        })
      )
    );

    // assign listeners for settings
    const settingsInputGroupListener = function (event) {
      const target = event.target;
      const refOption = target.name;
      const refValue = target.value;
      DONKHUNT.settings[refOption] = refValue;
    };

    DONKHUNT.html.allSettingControls.forEach((input) => {
      // initialize the states:
      input.checked = DONKHUNT.settings[input.name] === input.value;
      // and assign the listeners:
      input.addEventListener("change", settingsInputGroupListener);
    });
  },
}; //DONKHUNT
