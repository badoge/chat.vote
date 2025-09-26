<script>
  import { enablePopovers, enableTooltips } from "$lib/functions";
  import { onMount } from "svelte";
  import IcBaselineRefresh from "~icons/ic/baseline-refresh";
  import IcBaselineDeleteForever from "~icons/ic/baseline-delete-forever";
  import IcBaselineVisibility from "~icons/ic/baseline-visibility";
  import IcBaselineCasino from "~icons/ic/baseline-casino";
  import IcBaselineSettings from "~icons/ic/baseline-settings";
  import IcOutlineArrowDropUp from "~icons/ic/outline-arrow-drop-up";
  import IcBaselineArrowDropDown from "~icons/ic/baseline-arrow-drop-down";
  import IcBaselineStackedBarChart from "~icons/ic/baseline-stacked-bar-chart";
  import IcBaselineToc from "~icons/ic/baseline-toc";
  import IcBaselinePlusOne from "~icons/ic/baseline-plus-one";
  import IcBaselineSwapHoriz from "~icons/ic/baseline-swap-horiz";
  import IcBaselineAttachMoney from "~icons/ic/baseline-attach-money";
  import IcBaselineNotificationImportant from "~icons/ic/baseline-notification-important";
  import IcBaselinePreview from "~icons/ic/baseline-preview";
  import IcBaselineCelebration from "~icons/ic/baseline-celebration";
  import IcBaselineFileDownload from "~icons/ic/baseline-file-download";
  import IcBaselineTimer from "~icons/ic/baseline-timer";
  import IcBaselineAdd from "~icons/ic/baseline-add";
  import IcBaselineHelp from "~icons/ic/baseline-help";
  import IcBaselineRestartAlt from "~icons/ic/baseline-restart-alt";
  import IcBaselineConnectWithoutContact from "~icons/ic/baseline-connect-without-contact";
  import IcBaselineContentCopy from "~icons/ic/baseline-content-copy";
  import IcBaselineSort from "~icons/ic/baseline-sort";
  import IcBaselinePieChart from "~icons/ic/baseline-pie-chart";
  import IcBaselineLayers from "~icons/ic/baseline-layers";
  import IcBaselineStop from "~icons/ic/baseline-stop";
  import IcBaselinePause from "~icons/ic/baseline-pause";
  import IcBaselinePlayArrow from "~icons/ic/baseline-play-arrow";
  let elements;
  let DONKHUNT;
  let bootstrap;
  onMount(async () => {
    bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");
    elements = {
      //modals
      grid: document.getElementById("grid"),
      gameDiv: document.getElementById("gameDiv"),
    };

    DONKHUNT = {
      consts: {
        ARROWS_MAP: {
          up: "↑",
          down: "↓",
          right: "→",
          left: "←",
        },
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
        gameResult: {
          h2: document.querySelector(".dhgameResult h2"),
          h4: document.querySelector(".dhgameResult h4"),
          _all: Array.from(document.querySelectorAll(".dhgameResult")),
        },
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
            if (h.row === row && h.cell === cell) {
              ref = h;
            }
          });
          if (!ref) {
            console.warn(`Cell [${row}, ${cell}] does not correspond to any Hunter!`);
          }
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
              if (newGame) {
                cell.classList.remove("dh-field-winpath");
                cell.classList.remove("dh-p-invert");
              }
            });
          });
          DONKHUNT.game.hunters.forEach((h) => {
            if (h.cell > DONKHUNT.game.target.cell) {
              DONKHUNT.html.fieldRows[h.row][h.cell].classList.add("dh-p-invert");
            }
            if (h.cell < DONKHUNT.game.target.cell) {
              DONKHUNT.html.fieldRows[h.row][h.cell].classList.remove("dh-p-invert");
            }
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
                  if (h.cell > DONKHUNT.game.target.cell) {
                    DONKHUNT.html.fieldRows[h.row][h.cell].classList.add("dh-p-invert");
                  }
                  if (h.cell < DONKHUNT.game.target.cell) {
                    DONKHUNT.html.fieldRows[h.row][h.cell].classList.remove("dh-p-invert");
                  }
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
            for (let i = DONKHUNT.game.target.row + 1; i < DONKHUNT.field.length; i++) {
              if (DONKHUNT.field[i][DONKHUNT.game.target.cell]) {
                noObstacles = false;
              }
            }
            if (noObstacles) {
              for (let i = DONKHUNT.game.target.row; i < DONKHUNT.field.length; i++) {
                DONKHUNT.html.fieldRows[i][DONKHUNT.game.target.cell].classList.add("dh-field-winpath");
              }
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
          DONKHUNT.functions.drawField(DONKHUNT.game.turn < 2);
          updateGraph();
        },
        endGame: function (winnerSide, reason) {
          switch (winnerSide) {
            case "hunter":
              DONKHUNT.html.gameResult.h2.innerHTML = `${DONKHUNT.consts.FORSENO}${DONKHUNT.consts.KNIFE} Hunters win!`;
              DONKHUNT.html.gameResult.h4.innerText = reason;
              break;
            case "target":
              DONKHUNT.html.gameResult.h2.innerHTML = `${DONKHUNT.consts.FEELSDONKMAN}${DONKHUNT.consts.CLAP} Target wins!`;
              DONKHUNT.html.gameResult.h4.innerText = reason;
              break;
            default:
              DONKHUNT.html.gameResult.h2.innerHTML = `${DONKHUNT.consts.DONK} Wait, what?`;
              DONKHUNT.html.gameResult.h4.innerText = reason || "Something went wrong, this should never happen.";
              break;
          }
          DONKHUNT.html.gameResult._all.forEach((e) => (e.style.visibility = "visible"));
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
                if (hunters[i].row > 1) {
                  hunters[i].moveTo(hunters[i].row - 1, hunters[i].cell);
                } else {
                  hunters[i].moveTo(0, 1);
                }
              } else {
                console.warn("Bot: Hunters cannot move!");
                showToast("Hunters have no valid moves - they skip their turn.", "warning", 3000);
              }
              break;
            case "target":
              const validMoves = DONKHUNT.game.target.getValidMoveList();
              if (!validMoves.length) {
                return void console.warn("Bot: Target has nowhere to move!");
              }
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

                // add visual hint:
                DONKHUNT.html.fieldRows[cell[0]][cell[1]].innerHTML = `<b>${DONKHUNT.consts.ARROWS_MAP[direction]}</b>`;
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

                  // add visual hint:
                  DONKHUNT.html.fieldRows[h.row][h.cell].innerHTML = `<b>${h.marker}</b>`;
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
        DONKHUNT.html.gameResult._all.forEach((e) => (e.style.visibility = "hidden"));
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
        DONKHUNT.html.gameResult._all.forEach((e) => (e.style.visibility = "hidden"));
        DONKHUNT.html.allSettingControls.forEach((c) => (c.disabled = false));
        DONKHUNT.game.active = false;
        DONKHUNT.functions.resetField();
        DONKHUNT.functions.drawField();
      },
      playTurn: function () {
        if (voters.length < 1) {
          return;
        }
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
        updateGraph();
        for (const row of DONKHUNT.html.fieldRows) {
          for (const cell of row) {
            cell.innerHTML = "";
          }
        }

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
              if (!DONKHUNT.game.active) {
                return void console.debug("Click ignored: game has not started yet.");
              }
              if (!event.target.classList.contains("dh-event-target")) {
                return void console.debug("Click ignored: target is not defined as a valid playmove cell.");
              }
              if (DONKHUNT.player.side != DONKHUNT.functions.whoGoes()) {
                return void console.debug("Click ignored: it is not player's turn to act.");
              }
              // detect clicked field's coords
              const coords = {
                row: parseInt(event.target.parentNode.dataset.rowcount, 10),
                cell: parseInt(event.target.dataset.colcount, 10),
              };
              // check constraints and move unit if possible
              switch (DONKHUNT.field[coords.row][coords.cell]) {
                case "hunter":
                  const actor = DONKHUNT.functions.getHunterReference(coords.row, coords.cell);
                  if (!actor.isAbleToMove()) {
                    return void console.debug("Click ignored: Hunter cannot move!");
                  }
                  if (actor.row > 1) {
                    actor.moveTo(actor.row - 1, actor.cell);
                  } else {
                    actor.moveTo(0, 1);
                  }
                  break;
                default: // target clicks on empty fields
                  const validMoves = DONKHUNT.game.target.getValidMoveList();
                  validMoves.forEach((move) => {
                    if (move[0] == coords.row && move[1] == coords.cell) {
                      DONKHUNT.game.target.moveTo(move[0], move[1]);
                    }
                  });
                  break;
              }
              // next turn
              DONKHUNT.functions.turn(1);
            }),
          ),
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

    enableTooltips();
    enablePopovers();

    elements.channelName.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        connect();
      }
    });

    initGraph();

    DONKHUNT.listeners();
  });

  let voters = [];

  let USER = {
    channel: "",
    twitchLogin: false,
    access_token: "",
    userID: "",
    platform: "",
  };

  function handleMessage(target, context, msg, self) {
    let input = msg.split(" ").filter(Boolean);
    let command = input[0].toLowerCase();

    if (!voters.includes(context.username)) {
      if (command in DONKHUNT.results) {
        voters.push(context.username);
        DONKHUNT.results[command].data += 1;
        updateGraph();
      }
    }
  } //handleMessage

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
              textStrokeColor: "rgba(0,0,0,1)",
              textStrokeWidth: 2,
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

    let label = results.map((a) => `${a.label} - ${a.data} ${a.data == 1 ? "vote" : "votes"} (${Math.round((a.data / voters.length) * 100) || 0}%)`);
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
      if (!["hunter", "target"].includes(type)) {
        throw new Error("Invalid type: " + type);
      }
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
      if (!this.isAbleToMove()) {
        return [];
      }
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
          if (this.cell > 0) {
            result.push([this.row, this.cell - 1]);
          }
          if (this.cell < 2) {
            result.push([this.row, this.cell + 1]);
          }
          result.push([this.row + 1, this.cell]);
          result.push([this.row - 1, this.cell]);
          if (this.row === 1) {
            result.push([0, 1]); // can move from row1 to base
          }
      }
      // now check valid cells - if they are free or not
      return result.filter((coords) => DONKHUNT.field[coords[0]][coords[1]] === "");
    }
  }
</script>

<svelte:head>
  <title>chat.vote Games - Donk Hunt</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="Scary looking creatures are trying to trap their prey. Are you the hunter or the hunted one?" />
  <meta name="keywords" content="chatvote, chat.vote, interactive, games, Twitch, chat" />
  <meta property="og:title" content="chat.vote Games - Donk Hunt" />
  <meta property="og:site_name" content="chat.vote Games - Donk Hunt" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chat.vote/games/donkhunt/" />
  <meta property="og:image" content="https://screenshot.donk.workers.dev/?url=https://chat.vote/games/donkhunt" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:description" content="Scary looking creatures are trying to trap their prey. Are you the hunter or the hunted one?" />
</svelte:head>

<div class="modal fade" id="howToPlayModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="howToPlayTitle">How to play - Donk hunt</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="howToPlayBody">
        <p>Hunters are trying to surround and kill the Target</p>
        <p>Hunters and Target will take turns to move around the field.</p>
        <p>Hunters can only move forward (upward). Only one Hunter can move each turn.</p>
        <p>Target can move in any direction (but not diagonally).</p>
        <p>Hunters and Target can only move diagonally when moving to or from the Base (topmost cell).</p>
        <p>Hunters win if Target has nowhere to go (is surrounded/blocked). Target wins if it finds a way to reach the flag.</p>
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
      <div class="col-6">
        <div id="dhplayground">
          <div class="dhgameResult" style="visibility: hidden">
            <h2>Win message goes here.</h2>
          </div>

          <div id="dhfield">
            <div class="dh-field-row" data-rowcount="0">
              <div class="dh-field-cell dh-p-wall"></div>
              <div class="dh-field-cell dh-field-base dh-field-usable" data-colcount="1"></div>
              <div class="dh-field-cell dh-p-wall"></div>
            </div>
            <div class="dh-field-row" data-rowcount="1">
              <div class="dh-field-cell dh-field-usable" data-colcount="0"></div>
              <div class="dh-field-cell dh-field-usable" data-colcount="1"></div>
              <div class="dh-field-cell dh-field-usable" data-colcount="2"></div>
            </div>
            <div class="dh-field-row" data-rowcount="2">
              <div class="dh-field-cell dh-field-usable dh-p-hunter" data-colcount="0"></div>
              <div class="dh-field-cell dh-field-usable dh-p-target" data-colcount="1"></div>
              <div class="dh-field-cell dh-field-usable dh-p-hunter dh-p-invert" data-colcount="2"></div>
            </div>
            <div class="dh-field-row" data-rowcount="3">
              <div class="dh-field-cell dh-field-usable" data-colcount="0"></div>
              <div class="dh-field-cell dh-field-usable" data-colcount="1"></div>
              <div class="dh-field-cell dh-field-usable" data-colcount="2"></div>
            </div>
            <div class="dh-field-row" data-rowcount="4">
              <div class="dh-field-cell dh-field-usable"></div>
              <div class="dh-field-cell dh-field-wincondition"></div>
              <div class="dh-field-cell dh-field-usable"></div>
            </div>
          </div>

          <div class="dhgameResult" style="visibility: hidden">
            <h4>Win condition will be explained here.</h4>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="row">
          <div class="col-6">
            <h4>Streamer plays as:</h4>
            <div class="form-check">
              <input checked class="form-check-input dhsettings" type="radio" value="target" name="dhplayer" id="dhplayer1" />
              <label class="form-check-label" for="dhplayer1"> <img width="24" height="24" src="/games/pics/donk.png" alt="Donk" class="icon" /> Target </label>
            </div>
            <div class="form-check">
              <input class="form-check-input dhsettings" type="radio" value="hunter" name="dhplayer" id="dhplayer2" />
              <label class="form-check-label" for="dhplayer2"> <img width="24" height="24" src="/games/pics/megalul.png" alt="MEGALUL" class="icon" /> Hunter </label>
            </div>
          </div>
          <div class="col-6">
            <h4>First move:</h4>
            <div class="form-check">
              <input checked class="form-check-input dhsettings" type="radio" value="player" name="dhfirst" id="dhfirst1" />
              <label class="form-check-label" for="dhfirst1">Streamer</label>
            </div>
            <div class="form-check">
              <input class="form-check-input dhsettings" type="radio" value="enemy" name="dhfirst" id="dhfirst2" />
              <label class="form-check-label" for="dhfirst2">Chat</label>
            </div>
          </div>
        </div>
        <button id="startdh" onclick={DONKHUNT.start} type="button" class="btn btn-success dhsettings my-3">Start new game</button>
        <div class="card">
          <div class="card-body">
            <div id="adviceFriend" class="fs-6 text-center">Press "Start new game" to begin</div>
          </div>
        </div>

        <div id="dhchartdiv" class="chart-container blur">
          <canvas id="dhchartCanvas"></canvas>
        </div>
        <span id="totalvotesdh">Total votes: 0</span><br />
        <button type="button" onclick={DONKHUNT.playTurn} class="btn btn-success">Play chat's pick</button>
      </div>
    </div>
  </div>
</div>

<style>
  body {
    margin-bottom: 1em;
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

  #dhchartdiv {
    position: relative;
    height: 40vh;
    width: 100%;
  }

  .blur {
    -webkit-filter: blur(10px) grayscale(100%);
    -moz-filter: blur(10px) grayscale(100%);
    -o-filter: blur(10px) grayscale(100%);
    -ms-filter: blur(10px) grayscale(100%);
    filter: blur(10px) grayscale(100%);
  }

  /* -----------------------------donkhunt---------------------------- */

  #dhplayground {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
  }

  #dhfield {
    margin: auto;
    display: flex;
    flex-flow: column nowrap;
    gap: 2px;
  }

  #adviceFriend img {
    max-width: 1.5em;
  }

  div.dh-field-row {
    flex: 1 0 auto;
    display: flex;
    flex-flow: row nowrap;
    gap: 2px;
  }

  div.dh-field-cell {
    flex: 1 0 auto;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 0.3em;
    width: 5em;
    height: 5em;
    display: flex;
    position: relative;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 60%;
    background-color: rgba(77, 77, 77, 0.17);
  }
  div.dh-field-cell b {
    margin: auto;
    font-size: 250%;
  }

  div.dh-p-wall {
    border: 0;
    background: none;
  }

  div.dh-field-base {
    background-color: rgba(117, 105, 89, 0.3);
    background-image: none;
  }
  div.dh-field-base:empty {
    background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMzc0IDM3NCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzc0IDM3NDtvcGFjaXR5OjAuNTU7IiB4bWw6c3BhY2U9InByZXNlcnZlIiBzdHJva2U9IiNmZjAiIGZpbGw9IiM4NzAiPg0KPHBhdGggZD0iTTM1Miw2NC4xOThoLTMwYy0xMi4xMzEsMC0yMiw5Ljg2OS0yMiwyMnYyMS4wNEwyMDYuNzk3LDE4LjcxYy0xMS4xMDEtMTAuNTQ1LTI4LjQ5My0xMC41NDQtMzkuNTk0LDANCglMNzQsMTA3LjIzOHYtMjEuMDRjMC0xMi4xMzEtOS44NjktMjItMjItMjJIMjJjLTEyLjEzMSwwLTIyLDkuODY5LTIyLDIydjI3N2g1NS41SDc0aDIyNmgxOC41SDM3NHYtMjc3DQoJQzM3NCw3NC4wNjcsMzY0LjEzMSw2NC4xOTgsMzUyLDY0LjE5OHogTTU0LDM0My4xOThIMjB2LTI1N2MwLTEuMTAzLDAuODk3LTIsMi0yaDMwYzEuMTAzLDAsMiwwLjg5NywyLDJWMzQzLjE5OHogTTE4MC45NzcsMzMuMjExDQoJYzMuMzc4LTMuMjA4LDguNjY5LTMuMjA4LDEyLjA0NywwbDk4Ljk1MSw5My45ODdoLTIzLjU5OWMtOC4yMDIsMC0xNC44NzUsNi42NzMtMTQuODc1LDE0Ljg3NXYxMi4xMjVoLTM0di0xMi4xMjUNCgljMC04LjIwMi02LjY3My0xNC44NzUtMTQuODc1LTE0Ljg3NWgtMzUuMjVjLTguMjAyLDAtMTQuODc1LDYuNjczLTE0Ljg3NSwxNC44NzV2MTIuMTI1aC0zNHYtMTIuMTI1DQoJYzAtOC4yMDItNi42NzMtMTQuODc1LTE0Ljg3NS0xNC44NzVIODIuMDI2TDE4MC45NzcsMzMuMjExeiBNMjI3LDM0My4xOThoLTgwdi01OC4xMjVjMC0xNy4zLDE0LjA3NS0zMS4zNzUsMzEuMzc1LTMxLjM3NWgxNy4yNQ0KCWMxNy4zLDAsMzEuMzc1LDE0LjA3NSwzMS4zNzUsMzEuMzc1VjM0My4xOTh6IE0yOTguNSwzNDMuMTk4SDI0N3YtNTguMTI1YzAtMjguMzI4LTIzLjA0Ny01MS4zNzUtNTEuMzc1LTUxLjM3NWgtMTcuMjUNCgljLTI4LjMyOCwwLTUxLjM3NSwyMy4wNDctNTEuMzc1LDUxLjM3NXY1OC4xMjVINzUuNXYtMTk2aDI1djEyLjEyNWMwLDguMjAyLDYuNjczLDE0Ljg3NSwxNC44NzUsMTQuODc1aDQ0LjI1DQoJYzguMjAyLDAsMTQuODc1LTYuNjczLDE0Ljg3NS0xNC44NzV2LTEyLjEyNWgyNXYxMi4xMjVjMCw4LjIwMiw2LjY3MywxNC44NzUsMTQuODc1LDE0Ljg3NWg0NC4yNQ0KCWM4LjIwMiwwLDE0Ljg3NS02LjY3MywxNC44NzUtMTQuODc1di0xMi4xMjVoMjVWMzQzLjE5OHogTTM1NCwzNDMuMTk4aC0zNHYtMjU3YzAtMS4xMDMsMC44OTctMiwyLTJoMzBjMS4xMDMsMCwyLDAuODk3LDIsMg0KCVYzNDMuMTk4eiIvPg0KPC9zdmc+");
  }

  div.dh-field-wincondition {
    background-color: rgba(117, 105, 89, 0.3);
    background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiIGZpbGw9IiMwYTAiPg0KPHBhdGggZD0iTTUwNC4wNTEsMjI5Ljg2MWMtMS41MzMtNS43MjItNS4yMDMtMTAuNTAyLTEwLjMzMS0xMy40NjFsLTQxLjMwMS0yMy44NDVsLTE5LjgwOC0xMS40MzZsNC4zNy03LjU3DQoJYzYuMTEyLTEwLjU4NSwyLjQ3NC0yNC4xNy04LjExMy0zMC4yODVsLTQxLjMwMS0yMy44NDRsLTUzLjU0LTMwLjkxMmwtNDYuNTc1LTI2Ljg4OGw1LjQwMi05LjM1Nw0KCWMwLjAwMS0wLjAwMSwwLjAwMS0wLjAwMiwwLjAwMi0wLjAwM2MxLjQ1NywwLjI1LDIuOTMzLDAuMzksNC40MTYsMC4zOWM5LjM4MiwwLDE4LjEyMy01LjA0MiwyMi44MTItMTMuMTYxDQoJYzcuMjU3LTEyLjU2OCwyLjkzNC0yOC42OTgtOS42MzctMzUuOTYxYy00LTIuMzA3LTguNTQ0LTMuNTI4LTEzLjE0My0zLjUyOGMtOS4zODIsMC0xOC4xMjQsNS4wNDMtMjIuODEyLDEzLjE2Mw0KCWMtMy41MTQsNi4wOTEtNC40NDcsMTMuMTgzLTIuNjI4LDE5Ljk3NGMxLjIwMyw0LjQ5LDMuNTMzLDguNDc0LDYuNzIsMTEuNjg2TDEyNi4wNzUsMzA4Ljk2OQ0KCWMtOS41NjctMi43Ny0yMC4xNjcsMS4xOC0yNS4zNjksMTAuMTg1TDEwLjE1LDQ3Ni4wMDVjLTYuMTA5LDEwLjU4MS0yLjQ3MSwyNC4xNjUsOC4xMTMsMzAuMjgzbDQuNzY3LDIuNzU0DQoJYzMuNDgsMi4wMDUsNy4yODIsMi45NTgsMTEuMDM3LDIuOTU4YzcuNjcsMCwxNS4xNDEtMy45NzYsMTkuMjQyLTExLjA3OGw1NC45NS05NS4xNzNjMi4yMi0zLjg0NSwwLjkwMy04Ljc2Mi0yLjk0Mi0xMC45ODINCgljLTMuODQ1LTIuMjE4LTguNzYyLTAuOTA0LTEwLjk4MiwyLjk0MmwtNTQuOTUsOTUuMTc0Yy0xLjY3OSwyLjkwNi01LjQxMiwzLjkwOS04LjMxOCwyLjIzM2wtNC43NTctMi43NDgNCgljLTIuOTEtMS42ODItMy45MTItNS40MTYtMi4yMzQtOC4zMjNsOTAuNTUzLTE1Ni44NDhjMS42ODEtMi45MTEsNS40MTQtMy45MTEsOC4zMjUtMi4yMzFsMi4zMjUsMS4zNDMNCgljMC4wMTcsMC4wMSwwLjAzMiwwLjAyMSwwLjA0OSwwLjAzMmMwLjAxMywwLjAwOCwwLjAyNywwLjAxMiwwLjA0LDAuMDE5bDIuMzQxLDEuMzUyYzEuNDExLDAuODE1LDIuNDE5LDIuMTI5LDIuODQxLDMuNw0KCWMwLjQyMSwxLjU3MSwwLjIwNSwzLjIxMi0wLjYwOSw0LjYyMmwtMjIuOTE0LDM5LjY4OWMtMi4yMiwzLjg0NS0wLjkwMyw4Ljc2MiwyLjk0MiwxMC45ODJjMy44NDQsMi4yMTksOC43NjEsMC45MDQsMTAuOTgyLTIuOTQyDQoJbDIyLjkxNC0zOS42ODljMi45NjItNS4xMjgsMy43NDgtMTEuMTAzLDIuMjE1LTE2LjgyM2MtMS4wNjQtMy45NzItMy4xNzktNy40NzQtNi4wNzktMTAuMjQ1bDQ2LjY3Ny04MC44NDRsNDYuNTc3LDI2Ljg5Mg0KCWMwLjAwMSwwLDAuMDAyLDAuMDAxLDAuMDAzLDAuMDAybDUzLjUzOSwzMC45MDdsMTkuODA1LDExLjQzNWwtNC4zNjgsNy41NjVjLTYuMTEzLDEwLjU4Ny0yLjQ3NSwyNC4xNzQsOC4xMTEsMzAuMjg5DQoJbDQxLjMwMSwyMy44NDVsNDEuMywyMy44NDNjMy4zNjksMS45NDUsNy4xOTgsMi45NzQsMTEuMDc0LDIuOTc0YzcuOTA0LDAsMTUuMjY2LTQuMjUxLDE5LjIxMi0xMS4wOWwyMy44NDMtNDEuMzAybDMwLjkxMS01My41MzUNCglsMjMuODQ5LTQxLjMwMkM1MDQuNzk2LDI0MS41NTUsNTA1LjU4MSwyMzUuNTgsNTA0LjA1MSwyMjkuODYxeiBNNDM3LjQxOCwyMDIuNDYxbC0xMC4zOTgsMTguMDExbC0xMi40NzEsMjEuNjAybC03LjI5Ni00LjIxMw0KCWwtNS41NDktMy4yMDRsOS4zMDQtMTYuMTE3bDEzLjU2Ny0yMy40OTZMNDM3LjQxOCwyMDIuNDYxeiBNMzU1LjU3OCwxOTAuOTA0bDM5LjYxNCwyMi44NjlsLTExLjQzNywxOS44MDYNCgljLTAuMDAyLDAuMDAzLTAuMDAzLDAuMDA2LTAuMDA1LDAuMDFsLTExLjQzLDE5Ljc5OGwtMzkuNjE1LTIyLjg3MUwzNTUuNTc4LDE5MC45MDR6IE0zMzAuMjE2LDIwMi42NzFsLTExLjQzNywxOS44MDUNCglsLTM5LjYwOS0yMi44NjlsMjIuODY4LTM5LjYxNWwzOS4xOTYsMjIuNjNsMC40MTksMC4yNDJMMzMwLjIxNiwyMDIuNjcxeiBNMzgyLjIyNywyNjguMzlsMTEuNDM1LTE5LjgwOGwxMi44NDYsNy40MTYNCglsLTExLjQzNiwxOS44MDhsLTExLjQzNiwxOS44MDZsLTUuMjQxLTMuMDI2bC03LjYwNC00LjM5TDM4Mi4yMjcsMjY4LjM5eiBNMzg2LjQ5LDEzNy4zNjRsMzQuMzM4LDE5LjgyNA0KCWMyLjkwOSwxLjY4MSwzLjkxLDUuNDEzLDIuMjMsOC4zMjJsLTE5LjgyNiwzNC4zMzdsLTE5LjgwOC0xMS40MzRsLTE5LjgwNi0xMS40MzRsMTEuNDM2LTE5LjgwOEwzODYuNDksMTM3LjM2NHogTTMzMi45NSwxMDYuNDUzDQoJbDM5LjYxNiwyMi44NzNsLTExLjQzNiwxOS44MDdsLTExLjQzNiwxOS44MDdsLTE5LjgwNy0xMS40MzZsLTE5LjgwOS0xMS40MzZsMTEuNDM2LTE5LjgwOEwzMzIuOTUsMTA2LjQ1M3ogTTI4OC40MTgsMjEuMjAxDQoJYzEuODI0LTMuMTU5LDUuMjMtNS4xMjMsOC44ODctNS4xMjNjMS43ODEsMCwzLjU0OCwwLjQ3Niw1LjEwMywxLjM3M2M0Ljg5MywyLjgyOCw2LjU3Nyw5LjEwNiwzLjc1NCwxMy45OTYNCgljLTEuODI1LDMuMTYtNS4yMzIsNS4xMjQtOC44ODksNS4xMjRjLTEuNzgsMC0zLjU0Ni0wLjQ3Ni01LjEwNS0xLjM3N2MtMi4zNy0xLjM2Ny00LjA2NS0zLjU3Ni00Ljc3Mi02LjIxOA0KCUMyODYuNjg3LDI2LjMzMiwyODcuMDQ5LDIzLjU3MSwyODguNDE4LDIxLjIwMXogTTI3OS40MTQsNzUuNTQ0bDM5LjYxMiwyMi44NjhMMzA3LjU5LDExOC4yMmwtMTEuNDM2LDE5LjgwN2wtMzQuMzItMTkuODEzDQoJbC01LjI5Mi0zLjA1NUwyNzkuNDE0LDc1LjU0NHogTTI0OC41MDEsMTI5LjA4NWwzOS42MTMsMjIuODY5bC0yMi44NjcsMzkuNjE1bC0xNy40NS0xMC4wNzRsLTIyLjE2Ny0xMi43OTdMMjQ4LjUwMSwxMjkuMDg1eg0KCSBNMTk0LjcyLDIyMi4yMzZsMjIuODcxLTM5LjYxNGwzOS42MTcsMjIuODcxbC0yMi44NzUsMzkuNjE0TDE5NC43MiwyMjIuMjM2eiBNMjQ4LjI1NywyNTMuMTQ2bDIyLjg3NS0zOS42MTRsMjAuNjE1LDExLjkwMg0KCWwxOC45OTQsMTAuOTY3bC0yMi44NjgsMzkuNjE1TDI0OC4yNTcsMjUzLjE0NnogTTMwMS43OTgsMjg0LjA1NWwyMi44NjgtMzkuNjE1bDM5LjYxNSwyMi44NzFsLTExLjQzNSwxOS44MDZsLTguMzksMTQuNTMxDQoJYy0wLjEzNiwwLjIzNS0wLjI4NiwwLjQ1OS0wLjQ0OSwwLjY3MWMtMS4xNDUsMS40ODQtMi45MzUsMi4zNzktNC44MzksMi4zNzljLTEuMDcyLDAtMi4wOTEtMC4yNzUtMy4wMzEtMC44MThsLTE0LjUzMi04LjM5MQ0KCWMtMC4wMDgtMC4wMDQtMC4wMTYtMC4wMDgtMC4wMjQtMC4wMTJMMzAxLjc5OCwyODQuMDU1eiBNMzUyLjcyNSwzNDkuMTUxbC0zNC4zMzgtMTkuODI1Yy0yLjkwOS0xLjY4Mi0zLjkwOC01LjQxNi0yLjIyNy04LjMyOA0KCWw0LjM2OC03LjU2NWw3LjU3MSw0LjM3MWMyLjM5OSwxLjM4NSw1LjAzMywyLjI5NSw3Ljc0OSwyLjcxYzAuMTQ0LDAuMDIzLDAuMjg3LDAuMDUzLDAuNDMxLDAuMDcyDQoJYzAuMTk3LDAuMDI2LDAuMzk2LDAuMDM5LDAuNTk0LDAuMDU5YzAuMjgyLDAuMDMsMC41NjQsMC4wNjUsMC44NDcsMC4wODRjMC4yMjcsMC4wMTUsMC40NTYsMC4wMTUsMC42ODMsMC4wMjMNCgljMC4yNTUsMC4wMDksMC41MSwwLjAyNiwwLjc2NiwwLjAyNmMwLjAwMSwwLDAuMDAxLDAsMC4wMDIsMGM1LjQzMiwwLDEwLjYxMS0yLjAwOSwxNC41OTktNS40ODcNCgljMS44MTMtMS41ODEsMy4zOC0zLjQ2NSw0LjYxMy01LjYwM2w0LjM2OS03LjU2N2w3LjUxNSw0LjMzOWw1LjMzMSwzLjA3OGwtMTEuNDM2LDE5LjgwNkwzNTIuNzI1LDM0OS4xNTF6IE00MDkuMzA4LDM3NC43ODUNCgljLTEuMDg1LDEuODgtMy4xMSwzLjA0OC01LjI4NywzLjA0OGMtMS4wNzIsMC0yLjA5MS0wLjI3NS0zLjAzMy0wLjgybC0zNC4zMzktMTkuODI1bDExLjQzNi0xOS44MDZsMTEuNDM2LTE5LjgwNmwzOS42MTIsMjIuODY4DQoJTDQwOS4zMDgsMzc0Ljc4NXogTTQzNy4xNzIsMzI2LjUxOGwtMTkuODA1LTExLjQzNGwtMTkuODA1LTExLjQzNGwxMS40MzYtMTkuODA2bDExLjQzNi0xOS44MDhsMzkuNjEyLDIyLjg3TDQzNy4xNzIsMzI2LjUxOHoNCgkgTTQ4Ny45MTEsMjM4LjY0NGwtMTkuODI4LDM0LjMzOWwtMzkuNjEyLTIyLjg3bDEyLjM5My0yMS40NjdsMTAuNDc3LTE4LjE0N2wzNC4zNDIsMTkuODI4YzEuNDA3LDAuODEyLDIuNDE1LDIuMTIzLDIuODM1LDMuNjk0DQoJQzQ4OC45NCwyMzUuNTk0LDQ4OC43MjUsMjM3LjIzNSw0ODcuOTExLDIzOC42NDR6Ii8+DQo8L3N2Zz4NCg==");
    opacity: 0.7;
  }

  div.dh-p-target {
    background-image: url(/games/pics/donk.png) !important;
    opacity: 1 !important;
  }

  div.dh-p-hunter {
    background-image: url(/games/pics/megalul.png) !important;
    opacity: 1 !important;
  }

  div.dh-p-hunter b {
    position: absolute;
    bottom: 0.25rem;
    left: 0.25rem;
    font-size: inherit;
  }

  div.dh-p-invert {
    transform: scaleX(-1);
  }
  div.dh-p-invert b {
    transform: scaleX(-1);
    left: unset;
    right: 0.25rem;
  }

  div.dh-field-usable:hover {
    cursor: pointer;
    border-color: rgba(55, 214, 36, 0.84);
    background-color: rgba(151, 249, 129, 0.38);
    animation: none;
  }

  div.dh-field-winpath {
    border-color: rgba(194, 214, 36, 0.84);
    background-color: rgba(249, 242, 129, 0.38);
  }

  .dhgameResult {
    text-align: center;
    margin: auto;
  }

  .dhgameResult img {
    max-width: 1.5em;
  }

  /* css experiment - donk is scared */

  @keyframes look-around {
    0% {
      transform: scaleX(1);
    }
    16% {
      transform: scaleX(1);
    }
    17% {
      transform: scaleX(-1);
    }
    48% {
      transform: scaleX(-1);
    }
    49% {
      transform: scaleX(1);
    }
    59% {
      transform: scaleX(1);
    }
    60% {
      transform: scaleX(-1);
    }
    100% {
      transform: scaleX(-1);
    }
  }

  div.dh-p-target {
    animation: look-around 3s infinite step-start;
  }

  /* css experiment - highlight valid cells */

  @keyframes pulse-valids {
    0% {
      background-color: rgba(77, 77, 77, 0.17);
      border-color: silver;
    }
    50% {
      background-color: rgba(71, 159, 101, 0.2);
      border-color: rgba(6, 250, 17, 0.33);
    }
    100% {
      background-color: rgba(77, 77, 77, 0.17);
      border-color: silver;
    }
  }

  div.dh-event-target {
    animation: pulse-valids 1.337s ease-in-out infinite alternate;
  }

  /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^donkhunt^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
</style>
