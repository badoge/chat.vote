<script>
  import { enableTooltips, showToast } from "$lib/functions.js";
  import { onMount } from "svelte";

  let bootstrap;
  onMount(async () => {
    bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");
    enableTooltips();
  });

  let { data } = $props();
  let channel = $state(data.slug.toLowerCase().replace(/\s/g, ""));

  /**
   * @param {string} command
   */
  function copyCommand(command) {
    navigator.clipboard.writeText(command);
    showToast("Command copied :)", "info", 1000);
  } //copyLink

  /**
   * @param {{ button: number; }} event
   * @param {string | URL | undefined} link
   */
  function openLink(event, link) {
    if (event.button < 2) {
      window.open(link, "_blank").focus();
    }
  } //openLink
</script>

<style>
  #playlistCard,
  #settingsCard {
    max-height: 85vh;
  }

  #playlistCard > .card-body,
  #settingsCard > .card-body {
    overflow: auto;
  }

  .request-title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
    word-break: break-all;
  }

  .requested-by {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
  }

  .role-badge {
    height: 24px;
    width: 24px;
    vertical-align: bottom;
  }

  .duration-label {
    position: absolute;
    right: 4px;
    bottom: 2px;
    font-weight: 500;
  }

  .request-thumbnail > img {
    max-height: 90px;
  }
  .request-thumbnail {
    width: min-content;
  }

  .thumbnail-div {
    position: relative;
    height: min-content;
  }
</style>
