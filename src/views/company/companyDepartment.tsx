import React, { useState, useEffect, useRef } from 'react';
import { MenuTree } from 'tree-graph-react';
import './companyDepartment.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
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
import Dialog from '../../components/common/dialog';
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
    minWidth: 100,
  },
  {
    id: 'nickName',
    label: '姓名',
    minWidth: 100,
  },
  {
    id: 'mobile',
    label: '手机号',
    minWidth: 100,
  },
  {
    id: 'post',
    label: '职位',
    minWidth: 120,
  },
  {
    id: 'onlineTime',
    label: '最近上线时间',
    minWidth: 120,
  },
  {
    id: 'notActive',
    label: '在线',
    minWidth: 80,
  },
  {
    id: 'isLeader',
    label: '部门领导',
    minWidth: 80,
  },
  {
    id: 'operation',
    label: '操作',
    minWidth: 80,
  },
];
const columns2 = [
  // {
  //   id: 'updateTime',
  //   label: '更新时间',
  //   minWidth: 100,
  // },
  {
    id: 'groupName',
    label: '群名',
    minWidth: 200,
  },
  {
    id: 'groupLogo',
    label: '群图标',
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
  // {
  //   id: 'operation',
  //   label: '操作',
  //   minWidth: 100,
  // },
];

const CompanyDepartment: React.FC<CompanyDepartmentProps> = (props) => {
  const {} = props;
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const [rows, setRows] = useState<any>([]);
  const [companyData, setCompanyData] = useState<any>(null);
  const [companyObj, setCompanyObj] = useState<any>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [selectedId, setSelectedId] = useState<any>(null);
  const [startId, setStartId] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<any>(0);
  const [messageCheck, setMessageCheck] = useState<any>(0);
  const [postInput, setPostInput] = useState<any>('');
  const [total, setTotal] = useState<any>('');
  const [moreTop, setMoreTop] = useState<any>('');
  const [searchDialogShow, setSearchDialogShow] = useState(false);
  const [deleteDialogShow, setDeleteDialogShow] = useState(false);
  const [infoDialogShow, setInfoDialogShow] = useState(false);

  const departmentRef: React.RefObject<any> = useRef();
  const targetTreeRef: React.RefObject<any> = useRef();
  let unDistory = true;
  useEffect(() => {
    if (user && groupInfo) {
      getCompanyTree('');
    }
    return () => {
      unDistory = false;
    };
  }, [user, groupInfo]);
  useEffect(() => {
    if (rowsPerPage * page < total) {
      getCompanyRow(page, rowsPerPage, companyObj);
    }
  }, [page, companyObj]);

  const getCompanyTree = async (nodeId: any) => {
    let newRow: any = [];
    let newCompanyData: any = {};
    let companyDepartmentRes: any = await api.company.getOrganizationTree(
      groupKey
    );
    if (unDistory) {
      if (companyDepartmentRes.msg === 'OK') {
        let data = companyDepartmentRes.result;
        for (let key in data) {
          newCompanyData[key] = {
            _key: data[key]._key,
            contract: false,
            father: data[key].parentOrgKey,
            name:
              data[key].orgType === 1
                ? data[key].name
                : data[key].name +
                  ' (' +
                  (data[key].post ? data[key].post : '无职务') +
                  ' )',
            sortList: data[key].children,
            enterpriseGroupKey: data[key].enterpriseGroupKey,
            groupMemberKey: data[key].groupMemberKey,
            orgType: data[key].orgType,
            staffKey: data[key].staffKey,
            disabled: data[key].orgType === 2,
          };

          if (data[key].orgType === 1) {
            newCompanyData[key].icon = defaultDepartMentSvg;
          }
          if (data[key].orgType === 2) {
            //?imageMogr2/auto-orient/thumbnail/80x
            newCompanyData[key].icon = data[key].avatar
              ? data[key].avatar + '?roundPic/radius/!50p'
              : defaultPersonPng;
          }
          if (!nodeId && !data[key].parentOrgKey) {
            nodeId = data[key]._key;
            setStartId(data[key]._key);
            newCompanyData[key].icon = groupInfo.groupLogo
              ? groupInfo.groupLogo + '?imageMogr2/auto-orient/thumbnail/80x'
              : defaultGroupPng;
          }
        }
        console.log(newCompanyData);
        chooseNode(newCompanyData[nodeId]);
        setSelectedId(nodeId);
        setCompanyData(newCompanyData);
      } else {
        dispatch(setMessage(true, companyDepartmentRes.msg, 'error'));
      }
    }
  };
  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const getCompanyRow = async (page: number, limit: number, node: any) => {
    let newRow: any = [];
    if (page !== 0) {
      page = page + 1;
      newRow = _.cloneDeep(rows);
    }
    if (node.orgType === 1) {
      let companyPersonRes: any = await api.company.getCompanyList(
        2,
        node._key,
        1,
        rowsPerPage
      );
      if (unDistory) {
        if (companyPersonRes.msg === 'OK') {
          companyPersonRes.result.map((item: any, index: number) => {
            newRow.push({
              ...item,
            });
            newRow[newRow.length - 1].gender = item.gender ? '女' : '男';
            newRow[newRow.length - 1].birthday = moment(
              parseInt(item.birthday)
            ).format('YYYY/MM/DD');
            newRow[newRow.length - 1].staffKey = item.staffKey;
            newRow[newRow.length - 1].mobileArea =
              (item.mobileArea + '').indexOf('+') === -1
                ? '+' + item.mobileArea
                : item.mobileArea;
          });
          setRows(newRow);
        } else {
          dispatch(setMessage(true, companyPersonRes.msg, 'error'));
        }
      }
    } else if (node.orgType === 2) {
      let companyPersonRes: any = await api.company.getCompanyMemberList(
        node.enterpriseGroupKey,
        node.staffKey
      );
      if (unDistory) {
        if (companyPersonRes.msg === 'OK') {
          console.log(companyPersonRes);
          companyPersonRes.result.map((item: any, index: number) => {
            newRow[index] = {
              groupName: item.groupName,
              role: item.myRole,
              groupLogo: item.groupLogo,
            };
            newRow[index]['targetRole' + item.targetRole] = item.targetRole;
            newRow[index].checkIndex = item.targetRole;
          });
          setRows(newRow);
        } else {
          dispatch(setMessage(true, companyPersonRes.msg, 'error'));
        }
      }
    }
  };
  const chooseNode = async (node: any) => {
    console.log('node', node);
    setSelectedId(node._key);
    setSelectedType(node.orgType);
    setPage(0);
    setCompanyObj(node);
    setRows([]);
    getCompanyRow(0, rowsPerPage, node);
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
        icon: defaultDepartMentSvg,
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
    console.log(nodeId);
    let newCompanyData = _.cloneDeep(companyData);
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
  };
  const editContract = (node: any) => {
    let newCompanyData = _.cloneDeep(companyData);
    newCompanyData[node._key].contract = !node.contract;
    setCompanyData(newCompanyData);
  };
  const deleteDepartment = async () => {
    setDeleteDialogShow(false);
    let newCompanyData = _.cloneDeep(companyData);
    let newRow = _.cloneDeep(rows);
    let deleteRes: any = await api.company.deleteOrgOrStaff(selectedId);
    if (deleteRes.msg === 'OK') {
      if (newCompanyData[selectedId].orgType === 2) {
        let rowIndex = _.findIndex(newRow, { staffKey: selectedId });
        if (rowIndex !== -1) {
          newRow.splice(rowIndex, 1);
          setRows(newRow);
        }
      }
      let targetNodeIndex = newCompanyData[
        newCompanyData[selectedId].father
      ].sortList.indexOf(selectedId);
      if (targetNodeIndex !== -1) {
        chooseNode(newCompanyData[newCompanyData[selectedId].father]);
        delete newCompanyData[selectedId];
      }
      setCompanyData(newCompanyData);
      dispatch(setMessage(true, '删除成功', 'success'));
    } else {
      dispatch(setMessage(true, deleteRes.msg, 'error'));
    }
    //}
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
    api.auth.setRole(newRow[index], companyObj.staffKey, columnIndex + 1);
    setRows(newRow);
  };
  const changeLeader = async (index: number) => {
    let newRow = _.cloneDeep(rows);
    let updateCompanyRes: any = await api.company.updateOrgOrStaffProperty(
      2,
      newRow[index].staffKey,
      { isLeader: !newRow[index].isLeader ? 1 : 2 }
    );
    if (updateCompanyRes.msg === 'OK') {
      newRow[index].isLeader = !newRow[index].isLeader;
      setRows(newRow);
    } else {
      dispatch(setMessage(true, updateCompanyRes.msg, 'error'));
    }
  };
  const changePost = async (index: number) => {
    let newRow = _.cloneDeep(rows);
    let newCompanyData = _.cloneDeep(companyData);
    let updateCompanyRes: any = await api.company.updateOrgOrStaffProperty(
      2,
      newRow[index].staffKey,
      { post: postInput }
    );
    if (updateCompanyRes.msg === 'OK') {
      newCompanyData[newRow[index].staffKey].name =
        newRow[index].nickName + '( ' + postInput + ' )';
      setCompanyData(newCompanyData);
    } else {
      dispatch(setMessage(true, updateCompanyRes.msg, 'error'));
    }
  };
  const addMember = async (node: any) => {
    const newCompanyObj = _.cloneDeep(companyObj);
    const newCompanyData = _.cloneDeep(companyData);
    let addMemberRes: any = await api.company.batchAddOrgStaff(
      newCompanyObj._key,
      [node._key],
      newCompanyObj.enterpriseGroupKey
    );
    if (addMemberRes.msg === 'OK') {
      if (addMemberRes.result.length > 0) {
        dispatch(setMessage(true, '添加组织成员成功', 'success'));
        getCompanyTree(newCompanyObj._key);
      } else if (addMemberRes.result.length === 0) {
        dispatch(setMessage(true, '该成员已经被添加', 'error'));
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
      //   // console.log(newCompanyData);
      //   // setCompanyData(newCompanyData);
    } else {
      dispatch(setMessage(true, addMemberRes.msg, 'error'));
    }
  };
  return (
    <div className="company-info">
      <div className="company-header">
        <div className="company-header-title">组织结构</div>
        {companyObj && companyObj.orgType === 1 ? (
          <div
            className="company-button"
            onClick={() => {
              setSearchDialogShow(true);
            }}
          >
            添加组织成员
          </div>
        ) : null}
      </div>
      <div
        className="company-info-container companyDepartment"
        ref={departmentRef}
      >
        <div className="companyDepartment-left">
          {companyData && startId ? (
            <MenuTree
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
              backgroundColor="#f5f5f5"
              // selectedBackgroundColor="#E3E3E3"
              color="#333"
              hoverColor="#595959"
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
                if (companyData[nodeId].orgType === 1) {
                  setDeleteDialogShow(true);
                }
              }}
              // itemHeight={32}
              // blockHeight={
              //   departmentRef.current ? departmentRef.current.offsetHeight : 0
              // }
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
                  {selectedType === 1
                    ? columns1.map((column: any) => (
                        <TableCell
                          key={column.id}
                          align="center"
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))
                    : selectedType === 2
                    ? columns2.map((column: any) => (
                        <TableCell
                          key={column.id}
                          align="center"
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))
                    : null}
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
                        {selectedType === 1
                          ? columns1.map((column: any) => {
                              const value = row[column.id];
                              return (
                                <React.Fragment>
                                  {column.id === 'isLeader' ? (
                                    <TableCell align="center">
                                      <Checkbox
                                        checked={
                                          rows[index].isLeader ? true : false
                                        }
                                        onChange={(e: any) => {
                                          changeLeader(index);
                                          // setMessageCheck(e.target.checked);
                                        }}
                                        color="primary"
                                      />
                                    </TableCell>
                                  ) : column.id === 'post' ? (
                                    <TableCell align="center">
                                      <input
                                        type="text"
                                        value={rows[index].post}
                                        onChange={(e: any) => {
                                          let newRow = _.cloneDeep(rows);
                                          setPostInput(e.target.value);
                                          newRow[index].post = e.target.value;
                                          setRows(newRow);
                                        }}
                                        onBlur={(e: any) => {
                                          changePost(index);
                                        }}
                                      />
                                    </TableCell>
                                  ) : column.id === 'operation' ? (
                                    <TableCell align="center">
                                      <IconButton
                                        color="primary"
                                        component="span"
                                        onClick={() => {
                                          setDeleteDialogShow(true);
                                          setSelectedId(rows[index].staffKey);
                                        }}
                                      >
                                        <img
                                          src={deletePng}
                                          alt=""
                                          style={{
                                            height: '15px',
                                            width: '16px',
                                          }}
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
                                  ) : (
                                    <TableCell key={column.id} align="center">
                                      {column.format &&
                                      typeof value === 'number'
                                        ? column.format(value)
                                        : value}
                                    </TableCell>
                                  )}
                                </React.Fragment>
                              );
                            })
                          : selectedType === 2
                          ? columns2.map((column: any, columnIndex: number) => {
                              const value = row[column.id];
                              return column.id === 'groupName' ? (
                                <TableCell key={column.id} align="center">
                                  {column.format && typeof value === 'number'
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              ) : column.id === 'operation' ? (
                                <TableCell key={column.id} align="center">
                                  {column.format && typeof value === 'number'
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              ) : column.id === 'groupLogo' ? (
                                <TableCell key={column.id} align="center">
                                  <div className="company-avatar-container ">
                                    <div className="company-avatar">
                                      <img
                                        src={
                                          row.groupLogo
                                            ? row.groupLogo +
                                              '?imageMogr2/auto-orient/thumbnail/80x'
                                            : defaultGroupPng
                                        }
                                        alt=""
                                      />
                                    </div>
                                  </div>
                                </TableCell>
                              ) : (
                                <TableCell key={column.id} align="center">
                                  <React.Fragment>
                                    <Checkbox
                                      checked={value ? true : false}
                                      disabled={
                                        rows[index].role >
                                        rows[index].checkIndex
                                          ? true
                                          : false
                                      }
                                      onChange={(e: any) => {
                                        changeRole(e, index, columnIndex);
                                        // setMessageCheck(e.target.checked);
                                      }}
                                      color="primary"
                                    />
                                  </React.Fragment>
                                </TableCell>
                              );
                            })
                          : null}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={rows.length}
            rowsPerPage={25}
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
          deleteDepartment();
        }}
        title={'删除节点'}
        dialogStyle={{ width: '400px', height: '200px' }}
      >
        <div className="dialog-onlyTitle">是否删除该节点</div>
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
          targetGroupKey={companyObj && companyObj.enterpriseGroupKey}
          searchType="添加"
        />
      </Dialog>
    </div>
  );
};
CompanyDepartment.defaultProps = {};
export default CompanyDepartment;
