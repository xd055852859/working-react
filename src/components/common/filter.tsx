import React from 'react';
import './filter.css';
import DropMenu from './dropMenu';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import defaultPersonPng from '../../assets/img/defaultPerson.png';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
import downArrowbPng from '../../assets/img/downArrowb.png';
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

  return (
    <div className="filter" style={filterStyle}>
      <div className="filter-title">{title + ' :'}</div>
      <div
        className="filter-menu"
        // onMouseEnter={onOpen}
        // onMouseLeave={onClose}
        onClick={onOpen}
      >
        {filterArray.length > 0 ? (
          <div className="filter-menu-info">
            <Avatar
              alt={filterArray[filterIndex][filterItem[1]]}
              src={
                filterArray[filterIndex][filterItem[1]]
                  ? filterIndex !== 0 &&
                    filterArray[filterIndex][filterItem[1]].indexOf('data:') ===
                      -1
                    ? filterArray[filterIndex][filterItem[1]] +
                      '?imageMogr2/auto-orient/thumbnail/80x'
                    : filterArray[filterIndex][filterItem[1]]
                  : defaultPngType === 0
                  ? defaultPersonPng
                  : defaultGroupPng
              }
              className={classes.avatar}
            />
            <div className="filter-menu-name">
              {filterArray[filterIndex][filterItem[0]]}
            </div>
            <img className="filter-menu-icon" src={downArrowbPng} alt="" />
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
                onClick={(e) => {
                  onClick(filterType, item, index);
                  onClose();
                  e.stopPropagation();
                }}
              >
                <Avatar
                  alt={item[filterItem[0]]}
                  src={
                    item[filterItem[1]]
                      ? filterIndex !== 0 &&
                        item[filterItem[1]].indexOf('data:') === -1
                        ? item[filterItem[1]] +
                          '?imageMogr2/auto-orient/thumbnail/80x'
                        : item[filterItem[1]]
                      : defaultPngType === 0
                      ? defaultPersonPng
                      : defaultGroupPng
                  }
                  className={classes.avatar}
                />
                <div className="filter-menu-name">{item[filterItem[0]]}</div>
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
