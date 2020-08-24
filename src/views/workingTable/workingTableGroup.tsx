import React, { useState, useRef, useEffect } from 'react';
import './workingTableLabel.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import {
  getWorkingTableTask,
  addWorkingTableTask,
} from '../../redux/actions/taskActions';
import { setMessage } from '../../redux/actions/commonActions';
import Task from '../../components/task/task';import DropMenu from '../../components/common/dropMenu';
import _ from 'lodash';
import api from '../../services/api';
import defaultGroupPng from '../../assets/img/defaultGroup.png';

const WorkingTableGroup: React.FC = (prop) => {
  const user = useTypedSelector((state) => state.auth.user);
  const memberHeaderIndex = useTypedSelector(
    (state) => state.member.memberHeaderIndex
  );
  const workingGroupArray = useTypedSelector(
    (state) => state.task.workingGroupArray
  );
  const workingTaskArray = useTypedSelector(
    (state) => state.task.workingTaskArray
  );
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  // const [memberObj, setMemberObj] = useState<any>({});
  const [mainGroupArray, setMainGroupArray] = useState<any>([]);
  const [batchTaskVisible, setBatchTaskVisible] = useState(false);
  const [batchLabelKey, setBatchLabelKey] = useState<string | null>('');
  const [batchGroupKey, setBatchGroupKey] = useState<string | null>('');
  const [batchTaskIndex, setBatchTaskIndex] = useState(0);
  const dispatch = useDispatch();
  const [colWidth, setColWidth] = useState(0);
  const [colNumbers, setColNumbers] = useState(4);
  const [colHeight, setColHeight] = useState<any>([]);
  const workingTableRef: React.RefObject<any> = useRef();
  useEffect(() => {
    if (user && user._key && !workingTaskArray&& headerIndex == 1) {
      dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2]));
    }
    if (targetUserInfo && targetUserInfo._key && headerIndex == 2) {
      dispatch(getWorkingTableTask(2, targetUserInfo._key, 1, [0, 1, 2]));
    }
  }, [user,targetUserInfo, workingTaskArray]);
  useEffect(() => {
    if (workingTaskArray) {
      let arr: any = [];
      let groupArray: any = [];
      if (workingGroupArray.length > 0 && workingTaskArray.length > 0) {
        workingTaskArray.forEach((item: any, index: number) => {
          arr[index] = { groupObj: workingGroupArray[index], position: [] };
          item.forEach((groupItem: any, groupIndex: number) => {
            if (groupItem.taskEndDate) {
              if (groupItem.labelKey) {
                if (!arr[index][groupItem.labelKey]) {
                  let labelIndex = _.findIndex(
                    workingGroupArray[index].labelArray,
                    {
                      _key: groupItem.labelKey,
                    }
                  );
                  arr[index][groupItem.labelKey] = {
                    arr: [],
                    labelObj: workingGroupArray[index].labelArray[labelIndex],
                  };
                }
                arr[index][groupItem.labelKey].arr = sortArr(
                  arr[index][groupItem.labelKey].arr,
                  groupItem
                );
              } else {
                if (!arr[index]['ToDo']) {
                  arr[index]['ToDo'] = {
                    arr: [],
                    labelObj: { cardLabelName: 'ToDo' },
                  };
                }
                arr[index]['ToDo'].arr = sortArr(
                  arr[index]['ToDo'].arr,
                  groupItem
                );
              }
            }
          });
        });
        workingGroupArray[0].labelArray.forEach((item: any) => {
          if (Object.keys(arr[0]).indexOf(item._key) == -1) {
            arr[0][item._key] = {
              arr: [],
              labelObj: item,
            };
          }
        });
        groupArray = arr;
        groupArray = groupArray.map((item: any) => {
          item.arrlength = 0;
          for (let key in item) {
            if (key != 'groupObj' && key != 'position' && key != 'arrlength') {
              // item[key].arr = format
              //   .formatFilter(item[key].arr, taskObj)
              //   .filter((arrItem, arrIndex) => {
              //     return arrItem.show;
              //   });
              item.arrlength = item.arrlength + item[key].arr.length;
            }
          }
          return item;
        });
        groupArray = _.sortBy(groupArray, ['arrlength']).reverse();
        setMainGroupArray(groupArray);
        // groupArray.forEach((item, index) => {
        //   this.$nextTick(function () {
        //     if (item.arrlength > 0) {
        //       this.render(index, "group");
        //     }
        //   });
        // });
      }
    }
  }, [workingTaskArray]);
  useEffect(() => {
    let clientWidth = workingTableRef.current.clientWidth;
    if (clientWidth < 600) {
      setColNumbers(1);
    } else if (clientWidth >= 600 && clientWidth <= 900) {
      setColNumbers(2);
    } else if (clientWidth > 900 && clientWidth <= 1080) {
      setColNumbers(3);
    } else {
      setColNumbers(4);
    }
    setColWidth(Math.floor(clientWidth / colNumbers));
  }, [workingTableRef.current]);
  useEffect(() => {
    let groupArray = [];
    if (memberHeaderIndex == 3 && mainGroupArray.length > 0) {
      console.log('mainGroupArray', mainGroupArray);
      groupArray = mainGroupArray.filter((item: any, index: number) => {
        if (item.arrlength > 0) {
          item.position = render(index);
          return item;
        }
      });
      console.log('groupArray', groupArray);
      setMainGroupArray(groupArray);
    }
  }, [memberHeaderIndex, mainGroupArray.length]);
  const sortArr = (arr: object[], item: any) => {
    arr.push(item);
    arr = _.sortBy(arr, ['taskEndDate']).reverse();
    arr = _.sortBy(arr, ['finishPercent']);
    return arr;
  };
  const render = (index: number) => {
    let obj = {
      left: 0,
      top: 0,
    };
    let dom: any = document.getElementById('workingTableGroup' + index);
    console.log(dom);
    if (dom) {
      let height = dom.offsetHeight;
      let width = dom.offsetWidth;
      let ratio = width / height;
      let colIndex: number = index % colNumbers;
      obj.left = colIndex * colWidth;
      // //首行 top为 0，记录每列的高度
      if (index < colNumbers) {
        obj.top = 0;
        colHeight[colIndex] = colWidth / ratio;
        setColHeight(colHeight);
      } else {
        //获取高度的最小值
        let minHeight: any = Math.min.apply(null, colHeight);
        let minIndex: number = parseInt(colHeight.indexOf(minHeight));
        //此图片的 top 为上面图片的高度，left 相等
        obj.top = parseInt(minHeight);
        obj.left = Math.floor(minIndex * colWidth);
        //     //把高度加上去
        colHeight[minIndex] += colWidth / ratio;
      }
      console.log(obj);
      return obj;
    }
  };
  const addTask = (groupInfo: any, labelInfo: any) => {
    console.log(groupInfo, labelInfo);
    dispatch(
      addWorkingTableTask(
        '',
        groupInfo._key,
        groupInfo.groupRole,
        labelInfo._key,
        0,
        labelInfo.executorKey
      )
    );
  };
  const getGroupItem = (item: any) => {
    let dom: any = [];
    for (let key in item) {
      let groupItem = item[key];
      let groupIndex = key;
      dom.push(
        <div style={{ marginBottom: '2px' }} key={'groupItem' + groupIndex}>
          {groupItem.labelObj ? (
            <div>
              {groupIndex != 'groupObj' && groupIndex != 'position' ? (
                <div className="workingTableLabel-info-labelName">
                  <div>
                    {groupItem.labelObj
                      ? groupItem.labelObj.cardLabelName
                      : '无标题'}
                  </div>
                  {item.groupObj.groupRole > 0 &&
                  item.groupObj.groupRole < 4 ? (
                    <div
                      onClick={() => {
                        addTask(item.groupObj, groupItem.labelObj);
                      }}
                    >
                      添加任务
                    </div>
                  ) : null}
                  {item.groupObj.groupRole > 0 &&
                  item.groupObj.groupRole < 4 ? (
                    <div style={{ position: 'relative' }}>
                      <div
                        className="task-item-title-icon"
                        onClick={() => {
                          setBatchLabelKey(groupItem.labelObj._key);
                        }}
                      >
                        批量任务
                      </div>
                      <DropMenu
                        visible={groupItem.labelObj._key == batchLabelKey}
                        dropStyle={{
                          width: '150px',
                          height: '100px',
                          top: '18px',
                        }}
                        onClose={() => {
                          setBatchLabelKey('');
                        }}
                      >
                        <div
                          onClick={() => {
                            batchTaskArray(groupItem.arr);
                          }}
                        >
                          归档全部已完成任务
                        </div>
                        <div
                          onClick={() => {
                            chooseBatchLabel(
                              groupItem.labelObj._key,
                              item.groupObj._key,
                              groupItem.arr.length
                            );
                          }}
                        >
                          批量导入
                        </div>
                      </DropMenu>
                    </div>
                  ) : null}
                </div>
              ) : null}
              <div
                v-for="(taskItem,taskIndex) in groupItem.arr"
                className="workingTableLabel-info-item"
              >
                {groupItem.arr.map((taskItem: any, taskIndex: number) => {
                  return <Task taskItem={taskItem} key={'task' + taskIndex} />;
                })}
              </div>
            </div>
          ) : null}
        </div>
      );
    }
    return dom;
  };
  const batchTaskArray = async (arr: any) => {
    let cardKeyArray = arr.map((item: any) => {
      return item._key;
    });
    let batchRes: any = await api.task.batchTaskArray(cardKeyArray);
    if (batchRes.msg == 'OK') {
      dispatch(setMessage(true, '保存成功', 'success'));
      if (headerIndex == 1) {
        dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2]));
      } else if (headerIndex == 2) {
        dispatch(getWorkingTableTask(2, targetUserInfo._key, 1, [0, 1, 2]));
      }
    } else {
      dispatch(setMessage(true, batchRes.msg, 'error'));
    }
  };
  const chooseBatchLabel = (
    labelKey: string | null,
    groupKey: string | null,
    index: number
  ) => {
    setBatchGroupKey(groupKey);
    setBatchTaskVisible(true);
    setBatchTaskIndex(index - 1);
  };
  return (
    <div
      className="workingTableLabel-container"
      style={{ display: 'flex', overflowX: 'auto', height: '100%' }}
      ref={workingTableRef}
    >
      {mainGroupArray.map((item: any, index: number) => {
        return (
          <div key={'mainGroup' + index}>
            {/* {item.arrlength > 0 ? ( */}
            <div
              className="workingTableLabel-container-item"
              style={
                memberHeaderIndex == 1
                  ? {
                      width: '350px',
                      height: '100%',
                      flexShrink: 0,
                    }
                  : {
                      width: colWidth + 'px',
                      position: 'absolute',
                      top: item.position.top + 'px',
                      left: item.position.left + 'px',
                    }
              }
              key={'group' + index}
              id={'workingTableGroup' + index}
            >
              <div
                className="workingTableLabel-info"
                style={
                  memberHeaderIndex == 1
                    ? { width: '350px' }
                    : { width: '100%' }
                }
              >
                <div className="workingTableLabel-info-groupName">
                  {/* onClick={toGroup(item.groupObj)} */}

                  <div className="workingTableLabel-info-groupLogo">
                    <img src={item.groupObj.groupLogo} />
                  </div>
                  <div>{item.groupObj.groupName}</div>
                </div>
                <div
                  style={{ overflowY: 'auto' }}
                  className="workingTableLabel-info-item-group-container"
                >
                  {getGroupItem(item)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default WorkingTableGroup;
