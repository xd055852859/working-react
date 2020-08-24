import React, { FC } from 'react';
import Contact from '../contact/contact';
import './tabs.css';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
// import { Theme, makeStyles } from '@material-ui/core/styles';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

export interface HomeTabProps {}
const HomeTab: React.FC<HomeTabProps> = (props) => {
  // const classes = useStyles();
  const [contactIndex, setContactIndex] = React.useState(0);

  return (
    <div className="tabs">
      <div className="tabs-tab-nav">
        <div
          onClick={() => {
            setContactIndex(0);
          }}
          style={
            contactIndex == 0 ? { background: 'rgba(255, 255, 255, 0.34)' } : {}
          }
          className="tabs-tab-nav-item"
        >
          项目
        </div>
        <div
          onClick={() => {
            setContactIndex(1);
          }}
          style={
            contactIndex == 1 ? { background: 'rgba(255, 255, 255, 0.34)' } : {}
          }
          className="tabs-tab-nav-item"
        >
          队友
        </div>
      </div>
      <Contact contactIndex={contactIndex} />
    </div>
  );
};
export default HomeTab;
