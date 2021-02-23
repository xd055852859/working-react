import React, { useState, useEffect, useRef } from 'react';
import './companyPerson.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { MiniMenu } from 'tree-graph-react';
import { makeStyles } from '@material-ui/core/styles';

import { useDispatch } from 'react-redux';
import moment from 'moment';
import XLSX from 'xlsx';
import { setGroupKey, getGroupInfo } from '../../redux/actions/groupActions';
import { setMessage } from '../../redux/actions/commonActions';
import Loading from '../../components/common/loading';
import Dialog from '../../components/common/dialog';
import DropMenu from '../../components/common/dropMenu';
import MiniTree from '../../components/common/miniTree';

import defaultPersonPng from '../../assets/img/defaultPerson.png';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
import defaultDepartMentSvg from '../../assets/svg/defaultDepartMent.svg';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  Button,
  Breadcrumbs,
  Link,
  Typography,
  Chip,
  Tooltip,
} from '@material-ui/core';
import {
  AssignmentOutlined,
  ExpandMoreOutlined,
  CancelOutlined,
  DeleteOutlineOutlined,
  NavigateNext,
  Edit,
  Search,
  Done,
  CloudUpload,
  GroupAddOutlined,
} from '@material-ui/icons';
import _ from 'lodash';
import api from '../../services/api';
import CompanySearch from './companySearch';
import CompanySearchList from './companySearchList';
import CompanyEdit from './companyEdit';

import deletePng from '../../assets/img/deleteDiary.png';
import set6Svg from '../../assets/svg/set6.svg';
import { setTargetUserKey } from '../../redux/actions/authActions';
const useStyles = makeStyles({
  root: {},
  // container: {
  //   maxHeight: 440,
  // },
});

const columns = [
  {
    id: 'batchNumber',
    label: '批次号',
    minWidth: 200,
  },
  {
    id: 'avatar',
    label: '头像',
    minWidth: 50,
  },
  {
    id: 'nickName',
    label: '姓名',
    minWidth: 100,
  },
  {
    id: 'loginTime',
    label: '最近上线时间',
    minWidth: 220,
  },
  {
    id: 'mobileArea',
    label: '手机区号',
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
    minWidth: 400,
  },
  {
    id: 'email',
    label: '电子邮箱',
    minWidth: 170,
  },
  {
    id: 'birthday',
    label: '生日',
    minWidth: 100,
  },
  {
    id: 'lunarBirthday',
    label: '农历生日',
    minWidth: 120,
  },
  {
    id: 'gender',
    label: '性别',
    minWidth: 70,
  },
  {
    id: 'emergencyContact',
    label: '紧急联系人',
    minWidth: 160,
  },
  {
    id: 'emergencyContactTel',
    label: '联系人电话',
    minWidth: 120,
  },
  {
    id: 'address',
    label: '住址',
    minWidth: 170,
  },
  {
    id: 'status',
    label: '状态',
    minWidth: 170,
  },
  {
    id: 'notActive',
    label: '账户已激活',
    minWidth: 120,
  },
  {
    id: 'disable',
    label: '禁用',
    minWidth: 80,
  },
  {
    id: 'operation',
    label: '操作',
    minWidth: 160,
    align: 'center',
  },
];
interface CompanyPersonProps {}

const CompanyPerson: React.FC<CompanyPersonProps> = (props) => {
  const {} = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useTypedSelector((state) => state.auth.user);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const groupRole = useTypedSelector((state) => state.group.groupRole);

  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const [updateValue, setUpdateValue] = useState<any>('');
  const [searchDialogShow, setSearchDialogShow] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [batchVisible, setBatchVisible] = useState(false);
  const [batchDialogShow, setBatchDialogShow] = useState(false);

  const [postVisible, setPostVisible] = useState(false);
  const [postArray, setPostArray] = useState<any>([]);
  const [batchArray, setBatchArray] = useState<any>([]);
  const [batchIndex, setBatchIndex] = useState(0);
  const [batchMoveIndex, setBatchMoveIndex] = useState<any>(null);

  const [rows, setRows] = useState<any>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = useState(false);
  const [deleteDialogShow, setDeleteDialogShow] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);

  const [companyData, setCompanyData] = useState<any>(null);
  const [startId, setStartId] = useState<any>(null);
  const [companyObj, setCompanyObj] = useState<any>(null);
  const [nodeData, setNodeData] = useState<any>(null);

  const [selectedId, setSelectedId] = useState<any>(null);
  const [treeVisible, setTreeVisible] = useState<any>(false);
  const [treeDialogShow, setTreeDialogShow] = useState<any>(false);
  const [treeMenuVisible, setTreeMenuVisible] = useState<any>(false);

  const [personKey, setPersonKey] = useState<any>('');
  const [searchInput, setSearchInput] = useState<any>('');
  const [personIndex, setPersonIndex] = useState<any>(null);
  const [userVisible, setUserVisible] = useState(false);
  const [targetUser, setTargetUser] = useState<any>(null);
  const [isQuit, setIsQuit] = useState<any>(false);
  const personRef: React.RefObject<any> = useRef();
  let unDistory = true;
  useEffect(() => {
    if (user) {
      let groupKey: any = localStorage.getItem('groupKey');
      if (groupKey) {
        dispatch(setGroupKey(groupKey));
        dispatch(getGroupInfo(groupKey));
      }
    }
  }, [user]);
  useEffect(() => {
    if (groupInfo) {
      getCompanyRow(0, rowsPerPage, searchInput);
      // getCompanyTree('', 1);
      getBatchArray();
    }
    return () => {
      unDistory = false;
    };
  }, [groupInfo]);

  useEffect(() => {
    if (searchInput === '') {
      setPage(0);
      getCompanyRow(0, rowsPerPage, '');
    }
  }, [searchInput]);
  useEffect(() => {
    if (isQuit) {
      setPage(0);
      getCompanyRow(0, rowsPerPage, '', null, '', isQuit);
    }
  }, [isQuit]);

  useEffect(() => {
    if (rowsPerPage * page < total) {
      getCompanyRow(page, rowsPerPage, searchInput);
    }
  }, [page, rowsPerPage]);
  useEffect(() => {
    if (treeVisible) {
      getCompanyTree('', 1);
    }
  }, [treeVisible]);
  useEffect(() => {
    if (selectedId) {
      chooseNode(companyData[selectedId]);
      getCompanyRow(page, rowsPerPage, searchInput, companyData[selectedId]);
    }
  }, [selectedId]);
  const getCompanyRow = async (
    page: number,
    limit: number,
    searchInput: string,
    node?: any,
    batchNumber?: string,
    isQuit?: boolean
  ) => {
    let newRow: any = [];
    let companyPersonRes: any = '';
    page = page + 1;
    setLoading(true);
    if (node) {
      companyPersonRes = await api.company.getCompanyList(
        2,
        node._key,
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
        batchNumber,
        null,
        isQuit ? 2 : 1
      );
    }

    if (unDistory) {
      if (companyPersonRes.msg === 'OK') {
        setLoading(false);
        companyPersonRes.result.map((item: any, index: number) => {
          newRow[index] = {
            ...item,
          };
          newRow[index].gender = item.gender ? '女' : '男';
          newRow[index].birthday = moment(parseInt(item.birthday)).format(
            'YYYY/MM/DD'
          );
          newRow[index].mobileArea =
            (item.mobileArea + '').indexOf('+') === -1
              ? '+' + item.mobileArea
              : item.mobileArea;
          newRow[index].notActive = item.notActive ? '未激活' : '已激活';
          // newRow[index].online = item.online ? '在线' : '下线';
          newRow[index].birthday = moment(parseInt(item.birthday)).format(
            'YYYY/MM/DD'
          );
          if (item.loginTime) {
            newRow[index].loginTime = moment(parseInt(item.loginTime)).format(
              'YYYY/MM/DD HH:mm:ss'
            );
          }
        });

        setRows(newRow);
        setTotal(companyPersonRes.totalNumber);
      } else {
        setLoading(false);
        dispatch(setMessage(true, companyPersonRes.msg, 'error'));
      }
    }
  };
  const getCompanyTree = async (nodeId: any, type: number) => {
    let newStartId: string = '';
    let newCompanyData: any = {};
    let newNodeData: any = {};
    // if (nodeId) {
    //   setSelectedId(nodeId);
    // }
    setLoading(true);
    let companyDepartmentRes: any = await api.company.getOrganizationTree(
      groupKey,
      type
    );
    if (unDistory) {
      if (companyDepartmentRes.msg === 'OK') {
        setLoading(false);
        let data = companyDepartmentRes.result;
        for (let key in data) {
          newCompanyData[key] = {
            _key: data[key]._key,
            father: data[key].parentOrgKey,
            name: data[key].name,
            sortList: data[key].children,
            path: data[key].path1,
            nodes: [],
          };
          if (!nodeId && !data[key].parentOrgKey) {
            nodeId = data[key]._key;
            setStartId(data[key]._key);
          }
        }
        // newCompanyData = addPath(newCompanyData, nodeId);
        newNodeData = formatData(newCompanyData, nodeId);
        setNodeData(newNodeData);
        chooseNode(newCompanyData[nodeId]);
        console.log(newCompanyData);
        setCompanyData(newCompanyData);
      } else {
        setLoading(false);
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
        let nodeItem = formatData(nodeObj, item);
        obj.children.push(nodeItem);
      });
    }
    return obj;
  };
  // const addPath = (nodeObj: any, nodeId: string) => {
  //   nodeObj[nodeId].path = nodeObj[nodeId].father
  //     ? [
  //         ...nodeObj[nodeObj[nodeId].father].path,
  //         {
  //           name: nodeObj[nodeId].name,
  //           _key: nodeObj[nodeId]._key,
  //         },
  //       ]
  //     : [
  //         {
  //           name: nodeObj[nodeId].name,
  //           _key: nodeObj[nodeId]._key,
  //         },
  //       ];
  //   if (nodeObj[nodeId].sortList.length > 0) {
  //     nodeObj[nodeId].sortList.forEach((item: any) => {
  //       addPath(nodeObj, item);
  //     });
  //   }
  //   return nodeObj;
  // };
  const chooseNode = async (node: any) => {
    // setSelectedId(node._key);
    // setSelectedType(node.orgType);
    setPage(0);
    setCompanyObj(node);
    console.log(node);
    // setRows([]);
    // getCompanyRow(0, rowsPerPage, node);
  };
  const getBatchArray = async () => {
    let newBatchArray: any = [];
    let batchRes: any = await api.company.getBatchList(groupKey);
    if (unDistory) {
      if (batchRes.msg === 'OK') {
        newBatchArray = ['全部', ...batchRes.results];
        setBatchArray(newBatchArray);
      } else {
        dispatch(setMessage(true, batchRes.msg, 'error'));
      }
    }
  };
  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
  };
  // const [updateValue, setUpdateValue] = useState<any>('');
  const uploadData = (e: any, num: number) => {
    let obj = e.target;
    if (obj.files.length === 0) {
      return;
    }
    let file = obj.files[0];
    //文件类型
    let arr = file.name.split('.');
    let fileType = arr[arr.length - 1];
    //如果是excel文件
    if (fileType === 'xls' || fileType === 'xlsx') {
      excelUpload(file, num);
    } else {
      dispatch(setMessage(true, '请上传正确的文件格式', 'error'));
      return;
    }
    //如果是xml文件
    // else if (fileType === 'xml') {
    //   this.xmlUpload(file);
    // } else {
    //   message.error('请上传正确的文件格式');
    //   return;
    // }
  };
  const excelUpload = (file: any, num: number) => {
    let [url, postData, rABS, reader] = ['', {}, false, new FileReader()];
    let wb: any = '';
    //postData 请求参数 wb 读取完成的数据 rABS 是否将文件读取为二进制字符串
    setLoading(true);
    reader.onload = async function (e: any) {
      var data = e.target.result;
      if (rABS) {
        wb = XLSX.read(btoa(fixdata(data)), {
          //手动转化
          type: 'base64',
        });
      } else {
        wb = XLSX.read(data, {
          type: 'binary',
        });
      }
      let excelJson: any = [];
      let catalogs: any = [];
      //解码方式1 纵向和横向混杂
      let newRow: any = _.cloneDeep(rows);
      let newsheetArr: any = [];
      wb.SheetNames.map((item: any, index: number) => {
        var sheetArr = XLSX.utils.sheet_to_json(
          wb.Sheets[wb.SheetNames[index]]
        );
        sheetArr.map((item: any, index: number) => {
          let obj = {
            department1: item['部门1'],
            department2: item['部门2'],
            department3: item['部门3'],
            department4: item['部门4'],
            department5: item['部门5'],
            name: item['姓名'],
            mobileArea:
              (item['手机区号'] + '').indexOf('+') === -1
                ? '+' + item['手机区号']
                : '' + item['手机区号'],
            mobile: item['手机号'],
            post: item['职位'],
            email: item['电子邮箱'],
            lunarBirthday: item['农历生日'],
            emergencyContact: item['紧急联系人'],
            emergencyContactTel: item['联系人电话'],
            address: item['住址'],
          };
          newsheetArr[index] = {
            ...obj,
            gender: item['性别'] === '男' ? 0 : 1,
            birthday: moment(item['生日']).valueOf(),
          };
          if (item['手机号']) {
            newRow.push({
              ...obj,
              gender: item['性别'],
              birthday: moment(item['生日']).format('YYYY/MM/DD'),
              role: groupInfo.defaultPower,
              notActive: '未激活',
              organizationInfo: [],
            });
          } else {
            dispatch(setMessage(true, '有人员无手机号', 'error'));
          }
        });
      });
      // console.log(newsheetArr);
      // setRows(newRow);
      let res: any = await api.company.addCompanyUser(groupKey, newsheetArr);
      if (res.msg === 'OK') {
        setLoading(false);
        getCompanyRow(0, rowsPerPage, '');
        getBatchArray();
        dispatch(setMessage(true, '导入人员成功', 'success'));
      } else {
        setLoading(false);
        dispatch(setMessage(true, res.msg, 'error'));
      }
    };
    if (rABS) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };
  const fixdata = (data: any) => {
    //文件流转BinaryString
    var o: any = '',
      l: any = 0,
      w: any = 10240;
    for (; l < data.byteLength / w; ++l)
      o += String.fromCharCode.apply(
        null,
        Array.from(new Uint8Array(data.slice(l * w, l * w + w)))
      );
    o += String.fromCharCode.apply(
      null,
      Array.from(new Uint8Array(data.slice(l * w)))
    );
    return o;
  };
  const deletePerson = async () => {
    setDeleteDialogShow(false);
    let newRow: any = _.cloneDeep(rows);
    let deletePersonRes: any = await api.company.deletePerson(
      personKey,
      groupKey
    );
    if (deletePersonRes.msg === 'OK') {
      dispatch(setMessage(true, '删除人员成功', 'success'));
      newRow.splice(personIndex, 1);
      setRows(newRow);
    } else {
      dispatch(setMessage(true, deletePersonRes.msg, 'error'));
    }
  };
  const deleteBatch = async () => {
    setDeleteVisible(false);
    let newBatchArray: any = _.cloneDeep(batchArray);
    let deletePersonRes: any = await api.company.deleteBatch(
      groupKey,
      batchArray[batchIndex]
    );
    if (deletePersonRes.msg === 'OK') {
      dispatch(setMessage(true, '删除批次成功', 'success'));
      newBatchArray.splice(batchIndex, 1);
      setBatchIndex(0);
      setBatchArray(newBatchArray);
      getCompanyRow(0, rowsPerPage, '');
    } else {
      dispatch(setMessage(true, deletePersonRes.msg, 'error'));
    }
  };

  const editPerson = async () => {
    let newRow: any = _.cloneDeep(rows);
    let newTargetUser = _.cloneDeep(targetUser);
    if (targetUser._key) {
      let updatePersonRes: any = await api.company.updatePerson({
        groupMemberKey: newTargetUser._key,
        nickName: newTargetUser.nickName,
        trueName: newTargetUser.trueName,
        avatar: newTargetUser.avatar,
        email: newTargetUser.email,
        birthday: moment(newTargetUser.birthday).valueOf(),
        lunarBirthday: newTargetUser.lunarBirthday,
        emergencyContact: newTargetUser.emergencyContact,
        emergencyContactTel: newTargetUser.emergencyContactTel,
        address: newTargetUser.address,
      });
      if (updatePersonRes.msg === 'OK') {
        dispatch(setMessage(true, '编辑人员成功', 'success'));
        let rowIndex = _.findIndex(newRow, { _key: newTargetUser._key });
        for (let key in newRow[rowIndex]) {
          if (newTargetUser[key] && key !== 'key') {
            newRow[rowIndex][key] = newTargetUser[key];
          }
        }
        // newRow.splice(personIndex, 1);
        setRows(newRow);
        setUserVisible(false);
      } else {
        dispatch(setMessage(true, updatePersonRes.msg, 'error'));
      }
    } else {
      if (!newTargetUser || !newTargetUser.mobile) {
        dispatch(setMessage(true, '请输入手机号', 'error'));
        return;
      }
      if (newTargetUser.birthday) {
        newTargetUser.birthday = moment(newTargetUser.birthday).valueOf();
      }
      if (newTargetUser.nickName) {
        newTargetUser.name = newTargetUser.nickName;
      }
      let res: any = await api.company.addCompanyUser(groupKey, [
        {
          ...newTargetUser,
        },
      ]);
      if (res.msg === 'OK') {
        dispatch(setMessage(true, '添加人员成功', 'success'));
        getCompanyRow(0, rowsPerPage, '');
        setUserVisible(false);
      } else {
        dispatch(setMessage(true, res.msg, 'error'));
      }
    }
  };
  return (
    <div className="company-info">
      {loading ? <Loading /> : null}
      <div className="company-header">
        <div className="company-header-title">
          <span style={{ fontSize: '18px' }}>通讯录</span>
        </div>
        <div className="company-header-button">
          <a
            href="https://cdn-icare.qingtime.cn/花名册示例.xlsx"
            download="花名册（例子）.xlsx"
            style={{ marginRight: '8px' }}
          >
            点击下载示例
          </a>

          <Button
            variant="outlined"
            color="primary"
            // className={classes.button}
            startIcon={<GroupAddOutlined />}
            onClick={() => {
              setTargetUser(null);
              setUserVisible(true);
            }}
          >
            新增成员
          </Button>
          {groupInfo && groupInfo.role === 1 ? (
            <div className="company-button">
              <Button
                variant="outlined"
                color="primary"
                // className={classes.button}
                startIcon={<CloudUpload />}
              >
                上传花名册
              </Button>
              <input
                type="file"
                className="file-button"
                value={updateValue}
                onChange={(e) => {
                  uploadData(e, 0);
                }}
                id="companyPerson-upload"
              />
            </div>
          ) : null}
        </div>
      </div>
      <div className="company-info-container" ref={personRef}>
        <div className="company-info-left">
          <div className="company-info-title">
            <div
              className="companySearch-container"
              style={{ margin: '0px 10px' }}
            >
              <input
                type="text"
                value={searchInput}
                onChange={(e: any) => {
                  setSearchInput(e.target.value);
                }}
                placeholder="请输入成员名"
                className="companySearch-input"
                onKeyDown={(e: any) => {
                  if (e.keyCode === 13) {
                    getCompanyRow(0, rowsPerPage, searchInput);
                  }
                }}
              />
              <IconButton
                color="primary"
                component="span"
                className="companySearch-button"
                onClick={() => {
                  getCompanyRow(0, rowsPerPage, searchInput);
                }}
                size="small"
              >
                <Search />
              </IconButton>
            </div>
            {batchVisible ? (
              <div className="company-header-batch">
                <div>{batchArray[batchIndex]}</div>
                <IconButton
                  color="primary"
                  component="span"
                  onClick={() => {
                    setBatchDialogShow(true);
                  }}
                  size="small"
                >
                  <ExpandMoreOutlined />
                </IconButton>
                <DropMenu
                  visible={batchDialogShow}
                  dropStyle={{
                    width: '250px',
                    maxHeight: '250px',
                    top: '39px',
                    left: '0px',
                    color: '#333',
                    overflow: 'auto',
                    zIndex: 20,
                    padding: '15px 0px',
                    boxSizing: 'border-box',
                  }}
                  onClose={() => {
                    setBatchDialogShow(false);
                  }}
                >
                  {batchArray.map((item: any, index: number) => {
                    return (
                      <div
                        key={'batch' + index}
                        className="company-header-batch-item"
                        onClick={() => {
                          setBatchIndex(index);
                          if (index === 0) {
                            getCompanyRow(0, rowsPerPage, searchInput);
                          } else {
                            getCompanyRow(
                              0,
                              rowsPerPage,
                              '',
                              null,
                              batchArray[index]
                            );
                          }
                        }}
                        onMouseEnter={() => {
                          setBatchMoveIndex(index);
                        }}
                      >
                        {item}
                        {batchMoveIndex === index ? (
                          <IconButton
                            color="secondary"
                            component="span"
                            onClick={() => {
                              setDeleteVisible(true);
                            }}
                            size="small"
                          >
                            <CancelOutlined />
                          </IconButton>
                        ) : null}
                      </div>
                    );
                  })}
                </DropMenu>
              </div>
            ) : null}
            {companyObj && companyObj.path && treeVisible ? (
              <div className="company-path-tree">
                {/* {pathItem.name}
                      <div className="tree-path-icon">
                        <div className="tree-path-icon-top"></div>
                        <div className="tree-path-icon-bottom"></div>
                      </div> */}
                <Breadcrumbs
                  aria-label="breadcrumb"
                  maxItems={3}
                  separator={<NavigateNext fontSize="small" />}
                >
                  {companyObj.path.map((pathItem: any, pathIndex: number) => {
                    const dom: any =
                      pathIndex < companyObj.path.length - 1 ||
                      companyObj.path.length == 1 ? (
                        <Link
                          href="#"
                          onClick={() => {
                            setTreeDialogShow(true);
                          }}
                          style={{ fontSize: '14px' }}
                          color={'secondary'}
                          underline={'always'}
                          key={'path' + pathIndex}
                        >
                          {pathItem.name}
                        </Link>
                      ) : (
                        <Typography
                          color="textPrimary"
                          onClick={() => {
                            setTreeDialogShow(true);
                          }}
                          style={{ fontSize: '14px' }}
                          key={'path' + pathIndex}
                        >
                          {pathItem.name}
                        </Typography>
                      );
                    return dom;
                  })}
                </Breadcrumbs>
                <DropMenu
                  visible={treeDialogShow}
                  dropStyle={{
                    width: '400px',
                    minHeight: '260px',
                    top: '45px',
                    left: '0px',
                    color: '#333',
                    overflow: 'auto',
                    zIndex: 20,
                    padding: '15px 0px',
                    boxSizing: 'border-box',
                  }}
                  onClose={() => {
                    setTreeDialogShow(false);
                  }}
                >
                  {nodeData ? (
                    <MiniTree
                      startId={startId}
                      nodes={nodeData}
                      clickFunc={setSelectedId}
                    />
                  ) : null}
                </DropMenu>
              </div>
            ) : null}
          </div>
          <div className="company-info-right">
            {!postVisible ? (
              <Chip
                label="职位"
                onClick={() => {
                  setPostVisible(true);
                }}
                onDelete={() => {
                  setPostVisible(true);
                }}
                deleteIcon={<Done />}
                variant="outlined"
                size="small"
                style={{ marginRight: '8px' }}
              />
            ) : (
              <Chip
                label="职位"
                color="primary"
                onClick={() => {
                  setPostVisible(false);
                }}
                onDelete={() => {
                  setPostVisible(false);
                }}
                variant="outlined"
                size="small"
                style={{ marginRight: '8px' }}
              />
            )}
            {!batchVisible ? (
              <Chip
                label="批次"
                onDelete={() => {
                  setBatchVisible(true);
                }}
                onClick={() => {
                  setBatchVisible(true);
                }}
                deleteIcon={<Done />}
                variant="outlined"
                size="small"
                style={{ marginRight: '8px' }}
              />
            ) : (
              <Chip
                label="批次"
                color="primary"
                onDelete={() => {
                  setBatchVisible(false);
                }}
                onClick={() => {
                  setBatchVisible(false);
                }}
                variant="outlined"
                size="small"
                style={{ marginRight: '8px' }}
              />
            )}
            {!treeVisible ? (
              <Chip
                label="组织树"
                onDelete={() => {
                  setTreeVisible(true);
                }}
                onClick={() => {
                  setTreeVisible(true);
                }}
                deleteIcon={<Done />}
                variant="outlined"
                size="small"
                style={{ marginRight: '8px' }}
              />
            ) : (
              <Chip
                label="组织树"
                color="primary"
                onDelete={() => {
                  setTreeVisible(false);
                  getCompanyRow(0, rowsPerPage, searchInput);
                }}
                onClick={() => {
                  setTreeVisible(false);
                  getCompanyRow(0, rowsPerPage, searchInput);
                }}
                variant="outlined"
                size="small"
                style={{ marginRight: '8px' }}
              />
            )}
            {!isQuit ? (
              <Chip
                label="离职"
                onDelete={() => {
                  setIsQuit(true);
                }}
                onClick={() => {
                  setIsQuit(true);
                }}
                deleteIcon={<Done />}
                variant="outlined"
                size="small"
                style={{ marginRight: '8px' }}
              />
            ) : (
              <Chip
                label="离职"
                color="primary"
                onDelete={() => {
                  setIsQuit(false);
                }}
                onClick={() => {
                  setIsQuit(false);
                }}
                variant="outlined"
                size="small"
                style={{ marginRight: '8px' }}
              />
            )}
          </div>
        </div>
        <TableContainer
          style={{
            height: 'calc(100% - 105px)',
          }}
        >
          <Table stickyHeader aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                {columns.map((column: any) => (
                  <React.Fragment key={column.id}>
                    {((!postVisible && column.id !== 'post') || postVisible) &&
                    ((!batchVisible && column.id !== 'batchNumber') ||
                      batchVisible) &&
                    ((!isQuit && column.id !== 'status') || isQuit) ? (
                      <TableCell
                        align="center"
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ) : null}
                  </React.Fragment>
                ))}
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
                    {columns.map((column: any) => {
                      const value = row[column.id];
                      return (
                        <React.Fragment key={column.id}>
                          {column.id === 'operation' ? (
                            <TableCell align="center">
                              <React.Fragment>
                                {row.mainEnterpriseGroupKey === groupKey ? (
                                  <IconButton
                                    color="primary"
                                    component="span"
                                    onClick={() => {
                                      setUserVisible(true);
                                      setTargetUser(row);
                                    }}
                                    size="small"
                                  >
                                    <Edit />
                                  </IconButton>
                                ) : null}
                                {groupRole && groupRole < row.role ? (
                                  <IconButton
                                    color="secondary"
                                    component="span"
                                    onClick={() => {
                                      setPersonIndex(index);
                                      setPersonKey(row.userId);
                                      setDeleteDialogShow(true);
                                    }}
                                    size="small"
                                  >
                                    <CancelOutlined />
                                  </IconButton>
                                ) : null}
                              </React.Fragment>
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
                                  <div
                                    className="companyPerson-online"
                                    style={{
                                      backgroundColor: row.online
                                        ? '#7ED321'
                                        : '#B3B3B3',
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </TableCell>
                          ) : column.id === 'post' ? (
                            <React.Fragment>
                              {postVisible ? (
                                <TableCell key={column.id} align="center">
                                  {row.organizationInfo.length > 0 ? (
                                    row.organizationInfo.map(
                                      (item: any, index: number) => {
                                        return (
                                          <div
                                            className="company-choose-info"
                                            key={'post' + index}
                                          >
                                            {item.path1.map(
                                              (
                                                pathItem: any,
                                                pathIndex: number
                                              ) => {
                                                return (
                                                  <span
                                                    key={'postItem' + pathIndex}
                                                  >
                                                    {pathIndex === 0
                                                      ? pathItem
                                                      : ' / ' + pathItem}
                                                  </span>
                                                );
                                              }
                                            )}
                                            {' / ' +
                                              (item.post
                                                ? item.post
                                                : '无职位')}
                                          </div>
                                        );
                                      }
                                    )
                                  ) : (
                                    <div className="company-choose-info">
                                      暂无职位
                                    </div>
                                  )}
                                </TableCell>
                              ) : null}
                            </React.Fragment>
                          ) : column.id === 'batchNumber' ? (
                            <React.Fragment>
                              {batchVisible ? (
                                <TableCell key={column.id} align="center">
                                  {column.format && typeof value === 'number'
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              ) : null}
                            </React.Fragment>
                          ) : column.id === 'status' ? (
                            <React.Fragment>
                              {isQuit ? (
                                <TableCell key={column.id} align="center">
                                  {column.format && typeof value === 'number'
                                    ? column.format(value)
                                      ? '在职'
                                      : '离职'
                                    : value
                                    ? '在职'
                                    : '离职'}
                                </TableCell>
                              ) : null}
                            </React.Fragment>
                          ) : (
                            <TableCell key={column.id} align={'center'}>
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </TableCell>
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
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          labelRowsPerPage="分页"
        />
      </div>
      <Dialog
        visible={deleteDialogShow}
        onClose={() => {
          setDeleteDialogShow(false);
        }}
        onOK={() => {
          deletePerson();
        }}
        title={'删除人员'}
        dialogStyle={{ width: '400px', height: '200px' }}
      >
        <div className="dialog-onlyTitle">
          是否将该人员从所有群组和组织中删除
        </div>
      </Dialog>
      <Dialog
        visible={deleteVisible}
        onClose={() => {
          setDeleteVisible(false);
        }}
        onOK={() => {
          deleteBatch();
        }}
        title={'删除批次'}
        dialogStyle={{ width: '400px', height: '200px' }}
      >
        <div className="dialog-onlyTitle">是否将该批次下所有人员删除</div>
      </Dialog>
      <Dialog
        visible={userVisible}
        onOK={() => {
          editPerson();
        }}
        onClose={() => {
          setUserVisible(false);
        }}
        title={'用户设置'}
        dialogStyle={{
          width: '400px',
          height: '90%',
          overflow: 'auto',
        }}
      >
        <CompanyEdit targetUser={targetUser} setTargetUser={setTargetUser} />
      </Dialog>
      {/* <Dialog
        visible={postVisible}
        onClose={() => {
          setPostVisible(false);
        }}
        title={'用户职位'}
        dialogStyle={{
          minWidth: '300px',
          maxHeight: '90%',
          overflow: 'auto',
        }}
        footer={false}
      >
        {postArray.length > 0 ? (
          postArray.map((item: any, index: number) => {
            return (
              <div className="company-choose-info" key={'post' + index}>
                {item.path1.map((pathItem: any, pathIndex: number) => {
                  return (
                    <span key={'postItem' + pathIndex}>
                      {pathIndex === 0 ? pathItem : ' / ' + pathItem}
                    </span>
                  );
                })}
              </div>
            );
          })
        ) : (
          <div className="company-choose-info">暂无职位</div>
        )}
      </Dialog> */}
    </div>
  );
};
CompanyPerson.defaultProps = {};
export default CompanyPerson;
