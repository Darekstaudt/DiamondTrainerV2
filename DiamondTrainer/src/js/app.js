/**
 * DiamondTrainer Main Application
 * Coordinates all components and manages application state
 */

// Global state
let network;
let trainer;
let controls;
let scoreboard;
let eventLog;
let lastLoss = null;

/**
 * Event Log Manager
 */
class EventLog {
    constructor() {
        this.logElement = document.getElementById('eventLog');
        this.visible = true;
    }
    
    log(message) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
        this.logElement.insertBefore(entry, this.logElement.firstChild);
        
        // Keep only last 20 entries
        while (this.logElement.children.length > 20) {
            this.logElement.removeChild(this.logElement.lastChild);
        }
    }
    
    toggle() {
        this.visible = !this.visible;
        this.logElement.classList.toggle('hidden');
    }
}

/**
 * Load and display dataset
 */
async function loadDataset() {
    try {
        const response = await fetch('data/sample-data.json');
        const dataset = await response.json();
        
        // Set dataset in trainer
        trainer.setDataset(dataset);
        
        // Display dataset table
        displayDatasetTable(dataset);
        
        eventLog.log('Scouting report loaded successfully');
        return dataset;
    } catch (error) {
        console.error('Error loading dataset:', error);
        eventLog.log('Error loading scouting report');
        
        // Use fallback dataset
        const fallbackDataset = [
            { pitchSpeed: 85, launchAngle: 20, exitVelocity: 95 },
            { pitchSpeed: 90, launchAngle: 25, exitVelocity: 102 },
            { pitchSpeed: 95, launchAngle: 30, exitVelocity: 108 },
            { pitchSpeed: 88, launchAngle: 22, exitVelocity: 98 },
            { pitchSpeed: 92, launchAngle: 28, exitVelocity: 105 }
        ];
        trainer.setDataset(fallbackDataset);
        displayDatasetTable(fallbackDataset);
        return fallbackDataset;
    }
}

/**
 * Display dataset in table format
 */
function displayDatasetTable(dataset) {
    const tableDiv = document.getElementById('datasetTable');
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>Pitch Speed (mph)</th>
                    <th>Launch Angle (°)</th>
                    <th>Exit Velocity (mph)</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    dataset.forEach(row => {
        html += `
            <tr onclick="setInputsFromDataset(${row.pitchSpeed}, ${row.launchAngle})">
                <td>${row.pitchSpeed}</td>
                <td>${row.launchAngle}</td>
                <td>${row.exitVelocity}</td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    tableDiv.innerHTML = html;
}

/**
 * Set inputs from dataset row (called when clicking table row)
 */
function setInputsFromDataset(pitchSpeed, launchAngle) {
    document.getElementById('pitchSpeed').value = pitchSpeed;
    document.getElementById('pitchSpeedValue').textContent = pitchSpeed;
    document.getElementById('launchAngle').value = launchAngle;
    document.getElementById('launchAngleValue').textContent = launchAngle;
    
    network.setInputs(pitchSpeed, launchAngle);
    eventLog.log(`Inputs set from dataset: ${pitchSpeed} mph, ${launchAngle}°`);
}

/**
 * Initialize application
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize components
    network = new NeuralNetwork();
    trainer = new Trainer(network);
    eventLog = new EventLog();
    scoreboard = new Scoreboard();
    controls = new ControlsManager(network, eventLog);
    
    eventLog.log('DiamondTrainer initialized');
    
    // Load dataset
    await loadDataset();
    
    // Instructions overlay
    const instructionsOverlay = document.getElementById('instructionsOverlay');
    const closeInstructionsBtn = document.getElementById('closeInstructions');
    
    closeInstructionsBtn.addEventListener('click', () => {
        instructionsOverlay.classList.add('hidden');
        eventLog.log('Welcome to Training Camp! Let\'s get started! ⚾');
    });
    
    // Forward Pass button
    const forwardPassBtn = document.getElementById('forwardPassBtn');
    forwardPassBtn.addEventListener('click', () => {
        const results = performForwardPass(network);
        displayForwardPassResults(results);
        eventLog.log(`Forward pass computed: ŷ = ${results.yHat.toFixed(2)} mph`);
        
        // Check if challenge is active
        if (scoreboard.currentChallenge) {
            const passed = scoreboard.checkChallenge(network, trainer, lastLoss);
            scoreboard.showFeedback(passed);
        }
    });
    
    // Training button
    const trainBtn = document.getElementById('trainBtn');
    const trainingResults = document.getElementById('trainingResults');
    const lossValue = document.getElementById('lossValue');
    const epochProgress = document.getElementById('epochProgress');
    
    trainBtn.addEventListener('click', async () => {
        const learningRate = parseFloat(document.getElementById('learningRate').value);
        const epochs = parseInt(document.getElementById('epochs').value);
        
        trainer.setLearningRate(learningRate);
        trainingResults.classList.remove('hidden');
        trainBtn.disabled = true;
        trainBtn.textContent = 'Training... 🏃';
        
        eventLog.log(`Starting training: ${epochs} epochs, LR=${learningRate.toFixed(3)}`);
        
        await trainer.train(epochs, (currentEpoch, totalEpochs, result) => {
            lossValue.textContent = result.loss.toFixed(4);
            epochProgress.textContent = `${currentEpoch}/${totalEpochs}`;
            lastLoss = result.loss;
            
            // Update weight displays
            document.getElementById('w0Value').textContent = result.weights.w0.toFixed(2);
            document.getElementById('w1Value').textContent = result.weights.w1.toFixed(2);
            document.getElementById('w2Value').textContent = result.weights.w2.toFixed(2);
            document.getElementById('w0').value = result.weights.w0;
            document.getElementById('w1').value = result.weights.w1;
            document.getElementById('w2').value = result.weights.w2;
        });
        
        trainBtn.disabled = false;
        trainBtn.textContent = 'Run Training Session 🏃';
        eventLog.log(`Training complete! Final loss: ${lastLoss.toFixed(4)}`);
        
        // Check if challenge is active
        if (scoreboard.currentChallenge) {
            const passed = scoreboard.checkChallenge(network, trainer, lastLoss);
            scoreboard.showFeedback(passed);
        }
    });
    
    // Challenge buttons
    const challengeBtns = document.querySelectorAll('.challenge-btn');
    challengeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const level = btn.dataset.level;
            scoreboard.startChallenge(level);
            eventLog.log(`Challenge started: ${level}`);
        });
    });
    
    // Hint button
    const hintBtn = document.getElementById('hintBtn');
    hintBtn.addEventListener('click', () => {
        scoreboard.showHint();
    });
    
    // Submit challenge button
    const submitChallengeBtn = document.getElementById('submitChallengeBtn');
    submitChallengeBtn.addEventListener('click', () => {
        if (scoreboard.currentChallenge) {
            const passed = scoreboard.checkChallenge(network, trainer, lastLoss);
            scoreboard.showFeedback(passed);
            
            if (passed) {
                eventLog.log(`✓ Challenge completed: ${scoreboard.currentChallenge}`);
            } else {
                eventLog.log(`✗ Challenge not completed. Keep trying!`);
            }
        }
    });
    
    // Toggle event log
    const toggleLogBtn = document.getElementById('toggleLog');
    toggleLogBtn.addEventListener('click', () => {
        eventLog.toggle();
        toggleLogBtn.textContent = eventLog.visible ? 'Hide' : 'Show';
    });
    
    // Initialize scoreboard
    scoreboard.updateScoreboard();
    
    eventLog.log('All systems ready! Click a challenge to begin! 🏆');
});