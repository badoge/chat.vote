<script>
  import { switchGame } from "$lib/functions";
  import { onMount } from "svelte";
  let elements;

  onMount(async () => {
    elements = {
      //modals
      grid: document.getElementById("grid"),
    };
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
  <meta name="description" content="A collection of interactive minigames that you can play with your Twitch chat" />
  <meta name="keywords" content="chatvote, chat.vote, interactive, games, Twitch, chat" />
  <meta property="og:title" content="chat.vote Games" />
  <meta property="og:site_name" content="chat.vote Games" />
  <meta property="og:url" content="https://chat.vote/games" />
  <meta property="og:image" content="https://screenshot.donk.workers.dev/?url=https://chat.vote/games" />
  <meta property="og:description" content="A collection of interactive minigames that you can play with your Twitch chat" />
</svelte:head>
