import React, { useState, useEffect, useRef } from 'react';
import './content.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import api from '../../services/api';
import moment from 'moment';
import { Tabs, Checkbox } from 'antd';
const { TabPane } = Tabs;
import _ from 'lodash';

import { setMessage } from '../../redux/actions/commonActions';

import IconFont from '../../components/common/iconFont';
import DropMenu from '../../components/common/dropMenu';
import MemberBoard from '../board/memberBoard';
import MainBoard from '../board/mainBoard';
import FileList from '../../components/fileList/fileList';
import FileInfo from '../../components/fileInfo/fileInfo';
import MessageBoard from '../board/messageBoard';
import ContentHeader from './contentHeader';

export interface ContentProps {}
const Content: React.FC<ContentProps> = (props) => {
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const theme = useTypedSelector((state) => state.auth.theme);
  const fileInfo = useTypedSelector((state) => state.common.fileInfo);
  const fileVisible = useTypedSelector((state) => state.common.fileVisible);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const [nowTime, setNowTime] = useState<any>([]);
  const [prompt, setPrompt] = useState();
  const [tabsetVisible, setTabsetVisible] = useState(false);
  const [contentConfig, setContentConfig] = useState<any>({
    mainCheck: true,
    lastCheck: true,
    fileCheck: true,
    memberCheck: true,
    groupCheck: true,
  });
  let timerRef = useRef<any>(null);
  let unDistory = useRef<any>(null);
  let config = useRef<any>(null);
  unDistory.current = true;
  useEffect(() => {
    if (localStorage.getItem('config')) {
      //@ts-ignore
      setContentConfig(JSON.parse(localStorage.getItem('config')));
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  useEffect(() => {
    if (user && !timerRef.current) {
      formatTime();
      getPrompt();
      timerRef.current = setInterval(formatTime, 60000);
    }
    return () => {
      // unDistory.current = false;
    };
  }, [user]);
  const formatTime = () => {
    let hour = moment().hour();
    let minute = moment().minute();
    let nowTime: any = [];
    if (hour <= 9) {
      nowTime[0] = '早上';
    } else if (hour <= 12 && hour > 9) {
      nowTime[0] = '上午';
    } else if (hour <= 13 && hour > 12) {
      nowTime[0] = '中午';
    } else if (hour <= 18 && hour > 13) {
      nowTime[0] = '下午';
    } else {
      nowTime[0] = '晚上';
    }
    nowTime[1] = moment().format('HH:mm');
    setNowTime(nowTime);
  };
  const getPrompt = async () => {
    let promptRes: any = await api.auth.getPrompt();
    if (unDistory.current) {
      if (promptRes.msg === 'OK') {
        setPrompt(promptRes.result.content);
      } else {
        dispatch(setMessage(true, promptRes.msg, 'error'));
      }
    }
  };
  const changeConfig = (configType: string, checked: boolean) => {
    let newContentConfig = _.cloneDeep(contentConfig);
    newContentConfig[configType] = checked;
    setContentConfig(newContentConfig);
    localStorage.setItem('config', JSON.stringify(newContentConfig));
  };
  const contentMenu = (
    <div className="content-dot">
      <IconFont
        type="icon-dot"
        onClick={() => {
          setTabsetVisible(true);
        }}
      />
      <DropMenu
        visible={tabsetVisible}
        dropStyle={{
          width: '120px',
          height: '170px',
          top: '48px',
          left: '240px',
          padding: '10px 0px 10px 15px',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
        onClose={() => {
          setTabsetVisible(false);
        }}
        // title={'分配任务'}
      >
        <div className="content-dot-item">
          <Checkbox checked={contentConfig.mainCheck} disabled>
            今日
          </Checkbox>
        </div>
        <div className="content-dot-item">
          <Checkbox
            checked={contentConfig.lastCheck}
            onChange={(e: any) => {
              changeConfig('lastCheck', e.target.checked);
            }}
          >
            最近
          </Checkbox>
        </div>
        <div className="content-dot-item">
          <Checkbox
            checked={contentConfig.fileCheck}
            onChange={(e: any) => {
              changeConfig('fileCheck', e.target.checked);
            }}
          >
            收藏
          </Checkbox>
        </div>
        <div className="content-dot-item">
          <Checkbox
            checked={contentConfig.memberCheck}
            onChange={(e: any) => {
              changeConfig('memberCheck', e.target.checked);
            }}
          >
            队友
          </Checkbox>
        </div>
        <div className="content-dot-item">
          <Checkbox
            checked={contentConfig.groupCheck}
            onChange={(e: any) => {
              changeConfig('groupCheck', e.target.checked);
            }}
          >
            项目
          </Checkbox>
        </div>
      </DropMenu>
    </div>
  );
  return (
    <div className="content">
      <ContentHeader />
      <div className="content-container">
        <div className="content-title">
          <div className="content-mainTitle">
            {nowTime[0]}好,亲爱的{user && user.profile.nickName}
          </div>
          <div className="content-timeTitle">{nowTime[1]}</div>
          <div className="content-subTitle">{prompt}</div>
        </div>

        {/*tabBarExtraContent={operations}>*/}
        {fileVisible && fileInfo ? (
          <div className="content-fileContainer">
            <FileInfo />
          </div>
        ) : null}
        <Tabs tabBarStyle={{ color: '#fff' }} tabBarExtraContent={contentMenu}>
          {contentConfig.mainCheck ? (
            <TabPane tab="今日" key="1">
              <div className="content-tabPane">
                <MainBoard />
              </div>
            </TabPane>
          ) : null}
          {contentConfig.lastCheck ? (
            <TabPane tab="最近" key="2">
              <div className="content-tabPane">
                <FileList
                  groupKey={''}
                  type="最近"
                  fileItemWidth={'calc(100% - 270px)'}
                />
              </div>
            </TabPane>
          ) : null}
          {contentConfig.fileCheck ? (
            <TabPane tab="收藏" key="3">
              <div className="content-tabPane">
                <FileList
                  groupKey={mainGroupKey}
                  type="收藏"
                  fileItemWidth={'calc(100% - 270px)'}
                />
              </div>
            </TabPane>
          ) : null}
          {contentConfig.memberCheck ? (
            <TabPane tab="队友" key="4">
              <div className="content-tabPane">
                <MemberBoard boardIndex={0} />
              </div>
            </TabPane>
          ) : null}
          {contentConfig.groupCheck ? (
            <TabPane tab="项目" key="5">
              <div className="content-tabPane">
                <MemberBoard boardIndex={1} />
              </div>
            </TabPane>
          ) : null}
        </Tabs>

        {/* <MainBoard /> : null} */}
        {/* {theme && theme.memberVisible ? <MemberBoard /> : null}
        {theme && theme.messageVisible ? <MessageBoard /> : null} */}
      </div>
    </div>
  );
};
export default Content;
