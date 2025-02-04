import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import ConfigBar from './ConfigBar';
import Visualizer from './Visualizer';
import { Graph } from './Graph';
import { Solution } from './Solution';
import React from 'react';
import { StrictMode, useRef } from 'react';

function App() {
  const pixiAppRef = useRef<{ 
    skipBackward?: () => void; 
    skipForward?: () => void; 
    restart?: () => void; 
    fit?: () => void;
  }>(null);

  const [graph, setGraph] = React.useState<Graph | null>(null);
  const [solution, setSolution] = React.useState<Solution | null>(null);
  const [playAnimation, setPlayAnimation] = React.useState<boolean>(true);
  const [speed, setSpeed] = React.useState<number>(1.0);
  const [loopAnimation, setLoopAnimation] = React.useState<boolean>(true);
  const [showAgentId, setShowAgentId] = React.useState<boolean>(false);
  const [tracePaths, setTracePaths] = React.useState<boolean>(true);

  const handleSkipBackward = () => {
    if (pixiAppRef.current?.skipBackward) {
      pixiAppRef.current.skipBackward();
    }
  }

  const handleSkipForward = () => {
    if (pixiAppRef.current?.skipForward) {
      pixiAppRef.current.skipForward();
    }
  }

  const handleRestart = () => {
    if (pixiAppRef.current?.restart) {
      pixiAppRef.current.restart();
    }
  }

  const handleFitView = () => {
    if (pixiAppRef.current?.fit) {
      pixiAppRef.current.fit();
    }
  }

  return (
    <StrictMode>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={0}>
        <Grid size="grow">
          <Visualizer
            pixiAppRef = {pixiAppRef}
            graph={graph} 
            solution={solution} 
            playAnimation={playAnimation}
            speed={speed}
            loopAnimation={loopAnimation}
            showAgentId={showAgentId}
            tracePaths={tracePaths}
          />
        </Grid>
        <Grid size={4}>
          <ConfigBar
            onGraphChange={(graph: Graph) => setGraph(graph)}
            onSolutionChange={(solution: Solution) => setSolution(solution)}
            playAnimation={playAnimation}
            onPlayAnimationChange={(playAnimation: boolean) => setPlayAnimation(playAnimation)}
            onSkipBackward={handleSkipBackward}
            onSkipForward={handleSkipForward}
            onRestart={handleRestart}
            speed={speed}
            onSpeedChange={(speed: number) => setSpeed(speed)}
            loopAnimation={loopAnimation}
            onLoopAnimationChange={(loopAnimation: boolean) => setLoopAnimation(loopAnimation)}
            onFitView={handleFitView}
            showAgentId={showAgentId}
            onShowAgentIdChange={(showAgentId: boolean) => setShowAgentId(showAgentId)}
            tracePaths={tracePaths}
            onTracePathsChange={(tracePaths: boolean) => setTracePaths(tracePaths)}
          />
        </Grid>
      </Grid>
    </Box>
    </StrictMode>
  );
}

export default App;
