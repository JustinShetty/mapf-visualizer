import Box from '@mui/material/Box';
import { Solution } from './Solution';
import { Graph } from './Graph';
import PixiApp from './PixiApp';
import { useState, useRef, useEffect } from 'react';

interface VisualizerProps {
  graph: Graph | null;
  solution: Solution | null;
  playAnimation: boolean;
  pixiAppRef: React.MutableRefObject<{ skipBackward?: () => void; skipForward?: () => void; restart?: () => void; } | null>;
  stepSize: number;
  loopAnimation: boolean;
  showAgentId: boolean;
  tracePaths: boolean;
  setCanScreenshot: (canScreenshot: boolean) => void;
  showCellId: boolean;
  showGoals: boolean;
  showGoalVectors: boolean;
}

function Visualizer({
  graph, 
  solution, 
  playAnimation, 
  pixiAppRef,
  stepSize,
  loopAnimation,
  showAgentId,
  tracePaths,
  setCanScreenshot,
  showCellId,
  showGoals,
  showGoalVectors,
}: VisualizerProps) {
  const [viewportSize, setViewportSize] = useState<{ width: number; height: number } | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (boxRef.current && canvasRef.current) {
        setViewportSize({ 
          width: boxRef.current.clientWidth, 
          height: window.innerHeight - canvasRef.current.getBoundingClientRect().top 
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Box width="100%" height="100%" ref={boxRef}>
      <div ref={canvasRef}>
      {viewportSize !== null && 
        <PixiApp 
          ref={pixiAppRef}
          width={viewportSize.width} 
          height={viewportSize.height}
          graph={graph}
          solution={solution}
          playAnimation={playAnimation}
          stepSize={stepSize}
          loopAnimation={loopAnimation}
          showAgentId={showAgentId}
          tracePaths={tracePaths}
          setCanScreenshot={setCanScreenshot}
          showCellId={showCellId}
          showGoals={showGoals}
          showGoalVectors={showGoalVectors}
        />
      }
      </div>
    </Box>
);
}

export default Visualizer;