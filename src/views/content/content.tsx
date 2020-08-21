import React, { FC, useEffect } from 'react';
import './content.css';
import { useDispatch } from 'react-redux';
import MemberBoard from '../board/memberBoard';
import MainBoard from '../board/mainBoard';

import ContentHeader from './contentHeader';
export interface ContentProps {}
const Content: FC<ContentProps> = (props) => {
  const dispatch = useDispatch();

  return (
    <div className="content">
      <ContentHeader />
      <div className="content-container">
        <div className="content-title"></div>
        <MemberBoard />
        <MainBoard />
      </div>
    </div>
  );
};
export default Content;
