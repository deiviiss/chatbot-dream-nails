function generateTimer(min: number, max: number) {
  const numSal = Math.random();

  const randomNumber = Math.floor(numSal * (max - min + 1)) + min;

  return randomNumber;
}

export { generateTimer };