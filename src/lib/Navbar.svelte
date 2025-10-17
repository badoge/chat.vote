<script>
  import ThemeSwitcher from "./ThemeSwitcher.svelte";
  import Login from "./Login.svelte";
  import NavbarLinks from "./NavbarLinks.svelte";

  let { messageHandler = null, timeoutHandler = null, messageDeletedHandler = null, loginEvent = null, hideLogin = "false" } = $props();
</script>

<div class="navbar bg-base-200 shadow-md py-0">
  <div class="navbar-start">
    <div class="dropdown">
      <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </div>
      <ul class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <NavbarLinks />
      </ul>
    </div>
    <div class="tooltip tooltip-bottom" data-tip="Home page">
      <a class="btn btn-ghost text-xl site-link" href="/home" target="_self">
        <img src="/pics/donk.png" alt="logo" style="height: 24px; width: 24px" class="d-inline-block align-top" />chat.vote beta - not ready for public use :)
      </a>
    </div>
  </div>
  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal px-1">
      <NavbarLinks />
    </ul>
  </div>
  <div class="navbar-end gap-2">
    {#if hideLogin !== "true"}
      <Login {messageHandler} {timeoutHandler} {messageDeletedHandler} {loginEvent} />
    {/if}
    <ThemeSwitcher />
  </div>
</div>
