import React, { useMemo, useEffect, useState, FC, useCallback } from 'react';
import { Form, InputNumber, Checkbox, Tabs, Collapse, Row, Col, Input, Select, Switch, Icon, Button } from 'antd';
import { IconList } from '../config/config';
import './index.css';
import IconPage from '../iconComponent';
import { useSelector } from 'react-redux';
import { uploadImage } from '../../../../services/uploadImage';
const { Panel } = Collapse;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

interface CanvasPropsProps {
  data: any;
  form: {
    getFieldDecorator: any;
    validateFields: any;
    resetFields: any;
    getFieldsValue: any;
    setFieldsValue: any;
    getFieldValue: any;
  };
  onFormValueChange: (value: any) => void;
}
interface eventType {
  type: number;
  action: number;
  value?: string;
}
const NodeComponent: FC<CanvasPropsProps> = ({
  data,
  form: { getFieldDecorator, getFieldValue },
  form,
  onFormValueChange,
}) => {
  const qiniuToken = useSelector((state: any) => state.auth.qiniuToken);
  const { x, y, width, height } = data?.node?.rect || {};
  const {
    rotate,
    lineWidth,
    strokeStyle,
    dash,
    text,
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
  } = data?.node || {};
  const { color, fontSize, fontFamily, fontWeight, fontStyle, textAlign, textBaseline } = data?.node?.font || {};
  const extraFields = data.node.data; // 用户自定义数据片段
  const [iconShow, setIconShow] = useState(false);
  const [iconData, setIconData] = useState<{
    class: string;
    unicode: string;
  } | null>();
  const [eventList, setEventList] = useState<eventType[]>(events);

  useEffect(() => {
    form.validateFields((err: any, value: any) => {
      if (err) return;
      if (Object.keys(data).length === 0) return;
      if (
        value.x === x &&
        value.y === y &&
        value.width === width &&
        value.height === height &&
        value.rotate === rotate &&
        value.lineWidth === lineWidth &&
        value.strokeStyle === strokeStyle &&
        value.dash === dash &&
        value.color === color &&
        value.fontFamily === fontFamily &&
        value.fontSize === fontSize &&
        value.text === text &&
        value.data === extraFields &&
        value.fontWeight === fontWeight &&
        value.fontStyle === fontStyle &&
        value.animateStart === animateStart &&
        value.animatePlay === animatePlay &&
        value.animateType === animateType &&
        value.animateDuration === animateDuration &&
        value.animateCycle === animateCycle &&
        value.icon === icon &&
        value.iconColor === iconColor &&
        value.iconFamily === iconFamily &&
        value.iconSize === iconSize &&
        value.imageAlign === imageAlign
      )
        return;
      onFormValueChange({ ...value, events: eventList });
      form.resetFields();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, eventList]);

  useEffect(() => {
    if (icon) {
      let iconInit = IconList.filter((item: any) => String.fromCharCode(item.unicode) === icon);    
      setIconData(iconInit[0]);
    } else {
      setIconData(null);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 渲染位置和大小的表单
   */

  const renderForm = useMemo(() => {
    return (
      <Form>
        <Row>
          <Col span={24}>
            <Form.Item label="背景颜色">
              {getFieldDecorator('fillStyle', {
                initialValue: fillStyle,
              })(<Input type="color" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="X(px)">
              {getFieldDecorator('x', {
                initialValue: x,
              })(<InputNumber />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Y(px)">
              {getFieldDecorator('y', {
                initialValue: y,
              })(<InputNumber />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="宽(px)">
              {getFieldDecorator('width', {
                initialValue: width,
              })(<InputNumber />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="高(px)">
              {getFieldDecorator('height', {
                initialValue: height,
              })(<InputNumber />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="圆角(0-1)">
              {getFieldDecorator('borderRadius', {
                initialValue: borderRadius,
              })(<InputNumber min={0} max={1} step={0.1} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="旋转(°)">
              {getFieldDecorator('rotate', {
                initialValue: rotate,
              })(<InputNumber formatter={(value) => `${value}°`} />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }, [getFieldDecorator, fillStyle, x, y, width, height, borderRadius, rotate]);

  /**
   * 渲染样式的表单
   */

  const renderStyleForm = useMemo(() => {
    return (
      <Form>
        <Row>
          <Col span={24}>
            <Form.Item label="线条颜色">
              {getFieldDecorator('strokeStyle', {
                initialValue: strokeStyle,
              })(<Input type="color" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="线条样式">
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
          <Col span={12}>
            <Form.Item label="线条宽度">
              {getFieldDecorator('lineWidth', {
                initialValue: lineWidth,
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }, [lineWidth, strokeStyle, dash, getFieldDecorator]);

  /**
   * 渲染字体的表单
   */

  const renderFontForm = useMemo(() => {
    return (
      <Form>
        <Col span={24}>
          <Form.Item label="字体颜色">
            {getFieldDecorator('color', {
              initialValue: color,
            })(<Input type="color" />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="字体类型">
            {getFieldDecorator('fontFamily', {
              initialValue: fontFamily ? fontFamily : 'SimSun',
            })(
              <Select>
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
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={11} offset={1}>
          <Form.Item label="字体大小">
            {getFieldDecorator('fontSize', {
              initialValue: fontSize ? fontSize : 14,
            })(<InputNumber formatter={(value) => `${value}px`} />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="斜体">
            {getFieldDecorator('fontStyle', {
              initialValue: fontStyle ? fontStyle : 'normal',
            })(
              <Select style={{ width: '95%' }}>
                <Option value={'normal'}>正常</Option>
                <Option value={'italic'}>倾斜</Option>
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={11} offset={1}>
          <Form.Item label="加粗">
            {getFieldDecorator('fontWeight', {
              initialValue: fontWeight ? fontWeight : 'normal',
            })(
              <Select style={{ width: '95%' }}>
                <Option value={'normal'}>正常</Option>
                <Option value={'bold'}>加粗</Option>
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="水平对齐">
            {getFieldDecorator('textAlign', {
              initialValue: textAlign ? textAlign : 'center',
            })(
              <Select style={{ width: '95%' }}>
                <Option value={'left'}>左对齐</Option>
                <Option value={'center'}>居中</Option>
                <Option value={'right'}>右对齐</Option>
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={11} offset={1}>
          <Form.Item label="垂直对齐">
            {getFieldDecorator('textBaseline', {
              initialValue: textBaseline ? textBaseline : 'middle',
            })(
              <Select style={{ width: '95%' }}>
                <Option value={'top'}>顶部对齐</Option>
                <Option value={'middle'}>居中</Option>
                <Option value={'bottom'}>底部对齐</Option>
              </Select>,
            )}
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="文本">
            {getFieldDecorator('text', {
              initialValue: text,
            })(<TextArea />)}
          </Form.Item>
        </Col>
      </Form>
    );
  }, [getFieldDecorator, color, fontFamily, fontSize, fontStyle, fontWeight, textAlign, textBaseline, text]);

  /**
   * 渲染元素本身数据
   */
  /* 
  const renderDataForm = useMemo(() => {
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    }
    return (
      <Form {...formItemLayout}>
        <Col>
          <Form.Item label="ID">
            <span className="ant-form-text">
              <Tag color="#f50">{id}</Tag>
            </span>
          </Form.Item>
        </Col>
      </Form>
    )
  }, [id])

  

  const renderExtraDataForm = useMemo(() => {
    return (
      <Form>
        <Col>
          <Form.Item label="自定义数据字段">
            {getFieldDecorator("data", {
              initialValue: extraFields,
            })(<TextArea rows={10} />)}
          </Form.Item>
         <ExtraDataForm extraFields={extraFields} form={form} /> 
        </Col>
      </Form>
    )
  }, [extraFields, getFieldDecorator])
 */
  const animationList = [
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
    {
      id: 'custom',
      name: '自定义',
    },
  ];
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  /**
   * 渲染动画设置表单
   */

  const renderAnimationForm = useMemo(() => {
    return (
      <Form {...formItemLayout}>
        <Col>
          <Form.Item label="播放">
            {getFieldDecorator('animateStart', {
              valuePropName: 'checked',
              initialValue: !!animateStart,
            })(<Switch />)}

            {getFieldDecorator('animatePlay', {
              valuePropName: 'checked',
              initialValue: animatePlay,
            })(<Checkbox>自动播放</Checkbox>)}
          </Form.Item>
          <Form.Item label="时长">
            {getFieldDecorator('animateDuration', {
              initialValue: animateDuration,
            })(<InputNumber />)}
          </Form.Item>
          <Form.Item label="特效">
            {getFieldDecorator('animateType', {
              initialValue: animateType,
            })(
              <Select>
                {animationList.map((item) => {
                  return (
                    <Select.Option value={item.id} key={item.id}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="循环次数">
            {getFieldDecorator('animateCycle', {
              initialValue: animateCycle,
            })(<InputNumber />)}
          </Form.Item>
        </Col>
      </Form>
    );
  }, [
    formItemLayout,
    getFieldDecorator,
    animateStart,
    animatePlay,
    animateDuration,
    animateType,
    animationList,
    animateCycle,
  ]);

  /**
   *  图片图标 字体图标
   */

  const iconAlignslist = [
    {
      id: 'center',
      name: '居中',
    },
    {
      id: 'top',
      name: '上',
    },
    {
      id: 'bottom',
      name: '下',
    },
    {
      id: 'left',
      name: '左',
    },
    {
      id: 'right',
      name: '右',
    },
    {
      id: 'left-top',
      name: '左上',
    },
    {
      id: 'right-top',
      name: '右上',
    },
    {
      id: 'left-bottom',
      name: '左下',
    },
    {
      id: 'right-bottom',
      name: '右下',
    },
  ];
  const onImageUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = async (event) => {
      const elem: any = event.target;
      if (elem.files && elem.files[0]) {
        uploadImage(qiniuToken, elem.files[0], true, function (url: any) {
          form.setFieldsValue({ image: url });
        });
      }
    };
    input.click();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qiniuToken]);

  const renderFontIcon = useMemo(() => {
    return (
      <Form>
        <Row style={{ color: '#bfbfbf', fontSize: '12px' }}>注:图片图标优先于字体图标</Row>
        <Row>
          <Col span={12} style={{ height: '30px', lineHeight: '30px' }}>
            字体图标:
          </Col>
          <Col
            span={12}
            onClick={() => {
              setIconShow(true);
            }}
          >
            {iconData ? (
              <i className={`topology icon ${iconData?.class}`}></i>
            ) : (
              <div className="upload-icon">
                <Icon type="plus" />
              </div>
            )}
          </Col>
        </Row>
        <Row style={{ marginTop: '5px' }}>
          <Col span={12} style={{ height: '30px', lineHeight: '30px' }}>
            图片图标:
          </Col>
          <Col span={12}>
            <Button onClick={onImageUpload}>上传图片</Button>
            {/*  {imageSrc ? <img src={imageSrc} alt="图片" /> : null} */}
          </Col>
          <Col span={24}>
            <Form.Item>
              {getFieldDecorator('image', {
                initialValue: image,
              })(<Input type="text" />)}
            </Form.Item>
          </Col>
          <Form.Item style={{ display: 'none' }}>
            {getFieldDecorator('icon', {
              initialValue: icon,
            })(<Input type="text" />)}
          </Form.Item>
          <Col span={12}>
            <Form.Item label="字体大小">
              {getFieldDecorator('iconSize', {
                initialValue: iconSize ? iconSize : 0,
              })(<InputNumber />)}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="字体颜色">
              {getFieldDecorator('iconColor', {
                initialValue: iconColor,
              })(<Input type="color" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="字体家族">
              {getFieldDecorator('iconFamily', {
                initialValue: iconFamily,
              })(<Input type="text" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="对齐方式">
              {getFieldDecorator('imageAlign', {
                initialValue: imageAlign,
              })(
                <Select>
                  {iconAlignslist.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }, [
    getFieldDecorator,
    icon,
    iconAlignslist,
    iconColor,
    iconData,
    iconFamily,
    iconSize,
    image,
    imageAlign,
    onImageUpload,
  ]);

  const iconChange = (data: any) => {
    let formData = Object.assign({}, form.getFieldsValue());
    formData.icon = data ? String.fromCharCode(data.unicode) : '';
    formData.iconFamily = 'Topology';
    setIconShow(false);
    setIconData(data);
    form.setFieldsValue(formData);
  };

  return (
    <>
      <div className={`${iconShow ? 'no-display' : null} "rightArea"`}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="外观" key="1" style={{ margin: 0 }}>
            <Collapse defaultActiveKey={['4','2','3', '1']}>
              <Panel header="图片" key="4" forceRender>
                {renderFontIcon}
              </Panel>
              <Panel header="样式" key="1" forceRender>
                {renderStyleForm}
              </Panel>
              <Panel header="文字" key="2" forceRender>
                {renderFontForm}
              </Panel>
              <Panel header="位置和大小" key="3" forceRender>
                {renderForm}
              </Panel>
            </Collapse>
          </TabPane>
          <TabPane tab="事件" key="2" style={{ margin: 0 }}>
            <Collapse defaultActiveKey={['1']}>
              <Panel header="点击事件" key="1">
                <Button
                  onClick={() =>
                    setEventList([...eventList, { type: 1, action: 0, value: '' }])
                  }
                >
                  添加点击事件
                </Button>
                {eventList.map((item, key) => (
                  <div
                    key={key}
                    style={{ borderBottom: ' 1px solid lightgray', padding: '12px 0px', position: 'relative' }}
                  >
                    <Button
                      icon="delete"
                      size="small"
                      style={{ position: 'absolute', right: '6px', top: '6px' }}
                      onClick={() => setEventList(eventList.filter((evt) => evt !== item))}
                    />
                    <div style={{ padding: '8px 0' }}>
                      事件类型:
                      <Select
                        style={{ marginLeft: '8px' }}
                        value={item.type}
                        onChange={(value: number) => {
                          setEventList(
                            eventList.map((eventItem: any) => {
                              if (eventItem === item) {
                                eventItem.type = value;
                              }
                              return eventItem;
                            }),
                          );
                        }}
                      >
                        <Option value={0}>单击</Option>
                        <Option value={1}>双击</Option>
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
                          }),
                        )
                      }
                    />
                  </div>
                ))}
              </Panel>
            </Collapse>
          </TabPane>
          <TabPane tab="动效" key="3" style={{ margin: 0 }}>
            <Collapse defaultActiveKey={['1']}>
              <Panel header="动画" key="1">
                {renderAnimationForm}
              </Panel>
            </Collapse>
          </TabPane>
        </Tabs>
      </div>
      <div className={`${iconShow ? null : 'no-display'} "rightArea"`}>
        <IconPage
          onSubmit={iconChange}
          onCancel={() => {
            setIconShow(false);
          }}
        />
      </div>
    </>
  );
};

export default React.memo(Form.create()(NodeComponent));
