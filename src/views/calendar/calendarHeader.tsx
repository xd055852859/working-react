import React from 'react';
import './calendarHeader.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { setMoveState } from '../../redux/actions/commonActions';
import calendarHomePng from '../../assets/img/calendarHome.png';
interface CalendarProps {
  slot: any;
}

const Calendar: React.FC<CalendarProps> = (props) => {
  let { slot } = props;
  const dispatch = useDispatch();
  const moveState = useTypedSelector((state) => state.common.moveState);
  return (
    <div
      className="calendarHeader"
    >
      <img src={calendarHomePng} alt="" className="calendarHeader-logo" />
      <div style={{ marginRight: '20px' }}>日程</div>
      {slot}
    </div>
  );
};
Calendar.defaultProps = {};
export default Calendar;
