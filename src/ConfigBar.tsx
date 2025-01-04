import Stack from '@mui/material/Stack';
import GraphLoader from './GraphLoader';
import SolutionLoader from './SolutionLoader';
import AnimationControl from './AnimationControl';
import { Graph } from './Graph';
import { Solution } from './Solution';
import { Divider } from '@mui/material';

interface ConfigBarProps {
  onGraphChange: (graph: Graph) => void;
  onSolutionChange: (solution: Solution) => void;
  playAnimation: boolean;
  onPlayAnimationChange: (playAnimation: boolean) => void;
  onSkipBackward: () => void;
  onSkipForward: () => void;
  onRestart: () => void;
}

function ConfigBar({ 
  onGraphChange, 
  onSolutionChange, 
  playAnimation,
  onPlayAnimationChange,
  onSkipBackward,
  onSkipForward,
  onRestart,
}: ConfigBarProps) {
  const repoName = "JustinShetty/mapf-visualizer";
  return (
    <Stack direction="column" spacing={2}>
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
      />
      <Divider />
      <a target="_blank" href={`https://github.com/${repoName}`} style={{ color: 'white' }}>
        {repoName}
      </a>
    </Stack>
  );
}

export default ConfigBar;