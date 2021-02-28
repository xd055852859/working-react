import React, { useState, useEffect } from 'react';
import './bookView.css';
import { Avatar } from '@material-ui/core';
import { Catalog } from 'tree-graph-react';
import { useTypedSelector } from '../../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import defaultPersonPng from '../../../assets/img/defaultPerson.png'
import _ from 'lodash';
import moment from 'moment';
interface BookViewProps {
  nodeObj: any;
  gridList: any;
  targetData: any;
  changeSelect: Function;
}

const BookView: React.FC<BookViewProps> = (props) => {
  const { nodeObj, gridList, targetData, changeSelect } = props;
  const user = useTypedSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [info, setInfo] = useState<any>(null);
  const [infoMap, setInfoMap] = useState<any>({});
  useEffect(() => {
    if (nodeObj) {
      let newInfoMap = _.cloneDeep(infoMap);
      for (let key in nodeObj) {
        let nodeIndex = _.findIndex(gridList, { _key: nodeObj[key]._key });
        newInfoMap[key] = (
          <div className="">
            <span>
              {moment(gridList[nodeIndex].updateTime).format('YY-MM-DD')}
            </span>
          </div>
        );
      }
      setInfo(
        <div className="bookView-person">
          <div className="bookView-person-name">{`作者：${
            targetData ? targetData.creatorName : ''
            // user.profile.nickName
          }`}</div>
          <div className="bookView-person-avatar">
            <Avatar src={targetData.creatorAvatar?targetData.creatorAvatar:defaultPersonPng} />
          </div>
        </div>
      );
      console.log(newInfoMap);
      setInfoMap(newInfoMap);
    }
  }, [nodeObj]);
  return (
    <div>
      {nodeObj && targetData._key ? (
        <Catalog
          nodes={nodeObj}
          startId={targetData._key}
          info={info}
          itemInfoMap={infoMap}
          handleClickNode={changeSelect}
        />
      ) : null}
    </div>
  );
};
BookView.defaultProps = {};
export default BookView;
