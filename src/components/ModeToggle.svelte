<script lang="ts">
  import Sun from "lucide-svelte/icons/sun";
  import Moon from "lucide-svelte/icons/moon";
  import { toggleMode } from "mode-watcher";
</script>

<button class="mode-toggle" onclick={toggleMode} aria-label="Farbmodus wechseln">
  <Sun class="icon sun" />
  <Moon class="icon moon" />
  <span class="sr-only">Toggle theme</span>
</button>

<style>
  .mode-toggle {
    position: relative;
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

  .mode-toggle :global(.icon) {
    position: absolute;
    width: 20px;
    height: 20px;
    transition: transform 0.3s, opacity 0.3s;
  }

  .mode-toggle :global(.sun) {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }

  .mode-toggle :global(.moon) {
    transform: rotate(90deg) scale(0);
    opacity: 0;
  }

  :global(.dark) .mode-toggle :global(.sun) {
    transform: rotate(-90deg) scale(0);
    opacity: 0;
  }

  :global(.dark) .mode-toggle :global(.moon) {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
