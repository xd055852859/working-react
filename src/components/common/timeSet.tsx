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
  dayNumber: number;
  timeNumber: number | null;
  endDate?: number;
  percentClick?: any;
  timestate?: string;
  viewStyle?: string;
}

const TimeSet: React.FC<timeSetProp> = (prop) => {
  const {
    dayNumber,
    timeSetClick,
    timeNumber,
    endDate,
    percentClick,
    timestate,
    viewStyle,
  } = prop;
  const [timeDate, setTimeDate] = useState<any>([]);
  const [timeWeek, setTimeWeek] = useState<any>([]);
  const [timeMonth, setTimeMonth] = useState<any>([]);
  const [timeDateArray, setTimeDateArray] = useState<any>([]);
  const [timeDateType, setTimeDateType] = useState(0);
  const [dateIndex, setdateIndex] = useState(0);
  const timeArray = !viewStyle
    ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
    : [1, 2, 3, 4, 5, 6, 7, 8, 9, 0.1, 0.2, 0.3, 0.4, 0.5];
  useEffect(() => {
    if (timeDate.length === 0) {
      mouthDate();
      changeDateIndex(timeDateType);
    }
  }, [timeDate]);
  useEffect(() => {
    changeDateIndex(timeDateType);
  }, [dayNumber]);
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
    let targetDate = !viewStyle ? 28 : 15;
    for (let i = 0; i < targetDate; i += 1) {
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
      dateIndex = moment()
        .add(dayNumber - 1, 'day')
        .endOf('day')
        .date();
    } else {
      if (dayNumber >= 0) {
        dateIndex = dayNumber;
      } else {
        dateIndex = 0;
      }
    }
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
      {!viewStyle ? (
        <div className="timeSet-title">
          预计工时 <span>{timeNumber + '小时'}</span>
        </div>
      ) : null}
      <div
        className="timeSet"
        style={
          !viewStyle
            ? {
                width: '100%',
                height: '55px',
                marginBottom: '10px',
                padding: '5px 10px',
              }
            : { height: '30px' }
        }
      >
        {!timestate ? (
          <div
            className="timeSet-time-logo"
            style={
              !viewStyle
                ? { width: '45px', height: '40px' }
                : {
                    height: '30px',
                    alignItems: 'center',
                    alignContent: 'initial',
                    margin: '0px 15px',
                  }
            }
          >
            <img
              src={timeSet1Png}
              onClick={() => {
                percentClick(10);
              }}
              style={{ marginRight: !viewStyle ? '' : '10px' }}
            />
            <img
              src={timeSet2Png}
              onClick={() => {
                percentClick(0);
              }}
              style={{ marginRight: !viewStyle ? '' : '10px' }}
            />
            <img
              src={timeSet3Png}
              onClick={() => {
                percentClick(1);
              }}
              style={{ marginRight: !viewStyle ? '' : '10px' }}
            />
            <img
              src={timeSet4Png}
              onClick={() => {
                percentClick(2);
              }}
              style={{
                width: '17px',
                height: '16px',
                marginRight: !viewStyle ? '' : '10px',
              }}
            />
          </div>
        ) : null}
        <div
          className="timeSet-time-info"
          style={
            !viewStyle
              ? { width: '230px', height: '40px' }
              : { height: '30px', alignItems: 'center' }
          }
        >
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
                  marginBottom: !viewStyle ? '5px' : '0px',
                }}
              >
                {timeItem}
                <div
                  className="timeSet-time-choose"
                  style={{
                    borderColor:
                      timeNumber === timeItem
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
      {!timestate ? (
        <React.Fragment>
          {!viewStyle ? (
            <div className="timeSet-title">
              到期时间<span>{moment(endDate).format('YYYY-MM-DD')}</span>
            </div>
          ) : null}
          <div
            className="timeSet-date"
            style={
              !viewStyle
                ? { width: '100%', height: '55px', padding: '5px 10px',marginTop:'20px' }
                : { height: '30px', marginLeft: '10px' }
            }
          >
            <div
              className="timeSet-date-logo"
              style={
                !viewStyle
                  ? { width: '45px', height: '40px' }
                  : {
                      height: '30px',
                      alignItems: 'center',
                      alignContent: 'initial',
                      margin: '0px 15px',
                    }
              }
            >
              <img
                src={timeSet5Png}
                onClick={() => {
                  changeTimeDateType(0);
                }}
                style={{ marginRight: !viewStyle ? '' : '10px' }}
              />
              <img
                src={timeSet6Png}
                style={{
                  width: '17px',
                  height: '14px',
                  marginRight: !viewStyle ? '' : '10px',
                }}
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
                      timeSetClick('day', dateTimeIndex + 1);
                    }}
                    style={{
                      backgroundColor:
                        dateIndex === dateTimeItem
                          ? '#F28806'
                          : timeWeek[dateTimeIndex] > 4
                          ? '#BABABA'
                          : '#505050',
                      marginBottom: !viewStyle ? '5px' : '0px',
                    }}
                  >
                    {dateTimeItem}
                  </div>
                );
              })}
            </div>
          </div>
        </React.Fragment>
      ) : null}
      {/* {dayNumber < 1 ? (
        <div className="timeSet-title" style={{marginTop:'30px',color:'#D0021B'}}>
          已过期 <span style={{color:'#D0021B'}}>{Math.abs(dayNumber) + 1 + '天'}</span>
        </div>
      ) : null} */}
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
