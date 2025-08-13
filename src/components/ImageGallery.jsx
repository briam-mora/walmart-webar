import React, { useState, useEffect } from 'react';
import 'aframe';
import { useAudio } from '../contexts/AudioContext.jsx';

const ImageGallery = ({ images, audios, position, rotation, autoPlayFirstAudio = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { playAudioFile } = useAudio();

  // Auto-play first audio only if explicitly requested
  useEffect(() => {
    if (autoPlayFirstAudio && audios && audios.length > 0 && audios[0]) {
      playAudioFile(audios[0]);
    }
  }, [audios, playAudioFile, autoPlayFirstAudio]);

  // Handlers for navigation
  const handleNext = () => {
    playAudioFile('click.wav');
    
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    
    // Play corresponding audio if available
    if (audios && audios[nextIndex]) {
      playAudioFile(audios[nextIndex]);
    }
  };

  const handlePrev = () => {
    playAudioFile('click.wav');
    
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex);
    
    // Play corresponding audio if available
    if (audios && audios[prevIndex]) {
      playAudioFile(audios[prevIndex]);
    }
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
