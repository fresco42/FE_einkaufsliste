<script lang="ts">
  import { userApi } from '../lib/api';
  import { auth } from '../lib/auth.svelte';

  // Redirect wenn bereits eingeloggt
  $effect(() => {
    if (auth.isAuthenticated) {
      window.location.href = '/lists';
    }
  });

  let username = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = '';

    if (!username.trim() || !password.trim()) {
      error = 'Benutzername und Passwort sind erforderlich';
      return;
    }

    loading = true;

    try {
      const result = await userApi.login({ username: username.trim(), password });

      if (result.success) {
        // Neuer Store: direkter Aufruf, kein getState() nötig
        auth.login(result.data.user, result.data.token);
        window.location.href = '/lists';
      } else {
        error = result.error.status === 401 
          ? 'Ungültige Anmeldedaten'
          : result.error.status === 400 
            ? 'Benutzername und Passwort sind erforderlich'
            : result.error.message;
      }
    } catch {
      error = 'Ein unerwarteter Fehler ist aufgetreten';
    } finally {
      loading = false;
    }
  }
</script>

<div class="card">
  <h1>Anmelden</h1>
  <form onsubmit={handleSubmit}>
    <div class="form-group">
      <label for="username">Benutzername</label>
      <input
        type="text"
        id="username"
        bind:value={username}
        disabled={loading}
        autocomplete="username"
      />
    </div>
    <div class="form-group">
      <label for="password">Passwort</label>
      <input
        type="password"
        id="password"
        bind:value={password}
        disabled={loading}
        autocomplete="current-password"
      />
    </div>
    {#if error}
      <p class="error-message">{error}</p>
    {/if}
    <button type="submit" class="btn-primary" disabled={loading}>
      {loading ? 'Wird geladen...' : 'Anmelden'}
    </button>
  </form>
  <p class="register-link">
    Noch kein Konto? <a href="/register">Jetzt registrieren</a>
  </p>
</div>

<style>
  .card {
    max-width: 400px;
    margin: var(--spacing-xl) auto;
  }

  h1 {
    margin-bottom: var(--spacing-lg);
    text-align: center;
  }

  button[type="submit"] {
    width: 100%;
    margin-top: var(--spacing-sm);
  }

  .register-link {
    text-align: center;
    margin-top: var(--spacing-lg);
    color: var(--color-secondary);
  }

  .error-message {
    margin-bottom: var(--spacing-sm);
  }
</style>
