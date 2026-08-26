const CONSONANTS = {
  m: "m",
  n: "n",
  p: "p",
  t: "t",
  k: "k",
  b: "b",
  d: "d",
  g: "ɡ",
  ǧ: "ɣ",
  z: "t͡s",
  ž: "ʒ",
  f: "f",
  s: "ʃ",
  c: "ç",
  x: "x",
  v: "v",
  w: "w",
  l: "l",
  j: "j",
  r: "r",
};
const VOWELS = {
  a: "a",
  e: "e",
  i: "i",
  o: "o",
  u: "y",
  y: "ə",
};
export const IPA_CONSONANTS = new Set([...Object.values(CONSONANTS)]);
export const IPA_VOWELS = new Set(Object.values(VOWELS));

const toSounds = (word) => {
  const sounds = [];
  let i = 0;
  while (i < word.length) {
    if (Object.hasOwn(CONSONANTS, word[i])) {
      sounds.push({
        type: "consonant",
        orth: word[i],
        ipa: CONSONANTS[word[i]],
      });
      i++;
    } else if (Object.hasOwn(VOWELS, word[i])) {
      sounds.push({
        type: "vowel",
        orth: word[i],
        ipa: VOWELS[word[i]],
      });
      i++;
    } else {
      return { error: true, message: `Unknown character ${word[i]}` };
    }
  }
  return { error: false, segments: sounds };
};

export const toIPA = (word) => {
  let i = 0;
  const sounds = toSounds(word);
  if (sounds.error) {
    return sounds;
  }
  const syllables = [[]];
  while (i < sounds.segments.length) {
    if (i !== 0) {
      syllables.push([]);
    }
    switch (sounds.segments[i].type) {
      case "vowel":
        if (i === 0) {
          syllables[syllables.length - 1].push(sounds.segments[i].ipa);
          i++;
          if (
            sounds.segments[i]?.type === "consonant" &&
            sounds.segments[i + 1]?.type !== "vowel"
          ) {
            syllables[syllables.length - 1].push(sounds.segments[i].ipa);
            i++;
          }
        } else {
          return {
            error: true,
            message: `Vowel-only syllable not at the start of a word (${sounds.segments[i].orth})`,
          };
        }
        break;
      case "consonant":
        if (sounds.segments[i + 1]?.type !== "vowel") {
          return {
            error: true,
            message: `Syllable starting with a consonant without a vowel afterwards (${sounds.segments[i].orth})`,
          };
        }
        syllables[syllables.length - 1].push(sounds.segments[i].ipa);
        syllables[syllables.length - 1].push(sounds.segments[i + 1].ipa);
        i += 2;
        if (
          sounds.segments[i]?.type === "consonant" &&
          sounds.segments[i + 1]?.type !== "vowel"
        ) {
          syllables[syllables.length - 1].push(sounds.segments[i].ipa);
          i++;
        } else if (
          sounds.segments[i]?.type === "vowel" &&
          sounds.segments[i + 1]?.type === "consonant"
        ) {
          syllables[syllables.length - 1].push(sounds.segments[i].ipa);
          syllables[syllables.length - 1].push(sounds.segments[i + 1].ipa);
          i += 2;
        }
    }
  }
  return {
    error: false,
    ipa: syllables.map((syllable) => syllable.join("")).join("."),
    syllables,
  };
};
