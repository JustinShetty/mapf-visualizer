import { useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { Graph } from './Graph';
import { Solution, Orientation, orientationToRotation } from './Solution';
import { Coordinate } from './Graph';
import { BACKGROUND_COLOR, GRID_COLOR, TEXT_COLOR, AGENT_COLORS } from './Params';

const GRID_UNIT_TO_PX: number = 100;
const FONT_SUPER_RESOLUTION_SCALE = 3;

interface PixiAppProps {
    width: number;
    height: number;
    graph: Graph | null;
    solution: Solution | null;
    playAnimation: boolean;
    stepSize: number;
    loopAnimation: boolean;
    showAgentId: boolean;
    tracePaths: boolean;
    setCanScreenshot: (canScreenshot: boolean) => void;
    showCellId: boolean,
    showGoals: boolean,
}

const PixiApp = forwardRef(({ 
    width, 
    height, 
    graph, 
    solution, 
    playAnimation,
    stepSize,
    loopAnimation,
    showAgentId,
    tracePaths,
    setCanScreenshot,
    showCellId,
    showGoals,
}: PixiAppProps, ref) => {
    // this is a mess of state and refs, but how I got everything to work...
    // maybe someday I will clean this up or maybe someone who knows React better than me can help
    // 
    // the variables that are used inside the animation callbacks must
    // be stored in refs because the callbacks are created "once" and
    // the variables are updated outside of the callbacks
    const [app, setApp] = useState<PIXI.Application | null>(null);
    const [viewport, setViewport] = useState<Viewport | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [grid, setGrid] = useState<PIXI.Container | null>(null);
    const playAnimationRef = useRef(playAnimation);
    const timestepRef = useRef(0.0); 
    const stepSizeRef = useRef(1.0);
    const loopAnimationRef = useRef(loopAnimation);
    const hudRef = useRef<PIXI.Container | null>(null);
    const timestepTextRef = useRef<PIXI.Text | null>(null);
    const showAgentIdRef = useRef(showAgentId);
    const tickerCallbackRef = useRef<() => void>(() => {});
    const agentsRef = useRef<PIXI.Container | null>(null);
    const agentPathsRef = useRef<{ full: PIXI.Container, partial: PIXI.Container }>({
        full: new PIXI.Container(),
        partial: new PIXI.Container()
    });  // same order as agentsRef
    const tracePathsRef = useRef(tracePaths);
    const goalMarkersRef = useRef<PIXI.Container>(new PIXI.Container());

    // Scale a position from grid units to pixels
    const scalePosition = (position: number) : number => {
        return position * GRID_UNIT_TO_PX + GRID_UNIT_TO_PX / 2;
    }

    function resetTimestep() {
        timestepRef.current = 0.0;
    }

    function takeScreenshot() {
        if (app && viewport && grid) {
            app.renderer.extract.base64(viewport).then((data) => {
                const link = document.createElement('a');
                link.download = 'screenshot.png';
                link.href = data;
                link.click();
                link.remove();
            });
        }
    }

    useImperativeHandle(ref, () => ({
        skipBackward: () => {
            timestepRef.current = Math.max(0, timestepRef.current - stepSizeRef.current);
        },
        skipForward: () => {
            if (solution) {
                timestepRef.current = Math.min(timestepRef.current + stepSizeRef.current, solution.length - 1);
            }
        },
        restart: () => {
            resetTimestep();
        },
        fit: () => {
            fit();
        },
        takeScreenshot: () => {
            takeScreenshot();
        }
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

    const moveAndRotateSprites = useCallback((agents: PIXI.Container[], currentTime: number) => {
        if (solution === null) return;

        const currentTimestep = Math.floor(currentTime);
        const interpolationProgress = currentTime - currentTimestep;
        const currentState = solution[currentTimestep];
        const nextState = solution[Math.min(currentTimestep + 1, solution.length - 1)];

        // Interpolate between current and next states
        agents.forEach((agent, index) => {
            // Show or hide agent ID
            const idText = agent.children[1];
            if (idText !== undefined) {
                idText.visible = showAgentIdRef.current;
            }

            const startPose = currentState[index];
            const endPose = nextState[index];

            // Interpolate position
            agent.x =
                startPose.position.x +
                (endPose.position.x - startPose.position.x) * interpolationProgress;
            agent.y = 
                startPose.position.y +
                (endPose.position.y - startPose.position.y) * interpolationProgress;
            agent.x = scalePosition(agent.x);
            agent.y = scalePosition(agent.y);

            // orientation-aware visualization has two objects for each sprite
            const circleContainer: PIXI.Container = agent.children[0];
            if (circleContainer === undefined || circleContainer.children.length < 2) return;

            // Interpolate rotation
            const startRotation = orientationToRotation(startPose.orientation);
            const endRotation = orientationToRotation(endPose.orientation);

            circleContainer.rotation =
                startRotation +
                (endRotation - startRotation) * interpolationProgress;
        }); 
    }, [solution]);

    const updatePaths = useCallback((agents: PIXI.Container[], currentTime: number) => {
        if (solution === null) return;

        agentPathsRef.current.full.visible = tracePathsRef.current;
        agentPathsRef.current.partial.visible = tracePathsRef.current;

        const currentTimestep = Math.floor(currentTime);
        const interpolationProgress = currentTime - currentTimestep;

        
        agents.forEach((_agent, index) => {
            const agentLineStyle = { 
                width: GRID_UNIT_TO_PX / 10, 
                color: AGENT_COLORS[index % AGENT_COLORS.length], 
                cap: "round" as const
            };

            const full_segments = agentPathsRef.current.full.children[index] as PIXI.Container
            const partial_segments = agentPathsRef.current.partial.children[index] as PIXI.Container


            while(full_segments.children.length > currentTimestep) {
                if (full_segments.children.length === 0) break;
                full_segments.removeChildAt(full_segments.children.length - 1);
            }
            partial_segments.removeChildren();

            // Full segments
            while (full_segments.children.length < currentTimestep) {
                const segIndex = full_segments.children.length;
                const segment = full_segments.addChild(new PIXI.Graphics());
                segment.moveTo(
                    scalePosition(solution[segIndex][index].position.x),
                    scalePosition(solution[segIndex][index].position.y)
                );
                segment.lineTo(
                    scalePosition(solution[segIndex + 1][index].position.x),
                    scalePosition(solution[segIndex + 1][index].position.y)
                );
                segment.stroke(agentLineStyle);
            }

            // Partial segment
            if (interpolationProgress > 0 && currentTimestep < solution.length - 1) {
                const segment = partial_segments.addChild(new PIXI.Graphics());
            //     const segment = path.children.length === currentTimestep ? path.addChild(new PIXI.Graphics()) : path.children[currentTimestep] as PIXI.Graphics;
                segment.moveTo(
                    scalePosition(solution[currentTimestep][index].position.x),
                    scalePosition(solution[currentTimestep][index].position.y)
                );
                const interpolatedPosition = {
                    x: solution[currentTimestep][index].position.x +
                        (solution[currentTimestep + 1][index].position.x - solution[currentTimestep][index].position.x) * interpolationProgress,
                    y: solution[currentTimestep][index].position.y +
                        (solution[currentTimestep + 1][index].position.y - solution[currentTimestep][index].position.y) * interpolationProgress,
                }
                segment.lineTo(scalePosition(interpolatedPosition.x), scalePosition(interpolatedPosition.y));
                segment.stroke(agentLineStyle);
            }
        });
    }, [solution]);

    // Animate the solution
    const animateSolution = useCallback(() => {
        if (app === null || viewport === null) return;
        if (tickerCallbackRef.current) {
            app.ticker.remove(tickerCallbackRef.current);
            if (agentsRef.current) viewport.removeChild(agentsRef.current);
            if (agentPathsRef.current) {
                agentPathsRef.current.full.removeChildren();
                agentPathsRef.current.partial.removeChildren();
            }
            if (timestepTextRef.current) timestepTextRef.current.text = "";
            if (goalMarkersRef.current) goalMarkersRef.current.removeChildren();
        }
        if (solution === null) return;
        resetTimestep();
    
        // Check if the solution is orientation-aware
        const orientationAware: boolean = solution[0][0].orientation !== Orientation.NONE;

        // Goal markers
        const goalMarkers = viewport.addChild(goalMarkersRef.current);
        goalMarkers.visible = showGoals;
        solution[solution.length - 1].forEach((pose, agentId) => {
            const marker = goalMarkers.addChild(new PIXI.Graphics());
            const width = GRID_UNIT_TO_PX / 4;
            marker.rect(
                scalePosition(pose.position.x) - width / 2,
                scalePosition(pose.position.y) - width / 2,
                width, width)
            .fill(AGENT_COLORS[agentId % AGENT_COLORS.length]);
        });

        // Paths
        viewport.addChild(agentPathsRef.current.full);
        viewport.addChild(agentPathsRef.current.partial);
        solution[0].forEach(() => {
            agentPathsRef.current.full.addChild(new PIXI.Container());
            agentPathsRef.current.partial.addChild(new PIXI.Container());
        });

        // Agents
        const agents = viewport.addChild(new PIXI.Container());
        agentsRef.current = agents;
        solution[0].forEach((_pose, agentId) => {
            // build agent
            const agent = agents.addChild(new PIXI.Container());
            const circleContainer = agent.addChild(new PIXI.Container());
            const circle = circleContainer.addChild(new PIXI.Graphics());
            const agentColor = AGENT_COLORS[agentId % AGENT_COLORS.length];
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
            const idText = agent.addChild(new PIXI.Text({
                text: `${agentId}`,
                style: {
                    fontFamily: 'Arial',
                    fontSize: circle.width / 2,
                    fill: TEXT_COLOR,
                }
            }));
            idText.style.fontSize *= FONT_SUPER_RESOLUTION_SCALE;
            idText.scale.set(1 / FONT_SUPER_RESOLUTION_SCALE, 1 / FONT_SUPER_RESOLUTION_SCALE);
            idText.x = -idText.width / 2;
            idText.y = -idText.height / 2;
        });
    
        const animate = () => {
            if(timestepTextRef.current) {
                timestepTextRef.current.text = `${timestepRef.current.toFixed(1)} / ${(solution.length - 1).toFixed(1)}`;
            }

            if (playAnimationRef.current === true) {
                if (timestepRef.current < solution.length - 1) {
                    const approximateFramerate = 60;
                    timestepRef.current += stepSizeRef.current / approximateFramerate;
                } else if (loopAnimationRef.current) {
                    resetTimestep();
                }
            }

            moveAndRotateSprites(agents.children as PIXI.Container[], timestepRef.current);
            updatePaths(agents.children as PIXI.Container[], timestepRef.current);
        }
        app.ticker.add(animate);
        tickerCallbackRef.current = animate;
    }, [app, viewport, solution, moveAndRotateSprites, updatePaths, showGoals]);

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
                    antialias: true,  // for smooooooth circles
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
                        fontFamily: "Courier New",
                        fontWeight: "bold",
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

    const drawGrid = useCallback(() => {
        if (viewport === null || graph === null) return null;
        const grid = viewport.addChild(new PIXI.Container());
    
        for (let x: number = 0; x < graph.width; x++) {
            for (let y: number = 0; y < graph.height; y++) {
                const cellContainer = grid.addChild(new PIXI.Container());
                const cellGraphic = cellContainer.addChild(new PIXI.Graphics());
                const cellX = x * GRID_UNIT_TO_PX;
                const cellY = y * GRID_UNIT_TO_PX;
                const strokeWidth = GRID_UNIT_TO_PX / 10;
                cellGraphic.rect(cellX, cellY, GRID_UNIT_TO_PX, GRID_UNIT_TO_PX)
                .stroke({color: GRID_COLOR, width: strokeWidth});
                if (graph.obstacles.has(new Coordinate(x, y).toString())) {
                    cellGraphic.fill({color: GRID_COLOR});
                }
                const idText = cellContainer.addChild(new PIXI.Text({
                    text: `${x + y * graph.width}`,
                    style: {
                        fontFamily: 'Arial',
                        fontSize: cellGraphic.width / 6,
                        fill: TEXT_COLOR,
                    }
                }));
                idText.style.fontSize *= FONT_SUPER_RESOLUTION_SCALE;
                idText.scale.set(1 / FONT_SUPER_RESOLUTION_SCALE, 1 / FONT_SUPER_RESOLUTION_SCALE);
                idText.x = cellX + strokeWidth;
                idText.y = cellY + strokeWidth;
                idText.visible = showCellId;
            }
        }
    
        viewport.worldHeight = grid.height * 1.1;
        viewport.worldWidth = grid.width * 1.1;
        return grid;
    }, [viewport, graph, showCellId]);

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
        if (app && viewport) {
            if (grid) viewport.removeChild(grid);
            if (graph) setGrid(drawGrid());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [app, graph, viewport]); // Excluding 'grid' to prevent infinite loop

    // Fit the viewport and try to animate the solution when the grid or solution changes
    useEffect(() => {
        fit();
        animateSolution();
        setCanScreenshot(!!solution);
    }, [grid, solution, animateSolution, fit, setCanScreenshot]);

    // Update the playAnimationRef when the playAnimation changes
    useEffect(() => {
        playAnimationRef.current = playAnimation;
        stepSizeRef.current = stepSize;
        loopAnimationRef.current = loopAnimation
    }, [playAnimation, stepSize, loopAnimation]);

    // Update the showAgentIdRef when the showAgentId changes
    useEffect(() => {
        showAgentIdRef.current = showAgentId;
    }, [showAgentId]);

    useEffect(() => {
        tracePathsRef.current = tracePaths;
    }, [tracePaths]);

    useEffect(() => {
        if (!grid) return;
        grid.children.forEach((cellContainer) => {
            const idText = cellContainer.children[1];
            if (idText) {
                idText.visible = showCellId;
            }
        });
    }, [showCellId, grid]);

    useEffect(() => {
        if (goalMarkersRef.current) goalMarkersRef.current.visible = showGoals;
    }, [showGoals]);

    return <canvas ref={canvasRef} />
});

export default PixiApp;