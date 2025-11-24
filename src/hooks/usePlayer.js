import { useRef, useState, useEffect } from "react";

export default function usePlayer() {
  const voiceRef = useRef(null);
  const instRef = useRef(null);

  const [voiceSrc, setVoiceSrc] = useState("");
  const [instSrc, setInstSrc] = useState("");

  const [isPlaying, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const htmlAudioRef = useRef(null);
  const htmlInstAudioRef = useRef(null);
  const [vocalMuted, setVocalMutedState] = useState(false);
  const [instMuted, setInstMutedState] = useState(false);
  const [videoOnly, setVideoOnly] = useState(false);
  const [videoExternalAudio, setVideoExternalAudio] = useState(false);

  // Poll current time and duration from react-player ref
  useEffect(() => {
    let t;
    function update() {
      const v = voiceRef.current;
      if (v && typeof v.getCurrentTime === "function") {
        try {
          const cur = v.getCurrentTime();
          const dur = v.getDuration ? v.getDuration() : duration;
          setTime(cur || 0);
          setDuration(dur || 0);
        // eslint-disable-next-line no-unused-vars
        } catch (e) {
          // ignore
        }
      }
    }

    t = setInterval(update, 500);
    return () => clearInterval(t);
  }, [voiceSrc, isPlaying, duration]);

  function playVoice(src) {
    console.log("playVoice ->", src);
    setVideoOnly(false);
    setVoiceSrc(src);
    setInstSrc("");
    setTime(0);
    setPlaying(true);

    // Fallback immediate HTMLAudio playback to satisfy browser user-gesture policies
    try {
      // remove listeners from previous audio
      if (htmlAudioRef.current) {
        try {
          const prev = htmlAudioRef.current;
          if (prev._onTime) prev.removeEventListener('timeupdate', prev._onTime);
          if (prev._onLoaded) prev.removeEventListener('loadedmetadata', prev._onLoaded);
          prev.pause();
        } catch (err) { console.warn('pause fallback error', err); }
      }

      const a = new Audio(src);
      a.preload = "auto";
      a.volume = volume;

      // attach listeners to update hook state directly from HTMLAudio
      a._onTime = () => { setTime(a.currentTime); };
      a._onLoaded = () => { setDuration(a.duration || 0); };
      a.addEventListener('timeupdate', a._onTime);
      a.addEventListener('loadedmetadata', a._onLoaded);

      htmlAudioRef.current = a;
      // direct play as part of click handler
      a.play().catch((err) => console.warn("htmlAudio play error", err));
    } catch (err) {
      console.warn('playVoice fallback error', err);
    }
  }

  // Play a visible video while using HTMLAudio to play a separate audio track
  function playVideoWithAudio(videoUrl, audioUrl) {
    console.log("playVideoWithAudio ->", videoUrl, audioUrl);
    setVideoOnly(false);
    setVideoExternalAudio(true);
    setVoiceSrc(videoUrl); // this will make the UI render the video player
    setInstSrc("");
    setTime(0);
    setPlaying(true);

    // stop previous fallback audio instances
    try {
      if (htmlAudioRef.current) {
        try {
          const prev = htmlAudioRef.current;
          if (prev._onTime) prev.removeEventListener('timeupdate', prev._onTime);
          if (prev._onLoaded) prev.removeEventListener('loadedmetadata', prev._onLoaded);
          prev.pause();
        } catch (err) { console.warn('pause fallback error', err); }
      }

      if (audioUrl) {
        const a = new Audio(audioUrl);
        a.preload = 'auto';
        a.volume = volume;
        a._onTime = () => { setTime(a.currentTime); };
        a._onLoaded = () => { setDuration(a.duration || 0); };
        a.addEventListener('timeupdate', a._onTime);
        a.addEventListener('loadedmetadata', a._onLoaded);
        htmlAudioRef.current = a;
        a.play().catch((err) => console.warn('htmlAudio play error', err));
      }
    } catch (err) {
      console.warn('playVideoWithAudio fallback error', err);
    }
  }

  function playVideoOnly(videoUrl) {
    console.log('playVideoOnly ->', videoUrl);
    setVoiceSrc(videoUrl);
    setInstSrc('');
    setTime(0);
    setPlaying(true);
    setVideoOnly(true);
    setVideoExternalAudio(false);

    // stop any fallback audio
    try {
      if (htmlAudioRef.current) {
        try {
          const prev = htmlAudioRef.current;
          if (prev._onTime) prev.removeEventListener('timeupdate', prev._onTime);
          if (prev._onLoaded) prev.removeEventListener('loadedmetadata', prev._onLoaded);
          prev.pause();
        } catch (err) { console.warn('pause fallback error', err); }
        htmlAudioRef.current = null;
      }
      if (htmlInstAudioRef.current) {
        try {
          const prev = htmlInstAudioRef.current;
          if (prev._onTime) prev.removeEventListener('timeupdate', prev._onTime);
          if (prev._onLoaded) prev.removeEventListener('loadedmetadata', prev._onLoaded);
          prev.pause();
        } catch (err) { console.warn('pause fallback error', err); }
        htmlInstAudioRef.current = null;
      }
    } catch (err) {
      console.warn('playVideoOnly cleanup error', err);
    }
  }

  function playDual(vocal, instrumental) {
    console.log("playDual ->", vocal, instrumental);
    setVideoOnly(false);
    setVideoExternalAudio(false);
    setVoiceSrc(vocal);
    setInstSrc(instrumental || "");
    setTime(0);
    setPlaying(true);
    // try quick HTMLAudio play for vocal + instrumental as fallback
    try {
      if (htmlAudioRef.current) {
        try {
          const prev = htmlAudioRef.current;
          if (prev._onTime) prev.removeEventListener('timeupdate', prev._onTime);
          if (prev._onLoaded) prev.removeEventListener('loadedmetadata', prev._onLoaded);
          prev.pause();
        } catch (err) { console.warn('pause fallback error', err); }
      }
      if (htmlInstAudioRef.current) {
        try {
          const prev = htmlInstAudioRef.current;
          if (prev._onTime) prev.removeEventListener('timeupdate', prev._onTime);
          if (prev._onLoaded) prev.removeEventListener('loadedmetadata', prev._onLoaded);
          prev.pause();
        } catch (err) { console.warn('pause fallback error', err); }
      }

      const a = new Audio(vocal);
      a.preload = "auto";
      a.volume = vocalMuted ? 0 : volume;
      a._onTime = () => { setTime(a.currentTime); };
      a._onLoaded = () => { setDuration(a.duration || 0); };
      a.addEventListener('timeupdate', a._onTime);
      a.addEventListener('loadedmetadata', a._onLoaded);
      htmlAudioRef.current = a;
      a.play().catch((err) => console.warn("htmlAudio play error", err));

      if (instrumental) {
        const b = new Audio(instrumental);
        b.preload = "auto";
        b.volume = instMuted ? 0 : volume;
        b._onTime = () => { /* noop for inst */ };
        b._onLoaded = () => { /* noop */ };
        b.addEventListener('timeupdate', b._onTime);
        b.addEventListener('loadedmetadata', b._onLoaded);
        htmlInstAudioRef.current = b;
        b.play().catch((err) => console.warn("htmlInstAudio play error", err));
      }
    } catch (err) {
      console.warn('playDual fallback error', err);
    }
  }

  function pause() {
    setPlaying(false);
    if (htmlAudioRef.current) {
      try { htmlAudioRef.current.pause(); } catch (err) { console.warn('htmlAudio pause error', err); }
    }
    if (htmlInstAudioRef.current) {
      try { htmlInstAudioRef.current.pause(); } catch (err) { console.warn('htmlInstAudio pause error', err); }
    }
  }

  function play() {
    // resume existing fallback audio if present
    if (htmlAudioRef.current) {
      try {
        htmlAudioRef.current.play().catch((err) => console.warn('htmlAudio resume error', err));
      } catch (err) { console.warn('htmlAudio resume error', err); }
    }
    setPlaying(true);
  }

  function stop() {
    setPlaying(false);
    setTime(0);
    setVideoOnly(false);
    setVideoExternalAudio(false);
    if (voiceRef.current && typeof voiceRef.current.seekTo === "function") {
      voiceRef.current.seekTo(0);
    }
    if (instRef.current && typeof instRef.current.seekTo === "function") {
      instRef.current.seekTo(0);
    }
    setVoiceSrc("");
    setInstSrc("");
    if (htmlAudioRef.current) {
      try {
        const prev = htmlAudioRef.current;
        if (prev._onTime) prev.removeEventListener('timeupdate', prev._onTime);
        if (prev._onLoaded) prev.removeEventListener('loadedmetadata', prev._onLoaded);
        prev.pause();
      } catch (err) { console.warn('stop pause error', err); }
      htmlAudioRef.current = null;
    }
    if (htmlInstAudioRef.current) {
      try {
        const prev = htmlInstAudioRef.current;
        if (prev._onTime) prev.removeEventListener('timeupdate', prev._onTime);
        if (prev._onLoaded) prev.removeEventListener('loadedmetadata', prev._onLoaded);
        prev.pause();
      } catch (err) { console.warn('stop inst pause error', err); }
      htmlInstAudioRef.current = null;
    }
  }

  function seek(toSeconds) {
    if (voiceRef.current && typeof voiceRef.current.seekTo === "function") {
      voiceRef.current.seekTo(toSeconds, "seconds");
    }
    if (instRef.current && typeof instRef.current.seekTo === "function") {
      instRef.current.seekTo(toSeconds, "seconds");
    }
    if (htmlAudioRef.current) {
      try { htmlAudioRef.current.currentTime = toSeconds; } catch (err) { console.warn('htmlAudio seek error', err); }
    }
    if (htmlInstAudioRef.current) {
      try { htmlInstAudioRef.current.currentTime = toSeconds; } catch (err) { console.warn('htmlInstAudio seek error', err); }
    }
    setTime(toSeconds);
  }

  // Called from ReactPlayer onProgress
  function handleProgress(state) {
    if (state && typeof state.playedSeconds === "number") {
      setTime(state.playedSeconds);
    }
  }

  // Called from ReactPlayer onDuration
  function handleDuration(d) {
    if (typeof d === "number") setDuration(d);
  }

  function changeVolume(v) {
    setVolume(v);
    if (htmlAudioRef.current) {
      try { htmlAudioRef.current.volume = v; } catch (err) { console.warn('volume set error', err); }
    }
    if (htmlInstAudioRef.current) {
      try { htmlInstAudioRef.current.volume = v; } catch (err) { console.warn('inst volume set error', err); }
    }
  }

  function setVocalMuted(m) {
    setVocalMutedState(m);
    if (htmlAudioRef.current) {
      try { htmlAudioRef.current.volume = m ? 0 : volume; } catch (err) { console.warn('setVocalMuted error', err); }
    }
  }

  function setInstMuted(m) {
    setInstMutedState(m);
    if (htmlInstAudioRef.current) {
      try { htmlInstAudioRef.current.volume = m ? 0 : volume; } catch (err) { console.warn('setInstMuted error', err); }
    }
  }

  return {
    voiceRef,
    instRef,
    voiceSrc,
    instSrc,
    isPlaying,
    playVoice,
    playVideoWithAudio,
    playVideoOnly,
    playDual,
    pause,
    play,
    stop,
    time,
    duration,
    seek,
    volume,
    changeVolume,
    handleProgress,
    handleDuration,
    vocalMuted,
    instMuted,
    setVocalMuted,
    setInstMuted,
    videoOnly,
    setVideoOnly,
    videoExternalAudio,
    setVideoExternalAudio,
  };
}
