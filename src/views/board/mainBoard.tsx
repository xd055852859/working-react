import React, { useState, useEffect } from 'react';
import './mainBoard.css';
import moment from 'moment';
import _ from 'lodash';
import { Avatar } from 'antd';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';

import { getSelfTask } from '../../redux/actions/taskActions';

import Task from '../../components/task/task';

import defaultGroupPng from '../../assets/img/defaultGroup.png';
import nothingsSvg from '../../assets/svg/nothings.svg';

import Loading from '../../components/common/loading';
interface MainBoardItemProps {
  mainItem: any;
}
const MainBoardItem: React.FC<MainBoardItemProps> = (props) => {
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const { mainItem } = props;
  let myState = false;
  if (
    mainItem[0].groupName.indexOf('主项目') !== -1 &&
    mainItem[0].groupKey === mainGroupKey
  ) {
    mainItem[0].groupName = '个人事务';
    myState = true;
  }
  return (
    <React.Fragment>
      <div>
        <div className="mainBoard-title">
          {!myState ? (
            <Avatar
              style={{
                width: '22px',
                height: '22px',
                marginRight: '5px',
                borderRadius: '5px',
              }}
              shape="square"
              src={
                mainItem[0].groupLogo
                  ? mainItem[0].groupLogo +
                    '?imageMogr2/auto-orient/thumbnail/80x'
                  : defaultGroupPng
              }
            />
          ) : null}
          {mainItem[0].groupName}
        </div>
      </div>

      {mainItem.map((taskItem: any, taskIndex: number) => {
        return <Task taskItem={taskItem} key={'task' + taskIndex} />;
      })}
    </React.Fragment>
  );
};
interface MainBoardProps {
  showType?: string;
}

const MainBoard: React.FC<MainBoardProps> = (props) => {
  const { showType } = props;
  const user = useTypedSelector((state) => state.auth.user);
  const selfTaskArray = useTypedSelector((state) => state.task.selfTaskArray);
  const theme = useTypedSelector((state) => state.auth.theme);
  const [mainArray, setMainArray] = useState<any>([]);
  const [finishNum, setFinishNum] = useState<any>(0);
  const [allNum, setAllNum] = useState<any>(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user && user._key) {
      setLoading(true);
      dispatch(
        getSelfTask(
          1,
          user._key,
          '[0, 1]',
          1,
          moment().add(1, 'days').startOf('day').valueOf(),
          1
        )
      );
    }
  }, [user]);
  useEffect(() => {
    if (selfTaskArray) {
      setLoading(false);
      let groupObj: any = {};
      let allNum = 0;
      let finishNum = 0;
      let state = '';
      const startTime = moment().startOf('day').valueOf();
      const endTime = moment().endOf('day').valueOf();
      if (theme.finishPercentArr && theme.finishPercentArr.indexOf('0') != -1) {
        state =
          state +
          '(item.finishPercent === 0 ' +
          ' && item.taskEndDate <= ' +
          endTime +
          ')';
      }
      if (theme.finishPercentArr && theme.finishPercentArr.indexOf('1') != -1) {
        state =
          state +
          (state
            ? '||(item.finishPercent === 1 && item.taskEndDate >= ' +
              startTime +
              '  && item.taskEndDate <= ' +
              endTime +
              ')'
            : '(item.finishPercent === 1 && item.taskEndDate >= ' +
              startTime +
              '  && item.taskEndDate <= ' +
              endTime +
              ')');
      }
      if (theme.finishPercentArr && theme.finishPercentArr.indexOf('2') != -1) {
        state =
          state +
          (state
            ? '||(item.finishPercent === 0 && item.taskEndDate <= ' +
              endTime +
              ')'
            : '(item.finishPercent === 0 && item.taskEndDate <=' +
              endTime +
              ')');
      }
      selfTaskArray.forEach((item: any, index: number) => {
        if (
          eval(state) &&
          item.taskEndDate &&
          (item.type === 2 || item.type === 6) &&
          (item.executorKey === user._key || item.creatorKey === user._key)
        ) {
          if (item.executorKey === user._key) {
            if (!groupObj[item.groupKey]) {
              groupObj[item.groupKey] = [];
            }
            item = formatDay(item);
            groupObj[item.groupKey].push(item);
            groupObj[item.groupKey] = _.sortBy(groupObj[item.groupKey], [
              'serialNumber',
            ]).reverse();
            if (item.finishPercent > 0) {
              finishNum++;
            }
            allNum++;
          }
        }
      });
      setFinishNum(finishNum);
      setAllNum(allNum);
      setMainArray(_.sortBy(_.values(groupObj), ['groupName']));
    }
  }, [selfTaskArray]);
  const formatDay = (item: any) => {
    let time = 0;
    item.percent = Math.floor(
      (item.hour * 3600000 - item.countDownTime) / (item.hour * 36000)
    );
    let countTime = item.hour * 3600000 - item.countDownTime;
    let hours = Math.floor(
      (countTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minutes = Math.floor((countTime % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((countTime % (1000 * 60)) / 1000);
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
  return (
    <div className="mainBoard">
      {loading ? <Loading /> : null}
      {/* {!showType ? (
        <div className="mainBoard-maintitle">
          今日事务 ({allNum - finishNum} / {allNum})
        </div>
      ) : null} */}
      {mainArray.length > 0 ? (
        <div className="mainBoard-item">
          {mainArray.map((mainItem: any, mainIndex: number) => {
            return (
              <MainBoardItem mainItem={mainItem} key={'main' + mainIndex} />
            );
          })}
        </div>
      ) : (
        <img src={nothingsSvg} />
      )}
    </div>
  );
};
export default MainBoard;
