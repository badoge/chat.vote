<script>
  import Navbar from "$lib/Navbar.svelte";

  const pages = [
    {
      link: "/",
      name: "chat.vote",
      description: "chat.vote allows you to make polls that you vote on by typing in chat, it can also be used to collect suggestions from viewers",
      thumbnail: "https://screenshot.donk.workers.dev/?url=https://chat.vote",
    },
    {
      link: "/poll",
      name: "chat.vote Polls",
      description: "Shareable polls. Anyone can vote by visiting a link instead of typing in chat",
      thumbnail: "https://screenshot.donk.workers.dev/?url=https://chat.vote/poll",
    },

    {
      link: "/games",
      name: "chat.vote Games",
      description: "A collection of mini games with Twitch chat interaction",
      thumbnail: "https://screenshot.donk.workers.dev/?url=https://chat.vote/games",
    },
    {
      link: "/raffles",
      name: "chat.vote Raffles",
      description: "A raffles tool for Twitch chat",
      thumbnail: "https://screenshot.donk.workers.dev/?url=https://chat.vote/raffles",
    },
    {
      link: "/blt",
      name: "chat.vote Brackets, (tier)Lists & trivia",
      description:
        "Brackets, tier lists, and trivia maker with Twitch chat integration. Can generate brackets and tier lists automatically from Spotify playlists, TierMaker.com tier lists, A Twitch channel's clips or emotes, YouTube channels or playlists",
      thumbnail: "https://screenshot.donk.workers.dev/?url=https://chat.vote/blt",
    },
    {
      link: "/playlist",
      name: "chat.vote Playlist",
      description: "Allows viewers to send song & video requests. Supports YouTube, Twitch, Spotify, Vimeo, TikTok, and Streamable",
      thumbnail: "https://screenshot.donk.workers.dev/?url=https://chat.vote/playlist",
    },
  ];
</script>

<svelte:head>
  <title>chat.vote Homepage</title>
  <meta name="description" content="Learn about all the features of chat.vote" />
  <meta name="keywords" content="chatvote, chat.vote" />
  <meta property="og:title" content="chat.vote Homepage" />
  <meta property="og:site_name" content="chat.vote Homepage" />
  <meta property="og:url" content="https://chat.vote/home" />
  <meta property="og:image" content="https://chat.vote/pics/ogimage.png" />
  <meta property="og:description" content="Learn about all the features of chat.vote" />
</svelte:head>

<Navbar />

<div class="flex flex-row">
  <div class="lg:w-150 grow"></div>

  <div class="grow-0">
    <div class="text-5xl font-extrabold text-center my-5">chat.vote pages</div>

    {#each pages as page}
      <div class="card lg:card-side bg-base-100 shadow-lg m-5">
        <figure>
          <a href={page.link}><img src={page.thumbnail} alt={page.name} /></a>
        </figure>
        <div class="card-body">
          <h2 class="card-title"><a href={page.link}>{page.name}</a></h2>
          <p>{page.description}</p>
        </div>
      </div>
    {/each}

    <div class="card bg-base-100 shadow-lg mb-5">
      <div class="card-body">
        <h2 class="card-title">Work in progress/Test pages/proof of concepts that are not being worked on :)</h2>
        <p><a class="link font-bold" href="/tts">chat.vote/tts</a> Some simple tts command that can be used from chat</p>
        <p><a class="link font-bold" href="/waytoodank">chat.vote/waytoodank</a> A WAYTOODANK OBS music visualizer</p>
        <p><a class="link font-bold" href="/viewers">chat.vote/viewers</a> A graph that shows the view count of a channel over time</p>
        <p><a class="link font-bold" href="/forsen">chat.vote/forsen</a> A raffles site for forsen that works with 1 click only :)</p>
        <p><a class="link font-bold" href="/thebutton">chat.vote/thebutton</a> A Twitch extension that lets viewers click a button :)</p>
        <p>
          <a class="link font-bold" href="/vts">chat.vote/vts</a> A site that lets viewers control your VTube Studio model using chat commands or channel points. Deprecated since VTS has this
          functionality built-in now.
        </p>
      </div>
    </div>
  </div>

  <div class="lg:w-150 grow"></div>
</div>
