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
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import FlagIcon from '@mui/icons-material/Flag';
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';
import PolylineIcon from '@mui/icons-material/Polyline';
import PolylineOutlinedIcon from '@mui/icons-material/PolylineOutlined';

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
const TRACE_PATHS_KEY = 'p';
const SCREENSHOT_KEY = 's';
const SHOW_CELL_ID_KEY = 'c';
const SHOW_GOALS_KEY = 'g';
const SHOW_GOAL_VECTORS_KEY = 'v';

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
    showCellId: boolean;
    setShowCellId: (showCellId: boolean) => void;
    showGoals: boolean;
    setShowGoals: (showGoals: boolean) => void;
    showGoalVectors: boolean;
    setShowGoalVectors: (showGoalVectors: boolean) => void;
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
    showCellId,
    setShowCellId,
    showGoals,
    setShowGoals,
    showGoalVectors,
    setShowGoalVectors,
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
            } else if (event.key === SHOW_CELL_ID_KEY) {
                setShowCellId(!showCellId);
            } else if (event.key === SHOW_GOALS_KEY) {
                setShowGoals(!showGoals);
            } else if (event.key === SHOW_GOAL_VECTORS_KEY) {
                setShowGoalVectors(!showGoalVectors);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [playAnimation, onPlayAnimationChange, loopAnimation, onFitView, 
        onLoopAnimationChange, onRestart, onShowAgentIdChange, onSkipBackward, 
        onSkipForward, onStepSizeChange, showAgentId, stepSize, onTracePathsChange, tracePaths, 
        takeScreenshot, showCellId, setShowCellId, showGoals, setShowGoals, showGoalVectors, 
        setShowGoalVectors]);

    return (
        <Stack direction="column" spacing={1}>
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
                        value={Number(stepSize.toFixed(1))}
                        step={STEP_SIZE_INCREMENT}
                        marks
                        min={STEP_SIZE_MIN}
                        max={STEP_SIZE_MAX}
                        valueLabelDisplay="auto"
                        onChange={handleSliderChange}
                        sx={{ width: '40%', height: "auto"}}
                    />
                </Tooltip>
                <Tooltip title="Reset step size">
                    <Button onClick={() => onStepSizeChange(1)}>
                        <RestartAltIcon />
                    </Button>
                </Tooltip>
            </Stack>
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
                    <Tooltip title={`Reset view (${FIT_VIEW_KEY})`}>
                        <Button onClick={onFitView}>
                            <FilterCenterFocusOutlinedIcon />
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
            <Box display="flex" justifyContent="center">
                <ButtonGroup size="large" variant="outlined">
                    <Tooltip title={(showAgentId ? "Hide agent ID" : "Show agent ID") + ` (${SHOW_AGENT_ID_KEY})`}>
                        <Button onClick={() => onShowAgentIdChange(!showAgentId)}>
                            {showAgentId ?
                            <SmartToyIcon />:
                            <SmartToyOutlinedIcon />}
                        </Button>
                    </Tooltip>
                    <Tooltip title={(showCellId ? "Hide cell ID" : "Show cell ID") + ` (${SHOW_CELL_ID_KEY})`}>
                        <Button onClick={() => setShowCellId(!showCellId)}>
                            {showCellId ?
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
                    <Tooltip title={(showGoals ? "Hide goals" : "Show goals") + ` (${SHOW_GOALS_KEY})`}>
                        <Button onClick={() => setShowGoals(!showGoals)}>
                            {showGoals ?
                            <FlagIcon />:
                            <OutlinedFlagIcon />}
                        </Button>
                    </Tooltip>
                    <Tooltip title={(showGoalVectors ? "Hide goal vectors" : "Show goal vectors") + ` (${SHOW_GOAL_VECTORS_KEY})`}>
                        <Button onClick={() => setShowGoalVectors(!showGoalVectors)}>
                            {showGoalVectors ?
                            <PolylineIcon />:
                            <PolylineOutlinedIcon />}
                        </Button>
                    </Tooltip>
                </ButtonGroup>
            </Box>
        </Stack>
    );   
}

export default AnimationControl;
