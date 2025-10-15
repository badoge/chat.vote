<script module>
  /**
   * @param {any} msg
   * @param {any} type
   * @param {any} timeout
   */
  export function showToast(msg, type, timeout) {
    let id = Date.now().toString();
    let toast = `
    <div id="${id}" class="alert ${type} text-lg font-bold">
      <span>${msg}</span>
    </div>`;
    document.getElementById("toastContainer")?.insertAdjacentHTML("beforeend", toast);

    setTimeout(() => {
      document.getElementById(id).style.transition = "opacity 0.3s ease";
      document.getElementById(id).style.opacity = "0";
      setTimeout(() => {
        document.getElementById(id)?.remove();
      }, timeout + 1000);
    }, timeout);
  } //showToast
</script>

<script>
  import "../app.css";
  let { children } = $props();
</script>

<div id="toastContainer" class="toast toast-top toast-end"></div>

{@render children()}

<style>
  #toastContainer {
    margin-top: 55px;
    z-index: 1056;
    font-weight: bold;
  }
</style>
