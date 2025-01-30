import { GameState, Vehicle } from '../types';
import { CANVAS_HEIGHT, VEHICLE_HEIGHT, VEHICLE_WIDTH } from '../constants';

// Minimum and maximum crash lanes (2 to 20)
const MIN_CRASH_LANE = 2;
const MAX_CRASH_LANE = 20;

// Vehicle formation patterns for trapping the player
const TRAP_PATTERNS = {
  WALL: 'wall',           // Solid wall of vehicles
  ZIGZAG: 'zigzag',      // Alternating pattern
  PINCER: 'pincer'       // Vehicles closing in from sides
} as const;

type TrapPattern = typeof TRAP_PATTERNS[keyof typeof TRAP_PATTERNS];

interface CrashPoint {
  lane: number;
  pattern: TrapPattern;
  vehicles: Vehicle[];
}

// Generate a random crash point
export function generateCrashPoint(): CrashPoint {
  const lane = Math.floor(Math.random() * (MAX_CRASH_LANE - MIN_CRASH_LANE + 1)) + MIN_CRASH_LANE;
  const patterns = Object.values(TRAP_PATTERNS);
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  
  return {
    lane,
    pattern,
    vehicles: []
  };
}

// Calculate vehicle positions for different trap patterns
function calculateTrapVehicles(
  state: GameState,
  crashPoint: CrashPoint,
  targetLane: number
): Vehicle[] {
  const vehicles: Vehicle[] = [];
  const lane = state.lanes[targetLane];
  if (!lane) return vehicles;

  const baseSpeed = 3; // Consistent speed for trap vehicles
  
  switch (crashPoint.pattern) {
    case 'wall': {
      // Create a wall of 3 vehicles side by side
      for (let i = -1; i <= 1; i++) {
        const adjacentLane = state.lanes[targetLane + i];
        if (adjacentLane && adjacentLane.type === 'highway') {
          vehicles.push({
            position: {
              x: adjacentLane.startX + (adjacentLane.width - VEHICLE_WIDTH) / 2,
              y: -VEHICLE_HEIGHT - (i + 1) * (VEHICLE_HEIGHT + 20)
            },
            speed: baseSpeed,
            width: VEHICLE_WIDTH,
            height: VEHICLE_HEIGHT,
            lane: adjacentLane.startX,
            type: 'vehicle',
            isSpecial: false
          });
        }
      }
      break;
    }
    
    case 'zigzag': {
      // Create alternating pattern of vehicles
      [-1, 0, 1].forEach((offset, index) => {
        const adjacentLane = state.lanes[targetLane + offset];
        if (adjacentLane && adjacentLane.type === 'highway') {
          vehicles.push({
            position: {
              x: adjacentLane.startX + (adjacentLane.width - VEHICLE_WIDTH) / 2,
              y: -VEHICLE_HEIGHT - index * (VEHICLE_HEIGHT + 40)
            },
            speed: baseSpeed,
            width: VEHICLE_WIDTH,
            height: VEHICLE_HEIGHT,
            lane: adjacentLane.startX,
            type: 'vehicle',
            isSpecial: false
          });
        }
      });
      break;
    }
    
    case 'pincer': {
      // Create vehicles that close in from the sides
      [-1, 1].forEach(offset => {
        const adjacentLane = state.lanes[targetLane + offset];
        if (adjacentLane && adjacentLane.type === 'highway') {
          vehicles.push({
            position: {
              x: adjacentLane.startX + (adjacentLane.width - VEHICLE_WIDTH) / 2,
              y: -VEHICLE_HEIGHT - Math.abs(offset) * 50
            },
            speed: baseSpeed,
            width: VEHICLE_WIDTH,
            height: VEHICLE_HEIGHT,
            lane: adjacentLane.startX,
            type: 'vehicle',
            isSpecial: false
          });
        }
      });
      
      // Add one vehicle in the target lane
      vehicles.push({
        position: {
          x: lane.startX + (lane.width - VEHICLE_WIDTH) / 2,
          y: -VEHICLE_HEIGHT - 100
        },
        speed: baseSpeed,
        width: VEHICLE_WIDTH,
        height: VEHICLE_HEIGHT,
        lane: lane.startX,
        type: 'vehicle',
        isSpecial: false
      });
      break;
    }
  }

  return vehicles;
}

// Update trap vehicles and check if it's time to spawn the trap
export function updateCrashLogic(state: GameState, crashPoint: CrashPoint) {
  if (!state.isPlaying || state.gameOver) return;

  // Check if player is approaching the crash point
  const approachingCrash = state.currentLaneIndex === crashPoint.lane - 2;
  
  if (approachingCrash && crashPoint.vehicles.length === 0) {
    // Generate trap vehicles when player approaches
    const trapVehicles = calculateTrapVehicles(state, crashPoint, crashPoint.lane);
    crashPoint.vehicles = trapVehicles;
    
    // Add trap vehicles to game state
    state.vehicles.push(...trapVehicles);
  }
}
