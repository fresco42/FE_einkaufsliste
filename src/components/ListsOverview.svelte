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
    <div class="card">
      <p>Bitte <a href="/">anmelden</a> um Listen zu sehen.</p>
    </div>
  {:else if loading}
    <p>Laden...</p>
  {:else if error}
    <div class="card">
      <p class="error">{error}</p>
    </div>
  {:else}
    <h1>Meine Listen</h1>

    <form class="card" onsubmit={create}>
      <input placeholder="Neue Liste..." bind:value={newName} />
      <button type="submit">Erstellen</button>
    </form>

    {#if lists.length === 0}
      <p>Keine Listen vorhanden.</p>
    {:else}
      <ul class="card">
        {#each lists as list (list.id)}
          <li>
            <a href="/lists/{list.id}">{list.name}</a>
            <button onclick={() => remove(list.id)}>X</button>
          </li>
        {/each}
      </ul>
    {/if}
  {/if}
</div>

<style>
  form { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
  form input { flex: 1; }
  ul { list-style: none; padding: 1rem; margin: 0; }
  li { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid var(--secondary); }
  li:last-child { border-bottom: none; }
  li a { flex: 1; }
  .error { color: red; }
</style>
