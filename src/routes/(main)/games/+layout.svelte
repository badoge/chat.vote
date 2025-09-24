<script>
  import { switchGame } from "$lib/functions";
  import { onMount } from "svelte";
  import IcRoundOpenInNew from "~icons/ic/round-open-in-new";
  let { children } = $props();
</script>

<div class="container-fluid">
  <div id="grid" class="mt-3" style="display: none;">
    <div class="row row-cols-1 row-cols-xl-4 row-cols-lg-3 row-cols-sm-3 g-4">
      <div class="col">
        <div class="card h-100">
          <img src="/gamespics/draw.png" onclick={() => switchGame("draw")} class="card-img-top" alt="Draw" />
          <div class="card-body">
            <h5 class="card-title">Draw</h5>
            <p class="card-text">Streamer draws a random emote, chat has to guess the emote. Can you draw well enough?</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/gamespics/arena.png" onclick={() => switchGame("arena")} class="card-img-top" alt="Arena" />
          <div class="card-body">
            <h5 class="card-title">Arena</h5>
            <p class="card-text">Fight your chatters in a "battle royale" arena, where only one can win!</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/gamespics/eb.png" onclick={() => switchGame("eb")} class="card-img-top" alt="Emote benchmark" />
          <div class="card-body">
            <h5 class="card-title">Emote benchmark</h5>
            <p class="card-text">A test of reaction speed and emote knowledge. Type the appearing emotes in chat as fast as you can.</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/gamespics/dh.png" onclick={() => switchGame("dh")} class="card-img-top" alt="Donk Hunt" />
          <div class="card-body">
            <h5 class="card-title">Donk Hunt</h5>
            <p class="card-text">Scary looking creatures are trying to trap their prey. Are you the hunter or the hunted one?</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/gamespics/shapes.png" onclick={() => switchGame("shapes")} class="card-img-top" alt="🟥⏹️🔴🔴⭕⏹️" />
          <div class="card-body">
            <h5 class="card-title">🟥⏹️🔴🔴⭕⏹️</h5>
            <p class="card-text">A very weird logic puzzle. Finish the row of shapes, which has been formed using a pre-determined hidden rule.</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/gamespics/nim.png" onclick={() => switchGame("nim")} class="card-img-top" alt="Nim" />
          <div class="card-body">
            <h5 class="card-title">Nim</h5>
            <p class="card-text">Classic. Remove popsicles until there's one left. Whoever takes the last one - loses!</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/gamespics/nw.png" onclick={() => switchGame("nw")} class="card-img-top" alt="Not Wordle :)" />
          <div class="card-body">
            <h5 class="card-title">Not Wordle :)</h5>
            <p class="card-text">A twist of a well-known game: try to guess a word in several attempts. Your chat will choose the hidden word.</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/gamespics/c4.png" onclick={() => switchGame("c4")} class="card-img-top" alt="Connect 4" />
          <div class="card-body">
            <h5 class="card-title">Connect 4</h5>
            <p class="card-text">Players take turns to drop their pieces into the container, attempting to connect 4 of their pieces in a row.</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/gamespics/ttt.png" onclick={() => switchGame("ttt")} class="card-img-top" alt="tic tac toe" />
          <div class="card-body">
            <h5 class="card-title">tic tac toe</h5>
            <p class="card-text">An ancient game of wits. Will you outsmart the hive mind - which is your chat?</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/gamespics/guessr.png" onclick={() => switchGame("guessr")} class="card-img-top" alt="guessr" />
          <div class="card-body">
            <h5 class="card-title"><IcRoundOpenInNew /> Guessr.tv</h5>
            <p class="card-text">Guess the view count. You will be presented with a random Twitch stream and you have to guess how many viewers they have.</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100">
          <img src="/pics/donk.png" style="width: 180px; height: 180px; align-self: center" onclick={() => switchGame("about")} class="card-img-top" alt="About" />
          <div class="card-body">
            <h5 class="card-title">About</h5>
            <p class="card-text">About section</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

{@render children?.()}
