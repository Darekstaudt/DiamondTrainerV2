/**
 * Forward Pass Computation
 * Handles the forward propagation through the network
 */

/**
 * Perform forward pass on the neural network
 * @param {NeuralNetwork} network - The neural network instance
 * @returns {Object} - Results containing z and yHat
 */
function performForwardPass(network) {
    // Compute linear combination: z = w0 + w1*x1 + w2*x2
    network.z = network.w0 + (network.w1 * network.x1) + (network.w2 * network.x2);
    
    // Apply activation function
    network.yHat = network.activate(network.z);
    
    return {
        z: network.z,
        yHat: network.yHat,
        linearEquation: network.getLinearEquationLatex(),
        activationEquation: network.getActivationEquationLatex()
    };
}

/**
 * Display forward pass results in the UI
 * @param {Object} results - Results from performForwardPass
 */
function displayForwardPassResults(results) {
    const resultsDiv = document.getElementById('forwardPassResults');
    const linearValue = document.getElementById('linearValue');
    const predictionValue = document.getElementById('predictionValue');
    const linearEquation = document.getElementById('linearEquation');
    const activationEquation = document.getElementById('activationEquation');
    
    // Show results panel
    resultsDiv.classList.remove('hidden');
    
    // Update LaTeX equations
    linearEquation.innerHTML = `\\[ ${results.linearEquation} \\]`;
    activationEquation.innerHTML = `\\[ ${results.activationEquation} \\]`;
    
    // Update numeric values
    linearValue.innerHTML = `<strong>z</strong> = ${results.z.toFixed(2)}`;
    predictionValue.innerHTML = `<strong>Exit Velocity:</strong> ${results.yHat.toFixed(2)} mph`;
    
    // Re-render MathJax
    if (window.MathJax) {
        MathJax.typesetPromise([linearEquation, activationEquation]).catch((err) => console.log('MathJax error:', err));
    }
    
    // Add visual feedback animation
    resultsDiv.style.animation = 'none';
    setTimeout(() => {
        resultsDiv.style.animation = 'slideIn 0.3s ease';
    }, 10);
}