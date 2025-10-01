<script>
  import { page } from "$app/state";
  import Navbar from "$lib/Navbar.svelte";
  /** @type {{ [key: string]: any }} */
  let aliases = {
    blt: ["brackets", "bracket", "tierlist", "tierlists", "trivia", "blt", "btl"],
    forsen: ["forsen", "fors"],
    games: ["games", "game", "arena", "draw", "emotes", "emotebenchmark", "donkhunt", "shapes", "nim", "wordle", "notwordle", "connect4", "c4", "tictactoe", "ttt", "xo"],
    home: ["home", "homepage", "main", "info", "about", "contact"],
    playlist: ["playlist", "playlists", "queue", "sr", "q", "songrequest", "songrequests", "request", "requests", "clipqueue", "videos", "songs"],
    poll: ["poll", "polls", "poll", "pols", "strawpoll", "strawpolls"],
    pp: ["pp", "privacy", "privacypolicy"],
    raffles: ["raffles", "raffle", "rafle", "rafles", "giveaway", "giveaways", "sweepstakes", "sweepstake"],
    thebutton: ["thebutton", "button", "extensions", "extension"],
    tos: ["tos", "rules", "terms"],
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
  <meta name="description" content="Create twitch chat polls and vote through chat commands easily and quickly using chat.vote" />
  <meta name="keywords" content="twitch, chat, poll, chatvote, chat.vote" />
  <meta property="og:title" content="chat.vote/404" />
  <meta property="og:site_name" content="chat.vote/404" />
  <meta property="og:url" content="https://chat.vote/404" />
  <meta property="og:image" content="https://chat.vote/pics/ogimage.png" />
  <meta property="og:description" content="Create twitch chat polls and vote through chat commands easily and quickly using chat.vote" />
</svelte:head>

<Navbar />

<div class="flex justify-center">
  <div class="flex flex-col text-center">
    <span class="text-6xl font-extrabold"> 404</span>
    <span class="text-5xl font-thin"> NOTHING HERE</span>
    <br />
    <img src="/pics/donk.png" alt="donk" class="w-50 mx-auto" />
    <br />
    <p class="font-bold text-2xl" id="hint">{@html hint}</p>
  </div>
</div>
