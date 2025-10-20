import { Stack, Button, Box } from '@mui/material';
import StartIcon from '@mui/icons-material/Start';
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOnIcon from '@mui/icons-material/RepeatOn';
import FilterCenterFocusOutlinedIcon from '@mui/icons-material/FilterCenterFocusOutlined';
import ScreenshotMonitorOutlinedIcon from '@mui/icons-material/ScreenshotMonitorOutlined';
import Tooltip from '@mui/material/Tooltip';
import { KeyMap } from './Params';

interface ControlsSectionProps {
  onRestart: () => void;
  loopAnimation: boolean;
  onLoopAnimationChange: (loopAnimation: boolean) => void;
  onFitView: () => void;
  canScreenshot: boolean;
  takeScreenshot: () => void;
}

function ControlsSection({
  onRestart,
  loopAnimation,
  onLoopAnimationChange,
  onFitView,
  canScreenshot,
  takeScreenshot,
}: ControlsSectionProps) {
  return (
    <Stack spacing={1}>
      <Box sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'text.secondary', letterSpacing: 1 }}>Controls</Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5 }}>
        <Tooltip title={KeyMap.RESTART_KEY} arrow placement='top'>
          <Button
            onClick={onRestart}
            size="small"
            variant="outlined"
            startIcon={<StartIcon />}
            sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
          >
            Restart
          </Button>
        </Tooltip>

        <Tooltip title={KeyMap.LOOP_KEY} arrow placement='top'>
          <Button
            onClick={() => onLoopAnimationChange(!loopAnimation)}
            size="small"
            variant="outlined"
            startIcon={loopAnimation ? <RepeatOnIcon /> : <RepeatIcon />}
            sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
          >
            Loop
          </Button>
        </Tooltip>

        <Tooltip title={KeyMap.FIT_VIEW_KEY} arrow placement='bottom'>
        <Button
          onClick={onFitView}
          size="small"
          variant="outlined"
          startIcon={<FilterCenterFocusOutlinedIcon />}
          sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
        >
          Fit View
        </Button>
        </Tooltip>

        <Tooltip title={KeyMap.SCREENSHOT_KEY} arrow placement='bottom'>
          <Button
            disabled={!canScreenshot}
            onClick={takeScreenshot}
            size="small"
            variant="outlined"
            startIcon={<ScreenshotMonitorOutlinedIcon />}
            sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
          >
            Screenshot
          </Button>
        </Tooltip>
      </Box>
    </Stack>
  );
}

export default ControlsSection;
