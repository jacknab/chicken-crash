import { Vehicle } from '../types';
import { VEHICLE_WIDTH, VEHICLE_HEIGHT } from '../constants';

// Create a police car with specific positioning
function createPoliceCar(
  lane: { startX: number; width: number }, 
  index: number, 
  offset: number = 0,
  laneOffset: number = 0
): Vehicle {
  const baseSpeed = 3; // Further reduced base speed
  const laneCenter = lane.startX + (lane.width - VEHICLE_WIDTH) / 2 + laneOffset;
  
  return {
    position: {
      x: laneCenter + offset,
      y: -VEHICLE_HEIGHT - (index * VEHICLE_HEIGHT * 2.5),
    },
    speed: baseSpeed + (Math.random() * 0.5), // Minimal speed variation
    width: VEHICLE_WIDTH,
    height: VEHICLE_HEIGHT,
    lane: lane.startX,
    type: 'vehicle',
    isSpecial: true,
    imageUrl: 'https://raw.githubusercontent.com/jacknab/scripts/main/car2.png',
    hasLights: true,
    spawnDelay: index * 200 // Adjusted spawn delay
  };
}

export function spawnPoliceCars(
  targetLane: { startX: number; width: number },
  lanes: Array<{ startX: number; width: number; type: string }>
): Vehicle[] {
  const policeCars: Vehicle[] = [];
  const targetLaneIndex = lanes.findIndex(l => l.startX === targetLane.startX);
  
  // Spawn police cars in target lane
  policeCars.push(createPoliceCar(targetLane, 0, 0));
  policeCars.push(createPoliceCar(targetLane, 1, -20));
  policeCars.push(createPoliceCar(targetLane, 1, 20));
  
  // Spawn police cars in adjacent lanes
  const adjacentLanes = [
    lanes[targetLaneIndex - 1],
    lanes[targetLaneIndex + 1]
  ].filter(lane => lane && lane.type === 'highway');
  
  adjacentLanes.forEach((lane, laneIndex) => {
    policeCars.push(createPoliceCar(lane, 2, 0));
    policeCars.push(createPoliceCar(lane, 3, laneIndex === 0 ? -20 : 20));
  });
  
  return policeCars;
}
