<script>
  import { frequencyOf } from "../lib/words";

  const frequency = (phoneme) => `${frequencyOf(phoneme) * 100}%`;
  let showFrequency = false;
</script>

<main class="container" class:show-frequency={showFrequency}>
	<h1>Phonology</h1>

	<h2>Syllables</h2>
	<p>Allowed syllable structures are CV, CVC, CVVC; and VC and V at the beginning of a word</p>
	<p>The sound's spelling is indicated in brackets after the sound. If there are no brackets, the spelling is the same as the IPA symbol.</p>

	{#snippet phoneme(ipa, orthography)}
     <td style:--frequency={frequency(ipa)}>
       {orthography ?? ipa}
     </td>
	{/snippet}

	<header>
	  <h2>Vowels</h2>
		<label>
		  <input type="checkbox" bind:checked={showFrequency}>
			Show frequencies
		</label>
	</header>
	<table>
		<thead>
			<tr>
				<th colspan="2">Front</th>
				<th>Central</th>
				<th>Back</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				{@render phoneme("i")}
        {@render phoneme("y (u)")}
				<td></td>
        <td></td>
			</tr>
			<tr>
				{@render phoneme("e")}
        <td></td>
				{@render phoneme("ə", "ə (y)")}
				{@render phoneme("o")}
			</tr>
			<tr>
				{@render phoneme("a")}
        <td></td>
				<td></td>
				<td></td>
			</tr>
		</tbody>
	</table>

	<h2>Consonants</h2>
	<table>
		<thead>
			<tr>
				<th></th>
				<th>Bilabial</th>
				<th>Alveolar</th>
				<th>Post-Alveolar</th>
				<th>Palatal</th>
				<th>Velar</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><b>Nasal</b></td>
				{@render phoneme("m")}
				{@render phoneme("n")}
				<td></td>
				<td></td>
				<td></td>
			</tr>
			<tr>
				<td><b>Unvoiced plosive</b></td>
				{@render phoneme("p")}
				{@render phoneme("t")}
				<td></td>
				<td></td>
				{@render phoneme("k")}
			</tr>
			<tr>
				<td><b>Voiced plosive</b></td>
				{@render phoneme("b")}
				{@render phoneme("d")}
				<td></td>
				<td></td>
				{@render phoneme("ɡ", "ɡ (g)")}
			</tr>
			<tr>
				<td><b>Unvoiced affricate</b></td>
				<td></td>
				<td style:--frequency={frequency("t")}>t͡s (z)</td>
				<td></td>
				<td></td>
				<td></td>
			</tr>
			<tr>
				<td><b>Unvoiced fricative</b></td>
				{@render phoneme("f")}
				<td></td>
				{@render phoneme("ʃ", "ʃ (s)")}
				{@render phoneme("ç", "ç (c)")}
				{@render phoneme("x")}
			</tr>
			<tr>
				<td><b>Voiced fricative</b></td>
				{@render phoneme("v")}
				<td></td>
				{@render phoneme("ʒ", "ʒ (ž or zh)")}
				<td></td>
				{@render phoneme("ɣ", "ɣ (ǧ or gh)")}
			</tr>
			<tr>
				<td><b>Approximant</b></td>
				{@render phoneme("w")}
				{@render phoneme("l")}
				<td></td>
				{@render phoneme("j")}
				{@render phoneme("w", "(w)")}
			</tr>
			<tr>
				<td><b>Trill</b></td>
				<td></td>
				{@render phoneme("r")}
				<td></td>
				<td></td>
				<td></td>
			</tr>
		</tbody>
	</table>
</main>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  main.show-frequency td {
    background-color: color-mix(var(--accent) calc(var(--frequency) * 0.5), transparent);
  }
</style>