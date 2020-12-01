import React, { useState, useEffect, useRef } from 'react';
import './groupTableTree.css';
import { Tree } from 'tree-graph-react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { setChooseKey, editTask } from '../../redux/actions/taskActions';
import { setHeaderIndex } from '../../redux/actions/memberActions';
import { setMessage } from '../../redux/actions/commonActions';
import { changeStartId } from '../../redux/actions/groupActions';
import moment from 'moment';
import _ from 'lodash';
import api from '../../services/api';
import TimeSet from '../../components/common/timeSet';
import TaskInfo from '../../components/taskInfo/taskInfo';
import Dialog from '../../components/common/dialog';
import GroupTableTreeItem from './groupTableTreeItem';
import taskFinishPng from '../../assets/img/taskFinish.png';
import taskUnfinishPng from '../../assets/img/timeSet2.png';
import defaultPersonPng from '../../assets/img/defaultPerson.png';
import treeCloseSvg from '../../assets/svg/treeClose.svg';
import treeLogoSvg from '../../assets/svg/treeLogo.svg';
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
import DropMenu from '../../components/common/dropMenu';
import checkPersonPng from '../../assets/img/checkPerson.png';
interface GroupTableTreeProps {}

const GroupTableTree: React.FC<GroupTableTreeProps> = (props) => {
  const {} = props;
  const dispatch = useDispatch();
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const user = useTypedSelector((state) => state.auth.user);
  const startId = useTypedSelector((state) => state.group.startId);

  const groupMemberArray = useTypedSelector(
    (state) => state.member.groupMemberArray
  );
  const [gridList, setGridList] = useState<any>([]);
  const [nodeObj, setNodeObj] = useState<any>({});
  const [targetNode, setTargetNode] = useState<any>(null);
  const [targetIndex, setTargetIndex] = useState(0);
  const [selectedId, setSelectedId] = useState('');
  const [defaultSelectedId, setDefaultSelectedId] = useState<any>(null);

  const [selectedPath, setSelectedPath] = useState<any>([]);
  const [taskInfoDialogShow, setTaskInfoDialogShow] = useState(false);
  const [avatarDialogShow, setAvatarDialogShow] = useState(false);
  const [statusDialogShow, setStatusDialogShow] = useState(false);
  const [treeMenuLeft, setTreeMenuLeft] = useState(0);
  const [treeMenuTop, setTreeMenuTop] = useState(0);
  const [deleteDialogShow, setDeleteDialogShow] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [memberCheckIndex, setMemberCheckIndex] = useState<any>(null);
  const [dayNumber, setDayNumber] = useState<any>(null);
  const [endtime, setEndtime] = useState(0);
  const [timeNumber, setTimeNumber] = useState<any>(null);
  const treeRef: React.RefObject<any> = useRef();
  const boxRef: React.RefObject<any> = useRef();
  const targetTreeRef: React.RefObject<any> = useRef();
  const taskTypeArray = [
    // taskType0Svg,
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
  let treeLeft = 0;
  let treeTop = 0;
  let treeMarginLeft = 0;
  let treeMarginTop = 0;
  useEffect(() => {
    if (groupInfo && groupInfo.taskTreeRootCardKey) {
      getData(groupInfo.taskTreeRootCardKey);
    }
  }, []);

  const getData = async (key: string) => {
    let gridRes: any = await api.task.getTaskTreeList(key);
    if (gridRes.msg === 'OK') {
      let newNodeObj: any = _.cloneDeep(nodeObj);
      let newGridList: any = _.cloneDeep(gridList);
      gridRes.result.forEach((taskItem: any, taskIndex: number) => {
        let nodeIndex = _.findIndex(newGridList, { _key: taskItem._key });
        if (nodeIndex === -1) {
          if (taskItem._key === groupInfo.taskTreeRootCardKey) {
            taskItem.executorKey = '';
            taskItem.executorName = '';
            taskItem.executorAvatar = '';
          }
          newGridList.push(taskItem);
        }
        let gridTime = moment(taskItem.taskEndDate)
          .endOf('day')
          .diff(moment().endOf('day'), 'days');
        taskItem.children = taskItem.children.filter(
          (item: any, index: number) => {
            return _.findIndex(gridRes.result, { _key: item }) !== -1;
          }
        );
        let editRole =
          (taskItem.groupRole &&
            taskItem.groupRole > 0 &&
            taskItem.groupRole < 4 &&
            taskItem.creatorGroupRole >= taskItem.groupRole) ||
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
          icon: taskTypeArray[taskItem.taskType],
          hour: taskItem.hour,
          limitDay: gridTime < 0 ? gridTime : gridTime + 1,
          avatarUri: taskItem.executorAvatar
            ? taskItem.executorAvatar
            : defaultPersonPng,
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
        };
      });
      for (let key in newNodeObj) {
        if (newNodeObj[key].sortList.length > 0) {
          newNodeObj[key].sortList = newNodeObj[key].sortList.filter(
            (item: any, index: number) => {
              return newNodeObj[item].father === key;
            }
          );
        }
      }
      setTargetNode(newNodeObj[key]);
      setSelectedId(newNodeObj[key]._key);
      console.log(newGridList);
      setGridList(newGridList);
      setNodeObj(newNodeObj);
      setSelectedPath(newNodeObj[startId].path1);
    } else {
      dispatch(setMessage(true, gridRes.msg, 'error'));
    }
  };
  const addChildrenTask = async (selectedNode: any, type: string) => {
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    console.log('newGridList', newGridList);
    let fatherIndex = _.findIndex(newGridList, {
      _key: newNodeObj[selectedNode].father,
    });
    let targetIndex = _.findIndex(newGridList, {
      _key: selectedNode,
    });
    let addTaskRes: any = await api.task.addTask(
      groupInfo._key,
      groupInfo.role,
      null,
      type === 'child'
        ? newGridList[targetIndex].type === 6
          ? newGridList[targetIndex].executorKey
          : null
        : type === 'next'
        ? newGridList[fatherIndex].type === 6
          ? newGridList[fatherIndex].executorKey
          : null
        : null,

      '',
      type === 'child'
        ? selectedNode
        : type === 'next'
        ? newNodeObj[selectedNode].father
        : '',
      0,
      type === 'child'
        ? newGridList[targetIndex].type === 6
          ? 6
          : 1
        : type === 'next'
        ? newGridList[fatherIndex].type === 6
          ? 6
          : 1
        : 1
    );
    if (addTaskRes.msg === 'OK') {
      let result = addTaskRes.result;
      newGridList.push(_.cloneDeep(result));
      setGridList(newGridList);
      let gridTime = moment(result.taskEndDate)
        .endOf('day')
        .diff(moment().endOf('day'), 'days');
      let newNode = {
        _key: result._key,
        name: result.title,
        // father	父節點 id	String
        contract: result.contract || result.finishPercent === 2 ? true : false,
        checked: result.finishPercent > 0,
        showCheckbox: result.type === 6,
        showStatus: result.type === 6 ? true : false,
        hour: result.hour,
        limitDay: gridTime < 0 ? gridTime : gridTime + 1,
        father: result.parentCardKey,
        sortList: result.children,
        icon: taskTypeArray[result.taskType],
        avatarUri:
          result.executorAvatar && result.type === 6
            ? result.executorAvatar
            : null,
        backgroundColor:
          result.finishPercent == 2
            ? 'rgba(229, 231, 234, 0.9)'
            : 'rgb(255,255,255)',
      };
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
      targetTreeRef.current.closeOptions();
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
    dispatch(editTask({ key: nodeId, ...newGridList[nodeIndex] }, 3));
    setNodeObj(newNodeObj);
    setGridList(newGridList);
  };
  const editFinishPercent = async (node: any) => {
    let newTargetNode = _.cloneDeep(targetNode);
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    node.finishPercent = node.finishPercent > 0 ? 0 : 1;
    node.strikethrough = node.finishPercent === 2;
    newNodeObj[node._key].checked = !newNodeObj[node._key].checked;
    newNodeObj[node._key].strikethrough = node.finishPercent === 2;
    let nodeIndex = _.findIndex(newGridList, { _key: node._key });
    newGridList[nodeIndex].finishPercent = node.finishPercent;
    dispatch(editTask({ key: node._key, ...newGridList[nodeIndex] }, 3));
    setTargetNode(newTargetNode);
    setNodeObj(newNodeObj);
    setGridList(newGridList);
  };
  const deleteTask = async () => {
    setDeleteDialogShow(false);
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
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
  };
  const startMove = (e: any) => {
    if (e.button === 2 && treeRef.current) {
      if (treeRef.current) {
        treeRef.current.addEventListener('mousemove', moveContent, true);
      }
    }
  };
  const moveContent = (e: any) => {
    if (treeLeft && treeTop) {
      console.log(treeMarginLeft);
      console.log(treeMarginTop);
      boxRef.current.style.left = treeMarginLeft + e.pageX - treeLeft + 'px';
      boxRef.current.style.top = treeMarginTop + e.pageY - treeTop + 'px';
      console.log(e.pageX);
      console.log(e.pageY);
      treeMarginLeft = treeMarginLeft + e.pageX - treeLeft;
      treeMarginTop = treeMarginTop + e.pageY - treeTop;
    }
    treeLeft = e.pageX;
    treeTop = e.pageY;
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
    newNodeObj[taskItem._key].limitDay = gridTime < 0 ? gridTime : gridTime + 1;
    newNodeObj[taskItem._key].avatarUri = taskItem.executorAvatar
      ? taskItem.executorAvatar
      : defaultPersonPng;
    newNodeObj[taskItem._key].backgroundColor =
      taskItem.finishPercent === 2
        ? 'rgba(229, 231, 234, 0.9)'
        : 'rgb(255,255,255)';

    if (type) {
      dispatch(editTask({ key: taskItem._key, ...taskItem }, 3));
    }
    console.log(newNodeObj);
    setGridList(newGridList);
    setNodeObj(newNodeObj);
  };
  const dragNode = async (dragInfo: any) => {
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    let newTargetNode = _.cloneDeep(targetNode);
    let obj = {};
    let fatherKey = newNodeObj[dragInfo.targetNodeKey].father;
    let targetFatherKey = newNodeObj[newTargetNode._key].father;
    let nodeTargetIndex = newNodeObj[targetFatherKey].sortList.indexOf(
      targetNode._key
    );

    let targetFatherIndex = _.findIndex(newGridList, {
      _key: targetFatherKey,
    });

    if (dragInfo.placement === 'in') {
      newNodeObj[dragInfo.targetNodeKey].sortList.push(targetNode._key);
      let targetIndex = _.findIndex(newGridList, {
        _key: targetNode._key,
      });
      newNodeObj[targetNode._key].father = dragInfo.targetNodeKey;
      newGridList[targetIndex].parentCardKey = dragInfo.targetNodeKey;
      obj = {
        oldFatherTaskKey: targetFatherKey,
        sonTaskKey: targetNode._key,
        newFatherTaskKey: dragInfo.targetNodeKey,
        childrenIndex: newNodeObj[dragInfo.targetNodeKey].sortList.length - 1,
      };
    } else {
      let nodeIndex = newNodeObj[fatherKey].sortList.indexOf(
        dragInfo.targetNodeKey
      );
      //删除原父亲的children

      //增加原父亲的children
      newNodeObj[fatherKey].sortList.splice(
        dragInfo.placement === 'up' ? nodeIndex : nodeIndex + 1,
        0,
        targetNode._key
      );
      let fatherIndex = _.findIndex(newGridList, { _key: fatherKey });
      newGridList[fatherIndex].children.splice(
        dragInfo.placement === 'up' ? nodeIndex : nodeIndex + 1,
        0,
        targetNode._key
      );
      //改变父亲
      newTargetNode.father = fatherKey;
      let targetIndex = _.findIndex(newGridList, {
        _key: targetNode._key,
      });
      newNodeObj[targetNode._key].father = fatherKey;
      newGridList[targetIndex].parentCardKey = fatherKey;
      obj = {
        oldFatherTaskKey: targetFatherKey,
        sonTaskKey: targetNode._key,
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
      setTargetNode(newTargetNode);
      setNodeObj(newNodeObj);
      setGridList(newGridList);
    } else {
      dispatch(setMessage(true, treeRelationRes.msg, 'error'));
    }
    // let nodeIndex = _.findIndex(newGridList, { _key: nodeId });
    // newGridList[nodeIndex].title = text;
    // dispatch(editTask({ key: nodeId, ...newGridList[nodeIndex] }, 3));
    // setNodeObj(newNodeObj);
    // setGridList(newGridList);
  };
  const editContract = (node: any) => {
    let newTargetNode = _.cloneDeep(targetNode);
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    node.contract = node.contract ? false : true;
    newNodeObj[node._key].contract = !newNodeObj[node._key].contract;
    let nodeIndex = _.findIndex(newGridList, { _key: node._key });
    newGridList[nodeIndex].contract = node.contract;
    dispatch(editTask({ key: node._key, ...newGridList[nodeIndex] }, 3));
    setTargetNode(newTargetNode);
    setNodeObj(newNodeObj);
    setGridList(newGridList);
  };
  const editSortList = (id: string, sortList: any, type: string) => {
    console.log(id, sortList, type);
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
    targetTreeRef.current.closeOptions();
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
    editTargetTask(newTaskItem, 1);
  };
  const changeTaskType = (taskType: number) => {
    let newTargetNode = _.cloneDeep(targetNode);
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    newTargetNode.icon = taskTypeArray[taskType];
    newNodeObj[newTargetNode._key].icon = taskTypeArray[taskType];
    let nodeIndex = _.findIndex(newGridList, { _key: newTargetNode._key });
    newGridList[nodeIndex].taskType = taskType;
    dispatch(
      editTask({ key: newTargetNode._key, ...newGridList[nodeIndex] }, 3)
    );
    setTargetNode(newTargetNode);
    setNodeObj(newNodeObj);
    setGridList(newGridList);
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
    }
    console.log(newTaskItem.hour);
    editTargetTask(newTaskItem, 1);
  };
  const changeFinishPercent = (finishPercent: number) => {
    let newTaskItem = _.cloneDeep(gridList)[targetIndex];
    // taskDetail.finishPercent = finishPercent !== 0 ? 0 : 1;
    newTaskItem.finishPercent = finishPercent;
    if (newTaskItem.finishPercent === 1) {
      newTaskItem.todayTaskTime = moment().valueOf();
      newTaskItem.strikethrough = false;
    } else if (newTaskItem.finishPercent === 0) {
      newTaskItem.todayTaskTime = 0;
      newTaskItem.strikethrough = false;
    } else if (newTaskItem.finishPercent === 2) {
      newTaskItem.strikethrough = true;
    }
    editTargetTask(newTaskItem, 1);
  };
  return (
    <div className="tree">
      <div className="tree-member">
        <img src={treeLogoSvg} alt="" className="tree-logo" />
        <div style={{ color: '#fff', fontSize: '14px', margin: '5px 0px' }}>
          任务树
        </div>
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
                              ? taskMemberItem.avatar
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
      <div className="tree-info">
        <div className="tree-time">
          <div className="tree-time-taskType">
            <img src={taskType0Svg} style={{ marginRight: '5px' }} />
            {taskTypeArray.map((item: any, index: number) => {
              return (
                <img
                  src={item}
                  key={'taskType' + index}
                  style={{ marginRight: '5px', cursor: 'pointer' }}
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
                      {pathItem.title}
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
                // showStatus={true}
                indent={22}
                uncontrolled={false}
                defaultSelectedId={defaultSelectedId}
                handleAddChild={(selectedNode: any) => {
                  addChildrenTask(selectedNode, 'child');
                }}
                handleAddNext={(selectedNode: any) => {
                  addChildrenTask(selectedNode, 'next');
                }}
                handleClickNode={(node: any) => chooseNode(node)}
                handleClickMoreButton={(node: any) => {
                  setTaskInfoDialogShow(true);
                  dispatch(setChooseKey(node._key));
                }}
                handleDeleteNode={(node: any) => {
                  setDeleteDialogShow(true);
                }}
                handleChangeNodeText={editTaskText}
                handleCheck={editFinishPercent}
                handleShiftUpDown={editSortList}
                handleClickExpand={editContract}
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
                nodeOptions={
                  <GroupTableTreeItem
                    taskDetail={gridList[targetIndex]}
                    editTargetTask={editTargetTask}
                  />
                }
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
                {groupMemberArray.map(
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
                                  ? taskMemberItem.avatar
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
                )}
              </div>
            </DropMenu>
          </div>
          {taskInfoDialogShow ? (
            <TaskInfo
              fatherTaskItem={gridList[targetIndex]}
              onClose={() => {
                setTaskInfoDialogShow(false);
              }}
              editFatherTask={editTargetTask}
            />
          ) : null}
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
        </div>
      </div>

      <img
        className="tree-close"
        src={treeCloseSvg}
        onClick={() => {
          dispatch(setHeaderIndex(0));
        }}
      />
    </div>
  );
};
GroupTableTree.defaultProps = {};
export default GroupTableTree;
