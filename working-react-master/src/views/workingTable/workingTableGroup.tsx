import React, { useState, useRef, useEffect } from 'react';
import './workingTableLabel.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import api from '../../services/api';
import _ from 'lodash';
import format from '../../components/common/format';
import { changeBatchMusic } from '../../redux/actions/authActions';
import { getWorkingTableTask } from '../../redux/actions/taskActions';
import { setMessage } from '../../redux/actions/commonActions';

import Task from '../../components/task/task';
import TaskNav from '../../components/taskNav/taskNav';

import defaultGroupPng from '../../assets/img/defaultGroup.png';
const WorkingTableGroup: React.FC = (prop) => {
  const user = useTypedSelector((state) => state.auth.user);
  const memberHeaderIndex = useTypedSelector(
    (state) => state.member.memberHeaderIndex
  );
  const workingGroupArray = useTypedSelector(
    (state) => state.task.workingGroupArray
  );
  const workingTaskArray = useTypedSelector(
    (state) => state.task.workingTaskArray
  );
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const filterObject = useTypedSelector((state) => state.task.filterObject);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const [mainGroupArray, setMainGroupArray] = useState<any>([]);
  const [chooseLabelKey, setChooseLabelKey] = useState('');
  const dispatch = useDispatch();
  const [colWidth, setColWidth] = useState(0);
  const [colNumbers, setColNumbers] = useState(4);
  const [colHeight, setColHeight] = useState<any>([]);
  const [positionGroupArray, setPositionGroupArray] = useState<any>([]);
  const workingTableRef: React.RefObject<any> = useRef();
  let oldPageX = 0;
  let labelScroll = 0;
  useEffect(() => {
    if (user && user._key && !workingTaskArray && headerIndex === 1) {
      dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2, 10]));
    }
    if (targetUserInfo && targetUserInfo._key && headerIndex === 2) {
      dispatch(
        getWorkingTableTask(
          user._key === targetUserInfo._key ? 4 : 2,
          targetUserInfo._key,
          1,
          [0, 1, 2, 10]
        )
      );
    }
  }, [user, targetUserInfo]);
  useEffect(() => {
    if (workingTaskArray) {
      let arr: any = [];
      let groupArray: any = [];
      if (workingGroupArray.length > 0 && workingTaskArray.length > 0) {
        workingTaskArray.forEach((item: any, index: number) => {
          arr[index] = { groupObj: workingGroupArray[index], position: [] };
          item.forEach((groupItem: any, groupIndex: number) => {
            if (groupItem.taskEndDate) {
              if (groupItem.labelKey) {
                if (!arr[index][groupItem.labelKey]) {
                  let labelIndex = _.findIndex(
                    workingGroupArray[index].labelArray,
                    {
                      _key: groupItem.labelKey,
                    }
                  );
                  arr[index][groupItem.labelKey] = {
                    arr: [],
                    labelObj: workingGroupArray[index].labelArray[labelIndex],
                  };
                }
                arr[index][groupItem.labelKey].arr = sortArr(
                  arr[index][groupItem.labelKey].arr,
                  groupItem
                );
              } else {
                if (!arr[index]['ToDo']) {
                  arr[index]['ToDo'] = {
                    arr: [],
                    labelObj: { cardLabelName: 'ToDo' },
                  };
                }
                arr[index]['ToDo'].arr = sortArr(
                  arr[index]['ToDo'].arr,
                  groupItem
                );
              }
            }
          });
        });
        // workingGroupArray[0].labelArray.forEach((item: any) => {
        //   if (Object.keys(arr[0]).indexOf(item._key) === -1) {
        //     arr[0][item._key] = {
        //       arr: [],
        //       labelObj: item,
        //     };
        //   }
        // });
        groupArray = arr;
        groupArray = groupArray.map((item: any) => {
          item.arrlength = 0;
          for (let key in item) {
            if (
              key !== 'groupObj' &&
              key !== 'position' &&
              key !== 'arrlength'
            ) {
              item[key].arr = format
                .formatFilter(item[key].arr, filterObject)
                .filter((arrItem, arrIndex) => {
                  return arrItem.show;
                });
              item.arrlength =
                item.groupObj._key === mainGroupKey
                  ? 10000
                  : item.arrlength + item[key].arr.length;
            }
          }
          return item;
        });
        groupArray = _.sortBy(groupArray, ['arrlength']).reverse();
        setMainGroupArray(groupArray);
      }
    }
  }, [workingTaskArray, workingGroupArray]);
  useEffect(() => {
    let clientWidth = workingTableRef.current.clientWidth;
    if (clientWidth < 600) {
      setColNumbers(1);
    } else if (clientWidth >= 600 && clientWidth <= 900) {
      setColNumbers(2);
    } else if (clientWidth > 900 && clientWidth <= 1080) {
      setColNumbers(3);
    } else {
      setColNumbers(4);
    }
    setColWidth(Math.floor(clientWidth / colNumbers));
  }, [workingTableRef.current]);
  // useEffect(() => {
  //   let groupArray = _.cloneDeep(positionGroupArray);
  //   if (memberHeaderIndex === 5 && positionGroupArray.length > 0) {
  //     groupArray = positionGroupArray.filter((item: any, index: number) => {
  //       if (item.arrlength > 0) {
  //         item.position = render(index);
  //         return item;
  //       }
  //     });
  //   }
  //   setMainGroupArray(groupArray);
  // }, [positionGroupArray]);
  const sortArr = (arr: object[], item: any) => {
    arr.push(item);
    arr = _.sortBy(arr, ['createTime']).reverse();
    // arr = _.sortBy(arr, ['createTime']).reverse();
    arr = _.sortBy(arr, ['finishPercent']);
    return arr;
  };
  const render = (index: number) => {
    let obj = {
      left: 0,
      top: 0,
    };
    let dom: any = document.getElementById('workingTableGroup' + index);
    if (dom) {
      let height = dom.offsetHeight;
      let width = dom.offsetWidth;
      let ratio = width / height;
      let colIndex: number = index % colNumbers;
      obj.left = colIndex * colWidth;
      //  首行 top为 0，记录每列的高度
      if (index < colNumbers) {
        obj.top = 0;
        colHeight[colIndex] = colWidth / ratio;
        setColHeight(colHeight);
      } else {
        // 获取高度的最小值
        let minHeight: any = Math.min.apply(null, colHeight);
        let minIndex: number = parseInt(colHeight.indexOf(minHeight));
        // 此图片的 top 为上面图片的高度，left 相等
        obj.top = parseInt(minHeight);
        obj.left = Math.floor(minIndex * colWidth);
        //  把高度加上去
        colHeight[minIndex] += colWidth / ratio;
      }
      return obj;
    }
  };
  const getGroupItem = (item: any, index: number) => {
    let dom: any = [];
    for (let key in item) {
      let groupItem = item[key];
      let groupIndex = key;
      dom.push(
        <div style={{ marginBottom: '2px' }} key={'groupItem' + groupIndex}>
          {groupItem.labelObj ? (
            <React.Fragment>
              {groupIndex !== 'groupObj' && groupIndex !== 'position' ? (
                <React.Fragment>
                  <TaskNav
                    name={
                      groupItem.labelObj
                        ? groupItem.labelObj.cardLabelName
                        : '无标题'
                    }
                    role={item.groupObj.groupRole}
                    colorIndex={index}
                    taskNavArray={[item.groupObj, groupItem.labelObj]}
                    taskNavWidth={memberHeaderIndex === 1 ? '350px' : '100%'}
                    chooseLabelKey={chooseLabelKey}
                    setChooseLabelKey={setChooseLabelKey}
                    batchTaskArray={() => {
                      batchTaskArray(groupItem.arr);
                    }}
                    taskNavTask={groupItem.arr}
                  />

                  <div className="workingTableLabel-info-item">
                    {groupItem.arr.map((taskItem: any, taskIndex: number) => {
                      return (
                        <React.Fragment key={'task' + taskIndex}>
                          {taskItem.show ? (
                            <Task
                              taskItem={taskItem}
                              // timeSetStatus={taskIndex > groupItem.arr.length - 3}
                              // myState={item.groupObj._key === mainGroupKey}
                              taskIndex={index}
                            />
                          ) : null}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </React.Fragment>
              ) : null}
            </React.Fragment>
          ) : null}
        </div>
      );
    }
    return dom;
  };
  const batchTaskArray = async (arr: any) => {
    let cardKeyArray = arr.map((item: any) => {
      return item._key;
    });
    let batchRes: any = await api.task.batchTaskArray(cardKeyArray);
    if (batchRes.msg === 'OK') {
      dispatch(changeBatchMusic(true));
      dispatch(setMessage(true, '归档成功', 'success'));
      if (headerIndex === 1) {
        dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2, 10]));
      } else if (headerIndex === 2) {
        dispatch(
          getWorkingTableTask(
            user._key === targetUserInfo._key ? 4 : 2,
            targetUserInfo._key,
            1,
            [0, 1, 2, 10]
          )
        );
      }
    } else {
      dispatch(setMessage(true, batchRes.msg, 'error'));
    }
  };
  const startMove = (e: any) => {
    if (e.button === 2 && workingTableRef.current) {
      if (workingTableRef.current) {
        oldPageX = e.pageX;
        // workingTableRef.current.addEventListener(
        //   'mousemove',
        //   moveContent,
        //   true
        // );
      }
    }
  };
  // const moveContent = (e: any) => {
  //   // workingTableRef.current.scrollTo(0, 0);
  //   // setOldPage(e.pageX);

  //   oldPageX = e.pageX;
  // };
  const endMove = (e: any) => {
    if (workingTableRef.current) {
      if (e.pageX > oldPageX) {
        labelScroll = labelScroll - (e.pageX - oldPageX);
      } else if (e.pageX < oldPageX) {
        labelScroll = labelScroll + (oldPageX - e.pageX);
      }
      workingTableRef.current.scrollTo(labelScroll, 0);
    }
  };
  return (
    <div
      className="workingTableLabel-container"
      style={{ display: 'flex', overflowX: 'auto', height: '100%' }}
      ref={workingTableRef}
      onMouseDown={startMove}
      onContextMenu={endMove}
    >
      {mainGroupArray.map((item: any, index: number) => {
        if (
          document.getElementById('workingTableGroup' + index) &&
          item.position.length === 0 &&
          memberHeaderIndex === 5
        ) {
          item.position = render(index);
        }
        return (
          <div key={'mainGroup' + index}>
            {/* {item.arrlength > 0 ? ( */}
            <div
              className="workingTableLabel-container-item"
              style={
                memberHeaderIndex === 1
                  ? {
                      width: '350px',
                      height: '100%',
                      flexShrink: 0,
                    }
                  : {
                      width: colWidth + 'px',
                      position: 'absolute',
                      top: item.position.top + 'px',
                      left: item.position.left + 'px',
                    }
              }
              key={'group' + index}
              id={'workingTableGroup' + index}
            >
              <div
                className="workingTableLabel-info"
                style={
                  memberHeaderIndex === 1
                    ? { width: '350px' }
                    : { width: '100%' }
                }
              >
                <div className="workingTableLabel-info-groupName">
                  {/* onClick={toGroup(item.groupObj)} */}
                  <div className="workingTableLabel-info-groupLogo"  style={{borderRadius:'5px'}}>
                    <img
                      src={
                        item.groupObj.groupLogo
                          ? item.groupObj.groupLogo +
                            '?imageMogr2/auto-orient/thumbnail/80x'
                          : defaultGroupPng
                      }
                    />
                  </div>
                  <div style={{ color: '#fff' }}>{item.groupObj.groupName}</div>
                </div>
                <div
                  style={memberHeaderIndex === 1 ? { overflowY: 'auto' } : {}}
                  className="workingTableLabel-info-item-group-container"
                >
                  {getGroupItem(item, index)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default WorkingTableGroup;