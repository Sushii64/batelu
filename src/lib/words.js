import wordsData from "../pages/words.json";
import { IPA_CONSONANTS, IPA_VOWELS, toIPA } from "./toIPA";

const cleanWord = (w) => w.replace(/\d+$/, "");

export const words = wordsData.map((w, index) => {
  const displayWord = cleanWord(w.word);
  const ipa = toIPA(displayWord);
  return {
    ...w,
    displayWord,
    index,
    ipa,
  };
});
export const errors = words.filter((word) => word.ipa.error);

const phonemeFrequencies = words.reduce(
  (obj, word) => {
    if (word.ipa.error) return obj;
    word.ipa.syllables.forEach((syllable) => {
      syllable.forEach((phoneme) => {
        const newFrequency = (obj.map.get(phoneme) ?? 0) + 1;
        obj.map.set(phoneme, newFrequency);
        if (IPA_VOWELS.has(phoneme) && obj.maxVowel < newFrequency) {
          obj.maxVowel = newFrequency;
        }
        if (IPA_CONSONANTS.has(phoneme) && obj.maxConsonant < newFrequency) {
          obj.maxConsonant = newFrequency;
        }
      });
    });
    return obj;
  },
  { map: new Map(), maxVowel: 0, maxConsonant: 0 },
);
export const frequencyOf = (phoneme) => {
  return (
    phonemeFrequencies.map.get(phoneme) /
    (IPA_VOWELS.has(phoneme)
      ? phonemeFrequencies.maxVowel
      : phonemeFrequencies.maxConsonant)
  );
};
