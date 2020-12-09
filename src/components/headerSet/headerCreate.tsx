import React, { useState, useEffect, useRef } from 'react';
import './headerSet.css';
import './headerCreate.css';
import {
  TextField,
  Button,
  Checkbox,
  ClickAwayListener,
} from '@material-ui/core';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../redux/actions/commonActions';
import { changeCreateMusic } from '../../redux/actions/authActions';
import {
  getSelfTask,
  getWorkingTableTask,
  getGroupTask,
} from '../../redux/actions/taskActions';
import CreateMoreTask from '../createMoreTask/createMoreTask';
import Task from '../task/task';
import Dialog from '../common/dialog';
import api from '../../services/api';
import moment from 'moment';
import _ from 'lodash';

import downArrowbPng from '../../assets/img/downArrowb.png';
import addCreateSvg from '../../assets/svg/addCreate.svg';
import unaddCreateSvg from '../../assets/svg/unaddCreate.svg';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
// import minusCreateSvg from '../../assets/svg/minusCreate.svg';
interface HeaderCreateProps {
  visible: boolean;
  onClose?: any;
  createStyle?: any;
}
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
  const { visible, onClose, createStyle } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  // const groupArray = useTypedSelector((state) => state.group.groupArray);
  const [addInput, setAddInput] = useState('');
  const [groupVisible, setGroupVisible] = useState(false);
  const [createTaskList, setCreateTaskList] = useState<any>([]);
  const [createPage, setCreatePage] = useState(1);
  const [createTotal, setCreateTotal] = useState(0);
  const [groupArray, setGroupArray] = useState<any>([]);
  const [labelArray, setLabelArray] = useState<any>([]);
  const [labelAllArray, setLabelAllArray] = useState<any>([]);
  const [groupChooseArray, setGroupChooseArray] = useState<any>([]);
  const [labelChooseArray, setLabelChooseArray] = useState<any>([]);
  const [groupChooseIndex, setGroupChooseIndex] = useState<any>(0);
  const [chooseIndex, setChooseIndex] = useState<any>(0);
  const [addState, setAddState] = useState(false);
  const [closeVisible, setCloseVisible] = useState(false);
  const limit = 10;

  const createRef: React.RefObject<any> = useRef();
  useEffect(() => {
    if (user && visible) {
      getTaskCreate(1);
      getGroupArray();
    }
  }, [user, visible]);
  const getGroupArray = async () => {
    let newGroupArray: any = [];
    let newLabelAllArray: any = [];
    let newGroupChooseArray: any = [];
    let newLabelChooseArray: any = [];
    let groupRes: any = await api.group.getGroup(3, null, 6);
    if (groupRes.msg === 'OK') {
      newGroupArray.push(...groupRes.result);
      groupRes.result.forEach((item: any, index: number) => {
        newLabelAllArray[index] = _.cloneDeep(item.labelInfo);
      });
      setGroupArray(newGroupArray);
      newLabelChooseArray[0] = [];
      newGroupChooseArray.push(_.cloneDeep(groupRes.result[0]));
      newLabelChooseArray[0].push(_.cloneDeep(newLabelAllArray[0][0]));
      newGroupChooseArray[0].index = 0;
      newLabelChooseArray[0][0].index = 0;
      setGroupChooseArray(newGroupChooseArray);
      setLabelChooseArray(newLabelChooseArray);
      setLabelAllArray(newLabelAllArray);
    } else {
      dispatch(setMessage(true, groupRes.msg, 'error'));
    }
  };

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
      console.log(item);
      item.map((labelItem: any, labelIndex: number) => {
        if (labelArr[index].indexOf(labelItem.labelKey)) {
          labelArr[index].push(labelItem.labelKey);
        }
      });
    });

    let addTaskRes: any = await api.task.togetherCreateCard(
      addInput,
      groupArr,
      labelArr
    );
    if (addTaskRes.msg === 'OK') {
      dispatch(setMessage(true, '新增对应群任务成功', 'success'));
      dispatch(changeCreateMusic(true));
      if (createTaskList) {
        let newCreateTaskList = _.cloneDeep(createTaskList);
        let newGroupChooseArray = _.cloneDeep(groupChooseArray);
        let newLabelChooseArray = _.cloneDeep(labelChooseArray);
        let groupChooseItem = _.cloneDeep(newGroupChooseArray)[0];
        let labelChooseItem = _.cloneDeep(newLabelChooseArray)[0];
        newCreateTaskList.unshift(...addTaskRes.result);
        setCreateTaskList(newCreateTaskList);
        newGroupChooseArray = [groupChooseItem];
        newLabelChooseArray = [labelChooseItem];
        setGroupChooseArray(newGroupChooseArray);
        setLabelChooseArray(newLabelChooseArray);
      }
      setAddInput('');
      if (headerIndex === 0) {
        dispatch(getSelfTask(1, user._key, '[0, 1]'));
      } else if (headerIndex === 1) {
        dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2, 10]));
      } else if (headerIndex === 2) {
        dispatch(
          getWorkingTableTask(
            user._key === targetUserInfo._key ? 4 : 2,
            targetUserInfo._key,
            1,
            [0, 1, 2, 10]
          )
        );
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
      newGroupChooseArray[chooseIndex] = groupArray;
      newLabelChooseArray[chooseIndex] = labelArray;
      console.log(newLabelChooseArray);
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
      {visible ? (
        <ClickAwayListener
          onClickAway={() => {
            if (addInput !== '') {
              setCloseVisible(true);
            } else {
              onClose();
            }
          }}
        >
          <div className="headerCreate" style={createStyle}>
            <div className="headerCreate-mainTitle">新建任务</div>
            <div className="headerSet-container">
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
                    <div
                      className="headerCreate-title"
                      key={'groupChoose' + index}
                    >
                      <div
                        className="headerCreate-title-left"
                        onClick={() => {
                          setGroupVisible(true);
                          setChooseIndex(index);
                        }}
                      >
                        <div className="headerCreate-title-avatar">
                          <img
                            src={
                              item.groupLogo ? item.groupLogo : defaultGroupPng
                            }
                            alt=""
                          />
                        </div>
                        <div className="headerCreate-title-left-left">
                          {item.groupName} /
                        </div>
                        <div className="headerCreate-title-left-right">
                          {labelChooseArray[index] ? (
                            <div className="headerCreate-title-left-title">
                              {labelChooseArray[index][0].labelName
                                ? labelChooseArray[index][0].labelName
                                : labelChooseArray[index][0].labelKey
                                ? ''
                                : 'ToDo'}
                              (
                              {labelChooseArray[index][0].executorName
                                ? labelChooseArray[index][0].executorName
                                : '无默认执行人'}
                              )
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/*  */}
                    </div>
                  );
                })}
                {/* <div style={{ position: 'relative' }}> */}
                {/* <div
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
          </div> */}
                <CreateMoreTask
                  visible={groupVisible}
                  createStyle={{
                    position: 'absolute',
                    top: 155 + chooseIndex * 40 + 'px',
                    left: '15px',
                    height: '400px',
                  }}
                  changeGroupArray={changeGroupArray}
                  onClose={() => {
                    setGroupVisible(false);
                  }}
                  groupIndex={
                    chooseIndex < groupChooseArray.length &&
                    groupChooseArray[chooseIndex]
                      ? groupChooseArray[chooseIndex].index
                      : 0
                  }
                  labelIndex={
                    chooseIndex < groupChooseArray.length &&
                    labelChooseArray[chooseIndex]
                      ? labelChooseArray[chooseIndex][0].index
                      : 0
                  }
                  labelArray={labelAllArray}
                  groupArray={groupArray}
                />
                {/* </div> */}
              </div>
              <div className="create-button">
                <img
                  src={addState ? addCreateSvg : unaddCreateSvg}
                  alt=""
                  className="headerCreate-title-icon"
                  onClick={() => {
                    setGroupVisible(true);
                    setChooseIndex(groupChooseArray.length);
                  }}
                  onMouseEnter={() => {
                    setAddState(true);
                  }}
                  onMouseLeave={() => {
                    setAddState(false);
                  }}
                />
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
                    保存
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    disabled
                    style={{ marginLeft: '10px', color: '#fff' }}
                  >
                    保存
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
                      ((createRef.current
                        ? createRef.current.offsetHeight
                        : 0) +
                        175) +
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
            </div>
            <Dialog
              visible={closeVisible}
              onClose={() => {
                setCloseVisible(false);
                onClose();
              }}
              onOK={() => {
                if (addInput !== '') {
                  addMoreTask();
                } else {
                  dispatch(setMessage(true, '请输入任务名字', 'error'));
                }
                setCloseVisible(false);
              }}
              title={'保存任务'}
              dialogStyle={{ width: '300px', height: '200px' }}
            >
              <div className="deleteLabel-container">是否需要保存任务</div>
            </Dialog>
          </div>
        </ClickAwayListener>
      ) : null}
    </React.Fragment>
  );
};
HeaderCreate.defaultProps = {};
export default HeaderCreate;
