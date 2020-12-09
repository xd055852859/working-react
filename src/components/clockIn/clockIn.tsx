import React, { useState, useEffect } from 'react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import moment from 'moment';
import _ from 'lodash';
import './clockIn.css';
import api from '../../services/api';
import { setMessage } from '../../redux/actions/commonActions';
import downArrowbPng from '../../assets/img/downArrowb.png';
import DropMenu from '../common/dropMenu';
import Dialog from '../common/dialog';
import WorkingReport from '../../views/workingTable/workingReport_clone1';

import defaultGroupPng from '../../assets/img/defaultGroup.png';
import reportSvg from '../../assets/svg/report.svg';
interface ClockInProps {
  visible: boolean;
  onClose: any;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    saveButton: {
      backgroundColor: '#16AE7A',
      color: '#fff',
      marginRight: '10px',
    },
    clockInButton: {
      backgroundColor: '#FC766A',
      color: '#fff',
    },
  })
);
const ClockIn: React.FC<ClockInProps> = (prop) => {
  const { visible, onClose } = prop;
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const selfTaskArray = useTypedSelector((state) => state.task.selfTaskArray);
  const nowTime = useTypedSelector((state) => state.auth.nowTime);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const [note, setNote] = useState('');
  const [positive, setPositive] = useState('');
  const [negative, setNegative] = useState('');
  const [expanded, setExpanded] = React.useState<string | false>('panel1');
  const [groupVisible, setGroupVisible] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [groupList, setGroupList] = useState<any>([]);
  const [taskNumber, setTaskNumber] = useState(0);
  const [clockInIndex, setClockInIndex] = useState(0);
  useEffect(() => {
    if (user && user._key && visible) {
      getClockIn();
      getGroupList();
    }
  }, [user, visible]);
  useEffect(() => {
    if (selfTaskArray) {
      let newGroupList: any = [];
      let newTaskNumber = 0;
      const startTime = moment().startOf('day').valueOf();
      const endTime = moment().endOf('day').valueOf();
      selfTaskArray.forEach((item: any, index: number) => {
        let finishState =
          item.finishPercent === 1 &&
          item.taskEndDate >= startTime &&
          item.taskEndDate <= endTime;
        if (
          item.executorKey === user._key &&
          ((item.finishPercent === 0 && item.taskEndDate <= endTime) ||
            finishState) &&
          item.title !== '' &&
          item.taskEndDate &&
          item.groupKey != mainGroupKey
        ) {
          // if (!newGroupObj[item.groupKey]) {
          //   newGroupObj[item.groupKey] = {
          //     groupLogo: item.groupLogo,
          //     groupName: item.groupName,
          //     groupKey: item.groupKey,
          //     taskNumber: 1,
          //   };
          // } else {
          //   newGroupObj[item.groupKey].taskNumber =
          //     newGroupObj[item.groupKey].taskNumber + 1;
          // }
          if (item.finishPercent === 1) {
            newTaskNumber = newTaskNumber + 1;
          }
        }
      });
      // newGroupList = _.sortBy(Object.values(newGroupObj), [
      //   'taskNumber',
      // ]).reverse();
      setTaskNumber(newTaskNumber);
    }
  }, [selfTaskArray]);
  const getGroupList = async () => {
    let newGroupList: any = [];
    let groupRes: any = await api.group.getGroup(3, null, 4);
    if (groupRes.msg === 'OK') {
      groupRes.result = groupRes.result.filter(
        (groupItem: any, groupIndex: number) => {
          if (groupItem.groupName.indexOf('个人事务') == -1) {
            newGroupList.push(groupItem);
          }
        }
      );
      setGroupList(newGroupList);
    } else {
      dispatch(setMessage(true, groupRes.msg, 'error'));
    }
  };
  const getClockIn = async () => {
    let noteRes: any = await api.auth.getNote(
      user._key,
      moment().startOf('day').valueOf()
    );
    if (noteRes.msg === 'OK') {
      setPositive(noteRes.result.positive);
      setNegative(noteRes.result.negative);
      setNote(noteRes.result.note);
    } else {
      if (noteRes.msg === '无该成就/风险/随记') {
        await api.auth.setNote({
          startTime: moment().startOf('day').valueOf(),
          type: 2,
          positive: '',
          negative: '',
          note: '',
          positiveClose: '',
          negativeClose: '',
          noteClose: '',
        });
      } else {
        dispatch(setMessage(true, noteRes.msg, 'error'));
      }
    }
  };
  const saveNote = async () => {
    let noteRes: any = await api.auth.setNote({
      startTime: moment().startOf('day').valueOf(),
      type: 2,
      positive: positive,
      negative: negative,
      note: note,
    });
    if (noteRes.msg === 'OK') {
      // dispatch(setMessage(true, '随记保存成功', 'success'));
    } else {
      dispatch(setMessage(true, noteRes.msg, 'error'));
    }
  };

  const clockIn = async () => {
    const startTime = moment().startOf('day').valueOf();
    const timeStr = moment().format('YYYY/MM/DD HH:mm:ss');
    saveNote();
    let obj: any = {
      startTime: startTime,
      type: nowTime ? 2 : 1,
      groupKey: groupList[clockInIndex]._key,
      clockInDateStr: timeStr,
      isAuto: 2,
    };
    if (nowTime) {
      obj.positive = positive;
      obj.negative = negative;
      obj.note = note;
      // obj.positiveClose = this.positiveClose;
      // obj.negativeClose = this.negativeClose;
      // obj.noteClose = this.noteClose;
    }
    let res: any = await api.auth.clockIn(obj);
    if (res.msg === 'OK') {
      dispatch(setMessage(true, '打卡成功', 'success'));
      if (nowTime) {
        let url =
          'http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&per=3&text=打卡成功,你已完成' +
          taskNumber +
          '条任务';
        let n = new Audio(url);
        n.src = url;
        n.play();
      }
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };
  const handleChange = (panel: string) => (
    event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <React.Fragment>
      {visible ? (
        <ClickAwayListener
          onClickAway={() => {
            onClose();
            saveNote();
          }}
        >
          <div className="clockIn">
            <div className="clockIn-mainTitle">打卡中心</div>
            {groupList.length > 0 ? (
              <div
                className="clockIn-title"
                onClick={() => {
                  setGroupVisible(true);
                }}
              >
                晒一晒:
                <div className="clockIn-title-logo">
                  <img
                    src={
                      groupList[clockInIndex].groupLogo
                        ? groupList[clockInIndex].groupLogo
                        : defaultGroupPng
                    }
                    alt=""
                  />
                </div>
                {groupList[clockInIndex].groupName}
                <img src={downArrowbPng} alt="" className="clockIn-logo" />
                <DropMenu
                  visible={groupVisible}
                  dropStyle={{
                    width: '200px',
                    height: '500px',
                    top: '40px',
                    left: '95px',
                    color: '#333',
                    overflow: 'auto',
                  }}
                  onClose={() => {
                    setGroupVisible(false);
                  }}
                >
                  <React.Fragment>
                    {groupList.map((groupItem: any, groupIndex: number) => {
                      return (
                        <div
                          key={'clockInGroup' + groupIndex}
                          onClick={() => {
                            setClockInIndex(groupIndex);
                          }}
                          className="clockInGroup-item"
                        >
                          <div className="clockInGroup-item-logo">
                            <img
                              src={
                                groupItem.groupLogo
                                  ? groupItem.groupLogo
                                  : defaultGroupPng
                              }
                              alt=""
                            />
                          </div>
                          {groupItem.groupName}
                        </div>
                      );
                    })}
                  </React.Fragment>
                </DropMenu>
              </div>
            ) : null}
            <div className="clockIn-info">
              <div className="clockIn-info-title">随记</div>
              <textarea
                value={note}
                placeholder="随记"
                className="clockIn-textarea"
                onChange={(e) => {
                  setNote(e.target.value);
                }}
              />
            </div>
            <div className="clockIn-info">
              <div className="clockIn-info-title">成就</div>
              <textarea
                value={positive}
                placeholder="成绩,收获,价值创造"
                className="clockIn-textarea"
                onChange={(e) => {
                  setPositive(e.target.value);
                }}
              />
            </div>
            <div className="clockIn-info">
              <div className="clockIn-info-title">审视</div>
              <textarea
                value={negative}
                placeholder="困难，挑战，潜在问题"
                className="clockIn-textarea"
                onChange={(e) => {
                  setNegative(e.target.value);
                }}
              />
            </div>
            <div className="clockIn-button">
              {/* <Button
          variant="contained"
          color="primary"
          onClick={() => {
            saveNote();
          }}
          className={classes.saveButton}
        >
          保存
        </Button> */}
              <div
                onClick={() => {
                  setShowReport(true);
                }}
                className="clockIn-report"
              >
                <img src={reportSvg} alt="" style={{ marginRight: '5px' }} />
                <div>日志</div>
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  clockIn();
                }}
                style={{ color: '#fff' }}
                // className={classes.clockInButton}
              >
                {nowTime ? '下班打卡' : '上班打卡'}
              </Button>
            </div>
            <Dialog
              visible={showReport}
              onClose={() => {
                setShowReport(false);
              }}
              footer={false}
              title={'日志'}
              dialogStyle={{
                width: '90%',
                height: '90%',
                overflow: 'auto',
              }}
            >
              <WorkingReport headerType={true} />
            </Dialog>
          </div>
        </ClickAwayListener>
      ) : null}
    </React.Fragment>
  );
};
export default ClockIn;
