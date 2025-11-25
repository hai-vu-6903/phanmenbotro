import React, { useState, useEffect } from "react";
import AudioControls from "./AudioControls";
import VideoModal from "./VideoModal";
import SongInfoModal from "./SongInfoModal";
import { FaArrowLeft, FaVideo, FaPlay, FaPause, FaFilePdf, FaInfoCircle } from "react-icons/fa";
import "./PlayerScreen.css";

// Background images from public directory
const bg1 = '/img/bg/dsc2887-1756784423619427993371.jpg';
const bg2 = '/img/bg/img0631-17567967413481704453104.jpg';
const bg3 = '/img/bg/img0634-1756796778565698413943.jpg';
const bg4 = '/img/bg/img0638-17567968630631441447953.jpg';
const bg5 = '/img/bg/img0633-17567968335831640903623.jpg';
const bg6 = '/img/bg/img0641-17567968937181022945454.jpg';
const bg7 = '/img/bg/img0691-17567975101461917352448.jpg';
const bg8 = '/img/bg/jum00459-1756786775947316074236.jpg';
const bg9 = '/img/bg/jum09944-1756782479875412640196.jpg';
const bg10 = '/img/bg/khi-sy-quan-hai-quan-1756773198563986810632.jpg';
const bg11 = '/img/bg/photo-library-20250902124904-9024ff81-7b2c-48c2-8359-c9cfe3999053-atx-8457.jpg';

const allBackgrounds = [bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10, bg11];

// Function to get a random background image
const getRandomBg = () => {
  const randomIndex = Math.floor(Math.random() * allBackgrounds.length);
  return allBackgrounds[randomIndex];
};

export default function PlayerScreen({ mode, list, onBack, player }) {
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedPdf, setSelectedPdf] = useState("");
  const [selectedSongIndex, setSelectedSongIndex] = useState(-1);
  const [showSongInfo, setShowSongInfo] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  function handleSongClick(song, index, e) {
    // Only stop propagation if clicking on the song item, not on player controls
    if (e.target.closest('.inline-player, .audio-controls') === null) {
      // Toggle selection if clicking the same song
      const newIndex = selectedSongIndex === index ? -1 : index;
      setSelectedSongIndex(newIndex);
      
      // Always play the song when clicking on the song item
      playSong(song);
      
      // If in baiHat mode and the song has a PDF, show it
      if (mode === 'baiHat' && song.lyricsPdf) {
        setSelectedPdf(song.lyricsPdf);
      }
    }
  }

  function playSong(song) {
    // If this song is already playing, just toggle pause/play
    const currentSrc = player.voiceSrc || '';
    if (currentSrc === song.fileVoice || currentSrc === song.file) {
      if (player.isPlaying) {
        player.pause();
      } else {
        player.play();
      }
      return;
    }

    if (mode === "baiHat") {
      player.playDual(song.fileVoice, song.fileInst);
    } else if (mode === "dieuVu" && song.video) {
      // For dance items: clicking the title should play audio when available.
      if (song.file) {
        // play only the audio (no modal)
        player.playVoice(song.file);
      } else if (song.videoOnly) {
        // video-only item: show video
        setVideoUrl(song.video);
        setShowVideo(true);
        player.playVideoOnly(song.video);
      } else {
        // fallback: if no audio file, show video
        setVideoUrl(song.video);
        setShowVideo(true);
        player.playVideoOnly(song.video);
      }
    } else {
      player.playVoice(song.file);
    }
  }

  function getCurrentIndex() {
    const src = player.voiceSrc || "";
    if (!src) return -1;
    for (let i = 0; i < list.length; i++) {
      const s = list[i];
      if (mode === "baiHat") {
        if (s.fileVoice === src) return i;
      } else {
        if (s.file === src) return i;
      }
    }
    return -1;
  }

  function playIndex(i) {
    if (i < 0 || i >= list.length) return;
    playSong(list[i]);
  }

  function onPrev() {
    const idx = getCurrentIndex();
    if (idx === -1) return playIndex(0);
    const prev = idx - 1 >= 0 ? idx - 1 : list.length - 1;
    playIndex(prev);
  }

  function onNext() {
    const idx = getCurrentIndex();
    if (idx === -1) return playIndex(0);
    const next = idx + 1 < list.length ? idx + 1 : 0;
    playIndex(next);
  }

  function onPauseToggle() {
    if (player.isPlaying) player.pause();
    else player.play();
  }

  const currentIndex = getCurrentIndex();
  
  // Update selectedSongIndex and PDF when currentIndex changes (e.g., when using prev/next controls)
  useEffect(() => {
    if (currentIndex >= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedSongIndex(currentIndex);
      // Update PDF when changing songs with prev/next buttons
      const currentSong = list[currentIndex];
      if (mode === 'baiHat' && currentSong?.lyricsPdf) {
        setSelectedPdf(currentSong.lyricsPdf);
      }
    } else {
      setSelectedSongIndex(-1);
      setSelectedPdf('');
    }
  }, [currentIndex, list, mode]);
  
  // Map mode to proper Vietnamese title
  const getModeTitle = () => {
    switch(mode) {
      case 'nghiLe': return 'NHẠC NGHI LỄ';
      case 'baiHat': return 'BÀI HÁT QUY ĐỊNH';
      case 'dieuVu': return '05 ĐIỆU VŨ';
      case 'quiz': return 'CÂU HỎI TRẮC NGHIỆM';
      case 'vrMuseum': return 'BẢO TÀNG QUÂN SỰ';
      default: return mode.toUpperCase();
    }
  };

  // Store the current background in state
  const [currentBg, setCurrentBg] = useState(() => getRandomBg());

  // Update background only when mode changes
  useEffect(() => {
    const updateBackground = () => {
      setCurrentBg(getRandomBg());
    };
    updateBackground();
    
    // Cleanup function to prevent memory leaks
    return () => {
      // Any cleanup if needed
    };
  }, [mode]);

  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${currentBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    width: '100%',
    position: 'relative',
  };

  return (
    <div className="player-screen" style={backgroundStyle}>
      <div className="header-container">
        <div className="header">
          <button className="back-button" onClick={onBack}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="header-content">
            <h2>{getModeTitle()}</h2>
            <div className="song-count">{list.length} {list.length === 1 ? 'bài' : 'bài'}</div>
          </div>
        </div>
      </div>

      <div className="content-wrapper">
        <div className={`songs-container ${selectedPdf ? 'with-pdf' : ''}`}>
          <div className="songs-scroll-container">
            <div className="songs-list">
              {list.map((song, index) => {
                // const isPlaying = index === currentIndex;
                return (
                  <div 
                    key={song.id} 
                    className={`song-item ${currentIndex === index ? 'active' : ''} ${selectedSongIndex === index ? 'selected' : ''}`}
                    onClick={(e) => handleSongClick(song, index, e)}
                  >
                    <div className="song-item-content">
                      <div className="song-number">{index + 1}</div>
                      <div className="song-info">
                        <div className="song-title">
                          {song.title}
                          <div className="song-title-actions">
                            {mode === 'baiHat' && (
                              <>
                                {song.lyricsPdf && (
                                  <span className="pdf-indicator" title="Xem lời bài hát">
                                    <FaFilePdf className="pdf-icon" />
                                  </span>
                                )}
                                <button 
                                  className="info-button"
                                  title="Thông tin bài hát"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSong(song);
                                    setShowSongInfo(true);
                                  }}
                                >
                                  <FaInfoCircle />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        {song.artist && <div className="song-artist">{song.artist}</div>}
                      </div>
                      <div className="song-actions">
                        {mode === 'dieuVu' && song.video && (
                          <div className="action-buttons">
                            <button
                              className="video-button"
                              title="Xem video"
                              onClick={(e) => {
                                e.stopPropagation();
                                player.stop();
                                setVideoUrl(song.video);
                                setShowVideo(true);
                              }}
                            >
                              Xem
                            </button>
                            {song.lyricsPdf && (
                              <span className="pdf-indicator" title="Xem lời bài hát">
                                <FaFilePdf className="pdf-icon" />
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      {song.artist && <div className="song-artist">{song.artist}</div>}
                    </div>
                    
                    {selectedSongIndex === index && (
                      <div className="inline-player" onClick={(e) => e.stopPropagation()}>
                        <AudioControls
                          player={player}
                          onPrev={onPrev}
                          onNext={onNext}
                          onPauseToggle={onPauseToggle}
                          currentTitle={song.title}
                          currentTrack={song}
                          isInline={true}
                        />
                      </div>
                    )}
                  </div>
              );
            })}
            </div>
          </div>
          
          {selectedPdf && (
            <div className="pdf-viewer-container">
              <div className="pdf-embed-container">
                <iframe 
                  src={`${selectedPdf}#view=FitH`}
                  title="PDF Viewer"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Removed main player controls as per request */}

      <VideoModal 
        show={showVideo}
        url={videoUrl} 
        onClose={() => setShowVideo(false)} 
      />
      
      {showSongInfo && (
        <SongInfoModal 
          song={selectedSong} 
          onClose={() => setShowSongInfo(false)} 
        />
      )}
    </div>
  );
}
