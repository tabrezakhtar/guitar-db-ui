import { useState, useContext } from "react";
import { GuitarContext } from "../context/GuitarContext";
import { UserContext } from "../context/UserContext";
import Spinner from "../components/Spinner";

const CommentForm = ({ equipmentId }) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addComment } = useContext(GuitarContext);
  const { user, isGuest } = useContext(UserContext) || {}; 

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
          className="w-full p-2 border border-[var(--color-skeleton-line)] dark:border-[var(--color-skeleton-line-dark)] rounded-lg mb-2 focus:border-blue-400 focus:outline-none bg-[var(--color-card-bg)] dark:bg-[var(--color-card-dark)] text-[var(--color-text)] dark:text-[var(--color-text-dark)] placeholder-gray-400"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={isGuest ? "Sign up to leave comments..." : "Add your comment..."}
          disabled={isSubmitting || isGuest}
        />
        <button
          type="submit"
          className="w-full sm:w-auto sm:self-end bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
          disabled={isSubmitting || !comment.trim() || isGuest}
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