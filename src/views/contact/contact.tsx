import React, { useState, useEffect } from 'react';
import './contact.css';
import { Button } from '@material-ui/core';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { setMessage } from '../../redux/actions/commonActions';
import { getMember } from '../../redux/actions/memberActions';
import {
  getGroup,
  setGroupKey,
  getGroupInfo,
} from '../../redux/actions/groupActions';
import {
  setCommonHeaderIndex,
  setMoveState,
} from '../../redux/actions/commonActions';
import {
  // setTargetUserKey,
  getTargetUserInfo,
  // userKeyToGroupKey
} from '../../redux/actions/authActions';
import { setHeaderIndex } from '../../redux/actions/memberActions';
import Dialog from '../../components/common/dialog';
import TimeIcon from '../../components/common/timeIcon';
import Loading from '../../components/common/loading';
import checkPersonPng from '../../assets/img/checkPerson.png';
import defaultPersonPng from '../../assets/img/defaultPerson.png';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
import carePng from '../../assets/img/care.png';
import uncarePng from '../../assets/img/uncare.png';
import contactTree from '../../assets/svg/contactTree.svg';
import contactBook from '../../assets/svg/contactBook.svg';
import computer from '../../assets/svg/computer.svg';
import api from '../../services/api';
import _ from 'lodash';
export interface ContactProps {
  contactIndex: number;
  contactType?: string;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '700px',
      overflow: 'auto',
    },
    item: {
      width: '100%',
      height: '63px',
    },
    title: {
      fontSize: '14px',
    },
  })
);
const Contact: React.FC<ContactProps> = (props) => {
  // const classes = useStyles();
  const { contactIndex, contactType } = props;
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const memberArray = useTypedSelector((state) => state.member.memberArray);
  const groupArray = useTypedSelector((state) => state.group.groupArray);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const [contactArray, setContactArray] = useState([]);
  const [contactSearchInput, setContactSearchInput] = useState('');
  const [cloneGroupKey, setCloneGroupKey] = useState('');
  const [cloneGroupName, setCloneGroupName] = useState('');
  const [cloneGroupVisible, setCloneGroupVisible] = useState(false);
  const [cloneGroupIndex, setCloneGroupIndex] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const theme = useTypedSelector((state) => state.auth.theme);

  // const theme = useTypedSelector((state) => state.auth.theme);
  useEffect(() => {
    if (user && user._key && !groupArray) {
      // dispatch(getGroup(3, 1));
      // setTimeout(() => {
      setLoading(true);
      dispatch(getGroup(3));
      // }, 1000);
      // dispatch(getMember(mainGroupKey, 1, 1));
      // setTimeout(() => {
      dispatch(getMember(mainGroupKey));
      // }, 1000);
    }
  }, [groupArray, user]);

  useEffect(() => {
    if (groupArray && contactIndex === 0) {
      setLoading(false);
      setContactArray(groupArray);
    }
  }, [groupArray, contactIndex]);

  useEffect(() => {
    if (memberArray && contactIndex === 1) {
      setLoading(false);
      setContactArray(memberArray);
    }
  }, [memberArray, contactIndex]);

  useEffect(() => {
    if (contactSearchInput === '') {
      if (groupArray && contactIndex === 0) {
        setContactArray(groupArray);
      } else if (memberArray && contactIndex === 1) {
        setContactArray(memberArray);
      }
    }
  }, [contactSearchInput]);
  const toTargetGroup = async (groupKey: string, index: number) => {
    dispatch(setGroupKey(groupKey));
    // dispatch(getGroupInfo(groupKey));
    dispatch(setCommonHeaderIndex(3));
    if (!theme.moveState) {
      dispatch(setMoveState('in'));
    }
    await api.group.visitGroupOrFriend(2, groupKey);
    if (contactType === 'header') {
      dispatch(getGroup(3));
    }
  };
  const toTargetUser = async (targetUserKey: string, index: number) => {
    dispatch(getTargetUserInfo(targetUserKey));
    dispatch(setCommonHeaderIndex(2));
    if (!theme.moveState) {
      dispatch(setMoveState('in'));
    }
    await api.group.visitGroupOrFriend(1, targetUserKey);
    if (contactType === 'header') {
      dispatch(getMember(mainGroupKey));
    }
    //
  };
  const changeCare = (
    e: any,
    type: number,
    key: string,
    status: number,
    index: number
  ) => {
    e.stopPropagation();
    let newContactArray: any = _.cloneDeep(contactArray);
    api.auth.dealCareFriendOrGroup(type, key, status);
    newContactArray[index].isCare = status === 1 ? true : false;
    setContactArray(newContactArray);
  };
  const searchGroup = (input?: string) => {
    let newContactArray = _.cloneDeep(groupArray);
    let searchInput = input ? input : contactSearchInput;
    newContactArray = newContactArray.filter((item: any, index: number) => {
      return (
        item.groupName &&
        item.groupName.toUpperCase().indexOf(searchInput.toUpperCase()) !== -1
      );
    });
    setContactArray(newContactArray);
  };
  const cloneGroup = async () => {
    let cloneRes: any = await api.group.cloneGroup(
      cloneGroupKey,
      cloneGroupName + '_副本'
    );
    if (cloneRes.msg === 'OK') {
      dispatch(setMessage(true, '克隆群成功', 'success'));
      dispatch(setGroupKey(cloneRes.result));
      dispatch(getGroupInfo(cloneRes.result));
      dispatch(setCommonHeaderIndex(3));
      if (!theme.moveState) {
        dispatch(setMoveState('in'));
      }
      await api.group.visitGroupOrFriend(2, cloneRes.result);
      dispatch(getGroup(3));
    } else {
      dispatch(setMessage(true, cloneRes.msg, 'error'));
    }
  };
  return (
    <div
      className="contact"
      style={{ height: contactType ? '100%' : 'calc(100% - 60px)' }}
    >
      {loading ? <Loading loadingWidth="70px" loadingHeight="70px" /> : null}
      {contactType && contactIndex === 0 ? (
        <div className="contact-search">
          <input
            type="text"
            value={contactSearchInput}
            onChange={(e: any) => {
              setContactSearchInput(e.target.value);
              searchGroup(e.target.value);
            }}
            className="contact-search-input"
            placeholder="请输入群名"
            onKeyDown={(e: any) => {
              if (e.keyCode === 13) {
                searchGroup();
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              searchGroup();
            }}
            className="contact-search-button"
          >
            搜索
          </Button>
        </div>
      ) : null}
      {contactArray && contactArray.length > 0
        ? contactArray.map((item: any, index: number) => {
            let name = contactIndex ? item.nickName : item.groupName;
            let avatar = contactIndex
              ? item.avatar
                ? item.avatar + '?imageMogr2/auto-orient/thumbnail/80x'
                : defaultPersonPng
              : item.groupLogo
              ? item.groupLogo + '?imageMogr2/auto-orient/thumbnail/80x'
              : defaultGroupPng;
            let key = contactIndex ? item.userId : item._key;
            let onlineColor =
              item.onlineStatus === 'online'
                ? '#7ED321'
                : item.onlineStatus === 'busy'
                ? '#EA3836'
                : item.onlineStatus === 'away'
                ? '#F5A623'
                : '#B3B3B3';
            return (
              <div
                className="contact-item"
                key={'contact' + index}
                onClick={() => {
                  if (contactType === 'create') {
                    setCloneGroupKey(key);
                    setCloneGroupName(name);
                    setCloneGroupIndex(index);
                    setCloneGroupVisible(true);
                    // ;
                  } else {
                    contactIndex
                      ? toTargetUser(key, index)
                      : toTargetGroup(key, index);
                  }
                }}
                style={
                  cloneGroupIndex === index
                    ? { backgroundColor: '#f0f0f0' }
                    : {}
                }
              >
                <div className="contact-left">
                  <div className="contact-avatar">
                    <img alt={name} src={avatar} />
                  </div>
                  {contactIndex ? (
                    <div
                      className="contact-online"
                      style={{ backgroundColor: onlineColor }}
                    ></div>
                  ) : null}
                  <div
                    className="contact-left-title"
                    style={
                      contactType ? { maxWidth: '90%' } : { maxWidth: '75%' }
                    }
                  >
                    {name}
                  </div>
                  {!contactType ? (
                    item.isCare ? (
                      <img
                        src={carePng}
                        alt=""
                        className="contact-care-img"
                        onClick={(e) => {
                          changeCare(
                            e,
                            contactIndex === 0 ? 2 : 1,
                            key,
                            2,
                            index
                          );
                        }}
                      />
                    ) : (
                      <img
                        src={uncarePng}
                        alt=""
                        className="contact-uncare-img"
                        onClick={(e) => {
                          changeCare(
                            e,
                            contactIndex === 0 ? 2 : 1,
                            key,
                            1,
                            index
                          );
                        }}
                      />
                    )
                  ) : null}
                </div>
                <div  className="contact-icon-right">
                  {contactType === 'create' && cloneGroupIndex === index ? (
                    <img
                      src={checkPersonPng}
                      alt=""
                      style={{
                        width: '20px',
                        height: '12px',
                      }}
                    ></img>
                  ) : null}
                  {!contactType && item.knowledgeBaseNodeKey ? (
                    <img
                      src={contactBook}
                      alt=""
                      style={{
                        width: '14px',
                        height: '17px',
                        marginRight: '5px',
                      }}
                      onClick={() => {
                        dispatch(setHeaderIndex(9));
                      }}
                    ></img>
                  ) : null}
                  {!contactType && item.isHasKnowledge ? (
                    <img
                      src={contactTree}
                      alt=""
                      style={{
                        width: '18px',
                        height: '17px',
                        marginRight: '5px',
                      }}
                      onClick={() => {
                        console.log('>>>');
                        dispatch(setHeaderIndex(11));
                      }}
                    ></img>
                  ) : null}
                  {item.onlineStatus === 'online' && !contactType ? (
                    <img
                      src={computer}
                      alt=""
                      style={{
                        width: '20px',
                        height: '17px',
                        marginRight: '5px',
                      }}
                    ></img>
                  ) : null}
                  {item.todayTotalTaskNumber && !contactType ? (
                    <TimeIcon
                      timeHour={Math.ceil(item.todayTotalTaskHours)}
                      timeDay={Math.ceil(item.todayTotalTaskNumber)}
                    />
                  ) : (
                    <div style={{ width: '24px' }}></div>
                  )}
                </div>
              </div>
            );
          })
        : null}

      <Dialog
        visible={cloneGroupVisible}
        onClose={() => {
          setCloneGroupVisible(false);
        }}
        onOK={() => {
          setCloneGroupVisible(false);
          cloneGroup();
        }}
        title={'克隆群'}
        dialogStyle={{ width: '400px', height: '200px' }}
      >
        <div className="dialog-onlyTitle">是否克隆群:{cloneGroupName}</div>
      </Dialog>
    </div>
  );
};
Contact.defaultProps = {
  contactIndex: 0,
};
export default Contact;
