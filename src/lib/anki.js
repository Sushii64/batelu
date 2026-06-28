import { words } from "./words.js";

const getAnkiFormatWords = () => {
  const wordDefinitionMapping = new Map();
  words.forEach((word) => {
    const existingDefinition = wordDefinitionMapping.get(word.displayWord);
    if (existingDefinition) {
      wordDefinitionMapping.set(
        word.displayWord,
        existingDefinition + " / " + word.definition,
      );
    } else {
      wordDefinitionMapping.set(word.displayWord, word.definition);
    }
  });
  return [
    ...wordDefinitionMapping
      .entries()
      .map(([word, definition]) => `${word}\t${definition}`),
  ].join("\n");
};

export const ankiFormatWords = getAnkiFormatWords();
