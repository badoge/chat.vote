<script>
  import { onMount } from "svelte";
  import MdiTwitch from "~icons/mdi/twitch";
  import { CLIENT_ID } from "$lib/consts";

  onMount(() => {
    localStorage.setItem("loginStatus", "login_prompted");
    localStorage.setItem("USER_TEMP", JSON.stringify({}));

    window.onbeforeunload = function () {
      localStorage.setItem("loginStatus", "logged_out");
      localStorage.setItem("USER_TEMP", JSON.stringify({}));
    }; //onbeforeunload
  });

  let redirect_uri = "http://localhost:5173/super_long_url_to_hide_access_token__if_you_see_this_on_stream_then_the_streamer_you_are_watching_is_very_stupid";
  //let redirect_uri="https://beta.chat.vote/super_long_url_to_hide_access_token__if_you_see_this_on_stream_then_the_streamer_you_are_watching_is_very_stupid"

  let scopes = "";
</script>

<svelte:head>
  <title>chat.vote login prompt</title>
</svelte:head>

<div class="container-fluid text-center" id="main">
  <div class="row align-items-center">
    <div class="col align-self-center">
      <div class="text-danger" id="warning">
        <img src="/pics/donk.png" alt="donk" style="height: 1.5em" />
        <br />
        Don't show this on stream
      </div>
      <br />
      <a class="btn btn-twitch" href="https://id.twitch.tv/oauth2/authorize?client_id={CLIENT_ID}&redirect_uri={redirect_uri}&response_type=token{scopes}">
        <MdiTwitch /> Sign in with Twitch
      </a>
      <br />
      <span class="text-body-secondary" style="text-align: center">Address bar will show sensitive data</span>
    </div>
  </div>
</div>

<style>
  #main {
    margin-top: 50px;
    overflow: hidden;
  }

  #warning {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 10px;
    text-align: center;
  }

  .btn-twitch {
    line-height: 2rem;
    font-size: 1.5rem;
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
