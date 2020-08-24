import React, { useEffect } from 'react';
import './home.css';
import logoPng from '../../assets/img/logo.png';
import boardPng from '../../assets/img/board.png';
import tablePng from '../../assets/img/table.png';
import chatPng from '../../assets/img/chat.png';
import Tabs from '../tabs/tabs';
import { useDispatch } from 'react-redux';
import { setHeaderIndex } from '../../redux/actions/commonActions';
import { useTypedSelector } from '../../redux/reducer/RootState';

export interface HomeProps {}

const Home: React.FC<HomeProps> = (props) => {
  // const location = useLocation();
  // const history = useHistory();
  const dispatch = useDispatch();
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  return (
    <div className="home">
      <div className="home-header">
        <div className="home-header-logo">
          <img src={logoPng} alt="" />
        </div>
        <div
          className="home-header-item"
          style={
            headerIndex == 0 ? { background: 'rgba(255, 255, 255, 0.34)' } : {}
          }
          onClick={() => dispatch(setHeaderIndex(0))}
        >
          <img src={boardPng} alt="" className="home-header-item-logo" />
          首页
        </div>
        <div
          style={
            headerIndex == 1 ? { background: 'rgba(255, 255, 255, 0.34)' } : {}
          }
          className="home-header-item"
          onClick={() => dispatch(setHeaderIndex(1))}
        >
          <img src={tablePng} alt="" className="home-header-item-logo" />
          我的工作台
        </div>
        <div
          style={
            headerIndex == 4 ? { background: 'rgba(255, 255, 255, 0.34)' } : {}
          }
          className="home-header-item"
          onClick={() => dispatch(setHeaderIndex(4))}
        >
          <img src={chatPng} alt="" className="home-header-item-logo" />
          聊天
        </div>
      </div>
      <Tabs />
    </div>
  );
};
export default Home;
