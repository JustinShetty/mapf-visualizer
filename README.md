# `JustinShetty/mapf-visualizer`

This repository hosts the web-based version of the MAPF (Multi-Agent Pathfinding) Visualizer, adapted from the original [Kei18/mapf-visualizer](https://github.com/Kei18/mapf-visualizer). The app provides an interactive and intuitive way to visualize MAPF solutions directly in your browser.

## Feature Roadmap
This is a work-in-progress and has not yet reached feature parity with [Kei18/mapf-visualizer](https://github.com/Kei18/mapf-visualizer).
- [x] Map plotting
- [x] Basic solution animation (with and without rotation)
- [x] Playback control (play, pause, reset, speed adjustment, etc.)
- [x] Timestep display
- [x] Playback control tooltips
- [x] Agent ID display
- [x] Agent coloring
- [ ] Per-agent path drawing
- [x] Keybindings for animation control
- [ ] Built-in screenshot capture with keybind

## Features

- **Browser-Based Interface**: No installation required, simply access the app through the GitHub Pages site.
- **Customizable Input**: Upload your own MAPF maps and solutions.
- **Real-Time Visualization**: Observe agent movements step-by-step.

## Usage

1. **Upload a Map File**: Load your MAPF map file (.txt format).
2. **Upload a Solution File**: Load the corresponding solution file (.txt format).
3. **Visualize**: The solution will automatically play
4. **Controls**:
   - **Play/Pause**: Start or pause the visualization.
   - **Step Forward/Backward**: Navigate the simulation frame-by-frame.
   - **Speed Adjustment**: Change the playback speed.

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
