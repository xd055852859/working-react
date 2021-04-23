import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './download.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import api from '../../services/api';
import { setMessage } from '../../redux/actions/commonActions';
import Code from '../../components/qrCode/qrCode';
//@ts-ignore
// import QRCode from './qrcode.min.js';
interface DownloadProps {}

const Download: React.FC<DownloadProps> = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [year, setYear] = useState<number>(moment().year());
  const [download, setDownload] = useState<any>([
    { t: 'IOS', u: 'https://itunes.apple.com/cn/app/id1516401175?ls=1&mt=8' },
    { t: 'Android', u: '' },
  ]);
  const titles = [
    {
      t: '清晰计划',
      d: '每一天',
      url: 'https://cdn-icare.qingtime.cn/9BC7B314.jpg',
    },
    {
      t: '掌控项目',
      d: '关注团队',
      url: 'https://cdn-icare.qingtime.cn/7E749D8A.jpg',
    },
    {
      t: '随时随地',
      d: '发布任务',
      url: 'https://cdn-icare.qingtime.cn/80A21213.jpg',
    },
    {
      t: '关于团队的一切',
      d: '相互激励',
      url: 'https://cdn-icare.qingtime.cn/5CBD8C46.jpg',
    },
    {
      t: '时间去哪儿了',
      d: '我的动态',
      url: 'https://cdn-icare.qingtime.cn/7A6C1C71.jpg',
    },
    {
      t: '现在开始',
      d: '美好工作',
      url: 'https://cdn-icare.qingtime.cn/091AA4A8.jpg',
    },
  ];
  useEffect(() => {
    getVersion();
  }, []);
  const getVersion = async () => {
    let newDownload = _.cloneDeep(download);
    let versionRes: any = await api.common.getVersion(7);
    if (versionRes.msg === 'OK') {
      newDownload[1]['u'] =
        'https://workingversion.qingtime.cn/Working_QingTime_' +
        versionRes.result.versionName +
        '.apk';
      console.log(newDownload);
      setDownload(newDownload);
    } else {
      dispatch(setMessage(true, versionRes.msg, 'error'));
    }
  };
  return (
    <div id="adai">
      <div className="h1080 home_wrap">
        <div className="nav_wrap">
          <div className="nav-left">
            <img
              src={require('./img/logo.png')}
              alt="logo"
              onClick={() => {
                history.push('/home/basic/content');
              }}
            />
            <a href="http://extension.workfly.cn" target="_blank">
              雁行插件
            </a>
            <a href="https://cheerchat.qingtime.cn" target="_blank">
              洽洽官网
            </a>
          </div>
        </div>
        <div className="home_box">
          <img src={require('./img/working.png')} alt="logo_t" />
          <div className="icon_wrap">
            {download[1].u
              ? download.map((item: any, index: number) => {
                  return (
                    <a key={'icon' + index} href={item.u} target="_blank">
                      <img
                        className="phone_icon"
                        src={require('./img/iphone' + index + '.svg')}
                        alt=""
                      />
                      <p>{item.t}</p>
                      <div className="qrcode" id={'qrcode' + index}>
                        <Code url={item.u} id={item.t} />
                      </div>
                    </a>
                  );
                })
              : null}
          </div>
        </div>
        <p className="copy_right">
          ©{year} 江苏时光信息科技有限公司 Qingtime All Rights Reserved
          苏ICP备15006448号-6
        </p>
      </div>
      <div className="h1080 multiple_devices_wrap">
        <p>适配多种设备</p>
        {[0, 1, 2, 3].map((item: any, index: number) => {
          return (
            <img
              key={'devices' + index}
              src={require('./img/mac' + index + '.png')}
              alt=""
            />
          );
        })}
      </div>
      <ul className="img_wrap">
        {titles.map((item: any, index: number) => {
          return (
            <li
              key={'img2' + index}
              style={{
                backgroundImage: 'url(' + item.url + ')',
              }}
              className="h1080"
            >
              <div className="desc_wrap">
                <img src={require('./img/icon' + index + '.svg')} alt="" />
                <p>{item.t}</p>
                <span>{item.d}</span>
              </div>
              <img
                src={require('./img/icon' + index + '.png')}
                className="desc_img lozad"
                // src="data:image/gif;base64,R0lGODdhAQABAPAAAMPDwwAAACwAAAAAAQABAAACAkQBADs="
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
Download.defaultProps = {};
export default Download;
