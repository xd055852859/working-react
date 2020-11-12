import React, { useState, useEffect, useRef } from 'react';
import './groupTableTree.css';
import { Tree } from 'tree-graph-react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { setChooseKey, editTask } from '../../redux/actions/taskActions';
import { setMessage } from '../../redux/actions/commonActions';
import { changeStartId } from '../../redux/actions/groupActions';
import moment from 'moment';
import _ from 'lodash';
import api from '../../services/api';

import TaskInfo from '../../components/taskInfo/taskInfo';
import Dialog from '../../components/common/dialog';
import GroupTableTreeItem from './groupTableTreeItem';

import defaultPersonPng from '../../assets/img/defaultPerson.png';
interface GroupTableTreeProps {}

const GroupTableTree: React.FC<GroupTableTreeProps> = (props) => {
  const {} = props;
  const dispatch = useDispatch();
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const startId = useTypedSelector((state) => state.group.startId);
  const [gridList, setGridList] = useState<any>(null);
  const [nodeObj, setNodeObj] = useState<any>(null);
  const [targetNode, setTargetNode] = useState<any>(null);
  const [targetIndex, setTargetIndex] = useState(0);
  const [selectedId, setSelectedId] = useState('');
  const [selectedPath, setSelectedPath] = useState<any>([]);
  // const [treeTop, setTreeTop] = useState(0);
  // const [treeLeft, setTreeLeft] = useState(0);
  const [taskInfoDialogShow, setTaskInfoDialogShow] = useState(false);
  const [deleteDialogShow, setDeleteDialogShow] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const treeRef: React.RefObject<any> = useRef();
  const boxRef: React.RefObject<any> = useRef();
  let treeLeft = 0;
  let treeTop = 0;
  useEffect(() => {
    if (groupInfo && groupInfo.taskTreeRootCardKey) {
      getData(groupInfo.taskTreeRootCardKey);
    }
  }, []);

  const getData = async (key: string) => {
    let gridRes: any = await api.task.getTaskTreeList(key);
    if (gridRes.msg === 'OK') {
      let newNodeObj: any = {};
      setGridList(_.cloneDeep(gridRes.result));
      gridRes.result.forEach((taskItem: any, taskIndex: number) => {
        let gridTime = moment(taskItem.taskEndDate)
          .endOf('day')
          .diff(moment().endOf('day'), 'days');
        taskItem.children = taskItem.children.filter(
          (item: any, index: number) => {
            return _.findIndex(gridRes.result, { _key: item }) !== -1;
          }
        );
        newNodeObj[taskItem._key] = {
          _key: taskItem._key,
          name:
            taskItem.rootType === 10
              ? groupInfo.groupName
              : taskItem.name
              ? taskItem.name
              : taskItem.title,
          // father	父節點 id	String
          contract:
            taskItem.contract ||
            (taskItem.finishPercent === 2 && taskItem.children.length > 0)
              ? true
              : false,
          checked: taskItem.finishPercent > 0,
          showCheckbox: taskItem.type === 6,
          showStatus:
            taskItem._key !== groupInfo.taskTreeRootCardKey ? true : false,
          hour: taskItem.hour,
          limitDay: gridTime < 0 ? gridTime : gridTime + 1,
          avatarUri:
            taskItem.executorAvatar && taskItem.type == 6
              ? taskItem.executorAvatar
              : null,
          backgroundColor:
            taskItem.finishPercent === 2
              ? 'rgba(229, 231, 234, 0.9)'
              : 'rgb(255,255,255)',
          path1: taskItem.path1,
          father: taskItem.parentCardKey ? taskItem.parentCardKey : '',
          sortList: taskItem.children ? taskItem.children : [],
        };
      });
      newNodeObj[key].father = '';
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
    console.log('targetIndex', newGridList[targetIndex]);
    console.log('fatherIndex', newGridList[fatherIndex]);
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
        showStatus: true,
        hour: result.hour,
        limitDay: gridTime < 0 ? gridTime : gridTime + 1,
        father: result.parentCardKey,
        sortList: result.children,
        avatarUri:
          result.executorAvatar && result.type === 6
            ? result.executorAvatar
            : null,
        backgroundColor:
          result.finishPercent == 2
            ? 'rgba(229, 231, 234, 0.9)'
            : 'rgb(255,255,255)',
      };
      setSelectedId(newNode._key);
      newNodeObj[newNode._key] = newNode;
      if (type === 'child') {
        newNodeObj[selectedNode].sortList.push(newNode._key);
      } else if (type === 'next') {
        newNodeObj[newNodeObj[selectedNode].father].sortList.push(newNode._key);
      }
      setTargetNode(newNodeObj[newNode._key]);
      setNodeObj(newNodeObj);
      // dispatch(getGroupTask(3, groupKey, '[0,1,2]'));
    } else {
      dispatch(setMessage(true, addTaskRes.msg, 'error'));
    }
  };
  const chooseNode = (node: any) => {
    let newGridList = _.cloneDeep(gridList);
    setTargetNode(node);
    let nodeIndex = _.findIndex(newGridList, { _key: node._key });
    setTargetIndex(nodeIndex);
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
    newNodeObj[node._key].checked = !newNodeObj[node._key].checked;
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
    boxRef.current.style.left =
      e.pageX - 68 - boxRef.current.offsetWidth / 2 + 'px';
    boxRef.current.style.top = e.pageY - boxRef.current.offsetHeight / 2 + 'px';
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
    let gridTime = moment(taskItem.taskEndDate)
      .endOf('day')
      .diff(moment().endOf('day'), 'days');
    newNodeObj[taskItem._key].name = taskItem.title;
    newNodeObj[taskItem._key].contract =
      taskItem.finishPercent == 2 ? true : false;
    newNodeObj[taskItem._key].checked = taskItem.finishPercent > 0;
    newNodeObj[taskItem._key].showCheckbox = taskItem.type === 6;
    newNodeObj[taskItem._key].showStatus = true;
    newNodeObj[taskItem._key].hour = taskItem.hour;
    newNodeObj[taskItem._key].limitDay = gridTime < 0 ? gridTime : gridTime + 1;
    newNodeObj[taskItem._key].avatarUri =
      taskItem.executorAvatar && taskItem.type == 6
        ? taskItem.executorAvatar
        : null;
    newNodeObj[taskItem._key].backgroundColor =
      taskItem.finishPercent === 2
        ? 'rgba(229, 231, 234, 0.9)'
        : 'rgb(255,255,255)';
    if (type) {
      dispatch(editTask({ key: taskItem._key, ...taskItem }, 3));
    }
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
  return (
    <React.Fragment>
      <div className="tree-path">
        {selectedPath.map((pathItem: any, pathIndex: number) => {
          return (
            <React.Fragment key={'path' + pathIndex}>
              <span
                onClick={() => {
                  dispatch(changeStartId(pathItem._key));
                  setSelectedPath(nodeObj[pathItem._key].path1);
                }}
                style={{
                  color: startId === pathItem._key ? '#17B881' : '#333',
                }}
              >
                {pathItem.title}
              </span>
              <span>{pathIndex !== selectedPath.length - 1 ? ' / ' : ''}</span>
            </React.Fragment>
          );
        })}
      </div>
      <div
        className="tree-container"
        onMouseDown={startMove}
        onContextMenu={endMove}
        ref={treeRef}
      >
        <div
          className="tree-box"
          ref={boxRef}
          // style={{
          //   top: treeTop,
          //   left: treeLeft,
          // }}
        >
          {nodeObj ? (
            <Tree
              nodes={nodeObj}
              startId={startId}
              // renameSelectedNode={true}
              showIcon={true}
              showAvatar={true}
              showMoreButton={true}
              // showStatus={true}
              uncontrolled={false}
              defaultSelectedId={selectedId}
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
              handleClickDot={(node: any) => {
                dispatch(changeStartId(node._key));
                setSelectedPath(nodeObj[node._key].path1);
                // setSelectedId(node._key);
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
    </React.Fragment>
  );
};
GroupTableTree.defaultProps = {};
export default GroupTableTree;
