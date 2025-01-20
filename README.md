
# Bot de Trading con TensorFlow.js y Binance API

Este proyecto implementa un bot de trading que usa TensorFlow.js para predecir la dirección del mercado de criptomonedas basándose en el análisis de los precios históricos y realiza operaciones en Binance utilizando la API de Binance. El bot simula operaciones con apalancamiento y establece un precio de Stop Loss para limitar las pérdidas.

## Requisitos

Para ejecutar el proyecto, necesitas tener instalados los siguientes requisitos:

- **Node.js**: Asegúrate de tener instalado Node.js (versión 14 o superior). Puedes descargarlo desde [aquí](https://nodejs.org/).
- **npm** (Node Package Manager): Viene con Node.js, pero asegúrate de que esté actualizado ejecutando `npm install -g npm` en la terminal.

## Instalación

1. **Clonar el repositorio**:

   Clona este repositorio a tu máquina local:

   ```bash
   git clone https://github.com/leonardou92/tradingBotIA.git
   ```

2. **Instalar dependencias**:

   Navega al directorio del proyecto y ejecuta el siguiente comando para instalar las dependencias necesarias:

   ```bash
   cd tradingBotIA
   npm install
   ```

3. **Obtener las credenciales de Binance**:

   Si aún no tienes una cuenta de Binance, regístrate en [Binance](https://www.binance.com/). Luego, obtén las claves API desde la [página de gestión de API de Binance](https://www.binance.com/en/my/settings/api-management). Añade las credenciales de API a las variables de entorno.

## Uso

1. **Configuración de parámetros**:

   Antes de ejecutar el bot, asegúrate de haber configurado correctamente los siguientes parámetros:

   - `symbol`: El símbolo de la criptomoneda que quieres negociar (por ejemplo, 'XRPUSDT').
   - `interval`: El intervalo de las velas (por ejemplo, '15m' para 15 minutos).
   - `lookBackPeriod`: El número de velas históricas que el modelo utilizará para predecir el mercado.
   - `sequenceLength`: El número de velas anteriores para realizar el análisis.
   - `investmentAmount`: El monto en USDT que se invertirá en cada operación.
   - `stopLossPercentage`: El porcentaje de stop loss para limitar las pérdidas.
   - `maxLeverage`: El apalancamiento máximo que se puede utilizar.

2. **Ejecutar el bot**:

   Una vez configurado, puedes ejecutar el bot utilizando el siguiente comando:

   ```bash
   node bot.js
   ```

   El bot descargará datos de precios históricos desde Binance, entrenará el modelo de predicción usando TensorFlow.js y realizará operaciones de compra o venta según la predicción. Las decisiones y resultados de las operaciones se mostrarán en la terminal.

## Cómo Funciona

1. **Obtención de datos del mercado**: El bot utiliza la API de Binance para obtener datos históricos de precios de la criptomoneda especificada. Los datos obtenidos son las velas (OHLC) con el precio de cierre.

2. **Entrenamiento del modelo**: Utiliza TensorFlow.js para procesar los datos históricos, crear secuencias de precios y entrenar un modelo LSTM (Long Short-Term Memory) para predecir la dirección futura del precio (sube o baja).

3. **Predicción**: Una vez entrenado, el modelo realiza una predicción de la dirección del mercado y decide si realizar una operación de compra o venta.

4. **Simulación de operaciones**: El bot simula la operación utilizando apalancamiento y establece un precio de stop loss. Realiza un seguimiento del precio del activo en tiempo real durante el tiempo establecido y evalúa la ganancia o pérdida.

5. **Gestión del riesgo**: El bot calcula el apalancamiento y la duración de la operación basándose en la fuerza de la predicción y establece un precio de stop loss para minimizar las pérdidas.

## Consideraciones

- **Estrategia de Trading**: Este bot simula operaciones basadas en predicciones de precios a corto plazo, utilizando un modelo LSTM para el análisis. No se recomienda usar este bot en cuentas reales sin realizar pruebas exhaustivas.
- **Stop Loss**: El bot implementa un sistema de stop loss para proteger las operaciones en caso de movimientos adversos del mercado.
- **Riesgos**: El uso de apalancamiento puede aumentar las ganancias, pero también incrementa el riesgo. Asegúrate de entender los riesgos asociados antes de utilizar apalancamiento.

## Mejoras Futuras

- **Optimización del modelo**: Mejorar la precisión del modelo de predicción mediante la integración de más indicadores técnicos y análisis fundamental.
- **Integración con WebSockets**: Mejorar la respuesta en tiempo real mediante la integración con WebSockets de Binance para obtener datos de precios en tiempo real.
- **Implementación en Binance API Real**: Actualmente el bot es una simulación. En el futuro, se puede implementar para operar en cuentas reales utilizando la API de Binance.
