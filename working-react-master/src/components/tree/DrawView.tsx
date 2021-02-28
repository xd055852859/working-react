import Button from '@material-ui/core/Button';
import { Options, Topology } from '@topology/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
// import { getArticleById, togglePublicShareModal } from '../redux/actions/articleActions';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { getSearchParamValue, is_mobile } from '../../services/util';
import './DrawView.css';
import Tooltip from '@material-ui/core/Tooltip';
import { register as registerFlow } from '@topology/flow-diagram'; // 流程图

import { register as registerActivity } from '@topology/activity-diagram'; // 活动图

import { register as registerClass } from '@topology/class-diagram'; // 类图

import { register as registerSequence } from '@topology/sequence-diagram'; // 时序图

import { register as registerMyself } from './customized-diagram/index'; // 注册自治图形库

let canvas: Topology;
const DrawView: FC<{
  targetNode?: any;
  handleEdit?: Function;
  embed?: boolean;
  hideEditButton?: boolean;
}> = ({ targetNode, embed = false, handleEdit, hideEditButton }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const key = getSearchParamValue(location.search, 'key');
  const user = useTypedSelector((state) => state.auth.user);
  // const article = useTypedSelector((state) => state.article.article);
  // const isPublicShare = useTypedSelector((state) => state.article.isPublicShare);
  const [scaleNumber, setScaleNumber] = useState(1);
  const contentRef = useRef(null);

  const mobile = is_mobile();
  useEffect(() => {
    const canvasOptions: Options = {
      rotateCursor: '/rotate.cur',
      activeColor: 'red',
      translateKey: 4,
    };
    canvas = new Topology('topology-canvas', canvasOptions);
    canvasRegister();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 获取绘图数据
  // useEffect(() => {
  //   if ((user || isPublicShare) && key) {
  //     dispatch(getArticleById(key));
  //   }
  // }, [dispatch, user, key, isPublicShare]);

  // 加载绘图数据
  useEffect(() => {
    if (targetNode) {
      canvas.open(targetNode.content);
      canvas.fitView(80);
      canvas.lock(1);
    }
  }, [targetNode]);

  /**
   * 放大画布
   */

  const scaleZoomOut = () => {
    if (scaleNumber < 5) {
      setScaleNumber(scaleNumber + 0.5);
      canvas.scaleTo(scaleNumber + 0.5);
    }
  };

  /**
   * 缩小画布
   */

  const scaleZoomIn = () => {
    if (scaleNumber > 0.5) {
      setScaleNumber(scaleNumber - 0.5);
      canvas.scaleTo(scaleNumber - 0.5);
    }
  };
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  const editDraw = () => {
    sessionStorage.setItem('isEdit', '1');
    // embed ? handleEdit() : history.push(`/home/draw/drawView?key=${article?._key}`);
  };

  /**
   * 注册图形库
   */

  const canvasRegister = () => {
    registerFlow();
    // activity
    registerActivity();
    // class
    registerClass();
    // sequence
    registerSequence();
    // 注册自定义组件
    registerMyself();
    // registerNode('myShape', myShapeData, myShapeDataAnchors, myShapeDataIconRect, myShapeDataTextRect);
  };

  return (
    // <div
    //   className="container-view" onDoubleClick={ () => article?.readOnly ? null :history.push(`/home/draw/drawView?key=${article?._key}`)}
    // >
    // {mobile ? null : (
    //     <div className="view-header">
    //       <div
    //         className="go-back"
    //         onClick={() => (embed ? null : history.goBack())}
    //       >
    //         <ArrowBackIosIcon />
    //         <span>{article?.name}</span>
    //       </div>

    //       {article?.readOnly || hideEditButton ? null : (
    //         <div>
    //           <Button
    //             variant="outlined"
    //             size="small"
    //             onClick={editDraw}
    //             color="primary"
    //             style={{ marginRight: '8px' }}
    //           >
    //             编辑
    //           </Button>
    //           <Button
    //             variant="outlined"
    //             size="small"
    //             color="primary"
    //             onClick={() => dispatch(togglePublicShareModal(true))}
    //           >
    //             公开分享
    //           </Button>
    //         </div>
    //       )}
    //     </div>
    //   )}
    <React.Fragment>
      <div
        id="topology-canvas"
        ref={contentRef}
        style={{ height: '100%', width: '100%', backgroundColor: 'white' }}
      />
      <div className="controlls-left">
        <Tooltip title="放大" placement="top">
          <Button style={{ minWidth: '20px' }} onClick={scaleZoomOut}>
            <AddIcon />
          </Button>
        </Tooltip>
        <Tooltip title="缩小" placement="top">
          <Button style={{ minWidth: '20px' }} onClick={scaleZoomIn}>
            <RemoveIcon />
          </Button>
        </Tooltip>
        <Tooltip title="自适应居中" placement="top">
          <Button
            style={{ minWidth: '20px' }}
            onClick={() => canvas.fitView(80)}
          >
            <CenterFocusStrongIcon />
          </Button>
        </Tooltip>
        {mobile ? null : (
          <Tooltip title="全屏" placement="top">
            <Button style={{ minWidth: '20px' }} onClick={toggleFullScreen}>
              <AspectRatioIcon />
            </Button>
          </Tooltip>
        )}
      </div>
    </React.Fragment>
    // </div>
  );
};

export default DrawView;
