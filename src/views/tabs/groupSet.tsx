import React, { useState, useEffect } from 'react';
import './groupSet.css';
import { useDispatch } from 'react-redux';
import {
  Checkbox,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@material-ui/core';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import api from '../../services/api';
import copy from 'copy-to-clipboard';
import uploadFile from '../../components/common/upload';

import {
  setCommonHeaderIndex,
  setMessage,
  setMoveState,
} from '../../redux/actions/commonActions';
import { getGroup } from '../../redux/actions/groupActions';
import { useTypedSelector } from '../../redux/reducer/RootState';

import DropMenu from '../../components/common/dropMenu';
import Dialog from '../../components/common/dialog';

import plusPng from '../../assets/img/contact-plus.png';
import editImgPng from '../../assets/img/editImg.png';

interface GroupSetProps {
  saveGroupSet: any;
  type: string;
  groupInfo?: any;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      backgroundColor: '#17B881',
      padding: '6 26px',
      color: '#fff',
    },
    input: {
      width: 'calc(100% - 115px)',
      '& .MuiInput-formControl': {
        marginTop: '0px',
      },
      '& .MuiOutlinedInput-input': {
        padding: '10px 14px',
      },
      '& .MuiInputLabel-formControl': {
        marginTop: '-10px',
      },
    },
  })
);
const GroupSet: React.FC<GroupSetProps> = (props) => {
  const classes = useStyles();
  const { saveGroupSet, type, groupInfo } = props;
  const dispatch = useDispatch();
  const uploadToken = useTypedSelector((state) => state.auth.uploadToken);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  // const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const groupRole = useTypedSelector((state) => state.group.groupRole);
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
  const [defaultPower, setDefaultPower] = useState(5);
  const [defaultPowerVisible, setDefaultPowerVisible] = useState(false);
  const [defaultPngVisible, setDefaultPngVisible] = useState(false);

  const roleArray = [
    {
      name: '管理员',
      role: 2,
    },
    {
      name: '编辑',
      role: 3,
    },
    {
      name: '作者',
      role: 4,
    },
    {
      name: '群成员',
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
  const changeRole = (value: any, index: number) => {
    let newDefaultPower = value;
    setDefaultPower(newDefaultPower);
    setGroupSet('defaultPower', newDefaultPower);
    setDefaultPowerVisible(false);
  };
  const uploadImg = (e: any) => {
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
          setGroupLogo(url);
          setGroupSet('groupLogo', url);
        });
      };
    };
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
    dispatch(setMessage(true, '复制链接群成功', 'success'));
  };
  return (
    <div className="contact-dialog-content">
      <div className="contact-dialog-info">
        <div className="contact-dialog-container">
          <div className="contact-name-content" style={{ width: '70%' }}>
            <div className="contact-name-title">群名</div>
            <TextField
              // required
              id="outlined-basic"
              variant="outlined"
              label="群名称"
              className={classes.input}
              style={{ width: '70%' }}
              value={groupName}
              onChange={changeGroupName}
              disabled={(groupRole > 2 || groupRole === 0) && type === '设置'}
            />
          </div>
          <div
            className="contact-name-content"
            style={{
              width: '70%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="contact-name-title">全平台可见</div>
              <Checkbox
                checked={isOpen}
                onChange={changeOpen}
                disabled={(groupRole > 2 || groupRole === 0) && type === '设置'}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="contact-name-title">企业群</div>
              <Checkbox
                checked={enterprise}
                onChange={changeEnterprise}
                disabled={(groupRole > 2 || groupRole === 0) && type === '设置'}
              />
            </div>
          </div>
          <div
            className="contact-name-content"
            style={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <div
              style={{
                width: '70%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div className="contact-name-title">统计子群活力值</div>
              <Checkbox
                checked={statisticsSonGroupEnergy}
                onChange={changeStatisticsSonGroupEnergy}
                disabled={(groupRole > 2 || groupRole === 0) && type === '设置'}
              />
            </div>
          </div>
          <div className="contact-name-content">
            <div className="contact-name-title">群简介</div>
            <TextField
              required
              id="outlined-basic"
              variant="outlined"
              label="群描述"
              className={classes.input}
              value={groupDesc}
              onChange={changeGroupDesc}
              disabled={(groupRole > 2 || groupRole === 0) && type === '设置'}
            />
          </div>
          <div className="contact-name-content" style={{ height: '250px' }}>
            <div className="contact-name-title">群概念图</div>
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
          </div>
          <div className="contact-name-content">
            <div className="contact-name-title">群特性</div>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={joinType}
              onChange={changeJoinType}
              row
            >
              {isOpen ? (
                <FormControlLabel
                  value="0"
                  control={<Radio />}
                  label="开放加入"
                  disabled={
                    (groupRole > 2 || groupRole === 0) && type === '设置'
                  }
                />
              ) : null}
              <FormControlLabel
                value="1"
                control={<Radio />}
                label="管理员通过审核后加入"
                disabled={(groupRole > 2 || groupRole === 0) && type === '设置'}
              />
              <FormControlLabel
                value="2"
                control={<Radio />}
                label="管理员邀请加入"
                disabled={(groupRole > 2 || groupRole === 0) && type === '设置'}
              />
            </RadioGroup>
          </div>
          <div className="contact-name-content">
            <div className="contact-name-title" style={{ marginRight: '3px' }}>
              口令加入
            </div>
            <Checkbox
              checked={isHasPassword}
              style={{ marginRight: '10px' }}
              onChange={changeIsPassword}
              disabled={(groupRole > 2 || groupRole === 0) && type === '设置'}
            />
            {isHasPassword ? (
              <React.Fragment>
                <TextField
                  required
                  id="outlined-basic"
                  variant="outlined"
                  label="口令问题"
                  className={classes.input}
                  style={{ marginLeft: '15px', width: '45%' }}
                  value={question}
                  onChange={changeQuestion}
                  disabled={
                    (groupRole > 2 || groupRole === 0) && type === '设置'
                  }
                />
                <TextField
                  required
                  id="outlined-basic"
                  variant="outlined"
                  label="口令"
                  className={classes.input}
                  style={{ marginLeft: '15px', width: '25%' }}
                  value={password}
                  onChange={changePassword}
                  disabled={
                    (groupRole > 2 || groupRole === 0) && type === '设置'
                  }
                />
              </React.Fragment>
            ) : null}
          </div>
          {type === '设置' ? (
            <div className="contact-name-content">
              <div
                className="contact-name-title"
                style={{ marginRight: '3px' }}
              >
                链接加入
              </div>
              <Checkbox
                checked={isLinkJoin}
                onChange={changeJoin}
                style={{ marginRight: '10px' }}
                disabled={(groupRole > 2 || groupRole === 0) && type === '设置'}
              />
              <TextField
                required
                id="outlined-basic"
                variant="outlined"
                label="链接"
                className={classes.input}
                // onChange={changeInput}
                style={{ marginLeft: '15px', width: '50%' }}
                value={'https://working.vip?groupId=' + groupKey}
                disabled={(groupRole > 2 || groupRole === 0) && type === '设置'}
              />
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                style={{ marginLeft: '10px' }}
                onClick={() => {
                  shareGroup();
                }}
              >
                拷贝
              </Button>
            </div>
          ) : null}
          <div className="contact-name-content">
            <div className="contact-name-title">默认权限</div>
            <div
              onClick={() => {
                if ((groupRole > 0 && groupRole < 3) || type === '创建') {
                  setDefaultPowerVisible(true);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              {roleArray[defaultPower - 2].name}
            </div>
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
              <div className="contact-role">
                {roleArray.map((roleItem: any, roleIndex: number) => {
                  return (
                    <React.Fragment key={'role' + roleIndex}>
                      {roleIndex > 0 ? (
                        <div
                          className="contact-role-item"
                          onClick={() => {
                            changeRole(roleItem.role, roleIndex);
                          }}
                        >
                          {roleItem.name}
                        </div>
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </div>
            </DropMenu>
          </div>
          <div
            className="contact-dialog-logo"
            onClick={() => {
              setDefaultPngVisible(true);
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
              onChange={uploadImg}
              onClick={(e: any) => {
                e.stopPropagation();
              }}
              className="upload-img"
              disabled={(groupRole > 2 || groupRole === 0) && type === '设置'}
            />
          </div>
          <DropMenu
            visible={defaultPngVisible}
            dropStyle={{
              width: '300px',
              height: '290px',
              top: '105px',
              left: '370px',
            }}
            onClose={() => {
              setDefaultPngVisible(false);
            }}
          >
            <div className="defaultPng-container">
              {defaultGroupPng.map((defaultItem: any, defaultIndex: number) => {
                return (
                  <img
                    key={'defaultPng' + defaultIndex}
                    src={defaultItem}
                    alt=""
                    onClick={() => {
                      setGroupLogo(defaultItem);
                      setGroupSet('groupLogo', defaultItem);
                    }}
                  />
                );
              })}
            </div>
          </DropMenu>
        </div>
      </div>
    </div>
  );
};
export default GroupSet;
