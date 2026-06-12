<script lang="ts">
  import { fontAwesomeIcons } from "./font-awesome-icons";

  const { onselect = (_name: string) => {} } = $props();

  let query = $state("");
  let recentIcons = $state([
    "solid:star",
    "solid:heart",
    "solid:check",
    "solid:tag",
    "solid:print",
    "solid:gift",
  ]);

  const filteredIcons = $derived(
    fontAwesomeIcons.filter((icon) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        icon.searchText.includes(q)
      );
    }),
  );

  const recentFontAwesomeIcons = $derived(
    recentIcons
      .map((token) => fontAwesomeIcons.find((icon) => icon.token === token))
      .filter((icon) => icon !== undefined),
  );

  function selectIcon(token: string) {
    recentIcons = [token, ...recentIcons.filter((icon) => icon !== token)].slice(
      0,
      8,
    );
    onselect(token);
  }
</script>

<font-awesome-picker>
  <div class="header">
    <h3>Pick a Font Awesome icon</h3>
    <input bind:value={query} placeholder="Search icons..." />
  </div>

  <div class="grid-container">
    {#if recentFontAwesomeIcons.length > 0 && !query.trim()}
      <div class="section">
        <p>Recent</p>
        <div class="grid">
          {#each recentFontAwesomeIcons as icon}
            <button
              onclick={() => selectIcon(icon.token)}
              class="icon-btn"
              title={`${icon.label} (${icon.style})`}
            >
              <span class="fa-icon {icon.style}">
                {icon.unicode}
              </span>
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <div class="section">
      <p>{query.trim() ? `${filteredIcons.length} Results` : "All Free Icons"}</p>
      <div class="grid">
        {#each filteredIcons as icon}
          <button
            onclick={() => selectIcon(icon.token)}
            class="icon-btn"
            title={`${icon.label} (${icon.style})`}
          >
            <span class="fa-icon {icon.style}">
              {icon.unicode}
            </span>
          </button>
        {/each}
      </div>
    </div>
  </div>
</font-awesome-picker>

<style>
  font-awesome-picker {
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f8f8f8;
    width: 100%;
    flex-grow: 0;
  }

  .header {
    display: flex;
    align-items: stretch;
    gap: 0.5em;
    padding: 0.5em;
    border-bottom: 1px solid #ccc;
    flex-direction: column;
  }

  h3 {
    margin: 0;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 600;
    color: #111827;
  }

  input {
    box-sizing: border-box;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 0.5em;
    font: inherit;
  }

  button {
    border: none;
    background: none;
  }

  .grid-container {
    height: 14rem;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
    padding: 0.75em 1em;
  }

  .section {
    margin-bottom: 0.75em;
  }

  .section p {
    font-size: 0.75em;
    line-height: 1em;
    font-weight: 500;
    color: #778;
    text-transform: uppercase;
    margin-top: 0;
    margin-bottom: 0.25em;
  }

  .grid {
    display: flex;
    flex-wrap: wrap;
    flex-grow: 0;
    gap: 0.25rem;
    max-width: 448px;
  }

  .icon-btn {
    width: 2em;
    height: 2em;
    font-size: 1.25em;
    line-height: 1.75em;
    border-radius: 0.25em;
  }

  .fa-icon.solid {
    font-family: "Font Awesome 7 Free";
    font-weight: 900;
  }

  .fa-icon.regular {
    font-family: "Font Awesome 7 Free";
    font-weight: 400;
  }

  .fa-icon.brands {
    font-family: "Font Awesome 7 Brands";
    font-weight: 400;
  }

  .icon-btn:hover {
    background-color: #dde;
    transform: scale(1.5);
  }

  .icon-btn:active {
    transform: scale(0.95);
  }
</style>
