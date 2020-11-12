import axios from 'axios';
import moment from 'moment';
const AUTH_URL = 'https://baokudata.qingtime.cn/sgbh';
const HOME_URL = 'https://workingdata.qingtime.cn/sgbh';
// const HOME_URL = 'http://192.168.0.101:8529/_db/working/my_sgbh';
const ROCKET_CHAT_URL = 'https://chat.qingtime.cn';
// const SOCKET_URL = 'http://192.168.0.101:9033';
const SOCKET_URL = 'https://workingdata.qingtime.cn';
const PNG_URL = 'https://timeosdata.qingtime.cn';
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
            // 'Content-type': 'application/x-www-form-urlencoded',
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
const common = {
  // getWeather() {
  //   return request.get('http://api.map.baidu.com/telematics/v3/weather?location=北京&output=json&ak=H7W5CxI0BPzKtwGcBHmpGPAz50xP1Qjw', {
  //     // version: 'v1',
  //     // appid: '59913919',
  //     // appsecret: 'G5ncbD3n',
  //   });
  // },
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
      token: auth_token,
      type: type,
      friendOrGroupKey: friendOrGroupKey,
      status: status,
    });
  },
  getMessageList(curPage: number, perPage: number) {
    return request.post(HOME_URL + '/card/getNoticeList', {
      token: auth_token,
      curPage: curPage,
      perPage: perPage,
    });
  },
  getWorkingConfigInfo() {
    return request.post(HOME_URL + '/account/getWorkingConfigInfo', {
      token: auth_token,
    });
  },
  setWorkingConfigInfo(configInfo: any) {
    return request.post(HOME_URL + '/account/setWorkingConfigInfo', {
      token: auth_token,
      configInfo: configInfo,
    });
  },
  getPrompt() {
    return request.post(HOME_URL + '/card/getPrompt', { token: auth_token });
  },
  getUptoken() {
    return request.get(HOME_URL + '/upTokenQiniu/getQiNiuUpToken', {
      token: auth_token,
      type: 2,
    });
  },
  getNote(targetUKey: string | number, startTime: number) {
    return request.post(HOME_URL + '/card/getNote', {
      token: auth_token,
      targetUKey: targetUKey,
      startTime: startTime,
      type: 2,
    });
  },
  setNote(params: any) {
    return request.post(HOME_URL + '/card/setNote', {
      token: auth_token,
      ...params,
    });
  },
  clockIn(params: any) {
    return request.post(HOME_URL + '/card/clockIn', {
      token: auth_token,
      ...params,
    });
  },
  monthEnergy(params: any) {
    return request.post(HOME_URL + '/card/monthEnergy', {
      token: auth_token,
      ...params,
    });
  },
  getGroupLog(
    groupKey: string,
    startTime: number,
    endTime: number,
    curPage: number,
    perPage: number
  ) {
    return request.post(HOME_URL + '/cardLog/getGroupLog', {
      token: auth_token,
      isFilter: 1,
      groupKey: groupKey,
      startTime: startTime,
      endTime: endTime,
      curPage: curPage,
      perPage: perPage,
    });
  },
  getUserLog(
    targetUKey: string,
    startTime: number,
    endTime: number,
    curPage: number,
    perPage: number
  ) {
    return request.post(HOME_URL + '/cardLog/getUserLog', {
      token: auth_token,
      isFilter: 1,
      targetUKey: targetUKey,
      startTime: startTime,
      endTime: endTime,
      curPage: curPage,
      perPage: perPage,
    });
  },
  monthEnergyWeb(
    startTime: number,
    endTime: number,
    type: number,
    targetUGKey: string
  ) {
    return request.post(HOME_URL + '/card/monthEnergyWeb', {
      token: auth_token,
      startTime: startTime,
      endTime: endTime,
      type: type,
      targetUGKey: targetUGKey,
    });
  },
  getDiaryList(targetUKey: string, startTime: number, endTime: number) {
    return request.post(HOME_URL + '/card/clockInList', {
      token: auth_token,
      targetUKey: targetUKey,
      startTime: startTime,
      endTime: endTime,
    });
  },
  getClockInCommentList(
    clockInKey: number | string,
    curPage: number,
    perPage: number
  ) {
    return request.post(HOME_URL + '/card/getClockInCommentList', {
      token: auth_token,
      clockInKey: clockInKey,
      curPage: curPage,
      perPage: perPage,
    });
  },
  addClockInComment(clockInKey: string | number, content: string) {
    return request.post(HOME_URL + '/card/addClockInComment', {
      token: auth_token,
      clockInKey: clockInKey,
      content: content,
    });
  },
  deleteClockInComment(clockInCommentKey: number | string) {
    return request.post(HOME_URL + '/card/deleteClockInComment ', {
      token: auth_token,
      clockInCommentKey: clockInCommentKey,
    });
  },
  //修改权限
  setRole(groupKey: string, targetUKey: string, role: number | string) {
    return request.patch(HOME_URL + '/groupmember/setRole', {
      token: auth_token,
      groupKey: groupKey,
      targetUKey: targetUKey,
      role: role,
    });
  },
  updateAccount(param: any) {
    return request.patch(AUTH_URL + '/account', {
      token: auth_token,
      ...param,
    });
  },
  getWallPapers(page: number) {
    return request.get(PNG_URL + '/wallPaper', {
      style: 'web',
      page: page,
      limit: 100,
    });
  },
  viewWallPapers(wallKey: string) {
    return request.patch(PNG_URL + '/wallPaper/view', { wallKey: wallKey });
  },
  chooseWallPapers(wallKey: string) {
    return request.patch(PNG_URL + '/wallPaper/choose', { wallKey: wallKey });
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
  getProjectTask(finishPercentArray: number[]) {
    return request.post(HOME_URL + '/card/getProjectCareTask', {
      token: auth_token,
      finishPercentArray: finishPercentArray,
    });
  },
  getTaskList(
    typeBoard1: number,
    targetUGKey: string,
    finishPercentArray: string,
    fileDay?: number,
    endTime?: number,
    isAddTodayFinish?: number
  ) {
    return request.get(HOME_URL + '/card/listBoardTask', {
      token: auth_token,
      typeBoard1: typeBoard1,
      targetUGKey: targetUGKey,
      finishPercentArray: finishPercentArray,
      fileDay: fileDay,
      endTime: endTime,
      isAddTodayFinish: isAddTodayFinish,
      isContainTree: true,
    });
  },
  editTask(params: any) {
    return request.patch(HOME_URL + '/card', {
      token: auth_token,
      key: params.key,
      children: params.children,
      content: params.content,
      countDownTime: params.countDownTime,
      date: params.date,
      day: params.day,
      executorAvatar: params.executorAvatar,
      executorKey: params.executorKey,
      executorName: params.executorName,
      finishPercent: params.finishPercent,
      followUKeyArray: params.followUKeyArray,
      groupKey: params.groupKey,
      groupLogo: params.groupLogo,
      groupName: params.groupName,
      hour: params.hour,
      importantStatus: params.importantStatus,
      labelKey: params.labelKey,
      labelName: params.labelName,
      parentCardKey: params.parentCardKey,
      taskEndDate: params.taskEndDate,
      taskStartDate: params.taskStartDate,
      taskType: params.taskType,
      title: params.title,
      todayTaskTime: params.todayTaskTime,
      type: params.type,
      contract: params.type,
    });
  },
  addTask(
    groupKey: number | string,
    groupRole: number | string,
    labelKey: any,
    executorKey?: any,
    title?: string,
    parentCardKey?: string,
    cardIndex?: number,
    type?: number,
    taskType?: number,
    finishPercent?: number,
    taskEndDate?: number
  ) {
    return request.post(HOME_URL + '/card', {
      token: auth_token,
      type: type ? type : 2,
      title: title ? title : '',
      content: '',
      groupKey: groupKey,
      taskType: taskType ? taskType : taskType == 0 ? 0 : 1,
      executorKey: executorKey,
      followUKeyArray: [],
      finishPercent: finishPercent ? finishPercent : 0,
      hour: 1,
      day: 1,
      date: moment().date(),
      taskEndDate: taskEndDate
        ? taskEndDate
        : moment().hour() > 20
        ? moment().add(1, 'days').endOf('day').valueOf()
        : moment().endOf('day').valueOf(),
      groupRole: groupRole,
      cardIndex: cardIndex ? cardIndex : 0,
      labelKey: labelKey,
      parentCardKey: parentCardKey,
    });
  },
  deleteTask(cardKey: number | string, groupKey: number | string) {
    return request.delete(HOME_URL + '/card', {
      token: auth_token,
      cardKey: cardKey,
      groupKey: groupKey,
    });
  },
  getCardSearch(curPage: number, perPage: number, searchCondition: string) {
    return request.get(HOME_URL + '/card/searchCard', {
      token: auth_token,
      searchType: 1,
      curPage: curPage,
      perPage: perPage,
      searchCondition: searchCondition,
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
  //批量归档
  batchTaskArray(cardKeyArray: string[]) {
    return request.patch(HOME_URL + '/card/fileCard', {
      token: auth_token,
      cardKeyArray: cardKeyArray,
    });
  },
  //批量导入任务
  batchCard(batchTitle: string, groupKey: string, labelKey: string) {
    return request.post(HOME_URL + '/card/batchQuickCreateCard', {
      token: auth_token,
      type: 2,
      batchTitle: batchTitle,
      groupKey: groupKey,
      labelKey: labelKey,
      date: moment().date(),
      cardIndex: -1,
      taskEndDate: moment().endOf('day').valueOf(),
      day: 1,
      hour: 1,
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
  deleteTaskLabel(groupKey: string, cardLabelKey: string) {
    return request.post(HOME_URL + '/card/deleteCardLabel', {
      token: auth_token,
      groupKey: groupKey,
      cardLabelKey: cardLabelKey,
    });
  },
  setLabelCardOrder(labelObject: object) {
    return request.patch(HOME_URL + '/card/setLabelCardOrder', {
      token: auth_token,
      ...labelObject,
    });
  },
  getTaskHistory(cardKey: string, curPage: number, perPage: number) {
    return request.get(HOME_URL + '/cardLog/cardLogList', {
      token: auth_token,
      cardKey: cardKey,
      curPage: curPage,
      perPage: perPage,
    });
  },
  getTaskComment(cardKey: string, curPage: number, perPage: number) {
    return request.get(HOME_URL + '/commentCard/list', {
      token: auth_token,
      cardKey: cardKey,
      curPage: curPage,
      perPage: perPage,
    });
  },
  addComment(cardKey: string, content: string) {
    return request.post(HOME_URL + '/commentCard', {
      token: auth_token,
      cardKey: cardKey,
      action: 2,
      content: content,
    });
  },
  deleteComment(cardCommentKey: string) {
    return request.delete(HOME_URL + '/commentCard', {
      token: auth_token,
      cardCommentKey: cardCommentKey,
    });
  },
  allGridGroupTask(params: any) {
    return request.post(HOME_URL + '/card/allGroupTaskFS', {
      token: auth_token,
      ...params,
    });
  },
  getGroupDataTask(
    groupKey: string,
    finishPercentArray: any,
    startTime: number | null,
    endTime: number
  ) {
    return request.post(HOME_URL + '/card/getTeamCareTask', {
      token: auth_token,
      groupKey: groupKey,
      finishPercentArray: finishPercentArray,
      startTime: startTime,
      endTime: endTime,
    });
  },
  getTaskInfo(cardKey: string) {
    return request.get(HOME_URL + '/card/cardDetail', {
      token: auth_token,
      cardKey: cardKey,
    });
  },
  //获取日程任务
  getCalendarList(targetUKey: string, startTime: number, endTime: number) {
    return request.post(HOME_URL + '/card/getScheduleCardList', {
      token: auth_token,
      targetUKey: targetUKey,
      startTime: startTime,
      endTime: endTime,
    });
  },
  //获取树任务
  getTaskTreeList(taskTreeRootCardKey: string) {
    return request.post(HOME_URL + '/card/getTaskTreeList', {
      token: auth_token,
      taskTreeRootCardKey: taskTreeRootCardKey,
    });
  },
  //修改树关系
  changeTreeTaskRelation(params: any) {
    return request.post(HOME_URL + '/card/switchFSTreeTaskRelation', {
      token: auth_token,
      ...params,
    });
  },
};
const member = {
  getMember(groupId: string, sortType?: number) {
    return request.get(HOME_URL + '/groupmember', {
      token: auth_token,
      groupId: groupId,
      sortType: sortType,
    });
  },
  searchUserNew(searchCondition: string, curPage: number, perPage: number) {
    return request.post(HOME_URL + '/account/searchUserNew', {
      token: auth_token,
      searchCondition: searchCondition,
      curPage: curPage,
      perPage: perPage,
    });
  },
  searchGroupNew(searchCondition: string, curPage: number, perPage: number) {
    return request.post(HOME_URL + '/group/searchGroupNew', {
      token: auth_token,
      searchCondition: searchCondition,
      curPage: curPage,
      perPage: perPage,
    });
  },
  setConfig(groupMemberKey: string, config: any) {
    return request.post(HOME_URL + '/groupmember/setConfig', {
      token: auth_token,
      groupMemberKey: groupMemberKey,
      config: config,
    });
  },
  getPrivateChatRId(groupKey: string, targetUKey: string) {
    return request.post(HOME_URL + '/groupmember/getPrivateChatRId', {
      token: auth_token,
      groupKey: groupKey,
      targetUKey: targetUKey,
    });
  },
};
const group = {
  getGroup(
    listType: number,
    simple?: number | null,
    sortType?: number,
    groupKey?: string
  ) {
    return request.get(HOME_URL + '/group/groupList', {
      token: auth_token,
      listType: listType,
      simple: simple,
      sortType: sortType,
      groupKey: groupKey,
    });
  },
  getGroupInfo(key: string) {
    return request.get(HOME_URL + '/group', {
      token: auth_token,
      key: key,
    });
  },
  changeGroupInfo(key: string, patchData: any) {
    return request.patch(HOME_URL + '/group', {
      token: auth_token,
      key: key,
      patchData: patchData,
    });
  },
  addGroupMember(groupKey: string | null, targetUidList: any) {
    return request.post(HOME_URL + '/groupmember', {
      token: auth_token,
      groupKey: groupKey,
      targetUidList: targetUidList,
    });
  },
  addAllGroupMember(groupKey: string | null, newGroupMemberKeyArray: any) {
    return request.post(HOME_URL + '/groupmember/addAndDeleteGroupMember', {
      token: auth_token,
      groupKey: groupKey,
      newGroupMemberKeyArray: newGroupMemberKeyArray,
    });
  },
  deleteGroupMember(groupKey: string | null, targetUKeyList: any) {
    return request.delete(HOME_URL + '/groupmember/remove', {
      token: auth_token,
      groupKey: groupKey,
      targetUKeyList: targetUKeyList,
    });
  },
  outGroup(groupKey: string | null) {
    return request.delete(HOME_URL + '/groupmember', {
      token: auth_token,
      groupKey: groupKey,
    });
  },
  applyJoinGroup(groupKey: string | null) {
    return request.post(HOME_URL + '/group/applyJoinGroup', {
      token: auth_token,
      groupKey: groupKey,
    });
  },
  passwordJoinGroup(groupKey: string | null, password: string) {
    return request.post(HOME_URL + '/groupmember/passwordJoinGroup', {
      token: auth_token,
      groupKey: groupKey,
      password: password,
    });
  },
  addGroup(params: any) {
    return request.post(HOME_URL + '/group', {
      token: auth_token,
      ...params,
    });
  },
  dismissGroup(key: string) {
    return request.delete(HOME_URL + '/group', {
      token: auth_token,
      key: key,
    });
  },
  //设置默认执行者
  setLabelOrGroupExecutorKey(
    labelOrGroupKey: string | number,
    executorKey: string | number,
    type: number
  ) {
    return request.post(HOME_URL + '/card/setLabelOrGroupExecutorKey', {
      token: auth_token,
      labelOrGroupKey: labelOrGroupKey,
      executorKey: executorKey,
      type: type,
    });
  },
  //修改标签名
  setCardLabel(labelKey: string, newLabelName: string) {
    return request.patch(HOME_URL + '/card/setLabelProperty', {
      token: auth_token,
      labelKey: labelKey,
      newLabelName: newLabelName,
    });
  },
  //获取群标签
  getLabelInfo(groupKey: string) {
    return request.post(HOME_URL + '/group/getLabelInfo ', {
      token: auth_token,
      groupKey: groupKey,
    });
  },
  setLabelOrder(groupKey: string, labelOrder: any) {
    return request.post(HOME_URL + '/group/setLabelOrder ', {
      token: auth_token,
      groupKey: groupKey,
      labelOrder: labelOrder,
    });
  },
  getSonGroupList(fatherGroupKey: string) {
    return request.post(HOME_URL + '/group/getSonGroupListMultilayer', {
      token: auth_token,
      fatherGroupKey: fatherGroupKey,
    });
  },
  //设置子群
  setSonGroup(fatherGroupKey: string, sonGroupKey: string) {
    return request.post(HOME_URL + '/group/setSonGroup', {
      token: auth_token,
      fatherGroupKey: fatherGroupKey,
      sonGroupKey: sonGroupKey,
    });
  },
  deleteFSGroup(fatherGroupKey: string, sonGroupKey: string) {
    return request.post(HOME_URL + '/group/deleteFSGroup', {
      token: auth_token,
      fatherGroupKey: fatherGroupKey,
      sonGroupKey: sonGroupKey,
    });
  },
  applyJoinGroupList(groupKey: string) {
    return request.post(HOME_URL + '/group/applyJoinGroupList', {
      token: auth_token,
      groupKey: groupKey,
    });
  },
  //移除群申请
  deleteApplyJoinGroup(applyJoinGroupKey: string) {
    return request.post(HOME_URL + '/group/deleteApplyJoinGroup', {
      token: auth_token,
      applyJoinGroupKey: applyJoinGroupKey,
    });
  },
  visitGroupOrFriend(type: number, targetUGKey: string) {
    return request.post(HOME_URL + '/group/visitGroupOrFriend', {
      token: auth_token,
      type: type,
      targetUGKey: targetUGKey,
    });
  },
  //获取创群模板
  getTemplateTypeList() {
    return request.post(HOME_URL + '/group/getTemplateTypeList', {
      token: auth_token,
    });
  },
  getTemplateListAccordingType(curPage: number, type?: any) {
    return request.post(HOME_URL + '/group/getTemplateListAccordingType', {
      token: auth_token,
      type: type,
      curPage: curPage,
      perPage: 9,
    });
  },
  //添加模板
  addTemplate(patchData: any) {
    return request.post(HOME_URL + '/group/addTemplate', {
      token: auth_token,
      patchData: patchData,
    });
  },
  //审核消息处理
  changeAddMessage(
    targetUKey: string,
    groupKey: string,
    agreeOrReject: number,
    applyKey: string | number
  ) {
    return request.post(HOME_URL + '/group/agreeOrRejectApplyJoinGroup', {
      token: auth_token,
      targetUKey: targetUKey,
      groupKey: groupKey,
      agreeOrReject: agreeOrReject,
      applyKey: applyKey,
    });
  },
};
export default {
  common,
  auth,
  task,
  member,
  group,
  ROCKET_CHAT_URL,
  SOCKET_URL,
};
