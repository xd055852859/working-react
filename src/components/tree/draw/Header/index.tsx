import React, { useState, useEffect } from 'react';

import * as FileSaver from 'file-saver';
import './index.css';
import { useHistory, useLocation } from 'react-router-dom';
import { setMessage } from '../../../../redux/actions/commonActions';
// import { addDraw, editArticleSaveStatus, editDraw } from '../../../../redux/actions/articleActions';
import { useDispatch, useSelector } from 'react-redux';
import { getSearchParamValue } from '../../../../services/util';
import { uploadImage, dataURLtoFile } from '../../../../services/uploadImage';
// import api from '../../../util/api';
import { Topology } from '@topology/core';
// import { ArticleDetail } from '../../../interfaces/Article';
import { FontProps } from '../../../../interfaces/Line';
import { ChromePicker } from 'react-color';
import { selectType } from '../../Topology';
import {
  Tooltip,
  Button,
  ButtonGroup,
  MenuItem,
  ListItemText,
  List,
  ListItem,
  IconButton,
  TextField,
} from '@material-ui/core';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatColorTextIcon from '@material-ui/icons/FormatColorText';
import LockOpenOutlinedIcon from '@material-ui/icons/LockOpenOutlined';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import FormatColorFillOutlinedIcon from '@material-ui/icons/FormatColorFillOutlined';
import { InputBase } from '@material-ui/core';
interface HeaderProps {
  node: any;
  canvas: Topology;
  data: selectType;
  embed?: boolean;
  showLeftTool: Function;
  right: boolean;
  showRight: (value: boolean) => void;
  propsChange: (value: any) => void;
  onChange?: Function;
  changeEditable?: Function;
}

const initFont: FontProps = {
  color: '#222',
  fontFamily:
    '"Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial',
  fontSize: 12,
  lineHeight: 1.5,
  fontStyle: 'normal',
  fontWeight: 'normal',
  textAlign: 'center',
  textBaseline: 'middle',
};

const Header = ({
  node,
  canvas,
  data,
  embed = false,
  showLeftTool,
  right,
  showRight,
  propsChange,
  onChange,
  changeEditable,
}: HeaderProps) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  // const appKey = getSearchParamValue(location.search, 'appKey');
  // const article = useSelector((state: any) => state.article.article);
  // const saveStatus = useSelector((state: any) => state.article.saveStatus);
  // const styleType = (article as any)?.styleType;
  let styleType: any = {};
  // 标题
  const uploadToken = useSelector((state: any) => state.auth.uploadToken);
  // 标题
  const [title, settitle] = useState('新文档');
  const [editTitle, setEditTitle] = useState(false);
  // 是否处于锁定状态
  const [isLock, setIsLock] = useState(false);
  // 缩放的基数
  const [scaleNumber, setScaleNumber] = useState(1);
  // 颜色选择器
  const [displayColorPicker, setDisplayColorPicker] = useState({
    show: false,
    type: 1,
  });

  const {
    lineWidth = 1,
    strokeStyle = '#111111',
    dash = 0,
    fromArrow = 'null',
    toArrow = 'triangleSolid',
    // font = initFont,
    fillStyle,
    name = 'line',
    fontSize = 12,
    fontColor = '#222222',
    fontStyle = 'normal',
    textBaseline = 'middle',
    textAlign = 'center',
    fontWeight = 'normal',
  } = data.pen || ({} as any);
  const [backGrid, setBackGrid] = useState<boolean>(true);
  // 背景 颜色
  // const [backGround, setBackGround] = useState('');

  const [nodeBackGround, setNodeBackGround] = useState('');

  const [tool, setTool] = useState(true);

  useEffect(() => {
    setBackGrid(!!canvas.data.grid);
  }, [canvas.data.pens, canvas.data.grid]);

  useEffect(() => {
    if (node) {
      settitle(node.title);
    }
  }, [node]);

  useEffect(() => {
    showLeftTool(tool);
  }, [showLeftTool, tool]);

  // useEffect(() => {
  //   if (saveStatus === -1 && canvas?.activeLayer.pens.length === 0) {
  //     onHandleSelect({ key: 'save' });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [saveStatus, canvas?.activeLayer.pens.length]);

  useEffect(() => {
    if (uploadToken && canvas) {
      const pasteHandle = (e: any) => {
        let items = e.clipboardData && e.clipboardData.items;

        var file = null;
        if (items && items.length) {
          // 检索剪切板items
          for (var i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              file = items[i].getAsFile();
              break;
            }
          }
          if (file) {
            var reader = new FileReader();
            reader.onloadend = async (event: any) => {
              var imgBase64 = event.target.result; //    event.target.result.split(",")  [0]=data:image/png;base64  [1]=data
              let fileData = dataURLtoFile(imgBase64);
              uploadImage(uploadToken, fileData, false, (url: any) => {
                if (canvas.clipboard && canvas.clipboard.pens) {
                  canvas.clipboard.pens = [];
                }
                canvas.addNode({
                  name: 'image', // registerNode的第一个参数。
                  image: url,
                  lineWidth: 2,
                  rect: {
                    x: 300,
                    y: 200,
                    width: 150,
                    height: 150,
                  },
                });

                canvas.updateProps();
              });
            };
            reader.readAsDataURL(file);
          }
        }
      };
      document.addEventListener('paste', pasteHandle, true);
      return () => {
        document.removeEventListener('paste', pasteHandle, true);
      };
    }
  }, [canvas, uploadToken]);

  const onHandleImportJson = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (event) => {
      const elem: any = event.srcElement || event.target;
      if (elem.files && elem.files[0]) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const text = e.target.result + '';
          try {
            const data = JSON.parse(text);
            canvas.open(data);
          } catch (e) {
            return false;
          } finally {
          }
        };
        reader.readAsText(elem.files[0]);
      }
    };
    input.click();
  };

  /**
   * 保存为svg
   */

  const onHandleSaveToSvg = () => {
    //@ts-ignore
    const C2S = window.C2S;
    const ctx = new C2S(canvas.canvas.width + 300, canvas.canvas.height + 300);
    if (canvas.data.pens) {
      for (const item of canvas.data.pens) {
        item.render(ctx);
      }
    }
    let mySerializedSVG = ctx.getSerializedSvg();
    mySerializedSVG = mySerializedSVG.replace(
      '<defs/>',
      `<defs>
      <style type="text/css">
        @font-face {
          font-family: 'topology';
          src: url('http://at.alicdn.com/t/font_1331132_h688rvffmbc.ttf?t=1569311680797') format('truetype');
        }
      </style>
    </defs>`
    );
    mySerializedSVG = mySerializedSVG.replace(/--le5le--/g, '&#x');
    const urlObject = window.URL || window;
    const export_blob = new Blob([mySerializedSVG]);
    const url = urlObject.createObjectURL(export_blob);
    const a = document.createElement('a');
    a.setAttribute('download', 'le5le.topology.svg');
    a.setAttribute('href', url);
    const evt = document.createEvent('MouseEvents');
    evt.initEvent('click', true, true);
    a.dispatchEvent(evt);
  };

  /**
   * 选中menu时, 触发的函数
   */

  const onHandleSelect = async (data: any) => {
    // console.log(data)
    switch (data.key) {
      case 'create_new':
        canvas.open({ nodes: [], lines: [] });
        break;
      case 'import_json':
        onHandleImportJson();
        break;
      case 'save': {
        if (!title) {
          dispatch(setMessage(true, '请输入绘图标题', 'warning'));
          return;
        }

        if (canvas.pureData().pens.length === 0) {
          dispatch(setMessage(true, '请添加图形,再保存', 'warning'));
          return;
        }
        if (onChange) {
          canvas.data.grid = false;
          onChange(JSON.stringify(canvas.data), title);
        }
        // dispatch(editArticleSaveStatus(-1));

        // const overwriteThumbnail = article && article.thumbnail ? true : false;

        // const res = canvas.toImage();

        // let file;

        // if (overwriteThumbnail) {
        //   file = dataURLtoFile(res, article.thumbnail.substr(article.thumbnail.lastIndexOf('/') + 1));
        // } else {
        //   file = dataURLtoFile(res, `${title || '无标题'}.png`);
        // }

        // let uptoken;
        // if (overwriteThumbnail) {
        //   const res: any = await api.auth.getUptokenOverWrite(
        //     article.thumbnail.substr(article.thumbnail.lastIndexOf('/') + 1),
        //   );
        //   if (res.statusCode === '200') {
        //     uptoken = res.result;
        //   } else {
        //     alert('获取七牛TOKEN失败');
        //   }
        // } else {
        //   uptoken = qiniuToken;
        // }
        // uploadImage(uptoken, file, overwriteThumbnail, function (url: any) {
        //   // 更新
        //   if (article && article._key) {
        //     canvas.data.grid = false;
        //     dispatch(
        //       editDraw(
        //         article._key,
        //         title,
        //         article.type,
        //         (JSON.stringify(canvas.pureData()) as unknown) as ArticleDetail,
        //         undefined,
        //         url,
        //         undefined,
        //         styleType,
        //       ),
        //     );
        //   } else {
        //     // 新增
        //     if (appKey) {
        //       dispatch(
        //         addDraw(
        //           title,
        //           'doc',
        //           (JSON.stringify(canvas.pureData()) as unknown) as ArticleDetail,
        //           appKey,
        //           url,
        //           styleType,
        //         ),
        //       );
        //     }
        //   }
        // });
        break;
      }
      case 'save_json':
        FileSaver.saveAs(
          new Blob([JSON.stringify(canvas.pureData())], {
            type: 'text/plain;charset=utf-8',
          }),
          `时光绘图-${new Date().getTime()}.tdraw`
        );
        break;
      case 'save_png':
        canvas.saveAsImage(`${title || '无标题'}.png`);
        break;
      case 'save_svg':
        onHandleSaveToSvg();
        break;
      case 'undo':
        canvas.undo();
        break;
      case 'redo':
        canvas.redo();
        break;
      case 'copy':
        canvas.copy();
        break;
      case 'cut':
        canvas.cut();
        break;
      case 'paste':
        canvas.paste();
        break;
      case 'all':
        canvas.getRect();
        break;
      case 'delete':
        canvas.delete();
        break;
      default:
        break;
    }
  };

  const clickMenu = (key: string) => {
    const data = { key };
    onHandleSelect(data);
  };
  /**
   * 放大画布
   */

  const scaleZoomOut = () => {
    if (scaleNumber < 5) {
      setScaleNumber(scaleNumber + 0.5);
      canvas.scaleTo(scaleNumber + 0.5);
    }
  };

  /**
   * 缩小画布
   */

  const scaleZoomIn = () => {
    if (scaleNumber > 0.5) {
      setScaleNumber(scaleNumber - 0.5);
      canvas.scaleTo(scaleNumber - 0.5);
    }
  };

  const scaleZoom = (num: any) => {
    setScaleNumber(num);
    canvas.scaleTo(num);
  };
  // 显示隐藏网格
  const changeGrid = () => {
    canvas.data.grid = !canvas.data.grid;
    setBackGrid(canvas.data.grid);
    canvas.render();
    // canvas.grid=;
  };

  /* const changeColor = (e: any) => {
    canvas.data.bkColor = `rgba(${e.rgb.r},${e.rgb.g},${e.rgb.b},${e.rgb.a})`;
    setBackGround(canvas.data.bkColor);
    canvas.updateProps();
  }; */

  const consumeColorPicker = (color: any, colorType: number) => {
    return displayColorPicker.type === colorType && displayColorPicker.show ? (
      <div style={{ position: 'absolute', zIndex: 99 }}>
        <div
          style={{
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
          }}
          onClick={(e) => {
            //  e.preventDefault();
            e.stopPropagation();
            setDisplayColorPicker({ show: false, type: colorType });
          }}
        />
        <ChromePicker
          color={color}
          onChange={(value) => changeColorComplete(value, colorType)}
        />
      </div>
    ) : null;
  };

  const changeColorComplete = (color: any, colorType: number) => {
    let rgbColor = `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`;
    switch (colorType) {
      case 1:
        changeProps('color', rgbColor);
        break;
      case 2:
        changeProps('strokeStyle', rgbColor);
        break;
      case 3:
        setNodeBackGround(rgbColor);
        changeProps('fillStyle', rgbColor);
        break;
      default:
    }
    //setDisplayColorPicker({show:false,type:colorType})
    canvas.updateProps();
  };

  const changeProps = (name: string, value: any) => {
    let res = {};
    const fontProps = [
      'background',
      'color',
      'fontFamily',
      'fontSize',
      'fontStyle',
      'fontWeight',
      'lineHeight',
      'textAlign',
      'textBaseline',
    ];
    // if (fontProps.includes(name)) {
    //   res = {
    //     font: {
    //       [name]: value,
    //     },
    //   };
    // } else {
    res = { [name]: value };
    // }
    propsChange(res);
  };

  return (
    <>
      <div className="menu-container">
        <ul className="head-menu">
          <li className="menu-title">
            文件
            <List component="nav" className="menu-list">
              <ListItem button onClick={() => clickMenu('create_new')}>
                <ListItemText key="create_new" primary="新建文件" />
              </ListItem>
              <ListItem button onClick={() => clickMenu('import_json')}>
                <ListItemText key="import_json" primary="打开本地文件" />
              </ListItem>
              <ListItem button onClick={() => clickMenu('save')}>
                <ListItemText key="save" primary="保存" />
              </ListItem>
              <ListItem button onClick={() => clickMenu('save_json')}>
                <ListItemText key="save_json" primary="下载绘图文件" />
              </ListItem>
              <ListItem button onClick={() => clickMenu('save_png')}>
                <ListItemText key="save_png" primary="下载png文件" />
              </ListItem>
              <ListItem button onClick={() => clickMenu('save_svg')}>
                <ListItemText key="save_svg" primary="下载svg文件" />
              </ListItem>
            </List>
          </li>
          <li className="menu-title">
            编辑
            <List component="nav" className="menu-list">
              <ListItem button onClick={() => clickMenu('undo')}>
                <ListItemText key="undo" primary="撤销" />
              </ListItem>
              <ListItem button onClick={() => clickMenu('redo')}>
                <ListItemText key="redo" primary="恢复" />
              </ListItem>
              <ListItem button onClick={() => clickMenu('copy')}>
                <ListItemText key="copy" primary="复制" />
              </ListItem>
              <ListItem button onClick={() => clickMenu('cut')}>
                <ListItemText key="cut" primary="剪切" />
              </ListItem>
              <ListItem button onClick={() => clickMenu('paste')}>
                <ListItemText key="paste" primary="粘贴" />
              </ListItem>
            </List>
          </li>
          <li className="menu-title">
            视图
            <List component="nav" className="menu-list">
              <ListItem button onClick={() => scaleZoomOut()}>
                <ListItemText primary="放大" />
              </ListItem>
              <ListItem button onClick={() => scaleZoomIn()}>
                <ListItemText id="pop-fav" primary="缩小" />
              </ListItem>
              <ListItem button onClick={() => scaleZoom(1)}>
                <ListItemText id="pop-shareIn" primary="重置" />
              </ListItem>
            </List>
          </li>
          <li className="menu-title">
            页面
            <List component="nav" className="menu-list">
              {/*  <ListItem button className="color-menu">
                <ListItemText primary="背景颜色" />
                <div className="select-color">
                  <ChromePicker color={backGround} onChange={changeColor} />
                </div>
              </ListItem> */}
              <ListItem button onClick={() => changeGrid()}>
                <ListItemText primary={backGrid ? '隐藏网格' : '显示网格'} />
              </ListItem>
              <ListItem button onClick={() => setTool(!tool)}>
                <ListItemText primary={tool ? '隐藏组件库' : '显示组件库'} />
              </ListItem>
            </List>
          </li>
          <li className="menu-title">
            社区
            <List component="nav" className="menu-list">
              <ListItem
                button
                onClick={() =>
                  window.open('https://baoku.qingtime.cn/timeos/home')
                }
              >
                <ListItemText primary="咨询与建议" />
              </ListItem>
            </List>
          </li>
        </ul>

        {!editTitle ? (
          <span className="edit-title" onClick={() => setEditTitle(true)}>
            {title ? title : '请输入绘图标题'}
          </span>
        ) : (
          <TextField
            variant="outlined"
            size="small"
            placeholder="请输入绘图标题"
            value={title}
            onChange={(e) => {
              settitle(e.target.value);
            }}
            onBlur={(e) => {
              setEditTitle(false);
              // dispatch(editArticleSaveStatus(-1));
            }}
          />
        )}

        <ButtonGroup style={{ display: 'inline-flex', alignItems: 'center' }}>
          {/* {saveStatus === -1 ? ( */}
          <Button size="small" onClick={() => onHandleSelect({ key: 'save' })}>
            保存
          </Button>
          {/* ) : saveStatus === 0 ? (
            <Button size="small" disabled>
              保存中...
            </Button>
          ) : (
            <Button size="small" disabled>
              已保存
            </Button>
          ) 
          }*/}

          {embed ? null : (
            <Button
              size="small"
              onClick={() => {
                if (changeEditable) {
                  onHandleSelect({ key: 'save' });
                  changeEditable(false);
                }
              }}
            >
              返回
            </Button>
          )}
        </ButtonGroup>
      </div>
      <div className="toolbar">
        <div className={`left-bar`}>
          <Tooltip placement="bottom-start" title="撤销">
            <div
              className="toolbar_button"
              onClick={() => {
                onHandleSelect({ key: 'undo' });
              }}
            >
              <svg width="14px" height="12px" viewBox="0 0 14 12" version="1.1">
                <title>撤销@1x</title>
                <desc>Created with Sketch.</desc>
                <g
                  id="时光绘图"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fillRule="evenodd"
                >
                  <g
                    id="切图"
                    transform="translate(-198.000000, -169.000000)"
                    fill="#0A0A0A"
                  >
                    <path
                      d="M198,174.25 L203.833333,179.498333 L203.833333,175.998333 C207.346667,175.998333 210.833333,177.94 212,180.806667 L212,180.665 C212,176.154675 208.343659,172.498333 203.833333,172.498333 L203.833333,169 L198,174.25 Z"
                      id="撤销"
                    ></path>
                  </g>
                </g>
              </svg>
            </div>
          </Tooltip>
          <Tooltip placement="bottom-start" title="恢复">
            <div
              className="toolbar_button"
              onClick={() => {
                onHandleSelect({ key: 'redo' });
              }}
            >
              <svg width="14px" height="12px" viewBox="0 0 14 12" version="1.1">
                <title>恢复@1x</title>
                <desc>Created with Sketch.</desc>
                <g
                  id="时光绘图"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fillRule="evenodd"
                >
                  <g
                    id="切图"
                    transform="translate(-198.000000, -218.000000)"
                    fill="#0A0A0A"
                  >
                    <path
                      d="M198,223.25 L203.833333,228.498333 L203.833333,224.998333 C207.346667,224.998333 210.833333,226.94 212,229.806667 L212,229.665 C212,225.154675 208.343659,221.498333 203.833333,221.498333 L203.833333,218 L198,223.25 Z"
                      id="恢复"
                      transform="translate(205.000000, 223.903333) scale(-1, 1) translate(-205.000000, -223.903333) "
                    ></path>
                  </g>
                </g>
              </svg>
            </div>
          </Tooltip>
          <div className="toolbar_devider"></div>
          {/* <Tooltip placement="bottom-start" title="字体">
            <TextField
              variant="outlined"
              select
              multiline
              value={font?.fontFamily}
              className="select-consume"
              style={{ width: '150px' }}
              onChange={(e: any) => {
                console.log(e);
                setFont({ ...font, fontFamily: e.target.value });
              }}
            >
              <MenuItem value="Arial">Arial</MenuItem>
              <MenuItem value="Verdana">Verdana</MenuItem>
              <MenuItem value="Georgia">Georgia</MenuItem>
              <MenuItem value="Times New Roman">Times New Roman</MenuItem>
              <MenuItem value="Courier New">Courier New</MenuItem>
              <MenuItem value="Impact">Impact</MenuItem>
              <MenuItem value="Comic Sans MS">Comic Sans MS</MenuItem>
              <MenuItem value="Garamond">Garamond</MenuItem>
              <MenuItem value="Lucida Console">Lucida Console</MenuItem>
              <MenuItem value="SimSun">宋体</MenuItem>
              <MenuItem value="Microsoft YaHei">微软雅黑</MenuItem>
            </TextField>
          </Tooltip>
 */}
          <div className="toolbar_small_devider"></div>
          <Tooltip placement="bottom-start" title="字体大小">
            <div className="toolbar_button">
              <InputBase
                type="number"
                className="no-border-color"
                value={fontSize}
                onChange={(e: any) => {
                  changeProps('fontSize', e.target.value);
                }}
              />
            </div>
          </Tooltip>
          <div className="toolbar_small_devider"></div>
          <Tooltip placement="bottom-start" title="粗体">
            <div
              className={`toolbar_button ${
                fontWeight === 'normal' ? 'null' : 'active'
              }`}
              key="weight"
              onClick={() => {
                changeProps(
                  'fontWeight',
                  fontWeight === 'bold' ? 'normal' : 'bold'
                );
              }}
            >
              <FormatBoldIcon />
            </div>
          </Tooltip>
          <Tooltip placement="bottom-start" title="斜体">
            <div
              className={`toolbar_button ${
                fontStyle === 'normal' ? 'null' : 'active'
              }`}
              key="style"
              onClick={() => {
                changeProps(
                  'fontStyle',
                  fontStyle === 'normal' ? 'italic' : 'normal'
                );
              }}
            >
              <FormatItalicIcon />
            </div>
          </Tooltip>
          <Tooltip placement="bottom-start" title="文本颜色">
            <div
              className="toolbar_button"
              onClick={() => setDisplayColorPicker({ show: true, type: 1 })}
            >
              <FormatColorTextIcon
                fontSize="small"
                style={{ color: fontColor }}
              />
              {consumeColorPicker(fontColor, 1)}
            </div>
          </Tooltip>
          <Tooltip placement="bottom-start" title="水平对齐">
            <TextField
              variant="outlined"
              size="small"
              select
              value={textAlign}
              className="select-consume"
              style={{ width: '50px' }}
              onChange={(e: any) => changeProps('textAlign', e.target.value)}
            >
              <MenuItem value="left">
                <svg width="12px" height="9px" viewBox="0 0 12 9" version="1.1">
                  <title>12左对齐@1x</title>
                  <desc>Created with Sketch.</desc>
                  <g
                    id="时光绘图"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g
                      id="切图"
                      transform="translate(-473.000000, -87.000000)"
                      fill="#0A0A0A"
                    >
                      <path
                        d="M485,95 L485,96 L473,96 L473,95 L485,95 Z M481,91 L481,92 L473,92 L473,91 L481,91 Z M485,87 L485,88 L473,88 L473,87 L485,87 Z"
                        id="12左对齐"
                      ></path>
                    </g>
                  </g>
                </svg>
              </MenuItem>
              <MenuItem value="center">
                <svg width="12px" height="9px" viewBox="0 0 12 9" version="1.1">
                  <title>12居中对齐@1x</title>
                  <desc>Created with Sketch.</desc>
                  <g
                    id="时光绘图"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g
                      id="切图"
                      transform="translate(-501.000000, -87.000000)"
                      fill="#0A0A0A"
                    >
                      <path
                        d="M513,95 L513,96 L501,96 L501,95 L513,95 Z M511,91 L511,92 L503,92 L503,91 L511,91 Z M513,87 L513,88 L501,88 L501,87 L513,87 Z"
                        id="12居中对齐"
                      ></path>
                    </g>
                  </g>
                </svg>
              </MenuItem>
              <MenuItem value="right">
                <svg width="12px" height="9px" viewBox="0 0 12 9" version="1.1">
                  <title>12右对齐@1x</title>
                  <desc>Created with Sketch.</desc>
                  <g
                    id="时光绘图"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g
                      id="切图"
                      transform="translate(-532.000000, -87.000000)"
                      fill="#0A0A0A"
                    >
                      <path
                        d="M544,95 L544,96 L532,96 L532,95 L544,95 Z M540,91 L540,92 L532,92 L532,91 L540,91 Z M544,87 L544,88 L532,88 L532,87 L544,87 Z"
                        id="12右对齐"
                        transform="translate(538.000000, 91.500000) scale(-1, 1) translate(-538.000000, -91.500000) "
                      ></path>
                    </g>
                  </g>
                </svg>
              </MenuItem>
            </TextField>
          </Tooltip>
          <Tooltip placement="bottom-start" title="垂直对齐">
            <TextField
              variant="outlined"
              size="small"
              select
              value={textBaseline}
              className="select-consume"
              style={{ width: '50px' }}
              onChange={(e: any) => changeProps('textBaseline', e.target.value)}
            >
              <MenuItem value="top">
                <svg
                  width="11px"
                  height="11px"
                  viewBox="0 0 11 11"
                  version="1.1"
                >
                  <title>12顶部对齐@1x</title>
                  <desc>Created with Sketch.</desc>
                  <g
                    id="时光绘图"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g
                      id="切图"
                      transform="translate(-473.000000, -109.000000)"
                      fill="#0A0A0A"
                    >
                      <g
                        id="12顶部对齐"
                        transform="translate(473.000000, 109.000000)"
                      >
                        <path
                          d="M2,5 L5.54666666,2 L9,5 L6,5 L6,11 L5,11 L5,5 L2,5 Z M11,0 L11,1 L0,1 L0,0 L11,0 Z"
                          id="形状结合"
                        ></path>
                      </g>
                    </g>
                  </g>
                </svg>
              </MenuItem>
              <MenuItem value="middle">
                <svg
                  width="11px"
                  height="17px"
                  viewBox="0 0 11 17"
                  version="1.1"
                >
                  <title>12垂直对齐@1x</title>
                  <desc>Created with Sketch.</desc>
                  <g
                    id="时光绘图"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g
                      id="切图"
                      transform="translate(-501.000000, -105.000000)"
                      fill="#0A0A0A"
                    >
                      <g
                        id="12垂直对齐"
                        transform="translate(501.000000, 105.000000)"
                      >
                        <path
                          d="M3,13 L5.54666666,10 L8,13 L6,13 L6,17 L5,17 L5,13 L3,13 Z M11,8 L11,9 L0,9 L0,8 L11,8 Z M6,0 L6,4 L8,4 L5.54666666,7 L3,4 L5,4 L5,0 L6,0 Z"
                          id="形状结合"
                        ></path>
                      </g>
                    </g>
                  </g>
                </svg>
              </MenuItem>
              <MenuItem value="bottom">
                <svg
                  width="11px"
                  height="11px"
                  viewBox="0 0 11 11"
                  version="1.1"
                >
                  <title>12底部对齐@1x</title>
                  <desc>Created with Sketch.</desc>
                  <g
                    id="时光绘图"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g
                      id="切图"
                      transform="translate(-533.000000, -109.000000)"
                      fill="#0A0A0A"
                    >
                      <g
                        id="12底部对齐"
                        transform="translate(538.500000, 114.500000) scale(1, -1) translate(-538.500000, -114.500000) translate(533.000000, 109.000000)"
                      >
                        <path
                          d="M2,5 L5.54666666,2 L9,5 L6,5 L6,11 L5,11 L5,5 L2,5 Z M11,0 L11,1 L0,1 L0,0 L11,0 Z"
                          id="形状结合"
                        ></path>
                      </g>
                    </g>
                  </g>
                </svg>
              </MenuItem>
            </TextField>
          </Tooltip>
          {/* <Tooltip placement="bottom-start" title="填充颜色">
          <div className="toolbar_button" onClick={() => setDisplayColorPicker({show:true,type:3})}>
            <Icon type="font-colors" style={{ color:  }} />
            {consumeColorPicker(font?.color, 3)}
          </div>
         
        </Tooltip> */}
          <div className="toolbar_devider"></div>
          <Tooltip title="线条颜色" placement="bottom-start">
            <div
              className="toolbar_button "
              onClick={() => setDisplayColorPicker({ show: true, type: 2 })}
            >
              <BorderColorIcon
                fontSize="small"
                style={{ color: strokeStyle }}
              />
              {consumeColorPicker(strokeStyle, 2)}
            </div>
          </Tooltip>
          <Tooltip title="背景颜色" placement="bottom-start">
            <div
              className="toolbar_button "
              onClick={() => setDisplayColorPicker({ show: true, type: 3 })}
            >
              <FormatColorFillOutlinedIcon
                fontSize="small"
                style={{ color: fillStyle }}
              />
              {consumeColorPicker(nodeBackGround, 3)}
            </div>
          </Tooltip>
          <Tooltip title="线宽" placement="bottom-start">
            <div className="toolbar_button ">
              <InputBase
                type="number"
                className="no-border-color"
                value={lineWidth}
                onChange={(e: any) => {
                  canvas.data.lineWidth = e.target.value;
                  canvas.render();
                  changeProps('lineWidth', e.target.value);
                }}
              />
            </div>
          </Tooltip>
          <Tooltip placement="bottom-start" title="连线样式">
            <TextField
              variant="outlined"
              select
              size="small"
              value={dash}
              className="select-consume"
              style={{ width: '80px' }}
              onChange={(e: any) => changeProps('dash', e.target.value)}
            >
              <MenuItem key={0} value={0}>
                ____
              </MenuItem>
              <MenuItem key={1} value={1}>
                ----
              </MenuItem>
              <MenuItem key={2} value={2}>
                _ _ _
              </MenuItem>
              <MenuItem key={3} value={3}>
                - . -
              </MenuItem>
            </TextField>
          </Tooltip>
          <Tooltip placement="bottom-start" title="连线类型">
            <TextField
              variant="outlined"
              select
              disabled={data.type !== 1}
              value={data.type === 1 ? name : ''}
              className="select-consume"
              style={{ width: '60px' }}
              onChange={(e: any) => {
                canvas.data.lineName = e.target.value;
                canvas.render();
                changeProps('name', e.target.value);
              }}
            >
              <MenuItem value="curve">
                <div className="arrow-icon">
                  <svg
                    width="15px"
                    height="15px"
                    viewBox="0 0 15 15"
                    version="1.1"
                  >
                    <title>17-2@1x</title>
                    <desc>Created with Sketch.</desc>
                    <g
                      id="时光绘图"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="切图"
                        transform="translate(-655.000000, -260.000000)"
                        stroke="#0A0A0A"
                      >
                        <g
                          id="17-2"
                          transform="translate(655.000000, 260.000000)"
                        >
                          <rect
                            id="矩形"
                            x="0.5"
                            y="0.5"
                            width="2"
                            height="2"
                          ></rect>
                          <rect
                            id="矩形"
                            x="12.5"
                            y="12.5"
                            width="2"
                            height="2"
                          ></rect>
                          <path
                            d="M3,1.5 C10.0506337,1.64339053 13.5759506,5.11843666 13.5759506,11.9251384"
                            id="路径-2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </MenuItem>
              <MenuItem value="polyline">
                <div className="arrow-icon">
                  <svg
                    width="15px"
                    height="15px"
                    viewBox="0 0 15 15"
                    version="1.1"
                  >
                    <title>17-1@1x</title>
                    <desc>Created with Sketch.</desc>
                    <g
                      id="时光绘图"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="切图"
                        transform="translate(-655.000000, -224.000000)"
                      >
                        <g
                          id="17-1"
                          transform="translate(655.000000, 224.000000)"
                        >
                          <rect
                            id="矩形"
                            stroke="#0A0A0A"
                            x="0.5"
                            y="0.5"
                            width="2"
                            height="2"
                          />
                          <rect
                            id="矩形"
                            fill="#0A0A0A"
                            x="3"
                            y="1"
                            width="5"
                            height="1"
                          />
                          <rect
                            id="矩形"
                            stroke="#0A0A0A"
                            x="12.5"
                            y="12.5"
                            width="2"
                            height="2"
                          />
                          <rect
                            id="矩形"
                            fill="#0A0A0A"
                            x="7"
                            y="13"
                            width="5"
                            height="1"
                          />
                          <rect
                            id="矩形"
                            fill="#0A0A0A"
                            x="7"
                            y="1"
                            width="1"
                            height="13"
                          />
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </MenuItem>
              <MenuItem value="line">
                <div className="arrow-icon">
                  <svg
                    width="15px"
                    height="15px"
                    viewBox="0 0 15 15"
                    version="1.1"
                  >
                    <title>17-3@1x</title>
                    <desc>Created with Sketch.</desc>
                    <g
                      id="时光绘图"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="切图"
                        transform="translate(-655.000000, -297.000000)"
                        stroke="#0A0A0A"
                      >
                        <g
                          id="17-3"
                          transform="translate(655.000000, 297.000000)"
                        >
                          <rect
                            id="矩形"
                            x="0.5"
                            y="0.5"
                            width="2"
                            height="2"
                          ></rect>
                          <rect
                            id="矩形"
                            x="12.5"
                            y="12.5"
                            width="2"
                            height="2"
                          ></rect>
                          <line
                            x1="2"
                            y1="2"
                            x2="12.5759506"
                            y2="12.5"
                            id="路径-3"
                            strokeLinejoin="round"
                          ></line>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </MenuItem>
            </TextField>
          </Tooltip>
          <Tooltip placement="bottom-start" title="起点箭头">
            <TextField
              variant="outlined"
              size="small"
              select
              disabled={data.type !== 1}
              value={fromArrow}
              style={{ width: '70px' }}
              className="select-consume"
              onChange={(e: any) => {
                canvas.data.fromArrow = e.target.value;
                canvas.render();
                changeProps('fromArrow', e.target.value);
              }}
            >
              <MenuItem value="null">
                <div className="arrow-icon">
                  <svg
                    width="29px"
                    height="1px"
                    viewBox="0 0 29 1"
                    version="1.1"
                  >
                    <title>18-1@1x</title>
                    <desc>Created with Sketch.</desc>
                    <g
                      id="时光绘图"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="切图"
                        transform="translate(-942.000000, -110.000000)"
                        fill="#0A0A0A"
                      >
                        <rect
                          id="18-1"
                          x="942"
                          y="110"
                          width="29"
                          height="1"
                        ></rect>
                      </g>
                    </g>
                  </svg>
                </div>
              </MenuItem>
              <MenuItem value="triangleSolid">
                <div style={{ height: '20px' }}>
                  <svg
                    width="29px"
                    height="8px"
                    viewBox="0 0 29 8"
                    version="1.1"
                  >
                    <title>18-2@1x</title>
                    <desc>Created with Sketch.</desc>
                    <g
                      id="时光绘图"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="切图"
                        transform="translate(-940.000000, -126.000000)"
                        fill="#0A0A0A"
                      >
                        <g
                          id="18-2"
                          transform="translate(954.500000, 130.000000) scale(-1, 1) translate(-954.500000, -130.000000) translate(940.000000, 126.000000)"
                        >
                          <path
                            d="M11,-3 L14.5466667,-10 L18,-3 L15,-3 L15,18 L14,18 L14,-3 L11,-3 Z"
                            id="形状结合"
                            transform="translate(14.500000, 4.000000) rotate(90.000000) translate(-14.500000, -4.000000) "
                          ></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </MenuItem>
              <MenuItem value="triangle">
                <div className="arrow-icon">
                  <svg
                    width="29px"
                    height="8px"
                    viewBox="0 0 29 8"
                    version="1.1"
                  >
                    <title>18-3@1x</title>
                    <desc>Created with Sketch.</desc>
                    <g
                      id="时光绘图"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="切图"
                        transform="translate(-940.000000, -146.000000)"
                      >
                        <g
                          id="18-3"
                          transform="translate(954.500000, 150.000000) scale(-1, 1) translate(-954.500000, -150.000000) translate(940.000000, 146.000000)"
                        >
                          <polygon
                            id="路径"
                            fill="#0A0A0A"
                            transform="translate(11.000000, 4.000000) rotate(90.000000) translate(-11.000000, -4.000000) "
                            points="11.5 -6.5 11.5 14.5 10.5 14.5 10.5 -6.5"
                          ></polygon>
                          <polygon
                            id="路径"
                            stroke="#0A0A0A"
                            transform="translate(25.000000, 4.000000) rotate(90.000000) translate(-25.000000, -4.000000) "
                            points="25.0466667 0.5 21.5 7.5 28.5 7.5"
                          ></polygon>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </MenuItem>
              <MenuItem value="diamondSolid">
                <div className="arrow-icon">
                  <svg
                    width="29px"
                    height="8px"
                    viewBox="0 0 29 8"
                    version="1.1"
                  >
                    <title>18-5@1x</title>
                    <desc>Created with Sketch.</desc>
                    <g
                      id="时光绘图"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="切图"
                        transform="translate(-940.000000, -185.000000)"
                        fill="#0A0A0A"
                      >
                        <g
                          id="18-5"
                          transform="translate(940.000000, 184.000000)"
                        >
                          <polygon
                            id="矩形"
                            transform="translate(5.000000, 5.000000) rotate(45.000000) translate(-5.000000, -5.000000) "
                            points="2.57223071 2.57223071 8 2 7.42776929 7.42776929 2 8"
                          ></polygon>
                          <g
                            id="箭头（左）"
                            transform="translate(15.000000, 5.000000) scale(-1, 1) translate(-15.000000, -5.000000) translate(1.000000, 4.000000)"
                          >
                            <polygon
                              id="路径"
                              transform="translate(14.000000, 1.000000) rotate(90.000000) translate(-14.000000, -1.000000) "
                              points="14.5 -12.5 14.5 14.5 13.5 14.5 13.5 -12.5"
                            ></polygon>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </MenuItem>
              <MenuItem value="diamond">
                <div className="arrow-icon">
                  <svg
                    width="29px"
                    height="8px"
                    viewBox="0 0 29 8"
                    version="1.1"
                  >
                    <title>18-6@1x</title>
                    <desc>Created with Sketch.</desc>
                    <g
                      id="时光绘图"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="切图"
                        transform="translate(-940.000000, -205.000000)"
                      >
                        <g
                          id="18-6"
                          transform="translate(940.000000, 204.000000)"
                        >
                          <polygon
                            id="矩形"
                            stroke="#0A0A0A"
                            strokeWidth="0.88"
                            transform="translate(5.000000, 5.000000) rotate(45.000000) translate(-5.000000, -5.000000) "
                            points="2.57223071 2.57223071 8 2 7.42776929 7.42776929 2 8"
                          ></polygon>
                          <g
                            id="箭头（左）"
                            transform="translate(18.500000, 5.000000) scale(-1, 1) translate(-18.500000, -5.000000) translate(8.000000, 4.000000)"
                            fill="#0A0A0A"
                          >
                            <polygon
                              id="路径"
                              transform="translate(10.500000, 1.000000) rotate(90.000000) translate(-10.500000, -1.000000) "
                              points="11 -9 11 11 10 11 10 -9"
                            ></polygon>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </MenuItem>
              <MenuItem value="circleSolid">
                <div className="arrow-icon">
                  <svg
                    width="28px"
                    height="6px"
                    viewBox="0 0 28 6"
                    version="1.1"
                  >
                    <title>18-7@1x</title>
                    <desc>Created with Sketch.</desc>
                    <g
                      id="时光绘图"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="切图"
                        transform="translate(-941.000000, -226.000000)"
                        fill="#0A0A0A"
                      >
                        <g
                          id="18-7"
                          transform="translate(941.000000, 226.000000)"
                        >
                          <circle id="椭圆形" cx="3" cy="3" r="3"></circle>
                          <g
                            id="箭头（左）"
                            transform="translate(14.000000, 3.000000) scale(-1, 1) translate(-14.000000, -3.000000) translate(0.000000, 2.000000)"
                          >
                            <polygon
                              id="路径"
                              transform="translate(14.000000, 1.000000) rotate(90.000000) translate(-14.000000, -1.000000) "
                              points="14.5 -12.5 14.5 14.5 13.5 14.5 13.5 -12.5"
                            ></polygon>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </MenuItem>
              <MenuItem value="circle">
                <div className="arrow-icon">
                  <svg
                    width="28px"
                    height="6px"
                    viewBox="0 0 28 6"
                    version="1.1"
                  >
                    <title>18-8@1x</title>
                    <desc>Created with Sketch.</desc>
                    <g
                      id="时光绘图"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="切图"
                        transform="translate(-941.000000, -246.000000)"
                      >
                        <g
                          id="18-8"
                          transform="translate(941.000000, 246.000000)"
                        >
                          <circle
                            id="椭圆形"
                            stroke="#0A0A0A"
                            cx="3"
                            cy="3"
                            r="2.5"
                          ></circle>
                          <g
                            id="箭头（左）"
                            transform="translate(16.500000, 3.000000) scale(-1, 1) translate(-16.500000, -3.000000) translate(5.000000, 2.000000)"
                            fill="#0A0A0A"
                          >
                            <polygon
                              id="路径"
                              transform="translate(11.500000, 1.000000) rotate(90.000000) translate(-11.500000, -1.000000) "
                              points="12 -10 12 12 11 12 11 -10"
                            ></polygon>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </MenuItem>
              <MenuItem value="line">
                <div className="arrow-icon">
                  <svg
                    width="28px"
                    height="8px"
                    viewBox="0 0 28 8"
                    version="1.1"
                  >
                    <title>18-4@1x</title>
                    <desc>Created with Sketch.</desc>
                    <g
                      id="时光绘图"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="切图"
                        transform="translate(-941.000000, -166.000000)"
                      >
                        <g
                          id="18-4"
                          transform="translate(941.000000, 166.000000)"
                        >
                          <g id="箭头" fill="#000000" fillRule="nonzero">
                            <path
                              d="M4.90215847,7.82247375 L0.188182733,4.42873336 C0.0677984018,4.31570236 7.54951657e-15,4.16127257 7.54951657e-15,4.00009464 C7.54951657e-15,3.8389167 0.0677984018,3.68448691 0.188182733,3.57145592 L4.90215847,0.177715525 C5.15435484,-0.0592385082 5.55908852,-0.0592385082 5.81128489,0.177715525 C5.931758,0.290700978 5.99961811,0.44514781 5.99961811,0.606354242 C5.99961811,0.767560674 5.931758,0.922007506 5.81128489,1.03499296 L1.55257819,3.99992621 L5.81163781,6.96452262 C5.9321317,7.0775661 6,7.23206852 6,7.39332976 C6,7.55459101 5.9321317,7.70909343 5.81163781,7.82213691 C5.69094758,7.93658266 5.5275553,8.00056234 5.35742752,8 C5.1865901,8.00040937 5.02318839,7.93659675 4.90215847,7.82247375 Z"
                              id="路径"
                            ></path>
                          </g>
                          <g
                            id="箭头（左）"
                            transform="translate(14.000000, 4.000000) scale(-1, 1) translate(-14.000000, -4.000000) translate(0.000000, 3.000000)"
                            fill="#0A0A0A"
                          >
                            <polygon
                              id="路径"
                              transform="translate(14.000000, 1.000000) rotate(90.000000) translate(-14.000000, -1.000000) "
                              points="14.5 -12.5 14.5 14.5 13.5 14.5 13.5 -12.5"
                            ></polygon>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </MenuItem>
              <MenuItem value="lineUp">
                <div className="arrow-icon">
                  <svg
                    width="28px"
                    height="5px"
                    viewBox="0 0 28 5"
                    version="1.1"
                  >
                    <title>18-10@1x</title>
                    <desc>Created with Sketch.</desc>
                    <g
                      id="时光绘图"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="切图"
                        transform="translate(-941.000000, -267.000000)"
                      >
                        <g
                          id="18-10"
                          transform="translate(941.000000, 267.000000)"
                        >
                          <g id="箭头" fill="#000000" fillRule="nonzero">
                            <path
                              d="M0.349051533,4.5 C0.308631598,4.5 0.255008665,4.47624445 0.188182733,4.42873336 C0.0677984018,4.31570236 7.54951657e-15,4.16127257 7.54951657e-15,4.00009464 C7.54951657e-15,3.8389167 0.0677984018,3.68448691 0.188182733,3.57145592 L4.90215847,0.177715525 C5.15435484,-0.0592385082 5.55908852,-0.0592385082 5.81128489,0.177715525 C5.931758,0.290700978 5.99961811,0.44514781 5.99961811,0.606354242 C5.99961811,0.767560674 5.931758,0.922007506 5.81128489,1.03499296 L1.55257819,3.99992621 C1.87429912,4.22408936 2.11361408,4.39078062 2.27052307,4.5 L0.349051533,4.5 Z"
                              id="路径"
                            ></path>
                          </g>
                          <g
                            id="箭头（左）"
                            transform="translate(14.000000, 4.000000) scale(-1, 1) translate(-14.000000, -4.000000) translate(0.000000, 3.000000)"
                            fill="#0A0A0A"
                          >
                            <polygon
                              id="路径"
                              transform="translate(14.000000, 1.000000) rotate(90.000000) translate(-14.000000, -1.000000) "
                              points="14.5 -12.5 14.5 14.5 13.5 14.5 13.5 -12.5"
                            ></polygon>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </MenuItem>
              <MenuItem value="lineDown">
                <div className="arrow-icon">
                  <svg
                    width="28px"
                    height="5px"
                    viewBox="0 0 28 5"
                    version="1.1"
                  >
                    <title>18-11@1x</title>
                    <desc>Created with Sketch.</desc>
                    <g
                      id="时光绘图"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="切图"
                        transform="translate(-941.000000, -287.000000)"
                      >
                        <g
                          id="18-11"
                          transform="translate(955.000000, 289.500000) scale(1, -1) translate(-955.000000, -289.500000) translate(941.000000, 287.000000)"
                        >
                          <g id="箭头" fill="#000000" fillRule="nonzero">
                            <path
                              d="M0.349051533,4.5 C0.308631598,4.5 0.255008665,4.47624445 0.188182733,4.42873336 C0.0677984018,4.31570236 7.54951657e-15,4.16127257 7.54951657e-15,4.00009464 C7.54951657e-15,3.8389167 0.0677984018,3.68448691 0.188182733,3.57145592 L4.90215847,0.177715525 C5.15435484,-0.0592385082 5.55908852,-0.0592385082 5.81128489,0.177715525 C5.931758,0.290700978 5.99961811,0.44514781 5.99961811,0.606354242 C5.99961811,0.767560674 5.931758,0.922007506 5.81128489,1.03499296 L1.55257819,3.99992621 C1.87429912,4.22408936 2.11361408,4.39078062 2.27052307,4.5 L0.349051533,4.5 Z"
                              id="路径"
                            ></path>
                          </g>
                          <g
                            id="箭头（左）"
                            transform="translate(14.000000, 4.000000) scale(-1, 1) translate(-14.000000, -4.000000) translate(0.000000, 3.000000)"
                            fill="#0A0A0A"
                          >
                            <polygon
                              id="路径"
                              transform="translate(14.000000, 1.000000) rotate(90.000000) translate(-14.000000, -1.000000) "
                              points="14.5 -12.5 14.5 14.5 13.5 14.5 13.5 -12.5"
                            ></polygon>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </MenuItem>
            </TextField>
          </Tooltip>
          <Tooltip placement="bottom-start" title="终点箭头">
            <TextField
              size="small"
              variant="outlined"
              select
              disabled={data.type !== 1}
              value={toArrow}
              style={{ width: '70px' }}
              className="select-consume"
              onChange={(e: any) => {
                canvas.data.toArrow = e.target.value;
                canvas.render();
                changeProps('toArrow', e.target.value);
              }}
            >
              <MenuItem value="null">
                <div className="arrow-icon">
                  <svg
                    width="29px"
                    height="1px"
                    viewBox="0 0 29 1"
                    version="1.1"
                  >
                    <title>18-1-1@1x</title>
                    <desc>Created with Sketch.</desc>
                    <g
                      id="时光绘图"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="切图"
                        transform="translate(-1007.000000, -110.000000)"
                        fill="#0A0A0A"
                      >
                        <rect
                          id="19-1"
                          x="1007"
                          y="110"
                          width="29"
                          height="1"
                        ></rect>
                      </g>
                    </g>
                  </svg>
                </div>
              </MenuItem>
              <MenuItem value="triangleSolid">
                <div style={{ height: '20px' }}>
                  <svg
                    width="29px"
                    height="8px"
                    viewBox="0 0 29 8"
                    version="1.1"
                  >
                    <title>18-2-1@1x</title>
                    <desc>Created with Sketch.</desc>
                    <g
                      id="时光绘图"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="切图"
                        transform="translate(-1007.000000, -126.000000)"
                        fill="#0A0A0A"
                      >
                        <g
                          id="19-2"
                          transform="translate(1007.000000, 126.000000)"
                        >
                          <path
                            d="M11,-3 L14.5466667,-10 L18,-3 L15,-3 L15,18 L14,18 L14,-3 L11,-3 Z"
                            id="形状结合"
                            transform="translate(14.500000, 4.000000) rotate(90.000000) translate(-14.500000, -4.000000) "
                          ></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </MenuItem>
              <MenuItem value="triangle">
                <div className="arrow-icon">
                  <svg
                    width="29px"
                    height="8px"
                    viewBox="0 0 29 8"
                    version="1.1"
                  >
                    <title>18-3-1@1x</title>
                    <desc>Created with Sketch.</desc>
                    <g
                      id="时光绘图"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="切图"
                        transform="translate(-1007.000000, -146.000000)"
                      >
                        <g
                          id="19-3"
                          transform="translate(1007.000000, 146.000000)"
                        >
                          <polygon
                            id="路径"
                            fill="#0A0A0A"
                            transform="translate(11.000000, 4.000000) rotate(90.000000) translate(-11.000000, -4.000000) "
                            points="11.5 -6.5 11.5 14.5 10.5 14.5 10.5 -6.5"
                          ></polygon>
                          <polygon
                            id="路径"
                            stroke="#0A0A0A"
                            transform="translate(25.000000, 4.000000) rotate(90.000000) translate(-25.000000, -4.000000) "
                            points="25.0466667 0.5 21.5 7.5 28.5 7.5"
                          ></polygon>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </MenuItem>
              <MenuItem value="diamondSolid">
                <div className="arrow-icon">
                  <svg
                    width="29px"
                    height="8px"
                    viewBox="0 0 29 8"
                    version="1.1"
                  >
                    <title>18-5-1@1x</title>
                    <desc>Created with Sketch.</desc>
                    <g
                      id="时光绘图"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="切图"
                        transform="translate(-1008.000000, -185.000000)"
                        fill="#0A0A0A"
                      >
                        <g
                          id="19-5"
                          transform="translate(1022.000000, 189.000000) scale(-1, 1) translate(-1022.000000, -189.000000) translate(1007.000000, 184.000000)"
                        >
                          <polygon
                            id="矩形"
                            transform="translate(5.000000, 5.000000) rotate(45.000000) translate(-5.000000, -5.000000) "
                            points="2.57223071 2.57223071 8 2 7.42776929 7.42776929 2 8"
                          ></polygon>
                          <g
                            id="箭头（左）"
                            transform="translate(15.000000, 5.000000) scale(-1, 1) translate(-15.000000, -5.000000) translate(1.000000, 4.000000)"
                          >
                            <polygon
                              id="路径"
                              transform="translate(14.000000, 1.000000) rotate(90.000000) translate(-14.000000, -1.000000) "
                              points="14.5 -12.5 14.5 14.5 13.5 14.5 13.5 -12.5"
                            ></polygon>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </MenuItem>
              <MenuItem value="diamond">
                <div className="arrow-icon">
                  <svg
                    width="29px"
                    height="8px"
                    viewBox="0 0 29 8"
                    version="1.1"
                  >
                    <title>18-6-1@1x</title>
                    <desc>Created with Sketch.</desc>
                    <g
                      id="时光绘图"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="切图"
                        transform="translate(-1008.000000, -205.000000)"
                      >
                        <g
                          id="19-6"
                          transform="translate(1022.000000, 209.000000) scale(-1, 1) translate(-1022.000000, -209.000000) translate(1007.000000, 204.000000)"
                        >
                          <polygon
                            id="矩形"
                            stroke="#0A0A0A"
                            strokeWidth="0.88"
                            transform="translate(5.000000, 5.000000) rotate(45.000000) translate(-5.000000, -5.000000) "
                            points="2.57223071 2.57223071 8 2 7.42776929 7.42776929 2 8"
                          ></polygon>
                          <g
                            id="箭头（左）"
                            transform="translate(18.500000, 5.000000) scale(-1, 1) translate(-18.500000, -5.000000) translate(8.000000, 4.000000)"
                            fill="#0A0A0A"
                          >
                            <polygon
                              id="路径"
                              transform="translate(10.500000, 1.000000) rotate(90.000000) translate(-10.500000, -1.000000) "
                              points="11 -9 11 11 10 11 10 -9"
                            ></polygon>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </MenuItem>
              <MenuItem value="circleSolid">
                <div className="arrow-icon">
                  <svg
                    width="28px"
                    height="6px"
                    viewBox="0 0 28 6"
                    version="1.1"
                  >
                    <title>18-7-1@1x</title>
                    <desc>Created with Sketch.</desc>
                    <g
                      id="时光绘图"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="切图"
                        transform="translate(-1008.000000, -226.000000)"
                        fill="#0A0A0A"
                      >
                        <g
                          id="19-7"
                          transform="translate(1022.000000, 229.000000) scale(-1, 1) translate(-1022.000000, -229.000000) translate(1008.000000, 226.000000)"
                        >
                          <circle id="椭圆形" cx="3" cy="3" r="3"></circle>
                          <g
                            id="箭头（左）"
                            transform="translate(14.000000, 3.000000) scale(-1, 1) translate(-14.000000, -3.000000) translate(0.000000, 2.000000)"
                          >
                            <polygon
                              id="路径"
                              transform="translate(14.000000, 1.000000) rotate(90.000000) translate(-14.000000, -1.000000) "
                              points="14.5 -12.5 14.5 14.5 13.5 14.5 13.5 -12.5"
                            ></polygon>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </MenuItem>
              <MenuItem value="circle">
                <div className="arrow-icon">
                  <svg
                    width="28px"
                    height="6px"
                    viewBox="0 0 28 6"
                    version="1.1"
                  >
                    <title>18-8-1@1x</title>
                    <desc>Created with Sketch.</desc>
                    <g
                      id="时光绘图"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="切图"
                        transform="translate(-1008.000000, -246.000000)"
                      >
                        <g
                          id="19-8"
                          transform="translate(1022.000000, 249.000000) scale(-1, 1) translate(-1022.000000, -249.000000) translate(1008.000000, 246.000000)"
                        >
                          <circle
                            id="椭圆形"
                            stroke="#0A0A0A"
                            cx="3"
                            cy="3"
                            r="2.5"
                          ></circle>
                          <g
                            id="箭头（左）"
                            transform="translate(16.500000, 3.000000) scale(-1, 1) translate(-16.500000, -3.000000) translate(5.000000, 2.000000)"
                            fill="#0A0A0A"
                          >
                            <polygon
                              id="路径"
                              transform="translate(11.500000, 1.000000) rotate(90.000000) translate(-11.500000, -1.000000) "
                              points="12 -10 12 12 11 12 11 -10"
                            ></polygon>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </MenuItem>
              <MenuItem value="line">
                <div className="arrow-icon">
                  <svg
                    width="28px"
                    height="8px"
                    viewBox="0 0 28 8"
                    version="1.1"
                  >
                    <title>18-4-1@1x</title>
                    <desc>Created with Sketch.</desc>
                    <g
                      id="时光绘图"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="切图"
                        transform="translate(-1008.000000, -166.000000)"
                      >
                        <g
                          id="19-4"
                          transform="translate(1022.000000, 170.000000) scale(-1, 1) translate(-1022.000000, -170.000000) translate(1008.000000, 166.000000)"
                        >
                          <g id="箭头" fill="#000000" fillRule="nonzero">
                            <path
                              d="M4.90215847,7.82247375 L0.188182733,4.42873336 C0.0677984018,4.31570236 7.54951657e-15,4.16127257 7.54951657e-15,4.00009464 C7.54951657e-15,3.8389167 0.0677984018,3.68448691 0.188182733,3.57145592 L4.90215847,0.177715525 C5.15435484,-0.0592385082 5.55908852,-0.0592385082 5.81128489,0.177715525 C5.931758,0.290700978 5.99961811,0.44514781 5.99961811,0.606354242 C5.99961811,0.767560674 5.931758,0.922007506 5.81128489,1.03499296 L1.55257819,3.99992621 L5.81163781,6.96452262 C5.9321317,7.0775661 6,7.23206852 6,7.39332976 C6,7.55459101 5.9321317,7.70909343 5.81163781,7.82213691 C5.69094758,7.93658266 5.5275553,8.00056234 5.35742752,8 C5.1865901,8.00040937 5.02318839,7.93659675 4.90215847,7.82247375 Z"
                              id="路径"
                            ></path>
                          </g>
                          <g
                            id="箭头（左）"
                            transform="translate(14.000000, 4.000000) scale(-1, 1) translate(-14.000000, -4.000000) translate(0.000000, 3.000000)"
                            fill="#0A0A0A"
                          >
                            <polygon
                              id="路径"
                              transform="translate(14.000000, 1.000000) rotate(90.000000) translate(-14.000000, -1.000000) "
                              points="14.5 -12.5 14.5 14.5 13.5 14.5 13.5 -12.5"
                            ></polygon>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </MenuItem>
              <MenuItem value="lineUp">
                <div className="arrow-icon">
                  <svg
                    width="28px"
                    height="5px"
                    viewBox="0 0 28 5"
                    version="1.1"
                  >
                    <title>18-10-1@1x</title>
                    <desc>Created with Sketch.</desc>
                    <g
                      id="时光绘图"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="切图"
                        transform="translate(-1008.000000, -266.000000)"
                      >
                        <g
                          id="19-10"
                          transform="translate(1022.000000, 268.500000) scale(-1, 1) translate(-1022.000000, -268.500000) translate(1008.000000, 266.000000)"
                        >
                          <g id="箭头" fill="#000000" fillRule="nonzero">
                            <path
                              d="M0.349051533,4.5 C0.308631598,4.5 0.255008665,4.47624445 0.188182733,4.42873336 C0.0677984018,4.31570236 7.54951657e-15,4.16127257 7.54951657e-15,4.00009464 C7.54951657e-15,3.8389167 0.0677984018,3.68448691 0.188182733,3.57145592 L4.90215847,0.177715525 C5.15435484,-0.0592385082 5.55908852,-0.0592385082 5.81128489,0.177715525 C5.931758,0.290700978 5.99961811,0.44514781 5.99961811,0.606354242 C5.99961811,0.767560674 5.931758,0.922007506 5.81128489,1.03499296 L1.55257819,3.99992621 C1.87429912,4.22408936 2.11361408,4.39078062 2.27052307,4.5 L0.349051533,4.5 Z"
                              id="路径"
                            ></path>
                          </g>
                          <g
                            id="箭头（左）"
                            transform="translate(14.000000, 4.000000) scale(-1, 1) translate(-14.000000, -4.000000) translate(0.000000, 3.000000)"
                            fill="#0A0A0A"
                          >
                            <polygon
                              id="路径"
                              transform="translate(14.000000, 1.000000) rotate(90.000000) translate(-14.000000, -1.000000) "
                              points="14.5 -12.5 14.5 14.5 13.5 14.5 13.5 -12.5"
                            ></polygon>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </MenuItem>
              <MenuItem value="lineDown">
                <div className="arrow-icon">
                  <svg
                    width="28px"
                    height="5px"
                    viewBox="0 0 28 5"
                    version="1.1"
                  >
                    <title>18-11-1@1x</title>
                    <desc>Created with Sketch.</desc>
                    <g
                      id="时光绘图"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="切图"
                        transform="translate(-1008.000000, -286.000000)"
                      >
                        <g
                          id="18-11-1"
                          transform="translate(1022.000000, 288.500000) scale(-1, -1) translate(-1022.000000, -288.500000) translate(1008.000000, 286.000000)"
                        >
                          <g id="箭头" fill="#000000" fillRule="nonzero">
                            <path
                              d="M0.349051533,4.5 C0.308631598,4.5 0.255008665,4.47624445 0.188182733,4.42873336 C0.0677984018,4.31570236 7.54951657e-15,4.16127257 7.54951657e-15,4.00009464 C7.54951657e-15,3.8389167 0.0677984018,3.68448691 0.188182733,3.57145592 L4.90215847,0.177715525 C5.15435484,-0.0592385082 5.55908852,-0.0592385082 5.81128489,0.177715525 C5.931758,0.290700978 5.99961811,0.44514781 5.99961811,0.606354242 C5.99961811,0.767560674 5.931758,0.922007506 5.81128489,1.03499296 L1.55257819,3.99992621 C1.87429912,4.22408936 2.11361408,4.39078062 2.27052307,4.5 L0.349051533,4.5 Z"
                              id="路径"
                            ></path>
                          </g>
                          <g
                            id="箭头（左）"
                            transform="translate(14.000000, 4.000000) scale(-1, 1) translate(-14.000000, -4.000000) translate(0.000000, 3.000000)"
                            fill="#0A0A0A"
                          >
                            <polygon
                              id="路径"
                              transform="translate(14.000000, 1.000000) rotate(90.000000) translate(-14.000000, -1.000000) "
                              points="14.5 -12.5 14.5 14.5 13.5 14.5 13.5 -12.5"
                            ></polygon>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </MenuItem>
            </TextField>
          </Tooltip>
        </div>

        <div className="right-bar">
          <div className="toolbar_devider"></div>
          {isLock ? (
            <Tooltip placement="bottom-start" title="解锁">
              <IconButton
                size="small"
                onClick={() => {
                  setIsLock(false);
                  canvas.lock(0);
                }}
              >
                <LockOpenOutlinedIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip placement="bottom-start" title="锁定">
              <IconButton
                size="small"
                onClick={() => {
                  setIsLock(true);
                  canvas.lock(2);
                }}
              >
                <LockOutlinedIcon />
              </IconButton>
            </Tooltip>
          )}
          {right ? (
            <Tooltip placement="bottom-start" title="收起" arrow>
              <IconButton size="small" onClick={() => showRight(false)}>
                <ArrowForwardIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip placement="bottom-start" title="更多属性设置" arrow>
              <IconButton size="small" onClick={() => showRight(true)}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(Header);
