<script>
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import tmi from "@tmi.js/chat";
  import { animate } from "animejs";
  import { fade } from "svelte/transition";

  let username = $state(page.params.username || "");
  let channels = [];

  /**
   * @type {import("@tmi.js/chat").Client}
   */
  let client;

  let hidden = $state(true);
  let active = $state(false);
  let score = $state(0);
  let votes = $state(0);
  let percent = $state(100);
  let previousPercent = 100;
  let hintVisible = $state(false);

  let voters = new Set();

  /**
   * @type {any}
   */
  let voteCounts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
  };

  onMount(async () => {
    connectChat();
  }); //onMount

  function disconnectChat() {
    client.close();
  } //disconnectChat

  function connectChat() {
    channels = [];
    channels.push(username);
    client = new tmi.Client({ channels: channels });

    client.connect();

    client.on("message", (event) => {
      const { channel, user, message } = event;

      try {
        //overlay channel streamer or overlay channel mods
        if (user.login == username || (channel.login == username && user.isMod)) {
          switch (message.text?.toLowerCase()) {
            case "!start":
              if (hidden) {
                return;
              }
              active = true;
              startInterval();
              showHint();
              break;
            case "!stop":
              if (hidden) {
                return;
              }
              active = false;
              stopInterval();
              showHint();
              break;
            case "!reset":
              if (hidden) {
                return;
              }
              active = false;
              voteCounts = {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0,
                10: 0,
              };
              score = 0;
              votes = 0;
              percent = 100;
              previousPercent = 100;
              voters = new Set();
              stopInterval();
              showHint();
              animate("#filler", {
                y: "0%",
                duration: 200,
              });
              break;
            case "!restart":
              if (hidden) {
                return;
              }
              active = true;
              voteCounts = {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0,
                10: 0,
              };
              score = 0;
              votes = 0;
              percent = 100;
              previousPercent = 100;
              voters = new Set();
              startInterval();
              showHint();
              break;
            case "!hide":
              hidden = true;
              active = false;
              stopInterval();
              break;
            case "!show":
              hidden = false;
              break;
            default:
              break;
          }
        }

        if (!active) {
          return;
        }

        if (voters.has(user.login)) {
          return;
        }

        let input = message.text.split(" ").filter(Boolean)[0];
        let vote = parseInt(input, 10);
        if (!vote || vote > 10 || vote < 1) {
          return;
        }

        voters.add(user.login);

        voteCounts[vote]++;
      } catch (error) {
        //asd
      }
    });
  } //connectChat

  /**
   * @type {any}
   */
  let intervalId;

  function startInterval() {
    if (!intervalId) {
      intervalId = setInterval(() => {
        let sum = 0;
        let total = 0;
        for (let index = 1; index <= 10; index++) {
          const count = voteCounts[index] || 0;
          sum += index * count;
          total += count;
        }

        score = sum / total || 0;
        votes = total || 0;
        percent = (score * 100) / 10;
        if (previousPercent != percent) {
          previousPercent = percent;
          animate("#filler", {
            y: 100 - percent + "%",
            duration: 200,
          });
        }
      }, 300);
    } else {
      console.log("asd");
    }
  } //startInterval

  function stopInterval() {
    clearInterval(intervalId);
    intervalId = null;
  } //stopInterval

  function showHint() {
    hintVisible = true;
    setTimeout(() => {
      hintVisible = false;
    }, 500);
  } //showHint
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
</svelte:head>

{#if !hidden}
  <div class="flex flex-col items-center place-content-center h-[100vh] gap-2" transition:fade>
    <div id="glass" class="relative bg-gray-300 rounded-md overflow-hidden w-18 h-[70vh]">
      <div id="filler" class="absolute bottom-0 w-full"></div>
      <div class="absolute inset-0 flex flex-col mb-[57px] mt-[4px] ms-[4px]">
        <div id="labels" class="flex flex-col items-end justify-between h-full dm-serif-display-regular">
          <div class="divider divider-start divider-neutral m-0">10</div>
          <div class="divider divider-start divider-neutral m-0">9</div>
          <div class="divider divider-start divider-neutral m-0">8</div>
          <div class="divider divider-start divider-neutral m-0">7</div>
          <div class="divider divider-start divider-neutral m-0">6</div>
          <div class="divider divider-start divider-neutral m-0">5</div>
          <div class="divider divider-start divider-neutral m-0">4</div>
          <div class="divider divider-start divider-neutral m-0">3</div>
          <div class="divider divider-start divider-neutral m-0">2</div>
          <div class="divider divider-start divider-neutral m-0">1</div>
        </div>
      </div>
    </div>

    <div id="numbers" class="flex flex-col rounded-md text-neutral font-bold text-center dm-serif-display-regular w-18">
      <div class="flex flex-col">
        <div class="text-xl">SCORE</div>
        <div class="text-2xl">{score.toFixed(2)}</div>
      </div>
      <div class="divider divider-neutral m-0"></div>
      <div class="flex flex-col">
        <div class="text-xl">VOTES</div>
        <div class="text-2xl">{votes}</div>
      </div>
    </div>
    {#if hintVisible}
      <div class="absolute bottom-[4%]" transition:fade={{ duration: 100 }}>
        {#if active}🟢{:else}🛑{/if}
      </div>
    {/if}
  </div>
{/if}

<style>
  #glass {
    border-color: #484643;
    border-width: 2px;
  }
  #filler {
    background: linear-gradient(to top, #ffffff, #ffe5a0, #efbb2e);
    height: 100%;
  }

  #labels > div {
    color: black;
    font-size: 1.5rem;
    font-weight: bold;
  }
  #numbers {
    border-color: #484643;
    border-width: 2px;
    background: linear-gradient(130deg, #66100e, #260a08);
    color: #f9c844;
  }
  :global(html) {
    background-color: transparent !important;
    width: 100vw !important;
    height: 100vh !important;
  }

  .dm-serif-display-regular {
    font-family: "DM Serif Display", serif;
    font-weight: 400;
    font-style: normal;
  }
</style>
