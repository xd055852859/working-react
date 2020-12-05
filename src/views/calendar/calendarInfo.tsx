import React, { useState, useEffect } from 'react';
import './calendarInfo.css';
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
import plusPng from '../../assets/img/contact-plus.png';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
import deleteIconSvg from '../../assets/svg/deleteIcon.svg';
import Dialog from '../../components/common/dialog';
import Tooltip from '../../components/common/tooltip';
interface CalendarInfoProps {
  taskItem?: any;
  setCalendar: any;
  calendarColor: any;
  getData?: any;
  calendarType: string;
  onClose?: any
}
moment.locale('zh-cn');
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '150px',
    },
    dateRoot: {
      width: '80%',
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
  const { taskItem, setCalendar, calendarColor, getData, calendarType, onClose } = props;
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const userKey = useTypedSelector((state) => state.auth.userKey);
  const groupArray = useTypedSelector((state) => state.group.groupArray);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [calendarInfo, setCalendarInfo] = useState<any>({
    circleData: [],
    groupKeyArray: [],
    title: '',
    startDay: moment().startOf('day').valueOf(),
    endDay: moment().endOf('day').valueOf(),
    type: 2,
    taskType: 0,
  });
  const [calendarDay, setCalendarDay] = useState(moment());
  const [calendarIndex, setCalendarIndex] = useState(0);
  const [repeatIndex, setRepeatIndex] = useState(0);
  const [monthInput, setMonthInput] = useState('');
  const [dayInput, setDayInput] = useState('');
  const [groupVisible, setGroupVisible] = useState(false);
  const [calendarGroup, setCalendarGroup] = useState<any>([]);
  const [deleteDialogShow, setDeleteDialogShow] = useState(false);
  const weekStr = ['日', '一', '二', '三', '四', '五', '六'];
  const repeatStr = ['无', '日', '周', '月', '年'];
  useEffect(() => {
    if (taskItem) {
      let newTaskItem = _.cloneDeep(calendarInfo);
      for (let key in _.cloneDeep(taskItem)) {
        newTaskItem[key] = _.cloneDeep(taskItem)[key]
      }
      let newCalendarGroup = _.cloneDeep(calendarGroup);
      if (!newTaskItem.circleData) {
        newTaskItem.circleData = [];
      }
      if (!newTaskItem.groupKeyArray) {
        newTaskItem.groupKeyArray = [];
      }
      setCalendarInfo(newTaskItem);
    }
  }, [taskItem]);
  const changeWeekArr = (num: number) => {
    let newCalendarInfo = _.cloneDeep(calendarInfo);
    let weekIndex = newCalendarInfo.circleData.indexOf(num);
    if (weekIndex === -1) {
      newCalendarInfo.circleData.push(num);
    } else {
      newCalendarInfo.circleData.splice(weekIndex, 1);
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
      newCalendarInfo.startDay = date.valueOf();
    } else if ((type = 'end')) {
      newCalendarInfo.endDay = date.valueOf();
    }
    setCalendarInfo(newCalendarInfo);
    setCalendar(newCalendarInfo);
  };
  const chooseCalendarGroup = (item: any) => {
    let newCalendarInfo = _.cloneDeep(calendarInfo);
    let newCalendarGroup = _.cloneDeep(calendarGroup);
    let groupIndex = newCalendarGroup.indexOf(item._key);
    if (groupIndex === -1) {
      newCalendarGroup.push(item);
      newCalendarInfo.groupKeyArray.push(item._key);
    } else {
      newCalendarGroup.splice(groupIndex, 1);
      newCalendarInfo.groupKeyArray.splice(groupIndex, 1);
    }
    setCalendarGroup(newCalendarGroup);
    setCalendarInfo(newCalendarInfo);
    setCalendar(newCalendarInfo);
  };
  const deleteTask = async (calendar: any) => {
    setDeleteDialogShow(false);
    let deleteRes: any = await api.task.deleteTask(
      calendar._key,
      calendar.groupKey
    );
    if (deleteRes.msg === 'OK') {
      dispatch(setMessage(true, '删除成功', 'success'));
      getData(moment(calendar.startDay).startOf('month').startOf('day').valueOf(), moment(calendar.endDay).endOf('month').startOf('day').valueOf());
      onClose();
    } else {
      dispatch(setMessage(true, deleteRes.msg, 'error'));
    }
  };
  return (
    <div className="calendarInfo">
      <div className="calendarInfo-title">
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
      <div className="calendarInfo-item">
        <div className="calendarInfo-item-title">开始时间</div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="yyyy-MM-DD"
            margin="normal"
            id="date-picker-inline"
            // label="开始日期"
            value={moment(calendarInfo.startDay)}
            onChange={(date) => {
              changeDate(date, 'start');
            }}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            className={classes.dateRoot}
          />
        </MuiPickersUtilsProvider>
      </div>
      <div className="calendarInfo-item">
        <div className="calendarInfo-item-title">结束时间</div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="yyyy-MM-DD"
            margin="normal"
            id="date-picker-inline"
            // label="截止日期"
            value={moment(calendarInfo.endDay)}
            onChange={(date) => {
              changeDate(date, 'end');
            }}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            className={classes.dateRoot}
          />
        </MuiPickersUtilsProvider>
      </div>
      <div className="calendarInfo-item calendarInfo-repeat-item">
        <div className="calendarInfo-item-title">重复</div>
        <div className="calendarInfo-repeat">
          <div className="calendarInfo-week">
            {repeatStr.map((repeatItem: any, repeatStrIndex: number) => {
              return (
                <div
                  key={'repeat' + repeatStrIndex}
                  onClick={() => {
                    let newCalendarInfo = _.cloneDeep(calendarInfo);
                    setRepeatIndex(repeatStrIndex);
                    newCalendarInfo.repeatCircle = repeatStrIndex;
                    newCalendarInfo.type = repeatStrIndex > 0 ? 1 : 2;
                    setCalendarInfo(newCalendarInfo);
                    setCalendar(newCalendarInfo);
                  }}
                  className="calendarInfo-week-item"
                  style={
                    repeatIndex === repeatStrIndex
                      ? { backgroundColor: '#17B881', color: '#fff' }
                      : {}
                  }
                >
                  {repeatItem}
                </div>
              );
            })}
          </div>
          {repeatIndex === 4 ? (
            <div className="calendarInfo-repeat-input">
              <input
                type="number"
                value={monthInput}
                onChange={(e: any) => {
                  let newCalendarInfo = _.cloneDeep(calendarInfo);
                  if (e.target.value > 12) {
                    e.target.value = 12;
                  }
                  setMonthInput(e.target.value);
                  if (!newCalendarInfo.circleData[0]) {
                    newCalendarInfo.circleData[0] = {};
                  }
                  newCalendarInfo.circleData[0].month =
                    parseInt(e.target.value) - 1;
                  setCalendarInfo(newCalendarInfo);
                  setCalendar(newCalendarInfo);
                }}
                max="12"
              />
              月
            </div>
          ) : null}
          {repeatIndex >= 3 ? (
            <div className="calendarInfo-repeat-input">
              <input
                type="number"
                value={dayInput}
                onChange={(e: any) => {
                  let newCalendarInfo = _.cloneDeep(calendarInfo);
                  if (e.target.value > 31) {
                    e.target.value = 31;
                  }
                  setDayInput(e.target.value);
                  if (repeatIndex === 4) {
                    if (!newCalendarInfo.circleData[0]) {
                      newCalendarInfo.circleData[0] = {};
                    }

                    newCalendarInfo.circleData[0].date = parseInt(
                      e.target.value
                    );
                  } else {
                    newCalendarInfo.circleData[0] = parseInt(e.target.value);
                  }
                  setCalendarInfo(newCalendarInfo);
                  setCalendar(newCalendarInfo);
                }}
                max="31"
              />
              日
            </div>
          ) : null}
          {repeatIndex === 2 ? (
            <div className="calendarInfo-week">
              {weekStr.map((weekItem: any, weekIndex: number) => {
                return (
                  <div
                    key={'week' + weekIndex}
                    onClick={() => {
                      changeWeekArr(weekIndex);
                    }}
                    className="calendarInfo-week-item"
                    style={
                      calendarInfo.circleData.indexOf(weekIndex) !== -1
                        ? { backgroundColor: '#17B881', color: '#fff' }
                        : {}
                    }
                  >
                    {weekItem}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
      <div className="calendarInfo-item">
        <div className="calendarInfo-item-title">提醒</div>
        <div className="calendarInfo-item-notice">无</div>
      </div>
      <div className="calendarInfo-item">
        <div className="calendarInfo-item-title">颜色</div>
        <div className="calendarInfo-item-color">
          {calendarColor.map((colorItem: any, colorIndex: number) => {
            return (
              <div
                style={{
                  backgroundColor: colorItem,
                  width: '25px',
                  height: '25px',
                }}
                key={'color' + colorIndex}
                className="calendarItem-color-title"
                onClick={() => {
                  let newCalendarInfo = _.cloneDeep(calendarInfo);
                  setCalendarIndex(colorIndex);
                  newCalendarInfo.taskType = colorIndex;
                  setCalendarInfo(newCalendarInfo);
                  setCalendar(newCalendarInfo);
                }}
              >
                {calendarIndex === colorIndex ? (
                  <div className="calendarItem-color-point"></div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
      {calendarType === '编辑' ? (
        // <div className="taskItem-check-icon">
        <img
          src={deleteIconSvg}
          alt="删除"
          onClick={() => {
            setDeleteDialogShow(true);
          }}
          className="calendarInfo-delete-icon"
        />
        // </div>
      ) : null}
      {/* <div className="calendarInfo-icon">
        <div className="calendarInfo-icon-title">图标选择：</div>
        <div></div>
      </div> */}
      {calendarType === '新建' ? (
        <div className="calendarInfo-icon">
          <div className="calendarInfo-icon-title">复制到日程表：</div>
          <div className="calendarInfo-icon-container">
            {calendarGroup.map((iconItem: any, iconIndex: number) => {
              return (
                <div className="calendarInfo-group" key={'icon' + iconIndex}>
                  <div className="calendarInfo-group-item">
                    <img
                      src={
                        iconItem.groupLogo
                          ? iconItem.groupLogo
                          : defaultGroupPng
                      }
                      alt=""
                    />
                  </div>
                  <Tooltip title={iconItem.groupName}>
                    <div className="calendarInfo-group-title">
                      {iconItem.groupName}
                    </div>
                  </Tooltip>
                </div>
              );
            })}

            <div
              className="calendarInfo-group"
              onClick={() => {
                setGroupVisible(true);
              }}
            >
              <div className="calendarInfo-group-item calendarInfo-group-add">
                <img src={plusPng} alt="" />
              </div>
              <div className="calendarInfo-group-title">新增</div>
            </div>
          </div>

        </div>
      ) : null}
      <Dialog
        visible={groupVisible}
        dialogStyle={{
          position: 'fixed',
          width: '245px',
          maxHeight: '90%',
          bottom: '5%',
          left: 'calc(50% + 205px)',
          color: '#333',
          overflow: 'auto',
        }}
        onClose={() => {
          setGroupVisible(false);
        }}
        showMask={false}
        footer={false}
      >
        <div className="calendarInfo-group-box">
          {groupArray.map((groupItem: any, groupIndex: number) => {
            return (
              <div
                className="calendarInfo-group-box-container"
                key={'group' + groupIndex}
                onClick={() => {
                  chooseCalendarGroup(groupItem);
                }}
                style={
                  calendarGroup.indexOf(groupItem._key) !== -1
                    ? { backgroundColor: '#efefef' }
                    : {}
                }
              >
                <div className="calendarInfo-group-box-item">
                  <img
                    src={
                      groupItem.groupLogo
                        ? groupItem.groupLogo
                        : defaultGroupPng
                    }
                    alt=""
                  />
                </div>
                <Tooltip title={groupItem.groupName}>
                  <div className="calendarInfo-group-title">
                    {groupItem.groupName}
                  </div>
                </Tooltip>
              </div>
            );
          })}
        </div>
      </Dialog>
      <Dialog
        visible={deleteDialogShow}
        onClose={() => {
          setDeleteDialogShow(false);
        }}
        onOK={() => {
          deleteTask(calendarInfo);
        }}
        title={'删除日程'}
        dialogStyle={{ width: '400px', height: '200px' }}
      >
        <div className="dialog-onlyTitle">是否删除该日程</div>
      </Dialog>
    </div>
  );
};
CalendarInfo.defaultProps = {};
export default CalendarInfo;
