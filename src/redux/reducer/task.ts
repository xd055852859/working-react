import { actionTypes } from '../actions/taskActions';
import _ from 'lodash';
export interface TaskType {
  labelArray: any;
  taskArray: any;
  teamTaskArray: any;
  projectTaskArray: any;
  selfTaskArray: any;
  workingGroupArray: any;
  workingTaskArray: any;
  taskKey: string | number;
  filterObject: any;
}

const defaultState: TaskType = {
  labelArray: null,
  taskArray: null,
  teamTaskArray: null,
  projectTaskArray: null,
  selfTaskArray: null,
  workingGroupArray: null,
  workingTaskArray: null,
  taskKey: 0,
  filterObject: {
    groupKey: null,
    groupName: '',
    groupLogo: '',
    creatorKey: null,
    creatorAvatar: '',
    creatorName: '',
    executorKey: null,
    executorAvatar: '',
    executorName: '',
    filterType: ['过期', '今天', '已完成'],
  },
};

export const task = (state = defaultState, action: any) => {
  switch (action.type) {
    case actionTypes.GET_GROUP_TASK_SUCCESS:
      let labelArray: any = [];
      let taskArray: any = [];
      // state.cardArray = payload.result.cardArray;
      taskArray = action.data.cardArray.map((item: any) => {
        item.show = true;
        return item;
      });
      taskArray.sort((a: any, b: any) => b.updateTime - a.updateTime);
      action.data.labelArray.forEach((item: any) => {
        if (!item.cardLabelName) {
          item.cardLabelName = 'ToDo';
        }
        if (item._key) {
          labelArray.push(item);
        } else {
          labelArray.unshift(item);
        }
      });
      return {
        ...state,
        labelArray: labelArray,
        taskArray: taskArray,
      };
    case actionTypes.GET_TEAM_TASK_SUCCESS:
      return {
        ...state,
        teamTaskArray: action.data,
      };
    case actionTypes.GET_PROJECT_TASK_SUCCESS:
      return {
        ...state,
        projectTaskArray: action.data,
      };
    case actionTypes.GET_SELF_TASK_SUCCESS:
      return {
        ...state,
        selfTaskArray: action.data.cardArray,
      };
    case actionTypes.GET_WORKING_TABLE_TASK_SUCCESS:
      let cardIndex = _.findIndex(action.data.groupArray, {
        _key: localStorage.getItem('mainGroupKey'),
      });
      if (action.data.groupArray.length > 0) {
        action.data.groupArray.unshift(
          action.data.groupArray.splice(cardIndex, 1)[0]
        );
        action.data.cardArray.unshift(
          action.data.cardArray.splice(cardIndex, 1)[0]
        );
      }
      return {
        ...state,
        workingGroupArray: action.data.groupArray,
        workingTaskArray: action.data.cardArray,
      };
    case actionTypes.SET_TASK_KEY:
      return {
        ...state,
        taskKey: action.taskKey,
      };
    case actionTypes.EDIT_TASK_SUCCESS:
      console.log('编辑成功');
      console.log(action);
      let taskInfo = _.cloneDeep(action.data[0]);
      let headerIndex = action.data[1];
      if (headerIndex === 0) {
        state.selfTaskArray = state.selfTaskArray.map(
          (taskItem: any, taskIndex: number) => {
            if (taskItem._key === taskInfo._key) {
              taskItem = _.cloneDeep(taskInfo);
            }
            return taskItem;
          }
        );
      } else if (headerIndex === 1 || headerIndex === 2) {
        state.workingTaskArray = state.workingTaskArray.map(
          (taskItem: any, taskIndex: number) => {
            taskItem = taskItem.map((item: any, index: number) => {
              if (item._key === taskInfo._key) {
                item = _.cloneDeep(taskInfo);
              }
              return item;
            });
            return taskItem;
          }
        );
        console.log(state.workingTaskArray);
      } else if (headerIndex == 3) {
        state.taskArray = state.taskArray.map(
          (taskItem: any, taskIndex: number) => {
            if (taskItem._key === taskInfo._key) {
              taskItem = _.cloneDeep(taskInfo);
            }
            return taskItem;
          }
        );
      }
      return {
        ...state,
      };
    case actionTypes.ADD_WORKING_TABLE_TASK_SUCCESS:
      console.log('新建成功');
      return {
        ...state,
        // taskKey: action.taskKey
      };
    case actionTypes.SET_Filter_OBJECT:
      let filterObject = _.cloneDeep(state.filterObject);
      for (let key in action.filterObj) {
        filterObject[key] = action.filterObj[key];
      }
      return {
        ...state,
        filterObject: filterObject,
      };
    default:
      return state;
  }
};
