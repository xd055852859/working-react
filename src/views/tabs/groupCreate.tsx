import React, { useState } from 'react';
import './tabs.css';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import api from '../../services/api';

import {
  setMessage,
  setCommonHeaderIndex,
  setMoveState,
} from '../../redux/actions/commonActions';
import {
  getGroup,
  getGroupInfo,
  setGroupKey,
} from '../../redux/actions/groupActions';
import Dialog from '../../components/common/dialog';
import GroupSet from './groupSet';
import GroupModel from './groupModel';
import addGroup1Png from '../../assets/img/addGroup1.png';
import addGroup2Png from '../../assets/img/addGroup2.png';

export interface GroupCreateProps {}
const GroupCreate: React.FC<GroupCreateProps> = (props) => {
  const dispatch = useDispatch();
  // const classes = useStyles();

  const [addVisible, setAddVisible] = React.useState(false);
  const [addModelVisible, setAddModelVisible] = React.useState(false);
  const [templateKey, setTemplateKey] = React.useState<any>(null);
  const [groupObj, setGroupObj] = React.useState<any>(null);
  const saveGroupSet = (obj: any) => {
    if (!isNaN(templateKey)) {
      obj.templateKey = templateKey;
    }
    setGroupObj(obj);
  };
  const addGroup = async () => {
    let newGroupObj = _.cloneDeep(groupObj);
    if (
      !newGroupObj ||
      !newGroupObj.groupName ||
      !newGroupObj.groupName.trim()
    ) {
      dispatch(setMessage(true, '请输入群名', 'error'));
      return;
    }
    let groupRes: any = await api.group.addGroup(newGroupObj);
    if (groupRes.msg === 'OK') {
      dispatch(setMessage(true, '创建群成功', 'success'));
      dispatch(setGroupKey(groupRes.result._key));
      dispatch(getGroupInfo(groupRes.result._key));
      dispatch(setCommonHeaderIndex(3));
      dispatch(setMoveState('in'));
      dispatch(getGroup(3));
      setAddVisible(false);
    } else {
      dispatch(setMessage(true, groupRes.msg, 'error'));
    }
  };
  return (
    <React.Fragment>
      <div className="addGroup-container">
        <div
          onClick={() => {
            setAddVisible(true);
            setGroupObj({});
          }}
          className="addGroup-item"
        >
          <img className="addGroup-item-img" src={addGroup1Png} alt="" />
          <div className="addGroup-item-title">
            <div>空白模板</div>
            <div>
              创建一个全新的项目。项目的成员、频道、属性可以创建以后自行调整。
            </div>
          </div>
        </div>

        <div
          onClick={() => {
            setAddModelVisible(true);
            setGroupObj({});
          }}
          className="addGroup-item"
        >
          <img className="addGroup-item-img" src={addGroup2Png} alt="" />
          <div className="addGroup-item-title">
            <div>通过模板</div>
            <div>
              通过模板创建一个项目。项目的成员、频道、属性可以创建以后自行调整。
            </div>
          </div>
        </div>
        {/* <div><img src={addGroup3Png} alt=""/><div><div></div><div></div></div></div> */}
      </div>
      <Dialog
        visible={addVisible}
        onClose={() => {
          setAddVisible(false);
        }}
        onOK={() => {
          addGroup();
        }}
        title={'添加群'}
        dialogStyle={{ width: '750px', height: '700px' }}
      >
        <GroupSet saveGroupSet={saveGroupSet} type={'创建'} />
      </Dialog>
      <Dialog
        visible={addModelVisible}
        onClose={() => {
          setAddModelVisible(false);
        }}
        title={'模板创群'}
        dialogStyle={{ width: '80%', height: '80%' }}
        footer={false}
      >
        <GroupModel
          toGroupSet={(key: string) => {
            setAddVisible(true);
            setAddModelVisible(false);
            setTemplateKey(key);
          }}
        />
      </Dialog>
    </React.Fragment>
  );
};
export default GroupCreate;
