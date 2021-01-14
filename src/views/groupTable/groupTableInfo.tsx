import React, { useState, useEffect, useRef } from 'react';
import './groupTableTree.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { editTask } from '../../redux/actions/taskActions';
import { setMessage } from '../../redux/actions/commonActions';
import { useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import Editor from '../../components/common/Editor';
import Table from '../../components/common/table';
import Markdown from '../../components/markDown/Markdown';

import DropMenu from '../../components/common/dropMenu';

import moment from 'moment';
import _ from 'lodash';
interface GroupTableTreeInfoProps {
  targetItem?: any;
  changeGridList?: any;
}

const GroupTableTreeInfo: React.FC<GroupTableTreeInfoProps> = (props) => {
  const { targetItem, changeGridList } = props;
  const dispatch = useDispatch();
  const [content, setContent] = useState<any>('');
  const [editable, setEditable] = useState<any>(false);
  const containerRef: React.RefObject<any> = useRef();

  useEffect(() => {
    if (targetItem.type === 10) {
      if (targetItem.content) {
        setContent(targetItem.content);
      } else {
        setContent('<p>备注信息:</p>');
      }
    }
  }, [targetItem]);
  const changeTaskContent = (value: any) => {
    console.log(value);
    if (value) {
      setContent(value);
    } else if (targetItem.type === 10) {
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
  const changeContent = async () => {
    let newTargetItem = _.cloneDeep(targetItem);
    let title: any = newTargetItem.title;
    if (targetItem.type === 13) {
      title = saveMarkDown();
    }
    await dispatch(
      editTask({ key: targetItem._key, content: content, title: title }, 3)
    );
    newTargetItem.content = content;
    newTargetItem.title = title;
    dispatch(setMessage(true, '保存成功', 'success'));
    changeGridList(newTargetItem);
    if (targetItem.type === 10) {
      setEditable(false);
    }
  };
  return (
    <React.Fragment>
      <div className="groupTableTreeInfo-container" ref={containerRef}>
        {containerRef.current &&
        containerRef.current.offsetHeight &&
        targetItem.type === 10 ? (
          <React.Fragment>
            <Editor
              editorHeight={containerRef.current.offsetHeight}
              data={content}
              onChange={changeTaskContent}
              editable={editable}
              fullType={'small'}
            />
          </React.Fragment>
        ) : null}
        {targetItem.type === 12 ? <Table node={targetItem} /> : null}
        {targetItem.type === 13 ? (
          <Markdown
            targetData={targetItem}
            onChange={changeTaskContent}
            editable={editable}
          />
        ) : null}
      </div>
      {targetItem.type !== 12 ? (
        <div className="groupTableTreeInfo-button">
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (
                !editable &&
                (targetItem.type === 10 || targetItem.type === 13)
              ) {
                setEditable(true);
              } else {
                changeContent();
              }
            }}
            style={{ color: '#fff' }}
          >
            {targetItem.type === 10 || targetItem.type === 13
              ? editable
                ? '保存'
                : '编辑'
              : ''}
          </Button>
        </div>
      ) : null}
    </React.Fragment>
  );
};
GroupTableTreeInfo.defaultProps = {};
export default GroupTableTreeInfo;
