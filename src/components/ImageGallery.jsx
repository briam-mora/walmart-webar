import React, { useState } from 'react';
import 'aframe';

const ImageGallery = ({ images, audios, position, rotation, closeFunction }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handlers for navigation
  const handleNext = () => {
    var audio = new Audio('click.wav');
    // if (audios) audio = new Audio(audios[currentIndex + 1]);
    audio.play();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    var audio = new Audio('click.wav');
    audio.play();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleClose = () => {
    closeFunction();
  };

  return (
    <>
      {currentIndex !== null && (
        <a-entity key={currentIndex} position={position} rotation={rotation}>
          {/* Image Display */}
          <a-plane
            src={images[currentIndex]}
            position="0 0 0"
            rotation="0 0 0"
            scale="1 1 1"
            scale-animator="duration: 500; easing: easeInOutCubic"
            transparent="true"
            material="shader: flat"
          ></a-plane>

          {/* Navigation Buttons */}
          {images.length > 1 && <a-entity position="0 -0.7 0">
            {/* Image Indicator Dots */}
            <a-entity position="0 0.15 0">
              {images.map((_, index) => (
                <a-circle
                  key={index}
                  position={`${index * 0.1 - ((images.length - 1) * 0.1) / 2} 0 0`}
                  radius="0.02"
                  color={index === currentIndex ? '#FFD200' : '#EC1C24' }
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
      )}
    </>
  );
};

export default ImageGallery;
