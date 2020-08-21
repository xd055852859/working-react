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
  const { mainItem } = props;
  const classes = useStyles();
  return (
    <React.Fragment>
      <div>
        <div className="mainBoard-title">
          <Avatar
            alt="群头像"
            src={
              mainItem[0].groupLogo +
              '?imageMogr2/auto-orient/thumbnail/80x80/format/jpg'
            }
            className={classes.avatar}
          />
          {mainItem[0].groupName}
        </div>
      </div>
      <div
        // style={{backgroundColor: countType=='index'?'rgba(0, 0, 0, 0.05)':'rgba(0, 0, 0, 0.12)'}}
        className="countdown-right-info"
      >
        {mainItem.map((taskItem: any, taskIndex: number) => {
          return (
            <div className="countdown-right-task" key={'task' + taskIndex}>
              <Task taskItem={taskItem} />
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};

const MainBoard: React.FC = () => {
  const user = useTypedSelector((state) => state.auth.user);
  const selfTaskArray = useTypedSelector((state) => state.task.selfTaskArray);
  // const [memberObj, setMemberObj] = useState<any>({});
  const [mainArray, setMainArray] = useState<any>([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user && user._key) {
      dispatch(getSelfTask(1, user._key, '[0, 1]'));
    }
  }, [user]);
  useEffect(() => {
    if (selfTaskArray) {
      let groupObj: any = {};
      let groupArray = [];
      const startTime = moment().startOf('day').valueOf();
      const endTime = moment().endOf('day').valueOf();
      selfTaskArray.forEach((item: any, index: number) => {
        let finishState =
          item.finishPercent == 1 &&
          item.todayTaskTime >= startTime &&
          item.todayTaskTime < endTime;
        if (
          item.executorKey == user._key &&
          item.taskEndDate < endTime &&
          (finishState || item.finishPercent == 0) &&
          item.title != '' &&
          item.taskEndDate
        ) {
          if (!groupObj[item.groupKey]) {
            groupObj[item.groupKey] = [];
          }
          item = formatDay(item);
          groupObj[item.groupKey].push(item);
          // this.showTabObj[item.groupKey] = true;
          groupObj[item.groupKey] = _.sortBy(groupObj[item.groupKey], [
            'taskEndDate',
          ]).reverse();
          groupObj[item.groupKey] = _.sortBy(groupObj[item.groupKey], [
            'finishPercent',
          ]);
        }
      });
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
      {mainArray.map((mainItem: any, mainIndex: number) => {
        return <MainBoardItem mainItem={mainItem} key={'main' + mainIndex} />;
      })}
    </div>
  );
};
export default MainBoard;
