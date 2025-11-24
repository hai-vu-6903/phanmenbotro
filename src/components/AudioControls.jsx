import React, { useRef } from "react";
import ReactPlayer from "react-player";

export default function AudioControls({ player, onPrev, onNext, onPauseToggle, currentTitle, currentTrack, isInline = false }) {
  const {
    isPlaying,
    pause,
    play,
    time,
    duration,
    seek,
    volume,
    changeVolume,
    voiceRef,
    instRef,
    voiceSrc,
    instSrc,
    vocalMuted,
    videoOnly,
    // stop is available on player but not used here (kept for external usage)
  } = player;

  const prevVolRef = useRef(1);

  function togglePlay() {
    if (!voiceSrc) return;
    if (isPlaying) pause();
    else play();
  }

  function onSeek(e) {
    const val = Number(e.target.value || 0);
    seek(val);
  }

  function onVolume(e) {
    const v = Number(e.target.value);
    changeVolume(v);
    if (v > 0) prevVolRef.current = v;
  }

  const isVideo = !!voiceSrc && voiceSrc.toLowerCase().includes(".mp4");

  return (
    <div className={`${isInline ? 'p-2' : 'p-3'} bg-secondary bg-opacity-50 text-white ${!isInline ? 'border-top' : 'rounded'}`}>
      {/* Hidden/managed players (kept mounted off-screen so audio can autoplay/play) */}
      <div style={{ position: "absolute", left: -9999, top: -9999, width: 1, height: 1, overflow: "hidden" }} aria-hidden>
        <ReactPlayer
          ref={voiceRef}
          url={voiceSrc}
          playing={isPlaying}
          volume={volume * (player.vocalMuted ? 0 : 1)}
          onProgress={(state) => player.handleProgress(state)}
          onDuration={(d) => player.handleDuration(d)}
          config={{ file: { attributes: { preload: 'auto' } } }}
        />
        {instSrc && (
          <ReactPlayer
            ref={instRef}
            url={instSrc}
            playing={isPlaying}
            volume={volume * (player.instMuted ? 0 : 1)}
            config={{ file: { attributes: { preload: 'auto' } } }}
          />
        )}
      </div>

      {isVideo && (
        <div className="mb-2">
          <ReactPlayer url={voiceSrc} playing={isPlaying} controls width="100%" muted={player.videoExternalAudio} />
        </div>
      )}

      {/* Current track title above the time bar - only show if not inline */}
      {!isInline && (
        <div className="mb-2 text-truncate" style={{ maxWidth: '100%' }} title={currentTitle}>
          <strong className="text-warning">{currentTitle || ""}</strong>
        </div>
      )}

      {/* Vocal / Instrumental iPhone-style toggle (only when track has both) */}
      {currentTrack && currentTrack.fileVoice && currentTrack.fileInst && (
        <div className="mb-2 d-flex align-items-center" style={{ gap: 12 }}>
          <div style={{ fontSize: 12, color: !vocalMuted ? '#34C759' : '#6c757d', minWidth: 60, textAlign: 'left', fontWeight: !vocalMuted ? 700 : 400 }}>Có lời</div>

          <div
            role="switch"
            aria-checked={!vocalMuted}
            onClick={() => {
              const cur = player.time || 0;
              const newIsVocal = !!vocalMuted; // flipping: if currently muted vocal -> turning vocal on
              if (!(player.voiceSrc && player.instSrc)) {
                player.playDual(currentTrack.fileVoice, currentTrack.fileInst);
              }
              if (newIsVocal) {
                player.setVocalMuted(false);
                player.setInstMuted(true);
              } else {
                player.setVocalMuted(true);
                player.setInstMuted(false);
              }
              // sync both to current time
              player.seek(cur);
            }}
            style={{
              width: 60,
              height: 34,
              borderRadius: 34,
              padding: 4,
              cursor: 'pointer',
              background: !vocalMuted ? '#34C759' : '#d1d1d6',
              position: 'relative',
              transition: 'background 160ms ease',
              boxSizing: 'border-box'
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: '#fff',
                position: 'absolute',
                top: 4,
                left: !vocalMuted ? 30 : 4,
                boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                transition: 'left 160ms ease'
              }}
            />
          </div>

          <div style={{ fontSize: 12, color: vocalMuted ? '#34C759' : '#6c757d', minWidth: 80, textAlign: 'right', fontWeight: vocalMuted ? 700 : 400 }}>Không lời</div>
        </div>
      )}

      {!videoOnly && (
        <>
          {/* Time bar */}
          <div className="d-flex align-items-center mb-2" style={{ gap: 8 }}>
            <div className="text-muted" style={{ fontSize: 14, minWidth: 40, textAlign: 'left', fontWeight: 'bold' }}>
              {format(time)}
            </div>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={time || 0}
              onChange={onSeek}
              className="flex-grow-1"
              style={{ height: 4, cursor: 'pointer' }}
              aria-label="Seek"
            />
            {!isInline && (
              <div className="text-muted" style={{ fontSize: 14, minWidth: 40, textAlign: 'right', fontWeight: 'bold' }}>
                {format(duration)}
              </div>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="d-flex align-items-center w-50">
              <button className="btn btn-light me-2" onClick={() => {
                // toggle mute
                if (volume > 0) {
                  prevVolRef.current = volume;
                  changeVolume(0);
                } else {
                  changeVolume(prevVolRef.current || 1);
                }
              }} title={volume > 0 ? 'Mute' : 'Unmute'}>
                {volume === 0 ? (
                  <i className="fas fa-volume-mute" />
                ) : volume <= 0.5 ? (
                  <i className="fas fa-volume-down" />
                ) : (
                  <i className="fas fa-volume-up" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={onVolume}
                className="form-range"
                style={{ flex: 1 }}
              />
            </div>

            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center">
                {/* title moved above time bar */}
                <div className="btn-group" role="group" aria-label="player controls">
                  <button className="btn btn-secondary" onClick={onPrev} title="Previous">
                    <i className="fas fa-step-backward" />
                  </button>

                  <button className="btn btn-warning btn-lg px-4" onClick={() => {
                    // if a custom toggle handler provided by PlayerScreen, call it so state syncs
                    if (typeof onPauseToggle === 'function') onPauseToggle();
                    else togglePlay();
                  }} title={isPlaying ? 'Pause' : 'Play'}>
                    {isPlaying ? <i className="fas fa-pause fa-lg" /> : <i className="fas fa-play fa-lg" />}
                  </button>

                  <button className="btn btn-secondary" onClick={onNext} title="Next">
                    <i className="fas fa-step-forward" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function format(sec) {
  if (!sec && sec !== 0) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
}
