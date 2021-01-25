import React, { useState, useEffect } from 'react';
import './mainBoard.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { getSelfTask } from '../../redux/actions/taskActions';
import Task from '../../components/task/task';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import moment from 'moment';
import _ from 'lodash';
import Avatar from '@material-ui/core/Avatar';
import theme from '../../theme';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
import Loading from '../../components/common/loading';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      width: '22px',
      height: '22px',
      marginRight: '5px',
    },
    logo: {
      width: '14px',
      height: '14px',
      marginRight: '5px',
    },
  })
);
interface MainBoardItemProps {
  mainItem: any;
}
const MainBoardItem: React.FC<MainBoardItemProps> = (props) => {
  const user = useTypedSelector((state) => state.auth.user);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const dispatch = useDispatch();
  const { mainItem } = props;
  const classes = useStyles();
  let myState = false;
  if (
    mainItem[0].groupName.indexOf('主群') !== -1 &&
    mainItem[0].groupKey === mainGroupKey
  ) {
    mainItem[0].groupName = '个人事务';
    myState = true;
  }
  const changeTask = (taskDetail: any) => {
    // dispatch(
    //   getSelfTask(
    //     1,
    //     user._key,
    //     '[0, 1]',
    //     1,
    //     moment().add(1, 'days').startOf('day').valueOf(),
    //     1
    //   )
    // );
  };
  return (
    <React.Fragment>
      <div>
        <div className="mainBoard-title">
          {!myState ? (
            <Avatar
              alt="群头像"
              src={
                mainItem[0].groupLogo
                  ? mainItem[0].groupLogo +
                    '?imageMogr2/auto-orient/thumbnail/80x'
                  : defaultGroupPng
              }
              className={classes.avatar}
            />
          ) : null}
          {mainItem[0].groupName}
        </div>
      </div>
      <React.Fragment
      // style={{backgroundColor: countType==='index'?'rgba(0, 0, 0, 0.05)':'rgba(0, 0, 0, 0.12)'}}
      // className="countdown-right-info"
      >
        {mainItem.map((taskItem: any, taskIndex: number) => {
          return (
            // <div className="countdown-right-task">
            <Task
              taskItem={taskItem}
              key={'task' + taskIndex}
              changeTask={changeTask}
              // myState={myState}
              // timeSetStatus={taskIndex > mainItem.length - 3}
            />
            // </div>
          );
        })}
      </React.Fragment>
    </React.Fragment>
  );
};
interface MainBoardProps {
  getNum?: any;
  showType?: string;
}

const MainBoard: React.FC<MainBoardProps> = (props) => {
  const { getNum, showType } = props;
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
      let groupArray = [];
      let createNum = 0;
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
        // if (
        //   item.creatorKey === user._key &&
        //   item.createTime >= startTime &&
        //   item.createTime < endTime
        // ) {
        //   createNum++;
        // }
        // let finishState =
        //   item.finishPercent === 1 &&
        //   item.todayTaskTime >= startTime &&
        //   item.todayTaskTime <= endTime;
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
            // this.showTabObj[item.groupKey] = true;
            groupObj[item.groupKey] = _.sortBy(groupObj[item.groupKey], [
              'serialNumber',
            ]).reverse();
            // groupObj[item.groupKey] = _.sortBy(groupObj[item.groupKey], [
            //   'finishPercent',
            // ]);
            if (item.finishPercent > 0) {
              finishNum++;
            }
            allNum++;
          }
        }
      });
      setFinishNum(finishNum);
      setAllNum(allNum);
      // getNum(createNum, finishNum);
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
      {loading ? <Loading loadingWidth="80px" loadingHeight="80px" /> : null}
      {!showType ? (
        <div className="mainBoard-maintitle">
          今日事务 ({allNum - finishNum} / {allNum})
        </div>
      ) : null}
      <div
        className="mainBoard-item"
        style={{ height: showType ? '100%' : 'calc(100% - 50px)' }}
      >
        {mainArray.map((mainItem: any, mainIndex: number) => {
          return <MainBoardItem mainItem={mainItem} key={'main' + mainIndex} />;
        })}
      </div>
    </div>
  );
};
export default MainBoard;
