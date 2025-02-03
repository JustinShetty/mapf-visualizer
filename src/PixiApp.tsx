import { useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { Graph } from './Graph';
import { Solution, Orientation, orientationToRotation } from './Solution';
import { Coordinate } from './Graph';
import { BACKGROUND_COLOR, GRID_COLOR, TEXT_COLOR, AGENT_COLORS } from './Params';

const GRID_UNIT_TO_PX: number = 100;

interface PixiAppProps {
    width: number;
    height: number;
    graph: Graph | null;
    solution: Solution | null;
    playAnimation: boolean;
    speed: number;
    loopAnimation: boolean;
    showAgentId: boolean;
}

function drawGrid(viewport: Viewport, graph: Graph) : PIXI.Container {
    const grid = viewport.addChild(new PIXI.Container());

    for (let x: number = 0; x < graph.width; x++) {
        for (let y: number = 0; y < graph.height; y++) {
            const cell = grid.addChild(new PIXI.Graphics());
            cell.rect(x*GRID_UNIT_TO_PX, y*GRID_UNIT_TO_PX, GRID_UNIT_TO_PX, GRID_UNIT_TO_PX)
            .stroke({color: GRID_COLOR, width: 10});
            if (graph.obstacles.has(new Coordinate(x, y).toString())) {
                cell.fill({color: GRID_COLOR});
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
    showAgentId,
}: PixiAppProps, ref) => {
    // this is a mess of state and refs, but how I got everything to work...
    // maybe someday I will clean this up or maybe someone who knows React better than me can help
    const [app, setApp] = useState<PIXI.Application | null>(null);
    const [viewport, setViewport] = useState<Viewport | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [grid, setGrid] = useState<PIXI.Container | null>(null);
    const playAnimationRef = useRef(playAnimation);
    const timestepRef = useRef(0.0); 
    const speedRef = useRef(1.0);
    const loopAnimationRef = useRef(true);
    const hudRef = useRef<PIXI.Container | null>(null);
    const timestepTextRef = useRef<PIXI.Text | null>(null);
    const showAgentIdRef = useRef(false);
    const tickerCallbackRef = useRef<() => void>(() => {});
    const agentsRef = useRef<PIXI.Container | null>(null);

    // Scale a position from grid units to pixels
    const scalePosition = (position: number) : number => {
        return position * GRID_UNIT_TO_PX + GRID_UNIT_TO_PX / 2;
    }

    function stepSize(): number {
        // ticker is called at ~60 Hz
        const totalFramesPerStep = 60 / speedRef.current;
        return 1 / totalFramesPerStep;
    }

    function resetTimestep() {
        timestepRef.current = 0.0;
    }

    useImperativeHandle(ref, () => ({
        skipBackward: () => {
            timestepRef.current = Math.max(0, speedRef.current);
        },
        skipForward: () => {
            console.log(speedRef.current)
            timestepRef.current += speedRef.current;
        },
        restart: () => {
            resetTimestep();
        },
        fit: () => {
            fit();
        },
    }));

    // Fit the viewport to the grid
    const fit = useCallback(() => {
        if (viewport === null || grid === null) return;
        viewport.fitWorld();
        viewport.moveCenter(
            grid.position.x + grid.width / 2,
            grid.position.y + grid.height / 2
        );
    }, [viewport, grid]);

    const moveAndRotateSprites = useCallback((sprites: PIXI.Container[], currentTimestep: number, interpolationProgress: number) => {
        if (solution === null) return

        const currentState = solution[currentTimestep];
        const nextState = solution[currentTimestep + 1];

        // Interpolate between current and next states
        sprites.forEach((sprite, index) => {
            // Show or hide agent ID
            const idText = sprite.children[1];
            if (idText !== undefined) {
                idText.visible = showAgentIdRef.current;
            }

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
            const circleContainer: PIXI.Container = sprite.children[0];
            if (circleContainer === undefined || circleContainer.children.length < 2) return;

            // Interpolate rotation
            const startRotation = orientationToRotation(startPose.orientation);
            const endRotation = orientationToRotation(endPose.orientation);

            circleContainer.rotation =
                startRotation +
                (endRotation - startRotation) * interpolationProgress;
        }); 
    }, [solution]);

    // Animate the solution
    const animateSolution = useCallback(() => {
        if (app === null || viewport === null || solution === null) return;
        if (tickerCallbackRef.current) {
            app.ticker.remove(tickerCallbackRef.current);
            if (agentsRef.current) viewport.removeChild(agentsRef.current);
        }
        resetTimestep();
    
        // Check if the solution is orientation-aware
        const orientationAware: boolean = solution[0][0].orientation !== Orientation.NONE;

        // Create agents for each entity in the first configuration
        const agents = viewport.addChild(new PIXI.Container());
        agentsRef.current = agents;
        let agentId = 0;
        solution[0].forEach(() => {
            const sprite = agents.addChild(new PIXI.Container());
            const circleContainer = sprite.addChild(new PIXI.Container());
            const circle = circleContainer.addChild(new PIXI.Graphics());
            const agentColor = AGENT_COLORS[agentId++ % AGENT_COLORS.length];
            circle
                .circle(0, 0, GRID_UNIT_TO_PX/3)
                .fill(agentColor);
            if (orientationAware) {
                const radius = circle.width / 2;
                const triangle = circleContainer.addChild(new PIXI.Graphics());
                triangle
                    .poly([0, radius, 0, -radius, radius, 0])
                    .fill(BACKGROUND_COLOR);
            }
            const idText = sprite.addChild(new PIXI.Text({
                text: `${agentId}`,
                style: {
                    fontFamily: 'Arial',
                    fontSize: circle.width / 2,
                    fill: TEXT_COLOR,
                }
            }));
            const fontSuperResolutionScale = 2;
            idText.style.fontSize *= fontSuperResolutionScale;
            idText.scale.set(1 / fontSuperResolutionScale, 1 / fontSuperResolutionScale);
            idText.x = -idText.width / 2;
            idText.y = -idText.height / 2;
        });
    
        const animate = () => {
            if (playAnimationRef.current === true) {
                timestepRef.current += stepSize();
            }
            const currentTimestep = Math.floor(timestepRef.current);
            const interpolationProgress = timestepRef.current - currentTimestep;

            if (currentTimestep >= solution.length - 1) {
                if (loopAnimationRef.current) {
                    resetTimestep();
                }
                return;
            }
            if (timestepTextRef.current) {
                timestepTextRef.current.text = `Timestep: ${timestepRef.current.toFixed(1)}`;
            }
            moveAndRotateSprites(agents.children as PIXI.Container[], currentTimestep, interpolationProgress)
        }
        app.ticker.add(animate);
        tickerCallbackRef.current = animate;
    }, [app, viewport, solution, moveAndRotateSprites]);

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
                    background: BACKGROUND_COLOR,
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
                    hudRef.current = app.stage.addChild(new PIXI.Container());
                    const textStyle = new PIXI.TextStyle({
                        fontSize: 24,
                        fill: TEXT_COLOR,
                        stroke: {
                            color: BACKGROUND_COLOR, 
                            width: 4
                        },
                    });
                    timestepTextRef.current = hudRef.current.addChild(
                        new PIXI.Text({style: textStyle})
                    );
                    timestepTextRef.current.position.set(10, 10);
                }
                app.start();
            }
        }
        return () => {app?.stop()};
    }, [app, viewport, height, width]);

    // Resize the viewport when the width or height changes
    useEffect(() => {
        if (app !== null && viewport !== null) {
            app.renderer.resize(width, height);
            viewport.resize(width, height);
            fit();
        }
    }, [app, fit, viewport, width, height]);

    // Draw the grid when the graph changes
    useEffect(() => {
        if (app && viewport && graph) {
            if (grid) viewport.removeChild(grid);
            setGrid(drawGrid(viewport, graph));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [app, graph, viewport]); // Excluding 'grid' to prevent infinite loop

    // Fit the viewport and try to animate the solution when the grid or solution changes
    useEffect(() => {
        fit();
        animateSolution();
    }, [grid, solution, animateSolution, fit]);

    // Update the playAnimationRef when the playAnimation changes
    useEffect(() => {
        playAnimationRef.current = playAnimation;
        speedRef.current = speed;
        loopAnimationRef.current = loopAnimation
    }, [playAnimation, speed, loopAnimation]);

    // Update the showAgentIdRef when the showAgentId changes
    useEffect(() => {
        showAgentIdRef.current = showAgentId;
    }, [showAgentId]);

    return <canvas ref={canvasRef} />
});

export default PixiApp;