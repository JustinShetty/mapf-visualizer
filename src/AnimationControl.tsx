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

const SPEED_STEP = 0.2;
const SPEED_MAX = 10;
const SPEED_MIN = 0.2;

const STEP_BACKWARD_KEY = 'ArrowLeft';
const PLAY_PAUSE_KEY = ' ';
const STEP_FORWARD_KEY = 'ArrowRight';
const RESTART_KEY = 'r';
const LOOP_KEY = 'l';
const FIT_VIEW_KEY = 'f';
const SHOW_AGENT_ID_KEY = 'a';
const SPEED_UP_KEY = 'ArrowUp';
const SPEED_DOWN_KEY = 'ArrowDown';
const TRACE_PATHS_KEY = 't';
const SCREENSHOT_KEY = 's';

interface AnimationControlProps {
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
    canScreenshot: boolean;
    takeScreenshot: () => void;
}

function AnimationControl({
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
    canScreenshot,
    takeScreenshot,
}: AnimationControlProps) {  
    const handleSliderChange = (event: Event, value: number | number[]) => {
        event.preventDefault();
        if (typeof value === 'number') {
            onSpeedChange(value);
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
            } else if (event.key === SPEED_UP_KEY && speed + SPEED_STEP <= SPEED_MAX) {
                onSpeedChange(speed + SPEED_STEP);
            } else if (event.key === SPEED_DOWN_KEY && speed - SPEED_STEP >= SPEED_MIN) {
                onSpeedChange(speed - SPEED_STEP);
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
        onSkipForward, onSpeedChange, showAgentId, speed, onTracePathsChange, tracePaths, 
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
                    <Tooltip title={`Restart animation (${RESTART_KEY})`}>
                        <Button onClick={onRestart}>
                            <RestartAltIcon />
                        </Button>
                    </Tooltip>
                </ButtonGroup>
            </Box>
            <Box display="flex" justifyContent="center">
                <ButtonGroup size="large" variant="outlined">
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
            <Box display='flex' justifyContent='center'>
                <Tooltip 
                    title={
                        <div style={{ textAlign: 'center' }}>
                            Adjust animation step size
                            ({SPEED_UP_KEY}/{SPEED_DOWN_KEY})
                        </div>
                    }
                >
                    <Slider
                        value={speed}
                        step={SPEED_STEP}
                        marks
                        min={SPEED_MIN}
                        max={SPEED_MAX}
                        valueLabelDisplay="auto"
                        onChange={handleSliderChange}
                        sx={{ width: '50%' }}
                    />
                </Tooltip>
            </Box>
        </Stack>
    );   
}

export default AnimationControl;
