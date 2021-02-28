import React from 'react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import './contentHeader.css';

// import boardPng from '../../assets/img/board.png';
import _ from 'lodash';

interface ContentHeaderProps {}

const ContentHeader: React.FC<ContentHeaderProps> = (prop) => {
  return (
    <div className="contentHeader">
      {/* <img src={boardPng} alt="" className="contentHeader-logo" /> */}
    </div>
  );
};
export default ContentHeader;
