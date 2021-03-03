import React, { useState, useEffect } from 'react';
import './company.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';

interface CompanyProps {}

const Company: React.FC<CompanyProps> = (props) => {
  const {} = props;
  const dispatch = useDispatch();
  const [] = useState<number[]>([]);
  return <div className="company">企业首页开发中。。。</div>;
};
Company.defaultProps = {};
export default Company;
