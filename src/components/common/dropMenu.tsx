import React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import './dropMenu.css';
interface dropMenuProp {
  children: any;
  visible: boolean;
  dropStyle: any;
  onClose?: any;
  title?: string | null;
}

const DropMenu: React.FC<dropMenuProp> = (prop) => {
  const { children, visible, dropStyle, onClose, title } = prop;
  return (
    <React.Fragment>
      {visible ? (
        <ClickAwayListener onClickAway={onClose ? onClose : ()=>{}}>
          <div className="dropMenu" style={dropStyle}>
            {title ? <div className="dropMenu-title">{title}</div> : null}
            <div
              className="dropMenu-info"
              style={{ height: title ? 'calc(100% - 53px)' : '100%' }}
            >
              {children}
            </div>
          </div>
        </ClickAwayListener>
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
