import React, { useState, useEffect, useRef } from 'react';
import './welcome.css';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../../services/api';

import { setMessage } from '../../redux/actions/commonActions';

import HtmlWelcome from './htmlWelcome';
import PhoneWelcome from './phoneWelcome';
import bgWSvg from '../../assets/svg/bg-white.svg';

export default function Welcome() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [clientHeight, setClientHeight] = useState(0);
  const [clientWidth, setClientWidth] = useState(0);
  const [version, setVersion] = useState('');
  let unDistory = useRef<any>(null);
  unDistory.current = true;
  useEffect(() => {
    let url = window.location.href;
    // 自动切换为https
    if (url.indexOf('http://localhost') == -1 && url.indexOf('https') < 0) {
      url = url.replace('http:', 'https:');
      window.location.replace(url);
    }
    if (localStorage.getItem('token') && !localStorage.getItem('viewWelcome')) {
      history.push('/home/basic');
    }
    let clientWidth = document.body.clientWidth;
    setClientWidth(clientWidth);
    let clientHeight = document.body.clientHeight;
    setClientHeight(clientHeight);
    getVersion();
    function handle(e: any) {
      if (
        e.origin === 'https://account.qingtime.cn' &&
        e.data.eventName === 'redirect'
      ) {
        window.location.href = e.data.data;
      }
    }
    window.addEventListener('message', handle, false);
    return () => {
      window.removeEventListener('message', handle);
      // unDistory.current = false;
    };
    // setClientWidth(bootpageRef.current.clientWidth);
  }, []);
  const toLogin = () => {
    if (localStorage.getItem('token') && localStorage.getItem('viewWelcome')) {
      history.push('/home/basic');
      localStorage.removeItem('viewWelcome');
    } else {
      let redirect = '';
      if (localStorage.getItem('showType')) {
        redirect = `${window.location.protocol}//${window.location.host}/home/showPage`;
      } else if (localStorage.getItem('createType')) {
        redirect = `${window.location.protocol}//${window.location.host}/home/create`;
      } else {
        redirect = `${window.location.protocol}//${window.location.host}/home/basic`;
      }

      // window.location.href = `https://account.qingtime.cn?apphigh=27&redirect=${redirect}&logo=https://working.vip/page/logo2.svg`;
      window.open(
        `https://account.qingtime.cn?apphigh=27&redirect=${redirect}&logo=https://cdn-icare.qingtime.cn/1605251458500_workingVip`,
        'new',
        `width=360, height=560, resizable=false, toolbar=no, menubar=no, location=no, status=no, top=${
          (clientHeight - 420) / 2
        }, left=${(clientWidth - 360) / 2}`
      );
    }
  };
  const getVersion = async () => {
    let versionRes: any = await api.common.getVersion(7);
    if (unDistory.current) {
      if (versionRes.msg === 'OK') {
        //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
        // let ua: any = window.navigator.userAgent.toLowerCase();
        //通过正则表达式匹配ua中是否含有MicroMessenger字符串
        // if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        // setVersion('https://workingdownload.qingtime.cn/');
        // } else {
        setVersion(
          'https://workingversion.qingtime.cn/Working_QingTime_' +
            versionRes.result.versionName +
            '.apk'
        );
        // }
      } else {
        dispatch(setMessage(true, versionRes.msg, 'error'));
      }
    }
  };
  return (
    <div
      className="begin"
      style={{
        backgroundSize: clientWidth > 500 ? 'contain' : '400px 300px',
        backgroundImage: `url(${bgWSvg})`,
      }}
    >
      {/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) ? (
        <PhoneWelcome toLogin={toLogin} version={version} clientWidth={clientWidth} clientHeight={clientHeight}/>
      ) : (
        <HtmlWelcome toLogin={toLogin} version={version} clientWidth={clientWidth} clientHeight={clientHeight}/>
      )}
    </div>
  );
}
