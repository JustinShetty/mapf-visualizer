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
import CropFreeIcon from '@mui/icons-material/CropFree';
import Tooltip from '@mui/material/Tooltip';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksOneOutlinedIcon from '@mui/icons-material/LooksOneOutlined';

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
}: AnimationControlProps) {  
    const handleSliderChange = (event: Event, value: number | number[]) => {
        event.preventDefault();
        if (typeof value === 'number') {
            onSpeedChange(value);
        }
    };

    return (
        <Stack direction="column" spacing={2}>
            <Box display="flex" justifyContent="center">
                <ButtonGroup size="large" variant="outlined">
                    <Tooltip title="Backward one step">
                        <Button onClick={onSkipBackward}>
                            <SkipPreviousIcon />
                        </Button>   
                    </Tooltip>    
                    <Tooltip title={playAnimation ? "Pause" : "Play"}>     
                        <Button onClick={() => onPlayAnimationChange(!playAnimation)}>
                            {playAnimation ? 
                            <PauseTwoToneIcon /> : 
                            <PlayArrowIcon />}
                        </Button>
                    </Tooltip>
                    <Tooltip title="Forward one step">
                        <Button onClick={onSkipForward}>
                            <SkipNextIcon />
                        </Button>
                    </Tooltip>
                </ButtonGroup>
            </Box>
            <Box display="flex" justifyContent="center">
                <ButtonGroup size="large" variant="outlined">
                    <Tooltip title="Restart animation">
                        <Button onClick={onRestart}>
                            <RestartAltIcon />
                        </Button>
                    </Tooltip>
                    <Tooltip title={loopAnimation ? "Disable loop" : "Enable loop"}>
                        <Button onClick={() => onLoopAnimationChange(!loopAnimation)}>
                            {loopAnimation ? 
                            <RepeatOnIcon /> : 
                            <RepeatIcon />}
                        </Button>
                    </Tooltip>
                    <Tooltip title="Reset view">
                        <Button onClick={onFitView}>
                            <CropFreeIcon />
                        </Button>
                    </Tooltip>
                    <Tooltip title={showAgentId ? "Hide agent ID" : "Show agent ID"}>
                        <Button onClick={() => onShowAgentIdChange(!showAgentId)}>
                            {showAgentId ?
                            <LooksOneIcon />:
                            <LooksOneOutlinedIcon />}
                        </Button>
                    </Tooltip>
                </ButtonGroup>
            </Box>
            <Box display='flex' justifyContent='center'>
                <Tooltip title="Adjust animation step size (speed)">
                    <Slider
                        value={speed}
                        step={0.2}
                        marks
                        min={0.2}
                        max={10}
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
