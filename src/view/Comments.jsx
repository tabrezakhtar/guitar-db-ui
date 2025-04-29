import { useState } from "react";
import { formatDate, getTimeFromNow } from "../dateUtils";
import CommentForm from "./CommentForm";

const Comments = ({ comments: initialComments, equipmentId }) => {
  const [expandedComments, setExpandedComments] = useState(false);
  
  if (!initialComments || initialComments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-xl font-semibold mb-4">Comments</h3>
        <CommentForm equipmentId={equipmentId} />
        <p className="text-gray-500 text-center my-6">No comments yet. Be the first to comment!</p>
      </div>
    );
  }
  
  const displayedComments = expandedComments ? initialComments : initialComments.slice(0, 5);
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>
      
      <CommentForm equipmentId={equipmentId} />
      
      <div className="space-y-4 mt-6">
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
      
      {initialComments.length > 5 && (
        <button 
          className="mt-3 text-blue-500 hover:text-blue-700 text-sm"
          onClick={() => setExpandedComments(!expandedComments)}
        >
          {expandedComments ? "Show Less" : `Show All (${initialComments.length}) Comments`} 
        </button>
      )}
    </div>
  );
};

export default Comments;