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

export const numberToBatelu = (n) => {
  if (n === 0) return "jemo";
  if (n < 12) return NUMBERS[n];
  if (n < 144) {
    let ones = n % 12;
    let twelves = ((n - ones) % 144) / 12;
    let twelvesString = twelves === 1 ? "izo" : `${NUMBERS[twelves]} izo`;
    return ones === 0 ? twelvesString : `${twelvesString} ${NUMBERS[ones]}`;
  }
  return "(nimra masif)";
};
