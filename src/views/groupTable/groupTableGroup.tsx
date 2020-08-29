import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import _ from 'lodash';
import format from '../../components/common/format';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { getGroupTask } from '../../redux/actions/taskActions';
import { getGroupInfo } from '../../redux/actions/groupActions';

import { setMessage } from '../../redux/actions/commonActions';
import './groupTableGroup.css';
import api from '../../services/api';
import Task from '../../components/task/task';
import TaskNav from '../../components/taskNav/taskNav';
import DropMenu from '../../components/common/dropMenu';
import ellipsisPng from '../../assets/img/ellipsis.png';
import defaultPerson from '../../assets/img/defaultPerson.png';

const GroupTableGroup: React.FC = (prop) => {
  const user = useTypedSelector((state) => state.auth.user);
  const labelArray = useTypedSelector((state) => state.task.labelArray);
  const taskArray = useTypedSelector((state) => state.task.taskArray);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);

  // const [memberObj, setMemberObj] = useState<any>({});
  const [taskInfo, setTaskInfo] = useState<any>([]);
  const [taskNameArr, setTaskNameArr] = useState<any>([]);
  const [labelExecutorArray, setLabelExecutorArray] = useState<any>([]);
  const [labelName, setLabelName] = useState('');
  const [batchTaskVisible, setBatchTaskVisible] = useState(false);
  const [batchLabelKey, setBatchLabelKey] = useState<string | null>('');
  const [batchGroupKey, setBatchGroupKey] = useState<string | null>('');
  const [batchTaskIndex, setBatchTaskIndex] = useState(0);
  const filterObject = useTypedSelector((state) => state.task.filterObject);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user && user._key && groupKey) {
      dispatch(getGroupTask(3, groupKey, '[0,1,2]'));
    }
  }, [user, groupKey]);
  useEffect(() => {
    if (taskArray) {
      getData(labelArray, taskArray, filterObject);
    }
  }, [taskArray, filterObject]);

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
      taskNameArr.push(item.cardLabelName);
      if (item._key) {
        labelExecutorArray.push({
          executorKey: item.executorKey,
          executorAvatar: item.executorAvatar,
          executorNickName: item.executorNickName,
        });
        let newItem = item;
      }
    });

    taskArray.forEach((item: any) => {
      if (item.finishPercent == 0) {
        for (let i = 0; i < labelArray.length; i++) {
          if (item.labelKey == labelArray[i]._key) {
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
        if (item.labelKey == labelArray[i]._key && findIndex == -1) {
          if (item.finishPercent == 1) {
            if (finishPercentArray1[i]) {
              finishPercentArray1[i].push(item);
            } else {
              finishPercentArray1[i] = [];
            }
          }
          if (item.finishPercent == 2) {
            if (finishPercentArray2[i]) {
              finishPercentArray2[i].push(item);
            } else {
              finishPercentArray2[i] = [];
            }
          }
          if (item.finishPercent == 10) {
            if (finishPercentArray10[i]) {
              finishPercentArray10[i].push(item);
            } else {
              finishPercentArray10[i] = [];
            }
          }
        }
      }
    });
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
    setTaskInfo(taskInfo);
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
    taskNewNameArr[index] = e.target.value;
    setTaskNameArr(taskNewNameArr);
    // console.log(index);
  };
  const saveLabel = async (key: string) => {
    let labelRes: any = await api.task.changeTaskLabelName(key, labelName);
    if (labelRes.msg == 'OK') {
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
    console.log(result);
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
        newTaskInfo[source.droppableId],
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
    
    console.log(labelObject);
    setTaskInfo(newTaskInfo);
    let taskRes: any = await api.task.changeTaskLabel(
      groupKey,
      taskInfo[source.droppableId][source.index]._key,
      labelArray[parseInt(destination.droppableId)]._key
    );
    if (taskRes.msg == 'OK') {
      console.log('切换频道成功');
      dispatch(getGroupTask(3, groupKey, '[0,1,2]'));
    } else {
      dispatch(setMessage(true, taskRes.msg, 'error'));
    }
    let labelRes: any = await api.task.setLabelCardOrder(labelObject);
    if (labelRes.msg == 'OK') {
      console.log('拖拽成功');
      dispatch(getGroupTask(3, groupKey, '[0,1,2]'));
    } else {
      dispatch(setMessage(true, labelRes.msg, 'error'));
    }
  };
  const batchTaskArray = async (arr: any) => {
    let cardKeyArray = arr.map((item: any) => {
      return item._key;
    });
    let batchRes: any = await api.task.batchTaskArray(cardKeyArray);
    if (batchRes.msg == 'OK') {
      dispatch(setMessage(true, '归档成功', 'success'));
      dispatch(getGroupTask(3, groupKey, '[0,1,2]'));
    } else {
      dispatch(setMessage(true, batchRes.msg, 'error'));
    }
  };
  const chooseBatchLabel = (
    labelKey: string | null,
    groupKey: string | null,
    index: number
  ) => {
    setBatchGroupKey(groupKey);
    setBatchTaskVisible(true);
    setBatchTaskIndex(index - 1);
  };
  const changeTask = (
    taskItem: any,
    taskIndex: number,
    taskInfoIndex: number
  ) => {
    let newTaskInfo = _.cloneDeep(taskInfo);
    newTaskInfo[taskInfoIndex][taskIndex] = taskItem;
    setTaskInfo(newTaskInfo);
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="task" >
        <div className="task-container-profile">
          {taskInfo.map((taskInfoitem: any, taskInfoindex: any) => {
            return (
              <React.Fragment key={'taskinfo' + taskInfoindex}>
                <div className="task-container-info">
                  <TaskNav
                    avatar={
                      labelExecutorArray[taskInfoindex] &&
                      labelExecutorArray[taskInfoindex].executorAvatar
                        ? labelExecutorArray[taskInfoindex].executorAvatar
                        : defaultPerson
                    }
                    name={taskNameArr[taskInfoindex]}
                    role={groupInfo&&groupInfo.role}
                    colorIndex={taskInfoindex}
                    taskNavArray={[groupInfo, labelArray[taskInfoindex]]}
                    taskNavWidth={'350px'}
                  >
                    {groupInfo&&groupInfo.groupRole > 0 && groupInfo&&groupInfo.groupRole < 4 ? (
                      <div style={{ position: 'relative' }}>
                        <div
                          className="task-item-title-icon"
                          onClick={() => {
                            setBatchLabelKey(labelArray[taskInfoindex]._key);
                          }}
                        >
                          <img
                            src={ellipsisPng}
                            className="taskNav-name-ellipsis"
                          />
                        </div>
                        <DropMenu
                          visible={
                            labelArray[taskInfoindex]._key == batchLabelKey
                          }
                          dropStyle={{
                            width: '150px',
                            height: '150px',
                            top: '18px',
                            color: '#333',
                          }}
                          onClose={() => {
                            setBatchLabelKey('');
                          }}
                          title={'设置频道'}
                        >
                          <div className="taskNav-set">
                            <div
                              onClick={() => {
                                batchTaskArray(taskInfoitem);
                              }}
                            >
                              归档全部已完成任务
                            </div>
                            <div
                              onClick={() => {
                                chooseBatchLabel(
                                  labelArray[taskInfoindex]._key,
                                  groupInfo._key,
                                  taskInfoitem.length
                                );
                              }}
                            >
                              批量导入
                            </div>
                          </div>
                        </DropMenu>
                      </div>
                    ) : null}
                  </TaskNav>
                  <Droppable droppableId={taskInfoindex + ''}>
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} className="task-item-info">
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
                                    changeTask={changeTask}
                                    taskIndex={index}
                                    taskInfoIndex={taskInfoindex}
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
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </DragDropContext>
  );
};
export default GroupTableGroup;
