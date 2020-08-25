import React, { useEffect } from 'react';
import { Button } from '@material-ui/core';
import './dialog.css';
interface dialogProp {
  children: any;
  visible: boolean;
  dialogStyle: any;
  onOK: any;
  onClose: any;
  title: string;
}

const Dialog: React.FC<dialogProp> = (prop) => {
  const { children, visible, dialogStyle, onClose, onOK, title } = prop;
  return (
    <React.Fragment>
      {visible ? (
        <div className="mask">
          <div className="dialog" style={dialogStyle}>
            <div className="dialog-title">{title}</div>
            <div className="dialog-info">
              <div className="dialog-container">{children}</div>
              <div className="dialog-button">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onOK}
                  style={{ marginRight: '10px' }}
                >
                  确认
                </Button>
                <Button variant="contained" onClick={onClose}>
                  取消
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
};
Dialog.defaultProps = {
  children: null,
  visible: false,
  dialogStyle: null,
  onClose: null,
  onOK: null,
  title: '',
};
export default Dialog;
