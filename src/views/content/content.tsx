import React, { useEffect } from 'react';
import './content.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import MemberBoard from '../board/memberBoard';
import MainBoard from '../board/mainBoard';
import MessageBoard from '../board/messageBoard';
import ContentHeader from './contentHeader';
import { getTheme } from '../../redux/actions/authActions';
import api from '../../services/api';
export interface ContentProps {}
const Content: React.FC<ContentProps> = (props) => {
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const theme = useTypedSelector((state) => state.auth.theme);
  useEffect(() => {
    if (user) {
      dispatch(getTheme());
    }
  }, [user]);
  return (
    <div className="content">
      <ContentHeader />
      <div className="content-container">
        {/* <div className="content-title"></div> */}

        {theme && theme.memberVisible ? <MemberBoard /> : null}
        {theme && theme.mainVisible ? <MainBoard /> : null}
        {theme && theme.messageVisible ? <MessageBoard /> : null}
      </div>
    </div>
  );
};
export default Content;
