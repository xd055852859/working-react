import React, { useState, useEffect } from 'react';
import './avatar.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';

interface AvatarProps {
  name: string;
}
const BgColorArray = [
  'rgba(48,191,191)',
  'rgba(0,170,255)',
  'rgba(143,126,230)',
  'rgba(179,152,152)',
  'rgba(242,237,166)',
];
const Avatar: React.FC<AvatarProps> = (props) => {
  const { name } = props;
  const dispatch = useDispatch();
  const [] = useState<number[]>([]);
  return (
    <div
      className="avatar-img"
      style={{ backgroundColor: BgColorArray[Math.floor(Math.random() * 5)] }}
    >
      {name ? name.substring(0, 1) : ''}
    </div>
  );
};
Avatar.defaultProps = {};
export default Avatar;
