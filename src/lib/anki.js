import { words } from "./words.js";

export const ankiFormatWords = words
  .map((word) => `${word.definition}\t${word.displayWord}`)
  .join("\n");
