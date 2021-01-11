import React, { useState, useEffect, useRef } from 'react';
import './workingTableLabel.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import {
  getWorkingTableTask,
  setTaskKey,
  setChooseKey,
} from '../../redux/actions/taskActions';
import { changeBatchMusic } from '../../redux/actions/authActions';
import Loading from '../../components/common/loading';
import TaskNav from '../../components/taskNav/taskNav';
// import { setHeaderIndex } from '../../redux/actions/memberActions';
import { setMessage } from '../../redux/actions/commonActions';
import format from '../../components/common/format';
import Task from '../../components/task/task';
// import DropMenu from '../../components/common/dropMenu';
import _ from 'lodash';
import api from '../../services/api';
// import defaultPersonPng from '../../assets/img/defaultPerson.png'
import defaultGroupPng from '../../assets/img/defaultGroup.png';
const WorkingTableLabel: React.FC = (prop) => {
  const user = useTypedSelector((state) => state.auth.user);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const chooseKey = useTypedSelector((state) => state.task.chooseKey);
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
  // const [memberObj, setMemberObj] = useState<any>({});
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
  // useEffect(() => {
  //   dispatch(setHeaderIndex(0));
  // }, [userKey, targetUserKey]);
  let oldPageX = 0;
  let labelScroll = 0;
  useEffect(() => {
    setTaskNumber(
      Math.ceil((document.documentElement.offsetHeight - 128) / 70)
    );
  }, []);
  useEffect(() => {
    if (labelLoadArray) {
      setTaskLoading(false);
    }
  }, [labelLoadArray]);
  useEffect(() => {
    if (workingTaskArray) {
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
          workingTaskArray[index].forEach(
            (taskItem: any, taskIndex: number) => {
              if (taskItem.taskEndDate) {
                if (labelArr[index].indexOf(taskItem.labelKey) !== -1) {
                  if (!labelArray[index][taskItem.labelKey]) {
                    labelArray[index][taskItem.labelKey] = {
                      arr: [],
                      groupObj: item,
                      labelObj:
                        item.labelArray[
                          labelArr[index].indexOf(taskItem.labelKey)
                        ],
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
            }
          );
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
        console.log(labelArray);
        labelArray = labelArray.map((item: any, index: number) => {
          let arr = [];
          for (let key in item) {
            item[key].arr = format
              .formatFilter(item[key].arr, filterObject)
              .filter((arrItem, arrIndex) => {
                return arrItem.show;
              });
            item[key].arrlength =
              item[key].groupObj._key === mainGroupKey &&
              item[key].labelObj &&
              !item[key].labelObj._key
                ? 10000
                : item[key].arr.length;
            labelLoadArray[index] = item[key].arr.filter(
              (taskItem: any, taskIndex: number) => {
                if (taskItem.show) {
                  return taskItem;
                }
              }
            );
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
  //   if (chooseKey) {
  //     dispatch(setTaskKey(chooseKey));
  //     dispatch(setChooseKey(''));
  //   }
  // }, [chooseKey]);
  const sortArr = (arr: object[], item: any) => {
    arr.push(item);
    arr = _.sortBy(arr, ['createTime']).reverse();
    arr = _.sortBy(arr, ['finishPercent']);
    return arr;
  };
  const render = (index: number) => {
    let obj = {
      left: 0,
      top: 0,
    };
    let dom: any = document.getElementById('workingTableLabel' + index);
    if (dom) {
      let height = dom.offsetHeight;
      let width = dom.offsetWidth;
      let ratio = width / height;
      let colIndex: number = index % colNumbers;
      obj.left = colIndex * colWidth;
      // //首行 top为 0，记录每列的高度
      if (index < colNumbers) {
        obj.top = 0;
        colHeight[colIndex] = colWidth / ratio;
        setColHeight(colHeight);
      } else {
        //获取高度的最小值
        let minHeight: any = Math.min.apply(null, colHeight);
        let minIndex: number = parseInt(colHeight.indexOf(minHeight));
        //此图片的 top 为上面图片的高度，left 相等
        obj.top = parseInt(minHeight);
        obj.left = Math.floor(minIndex * colWidth);
        //     //把高度加上去
        colHeight[minIndex] += colWidth / ratio;
      }
      return obj;
    }
  };

  const batchTaskArray = async (arr: any) => {
    let cardKeyArray = arr.map((item: any) => {
      return item._key;
    });
    let batchRes: any = await api.task.batchTaskArray(cardKeyArray);
    if (batchRes.msg === 'OK') {
      dispatch(setMessage(true, '归档成功', 'success'));
      dispatch(changeBatchMusic(true));
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
  const scrollTask = (e: any, index: number) => {
    setTaskLoading(true);
    let newLabelLoadArray = _.cloneDeep(labelLoadArray);
    let taskLength = newLabelLoadArray[index].length;
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let clientHeight = e.target.clientHeight;
    let taskArray = mainLabelArray[index].arr.filter(
      (taskItem: any, taskIndex: number) => {
        if (taskItem.show) {
          return taskItem;
        }
      }
    );
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
      style={{
        display: 'flex',
        overflowX: 'auto',
        height: '100%',
      }}
      ref={workingTableRef}
      onMouseDown={startMove}
      onContextMenu={endMove}
      id="title"
    >
      {taskLoading ? <Loading /> : null}
      {mainLabelArray.map((labelItem: any, labelIndex: number) => {
        if (
          document.getElementById('workingTableLabel' + labelIndex) &&
          labelItem.position.length === 0 &&
          memberHeaderIndex === 4
        ) {
          labelItem.position = render(labelIndex);
        }
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
                : {
                    width: colWidth + 'px',
                    position: 'absolute',
                    top: labelItem.position.top + 'px',
                    left: labelItem.position.left + 'px',
                  }
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
                            <React.Fragment key={'task' + taskIndex}>
                              {taskItem.show ? (
                                <React.Fragment>
                                  <Task
                                    taskItem={taskItem}
                                    taskIndex={0}
                                    taskInfoIndex={labelIndex}
                                    // timeSetStatus={taskIndex > labelItem.arr.length - 3}
                                    // myState={labelItem.groupObj._key === mainGroupKey}
                                  />
                                </React.Fragment>
                              ) : null}
                            </React.Fragment>
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
