let streamersTurn = true;
let voters = [];

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
function handleMessage(target, context, msg, self) {
  let input = msg.split(" ").filter(Boolean);

  if (streamersTurn) {
    return;
  }

  let vote_int = parseInt(input[0], 10);
  if (isNaN(vote_int)) {
    return;
  }
  if (vote_int > 0 && vote_int < 10) {
    if (!voters.includes(context.username)) {
      if (TTT.gameBoard[vote_int - 1]) {
        return;
      }
      voters.push(context.username);
      let index = TTT.results.findIndex((obj) => obj.label == vote_int);
      TTT.results[index].data += 1;
      updateGraph();
      return;
    }
  }
} //handleMessage

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

  elements.darkTheme.onchange = function () {
    switchTheme(this.checked);
    saveSettings();
  };

  initGraph();
  listeners();
  document.getElementById("tttoverlay").innerHTML = `<span class="overlaytext">${USER.channel || "STREAMER"}'s turn</span>`;
}; //onload

function initGraph() {
  if (TTT.chart) {
    TTT.chart.destroy();
  }

  TTT.chart = new Chart(TTT.ctx, {
    type: "bar",
    data: {
      labels: [
        "1 - 0 Votes (0%)",
        "2 - 0 Votes (0%)",
        "3 - 0 Votes (0%)",
        "4 - 0 Votes (0%)",
        "5 - 0 Votes (0%)",
        "6 - 0 Votes (0%)",
        "7 - 0 Votes (0%)",
        "8 - 0 Votes (0%)",
        "9 - 0 Votes (0%)",
      ],
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
  let label, data, c1, c2;
  label = TTT.results.map((a) => a.label);
  data = TTT.results.map((a) => a.data);
  c1 = TTT.results.map((a) => a.c1);
  c2 = TTT.results.map((a) => a.c2);

  let list = [];
  let total = 0;
  for (let j = 0; j < data.length; j++) {
    list.push({ data: data[j], label: label[j], c1: c1[j], c2: c2[j] });
  }
  for (let k = 0; k < list.length; k++) {
    data[k] = list[k].data;
    label[k] = `${list[k].label} - ${list[k].data} ${list[k].data == 1 ? "Vote" : "Votes"} (${Math.round((list[k].data / voters.length) * 100) || 0}%)`;
    c1[k] = list[k].c1;
    c2[k] = list[k].c2;
    total += list[k].data;
  }

  document.getElementById("totalvotesttt").innerHTML = `Total votes: ${total}`;

  TTT.chart.data.labels = label;
  TTT.chart.data.datasets.forEach((dataset) => {
    dataset.data = data;
    dataset.backgroundColor = c1;
    dataset.borderColor = c2;
  });
  TTT.chart.update();
} //updateGraph

let TTT = {
  chart: null,
  isComputerPlaying: false,
  isGameOver: false,
  gameBoard: [null, null, null, null, null, null, null, null, null],
  squares: $(".square"),
  ctx: document.getElementById("tttchartCanvas").getContext("2d"),
  results: [
    { label: "1", data: 0, c1: "#f44336", c2: "#f53337" },
    { label: "2", data: 0, c1: "#f4c236", c2: "#f5c237" },
    { label: "3", data: 0, c1: "#a8f436", c2: "#a9e437" },
    { label: "4", data: 0, c1: "#36f443", c2: "#37e444" },
    { label: "5", data: 0, c1: "#36f4c2", c2: "#37e4c3" },
    { label: "6", data: 0, c1: "#36a8f4", c2: "#3798f5" },
    { label: "7", data: 0, c1: "#4336f4", c2: "#4426f5" },
    { label: "8", data: 0, c1: "#a236d4", c2: "#a326d5" },
    { label: "9", data: 0, c1: "#f336b8", c2: "#f426b9" },
  ],
  winningCombos: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ],
  pieceClasses: {
    X: "text-success",
    O: "text-warning",
  },
}; //TTT

function updateGameBoard(index, value, el) {
  TTT.gameBoard[index] = value;
  el.html(value);
  el.addClass([TTT.pieceClasses[value], "text-shadow"]);

  let donk = document.getElementsByClassName("choices");
  for (let i = 0, j = donk.length; i < j; i++) {
    donk[i].innerHTML = 0;
    if (TTT.gameBoard[i]) {
      $(donk[i]).parent().addClass("text-body-secondary");
    }
  }
} //updateGameBoard

function reset() {
  init();
  TTT.squares.removeClass(["text-shadow"].concat(Object.values(TTT.pieceClasses)));
  document.getElementById("totalvotesttt").innerHTML = `Total votes: 0`;
  document.getElementById("tttoutput").innerHTML = "";
  document.getElementById("tttchartCanvas").classList = "blur";
  document.getElementById("tttoverlay").innerHTML = `<span class="overlaytext">${USER.channel || "STREAMER"}'s turn</span>`;
  TTT.results = [
    { label: "1", data: 0, c1: "#f44336", c2: "#f53337" },
    { label: "2", data: 0, c1: "#f4c236", c2: "#f5c237" },
    { label: "3", data: 0, c1: "#a8f436", c2: "#a9e437" },
    { label: "4", data: 0, c1: "#36f443", c2: "#37e444" },
    { label: "5", data: 0, c1: "#36f4c2", c2: "#37e4c3" },
    { label: "6", data: 0, c1: "#36a8f4", c2: "#3798f5" },
    { label: "7", data: 0, c1: "#4336f4", c2: "#4426f5" },
    { label: "8", data: 0, c1: "#a236d4", c2: "#a326d5" },
    { label: "9", data: 0, c1: "#f336b8", c2: "#f426b9" },
  ];
} //reset

function init() {
  for (let i = 0, j = TTT.squares.length; i < j; i++) {
    TTT.squares[i].innerHTML = `<span class="text-body-secondary">${i + 1}</span>`;
  }
  TTT.gameBoard = [null, null, null, null, null, null, null, null, null];
  TTT.isComputerPlaying = false;
  TTT.isGameOver = false;
  document.getElementById("gameboard").classList = "pointer";
} //init

function checkWin(value) {
  for (let combo = 0, j = TTT.winningCombos.length; combo < j; combo++) {
    if (TTT.winningCombos[combo].every((i) => TTT.gameBoard[i] === value)) {
      return endGame(value);
    }
  }

  if (TTT.gameBoard.every((field) => field !== null)) {
    return endGame("draw");
  }

  return false;
} //checkWin

function endGame(value) {
  if (value === "X") {
    document.getElementById("tttoutput").innerHTML = `${USER.channel} wins<br> <button type="button" onclick="resetGame()" class="btn btn-primary">Play again</button>`;
  } else if (value === "O") {
    document.getElementById("tttoutput").innerHTML = `Chat wins<br> <button type="button" onclick="resetGame()" class="btn btn-primary">Play again</button>`;
  } else {
    document.getElementById("tttoutput").innerHTML = `Draw<br> <button type="button" onclick="resetGame()" class="btn btn-primary">Play again</button>`;
  }
  TTT.isGameOver = true;
  //	let playAgain = confirm("Click Ok to play again...");
  //	if(playAgain){
  //		init();
  //	}

  return true;
} //endGame

function getChatMove() {
  let list = TTT.results;
  list.sort(function (a, b) {
    return a.data > b.data ? -1 : a.data == b.data ? 0 : 1;
  });
  return list[0];
} //getChatMove

function playTurn() {
  if (voters.length == 0) {
    return;
  }
  streamersTurn = true;
  document.getElementById("tttchartCanvas").classList = "blur";
  document.getElementById("tttoverlay").innerHTML = `<span class="overlaytext">${USER.channel || "STREAMER"}'s turn</span>`;
  voters = [];
  let theSquareToPlay = getChatMove();
  theSquareToPlay = theSquareToPlay.label;
  TTT.results = TTT.results.filter(function (el) {
    return el.label != theSquareToPlay;
  });
  TTT.results.forEach((element, index) => {
    TTT.results[index].data = 0;
  });
  TTT.results.sort(function (a, b) {
    return parseInt(a.label, 10) < parseInt(b.label, 10) ? -1 : parseInt(a.label, 10) == parseInt(b.label, 10) ? 0 : 1;
  });
  updateGraph();
  let $theSelectedSquare = $(".square-0" + `${parseInt(theSquareToPlay, 10) - 1}`);
  updateGameBoard(`${parseInt(theSquareToPlay, 10) - 1}`, "O", $theSelectedSquare);
  if (checkWin("O")) {
    document.getElementById("tttoverlay").innerHTML = "";
  }
  TTT.isComputerPlaying = false;
  document.getElementById("gameboard").classList = "cursorpointer";
  document.getElementById("totalvotesttt").innerHTML = `Total votes: 0`;
} //playTurn

function listeners() {
  TTT.squares.click(function () {
    let squareIndexValue = parseInt($(this).data("index"), 10);
    if (TTT.isGameOver || TTT.isComputerPlaying || TTT.gameBoard[squareIndexValue] !== null) {
      return;
    }

    streamersTurn = false;
    voters = [];

    document.getElementById("gameboard").classList = "cursordefault";
    document.getElementById("tttchartCanvas").classList = "";
    document.getElementById("tttoverlay").innerHTML = "";

    updateGameBoard(squareIndexValue, "X", $(this));
    checkWin("X");

    TTT.isComputerPlaying = true;
    TTT.results = TTT.results.filter((el) => el.label != `${squareIndexValue + 1}`);
    TTT.results.forEach((element, index) => {
      TTT.results[index].data = 0;
    });
    updateGraph();
  }); //TTT click
} //listeners

function resetGame() {
  voters = [];
  initGraph();
  streamersTurn = true;
  reset();
} //resetGame
