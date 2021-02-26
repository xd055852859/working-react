import React, { useState, useEffect, useRef } from 'react';
import './calendar.css';
import { Checkbox } from '@material-ui/core';
import CalendarItem from './calendarItem';
import CalendarInfo from './calendarInfo';
import { Button, ClickAwayListener } from '@material-ui/core';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import traditionalDate from '../../components/common/date';
import { setMessage } from '../../redux/actions/commonActions';
import {
  setTaskKey,
  setChooseKey,
  getCalendarList,
  editTask,
  getWorkingTableTask,
  changeTaskInfoVisible,
  setTaskInfo,
} from '../../redux/actions/taskActions';
import CalendarHeader from './calendarHeader';
import DropMenu from '../../components/common/dropMenu';
import Loading from '../../components/common/loading';
import moment from 'moment';
import _, { truncate } from 'lodash';
import api from '../../services/api';
import Dialog from '../../components/common/dialog';
import rightArrowPng from '../../assets/img/rightArroww.png';
import leftArrowPng from '../../assets/img/leftArroww.png';
import unfinishPng from '../../assets/img/timeSet2.png';
import finishPng from '../../assets/img/timeSet3.png';
import downArrowPng from '../../assets/img/downArrow.png';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
interface CalendarProps {
  targetGroupKey: string;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: '#fff',
    },
  })
);
const Calendar: React.FC<CalendarProps> = (props) => {
  const { targetGroupKey } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  // const calendarList = useTypedSelector((state) => state.task.calendarList);
  const groupArray = useTypedSelector((state) => state.group.groupArray);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const user = useTypedSelector((state) => state.auth.user);
  const moveState = useTypedSelector((state) => state.common.moveState);
  // const workingTaskArray = useTypedSelector(
  //   (state) => state.task.workingTaskArray
  // );
  const theme = useTypedSelector((state) => state.auth.theme);
  const [calendarDate, setCalendarDate] = useState<any>([]);
  const [calendarDay, setCalendarDay] = useState(moment());
  const [calendarObj, setCalendarObj] = useState<any>({});
  const [calendarType, setCalendarType] = useState('');
  const [calendar, setCalendar] = useState<any>(null);
  const [positionList, setPositionList] = useState<any>([]);
  const [itemVisible, setItemVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [pos, setPos] = useState<number[]>([0, 0]);
  const [targetMonth, setTargetMonth] = useState('');
  const [taskList, setTaskList] = useState<any>({ arr: [], repeatArr: [] });
  const [monthTaskList, setMonthTaskList] = useState<any>([]);
  const [taskItem, setTaskItem] = useState<any>(null);
  const [futureTime, setFutureTime] = useState<any>(0);
  const [calendarStartTime, setCalendarStartTime] = useState(
    moment().startOf('month').startOf('day').valueOf()
  );
  const [loading, setLoading] = useState(false);
  const [calendarEndTime, setCalendarEndTime] = useState(
    moment().endOf('month').endOf('day').valueOf()
  );
  const [groupVisible, setGroupVisible] = useState(false);
  const [calendarGroupArray, setCalendarGroupArray] = useState<any>(null);
  const [calendarGroupIndex, setCalendarGroupIndex] = useState<any>(0);
  const [calendarGroupKey, setCalendarGroupKey] = useState<any>(mainGroupKey);
  const [followList, setFollowList] = useState<any>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [followEdit, setFollowEdit] = useState(false);

  const weekArr = [
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
    '星期日',
  ];
  const calendarColor = [
    '#E8A861',
    '#9DC85E',
    '#39B98D',
    '#3970B9',
    '#9E5CCF',
    '#DA4949',
  ];
  const calendarRef: React.RefObject<any> = useRef();
  let unDistory = true;
  useEffect(() => {
    let newCalendarGroupArray: any = [];
    if (groupArray) {
      newCalendarGroupArray = _.cloneDeep(groupArray);
      newCalendarGroupArray.unshift({
        _key: mainGroupKey,
        groupName: user.profile.nickName,
        groupLogo: user.profile.avatar,
      });
      setCalendarGroupArray(newCalendarGroupArray);
    }
  }, [groupArray]);
  useEffect(() => {
    if (targetGroupKey) {
      setCalendarGroupKey(targetGroupKey);
    }
  }, [targetGroupKey]);

  useEffect(() => {
    if (calendarGroupKey) {
      getData(calendarStartTime, calendarEndTime);
    }
    return () => {
      unDistory = false;
    };
  }, [calendarGroupKey]);
  useEffect(() => {
    if (calendarObj && JSON.stringify(calendarObj) !== '{}') {
      // setLoading(false);
      getCalendar(moment(calendarStartTime), calendarObj);
      setTargetMonth(
        moment(calendarStartTime).format('YYYY') +
          '年' +
          moment(calendarEndTime).format('MM') +
          '月'
      );
    }
  }, [calendarObj]);
  useEffect(() => {
    if (positionList.length == 0) {
      let newPositionList: any = [];
      const dom: any = document.querySelectorAll('.calendar-day-item');
      if (dom.length > 0) {
        Array.from(dom).forEach((item: any, index: number) => {
          const startTop = item.offsetTop;
          const endTop = startTop + item.offsetHeight;
          const startLeft = item.offsetLeft + 320;
          const endLeft = startLeft + item.offsetWidth;
          newPositionList.push({
            startTop: startTop,
            endTop: endTop,
            startLeft: startLeft,
            endLeft: endLeft,
          });
        });
        setPositionList(newPositionList);
      }
    }
  });
  const getData = async (startTime: number, endTime: number) => {
    let res: any = await api.task.getScheduleList(
      [calendarGroupKey],
      startTime,
      endTime
    );
    if (unDistory) {
      if (res.msg == 'OK') {
        let newCalendarObj = _.cloneDeep(calendarObj);
        newCalendarObj.arr = res.result.getNoCircleScheduleList;
        newCalendarObj.repeatArr = res.result.validEvents;
        setCalendarObj(newCalendarObj);
      } else {
        dispatch(setMessage(true, res.msg, 'error'));
      }
    }
  };
  const getMonthDays = (momentObj: any) => {
    return momentObj.daysInMonth();
  };
  const getWeekDays = (momentObj: any) => {
    return momentObj.startOf('month').weekday(); //
  };
  const getCalendar = (targetDate: any, taskList: any) => {
    // 获得当前月的天数  和 第一天的星期数
    // let newTaskList = _.cloneDeep(taskList);
    let newTaskList: any = [];
    let curDays = getMonthDays(targetDate); // 当前天数
    let curWeek = getWeekDays(targetDate.clone()); // 当前月第一天的星期(索引值)
    let upDays = getMonthDays(targetDate.clone().subtract(1, 'month')); // 上月的天数
    // 生成的结构
    let strDate: any = [];
    // 下个月的起始日期
    let nextFirstDate = 0;
    for (let i = 0; i < 35; i++) {
      // 1. 当前月的上一个月
      if (i < curWeek) {
        // 返回的索引值刚好是上月在当月显示的天数
        let momentDate = moment(
          targetDate.year() +
            '-' +
            (targetDate.clone().subtract(1, 'month').month() + 1) +
            '-' +
            upDays
        );
        strDate.unshift({
          month: 'last',
          day: upDays,
          date: momentDate,
          week: momentDate.day(),
          startTime: momentDate.startOf('day').valueOf(),
          endTime: momentDate.endOf('day').valueOf(),
          targetMonth: momentDate.month(),
        });
        upDays--; // 倒叙显示   30 31
      } else if (i >= curDays + curWeek) {
        //去除掉当月天数+上月天数就是下月天数
        // 2. 当前月的下一个月：除去当月最后一天+上月的几天剩余的是下月开始计算
        // curWeek 返回值刚好是上月占用的天数
        nextFirstDate++;
        let momentDate = moment(
          targetDate.year() +
            '-' +
            (targetDate.clone().add(1, 'month').month() + 1) +
            '-' +
            nextFirstDate
        );
        strDate.push({
          month: 'next',
          day: nextFirstDate,
          date: momentDate,
          week: momentDate.day(),
          startTime: momentDate.startOf('day').valueOf(),
          endTime: momentDate.endOf('day').valueOf(),
          targetMonth: momentDate.month(),
        });
      } else {
        // 3. 当前月
        // i-curWeek+1 为当前月的天数
        // date()获取日期号
        // m.date() == i - curWeek + 1说明这一天是当月当天，添加样式
        let currentClass =
          targetDate.date() == i - curWeek + 1 ? 'current' : '';
        if (
          targetDate.year() != moment().year() ||
          targetDate.month() != moment().month()
        ) {
          currentClass = '';
        }
        let momentDate = moment(
          targetDate.year() +
            '-' +
            (targetDate.clone().month() + 1) +
            '-' +
            (i - curWeek + 1)
        );
        let obj: any = {
          month: 'target',
          day: i - curWeek + 1,
          date: momentDate,
          week: momentDate.day(),
          startTime: momentDate.startOf('day').valueOf(),
          endTime: momentDate.endOf('day').valueOf(),
          targetMonth: momentDate.month(),
        };
        if (
          momentDate.startOf('day').valueOf() ===
          moment().startOf('day').valueOf()
        ) {
          obj.targetDay = true;
        }
        strDate.push(obj);
      }
    }
    strDate.forEach((dateItem: any, dateIndex: number) => {
      newTaskList[dateIndex] = [];
      taskList.arr.forEach((taskItem: any, taskIndex: number) => {
        if (
          taskItem.taskEndDate >= dateItem.startTime &&
          taskItem.taskEndDate <= dateItem.endTime
        ) {
          newTaskList[dateIndex].push(taskItem);
        }
      });
      taskList.repeatArr.forEach((taskItem: any, taskIndex: number) => {
        let findIndex = _.findIndex(taskList.arr, {
          origionalKey: taskItem.key,
          taskEndDate: dateItem.endTime,
        });
        if (
          (taskItem.repeatCircle === 1 ||
            (taskItem.repeatCircle === 2 &&
              taskItem.circleData.indexOf(dateItem.week) !== -1) ||
            (taskItem.repeatCircle === 3 &&
              taskItem.circleData.indexOf(dateItem.day) !== -1) ||
            (taskItem.repeatCircle === 4 &&
              taskItem.circleData[0].month == dateItem.targetMonth &&
              taskItem.circleData[0].date == dateItem.day)) &&
          moment().endOf('day').valueOf() <= dateItem.startTime &&
          taskItem.startDay <= dateItem.startTime &&
          dateItem.endTime <= taskItem.endDay &&
          findIndex === -1
        ) {
          newTaskList[dateIndex].push(taskItem);
        }
      });
      // if (executorCheck) {
      //   _.flatten(_.cloneDeep(workingTaskArray)).forEach(
      //     (taskItem: any, taskIndex: number) => {
      //       if (
      //         taskItem.taskEndDate >= dateItem.startTime &&
      //         taskItem.taskEndDate <= dateItem.endTime &&
      //         taskItem.executorKey == userKey
      //       ) {
      //         newTaskList[dateIndex].push(taskItem);
      //       }
      //     }
      //   );
      // }
      // if (creatorCheck) {
      //   _.flatten(_.cloneDeep(workingTaskArray)).forEach(
      //     (taskItem: any, taskIndex: number) => {
      //       if (
      //         taskItem.taskEndDate >= dateItem.startTime &&
      //         taskItem.taskEndDate <= dateItem.endTime &&
      //         taskItem.creatorKey == userKey &&
      //         taskItem.executorKey != userKey
      //       ) {
      //         newTaskList[dateIndex].push(taskItem);
      //       }
      //     }
      //   );
      // }
      // newTaskList[dateIndex] = _.sortBy(newTaskList[dateIndex], [
      //   'taskEndDate',
      // ]);
    });
    setMonthTaskList(newTaskList);
    setCalendarDate(strDate);
  };
  // {traditionalDate.GetLunarDay(moment())[1]}
  const getMousePos = (e: any, index: number) => {
    //alert('x: ' + x + '\ny: ' + y);

    // const calendarWidth = calendarRef.current.offsetWidth * 0.148;
    let pageX = e.pageX;
    let pageY = e.pageY;
    if ((index + 1) % 7 === 0 && index !== 0) {
      pageX = pageX - 300;
      setPos([e.pageX, e.pageY]);
    } else if (index % 7 !== 0) {
      pageX = pageX - 150;
    }
    if (index > 20) {
      pageY = pageY - 240;
    }
    setPos([pageX, pageY + 20]);
  };
  const dragTask = (e: any, dragIndex: number, taskIndex: number) => {
    let newPositionList = _.cloneDeep(positionList);
    let newTaskList = _.cloneDeep(taskList);
    let newTaskItem = newTaskList[dragIndex][taskIndex];
    let diffTime = 0;
    newTaskList[dragIndex].splice(taskIndex, 1);
    newPositionList.forEach((item: any, index: number) => {
      if (
        e.clientX > item.startLeft &&
        e.clientX < item.endLeft &&
        e.clientY > item.startTop &&
        e.clientY < item.endTop
      ) {
        diffTime =
          calendarDate[index].endTime - calendarDate[dragIndex].endTime;
        newTaskItem.taskEndDate = newTaskItem.taskEndDate + diffTime;
        newTaskList[index].push(newTaskItem);
        newTaskList[index] = _.sortBy(newTaskList[index], ['taskEndDate']);
      }
    });

    setTaskList(newTaskList);
    dispatch(editTask({ key: newTaskItem._key, ...newTaskItem }, headerIndex));
    dispatch(setTaskInfo(newTaskItem));
  };

  const changeMonth = (type: number) => {
    let newCalendarStartTime = 0;
    let newCalendarEndTime = 0;
    //当前时间
    if (type == 0) {
      newCalendarStartTime = moment(calendarStartTime)
        .subtract(1, 'month')
        .startOf('month')
        .startOf('day')
        .valueOf();
      newCalendarEndTime = moment(calendarStartTime)
        .subtract(1, 'month')
        .endOf('month')
        .endOf('day')
        .valueOf();
    } else {
      newCalendarStartTime = moment(calendarStartTime)
        .add(1, 'month')
        .startOf('month')
        .startOf('day')
        .valueOf();
      newCalendarEndTime = moment(calendarStartTime)
        .add(1, 'month')
        .endOf('month')
        .endOf('day')
        .valueOf();
    }
    setCalendarStartTime(newCalendarStartTime);
    setCalendarEndTime(newCalendarEndTime);
    getData(newCalendarStartTime, newCalendarEndTime);
  };
  const clickTask = (e: any, taskItem: any, calendarIndex: number) => {
    if (taskItem.type == 5) {
      setItemVisible(true);
      setTaskItem(taskItem);
      getMousePos(e, calendarIndex);
    } else if (taskItem.type == 2) {
      dispatch(setTaskKey(taskItem._key));
      dispatch(setChooseKey(taskItem._key));
      dispatch(changeTaskInfoVisible(true));
    }
    e.stopPropagation();
  };
  const changeFinishPercent = (taskItem: any) => {
    let newTaskItem = _.cloneDeep(taskItem);
    // taskDetail.finishPercent = finishPercent !== 0 ? 0 : 1;
    newTaskItem.finishPercent = newTaskItem.finishPercent === 0 ? 1 : 0;
    if (newTaskItem.finishPercent === 1) {
      newTaskItem.taskEndDate = moment().valueOf();
    }
    // else if (newTaskItem.finishPercent === 0) {
    //   newTaskItem.todayTaskTime = 0;
    // }
    dispatch(
      editTask(
        {
          key: newTaskItem._key,
          ...newTaskItem,
        },
        1
      )
    );
    dispatch(setTaskInfo(newTaskItem));
  };
  const getCalendarItem = (e: any, taskItem: any, calendarIndex: number) => {
    if (taskItem.type === 8) {
      const canlendarIndex = _.findIndex(calendarObj.repeatArr, {
        _key: taskItem.origionalKey,
      });
      if (canlendarIndex !== -1) {
        taskItem.circleData = calendarObj.repeatArr[canlendarIndex].circleData;
        taskItem.repeatCircle =
          calendarObj.repeatArr[canlendarIndex].repeatCircle;
      }
    }
    setFutureTime(calendarDate[calendarIndex].startTime);
    setCalendar(taskItem);
    setCalendarType('编辑');
    setInfoVisible(true);
    e.stopPropagation();
  };
  const saveCalendar = async () => {
    let newCalendar = _.cloneDeep(calendar);
    let newTaskList = _.cloneDeep(taskList);
    if (newCalendar && !newCalendar.title) {
      dispatch(setMessage(true, '请输入日程标题', 'error'));
      return;
    }
    if (newCalendar.groupKeyArray && newCalendar.groupKeyArray.length === 0) {
      newCalendar.groupKeyArray = [mainGroupKey];
    }
    if (calendarType === '新建') {
      if (
        newCalendar.startDay === newCalendar.endDay &&
        newCalendar.repeatCircle
      ) {
        dispatch(setMessage(true, '循环日程请选择正确的结束时间', 'error'));
        return;
      }
      let calendarRes: any = await api.task.createSchedule(newCalendar);
      if (calendarRes.msg === 'OK') {
        dispatch(setMessage(true, '创建日程成功', 'success'));
        getData(calendarStartTime, calendarEndTime);
        setInfoVisible(false);
      } else {
        dispatch(setMessage(true, calendarRes.msg, 'error'));
      }
    } else if (calendarType === '编辑') {
      if (isEdit) {
        let obj: any = {
          repeatCircle: newCalendar.repeatCircle,
          circleData: newCalendar.circleData,
          title: newCalendar.title,
          groupKey: newCalendar.groupKey,
          content: '',
          icon: '',
          taskType: newCalendar.taskType,
        };
        if (
          moment().startOf('day').valueOf() === futureTime ||
          newCalendar.taskEndDate < moment().startOf('day').valueOf()
        ) {
          //今天
          obj.type1 = 1;
          obj.type2 = newCalendar.calendarEditType === 2 ? 2 : 1;
        } else if (moment().endOf('day').valueOf() < futureTime) {
          //未来
          obj.type1 = 2;
          obj.type2 =
            !newCalendar.type || newCalendar.calendarEditType === 2
              ? // ? newCalendar.type === 8
                //   ? 2
                //   : 3
                2
              : 1;
          obj.futureTime = futureTime;
        }
        if (newCalendar.type === 8) {
          obj.taskKey = newCalendar._key;
          obj.eventKey = newCalendar.origionalKey;
          obj.taskEndDate = newCalendar.taskEndDate;
        } else {
          obj.eventKey = newCalendar._key;
        }
        let calendarRes: any = await api.task.changeCircleSchedule(obj);
        if (calendarRes.msg === 'OK') {
          dispatch(setMessage(true, '编辑日程成功', 'success'));
          getData(calendarStartTime, calendarEndTime);
          setInfoVisible(false);
        } else {
          dispatch(setMessage(true, calendarRes.msg, 'error'));
        }
      } else if (followEdit) {
        let obj: any = { followUKeyArray: followList };
        if (newCalendar.origionalKey && newCalendar.calendarEditType === 2) {
          obj.eventKey = newCalendar.origionalKey;
        } else if (!newCalendar.type) {
          obj.eventKey = newCalendar._key;
        } else {
          obj.cardKey = newCalendar._key;
        }
        let followRes: any = await api.task.setEventFollowUser(obj);
        if (followRes.msg === 'OK') {
          console.log(followRes);
          dispatch(setMessage(true, '编辑日程成功', 'success'));
          setInfoVisible(false);
        } else {
          dispatch(setMessage(true, followRes.msg, 'error'));
        }
      } else {
        setInfoVisible(false);
      }
    }
  };
  return (
    <div className="calendar">
      {/* targetGroupKey || moveState === 'in' ? '100%' : 'calc(100% - 320px)', */}
      {loading ? <Loading /> : null}
      {!targetGroupKey ? (
        <React.Fragment>
          <CalendarHeader />
          <div
            className="calendar-name"
            onClick={() => {
              setGroupVisible(true);
            }}
          >
            <div className="calendar-logo" style={{ borderRadius: '5px' }}>
              <img
                src={
                  calendarGroupArray &&
                  calendarGroupArray[calendarGroupIndex].groupLogo
                    ? calendarGroupArray[calendarGroupIndex].groupLogo +
                      '?imageMogr2/auto-orient/thumbnail/80x'
                    : defaultGroupPng
                }
                alt=""
              />
            </div>
            <div className="calendar-name-title">
              {calendarGroupArray &&
                calendarGroupArray[calendarGroupIndex].groupName}
            </div>
            <img
              src={downArrowPng}
              alt=""
              className="calendar-name-title-logo"
            />
            <DropMenu
              visible={groupVisible}
              dropStyle={{
                width: '300px',
                height: '500px',
                top: '55px',
                left: '0px',
                color: '#333',
                overflow: 'visible',
              }}
              onClose={() => {
                setGroupVisible(false);
              }}
              title={'日程列表'}
            >
              <ClickAwayListener
                onClickAway={() => {
                  setGroupVisible(false);
                }}
              >
                <React.Fragment>
                  {calendarGroupArray
                    ? calendarGroupArray.map(
                        (
                          calendarGroupItem: any,
                          calendarGroupIndex: number
                        ) => {
                          return (
                            <div
                              className="calendar-dropmenu-name"
                              onClick={() => {
                                setCalendarGroupIndex(calendarGroupIndex);
                                setCalendarGroupKey(calendarGroupItem._key);
                              }}
                              key={'group' + calendarGroupIndex}
                            >
                              <div className="calendar-logo">
                                <img src={calendarGroupItem.groupLogo} alt="" />
                              </div>
                              <div className="calendar-name-title">
                                {calendarGroupItem.groupName}
                              </div>
                            </div>
                          );
                        }
                      )
                    : null}
                </React.Fragment>
              </ClickAwayListener>
            </DropMenu>
          </div>
        </React.Fragment>
      ) : null}
      <div
        className="calendar-container"
        style={{ height: targetGroupKey ? '100%' : 'calc(100% - 68px)' }}
      >
        <div className="calendar-title">
          <img
            src={leftArrowPng}
            className="calendar-choose-icon"
            onClick={() => {
              changeMonth(0);
            }}
          />
          {targetMonth}
          <img
            src={rightArrowPng}
            className="calendar-choose-icon"
            onClick={() => {
              changeMonth(1);
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setInfoVisible(true);
              setCalendar(null);
              setCalendarType('新建');
            }}
            style={{ color: '#fff' }}
          >
            创建日程
          </Button>
          {/* <div className="calendar-choose-check">
            <Checkbox
              checked={executorCheck}
              onChange={(e) => {
                setExecutorCheck(e.target.checked);
              }}
              color="primary"
              className={classes.root}
            />
            任务
          </div>
          <div className="calendar-choose-check">
            <Checkbox
              checked={creatorCheck}
              onChange={(e) => {
                setCreatorCheck(e.target.checked);
              }}
              color="primary"
              className={classes.root}
            />
            指派
          </div> */}
        </div>
        <div className="calendar-week">
          {weekArr.map((weekItem: any, weekIndex: number) => {
            return (
              <div key={'week' + weekIndex} className="calendar-week-item">
                {weekItem}
              </div>
            );
          })}
        </div>
        <div className="calendar-day" ref={calendarRef}>
          {calendarDate.map((calendarItem: any, calendarIndex: number) => {
            return (
              <div
                key={'calendar' + calendarIndex}
                className="calendar-day-item"
                onClick={(e) => {
                  setInfoVisible(true);
                  setCalendarType('新建');
                  setCalendar({
                    startDay: moment(calendarItem.startTime)
                      .startOf('day')
                      .valueOf(),
                    endDay: moment(calendarItem.endTime)
                      .startOf('day')
                      .valueOf(),
                  });
                }}
                style={{
                  // backgroundColor:
                  //   ((calendarIndex + 2) % 7 === 0 ||
                  //     (calendarIndex + 1) % 7 === 0) &&
                  //   calendarIndex !== 0
                  //     ? '#F9F9F9'
                  //     : '',
                  border: calendarItem.targetDay ? '4px solid #17B881' : '',
                }}
              >
                <div className="calendar-day-item-title">
                  {calendarItem.day}日 (
                  {traditionalDate.GetLunarDay(calendarItem.date)[2]})
                  {calendarItem.targetDay ? (
                    <span
                      style={{
                        color: '#17B881',
                        marginLeft: '5px',
                      }}
                    >
                      今日
                    </span>
                  ) : null}
                </div>
                <div className="calendar-day-item-container">
                  {monthTaskList[calendarIndex].map(
                    (taskItem: any, taskIndex: number) => {
                      return (
                        <div
                          key={'task' + taskIndex}
                          className="calendar-day-item-info"
                          // style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                          style={{
                            borderLeft:
                              '2px solid ' + calendarColor[taskItem.taskType],
                            textDecoration:
                              taskItem.finishPercent === 2
                                ? 'line-through'
                                : '',
                          }}
                          // onDragEnd={(e: any) => {
                          //   dragTask(e, calendarIndex, taskIndex);
                          // }}
                          // draggable="true"
                          onClick={(e: any) => {
                            getCalendarItem(e, taskItem, calendarIndex);
                            // clickTask(e, taskItem, calendarIndex);
                          }}
                          tabIndex={taskItem._key}
                        >
                          {taskItem.type == 5 ? (
                            <React.Fragment>
                              {moment(taskItem.taskEndDate).format('HH:mm') +
                                ' '}
                            </React.Fragment>
                          ) : taskItem.type == 2 ? (
                            <img
                              src={
                                taskItem.finishPercent ? finishPng : unfinishPng
                              }
                              style={{
                                width: '12px',
                                height: '12px',
                                marginRight: '5px',
                              }}
                              onClick={() => {}}
                            />
                          ) : null}
                          {taskItem.title}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <CalendarItem
        visible={itemVisible}
        onClose={() => {
          setItemVisible(false);
        }}
        calendarStyle={{
          top: pos[1] + 'px',
          left: pos[0] + 'px',
        }}
        targetDay={calendarDay}
        calendarColor={calendarColor}
        calendarStartTime={calendarStartTime}
        calendarEndTime={calendarEndTime}
        taskItem={taskItem}
      />
      <Dialog
        visible={infoVisible}
        onClose={() => {
          setInfoVisible(false);
        }}
        onOK={() => {
          // deleteTask();
          saveCalendar();
        }}
        title={calendarType + '日程'}
        dialogStyle={{ width: '400px', height: '90%' }}
      >
        <CalendarInfo
          setCalendar={setCalendar}
          setFollowList={setFollowList}
          taskItem={calendar}
          calendarColor={calendarColor}
          getData={getData}
          calendarType={calendarType}
          onClose={() => {
            setInfoVisible(false);
          }}
          targetGroupKey={targetGroupKey ? targetGroupKey : mainGroupKey}
          changeEdit={(isEdit: boolean) => {
            setIsEdit(isEdit);
          }}
          changeFollowEdit={(followEdit: boolean) => {
            setFollowEdit(followEdit);
          }}
        />
      </Dialog>
    </div>
  );
};
Calendar.defaultProps = {};
export default Calendar;
