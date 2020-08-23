import React, { useState,useEffect } from 'react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import './groupTable.css';
import api from '../../services/api'
import GroupTableHeader from './groupTableHeader';
import GroupTableGroup from './groupTableGroup';

interface GroupTableProps { }

const GroupTable: React.FC<GroupTableProps> = (prop) => {
  const user = useTypedSelector((state) => state.auth.user);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const groupKey = useTypedSelector((state) => state.group.groupKey);

  const [inputVisible,
    setInputVisible] = useState(false);
  const [inputValue,
    setInputValue] = useState('');
  const handleInputChange = (e: any) => {
    setInputValue(e.target.value)
  }
  const handleInputConfirm = async () => {
    setInputVisible(false)
    if (inputValue != "") {
      await api.task.addTaskLabel(groupKey, inputValue);
      setInputValue('');
      await api.task.getTaskList(3, groupKey, '[0,1,2]');
    }
  }
  return (
    <div className="groupTable">
      <GroupTableHeader />
      <div className="groupTableContent">
        {/* <WorkingTableLabel /> */}
        <GroupTableGroup />
      </div>
      <div
        className="cooperation-container-item"
        style=
        {{
          width: '350px',
          position: 'fixed',
          bottom: '2px',
          right: '0px'
        }}
      >
        <div className="cooperation-info" style={{ width: '100%' }}>
          {inputVisible ?
            <input
              style={{ width: '100%', height: '35px' }}
              onChange={handleInputChange}
              value={inputValue}
              onBlur={() => { handleInputConfirm() }}
              placeholder="输入标签名"
            />
            : <div className="cooperation-info-labelName"
              onClick={() => { setInputVisible(true) }}
              style={{ background: '#fff', color: '#333' }}
            >
              <div>新建标签</div>
            </div>}
        </div>
      </div>
    </div>
  );
};
export default GroupTable;
