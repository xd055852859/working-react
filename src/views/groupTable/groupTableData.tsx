import React, { useState, useEffect, useRef } from 'react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { Radio, RadioGroup, FormControlLabel } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import './groupTableData.css';

import Task from '../../components/task/task';
import chart from '../../components/common/chart';
import Loading from '../../components/common/loading';
import { setMessage } from '../../redux/actions/commonActions';
import api from '../../services/api';

interface GroupTableDataProps { }

const GroupTableData: React.FC<GroupTableDataProps> = (prop) => {
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const [groupData, setGroupData] = useState<any>(null);
  const [personObj, setPersonObj] = useState<any>({});
  const [personGroupObj, setPersonGroupObj] = useState<any>({});
  const [positionObj, setPositionObj] = useState<any>({});
  const [taskState, setTaskState] = useState(0);
  const [XYlength, setXYlength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [colWidth, setColWidth] = useState(0);
  let dataChart = null;
  let XYLeftchart = null;
  let XYLeft1chart = null;
  let XYRightchart = null;
  let colHeight: any = [];
  const taskTitleArr = ['昨日完成', '今日计划', '未完成任务', '已完成任务'];
  const startTime = moment(new Date()).startOf('day').valueOf();
  const endTime = moment(new Date()).endOf('day').valueOf();
  const startTaskTime = moment(new Date())
    .subtract(1, 'days')
    .startOf('day')
    .valueOf();
  const endTaskTime = moment(new Date())
    .subtract(1, 'days')
    .endOf('day')
    .valueOf();
  let colNumbers = 4;
  const groupDataRef: React.RefObject<any> = useRef();
  useEffect(() => {
    if (user && user._key) {
      getGroupData();
    }
  }, [user, groupKey]);
  useEffect(() => {
    if (groupDataRef.current) {
      let clientWidth = groupDataRef.current.clientWidth;
      if (clientWidth < 600) {
        colNumbers = 1;
      } else if (clientWidth >= 600 && clientWidth <= 900) {
        colNumbers = 2;
      } else if (clientWidth > 900 && clientWidth <= 1080) {
        colNumbers = 3;
      } else {
        colNumbers = 4;
      }
      setColWidth(Math.floor(clientWidth / colNumbers));

      if (
        groupDataRef.current.childNodes.length > 0 &&
        JSON.stringify(personGroupObj) != '{}'
      ) {
        let newPositionObj = _.cloneDeep(positionObj);
        Object.keys(personObj).forEach((item: any, index: number) => {
          newPositionObj[item] = render(index, item);
        });
        setPositionObj(newPositionObj);
      }
    }
  }, [personGroupObj]);

  const getGroupData = async () => {
    setLoading(true);
    let dataRes: any = await api.task.getGroupDataTask(
      groupKey,
      [0, 1],
      null,
      moment().add(1, 'days').startOf('day').valueOf()
    );
    if (dataRes.msg === 'OK') {
      setLoading(false);
      setGroupData(dataRes.result);
      handleChart(taskState, dataRes.result);
      getTeamData(dataRes.result, taskState);
    } else {
      dispatch(setMessage(true, dataRes.msg, 'error'));
    }
  };
  const onChange = (e: any) => {
    setTaskState(parseInt(e.target.value));
    handleChart(parseInt(e.target.value), groupData);
    getTeamData(groupData, parseInt(e.target.value));
  };
  const handleChart = (taskState: number, groupData: any) => {
    let data: any = [];
    let newData: any = {};
    let XYLeftdata: any = [];
    let newXYLeftData: any = {};
    let XYRightdata: any = [];
    let newXYRightData: any = {};
    let XYLeft1data: any = [];
    let newXYLeft1Data: any = {};
    let XYRight1data: any = [];
    let newXYRight1Data: any = {};
    let state = false;
    groupData.forEach((item: any) => {
      switch (taskState) {
        case 0:
          state =
            item.todayTaskTime >= startTaskTime &&
            item.todayTaskTime <= endTaskTime &&
            item.finishPercent == 1;
          break;
        case 1:
          state = item.taskEndDate >= startTime && item.taskEndDate <= endTime;
          break;
        case 2:
          state = item.finishPercent == 0;
          break;
        case 3:
          state = item.finishPercent == 1;
          break;
      }
      if (
        item.groupName &&
        item.groupName.indexOf('个人事务') == -1 &&
        item.title != '' &&
        state &&
        item.taskEndDate
      ) {
        if (!newData[item.creatorName + '-' + item.executorName]) {
          newData[item.creatorName + '-' + item.executorName] = 1;
        } else {
          newData[item.creatorName + '-' + item.executorName] =
            newData[item.creatorName + '-' + item.executorName] + 1;
        }
        if (!newXYLeftData[item.executorName]) {
          newXYLeftData[item.executorName] = {
            num: 1,
            item: item,
          };
        } else {
          newXYLeftData[item.executorName].num =
            newXYLeftData[item.executorName].num + 1;
        }
        if (!newXYRightData[item.creatorName]) {
          newXYRightData[item.creatorName] = {
            num: 1,
            item: item,
          };
        } else {
          newXYRightData[item.creatorName].num =
            newXYRightData[item.creatorName].num + 1;
        }
        if (!newXYLeft1Data[item.executorName]) {
          newXYLeft1Data[item.executorName] = {
            hour: item.hour,
            item: item,
          };
        } else {
          newXYLeft1Data[item.executorName].hour =
            newXYLeft1Data[item.executorName].hour + item.hour;
        }
        if (!newXYRight1Data[item.creatorName]) {
          newXYRight1Data[item.creatorName] = {
            hour: item.hour,
            item: item,
          };
        } else {
          newXYRight1Data[item.creatorName].hour =
            newXYRight1Data[item.creatorName].hour + item.hour;
        }
      }
      // {"from":"Monica","to":"Rachel","value":4}
    });
    for (let key in newData) {
      let keyArr = key.split('-');
      data.push({ from: keyArr[0], to: keyArr[1], value: newData[key] });
    }
    for (let key in newXYLeftData) {
      XYLeftdata.push({
        name: newXYLeftData[key].item.executorName,
        steps: newXYLeftData[key].num,
        href:
          newXYLeftData[key].item.executorAvatar,
      });
    }
    for (let key in newXYRightData) {
      XYRightdata.push({
        name: newXYRightData[key].item.creatorName,
        steps: newXYRightData[key].num,
        href:
          newXYRightData[key].item.creatorAvatar +
          '?imageMogr2/auto-orient/thumbnail/50x50/format/jpg',
      });
    }
    for (let key in newXYLeft1Data) {
      XYLeft1data.push({
        name: newXYLeft1Data[key].item.executorName,
        steps: newXYLeft1Data[key].hour,
        href:
          newXYLeft1Data[key].item.executorAvatar +
          '?imageMogr2/auto-orient/thumbnail/50x50/format/jpg',
      });
    }
    for (let key in newXYRight1Data) {
      XYRight1data.push({
        name: newXYRight1Data[key].item.creatorName,
        steps: newXYRight1Data[key].hour,
        href:
          newXYRight1Data[key].item.creatorAvatar +
          '?imageMogr2/auto-orient/thumbnail/50x50/format/jpg',
      });
    }
    XYLeftdata = _.sortBy(XYLeftdata, ['steps']);
    XYRightdata = _.sortBy(XYRightdata, ['steps']);
    XYLeft1data = _.sortBy(XYLeft1data, ['steps']);
    // XYRight1data = _.sortBy(XYRight1data, ['steps']);
    let length = _.max([
      XYLeftdata.length,
      XYRightdata.length,
      XYLeft1data.length,
    ]);

    setXYlength(length);
    dataChart = chart.createChordDiagramChart('chartdiv', data, '#333');
    XYLeftchart = chart.createXYChart('XYLeftchartdiv', XYLeftdata);
    XYRightchart = chart.createXYChart('XYRightchartdiv', XYRightdata);
    // XYLeft1chart = chart.createXYChart('XYLeft1chartdiv', XYLeft1data);
  };
  const getTeamData = (arr: any, taskState: number) => {
    let newPositionObj = _.cloneDeep(positionObj);
    let newPersonObj: any = {};
    let newPersonGroupObj: any = {};
    let state = false;
    arr.forEach((item: any, index: number) => {
      // item.finishPercent == 1
      switch (taskState) {
        case 0:
          state =
            item.todayTaskTime >= startTaskTime &&
            item.todayTaskTime <= endTaskTime &&
            item.finishPercent == 1;
          break;
        case 1:
          state =
            item.taskEndDate >= startTime &&
            item.taskEndDate <= endTime &&
            item.finishPercent == 0;
          break;
        case 2:
          state = item.finishPercent == 0;
          break;
        case 3:
          state = item.finishPercent == 1;
          break;
      }
      if (
        item.groupName &&
        item.groupName.indexOf('个人事务') == -1 &&
        item.title != '' &&
        state &&
        item.taskEndDate
      ) {
        if (!newPersonObj[item.executorKey]) {
          newPersonObj[item.executorKey] = [];
        }
        item = formatDay(item);
        newPersonObj[item.executorKey].push(item);
        newPersonObj[item.executorKey] = _.sortBy(
          newPersonObj[item.executorKey],
          ['taskEndDate']
        ).reverse();
        // this.showTabObj[item.executorKey] = true;
      }
    });
    for (let key in newPersonObj) {
      if (key != 'position') {
        newPersonGroupObj[key] = {};
        newPersonObj[key].forEach((personItem: any, personIndex: number) => {
          if (!newPersonGroupObj[key][personItem.groupKey]) {
            newPersonGroupObj[key][personItem.groupKey] = [];
          }
          newPersonGroupObj[key][personItem.groupKey].push(personItem);
        });
      }
    }
    setPersonObj(newPersonObj);
    setPersonGroupObj(newPersonGroupObj);
  };

  const formatDay = (item: any) => {
    let time = 0;
    item.percent = parseInt(
      (
        (item.hour * 3600000 - item.countDownTime) /
        (item.hour * 36000)
      ).toFixed(1)
    );

    let countTime = item.hour * 3600000 - item.countDownTime;
    let hours = parseInt(
      ((countTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toFixed(1)
    );

    let minutes = parseInt(
      ((countTime % (1000 * 60 * 60)) / (1000 * 60)).toFixed(1)
    );
    let seconds = parseInt(((countTime % (1000 * 60)) / 1000).toFixed(1));
    item.countDownText =
      addZero(hours) + ' : ' + addZero(minutes) + ' : ' + addZero(seconds);
    if (item.taskEndDate) {
      time = Math.floor(
        (moment(item.taskEndDate).endOf('day').valueOf() -
          moment(new Date().getTime()).endOf('day').valueOf()) /
        86400000
      );
    }
    item.time = time < 0 ? Math.abs(time) : Math.abs(time) + 1;
    item.endState = time < 0 ? false : true;
    return item;
  };
  const addZero = (num: number) => {
    return num > 9 ? num + '' : '0' + num;
  };
  const render = (index: number, item: any) => {
    let obj = {
      left: 0,
      top: 700,
    };
    let dom: any = document.getElementById('groupData' + item);
    if (dom) {
      let height = dom.clientHeight;
      let width = dom.offsetWidth;
      let ratio = width / height;
      let colIndex = index % colNumbers;
      obj.left = colIndex * colWidth;
      // //首行 top为 0，记录每列的高度
      if (index < colNumbers) {
        obj.top = 0;
        colHeight[colIndex] = colWidth / ratio + 5;
      } else {
        //获取高度的最小值
        let minHeight = Math.min.apply(null, colHeight);
        let minIndex = colHeight.indexOf(minHeight);
        //此图片的 top 为上面图片的高度，left 相等
        obj.top = parseInt(minHeight + '');
        obj.left = parseInt(minIndex * colWidth + '');
        //     //把高度加上去
        colHeight[minIndex] += parseInt(colWidth / ratio + '');
      }
      return obj;
      // this.$set(this.positionObj, item,obj);
      // this.$set(this.personObj, item, this.personObj[item]);
    }
  };
  const getGroupDom = (groupItem: any) => {
    let dom: any = [];
    for (let personIndex in groupItem) {
      let personItem = groupItem[personIndex];
      dom.push(
        <React.Fragment key={'personItem' + personIndex}>
          <div className="countdown-right-group" style={{ marginTop: '5px' }}>
            <React.Fragment>
              <div className="countdown-right-group-logo">
                <img src={personItem[0].groupLogo} alt="" />
              </div>
              {personItem[0].groupName}
            </React.Fragment>
          </div>
          <div className="countdown-right-info">
            {personItem.map((taskItem: any, taskIndex: number) => {
              return (
                <div
                  className="countdown-right-task"
                  key={'taskItem' + taskIndex}
                >
                  <Task taskItem={taskItem} timeSetStatus={taskIndex > personItem.length - 3} />
                </div>
              );
            })}
          </div>
        </React.Fragment>
      );
    }
    return dom;
    // {personGroupObj[key].map(
    //   (personItem: any, personIndex: number) => {
    //     return (

    //     );
    //   }
    // )}
  };
  const getDom = () => {
    let dom: any = [];
    for (let key in personObj) {
      let item: any = personObj[key];
      //
      //     }
      dom.push(
        <div
          key={'person' + key}
          // :ref="'groupData'+index"
          style={{
            width: colWidth - 5 + 'px',
            position: 'absolute',
            top: positionObj[key] ? positionObj[key].top + 'px' : 0,
            left: positionObj[key] ? positionObj[key].left + 'px' : 0,
            backgroundColor: '#7690d3',
          }}
          id={'groupData' + key}
        >
          {key != 'position' ? (
            <React.Fragment>
              <div className="countdown-right-person-item">
                <img
                  src={item[0].executorAvatar}
                  className="countdown-right-person-avatar"
                />
                {item[0].executorName}
              </div>
              {getGroupDom(personGroupObj[key])}
            </React.Fragment>
          ) : null}
        </div>
      );
    }
    return dom;
  };
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        position: 'relative',
        background:'#f9f9f9'
      }}
    >
      {loading ? <Loading /> : null}
      <div className="choose-container">
        {/* <radio-group v-model="taskState" onChange={onChange}> */}
        {/* <radio
          v-for="(item,index) in taskTitleArr"
          :key="index"
          :value="index"
          :style="{color:fontColor,height:'40px'}"
        >{{item}}</radio> */}
        {/* </radio-group> */}
        <RadioGroup aria-label="gender" value={taskState} onChange={onChange}>
          {taskTitleArr.map((item: any, index: number) => {
            return (
              <FormControlLabel
                value={index}
                control={<Radio />}
                label={item}
                key={'radio' + index}
                style={{ height: '40px' }}
              />
            );
          })}
        </RadioGroup>
      </div>
      <div
        className="chart-XYcontainer"
        style={{ height: 60 * XYlength + 'px', minHeight: '120px' }}
      >
        <div className="chart-left-title">执行任务数排名</div>
        {/* <div className="chart-middle-title">执行工时排名</div> */}
        <div className="chart-right-title">创建任务数排名</div>
        <div className="chart" id="XYLeftchartdiv"></div>
        {/* <div className="chart" id="XYLeft1chartdiv"></div> */}
        <div className="chart" id="XYRightchartdiv"></div>
      </div>
      <div className="chart-container" style={{ height: '700px' }}>
        <div className="chart-div" id="chartdiv"></div>
      </div>
      <div className="countdown-right-item" ref={groupDataRef}>
        {getDom()}
      </div>
    </div>
  );
};
export default GroupTableData;
