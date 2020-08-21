import React, { useState, useEffect } from 'react';
import './groupTableGroup.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { getGroupTask } from '../../redux/actions/taskActions';
import Task from '../../components/task/task';
import _ from 'lodash';

const GroupTableGroup: React.FC = (prop) => {
  const user = useTypedSelector((state) => state.auth.user);
  const labelArray = useTypedSelector((state) => state.task.labelArray);
  const taskArray = useTypedSelector((state) => state.task.taskArray);
  const groupKey = useTypedSelector((state) => state.group.groupKey);

  // const [memberObj, setMemberObj] = useState<any>({});
  const [taskInfo, setTaskInfo] = useState<any>([]);
  const [taskNameArr, setTaskNameArr] = useState<any>([]);
  const [labelExecutorArray, setLabelExecutorArray] = useState<any>([]);

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
  return (
    <div className="task">
      <div className="task-container-profile">
        <div className="task-tag-container">
          {taskInfo.map((item: any, index: number) => {
            return (
              <div key={'item' + index}>
                <div className="task-item-container">
                  <div
                    className="task-item-title"
                    // onMouseenter={changeLabelSet(index)}
                  >
                    <span style={{ height: '40px', lineHeight: '40px' }}>
                      {taskNameArr[index]}
                      {'/'}({taskTypeLength(taskInfo[index])})
                    </span>
                  </div>
                  <div className="task-item-info" v-model="taskInfo[index]">
                    {taskInfo[index].map((taskItem: any, taskIndex: number) => {
                      return (
                        <div
                          className="task-item-item"
                          key={'taskItem' + index + '-' + taskIndex}
                          // style={
                          //   cardKey == value._key
                          //     ? { boxShadow: '2px 3px 5px 0 rgba(0, 0, 0, 0.26)' }
                          //     : null
                          // }
                        >
                          <Task
                            taskItem={taskItem}
                            // executorKey={labelExecutorArray[index].executorKey}
                            // v-on="$listeners"
                            // v-bind="$attrs"
                            // :viewState="1"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default GroupTableGroup;
