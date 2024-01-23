let elements = {
  blacklistModal: document.getElementById("blacklistModal"),
  reason: document.getElementById("reason"),
  optionsModal: document.getElementById("optionsModal"),
  optionsModalBody: document.getElementById("optionsModalBody"),

  toastContainer: document.getElementById("toastContainer"),
  main: document.getElementById("main"),
  list: document.getElementById("list"),
  blacklisted: document.getElementById("blacklisted"),
};

let blacklistModal, optionsModal;

let blacklistID = "";
function blacklist(id) {
  blacklistID = id;
  blacklistModal.show();
} //blacklist

function showOptions(id) {
  const i = brackets.findIndex((e) => e.id === id);
  if (i > -1) {
    let html = `<ul class="list-group" style="max-height: 600px; overflow: auto">`;
    for (let index = 0; index < brackets[i].bracket.options.length; index++) {
      let option = brackets[i].bracket.options[index];
      html += `
      <li class="list-group-item">
      ${validator.escape(option.name) || `<span class="text-body-secondary">no name</span>`} - 
      ${validator.escape(option.value) || `<span class="text-body-secondary">no value</span>`} - 
      ${validator.escape(option.type) || `<span class="text-body-secondary">no type</span>`} - 
      ${validator.escape(option.thumbnail) || `<span class="text-body-secondary">no thumbnail</span>`}
      </li>`;
    }
    html += `</ul>`;
    elements.optionsModalBody.innerHTML = html;
    optionsModal.show();
  } else {
    showToast("bracket not found", "danger", 3000);
  }
} //showOptions

async function blacklistSubmit() {
  let body = JSON.stringify({
    id: blacklistID,
    reason: elements.reason.value,
  });
  let requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body,
    redirect: "follow",
  };
  try {
    let response = await fetch(`https://brackets.donk.workers.dev/blacklist`, requestOptions);
    let result = await response.json();
    showToast(result.message, "info", 3000);
    blacklistModal.hide();
    loadList();
  } catch (error) {
    showToast("Could not blacklist bracket", "danger", 3000);
    console.log("blacklistSubmit error", error);
  }
} //blacklistSubmit

async function unblacklist(id) {
  let body = JSON.stringify({
    id: id,
  });
  let requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body,
    redirect: "follow",
  };
  try {
    let response = await fetch(`https://brackets.donk.workers.dev/unblacklist`, requestOptions);
    let result = await response.json();
    showToast(result.message, "info", 3000);
    loadList();
  } catch (error) {
    showToast("Could not unblacklist bracket", "danger", 3000);
    console.log("unblacklist error", error);
  }
} //unblacklist

let brackets;
async function loadList() {
  elements.list.innerHTML = spinner;
  elements.blacklisted.innerHTML = spinner;

  let requestOptions = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    redirect: "follow",
  };
  try {
    let response = await fetch(`https://brackets.donk.workers.dev/list`, requestOptions);
    let result = await response.json();
    for (let index = 0; index < result.length; index++) {
      result[index] = JSON.parse(result[index]);
    }
    console.log(result);
    brackets = result;
    let list = `
    <div class="card">
    <div class="card-body">
    <ul class="list-group" style="max-height: 500px; overflow: auto">`;
    for (let index = 0; index < result.length; index++) {
      let bracket = result[index];
      if (!bracket.id || bracket.blacklisted) {
        continue;
      }
      list += `
      <li class="list-group-item">
      ${bracket.id} - ${validator.escape(bracket.username)} - 
      ${validator.escape(bracket.bracket.title)} - ${validator.escape(bracket.bracket.description)} - ${bracket.bracket.options.length} options 
      <br><button type="button" class="btn btn-danger float-end me-2" onclick="blacklist('${bracket.id}')">Blacklist</button>
      <button type="button" class="btn btn-info float-end me-2" onclick="showOptions('${bracket.id}')">Options</button>
      </li>`;
    }
    list += `
    </ul>
    </div>
    </div>`;

    let blacklisted = `
    <div class="card">
    <div class="card-body">
    <ul class="list-group" style="max-height: 500px; overflow: auto">`;
    for (let index = 0; index < result.length; index++) {
      let bracket = result[index];
      if (!bracket.blacklisted) {
        continue;
      }
      blacklisted += `
    <li class="list-group-item">
    ${bracket.reason || "no reason"} - ${bracket.id} - ${validator.escape(bracket.username)} - 
    ${validator.escape(bracket.bracket.title)} - ${validator.escape(bracket.bracket.description)} - ${bracket.bracket.options.length} options 
    <br><button type="button" class="btn btn-danger float-end me-2" onclick="unblacklist('${bracket.id}')">Unblacklist</button>
    <button type="button" class="btn btn-info float-end me-2" onclick="showOptions('${bracket.id}')">Options</button>
    </li>`;
    }
    blacklisted += `
    </ul>
    </div>
    </div>`;

    elements.list.innerHTML = list;
    elements.blacklisted.innerHTML = blacklisted;
  } catch (error) {
    showToast("Could not load list", "danger", 3000);
    console.log(error);
  }
} //loadList

window.onload = async function () {
  let requestOptions = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    redirect: "follow",
  };
  try {
    let response = await fetch(`https://brackets.donk.workers.dev/check`, requestOptions);
    let result = await response.json();
    if (response.status !== 200 || result.message !== "OK") {
      elements.main.innerHTML = "You don't have permission to view this page";
      return;
    }
  } catch (error) {
    elements.main.innerHTML = "You don't have permission to view this page";
    return;
  }

  loadList();
  blacklistModal = new bootstrap.Modal(elements.blacklistModal);
  optionsModal = new bootstrap.Modal(elements.optionsModal);
}; //onload
