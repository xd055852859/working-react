import React, { useState, useEffect } from 'react';
import DateFnsUtils from '@date-io/moment';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import './taskInfo.css';
import _ from 'lodash';
import 'moment/locale/zh-cn';
import moment from 'moment';
interface TaskInfoProps {
  taskInfo: any;
}
// pick a date util library
moment.locale('zh-cn');
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: '0px',
    },
  })
);
const TaskInfo: React.FC<TaskInfoProps> = (prop) => {
  const { taskInfo } = prop;
  const classes = useStyles();
  const [taskItem, setTaskItem] = useState<any>(null);
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const handleDateChange = (date: any) => {
    console.log(date);
    // setSelectedDate(date);
  };
  useEffect(() => {
    if (taskInfo) {
      setTaskItem(_.cloneDeep(taskInfo));
    }
  }, [taskInfo]);
  return (
    <div className="taskInfo">
      {taskItem ? (
        <React.Fragment>
          <div className="taskInfo-mainTitle"></div>
          <div
            className="taskInfo-title"
            suppressContentEditableWarning
            contentEditable
          >
            {taskInfo.title}
          </div>
          <div className="taskInfo-item">
            <div className="taskInfo-item-title">开始</div>
            <div className="taskInfo-item-info">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="yyyy-MM-DD"
                  margin="normal"
                  id="date-picker-inline"
                  label="Date picker inline"
                  value={startDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                  className={classes.root}
                />
              </MuiPickersUtilsProvider>
            </div>
          </div>
          <div className="taskInfo-item">
            <div className="taskInfo-item-title">截止</div>
            <div className="taskInfo-item-info">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="yyyy-MM-DD"
                  margin="normal"
                  id="date-picker-inline"
                  label="Date picker inline"
                  value={endDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                  className={classes.root}
                />
              </MuiPickersUtilsProvider>
            </div>
          </div>
          <div className="taskInfo-item">
            <div className="taskInfo-item-title">工时</div>
            <div></div>
          </div>
          <div className="taskInfo-item">
            <div className="taskInfo-item-title">标签</div>
            <div className="taskInfo-item-suggest">建议</div>
          </div>
          <div className="taskInfo-item">
            <div className="taskInfo-item-title">关注</div>
            <div></div>
          </div>
          <div></div>
          <div></div>
        </React.Fragment>
      ) : null}
    </div>
  );
};
TaskInfo.defaultProps = {
  taskInfo: null,
};
export default TaskInfo;
