<script lang="ts">
  import { listApi, itemApi } from '../lib/api';
  import { auth } from '../lib/auth.svelte';
  import type { List, Item } from '../types/api';

  interface Props {
    listId: number;
  }

  let { listId }: Props = $props();

  // Daten-State
  let dataPromise = $state<Promise<{ list: List; items: Item[] }> | null>(null);
  let currentList = $state<List | null>(null);
  let currentItems = $state<Item[]>([]);

  // Formular-State
  let newItemName = $state('');
  let newItemQuantity = $state(1);
  let creating = $state(false);
  let createError = $state('');

  // Edit-State
  let editingListName = $state(false);
  let editedName = $state('');
  let savingName = $state(false);
  let updatingItemId = $state<number | null>(null);
  let deletingItemId = $state<number | null>(null);

  // Initial laden
  $effect(() => {
    dataPromise = loadData();
  });

  async function loadData(): Promise<{ list: List; items: Item[] }> {
    const [listResult, itemsResult] = await Promise.all([
      listApi.getById(listId),
      itemApi.getByListId(listId),
    ]);

    if (!listResult.success) {
      throw new Error(listResult.error.status === 404 ? 'Liste nicht gefunden' : listResult.error.message);
    }
    if (!itemsResult.success) {
      throw new Error(itemsResult.error.message);
    }

    // Für Mutation speichern
    currentList = listResult.data;
    currentItems = itemsResult.data;
    editedName = listResult.data.name;

    return { list: listResult.data, items: itemsResult.data };
  }

  async function loadItems() {
    const result = await itemApi.getByListId(listId);
    if (result.success) {
      currentItems = result.data;
    }
  }

  async function createItem(e: Event) {
    e.preventDefault();
    createError = '';
    if (!newItemName.trim()) {
      createError = 'Name ist erforderlich';
      return;
    }

    creating = true;
    const result = await itemApi.create({
      name: newItemName.trim(),
      quantity: newItemQuantity,
      list_id: listId,
    });
    creating = false;

    if (result.success) {
      newItemName = '';
      newItemQuantity = 1;
      await loadItems();
    } else {
      createError = result.error.message;
    }
  }

  async function toggleChecked(item: Item) {
    updatingItemId = item.id;
    const result = await itemApi.update(item.id, { checked: !item.checked });
    updatingItemId = null;
    if (result.success) await loadItems();
    else alert('Fehler: ' + result.error.message);
  }

  async function updateQuantity(item: Item, delta: number) {
    const newQuantity = Math.max(1, item.quantity + delta);
    if (newQuantity === item.quantity) return;

    updatingItemId = item.id;
    const result = await itemApi.update(item.id, { quantity: newQuantity });
    updatingItemId = null;
    if (result.success) await loadItems();
    else alert('Fehler: ' + result.error.message);
  }

  async function deleteItem(id: number) {
    deletingItemId = id;
    const result = await itemApi.delete(id);
    deletingItemId = null;
    if (result.success) await loadItems();
    else alert('Fehler beim Löschen: ' + result.error.message);
  }

  async function saveListName() {
    if (!editedName.trim() || !currentList) return;

    savingName = true;
    const result = await listApi.update(listId, { name: editedName.trim() });
    savingName = false;

    if (result.success) {
      currentList = { ...currentList, name: editedName.trim() };
      editingListName = false;
    } else {
      alert('Fehler: ' + result.error.message);
    }
  }
</script>

<div class="container">
  {#if dataPromise}
    {#await dataPromise}
      <div class="loading">Liste wird geladen...</div>
    {:then _data}
      <!-- Header -->
      <div class="header-section">
        <a href="/lists" class="back-link">Zurück</a>
        {#if editingListName}
          <div class="edit-name-form">
            <input type="text" bind:value={editedName} disabled={savingName} />
            <button class="btn-primary" onclick={saveListName} disabled={savingName}>
              {savingName ? '...' : 'Speichern'}
            </button>
            <button class="btn-secondary" onclick={() => { editingListName = false; editedName = currentList?.name || ''; }}>
              Abbrechen
            </button>
          </div>
        {:else}
          <div class="title-row">
            <h1>{currentList?.name}</h1>
            {#if auth.isAuthenticated}
              <button class="btn-secondary edit-btn" onclick={() => { editingListName = true; }}>
                Bearbeiten
              </button>
            {/if}
          </div>
        {/if}
      </div>

      <!-- Neues Item Formular -->
      {#if auth.isAuthenticated}
        <form class="create-form card" onsubmit={createItem}>
          <div class="form-row">
            <input
              type="text"
              placeholder="Neuer Artikel..."
              bind:value={newItemName}
              disabled={creating}
              class="item-name-input"
            />
            <div class="quantity-input">
              <label for="quantity">Menge:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                bind:value={newItemQuantity}
                disabled={creating}
              />
            </div>
            <button type="submit" class="btn-primary" disabled={creating}>
              {creating ? '...' : 'Hinzufügen'}
            </button>
          </div>
          {#if createError}
            <p class="error-message">{createError}</p>
          {/if}
        </form>
      {/if}

      <!-- Items Liste -->
      {#if currentItems.length === 0}
        <div class="empty-state card">
          <p>Diese Liste ist leer.</p>
          {#if auth.isAuthenticated}
            <p>Fügen Sie Artikel mit dem Formular oben hinzu.</p>
          {/if}
        </div>
      {:else}
        <ul class="items">
          {#each currentItems as item (item.id)}
            <li class="item-row card" class:checked={item.checked}>
              <div class="item-content">
                {#if auth.isAuthenticated}
                  <button
                    class="checkbox"
                    class:checked={item.checked}
                    onclick={() => toggleChecked(item)}
                    disabled={updatingItemId === item.id}
                    aria-label={item.checked ? 'Als nicht erledigt markieren' : 'Als erledigt markieren'}
                  >
                    {item.checked ? 'yurr' : ''}
                  </button>
                {/if}
                <span class="item-name" class:checked={item.checked}>{item.name}</span>
                <div class="item-quantity">
                  {#if auth.isAuthenticated}
                    <button
                      class="qty-btn"
                      onclick={() => updateQuantity(item, -1)}
                      disabled={updatingItemId === item.id || item.quantity <= 1}
                    >-</button>
                  {/if}
                  <span>{item.quantity}</span>
                  {#if auth.isAuthenticated}
                    <button
                      class="qty-btn"
                      onclick={() => updateQuantity(item, 1)}
                      disabled={updatingItemId === item.id}
                    >+</button>
                  {/if}
                </div>
                {#if auth.isAuthenticated}
                  <button
                    class="btn-danger delete-btn"
                    onclick={() => deleteItem(item.id)}
                    disabled={deletingItemId === item.id}
                  >
                    {deletingItemId === item.id ? '...' : 'X'}
                  </button>
                {/if}
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    {:catch error}
      <div class="card">
        {#if error.message === 'Liste nicht gefunden'}
          <h2>Liste nicht gefunden</h2>
          <p class="error-message">Die angeforderte Liste existiert nicht.</p>
        {:else}
          <p class="error-message">{error.message}</p>
        {/if}
        <a href="/lists" class="btn-primary" style="display: inline-block; margin-top: var(--spacing-md);">
          Zurück zur Übersicht
        </a>
      </div>
    {/await}
  {/if}
</div>

<style>
  .header-section {
    margin-bottom: var(--spacing-lg);
  }

  .back-link {
    display: inline-block;
    margin-bottom: var(--spacing-sm);
    color: var(--color-secondary);
  }

  .title-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  h1 {
    margin: 0;
  }

  .edit-btn {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: 0.875rem;
  }

  .edit-name-form {
    display: flex;
    gap: var(--spacing-sm);
    align-items: center;
  }

  .edit-name-form input {
    flex: 1;
    max-width: 300px;
  }

  .create-form {
    margin-bottom: var(--spacing-lg);
  }

  .form-row {
    display: flex;
    gap: var(--spacing-sm);
    align-items: flex-end;
    flex-wrap: wrap;
  }

  .item-name-input {
    flex: 1;
    min-width: 200px;
  }

  .quantity-input {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .quantity-input input {
    width: 60px;
    text-align: center;
  }

  .quantity-input label {
    margin: 0;
    white-space: nowrap;
  }

  .items {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .item-row {
    padding: var(--spacing-md);
  }

  .item-row.checked {
    opacity: 0.7;
    background-color: var(--color-background);
  }

  .item-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .checkbox {
    width: 24px;
    height: 24px;
    border: 2px solid var(--color-primary);
    border-radius: var(--border-radius);
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: var(--color-primary);
    padding: 0;
  }

  .checkbox.checked {
    background-color: var(--color-primary);
    color: white;
  }

  .item-name {
    flex: 1;
    font-weight: 500;
  }

  .item-name.checked {
    text-decoration: line-through;
    color: var(--color-secondary);
  }

  .item-quantity {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .qty-btn {
    width: 28px;
    height: 28px;
    padding: 0;
    background-color: var(--color-secondary);
    color: white;
    font-size: 1rem;
    line-height: 1;
  }

  .qty-btn:hover:not(:disabled) {
    background-color: var(--color-primary);
  }

  .delete-btn {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: 0.875rem;
  }
</style>
