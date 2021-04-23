import React, { useState, useEffect, useRef } from 'react';
import './headerSet.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Switch, Drawer} from 'antd';
import api from '../../services/api';
import _ from 'lodash';

import { setMessage } from '../../redux/actions/commonActions';
import { setTheme } from '../../redux/actions/authActions';

import UserCenter from '../userCenter/userCenter';
import Vitality from '../vitality/vitality';
import HeaderBg from './headerBg';
import Dialog from '../common/dialog';

import set4Png from '../../assets/img/set4.png';
import set5Svg from '../../assets/svg/set5.svg';
import set6Svg from '../../assets/svg/set6.svg';
import set10Svg from '../../assets/svg/set10.svg';
import set9Svg from '../../assets/svg/set11.svg';
import rightArrowPng from '../../assets/img/rightArrow.png';
import logoutPng from '../../assets/img/logout.png';
import batteryPng from '../../assets/img/battery.png';
import bgImg from '../../assets/img/bgImg.png';

interface HeaderContentProps {}

const HeaderContent: React.FC<HeaderContentProps> = (props) => {
  const {} = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useTypedSelector((state) => state.auth.user);
  const theme = useTypedSelector((state) => state.auth.theme);
  const socket = useTypedSelector((state) => state.auth.socket);

  const [moveType, setMoveType] = useState(0);
  const [showVitality, setShowVitality] = useState(false);
  const [targetInfo, setTargetInfo] = useState<any>(null);
  const [chooseWallKey, setChooseWallKey] = useState('');
  let unDistory = useRef<any>(null);
  unDistory.current = true;
  useEffect(() => {
    if (user) {
      getVitalityInfo();
    }
    return () => {
      // unDistory.current = false;
    };
  }, [user]);
  const getVitalityInfo = async () => {
    let res: any = await api.auth.getTargetUserInfo(user._key);
    if (unDistory.current) {
      if (res.msg == 'OK') {
        setTargetInfo(res.result);
      } else {
        dispatch(setMessage(true, res.msg, 'error'));
      }
    }
  };
  const changeBoard = (type: string, checked: boolean) => {
    console.log(checked);
    let newTheme = _.cloneDeep(theme);
    newTheme[type] = checked;
    dispatch(setTheme(newTheme));
    localStorage.setItem(type, checked + '');
  };

  const logout = async () => {
    localStorage.clear();
    socket.emit('logout', user._key);
    dispatch(setMessage(true, '退出登录成功', 'success'));
    history.push('/');
  };

  return (
    <React.Fragment>
      {/* <Tabs defaultActiveKey="1">
        <TabPane tab="设置" key="1"> */}
      <div className="contentHeader-set-title">
        <div
          className="contentHeader-set-avatar"
          onClick={(e) => {
            e.stopPropagation();
            setMoveType(1);
          }}
        >
          {user ? <img src={user.profile.avatar} alt="" /> : null}
        </div>
        <div
          className="contentHeader-set-item contentHeader-set-vitality"
          onClick={() => {
            setShowVitality(true);
          }}
        >
          <div className="contentHeader-set-item-bg-info">
            <img
              src={set6Svg}
              alt=""
              style={{
                width: '15px',
                height: '17px',
                marginRight: '10px',
                cursor: 'pointer',
              }}
              onClick={(e) => {
                e.stopPropagation();
                setMoveType(1);
              }}
            />
            <div>{user.profile.nickName}</div>
          </div>
          <div className="bg-item-right">
            <img src={batteryPng} alt="" className="contentHeader-set-numImg" />
            <div style={{ color: '#17B881', fontSize: '12px' }}>
              活力 {targetInfo && targetInfo.energyValueTotal}
            </div>
          </div>
        </div>
      </div>
      <div
        className="contentHeader-set-item"
        onClick={() => {
          setMoveType(2);
        }}
      >
        <div className="contentHeader-set-item-bg-info">
          <img
            src={bgImg}
            alt=""
            style={{
              width: '15px',
              height: '17px',
              marginRight: '10px',
            }}
          />
          <div>壁纸设置</div>
        </div>
        <div className="bg-item-right">
          <div
            className="bg-item"
            style={{
              backgroundImage: theme.backgroundImg
                ? 'url(' +
                  theme.backgroundImg +
                  '?imageMogr2/auto-orient/thumbnail/80x)'
                : '',
              backgroundColor: !theme.backgroundImg
                ? theme.backgroundColor
                : '',
              marginBottom: '0px',
              width: '44px',
              height: '25px',
            }}
          ></div>
          <img
            src={rightArrowPng}
            alt=""
            style={{
              width: '7px',
              height: '11px',
              marginLeft: '5px',
            }}
          />
        </div>
      </div>

      {/* <div
        className="contentHeader-set-item"
        onClick={() => {
          setMoveType(5);
        }}
      >
        <div className="contentHeader-set-item-title">
          <img
            src={set11Svg}
            alt=""
            style={{
              width: '20px',
              height: '15px',
              marginRight: '5px',
            }}
          />
          <div>首页设置</div>
        </div>
        <img
          src={rightArrowPng}
          alt=""
          style={{
            width: '7px',
            height: '11px',
            marginLeft: '5px',
          }}
        />
      </div> */}
      <div className="contentHeader-set-item">
        <div className="contentHeader-set-item-title">
          <img
            src={set4Png}
            alt=""
            style={{
              width: '20px',
              height: '15px',
              marginRight: '5px',
            }}
          />
          <div>日程</div>
        </div>
        <div>
          <Switch
            checked={theme.calendarVisible ? true : false}
            onChange={(checked) => {
              changeBoard('calendarVisible', checked);
            }}
          />
        </div>
      </div>
      <div className="contentHeader-set-item">
        <div className="contentHeader-set-item-title">
          <img
            src={set5Svg}
            alt=""
            style={{
              width: '19px',
              height: '18px',
              marginRight: '6px',
            }}
          />
          <div>任务时长</div>
        </div>
        <div>
          <Switch
            checked={theme.hourVisible ? true : false}
            onChange={(checked) => {
              changeBoard('hourVisible', checked);
            }}
          />
        </div>
      </div>
      <div className="contentHeader-set-item">
        <div className="contentHeader-set-item-title">
          <img
            src={set9Svg}
            alt=""
            style={{
              width: '20px',
              height: '15px',
              marginRight: '5px',
            }}
          />
          <div>语音消息</div>
        </div>
        <div>
          <Switch
            checked={theme.soundVisible ? true : false}
            onChange={(checked) => {
              changeBoard('soundVisible', checked);
            }}
          />
        </div>
      </div>
      <div
        className="contentHeader-set-item"
        onClick={() => {
          window.open('https://workfly.cn/help/1');
        }}
      >
        <div className="contentHeader-set-item-title">
          <img
            src={set10Svg}
            alt=""
            style={{
              width: '17px',
              height: '20px',
              marginRight: '8px',
            }}
          />
          <div>帮助</div>
        </div>
      </div>
      <div className="contentHeader-set-item">
        <div
          className="contentHeader-set-item-title"
          onClick={() => {
            logout();
          }}
          style={{ cursor: 'pointer' }}
        >
          <img
            src={logoutPng}
            alt=""
            style={{
              width: '16px',
              height: '15px',
              marginRight: '5px',
            }}
          />
          <div>退出登录</div>
        </div>
      </div>
      {/* </TabPane> */}
      {/* <TabPane tab="文件" key="2">
          <FileList
            groupKey={''}
            type="最近"
            fileHeight={document.body.clientHeight - 70}
            fileItemWidth={'calc(100% - 270px)'}
          />
        </TabPane>
        <TabPane tab="收藏" key="3">
          <FileList
            groupKey={mainGroupKey}
            type="收藏"
            fileHeight={document.body.clientHeight - 70}
            fileItemWidth={'calc(100% - 270px)'}
          />
        </TabPane>       
      </Tabs> */}
      <Drawer
        visible={moveType === 1}
        onClose={() => {
          setMoveType(0);
          // if (childRef?.current) {
          //   //@ts-ignore
          //   childRef.current.getInfo();
          // }
        }}
        width={280}
        bodyStyle={{
          padding: '10px',
          boxSizing: 'border-box',
        }}
        destroyOnClose={true}
        headerStyle={{
          padding: '10px',
          boxSizing: 'border-box',
        }}
        title={'用户设置'}
      >
        <UserCenter
          onClose={() => {
            setMoveType(0);
          }}
        />
      </Drawer>
      <Drawer
        visible={moveType === 2}
        onClose={() => {
          setMoveType(0);
          // if (childRef?.current) {
          //   //@ts-ignore
          //   childRef.current.getInfo();
          // }
        }}
        width={280}
        bodyStyle={{
          padding: '10px',
          boxSizing: 'border-box',
        }}
        headerStyle={{
          padding: '10px',
          boxSizing: 'border-box',
        }}
        destroyOnClose={true}
        title={'壁纸设置'}
      >
        <HeaderBg setChooseWallKey={setChooseWallKey} />
      </Drawer>

      <Dialog
        visible={showVitality}
        onClose={() => {
          setShowVitality(false);
        }}
        footer={false}
        title={'活力值'}
        dialogStyle={{
          width: '90%',
          height: '90%',
          overflow: 'auto',
        }}
      >
        <Vitality
          vitalityType={2}
          vitalityKey={user._key}
          fatherVitalityInfo={targetInfo}
        />
      </Dialog>
    </React.Fragment>
  );
};
HeaderContent.defaultProps = {};
export default HeaderContent;
