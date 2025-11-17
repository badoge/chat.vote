<script>
  import { onMount } from "svelte";
  import { showToast } from "../../+layout.svelte";
  import IcBaselineClose from "~icons/ic/baseline-close";
  import pkg from "validator";
  const { escape } = pkg;
  let elements;
  onMount(async () => {
    elements = {
      reason: document.getElementById("reason"),
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
  });

  let blacklistID = "";
  /**
   * @param {string} id
   */
  function blacklist(id) {
    blacklistID = id;
    blacklistModal.showModal();
  } //blacklist

  /**
   * @param {any} id
   */
  function showOptions(id) {
    const i = brackets.findIndex((e) => e.id === id);
    if (i > -1) {
      let html = `<ul class="list-group" style="max-height: 600px; overflow: auto">`;
      for (let index = 0; index < brackets[i].bracket.options.length; index++) {
        let option = brackets[i].bracket.options[index];
        html += `
      <li class="list-group-item">
      ${escape(option.name) || `<span class="text-body-secondary">no name</span>`} - 
      ${escape(option.value) || `<span class="text-body-secondary">no value</span>`} - 
      ${escape(option.type) || `<span class="text-body-secondary">no type</span>`} - 
      ${escape(option.thumbnail) || `<span class="text-body-secondary">no thumbnail</span>`}
      </li>`;
      }
      html += `</ul>`;
      elements.optionsModalBody.innerHTML = html;
      optionsModal.showModal();
    } else {
      showToast("bracket not found", "alert-error", 3000);
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
      showToast(result.message, "alert-info", 3000);
      blacklistModal.close();
      loadList();
    } catch (error) {
      showToast("Could not blacklist bracket", "alert-error", 3000);
      console.log("blacklistSubmit error", error);
    }
  } //blacklistSubmit

  /**
   * @param {any} id
   */
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
      showToast(result.message, "alert-info", 3000);
      loadList();
    } catch (error) {
      showToast("Could not unblacklist bracket", "alert-error", 3000);
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
      ${bracket.id} - ${escape(bracket.username)} - 
      ${escape(bracket.bracket.title)} - ${escape(bracket.bracket.description)} - ${bracket.bracket.options.length} options 
      <br><button type="button" class="btn btn-error float-end me-2" onclick="blacklist('${bracket.id}')">Blacklist</button>
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
    ${bracket.reason || "no reason"} - ${bracket.id} - ${escape(bracket.username)} - 
    ${escape(bracket.bracket.title)} - ${escape(bracket.bracket.description)} - ${bracket.bracket.options.length} options 
    <br><button type="button" class="btn btn-error float-end me-2" onclick="unblacklist('${bracket.id}')">Unblacklist</button>
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
      showToast("Could not load list", "alert-error", 3000);
      console.log(error);
    }
  } //loadList
</script>

<svelte:head>
  <title>chat.vote Brackets - Community brackets</title>
  <meta name="description" content="chat.vote Brackets - Community brackets" />
  <meta name="keywords" content="chatvote, chat.vote" />
  <meta property="og:title" content="chat.vote Brackets - Community brackets" />
  <meta property="og:url" content="https://chat.vote/blt/list" />
  <meta property="og:image" content="/pics/ogimage.png" />
  <meta property="og:description" content="chat.vote Brackets - Community brackets" />
</svelte:head>

<nav class="navbar navbar-expand-lg bg-body-tertiary mb-2">
  <div class="container-fluid">
    <a class="navbar-brand notranslate" href="/blt">
      <img src="/pics/donk.png" alt="donk" style="height: 24px; width: 24px" class="d-inline-block align-top" /> chat.vote Brackets - Community brackets
    </a>
  </div>
</nav>

<dialog id="blacklistModal" class="modal">
  <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-circle btn-ghost absolute right-1 top-1"><IcBaselineClose /></button>
    </form>
    <h3 class="text-lg font-bold">Blacklist bracket</h3>
    <div class="input-group">
      <span class="input-group-text">Reason</span>
      <input type="text" class="form-control" id="reason" aria-describedby="reject reason" />
    </div>
    <div class="modal-action">
      <form method="dialog">
        <button type="submit" class="btn btn-secondary">Close</button>
        <button type="button" class="btn btn-error" onclick={blacklistSubmit}>Blacklist</button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<dialog id="optionsModal" class="modal">
  <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-circle btn-ghost absolute right-1 top-1"><IcBaselineClose /></button>
    </form>
    <h3 class="text-lg font-bold">Random winner</h3>
    <div id="optionsModalBody"></div>
    <div class="modal-action">
      <form method="dialog">
        <button type="submit" class="btn btn-secondary">Close</button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

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
