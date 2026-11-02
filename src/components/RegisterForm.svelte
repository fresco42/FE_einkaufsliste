<script lang="ts">
  import { userApi } from '../lib/api';
  import { auth } from '../lib/auth.svelte';

  $effect(() => {
    if (auth.isAuthenticated) window.location.href = '/lists';
  });

  let username = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let error = $state('');
  let success = $state('');
  let loading = $state(false);

  async function submit(e: Event) {
    e.preventDefault();
    error = '';
    success = '';
    if (!username.trim() || !password.trim()) {
      error = 'Benutzername und Passwort erforderlich';
      return;
    }
    if (password !== confirmPassword) {
      error = 'Passwörter stimmen nicht überein';
      return;
    }
    loading = true;
    const result = await userApi.register({ username: username.trim(), password });
    loading = false;
    if (result.success) {
      success = 'Registrierung erfolgreich! Jetzt anmelden.';
      username = password = confirmPassword = '';
    } else {
      error = result.error.status === 409 ? 'Benutzername vergeben' : result.error.message;
    }
  }
</script>

<div class="form-wrapper">
  <div class="card form-card">
    <h1>Registrieren</h1>
    <form onsubmit={submit}>
      <div class="form-group">
        <label for="username">Benutzername</label>
        <input id="username" bind:value={username} disabled={loading} />
      </div>
      <div class="form-group">
        <label for="password">Passwort</label>
        <input type="password" id="password" bind:value={password} disabled={loading} />
      </div>
      <div class="form-group">
        <label for="confirm">Passwort bestätigen</label>
        <input type="password" id="confirm" bind:value={confirmPassword} disabled={loading} />
      </div>
      {#if error}<p class="error-message">{error}</p>{/if}
      {#if success}<p class="success-message">{success}</p>{/if}
      <button type="submit" class="btn-primary submit-btn" disabled={loading}>
        {loading ? 'Laden...' : 'Registrieren'}
      </button>
    </form>
    <p class="alt-link">Bereits ein Konto? <a href="/">Anmelden</a></p>
  </div>
</div>

<style>
  .form-wrapper {
    display: flex;
    justify-content: center;
    padding: 2rem 1rem;
  }

  .form-card {
    width: 100%;
    max-width: 380px;
  }

  h1 {
    text-align: center;
    margin-bottom: 1.75rem;
  }

  .submit-btn {
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.75rem;
  }

  .alt-link {
    text-align: center;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
    color: var(--secondary);
    font-size: 0.875rem;
  }

  .error-message, .success-message {
    margin-bottom: 0.75rem;
  }
</style>
