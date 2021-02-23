import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../redux/reducer/RootState';
import './groupTable.css';
import { getGroupTask } from '../../redux/actions/taskActions';
import {
  getGroupMember,
  setHeaderIndex,
} from '../../redux/actions/memberActions';
import { changeStartId, getGroupInfo } from '../../redux/actions/groupActions';
import { getTheme } from '../../redux/actions/authActions';
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
import Calendar from '../../views/calendar/calendar';

interface GroupTableProps {}

const GroupTable: React.FC<GroupTableProps> = (prop) => {
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const filterObject = useTypedSelector((state) => state.task.filterObject);
  const taskArray = useTypedSelector((state) => state.task.taskArray);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const memberHeaderIndex = useTypedSelector(
    (state) => state.member.memberHeaderIndex
  );
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const moveState = useTypedSelector((state) => state.common.moveState);
  const groupMemberItem = useTypedSelector(
    (state) => state.member.groupMemberItem
  );
  useEffect(() => {
    if (groupKey) {
      dispatch(getGroupMember(groupKey, 4));
      dispatch(getGroupInfo(groupKey));
      dispatch(getGroupTask(3, groupKey, '[0,1,2,10]'));
      dispatch(getTheme());
    }
  }, [groupKey]);
  useEffect(() => {
    if (user && user._key && groupKey && taskArray) {
      dispatch(getGroupTask(3, groupKey, '[0,1,2,10]'));
    }
  }, [filterObject]);
  useEffect(() => {
    if (groupInfo && groupInfo.taskTreeRootCardKey) {
      dispatch(changeStartId(groupInfo.taskTreeRootCardKey));
    }
  }, [groupInfo]);
  useEffect(() => {
    if (groupKey && memberHeaderIndex !== 11) {
      // if (!groupMemberItem.config.headerIndex) {
      //   groupMemberItem.config.headerIndex = 0;
      // }
      // dispatch(setHeaderIndex(groupMemberItem.config.headerIndex));
      dispatch(setHeaderIndex(0));
    }
  }, [headerIndex]);

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
      <div
        className="groupTableContent"
        style={memberHeaderIndex !== 0 ? { overflow: 'auto' } : {}}
      >
        {memberHeaderIndex === 0 ? <GroupTableGroup /> : null}
        {memberHeaderIndex === 1 ? <Grid gridState={true} /> : null}
        {memberHeaderIndex === 2 ? <Grid gridState={false} /> : null}
        {memberHeaderIndex === 3 ? <WorkingCalendar /> : null}

        {memberHeaderIndex === 7 ? <WorkingReport /> : null}
        {memberHeaderIndex === 8 ? <GroupTableData /> : null}
        {memberHeaderIndex === 9 ? <GroupTableDocument /> : null}
        {memberHeaderIndex === 10 ? (
          <Vitality vitalityType={headerIndex} vitalityKey={groupKey} />
        ) : null}
        {memberHeaderIndex === 11 ? <GroupTableTree /> : null}
        {memberHeaderIndex === 12 ? (
          <Calendar targetGroupKey={groupKey} />
        ) : null}
      </div>
    </div>
  );
};
export default GroupTable;
