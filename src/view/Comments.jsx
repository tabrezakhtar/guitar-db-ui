import { useState } from "react";
import { formatDate, getTimeFromNow } from "../dateUtils";

const Comments = ({ comments }) => {
  const [expandedComments, setExpandedComments] = useState(false);
  
  if (!comments || comments.length === 0) {
    return null;
  }

  const displayedComments = expandedComments ? comments : comments.slice(0, 5);
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>
      
      <div className="space-y-4">
        {displayedComments.map((comment) => (
          <div key={comment._id} className="border-b pb-3 last:border-b-0 last:pb-0">
            <p className="text-gray-800">{comment.text}</p>
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>User {comment.userId.substr(-4)}</span>
              <span title={formatDate(comment.date)}>{getTimeFromNow(comment.date)}</span>
            </div>
          </div>
        ))}
      </div>
      
      {comments.length > 5 && (
        <button 
          className="mt-3 text-blue-500 hover:text-blue-700 text-sm"
          onClick={() => setExpandedComments(!expandedComments)}
        >
          {expandedComments ? "Show Less" : `Show All (${comments.length}) Comments`} 
        </button>
      )}
    </div>
  );
};

export default Comments;