<script lang="ts">
  import { listApi } from '../lib/api';
  import { auth } from '../lib/auth.svelte';
  import type { List } from '../types/api';

  // Daten-Promise für {#await} - startet automatisch wenn authenticated
  let listsPromise = $state<Promise<List[]> | null>(null);

  // Formular-State
  let newListName = $state('');
  let creating = $state(false);
  let createError = $state('');
  let deletingId = $state<number | null>(null);

  // Automatisch laden wenn User authentifiziert
  $effect(() => {
    if (auth.isAuthenticated && auth.user) {
      listsPromise = loadLists(auth.user.id);
    }
  });

  async function loadLists(userId: number): Promise<List[]> {
    const result = await listApi.getByUserId(userId);
    if (!result.success) throw new Error(result.error.message);
    return result.data;
  }

  async function createList(e: Event) {
    e.preventDefault();
    createError = '';
    if (!auth.user || !newListName.trim()) {
      createError = 'Name ist erforderlich';
      return;
    }

    creating = true;
    const result = await listApi.create({
      name: newListName.trim(),
      user_id: auth.user.id,
    });
    creating = false;

    if (result.success) {
      newListName = '';
      listsPromise = loadLists(auth.user.id); // Neu laden
    } else {
      createError = result.error.message;
    }
  }

  async function deleteList(id: number) {
    if (!auth.user) return;
    deletingId = id;

    const result = await listApi.delete(id);
    deletingId = null;

    if (result.success) {
      listsPromise = loadLists(auth.user.id);
    } else {
      alert('Fehler beim Löschen: ' + result.error.message);
    }
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('de-DE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  }
</script>

<div class="container">
  {#if !auth.isAuthenticated}
    <!-- Nicht eingeloggt -->
    <div class="card">
      <p class="error-message">Sie müssen angemeldet sein, um Ihre Listen zu sehen.</p>
      <a href="/" class="btn-primary" style="display: inline-block; margin-top: var(--spacing-md);">
        Zur Anmeldung
      </a>
    </div>
  {:else if listsPromise}
    <!-- Deklaratives Loading mit {#await} -->
    {#await listsPromise}
      <div class="loading">Listen werden geladen...</div>
    {:then lists}
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

      {#if lists.length === 0}
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
    {:catch error}
      <div class="card">
        <p class="error-message">{error.message}</p>
        <button class="btn-primary mt-md" onclick={() => {
          if (auth.user) listsPromise = loadLists(auth.user.id);
        }}>Erneut versuchen</button>
      </div>
    {/await}
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
