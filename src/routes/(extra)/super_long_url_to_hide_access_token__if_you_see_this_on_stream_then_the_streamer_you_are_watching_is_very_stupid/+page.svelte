<script>
  import { onMount } from "svelte";
  import { CLIENT_ID } from "$lib/consts";

  onMount(async () => {
    let url = window.location.href;
    let access_token = url?.match(/\#(?:access_token)\=([\S\s]*?)\&/)?.[1];

    if (access_token) {
      let requestOptions = {
        headers: { Authorization: `Bearer ${access_token}`, "Client-Id": CLIENT_ID },
      };

      try {
        let response = await fetch("https://api.twitch.tv/helix/users", requestOptions);
        let result = await response.json();

        localStorage.setItem(
          "USER_TEMP",
          JSON.stringify({
            channel: result.data[0].login,
            twitchLogin: true,
            access_token: access_token,
            userID: result.data[0].id,
            platform: "twitch",
          }),
        );

        localStorage.setItem("loginStatus", "logged_in");
        window.close();
      } catch (error) {
        console.log("error", error);
        localStorage.setItem("loginStatus", "logged_out");
        localStorage.setItem("USER_TEMP", JSON.stringify({}));
        window.close();
      }
    } else {
      localStorage.setItem("loginStatus", "logged_out");
      localStorage.setItem("USER_TEMP", JSON.stringify({}));
      window.close();
    }

    window.onbeforeunload = function () {
      localStorage.setItem("loginStatus", "logged_out");
      localStorage.setItem("USER_TEMP", JSON.stringify({}));
    }; //onbeforeunload
  });
</script>

<svelte:head>
  <title>chat.vote login</title>
</svelte:head>

<div class="container-fluid text-center" id="main">
  <div class="row align-items-center">
    <div class="col align-self-center">
      <div class="text-success" id="success">
        <img src="/pics/donk.png" alt="donk" style="height: 1.5em" />
        <br />
        You can close this window now
      </div>
    </div>
  </div>
</div>

<style>
  #main {
    margin-top: 50px;
    overflow: hidden;
  }

  #success {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 10px;
    text-align: center;
  }
</style>
