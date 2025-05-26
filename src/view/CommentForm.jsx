import { useState, useContext } from "react";
import { GuitarContext } from "../context/GuitarContext";
import { UserContext } from "../context/UserContext";
import Spinner from "../components/Spinner";

const CommentForm = ({ equipmentId }) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addComment } = useContext(GuitarContext);
  const { user } = useContext(UserContext); 

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
              <Spinner width={4} height={4} />
              Posting...
            </span>
          ) : "Post Comment"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;