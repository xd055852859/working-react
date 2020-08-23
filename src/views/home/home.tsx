import React, { useEffect } from 'react';
import './home.css';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Tabs from '../tabs/tabs';
import { useDispatch } from 'react-redux';
import { setHeaderIndex } from '../../redux/actions/commonActions';
import { useTypedSelector } from '../../redux/reducer/RootState';

export interface HomeProps {}

const Home: React.FC<HomeProps> = (props) => {
  // const location = useLocation();
  // const history = useHistory();
  const dispatch = useDispatch();
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  return (
    <div className="home">
      <MenuList>
        <MenuItem
          selected={headerIndex == 0}
          onClick={() => dispatch(setHeaderIndex(0))}
        >
          首页
        </MenuItem>
        <MenuItem
          selected={headerIndex == 1}
          onClick={() => dispatch(setHeaderIndex(1))}
        >
          我的工作台
        </MenuItem>
        <MenuItem
          selected={headerIndex == 4}
          onClick={() => dispatch(setHeaderIndex(4))}
        >
          聊天
        </MenuItem>
      </MenuList>
      <Tabs />
    </div>
  );
};
export default Home;
