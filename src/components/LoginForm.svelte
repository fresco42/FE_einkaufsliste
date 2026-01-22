<script lang="ts">
  import { userApi } from '../lib/api';
  import { authStore } from '../lib/auth';

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

    const result = await userApi.login({ username: username.trim(), password });

    loading = false;

    if (result.success) {
      const { token } = result.data;
      localStorage.setItem('token', token);

      const usersResult = await userApi.getAll();
      if (usersResult.success) {
        const currentUser = usersResult.data.find(u => u.username === username.trim());
        if (currentUser) {
          authStore.login(currentUser, token);
          window.location.href = '/lists';
          return;
        }
      }
      error = 'Fehler beim Laden der Benutzerdaten';
      localStorage.removeItem('token');
      loading = false;
      return;
    } else {
      if (result.error.status === 401) {
        error = 'Ungueltige Anmeldedaten';
      } else if (result.error.status === 400) {
        error = 'Benutzername und Passwort sind erforderlich';
      } else {
        error = result.error.message;
      }
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
