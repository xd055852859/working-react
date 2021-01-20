import { registerNode } from '@topology/core';

import {myShapeData,myShapeDataAnchors,myShapeDataIconRect,myShapeDataTextRect} from './myShape'

export function register() {
    // 注册node , 
    registerNode('myShape',myShapeData,myShapeDataAnchors,myShapeDataIconRect,myShapeDataTextRect)
}