# DiamondTrainer ⚾ — Neural Network Training Camp

Welcome to DiamondTrainer, a web-based application designed to teach users about neural networks through an engaging baseball-themed interface. This application covers key concepts such as forward passes, hidden layers, and gradient descent, making learning about neural networks fun and interactive.

## Features

- **Interactive Learning**: Users can explore the mechanics of neural networks through hands-on activities.
- **Baseball Theme**: The interface is designed with a baseball theme to make learning enjoyable.
- **Forward Pass Computation**: Visualize how inputs are processed through the network.
- **Gradient Descent Training**: Understand how weights are updated during training.
- **Real-time Feedback**: Get immediate feedback on user inputs and actions.

## Project Structure

```
DiamondTrainer
├── src
│   ├── index.html         # Main HTML layout of the application
│   ├── css
│   │   └── styles.css     # CSS styles for the application
│   ├── js
│   │   ├── app.js         # Initializes the application and handles user interactions
│   │   ├── ui
│   │   │   ├── scoreboard.js # Manages scoreboard functionality
│   │   │   └── controls.js   # Handles UI controls and input validation
│   │   └── nn
│   │       ├── network.js    # Neural network implementation
│   │       ├── forward.js     # Forward pass calculations
│   │       └── trainer.js     # Gradient descent training logic
│   └── data
│       └── sample-data.json   # Sample data for visualization
├── .gitignore               # Files and directories to be ignored by Git
├── package.json             # npm configuration file
├── README.md                # Documentation for the project
└── LICENSE                  # Licensing information
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Darekstaudt/DiamondTrainerV2.git
   ```
2. Navigate to the project directory:
   ```
   cd DiamondTrainerV2
   ```
3. Install dependencies (if any):
   ```
   npm install
   ```

## Usage

1. Open `src/index.html` in your web browser.
2. Follow the on-screen instructions to learn about neural networks.
3. Experiment with different player stats and weights to see how they affect the training process.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

---

Enjoy your journey into the world of neural networks with DiamondTrainer!