import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import './tabs.css';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';
import { useTypedSelector } from '../../redux/reducer/RootState';
import _ from 'lodash';
import searchPng from '../../assets/img/search.png';
import Contact from '../contact/contact';
import Dialog from '../../components/common/dialog';
import api from '../../services/api';
import { setMessage } from '../../redux/actions/commonActions';
import { getMember } from '../../redux/actions/memberActions';
// import { Theme, makeStyles } from '@material-ui/core/styles';

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
  })
);
export interface HomeTabProps {}
const HomeTab: React.FC<HomeTabProps> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  // const classes = useStyles();
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const [contactIndex, setContactIndex] = React.useState(0);
  const [searchVisible, setSearchVisible] = React.useState(false);
  const [searchList, setSearchList] = React.useState<any>([]);
  const [searchInput, setSearchInput] = React.useState<any>([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const limit = 10;
  const changeInput = (e: any) => {
    setSearchInput(e.target.value);
  };
  const searchMsg = () => {
    if (searchInput != '') {
      if (contactIndex == 0) {
        getSearchPerson(page, limit);
      } else if (contactIndex == 1) {
        getSearchGroup(page, limit);
      }
    }
  };
  const getSearchPerson = async (page: number, limit: number) => {
    let newSearchList = _.cloneDeep(searchList);
    let res: any = await api.member.searchUserNew(searchInput, page, limit);
    if (res.msg == 'OK') {
      newSearchList.push(...res.result);
      setSearchList(newSearchList);
      setTotal(res.totalNumber);
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };
  const getSearchGroup = async (page: number, limit: number) => {
    let newSearchList = _.cloneDeep(searchList);
    let res: any = await api.member.searchGroupNew(searchInput, page, limit);
    if (res.msg == 'OK') {
      newSearchList.push(...res.result);
      setSearchList(newSearchList);
      setTotal(res.totalNumber);
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };
  const addMember = async (searchItem: any, searchIndex: number) => {
    let newSearchList = _.cloneDeep(searchList);
    let newTotal = total;
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
      newSearchList.splice(searchIndex, 1);
      setSearchList(newSearchList);
      newTotal = newTotal - 1;
      setTotal(newTotal);
      dispatch(getMember(mainGroupKey));
    } else {
      dispatch(setMessage(true, memberRes.msg, 'error'));
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
      </div>
      <Contact contactIndex={contactIndex} />
      <Dialog
        visible={searchVisible}
        onClose={() => {
          setSearchVisible(false);
        }}
        title={'搜索'}
        dialogStyle={{ width: '600px', height: '500px' }}
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
              发布
            </Button>
          </div>
          <div>
            {searchList.map((searchItem: any, searchIndex: number) => {
              return (
                <div key={'search' + searchIndex} className="personMember-item">
                  <div
                    style={{ width: '100%', height: '100%', display: 'flex' }}
                  >
                    <div className="personMember-item-title">
                      <div className="personMember-item-avatar">
                        <img src={searchItem.avatar} alt="" />
                      </div>
                      <div>{searchItem.nickName}</div>
                    </div>
                    {!searchItem.isMyMainGroupMember ? (
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
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Dialog>
    </div>
  );
};
export default HomeTab;
