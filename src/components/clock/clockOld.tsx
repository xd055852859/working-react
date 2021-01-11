import React, { useState, useEffect } from 'react';
import './clockOld.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
interface ClockProps {}

const Clock: React.FC<ClockProps> = (props) => {
  const {} = props;
  const TRANSITION = '100ms linear';
  const [hourAngle, setHourAngle] = useState(0);
  const [minAngle, setMinAngle] = useState(0);
  const [secAngle, setSecAngle] = useState(0);
  const [transition, setTransition] = useState(TRANSITION);
  const [timer, setTimer] = useState<any>(null);
  const hourArr: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // useEffect(() => {
  //   let timer: any = null;
  //   updateTime();
  //   timer = setInterval(() => {
  //     updateTime();
  //   }, 100);
  //   setTimer(timer);
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);
  const updateTime = () => {
    const dom: any = document.querySelector('.second');
    let newSecAngle = (moment().second() + moment().millisecond() / 1000) * 6;
    let newMinAngle = moment().minutes() * 6 + newSecAngle / 60;
    let newHourAngle = (moment().hour() % 12) * 30 + newMinAngle / 12;
    let transition: any = TRANSITION;
    //  当秒针走到 0 的时候 角度其实是变小了 所以会倒着转 需要暂时删除 transition
    if (dom) {
      if (newSecAngle > 358) {
        dom.style.display = 'none';
      } else {
        dom.style.display = 'block';
      }
    }
    setHourAngle(newHourAngle);
    setMinAngle(newMinAngle);
    setSecAngle(newSecAngle);
    setTransition(transition);
  };
  const leadingZero = (number: number) => {
    return number < 10 ? '0' + number : number;
  };
  return (
    // <div className="deTime">
    <div className="container">
      {hourArr.map((item: any) => {
        return (
          <div
            key={item}
            className="grad"
            style={{ transform: `rotateZ(${item * 30}deg)` }}
          ></div>
        );
      })}
      <div
        className="minute"
        style={{ transform: 'rotateZ(' + minAngle + 'deg)' }}
      ></div>
      <div
        className="hour"
        style={{ transform: 'rotateZ(' + hourAngle + 'deg)' }}
      ></div>
      <div
        className="second"
        style={{
          transition: transition,
          transform: 'rotateZ(' + secAngle + 'deg)',
        }}
      ></div>
      <div className="center"></div>
    </div>
    // </div>
  );
};
Clock.defaultProps = {};
export default Clock;
