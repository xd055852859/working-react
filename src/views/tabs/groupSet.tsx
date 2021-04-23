import React, { useState, useEffect, useRef } from 'react';
import './groupSet.css';
import { useDispatch } from 'react-redux';
import { Checkbox, Input, Radio, Select, Modal, Image as ImagePng } from 'antd';
const { TextArea } = Input;
const { Option } = Select;
import _, { isArray } from 'lodash';
import copy from 'copy-to-clipboard';
import Cropper from 'react-cropper';
import api from '../../services/api';

import { setMessage } from '../../redux/actions/commonActions';
import { useTypedSelector } from '../../redux/reducer/RootState';

import uploadFile from '../../components/common/upload';
import DropMenu from '../../components/common/dropMenu';

import plusPng from '../../assets/img/contact-plus.png';
import editImgPng from '../../assets/img/editImg.png';

interface GroupSetProps {
  saveGroupSet: any;
  type: string;
  groupInfo?: any;
}

const GroupSet: React.FC<GroupSetProps> = (props) => {
  const { saveGroupSet, type, groupInfo } = props;
  const dispatch = useDispatch();
  const uploadToken = useTypedSelector((state) => state.auth.uploadToken);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  // const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const groupRole = useTypedSelector((state) => state.group.groupRole);
  const mainEnterpriseGroup = useTypedSelector(
    (state) => state.auth.mainEnterpriseGroup
  );
  const [groupName, setGroupName] = useState('');
  const [enterprise, setEnterprise] = useState(false);
  const [statisticsSonGroupEnergy, setStatisticsSonGroupEnergy] = useState(
    false
  );
  const [groupDesc, setGroupDesc] = useState('');
  const [groupLogo, setGroupLogo] = useState('');
  const [modelUrl, setModelUrl] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [joinType, setJoinType] = useState('1');
  const [password, setPassword] = useState('');
  const [question, setQuestion] = useState('');
  const [isHasPassword, setIsHasPassword] = useState(false);
  const [isLinkJoin, setIsLinkJoin] = useState(false);
  const [defaultPower, setDefaultPower] = useState(4);
  const [defaultPowerVisible, setDefaultPowerVisible] = useState(false);
  const [defaultPngVisible, setDefaultPngVisible] = useState(false);
  const [photoVisible, setPhotoVisible] = useState<any>(false);
  const [upImg, setUpImg] = useState<any>(null);
  const [thirdPngList, setThirdPngList] = useState<any>(null);
  const setRef: React.RefObject<any> = useRef();
  const cropperRef = useRef<HTMLImageElement>(null);
  const roleArray = [
    // {
    //   name: '管理员',
    //   role: 2,
    // },
    {
      name: '编辑',
      role: 3,
    },
    {
      name: '作者',
      role: 4,
    },
    {
      name: '成员(只读)',
      role: 5,
    },
  ];
  const defaultGroupPng = [
    'https://cdn-icare.qingtime.cn/1603953838590_workingVip',
    'https://cdn-icare.qingtime.cn/1603953880452_workingVip',
    'https://cdn-icare.qingtime.cn/1603953902877_workingVip',
    'https://cdn-icare.qingtime.cn/1603953959094_workingVip',
    'https://cdn-icare.qingtime.cn/1603953965051_workingVip',
    'https://cdn-icare.qingtime.cn/1603953970462_workingVip',
    'https://cdn-icare.qingtime.cn/1603953975646_workingVip',
    'https://cdn-icare.qingtime.cn/1603953980113_workingVip',
    'https://cdn-icare.qingtime.cn/1603954045926_workingVip',
    'https://cdn-icare.qingtime.cn/1603954057998_workingVip',
    'https://cdn-icare.qingtime.cn/1603954062903_workingVip',
    'https://cdn-icare.qingtime.cn/1603954067108_workingVip',
    'https://cdn-icare.qingtime.cn/1603954070835_workingVip',
    'https://cdn-icare.qingtime.cn/1603954077157_workingVip',
    'https://cdn-icare.qingtime.cn/1603961605570_workingVip',
    'https://cdn-icare.qingtime.cn/1603961610336_workingVip',
    'https://cdn-icare.qingtime.cn/1603961615966_workingVip',
    'https://cdn-icare.qingtime.cn/1603961621568_workingVip',
    'https://cdn-icare.qingtime.cn/1603961626026_workingVip',
    'https://cdn-icare.qingtime.cn/1603961631593_workingVip',
    'https://cdn-icare.qingtime.cn/1603958216473_workingVip',
    'https://cdn-icare.qingtime.cn/1603958223320_workingVip',
    'https://cdn-icare.qingtime.cn/1603958229514_workingVip',
    'https://cdn-icare.qingtime.cn/1603958235940_workingVip',
  ];
  useEffect(() => {
    if ((type === '设置' || type === '企业') && groupInfo) {
      setGroupName(groupInfo.groupName ? groupInfo.groupName : '');
      setGroupDesc(groupInfo.groupDesc ? groupInfo.groupDesc : '');
      setGroupLogo(groupInfo.groupLogo ? groupInfo.groupLogo : '');
      setModelUrl(groupInfo.modelUrl ? groupInfo.modelUrl : '');
      setEnterprise(groupInfo.enterprise === 2 ? true : false);
      setStatisticsSonGroupEnergy(
        groupInfo.statisticsSonGroupEnergy
          ? groupInfo.statisticsSonGroupEnergy
          : false
      );
      setIsOpen(groupInfo.isOpen ? groupInfo.isOpen : false);
      setJoinType(
        groupInfo.joinType || groupInfo.joinType === 0
          ? groupInfo.joinType + ''
          : '1'
      );
      setPassword(groupInfo.password ? groupInfo.password : '');
      setQuestion(groupInfo.question ? groupInfo.question : '');
      setIsHasPassword(
        groupInfo.isHasPassword ? groupInfo.isHasPassword : false
      );
      setIsLinkJoin(groupInfo.isLinkJoin ? groupInfo.isLinkJoin : false);
      setDefaultPower(groupInfo.defaultPower ? groupInfo.defaultPower : 5);
    }
  }, [type, groupInfo]);
  const changeGroupName = (e: any) => {
    let newGroupName = e.target.value;
    if (newGroupName.indexOf('___') !== -1) {
      return;
    }
    setGroupName(newGroupName);
    setGroupSet('groupName', newGroupName);
  };
  const changeEnterprise = (e: any) => {
    let newEnterprise = e.target.checked;
    setEnterprise(newEnterprise);
    setGroupSet('enterprise', newEnterprise ? 2 : 1);
  };
  const changeStatisticsSonGroupEnergy = (e: any) => {
    let newStatisticsSonGroupEnergy = e.target.checked;
    setStatisticsSonGroupEnergy(newStatisticsSonGroupEnergy);
    setGroupSet('statisticsSonGroupEnergy', newStatisticsSonGroupEnergy);
  };
  const changeGroupDesc = (e: any) => {
    let newGroupDesc = e.target.value;
    setGroupDesc(newGroupDesc);
    setGroupSet('groupDesc', newGroupDesc);
  };
  const changeOpen = (e: any) => {
    let newIsOpen = e.target.checked;
    if (!newIsOpen) {
      setJoinType('1');
    } else {
      setJoinType('0');
    }
    setIsOpen(newIsOpen);
    setGroupSet('isOpen', newIsOpen);
  };
  const changeJoinType = (e: any) => {
    let newJoinType = e.target.value;
    setJoinType(newJoinType);
    setGroupSet('joinType', parseInt(newJoinType));
  };
  const changeIsPassword = (e: any) => {
    let newIsHasPassword = e.target.checked;
    setIsHasPassword(newIsHasPassword);
    setGroupSet('isHasPassword', newIsHasPassword);
  };
  const changePassword = (e: any) => {
    let newPassword = e.target.value;
    setPassword(newPassword);
    setGroupSet('password', newPassword);
  };
  const changeQuestion = (e: any) => {
    let newQuestion = e.target.value;
    setQuestion(newQuestion);
    setGroupSet('question', newQuestion);
  };
  const changeJoin = (e: any) => {
    let newIsLinkJoin = e.target.checked;
    setIsLinkJoin(newIsLinkJoin);
    setGroupSet('isLinkJoin', newIsLinkJoin);
  };
  const changeRole = (value: any) => {
    let newDefaultPower = value;
    setDefaultPower(newDefaultPower);
    setGroupSet('defaultPower', newDefaultPower);
    setDefaultPowerVisible(false);
  };
  // const uploadImg = (e: any) => {
  //   let mimeType = ['image/png', 'image/jpeg'];
  //   let item = {};
  //   let file = e.target.files[0];
  //   let reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = function (theFile: any) {
  //     let image = new Image();
  //     image.src = theFile.target.result;
  //     image.onload = function () {
  //       uploadFile.uploadImg(file, uploadToken, mimeType, function (url: any) {
  //         setGroupLogo(url);
  //         setGroupSet('groupLogo', url);
  //       });
  //     };
  //   };
  // };
  const chooseImg = (e: any) => {
    const fileReader = new FileReader();
    if (e.target.files[0]) {
      setPhotoVisible(true);
      fileReader.onload = (e: any) => {
        const dataURL = e.target.result;
        setUpImg(dataURL);
      };
      fileReader.readAsDataURL(e.target.files[0]);
    } else {
      dispatch(setMessage(true, '请选择文件', 'error'));
    }
  };
  const dataURLtoFile = (dataurl: string, filename = 'file') => {
    let arr: any = dataurl.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let suffix = mime.split('/')[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], `${filename}.${suffix}`, {
      type: mime,
    });
  };
  const uploadImg = () => {
    let mimeType = ['image/png', 'image/jpeg'];
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    const croppedCanvas = cropper.getCroppedCanvas({
      minWidth: 100,
      minHeight: 200,
      width: 400,
      height: 800,
      maxWidth: 800,
      maxHeight: 800,
    });
    let dataURL = croppedCanvas.toDataURL('image/png');
    let imgFile = dataURLtoFile(dataURL);

    uploadFile.uploadImg(
      imgFile,
      uploadToken,
      mimeType,
      function (url: string) {
        dispatch(setMessage(true, '图片上传成功', 'success'));
        setGroupLogo(url);
        setGroupSet('groupLogo', url);
      }
    );
  };
  const uploadModelImg = (e: any) => {
    let mimeType = ['image/png', 'image/jpeg'];
    let item = {};
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (theFile: any) {
      let image = new Image();
      image.src = theFile.target.result;
      image.onload = function () {
        uploadFile.uploadImg(file, uploadToken, mimeType, function (url: any) {
          setModelUrl(url);
          setGroupSet('modelUrl', url);
        });
      };
    };
  };
  const setGroupSet = (type: string, value: any) => {
    let obj: any = {
      groupName: groupName,
      groupDesc: groupDesc,
      groupLogo: groupLogo,
      modelUrl: modelUrl,
      isOpen: isOpen,
      joinType: parseInt(joinType),
      password: password,
      question: question,
      isHasPassword: isHasPassword,
      isLinkJoin: isLinkJoin,
      defaultPower: defaultPower,
      enterprise: enterprise ? 2 : 1,
      statisticsSonGroupEnergy: statisticsSonGroupEnergy,
    };
    obj[type] = value;
    saveGroupSet(obj);
  };
  const shareGroup = () => {
    const redirect = `${window.location.protocol}//${window.location.host}`;
    copy(redirect + '/home?groupKey=' + groupKey);
    dispatch(setMessage(true, '复制链接项目成功', 'success'));
  };
  const getDefaultPng = async () => {
    let res: any = await api.thirdApi.getThirdRandomPng();
    if (isArray(res)) {
      setThirdPngList(res);
    }
    // if (res.msg === 'OK') {
    // console.log(res)
    else {
      dispatch(setMessage(true, '获取图片失败', 'error'));
    }
  };
  return (
    <div className="contact-dialog-content" ref={setRef}>
      <div className="contact-dialog-info">
        <div className="contact-dialog-container">
          <div className="contact-name-content" style={{ marginBottom: '5px' }}>
            <div className="contact-name-title">项目图标</div>
            <div
              className="contact-dialog-logo"
              onClick={() => {
                if ((groupRole === 1 && type === '设置') || type === '创建') {
                  setDefaultPngVisible(true);
                  getDefaultPng();
                }
              }}
              style={{ border: groupLogo ? 0 : '1px solid #d9d9d9' }}
            >
              <img src={plusPng} className="contact-dialog-add" />
              <img src={editImgPng} className="contact-dialog-icon" />
              {groupLogo ? (
                <img src={groupLogo} className="contact-dialog-groupLogo" />
              ) : null}
              <input
                type="file"
                accept="image/*"
                onChange={chooseImg}
                onClick={(e: any) => {
                  e.stopPropagation();
                }}
                className="upload-img"
                disabled={groupRole !== 1 && type === '设置'}
              />
              <DropMenu
                visible={defaultPngVisible}
                dropStyle={{
                  width: '493px',
                  height: '350px',
                  top: '132px',
                  left: '0px',
                }}
                onClose={() => {
                  setDefaultPngVisible(false);
                }}
              >
                <div className="defaultPng-container">
                  {thirdPngList
                    ? thirdPngList.map(
                        (thirdPngItem: any, thirdPngIndex: number) => {
                          return (
                            <div
                              className="defaultPng-container-item"
                              key={'defaultPng' + thirdPngIndex}
                            >
                              <img
                                src={thirdPngItem.urls.thumb}
                                alt=""
                                onClick={() => {
                                  setGroupLogo(thirdPngItem.urls.thumb);
                                  setGroupSet(
                                    'groupLogo',
                                    thirdPngItem.urls.thumb
                                  );
                                }}
                              />
                            </div>
                            // <ImagePng
                            //   width={200}
                            //   src={thirdPngItem.urls.thumb}
                            //   preview={{
                            //     src: thirdPngItem.urls.full,
                            //   }}
                            // />
                          );
                        }
                      )
                    : null}
                </div>
              </DropMenu>
            </div>
          </div>

          <div className="contact-name-content" style={{ marginBottom: '5px' }}>
            <div className="contact-name-title">项目名称</div>
            <Input
              // required
              placeholder="请输入项目名称"
              style={{ width: 'calc(100% - 90px)' }}
              value={groupName}
              onChange={changeGroupName}
              disabled={groupRole !== 1 && type === '设置'}
            />
          </div>
          <div className="contact-name-content">
            <div className="contact-name-title">项目属性</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox
                checked={isOpen}
                onChange={changeOpen}
                disabled={groupRole !== 1 && type === '设置'}
              >
                全平台可见
              </Checkbox>
            </div>
            {/* {!(
              type === '创建' && mainEnterpriseGroup?.mainEnterpriseGroupKey
            ) && !(type === '设置' && groupInfo?.enterpriseGroupKey) ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={enterprise}
                  onChange={changeEnterprise}
                  disabled={groupRole !== 1 && type === '设置'}
                >
                  企业项目
                </Checkbox>
              </div>
            ) : null} */}
          </div>
          <div className="contact-name-content">
            <div className="contact-name-title">项目简介</div>
            <TextArea
              autoSize={{ minRows: 3 }}
              placeholder="请输入项目描述"
              style={{ width: 'calc(100% - 90px)', fontSize: '12px' }}
              value={groupDesc}
              onChange={changeGroupDesc}
              disabled={groupRole !== 1 && type === '设置'}
            />
          </div>
          {/* <div className="contact-name-content" style={{ height: '250px' }}>
            <div className="contact-name-title">项目概念图</div>
            <div className="contact-model">
              <img
                src={plusPng}
                className="contact-dialog-add"
                style={{ zIndex: 2 }}
              />
              {modelUrl ? (
                <img
                  src={modelUrl}
                  className="contact-dialog-groupLogo"
                  style={{ borderRadius: '0px' }}
                />
              ) : null}
              <input
                type="file"
                accept="image/*"
                onChange={uploadModelImg}
                className="upload-img"
                disabled={(groupRole > 2 || groupRole === 0) && type === '设置'}
                style={{
                  width: '100%',
                  height: '100%',
                  top: '0px',
                  left: '0px',
                }}
              />
            </div>
          </div> */}
          <div className="contact-name-content">
            <div className="contact-name-title">默认权限</div>
            <Select
              style={{ width: 120 }}
              onChange={(value: number) => {
                if ((groupRole === 1 && type === '设置') || type === '创建') {
                  changeRole(value);
                }
              }}
              value={defaultPower}
              getPopupContainer={() => setRef.current}
            >
              {roleArray.map((roleItem: any, roleIndex: number) => {
                return (
                  <Option value={roleItem.role} key={'role' + roleIndex}>
                    {roleItem.name}
                  </Option>
                );
              })}
            </Select>
            <DropMenu
              visible={defaultPowerVisible}
              dropStyle={{
                width: '300px',
                height: '100px',
                top: '40px',
                left: '100px',
              }}
              onClose={() => {
                setDefaultPowerVisible(false);
              }}
            >
              <div className="contact-role"></div>
            </DropMenu>
          </div>
          <div className="contact-name-content">
            <div className="contact-name-title">项目特性</div>
            <Radio.Group onChange={changeJoinType} value={joinType}>
              {isOpen ? (
                <Radio value="0" disabled={groupRole !== 1 && type === '设置'}>
                  开放加入
                </Radio>
              ) : null}
              <Radio value="1" disabled={groupRole !== 1 && type === '设置'}>
                审核加入
              </Radio>
            </Radio.Group>
          </div>
          <div className="contact-name-content">
            <div className="contact-name-title">加入方式</div>

            <Checkbox
              checked={isHasPassword}
              onChange={changeIsPassword}
              disabled={groupRole !== 1 && type === '设置'}
            >
              口令加入
            </Checkbox>
            {isHasPassword ? (
              <React.Fragment>
                <Input
                  placeholder="请输入口令问题"
                  style={{ margin: '0px 10px', width: '180px' }}
                  value={question}
                  onChange={changeQuestion}
                  disabled={groupRole !== 1 && type === '设置'}
                />
                <Input
                  placeholder="请输入口令"
                  style={{ width: '150px' }}
                  value={password}
                  onChange={changePassword}
                  disabled={groupRole !== 1 && type === '设置'}
                />
              </React.Fragment>
            ) : null}
          </div>
        </div>
      </div>
      <Modal
        visible={photoVisible}
        onCancel={() => {
          setPhotoVisible(false);
        }}
        onOk={() => {
          uploadImg();
          setPhotoVisible(false);
        }}
        title={'选择图片'}
        centered={true}
      >
        <Cropper
          style={{ width: '100%', height: '95%' }}
          // preview=".uploadCrop"
          guides={true}
          src={upImg}
          ref={cropperRef}
          // aspectRatio={16 / 9}
          preview=".img-preview"
        />
      </Modal>
    </div>
  );
};
export default GroupSet;
