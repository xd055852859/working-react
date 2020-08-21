import React, { useState, useEffect } from 'react';
import './contact.css';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import VitalityIcon from '../../components/vitalityIcon/vitalityIcon';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { getMember } from '../../redux/actions/memberActions';
import { getGroup,setGroupKey } from '../../redux/actions/groupActions';
import { setHeaderIndex } from '../../redux/actions/authActions';
export interface ContactProps {
  contactIndex: number;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height:'700px',
      overflow:'auto'
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
  useEffect(() => {
    if (user && user._key) {
      if (!groupArray) {
        dispatch(getGroup(3));
      } else {
        if (contactIndex === 0) {
          setContactArray(groupArray);
        }
      }
    }
  }, [groupArray, user, contactIndex]);
  useEffect(() => {
    if (user && user._key) {
      if (!memberArray) {
        console.log('memberArray', memberArray);
        dispatch(getMember('647282223'));
      } else {
        if (contactIndex === 1) {
          setContactArray(memberArray);
        }
      }
    }
  }, [memberArray, user, contactIndex]);
  const toTargetGroup = (groupKey:string,index:number) => {
    dispatch(setGroupKey(groupKey));
    dispatch(setHeaderIndex(3));
    setSelectedIndex(index)
  };
  return (
    <List component="nav" className={classes.root} aria-label="contacts">
      {contactArray && contactArray.length > 0
        ? contactArray.map((item: any, index: number) => {
            let name = contactIndex ? item.nickName : item.groupName;
            let avatar = contactIndex ? item.avatar : item.groupLogo;
            let key = contactIndex ? item.userId : item._key;
            return (
              <ListItem
                button
                className={classes.item}
                key={key}
                onClick={()=>{toTargetGroup(key,index)}}
                selected={selectedIndex == index}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={name}
                    src={
                      avatar +
                      '?imageMogr2/auto-orient/thumbnail/80x80/format/jpg'
                    }
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <React.Fragment>
                      <span className={classes.title}>{name}</span>
                    </React.Fragment>
                  }
                  secondary={
                    <React.Fragment>
                      <VitalityIcon
                        vitalityDirection={'horizontal'}
                        vitalityNum={item.energyValueTotal}
                      />
                    </React.Fragment>
                  }
                />
              </ListItem>
            );
          })
        : null}
    </List>
  );
};
Contact.defaultProps = {
  contactIndex: 0,
};
export default Contact;
