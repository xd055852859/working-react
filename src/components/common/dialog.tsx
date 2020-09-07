import React, { useEffect } from 'react';
import { Button } from '@material-ui/core';
import closePng from '../../assets/img/close.png';
import './dialog.css';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
interface dialogProp {
  children: any;
  visible: boolean;
  dialogStyle: any;
  onOK?: any;
  onClose?: any;
  title?: string;
  footer?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      backgroundColor: '#17B881',
      padding: '6 26px',
      color: '#fff',
    },
  })
);
const Dialog: React.FC<dialogProp> = (prop) => {
  const { children, visible, dialogStyle, onClose, onOK, title, footer } = prop;
  const classes = useStyles();

  return (
    <React.Fragment>
      {visible ? (
        <div className="mask">
          <div className="dialog" style={dialogStyle}>
            {title ? <div className="dialog-title">{title}</div> : null}
            <img src={closePng} className="dialog-close" onClick={onClose} />
            <div
              className="dialog-info"
              style={!title ? { height: '100%' } : {}}
            >
              <div
                className="dialog-container"
                style={!footer ? { height: '100%' } : {}}
              >
                {children}
              </div>
              {footer ? (
                <div className="dialog-button">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onOK}
                    style={{ marginRight: '10px' }}
                    className={classes.button}
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
