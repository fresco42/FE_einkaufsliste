<script lang="ts">
  import { listApi, itemApi } from '../lib/api';
  import { auth } from '../lib/auth.svelte';
  import type { List, Item } from '../types/api';

  interface Props { listId: number; }
  let { listId }: Props = $props();

  let list = $state<List | null>(null);
  let items = $state<Item[]>([]);
  let loading = $state(true);
  let error = $state('');
  let newName = $state('');
  let newQty = $state(1);

  $effect(() => { load(); });

  async function load() {
    loading = true;
    const [listRes, itemsRes] = await Promise.all([
      listApi.getById(listId),
      itemApi.getByListId(listId)
    ]);
    loading = false;
    if (!listRes.success) {
      error = listRes.error.status === 404 ? 'Liste nicht gefunden' : listRes.error.message;
      return;
    }
    if (!itemsRes.success) {
      error = itemsRes.error.message;
      return;
    }
    list = listRes.data;
    items = itemsRes.data;
  }

  async function add(e: Event) {
    e.preventDefault();
    if (!newName.trim()) return;
    await itemApi.create({ name: newName.trim(), quantity: newQty, list_id: listId });
    newName = '';
    newQty = 1;
    load();
  }

  async function toggle(item: Item) {
    await itemApi.update(item.id, { checked: !item.checked });
    load();
  }

  async function updateQty(item: Item, e: Event) {
    const input = e.target as HTMLInputElement;
    const qty = Math.max(1, parseInt(input.value) || 1);
    await itemApi.update(item.id, { quantity: qty });
    load();
  }

  async function remove(id: number) {
    await itemApi.delete(id);
    load();
  }
</script>

<div class="container">
  {#if loading}
    <p>Laden...</p>
  {:else if error}
    <div class="card">
      <p class="error">{error}</p>
      <a href="/lists">Zurueck</a>
    </div>
  {:else}
    <a href="/lists">Zurueck</a>
    <h1>{list?.name}</h1>

    {#if auth.isAuthenticated}
      <form class="card" onsubmit={add}>
        <input placeholder="Neuer Artikel..." bind:value={newName} />
        <input type="number" min="1" bind:value={newQty} style="width:60px" />
        <button type="submit">+</button>
      </form>
    {/if}

    {#if items.length === 0}
      <p>Liste ist leer.</p>
    {:else}
      <ul class="card">
        {#each items as item (item.id)}
          <li class:checked={item.checked}>
            {#if auth.isAuthenticated}
              <input type="checkbox" checked={item.checked} onchange={() => toggle(item)} />
            {/if}
            <span class:strike={item.checked}>{item.name}</span>
            {#if auth.isAuthenticated}
              <input type="number" min="1" value={item.quantity} onchange={(e) => updateQty(item, e)} style="width:50px" />
              <button onclick={() => remove(item.id)}>X</button>
            {:else}
              <span>{item.quantity}</span>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  {/if}
</div>

<style>
  form { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
  form input:first-of-type { flex: 1; }
  ul { list-style: none; padding: 1rem; margin: 0; }
  li { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0; border-bottom: 1px solid var(--secondary); }
  li:last-child { border-bottom: none; }
  li.checked { opacity: 0.6; }
  li span { flex: 1; }
  .strike { text-decoration: line-through; }
  .error { color: red; }
</style>
