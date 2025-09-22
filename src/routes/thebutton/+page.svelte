<svelte:head>
  <title>chat.vote - The Button</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="chat.vote - The Button" />
  <meta name="keywords" content="chatvote, chat.vote" />
  <meta property="og:title" content="chat.vote - The Button" />
  <meta property="og:site_name" content="chat.vote - The Button" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chat.vote/thebutton/" />
  <meta property="og:image" content="https://chat.vote/pics/ogimage.png" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:description" content="chat.vote - The Button" /></svelte:head
>

<div class="container-fluid">
  <div class="row" id="mainrow">
    <div class="col-lg-3" id="tableOfContents">
      <nav id="navbar" class="h-100 flex-column align-items-stretch pe-4">
        <nav class="nav nav-pills flex-column">
          <a class="nav-link" href="#intro">Introduction</a>
          <a class="nav-link" href="#guide">Walkthrough Guide</a>
          <a class="nav-link" href="#changelog">Change Log</a>
          <a class="nav-link" href="#notes">Notes</a>
        </nav>
      </nav>
    </div>

    <div class="col-lg-9" id="maincol" data-bs-spy="scroll" data-bs-target="#navbar" data-bs-smooth-scroll="true" tabindex="0">
      <div id="intro">
        <h4>Introduction</h4>
        <p><img src="/pics/donk.png" alt="logo" style="height: 24px; width: 24px" class="d-inline-block align-top" /> page not complete yet</p>
        <p><a target="_blank" rel="noopener noreferrer" href="https://dashboard.twitch.tv/extensions/tnz66wqypoj6c3qjqot1lth8gcos0u">Extension link</a></p>
      </div>

      <div id="guide">
        <h4>Walkthrough Guide</h4>
        <p>1. Install the <a target="_blank" rel="noopener noreferrer" href="https://dashboard.twitch.tv/extensions/tnz66wqypoj6c3qjqot1lth8gcos0u">extension</a> and activate it</p>
        <p>2. Configure the extension</p>
        <p>3. Open the extension and click on start to start the timer/counter for all viewers</p>
        <p>4. Button will get enabled and viewers will be able to click the button to reset the timer or increment the counter</p>
        <p>5. Button will get disabled once the timer ends or when the counter limit is reached</p>
        <br />
        <br />
        <p>config page can be used to change the mode and adjust the timer length/number of clicks/counter limit</p>
        <p>settings will apply only when you click the reset button in the extension's streamer controls</p>
        <p>logged out/unlinked viewers will not be able to click the button by default</p>
        <p>customization config allows you to change the appearance of the extension and the changes will apply when you save</p>
      </div>

      <div id="changelog">
        <h4>Change Log</h4>

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
      </div>

      <div id="notes">
        <h4>Notes</h4>
        <p>Small issue with timer mode: you need to keep the extension open as a streamer so that it can detect when the timer runs out and disable the button.</p>
      </div>
    </div>
  </div>
</div>

<style>
  #maincol {
    height: 90vh;
    overflow-y: scroll;
  }

  #tableOfContents {
    margin-bottom: 12px;
  }

  #mainrow {
    margin-top: 10px;
  }
</style>
