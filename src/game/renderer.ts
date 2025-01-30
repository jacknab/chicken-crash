import { GameState } from './types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';
import { drawLane } from './renderer/laneRenderer';
import { drawObject, drawManhole } from './renderer/objectRenderer';
import { drawPlayer, drawFlattenedPlayer } from './renderer/playerRenderer';
import { chickenIcon, signImage, Oops } from './assets';
import { SAFE_LANE_WIDTH } from './constants';

const SCROLL_THRESHOLD = 3; // Lane index to start scrolling earlier
const SCROLL_SPEED = 0.1; // Smoothing factor for camera movement

export function drawGame(ctx: CanvasRenderingContext2D, state: GameState) {
  // Calculate camera offset based on player position
  let cameraOffset = 0;
  if (state.currentLaneIndex >= SCROLL_THRESHOLD) {
    const targetOffset = -(state.player.x - CANVAS_WIDTH * 0.3);
    state.cameraOffset = state.cameraOffset ?? 0;
    state.cameraOffset += (targetOffset - state.cameraOffset) * SCROLL_SPEED;
    cameraOffset = state.cameraOffset;
  }

  // Clear canvas
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Save the current context state
  ctx.save();
  
  // Apply camera transform
  ctx.translate(cameraOffset, 0);

  // Draw balance at the top right
  const balance = sessionStorage.getItem('gameBalance');
  if (balance) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform for UI elements
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px Impact, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`Balance: $${Number(balance).toFixed(2)}`, CANVAS_WIDTH - 10, 25);
    ctx.restore();
  }

  // Draw lanes
  state.lanes.forEach(lane => {
    drawLane(ctx, lane.startX, lane.width, CANVAS_HEIGHT, lane.type);
  });

  // Draw manholes and multipliers
  state.lanes.forEach((lane, index) => {
    const multiplier = state.laneMultipliers[index];
    if ((multiplier > 1 && lane.type === 'highway') || lane.type === 'safe') {
      // Find the manhole for this lane
      const manhole = state.manholes.find(m => m.lane === lane.startX);
      if (manhole && !manhole.isCollected) {
        
        // Draw manhole cover image
        drawManhole(ctx, manhole, state);
        
        // Draw multiplier text only if not collected
        const text = `${multiplier.toFixed(2)}x`;
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'; // Slightly transparent white
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Special styling for finish zone multiplier
        if (lane.type === 'safe' && multiplier === 4.00) {
          ctx.fillStyle = 'rgba(255, 215, 0, 0.9)'; // Golden color for finish
          ctx.font = 'bold 16px Arial';
        }
        
        // Draw text with outline for better visibility
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.lineWidth = 3;
        ctx.strokeText(
          text,
          manhole.position.x + manhole.width / 2,
          manhole.position.y + manhole.height / 2
        );
        ctx.fillText(
          text,
          manhole.position.x + manhole.width / 2,
          manhole.position.y + manhole.height / 2
        );
      } else if (manhole && manhole.isCollected) {
        // Draw only the coin for collected manholes
        drawManhole(ctx, manhole, state);
      }
    }
  });

  // Draw vehicles after manholes
  state.vehicles.forEach(object => {
    drawObject(ctx, object);
  });

  // Draw player
  if (state.gameOver && state.hitPosition) {
    drawFlattenedPlayer(ctx, state.hitPosition);
  } else {
    const currentLane = state.lanes[state.currentLaneIndex];
    drawPlayer(
      ctx,
      state.player,
      currentLane.type,
      state.balance
    );
  }

  // Draw sign image if in betting state
  if (state.controlState === 'betting' && signImage.complete) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform for UI elements
    const signWidth = 400; // Double the width
    const signHeight = 200; // Double the height
    const signX = (CANVAS_WIDTH - signWidth) / 2;
    const signY = 50;
    ctx.drawImage(signImage, signX, signY, signWidth, signHeight);
    ctx.restore();
  }
  
  // Draw oops image if game over and delayed
  if (state.gameOver && state.hitPosition && state.controlState !== 'betting' && Oops.complete) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform for UI elements
    const oopsWidth = 416;
    const oopsHeight = 305;
    const oopsX = (CANVAS_WIDTH - oopsWidth) / 2;
    const oopsY = 100 - 20; // Move up by 20 pixels
    
    ctx.drawImage(Oops, oopsX, oopsY, oopsWidth, oopsHeight);
    ctx.restore();
  }

  // Restore the original context state
  ctx.restore();
}
