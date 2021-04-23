import React, { useState, useEffect,useRef } from 'react';
import './book.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import Loadable from 'react-loadable';
import { Button, Tooltip } from 'antd';
import api from '../../services/api';
import _ from 'lodash';
import IconFont from '../common/iconFont';

import { setMessage } from '../../redux/actions/commonActions';

const BookView = Loadable({
  loader: () => import('./book/bookView'),
  loading: () => null,
});
const BookEditor = Loadable({
  loader: () => import('./book/bookEditor'),
  loading: () => null,
});
interface BookProps {
  targetData: any;
  onChange: Function;
  fullType?: string;
}

const Book: React.FC<BookProps> = (props) => {
  const { targetData, onChange, fullType } = props;
  const dispatch = useDispatch();
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const [gridList, setGridList] = useState<any>([]);
  const [nodeObj, setNodeObj] = useState<any>(null);
  const [editable, setEditable] = useState<any>(false);
  const [targetNode, setTargetNode] = useState<any>(null);
  const [selectId, setSelectId] = useState<any>(null);
let unDistory = useRef<any>(null);   unDistory.current=true;
  useEffect(() => {
    if (targetData) {
      getBookData(targetData._key);
    }
    return () => {
      // unDistory.current = false;
    };
  }, [targetData]);
  const getBookData = async (key: string) => {
    let bookRes: any = await api.task.getTaskTreeList(
      groupInfo.taskTreeRootCardKey,
      key
    );
    if (unDistory.current) {
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
        // if (newNodeObj[key].content) {
        //   setContent(newNodeObj[key].content);
        // } else {
        //   setContent('<p>标题</p>');
        // }
        // setSelectedId(newNodeObj[key]._key);
        setGridList(newGridList);
        setNodeObj(newNodeObj);
        setSelectId(key);
      } else {
        dispatch(setMessage(true, bookRes.msg, 'error'));
      }
    }
  };
  const changeSelect = (node: any) => {
    setSelectId(node._key);
    setEditable(true);
  };
  return (
    <React.Fragment>
      {editable && nodeObj && gridList && targetData ? (
        <BookEditor
          nodeObj={nodeObj}
          gridList={gridList}
          targetData={targetData}
          selectId={selectId}
          setSelectId={setSelectId}
          onChange={onChange}
          setGridList={setGridList}
          setNodeObj={setNodeObj}
        />
      ) : (
        <BookView
          nodeObj={nodeObj}
          gridList={gridList}
          targetData={targetData}
          changeSelect={changeSelect}
        />
      )}
      <div className="book-button" style={{ top: '0px', right: '55px' }}>
        <Button
          icon={
            editable ? (
              <Tooltip title="目录">
                <IconFont type="icon-fengmian" />
              </Tooltip>
            ) : (
              <Tooltip title="内页">
                <IconFont type="icon-dir" />
              </Tooltip>
            )
          }
          color="primary"
          onClick={() => {
            setEditable(!editable);
          }}
          style={{ border: '0px', marginTop: '10px' }}
        />
      </div>
    </React.Fragment>
  );
};
Book.defaultProps = {};
export default Book;
