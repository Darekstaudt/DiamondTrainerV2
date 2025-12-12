/**
 * Gradient Descent Trainer
 * Implements training logic using gradient descent
 */

class Trainer {
    constructor(network) {
        this.network = network;
        this.learningRate = 0.01;
        this.dataset = [];
        this.isTraining = false;
    }
    
    /**
     * Set the training dataset
     */
    setDataset(dataset) {
        this.dataset = dataset;
    }
    
    /**
     * Set learning rate
     */
    setLearningRate(rate) {
        this.learningRate = parseFloat(rate);
    }
    
    /**
     * Compute mean squared error loss
     */
    computeLoss(predictions, targets) {
        const n = predictions.length;
        let sum = 0;
        for (let i = 0; i < n; i++) {
            const error = predictions[i] - targets[i];
            sum += error * error;
        }
        return sum / n;
    }
    
    /**
     * Compute gradients for a single data point
     */
    computeGradients(x1, x2, yTrue) {
        // Forward pass
        const z = this.network.w0 + (this.network.w1 * x1) + (this.network.w2 * x2);
        const yPred = this.network.activate(z);
        
        // Compute error
        const error = yPred - yTrue;
        
        // Compute gradients using chain rule
        // dL/dw = dL/dy * dy/dz * dz/dw
        const activationDerivative = this.network.activateDerivative(z);
        
        const dw0 = error * activationDerivative * 1;      // derivative w.r.t. w0
        const dw1 = error * activationDerivative * x1;     // derivative w.r.t. w1
        const dw2 = error * activationDerivative * x2;     // derivative w.r.t. w2
        
        return { dw0, dw1, dw2, loss: error * error };
    }
    
    /**
     * Perform one epoch of training
     */
    async trainEpoch() {
        let totalLoss = 0;
        let dw0_sum = 0, dw1_sum = 0, dw2_sum = 0;
        
        // Compute gradients for all data points
        for (const datapoint of this.dataset) {
            const { dw0, dw1, dw2, loss } = this.computeGradients(
                datapoint.pitchSpeed,
                datapoint.launchAngle,
                datapoint.exitVelocity
            );
            
            dw0_sum += dw0;
            dw1_sum += dw1;
            dw2_sum += dw2;
            totalLoss += loss;
        }
        
        // Average gradients
        const n = this.dataset.length;
        dw0_sum /= n;
        dw1_sum /= n;
        dw2_sum /= n;
        totalLoss /= n;
        
        // Update weights using gradient descent
        this.network.w0 -= this.learningRate * dw0_sum;
        this.network.w1 -= this.learningRate * dw1_sum;
        this.network.w2 -= this.learningRate * dw2_sum;
        
        return {
            loss: totalLoss,
            weights: {
                w0: this.network.w0,
                w1: this.network.w1,
                w2: this.network.w2
            }
        };
    }
    
    /**
     * Train for multiple epochs with UI updates
     */
    async train(epochs, onEpochComplete) {
        this.isTraining = true;
        
        for (let epoch = 0; epoch < epochs; epoch++) {
            if (!this.isTraining) break;
            
            const result = await this.trainEpoch();
            
            // Call callback to update UI
            if (onEpochComplete) {
                onEpochComplete(epoch + 1, epochs, result);
            }
            
            // Small delay to allow UI updates
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        this.isTraining = false;
    }
    
    /**
     * Stop training
     */
    stopTraining() {
        this.isTraining = false;
    }
}