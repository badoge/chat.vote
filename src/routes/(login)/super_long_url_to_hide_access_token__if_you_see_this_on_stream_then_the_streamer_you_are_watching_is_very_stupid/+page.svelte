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
        localStorage.setItem("USER_TEMP", "");
        window.close();
      }
    } else {
      localStorage.setItem("loginStatus", "logged_out");
      localStorage.setItem("USER_TEMP", "");
      window.close();
    }

    window.onbeforeunload = function () {
      localStorage.setItem("loginStatus", "logged_out");
      localStorage.setItem("USER_TEMP", "");
    }; //onbeforeunload
  });
</script>

<svelte:head>
  <title>chat.vote login</title>
</svelte:head>

<div class="flex flex-col text-center overflow-hidden mt-[100px] m-5">
  <div class="justify-center">
    <div class="text-success font-bold text-3xl">
      <img src="/pics/donk.png" alt="donk" class="mx-auto h-15" />
      <br />
      You can close this window now
    </div>
  </div>
</div>
