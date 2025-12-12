/**
 * Scoreboard and Challenges Manager
 * Tracks user progress and manages challenge system
 */

class Scoreboard {
    constructor() {
        this.challengesCompleted = 0;
        this.challengesAttempted = 0;
        this.currentChallenge = null;
        this.currentHintLevel = 0;
        
        this.challenges = {
            'rookie': {
                title: 'Rookie League: Understanding Forward Pass',
                description: 'Set pitch speed to 95 mph and launch angle to 30°. What will be the predicted exit velocity with current weights?',
                check: (network) => {
                    return Math.abs(network.x1 - 95) < 0.1 && Math.abs(network.x2 - 30) < 0.1;
                },
                hints: [
                    'Use the Player Stats sliders to adjust the inputs.',
                    'Pitch speed should be 95 mph and launch angle should be 30°.',
                    'After setting the values, click "Take a Swing" to see the prediction.'
                ]
            },
            'single-a': {
                title: 'Single-A: Adjusting Weights',
                description: 'Try to get an exit velocity prediction of approximately 100 mph by adjusting the weights. (Pitch speed: 90, Launch angle: 25)',
                check: (network) => {
                    performForwardPass(network);
                    return Math.abs(network.yHat - 100) < 5;
                },
                hints: [
                    'You need to adjust the weights (w₀, w₁, w₂) to change the prediction.',
                    'The formula is: z = w₀ + w₁×90 + w₂×25, then apply activation.',
                    'Try increasing w₀ (bias) to shift the prediction higher.'
                ]
            },
            'double-a': {
                title: 'Double-A: Activation Functions',
                description: 'Use ReLU activation and set weights so that the prediction is positive. Then switch to Sigmoid and observe the difference.',
                check: (network) => {
                    return network.activationType === 'sigmoid';
                },
                hints: [
                    'Change the activation function using the dropdown menu.',
                    'ReLU returns 0 for negative inputs, max(0, z).',
                    'Sigmoid squashes output between 0 and 1.'
                ]
            },
            'triple-a': {
                title: 'Triple-A: Training Understanding',
                description: 'Run a training session with at least 20 epochs. Observe how the weights change to minimize loss.',
                check: (network, trainer) => {
                    return trainer && !trainer.isTraining;
                },
                hints: [
                    'Set the Training Rounds slider to at least 20.',
                    'Click "Run Training Session" to start gradient descent.',
                    'Watch the weights update automatically to reduce loss.'
                ]
            },
            'major': {
                title: 'Major League: Optimization Challenge',
                description: 'Achieve a loss below 10.0 by training the network on the dataset. Use appropriate learning rate and epochs.',
                check: (network, trainer, lastLoss) => {
                    return lastLoss !== null && lastLoss < 10.0;
                },
                hints: [
                    'You may need to adjust the learning rate for better convergence.',
                    'Try different numbers of epochs (higher might be better).',
                    'A learning rate around 0.001-0.01 usually works well.'
                ]
            }
        };
    }
    
    /**
     * Start a challenge
     */
    startChallenge(level) {
        this.currentChallenge = level;
        this.currentHintLevel = 0;
        this.challengesAttempted++;
        
        const challenge = this.challenges[level];
        const descriptionDiv = document.getElementById('challengeDescription');
        const contentDiv = document.getElementById('challengeContent');
        const feedbackDiv = document.getElementById('challengeFeedback');
        
        // Update UI
        descriptionDiv.innerHTML = `
            <h4>${challenge.title}</h4>
            <p>${challenge.description}</p>
        `;
        
        contentDiv.classList.remove('hidden');
        feedbackDiv.classList.add('hidden');
        
        // Highlight active challenge button
        document.querySelectorAll('.challenge-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-level="${level}"]`).classList.add('active');
    }
    
    /**
     * Check if current challenge is complete
     */
    checkChallenge(network, trainer, lastLoss) {
        if (!this.currentChallenge) return false;
        
        const challenge = this.challenges[this.currentChallenge];
        const passed = challenge.check(network, trainer, lastLoss);
        
        return passed;
    }
    
    /**
     * Show challenge feedback
     */
    showFeedback(passed) {
        const feedbackDiv = document.getElementById('challengeFeedback');
        feedbackDiv.classList.remove('hidden', 'correct', 'incorrect');
        
        if (passed) {
            feedbackDiv.classList.add('correct');
            feedbackDiv.innerHTML = `
                <strong>⚾ Home Run!</strong>
                <p>Challenge completed successfully! You're ready for the next level.</p>
            `;
            this.challengesCompleted++;
            this.currentHintLevel = 0;
        } else {
            feedbackDiv.classList.add('incorrect');
            feedbackDiv.innerHTML = `
                <strong>⚠️ Foul Ball!</strong>
                <p>Not quite right. Try again or use a hint!</p>
            `;
        }
        
        this.updateScoreboard();
    }
    
    /**
     * Show next hint
     */
    showHint() {
        if (!this.currentChallenge) return;
        
        const challenge = this.challenges[this.currentChallenge];
        const hint = challenge.hints[this.currentHintLevel];
        
        if (hint) {
            alert(`💡 Hint ${this.currentHintLevel + 1}:\n\n${hint}`);
            this.currentHintLevel++;
        } else {
            alert('No more hints available! You can do this! 🏆');
        }
    }
    
    /**
     * Update scoreboard display
     */
    updateScoreboard() {
        const completedSpan = document.getElementById('challengesCompleted');
        const accuracySpan = document.getElementById('accuracy');
        const progressFill = document.getElementById('progressFill');
        
        completedSpan.textContent = this.challengesCompleted;
        
        const accuracy = this.challengesAttempted > 0 
            ? (this.challengesCompleted / this.challengesAttempted * 100).toFixed(0)
            : 0;
        accuracySpan.textContent = `${accuracy}%`;
        
        const progress = (this.challengesCompleted / 5) * 100;
        progressFill.style.width = `${progress}%`;
    }
}