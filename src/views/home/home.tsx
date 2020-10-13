import React from 'react';
import './home.css';
import logoPng from '../../assets/img/logo.png';
import boardPng from '../../assets/img/board.png';
import tablePng from '../../assets/img/table.png';
import chatPng from '../../assets/img/chat.png';
import calendarPng from '../../assets/img/calendarHome.png';
import Tabs from '../tabs/tabs';
import { useDispatch } from 'react-redux';
import { setCommonHeaderIndex } from '../../redux/actions/commonActions';
import { useTypedSelector } from '../../redux/reducer/RootState';

export interface HomeProps {}

const Home: React.FC<HomeProps> = (props) => {
  // const location = useLocation();
  // const history = useHistory();
  const dispatch = useDispatch();
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const moveState = useTypedSelector((state) => state.common.moveState);
  const theme = useTypedSelector((state) => state.auth.theme);
  return (
    <div
      className="home"
      style={
        moveState === 'in'
          ? {
              animation: 'moveIn 500ms',
              // animationFillMode: 'forwards',
              width: '0px',
            }
          : moveState === 'out'
          ? {
              animation: 'moveOut 500ms',
              // animationFillMode: 'forwards',
              width: '320px',
            }
          : { width: '320px' }
      }
    >
      <div
        className="home-bg"
        style={
          theme.backgroundImg
            ? { backgroundImage: 'url(' + theme.backgroundImg + ')' }
            : { backgroundColor: theme.backgroundColor }
        }
      ></div>
      <div className="home-b"></div>
      <div className="home-header">
        <div
          className="home-header-logo"
          onClick={() => {
            const redirect = `${window.location.protocol}//${window.location.host}`;
            window.location.href = `${redirect}/bootpage`;
          }}
        >
          <img src={logoPng} alt="" />
        </div>
        <div
          className="home-header-item"
          style={
            headerIndex === 0 ? { background: 'rgba(255, 255, 255, 0.34)' } : {}
          }
          onClick={() => dispatch(setCommonHeaderIndex(0))}
        >
          <img src={boardPng} alt="" className="home-header-item-logo" />
          首页
        </div>
        <div
          style={
            headerIndex === 1 ? { background: 'rgba(255, 255, 255, 0.34)' } : {}
          }
          className="home-header-item"
          onClick={() => dispatch(setCommonHeaderIndex(1))}
        >
          <img src={tablePng} alt="" className="home-header-item-logo" />
          我的工作台
        </div>
        {theme && theme.calendarVisible ? (
          <div
            style={
              headerIndex === 5
                ? { background: 'rgba(255, 255, 255, 0.34)' }
                : {}
            }
            className="home-header-item"
            onClick={() => dispatch(setCommonHeaderIndex(5))}
          >
            <img src={calendarPng} alt="" className="home-header-item-logo" />
            我的日程
          </div>
        ) : null}
        {/* <div
          style={
            headerIndex === 4 ? { background: 'rgba(255, 255, 255, 0.34)' } : {}
          }
          className="home-header-item"
          onClick={() => dispatch(setCommonHeaderIndex(4))}
        >
          <img src={chatPng} alt="" className="home-header-item-logo" />
          聊天
        </div> */}
      </div>
      <Tabs />
    </div>
  );
};
export default Home;
