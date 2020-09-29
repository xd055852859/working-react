import React, { useState, useEffect } from 'react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import './contentHeader.css';
import HeaderSet from '../../components/headerSet/headerSet';
import boardPng from '../../assets/img/board.png';
import _ from 'lodash';

interface ContentHeaderProps {}

const ContentHeader: React.FC<ContentHeaderProps> = (prop) => {
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  return (
    <div className="contentHeader">
      {/* <img src={boardPng} alt="" className="contentHeader-logo" /> */}
      <HeaderSet />
    </div>
  );
};
export default ContentHeader;
