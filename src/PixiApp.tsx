import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { Graph } from './Graph';
import { Solution, Orientation, orientationToRotation } from './Solution';
import { Coordinate } from './Graph';

const GRID_UNIT_TO_PX: number = 100;

interface PixiAppProps {
    width: number;
    height: number;
    graph: Graph | null;
    solution: Solution | null;
    playAnimation: boolean;
    speed: number;
    loopAnimation: boolean;
}

// Scale a position from grid units to pixels
const scalePosition = (position: number) : number => {
    return position * GRID_UNIT_TO_PX + GRID_UNIT_TO_PX / 2;
}

function drawGrid(viewport: Viewport, graph: Graph) : PIXI.Container {
    let grid = viewport.addChild(new PIXI.Container());

    for (let x: number = 0; x < graph.width; x++) {
        for (let y: number = 0; y < graph.height; y++) {
            let cell = grid.addChild(new PIXI.Graphics());
            cell.rect(x*GRID_UNIT_TO_PX, y*GRID_UNIT_TO_PX, GRID_UNIT_TO_PX, GRID_UNIT_TO_PX)
            .stroke({color: 0x000000, width: 10});
            if (graph.obstacles.has(new Coordinate(x, y).toString())) {
                cell.fill({color: 0x000000});
            }
        }
    }

    viewport.worldHeight = grid.height * 1.1;
    viewport.worldWidth = grid.width * 1.1;
    return grid;
}

const PixiApp = forwardRef(({ 
    width, 
    height, 
    graph, 
    solution, 
    playAnimation,
    speed,
    loopAnimation,
}: PixiAppProps, ref) => {
    const [app, setApp] = useState<PIXI.Application | null>(null);
    const [viewport, setViewport] = useState<Viewport | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [grid, setGrid] = useState<PIXI.Container | null>(null);
    const playAnimationRef = useRef(playAnimation);
    const timestepRef = useRef(0.0); 
    const speedRef = useRef(1.0);
    const loopAnimationRef = useRef(true);

    function stepSize(): number {
        // ticker is called at ~60 Hz
        let totalFramesPerStep = 60 / speedRef.current;
        return 1 / totalFramesPerStep;
    }

    function resetTimestep() {
        timestepRef.current = 0.0;
    }

    useImperativeHandle(ref, () => ({
        skipBackward: () => {
            timestepRef.current = Math.max(0, timestepRef.current - stepSize());
        },
        skipForward: () => {
            timestepRef.current += stepSize();
        },
        restart: () => {
            resetTimestep();
        },
    }));

    // Fit the viewport to the grid
    const fit = () => {
        if (viewport === null || grid === null) return;
        viewport.fitWorld();
        viewport.moveCenter(
            grid.position.x + grid.width / 2,
            grid.position.y + grid.height / 2
        )
    }

    const moveAndRotateSprites = (sprites: PIXI.Container[], currentTimestep: number, interpolationProgress: number) => {
        if (solution === null) return

        const currentState = solution[currentTimestep];
        const nextState = solution[currentTimestep + 1];

        // Interpolate between current and next states
        sprites.forEach((sprite, index) => {
            const startPose = currentState[index];
            const endPose = nextState[index];

            // Interpolate position
            sprite.x =
                startPose.position.x +
                (endPose.position.x - startPose.position.x) * interpolationProgress;
            sprite.y = 
                startPose.position.y +
                (endPose.position.y - startPose.position.y) * interpolationProgress;
            sprite.x = scalePosition(sprite.x);
            sprite.y = scalePosition(sprite.y);

            // orientation-aware visualization has two objects for each sprite
            if (sprite.children.length == 1) return;

            // Interpolate rotation
            const startRotation = orientationToRotation(startPose.orientation);
            const endRotation = orientationToRotation(endPose.orientation);

            sprite.rotation =
                startRotation +
                (endRotation - startRotation) * interpolationProgress;
        }); 
    }

    // Animate the solution
    const animateSolution = () => {
        if (app === null || viewport === null || solution === null) return;
        resetTimestep();
        const sprites: PIXI.Container[] = [];
    
        // Check if the solution is orientation-aware
        const orientation_aware: boolean = solution[0][0].orientation !== Orientation.NONE;

        // Create sprites for each entity in the first configuration
        let agents = viewport.addChild(new PIXI.Container());
        solution[0].forEach(() => {
            const sprite = agents.addChild(new PIXI.Container());
            let circle = sprite.addChild(new PIXI.Graphics());
            circle
                .circle(0, 0, GRID_UNIT_TO_PX/3)
                .fill(0x0000ff);
            if (orientation_aware) {
                const radius = circle.width / 2;
                let triangle = sprite.addChild(new PIXI.Graphics());
                triangle
                    .poly([0, radius, 0, -radius, radius, 0])
                    .fill(0xffffff);
            }
            sprites.push(sprite);
        });
    
        const animate = () => {
            if (playAnimationRef.current === true) {
                timestepRef.current += stepSize();
            }
            // console.log("timestepRef.current: ", timestepRef.current)
            let currentTimestep = Math.floor(timestepRef.current);
            let interpolationProgress = timestepRef.current - currentTimestep;

            if (currentTimestep >= solution.length - 1) {
                if (loopAnimationRef.current) {
                    resetTimestep();
                } else {
                    viewport.removeChild(agents);
                }
                return;
            }
            moveAndRotateSprites(sprites, currentTimestep, interpolationProgress)
        }
        app.ticker.add(animate)
    }

    // Initialize the app and viewport when the canvas is ready
    useEffect(() => {
        if (app === null) {
            const canvas = canvasRef.current;
            if (canvas) {
                const pixiApp = new PIXI.Application();
                pixiApp.init({ 
                    width: width, 
                    height: height, 
                    canvas: canvas, 
                    background: 0xffffff,
                }).then(() => {
                    setApp(pixiApp);
                });
            }
        } else {
            app.canvas.style.position = "absolute";
            if (viewport === null) {
                const viewport = new Viewport({
                    screenWidth: width,
                    screenHeight: height,
                    worldWidth: width*2,
                    worldHeight: height*2,
                    events: app.renderer.events,
                });
                viewport.drag().pinch().wheel();
                setViewport(viewport);
            } else {
                if (app.stage.children.length === 0) {
                    app.stage.addChild(viewport);
                }
                app.start();
            }
        }
        return () => {app?.stop()};
    }, [app, viewport]);

    // Resize the viewport when the width or height changes
    useEffect(() => {
        if (app !== null && viewport !== null) {
            app.renderer.resize(width, height);
            viewport.resize(width, height);
            fit();
        }
    }, [width, height]);

    // Draw the grid when the graph changes
    useEffect(() => {
        if (app && viewport && graph) {
            if (grid) viewport.removeChild(grid);
            setGrid(drawGrid(viewport, graph));
        }
    }, [graph]);

    // Fit the viewport and try to animate the solution when the grid or solution changes
    useEffect(() => {
        fit();
        animateSolution();
    }, [grid, solution]);

    // Update the playAnimationRef when the playAnimation changes
    useEffect(() => {
        playAnimationRef.current = playAnimation;
        speedRef.current = speed;
        loopAnimationRef.current = loopAnimation
    }, [playAnimation, speed, loopAnimation]);

    return <canvas ref={canvasRef} />
});

export default PixiApp;