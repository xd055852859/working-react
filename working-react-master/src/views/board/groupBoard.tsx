import React, { useState, useEffect } from 'react';
import './mainBoard.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import Task from '../../components/task/task';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import moment from 'moment';
import _ from 'lodash';
import Avatar from '@material-ui/core/Avatar';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
   
  })
);
interface GroupBoardItemProps {

};

const GroupBoard: React.FC = () => {
  const user = useTypedSelector((state) => state.auth.user);
  const selfTaskArray = useTypedSelector((state) => state.task.selfTaskArray);
  const [mainArray, setMainArray] = useState<any>([]);
  const dispatch = useDispatch();

  return (
    <div className="groupBoard">
     
    </div>
  );
};
export default GroupBoard;