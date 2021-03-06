import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import './company.css';
import Loadable from 'react-loadable';
import { useTypedSelector } from '../../redux/reducer/RootState';
import {
  setMessage,
  setCommonHeaderIndex,
} from '../../redux/actions/commonActions';
import { useDispatch } from 'react-redux';
import { Route, Switch, Link } from 'react-router-dom';
import { Collapse, List, ListItem, Button } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

import companyIcon1 from '../../assets/svg/companyIcon1.svg';
import companyIcon2 from '../../assets/svg/companyIcon2.svg';
import companyIcon3 from '../../assets/svg/companyIcon3.svg';
import companyIcon4 from '../../assets/svg/companyIcon4.svg';
import companyIcon5 from '../../assets/svg/companyIcon5.svg';
import companyRole1 from '../../assets/svg/companyRole1.svg';
import companyRole2 from '../../assets/svg/companyRole2.svg';

import defaultGroupPng from '../../assets/img/defaultGroup.png';
const CompanyPerson = Loadable({
  loader: () => import('./companyPerson'),
  loading: () => null,
});
const CompanyDepartment = Loadable({
  loader: () => import('./companyDepartment'),
  loading: () => null,
});
const CompanyGroup = Loadable({
  loader: () => import('./companyGroup'),
  loading: () => null,
});
const CompanyAccount = Loadable({
  loader: () => import('./companyAccount'),
  loading: () => null,
});
interface CompanyProps {}

const Company: React.FC<CompanyProps> = (props) => {
  const {} = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const [linkIndex, setLinkIndex] = useState(0);
  const [firstOpen, setFirstOpen] = useState(false);
  const [secondOpen, setSecondOpen] = useState(false);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  useEffect(() => {
    history.push('/home/company/companyPerson');
  }, []);
  const handleClick = (index: number, url: string) => {
    setLinkIndex(index);
    history.push(url);
  };
  return (
    <div className="company">
      <div className="company-menu">
        <div className="company-menu-logo" style={{ borderRadius: '10px' }}>
          <img
            src={
              groupInfo && groupInfo.groupLogo
                ? groupInfo.groupLogo + '?imageMogr2/auto-orient/thumbnail/300x'
                : defaultGroupPng
            }
            alt=""
          />
        </div>
        <div className="company-menu-name toLong">
          {groupInfo && groupInfo.groupName}
        </div>
        {/* <div> 企业中心</Link></div> */}
        <div
          className="company-menu-link"
          onClick={() => {
            setFirstOpen(false);
            setSecondOpen(false);
            handleClick(0, '/home/company/companyPerson');
          }}
          // style={
          //   linkIndex === 0
          //     ? {
          //         background: '#37373C',
          //       }
          //     : {}
          // }
        >
          <img
            src={companyIcon1}
            alt=""
            style={{ width: '15px', height: '17px', marginRight: '10px' }}
          />
          人员管理
        </div>
        <ListItem
          button
          onClick={() => {
            setFirstOpen(!firstOpen);
            setSecondOpen(false);
            handleClick(1, '/home/company/companyDepartment/1');
          }}
          className="company-menu-link"
        >
          <img
            src={companyIcon2}
            alt=""
            style={{ width: '20px', height: '14px', marginRight: '5px' }}
          />
          组织管理
          <div className="company-menu-link-icon">
            {firstOpen ? <ExpandLess /> : <ExpandMore />}
          </div>
        </ListItem>
        <Collapse in={firstOpen} timeout="auto" unmountOnExit>
          <List
            component="div"
            disablePadding
          >
            {/* <ListItem
              button
              className="company-submenu"
              onClick={() => {
                handleClick(1, '/home/company/companyDepartment/1');
              }}
              style={linkIndex === 1 ? { color: '#17B881' } : {}}
            >
              组织结构
            </ListItem> */}
            <ListItem
              button
              className="company-submenu"
              onClick={() => {
                handleClick(2, '/home/company/companyDepartment/2');
              }}
              style={linkIndex === 2 ? { color: '#17B881' } : {}}
            >
              组织成员
            </ListItem>
            <ListItem
              button
              className="company-submenu"
              onClick={() => {
                handleClick(3, '/home/company/companyDepartment/3');
              }}
              style={linkIndex === 3 ? { color: '#17B881' } : {}}
            >
              组织项目
            </ListItem>
            {/* <ListItem
              button
              className="company-submenu"
              onClick={() => {
                handleClick(2, '/home/company/companyMember');
              }}
              style={linkIndex === 2 ? { color: '#17B881' } : {}}
            >
              组织成员项目矩阵
            </ListItem> */}
          </List>
        </Collapse>
        <ListItem
          button
          onClick={() => {
            setFirstOpen(false);
            setSecondOpen(!secondOpen);
            handleClick(4, '/home/company/companyGroup/2');
            // handleClick(1, '');
          }}
          className="company-menu-link"
        >
          <img
            src={companyIcon3}
            alt=""
            style={{ width: '16px', height: '16px', marginRight: '9px' }}
          />
          授权管理
          <div className="company-menu-link-icon">
            {secondOpen ? <ExpandLess /> : <ExpandMore />}
          </div>
        </ListItem>
        <Collapse in={secondOpen} timeout="auto" unmountOnExit>
          <ListItem
            button
            className="company-submenu"
            onClick={() => {
              handleClick(4, '/home/company/companyGroup/2');
            }}
            style={linkIndex === 4 ? { color: '#17B881' } : {}}
          >
            <img
              src={companyRole1}
              alt=""
              style={{ width: '16px', height: '16px', marginRight: '9px' }}
            />
            人员授权
          </ListItem>
          <ListItem
            button
            className="company-submenu"
            onClick={() => {
              handleClick(5, '/home/company/companyGroup/3');
            }}
            style={linkIndex === 5 ? { color: '#17B881' } : {}}
          >
            <img
              src={companyRole2}
              alt=""
              style={{ width: '16px', height: '16px', marginRight: '9px' }}
            />
            项目授权
          </ListItem>
        </Collapse>
        <div
          className="company-menu-link"
          onClick={() => {
            setFirstOpen(false);
            setSecondOpen(false);
            handleClick(6, '/home/company/companyAccount');
          }}
        >
          <img
            src={companyIcon4}
            alt=""
            style={{ width: '15px', height: '17px', marginRight: '10px' }}
          />
          企业账户
        </div>
        <div
          className="company-menu-link"
          onClick={() => {
            dispatch(setCommonHeaderIndex(3));
            history.push('/home/basic/groupTable');
          }}
        >
          <img
            src={companyIcon5}
            alt=""
            style={{ width: '15px', height: '17px', marginRight: '10px' }}
          />
          退出中台
        </div>
      </div>
      <div className="company-container">
        <Switch>
          <Route
            exact
            path="/home/company/companyPerson"
            component={CompanyPerson}
          />
          <Route
            exact
            path="/home/company/companyDepartment/:id"
            component={CompanyDepartment}
          />
          <Route
            exact
            path="/home/company/companyGroup/:id"
            component={CompanyGroup}
          />
          <Route
            exact
            path="/home/company/companyAccount"
            component={CompanyAccount}
          />
        </Switch>
      </div>
    </div>
  );
};
Company.defaultProps = {};
export default Company;
