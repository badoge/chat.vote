<script>
  let peerConnection;
  let dataChannel;
  let overlayID;

  async function createOffer() {
    console.log("creating offer");
    try {
      peerConnection = new RTCPeerConnection();

      peerConnection.onicecandidate = (event) => {
        if (event.candidate != null) {
          console.log("new ice candidate");
        } else {
          console.log("last ice candidate");
          let offer = peerConnection.localDescription;
          postOffer(offer);
        }
      };

      peerConnection.onconnectionstatechange = (event) => {
        console.log("onconnectionstatechange");
        console.log(event);

        switch (event.currentTarget.connectionState) {
          case "connecting":
            setTimeout(() => {
              getAnswer();
            }, 1000);
            break;

          case "failed":
            setTimeout(() => {
              createOffer();
            }, 1000);
            break;

          default:
            break;
        }
      };

      peerConnection.oniceconnectionstatechange = (event) => {
        console.log("ice connection state: " + event.currentTarget.connectionState);
      };

      dataChannel = peerConnection.createDataChannel("overlay");

      dataChannel.onopen = (event) => {
        console.log("datachannel open");
      };

      dataChannel.onmessage = (event) => {
        console.log("datachannel message");
        console.log(event);
        let data = JSON.parse(event.data);

        if (Object.hasOwn(data, "axis")) {
          if (data.axis == "x") {
            document.getElementById("donk").style.left = data.value + "%";
          }
          if (data.axis == "y") {
            document.getElementById("donk").style.top = data.value + "%";
          }
        }
      };
    } catch (error) {
      console.log(error);
    }

    try {
      let offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
    } catch (error) {
      console.log(error);
    }
  } //createOffer

  async function postOffer(offer) {
    let body = JSON.stringify({ offer: offer });
    let requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: body,
    };
    try {
      let response = await fetch(`https://overlay.donk.workers.dev/offer/${overlayID}`, requestOptions);
      let result = await response.json();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  } //postOffer

  async function getAnswer() {
    let requestOptions = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    try {
      let response = await fetch(`https://overlay.donk.workers.dev/${overlayID}/answer`, requestOptions);
      let result = await response.json();
      console.log(result);
      await peerConnection.setRemoteDescription(JSON.parse(result.data.answer));
    } catch (error) {
      console.log(error);
    }
  } //getAnswer

  window.onload = function () {
    overlayID = location.hash?.replace("#", "")?.trim();

    if (overlayID?.length == 64) {
      createOffer();
    }
  }; //onload
</script>

<img src="/pics/donk.png" alt="donk" id="donk" style="left: 50%; top: 50%; position: fixed" />
