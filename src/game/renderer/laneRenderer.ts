import { LaneType } from '../constants';

export function drawLane(
  ctx: CanvasRenderingContext2D,
  x: number,
  width: number,
  height: number,
  type: LaneType
) {
  switch (type) {
    case 'safe':
      ctx.fillStyle = '#90EE90';  // Light green for safe zones
      ctx.fillRect(x, 0, width, height);
      break;
    case 'curb':
      ctx.fillStyle = '#CCCCCC';  // Light gray for curbs
      ctx.fillRect(x, 0, width, height);
      break;
    case 'highway':
      // Draw road
      ctx.fillStyle = '#333333';
      ctx.fillRect(x, 0, width, height);
      
      // Draw lane markers
      ctx.setLineDash([20, 20]);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + width, 0);
      ctx.lineTo(x + width, height);
      ctx.stroke();
      ctx.setLineDash([]);
      break;
  }
}
