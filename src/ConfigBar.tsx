import GraphLoader from './GraphLoader';
import SolutionLoader from './SolutionLoader';
import AnimationControl from './AnimationControl';
import { Graph } from './Graph';
import { parseSolution, Solution } from './Solution';
import { Divider, Stack, Button } from '@mui/material';

interface ConfigBarProps {
  onGraphChange: (graph: Graph) => void;
  onSolutionChange: (solution: Solution) => void;
  playAnimation: boolean;
  onPlayAnimationChange: (playAnimation: boolean) => void;
  onSkipBackward: () => void;
  onSkipForward: () => void;
  onRestart: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  loopAnimation: boolean,
  onLoopAnimationChange: (loopAnimation: boolean) => void;
  onFitView: () => void;
  showAgentId: boolean;
  onShowAgentIdChange: (showAgentId: boolean) => void;
}

function ConfigBar({ 
  onGraphChange, 
  onSolutionChange, 
  playAnimation,
  onPlayAnimationChange,
  onSkipBackward,
  onSkipForward,
  onRestart,
  speed,
  onSpeedChange,
  loopAnimation,
  onLoopAnimationChange,
  onFitView,
  showAgentId,
  onShowAgentIdChange,
}: ConfigBarProps) {
  const repoName = "JustinShetty/mapf-visualizer";

  const blurActiveElement = () => {
    // Blur (remove focus from) the file input
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  const handleLoadDemo = (mapName: string) => {
    console.log(`Loading demo ${mapName}`);
    fetch(`${import.meta.env.BASE_URL}/${mapName}.map`)
      .then((response) => response.text())
      .then((text) => {
        onGraphChange(new Graph(text));
        return fetch(`${import.meta.env.BASE_URL}/demo_${mapName}.txt`);
      })
      .then((response) => response.text())
      .then((text) => {
        onSolutionChange(parseSolution(text));
      });
    blurActiveElement();
  };

  return (
    <Stack direction="column" spacing={2} sx={{padding: 2}} >
      <Stack direction="column" spacing={1}>
        <Button variant="outlined" onClick={() => handleLoadDemo("2x2")}>Load 2x2 demo</Button>
        <Button variant="outlined" onClick={() => handleLoadDemo("random-32-32-20")}>Load 32x32 demo</Button>
      </Stack>
      <Divider />
      <GraphLoader onGraphChange={onGraphChange}/>
      <Divider />
      <SolutionLoader onSolutionChange={onSolutionChange}/>
      <Divider />
      <AnimationControl 
        playAnimation={playAnimation}
        onPlayAnimationChange={onPlayAnimationChange}
        onSkipBackward={onSkipBackward}
        onSkipForward={onSkipForward}
        onRestart={onRestart}
        speed={speed}
        onSpeedChange={onSpeedChange}
        loopAnimation={loopAnimation}
        onLoopAnimationChange={onLoopAnimationChange}
        onFitView={onFitView}
        showAgentId={showAgentId}
        onShowAgentIdChange={onShowAgentIdChange}
      />
      <Divider />
      <a target="_blank" href={`https://github.com/${repoName}`} style={{ color: 'white' }}>
        {repoName}
      </a>
    </Stack>
  );
}

export default ConfigBar;