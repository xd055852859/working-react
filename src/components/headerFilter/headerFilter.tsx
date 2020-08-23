import React, { useState, useEffect } from 'react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import Filter from '../common/filter'
import _ from 'lodash'
interface HeaderFilterProps { }

const HeaderFilter: React.FC<HeaderFilterProps> = (prop) => {
    const taskArray = useTypedSelector((state) => state.task.taskArray);
    const workingTaskArray = useTypedSelector((state) => state.task.workingTaskArray);
    const headerIndex = useTypedSelector((state) => state.common.headerIndex);

    const [groupFilterVisible,
        setGroupFilterVisible] = useState(false);
    const [executorfilterVisible,
        setExecutorFilterVisible] = useState(false);
    const [creatorFilterVisible,
        setCreatorFilterVisible] = useState(false);
    const [groupFilterArray,
        setGroupFilterArray] = useState<any>();
    const [executorfilterArray,
        setExecutorFilterArray] = useState<any>();
    const [creatorFilterArray,
        setCreatorFilterArray] = useState<any>();

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
                name: "全部",
                key: null
            }
        ];
        let creatorFilterArray: any = [
            {
                name: "全部",
                key: null
            }
        ];
        let executorfilterArray: any = [
            {
                name: "全部",
                key: null
            }
        ];
        _.flatten(cardArray).forEach((item: any) => {
            let groupIndex = _.findIndex(groupFilterArray, { key: item.groupKey });
            if (groupIndex == -1 && item.groupKey) {
                groupFilterArray.push({ key: item.groupKey, name: item.groupName, logo: item.groupLogo });
            }
            let creatorIndex = _.findIndex(creatorFilterArray, { key: item.creatorKey });
            if (creatorIndex == -1 && item.creatorKey) {
                creatorFilterArray.push({ key: item.creatorKey, name: item.creatorName, avatar: item.creatorAvatar });
            }
            let executorIndex = _.findIndex(executorfilterArray, { key: item.executorKey });
            if (executorIndex == -1 && item.executorKey) {
                executorfilterArray.push({ key: item.executorKey, name: item.executorName, avatar: item.executorAvatar });
            }
        });
        setGroupFilterArray(groupFilterArray);
        setExecutorFilterArray(executorfilterArray);
        setCreatorFilterArray(creatorFilterArray);
        console.log(cardArray);
        console.log(executorfilterArray);
        console.log(creatorFilterArray);
        // this.$set(this.filterObj, "type", this.stateStr);
        // this.$emit("update:taskObj", this.filterObj);
    }
    return (
        <React.Fragment>
            {headerIndex == 3 ? <Filter
                title={'群组'}
                visible={groupFilterVisible}
                filterArray={groupFilterArray}
                filterItemStyle={{
                    width: '200px',
                    height: '300px',
                    top: '15px'
                }}
                onOpen={() => {
                    setGroupFilterVisible(true)
                }}
                onClose={() => {
                    setGroupFilterVisible(false)
                }}
                filterItem={['name', 'avatar']}
                defaultPngType={1} />
                : null}
            <Filter
                title={'执行人'}
                visible={executorfilterVisible}
                filterArray={executorfilterArray}
                filterItemStyle={{
                    width: '200px',
                    height: '300px',
                    top: '15px'
                }}
                onOpen={() => {
                    setExecutorFilterVisible(true)
                }}
                onClose={() => {
                    setExecutorFilterVisible(false)
                }}
                filterItem={['name', 'avatar']}
                defaultPngType={0} />
            <Filter
                title={'创建人'}
                visible={creatorFilterVisible}
                filterArray={creatorFilterArray}
                filterItemStyle={{
                    width: '200px',
                    height: '300px',
                    top: '15px'
                }}
                onOpen={() => {
                    setCreatorFilterVisible(true)
                }}
                onClose={() => {
                    setCreatorFilterVisible(false)
                }}
                filterItem={['name', 'avatar']}
                defaultPngType={0} />
        </React.Fragment>
    )
};
export default HeaderFilter;
