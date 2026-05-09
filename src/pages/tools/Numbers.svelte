<script>
  import {
    numberToBatelu,
    numberToShortBatelu,
    shortBateluToNumber,
  } from "../../lib/numberToBatelu";
  import ToolsHeader from "./ToolsHeader.svelte";

  export let navigate;

  let n = 0;

  let shorthand = "";
</script>

<main class="container">
  <ToolsHeader {navigate}>nimrapawi</ToolsHeader>
  Convert numbers to and from Batelu's dozenal system. See the About page for further
  information on the system.
  <h2>Decimal to Batelu</h2>
  <label>
    Enter a number:
    <input type="number" bind:value={n} />
  </label>
  <p>In Batelu:</p>
  <ul>
    <li>Shorthand: {numberToShortBatelu(n)}</li>
    <li>Long form: {numberToBatelu(n)}</li>
  </ul>
  <h2>Batelu to Decimal</h2>
  <label>
    Enter a Batelu number (in shorthand):
    <input type="text" bind:value={shorthand} />
  </label>
  <p>In decimal: {shorthand === "" ? "" : shortBateluToNumber(shorthand)}</p>
</main>

<style>
  input {
    box-sizing: border-box;
  }
</style>
