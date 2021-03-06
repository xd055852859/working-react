import React, { useState, useEffect, useRef } from 'react';
import './tabs.css';
import { useDispatch } from 'react-redux';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { Button, TextField, Tooltip } from '@material-ui/core';
import { useTypedSelector } from '../../redux/reducer/RootState';
import _ from 'lodash';
import api from '../../services/api';
import {
  setMessage,
  setCommonHeaderIndex,
  setMoveState,
} from '../../redux/actions/commonActions';
import {
  getTargetUserInfo,
  // userKeyToGroupKey
} from '../../redux/actions/authActions';
import {
  getGroup,
  getGroupInfo,
  setGroupKey,
} from '../../redux/actions/groupActions';
import { getMember } from '../../redux/actions/memberActions';
import Contact from '../contact/contact';
import Dialog from '../../components/common/dialog';
import GroupCreate from './groupCreate';
import DropMenu from '../../components/common/dropMenu';
import Loading from '../../components/common/loading';
import searchPng from '../../assets/img/search.png';
import searchbSvg from '../../assets/svg/searchb.svg';
import addPng from '../../assets/img/contact-add.png';
import downArrowbPng from '../../assets/img/downArrowb.png';
import defaultPersonPng from '../../assets/img/defaultPerson.png';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
import contactTree from '../../assets/svg/contactTree.svg';
import listSvg from '../../assets/svg/list.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      width: '450px',
      marginRight: '10px',

      '& .MuiInput-formControl': {
        marginTop: '0px',
      },
      '& .MuiOutlinedInput-input': {
        padding: '10px 14px',
      },
      '& .MuiInputLabel-formControl': {
        marginTop: '-10px',
      },
    },
    button: {
      backgroundColor: '#17B881',
      padding: '6 26px',
      color: '#fff',
    },
    addInput: {
      width: '100%',
      marginRight: '10px',

      '& .MuiInput-formControl': {
        marginTop: '0px',
      },
      '& .MuiOutlinedInput-input': {
        padding: '10px 14px',
      },
      '& .MuiInputLabel-formControl': {
        marginTop: '-10px',
      },
    },
  })
);
export interface HomeTabProps {}
const HomeTab: React.FC<HomeTabProps> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  // const classes = useStyles();
  const user = useTypedSelector((state) => state.auth.user);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const memberArray = useTypedSelector((state) => state.member.memberArray);
  const companyMemberArray = useTypedSelector(
    (state) => state.member.companyMemberArray
  );

  const groupArray = useTypedSelector((state) => state.group.groupArray);
  const mainEnterpriseGroup = useTypedSelector(
    (state) => state.auth.mainEnterpriseGroup
  );
  const theme = useTypedSelector((state) => state.auth.theme);
  const [contactIndex, setContactIndex] = React.useState(0);
  const [searchVisible, setSearchVisible] = React.useState(false);
  const [searchAllVisible, setSearchAllVisible] = React.useState(false);
  const [searchInputState, setSearchInputState] = React.useState('');
  // const [memberSortVisible, setMemberSortVisible] = React.useState(false);
  // const [groupSortVisible, setGroupSortVisible] = React.useState(false);
  const [addGroupVisible, setAddGroupVisible] = React.useState(false);
  const [searchList, setSearchList] = React.useState<any>([]);
  const [mainSearchList, setMainSearchList] = React.useState<any>([]);
  const [searchInput, setSearchInput] = React.useState('');
  const [question, setQuestion] = React.useState('');
  const [passwordInput, setPasswordInput] = React.useState('');
  const [joinType, setJoinType] = React.useState(1);
  const [searchIndex, setSearchIndex] = React.useState(0);
  const [searchItem, setSearchItem] = React.useState<any>(null);
  const [isHasPassword, setIsHasPassword] = React.useState(false);
  const [inviteVisible, setInviteVisible] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const tabsRef: React.RefObject<any> = useRef();
  const limit = 30;
  useEffect(() => {
    if (searchInput === '') {
      setSearchList([]);
      setSearchVisible(false);
    }
  }, [searchInput, contactIndex]);
  useEffect(() => {
    if (tabsRef.current) {
      let clientHeight = tabsRef.current.clientHeight;
      setClientHeight(clientHeight);
    }
  }, [tabsRef.current]);
  // useEffect(() => {
  //   if (searchInput) {
  //     let newMainSearchList = [];
  //     if (contactIndex === 1) {
  //       newMainSearchList = memberArray.filter(
  //         (memberItem: any, memberIndex: number) => {
  //           if (memberItem.nickName.indexOf(searchInput) != -1) {
  //             return memberItem;
  //           }
  //         }
  //       );
  //     } else if (contactIndex === 0) {
  //       newMainSearchList = groupArray.filter(
  //         (groupItem: any, groupIndex: number) => {
  //           if (groupItem.groupName.indexOf(searchInput) != -1) {
  //             return groupItem;
  //           }
  //         }
  //       );
  //     }
  //     setMainSearchList(newMainSearchList);
  //   }
  // }, [memberArray, groupArray]);
  const changeInput = (e: any) => {
    setSearchInput(e.target.value);
    searchMsg(e.target.value);
  };
  const changePasswordInput = (e: any) => {
    setPasswordInput(e.target.value);
  };
  const searchMsg = (input?: string) => {
    let newMainSearchList = [];
    let msgInput = input ? input : searchInput;
    if (msgInput !== '') {
      if (contactIndex === 1) {
        newMainSearchList = memberArray.filter(
          (memberItem: any, memberIndex: number) => {
            if (
              memberItem.nickName &&
              memberItem.nickName
                .toUpperCase()
                .indexOf(msgInput.toUpperCase()) != -1
            ) {
              return memberItem;
            }
          }
        );
      } else if (contactIndex === 0) {
        newMainSearchList = groupArray.filter(
          (groupItem: any, groupIndex: number) => {
            if (
              groupItem.groupName &&
              groupItem.groupName
                .toUpperCase()
                .indexOf(msgInput.toUpperCase()) != -1
            ) {
              return groupItem;
            }
          }
        );
      }
      setMainSearchList(newMainSearchList);
      setSearchVisible(true);
      setSearchAllVisible(false);
      // if (searchAllVisible) {
      //   contactIndex ? getSearchPerson(1) : getSearchGroup(1);
      // }
    } else {
      dispatch(setMessage(true, '请输入搜索内容', 'error'));
      return;
    }
  };
  const getSearchPerson = async (page: number) => {
    let newSearchList: any = [];
    if (page === 1) {
      setSearchList([]);
    } else {
      newSearchList = _.cloneDeep(searchList);
    }
    setLoading(true);
    let res: any = await api.member.searchUserNew(searchInput, page, limit);
    if (res.msg === 'OK') {
      res.result.forEach((searchItem: any) => {
        searchItem.avatar = searchItem.avatar
          ? searchItem.avatar
          : defaultPersonPng;
        newSearchList.push(searchItem);
      });
      setSearchList(newSearchList);
      setTotal(res.totalNumber);
      setLoading(false);
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
      setLoading(false);
    }
  };
  const getSearchGroup = async (page: number) => {
    let newSearchList: any = [];
    if (page === 1) {
      setSearchList([]);
    } else {
      newSearchList = _.cloneDeep(searchList);
    }
    let res: any = await api.member.searchGroupNew(searchInput, page, limit);
    if (res.msg === 'OK') {
      res.result.map((searchItem: any) => {
        searchItem.avatar = searchItem.logo
          ? searchItem.groupLogo
          : defaultGroupPng;
        searchItem.nickName = searchItem.groupName;
        newSearchList.push(searchItem);
      });
      setSearchList(newSearchList);
      setTotal(res.totalNumber);
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };
  const addMember = async (searchItem: any, searchIndex: number) => {
    let newSearchList = _.cloneDeep(searchList);
    let memberRes: any = await api.group.addGroupMember(mainGroupKey, [
      {
        userKey: searchItem.userId,
        nickName: searchItem.nickName,
        avatar: searchItem.avatar,
        gender: 0,
        role: 5,
      },
    ]);
    if (memberRes.msg === 'OK') {
      dispatch(setMessage(true, '添加好友成功', 'success'));
      newSearchList.splice(searchIndex, 1);
      setSearchList(newSearchList);
      dispatch(getMember(mainGroupKey));
    } else {
      dispatch(setMessage(true, memberRes.msg, 'error'));
    }
  };
  const deleteMember = async (searchItem: any, searchIndex: number) => {
    let newMainSearchList = _.cloneDeep(mainSearchList);
    let memberRes: any = await api.group.deleteGroupMember(mainGroupKey, [
      searchItem.userId,
    ]);
    if (memberRes.msg === 'OK') {
      dispatch(setMessage(true, '删除好友成功', 'success'));
      newMainSearchList.splice(searchIndex, 1);
      setMainSearchList(newMainSearchList);
      dispatch(getMember(mainGroupKey));
    } else {
      dispatch(setMessage(true, memberRes.msg, 'error'));
    }
  };
  const outGroup = async (groupKey: string, searchIndex: number) => {
    let newMainSearchList = _.cloneDeep(mainSearchList);
    let memberRes: any = await api.group.outGroup(groupKey);
    if (memberRes.msg === 'OK') {
      dispatch(setMessage(true, '退出项目成功', 'success'));
      newMainSearchList.splice(searchIndex, 1);
      setMainSearchList(newMainSearchList);
      dispatch(getGroup(3));
    } else {
      dispatch(setMessage(true, memberRes.msg, 'error'));
    }
  };
  const joinGroup = async (
    groupKey: string,
    searchIndex: number,
    searchItem: any
  ) => {
    let newSearchList = _.cloneDeep(searchList);
    let groupRes: any = await api.group.getGroupInfo(groupKey);
    if (groupRes.msg === 'OK') {
      let newGroupInfo = groupRes.result;
      if (newGroupInfo.joinType) {
        setQuestion(newGroupInfo.question);
        setJoinType(newGroupInfo.joinType);
        setIsHasPassword(newGroupInfo.isHasPassword);
        setSearchIndex(searchIndex);
        setSearchItem(searchItem);
        setInviteVisible(true);
      } else {
        let groupMemberRes: any = await api.group.addGroupMember(groupKey, [
          {
            userKey: user._key,
            nickName: user.profile.nickName,
            avatar: user.profile.avatar,
            gender: user.profile.gender,
            role: newGroupInfo.defaultPower,
          },
        ]);
        if (groupMemberRes.msg === 'OK') {
          dispatch(setMessage(true, '加入项目成功', 'success'));
          newSearchList.splice(searchIndex, 1);
          setSearchList(newSearchList);
          dispatch(getGroup(3));
        } else {
          dispatch(setMessage(true, groupMemberRes.msg, 'error'));
        }
      }
    } else {
      dispatch(setMessage(true, groupRes.msg, 'error'));
    }
  };
  const applyJoinGroup = async (groupKey: string) => {
    let memberRes: any = await api.group.applyJoinGroup(groupKey);
    if (memberRes.msg === 'OK') {
      dispatch(setMessage(true, '申请加群成功', 'success'));
      setInviteVisible(false);
    } else {
      dispatch(setMessage(true, memberRes.msg, 'error'));
    }
  };
  const passwordJoinGroup = async (groupKey: string) => {
    let newSearchList = _.cloneDeep(searchList);
    let memberRes: any = await api.group.passwordJoinGroup(
      groupKey,
      passwordInput
    );
    if (memberRes.msg === 'OK') {
      dispatch(setMessage(true, '口令加群成功', 'success'));
      newSearchList.splice(searchIndex, 1);
      setSearchList(newSearchList);
      dispatch(getGroup(3));
      setInviteVisible(false);
    } else {
      dispatch(setMessage(true, memberRes.msg, 'error'));
    }
  };
  const scrollSearchLoading = (e: any) => {
    let newPage = page;
    //文档内容实际高度（包括超出视窗的溢出部分）
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let clientHeight = e.target.clientHeight;
    if (clientHeight + scrollTop >= scrollHeight && searchList.length < total) {
      newPage = newPage + 1;
      setPage(newPage);
      contactIndex ? getSearchPerson(newPage) : getSearchGroup(newPage);
    }
  };

  const contactSort = (sortType: number) => {
    // let newTheme = _.cloneDeep(theme);
    // if (contactIndex === 0) {
    //   dispatch(getGroup(3, null, sortType));
    //   newTheme.groupSortType = sortType;
    //   dispatch(setTheme(newTheme));
    // } else if (contactIndex === 1) {
    //   dispatch(getMember(mainGroupKey, sortType));
    //   newTheme.personSortType = sortType;
    //   dispatch(setTheme(newTheme));
    // }
  };
  const toTargetGroup = async (groupKey: string) => {
    dispatch(setGroupKey(groupKey));
    dispatch(getGroupInfo(groupKey));
    dispatch(setCommonHeaderIndex(3));
    if (!theme.moveState) {
      dispatch(setMoveState('in'));
    }
    await api.group.visitGroupOrFriend(2, groupKey);
    dispatch(getGroup(3));
  };
  const toTargetUser = async (targetUserKey: string) => {
    // dispatch(setTargetUserKey(targetUserKey));
    // dispatch(userKeyToGroupKey(targetUserKey));
    dispatch(getTargetUserInfo(targetUserKey));
    dispatch(setCommonHeaderIndex(2));
    if (!theme.moveState) {
      dispatch(setMoveState('in'));
    }
    await api.group.visitGroupOrFriend(1, targetUserKey);
    dispatch(getMember(mainGroupKey));
  };
  return (
    <div
      className="tabs"
      ref={tabsRef}
      style={{
        height:
          theme && theme.calendarVisible
            ? 'calc(100% - 260px)'
            : 'calc(100% - 210px)',
      }}
    >
      <ClickAwayListener
        onClickAway={() => {
          if (searchInputState === 'out') {
            setSearchInputState('in');
          }
          setSearchInput('');
          setSearchAllVisible(false);
        }}
      >
        <div className="tabs-tab-nav">
          <div
            onClick={() => {
              setContactIndex(0);
              setSearchList([]);
            }}
            style={
              contactIndex === 0
                ? { background: 'rgba(255, 255, 255, 0.34)' }
                : {}
            }
            className="tabs-tab-nav-item"
          >
            项目 
            {/* ({' '}
            {mainEnterpriseGroup.mainEnterpriseGroupKey
              ? groupArray &&
                _.filter(groupArray, {
                  enterpriseGroupKey:
                    mainEnterpriseGroup.mainEnterpriseGroupKey,
                }).length > 0
                ? _.filter(groupArray, {
                    enterpriseGroupKey:
                      mainEnterpriseGroup.mainEnterpriseGroupKey,
                  }).length + 1
                : 1
              : groupArray && groupArray.length > 0
              ? groupArray.length
              : 0}{' '}
            ) */}
          </div>
          <div
            onClick={() => {
              setContactIndex(1);
            }}
            style={
              contactIndex === 1
                ? { background: 'rgba(255, 255, 255, 0.34)' }
                : {}
            }
            className="tabs-tab-nav-item"
          >
            好友 
            {/* ({' '} */}
            {/* {memberArray && memberArray.length > 0 ? memberArray.length : 0} ) */}
          </div>
          {mainEnterpriseGroup?.mainEnterpriseGroupKey ? (
            <div
              onClick={() => {
                setContactIndex(2);
              }}
              style={
                contactIndex === 2
                  ? { background: 'rgba(255, 255, 255, 0.34)' }
                  : {}
              }
              className="tabs-tab-nav-item"
            >
              同事
               {/* ({' '}
              {companyMemberArray && companyMemberArray.length > 0
                ? companyMemberArray.length
                : 0}{' '}
              ) */}
            </div>
          ) : null}
          <img
            src={searchPng}
            alt=""
            className="search-icon"
            onClick={() => {
              // setSearchVisible(true);
              // setSearchList([]);
              setSearchInputState('out');
            }}
          />

          <div
            className="search-input-container"
            style={
              searchInputState === 'in'
                ? {
                    animation: 'searchInputIn 500ms',
                    // animationFillMode: 'forwards',
                    width: '0px',
                    right: '10px',
                    height: '18px',
                  }
                : searchInputState === 'out'
                ? {
                    animation: 'searchInputOut 500ms',
                    // animationFillMode: 'forwards',
                    width: '100%',
                    right: '0px',
                    height: '100%',
                  }
                : { width: '0px', opacity: 0, right: '10px', height: '18px' }
            }
          >
            <input
              type="text"
              className="search-input"
              placeholder={
                contactIndex === 0 ? '输入项目关键字…' : '输入用户名…'
              }
              onChange={changeInput}
              value={searchInput}
              onKeyDown={(e: any) => {
                if (e.keyCode === 13) {
                  if (searchInput !== '') {
                    searchMsg();
                    setSearchVisible(true);
                  }
                }
              }}
            />
            <div
              className="search-icon-container"
              onClick={() => {
                if (searchInput !== '') {
                  searchMsg();
                  setSearchVisible(true);
                }
              }}
            >
              <img
                src={searchbSvg}
                alt=""
                style={{
                  width: '18px',
                  height: '18px',
                }}
              />
            </div>
          </div>

          {/* <img
          src={sortPng}
          alt=""
          className="sort-icon"
          onClick={() => {
            contactIndex === 1
              ? setMemberSortVisible(true)
              : setGroupSortVisible(true);
          }}
        /> */}
          {contactIndex === 0 ? (
            <img
              src={addPng}
              alt=""
              className="add-icon"
              onClick={() => {
                setAddGroupVisible(true);
              }}
            />
          ) : contactIndex === 2 ? (
            <Tooltip title={'组织'}>
              <img
                src={contactTree}
                alt=""
                className="add-icon"
                onClick={() => {
                  setContactIndex(3);
                }}
              />
            </Tooltip>
          ) : contactIndex === 3 ? (
            <Tooltip title={'列表'}>
              <img
                src={listSvg}
                alt=""
                className="add-icon"
                onClick={() => {
                  setContactIndex(2);
                }}
              />
            </Tooltip>
          ) : null}
          {/* {contactIndex === 1 ? (
            <img
              src={addPersonPng}
              alt=""
              className="add-icon"
              onClick={() => {
                setSearchVisible(true);
                setSearchList([]);
              }}
            />
          ) : null} 
          <DropMenu
            visible={memberSortVisible || groupSortVisible}
            dropStyle={{
              width: '80px',
              height: '90px',
              top: '30px',
              left: '230px',
              color: '#333',
            }}
            onClose={() => {
              contactIndex === 1
                ? setMemberSortVisible(false)
                : setGroupSortVisible(false);
            }}
          >
            <div className="tabs-sort-container">
              <div
                className="tabs-sort-item"
                onClick={() => {
                  contactSort(1);
                }}
              >
                访问排序
              </div>
              <div
                className="tabs-sort-item"
                onClick={() => {
                  contactSort(2);
                }}
              >
                关注排序
              </div>
              <div
                className="tabs-sort-item"
                onClick={() => {
                  contactSort(3);
                }}
              >
                活力值排序
              </div>
            </div>
          </DropMenu>*/}
          <DropMenu
            visible={searchVisible}
            onClose={() => {
              setSearchVisible(false);
            }}
            dropStyle={{
              width: '100%',
              maxHeight: clientHeight - 38 + 'px',
              top: '36px',
              left: '0px',
              color: '#333',
              zIndex: '10',
              borderRadius: '8px',
              overflow: 'auto',
            }}
          >
            <div className="search-container">
              {mainSearchList.map(
                (mainSearchItem: any, mainSearchIndex: number) => {
                  let avatar =
                    contactIndex === 0
                      ? mainSearchItem.groupLogo
                        ? mainSearchItem.groupLogo +
                          '?imageMogr2/auto-orient/thumbnail/80x'
                        : defaultGroupPng
                      : mainSearchItem.avatar
                      ? mainSearchItem.avatar +
                        '?imageMogr2/auto-orient/thumbnail/80x'
                      : defaultPersonPng;
                  let name =
                    contactIndex === 0
                      ? mainSearchItem.groupName
                      : mainSearchItem.nickName;
                  let key =
                    contactIndex === 0
                      ? mainSearchItem._key
                      : mainSearchItem.userId;
                  return (
                    <div
                      className="personMember-item"
                      key={'mainSearch' + mainSearchIndex}
                      onClick={() => {
                        contactIndex ? toTargetUser(key) : toTargetGroup(key);
                      }}
                    >
                      <div className="personMember-item-title">
                        <div className="personMember-item-avatar">
                          <img src={avatar} alt="" />
                        </div>
                        <div className="personMember-item-name">{name}</div>
                      </div>
                      {
                        contactIndex ? (
                          <div
                            className="personMember-item-button"
                            onClick={
                              (e: any) => {
                                deleteMember(mainSearchItem, mainSearchIndex);
                                e.stopPropagation();
                              }
                              // addMember(item)
                            }
                          >
                            <div>删除好友</div>
                          </div>
                        ) : null
                        // (
                        //   <div
                        //     className="personMember-item-button"
                        //     onClick={
                        //       (e: any) => {
                        //         e.stopPropagation();
                        //         outGroup(key, searchIndex);
                        //       }
                        //       // addMember(item)
                        //     }
                        //   >
                        //     <div>退出项目</div>
                        //   </div>
                        // )
                      }
                    </div>
                  );
                }
              )}
              {mainSearchList.length > 0 ? (
                <hr
                  style={{
                    background: '#F0F0F0',
                    margin: '5px 0px',
                  }}
                />
              ) : null}
              {!searchAllVisible ? (
                <div
                  className="search-all-icon"
                  onClick={() => {
                    setSearchAllVisible(true);
                    contactIndex ? getSearchPerson(page) : getSearchGroup(page);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  全平台搜索
                  <img
                    src={downArrowbPng}
                    alt=""
                    style={{ width: '11px', height: '7px', marginRight: '5px' }}
                  />
                </div>
              ) : (
                <div className="personMember">
                  <div
                    className="personMember-container"
                    onScroll={scrollSearchLoading}
                  >
                    {loading ? (
                      <Loading loadingWidth="50px" loadingHeight="50px" />
                    ) : null}
                    {searchList.map((searchItem: any, searchIndex: number) => {
                      let name = contactIndex
                        ? searchItem.nickName
                        : searchItem.groupName;
                      let avatar = contactIndex
                        ? searchItem.avatar
                          ? searchItem.avatar
                          : defaultPersonPng
                        : searchItem.groupLogo
                        ? searchItem.groupLogo
                        : defaultGroupPng;
                      let key = contactIndex
                        ? searchItem.userId
                        : searchItem._key;
                      return (
                        <React.Fragment key={'search' + searchIndex}>
                          {(contactIndex === 1 &&
                            !searchItem.isMyMainGroupMember) ||
                          (contactIndex === 0 && !searchItem.isGroupMember) ? (
                            <div className="personMember-item">
                              <div className="personMember-item-title">
                                <div className="personMember-item-avatar">
                                  <img src={avatar} alt="" />
                                </div>
                                <div className="personMember-item-name">
                                  {name}
                                </div>
                              </div>
                              {contactIndex ? (
                                <div
                                  className="personMember-item-button"
                                  onClick={
                                    () => {
                                      addMember(searchItem, searchIndex);
                                    }
                                    // addMember(item)
                                  }
                                >
                                  <div>加为好友</div>
                                </div>
                              ) : (
                                <div
                                  className="personMember-item-button"
                                  onClick={
                                    () => {
                                      joinGroup(key, searchIndex, searchItem);
                                    }
                                    // addMember(item)
                                  }
                                >
                                  <div>加入项目</div>
                                </div>
                              )}
                            </div>
                          ) : null}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </DropMenu>
          <DropMenu
            visible={addGroupVisible}
            onClose={() => {
              setAddGroupVisible(false);
            }}
            dropStyle={{
              width: 'calc(100% - 20px)',
              // height: '255px',
              top: '40px',
              left: '10px',
              color: '#333',
              zIndex: '10',
              borderRadius: '8px',
            }}
            title={'新建项目'}
          >
            <GroupCreate />
          </DropMenu>
          <Dialog
            visible={inviteVisible}
            onClose={() => {
              setInviteVisible(false);
            }}
            title={'申请加群'}
            dialogStyle={{
              width: '400px',
              height: question ? '300px' : isHasPassword ? '250px' : '200px',
            }}
            footer={false}
          >
            <div className="invite-container">
              {isHasPassword ? (
                <div style={{ width: '100%;' }}>
                  {question ? <div>{question} :</div> : null}
                  <TextField
                    required
                    id="outlined-basic"
                    variant="outlined"
                    label="口令"
                    className={classes.addInput}
                    onChange={changePasswordInput}
                    value={passwordInput}
                    style={
                      question
                        ? { marginTop: '15px', width: '100%' }
                        : { width: '100%' }
                    }
                  />
                </div>
              ) : null}
              <div
                className="invite-button"
                style={
                  isHasPassword
                    ? { justifyContent: 'space-between' }
                    : { justifyContent: 'center' }
                }
              >
                {isHasPassword ? (
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => {
                      passwordJoinGroup(searchItem._key);
                    }}
                  >
                    口令加群
                  </Button>
                ) : null}
                {joinType == 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => {
                      applyJoinGroup(searchItem._key);
                    }}
                  >
                    申请加群
                  </Button>
                ) : null}
              </div>
            </div>
          </Dialog>
        </div>
      </ClickAwayListener>
      <Contact contactIndex={contactIndex} />
    </div>
  );
};
export default HomeTab;
