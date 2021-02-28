import { Node } from '@topology/core';

// 1. 绘制形状
export function myShapeData(ctx, node) {
  ctx.beginPath();
  const offsetX = node.rect.width / 7;
  ctx.moveTo(node.rect.x + offsetX, node.rect.y);
  ctx.lineTo(node.rect.ex, node.rect.y);
  ctx.lineTo(node.rect.x + node.rect.width - offsetX, node.rect.ey);
  ctx.lineTo(node.rect.x, node.rect.ey);
  ctx.closePath();
  ctx.moveTo(node.rect.x + offsetX+10, node.rect.y+10);
  ctx.lineTo(node.rect.ex-10, node.rect.y+10);
  ctx.lineTo(node.rect.x + node.rect.width - offsetX -10, node.rect.ey -10);
  ctx.lineTo(node.rect.x+10, node.rect.ey-10);
  ctx.closePath();
  (node.fillStyle || node.bkType) && ctx.fill();
  ctx.stroke();
}