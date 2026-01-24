<script lang="ts">
  import { auth } from '../lib/auth.svelte';
</script>

<nav class="nav">
  {#if auth.isAuthenticated && auth.user}
    <span class="user">{auth.user.username}</span>
    <button class="btn-secondary" onclick={() => auth.logout()}>Abmelden</button>
  {:else}
    <a href="/">Anmelden</a>
    <a href="/register">Registrieren</a>
  {/if}
</nav>

<style>
  .nav {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .nav a {
    color: white;
  }
  .user {
    color: rgba(255,255,255,0.8);
  }
  button {
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
  }
</style>
