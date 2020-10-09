import React, { useEffect } from 'react';
import moment from 'moment';
import './comment.css';
interface CommentProps {
  commentItem: any;
  commentClick:any;
  commentIndex:number
}

const Comment: React.FC<CommentProps> = (prop) => {
  const { commentItem,commentClick,commentIndex} = prop;

  const time = moment(commentItem.createTime).format('MM-DD hh:mm');
  return (
    <div className="commentItem">
      <div className="commentItem-avatar">
        <div className="commentItem-avatar-img">
          <img src={commentItem.etc.avatar} alt="" />
        </div>
      </div>
      <div className="commentItem-content">
        <div className="commentItem-content-title">
          <div className="commentItem-content-name">{commentItem.etc.name}</div>
          <div className="commentItem-content-time">{time}</div>
        </div>
        <div className="commentItem-content-info">{commentItem.content}</div>
      </div>
      <div className="commentItem-content-button" onClick={()=>{commentClick(commentIndex,commentItem._key)}}>删除</div>
    </div>
  );
};
export default Comment;
