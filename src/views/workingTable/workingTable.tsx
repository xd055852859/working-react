import React, { useState, useEffect } from 'react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { setHeaderIndex } from '../../redux/actions/memberActions';

import './workingTable.css';
import api from '../../services/api';

import WorkingTableHeader from './workingTableHeader';
import WorkingTableLabel from './workingTableLabel';
import WorkingTableGroup from './workingTableGroup';
import WorkingCalendar from './workingCalendar';
import WorkingReport from './workingReport';
import Grid from '../../components/grid/grid';
interface WorkingTableProps {}

const WorkingTable: React.FC<WorkingTableProps> = (prop) => {
  const user = useTypedSelector((state) => state.auth.user);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const memberHeaderIndex = useTypedSelector(
    (state) => state.member.memberHeaderIndex
  );

  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const moveState = useTypedSelector((state) => state.common.moveState);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const dispatch = useDispatch();
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };
  useEffect(() => {
    dispatch(setHeaderIndex(0));
  }, [headerIndex]);
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
              className="cooperation-info-labelName"
              onClick={() => {
                setInputVisible(true);
              }}
              style={{ background: '#fff', color: '#333' }}
            >
              <div>新建标签</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default WorkingTable;
