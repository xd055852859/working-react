import React, { useEffect } from 'react';
import './filter.css'
import DropMenu from './dropMenu';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import defaultPersonPng from '../../assets/img/defaultPerson.png'
import defaultGroupPng from '../../assets/img/defaultGroup.png'
interface FilterProps {
    visible: boolean,
    title?: any,
    filterArray: any,
    filterStyle?: object
    filterItemStyle?: object,
    onClose?: any,
    onOpen?: any,
    filterItem: any,
    defaultPngType?: number
}
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        avatar: {
            width: '14px',
            height: '14px',
            marginRight: '5px',
        },
    })
)
const Filter: React.FC<FilterProps> = (prop) => {
    const { title, visible, filterArray, filterStyle, filterItemStyle, onClose, onOpen, filterItem,defaultPngType } = prop
    const classes = useStyles();
    return (
        <div className="filter-item" style={filterStyle}>
            <div>{title}</div>
            <div style={{ position: 'relative' }}>
                <div onClick={onOpen} className="filter-item-title">无选择{title}</div>
                <DropMenu visible={visible} dropStyle={filterItemStyle} onClose={onClose}>
                    {filterArray.map((item: any, index: number) => {
                        return (
                            <div className="filter-item-info" key={title + index}>
                                <Avatar
                                    alt={item[filterItem[0]]}
                                    src={
                                        item[filterItem[1]] +
                                            '?imageMogr2/auto-orient/thumbnail/30x30/format/jpg' ? item[filterItem[1]] +
                                            '?imageMogr2/auto-orient/thumbnail/30x30/format/jpg' : defaultPngType == 0 ? defaultPersonPng : defaultGroupPng
                                    }
                                    className={classes.avatar}
                                />
                                <div>{item[filterItem[0]]}</div>
                            </div>
                        )
                    })}
                </DropMenu>
            </div>
        </div>)
};
Filter.defaultProps = {
    visible: false,
    title: '',
    filterArray: [],
    filterStyle: {},
    filterItemStyle: {},
    onClose: undefined,
    onOpen: undefined,
    filterItem: {},
    defaultPngType: 0
}
export default Filter;
