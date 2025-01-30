import { Position } from '../types';
import { PLAYER_SIZE } from '../constants';
import { chickenIcon, flatChickenIcon } from '../assets';
import { drawChatBubble } from './chatBubble';

export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  position: Position,
  currentLaneType: string,
  balance: number
) {
  if (chickenIcon.complete) {
    ctx.drawImage(
      chickenIcon,
      position.x,
      position.y,
      PLAYER_SIZE,
      PLAYER_SIZE
    );
    
    // Draw chat bubble only when on highway lanes
    if (currentLaneType === 'highway' && balance > 0) {
      drawChatBubble(ctx, position.x, position.y, balance);
    }
  }
}

export function drawFlattenedPlayer(ctx: CanvasRenderingContext2D, position: Position) {
  if (flatChickenIcon.complete) {
    ctx.drawImage(
      flatChickenIcon,
      position.x - 11,  // Adjust position to center the wider image
      position.y + 10,  // Move down slightly to align with impact point
      62,              // Fixed width as requested
      76               // Fixed height as requested
    );
  }
}
