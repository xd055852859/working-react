import React, { useState, useEffect } from 'react';
// import './userCenter.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import HeaderCreate from '../../components/headerSet/headerCreate';
interface CreateProps {}

const Create: React.FC<CreateProps> = (props) => {
  const {} = props;
  const dispatch = useDispatch();
  const [] = useState<number[]>([]);
  return (
    <HeaderCreate
      visible={true}
      createStyle={{
        width: '100%',
        overflow: 'auto',
        padding: '0px 15px',
      }}
    />
  );
};
Create.defaultProps = {};
export default Create;
