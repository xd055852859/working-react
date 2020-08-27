import React, { useState, useEffect } from 'react';
import './timeSet.css';
import moment from 'moment';
import timeSet1Png from '../../assets/img/timeSet1.png';
import timeSet2Png from '../../assets/img/timeSet2.png';
import timeSet3Png from '../../assets/img/timeSet3.png';
import timeSet4Png from '../../assets/img/timeSet4.png';
import timeSet5Png from '../../assets/img/timeSet5.png';
import timeSet6Png from '../../assets/img/timeSet6.png';
interface timeSetProp {
  timeSetClick: any;
  dayNumber: number | null;
  timeNumber: number | null;
  percentClick?: any;
}

const TimeSet: React.FC<timeSetProp> = (prop) => {
  const { dayNumber, timeSetClick, timeNumber, percentClick } = prop;
  console.log('timeNumber', timeNumber);
  const [timeDate, setTimeDate] = useState<any>([]);
  const [timeWeek, setTimeWeek] = useState<any>([]);
  const [timeMonth, setTimeMonth] = useState<any>([]);
  const [timeDateArray, setTimeDateArray] = useState<any>([]);
  const [timeDateType, setTimeDateType] = useState(0);
  const [dateIndex, setdateIndex] = useState(0);
  const timeArray = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
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
      changeDateIndex(timeDateType);
    }
  }, [timeDate]);
  // useEffect(() => {
  //   if (timeDateType) {
  //     setTimeDateArray(timeMonth);
  //   } else {
  //     setTimeDateArray(timeDate);
  //   }
  // }, [timeDateType]);
  const mouthDate = () => {
    let timeDate = [];
    let timeWeek = [];
    let timeMonth = [];

    // const weekString = [
    //   "星期一",
    //   "星期二",
    //   "星期三",
    //   "星期四",
    //   "星期五",
    //   "星期六",
    //   "星期日",
    // ];
    for (let i = 0; i < 28; i += 1) {
      timeMonth.push(moment().add(i, 'days').date());
      // weeks[i] = weekString[
      //   this.$moment("2020-03-05")
      //     .add(i, "days")
      //     .weekday()
      // ];
      timeWeek.push(moment().add(i, 'days').weekday());
      timeDate.push(i + 1);
    }
    setTimeDate(timeDate);
    setTimeWeek(timeWeek);
    setTimeMonth(timeMonth);
    setTimeDateArray(timeDate);
  };
  const changeDateIndex = (timeDateType: number) => {
    let dateTime = 0;
    let dateIndex = 0;
    if (timeDateType) {
      dateIndex = moment(dayNumber).date();
    } else {
      dateTime =
        Math.floor(
          (moment(dayNumber).endOf('day').valueOf() -
            moment().endOf('day').valueOf()) /
            86400000
        ) + 1;
      dateIndex = dateTime > 0 ? dateTime : 0;
    }
    console.log(timeDateType);
    console.log(dateIndex);
    setdateIndex(dateIndex);
  };
  const changeTimeDateType = (timeDateType: number) => {
    if (timeDateType) {
      setTimeDateArray(timeMonth);
    } else {
      setTimeDateArray(timeDate);
    }
    changeDateIndex(timeDateType);
    setTimeDateType(timeDateType);
  };
  return (
    <React.Fragment>
      <div className="timeSet">
        <div className="timeSet-time-logo">
          <img
            src={timeSet1Png}
            onClick={() => {
              percentClick(10);
            }}
          />
          <img
            src={timeSet2Png}
            onClick={() => {
              percentClick(0);
            }}
          />
          <img
            src={timeSet3Png}
            onClick={() => {
              percentClick(1);
            }}
          />
          <img
            src={timeSet4Png}
            onClick={() => {
              percentClick(2);
            }}
            style={{ width: '17px', height: '16px' }}
          />
        </div>
        <div className="timeSet-time-info">
          {timeArray.map((timeItem: any, timeIndex: number) => {
            return (
              <div
                key={'time' + timeIndex}
                // className="timeSet-item"
                onClick={() => {
                  timeSetClick('hour', timeItem);
                }}
                className="timeSet-time-item"
              >
                {timeItem}
                <div
                  className="timeSet-time-choose"
                  style={{
                    borderColor:
                      timeNumber == timeItem
                        ? '#F28806  transparent transparent transparent'
                        : '#35a6f8 transparent transparent transparent',
                  }}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
      {/* v-if="dateType" */}
      <div className="timeSet-date">
        <div className="timeSet-date-logo">
          <img
            src={timeSet5Png}
            onClick={() => {
              changeTimeDateType(0);
            }}
          />
          <img
            src={timeSet6Png}
            style={{ width: '17px', height: '14px' }}
            onClick={() => {
              changeTimeDateType(1);
            }}
          />
        </div>
        <div className="timeSet-date-info">
          {timeDateArray.map((dateTimeItem: any, dateTimeIndex: number) => {
            return (
              <div
                key={'date' + dateTimeIndex}
                className="timeSet-date-item"
                onClick={() => {
                  timeSetClick('day', dateTimeItem);
                }}
                style={{
                  backgroundColor:
                    dateIndex == dateTimeItem
                      ? '#F28806'
                      : timeWeek[dateTimeIndex] > 4
                      ? '#BABABA'
                      : '#505050',
                }}
              >
                {dateTimeItem}
              </div>
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
};
TimeSet.defaultProps = {
  timeSetClick: null,
  dayNumber: 0,
  timeNumber: 0,
  percentClick: null,
};
export default TimeSet;
