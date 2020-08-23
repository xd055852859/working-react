import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import _ from 'lodash';

import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { getGroupTask } from '../../redux/actions/taskActions';
import { setMessage } from '../../redux/actions/commonActions';
import './groupTableGroup.css';
import api from '../../services/api'
import Task from '../../components/task/task';
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
  const [labelName, setLabelName] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    if (user && user._key && !taskArray && groupKey) {
      dispatch(getGroupTask(3, groupKey, '[0,1,2]'));
    }
  }, [user, taskArray, groupKey]);
  useEffect(() => {
    if (taskArray) {
      getData(labelArray, taskArray);
    }
  }, [taskArray]);

  const getData = (labelArray: any, taskArray: any) => {
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
    console.log(finishPercentArray1);
    console.log(finishPercentArray2);
    console.log(finishPercentArray10);
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

    console.log('taskInfo', taskInfo);
    console.log('taskNameArr', taskNameArr);
    console.log('labelExecutorArray', labelExecutorArray);
    setTaskInfo(taskInfo);
    setTaskNameArr(taskNameArr);
    setLabelExecutorArray(labelExecutorArray);
    // taskInfo = taskInfo.map((item) => {
    //   return _.cloneDeep(format.formatFilter(item, taskObj));
    // });
    // }
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
    let taskNewNameArr: any = []
    setLabelName(e.target.value)
    taskNewNameArr = _.cloneDeep(taskNameArr)
    taskNewNameArr[index] = e.target.value
    setTaskNameArr(taskNewNameArr);
    // console.log(index);
  }
  const saveLabel = async (key: string) => {
    let labelRes: any = await api.task.changeTaskLabel(key, labelName);
    if (labelRes) {
      dispatch(setMessage(true, "保存成功", "success"));
      dispatch(getGroupTask(3, groupKey, '[0,1,2]'));
    } else {
      dispatch(setMessage(true, labelRes.msg, "error"));
    }
  }
  const reorder = (list: any, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  /**
   * Moves an item from one list to another list.
   */
  const move = (source: any, destination: any, droppableSource: any, droppableDestination: any) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result: any = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;
    console.log(result)
    return result;
  };

  const grid = 8;

  const getItemStyle = (isDragging: any, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging
      ? 'lightgreen'
      : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
  });

  const getListStyle = (isDraggingOver: any) => ({
    background: isDraggingOver
      ? 'lightblue'
      : 'lightgrey',
    padding: grid,
    width: 250
  });

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    let newTaskInfo: any = []
    // dropped outside the list
    if (!destination) {
      return;
    }
    if (source.droppableId === destination.droppableId) {
      const items = reorder(taskInfo[source.droppableId], source.index, destination.index);
      console.log(items);
      taskInfo[parseInt(source.droppableId)] = items;
    } else {
      const result = move(taskInfo[parseInt(source.droppableId)], taskInfo[parseInt(destination.droppableId)], source, destination);
      taskInfo[parseInt(source.droppableId)] = result[source.droppableId];
      taskInfo[parseInt(destination.droppableId)] = result[destination.droppableId];
      // this.setState({items: result.droppable, selected: result.droppable2});
    }
    newTaskInfo = _.cloneDeep(taskInfo)
    setTaskInfo(newTaskInfo);
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="task">
        <div className="task-container-profile">

          {taskInfo.map((taskInfoitem: any, taskInfoindex: any) => {
            return (
              <React.Fragment key={'taskinfo' + taskInfoindex}>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  <div
                    className="task-item-title"
                  >
                    {/* v-if="groupRole>0&&groupRole<4&&groupType!=2" */}
                    <div >
                      <img
                        src={labelExecutorArray[taskInfoindex] && labelExecutorArray[taskInfoindex].executorAvatar ? labelExecutorArray[taskInfoindex].executorAvatar : defaultPerson}
                        alt=""
                        className="task-item-avatar"
                      />
                    </div>
                    {/*   v-if="!taskClickArr[index]||(groupRole>3&&groupType==2)" */}
                    {/* onClick={groupInfo.role > 0 && groupInfo.role < 4 ? () => { } : null} */}
                    <span
                      style={{ height: '40px', lineHeight: '40px' }}
                    >{taskNameArr[taskInfoindex]} ( {taskTypeLength(taskInfoitem)} )</span>
                    <input placeholder="请输入标签名"
                      value={taskNameArr[taskInfoindex]}
                      onChange={(e) => { changeLabelName(e, taskInfoindex) }}
                      onBlur={() => { saveLabel(labelArray[taskInfoindex]._key) }}
                      style={{ width: '50%' }}
                    />
                  </div>
                  <Droppable droppableId={taskInfoindex + ''} >
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} className="task-item-info">
                        {taskInfoitem.map((item: any, index: any) => (
                          <Draggable key={item._key} draggableId={item._key} index={index} >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="task-item-item"
                              // style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                              >
                                <Task taskItem={item} />
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
            )
          })}
        </div>
      </div>
    </DragDropContext >
  );
};
export default GroupTableGroup;
