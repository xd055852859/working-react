import React, { useState, useEffect, useRef } from 'react';
import './workingTableLabel.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import _ from 'lodash';
import api from '../../services/api';

import { useDispatch } from 'react-redux';
import { getWorkingTableTask } from '../../redux/actions/taskActions';
import { changeMusic } from '../../redux/actions/authActions';
import { setMessage } from '../../redux/actions/commonActions';

import format from '../../components/common/format';
import Loading from '../../components/common/loading';
import TaskNav from '../../components/taskNav/taskNav';
import Task from '../../components/task/task';
import usePrevious from '../../hook/usePrevious';

import defaultGroupPng from '../../assets/img/defaultGroup.png';
const WorkingTableLabel: React.FC = (prop) => {
  const user = useTypedSelector((state) => state.auth.user);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const filterObject = useTypedSelector((state) => state.task.filterObject);
  const memberHeaderIndex = useTypedSelector(
    (state) => state.member.memberHeaderIndex
  );
  const workingGroupArray = useTypedSelector(
    (state) => state.task.workingGroupArray
  );
  const workingTaskArray = useTypedSelector(
    (state) => state.task.workingTaskArray
  );
  const [mainLabelArray, setMainLabelArray] = useState<any>([]);
  const [colWidth, setColWidth] = useState(0);
  const [colNumbers, setColNumbers] = useState(4);
  const [colHeight, setColHeight] = useState<any>([]);
  const [taskNumber, setTaskNumber] = useState(10);
  const [taskLoading, setTaskLoading] = useState(false);
  const [labelLoadArray, setLabelLoadArray] = useState<any>([]);
  const [chooseLabelKey, setChooseLabelKey] = useState('');
  const workingTableRef: React.RefObject<any> = useRef();
  const dispatch = useDispatch();
  let oldPageX = 0;
  let labelScroll = 0;
  useEffect(() => {
    if (labelLoadArray) {
      setTaskLoading(false);
    }
  }, [labelLoadArray]);

  useEffect(() => {
    if (workingTaskArray) {
      getData(workingTaskArray, workingGroupArray);
    }
  }, [workingTaskArray, workingGroupArray]);

  const prevFilterObject: any = usePrevious(_.cloneDeep(filterObject));
  useEffect(() => {
    if (
      workingTaskArray &&
      prevFilterObject &&
      !_.isEqual(prevFilterObject, filterObject)
    ) {
      getData(workingTaskArray, workingGroupArray);
    }
  }, [workingTaskArray, workingGroupArray, filterObject]);

  useEffect(() => {
    setTaskNumber(
      Math.ceil((document.documentElement.offsetHeight - 128) / 70)
    );
    let clientWidth = workingTableRef.current.offsetWidth;
    // if (clientWidth < 600) {
    //   setColNumbers(1);
    // } else if (clientWidth >= 600 && clientWidth <= 900) {
    //   setColNumbers(2);
    // } else if (clientWidth > 900 && clientWidth <= 1080) {
    //   setColNumbers(3);
    // } else {
    //   setColNumbers(4);
    // }
    setColWidth(Math.floor(clientWidth / colNumbers));
  }, []);
  const getData = (workingTaskArray, workingGroupArray) => {
    setMainLabelArray([]);
    let labelArray: any = [];
    let labelArr: any = [];
    let labelLoadArray: any = [];
    if (workingGroupArray.length > 0 && workingTaskArray.length > 0) {
      workingGroupArray.forEach((item: any, index: number) => {
        labelArr[index] = item.labelArray.map(
          (labelItem: any) => labelItem._key
        );
      });
      workingGroupArray.forEach((item: any, index: number) => {
        labelArray[index] = {};
        workingTaskArray[index].forEach((taskItem: any, taskIndex: number) => {
          if (taskItem.taskEndDate) {
            if (labelArr[index].indexOf(taskItem.labelKey) !== -1) {
              if (!labelArray[index][taskItem.labelKey]) {
                labelArray[index][taskItem.labelKey] = {
                  arr: [],
                  groupObj: item,
                  labelObj:
                    item.labelArray[labelArr[index].indexOf(taskItem.labelKey)],
                  position: [],
                };
              }
              labelArray[index][taskItem.labelKey].arr = sortArr(
                labelArray[index][taskItem.labelKey].arr,
                taskItem
              );
            } else {
              if (!labelArray[index]['ToDo' + index]) {
                labelArray[index]['ToDo' + index] = {
                  arr: [],
                  groupObj: item,
                  labelObj: {
                    groupKey: item._key,
                    cardLabelName: 'ToDo',
                  },
                  position: [],
                };
              }
              labelArray[index]['ToDo' + index].arr = sortArr(
                labelArray[index]['ToDo' + index].arr,
                taskItem
              );
            }
          }
        });
      });
      workingGroupArray[0].labelArray.forEach((item: any, index: number) => {
        if (
          Object.keys(labelArray[0])[Object.keys(labelArray[0]).length - 1] !=
          'null'
        ) {
          labelArray[0]['null'] = {
            arr: [],
            groupObj: workingGroupArray[0],
            labelObj: {
              groupKey: item.groupKey,
              cardLabelName: 'ToDo',
            },
            position: [],
          };
        } else if (
          Object.keys(labelArray[0]).indexOf(item._key) === -1 &&
          item._key
        ) {
          labelArray[0][item._key] = {
            arr: [],
            groupObj: workingGroupArray[0],
            labelObj: item,
            position: [],
          };
        }
      });
      labelArray = labelArray.map((item: any, index: number) => {
        let arr = [];
        for (let key in item) {
          item[key].arr = format.formatFilter(item[key].arr, filterObject);
          // .filter((arrItem, arrIndex) => {
          //   return arrItem.show;
          // });
          item[key].arrlength =
            item[key].groupObj._key === mainGroupKey &&
            item[key].labelObj &&
            !item[key].labelObj._key
              ? 10000
              : item[key].arr.length;
          labelLoadArray[index] = item[key].arr;
          // .filter(
          //   (taskItem: any, taskIndex: number) => {
          // if (taskItem.show) {
          // return taskItem;
          // }
          // }
          // );
        }
        return Object.values(item);
      });
      labelArray = _.sortBy(_.flatten(labelArray), ['arrlength']).reverse();
      labelArray.forEach((item: any, index: number) => {
        labelLoadArray[index] = item.arr.slice(0, taskNumber + 1);
      });
      setLabelLoadArray(labelLoadArray);
      setMainLabelArray(labelArray);
    }
  };
  const sortArr = (arr: object[], item: any) => {
    arr.push(item);
    arr = _.sortBy(arr, ['createTime']).reverse();
    arr = _.sortBy(arr, ['finishPercent']);
    return arr;
  };
  const batchTaskArray = async (arr: any) => {
    let cardKeyArray = arr.map((item: any) => {
      return item._key;
    });
    let batchRes: any = await api.task.batchTaskArray(cardKeyArray);
    if (batchRes.msg === 'OK') {
      dispatch(setMessage(true, '归档成功', 'success'));
      dispatch(changeMusic(4));
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
      }
    }
  };
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
  const scrollTask = (e: any, index: number) => {
    setTaskLoading(true);
    let newLabelLoadArray = _.cloneDeep(labelLoadArray);
    let taskLength = newLabelLoadArray[index].length;
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let clientHeight = e.target.clientHeight;
    let taskArray = mainLabelArray[index].arr;
    // .filter(
    //   (taskItem: any, taskIndex: number) => {
    // if (taskItem.show) {
    // return taskItem;
    // }
    //   }
    // );
    if (
      clientHeight + scrollTop + 1 >= scrollHeight &&
      taskLength < taskArray.length
    ) {
      newLabelLoadArray[index].push(
        ...taskArray.slice(taskLength, taskLength + taskNumber)
      );
      setLabelLoadArray(newLabelLoadArray);
    } else {
      setTaskLoading(false);
    }
  };
  return (
    <div
      className="workingTableLabel-container"
      style={
        memberHeaderIndex === 0
          ? {
              display: 'flex',
              overflowX: 'auto',
              height: '100%',
            }
          : {
              columnCount: colNumbers,
              /* Firefox */
              columnGap: '5px',
              width: '100%',
              overflowY: 'auto',
            }
      }
      ref={workingTableRef}
      onMouseDown={startMove}
      onContextMenu={endMove}
      id="title"
    >
      {taskLoading ? <Loading /> : null}
      <div
        style={{ marginTop: '0px' }}
        className="workingTableLabel-container-item"
      ></div>
      {mainLabelArray.map((labelItem: any, labelIndex: number) => {
        return (
          <div
            key={'label' + labelIndex}
            className="workingTableLabel-container-item"
            style={
              memberHeaderIndex === 0
                ? {
                    width: '350px',
                    height: '100%',
                    flexShrink: 0,
                  }
                : { height: '100%' }
            }
            id={'workingTableLabel' + labelIndex}
          >
            <div
              className="workingTableLabel-info"
              style={
                memberHeaderIndex === 0
                  ? {
                      width: '350px',
                    }
                  : {
                      width: '100%',
                      padding: '0px 5px',
                      boxSizing: 'border-box',
                    }
              }
            >
              <div className="workingTableLabel-info-labelInfo">
                <TaskNav
                  avatar={
                    labelItem.groupObj && labelItem.groupObj.groupLogo
                      ? labelItem.groupObj.groupLogo
                      : labelItem.groupObj._key === mainGroupKey
                      ? user.profile.avatar
                      : defaultGroupPng
                  }
                  name={
                    labelItem.groupObj.groupName +
                    ' / ' +
                    (labelItem.labelObj
                      ? labelItem.labelObj.cardLabelName
                        ? labelItem.labelObj.cardLabelName
                        : 'ToDo'
                      : '无标题')
                  }
                  role={labelItem.groupObj.groupRole}
                  colorIndex={labelIndex}
                  taskNavArray={[labelItem.groupObj, labelItem.labelObj]}
                  taskNavWidth={memberHeaderIndex === 0 ? '350px' : '100%'}
                  chooseLabelKey={chooseLabelKey}
                  setChooseLabelKey={setChooseLabelKey}
                  batchTaskArray={() => {
                    batchTaskArray(labelItem.arr);
                  }}
                  taskNavTask={labelItem.arr}
                />
                <div
                  style={memberHeaderIndex === 0 ? { overflowY: 'auto' } : {}}
                  className="workingTableLabel-info-item-label-container"
                  onScroll={(e) => {
                    if (memberHeaderIndex === 0) {
                      scrollTask(e, labelIndex);
                    }
                  }}
                >
                  {labelLoadArray[labelIndex]
                    ? labelLoadArray[labelIndex].map(
                        (taskItem: any, taskIndex: number) => {
                          return (
                            <Task
                              key={'task' + taskIndex}
                              taskItem={taskItem}
                              taskIndex={0}
                              taskInfoIndex={labelIndex}
                            />
                          );
                        }
                      )
                    : null}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default WorkingTableLabel;
