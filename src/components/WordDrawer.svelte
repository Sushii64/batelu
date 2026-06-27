<script>
  import { words } from "../lib/words.js";
  let { word = $bindable(), navigate } = $props();

  let wordData = $derived(
    typeof word === "string"
      ? words.find((wword) => wword.word === word)
      : word,
  );

  const open = (newWord) => {
    word = newWord;
  };
  const close = () => {
    word = null;
  };

  function onWindowKeydown(e) {
    if (e.key === "Escape") {
      close();
    }
  }

  const formatDate = (d) => {
    if (!d) return "";
    const [day, month, year] = d.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
</script>

<svelte:window on:keydown={onWindowKeydown} />

{#if wordData}
  <div class="overlay" aria-hidden="true" onclick={close}></div>
  <div
    id="word-panel"
    class="drawer"
    role="dialog"
    aria-modal="true"
    aria-labelledby="panel-title"
    tabindex="-1"
  >
    <div class="drawer-handle" aria-hidden="true"></div>
    <header class="drawer-header">
      <h2 id="panel-title">{wordData.displayWord}</h2>
      {#if wordData.type === "verb" || wordData.type === "noun" || wordData.type === "modifier"}
        <button
          class="aside-top-button"
          onclick={() => {
            const { type, displayWord } = wordData;
            close();
            setTimeout(() => {
              navigate(`/inflect?type=${type}&q=${displayWord}`);
            });
          }}>Inflect</button
        >
      {/if}
      <button
        class="close aside-top-button"
        onclick={close}
        aria-label="Close details">×</button
      >
    </header>
    <section class="drawer-body">
      <div class="detail-display">
        <h1 class="detail-word">{wordData.displayWord}</h1>
        <p class="detail-syllables">
          {wordData.ipa?.ipa ?? "this word is invalid"}
        </p>
        <p class="detail-type">{wordData.type}</p>
        <label class="detail-label">definition</label>
        <p class="detail-text">{wordData.definition}</p>
        {#if wordData.usage}
          <label class="detail-label">usage</label>
          <p class="detail-text">{wordData.usage}</p>{/if}
        <label class="detail-label">etymology</label>
        {#snippet etymologyDescription(etymology)}
          {#if etymology === false}
            <li>a priori</li>
          {:else if Array.isArray(etymology)}
            {#if Array.isArray(etymology[0])}
              {#each etymology as subetymology, i}
                {@render etymologyDescription(subetymology)}
              {/each}
            {:else if Array.isArray(etymology[1])}
              <li>
                {#if etymology.length > 2 && etymology[2]}
                  <span class="ety-lang">{etymology[0]}</span>
                  <em class="ety-word">{etymology[1][0]}</em>
                  (<span class="ety-roman">{etymology[1][1]}</span>) "<span
                    class="ety-gloss">{etymology[2]}</span
                  >"
                {:else}
                  <span class="ety-lang">{etymology[0]}</span>
                  <em class="ety-word">{etymology[1][0]}</em>
                  (<span class="ety-roman">{etymology[1][1]}</span>)
                {/if}
              </li>
            {:else if etymology.length > 2 && etymology[2]}
              <li>
                <span class="ety-lang">{etymology[0]}</span>
                <em class="ety-word">{etymology[1]}</em>
                "<span class="ety-gloss">{etymology[2]}</span>"
              </li>
            {:else if etymology[0] === "Batelu"}
              {@const word = words.find((word) => word.word === etymology[1])}
              <li>
                <span class="ety-lang">{etymology[0]}</span>
                {#if word}
                  <em class="ety-word"
                    ><a
                      href={(() => {
                        const url = new URL(location.href);
                        url.searchParams.set("word", etymology[1]);
                        return url.toString();
                      })()}
                      onclick={(e) => {
                        e.preventDefault();
                        open(word);
                      }}>{word.displayWord}</a
                    ></em
                  >
                  "<span class="ety-gloss"
                    >{word.definition.split(", ")[0]}</span
                  >"
                  <ul>
                    {@render etymologyDescription(word.etymology)}
                  </ul>
                {:else}
                  <span class="ety-error">word not found ({etymology[1]})</span>
                {/if}
              </li>
            {:else}
              <li>
                <span class="ety-lang">{etymology[0]}</span>
                <em class="ety-word">{etymology[1]}</em>
              </li>
            {/if}
          {:else}
            <li>{etymology}</li>
          {/if}
        {/snippet}
        <ul class="detail-text detail-etymology">
          {@render etymologyDescription(wordData.etymology)}
        </ul>

        {#if wordData.date}
          <label class="detail-label">creation date</label>
          <p class="detail-text">{formatDate(wordData.date)}</p>
        {/if}
      </div>
    </section>
  </div>
{/if}

<style>
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
    from {
      transform: translate(-50%, calc(-50% + 14px));
      opacity: 0;
    }
    to {
      transform: translate(-50%, -50%);
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      transform: translateX(-50%) translateY(18px);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }

  .word-panel-trigger {
    border: 0;
    padding: 0;
    background: none;
  }
  /* Details panel: default = centered popup (desktop/tablet) */
  .drawer {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: clamp(320px, 92vw, 980px);
    max-height: 96vh; /* taller */
    min-height: 60vh; /* bigger minimum height */
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
    box-sizing: border-box; /* prevent layout overflow */
    overflow: hidden; /* clip internals (no horiz scroll) */
    animation: popIn 160ms ease-out;
  }

  .drawer-handle {
    display: none; /* only visible on mobile sheet */
  }

  .drawer-header {
    display: flex;
    align-items: stretch;
    gap: 0.5rem;
  }

  .drawer-header h2 {
    flex: 1;
    margin: 0.2rem 0 0.1rem;
    font-size: clamp(1.25rem, 2.2vw, 1.7rem);
    letter-spacing: 0.2px;
  }

  .aside-top-button {
    appearance: none;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--fg);
    border-radius: 12px;
    padding: 0.35rem 0.65rem;
    line-height: 1;
    cursor: pointer;
    width: auto;
  }
  .close {
    font-size: 1.6rem; /* bigger X */
  }

  .drawer-body {
    overflow-y: auto; /* scroll vertically when needed */
    overflow-x: hidden; /* never scroll horizontally */
    margin-top: 0.25rem;
    -webkit-overflow-scrolling: touch; /* smooth scroll on iOS */
    overflow-wrap: anywhere; /* avoid horizontal overflow from long text */
    padding-right: 2px; /* ensure scrollbar doesn't overlap text */
  }

  /* Popup content styling inspired layout */
  .detail-display {
    display: block;
    width: min(840px, 100%);
    margin: 0 auto;
    padding: 0.5rem 0.5rem 0.75rem;
    box-sizing: border-box;
  }

  .detail-word {
    font-family:
      system-ui,
      -apple-system,
      Segoe UI,
      Roboto,
      Helvetica,
      Arial,
      "Apple Color Emoji",
      "Segoe UI Emoji";
    font-weight: 800;
    font-size: clamp(2.4rem, 6vw, 3.6rem);
    line-height: 1.08;
    margin: 0 0 0.35rem 0;
    letter-spacing: 0.2px;
    color: var(--fg);
  }

  .detail-syllables {
    font-size: 1.1rem;
    color: var(--muted);
    margin: 0.3rem 0 0.9rem;
  }

  .detail-type {
    font-size: 1.1rem;
    color: var(--muted);
    margin: 0.3rem 0 0.9rem;
    font-style: italic;
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

  .detail-etymology ul {
    list-style: "← ";
    margin: 0;
  }
  .detail-etymology {
    list-style: "";
    padding: 0;
  }

  /* Etymology accents */
  .ety-lang {
    font-weight: 700;
  }
  .ety-word {
    font-style: italic;
  }
  .ety-roman {
    opacity: 0.95;
  }
  .ety-gloss {
    opacity: 0.92;
  }
  .ety-further {
    display: inline-block;
    margin-left: 20px;
  }
  .ety-error {
    color: var(--accent-error);
  }

  @media (max-width: 640px) {
    .detail-display {
      width: 100%;
    }

    .detail-word {
      font-size: clamp(2rem, 9vw, 2.6rem);
    }

    .detail-text {
      font-size: 1.08rem;
    }

    .drawer-handle {
      display: block;
      width: 48px;
      height: 5px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--fg) 14%, transparent);
      margin: 0 auto 0.6rem;
    }
  }
</style>
