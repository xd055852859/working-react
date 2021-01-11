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
import { Collapse, List, ListItem } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

import companyIcon1 from '../../assets/svg/companyIcon1.svg';
import companyIcon2 from '../../assets/svg/companyIcon2.svg';
import companyIcon3 from '../../assets/svg/companyIcon3.svg';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
const CompanyPerson = Loadable({
  loader: () => import('./companyPerson'),
  loading: () => null,
});
const CompanyDepartment = Loadable({
  loader: () => import('./companyDepartment'),
  loading: () => null,
});
const CompanyMember = Loadable({
  loader: () => import('./companyMember'),
  loading: () => null,
});
const CompanyGroup = Loadable({
  loader: () => import('./companyGroup'),
  loading: () => null,
});
const CompanySonGroup = Loadable({
  loader: () => import('./companySonGroup'),
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
  const [firstOpen, setFirstOpen] = useState(true);
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
        <div
          className="company-menu-logo"
          onClick={async () => {
            dispatch(setCommonHeaderIndex(3));
            history.push('/home/basic/groupTable');
          }}
        >
          <img
            src={
              groupInfo && groupInfo.groupLogo
                ? groupInfo.groupLogo + '?imageMogr2/auto-orient/thumbnail/300x'
                : defaultGroupPng
            }
            alt=""
          />
        </div>
        <div  className="company-menu-name">{groupInfo && groupInfo.groupName}</div>
        {/* <div> 企业中心</Link></div> */}
        <ListItem
          button
          onClick={() => {
            setFirstOpen(!firstOpen);
            setSecondOpen(false);
            handleClick(0, '/home/company/companyPerson');
          }}
          className="company-menu-link"
          style={
            firstOpen
              ? {
                  background: '#37373C',
                }
              : {}
          }
        >
          <img
            src={companyIcon1}
            alt=""
            style={{ width: '20px', height: '14px', marginRight: '5px' }}
          />
          人员组织管理
          <div className="company-menu-link-icon">
            {firstOpen ? <ExpandLess /> : <ExpandMore />}
          </div>
        </ListItem>
        <Collapse in={firstOpen} timeout="auto" unmountOnExit>
          <List
            component="div"
            disablePadding
            style={
              firstOpen
                ? {
                    background: '#37373C',
                  }
                : {}
            }
          >
            <ListItem
              button
              className="company-submenu"
              onClick={() => {
                handleClick(0, '/home/company/companyPerson');
              }}
              style={linkIndex === 0 ? { color: '#17B881' } : {}}
            >
              通讯录
            </ListItem>
            <ListItem
              button
              className="company-submenu"
              onClick={() => {
                handleClick(1, '/home/company/companyDepartment');
              }}
              style={linkIndex === 1 ? { color: '#17B881' } : {}}
            >
              组织结构
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
            handleClick(3, '/home/company/companyGroup');
            // handleClick(1, '');
          }}
          className="company-menu-link"
        >
          <img
            src={companyIcon2}
            alt=""
            style={{ width: '16px', height: '16px', marginRight: '9px' }}
          />
          项目管理
          <div className="company-menu-link-icon">
            {secondOpen ? <ExpandLess /> : <ExpandMore />}
          </div>
        </ListItem>
        <Collapse in={secondOpen} timeout="auto" unmountOnExit>
          <ListItem
            button
            className="company-submenu"
            onClick={() => {
              handleClick(3, '/home/company/companyGroup');
            }}
            style={linkIndex === 3 ? { color: '#17B881' } : {}}
          >
            项目群统一管理
          </ListItem>
          {/* <ListItem
            button
            className="company-submenu"
            onClick={() => {
              handleClick(4, '/home/company/companySonGroup');
            }}
            style={linkIndex === 4 ? { color: '#17B881' } : {}}
          >
            项目群子公司统一管理
          </ListItem> */}
        </Collapse>
        <div
          className="company-menu-link"
          onClick={() => {
            setFirstOpen(false);
            setSecondOpen(false);
            handleClick(5, '/home/company/companyAccount');
          }}
          style={
            linkIndex === 5
              ? {
                  background: '#37373C',
                }
              : {}
          }
        >
          <img
            src={companyIcon3}
            alt=""
            style={{ width: '15px', height: '17px', marginRight: '10px' }}
          />
          企业账户
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
            path="/home/company/companyDepartment"
            component={CompanyDepartment}
          />
          <Route
            exact
            path="/home/company/companyMember"
            component={CompanyMember}
          />
          <Route
            exact
            path="/home/company/companyGroup"
            component={CompanyGroup}
          />
          <Route
            exact
            path="/home/company/CompanySonGroup"
            component={CompanySonGroup}
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
