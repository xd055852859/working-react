import React from 'react';

export interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
  className?: string;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, className, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other} className={className}>
      {value === index && <div>{children}</div>}
    </div>
  );
};
export default TabPanel;
