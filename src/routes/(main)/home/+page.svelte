<script>
  import NavbarLinks from "$lib/NavbarLinks.svelte";
  import ThemeSwitcher from "$lib/ThemeSwitcher.svelte";
  import Login from "$lib/Login.svelte";
</script>

<svelte:head>
  <title>chat.vote Homepage</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="Learn about all the features of chat.vote" />
  <meta name="keywords" content="chatvote, chat.vote" />
  <meta property="og:title" content="chat.vote Homepage" />
  <meta property="og:site_name" content="chat.vote Homepage" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chat.vote/home" />
  <meta property="og:image" content="https://chat.vote/pics/ogimage.png" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:description" content="Learn about all the features of chat.vote" />
</svelte:head>

<nav class="navbar navbar-expand-lg bg-body-tertiary mb-2">
  <div class="container-fluid">
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarLinks" aria-controls="navbarLinks" aria-expanded="false" aria-label="Toggle site links">
      <span class="navbar-toggler-icon"></span>
    </button>
    <a class="navbar-brand notranslate site-link" href="/home" target="_self" data-bs-toggle="tooltip" data-bs-delay="200" data-bs-placement="bottom" data-bs-title="Home page">
      <img src="/pics/donk.png" alt="logo" style="height: 24px; width: 24px" class="d-inline-block align-top" />
    </a>
    <a class="navbar-brand notranslate site-link" href="/home" target="_self"> chat.vote Homepage</a>

    <div class="collapse navbar-collapse" id="navbarLinks">
      <ul class="navbar-nav">
        <NavbarLinks />
      </ul>
    </div>

    <div class="navbar-nav">
      <Login />
    </div>

    <div class="navbar-nav">
      <ThemeSwitcher />
    </div>
  </div>
</nav>

<h1 class="display-4 text-center">chat.vote pages</h1>

<div class="container-fluid">
  <div class="row mt-5">
    <div class="col-2"></div>
    <div class="col-8">
      <div class="card mb-5">
        <div class="row g-0">
          <div class="col-md-4">
            <a target="_blank" rel="noopener noreferrer" href="/">
              <img src="https://screenshot.donk.workers.dev/?url=https://chat.vote/" class="img-fluid rounded-start" alt="chat.vote" />
            </a>
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h3 class="card-title"><a target="_blank" rel="noopener noreferrer" href="/">chat.vote</a></h3>
              <p>chat.vote allows you to make polls that you vote on by typing in chat, it can also be used to collect suggestions from viewers.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-5">
        <div class="row g-0">
          <div class="col-md-4">
            <a target="_blank" rel="noopener noreferrer" href="/poll">
              <img src="https://screenshot.donk.workers.dev/?url=https://chat.vote/poll" class="img-fluid rounded-start" alt="chat.vote/poll" />
            </a>
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h3 class="card-title"><a target="_blank" rel="noopener noreferrer" href="/poll">chat.vote/poll</a></h3>
              <p>chat.vote/poll allows you to make polls that can be shared using a link.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-5">
        <div class="row g-0">
          <div class="col-md-4">
            <a target="_blank" rel="noopener noreferrer" href="/games">
              <img src="https://screenshot.donk.workers.dev/?url=https://chat.vote/games" class="img-fluid rounded-start" alt="chat.vote/games" />
            </a>
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h3 class="card-title"><a target="_blank" rel="noopener noreferrer" href="/games">chat.vote/games</a></h3>
              <p>A collection of mini games with Twitch chat interaction.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-5">
        <div class="row g-0">
          <div class="col-md-4">
            <a target="_blank" rel="noopener noreferrer" href="/raffles">
              <img src="https://screenshot.donk.workers.dev/?url=https://chat.vote/raffles" class="img-fluid rounded-start" alt="chat.vote/raffles" />
            </a>
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h3 class="card-title"><a target="_blank" rel="noopener noreferrer" href="/raffles">chat.vote/raffles</a></h3>
              <p>A raffles tool for Twitch chat.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-5">
        <div class="row g-0">
          <div class="col-md-4">
            <a target="_blank" rel="noopener noreferrer" href="/blt/">
              <img src="https://screenshot.donk.workers.dev/?url=https://chat.vote/blt" class="img-fluid rounded-start" alt="chat.vote/blt" />
            </a>
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h3 class="card-title"><a target="_blank" rel="noopener noreferrer" href="/blt/">chat.vote/blt</a></h3>
              <p>
                Brackets, tier lists, and trivia maker with Twitch chat integration. Can generate brackets and tier lists automatically from Spotify playlists, TierMaker.com tier lists, A
                Twitch channel's clips or emotes, uwufufu.com brackets, YouTube channels or playlists.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-5">
        <div class="row g-0">
          <div class="col-md-4">
            <a target="_blank" rel="noopener noreferrer" href="/playlist/">
              <img src="https://screenshot.donk.workers.dev/?url=https://chat.vote/playlist" class="img-fluid rounded-start" alt="chat.vote/playlist" />
            </a>
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h3 class="card-title"><a target="_blank" rel="noopener noreferrer" href="/playlist/">chat.vote/playlist</a></h3>
              <p>Allows viewers to send song & video requests. Supports YouTube, Twitch, Spotify, Vimeo, TikTok, and Streamable.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-5">
        <div class="row g-0">
          <div class="col-md-4">
            <a target="_blank" rel="noopener noreferrer" href="/thebutton"><img src="/pics/thebutton.png" class="img-fluid rounded-start" alt="chat.vote/thebutton" /></a>
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h3 class="card-title"><a target="_blank" rel="noopener noreferrer" href="/thebutton">chat.vote/thebutton</a></h3>
              <p>(Deprecated) A Twitch extension that lets viewers click a button :)</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-5">
        <div class="card-body">
          <h3 class="card-title">Work in progress/Test pages/proof of concepts that are not being worked on :)</h3>
          <p><a target="_blank" rel="noopener noreferrer" href="/tts">chat.vote/tts</a> Some simple tts command that can be used from chat</p>
          <p><a target="_blank" rel="noopener noreferrer" href="/waytoodank/">chat.vote/waytoodank</a> A WAYTOODANK OBS music visualizer</p>
          <p><a target="_blank" rel="noopener noreferrer" href="/viewers/">chat.vote/viewers</a> A graph that shows the view count of a channel over time</p>
          <p><a target="_blank" rel="noopener noreferrer" href="/forsen/">chat.vote/forsen</a> A raffles site for forsen that works with 1 click only :)</p>
          <p>
            <a target="_blank" rel="noopener noreferrer" href="/vts/">chat.vote/vts</a> A site that lets viewers control your VTube Studio model using chat commands or channel points. Deprecated
            since VTS has this functionality built-in now.
          </p>
        </div>
      </div>
    </div>
    <div class="col-2"></div>
  </div>
</div>

<style>
  body {
    margin-bottom: 500px;
  }
</style>
