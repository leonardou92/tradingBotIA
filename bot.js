import fetch from 'node-fetch';
import * as tf from '@tensorflow/tfjs-node';  // TensorFlow.js con soporte para Node.js

const binanceAPI = 'https://api.binance.com/api/v3/klines';
const symbol = 'XRPUSDT'; // Símbolo de la criptomoneda
const interval = '15m';  // Intervalo de 15 minutos para la operación
const lookBackPeriod = 200; // Cantidad de velas históricas para análisis
const sequenceLength = 10;  // Cantidad de velas anteriores para análisis
const investmentAmount = 100; // Monto en USDT para invertir en cada operación
const stopLossPercentage = 0.02; // Porcentaje de Stop Loss (2% de pérdida)
const maxLeverage = 20;  // Apalancamiento máximo
let currentCryptoAmount = 0;  // Cantidad de criptomonedas que poseemos
let initialPrice = 0;  // Precio de la criptomoneda al momento de la compra
let decision = ""; // Decisión de compra o venta
let stopLossPrice = 0; // Precio del Stop Loss
let operationDuration = 0; // Duración dinámica de la operación en minutos
let analysisTime = 0; // Tiempo cuando se montó la orden
let priceDirection = ""; // Dirección de la operación ("sube" o "baja")
let analysisStrength = 0; // Fuerza de la predicción (1 fuerte, 0 débil)
let leverage = 1;  // Apalancamiento inicial (sin apalancamiento)

console.log("Iniciando el bot de trading con precios reales...");

// Función para obtener datos históricos de Binance
async function fetchMarketData() {
  const response = await fetch(`${binanceAPI}?symbol=${symbol}&interval=${interval}&limit=${lookBackPeriod}`);
  const data = await response.json();
  return data.map(entry => parseFloat(entry[4])); // Precio de cierre (close price)
}

// Preprocesar los datos para el modelo de IA
function processData(prices, sequenceLength = 10) {
  const sequences = [];
  const labels = [];

  for (let i = 0; i < prices.length - sequenceLength; i++) {
    sequences.push(prices.slice(i, i + sequenceLength)); // Crear secuencia de precios
    labels.push(prices[i + sequenceLength] > prices[i + sequenceLength - 1] ? 1 : 0); // Etiqueta: 1 si sube, 0 si baja
  }

  // Convertir a tensores
  const X = tf.tensor3d(sequences.map(seq => seq.map(price => [price])), [sequences.length, sequenceLength, 1]);
  const y = tf.tensor2d(labels, [labels.length, 1]);

  return { X, y };
}

// Crear y entrenar el modelo LSTM
async function createModel() {
  const model = tf.sequential();

  model.add(tf.layers.lstm({
    units: 50,
    returnSequences: false,
    inputShape: [sequenceLength, 1]
  }));

  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

  model.compile({
    optimizer: 'adam',
    loss: 'binaryCrossentropy',
    metrics: ['accuracy']
  });

  return model;
}

// Función para determinar el apalancamiento basado en la fuerza de la predicción
function calculateLeverage(predictionStrength) {
  if (predictionStrength >= 0.8) {
    return Math.min(maxLeverage, 20);  // Si la predicción es fuerte, usar apalancamiento máximo
  }
  if (predictionStrength >= 0.5) {
    return 5;  // Si la predicción es moderada, usar un apalancamiento más bajo
  }
  return 1;  // Si la predicción es débil, no usar apalancamiento
}

// Función para determinar la duración de la operación basada en la fuerza de la predicción
function calculateOperationDuration(predictionStrength) {
  if (predictionStrength >= 0.8) {
    return 10;  // Si la predicción es fuerte, se operará por 10 minutos
  }
  if (predictionStrength >= 0.5) {
    return 15;  // Si la predicción es moderada, se operará por 15 minutos
  }
  return 20;  // Si la predicción es débil, se operará por 20 minutos
}

// Simular operación con apalancamiento
async function simulateTradeWithLeverage() {
  const marketData = await fetchMarketData();
  const currentPrice = marketData[marketData.length - 1];

  // Crear y entrenar el modelo
  const model = await createModel();
  const processedData = processData(marketData);
  await model.fit(processedData.X, processedData.y, { epochs: 10 });

  // Predicción: determinar si el precio sube o baja
  const predictionTensor = model.predict(tf.tensor3d([marketData.slice(-sequenceLength).map(price => [price])], [1, sequenceLength, 1]));
  const prediction = (await predictionTensor.array())[0][0] > 0.5 ? "sube" : "baja";

  // Decisión basada en la predicción
  decision = prediction === "sube" ? "compra" : "venta";
  priceDirection = prediction;  // Dirección de la operación
  initialPrice = currentPrice;

  console.log(`Decisión: ${decision.toUpperCase()} a ${currentPrice.toFixed(8)} USDT`);
  console.log(`Dirección de la operación: ${priceDirection.toUpperCase()}`);

  // Calcular apalancamiento
  const predictionStrength = Math.abs(predictionTensor.arraySync()[0][0]);
  leverage = calculateLeverage(predictionStrength); // Calcular apalancamiento basado en la predicción
  console.log(`Apalancamiento: ${leverage}x`);

  if (decision === "compra") {
    // Realizar compra (simulada)
    currentCryptoAmount = (investmentAmount * leverage) / currentPrice;  // Con apalancamiento
    console.log(`Cantidad comprada: ${currentCryptoAmount.toFixed(4)} XRP`);

    // Establecer el precio de Stop Loss
    stopLossPrice = initialPrice * (1 - stopLossPercentage);  // Precio de Stop Loss con un 2% de pérdida
    console.log(`Stop Loss activado a: ${stopLossPrice.toFixed(8)} USDT`);

    // Registrar el tiempo en que se montó la orden
    const date = new Date();
    analysisTime = date.getMinutes();  // Tiempo en minutos de la orden
    console.log(`La operación fue montada a las ${date.getHours()}:${date.getMinutes()} minutos`);

    // Calcular la duración dinámica de la operación basada en la fuerza de la predicción
    operationDuration = calculateOperationDuration(predictionStrength);
    console.log(`Duración estimada de la operación: ${operationDuration} minutos`);
  }

  // Evaluar la ganancia o pérdida con apalancamiento cada minuto
  let finalPrice = currentPrice;
  let operationTime = 0; // Tiempo de operación en minutos

  while (operationTime < operationDuration) {
    // Esperar 1 minuto
    await new Promise(resolve => setTimeout(resolve, 60000)); // 60000ms = 1 minuto

    // Obtener nuevo precio en tiempo real
    const newPriceData = await fetchMarketData();
    finalPrice = newPriceData[newPriceData.length - 1];

    console.log(`Minuto ${operationTime + 1}: Precio real: ${finalPrice.toFixed(8)} USDT`);

    // Calcular la ganancia o pérdida
    const profitLoss = (finalPrice - initialPrice) * currentCryptoAmount * leverage; // Ganancia o pérdida con apalancamiento
    console.log(`Ganancia/Pérdida hasta ahora: ${profitLoss.toFixed(2)} USDT`);

    // Si el precio cae por debajo del Stop Loss, vender
    if (finalPrice <= stopLossPrice) {
      console.log(`STOP LOSS alcanzado. Vendiendo a ${finalPrice.toFixed(8)} USDT`);
      break;
    }

    operationTime++;
  }

  // Calcular la ganancia o pérdida final
  const profitLoss = (finalPrice - initialPrice) * currentCryptoAmount * leverage; // Ganancia o pérdida con apalancamiento
  console.log(`Ganancia/Pérdida final: ${profitLoss.toFixed(2)} USDT`);
}

simulateTradeWithLeverage();
