import React, { useState, useEffect } from 'react';
import './timeIcon.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';

interface TimeIconProps {
  timeColor?: any;
  timeClick?: any;
  timeDay: number;
  timeHour: number;
  timeType?: string;
}

const TimeIcon: React.FC<TimeIconProps> = (props) => {
  const { timeColor, timeClick, timeDay, timeHour, timeType } = props;
  const theme = useTypedSelector((state) => state.auth.theme);
  const [] = useState<number[]>([]);
  return (
    <div className="taskItem-day" style={timeColor} onClick={timeClick}>
      <div
        className="taskItem-time-day"
        style={
          theme.hourVisible
            ? { left: timeDay < 10 || timeDay > 5000 ? '5px' : '0px' }
            : { left: timeDay < 10 ? '6px' : '2px', bottom: '4.5px' }
        }
      >
        {timeDay > 5000 ? '∞' : timeDay > 99 ? '99+' : timeDay}
      </div>
      {theme.hourVisible ? (
        <React.Fragment>
          <div className="taskItem-time"></div>
          <div
            className="taskItem-time-hour"
            style={{
              right:
                (timeHour + '').length > 2
                  ? '4px'
                  : (timeHour + '').length > 1
                  ? '3px'
                  : '0px',
            }}
          >
            {timeHour > 99 ? '99+' : timeHour}
          </div>
        </React.Fragment>
      ) : null}
    </div>
  );
};
TimeIcon.defaultProps = { timeColor: {} };
export default TimeIcon;
