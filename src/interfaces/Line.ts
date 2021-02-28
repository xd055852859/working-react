import { Line } from "@topology/core";

export enum LineType {
  // 线形
  "curve" = "贝塞尔曲线",
  "polyline" = "折线",
  "line" = "直线",
  "mind" = "脑图曲线",
}

export enum ArrowType {
  //箭头类型
  "null"= "无箭头",
  "triangleSolid" = "实心三角形",
  "triangle" = "空心三角形",
  "diamondSolid" = "实心菱形",
  "diamond" = "空心菱形",
  "circleSolid" = "实心圆",
  "circle" = "空心圆",
  "line" = "线型箭头",
  "lineUp" = "上单边线箭头",
  "lineDown" = "下单边线箭头",
}
export enum DashType {
  "实线",
  "虚线",
  "长虚线",
  "点划线",
}

 export interface FontProps {
  background?: string; //背景
  color?: string; // 颜色
  fontFamily?: string; //字体家族
  fontSize?: number; // 字体大小
  fontStyle?: 'normal' | 'italic'; // 是否斜体
  fontWeight?: 'bold' | 'normal'; // 文本粗细
  lineHeight?: number; //行高
  textAlign?: 'center' | 'left' | 'right'; // 水平对齐
  textBaseline?: 'top' | 'middle' | 'bottom'; //垂直对齐
}

export interface LineProps extends Partial<Line> {
  lineWidth?: number; //线宽
  fromArrow?: string; //
  toArrow?: string;
  fromArrowSize?: number;
  toArrowSize?: number;
  fromArrowColor?: string;
  toArrowColor?: string;
  strokeStyle?: string; //线条颜色
  dash?: number;
  name?: string;
}

export interface layoutType {
  maxWidth: number;
  nodeWidth: number;
  nodeHeight: number;
  maxCount: number;
  spaceWidth: number;
  spaceHeight: number;
}