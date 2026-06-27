<script>
  import ToolsHeader from "./ToolsHeader.svelte";
  import { ankiFormatWords } from "../../lib/anki.js";

  const blobURL = URL.createObjectURL(new Blob([ankiFormatWords]));

  export let navigate;
</script>

<main class="container">
  <ToolsHeader {navigate}>ankipawi</ToolsHeader>
  <p>
    Batelu's words in a format that can be imported into
    <a href="https://apps.ankiweb.net/">Anki</a>.
  </p>
  <p>
    <a href={blobURL} download="batelu-anki.tsv"
      >Click here to download the file.</a
    >
  </p>
  <pre><code>{ankiFormatWords}</code></pre>
</main>
