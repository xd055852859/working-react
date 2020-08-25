import React, { useState, useEffect } from 'react';
import { Checkbox } from '@material-ui/core';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { setHeaderIndex } from '../../redux/actions/memberActions';
import { setFilterObject } from '../../redux/actions/taskActions';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import tablePng from '../../assets/img/table.png';
import './workingTableHeader.css';
import DropMenu from '../../components/common/dropMenu';
import HeaderFilter from '../../components/headerFilter/headerFilter';
import labelPng from '../../assets/img/label.png';
import labelTabPng from '../../assets/img/labelTab.png';
import groupPng from '../../assets/img/group.png';
import groupTabPng from '../../assets/img/groupTab.png';
import calendarPng from '../../assets/img/calendar.png';
import labelbPng from '../../assets/img/labelb.png';
import labelTabbPng from '../../assets/img/labelTabb.png';
import groupbPng from '../../assets/img/groupb.png';
import groupTabbPng from '../../assets/img/groupTabb.png';
import calendarbPng from '../../assets/img/calendarb.png';
import filterPng from '../../assets/img/filter.png';
import { Console } from 'console';
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
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const filterObject = useTypedSelector((state) => state.task.filterObject);

  const dispatch = useDispatch();
  const viewArray: string[] = ['项目', '频道', '项目卡', '频道卡', '日历'];
  const viewImg: string[] = [
    labelPng,
    groupPng,
    labelTabPng,
    groupTabPng,
    calendarPng,
  ];
  const viewImgb: string[] = [
    labelbPng,
    groupbPng,
    labelTabbPng,
    groupTabbPng,
    calendarbPng,
  ];
  const checkedTitle = [
    '过期',
    '今天',
    '已完成',
    '计划',
    '未计划',
    '一般卡片',
    '已归档',
  ];
  const [viewVisible, setViewVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterCheckedArray, setFilterCheckedArray] = useState<any>([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const [checked, setChecked] = React.useState(['过期', '今天', '已完成']);
  const classes = useStyles();

  const chooseMemberHeader = (headIndex: number) => {
    dispatch(setHeaderIndex(headIndex));
    setViewVisible(false);
  };
  useEffect(() => {
    let filterCheckedArray: any = [];
    if (filterObject.filterType.length > 0) {
      filterCheckedArray = checkedTitle.map((item: any) => {
        return filterObject.filterType.indexOf(item) != -1;
      });
    }
    console.log('filterCheckedArray', filterCheckedArray);
    setFilterCheckedArray(filterCheckedArray);
  }, [filterObject]);
  useEffect(() => {
    dispatch(
      setFilterObject({
        groupKey: null,
        creatorKey: null,
        executorKey: null,
        filterType: ['过期', '今天', '已完成'],
      })
    );
  }, [headerIndex]);
  const changeFilterCheck = (filterTypeText: string) => {
    let filterType = filterObject.filterType;
    let fikterIndex = filterType.indexOf(filterTypeText);
    if (fikterIndex == -1) {
      filterType.push(filterTypeText);
    } else {
      filterType.splice(fikterIndex, 1);
    }
    dispatch(setFilterObject({ filterType: filterType }));
  };
  return (
    <div className="workingTableHeader">
      <div className="workingTableHeader-logo">
        <img src={tablePng} alt="" />
        工作台
      </div>
      <div className="workingTableHeader-line">|</div>
      <div className="view-container">
        <div
          className="workingTableHeader-logo"
          style={{ width: '108px' }}
          onClick={() => {
            setViewVisible(true);
          }}
        >
          <img src={viewImg[memberHeaderIndex]} alt=""></img>
          {viewArray[memberHeaderIndex]}
        </div>
        <DropMenu
          visible={viewVisible}
          dropStyle={{
            width: '180px',
            top: '60px',
            color: '#333',
          }}
          onClose={() => {
            setViewVisible(false);
          }}
          title={'视图切换'}
        >
          {viewArray.map((viewItem, viewIndex) => {
            return (
              <div
                className="viewTableHeader-logo"
                onClick={() => {
                  chooseMemberHeader(viewIndex);
                }}
                key={'viewTable' + viewIndex}
              >
                <img src={viewImgb[viewIndex]} alt=""></img>
                {viewItem}
              </div>
            );
          })}
        </DropMenu>
        <div
          className="workingTableHeader-logo"
          onClick={() => {
            setFilterVisible(true);
          }}
        >
          <img src={filterPng} alt="" />
        </div>
        <DropMenu
          visible={filterVisible}
          dropStyle={{
            width: '328px',
            top: '60px',
            left: '108px',
            color: '#333',
          }}
          onClose={() => {
            setFilterVisible(false);
          }}
          title={'过滤器'}
        >
          <HeaderFilter />
          <div className="filter-info">
            <div className="filter-title">状态</div>
            <div className="filter-menu">
              {checkedTitle.map((item: any, index: number) => {
                return (
                  <div key={'filter' + item} className="filter-menu-item">
                    <Checkbox
                      checked={filterCheckedArray[index]}
                      onChange={() => {
                        changeFilterCheck(item);
                      }}
                    />
                    {item}
                  </div>
                );
              })}
            </div>
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
