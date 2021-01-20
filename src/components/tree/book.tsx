import React, { useState, useEffect, useRef } from 'react';
import './book.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { MenuTree } from 'tree-graph-react';
import { Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../redux/actions/commonActions';
import { editTask } from '../../redux/actions/taskActions';
import Dialog from '../../components/common/dialog';
import Editor from '../../components/common/Editor';
import api from '../../services/api';
import _ from 'lodash';
import { StepContent } from '@material-ui/core';
interface BookProps {
  targetData: any;
  editable: boolean;
  onChange: Function;
}

const Book: React.FC<BookProps> = (props) => {
  const { targetData, editable, onChange } = props;
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const dispatch = useDispatch();
  const [gridList, setGridList] = useState<any>([]);
  const [nodeObj, setNodeObj] = useState<any>(null);
  const [disabled, setDisabled] = useState<any>(false);
  const [targetNode, setTargetNode] = useState<any>(null);
  const [targetIndex, setTargetIndex] = useState(0);
  const [selectedId, setSelectedId] = useState('');
  const [content, setContent] = useState<any>('');

  const [defaultSelectedId, setDefaultSelectedId] = useState<any>(null);
  const [deleteDialogShow, setDeleteDialogShow] = useState(false);
  const targetTreeRef: React.RefObject<any> = useRef();
  let unDistory = true;
  useEffect(() => {
    if (targetData) {
      getBookData(targetData._key);
    }
    return () => {
      unDistory = false;
    };
  }, [targetData]);
  const getBookData = async (key: string) => {
    let bookRes: any = await api.task.getTaskTreeList(key);
    if (unDistory) {
      if (bookRes.msg === 'OK') {
        let newNodeObj: any = _.cloneDeep(nodeObj);
        if (!newNodeObj) {
          newNodeObj = {};
        }
        let newGridList: any = _.cloneDeep(gridList);
        bookRes.result.forEach((taskItem: any, taskIndex: number) => {
          newGridList.push(taskItem);
          newNodeObj[taskItem._key] = {
            _key: taskItem._key,
            name: taskItem.title,
            type: taskItem.type,
            contract: taskItem.contract ? true : false,
            father: taskItem.parentCardKey ? taskItem.parentCardKey : '',
            sortList: taskItem.children ? taskItem.children : [],
            content: taskItem.content,
          };
        });
        setTargetNode(newNodeObj[key]);
        if (newNodeObj[key].content) {
          setContent(newNodeObj[key].content);
        } else {
          setContent('<p>标题</p>');
        }
        setSelectedId(newNodeObj[key]._key);
        setGridList(newGridList);
        setNodeObj(newNodeObj);
      } else {
        dispatch(setMessage(true, bookRes.msg, 'error'));
      }
    }
  };
  const chooseNode = (node: any, type?: number) => {
    let newGridList = _.cloneDeep(gridList);
    let nodeIndex = _.findIndex(newGridList, { _key: node._key });
    if (nodeIndex !== -1) {
      setTargetIndex(nodeIndex);
    }
    setTargetNode(node);
    if (node.content) {
      setContent(node.content);
    } else {
      setContent('<p>标题</p>');
    }
    setSelectedId(node._key);
  };
  const addChildrenTask = async (selectedNode: any, type: string) => {
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
      parentCardKey:
        type === 'child'
          ? selectedNode
          : type === 'next'
          ? newNodeObj[selectedNode].father
          : '',
      type: 15,
    });
    if (addTaskRes.msg === 'OK') {
      let result = addTaskRes.result;
      newGridList.push(_.cloneDeep(result));
      setGridList(newGridList);
      let newNode: any = {
        _key: result._key,
        name: result.title,
        // father	父節點 id	String
        type: 15,
        contract: false,
        father: result.parentCardKey,
        sortList: result.children,
        content: result.content,
      };
      newNodeObj[newNode._key] = newNode;
      if (type === 'child') {
        newNodeObj[selectedNode].sortList.push(newNode._key);
      } else if (type === 'next') {
        newNodeObj[newNodeObj[selectedNode].father].sortList.push(newNode._key);
      }
      setSelectedId(newNode._key);
      setTargetNode(newNodeObj[newNode._key]);
      setNodeObj(newNodeObj);
      setDefaultSelectedId(newNode._key);
      targetTreeRef.current.rename();
      // dispatch(getGroupTask(3, groupKey, '[0,1,2,10]'));
    } else {
      dispatch(setMessage(true, addTaskRes.msg, 'error'));
    }
  };
  const editTaskText = async (nodeId: string, text: string, type?: number) => {
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    if (type) {
      newNodeObj[nodeId].content = text;
    } else {
      newNodeObj[nodeId].name = text;
    }
    let nodeIndex = _.findIndex(newGridList, { _key: nodeId });
    if (type) {
      newGridList[nodeIndex].content = text;
      dispatch(editTask({ key: nodeId, content: text }, 3));
    } else {
      newGridList[nodeIndex].title = text;
      dispatch(editTask({ key: nodeId, title: text }, 3));
    }
    setNodeObj(newNodeObj);
    setGridList(newGridList);
  };
  const changeTaskContent = (value: string) => {
    if (value) {
      setContent(value);
    } else {
      setContent('<p>  </p>');
    }
  };
  const editTaskContent = async () => {
    let newNodeObj = _.cloneDeep(nodeObj);
    let newGridList = _.cloneDeep(gridList);
    let newTargetNode = _.cloneDeep(targetNode);
    newNodeObj[newTargetNode._key].content = content;
    let nodeIndex = _.findIndex(newGridList, { _key: newTargetNode._key });
    newGridList[nodeIndex].content = content;
    dispatch(editTask({ key: newTargetNode._key, content: content }, 3));
    dispatch(setMessage(true, '保存成功', 'success'));
    setNodeObj(newNodeObj);
    setGridList(newGridList);
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
    // getBookData(node._key);
    // setTargetNode(newTargetNode);
    // setNodeObj(newNodeObj);
    // setGridList(newGridList);
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
  return (
    <div className="book">
      <div className="book-left">
        {nodeObj && targetData && targetData._key ? (
          <MenuTree
            disabled={!editable}
            handleClickMoreButton={(node: any) => {
              // if (companyData[node._key].orgType === 1) {
              //   setMoreTop(node.y);
              //   setInfoDialogShow(true);
              // }
            }}
            ref={targetTreeRef}
            nodes={nodeObj}
            uncontrolled={false}
            showIcon={true}
            showMoreButton
            startId={targetData._key}
            backgroundColor="#f5f5f5"
            color="#333"
            hoverColor="#595959"
            defaultSelectedId={selectedId}
            handleClickNode={(node: any) => {
              chooseNode(node);
            }}
            handleAddChild={(selectedNode: any) => {
              addChildrenTask(selectedNode, 'child');
            }}
            handleAddNext={(selectedNode: any) => {
              addChildrenTask(selectedNode, 'next');
            }}
            handleChangeNodeText={(nodeId: string, text: string) => {
              editTaskText(nodeId, text);
            }}
            handleClickExpand={editContract}
            handleDeleteNode={(nodeId: any) => {
              setDeleteDialogShow(true);
            }}
            // itemHeight={32}
            // blockHeight={
            //   departmentRef.current ? departmentRef.current.offsetHeight : 0
            // }
          />
        ) : null}
      </div>
      <div className="book-right">
        <Editor
          editorHeight={'100%'}
          data={content}
          onChange={changeTaskContent}
          editable={editable}
          fullType={'big'}
        />
        {editable ? (
          <Button
            variant="contained"
            color="primary"
            className="book-editor-button"
            onClick={() => {
              editTaskContent();
              // dispatch(changeTaskInfoVisible(false));
            }}
            style={{ color: '#fff' }}
          >
            保存
          </Button>
        ) : null}
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
    </div>
  );
};
Book.defaultProps = {};
export default Book;
