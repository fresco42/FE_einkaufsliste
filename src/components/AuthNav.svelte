<script lang="ts">
  import { auth } from '../lib/auth.svelte';
</script>

<nav class="auth-nav">
  {#if auth.isAuthenticated && auth.user}
    <a href="/lists" class="username">{auth.user.username}</a>
    <button class="btn-secondary logout-btn" onclick={() => auth.logout()}>
      Abmelden
    </button>
  {:else}
    <a href="/" class="nav-link">Anmelden</a>
    <a href="/register" class="nav-link">Registrieren</a>
  {/if}
</nav>

<style>
  .auth-nav {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .username {
    color: rgba(255, 255, 255, 0.8);
    background: none;
    border: none;
    cursor: pointer;
  }

  .nav-link {
    color: white;
  }

  .logout-btn {
    padding: 4px 12px;
    font-size: 0.875rem;
  }
</style>
