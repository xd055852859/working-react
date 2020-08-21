import React, { useState, useEffect } from 'react';
import './workingTableLabel.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { getWorkingTableTask } from '../../redux/actions/taskActions';
import Task from '../../components/task/task';
import _ from 'lodash';

const WorkingTableGroup: React.FC = (prop) => {
  const user = useTypedSelector((state) => state.auth.user);
  const workingGroupArray = useTypedSelector(
    (state) => state.task.workingGroupArray
  );
  const workingTaskArray = useTypedSelector(
    (state) => state.task.workingTaskArray
  );
  // const [memberObj, setMemberObj] = useState<any>({});
  const [mainGroupArray, setMainGroupArray] = useState<any>([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user && user._key && !workingTaskArray) {
      dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2]));
    }
  }, [user, workingTaskArray]);
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
        workingGroupArray[0].labelArray.forEach((item: any) => {
          if (Object.keys(arr[0]).indexOf(item._key) == -1) {
            arr[0][item._key] = {
              arr: [],
              labelObj: item,
            };
          }
        });
        groupArray = arr;
        groupArray = groupArray.map((item: any) => {
          item.arrlength = 0;
          for (let key in item) {
            if (key != 'groupObj' && key != 'position' && key != 'arrlength') {
              // item[key].arr = format
              //   .formatFilter(item[key].arr, taskObj)
              //   .filter((arrItem, arrIndex) => {
              //     return arrItem.show;
              //   });
              item.arrlength = item.arrlength + item[key].arr.length;
            }
          }
          return item;
        });
        groupArray = _.sortBy(groupArray, ['arrlength']).reverse();
        console.log('groupArray', groupArray);
        setMainGroupArray(groupArray);
        // groupArray.forEach((item, index) => {
        //   this.$nextTick(function () {
        //     if (item.arrlength > 0) {
        //       this.render(index, "group");
        //     }
        //   });
        // });
      }
    }
  }, [workingTaskArray]);
  const sortArr = (arr: object[], item: any) => {
    arr.push(item);
    arr = _.sortBy(arr, ['taskEndDate']).reverse();
    arr = _.sortBy(arr, ['finishPercent']);
    return arr;
  };
  const getGroupItem = (item: any) => {
    let dom: any = [];
    for (let key in item) {
      let groupItem = item[key];
      let groupIndex = key;
      dom.push(
        <div style={{ marginBottom: '2px' }} key={'groupItem' + groupIndex}>
          {groupItem.labelObj ? (
            <div>
              {groupIndex != 'groupObj' && groupIndex != 'position' ? (
                <div className="workingTableLabel-info-labelName">
                  <div>
                    {groupItem.labelObj
                      ? groupItem.labelObj.cardLabelName
                      : '无标题'}
                  </div>
                </div>
              ) : null}
              <div
                v-for="(taskItem,taskIndex) in groupItem.arr"
                className="workingTableLabel-info-item"
              >
                {groupItem.arr.map((taskItem: any, taskIndex: number) => {
                  return <Task taskItem={taskItem} key={'task' + taskIndex} />;
                })}
              </div>
            </div>
          ) : null}
        </div>
      );
    }
    return dom;
  };
  return (
    <div
      className="workingTableLabel-container"
      style={{ display: 'flex', overflowX: 'auto', height: '100%' }}
    >
      {mainGroupArray.map((item: any, index: number) => {
        return (
          <div key={'mainGroup' + index}>
            {/* {item.arrlength > 0 ? ( */}
            <div
              className="workingTableLabel-container-item"
              style={{
                width: '350px',
                height: '100%',
                flexShrink: 0,
              }}
              key={'group' + index}
            >
              <div
                className="workingTableLabel-info"
                style={{ width: '350px' }}
              >
                <div className="workingTableLabel-info-groupName">
                  {/* onClick={toGroup(item.groupObj)} */}

                  <div className="workingTableLabel-info-groupLogo">
                    <img src={item.groupObj.groupLogo} />
                  </div>
                  <div>{item.groupObj.groupName}</div>
                </div>
                <div
                  style={{ overflowY: 'auto' }}
                  className="workingTableLabel-info-item-group-container"
                >
                  {getGroupItem(item)}
                </div>
              </div>
            </div>
            {/* ) : null} */}
          </div>
        );
      })}
    </div>
  );
};
export default WorkingTableGroup;
