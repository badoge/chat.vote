<script>
  import "bootstrap/dist/css/bootstrap.min.css";
  let { children } = $props();
</script>

<div aria-live="polite" aria-atomic="true" class="position-relative">
  <div id="toastContainer" class="toast-container"></div>
</div>

{@render children?.()}
