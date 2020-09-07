import moment from 'moment';
const format = {
  formatCard(taskType, cardArray, userKey) {
    let arr = [];
    let mainGroupKey = localStorage.getItem('mainGroupKey');
    switch (taskType) {
      case 0:
        //我的一天
        //起始时间
        const startTime = moment().startOf('day').valueOf();
        const endTime = moment().endOf('day').valueOf();
        arr = cardArray.map((item) => {
          item.show = false;
          if (
            ((item.taskEndDate &&
              item.taskEndDate <= endTime &&
              item.finishPercent === 0) ||
              (item.taskEndDate <= endTime &&
                item.taskEndDate >= startTime &&
                item.finishPercent < 2)) &&
            (item.creatorKey !== userKey ||
              (item.creatorKey === userKey && item.executorKey === userKey))
          ) {
            item.show = true;
          }
          return item;
        });
        // arr2 = allLabelArray.filter(item => item._key === null);
        // setCardArray(arr);
        // setLabelArray(arr2);
        break;
      case 1:
        // arr = allCardArray.filter(item => item.taskType > 3);
        // arr2 = allLabelArray.filter(item => item._key === null);
        arr = cardArray.map((item) => {
          item.show = false;
          if (
            item.importantStatus === 1 &&
            item.finishPercent === 0 &&
            (item.creatorKey !== userKey ||
              (item.creatorKey === userKey && item.executorKey === userKey))
          ) {
            item.show = true;
          }
          return item;
        });
        // setCardArray(arr);
        // setLabelArray(arr2);
        break;
      case 2:
        // arr2 = allLabelArray.filter(item => item._key === null);
        arr = cardArray.map((item) => {
          item.show = false;
          if (
            item.taskEndDate &&
            (item.creatorKey === userKey || item.executorKey === userKey)
          ) {
            item.show = true;
          }
          return item;
        });
        // setCardArray(arr);
        // setLabelArray(arr2);
        break;
      case 3:
        arr = cardArray.map((item) => {
          item.show = false;
          if (item.executorKey === userKey && item.finishPercent === 0) {
            item.show = true;
          }
          return item;
        });
        // arr2 = allLabelArray.filter(item => item._key === null);
        // setCardArray(arr);
        // setLabelArray(arr2);
        break;
      case 4:
        arr = cardArray.map((item) => {
          item.show = false;
          if (item.creatorKey === userKey && item.finishPercent === 0) {
            item.show = true;
          }
          return item;
        });
        // arr2 = allLabelArray.filter(item => item._key === null);
        // setCardArray(arr);
        // setLabelArray(arr2);
        break;
      case 6:
        arr = cardArray.map((item) => {
          item.show = true;
          return item;
        });
        // arr2 = allLabelArray.filter(item => item._key === null);
        // setCardArray(arr);
        // setLabelArray(arr2);
        break;
      case 10:
        // arr2 = allLabelArray.filter(item => item._key === null);
        arr = cardArray.map((item) => {
          item.show = false;
          if (item.taskEndDate && item.executorKey === userKey) {
            item.show = true;
          }
          return item;
        });
        // setCardArray(arr);
        // setLabelArray(arr2);
        break;
      default:
        arr = cardArray.map((item) => {
          item.show = false;
          if (item.finishPercent === 10) {
            item.show = true;
          }
          return item;
        });
        // setCardArray(arr);
        // setLabelArray(allLabelArray);
        break;
    }
    return arr;
  },
  formatFilter(cardArray, filterObject) {
    let arr = [];
    let state = '';
    let str = '';
    let startTaskTime = moment(new Date())
      .add(1, 'days')
      .startOf('day')
      .valueOf();
    let endTaskTime = moment(new Date())
      .subtract(1, 'days')
      .endOf('day')
      .valueOf();
    let startTime = moment(new Date()).startOf('day').valueOf();
    let endTime = moment(new Date()).endOf('day').valueOf();
    let filterArray = filterObject.filterType;
    if (filterObject.groupKey) {
      state = 'item.groupKey===filterObject.groupKey';
    }
    if (filterObject.executorKey) {
      state =
        state === ''
          ? 'item.executorKey===filterObject.executorKey'
          : state + '&&' + 'item.executorKey===filterObject.executorKey';
    }
    if (filterObject.creatorKey) {
      state =
        state === ''
          ? 'item.creatorKey===filterObject.creatorKey'
          : state + '&&' + 'item.creatorKey===filterObject.creatorKey';
    }
    if (filterArray.indexOf('过期') !== -1) {
      str =
        str === ''
          ? '(item.taskEndDate < startTime&&item.finishPercent===0)'
          : str +
            '||' +
            '(item.taskEndDate < startTime&&item.finishPercent===0)';
    }
    if (filterArray.indexOf('今天') !== -1) {
      str =
        str === ''
          ? '(item.taskEndDate >= startTime && item.taskEndDate <= endTime&&item.finishPercent<2)'
          : str +
            '||' +
            '(item.taskEndDate >= startTime && item.taskEndDate <= endTime&&item.finishPercent<2)';
    }
    if (filterArray.indexOf('已完成') !== -1) {
      str =
        str === ''
          ? '(item.taskEndDate&&item.finishPercent===1)'
          : str + '||' + '(item.taskEndDate&&item.finishPercent===1)';
    }
    if (filterArray.indexOf('未计划') !== -1) {
      str = str === '' ? '!item.taskEndDate' : str + '||' + '!item.taskEndDate';
    }
    if (filterArray.indexOf('未来') !== -1) {
      str =
        str === ''
          ? 'item.taskEndDate >= ' + startTaskTime
          : str + '||' + 'item.taskEndDate >= ' + startTaskTime;
    }

    if (filterArray.indexOf('一般卡片') !== -1) {
      str =
        str === ''
          ? 'item.finishPercent===10'
          : str + '||' + 'item.finishPercent===10';
    }
    if (filterArray.indexOf('已归档') !== -1) {
      str =
        str === ''
          ? 'item.finishPercent===2'
          : str + '||' + 'item.finishPercent===2';
    }
    state =
      str !== '' ? (state !== '' ? state + '&& (' + str + ')' : str) : state;
    if (state === '' && str === '') {
      state = true;
    }
    cardArray.forEach((item, index) => {
      item.show = false;
      if (eval(state)) {
        item.show = true;
      }
      arr.push(item);
    });
    return arr;
  },
};
export default format;
