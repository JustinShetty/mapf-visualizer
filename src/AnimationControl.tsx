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

interface AnimationControlProps {
    playAnimation: boolean;
    onPlayAnimationChange: (playAnimation: boolean) => void;
    onSkipBackward: () => void;
    onSkipForward: () => void;
    onRestart: () => void;
    onSpeedChange: (speed: number) => void;
    loopAnimation: boolean,
    onLoopAnimationChange: (loopAnimation: boolean) => void;
}

function AnimationControl({
    playAnimation, 
    onPlayAnimationChange, 
    onSkipBackward, 
    onSkipForward,
    onRestart,
    onSpeedChange,
    loopAnimation,
    onLoopAnimationChange,
}: AnimationControlProps) {  
    const handleSliderChange = (event: Event, value: number | number[]) => {
        event.preventDefault();
        if (typeof value === 'number') {
            onSpeedChange(value);
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <Box display="flex" justifyContent="center">
                <ButtonGroup
                    size="large"
                    variant="outlined" 
                >
                    <Button onClick={onSkipBackward}>
                        <SkipPreviousIcon />
                    </Button>            
                    <Button
                        onClick={() => onPlayAnimationChange(!playAnimation)}
                    >
                        {playAnimation ? 
                        <PauseTwoToneIcon /> : 
                        <PlayArrowIcon />}
                    </Button>
                    <Button onClick={onSkipForward}>
                        <SkipNextIcon />
                    </Button>
                </ButtonGroup>
            </Box>
            <Box display="flex" justifyContent="center">
                <ButtonGroup
                size="large"
                variant="outlined"
                >
                    <Button onClick={onRestart}>
                        <RestartAltIcon />
                    </Button>
                    <Button onClick={() => onLoopAnimationChange(!loopAnimation)}>
                        {loopAnimation ? 
                        <RepeatOnIcon /> : 
                        <RepeatIcon />}
                    </Button>
                 </ButtonGroup>
            </Box>
            <Box 
                sx={{ width: 1/2 }}
                display="flex" 
                justifyContent="center"
            >
                <Slider
                    defaultValue={1.0}
                    step={0.1}
                    marks
                    min={0.1}
                    max={5}
                    valueLabelDisplay="auto"
                    onChange={handleSliderChange}
                />
            </Box>
        </Box>
    );
}

export default AnimationControl;
