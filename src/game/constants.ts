export const CANVAS_WIDTH = 785;
export const CANVAS_HEIGHT = 342;
export const PLAYER_SIZE = 60;  // Increased from 40 to 60 for better visibility
export const VEHICLE_WIDTH = 60;    // Adjusted to fit lanes better
export const VEHICLE_HEIGHT = 120;  // Adjusted height to maintain proportion
export const MANHOLE_SIZE = 50;  // Reduced for better lane fit
export const MANHOLE_SPACING = 200;  // Minimum space between manholes
export const MANHOLE_COUNT_PER_LANE = 2;  // Number of manholes per lane

// Lane widths
export const SAFE_LANE_WIDTH = 100;     // Width for safe zones
export const CURB_WIDTH = 100;          // Width for curb zones
export const HIGHWAY_LANE_WIDTH = 100;   // Width for highway lanes

// Lane types
export type LaneType = 'safe' | 'curb' | 'highway';

// Lane configuration
export const LANE_CONFIG: Array<{ type: LaneType; width: number; direction?: number }> = [
  { type: 'curb', width: CURB_WIDTH },               // First curb
  { type: 'highway', width: HIGHWAY_LANE_WIDTH, direction: 1 },    // All highways now move down
  { type: 'highway', width: HIGHWAY_LANE_WIDTH, direction: 1 },
  { type: 'highway', width: HIGHWAY_LANE_WIDTH, direction: 1 },
  { type: 'highway', width: HIGHWAY_LANE_WIDTH, direction: 1 },
  { type: 'highway', width: HIGHWAY_LANE_WIDTH, direction: 1 },
  { type: 'highway', width: HIGHWAY_LANE_WIDTH, direction: 1 },
  { type: 'highway', width: HIGHWAY_LANE_WIDTH, direction: 1 },
  { type: 'highway', width: HIGHWAY_LANE_WIDTH, direction: 1 },    // Highway 8 (2.50x)
  { type: 'highway', width: HIGHWAY_LANE_WIDTH, direction: 1 },    // Highway 9 (2.70x)
  { type: 'highway', width: HIGHWAY_LANE_WIDTH, direction: 1 },    // Highway 10 (2.85x)
  { type: 'highway', width: HIGHWAY_LANE_WIDTH, direction: 1 },    // Highway 11 (3.00x)
  { type: 'highway', width: HIGHWAY_LANE_WIDTH, direction: 1 },    // Highway 12 (3.15x)
  { type: 'highway', width: HIGHWAY_LANE_WIDTH, direction: 1 },    // Highway 13 (3.30x)
  { type: 'highway', width: HIGHWAY_LANE_WIDTH, direction: 1 },    // Highway 14 (3.45x)
  { type: 'highway', width: HIGHWAY_LANE_WIDTH, direction: 1 },    // Highway 15 (3.60x)
  { type: 'safe', width: SAFE_LANE_WIDTH },          // Finish zone (4.00x)
];

export const VEHICLE_SPAWN_RATE = 0.01;
export const SPECIAL_VEHICLE_CHANCE = 0.001;
export const MIN_VEHICLE_SPEED = 2;
export const MAX_VEHICLE_SPEED = 4;

// Vehicle spacing
export const MIN_VEHICLE_SPACING = 200;  // Increased minimum space between vehicles
export const SPAWN_BUFFER = 150;         // Increased buffer for spawning

// Load environment variables with defaults
const getEnvFloat = (key: string, defaultValue: number): number => {
  const value = import.meta.env[key];
  return value ? parseFloat(value) : defaultValue;
};

// Betting constants
export const MIN_BET_AMOUNT = getEnvFloat('MIN_BET_AMOUNT', 1.00);
export const MAX_BET_AMOUNT = getEnvFloat('MAX_BET_AMOUNT', 5.00);
export const DEFAULT_BET_AMOUNT = getEnvFloat('DEFAULT_BET_AMOUNT', 2.00);

// Multiplier settings
export const DIFFICULTY_MULTIPLIERS = {
  Easy: {
    base: getEnvFloat('EASY_BASE_MULTIPLIER', 1.05),
    increment: getEnvFloat('EASY_INCREMENT', 0.15)
  },
  Medium: {
    base: getEnvFloat('MEDIUM_BASE_MULTIPLIER', 1.10),
    increment: getEnvFloat('MEDIUM_INCREMENT', 0.20)
  },
  Hard: {
    base: getEnvFloat('HARD_BASE_MULTIPLIER', 1.15),
    increment: getEnvFloat('HARD_INCREMENT', 0.25)
  }
};

export const DIFFICULTY_SETTINGS = {
  Easy: {
    minSpeed: MIN_VEHICLE_SPEED,
    maxSpeed: MAX_VEHICLE_SPEED * 0.5,
    spawnRate: 0.15
  },
  Medium: {
    minSpeed: MIN_VEHICLE_SPEED * 1.5,
    maxSpeed: MAX_VEHICLE_SPEED * 0.75,
    spawnRate: 0.2
  },
  Hard: {
    minSpeed: MIN_VEHICLE_SPEED * 2,
    maxSpeed: MAX_VEHICLE_SPEED,
    spawnRate: 0.25
  }
};

export const MIN_COUNTDOWN = 5;
export const MAX_COUNTDOWN = 13;
