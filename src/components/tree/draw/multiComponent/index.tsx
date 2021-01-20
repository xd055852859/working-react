import { Button, Col, Collapse, InputNumber, Row, Tabs, Tooltip } from 'antd';
import React, { useState } from 'react';
import { layoutType } from '../../../../interfaces/Line';
import './index.css';

const { Panel } = Collapse;
const { TabPane } = Tabs;

interface MultiProps {
  data: any;
  handleSelect: (pen:any)=>void;
  onNodesAlign: (value:any)=>void;
  onSpaceBetween: Function;
  onLayout: (value:any)=>void;
}

const Multi = ({ data, handleSelect, onLayout, onNodesAlign, onSpaceBetween }: MultiProps) => {
  // 排版默认值
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

  return (
    <>
      <Tabs defaultActiveKey="1">
        <TabPane tab="外观" key="1" style={{ margin: 0 }}>
          <Collapse defaultActiveKey={['1', '0']}>
            <Panel header="对齐" key="0">
              <div className="algin">
                {nodesAlgin.map((item) => (
                  <Tooltip placement="bottomLeft" title={item.desc} key={item.value}>
                    <div className="toolbar_button" onClick={() => onNodesAlign(item.value)}>
                      <i className={`iconfont icon-align-${item.value}`}></i>
                    </div>
                  </Tooltip>
                ))}
                <Tooltip placement="bottomLeft" title="等距分布，两端对齐，节点之间的间隔都相等">
                  <div className="toolbar_button" onClick={() => onSpaceBetween()}>
                    <i className="iconfont icon-horizontal-between"></i>
                  </div>
                </Tooltip>
              </div>
            </Panel>
            <Panel header="排版" key="1">
              <Row className="mb10">
                <Col span={8}>最大宽度:</Col>
                <Col span={16}>
                  <InputNumber
                    type="number"
                    value={layoutData.maxWidth}
                    onChange={(value) => {
                      //@ts-ignore
                      setLayoutData({ ...layoutData, maxWidth: value });
                    }}
                  />
                </Col>
              </Row>
              <Row className="mb10">
                <Col span={8}>节点宽度:</Col>
                <Col span={16}>
                  <InputNumber
                    type="number"
                    value={layoutData.nodeWidth}
                    onChange={(value) => {
                      //@ts-ignore
                      setLayoutData({ ...layoutData, nodeWidth: value });
                    }}
                  />
                </Col>
              </Row>
              <Row className="mb10">
                <Col span={8}>节点高度:</Col>
                <Col span={16}>
                  <InputNumber
                    type="number"
                    value={layoutData.nodeHeight}
                    onChange={(value) => {
                      //@ts-ignore
                      setLayoutData({ ...layoutData, nodeHeight: value });
                    }}
                  />
                </Col>
              </Row>
              <Row className="mb10">
                <Col span={8}>水平个数:</Col>
                <Col span={16}>
                  <InputNumber
                    type="number"
                    value={layoutData.maxCount}
                    onChange={(value) => {
                      //@ts-ignore
                      setLayoutData({ ...layoutData, maxCount: value });
                    }}
                  />
                </Col>
              </Row>
              <Row className="mb10">
                <Col span={8}>水平间距:</Col>
                <Col span={16}>
                  <InputNumber
                    type="number"
                    value={layoutData.spaceWidth}
                    onChange={(value) => {
                      //@ts-ignore
                      setLayoutData({ ...layoutData, spaceWidth: value });
                    }}
                  />
                </Col>
              </Row>
              <Row className="mb10">
                <Col span={8}>垂直间距:</Col>
                <Col span={16}>
                  <InputNumber
                    value={layoutData.spaceHeight}
                    onChange={(value) => {
                      //@ts-ignore
                      setLayoutData({ ...layoutData, spaceHeight: value });
                    }}
                  />
                </Col>
              </Row>
              <Row style={{ textAlign: 'center' }} className="mb10">
                <Button onClick={() => onLayout(layoutData)}>开始排版</Button>
              </Row>
            </Panel>
          </Collapse>
        </TabPane>
        <TabPane tab="结构" key="4" style={{ margin: 0 }}>
          <Collapse defaultActiveKey={['1']}>
            <Panel header="选中区域" key="1">
              {data.nodes.map((pen: any) => {
                return (
                  <div className="pen-item" key={pen.id} onClick={() => handleSelect(pen)}>
                    <i className="iconfont icon-triangle-right"></i>[{pen.type ? '连线' : '节点'}] {pen.name}{' '}
                    {pen.text ? '-' + pen.text : ''}
                  </div>
                );
              })}
            </Panel>
          </Collapse>
        </TabPane>
      </Tabs>
    </>
  );
};

export default React.memo(Multi);
