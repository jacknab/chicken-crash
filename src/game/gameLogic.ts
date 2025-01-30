import { useGameState } from './controllers/gameStateController';
import { GameState, Vehicle, Controls, Position, ObjectType, Manhole } from './types';
import { createVehicle } from './vehicles/vehicleSpawner';
import { generateCrashPoint, isCrashLane } from './crash/crashPointGenerator';
import { spawnPoliceCars } from './crash/policeSpawner';
import { debugLaneMeasurements } from './utils/laneMeasurements';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PLAYER_SIZE,
  VEHICLE_WIDTH,
  VEHICLE_HEIGHT,
  MANHOLE_SIZE,
  MANHOLE_SPACING,
  MANHOLE_COUNT_PER_LANE,
  LANE_CONFIG,
  VEHICLE_SPAWN_RATE,
  SPECIAL_VEHICLE_CHANCE,
  DIFFICULTY_SETTINGS,
  MIN_COUNTDOWN,
  MAX_COUNTDOWN,
  MIN_VEHICLE_SPACING,
  SPAWN_BUFFER,
  LaneType,
  DIFFICULTY_MULTIPLIERS,
  DEFAULT_BET_AMOUNT,
  SAFE_LANE_WIDTH
} from './constants';

export function initializeGame(): GameState {
  // Debug lane measurements
  debugLaneMeasurements();

  // Calculate lane starting positions
  let currentX = 0;
  const lanes = LANE_CONFIG.map(config => {
    const lane = {
      startX: currentX,
      width: config.width,
      type: config.type,
      direction: config.direction
    };
    currentX += config.width;
    return lane;
  });

  // Calculate first lane center
  const firstLane = lanes[0]; // Start in first curb lane
  const firstLaneCenterX = firstLane.startX + (firstLane.width / 2) - (PLAYER_SIZE / 2);
  const playerY = CANVAS_HEIGHT / 2 - PLAYER_SIZE / 2 + 20; // Match manhole height
  
  // Generate multipliers for each lane
  const difficulty = 'Easy'; // Default difficulty
  const laneMultipliers = LANE_CONFIG.map((config, index) => {
    if (config.type === 'curb') return 1;
    
    // Handle special lanes
    if (config.type === 'safe') return 4.00; // Finish zone
    
    // Handle last few highway lanes
    const highwayLanes = LANE_CONFIG.filter(l => l.type === 'highway');
    const isLastHighway = index === LANE_CONFIG.findIndex(l => l.type === 'safe') - 1;
    const isSecondLastHighway = index === LANE_CONFIG.findIndex(l => l.type === 'safe') - 2;
    const isThirdLastHighway = index === LANE_CONFIG.findIndex(l => l.type === 'safe') - 3;
    
    if (isLastHighway) return 3.60;
    if (isSecondLastHighway) return 3.45;
    if (isThirdLastHighway) return 3.30;
    
    // Default multiplier calculation
    const { base: baseMultiplier, increment } = DIFFICULTY_MULTIPLIERS[difficulty];
    const multiplier = baseMultiplier + (increment * index);
    return Number(multiplier.toFixed(2));
  });

  // Generate initial manholes
  const manholes: Manhole[] = [];
  lanes.forEach((lane, laneIndex) => {
    if (lane.type === 'highway' || lane.type === 'safe') {      
      const size = MANHOLE_SIZE;
      const position = {
        x: lane.startX + (lane.width - size) / 2,
        y: CANVAS_HEIGHT / 2 - size / 2 + 20
      };
      
      // Get the correct multiplier for this lane
      const multiplier = laneMultipliers[laneIndex];
      
      manholes.push({
        position,
        width: size,
        height: size,
        lane: lane.startX,
        isActive: true,
        multiplier,
        isClickable: true
      });
    }
  });

  // Generate crash points based on difficulty
  let crashLanes: number[] = [];
  if (difficulty === 'Medium') {
    crashLanes = generateRandomCrashLanes(2, lanes);
  } else if (difficulty === 'Hard') {
    crashLanes = generateRandomCrashLanes(5, lanes);
  } else {
    crashLanes = generateRandomCrashLanes(1, lanes); // Generate 1 random crash lane for easy
  }

  return {
    player: {
      x: firstLaneCenterX,
      y: playerY,
    },
    controlState: 'betting',
    vehicles: [],
    manholes,
    score: 0,
    multiplier: 1,
    gameOver: false,
    lanes,
    specialVehicleSpawned: false,
    isPlaying: false,
    difficulty,
    betAmount: DEFAULT_BET_AMOUNT,
    hasWon: false,
    moveSpeed: 2,
    balance: 0,
    laneMultipliers,
    currentLaneIndex: 0, // Start in first curb lane
    lastGlobalSpawnTime: 0,
    laneSpawnTimes: new Map(),
    crashLanes
  };
}

function generateRandomCrashLanes(count: number, lanes: any[]): number[] {
  const highwayLanes = lanes.filter(lane => lane.type === 'highway');
  const crashLanes: number[] = [];
  
  // Ensure we don't pick the same lane twice
  const availableLanes = [...highwayLanes];
  
  for (let i = 0; i < count; i++) {
    if (availableLanes.length === 0) break; // No more lanes to pick
    
    const randomIndex = Math.floor(Math.random() * availableLanes.length);
    const selectedLane = availableLanes[randomIndex];
    crashLanes.push(lanes.findIndex(l => l.startX === selectedLane.startX));
    availableLanes.splice(randomIndex, 1); // Remove the selected lane
  }
  
  return crashLanes;
}

export function updatePlayerPosition(state: GameState, controls: Controls) {
  const { isPlaying } = useGameState.getState();
  // Only allow movement if game is not over
  if (state.gameOver || !isPlaying) return;
  
  // Handle automated movement when clicking manholes
  if (state.autoMoving && state.targetLane !== undefined) {
    const targetLaneX = state.lanes[state.targetLane].startX + 
      (state.lanes[state.targetLane].width - PLAYER_SIZE) / 2;
    
    // Move towards target lane
    const dx = targetLaneX - state.player.x;
    const moveAmount = Math.min(Math.abs(dx), state.moveSpeed);
    
    if (Math.abs(dx) > 1) {
      state.player.x += Math.sign(dx) * moveAmount;
    } else {
      // Reached target lane
      state.player.x = targetLaneX;
      state.currentLaneIndex = state.targetLane;
      
      // Update manhole after reaching the lane
      const manhole = state.manholes.find(m => m.lane === state.lanes[state.targetLane!].startX);
      if (manhole) {
        manhole.isCollected = true;
        manhole.collectedTimestamp = Date.now();
      }
      
      // Check for crash point after reaching the lane
      if (isCrashLane(state, state.currentLaneIndex)) {
        const policeCars = spawnPoliceCars(state.lanes[state.targetLane!], state.lanes);
        state.vehicles.push(...policeCars);
      }
      
      // Reset movement flags
      state.autoMoving = false;
      state.isMoving = false;
      state.targetLane = undefined;
      
      // Update multiplier and balance
      state.multiplier = state.laneMultipliers[state.currentLaneIndex];
      state.balance = state.betAmount * state.multiplier;
    }
    return;
  }

  // Check if player reached the finish line
  const totalWidth = state.lanes.reduce((sum, lane) => sum + lane.width, 0);
  const lastLaneIndex = state.lanes.length - 1;
  const isInLastLane = state.currentLaneIndex === lastLaneIndex;
  
  if (isInLastLane) {
    state.hasWon = true;
    state.gameOver = true;
    state.multiplier = 4.0; // Set final multiplier
    state.balance = state.betAmount * 4.0; // Final multiplier
    state.controlState = 'betting';
    useGameState.getState().setIsPlaying(false);
    
    // Update session balance
    const currentBalance = Number(sessionStorage.getItem('gameBalance') || '0');
    sessionStorage.setItem('gameBalance', (currentBalance + state.balance).toString());
  }
}

export function updateVehicles(state: GameState) {
  const currentTime = Date.now();
  const GLOBAL_SPAWN_COOLDOWN = 300; // Increased spawn frequency
  
  // Update existing vehicles
  state.vehicles = state.vehicles.filter(vehicle => {
    if (!vehicle) return false;

    const lane = state.lanes.find(l => l.startX === vehicle.lane);
    if (!lane) return false;

    // Update vehicle position
    vehicle.position.y += vehicle.speed;

    // Remove vehicle when it goes out of bounds
    return vehicle.position.y <= CANVAS_HEIGHT + VEHICLE_HEIGHT;
  });

  // Check if enough time has passed since last spawn
  if (currentTime - state.lastGlobalSpawnTime < GLOBAL_SPAWN_COOLDOWN) {
    return;
  }

  // Get all highway lanes
  const highwayLanes = state.lanes.filter(lane => lane.type === 'highway');
  
  const settings = DIFFICULTY_SETTINGS[state.difficulty];
  
  // Only attempt to spawn in one random lane at a time
  if (Math.random() < 0.4) { // Increased spawn chance
    const randomLane = highwayLanes[Math.floor(Math.random() * highwayLanes.length)];
    const vehicle = spawnVehicle(state, randomLane, state.difficulty);
    if (vehicle && !state.vehicles.some(v => 
      v.lane === vehicle.lane && 
      Math.abs(v.position.y - vehicle.position.y) < MIN_VEHICLE_SPACING
    )) {
      state.vehicles.push(vehicle);
    }
  }
  
  // Update last spawn time
  state.lastGlobalSpawnTime = currentTime;
}

function spawnVehicle(
  state: GameState,
  lane: { startX: number; width: number; type: LaneType; direction?: number }
): Vehicle | null {
  if (lane.type !== 'highway') return null;

  // Check vehicle spacing
  const vehiclesInLane = state.vehicles.filter(v => v.lane === lane.startX);
  if (vehiclesInLane.length > 0) {
    const lastVehicle = vehiclesInLane[vehiclesInLane.length - 1];
    if (lastVehicle.position.y < MIN_VEHICLE_SPACING) {
      return null;
    }
  }

  return createVehicle(lane, state.difficulty, state.vehicles);
}
export function checkCollisions(state: GameState): boolean {
  if (state.gameOver) return true;
  const { setIsPlaying } = useGameState.getState();

  const playerHitbox = {
    x: state.player.x,
    y: state.player.y,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
  };

  const collision = state.vehicles.some(vehicle => {
    const vehicleHitbox = {
      x: vehicle.position.x,
      y: vehicle.position.y,
      width: vehicle.width,
      height: vehicle.height,
    };

    return (
      playerHitbox.x < vehicleHitbox.x + vehicleHitbox.width &&
      playerHitbox.x + playerHitbox.width > vehicleHitbox.x &&
      playerHitbox.y < vehicleHitbox.y + vehicleHitbox.height &&
      playerHitbox.y + playerHitbox.height > vehicleHitbox.y
    );
  });
  
  if (collision || (state.crashLanes && state.crashLanes.includes(state.currentLaneIndex))) {
    state.hitPosition = { ...state.player };
    
    if (state.crashLanes && state.crashLanes.includes(state.currentLaneIndex)) {
      const policeCars = spawnPoliceCars(state.lanes[state.currentLaneIndex], state.lanes);
      state.vehicles.push(...policeCars);
    }
    
    // Set a flag to indicate that the game over sequence has started
    state.gameOver = true;
    setIsPlaying(false);
    
    setTimeout(() => {
      setTimeout(() => {
        useGameState.getState().reset();
        state.controlState = 'betting';
        state.balance = 0;
        state.multiplier = 1;
      }, 6000);
    }, 6000);
    
    return true;
  }
  
  return false;
}
