<script lang="ts">
  import { userApi } from '../lib/api';
  import { auth } from '../lib/auth.svelte';

  $effect(() => {
    if (auth.isAuthenticated) window.location.href = '/lists';
  });

  let username = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

  async function submit(e: Event) {
    e.preventDefault();
    error = '';
    if (!username.trim() || !password.trim()) {
      error = 'Benutzername und Passwort erforderlich';
      return;
    }
    loading = true;
    const result = await userApi.login({ username: username.trim(), password });
    loading = false;
    if (result.success) {
      auth.login(result.data.user, result.data.token);
      window.location.href = '/lists';
    } else {
      error = result.error.status === 401 ? 'Falsche Anmeldedaten' : result.error.message;
    }
  }
</script>

<div class="card form-card">
  <h1>Anmelden</h1>
  <form onsubmit={submit}>
    <div class="form-group">
      <label for="username">Benutzername</label>
      <input id="username" bind:value={username} disabled={loading} />
    </div>
    <div class="form-group">
      <label for="password">Passwort</label>
      <input type="password" id="password" bind:value={password} disabled={loading} />
    </div>
    {#if error}<p class="error-message">{error}</p>{/if}
    <button type="submit" class="btn-primary full" disabled={loading}>
      {loading ? '...' : 'Anmelden'}
    </button>
  </form>
  <p class="link">Noch kein Konto? <a href="/register">Registrieren</a></p>
</div>

<style>
  .form-card {
    max-width: 400px;
    margin: 2rem auto;
  }
  h1 {
    margin-bottom: 1.5rem;
    text-align: center;
  }
  .full {
    width: 100%;
    margin-top: 0.5rem;
  }
  .link {
    text-align: center;
    margin-top: 1.5rem;
    color: var(--secondary);
  }
  .error-message {
    margin-bottom: 0.5rem;
  }
</style>
