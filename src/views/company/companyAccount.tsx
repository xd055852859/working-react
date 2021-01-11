import React, { useState, useEffect, useRef } from 'react';
import { MenuTree } from 'tree-graph-react';
import './companyDepartment.css';
import './companyAccount.css';
import DateFnsUtils from '@date-io/moment';
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
  Tab,
  Tabs,
} from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
interface CompanyAccountProps {}

const columns = [
  {
    id: 'groupName',
    label: '订单编号',
    minWidth: 100,
  },
  {
    id: 'department',
    label: '充值时间',
    minWidth: 100,
  },
  {
    id: 'trueName',
    label: '充值金额（¥）',
    minWidth: 100,
  },
  {
    id: 'member',
    label: '充值账户',
    minWidth: 100,
  },
  {
    id: 'birthday',
    label: '充值人',
    minWidth: 100,
  },
];
const CompanyAccount: React.FC<CompanyAccountProps> = (props) => {
  const {} = props;
  const dispatch = useDispatch();
  const [rows, setRows] = useState<any>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const [value, setValue] = React.useState(0);

  const departmentRef: React.RefObject<any> = useRef();
  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };
  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleDateChange = (date: any, type: string) => {
    if (type === 'start') {
      setStartDate(date);
    } else if ((type = 'end')) {
      setEndDate(date);
    }
  };
  return (
    <div className="company-info">
      <div className="company-header">
        <div className="company-header-title">企业账户</div>
        {/* <div className="company-button">添加成员</div> */}
      </div>
      <div
        className="company-info-container companyAccount"
        ref={departmentRef}
      >
        <div className="companyAccount-top">
          <div className="companyAccount-title">当前余额：1049</div>
          <div className="company-button companyAccount-button">充值</div>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="yyyy-MM-DD"
              margin="normal"
              id="date-picker-inline"
              // label="开始日期"
              value={startDate}
              onChange={(date) => {
                handleDateChange(date, 'start');
              }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              className="companyAccount-date"
            />
          </MuiPickersUtilsProvider>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="yyyy-MM-DD"
              margin="normal"
              id="date-picker-inline"
              // label="截止日期"
              value={endDate}
              onChange={(date) => {
                handleDateChange(date, 'end');
              }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              className="companyAccount-date"
            />
          </MuiPickersUtilsProvider>
        </div>
        <div className="companyAccount-bottom">
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
          >
            <Tab label="充值记录" />
            <Tab label="消费记录" />
          </Tabs>
          <TableContainer
            style={{
              height: 'calc(100% - 115px)',
              marginTop:'15px'
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
CompanyAccount.defaultProps = {};
export default CompanyAccount;
