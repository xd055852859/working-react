import React, { useState, useEffect } from 'react';
import './calendarHeader.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import calendarHomePng from '../../assets/img/calendarHome.png';
interface CalendarProps {}

const Calendar: React.FC<CalendarProps> = (props) => {
  const {} = props;
  const user = useTypedSelector((state) => state.auth.user);

  // {traditionalDate.GetLunarDay(moment())[1]}
  return (
    <div className="calendarHeader">
      <img src={calendarHomePng} alt="" className="calendarHeader-logo" />
      日程
    </div>
  );
};
Calendar.defaultProps = {};
export default Calendar;
