import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseTwoToneIcon from '@mui/icons-material/PauseTwoTone';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

interface AnimationControlProps {
    playAnimation: boolean;
    onPlayAnimationChange: (playAnimation: boolean) => void;
    onSkipBackward: () => void;
    onSkipForward: () => void;
    onRestart: () => void;
}

function AnimationControl({
    playAnimation, 
    onPlayAnimationChange, 
    onSkipBackward, 
    onSkipForward,
    onRestart,
}: AnimationControlProps) {    
    return (
        <Box>
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
                 </ButtonGroup>
            </Box>
        </Box>
    );
}

export default AnimationControl;
