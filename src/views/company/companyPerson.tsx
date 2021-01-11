import React, { useState, useEffect, useRef } from 'react';
import './companyPerson.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import XLSX from 'xlsx';
import { setGroupKey, getGroupInfo } from '../../redux/actions/groupActions';
import { setMessage } from '../../redux/actions/commonActions';
import Loading from '../../components/common/loading';
import Dialog from '../../components/common/dialog';
import UserCenter from '../../components/userCenter/userCenter';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
} from '@material-ui/core';
import _ from 'lodash';
import api from '../../services/api';
import CompanySearch from './companySearch';
import deletePng from '../../assets/img/deleteDiary.png';
import set6Svg from '../../assets/svg/set6.svg';
const useStyles = makeStyles({
  root: {},
  // container: {
  //   maxHeight: 440,
  // },
});

const columns = [
  {
    id: 'nickName',
    label: '姓名',
    minWidth: 100,
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
    minWidth: 100,
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
    id: 'notActive',
    label: '账户已激活',
    minWidth: 120,
  },
  {
    id: 'loginTime',
    label: '最近上线时间',
    minWidth: 120,
  },
  {
    id: 'online',
    label: '在线',
    minWidth: 80,
  },
  {
    id: 'disable',
    label: '禁用',
    minWidth: 80,
  },
  {
    id: 'operation',
    label: '操作',
    minWidth: 120,
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
  const [rows, setRows] = useState<any>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = useState(false);
  const [deleteDialogShow, setDeleteDialogShow] = useState(false);
  const [personKey, setPersonKey] = useState<any>('');
  const [personIndex, setPersonIndex] = useState<any>(null);
  const [userVisible, setUserVisible] = useState(false);
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
      getCompanyRow(0, rowsPerPage);
    }
    return () => {
      unDistory = false;
    };
  }, [groupInfo]);
  useEffect(() => {
    if (rowsPerPage * page < total) {
      getCompanyRow(page, rowsPerPage);
    }
  }, [page]);
  const getCompanyRow = async (page: number, limit: number) => {
    let newRow: any = [];
    page = page + 1;
    let companyPersonRes: any = await api.company.getCompanyList(
      1,
      groupKey,
      page,
      limit
    );
    if (unDistory) {
      if (companyPersonRes.msg === 'OK') {
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
          newRow[index].online = item.online ? '在线' : '下线';
          newRow[index].birthday = moment(parseInt(item.birthday)).format(
            'YYYY/MM/DD'
          );
        });
        console.log('newRow', newRow);
        setRows(newRow);
        setTotal(companyPersonRes.totalNumber);
      } else {
        dispatch(setMessage(true, companyPersonRes.msg, 'error'));
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
        setRows(newRow);
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
  return (
    <div className="company-info">
      {loading ? <Loading /> : null}
      <div className="company-header">
        <div className="company-header-title">通讯录</div>
        <div className="company-header-button">
          <a
            href="https://cdn-icare.qingtime.cn/花名册示例.xlsx"
            download="花名册（例子）.xlsx"
          >
            点击下载示例
          </a>
          <div
            className="company-button"
            onClick={() => {
              setSearchDialogShow(true);
            }}
          >
            查找成员组织
          </div>
          {groupInfo && groupInfo.role === 1 ? (
            <div className="company-button">
              ＋ 添加成员
              <input
                type="file"
                className="file-button"
                value={updateValue}
                onChange={(e) => {
                  uploadData(e, 0);
                }}
              />
            </div>
          ) : null}
        </div>
      </div>
      <div className="company-info-container" ref={personRef}>
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
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
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
                            <TableCell>
                              <React.Fragment>
                                {row.mainEnterpriseGroupKey === groupKey ? (
                                  <IconButton
                                    color="primary"
                                    component="span"
                                    onClick={() => {
                                      setUserVisible(true);
                                    }}
                                  >
                                    <img
                                      src={set6Svg}
                                      alt=""
                                      style={{
                                        height: '16px',
                                        width: '16px',
                                      }}
                                    />
                                  </IconButton>
                                ) : null}
                                {groupRole && groupRole < row.role ? (
                                  <IconButton
                                    color="primary"
                                    component="span"
                                    onClick={() => {
                                      setPersonIndex(index);
                                      setPersonKey(row.userId);
                                      setDeleteDialogShow(true);
                                    }}
                                  >
                                    <img
                                      src={deletePng}
                                      alt=""
                                      style={{
                                        height: '16px',
                                        width: '16px',
                                      }}
                                    />
                                  </IconButton>
                                ) : null}
                              </React.Fragment>
                            </TableCell>
                          ) : (
                            <TableCell key={column.id} align={column.align}>
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
          targetGroupKey={groupInfo && groupInfo._key}
          searchType="添加"
        />
      </Dialog>
      <Dialog
        visible={userVisible}
        footer={false}
        onClose={() => {
          setUserVisible(false);
        }}
        title={'用户设置'}
        dialogStyle={{
          width: '400px',
          height: '90%',
        }}
      >
        <UserCenter
          onClose={() => {
            setUserVisible(false);
          }}
        />
      </Dialog>
      <Dialog
        visible={deleteDialogShow}
        onClose={() => {
          setDeleteDialogShow(false);
        }}
        onOK={() => {
          deletePerson();
        }}
        title={'删除任务'}
        dialogStyle={{ width: '400px', height: '200px' }}
      >
        <div className="dialog-onlyTitle">
          是否将该人员从所有群组和组织中删除
        </div>
      </Dialog>
    </div>
  );
};
CompanyPerson.defaultProps = {};
export default CompanyPerson;
