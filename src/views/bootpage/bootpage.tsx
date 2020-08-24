import React, { useState, useEffect, useRef } from 'react';
import './bootpage.css';
import bootpage from '../../assets/img/bootpage.png';
import boottitle from '../../assets/img/boottitle.png';
const Bootpage: React.FC = () => {
  const bootpageRef: React.RefObject<any> = useRef();
  const [clientHeight, setClientHeight] = useState(0);
  useEffect(() => {
    if (bootpageRef.current) {
      let clientHeight = bootpageRef.current.clientHeight;
      setClientHeight(clientHeight);
    }
  }, [bootpageRef.current]);
  const toUrl = () => {
    window.open('http://www.beian.miit.gov.cn/');
  };
  const toLogin = () => {
    const redirect = `${window.location.protocol}//${window.location.host}`;
    window.location.href = `https://account.qingtime.cn?apphigh=27&redirect=${redirect}&logo=https://working.vip/page/logo2.svg`;
  };
  return (
    <div className="bootpage" ref={bootpageRef}>
      <div className="bootpage-logo">
        {/* <SvgIcon :iconSvg="logoSvg" fontSize="80px" /> */}
        <a href="https://bbs.working.vip">雁行官网</a>
      </div>
      <div className="bootpage-content">
        <div className="bootpage-image">
          <img src={bootpage} alt="" />
        </div>
        <div className="bootpage-title">
          <img src={boottitle} alt="" />
        </div>
        <div
          className="bootpage-button"
          onClick={() => {
            toLogin();
          }}
        >
          开始工作
        </div>
      </div>
      {/* v-show="videoState"  */}
      <div
        className="bootpage-video"
        style={{ width: '760px', height: clientHeight }}
      >
        <video
          src="https://cdn-icare.qingtime.cn/714228E0.mp4"
          autoPlay
          muted
          loop
        >
          您的浏览器不支持 audio 标签。
        </video>
      </div>
      <div
        onClick={() => {
          toUrl();
        }}
        className="bootpage-footer"
      >
        ©2019 江苏时光信息科技有限公司 Qingtime All Rights Reserved
        苏ICP备15006448号
      </div>
    </div>
  );
};
export default Bootpage;
