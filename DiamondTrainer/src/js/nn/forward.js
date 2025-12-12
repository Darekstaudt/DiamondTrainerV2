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

/**
 * Find the closest matching data point in the dataset
 * @param {number} pitchSpeed - Input pitch speed
 * @param {number} launchAngle - Input launch angle
 * @param {Array} dataset - Training dataset
 * @returns {Object} - Closest matching data point
 */
function findClosestDataPoint(pitchSpeed, launchAngle, dataset) {
    if (!dataset || dataset.length === 0) {
        return null;
    }
    
    let closest = dataset[0];
    let minDistance = Infinity;
    
    dataset.forEach(point => {
        const distance = Math.sqrt(
            Math.pow(point.pitchSpeed - pitchSpeed, 2) +
            Math.pow(point.launchAngle - launchAngle, 2)
        );
        
        if (distance < minDistance) {
            minDistance = distance;
            closest = point;
        }
    });
    
    return closest;
}

/**
 * Display the correct answer based on dataset
 * @param {number} pitchSpeed - Current pitch speed
 * @param {number} launchAngle - Current launch angle
 * @param {Array} dataset - Training dataset
 */
function displayCorrectAnswer(pitchSpeed, launchAngle, dataset) {
    const answerContainer = document.getElementById('answerContainer');
    const answerContent = document.getElementById('answerContent');
    
    if (!dataset || dataset.length === 0) {
        answerContent.innerHTML = `
            <p>⚠️ No dataset loaded. Please check the scouting report.</p>
        `;
        answerContainer.classList.remove('hidden');
        return;
    }
    
    // Find closest data point
    const closest = findClosestDataPoint(pitchSpeed, launchAngle, dataset);
    
    if (!closest) {
        answerContent.innerHTML = `
            <p>⚠️ Unable to find matching data point.</p>
        `;
        answerContainer.classList.remove('hidden');
        return;
    }
    
    // Calculate how close the inputs are to the dataset point
    const pitchDiff = Math.abs(closest.pitchSpeed - pitchSpeed);
    const angleDiff = Math.abs(closest.launchAngle - launchAngle);
    const isExactMatch = pitchDiff === 0 && angleDiff === 0;
    
    // Display the answer
    answerContent.innerHTML = `
        <p><strong>Based on the scouting report:</strong></p>
        ${isExactMatch ? 
            `<p>✓ Your inputs match a data point exactly!</p>` : 
            `<p>📊 Closest match in dataset:<br>
            Pitch Speed: ${closest.pitchSpeed} mph (${pitchDiff > 0 ? `${pitchDiff} mph difference` : 'exact'})<br>
            Launch Angle: ${closest.launchAngle}° (${angleDiff > 0 ? `${angleDiff}° difference` : 'exact'})</p>`
        }
        <span class="answer-value">${closest.exitVelocity} mph</span>
        <p><em>Expected Exit Velocity from historical data</em></p>
        ${!isExactMatch ? 
            `<p class="info-note">💡 <strong>Note:</strong> Your inputs (${pitchSpeed} mph, ${launchAngle}°) don't exactly match a data point. The answer shown is from the closest matching scenario in our scouting report.</p>` : 
            ''
        }
    `;
    
    // Show the container
    answerContainer.classList.remove('hidden');
    
    // Scroll to the answer
    answerContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}