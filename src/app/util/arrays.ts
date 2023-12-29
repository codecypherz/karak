export function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
};

export function getRandom<T>(array: T[]): T {
  if (array.length == 0) {
    throw new Error('Cannot access an empty array.');
  }
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

export function removeRandom<T>(array: T[]): T {
  if (array.length == 0) {
    throw new Error('Cannot remove from an empty array.');
  }
  const index = Math.floor(Math.random() * array.length);
  return array.splice(index, 1)[0];
}
