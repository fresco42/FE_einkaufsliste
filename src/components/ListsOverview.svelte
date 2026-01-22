<script lang="ts">
  import { onMount } from 'svelte';
  import { listApi } from '../lib/api';
  import { authStore } from '../lib/auth';
  import type { List } from '../types/api';

  type LoadingState = 'loading' | 'success' | 'error' | 'empty' | 'unauthorized';

  let lists = $state<List[]>([]);
  let state = $state<LoadingState>('loading');
  let error = $state('');
  let newListName = $state('');
  let creating = $state(false);
  let createError = $state('');
  let deletingId = $state<number | null>(null);

  onMount(() => {
    const authState = authStore.getState();
    if (!authState.isAuthenticated || !authState.user) {
      state = 'unauthorized';
      return;
    }
    loadLists(authState.user.id);
  });

  async function loadLists(userId: number) {
    state = 'loading';
    error = '';

    const result = await listApi.getByUserId(userId);

    if (result.success) {
      lists = result.data;
      state = lists.length === 0 ? 'empty' : 'success';
    } else {
      error = result.error.message;
      state = 'error';
    }
  }

  async function createList(e: Event) {
    e.preventDefault();
    createError = '';

    const authState = authStore.getState();
    if (!authState.user) return;

    if (!newListName.trim()) {
      createError = 'Name ist erforderlich';
      return;
    }

    creating = true;

    const result = await listApi.create({
      name: newListName.trim(),
      user_id: authState.user.id,
    });

    creating = false;

    if (result.success) {
      newListName = '';
      await loadLists(authState.user.id);
    } else {
      createError = result.error.message;
    }
  }

  async function deleteList(id: number) {
    const authState = authStore.getState();
    if (!authState.user) return;

    deletingId = id;

    const result = await listApi.delete(id);

    deletingId = null;

    if (result.success) {
      await loadLists(authState.user.id);
    } else {
      alert('Fehler beim Loeschen: ' + result.error.message);
    }
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
</script>

<div class="container">
  {#if state === 'unauthorized'}
    <div class="card">
      <p class="error-message">Sie muessen angemeldet sein, um Ihre Listen zu sehen.</p>
      <a href="/" class="btn-primary" style="display: inline-block; margin-top: var(--spacing-md);">Zur Anmeldung</a>
    </div>
  {:else if state === 'loading'}
    <div class="loading">Listen werden geladen...</div>
  {:else if state === 'error'}
    <div class="card">
      <p class="error-message">{error}</p>
      <button class="btn-primary mt-md" onclick={() => {
        const authState = authStore.getState();
        if (authState.user) loadLists(authState.user.id);
      }}>Erneut versuchen</button>
    </div>
  {:else}
    <div class="header-section">
      <h1>Meine Listen</h1>
    </div>

    <form class="create-form card" onsubmit={createList}>
      <div class="form-row">
        <input
          type="text"
          placeholder="Neue Liste erstellen..."
          bind:value={newListName}
          disabled={creating}
        />
        <button type="submit" class="btn-primary" disabled={creating}>
          {creating ? '...' : 'Erstellen'}
        </button>
      </div>
      {#if createError}
        <p class="error-message">{createError}</p>
      {/if}
    </form>

    {#if state === 'empty'}
      <div class="empty-state card">
        <p>Sie haben noch keine Listen erstellt.</p>
        <p>Erstellen Sie Ihre erste Liste mit dem Formular oben.</p>
      </div>
    {:else}
      <ul class="lists">
        {#each lists as list (list.id)}
          <li class="list-item card">
            <a href={`/lists/${list.id}`} class="list-link">
              <span class="list-name">{list.name}</span>
              <span class="list-date">{formatDate(list.created_at)}</span>
            </a>
            <button
              class="btn-danger delete-btn"
              onclick={() => deleteList(list.id)}
              disabled={deletingId === list.id}
            >
              {deletingId === list.id ? '...' : 'X'}
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  {/if}
</div>

<style>
  .header-section {
    margin-bottom: var(--spacing-lg);
  }

  h1 {
    margin: 0;
  }

  .create-form {
    margin-bottom: var(--spacing-lg);
  }

  .form-row {
    display: flex;
    gap: var(--spacing-sm);
  }

  .form-row input {
    flex: 1;
  }

  .lists {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .list-item {
    display: flex;
    align-items: center;
    padding: var(--spacing-md);
  }

  .list-link {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: inherit;
  }

  .list-link:hover {
    text-decoration: none;
  }

  .list-link:hover .list-name {
    color: var(--color-primary);
  }

  .list-name {
    font-weight: 500;
  }

  .list-date {
    color: var(--color-secondary);
    font-size: 0.875rem;
  }

  .delete-btn {
    padding: var(--spacing-xs) var(--spacing-sm);
    margin-left: var(--spacing-md);
    font-size: 0.875rem;
  }
</style>
