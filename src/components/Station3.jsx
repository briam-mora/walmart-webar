import React, { useEffect } from 'react';
import ImageGallery from './ImageGallery.jsx';
import content from '../content.json';
import { useAudio } from '../contexts/AudioContext.jsx';

const Station3 = ({ position }) => {
  const { playAudio } = useAudio();

  // Play intro audio when station opens
  useEffect(() => {
    playAudio('intro_station_3');
  }, [playAudio]);

  return (
    <a-entity
      id="station-3"
      class="clickable"
      position={position}
      scale="1 1 1"
      scale-animator="duration: 500; easing: easeInOutCubic"
    >
      <ImageGallery
          id='gallery-1'
          images={content.images.map(image => `#${image.id}`)}
          audios={content.audios.station_3.map(audio => `${audio.src}`)}
          autoPlayFirstAudio={false}
      />
    </a-entity>
  );
};

export default Station3;
