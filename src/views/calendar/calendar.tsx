import React, { useState, useEffect, useRef } from 'react';
import './calendar.css';
import CalendarItem from './calendarItem';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import traditionalDate from '../../components/common/date';
import CalendarHeader from './calendarHeader';
import Dialog from '../../components/common/dialog';
import moment from 'moment';

interface CalendarProps {}

const Calendar: React.FC<CalendarProps> = (props) => {
  const {} = props;
  const user = useTypedSelector((state) => state.auth.user);
  const [calendarDate, setCalendarDate] = useState<any>([]);
  const [calendarDay, setCalendarDay] = useState(moment());
  const [itemVisible, setItemVisible] = useState(false);
  const [pos, setPos] = useState<number[]>([0, 0]);
  const [targetMonth, setTargetMonth] = useState('');
  const weekArr = [
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
    '星期日',
  ];
  const calendarRef: React.RefObject<any> = useRef();
  useEffect(() => {
    if (user && user._key) {
      getCalendar(moment());
      setTargetMonth(
        moment().format('YYYY') + '年' + moment().format('MM') + '月'
      );
    }
  }, [user]);

  const getMonthDays = (momentObj: any) => {
    return momentObj.daysInMonth();
  };
  const getWeekDays = (momentObj: any) => {
    return momentObj.startOf('month').weekday(); //
  };
  const getCalendar = (targetDate: any) => {
    // 获得当前月的天数  和 第一天的星期数
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
    console.log(strDate);
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
        <div className="calendar-day" ref={calendarRef}>
          {calendarDate.map((calendarItem: any, calendarIndex: number) => {
            return (
              <div
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
                  border: calendarItem.targetDay ? '2px solid #17B881' : '',
                }}
              >
                <div className="calendar-day-item-title">
                  {calendarItem.day}日 (
                  {traditionalDate.GetLunarDay(calendarItem.date)[2]})
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
      />
    </div>
  );
};
Calendar.defaultProps = {};
export default Calendar;
