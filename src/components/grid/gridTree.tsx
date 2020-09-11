import React, { useState, useEffect } from 'react';
import './gridTree.css';
import { useDispatch } from 'react-redux';
import Task from '../task/task';
import NewGridTree from './gridTree';
interface GridTreeProps {
  taskItem: any;
  left: number;
  lineLeft: number;
  gridState: boolean;
  taskNavDate: any;
  taskNavDay: any;
}

const GridTree: React.FC<GridTreeProps> = (props) => {
  let { taskItem, left, lineLeft, gridState, taskNavDate, taskNavDay } = props;
  const taskLeft = left + 15;
  const lineTaskLeft = lineLeft + 15;
  const chooseTaskTime = (index: number) => {
    // this.$emit("playTreeAudio");
    // this.editCard({
    //   key: this.taskItem._key,
    //   taskEndDate: new Date().getTime() + index * 86400000,
    // });
    // if(left=0){
    // }else{
    // }
  };
  const chooseTaskPerson = async (index: number) => {
    // this.$emit("playTreeAudio");
    // await this.addGroupMember({
    //   param: {
    //     groupKey: this.taskItem.groupKey,
    //     targetUidList: [
    //       {
    //         userKey: this.taskNavDate[index].userId,
    //         nickName: this.taskNavDate[index].nickName,
    //         avatar: this.taskNavDate[index].avatar,
    //         gender: this.taskNavDate[index].gender,
    //         role: 4,
    //       },
    //     ],
    //   },
    //   item: this.taskNavDate[index],
    //   type: "member",
    // });
    // await this.editCard({
    //   key: this.taskItem._key,
    //   executorKey: this.taskNavDay[index].userId,
    // });
  };
  return (
    <React.Fragment>
      <div
        className="grid-title"
        //  :ref="'task'+taskItem._key"
      >
        {/* <div className="line-img-task" style={{ left: lineLeft + 'px' }}></div> */}
        <div
          className="grid-title-subtitle"
          style={{ paddingLeft: taskLeft + 'px' }}
        >
          <Task taskItem={taskItem} />
        </div>
        <div className="grid-label-tr grid-title-subtask">
          {taskItem.dayArr.map((dateItem: any, dateIndex: number) => {
            return (
              <div
                // v-for="() in taskItem.dayArr"
                key={'dateItem' + dateIndex}
                className="grid-label-td"
                onClick={() => {
                  gridState
                    ? chooseTaskTime(dateIndex)
                    : chooseTaskPerson(dateIndex);
                }}
                style={
                  dateItem ? { backgroundColor: 'rgba(59,82,107,0.8)' } : {}
                }
              >
                {dateItem}
              </div>
            );
          })}
        </div>
      </div>
      {taskItem.children.map((child: any, index: number) => {
        return (
          <div key={'child' + index} className="grid-title-task chooseTr">
            <div v-if="child">
              <NewGridTree
                taskItem={child}
                left={taskLeft}
                lineLeft={lineTaskLeft}
                gridState={gridState}
                taskNavDate={taskNavDate}
                taskNavDay={taskNavDay}
                // @playTreeAudio="playTreeAudio"
              />
            </div>
          </div>
        );
      })}
    </React.Fragment>
  );
};
GridTree.defaultProps = {};
export default GridTree;
