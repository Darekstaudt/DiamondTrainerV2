/**
 * UI Controls Handler
 * Manages all user interface interactions and slider updates
 */

class ControlsManager {
    constructor(network, eventLog) {
        this.network = network;
        this.eventLog = eventLog;
        this.setupControls();
    }
    
    /**
     * Initialize all control event listeners
     */
    setupControls() {
        // Player Stats Controls
        this.setupSlider('pitchSpeed', 'pitchSpeedValue', (value) => {
            this.network.setInputs(value, this.network.x2);
            this.eventLog.log(`Pitch speed set to ${value} mph`);
        });
        
        this.setupSlider('launchAngle', 'launchAngleValue', (value) => {
            this.network.setInputs(this.network.x1, value);
            this.eventLog.log(`Launch angle set to ${value}°`);
        });
        
        // Weight Controls
        this.setupSlider('w0', 'w0Value', (value) => {
            this.network.setWeights(value, this.network.w1, this.network.w2);
            this.eventLog.log(`Bias (w₀) updated to ${parseFloat(value).toFixed(2)}`);
            this.animateWeightChange('w0');
        });
        
        this.setupSlider('w1', 'w1Value', (value) => {
            this.network.setWeights(this.network.w0, value, this.network.w2);
            this.eventLog.log(`Weight w₁ updated to ${parseFloat(value).toFixed(2)}`);
            this.animateWeightChange('w1');
        });
        
        this.setupSlider('w2', 'w2Value', (value) => {
            this.network.setWeights(this.network.w0, this.network.w1, value);
            this.eventLog.log(`Weight w₂ updated to ${parseFloat(value).toFixed(2)}`);
            this.animateWeightChange('w2');
        });
        
        // Learning Rate Control
        this.setupSlider('learningRate', 'learningRateValue', (value) => {
            this.eventLog.log(`Learning rate set to ${parseFloat(value).toFixed(3)}`);
        });
        
        // Epochs Control
        this.setupSlider('epochs', 'epochsValue', (value) => {
            // Just update display, no logging needed for every change
        });
        
        // Activation Function Control
        const activationSelect = document.getElementById('activation');
        if (activationSelect) {
            activationSelect.addEventListener('change', (e) => {
                this.network.setActivation(e.target.value);
                this.eventLog.log(`Activation function changed to ${e.target.value}`);
            });
        }
    }
    
    /**
     * Setup a slider with its display value and callback
     */
    setupSlider(sliderId, displayId, callback) {
        const slider = document.getElementById(sliderId);
        const display = document.getElementById(displayId);
        
        if (slider && display) {
            slider.addEventListener('input', (e) => {
                const value = e.target.value;
                display.textContent = parseFloat(value).toFixed(slider.step < 1 ? 1 : 0);
                
                // Add visual feedback
                display.classList.add('value-updated');
                setTimeout(() => {
                    display.classList.remove('value-updated');
                }, 800);
                
                if (callback) callback(value);
            });
        }
    }
    
    /**
     * Animate weight change with visual feedback
     */
    animateWeightChange(weightId) {
        const slider = document.getElementById(weightId);
        if (slider) {
            slider.classList.add('weight-updated');
            setTimeout(() => {
                slider.classList.remove('weight-updated');
            }, 300);
        }
    }
    
    /**
     * Lock/unlock controls (for challenge mode)
     */
    lockControls(lock) {
        const controls = [
            'pitchSpeed', 'launchAngle', 
            'w0', 'w1', 'w2', 
            'activation', 'learningRate', 'epochs'
        ];
        
        controls.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.disabled = lock;
            }
        });
    }
    
    /**
     * Reset all controls to default values
     */
    resetControls() {
        document.getElementById('pitchSpeed').value = 90;
        document.getElementById('pitchSpeedValue').textContent = '90';
        document.getElementById('launchAngle').value = 25;
        document.getElementById('launchAngleValue').textContent = '25';
        document.getElementById('w0').value = 0;
        document.getElementById('w0Value').textContent = '0.0';
        document.getElementById('w1').value = 1;
        document.getElementById('w1Value').textContent = '1.0';
        document.getElementById('w2').value = 0.5;
        document.getElementById('w2Value').textContent = '0.5';
        document.getElementById('activation').value = 'identity';
        document.getElementById('learningRate').value = 0.01;
        document.getElementById('learningRateValue').textContent = '0.01';
        document.getElementById('epochs').value = 10;
        document.getElementById('epochsValue').textContent = '10';
        
        this.network.setInputs(90, 25);
        this.network.setWeights(0, 1, 0.5);
        this.network.setActivation('identity');
        
        this.eventLog.log('Controls reset to default values');
    }
}