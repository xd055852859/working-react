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
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const [nowTime, setNowTime] = useState<any>([]);
  // const [createNum, setCreateNum] = useState(0);
  // const [finishNum, setfinishNum] = useState(0);
  const [prompt, setPrompt] = useState();
  const [timeInterval, setTimeInterval] = useState<any>(null);
  const [targetInterval, setTargetInterval] = useState<any>(null);
  useEffect(() => {
    let interval: any = null;
    if (user && headerIndex === 0) {
      formatTime();
      getPrompt();
      interval = setInterval(formatTime, 60000);
      // getSocket();
      setTimeInterval(interval);
    }
    return () => {
      if (timeInterval) {
        clearInterval(timeInterval);
      }
    };
  }, [user, headerIndex]);
  useEffect(() => {
    let interval: any = null;
    if (user && headerIndex === 0) {
      formatTime();
      getPrompt();
      interval = setInterval(formatTime, 60000);
      // getSocket();
      setTargetInterval(interval);
    }
    return () => {
      if (targetInterval) {
        clearInterval(targetInterval);
      }
    };
  }, []);
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
  const getNum = async (createNum: number, finishNum: number) => {
    // setCreateNum(createNum);
    // setfinishNum(finishNum);
  };
  return (
    <div className="content">
      <ContentHeader />
      <div className="content-container">
        <div className="content-title">
          <div className="content-mainTitle">
            {nowTime[0]}好,亲爱的{user && user.profile.nickName}
          </div>
          {/* <div className="content-timeTitle">创新力 {createNum}</div>
          <div className="content-timeTitle">执行力 {finishNum}</div> */}
          <div className="content-timeTitle">{nowTime[1]}</div>
          <div className="content-subTitle">{prompt}</div>
        </div>
        {theme && theme.mainVisible ? <MainBoard getNum={getNum} /> : null}
        {theme && theme.memberVisible ? <MemberBoard /> : null}
        {theme && theme.messageVisible ? <MessageBoard /> : null}
      </div>
    </div>
  );
};
export default Content;
