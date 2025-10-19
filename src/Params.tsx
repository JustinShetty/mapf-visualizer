export const BACKGROUND_COLOR = 0xFFFFFF;
export const GRID_COLOR = 0x000000;
export const TEXT_COLOR = GRID_COLOR;

export const AGENT_COLORS: number[] = [
    0xE91E63,
    0x2196F3,
    0x4CAF50,
    0xFF9800,
    0x00BCD4,
    0x9C27B0,
    0x795548,
    0xFFBB3B,
    0xF44336,
    0x607D8B,
    0x009688,
    0x3F51B5
  ];

export enum KeyMap {
    STEP_BACKWARD_KEY = 'ArrowLeft',
    PLAY_PAUSE_KEY = ' ',
    STEP_FORWARD_KEY = 'ArrowRight',
    RESTART_KEY = 'r',
    LOOP_KEY = 'l',
    FIT_VIEW_KEY = 'f',
    SHOW_AGENT_ID_KEY = 'a',
    STEP_SIZE_UP_KEY = 'ArrowUp',
    STEP_SIZE_DOWN_KEY = 'ArrowDown',
    TRACE_PATHS_KEY = 'p',
    SCREENSHOT_KEY = 's',
    SHOW_CELL_ID_KEY = 'c',
    SHOW_GOALS_KEY = 'g',
    SHOW_GOAL_VECTORS_KEY = 'v',
}
