import React, { useEffect } from 'react';
import './dropMenu.css';
interface dropMenuProp {
  children: any;
  visible: boolean;
  dropStyle: any;
  onClose: any;
  title?: string | null;
}

const DropMenu: React.FC<dropMenuProp> = (prop) => {
  const { children, visible, dropStyle, onClose, title } = prop;
  return (
    <React.Fragment>
      {visible ? (
        <div className="dropMenu" style={dropStyle} onMouseLeave={onClose}>
          {title ? <div className="dropMenu-title">{title}</div> : null}
          <div className="dropMenu-info">{children}</div>
        </div>
      ) : null}
    </React.Fragment>
  );
};
DropMenu.defaultProps = {
  children: null,
  visible: false,
  dropStyle: null,
  onClose: null,
  title: null,
};
export default DropMenu;
