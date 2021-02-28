import React, { FC, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import { useState } from 'react';
interface Props{
  canvas:any
}

const SketchExampleHook:FC<Props> = ({canvas}) => {

  useEffect(() => {
   console.log('canvas改变了',canvas);
  }, [canvas])

  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const [color, setColor] = useState('');

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (color: any) => {
    console.log('颜色改变');
    let rgbcolor=  `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`;
    console.log(rgbcolor);
    
    setColor(rgbcolor);
  };

  return (
    <div>
      <div style={{
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        }} onClick={handleClick}>
        <div style={{
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: `${color}`,
        }}/>
      </div>
      {displayColorPicker ? (
        <div>
          <div
            style={{ position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px' }}
            onClick={handleClose}
          />
                //@ts-ignore 
          <SketchPicker color={color} onChange={handleChange} />
        </div>
      ) : null}
    </div>
  );
};

export default SketchExampleHook;
