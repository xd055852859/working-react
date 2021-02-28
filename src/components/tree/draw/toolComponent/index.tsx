import React, { FC, useState } from 'react';
import { Modal, Tree } from 'antd';
import { useEffect } from 'react';
import { Tools } from '../config/config';
const { TreeNode } = Tree;

interface ToolModalProps {
  visible: boolean;
  current: string[];
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const ToolModal: FC<ToolModalProps> = ({ visible, current, onCancel, onSubmit }) => {
  const [selectedTool, setSelectedTool] = useState<string[]>([]);

  useEffect(() => {
    if (current) {
      setSelectedTool(current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOk = (values: { [key: string]: any }) => {
    if (onSubmit) {
      onSubmit(selectedTool);
      localStorage.setItem('tool', JSON.stringify(selectedTool));
    }
  };

  // 渲染树状组件
  /* const renderTreeNodes = () => {
    console.log('渲染');

    return Tools.map((item: any) => {
      if (item.children) {
        return <TreeNode title={item.group} key={item.id} dataRef={item}></TreeNode>;
      }
      return <TreeNode key={item.key} title={item.group} />;
    });
  }; */

  const onCheck = (checkedKeys: any) => {
    setSelectedTool(checkedKeys);
  };

  const onSelect = (selectedKeys: any, info: any) => {
    console.log('onSelect', info);
  };

  return (
    <Modal title="图形库设置" visible={visible} okText="确定" cancelText="取消" onOk={handleOk} onCancel={onCancel}>
      <Tree checkable onCheck={onCheck} onSelect={onSelect} defaultCheckedKeys={selectedTool}>
        {Tools.map((item: any) => {
          return <TreeNode key={item.id} title={item.group} />;
        })}
      </Tree>
    </Modal>
  );
};

export default ToolModal;
