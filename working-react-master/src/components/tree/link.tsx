import React, { useState, useEffect } from 'react';
import Webview from '../common/Webview';
import { useDispatch } from 'react-redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import { editTask } from '../../redux/actions/taskActions';
// import { editArticle } from '../../redux/actions/articleActions';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    EditLink: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    linkInfo: {
      width: '95%',
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'flex-start',
      borderBottom: '1px solid #E1E1E5',
    },
    iframeWrapper: {
      flex: 1,
    },
  })
);

interface LinkProps {
  targetData: any;
  hideUrl?: boolean;
  onChange?: any;
}

let timer: NodeJS.Timeout;
const Link: React.FC<LinkProps> = (props) => {
  const { targetData, hideUrl, onChange } = props;
  const classes = useStyles();
  const [value, setValue] = useState('');
  const [url, seturl] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    setValue(
      targetData.extraData && targetData.extraData.url
        ? targetData.extraData.url
        : ''
    );
    seturl(
      targetData.extraData && targetData.extraData.url
        ? targetData.extraData.url
        : ''
    );
  }, [targetData]);

  function handleChange(value: string) {
    clearTimeout(timer);
    setValue(value);
    timer = setTimeout(() => {
      seturl(value);
    }, 1000);
  }

  let linkUrl;
  if (url.includes('http://') || url.includes('https://')) {
    linkUrl = url;
  } else {
    linkUrl = `https://${url}`;
  }

  return (
    <div className={classes.EditLink}>
      {/* {!hideUrl ? ( */}
      <div className={classes.linkInfo}>
        <TextField
          label="链接地址"
          variant="outlined"
          size="small"
          placeholder="请输入链接地址"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">https://</InputAdornment>
            ),
          }}
          style={{ flex: 1, marginRight: '8px' }}
          value={value}
          onChange={(e: any) => handleChange(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          style={{ color: '#fff' }}
          onClick={() => {
            onChange(url);
            // dispatch(
            //   editTask(
            //     {
            //       key: targetData._key,
            //       extraData: { url: url },
            //     },
            //     3
            //   )
            // );
          }}
        >
          保存
        </Button>
      </div>
      {/* ) : null} */}

      <div className={classes.iframeWrapper}>
        <Webview uri={linkUrl} />
      </div>
    </div>
  );
};
Link.defaultProps = {};
export default Link;
