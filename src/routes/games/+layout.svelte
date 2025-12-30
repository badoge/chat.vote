<script>
  import Navbar from "$lib/Navbar.svelte";

  import { switchGame } from "$lib/games";
  import IcRoundOpenInNew from "~icons/ic/round-open-in-new";
  import IcBaselineClose from "~icons/ic/baseline-close";
  import HowToPlay from "$lib/HowToPlay.svelte";
  import Window from "$lib/Window.svelte";

  let { children } = $props();

  let games = [
    { name: "draw", title: "Draw", description: "Streamer draws a random emote, chat has to guess the emote. Can you draw well enough?" },
    { name: "arena", title: "Arena", description: 'Fight your chatters in a "battle royale" arena, where only one can win!' },
    { name: "eb", title: "Emote benchmark", description: "A test of reaction speed and emote knowledge. Type the appearing emotes in chat as fast as you can." },
    { name: "dh", title: "Donk Hunt", description: "Scary looking creatures are trying to trap their prey. Are you the hunter or the hunted one?" },
    { name: "shapes", title: "🟥⏹️🔴🔴⭕⏹️", description: "A very weird logic puzzle. Finish the row of shapes, which has been formed using a pre-determined hidden rule." },
    { name: "nim", title: "Nim", description: "Classic. Remove popsicles until there's one left. Whoever takes the last one - loses!" },
    { name: "nw", title: "Wordle", description: "A twist of a well-known game: try to guess a word in several attempts. Your chat will choose the hidden word." },
    { name: "c4", title: "Connect 4", description: "Players take turns to drop their pieces into the container, attempting to connect 4 of their pieces in a row." },
    { name: "ttt", title: "tic tac toe", description: "An ancient game of wits. Will you outsmart the hive mind - which is your chat?" },
    { name: "guessr", title: "Guessr.tv", description: "Guess the view count. You will be presented with a random Twitch stream and you have to guess how many viewers they have." },
  ];

  let now = $state(new Date());
  setInterval(() => (now = new Date()), 60000);
</script>

<dialog id="howToPlayModal" class="modal">
  <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-circle btn-ghost absolute right-1 top-1"><IcBaselineClose /></button>
    </form>
    <h3 class="text-lg font-bold">How to play - name</h3>
    <HowToPlay />
    <div class="modal-action">
      <form method="dialog">
        <button class="btn">Close</button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<dialog id="aboutModal" class="modal">
  <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-circle btn-ghost absolute right-1 top-1"><IcBaselineClose /></button>
    </form>
    <h3 class="text-lg font-bold">About</h3>
    <div class="card mb-3">
      <div class="card-body">
        <h5>Contact info:</h5>
        <p>
          Site by <a target="_blank" rel="noopener noreferrer" href="https://www.twitch.tv/badoge">badoge</a> :) <br />If you find any issues or if you have suggestions or questions, you can
          contact me: <br /><a target="_blank" rel="noopener noreferrer" href="https://www.twitch.tv/popout/badoge/chat?popout=">in this chat</a> <br />or on
          <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/FR8bgQdPUT">discord</a> <br />or by <a href="mailto:games@chat.vote">email</a>
        </p>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-body">
        <p>tictactoe based on <a target="_blank" rel="noopener noreferrer" href="https://github.com/michaelwhyte/tic_tac_toe">github.com/michaelwhyte/tic_tac_toe</a></p>
        <p>connect4 based on <a target="_blank" rel="noopener noreferrer" href="https://github.com/mennovanslooten/connect4">github.com/mennovanslooten/connect4</a></p>
        <p>not wordle based on <a target="_blank" rel="noopener noreferrer" href="https://www.nytimes.com/games/wordle/index.html">wordle</a></p>
        <p>🟥⏹️🔴🔴⭕⏹️, Donk Hunt, Nim and Arena by <a target="_blank" rel="noopener noreferrer" href="https://www.twitch.tv/g7eternal">g7eternal</a></p>
      </div>
    </div>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn">Close</button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<Navbar />

<div class="desktop">
  <Window />
  <footer class="taskbar">
    <button class="px-2 flex rounded-e-lg bg-gradient-to-b from-[#4cc552] to-[#2e8b33] border border-[#1f6f28] shadow-inner text-white font-bold">
      <span class="text-xl flex gap-1 items-center italic"><img class="h-5" src="/pics/donk.png" alt="donk" />Start</span>
    </button>

    <div class="taskbar-items">
      {#each games as game}
        <div class="taskbar-item">
          <img class="footer__icon h-5" src="/pics/donk.png" alt={game.title} />
          <div class="footer__text">{game.title}</div>
        </div>
      {/each}
    </div>

    <div class="taskbar-icons">
      <div class="clock">
        {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  </footer>
</div>

{@render children?.()}

<style>
  .desktop {
    height: calc(100vh - 64px);
    font-family: Tahoma, "Noto Sans", sans-serif;
    overflow: hidden;
    position: relative;
    background: url("/background.png") center center / cover no-repeat fixed;
    animation: 5s ease 0s 1 normal forwards running none;
  }

  .taskbar {
    height: 30px;
    background: linear-gradient(
      rgb(31, 47, 134) 0px,
      rgb(49, 101, 196) 3%,
      rgb(54, 130, 229) 6%,
      rgb(68, 144, 230) 10%,
      rgb(56, 131, 229) 12%,
      rgb(43, 113, 224) 15%,
      rgb(38, 99, 218) 18%,
      rgb(35, 91, 214) 20%,
      rgb(34, 88, 213) 23%,
      rgb(33, 87, 214) 38%,
      rgb(36, 93, 219) 54%,
      rgb(37, 98, 223) 86%,
      rgb(36, 95, 220) 89%,
      rgb(33, 88, 212) 92%,
      rgb(29, 78, 192) 95%,
      rgb(25, 65, 165) 98%
    );
    position: fixed;
    bottom: 0px;
    right: 0px;
    left: 0px;
    display: flex;
  }

  .clock {
    margin: 0px 5px;
    color: rgb(255, 255, 255);
    font-size: 11px;
    font-weight: lighter;
    text-shadow: none;
  }

  .taskbar-items {
    display: flex;
    -webkit-box-align: center;
    align-items: center;

    height: 100%;
    flex: 1 1 0%;
    overflow: hidden;
  }

  .taskbar-item {
    flex: 1 1 0%;
    max-width: 150px;
    color: rgb(255, 255, 255);
    border-radius: 2px;
    margin-top: 2px;
    padding: 0px 8px;
    height: 22px;
    font-size: 11px;
    background-color: rgb(60, 129, 243);
    box-shadow:
      rgba(0, 0, 0, 0.3) -1px 0px inset,
      rgba(255, 255, 255, 0.2) 1px 1px 1px inset;
    position: relative;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
  }

  .taskbar-icons {
    flex-shrink: 0;
    background: linear-gradient(
      rgb(12, 89, 185) 1%,
      rgb(19, 158, 233) 6%,
      rgb(24, 181, 242) 10%,
      rgb(19, 155, 235) 14%,
      rgb(18, 144, 232) 19%,
      rgb(13, 141, 234) 63%,
      rgb(13, 159, 241) 81%,
      rgb(15, 158, 237) 88%,
      rgb(17, 155, 233) 91%,
      rgb(19, 146, 226) 94%,
      rgb(19, 126, 215) 97%,
      rgb(9, 91, 201) 100%
    );
    border-left: 1px solid rgb(16, 66, 175);
    box-shadow: rgb(24, 187, 255) 1px 0px 1px inset;
    padding: 0px 10px;
    margin-left: 10px;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
  }

  .taskbar-item.active {
    background-color: rgb(30, 82, 183);
    box-shadow:
      rgba(0, 0, 0, 0.2) 0px 0px 1px 1px inset,
      rgba(0, 0, 0, 0.7) 1px 0px 1px inset;
  }
</style>
