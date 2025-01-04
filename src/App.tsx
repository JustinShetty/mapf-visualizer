import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import ConfigBar from './ConfigBar';
import Visualizer from './Visualizer';
import { Graph } from './Graph';
import { Solution } from './Solution';
import React from 'react';
import { StrictMode, useRef } from 'react';

function App() {
  const pixiAppRef = useRef<{ skipBackward?: () => void; skipForward?: () => void }>(null);

  const [graph, setGraph] = React.useState<Graph | null>(null);
  const [solution, setSolution] = React.useState<Solution | null>(null);
  const [playAnimation, setPlayAnimation] = React.useState<boolean>(true);

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

  return (
    <StrictMode>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size="grow">
          <Visualizer
            pixiAppRef = {pixiAppRef}
            graph={graph} 
            solution={solution} 
            playAnimation={playAnimation}
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
          />
        </Grid>
      </Grid>
    </Box>
    </StrictMode>
  );
}

export default App;