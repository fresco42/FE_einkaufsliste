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
  let updatedListName = $state('');

  $effect(() => { load(); });

  async function load() {
    loading = true;
    const [listRes, itemsRes] = await Promise.all([
      listApi.getById(listId),
      itemApi.getByListId(listId)
    ]);
    loading = false;
    if (!listRes.success) {
      if (listRes.error.status === 404) error = 'Liste nicht gefunden';
      else if (listRes.error.status === 403) error = 'Kein Zugriff auf diese Liste';
      else error = listRes.error.message;
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
    // newQty = 1;
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
    <div class="loading">Laden...</div>
  {:else if error}
    <div class="card error-card">
      <p class="error-message">{error}</p>
      <a href="/lists" class="back-link">Zurück zu Listen</a>
    </div>
  {:else}
    <a href="/lists" class="back-link">Zurück zu Listen</a>
    <h1>{list?.name}</h1>

    {#if auth.isAuthenticated}
      <form class="add-form" onsubmit={add}>
        <input
          class="add-input"
          placeholder="Neuer Artikel..."
          bind:value={newName}
        />
        <input
          type="number"
          class="qty-input"
          min="1"
          bind:value={newQty}
        />
        <button type="submit" class="btn-primary btn-icon">+</button>
      </form>
    {/if}

    {#if items.length === 0}
      <div class="card empty-state">
        <p>Diese Liste ist noch leer.</p>
      </div>
    {:else}
      <div class="card items-card">
        <ul class="items-list">
          {#each items as item (item.id)}
            <li class="item" class:item-checked={item.checked}>
              {#if auth.isAuthenticated}
                <input
                  type="checkbox"
                  checked={item.checked}
                  onchange={() => toggle(item)}
                />
              {/if}
              <span class="item-name" class:item-done={item.checked}>{item.name}</span>
              <span class="item-qty">{item.quantity}x</span>
              {#if auth.isAuthenticated}
                <input
                  type="number"
                  class="qty-edit"
                  min="1"
                  value={item.quantity}
                  onchange={(e) => updateQty(item, e)}
                />
                <button class="btn-danger btn-icon btn-small" onclick={() => remove(item.id)}>X</button>
              {/if}
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  {/if}
</div>

<style>
  .add-form {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    background: var(--white);
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid var(--border);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  .add-input {
    flex: 1;
  }

  .qty-input {
    width: 4.5rem;
  }

  .items-card {
    padding: 0;
  }

  .items-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .item {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border);
    transition: background-color 0.15s;
  }

  .item:last-child {
    border-bottom: none;
  }

  .item:hover {
    background: var(--bg);
  }

  .item-checked {
    background: var(--bg);
  }

  .item-name {
    flex: 1;
    font-weight: 500;
  }

  .item-done {
    text-decoration: line-through;
    color: var(--secondary);
  }

  .item-qty {
    color: var(--secondary);
    font-size: 0.875rem;
    min-width: 2rem;
    text-align: right;
  }

  .qty-edit {
    width: 3.5rem;
    padding: 0.375rem 0.5rem;
    font-size: 0.875rem;
  }

  .error-card {
    text-align: center;
  }

  .error-card .back-link {
    margin-top: 1rem;
    display: inline-block;
  }
</style>
