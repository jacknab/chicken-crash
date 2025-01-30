import { LANE_CONFIG } from '../constants';

export function calculateLaneDistances() {
  let currentX = 0;
  const laneCenters: number[] = [];
  
  // Calculate center position of each lane
  LANE_CONFIG.forEach(lane => {
    const laneCenter = currentX + (lane.width / 2);
    laneCenters.push(laneCenter);
    currentX += lane.width;
  });
  
  // Calculate distances between adjacent lanes
  const laneDistances = laneCenters.slice(1).map((center, index) => {
    const previousCenter = laneCenters[index];
    const distance = center - previousCenter;
    return {
      fromLane: index,
      toLane: index + 1,
      distance: Math.round(distance),
      centerPositions: {
        from: Math.round(previousCenter),
        to: Math.round(center)
      }
    };
  });

  return {
    laneCenters: laneCenters.map(center => Math.round(center)),
    laneDistances
  };
}

// Debug function to log lane measurements
export function debugLaneMeasurements() {
  const { laneCenters, laneDistances } = calculateLaneDistances();
  
  console.log('Lane Centers (pixels from left edge):');
  laneCenters.forEach((center, index) => {
    console.log(`Lane ${index}: ${center}px`);
  });
  
  console.log('\nDistances between adjacent lanes:');
  laneDistances.forEach(({ fromLane, toLane, distance, centerPositions }) => {
    console.log(
      `Lane ${fromLane} to ${toLane}: ${distance}px ` +
      `(from ${centerPositions.from}px to ${centerPositions.to}px)`
    );
  });
}
