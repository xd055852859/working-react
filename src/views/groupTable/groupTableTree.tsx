import React, { useState, useEffect, useRef } from 'react';
import './groupTableTree.css';
import { Tree } from 'tree-graph-react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { Tooltip } from '@material-ui/core';
import {
  setChooseKey,
  editTask,
  changeTaskInfoVisible,
  setTaskInfo,
} from '../../redux/actions/taskActions';
import { setMessage, setMoveState } from '../../redux/actions/commonActions';
import { changeStartId } from '../../redux/actions/groupActions';
import moment from 'moment';
import _ from 'lodash';
import api from '../../services/api';
import TimeSet from '../../components/common/timeSet';
import GroupTableTreeType from './groupTableTreeType';
import Dialog from '../../components/common/dialog';
import GroupTableInfo from './groupTableInfo';

import GroupTableTreeItem from './groupTableTreeItem';
import taskFinishPng from '../../assets/img/taskFinish.png';
import taskUnfinishPng from '../../assets/img/timeSet2.png';
import defaultPersonPng from '../../assets/img/defaultPerson.png';
import treeCloseSvg from '../../assets/svg/treeClose.svg';
import memberSvg from '../../assets/svg/member.svg';
import taskType0Svg from '../../assets/svg/taskType0.svg';
import taskType1Svg from '../../assets/svg/taskType1.svg';
import taskType2Svg from '../../assets/svg/taskType2.svg';
import taskType3Svg from '../../assets/svg/taskType3.svg';
import taskType4Svg from '../../assets/svg/taskType4.svg';
import taskType5Svg from '../../assets/svg/taskType5.svg';
import taskType6Svg from '../../assets/svg/taskType6.svg';
import taskType7Svg from '../../assets/svg/taskType7.svg';
import taskType8Svg from '../../assets/svg/taskType8.svg';
import taskType9Svg from '../../assets/svg/taskType9.svg';
import Loading from '../../components/common/loading';

// import taskType9Svg from '../../assets/svg/taskType9.svg';
import DropMenu from '../../components/common/dropMenu';
import checkPersonPng from '../../assets/img/checkPerson.png';
interface GroupTableTreeProps {}

const GroupTableTree: React.FC<GroupTableTreeProps> = (props) => {
  const {} = props;
  const dispatch = useDispatch();
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const groupKey = useTypedSelector((state) => state.group.groupKey);

  const user = useTypedSelector((state) => state.auth.user);
  const theme = useTypedSelector((state) => state.auth.theme);

  const startId = useTypedSelector((state) => state.group.startId);
  const taskInfo = useTypedSelector((state) => state.task.taskInfo);
  const groupMemberArray = useTypedSelector(
    (state) => state.member.groupMemberArray
  );
  const [gridList, setGridList] = useState<any>([]);
  const [nodeObj, setNodeObj] = useState<any>(null);
  const [targetNode, setTargetNode] = useState<any>(null);
  const [targetIndex, setTargetIndex] = useState(0);
  const [selectedId, setSelectedId] = useState('');
  const [defaultSelectedId, setDefaultSelectedId] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPath, setSelectedPath] = useState<any>([]);
  const [avatarDialogShow, setAvatarDialogShow] = useState(false);
  const [statusDialogShow, setStatusDialogShow] = useState(false);
  const [treeMenuLeft, setTreeMenuLeft] = useState(0);
  const [treeMenuTop, setTreeMenuTop] = useState(0);
  const [deleteDialogShow, setDeleteDialogShow] = useState(false);
  const [itemDialogShow, setItemDialogShow] = useState(false);
  const [typeDialogShow, setTypeDialogShow] = useState(0);

  const [infoVisible, setInfoVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [memberCheckIndex, setMemberCheckIndex] = useState<any>(null);
  const [dayNumber, setDayNumber] = useState<any>(null);
  const [endtime, setEndtime] = useState(0);
  const [timeNumber, setTimeNumber] = useState<any>(null);
  const [moveState, setMoveState] = useState<any>(null);

  const treeRef: React.RefObject<any> = useRef();
  const boxRef: React.RefObject<any> = useRef();
  const targetTreeRef: React.RefObject<any> = useRef();
  const taskTypeArray = [
    taskType0Svg,
    taskType1Svg,
    taskType2Svg,
    taskType3Svg,
    taskType4Svg,
    taskType5Svg,
    taskType6Svg,
    taskType7Svg,
    taskType8Svg,
    taskType9Svg,
  ];
  const iconArray = [
    'https://cdn-icare.qingtime.cn/FpCB_dxjQGMt0lBUP-PwBXAVkNHN',
    'https://cdn-icare.qingtime.cn/FgKrqQB-8wqIouNRWzTzCe2A12FK',
    'https://cdn-icare.qingtime.cn/FjFqTs8ZmMtsL1X8LGZEVSV9WSRW',
    'https://cdn-icare.qingtime.cn/FjO6YNYHntTHrgS_3hR2kZiID8rd',
    'https://cdn-icare.qingtime.cn/链接备份.png0.10111010111110010011100111101110010000101001111100011607666734264?v=1607666736288',
    'https://cdn-icare.qingtime.cn/Fl8r0nP1GTxNzPGc3LquP6AnUT6y',
  ];
  const iconBigArray = [
    'https://cdn-icare.qingtime.cn/FtkXwZ6IehLY3esnusB7zXbATj0N',
    'https://cdn-icare.qingtime.cn/Fvat4kxmIVsxtuL2SF-PUrW3lewo',
    'https://cdn-icare.qingtime.cn/FgcSN1LlGW1F0L5njTuMCEVtorPw',
    'https://cdn-icare.qingtime.cn/Fnwl_g4Re1NHyeNYBzGAq0goIWso',
    'https://cdn-icare.qingtime.cn/link.svg?v=1?v=1603271068118',
    'https://cdn-icare.qingtime.cn/FhTo1tbXwsX2toqGmd2NXy4XGA-g',
  ];
  const iconBigText = [
    '时光文档',
    '时光绘图',
    '时光表格',
    '时光文本',
    '链接',
    '电子书',
  ];
  let treeLeft = 0;
  let treeTop = 0;
  let treeMarginLeft = 0;
  let treeMarginTop = 0;
  let unDistory = true;
  useEffect(() => {
    if (
      groupInfo &&
      groupInfo._key === groupKey &&
      groupInfo.taskTreeRootCardKey
    ) {
      getData(groupInfo.taskTreeRootCardKey);
      treeLeft = 0;
      treeTop = 0;
    }
    return () => {
      unDistory = false;
    };
  }, [groupInfo]);
  useEffect(() => {
    if (startId && nodeObj && nodeObj[startId]) {
      setSelectedPath(nodeObj[startId].path1);
    }
  }, [startId, nodeObj]);

  useEffect(() => {
    // 用户已登录
    if (taskInfo && (taskInfo.type === 1 || taskInfo.type === 6)) {
      editTargetTask(taskInfo, 0);
    }
  }, [taskInfo]);
  const getData = async (key: string) => {
    setLoading(true);
    let gridRes: any = await api.task.getTaskTreeList(key);
    if (unDistory) {
      if (gridRes.msg === 'OK') {
        let newNodeObj: any = _.cloneDeep(nodeObj);
        if (!newNodeObj) {
          newNodeObj = {};
        }
        let newGridList: any = _.cloneDeep(gridList);
        gridRes.result.forEach((taskItem: any, taskIndex: number) => {
          let nodeIndex = _.findIndex(newGridList, { _key: taskItem._key });
          if (nodeIndex === -1) {
            if (taskItem._key === groupInfo.taskTreeRootCardKey) {
              taskItem.executorKey = '';
              taskItem.executorName = '';
              taskItem.executorAvatar = '';
              taskItem.parentCardKey = '';
            }
            newGridList.push(taskItem);
          }
          let gridTime = moment(taskItem.taskEndDate)
            .endOf('day')
            .diff(moment().endOf('day'), 'days');
          taskItem.children = taskItem.children.filter(
            (item: any, index: number) => {
              if (
                (_.findIndex(gridRes.result, { _key: item }) !== -1 &&
                  !taskItem.contract) ||
                taskItem.contract
              ) {
                return item;
              }
            }
          );
          let editRole =
            (taskItem.groupRole &&
              taskItem.groupRole > 0 &&
              taskItem.groupRole < 4) ||
            taskItem.creatorKey === user._key ||
            taskItem.executorKey === user._key;
          newNodeObj[taskItem._key] = {
            _key: taskItem._key,
            name:
              taskItem.rootType === 10
                ? groupInfo.groupName
                : taskItem.name
                ? taskItem.name
                : taskItem.title,
            // father	父節點 id	String
            disabled:
              taskItem._key === groupInfo.taskTreeRootCardKey || !editRole,
            strikethrough: taskItem.finishPercent === 2,
            contract: taskItem.contract ? true : false,
            checked: taskItem.finishPercent > 0,
            showCheckbox: taskItem.type === 6,
            showStatus:
              taskItem._key !== groupInfo.taskTreeRootCardKey &&
              taskItem.type === 6
                ? true
                : false,
            hour: taskItem.hour,
            limitDay: gridTime < 0 ? gridTime : gridTime + 1,
            avatarUri:
              taskItem.executorKey && taskItem.type === 6
                ? taskItem.executorAvatar
                  ? taskItem.executorAvatar +
                    '?imageMogr2/auto-orient/thumbnail/80x'
                  : defaultPersonPng
                : null,
            backgroundColor:
              taskItem.finishPercent === 2
                ? 'rgba(229, 231, 234, 0.9)'
                : 'rgb(255,255,255)',
            path1: taskItem.path1,
            father:
              taskItem.parentCardKey || key !== groupInfo.taskTreeRootCardKey
                ? taskItem.parentCardKey
                : '',
            sortList: taskItem.children ? taskItem.children : [],
            color:
              gridTime < 0
                ? gridTime < 5
                  ? '999999'
                  : gridTime < 10
                  ? 'CACACA'
                  : gridTime < 15
                  ? 'D8D8D8'
                  : gridTime < 20
                  ? 'EAEAEA'
                  : 'F9F9F9'
                : '#333',
          };
          if (taskItem.type === 1) {
            newNodeObj[taskItem._key].icon = '';
          } else if (taskItem.type === 6) {
            newNodeObj[taskItem._key].icon =
              taskItem.taskType !== 0 ? taskTypeArray[taskItem.taskType] : null;
          } else {
            newNodeObj[taskItem._key].icon = iconArray[taskItem.type - 10];
          }
        });
        // for (let key in newNodeObj) {
        //   if (newNodeObj[key].sortList.length > 0) {
        //     newNodeObj[key].sortList = newNodeObj[key].sortList.filter(
        //       (item: any, index: number) => {
        //         return newNodeObj[item].father === key;
        //       }
        //     );
        //   }
        // }
        setTargetNode(newNodeObj[key]);
        setSelectedId(newNodeObj[key]._key);
        setGridList(newGridList);
        setNodeObj(newNodeObj);
        console.log('key', newNodeObj);
        setSelectedPath(newNodeObj[key].path1);
        setLoading(false);
      } else {
        setLoading(false);
        dispatch(setMessage(true, gridRes.msg, 'error'));
      }
    }
  };
  const addChildrenTask = async (
    selectedNode: any,
    type: string,
    taskType: number
  ) => {
    console.log(selectedNode);
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    let fatherIndex = _.findIndex(newGridList, {
      _key: newNodeObj[selectedNode].father,
    });
    let targetIndex = _.findIndex(newGridList, {
      _key: selectedNode,
    });
    let addTaskRes: any = await api.task.addTask({
      groupKey: groupInfo._key,
      groupRole: groupInfo.role,
      executorKey:
        type === 'child'
          ? newGridList[targetIndex].type === 6
            ? newGridList[targetIndex].executorKey
            : null
          : type === 'next'
          ? newGridList[fatherIndex].type === 6
            ? newGridList[fatherIndex].executorKey
            : null
          : null,
      parentCardKey:
        type === 'child'
          ? selectedNode
          : type === 'next'
          ? newNodeObj[selectedNode].father
          : '',

      type: taskType,
      // type === 'child'
      //   ? newGridList[targetIndex].type === 6
      //     ? 6
      //     : 1
      //   : type === 'next'
      //   ? newGridList[fatherIndex].type === 6
      //     ? 6
      //     : 1
      //   : 1,
      taskType: 0,
    });
    if (addTaskRes.msg === 'OK') {
      let result = addTaskRes.result;
      let icon: any = '';
      newGridList.push(_.cloneDeep(result));
      setGridList(newGridList);
      let gridTime = moment(result.taskEndDate)
        .endOf('day')
        .diff(moment().endOf('day'), 'days');
      let newNode: any = {
        _key: result._key,
        name: result.title,
        // father	父節點 id	String
        contract: false,
        checked: result.finishPercent > 0,
        showCheckbox: result.type === 6,
        showStatus: result.type === 6 ? true : false,
        hour: result.hour,
        limitDay: gridTime < 0 ? gridTime : gridTime + 1,
        father: result.parentCardKey,
        sortList: result.children,
        avatarUri:
          result.executorKey && result.type === 6
            ? result.executorAvatar
              ? result.executorAvatar
              : defaultPersonPng
            : null,
        backgroundColor:
          result.finishPercent == 2
            ? 'rgba(229, 231, 234, 0.9)'
            : 'rgb(255,255,255)',
        color: '#333',
      };
      if (taskType === 1) {
        newNode.icon = '';
      } else if (taskType === 6) {
        newNode.icon =
          result.taskType !== 0 ? taskTypeArray[result.taskType] : null;
      } else {
        newNode.icon = iconArray[taskType - 10];
      }
      // setSelectedId(newNode._key);
      // setDefaultSelectedId(newNode._key);
      // chooseNode(newNode, 1);
      // targetTreeRef.current.closeOptions();
      newNodeObj[newNode._key] = newNode;
      if (type === 'child') {
        newNodeObj[selectedNode].sortList.push(newNode._key);
      } else if (type === 'next') {
        newNodeObj[newNodeObj[selectedNode].father].sortList.push(newNode._key);
      }
      setTargetNode(newNodeObj[newNode._key]);
      setNodeObj(newNodeObj);
      setDefaultSelectedId(newNode._key);
      setAvatarDialogShow(false);
      setStatusDialogShow(false);
      setItemDialogShow(false);
      targetTreeRef.current.rename();
      // dispatch(getGroupTask(3, groupKey, '[0,1,2,10]'));
    } else {
      dispatch(setMessage(true, addTaskRes.msg, 'error'));
    }
  };
  const chooseNode = (node: any, type?: number) => {
    let newGridList = _.cloneDeep(gridList);
    setTargetNode(node);
    let nodeIndex = _.findIndex(newGridList, { _key: node._key });
    if (nodeIndex !== -1) {
      setTargetIndex(nodeIndex);
      let [time, dayNumber, endTime, endState, newTaskItem]: any = [
        0,
        0,
        0,
        false,
        _.cloneDeep(newGridList[nodeIndex]),
      ];
      if (newTaskItem.taskEndDate) {
        time = moment(newTaskItem.taskEndDate)
          .endOf('day')
          .diff(moment().endOf('day'), 'days');
        // this.endTimeText = this.$moment(taskEndDate).format('YYYY年MM月DD日');
      }
      endTime = time < 0 ? Math.abs(time) : Math.abs(time) + 1;
      dayNumber = time;
      endState = time < 0 ? false : true;
      // getTaskMemberArray(taskItem.grougKey)
      setEndtime(endTime);
      setDayNumber(time);
      setTimeNumber(newTaskItem.hour);
    }
    setSelectedId(node._key);
    if (type === 1) {
      // targetTreeRef.current.closeOptions();
      // targetTreeRef.current.rename();
    }
  };
  const editTaskText = async (nodeId: string, text: string) => {
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    newNodeObj[nodeId].name = text;
    let nodeIndex = _.findIndex(newGridList, { _key: nodeId });
    newGridList[nodeIndex].title = text;
    dispatch(editTask({ key: nodeId, title: text }, 3));
    setNodeObj(newNodeObj);
    setGridList(newGridList);
  };
  const editType = async (type: number) => {
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    let nodeId = _.cloneDeep(targetNode)._key;
    newNodeObj[nodeId].icon = iconArray[type - 10];
    let nodeIndex = _.findIndex(newGridList, { _key: nodeId });
    newGridList[nodeIndex].type = type;
    dispatch(editTask({ key: nodeId, type: type }, 3));
    setNodeObj(newNodeObj);
    setGridList(newGridList);
  };
  const editFinishPercent = async (node: any) => {
    let newTargetNode = _.cloneDeep(targetNode);
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);

    let nodeIndex = _.findIndex(newGridList, { _key: node._key });
    newGridList[nodeIndex].finishPercent =
      newGridList[nodeIndex].finishPercent > 0 ? 0 : 1;
    newNodeObj[node._key].checked = !newNodeObj[node._key].checked;
    newNodeObj[node._key].strikethrough =
      newGridList[nodeIndex].finishPercent === 2;
    dispatch(
      editTask(
        { key: node._key, finishPercent: newGridList[nodeIndex].finishPercent },
        3
      )
    );
    setTargetNode(newTargetNode);
    setNodeObj(newNodeObj);
    setGridList(newGridList);
  };
  const deleteTask = async () => {
    setDeleteDialogShow(false);

    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    // if (taskItem.creatorGroupRole <= taskItem.groupRole) {
    let targetNodeIndex = newNodeObj[targetNode.father].sortList.indexOf(
      targetNode._key
    );
    let deleteRes: any = await api.task.deleteTask(
      targetNode._key,
      groupInfo._key
    );
    if (deleteRes.msg === 'OK') {
      newNodeObj[targetNode.father].sortList.splice(targetNodeIndex, 1);
      delete newNodeObj[targetNode._key];
      newGridList.splice(targetIndex, 1);
      setSelectedId(targetNode.father);
      setTargetNode(newNodeObj[targetNode.father]);
      setNodeObj(newNodeObj);
      setGridList(newGridList);
      dispatch(setMessage(true, '删除成功', 'success'));
    } else {
      dispatch(setMessage(true, deleteRes.msg, 'error'));
    }
    //}
  };
  const startMove = (e: any) => {
    if (e.button === 2 && treeRef.current) {
      if (treeRef.current) {
        treeRef.current.addEventListener('mousemove', moveContent, true);
      }
    }
  };
  const moveContent = (e: any) => {
    // if (treeLeft && treeTop) {
    if (theme.moveState) {
      boxRef.current.style.left = e.pageX - 320 + 'px';
    } else {
      boxRef.current.style.left = e.pageX + 'px';
    }
    boxRef.current.style.top = e.pageY - 170 + 'px';

    // boxRef.current.style.left = treeMarginLeft + e.pageX - treeLeft + 'px';
    // boxRef.current.style.top = treeMarginTop + e.pageY - treeTop + 'px';
    // treeMarginLeft = treeMarginLeft + e.pageX - treeLeft;
    // treeMarginTop = treeMarginTop + e.pageY - treeTop;
    // }
    // treeLeft = e.pageX;
    // treeTop = e.pageY;
  };
  const endMove = (e: any) => {
    e.preventDefault();
    if (treeRef.current) {
      treeRef.current.removeEventListener('mousemove', moveContent, true);
    }
  };
  const editTargetTask = (taskItem: any, type: number) => {
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    let nodeIndex = _.findIndex(newGridList, { _key: taskItem._key });
    if (nodeIndex !== -1) {
      newGridList[nodeIndex] = taskItem;
      if (taskItem.finishPercent == 2 && taskItem.children.length > 0) {
        taskItem.contact = true;
      }
      let gridTime = moment(taskItem.taskEndDate)
        .endOf('day')
        .diff(moment().endOf('day'), 'days');
      newNodeObj[taskItem._key].name = taskItem.title;
      newNodeObj[taskItem._key].contract =
        taskItem.finishPercent === 2 ? true : false;
      newNodeObj[taskItem._key].checked = taskItem.finishPercent > 0;
      newNodeObj[taskItem._key].showCheckbox = taskItem.type === 6;
      newNodeObj[taskItem._key].showStatus = true;
      newNodeObj[taskItem._key].hour = taskItem.hour;
      newNodeObj[taskItem._key].limitDay =
        gridTime < 0 ? gridTime : gridTime + 1;
      newNodeObj[taskItem._key].showStatus =
        taskItem._key !== groupInfo.taskTreeRootCardKey && taskItem.type === 6
          ? true
          : false;
      newNodeObj[taskItem._key].avatarUri =
        taskItem.executorKey && taskItem.type === 6
          ? taskItem.executorAvatar
            ? taskItem.executorAvatar
            : defaultPersonPng
          : null;
      newNodeObj[taskItem._key].backgroundColor =
        taskItem.finishPercent === 2
          ? 'rgba(229, 231, 234, 0.9)'
          : 'rgb(255,255,255)';
      newNodeObj[taskItem._key].strikethrough = taskItem.finishPercent === 2;
      setGridList(newGridList);
      setNodeObj(newNodeObj);
    }
  };
  const dragNode = async (dragInfo: any) => {
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    let newTargetNode = _.cloneDeep(newNodeObj[dragInfo.dragNodeId]);
    console.log(newTargetNode);
    console.log(dragInfo);
    let obj = {};

    let fatherKey = newNodeObj[dragInfo.dropNodeId].father;
    let targetFatherKey = newNodeObj[dragInfo.dragNodeId].father;
    let nodeTargetIndex = newNodeObj[targetFatherKey].sortList.indexOf(
      dragInfo.dragNodeId
    );
    let targetFatherIndex = _.findIndex(newGridList, {
      _key: targetFatherKey,
    });

    if (dragInfo.placement === 'in') {
      newNodeObj[dragInfo.dropNodeId].sortList.push(dragInfo.dragNodeId);
      let targetIndex = _.findIndex(newGridList, {
        _key: dragInfo.dragNodeId,
      });
      newNodeObj[dragInfo.dragNodeId].father = dragInfo.dropNodeId;
      newGridList[targetIndex].parentCardKey = dragInfo.dropNodeId;
      obj = {
        oldFatherTaskKey: targetFatherKey,
        sonTaskKey: dragInfo.dragNodeId,
        newFatherTaskKey: dragInfo.dropNodeId,
        childrenIndex: newNodeObj[dragInfo.dropNodeId].sortList.length - 1,
      };
    } else if (fatherKey) {
      let nodeIndex = newNodeObj[fatherKey].sortList.indexOf(
        dragInfo.dropNodeId
      );
      //删除原父亲的children
      //增加原父亲的children
      newNodeObj[fatherKey].sortList.splice(
        dragInfo.placement === 'up' ? nodeIndex : nodeIndex + 1,
        0,
        dragInfo.dragNodeId
      );
      let fatherIndex = _.findIndex(newGridList, { _key: fatherKey });
      newGridList[fatherIndex].children.splice(
        dragInfo.placement === 'up' ? nodeIndex : nodeIndex + 1,
        0,
        dragInfo.dragNodeId
      );
      //改变父亲
      newTargetNode.father = fatherKey;
      let targetIndex = _.findIndex(newGridList, {
        _key: dragInfo.dragNodeId,
      });
      newNodeObj[dragInfo.dragNodeId].father = fatherKey;
      newGridList[targetIndex].parentCardKey = fatherKey;

      obj = {
        oldFatherTaskKey: targetFatherKey,
        sonTaskKey: dragInfo.dragNodeId,
        newFatherTaskKey: fatherKey,
        childrenIndex: dragInfo.placement === 'up' ? nodeIndex : nodeIndex + 1,
      };

      if (fatherKey === targetFatherKey) {
        nodeTargetIndex =
          dragInfo.placement === 'up' ? nodeTargetIndex + 1 : nodeTargetIndex;
      }
    }

    newNodeObj[targetFatherKey].sortList.splice(nodeTargetIndex, 1);
    newGridList[targetFatherIndex].children.splice(nodeTargetIndex, 1);
    let treeRelationRes: any = await api.task.changeTreeTaskRelation(obj);
    if (treeRelationRes.msg === 'OK') {
      setNodeObj(newNodeObj);
      setGridList(newGridList);
      console.log('newNodeObj', newNodeObj);
      console.log('newGridList', newGridList);
    } else {
      dispatch(setMessage(true, treeRelationRes.msg, 'error'));
    }
  };
  const editContract = (node: any) => {
    let newTargetNode = _.cloneDeep(targetNode);
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    node.contract = node.contract ? false : true;
    newNodeObj[node._key].contract = !newNodeObj[node._key].contract;
    let nodeIndex = _.findIndex(newGridList, { _key: node._key });
    newGridList[nodeIndex].contract = node.contract;
    dispatch(
      editTask({ key: node._key, contract: newGridList[nodeIndex].contract }, 3)
    );
    getData(node._key);
    // setTargetNode(newTargetNode);
    // setNodeObj(newNodeObj);
    // setGridList(newGridList);
  };
  const editSortList = (id: string, sortList: any, type: string) => {
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    newNodeObj[newNodeObj[id].father].sortList = sortList;
    let nodeIndex = _.findIndex(newGridList, { _key: newNodeObj[id].father });
    newGridList[nodeIndex].children = sortList;
    // dispatch(editTask({ key: id, ...newGridList[nodeIndex] }, 3));
    setNodeObj(newNodeObj);
    setGridList(newGridList);
  };
  const clickDot = (node: any) => {
    // targetTreeRef.current.closeOptions();
    dispatch(changeTaskInfoVisible(false));
    setStatusDialogShow(false);
    dispatch(changeStartId(node._key));
    setSelectedPath(nodeObj[node._key].path1);
    if (node.finishPercent === 2) {
      getData(node._key);
    }
  };

  const changeExecutor = (
    executorKey: number | string,
    executorName: string,
    executorAvatar: string
  ) => {
    let newTaskItem = _.cloneDeep(gridList)[targetIndex];
    let newMemberArray = _.cloneDeep(groupMemberArray);
    let obj: any = {};
    if (newTaskItem.executorKey === executorKey) {
      newTaskItem.executorKey = '';
      newTaskItem.executorName = '';
      newTaskItem.executorAvatar = '';
    } else {
      newTaskItem.executorKey = executorKey;
      newTaskItem.executorName = executorName;
      newTaskItem.executorAvatar = executorAvatar;
      // newTaskMemberArray.splice(index, 1);
      // newTaskMemberArray.unshift(executorItem);
    }
    obj = {
      executorKey: newTaskItem.executorKey,
      executorName: newTaskItem.executorName,
      executorAvatar: newTaskItem.executorAvatar,
    };
    if (newTaskItem.type === 1) {
      obj.type = 6;
      newTaskItem.type = 6;
    }
    dispatch(
      editTask(
        {
          key: newTaskItem._key,
          ...obj,
        },
        3
      )
    );
    editTargetTask(newTaskItem, 1);
  };
  const changeFollow = (followKey: number | string) => {
    let newTaskItem = _.cloneDeep(gridList)[targetIndex];
    if (!newTaskItem.followUKeyArray) {
      newTaskItem.followUKeyArray = [];
    }
    let followIndex = newTaskItem.followUKeyArray.indexOf(followKey);
    if (followIndex == -1) {
      newTaskItem.followUKeyArray.push(followKey);
    } else {
      newTaskItem.followUKeyArray.splice(followIndex, 1);
    }
    dispatch(
      editTask(
        {
          key: newTaskItem._key,
          followUKeyArray: newTaskItem.followUKeyArray,
        },
        3
      )
    );
    editTargetTask(newTaskItem, 1);
  };
  const changeTaskType = (taskType: number) => {
    let newTargetNode = _.cloneDeep(targetNode);
    if (newTargetNode.type === 6) {
      let newNodeObj = _.cloneDeep(nodeObj);
      let newGridList = _.cloneDeep(gridList);
      newTargetNode.icon = taskTypeArray[taskType];
      newNodeObj[newTargetNode._key].icon =
        taskType !== 0 ? taskTypeArray[taskType] : null;
      let nodeIndex = _.findIndex(newGridList, { _key: newTargetNode._key });
      newGridList[nodeIndex].taskType = taskType;
      dispatch(
        editTask(
          {
            key: newTargetNode._key,
            taskType: newGridList[nodeIndex].taskType,
          },
          3
        )
      );
      setTargetNode(newTargetNode);
      setNodeObj(newNodeObj);
      setGridList(newGridList);
    }
  };
  const changeTimeSet = (type: string, value: number) => {
    let newTaskItem = _.cloneDeep(gridList)[targetIndex];
    let time = 0;
    if (type === 'hour') {
      setTimeNumber(value);
      newTaskItem.hour = value;
    } else if (type === 'day') {
      newTaskItem.day = value;
      newTaskItem.taskEndDate = moment()
        .add(value - 1, 'day')
        .endOf('day')
        .valueOf();
      time = moment(newTaskItem.taskEndDate)
        .endOf('day')
        .diff(moment().endOf('day'), 'days');
      // this.endTimeText = this.$moment(taskEndDate).format('YYYY年MM月DD日');
      setDayNumber(time);
      setEndtime(time + 1);
    } else if (type === 'infinite') {
      newTaskItem.taskEndDate = 99999999999999;
    }
    dispatch(
      editTask(
        {
          key: newTaskItem._key,
          hour: newTaskItem.hour,
          day: newTaskItem.day,
          taskEndDate: newTaskItem.taskEndDate,
          type: 6,
        },
        3
      )
    );
    newTaskItem.type = 6;
    editTargetTask(newTaskItem, 1);
  };
  const changeFinishPercent = (finishPercent: number, type?: string) => {
    let newTaskItem = _.cloneDeep(gridList)[targetIndex];
    // taskDetail.finishPercent = finishPercent !== 0 ? 0 : 1;
    let newNodeObj = _.cloneDeep(nodeObj);
    if (finishPercent === 10) {
      newTaskItem.type = 1;
    } else {
      if (finishPercent === 2 && newTaskItem.finishPercent === 2) {
        newTaskItem.finishPercent = 1;
      } else {
        newTaskItem.finishPercent = finishPercent;
      }
      newTaskItem.type = 6;

      if (newTaskItem.finishPercent === 1) {
        newTaskItem.taskEndDate = moment().valueOf();
      }
    }
    dispatch(
      editTask(
        {
          key: newTaskItem._key,
          type: newTaskItem.type,
          finishPercent: newTaskItem.finishPercent,
          taskEndDate: newTaskItem.taskEndDate,
        },
        3
      )
    );
    editTargetTask(newTaskItem, 1);
  };
  const checkNode = (node: any) => {
    let newGridList = _.cloneDeep(gridList);
    let nodeIndex = _.findIndex(newGridList, {
      _key: node._key,
    });
    setTargetNode(node);
    if (nodeIndex !== -1) {
      setTargetIndex(nodeIndex);
    }
    switch (newGridList[nodeIndex].type) {
      case 1:
        setMenuVisible(true);
        break;
      case 6:
        dispatch(changeTaskInfoVisible(true));
        dispatch(setChooseKey(node._key));
        dispatch(setTaskInfo(newGridList[nodeIndex]));
        break;
      default:
        setInfoVisible(true);
        break;
    }
  };
  const changeGridList = (node: any) => {
    let newGridList = _.cloneDeep(gridList);
    let newNodeObj = _.cloneDeep(nodeObj);
    let nodeIndex = _.findIndex(newGridList, {
      _key: node._key,
    });
    newGridList[nodeIndex] = node;
    newNodeObj[node._key].name = node.title;
    setGridList(newGridList);
    setNodeObj(newNodeObj);
  };
  return (
    <div className="tree">
      {loading ? <Loading /> : null}
      {groupInfo ? (
        <div className="tree-info">
          <div className="tree-time">
            <div className="tree-time-taskType">
              {taskTypeArray.map((item: any, index: number) => {
                return (
                  <img
                    src={item}
                    key={'taskType' + index}
                    style={{ marginRight: '2px', cursor: 'pointer' }}
                    onClick={() => {
                      changeTaskType(index);
                    }}
                  />
                );
              })}
            </div>
            <div className="tree-time-line">|</div>
            <div className="tree-time-container">
              <TimeSet
                timeSetClick={changeTimeSet}
                percentClick={changeFinishPercent}
                dayNumber={dayNumber + 1}
                timeNumber={timeNumber}
                endDate={
                  gridList[targetIndex] && gridList[targetIndex].taskEndDate
                }
                viewStyle={'horizontal'}
              />
            </div>
          </div>
          <div className="tree-path">
            {selectedPath
              ? selectedPath.map((pathItem: any, pathIndex: number) => {
                  return (
                    <React.Fragment key={'path' + pathIndex}>
                      <div
                        onClick={() => {
                          dispatch(changeStartId(pathItem._key));
                          setSelectedPath(nodeObj[pathItem._key].path1);
                        }}
                        style={{
                          fontWeight:
                            startId === pathItem._key ? 'bold' : 'normal',
                        }}
                        className="tree-path-item"
                      >
                        {pathItem.title === '项目任务树根节点'
                          ? groupInfo.groupName
                          : pathItem.title}
                        <div className="tree-path-icon">
                          <div className="tree-path-icon-top"></div>
                          <div className="tree-path-icon-bottom"></div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })
              : null}
          </div>
          <div
            className="tree-container"
            onMouseDown={startMove}
            onContextMenu={endMove}
            ref={treeRef}
            // style={{
            //   height: treeRef.current
            //     ? boxRef.current.offsetHeight + 'px'
            //     : '0px',
            // }}
          >
            <div className="tree-box" ref={boxRef}>
              {nodeObj && startId ? (
                <Tree
                  ref={targetTreeRef}
                  nodes={nodeObj}
                  startId={startId}
                  // renameSelectedNode={true}
                  showIcon={true}
                  showAvatar={true}
                  showMoreButton={true}
                  showPreviewButton={true}
                  // showStatus={true}
                  indent={22}
                  uncontrolled={false}
                  defaultSelectedId={defaultSelectedId}
                  handleAddChild={(selectedNode: any) => {
                    addChildrenTask(selectedNode, 'child', 1);
                  }}
                  handleAddNext={(selectedNode: any) => {
                    addChildrenTask(selectedNode, 'next', 1);
                  }}
                  handleClickNode={(node: any) => chooseNode(node)}
                  handleClickMoreButton={(node: any) => {
                    chooseNode(node);
                    setTreeMenuLeft(node.x);
                    setTreeMenuTop(node.y);
                    setItemDialogShow(true);
                  }}
                  handleDeleteNode={(node: any) => {
                    setDeleteDialogShow(true);
                  }}
                  handleChangeNodeText={editTaskText}
                  handleCheck={editFinishPercent}
                  handleShiftUpDown={editSortList}
                  handleClickExpand={editContract}
                  handleClickPreviewButton={(node: any) => {
                    checkNode(node);
                  }}
                  // showCheckbox={true}
                  handleDrag={dragNode}
                  handleClickDot={
                    clickDot
                    // setSelectedId(node._key);
                  }
                  handleClickAvatar={(node: any) => {
                    // set
                    chooseNode(node);
                    setTreeMenuLeft(node.x);
                    setTreeMenuTop(node.y);
                    setAvatarDialogShow(true);
                  }}
                  handleClickStatus={(node: any) => {
                    // set
                    chooseNode(node);
                    setTreeMenuLeft(node.x);
                    setTreeMenuTop(node.y);
                    setStatusDialogShow(true);
                  }}
                  // nodeOptions={
                  //   <GroupTableTreeItem
                  //     taskDetail={gridList[targetIndex]}
                  //     editTargetTask={editTargetTask}
                  //   />
                  // }
                  // handleClickDot
                />
              ) : null}
              <DropMenu
                visible={statusDialogShow}
                dropStyle={{
                  width: '300px',
                  height: '160px',
                  top: treeMenuTop + 35,
                  left: treeMenuLeft,
                  color: '#333',
                  overflow: 'auto',
                }}
                onClose={() => {
                  setStatusDialogShow(false);
                }}
              >
                <TimeSet
                  timeSetClick={changeTimeSet}
                  percentClick={changeFinishPercent}
                  dayNumber={dayNumber + 1}
                  timeNumber={timeNumber}
                  endDate={
                    gridList[targetIndex] && gridList[targetIndex].taskEndDate
                  }
                  viewStyle={'tree'}
                />
              </DropMenu>
              <DropMenu
                visible={avatarDialogShow}
                dropStyle={{
                  width: '150px',
                  height: '300px',
                  top: treeMenuTop + 35,
                  left: treeMenuLeft,
                  color: '#333',
                  overflow: 'auto',
                }}
                onClose={() => {
                  setAvatarDialogShow(false);
                }}
              >
                <div className="task-executor-dropMenu-info">
                  {groupMemberArray
                    ? groupMemberArray.map(
                        (taskMemberItem: any, taskMemberIndex: number) => {
                          return (
                            <div
                              className="task-executor-dropMenu-container"
                              key={'taskMember' + taskMemberIndex}
                              style={
                                gridList[targetIndex] &&
                                gridList[targetIndex].executorKey ===
                                  taskMemberItem.userId
                                  ? { background: '#F0F0F0' }
                                  : {}
                              }
                              onClick={() => {
                                changeExecutor(
                                  taskMemberItem.userId,
                                  taskMemberItem.nickName,
                                  taskMemberItem.avatar
                                );
                              }}
                            >
                              <div className="task-executor-dropMenu-left">
                                <div
                                  className="task-executor-dropMenu-img"
                                  style={
                                    gridList[targetIndex] &&
                                    ((gridList[targetIndex].followUKeyArray &&
                                      gridList[
                                        targetIndex
                                      ].followUKeyArray.indexOf(
                                        taskMemberItem.userId
                                      ) !== -1) ||
                                      gridList[targetIndex].executorKey ===
                                        taskMemberItem.userId ||
                                      gridList[targetIndex].creatorKey ===
                                        taskMemberItem.userId)
                                      ? { border: '3px solid #17b881' }
                                      : {}
                                  }
                                >
                                  <img
                                    src={
                                      taskMemberItem.avatar
                                        ? taskMemberItem.avatar +
                                          '?imageMogr2/auto-orient/thumbnail/80x'
                                        : defaultPersonPng
                                    }
                                    onClick={(e: any) => {
                                      e.stopPropagation();
                                      changeFollow(taskMemberItem.userId);
                                    }}
                                  />
                                </div>
                                <div>{taskMemberItem.nickName}</div>
                              </div>
                              {gridList[targetIndex] &&
                              gridList[targetIndex].executorKey ===
                                taskMemberItem.userId ? (
                                <img
                                  src={checkPersonPng}
                                  alt=""
                                  style={{
                                    width: '20px',
                                    height: '12px',
                                  }}
                                />
                              ) : null}
                            </div>
                          );
                        }
                      )
                    : null}
                </div>
              </DropMenu>

              <DropMenu
                visible={itemDialogShow}
                dropStyle={{
                  width: '200px',
                  // height: '70px',
                  top: treeMenuTop + 35,
                  left: treeMenuLeft,
                  color: '#333',
                  overflow: 'auto',
                }}
                onClose={() => {
                  if (!typeDialogShow) {
                    setItemDialogShow(false);
                  }
                }}
              >
                <GroupTableTreeItem
                  taskDetail={gridList[targetIndex]}
                  editTargetTask={editTargetTask}
                  setTypeDialogShow={setTypeDialogShow}
                />
              </DropMenu>
              <DropMenu
                visible={typeDialogShow !== 0}
                dropStyle={{
                  width: '200px',
                  // height: '70px',
                  top: treeMenuTop + (typeDialogShow === 1 ? 35 : 85),
                  left: treeMenuLeft + 205,
                  color: '#333',
                  overflow: 'auto',
                }}
                onClose={() => {
                  setItemDialogShow(false);
                  setTypeDialogShow(0);
                }}
              >
                <GroupTableTreeType
                  targetNodeKey={targetNode && targetNode._key}
                  addChildrenTask={addChildrenTask}
                  typeshow={typeDialogShow}
                />
              </DropMenu>
            </div>
            <Dialog
              visible={deleteDialogShow}
              onClose={() => {
                setDeleteDialogShow(false);
              }}
              onOK={() => {
                deleteTask();
              }}
              title={'删除任务'}
              dialogStyle={{ width: '400px', height: '200px' }}
            >
              <div className="dialog-onlyTitle">是否删除该节点</div>
            </Dialog>
            <Dialog
              visible={infoVisible}
              onClose={() => {
                setInfoVisible(false);
              }}
              title={'节点详情'}
              dialogStyle={{
                position: 'fixed',
                top: '65px',
                right: '0px',
                width: '600px',
                height: 'calc(100% - 70px)',
                overflow: 'visible',
              }}
              showMask={false}
              footer={false}
            >
              <GroupTableInfo
                targetItem={gridList[targetIndex]}
                changeGridList={changeGridList}
              />
            </Dialog>
            <Dialog
              visible={menuVisible}
              onClose={() => {
                setMenuVisible(false);
              }}
              title={'切换节点'}
              dialogStyle={{
                position: 'fixed',
                top: '65px',
                right: '0px',
                width: '400px',
                height: 'calc(100% - 70px)',
                overflow: 'visible',
              }}
              showMask={false}
              footer={false}
            >
              <React.Fragment>
                {iconBigArray.map((item: any, index: number) => {
                  return (
                    <div
                      className="iconBig-container"
                      onClick={() => {
                        editType(index + 10);
                      }}
                      key={'iconBig' + index}
                    >
                      <img src={item} alt="" className="iconBig-img" />
                      <div className="iconBig-title">{iconBigText[index]}</div>
                    </div>
                  );
                })}
              </React.Fragment>
              {/* editType */}
            </Dialog>
          </div>
        </div>
      ) : null}

      <div
        className="tree-member"
        style={
          moveState === 'top'
            ? {
                animation: 'rightTop 500ms',
                // animationFillMode: 'forwards',
                height: '50px',
              }
            : moveState === 'bottom'
            ? {
                animation: 'rightBottom 500ms',
                height: '100%',
                // animationFillMode: 'forwards',
              }
            : { height: '50px' }
        }
      >
        <Tooltip title="选择执行人">
          <img
            src={memberSvg}
            alt=""
            className="tree-logo"
            onClick={() => {
              setMoveState(moveState === 'bottom' ? 'top' : 'bottom');
            }}
          />
        </Tooltip>
        {/* <div style={{ color: '#fff', fontSize: '14px', margin: '5px 0px' }}>
          任务树
        </div> */}
        <div className="tree-member-container">
          {groupMemberArray
            ? groupMemberArray.map(
                (taskMemberItem: any, taskMemberIndex: number) => {
                  return (
                    <div
                      className="tree-member-item "
                      key={'taskMember' + taskMemberIndex}
                      onMouseEnter={() => {
                        setMemberCheckIndex(taskMemberIndex);
                      }}
                      onMouseLeave={() => {
                        setMemberCheckIndex(null);
                      }}
                    >
                      <div
                        className="tree-member-img"
                        style={
                          gridList[targetIndex] &&
                          ((gridList[targetIndex].followUKeyArray &&
                            gridList[targetIndex].followUKeyArray.indexOf(
                              taskMemberItem.userId
                            ) !== -1) ||
                            gridList[targetIndex].executorKey ===
                              taskMemberItem.userId ||
                            gridList[targetIndex].creatorKey ===
                              taskMemberItem.userId)
                            ? { border: '3px solid #17b881' }
                            : {}
                        }
                      >
                        <img
                          src={
                            taskMemberItem.avatar
                              ? taskMemberItem.avatar +
                                '?imageMogr2/auto-orient/thumbnail/80x'
                              : defaultPersonPng
                          }
                          onClick={(e: any) => {
                            e.stopPropagation();
                            changeFollow(taskMemberItem.userId);
                          }}
                        />
                      </div>
                      {/* <div>{taskMemberItem.nickName}</div> */}
                      {gridList[targetIndex] &&
                      gridList[targetIndex].executorKey ===
                        taskMemberItem.userId ? (
                        <img
                          src={taskFinishPng}
                          alt=""
                          className="tree-member-check"
                          onClick={() => {
                            changeExecutor('', '', '');
                          }}
                        />
                      ) : memberCheckIndex === taskMemberIndex ? (
                        <img
                          src={taskUnfinishPng}
                          alt=""
                          className="tree-member-check"
                          onClick={() => {
                            changeExecutor(
                              taskMemberItem.userId,
                              taskMemberItem.nickName,
                              taskMemberItem.avatar
                            );
                          }}
                        />
                      ) : null}
                    </div>
                  );
                }
              )
            : null}
        </div>
      </div>
    </div>
  );
};
GroupTableTree.defaultProps = {};
export default GroupTableTree;
