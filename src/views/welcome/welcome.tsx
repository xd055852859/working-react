import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { changeStartMusic } from '../../redux/actions/authActions';
import Button from '@material-ui/core/Button';
import { useDispatch } from 'react-redux';
import bgWSvg from '../../assets/svg/bg-white.svg';
import cloudSvg from '../../assets/svg/clouds.svg';
import welcomeSvg from '../../assets/svg/welcome.svg';
import welcomeSmallSvg from '../../assets/svg/welcomeSmall.svg';
// import { loginByToken } from "../../redux/actions/authActions";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    welcome: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: '#FFF',
      backgroundImage: 'url(' + bgWSvg + ')',
      backgroundPosition: 'bottom',
      backgroundRepeat: 'no-repeat',
    },
    ICPLicensing: {
      color: '#80807E',
      fontSize: '16px',
      position: 'absolute',
      bottom: '39px',
      width: '100%',
      textAlign: 'center',
    },
    logo: {
      backgroundPosition: 'center',
      position: 'absolute',
      backgroundRepeat: 'no-repeat',
    },
    cloud: {
      width: '800px',
      height: '300px',
      backgroundImage: 'url(' + cloudSvg + ')',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'contain',
      position: 'absolute',
      top: 'calc(45vh - 150px)',
      left: '0px',
      animation: '58s linear 1s infinite running $slidein',
    },
    '@keyframes slidein': {
      from: { left: '0px' },
      to: { left: '100%' },
    },
  })
);

export default function Welcome() {
  const classes = useStyles();
  const history = useHistory();
  const user = useTypedSelector((state) => state.auth.user);
  const [clientHeight, setClientHeight] = useState(0);
  const [clientWidth, setClientWidth] = useState(0);
  const bootpageRef: React.RefObject<any> = useRef();
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
  }, []);
  useEffect(() => {
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
    };
  }, []);
  useEffect(() => {
    if (bootpageRef.current) {
      setClientWidth(bootpageRef.current.clientWidth);
      let clientHeight = bootpageRef.current.clientHeight;
      setClientHeight(clientHeight);
    }
  }, [bootpageRef]);
  const toUrl = () => {
    window.open('http://beian.miit.gov.cn/');
  };
  const toLogin = () => {
    if (localStorage.getItem('token') && localStorage.getItem('viewWelcome')) {
      history.push('/home/basic');
      localStorage.removeItem('viewWelcome');
    } else {
      let redirect = '';
      if (localStorage.getItem('showType')) {
        redirect = `${window.location.protocol}//${window.location.host}/home/showPage`;
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

  return (
    <div
      className={classes.welcome}
      ref={bootpageRef}
      style={{ backgroundSize: clientWidth > 500 ? 'contain' : '400px 300px' }}
    >
      <Button
        variant="contained"
        size="large"
        style={{
          backgroundColor: '#FF658F',
          color: '#FFF',
          width: clientWidth > 500 ? '154px' : '140px',
          height: clientWidth > 500 ? '50px' : '40px',
          borderRadius: '30px',
          position: 'absolute',
          top: '32px',
          right: clientWidth > 500 ? '132px' : '32px',
        }}
        onClick={toLogin}
      >
        开始
      </Button>
      <div className={classes.cloud}></div>
      <div
        className={classes.logo}
        style={{
          backgroundSize: clientWidth > 500 ? 'cover' : 'contain',
          left: clientWidth > 500 ? 'calc(50% - 341px)' : 'calc(50% - 150px)',
          top: clientWidth > 500 ? 'calc(45vh - 50px)' : 'calc(50% - 80px)',
          width: clientWidth > 500 ? '686px' : '300px',
          height: clientWidth > 500 ? '144px' : '160px',
          backgroundImage:
            'url(' + (clientWidth > 500 ? welcomeSvg : welcomeSmallSvg) + ')',
        }}
      ></div>
      <span
        className={classes.ICPLicensing}
        onClick={() => {
          toUrl();
        }}
        style={{ cursor: 'pointer' }}
      >
        ©2020 江苏时光信息科技有限公司 Qingtime All Rights Reserved
        苏ICP备15006448号
      </span>
    </div>
  );
}
