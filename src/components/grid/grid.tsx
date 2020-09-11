import React, { useState, useEffect, useRef } from 'react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../redux/actions/commonActions';
import GridTree from './gridTree';
import _ from 'lodash';
import moment from 'moment';
import './grid.css';
import api from '../../services/api';
import allPng from '../../assets/img/all.png';
interface GridProps {
  gridState: boolean;
}

const Grid: React.FC<GridProps> = (prop) => {
  let { gridState } = prop;
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const userKey = useTypedSelector((state) => state.auth.userKey);
  const targetUserKey = useTypedSelector((state) => state.auth.targetUserKey);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const memberArray = useTypedSelector((state) => state.member.memberArray);
  const filterObject = useTypedSelector((state) => state.task.filterObject);
  const [gridGroupArray, setGridGroupArray] = useState<any>([]);
  const [allGridGroupArray, setAllGridGroupArray] = useState<any>([]);
  const [allGridTaskArray, setAllGridTaskArray] = useState<any>([]);
  const [allGridChildArray, setAllGridChildArray] = useState<any>([]);
  const [taskNavDate, setTaskNavDate] = useState<any>([]);
  const [taskNavDay, setTaskNavDay] = useState<any>([]);
  const [taskNavWeek, setTaskNavWeek] = useState<any>([]);
  const [moveIndex, setMoveIndex] = useState<any>(null);
  const [taskWidth, setTaskWidth] = useState(0);
  const [avatarHeight, setAvatarHeight] = useState(0);
  const labelRef: React.RefObject<any> = useRef();
  useEffect(() => {
    if (user && user._key) {
      getGridData();
    }
  }, [user, targetUserInfo, headerIndex]);
  useEffect(() => {
    if (labelRef.current) {
      let clientWidth = labelRef.current.clientWidth;
      setAvatarHeight(clientWidth);
    }
  }, [labelRef.current]);
  const getGridData = async () => {
    let obj: any = {
      type1: headerIndex,
      finishPercentArray: [0],
    };
    if (headerIndex === 3) {
      obj.groupKey = groupKey;
    } else {
      obj.type2 = gridState ? 3 : 4;
      if (headerIndex === 2) {
        obj.targetUKey = targetUserKey;
      }
    }
    let gridRes: any = await api.task.allGridGroupTask(obj);
    if (gridRes.msg === 'OK') {
      console.log('gridRes', gridRes);
      let gridObj = _.cloneDeep(gridRes.result);
      let newAllGridChildArray: any = [];
      let newAllGridTaskArray: any = [];
      let newAllGridGroupArray: any = [];
      let cardIndex = _.findIndex(gridObj.groupArray, {
        _key: localStorage.getItem('mainGroupKey'),
      });
      if (gridObj.groupArray.length > 0) {
        gridObj.groupArray.unshift(gridObj.groupArray.splice(cardIndex, 1)[0]);
        gridObj.cardArray.unshift(gridObj.cardArray.splice(cardIndex, 1)[0]);
      }
      newAllGridGroupArray = gridObj.groupArray;
      newAllGridTaskArray = gridObj.cardArray.map(
        (item: any, index: number) => {
          item = item.filter((taskItem: any, taskIndex: number) => {
            if (
              taskItem.finishPercent == 0 ||
              (taskItem.finishPercent == 1 && taskItem.children.length > 0) ||
              (taskItem.finishPercent == 2 && taskItem.children.length > 0)
            ) {
              return taskItem;
            }
          });
          return item;
        }
      );
      gridObj.sonCardArray.map((item: any, index: number) => {
        newAllGridChildArray[index] = {};
        for (let key in item) {
          if (
            item[key].finishPercent == 0 ||
            (item[key].finishPercent == 1 && item[key].children.length > 0) ||
            (item[key].finishPercent == 2 && item[key].children.length > 0)
          ) {
            newAllGridChildArray[index][key] = item[key];
          }
        }
      });
      setAllGridGroupArray(newAllGridGroupArray);
      setAllGridTaskArray(newAllGridTaskArray);
      setAllGridChildArray(newAllGridChildArray);
      formatData(
        _.cloneDeep(newAllGridTaskArray),
        _.cloneDeep(newAllGridGroupArray)
      );
    } else {
      dispatch(setMessage(true, gridRes.msg, 'error'));
    }
  };
  const formatDate = () => {
    let newTaskNavDate: any = [];
    let newTaskNavDay: any = [];
    let newTaskNavWeek: any = [];
    for (let i = 0; i < 20; i += 1) {
      let taskDate = moment().add(i, 'days');
      newTaskNavDate.push(taskDate.date());
      newTaskNavDay.push({
        startTime: taskDate.startOf('day').valueOf(),
        endTime: taskDate.endOf('day').valueOf(),
        allTaskNum: 0,
      });
      newTaskNavWeek.push(moment().add(i, 'days').weekday());
    }
    setTaskNavDate(newTaskNavDate);
    setTaskNavDay(newTaskNavDay);
    setTaskNavWeek(newTaskNavWeek);
  };
  const formatPerson = () => {
    let newTaskNavDate: any = [];
    let newTaskNavDay: any = [];
    let newMemberArray = _.cloneDeep(memberArray);
    newMemberArray.forEach((item: any, index: number) => {
      newTaskNavDate.push(item);
      newTaskNavDay.push({
        userId: item.userId,
        allTaskNum: 0,
      });
    });
    setTaskNavDate(newTaskNavDate);
    setTaskNavDay(newTaskNavDay);
    // this.$nextTick(() => {
    //   avatarHeight = document.querySelectorAll(
    //     ".grid-label-td"
    //   )[0].clientWidth;
    // });
  };
  const getGroupData = (groupArray: any, taskArray: any) => {
    let arr: any = [];
    let newTaskNavDay = _.cloneDeep(taskNavDay);
    let newGridGroupArray: any = [];
    if (groupArray.length > 0 && taskArray.length > 0) {
      taskArray.forEach((item: any, index: number) => {
        arr[index] = {
          groupObj: groupArray[index],
          tabShow: true,
        };
        item.forEach((groupItem: any, groupIndex: number) => {
          if (groupItem.labelKey) {
            if (!arr[index][groupItem.labelKey]) {
              let labelIndex = _.findIndex(groupArray[index].labelArray, {
                _key: groupItem.labelKey,
              });
              arr[index][groupItem.labelKey] = {
                arr: [],
                labelObj: groupArray[index].labelArray[labelIndex],
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
            arr[index]['ToDo'].arr = sortArr(arr[index]['ToDo'].arr, groupItem);
          }
        });
      });
      if (headerIndex == 1) {
        groupArray[0].labelArray.forEach((item: any, index: number) => {
          if (Object.keys(arr[0]).indexOf(item._key) == -1) {
            arr[0][item._key] = {
              arr: [],
              labelObj: item,
            };
          }
        });
      }
      newGridGroupArray = _.cloneDeep(arr);
      newGridGroupArray = newGridGroupArray.map((item: any, index: number) => {
        item.arrlength = 0;
        for (let key in item) {
          if (
            key != 'groupObj' &&
            key != 'tabShow' &&
            key != 'arrlength' &&
            key != 'show'
          ) {
            item[key].tabShow = true;
            item[key].show = true;
            item[key].arr.forEach((arrItem: any, arrIndex: number) => {
              arrItem.dayArr = [];
              newTaskNavDay = newTaskNavDay.map(
                (dayItem: any, dayIndex: number) => {
                  let state = gridState
                    ? arrItem.taskEndDate >= dayItem.startTime &&
                      arrItem.taskEndDate < dayItem.endTime
                    : dayItem.userId == arrItem.executorKey;
                  if (state) {
                    arrItem.dayArr.push(arrItem.hour);
                    dayItem.allTaskNum = dayItem.allTaskNum + arrItem.hour;
                  } else {
                    arrItem.dayArr.push('');
                  }
                  return dayItem;
                }
              );
              if (arrItem.children && arrItem.children.length > 0) {
                arrItem.children.forEach(
                  (childItem: any, childIndex: number) => {
                    recurrenceData(arrItem.children, childIndex, index, null);
                  }
                );
              }
            });
            item.arrlength = item.arrlength + item[key].arr.length;
          }
        }
        return item;
      });
      newGridGroupArray = _.sortBy(newGridGroupArray, ['arrlength']).reverse();
      setGridGroupArray(newGridGroupArray);
      setTaskNavDay(newTaskNavDay);
      // this.groupArray.splice(0, 1, this.groupArray[0]);
    }
  };
  const sortArr = (arr: any, item: any) => {
    let time = 0;
    item.show = true;
    if (item.taskEndDate) {
      time = Math.floor(
        (moment(item.taskEndDate).endOf('day').valueOf() -
          moment(new Date().getTime()).endOf('day').valueOf()) /
          86400000
      );
    }
    item.endtime = {
      time: time < 0 ? Math.abs(time) : Math.abs(time) + 1,
      endState: time < 0 ? false : true,
    };
    arr.push(item);
    // arr = this._.sortBy(arr, ["taskEndDate"]).reverse();
    arr = _.sortBy(arr, ['finishPercent']);
    return arr;
  };
  const recurrenceData = (
    arr: any,
    arrIndex: number,
    groupIndex: number,
    taskItem: any
  ) => {
    let key = arr[arrIndex];
    let newAllGridChildArray = _.cloneDeep(allGridChildArray);
    let newTaskNavDay = _.cloneDeep(taskNavDay);
    arr[arrIndex] = newAllGridChildArray[groupIndex][key];
    arr[arrIndex].dayArr = [];
    newTaskNavDay = newTaskNavDay.map((dayItem: any, dayIndex: number) => {
      let state = gridState
        ? arr[arrIndex].taskEndDate >= dayItem.startTime &&
          arr[arrIndex].taskEndDate < dayItem.endTime
        : dayItem.userId == arr[arrIndex].executorKey;
      if (state) {
        arr[arrIndex].dayArr.push(arr[arrIndex].hour);
        dayItem.allTaskNum = dayItem.allTaskNum + arr[arrIndex].hour;
      } else {
        arr[arrIndex].dayArr.push('');
      }
      return dayItem;
    });
    if (arr[arrIndex].children && arr[arrIndex].children.length > 0) {
      arr[arrIndex].children.forEach((childItem: any, childIndex: number) => {
        recurrenceData(
          arr[arrIndex].children,
          childIndex,
          groupIndex,
          taskItem
        );
      });
    }
    setTaskNavDay(newTaskNavDay);
  };
  // showLabel(index, type) {
  //   this.groupArray[index].tabShow = type;
  //   for (let key in this.groupArray[index]) {
  //     if (
  //       key != "groupObj" &&
  //       key != "tabShow" &&
  //       key != "arrlength" &&
  //       key != "show"
  //     ) {
  //       this.groupArray[index][key].show = type;
  //     }
  //   }
  //   this.groupArray.splice(0, 1, this.groupArray[0]);
  // },
  // showTask(index, groupIndex, type) {
  //   this.groupArray[index][groupIndex].tabShow = type;
  //   this.groupArray[index][groupIndex].arr.forEach((taskItem, taskIndex) => {
  //     taskItem.show = type;
  //   });
  //   this.groupArray.splice(0, 1, this.groupArray[0]);
  //   // this.$set(this.groupArray[index], "tabShow");
  // },
  // chooseTaskTime(index, groupIndex, taskIndex, dateIndex) {
  //   this.groupArray[index][groupIndex].arr[taskIndex].taskEndDate =
  //     this.groupArray[index][groupIndex].arr[taskIndex].taskEndDate +
  //     (this.taskNavDay[dateIndex].startTime -
  //       this.$moment(
  //         this.groupArray[index][groupIndex].arr[taskIndex].taskEndDate
  //       )
  //         .startOf("day")
  //         .valueOf());
  //   this.editCard({
  //     key: this.groupArray[index][groupIndex].arr[taskIndex]._key,
  //     taskEndDate: this.groupArray[index][groupIndex].arr[taskIndex]
  //       .taskEndDate,
  //   });
  // },
  // async chooseTaskPerson(index, groupIndex, taskIndex, dateIndex) {
  //   await this.addGroupMember({
  //     param: {
  //       groupKey: this.groupArray[index].groupObj._key,
  //       targetUidList: [
  //         {
  //           userKey: this.taskNavDate[dateIndex].userId,
  //           nickName: this.taskNavDate[dateIndex].nickName,
  //           avatar: this.taskNavDate[dateIndex].avatar,
  //           gender: this.taskNavDate[dateIndex].gender,
  //           role: this.groupArray[index].groupObj.defaultPower,
  //         },
  //       ],
  //     },
  //     item: this.taskNavDate[dateIndex],
  //     type: "member",
  //   });
  //   await this.editCard({
  //     key: this.groupArray[index][groupIndex].arr[taskIndex]._key,
  //     executorKey: this.taskNavDay[dateIndex].userId,
  //   });
  // },
  // changeGridState(viewState) {
  //   if (
  //     (viewState == 4 && (this.groupType == 1 || this.groupType == 2)) ||
  //     (viewState == 2 && this.groupType == 3)
  //   ) {
  //     this.gridState = true;
  //   } else if (
  //     (viewState == 5 && (this.groupType == 1 || this.groupType == 2)) ||
  //     (viewState == 3 && this.groupType == 3)
  //   ) {
  //     this.gridState = false;
  //   }
  // },
  const formatData = (newTaskArray: any, newGroupArray: any) => {
    gridState ? formatDate() : formatPerson();
    getGroupData(newGroupArray, newTaskArray);
  };
  // playTreeAudio() {
  //   console.log("????????", this.$refs.treeAudio);
  //   this.$refs.treeAudio.play();
  // },
  const getItem = (item: any) => {
    let dom = [];
    for (let groupIndex in item) {
      let groupItem: any = item[groupIndex];
      dom.push(
        <div key={'group' + groupIndex} className="grid-group-item">
          {groupItem.labelObj && groupItem.show && groupItem.arr.length > 0 ? (
            <div>
              <div className="grid-title">
                <div
                  className="grid-title-subtitle"
                  style={{
                    paddingLeft: '60px',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    className="grid-grouptitle"
                    style={{ border: '0px', color: '#000' }}
                  >
                    <div className="point-label"></div>
                    {groupItem.labelObj.cardLabelName}
                  </div>
                </div>
                <div className="grid-label-tr">
                  {taskNavDate.map((dateItem: any, dateIndex: number) => {
                    return (
                      <div
                        key={'taskNavItem' + dateIndex}
                        style={{ border: '1px solid #fff' }}
                        className="grid-label-td"
                      ></div>
                    );
                  })}
                </div>
              </div>
              {groupItem.arr.map((taskItem: any, taskIndex: number) => {
                return (
                  <div
                    key={'task' + taskIndex}
                    className="grid-title-task chooseTr"
                  >
                    <div v-if="taskItem">
                      <GridTree
                        taskItem={taskItem}
                        left={45}
                        lineLeft={58}
                        gridState={gridState}
                        taskNavDate={taskNavDate}
                        taskNavDay={taskNavDay}
                        // @playTreeAudio="playTreeAudio"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      );
    }
    return dom;
  };
  return (
    <div className="grid">
      <div className="grid-group-date" style={{ height: '35px' }}>
        <div className="grid-date-label-title">任务数量统计</div>
        <div className="grid-date-label">
          {taskNavDay.length > 0
            ? taskNavDate.map((dateItem: any, dateIndex: number) => {
                return (
                  <React.Fragment key={'taskNavDate' + dateIndex}>
                    <div
                      style={{ border: '0px' }}
                      className="grid-label-td"
                      ref={labelRef}
                    ></div>
                    <div
                      style={{
                        background:
                          taskNavDay[dateIndex].allTaskNum > 8 &&
                          headerIndex == 1
                            ? '#E94848'
                            : taskNavDay[dateIndex].allTaskNum != 0
                            ? '#16AE7A'
                            : '#B6B6B6',
                        borderRadius: '50%',
                        width: '25px',
                        height: '25px',
                        textAlign: 'center',
                        lineHeight: '25px',
                      }}
                    >
                      {taskNavDay[dateIndex].allTaskNum > 0
                        ? taskNavDay[dateIndex].allTaskNum.toFixed(1)
                        : ''}
                    </div>
                  </React.Fragment>
                );
              })
            : null}
        </div>
      </div>
      <div className="grid-group-date">
        <div className="grid-date-label-title">
          {gridState ? '任务时间' : '执行人'}
        </div>
        <div className="grid-date-label">
          {taskNavDate.map((dateItem: any, dateIndex: number) => {
            return (
              <div
                key={'taskNavLabel' + dateIndex}
                className="grid-label-bottomTd"
                style={{
                  backgroundColor: gridState
                    ? taskNavWeek[dateIndex] > 4 && gridState
                      ? '#BABABA'
                      : '#505050'
                    : '',
                  paddingRight: '-1px',
                  boxSizing: 'border-box',
                }}
              >
                {gridState ? (
                  <React.Fragment>{dateItem}</React.Fragment>
                ) : (
                  <div
                    className="grid-label-td-avatar"
                    style={{
                      height: '35px',
                      borderRight:
                        dateIndex != taskNavDate.length - 1
                          ? '1px solid transparent'
                          : '0px',
                    }}
                  >
                    <div slot="title">{dateItem.nickName}</div>
                    <img src={dateItem.avatar} alt="" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid-container">
        {gridGroupArray.map((item: any, index: number) => {
          return (
            <div key={'gridGroup' + index}>
              {item.arrlength > 0 ? (
                <div className="grid-group-container">
                  {headerIndex != 3 ? (
                    <div className="grid-title">
                      <div
                        className="grid-title-subtitle"
                        style={{ color: '#000', paddingLeft: '30px' }}
                      >
                        <div className="grid-grouptitle">
                          <div className="point-group"></div>
                          {item.groupObj.groupName}
                        </div>
                      </div>
                      <div className="grid-label-tr">
                        {/* <div
              // v-for="(dateItem,dateIndex) in taskNavDate"
              key={dateIndex}
              className="grid-label-td"
              style={{border:'1px solid #fff'}}
              // :ref="'task'+dateIndex"
            ></div> */}
                      </div>
                    </div>
                  ) : null}
                  {getItem(item)}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Grid;
