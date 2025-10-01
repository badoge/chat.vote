<script>
  import Navbar from "$lib/Navbar.svelte";
</script>

<svelte:head><title>chat.vote - Privacy Policy</title></svelte:head>

<Navbar />

<div class="flex justify-center m-5">
  <article class="prose">
    <h1>Privacy Policy</h1>
    <p>All user data gets stored locally on the user's device only.</p>
    <p>Your channel name gets logged when you use the site; the data is not shared with anyone.</p>
    <h2>3rd Party Privacy Policies</h2>

    <ul>
      <li><a target="_blank" rel="noopener noreferrer" href="https://www.twitch.tv/p/en/legal/privacy-notice/">Twitch</a></li>
      <li><a target="_blank" rel="noopener noreferrer" href="https://www.cloudflare.com/privacypolicy/">Cloudflare</a></li>
      <li><a target="_blank" rel="noopener noreferrer" href="https://policies.google.com/privacy">Google & YouTube</a></li>
      <li><a target="_blank" rel="noopener noreferrer" href="https://braize.pajlada.com/chatterino/legal/privacy-policy">Chatterino API</a></li>
    </ul>

    <p>Contact email: <a href="mailto:help@chat.vote">help@chat.vote</a></p>
  </article>
</div>
