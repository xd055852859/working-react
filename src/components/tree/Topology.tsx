import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  Fragment,
  FC,
  useRef,
} from 'react';
import { Topology, Node, Line, Options, Pen } from '@topology/core';
import { alignNodes, layout, spaceBetween } from '@topology/layout';
import { register as registerFlow } from '@topology/flow-diagram'; // 流程图

import { register as registerActivity } from '@topology/activity-diagram'; // 活动图

import { register as registerClass } from '@topology/class-diagram'; // 类图

import { register as registerSequence } from '@topology/sequence-diagram'; // 时序图

import { register as registerMyself } from './customized-diagram/index';

import { Tools, imgTool } from './draw/config/config';
import Header from './draw/Header';
import NodeComponent from './draw/nodeComponent';
import BackgroundComponent from './draw/backgroundComponent';
import LineComponent from './draw/lineComponent';
import ToolModal from './draw/toolComponent';
import Multi from './draw/multiComponent';
import './Topology.css';

import { useLocation } from 'react-router-dom';
// import { getArticleById, clearArticle, editArticleSaveStatus } from '../redux/actions/articleActions';
// import { getQiniuToken } from '../redux/actions/authActions';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { getSearchParamValue } from '../../services/util';
// import { ArticleType } from '../interfaces/Article';
import Tooltip from '@material-ui/core/Tooltip';
import { IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import KeyboardOutlinedIcon from '@material-ui/icons/KeyboardOutlined';
import DrawShortcutPanel from './draw/DrawShortcutPanel';

let canvas: Topology;
const spaceData = {
  type: -1,
  node: undefined,
  line: undefined,
  multi: undefined,
  nodes: undefined,
  locked: false,
};

interface selectType {
  type: number;
  node?: Node;
  line?: Line;
  multi?: boolean;
  nodes?: any;
  locked?: boolean;
}

const initialState = {
  mouseX: null,
  mouseY: null,
};

const DrawEditor: FC<{
  embed?: boolean;
  targetNode?: any;
  onChange?: Function;
}> = ({ embed = false, targetNode, onChange }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const key = getSearchParamValue(location.search, 'key');
  const typeNew = getSearchParamValue(location.search, 'type');
  const user = useTypedSelector((state) => state.auth.user);
  // const article = useTypedSelector((state) => state.article.article);
  // const articleRef = useRef<ArticleType>();

  const [selected, setSelected] = useState<selectType>(spaceData);
  const selectedRef = useRef<selectType>();
  const [isLoadCanvas, setIsLoadCanvas] = useState(false);
  const [right, setRight] = useState(false);
  const [visible, setVisible] = useState(false);
  const [moreTool, setMoreTool] = useState<string[]>(['1', '2', '3', '4', '5']);
  const [shortcutVisible, setShortcutVisible] = useState(false);
  const [showTool, setShowTool] = useState(true);

  const [state, setState] = React.useState<{
    mouseX: null | number;
    mouseY: null | number;
  }>(initialState);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const handleClose = () => {
    setState(initialState);
  };

  const onMessage = useCallback(
    (event: any, data: any) => {
      /*  const setLineAnimation = (line: Line, switchStart: boolean = true) => {
        line.animateStart = switchStart ? new Date().getTime() : 0;
        line.animateDotSize = 4;
        line.animatePlay = true;
        line.animatePos = 168;
        line.animateSpan = 1;
        line.animateType = 'dot';
      }
    */

      switch (event) {
        case 'node': // 节点
          /*   canvas.data.pens.forEach((pen) => {
            //@ts-ignore
            if (pen.type === 1 && pen.from.id === data.id) {
              setLineAnimation(pen as Line, true);
              //@ts-ignore
            } else if (pen.type === 1 && pen.from.id !== data.id) {
              setLineAnimation(pen as Line, false);
            }
          }); */
          // dispatch(editArticleSaveStatus(-1));
          if (selectedRef.current?.node?.id !== data.id) {
            // handleSave.callback();
            setSelected({
              type: 0,
              node: data,
              line: undefined,
              multi: false,
              nodes: undefined,
              locked: data.locked,
            });
          }
          break;
        case 'addNode':
          // dispatch(editArticleSaveStatus(-1));
          if (selectedRef.current?.node?.id !== data.id) {
            // handleSave.callback();
            setSelected({
              type: 0,
              node: data,
              line: undefined,
              multi: false,
              nodes: undefined,
              locked: data.locked,
            });
          }
          break;
        case 'line': // 连线
        case 'addLine':
          let distance =
            (data.from.x - data.to.x) * (data.from.x - data.to.x) +
            (data.from.y - data.to.y) * (data.from.y - data.to.y);
          if (!data.to.id && distance < 4000) {
            canvas.delete();
          }
          // dispatch(editArticleSaveStatus(-1));
          if (selectedRef.current?.line?.id !== data.id) {
            setSelected({
              type: 1,
              node: undefined,
              line: data,
              multi: false,
              nodes: undefined,
              locked: data.locked,
            });
          }
          break;
        case 'space': // 空白处
          setSelected(spaceData);
          /*  canvas.data.pens.forEach((pen) => {
            //@ts-ignore
            if (pen.type === 1) {
              setLineAnimation(pen as Line, false);
            }
          }); */
          break;
        case 'multi':
          // dispatch(editArticleSaveStatus(-1));
          setSelected({
            type: 2,
            node: undefined,
            line: undefined,
            multi: true,
            nodes: data,
            locked: undefined,
          });
          break;
        case 'move':
          // dispatch(editArticleSaveStatus(-1));
          break;
        case 'scale':
          break;
        case 'copy':
          if (data.pens.length !== 0) navigator.clipboard.writeText('test');
          break;
        case 'paste':
          //@ts-ignore
          /*    navigator.clipboard.read().then((value) => {
            
            if(value[0].types.includes("image/png")){
              canvas.delete([data]);
            }
          }); */
          break;
        default:
          break;
      }
    },

    [dispatch]
  );

  useEffect(() => {
    const canvasOptions: Options = {
      rotateCursor: '/rotate.cur',
      activeColor: 'red',
      // translateKey: 4,
    };
    canvasOptions.on = onMessage;
    canvasRegister();
    canvas = new Topology('topology-canvas', canvasOptions);
    canvas.data.grid = true;
    canvas.data.gridColor = '#f6f6f6';
    canvas.data.gridSize = 20;
    canvas.render();
    setIsLoadCanvas(true);
    let toolString = localStorage.getItem('tool')
      ? localStorage.getItem('tool')
      : '[]';
    let toolArray: [] = JSON.parse(toolString ? toolString : '[]');
    if (toolArray.length) {
      setMoreTool(toolArray);
    }

    return () => {
      canvas.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  // 获取绘图数据
  // useEffect(() => {
  //   if (user) {
  //     // dispatch(getQiniuToken());
  //     if (typeNew) {
  //       // dispatch(clearArticle());
  //       canvas.open();
  //     }
  //     if (key) {
  //       // 获取文章详情
  //       // dispatch(getArticleById(key));
  //     }
  //   }
  //   canvas.data.grid = true;
  //   canvas.data.gridColor = '#f6f6f6';
  //   canvas.data.gridSize = 20;
  //   canvas.render();
  // }, [dispatch, user, key, typeNew]);

  // 加载绘图数据
  useEffect(() => {
    if (targetNode) {
      canvas.open(targetNode.content);
      // articleRef.current = article;
    } else {
      canvas.open();
    }
    canvas.data.grid = true;
    canvas.data.gridColor = '#f6f6f6';
    canvas.data.gridSize = 20;
    canvas.render();
  }, [targetNode]);

  /**
   * 注册图形库
   */

  const canvasRegister = () => {
    registerFlow();
    // activity
    registerActivity();
    // class
    registerClass();
    // sequence
    registerSequence();
    // 注册自定义组件
    registerMyself();
    // registerNode('myShape', myShapeData, myShapeDataAnchors, myShapeDataIconRect, myShapeDataTextRect);
  };

  const onDrag = (event: any, node: any) => {
    node.data.lineWidth = 2;
    event.dataTransfer.setData('Topology', JSON.stringify(node.data));
  };

  /**
   * 当表单数据变化时, 重新渲染canvas
   * @params {object} value - 图形的宽度,高度, x, y等等
   */

  const onHandleFormValueChange = useCallback((value) => {
    // console.log(value);
    const {
      rotate,
      data,
      lineWidth,
      strokeStyle,
      dash,
      color,
      fontSize,
      fontFamily,
      fontWeight,
      fontStyle,
      text,
      animateStart,
      animatePlay,
      animateType,
      animateDuration,
      animateCycle,
      textAlign,
      textBaseline,
      borderRadius,
      fillStyle,
      icon,
      iconSize,
      iconColor,
      iconFamily,
      image,
      imageAlign,
      events,
      ...other
    } = value;
    const changedValues: any = {
      node: {
        rect: other,
        font: {
          color,
          fontSize,
          fontFamily,
          fontWeight,
          fontStyle,
          textAlign,
          textBaseline,
        },
        rotate,
        lineWidth,
        strokeStyle,
        dash,
        text,
        data,
        animateStart,
        animatePlay,
        animateType,
        animateDuration,
        animateCycle,
        borderRadius,
        fillStyle,
        icon,
        iconSize,
        iconColor,
        iconFamily,
        image,
        imageAlign,
        events,
      },
    };
    if (changedValues.node) {
      if (animateType) {
        animationSet(canvas.activeLayer.pens[0], animateType);
      }

      // 遍历查找修改的属性，赋值给原始Node
      for (const key in changedValues.node) {
        if (Array.isArray(changedValues.node[key])) {
          //@ts-ignore
          canvas.activeLayer.pens[0]['events'] = [
            ...changedValues.node['events'],
          ];
        } else if (typeof changedValues.node[key] === 'object') {
          for (const k in changedValues.node[key]) {
            //@ts-ignore
            canvas.activeLayer.pens[0]['icon'] = changedValues.node['icon'];
            //@ts-ignore
            canvas.activeLayer.pens[0]['image'] = changedValues.node['image'];

            if (
              changedValues.node[key] ||
              changedValues.node[key] === 0 ||
              changedValues.node[key] === false ||
              changedValues.node[key] === ''
            ) {
              //@ts-ignore
              canvas.activeLayer.pens[0][key][k] = changedValues.node[key][k];
            }
          }
        } else {
          if (
            changedValues.node[key] ||
            changedValues.node[key] === 0 ||
            changedValues.node[key] === false ||
            changedValues.node[key] === ''
          ) {
            //@ts-ignore
            canvas.activeLayer.pens[0][key] = changedValues.node[key];
          }
        }
      }
      animateStart
        ? (canvas.activeLayer.pens[0]['animateStart'] = new Date().getTime())
        : (canvas.activeLayer.pens[0]['animateStart'] = 0);
      canvas.animate();
    }

    canvas.updateProps();
  }, []);

  /**
   *  动画设置 nodeData 节点数据,animateType 动画类型
   * */

  const animationSet = (nodeData: any, animateType: any) => {
    if (nodeData.animateType === 'custom') {
      return;
    }
    nodeData.animateFrames = [];
    const state = Node.cloneState(nodeData);
    switch (animateType) {
      case 'upDown':
        state.rect.y -= 10;
        state.rect.ey -= 10;
        nodeData.animateFrames.push({
          duration: 100,
          linear: true,
          state,
        });
        nodeData.animateFrames.push({
          duration: 100,
          linear: true,
          state: Node.cloneState(nodeData),
        });
        nodeData.animateFrames.push({
          duration: 200,
          linear: true,
          state: Node.cloneState(state),
        });
        break;
      case 'leftRight':
        state.rect.x -= 10;
        state.rect.ex -= 10;
        nodeData.animateFrames.push({
          duration: 100,
          linear: true,
          state: Node.cloneState(state),
        });
        state.rect.x += 20;
        state.rect.ex += 20;
        nodeData.animateFrames.push({
          duration: 80,
          linear: true,
          state: Node.cloneState(state),
        });
        state.rect.x -= 20;
        state.rect.ex -= 20;
        nodeData.animateFrames.push({
          duration: 50,
          linear: true,
          state: Node.cloneState(state),
        });
        state.rect.x += 20;
        state.rect.ex += 20;
        nodeData.animateFrames.push({
          duration: 30,
          linear: true,
          state: Node.cloneState(state),
        });
        nodeData.animateFrames.push({
          duration: 300,
          linear: true,
          state: Node.cloneState(nodeData),
        });
        break;
      case 'heart':
        state.rect.x -= 5;
        state.rect.ex += 5;
        state.rect.y -= 5;
        state.rect.ey += 5;
        state.rect.width += 5;
        state.rect.height += 10;
        nodeData.animateFrames.push({
          duration: 100,
          linear: true,
          state,
        });
        nodeData.animateFrames.push({
          duration: 400,
          linear: true,
          state: Node.cloneState(nodeData),
        });
        break;
      case 'success':
        state.strokeStyle = '#237804';
        nodeData.animateFrames.push({
          duration: 100,
          linear: true,
          state,
        });
        nodeData.animateFrames.push({
          duration: 100,
          linear: true,
          state: Node.cloneState(nodeData),
        });
        state.strokeStyle = '#237804';
        nodeData.animateFrames.push({
          duration: 100,
          linear: true,
          state,
        });
        nodeData.animateFrames.push({
          duration: 100,
          linear: true,
          state: Node.cloneState(nodeData),
        });
        state.strokeStyle = '#237804';
        state.fillStyle = '#389e0d22';
        nodeData.animateFrames.push({
          duration: 3000,
          linear: true,
          state,
        });
        break;
      case 'warning':
        state.strokeStyle = '#fa8c16';
        state.dash = 2;
        nodeData.animateFrames.push({
          duration: 300,
          linear: true,
          state,
        });
        state.strokeStyle = '#fa8c16';
        state.dash = 0;
        nodeData.animateFrames.push({
          duration: 500,
          linear: true,
          state: Node.cloneState(state),
        });
        state.strokeStyle = '#fa8c16';
        state.dash = 2;
        nodeData.animateFrames.push({
          duration: 300,
          linear: true,
          state: Node.cloneState(state),
        });
        break;
      case 'error':
        state.strokeStyle = '#cf1322';
        state.fillStyle = '#cf132222';
        nodeData.animateFrames.push({
          duration: 100,
          linear: true,
          state,
        });
        break;
      case 'show':
        state.strokeStyle = '#fa541c';
        state.rotate = -10;
        nodeData.animateFrames.push({
          duration: 100,
          linear: true,
          state: Node.cloneState(state),
        });
        state.rotate = 10;
        nodeData.animateFrames.push({
          duration: 100,
          linear: true,
          state: Node.cloneState(state),
        });
        state.rotate = 0;
        nodeData.animateFrames.push({
          duration: 100,
          linear: true,
          state: Node.cloneState(state),
        });
        break;
      default:
        break;
    }
  };

  /**
   * 当线条表单数据变化时, 重新渲染canvas
   * @params {object} value - 图形的宽度,高度, x, y等等
   */

  const onHandleLineFormValueChange = useCallback((value) => {
    const {
      dash,
      lineWidth,
      strokeStyle,
      name,
      fromArrow,
      toArrow,
      animateStart,
      animatePlay,
      animateType,
      animateCycle,
      animateColor,
      animateSpan,
      animateDotSize,
      fromArrowColor,
      toArrowColor,
      fromArrowSize,
      toArrowSize,
      ...other
    } = value;
    const changedValues: any = {
      line: {
        rect: other,
        lineWidth,
        dash,
        strokeStyle,
        name,
        fromArrow,
        toArrow,
        animateStart,
        animatePlay,
        animateType,
        animateCycle,
        animateColor,
        animateSpan,
        animateDotSize,
        fromArrowColor,
        toArrowColor,
        fromArrowSize,
        toArrowSize,
      },
    };
    if (changedValues.line) {
      // 遍历查找修改的属性，赋值给原始line
      for (const key in changedValues.line) {
        if (Array.isArray(changedValues.line[key])) {
        } else if (typeof changedValues.line[key] === 'object') {
          for (const k in changedValues.line[key]) {
            if (
              changedValues.line[key][k] ||
              changedValues.line[key][k] === 0 ||
              changedValues.line[key] === false
            ) {
              //@ts-ignore
              canvas.activeLayer.pens[0][key][k] = changedValues.line[key][k];
            }
          }
        } else {
          if (
            changedValues.line[key] ||
            changedValues.line[key] === 0 ||
            changedValues.line[key] === false
          ) {
            //@ts-ignore
            canvas.activeLayer.pens[0][key] = changedValues.line[key];
          }
        }
      }

      animateStart
        ? (canvas.activeLayer.pens[0]['animateStart'] = new Date().getTime())
        : (canvas.activeLayer.pens[0]['animateStart'] = 0);
      canvas.animate();
      //@ts-ignore
      canvas.activeLayer.pens[0].calcControlPoints();
    }
    canvas.updateProps();
  }, []);

  /**
   * 监听画布上元素的事件
   * @params {string} event - 事件名称
   * @params {object} data - 节点数据
   */

  /**
   * 渲染画布右侧区域操作栏
   */

  const renderHeader = useMemo(() => {
    if (isLoadCanvas)
      return (
        <Header
          node={targetNode}
          canvas={canvas}
          onChange={onChange}
          //@ts-ignore
          data={selected}
          embed={embed}
          showLeftTool={(value: boolean) => {
            setShowTool(value);
          }}
        />
      );
  }, [isLoadCanvas, selected, embed]);

  const changeTool = (value: string[]) => {
    setMoreTool(value);
    setVisible(false);
  };

  /**
   *
   * 图标置顶置底
   */

  const handleUpLayer = () => {
    if (canvas.activeLayer.pens[0]) {
      canvas.top(canvas.activeLayer.pens[0]);
    }
    setState(initialState);
  };
  const handleDownLayer = () => {
    if (canvas.activeLayer.pens[0]) {
      canvas.bottom(canvas.activeLayer.pens[0]);
    }
    setState(initialState);
  };

  /**
   * 风格模板
   */

  const changeStyle = useCallback((type: string) => {
    const changeCanvasStyle = (
      lineWidth: number = 1,
      lineColor: string = 'black',
      bgColor: string = '',
      fontColor: string = 'black'
    ) => {
      canvas.data.pens.forEach((pen: Pen) => {
        if (pen.type === 0) {
          // node
          pen.font.color = fontColor;
          pen.fillStyle = bgColor;
        } else if (pen.type === 1) {
          // line
        }
        pen.strokeStyle = lineColor;
        pen.lineWidth = lineWidth;
      });
      canvas.updateProps();
    };
    switch (type) {
      case 'thin':
        changeCanvasStyle(1);
        break;
      case 'blod':
        changeCanvasStyle(3);
        break;
      case 'blue':
        changeCanvasStyle(3, 'blue', 'blue', 'white');
        break;
      case 'red':
        changeCanvasStyle(3, 'red', 'red', 'white');
        break;
      case 'green':
        changeCanvasStyle(3, '#6ed464', '#6ed464', 'black');
        break;
    }
  }, []);

  // 布局
  const handleSelect = useCallback((pen: Pen) => {
    canvas.activeLayer.pens = [pen];
    canvas.render();
  }, []);

  const onNodesAlign = useCallback((align: string) => {
    alignNodes(canvas.activeLayer.pens, canvas.activeLayer.rect, align);
    canvas.updateProps();
  }, []);

  const onSpaceBetween = useCallback(() => {
    spaceBetween(canvas.activeLayer.pens, canvas.activeLayer.rect.width);
    canvas.updateProps();
  }, []);

  const onLayout = useCallback((layoutData) => {
    layout(canvas.activeLayer.pens, layoutData);
    canvas.updateProps();
  }, []);

  const rightAreaConfig = useMemo(() => {
    return {
      node: selected && (
        <NodeComponent
          //@ts-ignore
          data={selected}
          onFormValueChange={onHandleFormValueChange}
        />
      ), // 渲染Node节点类型的组件
      line: selected && (
        <LineComponent
          //@ts-ignore
          data={selected}
          onFormValueChange={onHandleLineFormValueChange}
        />
      ), // 渲染线条类型的组件
      multi: selected && (
        <Multi
          data={selected}
          handleSelect={handleSelect}
          onNodesAlign={onNodesAlign}
          onSpaceBetween={onSpaceBetween}
          onLayout={onLayout}
        />
      ),
      default: <BackgroundComponent changeStyle={changeStyle} />, // 渲染画布背景的组件
    };
  }, [
    selected,
    onHandleFormValueChange,
    onHandleLineFormValueChange,
    handleSelect,
    onNodesAlign,
    onSpaceBetween,
    onLayout,
    changeStyle,
  ]);

  const renderRightArea = useMemo(() => {
    let _component = rightAreaConfig.default;
    Object.keys(rightAreaConfig).forEach((item) => {
      //@ts-ignore
      if (selected[item] && rightAreaConfig[item]) {
        //@ts-ignore
        _component = rightAreaConfig[item];
      }
    });
    return _component;
  }, [selected, rightAreaConfig]);

  return (
    <Fragment>
      {renderHeader}
      <div className="page">
        {showTool ? (
          <div className="tool">
            {Tools.filter((item: any) => moreTool.includes(item.id)).map(
              (item, index) => (
                <div key={index}>
                  <div className="title">{item.group}</div>
                  <div className="button">
                    {
                      //@ts-ignore
                      item.children.map((item: any, idx: any) => {
                        // eslint-disable-next-line jsx-a11y/anchor-is-valid
                        return (
                          // eslint-disable-next-line jsx-a11y/anchor-is-valid
                          <a
                            key={idx}
                            title={item.name}
                            draggable
                            onDragStart={(ev) => onDrag(ev, item)}
                          >
                            <i
                              className={'iconfont ' + item.icon}
                              style={{ fontSize: 13 }}
                            ></i>
                          </a>
                        );
                      })
                    }
                  </div>
                </div>
              )
            )}

            {imgTool.map((item, index) => (
              <div key={index}>
                <div className="title">{item.group}</div>
                <div className="button">
                  {
                    //@ts-ignore
                    item.children.map((item: any, idx: any) => {
                      // eslint-disable-next-line jsx-a11y/anchor-is-valid
                      return (
                        // eslint-disable-next-line jsx-a11y/anchor-is-valid
                        <a
                          key={idx}
                          title={item.name}
                          draggable
                          onDragStart={(ev) => onDrag(ev, item)}
                        >
                          <img
                            src={item.url}
                            alt={item.name}
                            className="tool-img-box"
                          />
                        </a>
                      );
                    })
                  }
                </div>
              </div>
            ))}
            {/*   <button
            onClick={() => {
              setVisible(true);
            }}
            className="more-tool"
          >
            图形库设置
          </button> */}
          </div>
        ) : null}

        <div className="full">
          {/* <svg
            width="100%"
            height="100%"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
            xmlns="http://www.w3.org/2000/svg"
          > 
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f3f3f3" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"></rect>
          </svg>
          */}
          <div
            id="topology-canvas"
            onContextMenu={handleClick}
            style={{ cursor: 'context-menu', height: '100%', width: '100%' }}
          />
          <Menu
            keepMounted
            open={state.mouseY !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={
              state.mouseY !== null && state.mouseX !== null
                ? { top: state.mouseY, left: state.mouseX }
                : undefined
            }
          >
            <MenuItem onClick={handleUpLayer}>置顶</MenuItem>
            <MenuItem onClick={handleDownLayer}>置底</MenuItem>
          </Menu>
          <Tooltip title="查看快捷键">
            <IconButton
              style={{ position: 'absolute', bottom: '24px', right: '24px' }}
              onClick={() => setShortcutVisible(true)}
            >
              <KeyboardOutlinedIcon />
            </IconButton>
          </Tooltip>
        </div>
        <DrawShortcutPanel
          visible={shortcutVisible}
          handleClose={() => setShortcutVisible(false)}
        />

        {right ? (
          <div className="props">
            <Tooltip placement="bottom-start" title="收起" arrow>
              <IconButton
                onClick={() => setRight(false)}
                className="toggle-icon"
              >
                <ArrowForwardIcon />
              </IconButton>
            </Tooltip>
            {renderRightArea}
          </div>
        ) : (
          <Tooltip placement="bottom-start" title="更多属性设置" arrow>
            <IconButton onClick={() => setRight(true)} className="toggle-icon">
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>

      {visible ? (
        <ToolModal
          current={moreTool}
          visible={visible}
          onCancel={() => {
            setVisible(false);
          }}
          onSubmit={changeTool}
        />
      ) : null}
    </Fragment>
  );
};

export default DrawEditor;
