<script>
  import { page } from "$app/state";
  import IcBaselineSettings from "~icons/ic/baseline-settings";
  import IcBaselinePlayArrow from "~icons/ic/baseline-play-arrow";

  const route = $derived(page.route.id);
</script>

{#if route === "/games/arena"}
  <h4>Streamer controls:</h4>
  <p>Move: arrows<br />Attack: <kbd class="kbd">Space</kbd><br />Use ability: <kbd class="kbd">Shift</kbd></p>
  <h4>Chat:</h4>
  Type<kbd class="kbd">!join [class]</kbd> in chat to join<br />
  <kbd class="kbd">!join rogue</kbd> or <kbd class="kbd">DonkRogue</kbd><br />
  <kbd class="kbd">!join hunter</kbd> or <kbd class="kbd">DonkHunter</kbd><br />
  <kbd class="kbd">!join mage</kbd> or <kbd class="kbd">DonkMage</kbd><br />
  <kbd class="kbd">!join paladin</kbd> or <kbd class="kbd">DonkPaladin</kbd><br />
  <kbd class="kbd">!join priest</kbd> or <kbd class="kbd">DonkPriest</kbd><br />
  <kbd class="kbd">!join shaman</kbd> or <kbd class="kbd">DonkShaman</kbd>
{:else if route === "/games/connect4"}
  <p>1. Streamer makes a move</p>
  <p>2. Chat picks a column by typing a number in chat</p>
  <p>3. Streamer clicks on "Play chat's turn"</p>
  <p>Repeat until someone wins :)</p>
{:else if route === "/games/donkhunt"}
  <p>Hunters are trying to surround and kill the Target</p>
  <p>Hunters and Target will take turns to move around the field.</p>
  <p>Hunters can only move forward (upward). Only one Hunter can move each turn.</p>
  <p>Target can move in any direction (but not diagonally).</p>
  <p>Hunters and Target can only move diagonally when moving to or from the Base (topmost cell).</p>
  <p>Hunters win if Target has nowhere to go (is surrounded/blocked). Target wins if it finds a way to reach the flag.</p>
{:else if route === "/games/draw"}
  <p>1. Open the settings using the <IcBaselineSettings /> button on the right and pick the emotes that you want to draw and adjust other settings</p>
  <p>2. <IcBaselinePlayArrow /> Start the game. A random emote will be shown bottom right that you have to draw</p>
  <p>3. Viewers guess the emote by typing in chat</p>
{:else if route === "/games/emotes"}
  <p>1. Streamer adjusts settings then clicks on "Start"</p>
  <p>2. Emotes will be shown on screen and chat has to type them in order</p>
  <p>3. Viewers that type them correctly move on to the next round</p>
  <p>4. Game ends when 1 viewers is left</p>
  <p>Streamer can also play by typing in chat</p>
{:else if route === "/games/nim"}
  <p>There are some popsicles lying around (20 by default). Players take turns to eat them.</p>
  <p>A player can eat 1, 2, or 3 popsicles at once.</p>
  <p>Whoever eats the LAST popsicle - wins or loses the game! (depending on your settings)</p>
{:else if route === "/games/shapes"}
  <p>There is a list of geometric shapes. You will have to finish this list by adding more shapes.</p>
  <p>The list is built according to a predefined hidden rule (e.g. "next shape cannot be the same color as the last one")</p>
  <p>Use first shapes to figure out which rule is in order, then click on the shape which you think will fit.</p>
  <p>This game does not have separate streamer and chat turns, you can play it together at the same time</p>
{:else if route === "/games/tictactoe"}
  <p>1. Streamer makes a move</p>
  <p>2. Chat picks a square by typing a number in chat</p>
  <p>3. Streamer clicks on "Play chat's turn"</p>
  <p>Repeat until someone wins :)</p>
{:else if route === "/games/wordle"}
  <p>1. Streamer adjusts settings</p>
  <p>2. Chat starts submitting words by typing in chat</p>
  <p>3. Streamer clicks on "Start" to randomly pick a submitted word</p>
  <p>
    4. Streamer starts guessing the word, should work just like the
    <a target="_blank" rel="noopener noreferrer" href="https://www.nytimes.com/games/wordle/index.html">real site</a>
  </p>
{/if}
