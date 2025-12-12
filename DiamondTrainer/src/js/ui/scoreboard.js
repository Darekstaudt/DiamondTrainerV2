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
     * Show the correct answer for the current challenge
     */
    showChallengeAnswer() {
        if (!this.currentChallenge) return;
        
        const challenge = this.challenges[this.currentChallenge];
        const answerContainer = document.getElementById('challengeAnswerContainer');
        const answerContent = document.getElementById('challengeAnswerContent');
        
        let answerHTML = `
            <div class="answer-steps">
                <h4>${challenge.title}</h4>
                <p><strong>📝 Solution:</strong></p>
        `;
        
        // Generate step-by-step answer based on challenge type
        switch (this.currentChallenge) {
            case 'rookie':
                answerHTML += `
                    <ol>
                        <li>Go to the <strong>Player Stats</strong> panel</li>
                        <li>Adjust <strong>Pitch Speed</strong> slider to <strong>95 mph</strong></li>
                        <li>Adjust <strong>Launch Angle</strong> slider to <strong>30°</strong></li>
                        <li>Click the <strong>"Take a Swing!"</strong> button in the Forward Pass panel</li>
                        <li>The network will calculate: z = w₀ + w₁(95) + w₂(30), then apply activation</li>
                    </ol>
                    <p class="note">This demonstrates how the neural network processes inputs through the forward pass.</p>
                `;
                break;
                
            case 'single-a':
                answerHTML += `
                    <ol>
                        <li>First, set <strong>Pitch Speed = 90</strong> and <strong>Launch Angle = 25</strong></li>
                        <li>Go to the <strong>Player Ratings (Weights)</strong> panel</li>
                        <li>Adjust weights to achieve prediction ≈ 100 mph. For example:
                            <ul>
                                <li>Set <strong>w₀ (Bias) ≈ 10</strong></li>
                                <li>Set <strong>w₁ ≈ 0.8</strong></li>
                                <li>Set <strong>w₂ ≈ 0.5</strong></li>
                            </ul>
                        </li>
                        <li>Click "Take a Swing!" to verify</li>
                        <li>Formula: z = 10 + 0.8(90) + 0.5(25) = 10 + 72 + 12.5 = 94.5, then apply activation</li>
                    </ol>
                    <p class="note">You may need to fine-tune these values. The weights control how much each input affects the output.</p>
                `;
                break;
                
            case 'double-a':
                answerHTML += `
                    <ol>
                        <li>Find the <strong>Coaching Strategy (Activation)</strong> dropdown</li>
                        <li>Select <strong>"ReLU (Power Hitting)"</strong></li>
                        <li>Click "Take a Swing!" and observe the result</li>
                        <li>Now change to <strong>"Sigmoid (Contact Hitting)"</strong></li>
                        <li>Click "Take a Swing!" again</li>
                    </ol>
                    <p class="note"><strong>Key Differences:</strong></p>
                    <ul>
                        <li><strong>ReLU:</strong> f(z) = max(0, z) - Returns 0 for negative values</li>
                        <li><strong>Sigmoid:</strong> f(z) = 1/(1+e⁻ᶻ) - Squashes output between 0 and 1</li>
                    </ul>
                `;
                break;
                
            case 'triple-a':
                answerHTML += `
                    <ol>
                        <li>Go to the <strong>Training Session</strong> panel</li>
                        <li>Set <strong>Learning Rate</strong> slider (try 0.01 or 0.05)</li>
                        <li>Set <strong>Training Rounds</strong> to at least <strong>20</strong></li>
                        <li>Click <strong>"Run Training Session"</strong></li>
                        <li>Watch as the weights automatically adjust to minimize loss</li>
                        <li>The algorithm uses gradient descent: w = w - α × ∂Loss/∂w</li>
                    </ol>
                    <p class="note">Training iteratively updates weights to reduce prediction error across all data points.</p>
                `;
                break;
                
            case 'major':
                answerHTML += `
                    <ol>
                        <li>This requires experimentation! Start with:
                            <ul>
                                <li><strong>Learning Rate:</strong> 0.01 to 0.05</li>
                                <li><strong>Training Rounds:</strong> 50 to 100</li>
                            </ul>
                        </li>
                        <li>Click "Run Training Session"</li>
                        <li>Check the loss value after training</li>
                        <li>If loss &gt; 10:
                            <ul>
                                <li>Try adjusting learning rate (lower if loss increases, higher if too slow)</li>
                                <li>Increase epochs</li>
                                <li>Reset and try different activation functions</li>
                            </ul>
                        </li>
                    </ol>
                    <p class="note"><strong>Tips:</strong> A good combination is learning rate = 0.01 with 100 epochs using Linear or Sigmoid activation.</p>
                `;
                break;
        }
        
        answerHTML += `</div>`;
        
        answerContent.innerHTML = answerHTML;
        answerContainer.classList.remove('hidden');
        answerContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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