// This file implements the gradient descent training logic, computing gradients and updating weights. It animates the weight updates and logs actions in the event log.

class Trainer {
    constructor(network) {
        this.network = network;
        this.learningRate = 0.01; // Default learning rate
        this.epochs = 1000; // Default number of training epochs
    }

    train(trainingData) {
        for (let epoch = 0; epoch < this.epochs; epoch++) {
            trainingData.forEach(data => {
                const inputs = data.inputs;
                const target = data.target;

                // Perform a forward pass
                const output = this.network.forward(inputs);

                // Calculate the error
                const error = this.calculateError(target, output);

                // Perform backpropagation
                this.network.backpropagate(error, this.learningRate);
                
                // Log the training progress
                this.logTrainingProgress(epoch, inputs, output, error);
            });
        }
    }

    calculateError(target, output) {
        return target.map((t, i) => t - output[i]);
    }

    logTrainingProgress(epoch, inputs, output, error) {
        console.log(`Epoch: ${epoch}, Inputs: ${inputs}, Output: ${output}, Error: ${error}`);
        // Here you can also update the UI or event log with the training progress
    }

    setLearningRate(rate) {
        this.learningRate = rate;
    }

    setEpochs(num) {
        this.epochs = num;
    }
}

// Export the Trainer class for use in other modules
export default Trainer;