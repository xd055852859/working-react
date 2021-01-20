import React, { useRef, useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
// import IconButton from '@material-ui/core/IconButton';
// import Tooltip from '@material-ui/core/Tooltip';
// import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
// import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';

interface Props {
  data: any;
  handleEdit?: Function;
  hideEditButton?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    viewer: {
      position: 'relative',
      width: '100%',
      height: '100%',
    },
    content: {
      backgroundColor: '#FFF',
      maxWidth: '810px',
      minHeight: '100vh',
      margin: 'auto',
      overflow: 'hidden',
      padding: '5px 23px',
      [theme.breakpoints.down('md')]: {
        width: '100%',
      },
    },
    button: {
      position: 'fixed',
      right: 16,
      zIndex: 999,
      display: 'flex',
      flexDirection: 'column',
    },
  })
);

export default function MarkdownViewer({
  data,
  handleEdit,
  hideEditButton,
}: Props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [top, setTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef && containerRef.current) {
      setTop(containerRef.current.getBoundingClientRect().top);
    }
  }, []);

  return (
    <div className={classes.viewer} ref={containerRef}>
      <div className={`${classes.content} preview-container`}>
        <ReactMarkdown
          source={data || ''}
          // skipHtml={false}
          escapeHtml={false}
          renderers={{ code: CodeBlock }}
        />
      </div>
      {/* {hideEditButton ? null : (
        <div className={classes.button} style={{ top: `${top + 25}px` }}>
          <Tooltip title="编辑">
            <IconButton
              onClick={() => {
                sessionStorage.setItem('isEdit', '1');
                handleEdit();
              }}
            >
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="公开分享">
            <IconButton onClick={() => dispatch(togglePublicShareModal(true))}>
              <ShareOutlinedIcon />
            </IconButton>
          </Tooltip>
        </div>
      )} */}
    </div>
  );
}
