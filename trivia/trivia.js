let client;
let numberOfOptions = 2;
let loginExpiredModal;
let answer = "";
let started = false;
let users = [];
let answered = [];
let questionsArray = [];
let answersArray = [];
let imagesArray = [];

let points;

let questionNumber = 1;

let elements = {
  //modals
  loginExpiredModal: document.getElementById("loginExpiredModal"),
  twitchStatus: document.getElementById("twitchStatus"),
  topRight: document.getElementById("topRight"),
  start: document.getElementById("start"),
  showAnswer: document.getElementById("showAnswer"),
  next: document.getElementById("next"),
  questionNumber: document.getElementById("questionNumber"),
  optionsDiv: document.getElementById("optionsDiv"),
  toastContainer: document.getElementById("toastContainer"),
  usersDiv: document.getElementById("usersDiv"),
  users: document.getElementById("users"),
  question: document.getElementById("question"),
  showHint: document.getElementById("showHint"),
  points: document.getElementById("points"),
  firstOnly: document.getElementById("firstOnly"),
  multipleChoice: document.getElementById("multipleChoice"),
};

let USER = {
  channel: "",
  twitchLogin: false,
  access_token: "",
  userID: "",
};

let TRIVIA = {
  questions: [],
  answers: [],
  images: [],
};

function load_localStorage() {
  if (!localStorage.getItem("USER")) {
    console.log("localStorage user info not found");
  } else {
    USER = JSON.parse(localStorage.getItem("USER"));
  }

  if (!localStorage.getItem("TRIVIA")) {
    console.log("localStorage trivia not found");
  } else {
    TRIVIA = JSON.parse(localStorage.getItem("TRIVIA"));
    console.log(TRIVIA);
    for (let index = 0; index < TRIVIA.questions.length - 2; index++) {
      addInput();
    }
    let questions = [...document.querySelectorAll(".questions")];
    let answers = [...document.querySelectorAll(".answers")];
    let imageSpans = [...document.querySelectorAll(".poll-image")];
    for (let index = 0; index < TRIVIA.questions.length; index++) {
      questions[index].value = `${TRIVIA.images[index]} ${TRIVIA.questions[index]}`.trim();
      answers[index].value = TRIVIA.answers[index].trim();
    }
  }
} //load_localStorage

function saveSettings() {
  let questions = [...document.querySelectorAll(".questions")];
  let answers = [...document.querySelectorAll(".answers")];
  let imageSpans = [...document.querySelectorAll(".poll-image")];
  TRIVIA.questions = [];
  TRIVIA.answers = [];
  TRIVIA.images = [];

  for (let index = 0; index < questions.length; index++) {
    if (!questions[index].value && !answers[index].value && !imageSpans[index].value) {
      continue;
    }
    TRIVIA.questions.push(questions[index].value);
    TRIVIA.answers.push(answers[index].value);
    TRIVIA.images.push(imageSpans[index].dataset.imageUrl);
  }
  console.log(TRIVIA);
  localStorage.setItem("TRIVIA", JSON.stringify(TRIVIA));
}

function resetSettings() {
  localStorage.setItem(
    "TRIVIA",
    JSON.stringify({
      questions: [],
      answers: [],
      images: [],
    })
  );
  location.reload();
  return false;
}

async function start() {
  elements.start.style.display = "none";
  elements.showAnswer.style.display = "";
  elements.next.style.display = "";

  points = parseInt(elements.points.value, 10);

  started = true;
  questionNumber = 1;
  answered = [];
  users = [];
  elements.users.innerHTML = "";

  let questions = [...document.querySelectorAll(".questions")];
  let answers = [...document.querySelectorAll(".answers")];
  let imageSpans = [...document.querySelectorAll(".poll-image")];

  questionsArray = [];
  answersArray = [];
  imagesArray = [];

  for (let index = 0, j = questions.length; index < j; index++) {
    if (!questions[index].value && !imageSpans[index].dataset.imageUrl) {
      continue;
    }

    if (!questions[index].value && imageSpans[index].dataset.imageUrl) {
      questionsArray.push(`Question #${index + 1} with image`);
    } else {
      questionsArray.push(questions[index].value);
    }
    imagesArray.push(imageSpans[index].dataset.imageUrl);

    let options = answers[index].value.split("|");

    for (let index2 = 0; index2 < options.length; index2++) {
      options[index2] = options[index2].trim().toLowerCase();
    }

    answersArray.push(options);
  }
  answer = answersArray[questionNumber - 1];

  elements.questionNumber.innerText = `Question 1/${questionsArray.length}`;
  let img = imagesArray[questionNumber - 1] ? `<div class="resizable"><img src="${imagesArray[questionNumber - 1]}" alt="question image"/></div>` : "";
  elements.question.innerHTML = `${img}<br>Question: ${questionsArray[questionNumber - 1]}<br><span id="answer">${getHint()}</span>`;
} //start

function next() {
  points = parseInt(elements.points.value, 10);

  questionNumber++;
  answered = [];
  started = true;

  answer = answersArray[questionNumber - 1];
  if (!questionsArray[questionNumber - 1]) {
    showToast("no more questions", "danger", 5000);
    return;
  }

  if (!answer[0]) {
    showToast("question has no answer", "danger", 5000);
    return;
  }
  elements.questionNumber.innerText = `Question ${questionNumber}/${questionsArray.length}`;

  let img = imagesArray[questionNumber - 1] ? `<div class="resizable"><img src="${imagesArray[questionNumber - 1]}" alt="question image" /></div>` : "";

  elements.question.innerHTML = `${img}<br>Question: ${questionsArray[questionNumber - 1]}<br><span id="answer">${getHint()}</span>`;
} //next

let choices = ["a", "b", "c", "d"];
let correctChoice;
let correctAnswer;

function getHint() {
  if (elements.multipleChoice.checked) {
    if (answer.length < 4) {
      showToast("Question has less than 4 choices", "danger", 3000);
    }

    correctAnswer = answer[0];
    let shuffled = shuffle(structuredClone(answer));
    let index = shuffled.findIndex((element) => element === correctAnswer);
    correctChoice = choices[index];

    return `Choices:<br>
    <button type="button" class="btn btn-lg btn-primary"><span class="float-start">A •</span> ${shuffled[0]}</button>
    <button type="button" class="btn btn-lg btn-danger"><span class="float-start">B •</span> ${shuffled[1]}</button><br>
    <button type="button" class="btn btn-lg btn-warning mt-2"><span class="float-start">C •</span> ${shuffled[2]}</button>
    <button type="button" class="btn btn-lg btn-info mt-2"><span class="float-start">D •</span> ${shuffled[3]}</button>`;
  }

  if (!elements.showHint.checked) {
    return "Answer: ?";
  }

  let hint = "";
  for (let index = 0; index < answer[0].length; index++) {
    if (answer[0].charAt(index).match(/^[0-9a-z]+$/)) {
      hint += "_ ";
    }
    if (answer[0].charAt(index) == " ") {
      hint += "&nbsp; ";
    }
  }
  return hint;
} //getHint

function showAnswer() {
  started = false;
  if (elements.multipleChoice.checked) {
    document.getElementById("answer").innerHTML = `Answer: ${correctAnswer}`;
  } else {
    document.getElementById("answer").innerHTML = `Answer: ${answer[0]}`;
  }
} //showAnswer

async function loadAndConnect() {
  load_localStorage();
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  channel = params.channel || USER.channel;
  if (USER.twitchLogin && !(await checkToken(USER.access_token))) {
    USER.channel = "";
    loginExpiredModal.show();
    return;
  }
  if (USER.channel) {
    connect();
  }
} //loadAndConnect

function logout() {
  elements.topRight.innerHTML = `<div class="btn-group" role="group" aria-label="log in button group">
      <a role="button" id="loginButton" onclick="login()" class="btn btn-twitch" tabindex="0" data-bs-container="body" data-bs-trigger="manual" data-bs-placement="bottom" data-bs-toggle="popover" data-bs-title="Not signed in" data-bs-content="You need sign in first before adding options or enabling voting/suggestions/raffle"><span class="twitch-icon"></span>Sign in with Twitch</a>
      <div class="btn-group" role="group">
          <button id="btnGroupDropLogin" type="button" class="btn btn-twitch dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
        </button>
          <ul class="dropdown-menu dropdown-menu-lg-end" aria-labelledby="btnGroupDropLogin">
              <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modal1" href="#">Connect manually</a></li>
          </ul>
      </div>
  </div>`;
  resetSettings();
} //logout

function deleteImage(event) {
  let imageSpans = [...document.querySelectorAll(".poll-image")];
  let removeImageButtons = [...document.querySelectorAll(".remove-image")];
  let index = imageSpans.findIndex((element) => parseInt(element.dataset.optionId, 10) === parseInt(event.target.dataset.optionId, 10));
  if (index != -1) {
    imageSpans[index].innerHTML = "";
    imageSpans[index].dataset.imageUrl = "";
    imageSpans[index].style.display = "none";
    removeImageButtons[index].style.display = "none";
  }
} //deleteImage

function deleteInput(event) {
  let optionCards = [...document.querySelectorAll(".option-card")];
  let index = optionCards.findIndex((element) => parseInt(element.dataset.optionId, 10) === parseInt(event.target.dataset.optionId, 10));
  if (index != -1) {
    if (optionCards.length > 2) {
      optionCards[index].remove();
      //numberOfOptions--;
    } else {
      showToast("You can't have less than 2 questions", "danger", 3000);
    }
  }
} //deleteInput

function addInput(move = true) {
  elements.optionsDiv.insertAdjacentHTML(
    "beforeend",
    `<div class="card option-card" data-option-id="${++numberOfOptions}">
      <div class="card-body">
        <div class="input-group">
          <input type="text" class="form-control questions" onkeydown="handleInput(event)" data-option-id="${numberOfOptions}" placeholder="Question" aria-label="Question" />
          <input type="password" class="form-control answers" onkeydown="handleInput(event)" data-option-id="${numberOfOptions}" placeholder="Answer" aria-label="Answer" />
          <span class="input-group-text poll-image" data-option-id="${numberOfOptions}" data-image-url="" style="display: none"> </span>
          <button type="button" class="remove-image btn btn-warning" onclick="deleteImage(event)" data-option-id="${numberOfOptions}" style="display: none">
            <i data-option-id="${numberOfOptions}" class="material-icons notranslate">hide_image</i>
          </button>
          <button type="button" class="remove-input btn btn-danger" onclick="deleteInput(event)" data-option-id="${numberOfOptions}">
            <i class="material-icons notranslate" data-option-id="${numberOfOptions}">delete_forever</i>
          </button>
        </div>
      </div>
    </div>`
  );
  if (move) {
    selectNextInput(numberOfOptions - 1);
  }
} //addInput

function selectNextInput(optionId) {
  let pollOptions = [...document.querySelectorAll(".questions")];
  let index = pollOptions.findIndex((element) => parseInt(element.dataset.optionId, 10) === optionId);
  if (index + 1 == pollOptions.length) {
    addInput();
  } else if (index != -1) {
    pollOptions[index + 1].focus();
    pollOptions[index + 1].select();
  }
} //selectNextInput

async function handleInput(event) {
  let optionId = parseInt(event.target.dataset.optionId, 10);
  if (event.key === "Tab") {
    event.preventDefault();
  }

  if (event.key === "ArrowUp" || (event.key === "Tab" && event.shiftKey)) {
    selectPreviousInput(optionId);
  } //up

  if (event.key === "Enter" || event.key === "ArrowDown" || (event.key === "Tab" && !event.shiftKey)) {
    selectNextInput(optionId);

    if (event.target.value.startsWith("http")) {
      let input = event.target.value;
      let requestOptions = {
        method: "GET",
        headers: {},
        redirect: "follow",
      };
      try {
        let response = await fetch(`https://helper.donk.workers.dev/cors/?${input.split(" ")[0]}`, requestOptions);
        if (response.headers.get("Content-Type").startsWith("image")) {
          let imageSpans = [...document.querySelectorAll(".poll-image")];
          let pollOptions = [...document.querySelectorAll(".questions")];
          let removeImageButtons = [...document.querySelectorAll(".remove-image")];
          let index = imageSpans.findIndex((element) => parseInt(element.dataset.optionId, 10) === optionId);
          if (index != -1) {
            imageSpans[index].innerHTML = `<div class="resizable"><img src="${input.split(" ")[0]}"></div>`;
            imageSpans[index].dataset.imageUrl = input.split(" ")[0];
            imageSpans[index].style.display = "block";
            removeImageButtons[index].style.display = "block";
            pollOptions[index].value = input.split(" ").slice(1).join("");
          }
        }
      } catch (error) {
        console.log(error);
      }
    } //image check
  } //down

  let pollOptions = [...document.querySelectorAll(".questions")];
  if (event.target.dataset.optionId == pollOptions[pollOptions.length - 1].dataset.optionId && event.target.value) {
    addInput(false);
  }
} //handleInput

function selectPreviousInput(optionId) {
  let pollOptions = [...document.querySelectorAll(".questions")];
  let index = pollOptions.findIndex((element) => parseInt(element.dataset.optionId, 10) === optionId);
  if (index != -1 && index != 0) {
    pollOptions[index - 1].focus();
    pollOptions[index - 1].select();
  }
} //selectPreviousInput

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
} //shuffle

function connect() {
  elements.twitchStatus.innerHTML = `
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
  loadBadges(USER.channel);
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
    if (!started) {
      return;
    }
    if (answered.includes(context.username)) {
      return;
    }
    if (points < 1) {
      return;
    }

    if (elements.multipleChoice.checked) {
      if (msg.trim().toLowerCase() !== correctChoice) {
        return;
      }
    } else {
      if (!answer.includes(msg.trim().toLowerCase())) {
        return;
      }
    }

    let pos = users.findIndex((element) => element.username === context.username);
    if (pos != -1) {
      users[pos].points += points;
      points--;
      answered.push(context.username);
      updateList();
    } else {
      let user = {
        points: points,
        id: context["user-id"],
        username: context.username,
        displayname: context["display-name"],
        color: context.color,
        firstmsg: context["first-msg"],
        badges: context.badges,
      };
      points--;
      addUser(user);
      answered.push(context.username);
    }

    if (elements.firstOnly.checked) {
      points = 0;
    }
  }); //message

  client.on("connected", (address, port) => {
    console.log(`Connected to ${address}:${port}`);
    elements.twitchStatus.innerHTML = `<h4><span class="badge bg-success">Connected :)</span></h4>`;
    sendUsername(`chat.vote/trivia`, USER.channel, "twitch");
    loadPFP();
  }); //connected

  client.on("disconnected", (reason) => {
    elements.twitchStatus.innerHTML = `<h4><span class="badge bg-danger">Disconnected: ${reason}</span></h4>`;
  }); //disconnected

  client.on("notice", (channel, msgid, message) => {
    elements.twitchStatus.innerHTML = `<h4><span class="badge bg-danger">Disconnected: ${message}</span></h4>`;
  }); //notice

  client.connect().catch(console.error);
} //connect

function addUser(user) {
  user.badgeshtml = addBadges(user.badges, user.id, user.firstmsg);
  user.name = user.username == user.displayname.toLowerCase() ? `${user.displayname}` : `${user.displayname} (${user.username})`;
  user.color = !user.color ? "#FFFFFF" : user.color;
  users.push(user);
  updateList();
} //addUser

function updateList() {
  users.sort(function (a, b) {
    return a.points > b.points ? -1 : a.points == b.points ? 0 : 1;
  });
  elements.users.innerHTML = "";
  let html = "";
  for (let index = 0, j = users.length; index < j; index++) {
    html += `
    <li class="list-group-item">
    ${users[index].badgeshtml}<span style="color:${users[index].color};">${users[index].name}:</span>
    ${users[index].points} ${users[index].points == 1 ? "point" : "points"}
    </li>`;
  }
  elements.users.innerHTML = html;
} //updateList

async function loadPFP() {
  if (!USER.channel) {
    elements.topRight.innerHTML = `
      <div class="btn-group" role="group" aria-label="log in button group">
      <a role="button" id="loginButton" onclick="login()" class="btn btn-twitch" tabindex="0" data-bs-container="body" data-bs-custom-class="custom-popover" data-bs-trigger="manual" data-bs-placement="bottom" data-bs-toggle="popover" data-bs-title="Not signed in" data-bs-content="You need sign in first before adding options or enabling voting/suggestions/raffle"><span class="twitch-icon"></span>Sign in with Twitch</a>
      <div class="btn-group" role="group">
      <button id="btnGroupDropLogin" type="button" class="btn btn-twitch dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"></button>
      <ul class="dropdown-menu dropdown-menu-lg-end" aria-labelledby="btnGroupDropLogin">
      <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modal1" href="#">Connect manually</a></li>
      </ul>
      </div>
      </div>`;
    return;
  }
  let profilepicurl = await get7TVPFP(USER.userID);
  if (profilepicurl == "/pics/donk.png" && USER.access_token) {
    profilepicurl = await getTwitchPFP(USER.channel, USER.access_token);
  }
  elements.topRight.innerHTML = `
    <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
    <button type="button" class="btn btn-dark"><img src="${profilepicurl}" alt="profile pic" style="height:2em;"></button>
    <div class="btn-group" role="group">
    <button id="btnGroupDrop1" type="button" class="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
    ${USER.channel}
    </button>
    <ul class="dropdown-menu dropdown-menu-lg-end" aria-labelledby="btnGroupDrop1">
    <li><a class="dropdown-item" onclick="logout()" href="#"><i class="material-icons notranslate">logout</i>Log out</a></li>
    </ul>
    </div>
    </div>`;
} //loadPFP

function hideAnswers() {
  let inputs = document.querySelectorAll(".answers");
  for (let index = 0; index < inputs.length; index++) {
    if (inputs[index].type == "text") {
      inputs[index].type = "password";
    } else {
      inputs[index].type = "text";
    }
  }
} //hideAnswers

window.onload = function () {
  loginExpiredModal = new bootstrap.Modal(elements.loginExpiredModal);
  loadAndConnect();
  if (!USER.channel) {
    loginExpiredModal.show();
  }

  enableTooltips();
  enablePopovers();
}; //onload
