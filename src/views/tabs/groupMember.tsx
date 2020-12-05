import React, { useState, useEffect } from 'react';
import './groupMember.css';
import { Checkbox, TextField, Button } from '@material-ui/core';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../redux/reducer/RootState';
import _ from 'lodash';
import api from '../../services/api';

import { setMessage } from '../../redux/actions/commonActions';
import { getMember } from '../../redux/actions/memberActions';

import DropMenu from '../../components/common/dropMenu';

import closePng from '../../assets/img/taskClose.png';
import defaultPersonPng from '../../assets/img/defaultPerson.png';
export interface GroupMemberProps {
  setMember: any;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      backgroundColor: '#17B881',
      padding: '6px 16px',
      color: '#fff',
    },
    addButton: {
      backgroundColor: '#17B881',
      padding: '3px 7px',
      color: '#fff',
    },
    input: {
      width: 'calc(100% - 115px)',
      marginRight: '10px',
      minWidth: '200px',
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
const GroupMember: React.FC<GroupMemberProps> = (props) => {
  // const location = useLocation();
  // const history = useHistory();
  const { setMember } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const memberArray = useTypedSelector((state) => state.member.memberArray);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const groupMemberArray = useTypedSelector(
    (state) => state.member.groupMemberArray
  );
  const groupRole = useTypedSelector((state) => state.group.groupRole);
  const [mainMemberList, setMainMemberList] = useState<any>([]);
  const [searchMemberList, setSearchMemberList] = useState<any>([]);
  const [groupMemberList, setGroupMemberList] = useState<any>([]);
  const [joinMemberList, setJoinMemberList] = useState<any>([]);
  const [memberList, setMemberList] = useState<any>([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchType, setSearchType] = useState(false);
  const [roleVisible, setRoleVisible] = useState(false);
  const [chooseIndex, setChooseIndex] = useState(0);
  const [roleIndex, setRoleIndex] = useState<any>(null);
  const [pos, setPos] = useState<any>([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const roleTypeArr = ['群主', '管理员', '编辑', '作者', '群成员'];
  const limit = 15;
  useEffect(() => {
    if (
      user &&
      user._key &&
      memberArray &&
      groupMemberArray &&
      searchInput === '' &&
      groupKey
    ) {
      let newMemberList: any = [];
      if (memberList.length === 0) {
        newMemberList = _.cloneDeep(groupMemberArray);
      } else {
        newMemberList = _.cloneDeep(memberList);
      }
      let newMemberArray = _.cloneDeep(memberArray);
      newMemberArray = newMemberArray.map((memberItem: any) => {
        let newMemberIndex = _.findIndex(newMemberList, {
          userId: memberItem.userId,
        });
        if (newMemberIndex === -1) {
          memberItem.checked = false;
        } else {
          memberItem.checked = true;
        }
        return memberItem;
      });
      setMainMemberList(_.sortBy(newMemberArray, ['checked']).reverse());
      setGroupMemberList(_.sortBy(newMemberArray, ['checked']).reverse());
      setMemberList(_.sortBy(newMemberList, ['role']));
    }
    if (user && user._key && groupKey) {
      getJoinGroupList();
    }
  }, [user, groupKey, memberArray, groupMemberArray, searchInput]);
  useEffect(() => {
    if (searchInput) {
      setSearchType(false);
    }
  }, [searchInput]);

  const getJoinGroupList = async () => {
    let res: any = await api.group.applyJoinGroupList(groupKey);
    if (res.msg === 'OK') {
      setJoinMemberList(res.result);
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };
  const changeMember = (index: number) => {
    let newMainMemberList = _.cloneDeep(mainMemberList);
    let newMemberList = _.cloneDeep(memberList);
    let newSearchMemberList = _.cloneDeep(searchMemberList);
    if (searchInput !== '') {
      if (newSearchMemberList[index].checked) {
        newSearchMemberList[index].checked = false;
        let newSearchIndex = _.findIndex(newMemberList, {
          userId: newSearchMemberList[index].userId,
        });
        if (newSearchIndex !== -1) {
          newMemberList.splice(newSearchIndex, 1);
        }
      } else {
        newSearchMemberList[index].checked = true;
        newSearchMemberList[index].role = groupInfo.defaultPower;
        newMemberList.push(newSearchMemberList[index]);
      }
      setGroupMemberList(newSearchMemberList);
    } else {
      if (newMainMemberList[index].checked) {
        newMainMemberList[index].checked = false;
        let newSearchIndex = _.findIndex(newMemberList, {
          userId: newMainMemberList[index].userId,
        });
        if (newSearchIndex !== -1) {
          newMemberList.splice(newSearchIndex, 1);
        }
      } else {
        newMainMemberList[index].checked = true;
        newMainMemberList[index].role = groupInfo.defaultPower;
        newMemberList.push(newMainMemberList[index]);
      }
      setGroupMemberList(newMainMemberList);
    }
    setSearchMemberList(newSearchMemberList);
    setMainMemberList(newMainMemberList);
    setMemberList(newMemberList);
    setMember(newMemberList);
  };
  const searchMember = () => {
    if (searchInput !== '') {
      // this.getSearchList({ param: { name: this.searchInput }, type: 1 })
      getSearchPerson(page);
    }
  };
  const getSearchPerson = async (page: number) => {
    let newMemberList = _.cloneDeep(memberList);
    let newSearchMemberList: any = [];
    if (page === 1) {
      setSearchMemberList([]);
    } else {
      newSearchMemberList = _.cloneDeep(searchMemberList);
    }
    let res: any = await api.member.searchUserNew(searchInput, page, limit);
    if (res.msg === 'OK') {
      res.result.forEach((searchItem: any) => {
        searchItem.avatar = searchItem.avatar
          ? searchItem.avatar
          : defaultPersonPng;
        let searchMemberIndex = _.findIndex(newMemberList, {
          userId: searchItem.userId,
        });
        if (searchMemberIndex === -1) {
          searchItem.checked = false;
        } else {
          searchItem.checked = true;
        }
        newSearchMemberList.push(searchItem);
      });
      setSearchMemberList(newSearchMemberList);
      setGroupMemberList(newSearchMemberList);
      setTotal(res.totalNumber);
      setSearchType(true);
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
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
    if (
      clientHeight + scrollTop >= scrollHeight &&
      searchMemberList.length < total
    ) {
      newPage = newPage + 1;
      setPage(newPage);
      getSearchPerson(newPage);
    }
  };
  const deleteMember = async (userId: number) => {
    let newMainMemberList = _.cloneDeep(mainMemberList);
    let newMemberList = _.cloneDeep(memberList);
    let newSearchMemberList = _.cloneDeep(searchMemberList);
    if (searchInput !== '') {
      let newSearchIndex = _.findIndex(newSearchMemberList, {
        userId: userId,
      });
      let newGroupIndex = _.findIndex(newMemberList, {
        userId: userId,
      });
      newMemberList.splice(newGroupIndex, 1);
      if (newSearchIndex !== -1) {
        newSearchMemberList[newSearchIndex].checked = false;
      }
      setGroupMemberList(newSearchMemberList);
      setSearchMemberList(newSearchMemberList);
    } else {
      let newMainIndex = _.findIndex(newMainMemberList, {
        userId: userId,
      });
      let newGroupIndex = _.findIndex(newMemberList, {
        userId: userId,
      });
      newMemberList.splice(newGroupIndex, 1);
      if (newMainIndex !== -1) {
        newMainMemberList[newMainIndex].checked = false;
      }
      setGroupMemberList(newMainMemberList);
      setMainMemberList(newMainMemberList);
    }
    setMemberList(newMemberList);
    setMember(newMemberList);
    if (_.findIndex(groupMemberArray, { userId: userId }) !== -1) {
      let memberRes: any = await api.group.deleteGroupMember(groupKey, [
        userId,
      ]);
      if (memberRes.msg === 'OK') {
        // dispatch(setMessage(true, '删除群成员成功', 'success'));
      } else {
        dispatch(setMessage(true, memberRes.msg, 'error'));
      }
    }
  };
  const changeRoleVisible = (event: any, index: number) => {
    let posX: number = 0,
      posY: number = 0;
    let e: any = event || window.event;
    if (e.pageX || e.pageY) {
      posX = e.pageX;
      posY = e.pageY;
    } else if (e.clientX || e.clientY) {
      posX =
        e.clientX +
        document.documentElement.scrollLeft +
        document.body.scrollLeft;
      posY =
        e.clientY +
        document.documentElement.scrollTop +
        document.body.scrollTop;
    }
    setPos([posX, posY]);
    setRoleVisible(true);
    setRoleIndex(index);
  };
  const changeRole = (roleIndex: number, index: number) => {
    let newMemberRoleList: any = _.cloneDeep(memberList);
    newMemberRoleList[index].role = roleIndex + 1;
    setMemberList(newMemberRoleList);
    setMember(newMemberRoleList);
    setRoleVisible(false);
    // this.$set(this.targetMemberList, index, this.targetMemberList[index]);
    // this.setRole({
    //   groupKey: this.groupKey,
    //   targetUKey: this.newMemberList[index].userId,
    //   role: roleIndex + 1,
    // });
    let memberIndex = _.findIndex(groupMemberArray, {
      userId: newMemberRoleList[index].userId,
    });
    if (memberIndex !== -1) {
      api.auth.setRole(
        groupKey,
        newMemberRoleList[index].userId,
        roleIndex + 1
      );
    }
  };
  const addJoinMember = async (joinItem: any, joinIndex: number) => {
    let newJoinMemberList = _.cloneDeep(joinMemberList);
    let memberRes: any = await api.group.addGroupMember(groupKey, [
      {
        userKey: joinItem.userKey,
        nickName: joinItem.nickName,
        avatar: joinItem.avatar,
        gender: 0,
        role: groupInfo.defaultPower,
      },
    ]);
    if (memberRes.msg === 'OK') {
      dispatch(setMessage(true, '通过审核成功', 'success'));
      newJoinMemberList.splice(joinIndex, 1);
      setJoinMemberList(newJoinMemberList);
      dispatch(getMember(groupKey));
      api.group.deleteApplyJoinGroup(joinItem._key);
    } else {
      dispatch(setMessage(true, memberRes.msg, 'error'));
    }
  };
  const deleteJoinMember = async (joinItem: any, joinIndex: number) => {
    let newJoinMemberList = _.cloneDeep(joinMemberList);
    let memberRes: any = await api.group.deleteApplyJoinGroup(joinItem._key);
    if (memberRes.msg === 'OK') {
      dispatch(setMessage(true, '拒绝审核成功', 'success'));
      newJoinMemberList.splice(joinIndex, 1);
      setJoinMemberList(newJoinMemberList);
    } else {
      dispatch(setMessage(true, memberRes.msg, 'error'));
    }
  };
  const addMember = async (addItem: any, addIndex: number) => {
    let newSearchMemberList = _.cloneDeep(searchMemberList);
    let memberRes: any = await api.group.addGroupMember(mainGroupKey, [
      {
        userKey: addItem.userId,
        nickName: addItem.nickName,
        avatar: addItem.avatar,
        gender: 0,
        role: 5,
      },
    ]);
    if (memberRes.msg === 'OK') {
      dispatch(setMessage(true, '添加好友成功', 'success'));
      newSearchMemberList[addIndex].isMyMainGroupMember = true;
      setSearchMemberList(newSearchMemberList);
      setGroupMemberList(newSearchMemberList);
      dispatch(getMember(mainGroupKey));
    } else {
      dispatch(setMessage(true, memberRes.msg, 'error'));
    }
  };
  return (
    <div className="group-member">
      <div className="group-member-person">
        <div className="group-member-choose">
          <div className="group-member-title">
            <div
              onClick={() => {
                setChooseIndex(0);
              }}
              style={{
                borderBottom: chooseIndex === 0 ? '2px solid #17B881' : 'none',
                marginRight: '15px',
                cursor: 'pointer',
              }}
            >
              联系人({mainMemberList.length})
            </div>
            <div
              onClick={() => {
                setChooseIndex(1);
              }}
              style={{
                borderBottom: chooseIndex === 1 ? '2px solid #17B881' : 'none',
                cursor: 'pointer',
                position:'relative'
              }}
            >
              申请人({joinMemberList.length})
            </div>
          </div>
          {chooseIndex === 0 ? (
            <React.Fragment>
              <div className="group-member-search">
                <TextField
                  // required
                  id="outlined-basic"
                  variant="outlined"
                  label="搜索"
                  className={classes.input}
                  style={{ width: '70%' }}
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                  }}
                  onKeyDown={(e: any) => {
                    if (e.keyCode === 13) {
                      searchMember();
                    }
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    searchMember();
                  }}
                  style={{ marginLeft: '10px' }}
                  className={classes.button}
                >
                  搜索
                </Button>
              </div>
              <div
                className="group-member-container"
                onScroll={(e) => {
                  if (searchInput !== '') {
                    scrollSearchLoading(e);
                  }
                }}
              >
                {groupMemberList.map((mainItem: any, mainIndex: number) => {
                  return (
                    <div className="group-member-item" key={'main' + mainIndex}>
                      <div className="group-member-item-container">
                        <div className="group-member-img">
                          <img
                            src={
                              mainItem.avatar
                                ? mainItem.avatar
                                : defaultPersonPng
                            }
                            alt=""
                          />
                        </div>
                        <div className="group-member-name">
                          {mainItem.nickName}
                          {searchType && !mainItem.isMyMainGroupMember ? (
                            <div
                              className="group-member-add"
                              onClick={() => {
                                addMember(mainItem, mainIndex);
                              }}
                            >
                              + 好友
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <Checkbox
                        onChange={() => {
                          changeMember(mainIndex);
                        }}
                        checked={mainItem.checked}
                      />
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          ) : null}
          {chooseIndex === 1 ? (
            <div className="group-member-container" style={{ height: '100%' }}>
              {joinMemberList.map((mainItem: any, mainIndex: number) => {
                return (
                  <div className="group-member-item" key={'join' + mainIndex}>
                    <div className="group-member-item-container">
                      <div className="group-member-img">
                        <img
                          src={
                            mainItem.avatar ? mainItem.avatar : defaultPersonPng
                          }
                          alt=""
                        />
                      </div>
                      <div className="group-member-name">
                        {mainItem.nickName}
                      </div>
                    </div>
                    <div className="group-member-item-button">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          addJoinMember(mainItem, mainIndex);
                        }}
                        className={classes.addButton}
                        style={{ marginRight: '5px' }}
                      >
                        通过
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          deleteJoinMember(mainItem, mainIndex);
                        }}
                        className={classes.addButton}
                      >
                        拒绝
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
      <div className="group-member-team">
        <div className="group-member-title">群权限设置</div>
        <div className="group-member-container contact-team-container">
          {memberList.map((newItem: any, newIndex: number) => {
            return (
              <div className="group-member-item" key={'new' + newIndex}>
                <div className="group-member-item-container">
                  <div className="group-member-img">
                    <img
                      src={newItem.avatar ? newItem.avatar : defaultPersonPng}
                      alt=""
                    />
                  </div>
                  <div className="group-member-name">{newItem.nickName}</div>
                </div>
                <div className="group-time-set">
                  <div
                    className="group-time"
                    onClick={(e) => {
                      if (
                        newItem.userId !== user._key &&
                        groupRole < newItem.role
                      ) {
                        changeRoleVisible(e, newIndex);
                      }
                    }}
                  >
                    {roleTypeArr[newItem.role - 1]}
                  </div>

                  <div className="group-time-close">
                    {groupRole > 0 && groupRole < 3 ? (
                      <img
                        src={closePng}
                        alt=""
                        onClick={() => {
                          deleteMember(newItem.userId);
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <DropMenu
        visible={roleVisible}
        dropStyle={{
          position: 'fixed',
          top: pos[1] + 10 + 'px',
          left: pos[0] - 20 + 'px',
          width: '80px',
          zIndex: '5',
          color: '#333',
        }}
        onClose={() => {
          setRoleVisible(false);
        }}
      >
        <div className="group-role">
          {groupRole === 1 ? (
            <div
              onClick={() => {
                changeRole(1, roleIndex);
              }}
              className="group-role-item"
            >
              {roleTypeArr[1]}
            </div>
          ) : null}
          {groupRole === 1 || groupRole === 2 ? (
            <div
              onClick={() => {
                changeRole(2, roleIndex);
              }}
              className="group-role-item"
            >
              {roleTypeArr[2]}
            </div>
          ) : null}
          {groupRole < 3 ? (
            <div
              onClick={() => {
                changeRole(3, roleIndex);
              }}
              className="group-role-item"
            >
              {roleTypeArr[3]}
            </div>
          ) : null}
          {groupRole < 4 ? (
            <div
              onClick={() => {
                changeRole(4, roleIndex);
              }}
              className="group-role-item"
            >
              {roleTypeArr[4]}
            </div>
          ) : null}
        </div>
      </DropMenu>
    </div>
  );
};
export default GroupMember;
