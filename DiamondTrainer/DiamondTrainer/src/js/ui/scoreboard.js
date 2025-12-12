// This file manages the scoreboard functionality, tracking challenge completion and accuracy. 
// It updates the display based on user actions and provides visual feedback.

class Scoreboard {
    constructor() {
        this.score = 0;
        this.challengesCompleted = 0;
        this.accuracy = 0;
        this.scoreElement = document.getElementById('score');
        this.challengesElement = document.getElementById('challenges-completed');
        this.accuracyElement = document.getElementById('accuracy');
    }

    updateScore(points) {
        this.score += points;
        this.render();
    }

    completeChallenge() {
        this.challengesCompleted += 1;
        this.render();
    }

    updateAccuracy(correct, total) {
        if (total > 0) {
            this.accuracy = (correct / total) * 100;
        } else {
            this.accuracy = 0;
        }
        this.render();
    }

    render() {
        this.scoreElement.textContent = `Score: ${this.score}`;
        this.challengesElement.textContent = `Challenges Completed: ${this.challengesCompleted}`;
        this.accuracyElement.textContent = `Accuracy: ${this.accuracy.toFixed(2)}%`;
    }
}

// Export the Scoreboard class for use in other modules
export default Scoreboard;