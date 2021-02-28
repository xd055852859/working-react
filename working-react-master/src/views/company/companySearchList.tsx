import React, { useState, useEffect, useRef } from 'react';
import './companySearch.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { Button, IconButton } from '@material-ui/core';
import {
  AddOutlined,
  NavigateNext,
  CloseOutlined,
  Search,
} from '@material-ui/icons';
// import addPng from '../../assets/img/contact-plus.png';
import { setMessage } from '../../redux/actions/commonActions';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Checkbox,
  Tabs,
  Tab,
  Breadcrumbs,
  Link,
  Typography,
} from '@material-ui/core';
import _ from 'lodash';
import api from '../../services/api';
import defaultPersonPng from '../../assets/img/defaultPerson.png';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
import Dialog from '../../components/common/dialog';
const useStyles = makeStyles({
  root: {},
  // container: {
  //   maxHeight: 440,
  // },
});

let columns1 = [
  {
    id: 'avatar',
    label: '头像',
    width: 20,
  },
  {
    id: 'nickName',
    label: '姓名',
    width: 20,
  },
  {
    id: 'operation',
    label: '操作',
    width: 20,
  },
];
let columns2 = [
  {
    id: 'groupLogo',
    label: '图标',
    width: 20,
  },
  {
    id: 'groupName',
    label: '群名',
    width: 20,
  },
  {
    id: 'operation',
    label: '操作',
    width: 20,
  },
];
const columns3 = [
  {
    id: 'avatar',
    label: '头像',
    width: 10,
  },
  {
    id: 'nickName',
    label: '姓名',
    minWidth: 25,
  },
  {
    id: 'post',
    label: '职位',
    minWidth: 15,
  },
  {
    id: 'isLeader',
    label: '部门领导',
    minWidth: 10,
  },
  {
    id: 'operation',
    label: '操作',
    width: 15,
  },
];
const columns4 = [
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
interface CompanySearchListProps {
  addMember?: any;
  targetGroupKey: string;
  searchType: number;
  companyObj: any;
  // nodeData: any;
  startId: string;
  deleteDepartment: Function;
}

const CompanySearchList: React.FC<CompanySearchListProps> = (props) => {
  const {
    addMember,
    // targetGroupKey,
    searchType,
    // companyData,
    // nodeData,
    companyObj,
    deleteDepartment,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useTypedSelector((state) => state.auth.user);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const [searchInput, setSearchInput] = useState<any>('');
  const [searchIndex, setSearchIndex] = React.useState(0);
  const [selectedId, setSelectedId] = useState<any>(null);
  const [treeDialogShow, setTreeDialogShow] = useState<any>(false);
  // const [companyObj, setCompanyObj] = useState<any>(null);
  const [total, setTotal] = React.useState(0);
  const [rows, setRows] = useState<any>([]);
  const [nodeRows, setNodeRows] = useState<any>([]);
  const [postInput, setPostInput] = useState<any>('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);

  const [deleteDialogShow, setDeleteDialogShow] = useState(false);
  const [departmentId, setDepartmentId] = useState<any>(null);

  const personRef: React.RefObject<any> = useRef();
  let unDistory = true;
  useEffect(() => {
    if (companyObj) {
      getCompanyRow(page, rowsPerPage, '', companyObj._key);
      getCompanyNodeRow(1, 100, companyObj);
    }
    console.log(companyObj);
    return () => {
      unDistory = false;
    };
  }, [companyObj]);
  // useEffect(() => {
  //   // getCompanyRow(page, rowsPerPage, '', '');
  //   getCompanyNodeRow(1, 100, companyObj);
  // }, [companyObj]);
  useEffect(() => {
    if (rows.length > 0) {
      getCompanyRow(page, rowsPerPage, searchInput, companyObj._key);
    }
  }, [page]);
  useEffect(() => {
    if (searchInput === '') {
      setPage(0);
      getCompanyRow(0, rowsPerPage, '', companyObj._key);
    }
  }, [searchInput]);
  useEffect(() => {
    if (rowsPerPage * page < total) {
      getCompanyRow(page, rowsPerPage, searchInput, companyObj._key);
    }
  }, [page, rowsPerPage, searchIndex]);
  useEffect(() => {
    getCompanyRow(page, rowsPerPage, searchInput, companyObj._key);
  }, [searchIndex]);
  const getCompanyRow = async (
    page: number,
    limit: number,
    searchInput: string,
    nodeId: string
  ) => {
    let newRow: any = [];
    page = page + 1;
    let companyPersonRes: any = null;
    if (searchType === 2) {
      if (searchIndex) {
        companyPersonRes = await api.company.getCompanyList(
          2,
          nodeId,
          page,
          limit
        );
      } else {
        companyPersonRes = await api.company.getCompanyList(
          1,
          groupKey,
          page,
          limit,
          searchInput,
          '',
          nodeId
        );
      }
    } else if (searchType === 3) {
      if (searchIndex) {
        companyPersonRes = await api.group.getGroup(9);
      } else {
        companyPersonRes = await api.company.getCompanyGroupList(
          groupKey,
          page,
          rowsPerPage,
          searchInput,
          nodeId
        );
      }
    }
    if (unDistory) {
      if (companyPersonRes.msg === 'OK') {
        console.log(companyPersonRes);
        companyPersonRes.result.map((item: any, index: number) => {
          newRow[index] = {
            ...item,
          };
        });

        setRows(newRow);
        if (searchType === 2) {
          setTotal(companyPersonRes.totalNumber);
        } else if (searchType === 3) {
          setTotal(companyPersonRes.result.length);
        }
      } else {
        dispatch(setMessage(true, companyPersonRes.msg, 'error'));
      }
    }
  };
  const getCompanyNodeRow = async (page: number, limit: number, node: any) => {
    let newRow: any = [];
    // if (page !== 0) {
    //   page = page + 1;
    //   newRow = _.cloneDeep(rows);
    // }
    if (searchType === 2) {
      let companyPersonRes: any = await api.company.getCompanyList(
        2,
        node._key,
        page,
        rowsPerPage
      );
      if (unDistory) {
        if (companyPersonRes.msg === 'OK') {
          companyPersonRes.result.map((item: any, index: number) => {
            newRow.push({
              ...item,
              post: item.post ? item.post : '无职位',
            });
          });
          console.log(newRow);
          setNodeRows(newRow);
        } else {
          dispatch(setMessage(true, companyPersonRes.msg, 'error'));
        }
      }
    } else {
      let companyPersonRes: any = await api.company.getOrgGroupList(
        node._key,
        page,
        rowsPerPage
      );
      if (unDistory) {
        if (companyPersonRes.msg === 'OK') {
          companyPersonRes.result.map((item: any, index: number) => {
            newRow[index] = {
              ...item,
            };
          });
          setNodeRows(newRow);
        } else {
          dispatch(setMessage(true, companyPersonRes.msg, 'error'));
        }
      }
    }
  };
  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
  };
  const searchGroup = () => {
    let newRow: any = _.cloneDeep(rows);
    newRow = newRow.filter((groupItem: any, groupIndex: number) => {
      if (groupItem.groupName.indexOf(searchInput) != -1) {
        return groupItem;
      }
    });
    setRows(newRow);
    setTotal(newRow.length);
  };
  const changePost = async (index: number, postInput: any) => {
    let newNodeRows = _.cloneDeep(nodeRows);
    // let newCompanyData = _.cloneDeep(companyData);
    let updateCompanyRes: any = await api.company.updateOrgOrStaffProperty(
      2,
      newNodeRows[index].staffKey,
      { post: postInput }
    );
    if (updateCompanyRes.msg === 'OK') {
      newNodeRows[index].post = postInput;
      setNodeRows(newNodeRows);
    } else {
      dispatch(setMessage(true, updateCompanyRes.msg, 'error'));
    }
  };
  const changeLeader = async (index: number) => {
    let newNodeRows = _.cloneDeep(nodeRows);
    let updateCompanyRes: any = await api.company.updateOrgOrStaffProperty(
      2,
      newNodeRows[index].staffKey,
      { isLeader: !newNodeRows[index].isLeader ? 1 : 2 }
    );
    if (updateCompanyRes.msg === 'OK') {
      newNodeRows[index].isLeader = !newNodeRows[index].isLeader;
      setNodeRows(newNodeRows);
    } else {
      dispatch(setMessage(true, updateCompanyRes.msg, 'error'));
    }
  };
  // const [updateValue, setUpdateValue] = useState<any>('');
  return (
    <div className="companySearch">
      <div className="companySearch-container companySearch-listSearch">
        <input
          type="text"
          value={searchInput}
          onChange={(e: any) => {
            setSearchInput(e.target.value);
          }}
          placeholder="请输入名称"
          className="companySearch-input"
          onKeyDown={(e: any) => {
            if (e.keyCode === 13) {
              if (searchIndex === 1 && searchType === 3) {
                searchGroup();
              } else {
                getCompanyRow(0, rowsPerPage, searchInput, companyObj._key);
              }
            }
          }}
        />
        <IconButton
          color="primary"
          component="span"
          className="companySearch-button"
          onClick={() => {
            if (searchIndex === 1 && searchType === 3) {
              searchGroup();
            } else {
              getCompanyRow(0, rowsPerPage, searchInput, companyObj._key);
            }
          }}
          size="small"
        >
          <Search />
        </IconButton>
      </div>
      <div
        className="companySearch-info-container"
        ref={personRef}
        style={{ height: 'calc(100% - 205px)' }}
      >
        {searchType === 3 ? (
          <Tabs
            value={searchIndex}
            indicatorColor="primary"
            textColor="primary"
            onChange={(event: React.ChangeEvent<{}>, newValue: number) => {
              setSearchIndex(newValue);
            }}
            style={{ marginBottom: '7px' }}
          >
            <Tab label="企业项目" />
            <Tab label="我的项目" />
          </Tabs>
        ) : null}
        <TableContainer
          style={{
            height:
              searchType === 3 ? 'calc(100% - 110px)' : 'calc(100% - 55px)',
          }}
        >
          <Table stickyHeader aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                {searchType === 2
                  ? columns1.map((column: any) => (
                      <TableCell
                        key={column.id}
                        align="center"
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))
                  : searchType === 3
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
              {rows.map((row: any, index: number) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={'row' + index}
                  >
                    {searchType === 2
                      ? columns1.map((column: any) => {
                          const value = row[column.id];
                          return (
                            <React.Fragment key={column.id}>
                              {column.id === 'operation' ? (
                                <TableCell align="center">
                                  <IconButton
                                    color="primary"
                                    component="span"
                                    onClick={() => {
                                      addMember(row);
                                    }}
                                  >
                                    <AddOutlined />
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
                                        onError={(e: any) => {
                                          e.target.onerror = null;
                                          e.target.src = defaultPersonPng;
                                        }}
                                      />
                                    </div>
                                  </div>
                                </TableCell>
                              ) : (
                                <TableCell align="center">
                                  {column.format && typeof value === 'number'
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              )}
                            </React.Fragment>
                          );
                        })
                      : searchType === 3
                      ? columns2.map((column: any) => {
                          const value = row[column.id];
                          return (
                            <React.Fragment key={column.id}>
                              {column.id === 'operation' ? (
                                <TableCell align="center">
                                  <IconButton
                                    color="primary"
                                    component="span"
                                    onClick={() => {
                                      addMember(row);
                                    }}
                                  >
                                    <AddOutlined />
                                  </IconButton>
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
                                <TableCell align="center">
                                  {column.format && typeof value === 'number'
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              )}
                            </React.Fragment>
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
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          labelRowsPerPage="分页"
        />
      </div>
      <div className="companySearch-info-title">
        {companyObj?.name}:现有{searchType === 2 ? '成员' : '项目'} ({' '}
        {nodeRows.length}人 )
      </div>
      <div className="companySearch-info-container">
        <TableContainer
          style={{
            height: '150px',
          }}
        >
          <Table stickyHeader aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                {searchType === 2
                  ? columns3.map((column: any) => (
                      <TableCell
                        key={column.id}
                        align="center"
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))
                  : searchType === 3
                  ? columns4.map((column: any) => (
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
              {nodeRows.map((row: any, index: number) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={'row' + index}
                  >
                    {searchType === 2
                      ? columns3.map((column: any) => {
                          const value = row[column.id];
                          return (
                            <React.Fragment key={column.id}>
                              {column.id === 'isLeader' ? (
                                <TableCell align="center">
                                  <Checkbox
                                    checked={
                                      nodeRows[index].isLeader ? true : false
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
                                  <div
                                    suppressContentEditableWarning
                                    contentEditable={true}
                                    id={'postValue' + index}
                                    onBlur={(e: any) => {
                                      // setPostInput(document.getElementById('postValue' + index)?.innerText);
                                      if (document) {
                                        let postInput: any = document.getElementById(
                                          'postValue' + index
                                        )?.innerText;
                                        changePost(index, postInput);
                                      }
                                    }}
                                    style={{ width: '70px' }}
                                  >
                                    {nodeRows[index].post}
                                  </div>
                                </TableCell>
                              ) : column.id === 'operation' ? (
                                <TableCell align="center">
                                  <IconButton
                                    color="primary"
                                    component="span"
                                    onClick={() => {
                                      setDeleteDialogShow(true);
                                      setDepartmentId(nodeRows[index].staffKey);
                                    }}
                                  >
                                    <CloseOutlined />
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
                                        onError={(e: any) => {
                                          e.target.onerror = null;
                                          e.target.src = defaultPersonPng;
                                        }}
                                      />
                                    </div>
                                  </div>
                                </TableCell>
                              ) : (
                                <TableCell key={column.id} align="center">
                                  {column.format && typeof value === 'number'
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              )}
                            </React.Fragment>
                          );
                        })
                      : searchType === 3
                      ? columns4.map((column: any, columnIndex: number) => {
                          const value = row[column.id];
                          return column.id === 'groupName' ? (
                            <TableCell key={column.id} align="center">
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </TableCell>
                          ) : column.id === 'operation' ? (
                            <TableCell align="center" key={column.id}>
                              <IconButton
                                color="primary"
                                component="span"
                                onClick={() => {
                                  setDeleteDialogShow(true);
                                  console.log(
                                    '?????????',
                                    nodeRows[index].staffKey
                                  );
                                  setDepartmentId(nodeRows[index].staffKey);
                                }}
                              >
                                <CloseOutlined />
                              </IconButton>
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
                                    nodeRows[index].role >
                                    nodeRows[index].checkIndex
                                      ? true
                                      : false
                                  }
                                  onChange={(e: any) => {
                                    // changeRole(e, index, columnIndex);
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
        {/* <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          labelRowsPerPage="分页"
        /> */}
        <Dialog
          visible={deleteDialogShow}
          onClose={() => {
            setDeleteDialogShow(false);
          }}
          onOK={() => {
            setDeleteDialogShow(false);
            deleteDepartment(departmentId);
          }}
          title={'删除' + (searchType === 2 ? '成员' : '项目')}
          dialogStyle={{ width: '400px', height: '200px' }}
        >
          <div className="dialog-onlyTitle">
            是否删除该{searchType === 2 ? '成员' : '项目'}
          </div>
        </Dialog>
      </div>
    </div>
  );
};
CompanySearchList.defaultProps = {};
export default CompanySearchList;
