import React, { useState, useEffect } from 'react';
import './file.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';

import FileInfo from '../../components/fileInfo/fileInfo';

interface FileProps {
 
}

const File: React.FC<FileProps> = (props) => {
  const { } = props;
  const dispatch = useDispatch();
  const [] = useState<number[]>([]);
  return (
    <div className="file"><FileInfo type={'single'}/></div>
  );
};
File.defaultProps = {
};
export default File;