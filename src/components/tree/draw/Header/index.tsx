import React, { useState, useEffect } from 'react';
import { Menu, Icon, Button, Input, Tooltip, Select } from 'antd';
import * as FileSaver from 'file-saver';
import './index.css';
import { useHistory, useLocation } from 'react-router-dom';
import { setMessage } from '../../../../redux/actions/commonActions';
// import { addArticle, editArticleSaveStatus, editDraw } from '../../../redux/actions/articleActions';
import { useDispatch, useSelector } from 'react-redux';
import { getSearchParamValue } from '../../../../services/util';
import { uploadImage, dataURLtoFile } from '../../../../services/uploadImage';
// import api from '../../../util/api';
import { Topology, Line, Pen, Node } from '@topology/core';
import { editTask } from '../../../../redux/actions/taskActions';
import { ArticleDetail } from '../../../../interfaces/Article';
import { FontProps, LineProps } from '../../../../interfaces/Line';
import { ChromePicker } from 'react-color';
import useDebouncedCallback from 'use-debounce/lib/useDebouncedCallback';

const { Option } = Select;
const ButtonGroup = Button.Group;
const { SubMenu } = Menu;

interface HeaderProps {
  node?: any;
  canvas: Topology;
  data: {
    type: number;
    node: Node;
    line: null | Line;
    multi: Pen[];
    nodes: Node[];
    locked: boolean;
  };
  embed?: boolean;
  showLeftTool: Function;
  onChange?: Function;
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

const initLineData = {
  fromArrow: 'null',
  toArrow: 'triangleSolid',
  dash: 0,
  name: 'line',
  strokeStyle: '#111111',
  lineWidth: 1,
};

const Header = ({
  node,
  canvas,
  data,
  embed = false,
  showLeftTool,
  onChange,
}: HeaderProps) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  // const appKey = getSearchParamValue(location.search, 'appKey');
  // const article = useSelector((state: any) => state.article.article);
  // const saveStatus = useSelector((state: any) => state.article.saveStatus);
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

  // 字体相关设置
  const [font, setFont] = useState<FontProps>(initFont);

  // 线形
  const [lineData, setLineData] = useState<LineProps>(initLineData);
  // 背景 网格
  const [backGrid, setBackGrid] = useState<boolean>(true);
  // 背景 颜色
  const [backGround, setBackGround] = useState('');

  const [nodeBackGround, setNodeBackGround] = useState('');
  //
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

  // useEffect(() => {
  //   if (data) {
  //     handleSave.callback();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [data]);

  useEffect(() => {
    switch (data.type) {
      case 0: // node
        setLineData({
          ...lineData,
          dash: data.node['dash'],
          strokeStyle: data.node['strokeStyle'],
          lineWidth: data.node['lineWidth'],
        });
        setNodeBackGround(data.node['fillStyle']);
        // @ts-ignore
        setFont({ ...font, ...data.node['font'] });
        break;
      case 1: // line
        let {
          fromArrow,
          toArrow,
          dash,
          name,
          strokeStyle,
          lineWidth,
        } = data.line ? data.line : initLineData;
        setLineData({
          ...lineData,
          fromArrow,
          toArrow,
          dash,
          name,
          strokeStyle,
          lineWidth,
        });
        setFont(initFont);
        break;
      case 2: // multi
        setFont(initFont);
        // setLineData(initLineData);
        break;
      default:
        setFont(initFont);
        setLineData(initLineData);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  //  设置字体相关样式
  useEffect(() => {
    canvas.activeLayer.pens.map(
      (item) => (item.font = { ...item.font, ...font } as Pen['font'])
    );
    canvas.updateProps();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [font]);

  /**
   * 设置其他样式
   */
  useEffect(() => {
    switch (data.type) {
      case 0: // node
        // @ts-ignore
        data.node['dash'] = lineData['dash'];
        // @ts-ignore
        data.node['strokeStyle'] = lineData['strokeStyle'];
        // @ts-ignore
        data.node['lineWidth'] = parseInt(lineData['lineWidth']);
        data.node['fillStyle'] = nodeBackGround;
        break;
      case 1: // line
        for (const key in lineData) {
          // @ts-ignore
          data.line[key] = lineData[key];
        }
        data.line?.calcControlPoints();
        break;
      case 2: // multi
        data.nodes.map((item: any) => {
          item['dash'] = lineData['dash'];
          item['strokeStyle'] = lineData['strokeStyle'];
          // @ts-ignore
          item['lineWidth'] = parseInt(lineData['lineWidth']);
          if (item.type === 1) {
            item['name'] = lineData.name;
            item['fromArrow'] = lineData.fromArrow;
            item['toArrow'] = lineData.toArrow;
          } else {
            item['fillStyle'] = nodeBackGround;
          }
          return item;
        });
        break;
      default:
        break;
    }
    canvas.updateProps();
  }, [
    canvas,
    data.line,
    data.node,
    data.nodes,
    data.type,
    lineData,
    nodeBackGround,
  ]);

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
    // const C2S = window.C2S;
    //   const ctx = new C2S(canvas.canvas.width + 200, canvas.canvas.height + 200);
    //   if (canvas.data.pens) {
    //     for (const item of canvas.data.pens) {
    //       item.render(ctx);
    //     }
    //   }
    //   let mySerializedSVG = ctx.getSerializedSvg();
    //   mySerializedSVG = mySerializedSVG.replace(
    //     "<defs/>",
    //     `<defs>
    //   <style type="text/css">
    //     @font-face {
    //       font-family: 'topology';
    //       src: url('http://at.alicdn.com/t/font_1331132_h688rvffmbc.ttf?t=1569311680797') format('truetype');
    //     }
    //   </style>
    // </defs>`
    //   );
    //   mySerializedSVG = mySerializedSVG.replace(/--le5le--/g, "&#x");
    //   const urlObject = window.URL || window;
    //   const export_blob = new Blob([mySerializedSVG]);
    //   const url = urlObject.createObjectURL(export_blob);
    //   const a = document.createElement("a");
    //   a.setAttribute("download", `${title || "无标题"}.svg`);
    //   a.setAttribute("href", url);
    //   const evt = document.createEvent("MouseEvents");
    //   evt.initEvent("click", true, true);
    //   a.dispatchEvent(evt);
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
        // const overwriteThumbnail = node && node.thumbnail ? true : false;

        // const res = canvas.toImage();
        // let file;

        // if (overwriteThumbnail) {
        //   file = dataURLtoFile(
        //     res,
        //     node.thumbnail.substr(node.thumbnail.lastIndexOf('/') + 1)
        //   );
        // } else {
        // file = dataURLtoFile(res, `${title || '无标题'}.png`);
        // }

        // let uptoken;
        // if (overwriteThumbnail) {
        // const res: any = await api.auth.getUptokenOverWrite(
        //   article.thumbnail.substr(article.thumbnail.lastIndexOf('/') + 1),
        // );
        // if (res.statusCode === '200') {
        //   uptoken = res.result;
        // } else {
        //   alert('获取七牛TOKEN失败');
        // }
        // } else {
        //   uptoken = uploadToken;
        // }
        // uploadImage(uptoken, file, overwriteThumbnail, function (url: any) {
        // 更新
        if (onChange) {
          canvas.data.grid = false;
          // dispatch(
          //   editDraw(
          //     article._key,
          //     title,
          //     article.type,
          //     (JSON.stringify(canvas.data) as unknown) as ArticleDetail,
          //     undefined,
          //     url,
          //   ),
          // );
          onChange(JSON.stringify(canvas.data), title);
          // } else {
          // 新增
          // if (appKey) {
          // let addTaskRes: any = await api.task.addTask({
          //   groupKey: groupKey,
          //   labelKey: null,
          //   title: addInput,
          // });
          // if (addTaskRes.msg === 'OK') {
          //   dispatch(setMessage(true, '新增任务成功', 'success'));
          // } else {
          //   dispatch(setMessage(true, addTaskRes.msg, 'error'));
          // }
          // }
        }
        // });
        break;
      }
      case 'save_json':
        FileSaver.saveAs(
          new Blob([JSON.stringify(canvas.data)], {
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

  const changeColor = (e: any) => {
    canvas.data.bkColor = `rgba(${e.rgb.r},${e.rgb.g},${e.rgb.b},${e.rgb.a})`;
    setBackGround(canvas.data.bkColor);
    canvas.updateProps();
  };

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
        setFont({ ...font, color: rgbColor });
        break;
      case 2:
        setLineData({ ...lineData, strokeStyle: rgbColor });
        break;
      case 3:
        setNodeBackGround(rgbColor);
        break;
      default:
    }
    //setDisplayColorPicker({show:false,type:colorType})
    canvas.updateProps();
  };

  /**
   * 延时保存
   */

  // const handleSave = useDebouncedCallback(() => {
  //   canvas.data.grid = false;
  //   onHandleSelect({ key: 'save' });
  // }, 1000 * 30);

  return (
    <>
      <div className="menu-container">
        <Menu mode="horizontal" onClick={onHandleSelect}>
          <SubMenu
            title={
              <span className="submenu-title-wrapper">
                {/* <Icon type="file" /> */}
                文件
              </span>
            }      
          >
            <Menu.Item key="create_new">
              <svg
                width="14px"
                height="16px"
                viewBox="0 0 14 16"
                version="1.1"
                className="svg-icon"
              >
                <title>新建文件@1x</title>
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
                    transform="translate(-12.000000, -163.000000)"
                    fill="#0A0A0A"
                    fillRule="nonzero"
                  >
                    <g
                      id="新建文件"
                      transform="translate(12.000000, 163.000000)"
                    >
                      <path
                        d="M6.4681875,13.905 L1.6875,13.905 C1.427625,13.905 1.215,13.6940625 1.215,13.4341875 L1.215,5.535 L4.3875,5.535 C5.022,5.535 5.535,5.022 5.535,4.3875 L5.535,1.755 C5.535,1.4563125 5.7763125,1.215 6.075,1.215 L10.8675,1.215 C11.127375,1.215 11.34,1.4259375 11.34,1.6858125 L11.34,8.1 C11.34,8.4358125 11.6116875,8.7075 11.9475,8.7075 C12.2833125,8.7075 12.555,8.4358125 12.555,8.1 L12.555,1.6858125 C12.555,0.756 11.7973125,0 10.8675,0 L4.357125,0 C4.3520625,0 4.347,0 4.343625,0.0016875 C4.3385625,0.0016875 4.3335,0.0016875 4.3284375,0.003375 C4.3216875,0.003375 4.316625,0.0050625 4.309875,0.0050625 C4.3065,0.0050625 4.3014375,0.00675 4.2980625,0.00675 C4.2913125,0.0084375 4.2845625,0.0084375 4.2795,0.010125 C4.276125,0.010125 4.27275,0.0118125 4.269375,0.0118125 C4.262625,0.0135 4.255875,0.0151875 4.2508125,0.0151875 C4.2474375,0.0151875 4.2440625,0.016875 4.2406875,0.016875 C4.2339375,0.0185625 4.228875,0.02025 4.222125,0.0219375 C4.21875,0.023625 4.215375,0.023625 4.212,0.0253125 C4.2069375,0.027 4.2001875,0.0286875 4.195125,0.030375 C4.19175,0.0320625 4.1866875,0.03375 4.1833125,0.03375 L4.168125,0.0388125 C4.1630625,0.0405 4.1596875,0.0421875 4.154625,0.043875 C4.1495625,0.0455625 4.1461875,0.04725 4.141125,0.0489375 C4.1360625,0.050625 4.131,0.054 4.1259375,0.0556875 L4.1158125,0.06075 C4.11075,0.064125 4.1056875,0.0658125 4.100625,0.0691875 L4.0905,0.07425 C4.0854375,0.077625 4.0786875,0.081 4.073625,0.084375 C4.07025,0.0860625 4.0685625,0.08775 4.0651875,0.0894375 C4.060125,0.0928125 4.053375,0.0961875 4.0483125,0.0995625 C4.0449375,0.10125 4.04325,0.1029375 4.039875,0.104625 C4.0348125,0.108 4.02975,0.111375 4.0246875,0.1164375 C4.0213125,0.118125 4.019625,0.1215 4.01625,0.1231875 C4.0111875,0.1265625 4.006125,0.1299375 4.0010625,0.135 C3.9976875,0.138375 3.9943125,0.14175 3.98925,0.145125 C3.985875,0.1485 3.9808125,0.151875 3.9774375,0.15525 C3.9706875,0.162 3.9639375,0.1670625 3.9571875,0.1738125 L3.9555,0.1755 L0.1755,3.9555 L0.1738125,3.9571875 C0.1670625,3.9639375 0.162,3.9706875 0.15525,3.9774375 C0.151875,3.9808125 0.1485,3.985875 0.145125,3.98925 C0.14175,3.992625 0.138375,3.996 0.135,4.0010625 C0.131625,4.006125 0.1265625,4.0111875 0.1231875,4.01625 C0.1215,4.019625 0.118125,4.0213125 0.1164375,4.0246875 C0.1130625,4.02975 0.108,4.0348125 0.104625,4.0415625 C0.1029375,4.0449375 0.10125,4.046625 0.0995625,4.05 C0.0961875,4.0550625 0.0928125,4.0618125 0.0894375,4.066875 C0.08775,4.07025 0.0860625,4.0719375 0.084375,4.0753125 C0.081,4.080375 0.077625,4.087125 0.07425,4.0921875 C0.0725625,4.0955625 0.070875,4.0989375 0.0691875,4.100625 C0.0658125,4.1056875 0.064125,4.11075 0.06075,4.1158125 L0.0556875,4.1259375 C0.054,4.131 0.050625,4.1360625 0.0489375,4.141125 C0.04725,4.1461875 0.0455625,4.1495625 0.043875,4.154625 C0.0421875,4.1596875 0.0405,4.1630625 0.0388125,4.168125 L0.03375,4.1833125 C0.0320625,4.1866875 0.030375,4.19175 0.030375,4.195125 C0.0286875,4.2001875 0.027,4.2069375 0.0253125,4.212 C0.023625,4.215375 0.023625,4.21875 0.0219375,4.222125 C0.02025,4.228875 0.0185625,4.2339375 0.016875,4.2406875 C0.016875,4.2440625 0.0151875,4.2474375 0.0151875,4.2508125 C0.0135,4.2575625 0.0118125,4.2643125 0.0118125,4.269375 C0.0118125,4.27275 0.010125,4.276125 0.010125,4.2795 C0.0084375,4.28625 0.0084375,4.293 0.00675,4.2980625 C0.00675,4.3014375 0.0050625,4.3065 0.0050625,4.309875 C0.0050625,4.3149375 0.003375,4.3216875 0.003375,4.3284375 C0.003375,4.3335 0.003375,4.3385625 0.0016875,4.343625 C0.0016875,4.3486875 0.0016875,4.35375 0,4.357125 L0,13.4341875 C0,14.364 0.7576875,15.12 1.6875,15.12 L6.4681875,15.12 C6.804,15.12 7.0756875,14.8483125 7.0756875,14.5125 C7.0756875,14.1766875 6.804,13.905 6.4681875,13.905 Z M1.765125,4.0888125 L4.0905,1.7634375 C4.174875,1.6790625 4.3216875,1.738125 4.3216875,1.859625 L4.3216875,4.32 L1.859625,4.32 C1.7398125,4.32 1.6790625,4.174875 1.765125,4.0888125 Z"
                        id="形状"
                      ></path>
                      <path
                        d="M13.5,11.61 L11.745,11.61 C11.67075,11.61 11.61,11.54925 11.61,11.475 L11.61,9.72 C11.61,9.423 11.367,9.18 11.07,9.18 C10.773,9.18 10.53,9.423 10.53,9.72 L10.53,11.475 C10.53,11.54925 10.46925,11.61 10.395,11.61 L8.64,11.61 C8.343,11.61 8.1,11.853 8.1,12.15 C8.1,12.447 8.343,12.69 8.64,12.69 L10.395,12.69 C10.46925,12.69 10.53,12.75075 10.53,12.825 L10.53,14.58 C10.53,14.877 10.773,15.12 11.07,15.12 C11.367,15.12 11.61,14.877 11.61,14.58 L11.61,12.825 C11.61,12.75075 11.67075,12.69 11.745,12.69 L13.5,12.69 C13.797,12.69 14.04,12.447 14.04,12.15 C14.04,11.853 13.797,11.61 13.5,11.61 Z"
                        id="路径"
                      ></path>
                    </g>
                  </g>
                </g>
              </svg>
              新建文件
            </Menu.Item>
            <Menu.Item key="import_json">
              <svg
                width="16px"
                height="16px"
                viewBox="0 0 16 16"
                version="1.1"
                className="svg-icon"
              >
                <title>打开本地文件@1x</title>
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
                    transform="translate(-11.000000, -212.000000)"
                    fill="#0A0A0A"
                    fillRule="nonzero"
                    stroke="#0A0A0A"
                    strokeWidth="0.528"
                  >
                    <g
                      id="打开本地文件"
                      transform="translate(12.000000, 213.000000)"
                    >
                      <path
                        d="M6.81664606,11.67822 C6.81664606,11.4983766 6.95587969,11.3533416 7.13572311,11.3533416 C7.31556654,11.3533416 7.46060157,11.4983766 7.46060157,11.67822 L7.46060157,13.7551215 C7.46060157,13.934965 7.31556654,14.08 7.13572311,14.08 C6.95587969,14.08 6.81664606,13.934965 6.81664606,13.7551215 L6.81664606,11.67822 Z"
                        id="路径"
                      ></path>
                      <path
                        d="M4.20021426,14.08 C4.02037083,14.08 3.87533581,13.934965 3.87533581,13.7551215 C3.87533581,13.5810795 4.02037083,13.4360445 4.20021426,13.4360445 L10.0770334,13.4360445 C10.2510754,13.4360445 10.3961104,13.5810795 10.3961104,13.7551215 C10.3961104,13.934965 10.2510754,14.08 10.0770334,14.08 L4.20021426,14.08 Z"
                        id="路径"
                      ></path>
                      <path
                        d="M0.585941496,0 L13.6855047,0 C13.847944,0 13.992979,0.0638154138 14.1032056,0.174042028 C14.2076308,0.278467241 14.2714462,0.423502269 14.2714462,0.585941496 L14.2714462,11.0690729 C14.2714462,11.2257108 14.2076308,11.3765472 14.1032056,11.4809724 C13.992979,11.5853976 13.847944,11.649213 13.6855047,11.649213 L0.585941496,11.649213 C0.423502269,11.649213 0.278467255,11.5853976 0.174042028,11.4809724 C0.0638154138,11.3765472 0,11.2257107 0,11.0690729 L0,0.585941496 C0,0.423502269 0.0638154138,0.278467255 0.174042028,0.174042028 C0.278467241,0.0638154138 0.423502269,0 0.585941496,0 Z M13.6274907,0.643955496 L0.643955496,0.643955496 L0.643955496,11.0052575 L13.6274907,11.0052575 L13.6274907,0.643955496 Z"
                        id="形状"
                      ></path>
                      <path
                        d="M0.458310669,9.08283478 C0.278467241,9.08283478 0.133432228,8.93779975 0.133432228,8.75795633 C0.133432228,8.5839143 0.278467255,8.43887927 0.458310669,8.43887927 L13.8131356,8.43887927 C13.992979,8.43887927 14.138014,8.5839143 14.138014,8.75795633 C14.138014,8.93779975 13.992979,9.08283478 13.8131356,9.08283478 L0.458310669,9.08283478 Z"
                        id="路径"
                      ></path>
                    </g>
                  </g>
                </g>
              </svg>
              打开本地文件
            </Menu.Item>
            <Menu.Divider>{}</Menu.Divider>
            <Menu.Item key="save">
              <svg
                width="14px"
                height="12px"
                viewBox="0 0 16 16"
                version="1.1"
                className="svg-icon"
              >
                <title>保存@1x</title>
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
                    transform="translate(-12.000000, -259.000000)"
                    fill="#0A0A0A"
                    fillRule="nonzero"
                  >
                    <g id="保存" transform="translate(12.000000, 259.000000)">
                      <path
                        d="M2.53125001,1.0125 C2.12845246,1.0125 1.74215245,1.17251069 1.45733157,1.45733157 C1.17251069,1.74215245 1.0125,2.12845246 1.0125,2.53125001 L1.0125,12.65625 C1.0125,13.0590475 1.17251069,13.4453476 1.45733157,13.7301684 C1.74215245,14.0149893 2.12845246,14.175 2.53125001,14.175 L12.65625,14.175 C13.0590475,14.175 13.4453476,14.0149893 13.7301684,13.7301684 C14.0149893,13.4453476 14.175,13.0590475 14.175,12.65625 L14.175,2.53125001 C14.175,2.12845246 14.0149893,1.74215245 13.7301684,1.45733157 C13.4453476,1.17251069 13.0590475,1.0125 12.65625,1.0125 L2.53125001,1.0125 L2.53125001,1.0125 Z M2.53125001,-5.87250051e-09 L12.65625,-5.87250051e-09 C13.3275792,-5.87250051e-09 13.9714126,0.266684492 14.446114,0.741385953 C14.9208155,1.21608741 15.1875,1.85992076 15.1875,2.53125001 L15.1875,12.65625 C15.1875,13.3275792 14.9208155,13.9714126 14.446114,14.446114 C13.9714126,14.9208155 13.3275792,15.1875 12.65625,15.1875 L2.53125001,15.1875 C1.85992076,15.1875 1.21608741,14.9208155 0.741385953,14.446114 C0.266684492,13.9714126 -5.87249904e-09,13.3275792 -5.87249904e-09,12.65625 L-5.87249904e-09,2.53125001 C-5.87249904e-09,1.85992076 0.266684492,1.21608741 0.741385953,0.741385953 C1.21608741,0.266684492 1.85992076,-5.87250051e-09 2.53125001,-5.87250051e-09 Z"
                        id="形状"
                      ></path>
                      <path
                        d="M3.54374999,1.0125 L3.54374999,5.56875 L11.64375,5.56875 L11.64375,1.0125 L12.65625,1.0125 L12.65625,5.724675 C12.65625,6.1975125 12.2031562,6.58125 11.64375,6.58125 L3.54374999,6.58125 C2.98434374,6.58125 2.53125001,6.1975125 2.53125001,5.724675 L2.53125001,1.0125 L3.54374999,1.0125 Z"
                        id="路径"
                      ></path>
                      <path
                        d="M10.125,2.025 L10.125,2.025 C10.4625,2.025 10.63125,2.19375 10.63125,2.53125001 L10.63125,4.05 C10.63125,4.3875 10.4625,4.55624999 10.125,4.55624999 L10.125,4.55624999 C9.7875,4.55624999 9.61875,4.3875 9.61875,4.05 L9.61875,2.53125001 C9.61875,2.19375001 9.7875,2.025 10.125,2.025 L10.125,2.025 Z"
                        id="路径"
                      ></path>
                    </g>
                  </g>
                </g>
              </svg>
              保存
            </Menu.Item>
            <Menu.Item key="save_json">
              <svg
                width="17px"
                height="15px"
                viewBox="0 0 17 15"
                version="1.1"
                className="svg-icon"
              >
                <title>下载JSON文件@1x</title>
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
                    transform="translate(-12.000000, -306.000000)"
                    fill="#0A0A0A"
                    fillRule="nonzero"
                  >
                    <g
                      id="下载JSON文件"
                      transform="translate(12.000000, 306.000000)"
                    >
                      <path
                        d="M7.568,11.3155 C7.68,11.4275 7.832,11.4915 8,11.4915 C8.16,11.4915 8.312,11.4275 8.432,11.3155 L12.536,7.2115 C12.648,7.0995 12.712,6.9475 12.712,6.7795 C12.712,6.6675 12.68,6.5635 12.632,6.4755 C12.592,6.4035 12.536,6.3475 12.472,6.2915 L12.416,6.2515 C12.32,6.1955 12.216,6.1635 12.104,6.1635 C11.944,6.1635 11.792,6.2275 11.672,6.3395 L8.6,9.4115 L8.6,0.6355 C8.6,0.2995 8.344,0.0115 8.008,0.0035 C7.664,-0.0045 7.384,0.2675 7.384,0.6115 L7.384,9.4115 L4.32,6.3475 C4.208,6.2355 4.056,6.1715 3.888,6.1715 C3.72,6.1715 3.576,6.2355 3.456,6.3475 C3.344,6.4595 3.28,6.6115 3.28,6.7795 C3.28,6.9395 3.344,7.0915 3.456,7.2115 L7.568,11.3155 Z"
                        id="路径"
                      ></path>
                      <path
                        d="M15.392,10.6915 C15.056,10.6915 14.784,10.9635 14.784,11.2995 L14.784,12.9395 C14.784,13.0595 14.688,13.1555 14.568,13.1555 L1.432,13.1555 C1.312,13.1555 1.216,13.0595 1.216,12.9395 L1.216,11.2995 C1.216,10.9635 0.944,10.6915 0.608,10.6915 C0.272,10.6915 0,10.9635 0,11.2995 L0,12.9395 C0,13.7235 0.64,14.3715 1.432,14.3715 L14.576,14.3715 C15.36,14.3715 16.008,13.7315 16.008,12.9395 L16.008,11.2995 C16,10.9635 15.728,10.6915 15.392,10.6915 Z"
                        id="路径"
                      ></path>
                    </g>
                  </g>
                </g>
              </svg>
              下载时光绘图.tdraw文件
            </Menu.Item>
            <Menu.Item key="save_png">
              <svg
                width="17px"
                height="16px"
                viewBox="0 0 17 16"
                version="1.1"
                className="svg-icon"
              >
                <title>下载PNG图片@1x</title>
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
                    transform="translate(-10.000000, -356.000000)"
                    fill="#0A0A0A"
                    fillRule="nonzero"
                    stroke="#0A0A0A"
                    strokeWidth="0.5"
                  >
                    <g
                      id="下载PNG图片"
                      transform="translate(11.000000, 357.000000)"
                    >
                      <path
                        d="M12.339864,9.595098 L12.339864,13.99113 C12.339864,14.14665 12.215448,14.281434 12.04956,14.281434 C11.883672,14.281434 11.759256,14.157018 11.759256,13.99113 L11.759256,9.58473 C11.759256,9.42921 11.883672,9.294426 12.04956,9.294426 C12.215448,9.304794 12.350232,9.42921 12.339864,9.595098 L12.339864,9.595098 Z"
                        id="路径"
                      ></path>
                      <path
                        d="M9.830808,11.368026 L12.25692,13.794138 C12.30876,13.845978 12.339864,13.918554 12.339864,14.001498 C12.339864,14.084442 12.30876,14.14665 12.25692,14.208858 C12.20508,14.260698 12.132504,14.291802 12.04956,14.291802 C11.966616,14.291802 11.904408,14.260698 11.8422,14.208858 L9.416088,11.782746 C9.364248,11.730906 9.333144,11.65833 9.333144,11.575386 C9.333144,11.492442 9.364248,11.430234 9.416088,11.368026 C9.467928,11.316186 9.540504,11.285082 9.623448,11.285082 C9.706392,11.285082 9.789336,11.316186 9.830808,11.368026 Z"
                        id="路径"
                      ></path>
                      <path
                        d="M14.475672,11.285082 C14.558616,11.285082 14.620824,11.326554 14.683032,11.368026 C14.734872,11.419866 14.765976,11.492442 14.765976,11.575386 C14.765976,11.647962 14.734872,11.720538 14.683032,11.782746 L12.25692,14.19849 C12.20508,14.25033 12.132504,14.281434 12.04956,14.281434 C11.966616,14.281434 11.904408,14.25033 11.8422,14.19849 C11.728152,14.09481 11.728152,13.908186 11.8422,13.794138 L14.268312,11.368026 C14.320152,11.316186 14.392728,11.285082 14.475672,11.285082 Z M3.5478,2.150874 C2.749464,2.150874 2.09628,2.79369 2.09628,3.592026 C2.09628,4.390362 2.749464,5.033178 3.5478,5.033178 C4.335768,5.033178 4.99932,4.390362 4.99932,3.592026 C4.988952,2.79369 4.335768,2.150874 3.5478,2.150874 Z M3.5478,4.359258 C3.13308,4.359258 2.790936,4.017114 2.790936,3.602394 C2.790936,3.187674 3.13308,2.84553 3.5478,2.84553 C3.96252,2.84553 4.304664,3.187674 4.304664,3.602394 C4.315032,4.017114 3.96252,4.359258 3.5478,4.359258 Z"
                        id="形状"
                      ></path>
                      <path
                        d="M7.466904,12.041946 L1.090584,12.041946 C0.883224,12.041946 0.717336,11.876058 0.717336,11.668698 L0.717336,1.145178 C0.717336,0.937818 0.883224,0.77193 1.090584,0.77193 L14.289048,0.77193 C14.496408,0.77193 14.662296,0.937818 14.662296,1.145178 L14.662296,7.023834 C14.662296,7.231194 14.828184,7.397082 15.035544,7.397082 C15.242904,7.397082 15.408792,7.231194 15.408792,7.023834 L15.408792,1.072602 C15.408792,0.491994 14.931864,0.004698 14.340888,0.004698 L1.080216,0.004698 C0.499608,0.004698 0.012312,0.481626 0.012312,1.072602 L0.012312,11.741274 C0.012312,12.321882 0.48924,12.809178 1.080216,12.809178 L7.48764,12.809178 C7.695,12.809178 7.860888,12.64329 7.860888,12.43593 L7.860888,12.404826 C7.840152,12.207834 7.674264,12.041946 7.466904,12.041946 Z"
                        id="路径"
                      ></path>
                      <path
                        d="M0.520344,10.092762 L0.064152,9.626202 L3.734424,6.930522 C4.076568,6.588378 4.605336,6.515802 5.030424,6.723162 L8.648856,8.091738 C8.83548,8.18505 9.04284,8.143578 9.19836,8.008794 L14.807448,3.31209 L15.26364,3.77865 L9.654552,8.485722 C9.312408,8.817498 8.78364,8.900442 8.358552,8.682714 L4.74012,7.314138 C4.553496,7.220826 4.335768,7.262298 4.190616,7.397082 L0.520344,10.092762 Z"
                        id="路径"
                      ></path>
                    </g>
                  </g>
                </g>
              </svg>
              下载PNG图片
            </Menu.Item>
            {/* <Menu.Item key="save_svg">保存为SVG</Menu.Item> */}
          </SubMenu>

          <SubMenu
            title={
              <span className="submenu-title-wrapper">
                {/* <Icon type="edit" /> */}
                编辑
              </span>
            }
          >
            <Menu.Item key="undo">
              <svg
                width="14px"
                height="12px"
                viewBox="0 0 14 12"
                version="1.1"
                className="svg-icon"
              >
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
              撤销 <span className="ctrl-icon"> Ctrl + Z</span>
            </Menu.Item>
            <Menu.Item key="redo">
              <svg
                width="14px"
                height="12px"
                viewBox="0 0 14 12"
                version="1.1"
                className="svg-icon"
              >
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
              恢复 <span className="ctrl-icon"> Ctrl+Shift + Z</span>
            </Menu.Item>
            <Menu.Divider>{}</Menu.Divider>
            <Menu.Item key="copy">
              <svg
                width="16px"
                height="16px"
                viewBox="0 0 16 16"
                version="1.1"
                className="svg-icon"
              >
                <title>复制@1x</title>
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
                    transform="translate(-199.000000, -310.000000)"
                    fill="#0A0A0A"
                    fillRule="nonzero"
                  >
                    <g id="复制" transform="translate(199.000000, 310.000000)">
                      <path
                        d="M3.6,10.4 C3.8209139,10.4 4,10.5790861 4,10.8 C4,11.0209139 3.8209139,11.2 3.6,11.2 L2,11.2 C0.8954305,11.2 0,10.3045695 0,9.2 L0,2 C0,0.8954305 0.8954305,0 2,0 L9.2,0 C10.3045695,0 11.2,0.8954305 11.2,2 L11.2,3.6 C11.2,3.8209139 11.0209139,4 10.8,4 C10.5790861,4 10.4,3.8209139 10.4,3.6 L10.4,2 C10.4,1.3372583 9.8627417,0.8 9.2,0.8 L2,0.8 C1.3372583,0.8 0.8,1.3372583 0.8,2 L0.8,9.2 C0.8,9.8627417 1.3372583,10.4 2,10.4 L3.6,10.4 Z M6.8,5.6 C6.1372583,5.6 5.6,6.1372583 5.6,6.8 L5.6,14 C5.6,14.6627417 6.1372583,15.2 6.8,15.2 L14,15.2 C14.6627417,15.2 15.2,14.6627417 15.2,14 L15.2,6.8 C15.2,6.1372583 14.6627417,5.6 14,5.6 L6.8,5.6 Z M6.8,4.8 L14,4.8 C15.1045695,4.8 16,5.6954305 16,6.8 L16,14 C16,15.1045695 15.1045695,16 14,16 L6.8,16 C5.6954305,16 4.8,15.1045695 4.8,14 L4.8,6.8 C4.8,5.6954305 5.6954305,4.8 6.8,4.8 Z"
                        id="形状"
                      ></path>
                    </g>
                  </g>
                </g>
              </svg>
              复制 <span className="ctrl-icon"> Ctrl + C</span>
            </Menu.Item>
            <Menu.Item key="cut">
              <svg
                width="14px"
                height="15px"
                viewBox="0 0 14 15"
                version="1.1"
                className="svg-icon"
              >
                <title>剪切@1x</title>
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
                    transform="translate(-200.000000, -262.000000)"
                    fill="#0A0A0A"
                    fillRule="nonzero"
                  >
                    <g id="剪切" transform="translate(200.000000, 262.000000)">
                      <path
                        d="M10.573125,8.47484999 C12.164037,8.47484999 13.453125,9.764322 13.453125,11.35485 C13.453125,12.945762 12.164037,14.23485 10.573125,14.23485 C8.982213,14.23485 7.693125,12.945762 7.693125,11.35485 C7.693125,11.050338 7.74112499,10.757346 7.828677,10.482402 C7.77798901,10.41021 7.729989,10.325346 7.67968499,10.236642 L6.73581299,8.55664199 L5.81997299,10.186338 C5.76198898,10.288482 5.70246899,10.39485 5.63718899,10.48125 C5.72512501,10.756962 5.773125,11.050338 5.773125,11.35485 C5.773125,12.945762 4.484037,14.23485 2.89312499,14.23485 C1.30259699,14.23485 0.0131249869,12.945762 0.0131249869,11.35485 C0.0131249869,9.764322 1.30259699,8.47484999 2.89312499,8.47484999 C3.408453,8.47484999 3.89114099,8.61193799 4.30931699,8.84925 L5.801541,6.893922 L2.310213,0.681569994 C2.151237,0.402786 2.02720501,0.214241996 2.30214899,0.0533459925 C2.577093,-0.107550011 2.597061,0.181985991 2.756037,0.461153992 L6.733125,5.673186 L10.709829,0.461153993 C10.868421,0.181985991 10.888773,-0.107166004 11.163717,0.0533459925 C11.439045,0.214241996 11.348037,0.352097989 11.189445,0.630882 L7.66739699,6.89776201 L9.15693301,8.84925 C9.57510901,8.612322 10.057797,8.47484999 10.573125,8.47484999 Z M2.89312499,9.24284999 C1.72653299,9.24284999 0.781124985,10.188258 0.781124985,11.35485 C0.781124985,12.521442 1.72653299,13.46685 2.89312499,13.46685 C4.05933299,13.46685 5.005125,12.521442 5.005125,11.35485 C5.005125,10.188258 4.05933301,9.24284999 2.89312499,9.24284999 Z M6.733125,6.93885 C6.415173,6.93885 6.15712501,7.19689799 6.15712501,7.51484999 C6.15712501,7.83280199 6.415173,8.09084999 6.733125,8.09084999 C7.051077,8.09084999 7.30912499,7.83280199 7.30912499,7.51484999 C7.30912499,7.19689799 7.051077,6.93885 6.733125,6.93885 Z M8.461125,11.35485 C8.461125,12.521442 9.40691699,13.46685 10.573125,13.46685 C11.739333,13.46685 12.685125,12.521442 12.685125,11.35485 C12.685125,10.188258 11.739333,9.24284999 10.573125,9.24284999 C9.40691699,9.24284999 8.461125,10.188258 8.461125,11.35485 Z"
                        id="形状"
                      ></path>
                    </g>
                  </g>
                </g>
              </svg>
              剪切 <span className="ctrl-icon"> Ctrl + X</span>
            </Menu.Item>
            <Menu.Item key="paste">
              <svg
                width="17px"
                height="17px"
                viewBox="0 0 17 17"
                version="1.1"
                className="svg-icon"
              >
                <title>粘贴@1x</title>
                <desc>Created with Sketch.</desc>
                <g
                  id="时光绘图"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fillRule="evenodd"
                >
                  <g id="切图" transform="translate(-198.000000, -356.000000)">
                    <g id="粘贴" transform="translate(199.000000, 357.000000)">
                      <path
                        d="M6.8,5.6 C6.1372583,5.6 5.6,6.1372583 5.6,6.8 L5.6,14 C5.6,14.6627417 6.1372583,15.2 6.8,15.2 L14,15.2 C14.6627417,15.2 15.2,14.6627417 15.2,14 L15.2,6.8 C15.2,6.1372583 14.6627417,5.6 14,5.6 L6.8,5.6 Z M6.8,4.8 L14,4.8 C15.1045695,4.8 16,5.6954305 16,6.8 L16,14 C16,15.1045695 15.1045695,16 14,16 L6.8,16 C5.6954305,16 4.8,15.1045695 4.8,14 L4.8,6.8 C4.8,5.6954305 5.6954305,4.8 6.8,4.8 Z"
                        id="形状"
                        fill="#0A0A0A"
                        fillRule="nonzero"
                      ></path>
                      <path
                        d="M10.4453125,8 C10.7186875,8 10.9408281,8.21940625 10.94525,8.49171875 L10.9453125,8.5 L10.9453125,9.9296875 L12.375,9.9296875 C12.6511406,9.9296875 12.875,10.1535469 12.875,10.4296875 C12.875,10.7030625 12.6555937,10.9252031 12.3832812,10.929625 L12.375,10.9296875 L10.9453125,10.9296875 L10.9453125,12.359375 C10.9453125,12.6355156 10.7214531,12.859375 10.4453125,12.859375 C10.1719375,12.859375 9.94979688,12.6399687 9.945375,12.3676562 L9.9453125,12.359375 L9.9453125,10.9296875 L8.5,10.9296875 C8.22385937,10.9296875 8,10.7058281 8,10.4296875 C8,10.1563125 8.21940625,9.93417188 8.49171875,9.92975 L8.5,9.9296875 L9.9453125,9.9296875 L9.9453125,8.5 C9.9453125,8.22385937 10.1691719,8 10.4453125,8 Z"
                        id="路径"
                        fill="#0A0A0A"
                      ></path>
                      <path
                        d="M3.12916338,11 L3.12916338,11 L2,11 C0.8954305,11 0,10.1045695 0,9 L0,2 C0,0.8954305 0.8954305,0 2,0 L9,0 C10.1045695,0 11,0.8954305 11,2 L11,3.26728651 L11,3.26728651"
                        id="路径"
                        stroke="#0A0A0A"
                        strokeLinejoin="round"
                        strokeDasharray="2,2"
                      ></path>
                    </g>
                  </g>
                </g>
              </svg>
              粘贴 <span className="ctrl-icon"> Ctrl + V</span>
            </Menu.Item>
            {/* <Menu.Divider>{}</Menu.Divider>
            <Menu.Item key="all">全选</Menu.Item>
            <Menu.Item key="delete">删除</Menu.Item> */}
          </SubMenu>
          <SubMenu
            title={
              <span className="submenu-title-wrapper">
                {/* <Icon type="heat-map" /> */}
                视图
              </span>
            }
          >
            <Menu.Item onClick={() => scaleZoomOut()}>
              <Icon type="zoom-in" />
              放大 <span className="ctrl-icon">Ctr+Scroll Down</span>
            </Menu.Item>
            <Menu.Item onClick={() => scaleZoomIn()}>
              <Icon type="zoom-out" />
              缩小 <span className="ctrl-icon">Ctr+Scroll UP</span>
            </Menu.Item>
            <Menu.Divider>{}</Menu.Divider>
            <Menu.Item onClick={() => scaleZoom(0.5)}>
              <Icon type="" />
              50%
            </Menu.Item>
            <Menu.Item onClick={() => scaleZoom(1)}>
              <Icon type="" />
              100%
            </Menu.Item>
            <Menu.Item onClick={() => scaleZoom(1.5)}>
              {' '}
              <Icon type="" />
              150%
            </Menu.Item>
            <Menu.Item onClick={() => scaleZoom(2)}>
              <Icon type="" />
              200%
            </Menu.Item>
            <Menu.Divider>{}</Menu.Divider>
            <Menu.Item onClick={() => scaleZoom(1)}>
              <Icon type="" />
              重置
            </Menu.Item>
            <Menu.Divider>{}</Menu.Divider>
            <Menu.Item
              onClick={() => {
                setTool(!tool);
              }}
            >
              <Icon type="" />
              {!tool ? '显示' : '隐藏'}图形库
            </Menu.Item>
          </SubMenu>
          <SubMenu
            title={
              <span className="submenu-title-wrapper">
                {/* <Icon type="html5" /> */}
                页面
              </span>
            }
          >
            <SubMenu
              key="sub3"
              title={
                <>
                  <Icon type="bg-colors" />
                  背景颜色
                </>
              }
              children={
                <ChromePicker color={backGround} onChange={changeColor} />
              }
            />

            <Menu.Item onClick={() => changeGrid()}>
              {' '}
              {backGrid ? <Icon type="check" /> : <Icon type="" />}网格显示
            </Menu.Item>
          </SubMenu>
          <SubMenu
            title={
              <span className="submenu-title-wrapper">
                {/* <Icon type="global" /> */}
                社区
              </span>
            }
          >
            <Menu.Item key="issues">
              <a
                href="https://baoku.qingtime.cn/timeos/home"
                rel="noopener noreferrer"
                target="_blank"
              >
                咨询与建议
              </a>
            </Menu.Item>
          </SubMenu>
        </Menu>
        {!editTitle ? (
          <span className="edit-title" onClick={() => setEditTitle(true)}>
            {title ? title : '请输入绘图标题'}
          </span>
        ) : (
          <Input
            placeholder="请输入绘图标题"
            style={{ width: '150px', margin: '7px 0 0 15px' }}
            value={title}
            onChange={(e) => {
              // dispatch(editArticleSaveStatus(-1));
              settitle(e.target.value);
              // handleSave.callback();
            }}
            onBlur={(e) => {
              setEditTitle(false);
            }}
          />
        )}

        <ButtonGroup style={{ display: 'inline-flex', alignItems: 'center' }}>
          {/* {saveStatus === -1 ? ( */}
            <Button onClick={() => onHandleSelect({ key: 'save' })}>
              保存
            </Button>
          {/* ) : saveStatus === 0 ? (
            <span style={{ marginRight: '16px' }}>保存中...</span>
          ) : (
            <span style={{ marginRight: '16px' }}>已保存</span>
          )} */}

          {/* {embed ? null : (
            <Button onClick={() => history.goBack()}>
              <Icon type="rollback" />
              返回
            </Button>
          )} */}
        </ButtonGroup>
      </div>
      <div className="toolbar">
        <div className="left-bar">
          <Tooltip placement="bottomLeft" title="撤销">
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
          <Tooltip placement="bottomLeft" title="恢复">
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
          <Tooltip placement="bottomLeft" title="字体">
            <Select
              value={font.fontFamily}
              size="small"
              className="select-consume"
              style={{ width: '150px' }}
              onChange={(e: any) => setFont({ ...font, fontFamily: e })}
            >
              <Option value="Arial">Arial</Option>
              <Option value="Verdana">Verdana</Option>
              <Option value="Georgia">Georgia</Option>
              <Option value="Times New Roman">Times New Roman</Option>
              <Option value="Courier New">Courier New</Option>
              <Option value="Impact">Impact</Option>
              <Option value="Comic Sans MS">Comic Sans MS</Option>
              <Option value="Garamond">Garamond</Option>
              <Option value="Lucida Console">Lucida Console</Option>
              <Option value="SimSun">宋体</Option>
              <Option value="Microsoft YaHei">微软雅黑</Option>
            </Select>
          </Tooltip>
          <div className="toolbar_small_devider"></div>
          <Tooltip placement="bottomLeft" title="字体大小">
            <div className="toolbar_button">
              <Input
                type="number"
                className="no-border-color"
                value={font.fontSize}
                onChange={(e: any) => {
                  setFont({
                    ...font,
                    fontSize: e.target.value,
                  });
                }}
              />
            </div>
          </Tooltip>
          <div className="toolbar_small_devider"></div>
          <Tooltip placement="bottomLeft" title="粗体">
            <div
              className={`toolbar_button ${
                font.fontWeight === 'normal' ? 'null' : 'active'
              }`}
              key="weight"
              onClick={() => {
                setFont({
                  ...font,
                  fontWeight: font?.fontWeight === 'bold' ? 'normal' : 'bold',
                });
              }}
            >
              <Icon type="bold" />
            </div>
          </Tooltip>
          <Tooltip placement="bottomLeft" title="斜体">
            <div
              className={`toolbar_button ${
                font.fontStyle === 'normal' ? 'null' : 'active'
              }`}
              key="style"
              onClick={() => {
                setFont({
                  ...font,
                  fontStyle: font.fontStyle === 'normal' ? 'italic' : 'normal',
                });
              }}
            >
              <Icon type="italic" />
            </div>
          </Tooltip>
          <Tooltip placement="bottomLeft" title="文本颜色">
            <div
              className="toolbar_button"
              onClick={() => setDisplayColorPicker({ show: true, type: 1 })}
            >
              <Icon type="font-colors" style={{ color: font?.color }} />
              {consumeColorPicker(font?.color, 1)}
            </div>
          </Tooltip>
          <Tooltip placement="bottomLeft" title="水平对齐">
            <Select
              value={font.textAlign}
              size="small"
              className="select-consume"
              style={{ width: '50px' }}
              onChange={(e: any) => setFont({ ...font, textAlign: e })}
            >
              <Option value="left">
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
              </Option>
              <Option value="center">
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
              </Option>
              <Option value="right">
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
              </Option>
            </Select>
          </Tooltip>
          <Tooltip placement="bottomLeft" title="垂直对齐">
            <Select
              value={font.textBaseline}
              size="small"
              className="select-consume"
              style={{ width: '50px' }}
              onChange={(e: any) => setFont({ ...font, textBaseline: e })}
            >
              <Option value="top">
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
              </Option>
              <Option value="middle">
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
              </Option>
              <Option value="bottom">
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
              </Option>
            </Select>
          </Tooltip>
          {/* <Tooltip placement="bottomLeft" title="填充颜色">
          <div className="toolbar_button" onClick={() => setDisplayColorPicker({show:true,type:3})}>
            <Icon type="font-colors" style={{ color:  }} />
            {consumeColorPicker(font?.color, 3)}
          </div>
         
        </Tooltip> */}
          <div className="toolbar_devider"></div>
          <Tooltip title="线条颜色" placement="bottomLeft">
            <div
              className="toolbar_button "
              onClick={() => setDisplayColorPicker({ show: true, type: 2 })}
            >
              <Icon type="highlight" style={{ color: lineData?.strokeStyle }} />
              {consumeColorPicker(lineData?.strokeStyle, 2)}
            </div>
          </Tooltip>
          <Tooltip title="背景颜色" placement="bottomLeft">
            <div
              className="toolbar_button "
              onClick={() => setDisplayColorPicker({ show: true, type: 3 })}
            >
              <Icon type="bg-colors" style={{ color: nodeBackGround }} />
              {consumeColorPicker(nodeBackGround, 3)}
            </div>
          </Tooltip>
          <Tooltip title="线宽" placement="bottomLeft">
            <div className="toolbar_button ">
              <Input
                type="number"
                className="no-border-color"
                value={lineData?.lineWidth}
                onChange={(e: any) => {
                  setLineData({ ...lineData, lineWidth: e.target.value });
                }}
              />
            </div>
          </Tooltip>
          <Tooltip placement="bottomLeft" title="连线样式">
            <Select
              value={lineData?.dash}
              size="small"
              className="select-consume"
              style={{ width: '80px' }}
              onChange={(e: any) => setLineData({ ...lineData, dash: e })}
            >
              <Option value={0}>____</Option>
              <Option value={1}>----</Option>
              <Option value={2}>_ _ _</Option>
              <Option value={3}>- . -</Option>
            </Select>
          </Tooltip>
          <Tooltip placement="bottomLeft" title="连线类型">
            <Select
              value={lineData?.name}
              size="small"
              className="select-consume"
              style={{ width: '60px' }}
              onChange={(e: any) => {
                canvas.data.lineName = e;
                canvas.render();
                setLineData({ ...lineData, name: e });
              }}
            >
              <Option value="curve">
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
              </Option>
              <Option value="polyline">
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
              </Option>
              <Option value="line">
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
              </Option>
              {/* 脑图线,有点问题
             <Option value="mind">
              <div className="arrow-icon">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" strokeWidth="1">
                    <path d="M0 15 C0,8 50,0 85,0" />
                  </g>
                </svg>
              </div>
            </Option> */}
            </Select>
          </Tooltip>
          <Tooltip placement="bottomLeft" title="起点箭头">
            <Select
              value={lineData.fromArrow}
              size="small"
              style={{ width: '70px' }}
              className="select-consume"
              onChange={(e: any) => {
                /*   canvas.data.fromArrowType = e;
              canvas.render(); */
                setLineData({ ...lineData, fromArrow: e });
              }}
            >
              <Option value="null">
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
              </Option>
              <Option value="triangleSolid">
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
              </Option>
              <Option value="triangle">
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
              </Option>
              <Option value="diamondSolid">
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
              </Option>
              <Option value="diamond">
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
              </Option>
              <Option value="circleSolid">
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
              </Option>
              <Option value="circle">
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
              </Option>
              <Option value="line">
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
              </Option>
              <Option value="lineUp">
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
              </Option>
              <Option value="lineDown">
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
              </Option>
            </Select>
          </Tooltip>
          <Tooltip placement="bottomLeft" title="终点箭头">
            <Select
              value={lineData.toArrow}
              size="small"
              style={{ width: '70px' }}
              className="select-consume"
              onChange={(e: any) => {
                /* canvas.data.toArrowType = e;
              canvas.render(); */
                setLineData({ ...lineData, toArrow: e });
              }}
            >
              <Option value="null">
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
              </Option>
              <Option value="triangleSolid">
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
              </Option>
              <Option value="triangle">
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
              </Option>
              <Option value="diamondSolid">
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
              </Option>
              <Option value="diamond">
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
              </Option>
              <Option value="circleSolid">
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
              </Option>
              <Option value="circle">
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
              </Option>
              <Option value="line">
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
              </Option>
              <Option value="lineUp">
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
              </Option>
              <Option value="lineDown">
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
              </Option>
            </Select>
          </Tooltip>
        </div>

        <div className="right-bar">
          <div className="toolbar_devider"></div>
          {isLock ? (
            <Tooltip placement="bottomLeft" title="解锁">
              <div
                className={`toolbar_button ${isLock ? null : 'active'}`}
                onClick={() => {
                  setIsLock(false);
                  canvas.lock(0);
                }}
              >
                <Icon type="unlock" />
              </div>
            </Tooltip>
          ) : (
            <Tooltip placement="bottomLeft" title="锁定">
              <div
                className={`toolbar_button  ${isLock ? 'active' : null}`}
                onClick={() => {
                  setIsLock(true);
                  canvas.lock(2);
                }}
              >
                <Icon type="lock" />
              </div>
            </Tooltip>
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(Header);
