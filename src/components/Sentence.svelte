<script>
  /**
   * @typedef {{ content: string; affix?: boolean }} Chunk
   * @typedef {Chunk | string} RawChunk
   * @typedef {{ role: string | null; batelu: RawChunk[]; english: RawChunk[] }} Word
   * @type {Word[]}
   */
  export let sentence;
  export let translation;

  const toChunk = (/** @type {RawChunk} */ rawChunk) => {
    if (typeof rawChunk === "string") return { content: rawChunk };
    return rawChunk;
  };
</script>

<div class="sentence">
  <div class="words">
    {#each sentence as word}
      <div class="word" data-role={word.role}>
        {#snippet chunks(/** @type {RawChunk[]} */ rawChunks)}
          {#each rawChunks as rawChunk}
            {@const chunk = toChunk(rawChunk)}
            <span class={{ chunk: true, affix: chunk.affix }}>
              {chunk.content}
            </span>
          {/each}
        {/snippet}
        <div class="word-batelu">
          {@render chunks(word.batelu)}
        </div>
        <div class="word-english">
          {@render chunks(word.english)}
        </div>
      </div>
    {/each}
  </div>
  <div class="sentence-translation">{translation}</div>
</div>

<style>
  .sentence {
    margin-left: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  @media (max-width: 480px) {
    .sentence {
      flex-direction: column;
      align-items: start;
      gap: 0;
    }
  }
  .words {
    display: flex;
    flex-wrap: wrap;
    gap: 0.7rem;
  }
  .word-batelu {
    color: color-mix(in srgb, var(--color) 90%, #fff 0%);
  }
  .word-english {
    font-size: 0.8rem;
    color: #888;
  }
  .sentence-translation {
    font-size: 0.8rem;
  }

  .chunk.affix {
    font-weight: bold;
  }

  .word[data-role="subject"] {
    --color: #52cbff;
  }
  .word[data-role="object"] {
    --color: #516eff;
  }
  .word[data-role="verb"] {
    --color: #ff5252;
  }
  .word[data-role="modifier"] {
    --color: #6cff52;
  }
  .word[data-role="particle"] {
    --color: #8052ff;
  }
  .word[data-role="adposition"] {
    --color: #ff52e2;
  }
  .word[data-role="numeral"] {
    --color: #ffcc33;
  }
</style>
