import React, { useState, useEffect, useRef } from 'react';
import './headerSet.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { setTheme, getThemeBg } from '../../redux/actions/authActions';
import leftArrowPng from '../../assets/img/leftArrow.png';
import set2Png from '../../assets/img/set2.png';
import Switch from '@material-ui/core/Switch';
import _ from 'lodash';
import api from '../../services/api';
import format from '../../components/common/format';
interface HeaderBgProps {
  setMoveState?: any;
  setChooseWallKey?: any;
  headerType?: string;
}

const HeaderBg: React.FC<HeaderBgProps> = (props) => {
  const { setMoveState, setChooseWallKey, headerType } = props;
  const dispatch = useDispatch();
  const theme = useTypedSelector((state) => state.auth.theme);
  const themeBg = useTypedSelector((state) => state.auth.themeBg);
  const themeBgTotal = useTypedSelector((state) => state.auth.themeBgTotal);
  const [bgPage, setBgPage] = useState(1);
  const [] = useState<number[]>([]);
  const canvasRef: React.RefObject<any> = useRef();
  const color1 = [
    '#3C3C3C',
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
  useEffect(() => {
    if (!theme.randomVisible) {
      dispatch(getThemeBg(1));
    }
  }, [theme]);
  const changeBoard = (type: string) => {
    let newTheme = _.cloneDeep(theme);
    newTheme[type] = newTheme[type] ? false : true;
    dispatch(setTheme(newTheme));
  };
  const changeRandomType = (value: string) => {
    let newTheme = _.cloneDeep(theme);
    newTheme.randomType = value;
    dispatch(setTheme(newTheme));
  };
  const changeBg = (type: string, value: any) => {
    let newTheme = _.cloneDeep(theme);
    if (type === 'backgroundImg') {
      let img = new Image();
      img.src = value.url;
      // img.crossOrigin = 'anonymous';
      // 确定图片加载完成后再进行背景图片切换
      img.onload = function () {
        // format.formatColor(canvasRef.current, img);
        newTheme.backgroundImg = value.url;
        newTheme.backgroundColor = '';
        newTheme.grayPencent = value.color ? value.color / 900 : 0;
        // newTheme.grayPencent = 0;
        dispatch(setTheme(newTheme));
        api.auth.viewWallPapers(value._key);
      };
    } else {
      newTheme.backgroundImg = '';
      newTheme.backgroundColor = value;
      newTheme.grayPencent = 0;
      dispatch(setTheme(newTheme));
    }
  };
  const scrollBgLoading = (e: any) => {
    let newPage = bgPage;
    //文档内容实际高度（包括超出视窗的溢出部分）
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let clientHeight = e.target.clientHeight;
    if (
      clientHeight + scrollTop + 1 >= scrollHeight &&
      themeBg.length < themeBgTotal
    ) {
      newPage = newPage + 1;
      dispatch(getThemeBg(newPage));
      setBgPage(newPage);
    }
  };
  return (
    <React.Fragment>
      {theme.randomVisible ? (
        <div
          className="contentHeader-set-item"
          style={{ marginTop: headerType === 'show' ? '0px' : '30px' }}
        >
          <div className="contentHeader-set-item-title">
            <img
              src={set2Png}
              alt=""
              style={{
                width: '15px',
                height: '17px',
                marginRight: '10px',
              }}
            />
            <div>自动更新</div>
          </div>
          <div className="contentHeader-set-item-radio">
            <input
              type="radio"
              name="randomType"
              value={'1'}
              onChange={() => {
                changeRandomType('1');
              }}
              checked={theme.randomType === '1'}
            />
            分钟
            <input
              type="radio"
              name="randomType"
              value={'2'}
              onChange={() => {
                changeRandomType('2');
              }}
              checked={theme.randomType === '2'}
            />
            小时
            <input
              type="radio"
              name="randomType"
              value={'3'}
              onChange={() => {
                changeRandomType('3');
              }}
              checked={theme.randomType === '3'}
            />
            日
          </div>
        </div>
      ) : null}
      <div
        className="bg-title"
        style={{ marginTop: theme.randomVisible ? '10px' : '40px' }}
      >
        颜色
      </div>
      <div className="bg-container">
        {color1.map((color1Item: any, color1Index: number) => {
          return (
            <div
              style={{
                backgroundColor: color1Item,
                border:
                  theme.backgroundColor === color1Item
                    ? '3px solid #87B940'
                    : 'transparent',
              }}
              key={'color1' + color1Index}
              className="bg-item"
              onClick={() => {
                changeBg('backgroundColor', color1Item);
              }}
            >
              {theme.backgroundColor === color1Item ? (
                <div className="bg-point"></div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="bg-title">壁纸</div>
      <div
        className="bg-container"
        style={{ height: 'calc(100% - 225px)', overflow: 'auto' }}
        onScroll={scrollBgLoading}
      >
        {themeBg.map((imgBigArr2Item: any, imgBigArr2Index: number) => {
          return (
            <React.Fragment key={'imgBigArr2' + imgBigArr2Index}>
              {imgBigArr2Item.url ? (
                <div
                  style={{
                    backgroundImage:
                      'url(' +
                      imgBigArr2Item.url +
                      '?imageMogr2/auto-orient/thumbnail/90x)',
                    border:
                      theme.backgroundImg === imgBigArr2Item.url
                        ? '2px solid #87B940'
                        : 'transparent',
                  }}
                  className="bg-item"
                  onClick={() => {
                    changeBg('backgroundImg', imgBigArr2Item);
                    setChooseWallKey(imgBigArr2Item._key);
                  }}
                >
                  {theme.backgroundImg === imgBigArr2Item.url ? (
                    <div className="bg-point"></div>
                  ) : null}
                </div>
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
    </React.Fragment>
  );
};
HeaderBg.defaultProps = {};
export default HeaderBg;
