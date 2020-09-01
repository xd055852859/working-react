import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './tabs.css';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';
import { useTypedSelector } from '../../redux/reducer/RootState';
import _ from 'lodash';
import searchPng from '../../assets/img/search.png';
import sortPng from '../../assets/img/contact-sort.png';
import addPng from '../../assets/img/contact-add.png';
import Contact from '../contact/contact';
import Dialog from '../../components/common/dialog';
import GroupSet from './groupSet';
import DropMenu from '../../components/common/dropMenu';
import api from '../../services/api';
import {
  setMessage,
  setCommonHeaderIndex,
  setMoveState,
} from '../../redux/actions/commonActions';
import { setTheme } from '../../redux/actions/authActions';
import { getMember } from '../../redux/actions/memberActions';
import {
  getGroup,
  getGroupInfo,
  setGroupKey,
} from '../../redux/actions/groupActions';

// import { Theme, makeStyles } from '@material-ui/core/styles';
import defaultPersonPng from '../../assets/img/defaultPerson.png';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}
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
  const theme = useTypedSelector((state) => state.auth.theme);
  const [contactIndex, setContactIndex] = React.useState(0);
  const [searchVisible, setSearchVisible] = React.useState(false);
  const [memberSortVisible, setMemberSortVisible] = React.useState(false);
  const [groupSortVisible, setGroupSortVisible] = React.useState(false);
  const [addVisible, setAddVisible] = React.useState(false);
  const [searchList, setSearchList] = React.useState<any>([]);
  const [searchInput, setSearchInput] = React.useState('');
  const [passwordInput, setPasswordInput] = React.useState('');
  const [joinType, setJoinType] = React.useState(0);
  const [searchIndex, setSearchIndex] = React.useState(0);
  const [searchItem, setSearchItem] = React.useState<any>(null);
  const [isHasPassword, setIsHasPassword] = React.useState(false);
  const [inviteVisible, setInviteVisible] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [groupObj, setGroupObj] = React.useState<any>(null);
  const limit = 30;
  useEffect(() => {
    if (searchInput == '') {
      setSearchList([]);
    }
  }, [searchInput, contactIndex]);
  const changeInput = (e: any) => {
    setSearchInput(e.target.value);
  };
  const changePasswordInput = (e: any) => {
    setPasswordInput(e.target.value);
  };
  const searchMsg = () => {
    if (searchInput != '') {
      if (contactIndex == 1) {
        getSearchPerson(page);
      } else if (contactIndex == 0) {
        getSearchGroup(page);
      }
    }
  };
  const getSearchPerson = async (page: number) => {
    let newSearchList: any = [];
    if (page == 1) {
      setSearchList([]);
    } else {
      newSearchList = _.cloneDeep(searchList);
    }

    let res: any = await api.member.searchUserNew(searchInput, page, limit);
    if (res.msg == 'OK') {
      res.result.forEach((searchItem: any) => {
        searchItem.avatar = searchItem.avatar
          ? searchItem.avatar +
            '?imageMogr2/auto-orient/thumbnail/80x80/format/jpg'
          : defaultPersonPng;
        newSearchList.push(searchItem);
      });
      setSearchList(newSearchList);
      setTotal(res.totalNumber);
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };
  const getSearchGroup = async (page: number) => {
    let newSearchList: any = [];
    if (page == 1) {
      setSearchList([]);
    } else {
      newSearchList = _.cloneDeep(searchList);
    }
    let res: any = await api.member.searchGroupNew(searchInput, page, limit);
    if (res.msg == 'OK') {
      res.result.map((searchItem: any) => {
        searchItem.avatar = searchItem.logo
          ? searchItem.groupLogo +
            '?imageMogr2/auto-orient/thumbnail/80x80/format/jpg'
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
    if (memberRes.msg == 'OK') {
      dispatch(setMessage(true, '添加好友成功', 'success'));
      newSearchList[searchIndex].isMyMainGroupMember = true;
      setSearchList(newSearchList);
      dispatch(getMember(mainGroupKey,theme.personSortType));
    } else {
      dispatch(setMessage(true, memberRes.msg, 'error'));
    }
  };
  const deleteMember = async (searchItem: any, searchIndex: number) => {
    let newSearchList = _.cloneDeep(searchList);
    let memberRes: any = await api.group.deleteGroupMember(mainGroupKey, [
      searchItem.userId,
    ]);
    if (memberRes.msg == 'OK') {
      dispatch(setMessage(true, '删除好友成功', 'success'));
      newSearchList[searchIndex].isMyMainGroupMember = false;
      setSearchList(newSearchList);
      dispatch(getMember(mainGroupKey,theme.personSortType));
    } else {
      dispatch(setMessage(true, memberRes.msg, 'error'));
    }
  };
  const outGroup = async (groupKey: string, searchIndex: number) => {
    let newSearchList = _.cloneDeep(searchList);
    let memberRes: any = await api.group.outGroup(groupKey);
    if (memberRes.msg == 'OK') {
      dispatch(setMessage(true, '退出群组成功', 'success'));
      newSearchList[searchIndex].isGroupMember = false;
      setSearchList(newSearchList);
      dispatch(getGroup(3,null, theme.groupSortType));
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
    if (groupRes.msg == 'OK') {
      let newGroupInfo = groupRes.result;
      console.log(groupRes);
      if (newGroupInfo.joinType) {
        setJoinType(newGroupInfo.joinType);
        setIsHasPassword(newGroupInfo.isHasPassword);
        setSearchIndex(searchIndex);
        setSearchItem(searchItem);
        setInviteVisible(true);
      } else {
        api.group.addGroupMember(groupKey, [
          {
            userKey: user._key,
            nickName: user.profile.nickName,
            avatar: user.profile.avatar,
            gender: user.profile.gender,
            role: newGroupInfo.defaultPower,
          },
        ]);
        dispatch(setMessage(true, '加入群组成功', 'success'));
        newSearchList[searchIndex].isGroupMember = true;
        setSearchList(newSearchList);
        dispatch(getGroup(3,null, theme.groupSortType));
      }
    } else {
      dispatch(setMessage(true, groupRes.msg, 'error'));
    }
  };
  const applyJoinGroup = async (groupKey: string) => {
    let memberRes: any = await api.group.applyJoinGroup(groupKey);
    if (memberRes.msg == 'OK') {
      dispatch(setMessage(true, '申请加群成功', 'success'));
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
    if (memberRes.msg == 'OK') {
      dispatch(setMessage(true, '口令加群成功', 'success'));
      newSearchList[searchIndex].isGroupMember = true;
      setSearchList(newSearchList);
      dispatch(getGroup(3,null, theme.groupSortType));
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

  const saveGroupSet = (obj: any) => {
    setGroupObj(obj);
  };
  const addGroup = async () => {
    let groupRes: any = await api.group.addGroup(groupObj);
    if (groupRes.msg == 'OK') {
      dispatch(setMessage(true, '创建群成功', 'success'));
      dispatch(setGroupKey(groupRes.result._key));
      dispatch(getGroupInfo(groupRes.result._key));
      dispatch(setCommonHeaderIndex(3));
      dispatch(setMoveState('in'));
      dispatch(getGroup(3,null, theme.groupSortType));
    } else {
      dispatch(setMessage(true, groupRes.msg, 'error'));
    }
  };
  const contactSort = (sortType: number) => {
    let newTheme = _.cloneDeep(theme);
    if (contactIndex == 0) {
      dispatch(getGroup(3, null, sortType));
      newTheme.groupSortType = sortType;
      dispatch(setTheme(newTheme));
    } else if (contactIndex == 1) {
      dispatch(getMember(mainGroupKey,sortType));
      newTheme.personSortType = sortType;
      dispatch(setTheme(newTheme));
    }
  };
  return (
    <div className="tabs">
      <div className="tabs-tab-nav">
        <div
          onClick={() => {
            setContactIndex(0);
            setSearchList([]);
          }}
          style={
            contactIndex == 0 ? { background: 'rgba(255, 255, 255, 0.34)' } : {}
          }
          className="tabs-tab-nav-item"
        >
          项目
        </div>
        <div
          onClick={() => {
            setContactIndex(1);
          }}
          style={
            contactIndex == 1 ? { background: 'rgba(255, 255, 255, 0.34)' } : {}
          }
          className="tabs-tab-nav-item"
        >
          队友
        </div>
        <img
          src={searchPng}
          alt=""
          className="search-icon"
          onClick={() => {
            setSearchVisible(true);
            setSearchList([]);
          }}
        />
        <img
          src={sortPng}
          alt=""
          className="sort-icon"
          onClick={() => {
            contactIndex == 1
              ? setMemberSortVisible(true)
              : setGroupSortVisible(true);
          }}
        />
        <img
          src={addPng}
          alt=""
          className="add-icon"
          onClick={() => {
            setAddVisible(true);
          }}
        />
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
            contactIndex == 1
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
        </DropMenu>
      </div>
      <Contact contactIndex={contactIndex} />
      <Dialog
        visible={searchVisible}
        onClose={() => {
          setSearchVisible(false);
        }}
        title={'搜索'}
        dialogStyle={{ width: '600px', height: '700px' }}
        footer={false}
      >
        <div className="personMember">
          <div className="personMember-search">
            <TextField
              required
              id="outlined-basic"
              variant="outlined"
              label="搜索"
              className={classes.input}
              onChange={changeInput}
              value={searchInput}
            />
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => {
                searchMsg();
              }}
            >
              搜索
            </Button>
          </div>
          <div
            className="personMember-container"
            onScroll={scrollSearchLoading}
          >
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
              let key = contactIndex ? searchItem.userId : searchItem._key;
              return (
                <div key={'search' + searchIndex} className="personMember-item">
                  <div
                    style={{ width: '100%', height: '100%', display: 'flex' }}
                  >
                    <div className="personMember-item-title">
                      <div className="personMember-item-avatar">
                        <img src={avatar} alt="" />
                      </div>
                      <div>{name}</div>
                    </div>
                    {contactIndex ? (
                      searchItem.isMyMainGroupMember ? (
                        <div
                          className="personMember-item-button"
                          onClick={
                            () => {
                              deleteMember(searchItem, searchIndex);
                            }
                            // addMember(item)
                          }
                        >
                          <div>删除好友</div>
                        </div>
                      ) : (
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
                      )
                    ) : searchItem.isGroupMember ? (
                      <div
                        className="personMember-item-button"
                        onClick={
                          () => {
                            outGroup(key, searchIndex);
                          }
                          // addMember(item)
                        }
                      >
                        <div>退出群组</div>
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
                        <div>加入群组</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Dialog>
      <Dialog
        visible={inviteVisible}
        onClose={() => {
          setInviteVisible(false);
        }}
        title={'申请加群'}
        dialogStyle={{
          width: '400px',
          height: isHasPassword ? '300px' : '200px',
        }}
        footer={false}
      >
        <div className="invite-container">
          {isHasPassword ? (
            <TextField
              required
              id="outlined-basic"
              variant="outlined"
              label="口令"
              className={classes.addInput}
              onChange={changePasswordInput}
              value={passwordInput}
            />
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
      <Dialog
        visible={addVisible}
        onClose={() => {
          setAddVisible(false);
        }}
        onOK={() => {
          addGroup();
        }}
        title={'添加群'}
        dialogStyle={{ width: '750px', height: '700px' }}
      >
        <GroupSet saveGroupSet={saveGroupSet} type={'创建'} />
      </Dialog>
    </div>
  );
};
export default HomeTab;
