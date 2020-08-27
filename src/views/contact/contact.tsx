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
import { setHeaderIndex } from '../../redux/actions/commonActions';
import {
  setTargetUserKey,
  getTargetUserInfo,
  // userKeyToGroupKey
} from '../../redux/actions/authActions';

import defaultPersonPng from '../../assets/img/defaultPerson.png';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
import carePng from '../../assets/img/care.png';
import uncarePng from '../../assets/img/uncare.png';
import api from '../../services/api';
export interface ContactProps {
  contactIndex: number;
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
  const classes = useStyles();
  const { contactIndex } = props;
  const [contactArray, setContactArray] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState<any>();
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const memberArray = useTypedSelector((state) => state.member.memberArray);
  const groupArray = useTypedSelector((state) => state.group.groupArray);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  useEffect(() => {
    if (user && user._key) {
      if (!groupArray) {
        dispatch(getGroup(3));
      }
      if (!memberArray) {
        dispatch(getMember(mainGroupKey));
      }

      if (groupArray && contactIndex === 0) {
        setContactArray(groupArray);
      } else if (memberArray && contactIndex === 1) {
        setContactArray(memberArray);
      }
    }
  }, [groupArray, memberArray, user, contactIndex]);
  const toTargetGroup = (groupKey: string, index: number) => {
    dispatch(setGroupKey(groupKey));
    dispatch(getGroupInfo(groupKey));
    dispatch(setHeaderIndex(3));
    setSelectedIndex(index);
  };
  const toTargetUser = (targetUserKey: string, index: number) => {
    console.log(targetUserKey);
    dispatch(setTargetUserKey(targetUserKey));
    // dispatch(userKeyToGroupKey(targetUserKey));
    dispatch(getTargetUserInfo(targetUserKey));
    dispatch(setHeaderIndex(2));
    setSelectedIndex(index);
  };
  const changeCare = (type: number, key: string, status: number) => {
    api.auth.dealCareFriendOrGroup(type, key, status);
  };
  return (
    <div className="contact">
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
                key={key}
                onClick={() => {
                  contactIndex
                    ? toTargetUser(key, index)
                    : toTargetGroup(key, index);
                }}
                // selected={selectedIndex == index}
              >
                <div className="contact-avatar">
                  <img
                    alt={name}
                    src={
                      avatar +
                      '?imageMogr2/auto-orient/thumbnail/80x80/format/jpg'
                    }
                  />
                </div>
                <div>{name}</div>
                {item.isCare ? (
                  <img
                    src={carePng}
                    alt=""
                    className="contact-care-img"
                    onClick={() => {
                      changeCare(1, key, 0);
                    }}
                  />
                ) : (
                  <img
                    src={uncarePng}
                    alt=""
                    className="contact-uncare-img"
                    onClick={() => {
                      changeCare(1, key, 1);
                    }}
                  />
                )}
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
