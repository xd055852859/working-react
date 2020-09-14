import React, { useState, useEffect } from 'react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { setHeaderIndex } from '../../redux/actions/memberActions';
import { getWorkingTableTask } from '../../redux/actions/taskActions';
import './workingTable.css';
import api from '../../services/api';

import WorkingTableHeader from './workingTableHeader';
import WorkingTableLabel from './workingTableLabel';
import WorkingTableGroup from './workingTableGroup';
import WorkingCalendar from './workingCalendar';
import WorkingReport from './workingReport';
import Grid from '../../components/grid/grid';
import Loading from '../../components/common/loading';
import taskAddPng from '../../assets/img/taskAdd.png';
interface WorkingTableProps {}

const WorkingTable: React.FC<WorkingTableProps> = (prop) => {
  const user = useTypedSelector((state) => state.auth.user);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const memberHeaderIndex = useTypedSelector(
    (state) => state.member.memberHeaderIndex
  );
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const moveState = useTypedSelector((state) => state.common.moveState);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const workingTaskArray = useTypedSelector(
    (state) => state.task.workingTaskArray
  );
  const dispatch = useDispatch();
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };
  useEffect(() => {
    if (user && user._key && headerIndex === 1) {
      setLoading(true);
      dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2]));
    }
    if (targetUserInfo && targetUserInfo._key && headerIndex === 2) {
      setLoading(true);
      dispatch(getWorkingTableTask(2, targetUserInfo._key, 1, [0, 1, 2]));
    }
  }, [user, targetUserInfo, headerIndex]);
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
    setInputVisible(false);
    if (inputValue !== '') {
      console.log(mainGroupKey);
      await api.task.addTaskLabel(mainGroupKey, inputValue);
      setInputValue('');
      await api.task.getGroupTask(1, user._key, 1, [0, 1, 2]);
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
        {memberHeaderIndex === 0 || memberHeaderIndex === 2 ? (
          <WorkingTableLabel />
        ) : null}
        {memberHeaderIndex === 1 || memberHeaderIndex === 3 ? (
          <WorkingTableGroup />
        ) : null}
        {memberHeaderIndex === 4 ? <Grid gridState={true} /> : null}
        {memberHeaderIndex === 5 ? <Grid gridState={false} /> : null}
        {memberHeaderIndex === 6 ? <WorkingCalendar /> : null}
        {memberHeaderIndex === 7 ? <WorkingReport /> : null}
      </div>
      <div
        className="cooperation-container-item"
        style={{
          width: '350px',
          position: 'fixed',
          bottom: '2px',
          right: '0px',
        }}
      >
        <div className="cooperation-info" style={{ width: '100%' }}>
          {inputVisible ? (
            <input
              style={{ width: '100%', height: '35px' }}
              onChange={handleInputChange}
              value={inputValue}
              onBlur={() => {
                handleInputConfirm();
              }}
              placeholder="输入标签名"
            />
          ) : (
            <div
              // className="cooperation-info-labelName"
              className="workingTable-addLabel"
              onClick={() => {
                setInputVisible(true);
                // handleInputConfirm();
              }}
              // style={{ background: '#fff', color: '#333' }}
            >
              <img
                src={taskAddPng}
                alt=""
                style={{ height: '60px', color: '60px' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default WorkingTable;
