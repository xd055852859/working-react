import React, { useState, useEffect, useRef } from 'react';
import { MenuTree } from 'tree-graph-react';
import './companyDepartment.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { getGroup } from '../../redux/actions/groupActions';
import _ from 'lodash';
import api from '../../services/api';
import Dialog from '../../components/common/dialog';
import GroupSet from '../../views/tabs/groupSet';
import defaultPersonPng from '../../assets/img/defaultPerson.png';
import CompanySearchList from './companySearchList';
import CompanySearch from './companySearch';
import DropMenu from '../../components/common/dropMenu';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Checkbox,
  IconButton,
} from '@material-ui/core';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import deletePng from '../../assets/img/deleteDiary.png';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
import { setMessage } from '../../redux/actions/commonActions';
interface CompanyGroupProps {}
const columns = [
  {
    id: 'avatar',
    label: '头像',
    minWidth: 100,
  },
  {
    id: 'name',
    label: '姓名',
    minWidth: 100,
  },
  {
    id: 'targetRole2',
    label: '管理员',
    minWidth: 100,
  },
  {
    id: 'targetRole3',
    label: '编辑',
    minWidth: 100,
  },
  {
    id: 'targetRole4',
    label: '作者',
    minWidth: 100,
  },
  {
    id: 'targetRole5',
    label: '成员',
    minWidth: 100,
  },
  {
    id: 'operation',
    label: '操作',
    minWidth: 170,
  },
];
const CompanyGroup: React.FC<CompanyGroupProps> = (props) => {
  const {} = props;
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const [rows, setRows] = useState<any>([]);
  const [page, setPage] = React.useState(0);

  const [companyData, setCompanyData] = useState<any>(null);
  const [companyObj, setCompanyObj] = useState<any>(null);
  const [groupObj, setGroupObj] = useState<any>(null);
  const [targetGroupInfo, setTargetGroupInfo] = useState<any>(null);
  const [targetGroupKey, setTargetGroupKey] = useState<any>('');
  const [moreTop, setMoreTop] = useState<any>('');
  const [rowsPerPage, setRowsPerPage] = React.useState(100);
  const [selectedId, setSelectedId] = useState<any>(null);
  const [userId, setUserId] = useState<any>('');
  const [startId, setStartId] = useState<any>(null);
  const [searchDialogShow, setSearchDialogShow] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [infoDialogShow, setInfoDialogShow] = useState(false);
  const [setDialogShow, setSetDialogShow] = useState(false);
  const [deleteDialogShow, setDeleteDialogShow] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const departmentRef: React.RefObject<any> = useRef();
  const targetTreeRef: React.RefObject<any> = useRef();
  let unDistory = true;
  useEffect(() => {
    if (user && groupInfo) {
      console.log(groupInfo, groupKey);
      getGroupTree('');
    }
    return () => {
      unDistory = false;
    };
  }, [user, groupInfo]);
  const getGroupTree = async (nodeId: any) => {
    let newRow: any = [];
    let newCompanyData: any = {};
    let companyDepartmentRes: any = await api.company.getLeaderGroupTree(
      groupKey
    );
    if (unDistory) {
      if (companyDepartmentRes.msg === 'OK') {
        let data = companyDepartmentRes.result;
        for (let key in data) {
          newCompanyData[key] = {
            _key: data[key]._key,
            contract: false,
            father: data[key].parentGroupKey,
            name: data[key].groupName,
            sortList: data[key].children,
            role: data[key].groupRole,
            icon: data[key].groupLogo
              ? data[key].groupLogo + '?imageMogr2/auto-orient/thumbnail/80x'
              : defaultGroupPng,
          };
          if (!data[key].parentGroupKey && !nodeId) {
            setStartId(data[key]._key);
            nodeId = data[key]._key;
            chooseNode(data[key]);
          }
        }
        setSelectedId(nodeId);
        setCompanyData(newCompanyData);
      } else {
        dispatch(setMessage(true, companyDepartmentRes.msg, 'error'));
      }
    }
  };
  const chooseNode = async (node: any) => {
    let newRow: any = [];
    getTargetGroup(node._key);
    let chooseCompanyRes: any = await api.member.getMember(node._key);
    if (chooseCompanyRes.msg === 'OK') {
      chooseCompanyRes.result.map((item: any, index: number) => {
        newRow.push({
          name: item.nickName,
          avatar: item.avatar,
          role: node.role,
          userId: item.userId,
          groupId: item.groupId,
        });
        newRow[newRow.length - 1]['targetRole' + item.role] = item.role;
        newRow[newRow.length - 1].checkIndex = item.role;
      });

      setPage(0);
      setSelectedId(node._key);
      setRows(newRow);
      setCompanyObj(node);
      // setRows(newRow);
    } else {
      dispatch(setMessage(true, chooseCompanyRes.msg, 'error'));
    }
  };
  const addChildrenGroup = async (selectedNode: any, type: string) => {
    let newCompanyData = _.cloneDeep(companyData);
    let obj = {
      groupName: '子群',
      groupDesc: '',
      groupLogo: '',
      modelUrl: '',
      isOpen: true,
      joinType: 1,
      password: '',
      question: '',
      isHasPassword: false,
      isLinkJoin: false,
      defaultPower: 5,
      enterprise: 1,
      statisticsSonGroupEnergy: false,
    };
    let groupRes: any = await api.group.addGroup(obj);
    if (groupRes.msg === 'OK') {
      let sonGroupRes: any = await api.group.setSonGroup(
        type === 'child' ? selectedNode : newCompanyData[selectedNode].father,
        groupRes.result._key
      );
      if (sonGroupRes.msg === 'OK') {
        newCompanyData[groupRes.result._key] = {
          _key: groupRes.result._key,
          contract: false,
          father: groupRes.result.parentGroupKey,
          name: groupRes.result.groupName,
          sortList: groupRes.result.children,
          role: 1,
          icon: defaultGroupPng,
        };
        if (type === 'child') {
          newCompanyData[selectedNode].sortList.push(groupRes.result._key);
        } else {
          newCompanyData[newCompanyData[selectedNode].father].sortList.push(
            groupRes.result._key
          );
        }
        console.log('groupKey', groupRes.result._key);
        setCompanyData(newCompanyData);
        setSelectedId(groupRes.result._key);
        dispatch(getGroup(3));
        targetTreeRef.current.rename();
      } else {
        dispatch(setMessage(true, sonGroupRes.msg, 'error'));
      }
    } else {
      dispatch(setMessage(true, groupRes.msg, 'error'));
    }
    // let addCompanyRes: any = await api.company.addSonOrganization(
    //   type === 'child' ? selectedNode : newCompanyData[selectedNode].father,
    //   '',
    //   newCompanyData[selectedNode].enterpriseGroupKey
    // );
    // if (addCompanyRes.msg === 'OK') {
    //   newCompanyData[addCompanyRes.result._key] = {
    //     _key: addCompanyRes.result._key,
    //     contract: false,
    //     father: addCompanyRes.result.parentOrgKey,
    //     name: addCompanyRes.result.name,
    //     sortList: addCompanyRes.result.children,
    //     enterpriseGroupKey: addCompanyRes.result.enterpriseGroupKey,
    //     groupMemberKey: addCompanyRes.result.groupMemberKey,
    //   };
    //   if (type === 'child') {
    //     newCompanyData[selectedNode].sortList.push(addCompanyRes.result._key);
    //   } else {
    //     newCompanyData[newCompanyData[selectedNode].father].sortList.push(
    //       addCompanyRes.result._key
    //     );
    //   }
    //   setSelectedId(addCompanyRes.result._key);
    //   setSelectedType(addCompanyRes.result.orgType);
    //   setCompanyData(newCompanyData);
    //   targetTreeRef.current.rename();
    // } else {
    //   dispatch(setMessage(true, addCompanyRes.msg, 'error'));
    // }
  };
  const changeRole = (e: any, index: number, columnIndex: number) => {
    let newRow = _.cloneDeep(rows);
    let targetRole = '';
    for (let key in newRow[index]) {
      if (key.indexOf('targetRole') !== -1 && newRow[index][key]) {
        targetRole = key;
        newRow[index][key] = undefined;
      }
    }
    // if (targetRole !== 'targetRole' + (columnIndex + 1)) {
    newRow[index]['targetRole' + (columnIndex + 1)] = columnIndex + 1;
    // }
    api.auth.setRole(
      newRow[index].groupId,
      newRow[index].userId,
      columnIndex + 1
    );
    setRows(newRow);
  };
  const deleteGroup = async () => {
    setDeleteDialogShow(false);
    let newCompanyData = _.cloneDeep(companyData);
    let deleteRes: any = await api.group.deleteFSGroup(
      newCompanyData[selectedId].father,
      selectedId
    );
    if (deleteRes.msg === 'OK') {
      let targetNodeIndex = newCompanyData[
        newCompanyData[selectedId].father
      ].sortList.indexOf(selectedId);
      if (targetNodeIndex !== -1) {
        setSelectedId(newCompanyData[selectedId].father);
        newCompanyData[newCompanyData[selectedId].father].sortList.splice(
          targetNodeIndex,
          1
        );
        delete newCompanyData[selectedId];
      }
      setCompanyData(newCompanyData);
      dispatch(setMessage(true, '删除父子关系成功', 'success'));
    } else {
      dispatch(setMessage(true, deleteRes.msg, 'error'));
    }
    //}
  };
  const editGroupName = async (nodeId: string, text: string) => {
    let newCompanyData = _.cloneDeep(companyData);
    let updateCompanyRes: any = await api.group.changeGroupInfo(nodeId, {
      groupName: text,
    });
    if (updateCompanyRes.msg === 'OK') {
      newCompanyData[nodeId].name = text;
      setCompanyData(newCompanyData);
    } else {
      dispatch(setMessage(true, updateCompanyRes.msg, 'error'));
    }
  };
  const addMemberNode = async (node: any) => {
    const newCompanyObj = _.cloneDeep(companyObj);
    const newRow = _.cloneDeep(rows);
    let addMemberRes: any = await api.group.addGroupMember(newCompanyObj._key, [
      {
        userKey: node.staffKey,
        // nickName: node.name,
        // avatar: node.avatar,
        // gender: node.gender,
        role: 4,
      },
    ]);
    if (addMemberRes.msg === 'OK') {
      dispatch(setMessage(true, '添加成员成功', 'success'));
      newRow.push({
        name: node.name.split('(')[0],
        role: 1,
        userId: node.staffKey,
        groupId: newCompanyObj._key,
        targetRole4: 4,
        checkIndex: 4,
      });
      setRows(newRow);
    } else {
      dispatch(setMessage(true, addMemberRes.msg, 'error'));
    }
  };
  const addMember = async (node: any) => {
    console.log('node', node);
    const newCompanyObj = _.cloneDeep(companyObj);
    const newRow = _.cloneDeep(rows);
    let addMemberRes: any = await api.group.addGroupMember(newCompanyObj._key, [
      {
        userKey: node.userId,
        role: 4,
      },
    ]);
    if (addMemberRes.msg === 'OK') {
      dispatch(setMessage(true, '添加群成员成功', 'success'));
      newRow.push({
        name: node.nickName,
        avatar: node.avatar,
        role: 1,
        userId: node.userId,
        groupId: newCompanyObj._key,
        targetRole4: 5,
        checkIndex: 4,
      });
      setRows(newRow);
    } else {
      dispatch(setMessage(true, addMemberRes.msg, 'error'));
    }
  };
  const deleteGroupMember = async () => {
    const newRow = _.cloneDeep(rows);
    let memberRes: any = await api.group.deleteGroupMember(groupKey, [userId]);
    if (memberRes.msg === 'OK') {
      dispatch(setMessage(true, '删除群成员成功', 'success'));
      let userIndex = _.findIndex(newRow, { userId: userId });
      if (userIndex !== -1) {
        newRow.splice(userIndex, 1);
      }
      setDeleteVisible(false);
      setRows(newRow);
    } else {
      dispatch(setMessage(true, memberRes.msg, 'error'));
    }
  };
  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };
  const saveGroupSet = (obj: any) => {
    setGroupObj(obj);
  };
  const setGroup = async () => {
    if (groupObj) {
      let groupRes: any = await api.group.changeGroupInfo(
        targetGroupKey,
        groupObj
      );
      if (groupRes.msg === 'OK') {
        getGroupTree(groupInfo.taskTreeRootCardKey);
        setTargetGroupInfo(null);
        setSetDialogShow(false);
        dispatch(setMessage(true, '编辑子群成功', 'success'));
      } else {
        dispatch(setMessage(true, groupRes.msg, 'error'));
      }
      // dispatch(changeGroupInfo(groupKey, groupObj));
    }
  };
  const getTargetGroup = async (groupKey: string) => {
    let groupRes: any = await api.group.getGroupInfo(groupKey);
    if (groupRes.msg === 'OK') {
      setTargetGroupKey(groupKey);
      setTargetGroupInfo(groupRes.result);
    } else {
      dispatch(setMessage(true, groupRes.msg, 'error'));
    }
  };
  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const editContract = (node: any) => {
    let newCompanyData = _.cloneDeep(companyData);
    newCompanyData[node._key].contract = !node.contract;
    setCompanyData(newCompanyData);
  };
  return (
    <div className="company-info">
      <div className="company-header">
        <div className="company-header-title">项目群统一管理</div>
        <div className="company-header-right">
          <div
            className="company-button"
            onClick={() => {
              setSearchVisible(true);
            }}
            style={{ marginRight: '10px' }}
          >
            添加群成员
          </div>
          <div
            className="company-button"
            onClick={() => {
              setSearchDialogShow(true);
            }}
          >
            添加组织成员
          </div>
        </div>
      </div>
      <div
        className="company-info-container companyDepartment"
        ref={departmentRef}
      >
        <div className="companyDepartment-left">
          {companyData && startId ? (
            <MenuTree
              ref={targetTreeRef}
              nodes={companyData}
              uncontrolled={false}
              showMoreButton
              startId={startId}
              defaultSelectedId={selectedId}
              backgroundColor="#f5f5f5"
              color="#333"
              hoverColor="#595959"
              handleClickNode={(node: any) => {
                chooseNode(node);
              }}
              handleClickMoreButton={(node: any) => {
                setMoreTop(node.y);
                setInfoDialogShow(true);
              }}
              handleAddChild={(selectedNode: any) => {
                addChildrenGroup(selectedNode, 'child');
              }}
              handleAddNext={(selectedNode: any) => {
                addChildrenGroup(selectedNode, 'next');
              }}
              handleDeleteNode={(node: any) => {
                setDeleteDialogShow(true);
              }}
              handleChangeNodeText={(nodeId: string, text: string) => {
                editGroupName(nodeId, text);
              }}
              handleClickExpand={editContract}
            />
          ) : null}
        </div>
        <div className="companyDepartment-right">
          <TableContainer
            style={{
              height: 'calc(100% - 60px)',
            }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column: any) => (
                    <TableCell
                      key={column.id}
                      align="center"
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: any, index: number) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={'row' + index}
                      >
                        {columns.map((column: any, columnIndex: number) => {
                          const value = row[column.id];
                          return (
                            <React.Fragment key={column.id}>
                              {column.id === 'name' ? (
                                <TableCell align="center">
                                  {column.format && typeof value === 'number'
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              ) : column.id === 'operation' &&
                                rows[index].userId !== user._key ? (
                                <TableCell align="center">
                                  <IconButton
                                    color="primary"
                                    component="span"
                                    onClick={() => {
                                      setDeleteVisible(true);
                                      setUserId(rows[index].userId);
                                    }}
                                  >
                                    <img
                                      src={deletePng}
                                      alt=""
                                      style={{ height: '15px', width: '16px' }}
                                    />
                                  </IconButton>
                                </TableCell>
                              ) : column.id === 'avatar' ? (
                                <TableCell key={column.id} align="center">
                                  <div className="company-avatar-container ">
                                    <div className="company-avatar">
                                      <img
                                        src={
                                          row.avatar
                                            ? row.avatar +
                                              '?imageMogr2/auto-orient/thumbnail/80x'
                                            : defaultPersonPng
                                        }
                                        alt=""
                                      />
                                    </div>
                                  </div>
                                </TableCell>
                              ) : rows[index].userId !== user._key ? (
                                <TableCell align="center">
                                  <Checkbox
                                    checked={value ? true : false}
                                    disabled={
                                      rows[index].role > rows[index].checkIndex
                                        ? true
                                        : false
                                    }
                                    onChange={(e: any) => {
                                      changeRole(e, index, columnIndex);
                                      // setMessageCheck(e.target.checked);
                                    }}
                                    color="primary"
                                  />
                                </TableCell>
                              ) : (
                                <TableCell align="center"></TableCell>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            labelRowsPerPage="分页"
          />
        </div>
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
              addChildrenGroup(selectedId, 'child');
            }}
          >
            新增子群
          </div>
          <div
            className="company-choose-info"
            onClick={() => {
              addChildrenGroup(selectedId, 'next');
            }}
          >
            新增群
          </div>
          <div
            className="company-choose-info"
            onClick={() => {
              setSetDialogShow(true);
            }}
          >
            群属性
          </div>
        </DropMenu>
      </div>
      <Dialog
        visible={deleteDialogShow}
        onClose={() => {
          setDeleteDialogShow(false);
        }}
        onOK={() => {
          deleteGroup();
        }}
        title={'删除任务'}
        dialogStyle={{ width: '400px', height: '200px' }}
      >
        <div className="dialog-onlyTitle">是否删除父子群关系</div>
      </Dialog>
      <Dialog
        visible={deleteVisible}
        onClose={() => {
          setDeleteVisible(false);
        }}
        onOK={() => {
          deleteGroupMember();
        }}
        title={'删除群成员'}
        dialogStyle={{ width: '400px', height: '200px' }}
      >
        <div className="dialog-onlyTitle">是否删除该群成员</div>
      </Dialog>
      <Dialog
        visible={searchDialogShow}
        onClose={() => {
          setSearchDialogShow(false);
        }}
        title={'搜索人员'}
        dialogStyle={{
          position: 'fixed',
          top: '60px',
          right: '0px',
          width: '430px',
          height: 'calc(100% - 65px)',
          overflow: 'auto',
          padding: '0px 15px',
        }}
        footer={false}
        showMask={false}
      >
        <CompanySearch
          addMember={addMemberNode}
          targetGroupKey={groupInfo && groupInfo._key}
          searchType="添加"
        />
      </Dialog>
      <Dialog
        visible={searchVisible}
        onClose={() => {
          setSearchVisible(false);
        }}
        title={'搜索人员'}
        dialogStyle={{
          position: 'fixed',
          top: '60px',
          right: '0px',
          width: '600px',
          height: 'calc(100% - 65px)',
          overflow: 'auto',
          padding: '0px 15px',
        }}
        footer={false}
        showMask={false}
      >
        <CompanySearchList
          addMember={addMember}
          targetGroupKey={companyObj && companyObj._key}
          searchType="群"
        />
      </Dialog>
      <Dialog
        visible={setDialogShow}
        onClose={() => {
          setSetDialogShow(false);
          setTargetGroupInfo(null);
        }}
        onOK={() => {
          setGroup();
        }}
        title={'设置群属性'}
        dialogStyle={{
          width: '850px',
          height: '700px',
        }}
      >
        <GroupSet
          saveGroupSet={saveGroupSet}
          type={'企业'}
          groupInfo={targetGroupInfo}
        />
      </Dialog>
    </div>
  );
};
CompanyGroup.defaultProps = {};
export default CompanyGroup;
