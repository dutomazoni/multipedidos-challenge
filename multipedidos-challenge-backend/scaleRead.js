const { SerialPort } = require('serialport')
const { calculateAverage } = require('./calculateAverage')

function scaleRead(data, ws)  {
  let receivedData = JSON.parse(data)
  // configurações da balança
  let measureUnit = receivedData.measureUnit
  let baudRateScale = process.env.BAUDRATESCALE ||'9600'
  let pathScale = process.env.PATHSCALE || 'COM2'
  let priceKg = 50
  let buffet = 30
  let totalValue = 0
  let message;

  // Abrindo porta da balança
  const port = new SerialPort({ path: pathScale, baudRate: parseInt(baudRateScale) })

  port.on('open', () => {
    console.log(`Balança conectada na porta ${pathScale} com baud rate de ${baudRateScale}.`)
  })

  port.on('data', (data) => {
    data = JSON.parse(data)
    console.log('Calculando peso estabilizado...')
    let currWeight = calculateAverage(data.currWeight)

    // calculando o preço do prato
    if (measureUnit === 'g') {
      totalValue = (parseFloat(currWeight)) * priceKg / 1000
    } else {
      totalValue = (parseFloat(currWeight) / 1000) * priceKg
    }

    message = {
      value: `${totalValue >= buffet ? buffet.toFixed(2) : totalValue.toFixed(2)}`,
      mode: totalValue >= buffet ? 'Livre' : 'Kg',
      unit: measureUnit,
      firstWeight: `${measureUnit === 'g' ? parseFloat(data.currWeight[0]).toFixed(2) : (parseFloat(data.currWeight[0]) /
        1000).toFixed(2)}`,
      weight: `${measureUnit === 'g' ? parseFloat(currWeight).toFixed(2) : (parseFloat(currWeight) /
        1000).toFixed(2)}`,
    }
    ws.send(JSON.stringify(message))
    // fechando a porta depois de receber dados
    port.close((err) => {
      if (err) {
        return console.error('Error closing port:', err.message)
      }
      console.log('Scale Port closed.')
    })

  })

}

export {scaleRead};
