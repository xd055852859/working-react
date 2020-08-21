import React, { useEffect } from 'react';
import './workingTable.css';
import WorkingTableHeader from './workingTableHeader';
import WorkingTableLabel from './workingTableLabel';
import WorkingTableGroup from './workingTableGroup';

interface WorkingTableProps {}

const WorkingTable: React.FC<WorkingTableProps> = (prop) => {
  return (
    <div className="workingTable">
      <WorkingTableHeader />
      <div className="workingTableContent">
        {/* <WorkingTableLabel /> */}
        <WorkingTableGroup />
      </div>
    </div>
  );
};
export default WorkingTable;
