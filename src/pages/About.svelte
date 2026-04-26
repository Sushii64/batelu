<script>
  import Sentence from "../components/Sentence.svelte";

  export let navigate;
</script>

<main class="container">
  <h1>About</h1>
  <hr />
  <p>
    <span id="batelu">Batelu</span> is a community-driven language created on May
    3, 2025.
  </p>
  <h2>Sentences</h2>
  <p>Batelu uses SOV word order by default.</p>
  <Sentence
    sentence={[
      { role: "subject", batelu: ["ja"], english: ["I"] },
      { role: "object", batelu: ["abjan"], english: ["noodles"] },
      { role: "verb", batelu: ["jese"], english: ["I eat"] },
    ]}
    translation="I eat noodles."
  />
  <p>
    As information about person is also provided via verb conjugations, pronouns
    may also be left out:
  </p>
  <Sentence
    sentence={[
      { role: "object", batelu: ["abjan"], english: ["noodles"] },
      { role: "verb", batelu: ["jese"], english: ["I eat"] },
    ]}
    translation="I eat noodles."
  />
  <p>
    Other word orders are also possible by marking them with special particles.
    These particles have not been created yet, though.
  </p>
  <p>Yes/no-questions can be created with the particle "ko":</p>
  <Sentence
    sentence={[
      { role: "particle", batelu: ["ko"], english: ["?"] },
      { role: "object", batelu: ["abjan"], english: ["noodles"] },
      { role: "verb", batelu: ["jeseve"], english: ["you eat"] },
    ]}
    translation="Do you eat noodles?"
  />
  <p>
    Open ended questions can be created with more specific interrogative words:
  </p>
  <Sentence
    sentence={[
      { role: "particle", batelu: ["va"], english: ["what"] },
      { role: "verb", batelu: ["jeseve"], english: ["you eat"] },
    ]}
    translation="What do you eat?"
  />
  <h2>Nouns</h2>
  <p>Nouns can be turned plural with the cu- prefix:</p>
  <Sentence
    sentence={[
      {
        role: "subject",
        batelu: [{ content: "cu", affix: true }, "mawyr"],
        english: ["cat", { content: "s", affix: true }],
      },
    ]}
    translation="cats"
  />
  <p>
    For phonetic reasons, the prefix is turned into cul- when before a vowel:
  </p>
  <Sentence
    sentence={[
      {
        role: "subject",
        batelu: [{ content: "cul", affix: true }, "istar"],
        english: ["alien", { content: "s", affix: true }],
      },
    ]}
    translation="aliens"
  />
  <p>There are articles that are attached directly to the noun:</p>
  <Sentence
    sentence={[
      { role: "subject", batelu: ["mawyr"], english: ["cat"] },
      { role: "particle", batelu: ["al"], english: ["the"] },
      { role: null, batelu: [","], english: [] },
      { role: "subject", batelu: ["mawyr"], english: ["cat"] },
      { role: "particle", batelu: ["ena"], english: ["a"] },
    ]}
    translation="the cat, a cat"
  />
  <p>
    Unlike English, both of these can be used on plural nouns as well. The
    article doesn't change.
  </p>
  <Sentence
    sentence={[
      { role: "subject", batelu: ["cumawyr"], english: ["cats"] },
      { role: "particle", batelu: ["al"], english: ["the"] },
      { role: null, batelu: [","], english: [] },
      { role: "subject", batelu: ["cumawyr"], english: ["cats"] },
      { role: "particle", batelu: ["ena"], english: ["a"] },
    ]}
    translation="the cats, some cats"
  />
  <p>
    If you want to, you can spell these with a hyphen as well: "mawyr-al" and
    "mawyr-ena".
  </p>
  <p>Compound nouns are created by putting two nouns together:</p>
  <Sentence
    sentence={[
      { role: "subject", batelu: ["kanjakapy"], english: ["dog+door"] },
    ]}
    translation="dog door"
  />
  <p>
    Be careful though - certain compounds have been lexicalized. For example,
    kaus means cheese and mempaw means sandwich - but kausmempaw means
    cheeseburger!
  </p>
  <h2>Verbs</h2>
  <p>
    All verb infinitives end in either -are, -ere, -ire, -ore, -ure, or -yre.
  </p>
  <Sentence
    sentence={[
      {
        role: "verb",
        batelu: ["gyl", { content: "are", affix: true }],
        english: ["to laugh"],
      },
    ]}
    translation="to laugh"
  />
  <p>
    Batelu has quite a few verb conjugations. Some of them, like the infinitive
    itself, keep their theme vowel - the vowel before "re". In other
    conjugations, it gets removed. Batelu conjugates by person:
  </p>
  <Sentence
    sentence={[
      {
        role: "verb",
        batelu: ["gyl", { content: "e", affix: true }],
        english: ["I laugh"],
      },
      { role: null, batelu: [","], english: [] },
      {
        role: "verb",
        batelu: ["gyl", { content: "ave", affix: true }],
        english: ["you (sg.) laugh"],
      },
      { role: null, batelu: [","], english: [] },
      {
        role: "verb",
        batelu: ["gyl", { content: "aren", affix: true }],
        english: ["they (sg.) laugh"],
      },
    ]}
    translation="I laugh, you laugh, they laugh"
  />
  <p>By number:</p>
  <Sentence
    sentence={[
      {
        role: "verb",
        batelu: ["gyl", { content: "e", affix: true }],
        english: ["I laugh"],
      },
      { role: null, batelu: [","], english: [] },
      {
        role: "verb",
        batelu: ["gyl", { content: "et", affix: true }],
        english: ["we laugh"],
      },
    ]}
    translation="I laugh, we laugh"
  />
  <p>By tense:</p>
  <Sentence
    sentence={[
      {
        role: "verb",
        batelu: ["gyl", { content: "a", affix: true }],
        english: ["I laughed"],
      },
      { role: null, batelu: [","], english: [] },
      {
        role: "verb",
        batelu: ["gyl", { content: "e", affix: true }],
        english: ["I laugh"],
      },
      { role: null, batelu: [","], english: [] },
      {
        role: "verb",
        batelu: ["gyl", { content: "i", affix: true }],
        english: ["I will laugh"],
      },
    ]}
    translation="I laughed, I laugh, I will laugh"
  />
  <p>By aspect:</p>
  <Sentence
    sentence={[
      {
        role: "verb",
        batelu: ["gyl", { content: "e", affix: true }],
        english: ["I laugh"],
      },
      { role: null, batelu: [","], english: [] },
      {
        role: "verb",
        batelu: ["gyl", { content: "ed", affix: true }],
        english: ["I'm laughing"],
      },
      { role: null, batelu: [","], english: [] },
      {
        role: "verb",
        batelu: ["gyl", { content: "ek", affix: true }],
        english: ["I've laughed"],
      },
    ]}
    translation="I laughed, I'm laughing, I've laughed"
  />
  <p>By intentionality:</p>
  <Sentence
    sentence={[
      {
        role: "verb",
        batelu: ["gyl", { content: "e", affix: true }],
        english: ["I laugh"],
      },
      { role: null, batelu: [","], english: [] },
      {
        role: "verb",
        batelu: ["gyl", { content: "u", affix: true }],
        english: ["I unintentionally laugh"],
      },
    ]}
    translation="I intentionally laugh, I unintentionally laugh"
  />
  <p>
    And by animacy - whether the subject is alive or not. This is not done for
    the 1st person, though, as the speaker is assumed to always be animate.
  </p>
  <Sentence
    sentence={[
      {
        role: "verb",
        batelu: ["gyl", { content: "aren", affix: true }],
        english: ["they (sg., animate) laugh"],
      },
      { role: null, batelu: [","], english: [] },
      {
        role: "verb",
        batelu: ["gyl", { content: "aer", affix: true }],
        english: ["it laughs"],
      },
    ]}
    translation="they laugh, it laughs"
  />
  <p>
    There are tables for these over at the <a
      href="/inflect"
      on:click|preventDefault={navigate("/inflect")}>inflections page</a
    >.
  </p>
  <h2>Modifiers</h2>
  <p>
    Modifiers work like adjectives. They go after what they modify. They can
    modify nouns:
  </p>
  <Sentence
    sentence={[
      { role: "subject", batelu: ["wabi"], english: ["fish"] },
      { role: "particle", batelu: ["al"], english: ["the"] },
      { role: "modifier", batelu: ["teran"], english: ["happy"] },
    ]}
    translation="the happy fish"
  />
  <p>With the prefix "i-", they can modify verbs too:</p>
  <Sentence
    sentence={[
      { role: "verb", batelu: ["jesere"], english: ["to eat"] },
      {
        role: "modifier",
        batelu: [{ content: "i", affix: true }, "teran"],
        english: ["happi", { content: "ly", affix: true }],
      },
    ]}
    translation="to eat happily"
  />
  <p>For phonetic reasons, this prefix turns into "ir-" when before a vowel:</p>
  <Sentence
    sentence={[
      { role: "verb", batelu: ["jesere"], english: ["to eat"] },
      {
        role: "modifier",
        batelu: [{ content: "ir", affix: true }, "alo"],
        english: ["other", { content: "ly", affix: true }],
      },
    ]}
    translation="to eat in a different way"
  />
  <p>
    Possessive pronouns work just like modifiers - so they need articles most of
    the time:
  </p>
  <Sentence
    sentence={[
      { role: "subject", batelu: ["wabi"], english: ["fish"] },
      { role: "particle", batelu: ["al"], english: ["the"] },
      { role: "modifier", batelu: ["jami"], english: ["my"] },
    ]}
    translation="my fish"
  />
  <h2>Adpositions</h2>
  <p>
    Batelu only has prepositions. Their word order is similar to that of
    English. They can modify nouns:
  </p>
  <Sentence
    sentence={[
      { role: "subject", batelu: ["urkoz"], english: ["bear"] },
      { role: "adposition", batelu: ["je"], english: ["at"] },
      { role: "object", batelu: ["soj"], english: ["water"] },
    ]}
    translation="bear in the water"
  />
  <p>And also entire sentences:</p>
  <Sentence
    sentence={[
      {
        role: "verb",
        batelu: ["kutecen"],
        english: ["they (sg.) are walking"],
      },
      { role: "adposition", batelu: ["je"], english: ["at"] },
      { role: "object", batelu: ["soj"], english: ["water"] },
    ]}
    translation="They are walking in the water."
  />
  <h2>Numbers</h2>
  <p>Batelu uses base 12. Numbers are put after nouns, just like modifiers:</p>
  <Sentence
    sentence={[
      { role: "subject", batelu: ["culol"], english: ["sounds"] },
      { role: "numeral", batelu: ["awi"], english: ["eleven"] },
    ]}
    translation="eleven sounds"
  />
  <p>
    For numbers greater than twelve, use the twelves digit, the word 'izo', and
    the ones digit:
  </p>
  <Sentence
    sentence={[
      { role: "subject", batelu: ["culol"], english: ["sounds"] },
      { role: "numeral", batelu: ["do"], english: ["two"] },
      { role: "numeral", batelu: ["izo"], english: ["twelve"] },
      { role: "numeral", batelu: ["san"], english: ["three"] },
    ]}
    translation="twenty-seven sounds (23 in dozenal)"
  />
  <p>You can leave out the ones digit when it's zero:</p>
  <Sentence
    sentence={[
      { role: "subject", batelu: ["culol"], english: ["sounds"] },
      { role: "numeral", batelu: ["do"], english: ["two"] },
      { role: "numeral", batelu: ["izo"], english: ["twelve"] },
    ]}
    translation="twenty-four sounds (20 in dozenal)"
  />
  <p>You can leave out the twelves digit when it's one:</p>
  <Sentence
    sentence={[
      { role: "subject", batelu: ["culol"], english: ["sounds"] },
      { role: "numeral", batelu: ["izo"], english: ["twelve"] },
      { role: "numeral", batelu: ["san"], english: ["three"] },
    ]}
    translation="fifteen sounds (13 in dozenal)"
  />
  <p>
    While we have words for a gross and higher, the way these are used has not
    been decided on yet.
  </p>
  <p>
    If you want to, you can write down the numbers using Arabic numerals too.
    Use "W" to represent ten (from "wan") and "A" to represent eleven (from
    "awi"):
  </p>
  <Sentence
    sentence={[
      { role: "subject", batelu: ["culol"], english: ["sounds"] },
      { role: "numeral", batelu: ["W3"], english: ["123"] },
    ]}
    translation="123 sounds (A3 in dozenal)"
  />
  <p>
    Ordinals use the word "law" between noun and number. Note that the definite
    article is required here:
  </p>
  <Sentence
    sentence={[
      { role: "subject", batelu: ["lol"], english: ["sound"] },
      { role: "particle", batelu: ["al"], english: ["the"] },
      { role: "particle", batelu: ["law"], english: ["nth"] },
      { role: "numeral", batelu: ["san"], english: ["three"] },
    ]}
    translation="the third sound"
  />
</main>

<style>
  #batelu {
    font-size: 1.1em;
  }

  #batelu {
    font-weight: 900;
    background-image: linear-gradient(90deg, violet, yellow);
    color: transparent;
    background-clip: text;
  }
</style>
