<script>
  import { onMount } from "svelte";
  import "bootstrap/dist/css/bootstrap.min.css";

  onMount(async () => {
    await import("bootstrap");
  });
  let { children } = $props();
</script>

{@render children?.()}
