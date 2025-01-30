export const DIFFICULTY_SETTINGS = {
  Easy: {
    minSpeed: 2,
    maxSpeed: 4 * 0.5,
    spawnRate: 0.15
  },
  Medium: {
    minSpeed: 2 * 1.5,
    maxSpeed: 4 * 0.75,
    spawnRate: 0.2
  },
  Hard: {
    minSpeed: 2 * 2,
    maxSpeed: 4,
    spawnRate: 0.25
  }
};

export const LANE_CONFIG = [
  { type: 'curb', width: 100 },
  { type: 'highway', width: 100, direction: 1 },
  { type: 'highway', width: 100, direction: 1 },
  { type: 'highway', width: 100, direction: 1 },
  { type: 'highway', width: 100, direction: 1 },
  { type: 'highway', width: 100, direction: 1 },
  { type: 'highway', width: 100, direction: 1 },
  { type: 'highway', width: 100, direction: 1 },
  { type: 'highway', width: 100, direction: 1 },
  { type: 'highway', width: 100, direction: 1 },
  { type: 'highway', width: 100, direction: 1 },
  { type: 'highway', width: 100, direction: 1 },
  { type: 'highway', width: 100, direction: 1 },
  { type: 'highway', width: 100, direction: 1 },
  { type: 'highway', width: 100, direction: 1 },
  { type: 'highway', width: 100, direction: 1 },
  { type: 'safe', width: 100 }
];
