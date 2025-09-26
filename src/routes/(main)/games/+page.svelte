<script>
  import { enablePopovers, enableTooltips, switchGame } from "$lib/functions";
  import { onMount } from "svelte";
  let elements;

  let bootstrap;
  onMount(async () => {
    bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");
    elements = {
      //modals
      grid: document.getElementById("grid"),
    };

    enableTooltips();
    enablePopovers();

    elements.channelName.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        connect();
      }
    });
  });

  let USER = {
    channel: "",
    twitchLogin: false,
    access_token: "",
    userID: "",
    platform: "",
  };
</script>

<svelte:head>
  <title>chat.vote Games</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="A collection of interactive minigames that you can play with your Twitch chat" />
  <meta name="keywords" content="chatvote, chat.vote, interactive, games, Twitch, chat" />
  <meta property="og:title" content="chat.vote Games" />
  <meta property="og:site_name" content="chat.vote Games" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chat.vote/games" />
  <meta property="og:image" content="https://screenshot.donk.workers.dev/?url=https://chat.vote/games" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:description" content="A collection of interactive minigames that you can play with your Twitch chat" />
</svelte:head>
