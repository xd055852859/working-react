import { Node, Rect } from '@topology/core';

// 2. 计算图标/图片位置 可省略
export function myShapeDataIconRect(node) {
  // iconRect - 有文字存在时的区域。
 // fullIconRect - 没有文字时的区域。
  node.iconRect = new Rect(0, 0, 0, 0);

}
// 3. 文字位置 可省略
export function myShapeDataTextRect(node) {
  // textRect- 有图片存在时的区域。
  // fullTextRect- 没有图片时的区域。
  node.textRect = new Rect(
    node.rect.x + node.rect.width / 7,
    node.rect.y,
    (node.rect.width * 5) / 7 - 10,
    node.rect.height
  );
  node.fullTextRect = node.textRect;
}