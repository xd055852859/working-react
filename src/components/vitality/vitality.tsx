import React, { useState, useEffect, useRef } from 'react';
import './vitality.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../redux/actions/commonActions';
import api from '../../services/api';
import chart from '../common/chart';
import Tooltip from '../common/tooltip';
import moment from 'moment';
import _ from 'lodash';
import VitalityIcon from '../vitalityIcon/vitalityIcon';
import batteryPng from '../../assets/img/battery.png';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
import defaultPersonPng from '../../assets/img/defaultPerson.png';
import rightArrowPng from '../../assets/img/rightArrow.png';
import leftArrowPng from '../../assets/img/leftArrow.png';
interface VitalityProps {
  vitalityType: number;
  vitalityKey: string;
  fatherVitalityInfo?: any;
}

const Vitality: React.FC<VitalityProps> = (props) => {
  let { vitalityType, vitalityKey, fatherVitalityInfo } = props;
  const dispatch = useDispatch();
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const user = useTypedSelector((state) => state.auth.user);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const vitalityLogRef: React.RefObject<any> = useRef();
  const [vitalityInfo, setvitalityInfo] = useState<any>(null);
  const [targetNum, setTargetNum] = useState(0);
  const [targetTime, setTargetTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [targetMonthStr, setTargetMonthStr] = useState('');

  const [heatchart, setHeatchart] = useState<any>(null);
  const [linechart, setLinechart] = useState<any>(null);
  const [piechart, setPiechart] = useState<any>(null);
  const [weekEnergy, setWeekEnergy] = useState<any>([]);
  const [monthEnergy, setMonthEnergy] = useState<any>([]);
  const [monthData, setMonthData] = useState<any>([]);
  const [monthTitleArr, setMonthTitleArr] = useState<any>([]);
  const [vitalityState, setVitalityState] = useState('month');
  const [monthStr, setMonthStr] = useState('');
  const [logDate, setLogDate] = useState('');
  const [logList, setLogList] = useState<any>([]);
  const [logtotal, setLogtotal] = useState(0);
  const [page, setLogPage] = useState(1);
  const monthArr = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const limit = 50;
  let unDistory = true;
  const toDoc = () => {
    window.open(
      'https://baoku.qingtime.cn/OHPRQG_1585745644894/article?key=1249218647'
    );
  };
  useEffect(() => {
    if (!fatherVitalityInfo) {
      getVitalityInfo(vitalityType);
    } else {
      setvitalityInfo(fatherVitalityInfo);
      getVitalityData({
        type: vitalityType - 1,
        targetUGKey: fatherVitalityInfo._key,
      });
    }
    return () => {
      unDistory = false;
    };
  }, [groupKey, headerIndex, vitalityType, fatherVitalityInfo, targetUserInfo]);

  const getVitalityInfo = async (vitalityType: number) => {
    let res: any = null;
    if (vitalityType == 3) {
      res = await api.group.getGroupInfo(vitalityKey);
    } else {
      res = await api.auth.getTargetUserInfo(vitalityKey);
    }
    if (unDistory) {
      if (res.msg == 'OK') {
        setvitalityInfo(res.result);
        getVitalityData({
          type: vitalityType - 1,
          targetUGKey: res.result._key,
        });
      } else {
        dispatch(setMessage(true, res.msg, 'error'));
      }
    }
  };
  useEffect(() => {
    setLogPage(1);
    setLogList([]);
    getLog(startTime, 1, limit);
    return () => {
      unDistory = false;
    };
  }, [startTime]);
  const getVitalityData = async (obj: any) => {
    let newMonthData = _.cloneDeep(monthData);
    let newMonthTitleArr = _.cloneDeep(monthTitleArr);
    // let newMonthData = _.cloneDeep(monthData);
    let personStartTime = moment().startOf('month').startOf('day').valueOf();
    let personEndTime = moment().endOf('month').endOf('day').valueOf();
    setTargetMonthStr(moment().format('YYYY') + '/' + moment().format('MM'));
    setTargetTime(moment().startOf('month').startOf('day').valueOf());
    getPersonVitality(personStartTime, personEndTime);
    let monthStartTime = moment()
      .subtract(3, 'month')
      .startOf('month')
      .startOf('day')
      .valueOf();
    let monthEndTime = moment()
      .add(1, 'month')
      .startOf('month')
      .startOf('day')
      .valueOf();
    let monthObj = {
      startTime: monthStartTime,
      endTime: monthEndTime,
      ...obj,
    };
    let monthTimeArr = [
      {
        startTime: moment()
          .subtract(3, 'month')
          .startOf('month')
          .startOf('day')
          .valueOf(),
        endTime: moment()
          .subtract(2, 'month')
          .startOf('month')
          .startOf('day')
          .valueOf(),
      },
      {
        startTime: moment()
          .subtract(2, 'month')
          .startOf('month')
          .startOf('day')
          .valueOf(),
        endTime: moment()
          .subtract(1, 'month')
          .startOf('month')
          .startOf('day')
          .valueOf(),
      },
      {
        startTime: moment()
          .subtract(1, 'month')
          .startOf('month')
          .startOf('day')
          .valueOf(),
        endTime: moment().startOf('month').startOf('day').valueOf(),
      },
      {
        startTime: moment().startOf('month').startOf('day').valueOf(),
        endTime: moment()
          .add(1, 'month')
          .startOf('month')
          .startOf('day')
          .valueOf(),
      },
    ];
    let monthRes: any = await api.auth.monthEnergy(monthObj);
    if (unDistory) {
      if (monthRes.msg == 'OK') {
        monthTimeArr.forEach((monthItem, monthIndex) => {
          newMonthData[monthIndex] = [];
          monthRes.result.forEach((item: any) => {
            if (
              item.startTime >= monthItem.startTime &&
              item.startTime < monthItem.endTime
            ) {
              newMonthData[monthIndex].push({
                color: getColor(item.value),
                date: moment(item.startTime).date(),
                value: item.value.toFixed(1),
                startTime: item.startTime,
              });
            }
          });
        });
        newMonthData.forEach((item: any, index: number) => {
          newMonthTitleArr.unshift(
            moment(item[0].startTime).format('M') + '月'
          );
          item = formatMonth(item[0].startTime, item);
        });
        newMonthData.reverse();
      } else {
        dispatch(setMessage(true, monthRes.msg, 'error'));
      }
      setStartTime(moment().startOf('day').valueOf());
      setEndTime(moment().endOf('day').valueOf());
      setLogDate(moment().format('M') + '月' + moment().format('D') + '日');
      setMonthData(newMonthData);
      setMonthTitleArr(newMonthTitleArr);
      getLog(moment().startOf('day').valueOf(), page, limit);
    }
  };
  const getPersonVitality = async (startTime: number, endTime: number) => {
    let personRes: any = await api.auth.monthEnergyWeb(
      startTime,
      endTime,
      vitalityType - 1,
      vitalityKey
    );
    if (personRes.msg == 'OK') {
      let data: object[] = [];
      personRes.result.forEach((item: any) => {
        if (item.energyValueTotal > 0) {
          data.push({
            name: item.name,
            value: item.energyValueTotal,
          });
        }
      });
      data = _.sortBy(data, 'value').reverse();
      setPiechart(chart.createPieChart('piechartdiv', data));
    } else {
      dispatch(setMessage(true, personRes.msg, 'error'));
    }
  };
  const getLog = async (startTime: number, page: number, limit: number) => {
    let newLogList: any = _.cloneDeep(logList);
    let dataRes: any = null;
    if (page == 1) {
      newLogList = [];
    }
    if (vitalityType === 3) {
      dataRes = await api.auth.getGroupLog(
        vitalityKey,
        startTime,
        moment(startTime).endOf('day').valueOf(),
        page,
        limit
      );
    } else if (vitalityType !== 3) {
      dataRes = await api.auth.getUserLog(
        startTime,
        moment(startTime).endOf('day').valueOf(),
        page,
        limit,
        vitalityKey !== user._key ? vitalityKey : null
      );
    }
    if (unDistory) {
      if (dataRes.msg === 'OK') {
        dataRes.result.forEach((item: any) => {
          item.createTime = moment(item.createTime).format('HH:mm');
          newLogList.push(item);
        });
        setLogList(newLogList);
        setLogtotal(dataRes.totalNumber);
      } else {
        dispatch(setMessage(true, dataRes.msg, 'error'));
      }
    }
  };
  const getTargetLog = (startTime: number) => {
    setVitalityState('day');
    if (vitalityLogRef.current) {
      vitalityLogRef.current.scrollTop = 0;
    }
    setStartTime(startTime);
    setEndTime(moment(startTime).endOf('day').valueOf());
    setLogDate(
      moment(startTime).format('M') +
        '月' +
        moment(startTime).format('D') +
        '日'
    );
  };
  const getColor = (num: number) => {
    let color = '';
    if (num <= 0) {
      color = '#D8E2FF';
    } else if (num < 10 && num > 0) {
      color = '#D1DEFF';
    } else if (num < 20 && num >= 10) {
      color = '#94B2FF';
    } else if (num < 30 && num >= 20) {
      color = '#7FA3FF';
    } else if (num < 40 && num >= 30) {
      color = '#376EF8';
    } else if (num < 50 && num >= 40) {
      color = '#476FD5';
    } else if (num < 60 && num >= 50) {
      color = '#1F4CC1';
    } else if (num >= 60) {
      color = '#214EC1';
    }
    return color;
  };

  const changeMonth = (type: number) => {
    let personStartTime = 0;
    let personEndTime = 0;
    //当前时间
    if (type == 0) {
      personStartTime = moment(targetTime)
        .subtract(1, 'month')
        .startOf('month')
        .startOf('day')
        .valueOf();
      personEndTime = moment(targetTime)
        .subtract(1, 'month')
        .endOf('month')
        .endOf('day')
        .valueOf();
      setTargetMonthStr(
        moment(targetTime).subtract(1, 'month').format('YYYY') +
          '/' +
          moment(targetTime).subtract(1, 'month').format('MM')
      );
    } else {
      personStartTime = moment(targetTime)
        .add(1, 'month')
        .startOf('month')
        .startOf('day')
        .valueOf();
      personEndTime = moment(targetTime)
        .add(1, 'month')
        .endOf('month')
        .endOf('day')
        .valueOf();
      setTargetMonthStr(
        moment(targetTime).add(1, 'month').format('YYYY') +
          '/' +
          moment(targetTime).add(1, 'month').format('MM')
      );
    }
    setTargetTime(personStartTime);
    getPersonVitality(personStartTime, personEndTime);
  };
  const formatMonth = (time: number, arr: any) => {
    let weekIndex = moment(time).day();
    for (let i = weekIndex - 1; i > -1; i--) {
      arr.unshift({
        color: '#FFFFFF',
        date: '',
        value: '',
      });
    }
    return arr;
  };
  const scrollLogLoading = (e: any) => {
    let newPage = page;
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let clientHeight = e.target.clientHeight;
    if (
      clientHeight + scrollTop >= scrollHeight - 1 &&
      logList.length < logtotal
    ) {
      newPage = newPage + 1;
      getLog(startTime, newPage, limit);
    }
  };
  const changeTargetMonth = (index: number) => {
    getPersonVitality(
      moment().subtract(index, 'month').startOf('month').valueOf(),
      moment().subtract(index, 'month').endOf('month').valueOf()
    );
    setTargetMonthStr(
      moment().subtract(index, 'month').format('YYYY') +
        '/' +
        moment().subtract(index, 'month').format('MM')
    );
    setVitalityState('month');
  };
  return (
    <React.Fragment>
      {vitalityInfo ? (
        <div className="vitality-container">
          <div
            className="vitality-doc"
            onClick={() => {
              toDoc();
            }}
          >
            帮助/说明
          </div>
          <div className="vitality-top">
            {vitalityType === 3 ? (
              <div className="vitality-img">
                <img
                  src={
                    vitalityInfo.groupLogo
                      ? vitalityInfo.groupLogo +
                        '?imageMogr2/auto-orient/thumbnail/80x'
                      : defaultGroupPng
                  }
                  alt=""
                />
              </div>
            ) : (
              <div className="vitality-img">
                <img
                  src={
                    vitalityInfo.profile.avatar
                      ? vitalityInfo.profile.avatar +
                        '?imageMogr2/auto-orient/thumbnail/80x'
                      : defaultPersonPng
                  }
                  alt=""
                />
              </div>
            )}
            <div className="vitality-top-info">
              <div className="vitality-title vitality-top-title">
                <div>
                  {vitalityType === 3
                    ? vitalityInfo.groupName
                    : vitalityInfo.profile.nickName}
                </div>
                <div className="vitality-top-num">
                  活力值
                  <div className="vitality-numImg">
                    <img src={batteryPng} alt="" />
                  </div>
                  <div style={{ color: '#86B93F', fontSize: '14px' }}>
                    {vitalityInfo.energyValueTotal}
                  </div>
                </div>
              </div>
              <div className="vitality-subtitle vitality-bottom-title">
                <VitalityIcon
                  vitalityNum={vitalityInfo.energyValueTotal}
                  vitalityDirection={'vertical'}
                  vitalityStyle={{ marginLeft: '5px', color: '#86B93F' }}
                  vitalityIconType={1}
                />
              </div>
            </div>
          </div>
          <div className="vitality-chart-info">
            <div className="vitality-month">
              <div className="vitality-title">月活力分布</div>
              <div className="vitality-month-container">
                <div
                  style={{
                    paddingLeft: '40px',
                    boxSizing: 'border-box',
                    width: '100%',
                    display: 'flex',
                    height: '17px',
                  }}
                >
                  {monthArr.map((monthItem: any, monthIndex: number) => {
                    return (
                      <div
                        className="vitality-month-item-title vitality-month-item"
                        key={'month' + monthIndex}
                      >
                        {monthItem}
                      </div>
                    );
                  })}
                </div>
                {monthData.map((item: any, index: number) => {
                  return (
                    <React.Fragment key={'monthData' + index}>
                      <div
                        className="vitality-month-title"
                        onClick={() => {
                          changeTargetMonth(index);
                        }}
                      >
                        {monthTitleArr[index]}
                      </div>
                      <div className="vitality-month-info">
                        {item.map((dayItem: any, dayIndex: number) => {
                          return (
                            <div
                              className="vitality-month-item"
                              key={'vitality' + index + dayIndex}
                            >
                              {/* <template slot="title">分值: {{dayItem.value}} 分</template> */}
                              <div
                                className="vitality-month-item-day"
                                style={{
                                  // backgroundColor: dayItem.color,
                                  backgroundColor: dayItem.color,
                                  border: dayItem.date ? '1px solid #fff' : 0,
                                }}
                                onClick={() => {
                                  if (
                                    headerIndex !== 2 ||
                                    (headerIndex === 2 &&
                                      dayItem.startTime ===
                                        moment().startOf('day').valueOf())
                                  ) {
                                    getTargetLog(dayItem.startTime);
                                  }
                                }}
                              >
                                {dayItem.value && dayItem.value != 0 ? (
                                  <React.Fragment>
                                    <div
                                      className="vitality-changeNum-box"
                                      style={{
                                        color:
                                          dayItem.value > 0
                                            ? '#fff'
                                            : '#FB7552',
                                      }}
                                    >
                                      {dayItem.value.indexOf('-') === -1
                                        ? dayItem.value
                                        : dayItem.value.split('-')[1]}
                                    </div>
                                    <div className="vitality-changeNum"></div>
                                  </React.Fragment>
                                ) : null}
                                {dayItem.date}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            <div className="vitality-box">
              <div
                className="vitality-chart"
                style={
                  vitalityState === 'month'
                    ? { opacity: '1' }
                    : {
                        opacity: '0',
                        height: '0px',
                        width: '0px',
                        zIndex: -1,
                      }
                }
              >
                <div
                  className="vitality-title"
                  style={{ justifyContent: 'space-between' }}
                >
                  <div>月活力</div>
                  <div className="vitality-choose">
                    {/* <img
                      src={leftArrowPng}
                      className="vitality-choose-icon"
                      onClick={() => {
                        changeMonth(0);
                      }}
                    /> */}
                    <div>{targetMonthStr}</div>
                    {/* <img
                      src={rightArrowPng}
                      className="vitality-choose-icon"
                      onClick={() => {
                        changeMonth(1);
                      }}
                    /> */}
                  </div>
                </div>
                <div className="vitality-week" id="piechartdiv"></div>
              </div>
              <div
                className="vitality-log"
                style={
                  vitalityState === 'day'
                    ? { opacity: '1' }
                    : {
                        opacity: '0',
                        height: '0px',
                        width: '0px',
                        padding: '0px',
                        zIndex: -1,
                      }
                }
              >
                <div className="vitality-title">
                  活力日志
                  <span style={{ marginLeft: '5px', fontSize: '12px' }}>
                    ( {logDate} )
                  </span>
                </div>
                <div
                  className="vitality-log-container"
                  onScroll={scrollLogLoading}
                  ref={vitalityLogRef}
                >
                  <div className="vitality-msg">
                    <div
                      style={{
                        width: '10%',
                      }}
                    >
                      时间
                    </div>
                    <div style={{ width: '10%' }}>操作</div>
                    <div style={{ width: '50%' }}>任务</div>
                    <div style={{ width: '20%' }}>干系人</div>
                    <div style={{ width: '10%' }}>活力</div>
                  </div>
                  {logList.map((logItem: any, logIndex: number) => {
                    return (
                      <div className="vitality-msg" key={'log' + logIndex}>
                        <div
                          style={{
                            width: '10%',
                          }}
                        >
                          {logItem.createTime}
                        </div>
                        <div
                          style={{ width: '15%', justifyContent: 'flex-start' }}
                        >
                          {logItem.log}
                        </div>
                        <div
                          style={{ width: '45%', justifyContent: 'flex-start' }}
                        >
                          {logItem.cardTitle}
                        </div>
                        <div style={{ width: '20%' }}>
                          {logItem.creatorName}
                          {logItem.creatorName && logItem.executorName
                            ? '⇀'
                            : ''}
                          {logItem.executorName}
                        </div>
                        <div style={{ width: '10%' }}>
                          <span
                            style={{
                              backgroundColor:
                                logItem.energyValue > 0 ? '#86B93F' : '#E94848',
                              borderRadius: '8px',
                              padding: '0px 6px',
                              boxSizing: 'border-box',
                              color: '#fff',
                              height: '20px',
                              lineHeight: '20px',
                            }}
                          >
                            {logItem.energyValue > 0 ? '+' : null}
                            {logItem.energyValue}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
};
Vitality.defaultProps = {
  vitalityType: 0,
};
export default Vitality;
