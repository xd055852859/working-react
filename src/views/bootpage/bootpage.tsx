import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';

const Bootpage: React.FC = () => {
  function toLogin() {
    const redirect = `${window.location.protocol}//${window.location.host}`;
    window.location.href = `https://account.qingtime.cn?apphigh=27&redirect=${redirect}&logo=https://working.vip/page/logo2.svg`;
  }
  return (
    <div>
      <Button variant="contained" color="primary" onClick={toLogin}>
        登录
      </Button>
    </div>
  );
};
export default Bootpage;
