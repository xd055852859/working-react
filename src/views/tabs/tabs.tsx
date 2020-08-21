import React, { FC } from 'react';
import Contact from '../contact/contact';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
// import { Theme, makeStyles } from '@material-ui/core/styles';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0px',
    },
  })
);
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  const classes = useStyles();
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3} className={classes.root}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// const useStyles = makeStyles((theme: Theme) => ({
//   root: {
//     flexGrow: 1,
//     backgroundColor: theme.palette.background.paper,
//   },
// }));
export interface HomeTabProps {}
const HomeTab: React.FC<HomeTabProps> = (props) => {
  // const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  return (
    <div>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="simple tabs example"
      >
        <Tab label="项目" {...a11yProps(0)} />
        <Tab label="队友" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Contact contactIndex={value} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Contact contactIndex={value} />
      </TabPanel>
    </div>
  );
};
export default HomeTab;
