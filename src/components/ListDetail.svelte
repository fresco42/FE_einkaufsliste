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
  let newItem = $state('');
  let newQty = $state(1);

  $effect(() => { loadData(); });

  async function loadData() {
    loading = true;
    const [listRes, itemsRes] = await Promise.all([
      listApi.getById(listId),
      itemApi.getByListId(listId)
    ]);
    loading = false;
    if (!listRes.success) { error = listRes.error.status === 404 ? 'Liste nicht gefunden' : listRes.error.message; return; }
    if (!itemsRes.success) { error = itemsRes.error.message; return; }
    list = listRes.data;
    items = itemsRes.data;
  }

  async function loadItems() {
    const result = await itemApi.getByListId(listId);
    if (result.success) items = result.data;
  }

  async function addItem(e: Event) {
    e.preventDefault();
    if (!newItem.trim()) return;
    await itemApi.create({ name: newItem.trim(), quantity: newQty, list_id: listId });
    newItem = '';
    newQty = 1;
    loadItems();
  }

  async function toggle(item: Item) {
    await itemApi.update(item.id, { checked: !item.checked });
    loadItems();
  }

  async function updateQty(item: Item, delta: number) {
    const qty = Math.max(1, item.quantity + delta);
    if (qty !== item.quantity) {
      await itemApi.update(item.id, { quantity: qty });
      loadItems();
    }
  }

  async function deleteItem(id: number) {
    await itemApi.delete(id);
    loadItems();
  }
</script>

<div class="container">
  {#if loading}
    <div class="loading">Laden...</div>
  {:else if error}
    <div class="card">
      <p class="error-message">{error}</p>
      <a href="/lists">Zurueck</a>
    </div>
  {:else}
    <a href="/lists" class="back">Zurueck</a>
    <h1>{list?.name}</h1>

    {#if auth.isAuthenticated}
      <form class="card add-form" onsubmit={addItem}>
        <input placeholder="Neuer Artikel..." bind:value={newItem} />
        <input type="number" min="1" bind:value={newQty} class="qty-input" />
        <button type="submit" class="btn-primary">+</button>
      </form>
    {/if}

    {#if items.length === 0}
      <p class="empty">Liste ist leer.</p>
    {:else}
      <ul class="items">
        {#each items as item (item.id)}
          <li class="card item" class:checked={item.checked}>
            {#if auth.isAuthenticated}
              <button class="check" class:done={item.checked} onclick={() => toggle(item)}>
                {item.checked ? 'x' : ''}
              </button>
            {/if}
            <span class="name" class:strike={item.checked}>{item.name}</span>
            <div class="qty">
              {#if auth.isAuthenticated}
                <button onclick={() => updateQty(item, -1)} disabled={item.quantity <= 1}>-</button>
              {/if}
              <span>{item.quantity}</span>
              {#if auth.isAuthenticated}
                <button onclick={() => updateQty(item, 1)}>+</button>
              {/if}
            </div>
            {#if auth.isAuthenticated}
              <button class="btn-danger" onclick={() => deleteItem(item.id)}>X</button>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  {/if}
</div>

<style>
  .back { display: inline-block; margin-bottom: 0.5rem; color: var(--secondary); }
  h1 { margin-bottom: 1rem; }
  .add-form {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .add-form input { flex: 1; }
  .qty-input { width: 60px; flex: none; text-align: center; }
  .items {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
  }
  .item.checked { opacity: 0.6; }
  .check {
    width: 24px;
    height: 24px;
    padding: 0;
    border: 2px solid var(--primary);
    background: white;
    font-weight: bold;
  }
  .check.done { background: var(--primary); color: white; }
  .name { flex: 1; }
  .strike { text-decoration: line-through; color: var(--secondary); }
  .qty {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  .qty button {
    width: 28px;
    height: 28px;
    padding: 0;
    background: var(--secondary);
    color: white;
  }
  .empty { color: var(--secondary); text-align: center; padding: 2rem; }
</style>
