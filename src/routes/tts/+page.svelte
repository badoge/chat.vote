<script>
  let client;
  let synth;
  let username;
  synth = window.speechSynthesis;

  function connect() {
    username = document.getElementById("username").value;
    let options = {
      options: {
        clientId: CLIENT_ID,
        debug: false,
      },
      connection: {
        secure: true,
        reconnect: true,
      },
      channels: [username],
    };
    console.log(`tmi connection options: ${options}`);
    client = new tmi.client(options);
    client.on("message", onMessageHandler);
    client.on("timeout", onTimeoutHandler);
    client.on("connected", onConnectedHandler);
    client.on("disconnected", onDisconnectHandler);
    client.connect().catch(console.error);

    function onMessageHandler(target, context, msg, self) {
      let text = msg.trim();
      let text_s = escapeString(text);
      let text2 = text_s.substring(5);

      if (text_s.startsWith("!tts")) {
        speakMessage(text2);
      }
    } //onMessageHandler

    async function onConnectedHandler(addr, port) {
      console.log(`* Connected to ${addr}:${port}`);
      document.getElementById("status").innerHTML = `<h4><span class="badge bg-success">Connected to ${username} :)</span></h4>`;
    } //onConnectedHandler
    function onTimeoutHandler(channel, username, reason, duration, userstate) {} //onTimeoutHandler
    function onDisconnectHandler(reason) {
      console.log(reason);
    } //onDisconnectHandler
  } //connect

  function speakMessage(input) {
    let utterance = new SpeechSynthesisUtterance(input);

    synth.speak(utterance);
  }
</script>

<svelte:head>
  <title>chat.vote TTS</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="chat.vote TTS test site" />
  <meta name="keywords" content="twitch, chat, poll, chatvote, chat.vote, TTS" />
  <meta property="og:title" content="chat.vote TTS" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chat.vote/tts/" />
  <meta property="og:image" content="https://chat.vote/pics/ogimage.png" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:description" content="chat.vote TTS test site" /></svelte:head
>

<div class="container">
  <div class="card">
    <div class="card-body">
      super lidl early test <br />
      connect to your chat then type "!tts [message]" in chat
    </div>
  </div>

  <div class="input-group mt-3">
    <input type="text" id="username" class="form-control" placeholder="username" aria-label="username text" aria-describedby="usernamebtn" />
    <button class="btn btn-outline-primary" type="button" onclick={connect()} id="usernamebtn">connect</button>
  </div>
</div>
