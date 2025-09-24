<script>
  import { onMount } from "svelte";
  import { login } from "$lib/functions";
  import "bootstrap/dist/css/bootstrap.min.css";

  import IcRoundHowToVote from "~icons/ic/round-how-to-vote";
  import IcBaselineVideogameAsset from "~icons/ic/baseline-videogame-asset";
  import IcBaselineQueueMusic from "~icons/ic/baseline-queue-music";
  import IcBaselineLocalActivity from "~icons/ic/baseline-local-activity";
  import StreamlineToastSolid from "~icons/streamline/toast-solid";
  import MdiTwitch from "~icons/mdi/twitch";
  import { resetSettings } from "$lib/games";

  onMount(async () => {
    await import("bootstrap");
  });
  let { children } = $props();
</script>

<div aria-live="polite" aria-atomic="true" class="position-relative">
  <div id="toastContainer" class="toast-container"></div>
</div>

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
          <button type="button" data-bs-dismiss="modal" onclick={login} class="btn btn-twitch"><span class="twitch-icon"></span>Sign in with Twitch</button>
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
          onclick={() => resetSettings(true)}
        >
          Reset
        </button>
      </div>
    </div>
  </div>
</div>

<nav class="navbar navbar-expand-lg bg-body-tertiary mb-2">
  <div class="container-fluid">
    <a
      class="navbar-brand notranslate site-link"
      href="/home/"
      target="_self"
      rel="noopener noreferrer"
      data-bs-toggle="tooltip"
      data-bs-delay="200"
      data-bs-placement="bottom"
      data-bs-title="Home page"
    >
      <img src="/pics/donk.png" alt="logo" style="height: 24px; width: 24px" class="d-inline-block align-top" />
    </a>
    <a class="navbar-brand notranslate site-link" href="/" target="_self" rel="noopener noreferrer"> chat.vote </a>

    <div class="collapse navbar-collapse">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a
            class="nav-link active site-link"
            data-bs-toggle="tooltip"
            data-bs-delay="200"
            data-bs-placement="bottom"
            data-bs-title="Polls that you vote on by typing in Twitch chat"
            aria-current="page"
            target="_self"
            rel="noopener noreferrer"
            href="/"
          >
            <MdiTwitch /> Twitch chat polls
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link site-link"
            data-bs-toggle="tooltip"
            data-bs-delay="200"
            data-bs-placement="bottom"
            data-bs-title="Straw polls with shareable links"
            target="_self"
            rel="noopener noreferrer"
            href="/poll/"
          >
            <IcRoundHowToVote /> Polls
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link site-link"
            data-bs-toggle="tooltip"
            data-bs-delay="200"
            data-bs-placement="bottom"
            data-bs-title="Mini games with chat interaction"
            target="_self"
            rel="noopener noreferrer"
            href="/games/"
          >
            <IcBaselineVideogameAsset /> Games
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link site-link"
            data-bs-toggle="tooltip"
            data-bs-delay="200"
            data-bs-placement="bottom"
            data-bs-title="Twitch chat raffles"
            target="_self"
            rel="noopener noreferrer"
            href="/raffles/"
          >
            <IcBaselineLocalActivity /> Raffles
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link site-link"
            data-bs-toggle="tooltip"
            data-bs-delay="200"
            data-bs-placement="bottom"
            data-bs-title="Brackets, (tier)Lists & Trivia"
            target="_self"
            rel="noopener noreferrer"
            href="/blt/"
          >
            <StreamlineToastSolid /> BLT
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link site-link"
            data-bs-toggle="tooltip"
            data-bs-delay="200"
            data-bs-placement="bottom"
            data-bs-title="Song & video requests"
            target="_self"
            rel="noopener noreferrer"
            href="/playlist/"
          >
            <IcBaselineQueueMusic /> Playlist
          </a>
        </li>
      </ul>
      <div class="mx-auto d-inline-flex">
        <div id="status" style="margin-top: 5px">
          <h4><span class="badge bg-danger">Not connected :(</span></h4>
        </div>
      </div>
    </div>
    <div id="topRight" class="navbar-nav">
      <div class="btn-group" role="group" aria-label="login options">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <a
          role="button"
          id="loginButton"
          onclick={login}
          class="btn btn-twitch"
          tabindex="0"
          data-bs-container="body"
          data-bs-custom-class="custom-popover"
          data-bs-placement="bottom"
          data-bs-trigger="manual"
          data-bs-toggle="popover"
          data-bs-title="Not signed in"
          data-bs-content="You need sign in first before adding options or enabling voting/suggestions"
        >
          <span class="twitch-icon"></span>Sign in with Twitch
        </a>
        <div class="btn-group" role="group">
          <button
            id="btnGroupDropLogin"
            type="button"
            class="btn btn-twitch dropdown-toggle"
            data-bs-toggle="dropdown"
            data-bs-auto-close="outside"
            aria-label="other login option, connect manually"
            aria-expanded="false"
          ></button>
          <div class="dropdown-menu dropdown-menu-end" aria-labelledby="btnGroupDropLogin">
            <div class="p-3" style="width: 300px">
              <label for="channelName" class="form-label">Connect to chat directly</label>
              <div class="input-group mb-3">
                <span class="input-group-text" id="directLoginChannel">twitch.tv/</span>
                <input type="text" class="form-control" id="channelName" aria-describedby="directLoginChannel" />
              </div>
              <small class="text-body-secondary">Some features will not be available if you connect directly</small><br />
              <button type="button" onclick={connect} class="btn btn-primary float-end">Connect</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="navbar-nav">
      <div id="theme-label-container">
        <label id="theme-label">
          <input id="darkTheme" type="checkbox" checked />
          <div class="planet"></div>
          <div class="theme-elements">
            <svg version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
              <circle cx="250" cy="250" r="200" />
            </svg>
            <svg version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
              <circle cx="250" cy="250" r="200" />
            </svg>
            <svg version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
              <circle cx="250" cy="250" r="200" />
            </svg>
            <svg version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
              <circle cx="250" cy="250" r="200" />
            </svg>
            <svg version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
              <circle cx="250" cy="250" r="200" />
            </svg>
            <svg version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
              <circle cx="250" cy="250" r="200" />
            </svg>
            <svg version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
              <circle cx="250" cy="250" r="200" />
            </svg>
            <svg version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
              <circle cx="250" cy="250" r="200" />
            </svg>
          </div>
        </label>
      </div>
    </div>
  </div>
</nav>

{@render children?.()}
