import React, { useState, useEffect } from 'react';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { useDispatch } from 'react-redux';
import Loading from '../common/loading';
interface Props {
  node: any;
  bookid?: string;
}

export default function Table({ node, bookid }: Props) {
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);

  let path = '';
  // // if (!window.location.host.includes('localhost') && !window.location.host.includes('192.168.')) {
  // //   path = '';
  // // }

  // useEffect(() => {
  //   setloading(true);
  // }, [node]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* <Tooltip title="公开分享">
        <IconButton
          style={{ position: 'absolute', top: '-8px', right: '65px' }}
          onClick={() => dispatch(togglePublicShareModal(true))}
        >
          <ShareOutlinedIcon />
        </IconButton>
      </Tooltip> */}
      <iframe
        name="frame-container"
        className="web-view"
        title="时光表格"
        src={`${window.location.protocol}//${window.location.host}${path}/editor/sheet.html?key=${node._key}`}
        frameBorder="0"
        width="100%"
        height="100%"
        onLoad={() => setloading(false)}
      ></iframe>
      {/* {loading ? <Loading /> : null} */}
    </div>
  );
}
