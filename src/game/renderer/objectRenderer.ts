import { Vehicle } from '../types';
import { carImages, manholeImage, coinImage, pirateImage } from '../assets';
import { CANVAS_WIDTH } from '../constants';
import type { Manhole } from '../types';
import { isCrashLane } from '../crash/crashPointGenerator';

export function drawManhole(ctx: CanvasRenderingContext2D, manhole: Manhole, state: GameState) {
  if (manhole.isCollected) {
    // Determine which image to use based on crash point
    const laneIndex = state.lanes.findIndex(lane => lane.startX === manhole.lane);
    const isCrash = isCrashLane(state, laneIndex);
    const image = isCrash ? pirateImage : coinImage;
    
    if (image.complete) {
      // Calculate animation progress (1 second animation)
      const progress = Math.min((Date.now() - (manhole.collectedTimestamp || 0)) / 1000, 1);
      
      // Apply scale animation
      const scale = 0.8 + (Math.sin(progress * Math.PI) * 0.2);
      
      // Save context for transformation
      ctx.save();
      
      // Move to center of manhole
      ctx.translate(
        manhole.position.x + manhole.width / 2,
        manhole.position.y + manhole.height / 2
      );
      
      // Apply scale
      ctx.scale(scale, scale);
      
      // Draw coin centered
      ctx.drawImage(
        image,
        -manhole.width / 2,
        -manhole.height / 2,
        manhole.width,
        manhole.height
      );
      
      // Restore context
      ctx.restore();
    }
  } else {
    if (!manholeImage.complete) return;
    
    ctx.drawImage(
      manholeImage,
      manhole.position.x,
      manhole.position.y,
      manhole.width,
      manhole.height
    );
  }
}

export function drawObject(ctx: CanvasRenderingContext2D, object: Vehicle) {
  if (object.type === 'vehicle') {
    const carImage = object.imageUrl ? carImages.get(object.imageUrl) : null;
    
    // Draw car image first
    if (carImage?.complete && carImage.naturalWidth > 0) {
      ctx.drawImage(
        carImage, 
        object.position.x,
        object.position.y,
        object.width,
        object.height
      );
    } else {
      // Fallback to default vehicle rendering
      ctx.fillStyle = object.isSpecial ? '#FF4444' : '#333333';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.fillRect(
        object.position.x,
        object.position.y,
        object.width,
        object.height
      );
      ctx.strokeRect(
        object.position.x,
        object.position.y,
        object.width,
        object.height
      );
    }
    
    // Draw emergency lights for special vehicles
    if (object.hasLights) {
      const time = Date.now() / 150; // Adjusted flash rate
      const flash = Math.sin(time) > 0;
      const lightBarHeight = object.height * 0.08; // Reduced height for better proportion
      const lightBarY = object.position.y + 50; // Keep at 50px from top
      
      // Draw light effect
      ctx.save();
      ctx.globalAlpha = flash ? 1 : 0.6; // Increased minimum brightness
      
      // Draw light bar background
      ctx.fillStyle = '#222222';
      ctx.fillRect(
        object.position.x + object.width * 0.2,
        lightBarY,
        object.width * 0.6,
        lightBarHeight
      );
      
      // Light bar glow effect
      const barGlow = ctx.createLinearGradient(
        object.position.x + object.width * 0.2,
        lightBarY,
        object.position.x + object.width * 0.8,
        lightBarY + lightBarHeight
      );
      barGlow.addColorStop(0, flash ? 'rgba(255, 0, 0, 0.3)' : 'rgba(0, 0, 255, 0.3)');
      barGlow.addColorStop(1, flash ? 'rgba(0, 0, 255, 0.3)' : 'rgba(255, 0, 0, 0.3)');
      ctx.fillStyle = barGlow;
      ctx.fillRect(
        object.position.x + object.width * 0.2,
        lightBarY,
        object.width * 0.6,
        lightBarHeight
      );
      
      // Left (red) light
      const redGradient = ctx.createRadialGradient(
        object.position.x + object.width * 0.3,
        lightBarY + lightBarHeight / 2,
        2,
        object.position.x + object.width * 0.3,
        lightBarY + lightBarHeight / 2,
        35 // Increased glow radius
      );
      redGradient.addColorStop(0, flash ? 'rgba(255, 30, 30, 1)' : 'transparent'); // Brighter red
      redGradient.addColorStop(0.4, flash ? 'rgba(255, 30, 30, 0.8)' : 'transparent');
      redGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = redGradient;
      ctx.beginPath();
      ctx.arc(
        object.position.x + object.width * 0.3,
        lightBarY + lightBarHeight / 2,
        35, // Match the gradient radius
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      // Right (blue) light
      const blueGradient = ctx.createRadialGradient(
        object.position.x + object.width * 0.7,
        lightBarY + lightBarHeight / 2,
        2,
        object.position.x + object.width * 0.7,
        lightBarY + lightBarHeight / 2,
        35 // Match red light radius
      );
      blueGradient.addColorStop(0, !flash ? 'rgba(30, 30, 255, 1)' : 'transparent'); // Brighter blue
      blueGradient.addColorStop(0.4, !flash ? 'rgba(30, 30, 255, 0.8)' : 'transparent');
      blueGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = blueGradient;
      ctx.beginPath();
      ctx.arc(
        object.position.x + object.width * 0.7,
        lightBarY + lightBarHeight / 2,
        35, // Match the gradient radius
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      ctx.restore();
    }
  } else {
    // Draw log
    ctx.fillStyle = '#8B4513';  // Saddle brown for logs
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    
    // Log body
    ctx.fillRect(
      object.position.x,
      object.position.y,
      object.width,
      object.height
    );
    
    // Log texture
    for (let i = 1; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(object.position.x + (object.width * i / 4), object.position.y);
      ctx.lineTo(object.position.x + (object.width * i / 4), object.position.y + object.height);
      ctx.stroke();
    }
  }

  // Draw countdown timer for special vehicles
  if (object.isSpecial && object.isCountingDown && object.countdownTimer) {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      Math.ceil(object.countdownTimer).toString(),
      object.position.x + object.width / 2,
      object.position.y + object.height / 2
    );
  }
}
