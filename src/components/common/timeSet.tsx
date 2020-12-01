import React, { useState, useEffect } from 'react';
import './timeSet.css';
import moment from 'moment';
import timeSet1Svg from '../../assets/svg/timeSet1.svg';
import timeSet2Svg from '../../assets/svg/timeSet2.svg';
import timeSet3Svg from '../../assets/svg/timeSet3.svg';
import timeSet4Svg from '../../assets/svg/timeSet4.svg';
import timeSet5Svg from '../../assets/svg/timeSet5.svg';
import timeSet6Svg from '../../assets/svg/timeSet6.svg';
import clockSvg from '../../assets/svg/clock.svg';
import { Button } from '@material-ui/core';
import DropMenu from '../common/dropMenu';
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
  const [freeTimeVisible, setFreeTimeVisible] = useState(false);
  const [freeTimeInput, setFreeTimeInput] = useState('');
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
          viewStyle !== 'horizontal'
            ? {
                width: '100%',
                height: '55px',
                marginBottom: '10px',
                padding: '5px 10px',
              }
            : { height: '50px' }
        }
      >
        {!timestate ? (
          <div
            className="timeSet-time-logo"
            style={
              viewStyle !== 'horizontal'
                ? { width: '45px', height: '40px' }
                : {
                    width: '45px',
                    height: '42px',
                    marginRight: '10px',
                  }
            }
          >
            <img
              src={timeSet1Svg}
              onClick={() => {
                percentClick(10);
              }}
              // style={{ marginRight: !viewStyle ? '' : '5px' }}
            />
            <img
              src={timeSet2Svg}
              onClick={() => {
                percentClick(0);
              }}
              // style={{ marginRight: !viewStyle ? '' : '5px' }}
            />
            <img
              src={timeSet3Svg}
              onClick={() => {
                percentClick(1);
              }}
              // style={{ marginRight: !viewStyle ? '' : '5px' }}
            />
            <img
              src={timeSet4Svg}
              onClick={() => {
                percentClick(2);
              }}
              style={{
                width: '19px',
                height: '19px',
                // marginRight: !viewStyle ? '' : '5px',
              }}
            />
          </div>
        ) : null}
        <div
          className="timeSet-time-info"
          style={
            // !viewStyle
            // ?
            { width: '230px', height: '42px' }
            // : { width: '230px', height: '40px' }
          }
        >
          <img
            src={clockSvg}
            style={{
              width: '20px',
              height: '20px',
              marginRight: '5px',
              // marginBottom: '5px',
              cursor: 'pointer',
            }}
            onClick={() => {
              setFreeTimeVisible(true);
              // changeTimeDateType(1);
            }}
          />
          <DropMenu
            visible={freeTimeVisible}
            dropStyle={{
              width: '222px',
              height: '57px',
              top: '20px',
              left: '0px',
              color: '#333',
              padding: '10px 6px',
              boxSizing: 'border-box',
              zIndex: '30',
            }}
            onClose={() => {
              setFreeTimeVisible(false);
            }}
          >
            <input
              type="text"
              value={freeTimeInput}
              placeholder="请输入自定义时间"
              onChange={(e) => {
                setFreeTimeInput(e.target.value);
              }}
              className="timeSet-freeTime"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                timeSetClick('hour', parseFloat(freeTimeInput));
                setFreeTimeVisible(false);
              }}
              style={{ color: '#fff', height: '35px' }}
              // className={classes.clockInButton}
            >
              确定
            </Button>
          </DropMenu>
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
                  // marginBottom:
                  //  !viewStyle ?
                  // '5px',
                  //  : '0px',
                  marginRight:
                    // !viewStyle ?
                    '5px',
                  // : '1px',
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
              viewStyle !== 'horizontal'
                ? {
                    width: '100%',
                    height: '55px',
                    padding: '5px 10px',
                    marginTop: '20px',
                  }
                : { width: '405px', height: '42px', marginLeft: '10px' }
            }
          >
            <div
              className="timeSet-date-logo"
              style={
                // !viewStyle
                //   ?
                {
                  width: '45px',
                  height: '40px',
                  marginRight: '10px',
                  alignContent: 'space-between',
                }
                // : {
                //     height: '30px',
                //     alignItems: 'center',
                //     alignContent: 'initial',
                //     margin: '0px 5px',
                //   }
              }
            >
              <img
                src={timeSet5Svg}
                onClick={() => {
                  changeTimeDateType(0);
                }}
                // style={{ marginRight: !viewStyle ? '' : '5px' }}
              />
              <img
                src={timeSet6Svg}
                style={{
                  width: '17px',
                  height: '14px',
                  // marginRight: !viewStyle ? '' : '5px',
                }}
                onClick={() => {
                  changeTimeDateType(1);
                }}
              />
            </div>
            <div className="timeSet-date-info" style={{ height: '42px' }}>
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
                      marginBottom: viewStyle !== 'horizontal' ? '5px' : '0px',
                      marginRight:
                        // !viewStyle ?
                        '4px',
                      // : '1px',
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
