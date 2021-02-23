import React from 'react';
import './calendarHeader.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { setMoveState } from '../../redux/actions/commonActions';
import calendarHomePng from '../../assets/img/calendarHome.png';
interface CalendarProps {}

const Calendar: React.FC<CalendarProps> = (props) => {
  const dispatch = useDispatch();
  const moveState = useTypedSelector((state) => state.common.moveState);
  return (
    <div
      className="calendarHeader"
      onClick={() => {
        dispatch(setMoveState(moveState === 'in' ? 'out' : 'in'));
      }}
    >
      <img src={calendarHomePng} alt="" className="calendarHeader-logo" />
      日程
    </div>
  );
};
Calendar.defaultProps = {};
export default Calendar;
