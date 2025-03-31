import React from "react";
import ReactDOM from "react-dom";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg relative animate-fadeIn">
        <button
          className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-gray-800 focus:outline-none"
          onClick={onClose}
        >
          ×
        </button>
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
