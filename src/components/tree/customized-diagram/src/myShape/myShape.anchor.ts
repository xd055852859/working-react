import { Point, Node, Direction } from '@topology/core';

// 计算锚点
export function myShapeDataAnchors(node: Node) {
  node.anchors.push(new Point(node.rect.x + node.rect.width / 14, node.rect.y + node.rect.height / 2, Direction.Left));
  node.anchors.push(new Point(node.rect.x + (node.rect.width * 4) / 7, node.rect.y, Direction.Up));
  node.anchors.push(
    new Point(node.rect.x + (node.rect.width * 13) / 14, node.rect.y + node.rect.height / 2, Direction.Right)
  );

  node.anchors.push(new Point(node.rect.x + (node.rect.width * 3) / 7, node.rect.ey, Direction.Bottom));
  node.anchors.push(new Point(node.rect.x + node.rect.width, node.rect.y, Direction.Right));
  node.anchors.push(new Point(node.rect.x, node.rect.y + node.rect.height, Direction.Bottom));


}