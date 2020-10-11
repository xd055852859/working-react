import React, { useState, useEffect } from 'react';
import './groupModel.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../redux/actions/commonActions';
import api from '../../services/api';
import leftArrowPng from '../../assets/img/leftArrow.png';

interface GroupModelProps {
  toGroupSet: any;
}

const GroupModel: React.FC<GroupModelProps> = (props) => {
  const { toGroupSet } = props;
  const dispatch = useDispatch();
  const [modelTypeArr, setModelTypeArr] = useState<any>([]);
  const [modelTypeList, setModelTypeList] = useState<any>([]);
  const [modelInfo, setModelInfo] = useState<any>(null);
  const [modelType, setModelType] = useState<any>(null);
  const [modelIndex, setModelIndex] = useState(0);
  const [modelInfoIndex, setModelInfoIndex] = useState<any>(null);
  const [modelState, setModelState] = useState(false);
  const [modelPage, setModelPage] = useState(1);
  // const modelLimit = 8;
  useEffect(() => {
    getModelType();
  }, []);
  const getModelType = async () => {
    let res: any = await api.group.getTemplateTypeList();
    if (res.msg === 'OK') {
      console.log(res);
      setModelTypeArr(res.result);
      setModelType(res.result[0]);
      getModelTypeList(res.result[0], 1);
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };
  const getModelTypeList = async (type: any, page: number) => {
    let res: any = await api.group.getTemplateListAccordingType(type, page);
    if (res.msg === 'OK') {
      setModelTypeList(res.result);
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };
  return (
    <div className="groupModel">
      <div className="groupModel-left">
        {modelTypeArr.map((item: any, index: number) => {
          return (
            <div
              onClick={() => {
                setModelType(item);
                getModelTypeList(item, 1);
                setModelPage(1);
                setModelIndex(index);
              }}
              className="groupModel-left-item"
              style={
                modelIndex == index
                  ? { background: '#ffffff', color: '#17b881' }
                  : {}
              }
            >
              {item}
            </div>
          );
        })}
      </div>
      <div className="groupModel-right">
        {!modelState ? (
          <React.Fragment>
            {modelTypeList.map((item: any, index: number) => {
              return (
                <div
                  className="groupModel-right-item"
                  onMouseEnter={() => {
                    setModelInfoIndex(index);
                  }}
                  onMouseLeave={() => {
                    setModelInfoIndex(null);
                  }}
                  onClick={() => {
                    setModelState(true);
                    setModelInfo(item);
                  }}
                >
                  <div className="groupModel-right-item-img">
                    <img src={item.templateUrl} alt="" />
                    {modelInfoIndex == index ? (
                      <div className="groupModel-right-item-button">
                        <Button
                          variant="contained"
                          color="primary"
                          style={{
                            marginLeft: '10px',
                            width: '70%',
                            color: '#fff',
                          }}
                          onClick={() => {
                            toGroupSet(item._key);
                          }}
                        >
                          使用此模板
                        </Button>
                      </div>
                    ) : null}
                  </div>
                  <div className="groupModel-right-item-name">{item.name}</div>{' '}
                  <div className="groupModel-right-item-description">
                    {item.description}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ) : (
          <div className="groupModel-right-info">
            <div className="groupModel-right-info-title">
              <div className="groupModel-right-info-maintitle">
                <img
                  src={leftArrowPng}
                  alt=""
                  style={{ width: '7px', height: '11px', cursor: 'pointer' }}
                  onClick={() => {
                    setModelState(false);
                    setModelInfo(null);
                  }}
                />
                <div className="groupModel-right-info-name">
                  {modelInfo.name}
                </div>
              </div>
              <Button
                variant="contained"
                color="primary"
                style={{
                  width: '196px',
                  color: '#fff',
                }}
                onClick={() => {
                  toGroupSet(modelInfo._key);
                }}
              >
                使用此模板
              </Button>
            </div>
            <div className="groupModel-right-info-img">
              <img src={modelInfo.templateUrl} alt="" />
            </div>
            <div className="groupModel-right-item-description">
              {modelInfo.description}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
GroupModel.defaultProps = {};
export default GroupModel;
