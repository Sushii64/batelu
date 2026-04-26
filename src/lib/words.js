import wordsData from "../pages/words.json";
import { toIPA } from "./toIPA";

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
