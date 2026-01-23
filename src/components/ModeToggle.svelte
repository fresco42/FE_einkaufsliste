<script lang="ts">
  // Einfacher Theme-Toggle ohne externe Library
  let isDark = $state(false)

  // Beim Mount: Theme laden
  $effect(() => {
    const saved = localStorage.getItem('theme')
    isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)
    applyTheme()
  })

  function applyTheme() {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  function toggle() {
    isDark = !isDark
    applyTheme()
  }
</script>

<button class="mode-toggle" onclick={toggle} aria-label="Farbmodus wechseln">
  {#if isDark}
    <!-- Sonne = auf Light wechseln -->
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
    </svg>
  {:else}
    <!-- Mond = auf Dark wechseln -->
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
    </svg>
  {/if}
</button>

<style>
  .mode-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 0;
    background-color: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: var(--border-radius);
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .mode-toggle:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
</style>
