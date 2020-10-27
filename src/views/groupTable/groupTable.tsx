import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../redux/reducer/RootState';
import './groupTable.css';
import {
  getGroupMember,
  setHeaderIndex,
} from '../../redux/actions/memberActions';
// import api from '../../services/api';
import GroupTableHeader from './groupTableHeader';
import GroupTableGroup from './groupTableGroup';
import GroupTableData from './groupTableData';
import WorkingCalendar from '../workingTable/workingCalendar';
import WorkingReport from '../workingTable/workingReport';
import Grid from '../../components/grid/grid';
import GroupTableDocument from './groupTableDocument';
import GroupTableTree from './groupTableTree';

import Vitality from '../../components/vitality/vitality';
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

  useEffect(() => {
    if (user && user._key && groupKey) {
      dispatch(getGroupMember(groupKey));
    }
  }, [user, groupKey]);
  useEffect(() => {
    if (groupKey) {
      dispatch(setHeaderIndex(0));
    }
  }, [groupKey]);
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
        {memberHeaderIndex === 0 ? <GroupTableGroup /> : null}
        {memberHeaderIndex === 1 ? <Grid gridState={true} /> : null}
        {memberHeaderIndex === 2 ? <Grid gridState={false} /> : null}
        {memberHeaderIndex === 3 ? <WorkingCalendar /> : null}
        {memberHeaderIndex === 4 ? <GroupTableTree /> : null}
        {memberHeaderIndex === 7 ? <WorkingReport /> : null}
        {memberHeaderIndex === 8 ? <GroupTableData /> : null}
        {memberHeaderIndex === 9 ? <GroupTableDocument /> : null}
        {memberHeaderIndex === 10 ? (
          <Vitality vitalityType={headerIndex} vitalityKey={groupKey} />
        ) : null}
       
      </div>
    </div>
  );
};
export default GroupTable;
