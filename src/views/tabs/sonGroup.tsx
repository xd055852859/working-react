import React, { useState, useEffect } from 'react';
import './groupMember.css';
import './sonGroup.css';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { setGroupKey, getGroupInfo } from '../../redux/actions/groupActions';
import { setMessage, setMoveState } from '../../redux/actions/commonActions';
import { useTypedSelector } from '../../redux/reducer/RootState';
import _ from 'lodash';
import api from '../../services/api';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
import closePng from '../../assets/img/taskClose.png';
export interface SonGroupProps {
  onClose:any
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
  })
);
const SonGroup: React.FC<SonGroupProps> = (props) => {
  // const location = useLocation();
  // const history = useHistory();
  const {onClose} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const memberArray = useTypedSelector((state) => state.member.memberArray);
  const groupMemberArray = useTypedSelector(
    (state) => state.member.groupMemberArray
  );
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const groupRole = useTypedSelector((state) => state.group.groupRole);
  const [sonGroupList, setSonGroupList] = useState<any>([]);
  const [myGroupList, setMyGroupList] = useState<any>([]);

  // const roleTypeArr = ['群主', '管理员', '编辑', '作者', '群成员'];
  useEffect(() => {
    if (user && user._key) {
      getData();
    }
  }, [user]);
  const getData = async () => {
    let res: any = await api.group.getSonGroupList(groupKey);
    if (res.msg == 'OK') {
      setSonGroupList(res.result);
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
    let groupRes: any = await api.group.getGroup(4, null, undefined, groupKey);
    if (groupRes.msg == 'OK') {
      setMyGroupList(groupRes.result);
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };
  const toTargetGroup = (groupKey: string) => {
    dispatch(setGroupKey(groupKey));
    dispatch(getGroupInfo(groupKey));
    dispatch(setMoveState('in'));
    onClose();
  };
  const setChildGroup = async (sonGroupKey: string, item: any) => {
    let newSonGroupList = _.cloneDeep(sonGroupList);
    let newMyGroupList = _.cloneDeep(myGroupList);
    let res: any = await api.group.setSonGroup(groupKey, sonGroupKey);
    if (res.msg == 'OK') {
      dispatch(setMessage(true, '添加子群成功', 'success'));
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
  const deleteSonGroup = async (sonGroupKey: string, index: number) => {
    let newSonGroupList = _.cloneDeep(sonGroupList);
    let newMyGroupList = _.cloneDeep(myGroupList);
    let res: any = await api.group.deleteFSGroup(groupKey, sonGroupKey);
    if (res.msg == 'OK') {
      dispatch(setMessage(true, '删除子群成功', 'success'));
      let childItem = newSonGroupList.splice(index, 1);
      newMyGroupList.push(...childItem);
      setSonGroupList(newSonGroupList);
      setMyGroupList(newMyGroupList);
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };
  return (
    <div className="group-member">
      <div className="group-member-person">
        <div className="group-member-choose">
          <div className="group-member-title">我的群</div>
          <div className="group-member-container">
            {myGroupList.map((groupItem: any, groupIndex: number) => {
              return (
                <div className="group-member-item" key={'group' + groupIndex}>
                  <div className="group-member-item-container">
                    <div className="group-member-img">
                      <img
                        src={
                          groupItem.groupLogo
                            ? groupItem.groupLogo +
                              '?imageMogr2/auto-orient/thumbnail/40x40/format/jpg'
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
                      setChildGroup(groupItem._key, groupItem);
                    }}
                    className={classes.button}
                  >
                    设为子群
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="group-member-team">
        <div className="group-member-title">我的子群</div>
        <div className="group-member-container contact-team-container">
          {sonGroupList.map((groupItem: any, groupIndex: number) => {
            return (
              <div className="group-member-item" key={'son' + groupIndex}>
                <div
                  className="group-member-item-container"
                  style={{ width: '60%' }}
                >
                  <div className="group-member-img">
                    <img
                      src={
                        groupItem.groupLogo
                          ? groupItem.groupLogo +
                            '?imageMogr2/auto-orient/thumbnail/40x40/format/jpg'
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
                      toTargetGroup(groupItem._key);
                    }}
                    className={classes.button}
                  >
                    查看子群
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
    </div>
  );
};
export default SonGroup;
