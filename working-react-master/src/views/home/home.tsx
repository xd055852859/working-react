import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './home.css';
import logoSvg from '../../assets/svg/logo.svg';
import boardPng from '../../assets/img/board.png';
import tablePng from '../../assets/img/table.png';
import chatPng from '../../assets/img/chat.png';
import calendarPng from '../../assets/img/calendarHome.png';
import fixIconSvg from '../../assets/svg/fixIcon.svg';
import unfixIconSvg from '../../assets/svg/unfixIcon.svg';
import Tabs from '../tabs/tabs';
import { useDispatch } from 'react-redux';
import { setCommonHeaderIndex } from '../../redux/actions/commonActions';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { setTheme } from '../../redux/actions/authActions';
import _ from 'lodash';
import { Tooltip } from '@material-ui/core';
export interface HomeProps {}

const Home: React.FC<HomeProps> = (props) => {
  // const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const moveState = useTypedSelector((state) => state.common.moveState);
  const theme = useTypedSelector((state) => state.auth.theme);

  useEffect(() => {
    localStorage.removeItem('page');
  }, []);
  const changeBoard = (type: string, bool: boolean) => {
    let newTheme = _.cloneDeep(theme);
    newTheme[type] = bool;
    dispatch(setTheme(newTheme));
  };
  return (
    <div
      className="home"
      style={
        moveState === 'in'
          ? {
              animation: 'moveIn 500ms',
              // animationFillMode: 'forwards',
              left: '-320px',
            }
          : moveState === 'out'
          ? {
              animation: 'moveOut 500ms',
              // animationFillMode: 'forwards',
              left: '0px',
            }
          : { left: '0px' }
      }
    >
      <div
        className="home-bg1"
        style={{
          background: 'rgba(0,0,0,' + theme.grayPencent + ')',
        }}
      ></div>
      <div
        className="home-bg2"
        style={
          theme.backgroundImg
            ? {
                backgroundImage: 'url(' + theme.backgroundImg + ')',
              }
            : { backgroundColor: theme.backgroundColor }
        }
      ></div>
      <div className="home-b"></div>
      <div className="home-header">
        <div className="home-header-logo">
          <img
            src={logoSvg}
            alt=""
            onClick={() => {
              history.push('/');
              localStorage.setItem('viewWelcome', '1');
            }}
          />
          {theme.moveState ? (
            <Tooltip title="锁定左侧面板">
              <img
                src={fixIconSvg}
                alt=""
                style={{ width: '30px', height: '30px' }}
                onClick={() => {
                  changeBoard('moveState', false);
                }}
              />
            </Tooltip>
          ) : (
            <Tooltip title="动态伸缩左侧面板">
              <img
                src={unfixIconSvg}
                alt=""
                style={{ width: '30px', height: '30px' }}
                onClick={() => {
                  changeBoard('moveState', true);
                }}
              />
            </Tooltip>
          )}
        </div>
        <div
          className="home-header-item"
          style={
            headerIndex === 0 ? { background: 'rgba(255, 255, 255, 0.34)' } : {}
          }
          onClick={() => {
            dispatch(setCommonHeaderIndex(0));
          }}
        >
          <img src={boardPng} alt="" className="home-header-item-logo" />
          首页
        </div>
        <div
          style={
            headerIndex === 1 ? { background: 'rgba(255, 255, 255, 0.34)' } : {}
          }
          className="home-header-item"
          onClick={() => {
            dispatch(setCommonHeaderIndex(1));
          }}
        >
          <img src={tablePng} alt="" className="home-header-item-logo" />
          我的工作
        </div>
        {theme && theme.calendarVisible ? (
          <div
            style={
              headerIndex === 5
                ? { background: 'rgba(255, 255, 255, 0.34)' }
                : {}
            }
            className="home-header-item"
            onClick={() => {
              dispatch(setCommonHeaderIndex(5));
            }}
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
