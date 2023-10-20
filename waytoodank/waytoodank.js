/*jshint esversion: 9 */

const obs = new OBSWebSocket();

let fft;
let w;
let mic;
let red, green, blue, hue, sat;
let myp5;
let sketch;

let elements = {
  connect: document.getElementById("connect"),
  serverIP: document.getElementById("serverIP"),
  serverPort: document.getElementById("serverPort"),
  serverPassword: document.getElementById("serverPassword"),
  scene: document.getElementById("scene"),
  source: document.getElementById("source"),
  smoothingslider: document.getElementById("smoothingslider"),
  redslider: document.getElementById("redslider"),
  greenslider: document.getElementById("greenslider"),
  blueslider: document.getElementById("blueslider"),
  hueslider: document.getElementById("hueslider"),
  satslider: document.getElementById("satslider"),
  smoothingvalue: document.getElementById("smoothingvalue"),
  visualizer: document.getElementById("visualizer"),
  toastContainer: document.getElementById("toastContainer"),
};

let WAYTOODANK = {
  serverIP: "localhost",
  serverPort: "4455",
  serverPassword: "",
  scene: "",
  source: "",
  smoothing: 0.8,
};

function load_localStorage() {
  if (!localStorage.getItem("WAYTOODANK")) {
    console.log("localStorage settings not found");
  } else {
    WAYTOODANK = JSON.parse(localStorage.getItem("WAYTOODANK"));
    elements.serverIP.value = WAYTOODANK.serverIP || "localhost";
    elements.serverPort.value = WAYTOODANK.serverPort || "4455";
    elements.serverPassword.value = WAYTOODANK.serverPassword || "";
    elements.scene.value = WAYTOODANK.scene || "";
    elements.source.value = WAYTOODANK.source || "";
    elements.smoothingslider.value = parseFloat(WAYTOODANK.smoothing) || 0.8;
    elements.smoothingvalue.innerText = `Smoothing: ${WAYTOODANK.smoothing}` || "Smoothing: 0.8";
  }
} //load_localStorage

function saveSettings() {
  refreshData();
  localStorage.setItem("WAYTOODANK", JSON.stringify(WAYTOODANK));
} //saveSettings

function refreshData() {
  WAYTOODANK.serverIP = elements.serverIP.value.replace(/\s+/g, "");
  WAYTOODANK.serverPort = elements.serverPort.value.replace(/\s+/g, "");
  WAYTOODANK.serverPassword = elements.serverPassword.value;
  WAYTOODANK.scene = elements.scene.value;
  WAYTOODANK.source = elements.source.value;
  WAYTOODANK.smoothing = parseFloat(elements.smoothingslider.value);
} //refreshData

function startP5() {
  sketch = function (p) {
    let canvasDiv = elements.visualizer;
    let width = canvasDiv.offsetWidth;
    let height = canvasDiv.offsetHeight;
    p.setup = function () {
      p.createCanvas(width, height).parent("visualizer");
      p.colorMode(p.HSB);
      p.angleMode(p.DEGREES);
      mic = new p5.AudioIn();
      mic.start();
      fft = new p5.FFT(WAYTOODANK.smoothing, 128);
      fft.setInput(mic);
      w = width / 128;
    }; //p5 setup

    p.draw = function () {
      p.background(0);
      let spectrum = fft.analyze();

      try {
        obs.call("SetSourceFilterSettings", {
          sourceName: WAYTOODANK.source,
          filterName: "Color Grading",
          filterSettings: {
            "Filter.ColorGrade.Gamma.Red": (spectrum[red] / 256) * 1000,
            "Filter.ColorGrade.Gamma.Green": (spectrum[green] / 256) * 1000,
            "Filter.ColorGrade.Gamma.Blue": (spectrum[blue] / 256) * 1000,
            "Filter.ColorGrade.Correction.Hue": (spectrum[hue] / 256) * 180,
            "Filter.ColorGrade.Correction.Saturation": (spectrum[sat] / 256) * 1000,
          },
        });
      } catch (error) {}

      for (let i = 0; i < spectrum.length; i++) {
        let amp = spectrum[i];
        let y = p.map(amp, 0, 256, height, 0);
        p.fill(i, 255, 255);
        p.rect(i * w, y, w - 2, height - y);
      }
    }; //p5 draw

    // p.windowResized = function() {
    //     let canvasDiv = elements.visualizer;
    //     let width = canvasDiv.offsetWidth;
    //     let height = canvasDiv.offsetHeight;
    //     p.resizeCanvas(width, height > 500 ? 500 : height).parent("visualizer");
    // }
  };
} //startP5

async function connectOBS() {
  let url = "";
  if (!/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(WAYTOODANK.serverIP) && WAYTOODANK.serverIP != "localhost") {
    showToast("Invalid server IP", "danger", 3000);
    return;
  }
  url = `ws://${WAYTOODANK.serverIP}:${WAYTOODANK.serverPort}`;

  try {
    await obs.connect(url, WAYTOODANK.serverPassword);
    console.log(`OBS connected`);
    startP5();

    myp5 = new p5(sketch);

    // obs.on("error", err => {
    //     console.error("socket error:", err);
    // });

    // obs.send("GetSourceFilterInfo", {
    //     "sourceName": item,
    //     "filterName": "Color Grading"
    // }).then((res) => { console.log(res) }).catch((error) => { console.log(error.description) });

    // obs.send("SetSceneItemProperties", {
    //     "scene-name": scenename,
    //     "item": item,
    //     "rotation": 0,
    // }).then((res) => { console.log(res) });

    // obs.send("SetSceneItemProperties", {
    //     "scene-name": scenename,
    //     "item": item,
    //     "scale": { "x": 1, "y": 1 }

    // }).then((res) => { console.log(res) });

    // obs.send("SetSceneItemProperties", {
    //     "scene-name": scenename,
    //     "item": item,
    //     "rotation": 0,
    // }).then((res) => { console.log(res) });

    // obs.send("SetSourceFilterSettings", {
    //     "sourceName": item,
    //     "filterName": "Color Grading",
    //     "filterSettings": {
    //         "Filter.ColorGrade.Correction.Contrast": 100,
    //         "Filter.ColorGrade.Correction.Hue": 0,
    //         "Filter.ColorGrade.Correction.Lightness": 100,
    //         "Filter.ColorGrade.Correction.Saturation": 100,
    //     }
    // }).then((res) => { console.log(res) });

    // obs.send("SetSceneItemProperties", {
    //     "scene-name": scenename,
    //     "item": item,
    //     "position.alignment": 0,
    //     "bounds.alignment": 0,
    //     "bounds.type": "OBS_BOUNDS_NONE",
    //     "bounds.x": 1,
    //     "bounds.y": 1,
    //     "crop": { "bottom": 0, "left": 0, "right": 0, "top": 0 },
    //     "height": 1080,
    //     "width": 1920,
    //     "position": { "alignment": 0, "x": 960, "y": 540 },
    //     "sourceHeight": 1080,
    //     "sourceWidth": 1920,
    // }).then((res) => { console.log(res) });

    // obs.send("SetSceneItemProperties", {
    //     "scene-name": scenename,
    //     "item": item,
    //     "rotation": Math.atan2(event.normy, event.normx) * 57.29
    // }).then((res) => { console.log(res) });

    // obs.send("SetSourceFilterSettings", {
    //     "sourceName": item,
    //     "filterName": "Color Grading",
    //     "filterSettings": {
    //         "Filter.ColorGrade.Correction.Contrast": 1000,
    //         "Filter.ColorGrade.Correction.Hue": event.normx * 180,
    //         "Filter.ColorGrade.Correction.Lightness": 1000,
    //         "Filter.ColorGrade.Correction.Saturation": Math.abs(event.normy) * 1000,
    //     }
    // }).then((res) => { console.log(res) });

    // obs.send("SetSceneItemProperties", {
    //     "scene-name": scenename,
    //     "item": item,
    //     "rotation": Math.atan2(event.normy, event.normx) * 57.29
    // }).then((res) => { console.log(res) });

    // obs.send("SetSceneItemProperties", {
    //     "scene-name": scenename,
    //     "item": item,
    //     "scale": { "x": 255.0 / event.val, "y": 255.0 / event.val }
    // }).then((res) => { console.log(res) });

    // obs.send("SetSceneItemProperties", {
    //     "scene-name": scenename,
    //     "item": item,
    //     "scale": { "x": event.val / 255, "y": event.val / 255 }
    // }).then((res) => { console.log(res) });
  } catch (error) {
    console.log(error);
  }
} //connectOBS

window.onload = function () {
  load_localStorage();
  refreshData();

  elements.redslider.oninput = function () {
    red = this.value;
  };
  elements.greenslider.oninput = function () {
    green = this.value;
  };
  elements.blueslider.oninput = function () {
    blue = this.value;
  };
  elements.hueslider.oninput = function () {
    hue = this.value;
  };
  elements.satslider.oninput = function () {
    sat = this.value;
  };
  elements.smoothingslider.oninput = function () {
    elements.smoothingvalue.innerHTML = `Smoothing: ${this.value}`;
    WAYTOODANK.smoothing = this.value;
  };

  elements.connect.addEventListener("click", function () {
    saveSettings();
    connectOBS();
  });

  enableTooltips();

  let tag1 = document.createElement("script");
  let tag2 = document.createElement("script");
  tag1.src = "/js/p5.min.js";
  tag2.src = "/js/p5.sound.min.js";
  document.getElementsByTagName("head")[0].appendChild(tag1);
  setTimeout(() => {
    document.getElementsByTagName("head")[0].appendChild(tag2);
  }, 1000);
}; //window.onload
