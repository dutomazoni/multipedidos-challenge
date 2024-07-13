// calculando a média dos valores para ser o peso estabilizado
function calculateAverage(array) {
  const sum = array.reduce((acc, currentValue) => acc + parseFloat(currentValue), 0);
  return (sum / array.length).toFixed(2);
}

export { calculateAverage };
