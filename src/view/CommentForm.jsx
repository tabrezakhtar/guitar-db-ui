import { useState } from "react";
import { useGuitarContext } from "../context/GuitarContext";
import { useUserContext } from "../context/UserContext";

const CommentForm = ({ equipmentId }) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addComment } = useGuitarContext();
  const { user } = useUserContext();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await addComment(user.username, equipmentId, comment);
      setComment("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex flex-col">
        <textarea
          className="w-full p-2 border rounded-lg mb-2 focus:border-blue-500 focus:outline-none"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add your comment..."
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="self-end bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={isSubmitting || !comment.trim()}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Posting...
            </span>
          ) : "Post Comment"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;