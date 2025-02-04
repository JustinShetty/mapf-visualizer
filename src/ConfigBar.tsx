import AnimationControl from './AnimationControl';
import { Graph } from './Graph';
import { parseSolution, Solution } from './Solution';
import { Divider, Stack, Button } from '@mui/material';
import { MuiFileInput } from "mui-file-input";
import React from 'react';

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
  tracePaths: boolean;
  onTracePathsChange: (tracePaths: boolean) => void;
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
  tracePaths,
  onTracePathsChange,
}: ConfigBarProps) {
  const repoName = "JustinShetty/mapf-visualizer";
  const [mapFile, setMapFile] = React.useState<File | null>(null);
  const [mapError, setMapError] = React.useState<string | null>(null);
  const [solutionFile, setSolutionFile] = React.useState<File | null>(null);
  const [solutionError, setSolutionError] = React.useState<string | null>(null);

  const blurActiveElement = () => {
    // Blur (remove focus from) the file input
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  const handleLoadDemo = (mapName: string) => {
    fetch(`${import.meta.env.BASE_URL}/${mapName}.map`)
      .then((response) => response.text())
      .then((text) => {
        handleMapChange(new File([text], `${mapName}.map`));
        return fetch(`${import.meta.env.BASE_URL}/demo_${mapName}.txt`);
      })
      .then((response) => response.text())
      .then((text) => {
        handleSolutionChange(new File([text], `demo_${mapName}.txt`));
      });
    blurActiveElement();
  };

  const handleMapChange = (newValue: File | null) => {
    setMapFile(newValue);
    if (newValue) {
      newValue.text().then((text) => {
        try {
          onGraphChange(new Graph(text));
          setMapError(null);
        } catch (e) {
          setMapError(e instanceof Error ? e.message : "An unexpected error occurred");
        }
        blurActiveElement();
      });
    }
  }

  const handleSolutionChange = (newValue: File | null) => {
    setSolutionFile(newValue);
    if (newValue) {
      newValue.text().then((text) => {
        try {
          onSolutionChange(parseSolution(text));
          setSolutionError(null);
        } catch (e) {
          setSolutionError(e instanceof Error ? e.message : "An unexpected error occurred");
        }
        blurActiveElement();
      });
    }
  }

  return (
    <Stack direction="column" spacing={2} sx={{padding: 2}} >
      <Stack direction="column" spacing={1}>
        <Button variant="outlined" onClick={() => handleLoadDemo("2x2")}>Load 2x2 demo</Button>
        <Button variant="outlined" onClick={() => handleLoadDemo("random-32-32-20")}>Load 32x32 demo</Button>
      </Stack>
      <Divider />
      <Stack direction="column" spacing={1}>
        <h1>Map</h1>
        <MuiFileInput 
            value={mapFile} 
            onChange={handleMapChange} 
            placeholder="Select a map file"
            sx={{width: '100%'}}
        />
        {mapError && <p style={{color: 'red'}}>{mapError}</p>}
      </Stack>
      <Divider />
      <Stack direction="column" spacing={2}>
          <h1>Solution</h1>
          <MuiFileInput 
              value={solutionFile} 
              onChange={handleSolutionChange} 
              placeholder="Select a solution file"
              sx={{width: '100%'}}
          />
          {solutionError && <p style={{color: 'red'}}>{solutionError}</p>}
      </Stack>
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
        tracePaths={tracePaths}
        onTracePathsChange={onTracePathsChange}
      />
      <Divider />
      <a target="_blank" href={`https://github.com/${repoName}`} style={{ color: 'white' }}>
        {repoName}
      </a>
    </Stack>
  );
}

export default ConfigBar;