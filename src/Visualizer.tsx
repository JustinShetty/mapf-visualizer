import Box from '@mui/material/Box';
import { Solution } from './Solution';
import { Graph } from './Graph';
import PixiApp from './PixiApp';
import { useState, useRef, useEffect } from 'react';

interface VisualizerProps {
  graph: Graph | null;
  solution: Solution | null;
}

function Visualizer({ graph, solution }: VisualizerProps) {
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
          width={viewportSize.width} 
          height={viewportSize.height}
          graph={graph}
          solution={solution}
        />
      }
      </div>
    </Box>
);
}

export default Visualizer;