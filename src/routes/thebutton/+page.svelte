<script>
  import Navbar from "$lib/Navbar.svelte";
  import MdiTwitch from "~icons/mdi/twitch";
</script>

<svelte:head>
  <title>chat.vote - The Button</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="chat.vote - The Button" />
  <meta name="keywords" content="chatvote, chat.vote" />
  <meta property="og:title" content="chat.vote - The Button" />
  <meta property="og:site_name" content="chat.vote - The Button" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chat.vote/thebutton" />
  <meta property="og:image" content="https://chat.vote/pics/ogimage.png" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:description" content="chat.vote - The Button" />
</svelte:head>

<Navbar />

<div class="flex justify-center m-5">
  <article class="prose">
    <h2>Introduction</h2>
    <p>This is a simple Twitch extension that allows viewers to click some button to increment or decrement a counter, or keep some timer going by resetting it before it runs out.</p>
    <p>Based on <a href="https://en.wikipedia.org/wiki/The_Button_(Reddit)" target="_blank" rel="noopener noreferrer">The Button Reddit experiment</a></p>
    <MdiTwitch class="inline" /><a target="_blank" rel="noopener noreferrer" href="https://dashboard.twitch.tv/extensions/tnz66wqypoj6c3qjqot1lth8gcos0u">Extension link</a><br />
    <small class="opacity-50">No longer in development, but it should still work</small>

    <h3>Walkthrough Guide</h3>
    <p>1. Install the <a target="_blank" rel="noopener noreferrer" href="https://dashboard.twitch.tv/extensions/tnz66wqypoj6c3qjqot1lth8gcos0u">extension</a> and activate it</p>
    <p>2. Configure the extension</p>
    <p>3. Open the extension and click on start to start the timer/counter for all viewers</p>
    <p>4. Button will get enabled and viewers will be able to click the button to reset the timer or increment the counter</p>
    <p>5. Button will get disabled once the timer ends or when the counter limit is reached</p>
    <br />
    <p>config page can be used to change the mode and adjust the timer length/number of clicks/counter limit</p>
    <p>settings will apply only when you click the reset button in the extension's streamer controls</p>
    <p>logged out/unlinked viewers will not be able to click the button by default</p>
    <p>customization config allows you to change the appearance of the extension and the changes will apply when you save</p>

    <h3>Change Log</h3>
    <ul class="list-unstyled">
      <li>
        0.3.0
        <ul>
          <li>Updated UI</li>
          <li>Removed Bits settings</li>
          <li>Fixed extension not working because of backend URL change :)</li>
        </ul>
      </li>
      <li>
        0.2.0
        <ul>
          <li>Added new counter mode</li>
          <li>Added an option to allow viewers to click the button multiple times</li>
          <li>Added an option to allow logged out/unlinked viewers to click the button</li>
          <li>Added button stats and user stats in the bottom right corner of the extension</li>
        </ul>
      </li>
    </ul>

    <h3>Notes</h3>
    <p>Small issue with timer mode: you need to keep the extension open as a streamer so that it can detect when the timer runs out and disable the button.</p>
  </article>
</div>
