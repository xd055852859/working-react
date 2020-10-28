import React, { useState, useEffect, useRef } from 'react';
import './groupTableTree.css';
import { Tree } from 'tree-graph-react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import {
  changeTaskInfoVisible,
  setChooseKey,
} from '../../redux/actions/taskActions';
import { setMessage } from '../../redux/actions/commonActions';
import { editTask } from '../../redux/actions/taskActions';
import moment from 'moment';
import _ from 'lodash';
import api from '../../services/api';

import TaskInfo from '../../components/taskInfo/taskInfo';
import Dialog from '../../components/common/dialog';
import defaultPersonPng from '../../assets/img/defaultPerson.png';
interface GroupTableTreeProps {}

const GroupTableTree: React.FC<GroupTableTreeProps> = (props) => {
  const {} = props;
  const dispatch = useDispatch();
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const [gridList, setGridList] = useState<any>(null);
  const [nodeObj, setNodeObj] = useState<any>(null);
  const [targetNode, setTargetNode] = useState<any>(null);
  const [targetIndex, setTargetIndex] = useState(0);
  const [selectedId, setSelectedId] = useState('');
  // const [treeTop, setTreeTop] = useState(0);
  // const [treeLeft, setTreeLeft] = useState(0);
  const [taskInfoDialogShow, setTaskInfoDialogShow] = useState(false);
  const [deleteDialogShow, setDeleteDialogShow] = useState(false);
  const treeRef: React.RefObject<any> = useRef();
  const boxRef: React.RefObject<any> = useRef();
  let treeLeft = 0;
  let treeTop = 0;
  useEffect(() => {
    if (groupInfo) {
      getData();
    }
  }, [groupInfo]);
  const getData = async () => {
    let gridRes: any = await api.task.getTaskTreeList(
      groupInfo.taskTreeRootCardKey
    );
    if (gridRes.msg === 'OK') {
      let newNodeObj: any = {};
      setGridList(_.cloneDeep(gridRes.result));
      gridRes.result.forEach((taskItem: any, taskIndex: number) => {
        let gridTime = moment(taskItem.taskEndDate)
          .endOf('day')
          .diff(moment().endOf('day'), 'days');
        newNodeObj[taskItem._key] = {
          _key: taskItem._key,
          name: taskItem.name ? taskItem.name : taskItem.title,
          // father	父節點 id	String
          contract: false,
          checked: taskItem.finishPercent > 0,
          showStatus: true,
          hour: taskItem.hour,
          limitDay: gridTime < 0 ? gridTime : gridTime + 1,
          avatarUri: taskItem.executorAvatar
            ? taskItem.executorAvatar
            : defaultPersonPng,
        };
        if (taskItem.parentCardKey) {
          newNodeObj[taskItem._key].father = taskItem.parentCardKey;
        }
        if (taskItem.children) {
          newNodeObj[taskItem._key].sortList = taskItem.children;
        }
      });
      newNodeObj[groupInfo.taskTreeRootCardKey].father = '';
      setTargetNode(newNodeObj[groupInfo.taskTreeRootCardKey]);
      setSelectedId(newNodeObj[groupInfo.taskTreeRootCardKey]._key);
      setNodeObj(newNodeObj);
      console.log(newNodeObj);
    } else {
      dispatch(setMessage(true, gridRes.msg, 'error'));
    }
  };
  const addChildrenTask = async (type: string) => {
    let addTaskRes: any = await api.task.addTask(
      groupInfo._key,
      groupInfo.role,
      null,
      null,
      '',
      type === 'child'
        ? targetNode._key
        : type === 'next'
        ? targetNode.father
        : '',
      0,
      6
    );
    if (addTaskRes.msg === 'OK') {
      let newNodeObj = _.cloneDeep(nodeObj);
      let result = addTaskRes.result;
      let gridTime = moment(result.taskEndDate)
        .endOf('day')
        .diff(moment().endOf('day'), 'days');
      let newNode = {
        _key: result._key,
        name: result.title,
        // father	父節點 id	String
        contract: false,
        checked: result.finishPercent > 0,
        showStatus: true,
        hour: result.hour,
        limitDay: gridTime < 0 ? gridTime : gridTime + 1,
        father: result.parentCardKey,
        sortList: result.children,
        avatarUri: result.executorAvatar
          ? result.executorAvatar
          : defaultPersonPng,
      };
      setSelectedId(newNode._key);
      newNodeObj[newNode._key] = newNode;
      if (type === 'child') {
        newNodeObj[targetNode._key].sortList.push(newNode._key);
      } else if (type === 'next') {
        newNodeObj[targetNode.father].sortList.push(newNode._key);
      }
      setTargetNode(newNodeObj[newNode._key]);
      setNodeObj(newNodeObj);
      console.log(newNodeObj);
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
    console.log();
    let newTargetNode = _.cloneDeep(targetNode);
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    newTargetNode.title = text;
    newNodeObj[nodeId].name = text;
    newGridList[targetIndex].title = text;
    dispatch(editTask({ key: nodeId, ...newGridList[targetIndex] }, 3));
    setTargetNode(newTargetNode);
    setNodeObj(newNodeObj);
    setGridList(newGridList);
  };
  const editFinishPercent = async (node: any) => {
    let newTargetNode = _.cloneDeep(targetNode);
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    newTargetNode.finishPercent = newTargetNode.finishPercent > 0 ? 0 : 1;
    newNodeObj[node._key].checked = newTargetNode.finishPercent > 0;
    newGridList[targetIndex].finishPercent = newTargetNode.finishPercent;
    dispatch(editTask({ key: node._key, ...newGridList[targetIndex] }, 3));
    setTargetNode(newTargetNode);
    setNodeObj(newNodeObj);
    setGridList(newGridList);
  };
  const deleteTask = async () => {
    setDeleteDialogShow(false);
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    let targetNodeIndex = targetNode._key.indexOf(
      newNodeObj[targetNode.father].sortList
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
  return (
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
            startId={groupInfo && groupInfo.taskTreeRootCardKey}
            // renameSelectedNode={true}
            showIcon={true}
            showAvatar={true}
            showMoreButton={true}
            showStatus={true}
            uncontrolled={false}
            defaultSelectedId={selectedId}
            handleAddChild={() => {
              addChildrenTask('child');
            }}
            handleAddNext={() => {
              addChildrenTask('next');
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
            showCheckbox={true}
            // nodeOptions={}
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
  );
};
GroupTableTree.defaultProps = {};
export default GroupTableTree;
