const Modal = ({ 
  message, 
  children, 
  onConfirm, 
  onCancel, 
  showConfirm = true, 
  showCancel = true,
  cancelText = "Cancel",
  allowBackgroundClose = true 
}) => {
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget && allowBackgroundClose && onCancel) {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 cursor-auto"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-md">
        <div className="mb-4 text-gray-900 dark:text-white">
          {children || message}
        </div>
        {(showConfirm || showCancel) && (
          <div className="flex justify-end space-x-2">
            {showCancel && onCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
              >
                {cancelText}
              </button>
            )}
            {showConfirm && onConfirm && (
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Confirm
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;