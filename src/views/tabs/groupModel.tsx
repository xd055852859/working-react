import React, { useState, useEffect } from 'react';
import './groupModel.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { useDispatch } from 'react-redux';
import api from '../../services/api';

import { setMessage } from '../../redux/actions/commonActions';

import Editor from '../../components/common/Editor';
import unfinishbPng from '../../assets/img/unfinishb.png';
import leftArrowPng from '../../assets/img/leftArrow.png';
import modelDefaultPng from '../../assets/img/modelDefault.png';

interface GroupModelProps {
  toGroupSet: any;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ul: {
      '& .MuiPaginationItem-textPrimary.Mui-selected': {
        color: '#fff'
      }
    },
  })
);
const GroupModel: React.FC<GroupModelProps> = (props) => {
  const { toGroupSet } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTypedSelector((state) => state.auth.theme);
  const [modelTypeArr, setModelTypeArr] = useState<any>([]);
  const [modelTypeList, setModelTypeList] = useState<any>([]);
  const [modelInfo, setModelInfo] = useState<any>(null);
  // const [modelType, setModelType] = useState<any>(null);
  const [modelIndex, setModelIndex] = useState(0);
  const [modelInfoIndex, setModelInfoIndex] = useState<any>(null);
  const [modelState, setModelState] = useState(false);
  const [modelPage, setModelPage] = useState(1);
  const [modelTotal, setModelTotal] = useState(0);
  const BgColorArray = [
    'rgba(48,191,191,0.3)',
    'rgba(0,170,255,0.3)',
    'rgba(143,126,230,0.3)',
    'rgba(179,152,152,0.3)',
    'rgba(242,237,166,0.3)',
  ];
  useEffect(() => {
    getModelType();
  }, []);
  const getModelType = async () => {
    let res: any = await api.group.getTemplateTypeList();
    if (res.msg === 'OK') {
      res.result.unshift('全部')
      setModelTypeArr(res.result);
      // setModelType(res.result[0]);
      getModelTypeList(1, null);
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };
  const getModelTypeList = async (page: number, type: any) => {
    type = type === '全部' ? null : type;
    let res: any = await api.group.getTemplateListAccordingType(page, type);
    if (res.msg === 'OK') {
      setModelTypeList(res.result);
      setModelTotal(res.totalNumber);
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
                // setModelType(item);
                getModelTypeList(1, item);
                setModelPage(1);
                setModelIndex(index);
                setModelState(false);
              }}
              className="groupModel-left-item"
              style={
                modelIndex === index
                  ? { background: '#ffffff', color: '#17b881' }
                  : {}
              }
              key={'modelTypeArr' + index}
            >
              {item}
            </div>
          );
        })}

      </div>
      <div className="groupModel-right">
        {!modelState ? (
          <React.Fragment>
            <div className="groupModel-right-box">
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
                    key={'modelType' + index}
                  >
                    <div className="groupModel-right-item-img">
                      <img
                        src={item.modelUrl ? item.modelUrl : modelDefaultPng}
                        alt=""
                      />
                      {modelInfoIndex === index ? (
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
                      {item.description
                        .replace(/<[^>]*>|<\/[^>]*>/gm, '')
                        .replace('Powered by Froala Editor', '')}
                    </div>
                  </div>
                );
              })}
            </div>
            {modelTotal > 9 ? <div className="groupModel-pagination"> <Pagination className={classes.ul} count={Math.ceil(modelTotal / 9)} color="primary" onChange={(e: any, page: number) => { getModelTypeList(page, modelTypeArr[modelIndex]); setModelPage(page) }} /></div> : null}

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
              <div className="groupModel-right-container"><div
                className="groupModel-model"
                style={
                  theme.backgroundImg
                    ? {
                      backgroundImage: 'url(' + theme.backgroundImg + ')',
                    }
                    : {
                      backgroundColor: theme.backgroundColor
                        ? theme.backgroundColor
                        : '#3C3C3C',
                    }
                }
              >
                {modelInfo.templateJson.map(
                  (templateItem: any, templateIndex: number) => {
                    return (
                      <div
                        key={'template' + templateIndex}
                        className="groupModel-model-container"
                      >
                        <div
                          className="groupModel-model-taskNav"
                          style={{
                            backgroundColor: BgColorArray[templateIndex % 5],
                          }}
                        >
                          {templateItem.name}
                        </div>
                        <div className="groupModel-model-taskContainer">
                          {templateItem.children.map(
                            (childItem: any, childIndex: number) => {
                              return (
                                <div
                                  key={'child' + childIndex}
                                  className="groupModel-model-task"
                                >
                                  <img
                                    src={unfinishbPng}
                                    className="groupModel-model-logo"
                                  />
                                  <div className="groupModel-model-task-title">
                                    {' '}
                                    {childItem.name}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
                <Editor
                  // editorHeight={'300px'}
                  data={modelInfo.description}
                  editable={false}
                />
              </div>
            </div>
          )}
      </div>
    </div>
  );
};
GroupModel.defaultProps = {};
export default GroupModel;
