import React, { useEffect } from 'react';
import './filter.css';
import DropMenu from './dropMenu';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import defaultPersonPng from '../../assets/img/defaultPerson.png';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
interface FilterProps {
  visible: boolean;
  title?: any;
  filterArray: any;
  filterStyle?: object;
  filterType: string;
  filterItemStyle?: object;
  filterIndex?: any;
  onClose?: any;
  onOpen?: any;
  onClick?: any;
  filterItem: any;
  defaultPngType?: number;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      width: '26px',
      height: '26px',
      marginRight: '5px',
    },
  })
);
const Filter: React.FC<FilterProps> = (prop) => {
  const {
    title,
    visible,
    filterArray,
    filterStyle,
    filterType,
    filterItemStyle,
    filterIndex,
    onClose,
    onOpen,
    filterItem,
    defaultPngType,
    onClick,
  } = prop;
  const classes = useStyles();
  console.log("filterArray",filterArray)
  return (
    <div className="filter" style={filterStyle}>
      <div className="filter-title">{title}</div>
      <div className="filter-menu" onClick={onOpen}>
        {filterArray.length > 0 ? (
          <div className="filter-menu-info">
            <Avatar
              alt={filterArray[filterIndex][filterItem[1]]}
              src={
                filterArray[filterIndex][filterItem[1]] +
                '?imageMogr2/auto-orient/thumbnail/30x30/format/jpg'
                  ? filterArray[filterIndex][filterItem[1]] +
                    '?imageMogr2/auto-orient/thumbnail/30x30/format/jpg'
                  : defaultPngType === 0
                  ? defaultPersonPng
                  : defaultGroupPng
              }
              className={classes.avatar}
            />
            <div>{filterArray[filterIndex][filterItem[0]]}</div>
          </div>
        ) : null}
        <DropMenu
          visible={visible}
          dropStyle={filterItemStyle}
          onClose={onClose}
        >
          {filterArray.map((item: any, index: number) => {
            return (
              <div
                className="filter-menu-info"
                key={title + index}
                onClick={() => {
                  onClick(filterType, item, index);
                }}
              >
                <Avatar
                  alt={item[filterItem[0]]}
                  src={
                    item[filterItem[1]] +
                    '?imageMogr2/auto-orient/thumbnail/30x30/format/jpg'
                      ? item[filterItem[1]] +
                        '?imageMogr2/auto-orient/thumbnail/30x30/format/jpg'
                      : defaultPngType === 0
                      ? defaultPersonPng
                      : defaultGroupPng
                  }
                  className={classes.avatar}
                />
                <div>{item[filterItem[0]]}</div>
              </div>
            );
          })}
        </DropMenu>
      </div>
    </div>
  );
};
Filter.defaultProps = {
  visible: false,
  title: '',
  filterArray: [],
  filterStyle: {},
  filterType: '',
  filterItemStyle: {},
  onClose: undefined,
  onOpen: undefined,
  onClick: undefined,
  filterItem: {},
  defaultPngType: 0,
  filterIndex: 0,
};
export default Filter;
