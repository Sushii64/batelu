<script>
  import { onMount } from "svelte";
  import { toIPA } from "../lib/toIPA";
  import { words } from "../lib/words.js";

  let wordType = "verb";
  let initialized = false;
  let word = "";
  const computeVerbWord = (word, wordType) => {
    if (wordType !== "verb") return null;
    const match = word.match(/^(.*)([aeiouy])re$/);
    if (!match) return null;
    return { stem: match[1], vowel: match[2] };
  };
  $: verbWord = computeVerbWord(word, wordType);
  const getError = (word, wordType, verbWord) => {
    if (word === "") return { error: false };
    const ipa = toIPA(word);
    if (ipa.error) return ipa;
    if (wordType === "verb" && !verbWord)
      return { error: true, message: "Missing -Vre at the end of verb" };
    return { error: false, ipa: ipa.ipa, verbWord, word };
  };
  $: validatedWord = getError(word, wordType, verbWord);
  $: deducedWordType = (() => {
    if (wordType === "pronoun") return null;
    let possibleWord = words.find((w) => w.word === word);
    if (
      possibleWord &&
      (possibleWord.type === "noun" ||
        possibleWord.type === "verb" ||
        possibleWord.type === "modifier")
    ) {
      return possibleWord.type;
    }
    return null;
  })();
  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("type")) {
      const paramWordType = params.get("type");
      if (
        paramWordType === "noun" ||
        paramWordType === "verb" ||
        paramWordType === "modifier" ||
        paramWordType === "pronoun"
      ) {
        wordType = paramWordType;
      }
    }
    if (params.has("q")) {
      word = params.get("q");
    }
    initialized = true;
  });

  $: {
    if (initialized && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("type", wordType);
      if (
        word &&
        !(wordType === "verb" && !verbWord) &&
        wordType !== "pronoun"
      ) {
        url.searchParams.set("q", word);
      } else {
        url.searchParams.delete("q");
      }
      window.history.replaceState({}, "", url.toString());
    }
  }
</script>

<main class="container">
  <h1>Inflections</h1>
  <div class="header">
    <button
      class={{ "btn-primary": wordType === "verb" }}
      on:click={() => (wordType = "verb")}>Verbs</button
    >
    <button
      class={{ "btn-primary": wordType === "noun" }}
      on:click={() => (wordType = "noun")}>Nouns</button
    >
    <button
      class={{ "btn-primary": wordType === "modifier" }}
      on:click={() => (wordType = "modifier")}>Modifiers</button
    >
    <button
      class={{ "btn-primary": wordType === "pronoun" }}
      on:click={() => (wordType = "pronoun")}>Pronouns</button
    >
    <div class="word-entry-wrapper">
      <input
        type="text"
        placeholder="Word"
        class={{
          "word-entry": true,
          "word-entry-error": validatedWord.error,
        }}
        bind:value={word}
        disabled={wordType === "pronoun"}
        aria-invalid={validatedWord.error}
      />
      <div
        class={{
          "word-entry-status-message": true,
          "word-entry-status-message-error": validatedWord.error,
        }}
      >
        {validatedWord.error
          ? validatedWord.message
          : (validatedWord.ipa ?? "(no word, showing affixes)")}
      </div>
    </div>
  </div>
  {#if deducedWordType && deducedWordType !== wordType}
    <div class="warning word-entry-status-message">
      This word appears to be a {deducedWordType}. Did you mean to view the
      inflections for {deducedWordType}s instead?
    </div>
  {/if}
  <hr />
  <div class="inflect-tables">
    {#if wordType === "verb"}
      {#snippet conjugate(ending, vowel)}
        <span class="inflections-secondary"
          >{validatedWord.verbWord?.stem ?? "-"}</span
        >{#if vowel}<span class="inflections-vowel"
            >{validatedWord.verbWord?.vowel ?? "V"}</span
          >{/if}{ending}
      {/snippet}
      <table>
        <thead>
          <tr>
            <th>Infinitive Past</th>
            <th>Infinitive Present</th>
            <th>Infinitive Future</th>
          </tr></thead
        >
        <tbody>
          <tr>
            <td>{@render conjugate("rera", true)}</td>
            <td>{@render conjugate("re", true)}</td>
            <td>{@render conjugate("reri", true)}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th class="table-name" colspan="3">1st Person Singular</th>
            <th>Simple</th>
            <th>Continous</th>
            <th>Perfect</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowspan="6" class="no-bottom-border horizontal-header">
              <b>Animate</b><br /><b>Inanimate </b>
            </td>
            <td rowspan="3" class="td-bottom horizontal-header"
              ><b>Intentional</b></td
            >
            <td class="horizontal-header"><b>Past</b></td>
            <td>{@render conjugate("a")}</td>
            <td>{@render conjugate("ad")}</td>
            <td>{@render conjugate("ak")}</td>
          </tr>
          <tr>
            <td class="horizontal-header"><b>Present</b></td>
            <td>{@render conjugate("e")}</td>
            <td>{@render conjugate("ed")}</td>
            <td>{@render conjugate("ek")}</td>
          </tr>
          <tr class="tr-bottom">
            <td class="horizontal-header"><b>Future</b></td>
            <td>{@render conjugate("i")}</td>
            <td>{@render conjugate("id")}</td>
            <td>{@render conjugate("ik")}</td>
          </tr>
          <tr>
            <td rowspan="3" class="no-bottom-border horizontal-header"
              ><b>Unintentional</b></td
            >
            <td class="horizontal-header"><b>Past</b></td>
            <td>{@render conjugate("o")}</td>
            <td>{@render conjugate("od")}</td>
            <td>{@render conjugate("ok")}</td>
          </tr>
          <tr>
            <td class="horizontal-header"><b>Present</b></td>
            <td>{@render conjugate("u")}</td>
            <td>{@render conjugate("ud")}</td>
            <td>{@render conjugate("uk")}</td>
          </tr>
          <tr>
            <td class="horizontal-header"><b>Future</b></td>
            <td>{@render conjugate("y")}</td>
            <td>{@render conjugate("yd")}</td>
            <td>{@render conjugate("yk")}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th class="table-name" colspan="3">1st Person Plural</th>
            <th>Simple</th>
            <th>Continous</th>
            <th>Perfect</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowspan="6" class="no-bottom-border horizontal-header">
              <b>Animate</b><br /><b>Inanimate </b>
            </td>
            <td rowspan="3" class="td-bottom horizontal-header"
              ><b>Intentional</b></td
            >
            <td class="horizontal-header"><b>Past</b></td>
            <td>{@render conjugate("at")}</td>
            <td>{@render conjugate("ag")}</td>
            <td>{@render conjugate("ar")}</td>
          </tr>
          <tr>
            <td class="horizontal-header"><b>Present</b></td>
            <td>{@render conjugate("et")}</td>
            <td>{@render conjugate("eg")}</td>
            <td>{@render conjugate("er")}</td>
          </tr>
          <tr class="tr-bottom">
            <td class="horizontal-header"><b>Future</b></td>
            <td>{@render conjugate("it")}</td>
            <td>{@render conjugate("ig")}</td>
            <td>{@render conjugate("ir")}</td>
          </tr>
          <tr>
            <td rowspan="3" class="no-bottom-border horizontal-header"
              ><b>Unintentional</b></td
            >
            <td class="horizontal-header"><b>Past</b></td>
            <td>{@render conjugate("ot")}</td>
            <td>{@render conjugate("og")}</td>
            <td>{@render conjugate("or")}</td>
          </tr>
          <tr>
            <td class="horizontal-header"><b>Present</b></td>
            <td>{@render conjugate("ut")}</td>
            <td>{@render conjugate("ug")}</td>
            <td>{@render conjugate("ur")}</td>
          </tr>
          <tr>
            <td class="horizontal-header"><b>Future</b></td>
            <td>{@render conjugate("yt")}</td>
            <td>{@render conjugate("yg")}</td>
            <td>{@render conjugate("yr")}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th class="table-name" colspan="3">2nd Person Singular</th>
            <th>Simple</th>
            <th>Continous</th>
            <th>Perfect</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowspan="6" class="horizontal-header td-bottom-strong">
              <b>Animate</b>
            </td>
            <td rowspan="3" class="td-bottom horizontal-header">
              <b>Intentional</b>
            </td>
            <td class="horizontal-header"><b>Past</b></td>
            <td>{@render conjugate("va", true)}</td>
            <td>{@render conjugate("fa", true)}</td>
            <td>{@render conjugate("gha", true)}</td>
          </tr>
          <tr>
            <td class="horizontal-header"><b>Present</b></td>
            <td>{@render conjugate("ve", true)}</td>
            <td>{@render conjugate("fe", true)}</td>
            <td>{@render conjugate("ghe", true)}</td>
          </tr>
          <tr class="tr-bottom">
            <td class="horizontal-header"><b>Future</b></td>
            <td>{@render conjugate("vi", true)}</td>
            <td>{@render conjugate("fi", true)}</td>
            <td>{@render conjugate("ghi", true)}</td>
          </tr>
          <tr>
            <td rowspan="3" class="horizontal-header td-bottom-strong">
              <b>Unintentional</b>
            </td>
            <td class="horizontal-header"><b>Past</b></td>
            <td>{@render conjugate("vo", true)}</td>
            <td>{@render conjugate("fo", true)}</td>
            <td>{@render conjugate("gho", true)}</td>
          </tr>
          <tr>
            <td class="horizontal-header"><b>Present</b></td>
            <td>{@render conjugate("vu", true)}</td>
            <td>{@render conjugate("vu", true)}</td>
            <td>{@render conjugate("ghu", true)}</td>
          </tr>
          <tr class="tr-bottom-strong">
            <td class="horizontal-header"><b>Future</b></td>
            <td>{@render conjugate("vy", true)}</td>
            <td>{@render conjugate("vy", true)}</td>
            <td>{@render conjugate("ghy", true)}</td>
          </tr>
          <tr>
            <td rowspan="6" class="horizontal-header">
              <b>Inanimate</b>
            </td>
            <td rowspan="3" class="td-bottom horizontal-header">
              <b>Intentional</b>
            </td>
            <td class="horizontal-header"><b>Past</b></td>
            <td>{@render conjugate("ab", true)}</td>
            <td>{@render conjugate("aj", true)}</td>
            <td>{@render conjugate("azh", true)}</td>
          </tr>
          <tr>
            <td class="horizontal-header"><b>Present</b></td>
            <td>{@render conjugate("eb", true)}</td>
            <td>{@render conjugate("ej", true)}</td>
            <td>{@render conjugate("ezh", true)}</td>
          </tr>
          <tr class="tr-bottom">
            <td class="horizontal-header"><b>Future</b></td>
            <td>{@render conjugate("ib", true)}</td>
            <td>{@render conjugate("ij", true)}</td>
            <td>{@render conjugate("izh", true)}</td>
          </tr>
          <tr>
            <td rowspan="3" class="no-bottom-border horizontal-header"
              ><b>Unintentional</b></td
            >
            <td class="horizontal-header"><b>Past</b></td>
            <td>{@render conjugate("ob", true)}</td>
            <td>{@render conjugate("oj", true)}</td>
            <td>{@render conjugate("ozh", true)}</td>
          </tr>
          <tr>
            <td class="horizontal-header"><b>Present</b></td>
            <td>{@render conjugate("ub", true)}</td>
            <td>{@render conjugate("uj", true)}</td>
            <td>{@render conjugate("uzh", true)}</td>
          </tr>
          <tr>
            <td class="horizontal-header"><b>Future</b></td>
            <td>{@render conjugate("yb", true)}</td>
            <td>{@render conjugate("yj", true)}</td>
            <td>{@render conjugate("yzh", true)}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th class="table-name" colspan="3">2nd Person Plural</th>
            <th>Simple</th>
            <th>Continous</th>
            <th>Perfect</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowspan="6" class="horizontal-header td-bottom-strong">
              <b>Animate</b>
            </td>
            <td rowspan="3" class="td-bottom horizontal-header">
              <b>Intentional</b>
            </td>
            <td class="horizontal-header"><b>Past</b></td>
            <td>{@render conjugate("vas", true)}</td>
            <td>{@render conjugate("fas", true)}</td>
            <td>{@render conjugate("ghas", true)}</td>
          </tr>
          <tr>
            <td class="horizontal-header"><b>Present</b></td>
            <td>{@render conjugate("ves", true)}</td>
            <td>{@render conjugate("fes", true)}</td>
            <td>{@render conjugate("ghes", true)}</td>
          </tr>
          <tr class="tr-bottom">
            <td class="horizontal-header"><b>Future</b></td>
            <td>{@render conjugate("vis", true)}</td>
            <td>{@render conjugate("fis", true)}</td>
            <td>{@render conjugate("ghis", true)}</td>
          </tr>
          <tr>
            <td rowspan="3" class="horizontal-header td-bottom-strong">
              <b>Unintentional</b>
            </td>
            <td class="horizontal-header"><b>Past</b></td>
            <td>{@render conjugate("vos", true)}</td>
            <td>{@render conjugate("fos", true)}</td>
            <td>{@render conjugate("ghos", true)}</td>
          </tr>
          <tr>
            <td class="horizontal-header"><b>Present</b></td>
            <td>{@render conjugate("vus", true)}</td>
            <td>{@render conjugate("fus", true)}</td>
            <td>{@render conjugate("ghus", true)}</td>
          </tr>
          <tr class="tr-bottom-strong">
            <td class="horizontal-header"><b>Future</b></td>
            <td>{@render conjugate("vys", true)}</td>
            <td>{@render conjugate("fys", true)}</td>
            <td>{@render conjugate("ghys", true)}</td>
          </tr>
          <tr>
            <td rowspan="6" class="horizontal-header">
              <b>Inanimate</b>
            </td>
            <td rowspan="3" class="td-bottom horizontal-header">
              <b>Intentional</b>
            </td>
            <td class="horizontal-header"><b>Past</b></td>
            <td>{@render conjugate("aby", true)}</td>
            <td>{@render conjugate("ajy", true)}</td>
            <td>{@render conjugate("azhy", true)}</td>
          </tr>
          <tr>
            <td class="horizontal-header"><b>Present</b></td>
            <td>{@render conjugate("eby", true)}</td>
            <td>{@render conjugate("ejy", true)}</td>
            <td>{@render conjugate("ezhy", true)}</td>
          </tr>
          <tr class="tr-bottom">
            <td class="horizontal-header"><b>Future</b></td>
            <td>{@render conjugate("iby", true)}</td>
            <td>{@render conjugate("ijy", true)}</td>
            <td>{@render conjugate("izhy", true)}</td>
          </tr>
          <tr>
            <td rowspan="3" class="no-bottom-border horizontal-header"
              ><b>Unintentional</b></td
            >
            <td class="horizontal-header"><b>Past</b></td>
            <td>{@render conjugate("oby", true)}</td>
            <td>{@render conjugate("ojy", true)}</td>
            <td>{@render conjugate("ozhy", true)}</td>
          </tr>
          <tr>
            <td class="horizontal-header"><b>Present</b></td>
            <td>{@render conjugate("uby", true)}</td>
            <td>{@render conjugate("ujy", true)}</td>
            <td>{@render conjugate("uzhy", true)}</td>
          </tr>
          <tr>
            <td class="horizontal-header"><b>Future</b></td>
            <td>{@render conjugate("yby", true)}</td>
            <td>{@render conjugate("yjy", true)}</td>
            <td>{@render conjugate("yzhy", true)}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th class="table-name" colspan="3">3rd Person Singular</th>
            <th>Simple</th>
            <th>Continous</th>
            <th>Perfect</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowspan="6" class="horizontal-header td-bottom-strong">
              <b>Animate</b>
            </td>
            <td rowspan="3" class="td-bottom horizontal-header">
              <b>Intentional</b>
            </td>
            <td class="horizontal-header"><b>Past</b></td>
            <td>{@render conjugate("ra", true)}</td>
            <td>{@render conjugate("ca", true)}</td>
            <td>{@render conjugate("ba", true)}</td>
          </tr>
          <tr>
            <td class="horizontal-header"><b>Present</b></td>
            <td>{@render conjugate("ren", true)}</td>
            <td>{@render conjugate("cen", true)}</td>
            <td>{@render conjugate("be", true)}</td>
          </tr>
          <tr class="tr-bottom">
            <td class="horizontal-header"><b>Future</b></td>
            <td>{@render conjugate("ri", true)}</td>
            <td>{@render conjugate("ci", true)}</td>
            <td>{@render conjugate("bi", true)}</td>
          </tr>
          <tr>
            <td rowspan="3" class="horizontal-header td-bottom-strong">
              <b>Unintentional</b>
            </td>
            <td class="horizontal-header"><b>Past</b></td>
            <td>{@render conjugate("ro", true)}</td>
            <td>{@render conjugate("co", true)}</td>
            <td>{@render conjugate("bo", true)}</td>
          </tr>
          <tr>
            <td class="horizontal-header"><b>Present</b></td>
            <td>{@render conjugate("ru", true)}</td>
            <td>{@render conjugate("cu", true)}</td>
            <td>{@render conjugate("bu", true)}</td>
          </tr>
          <tr class="tr-bottom-strong">
            <td class="horizontal-header"><b>Future</b></td>
            <td>{@render conjugate("ry", true)}</td>
            <td>{@render conjugate("cy", true)}</td>
            <td>{@render conjugate("by", true)}</td>
          </tr>
          <tr>
            <td rowspan="6" class="horizontal-header">
              <b>Inanimate</b>
            </td>
            <td rowspan="3" class="td-bottom horizontal-header">
              <b>Intentional</b>
            </td>
            <td class="horizontal-header"><b>Past</b></td>
            <td>{@render conjugate("ar", true)}</td>
            <td>{@render conjugate("ac", true)}</td>
            <td>{@render conjugate("ab", true)}</td>
          </tr>
          <tr>
            <td class="horizontal-header"><b>Present</b></td>
            <td>{@render conjugate("er", true)}</td>
            <td>{@render conjugate("ec", true)}</td>
            <td>{@render conjugate("eb", true)}</td>
          </tr>
          <tr class="tr-bottom">
            <td class="horizontal-header"><b>Future</b></td>
            <td>{@render conjugate("ir", true)}</td>
            <td>{@render conjugate("ic", true)}</td>
            <td>{@render conjugate("ib", true)}</td>
          </tr>
          <tr>
            <td rowspan="3" class="no-bottom-border horizontal-header"
              ><b>Unintentional</b></td
            >
            <td class="horizontal-header"><b>Past</b></td>
            <td>{@render conjugate("or", true)}</td>
            <td>{@render conjugate("oc", true)}</td>
            <td>{@render conjugate("ob", true)}</td>
          </tr>
          <tr>
            <td class="horizontal-header"><b>Present</b></td>
            <td>{@render conjugate("ur", true)}</td>
            <td>{@render conjugate("uc", true)}</td>
            <td>{@render conjugate("ub", true)}</td>
          </tr>
          <tr>
            <td class="horizontal-header"><b>Future</b></td>
            <td>{@render conjugate("yr", true)}</td>
            <td>{@render conjugate("yc", true)}</td>
            <td>{@render conjugate("yb", true)}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th class="table-name" colspan="3">3rd Person Plural</th>
            <th>Simple</th>
            <th>Continous</th>
            <th>Perfect</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowspan="6" class="horizontal-header td-bottom-strong">
              <b>Animate</b>
            </td>
            <td rowspan="3" class="td-bottom horizontal-header">
              <b>Intentional</b>
            </td>
            <td class="horizontal-header"><b>Past</b></td>
            <td>{@render conjugate("zwa", true)}</td>
            <td>{@render conjugate("lwa", true)}</td>
            <td>{@render conjugate("bwa", true)}</td>
          </tr>
          <tr>
            <td class="horizontal-header"><b>Present</b></td>
            <td>{@render conjugate("zwe", true)}</td>
            <td>{@render conjugate("lwe", true)}</td>
            <td>{@render conjugate("bwe", true)}</td>
          </tr>
          <tr class="tr-bottom">
            <td class="horizontal-header"><b>Future</b></td>
            <td>{@render conjugate("zwi", true)}</td>
            <td>{@render conjugate("lwi", true)}</td>
            <td>{@render conjugate("bwi", true)}</td>
          </tr>
          <tr>
            <td rowspan="3" class="horizontal-header td-bottom-strong">
              <b>Unintentional</b>
            </td>
            <td class="horizontal-header"><b>Past</b></td>
            <td>{@render conjugate("zwo", true)}</td>
            <td>{@render conjugate("lwo", true)}</td>
            <td>{@render conjugate("bwo", true)}</td>
          </tr>
          <tr>
            <td class="horizontal-header"><b>Present</b></td>
            <td>{@render conjugate("zwu", true)}</td>
            <td>{@render conjugate("lwu", true)}</td>
            <td>{@render conjugate("bwu", true)}</td>
          </tr>
          <tr class="tr-bottom-strong">
            <td class="horizontal-header"><b>Future</b></td>
            <td>{@render conjugate("zwy", true)}</td>
            <td>{@render conjugate("lwy", true)}</td>
            <td>{@render conjugate("bwy", true)}</td>
          </tr>
          <tr>
            <td rowspan="6" class="horizontal-header">
              <b>Inanimate</b>
            </td>
            <td rowspan="3" class="td-bottom horizontal-header">
              <b>Intentional</b>
            </td>
            <td class="horizontal-header"><b>Past</b></td>
            <td>{@render conjugate("zja", true)}</td>
            <td>{@render conjugate("lja", true)}</td>
            <td>{@render conjugate("bja", true)}</td>
          </tr>
          <tr>
            <td class="horizontal-header"><b>Present</b></td>
            <td>{@render conjugate("zje", true)}</td>
            <td>{@render conjugate("lje", true)}</td>
            <td>{@render conjugate("bje", true)}</td>
          </tr>
          <tr class="tr-bottom">
            <td class="horizontal-header"><b>Future</b></td>
            <td>{@render conjugate("zji", true)}</td>
            <td>{@render conjugate("lji", true)}</td>
            <td>{@render conjugate("bji", true)}</td>
          </tr>
          <tr>
            <td rowspan="3" class="no-bottom-border horizontal-header">
              <b>Unintentional</b>
            </td>
            <td class="horizontal-header"><b>Past</b></td>
            <td>{@render conjugate("zja", true)}</td>
            <td>{@render conjugate("lja", true)}</td>
            <td>{@render conjugate("bja", true)}</td>
          </tr>
          <tr>
            <td class="horizontal-header"><b>Present</b></td>
            <td>{@render conjugate("zje", true)}</td>
            <td>{@render conjugate("lje", true)}</td>
            <td>{@render conjugate("bje", true)}</td>
          </tr>
          <tr>
            <td class="horizontal-header"><b>Future</b></td>
            <td>{@render conjugate("zji", true)}</td>
            <td>{@render conjugate("lji", true)}</td>
            <td>{@render conjugate("bji", true)}</td>
          </tr>
        </tbody>
      </table>
    {:else if wordType === "noun"}
      <table class="fixed-table">
        <thead>
          <tr>
            <th>Singular</th>
            <th>Plural</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span class="inflections-secondary"
                >{validatedWord.word || "(no change)"}</span
              >
            </td>
            <td>
              cu{validatedWord.word
                ? /^[aeiouy]/.test(validatedWord.word)
                  ? "l"
                  : ""
                : "(l)"}<span class="inflections-secondary"
                >{validatedWord.word || "-"}</span
              >
            </td>
          </tr>
        </tbody>
      </table>
    {:else if wordType === "modifier"}
      <table class="fixed-table">
        <thead>
          <tr>
            <th>Adjective</th>
            <th>Adverb</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span class="inflections-secondary"
                >{validatedWord.word || "(no change)"}</span
              >
            </td>
            <td>
              i{validatedWord.word
                ? /^[aeiouy]/.test(validatedWord.word)
                  ? "r"
                  : ""
                : "(r)"}<span class="inflections-secondary"
                >{validatedWord.word || "-"}</span
              >
            </td>
          </tr>
        </tbody>
      </table>
    {:else if wordType === "pronoun"}
      <table>
        <thead>
          <tr>
            <th class="table-name" rowspan="2" colspan="2">Pronouns</th>
            <th class="vertical-header" colspan="2">Singular</th>
            <th class="vertical-header" colspan="2">Plural</th>
          </tr>
          <tr>
            <th class="vertical-header">Personal</th>
            <th class="vertical-header">Possessive</th>
            <th class="vertical-header">Personal</th>
            <th class="vertical-header">Possessive</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowspan="2" class="td-bottom horizontal-header">
              <b>1st Person</b>
            </td>
            <td class="horizontal-header"><b>Day</b></td>
            <td>ja</td>
            <td>jami</td>
            <td>cuja</td>
            <td>cujami</td>
          </tr>
          <tr class="tr-bottom">
            <td class="horizontal-header"><b>Night</b></td>
            <td>jo</td>
            <td>jomi</td>
            <td>cujo</td>
            <td>cujomi</td>
          </tr>
          <tr>
            <td rowspan="2" class="td-bottom horizontal-header">
              <b>2nd Person</b>
            </td>
            <td class="horizontal-header"><b>Animate</b></td>
            <td>voze</td>
            <td>vozemi</td>
            <td>cuvoze</td>
            <td>cuvozemi</td>
          </tr>
          <tr class="tr-bottom">
            <td class="horizontal-header"><b>Inanimate</b></td>
            <td>vozi</td>
            <td>vozimi</td>
            <td>cuvozi</td>
            <td>cuvozimi</td>
          </tr>
          <tr>
            <td rowspan="2" class="td-bottom horizontal-header">
              <b>3rd Person</b>
            </td>
            <td class="horizontal-header"><b>Animate</b></td>
            <td>kal</td>
            <td>kalami</td>
            <td>cukal</td>
            <td>cukalami</td>
          </tr>
          <tr class="tr-bottom">
            <td class="horizontal-header"><b>Inanimate</b></td>
            <td>kel</td>
            <td>kelemi</td>
            <td>cukel</td>
            <td>cukelemi</td>
          </tr>
          <tr>
            <td rowspan="2" class="horizontal-header td-bottom">
              <b>4th Person</b>
            </td>
            <td class="horizontal-header"><b>Animate</b></td>
            <td>nu</td>
            <td>numi</td>
            <td>cunu</td>
            <td>cunumi</td>
          </tr>
          <tr class="tr-bottom">
            <td class="horizontal-header"><b>Inanimate</b></td>
            <td class="inflections-secondary">(no word yet)</td>
            <td class="inflections-secondary">(no word yet)</td>
            <td class="inflections-secondary">(no word yet)</td>
            <td class="inflections-secondary">(no word yet)</td>
          </tr>
          <tr>
            <td colspan="2" class="horizontal-header"><b>Impersonal</b></td>
            <td class="inflections-secondary">(no word yet)</td>
            <td class="inflections-secondary">(no word yet)</td>
            <td class="inflections-secondary">(no word yet)</td>
            <td class="inflections-secondary">(no word yet)</td>
          </tr>
        </tbody>
      </table>
    {/if}
  </div>
</main>

<style>
  @keyframes appear {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .inflect-tables {
    width: 100%;
    overflow: auto;
  }
  .header {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: stretch;
  }
  .header button {
    width: auto;
  }
  .word-entry-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .word-entry {
    --input-accent: var(--accent);
    width: auto;
    flex: 1;
  }
  .warning {
    animation: appear 0.3s ease-out;
  }
  .word-entry-status-message {
    color: #888;
    text-align: right;
    font-size: 0.8rem;
  }
  @media (max-width: 480px) {
    .word-entry-wrapper {
      flex: auto;
      width: 100%;
    }
  }
  input.word-entry-error {
    --input-accent: var(--accent-error);
    border: 1px solid var(--accent-error);
  }
  table {
    margin-top: 2rem;
  }
  .table-name {
    font-size: 1.2rem;
    text-align: center;
  }
  .td-bottom,
  .tr-bottom td {
    border-bottom: 3px solid var(--border);
  }
  .td-bottom-strong,
  .tr-bottom-strong td {
    border-bottom: 5px solid var(--border);
  }
  .no-bottom-border {
    border-bottom: 0;
  }
  .horizontal-header {
    width: 0;
    white-space: nowrap;
    text-align: center;
  }
  .vertical-header {
    text-align: center;
  }
  .inflections-vowel {
    color: var(--accent);
  }
  .inflections-secondary {
    color: #888;
  }
  .fixed-table {
    table-layout: fixed;
  }
</style>
