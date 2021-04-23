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
import './Topology.css';
import { useLocation } from 'react-router-dom';
// import { getArticleById, clearArticle, editArticleSaveStatus } from '../redux/actions/articleActions';
// import { getQiniuToken } from '../redux/actions/authActions';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { getSearchParamValue } from '../../services/util';
import DrawShortcutPanel from './draw/DrawShortcutPanel';
import { IconButton, Menu, MenuItem, Tooltip } from '@material-ui/core';
import KeyboardOutlinedIcon from '@material-ui/icons/KeyboardOutlined';
import RightMenu from './draw/RightMenu';
import LeftMenu from './draw/LeftMenu';
import Header from './draw/Header';

let canvas: Topology;
const spaceData = {
  type: -1,
  multi: false,
  pen: undefined,
  nodes: undefined,
  locked: false,
};

export interface selectType {
  type: number;
  multi?: boolean;
  pen?: Pen | Node | Line;
  nodes?: Pen[];
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
  changeEditable?:Function
}> = ({ embed = false, targetNode, onChange,changeEditable }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const key = getSearchParamValue(location.search, 'key');
  const typeNew = getSearchParamValue(location.search, 'type');
  const user = useTypedSelector((state) => state.auth.user);
  // const article = useTypedSelector((state) => state.article.article);
  // const styleType = (article as any)?.styleType;
  let styleType: any = {};
  const [selected, setSelected] = useState<selectType>(spaceData);
  const selectedRef = useRef<selectType>();
  const [isLoadCanvas, setIsLoadCanvas] = useState(false);
  const [right, setRight] = useState(false);
  const [moreTool, setMoreTool] = useState<string[]>(['1', '2', '3', '4', '5']);
  const [shortcutVisible, setShortcutVisible] = useState(false);
  const [showTool, setShowTool] = useState(true);

  const [state, setState] = useState<{
    mouseX: null | number;
    mouseY: null | number;
  }>(initialState);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!selected.pen) return;
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
      console.log(event,data)
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
          if (selectedRef.current?.pen?.id !== data.id) {
            setSelected({
              type: 0,
              pen: data,
              multi: false,
              nodes: undefined,
              locked: data.locked,
            });
          }
          break;
        case 'addNode':
          // dispatch(editArticleSaveStatus(-1));
          if (selectedRef.current?.pen?.id !== data.id) {
            setSelected({
              type: 0,
              pen: data,
              multi: false,
              nodes: undefined,
              locked: data.locked,
            });
          }
          break;
        case 'line': // 连线
        case 'addLine':
          // console.log(event, data,canvas?.activeLayer);
          let distance =
            (data.from.x - data.to.x) * (data.from.x - data.to.x) +
            (data.from.y - data.to.y) * (data.from.y - data.to.y);
          if (
            !data.to.id &&
            distance < 4000 &&
            canvas?.activeLayer.pens[0].type === 1
          ) {
            canvas.delete();
          }
          if (data.from.id && !canvas.find(data.from.id)) {
            data.from.id = null;
            canvas.updateProps();
          }
          if (data.to.id && !canvas.find(data.to.id)) {
            data.to.id = null;
            canvas.updateProps();
          }
          // dispatch(editArticleSaveStatus(-1));
          if (selectedRef.current?.pen?.id !== data.id) {
            setSelected({
              type: 1,
              pen: data,
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
            pen: undefined,
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
            console.log(value);
            
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
    if (canvas?.options && canvas.data && styleType) {
      canvas.options.color = styleType.lineColor;
      if (right) {
        canvas.data.pens.forEach((pen: Pen) => {
          if (pen.type === 0) {
            //@ts-ignore
            pen.font.color = styleType.fontColor;
            pen.fillStyle = styleType.bgColor;
            pen.strokeStyle = styleType.borderColor;
          } else if (pen.type === 1) {
            // line
            pen.strokeStyle = styleType.lineColor;
          }
          pen.lineWidth = styleType.lineWidth;
        });
        canvas.data.lineWidth = styleType.lineWidth;
      }
      canvas.updateProps();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styleType]);

  useEffect(() => {
    const canvasOptions: Options = {
      rotateCursor: '/rotate.cur',
      activeColor: 'red',
      autoAnchor: true,
      translateKey: 4,
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
  //     dispatch(getQiniuToken());
  //     if (typeNew) {
  //       dispatch(clearArticle());
  //       canvas.open();
  //     }
  //     if (key) {
  //       // 获取文章详情
  //       dispatch(getArticleById(key));
  //     }
  //   }
  //   canvas.data.grid = true;
  //   canvas.data.gridColor = '#f6f6f6';
  //   canvas.data.gridSize = 20;
  //   canvas.render();
  // }, [dispatch, user, key, typeNew]);

  // 加载绘图数据
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

  const onDrag = useCallback(
    (event: any, node: any) => {
      node.data = {
        ...node.data,
        lineWidth: styleType?.lineWidth,
        font: { color: styleType?.fontColor },
        fillStyle: styleType?.bgColor,
        strokeStyle: styleType?.borderColor,
      };
      if (node.data.type === 1) {
        node.data.strokeStyle = styleType.lineColor;
      }
      event.dataTransfer.setData('Topology', JSON.stringify(node.data));
    },
    [styleType]
  );

  const onDragFont = useCallback(
    (event: any, node: any) => {
      const data = {
        rect: {
          width: 100,
          height: 100,
        },
        text: '字体图标',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
        name: 'image',
        icon: String.fromCharCode(node.unicode),
        iconFamily: 'Topology',
        iconColor: '#000000',
        lineWidth: styleType?.lineWidth,
        font: { color: styleType?.fontColor },
        fillStyle: styleType?.bgColor,
        strokeStyle: styleType?.borderColor,
      };
      event.dataTransfer.setData('Topology', JSON.stringify(data));
    },
    [styleType]
  );

  const changeFontIcon = useCallback((event: any, value: any) => {
    if (
      canvas.activeLayer.pens.length === 1 &&
      canvas.activeLayer.pens[0].type === 0
    ) {
      canvas.activeLayer.pens.forEach((item: any) => {
        item.icon = String.fromCharCode(value.unicode);
        item.iconFamily = 'Topology';
        canvas.updateProps();
      });
    }
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
   * 监听画布上元素的事件
   * @params {string} event - 事件名称
   * @params {object} data - 节点数据
   */

  /**
   * 渲染画布右侧区域操作栏
   */
  const changeRightView = useCallback((value) => {
    setRight(() => {
      canvas.resize();
      return value;
    });
  }, []);

  const propsChange = useCallback(
    (value: any) => {
      if (!canvas.activeLayer.pens.length) {
        return;
      }
      for (const k in value) {
        if (k === 'rect') {
          for (const s in value[k]) {
            //@ts-ignore
            canvas.activeLayer.pens[0][k][s] = parseInt(value[k][s]);
          }
        } else if (k === 'font') {
          for (const s in value[k]) {
            //@ts-ignore
            canvas.activeLayer.pens[0][k][s] = value[k][s];
          }
        } else {
          //@ts-ignore
          canvas.activeLayer.pens[0][k] = value[k];
        }
      }

      if (value.animateType && selectedRef.current?.type === 0) {
        animationSet(canvas.activeLayer.pens[0], value.animateType);
      }

      if (value.animateStart) {
        canvas.activeLayer.pens[0].startAnimate();
      }
      if (value.animateStart === 0) {
        canvas.activeLayer.pens[0].stopAnimate();
      }
      setSelected((selected) => ({
        ...selected,
        pen: canvas.activeLayer.pens[0],
      }));
      canvas.updateProps();
    },

    []
  );

  const allPropsChange = useCallback(
    (value: any) => {
      if (!canvas.activeLayer.pens.length) {
        return;
      }
      for (const k in value) {
        if (k === 'rect') {
          for (const s in value[k]) {
            // eslint-disable-next-line no-loop-func
            canvas.activeLayer.pens.forEach((element, index) => {
              //@ts-ignore
              canvas.activeLayer.pens[index][k][s] = parseInt(value[k][s]);
            });
          }
        } else if (k === 'font') {
          for (const s in value[k]) {
            // eslint-disable-next-line no-loop-func
            canvas.activeLayer.pens.forEach((element, index) => {
              //@ts-ignore
              canvas.activeLayer.pens[index][k][s] = value[k][s];
            });
          }
        } else {
          // eslint-disable-next-line no-loop-func
          canvas.activeLayer.pens.forEach((element, index) => {
            //@ts-ignore
            canvas.activeLayer.pens[index][k] = value[k];
          });
        }
      }
      // setSelected({ ...(selectedRef.current as selectType), pen: canvas.activeLayer.pens[0] });
      setSelected((selected) => ({
        ...selected,
        pen: canvas.activeLayer.pens[0],
      }));
      canvas.updateProps();
    },

    []
  );

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

  const renderHeader = useMemo(() => {
    if (isLoadCanvas)
      return (
        <Header
          node={targetNode}
          canvas={canvas}
          onChange={onChange}
          changeEditable={changeEditable}
          //@ts-ignore
          data={selected}
          embed={embed}
          right={right}
          propsChange={allPropsChange}
          showRight={changeRightView}
          showLeftTool={(value: boolean) => {
            setShowTool(value);
            setTimeout(() => {
              canvas.resize();
            }, 0);
          }}
        />
      );
  }, [isLoadCanvas, selected, embed, right, allPropsChange, changeRightView]);

  return (
    <Fragment>
      {renderHeader}
      <div className="page">
        {showTool ? (
          <LeftMenu
            moreTool={moreTool}
            onDrag={onDrag}
            onDragFont={onDragFont}
            changeFontIcon={changeFontIcon}
          />
        ) : null}

        <div className="full">
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
            <RightMenu
              data={selected}
              onLayout={onLayout}
              onNodesAlign={onNodesAlign}
              onSpaceBetween={onSpaceBetween}
              handleSelect={handleSelect}
              propsChange={propsChange}
            />
          </div>
        ) : null}
      </div>
    </Fragment>
  );
};

export default DrawEditor;
