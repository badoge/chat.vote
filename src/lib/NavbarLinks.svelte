<script>
  import { page } from "$app/state";
  import "bootstrap/dist/css/bootstrap.min.css";

  import IcBaselineVideogameAsset from "~icons/ic/baseline-videogame-asset";
  import IcBaselineQueueMusic from "~icons/ic/baseline-queue-music";
  import IcBaselineLocalActivity from "~icons/ic/baseline-local-activity";
  import StreamlineToastSolid from "~icons/streamline/toast-solid";
  import MdiTwitch from "~icons/mdi/twitch";
  import IcRoundHowToVote from "~icons/ic/round-how-to-vote";

  const route = $derived(page.route.id);
</script>

<li class="nav-item">
  <a
    class="nav-link site-link {route === '/(main)' ? 'active' : ''}"
    data-bs-toggle="tooltip"
    data-bs-delay="200"
    data-bs-placement="bottom"
    data-bs-title="Polls that you vote on by typing in Twitch chat"
    aria-current={route === "/(main)" ? "page" : "false"}
    target="_self"
    href="/"
  >
    <MdiTwitch /> Twitch chat polls
  </a>
</li>
<li class="nav-item">
  <a
    class="nav-link site-link {route === '/(main)/poll' ? 'active' : ''}"
    data-bs-toggle="tooltip"
    data-bs-delay="200"
    data-bs-placement="bottom"
    data-bs-title="Straw polls with shareable links"
    aria-current={route === "/(main)/poll" ? "page" : "false"}
    target="_self"
    href="/poll"
  >
    <IcRoundHowToVote /> Polls
  </a>
</li>
<li class="nav-item">
  <a
    class="nav-link site-link {route?.startsWith('/(main)/games') ? 'active' : ''}"
    data-bs-toggle="tooltip"
    data-bs-delay="200"
    data-bs-placement="bottom"
    data-bs-title="Mini games with chat interaction"
    aria-current={route?.startsWith("/(main)/games") ? "page" : "false"}
    target="_self"
    href="/games"
  >
    <IcBaselineVideogameAsset /> Games
  </a>
</li>
<li class="nav-item">
  <a
    class="nav-link site-link {route === '/(main)/raffles' ? 'active' : ''}"
    data-bs-toggle="tooltip"
    data-bs-delay="200"
    data-bs-placement="bottom"
    data-bs-title="Twitch chat raffles"
    aria-current={route === "/(main)/raffles" ? "page" : "false"}
    target="_self"
    href="/raffles"
  >
    <IcBaselineLocalActivity /> Raffles
  </a>
</li>
<li class="nav-item">
  <a
    class="nav-link site-link {route === '/(main)/blt' ? 'active' : ''}"
    data-bs-toggle="tooltip"
    data-bs-delay="200"
    data-bs-placement="bottom"
    data-bs-title="Brackets, (tier)Lists & Trivia"
    aria-current={route === "/(main)/blt" ? "page" : "false"}
    target="_self"
    href="/blt"
  >
    <StreamlineToastSolid /> BLT
  </a>
</li>
<li class="nav-item">
  <a
    class="nav-link site-link {route === '/(main)/playlist' ? 'active' : ''}"
    data-bs-toggle="tooltip"
    data-bs-delay="200"
    data-bs-placement="bottom"
    data-bs-title="Song & video requests"
    aria-current={route === "/(main)/playlist" ? "page" : "false"}
    target="_self"
    href="/playlist"
  >
    <IcBaselineQueueMusic /> Playlist
  </a>
</li>
