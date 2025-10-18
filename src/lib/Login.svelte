<script>
  import { onMount } from "svelte";
  import { donkStorage, resetSettings } from "$lib/donkStorage.svelte";
  import { checkToken, get7TVPFP, getTwitchPFP, getUserID, loadBadges } from "./functions";
  import MdiTwitch from "~icons/mdi/twitch";
  import IcBaselineLogout from "~icons/ic/baseline-logout";
  import IcBaselineArrowDropDown from "~icons/ic/baseline-arrow-drop-down";
  import { CLIENT_ID } from "$lib/consts";

  import tmi from "tmi.js";
  import { showToast } from "../routes/+layout.svelte";

  let { messageHandler = null, timeoutHandler = null, messageDeletedHandler = null, loginEvent = null } = $props();

  let USER = donkStorage("USER", null);

  //logged_out - default state with the login button visible, stays like this if USER local storage is not found
  //login_prompted - gets set when the login button is clicked, login button turns into a loading spinner
  //logged_in - user completed login prompt or USER local storage loaded, login button turns into a pfp + username
  let loginStatus = $state("logged_out");

  let chatStatus = $state({ emoji: "🔴", title: "Chat disconnected" });

  let pfpURL = $state("");

  let channelInput = $state("");

  onMount(async () => {
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
          localStorage.setItem("USER_TEMP", "");
          connectIRC();
          loadPFP();
        }
      }
    };

    //check if the token is still valid if user logged in using twitch
    //if token is not valid set channel to "" to avoid connecting to chat and show the error modal
    if (USER?.value.twitchLogin) {
      let tokenCheck = await checkToken(USER.value.access_token);

      //tokenCheck is false when the the function throws an error or the get request fails
      if (tokenCheck === false) {
        USER.value.channel = "";
        loginExpiredModal.showModal();
        return;
      }

      //force user to login again if the token will expire soon
      if (tokenCheck?.expires_in < 600) {
        USER.value.channel = "";
        loginExpiredModal.showModal();
        return;
      }

      //user is using a sus token so force them to login again
      if (tokenCheck?.client_id !== CLIENT_ID) {
        USER.value.channel = "";
        loginExpiredModal.showModal();
        return;
      }

      //update username incase it changed
      if (tokenCheck.login !== USER.value.channel) {
        USER.value.channel = tokenCheck.login;
      }
    }

    //user has a valid token or is using manual login so connect to chat
    if (USER?.value.channel) {
      loginStatus = "logged_in";
      connectIRC();
      loadPFP();
    }
  }); //onMount

  function connectIRC() {
    chatStatus = { emoji: "🟡", title: "Chat connecting" };

    loadBadges(USER?.value.channel);

    let options = {
      options: {
        clientId: CLIENT_ID,
        debug: false,
      },
      connection: {
        secure: true,
        reconnect: true,
      },
      channels: [USER?.value.channel],
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
      if (loginEvent) {
        loginEvent();
      }
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
    localStorage.setItem("USER_TEMP", "");

    USER.value.channel = channel;
    USER.value.twitchLogin = false;
    USER.value.access_token = "";
    USER.value.userID = await getUserID(channel);
    USER.value.platform = "twitch";
    localStorage.setItem("USER_TEMP", "");
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
    localStorage.setItem("USER_TEMP", "");
    window.open("/prompt", "loginWindow", "toolbar=0,status=0,scrollbars=0,width=500px,height=800px");
    return false;
  } //login

  function logout() {
    loginStatus = "logged_out";
    localStorage.setItem("loginStatus", "logged_out");
    localStorage.setItem("USER_TEMP", "");
    resetSettings("USER");
  } //logout
</script>

<dialog id="loginExpiredModal" class="modal">
  <div class="modal-box">
    <h3 class="text-xl font-bold mb-3">Login expired</h3>

    <button
      type="button"
      data-bs-dismiss="modal"
      onclick={() => {
        loginExpiredModal.close();
        login();
      }}
      class="btn btn-twitch"><MdiTwitch />Renew login</button
    >
    <br />
    <small class="opacity-70">
      Logins expire when: <i>2 months pass</i> <strong>OR</strong> <i>you change your email/password</i> <strong>OR</strong> <i>you disconnect the app in the Twitch settings</i>
    </small>

    <div class="modal-action">
      <form method="dialog">
        <button type="button" class="btn btn-error" onclick={() => resetSettings("USER")}>
          <IcBaselineLogout />Log out
        </button>
      </form>
    </div>
  </div>
</dialog>

{#if loginStatus == "logged_out"}
  <div class="join">
    <button class="btn btn-twitch join-item" onclick={login}><MdiTwitch />Sign in with Twitch</button>
    <button class="btn btn-twitch join-item p-1" popovertarget="loginDropdown" style="anchor-name:--loginDropdownAnchor"><IcBaselineArrowDropDown /></button>
  </div>
  <div class="dropdown dropdown-end border border-purple-500 menu w-70 rounded-box bg-base-300 shadow-sm p-3" popover id="loginDropdown" style="position-anchor:--loginDropdownAnchor">
    <label class="text-lg font-bold" for="channelName">Connect to chat anonymously</label>

    <label class="input">
      <span class="label">twitch.tv/</span>
      <input type="text" id="channelName" placeholder="Username" bind:value={channelInput} onkeydown={handleKeydown} />
    </label>
    <br />
    <small class="opacity-70">Some features will be unavailable if you connect anonymously</small>
    <br />
    <button type="button" onclick={manualConnect} class="btn btn-twitch float-end">Connect</button>
  </div>
{:else if loginStatus == "login_prompted"}
  <div class="join">
    <button class="btn btn-twitch join-item" aria-label="Loading..."><span class="loading loading-spinner loading-xl"></span></button>
    <button class="btn btn-twitch join-item p-1" popovertarget="cancelLoginDropdown" style="anchor-name:--cancelLoginDropdownAnchor"><IcBaselineArrowDropDown /></button>
  </div>
  <ul class="dropdown dropdown-end border border-purple-500 menu rounded-box bg-base-300 shadow-sm p-1" popover id="cancelLoginDropdown" style="position-anchor:--cancelLoginDropdownAnchor">
    <li><button onclick={logout}><IcBaselineLogout />Log out</button></li>
  </ul>
{:else if loginStatus == "logged_in"}
  <div class="join">
    <button class="btn btn-outline btn-accent join-item pointer-events-none pfp-container">
      {#if pfpURL}
        <img src={pfpURL} alt="profile pic" class="rounded-s pfp" />
      {:else}
        <div class="skeleton rounded-s rounded-e-none pfp-container"></div>
      {/if}
    </button>

    <button class="btn btn-outline btn-accent join-item pointer-events-none text-lg font-bold">{USER?.value.channel || "Loading..."}</button>

    <div class="tooltip tooltip-bottom" data-tip={chatStatus.title}>
      <button class="btn btn-outline btn-accent join-item p-0 pointer-events-none">{chatStatus.emoji}</button>
    </div>

    <button class="btn btn-accent join-item p-1" popovertarget="logoutDropdown" style="anchor-name:--logoutDropdownAnchor"><IcBaselineArrowDropDown /></button>
  </div>
  <ul class="dropdown dropdown-end border border-accent menu rounded-box bg-base-300 shadow-sm p-1" popover id="logoutDropdown" style="position-anchor:--logoutDropdownAnchor">
    <li><button onclick={logout}><IcBaselineLogout />Log out</button></li>
  </ul>
{:else}
  Something went wrong :(
{/if}

<style>
  .pfp-container {
    padding: 0;
    height: 40px;
    width: 40px;
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
