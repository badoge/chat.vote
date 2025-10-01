<script>
  import { onMount } from "svelte";
  import { donkStorage, resetSettings } from "$lib/donkStorage.svelte";
  import { checkToken, get7TVPFP, getTwitchPFP, getUserID, loadBadges } from "./functions";
  import MdiTwitch from "~icons/mdi/twitch";
  import IcBaselineLogout from "~icons/ic/baseline-logout";
  import { CLIENT_ID } from "$lib/consts";

  import tmi from "tmi.js";

  let { messageHandler = null, timeoutHandler = null, messageDeletedHandler = null, loginEvent = null } = $props();

  let USER = donkStorage("USER", null);

  //logged_out - default state with the login button visible, stays like this if USER local storage is not found
  //login_prompted - gets set when the login button is clicked, login button turns into a loading spinner
  //logged_in - user completed login prompt or USER local storage loaded, login button turns into a pfp + username
  let loginStatus = $state("logged_out");

  let chatStatus = $state({ emoji: "🔴", title: "Chat disconnected" });

  let pfpURL = $state("");

  let channelInput = $state("");

  let loginExpiredModal;

  onMount(async () => {
    loginExpiredModal = new bootstrap.Modal(document.getElementById("loginExpiredModal"));

    //listen to storage events from the login windows
    window.onstorage = () => {
      if (localStorage.getItem("loginStatus") !== loginStatus) {
        loginStatus = localStorage.getItem("loginStatus") || "logged_out";

        if (localStorage.getItem("loginStatus") == "logged_in") {
          let USER_TEMP = JSON.parse(localStorage.getItem("USER_TEMP") || "{}");
          USER.value.channel = USER_TEMP.channel;
          USER.value.twitchLogin = USER_TEMP.twitchLogin;
          USER.value.access_token = USER_TEMP.access_token;
          USER.value.userID = USER_TEMP.userID;
          USER.value.platform = USER_TEMP.platform;
          localStorage.setItem("USER_TEMP", JSON.stringify({}));
          connectIRC();
          loadPFP();
        }
      }
    };

    //check if the token is still valid if user logged in using twitch
    //if token is not valid set channel to "" to avoid connecting to chat and show the error modal
    if (USER.value.twitchLogin && !(await checkToken(USER.value.access_token))) {
      USER.value.channel = "";
      loginExpiredModal.show();
      return;
    }

    //user has a valid token or is using manual login so connect to chat
    if (USER.value.channel) {
      loginStatus = "logged_in";
      connectIRC();
      loadPFP();
    }
  }); //onMount

  function connectIRC() {
    chatStatus = { emoji: "🟡", title: "Chat connecting" };
    loadBadges(USER.value.channel);
    if (loginEvent) {
      loginEvent();
    }

    let options = {
      options: {
        clientId: CLIENT_ID,
        debug: false,
      },
      connection: {
        secure: true,
        reconnect: true,
      },
      channels: [USER.value.channel],
    };
    const client = new tmi.Client(options);

    if (messageHandler) {
      client.on("message", messageHandler);
    }

    if (timeoutHandler) {
      client.on("timeout", timeoutHandler);
    }

    if (messageDeletedHandler) {
      client.on("messagedeleted", messageDeletedHandler);
    }

    client.on("connected", async (address, port) => {
      console.log(`Connected to ${address}:${port}`);
      chatStatus = { emoji: "🟢", title: "Chat connected" };
      //sendUsername(`chat.vote`, USER.value.channel, USER.value.platform == "twitch" ? `twitch - ${USER.value.twitchLogin}` : "youtube");
    }); //connected

    client.on("disconnected", (reason) => {
      chatStatus = { emoji: "⚠", title: `Chat disconnected: ${reason}` };
    }); //disconnected

    client.on("notice", (channel, msgid, message) => {
      chatStatus = { emoji: "⚠", title: `Chat disconnected: ${message}` };
    }); //notice

    client.connect().catch(console.error);
  } //connectIRC

  async function manualConnect() {
    let channel = channelInput.replace(/\s+/g, "").toLowerCase();
    if (!channel) {
      return;
    }
    loginStatus = "logged_in";
    localStorage.setItem("loginStatus", "logged_in");
    localStorage.setItem("USER_TEMP", JSON.stringify({}));

    USER.value.channel = channel;
    USER.value.twitchLogin = false;
    USER.value.access_token = "";
    USER.value.userID = await getUserID(channel);
    USER.value.platform = "twitch";
    localStorage.setItem("USER_TEMP", JSON.stringify({}));
    connectIRC();
    loadPFP();
  } //manualConnect

  /**
   * @param {{ key: string; }} event
   */
  function handleKeydown(event) {
    if (event.key === "Enter") {
      manualConnect();
    }
  } //manualConnect

  async function loadPFP() {
    pfpURL = await get7TVPFP(USER.value.userID);
    if (pfpURL == "/pics/donk.png" && USER.value.access_token) {
      pfpURL = await getTwitchPFP(USER.value.channel, USER.value.access_token);
    }
  } //loadPFP

  function login() {
    loginStatus = "login_prompted";
    localStorage.setItem("loginStatus", "login_prompted");
    localStorage.setItem("USER_TEMP", JSON.stringify({}));
    window.open("/prompt", "loginWindow", "toolbar=0,status=0,scrollbars=0,width=500px,height=800px");
    return false;
  } //login

  function logout() {
    loginStatus = "logged_out";
    localStorage.setItem("loginStatus", "logged_out");
    localStorage.setItem("USER_TEMP", JSON.stringify({}));
    resetSettings("USER");
  } //logout
</script>

<div class="modal fade" id="loginExpiredModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Login expired</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row justify-content-center">
          Renew login:<br />
          <button type="button" data-bs-dismiss="modal" onclick={login} class="btn btn-twitch"><MdiTwitch />Sign in with Twitch</button>
          <br /><small class="text-body-secondary">Logins expire after 2 months.<br />Or after you change your password.</small>
        </div>
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-danger"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          data-bs-title="Will reset everything so you can login again."
          data-bs-dismiss="modal"
          onclick={() => resetSettings("USER")}
        >
          Reset
        </button>
      </div>
    </div>
  </div>
</div>

{#if loginStatus == "logged_out"}
  <div class="btn-group">
    <button type="button" class="btn btn-twitch" onclick={login}><MdiTwitch />Sign in with Twitch</button>
    <button type="button" class="btn btn-twitch dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
      <span class="visually-hidden">Toggle Dropdown</span>
    </button>
    <div class="dropdown-menu dropdown-menu-end">
      <div class="p-4" style="width: 300px">
        <label for="channelName" class="form-label">Connect to chat directly</label>
        <div class="input-group">
          <span class="input-group-text" id="directLoginChannel">twitch.tv/</span>
          <input type="text" class="form-control" id="channelName" placeholder="Username" bind:value={channelInput} onkeydown={handleKeydown} aria-describedby="directLoginChannel" />
        </div>
        <small class="text-body-secondary">Some features will be unavailable if you connect directly</small>
        <br />
        <button type="button" onclick={manualConnect} class="btn btn-primary float-end mb-3">Connect</button>
      </div>
    </div>
  </div>
{:else if loginStatus == "login_prompted"}
  <div class="btn-group" role="group" aria-label="log in button group">
    <button type="button" class="btn btn-twitch"><div class="spinner-border" role="status" style="width: 1.5em; height: 1.5em"><span class="visually-hidden">Loading...</span></div></button>
    <div class="btn-group" role="group">
      <button id="btnGroupDropLogin" type="button" class="btn btn-twitch dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Log out button dropdown"> </button>
      <ul class="dropdown-menu dropdown-menu-lg-end" aria-label="Log out">
        <li><button class="dropdown-item" type="button" onclick={logout}><IcBaselineLogout />Log out</button></li>
      </ul>
    </div>
  </div>
{:else if loginStatus == "logged_in"}
  <div class="input-group">
    <span class="input-group-text pfp-container">
      {#if pfpURL}
        <img src={pfpURL} alt="profile pic" class="rounded-start pfp" />
      {:else}
        <div class="placeholder-glow" style="width: 100%; height: 100%">
          <span class="placeholder rounded-start" style="width: 100%; height: 100%"></span>
        </div>
      {/if}
    </span>

    <span class="input-group-text border-secondary">{USER.value.channel || "Loading..."}</span>

    <span class="input-group-text border-secondary p-0 cursor-pointer" title={chatStatus.title}>{chatStatus.emoji}</span>

    <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Log out button dropdown"></button>
    <ul class="dropdown-menu dropdown-menu-end">
      <li><button class="dropdown-item" type="button" onclick={logout}><IcBaselineLogout />Log out</button></li>
    </ul>
  </div>
{/if}

<style>
  .pfp-container {
    padding: 0;
    height: 45.3px;
    width: 45.3px;
  }
  .pfp {
    object-fit: contain;
    max-width: 100%;
    max-height: 100%;
    height: auto;
    display: block;
  }

  .btn-twitch {
    color: #ffffff;
    background-color: #9933ff !important;
    border-color: #8744aa !important;
  }

  .btn-twitch:focus,
  .btn-twitch:hover {
    background-color: #8038de !important;
    border-color: #7f40a1 !important;
  }

  .btn-twitch:active {
    background-color: #6b2cbd !important;
    border-color: #6a308a !important;
  }
</style>
