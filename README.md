# `JustinShetty/mapf-visualizer`

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
[![ci](https://github.com/JustinShetty/mapf-visualizer/actions/workflows/ci.yml/badge.svg)](https://github.com/JustinShetty/mapf-visualizer/actions/workflows/ci.yml)

This repository hosts the web-based version of the MAPF (Multi-Agent Pathfinding) Visualizer, adapted from the original [Kei18/mapf-visualizer](https://github.com/Kei18/mapf-visualizer). The app provides an interactive and intuitive way to visualize MAPF solutions directly in your browser.

This project runs entirely client-side and is built using [React](https://reactjs.org/) and [PixiJS](https://pixijs.com/).

## Try it now!

[https://justinshetty.github.io/mapf-visualizer/](https://justinshetty.github.io/mapf-visualizer/)

## Features

- **Browser-Based Interface**: No installation required, simply access the app through the GitHub Pages site.
- **Customizable Input**: Upload your own MAPF maps and solutions.
- **Real-Time Visualization**: Observe agent movements step-by-step.

## Demo
![demo](./assets/demo.gif)

## Usage

1. **Upload a Map File**: Load your MAPF map file (.txt format).
2. **Upload a Solution File**: Load the corresponding solution file (.txt format).
3. **Visualize**: The solution will automatically play
4. **Controls**:
    - **Play/Pause**: Start or pause the visualization.
    - **Step Forward/Backward**: Navigate the simulation frame-by-frame.
    - **Step Size Adjustment**: Change the playback speed.
    - **Restart Animation**: Restart the visualization from the beginning.
    - **Toggle Animation**: Enable or disable the animation.
    - **Reset View**: Reset the visualization to the initial view.
    - **Take a Screenshot**: Capture the current state of the visualization as an image.
    - **Toggle Agent IDs**: Show or hide the IDs of the agents.
    - **Toggle Cell IDs**: Show or hide the IDs of the cells.
    - **Toggle Traveled Paths**: Show or hide the paths that agents have traveled.
    - **Toggle Goal Markers**: Show or hide the goal markers for the agents.
    - **Toggle Goal Vectors**: Show or hide the vectors pointing to the agents' goals.


## File Format

### Map File
The map file defines the grid layout with open locations and obstacles. Format example:
```
type octile
height 4
width 8
map
.@@@@@@.
..@...@.
@...@...
@@@@@@@.
```
- **type**: Always `octile` for MAPF visualizations.
- **height**: Number of rows in the grid.
- **width**: Number of columns in the grid.
- **map**: Grid definition using characters:
  - `.`: Open location.
  - `@`: Obstacle.

### Solution File
The solution file specifies the paths agents will take. Format example:
```
0:(0,0,Y_MINUS),
1:(0,0,X_PLUS),
2:(1,0,X_PLUS),
3:(1,0,Y_PLUS),
4:(1,1,Y_PLUS),
5:(1,1,X_PLUS),
```
- Each line defines the agents' states at a particular timestep:
  - **Timestep**: Integer identifier before the colon.
  - **Pose**: Each `(...),` represents an agent's pose. The first two elements are the x and y coordinates respectively. The third element (e.g. `X_PLUS`) is optional if your solver considers orientation. 

> [!WARNING]
> Please note that either **all** or **none** of the poses must contain orientation. A mix of orientation and orientation-less poses is not supported.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

Special thanks to [Kei18](https://github.com/Kei18) for creating the original MAPF Visualizer.

## Contact

For questions or support, feel free to open an issue.

## Contributing
If you wish to contribute, please open a pull request and I'll review the changes as soon as practical.

<details>
  <summary>Development Instructions</summary>

### Running the Development Server

To run the development server locally, follow these steps:

1. **Clone the Repository**:
   ```sh
   git clone https://github.com/JustinShetty/mapf-visualizer.git
   cd mapf-visualizer
   ```

2. **Install Dependencies**:
   ```sh
   npm install
   ```

3. **Start the Development Server**:
   ```sh
   npm run dev
   ```

### Linting the Codebase

To maintain code quality, lint the codebase using the following commands:

1. **Run Linter**:
   ```sh
   npm run lint
   ```

</details>

