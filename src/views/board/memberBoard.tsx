import React, { useState, useEffect } from 'react';
import './memberBoard.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { getTeamTask } from '../../redux/actions/taskActions';
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
interface MemberBoardItemProps {
  memberItem: any;
}
const MemberBoardItem: React.FC<MemberBoardItemProps> = (props) => {
  const { memberItem } = props;
  const classes = useStyles();
  return (
    <div>
      <div className="memberBoard-title">
        <Avatar
          alt="人头像"
          src={
            memberItem[0][0].executorAvatar +
            '?imageMogr2/auto-orient/thumbnail/80x80/format/jpg'
          }
          className={classes.avatar}
        />
        {memberItem[0][0].executorName}
      </div>
      {memberItem.map((item: any, index: number) => {
        return (
          <div key={'memberItem' + index}>
            <div className="memberBoard-group" style={{ marginTop: '5px' }}>
              <Avatar
                alt="群头像"
                src={
                  item[0].groupLogo +
                  '?imageMogr2/auto-orient/thumbnail/80x80/format/jpg'
                }
                className={classes.logo}
              />
              {item[0].groupName}
            </div>
            <div className="memberBoard-info">
              {item.map((taskItem: any, taskIndex: number) => {
                return (
                  <div
                    className="countdown-right-task"
                    key={'task' + taskIndex}
                  >
                    <Task taskItem={taskItem} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
const MemberBoard: React.FC = () => {
  const user = useTypedSelector((state) => state.auth.user);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const teamTaskArray = useTypedSelector((state) => state.task.teamTaskArray);
  // const [memberObj, setMemberObj] = useState<any>({});
  const [memberGroupArray, setGroupMemberArray] = useState<any>([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (mainGroupKey) {
      dispatch(getTeamTask([0, 1]));
    }
  }, [mainGroupKey]);
  useEffect(() => {
    // 用户已登录
    if (teamTaskArray && user && user._key) {
      let personObj: any = {};
      let personGroupObj: any = {};
      let personGroupArray: any = [];
      teamTaskArray.forEach((item: any, index: number) => {
        if (
          item.executorKey != user._key &&
          item.groupName.indexOf('主群') == -1 &&
          item.title != ''
        ) {
          if (!personObj[item.executorKey]) {
            personObj[item.executorKey] = [];
          }
          item = formatDay(item);
          personObj[item.executorKey].push(item);
          // this.showTabObj[item.executorKey] = true;
          personObj[item.executorKey] = _.sortBy(personObj[item.executorKey], [
            'taskEndDate',
          ]).reverse();
        }
      });
      for (let key in personObj) {
        personGroupObj[key] = {};
        personObj[key].forEach((personItem: any, personIndex: number) => {
          if (!personGroupObj[key][personItem.groupKey]) {
            personGroupObj[key][personItem.groupKey] = [];
          }
          personGroupObj[key][personItem.groupKey].push(personItem);
        });
      }
      Object.values(personGroupObj).map((item: any, index: number) => {
        personGroupArray.push(Object.values(item));
      });
      setGroupMemberArray(personGroupArray);
    }
  }, [teamTaskArray, user]);
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
    <div className="memberBoard">
      {memberGroupArray.map((memberItem: any, memberIndex: number) => {
        return (
          <MemberBoardItem
            memberItem={memberItem}
            key={'memberGroup' + memberIndex}
          />
        );
      })}
    </div>
  );
};
export default MemberBoard;
