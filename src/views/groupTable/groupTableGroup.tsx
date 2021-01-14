import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import _ from 'lodash';
import format from '../../components/common/format';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { TextField, Button, IconButton } from '@material-ui/core';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import {
  getGroupTask,
  setChooseKey,
  setTaskKey,
} from '../../redux/actions/taskActions';
import {
  changeBatchMusic,
  changeCreateMusic,
} from '../../redux/actions/authActions';
// import { getGroupInfo } from '../../redux/actions/groupActions';
// import { getTheme } from '../../redux/actions/authActions';
import { setMessage } from '../../redux/actions/commonActions';
import './groupTableGroup.css';
import api from '../../services/api';
import Task from '../../components/task/task';
import TaskNav from '../../components/taskNav/taskNav';
import DropMenu from '../../components/common/dropMenu';
import Dialog from '../../components/common/dialog';
import defaultPerson from '../../assets/img/defaultPerson.png';
import taskAddPng from '../../assets/img/contact-add.png';
import urlSvg from '../../assets/svg/url.svg';
import Loading from '../../components/common/loading';
// const taskRef: React.RefObject<any> = useRef();
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      '& .MuiInput-formControl': {
        marginTop: '0px',
      },
      '& .MuiOutlinedInput-input': {
        padding: '10px 14px',
      },
      '& .MuiInputLabel-formControl': {
        marginTop: '-10px',
      },
    },
  })
);
const GroupTableGroup: React.FC = (prop) => {
  const classes = useStyles();
  const user = useTypedSelector((state) => state.auth.user);
  const labelArray = useTypedSelector((state) => state.task.labelArray);
  const taskArray = useTypedSelector((state) => state.task.taskArray);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const chooseKey = useTypedSelector((state) => state.task.chooseKey);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  // const [memberObj, setMemberObj] = useState<any>({});
  const [groupTaskArray, setGroupTaskArray] = useState<any>([]);
  const [taskNumber, setTaskNumber] = useState(10);
  const [taskLoadInfo, setTaskLoadInfo] = useState<any>([]);
  const [taskNameArr, setTaskNameArr] = useState<any>([]);
  const [labelExecutorArray, setLabelExecutorArray] = useState<any>([]);
  const [labelName, setLabelName] = useState('');
  const [labelIndex, setLabelIndex] = useState<any>(null);
  const [labelVisible, setLabelVisible] = useState(false);
  const [addLabelInput, setAddLabelInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [taskLoading, setTaskLoading] = useState(false);
  const [addTaskVisible, setAddTaskVisible] = useState(false);
  const [addInput, setAddInput] = useState('');
  // const [batchTaskVisible, setBatchTaskVisible] = useState(false);
  // const [batchLabelKey, setBatchLabelKey] = useState<string | null>('');
  // const [batchGroupKey, setBatchGroupKey] = useState<string | null>('');
  const [chooseLabelKey, setChooseLabelKey] = useState('');
  const [addVisible, setAddVisible] = useState<any>(null);
  const [moveState, setMoveState] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const filterObject = useTypedSelector((state) => state.task.filterObject);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      setLoading(true);
    }
  }, [user, groupKey]);
  useEffect(() => {
    setTaskNumber(
      Math.ceil((document.documentElement.offsetHeight - 128) / 70)
    );
  }, []);
  useEffect(() => {
    if (taskLoadInfo) {
      setTaskLoading(false);
    }
  }, [taskLoadInfo]);

  useEffect(() => {
    if (taskArray) {
      setLoading(false);
      getData(labelArray, taskArray, filterObject);
    }
  }, [taskArray, filterObject, labelArray]);
  useEffect(() => {
    if (groupTaskArray) {
      let newTaskLoadInfo: any = [];
      groupTaskArray.forEach((item: any, index: number) => {
        let taskInfoItem: any = _.cloneDeep(
          format.formatFilter(item, filterObject)
        );
        newTaskLoadInfo[index] = taskInfoItem
          .filter((taskItem: any, taskIndex: number) => {
            return taskItem;
          })
          .slice(0, taskNumber + 1);
      });
      setTaskLoadInfo(newTaskLoadInfo);
    }
  }, [groupTaskArray]);
  // useEffect(() => {
  //   if (chooseKey) {
  //     dispatch(setTaskKey(chooseKey));
  //     dispatch(setChooseKey(''));
  //   }
  // }, [chooseKey]);
  const getData = (labelArray: any, taskArray: any, filterObject: any) => {
    let taskNameArr: any = [];
    let labelExecutorArray: any = [];
    let groupTaskArray: any = [];

    let finishPercentArray1: any = [];
    let finishPercentArray2: any = [];
    let finishPercentArray10: any = [];
    labelArray.forEach((item: any, index: any) => {
      groupTaskArray[index] = [];
      // this.taskClickArr[index] = false;
      // this.taskMoveArr[index] = false;
      taskNameArr.push({ name: item.cardLabelName, key: item._key });
      // if (item.executorKey) {
      labelExecutorArray.push({
        executorKey: item.executorKey,
        executorAvatar: item.executorAvatar,
        executorNickName: item.executorNickName,
      });
      // } else {
      //   labelExecutorArray.push({
      //     executorKey: null,
      //     executorAvatar: '',
      //     executorNickName: '',
      //   });
      // }
    });

    taskArray.forEach((item: any) => {
      if (item.finishPercent === 0) {
        for (let i = 0; i < labelArray.length; i++) {
          if (item.labelKey === labelArray[i]._key) {
            let index = labelArray[i].cardOrder.indexOf(item._key);
            groupTaskArray[i][index] = item;
            // groupTaskArray[i].push(item);
          }
        }
      }
    });
    groupTaskArray = groupTaskArray.map((item: any) => {
      let arr = [];
      if (item) {
        for (let i = 0; i < item.length; i++) {
          if (item[i]) {
            arr.push(item[i]);
          }
        }
      }
      return arr;
    });
    taskArray.forEach((item: any) => {
      for (let i = 0; i < labelArray.length; i++) {
        let findIndex = _.findIndex(groupTaskArray[i], ['_key', item._key]);
        if (item.labelKey === labelArray[i]._key && findIndex === -1) {
          if (item.finishPercent === 1) {
            if (!finishPercentArray1[i]) {
              finishPercentArray1[i] = [];
            }
            finishPercentArray1[i].push(item);
          }
          if (item.finishPercent === 2) {
            if (!finishPercentArray2[i]) {
              finishPercentArray2[i] = [];
            }
            finishPercentArray2[i].push(item);
          }
          if (item.finishPercent === 10) {
            if (!finishPercentArray10[i]) {
              finishPercentArray10[i] = [];
            }
            finishPercentArray10[i].push(item);
          }
        }
      }
    });
    groupTaskArray = groupTaskArray.map((item: any, index: number) => {
      if (finishPercentArray1[index]) {
        item.push(...finishPercentArray1[index]);
      }
      if (finishPercentArray2[index]) {
        item.push(...finishPercentArray2[index]);
      }
      if (finishPercentArray10[index]) {
        item.push(...finishPercentArray10[index]);
      }
      let formatArr: any = _.cloneDeep(format.formatFilter(item, filterObject));
      formatArr = formatArr.filter((item: any, index: number) => {
        if (item.show) {
          return item;
        }
      });
      return item;
    });
    setGroupTaskArray(groupTaskArray);
    setTaskNameArr(taskNameArr);
    setLabelExecutorArray(labelExecutorArray);
  };
  const reorder = (list: any, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  /**
   * Moves an item from one list to another list.
   */
  const move = (
    source: any,
    destination: any,
    droppableSource: any,
    droppableDestination: any
  ) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result: any = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;
    return result;
  };

  const onDragEnd = async (result: any) => {
    const { source, destination } = result;

    let cardOrder1: any = [];
    let cardOrder2: any = [];
    let newGroupTaskArray: any = _.cloneDeep(groupTaskArray);
    let labelObject: any = {};
    // dropped outside the list
    if (!destination) {
      return;
    }
    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        newGroupTaskArray[parseInt(source.droppableId)],
        source.index,
        destination.index
      );
      newGroupTaskArray[parseInt(source.droppableId)] = items;
      cardOrder1 = items.map((item: any) => {
        return item._key;
      });

      labelObject = {
        groupKey: groupKey,
        labelObject1: {
          labelKey: labelArray[parseInt(source.droppableId)]._key,
          cardOrder: cardOrder1,
        },
      };
      labelObject = {
        groupKey: groupKey,
        labelKey1: labelArray[parseInt(source.droppableId)]._key,
        labelKey2: labelArray[parseInt(source.droppableId)]._key,
        cardKey:
          groupTaskArray[parseInt(source.droppableId)][source.index]._key,
        // labelObject1: {
        //   cardOrder: cardOrder1,
        // },
        // labelObject2: {
        //   cardOrder: cardOrder2,
        // },
      };
      let targetIndex = cardOrder1.indexOf(
        groupTaskArray[parseInt(source.droppableId)][source.index]._key
      );
      console.log(targetIndex);
      if (targetIndex !== -1) {
        if (targetIndex !== 0) {
          labelObject.previousCardKey = cardOrder1[targetIndex - 1];
        }
      }
    } else {
      const result = move(
        newGroupTaskArray[parseInt(source.droppableId)],
        newGroupTaskArray[parseInt(destination.droppableId)],
        source,
        destination
      );
      newGroupTaskArray[parseInt(source.droppableId)] =
        result[source.droppableId];
      newGroupTaskArray[parseInt(destination.droppableId)] =
        result[destination.droppableId];
      cardOrder1 = result[source.droppableId].map((item: any) => {
        return item._key;
      });
      cardOrder2 = result[destination.droppableId].map((item: any) => {
        return item._key;
      });
      labelObject = {
        groupKey: groupKey,
        labelKey1: labelArray[parseInt(source.droppableId)]._key,
        labelKey2: labelArray[parseInt(destination.droppableId)]._key,
        cardKey:
          groupTaskArray[parseInt(source.droppableId)][source.index]._key,
        // labelObject1: {
        //   cardOrder: cardOrder1,
        // },
        // labelObject2: {
        //   cardOrder: cardOrder2,
        // },
      };
      let targetIndex = cardOrder2.indexOf(
        groupTaskArray[parseInt(source.droppableId)][source.index]._key
      );
      console.log(targetIndex);
      if (targetIndex !== -1) {
        if (targetIndex !== 0) {
          labelObject.previousCardKey = cardOrder2[targetIndex - 1];
        }
      }
    }
    console.log(labelObject);
    setGroupTaskArray(newGroupTaskArray);
    let taskRes: any = await api.task.changeTaskLabel(
      groupKey,
      groupTaskArray[parseInt(source.droppableId)][source.index]._key,
      labelArray[parseInt(destination.droppableId)]._key
    );
    if (taskRes.msg === 'OK') {
      // dispatch(getGroupTask(3, groupKey, '[0,1,2,10]'));
    } else {
      dispatch(setMessage(true, taskRes.msg, 'error'));
    }
    let labelRes: any = await api.task.setLabelCardOrder(labelObject);
    if (labelRes.msg === 'OK') {
      dispatch(getGroupTask(3, groupKey, '[0,1,2,10]'));
    } else {
      dispatch(setMessage(true, labelRes.msg, 'error'));
    }
  };
  const onDragNameEnd = async (result: any) => {
    if (!result.destination) {
      result.destination = {
        index: taskNameArr.length - 1,
        droppableId: 'droppable',
      };
    }
    let newTaskNameArr: any = _.cloneDeep(taskNameArr);
    let newLabelExecutorArray = _.cloneDeep(labelExecutorArray);
    let newLabelItem = newTaskNameArr.splice(result.source.index, 1)[0];
    let newLabelExecutorItem = newLabelExecutorArray.splice(
      result.source.index,
      1
    )[0];

    newTaskNameArr.splice(result.destination.index, 0, newLabelItem);
    newLabelExecutorArray.splice(
      result.destination.index,
      0,
      newLabelExecutorItem
    );
    let labelOrder = newTaskNameArr.map(
      (labelItem: any, labelIndex: number) => {
        return labelItem.key ? labelItem.key : 'null';
      }
    );
    setTaskNameArr(newTaskNameArr);
    setLabelExecutorArray(newLabelExecutorArray);
    let groupRes: any = await api.group.setLabelOrder(groupKey, labelOrder);
    if (groupRes.msg === 'OK') {
      dispatch(getGroupTask(3, groupKey, '[0,1,2,10]'));
    } else {
      dispatch(setMessage(true, groupRes.msg, 'error'));
    }
  };
  const batchTaskArray = async (arr: any) => {
    let cardKeyArray = arr.map((item: any) => {
      return item._key;
    });
    let batchRes: any = await api.task.batchTaskArray(cardKeyArray);
    if (batchRes.msg === 'OK') {
      dispatch(changeBatchMusic(true));
      dispatch(setMessage(true, '归档成功', 'success'));
      dispatch(getGroupTask(3, groupKey, '[0,1,2,10]'));
    } else {
      dispatch(setMessage(true, batchRes.msg, 'error'));
    }
  };
  // const chooseBatchLabel = (
  //   labelKey: string | null,
  //   groupKey: string | null,
  //   index: number
  // ) => {
  //   setBatchGroupKey(groupKey);
  //   setBatchTaskVisible(true);
  //   setBatchTaskIndex(index - 1);
  // };
  // const changeTask = (
  //   taskItem: any,
  //   taskIndex: number,
  //   taskInfoIndex: number
  // ) => {
  //   let newGroupTaskArray = _.cloneDeep(groupTaskArray);
  //   newGroupTaskArray[taskInfoIndex][taskIndex] = taskItem;
  //   setGroupTaskArray(newGroupTaskArray);
  // };
  const addLabel = async () => {
    let newTaskNameArr: any = _.cloneDeep(taskNameArr);
    let newLabelIndex: any = labelIndex + 1;
    if (addLabelInput !== '') {
      // let labelRes: any = await api.group.setLabelOrder(groupKey, labelOrder);
      let labelRes: any = await api.task.addTaskLabel(groupKey, addLabelInput);
      if (labelRes.msg === 'OK') {
        newTaskNameArr.splice(newLabelIndex, 0, {
          name: addLabelInput,
          key: labelRes.result._key,
        });
        let labelOrder = newTaskNameArr.map(
          (labelItem: any, labelIndex: number) => {
            return labelItem.key ? labelItem.key : 'null';
          }
        );
        setTaskNameArr(newTaskNameArr);
        await api.group.setLabelOrder(groupKey, labelOrder);
        dispatch(getGroupTask(3, groupKey, '[0,1,2,10]'));
        setLabelVisible(false);
      } else {
        dispatch(setMessage(true, labelRes.msg, 'error'));
      }
    }
  };
  const changeLabelAvatar = async (item: any, index: number) => {
    let newLabelExecutorArray = _.cloneDeep(labelExecutorArray);
    newLabelExecutorArray[index] = {
      executorKey: item.userId,
      executorAvatar: item.avatar,
      executorNickName: item.nickName,
    };
    setLabelExecutorArray(newLabelExecutorArray);
  };
  const addTask = async (groupInfo: any, labelInfo: any) => {
    let obj = {};
    if (addInput == '') {
      setAddTaskVisible(false);
      return;
    }
    if (mainGroupKey == groupInfo._key) {
      labelInfo.executorKey = user._key;
    }
    if (urlInput) {
      obj = {
        url:
          urlInput.indexOf('http://') !== -1 ||
          urlInput.indexOf('https://') !== -1
            ? urlInput
            : 'http://' + urlInput,
      };
    }
    setLoading(true);
    let addTaskRes: any = await api.task.addTask({
      groupKey: groupInfo._key,
      groupRole: groupInfo.groupRole,
      labelKey: labelInfo._key,
      executorKey: labelInfo.executorKey,
      title: addInput,
      extraData: obj,
    });
    if (addTaskRes.msg === 'OK') {
      dispatch(setMessage(true, '新增任务成功', 'success'));
      dispatch(changeCreateMusic(true));
      dispatch(setChooseKey(addTaskRes.result._key));
      dispatch(getGroupTask(3, groupKey, '[0,1,2,10]'));
      setAddTaskVisible(false);
      setAddInput('');
      setLoading(false);
    } else {
      setLoading(false);
      dispatch(setMessage(true, addTaskRes.msg, 'error'));
    }
  };
  const scrollTask = (e: any, index: number) => {
    setTaskLoading(true);
    let newTaskLoadInfo = _.cloneDeep(taskLoadInfo);
    let taskLength = newTaskLoadInfo[index].length;
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let clientHeight = e.target.clientHeight;
    let taskArr = groupTaskArray[index].filter(
      (taskItem: any, taskIndex: number) => {
        if (taskItem.show) {
          return taskItem;
        }
      }
    );
    if (
      clientHeight + scrollTop + 1 >= scrollHeight &&
      taskLength < taskArr.length
    ) {
      newTaskLoadInfo[index].push(
        ...taskArr.slice(taskLength, taskLength + taskNumber)
      );
      setTaskLoadInfo(newTaskLoadInfo);
    } else {
      setTaskLoading(false);
    }
  };
  return (
    <div
      className="task"
      // onClick={(e: any) => {
      //   dispatch(setChooseKey(''));
      // }}
    >
      {loading || taskLoading ? <Loading /> : null}
      {groupInfo && labelArray ? (
        <div className="task-container-profile">
          <DragDropContext onDragEnd={onDragNameEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="task-container-taskName"
                >
                  {taskNameArr.map((taskNameitem: any, taskNameindex: any) => {
                    return (
                      <Draggable
                        key={'drag' + taskNameindex}
                        draggableId={
                          taskNameindex !== 0 ? taskNameitem.key : '0'
                        }
                        isDragDisabled={!taskNameitem.key}
                        index={taskNameindex}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            // style={{ marginRight: '15px' }}
                            onMouseEnter={() => {
                              setLabelIndex(taskNameindex);
                              setAddVisible('out');
                            }}
                            onMouseLeave={() => {
                              setAddVisible('in');
                            }}
                            className="task-container-taskName-item"
                          >
                            <React.Fragment>
                              {labelIndex === taskNameindex &&
                              groupInfo &&
                              groupInfo.role < 4 &&
                              groupInfo.role > 0 ? (
                                <img
                                  src={taskAddPng}
                                  onClick={() => {
                                    setLabelVisible(true);
                                  }}
                                  className="task-container-taskName-logo"
                                  style={
                                    addVisible === 'in'
                                      ? {
                                          animation: 'navIn 200ms',
                                          width: '0px',
                                          height: '0px',
                                          right: '0px',
                                          top: '30px',
                                        }
                                      : addVisible === 'out'
                                      ? {
                                          animation: 'navOut 200ms',
                                          width: '22px',
                                          height: '22px',
                                          right: '-3px',
                                          top: '20px',
                                        }
                                      : {
                                          width: '0px',
                                          height: '0px',
                                          right: '0px',
                                          top: '30px',
                                        }
                                  }
                                />
                              ) : null}
                              {groupInfo &&
                              groupInfo.role > 0 &&
                              groupInfo.role < 5 ? (
                                <div
                                  className="taskNav-addLabel"
                                  onClick={() => {
                                    setAddTaskVisible(true);
                                    setChooseLabelKey(
                                      labelArray[taskNameindex]._key
                                        ? labelArray[taskNameindex]._key
                                        : '0'
                                    );
                                    document
                                      .querySelectorAll('.task-item-info')
                                      [taskNameindex].scrollTo(0, 0);
                                  }}
                                ></div>
                              ) : null}
                              <TaskNav
                                avatar={
                                  labelExecutorArray[taskNameindex] &&
                                  labelExecutorArray[taskNameindex]
                                    .executorAvatar
                                    ? labelExecutorArray[taskNameindex]
                                        .executorAvatar
                                    : defaultPerson
                                }
                                executorKey={
                                  labelExecutorArray[taskNameindex] &&
                                  labelExecutorArray[taskNameindex].executorKey
                                }
                                name={taskNameitem.name}
                                role={groupInfo && groupInfo.role}
                                colorIndex={taskNameindex}
                                taskNavArray={[
                                  groupInfo,
                                  labelArray[taskNameindex],
                                ]}
                                taskNavWidth={'350px'}
                                chooseLabelKey={chooseLabelKey}
                                setChooseLabelKey={setChooseLabelKey}
                                batchTaskArray={() => {
                                  batchTaskArray(groupTaskArray[taskNameindex]);
                                }}
                                changeLabelAvatar={changeLabelAvatar}
                                arrlength={labelArray.length}
                                taskNavTask={groupTaskArray[taskNameindex]}
                              />
                            </React.Fragment>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="task-container-task">
              {taskLoadInfo.map((taskInfoitem: any, taskInfoindex: any) => {
                return (
                  <React.Fragment key={'taskInfoitem' + taskInfoindex}>
                    <Droppable droppableId={taskInfoindex + ''}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          className="task-item-info"
                          style={{ marginRight: '15px' }}
                          onScroll={(e) => {
                            scrollTask(e, taskInfoindex);
                          }}
                        >
                          <React.Fragment>
                            {(addTaskVisible &&
                              labelArray[taskInfoindex] &&
                              labelArray[taskInfoindex]._key + '' ===
                                chooseLabelKey) ||
                            (chooseLabelKey === '0' &&
                              labelArray[taskInfoindex] &&
                              !labelArray[taskInfoindex]._key) ? (
                              <div className="taskItem-plus-title taskNav-plus-title">
                                <div className="taskItem-plus-input">
                                  <input
                                    // required
                                    placeholder="任务标题"
                                    value={addInput}
                                    autoComplete="off"
                                    onChange={(e) => {
                                      setAddInput(e.target.value);
                                    }}
                                    style={{ fontSize: '14px' }}
                                  />
                                </div>
                                <div
                                  className="taskItem-plus-button"
                                  style={{ marginTop: '10px' }}
                                >
                                  <div className="taskNav-url">
                                    <IconButton
                                      color="primary"
                                      component="span"
                                      onClick={() => {
                                        setMoveState(true);
                                      }}
                                    >
                                      <img
                                        src={urlSvg}
                                        alt=""
                                        style={{
                                          height: '25px',
                                          width: '25px',
                                        }}
                                      />
                                    </IconButton>

                                    <input
                                      className="taskNav-url-input"
                                      value={urlInput}
                                      onChange={(e: any) => {
                                        setUrlInput(e.target.value);
                                      }}
                                      placeholder="请输入链接地址"
                                      style={
                                        moveState
                                          ? {
                                              animation: 'urlOut 500ms',
                                              animationFillMode: 'forwards',
                                            }
                                          : {}
                                      }
                                    />
                                  </div>
                                  <Button
                                    onClick={() => {
                                      setChooseLabelKey('');
                                      setAddTaskVisible(false);
                                      setAddInput('');
                                      setMoveState(false);
                                    }}
                                    style={{
                                      marginRight: '10px',
                                      color: '#efefef',
                                    }}
                                  >
                                    取消
                                  </Button>
                                  {addInput && !loading ? (
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={() => {
                                        addTask(
                                          groupInfo,
                                          labelArray[taskInfoindex]
                                        );
                                      }}
                                      style={{
                                        marginLeft: '10px',
                                        color: '#fff',
                                      }}
                                    >
                                      确定
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="contained"
                                      disabled
                                      style={{
                                        marginLeft: '10px',
                                        color: '#fff',
                                      }}
                                    >
                                      确定
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ) : null}
                            {taskInfoitem.map((item: any, index: any) => (
                              <Draggable
                                key={item._key}
                                draggableId={item._key}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="task-item-item"
                                    // style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                  >
                                    {item.show ? (
                                      <Task
                                        taskItem={item}
                                        // timeSetStatus={
                                        //   taskInfoitem.length > 4 &&
                                        //   index > taskInfoitem.length - 3
                                        // }
                                        taskIndex={
                                          labelArray[taskInfoindex] &&
                                          labelArray[
                                            taskInfoindex
                                          ].cardOrder.indexOf(item._key)
                                            ? labelArray[
                                                taskInfoindex
                                              ].cardOrder.indexOf(item._key)
                                            : 0
                                        }
                                        outSide={true}
                                      />
                                    ) : null}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </React.Fragment>
                        </div>
                      )}
                    </Droppable>
                  </React.Fragment>
                );
              })}
            </div>
          </DragDropContext>
          <Dialog
            visible={labelVisible}
            onClose={() => {
              setLabelVisible(false);
            }}
            onOK={() => {
              addLabel();
            }}
            title={'添加频道'}
            dialogStyle={{ width: '400px', height: '300px' }}
          >
            <div className="headerSet-search-title">
              <TextField
                // required
                id="outlined-basic"
                variant="outlined"
                label="添加频道"
                className={classes.input}
                style={{ width: '100%' }}
                value={addLabelInput}
                onChange={(e) => {
                  setAddLabelInput(e.target.value);
                }}
              />
            </div>
          </Dialog>
        </div>
      ) : null}
    </div>
  );
};
export default GroupTableGroup;
