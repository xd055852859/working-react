import React, { useState, useEffect } from 'react';
import './download.css';
import { useTypedSelector } from '../redux/reducer/RootState';
import { useDispatch } from 'react-redux';

interface DownloadProps {
 
}

const Download: React.FC<DownloadProps> = (props) => {
  const { } = props;
  const dispatch = useDispatch();
  const [] = useState<number[]>([]);
  return (
    <div></div>
  );
};
Download.defaultProps = {
};
export default Download;