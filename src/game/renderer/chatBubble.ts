export function drawChatBubble(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  amount: number
) {
  const bubbleWidth = 80;
  const bubbleHeight = 30;
  const arrowHeight = 8;
  const cornerRadius = 4;
  
  // Position bubble above chicken
  const bubbleX = x - bubbleWidth / 2 + 30; // Center above chicken
  const bubbleY = y - bubbleHeight - arrowHeight - 10; // Above chicken with spacing
  
  // Draw bubble background
  ctx.beginPath();
  ctx.moveTo(bubbleX + cornerRadius, bubbleY);
  ctx.lineTo(bubbleX + bubbleWidth - cornerRadius, bubbleY);
  ctx.quadraticCurveTo(bubbleX + bubbleWidth, bubbleY, bubbleX + bubbleWidth, bubbleY + cornerRadius);
  ctx.lineTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight - cornerRadius);
  ctx.quadraticCurveTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight, bubbleX + bubbleWidth - cornerRadius, bubbleY + bubbleHeight);
  
  // Draw arrow
  ctx.lineTo(bubbleX + bubbleWidth / 2 + 10, bubbleY + bubbleHeight);
  ctx.lineTo(bubbleX + bubbleWidth / 2, bubbleY + bubbleHeight + arrowHeight);
  ctx.lineTo(bubbleX + bubbleWidth / 2 - 10, bubbleY + bubbleHeight);
  
  ctx.lineTo(bubbleX + cornerRadius, bubbleY + bubbleHeight);
  ctx.quadraticCurveTo(bubbleX, bubbleY + bubbleHeight, bubbleX, bubbleY + bubbleHeight - cornerRadius);
  ctx.lineTo(bubbleX, bubbleY + cornerRadius);
  ctx.quadraticCurveTo(bubbleX, bubbleY, bubbleX + cornerRadius, bubbleY);
  
  // Fill bubble
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fill();
  
  // Add subtle glow
  ctx.shadowColor = 'rgba(0, 255, 255, 0.3)';
  ctx.shadowBlur = 8;
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.shadowBlur = 0;
  
  // Draw text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    `$${amount.toFixed(2)}`,
    bubbleX + bubbleWidth / 2,
    bubbleY + bubbleHeight / 2
  );
}
