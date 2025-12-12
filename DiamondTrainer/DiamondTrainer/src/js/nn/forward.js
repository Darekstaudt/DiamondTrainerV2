function forwardPass(inputs, weights, biases) {
    const layerOutputs = [];

    // Calculate the output for each layer
    for (let i = 0; i < weights.length; i++) {
        const layerInput = i === 0 ? inputs : layerOutputs[i - 1];
        const layerOutput = [];

        for (let j = 0; j < weights[i].length; j++) {
            let sum = biases[i][j];

            for (let k = 0; k < layerInput.length; k++) {
                sum += layerInput[k] * weights[i][j][k];
            }

            // Apply activation function (ReLU for this example)
            layerOutput[j] = Math.max(0, sum);
        }

        layerOutputs.push(layerOutput);
    }

    return layerOutputs[layerOutputs.length - 1]; // Return the output of the last layer
}

function renderResults(output) {
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = `Output: ${output.map(o => o.toFixed(2)).join(', ')}`;
}

// Example usage
const inputs = [0.5, 0.2]; // Example input values
const weights = [
    [[[0.1, 0.2], [0.3, 0.4]], [[0.5, 0.6], [0.7, 0.8]]], // Layer 1 weights
    [[[0.9, 1.0]], [[1.1, 1.2]]] // Layer 2 weights
];
const biases = [[0.1, 0.2], [0.3]]; // Example biases

const output = forwardPass(inputs, weights, biases);
renderResults(output);