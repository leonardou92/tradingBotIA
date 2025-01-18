
# Trading Bot con Apalancamiento

Este proyecto es un **bot de trading automatizado** que utiliza **TensorFlow.js** para predecir la dirección del precio de una criptomoneda (en este caso XRP/USDT). El bot realiza operaciones de compra o venta utilizando **apalancamiento**, simulando un monto de inversión y calculando la ganancia/pérdida durante la operación.

## Requisitos

Antes de ejecutar el proyecto, asegúrate de tener lo siguiente instalado en tu sistema:

- **Node.js** (versión 14 o superior)
- **npm** (que se instala junto con Node.js)
- **TensorFlow.js** (para la parte de predicción)

## Pasos para Correr el Proyecto

### Paso 1: Clonar el Repositorio

Abre una terminal o línea de comandos y ejecuta el siguiente comando para clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/trading-bot-con-apalancamiento.git
cd trading-bot-con-apalancamiento
```

Este comando descargará el código fuente del proyecto en tu máquina local y se moverá al directorio del proyecto.

### Paso 2: Instalar Dependencias

El proyecto utiliza `npm` para manejar las dependencias. Asegúrate de tener **Node.js** instalado. Si no lo tienes, puedes descargarlo e instalarlo desde [aquí](https://nodejs.org/).

Una vez dentro del directorio del proyecto, ejecuta el siguiente comando para instalar todas las dependencias necesarias:

```bash
npm install
```

Este comando instalará las bibliotecas necesarias para ejecutar el bot de trading, tales como:

- **@tensorflow/tfjs-node**: TensorFlow.js para Node.js.
- **node-fetch**: Para hacer solicitudes HTTP y obtener datos de Binance.

### Paso 3: Configurar Parámetros en el Código

Antes de ejecutar el bot, asegúrate de configurar correctamente los parámetros en el archivo `index.js`. Aquí hay algunas configuraciones clave que puedes modificar según tus necesidades:

1. **Par de criptomonedas a operar**: En el archivo `index.js`, busca la siguiente variable y cámbiala al par de criptomonedas que deseas operar (por ejemplo, `'XRPUSDT'`).

    ```javascript
    const symbol = 'XRPUSDT'; // Par de criptomonedas a operar
    ```

2. **Intervalo de las velas**: Especifica el intervalo de tiempo para las velas (por ejemplo, `'1m'`, `'5m'`, `'15m'`, etc.). El intervalo define el tiempo que cada vela representará.

    ```javascript
    const interval = '15m';   // Intervalo de tiempo de las velas
    ```

3. **Monto de inversión**: Aquí defines el monto en USDT que deseas invertir en cada operación.

    ```javascript
    const investmentAmount = 100;  // Monto en USDT para invertir
    ```

4. **Porcentaje de Stop Loss**: Este valor define el porcentaje de Stop Loss para limitar las pérdidas en caso de que el mercado se mueva en contra de la predicción.

    ```javascript
    const stopLossPercentage = 0.02;  // Porcentaje de Stop Loss (2%)
    ```

### Paso 4: Ejecutar el Bot de Trading

Una vez configurado el archivo `index.js` con los parámetros deseados, ejecuta el bot usando el siguiente comando:

```bash
node index.js
```

El bot comenzará a predecir la dirección del mercado (subirá o bajará) basándose en el modelo de TensorFlow.js y realizará operaciones simuladas de compra o venta.

### Paso 5: Ver los Resultados

El bot imprimirá en la terminal los resultados de la operación simulada, que incluyen:

- La **decisión de compra o venta**.
- El **precio de compra** y el **Stop Loss**.
- La **dirección de la operación**.
- La **ganancia o pérdida** de la operación.

Ejemplo de salida en la terminal:

```
Decisión: Comprar
Dirección: Subida
Apalancamiento: 10x
Precio de Compra: 1.25 USDT
Stop Loss: 1.22 USDT
Ganancia/Pérdida: 5.3% en 3 horas
```

### Paso 6: Personalización

Puedes personalizar varios aspectos del bot para adaptarlo a tus necesidades. Algunos de los parámetros que puedes modificar son:

- **Par de criptomonedas**: Si deseas operar con otro par de criptomonedas, cambia el valor de `symbol` (por ejemplo, `'BTCUSDT'`).
- **Intervalo de las velas**: Puedes elegir entre diferentes intervalos como `'1m'`, `'5m'`, `'15m'`, etc.
- **Monto de inversión**: Ajusta la cantidad de USDT que deseas invertir en cada operación.
- **Stop Loss**: Cambia el porcentaje de Stop Loss según tu tolerancia al riesgo.

### Paso 7: Mejorar el Modelo

Este bot utiliza un modelo básico de **Long Short-Term Memory (LSTM)** para la predicción del precio. Si deseas mejorar la precisión del modelo, puedes entrenarlo con más datos históricos o ajustar los hiperparámetros del modelo.

Para entrenar el modelo con más datos, sigue los siguientes pasos:

1. **Obtén datos históricos**: Descarga más datos históricos desde Binance u otra fuente de datos.
2. **Entrena el modelo**: Ajusta los hiperparámetros del modelo, como el número de unidades en las capas LSTM o el número de épocas.
3. **Evalúa el modelo**: Usa datos de prueba para verificar la precisión de las predicciones.

