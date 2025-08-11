import React from 'react';
import ImageGallery from './ImageGallery.jsx';
import content from '../content.json';

const Station5 = ({ position }) => {
  return (
    <a-entity id="station-5" position={position} scale-animator="duration: 500; easing: easeInOutCubic">
      <ImageGallery
          id='gallery-2'
          images={content.images.map(image => `#${image.id}`)}
          audios={content.audios.map(audio => `${audio.src}`)}
      />
    </a-entity>
  );
};

export default Station5;
