<script>
  import { onDestroy } from "svelte";

  onDestroy(() => {
    window.opener.loadPFP();
  });
</script>

<svelte:head>
  <title>chat.vote login prompt</title>
</svelte:head>

<div class="container d-flex justify-content-center align-items-center" style="height: 70%">
  <div class="row">
    <strong class="text-danger" style="font-size: 2rem; margin-bottom: 10px; text-align: center">
      Don't show this on stream<img src="/pics/donk.png" alt="donk" style="height: 1.5em" />
    </strong>
    <br />
    <a class="btn btn-twitch" href="https://id.twitch.tv/oauth2/authorize?client_id=qn0wimnszbqlwfnszdz3wwfz430eqr&redirect_uri=https://chat.vote/login.html&response_type=token">
      <span class="twitch-icon"></span> Sign in with Twitch
    </a>
    <span class="text-body-secondary" style="text-align: center">Address bar will show sensitive data</span>
  </div>
</div>

<style>
  html,
  body {
    margin: 10px;
    height: 100%;
    overflow: hidden;
  }
</style>
