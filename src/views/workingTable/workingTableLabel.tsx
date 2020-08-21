import React, { useState, useEffect } from 'react';
import './workingTableLabel.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { getWorkingTableTask } from '../../redux/actions/taskActions';
import Task from '../../components/task/task';
import _ from 'lodash';

const WorkingTableLabel: React.FC = (prop) => {
  const user = useTypedSelector((state) => state.auth.user);
  const workingGroupArray = useTypedSelector(
    (state) => state.task.workingGroupArray
  );
  const workingTaskArray = useTypedSelector(
    (state) => state.task.workingTaskArray
  );
  // const [memberObj, setMemberObj] = useState<any>({});
  const [mainLabelArray, setMainLabelArray] = useState<any>([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user && user._key && !workingTaskArray) {
      dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2]));
    }
  }, [user, workingTaskArray]);
  useEffect(() => {
    if (workingTaskArray) {
      let labelArray: any = [];
      let labelArr: any = [];
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
                if (labelArr[index].indexOf(taskItem.labelKey) != -1) {
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
        let arr = [];
        workingGroupArray[0].labelArray.forEach((item: any, index: number) => {
          if (Object.keys(labelArray[0]).indexOf(item._key) == -1) {
            labelArray[0][item._key] = {
              arr: [],
              groupObj: workingGroupArray[0],
              labelObj: item,
              position: [],
            };
          }
        });
        labelArray = labelArray.map((item: any, index: number) => {
          for (let key in item) {
            // item[key].arr = format
            //   .formatFilter(item[key].arr, taskObj)
            //   .filter((arrItem, arrIndex) => {
            //     return arrItem.show;
            //   });
            item[key].arrlength = item[key].arr.length;
          }
          return Object.values(item);
        });
        labelArray = _.sortBy(_.flatten(labelArray), ['arrlength']).reverse();
        // this.labelArray.forEach((item, index) => {
        //   this.$nextTick(function () {
        //     this.render(index, 'label');
        //   });
        // });
        console.log('labelArray', labelArray);
        setMainLabelArray(labelArray);
      }
    }
  }, [workingTaskArray]);
  const sortArr = (arr: object[], item: any) => {
    arr.push(item);
    arr = _.sortBy(arr, ['taskEndDate']).reverse();
    arr = _.sortBy(arr, ['finishPercent']);
    return arr;
  };
  return (
    <div
      className="workingTableLabel-container"
      style={{ display: 'flex', overflowX: 'auto', height: '100%' }}
    >
      {mainLabelArray.map((labelItem: any, labelIndex: number) => {
        console.log('labelItem', labelItem);
        return (
          <div
            className="workingTableLabel-container-item"
            style={{ width: '350px', height: '100%', flexShrink: 0 }}
          >
            <div
              className="workingTableLabel-info"
              key={'label' + labelIndex}
              style={{ width: '350px' }}
            >
              <div className="workingTableLabel-info-labelInfo">
                <div className="workingTableLabel-info-labelName">
                  <div
                    className="workingTableLabel-info-labelName-groupLogo"
                    // onClick={toGroup(labelItem.groupObj)}
                  >
                    <div>
                      <img src={labelItem.groupObj.groupLogo} />
                    </div>
                    {labelItem.groupObj.groupName}/
                    {labelItem.labelObj
                      ? labelItem.labelObj.cardLabelName
                      : '无标题'}
                  </div>
                </div>
                <div
                  style={{ overflowY: 'auto' }}
                  className="workingTableLabel-info-item-label-container"
                >
                  {labelItem.arr.map((taskItem: any, taskIndex: number) => {
                    return (
                      <Task taskItem={taskItem} key={'task' + taskIndex} />
                    );
                  })}
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
