import { actionTypes } from '../actions/taskActions';
import _ from 'lodash';
export interface TaskType {
  labelArray: any;
  taskArray: any;
  teamTaskArray: any;
  selfTaskArray: any;
  workingGroupArray: any;
  workingTaskArray: any;
  taskKey: string | number;
}

const defaultState: TaskType = {
  labelArray: null,
  taskArray: null,
  teamTaskArray: null,
  selfTaskArray: null,
  workingGroupArray: null,
  workingTaskArray: null,
  taskKey: 0,
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
    case actionTypes.GET_SELF_TASK_SUCCESS:
      return {
        ...state,
        selfTaskArray: action.data.cardArray,
      };
    case actionTypes.GET_WORKING_TABLE_TASK_SUCCESS:
      console.log(action.data);
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
      console.log(action);
      return {
        ...state,
        taskKey: action.taskKey,
      };
    default:
      return state;
  }
};
