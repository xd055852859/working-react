import React, { useState, useEffect, useRef } from 'react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { setHeaderIndex } from '../../redux/actions/memberActions';
import { getWorkingTableTask } from '../../redux/actions/taskActions';
import { setMessage } from '../../redux/actions/commonActions';
import './workingTable.css';
import api from '../../services/api';

import WorkingTableHeader from './workingTableHeader';
import WorkingTableLabel from './workingTableLabel';
import WorkingTableGroup from './workingTableGroup';
import WorkingCalendar from './workingCalendar';
import WorkingReport from './workingReport';
import Grid from '../../components/grid/grid';
import Loading from '../../components/common/loading';
import Vitality from '../../components/vitality/vitality';
import taskAddPng from '../../assets/img/taskAdd.png';
interface WorkingTableProps {}

const WorkingTable: React.FC<WorkingTableProps> = (prop) => {
  const user = useTypedSelector((state) => state.auth.user);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const memberHeaderIndex = useTypedSelector(
    (state) => state.member.memberHeaderIndex
  );
  const userKey = useTypedSelector((state) => state.auth.userKey);
  const targetUserKey = useTypedSelector((state) => state.auth.targetUserKey);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  // const groupKey = useTypedSelector((state) => state.group.groupKey);
  const moveState = useTypedSelector((state) => state.common.moveState);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const workingTaskArray = useTypedSelector(
    (state) => state.task.workingTaskArray
  );
  const theme = useTypedSelector((state) => state.auth.theme);
  const dispatch = useDispatch();
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [addLabelInputState, setAddLabelInputState] = useState<any>(null);
  const addLabelRef: React.RefObject<any> = useRef();
  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };
  useEffect(() => {
    if (user && user._key && headerIndex === 1 && theme.fileDay) {
      setLoading(true);
      dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2], theme.fileDay));
    }
    if (
      targetUserInfo &&
      targetUserInfo._key &&
      headerIndex === 2 &&
      theme.fileDay
    ) {
      setLoading(true);
      dispatch(
        getWorkingTableTask(2, targetUserInfo._key, 1, [0, 1, 2], theme.fileDay)
      );
    }
  }, [user, targetUserInfo, headerIndex, theme.fileDay]);
  useEffect(() => {
    setLoading(false);
    dispatch(setHeaderIndex(0));
  }, [headerIndex]);
  useEffect(() => {
    if (workingTaskArray) {
      setLoading(false);
    }
  }, [workingTaskArray]);
  const handleInputConfirm = async () => {
    if (addLabelInputState == 'out') {
      setAddLabelInputState('in');
      if (inputValue !== '') {
        let addLabelRes: any = await api.task.addTaskLabel(
          mainGroupKey,
          inputValue
        );
        if (addLabelRes.msg === 'OK') {
          dispatch(setMessage(true, '添加私有频道成功', 'success'));
          setInputValue('');
          dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2]));
        } else {
          dispatch(setMessage(true, addLabelRes.msg, 'error'));
        }
      }
    }
  };

  return (
    <div
      className="workingTable"
      style={
        moveState === 'in'
          ? { animation: 'contentmoveIn 50ms', width: '100%' }
          : moveState === 'out'
          ? { animation: 'contentmoveOut 50ms', width: 'calc(100% - 320px)' }
          : {}
      }
    >
      {loading ? <Loading /> : null}
      <WorkingTableHeader />
      <div className="workingTableContent">
        {memberHeaderIndex === 0 || memberHeaderIndex === 4 ? (
          <WorkingTableLabel />
        ) : null}
        {memberHeaderIndex === 1 || memberHeaderIndex === 5 ? (
          <WorkingTableGroup />
        ) : null}
        {memberHeaderIndex === 2 ? <Grid gridState={true} /> : null}
        {memberHeaderIndex === 3 ? <Grid gridState={false} /> : null}
        {memberHeaderIndex === 6 ? <WorkingCalendar /> : null}
        {memberHeaderIndex === 7 ? <WorkingReport /> : null}
        {memberHeaderIndex === 8 ? (
          <Vitality
            vitalityType={2}
            vitalityKey={headerIndex == 1 ? userKey : targetUserKey}
          />
        ) : null}
      </div>
      {headerIndex === 1 ? (
        <React.Fragment>
          <input
            className="workingTable-addLabel-input"
            onChange={handleInputChange}
            onBlur={() => {
              handleInputConfirm();
            }}
            value={inputValue}
            ref={addLabelRef}
            placeholder="输入标签名"
            style={
              addLabelInputState === 'in'
                ? {
                    animation: 'addLabelInputIn 500ms',
                    width: '0px',
                    padding: '0px',
                  }
                : addLabelInputState === 'out'
                ? {
                    animation: 'addLabelInputOut 500ms',
                    width: '250px',
                    padding: '0px 8px',
                  }
                : { width: '0px', opacity: 0, padding: '0px' }
            }
          />
          <div
            // className="cooperation-info-labelName"
            className="workingTable-addLabel"
            onClick={() => {
              // setInputVisible(true);
              addLabelRef.current.focus();
              setAddLabelInputState('out');
              // handleInputConfirm();
            }}
            // style={{ background: '#fff', color: '#333' }}
          >
            <img
              src={taskAddPng}
              alt=""
              style={{ height: '35px', color: '35px' }}
            />
          </div>
        </React.Fragment>
      ) : null}
    </div>
  );
};
export default WorkingTable;
