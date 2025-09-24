<script>
  import { onMount } from "svelte";
  import "bootstrap/dist/css/bootstrap.min.css";

  onMount(async () => {
    await import("bootstrap");
  });

  import { page } from "$app/state";
  /** @type {{ [key: string]: any }} */
  let aliases = {
    blt: ["brackets", "bracket", "tierlist", "tierlists", "trivia", "blt", "btl"],
    forsen: ["forsen", "fors"],
    games: ["games", "game", "arena", "draw", "emotes", "emotebenchmark", "donkhunt", "shapes", "nim", "wordle", "notwordle", "connect4", "c4", "tictactoe", "ttt"],
    home: ["home", "homepage", "main", "info", "about", "contact"],
    poll: ["poll", "polls", "poll", "pols", "strawpoll", "strawpolls"],
    playlist: ["playlist", "playlists", "queue", "sr", "q", "songrequest", "songrequests", "request", "requests"],
    raffles: ["raffles", "raffle", "rafle", "rafles", "giveaway", "giveaways", "sweepstakes", "sweepstake"],
    thebutton: ["thebutton", "button", "extensions", "extension"],
    tts: ["tts"],
    viewers: ["viewers"],
    vts: ["vts", "vtube", "vtubestudio", "vtuber"],
    watch: ["watch", "watchparty", "watchparties"],
    waytoodank: ["waytoodank", "obs"],
  };
  let path = page.url.pathname.replace("/", "").replace(".html", "").toLowerCase();
  let hint = $state("");

  for (let key in aliases) {
    if (aliases[key].indexOf(path) !== -1) {
      hint = `Did you mean <a class="link" href="/${key}">beta.chat.vote/${key}</a>?`;
    }
  }
</script>

<svelte:head>
  <title>chat.vote/404</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="Create twitch chat polls and vote through chat commands easily and quickly using chat.vote" />
  <meta name="keywords" content="twitch, chat, poll, chatvote, chat.vote" />
  <meta property="og:title" content="chat.vote/404" />
  <meta property="og:site_name" content="chat.vote/404" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chat.vote/404" />
  <meta property="og:image" content="https://chat.vote/pics/ogimage.png" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:description" content="Create twitch chat polls and vote through chat commands easily and quickly using chat.vote" />
</svelte:head>

<h1>404</h1>
<p>NOTHING HERE</p>
<img src="/pics/donk.png" alt="donk" style="width: 200px" />

<p id="hint">{@html hint}</p>

<style>
  body {
    background-color: #212529;
    text-align: center;
    color: white;
    font-family:
      system-ui,
      -apple-system,
      "Segoe UI",
      Roboto,
      "Helvetica Neue",
      "Noto Sans",
      "Liberation Sans",
      Arial,
      sans-serif,
      "Apple Color Emoji",
      "Segoe UI Emoji",
      "Segoe UI Symbol",
      "Noto Color Emoji";
    font-size: 1.2rem;
  }

  h1 {
    font-size: 4rem;
    margin-top: 3rem;
  }

  p {
    font-size: 1.5rem;
    margin-top: 1rem;
    margin-bottom: 3rem;
  }

  #hint {
    font-size: 2rem;
    margin-top: 2rem;
  }

  a {
    color: #fffc4e;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
</style>
