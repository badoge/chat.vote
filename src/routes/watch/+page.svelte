<script>
  let client;
  let modal1;
  let modal2;
  let modal3;
  let player;
  let chat;
  let done = false;
  let latency = 0;
  let pausetime;
  let input = new URLSearchParams(window.location.search);
  let channel = input.get("c");
  let video = input.get("v");
  let time = parseInt(input.get("t"));
  let secs = Math.floor(Date.now() / 1000 - time);

  let elements = {
    toastContainer: document.getElementById("toastContainer"),
  };

  function connect() {
    let options = {
      options: {
        clientId: CLIENT_ID,
        debug: false,
      },
      connection: {
        secure: true,
        reconnect: true,
      },
      channels: [channel],
    };
    client = new tmi.client(options);
    client.on("message", onMessageHandler);
    client.on("connected", onConnectedHandler);
    client.connect().catch(console.error);

    function onMessageHandler(target, context, msg, self) {
      if (!msg.startsWith("=")) {
        return;
      }
      let input = msg.replace("=", "").split(" ").filter(Boolean);
      let args = input.slice(1);
      let command = input[0].toLowerCase();
      let sec = 0;

      if (command == "pause" && context.username == channel) {
        player.pauseVideo();
        pausetime = Math.floor(Date.now() / 1000);
        return;
      }

      if (command == "play" && context.username == channel) {
        player.playVideo();
        time += Math.floor(Date.now() / 1000) - pausetime;
        return;
      }

      if (command == "rewind" && context.username == channel) {
        if (args[0] == null) {
          sec = 5;
        } else {
          sec = parseInt(args[0]);
        }
        time += sec;
        sync();
        return;
      }

      if (command == "skip" && context.username == channel) {
        if (args[0] == null) {
          sec = 5;
        } else {
          sec = parseInt(args[0]);
        }
        time -= sec;
        sync();
        return;
      }
    } //onMessageHandler

    async function onConnectedHandler(addr, port) {
      console.log(`Connected to ${addr}:${port}`);
    } //onConnectedHandler
  } //connect

  function sync() {
    if (chat.isPaused()) {
      modal3.show();
      return;
    }
    if (localStorage.getItem("channel") == null || localStorage.getItem("channel") != channel) {
      latency = parseInt(Math.ceil(chat.getPlaybackStats().hlsLatencyBroadcaster));
    }
    let newtime = Math.floor(Date.now() / 1000 - time) - latency;
    player.seekTo(newtime, true);
  }

  function embedchat() {
    chat = new Twitch.Embed("twitch-embed", {
      width: "100%",
      height: "100%",
      channel: channel,
      allowfullscreen: "false",
      parent: ["chat.vote"],
    });
  }

  function embedvideo() {
    let tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  function onYouTubeIframeAPIReady() {
    player = new YT.Player("player", {
      height: "100%",
      width: "100%",
      videoId: video,
      playerVars: {
        playsinline: 1,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  }

  function onPlayerReady(event) {
    event.target.playVideo();
  }

  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
      event.target.seekTo(secs, true);
      done = true;
    }
  }

  function copyToClipboard() {
    let text = document.getElementById("roomurl");
    text.select();
    text.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(text.value);
  }

  function getvidid(url) {
    let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    let match = url.match(regExp);
    return match && match[7].length == 11 ? match[7] : false;
  }

  function getlink() {
    let c = document.getElementById("channelname").value.replace(/\s+/g, "").toLowerCase();
    let v = document.getElementById("videolink").value;

    if (!c) {
      showToast("No Twitch channel provided", "warning", 3000);
      return;
    }

    if (!v) {
      showToast("No YouTube video provided", "warning", 3000);
      return;
    }

    let url = "https://chat.vote/watch/?";
    url += "c=" + c;
    let id = getvidid(v);
    url += "&v=" + id;
    let time = Math.floor(Date.now() / 1000) + 10;
    url += "&t=" + time;
    document.getElementById("modal1body").innerHTML = `
  <h5>Here is your room URL, Share it with your viewers :)</h5>
  <div class="input-group mb-3">
  <input type="text" id="roomurl" class="form-control" value=${url} aria-label="Room URL">
  <button class="btn btn-outline-secondary" type="button" onclick="copyToClipboard()"><i class="material-icons notranslate">content_copy</i></button>
  </div>
  <div id="countdown">
  <h6>Watch party starts in:<h6>
  <div class="values text-warning"></div>
  </div>`;
    let timer = new easytimer.Timer();
    timer.start({ countdown: true, startValues: { seconds: 10 } });
    document.querySelector("#countdown .values").innerHTML = timer.getTimeValues().toString();
    timer.addEventListener("secondsUpdated", function (e) {
      document.querySelector("#countdown .values").innerHTML = timer.getTimeValues().toString();
    });
    timer.addEventListener("targetAchieved", function (e) {
      window.location.replace(url);
    });
  }

  window.onload = function () {
    modal1 = new bootstrap.Modal(document.getElementById("modal1"));
    modal2 = new bootstrap.Modal(document.getElementById("modal2"));
    modal3 = new bootstrap.Modal(document.getElementById("modal3"));

    if (localStorage.getItem("channel") != null) {
      document.getElementById("channelname").value = localStorage.getItem("channel");
    }

    if (input == null || channel == null || video == null) {
      modal1.show();
    } else {
      embedvideo();
      embedchat();
      connect();
    }
  };
</script>

<svelte:head>
  <title>chat.vote/watch</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="chatvote scuffed watch parties" />
  <meta name="keywords" content="twitch, chat, poll, chatvote, chat.vote" />
  <meta property="og:title" content="chat.vote/watch" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chat.vote/watch/" />
  <meta property="og:image" content="https://chat.vote/pics/ogimage.png" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:description" content="chatvote scuffed watch parties" /></svelte:head
>

<div class="modal fade" id="modal1" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Start a watch party</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="modal1body">
        <label class="form-label" id="channeldesc" for="channelname">Twitch Channel:</label>
        <div class="input-group mb-3">
          <span class="input-group-text">twitch.tv/</span>
          <input type="text" class="form-control" id="channelname" aria-describedby="channeldesc" />
        </div>

        <label id="vidlinkdesc" class="form-label" for="videolink">YouTube video:</label>
        <div class="input-group mb-3">
          <input type="text" class="form-control" placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" id="videolink" aria-describedby="vidlinkdesc" />
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" onclick="getlink()" class="btn btn-success">Start</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="modal2" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">
          Playback controls
          <span class="text-warning">(streamer only)</span>
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="modal2body">
        <h5>Type these commands in your chat to control video playback for all viewers.</h5>
        <div class="input-group mb-3">
          <label class="input-group-text" for="pausebtn">Pause the video for all viewers:</label>
          <label class="input-group-text" for="pausebtn">=pause</label>
          <button type="button" id="pausebtn" class="btn btn-outline-secondary" data-clipboard-text="=pause"><i class="material-icons notranslate">content_copy</i></button>
        </div>

        <div class="input-group mb-3">
          <label class="input-group-text" for="playbtn">Play the video after pausing:</label>
          <label class="input-group-text" for="playbtn">=play</label>
          <button type="button" id="playbtn" class="btn btn-outline-secondary" data-clipboard-text="=play"><i class="material-icons notranslate">content_copy</i></button>
        </div>

        <div class="input-group mb-3">
          <label class="input-group-text" for="rewindbtn">Rewind (default 5 seconds):</label>
          <label class="input-group-text" for="rewindbtn">=rewind</label>
          <button type="button" id="rewindbtn" class="btn btn-outline-secondary" data-clipboard-text="=rewind"><i class="material-icons notranslate">content_copy</i></button>
        </div>

        <div class="input-group mb-3">
          <label class="input-group-text" for="skipbtn">Skip (default 5 seconds):</label>
          <label class="input-group-text" for="skipbtn">=skip</label>
          <button type="button" id="skipbtn" class="btn btn-outline-secondary" data-clipboard-text="=skip"><i class="material-icons notranslate">content_copy</i></button>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" data-bs-dismiss="modal" class="btn btn-primary">OK</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="modal3" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Stream paused</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>You need to unpause the Twitch stream top right so that we can measure your stream latency to accurately sync your video, you can pause the stream again after syncing.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="">OK</button>
      </div>
    </div>
  </div>
</div>

<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#" style="font-size: 1em"> <img src="/pics/donk.png" alt="" height="16" class="d-inline-block align-top" /> chat.vote watch parties </a>

    <div class="d-flex">
      <button type="button" class="btn btn-primary p-0 topright" data-bs-toggle="modal" data-bs-target="#modal2">
        <i class="material-icons notranslate">play_arrow</i><i class="material-icons notranslate">pause</i>Controls
      </button>
      <button type="button" class="btn btn-success p-0 topright" onclick="sync()">
        <span style="display: block"><i class="material-icons notranslate">sync</i>Sync</span>
      </button>
    </div>
  </div>
</nav>

<div class="container-fluid">
  <div class="row">
    <div class="col-lg-10 vid p-0">
      <div id="player"></div>
    </div>
    <div class="col-lg-2 chat p-0">
      <div id="twitch-embed"></div>
    </div>
  </div>
</div>

<div aria-live="polite" aria-atomic="true" class="position-relative">
  <div id="toastContainer" class="toast-container"></div>
</div>

<style>
  html,
  body,
  .container-fluid {
    height: 100%;
  }

  .container-fluid {
    width: 100%;
    overflow: hidden;
  }

  #toastContainer {
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 1056;
    font-weight: bold;
  }

  #toastContainer > div > div {
    font-size: 1.5em;
  }

  .row {
    height: 100%;
  }

  #twitch-embed {
    height: 100%;
  }

  .vid {
    width: 82.3%;
  }

  .chat {
    width: 17.7%;
  }

  .topright {
    margin-right: 5px;
  }

  #modal2body > * > * {
    color: white;
  }
</style>
