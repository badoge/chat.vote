let pollModal, captchaModal;
let resultsVisibility = "everyone";
let security = "high";
let multipleAnswersAllowed;
let token;
let copyPopover;
let numberOfOptions = 0;
let startingHue = Math.random() * 360;

let elements = {
  //modals
  pollModal: document.getElementById("pollModal"),
  captchaModal: document.getElementById("captchaModal"),

  //pollModal
  errorDiv: document.getElementById("errorDiv"),
  pollLinkDiv: document.getElementById("pollLinkDiv"),
  pollTitleDiv: document.getElementById("pollTitleDiv"),
  pollOptionsDiv: document.getElementById("pollOptionsDiv"),
  pollSettingsDiv: document.getElementById("pollSettingsDiv"),

  //main
  pollTitle: document.getElementById("pollTitle"),
  optionsDiv: document.getElementById("optionsDiv"),
  toastContainer: document.getElementById("toastContainer"),
  darkTheme: document.getElementById("darkTheme"),

  //settings
  multipleAnswersAllowed: document.getElementById("multipleAnswersAllowed"),
  pollTimerValue: document.getElementById("pollTimerValue"),
  pollTimerUnit: document.getElementById("pollTimerUnit"),
  results_anyone: document.getElementById("results_anyone"),
  results_voters: document.getElementById("results_voters"),
  results_timer: document.getElementById("results_timer"),
  results_creator: document.getElementById("results_creator"),
  detect_low: document.getElementById("detect_low"),
  detect_high: document.getElementById("detect_high"),
  bulkOptions: document.getElementById("bulkOptions"),
};

let darkTheme = true;

let POLL = {
  multipleAnswersAllowed: false,
  pollTimerValue: 0,
  pollTimerUnit: "m",
  resultsVisibility: "everyone",
  security: "high",
};

const ckey = "6LdzxrwdAAAAADyHX2t8ZS4U5QxTNLVWNrGOeNp0";

function load_localStorage() {
  if (!localStorage.getItem("POLL")) {
    console.log("poll localStorage settings not found");
  } else {
    POLL = JSON.parse(localStorage.getItem("POLL"));
    elements.multipleAnswersAllowed.checked = POLL.multipleAnswersAllowed ?? false;
    elements.pollTimerValue.value = parseFloat(POLL.pollTimerValue) ?? 0;
    if (parseFloat(POLL.pollTimerValue) > 0) {
      elements.results_timer.disabled = false;
    }
    elements.pollTimerUnit.value = POLL.pollTimerUnit || "m";
    switch (POLL.resultsVisibility) {
      case "everyone":
        elements.results_anyone.checked = true;
        resultsVisibility = "everyone";
        break;
      case "voters":
        elements.results_voters.checked = true;
        resultsVisibility = "voters";
        break;
      case "timer":
        elements.results_timer.checked = true;
        resultsVisibility = "timer";
        break;
      case "creator":
        elements.results_creator.checked = true;
        resultsVisibility = "creator";
        break;
      default:
        elements.results_anyone.checked = true;
        resultsVisibility = "everyone";
        break;
    }
    switch (POLL.security) {
      case "low":
        elements.detect_low.checked = true;
        security = "low";
        break;
      case "high":
        elements.detect_high.checked = true;
        security = "high";
        break;
      default:
        elements.detect_high.checked = true;
        security = "high";
        break;
    }
  }
} //load_localStorage

function refreshData() {
  darkTheme = elements.darkTheme.checked ?? true;

  POLL.multipleAnswersAllowed = elements.multipleAnswersAllowed.checked;
  POLL.pollTimerValue = parseFloat(elements.pollTimerValue.value);
  POLL.pollTimerUnit = elements.pollTimerUnit.value;
  POLL.resultsVisibility = document.querySelector('input[name="resultsVisibility"]:checked').value;
  POLL.security = document.querySelector('input[name="duplicateDetectionLevel"]:checked').value;
} //refreshData

function saveSettings() {
  refreshData();
  localStorage.setItem("POLL", JSON.stringify(POLL));
  localStorage.setItem("darkTheme", darkTheme);
} //saveSettings

function reset() {
  numberOfOptions = 0;
  startingHue = Math.random() * 360;
  resetPollModal();
  elements.optionsDiv.innerHTML = "";
  addInput();
  addInput();
  changeSiteLinkTarget("_self");
} //reset

function noDuplicates() {
  let pollOptions = [...document.querySelectorAll(".poll-option")].map((x) => x.value);
  return pollOptions.length === new Set(pollOptions).size;
} //noDuplicates

function checkEmpty() {
  let pollOptions = [...document.querySelectorAll(".poll-option")].map((x) => x.value);
  let array = [...new Set(pollOptions)];
  if (!array[0] && array.length == 1) {
    return true;
  } else {
    return false;
  }
} //checkEmpty

function removeDuplicates(removeEmpty = false) {
  let pollOptions = [...document.querySelectorAll(".poll-option")];
  let buttons = [...document.querySelectorAll(".remove-input")];
  let options = [];
  for (let index = 0; index < pollOptions.length; index++) {
    if (options.includes(pollOptions[index].value) || (removeEmpty && !pollOptions[index].value.replace(/\s+/g, ""))) {
      buttons[index].click();
    } else {
      options.push(pollOptions[index].value);
    }
  }
} //removeDuplicates

function updateTimer(element) {
  if (element.value > 0) {
    elements.results_timer.disabled = false;
  } else {
    if (elements.results_timer.checked) {
      elements.results_anyone.checked = true;
    }
    elements.results_timer.disabled = true;
  }
} //updateTimer

function copyLink(link) {
  navigator.clipboard.writeText(link);
  copyPopover.show();
  setTimeout(() => {
    copyPopover.hide();
  }, 1000);
} //copyLink

async function addOptionBulk() {
  resetPollModal();
  let og = elements.bulkOptions.value.split(/\r?\n/);
  let options = [];
  for (let index = 0; index < og.length; index++) {
    if (!options.includes(og[index]) && og[index].replace(/\s+/g, "")) {
      options.push(og[index].trim());
    }
  }
  elements.bulkOptions.value = "";
  for (let i = 0, j = options.length; i < j; i++) {
    addInput();
  }

  let imageSpans = [...document.querySelectorAll(".poll-image")];
  let pollOptions = [...document.querySelectorAll(".poll-option")];
  let removeImageButtons = [...document.querySelectorAll(".remove-image")];

  for (let i = 0, j = pollOptions.length; i < j; i++) {
    let text = options[0];
    if (!text || pollOptions[i].value) {
      continue;
    }
    options.shift();
    pollOptions[i].value = text;
    if (text.startsWith("http")) {
      let requestOptions = {
        method: "GET",
        headers: {},
        redirect: "follow",
      };
      try {
        let response = await fetch(`https://helper.donk.workers.dev/cors/?${text.split(" ")[0]}`, requestOptions);
        if (response.headers.get("Content-Type").startsWith("image")) {
          imageSpans[i].innerHTML = `<div class="resizable"><img src="${text.split(" ")[0]}"></div>`;
          imageSpans[i].dataset.imageUrl = text.split(" ")[0];
          imageSpans[i].style.display = "block";
          removeImageButtons[i].style.display = "block";
          pollOptions[i].value = text.split(" ").slice(1).join("");
        }
      } catch (error) {
        console.log(error);
      }
    }
  } //for
  removeDuplicates(true);
} //addOptionBulk

function resetPollModal() {
  elements.errorDiv.innerHTML = "";
  elements.pollLinkDiv.innerHTML = `<p class="placeholder-glow">
  <span class="placeholder placeholder-lg col-12 bg-warning"></span>
  </p>`;
  elements.pollTitleDiv.innerHTML = `<p class="placeholder-glow">
  <span class="placeholder col-12"></span>
  </p>`;
  elements.pollOptionsDiv.innerHTML = `<p class="placeholder-glow">
  <span class="placeholder col-12"></span>
  </p>`;
  elements.pollSettingsDiv.innerHTML = `<p class="placeholder-glow">
  <span class="placeholder col-12"></span>
  </p>`;
} //resetPollModal

function checkSize() {
  let title = !elements.pollTitle.value ? "Untitled poll" : elements.pollTitle.value;
  let imageSpans = [...document.querySelectorAll(".poll-image")];
  let pollOptions = [...document.querySelectorAll(".poll-option")];
  let optionsColors = [...document.querySelectorAll(".option-color")];
  let pollOptionsArray = [];
  let scores = [];
  for (let index = 0, j = pollOptions.length; index < j; index++) {
    if (!pollOptions[index].value && !imageSpans[index].dataset.imageUrl) {
      continue;
    }
    if (!pollOptions[index].value && imageSpans[index].dataset.imageUrl) {
      pollOptionsArray.push({
        name: `Option #${index + 1} with image`,
        type: "image",
        image: imageSpans[index].dataset.imageUrl,
        color: optionsColors[index].style.backgroundColor,
      });
    } else {
      pollOptionsArray.push({
        name: pollOptions[index].value,
        type: "text",
        image: imageSpans[index].dataset.imageUrl,
        color: optionsColors[index].style.backgroundColor,
      });
    }
    scores[index] = 1000000000;
  }

  let poll = {
    id: "XXXXXXXX",
    title: "",
    description: "",
    questions: [
      {
        title: title,
        description: "",
        multipleChoice: multianswer,
        type: "poll",
        options: pollOptionsArray,
      },
    ],
    scores: [scores],
    votes: [[999999999999999]],
    resultsVisibility: "everyone",
    security: "high",
    endTime: 999999999999999,
    createdAt: 999999999999999,
    createdUsing: "chat.vote/poll",
    creatorip: "XXXX:XXXX:XXXX:XXXX:XXXX:XXXX:XXXX:XXXX",
    pollVersion: 999999999999999,
  };
  const size = new TextEncoder().encode(JSON.stringify(poll)).length;
  const kiloBytes = size / 1024;
  return kiloBytes > 100;
} //checkSize

async function createPoll() {
  if (checkEmpty()) {
    showToast("No poll options added", "warning", 3000);
    return;
  }

  if (!noDuplicates()) {
    removeDuplicates();
  }

  if (checkSize()) {
    showToast("Too many poll options", "danger", 3000);
    return;
  }

  let multianswer = elements.multipleAnswersAllowed.checked;
  let polltimer;
  switch (elements.pollTimerUnit.value) {
    case "m":
      polltimer = Math.ceil(parseFloat(elements.pollTimerValue.value) * 60) || 0;
      break;
    case "h":
      polltimer = Math.ceil(parseFloat(elements.pollTimerValue.value) * 3600) || 0;
      break;
    case "d":
      polltimer = Math.ceil(parseFloat(elements.pollTimerValue.value) * 86400) || 0;
      break;
    default:
      polltimer = 0;
  }
  let title = !elements.pollTitle.value ? "Untitled poll" : elements.pollTitle.value;
  let imageSpans = [...document.querySelectorAll(".poll-image")];
  let pollOptions = [...document.querySelectorAll(".poll-option")];
  let optionsColors = [...document.querySelectorAll(".option-color")];

  let pollOptionsArray = [];
  for (let index = 0, j = pollOptions.length; index < j; index++) {
    if (!pollOptions[index].value && !imageSpans[index].dataset.imageUrl) {
      continue;
    }

    if (!pollOptions[index].value && imageSpans[index].dataset.imageUrl) {
      pollOptionsArray.push({
        name: `Option #${index + 1} with image`,
        type: "image",
        image: imageSpans[index].dataset.imageUrl,
        color: optionsColors[index].style.backgroundColor,
      });
    }

    if (pollOptions[index].value && imageSpans[index].dataset.imageUrl) {
      pollOptionsArray.push({
        name: pollOptions[index].value,
        type: "image",
        image: imageSpans[index].dataset.imageUrl,
        color: optionsColors[index].style.backgroundColor,
      });
    }

    if (pollOptions[index].value && !imageSpans[index].dataset.imageUrl) {
      pollOptionsArray.push({
        name: pollOptions[index].value,
        type: "text",
        image: imageSpans[index].dataset.imageUrl,
        color: optionsColors[index].style.backgroundColor,
      });
    }
  }

  if (pollOptionsArray.length < 2) {
    showToast("You can't create a poll with less than 2 options", "warning", 3000);
    return;
  }

  resetPollModal();
  pollModal.show();

  try {
    token = await grecaptcha.execute(ckey, { action: "submit" });
    if (!token) {
      captchaModal.show();
      return;
    }
    let requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify({
        captchatoken: token,
        title: "",
        description: "",
        resultsVisibility: resultsVisibility,
        security: security,
        endAfter: polltimer,
        createdUsing: "chat..vote/poll",
        questions: [
          {
            title: title,
            description: "",
            multipleChoice: multianswer,
            type: "poll",
            options: pollOptionsArray,
          },
        ],
      }),
    };
    let response = await fetch(`https://poll.chat.vote/api/create2`, requestOptions);
    //let response = await fetch(`http://127.0.0.1:8787/api/create`, requestOptions);

    let result = await response.json();
    console.log(result);
    if (response.status != 200) {
      elements.errorDiv.innerHTML = `Failed to create poll.<br>Error: ${result.message}`;
      return;
    }
    //open poll link
    window.open(`https://poll.chat.vote/${result.data.id}`, "_blank").focus();

    //load link div
    elements.pollLinkDiv.innerHTML = `
    <div class="input-group mb-3">
      <input type="text" class="form-control" id="pollLink" onclick="copyLink('https://poll.chat.vote/${result.data.id}')" value="https://poll.chat.vote/${result.data.id}" />
      <button
        type="button"
        id="copyLinkButton"
        class="btn btn-outline-secondary"
        data-bs-toggle="popover"
        data-bs-trigger="manual"
        data-bs-placement="bottom"
        data-bs-content="Link copied :)"
        onclick="copyLink('https://poll.chat.vote/${result.data.id}')">
        <i class="material-icons notranslate">content_copy</i>
      </button>
    </div>`;

    copyPopover = new bootstrap.Popover(document.getElementById("copyLinkButton"));

    //load title
    elements.pollTitleDiv.innerHTML = `
    <ul class="list-unstyled">
      <li>
        <ul>
          <li>${validator.escape(result.data.questions[0].title)}</li>
        </ul>
      </li>
    </ul>`;

    //load options
    let options = `
    <ul class="list-unstyled">
      <li>
        <ul>`;
    for (let index = 0, j = result.data.questions[0].options.length; index < j; index++) {
      options += `
          <li>
            ${validator.escape(result.data.questions[0].options[index].name)}
          </li>`;
    }
    options += `
        </ul>
      </li>
    </ul>`;
    elements.pollOptionsDiv.innerHTML = options;

    //load settings
    let pollResultsVisibility = "";
    switch (result.data.resultsVisibility) {
      case "everyone":
        pollResultsVisibility = "Results visible to anyone";
        break;
      case "voters":
        pollResultsVisibility = "Results visible voters only";
        break;
      case "timer":
        pollResultsVisibility = `Results will be revealed in ${Math.ceil((parseInt(result.data.endTime, 10) - Date.now() / 1000) / 60)} minutes`;
        break;
      case "creator":
        pollResultsVisibility = "Results visible to you only";
        break;
    }

    let endTime = "No time limit";
    if (result.data.endTime) {
      endTime = `Poll will close in ${Math.ceil((parseInt(result.data.endTime, 10) - Date.now() / 1000) / 60)} minutes`;
    }
    elements.pollSettingsDiv.innerHTML = `
    <ul class="list-unstyled">
      <li>
        <ul>
          <li>${pollResultsVisibility}</li>
          <li>${result.data.questions[0].multipleChoice ? "Multiple answers allowed" : "Multiple answers not allowed"}</li>
          <li>${endTime}</li>
          <li>Duplicate detection level: ${result.data.security}</li>
        </ul>
      </li>
    </ul>`;
  } catch (error) {
    elements.errorDiv.innerHTML = `Failed to create poll.<br>Error: ${error}`;
  }
} //createPoll

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
          let pollOptions = [...document.querySelectorAll(".poll-option")];
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

  let pollOptions = [...document.querySelectorAll(".poll-option")];
  if (event.target.dataset.optionId == pollOptions[pollOptions.length - 1].dataset.optionId && event.target.value) {
    addInput(false);
  }
} //handleInput

function selectPreviousInput(optionId) {
  let pollOptions = [...document.querySelectorAll(".poll-option")];
  let index = pollOptions.findIndex((element) => parseInt(element.dataset.optionId, 10) === optionId);
  if (index == 0) {
    elements.pollTitle.focus();
    elements.pollTitle.select();
  } else if (index != -1) {
    pollOptions[index - 1].focus();
    pollOptions[index - 1].select();
  }
} //selectPreviousInput

function selectNextInput(optionId) {
  let pollOptions = [...document.querySelectorAll(".poll-option")];
  let index = pollOptions.findIndex((element) => parseInt(element.dataset.optionId, 10) === optionId);
  if (index + 1 == pollOptions.length) {
    addInput();
  } else if (index != -1) {
    pollOptions[index + 1].focus();
    pollOptions[index + 1].select();
  }
} //selectNextInput

function addInput(move = true) {
  elements.optionsDiv.insertAdjacentHTML(
    "beforeend",
    `
    <div class="card bg-body-tertiary option-card" data-option-id="${++numberOfOptions}">
      <div class="card-body option-card-body">
        <div class="option-color" data-option-id="${numberOfOptions}" style="background-color: hsla(${Math.round((startingHue += Math.random() * 60 + 40))}, 100%, 50%, 0.8)"></div>
        <div class="input-group">
          <input type="text" class="form-control poll-option" onkeydown="handleInput(event)" data-option-id="${numberOfOptions}" placeholder="Enter poll option" aria-label="Poll option" />
          <span class="input-group-text poll-image" data-option-id="${numberOfOptions}" data-image-url="" style="display: none"></span>
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
  changeSiteLinkTarget("_blank");
} //addInput

function deleteInput(event) {
  let optionCards = [...document.querySelectorAll(".option-card")];
  let index = optionCards.findIndex((element) => parseInt(element.dataset.optionId, 10) === parseInt(event.target.dataset.optionId, 10));
  if (index != -1) {
    if (optionCards.length > 2) {
      optionCards[index].remove();
    } else {
      showToast("You can't have less than 2 options", "danger", 3000);
    }
  }
} //deleteInput

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

function switchTheme(checkbox) {
  document.documentElement.setAttribute("data-bs-theme", checkbox ? "dark" : "light");
  document.getElementById("twitchLogo").style.filter = `invert(${checkbox ? 0.25 : 0.65})`;
} //switchTheme

window.onload = function () {
  //redirect old poll links to new site
  let url = new URL(window.location.href);
  let pollID = url.searchParams.get("p");
  if (pollID) {
    window.location.href = `https://poll.chat.vote/${pollID}`;
    return;
  }

  darkTheme = (localStorage.getItem("darkTheme") || "true") === "true";
  elements.darkTheme.checked = darkTheme ?? true;
  switchTheme(elements.darkTheme.checked);

  elements.optionsDiv.innerHTML = "";
  addInput();
  addInput();

  load_localStorage();
  refreshData();

  pollModal = new bootstrap.Modal(elements.pollModal);
  captchaModal = new bootstrap.Modal(elements.captchaModal);

  enableTooltips();
  enablePopovers();

  elements.pollTitle.addEventListener("keydown", function (event) {
    if (event.key === "Tab") {
      event.preventDefault();
    }
    if (event.key === "Enter" || event.key === "ArrowDown" || event.key === "Tab") {
      let pollOptions = [...document.querySelectorAll(".poll-option")];
      pollOptions[0].focus();
      pollOptions[0].select();
    }
  });

  elements.darkTheme.onchange = function () {
    switchTheme(this.checked);
    saveSettings();
  };

  elements.results_anyone.onchange = function () {
    if (this.checked) {
      resultsVisibility = "everyone";
    }
    saveSettings();
  };
  elements.results_voters.onchange = function () {
    if (this.checked) {
      resultsVisibility = "voters";
    }
    saveSettings();
  };
  elements.results_timer.onchange = function () {
    if (this.checked) {
      resultsVisibility = "timer";
    }
    saveSettings();
  };
  elements.results_creator.onchange = function () {
    if (this.checked) {
      resultsVisibility = "creator";
    }
    saveSettings();
  };
  elements.pollTimerValue.onchange = function () {
    updateTimer(this);
    saveSettings();
  };
  elements.multipleAnswersAllowed.onchange = function () {
    if (this.checked) {
      multipleAnswersAllowed = true;
    }
    saveSettings();
  };
  elements.detect_low.onchange = function () {
    if (this.checked) {
      security = "low";
    }
    saveSettings();
  };
  elements.detect_high.onchange = function () {
    if (this.checked) {
      security = "high";
    }
    saveSettings();
  };

  elements.pollTitle.focus();
  elements.pollTitle.select();
}; //onload
