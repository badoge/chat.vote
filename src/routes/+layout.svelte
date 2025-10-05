<script module>
  /**
   * @param {any} msg
   * @param {any} type
   * @param {any} timeout
   */
  export function showToast(msg, type, timeout) {
    // let id = Date.now();
    // let toast = `
    // <div id="${id}" class="toast align-items-center text-bg-${type}" role="alert" data-bs-delay="${timeout}" aria-live="assertive" aria-atomic="true">
    //   <div class="d-flex">
    //     <div class="toast-body" style="font-size:1.5em">${msg}</div>
    //     <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    //   </div>
    // </div>`;
    // document.getElementById("toastContainer")?.insertAdjacentHTML("beforeend", toast);
    // const toastBootstrap = bootstrap.Toast.getOrCreateInstance(document.getElementById(id.toString()));
    // toastBootstrap.show();
  } //showToast
</script>

<script>
  import "../app.css";

  let { children } = $props();
</script>

<div aria-live="polite" aria-atomic="true" class="position-relative">
  <div id="toastContainer" class="toast-container top-0 end-0 p-3"></div>
</div>

{@render children?.()}

<style>
  #toastContainer {
    position: fixed;
    z-index: 1056;
    font-weight: bold;
  }
</style>
