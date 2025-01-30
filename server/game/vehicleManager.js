import { DIFFICULTY_SETTINGS, LANE_CONFIG } from './constants.js';

export class VehicleManager {
  constructor() {
    this.vehicles = new Map(); // sessionId -> vehicles array
  }

  initializeVehicles(sessionId) {
    this.vehicles.set(sessionId, []);
  }

  updateVehicles(sessionId, difficulty) {
    const vehicles = this.vehicles.get(sessionId);
    if (!vehicles) return [];

    // Update existing vehicle positions
    const updatedVehicles = vehicles.filter(vehicle => {
      vehicle.position.y += vehicle.speed;
      return vehicle.position.y <= 342 + 120; // CANVAS_HEIGHT + VEHICLE_HEIGHT
    });

    // Spawn new vehicles based on difficulty settings
    const settings = DIFFICULTY_SETTINGS[difficulty];
    const highwayLanes = LANE_CONFIG.filter(lane => lane.type === 'highway');

    if (Math.random() < settings.spawnRate) {
      const randomLane = highwayLanes[Math.floor(Math.random() * highwayLanes.length)];
      const newVehicle = this.spawnVehicle(randomLane, settings);
      if (newVehicle) {
        updatedVehicles.push(newVehicle);
      }
    }

    this.vehicles.set(sessionId, updatedVehicles);
    return updatedVehicles;
  }

  spawnVehicle(lane, settings) {
    // Check vehicle spacing in the lane
    const vehicles = this.vehicles.get(sessionId) || [];
    const vehiclesInLane = vehicles.filter(v => v.lane === lane.startX);
    
    if (vehiclesInLane.length > 0) {
      const lastVehicle = vehiclesInLane[vehiclesInLane.length - 1];
      if (lastVehicle.position.y < 200) return null; // MIN_VEHICLE_SPACING
    }

    const speed = Math.random() * (settings.maxSpeed - settings.minSpeed) + settings.minSpeed;
    const startX = lane.startX + (lane.width - 60) / 2; // 60 is VEHICLE_WIDTH

    return {
      position: { x: startX, y: -120 }, // -VEHICLE_HEIGHT
      speed,
      width: 60,
      height: 120,
      lane: lane.startX,
      type: 'vehicle',
      isSpecial: false,
      imageUrl: this.getRandomCarImage()
    };
  }

  getRandomCarImage() {
    const images = [
      'car1.png', 'car2.png', 'car3.png', 'car4.png',
      'car5.png', 'car6.png', 'car9.png', 'car10.png',
      'car11.png', 'car12.png'
    ];
    return `https://raw.githubusercontent.com/jacknab/scripts/main/${
      images[Math.floor(Math.random() * images.length)]
    }`;
  }

  getVehicles(sessionId) {
    return this.vehicles.get(sessionId) || [];
  }

  clearSession(sessionId) {
    this.vehicles.delete(sessionId);
  }
}
