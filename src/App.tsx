import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import ConfigBar from './ConfigBar';
import Visualizer from './Visualizer';
import { Graph } from './Graph';
import { Solution } from './Solution';
import React, { useCallback } from 'react';
import { StrictMode, useRef } from 'react';

function App() {
  const pixiAppRef = useRef<{
    skipBackward?: () => void;
    skipForward?: () => void;
    restart?: () => void;
    fit?: () => void;
    takeScreenshot?: () => void;
  }>(null);

  const [graph, setGraph] = React.useState<Graph | null>(null);
  const [solution, setSolution] = React.useState<Solution | null>(null);
  const [playAnimation, setPlayAnimation] = React.useState<boolean>(true);
  const [stepSize, setStepSize] = React.useState<number>(1.0);
  const [loopAnimation, setLoopAnimation] = React.useState<boolean>(true);
  const [showAgentId, setShowAgentId] = React.useState<boolean>(false);
  const [tracePaths, setTracePaths] = React.useState<boolean>(true);
  const [canScreenshot, setCanScreenshot] = React.useState<boolean>(true);
  const [showCellId, setShowCellId] = React.useState<boolean>(false);
  const [showGoals, setShowGoals] = React.useState<boolean>(true);
  const [showGoalVectors, setShowGoalVectors] = React.useState<boolean>(false);

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

  const handleTakeScreenshot = () => {
    if (pixiAppRef.current?.takeScreenshot) {
      pixiAppRef.current.takeScreenshot();
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
            stepSize={stepSize}
            loopAnimation={loopAnimation}
            showAgentId={showAgentId}
            tracePaths={tracePaths}
            setCanScreenshot={setCanScreenshot}
            showCellId={showCellId}
            showGoals={showGoals}
            showGoalVectors={showGoalVectors}
          />
        </Grid>
        <Grid size={4}>
          <ConfigBar
            graph={graph}
            onGraphChange={useCallback((graph: Graph | null) => setGraph(graph), [])}
            onSolutionChange={useCallback((solution: Solution | null) => setSolution(solution), [])}
            playAnimation={playAnimation}
            onPlayAnimationChange={setPlayAnimation}
            onSkipBackward={handleSkipBackward}
            onSkipForward={handleSkipForward}
            onRestart={handleRestart}
            stepSize={stepSize}
            onStepSizeChange={setStepSize}
            loopAnimation={loopAnimation}
            onLoopAnimationChange={setLoopAnimation}
            onFitView={handleFitView}
            showAgentId={showAgentId}
            onShowAgentIdChange={setShowAgentId}
            tracePaths={tracePaths}
            onTracePathsChange={setTracePaths}
            canScreenshot={canScreenshot}
            takeScreenshot={handleTakeScreenshot}
            showCellId={showCellId}
            setShowCellId={setShowCellId}
            showGoals={showGoals}
            setShowGoals={setShowGoals}
            showGoalVectors={showGoalVectors}
            setShowGoalVectors={setShowGoalVectors}
          />
        </Grid>
      </Grid>
    </Box>
    </StrictMode>
  );
}

export default App;
