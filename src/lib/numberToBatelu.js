const NUMBERS = {
  1: "ad",
  2: "do",
  3: "san",
  4: "fir",
  5: "pan",
  6: "ejono",
  7: "saspi",
  8: "ewa",
  9: "naw",
  10: "wan",
  11: "awi",
};

const CHUNK_OF_THREE_WORDS = ["zo", "izo"];
const LARGER_NUMBER_SEPARATOR_WORDS = ["mirijona", "atasi"];

const getDigits = (n) => {
  const digits = [];
  while (n !== 0) {
    const currentDigit = n % 12;
    digits.push(currentDigit);
    n -= currentDigit;
    n /= 12;
  }
  return digits;
};

const chunkOfThrees = (digits, start) => {
  if (digits[start] === undefined) return null;
  let s = [];
  for (const [i, word] of CHUNK_OF_THREE_WORDS.entries()) {
    const digit = digits[start + (CHUNK_OF_THREE_WORDS.length - i)];
    if (digit !== undefined && digit !== 0) {
      s.push(digit === 1 ? word : `${NUMBERS[digit]} ${word}`);
    }
  }
  if (digits[start] !== 0) s.push(NUMBERS[digits[start]]);
  return s.join(" ");
};

export const numberToBatelu = (n) => {
  if (n < 0 || !Number.isInteger(n)) return "[nimra move]";
  const digits = getDigits(n);
  if (digits.length === 0) return "jemo";
  if (digits.length > LARGER_NUMBER_SEPARATOR_WORDS.length * 3 + 3) {
    return "[nimra move]";
  }
  let s = [];
  for (const [i, word] of LARGER_NUMBER_SEPARATOR_WORDS.entries()) {
    const chunk = chunkOfThrees(
      digits,
      (LARGER_NUMBER_SEPARATOR_WORDS.length - i) * 3,
    );
    if (chunk === NUMBERS[1]) s.push(word);
    else if (chunk) s.push(`${chunk} ${word}`);
  }
  s.push(chunkOfThrees(digits, 0));
  return s.join(" ");
};

export const numberToShortBatelu = (n) => {
  if (!Number.isInteger(n)) return "[nimra move]";
  return n.toString(12).replace(/[ab]/g, (s) => (s === "a" ? "W" : "A"));
};

export const shortBateluToNumber = (shorthand) => {
  if (!/^-?[WA0-9]+$/.test(shorthand)) return "[invalid number]";
  return Number.parseInt(
    shorthand.replace(/[WA]/g, (s) => (s === "W" ? "a" : "b")),
    12,
  );
};
