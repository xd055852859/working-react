import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../redux/reducer/RootState';
import './groupTable.css';
import { getGroupMember } from '../../redux/actions/memberActions';
import api from '../../services/api';
import GroupTableHeader from './groupTableHeader';
import GroupTableGroup from './groupTableGroup';
import GroupTableData from './groupTableData';
import WorkingCalendar from '../workingTable/workingCalendar';
import WorkingReport from '../workingTable/workingReport';
import Grid from '../../components/grid/grid';

interface GroupTableProps {}

const GroupTable: React.FC<GroupTableProps> = (prop) => {
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const memberHeaderIndex = useTypedSelector(
    (state) => state.member.memberHeaderIndex
  );
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const moveState = useTypedSelector((state) => state.common.moveState);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (user && user._key && groupKey) {
      dispatch(getGroupMember(groupKey));
    }
  }, [user, groupKey]);
  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };
  // const handleInputConfirm = async () => {
  //   setInputVisible(false);
  //   if (inputValue !== '') {
  //     await api.task.addTaskLabel(groupKey, inputValue);
  //     setInputValue('');
  //     await api.task.getTaskList(3, groupKey, '[0,1,2]');
  //   }
  // };
  return (
    <div
      className="groupTable"
      style={
        moveState === 'in'
          ? { animation: 'contentmoveIn 50ms', width: '100%' }
          : moveState === 'out'
          ? { animation: 'contentmoveOut 50ms', width: 'calc(100% - 320px)' }
          : {}
      }
    >
    
      <GroupTableHeader />
      <div className="groupTableContent">
        {/* <WorkingTableLabel /> */}
        {memberHeaderIndex === 0 ? <GroupTableGroup /> : null}
        {memberHeaderIndex === 1 ? <Grid gridState={true} /> : null}
        {memberHeaderIndex === 2 ? <Grid gridState={false} /> : null}
        {memberHeaderIndex === 3 ? <WorkingCalendar /> : null}
        {memberHeaderIndex === 7 ? <WorkingReport /> : null}
        {memberHeaderIndex === 8 ? <GroupTableData /> : null}
      </div>

      {/* <div
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
      </div> */}
    </div>
  );
};
export default GroupTable;
