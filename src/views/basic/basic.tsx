import React, { useEffect, useRef } from 'react';
import './basic.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import {
  setUnMessageNum,
  setSocketObj,
} from '../../redux/actions/commonActions';

import { setNewTaskArray } from '../../redux/actions/taskActions';
import HeaderSet from '../../components/headerSet/headerSet';
import Home from '../home/home';
import { Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import _ from 'lodash';
interface BasicProps {}
const Content = Loadable({
  loader: () => import('../content/content'),
  loading: () => null,
});
const WorkingTable = Loadable({
  loader: () => import('../workingTable/workingTable'),
  loading: () => null,
});
const GroupTable = Loadable({
  loader: () => import('../groupTable/groupTable'),
  loading: () => null,
});
const Calendar = Loadable({
  loader: () => import('../calendar/calendar'),
  loading: () => null,
});
const Company = Loadable({
  loader: () => import('../companyBasic/company'),
  loading: () => null,
});

const Basic: React.FC<BasicProps> = (props) => {
  const {} = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const socket = useTypedSelector((state) => state.auth.socket);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const moveState = useTypedSelector((state) => state.common.moveState);
  const socketObj = useTypedSelector((state) => state.common.socketObj);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const unMessageNum = useTypedSelector((state) => state.common.unMessageNum);
  const taskArray = useTypedSelector((state) => state.task.taskArray);
  const selfTaskArray = useTypedSelector((state) => state.task.selfTaskArray);
  const workingTaskArray = useTypedSelector(
    (state) => state.task.workingTaskArray
  );

  const pageRef: React.RefObject<any> = useRef();

  useEffect(() => {
    localStorage.removeItem('page');
  }, []);
  useEffect(() => {
    if (socket) {
      socket.on('notice', (data: any) => {
        let taskData = JSON.parse(data);
        dispatch(setSocketObj({ data: taskData }));
      });
    }
  }, [socket]);
  useEffect(() => {
    if (socketObj) {
      let newUnMessageNum = unMessageNum;
      let newSelfTaskArray = _.cloneDeep(selfTaskArray);
      let newWorkingTaskArray = _.cloneDeep(workingTaskArray);
      let newTaskArray = _.cloneDeep(taskArray);
      dispatch(setUnMessageNum(newUnMessageNum + 1));
      if (headerIndex === 0 && newSelfTaskArray) {
        newSelfTaskArray = newSelfTaskArray.map((taskItem: any) => {
          if (taskItem._key === socketObj.data.cardKey) {
            for (let key in taskItem) {
              if (socketObj.data[key] && key !== 'content' && key !== 'type') {
                if (typeof taskItem[key] === 'number') {
                  taskItem[key] = parseInt(socketObj.data[key]);
                } else if (typeof taskItem[key] === 'boolean') {
                  taskItem[key] = socketObj.data[key] ? true : false;
                } else {
                  taskItem[key] = socketObj.data[key];
                }
              }
            }
          }
          return taskItem;
        });
        dispatch(setNewTaskArray('selfTaskArray', newSelfTaskArray));
      } else if (
        (headerIndex === 1 || headerIndex === 2) &&
        newWorkingTaskArray
      ) {
        newWorkingTaskArray = newWorkingTaskArray.map(
          (taskItem: any, taskIndex: number) => {
            taskItem = taskItem.map((item: any, index: number) => {
              if (item._key === socketObj.data.cardKey) {
                for (let key in item) {
                  if (
                    socketObj.data[key] &&
                    key !== 'content' &&
                    key !== 'type'
                  ) {
                    if (typeof item[key] === 'number') {
                      item[key] = parseFloat(socketObj.data[key]);
                    } else if (typeof item[key] === 'boolean') {
                      item[key] = socketObj.data[key] ? true : false;
                    } else {
                      item[key] = socketObj.data[key];
                    }
                  }
                }
              }
              return item;
            });
            return taskItem;
          }
        );
        dispatch(setNewTaskArray('workingTaskArray', newWorkingTaskArray));
      } else if (headerIndex === 3 && newTaskArray) {
        newTaskArray = newTaskArray.map((taskItem: any, taskIndex: number) => {
          if (taskItem._key === socketObj.data.cardKey) {
            for (let key in taskItem) {
              if (socketObj.data[key] && key !== 'content' && key !== 'type') {
                if (typeof taskItem[key] === 'number') {
                  taskItem[key] = parseInt(socketObj.data[key]);
                } else if (typeof taskItem[key] === 'boolean') {
                  taskItem[key] = socketObj.data[key] ? true : false;
                } else {
                  taskItem[key] = socketObj.data[key];
                }
              }
            }
          }
          return taskItem;
        });
        dispatch(setNewTaskArray('taskArray', newTaskArray));
      }
    }
  }, [socketObj]);
  useEffect(() => {
    let title = 'Workfly';
    switch (headerIndex) {
      case 0:
        history.push('/home/basic/content');
        break;
      case 1:
        history.push('/home/basic/workTable');
        break;
      case 2:
        history.push('/home/basic/workTable');
        if (targetUserInfo) {
          title = targetUserInfo.profile.nickName;
        }
        break;
      case 3:
        history.push('/home/basic/groupTable');
        if (groupInfo) {
          title = groupInfo.groupName;
        }
        break;
      case 5:
        history.push('/home/basic/calendar');
        break;
      case 6:
        history.push('/home/basic/company');
        break;
    }
    document.title = title;
  }, [headerIndex, targetUserInfo, groupInfo]);
  //清理redux数据

  return (
    <div
      ref={pageRef}
      className="basic"
      style={
        moveState === 'in'
          ? {
              paddingLeft: '0px',
            }
          : {
              paddingLeft: '320px',
            }
      }
    >
      <Home />
      {/* {headerIndex === 0 ? <Content /> : null}
      {headerIndex === 1 ? <WorkingTable /> : null}
      {headerIndex === 3 ? <GroupTable /> : null}
      {headerIndex === 2 ? <WorkingTable /> : null}
      {headerIndex === 5 && theme && theme.calendarVisible ? (
        <Calendar />
      ) : null} */}

      <Switch>
        <Route exact path="/home/basic/content" component={Content} />
        <Route exact path="/home/basic/workTable" component={WorkingTable} />
        <Route exact path="/home/basic/calendar" component={Calendar} />
        <Route exact path="/home/basic/groupTable" component={GroupTable} />
        <Route exact path="/home/basic/company" component={Company} />
      </Switch>
      <HeaderSet />
    </div>
  );
};
Basic.defaultProps = {};
export default Basic;
