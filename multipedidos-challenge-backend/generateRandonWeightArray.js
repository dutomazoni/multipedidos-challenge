// gerando um array de 500 valores aleatórios com uma variância de 1.5% para simular uma balança
function generateRandomWeightArray() {
  const length = 500;
  const variancePercentage  = 0.015; // 1.5%

  let array = [];
  let currentValue = (Math.random() * 1000)

  for (let i = 0; i < length; i++) {
    let variance = (Math.random() - 0.5) * 2 * variancePercentage;
    let value = (currentValue * (1 + variance));
    array.push(value.toFixed(2));
  }

  return array;
}

export { generateRandomWeightArray }
