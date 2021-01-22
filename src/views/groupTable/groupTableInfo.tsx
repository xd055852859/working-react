import React, { useState, useEffect, useRef } from 'react';
import './groupTableTree.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { IconButton, Tooltip } from '@material-ui/core';
import {
  EditOutlined,
  SaveOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from '@material-ui/icons';

import { editTask } from '../../redux/actions/taskActions';
import { setMessage } from '../../redux/actions/commonActions';
import { useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import Editor from '../../components/common/Editor';
import Table from '../../components/tree/table';
import Link from '../../components/tree/link';
// import Draw from '../../components/common/draw';
import Markdown from '../../components/tree/markDown/Markdown';
import DrawView from '../../components/tree/DrawView';
import DrawEditor from '../../components/tree/Topology';
import Book from '../../components/tree/book';
import fullscreenSvg from '../../assets/svg/fullscreen.svg';
import DropMenu from '../../components/common/dropMenu';

import moment from 'moment';
import _ from 'lodash';
import api from '../../services/api';
interface GroupTableTreeInfoProps {
  targetItem?: any;
  changeGridList?: any;
  fullType: string;
  changeFullType: Function;
  editInfoType: string;
}

const GroupTableTreeInfo: React.FC<GroupTableTreeInfoProps> = (props) => {
  const {
    targetItem,
    changeGridList,
    fullType,
    changeFullType,
    editInfoType,
  } = props;
  const dispatch = useDispatch();
  const [content, setContent] = useState<any>('');
  const [editable, setEditable] = useState<any>(false);
  const [targetNode, setTargetNode] = useState<any>(null);
  const containerRef: React.RefObject<any> = useRef();

  useEffect(() => {
    if (targetItem) {
      if (targetItem.type === 10) {
        if (targetItem.content) {
          setContent(targetItem.content);
        } else {
          setContent('<p>备注信息:</p>');
        }
      }
      setTargetNode(targetItem);
    }
  }, [targetItem]);

  useEffect(() => {
    if (editInfoType === '新增') {
      setEditable(true);
    }
  }, [editInfoType]);
  const changeTaskContent = (value: any) => {
    let newTargetNode = _.cloneDeep(targetNode);
    if (value) {
      setContent(value);
    } else if (newTargetNode.type === 10) {
      setContent('<p>备注信息:</p>');
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
      // console.log(title, cover, content);
      return title;
    }
  };
  const changeContent = async (value?: string, title?: string) => {
    let newTargetNode = _.cloneDeep(targetNode);
    let newContent: any = '';
    let linkUrl = '';
    if (newTargetNode.type === 14 && value) {
      if (value.includes('http://') || value.includes('https://')) {
        linkUrl = value;
      } else {
        linkUrl = `https://${value}`;
      }
      let urlRes: any = await api.auth.getUrlIcon(linkUrl);
      if (urlRes.msg === 'OK') {
        dispatch(
          editTask(
            {
              key: newTargetNode._key,
              extraData: { url: value, icon: urlRes.icon },
            },
            3
          )
        );

        if (urlRes.icon) {
          newTargetNode.extraData = { url: value, icon: urlRes.icon };
        } else {
          newTargetNode.extraData = { url: value };
        }
        dispatch(setMessage(true, '保存成功', 'success'));
        changeGridList(newTargetNode);
      } else {
        dispatch(setMessage(true, urlRes.msg, 'error'));
      }
    } else {
      let newTitle: any = newTargetNode.title;
      if (title) {
        newTitle = title;
        newContent = value;
      }
      if (newTargetNode.type === 13) {
        newTitle = saveMarkDown();
        newContent = content;
      }
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
    if (
      newTargetNode.type === 10 ||
      newTargetNode.type === 11 ||
      newTargetNode.type === 13
    ) {
      setEditable(false);
    }
  };
  return (
    <React.Fragment>
      {targetNode ? (
        <React.Fragment>
          <div className="groupTableTreeInfo-container" ref={containerRef}>
            {containerRef.current &&
            containerRef.current.offsetHeight &&
            targetNode.type === 10 ? (
              <React.Fragment>
                <Editor
                  editorHeight={containerRef.current.offsetHeight}
                  data={content}
                  onChange={changeTaskContent}
                  editable={editable}
                  fullType={fullType}
                />
              </React.Fragment>
            ) : null}
            {targetNode.type === 11 ? (
              editable ? (
                <DrawEditor
                  //@ts-ignore
                  targetNode={targetNode}
                  onChange={changeContent}
                />
              ) : (
                <DrawView
                  //@ts-ignore
                  targetNode={targetNode}
                  // onChange={changeContent}
                />
              )
            ) : null}
            {targetNode.type === 12 ? <Table node={targetNode} /> : null}
            {targetNode.type === 13 ? (
              <Markdown
                targetData={targetNode}
                onChange={changeTaskContent}
                editable={editable}
              />
            ) : null}
            {targetNode.type === 14 ? (
              <Link targetData={targetNode} onChange={changeContent} />
            ) : null}
            {targetNode.type === 15 ? (
              <Book
                targetData={targetNode}
                onChange={changeContent}
                fullType={fullType}
              />
            ) : null}
          </div>
          {(targetNode.type !== 12 &&
            targetNode.type !== 14 &&
            targetNode.type !== 11) ||
          (targetNode.type === 11 && !editable) ? (
            <div
              className="groupTableTreeInfo-button"
              style={{ top: fullType === 'small' ? '10px' : '5px' }}
            >
              <IconButton
                color="primary"
                component="span"
                onClick={() => {
                  if (
                    targetNode.type === 10 ||
                    targetNode.type === 13 ||
                    targetNode.type === 11
                  ) {
                    if (!editable) {
                      setEditable(true);
                    } else {
                      changeContent();
                    }
                  }
                }}
              >
                {targetNode.type === 10 ||
                targetNode.type === 13 ||
                targetNode.type === 11 ? (
                  editable ? (
                    <Tooltip title="保存">
                      <SaveOutlined
                        style={{
                          width: '30px',
                          height: '30px',
                        }}
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip title="编辑">
                      <EditOutlined
                        style={{
                          width: '30px',
                          height: '30px',
                        }}
                      />
                    </Tooltip>
                  )
                ) : (
                  ''
                )}
              </IconButton>
            </div>
          ) : null}
          <div
            className="groupTableTree-full-img"
            style={{
              top:
                fullType === 'small'
                  ? '10px'
                  : targetNode.type !== 12 && targetNode.type !== 11
                  ? '5px'
                  : targetNode.type === 11
                  ? editable
                    ? '0px'
                    : '5px'
                  : '-10px',

              right:
                fullType === 'big'
                  ? targetNode.type === 12
                    ? '70px'
                    : '5px'
                  : targetNode.type === 11 && editable
                  ? '80px'
                  : '13px',
            }}
          >
            <IconButton
              color="primary"
              component="span"
              onClick={() => {
                changeFullType(fullType);
              }}
            >
              <Tooltip title={fullType === 'small' ? '全屏' : '缩小'}>
                {fullType === 'small' ? (
                  <FullscreenOutlined
                    style={{
                      width: '30px',
                      height: '30px',
                    }}
                  />
                ) : (
                  <FullscreenExitOutlined
                    style={{
                      width: '30px',
                      height: '30px',
                    }}
                  />
                )}
              </Tooltip>
            </IconButton>
          </div>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};
GroupTableTreeInfo.defaultProps = {};
export default GroupTableTreeInfo;
