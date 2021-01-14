import React, { useState, useEffect, useRef } from 'react';
import './companySearch.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { Button, IconButton } from '@material-ui/core';
import addPng from '../../assets/img/contact-plus.png';
import { setMessage } from '../../redux/actions/commonActions';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';
import _ from 'lodash';
import api from '../../services/api';
import defaultPersonPng from '../../assets/img/defaultPerson.png';
const useStyles = makeStyles({
  root: {},
  // container: {
  //   maxHeight: 440,
  // },
});

let columns = [
  {
    id: 'operation',
    label: '操作',
    minWidth: 80,
  },
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
    id: 'gender',
    label: '性别',
    minWidth: 70,
  },
  {
    id: 'address',
    label: '住址',
    minWidth: 170,
  },
  {
    id: 'onlineTime',
    label: '最近上线时间',
    minWidth: 120,
  },
  {
    id: 'online',
    label: '在线',
    minWidth: 80,
  },
];
interface CompanySearchListProps {
  addMember?: any;
  targetGroupKey: string;
  searchType: string;
}

const CompanySearchList: React.FC<CompanySearchListProps> = (props) => {
  const { addMember, targetGroupKey, searchType } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useTypedSelector((state) => state.auth.user);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const [searchInput, setSearchInput] = useState<any>('');
  const [rows, setRows] = useState<any>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const personRef: React.RefObject<any> = useRef();
  let unDistory = true;
  useEffect(() => {
    getCompanyRow(0, 10, '');
    return () => {
      unDistory = false;
    };
  }, []);
  useEffect(() => {
    if (rows.length > 0) {
      getCompanyRow(page, rowsPerPage, searchInput);
    }
  }, [page]);
  useEffect(() => {
    if (searchType === '查看') {
      columns.splice(0, 1);
    }
  }, [searchType]);

  const getCompanyRow = async (
    page: number,
    limit: number,
    searchInput: string
  ) => {
    let newRow: any = [];
    let companyPersonRes: any = await api.company.getCompanyList(
      1,
      groupKey,
      page,
      limit,
      searchInput
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
        });
        setRows(newRow);
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
    setPage(0);
  };
  // const [updateValue, setUpdateValue] = useState<any>('');
  return (
    <div className="companySearch">
      <div className="companySearch-container">
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            getCompanyRow(0, rowsPerPage, searchInput);
          }}
          className="companySearch-button"
        >
          搜索
        </Button>
      </div>
      <div className="companySearch-info-container" ref={personRef}>
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
                      {columns.map((column: any) => {
                        const value = row[column.id];
                        return (
                          <React.Fragment key={column.id}>
                            {column.id === 'operation' &&
                            searchType === '添加' ? (
                              <TableCell align={column.align}>
                                <IconButton
                                  color="primary"
                                  component="span"
                                  onClick={() => {
                                    addMember(row);
                                  }}
                                >
                                  <img
                                    src={addPng}
                                    alt=""
                                    style={{ height: '16px', width: '16px' }}
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
                              <TableCell align={column.align}>
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
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          labelRowsPerPage="分页"
        />
      </div>
    </div>
  );
};
CompanySearchList.defaultProps = {};
export default CompanySearchList;
