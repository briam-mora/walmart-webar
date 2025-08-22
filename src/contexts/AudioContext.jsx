import React, { createContext, useContext, useRef, useCallback } from 'react';

const AudioContext = createContext();

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  const currentAudioRef = useRef(null);
  const currentAudioObjectRef = useRef(null);

  const playAudio = useCallback((audioId, nonBlocking = false) => {
    // If nonBlocking is true, don't stop current audio
    if (!nonBlocking) {
      // Stop current audio if playing
      if (currentAudioRef.current && currentAudioRef.current !== audioId) {
        const currentAudio = document.getElementById(currentAudioRef.current);
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
      }

      // Stop current Audio object if playing
      if (currentAudioObjectRef.current) {
        currentAudioObjectRef.current.pause();
        currentAudioObjectRef.current.currentTime = 0;
        currentAudioObjectRef.current = null;
      }
    }

    // Play new audio
    const audio = document.getElementById(audioId);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.log('Audio play failed:', e));
      // Only update currentAudioRef if not nonBlocking
      if (!nonBlocking) {
        currentAudioRef.current = audioId;
      }
    }
  }, []);

  const playAudioFile = useCallback((audioSrc) => {
    // Stop current audio if playing
    if (currentAudioRef.current) {
      const currentAudio = document.getElementById(currentAudioRef.current);
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      currentAudioRef.current = null;
    }

    // Stop current Audio object if playing
    if (currentAudioObjectRef.current) {
      currentAudioObjectRef.current.pause();
      currentAudioObjectRef.current.currentTime = 0;
    }

    // Play new audio file
    const audio = new Audio(audioSrc);
    audio.play().catch(e => console.log('Audio play failed:', e));
    currentAudioObjectRef.current = audio;
  }, []);

  const stopAllAudio = useCallback(() => {
    if (currentAudioRef.current) {
      const currentAudio = document.getElementById(currentAudioRef.current);
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      currentAudioRef.current = null;
    }

    if (currentAudioObjectRef.current) {
      currentAudioObjectRef.current.pause();
      currentAudioObjectRef.current.currentTime = 0;
      currentAudioObjectRef.current = null;
    }
  }, []);

  const value = {
    playAudio,
    playAudioFile,
    stopAllAudio
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};
