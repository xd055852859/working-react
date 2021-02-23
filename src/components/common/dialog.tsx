import React from 'react';
import { Button } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
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
  showMask?: boolean;
  closePngState?: boolean;
  unOut?: boolean;
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
  const {
    children,
    visible,
    dialogStyle,
    onClose,
    onOK,
    title,
    footer,
    showMask,
    closePngState,
    unOut,
  } = prop;
  const classes = useStyles();
  const dialog = () => {
    return (
      <div
        className="dialog animate__animated animate__slideInRight"
        style={dialogStyle}
        id="dialog"
      >
        {title ? (
          <div className="dialog-title">
            {title}
            {!showMask && !closePngState ? (
              <img
                src={closePng}
                onClick={onClose}
                style={{ height: '25px', width: '25px', cursor: 'pointer' }}
              />
            ) : null}
          </div>
        ) : null}
        {showMask ? (
          <img
            src={closePng}
            className="dialog-close"
            onClick={onClose}
            style={title ? { top: '17px' } : {}}
          />
        ) : null}
        <div className="dialog-info" style={!title ? { height: '100%' } : {}}>
          <div
            className="dialog-container"
            style={
              !footer
                ? { height: '100%' }
                : {
                    overflow: 'auto',
                  }
            }
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
    );
  };
  return (
    <React.Fragment>
      {visible ? (
        showMask ? (
          <div className="mask">{dialog()}</div>
        ) : (
          <ClickAwayListener
            onClickAway={() => {
              if (unOut) {
                // const element: any = document.querySelector('#dialog');
                // console.log(element);
                // element.classList.remove('animate__slideInRight');
                // element.classList.add('animate__slideInLeft');
                onClose();
              }
            }}
          >
            {dialog()}
          </ClickAwayListener>
        )
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
  showMask: true,
  unOut: true,
};
export default Dialog;
