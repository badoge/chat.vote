<script>
  import { page } from "$app/state";

  import IcBaselineVideogameAsset from "~icons/ic/baseline-videogame-asset";
  import IcBaselineQueueMusic from "~icons/ic/baseline-queue-music";
  import IcBaselineLocalActivity from "~icons/ic/baseline-local-activity";
  import StreamlineToastSolid from "~icons/streamline/toast-solid";
  import MdiTwitch from "~icons/mdi/twitch";
  import IcRoundHowToVote from "~icons/ic/round-how-to-vote";

  const route = $derived(page.route.id);
</script>

<li>
  <a class={route === "/" ? "bg-accent text-accent-content" : ""} data-bs-title="Polls that you vote on by typing in Twitch chat" aria-current={route === "/" ? "page" : "false"} href="/">
    <MdiTwitch /> Twitch chat polls
  </a>
</li>
<li>
  <a class={route === "/poll" ? "bg-accent text-accent-content" : ""} data-bs-title="Straw polls with shareable links" aria-current={route === "/poll" ? "page" : "false"} href="/poll">
    <IcRoundHowToVote /> Polls
  </a>
</li>
<li>
  <a
    class={route?.startsWith("/games") ? "bg-accent text-accent-content" : ""}
    data-bs-title="Mini games with chat interaction"
    aria-current={route?.startsWith("/games") ? "page" : "false"}
    href="/games"
  >
    <IcBaselineVideogameAsset /> Games
  </a>
</li>
<li>
  <a class={route === "/raffles" ? "bg-accent text-accent-content" : ""} data-bs-title="Twitch chat raffles" aria-current={route === "/raffles" ? "page" : "false"} href="/raffles">
    <IcBaselineLocalActivity /> Raffles
  </a>
</li>
<li>
  <a class={route === "/blt" ? "bg-accent text-accent-content" : ""} data-bs-title="Brackets, (tier)Lists & Trivia" aria-current={route === "/blt" ? "page" : "false"} href="/blt">
    <StreamlineToastSolid /> BLT
  </a>
</li>
<li>
  <a class={route === "/playlist" ? "bg-accent text-accent-content" : ""} data-bs-title="Song & video requests" aria-current={route === "/playlist" ? "page" : "false"} href="/playlist">
    <IcBaselineQueueMusic /> Playlist
  </a>
</li>
