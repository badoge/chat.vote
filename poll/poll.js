/*jshint esversion: 11 */

let modal1, modal2, modal3, modal4, modal5;
let mode = 0;
let level = 1;
let multipleAnswersAllowed;
let donkdonk;
let ignored = false;
let token;
let copyTooltip;
let numberOfOptions = 2;

let elements = {
  //modals
  modal1: document.getElementById("modal1"),
  modal2: document.getElementById("modal2"),
  modal3: document.getElementById("modal3"),
  modal4: document.getElementById("modal4"),
  modal5: document.getElementById("modal5"),

  //modal2
  errorDiv: document.getElementById("errorDiv"),
  pollLinkDiv: document.getElementById("pollLinkDiv"),
  pollTitleDiv: document.getElementById("pollTitleDiv"),
  pollOptionsDiv: document.getElementById("pollOptionsDiv"),
  pollSettingsDiv: document.getElementById("pollSettingsDiv"),

  //main
  pollTitle: document.getElementById("pollTitle"),
  optionsDiv: document.getElementById("optionsDiv"),
  toastContainer: document.getElementById("toastContainer"),

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

let POLL = {
  multipleAnswersAllowed: false,
  pollTimerValue: 0,
  pollTimerUnit: "m",
  mode: 0,
  level: 1,
};

const ckey = "6LdzxrwdAAAAADyHX2t8ZS4U5QxTNLVWNrGOeNp0";
const donk = import("/js/donk.min.js").then((donk) => donk.load());

donk.then((fp) => fp.get()).then((result) => (donkdonk = result.visitorId));

function checkdonk() {
  if (!donkdonk && mode == 3) {
    if (!ignored) {
      modal3.show();
      return false;
    }
    return true;
  } else {
    return true;
  }
} //checkdonk

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
    switch (parseInt(POLL.mode, 10)) {
      case 0:
        elements.results_anyone.checked = true;
        mode = 0;
        break;
      case 1:
        elements.results_voters.checked = true;
        mode = 1;
        break;
      case 2:
        elements.results_timer.checked = true;
        mode = 2;
        break;
      case 3:
        elements.results_creator.checked = true;
        mode = 3;
        break;
      default:
        elements.results_anyone.checked = true;
        mode = 0;
        break;
    }
    switch (parseInt(POLL.level, 10)) {
      case 0:
        elements.detect_low.checked = true;
        level = 0;
        break;
      case 1:
        elements.detect_high.checked = true;
        level = 1;
        break;
      default:
        elements.detect_high.checked = true;
        level = 1;
        break;
    }
  }
} //load_localStorage

function refreshData() {
  POLL.multipleAnswersAllowed = elements.multipleAnswersAllowed.checked;
  POLL.pollTimerValue = parseFloat(elements.pollTimerValue.value);
  POLL.pollTimerUnit = elements.pollTimerUnit.value;
  POLL.mode = parseInt(document.querySelector('input[name="resultsVisibility"]:checked').value, 10);
  POLL.level = parseInt(document.querySelector('input[name="duplicateDetectionLevel"]:checked').value, 10);
} //refreshData

function saveSettings() {
  refreshData();
  localStorage.setItem("POLL", JSON.stringify(POLL));
} //saveSettings

function ignoreModal() {
  ignored = true;
} //ignoreModal

function showModal1() {
  modal1.show();
} //showModal1

function reset() {
  numberOfOptions = 2;
  resetModal2();
  elements.optionsDiv.innerHTML = `
  <div class="card bg-dark-subtle border-dark-subtle option-card" data-option-id="1">
  <div class="card-body">
    <div class="input-group">
      <input type="text" class="form-control poll-option" onkeydown="handleInput(event)" data-option-id="1" placeholder="Enter poll option" aria-label="Poll option" />
      <span class="input-group-text poll-image" data-option-id="1" data-image-url="" style="display: none"> </span>
      <button type="button" class="remove-image btn btn-warning" onclick="deleteImage(event)" data-option-id="1" style="display: none">
        <i data-option-id="1" class="material-icons notranslate">hide_image</i>
      </button>
      <button type="button" class="remove-input btn btn-danger" onclick="deleteInput(event)" data-option-id="1">
        <i class="material-icons notranslate" data-option-id="1">delete_forever</i>
      </button>
    </div>
  </div>
</div>
<div class="card bg-dark-subtle border-dark-subtle option-card" data-option-id="2">
  <div class="card-body">
    <div class="input-group">
      <input type="text" class="form-control poll-option" onkeydown="handleInput(event)" data-option-id="2" placeholder="Enter poll option" aria-label="Poll option" />
      <span class="input-group-text poll-image" data-option-id="2" data-image-url="" style="display: none"> </span>
      <button type="button" class="remove-image btn btn-warning" onclick="deleteImage(event)" data-option-id="2" style="display: none">
        <i data-option-id="2" class="material-icons notranslate">hide_image</i>
      </button>
      <button type="button" class="remove-input btn btn-danger" onclick="deleteInput(event)" data-option-id="2">
        <i class="material-icons notranslate" data-option-id="2">delete_forever</i>
      </button>
    </div>
  </div>
</div>`;
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

function removeDuplicates() {
  let pollOptions = [...document.querySelectorAll(".poll-option")];
  let buttons = [...document.querySelectorAll(".remove-input")];
  let options = [];
  for (let index = 0; index < pollOptions.length; index++) {
    if (options.includes(pollOptions[index].value)) {
      buttons[index].click();
    } else {
      options.push(pollOptions[index].value);
    }
  }
  createPoll();
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
  copyTooltip.show();
  setTimeout(() => {
    copyTooltip.hide();
  }, 1000);
} //copyLink

async function addOptionBulk() {
  resetModal2();
  if (!checkEmpty()) {
    showToast("Poll already has some options, remove them before adding in bulk", "warning", 3000);
    return;
  }
  let og = elements.bulkOptions.value.split(/\r?\n/);
  elements.bulkOptions.value = "";
  let options = og.filter(Boolean);
  for (let i = 0, j = options.length - 2; i < j; i++) {
    addInput();
  }

  let imageSpans = [...document.querySelectorAll(".poll-image")];
  let pollOptions = [...document.querySelectorAll(".poll-option")];
  let removeImageButtons = [...document.querySelectorAll(".remove-image")];

  for (let i = 0, j = pollOptions.length; i < j; i++) {
    let text = options[i];
    if (!text) {
      continue;
    }
    pollOptions[i].value = text;
    if (text.startsWith("http")) {
      let requestOptions = {
        method: "GET",
        headers: {},
        redirect: "follow",
      };
      try {
        let response = await fetch(`https://helper.pepega.workers.dev/cors/?${text.split(" ")[0]}`, requestOptions);
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
} //addOptionBulk

function resetModal2() {
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
} //resetModal2

function checkSize() {
  let title = !elements.pollTitle.value ? "Untitled poll" : elements.pollTitle.value;
  let imageSpans = [...document.querySelectorAll(".poll-image")];
  let pollOptions = [...document.querySelectorAll(".poll-option")];
  let pollOptionsArray = [];
  let imagesArray = [];
  let scores = [];
  let colors = [];
  for (let index = 0, j = pollOptions.length; index < j; index++) {
    if (!pollOptions[index].value && !imageSpans[index].dataset.imageUrl) {
      continue;
    }
    if (!pollOptions[index].value && imageSpans[index].dataset.imageUrl) {
      pollOptionsArray.push(`Option #${index + 1} with image`);
    } else {
      pollOptionsArray.push(pollOptions[index].value);
    }
    imagesArray.push(imageSpans[index].dataset.imageUrl);
    scores[index] = 1000000000;
    colors[index] = [255, 255, 255];
  }
  let poll = {
    title: title,
    options: pollOptions,
    images: imagesArray,
    scores: scores,
    votes: 1000000000,
    colors: colors,
    mode: 1,
    endtime: 1678513462683,
    multianswer: false,
    creatorid: "352ed00d4cdc0c3b39b791ecee4efe56",
    creatorip: "123.456.789.123",
  };
  const size = new TextEncoder().encode(JSON.stringify(poll)).length;
  const kiloBytes = size / 1024;
  return kiloBytes > 100;
} //checkSize

async function createPoll() {
  if (!checkdonk()) {
    return;
  }

  if (checkEmpty()) {
    showToast("No poll options added", "warning", 3000);
    return;
  }

  if (!noDuplicates()) {
    modal5.show();
    return;
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

  let pollOptionsArray = [];
  let imagesArray = [];
  for (let index = 0, j = pollOptions.length; index < j; index++) {
    if (!pollOptions[index].value && !imageSpans[index].dataset.imageUrl) {
      continue;
    }

    if (!pollOptions[index].value && imageSpans[index].dataset.imageUrl) {
      pollOptionsArray.push(`Option #${index + 1} with image`);
    } else {
      pollOptionsArray.push(pollOptions[index].value);
    }
    imagesArray.push(imageSpans[index].dataset.imageUrl);
  }
  if (pollOptionsArray.length < 2) {
    showToast("You can't create a poll with less than 2 options", "warning", 3000);
    return;
  }

  resetModal2();
  modal2.show();

  try {
    token = await grecaptcha.execute(ckey, { action: "submit" });
    if (!token) {
      modal4.show();
      return;
    }
    let requestOptions = {
      method: "POST",
      headers: {},
      redirect: "follow",
      "Content-Type": "application/json",
      body: JSON.stringify({
        captchatoken: token,
        userid: donkdonk,
        title: title,
        options: pollOptionsArray,
        images: imagesArray,
        mode: mode,
        level: level,
        endtime: polltimer,
        multianswer: multianswer,
      }),
    };
    let response = await fetch(`https://polls.pepega.workers.dev/createpoll`, requestOptions);
    //let response = await fetch(`http://127.0.0.1:8787/createpoll`, requestOptions);

    let result = await response.json();
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
        data-bs-toggle="tooltip"
        data-bs-delay="200"
        data-bs-trigger="manual"
        data-bs-placement="bottom"
        data-bs-title="Link copied :)"
        onclick="copyLink('https://poll.chat.vote/${result.data.id}')">
        <i class="material-icons notranslate">content_copy</i>
      </button>
    </div>
    `;
    copyTooltip = new bootstrap.Tooltip(document.getElementById("copyLinkButton"));

    //load title
    elements.pollTitleDiv.innerHTML = `
    <ul class="list-unstyled">
      <li>
      <ul>
        <li>${result.data.title}</li>
      </ul>
      </li>
    </ul>`;

    //load options
    let options = `
            <ul class="list-unstyled">
            <li>
            <ul>`;
    for (let index = 0, j = result.data.options.length; index < j; index++) {
      options += `<li>${result.data.options[index]}</li>`;
    }
    options += `
            </ul>
            </li>
            </ul>`;
    elements.pollOptionsDiv.innerHTML = options;

    //load settings
    let pollmode = "";
    switch (result.data.mode) {
      case 0:
        pollmode = "Results visible to anyone";
        break;
      case 1:
        pollmode = "Results visible voters only";
        break;
      case 2:
        pollmode = `Results will be revealed in ${Math.ceil((parseInt(result.data.endtime, 10) - Date.now() / 1000) / 60)} minutes`;
        break;
      case 3:
        pollmode = "Results visible to you only";
        break;
    }
    let polllevel = "";
    switch (result.data.level) {
      case 0:
        polllevel = "Duplicate detection level: low";
        break;
      case 1:
        polllevel = "Duplicate detection level: high";
        break;
    }
    let endtime = "No time limit";
    if (result.data.endtime) {
      endtime = `Poll will close in ${Math.ceil((parseInt(result.data.endtime, 10) - Date.now() / 1000) / 60)} minutes`;
    }
    elements.pollSettingsDiv.innerHTML = `
      <ul class="list-unstyled">
        <li>
        <ul>
          <li>${pollmode}</li>
          <li>${result.data.multianswer ? "Multiple answers allowed" : "Multiple answers not allowed"}</li>
          <li>${endtime}</li>
          <li>${polllevel}</li>
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
        let response = await fetch(`https://helper.pepega.workers.dev/cors/?${input.split(" ")[0]}`, requestOptions);
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
    `<div class="card bg-dark-subtle border-dark-subtle option-card" data-option-id="${++numberOfOptions}">
    <div class="card-body">
      <div class="input-group">
        <input type="text" class="form-control poll-option" onkeydown="handleInput(event)" data-option-id="${numberOfOptions}" placeholder="Enter poll option" aria-label="Poll option" />
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

window.onload = function () {
  //redirect old poll links to new site
  let url = new URL(window.location.href);
  let pollID = url.searchParams.get("p");
  if (pollID) {
    window.location.href = `https://poll.chat.vote/${pollID}`;
    return;
  }

  load_localStorage();
  refreshData();

  modal1 = new bootstrap.Modal(elements.modal1);
  modal2 = new bootstrap.Modal(elements.modal2);
  modal3 = new bootstrap.Modal(elements.modal3);
  modal4 = new bootstrap.Modal(elements.modal4);
  modal5 = new bootstrap.Modal(elements.modal5);

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

  elements.results_anyone.onchange = function () {
    if (this.checked) {
      mode = 0;
    }
    saveSettings();
  };
  elements.results_voters.onchange = function () {
    if (this.checked) {
      mode = 1;
    }
    saveSettings();
  };
  elements.results_timer.onchange = function () {
    if (this.checked) {
      mode = 2;
    }
    saveSettings();
  };
  elements.results_creator.onchange = function () {
    if (this.checked) {
      mode = 3;
    }
    saveSettings();
  };
  elements.pollTimerValue.onchange = function () {
    updateTimer(this);
    saveSettings();
  };
  elements.pollTimerUnit.onchange = function () {
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
      level = 0;
    }
    saveSettings();
  };
  elements.detect_high.onchange = function () {
    if (this.checked) {
      level = 1;
    }
    saveSettings();
  };

  elements.pollTitle.focus();
  elements.pollTitle.select();
}; //onload
