import React, { useState, useEffect } from 'react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import Switch from '@material-ui/core/Switch';
import './contentHeader.css';
import Dialog from '../../components/common/dialog';
import { setTheme } from '../../redux/actions/authActions';
import boardPng from '../../assets/img/board.png';
import DropMenu from '../../components/common/dropMenu';
import _ from 'lodash';
import set1Png from '../../assets/img/set1.png';
import set2Png from '../../assets/img/set2.png';
import set3Png from '../../assets/img/set3.png';
import bgImg from '../../assets/img/bgImg.png';
interface ContentHeaderProps {}

const ContentHeader: React.FC<ContentHeaderProps> = (prop) => {
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const theme = useTypedSelector((state) => state.auth.theme);
  const [avatar, setAvatar] = useState<any>(null);
  const [contentSetVisilble, setContentSetVisilble] = useState(false);
  const [bgVisible, setBgVisible] = useState(false);
  const [avatarShow, setAvatarShow] = useState(false);
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
  useEffect(() => {
    if (user) {
      setAvatar(user.profile.avatar);
    }
  }, [user]);
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
  return (
    <div
      className="contentHeader"
      onMouseLeave={() => {
        setContentSetVisilble(false);
        setAvatarShow(false);
      }}
    >
      <img src={boardPng} alt="" className="contentHeader-logo" />
      <div className="contentHeader-set">
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
            top: '40px',
            left: '-220px',
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
            <div className="contentHeader-set-item-title">
              <img
                src={bgImg}
                alt=""
                style={{ width: '15px', height: '17px', marginRight: '10px' }}
              />
              <div>壁纸设置</div>
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
    </div>
  );
};
export default ContentHeader;
