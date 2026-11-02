<script lang="ts">
  import { listApi } from '../lib/api';
  import { auth } from '../lib/auth.svelte';
  import type { List } from '../types/api';

  let lists = $state<List[]>([]);
  let loading = $state(true);
  let error = $state('');
  let newName = $state('');

  $effect(() => {
    if (auth.isAuthenticated && auth.user) load();
  });

  async function load() {
    if (!auth.user) return;
    loading = true;
    const result = await listApi.getByUserId(auth.user.id);
    loading = false;
    if (result.success) lists = result.data;
    else error = result.error.message;
  }

  async function create(e: Event) {
    e.preventDefault();
    if (!auth.user || !newName.trim()) return;
    await listApi.create({ name: newName.trim(), user_id: auth.user.id });
    newName = '';
    load();
  }

  async function remove(id: number) {
    await listApi.delete(id);
    load();
  }

</script>

<div class="container">
  {#if !auth.isAuthenticated}
    <div class="card auth-prompt">
      <p>Bitte <a href="/">anmelden</a> um Listen zu sehen.</p>
    </div>
  {:else if loading}
    <div class="loading">Laden...</div>
  {:else if error}
    <div class="card">
      <p class="error-message">{error}</p>
    </div>
  {:else}
    <h1>Meine Listen</h1>

    <form class="create-form" onsubmit={create}>
      <input class="create-input" placeholder="Neue Liste..." bind:value={newName} />
      <button type="submit" class="btn-primary">Erstellen</button>
    </form>

    {#if lists.length === 0}
      <div class="card empty-state">
        <p>Noch keine Listen vorhanden.</p>
      </div>
    {:else}
      <div class="card lists-card">
        <ul class="lists">
          {#each lists as list (list.id)}
            <li class="list-item">
              <a href="/lists/{list.id}" class="list-link">{list.name}</a>
              <button class="btn-danger btn-icon btn-small" onclick={() => remove(list.id)}>X</button>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  {/if}
</div>

<style>
  .auth-prompt {
    text-align: center;
    padding: 2rem;
  }

  .create-form {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    background: var(--white);
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid var(--border);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  .create-input {
    flex: 1;
  }

  .lists-card {
    padding: 0;
  }

  .lists {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .list-item {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border);
    transition: background-color 0.15s;
  }

  .list-item:last-child {
    border-bottom: none;
  }

  .list-item:hover {
    background: var(--bg);
  }

  .list-link {
    flex: 1;
    font-weight: 500;
  }
</style>
