import axios from 'axios';
const AUTH_URL = 'https://baokudata.qingtime.cn/sgbh';
const HOME_URL = 'https://workingdata.qingtime.cn/sgbh';
// const API_URL = "http://192.168.1.108:8529/_db/timeOS/myOs";
// let token: string | null = localStorage.getItem('auth_token');
let token: string | null = localStorage.getItem('auth_token');

const request = {
  get(path: string, params?: object) {
    return new Promise(async function (resolve, reject) {
      try {
        const response = await axios({
          method: 'get',
          url: path,
          params: params,
          headers: {
            token: token,
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
            token: token,
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
            token: token,
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
            token: token,
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
    return request.get(AUTH_URL + '/account/userinfo', { token: token });
  },
  getMainGroupKey() {
    return request.patch(HOME_URL + '/group/createMainGroup', {
      token: token,
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
      token: token,
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
      token: token,
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
      token: token,
      typeBoard1: typeBoard1,
      targetUGKey: targetUGKey,
      finishPercentArray: finishPercentArray,
      fileDay: fileDay,
    });
  },
};
const member = {
  getMember(groupId: string) {
    return request.get(HOME_URL + '/groupmember', {
      token: token,
      groupId: groupId,
    });
  },
};
const group = {
  getGroup(listType: number) {
    return request.get(HOME_URL + '/group/groupList', {
      token: token,
      listType: listType,
    });
  },
};
export default {
  auth,
  task,
  member,
  group,
  setToken: (_token: string) => {
    window.localStorage.setItem('auth_token', _token);
    token = _token;
  },
};