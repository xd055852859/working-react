import React, { useState, useEffect } from 'react';
import './content.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import MemberBoard from '../board/memberBoard';
import MainBoard from '../board/mainBoard';
import MessageBoard from '../board/messageBoard';
import ContentHeader from './contentHeader';
import { setMessage } from '../../redux/actions/commonActions';
import api from '../../services/api';
import moment from 'moment';
export interface ContentProps {}
const Content: React.FC<ContentProps> = (props) => {
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const theme = useTypedSelector((state) => state.auth.theme);
  const [nowTime, setNowTime] = useState<any>([]);
  const [prompt, setPrompt] = useState();
  useEffect(() => {
    let interval: any = null;
    if (user) {
      formatTime();
      getPrompt();
      interval = setInterval(formatTime, 60000);
      // getSocket();
    }
    return () => {
      clearInterval(interval);
    };
  }, [user]);
  const formatTime = () => {
    let hour = moment().hour();
    let minute = moment().minute();
    let nowTime: any = [];
    if (hour < 9) {
      nowTime[0] = '早上';
    } else if (hour < 11 && minute < 30) {
      nowTime[0] = '上午';
    } else if (hour < 13 && minute < 30) {
      nowTime[0] = '中午';
    } else if (hour < 18) {
      nowTime[0] = '下午';
    } else {
      nowTime[0] = '晚上';
    }
    nowTime[1] = moment().format('HH:mm');
    console.log(new Date());
    setNowTime(nowTime);
  };
  const getPrompt = async () => {
    let promptRes: any = await api.auth.getPrompt();
    if (promptRes.msg === 'OK') {
      setPrompt(promptRes.result.content);
      // dispatch(setMessage(true, '申请加群成功', 'success'));
    } else {
      dispatch(setMessage(true, promptRes.msg, 'error'));
    }
  };
  return (
    <div className="content">
      <ContentHeader />
      <div className="content-container">
        <div className="content-title">
          <div className="content-mainTitle">
            {nowTime[0]}好,亲爱的{user && user.profile.nickName}
          </div>
          <div className="content-timeTitle">{nowTime[1]}</div>
          <div className="content-subTitle">{prompt}</div>
        </div>
        {theme && theme.memberVisible ? <MemberBoard /> : null}
        {theme && theme.mainVisible ? <MainBoard /> : null}
        {theme && theme.messageVisible ? <MessageBoard /> : null}
      </div>
    </div>
  );
};
export default Content;
