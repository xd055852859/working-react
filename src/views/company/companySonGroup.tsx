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
interface CompanySonGroupProps {}
const columns = [
  {
    id: 'groupName',
    label: '子群名',
    minWidth: 100,
  },
  {
    id: 'department',
    label: '部门',
    minWidth: 100,
  },
  {
    id: 'trueName',
    label: '成员',
    minWidth: 100,
  },
  {
    id: 'member',
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
const CompanySonGroup: React.FC<CompanySonGroupProps> = (props) => {
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
  const data = {
    '001': {
      _key: '001',
      avatarUri: 'https://psnine.com/Upload/game/11387.png',
      checked: true,
      contract: false,
      father: '',
      hour: 0.1,
      icon: 'https://cdn-icare.qingtime.cn/rooter.svg',
      limitDay: -23,
      name: '灵通股份',
      sortList: ['002', '003', '004', '005', '006', '007'],
    },
    '002': {
      _key: '002',
      checked: true,
      contract: false,
      father: '001',
      hour: 0.1,
      icon: 'https://cdn-icare.qingtime.cn/docFolder.svg',
      limitDay: -23,
      name: '设计部',
      sortList: ['008', '009'],
    },
    '003': {
      _key: '003',
      checked: false,
      father: '001',
      hour: 0.1,
      icon: 'https://cdn-icare.qingtime.cn/favFolder.svg',
      limitDay: 2,
      name: '行政部',
      sortList: ['010'],
    },
    '004': {
      _key: '004',
      checked: false,
      father: '001',
      hour: 0.1,
      limitDay: 2,
      name: '人事部',
      sortList: [],
    },
    '005': {
      _key: '005',
      checked: false,
      father: '001',
      hour: 0.1,
      limitDay: 2,
      name: '财务部',
      sortList: [],
    },
    '006': {
      _key: '006',
      checked: false,
      contract: false,
      father: '001',
      hour: 0.1,
      limitDay: 2,
      name: '市场部',
      sortList: [],
    },
    '007': {
      _key: '007',
      checked: false,
      father: '001',
      hour: 0.1,
      limitDay: 2,
      name: '运营部',
      sortList: [],
    },
    '008': {
      _key: '008',
      checked: false,
      father: '002',
      hour: 0.1,
      limitDay: 2,
      name: '张三',
      sortList: [],
    },
    '009': {
      _key: '009',
      father: '002',
      name: '王五',
      sortList: [],
    },
    '010': {
      _key: '010',
      father: '003',
      name: '赵四',
      sortList: [],
    },
  };
  return (
    <div className="company-info">
      <div className="company-header">
        <div className="company-header-title">项目群子公司统一管理</div>
        <div className="company-button">添加成员</div>
      </div>
      <div
        className="company-info-container companyDepartment"
        ref={departmentRef}
      >
        <div className="companyDepartment-left">
          <MenuTree
            disabled
            // handleClickMoreButton={function noRefCheck() {}}
            nodes={data}
            showMoreButton
            startId="001"
            backgroundColor="#f5f5f5"
            selectedBackgroundColor="#E3E3E3"
            color="#333"
            hoverColor="#595959"
          />
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
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </TableCell>
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
    </div>
  );
};
CompanySonGroup.defaultProps = {};
export default CompanySonGroup;
