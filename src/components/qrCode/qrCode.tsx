import React, { useState, useEffect } from 'react';
// import './userCenter.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import QRCode from 'qrcode';
interface CodeProps {
  url: string;
  id: string;
}

const Code: React.FC<CodeProps> = (props) => {
  const { url, id } = props;
  const dispatch = useDispatch();
  const [] = useState<number[]>([]);
  useEffect(() => {
    if (url) {
      QRCode.toCanvas(
        document.getElementById('canvas' + id),
        url,
        function (error) {
          if (error) console.error(error);
          console.log('success!');
        }
      );
    }
  }, [url]);
  return (
    <div>
      <canvas id={'canvas' + id}></canvas>
    </div>
  );
};
Code.defaultProps = {};
export default Code;
