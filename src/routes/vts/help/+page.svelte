<svelte:head>
  <title>chat.vote/vts Help</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="chat.vote/vts Help site" />
  <meta name="keywords" content="chatvote, chat.vote, VTubeStudio, Twitch, YouTube" />
  <meta property="og:title" content="chat.vote/vts Help" />
  <meta property="og:site_name" content="chat.vote/vts Help" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chat.vote/vts/help" />
  <meta property="og:image" content="https://chat.vote/pics/ogimage.png" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:description" content="chat.vote/vts Help site" />
</svelte:head>

<div class="container-fluid">
  <div class="row" id="mainrow">
    <div class="col-lg-3" id="tableOfContents">
      <nav id="navbar" class="h-100 flex-column align-items-stretch pe-4">
        <nav class="nav nav-pills flex-column">
          <a class="nav-link" href="#intro">Introduction</a>
          <a class="nav-link" href="#logging-in">Logging in</a>
          <nav class="nav nav-pills flex-column">
            <a class="nav-link ms-3 my-1" href="#logging-in-twitch">Twitch</a>
            <a class="nav-link ms-3 my-1" href="#logging-in-youtube">YouTube</a>
            <a class="nav-link ms-3 my-1" href="#logging-in-vtube-studio">VTube Studio</a>
          </nav>
          <a class="nav-link" href="#setting-up">Setting up</a>
          <nav class="nav nav-pills flex-column">
            <a class="nav-link ms-3 my-1" href="#setting-up-commands">Adding chat commands</a>
            <a class="nav-link ms-3 my-1" href="#setting-up-rewards">Adding rewards</a>
            <a class="nav-link ms-3 my-1" href="#setting-up-subs">Adding subscription alerts</a>
            <a class="nav-link ms-3 my-1" href="#setting-up-gifts">Adding gifted sub alerts</a>
            <a class="nav-link ms-3 my-1" href="#setting-up-bits">Adding bits alerts</a>
          </nav>
          <a class="nav-link" href="#hotkey-examples">Hotkey examples</a>
          <nav class="nav nav-pills flex-column">
            <a class="nav-link ms-3 my-1" href="#hotkey-examples-1">Example 1</a>
            <a class="nav-link ms-3 my-1" href="#hotkey-examples-2">Example 2</a>
            <a class="nav-link ms-3 my-1" href="#hotkey-examples-3">Example 3</a>
          </nav>
          <a class="nav-link" href="#notes">Notes</a>
        </nav>
      </nav>
    </div>

    <div class="col-lg-9" id="maincol" data-bs-spy="scroll" data-bs-target="#navbar" data-bs-smooth-scroll="true" tabindex="0">
      <div class="card text-bg-success mb-3">
        <h4 class="card-header">Announcement</h4>
        <div class="card-body">
          <p class="card-text">
            VTS added support for
            <a target="_blank" class="text-dark" rel="noopener noreferrer" href="https://github.com/DenchiSoft/VTubeStudio/wiki/Twitch-Hotkey-Triggers">
              <strong>chat commands and redeems.</strong>
            </a>
            All features present on this site are available directly in VTS. It is recommended that you migrate over to the built in Twitch integration. This site will continue to function normally
            but no new features will be added. Thanks for using this site all these years :)
          </p>
        </div>
      </div>

      <div id="intro">
        <h3>Introduction</h3>
        <p>This help page is not done yet :) contact me directly if you need help :)</p>
      </div>

      <div id="logging-in">
        <h3>Logging in</h3>
        <p>Before using the site you need to login with Twitch or YouTube and then connect the site with VTube Studio.</p>
      </div>

      <div id="logging-in-twitch">
        <h4>Twitch login</h4>

        <div class="ratio ratio-16x9">
          <video controls>
            <source src="/vts/vids/twitch-login.mp4" type="video/mp4" />
            Your browser does not support the video tag :(
          </video>
        </div>
      </div>

      <div id="logging-in-youtube">
        <h4>Youtube login</h4>
        <p>YouTube integration is still a work in progress, Let me know if you have any issues :)</p>
        <div class="ratio ratio-16x9">
          <video controls>
            <source src="/vts/vids/youtube-login.mp4" type="video/mp4" />
            Your browser does not support the video tag :(
          </video>
        </div>
        <br />
        <p>If you have more than 1 active/upcoming stream you will be prompted to select which stream to connect to.</p>
        <p>You can see which stream you're connected to at the top and you can switch to a different stream by clicking "Change"</p>
        <div class="ratio ratio-16x9">
          <video controls>
            <source src="/vts/vids/youtube-selector.mp4" type="video/mp4" />
            Your browser does not support the video tag :(
          </video>
        </div>
      </div>

      <div id="logging-in-vtube-studio">
        <h4>VTube Studio</h4>

        <div class="ratio ratio-16x9">
          <video controls>
            <source src="/vts/vids/vts-login.mp4" type="video/mp4" />
            Your browser does not support the video tag :(
          </video>
        </div>
      </div>

      <div id="setting-up">
        <h3>Setting up</h3>
        <p>
          <img src="/vts/pics/donk.png" alt="donk" />
        </p>
      </div>

      <div id="setting-up-commands">
        <h3>Adding chat commands</h3>
        <p>
          <img src="/vts/pics/donk.png" alt="donk" />
        </p>
      </div>

      <div id="setting-up-rewards">
        <h3>Adding rewards</h3>
        <p>
          <img src="/vts/pics/donk.png" alt="donk" />
        </p>
      </div>

      <div id="setting-up-subs">
        <h3>Adding subscription alerts</h3>
        <p>
          <img src="/vts/pics/donk.png" alt="donk" />
        </p>
      </div>

      <div id="setting-up-gifts">
        <h3>Adding gifted sub alerts</h3>
        <p>
          <img src="/vts/pics/donk.png" alt="donk" />
        </p>
      </div>

      <div id="setting-up-bits">
        <h3>Adding bits alerts</h3>
        <p>
          <img src="/vts/pics/donk.png" alt="donk" />
        </p>
      </div>

      <div id="hotkey-examples">
        <h3>Hotkey examples</h3>
        <p>
          <img src="/vts/pics/donk.png" alt="donk" />
        </p>
      </div>

      <div id="hotkey-examples-1">
        <h4>Example 1</h4>
        <p>
          <img src="/vts/pics/donk.png" alt="donk" />
        </p>
      </div>

      <div id="hotkey-examples-2">
        <h4>Example 2</h4>
        <p>
          <img src="/vts/pics/donk.png" alt="donk" />
        </p>
      </div>

      <div id="hotkey-examples-3">
        <h4>Example 3</h4>
        <p>
          <img src="/vts/pics/donk.png" alt="donk" />
        </p>
      </div>

      <div id="notes">
        <h3>Notes</h3>
        <p>
          <img src="/vts/pics/donk.png" alt="donk" />
        </p>
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

  .btn-vts {
    color: #ffffff;
    text-shadow: 2px 1px 3px #000000;
    background-color: #ffb0cd;
    border-color: #fca4c5;
  }

  .btn-vts:active,
  .btn-vts:focus,
  .btn-vts:hover {
    color: #ffffff;
    background-color: #ff9ac1;
    border-color: #ff9ac1;
  }

  .undervtsbtn {
    margin-top: 1rem;
    margin-bottom: 1rem;
    border: 0;
    border-top: 1px solid rgba(150, 147, 147, 0.3);
  }

  #connectvtsbtn {
    margin-right: 10px;
  }
</style>
