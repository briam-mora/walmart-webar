import React, { useEffect } from 'react';
import ImageGallery from './ImageGallery.jsx';
import content from '../content.json';
import { useAudio } from '../contexts/AudioContext.jsx';

const Station5 = ({ position }) => {
  const { playAudio } = useAudio();

  // Play intro audio when station opens
  useEffect(() => {
    playAudio('plataforma_1_sound');
  }, [playAudio]);

  return (
    <a-entity id="station-5" position={position} scale-animator="duration: 500; easing: easeInOutCubic">
      <ImageGallery
        id='gallery-2'
        images={content.plataforma.map(card => `#${card.id}`)}
        audios={content.audios.station_5.map(audio => `${audio.src}`)}
        position="0 0 0"
        rotation="0 0 0"
        closeFunction={() => {}}
      />
    </a-entity>
  );
};

export default Station5;
