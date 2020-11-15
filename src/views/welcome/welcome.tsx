import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { useTypedSelector } from '../../redux/reducer/RootState';
import Button from '@material-ui/core/Button';
import { useDispatch } from 'react-redux';
import bgWSvg from '../../assets/svg/bg-white.svg'
import cloudSvg from '../../assets/svg/clouds.svg'
import welcomeSvg from '../../assets/svg/welcome.svg'
// import { loginByToken } from "../../redux/actions/authActions";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    welcome: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: '#FFF',
      backgroundImage: 'url('+bgWSvg+')',
      backgroundSize: 'contain',
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
      width: '686px',
      height: '144px',
      backgroundImage:
        'url('+welcomeSvg+')',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'absolute',
      left: 'calc(50% - 341px)',
      top: 'calc(45vh - 50px)',
    },
    cloud: {
      width: '800px',
      height: '300px',
      backgroundImage: 'url('+cloudSvg+')',
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
      to: { left: '100vw' },
    },
  })
);

export default function Welcome() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useTypedSelector((state) => state.auth.user);
  const [clientHeight, setClientHeight] = useState(0);
  const [clientWidth, setClientWidth] = useState(0);
  const bootpageRef: React.RefObject<any> = useRef();
  useEffect(() => {
    if (localStorage.getItem('token')) {
      history.push('/');
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
    console.log(localStorage.getItem('token'));
    if (localStorage.getItem('token')) {
      history.push('/');
    } else {
      const redirect = `${window.location.protocol}//${window.location.host}`;
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
    <div className={classes.welcome} ref={bootpageRef}>
      <Button
        variant="contained"
        size="large"
        style={{
          backgroundColor: '#FF658F',
          color: '#FFF',
          width: '154px',
          height: '50px',
          borderRadius: '30px',
          position: 'absolute',
          top: '38px',
          right: '132px',
        }}
        onClick={toLogin}
      >
        开始
      </Button>
      <div className={classes.cloud}></div>
      <div className={classes.logo}></div>
      <span className={classes.ICPLicensing} onClick={() => toUrl}>
        ©2020 江苏时光信息科技有限公司 Qingtime All Rights Reserved
        苏ICP备15006448号
      </span>
    </div>
  );
}
