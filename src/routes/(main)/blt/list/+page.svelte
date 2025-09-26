<script>
  import { onMount } from "svelte";
  let elements;
  let bootstrap;
  onMount(async () => {
    bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");
    elements = {
      blacklistModal: document.getElementById("blacklistModal"),
      reason: document.getElementById("reason"),
      optionsModal: document.getElementById("optionsModal"),
      optionsModalBody: document.getElementById("optionsModalBody"),

      main: document.getElementById("main"),
      list: document.getElementById("list"),
      blacklisted: document.getElementById("blacklisted"),
    };
    let requestOptions = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    try {
      let response = await fetch(`https://blt.donk.workers.dev/check`, requestOptions);
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
  });

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
      ${escapeString(option.name) || `<span class="text-body-secondary">no name</span>`} - 
      ${escapeString(option.value) || `<span class="text-body-secondary">no value</span>`} - 
      ${escapeString(option.type) || `<span class="text-body-secondary">no type</span>`} - 
      ${escapeString(option.thumbnail) || `<span class="text-body-secondary">no thumbnail</span>`}
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
    };
    try {
      let response = await fetch(`https://blt.donk.workers.dev/blacklist`, requestOptions);
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
    };
    try {
      let response = await fetch(`https://blt.donk.workers.dev/unblacklist`, requestOptions);
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
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    try {
      let response = await fetch(`https://blt.donk.workers.dev/list`, requestOptions);
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
      ${bracket.id} - ${escapeString(bracket.username)} - 
      ${escapeString(bracket.bracket.title)} - ${escapeString(bracket.bracket.description)} - ${bracket.bracket.options.length} options 
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
    ${bracket.reason || "no reason"} - ${bracket.id} - ${escapeString(bracket.username)} - 
    ${escapeString(bracket.bracket.title)} - ${escapeString(bracket.bracket.description)} - ${bracket.bracket.options.length} options 
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
</script>

<svelte:head>
  <title>chat.vote Brackets - Community brackets</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="chat.vote Brackets - Community brackets" />
  <meta name="keywords" content="chatvote, chat.vote" />
  <meta property="og:title" content="chat.vote Brackets - Community brackets" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chat.vote/blt/list" />
  <meta property="og:image" content="/pics/ogimage.png" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:description" content="chat.vote Brackets - Community brackets" /></svelte:head
>

<nav class="navbar navbar-expand-lg bg-body-tertiary mb-2">
  <div class="container-fluid">
    <a class="navbar-brand notranslate" href="/blt">
      <img src="/pics/donk.png" alt="donk" style="height: 24px; width: 24px" class="d-inline-block align-top" /> chat.vote Brackets - Community brackets
    </a>
  </div>
</nav>

<div class="modal fade" tabindex="-1" id="blacklistModal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Blacklist bracket</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="input-group">
          <span class="input-group-text">Reason</span>
          <input type="text" class="form-control" id="reason" aria-describedby="reject reason" />
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-danger" onclick={blacklistSubmit}>Blacklist</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" tabindex="-1" id="optionsModal">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Options</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="optionsModalBody"></div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<div class="container-fluid">
  <div class="row">
    <div class="col-xl-3"></div>
    <div class="col-xl-6" id="main">
      <h1 class="display-6">List:</h1>
      <div id="list">
        <div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>
      </div>
      <h1 class="display-6">Blacklisted:</h1>
      <div id="blacklisted">
        <div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>
      </div>
    </div>
    <div class="col-xl-3"></div>
  </div>
</div>
