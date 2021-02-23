import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { changeGroupInfo } from '../../redux/actions/groupActions';
import { setMessage } from '../../redux/actions/commonActions';
import './groupTableDocument.css';
import api from '../../services/api';
import _ from 'lodash';
import Editor from '../../components/common/Editor';
import { group } from '../../redux/reducer/group';
interface GroupTableProps {}

const GroupTableDocument: React.FC<GroupTableProps> = (prop) => {
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const [groupDocument, setGroupDocument] = useState('');
  const [fileArr, setFileArr] = useState<any>([]);
  const [initState, setInitState] = useState(false);
  const documentRef: React.RefObject<any> = useRef();

  useEffect(() => {
    if (user && user._key) {
      getGroupDocument();
    }
  }, [user, groupKey]);
  useEffect(() => {
    if (initState) {
      formatHtml(documentRef.current);
    }
  }, [groupDocument, initState]);
  const getGroupDocument = async () => {
    let documentRes: any = await api.group.getGroupProperty(
      groupKey,
      'groupDocument'
    );
    if (documentRes.msg === 'OK') {
      setGroupDocument(documentRes.result);
    } else {
      if (documentRes.msg === '无该属性') {
        setGroupDocument('');
      } else {
        dispatch(setMessage(true, documentRes.msg, 'error'));
      }
    }
  };
  const changeGroupDocument = (value: string) => {
    setGroupDocument(value);
  };
  const fileStyle = (nodename: any, index: number) => {
    let nodeIndex = 0;
    let styleObj: any = {};
    switch (nodename) {
      case 'H1':
        nodeIndex = 0;
        break;
      case 'H2':
        nodeIndex = 1;
        break;
      case 'H3':
        nodeIndex = 2;
        break;
      case 'H4':
        nodeIndex = 3;
        break;
    }
    styleObj = {
      width: '100%',
      height: '30px',
      lineHeight: '30px',
      paddingLeft: nodeIndex * 25 + 'px',
      fontSize: 20 / (nodeIndex / 3 + 1) + 'px',
      boxSizing: 'border-box',
      cursor: 'pointer',
    };
    return styleObj;
  };
  const toTop = (top: any) => {
    documentRef.current.scrollTo(0, top);
  };
  const formatHtml = (wrapper: any) => {
    let arr = [];
    let nodeList = wrapper.getElementsByTagName('*');
    for (let i = 0, len = nodeList.length; i < len; i++) {
      let node = nodeList[i];
      let nodeName = nodeList[i].nodeName;
      let num = 30;
      if (
        (nodeName == 'H1' ||
          nodeName == 'H2' ||
          nodeName == 'H3' ||
          nodeName == 'H4') &&
        node.innerText != '\n'
      ) {
        num = num + 30;
        arr.push({
          nodename: nodeName,
          nodeText: node.innerText,
          nodeTop: node.offsetTop + num,
        });
      }
    }
    setFileArr(_.drop(arr, 4));
  };
  const saveFile = async () => {
    dispatch(
      changeGroupInfo(groupKey, {
        groupDocument: groupDocument,
      })
    );
    dispatch(setMessage(true, '保存群文档成功', 'success'));
  };
  return (
    <div className="groupDocument">
      <div className="groupDocument-container">
        <div className="groupDocument-title">目录</div>
        {fileArr.map((item: any, index: number) => {
          return (
            <div
              key={index}
              style={fileStyle(item.nodename, index)}
              onClick={() => {
                toTop(item.nodeTop);
              }}
            >
              {item.nodeText}
            </div>
          );
        })}
      </div>
      <div className="groupDocument-editor" ref={documentRef}>
        <Editor
          editorHeight={'100%'}
          data={groupDocument}
          onChange={changeGroupDocument}
          editable={true}
          editorState={true}
          setInit={() => {
            setInitState(true);
          }}
        />
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          saveFile();
        }}
        className="saveButton"
      >
        保存
      </Button>
    </div>
  );
};
export default GroupTableDocument;
