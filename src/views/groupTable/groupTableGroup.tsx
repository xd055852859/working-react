import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import _ from 'lodash';
import format from '../../components/common/format';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { TextField } from '@material-ui/core';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import {
  getGroupTask,
  setChooseKey,
  setTaskKey,
} from '../../redux/actions/taskActions';
import { getGroupInfo } from '../../redux/actions/groupActions';
import { getTheme } from '../../redux/actions/authActions';
import { setMessage } from '../../redux/actions/commonActions';
import './groupTableGroup.css';
import api from '../../services/api';
import Task from '../../components/task/task';
import TaskNav from '../../components/taskNav/taskNav';
import DropMenu from '../../components/common/dropMenu';
import Dialog from '../../components/common/dialog';
import defaultPerson from '../../assets/img/defaultPerson.png';
import taskAddPng from '../../assets/img/contact-add.png';
import Loading from '../../components/common/loading';
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
  // const [memberObj, setMemberObj] = useState<any>({});
  const [taskInfo, setTaskInfo] = useState<any>([]);
  const [taskNameArr, setTaskNameArr] = useState<any>([]);
  const [labelExecutorArray, setLabelExecutorArray] = useState<any>([]);
  const [labelName, setLabelName] = useState('');
  const [labelIndex, setLabelIndex] = useState<any>(null);
  const [labelVisible, setLabelVisible] = useState(false);
  const [labelLogoVisible, setLabelLogoVisible] = useState(false);
  const [addLabelInput, setAddLabelInput] = useState('');
  const [loading, setLoading] = useState(false);
  // const [batchTaskVisible, setBatchTaskVisible] = useState(false);
  // const [batchLabelKey, setBatchLabelKey] = useState<string | null>('');
  // const [batchGroupKey, setBatchGroupKey] = useState<string | null>('');
  const [chooseLabelKey, setChooseLabelKey] = useState('');
  const [addVisible, setAddVisible] = useState<any>(null);
  const filterObject = useTypedSelector((state) => state.task.filterObject);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user && user._key && groupKey) {
      setLoading(true);
      dispatch(getGroupTask(3, groupKey, '[0,1,2]'));
      dispatch(getGroupInfo(groupKey));
      dispatch(getTheme());
    }
  }, [user, groupKey]);
  useEffect(() => {
    if (taskArray) {
      setLoading(false);
      getData(labelArray, taskArray, filterObject);
    }
  }, [taskArray, filterObject, labelArray]);
  useEffect(() => {
    if (chooseKey) {
      dispatch(setTaskKey(chooseKey));
      dispatch(setChooseKey(''));
    }
  }, [chooseKey]);
  const getData = (labelArray: any, taskArray: any, filterObject: any) => {
    let taskNameArr: any = [];
    let labelExecutorArray: any = [];
    let taskInfo: any = [];
    let finishPercentArray1: any = [];
    let finishPercentArray2: any = [];
    let finishPercentArray10: any = [];
    labelArray.forEach((item: any, index: any) => {
      taskInfo[index] = [];
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
            taskInfo[i][index] = item;
          }
        }
      }
    });
    taskInfo = taskInfo.map((item: any) => {
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
        let findIndex = _.findIndex(taskInfo[i], ['_key', item._key]);
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
    console.log(finishPercentArray1);
    taskInfo.forEach((item: any, index: number) => {
      if (finishPercentArray1[index]) {
        item.push(...finishPercentArray1[index]);
      }
      if (finishPercentArray2[index]) {
        item.push(...finishPercentArray2[index]);
      }
      if (finishPercentArray10[index]) {
        item.push(...finishPercentArray10[index]);
      }
    });
    taskInfo = taskInfo.map((item: any) => {
      return _.cloneDeep(format.formatFilter(item, filterObject));
    });
    console.log(taskInfo);
    setTaskInfo(taskInfo);
    console.log('taskNameArr', taskNameArr);
    console.log('labelExecutorArray', labelExecutorArray);
    setTaskNameArr(taskNameArr);
    setLabelExecutorArray(labelExecutorArray);
  };
  const taskTypeLength = (value: any) => {
    let len = 0;
    value.forEach((item: any) => {
      if (item.show) {
        len++;
      }
    });
    return len;
  };
  const changeLabelName = (e: any, index: number) => {
    let taskNewNameArr: any = [];
    setLabelName(e.target.value);
    taskNewNameArr = _.cloneDeep(taskNameArr);
    taskNewNameArr[index].name = e.target.value;
    setTaskNameArr(taskNewNameArr);
    // console.log(index);
  };
  const saveLabel = async (key: string) => {
    let labelRes: any = await api.task.changeTaskLabelName(key, labelName);
    if (labelRes.msg === 'OK') {
      dispatch(setMessage(true, '保存成功', 'success'));
      dispatch(getGroupTask(3, groupKey, '[0,1,2]'));
    } else {
      dispatch(setMessage(true, labelRes.msg, 'error'));
    }
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
    console.log('????????', result);
    return result;
  };

  const onDragEnd = async (result: any) => {
    const { source, destination } = result;

    let cardOrder1: any = [];
    let cardOrder2: any = [];
    let newTaskInfo: any = [];
    let labelObject: any = {};
    newTaskInfo = _.cloneDeep(taskInfo);
    // dropped outside the list
    if (!destination) {
      return;
    }
    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        newTaskInfo[parseInt(source.droppableId)],
        source.index,
        destination.index
      );
      newTaskInfo[parseInt(source.droppableId)] = items;
      cardOrder1 = items.map((item: any) => {
        return item._key;
      });
      console.log(items);
      labelObject = {
        groupKey: groupKey,
        labelObject1: {
          labelKey: labelArray[parseInt(source.droppableId)]._key,
          cardOrder: cardOrder1,
        },
      };
    } else {
      const result = move(
        newTaskInfo[parseInt(source.droppableId)],
        newTaskInfo[parseInt(destination.droppableId)],
        source,
        destination
      );
      newTaskInfo[parseInt(source.droppableId)] = result[source.droppableId];
      newTaskInfo[parseInt(destination.droppableId)] =
        result[destination.droppableId];
      cardOrder1 = result[source.droppableId].map((item: any) => {
        return item._key;
      });
      cardOrder2 = result[destination.droppableId].map((item: any) => {
        return item._key;
      });
      labelObject = {
        groupKey: groupKey,
        labelObject1: {
          labelKey: labelArray[parseInt(source.droppableId)]._key,
          cardOrder: cardOrder1,
        },
        labelObject2: {
          labelKey: labelArray[parseInt(destination.droppableId)]._key,
          cardOrder: cardOrder2,
        },
      };
    }

    setTaskInfo(newTaskInfo);
    console.log(source.droppableId, source.index);
    let taskRes: any = await api.task.changeTaskLabel(
      groupKey,
      taskInfo[parseInt(source.droppableId)][source.index]._key,
      labelArray[parseInt(destination.droppableId)]._key
    );
    if (taskRes.msg === 'OK') {
      console.log('切换频道成功');
      dispatch(getGroupTask(3, groupKey, '[0,1,2]'));
    } else {
      dispatch(setMessage(true, taskRes.msg, 'error'));
    }
    let labelRes: any = await api.task.setLabelCardOrder(labelObject);
    if (labelRes.msg === 'OK') {
      console.log('拖拽成功');
      dispatch(getGroupTask(3, groupKey, '[0,1,2]'));
    } else {
      dispatch(setMessage(true, labelRes.msg, 'error'));
    }
  };
  const onDragNameEnd = async (result: any) => {
    console.log('result', result);
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
      dispatch(getGroupTask(3, groupKey, '[0,1,2]'));
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
      dispatch(setMessage(true, '归档成功', 'success'));
      dispatch(getGroupTask(3, groupKey, '[0,1,2]'));
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
  //   let newTaskInfo = _.cloneDeep(taskInfo);
  //   newTaskInfo[taskInfoIndex][taskIndex] = taskItem;
  //   setTaskInfo(newTaskInfo);
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
        console.log('newLabelIndex', newLabelIndex);
        let labelOrder = newTaskNameArr.map(
          (labelItem: any, labelIndex: number) => {
            return labelItem.key ? labelItem.key : 'null';
          }
        );
        setTaskNameArr(newTaskNameArr);
        await api.group.setLabelOrder(groupKey, labelOrder);
        dispatch(getGroupTask(3, groupKey, '[0,1,2]'));
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
  return (
    <div
      className="task"
      // onClick={(e: any) => {
      //   dispatch(setChooseKey(''));
      // }}
    >
      {loading ? <Loading /> : null}
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
                      draggableId={taskNameindex !== 0 ? taskNameitem.key : '0'}
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
                                        right: '10px',
                                        top: '30px',
                                      }
                                    : addVisible === 'out'
                                    ? {
                                        animation: 'navOut 200ms',
                                        width: '22px',
                                        height: '22px',
                                        right: '5px',
                                        top: '20px',
                                      }
                                    : {
                                        width: '0px',
                                        height: '0px',
                                        right: '20px',
                                        top: '30px',
                                      }
                                }
                              />
                            ) : null}

                            <TaskNav
                              avatar={
                                labelExecutorArray[taskNameindex] &&
                                labelExecutorArray[taskNameindex].executorAvatar
                                  ? labelExecutorArray[taskNameindex]
                                      .executorAvatar
                                  : defaultPerson
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
                                batchTaskArray(taskInfo[taskNameindex]);
                              }}
                              changeLabelAvatar={changeLabelAvatar}
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
            {taskInfo.map((taskInfoitem: any, taskInfoindex: any) => {
              return (
                <Droppable
                  droppableId={taskInfoindex + 'task'}
                  key={'taskInfoitem' + taskInfoindex}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      className="task-item-info"
                      style={{ marginRight: '15px' }}
                    >
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
                                />
                              ) : null}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
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
    </div>
  );
};
export default GroupTableGroup;
