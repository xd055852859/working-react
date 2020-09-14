import React from "react";
import './loading.css'

interface LoadingProps {
}
const Loading: React.FC<LoadingProps> = (prop) => {
  return (
    <div className="loading-content">
    <div className="loading">
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  </div>
  );
}
export default Loading;
