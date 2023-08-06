/*jshint esversion: 6 */

let cid = "qn0wimnszbqlwfnszdz3wwfz430eqr";
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
      clientId: cid,
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
