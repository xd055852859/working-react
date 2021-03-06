import React, { FC, memo, useState, useEffect } from 'react';
import {
  Tab,
  makeStyles,
  Theme,
  createStyles,
  Tabs,
  Button,
  Input,
  Select,
  MenuItem,
  Grid,
  Tooltip,
  TextField,
  IconButton,
} from '@material-ui/core';
import { selectType } from '../../Topology';
import { Pen } from '@topology/core';
import { CompactPicker } from 'react-color';
import { useDispatch } from 'react-redux';
// import { changeStyleType } from '../../../redux/actions/articleActions';
import { useTypedSelector } from '../../../../redux/reducer/RootState';
import { layoutType } from '../../../../interfaces/Line';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Panel from '../Panel';
import TabPanel from '../TabPanel';

interface Props {
  pen: Pen;
  handleSelect: (pen: any) => void;
}
interface RightMenuProps {
  data: selectType;
  handleSelect: (pen: any) => void;
  onNodesAlign: (value: any) => void;
  onSpaceBetween: Function;
  onLayout: (value: any) => void;
  propsChange: (value: any) => void;
}
interface eventType {
  type: number;
  action: number;
  value?: string;
}

function PenItem({ pen, handleSelect }: Props) {
  return (
    <div className="pen-item" key={pen.id} onClick={() => handleSelect(pen)}>
      <i className="iconfont icon-triangle-right"></i>[
      {pen.type ? '连线' : '节点'}] {pen.name}
      {pen.text ? '-' + pen.text : ''}
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: '40px',
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: 80,
      },
      '&  .MuiOutlinedInput-input': {
        padding: '12px 8px ',
      },
    },
    border: {
      borderBottom: '1px solid #d9d9d9',
    },

    colorbtn: {
      width: '60px',
      height: '24px',
      borderRadius: '2px',
    },
    toolbar_button: {
      marginTop: 0,
      padding: '2px',
      border: 'none',
    },
    align_box: {
      height: '40px',
      width: '100%',
      display: 'inline-flex',
    },
    noMargin: {
      '& .MuiAccordion-root.Mui-expanded': {
        margin: 0,
      },
    },
    allWidth: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: 176,
      },
    },
  })
);

const animationList = [
  {
    id: '',
    name: '无',
  },
  {
    id: 'upDown',
    name: '上下跳动',
  },
  {
    id: 'leftRight',
    name: '左右跳动',
  },
  {
    id: 'heart',
    name: '心跳',
  },
  {
    id: 'success',
    name: '成功',
  },
  {
    id: 'warning',
    name: '警告',
  },
  {
    id: 'error',
    name: '错误',
  },
  {
    id: 'show',
    name: '炫耀',
  },
];

const lineAnimationList = [
  {
    id: 'beads',
    name: '水珠流动',
  },
  {
    id: 'dot',
    name: '圆点',
  },
  {
    id: 'comet',
    name: '彗星',
  },
];
const RightMenu: FC<RightMenuProps> = memo(
  ({
    data,
    handleSelect,
    onLayout,
    onNodesAlign,
    onSpaceBetween,
    propsChange,
  }) => {
    const {
      rotate = 0,
      lineWidth,
      strokeStyle = '',
      dash = 0,
      text = '',
      borderRadius,
      name,
      fromArrow = '',
      toArrow = '',
      fromArrowColor = '',
      toArrowColor = '',
      fromArrowSize = '',
      toArrowSize = '',
      animateColor,
      animateSpan,
      animateDotSize,
      animateType,
      animateDuration,
      animateCycle,
      fillStyle,
      globalAlpha,
    } = data.pen || ({} as any);

    const {
      color = '',
      fontSize,
      fontWeight = 'normal',
      fontStyle = '',
      textAlign = 'center',
      textBaseline = '',
    } =
      // @ts-ignore
      data?.node?.font || ({} as any);

    const [value, setValue] = useState(0);
    const [eventList, setEventList] = useState<eventType[]>([]);
    const classes = useStyles();
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
      setValue(newValue);
    };

    // back
    // const article = useTypedSelector((state) => state.article.article);
    // const styleType = (article as any)?.styleType;
    let styleType: any = {};
    const dispatch = useDispatch();
    const [pickerShow, setPickerShow] = useState({
      visible: false,
      color: '',
      type: '',
    });
    const [positionY, setpositionY] = useState(0);

    const openColorPicker = (e: any, value: any, type: string) => {
      setpositionY(e.target.getBoundingClientRect().y + 40);
      setPickerShow({ visible: true, color: value, type });
    };

    const colorChange = (value: any) => {
      setPickerShow({ ...pickerShow, visible: false, color: value.hex });
      // dispatch(changeStyleType({ ...styleType, [pickerShow.type]: value.hex }));
    };

    const [layoutData, setLayoutData] = useState<layoutType>({
      maxWidth: 1000,
      nodeWidth: 0,
      nodeHeight: 0,
      maxCount: 0,
      spaceWidth: 30,
      spaceHeight: 30,
    });

    const nodesAlgin = [
      {
        value: 'left',
        desc: '左对齐',
      },
      {
        value: 'right',
        desc: '右对齐',
      },
      {
        value: 'top',
        desc: '顶部对齐',
      },
      {
        value: 'bottom',
        desc: '底部对齐',
      },
      {
        value: 'center',
        desc: '居中',
      },
      {
        value: 'middle',
        desc: '居中',
      },
    ];

    const changeProps = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = {};
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
      const rect = ['x', 'y', 'width', 'height'];
      if (fontProps.includes(e.target.name)) {
        value = {
          font: {
            [e.target.name]: e.target.value,
          },
        };
      } else if (rect.includes(e.target.name)) {
        value = {
          rect: {
            [e.target.name]: e.target.value,
          },
        };
      } else {
        value = { [e.target.name]: e.target.value };
      }

      propsChange(value);
    };

    useEffect(() => {
      const events = data.pen?.events || [];
      setEventList(events);
    }, [data.pen]);

    useEffect(() => {
      setValue(0);
    }, [data.type]);

    useEffect(() => {
      propsChange({ events: eventList });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventList]);

    return (
      <>
        <Tabs
          className={classes.border}
          variant="scrollable"
          scrollButtons="auto"
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
        >
          <Tab className={classes.root} label="外观" value={0} />
          <Tab
            className={classes.root}
            label="动效"
            value={1}
            style={{
              display: `${
                data.type === 1 || data.type === 0 ? 'block' : 'none'
              }`,
            }}
          />
          <Tab
            className={classes.root}
            label="事件"
            value={2}
            style={{ display: `${data.type === 0 ? 'block' : 'none'}` }}
          />
          <Tab
            className={classes.root}
            label="结构"
            value={3}
            style={{ display: `${data.type !== -1 ? 'block' : 'none'}` }}
          />
        </Tabs>
        <TabPanel className={classes.noMargin} value={value} index={0}>
          {/* // 空白时 */}
          {data.type === -1 && (
            <>
              <Panel title="线条风格">
                <Grid container>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      size="small"
                      color="primary"
                      // onClick={() =>
                      //   styleType?.lineWidth > 1
                      //     ? dispatch(
                      //         changeStyleType({
                      //           ...styleType,
                      //           lineWidth:
                      //             (styleType.lineWidth
                      //               ? styleType.lineWidth
                      //               : 2) - 1,
                      //         })
                      //       )
                      //     : null
                      // }
                    >
                      减细线条
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      size="small"
                      color="primary"
                      // onClick={() =>
                      //   dispatch(
                      //     changeStyleType({
                      //       ...styleType,
                      //       lineWidth:
                      //         (styleType?.lineWidth ? styleType.lineWidth : 1) +
                      //         1,
                      //     })
                      //   )
                      // }
                    >
                      加粗线条
                    </Button>
                  </Grid>
                </Grid>
              </Panel>
              <Panel title="颜色风格">
                <Grid container>
                  <Grid item xs={6}>
                    连线颜色
                  </Grid>
                  <Grid item xs={6}>
                    <button
                      className={classes.colorbtn}
                      style={{
                        background: `${styleType?.lineColor}`,
                      }}
                      onClick={(e) =>
                        openColorPicker(e, styleType?.lineColor, 'lineColor')
                      }
                    ></button>
                  </Grid>
                  <Grid item xs={6}>
                    边框颜色
                  </Grid>
                  <Grid item xs={6}>
                    <button
                      className={classes.colorbtn}
                      style={{
                        background: `${styleType?.borderColor}`,
                      }}
                      onClick={(e) =>
                        openColorPicker(
                          e,
                          styleType?.borderColor,
                          'borderColor'
                        )
                      }
                    ></button>
                  </Grid>
                  <Grid item xs={6}>
                    背景颜色
                  </Grid>
                  <Grid item xs={6}>
                    <button
                      className={classes.colorbtn}
                      style={{
                        background: `${styleType?.bgColor}`,
                      }}
                      onClick={(e) =>
                        openColorPicker(e, styleType?.bgColor, 'bgColor')
                      }
                    ></button>
                  </Grid>
                  <Grid item xs={6}>
                    字体颜色
                  </Grid>
                  <Grid item xs={6}>
                    <button
                      className={classes.colorbtn}
                      style={{
                        background: `${styleType?.fontColor}`,
                      }}
                      onClick={(e) =>
                        openColorPicker(e, styleType?.fontColor, 'fontColor')
                      }
                    ></button>
                  </Grid>
                </Grid>
                {pickerShow.visible ? (
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
                      setPickerShow({ visible: false, type: '', color: '' });
                    }}
                  >
                    <div
                      style={{
                        position: 'fixed',
                        zIndex: 99,
                        right: '20px',
                        top: positionY,
                      }}
                    >
                      <CompactPicker
                        color={pickerShow.color}
                        onChangeComplete={colorChange}
                      />
                    </div>
                  </div>
                ) : null}
              </Panel>
            </>
          )}
          {/* // node或者line */}
          {(data.type === 0 || data.type === 1) && (
            <Panel title="文字">
              <div className={classes.root}>
                <TextField
                  name="fontSize"
                  onChange={changeProps}
                  size="small"
                  variant="outlined"
                  label="大小"
                  type="number"
                  value={fontSize}
                />
                <TextField
                  name="color"
                  onChange={changeProps}
                  size="small"
                  variant="outlined"
                  label="颜色"
                  type="color"
                  value={color}
                />

                <TextField
                  name="fontStyle"
                  onChange={changeProps}
                  size="small"
                  variant="outlined"
                  label="倾斜"
                  type="text"
                  select
                  value={fontStyle}
                >
                  <MenuItem value={'normal'}>正常</MenuItem>
                  <MenuItem value={'italic'}>倾斜</MenuItem>
                </TextField>
                <TextField
                  name="fontWeight"
                  onChange={changeProps}
                  size="small"
                  variant="outlined"
                  label="加粗"
                  type="text"
                  select
                  value={fontWeight}
                >
                  <MenuItem value={'normal'}>正常</MenuItem>
                  <MenuItem value={'bold'}>加粗</MenuItem>
                </TextField>
                <TextField
                  name="textAlign"
                  onChange={changeProps}
                  size="small"
                  variant="outlined"
                  label="水平居中"
                  select
                  value={textAlign}
                >
                  <MenuItem value={'left'}>左对齐</MenuItem>
                  <MenuItem value={'center'}>居中</MenuItem>
                  <MenuItem value={'right'}>右对齐</MenuItem>
                </TextField>
                <TextField
                  name="textBaseline"
                  onChange={changeProps}
                  size="small"
                  variant="outlined"
                  label="垂直居中"
                  select
                  value={textBaseline}
                >
                  <MenuItem value={'top'}>顶部对齐</MenuItem>
                  <MenuItem value={'middle'}>居中</MenuItem>
                  <MenuItem value={'bottom'}>底部对齐</MenuItem>
                </TextField>
              </div>

              <TextField
                name="text"
                onChange={changeProps}
                size="small"
                variant="outlined"
                label="文本"
                type="text"
                multiline
                rows={2}
                value={text}
              />
            </Panel>
          )}

          {/* // node */}
          {data.type === 0 && (
            <>
              <Panel title="样式">
                <div className={classes.root}>
                  <TextField
                    name="lineWidth"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="边框宽度"
                    type="number"
                    value={lineWidth}
                  />
                  <TextField
                    name="strokeStyle"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="边框颜色"
                    type="color"
                    value={strokeStyle}
                  />

                  <TextField
                    name="fillStyle"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="背景颜色"
                    type="color"
                    value={fillStyle}
                  />
                  <TextField
                    name="globalAlpha"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="透明度(0-1)"
                    type="number"
                    value={globalAlpha}
                  />
                </div>
              </Panel>
              <Panel title="位置和大小">
                <div className={classes.root}>
                  <TextField
                    name="x"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="x(px)"
                    type="number"
                    value={data.pen?.rect?.x}
                  />
                  <TextField
                    name="y"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="y(px)"
                    type="number"
                    value={data.pen?.rect?.y}
                  />
                  <TextField
                    name="width"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="宽(px)"
                    type="number"
                    value={data.pen?.rect?.width}
                  />
                  <TextField
                    name="height"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="高(px)"
                    type="number"
                    value={data.pen?.rect?.height}
                  />
                  <TextField
                    name="borderRadius"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="圆角(0-1)"
                    type="number"
                    value={borderRadius}
                  />
                  <TextField
                    name="rotate"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="旋转(°)"
                    type="number"
                    value={rotate}
                  />
                </div>
              </Panel>
            </>
          )}
          {/* // 连线 */}
          {data.type === 1 && (
            <>
              <Panel title="连线样式">
                <div className={classes.root}>
                  <TextField
                    name="strokeStyle"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="连线颜色"
                    type="color"
                    value={strokeStyle}
                  />
                  <TextField
                    name="lineWidth"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="连线宽度"
                    type="number"
                    value={lineWidth}
                  />
                  <TextField
                    name="name"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="连线类型"
                    select
                    value={name}
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

                    {/* 脑图线,有点问题
             <MenuItem value="mind">
              <div className="arrow-icon">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" strokeWidth="1">
                    <path d="M0 15 C0,8 50,0 85,0" />
                  </g>
                </svg>
              </div>
            </MenuItem> */}
                  </TextField>
                  <TextField
                    name="dash"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="连线样式"
                    select
                    value={dash}
                  >
                    <MenuItem value={0}>_________</MenuItem>
                    <MenuItem value={1}>---------</MenuItem>
                    <MenuItem value={2}>_ _ _ _ _</MenuItem>
                    <MenuItem value={3}>- . - . - .</MenuItem>
                  </TextField>

                  <TextField
                    type="text"
                    name="fromArrow"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="起点箭头"
                    select
                    value={fromArrow}
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
                                <circle
                                  id="椭圆形"
                                  cx="3"
                                  cy="3"
                                  r="3"
                                ></circle>
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
                  <TextField
                    name="toArrow"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="终点箭头"
                    select
                    value={toArrow}
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
                                <circle
                                  id="椭圆形"
                                  cx="3"
                                  cy="3"
                                  r="3"
                                ></circle>
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

                  <TextField
                    name="fromArrowColor"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="起点箭头颜色"
                    type="color"
                    value={fromArrowColor}
                  />
                  <TextField
                    name="toArrowColor"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="终点箭头颜色"
                    type="color"
                    value={toArrowColor}
                  />

                  <TextField
                    name="fromArrowSize"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="起点箭头大小"
                    type="number"
                    value={fromArrowSize}
                  />
                  <TextField
                    name="toArrowSize"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="终点箭头大小"
                    type="number"
                    value={toArrowSize}
                  />
                </div>
              </Panel>
            </>
          )}

          {/* // 多选 */}
          {data.type === 2 && (
            <>
              <Panel title="对齐">
                <div className={classes.align_box}>
                  {nodesAlgin.map((item, index) => (
                    <Tooltip title={item.desc} key={item.value}>
                      <div
                        className={classes.toolbar_button}
                        key={index}
                        onClick={() => onNodesAlign(item.value)}
                      >
                        <i className={`iconfont icon-align-${item.value}`}></i>
                      </div>
                    </Tooltip>
                  ))}
                  <Tooltip title="等距分布，两端对齐，节点之间的间隔都相等">
                    <div
                      className={classes.toolbar_button}
                      onClick={() => onSpaceBetween()}
                    >
                      <i className="iconfont icon-horizontal-between"></i>
                    </div>
                  </Tooltip>
                </div>
              </Panel>
              <Panel title="排版">
                <Grid className={classes.root} container spacing={3}>
                  <Grid item xs={6}>
                    最大宽度:
                  </Grid>
                  <Grid item xs={6}>
                    <Input
                      type="number"
                      value={layoutData.maxWidth}
                      onChange={(value) => {
                        //@ts-ignore
                        setLayoutData({ ...layoutData, maxWidth: value });
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    节点宽度:
                  </Grid>
                  <Grid item xs={6}>
                    <Input
                      type="number"
                      value={layoutData.nodeWidth}
                      onChange={(value) => {
                        //@ts-ignore
                        setLayoutData({ ...layoutData, nodeWidth: value });
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    节点高度:
                  </Grid>
                  <Grid item xs={6}>
                    <Input
                      type="number"
                      value={layoutData.nodeHeight}
                      onChange={(value) => {
                        //@ts-ignore
                        setLayoutData({ ...layoutData, nodeHeight: value });
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    水平个数:
                  </Grid>
                  <Grid item xs={6}>
                    <Input
                      type="number"
                      value={layoutData.maxCount}
                      onChange={(value) => {
                        //@ts-ignore
                        setLayoutData({ ...layoutData, maxCount: value });
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    水平间距:
                  </Grid>
                  <Grid item xs={6}>
                    <Input
                      type="number"
                      value={layoutData.spaceWidth}
                      onChange={(value) => {
                        //@ts-ignore
                        setLayoutData({ ...layoutData, spaceWidth: value });
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    垂直间距:
                  </Grid>
                  <Grid item xs={6}>
                    <Input
                      type="number"
                      value={layoutData.spaceHeight}
                      onChange={(value) => {
                        //@ts-ignore
                        setLayoutData({ ...layoutData, spaceHeight: value });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      size="small"
                      color="primary"
                      onClick={() => onLayout(layoutData)}
                    >
                      开始排版
                    </Button>
                  </Grid>
                </Grid>
              </Panel>
            </>
          )}
        </TabPanel>
        <TabPanel className={classes.noMargin} value={value} index={1}>
          <Panel title="动画">
            {/* // node */}
            {data.type === 0 && (
              <>
                <div className={classes.allWidth}>
                  <TextField
                    name="animateType"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="特效"
                    type="string"
                    select
                    value={animateType}
                  >
                    {animationList.map((item) => (
                      <MenuItem value={item.id} key={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>

                <div className={classes.root}>
                  <TextField
                    name="animateDuration"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="时长"
                    type="number"
                    value={animateDuration}
                  />

                  <TextField
                    name="animateCycle"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="时长"
                    type="number"
                    value={animateCycle}
                  />
                </div>
              </>
            )}
            {/* // 连线 */}
            {data.type === 1 && (
              <>
                <div className={classes.allWidth}>
                  <TextField
                    name="animateType"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="特效"
                    type="string"
                    select
                    value={animateType}
                  >
                    {lineAnimationList.map((item) => (
                      <MenuItem value={item.id} key={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>

                <div className={classes.root}>
                  <TextField
                    name="animateColor"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="颜色"
                    type="color"
                    value={animateColor}
                  />
                  <TextField
                    name="animateSpan"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="快慢"
                    type="number"
                    value={animateSpan}
                  />
                  <TextField
                    name="animateDotSize"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="圆点大小"
                    type="number"
                    value={animateDotSize}
                  />
                  <TextField
                    name="animateCycle"
                    onChange={changeProps}
                    size="small"
                    variant="outlined"
                    label="循环次数"
                    type="number"
                    value={animateCycle}
                  />
                </div>
              </>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                marginTop: '10px',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => {
                  propsChange({ animateStart: new Date().getTime() });
                }}
              >
                播放
              </Button>
              {/* <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => {
                  propsChange({ animatePlay: true });
                }}
              >
                自动播放
              </Button> */}
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => {
                  propsChange({ animateStart: 0 });
                }}
              >
                停止
              </Button>
            </div>
          </Panel>
        </TabPanel>
        <TabPanel className={classes.noMargin} value={value} index={2}>
          <Panel title="点击事件">
            <div style={{ width: '100%' }}>
              <Button
                variant="outlined"
                onClick={() =>
                  setEventList([
                    ...eventList,
                    { type: 1, action: 0, value: '' },
                  ])
                }
              >
                添加点击事件
              </Button>
              {eventList.map((item, key) => (
                <div
                  key={key}
                  style={{
                    borderBottom: ' 1px solid lightgray',
                    padding: '12px 0px',
                    position: 'relative',
                  }}
                >
                  <Tooltip title="删除">
                    <IconButton
                      style={{ position: 'absolute', right: '6px', top: '6px' }}
                      onClick={() =>
                        setEventList(eventList.filter((evt) => evt !== item))
                      }
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </Tooltip>

                  <div style={{ padding: '8px 0' }}>
                    事件类型:
                    <Select
                      style={{ marginLeft: '8px' }}
                      value={item.type}
                      onChange={(e) => {
                        setEventList(
                          eventList.map((eventItem: any) => {
                            if (eventItem === item) {
                              eventItem.type = e.target.value;
                            }
                            return eventItem;
                          })
                        );
                      }}
                    >
                      <MenuItem value={0}>单击</MenuItem>
                      <MenuItem value={1}>双击</MenuItem>
                    </Select>
                  </div>
                  <div style={{ padding: '8px 0' }}>链接地址:</div>
                  <Input
                    value={item.value}
                    onChange={(e: any) =>
                      setEventList(
                        eventList.map((eventItem: any) => {
                          if (eventItem === item) {
                            eventItem.value = e.target.value;
                          }
                          return eventItem;
                        })
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </Panel>
        </TabPanel>
        <TabPanel className={classes.noMargin} value={value} index={3}>
          <Panel title="选中的节点">
            {data.multi &&
              data.nodes?.map((pen: any, index) => {
                return (
                  <PenItem pen={pen} handleSelect={handleSelect} key={index} />
                );
              })}
            {!data.multi && data.pen && (
              <PenItem pen={data.pen} handleSelect={handleSelect} />
            )}
          </Panel>
        </TabPanel>
      </>
    );
  }
);
export default RightMenu;
