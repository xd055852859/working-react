import React, { useState, useEffect } from 'react';
import './fileList.css';
import './../../views/groupTable/groupTableTree.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import api from '../../services/api';
import _ from 'lodash';

import { setMessage, setFileInfo } from '../../redux/actions/commonActions';

import linkIconSvg from '../../assets/svg/linkIcon.svg';
interface FileListProps {
  groupKey: string;
  type: string;
  fileHeight?: number;
  fileItemWidth?: string | number;
}

const FileList: React.FC<FileListProps> = (props) => {
  const { groupKey, type, fileHeight, fileItemWidth } = props;
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const fileInfo = useTypedSelector((state) => state.common.fileInfo);
  const theme = useTypedSelector((state) => state.auth.theme);
  const [filePage, setFilePage] = useState(0);
  const [total, setTotal] = useState(0);
  const [fileList, setFileList] = useState<any>([]);
  const [targetIndex, setTargetIndex] = useState<any>(null);

  const limit = 30;
  const iconArray = [
    'https://cdn-icare.qingtime.cn/FpCB_dxjQGMt0lBUP-PwBXAVkNHN',
    'https://cdn-icare.qingtime.cn/FgKrqQB-8wqIouNRWzTzCe2A12FK',
    'https://cdn-icare.qingtime.cn/FjFqTs8ZmMtsL1X8LGZEVSV9WSRW',
    'https://cdn-icare.qingtime.cn/FjO6YNYHntTHrgS_3hR2kZiID8rd',
    linkIconSvg,
    'https://cdn-icare.qingtime.cn/Fl8r0nP1GTxNzPGc3LquP6AnUT6y',
  ];

  useEffect(() => {
    if (user) {
      getFileList(0);
    }
  }, [user, type]);
  useEffect(() => {
    if (fileInfo) {
      let newFileList = _.cloneDeep(fileList);
      let index = _.findIndex(newFileList, { _key: fileInfo._key });
      if (index !== -1) {
        newFileList[index] = fileInfo;
        setFileList(newFileList);
      }
    }
  }, [fileInfo]);

  const getFileList = async (page: number) => {
    let newFileList: any = [];
    let fileRes: any = null;
    if (page === 0) {
      setFileList([]);
    } else {
      newFileList = _.cloneDeep(fileList);
    }
    if (type === '最近') {
      fileRes = await api.task.getVisitCardTime(groupKey, page, limit);
    } else if (type === '收藏') {
      fileRes = await api.task.getCreateCardTime(groupKey, page, limit);
    }
    if (fileRes.msg === 'OK') {
      newFileList = fileRes.result.filter((item) => {
        console.log(item);
        return item.type !== 15;
      });
      setFileList(newFileList);
      setTotal(fileRes.totalNumber);
    } else {
      dispatch(setMessage(true, fileRes.msg, 'error'));
    }
  };
  const scrollFileListLoading = async (e: any) => {
    let page = filePage;
    //文档内容实际高度（包括超出视窗的溢出部分）
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let height = e.target.clientHeight;
    if (height + scrollTop >= scrollHeight && fileList.length < total) {
      page = page + 1;
      setFilePage(page);
      getFileList(page);
    }
  };

  return (
    <div
      className="fileList"
      onScroll={scrollFileListLoading}
      style={fileHeight ? { height: fileHeight } : {}}
    >
      {fileList.map((item: any, index: number) => {
        return (
          <div
            className="file-container"
            key={'file' + index}
            onClick={() => {
              dispatch(setFileInfo(item, true));
              setTargetIndex(index);
            }}
          >
            <div className="file-container-img">
              <img src={iconArray[item.type - 10]} alt="" />
            </div>
            <div className="file-container-title">
              <div>{item.title}</div>
              {!groupKey ? <div>{item.groupName}</div> : null}
            </div>
            <div className="file-container-time">
              {type === '最近'
                ? moment(parseInt(item.visitTime)).fromNow()
                : moment(parseInt(item.createTime)).fromNow()}
            </div>
          </div>
        );
      })}
    </div>
  );
};
FileList.defaultProps = { fileItemWidth: 270 };
export default FileList;
