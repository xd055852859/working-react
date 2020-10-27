import React, { useState, useEffect } from 'react';
import './groupTableTree.css';
import { Tree } from 'tree-graph-react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import {
  changeTaskInfoVisible,
  setChooseKey,
} from '../../redux/actions/taskActions';
import { setMessage } from '../../redux/actions/commonActions';
import moment from 'moment';
import _ from 'lodash';
import api from '../../services/api';

import TaskInfo from '../../components/taskInfo/taskInfo';
import Dialog from '../../components/common/dialog';
interface GroupTableTreeProps {}

const GroupTableTree: React.FC<GroupTableTreeProps> = (props) => {
  const {} = props;
  const dispatch = useDispatch();
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);

  const [nodeObj, setNodeObj] = useState<any>(null);
  const [targetNode, setTargetNode] = useState<any>(null);
  const [selectedId, setSelectedId] = useState('1317895632');
  const [taskInfoDialogShow, setTaskInfoDialogShow] = useState(false);
  const [deleteDialogShow, setDeleteDialogShow] = useState(false);
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
      gridRes.result.forEach((taskItem: any, taskIndex: number) => {
        newNodeObj[taskItem._key] = {
          _key: taskItem._key,
          name:
            taskItem._key === groupInfo.taskTreeRootCardKey
              ? taskItem.name
              : taskItem.title,
          // father	父節點 id	String
          contract: false,
          checked: taskItem.finishPercent > 0,
          showStatus: true,
          hour: taskItem.hour,
          limitDay: moment(taskItem.taskEndDate)
            .endOf('day')
            .diff(moment().endOf('day'), 'days'),
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
  const addChildrenTask = async () => {
    console.log(targetNode);
    let addTaskRes: any = await api.task.addTask(
      groupInfo._key,
      groupInfo.role,
      null,
      null,
      '',
      targetNode._key,
      0,
      6
    );
    if (addTaskRes.msg === 'OK') {
      let newNodeObj = _.cloneDeep(nodeObj);
      let result = addTaskRes.result;
      let newNode = {
        _key: result._key,
        name: result.title,
        // father	父節點 id	String
        contract: false,
        checked: result.finishPercent > 0,
        showStatus: true,
        hour: result.hour,
        limitDay: moment(result.taskEndDate)
          .endOf('day')
          .diff(moment().endOf('day'), 'days'),
        father: result.parentCardKey,
        sortList: result.children,
      };
      setSelectedId(newNode._key);
      newNodeObj[newNode._key] = newNode;
      newNodeObj[targetNode._key].sortList.push(newNode._key);
      setTargetNode(newNodeObj[newNode._key]);
      setNodeObj(newNodeObj);
      console.log(newNodeObj);
      // dispatch(getGroupTask(3, groupKey, '[0,1,2]'));
    } else {
      dispatch(setMessage(true, addTaskRes.msg, 'error'));
    }
  };
  const deleteTask = async () => {
    setDeleteDialogShow(false);
    let newNodeObj = _.cloneDeep(nodeObj);
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
      setSelectedId(targetNode.father);
      setTargetNode(newNodeObj[targetNode.father]);
      setNodeObj(newNodeObj);
      dispatch(setMessage(true, '删除成功', 'success'));
    } else {
      dispatch(setMessage(true, deleteRes.msg, 'error'));
    }
  };
  return (
    <div className="tree-container">
      {nodeObj ? (
        <Tree
          nodes={nodeObj}
          startId={groupInfo && groupInfo.taskTreeRootCardKey}
          // renameSelectedNode={true}
          showIcon={true}
          showAvatar={true}
          showMoreButton={true}
          uncontrolled={false}
          defaultSelectedId={selectedId}
          handleAddChild={addChildrenTask}
          handleClickNode={(node: any) => setTargetNode(node)}
          handleClickMoreButton={(node: any) => {
            setTaskInfoDialogShow(true);
            dispatch(setChooseKey(node._key));
          }}
          handleDeleteNode={(node: any) => {
            setDeleteDialogShow(true);
          }}
          showCheckbox={true}
        />
      ) : null}
      {taskInfoDialogShow ? (
        <TaskInfo
          fatherTaskItem={targetNode}
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
