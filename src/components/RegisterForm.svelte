<script lang="ts">
  import { userApi } from '../lib/api';

  let username = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let error = $state('');
  let success = $state('');
  let loading = $state(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = '';
    success = '';

    if (!username.trim() || !password.trim()) {
      error = 'Benutzername und Passwort sind erforderlich';
      return;
    }

    if (password !== confirmPassword) {
      error = 'Passwoerter stimmen nicht ueberein';
      return;
    }

    if (password.length < 4) {
      error = 'Passwort muss mindestens 4 Zeichen lang sein';
      return;
    }

    loading = true;

    const result = await userApi.register({ username: username.trim(), password });

    loading = false;

    if (result.success) {
      success = 'Registrierung erfolgreich! Sie koennen sich jetzt anmelden.';
      username = '';
      password = '';
      confirmPassword = '';
    } else {
      if (result.error.status === 409) {
        error = 'Benutzername ist bereits vergeben';
      } else if (result.error.status === 400) {
        error = 'Benutzername und Passwort sind erforderlich';
      } else {
        error = result.error.message;
      }
    }
  }
</script>

<div class="card">
  <h1>Registrieren</h1>
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
        autocomplete="new-password"
      />
    </div>
    <div class="form-group">
      <label for="confirmPassword">Passwort bestaetigen</label>
      <input
        type="password"
        id="confirmPassword"
        bind:value={confirmPassword}
        disabled={loading}
        autocomplete="new-password"
      />
    </div>
    {#if error}
      <p class="error-message">{error}</p>
    {/if}
    {#if success}
      <p class="success-message">{success}</p>
    {/if}
    <button type="submit" class="btn-primary" disabled={loading}>
      {loading ? 'Wird geladen...' : 'Registrieren'}
    </button>
  </form>
  <p class="login-link">
    Bereits ein Konto? <a href="/">Jetzt anmelden</a>
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

  .login-link {
    text-align: center;
    margin-top: var(--spacing-lg);
    color: var(--color-secondary);
  }

  .error-message {
    margin-bottom: var(--spacing-sm);
  }

  .success-message {
    margin-bottom: var(--spacing-sm);
  }
</style>
