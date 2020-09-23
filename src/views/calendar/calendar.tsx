import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './calendar.css';
import CalendarItem from './calendarItem';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import traditionalDate from '../../components/common/date';
import { setMessage } from '../../redux/actions/commonActions';
import { getCalendarList } from '../../redux/actions/taskActions';
import CalendarHeader from './calendarHeader';
import moment from 'moment';
import _ from 'lodash';
import api from '../../services/api';
interface CalendarProps {}

const Calendar: React.FC<CalendarProps> = (props) => {
  const {} = props;
  const dispatch = useDispatch();
  const calendarList = useTypedSelector((state) => state.task.calendarList);
  const [calendarDate, setCalendarDate] = useState<any>([]);
  const [calendarDay, setCalendarDay] = useState(moment());
  // const [calendarList, setCalendarList] = useState<any>(null);
  const [itemVisible, setItemVisible] = useState(false);
  const [pos, setPos] = useState<number[]>([0, 0]);
  const [targetMonth, setTargetMonth] = useState('');
  const [taskList, setTaskList] = useState<any>([]);
  const [calendarStartTime, setCalendarStartTime] = useState(
    moment().startOf('month').startOf('day').valueOf()
  );
  const [calendarEndTime, setCalendarEndTime] = useState(
    moment().endOf('month').endOf('day').valueOf()
  );
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
    '#39B98D',
    '#3C8FB5',
    '#B762BD',
    '#86B93F',
    '#8B572A',
    '#D0021B',
    '#F5A623',
    '#FC766A',
    '#4A4A4A',
    '#9B9B9B',
  ];
  const calendarRef: React.RefObject<any> = useRef();
  useEffect(() => {
    if (calendarList) {
      getCalendar(moment(), calendarList);
      setTargetMonth(
        moment().format('YYYY') + '年' + moment().format('MM') + '月'
      );
    }
  }, [calendarList]);
  useEffect(() => {
    const dom: any = document.querySelectorAll('.calendar-day-item');
    if (dom.length > 0) {
      console.log(dom[0].offsetTop, dom[0].offsetLeft);
      console.log(dom[0].offsetHeight, dom[0].offsetWidth);
    }
  });
  // const getData = async (startTime: number, endTime: number) => {
  //   let res: any = await api.task.;
  //   if (res.msg == 'OK') {
  //     setCalendarList(res.result);
  //   } else {
  //     dispatch(setMessage(true, res.msg, 'error'));
  //   }
  // };
  const getMonthDays = (momentObj: any) => {
    return momentObj.daysInMonth();
  };
  const getWeekDays = (momentObj: any) => {
    return momentObj.startOf('month').weekday(); //
  };
  const getCalendar = (targetDate: any, taskList: any) => {
    // 获得当前月的天数  和 第一天的星期数
    let newTaskList = _.cloneDeep(taskList);

    let curDays = getMonthDays(targetDate); // 当前天数
    let curWeek = getWeekDays(targetDate.clone()); // 当前月第一天的星期(索引值)
    let upDays = getMonthDays(targetDate.clone().subtract(1, 'month')); // 上月的天数
    // console.log(curDays, curWeek, upDays);
    // console.log(
    //   moment(targetDate.subtract(1, 'month').month() + 1 + '-' + upDays)
    // );
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
        strDate.push({
          month: 'last',
          day: upDays,
          date: momentDate,
          startTime: momentDate.startOf('day').valueOf(),
          endTime: momentDate.endOf('day').valueOf(),
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
          startTime: momentDate.startOf('day').valueOf(),
          endTime: momentDate.endOf('day').valueOf(),
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
          startTime: momentDate.startOf('day').valueOf(),
          endTime: momentDate.endOf('day').valueOf(),
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
      taskList.forEach((taskItem: any, taskIndex: number) => {
        if (
          taskItem.taskEndDate >= dateItem.startTime &&
          taskItem.taskEndDate <= dateItem.endTime
        ) {
          newTaskList[dateIndex].push(taskItem);
        }
      });
      newTaskList[dateIndex] = _.sortBy(newTaskList[dateIndex], [
        'taskEndDate',
      ]);
    });
    setTaskList(newTaskList);
    setCalendarDate(strDate);
  };
  // {traditionalDate.GetLunarDay(moment())[1]}
  const getMousePos = (e: any, index: number) => {
    //alert('x: ' + x + '\ny: ' + y);

    // const calendarWidth = calendarRef.current.offsetWidth * 0.148;
    // console.log(calendarWidth);
    // console.log(e.pageX, e.pageY);
    // console.log(index % 7);
    let pageX = e.pageX;
    let pageY = e.pageY;
    if ((index + 1) % 7 === 0 && index !== 0) {
      pageX = pageX - 400;
      setPos([e.pageX, e.pageY]);
    } else if (index % 7 !== 0) {
      pageX = pageX - 200;
    }
    if (index > 20) {
      pageY = pageY - 240;
    }
    setPos([pageX, pageY + 20]);
  };
  const reorder = (list: any, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };
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
    let newCalendarDate = _.cloneDeep(calendarDate);
    console.log('????????????', result);
    // dropped outside the list
    // if (!destination) {
    //   return;
    // }
    // if (source.droppableId === destination.droppableId) {
    //   const items = reorder(
    //     newCalendarDate[parseInt(source.droppableId)],
    //     source.index,
    //     destination.index
    //   );
    //   newCalendarDate[parseInt(source.droppableId)] = items;
    //   console.log(items);
    // } else {
    //   const result = move(
    //     newCalendarDate[parseInt(source.droppableId)],
    //     newCalendarDate[parseInt(destination.droppableId)],
    //     source,
    //     destination
    //   );
    //   console.log(result);
    //   // newCalendarDate[parseInt(source.droppableId)] = result[source.droppableId];
    //   // newCalendarDate[parseInt(destination.droppableId)] =
    //   //   result[destination.droppableId];
    // }
  };
  return (
    <div className="calendar">
      <CalendarHeader />
      <div className="calendar-container">
        <div className="calendar-title">{targetMonth}</div>
        <div className="calendar-week">
          {weekArr.map((weekItem: any, weekIndex: number) => {
            return (
              <div key={'week' + weekIndex} className="calendar-week-item">
                {weekItem}
              </div>
            );
          })}
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="calendar-day" ref={calendarRef}>
            {calendarDate.map((calendarItem: any, calendarIndex: number) => {
              return (
                <Droppable
                  droppableId={calendarItem.date + ''}
                  key={'calendarItem' + calendarIndex}
                  direction="horizontal"
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      key={'calendar' + calendarIndex}
                      className="calendar-day-item"
                      onClick={(e) => {
                        setItemVisible(true);
                        getMousePos(e, calendarIndex);
                        setCalendarDay(moment(calendarItem.startTime));
                      }}
                      style={{
                        backgroundColor:
                          ((calendarIndex + 2) % 7 === 0 ||
                            (calendarIndex + 1) % 7 === 0) &&
                          calendarIndex !== 0
                            ? '#F9F9F9'
                            : '',
                        border: calendarItem.targetDay
                          ? '2px solid #17B881'
                          : '',
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
                        {taskList[calendarIndex].map(
                          (taskItem: any, taskIndex: number) => {
                            return (
                              <Draggable
                                key={'task' + taskIndex}
                                draggableId={taskItem._key}
                                index={taskIndex}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="calendar-day-item-info"
                                    // style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                    style={{
                                      borderLeft:
                                        '2px solid ' +
                                        calendarColor[taskItem.taskType],
                                    }}
                                  >
                                    {moment(taskItem.taskEndDate).format(
                                      'HH:mm'
                                    ) + ' '}
                                    {taskItem.title}
                                  </div>
                                )}
                              </Draggable>
                            );
                          }
                        )}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </DragDropContext>
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
      />
    </div>
  );
};
Calendar.defaultProps = {};
export default Calendar;
