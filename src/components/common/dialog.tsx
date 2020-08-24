import React, { useEffect } from 'react';
import { Button } from '@material-ui/core';
import './dialog.css';
interface dialogProp {
  children: any;
  visible: boolean;
  dialogStyle: any;
  onOK:any;
  onClose: any;
  title: string;
}

const Dialog: React.FC<dialogProp> = (prop) => {
  const { children, visible, dialogStyle, onClose,onOK, title } = prop;
  return (
    <React.Fragment>
      {visible ? (
        <div className="mask" >
          <div className="dialog" style={dialogStyle} >
            <div>{title}</div>
            <React.Fragment>{children}</React.Fragment>
            <div>
              <Button variant="contained" color="primary" onClick={onOK}> 
                确认
              </Button>
              <Button variant="contained" onClick={onClose}>取消</Button>
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
  onOK:null,
  title: '',
};
export default Dialog;
