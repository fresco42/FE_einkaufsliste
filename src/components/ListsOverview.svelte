<script lang="ts">
  import { listApi } from '../lib/api';
  import { auth } from '../lib/auth.svelte';
  import type { List } from '../types/api';

  let lists = $state<List[]>([]);
  let loading = $state(true);
  let error = $state('');
  let newName = $state('');
  let creating = $state(false);

  $effect(() => {
    if (auth.isAuthenticated && auth.user) loadLists();
  });

  async function loadLists() {
    if (!auth.user) return;
    loading = true;
    const result = await listApi.getByUserId(auth.user.id);
    loading = false;
    if (result.success) lists = result.data;
    else error = result.error.message;
  }

  async function createList(e: Event) {
    e.preventDefault();
    if (!auth.user || !newName.trim()) return;
    creating = true;
    const result = await listApi.create({ name: newName.trim(), user_id: auth.user.id });
    creating = false;
    if (result.success) {
      newName = '';
      loadLists();
    }
  }

  async function deleteList(id: number) {
    const result = await listApi.delete(id);
    if (result.success) loadLists();
  }
</script>

<div class="container">
  {#if !auth.isAuthenticated}
    <div class="card">
      <p>Bitte <a href="/">anmelden</a> um Listen zu sehen.</p>
    </div>
  {:else if loading}
    <div class="loading">Laden...</div>
  {:else if error}
    <div class="card"><p class="error-message">{error}</p></div>
  {:else}
    <h1>Meine Listen</h1>
    <form class="card create-form" onsubmit={createList}>
      <input placeholder="Neue Liste..." bind:value={newName} disabled={creating} />
      <button type="submit" class="btn-primary" disabled={creating}>
        {creating ? '...' : 'Erstellen'}
      </button>
    </form>

    {#if lists.length === 0}
      <p class="empty">Keine Listen vorhanden.</p>
    {:else}
      <ul class="lists">
        {#each lists as list (list.id)}
          <li class="card list-item">
            <a href="/lists/{list.id}">{list.name}</a>
            <button class="btn-danger" onclick={() => deleteList(list.id)}>X</button>
          </li>
        {/each}
      </ul>
    {/if}
  {/if}
</div>

<style>
  h1 { margin-bottom: 1rem; }
  .create-form {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .create-form input { flex: 1; }
  .lists {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
  }
  .list-item a { flex: 1; font-weight: 500; }
  .empty { color: var(--secondary); text-align: center; padding: 2rem; }
</style>
