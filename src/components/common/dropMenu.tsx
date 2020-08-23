import React, { useEffect } from 'react';
import "./dropMenu.css"
interface dropMenuProp {
    children: any,
    visible: boolean,
    dropStyle: any,
    onClose: any
}

const DropMenu: React.FC<dropMenuProp> = (prop) => {
    const { children, visible, dropStyle,onClose } = prop
    return (<React.Fragment>
        {visible ? <div className="dropMenu-info" style={dropStyle} onMouseLeave={onClose}>
            <React.Fragment>{children}</React.Fragment>
        </div> : null}
    </React.Fragment>)
};
DropMenu.defaultProps = {
    children: null,
    visible: false,
    dropStyle: null,
    onClose: null
};
export default DropMenu;
