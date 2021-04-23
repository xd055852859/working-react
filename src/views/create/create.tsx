import React, { useState, useEffect } from 'react';
// import './userCenter.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { changeMusic } from '../../redux/actions/authActions';
import { useDispatch } from 'react-redux';
import HeaderCreate from '../../components/headerSet/headerCreate';
interface CreateProps {}

const Create: React.FC<CreateProps> = (props) => {
  const {} = props;
  const dispatch = useDispatch();
  const [] = useState<number[]>([]);
  useEffect(() => {
    localStorage.removeItem('createType');
    dispatch(changeMusic(0));
  }, []);
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
