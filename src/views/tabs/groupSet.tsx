import React, { useState, useEffect } from 'react';
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
import { useTypedSelector } from '../../redux/reducer/RootState';
import { setMessage } from '../../redux/actions/commonActions';
import DropMenu from '../../components/common/dropMenu';
import plusPng from '../../assets/img/contact-plus.png';
import _ from 'lodash';
import uploadFile from '../../components/common/upload';
import './groupSet.css';
interface GroupSetProps {
  saveGroupSet: any;
  type: string;
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
      marginRight: '10px',
      minWidth: '200px',
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
  const { saveGroupSet, type } = props;
  const dispatch = useDispatch();
  const uploadToken = useTypedSelector((state) => state.auth.uploadToken);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const groupRole = useTypedSelector((state) => state.group.groupRole);
  const [groupName, setGroupName] = useState('');
  const [enterprise, setEnterprise] = useState(false);
  const [statisticsSonGroupEnergy, setStatisticsSonGroupEnergy] = useState(
    false
  );
  const [groupDesc, setGroupDesc] = useState('');
  const [groupLogo, setGroupLogo] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [joinType, setJoinType] = useState('0');
  const [password, setPassword] = useState('');
  const [isHasPassword, setIsHasPassword] = useState(false);
  const [isLinkJoin, setIsLinkJoin] = useState(false);
  const [defaultPower, setDefaultPower] = useState(5);
  const [defaultPowerIndex, setDefaultPowerIndex] = useState(3);
  const [defaultPowerVisible, setDefaultPowerVisible] = useState(false);
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
  useEffect(() => {
    if (type === '设置' && groupInfo) {
      setGroupName(groupInfo.groupName ? groupInfo.groupName : '');
      setGroupDesc(groupInfo.groupDesc ? groupInfo.groupDesc : '');
      setGroupLogo(groupInfo.groupLogo ? groupInfo.groupLogo : '');
      setEnterprise(groupInfo.enterprise === 2 ? true : false);
      setStatisticsSonGroupEnergy(
        groupInfo.statisticsSonGroupEnergy
          ? groupInfo.statisticsSonGroupEnergy
          : false
      );
      setIsOpen(groupInfo.isOpen ? groupInfo.isOpen : false);
      setJoinType(groupInfo.joinType ? groupInfo.joinType + '' : '0');
      setPassword(groupInfo.password ? groupInfo.password : '');
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
    setGroupSet('enterprise', newEnterprise);
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
    setGroupSet('joinType', newJoinType);
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
  const changeJoin = (e: any) => {
    let newIsLinkJoin = e.target.checked;
    setIsLinkJoin(newIsLinkJoin);
    setGroupSet('isLinkJoin', newIsLinkJoin);
  };
  const changeRole = (value: any, index: number) => {
    let newDefaultPower = value;
    setDefaultPower(newDefaultPower);
    setDefaultPowerIndex(index);
    setGroupSet('defaultPower', newDefaultPower);
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
  const setGroupSet = (type: string, value: any) => {
    let obj: any = {
      groupName: groupName,
      groupDesc: groupDesc,
      groupLogo: groupLogo,
      isOpen: isOpen,
      joinType: parseInt(joinType, 10),
      password: password,
      isHasPassword: isHasPassword,
      isLinkJoin: isLinkJoin,
      defaultPower: defaultPower,
      enterprise: enterprise ? 2 : 1,
      statisticsSonGroupEnergy: statisticsSonGroupEnergy,
    };
    obj[type] = value;
    saveGroupSet(obj);
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
            <Checkbox
              checked={isHasPassword}
              style={{ marginRight: '10px' }}
              onChange={changeIsPassword}
              disabled={(groupRole > 2 || groupRole === 0) && type === '设置'}
            />
            验证口令通过后加入
            {isHasPassword ? (
              <TextField
                required
                id="outlined-basic"
                variant="outlined"
                label="口令"
                className={classes.input}
                style={{ marginLeft: '15px', width: '60%' }}
                value={password}
                onChange={changePassword}
                disabled={(groupRole > 2 || groupRole === 0) && type === '设置'}
              />
            ) : null}
          </div>
          {type === '设置' ? (
            <div className="contact-name-content">
              <Checkbox
                checked={isLinkJoin}
                onChange={changeJoin}
                style={{ marginRight: '10px' }}
                disabled={(groupRole > 2 || groupRole === 0) && type === '设置'}
              />
              邀请链接后加入
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
              >
                拷贝
              </Button>
            </div>
          ) : null}
          <div className="contact-name-content">
            <div className="contact-name-title">新成员默认权限</div>
            <div
              onClick={() => {
                if (groupRole > 0 && groupRole < 3) {
                  setDefaultPowerVisible(true);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              {roleArray[defaultPowerIndex].name}
            </div>
            <DropMenu
              visible={defaultPowerVisible}
              dropStyle={{
                width: '300px',
                height: '125px',
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
                    <div
                      key={'role' + roleIndex}
                      className="contact-role-item"
                      onClick={() => {
                        changeRole(roleItem.role, roleIndex);
                      }}
                    >
                      {roleItem.name}
                    </div>
                  );
                })}
              </div>
            </DropMenu>
          </div>
          <div className="contact-dialog-logo">
            <img src={plusPng} className="contact-dialog-icon" />
            {groupLogo ? (
              <img src={groupLogo} className="contact-dialog-groupLogo" />
            ) : null}
            <input
              type="file"
              accept="image/*"
              onChange={uploadImg}
              className="upload-img"
              disabled={(groupRole > 2 || groupRole === 0) && type === '设置'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default GroupSet;
