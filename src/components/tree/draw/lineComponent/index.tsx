import React, { useMemo, useEffect, FC } from 'react';
import { Form, InputNumber, Tabs, Collapse, Row, Col, Select, Input,  Checkbox } from 'antd';
import './index.css';
const { Panel } = Collapse;
const { TabPane } = Tabs;
const { Option } = Select;
interface LineComponentProps{
  data:any
  form:{
    getFieldDecorator:any
    validateFields:any
    resetFields:any
  }
  onFormValueChange:(value:any)=>void
}

const LineComponent:FC<LineComponentProps> = ({ data, form: { getFieldDecorator }, form, onFormValueChange }) => {
  const {
    lineWidth,
    dash,
    strokeStyle,
    name,
    fromArrow,
    toArrow,
    fromArrowColor,
    toArrowColor,
    fromArrowSize,
    toArrowSize,
    animateStart,
    animatePlay,
    animateType,
    animateCycle,
    animateColor,
    animateSpan,
    animateDotSize,
  } = data?.line || {};

  useEffect(() => {
    form.validateFields((err:any, value:any) => {
      if (err) return;
      if (Object.keys(data).length === 0) return;
      if (
        value.lineWidth === lineWidth &&
        value.dash === dash &&
        value.strokeStyle === strokeStyle &&
        value.name === name &&
        value.toArrow === toArrow &&
        value.fromArrow === fromArrow &&
        value.animateStart === animateStart &&
        value.animatePlay === animatePlay &&
        value.animateType === animateType &&
        value.animateCycle === animateCycle &&
        value.animateColor === animateColor &&
        value.animateSpan === animateSpan &&
        value.animateDotSize === animateDotSize
      )
        return;
      onFormValueChange(value);
      form.resetFields();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  /**
   * 渲染位置和大小的表单
   */

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
  /**
   * 渲染动画设置表单
   */
  const renderAnimationForm = useMemo(() => {
    return (
      <Form>
        <Col span={12}>
          <Form.Item>
            {getFieldDecorator('animateStart', {
              valuePropName: 'checked',
              initialValue: !!animateStart,
            })(<Checkbox>开始播放</Checkbox>)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item>
            {getFieldDecorator('animatePlay', {
              valuePropName: 'checked',
              initialValue: animatePlay,
            })(<Checkbox>自动播放</Checkbox>)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="动画类型">
            {getFieldDecorator('animateType', {
              initialValue: animateType,
            })(
              <Select>
                {lineAnimationList.map((item) => {
                  return (
                    <Select.Option value={item.id} key={item.id}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="颜色">
            {getFieldDecorator('animateColor', {
              initialValue: animateColor,
            })(<Input type="color" />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="快慢">
            {getFieldDecorator('animateSpan', {
              initialValue: animateSpan,
            })(<InputNumber />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="圆点大小">
            {getFieldDecorator('animateDotSize', {
              initialValue: animateDotSize,
            })(<InputNumber />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="循环次数">
            {getFieldDecorator('animateCycle', {
              initialValue: animateCycle,
            })(<InputNumber />)}
          </Form.Item>
        </Col>
      </Form>
    );
  }, [
    getFieldDecorator,
    animateStart,
    animatePlay,
    animateType,
    lineAnimationList,
    animateColor,
    animateSpan,
    animateDotSize,
    animateCycle,
  ]);

  const renderForm = useMemo(() => {
    return (
      <Form>
        <Row>
          <Col span={12}>
            <Form.Item label="连线颜色">
              {getFieldDecorator('strokeStyle', {
                initialValue: strokeStyle,
              })(<Input type="color" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="连线类型">
              {getFieldDecorator('name', {
                initialValue: name,
              })(
                <Select style={{ width: '95%' }}>
                   <Option value="curve">
              <div className="arrow-icon">
                <svg width="15px" height="15px" viewBox="0 0 15 15" version="1.1">
                  <title>17-2@1x</title>
                  <desc>Created with Sketch.</desc>
                  <g id="时光绘图" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="切图" transform="translate(-655.000000, -260.000000)" stroke="#0A0A0A">
                      <g id="17-2" transform="translate(655.000000, 260.000000)">
                        <rect id="矩形" x="0.5" y="0.5" width="2" height="2"></rect>
                        <rect id="矩形" x="12.5" y="12.5" width="2" height="2"></rect>
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
                <svg width="15px" height="15px" viewBox="0 0 15 15" version="1.1">
                  <title>17-1@1x</title>
                  <desc>Created with Sketch.</desc>
                  <g id="时光绘图" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="切图" transform="translate(-655.000000, -224.000000)">
                      <g id="17-1" transform="translate(655.000000, 224.000000)">
                        <rect id="矩形" stroke="#0A0A0A" x="0.5" y="0.5" width="2" height="2" />
                        <rect id="矩形" fill="#0A0A0A" x="3" y="1" width="5" height="1" />
                        <rect id="矩形" stroke="#0A0A0A" x="12.5" y="12.5" width="2" height="2" />
                        <rect id="矩形" fill="#0A0A0A" x="7" y="13" width="5" height="1" />
                        <rect id="矩形" fill="#0A0A0A" x="7" y="1" width="1" height="13" />
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
            </Option>
            <Option value="line">
              <div className="arrow-icon">
                <svg width="15px" height="15px" viewBox="0 0 15 15" version="1.1">
                  <title>17-3@1x</title>
                  <desc>Created with Sketch.</desc>
                  <g id="时光绘图" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="切图" transform="translate(-655.000000, -297.000000)" stroke="#0A0A0A">
                      <g id="17-3" transform="translate(655.000000, 297.000000)">
                        <rect id="矩形" x="0.5" y="0.5" width="2" height="2"></rect>
                        <rect id="矩形" x="12.5" y="12.5" width="2" height="2"></rect>
                        <line x1="2" y1="2" x2="12.5759506" y2="12.5" id="路径-3" strokeLinejoin="round"></line>
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
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="连线样式">
              {getFieldDecorator('dash', {
                initialValue: dash,
              })(
                <Select style={{ width: '95%' }}>
                  <Option value={0}>_________</Option>
                  <Option value={1}>---------</Option>
                  <Option value={2}>_ _ _ _ _</Option>
                  <Option value={3}>- . - . - .</Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col offset={1} span={11}>
            <Form.Item label="连线宽度">
              {getFieldDecorator('lineWidth', {
                initialValue: lineWidth,
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="起点箭头">
              {getFieldDecorator('fromArrow', {
                initialValue: fromArrow,
              })(
                <Select style={{ width: '95%' }}>
                  <Option value="null">
                    <div className="arrow-icon">
                      <svg width="29px" height="1px" viewBox="0 0 29 1" version="1.1">
                        <title>18-1@1x</title>
                        <desc>Created with Sketch.</desc>
                        <g id="时光绘图" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <g id="切图" transform="translate(-942.000000, -110.000000)" fill="#0A0A0A">
                            <rect id="18-1" x="942" y="110" width="29" height="1"></rect>
                          </g>
                        </g>
                      </svg>
                    </div>
                  </Option>
                  <Option value="triangleSolid">
                    <div style={{ height: '20px' }}>
                      <svg width="29px" height="8px" viewBox="0 0 29 8" version="1.1">
                        <title>18-2@1x</title>
                        <desc>Created with Sketch.</desc>
                        <g id="时光绘图" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <g id="切图" transform="translate(-940.000000, -126.000000)" fill="#0A0A0A">
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
                      <svg width="29px" height="8px" viewBox="0 0 29 8" version="1.1">
                        <title>18-3@1x</title>
                        <desc>Created with Sketch.</desc>
                        <g id="时光绘图" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <g id="切图" transform="translate(-940.000000, -146.000000)">
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
                      <svg width="29px" height="8px" viewBox="0 0 29 8" version="1.1">
                        <title>18-5@1x</title>
                        <desc>Created with Sketch.</desc>
                        <g id="时光绘图" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <g id="切图" transform="translate(-940.000000, -185.000000)" fill="#0A0A0A">
                            <g id="18-5" transform="translate(940.000000, 184.000000)">
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
                      <svg width="29px" height="8px" viewBox="0 0 29 8" version="1.1">
                        <title>18-6@1x</title>
                        <desc>Created with Sketch.</desc>
                        <g id="时光绘图" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <g id="切图" transform="translate(-940.000000, -205.000000)">
                            <g id="18-6" transform="translate(940.000000, 204.000000)">
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
                      <svg width="28px" height="6px" viewBox="0 0 28 6" version="1.1">
                        <title>18-7@1x</title>
                        <desc>Created with Sketch.</desc>
                        <g id="时光绘图" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <g id="切图" transform="translate(-941.000000, -226.000000)" fill="#0A0A0A">
                            <g id="18-7" transform="translate(941.000000, 226.000000)">
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
                      <svg width="28px" height="6px" viewBox="0 0 28 6" version="1.1">
                        <title>18-8@1x</title>
                        <desc>Created with Sketch.</desc>
                        <g id="时光绘图" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <g id="切图" transform="translate(-941.000000, -246.000000)">
                            <g id="18-8" transform="translate(941.000000, 246.000000)">
                              <circle id="椭圆形" stroke="#0A0A0A" cx="3" cy="3" r="2.5"></circle>
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
                      <svg width="28px" height="8px" viewBox="0 0 28 8" version="1.1">
                        <title>18-4@1x</title>
                        <desc>Created with Sketch.</desc>
                        <g id="时光绘图" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <g id="切图" transform="translate(-941.000000, -166.000000)">
                            <g id="18-4" transform="translate(941.000000, 166.000000)">
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
                      <svg width="28px" height="5px" viewBox="0 0 28 5" version="1.1">
                        <title>18-10@1x</title>
                        <desc>Created with Sketch.</desc>
                        <g id="时光绘图" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <g id="切图" transform="translate(-941.000000, -267.000000)">
                            <g id="18-10" transform="translate(941.000000, 267.000000)">
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
                      <svg width="28px" height="5px" viewBox="0 0 28 5" version="1.1">
                        <title>18-11@1x</title>
                        <desc>Created with Sketch.</desc>
                        <g id="时光绘图" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <g id="切图" transform="translate(-941.000000, -287.000000)">
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
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="结束箭头">
              {getFieldDecorator('toArrow', {
                initialValue: toArrow,
              })(
                <Select style={{ width: '95%' }}>
                  <Option value="null">
                    <div className="arrow-icon">
                      <svg width="29px" height="1px" viewBox="0 0 29 1" version="1.1">
                        <title>18-1-1@1x</title>
                        <desc>Created with Sketch.</desc>
                        <g id="时光绘图" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <g id="切图" transform="translate(-1007.000000, -110.000000)" fill="#0A0A0A">
                            <rect id="19-1" x="1007" y="110" width="29" height="1"></rect>
                          </g>
                        </g>
                      </svg>
                    </div>
                  </Option>
                  <Option value="triangleSolid">
                    <div style={{ height: '20px' }}>
                      <svg width="29px" height="8px" viewBox="0 0 29 8" version="1.1">
                        <title>18-2-1@1x</title>
                        <desc>Created with Sketch.</desc>
                        <g id="时光绘图" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <g id="切图" transform="translate(-1007.000000, -126.000000)" fill="#0A0A0A">
                            <g id="19-2" transform="translate(1007.000000, 126.000000)">
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
                      <svg width="29px" height="8px" viewBox="0 0 29 8" version="1.1">
                        <title>18-3-1@1x</title>
                        <desc>Created with Sketch.</desc>
                        <g id="时光绘图" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <g id="切图" transform="translate(-1007.000000, -146.000000)">
                            <g id="19-3" transform="translate(1007.000000, 146.000000)">
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
                      <svg width="29px" height="8px" viewBox="0 0 29 8" version="1.1">
                        <title>18-5-1@1x</title>
                        <desc>Created with Sketch.</desc>
                        <g id="时光绘图" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <g id="切图" transform="translate(-1008.000000, -185.000000)" fill="#0A0A0A">
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
                      <svg width="29px" height="8px" viewBox="0 0 29 8" version="1.1">
                        <title>18-6-1@1x</title>
                        <desc>Created with Sketch.</desc>
                        <g id="时光绘图" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <g id="切图" transform="translate(-1008.000000, -205.000000)">
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
                      <svg width="28px" height="6px" viewBox="0 0 28 6" version="1.1">
                        <title>18-7-1@1x</title>
                        <desc>Created with Sketch.</desc>
                        <g id="时光绘图" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <g id="切图" transform="translate(-1008.000000, -226.000000)" fill="#0A0A0A">
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
                      <svg width="28px" height="6px" viewBox="0 0 28 6" version="1.1">
                        <title>18-8-1@1x</title>
                        <desc>Created with Sketch.</desc>
                        <g id="时光绘图" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <g id="切图" transform="translate(-1008.000000, -246.000000)">
                            <g
                              id="19-8"
                              transform="translate(1022.000000, 249.000000) scale(-1, 1) translate(-1022.000000, -249.000000) translate(1008.000000, 246.000000)"
                            >
                              <circle id="椭圆形" stroke="#0A0A0A" cx="3" cy="3" r="2.5"></circle>
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
                      <svg width="28px" height="8px" viewBox="0 0 28 8" version="1.1">
                        <title>18-4-1@1x</title>
                        <desc>Created with Sketch.</desc>
                        <g id="时光绘图" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <g id="切图" transform="translate(-1008.000000, -166.000000)">
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
                      <svg width="28px" height="5px" viewBox="0 0 28 5" version="1.1">
                        <title>18-10-1@1x</title>
                        <desc>Created with Sketch.</desc>
                        <g id="时光绘图" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <g id="切图" transform="translate(-1008.000000, -266.000000)">
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
                      <svg width="28px" height="5px" viewBox="0 0 28 5" version="1.1">
                        <title>18-11-1@1x</title>
                        <desc>Created with Sketch.</desc>
                        <g id="时光绘图" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <g id="切图" transform="translate(-1008.000000, -286.000000)">
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
                </Select>,
              )}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="起点箭头颜色">
              {getFieldDecorator('fromArrowColor', {
                initialValue: fromArrowColor,
              })(<Input type="color" />)}
            </Form.Item>
          </Col>
          <Col offset={1} span={11}>
            <Form.Item label="终点箭头颜色">
              {getFieldDecorator('toArrowColor', {
                initialValue: toArrowColor,
              })(<Input type="color" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="起点箭头大小">
              {getFieldDecorator('fromArrowSize', {
                initialValue: fromArrowSize,
              })(<InputNumber />)}
            </Form.Item>
          </Col>
          <Col offset={1} span={11}>
            <Form.Item label="终点箭头大小">
              {getFieldDecorator('toArrowSize', {
                initialValue: toArrowSize,
              })(<InputNumber />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }, [
    getFieldDecorator,
    strokeStyle,
    name,
    dash,
    lineWidth,
    fromArrow,
    toArrow,
    fromArrowColor,
    toArrowColor,
    fromArrowSize,
    toArrowSize,
  ]);

  return (
    <div className="rightArea">
      <Tabs defaultActiveKey="1">
        <TabPane tab="外观" key="1" style={{ margin: 0 }}>
          <Collapse defaultActiveKey={['1']}>
            <Panel header="样式" key="1" forceRender>
              {renderForm}
            </Panel>
          </Collapse>
        </TabPane>
        <TabPane tab="动效" key="2" style={{ margin: 0 }}>
          <Collapse defaultActiveKey={['1']}>
            <Panel header="动画" key="1" forceRender>
              {renderAnimationForm}
            </Panel>
          </Collapse>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Form.create()(LineComponent);
