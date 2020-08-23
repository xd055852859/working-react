import React, { useState, useEffect, useRef } from 'react';
import './workingTableLabel.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { getWorkingTableTask, addWorkingTableTask } from '../../redux/actions/taskActions';
import Task from '../../components/task/task';
import _ from 'lodash';
// import defaultPersonPng from '../../assets/img/defaultPerson.png'
import defaultGroupPng from '../../assets/img/defaultGroup.png'

const WorkingTableLabel: React.FC = (prop) => {
  const user = useTypedSelector((state) => state.auth.user);
  const memberHeaderIndex = useTypedSelector((state) => state.member.memberHeaderIndex);
  const workingGroupArray = useTypedSelector((state) => state.task.workingGroupArray);
  const workingTaskArray = useTypedSelector((state) => state.task.workingTaskArray);
  // const [memberObj, setMemberObj] = useState<any>({});
  const [mainLabelArray,
    setMainLabelArray] = useState<any>([]);
  const [colWidth,
    setColWidth] = useState(0);
  const [colNumbers,
    setColNumbers] = useState(4);
  const [colHeight,
    setColHeight] = useState<any>([]);
  const workingTableRef: React.RefObject<any> = useRef()
  const dispatch = useDispatch();
  useEffect(() => {
    if (user && user._key) {
      dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2]));
    }
  }, [user]);
  useEffect(() => {
    if (workingTaskArray) {
      let labelArray: any = [];
      let labelArr: any = [];
      if (workingGroupArray.length > 0 && workingTaskArray.length > 0) {
        workingGroupArray.forEach((item: any, index: number) => {
          labelArr[index] = item
            .labelArray
            .map((labelItem: any) => labelItem._key);
        });
        workingGroupArray.forEach((item: any, index: number) => {
          labelArray[index] = {};
          workingTaskArray[index].forEach((taskItem: any, taskIndex: number) => {
            if (taskItem.taskEndDate) {
              if (labelArr[index].indexOf(taskItem.labelKey) != -1) {
                if (!labelArray[index][taskItem.labelKey]) {
                  labelArray[index][taskItem.labelKey] = {
                    arr: [],
                    groupObj: item,
                    labelObj: item.labelArray[labelArr[index].indexOf(taskItem.labelKey)],
                    position: []
                  };
                }
                labelArray[index][taskItem.labelKey].arr = sortArr(labelArray[index][taskItem.labelKey].arr, taskItem);
              } else {
                if (!labelArray[index]['ToDo' + index]) {
                  labelArray[index]['ToDo' + index] = {
                    arr: [],
                    groupObj: item,
                    labelObj: {
                      groupKey: item._key,
                      cardLabelName: 'ToDo'
                    },
                    position: []
                  };
                }
                labelArray[index]['ToDo' + index].arr = sortArr(labelArray[index]['ToDo' + index].arr, taskItem);
              }
            }
          });
        });
        let arr = [];
        workingGroupArray[0]
          .labelArray
          .forEach((item: any, index: number) => {
            if (Object.keys(labelArray[0]).indexOf(item._key) == -1) {
              labelArray[0][item._key] = {
                arr: [],
                groupObj: workingGroupArray[0],
                labelObj: item,
                position: []
              };
            }
          });
        labelArray = labelArray.map((item: any, index: number) => {
          for (let key in item) {
            // item[key].arr = format   .formatFilter(item[key].arr, taskObj)
            // .filter((arrItem, arrIndex) => {     return arrItem.show;   });
            item[key].arrlength = item[key].arr.length;
          }
          return Object.values(item);
        });
        labelArray = _.sortBy(_.flatten(labelArray), ['arrlength']).reverse();
        setMainLabelArray(labelArray);
      }
    }
  }, [workingTaskArray]);
  useEffect(() => {
    let clientWidth = workingTableRef.current.clientWidth
    if (clientWidth < 600) {
      setColNumbers(1)
    } else if (clientWidth >= 600 && clientWidth <= 900) {
      setColNumbers(2)
    } else if (clientWidth > 900 && clientWidth <= 1080) {
      setColNumbers(3)
    } else {
      setColNumbers(4)
    }
    setColWidth(Math.floor(clientWidth / colNumbers))
  }, [workingTableRef.current]);
  useEffect(() => {
    let labelArray = []
    if (document.getElementById("workingTableLabel0")) {
      labelArray = mainLabelArray.filter((item: any, index: number) => {
        if (item.arrlength > 0) {
          item.position = render(index);
          return item
        }
      })
      setMainLabelArray(labelArray);
    }
  }, [document.getElementById("workingTableLabel0")]);
  const sortArr = (arr: object[], item: any) => {
    arr.push(item);
    arr = _
      .sortBy(arr, ['taskEndDate'])
      .reverse();
    arr = _.sortBy(arr, ['finishPercent']);
    return arr;
  };
  const render = (index: number) => {
    let obj = {
      left: 0,
      top: 0
    };
    let dom: any = document.getElementById("workingTableLabel" + index);
    console.log(dom);
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
      } else {
        //获取高度的最小值
        let minHeight: any = Math
          .min
          .apply(null, colHeight);
        let minIndex: number = parseInt(colHeight.indexOf(minHeight));
        //此图片的 top 为上面图片的高度，left 相等
        obj.top = parseInt(minHeight);
        obj.left = Math.floor(minIndex * colWidth);
        //     //把高度加上去
        colHeight[minIndex] += colWidth / ratio;
      }
      return obj
    }
  }
  const addTask = (groupInfo: any, labelInfo: any) => {
    console.log(groupInfo, labelInfo);
    dispatch(addWorkingTableTask("", groupInfo._key, groupInfo.groupRole,
      labelInfo._key, 0, labelInfo.executorKey))
  }
  return (
    <div
      className="workingTableLabel-container"
      style={{
        display: 'flex',
        overflowX: 'auto',
        height: '100%'
      }}
      ref={workingTableRef}>
      {mainLabelArray.map((labelItem: any, labelIndex: number) => {
        return (
          <div
            key={'label' + labelIndex}
            className="workingTableLabel-container-item"
            style={memberHeaderIndex == 0
              ? {
                width: '350px',
                height: '100%',
                flexShrink: 0
              }
              : {
                width: colWidth + 'px',
                position: 'absolute',
                top: labelItem.position.top + 'px',
                left: labelItem.position.left + 'px'
              }}
            id={'workingTableLabel' + labelIndex}>
            <div
              className="workingTableLabel-info"
              style={memberHeaderIndex == 0
                ? {
                  width: '350px'
                }
                : {
                  width: '100%'
                }}>
              <div className="workingTableLabel-info-labelInfo">
                <div className="workingTableLabel-info-labelName">
                  {/*onClick={toGroup(labelItem.groupObj)} */}
                  <div className="workingTableLabel-info-groupLogo">
                    <img
                      src={labelItem.groupObj & labelItem.groupObj.groupLogo
                        ? labelItem.groupObj.groupLogo
                        : defaultGroupPng} />
                  </div>
                  <div>{labelItem.groupObj.groupName}/ {labelItem.labelObj
                    ? labelItem.labelObj.cardLabelName
                    : '无标题'}</div>
                  {labelItem.groupObj.groupRole > 0 && labelItem.groupObj.groupRole < 4
                    ? <div
                      onClick={() => {
                        addTask(labelItem.groupObj, labelItem.labelObj)
                      }}>添加任务
                      </div>
                    : null}

                  {labelItem.groupObj.groupRole > 0 && labelItem.groupObj.groupRole < 4
                    ? <div className="task-item-title-icon"></div>
                    : null}
                  {/* <a-menu slot="overlay">
                        <a-menu-item>
                          <div @click="batchTaskArray(taskInfo[index])">归档全部已完成任务</div>
                  </a-menu-item>
                      <a-menu-item>
                        <div
                      @click="chooseBatchLabel(labelArray[index]._key,taskInfo[index].length)"
                    >批量导入</div>
                  </a-menu-item>
                    <a-menu-item
                      v-if="!eyeState&&taskInfo[index].length==0&&labelArray[index]._key!=null"
                    >
                      <div @click="deleteLabel(index,labelArray[index]._key)">删除栏目</div>
                  </a-menu-item>
                </a-menu>
              </div> */}

                </div>
                <div
                  style={{
                    overflowY: 'auto'
                  }}
                  className="workingTableLabel-info-item-label-container">
                  {labelItem
                    .arr
                    .map((taskItem: any, taskIndex: number) => {
                      return (<Task taskItem={taskItem} key={'task' + taskIndex} />);
                    })}
                </div>
              </div>
            </div >
          </div >
        );
      })}
    </div >
  );
};
export default WorkingTableLabel;
