import React, { useState, useEffect } from 'react';
import './groupTableTreeItem.css';
import _ from 'lodash';
interface GroupTableTreeItemProps {
  taskDetail: any;
  editTargetTask: any;
  setTypeDialogShow: any;
}

const GroupTableTreeItem: React.FC<GroupTableTreeItemProps> = (props) => {
  const { taskDetail, editTargetTask, setTypeDialogShow } = props;
  const [taskItem, setTaskItem] = useState<any>({});

  useEffect(() => {
    // 用户已登录
    if (taskDetail) {
      setTaskItem(_.cloneDeep(taskDetail));
    }
  }, [taskDetail]);
  const changeType = (type: number) => {
    let newTaskItem = _.cloneDeep(taskItem);
    // taskDetail.finishPercent = finishPercent !== 0 ? 0 : 1;
    newTaskItem.type = type === 1 ? 6 : 1;
    editTargetTask(newTaskItem, 1);
  };
  return (
    <div className="groupTableTreeItem">
      <div className="groupTableTreeItem-item">
        <div
          className="groupTableTreeItem-title"
          onMouseEnter={() => {
            setTypeDialogShow(1);
          }}
        >
          新建子节点
        </div>
      </div>
      <div
        className="groupTableTreeItem-item"
        onMouseEnter={() => {
          setTypeDialogShow(2);
        }}
      >
        <div className="groupTableTreeItem-title">新建节点</div>
      </div>
      {/* <div
        className="groupTableTreeItem-item"
        onMouseEnter={() => {
          setTypeDialogShow(0);
        }}
      >
        <EditOutlined />
        <div
          className="groupTableTreeItem-title"
          onMouseEnter={() => {
            setTypeDialogShow(0);
          }}
        >
          节点重命名
        </div>
      </div>
      <div className="groupTableTreeItem-item">
        <DeleteOutline />
        <div
          className="groupTableTreeItem-title"
          onMouseEnter={() => {
            setTypeDialogShow(0);
          }}
        >
          删除节点
        </div>
      </div> */}
    </div>
  );
};
GroupTableTreeItem.defaultProps = {};
export default GroupTableTreeItem;
