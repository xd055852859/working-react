import React, { useState, useEffect } from 'react';
import './groupTableTreeItem.css';
import Switch from '@material-ui/core/Switch';
import DropMenu from '../../components/common/dropMenu';

import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import rightArrowPng from '../../assets/img/rightArrow.png';
import {
  Folder,
  Link,
  TableChart,
  Gesture,
  InsertDriveFile,
  Description,
  Book,
  RateReviewOutlined,
} from '@material-ui/icons';
import moment from 'moment';
import _ from 'lodash';
interface GroupTableTreeTypeProps {
  targetNodeKey: any;
  addChildrenTask: any;
  typeshow: number;
}

const GroupTableTreeType: React.FC<GroupTableTreeTypeProps> = (props) => {
  const { targetNodeKey, addChildrenTask, typeshow } = props;
  return (
    <div className="groupTableTreeType">
      <div
        className="groupTableTreeItem-item"
        onClick={() => {
          addChildrenTask(targetNodeKey, typeshow === 1 ? 'child' : 'next', 1);
        }}
      >
        <Folder />
        <div className="groupTableTreeItem-title">新建节点</div>
      </div>
      <div
        className="groupTableTreeItem-item"
        onClick={() => {
          addChildrenTask(targetNodeKey, typeshow === 1 ? 'child' : 'next', 6);
        }}
      >
        <RateReviewOutlined />
        <div className="groupTableTreeItem-title">新建任务</div>
      </div>
      <div
        className="groupTableTreeItem-item"
        onClick={() => {
          addChildrenTask(targetNodeKey, typeshow === 1 ? 'child' : 'next', 10);
        }}
      >
        <Description />
        <div className="groupTableTreeItem-title">新建文档</div>
      </div>
      <div
        className="groupTableTreeItem-item"
        onClick={() => {
          addChildrenTask(targetNodeKey, typeshow === 1 ? 'child' : 'next', 11);
        }}
      >
        <Gesture />
        <div className="groupTableTreeItem-title">新建绘图</div>
      </div>
      <div
        className="groupTableTreeItem-item"
        onClick={() => {
          addChildrenTask(targetNodeKey, typeshow === 1 ? 'child' : 'next', 12);
        }}
      >
        <TableChart />
        <div className="groupTableTreeItem-title">新建表格</div>
      </div>
      <div
        className="groupTableTreeItem-item"
        onClick={() => {
          addChildrenTask(targetNodeKey, typeshow === 1 ? 'child' : 'next', 13);
        }}
      >
        <InsertDriveFile />
        <div className="groupTableTreeItem-title">新建MD</div>
      </div>
      <div
        className="groupTableTreeItem-item"
        onClick={() => {
          addChildrenTask(targetNodeKey, typeshow === 1 ? 'child' : 'next', 14);
        }}
      >
        <Link />
        <div className="groupTableTreeItem-title">新建链接</div>
      </div>
      <div
        className="groupTableTreeItem-item"
        onClick={() => {
          addChildrenTask(targetNodeKey, typeshow === 1 ? 'child' : 'next', 15);
        }}
      >
        <Book />
        <div className="groupTableTreeItem-title">新建电子书</div>
      </div>
    </div>
  );
};
GroupTableTreeType.defaultProps = {};
export default GroupTableTreeType;
