import React, { useState, useEffect } from 'react';
import './headerSet.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  setMessage,
  setCommonHeaderIndex,
  setMoveState as setCommonMoveState,
} from '../../redux/actions/commonActions';
import { setTheme, getTargetUserInfo } from '../../redux/actions/authActions';
import { setGroupKey } from '../../redux/actions/groupActions';
import set1Png from '../../assets/img/set1.png';
import set2Png from '../../assets/img/set2.png';
import set3Png from '../../assets/img/set3.png';
import set4Png from '../../assets/img/set4.png';
import set5Png from '../../assets/img/set5.png';
import set5Svg from '../../assets/svg/set5.svg';
import set6Svg from '../../assets/svg/set6.svg';
import set7Svg from '../../assets/svg/set7.svg';
import set8Svg from '../../assets/svg/set8.svg';
import companySvg from '../../assets/svg/company.svg';
import phoneSvg from '../../assets/svg/phone.svg';
import phone1Svg from '../../assets/svg/phone1.svg';
import phone2Svg from '../../assets/svg/phone2.svg';
import chromeSvg from '../../assets/svg/chrome.svg';

import rightArrowPng from '../../assets/img/rightArrow.png';
import leftArrowPng from '../../assets/img/leftArrow.png';
import logoutPng from '../../assets/img/logout.png';
import batteryPng from '../../assets/img/battery.png';
import bgImg from '../../assets/img/bgImg.png';
import defaultGroupPng from '../../assets/img/defaultGroup.png';

import {
  Switch,
  ClickAwayListener,
  Tooltip,
  Checkbox,
} from '@material-ui/core';
import UserCenter from '../userCenter/userCenter';
import Vitality from '../vitality/vitality';
import GroupCreate from '../../views/tabs/groupCreate';
import HeaderBg from './headerBg';
import Dialog from '../common/dialog';
import api from '../../services/api';
import _ from 'lodash';
interface HeaderContentProps {
  visible: boolean;
  onClose?: any;
}

const HeaderContent: React.FC<HeaderContentProps> = (props) => {
  const { visible, onClose } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useTypedSelector((state) => state.auth.user);
  const mainEnterpriseGroup = useTypedSelector(
    (state) => state.auth.mainEnterpriseGroup
  );

  const theme = useTypedSelector((state) => state.auth.theme);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const socket = useTypedSelector((state) => state.auth.socket);
  const [moveState, setMoveState] = useState('');
  const [avatar, setAvatar] = useState<any>(null);
  const [companyGroupList, setCompanyGroupList] = useState<any>([]);
  const [moveType, setMoveType] = useState(0);
  const [userVisible, setUserVisible] = useState(false);
  const [showVitality, setShowVitality] = useState(false);
  const [targetInfo, setTargetInfo] = useState<any>(null);
  const [bgVisible, setBgVisible] = useState(false);
  const [chooseWallKey, setChooseWallKey] = useState('');
  let unDistory = true;
  useEffect(() => {
    if (user && visible) {
      getVitalityInfo();
    }
    return () => {
      unDistory = false;
    };
  }, [user, visible]);
  useEffect(() => {
    if (targetInfo) {
      getCompanyGroupList();
    }
  }, [targetInfo]);
  const getVitalityInfo = async () => {
    let res: any = await api.auth.getTargetUserInfo(user._key);
    if (unDistory) {
      if (res.msg == 'OK') {
        setTargetInfo(res.result);
      } else {
        dispatch(setMessage(true, res.msg, 'error'));
      }
    }
  };
  const changeBoard = (type: string) => {
    let newTheme = _.cloneDeep(theme);
    newTheme[type] = newTheme[type] ? false : true;
    dispatch(setTheme(newTheme));
  };
  const getCompanyGroupList = async () => {
    let newCompanyGroupList: any = [];
    let res: any = await api.group.getUserEnterpriseGroupList();
    if (unDistory) {
      if (res.msg == 'OK') {
        res.result.forEach((item: any, index: number) => {
          if (targetInfo.mainEnterpriseGroupKey === item._key) {
            newCompanyGroupList.unshift(item);
          } else {
            newCompanyGroupList.push(item);
          }
        });
        setCompanyGroupList(newCompanyGroupList);
      } else {
        dispatch(setMessage(true, res.msg, 'error'));
      }
    }
  };

  const logout = async () => {
    localStorage.clear();
    socket.emit('logout', user._key);
    dispatch(setMessage(true, '退出登录成功', 'success'));
    history.push('/');
  };
  const changeMainEnterpriseKey = async (groupKey: string) => {
    let newTargetInfo = _.cloneDeep(targetInfo);
    let newCompanyGroupList: any = _.cloneDeep(companyGroupList);
    let res: any = await api.group.setMainEnterpriseGroup(groupKey);
    if (res.msg == 'OK') {
      // setCompanyGroupList(res.result);
      let groupIndex = _.findIndex(newCompanyGroupList, { _key: groupKey });
      let groupItem = _.cloneDeep(newCompanyGroupList[groupIndex]);
      newCompanyGroupList.splice(groupIndex, 1);
      newCompanyGroupList.unshift(groupItem);
      dispatch(setMessage(true, '修改主企业群成功', 'success'));
      newTargetInfo.mainEnterpriseGroupKey = groupKey;
      setTargetInfo(newTargetInfo);
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };
  const toTargetUser = async () => {
    dispatch(getTargetUserInfo(user._key));
    dispatch(setCommonHeaderIndex(2));
    if (!theme.moveState) {
      dispatch(setCommonMoveState('in'));
    }
    await api.group.visitGroupOrFriend(1, user._key);
  };
  return (
    <React.Fragment>
      {visible ? (
        <ClickAwayListener
          onClickAway={() => {
            onClose();
            setBgVisible(false);
            setUserVisible(false);
            setMoveState('');
            api.auth.chooseWallPapers(chooseWallKey);
          }}
        >
          {/* s */}
          <div
            className="contentHeader-user  animate__animated animate__fadeIn"
            style={{
              height:
                moveState === 'right'
                  ? moveType
                    ? moveType === 1
                      ? '295px'
                      : moveType === 3
                      ? 'calc(100% - 70px)'
                      : '200px'
                    : 'calc(100% - 70px)'
                  : '650px',
            }}
          >
            <div
              className="contentHeader-set-container"
              style={
                moveState === 'right'
                  ? {
                      animation: 'moveRight 500ms',
                      // animationFillMode: 'forwards',
                      left: '-260px',
                    }
                  : moveState === 'left'
                  ? {
                      animation: 'moveLeft 500ms',
                      // animationFillMode: 'forwards',
                      left: '0px',
                    }
                  : { left: '0px', height: '650px' }
              }
            >
              <div className="contentHeader-set-left">
                <div className="contentHeader-set-title">
                  <div
                    className="contentHeader-set-avatar"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserVisible(true);
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
                          setUserVisible(true);
                        }}
                      />
                      <div>{user.profile.nickName}</div>
                    </div>
                    <div className="bg-item-right">
                      <img
                        src={batteryPng}
                        alt=""
                        className="contentHeader-set-numImg"
                      />
                      <div style={{ color: '#17B881', fontSize: '12px' }}>
                        活力 {targetInfo && targetInfo.energyValueTotal}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="contentHeader-set-item"
                  onClick={() => {
                    setMoveState('right');
                    setMoveType(0);
                  }}
                  style={bgVisible ? { backgroundColor: '#f0f0f0' } : {}}
                >
                  <div className="contentHeader-set-item-title contentHeader-set-item-bg">
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
                </div>
                <div
                  className="contentHeader-set-item"
                  onClick={() => {
                    toTargetUser();
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="contentHeader-set-item-title contentHeader-set-item-bg">
                    <div className="contentHeader-set-item-bg-info">
                      <img
                        src={set8Svg}
                        alt=""
                        style={{
                          width: '18px',
                          height: '18px',
                          marginRight: '10px',
                        }}
                      />
                      <div>私人事务</div>
                    </div>
                  </div>
                </div>
                <div
                  className="contentHeader-set-item"
                  onClick={() => {
                    setMoveState('right');
                    setMoveType(1);
                  }}
                  style={bgVisible ? { backgroundColor: '#f0f0f0' } : {}}
                >
                  <div className="contentHeader-set-item-title contentHeader-set-item-bg">
                    <div className="contentHeader-set-item-bg-info">
                      <img
                        src={set7Svg}
                        alt=""
                        style={{
                          width: '18px',
                          height: '18px',
                          marginRight: '10px',
                        }}
                      />
                      <div>创建项目</div>
                    </div>
                    <div className="bg-item-right">
                      <img
                        src={rightArrowPng}
                        alt=""
                        style={{ width: '7px', height: '11px' }}
                      />
                    </div>
                  </div>
                </div>
                {headerIndex === 0 ? (
                  <div className="contentHeader-set-item">
                    <div className="contentHeader-set-item-title">
                      <img
                        src={set1Png}
                        alt=""
                        style={{
                          width: '15px',
                          height: '17px',
                          marginRight: '10px',
                        }}
                      />
                      <div>提醒</div>
                    </div>
                    <div>
                      <Switch
                        checked={theme.messageVisible ? true : false}
                        onChange={() => {
                          changeBoard('messageVisible');
                        }}
                        name="checkedA"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                      />
                    </div>
                  </div>
                ) : null}
                {headerIndex === 0 ? (
                  <div className="contentHeader-set-item">
                    <div className="contentHeader-set-item-title">
                      <img
                        src={set2Png}
                        alt=""
                        style={{
                          width: '15px',
                          height: '14px',
                          marginRight: '10px',
                        }}
                      />
                      <div>我的任务</div>
                    </div>
                    <div>
                      <Switch
                        checked={theme.mainVisible ? true : false}
                        onChange={() => {
                          changeBoard('mainVisible');
                        }}
                        name="checkedB"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                      />
                    </div>
                  </div>
                ) : null}
                {headerIndex === 0 ? (
                  <div className="contentHeader-set-item">
                    <div className="contentHeader-set-item-title">
                      <img
                        src={set3Png}
                        alt=""
                        style={{
                          width: '20px',
                          height: '15px',
                          marginRight: '5px',
                        }}
                      />
                      <div>协作看板</div>
                    </div>
                    <div>
                      <Switch
                        checked={theme.memberVisible ? true : false}
                        onChange={() => {
                          changeBoard('memberVisible');
                        }}
                        name="checkedC"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                      />
                    </div>
                  </div>
                ) : null}
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
                      onChange={() => {
                        changeBoard('calendarVisible');
                      }}
                      name="checkedD"
                      inputProps={{ 'aria-label': 'primary checkbox' }}
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
                      onChange={() => {
                        changeBoard('hourVisible');
                      }}
                      name="checkedD"
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                  </div>
                </div>
                <div
                  className="contentHeader-set-item"
                  onClick={() => {
                    if (mainEnterpriseGroup.mainEnterpriseGroupKey) {
                      dispatch(
                        setGroupKey(mainEnterpriseGroup.mainEnterpriseGroupKey)
                      );
                      history.push('/home/company');
                    }
                  }}
                >
                  <div className="contentHeader-set-item-title">
                    <img
                      src={companySvg}
                      alt=""
                      style={{
                        width: '20px',
                        height: '15px',
                        marginRight: '5px',
                      }}
                    />
                    <div>机构</div>
                  </div>
                  <div>
                    {mainEnterpriseGroup.mainEnterpriseGroupKey
                      ? mainEnterpriseGroup.mainEnterpriseGroupName
                      : ''}
                    <img
                      src={rightArrowPng}
                      alt=""
                      style={{
                        width: '7px',
                        height: '11px',
                        marginLeft: '10px',
                        cursor: 'pointer',
                      }}
                      onClick={(e: any) => {
                        e.stopPropagation();
                        setMoveState('right');
                        setMoveType(3);
                      }}
                    />
                  </div>
                </div>
                <div
                  className="contentHeader-set-item"
                  onClick={() => {
                    // setMoveState('right');
                    // setMoveType(2);
                    history.push('/home/download');
                  }}
                >
                  <div className="contentHeader-set-item-title">
                    <img
                      src={phoneSvg}
                      alt=""
                      style={{
                        width: '15px',
                        height: '22px',
                        marginRight: '12px',
                      }}
                    />
                    <div>客户端下载</div>
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
                <Dialog
                  visible={userVisible}
                  footer={false}
                  onClose={() => {
                    setUserVisible(false);
                  }}
                  title={'用户设置'}
                  dialogStyle={{
                    position: 'fixed',
                    top: '65px',
                    right: '270px',
                    width: '400px',
                    height: 'calc(100% - 70px)',
                    overflow: 'visible',
                  }}
                  showMask={false}
                  noAnimate={true}
                >
                  <UserCenter
                    onClose={() => {
                      setUserVisible(false);
                    }}
                  />
                </Dialog>
              </div>
              <div
                className="bg"
                style={{ height: moveType === 1 ? '295px' : '100%' }}
              >
                <div className="groupCreate-header">
                  <img
                    src={leftArrowPng}
                    alt=""
                    style={{
                      width: '10px',
                      height: '13px',
                      marginRight: '10px',
                    }}
                    onClick={() => {
                      setMoveState('left');
                    }}
                  />
                  {moveType === 0
                    ? '壁纸设置'
                    : moveType === 1
                    ? '创建项目'
                    : moveType === 2
                    ? '客户端下载'
                    : moveType === 3
                    ? '机构列表'
                    : ''}
                  {moveType === 3 ? (
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 400,
                        color: 'rgba(94, 138, 251, 1)',
                        cursor: 'pointer',
                        marginLeft: '115px',
                      }}
                      onClick={() => {
                        window.open(
                          'https://baoku.qingtime.cn/OHPRQG_1585745644894/article?key=1409189932'
                        );
                      }}
                    >
                      帮助/说明
                    </span>
                  ) : null}
                </div>
                {moveType === 0 ? (
                  <HeaderBg
                    setMoveState={setMoveState}
                    setChooseWallKey={setChooseWallKey}
                  />
                ) : moveType === 1 ? (
                  <GroupCreate />
                ) : moveType === 2 ? (
                  <React.Fragment>
                    <div
                      className="contentHeader-set-item"
                      onClick={() => {
                        window.open('https://cheerchat.qingtime.cn');
                      }}
                    >
                      <div className="contentHeader-set-item-title">
                        <img
                          src={phone1Svg}
                          alt=""
                          style={{
                            width: '23px',
                            height: '22px',
                            marginRight: '5px',
                          }}
                        />
                        <div>
                          <div>客户端</div>
                          <div
                            style={{
                              fontSize: '10px',
                              color: '#666666',
                            }}
                          >
                            远程办公即时通讯客户端
                          </div>
                        </div>
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
                    </div>
                    <div
                      className="contentHeader-set-item"
                      onClick={() => {
                        window.open('https://workingdownload.qingtime.cn/');
                      }}
                    >
                      <div className="contentHeader-set-item-title">
                        <img
                          src={phone2Svg}
                          alt=""
                          style={{
                            width: '20px',
                            height: '27px',
                            marginRight: '7px',
                          }}
                        />
                        <div>
                          <div>移动端</div>
                          <div
                            style={{
                              fontSize: '10px',
                              color: '#666666',
                            }}
                          >
                            苹果、安卓下载
                          </div>
                        </div>
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
                    </div>
                    <div
                      className="contentHeader-set-item"
                      onClick={() => {
                        window.open('http://extension.workfly.cn/');
                      }}
                    >
                      <div className="contentHeader-set-item-title">
                        <img
                          src={chromeSvg}
                          alt=""
                          style={{
                            width: '20px',
                            height: '27px',
                            marginRight: '7px',
                          }}
                        />
                        <div>
                          <div>chrome插件</div>
                          <div
                            style={{
                              fontSize: '10px',
                              color: '#666666',
                            }}
                          >
                            浏览器插件
                          </div>
                        </div>
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
                    </div>
                  </React.Fragment>
                ) : moveType === 3 ? (
                  <React.Fragment>
                    {companyGroupList.map((item: any, index: number) => {
                      return (
                        <div
                          key={'company' + index}
                          className="contentHeader-set-item"
                          onClick={() => {
                            dispatch(setGroupKey(item._key));
                            history.push('/home/company');
                            // window.open('https://cheerchat.qingtime.cn');
                          }}
                        >
                          <div
                            className="contentHeader-set-item-title"
                            style={{ borderRadius: '5px' }}
                          >
                            <img
                              src={
                                item.groupLogo
                                  ? item.groupLogo +
                                    '?imageMogr2/auto-orient/thumbnail/80x'
                                  : defaultGroupPng
                              }
                              alt=""
                              style={{
                                width: '23px',
                                height: '22px',
                                marginRight: '5px',
                              }}
                            />
                            <div style={{ width: '150px' }} className="toLong">
                              {item.groupName}
                            </div>
                          </div>
                          <div>
                            {/* <Tooltip title="设置主企业群">
                              <Checkbox
                                checked={
                                  targetInfo.mainEnterpriseGroupKey ===
                                  item._key
                                }
                                onChange={(e: any) => {
                                  changeMainEnterpriseKey(item._key);
                                }}
                                onClick={(e: any) => {
                                  e.stopPropagation();
                                }}
                                color="primary"
                              />
                            </Tooltip> */}
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
                      );
                    })}
                  </React.Fragment>
                ) : null}
              </div>
            </div>
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
          </div>
        </ClickAwayListener>
      ) : null}
    </React.Fragment>
  );
};
HeaderContent.defaultProps = {};
export default HeaderContent;
