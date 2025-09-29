<script>
  import "bootstrap/dist/css/bootstrap.min.css";
  import { onMount } from "svelte";

  onMount(async () => {
    let bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.js");
    let homeTooltip = new bootstrap.Tooltip(document.getElementById("homePageLink"));
  });
</script>

<a class="navbar-brand notranslate site-link" id="homePageLink" href="/home" target="_self" data-bs-toggle="tooltip" data-bs-delay="200" data-bs-placement="bottom" data-bs-title="Home page">
  <img src="/pics/donk.png" alt="logo" style="height: 24px; width: 24px" class="d-inline-block align-top" />
</a>
