import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function VideoModal({ show, url, onClose }) {
  if (!show) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.9)", zIndex: 5000 }}
    >
      <button
        className="btn btn-danger position-absolute top-0 start-0 m-3"
        onClick={onClose}
      >
        <FontAwesomeIcon icon={faTimes} /> Đóng
      </button>

      <video
        src={url}
        controls
        autoPlay
        className="w-100"
        style={{ maxWidth: "900px" }}
      ></video>
    </div>
  );
}
