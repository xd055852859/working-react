import React, { useState, useEffect } from 'react';
import './contact.css';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../redux/reducer/RootState';
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

import defaultPersonPng from '../../assets/img/defaultPerson.png';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
import carePng from '../../assets/img/care.png';
import uncarePng from '../../assets/img/uncare.png';
import api from '../../services/api';
import _ from 'lodash';
export interface ContactProps {
  contactIndex: number;
  contactType?: boolean;
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
  const [contactArray, setContactArray] = useState([]);
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const memberArray = useTypedSelector((state) => state.member.memberArray);
  const groupArray = useTypedSelector((state) => state.group.groupArray);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  // const theme = useTypedSelector((state) => state.auth.theme);
  useEffect(() => {
    if (user && user._key) {
      if (!groupArray && contactIndex === 0) {
        dispatch(getGroup(3, 1));
        setTimeout(() => {
          dispatch(getGroup(3));
        }, 2000);
        dispatch(getMember(mainGroupKey, 2));
      }
      if (groupArray && contactIndex === 0) {
        setContactArray(groupArray);
      } else if (memberArray && contactIndex === 1) {
        setContactArray(memberArray);
      }
    }
  }, [groupArray, user, contactIndex]);
  const toTargetGroup = async (groupKey: string, index: number) => {
    dispatch(setGroupKey(groupKey));
    dispatch(getGroupInfo(groupKey));
    dispatch(setCommonHeaderIndex(3));
    dispatch(setMoveState('in'));
    await api.group.visitGroupOrFriend(2, groupKey);
    dispatch(getGroup(3));
  };
  const toTargetUser = async (targetUserKey: string, index: number) => {
    dispatch(getTargetUserInfo(targetUserKey));
    dispatch(setCommonHeaderIndex(2));
    dispatch(setMoveState('in'));
    await api.group.visitGroupOrFriend(1, targetUserKey);
    dispatch(getMember(mainGroupKey, 2));
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
  return (
    <div
      className="contact"
      style={{ height: contactType ? '100%' : 'calc(100% - 60px)' }}
    >
      {contactArray && contactArray.length > 0
        ? contactArray.map((item: any, index: number) => {
            let name = contactIndex ? item.nickName : item.groupName;
            let avatar = contactIndex
              ? item.avatar
                ? item.avatar +
                  '?imageMogr2/auto-orient/thumbnail/80x80/format/jpg'
                : defaultPersonPng
              : item.groupLogo
              ? item.groupLogo +
                '?imageMogr2/auto-orient/thumbnail/80x80/format/jpg'
              : defaultGroupPng;
            let key = contactIndex ? item.userId : item._key;
            return (
              <div
                className="contact-item"
                key={'contact' + index}
                onClick={() => {
                  contactIndex
                    ? toTargetUser(key, index)
                    : toTargetGroup(key, index);
                }}
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
                {item.todayTotalTaskNumber && !contactType ? (
                  <div className="contact-right">
                    {/* <div>
                    今日任务:{item.todayTotalTaskNumber},今日工时:
                    {item.todayTotalTaskHours}
                  </div> */}
                    <div
                      className="contanct-time-day"
                      style={{
                        left: item.todayTotalTaskNumber < 10 ? '5px' : '3px',
                      }}
                    >
                      {item.todayTotalTaskNumber}
                    </div>
                    <div className="contanct-time"></div>
                    <div
                      className="contanct-time-hour"
                      style={{
                        right:
                          item.todayTotalTaskHours < 1
                            ? '0px'
                            : item.todayTotalTaskHours > 10
                            ? '7px'
                            : '5px',
                      }}
                    >
                      {item.todayTotalTaskHours}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })
        : null}
    </div>
  );
};
Contact.defaultProps = {
  contactIndex: 0,
};
export default Contact;
