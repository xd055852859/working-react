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
import Dialog from '../../components/common/dialog';
import checkPersonPng from '../../assets/img/checkPerson.png';
import defaultPersonPng from '../../assets/img/defaultPerson.png';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
import carePng from '../../assets/img/care.png';
import uncarePng from '../../assets/img/uncare.png';
import api from '../../services/api';
import _ from 'lodash';
import theme from '@amcharts/amcharts4/themes/animated';
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
  const theme = useTypedSelector((state) => state.auth.theme);

  // const theme = useTypedSelector((state) => state.auth.theme);
  useEffect(() => {
    if (user && user._key) {
      if (!groupArray && contactIndex === 0) {
        dispatch(getGroup(3, 1));
        setTimeout(() => {
          dispatch(getGroup(3));
        }, 1000);
        dispatch(getMember(mainGroupKey, 1, 1));
        setTimeout(() => {
          dispatch(getMember(mainGroupKey));
        }, 1000);
      }
      if (groupArray && contactIndex === 0) {
        setContactArray(groupArray);
      } else if (memberArray && contactIndex === 1) {
        setContactArray(memberArray);
      }
    }
  }, [groupArray, memberArray, user, contactIndex]);
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
    dispatch(getGroupInfo(groupKey));
    dispatch(setCommonHeaderIndex(3));
    if (!theme.moveState) {
      dispatch(setMoveState('in'));
    }
    await api.group.visitGroupOrFriend(2, groupKey);
    dispatch(getGroup(3));
  };
  const toTargetUser = async (targetUserKey: string, index: number) => {
    dispatch(getTargetUserInfo(targetUserKey));
    dispatch(setCommonHeaderIndex(2));
    if (!theme.moveState) {
      dispatch(setMoveState('in'));
    }
    await api.group.visitGroupOrFriend(1, targetUserKey);
    dispatch(getMember(mainGroupKey));
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
                ? item.avatar
                : defaultPersonPng
              : item.groupLogo
              ? item.groupLogo
              : defaultGroupPng;
            let key = contactIndex ? item.userId : item._key;
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
                {item.todayTotalTaskNumber && !contactType ? (
                  <div className="contact-right">
                    {/* <div>
                    今日任务:{item.todayTotalTaskNumber},今日工时:
                    {item.todayTotalTaskHours}
                  </div> */}
                    <div
                      className="contanct-time-day"
                      style={{
                        left:
                          parseInt(item.todayTotalTaskNumber) < 10
                            ? '5px'
                            : '3px',
                      }}
                    >
                      {parseInt(item.todayTotalTaskNumber)}
                    </div>
                    <div className="contanct-time"></div>
                    <div
                      className="contanct-time-hour"
                      style={{
                        right:
                          parseInt(item.todayTotalTaskHours) < 1
                            ? '0px'
                            : (parseInt(item.todayTotalTaskHours) + '').length >
                              1
                            ? '5px'
                            : '3px',
                      }}
                    >
                      {parseInt(item.todayTotalTaskHours)}
                    </div>
                  </div>
                ) : null}
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
