import React, { useEffect } from 'react';
import './contentHeader.css'
import boardPng from '../../assets/img/board.png';
interface ContentHeaderProps {

}

const ContentHeader: React.FC<ContentHeaderProps> = (prop) => {
  return <div className="contentHeader">
    <img src={boardPng} alt="" className="contentHeader-logo"/>首页
  </div>;
};
export default ContentHeader;