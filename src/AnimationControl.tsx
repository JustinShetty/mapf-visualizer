import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseTwoToneIcon from '@mui/icons-material/PauseTwoTone';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Slider from '@mui/material/Slider';
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOnIcon from '@mui/icons-material/RepeatOn';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksOneOutlinedIcon from '@mui/icons-material/LooksOneOutlined';
import { useEffect } from 'react';
import DirectionsIcon from '@mui/icons-material/Directions';
import DirectionsOutlinedIcon from '@mui/icons-material/DirectionsOutlined';
import FilterCenterFocusOutlinedIcon from '@mui/icons-material/FilterCenterFocusOutlined';
import ScreenshotMonitorOutlinedIcon from '@mui/icons-material/ScreenshotMonitorOutlined';
import StartIcon from '@mui/icons-material/Start';

const STEP_SIZE_INCREMENT = 0.2;
const STEP_SIZE_MAX = 10;
const STEP_SIZE_MIN = 0.2;

const STEP_BACKWARD_KEY = 'ArrowLeft';
const PLAY_PAUSE_KEY = ' ';
const STEP_FORWARD_KEY = 'ArrowRight';
const RESTART_KEY = 'r';
const LOOP_KEY = 'l';
const FIT_VIEW_KEY = 'f';
const SHOW_AGENT_ID_KEY = 'a';
const STEP_SIZE_UP_KEY = 'ArrowUp';
const STEP_SIZE_DOWN_KEY = 'ArrowDown';
const TRACE_PATHS_KEY = 't';
const SCREENSHOT_KEY = 's';

interface AnimationControlProps {
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
}

function AnimationControl({
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
}: AnimationControlProps) {  
    const handleSliderChange = (event: Event, value: number | number[]) => {
        event.preventDefault();
        if (typeof value === 'number') {
            onStepSizeChange(value);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!event.ctrlKey && !event.altKey && !event.metaKey) {
                event.preventDefault();
            }

            if (event.key === STEP_BACKWARD_KEY) {
                onSkipBackward();
            } else if (event.key === PLAY_PAUSE_KEY) {
                onPlayAnimationChange(!playAnimation);
            }  else if (event.key === STEP_FORWARD_KEY) {
                onSkipForward();
            } else if (event.key === RESTART_KEY) {
                onRestart();
            } else if (event.key === LOOP_KEY) {
                onLoopAnimationChange(!loopAnimation);
            } else if (event.key === FIT_VIEW_KEY) {
                onFitView();
            } else if (event.key === SHOW_AGENT_ID_KEY) {
                onShowAgentIdChange(!showAgentId);
            } else if (event.key === STEP_SIZE_UP_KEY && stepSize + STEP_SIZE_INCREMENT <= STEP_SIZE_MAX) {
                onStepSizeChange(stepSize + STEP_SIZE_INCREMENT);
            } else if (event.key === STEP_SIZE_DOWN_KEY && stepSize - STEP_SIZE_INCREMENT >= STEP_SIZE_MIN) {
                onStepSizeChange(stepSize - STEP_SIZE_INCREMENT);
            } else if (event.key === TRACE_PATHS_KEY) {
                onTracePathsChange(!tracePaths);
            } else if (event.key === SCREENSHOT_KEY) {
                takeScreenshot();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [playAnimation, onPlayAnimationChange, loopAnimation, onFitView, 
        onLoopAnimationChange, onRestart, onShowAgentIdChange, onSkipBackward, 
        onSkipForward, onStepSizeChange, showAgentId, stepSize, onTracePathsChange, tracePaths, 
        takeScreenshot]);

    return (
        <Stack direction="column" spacing={2}>
            <Box display="flex" justifyContent="center">
                <ButtonGroup size="large" variant="outlined">
                    <Tooltip title={`Backward one step (${STEP_BACKWARD_KEY})`}>
                        <Button onClick={onSkipBackward}>
                            <SkipPreviousIcon />
                        </Button>   
                    </Tooltip>    
                    <Tooltip title={(playAnimation ? "Pause" : "Play") + ` (spacebar)`}>     
                        <Button onClick={() => onPlayAnimationChange(!playAnimation)}>
                            {playAnimation ? 
                            <PauseTwoToneIcon /> : 
                            <PlayArrowIcon />}
                        </Button>
                    </Tooltip>
                    <Tooltip title={`Forward one step (${STEP_FORWARD_KEY})`}>
                        <Button onClick={onSkipForward}>
                            <SkipNextIcon />
                        </Button>
                    </Tooltip>
                </ButtonGroup>
            </Box>
            <Box display="flex" justifyContent="center">
                <ButtonGroup size="large" variant="outlined">
                    <Tooltip title={`Restart animation (${RESTART_KEY})`}>
                        <Button onClick={onRestart}>
                            <StartIcon />
                        </Button>
                    </Tooltip>
                    <Tooltip title={(loopAnimation ? "Disable loop" : "Enable loop") + ` (${LOOP_KEY})`}>
                        <Button onClick={() => onLoopAnimationChange(!loopAnimation)}>
                            {loopAnimation ? 
                            <RepeatOnIcon /> : 
                            <RepeatIcon />}
                        </Button>
                    </Tooltip>
                </ButtonGroup>
            </Box>
            <Box display="flex" justifyContent="center">
                <ButtonGroup size="large" variant="outlined">
                    <Tooltip title={`Reset view (${FIT_VIEW_KEY})`}>
                        <Button onClick={onFitView}>
                            <FilterCenterFocusOutlinedIcon />
                        </Button>
                    </Tooltip>
                    <Tooltip title={(showAgentId ? "Hide agent ID" : "Show agent ID") + ` (${SHOW_AGENT_ID_KEY})`}>
                        <Button onClick={() => onShowAgentIdChange(!showAgentId)}>
                            {showAgentId ?
                            <LooksOneIcon />:
                            <LooksOneOutlinedIcon />}
                        </Button>
                    </Tooltip>
                    <Tooltip title={(tracePaths ? "Hide paths" : "Show paths") + ` (${TRACE_PATHS_KEY})`}>
                        <Button onClick={() => onTracePathsChange(!tracePaths)}>
                            {tracePaths ?
                            <DirectionsIcon />:
                            <DirectionsOutlinedIcon />}
                        </Button>
                    </Tooltip>
                    <Tooltip title={"Take screenshot" + ` (${SCREENSHOT_KEY})`}>
                        <span>
                            <Button disabled={!canScreenshot} onClick={takeScreenshot}>
                                <ScreenshotMonitorOutlinedIcon />
                            </Button>
                        </span>
                    </Tooltip>
                </ButtonGroup>
            </Box>
            <Stack direction="row" spacing={2} justifyContent="center">
                <Tooltip 
                    title={
                        <div style={{ textAlign: 'center' }}>
                            Adjust animation step size
                            ({STEP_SIZE_UP_KEY}/{STEP_SIZE_DOWN_KEY})
                        </div>
                    }
                >
                    <Slider
                        value={stepSize}
                        step={STEP_SIZE_INCREMENT}
                        marks
                        min={STEP_SIZE_MIN}
                        max={STEP_SIZE_MAX}
                        valueLabelDisplay="auto"
                        onChange={handleSliderChange}
                        sx={{ width: '50%', height: "auto"}}
                    />
                </Tooltip>
                <Tooltip title="Reset speed">
                    <Button onClick={() => onStepSizeChange(1)}>
                        <RestartAltIcon />
                    </Button>
                </Tooltip>
            </Stack>
        </Stack>
    );   
}

export default AnimationControl;
