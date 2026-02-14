<script>
  import itemsData from './items.json';
  let items = itemsData.map((item, index) => ({ ...item, index }));

  import { tick, onMount } from 'svelte';

  let q = '';
  let sortBy = 'newest';
  let selected = null;
  let drawerEl;
  let initialized = false;

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('q')) q = params.get('q');
    if (params.has('sort')) sortBy = params.get('sort');

    if (params.has('item')) {
      const idx = parseInt(params.get('item'), 10);
      const item = items.find(i => i.index === idx);
      if (item) selected = item;
    }
    initialized = true;
  });

  // Update URL when search, sort, or selection changes
  $: {
    if (initialized && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (q.trim()) url.searchParams.set('q', q.trim());
      else url.searchParams.delete('q');

      if (sortBy !== 'newest') url.searchParams.set('sort', sortBy);
      else url.searchParams.delete('sort');

      if (selected) url.searchParams.set('item', selected.index);
      else url.searchParams.delete('item');

      window.history.replaceState({}, '', url.toString());
    }
  }

  $: normalized = q.trim().toLowerCase();
  $: filtered = normalized
    ? items.filter(item =>
        item.description.toLowerCase().includes(normalized) ||
        item.tags.some(tag => tag.toLowerCase().includes(normalized))
      )
    : items;
  $: sorted = (() => {
    const copy = [...filtered];
    switch (sortBy) {
      case 'newest':
        // Newest are at the end of the list, so show the end first
        return copy.reverse();
      case 'oldest':
        // Oldest are at the start, preserve original order
        return copy;
      case 'description':
        return copy.sort((a, b) => a.description.localeCompare(b.description));
      case 'tags':
        return copy.sort((a, b) => {
          const aFirstTag = a.tags[0] || '';
          const bFirstTag = b.tags[0] || '';
          return aFirstTag.localeCompare(bFirstTag);
        });
      default:
        return copy;
    }
  })();

  async function open(item) {
    selected = item;
    await tick();
    drawerEl?.focus();
  }
  function close() {
    selected = null;
  }
  function onCardKeydown(e, item) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open(item);
    }
  }
  function onWindowKeydown(e) {
    if (e.key === 'Escape') {
      close();
    }
  }

  // Prevent background scroll when drawer is open
  $: (document && document.body) && (document.body.style.overflow = selected ? 'hidden' : '');

  // Make tags clickable to set search; if from popup, also close the popup
  function clickTag(tag) {
    q = tag;
    if (selected) close();
  }
</script>

<svelte:window on:keydown={onWindowKeydown} />

<main class="container">
	<h1>Reference</h1>

  <div class="search">
    <input
      id="reference-search"
      type="search"
      placeholder="Search by description or tags…"
      bind:value={q}
      autocomplete="off"
      spellcheck="false"
      aria-controls="reference-grid"
      aria-label="Search reference items"
    />
    <span class="count" aria-live="polite">
      {sorted.length}
    </span>
  </div>

  <div class="sort-control">
    <label for="sort-select">Sort:</label>
    <select id="sort-select" bind:value={sortBy} aria-label="Sort order">
      <option value="newest">Newest First</option>
      <option value="oldest">Oldest First</option>
      <option value="description">Description (A → Z)</option>
      <option value="tags">Tags (A → Z)</option>
    </select>
  </div>
</main>
<section class="cards-wrap">
  <div id="reference-grid" class="grid" role="list">
    {#if sorted.length === 0}
      <div class="empty">No matches. Try a different search.</div>
    {:else}
      {#each sorted as item, index (item.description + index)}
        <div
           class="card"
           role="listitem"
           tabindex="0"
           aria-label={`Reference item`}
           aria-controls="reference-panel"
           on:click={() => open(item)}
           on:keydown={(e) => onCardKeydown(e, item)}
         >
           <!-- accent removed on this page -->
           <p class="description">{item.description}</p>
           <div class="tags">
             {#each item.tags as tag}
               <span
                 class="tag"
                 role="button"
                 tabindex="0"
                 aria-label={`Filter by ${tag}`}
                 on:click|stopPropagation={() => clickTag(tag)}
                 on:keydown|stopPropagation={(e) => {
                   if (e.key === 'Enter' || e.key === ' ') {
                     e.preventDefault();
                     clickTag(tag);
                   }
                 }}
               >{tag}</span>
             {/each}
           </div>
        </div>
      {/each}
    {/if}
  </div>
</section>

{#if selected}
  <div class="overlay" aria-hidden="true" on:click={close}></div>
  <aside
    id="reference-panel"
    class="drawer"
    role="dialog"
    aria-modal="true"
    aria-labelledby="panel-title"
    bind:this={drawerEl}
    tabindex="-1"
  >
    <div class="drawer-handle" aria-hidden="true"></div>
    <header class="drawer-header">
      <h2 id="panel-title">Reference Details</h2>
      <button class="close" on:click={close} aria-label="Close details">×</button>
    </header>
    <section class="drawer-body">
      <div class="detail-display">
        <label class="detail-label">description</label>
        <p class="detail-text">{selected.description}</p>

        <label class="detail-label">tags</label>
        <div class="detail-tags">
          {#each selected.tags as tag}
            <span
              class="detail-tag"
              role="button"
              tabindex="0"
              aria-label={`Filter by ${tag}`}
              on:click|stopPropagation={() => clickTag(tag)}
              on:keydown|stopPropagation={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  clickTag(tag);
                }
              }}
            >{tag}</span>
          {/each}
        </div>
      </div>
    </section>
  </aside>
{/if}

<style>
  /* Search (layout fix for count alignment) */
  .search {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 0.6rem;
    margin-block: 0.25rem 0.75rem;
  }

  .search input {
    padding: 0.75rem 1rem;
    min-height: 44px;
    border-radius: 12px;
    background: #0f0f0f;
    border: 1px solid var(--border);
    color: var(--fg);
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .search input:focus {
    border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 28%, transparent);
  }

  .search .count {
    min-width: 2.6rem;
    height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.7rem;
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--muted);
    background: #0f0f0f;
    line-height: 1;
  }

  /* Sort control */
  .sort-control {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .sort-control label {
    color: var(--muted);
    font-weight: 600;
    font-size: 0.95rem;
  }

  .sort-control select {
    padding: 0.5rem 0.75rem;
    border-radius: 10px;
    background: #0f0f0f;
    border: 1px solid var(--border);
    color: var(--fg);
    outline: none;
    cursor: pointer;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    font-size: 0.95rem;
  }

  .sort-control select:focus {
    border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 28%, transparent);
  }

  .sort-control select:hover {
    border-color: color-mix(in srgb, var(--accent) 35%, var(--border));
  }

  /* Wide, backgroundless wrapper (outside .container) */
  .cards-wrap {
    width: clamp(320px, 96vw, 1240px);
    margin: 0.75rem auto 2rem;
    padding: 0;
  }

  /* Scrollable grid */
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 0.9rem;
  }

  .empty {
    grid-column: 1 / -1;
    color: var(--muted);
    text-align: center;
    padding: 1rem 0.5rem;
    border: 1px dashed var(--border);
    border-radius: 12px;
    background: color-mix(in srgb, var(--fg) 2%, transparent);
  }

  /* Cards */
  .card {
    position: relative;
    display: grid;
    grid-template-rows: auto 1fr auto;
    gap: 0.5rem;

    border: 1px solid var(--border);
    border-radius: 14px;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 40%),
      #101010;
    padding: 0.8rem 0.9rem;

    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.03) inset,
      0 8px 20px rgba(0, 0, 0, 0.20);
    transition:
      transform 120ms ease,
      border-color 160ms ease,
      box-shadow 160ms ease,
      background-color 160ms ease;

    cursor: pointer;
    height: clamp(110px, 16vh, 150px);
    box-sizing: border-box;
  }

  /* Accent removed on this page, so no .card .accent rules */

  .card:hover,
  .card:focus-visible {
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--accent) 35%, var(--border));
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.04) inset,
      0 12px 28px rgba(0, 0, 0, 0.26);
  }

  .description {
    color: var(--fg);
    font-size: 0.96rem;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    align-items: flex-end;
  }

  .tag {
    display: inline-block;
    padding: 0.2rem 0.5rem;
    background: color-mix(in srgb, var(--accent) 20%, transparent);
    border: 1px solid color-mix(in srgb, var(--accent) 40%, var(--border));
    border-radius: 6px;
    font-size: 0.8rem;
    color: var(--accent);
    font-weight: 600;
    cursor: pointer;
  }

  .tag:hover,
  .detail-tag:hover {
    filter: brightness(1.1);
  }

  /* Overlay (full-screen backdrop) */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    z-index: 60;
  }

  /* Keyframes (top-level for compatibility) */
  @keyframes popIn {
    from { transform: translate(-50%, calc(-50% + 14px)); opacity: 0; }
    to { transform: translate(-50%, -50%); opacity: 1; }
  }

  /* Details panel: default = centered popup (desktop/tablet) */
  .drawer {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: clamp(320px, 92vw, 980px);
    max-height: 96vh;
    min-height: 60vh;
    background: #101010;
    border: 1px solid var(--border);
    border-radius: 18px;
    box-shadow:
      0 24px 70px rgba(0, 0, 0, 0.55),
      0 1px 0 rgba(255, 255, 255, 0.04) inset;
    z-index: 70;
    display: grid;
    grid-template-rows: auto 1fr;
    padding: 1rem 1.2rem 1.2rem;
    box-sizing: border-box;
    overflow: hidden;
    animation: popIn 160ms ease-out;
  }

  .drawer-handle {
    display: none; /* only visible on mobile sheet */
  }

  .drawer-header {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 0.5rem;
  }

  .drawer-header h2 {
    margin: 0.2rem 0 0.1rem;
    font-size: clamp(1.25rem, 2.2vw, 1.7rem);
    letter-spacing: 0.2px;
  }

  .close {
    appearance: none;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--fg);
    border-radius: 12px;
    padding: 0.35rem 0.65rem;
    font-size: 1.6rem;
    line-height: 1;
    cursor: pointer;
  }

  .drawer-body {
    overflow-y: auto;
    overflow-x: hidden;
    margin-top: 0.25rem;
    -webkit-overflow-scrolling: touch;
    overflow-wrap: anywhere;
    padding-right: 2px;
  }

  /* Popup content styling */
  .detail-display {
    display: block;
    width: min(840px, 100%);
    margin: 0 auto;
    padding: 0.5rem 0.5rem 0.75rem;
    box-sizing: border-box;
  }

  .detail-label {
    display: block;
    font-weight: 700;
    color: var(--muted);
    margin-top: 1rem;
    letter-spacing: 0.2px;
  }

  .detail-text {
    margin: 0.45rem 0 0.35rem;
    font-size: 1.18rem;
    line-height: 1.65;
    color: var(--fg);
  }

  .detail-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .detail-tag {
    display: inline-block;
    padding: 0.4rem 0.8rem;
    background: color-mix(in srgb, var(--accent) 20%, transparent);
    border: 1px solid color-mix(in srgb, var(--accent) 40%, var(--border));
    border-radius: 8px;
    font-size: 0.95rem;
    color: var(--accent);
    font-weight: 600;
    cursor: pointer;
  }

  /* Mobile: turn into bottom sheet/drawer */
  @media (max-width: 640px) {
    .search {
      grid-template-columns: 1fr auto;
      gap: 0.5rem;
    }
    .search input {
      min-height: 48px;
    }
    .search .count {
      height: 48px;
      min-width: 2.8rem;
    }

    .cards-wrap {
      width: 100%;
      padding-inline: 0;
      margin-inline: 0;
    }

    .grid {
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 0.75rem;
    }

    .card {
      border-radius: 12px;
      padding: 0.7rem 0.8rem;
      height: clamp(100px, 18vh, 140px);
    }
  }
</style>