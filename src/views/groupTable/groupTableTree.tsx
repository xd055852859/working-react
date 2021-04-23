import React, { useState, useEffect, useRef } from 'react';
import './groupTableTree.css';
import { Tree } from 'tree-graph-react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { Tooltip, Button } from 'antd';

import {
  setChooseKey,
  editTask,
  changeTaskInfoVisible,
  setTaskInfo,
} from '../../redux/actions/taskActions';
import { setMessage } from '../../redux/actions/commonActions';
import { changeStartId, getGroupInfo } from '../../redux/actions/groupActions';
import moment from 'moment';
import _ from 'lodash';
import api from '../../services/api';

import IconFont from '../../components/common/iconFont';
import TimeSet from '../../components/common/timeSet';
import TaskMember from '../../components/task/taskMember';
import GroupTableTreeType from './groupTableTreeType';
import Dialog from '../../components/common/dialog';
import FileList from '../../components/fileList/fileList';

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
import bigCloseSvg from '../../assets/svg/bigClose.svg';
import Loading from '../../components/common/loading';
import { Moveable } from '../../components/common/moveable';
import DropMenu from '../../components/common/dropMenu';

import emptySvg from '../../assets/svg/empty.svg';
import linkBigIconSvg from '../../assets/svg/linkBigIcon.svg';
interface GroupTableTreeProps {
  groupKey: string;
}

const GroupTableTree: React.FC<GroupTableTreeProps> = (props) => {
  const { groupKey } = props;
  const dispatch = useDispatch();
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);

  const user = useTypedSelector((state) => state.auth.user);
  const theme = useTypedSelector((state) => state.auth.theme);
  const homeMoveState = useTypedSelector((state) => state.common.moveState);
  const startId = useTypedSelector((state) => state.group.startId);
  const taskInfo = useTypedSelector((state) => state.task.taskInfo);
  const groupMemberArray = useTypedSelector(
    (state) => state.member.groupMemberArray
  );
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
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
  const [fullType, setFullType] = useState('small');
  const [infoBigVisible, setInfoBigVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);
  const [editable, setEditable] = useState<any>(false);
  const [fileVisible, setFileVisible] = useState<any>(false);

  const [menuVisible, setMenuVisible] = useState(false);
  const [memberCheckIndex, setMemberCheckIndex] = useState<any>(null);
  const [dayNumber, setDayNumber] = useState<any>(null);
  const [endtime, setEndtime] = useState(0);
  const [timeNumber, setTimeNumber] = useState<any>(null);
  const [moveState, setMoveState] = useState<any>('');
  const [content, setContent] = useState<any>('');
  const treeRef: React.RefObject<any> = useRef();
  const boxRef: React.RefObject<any> = useRef();
  const targetTreeRef: React.RefObject<any> = useRef();
  let moveRef: any = useRef();
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
    linkBigIconSvg,
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
  let unDistory = useRef<any>(null);
  unDistory.current = true;
  useEffect(() => {
    if (!groupInfo) {
      dispatch(getGroupInfo(groupKey));
    }
  }, [groupInfo]);
  useEffect(() => {
    if (
      groupInfo &&
      groupInfo._key === groupKey &&
      groupInfo.taskTreeRootCardKey
    ) {
      getData(groupInfo.taskTreeRootCardKey);
      treeLeft = 0;
      treeTop = 0;
      moveRef.current.reset();
    }
    return () => {
      // unDistory.current = false;
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
  const getData = async (
    key: string,
    targetNodeObj?: any,
    targetGridList?: any
  ) => {
    setLoading(true);
    let gridRes: any = await api.task.getTaskTreeList(
      groupInfo.taskTreeRootCardKey,
      key
    );
    if (unDistory.current) {
      if (gridRes.msg === 'OK') {
        let newNodeObj: any = _.cloneDeep(nodeObj);
        let frontPath = gridRes.frontPath;
        if (!newNodeObj) {
          newNodeObj = {};
        }
        let newGridList: any = _.cloneDeep(gridList);
        if (targetNodeObj) {
          newNodeObj = targetNodeObj;
          newGridList = targetGridList;
        }
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
          if (key !== groupInfo.taskTreeRootCardKey && taskItem._key !== key) {
            taskItem.path1.splice(0, 1);
          }
          newNodeObj[taskItem._key] = {
            _key: taskItem._key,
            name:
              taskItem.rootType === 10
                ? groupInfo.groupName
                : taskItem.name
                ? taskItem.name
                : taskItem.title,
            // father	父節點 id	String
            type: taskItem.type,
            disabled:
              taskItem._key === groupInfo.taskTreeRootCardKey ||
              !editRole ||
              taskItem._key === groupInfo.labelRootCard,
            strikethrough: taskItem.finishPercent === 2,
            checked: taskItem.finishPercent > 0,
            showCheckbox: taskItem.type === 6,
            showStatus:
              taskItem._key !== groupInfo.taskTreeRootCardKey &&
              taskItem.type === 6
                ? true
                : false,
            hour: taskItem.hour,
            limitDay: taskItem.taskEndDate + 1 ? taskItem.taskEndDate + 1 : 0,
            avatarUri:
              taskItem.executorKey && taskItem.type === 6
                ? taskItem.executorAvatar
                  ? taskItem.executorAvatar +
                    '?imageMogr2/auto-orient/thumbnail/80x'
                  : defaultPersonPng
                : null,
            // backgroundColor:
            //   taskItem.finishPercent === 2
            //     ? 'rgba(229, 231, 234, 0.9)'
            //     : 'rgb(255,255,255)',
            path1: [...frontPath, ...taskItem.path1],
            father:
              taskItem.parentCardKey || key !== groupInfo.taskTreeRootCardKey
                ? taskItem.parentCardKey
                : '',
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
          if (taskItem.type === 1 || taskItem.type === 6) {
            newNodeObj[taskItem._key].icon =
              taskItem.taskType !== 0 ? taskTypeArray[taskItem.taskType] : null;
          } else {
            newNodeObj[taskItem._key].icon = taskItem.extraData?.icon
              ? taskItem.extraData.icon
              : iconArray[taskItem.type - 10];
          }
          if (taskItem.children) {
            newNodeObj[taskItem._key].sortList =
              taskItem.finishPercent !== 2 ? taskItem.children : [];
            newNodeObj[taskItem._key].contract =
              (taskItem.contract &&
                newNodeObj[taskItem._key].sortList.length > 0) ||
              (taskItem.type === 15 && key === groupInfo.taskTreeRootCardKey)
                ? true
                : false;
          } else {
            newNodeObj[taskItem._key].sortList = [];
            newNodeObj[taskItem._key].contract = false;
          }
        });
        console.log(newNodeObj);
        // for (let key in newNodeObj) {
        //   if (newNodeObj[key].sortList.length > 0) {
        //     newNodeObj[key].sortList = newNodeObj[key].sortList.filter(
        //       (item: any, index: number) => {
        //         return newNodeObj[item].father === key;
        //       }
        //     );
        //   }
        // }

        if (!targetNodeObj) {
          setTargetNode(newNodeObj[key]);
          setSelectedId(newNodeObj[key]._key);
        }
        if (newGridList.length < 10 && key === groupInfo.taskTreeRootCardKey) {
          setHelpVisible(true);
        }
        setGridList(newGridList);
        setNodeObj(newNodeObj);
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
    console.log('???????', selectedNode);
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    let fatherKey =
      type === 'child'
        ? selectedNode
        : type === 'next'
        ? newNodeObj[selectedNode].father
        : '';
    let addTaskRes: any = await api.task.addTask({
      title: '',
      groupKey: groupInfo._key,
      groupRole: groupInfo.role,
      labelKey:
        newGridList[targetIndex].type === 30
          ? newGridList[targetIndex].correspondLabelKey
          : newGridList[targetIndex].labelKey,
      parentCardKey: fatherKey,
      indexTree:
        type === 'child'
          ? newNodeObj[selectedNode].sortList.length
          : type === 'next'
          ? targetIndex + 1
          : 0,
      type: taskType ? taskType : 1,
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
      newGridList.push(_.cloneDeep(result));
      setGridList(newGridList);
      setTargetIndex(newGridList.length - 1);
      let newNode: any = {
        _key: result._key,
        name: result.title,
        // father	父節點 id	String
        type: taskType,
        contract: false,
        labelKey: result.labelKey,
        path1: result.path1,
        checked: result.finishPercent > 0,
        showCheckbox: result.type === 6,
        showStatus: result.type === 6 ? true : false,
        hour: result.hour,
        limitDay: result.taskEndDate + 1 ? result.taskEndDate + 1 : 0,
        father: result.parentCardKey,
        sortList: result.children,
        avatarUri:
          result.executorKey && result.type === 6
            ? result.executorAvatar
              ? result.executorAvatar + '?imageMogr2/auto-orient/thumbnail/80x'
              : defaultPersonPng
            : null,
        // backgroundColor:
        //   result.finishPercent == 2
        //     ? 'rgba(229, 231, 234, 0.9)'
        //     : 'rgb(255,255,255)',
        color: '#333',
      };
      if (taskType === 1 || taskType === 6) {
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
        let targetIndex = newNodeObj[
          newNodeObj[selectedNode].father
        ].sortList.indexOf(selectedNode);
        newNodeObj[newNodeObj[selectedNode].father].sortList.splice(
          targetIndex + 1,
          0,
          newNode._key
        );
      }
      // console.log(newNodeObj);
      setNodeObj(newNodeObj);
      //checkNode(newNodeObj[newNode._key], newGridList);
      // setInfoBigVisible(true);
      setTargetNode(newNodeObj[newNode._key]);
      chooseNode(newNodeObj[newNode._key], 1);
      setDefaultSelectedId(newNode._key);
      // getData(fatherKey, newNodeObj, newGridList);
      setAvatarDialogShow(false);
      setStatusDialogShow(false);
      setItemDialogShow(false);
      // setTypeDialogShow(0);
      // targetTreeRef.current.rename();
      // dispatch(getGroupTask(3, groupKey, '[0,1,2,10]'));
    } else {
      dispatch(setMessage(true, addTaskRes.msg, 'error'));
    }
  };
  const chooseNode = (node: any, type?: number) => {
    // setMenuVisible(false);
    // setInfoBigVisible(false);
    // dispatch(changeTaskInfoVisible(false));
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
        time = moment(newTaskItem.taskEndDate + 1)
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
      targetTreeRef.current.rename();
    }
  };
  const editTaskText = async (nodeId: string, text: string) => {
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    if (newNodeObj[nodeId].type !== 30) {
      if (text.trim() === '') {
        text = '新主题';
      }
      newNodeObj[nodeId].name = text;
      let nodeIndex = _.findIndex(newGridList, { _key: nodeId });
      newGridList[nodeIndex].title = text;
      dispatch(editTask({ key: nodeId, title: text }, 3));
      console.log(newNodeObj);
      setNodeObj(newNodeObj);
      setGridList(newGridList);
    } else {
      dispatch(setMessage(true, '频道节点不允许修改频道名', 'error'));
    }
  };
  const editType = async (type: number) => {
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    let newTargetNode = _.cloneDeep(targetNode);
    let nodeId = _.cloneDeep(targetNode)._key;
    if (newNodeObj[nodeId].type !== 30) {
      newNodeObj[nodeId].icon = iconArray[type - 10];
      newNodeObj[nodeId].type = type;
      let nodeIndex = _.findIndex(newGridList, { _key: nodeId });
      newGridList[nodeIndex].type = type;
      newTargetNode.type = type;
      dispatch(editTask({ key: nodeId, type: type }, 3));
      setNodeObj(newNodeObj);
      setGridList(newGridList);
      setTargetNode(newTargetNode);
      setMenuVisible(false);
      setEditable(false);
    } else {
      setEditable(false);
      dispatch(setMessage(true, '频道节点不允许修改频道类型', 'error'));
    }
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
    console.log(taskItem);
    if (nodeIndex !== -1) {
      newGridList[nodeIndex] = taskItem;
      // if (taskItem.finishPercent == 2 && taskItem.children.length > 0) {
      //   taskItem.contact = true;
      // }
      let gridTime = moment(taskItem.taskEndDate + 1)
        .endOf('day')
        .diff(moment().endOf('day'), 'days');
      newNodeObj[taskItem._key].name = taskItem.title;
      newNodeObj[taskItem._key].type = taskItem.type;
      newNodeObj[taskItem._key].contract = newNodeObj[taskItem._key].contract
        ? true
        : false;
      newNodeObj[taskItem._key].checked = taskItem.finishPercent > 0;
      newNodeObj[taskItem._key].showCheckbox = taskItem.type === 6;
      newNodeObj[taskItem._key].showStatus = true;
      newNodeObj[taskItem._key].hour = taskItem.hour;
      newNodeObj[taskItem._key].limitDay =
        taskItem.taskEndDate + 1 ? taskItem.taskEndDate + 1 : 0;
      newNodeObj[taskItem._key].showStatus =
        taskItem._key !== groupInfo.taskTreeRootCardKey && taskItem.type === 6
          ? true
          : false;
      newNodeObj[taskItem._key].avatarUri =
        taskItem.executorKey && taskItem.type === 6
          ? taskItem.executorAvatar
            ? taskItem.executorAvatar + '?imageMogr2/auto-orient/thumbnail/80x'
            : defaultPersonPng
          : null;
      // newNodeObj[taskItem._key].backgroundColor =
      //   taskItem.finishPercent === 2
      //     ? 'rgba(229, 231, 234, 0.9)'
      //     : 'rgb(255,255,255)';
      newNodeObj[taskItem._key].strikethrough = taskItem.finishPercent === 2;
      console.log(gridList[nodeIndex].finishPercent, taskItem.finishPercent);
      if (
        gridList[nodeIndex].finishPercent === 2 &&
        taskItem.finishPercent !== 2
      ) {
        getData(taskItem._key, newNodeObj, newGridList);
      } else {
        setGridList(newGridList);
        setNodeObj(newNodeObj);
      }
    }
  };
  const dragNode = async (dragInfo: any) => {
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    let newTargetNode = _.cloneDeep(newNodeObj[dragInfo.dragNodeId]);
    let obj = {};
    console.log(newNodeObj[dragInfo.dropNodeId]);
    console.log(newNodeObj[dragInfo.dragNodeId]);
    if (newNodeObj[dragInfo.dragNodeId].type !== 30) {
      let fatherKey = newNodeObj[dragInfo.dropNodeId].father;
      let targetFatherKey = newNodeObj[dragInfo.dragNodeId].father;
      let nodeTargetIndex = newNodeObj[targetFatherKey].sortList.indexOf(
        dragInfo.dragNodeId
      );
      let targetFatherIndex = _.findIndex(newGridList, {
        _key: targetFatherKey,
      });
      console.log(fatherKey);
      if (dragInfo.placement === 'in') {
        // newNodeObj[dragInfo.dropNodeId].sortList.push(dragInfo.dragNodeId);
        // let targetIndex = _.findIndex(newGridList, {
        //   _key: dragInfo.dragNodeId,
        // });
        // newNodeObj[dragInfo.dragNodeId].father = dragInfo.dropNodeId;
        // newGridList[targetIndex].parentCardKey = dragInfo.dropNodeId;
        obj = {
          oldFatherTaskKey: targetFatherKey,
          sonTaskKey: dragInfo.dragNodeId,
          newFatherTaskKey: dragInfo.dropNodeId,
          childrenIndex:
            newNodeObj[dragInfo.dropNodeId].sortList.length > 0
              ? newNodeObj[dragInfo.dropNodeId].sortList.length - 1
              : 0,
        };
        console.log(obj);
      } else if (fatherKey) {
        let nodeIndex = newNodeObj[fatherKey].sortList.indexOf(
          dragInfo.dropNodeId
        );
        //删除原父亲的children
        //增加原父亲的children
        // newNodeObj[fatherKey].sortList.splice(
        //   dragInfo.placement === 'up' ? nodeIndex : nodeIndex + 1,
        //   0,
        //   dragInfo.dragNodeId
        // );
        // let fatherIndex = _.findIndex(newGridList, { _key: fatherKey });
        // newGridList[fatherIndex].children.splice(
        //   dragInfo.placement === 'up' ? nodeIndex : nodeIndex + 1,
        //   0,
        //   dragInfo.dragNodeId
        // );
        //改变父亲
        // newTargetNode.father = fatherKey;
        // let targetIndex = _.findIndex(newGridList, {
        //   _key: dragInfo.dragNodeId,
        // });
        // newNodeObj[dragInfo.dragNodeId].father = fatherKey;
        // newGridList[targetIndex].parentCardKey = fatherKey;

        obj = {
          oldFatherTaskKey: targetFatherKey,
          sonTaskKey: dragInfo.dragNodeId,
          newFatherTaskKey: fatherKey,
          childrenIndex:
            dragInfo.placement === 'up' ? nodeIndex : nodeIndex + 1,
        };

        // if (fatherKey === targetFatherKey) {
        //   nodeTargetIndex =
        //     dragInfo.placement === 'up' ? nodeTargetIndex + 1 : nodeTargetIndex;
        // }
      }

      newNodeObj[targetFatherKey].sortList.splice(nodeTargetIndex, 1);
      newGridList[targetFatherIndex].children.splice(nodeTargetIndex, 1);

      let treeRelationRes: any = await api.task.changeTreeTaskRelation(obj);
      if (treeRelationRes.msg === 'OK') {
        getData(fatherKey, newNodeObj, newGridList);
      } else {
        dispatch(setMessage(true, treeRelationRes.msg, 'error'));
      }
    } else {
      dispatch(setMessage(true, '频道节点不允许拖拽', 'error'));
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
  const editSortList = async (id: string, sortList: any, type: string) => {
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    newNodeObj[newNodeObj[id].father].sortList = sortList;
    let nodeIndex = _.findIndex(newGridList, { _key: newNodeObj[id].father });
    newGridList[nodeIndex].children = sortList;
    console.log(sortList);
    let treeRelationRes: any = await api.task.editCardSimple(
      newNodeObj[id].father,
      { children: sortList }
    );
    if (treeRelationRes.msg === 'OK') {
      setNodeObj(newNodeObj);
      setGridList(newGridList);
    } else {
      dispatch(setMessage(true, treeRelationRes.msg, 'error'));
    }
  };
  const clickDot = (node: any) => {
    // targetTreeRef.current.closeOptions();
    dispatch(changeTaskInfoVisible(false));
    setStatusDialogShow(false);
    dispatch(changeStartId(node._key));
    setSelectedPath(nodeObj[node._key].path1);
    moveRef.current.reset();
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
    if (newTargetNode.type === 6 || newTargetNode.type === 1) {
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
    if (newTaskItem.type === 1) {
      newTaskItem.taskEndDate = moment().endOf('day').valueOf();
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
        // newTaskItem.contract = newTaskItem.hasChildren ? true : false;
      } else {
        if (finishPercent !== 2 && newTaskItem.finishPercent === 2) {
          console.log('newTaskItem.hasChildren', newTaskItem.hasChildren);
          // newTaskItem.contract = newTaskItem.hasChildren ? true : false;
        }
        newTaskItem.finishPercent = finishPercent;
      }
      if (newTaskItem.type === 1) {
        newTaskItem.taskEndDate = moment().endOf('day').valueOf();
      }
      newTaskItem.type = 6;

      if (newTaskItem.finishPercent === 1) {
        newTaskItem.taskEndDate = moment().endOf('day').valueOf();
      }
    }
    dispatch(
      editTask(
        {
          key: newTaskItem._key,
          type: newTaskItem.type,
          finishPercent: newTaskItem.finishPercent,
          taskEndDate: newTaskItem.taskEndDate,
          // contract: newTaskItem.contract,
        },
        3
      )
    );
    editTargetTask(newTaskItem, 1);
  };
  const checkNode = (node: any, targetGridList?: any) => {
    let newGridList = _.cloneDeep(gridList);
    // setEditInfoType('查看')
    if (targetGridList) {
      newGridList = _.cloneDeep(targetGridList);
      // setFullType('big');
    }
    let nodeIndex = _.findIndex(newGridList, {
      _key: node._key,
    });
    setTargetNode(node);
    console.log('node', node);
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
        setInfoBigVisible(true);
        setFullType('small');
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
    newNodeObj[node._key].icon = node.extraData?.icon
      ? node.extraData.icon
      : iconArray[node.type - 10];
    setGridList(newGridList);
    setNodeObj(newNodeObj);
  };
  const pasteNode = async (
    pasteNodeKey: string,
    pasteType: any,
    targetNodeKey: string
  ) => {
    let newGridList = _.cloneDeep(gridList);
    let newNodeObj = _.cloneDeep(nodeObj);
    if (pasteType === 'copy') {
      let copyRes: any = await api.task.copyTreeTask(
        pasteNodeKey,
        targetNodeKey,
        groupInfo.taskTreeRootCardKey
      );
      if (copyRes.msg === 'OK') {
        let targetIndex = _.findIndex(newGridList, {
          _key: targetNodeKey,
        });
        newNodeObj[targetNodeKey].sortList.push(copyRes.newRoot);
        newGridList[targetIndex].children.push(copyRes.newRoot);
        getData(copyRes.newRoot, newNodeObj, newGridList);
      } else {
        dispatch(setMessage(true, copyRes.msg, 'error'));
      }
    } else if (pasteType === 'cut') {
      dragNode({
        dragNodeId: pasteNodeKey,
        dropNodeId: targetNodeKey,
        placement: 'in',
      });
    }
  };

  const saveMarkDown = () => {
    const imgReg = /<img.*?(?:>|\/>)/gi; // 匹配图片中的img标签
    const srcReg = /src=['"]?([^'"]*)['"]?/i; // 匹配图片中的src
    let innerHtml;
    let cover: any = '';
    let title: string = '';
    let dom = document.getElementById('editor-preview');
    if (dom) {
      // 获取title，既一个dom
      const firstNode: any = dom.childNodes[0];
      title = firstNode ? firstNode.innerHTML : '';

      innerHtml = dom.innerHTML;
      // 筛选出所有的img
      const arr = innerHtml.match(imgReg);
      if (arr) {
        const srcMatch = arr[0].match(srcReg);
        if (srcMatch) {
          // 将第一个图片作为封面
          // eslint-disable-next-line prefer-destructuring
          cover = srcMatch[1];
        }
      }

      // 获取摘要
      innerHtml = dom.innerHTML;
      // 去除标签
      innerHtml = innerHtml.replace(/<\/?.+?>/g, '');
      innerHtml = innerHtml.replace(/&nbsp;/g, '');
      // 去除标题
      innerHtml = innerHtml.replace(title, '');
      return title;
    }
  };
  const changeContent = async (value?: string, title?: string) => {
    let newTargetNode = _.cloneDeep(gridList[targetIndex]);
    let newContent: any = _.cloneDeep(content);
    let linkUrl = '';
    if (newTargetNode.type === 14 && value) {
      if (value.includes('http://') || value.includes('https://')) {
        linkUrl = value;
      } else {
        linkUrl = `https://${value}`;
      }
      dispatch(
        editTask(
          {
            key: newTargetNode._key,
            extraData: { url: value },
          },
          3
        )
      );
      dispatch(setMessage(true, '保存成功', 'success'));
      changeGridList(newTargetNode);
      newTargetNode.extraData = { url: value, icon: '' };
      let urlRes: any = await api.auth.getUrlIcon(linkUrl);
      if (urlRes.msg === 'OK') {
        if (urlRes.icon) {
          newTargetNode.extraData = { url: value, icon: urlRes.icon };
          dispatch(
            editTask(
              {
                key: newTargetNode._key,
                extraData: { url: value, icon: urlRes.icon },
              },
              3
            )
          );
        }
        changeGridList(newTargetNode);
      } else {
        dispatch(setMessage(true, urlRes.msg, 'error'));
      }
    } else {
      let newTitle: any = newTargetNode.title;
      if (title) {
        newTitle = title;
      }
      if (value) {
        newContent = value;
      }
      if (newTargetNode.type === 13) {
        newTitle = saveMarkDown();
      }
      console.log(newContent);
      if (newTargetNode.type !== 15) {
        dispatch(
          editTask(
            { key: newTargetNode._key, content: newContent, title: newTitle },
            3
          )
        );
        dispatch(setMessage(true, '保存成功', 'success'));
      }
      newTargetNode.content = newContent;
      newTargetNode.title = newTitle;
      changeGridList(newTargetNode);
    }
    if (newTargetNode.type !== 11) {
      setEditable(false);
    }
  };
  return (
    <div className="tree">
      {loading ? <Loading /> : null}
      {groupInfo ? (
        <div
          className="tree-info"
          style={{
            width:
              targetNode && targetNode.type === 6
                ? 'calc(100% - 50px)'
                : '100%',
          }}
        >
          <div
            className="tree-path"
            style={homeMoveState === 'in' ? { left: '0px' } : { left: '320px' }}
          >
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
                        {pathItem.title === '项目任务树根节点' ||
                        (pathItem.title === '任务树' && pathIndex === 0)
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
                targetNode={targetNode}
              />
            </div>
          </div>
          <div
            className="tree-container"
            // onMouseDown={startMove}
            // onContextMenu={endMove}
            // ref={treeRef}
            // style={{
            //   height: treeRef.current
            //     ? boxRef.current.offsetHeight + 'px'
            //     : '0px',
            // }}
          >
            <Moveable
              scrollable={true}
              style={{ display: 'flex' }}
              rightClickToStart={true}
              ref={moveRef}
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
                    showAddButton={true}
                    showPreviewButton={true}
                    // showStatus={true}
                    indent={22}
                    uncontrolled={false}
                    defaultSelectedId={selectedId}
                    handleAddChild={(selectedNode: any) => {
                      if (selectedNode !== groupInfo.labelRootCard) {
                        console.log('555555', selectedNode);
                        setSelectedId(selectedNode);
                        addChildrenTask(selectedNode, 'child', 1);
                      } else {
                        dispatch(
                          setMessage(
                            true,
                            '频道总节点不允许增加子频道节点',
                            'error'
                          )
                        );
                      }
                    }}
                    handleAddNext={(selectedNode: any) => {
                      if (nodeObj[selectedNode].type !== 30) {
                        addChildrenTask(selectedNode, 'next', 1);
                      } else {
                        dispatch(
                          setMessage(
                            true,
                            '频道节点不允许添加同级节点',
                            'error'
                          )
                        );
                      }
                    }}
                    handleClickNode={(node: any) => chooseNode(node)}
                    handleClickMoreButton={(node: any) => {
                      console.log(node);
                      if (node._key !== groupInfo.labelRootCard) {
                        chooseNode(node);
                        setTreeMenuLeft(node.x);
                        setTreeMenuTop(node.y);
                        setItemDialogShow(true);
                      } else {
                        dispatch(
                          setMessage(
                            true,
                            '频道总节点不允许增加子节点',
                            'error'
                          )
                        );
                      }
                    }}
                    handleDeleteNode={(node: any) => {
                      if (nodeObj[node].type !== 30) {
                        setDeleteDialogShow(true);
                      } else {
                        dispatch(
                          setMessage(true, '频道节点不允许删除', 'error')
                        );
                      }
                    }}
                    handleChangeNodeText={editTaskText}
                    handleCheck={editFinishPercent}
                    handleShiftUpDown={editSortList}
                    handleClickExpand={editContract}
                    handleClickPreviewButton={(node: any) => {
                      if (node.type !== 30) {
                        checkNode(node);
                        if (node.type >= 10) {
                          api.task.setVisitCardTime(node._key);
                        }
                      } else {
                        dispatch(
                          setMessage(
                            true,
                            '频道节点不允许修改节点类型',
                            'error'
                          )
                        );
                      }
                    }}
                    handleClickAddButton={(node: any) => {
                      if (node._key !== groupInfo.labelRootCard) {
                        setSelectedId(node._key);
                        addChildrenTask(node._key, 'child', 1);
                      } else {
                        dispatch(
                          setMessage(
                            true,
                            '频道总节点不允许增加子频道节点',
                            'error'
                          )
                        );
                      }
                    }}
                    // showCheckbox={true}
                    handleDrag={dragNode}
                    handleClickDot={
                      clickDot
                      // setSelectedId(node._key);
                    }
                    handleClickAvatar={(node: any) => {
                      let newGridList = _.cloneDeep(gridList);
                      let nodeIndex = _.findIndex(newGridList, {
                        _key: node._key,
                      });
                      chooseNode(node);
                      setTreeMenuLeft(node.x);
                      setTreeMenuTop(node.y);
                      dispatch(setChooseKey(node._key));
                      dispatch(setTaskInfo(newGridList[nodeIndex]));
                      setAvatarDialogShow(true);
                    }}
                    handleClickStatus={(node: any) => {
                      // set
                      chooseNode(node);
                      setTreeMenuLeft(node.x);
                      setTreeMenuTop(node.y);
                      setStatusDialogShow(true);
                    }}
                    hideHour={!theme.hourVisible}
                    handlePaste={pasteNode}
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
                    width: '260px',
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
                  <TaskMember
                    // targetGroupKey={groupKey}
                    // onClose={setAvatarDialogShow(false)}
                    // chooseFollow={changeFollow}
                    showMemberVisible={avatarDialogShow}
                  />
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
                  <GroupTableTreeType
                    targetNodeKey={targetNode && targetNode._key}
                    addChildrenTask={addChildrenTask}
                    // typeshow={typeDialogShow}
                    typeshow={1}
                  />
                  {/* <GroupTableTreeItem
                    taskDetail={gridList[targetIndex]}
                    editTargetTask={editTargetTask}
                    setTypeDialogShow={setTypeDialogShow}
                  /> */}
                </DropMenu>
                {/* <DropMenu
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
                </DropMenu> */}
              </div>
            </Moveable>
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
            {/* <Dialog
              visible={infoVisible}
              onClose={() => {
                setInfoVisible(false);
              }}
              title={'节点详情'}
              dialogStyle={{
                position: 'fixed',
                top: '68px',
                right: '0px',
                width: '600px',
                height: 'calc(100% - 70px)',
                // overflow: 'visible',
              }}
              showMask={false}
              footer={false}
              closePngState={true}
            >
              <GroupTableInfo
                targetItem={gridList[targetIndex]}
                changeGridList={changeGridList}
                fullType={fullType}
                changeFullType={changeFullType}
                editInfoType={editInfoType}
              />
            </Dialog> */}
            <Dialog
              visible={fileVisible}
              onClose={() => {
                setFileVisible(false);
              }}
              title={'最近文件'}
              dialogStyle={{
                position: 'fixed',
                top: '119px',
                right: moveState === 'bottom' ? '110px' : '60px',
                // right: '110px',
                width: '350px',
                height: 'calc(100% - 168px)',
                // overflow: 'visible',
              }}
              showMask={false}
              footer={false}
              closePngState={true}
            >
              <FileList groupKey={groupKey} type="最近" />
            </Dialog>
            <Dialog
              visible={helpVisible}
              onClose={() => {
                setHelpVisible(false);
              }}
              title={'快捷键'}
              dialogStyle={{
                position: 'fixed',
                top: '175px',
                right: moveState === 'bottom' ? '60px' : '10px',
                // right: '60px',
                width: '300px',
                height: 'calc(100% - 225px)',
                // overflow: 'visible',
              }}
              showMask={false}
              footer={false}
              closePngState={true}
            >
              <div className="help-item">
                <span>创建同级节点</span> <span>Enter</span>
              </div>
              <div className="help-item">
                <span>创建下级节点</span> <span>Tab</span>
              </div>
              <div className="help-item">
                <span>拖动视图</span> <span>按住鼠标右键并拖动</span>
              </div>
              <div className="help-item">
                <span>选中节点</span> <span>鼠标单击</span>
              </div>
              <div className="help-item">
                <span>编辑节点名</span> <span>鼠标双击</span>
              </div>

              <div className="help-item">
                <span>复制节点</span> <span>Ctrl + C</span>
              </div>
              <div className="help-item">
                <span>剪切节点</span> <span>Ctrl + X</span>
              </div>
              <div className="help-item">
                <span>粘贴节点</span> <span>Ctrl + V</span>
              </div>
              <div className="help-item">
                <span>删除节点</span> <span>Delete</span>
              </div>
              <div className="help-item">
                <span>向上调整</span> <span>shift + ↑</span>
              </div>
              <div className="help-item">
                <span>向下调整</span> <span>shift + ↓</span>
              </div>
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
            {gridList.length < 2 ? (
              <div className="tree-empty">
                <img src={emptySvg} alt="" />
              </div>
            ) : null}
          </div>
          <div
            className="help-container"
            style={{
              right: moveState === 'bottom' ? '60px' : '10px',
              // right: '60px',
            }}
          >
            <Tooltip title="快捷键">
              <Button
                size="large"
                shape="circle"
                style={{ border: '0px' }}
                ghost
                icon={<IconFont type="icon-keyboard" />}
                onClick={() => {
                  setHelpVisible(true);
                  setFileVisible(false);
                }}
              />
            </Tooltip>
          </div>
          <div
            className="help-container"
            style={{
              right: moveState === 'bottom' ? '110px' : '60px',
              // right: '110px',
            }}
          >
            <Tooltip title="最近文件">
              <Button
                size="large"
                shape="circle"
                style={{ border: '0px' }}
                ghost
                icon={<IconFont type="icon-wenjian" />}
                onClick={() => {
                  setHelpVisible(false);
                  setFileVisible(true);
                }}
              />
            </Tooltip>
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
            : { height: '100%' }
        }
      >
        <Tooltip title="选择执行人">
          <img
            src={memberSvg}
            alt=""
            className="tree-logo"
            onClick={() => {
              setMoveState(moveState === 'top' ? 'bottom' : 'top');
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
                            ? { border: '3px solid #1890ff' }
                            : {}
                        }
                      >
                        <Tooltip title={taskMemberItem.nickName}>
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
                        </Tooltip>
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
      {infoBigVisible ? (
        <div
          className="groupTableTree-full  animate__animated animate__slideInRight"
          style={{
            width:
              fullType === 'big'
                ? theme.moveState
                  ? 'calc(100% - 320px)'
                  : '100%'
                : '600px',
            height: 'calc(100% - 70px)',
            top: '68px',
            borderRadius: fullType === 'big' ? '0px' : '12px',
          }}
        >
          <div className="groupTableTree-full-title">
            <div>{targetNode.name ? targetNode.name : ''}</div>
            <div className="groupTableTree-full-img">
              {targetNode.type === 10 ||
              (targetNode.type === 11 && !editable) ||
              targetNode.type === 13 ? (
                <Tooltip title={editable ? '保存' : '编辑'}>
                  <Button
                    size="large"
                    shape="circle"
                    style={{ border: '0px' }}
                    ghost
                    icon={
                      editable ? (
                        <IconFont type="icon-baocun1" />
                      ) : (
                        <IconFont type="icon-edit" />
                      )
                    }
                    onClick={() => {
                      if (!editable) {
                        setEditable(true);
                        setFullType('big');
                      } else {
                        changeContent();
                      }
                    }}
                  />
                </Tooltip>
              ) : null}
              {targetNode.type === 14 &&
              gridList[targetIndex].extraData?.url ? (
                <Tooltip title="跳转外部链接">
                  <Button
                    size="large"
                    shape="circle"
                    style={{ border: '0px' }}
                    ghost
                    icon={<IconFont type="icon-iconzhengli_tiaozhuan" />}
                    onClick={() => {
                      let linkUrl = '';
                      let value = gridList[targetIndex].extraData.url;
                      if (
                        value.includes('http://') ||
                        value.includes('https://')
                      ) {
                        linkUrl = value;
                      } else {
                        linkUrl = `https://${value}`;
                      }
                      console.log(linkUrl);
                      window.open(linkUrl);
                    }}
                  />
                </Tooltip>
              ) : null}
              <Tooltip title={fullType === 'small' ? '全屏' : '缩小'}>
                <Button
                  size="large"
                  shape="circle"
                  style={{ border: '0px' }}
                  ghost
                  icon={
                    fullType === 'small' ? (
                      <IconFont type="icon-quanping" />
                    ) : (
                      <IconFont type="icon-suoxiao" />
                    )
                  }
                  onClick={() => {
                    setFullType(fullType === 'big' ? 'small' : 'big');
                  }}
                />
              </Tooltip>
            </div>
          </div>
          <GroupTableInfo
            targetItem={gridList[targetIndex]}
            fullType={fullType}
            editable={editable}
            changeContent={changeContent}
            changeTargetContent={setContent}
            changeEditable={setEditable}
          />
          <img
            src={bigCloseSvg}
            alt=""
            className="bigClose"
            onClick={() => {
              setInfoBigVisible(false);
              setEditable(false);
            }}
          />
        </div>
      ) : null}
    </div>
  );
};
GroupTableTree.defaultProps = {};
export default GroupTableTree;
