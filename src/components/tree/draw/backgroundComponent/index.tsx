import React, { FC } from 'react';
import { Tabs, Collapse, Button, Row, Col } from 'antd';
import './index.css';
const { TabPane } = Tabs;
const { Panel } = Collapse;
interface ComponentProps {
  changeStyle: (style: string) => void;
}
const CanvasProps: FC<ComponentProps> = ({ changeStyle }) => {
  return (
    <div className="rightArea">
      <Tabs defaultActiveKey="1">
        <TabPane tab="样式模板" key="1" style={{ margin: 0 }}>
          <Collapse defaultActiveKey={['1']}>
            <Panel header="风格" key="1" forceRender>
              <Row style={{marginTop:'10px'}}>
                <Col span={12}>
                  <Button onClick={() => changeStyle('thin')}>细线条风格</Button>
                </Col>
                <Col span={12}>
                  <Button onClick={() => changeStyle('blod')}>粗线条风格</Button>
                </Col>
              </Row>
              <Row style={{marginTop:'10px'}}>
                <Col span={12}>
                  <Button onClick={() => changeStyle('blue')}>蓝色背景</Button>
                </Col>
                <Col span={12}>
                  <Button onClick={() => changeStyle('red')}>红色背景</Button>
                </Col>
              </Row>
              <Row style={{marginTop:'10px'}}>
                <Col span={12}>
                  <Button onClick={() => changeStyle('green')}>绿色背景</Button>
                </Col>
               
              </Row>
            </Panel>
          </Collapse>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default React.memo(CanvasProps);
