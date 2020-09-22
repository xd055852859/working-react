import React, { useState, useEffect } from 'react';
import './calendarItem.css';
import { useDispatch } from 'react-redux';
import DateFnsUtils from '@date-io/moment';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { Button, TextField, Checkbox } from '@material-ui/core';
import _ from 'lodash';
import 'moment/locale/zh-cn';
import moment from 'moment';
import DropMenu from '../../components/common/dropMenu';
interface CalendarItemProps {
  onClose: any;
  calendarStyle: Object;
  visible: Boolean;
  targetDay: any;
}
moment.locale('zh-cn');
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '145px',
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
    hourInput: {
      width: '100px',
      color: '#fff',
      marginTop: '24px',
      marginLeft: '10px',
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
        marginTop: '-17px',
        // color: '#fff',
      },
    },
    datePicker: {
      '& .MuiInput-formControl': {
        marginLeft: '5px',
      },
    },
  })
);
const CalendarItem: React.FC<CalendarItemProps> = (props) => {
  const { onClose, calendarStyle, visible, targetDay } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [calendarInput, setCalendarInput] = useState('');
  const [calendarDay, setCalendarDay] = useState(moment());
  const [calendarHour, setCalendarHour] = useState(moment().format('HH:mm'));
  const [calendarCheck, setCalendarCheck] = useState(false);
  const [calendarIndex, setCalendarIndex] = useState(0);
  const [calendarColorVisible, setCalendarColorVisible] = useState(false);
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
  useEffect(() => {
    if (targetDay) {
      setCalendarDay(targetDay);
    }
  }, [targetDay]);
  const handleDateChange = (date: any) => {
    setCalendarDay(date.startOf('day'));
  };
  const saveCalendarItem = () => {
    const calendarTime = calendarDay.format('yyyy-MM-DD') + ' ' + calendarHour;
    console.log(moment(calendarTime).valueOf());
  };
  return (
    <React.Fragment>
      {visible ? (
        <div className="calendarItem" style={calendarStyle}>
          <div className="calendarItem-title">
            <TextField
              // required
              id="outlined-basic"
              variant="outlined"
              label="日程标题"
              className={classes.input}
              value={calendarInput}
              autoComplete="off"
              onChange={(e) => {
                setCalendarInput(e.target.value);
              }}
            />
          </div>
          <div className="calendarItem-time">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="yyyy-MM-DD"
                margin="normal"
                id="date-picker-inline"
                label="日期"
                value={calendarDay}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                className={classes.root}
              />
            </MuiPickersUtilsProvider>
            <TextField
              id="time"
              label="时间"
              type="time"
              value={calendarHour}
              className={classes.hourInput}
              // className={classes.textField}
              onChange={(e) => {
                setCalendarHour(e.target.value);
              }}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 60, // 5 min
              }}
            />
            <div
              style={{ color: calendarColor[calendarIndex] }}
              className="calendarItem-color"
              onClick={() => {
                setCalendarColorVisible(true);
              }}
            >
              <div
                style={{ backgroundColor: calendarColor[calendarIndex] }}
                className="calendarItem-color-title"
              ></div>
              颜色
              <DropMenu
                visible={calendarColorVisible}
                dropStyle={{
                  width: '180px',
                  height: '80px',
                  top: '40px',
                  left: '0px',
                  color: '#333',
                }}
                onClose={() => {
                  setCalendarColorVisible(false);
                }}
              >
                <div className="calendarItem-color-info">
                  {calendarColor.map((colorItem: any, colorIndex: number) => {
                    return (
                      <div
                        style={{
                          backgroundColor: colorItem,
                          width: '25px',
                          height: '25px',
                        }}
                        className="calendarItem-color-title"
                        onClick={() => {
                          setCalendarIndex(colorIndex);
                        }}
                      ></div>
                    );
                  })}
                </div>
              </DropMenu>
            </div>
            <div>
              <Checkbox
                checked={calendarCheck}
                onChange={(e) => {
                  setCalendarCheck(e.target.checked);
                }}
              />
              提醒
            </div>
          </div>
          <div className="calendarItem-button">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                saveCalendarItem();
              }}
              style={{ marginRight: '10px', color: '#fff' }}
            >
              确定
            </Button>
            <Button variant="contained" onClick={onClose}>
              取消
            </Button>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
};
CalendarItem.defaultProps = {};
export default CalendarItem;
