import React, { useEffect } from 'react';
import './groupTable.css';
import GroupTableHeader from './groupTableHeader';
import GroupTableGroup from './groupTableGroup';

interface GroupTableProps {}

const GroupTable: React.FC<GroupTableProps> = (prop) => {
  return (
    <div className="groupTable">
      <GroupTableHeader />
      <div className="groupTableContent">
        {/* <WorkingTableLabel /> */}
        <GroupTableGroup />
      </div>
    </div>
  );
};
export default GroupTable;
