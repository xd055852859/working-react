import React, { useState, useEffect } from 'react';
import './test.css';
import { Button, Carousel } from 'antd';
import { useDispatch } from 'react-redux';
import HeatmapChart from '../../components/common/chart/heatmapChart';
import api from '../../services/api';
import moment from 'moment';
import _ from 'lodash';
import bgWSvg from '../../assets/svg/bg-white.svg';
import cloudSvg from '../../assets/svg/clouds.svg';
import welcomeSvg from '../../assets/svg/welcome.svg';
import welcomeSmallSvg from '../../assets/svg/welcomeSmall.svg';
import LineChart from '../../components/common/chart/lineChart';
interface TestProps {
  percent: number;
  scale: number;
}

const Test: React.FC<TestProps> = (props) => {
  const { percent, scale } = props;
  const dispatch = useDispatch();
  const [monthData, setMonthData] = useState<any>([]);
  const [clientHeight, setClientHeight] = useState(0);
  const [clientWidth, setClientWidth] = useState(0);
  const [heatmapData, setHeatmapData] = useState<any>(null);
  useEffect(() => {
    setClientHeight(document.body.offsetHeight);
    setClientWidth(document.body.offsetWidth);
  }, []);
  const data = [
    { name: '星期一', value: 0 },
    { name: '星期二', value: 11 },
    { name: '星期三', value: 22 },
    { name: '星期四', value: 33 },
    { name: '星期五', value: 44 },
    { name: '星期六', value: 55 },
    { name: '星期日', value: 66 },
  ];
  // const contentStyle = {
  //   height: clientHeight,
  //   color: '#fff',
  //   lineHeight: '160px',
  //   background: '#364d79',
  // };

  return (
    <div>
      <LineChart
        data={data}
        chartHeight={150}
        lineId={'groupLineTest'}
        // zoom={0.5}
      />
    </div>
  );
};
Test.defaultProps = {};
export default Test;
