import React, { useState, useEffect } from 'react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { TextField, Button } from '@material-ui/core';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import Switch from '@material-ui/core/Switch';
import Dialog from '../common/dialog';
import DropMenu from '../common/dropMenu';
import ClockIn from '../clockIn/clockIn';
import Task from '../task/task';
import { setTheme } from '../../redux/actions/authActions';
import { setMessage } from '../../redux/actions/commonActions';
import { getGroupTask } from '../../redux/actions/taskActions';
import './headerSet.css';
import set1Png from '../../assets/img/set1.png';
import set2Png from '../../assets/img/set2.png';
import set3Png from '../../assets/img/set3.png';
import bgImg from '../../assets/img/bgImg.png';
import clockInPng from '../../assets/img/clockIn.png';
import searchPng from '../../assets/img/headerSearch.png';
import addPng from '../../assets/img/taskAdd.png';
import downArrowbPng from '../../assets/img/downArrowb.png';
import defaultGroupPng from '../../assets/img/defaultGroup.png';

import api from '../../services/api';
interface HeaderSetProps {}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      backgroundColor: '#17B881',
      padding: '6 16px',
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
const HeaderSet: React.FC<HeaderSetProps> = (prop) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useTypedSelector((state) => state.auth.user);
  const theme = useTypedSelector((state) => state.auth.theme);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const groupArray = useTypedSelector((state) => state.group.groupArray);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const [avatar, setAvatar] = useState<any>(null);
  const [contentSetVisilble, setContentSetVisilble] = useState(false);
  const [bgVisible, setBgVisible] = useState(false);
  const [clockInVisible, setClockInVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [avatarShow, setAvatarShow] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchTaskList, setSearchTaskList] = useState([]);
  const [groupIndex, setGroupIndex] = useState(0);
  const [groupVisible, setGroupVisible] = useState(false);
  const [labelIndex, setLabelIndex] = useState(0);
  const [labelVisible, setLabelVisible] = useState(false);
  const [labelArray, setLabelArray] = useState<any>([]);
  const [addInput, setAddInput] = useState('');
  const color1 = [
    '#46558C',
    '#9C5D9E',
    '#C14C6B',
    '#C14F4B ',
    '#D19235',
    '#29835D',
    '#24807B',
    '#68767F',
  ];
  const color2 = [
    '#DFEDF9',
    '#F2E7F9',
    '#FFE3E8',
    '#F9E8DF',
    '#FAE8CD',
    '#D5F2E6',
    '#D2F1F1',
    '#E7ECF0',
  ];
  const imgBigArr2 = [
    'https://cdn-icare.qingtime.cn/1596679428976_8Big@1x.png',
    'https://cdn-icare.qingtime.cn/1596679446272_9Big@1x.png',
    'https://cdn-icare.qingtime.cn/1596679461595_10Big@1x.png',
    // "https://cdn-icare.qingtime.cn/1596679637933_11Big@1x.png",
    'https://cdn-icare.qingtime.cn/1596679674511_12Big@1x.png',
    'https://cdn-icare.qingtime.cn/1596679728933_画板.jpg',
    'https://cdn-icare.qingtime.cn/1596679825925_画板备份2.jpg',
    'https://cdn-icare.qingtime.cn/1596679850655_画板备份3.jpg',
    'https://cdn-icare.qingtime.cn/1596679867626_画板备份4.jpg',
    'https://cdn-icare.qingtime.cn/1596679885918_画板备份5.jpg',
    'https://cdn-icare.qingtime.cn/1596679903471_画板备份6.jpg',
    'https://cdn-icare.qingtime.cn/1596679925993_画板备份7.jpg',
    'https://cdn-icare.qingtime.cn/1596679943102_画板备份8.jpg',
    // "https://cdn-icare.qingtime.cn/1596679963941_画板备份9.jpg",
    'https://cdn-icare.qingtime.cn/1596679987203_画板备份10.jpg',
    'https://cdn-icare.qingtime.cn/1596680027535_画板备份11.jpg',
    'https://cdn-icare.qingtime.cn/1596680077694_画板备份12.jpg',
    'https://cdn-icare.qingtime.cn/1596680095898_画板备份13.jpg',
    'https://cdn-icare.qingtime.cn/1596680119545_画板备份14.jpg',
    'https://cdn-icare.qingtime.cn/1596679772476_画板备份.jpg',
    // imgBig26
  ];
  const limit = 10;
  useEffect(() => {
    if (user) {
      setAvatar(user.profile.avatar);
    }
  }, [user]);
  useEffect(() => {
    if (groupArray && groupArray.length > 0) {
      getLabelArray(groupArray[0]._key);
    }
  }, [groupArray]);
  const changeBoard = (type: string) => {
    let newTheme = _.cloneDeep(theme);
    newTheme[type] = newTheme[type] ? false : true;
    dispatch(setTheme(newTheme));
  };
  const changeBg = (type: string, value: string) => {
    let newTheme = _.cloneDeep(theme);
    if (type == 'backgroundImg') {
      newTheme.backgroundImg = value;
      newTheme.backgroundColor = '';
    } else {
      newTheme.backgroundImg = '';
      newTheme.backgroundColor = value;
    }
    dispatch(setTheme(newTheme));
  };
  const searchTask = () => {
    if (searchInput != '') {
      // this.getSearchList({ param: { name: this.searchInput }, type: 1 })
      getTaskSearch(page);
    }
  };
  const getTaskSearch = async (page: number) => {
    let newSearchTaskList: any = [];
    if (page == 1) {
      setSearchTaskList([]);
    } else {
      newSearchTaskList = _.cloneDeep(searchTaskList);
    }
    let res: any = await api.task.getCardSearch(page, limit, searchInput);
    if (res.msg == 'OK') {
      newSearchTaskList.push(...res.result);
      setSearchTaskList(newSearchTaskList);
      setTotal(res.totalNumber);
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
      searchTaskList.length < total
    ) {
      newPage = newPage + 1;
      setPage(newPage);
      getTaskSearch(newPage);
    }
  };
  const getLabelArray = async (groupKey: string) => {
    let newLabelArray = [
      { _key: null, cardLabelName: 'ToDo', executorKey: user._key },
    ];
    let labelRes: any = await api.group.getLabelInfo(groupKey);
    if (labelRes.msg == 'OK') {
      newLabelArray.push(...labelRes.result);
      setLabelArray(newLabelArray);
    } else {
      dispatch(setMessage(true, labelRes.msg, 'error'));
    }
  };
  const addLabelTask = async () => {
    let addTaskRes: any = await api.task.addTask(
      groupArray[groupIndex]._key,
      groupArray[groupIndex].role,
      labelArray[labelIndex]._key,
      labelArray[labelIndex].executorKey,
      addInput
    );
    if (addTaskRes.msg == 'OK') {
      setAddVisible(false);
      setAddInput('');
      dispatch(setMessage(true, '新增成功', 'success'));
      if (headerIndex == 3) {
        dispatch(getGroupTask(3, groupKey, '[0,1,2]'));
      }
    } else {
      dispatch(setMessage(true, addTaskRes.msg, 'error'));
    }
  };
  return (
    <React.Fragment>
      <div
        className="contentHeader-set"
        onMouseLeave={() => {
          setContentSetVisilble(false);
          setAvatarShow(false);
          setClockInVisible(false);
        }}
      >
        <img
          src={addPng}
          alt=""
          style={{
            width: '40px',
            height: '40px',
            marginRight: '15px',
            cursor: 'pointer',
          }}
          onClick={() => {
            setAddVisible(true);
          }}
        />
        <img
          src={searchPng}
          alt=""
          style={{
            width: '40px',
            height: '40px',
            marginRight: '15px',
            cursor: 'pointer',
          }}
          onClick={() => {
            setSearchVisible(true);
          }}
        />
        <img
          src={clockInPng}
          alt=""
          style={{
            width: '40px',
            height: '40px',
            marginRight: '15px',
            cursor: 'pointer',
          }}
          onClick={() => {
            setClockInVisible(true);
          }}
        />
        <DropMenu
          visible={clockInVisible}
          dropStyle={{
            width: '400px',
            maxHeight: '600px',
            top: '65px',
            left: '-320px',
          }}
          onClose={() => {
            setClockInVisible(false);
          }}
          title={'打卡中心'}
        >
          <ClockIn />
        </DropMenu>
        <div
          className="contentHeader-avatar-info"
          onClick={() => {
            setContentSetVisilble(true);
            setAvatarShow(true);
          }}
        >
          <div
            className="contentHeader-avatar"
            style={
              avatarShow
                ? {
                    animation: 'avatarSmall 500ms',
                    // animationFillMode: 'forwards',
                    width: '30px',
                    height: '30px',
                  }
                : {
                    animation: 'avatarBig 500ms',
                    // animationFillMode: 'forwards',
                    width: '40px',
                    height: '40px',
                  }
            }
          >
            <img src={avatar} alt="" />
          </div>
          <div className="contentHeader-avatar-bg"></div>
        </div>
        <DropMenu
          visible={contentSetVisilble}
          dropStyle={{
            width: '260px',
            height: '370px',
            top: '65px',
            left: '-150px',
          }}
          onClose={() => {
            setContentSetVisilble(false);
            setAvatarShow(false);
          }}
        >
          <div className="contentHeader-set-title">
            <div className="contentHeader-set-avatar">
              <img src={avatar} alt="" />
            </div>
          </div>
          <div
            className="contentHeader-set-item"
            onClick={() => {
              setBgVisible(true);
            }}
          >
            <div className="contentHeader-set-item-title contentHeader-set-item-bg">
              <div className="contentHeader-set-item-bg-info">
                <img
                  src={bgImg}
                  alt=""
                  style={{ width: '15px', height: '17px', marginRight: '10px' }}
                />
                <div>壁纸设置</div>
              </div>
              <div
                className="bg-item"
                style={
                  theme.backgroundImg
                    ? { backgroundImage: 'url(' + theme.backgroundImg + ')' }
                    : { backgroundColor: theme.backgroundColor }
                }
              ></div>
            </div>
          </div>
          <div className="contentHeader-set-item">
            <div className="contentHeader-set-item-title">
              <img
                src={set1Png}
                alt=""
                style={{ width: '15px', height: '17px', marginRight: '10px' }}
              />
              <div>提醒</div>
            </div>
            <div>
              <Switch
                checked={theme.messageVisible ? true : false}
                onChange={() => {
                  changeBoard('messageVisible');
                }}
                name="checkedA"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            </div>
          </div>
          <div className="contentHeader-set-item">
            <div className="contentHeader-set-item-title">
              <img
                src={set2Png}
                alt=""
                style={{ width: '15px', height: '14px', marginRight: '10px' }}
              />
              <div>我的任务</div>
            </div>
            <div>
              <Switch
                checked={theme.mainVisible ? true : false}
                onChange={() => {
                  changeBoard('mainVisible');
                }}
                name="checkedB"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            </div>
          </div>
          <div className="contentHeader-set-item">
            <div className="contentHeader-set-item-title">
              <img
                src={set3Png}
                alt=""
                style={{ width: '20px', height: '15px', marginRight: '5px' }}
              />
              <div>协作看板</div>
            </div>
            <div>
              <Switch
                checked={theme.memberVisible ? true : false}
                onChange={() => {
                  changeBoard('memberVisible');
                }}
                name="checkedC"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            </div>
          </div>
        </DropMenu>
      </div>
      <Dialog
        visible={addVisible}
        onClose={() => {
          setAddVisible(false);
        }}
        onOK={() => {
          addLabelTask();
        }}
        title={'跨群添加'}
        dialogStyle={{ width: '400px', height: '250px', overflow: 'visible' }}
      >
        <div className="headerSet-search-title">
          <TextField
            // required
            id="outlined-basic"
            variant="outlined"
            label="添加任务"
            className={classes.input}
            style={{ width: '100%' }}
            value={addInput}
            onChange={(e) => {
              setAddInput(e.target.value);
            }}
          />
        </div>
        {labelArray && labelArray.length > 0 ? (
          <div className="addTask-container">
            <div
              className="addTask-item"
              onClick={() => {
                setGroupVisible(true);
              }}
            >
              <div className="addTask-avatar">
                <img
                  src={
                    groupArray[groupIndex].groupLogo
                      ? groupArray[groupIndex].groupLogo
                      : defaultGroupPng
                  }
                  alt=""
                />
              </div>
              <div>{groupArray[groupIndex].groupName}</div>
              <img src={downArrowbPng} alt="" className="addTask-logo" />
              <DropMenu
                visible={groupVisible}
                dropStyle={{
                  width: '300px',
                  height: '250px',
                  top: '50px',
                  overflow: 'auto',
                }}
                onClose={() => {
                  setGroupVisible(false);
                }}
                title={'选择项目'}
              >
                <React.Fragment>
                  {groupArray.map((item: any, index: number) => {
                    return (
                      <div
                        className="chooseItem"
                        onClick={() => {
                          setGroupIndex(index);
                          getLabelArray(item._key);
                        }}
                        key={'group' + index}
                      >
                        <div className="addTask-avatar">
                          <img
                            src={
                              item.groupLogo ? item.groupLogo : defaultGroupPng
                            }
                            alt=""
                          />
                        </div>
                        <div>{item.groupName}</div>
                      </div>
                    );
                  })}
                </React.Fragment>
              </DropMenu>
            </div>
            <div
              className="addTask-item"
              onClick={() => {
                setLabelVisible(true);
              }}
            >
              <div>{labelArray[labelIndex].cardLabelName}</div>
              <img src={downArrowbPng} alt="" className="addTask-logo" />
              <DropMenu
                visible={labelVisible}
                dropStyle={{
                  width: '100%',
                  height: '250px',
                  top: '50px',
                  overflow: 'auto',
                }}
                onClose={() => {
                  setLabelVisible(false);
                }}
                title={'选择频道'}
              >
                <React.Fragment>
                  {labelArray.map((item: any, index: number) => {
                    return (
                      <div
                        className="chooseItem"
                        onClick={() => {
                          setLabelIndex(index);
                        }}
                        key={'label' + index}
                      >
                        <div style={{ textAlign: 'center', width: '100%' }}>
                          {item.cardLabelName}
                        </div>
                      </div>
                    );
                  })}
                </React.Fragment>
              </DropMenu>
            </div>
          </div>
        ) : null}
      </Dialog>
      <Dialog
        visible={searchVisible}
        onClose={() => {
          setSearchVisible(false);
        }}
        footer={false}
        title={'搜索中心'}
        dialogStyle={{ width: '370px', height: '500px' }}
      >
        <div className="headerSet-search-title">
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
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              searchTask();
            }}
            style={{ marginLeft: '10px' }}
            className={classes.button}
          >
            搜索
          </Button>
        </div>
        <div className="headerSet-search-info" onScroll={scrollSearchLoading}>
          {searchTaskList.map((taskItem: any, taskIndex: number) => {
            return <Task taskItem={taskItem} showGroupName={true} />;
          })}
        </div>
      </Dialog>
      <Dialog
        visible={bgVisible}
        onClose={() => {
          setBgVisible(false);
        }}
        footer={false}
        title={'壁纸设置'}
        dialogStyle={{ width: '360px', height: '500px' }}
      >
        <div className="bg-title">颜色</div>
        <div className="bg-container">
          {color1.map((color1Item: any, color1Index: number) => {
            return (
              <div
                style={{ backgroundColor: color1Item }}
                key={'color1' + color1Index}
                className="bg-item"
                onClick={() => {
                  changeBg('backgroundColor', color1Item);
                }}
              ></div>
            );
          })}
        </div>
        <div className="bg-title">壁纸</div>
        <div className="bg-container">
          {imgBigArr2.map((imgBigArr2Item: any, imgBigArr2Index: number) => {
            return (
              <div
                style={{
                  backgroundImage:
                    'url(' +
                    imgBigArr2Item +
                    '?imageMogr2/auto-orient/thumbnail/80x80/format/jpg)',
                }}
                key={'imgBigArr2' + imgBigArr2Index}
                className="bg-item"
                onClick={() => {
                  changeBg('backgroundImg', imgBigArr2Item);
                }}
              ></div>
            );
          })}
        </div>
      </Dialog>
    </React.Fragment>
  );
};
export default HeaderSet;
