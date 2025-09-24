<script>
  import { onDestroy, onMount } from "svelte";

  onDestroy(() => {
    //window.opener.loadAndConnect();
  });
  let access_token;
  onMount(() => {
    let url = window.location.href;
    access_token = url.match(/\#(?:access_token)\=([\S\s]*?)\&/)[1];
    getUsername();
  });

  async function getUsername() {
    let requestOptions = {
      headers: { Authorization: `Bearer ${access_token}`, "Client-Id": "qn0wimnszbqlwfnszdz3wwfz430eqr" },
    };

    try {
      let response = await fetch("https://api.twitch.tv/helix/users", requestOptions);
      let result = await response.json();
      localStorage.setItem(
        "USER",
        JSON.stringify({
          channel: result.data[0].login,
          twitchLogin: true,
          access_token: access_token,
          userID: result.data[0].id,
          platform: "twitch",
        }),
      );
      //window.close();
    } catch (error) {
      console.log("error", error);
      //window.close();
    }
  }
</script>

<svelte:head>
  <title>chat.vote login</title>
</svelte:head>

<div class="container d-flex justify-content-center align-items-center" style="height: 70%">
  <div class="row">
    <strong class="text-success" style="font-size: 2rem">You can close this window now :)</strong>
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
