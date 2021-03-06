import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './home.css';
import logoSvg from '../../assets/svg/logo.svg';
import boardPng from '../../assets/img/board.png';
import tablePng from '../../assets/img/table.png';
import chatPng from '../../assets/img/chat.png';
import calendarPng from '../../assets/img/calendarHome.png';
import companyIcon from '../../assets/svg/companyIcon.svg';
import fixIconSvg from '../../assets/svg/fixIcon.svg';
import unfixIconSvg from '../../assets/svg/unfixIcon.svg';
import { ExpandMoreOutlined } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import Tabs from '../tabs/tabs';
import { useDispatch } from 'react-redux';
import {
  setCommonHeaderIndex,
  setMessage,
} from '../../redux/actions/commonActions';
import { useTypedSelector } from '../../redux/reducer/RootState';
import {
  setTheme,
  changeMainenterpriseGroup,
} from '../../redux/actions/authActions';
import { getCompanyItem } from '../../redux/actions/memberActions';
import _ from 'lodash';
import api from '../../services/api';
import { Tooltip } from '@material-ui/core';
import DropMenu from '../../components/common/dropMenu';
import Loading from '../../components/common/loading';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
export interface HomeProps {}

const Home: React.FC<HomeProps> = (props) => {
  // const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const user = useTypedSelector((state) => state.auth.user);
  const moveState = useTypedSelector((state) => state.common.moveState);
  const theme = useTypedSelector((state) => state.auth.theme);
  const mainEnterpriseGroup = useTypedSelector(
    (state) => state.auth.mainEnterpriseGroup
  );
  const groupArray = useTypedSelector((state) => state.group.groupArray);
  const [companyGroupList, setCompanyGroupList] = useState<any>([]);
  const [companyVisible, setCompanyVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      user &&
      user._key &&
      mainEnterpriseGroup &&
      mainEnterpriseGroup.mainEnterpriseGroupKey
    ) {
      dispatch(getCompanyItem(mainEnterpriseGroup.mainEnterpriseGroupKey));
    }
  }, [user, mainEnterpriseGroup]);

  const changeBoard = (type: string, bool: boolean) => {
    let newTheme = _.cloneDeep(theme);
    newTheme[type] = bool;
    dispatch(setTheme(newTheme));
  };
  useEffect(() => {
    if (groupArray) {
      let newCompanyGroupList: any = [];
      groupArray.forEach((item: any) => {
        if (item.enterprise === 2) {
          if (mainEnterpriseGroup.mainEnterpriseGroupKey === item._key) {
            newCompanyGroupList.unshift(item);
          } else {
            newCompanyGroupList.push(item);
          }
        }
      });
      newCompanyGroupList.push({
        _key: '',
        groupLogo: '',
        groupName: '所有项目',
      });
      setCompanyGroupList(newCompanyGroupList);
    }
  }, [groupArray]);

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
      dispatch(
        changeMainenterpriseGroup(
          groupItem._key,
          groupItem.groupLogo,
          groupItem.groupName
        )
      );
      dispatch(getCompanyItem(groupItem._key));
      setCompanyVisible(false);
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
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
        <div
          style={
            headerIndex === 6 ? { background: 'rgba(255, 255, 255, 0.34)' } : {}
          }
          className="home-header-item home-space"
          onClick={() => dispatch(setCommonHeaderIndex(6))}
        >
          <div className="home-header-item-left">
            <img src={companyIcon} alt="" className="home-header-item-logo" />

            {mainEnterpriseGroup?.mainEnterpriseGroupKey ? (
              <React.Fragment>
                <div className="home-header-item-groupLogo">
                  <img
                    src={mainEnterpriseGroup.mainEnterpriseGroupLogo}
                    alt=""
                  />
                </div>
                <div className="home-header-item-groupName toLong">
                  {mainEnterpriseGroup.mainEnterpriseGroupName}
                </div>
              </React.Fragment>
            ) : (
              '所有项目'
            )}
          </div>
          <IconButton
            color="primary"
            component="span"
            onClick={(e: any) => {
              e.stopPropagation();
              setCompanyVisible(true);
            }}
          >
            <ExpandMoreOutlined />
          </IconButton>

          <DropMenu
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
            <React.Fragment>
              {loading ? <Loading /> : null}
              {companyGroupList.length > 0
                ? companyGroupList.map((groupItem: any, groupIndex: number) => {
                    return (
                      <div
                        key={'clockInGroup' + groupIndex}
                        onClick={() => {
                          changeMainEnterpriseKey(groupItem._key);
                        }}
                        className="clockInGroup-item"
                      >
                        <div className="clockInGroup-item-logo">
                          <img
                            src={
                              groupItem.groupLogo
                                ? groupItem.groupLogo
                                : defaultGroupPng
                            }
                            alt=""
                          />
                        </div>
                        <Tooltip title={groupItem.groupName}>
                          <div className="clockInGroup-item-name">
                            {groupItem.groupName}
                          </div>
                        </Tooltip>
                      </div>
                    );
                  })
                : null}
            </React.Fragment>
          </DropMenu>
        </div>
      </div>
      <Tabs />
    </div>
  );
};
export default Home;
