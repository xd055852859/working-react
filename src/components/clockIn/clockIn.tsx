import React, { useState, useEffect } from 'react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from 'moment';
import _ from 'lodash';
import './clockIn.css';
import api from '../../services/api';
import { setMessage } from '../../redux/actions/commonActions';
import downArrowbPng from '../../assets/img/downArrowb.png';
import DropMenu from '../common/dropMenu';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
interface ChatProps {}
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
const ClockIn: React.FC<ChatProps> = (prop) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const selfTaskArray = useTypedSelector((state) => state.task.selfTaskArray);
  const nowTime = useTypedSelector((state) => state.auth.nowTime);
  const [note, setNote] = useState('');
  const [positive, setPositive] = useState('');
  const [negative, setNegative] = useState('');
  const [expanded, setExpanded] = React.useState<string | false>('panel1');
  const [groupVisible, setGroupVisible] = useState(false);
  const [groupList, setGroupList] = useState<any>([]);
  const [taskNumber, setTaskNumber] = useState(0);
  const [clockInIndex, setClockInIndex] = useState(0);
  useEffect(() => {
    if (user && user._key) {
      getClockIn();
    }
  }, [user]);
  useEffect(() => {
    if (selfTaskArray) {
      let newGroupObj: any = {};
      let newGroupList: any = [];
      let newTaskNumber = 0;
      const startTime = moment().startOf('day').valueOf();
      const endTime = moment().endOf('day').valueOf();
      selfTaskArray.forEach((item: any, index: number) => {
        let finishState =
          item.finishPercent === 1 &&
          item.todayTaskTime >= startTime &&
          item.todayTaskTime <= endTime;
        if (
          item.executorKey === user._key &&
          ((item.finishPercent === 0 && item.taskEndDate <= endTime) ||
            finishState) &&
          item.title !== '' &&
          item.taskEndDate
        ) {
          if (!newGroupObj[item.groupKey]) {
            newGroupObj[item.groupKey] = {
              groupLogo: item.groupLogo,
              groupName: item.groupName,
              groupKey: item.groupKey,
              taskNumber: 1,
            };
          } else {
            newGroupObj[item.groupKey].taskNumber =
              newGroupObj[item.groupKey].taskNumber + 1;
          }
          if (item.finishPercent === 1) {
            newTaskNumber = newTaskNumber + 1;
          }
        }
      });
      newGroupList = _.sortBy(Object.values(newGroupObj), [
        'taskNumber',
      ]).reverse();
      setGroupList(newGroupList);
      setTaskNumber(newTaskNumber);
    }
  }, [selfTaskArray]);
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
      dispatch(setMessage(true, '随记保存成功', 'success'));
    } else {
      dispatch(setMessage(true, noteRes.msg, 'error'));
    }
  };

  const clockIn = async () => {
    const startTime = moment().startOf('day').valueOf();
    const timeStr = moment().format('YYYY/MM/DD HH:mm:ss');
    let obj: any = {
      startTime: startTime,
      type: nowTime ? 2 : 1,
      groupKey: groupList[clockInIndex].groupKey,
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
    <div className="clockIn">
      {groupList.length > 0 ? (
        <div
          className="clockIn-title"
          onClick={() => {
            setGroupVisible(true);
          }}
        >
          默认打卡群:
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
              top: '40px',
              left: '95px',
              color: '#333',
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
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>随记</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <textarea
            value={note}
            placeholder="随记"
            className="clockIn-textarea"
            onChange={(e) => {
              setNote(e.target.value);
            }}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>成就</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <textarea
            value={positive}
            placeholder="正面：利好、收获"
            className="clockIn-textarea"
            onChange={(e) => {
              setPositive(e.target.value);
            }}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel3'}
        onChange={handleChange('panel3')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>风险</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <textarea
            value={negative}
            placeholder="负面：利空、风险、压力"
            className="clockIn-textarea"
            onChange={(e) => {
              setNegative(e.target.value);
            }}
          />
        </AccordionDetails>
      </Accordion>
      <div className="clockIn-button">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            saveNote();
          }}
          className={classes.saveButton}
        >
          保存
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            clockIn();
          }}
          className={classes.clockInButton}
        >
          {nowTime ? '下班打卡' : '上班打卡'}
        </Button>
      </div>
    </div>
  );
};
export default ClockIn;
