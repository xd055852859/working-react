import React, { useEffect } from 'react';
import { Button } from '@material-ui/core';

import './dialog.css';
interface dialogProp {
  children: any;
  visible: boolean;
  dialogStyle: any;
  onOK?: any;
  onClose?: any;
  title?: string;
  footer?: boolean;
}

const Dialog: React.FC<dialogProp> = (prop) => {
  const { children, visible, dialogStyle, onClose, onOK, title, footer } = prop;

  return (
    <React.Fragment>
      {visible ? (
        <div className="mask">
          <div className="dialog" style={dialogStyle}>
            {title ? <div className="dialog-title">{title}</div> : null}
            <div className="dialog-info" style={!title?{height:'100%'}:{}}>
              <div className="dialog-container">{children}</div>
              {footer ? (
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
              ) : null}
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
  footer: true,
};
export default Dialog;
