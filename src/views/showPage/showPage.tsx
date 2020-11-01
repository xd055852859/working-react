import React, { useState, useEffect } from 'react';
import './showPage.css';
import {
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Switch,
} from '@material-ui/core';
import { getSelfTask } from '../../redux/actions/taskActions';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { setTheme } from '../../redux/actions/authActions';
import format from '../../components/common/format';
import traditionalDate from '../../components/common/date';
import moment from 'moment';
import _ from 'lodash';
import MainBoard from '../board/mainBoard';
import Clock from '../../components/clock/clock';
import infoPng from '../../assets/img/info.png';
interface ShowPageProps {
  changeShowType: any;
}

const ShowPage: React.FC<ShowPageProps> = (props) => {
  const { changeShowType } = props;
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const theme = useTypedSelector((state) => state.auth.theme);
  const [nowTime, setNowTime] = useState('');
  const [timeInterval, setTimeInterval] = useState<any>(null);
  const [showState, setShowState] = useState<any>(null);
  const year = moment().year();
  const month = moment().month();
  const day = moment().date();
  const week = moment().day();
  const weekStr = ['日', '一', '二', '三', '四', '五', '六'];
  useEffect(() => {
    let interval: any = null;
    if (user) {
      setNowTime(moment().format('HH:mm'));
      interval = setInterval(() => {
        setNowTime(moment().format('HH:mm'));
      }, 60000);
      // getSocket();
      setTimeInterval(interval);
    }
    return () => {
      if (timeInterval) {
        clearInterval(timeInterval);
      }
    };
  }, [user]);
  const changeRandomType = (e: any) => {
    let newTheme = _.cloneDeep(theme);
    newTheme.randomType = e.target.value;
    dispatch(setTheme(newTheme));
  };
  const changeFinishPercentArr = (e: any, type: string) => {
    console.log(e.target.checked);
    let newTheme = _.cloneDeep(theme);
    if (e.target.checked) {
      newTheme.finishPercentArr.push(type);
    } else {
      let index = _.findIndex(newTheme.finishPercentArr, type);
      newTheme.finishPercentArr.splice(index, 1);
    }
    dispatch(setTheme(newTheme));
    dispatch(
      getSelfTask(
        1,
        user._key,
        '[0, 1]',
        1,
        moment().add(1, 'days').startOf('day').valueOf(),
        1
      )
    );
  };
  const changeBoard = (type: string) => {
    let newTheme = _.cloneDeep(theme);
    newTheme[type] = newTheme[type] ? false : true;
    dispatch(setTheme(newTheme));
  };
  return (
    <div
      onClick={() => {
        setShowState('right');
      }}
      className="showPage"
    >
      <div
        className="showPage"
        style={
          showState === 'left'
            ? {
              animation: 'showLeft 500ms',
              // animationFillMode: 'forwards',
              right: '350px',
            }
            : showState === 'right'
              ? {
                animation: 'showRight 500ms',
                // animationFillMode: 'forwards',
                right: '0px',
              }
              : { right: '0px' }
        }
      >
        <div className="showPage-time">
          {theme.timeShow ? (
            <div className="showPage-time-title">{nowTime}</div>
          ) : (
              <Clock />
            )}

          <div className="showPage-time-subtitle">
            <div>
              {year + '.' + (month + 1) + '.' + day + ' 星期' + weekStr[week]}
            </div>
            {theme.cDayShow ? (<div>
              {' 农历 ' +
                format.formatJq(year, month, day) +
                ' ' +
                traditionalDate.GetLunarDay(moment())[1] +
                traditionalDate.GetLunarDay(moment())[2]}
            </div>) : null}
          </div>
          <Button
            color="primary"
            onClick={(e: any) => {
              window.location.href = window.location.origin + '/';
              // changeShowType();
              e.stopPropagation();
            }}
            style={{ color: '#fff' }}
            variant="contained"
          >
            Working / Today
          </Button>
        </div>
        <div className="showPage-task-container">
          <MainBoard showType="showPage" />
        </div>
        <img
          src={infoPng}
          alt=""
          className="showPage-logo"
          onClick={(e: any) => {
            setShowState('left');
            e.stopPropagation();
          }}
        />
      </div>
      <div
        className="showPage-set"
        style={
          showState === 'left'
            ? {
              animation: 'setLeft 500ms',
              // animationFillMode: 'forwards',
              right: '0px',
            }
            : showState === 'right'
              ? {
                animation: 'setRight 500ms',
                // animationFillMode: 'forwards',
                right: '-350px',
              }
              : { right: '-350px' }
        }
        onClick={(e: any) => {
          e.stopPropagation();
        }}
      >
        <div className="showPage-set-title">
          壁纸设置
          <Switch
            checked={theme.randomVisible ? true : false}
            onChange={() => {
              changeBoard('randomVisible');
            }}
            name="checkedC"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        </div>
        <div className="showPage-set-title">壁纸更新</div>
        <div className="showPage-set-info" style={{ marginLeft: '10px' }}>
          <RadioGroup
            aria-label="gender"
            value={theme.randomType}
            onChange={changeRandomType}
          >
            <FormControlLabel
              value={'0'}
              control={<Radio color="primary" />}
              label={'不更新'}
            />
            <FormControlLabel
              value={'1'}
              control={<Radio color="primary" />}
              label={'分钟'}
            />
            <FormControlLabel
              value={'2'}
              control={<Radio color="primary" />}
              label={'小时'}
            />
            <FormControlLabel
              value={'3'}
              control={<Radio color="primary" />}
              label={'天'}
            />
          </RadioGroup>
        </div>
        <div className="showPage-set-title">任务设置</div>
        <div>
          <Checkbox
            checked={
              theme.finishPercentArr &&
              theme.finishPercentArr.indexOf('1') != -1
            }
            onChange={(e) => {
              changeFinishPercentArr(e, '1');
            }}
            color="primary"
          />
          今日已完成
        </div>
        <div className="showPage-set-title">
          农历显示
          <Switch
            checked={theme.cDayShow ? true : false}
            onChange={() => {
              changeBoard('cDayShow');
            }}
            name="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        </div>
        <div className="showPage-set-title">
          时钟显示
          <Switch
            checked={theme.timeShow ? true : false}
            onChange={() => {
              changeBoard('timeShow');
            }}
            name="checkedB"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        </div>
      </div>
    </div>
  );
};
ShowPage.defaultProps = {};
export default ShowPage;
