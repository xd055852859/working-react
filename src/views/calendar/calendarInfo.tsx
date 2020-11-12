import React, { useState, useEffect } from 'react';
import './calendarItem.css';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../redux/reducer/RootState';
import DateFnsUtils from '@date-io/moment';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { Button, TextField, Checkbox } from '@material-ui/core';
import { setMessage } from '../../redux/actions/commonActions';
import { getCalendarList, editTask } from '../../redux/actions/taskActions';
import _ from 'lodash';
import api from '../../services/api';
import 'moment/locale/zh-cn';
import moment from 'moment';

interface CalendarInfoProps {
  taskItem?: any;
  setCalendar: any;
}
moment.locale('zh-cn');
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '150px',
    },
    dateRoot: {
      width: '45%',
    },
    input: {
      width: '100%',
      color: '#fff',
      '& .MuiInput-formControl': {
        marginTop: '0px',
        borderColor: '#fff',
      },
      '& .MuiOutlinedInput-input': {
        padding: '10px 14px',
        borderColor: '#fff',
        // color: '#fff',
      },
      '& .MuiInputLabel-formControl': {
        marginTop: '-10px',
        // color: '#fff',
      },
    },
  })
);
const CalendarInfo: React.FC<CalendarInfoProps> = (props) => {
  const { taskItem, setCalendar } = props;
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const userKey = useTypedSelector((state) => state.auth.userKey);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [calendarInfo, setCalendarInfo] = useState<any>({
    repeatWeek: [],
    title: '',
    taskStartDate: moment().startOf('day').valueOf(),
    taskEndDate: moment().endOf('day').valueOf(),
  });
  const [calendarDay, setCalendarDay] = useState(moment());
  const weekStr = [
    { name: '星期一', id: 1 },
    { name: '星期二', id: 2 },
    { name: '星期三', id: 3 },
    { name: '星期四', id: 4 },
    { name: '星期五', id: 5 },
    { name: '星期六', id: 6 },
    { name: '星期日', id: 0 },
  ];
  useEffect(() => {
    if (taskItem) {
      let newTaskItem = _.cloneDeep(taskItem);
      if (!newTaskItem.repeatWeek) {
        newTaskItem.repeatWeek = [];
      }
      setCalendarInfo(newTaskItem);
    }
  }, [taskItem]);
  const changeWeekArr = (num: number) => {
    let newCalendarInfo = _.cloneDeep(calendarInfo);
    let weekIndex = newCalendarInfo.repeatWeek.indexOf(num);
    if (weekIndex === -1) {
      newCalendarInfo.repeatWeek.push(num);
    } else {
      newCalendarInfo.repeatWeek.splice(weekIndex, 1);
    }
    setCalendarInfo(newCalendarInfo);
    setCalendar(newCalendarInfo);
  };
  const changeTitle = (e: any) => {
    let newCalendarInfo = _.cloneDeep(calendarInfo);
    newCalendarInfo.title = e.target.value;
    setCalendarInfo(newCalendarInfo);
    setCalendar(newCalendarInfo);
  };
  const changeDate = (date: any, type: string) => {
    let newCalendarInfo = _.cloneDeep(calendarInfo);
    if (type === 'start') {
      newCalendarInfo.taskStartDate = date.valueOf();
    } else if ((type = 'end')) {
      newCalendarInfo.taskEndDate = date.valueOf();
    }
    setCalendarInfo(newCalendarInfo);
    setCalendar(newCalendarInfo);
  };
  return (
    <div className="calendarInfo">
      <div className="calendarItem-title">
        <TextField
          // required
          id="outlined-basic"
          variant="outlined"
          label="日程标题"
          className={classes.input}
          value={calendarInfo.title}
          autoComplete="off"
          onChange={changeTitle}
        />
      </div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="yyyy-MM-DD"
          margin="normal"
          id="date-picker-inline"
          // label="开始日期"
          value={moment(calendarInfo.taskStartDate)}
          onChange={(date) => {
            changeDate(date, 'start');
          }}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          className={classes.dateRoot}
        />
      </MuiPickersUtilsProvider>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="yyyy-MM-DD"
          margin="normal"
          id="date-picker-inline"
          // label="截止日期"
          value={moment(calendarInfo.taskEndDate)}
          onChange={(date) => {
            changeDate(date, 'end');
          }}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          className={classes.dateRoot}
        />
      </MuiPickersUtilsProvider>
      <div className="calendarInfo-week">
        {weekStr.map((weekItem: any, weekIndex: number) => {
          return (
            <div
              key={'week' + weekIndex}
              onClick={() => {
                changeWeekArr(weekItem.id);
              }}
              className="calendarInfo-week-item"
              style={
                calendarInfo.repeatWeek.indexOf(weekItem.id) !== -1
                  ? { backgroundColor: '#696969', color: '#fff' }
                  : {}
              }
            >
              {weekItem.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};
CalendarInfo.defaultProps = {};
export default CalendarInfo;
