export type Position = {
  x: number;
  y: number;
};

export type ObjectType = 'vehicle' | 'manhole';

export type Manhole = {
  position: Position;
  width: number;
  height: number;
  lane: number;
  isActive: boolean;
  multiplier: number;
  isClickable: boolean;
  isMovingTo?: boolean;
  isCollected?: boolean;
  collectedTimestamp?: number;
};

export type Vehicle = {
  position: Position;
  speed: number;
  width: number;
  height: number;
  lane: number;
  type: ObjectType;
  isSpecial: boolean;
  countdownTimer?: number;
  isCountingDown?: boolean;
  imageUrl?: string;
  hasLights?: boolean;
  vehicleId?: string;
  spawnDelay?: number;
};

export type GameState = {
  player: Position;
  hitPosition?: Position;
  crashPoint?: {
    lane: number;
    pattern: 'wall' | 'zigzag' | 'pincer';
    vehicles: Vehicle[];
  };
  controlState: 'betting' | 'playing';  // Add control state
  vehicles: Vehicle[];
  manholes: Manhole[];
  score: number;
  multiplier: number;
  gameOver: boolean;
  lanes: Array<{
    startX: number;
    width: number;
    type: LaneType;
    direction?: number;
  }>;
  specialVehicleSpawned: boolean;
  isPlaying: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  betAmount: number;
  hasWon: boolean;
  moveSpeed: number;
  balance: number;
  laneMultipliers: number[];
  cameraOffset?: number;
  lastGlobalSpawnTime: number;
  laneSpawnTimes: Map<number, number>;
  autoMoving?: boolean;
  targetLane?: number;
  crashLanes?: number[];
};

export type Controls = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};
