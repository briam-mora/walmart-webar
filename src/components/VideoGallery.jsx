import React, { useEffect, useRef, useState } from 'react';
import 'aframe';

const VideoGallery = ({ titleSrc, videos, position, rotation, scale, closeFunction, titleSrcScale = "0.9 0.18 1" }) => {
  const videoRef = useRef(null); // Reference to the video element

  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(videos[0].autoPlay);

  // Handlers for navigation
  const handleNext = () => {
    var audio = new Audio('click.wav');
    audio.play();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const handlePrev = () => {
    var audio = new Audio('click.wav');
    audio.play();
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
        var audio = new Audio('activacion_video.wav');
        audio.play();
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
      <a-plane
        src={titleSrc}
        position="0 0.95 0"
        scale={titleSrcScale}
        transparent="true"
        material="shader: flat"
        scale-animator="duration: 500; easing: easeInOutCubic"
        hover-animator="duration: 2000; easing: easeInOutQuad; distance: 0.02"
      ></a-plane>

      {/* Video */}
      <a-video
        class={videos[currentIndex].autoPlay ? "" : "clickable"}
        src={videos[currentIndex].src}
        width="9"
        height="16"
        position="0 0 0"
        scale-animator="duration: 500; easing: easeInOutCubic"
        onClick={handleVideoClick}
        scale="0.1 0.1 0.1"
      ></a-video>

      {!playing && <a-plane
        position="0 0 0.01"
        opacity="0.5"
        scale="0.9 1.6 1"
      ></a-plane>}
      {!playing && <a-plane
        src="#play-button"
        position="0 0 0.02"
        transparent="true"
        scale="0.2 0.2 0.2"
        scale-animator="duration: 500; easing: easeInOutCubic"
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
              color={index === currentIndex ? '#2D387F' : '#9BD7E1'}
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
