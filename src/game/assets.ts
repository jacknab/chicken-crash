export const RIGHT_CAR_IMAGES = [
  'https://raw.githubusercontent.com/jacknab/scripts/main/car1.png',
  'https://raw.githubusercontent.com/jacknab/scripts/main/car2.png',
  'https://raw.githubusercontent.com/jacknab/scripts/main/car3.png',
  'https://raw.githubusercontent.com/jacknab/scripts/main/car4.png',
  'https://raw.githubusercontent.com/jacknab/scripts/main/car5.png',
  'https://raw.githubusercontent.com/jacknab/scripts/main/car6.png',
  'https://raw.githubusercontent.com/jacknab/scripts/main/car9.png',
  'https://raw.githubusercontent.com/jacknab/scripts/main/car11.png',
  'https://raw.githubusercontent.com/jacknab/scripts/main/car12.png',
  'https://raw.githubusercontent.com/jacknab/scripts/main/car10.png',
];

// Map to store loaded car images
export const carImages: Map<string, HTMLImageElement> = new Map();

// Chicken icon image
export const chickenIcon = new Image();
chickenIcon.src =
  'https://raw.githubusercontent.com/jacknab/scripts/main/icon.png';

// Flattened chicken image
export const flatChickenIcon = new Image();
flatChickenIcon.src =
  'https://raw.githubusercontent.com/jacknab/scripts/main/flat.png';

// Manhole cover image
export const manholeImage = new Image();
manholeImage.src =
  'https://raw.githubusercontent.com/jacknab/scripts/main/hole.png';

// Golden coin image
export const coinImage = new Image();
coinImage.src =
  'https://raw.githubusercontent.com/jacknab/scripts/main/flipped.png';

// Pirate image for crash points
export const pirateImage = new Image();
pirateImage.src =
  'https://raw.githubusercontent.com/jacknab/scripts/main/pirate.png';

// Sign image
export const signImage = new Image();
signImage.src =
  'https://raw.githubusercontent.com/jacknab/scripts/main/sign.png';

// Oops image
export const Oops = new Image();
Oops.src =
  'https://raw.githubusercontent.com/jacknab/scripts/main/oops.png';

export const loadAssets = (): Promise<void> => {
  const allCarImages = [...RIGHT_CAR_IMAGES];
  const loadPromises = allCarImages.map(
    (url) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        const timeout = setTimeout(() => {
          console.warn(`Car image load timed out for ${url}`);
          resolve();
        }, 5000);

        img.onload = () => {
          clearTimeout(timeout);
          carImages.set(url, img);
          resolve();
        };

        img.onerror = () => {
          clearTimeout(timeout);
          console.warn(`Failed to load car image: ${url}`);
          resolve();
        };

        img.src = url;
      })
  );

  return Promise.all(loadPromises).then(() => {});
};
