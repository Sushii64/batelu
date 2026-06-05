<script>
  import MapImage from "../components/MapImage.svelte";
  import { words } from "../lib/words.js";
  import { languagesToCountries } from "../lib/languagesToCountries";
  import { onMount } from "svelte";

  export let navigate;

  const KNOWN_MISSING_LANGUAGES = new Set([
    "Batelu",
    "Proto-Indo-European",
    "Selsimicu",
    "Akkadian",
    "Gothic",
    "xɑ💥",
    "Uwulang",
    "This Thing",
    "Toki Pona",
    "Sanskrit",
    "Unnamed Conlang 3",
    "Esperanto",
    "Old Church Slavonic",
    "Ottoman Turkish",
  ]);
  const missingLanguages = new Set();
  const countryAmounts = new Map();
  const countryWords = new Map();
  let maxAmount = 0;
  words.forEach((word) => {
    if (!Array.isArray(word.etymology) || typeof word.etymology[0] !== "string")
      return;
    const language = word.etymology[0];
    if (
      !Object.hasOwn(languagesToCountries, language) &&
      !KNOWN_MISSING_LANGUAGES.has(language)
    ) {
      missingLanguages.add(language);
    }
    const countries = languagesToCountries[language];
    if (!countries) return;
    countries.forEach((country) => {
      const amount = countryAmounts.get(country);
      const newAmount = (amount ?? 0) + 1;
      if (newAmount > maxAmount) maxAmount = newAmount;
      countryAmounts.set(country, newAmount);

      if (countryWords.has(country)) {
        countryWords.get(country).push(word);
      } else {
        countryWords.set(country, [word]);
      }
    });
  });
  countryWords.forEach((words) => {
    words.sort((a, b) => a.word.localeCompare(b.word));
  });

  let countryTitles = new Map();
  let svg;
  $: {
    if (svg) {
      countryAmounts.forEach((amount, country) => {
        const element = svg.element().getElementById(country);
        if (!element) {
          return;
        }
        const distribution = countryAmounts.get(country) / maxAmount;
        const percentage = String(distribution * 100) + "%";
        const color = `color-mix(in oklch, rgb(255, 0, 0) ${percentage}, #c0c0c0)`;
        element.style.fill = color;
        element.querySelectorAll("path").forEach((path) => {
          path.style.fill = color;
        });
        if (element.firstChild?.dataset.title) {
          countryTitles.set(country, element.firstChild.dataset.title);
        }
        for (
          let parent = element;
          parent.nodeName !== "svg";
          parent = parent.parentElement
        ) {
          if (parent.dataset.title) {
            countryTitles.set(country, parent.dataset.title);
            break;
          }
        }
      });
      countryTitles = countryTitles;
    }
  }

  $: sortedCountryAmounts = [...countryAmounts.entries()]
    .map(([country, amount]) => ({ country, amount }))
    .sort((a, b) =>
      countryTitles.get(a.country)?.localeCompare(countryTitles.get(b.country)),
    );

  /** @type {string | null} */
  let currentCountry = null;
  $: currentCountryWords = currentCountry
    ? countryWords.get(currentCountry)
    : null;
  $: infoCountryWords =
    currentCountryWords === null
      ? null
      : Object.entries(
          currentCountryWords.reduce((acc, word) => {
            const displayWord = word.word.replace(/\d+$/, "");
            const summary = word.definition.split(", ")[0];
            const newWord = { ...word, displayWord, summary };
            if (Object.hasOwn(acc, word.etymology[0])) {
              acc[word.etymology[0]].push(newWord);
            } else {
              acc[word.etymology[0]] = [newWord];
            }
            return acc;
          }, {}),
        ).sort((a, b) => a[0].localeCompare(b[0]));

  const onMouseOver = (e) => {
    currentCountry = null;
    for (
      let parent = e.target;
      parent.nodeName !== "svg";
      parent = parent.parentElement
    ) {
      const maybeCountry = parent.id;
      if (countryWords.has(maybeCountry)) {
        currentCountry = maybeCountry;
        return;
      }
    }
  };

  let dropdownValue = "";
  let showMap = true;
  $: {
    if (dropdownValue === "") {
      showMap = true;
      currentCountry = null;
    } else {
      showMap = false;
      currentCountry = dropdownValue;
    }
  }

  let mousePosition = null;
  onMount(() => {
    const evt = (m) => {
      mousePosition = { x: m.clientX, y: m.clientY };
    };
    document.body.addEventListener("mousemove", evt);
    return () => {
      document.body.removeEventListener("mousemove", evt);
    };
  });

  const moveIfHovering =
    ({ x: mx, y: my }) =>
    (/** @type {HTMLElement} */ el) => {
      el.classList.remove("hoverer-top-right");
      const rect = el.getBoundingClientRect();
      const { x: ex, y: ey } = rect,
        ex2 = ex + rect.width,
        ey2 = ey + rect.height;
      if (mx >= ex && mx <= ex2 && my >= ey && my <= ey2) {
        el.classList.add("hoverer-top-right");
      }
    };
</script>

<div class="container">
  <header class="main-header">
    <h1>Etymology</h1>
    <a href="/" on:click|preventDefault={() => navigate("/words")}>Back</a>
  </header>
  {#if missingLanguages.size}
    <div>
      The following languages are not displayed on the map:
      <ul>
        {#each missingLanguages as language}
          <li>{language}</li>
        {/each}
      </ul>
    </div>
  {/if}
  <div>
    Hover on a country on the map, or pick one from this list:
    <select bind:value={dropdownValue} class="country-dropdown">
      <option value="" selected>Show map</option>
      {#each sortedCountryAmounts as { country, amount }}
        <option value={country}
          >{countryTitles.get(country) ?? country} - {amount}</option
        >
      {/each}
    </select>
  </div>
  {#if showMap}
    <div class="no-coarse">
      This map isn't a great experience on touchscreens and/or smaller screens.
      Sorry!
    </div>
  {/if}
  <div class="map-wrapper">
    {#if showMap}
      <MapImage onmousemove={onMouseOver} bind:this={svg} />
    {/if}
    {#if currentCountry !== null}
      <div
        class={{ hoverer: true, "map-shown": showMap }}
        {@attach moveIfHovering(mousePosition)}
      >
        <div class="country-name">
          {countryTitles.get(currentCountry) ?? currentCountry} - {currentCountryWords.length}
        </div>
        <div class="words">
          {#each infoCountryWords as [language, words]}
            {#each words as word, i}
              <div class={{ word: true, last: i === words.length - 1 }}>
                {#if i === 0}
                  <div class="language-name">{language}</div>
                {/if}
                <div class="word-name">{word.displayWord} - {word.summary}</div>
                <div class="word-etymology">
                  <small>
                    ← {Array.isArray(word.etymology[1])
                      ? `${word.etymology[1][0]} (${word.etymology[1][1]})`
                      : word.etymology[1]}
                  </small>
                </div>
              </div>
            {/each}
          {/each}
        </div>
      </div>
    {/if}
  </div>
  {#if showMap}
    <footer>
      <small>
        map from <a
          href="https://commons.wikimedia.org/wiki/File:BlankMap-World.svg"
          target="_blank"
        >
          https://commons.wikimedia.org/wiki/File:BlankMap-World.svg
        </a>
      </small>
    </footer>
  {/if}
</div>

<style>
  .main-header {
    display: flex;
    align-items: baseline;
  }
  .main-header h1 {
    flex: 1;
  }
  .country-dropdown {
    margin-bottom: 0.5rem;
  }
  .no-coarse {
    display: none;
  }
  @media (pointer: coarse) {
    .no-coarse {
      display: block;
      margin-bottom: 1rem;
    }
  }
  .map-wrapper {
    display: flex;
    position: relative;
  }
  .hoverer {
    padding: 5px 10px;
    pointer-events: none;
  }
  .hoverer.map-shown {
    background-color: #000d;
    position: absolute;
    left: 1px;
    bottom: 1px;
    border-bottom-left-radius: 10px;
  }
  .hoverer.map-shown:global(.hoverer-top-right) {
    left: auto;
    bottom: auto;
    top: 1px;
    right: 1px;
    border-bottom-left-radius: 0px;
    border-top-right-radius: 10px;
  }
  .country-name {
    display: none;
  }
  .hoverer.map-shown .country-name {
    display: block;
    font-weight: bold;
  }
  /*
   * The writing-mode properties are a slightly insane hack, see
   * https://stackoverflow.com/a/41209546
   */
  .words {
    display: flex;
    flex-wrap: wrap;
    max-height: 300px;
    writing-mode: vertical-lr;
    row-gap: 2rem;
    column-gap: 0.25rem;
  }
  .word {
    writing-mode: horizontal-tb;
  }
  .language-name {
    font-weight: bold;
  }
  .word.last {
    margin-bottom: 1rem;
  }
  .word-etymology {
    line-height: 1;
  }
  footer {
    text-align: right;
  }
</style>
