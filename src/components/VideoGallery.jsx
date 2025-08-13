import React, { useEffect, useRef, useState } from 'react';
import 'aframe';
import { useAudio } from '../contexts/AudioContext.jsx';

const VideoGallery = ({ videos, position, rotation, scale, closeFunction, width, height }) => {
  const videoRef = useRef(null); // Reference to the video element
  const { playAudioFile } = useAudio();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(videos[0].autoPlay);

  // Handlers for navigation
  const handleNext = () => {
    playAudioFile('click.wav');
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const handlePrev = () => {
    playAudioFile('click.wav');
    setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  };

  const handleClose = () => {
    closeFunction();
  };

  // Toggle video playback on click
  const handleVideoClick = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (videoElement.paused) {
        setPlaying(true)
        videoElement.play();
        playAudioFile('activacion_video.wav');
      } else {
        setPlaying(false)
        videoElement.pause();
      }
    }
  };

  useEffect(() => {
    // Ensure the video is loaded and set up
    const videoElement = document.querySelector(videos[currentIndex].src);
    if (videoElement) {
      videoRef.current = videoElement;
      videoElement.currentTime = 0;
      videoElement.removeAttribute("loop");
      // Only autoplay if user has interacted with the page
      if (playing) {
        videoElement.play().catch(error => {
          // Silently handle autoplay failure
          console.log('Autoplay blocked:', error.message);
        });
      }
    }
  }, [currentIndex, playing]);

  return (
    currentIndex !== null && <a-entity
      key={currentIndex}
      position={position}
      rotation={rotation}
      scale={scale}
    >

      {/* Video */}
      <a-video
        class={videos[currentIndex].autoPlay ? "" : "clickable"}
        src={videos[currentIndex].src}
        width={width}
        height={height}
        position="0 0 0"
        onClick={handleVideoClick}
        scale="0.1 0.1 0.1"
        transparent="true"
        material="shader: flat; transparent: true; alphaTest: 0.1"
      ></a-video>

      {/* Play Button (only when video is not playing) */}
      {!playing && <a-plane
        src="#play-button"
        position="0 0 0.01"
        transparent="true"
        scale="0.2 0.2 0.2"
        scale-animator="duration: 500; easing: easeInOutCubic"
        material="shader: flat"
      ></a-plane>}

      {/* Navigation Buttons */}
      {videos.length > 1 && <a-entity position="0 -1 0">
        {/* Image Indicator Dots */}
        <a-entity position="0 0.15 0">
          {videos.map((_, index) => (
            <a-circle
              key={index}
              position={`${index * 0.1 - ((videos.length - 1) * 0.1) / 2} 0 0`}
              radius="0.02"
              color={index === currentIndex ? '#ffc21f' : '#75b52a'}
            ></a-circle>
          ))}
        </a-entity>
        {/* Previous Button */}
        <a-plane
          src="#prev"
          class="clickable"
          position="-0.2 0 0"
          width="0.2"
          height="0.2"
          onClick={handlePrev}
          scale-animator="duration: 500; easing: easeInOutCubic"
          transparent="true"
          material="shader: flat"
        >
        </a-plane>

        {/* Next Button */}
        <a-plane
          src="#next"
          class="clickable"
          position="0.2 0 0"
          width="0.2"
          height="0.2"
          onClick={handleNext}
          scale-animator="duration: 500; easing: easeInOutCubic"
          transparent="true"
          material="shader: flat"
        >
        </a-plane>

        {/* Close Button */}
        <a-plane
          src="#close"
          class="clickable"
          position="0 0 0"
          width="0.1"
          height="0.1"
          onClick={handleClose}
          scale-animator="duration: 500; easing: easeInOutCubic"
          transparent="true"
          material="shader: flat"
        >
        </a-plane>
      </a-entity>}
    </a-entity>
  );
};

export default VideoGallery;
