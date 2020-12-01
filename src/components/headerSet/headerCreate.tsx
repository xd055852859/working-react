import React, { useState, useEffect, useRef } from 'react';
import './headerSet.css';
import './headerCreate.css';
import { TextField, Button, Checkbox } from '@material-ui/core';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../redux/actions/commonActions';
import {
  getSelfTask,
  getWorkingTableTask,
  getGroupTask,
} from '../../redux/actions/taskActions';
import CreateMoreTask from '../createMoreTask/createMoreTask';
import Task from '../task/task';
import api from '../../services/api';
import moment from 'moment';
import _ from 'lodash';

import downArrowbPng from '../../assets/img/downArrowb.png';
import addCreateSvg from '../../assets/svg/addCreate.svg';
import minusCreateSvg from '../../assets/svg/minusCreate.svg';
interface HeaderCreateProps {}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      backgroundColor: '#17B881',
      padding: '6 16px',
      color: '#fff',
    },
    input: {
      width: 'calc(100% - 115px)',
      marginRight: '10px',
      minWidth: '200px',
      height: '45px',
      '& .MuiInput-formControl': {
        marginTop: '0px',
      },
      '& .MuiOutlinedInput-input': {
        padding: '10px 14px',
      },
      '& .MuiInputLabel-formControl': {
        marginTop: '-10px',
      },
    },
  })
);
const HeaderCreate: React.FC<HeaderCreateProps> = (props) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const groupArray = useTypedSelector((state) => state.group.groupArray);
  const [addInput, setAddInput] = useState('');
  const [groupVisible, setGroupVisible] = useState(false);
  const [createTaskList, setCreateTaskList] = useState<any>([]);
  const [createPage, setCreatePage] = useState(1);
  const [createTotal, setCreateTotal] = useState(0);
  const [labelArray, setLabelArray] = useState<any>([]);
  const [groupChooseArray, setGroupChooseArray] = useState<any>([]);
  const [labelChooseArray, setLabelChooseArray] = useState<any>([]);
  const [groupChooseIndex, setGroupChooseIndex] = useState<any>(0);
  const limit = 10;

  const createRef: React.RefObject<any> = useRef();
  useEffect(() => {
    if (user) {
      getTaskCreate(1);
    }
  }, [user]);

  const scrollCreateLoading = (e: any) => {
    let newPage = createPage;
    //文档内容实际高度（包括超出视窗的溢出部分）
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let clientHeight = e.target.clientHeight;
    if (
      clientHeight + scrollTop >= scrollHeight - 1 &&
      createTaskList.length < createTotal
    ) {
      newPage = newPage + 1;
      setCreatePage(newPage);
      getTaskCreate(newPage);
    }
  };
  const getTaskCreate = async (page: number) => {
    let newCreateTaskList: any = [];
    if (page === 1) {
      setCreateTaskList([]);
    } else {
      newCreateTaskList = _.cloneDeep(createTaskList);
    }
    let res: any = await api.task.getCardCreate(page, limit);
    if (res.msg === 'OK') {
      newCreateTaskList.push(...res.result);
      setCreateTaskList(newCreateTaskList);
      setCreateTotal(res.totalNumber);
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };
  const addMoreTask = async () => {
    let groupArr: any = [];
    let labelArr: any = [];
    _.cloneDeep(labelChooseArray).forEach((item: any, index: number) => {
      groupArr.push(groupChooseArray[index]._key);
      labelArr[index] = [];
      item.map((labelItem: any, labelIndex: number) => {
        labelArr[index].push(labelItem._key);
      });
    });
    let addTaskRes: any = await api.task.togetherCreateCard(
      addInput,
      groupArr,
      labelArr
    );
    if (addTaskRes.msg === 'OK') {
      dispatch(setMessage(true, '新增对应群任务成功', 'success'));
      if (createTaskList) {
        let newCreateTaskList = _.cloneDeep(createTaskList);
        newCreateTaskList.unshift(...addTaskRes.result);
        setCreateTaskList(newCreateTaskList);
        setGroupChooseArray([]);
        setLabelChooseArray([]);
      }
      if (headerIndex === 0) {
        dispatch(getSelfTask(1, user._key, '[0, 1]'));
      } else if (headerIndex === 1) {
        dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2, 10]));
      } else if (headerIndex === 2) {
        dispatch(getWorkingTableTask(2, targetUserInfo._key, 1, [0, 1, 2, 10]));
      } else if (headerIndex === 3) {
        dispatch(getGroupTask(3, groupKey, '[0,1,2,10]'));
      }
    } else {
      dispatch(setMessage(true, addTaskRes.msg, 'error'));
    }
  };
  const changeGroupArray = (groupArray: any, labelArray: any) => {
    if (labelArray.length > 0) {
      let newGroupChooseArray = _.cloneDeep(groupChooseArray);
      let newLabelChooseArray = _.cloneDeep(labelChooseArray);
      newGroupChooseArray.push(groupArray);
      newLabelChooseArray.push(labelArray);
      setGroupChooseArray(newGroupChooseArray);
      setLabelChooseArray(newLabelChooseArray);
    }
  };
  const minusGroupArray = (index: number) => {
    let newGroupChooseArray = _.cloneDeep(groupChooseArray);
    let newLabelChooseArray = _.cloneDeep(labelChooseArray);
    newGroupChooseArray.splice(index, 1);
    newLabelChooseArray.splice(index, 1);
    setGroupChooseArray(newGroupChooseArray);
    setLabelChooseArray(newLabelChooseArray);
  };
  return (
    <React.Fragment>
      <div className="headerSet-search-title">
        <TextField
          // required
          id="outlined-basic"
          variant="outlined"
          label="添加任务"
          style={{ width: '100%' }}
          value={addInput}
          className={classes.input}
          onChange={(e) => {
            setAddInput(e.target.value);
          }}
        />
      </div>

      <div className="headerCreate-title-content" ref={createRef}>
        {groupChooseArray.map((item: any, index: number) => {
          return (
            <div className="headerCreate-title" key={'groupChoose' + index}>
              <div className="headerCreate-title-left">
                <div className="headerCreate-title-left-left">
                  {item.groupName}
                </div>
                <div className="headerCreate-title-left-right">
                  {labelChooseArray[index]
                    ? labelChooseArray[index].map(
                        (labelItem: any, labelIndex: number) => {
                          return (
                            <div
                              key={'labelChoose' + labelIndex}
                              className="headerCreate-title-left-title"
                            >
                              {labelItem.cardLabelName
                                ? labelItem.cardLabelName
                                : labelItem._key
                                ? ''
                                : 'ToDo'}
                              (
                              {labelItem.executorNickName
                                ? labelItem.executorNickName
                                : '无默认执行人'}
                              )
                            </div>
                          );
                        }
                      )
                    : null}
                </div>
              </div>
              <img
                src={minusCreateSvg}
                alt=""
                className="headerCreate-title-icon"
                onClick={() => {
                  minusGroupArray(index);
                }}
              />
            </div>
          );
        })}

        <div
          className="headerCreate-choose-title"
          onClick={() => {
            setGroupVisible(true);
          }}
        >
          请选择项目/频道
          <img
            src={downArrowbPng}
            alt=""
            style={{ width: '11px', height: '7px', marginLeft: '8px' }}
          />
          <CreateMoreTask
            visible={groupVisible}
            createStyle={{
              position: 'absolute',
              top: '40px',
              left: '0px',
              height: '400px',
            }}
            changeGroupArray={changeGroupArray}
            onClose={() => {
              setGroupVisible(false);
            }}
            taskWidth={400}
          />
        </div>
      </div>
      <div className="create-button">
        {addInput ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              // setGroupVisible(true);
              addMoreTask();
            }}
            style={{ marginLeft: '10px', color: '#fff' }}
          >
            保存任务
          </Button>
        ) : (
          <Button
            variant="contained"
            disabled
            style={{ marginLeft: '10px', color: '#fff' }}
          >
            保存任务
          </Button>
        )}
      </div>

      <div className="addTask-create">最近创建</div>
      {createTaskList.length > 0 ? (
        <div
          className="headerSet-search-info"
          onScroll={scrollCreateLoading}
          style={{
            height:
              'calc(100% - ' +
              ((createRef.current ? createRef.current.offsetHeight : 0) + 175) +
              'px)',
          }}
        >
          {createTaskList.map((taskItem: any, taskIndex: number) => {
            return (
              <Task
                key={'create' + taskIndex}
                taskItem={taskItem}
                showGroupName={true}
                createTime={moment(taskItem.createTime).fromNow()}
              />
            );
          })}
        </div>
      ) : null}
    </React.Fragment>
  );
};
HeaderCreate.defaultProps = {};
export default HeaderCreate;
