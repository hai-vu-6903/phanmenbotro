import React from "react";
import { FaTimes } from "react-icons/fa";
import "./SongInfoModal.css";

const SongInfoModal = ({ song, onClose }) => {
  if (!song) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        <h2>{song.title}</h2>

        {song.author && (
          <div className="info-section">
            <h3>Tác giả:</h3>
            <div className="author-info">
              {song.authorImage && (
                <div className="author-image">
                  <img 
                    src={song.authorImage} 
                    alt={song.author} 
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="author-details">
                <p>{song.author}</p>
                {song.authorBirthYear && song.authorDeathYear && (
                  <p className="author-lifespan">
                    ({song.authorBirthYear} -{" "}
                    {song.authorDeathYear === "null" ? "Nay" : song.authorDeathYear}
                    )
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {song.songYear && (
          <div className="info-section">
            <h3>Năm sáng tác:</h3>
            <p>{song.songYear}</p>
          </div>
        )}

        {song.description && (
          <div className="info-section">
            <h3>Giới thiệu:</h3>
            {song.description.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        )}

        {song.authorInfo && (
          <div className="info-section">
            <h3>Về tác giả:</h3>
            {song.authorInfo.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SongInfoModal;
