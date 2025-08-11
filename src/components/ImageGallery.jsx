import React, { useState } from 'react';
import 'aframe';

const ImageGallery = ({ images, audios, position, rotation, closeFunction }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handlers for navigation
  const handleNext = () => {
    var audio = new Audio('click.wav');
    audio.play();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    var audio = new Audio('click.wav');
    audio.play();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Get the 3 thumbnail images to show (current + next 2)
  const getThumbnailImages = () => {
    const thumbnails = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % images.length;
      thumbnails.push({
        src: images[index],
        index: index,
        isCurrent: i === 0
      });
    }
    return thumbnails;
  };

  return (
    <>
      {currentIndex !== null && (
        <a-entity key={currentIndex} position={position} rotation={rotation}>
          {/* Main Large Image Display */}
          <a-plane
            src={images[currentIndex]}
            position="0 0 0"
            rotation="0 0 0"
            scale="1.3 1.3 1.3"
            transparent="true"
            material="shader: flat"
          ></a-plane>

          {/* Navigation and Thumbnails */}
          {images.length > 1 && (
            <a-entity position="0 -0.7 0">
              {/* Previous Button */}
              <a-plane
                src="#prev"
                class="clickable"
                position="-0.5 -0.1 0"
                width="0.15"
                height="0.15"
                onClick={handlePrev}
                transparent="true"
                material="shader: flat"
              ></a-plane>

              {/* Next Button */}
              <a-plane
                src="#next"
                class="clickable"
                position="0.5 -0.1 0"
                width="0.15"
                height="0.15"
                onClick={handleNext}
                transparent="true"
                material="shader: flat"
              ></a-plane>

              {/* Thumbnail Row - 3 images */}
              <a-entity position="0 -0.1 0">
                {getThumbnailImages().map((thumb, index) => (
                  <a-plane
                    key={thumb.index}
                    src={thumb.src}
                    position={`${(index - 1) * 0.25} 0 0`}
                    width={thumb.isCurrent ? "0.22" : "0.18"}
                    height={thumb.isCurrent ? "0.22" : "0.18"}
                    transparent="true"
                    material="shader: flat"
                    class={thumb.isCurrent ? "current-thumbnail" : "thumbnail"}
                  ></a-plane>
                ))}
              </a-entity>
            </a-entity>
          )}
        </a-entity>
      )}
    </>
  );
};

export default ImageGallery;
