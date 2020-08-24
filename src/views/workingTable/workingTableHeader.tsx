import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
} from '@material-ui/core';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { setHeaderIndex } from '../../redux/actions/memberActions';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import './workingTableHeader.css';
import DropMenu from '../../components/common/dropMenu';
import HeaderFilter from '../../components/headerFilter/headerFilter';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '600px',
    },
  })
);
const WorkingTableHeader: React.FC = (prop) => {
  const memberHeaderIndex = useTypedSelector(
    (state) => state.member.memberHeaderIndex
  );

  const dispatch = useDispatch();
  const viewArray: string[] = ['项目', '频道', '项目卡', '频道卡', '日历'];
  const [viewVisible, setViewVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  const [checked, setChecked] = React.useState(['过期', '今天', '已完成']);
  const classes = useStyles();

  const chooseMemberHeader = (headIndex: number) => {
    dispatch(setHeaderIndex(headIndex));
    setViewVisible(false);
  };

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  return (
    <div className="workingTableHeader">
      <div className="view-container">
        <div
          className="view-title"
          onClick={() => {
            setViewVisible(true);
          }}
        >
          {viewArray[memberHeaderIndex]}
        </div>
        <DropMenu
          visible={viewVisible}
          dropStyle={{ width: '200px', height: '300px', top: '88px' }}
          onClose={() => {
            setViewVisible(false);
          }}
        >
          <div
            className="view-info"
            onClick={() => {
              chooseMemberHeader(0);
            }}
          >
            项目
          </div>
          <div
            className="view-info"
            onClick={() => {
              chooseMemberHeader(1);
            }}
          >
            频道
          </div>
          <div
            className="view-info"
            onClick={() => {
              chooseMemberHeader(2);
            }}
          >
            项目卡
          </div>
          <div
            className="view-info"
            onClick={() => {
              chooseMemberHeader(3);
            }}
          >
            频道卡
          </div>
          <div
            className="view-info"
            onClick={() => {
              chooseMemberHeader(4);
            }}
          >
            日历
          </div>
        </DropMenu>
        <div
          className="view-title"
          onClick={() => {
            setFilterVisible(true);
          }}
        >
          筛选
        </div>
        <DropMenu
          visible={filterVisible}
          dropStyle={{ width: '400px', height: '600px', top: '88px' }}
          onClose={() => {
            setFilterVisible(false);
          }}
        >
          <HeaderFilter />
          <div className="filter-item">
            <div className="filter-item-title">状态</div>
            <List>
              {[
                '过期',
                '今天',
                '已完成',
                '计划',
                '未计划',
                '一般卡片',
                '已归档',
              ].map((value) => {
                const labelId = `checkbox-list-label-${value}`;
                return (
                  <ListItem
                    key={value}
                    role={undefined}
                    dense
                    button
                    onClick={handleToggle(value)}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={checked.indexOf(value) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={`${value}`} />
                  </ListItem>
                );
              })}
            </List>
          </div>
        </DropMenu>
      </div>
      <div>
        <div></div>
      </div>
    </div>
  );
};
export default WorkingTableHeader;
