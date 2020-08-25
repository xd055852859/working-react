import axios from 'axios';
import moment from 'moment';
const AUTH_URL = 'https://baokudata.qingtime.cn/sgbh';
const HOME_URL = 'https://workingdata.qingtime.cn/sgbh';
// const API_URL = "http://192.168.1.108:8529/_db/timeOS/myOs"; let token:
// string | null = localStorage.getItem('auth_token');
let auth_token: string | null = null;

const request = {
  get(path: string, params?: object) {
    return new Promise(async function (resolve, reject) {
      try {
        const response = await axios({
          method: 'get',
          url: path,
          params: params,
          headers: {
            token: auth_token,
          },
        });
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  },
  post(path: string, params: object) {
    return new Promise(async function (resolve, reject) {
      try {
        const response = await axios({
          method: 'post',
          url: path,
          data: params,
          headers: {
            token: auth_token,
          },
        });
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  },
  patch(path: string, params: object) {
    return new Promise(async function (resolve, reject) {
      try {
        const response = await axios({
          method: 'patch',
          url: path,
          data: params,
          headers: {
            token: auth_token,
          },
        });
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  },
  delete(path: string, params: object) {
    return new Promise(async function (resolve, reject) {
      try {
        const response = await axios({
          method: 'delete',
          url: path,
          data: params,
          headers: {
            token: auth_token,
          },
        });
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  },
};

const auth = {
  getUserInfo(token: string) {
    auth_token = token;
    return request.get(AUTH_URL + '/account/userinfo', { token: auth_token });
  },
  getMainGroupKey() {
    return request.patch(HOME_URL + '/group/createMainGroup', {
      token: auth_token,
    });
  },
  getTargetUserInfo(key: string) {
    return request.get(HOME_URL + '/account/targetUserInfo', {
      token: auth_token,
      key: key,
    });
  },
  dealCareFriendOrGroup(
    type: number,
    friendOrGroupKey: string,
    status: number
  ) {
    return request.post(HOME_URL + '/group/dealCareFriendOrGroup', {
      type: type,
      friendOrGroupKey: friendOrGroupKey,
      status: status,
    });
  },
};
const task = {
  getGroupTask(
    type1: number,
    targetUKey: string | number,
    type2: number,
    finishPercentArray: number[],
    fileDay?: number
  ) {
    return request.post(HOME_URL + '/card/allGroupTask', {
      token: auth_token,
      type1: type1,
      targetUKey: targetUKey,
      type2: type2,
      finishPercentArray: finishPercentArray,
      fileDay: fileDay,
    });
  },
  getTeamTask(
    finishPercentArray: number[],
    groupKey?: string,
    startTime?: number | null,
    endTime?: number | null
  ) {
    return request.post(HOME_URL + '/card/getTeamCareTask', {
      token: auth_token,
      groupKey: groupKey,
      finishPercentArray: finishPercentArray,
      startTime: startTime,
      endTime: endTime,
    });
  },
  getTaskList(
    typeBoard1: number,
    targetUGKey: string,
    finishPercentArray: string,
    fileDay?: number
  ) {
    return request.get(HOME_URL + '/card/listBoardTask', {
      token: auth_token,
      typeBoard1: typeBoard1,
      targetUGKey: targetUGKey,
      finishPercentArray: finishPercentArray,
      fileDay: fileDay,
    });
  },
  editTask(
    key: number | string,
    title?: string,
    finishPercent?: 0,
    taskEndDate?: number,
    todayTaskTime?: number,
    content?: string,
    taskType?: number,
    executorKey?: string | number,
    importantStatus?: number
  ) {
    return request.patch(HOME_URL + '/card', {
      token: auth_token,
      key: key,
      title: title,
      finishPercent: finishPercent,
      taskEndDate: taskEndDate,
      todayTaskTime: todayTaskTime,
      content: content,
      taskType: taskType,
      executorKey: executorKey,
      importantStatus: importantStatus,
    });
  },
  addTask(
    title: string,
    groupKey: number | string,
    groupRole: number | string,
    labelKey: number | string,
    cardIndex: number | string,
    executorKey?: number | string
  ) {
    return request.post(HOME_URL + '/card', {
      token: auth_token,
      type: 2,
      title: title,
      content: '',
      rootType: 0,
      groupKey: groupKey,
      taskType: 1,
      executorKey: executorKey,
      followUKeyArray: [],
      finishPercent: 0,
      hour: 1,
      day: 1,
      date: moment().date(),
      taskEndDate: moment().valueOf(),
      groupRole: groupRole,
      cardIndex: cardIndex,
      labelKey: labelKey,
    });
  },
  deleteTask(cardKey: number | string, groupKey: number | string) {
    return request.delete(HOME_URL + '/card', {
      token: auth_token,
      cardKey: cardKey,
      groupKey: groupKey,
    });
  },
  addTaskLabel(groupKey: string, cardLabelName: number | string) {
    return request.post(HOME_URL + '/card/addCardLabel', {
      token: auth_token,
      groupKey: groupKey,
      cardLabelName: cardLabelName,
    });
  },
  changeTaskLabelName(labelKey: string, newLabelName: string) {
    return request.patch(HOME_URL + '/card/setLabelProperty', {
      token: auth_token,
      labelKey: labelKey,
      newLabelName: newLabelName,
    });
  },
  batchTaskArray(cardKeyArray: string[]) {
    return request.patch(HOME_URL + '/card/fileCard', {
      token: auth_token,
      cardKeyArray: cardKeyArray,
    });
  },
  changeTaskLabel(groupKey: string, cardKey: string, labelKey: string) {
    return request.patch(HOME_URL + '/card/setCardLabel', {
      token: auth_token,
      groupKey: groupKey,
      cardKey: cardKey,
      labelKey: labelKey,
      type: 3,
    });
  },
  setLabelCardOrder(labelObject:object) {
    return request.patch(HOME_URL + '/card/setLabelCardOrder', {
      token: auth_token,
      ...labelObject
    });
  },
};
const member = {
  getMember(groupId: string) {
    return request.get(HOME_URL + '/groupmember', {
      token: auth_token,
      groupId: groupId,
    });
  },
};
const group = {
  getGroup(listType: number) {
    return request.get(HOME_URL + '/group/groupList', {
      token: auth_token,
      listType: listType,
    });
  },
  getGroupInfo(key: string) {
    return request.get(HOME_URL + '/group', {
      token: auth_token,
      key: key,
    });
  },
};
export default {
  auth,
  task,
  member,
  group,
};
