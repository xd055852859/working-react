/* eslint-disable jsx-a11y/anchor-is-valid */
import { makeStyles, createStyles, Tabs, Tab } from '@material-ui/core';
import React, { FC } from 'react';
import Panel from '../Panel';
import TabPanel from '../TabPanel';
import { Tools, IconList } from '../config/config';

interface LeftMenuProps {
  moreTool: string[];
  onDrag: (ev: any, item: any) => void;
  onDragFont: (ev: any, item: any) => void;
  changeFontIcon: (ev: any, item: any) => void;
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      minWidth: '80px',
    },
    border: {
      borderBottom: '1px solid #d9d9d9',
    },
    iconbtn: {
      '& .topology': {
        fontSize: 28,
      },
      '& .topology:hover': {
        color: 'blue',
      },
    },
  })
);

const LeftMenu: FC<LeftMenuProps> = React.memo(
  ({ moreTool, onDrag, onDragFont, changeFontIcon }) => {
    const [value, setValue] = React.useState(0);
    const classes = useStyles();
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
      setValue(newValue);
    };

    return (
      <div className="tool">
        <Tabs
          className={classes.border}
          variant="scrollable"
          scrollButtons="auto"
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
        >
          <Tab className={classes.root} label="组件库" value={0} />
          <Tab className={classes.root} label="图标库" value={1} />
        </Tabs>
        <TabPanel value={value} index={0}>
          {Tools.filter((item: any) => moreTool.includes(item.id)).map(
            (item, index) => (
              <Panel key={index} title={item.group}>
                <div className="button">
                  {
                    //@ts-ignore
                    item.children.map((item: any, idx: any) => (
                      <a
                        key={idx}
                        title={item.name}
                        draggable
                        onDragStart={(ev) => onDrag(ev, item)}
                      >
                        <i
                          className={'iconfont ' + item.icon}
                          style={{ fontSize: 13 }}
                        ></i>
                      </a>
                    ))
                  }
                </div>
              </Panel>
            )
          )}

          {/* {imgTool.map((item, index) => (
            <Panel key={index} title={item.group}>
              <div className="button">
                {item.children.map((item: any, idx: any) => (
                  <a
                    key={idx}
                    title={item.name}
                    draggable
                    onDragStart={(ev) => onDrag(ev, item)}
                  >
                    <img
                      src={item.url}
                      alt={item.name}
                      className="tool-img-box"
                    />
                  </a>
                ))}
              </div>
            </Panel>
          ))} */}
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {IconList.map((item, index) => (
              <div
                className={`${classes.iconbtn} button`}
                key={index}
                onClick={(e) => changeFontIcon(e, item)}
              >
                <a draggable onDragStart={(ev) => onDragFont(ev, item)}>
                  <i className={`topology  ${item.class}`}></i>
                </a>
              </div>
            ))}
          </div>
        </TabPanel>
      </div>
    );
  }
);

export default LeftMenu;
