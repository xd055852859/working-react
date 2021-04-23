import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './home.css';
import _ from 'lodash';
import api from '../../services/api';
import { useDispatch } from 'react-redux';
import { Tooltip, Dropdown, Button } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import {
  setCommonHeaderIndex,
  setMessage,
  setMoveState,
} from '../../redux/actions/commonActions';
import { useTypedSelector } from '../../redux/reducer/RootState';
import {
  changeMainenterpriseGroup,
  getTargetUserInfo,
  setClickType,
} from '../../redux/actions/authActions';
import { getCompanyItem } from '../../redux/actions/memberActions';
import { setGroupKey } from '../../redux/actions/groupActions';

import Tabs from '../tabs/tabs';
import LiquidChart from '../../components/common/chart/liquidChart';
import IconFont from '../../components/common/iconFont';

import defaultGroupPng from '../../assets/img/defaultGroup.png';
import logoSvg from '../../assets/svg/logo.svg';
import boardPng from '../../assets/img/board.png';
import tablePng from '../../assets/img/table.png';
import calendarPng from '../../assets/img/calendarHome.png';
import companyIcon from '../../assets/svg/companyIcon.svg';
import fixIconSvg from '../../assets/svg/fixIcon.svg';
import unfixIconSvg from '../../assets/svg/unfixIcon.svg';
import otherGroupSvg from '../../assets/svg/otherGroup.svg';
import allGroupSvg from '../../assets/svg/allGroup.svg';

export interface HomeProps {}

const Home: React.FC<HomeProps> = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const user = useTypedSelector((state) => state.auth.user);
  const moveState = useTypedSelector((state) => state.common.moveState);
  const theme = useTypedSelector((state) => state.auth.theme);
  const mainEnterpriseGroup = useTypedSelector(
    (state) => state.auth.mainEnterpriseGroup
  );
  const allTask = useTypedSelector((state) => state.auth.allTask);

  const groupArray = useTypedSelector((state) => state.group.groupArray);
  const [companyGroupList, setCompanyGroupList] = useState<any>([]);
  const [companyVisible, setCompanyVisible] = useState(false);

  useEffect(() => {
    if (user && user._key) {
      if (
        mainEnterpriseGroup &&
        mainEnterpriseGroup.mainEnterpriseGroupKey &&
        localStorage.getItem('mainEnterpriseGroupKey') !== 'out'
      ) {
        dispatch(getCompanyItem(mainEnterpriseGroup.mainEnterpriseGroupKey));
      }
      getCompanyGroupList();
    }
  }, [user, mainEnterpriseGroup]);

  // useEffect(() => {
  //   if (groupArray && companyGroupList.length === 0) {
  //     let newCompanyGroupList: any = [];
  //     groupArray.forEach((item: any) => {
  //       if (item.enterprise === 2) {
  //       }
  //     });

  //     setCompanyGroupList(newCompanyGroupList);
  //   }
  // }, [groupArray, companyGroupList]);
  const getCompanyGroupList = async () => {
    let newCompanyGroupList: any = [];
    let res: any = await api.group.getUserEnterpriseGroupList();
    if (res.msg == 'OK') {
      res.result.forEach((item: any, index: number) => {
        if (mainEnterpriseGroup.mainEnterpriseGroupKey === item._key) {
          newCompanyGroupList.unshift(item);
        } else {
          newCompanyGroupList.push(item);
        }
      });
      newCompanyGroupList.push({
        _key: '',
        groupLogo: allGroupSvg,
        groupName: '组织',
        isRight: 0,
      });
      newCompanyGroupList.push({
        _key: 'out',
        groupLogo: otherGroupSvg,
        groupName: '自由协作项目',
        isRight: 0,
      });
      console.log(newCompanyGroupList);
      setCompanyGroupList(newCompanyGroupList);
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };
  const changeMainEnterpriseKey = async (groupKey: string) => {
    let newCompanyGroupList: any = _.cloneDeep(companyGroupList);
    let res: any = await api.group.setMainEnterpriseGroup(groupKey);
    if (res.msg == 'OK') {
      // setCompanyGroupList(res.result);
      let groupIndex = _.findIndex(newCompanyGroupList, { _key: groupKey });
      let groupItem = _.cloneDeep(newCompanyGroupList[groupIndex]);
      newCompanyGroupList.splice(groupIndex, 1);
      newCompanyGroupList.unshift(groupItem);
      setCompanyGroupList(newCompanyGroupList);
      console.log(groupItem);
      if (groupItem._key !== 'out') {
        dispatch(
          changeMainenterpriseGroup(
            groupItem._key,
            groupItem.groupLogo,
            groupItem.groupName,
            groupItem.isRight
          )
        );
      } else {
        dispatch(changeMainenterpriseGroup('', '', groupItem.groupName, 0));
      }
      localStorage.setItem('mainEnterpriseGroupKey', groupItem._key);
      if (groupItem._key && groupItem._key !== 'out') {
        dispatch(getCompanyItem(groupItem._key));
      }
      setCompanyVisible(false);
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };
  const toTargetUser = async (e) => {
    e.stopPropagation();
    dispatch(getTargetUserInfo(user._key));
    dispatch(setCommonHeaderIndex(2));
    dispatch(setClickType('self'));
  };
  return (
    <div
      className="home"
      style={
        moveState === 'in'
          ? {
              // animation: 'moveIn 500ms',
              // animationFillMode: 'forwards',
              left: '-320px',
            }
          : moveState === 'out'
          ? {
              // animation: 'moveOut 500ms',
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
      {!theme.randomVisible ? (
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
      ) : null}
      <div className="home-b"></div>
      <div className="home-header">
        <div className="home-header-logo">
          <img src={logoSvg} alt="" />
          <div
            className="home-openIcon"
            onClick={() => {
              dispatch(setMoveState(moveState === 'in' ? 'out' : 'in'));
            }}
            style={{ right: moveState === 'in' ? '-35px' : '-15px' }}
          >
            {moveState === 'in' ? (
              <MenuUnfoldOutlined style={{ fontSize: '20px' }} />
            ) : (
              <MenuFoldOutlined style={{ fontSize: '20px' }} />
            )}
          </div>
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
          <div style={{ flexShrink: 0, width: '200px' }}>首页</div>
          {allTask[0] > 0 ? (
            <div>
              <LiquidChart
                percent={parseFloat(
                  ((allTask[0] - allTask[1]) / allTask[0]).toFixed(1)
                )}
                zoom={0.1}
                liquidId={'liquid'}
                fillColor={'#1890ff'}
              />
            </div>
          ) : null}
        </div>
        <div
          style={
            headerIndex === 1 ? { background: 'rgba(255, 255, 255, 0.34)' } : {}
          }
          className="home-header-item"
          onClick={() => {
            dispatch(setCommonHeaderIndex(1));
            dispatch(setClickType('out'));
          }}
        >
          <img src={tablePng} alt="" className="home-header-item-logo" />
          <div style={{ flexShrink: 0, width: '200px' }}>我的工作</div>
          <Tooltip title={'私有项目'}>
            <Button
              size="large"
              shape="circle"
              style={{ border: '0px', color: '#fff' }}
              ghost
              icon={<IconFont type="icon-dunpaisuo" />}
              onClick={(e) => {
                toTargetUser(e);
              }}
            />
          </Tooltip>
          <Button />
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

        <Dropdown
          overlay={
            <div className="dropDown-box">
              {companyGroupList.length > 0
                ? companyGroupList.map((groupItem: any, groupIndex: number) => {
                    return (
                      <div
                        key={'home' + groupIndex}
                        onClick={() => {
                          changeMainEnterpriseKey(groupItem._key);
                        }}
                        className="home-item"
                      >
                        <div className="home-item-logo">
                          <img
                            src={
                              groupItem.groupLogo
                                ? groupItem.groupLogo
                                : defaultGroupPng
                            }
                            alt=""
                          />
                        </div>
                        <div className="home-item-name tolong">
                          {groupItem.groupName}
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>
          }
        >
          <div
            style={
              headerIndex === 6
                ? { background: 'rgba(255, 255, 255, 0.34)' }
                : {}
            }
            className="home-header-item home-space"
            onClick={() => dispatch(setCommonHeaderIndex(6))}
          >
            <div className="home-header-item-left">
              <img src={companyIcon} alt="" className="home-header-item-logo" />
              {mainEnterpriseGroup?.mainEnterpriseGroupName ? (
                <React.Fragment>
                  {mainEnterpriseGroup.mainEnterpriseGroupKey ? (
                    <div className="home-header-item-groupLogo">
                      <img
                        src={mainEnterpriseGroup.mainEnterpriseGroupLogo}
                        alt=""
                      />
                    </div>
                  ) : null}
                  <div className="home-header-item-groupName toLong">
                    {mainEnterpriseGroup.mainEnterpriseGroupName}
                  </div>
                </React.Fragment>
              ) : null}
              {companyGroupList[
                _.findIndex(companyGroupList, {
                  _key: mainEnterpriseGroup.mainEnterpriseGroupKey,
                })
              ]?.isRight ? (
                <Button
                  size="large"
                  shape="circle"
                  style={{ border: '0px', color: '#fff' }}
                  ghost
                  icon={<SettingOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(
                      setGroupKey(mainEnterpriseGroup.mainEnterpriseGroupKey)
                    );
                    history.push('/home/company');
                    localStorage.setItem(
                      'companyKey',
                      mainEnterpriseGroup.mainEnterpriseGroupKey
                    );
                    // window.open('https://cheerchat.qingtime.cn');
                  }}
                />
              ) : null}
            </div>
            {/* <DownOutlined style={{ color: '#17B881' }} /> */}
          </div>
        </Dropdown>

        {/* <DropMenu
            visible={companyVisible}
            dropStyle={{
              width: '100%',
              maxHeight: '500px',
              top: '40px',
              left: '0px',
              color: '#333',
              overflow: 'auto',
            }}
            onClose={() => {
              setCompanyVisible(false);
            }}
          >
          
          </DropMenu> */}
      </div>
      <Tabs />
    </div>
  );
};
export default Home;
