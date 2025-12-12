/**
 * Neural Network Core
 * Manages the neural network structure and state
 */

class NeuralNetwork {
    constructor() {
        // Weights
        this.w0 = 0.0;  // bias
        this.w1 = 1.0;  // pitch speed weight
        this.w2 = 0.5;  // launch angle weight
        
        // Activation function
        this.activationType = 'identity';
        
        // Inputs
        this.x1 = 90;   // pitch speed
        this.x2 = 25;   // launch angle
        
        // Outputs
        this.z = 0;     // linear combination
        this.yHat = 0;  // prediction
    }
    
    /**
     * Set weights
     */
    setWeights(w0, w1, w2) {
        this.w0 = parseFloat(w0);
        this.w1 = parseFloat(w1);
        this.w2 = parseFloat(w2);
    }
    
    /**
     * Set inputs
     */
    setInputs(x1, x2) {
        this.x1 = parseFloat(x1);
        this.x2 = parseFloat(x2);
    }
    
    /**
     * Set activation function type
     */
    setActivation(type) {
        this.activationType = type;
    }
    
    /**
     * Apply activation function
     */
    activate(z) {
        switch(this.activationType) {
            case 'relu':
                return Math.max(0, z);
            case 'sigmoid':
                return 1 / (1 + Math.exp(-z));
            case 'identity':
            default:
                return z;
        }
    }
    
    /**
     * Derivative of activation function (for backpropagation)
     */
    activateDerivative(z) {
        switch(this.activationType) {
            case 'relu':
                return z > 0 ? 1 : 0;
            case 'sigmoid':
                const sig = 1 / (1 + Math.exp(-z));
                return sig * (1 - sig);
            case 'identity':
            default:
                return 1;
        }
    }
    
    /**
     * Get current weights
     */
    getWeights() {
        return {
            w0: this.w0,
            w1: this.w1,
            w2: this.w2
        };
    }
    
    /**
     * Get current inputs
     */
    getInputs() {
        return {
            x1: this.x1,
            x2: this.x2
        };
    }
    
    /**
     * Get LaTeX representation of linear equation
     */
    getLinearEquationLatex() {
        return `z = ${this.w0.toFixed(2)} + ${this.w1.toFixed(2)} \\cdot ${this.x1} + ${this.w2.toFixed(2)} \\cdot ${this.x2}`;
    }
    
    /**
     * Get LaTeX representation of activation equation
     */
    getActivationEquationLatex() {
        let activationName = '';
        switch(this.activationType) {
            case 'relu':
                activationName = '\\text{ReLU}';
                break;
            case 'sigmoid':
                activationName = '\\sigma';
                break;
            case 'identity':
            default:
                activationName = '\\text{identity}';
        }
        return `\\hat{y} = ${activationName}(${this.z.toFixed(2)})`;
    }
}