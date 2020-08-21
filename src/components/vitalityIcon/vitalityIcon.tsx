import React, { useState, useEffect } from 'react';
import './vitalityIcon.css';
import crownPng from '../../assets/img/crown.png';
import sunPng from '../../assets/img/sun.png';
import moonPng from '../../assets/img/moon.png';
import starPng from '../../assets/img/star.png';
import { useDispatch } from 'react-redux';

interface VitalityProps {
  vitalityDirection: string;
  vitalityNum: number;
}

const VitalityIcon: React.FC<VitalityProps> = (props) => {
  const { vitalityDirection, vitalityNum } = props;
  const [vitalityArray, setvitalityArray] = useState<number[]>([]);
  useEffect(() => {
    const crown = Math.floor(vitalityNum / 10000);
    const sun = Math.floor((vitalityNum - crown * 10000) / 1000);
    const moon = Math.floor((vitalityNum - crown * 10000 - sun * 1000) / 100);
    const star = Math.floor(
      (vitalityNum - crown * 10000 - sun * 1000 - moon * 100) / 10
    );
    setvitalityArray([crown, sun, moon, star]);
  }, [vitalityNum]);
  const vitalityImg = (
    num: number,
    src: any,
    width: string,
    height: string
  ) => {
    let dom = [];
    if (vitalityDirection == 'horizontal') {
      if (num > 0) {
        dom.push(
          <span
            style={{
              height: height,
              display: 'flex',
              alignContent: 'flex-end',
            }}
            key={'vertical' + num}
          >
            <span
              className="vitality-img"
              style={{ width: width, height: height }}
            >
              <img src={src} />
            </span>
            <span className="vitality-title">{num}</span>
          </span>
        );
      } else {
        for (var i = 0; i < num; i++) {
          dom.push(
            <span
              className="vitality-img"
              style={{ width: width, height: height }}
              key={'horizontal' + i}
            >
              <img src={src} />
            </span>
          );
        }
      }
    }
    return dom;
  };
  return (
    <span className="vitality-info">
      {vitalityImg(vitalityArray[0], crownPng, '20px', '17px')}
      {vitalityImg(vitalityArray[1], sunPng, '19px', '19px')}
      {vitalityImg(vitalityArray[2], moonPng, '16px', '16px')}
      {vitalityImg(vitalityArray[3], starPng, '16px', '16px')}
    </span>
  );
};
VitalityIcon.defaultProps = {
  vitalityDirection: 'horizontal',
  vitalityNum: 0,
};
export default VitalityIcon;