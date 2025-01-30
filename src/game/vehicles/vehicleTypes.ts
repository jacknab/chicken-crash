export interface VehicleType {
  id: string;
  imageUrl: string;
  minSpeed: number;
  maxSpeed: number;
  spawnWeight: number;
  isEmergency?: boolean;
  hasLights?: boolean;
}

export const VEHICLE_TYPES: VehicleType[] = [
  {
    id: 'police',
    imageUrl: 'https://raw.githubusercontent.com/jacknab/scripts/main/car2.png',
    minSpeed: 4,
    maxSpeed: 6,
    spawnWeight: 0,  // Don't spawn normally
    isEmergency: true,
    hasLights: true
  },
  {
    id: 'sedan1',
    imageUrl: 'https://raw.githubusercontent.com/jacknab/scripts/main/car1.png',
    minSpeed: 2,
    maxSpeed: 3.5,
    spawnWeight: 35  // Increased regular car spawn weight
  },
  {
    id: 'sports1',
    imageUrl: 'https://raw.githubusercontent.com/jacknab/scripts/main/car3.png',
    minSpeed: 3,
    maxSpeed: 4.5,
    spawnWeight: 25  // Increased sports car spawn weight
  },
  {
    id: 'sports2',
    imageUrl: 'https://raw.githubusercontent.com/jacknab/scripts/main/car4.png',
    minSpeed: 3,
    maxSpeed: 4.5,
    spawnWeight: 25  // Increased sports car spawn weight
  },
  {
    id: 'truck',
    imageUrl: 'https://raw.githubusercontent.com/jacknab/scripts/main/car6.png',
    minSpeed: 1.5,
    maxSpeed: 2.5,
    spawnWeight: 15  // Increased truck spawn weight
  }
];
