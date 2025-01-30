import { VEHICLE_TYPES, VehicleType } from './vehicleTypes';
import { Vehicle } from '../types';
import { VEHICLE_WIDTH, VEHICLE_HEIGHT } from '../constants';

// Weighted random selection based on spawnWeight
function selectRandomVehicle(): VehicleType {
  const totalWeight = VEHICLE_TYPES.reduce((sum, type) => sum + type.spawnWeight, 0);
  let random = Math.random() * totalWeight;
  
  for (const vehicleType of VEHICLE_TYPES) {
    random -= vehicleType.spawnWeight;
    if (random <= 0) return vehicleType;
  }
  
  return VEHICLE_TYPES[0];
}

export function createVehicle(
  lane: { startX: number; width: number },
  difficulty: string = 'Easy',
  existingVehicles: Vehicle[] = []
): Vehicle | null {
  const selectedType = selectRandomVehicle();
  
  // Adjust speed based on difficulty and vehicle type
  const difficultyMultiplier = {
    Easy: 0.8,
    Medium: 1.0,
    Hard: 1.2
  }[difficulty] || 1.0;
  
  const baseSpeed = selectedType.minSpeed + 
    Math.random() * (selectedType.maxSpeed - selectedType.minSpeed);
  const speed = baseSpeed * difficultyMultiplier;
  
  return {
    position: {
      x: lane.startX + (lane.width - VEHICLE_WIDTH) / 2,
      y: -VEHICLE_HEIGHT
    },
    speed,
    width: VEHICLE_WIDTH,
    height: VEHICLE_HEIGHT,
    lane: lane.startX,
    type: 'vehicle',
    isSpecial: selectedType.isEmergency || false,
    imageUrl: selectedType.imageUrl,
    hasLights: selectedType.hasLights || false,
    vehicleId: selectedType.id
  };
}
