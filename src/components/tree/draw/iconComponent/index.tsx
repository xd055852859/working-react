import React, { FC } from 'react';
import './index.css';
import { IconList } from '../config/config';
import Button from '@material-ui/core/Button';

interface IconPageProps {
  onCancel: () => void;
  onSubmit: (data: { class: string; unicode: string }) => void;
}

const IconPage: FC<IconPageProps> = ({ onSubmit, onCancel }) => {
  const selectIcon = (item: any) => {
    onSubmit(item);
  };

  return (
    <>
      <div className="icon-title">
        <label className="title-name">选择字体图标</label>
        <Button size="small" onClick={onCancel}>
          返回
        </Button>
      </div>
      <div className="icon-box">
        <div className="icon" onClick={() => selectIcon(null)}>
          <span className="blank topology">空</span>
        </div>
        {IconList.map((item: any) => {
          return (
            <div className="icon" key={item.unicode}>
              <i className={`topology  ${item.class}`} onClick={() => selectIcon(item)}></i>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default IconPage;
