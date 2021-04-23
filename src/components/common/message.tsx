import React, { useEffect } from 'react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { message } from 'antd';

import { setMessage } from '../../redux/actions/commonActions';

export default function Message() {
  const dispatch = useDispatch();
  const allmessage = useTypedSelector((state) => state.common.message);
  useEffect(() => {
    if (allmessage.visible) {
      console.log(allmessage);
      switch (allmessage.messageType) {
        case 'success':
          message.success(allmessage.text, 2, () =>
            dispatch(setMessage(false, '', undefined))
          );
          break;
        case 'info':
          message.info(allmessage.text, 2, () =>
            dispatch(setMessage(false, '', undefined))
          );
          break;
        case 'warning':
          message.warning(allmessage.text, 2, () =>
            dispatch(setMessage(false, '', undefined))
          );
          break;
        case 'error':
          message.error(allmessage.text, 2, () =>
            dispatch(setMessage(false, '', undefined))
          );
          break;
      }
    }
  }, [allmessage]);
  return <React.Fragment></React.Fragment>;
}
