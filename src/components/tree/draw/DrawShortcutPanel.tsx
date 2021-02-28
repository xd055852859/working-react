import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    previewWrapper: {
      position: 'absolute',
      top: '16px',
      right: '8px',
      bottom: '16px',
      width: '335px',
      backgroundColor: '#FFF',
      boxShadow: '0px 6px 9px 0px rgba(0, 0, 0, 0.18)',
      borderRadius: '12px',
      zIndex: 999,
    },
    wrapper: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      padding: '0 15px',
      borderRadius: '0 0 12px 12px',
      flex: 1,
      overflow: 'auto',
      '&::-webkit-scrollbar': {
        width: '0.4em',
      },
      '&::-webkit-scrollbar-track': {
        '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#949596',
        outline: '1px solid slategrey',
      },
    },
    space: {
      flexGrow: 1,
    },
    gutters: {
      paddingLeft: '12px',
      paddingRight: '12px',
      borderBottom: '1px solid #E1E1E5',
    },
    title: {
      margin: '15px 0',
      color: '#424242',
    },
  }),
);

interface Props {
  visible: boolean;
  handleClose: Function;
}
export default function DrawShortcutPanel({ visible, handleClose }: Props) {
  const classes = useStyles();

  function createData(name: string, content: string) {
    return { name, content };
  }

  const isMac = /macintosh|mac os x/i.test(navigator.userAgent);

  const rows = [
    createData('拖动视图', `${isMac ? 'Option' : 'Ctrl'} + 鼠标左键拖动`),
    createData('选中节点', '鼠标单击'),
    createData('复制节点', `${isMac ? '⌘' : 'Ctrl'} + C`),
    createData('剪切节点', `${isMac ? '⌘' : 'Ctrl'} + X`),
    createData('粘贴节点', `${isMac ? '⌘' : 'Ctrl'} + V`),
    createData('删除节点', 'Delete'),
    createData('向上调整', 'shift + ↑'),
    createData('向下调整', 'shift + ↓'),
    createData('画布缩放', 'Ctrl + 鼠标滚轮'),
  ];

  return (
    <Slide direction="left" in={visible} mountOnEnter unmountOnExit>
      <div className={classes.previewWrapper}>
        <div className={classes.wrapper}>
          <Toolbar className={classes.gutters}>
            <Typography variant="h6">快捷键</Typography>
            <div className={classes.space}></div>
            <Tooltip title="关闭" placement="top">
              <IconButton onClick={() => handleClose()}>
                <CloseOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
          <div className={classes.content}>
            <Table>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.content}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Slide>
  );
}
