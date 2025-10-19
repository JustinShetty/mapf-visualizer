import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseTwoToneIcon from '@mui/icons-material/PauseTwoTone';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect } from 'react';
import { KeyMap } from './Params';

const STEP_SIZE_INCREMENT = 0.2;
const STEP_SIZE_MAX = 10;
const STEP_SIZE_MIN = 0.2;

interface AnimationControlProps {
    playAnimation: boolean;
    onPlayChange: (play: boolean) => void;
    onSkipBackward: () => void;
    onSkipForward: () => void;
    onOpenDrawer: () => void;
    onRestart: () => void;
    stepSize: number;
    onStepSizeChange: (speed: number) => void;
    loopAnimation: boolean;
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
    onPlayChange,
    onSkipBackward,
    onSkipForward,
    onOpenDrawer,
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
    takeScreenshot,
    showCellId,
    setShowCellId,
    showGoals,
    setShowGoals,
    showGoalVectors,
    setShowGoalVectors,
}: AnimationControlProps) {

  useEffect(() => {
        const roundAndSetStepSize = (value: number) => {
            onStepSizeChange(Number(value.toFixed(1)));
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (!event.ctrlKey && !event.altKey && !event.metaKey) {
                event.preventDefault();
            }

            switch (event.key) {
                case KeyMap.STEP_BACKWARD_KEY:
                    onSkipBackward();
                    break;
                case KeyMap.PLAY_PAUSE_KEY:
                    onPlayChange(!playAnimation);
                    break;
                case KeyMap.STEP_FORWARD_KEY:
                    onSkipForward();
                    break;
                case KeyMap.RESTART_KEY:
                    onRestart();
                    break;
                case KeyMap.LOOP_KEY:
                    onLoopAnimationChange(!loopAnimation);
                    break;
                case KeyMap.FIT_VIEW_KEY:
                    onFitView();
                    break;
                case KeyMap.SHOW_AGENT_ID_KEY:
                    onShowAgentIdChange(!showAgentId);
                    break;
                case KeyMap.STEP_SIZE_UP_KEY:
                    if (stepSize + STEP_SIZE_INCREMENT <= STEP_SIZE_MAX) {
                        roundAndSetStepSize(stepSize + STEP_SIZE_INCREMENT);
                    }
                    break;
                case KeyMap.STEP_SIZE_DOWN_KEY:
                    if (stepSize - STEP_SIZE_INCREMENT >= STEP_SIZE_MIN) {
                        roundAndSetStepSize(stepSize - STEP_SIZE_INCREMENT);
                    }
                    break;
                case KeyMap.TRACE_PATHS_KEY:
                    onTracePathsChange(!tracePaths);
                    break;
                case KeyMap.SCREENSHOT_KEY:
                    takeScreenshot();
                    break;
                case KeyMap.SHOW_CELL_ID_KEY:
                    setShowCellId(!showCellId);
                    break;
                case KeyMap.SHOW_GOALS_KEY:
                    setShowGoals(!showGoals);
                    break;
                case KeyMap.SHOW_GOAL_VECTORS_KEY:
                    setShowGoalVectors(!showGoalVectors);
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [
        playAnimation,
        onPlayChange,
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
        takeScreenshot,
        showCellId,
        setShowCellId,
        showGoals,
        setShowGoals,
        showGoalVectors,
        setShowGoalVectors,
    ]);

    return (
        <Box sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(18, 18, 18, 0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            px: 3,
            py: 1.5,
        }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                    Drag to pan, scroll to zoom.
                </Box>

                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                    }}
                >
                    <Tooltip title="Previous step (🡐)">
                        <IconButton
                            onClick={onSkipBackward}
                            size="small"
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                }
                            }}
                        >
                            <SkipPreviousIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={(playAnimation ? "Pause" : "Play") + " (space)"}>
                        <IconButton
                            onClick={() => onPlayChange(!playAnimation)}
                            sx={{
                                width: 48,
                                height: 48,
                                backgroundColor: 'primary.main',
                                '&:hover': {
                                    backgroundColor: 'primary.dark',
                                }
                            }}
                        >
                            {playAnimation ? <PauseTwoToneIcon /> : <PlayArrowIcon />}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Next step (🡒)">
                        <IconButton
                            onClick={onSkipForward}
                            size="small"
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                }
                            }}
                        >
                            <SkipNextIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>

                <Tooltip title="Open settings">
                    <IconButton
                        onClick={onOpenDrawer}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            }
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Tooltip>
            </Stack>
        </Box>
    );
}

export default AnimationControl;
