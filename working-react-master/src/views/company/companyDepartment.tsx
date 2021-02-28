import React, { useState, useEffect, useRef } from 'react';
import { Tree } from 'tree-graph-react';
import './companyDepartment.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Button, Chip } from '@material-ui/core';
import { PeopleOutlineOutlined } from '@material-ui/icons';
import Dialog from '../../components/common/dialog';
import { Moveable } from '../../components/common/moveable';
import CompanySearchList from './companySearchList';
import { setMessage } from '../../redux/actions/commonActions';
import moment from 'moment';
import _ from 'lodash';
import api from '../../services/api';
import deletePng from '../../assets/img/deleteDiary.png';
import defaultPersonPng from '../../assets/svg/defaultPerson.svg';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
import defaultDepartMentSvg from '../../assets/svg/defaultDepartMent.svg';
import DropMenu from '../../components/common/dropMenu';
interface CompanyDepartmentProps {}
const columns1 = [
  {
    id: 'avatar',
    label: '头像',
    width: 15,
  },
  {
    id: 'nickName',
    label: '姓名',
    minWidth: 15,
  },
  {
    id: 'post',
    label: '职位',
    minWidth: 15,
  },
  {
    id: 'operation',
    label: '操作',
    width: 15,
  },
];
const columns2 = [
  // {
  //   id: 'updateTime',
  //   label: '更新时间',
  //   minWidth: 100,
  // },
  {
    id: 'groupLogo',
    label: '图标',
    minWidth: 20,
  },
  {
    id: 'groupName',
    label: '群名',
    minWidth: 20,
  },
  {
    id: 'operation',
    label: '操作',
    minWidth: 20,
  },
];

const CompanyDepartment: React.FC<CompanyDepartmentProps> = (props) => {
  const {} = props;
  const dispatch = useDispatch();
  const location = useLocation();
  console.log(location);
  const user = useTypedSelector((state) => state.auth.user);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const [rows, setRows] = useState<any>([]);
  const [companyData, setCompanyData] = useState<any>(null);
  const [companyObj, setCompanyObj] = useState<any>(null);
  const [nodeData, setNodeData] = useState<any>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);
  const [selectedId, setSelectedId] = useState<any>(null);
  const [startId, setStartId] = useState<any>(null);
  const [selectedPath, setSelectedPath] = useState<any>([]);
  const [selectedType, setSelectedType] = useState<any>(0);
  const [messageCheck, setMessageCheck] = useState<any>(0);

  const [total, setTotal] = useState<any>('');
  const [moreTop, setMoreTop] = useState<any>('');
  const [searchDialogShow, setSearchDialogShow] = useState(false);
  const [deleteDialogShow, setDeleteDialogShow] = useState(false);
  const [infoDialogShow, setInfoDialogShow] = useState(false);
  const [departmentType, setDepartmentType] = useState(1);

  const [departmentId, setDepartmentId] = useState<any>(null);

  const departmentRef: React.RefObject<any> = useRef();
  const targetTreeRef: React.RefObject<any> = useRef();
  let unDistory = true;
  useEffect(() => {
    if (user && groupInfo) {
      let newDepartmentType = 0;
      let typeArray = location.pathname.split('/');
      newDepartmentType = parseInt(typeArray[typeArray.length - 1]);
      setDepartmentType(newDepartmentType);
      getCompanyTree('', newDepartmentType);
      setSearchDialogShow(false);
    }
    return () => {
      unDistory = false;
    };
  }, [user, groupInfo, location]);
  // useEffect(() => {
  //   if (rowsPerPage * page < total) {
  //     getCompanyRow(page, rowsPerPage, companyObj);
  //   }
  // }, [page, companyObj, rowsPerPage]);
  // useEffect(() => {
  //   if (companyObj) {
  //     getCompanyRow(page, rowsPerPage, companyObj);
  //   }
  // }, [departmentIndex]);
  // useEffect(() => {
  //   if (startId && companyData && companyData[startId]) {
  //     setSelectedPath(companyData[startId].path);
  //   }
  // }, [startId]);
  const getCompanyTree = async (nodeId: any, type: number) => {
    let newRow: any = [];
    let newCompanyData: any = {};
    let newNodeData: any = {};
    let companyDepartmentRes: any = await api.company.getOrganizationTree(
      groupKey,
      type
    );
    if (unDistory) {
      if (companyDepartmentRes.msg === 'OK') {
        let data = companyDepartmentRes.result;
        for (let key in data) {
          newCompanyData[key] = {
            _key: data[key]._key,
            contract: false,
            father: data[key].parentOrgKey,
            name: data[key].name,
            // data[key].orgType === 1
            //   ? data[key].name
            //   : data[key].name +
            //     ' (' +
            //     (data[key].post ? data[key].post : '无职务') +
            //     ' )',
            path: data[key].path1,
            sortList: data[key].children,
            enterpriseGroupKey: data[key].enterpriseGroupKey,
            groupMemberKey: data[key].groupMemberKey,
            orgType: data[key].orgType,
            staffKey: data[key].staffKey,
            // disabled: data[key].orgType === 2,
            childrenAll: data[key].childrenAll,
          };
          if (data[key].orgType === 2) {
            //?imageMogr2/auto-orient/thumbnail/80x
            newCompanyData[key].icon = data[key].avatar
              ? data[key].avatar + '?roundPic/radius/!50p'
              : defaultPersonPng;
          }
          if (data[key].orgType === 3) {
            //?imageMogr2/auto-orient/thumbnail/80x
            newCompanyData[key].icon = data[key].groupLogo
              ? data[key].groupLogo  + '?imageMogr2/auto-orient/thumbnail/80x'
              : defaultGroupPng;
          }
          if (!nodeId && !data[key].parentOrgKey) {
            nodeId = data[key]._key;
            newCompanyData[key].icon = groupInfo.groupLogo
              ? groupInfo.groupLogo + '?imageMogr2/auto-orient/thumbnail/80x'
              : defaultGroupPng;
            setStartId(nodeId);
            setSelectedPath(newCompanyData[nodeId].path);
          }
        }
        // newCompanyData = addPath(newCompanyData, nodeId);
        newNodeData = formatData(newCompanyData, nodeId);
        chooseNode(newCompanyData[nodeId]);
        console.log('path', newCompanyData[nodeId].path);
        setSelectedId(nodeId);
        setNodeData(newNodeData);
        setCompanyData(newCompanyData);
      } else {
        dispatch(setMessage(true, companyDepartmentRes.msg, 'error'));
      }
    }
  };
  const formatData = (nodeObj: any, nodeId: string) => {
    let obj: any = {
      _key: nodeId,
      name: nodeObj[nodeId].name,
      children: [],
    };
    if (nodeObj[nodeId].sortList.length > 0) {
      nodeObj[nodeId].sortList.forEach((item: any) => {
        if (nodeObj[item].orgType === 1) {
          let nodeItem = formatData(nodeObj, item);
          obj.children.push(nodeItem);
        }
      });
    }
    return obj;
  };
  const addPath = (nodeObj: any, nodeId: string) => {
    nodeObj[nodeId].path = nodeObj[nodeId].father
      ? [
          ...nodeObj[nodeObj[nodeId].father].path,
          {
            name: nodeObj[nodeId].name,
            _key: nodeObj[nodeId]._key,
          },
        ]
      : [
          {
            name: nodeObj[nodeId].name,
            _key: nodeObj[nodeId]._key,
          },
        ];
    if (nodeObj[nodeId].sortList.length > 0) {
      nodeObj[nodeId].sortList.forEach((item: any) => {
        addPath(nodeObj, item);
      });
    }
    return nodeObj;
  };
  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const chooseNode = async (node: any) => {
    setSelectedId(node._key);
    // setSelectedType(node.orgType);
    setDepartmentId(node._key);
    // setDepartmentIndex(0);
    setPage(0);
    setCompanyObj(node);
    setRows([]);
    // getCompanyRow(0, rowsPerPage, node);
  };
  const clickDot = (node: any) => {
    // targetTreeRef.current.closeOptions();
    setStartId(node._key);
    setSelectedPath(companyData[node._key].path);
    getCompanyTree(node._key, departmentType);
    // setSelectedPath(nodeObj[node._key].path1);
  };
  const addCompany = async (selectedNode: any, type: string) => {
    let newCompanyData = _.cloneDeep(companyData);
    let addCompanyRes: any = await api.company.addSonOrganization(
      type === 'child' ? selectedNode : newCompanyData[selectedNode].father,
      '',
      newCompanyData[selectedNode].enterpriseGroupKey
    );
    if (addCompanyRes.msg === 'OK') {
      newCompanyData[addCompanyRes.result._key] = {
        _key: addCompanyRes.result._key,
        contract: false,
        father: addCompanyRes.result.parentOrgKey,
        name: addCompanyRes.result.name,
        sortList: addCompanyRes.result.children,
        enterpriseGroupKey: addCompanyRes.result.enterpriseGroupKey,
        groupMemberKey: addCompanyRes.result.groupMemberKey,
        orgType: 1,
        // icon: defaultDepartMentSvg,
      };
      if (type === 'child') {
        newCompanyData[selectedNode].sortList.push(addCompanyRes.result._key);
      } else {
        newCompanyData[newCompanyData[selectedNode].father].sortList.push(
          addCompanyRes.result._key
        );
      }
      setSelectedId(addCompanyRes.result._key);
      setSelectedType(addCompanyRes.result.orgType);
      setCompanyData(newCompanyData);
      targetTreeRef.current.rename();
    } else {
      dispatch(setMessage(true, addCompanyRes.msg, 'error'));
    }
  };
  const editTaskText = async (nodeId: string, text: string) => {
    // if (companyObj) {
    //   nodeId = _.cloneDeep(companyObj)._key;
    // }

    let newCompanyData = _.cloneDeep(companyData);
    if (newCompanyData[nodeId].orgType === 1) {
      let updateCompanyRes: any = await api.company.updateOrgOrStaffProperty(
        1,
        nodeId,
        { name: text }
      );
      if (updateCompanyRes.msg === 'OK') {
        newCompanyData[nodeId].name = text;
        setCompanyData(newCompanyData);
      } else {
        dispatch(setMessage(true, updateCompanyRes.msg, 'error'));
      }
    } else {
      dispatch(setMessage(true, '组织机构才能修改名称', 'error'));
    }
  };
  const editContract = (node: any) => {
    let newCompanyData = _.cloneDeep(companyData);
    newCompanyData[node._key].contract = !node.contract;
    setCompanyData(newCompanyData);
  };
  const deleteDepartment = async (departmentId: string) => {
    setDeleteDialogShow(false);
    let newCompanyData = _.cloneDeep(companyData);
    let newRow = _.cloneDeep(rows);
    console.log(departmentId);
    let deleteRes: any = await api.company.deleteOrgOrStaff(departmentId);
    if (deleteRes.msg === 'OK') {
      // if (newCompanyData[selectedId].orgType === 2) {
      let rowIndex = _.findIndex(newRow, { staffKey: departmentId });
      if (rowIndex !== -1) {
        newRow.splice(rowIndex, 1);
        setRows(newRow);
      }
      // }
      let targetNodeIndex = newCompanyData[
        newCompanyData[departmentId].father
      ].sortList.indexOf(departmentId);
      if (targetNodeIndex !== -1) {
        chooseNode(newCompanyData[newCompanyData[departmentId].father]);
        delete newCompanyData[departmentId];
        setCompanyData(newCompanyData);
      }
      dispatch(setMessage(true, '删除成功', 'success'));
    } else {
      dispatch(setMessage(true, deleteRes.msg, 'error'));
    }
    //}
  };
  const changeRole = async (e: any, index: number, columnIndex: number) => {
    let newRow = _.cloneDeep(rows);
    let newCompanyObj = _.cloneDeep(companyObj);

    for (let key in newRow[index]) {
      if (key.indexOf('targetRole') !== -1 && newRow[index][key]) {
        newRow[index][key] = undefined;
      }
    }
    // if (targetRole !== 'targetRole' + columnIndex) {
    newRow[index]['targetRole' + columnIndex] = columnIndex;
    // }

    let roleRes: any = null;
    if (!newRow.checkIndex) {
      roleRes = await api.group.addGroupMember(newRow[index].groupKey, [
        {
          userKey: newCompanyObj.staffKey,
          nickName: newCompanyObj.name,
          avatar: newCompanyObj.icon.replace('?roundPic/radius/!50p'),
          gender: 0,
          role: columnIndex,
        },
      ]);
    } else {
      roleRes = await api.auth.setRole(
        newRow[index].groupKey,
        companyObj.staffKey,
        columnIndex
      );
    }
    if (roleRes.msg === 'OK') {
      setRows(newRow);
    } else {
      dispatch(setMessage(true, roleRes.msg, 'error'));
    }
  };

  // const changePost = async (index: number) => {
  //   let newRow = _.cloneDeep(rows);
  //   let newCompanyData = _.cloneDeep(companyData);
  //   let updateCompanyRes: any = await api.company.updateOrgOrStaffProperty(
  //     2,
  //     newRow[index].staffKey,
  //     { post: postInput }
  //   );
  //   if (updateCompanyRes.msg === 'OK') {
  //     newCompanyData[newRow[index].staffKey].name =
  //       newRow[index].nickName + '( ' + postInput + ' )';
  //     setCompanyData(newCompanyData);
  //   } else {
  //     dispatch(setMessage(true, updateCompanyRes.msg, 'error'));
  //   }
  // };
  const addMember = async (node: any) => {
    const newCompanyObj = _.cloneDeep(companyObj);
    const newCompanyData = _.cloneDeep(companyData);
    let addMemberRes: any = null;
    if (departmentType === 2) {
      addMemberRes = await api.company.batchAddOrgStaff(
        newCompanyObj._key,
        [node._key],
        newCompanyObj.enterpriseGroupKey
      );
    } else {
      addMemberRes = await api.company.batchAddOrgGroup(
        newCompanyObj._key,
        [node._key],
        newCompanyObj.enterpriseGroupKey
      );
    }
    if (addMemberRes.msg === 'OK') {
      if (addMemberRes.result.length > 0) {
        dispatch(setMessage(true, '添加到组织成功', 'success'));
        getCompanyTree(newCompanyObj._key, departmentType);
      } else if (addMemberRes.result.length === 0) {
        dispatch(setMessage(true, '该节点已经被添加', 'error'));
      }

      //   // let date = addMemberRes.result[0];
      //   // newCompanyData[date.parentOrgKey].sortList.push(date._key);
      //   // newCompanyData[date._key] = {
      //   //   _key: date._key,
      //   //   contract: false,
      //   //   father: date.parentOrgKey,
      //   //   name: date.name + ' (' + (date.post ? date.post : '无职务') + ' )',
      //   //   sortList: date.children,
      //   //   enterpriseGroupKey: date.enterpriseGroupKey,
      //   //   groupMemberKey: date.groupMemberKey,
      //   //   orgType: date.orgType,
      //   //   staffKey: date.staffKey,
      //   //   disabled: date.orgType === 2,
      //   // };
      //   // setCompanyData(newCompanyData);
    } else {
      dispatch(setMessage(true, addMemberRes.msg, 'error'));
    }
  };
  const dragNode = async (dragInfo: any) => {
    let newCompanyData = _.cloneDeep(companyData);
    let newTargetNode = _.cloneDeep(newCompanyData[dragInfo.dragNodeId]);
    let obj = {};

    let fatherKey = newCompanyData[dragInfo.dropNodeId].father;
    let targetFatherKey = newCompanyData[dragInfo.dragNodeId].father;

    let sortIndex = newCompanyData[targetFatherKey].sortList.indexOf(
      dragInfo.dragNodeId
    );
    let childrenAllIndex = newCompanyData[targetFatherKey].childrenAll.indexOf(
      dragInfo.dragNodeId
    );

    if (dragInfo.placement === 'in') {
      if (newCompanyData[dragInfo.dropNodeId].orgType === 1) {
        newCompanyData[dragInfo.dropNodeId].sortList.push(dragInfo.dragNodeId);
        newCompanyData[dragInfo.dropNodeId].childrenAll.push(
          dragInfo.dragNodeId
        );
        newCompanyData[dragInfo.dragNodeId].father = dragInfo.dropNodeId;
        obj = {
          oldFatherOrgKey: targetFatherKey,
          sonOrgKey: dragInfo.dragNodeId,
          newFatherOrgKey: dragInfo.dropNodeId,
          childrenIndex:
            newCompanyData[dragInfo.dropNodeId].childrenAll.length - 1,
        };
      } else {
        dispatch(setMessage(true, '组织机构下才能添加子节点', 'error'));
        return;
      }
    } else if (fatherKey) {
      let nodeIndex = newCompanyData[fatherKey].childrenAll.indexOf(
        dragInfo.dropNodeId
      );
      //删除原父亲的children
      //增加原父亲的children
      newCompanyData[fatherKey].sortList.splice(
        dragInfo.placement === 'up' ? nodeIndex : nodeIndex + 1,
        0,
        dragInfo.dragNodeId
      );
      newCompanyData[fatherKey].childrenAll.splice(
        dragInfo.placement === 'up' ? nodeIndex : nodeIndex + 1,
        0,
        dragInfo.dragNodeId
      );
      //改变父亲
      newTargetNode.father = fatherKey;
      newCompanyData[dragInfo.dragNodeId].father = fatherKey;

      obj = {
        oldFatherOrgKey: targetFatherKey,
        sonOrgKey: dragInfo.dragNodeId,
        newFatherOrgKey: fatherKey,
        childrenIndex: dragInfo.placement === 'up' ? nodeIndex : nodeIndex + 1,
      };

      if (fatherKey === targetFatherKey) {
        sortIndex = dragInfo.placement === 'up' ? sortIndex + 1 : sortIndex;
        childrenAllIndex =
          dragInfo.placement === 'up' ? sortIndex + 1 : sortIndex;
      }
    }
    newCompanyData[targetFatherKey].sortList.splice(sortIndex, 1);
    newCompanyData[targetFatherKey].childrenAll.splice(childrenAllIndex, 1);
    console.log(dragInfo, obj);
    let treeRelationRes: any = await api.company.changeTreeCompanyRelation(obj);
    if (treeRelationRes.msg === 'OK') {
      setCompanyData(newCompanyData);
      // setGridList(newGridList);
    } else {
      dispatch(setMessage(true, treeRelationRes.msg, 'error'));
    }
  };
  const editSortList = async (id: string, sortList: any, type: string) => {
    console.log(id, sortList, type);

    let newCompanyData = _.cloneDeep(companyData);
    let newTargetNode = _.cloneDeep(newCompanyData[id]);
    let fatherKey = newCompanyData[id].father;
    let obj = {};
    let sortIndex = sortList.indexOf(id);
    let targetIndex = newCompanyData[fatherKey].childrenAll.indexOf(id) + 1;
    let nodeIndex = 0;
    if (sortIndex !== 0) {
      nodeIndex =
        newCompanyData[fatherKey].childrenAll.indexOf(sortList[sortIndex - 1]) +
        1;
    }
    //删除原父亲的children
    //增加原父亲的children

    obj = {
      oldFatherOrgKey: fatherKey,
      sonOrgKey: id,
      newFatherOrgKey: fatherKey,
      childrenIndex: nodeIndex,
    };
    newCompanyData[fatherKey].childrenAll.splice(targetIndex, 1);
    newCompanyData[fatherKey].childrenAll.splice(nodeIndex, 0, id);
    newCompanyData[fatherKey].sortList = sortList;
    console.log(nodeIndex);
    let treeRelationRes: any = await api.company.changeTreeCompanyRelation(obj);
    if (treeRelationRes.msg === 'OK') {
      setCompanyData(newCompanyData);
      //   // setGridList(newGridList);
    } else {
      dispatch(setMessage(true, treeRelationRes.msg, 'error'));
    }
  };
  return (
    <div className="company-info">
      <div className="company-header">
        <div className="company-header-title">
          组织结构
          {companyObj && companyObj.orgType === 1 ? (
            <Chip
              variant="outlined"
              color="primary"
              label={'当前组织 : ' + companyObj.name}
              style={{ fontSize: '14px', marginLeft: '10px' }}
              size="small"
            />
          ) : null}
        </div>
        <div className="company-header-right">
          {departmentType === 2 && companyObj?.orgType === 1 ? (
            <Button
              variant="outlined"
              color="primary"
              // className={classes.button}
              startIcon={<PeopleOutlineOutlined />}
              onClick={() => {
                setSearchDialogShow(true);
              }}
            >
              人员设置
            </Button>
          ) : null}
          {departmentType === 3 && companyObj?.orgType === 1 ? (
            <Button
              variant="outlined"
              color="primary"
              // className={classes.button}
              startIcon={<PeopleOutlineOutlined />}
              onClick={() => {
                setSearchDialogShow(true);
              }}
            >
              项目管理
            </Button>
          ) : null}
        </div>
      </div>

      <div
        className="company-info-container companyDepartment"
        ref={departmentRef}
      >
        <div className="companyDepartment-top">
          <div className="companyDepartment-path">
            {selectedPath
              ? selectedPath.map((pathItem: any, pathIndex: number) => {
                  return (
                    <React.Fragment key={'path' + pathIndex}>
                      <div
                        onClick={() => {
                          setStartId(pathItem._key);
                          setSelectedPath(companyData[pathItem._key].path);
                        }}
                        style={{
                          fontWeight:
                            startId === pathItem._key ? 'bold' : 'normal',
                        }}
                        className="companyDepartment-path-item"
                      >
                        {pathItem.name}
                        <div className="companyDepartment-path-icon">
                          <div className="companyDepartment-path-icon-top"></div>
                          <div className="companyDepartment-path-icon-bottom"></div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })
              : null}
          </div>
        </div>
        <div className="companyDepartment-left">
          {companyData && startId ? (
            <Moveable
              scrollable={true}
              style={{ display: 'flex' }}
              rightClickToStart={true}
            >
              <Tree
                // disabled
                handleClickMoreButton={(node: any) => {
                  if (companyData[node._key].orgType === 1) {
                    setMoreTop(node.y);
                    setInfoDialogShow(true);
                  }
                }}
                ref={targetTreeRef}
                nodes={companyData}
                uncontrolled={false}
                showIcon={true}
                showMoreButton
                startId={startId}
                // selectedBackgroundColor="#E3E3E3"
                defaultSelectedId={selectedId}
                handleClickNode={(node: any) => {
                  chooseNode(node);
                }}
                handleAddChild={(selectedNode: any) => {
                  addCompany(selectedNode, 'child');
                }}
                handleAddNext={(selectedNode: any) => {
                  addCompany(selectedNode, 'next');
                }}
                handleChangeNodeText={(nodeId: string, text: string) => {
                  editTaskText(nodeId, text);
                }}
                handleClickExpand={editContract}
                handleDeleteNode={(nodeId: any) => {
                  setDeleteDialogShow(true);
                }}
                handleDrag={dragNode}
                handleClickDot={
                  clickDot
                  // setSelectedId(node._key);
                }
                handleShiftUpDown={editSortList}
                // itemHeight={32}
                // blockHeight={
                //   departmentRef.current ? departmentRef.current.offsetHeight : 0
                // }
              />
            </Moveable>
          ) : null}
        </div>
        {/* <div className="companyDepartment-right">
          <Tabs
            value={departmentIndex}
            indicatorColor="primary"
            textColor="primary"
            onChange={(event: React.ChangeEvent<{}>, newValue: number) => {
              setDepartmentIndex(newValue);
            }}
          >
            <Tab label="人员列表" />
            <Tab label="群组列表" />
          </Tabs>
         
          <div className="companyDepartment-add-button">
            <IconButton
              color="primary"
              component="span"
              onClick={() => {
                setSearchDialogShow(true);
              }}
            >
              <AddCircleOutline />
            </IconButton>
          </div>
        </div>
         */}
        <DropMenu
          visible={infoDialogShow}
          onClose={() => {
            setInfoDialogShow(false);
          }}
          title={'节点详情'}
          dropStyle={{
            top: moreTop - 20,
            left: '240px',
            width: '200px',
            height: '180px',
          }}
        >
          <div
            className="company-choose-info"
            onClick={() => {
              addCompany(selectedId, 'child');
            }}
          >
            新增子节点
          </div>
          <div
            className="company-choose-info"
            onClick={() => {
              addCompany(selectedId, 'next');
            }}
          >
            新增节点
          </div>
          <div
            className="company-choose-info"
            onClick={() => {
              setDeleteDialogShow(true);
            }}
          >
            删除节点
          </div>
        </DropMenu>
      </div>
      <Dialog
        visible={deleteDialogShow}
        onClose={() => {
          setDeleteDialogShow(false);
        }}
        onOK={() => {
          deleteDepartment(departmentId);
        }}
        title={'删除节点'}
        dialogStyle={{ width: '400px', height: '200px' }}
      >
        <div className="dialog-onlyTitle">
          是否删除该{departmentType === 2 ? '成员' : '群组'}
        </div>
      </Dialog>
      <Dialog
        visible={searchDialogShow}
        onClose={() => {
          setSearchDialogShow(false);
        }}
        title={'新增关联'}
        dialogStyle={{
          position: 'fixed',
          top: '0px',
          right: '0px',
          width: '400px',
          height: '100%',
          overflow: 'auto',
          padding: '0px 15px',
        }}
        footer={false}
        showMask={false}
        unOut={false}
      >
        <CompanySearchList
          addMember={addMember}
          targetGroupKey={companyObj && companyObj.enterpriseGroupKey}
          searchType={departmentType}
          companyObj={companyObj}
          // nodeData={nodeData}
          startId={startId}
          deleteDepartment={deleteDepartment}
        />
      </Dialog>
    </div>
  );
};
CompanyDepartment.defaultProps = {};
export default CompanyDepartment;
