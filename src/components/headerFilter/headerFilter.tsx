import React, { useState, useEffect } from 'react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import Filter from '../common/filter';
import { setFilterObject } from '../../redux/actions/taskActions';
import _ from 'lodash';
interface HeaderFilterProps {}

const HeaderFilter: React.FC<HeaderFilterProps> = (prop) => {
  const taskArray = useTypedSelector((state) => state.task.taskArray);
  const workingTaskArray = useTypedSelector(
    (state) => state.task.workingTaskArray
  );
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);

  const [groupFilterVisible, setGroupFilterVisible] = useState(false);
  const [executorfilterVisible, setExecutorFilterVisible] = useState(false);
  const [creatorFilterVisible, setCreatorFilterVisible] = useState(false);
  const [groupFilterArray, setGroupFilterArray] = useState<any>();
  const [executorfilterArray, setExecutorFilterArray] = useState<any>();
  const [creatorFilterArray, setCreatorFilterArray] = useState<any>();
  const [groupIndex, setGroupIndex] = useState(0);
  const [creatorIndex, setCreatorIndex] = useState(0);
  const [executorIndex, setExecutorIndex] = useState(0);

  const dispatch = useDispatch();
  useEffect(() => {
    // 用户已登录
    if (headerIndex != 3 && workingTaskArray) {
      getData(workingTaskArray);
    }
  }, [workingTaskArray, headerIndex]);
  useEffect(() => {
    // 用户已登录
    if (headerIndex == 3 && taskArray) {
      getData(taskArray);
    }
  }, [taskArray, headerIndex]);
  const getData = (cardArray: any) => {
    let groupFilterArray: any = [
      {
        name: '全部',
        key: null,
      },
    ];
    let creatorFilterArray: any = [
      {
        name: '全部',
        key: null,
      },
    ];
    let executorfilterArray: any = [
      {
        name: '全部',
        key: null,
      },
    ];
    _.flatten(cardArray).forEach((item: any) => {
      let groupIndex = _.findIndex(groupFilterArray, { key: item.groupKey });
      if (groupIndex == -1 && item.groupKey) {
        groupFilterArray.push({
          key: item.groupKey,
          name: item.groupName,
          logo: item.groupLogo,
        });
      }
      let creatorIndex = _.findIndex(creatorFilterArray, {
        key: item.creatorKey,
      });
      if (creatorIndex == -1 && item.creatorKey) {
        creatorFilterArray.push({
          key: item.creatorKey,
          name: item.creatorName,
          avatar: item.creatorAvatar,
        });
      }
      let executorIndex = _.findIndex(executorfilterArray, {
        key: item.executorKey,
      });
      if (executorIndex == -1 && item.executorKey) {
        executorfilterArray.push({
          key: item.executorKey,
          name: item.executorName,
          avatar: item.executorAvatar,
        });
      }
    });
    setGroupFilterArray(groupFilterArray);
    setExecutorFilterArray(executorfilterArray);
    setCreatorFilterArray(creatorFilterArray);
    // this.$set(this.filterObj, "type", this.stateStr);
    // this.$emit("update:taskObj", this.filterObj);
  };
  const changeFilter = (type: string, key: string, index: number) => {
    let filterObject: any = {};
    let creatorFilterArray: any = [
      {
        name: '全部',
        key: null,
      },
    ];
    let executorfilterArray: any = [
      {
        name: '全部',
        key: null,
      },
    ];
    let arr = [];
    if (headerIndex == 3) {
      arr = _.cloneDeep(taskArray);
    } else {
      arr = _.cloneDeep(_.flatten(workingTaskArray));
    }
    switch (type) {
      case 'groupKey':
        setGroupIndex(index);
        setGroupFilterVisible(false)
        break;
      case 'creatorKey':
        setCreatorIndex(index);
        setCreatorFilterVisible(false)
        break;
      case 'executorKey':
        setExecutorIndex(index);
        setExecutorFilterVisible(false)
    }
    if (type == 'groupKey') {
      if (key) {
        arr.forEach((item: any) => {
          if (item.groupKey == key) {
            let creatorIndex = _.findIndex(creatorFilterArray, {
              key: item.creatorKey,
            });
            if (creatorIndex == -1 && item.creatorKey) {
              creatorFilterArray.push({
                key: item.creatorKey,
                name: item.creatorName,
                avatar: item.creatorAvatar,
              });
            }
            // this.creatorFindIndex = this._.findIndex(this.creatorArr, {
            //   key: this.user._key,
            // });
            // if (this.creatorFindIndex != -1) {
            //   let creatorFindItem = this._.cloneDeep(
            //     this.creatorArr[this.creatorFindIndex]
            //   );
            //   this.creatorArr.splice(this.creatorFindIndex, 1);
            //   this.creatorArr.splice(1, 0, creatorFindItem);
            // }
            let executorIndex = _.findIndex(executorfilterArray, {
              key: item.executorKey,
            });
            if (executorIndex == -1 && item.executorKey) {
              executorfilterArray.push({
                key: item.executorKey,
                name: item.executorName,
                avatar: item.executorAvatar,
              });
            }
            // this.executorFindIndex = this._.findIndex(this.executorArr, {
            //   key: this.user._key,
            // });
            // if (this.executorFindIndex != -1) {
            //   let executorFindItem = this._.cloneDeep(
            //     this.executorArr[this.executorFindIndex]
            //   );
            //   this.executorArr.splice(this.executorFindIndex, 1);
            //   this.executorArr.splice(1, 0, executorFindItem);
            // }
          }
        });
        setExecutorFilterArray(executorfilterArray);
        setCreatorFilterArray(creatorFilterArray);
      } 
    //   else {
    //     getData(arr);
    //   }
    }
    filterObject[type] = key;
    dispatch(setFilterObject(filterObject));
  };
  return (
    <React.Fragment>
      {headerIndex == 3 ? (
        <Filter
          title={'群组'}
          visible={groupFilterVisible}
          filterType={'groupKey'}
          filterArray={groupFilterArray}
          filterItemStyle={{
            width: '228px',
            minHeight: '300px',
            top: '38px',
          }}
          filterStyle={{ padding: '0px 18px' }}
          filterIndex={groupIndex}
          onOpen={() => {
            setGroupFilterVisible(true);
          }}
          onClose={() => {
            setGroupFilterVisible(false);
          }}
          onClick={changeFilter}
          filterItem={['name', 'avatar','key']}
          defaultPngType={1}
        />
      ) : null}
      <Filter
        title={'执行人'}
        visible={executorfilterVisible}
        filterType={'executorKey'}
        filterArray={executorfilterArray}
        filterItemStyle={{
          width: '228px',
          minHeight: '300px',
          top: '38px',
        }}
        filterStyle={{ padding: '0px 18px' }}
        filterIndex={executorIndex}
        onOpen={() => {
          setExecutorFilterVisible(true);
        }}
        onClose={() => {
          setExecutorFilterVisible(false);
        }}
        onClick={changeFilter}
        filterItem={['name', 'avatar','key']}
        defaultPngType={0}
      />
      <Filter
        title={'创建人'}
        visible={creatorFilterVisible}
        filterType={'creatorKey'}
        filterArray={creatorFilterArray}
        filterItemStyle={{
          width: '228px',
          minHeight: '300px',
          top: '38px',
        }}
        filterStyle={{ padding: '0px 18px' }}
        filterIndex={creatorIndex}
        onOpen={() => {
          setCreatorFilterVisible(true);
        }}
        onClose={() => {
          setCreatorFilterVisible(false);
        }}
        onClick={changeFilter}
        filterItem={['name', 'avatar', 'key']}
        defaultPngType={0}
      />
    </React.Fragment>
  );
};
export default HeaderFilter;
