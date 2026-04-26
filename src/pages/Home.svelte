<script>
  import { words as wordsData } from "../lib/words.js";
  import itemsData from "./items.json";
  import { onMount } from "svelte";
  import { numberToBatelu } from "../lib/numberToBatelu.js";

  let words = wordsData.length;
  let items = itemsData.length;

  let vc = 0;
  let w = 0;
  let gr = 0;
  let c = 0;
  let v = 0;
  let l = 0;
  function increment() {
    vc += 0.025 * (183 - vc); // manually update until conjugation rules go in a json file retrieved by both this and the Inflections page
    w += 0.025 * (words - w);
    gr += 0.025 * (items - gr);
    c += 0.02 * (21 - c);
    v += 0.015 * (6 - v);
    l += 0.005 * (1 - l);
  }

  onMount(() => {
    setTimeout(() => {
      setInterval(increment, 30);
    }, 300);
  });

  let time = new Date();
  setInterval(() => {
    time = new Date();
  }, 500);
  $: hour = time.getHours();
  $: minute = time.getMinutes();
  $: second = time.getSeconds();
  $: word = (() => {
    if (hour >= 6 && hour <= 10) return "amcar";
    if (hour >= 11 && hour <= 13) return "rowon";
    if (hour >= 14 && hour <= 17) return "amcar";
    if (hour >= 18 && hour <= 21) return "itrej";
    return "dijo";
  })();
</script>

<main class="container">
  <h1>Batelu</h1>
  <p>
    {word}bon! {hour === 1 ? "" : "cu"}sat {numberToBatelu(hour)}
    {minute === 1 ? "" : "cu"}bun {numberToBatelu(minute)}
    {second === 1 ? "" : "cu"}sego {numberToBatelu(second)} onoer.
  </p>
  <p>
    welcome to batelu. more information about this language can be found on the
    About page.
  </p>
  <hr />
  <h2>stats</h2>

  <div class="stats">
    <div class="stat">
      <span class="fancy">{Math.round(w)}</span> word{Math.round(w) === 1
        ? ""
        : "s"}
    </div>
    <div class="stat">
      <span class="fancy">{Math.round(vc)}</span> verb conjugation{Math.round(
        vc,
      ) === 1
        ? ""
        : "s"}
    </div>
    <div class="stat">
      <span class="fancy">{Math.round(gr)}</span> grammar rule{Math.round(
        gr,
      ) === 1
        ? ""
        : "s"}
    </div>
    <div class="stat">
      <span class="fancy">{Math.round(c)}</span> consonant{Math.round(c) === 1
        ? ""
        : "s"}
    </div>
    <div class="stat">
      <span class="fancy">{Math.round(v)}</span> vowel{Math.round(v) === 1
        ? ""
        : "s"}
    </div>
    <div class="stat">
      <span class="fancy">{Math.round(l)}</span> language{Math.round(l) === 1
        ? ""
        : "s"}
    </div>
  </div>

  <p>
    check out the conjugation/pronouns spreadsheet: <a
      href="https://docs.google.com/spreadsheets/d/1-hEdtf7EK9FfPEpfMT1NzB222KUJgFtyccIxuLS_V90/edit?gid=0#gid=0"
      >google sheets</a
    >
  </p>
  <p>join the <a href="https://discord.gg/PqRqeztXQF">discord</a> :3</p>
</main>

<style>
  .stats {
    font-size: 2rem;
    margin-left: 20px;
  }
  .stat {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  .fancy {
    font-size: 3rem;
    font-weight: 900;
    background-image: linear-gradient(90deg, violet, yellow);
    color: transparent;
    background-clip: text;
    vertical-align: middle;
  }
</style>
