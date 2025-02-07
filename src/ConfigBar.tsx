import AnimationControl from './AnimationControl';
import { Graph } from './Graph';
import { parseSolution, Solution } from './Solution';
import { Divider, Stack, Button } from '@mui/material';
import { MuiFileInput } from "mui-file-input";
import React, { useEffect } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Tooltip from '@mui/material/Tooltip';

interface ConfigBarProps {
  graph: Graph | null;
  onGraphChange: (graph: Graph | null) => void;
  onSolutionChange: (solution: Solution | null) => void;
  playAnimation: boolean;
  onPlayAnimationChange: (playAnimation: boolean) => void;
  onSkipBackward: () => void;
  onSkipForward: () => void;
  onRestart: () => void;
  stepSize: number;
  onStepSizeChange: (speed: number) => void;
  loopAnimation: boolean,
  onLoopAnimationChange: (loopAnimation: boolean) => void;
  onFitView: () => void;
  showAgentId: boolean;
  onShowAgentIdChange: (showAgentId: boolean) => void;
  tracePaths: boolean;
  onTracePathsChange: (tracePaths: boolean) => void;
  canScreenshot: boolean;
  takeScreenshot: () => void;
  showCellId: boolean;
  setShowCellId: (showCellId: boolean) => void;
}

function ConfigBar({
  graph,
  onGraphChange,
  onSolutionChange, 
  playAnimation,
  onPlayAnimationChange,
  onSkipBackward,
  onSkipForward,
  onRestart,
  stepSize,
  onStepSizeChange,
  loopAnimation,
  onLoopAnimationChange,
  onFitView,
  showAgentId,
  onShowAgentIdChange,
  tracePaths,
  onTracePathsChange,
  canScreenshot,
  takeScreenshot,
  showCellId,
  setShowCellId,
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
  };

  useEffect(() => {
    if (mapFile === null) {
      onGraphChange(null);
      return;
    }
    mapFile.text().then((text) => {
      try {
        onGraphChange(new Graph(text));
        setMapError(null);
      } catch (e) {
        setMapFile(null);
        onGraphChange(null);
        setMapError(e instanceof Error ? e.message : "An unexpected error occurred");
      }
    });
  }, [mapFile, onGraphChange]);

  useEffect(() => {
    if (solutionFile === null) {
      onSolutionChange(null);
      return
    }
    solutionFile.text().then((text) => {
      try {
        if (graph === null) throw new Error("Map must be loaded before solution");
        const soln = parseSolution(text);
        soln.forEach((config) => {
          config.forEach((pose) => {
            if (pose.position.x > graph.width || pose.position.y > graph.height) {
              throw new Error(`Invalid solution: position ${pose.position} is out of bounds`);
            }
          });
        });
        onSolutionChange(soln);
        setSolutionError(null);
      } catch (e) {
        setSolutionFile(null);
        setSolutionError(e instanceof Error ? e.message : "An unexpected error occurred");
      }
    });
  }, [graph, solutionFile, onSolutionChange]);

  const handleMapChange = (newValue: File | null) => {
    setMapFile(newValue);
    setSolutionFile(null);
    blurActiveElement();
  };

  const handleSolutionChange = (newValue: File | null) => {
    setSolutionFile(newValue);
    blurActiveElement();
  };

  const downloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        <Stack direction="row" spacing={1}>
          <MuiFileInput
              value={mapFile}
              onChange={handleMapChange}
              placeholder="Select a map file"
              sx={{width: '100%'}}
              clearIconButtonProps={{
                title: "Clear",
                children: <ClearIcon fontSize="small" />
              }}
          />
          {mapFile &&
            <Tooltip title={`Download ${mapFile?.name}`}>
              <Button onClick={() => {downloadFile(mapFile as File)}}>
                <FileDownloadOutlinedIcon />
              </Button>
            </Tooltip>
          }
        </Stack>
        {mapError && <p style={{color: 'red'}}>{mapError}</p>}
      </Stack>
      <Divider />
      <Stack direction="column" spacing={2}>
          <h1>Solution</h1>
          <Stack direction="row" spacing={1}>
            <MuiFileInput
                value={solutionFile}
                onChange={handleSolutionChange}
                placeholder="Select a solution file"
                sx={{width: '100%'}}
                clearIconButtonProps={{
                  title: "Clear",
                  children: <ClearIcon fontSize="small" />
                }}
            />
            {solutionFile &&
              <Tooltip title={`Download ${solutionFile?.name}`}>
                <Button onClick={() => {downloadFile(solutionFile as File)}}>
                  <FileDownloadOutlinedIcon />
                </Button>
              </Tooltip>
            }
          </Stack>
          {solutionError && <p style={{color: 'red'}}>{solutionError}</p>}
      </Stack>
      <Divider />
      <AnimationControl 
        playAnimation={playAnimation}
        onPlayAnimationChange={onPlayAnimationChange}
        onSkipBackward={onSkipBackward}
        onSkipForward={onSkipForward}
        onRestart={onRestart}
        stepSize={stepSize}
        onStepSizeChange={onStepSizeChange}
        loopAnimation={loopAnimation}
        onLoopAnimationChange={onLoopAnimationChange}
        onFitView={onFitView}
        showAgentId={showAgentId}
        onShowAgentIdChange={onShowAgentIdChange}
        tracePaths={tracePaths}
        onTracePathsChange={onTracePathsChange}
        canScreenshot={canScreenshot}
        takeScreenshot={takeScreenshot}
        showCellId={showCellId}
        setShowCellId={setShowCellId}
      />
      <Divider />
      <a target="_blank" href={`https://github.com/${repoName}`} style={{ color: 'white', width: 'fit-content' }}>
        {repoName}
      </a>
    </Stack>
  );
}

export default ConfigBar;