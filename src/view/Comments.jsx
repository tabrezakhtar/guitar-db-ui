import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { formatDate, getTimeFromNow } from "../utils/dateUtils";
import CommentForm from "./CommentForm";
import AvatarDisplayOnly from "../profile/AvatarDisplayOnly";
import { GuitarContext } from "../context/GuitarContext";
import { UserContext } from "../context/UserContext";

const Comments = ({ equipmentId }) => {
  const [expandedComments, setExpandedComments] = useState(false);
  const { currentEquipment, deleteComment } = useContext(GuitarContext);
  const { user } = useContext(UserContext);
  
  const comments = currentEquipment?.comments || [];
  
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  
  if (!comments || comments.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">Comments</h3>
        <CommentForm equipmentId={equipmentId} />
        <p className="text-gray-500 dark:text-gray-400 text-center my-6">No comments yet. Be the first to comment!</p>
      </div>
    );
  }
  
  const displayedComments = expandedComments ? comments : comments.slice(0, 5);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">Comments</h3>
      
      <CommentForm equipmentId={equipmentId} />
      
      <div className="space-y-4 mt-6">
        {displayedComments.map((comment, index) => (
          <div key={comment._id || `comment-${index}`} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm">
            <div className="flex">
              <div className="mr-3 self-center">
                <AvatarDisplayOnly imageUrl={comment.user?.avatarUrl} username={comment.user?.username} size="xsmall" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-1">
                    <NavLink 
                      to={`/profile/${comment.user?._id}`}
                      className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {comment.user?.username?.substring(0, 32)}
                    </NavLink>
                    {comment.user?.admin && (
                      <img 
                        src="/verified.svg" 
                        alt="Verified" 
                        className="w-4 h-4"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400" title={formatDate(comment.date)}>{getTimeFromNow(comment.date)}</span>
                    {user && user._id === comment.user?._id && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white text-xs px-2 py-1 rounded transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{comment.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {comments.length > 5 && (
        <button 
          className="mt-3 text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
          onClick={() => setExpandedComments(!expandedComments)}
        >
          {expandedComments ? "Show Less" : `Show All (${comments.length}) Comments`} 
        </button>
      )}
    </div>
  );
};

export default Comments;