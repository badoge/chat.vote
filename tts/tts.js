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
