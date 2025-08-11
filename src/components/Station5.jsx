import React from 'react';
import ImageGallery from './ImageGallery.jsx';
import content from '../content.json';

const Station5 = ({ position }) => {
  return (
    <a-entity id="station-5" position={position} scale-animator="duration: 500; easing: easeInOutCubic">
      <ImageGallery
        id='gallery-2'
        images={content.memory.map(card => `#${card.id}`)}
        audios={content.audios.map(audio => `${audio.src}`)}
        position="0 0 0"
        rotation="0 0 0"
        closeFunction={() => {}}
      />
    </a-entity>
  );
};

export default Station5;
