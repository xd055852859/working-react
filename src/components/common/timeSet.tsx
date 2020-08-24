import React, { useState, useEffect } from 'react';
import './timeSet.css';
import moment from 'moment';
interface timeSetProp {
  timeSetClick: any;
  dayNumber: number | null;
  timeNumber: number | null;
}

const TimeSet: React.FC<timeSetProp> = (prop) => {
  const { dayNumber, timeSetClick, timeNumber } = prop;
  const [timeDate, setTimeDate] = useState<any>([]);
  const [timeWeek, setTimeWeek] = useState<any>([]);
  const timeArray = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    0.1,
    0.2,
    0.3,
    0.4,
    0.5,
    0.6,
    0.7,
    0.8,
    0.9,
  ];
  useEffect(() => {
    if (timeDate.length == 0) {
      mouthDate();
    }
  }, [timeDate]);
  const mouthDate = () => {
    let timeDate = [];
    let timeWeek = [];
    // const weekString = [
    //   "星期一",
    //   "星期二",
    //   "星期三",
    //   "星期四",
    //   "星期五",
    //   "星期六",
    //   "星期日",
    // ];
    for (let i = 0; i < 30; i += 1) {
      timeDate.push(moment().add(i, 'days').date());
      // weeks[i] = weekString[
      //   this.$moment("2020-03-05")
      //     .add(i, "days")
      //     .weekday()
      // ];
      timeWeek.push(moment().add(i, 'days').weekday());
    }
    console.log(timeDate);
    setTimeDate(timeDate);
    setTimeWeek(timeWeek);
  };
  console.log(timeDate);
  return (
    <React.Fragment>
      <div className="timeSet">
        {/* <div
    :iconSvg="clock"
    fontSize="17px"
    color="#000"
    style="{ margin: '0px 9px 0px 0px',display:'flex' }"
  /> */}
        {timeArray.map((timeItem: any, timeIndex: number) => {
          return (
            <div
              key={'time' + timeIndex}
              // className="timeSet-item"
              onClick={() => {
                timeSetClick('hour', timeItem);
              }}
              className="timeSet-time-item"
              style={{
                borderColor:
                  timeNumber == timeItem
                    ? '#F28806  transparent transparent transparent'
                    : '#35a6f8 transparent transparent transparent',
              }}
            >
              {timeItem}
            </div>
          );
        })}
      </div>
      {/* v-if="dateType" */}
      <div className="timeSet-date">
        {timeDate.map((dateItem: any, dateIndex: number) => {
          return (
            <div
              key={'date' + dateIndex}
              className="timeSet-date-item"
              onClick={() => {
                timeSetClick('day', dateItem);
              }}
              style={{
                backgroundColor:
                  dayNumber == dateItem
                    ? '#F28806'
                    : timeWeek[dateIndex] > 4
                    ? '#BABABA'
                    : '#505050',
              }}
            >
              {dateItem}
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};
TimeSet.defaultProps = {
  timeSetClick: null,
  dayNumber: 0,
  timeNumber: 0,
};
export default TimeSet;
