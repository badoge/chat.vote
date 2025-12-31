<script>
  import { onMount } from "svelte";

  import { createDraggable } from "animejs";
  let { children, name, location, size } = $props();

  const minWidth = 150;
  const minHeight = 100;

  let box = $state({
    width: size.width,
    height: size.height,
    x: location.x,
    y: location.y,
    z: 5,
  });

  /**
   * @type {{ startX: any; startY: any; startBox: any; dir: any; } | null}
   */
  let resizing = null;

  /**
   * @param {PointerEvent & { currentTarget: EventTarget & HTMLDivElement; }} e
   * @param {string} dir
   */
  function startResize(e, dir) {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    resizing = {
      dir,
      startX: e.clientX,
      startY: e.clientY,
      startBox: { ...box },
    };
    window.addEventListener("pointermove", resize);
    window.addEventListener("pointerup", stopResize);
  }

  /**
   * @param {{ clientX: number; clientY: number; }} e
   */
  function resize(e) {
    if (!resizing) return;

    const dx = e.clientX - resizing.startX;
    const dy = e.clientY - resizing.startY;

    let { width, height, x, y } = resizing.startBox;

    if (resizing.dir.includes("e")) {
      width = Math.max(minWidth, width + dx);
    }

    if (resizing.dir.includes("s")) {
      height = Math.max(minHeight, height + dy);
    }

    if (resizing.dir.includes("w")) {
      const newWidth = Math.max(minWidth, width - dx);
      x += width - newWidth;
      width = newWidth;
    }

    if (resizing.dir.includes("n")) {
      const newHeight = Math.max(minHeight, height - dy);
      y += height - newHeight;
      height = newHeight;
    }

    box = { ...box, width, height, x, y };
    console.log($state.snapshot(box));
  }

  function stopResize() {
    resizing = null;
    window.removeEventListener("pointermove", resize);
    window.removeEventListener("pointerup", stopResize);
  }

  let dragWindow = $state();
  let dragHeader = $state();

  onMount(() => {
    if (dragWindow && dragHeader) {
      createDraggable(dragWindow, {
        trigger: dragHeader,
        container: "body",
        containerPadding: [64, 0, 32, 0],
        onSettle: () => {
          let style = getComputedStyle(dragWindow);
          let matrix = new WebKitCSSMatrix(style.transform);
          let x = matrix.m41;
          let y = matrix.m42;
          let z = parseInt(style.zIndex, 10);
          box = { ...box, x, y, z };
        },
      });
    }
  });
</script>

<div
  bind:this={dragWindow}
  class="window"
  style="
    width: {box.width}px;
    height: {box.height}px;
    transform: translateX({box.x}px) translateY({box.y}px);
    z-index: {box.z}
  "
>
  <div class="window-header-bg"></div>
  <header class="window-header" bind:this={dragHeader}>
    <img
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA8UlEQVR42pWSsQ2DMBBFrYiNbhZqqngFWlfs4G0YwHVWQKIKZZTC8b/kHHMYSCx9YYHf88dgTDH6vo/DMJzG7A0Izob3PrZtG48Fz/tuIMC1KtECYwOnFAAkohylcBkqYbIxLsvC8xACt8BmqoWLNj3waQHRO4ljicC4zvOcJYXApRtY7leVITHhKwGMTNONJVnA7x48V9WvICnhlQBwSLtTWiQCaSDVAWIOcNOg6zqub+jdABnHkcNnwVK/38A58zk0m4EyGq6eAcDL9RGbpuEAktTgjUAk8iPpz6bhqkC+huxYAho+FODBr6kKcPOfvACzZogqWb89XgAAAABJRU5ErkJggg=="
      alt="Internet Explorer"
      class="header-icon"
      draggable="false"
    />
    <div class="header-title">{name}</div>
    <div class="header-buttons">
      <button class="header-minimize" title="minimize"></button>
      <button class="header-maximize" title="maximize"></button>
      <button class="header-close" title="close"></button>
    </div>
  </header>
  <div class="window-content">
    <div class="window-stuff">
      {@render children?.()}
    </div>
  </div>

  <div class="handle n" onpointerdown={(e) => startResize(e, "n")}></div>
  <div class="handle s" onpointerdown={(e) => startResize(e, "s")}></div>
  <div class="handle e" onpointerdown={(e) => startResize(e, "e")}></div>
  <div class="handle w" onpointerdown={(e) => startResize(e, "w")}></div>

  <div class="handle ne" onpointerdown={(e) => startResize(e, "ne")}></div>
  <div class="handle nw" onpointerdown={(e) => startResize(e, "nw")}></div>
  <div class="handle se" onpointerdown={(e) => startResize(e, "se")}></div>
  <div class="handle sw" onpointerdown={(e) => startResize(e, "sw")}></div>
</div>

<style>
  .handle {
    position: absolute;
    background: transparent;
  }
  .handle.n {
    top: -4px;
    left: 0;
    right: 0;
    height: 8px;
    cursor: ns-resize;
  }
  .handle.s {
    bottom: -4px;
    left: 0;
    right: 0;
    height: 8px;
    cursor: ns-resize;
  }
  .handle.e {
    right: -4px;
    top: 0;
    bottom: 0;
    width: 8px;
    cursor: ew-resize;
  }
  .handle.w {
    left: -4px;
    top: 0;
    bottom: 0;
    width: 8px;
    cursor: ew-resize;
  }
  .handle.ne {
    top: -4px;
    right: -4px;
    width: 12px;
    height: 12px;
    cursor: nesw-resize;
  }
  .handle.nw {
    top: -4px;
    left: -4px;
    width: 12px;
    height: 12px;
    cursor: nwse-resize;
  }
  .handle.se {
    bottom: -4px;
    right: -4px;
    width: 12px;
    height: 12px;
    cursor: nwse-resize;
  }
  .handle.sw {
    bottom: -4px;
    left: -4px;
    width: 12px;
    height: 12px;
    cursor: nesw-resize;
  }
  .window {
    width: 700px;
    height: 500px;
    display: flex;
    position: absolute;
    padding: 3px;
    background-color: rgb(8, 49, 217);
    flex-direction: column;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  .window-content {
    flex: 1 1 0%;
    position: relative;
    margin-top: 25px;
    height: calc(100% - 25px);
  }

  .window-stuff {
    height: 100%;
    width: 100%;
    position: absolute;
    display: flex;
    overflow: hidden;
    flex-direction: column;
    background: linear-gradient(to right, rgb(237, 237, 229) 0%, rgb(237, 232, 205) 100%);
  }

  .window-header-bg {
    user-select: none;
    background: linear-gradient(
      rgb(0, 88, 238) 0%,
      rgb(53, 147, 255) 4%,
      rgb(40, 142, 255) 6%,
      rgb(18, 125, 255) 8%,
      rgb(3, 111, 252) 10%,
      rgb(2, 98, 238) 14%,
      rgb(0, 87, 229) 20%,
      rgb(0, 84, 227) 24%,
      rgb(0, 85, 235) 56%,
      rgb(0, 91, 245) 66%,
      rgb(2, 106, 254) 76%,
      rgb(0, 98, 239) 86%,
      rgb(0, 82, 214) 92%,
      rgb(0, 64, 171) 94%,
      rgb(0, 48, 146) 100%
    );
    position: absolute;
    left: 0px;
    top: 0px;
    right: 0px;
    height: 28px;
    pointer-events: none;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    overflow: hidden;
  }

  .window-header {
    user-select: none;
    display: flex;
    height: 25px;
    line-height: 25px;
    font-weight: 700;
    font-size: 12px;
    font-family: "Noto Sans";
    text-shadow: rgb(0, 0, 0) 1px 1px;
    color: white;
    position: absolute;
    left: 3px;
    right: 3px;
    -webkit-box-align: center;
    align-items: center;
  }

  .header-icon {
    width: 15px;
    height: 15px;
    margin-left: 1px;
    margin-right: 3px;
  }

  .header-title {
    flex: 1 1 0%;
    pointer-events: none;
    padding-right: 5px;
    letter-spacing: 0.5px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .header-buttons {
    opacity: 1;
    height: 22px;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    margin-top: -1px;
    margin-right: 1px;
  }

  .header-buttons > button {
    margin-right: 1px;
    position: relative;
    width: 22px;
    height: 22px;
    border: 1px solid rgb(255, 255, 255);
    border-radius: 3px;
  }

  .header-buttons > button:hover {
    filter: brightness(120%);
  }

  .header-buttons > button:active {
    filter: brightness(90%);
  }

  .header-minimize {
    box-shadow: rgb(70, 70, 255) 0px -1px 2px 1px inset;
    background-image: radial-gradient(circle at 90% 90%, rgb(0, 84, 233) 0%, rgb(34, 99, 213) 55%, rgb(68, 121, 228) 70%, rgb(163, 187, 236) 90%, white 100%);
  }

  .header-minimize::before {
    content: "";
    position: absolute;
    left: 4px;
    top: 13px;
    height: 3px;
    width: 8px;
    background-color: white;
  }

  .header-maximize {
    box-shadow: rgb(70, 70, 255) 0px -1px 2px 1px inset;
    background-image: radial-gradient(circle at 90% 90%, rgb(0, 84, 233) 0%, rgb(34, 99, 213) 55%, rgb(68, 121, 228) 70%, rgb(163, 187, 236) 90%, white 100%);
  }

  .header-maximize::before {
    content: "";
    position: absolute;
    display: block;
    left: 4px;
    top: 4px;
    box-shadow:
      white 0px 3px inset,
      white 0px 0px 0px 1px inset;
    height: 12px;
    width: 12px;
  }

  .header-close {
    box-shadow: rgb(218, 70, 0) 0px -1px 2px 1px inset;
    background-image: radial-gradient(circle at 90% 90%, rgb(204, 70, 0) 0%, rgb(220, 101, 39) 55%, rgb(205, 117, 70) 70%, rgb(255, 204, 178) 90%, white 100%);
  }

  .header-close::before {
    content: "";
    position: absolute;
    left: 9px;
    top: 2px;
    transform: rotate(45deg);
    height: 16px;
    width: 2px;
    background-color: white;
  }

  .header-close::after {
    content: "";
    position: absolute;
    left: 9px;
    top: 2px;
    transform: rotate(-45deg);
    height: 16px;
    width: 2px;
    background-color: white;
  }
</style>
