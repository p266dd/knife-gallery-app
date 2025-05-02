export function generateRandomString(type = "password") {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const special = "!@#";
  const all = lower + upper + digits + special;

  // * Ensure at least one of each required type
  const getRandom = (str) => str[Math.floor(Math.random() * str.length)];

  // Shuffle the characters
  const shuffle = (arr) => arr.sort(() => 0.5 - Math.random()).join("");

  const randomCharacters = [];

  if (type === "password") {
    const length = 8;

    for (let i = 0; i < length - 2; i++) {
      randomCharacters.push(getRandom(all));
    }

    // * Make sure at least one Number and one special character.
    randomCharacters.push(getRandom(digits));
    randomCharacters.push(getRandom(special));

    // * Return shuffled order again.
    return String(shuffle(randomCharacters));
  }

  if (type === "businessCode") {
    const length = 4; // + 2 Cap Letters
    for (let i = 0; i < length; i++) {
      randomCharacters.push(getRandom(digits));
    }

    // * Add two capital letters to the beginning of id.
    return String(
      getRandom(upper) + getRandom(upper) + shuffle(randomCharacters)
    );
  }

  return null;
}
