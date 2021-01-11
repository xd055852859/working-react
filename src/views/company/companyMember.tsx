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
} from '@material-ui/core';
interface CompanyMemberProps {}
const columns = [
  {
    id: 'updateTime',
    label: '更新时间',
    minWidth: 100,
  },
  {
    id: 'groupName',
    label: '群名',
    minWidth: 100,
  },
  {
    id: 'trueName',
    label: '成员',
    minWidth: 100,
  },
  {
    id: 'birthday',
    label: '作者',
    minWidth: 100,
  },
  {
    id: 'phone',
    label: '编辑',
    minWidth: 100,
  },
  {
    id: 'active',
    label: '管理员',
    minWidth: 170,
  },
  {
    id: 'onlineTime',
    label: '操作',
    minWidth: 170,
  },
];
const CompanyMember: React.FC<CompanyMemberProps> = (props) => {
  const {} = props;
  const dispatch = useDispatch();
  const [rows, setRows] = useState<any>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const departmentRef: React.RefObject<any> = useRef();
  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return <div className="company-info"></div>;
};
CompanyMember.defaultProps = {};
export default CompanyMember;
