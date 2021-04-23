import React, { useState, useEffect,useRef } from 'react';
import './groupMember.css';
import './sonGroup.css';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Button, TextField, Tooltip } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../redux/reducer/RootState';
import _ from 'lodash';
import api from '../../services/api';

import {
  getGroup,
  setGroupKey,
  getGroupInfo,
} from '../../redux/actions/groupActions';
import { setMessage, setMoveState } from '../../redux/actions/commonActions';
import Dialog from '../../components/common/dialog';
import DropMenu from '../../components/common/dropMenu';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
import closePng from '../../assets/img/taskClose.png';
import changeFatherSvg from '../../assets/svg/changeFather.svg';
export interface SonGroupProps {
  onClose: any;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
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
const SonGroup: React.FC<SonGroupProps> = (props) => {
  // const location = useLocation();
  // const history = useHistory();
  const { onClose } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const groupArray = useTypedSelector((state) => state.group.groupArray);
  const groupRole = useTypedSelector((state) => state.group.groupRole);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const [sonGroupList, setSonGroupList] = useState<any>([]);
  const [myGroupList, setMyGroupList] = useState<any>([]);
  const [isHasPassword, setIsHasPassword] = React.useState(false);
  const [inviteVisible, setInviteVisible] = React.useState(false);
  const [question, setQuestion] = React.useState('');
  const [searchList, setSearchList] = React.useState<any>([]);
  const [passwordInput, setPasswordInput] = React.useState('');
  const [joinType, setJoinType] = React.useState(1);
  const [searchIndex, setSearchIndex] = React.useState(0);
  const [searchItem, setSearchItem] = React.useState<any>(null);
  const [searchInput, setSearchInput] = useState('');
  const [targetGroupItem, setGroupItem] = React.useState<any>(null);
  const [groupVisible, setGroupVisible] = React.useState<any>(false);
  const [fatherVisible, setFatherVisible] = React.useState<any>(false);
  const [fatherList, setFatherList] = useState<any>([]);
  const [searchFatherList, setSearchFatherList] = useState<any>([]);

  const [fatherObj, setFatherObj] = useState<any>({});
  const [fatherInfo, setFatherInfo] = useState<any>({});
  const [fatherDialogVisible, setFatherDialogVisible] = React.useState<any>(
    false
  );
  const theme = useTypedSelector((state) => state.auth.theme);
let unDistory = useRef<any>(null);   unDistory.current=true;
  // const roleTypeArr = ['项目管理', '管理员', '编辑', '作者', '项目成员'];
  useEffect(() => {
    if (user && user._key) {
      getData();
    }
    return () => {
      // unDistory.current = false;
    };
  }, [user]);
  useEffect(() => {
    if (groupInfo) {
      let newGroupInfo = _.cloneDeep(groupInfo);
      setFatherInfo({
        fatherGroupLogo: newGroupInfo.fatherGroupLogo,
        fatherGroupKey: newGroupInfo.fatherGroupKey,
        fatherGroupName: newGroupInfo.fatherGroupName,
      });
    }
  }, [groupInfo]);

  const getData = async () => {
    let res: any = await api.group.getSonGroupList(groupKey);
    if (unDistory.current) {
      if (res.msg === 'OK') {
        setSonGroupList(res.result);
      } else {
        dispatch(setMessage(true, res.msg, 'error'));
      }
    }
    let groupRes: any = await api.group.getGroup(4, null, undefined, groupKey);
    if (unDistory.current) {
      if (groupRes.msg === 'OK') {
        setMyGroupList(groupRes.result);
      } else {
        dispatch(setMessage(true, res.msg, 'error'));
      }
    }
  };
  const toTargetGroup = (groupKey: string) => {
    dispatch(setGroupKey(groupKey));
    dispatch(getGroupInfo(groupKey));
    if (!theme.moveState) {
      dispatch(setMoveState('in'));
    }
    onClose();
  };
  const setChildGroup = async (sonGroupKey: string, item: any) => {
    let newSonGroupList = _.cloneDeep(sonGroupList);
    let newMyGroupList = _.cloneDeep(myGroupList);
    setGroupVisible(false);
    let res: any = await api.group.setSonGroup(groupKey, sonGroupKey);
    if (res.msg === 'OK') {
      dispatch(
        setMessage(
          true,
          '添加子项目成功,' +
            targetGroupItem.groupName +
            '项目已被设置为' +
            groupInfo.groupName +
            '项目的子项目',
          'success'
        )
      );
      newSonGroupList.push(item);
      newMyGroupList.splice(
        _.findIndex(newMyGroupList, {
          _key: sonGroupKey,
        }),
        1
      );
      setSonGroupList(newSonGroupList);
      setMyGroupList(newMyGroupList);
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };
  const setFatherGroup = async () => {
    let newFatherObj = _.cloneDeep(fatherObj);
    setGroupVisible(false);
    let res: any = await api.group.setSonGroup(newFatherObj._key, groupKey);
    if (res.msg === 'OK') {
      dispatch(
        setMessage(
          true,
          '切换父项目成功,' +
            groupInfo.groupName +
            '项目已被设置为' +
            fatherObj.groupName +
            '项目的子项目',
          'success'
        )
      );
      setFatherInfo({
        fatherGroupLogo: newFatherObj.groupLogo,
        fatherGroupKey: newFatherObj._key,
        fatherGroupName: newFatherObj.groupName,
      });
      setFatherDialogVisible(false);
      dispatch(getGroupInfo(groupKey));
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };
  const deleteSonGroup = async (sonGroupKey: string, index: number) => {
    let newSonGroupList = _.cloneDeep(sonGroupList);
    let newMyGroupList = _.cloneDeep(myGroupList);
    let res: any = await api.group.deleteFSGroup(groupKey, sonGroupKey);
    if (res.msg === 'OK') {
      dispatch(setMessage(true, '删除子项目成功', 'success'));
      let childItem = newSonGroupList.splice(index, 1);
      newMyGroupList.push(...childItem);
      setSonGroupList(newSonGroupList);
      setMyGroupList(newMyGroupList);
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };
  const changePasswordInput = (e: any) => {
    setPasswordInput(e.target.value);
  };
  const passwordJoinGroup = async (groupKey: string) => {
    let newSearchList = _.cloneDeep(searchList);
    let memberRes: any = await api.group.passwordJoinGroup(
      groupKey,
      passwordInput
    );
    if (memberRes.msg === 'OK') {
      dispatch(setMessage(true, '口令加项目成功', 'success'));
      newSearchList.splice(searchIndex, 1);
      setSearchList(newSearchList);
      dispatch(getGroup(3));
      setInviteVisible(false);
    } else {
      dispatch(setMessage(true, memberRes.msg, 'error'));
    }
  };
  const applyJoinGroup = async (groupKey: string) => {
    let memberRes: any = await api.group.applyJoinGroup(groupKey);
    if (memberRes.msg === 'OK') {
      dispatch(setMessage(true, '申请加项目成功', 'success'));
      setInviteVisible(false);
    } else {
      dispatch(setMessage(true, memberRes.msg, 'error'));
    }
  };
  const getFatherList = async () => {
    let fatherRes: any = await api.group.getGroup(7, null, 0, groupKey);
    if (fatherRes.msg === 'OK') {
      setFatherList(fatherRes.result);
      setSearchFatherList(fatherRes.result);
    } else {
      dispatch(setMessage(true, fatherRes.msg, 'error'));
    }
  };
  const searchGroup = (e: any) => {
    let input = e.target.value;
    setSearchInput(input);
    if (input) {
      let newSearchFatherList = _.cloneDeep(fatherList);
      newSearchFatherList = newSearchFatherList.filter(
        (item: any, index: number) => {
          return (
            item.groupName &&
            item.groupName.toUpperCase().indexOf(input.toUpperCase()) !== -1
          );
        }
      );
      setSearchFatherList(newSearchFatherList);
    }
  };
  return (
    <div className="group-member">
      <div className="group-member-person">
        <div className="group-member-choose">
          <div className="group-member-title">我的项目</div>
          <div className="group-member-container">
            {myGroupList.map((groupItem: any, groupIndex: number) => {
              return (
                <div className="group-member-item" key={'group' + groupIndex}>
                  <div className="group-member-item-container">
                    <div className="group-member-img" style={{borderRadius:'5px'}}>
                      <img
                        src={
                          groupItem.groupLogo
                            ? groupItem.groupLogo
                            : defaultGroupPng
                        }
                        alt=""
                      />
                    </div>
                    <div className="group-member-name">
                      {groupItem.groupName}
                    </div>
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setGroupItem(groupItem);
                      setGroupVisible(true);
                    }}
                    className={classes.button}
                  >
                    设为子项目
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="group-member-team">
        {groupInfo ? (
          <div
            className="group-member-title"
            style={{ justifyContent: 'space-between' }}
          >
            <Tooltip title={groupInfo.groupName + ' 的子项目'}>
              <div className="group-member-subtitle">
                {groupInfo.groupName + ' 的子项目'}
              </div>
            </Tooltip>
            <div
              className="group-member-father"
              onClick={() => {
                if (groupRole === 1) {
                  setFatherVisible(true);
                  getFatherList();
                }
              }}
            >
              父项目:
              {fatherInfo.fatherGroupKey ? (
                <React.Fragment>
                  <div className="group-member-fatherLogo"  style={{borderRadius:'5px'}}>
                    <img
                      src={
                        fatherInfo.fatherGroupLogo
                          ? fatherInfo.fatherGroupLogo
                          : defaultGroupPng
                      }
                      alt=""
                    />
                  </div>
                  <Tooltip title={fatherInfo.fatherGroupName}>
                    <div className="group-member-fatherName">
                      {fatherInfo.fatherGroupName}
                    </div>
                  </Tooltip>
                </React.Fragment>
              ) : (
                '无父项目'
              )}
              <Tooltip title="设置父项目">
                <img
                  src={changeFatherSvg}
                  alt=""
                  style={{ width: '16px', height: '14px', marginLeft: '5px' }}
                />
              </Tooltip>
              <DropMenu
                visible={fatherVisible}
                dropStyle={{
                  width: '200px',
                  height: '500px',
                  top: '40px',
                  left: '-20px',
                  color: '#333',
                  overflow: 'auto',
                }}
                onClose={() => {
                  setFatherVisible(false);
                }}
              >
                <React.Fragment>
                  <input
                    type="text"
                    className="task-executor-input"
                    placeholder={'输入项目名…'}
                    onChange={searchGroup}
                    value={searchInput}
                  />
                  {searchFatherList.map(
                    (groupItem: any, groupIndex: number) => {
                      return (
                        <div
                          key={'fatherGroup' + groupIndex}
                          onClick={() => {
                            setFatherObj(groupItem);
                            setFatherDialogVisible(true);
                          }}
                          className="group-member-item"
                          style={{
                            width: '100%',
                            height: '30px',
                            justifyContent: 'flex-start',
                            padding: '0px 5px',
                            boxSizing: 'border-box',
                            cursor: 'pointer',
                          }}
                        >
                          <div
                            className="group-member-img"
                            style={{ marginRight: '10px',borderRadius:'5px' }}
                          >
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
                            <div
                              className="group-member-name"
                              style={{ width: 'calc(100% - 45px)' }}
                            >
                              {groupItem.groupName}
                            </div>
                          </Tooltip>
                        </div>
                      );
                    }
                  )}
                </React.Fragment>
              </DropMenu>
            </div>
          </div>
        ) : null}
        <div className="group-member-container contact-team-container">
          {sonGroupList.map((groupItem: any, groupIndex: number) => {
            return (
              <div className="group-member-item" key={'son' + groupIndex}>
                <div
                  className="group-member-item-container"
                  style={{ width: '60%' }}
                >
                  <div className="group-member-img"  style={{borderRadius:'5px'}}>
                    <img
                      src={
                        groupItem.groupLogo
                          ? groupItem.groupLogo
                          : defaultGroupPng
                      }
                      alt=""
                    />
                  </div>
                  <div className="group-member-name">{groupItem.groupName}</div>
                </div>
                <div className="group-time-set">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      if (
                        _.findIndex(groupArray, { _key: groupItem._key }) !== -1
                      ) {
                        toTargetGroup(groupItem._key);
                      } else {
                        setInviteVisible(true);
                      }
                    }}
                    className={classes.button}
                  >
                    {_.findIndex(groupArray, { _key: groupItem._key }) !== -1
                      ? '查看子项目'
                      : '申请加项目'}
                  </Button>
                  <div className="group-time-close">
                    <img
                      src={closePng}
                      onClick={() => {
                        deleteSonGroup(groupItem._key, groupIndex);
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Dialog
        visible={groupVisible}
        onClose={() => {
          setGroupVisible(false);
        }}
        onOK={() => {
          setChildGroup(targetGroupItem._key, targetGroupItem);
        }}
        title={'设置子项目'}
        dialogStyle={{ width: '400px', height: '200px' }}
      >
        <div className="dialog-onlyTitle">
          将此项目设置为{groupInfo.groupName}项目的子项目，此操作不可逆，确认继续吗
        </div>
      </Dialog>
      <Dialog
        visible={fatherDialogVisible}
        onClose={() => {
          setFatherDialogVisible(false);
        }}
        onOK={() => {
          setFatherGroup();
        }}
        title={'切换父项目'}
        dialogStyle={{ width: '400px', height: '200px' }}
      >
        <div className="dialog-onlyTitle">
          将此项目设置为{fatherObj.groupName}项目的子项目，此操作不可逆，确认继续吗
        </div>
      </Dialog>
      <Dialog
        visible={inviteVisible}
        onClose={() => {
          setInviteVisible(false);
        }}
        title={'申请加项目'}
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
                口令加项目
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
                申请加项目
              </Button>
            ) : null}
          </div>
        </div>
      </Dialog>
    </div>
  );
};
export default SonGroup;
